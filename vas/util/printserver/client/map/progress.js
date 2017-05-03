
/* global ol */

/**
 * Renders a progress bar.
 * @param {object} oPrintMap The map object
 * @param {boolean} bDisplayProgress true to display the progress percentage
 * @constructor
 */
function Progress(oPrintMap, bDisplayProgress) {

    /**
     * Temps pendant lequel l'égalité entre les couches à charger et les couches chargées doit être respectée
     */
    this.equalityTimeout = (isDef(window.oProperties.print.equality_timeout)) ? window.oProperties.print.equality_timeout : 3000;

    callLog('this.equalityTimeout: ' + this.equalityTimeout);

    this.updateCounter = 0;

    this.bDisplayProgress = bDisplayProgress;

    this.map = oPrintMap.map;

    this.layers = this.map.getLayers().getArray();

    this.mapSize = this.map.getSize();

    this.loading = 0;

    this.loaded = 0;

    this.totalTiles = this.getTotalTiles();

    callLog("this.totalTiles: " + this.totalTiles);

    this.followLayersProgress();
}

/**
 * Init following the layers progress
 */
Progress.prototype.followLayersProgress = function () {
    var this_ = this;
    for (var i = 0; i < this.layers.length; i++) {
        var source = this.layers[i].getSource();

        source.on('tileloadstart', function () {
            this_.addLoading();
        });

        source.on('tileloadend', function () {
            this_.addLoaded();
        });

        source.on('tileloaderror', function () {
            this_.addLoaded();
        });

        delete source;
    }
    this.update();
};

/**
 * Get the number of tiles on the map
 */
Progress.prototype.getTotalTiles = function () {

    var totalTiles = 0;
    var tileGrid;

    for (var i = 0; i < this.layers.length; i++) {

        var layer = this.layers[i];

        if (goog.isDefAndNotNull(layer.getSource().getTileGrid)) {
            tileGrid = layer.getSource().getTileGrid();
        }else{
            tileGrid = null;
        }

        if (tileGrid === null) {
            callLog('tileGrid = null');
            continue;
        }
        if (!layer.getVisible()) {
            continue;
        }

        var sourceTileSize;

        if (tileGrid instanceof ol.tilegrid.WMTS) {
            var z = tileGrid.getZForResolution(this.map.getView().getResolution());
            sourceTileSize = tileGrid.getTileSize(z);
        } else {
            sourceTileSize = tileGrid.getTileSize();
        }

        var xTilesCount = 1;
        var yTilesCount = 1;
        var bCustomTileGrid = true;

        if (typeof sourceTileSize === 'number') {
            bCustomTileGrid = false;
            sourceTileSize = [sourceTileSize, sourceTileSize];
        }

        if (sourceTileSize[0] < this.mapSize[0])
            var xTilesCount = Math.ceil(this.mapSize[0] / sourceTileSize[0]);

        if (sourceTileSize[1] < this.mapSize[1])
            var yTilesCount = Math.ceil(this.mapSize[1] / sourceTileSize[1]);

        totalTiles += xTilesCount * yTilesCount;

        // Si un taileGrid a été redéfini, alors OL charge les tuiles de gauche (chose que je ne compren pas)
        if (bCustomTileGrid)
            totalTiles += yTilesCount;

        delete sourceTileSize;
        delete xTilesCount;
        delete yTilesCount;
        delete bCustomTileGrid;
    }

    return totalTiles;
};

/**
 * Increment the count of loading tiles.
 */
Progress.prototype.addLoading = function () {
    ++this.loading;
    this.update();
};

/**
 * Increment the count of loaded tiles.
 */
Progress.prototype.addLoaded = function () {
    var this_ = this;
    setTimeout(function () {
        ++this_.loaded;
        this_.update();
    }, 100);
};

/**
 * Update the progress bar.
 */
Progress.prototype.update = function () {

    var this__ = this;

    var percent = (this.loaded / this.totalTiles * 100).toFixed(1);

    if (this.bDisplayProgress)
        callLog(percent + '%');

    this.updateCounter++;
    var tmpCounter = this.updateCounter;

    if (this.loaded >= this.loading) {

        setTimeout(function () {

            if (tmpCounter === this__.updateCounter) {
                callLog("this.loaded: " + this__.loaded);
                this.loading = 0;
                this.loaded = 0;
                var this_ = this;
                tryCallPhantom({'cmd': 'tilesLoadEnd'});
            }

        }, this.equalityTimeout);
    }
};

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

    this.map = oPrintMap.map;

    callLog("this.totalTiles: " + this.totalTiles);

    this.followLayersProgress();
}

/**
 * Init following the layers progress
 */
Progress.prototype.followLayersProgress = function () {
    var this_ = this;
    this.map.on('postrender', function () {
        setTimeout(function () {
            if (this_.map.tileQueue_.tilesLoading_ === 0) {
                tryCallPhantom({'cmd': 'tilesLoadEnd'});
            }
        }, this_.equalityTimeout);
    });
};

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

    this.map = oPrintMap.map;

    this.followLayersProgress();
}

/**
 * Init following the layers progress
 */
Progress.prototype.followLayersProgress = function () {
    var this_ = this;
    var iLastPostRender = 0;

    this.map.on('postrender', function () {

        // Vérification dernier postrender
        var iCurrentPostRender = Number(iLastPostRender + 1);

        // Vérification tuiles
        callLog("this_.map.tileQueue_.tilesLoading_: " + this_.map.tileQueue_.tilesLoading_);
        if (this_.map.tileQueue_.tilesLoading_ === 0) {
            setTimeout(function () {
                if (this_.map.tileQueue_.tilesLoading_ === 0) {
                    callLog("tiles loaded: " + this_.map.tileQueue_.tilesLoading_);

                    // Vérification dernier postrender
                    if (iLastPostRender === iCurrentPostRender) {
                        callLog("postrender END");
                        tryCallPhantom({'cmd': 'tilesLoadEnd'});
                    }

                    // Prévient les cas de non retour
                    setTimeout(function () {
                        tryCallPhantom({'cmd': 'tilesLoadEnd'});
                    }, this_.equalityTimeout * 5);
                }
            }, this_.equalityTimeout);
        }

        // Vérification dernier postrender
        iLastPostRender++;
    });
};
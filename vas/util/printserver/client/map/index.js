/* global ol, nsUtils */

/**
 * Initialize the map
 * @param {object} opt_options
 * @param {string} opt_options.token
 * @param {string} opt_options.apiUrl
 * @param {string} opt_options.mapId
 * @param {string} opt_options.mapJSON
 * @param {array} opt_options.extent
 * @param {array} opt_options.features
 */
var initMap = function (opt_options) {

    callLog('test');
    
    // Convertit en float l'étendue
    if (isDef(opt_options.extent)) {
        for (var i = 0; i < opt_options.extent.length; i++) {
            opt_options.extent[i] = parseFloat(opt_options.extent[i]);
        }
    }

    if (!isDef(opt_options.apiUrl)) {
        callError('opt_options.apiUrl not defined');
    }
    if (!isDef(opt_options.token)) {
        callError('opt_options.token not defined');
    }
    if (!isDef(opt_options.mapId) && !isDef(opt_options.mapJSON)) {
        callError('neither opt_options.mapId nor opt_options.mapJSON defined');
    }
    if (!isDef(opt_options.extent) && !isDef(opt_options.features)) {
        callError('neither opt_options.extent nor opt_options.features defined');
    }
    

    window.oProperties = new nsUtils.Properties(opt_options.apiUrl, opt_options.token);

    // Ajoute la définition OpenLayers des projections 
    window.projections = new Projections();

    callLog('opt_options.resolutionCoeff: ' + opt_options.resolutionCoeff);

    // Initialise la carte
    window.oPrintMap = new PrintMap({
        mapId: opt_options.mapId,
        mapJSON: opt_options.mapJSON,
        extent: opt_options.extent,
        features: opt_options.features,
        featuresZoom: opt_options.featuresZoom,
        resolutionCoeff: opt_options.resolutionCoeff,
        apiUrl: opt_options.apiUrl,
        token: opt_options.token
    });

    // Initialise la progression (timeout 100 le temps que la carte soit définie)
    setTimeout(function () {
        window.oProgress = new Progress(window.oPrintMap, opt_options['displayProgress']);
    }, 100);

};
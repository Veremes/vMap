/* global phantom */

/**
 * @author: Armand Bahi
 * @Description: Fichier PhantomJS permettant d'imprimer une carte donnée au format png
 */

var page = require('webpage').create();
var system = require('system');
var fs = require('fs');

page.onError = function (msg, trace) {
    console.log(msg);
    trace.forEach(function (item) {
        console.log('  ', item.file, ':', item.line);
    });
};

if (system.args.length < 11) {
    console.log('Usage: [printmap.js PrintClientURL APIRestUrl Token OutputFileName MapId MapJSON ImageSize MapExtent Features sFeaturesZoom ResolutionCoeff Quality]');
    phantom.exit(1);
} else {

    for (var i = 0; i < system.args.length; i++) {
        console.log("args[" + i + "]: ", system.args[i]);
    }

    var abordTimeout = 5 * 60 * 1000;
//    var abordTimeout = 10000;


    var sPrintClientURL = system.args[1];
    var sApiRestUrl = system.args[2];
    var sToken = system.args[3];
    var sOutputFileName = system.args[4];
    var sMapId = system.args[5];
    var sMapJson = system.args[6];
    var aImageSize = system.args[7].split('|');
    var aMapExtent = system.args[8].split('|');
    var sFeatures = system.args[9];
    var sFeaturesZoom = system.args[10];
    var sResolutionCoeff = system.args[11];
    var sQuality = system.args[12];
    
    

    // Si sMapJson est un fichier
    var oMapJson = null;
    if (fs.exists(sMapJson)) {
        sMapJson = fs.read(sMapJson);
    }
    if (typeof sMapJson === 'string' && sMapJson.length > 5) {
        try {
            oMapJson = JSON.parse(sMapJson);
        } catch (e) {
            oMapJson = null;
        }
    }
    if (typeof sMapJson === 'object') {
        oMapJson = sMapJson;
    }

    // Si sFeatures est un fichier
    if (fs.exists(sFeatures)) {
        sFeatures = fs.read(sFeatures);
    }
    var aFeatures = sFeatures.split('|');
    

    page.viewportSize = {width: aImageSize[0], height: aImageSize[1]};

    page.open(sPrintClientURL, function (status) {

        if (status !== 'success') {
            console.log('Unable to load the sPrintClientURL, status:', status);
            phantom.exit(1);
        } else {

            /**
             * Render the target from page at the given sQuality
             * @param {number} sQuality Specify 0 to obtain small compressed files, 100 for large 
             * @param {string} sOutputFileName file name
             * @returns {boolean}
             */
            var renderPage = function (sQuality, sOutputFileName) {
                var done = page.render(sOutputFileName, {format: 'jpeg', quality: sQuality});
                return done;
            };

            // Récuprère les messages envoyés par le client
            page.onCallback = function (data) {
                var cmd = data['cmd'];
                if (cmd === 'tilesLoadEnd') {
                    var done = renderPage(sQuality, sOutputFileName);
                    if (done) {
                        console.log("Done");
                    } else {
                        console.log("Error while saving the image");
                    }
                    phantom.exit();
                } else if (cmd === 'setScale') {
                    if (typeof data['scale'] !== undefined) {
                        console.log('scale', data['scale']);
                    }
                } else if (cmd === 'error') {
                    if (typeof data['message'] !== undefined) {
                        console.log(data['message']);
                    }
                    phantom.exit();
                } else if (cmd === 'consoleLog') {
                    if (typeof data['message'] !== undefined) {
                        console.log(data['message']);
                    }
                }
            };

            var mapOptions = {
                'token': sToken,
                'apiUrl': sApiRestUrl,
                'mapId': sMapId,
                'mapJSON': oMapJson,
                'extent': aMapExtent,
                'features': aFeatures,
                'featuresZoom': sFeaturesZoom,
                'resolutionCoeff': sResolutionCoeff,
                'displayProgress': false
            };
            
//            console.log('token: ', mapOptions.token);
//            console.log('apiUrl: ', mapOptions.apiUrl);
//            console.log('mapId: ', mapOptions.mapId);
//            console.log('mapJSON: ', mapOptions.mapJSON);
//            console.log('extent: ', mapOptions.extent);
//            console.log('features: ', mapOptions.features);
//            console.log('featuresZoom: ', mapOptions.featuresZoom);
//            console.log('resolutionCoeff: ', mapOptions.resolutionCoeff);
//            console.log('displayProgress: ', mapOptions.displayProgress);

            // Initialize the map with the given params
            page.evaluate(function (mapOptions) {
                initMap(mapOptions);
            }, mapOptions);

            // Si rien n'a été fait en 5 minutes, alors exit()
            setTimeout(function () {
                var done = page.render(sOutputFileName, {format: 'jpeg', sQuality: sQuality});
                phantom.exit();
            }, abordTimeout);
        }
    });
}
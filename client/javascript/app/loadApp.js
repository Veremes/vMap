/* global goog, oApplicationFiles */

'use strict';

goog.provide('vitis.loadApp');
goog.require('vitis.loadExternalFiles');
goog.require('vitis.application.config');

// Affiche le loader ajax.
showAjaxLoader();

// Charge les css de l'application.
loadExternalCss(oApplicationFiles["css"]);
if (goog.isDefAndNotNull(oApplicationFiles["css_mobile"]) && oClientProperties['is_mobile']) {
    loadExternalCss(oApplicationFiles["css_mobile"]);
}
// Fichiers js à charger. Si mode = debug : charge tous les js d'Angular (contrôleurs, directives...) de tous les modules de l'appli.
var aAngularJsFiles = oApplicationFiles["js"]["externs"];
// Chargement des fichiers js de l'application.
loadExternalJs(aAngularJsFiles, {
    "async": false,
    "scriptInBody": true,
    "callback": function () {
        // Bootstrapping dès le chargement de tous les js.
        // BUG IE : certains fichiers de directives sont chargés après.
        if (sessionStorage['debug'] == "true") {
            var iIntervalId = setInterval(function(){
                if (typeof(vitisApp.appInitDrtv) != "undefined" && typeof(vitisApp.appLoginDrtv) != "undefined") {
                    clearInterval(iIntervalId);
                    angular.bootstrap(document, ['vitisApp']);
                }
            }, 100);
        }
        else
            angular.bootstrap(document, ['vitisApp']);
    }
});

// Lors du click sur 'echap', désactive la modale de chargement
$(document).keydown(function (e) {
    if (e.keyCode === 27) {
        hideAjaxLoader();
    }
});

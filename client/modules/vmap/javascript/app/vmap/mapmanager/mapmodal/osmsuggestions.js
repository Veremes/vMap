/* global goog, nsVmap, oVmap */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.nsMapModal.OSMSuggestions
 * cette classe permet d'afficher les suggestions osm'
 */

goog.provide('nsVmap.nsMapManager.nsMapModal.OSMSuggestions');

goog.require('oVmap');

/**
 * @classdesc
 * Class {@link nsVmap.nsMapManager.nsMapModal.OSMSuggestions}: load the map list suggestions
 *
 * @constructor
 * @export
 */
nsVmap.nsMapManager.nsMapModal.OSMSuggestions = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.OSMSuggestions");
};

/************************************************
 ---------- DIRECTIVES AND CONTROLLERS -----------
 *************************************************/
/**
 * map list directive
 * @return {angular.Directive} The directive specs.
 * @export
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.OSMSuggestions.prototype.osmsuggestionsDirective = function () {
    oVmap.log("nsVmap.osmsuggestionsDirective");
    return {
        restrict: 'E',
        scope: {
            'map': '=appMap',
            'lang': '=appLang'
        },
        controller: 'AppOsmsuggestionsController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/layers/mapmodal/osmsuggestions.html'
    };
};

/**
 * map list controller
 * @export
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.OSMSuggestions.prototype.osmsuggestionsController = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.OSMSuggestions.osmsuggestionsController");

    /**
     * The maps catalog
     * @type {object}
     * @api stable
     */
    this.catalog = this['catalog'] = oVmap.getMapManager().getMapModalTool().getMapCatalog();
    /**
     * The current projection
     * @type {object}
     * @api stable
     */
    this.projection = this['projection'] = oVmap.getMap().getOLMap().getView().getProjection().getCode();

    this['properties'] = oVmap['properties'];

    this['sLayerName'] = '';
    this['sLayerUrl'] = '';

};

/**
 * Add the layer
 * @export
 */
nsVmap.nsMapManager.nsMapModal.OSMSuggestions.prototype.osmsuggestionsController.prototype.addLayer = function (oLayerOptions) {
    oVmap.log('nsVmap.nsMapManager.nsMapModal.OSMSuggestions.prototype.osmsuggestionsController.prototype.addLayer');

    var sName;
    var sUrl;

    if (goog.isDefAndNotNull(oLayerOptions)) {
        sName = oLayerOptions['name'];
        sUrl = oLayerOptions['url'];
    } else {
        sName = this['sLayerName'];
        sUrl = this['sLayerUrl'];
    }

    if (!goog.isString(sName) || sName === '') {
        $.notify('Informations manquantes: Nom', 'error');
        return;
    }

    var oLayer = {};
    oLayer.url = sUrl;
    oLayer.layerType = "osm";
    oLayer.serviceName = 'Open Street Map';
    oLayer.layerTitle = sName;

    oVmap.getMapManager().addLayer(oLayer);
};

/**
 * reload variables
 * @export
 */
nsVmap.nsMapManager.nsMapModal.OSMSuggestions.prototype.osmsuggestionsController.prototype.reload = function () {

    this.catalog = this['catalog'] = oVmap.getMapManager().getMapModalTool().getMapCatalog();
    this.projection = this['projection'] = oVmap.getMap().getOLMap().getView().getProjection().getCode();
};

// Définit la directive et le controller
oVmap.module.directive('appOsmsuggestions', nsVmap.nsMapManager.nsMapModal.OSMSuggestions.prototype.osmsuggestionsDirective);
oVmap.module.controller('AppOsmsuggestionsController', nsVmap.nsMapManager.nsMapModal.OSMSuggestions.prototype.osmsuggestionsController);
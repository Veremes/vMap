/* global goog, nsVmap, oVmap, this */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.nsMapModal.XYZSuggestions
 * cette classe permet d'afficher les suggestions xyz'
 */

goog.provide('nsVmap.nsMapManager.nsMapModal.XYZSuggestions');

goog.require('oVmap');

/**
 * @classdesc
 * Class {@link nsVmap.nsMapManager.nsMapModal.XYZSuggestions}: load the map list suggestions
 *
 * @constructor
 * @export
 */
nsVmap.nsMapManager.nsMapModal.XYZSuggestions = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.XYZSuggestions");
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
nsVmap.nsMapManager.nsMapModal.XYZSuggestions.prototype.xyzsuggestionsDirective = function () {
    oVmap.log("nsVmap.xyzsuggestionsDirective");
    return {
        restrict: 'E',
        scope: {
            'map': '=appMap',
            'lang': '=appLang'
        },
        controller: 'AppXyzsuggestionsController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/layers/mapmodal/xyzsuggestions.html'
    };
};

/**
 * map list controller
 * @export
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.XYZSuggestions.prototype.xyzsuggestionsController = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.XYZSuggestions.xyzsuggestionsController");

    this['properties'] = oVmap['properties'];
    /**
     * The maps catalog
     * @type {object}
     * @api stable
     */
    this['catalog'] = oVmap.getMapManager().getMapModalTool().getMapCatalog();

    /**
     * The current projection
     * @type {object}
     * @api stable
     */
    this['projection'] = oVmap.getMap().getOLMap().getView().getProjection().getCode();

    /**
     * The layer will be added
     */
    this['oLayerToAdd'] = {
        'sService': '',
        'sLayer': '',
        'sUrl': ''
    };
};

/**
 * Add the layer defined by this.oLayerToAdd
 * @param {object|undefined} oLayer name and url of the layer to add, if not provided, will use oLayerToAdd
 * @export
 */
nsVmap.nsMapManager.nsMapModal.XYZSuggestions.prototype.xyzsuggestionsController.prototype.addLayer = function (oLayer) {
    oVmap.log('nsVmap.nsMapManager.nsMapModal.XYZSuggestions.prototype.xyzsuggestionsController.prototype.addLayer');
    
    var sService;
    var sLayer;
    var sUrl;

    if (goog.isDefAndNotNull(oLayer)) {
        sService = oLayer['name'];
        sLayer = oLayer['name'];
        sUrl = oLayer['url'];
    } else {
        sService = this['oLayerToAdd']['sService'];
        sLayer = this['oLayerToAdd']['sLayer'];
        sUrl = this['oLayerToAdd']['sUrl'];
    }

    if (!goog.isDefAndNotNull(sService)) {
        $.notify('Informations insuffisantes: Service', 'error');
        return null;
    }
    if (!goog.isDefAndNotNull(sLayer)) {
        $.notify('Informations insuffisantes: sLayer', 'error');
        return null;
    }
    if (!goog.isDefAndNotNull(sUrl)) {
        $.notify('Informations insuffisantes: sUrl', 'error');
        return null;
    }

    oVmap.getMapManager().addLayer({
        url: sUrl,
        layerType: "xyz",
        serviceName: sService,
        layerTitle: sLayer
    });
};

/**
 * reload variables
 * @export
 */
nsVmap.nsMapManager.nsMapModal.XYZSuggestions.prototype.xyzsuggestionsController.prototype.reload = function () {

    this['catalog'] = oVmap.getMapManager().getMapModalTool().getMapCatalog();
    this['projection'] = oVmap.getMap().getOLMap().getView().getProjection().getCode();
};

// Définit la directive et le controller
oVmap.module.directive('appXyzsuggestions', nsVmap.nsMapManager.nsMapModal.XYZSuggestions.prototype.xyzsuggestionsDirective);
oVmap.module.controller('AppXyzsuggestionsController', nsVmap.nsMapManager.nsMapModal.XYZSuggestions.prototype.xyzsuggestionsController);
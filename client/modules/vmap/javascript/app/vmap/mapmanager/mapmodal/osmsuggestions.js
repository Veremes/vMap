/* global goog, nsVmap, oVmap */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.nsMapModal.OSMSuggestions
 * cette classe permet d'afficher les suggestions osm'
 */

goog.provide('nsVmap.nsMapManager.nsMapModal.OSMSuggestions');



/**
 * @classdesc
 * Class {@link nsVmap.nsMapManager.nsMapModal.OSMSuggestions}: load the map list suggestions
 *
 * @constructor
 * @export
 */
nsVmap.nsMapManager.nsMapModal.OSMSuggestions = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.OSMSuggestions");

    // Directives et controleurs Angular
    oVmap.module.directive('appOsmsuggestions', this.osmsuggestionsDirective);
    oVmap.module.controller('AppOsmsuggestionsController', this.osmsuggestionsController);
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

};

/**
 * reload variables
 * @export
 */
nsVmap.nsMapManager.nsMapModal.OSMSuggestions.prototype.osmsuggestionsController.prototype.reload = function () {

    this.catalog = this['catalog'] = oVmap.getMapManager().getMapModalTool().getMapCatalog();
    this.projection = this['projection'] = oVmap.getMap().getOLMap().getView().getProjection().getCode();
};
/**
* @author: Armand Bahi
* @Description: Fichier contenant la classe nsVmap.nsMapManager.nsMapModal.IGNSuggestions
* cette classe permet d'afficher les suggestions ign'
*/

goog.provide('nsVmap.nsMapManager.nsMapModal.IGNSuggestions');



/**
* @classdesc
* Class {@link nsVmap.nsMapManager.nsMapModal.IGNSuggestions}: load the map list suggestions
*
* @constructor
* @export
*/
nsVmap.nsMapManager.nsMapModal.IGNSuggestions = function(){oVmap.log("nsVmap.nsMapManager.nsMapModal.IGNSuggestions");

  // Directives et controleurs Angular
  oVmap.module.directive('appIgnsuggestions', this.ignsuggestionsDirective);
  oVmap.module.controller('AppIgnsuggestionsController', this.ignsuggestionsController);
}



/************************************************
---------- DIRECTIVES AND CONTROLLERS -----------
*************************************************/
/**
 * map list directive
 * @return {angular.Directive} The directive specs.
 * @constructor
 * @export
 */
nsVmap.nsMapManager.nsMapModal.IGNSuggestions.prototype.ignsuggestionsDirective = function() {oVmap.log("nsVmap.ignsuggestionsDirective");
  return {
    restrict: 'E',
    scope: {
      'map': '=appMap',
      'lang': '=appLang'
    },
    controller: 'AppIgnsuggestionsController',
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: oVmap['properties']['vmap_folder'] + '/'+'template/layers/mapmodal/ignsuggestions.html'
  };
};

/**
 * map list controller
 * @constructor
 * @export
 */
nsVmap.nsMapManager.nsMapModal.IGNSuggestions.prototype.ignsuggestionsController = function() {oVmap.log("nsVmap.ignsuggestionsController");

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

};

/**
 * reload variables
 * @export
 */
nsVmap.nsMapManager.nsMapModal.IGNSuggestions.prototype.ignsuggestionsController.prototype.reload = function() {

  this.catalog = this['catalog'] = oVmap.getMapManager().getMapModalTool().getMapCatalog();
  this.projection = this['projection'] = oVmap.getMap().getOLMap().getView().getProjection().getCode();
}
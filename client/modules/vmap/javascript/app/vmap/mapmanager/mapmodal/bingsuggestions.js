/**
* @author: Armand Bahi
* @Description: Fichier contenant la classe nsVmap.nsMapManager.nsMapModal.BingSuggestions
* cette classe permet d'afficher les suggestions bing'
*/

goog.provide('nsVmap.nsMapManager.nsMapModal.BingSuggestions');



/**
* @classdesc
* Class {@link nsVmap.nsMapManager.nsMapModal.BingSuggestions}: load the map list suggestions
*
* @constructor
* @export
*/
nsVmap.nsMapManager.nsMapModal.BingSuggestions = function(){oVmap.log("nsVmap.nsMapManager.nsMapModal.BingSuggestions");

  // Directives et controleurs Angular
  oVmap.module.directive('appBingsuggestions', this.bingsuggestionsDirective);
  oVmap.module.controller('AppBingsuggestionsController', this.bingsuggestionsController);
}



/************************************************
---------- DIRECTIVES AND CONTROLLERS -----------
*************************************************/
/**
 * map list directive
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.BingSuggestions.prototype.bingsuggestionsDirective = function() {oVmap.log("nsVmap.bingsuggestionsDirective");
  return {
    restrict: 'E',
    scope: {
      'map': '=appMap',
      'lang': '=appLang'
    },
    controller: 'AppBingsuggestionsController',
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: oVmap['properties']['vmap_folder'] + '/'+'template/layers/mapmodal/bingsuggestions.html'
  };
};

/**
 * map list controller
 * @export
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.BingSuggestions.prototype.bingsuggestionsController = function() {oVmap.log("nsVmap.bingsuggestionsController");

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
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.BingSuggestions.prototype.bingsuggestionsController.prototype.reload = function() {

  this.catalog = this['catalog'] = oVmap.getMapManager().getMapModalTool().getMapCatalog();
  this.projection = this['projection'] = oVmap.getMap().getOLMap().getView().getProjection().getCode();
}
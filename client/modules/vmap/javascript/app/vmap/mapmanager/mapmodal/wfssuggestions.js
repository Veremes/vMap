/**
* @author: Armand Bahi
* @Description: Fichier contenant la classe nsVmap.nsMapManager.nsMapModal.WFSSuggestions
* cette classe permet d'afficher les suggestions wfs'
*/

goog.provide('nsVmap.nsMapManager.nsMapModal.WFSSuggestions');

// goog.require('ol.source.ImageWFS');
// goog.require('ol.format.WFSCapabilities');


/**
* @classdesc
* Class {@link nsVmap.nsMapManager.nsMapModal.WFSSuggestions}: load the map list suggestions
*
* @constructor
* @export
*/
nsVmap.nsMapManager.nsMapModal.WFSSuggestions = function(){oVmap.log("nsVmap.nsMapManager.nsMapModal.WFSSuggestions");

  // Directives et controleurs Angular
  oVmap.module.directive('appWfssuggestions', this.wfssuggestionsDirective);
  oVmap.module.controller('AppWfssuggestionsController', this.wfssuggestionsController);
}



/************************************************
---------- DIRECTIVES AND CONTROLLERS -----------
*************************************************/
/**
 * map list directive
 * @return {angular.Directive} The directive specs.
 * @export
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.WFSSuggestions.prototype.wfssuggestionsDirective = function() {oVmap.log("nsVmap.wfssuggestionsDirective");
  return {
    restrict: 'E',
    scope: {
      'map': '=appMap',
      'lang': '=appLang'
    },
    controller: 'AppWfssuggestionsController',
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: oVmap['properties']['vmap_folder'] + '/'+'template/layers/mapmodal/wfssuggestions.html'
  };
};

/**
 * map list controller
 * @export
 * @ngInject
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.WFSSuggestions.prototype.wfssuggestionsController = function($scope, $attrs, $http) {oVmap.log("nsVmap.wfssuggestionsController");

  /**
  * The maps catalog
  * @type {object}
  * @api stable
  */
  this.catalog = this['catalog'] = oVmap.getMapManager().getMapModalTool().getMapCatalog();
  
  /**
  * The displayed layers
  * @type {array<ol.Layer>}
  * @api stable
  */
  this.aLayers = this['aLayers'] = [];

  /**
   * @private
   * @type {angular.$http}
   */
  this.http_ = $http;

  $("#select-wfs-service").change(function(){
    $("#getCapabilities-url-field").val($("#select-wfs-service").val());
  });
};

/**
* Make a getCapabilities request and load the layers list
* @export
* @api experimental
*/
nsVmap.nsMapManager.nsMapModal.WFSSuggestions.prototype.wfssuggestionsController.prototype.getCapabilities = function(){oVmap.log("getCapabilities");

}

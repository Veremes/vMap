/* global oVmap, nsVmap, goog */

/**
* @author: Armand Bahi
* @Description: Fichier contenant la classe nsVmap.nsMapManager.nsMapModal.BingSuggestions
* cette classe permet d'afficher les suggestions bing'
*/

goog.provide('nsVmap.nsMapManager.nsMapModal.BingSuggestions');

goog.require('oVmap');

/**
* @classdesc
* Class {@link nsVmap.nsMapManager.nsMapModal.BingSuggestions}: load the map list suggestions
*
* @constructor
* @export
*/
nsVmap.nsMapManager.nsMapModal.BingSuggestions = function(){
    oVmap.log("nsVmap.nsMapManager.nsMapModal.BingSuggestions");
};

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
 * Add the layer
 * @param {object} oLayerOptions
 * @export
 */
nsVmap.nsMapManager.nsMapModal.BingSuggestions.prototype.bingsuggestionsController.prototype.addLayer = function(oLayerOptions) {
    oVmap.log('nsVmap.nsMapManager.nsMapModal.BingSuggestions.prototype.bingsuggestionsController.prototype.addLayer');
    
    var sKey;
    var sImagerySet;
    var sCulture;

    if (goog.isDefAndNotNull(oLayerOptions)) {
        sKey = oLayerOptions['key'];
        sImagerySet = oLayerOptions['imagerySet'];
        sCulture = oLayerOptions['culture'];
    }else{
        sKey = this['sKey'];
        sImagerySet = this['sImagerySet'];
        sCulture = this['sCulture'];
    }
    
    if (!goog.isDefAndNotNull(sKey) || sKey === '') {
        $.notify('Veuillez renseigner la clé Bing Maps', 'error');
        return 0;
    }
    if (!goog.isDefAndNotNull(sImagerySet) || sImagerySet === '') {
        $.notify('Veuillez renseigner une couche à utiliser', 'error');
        return 0;
    }
    if (!goog.isDefAndNotNull(sCulture) || sCulture === '') {
        $.notify('Veuillez renseigner une langue à utiliser', 'error');
        return 0;
    }

    var oLayer = {};
    oLayer.layerType = "bing";
    oLayer.serviceName = 'Bing Maps';
    oLayer.key = sKey;
    oLayer.layerName = sImagerySet;
    oLayer.culture = sCulture;
    
    oVmap.getMapManager().addLayer(oLayer);
};

/**
 * reload variables
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.BingSuggestions.prototype.bingsuggestionsController.prototype.reload = function() {

  this.catalog = this['catalog'] = oVmap.getMapManager().getMapModalTool().getMapCatalog();
  this.projection = this['projection'] = oVmap.getMap().getOLMap().getView().getProjection().getCode();
};

// Définit la directive et le controller
oVmap.module.directive('appBingsuggestions', nsVmap.nsMapManager.nsMapModal.BingSuggestions.prototype.bingsuggestionsDirective);
oVmap.module.controller('AppBingsuggestionsController', nsVmap.nsMapManager.nsMapModal.BingSuggestions.prototype.bingsuggestionsController);
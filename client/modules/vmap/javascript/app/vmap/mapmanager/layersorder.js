/* global goog, oVmap, nsVmap */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.LayersOrder
 * cette classe permet de changer l'ordre des couches
 */

goog.provide('nsVmap.nsMapManager.LayersOrder');

goog.require('ol.View');
goog.require('ol.layer.Group');
goog.require('ol.layer.Base');

/**
 * @classdesc
 * Class {@link nsVmap.nsMapManager.LayersOrder}: changing layers order tool
 *
 * @constructor
 * @export
 */
nsVmap.nsMapManager.LayersOrder = function () {
    oVmap.log("nsVmap.nsMapManager.LayersOrder");

    // Directives et controleurs Angular
    oVmap.module.directive('appLayersorder', this.layersorderDirective);
    oVmap.module.controller('AppLayersorderController', this.layersorderController);
};

/**
 * layers order directive
 * @return {angular.Directive} The directive specs.
 * @export
 * @constructor
 */
nsVmap.nsMapManager.LayersOrder.prototype.layersorderDirective = function () {
    oVmap.log("nsVmap.nsMapManager.LayersOrder.prototype.layersorderDirective");
    return {
        restrict: 'A',
        scope: {
            'map': '=appMap',
            'lang': '=appLang'
        },
        controller: 'AppLayersorderController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/layers/layersorder.html'
    };
};

/**
 * 
 * @param {object} $scope the current scope
 * @ngInject
 * @export
 * @constructor
 * @returns {undefined}
 */
nsVmap.nsMapManager.LayersOrder.prototype.layersorderController = function ($scope) {
    oVmap.log("nsVmap.nsMapManager.LayersOrder.prototype.layersorderController");

    var olMap = this['map'];
    var layersorderController = this;

    /**
     * Liste des couches (à l'envers)
     * @type {Array.<ol.layer.Base>}
     * @const
     * @api stable
     */
    var selectedLayers = this['selectedLayers'] = this['map'].getLayers().getArray().slice().reverse();
    
    if (goog.isDefAndNotNull(oVmap['properties']['vmap'])) {
        /**
         * true if the tool have to be collapsed
         */
        this['layersorder_collapsed'] = oVmap['properties']['vmap']['layersorder_collapsed'];
    }

    // Lie la carte à la liste des couches
    oVmap.getMap().getOLMap().getLayerGroup().on('change', function () {
        this['selectedLayers'] = this['map'].getLayers().getArray().slice().reverse();
    }, this);

    var layers = $(".sortable-list").sortable({
         handle: '.sortable-handle',
        'onDrop': function ($item, container, _super, event) {

            $item.removeClass(container['group']['options']['draggedClass']).removeAttr("style");
            $("body").removeClass(container['group']['options']['bodyClass']);

            data = layers.sortable('serialize').get();

            layersorderController.reorganizeLayers(data[0]);
        },
        'onDragStart': function ($item, container, _super) {

            var offset = $item.offset();
            var pointer = container['rootGroup']['pointer'];

            adjustment = {
                left: pointer.left - offset.left,
                top: pointer.top - offset.top
            };

            _super($item, container);
        },
        'onDrag': function ($item, position) {
                        
            $item.css({
                left: position.left - adjustment.left,
                top: position.top - adjustment.top
            });
        }
    });
};

/**
 * Reorganize the layers by the hashkey in the serialized data array
 * @param {array} data
 * @param {string} data.hashkey the hashkey of the layer
 * @returns {undefined}
 */
nsVmap.nsMapManager.LayersOrder.prototype.layersorderController.prototype.reorganizeLayers = function (data) {

    var oldList = this['selectedLayers'];

    oVmap.getMap().getOLMap().getLayers().clear();

    for (var i = data.length - 1; i >= 0; i--) {
        for (var ii = 0; ii < oldList.length; ii++) {
            if (oldList[ii]['$$hashKey'] === data[i]['hashkey'])
                oVmap.getMap().getOLMap().getLayers().push(oldList[ii]);
        }
    }
};

/**
 * Set a layer visible or not
 * @param {ol.layer.Base} layer
 * @param {boolean} bVisible
 * @export
 */
nsVmap.nsMapManager.LayersOrder.prototype.layersorderController.prototype.setVisible = function (layer, bVisible) {
    oVmap.log('nsVmap.nsMapManager.LayersOrder.prototype.layersorderController.prototype.setVisible', bVisible);
    
    layer.setVisible(bVisible);
    this['map'].render();
};

/**
 * Set the layer selectable
 * @param {ol.layer.Base} layer Layer.
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.LayersOrder.prototype.layersorderController.prototype.setSelectable = function (layer) {
    var isChecked = layer.get('select');
    var oLayersTree = oVmap.getMapManager().getLayersTree();
    layer.set('select', !isChecked);

    // Change la variable visible de la couche correspondante dans oLayersTree
    for (var i = 0; i < oLayersTree['children'].length; i++) {
        if (oLayersTree['children'][i]['children']) {
            oService = oLayersTree['children'][i]['children'];
            for (var ii = 0; ii < oService.length; ii++) {
                if (oService[ii]['olLayer']['$$hashKey'] === layer['$$hashKey'])
                    oService[ii]['select'] = !isChecked;
            }
        }
    }
};
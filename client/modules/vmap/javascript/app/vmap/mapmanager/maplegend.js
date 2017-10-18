/* global oVmap, goog, nsVmap */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.MapLegend
 * cette classe permet d'afficher la légende
 */

goog.provide('nsVmap.nsMapManager.MapLegend');

goog.require('oVmap');

/**
 * @classdesc
 * Class {@link nsVmap.nsMapManager.MapLegend}: Map legend tool
 * @constructor
 * @export
 */
nsVmap.nsMapManager.MapLegend = function () {
    oVmap.log("nsVmap.nsMapManager.MapLegend");
};

/************************************************
 ---------- DIRECTIVES AND CONTROLLERS -----------
 *************************************************/

/**
 * map legend directive
 * @return {angular.Directive} The directive specs.
 * @constructor
 * @ngInject
 * @export
 */
nsVmap.nsMapManager.MapLegend.prototype.maplegendDirective = function () {
    oVmap.log("nsVmap.nsMapManager.MapLegend.prototype.maplegendDirective");
    return {
        restrict: 'A',
        scope: {
            'map': '=appMap',
            'lang': '=appLang'
        },
        controller: 'AppMaplegendController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/layers/maplegend.html'
    };
};

/**
 * map legend image node directive (Allow th onmouseover)
 * @return {angular.Directive} The directive specs.
 * @constructor
 * @ngInject
 * @export
 */
nsVmap.nsMapManager.MapLegend.prototype.maplegendImageDirective = function () {
    oVmap.log("nsVmap.nsMapManager.MapLegend.prototype.maplegendImageDirective");
    return {
        link: function (scope, element) {
            var timeout = 500;
            var i = 0;
            $(element).mouseenter(function () {
                i++;
                var ii = angular.copy(i);

                // Si la souris est dedans depuis timeout ms
                setTimeout(function () {
                    if (ii === i) {
                        var myPopover;
                        $('[app-maplegend]').popover({
                            'html': true,
                            'content': '<img src="' + scope['node']['legendURL'] + '" class="img-responsive">',
                            'placement': function (popover) {
                                myPopover = popover;
                                return 'right';
                            }
                        });
                        $('[app-maplegend]').popover('show');

                        // Place la popover
                        setTimeout(function () {
                            var iElementBottomOffset = $(element).offset()['top'];
                            var iElementHeight = $(element).find('img').height();
                            var iElementMiddleOffset = iElementBottomOffset - iElementHeight / 2;
                            $(myPopover).css('top', iElementMiddleOffset + 'px');
                        });
                    }
                }, timeout);
            }).mouseleave(function () {
                i++;
                $('[app-maplegend]').popover('destroy');
            });
        }
    };
};

/**
 * map legend controller
 * @param {object} $scope
 * @ngInject
 * @constructor
 * @export
 */
nsVmap.nsMapManager.MapLegend.prototype.maplegendController = function ($scope) {
    oVmap.log("nsVmap.nsMapManager.MapLegend.prototype.maplegendController");

    var this_ = this;

    /**
     * @private
     */
    this['aUrls'] = [];

    /**
     * Contains the events stocked by listenLayers()
     */
    this.aListenedEvents_ = [];

    if (goog.isDefAndNotNull(oVmap['properties']['vmap'])) {
        /**
         * true if the tool have to be collapsed
         */
        this['legend_collapsed'] = oVmap['properties']['vmap']['legend_collapsed'];
    }

    oVmap['scope'].$on('layersChanged', function () {
        this_.loadLegend();
    });
    setTimeout(function () {
        this_.loadLegend();
    });
};

/**
 * Loads the legend
 * @export
 */
nsVmap.nsMapManager.MapLegend.prototype.maplegendController.prototype.loadLegend = function () {
    oVmap.log('nsVmap.nsMapManager.MapLegend.maplegendController.loadLegend');

    var aLayers = oVmap.getMap().getOLMap().getLayers().getArray();
    var oUrls = {};

    // Récupération des URL WMS
    for (var i = 0; i < aLayers.length; i++) {
        if (aLayers[i].get('legend') === true) {
            if (aLayers[i].get('type') === 'tilewms') {

                var sLayerName = aLayers[i].get('name');
                oUrls[sLayerName] = [];

                for (var ii = 0; ii < aLayers[i].getSource().getUrls().length; ii++) {
                    var aLayerParam = aLayers[i].getSource().getParams()['LAYERS'].split(',');
                    for (var iii = 0; iii < aLayerParam.length; iii++) {
                        
                        var separator = aLayers[i].getSource().getUrls()[ii].indexOf('?') !== -1 ? '&' : '?';
                        
                        oUrls[sLayerName].push({
                            'layerId': i,
                            'collapsed': false,
                            'url': aLayers[i].getSource().getUrls()[ii],
                            'layer': aLayerParam[iii],
                            'olLayer': aLayers[i],
                            'layerName': aLayers[i].get('name'),
                            'legendURL': aLayers[i].getSource().getUrls()[ii] + separator +'request=GetLegendGraphic&LAYER=' + aLayerParam[iii] + '&FORMAT=image/png&VERSION=1.1.0&service=wms'
                        });
                    }
                }
            } else if (aLayers[i].get('type') === 'imagewms') {

                var sLayerName = aLayers[i].get('name');
                var aLayerParam = aLayers[i].getSource().getParams()['LAYERS'].split(',');
                oUrls[sLayerName] = [];

                for (var iii = 0; iii < aLayerParam.length; iii++) {
                    
                    var separator = aLayers[i].getSource().getUrl().indexOf('?') !== -1 ? '&' : '?';
                    
                    oUrls[sLayerName].push({
                        'layerId': i,
                        'collapsed': false,
                        'url': aLayers[i].getSource().getUrl(),
                        'layer': aLayerParam[iii],
                        'olLayer': aLayers[i],
                        'layerName': aLayers[i].get('name'),
                        'legendURL': aLayers[i].getSource().getUrl() + separator + 'request=GetLegendGraphic&LAYER=' + aLayerParam[iii] + '&FORMAT=image/png&VERSION=1.1.0&service=wms'
                    });
                }
            }
        }
    }

    this['oUrls'] = oUrls;
};

// Définit la directive et le controller
oVmap.module.directive('appMaplegend', nsVmap.nsMapManager.MapLegend.prototype.maplegendDirective);
oVmap.module.directive('legendImageNode', nsVmap.nsMapManager.MapLegend.prototype.maplegendImageDirective);
oVmap.module.controller('AppMaplegendController', nsVmap.nsMapManager.MapLegend.prototype.maplegendController);
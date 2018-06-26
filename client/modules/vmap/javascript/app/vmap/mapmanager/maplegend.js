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

/**
 * Allow to hide the unaccessible legend images
 * @param {object} element
 * @export
 */
nsVmap.nsMapManager.MapLegend.prototype.hideBrokenLegend = function (element) {
    oVmap.log("nsVmap.nsMapManager.MapLegend.prototype.hideBrokenLegend");

    $(element).closest('.layer-legend').hide();
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
                            var popoverTop = $(myPopover).offset()['top'];
                            var popoverHeight = $(myPopover).height();
                            var popoverBottom = popoverTop + popoverHeight;
                            var bodyHeight = $('body').height();
                            var footerHeight = $('#footer_line').height();
                            var avaliableHeight = bodyHeight - footerHeight;

                            if (popoverBottom > avaliableHeight) {
                                $(myPopover).css('top', popoverTop - (popoverBottom - avaliableHeight) + 'px');
                            }
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

    this.$scope_ = $scope;

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

    this['oUrls'] = this.getLegendUrls();
    this.downloadLegendImgs(this['oUrls']);
};

/**
 * Get the legend URLs
 * @returns {object}
 */
nsVmap.nsMapManager.MapLegend.prototype.maplegendController.prototype.getLegendUrls = function () {
    oVmap.log('nsVmap.nsMapManager.MapLegend.maplegendController.getLegendUrls');

    var aLayers = oVmap.getMap().getOLMap().getLayers().getArray();
    var oUrls = {};

    // Récupération des URL WMS
    for (var i = 0; i < aLayers.length; i++) {
        if (aLayers[i].get('legend') === true) {
            if (aLayers[i].get('visible') === true) {
                if (aLayers[i].get('type') === 'tilewms') {

                    var sLayerName = aLayers[i].get('name');
                    oUrls[sLayerName] = [];

                    for (var ii = 0; ii < aLayers[i].getSource().getUrls().length; ii++) {

                        var sLayers = aLayers[i].getSource().getParams()['LAYERS'];
                        var aLayerParam = [];
                        if (goog.isDefAndNotNull(sLayers)) {
                            aLayerParam = aLayers[i].getSource().getParams()['LAYERS'].split(',');
                        }


                        for (var iii = 0; iii < aLayerParam.length; iii++) {

                            var separator = aLayers[i].getSource().getUrls()[ii].indexOf('?') !== -1 ? '&' : '?';

                            oUrls[sLayerName].push({
                                'layerId': i,
                                'collapsed': false,
                                'url': aLayers[i].getSource().getUrls()[ii],
                                'layer': aLayerParam[iii],
                                'olLayer': aLayers[i],
                                'layerName': aLayers[i].get('name'),
                                'service_login': goog.isDefAndNotNull(aLayers[i].get('service_login')) ? aLayers[i].get('service_login') : null,
                                'service_password': goog.isDefAndNotNull(aLayers[i].get('service_password')) ? aLayers[i].get('service_password') : null,
                                'legendURL': aLayers[i].getSource().getUrls()[ii] + separator + 'request=GetLegendGraphic&LAYER=' + aLayerParam[iii] + '&FORMAT=image/png&VERSION=1.1.0&service=wms'
                            });
                        }
                    }
                } else if (aLayers[i].get('type') === 'imagewms') {

                    var sLayerName = aLayers[i].get('name');

                    var sLayers = aLayers[i].getSource().getParams()['LAYERS'];
                    var aLayerParam = [];
                    if (goog.isDefAndNotNull(sLayers)) {
                        aLayerParam = aLayers[i].getSource().getParams()['LAYERS'].split(',');
                    }
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
                            'service_login': goog.isDefAndNotNull(aLayers[i].get('service_login')) ? aLayers[i].get('service_login') : null,
                            'service_password': goog.isDefAndNotNull(aLayers[i].get('service_password')) ? aLayers[i].get('service_password') : null,
                            'legendURL': aLayers[i].getSource().getUrl() + separator + 'request=GetLegendGraphic&LAYER=' + aLayerParam[iii] + '&FORMAT=image/png&VERSION=1.1.0&service=wms'
                        });
                    }
                }
            }
        }
    }

    return oUrls;
};

/**
 * Download the blob including the login/pass headers on the request
 * @param {object} oUrls
 * @export
 */
nsVmap.nsMapManager.MapLegend.prototype.maplegendController.prototype.downloadLegendImgs = function (oUrls) {
    oVmap.log('nsVmap.nsMapManager.MapLegend.maplegendController.downloadLegendImgs');
    for (var key in oUrls) {
        for (var i = 0; i < oUrls[key].length; i++) {
            oUrls[key][i]['legendBlobURL'] = this.downloadLegendImg(oUrls[key][i]);
        }
    }
};

/**
 * Télécharge l'image de la légende et la remplie au format blob sous l'attribut legendBlobURL
 * @param {object} oLegend
 * @export
 */
nsVmap.nsMapManager.MapLegend.prototype.maplegendController.prototype.downloadLegendImg = function (oLegend) {
    oVmap.log('nsVmap.nsMapManager.MapLegend.maplegendController.downloadLegendImg');

    var this_ = this;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onreadystatechange = function () {
        this_.$scope_.$applyAsync(function () {
            if ((xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
                    && (xhr.response.type === "image/png" || xhr.response.type === "image/jpg" || xhr.response.type === "image/jpeg")) {
                oLegend['legendBlobURL'] = URL.createObjectURL(xhr.response);
            } else {
                oLegend['legendBlobURL'] = false;
            }
        });
    };
    xhr.open('GET', oLegend['legendURL'], true);
    if (goog.isDefAndNotNull(oLegend['service_login']) && goog.isDefAndNotNull(oLegend['service_password'])) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa(oLegend['service_login'] + ":" + oLegend['service_password']));
    }
    // Par défaut la légende est non visible
    this_.$scope_.$applyAsync(function () {
        oLegend['legendBlobURL'] = false;
    });
    xhr.send();
};

/**
 * Retourne true si au moins une des légendes a été chargée
 * @param {array} aLegends
 * @returns {Boolean}
 * @export
 */
nsVmap.nsMapManager.MapLegend.prototype.maplegendController.prototype.areLegendsLoaded = function (aLegends) {
//    oVmap.log('nsVmap.nsMapManager.MapLegend.maplegendController.areLegendsLoaded');

    var bAreLegendsLoaded = false;
    for (var i = 0; i < aLegends.length; i++) {
        if (aLegends[i]['legendBlobURL'] !== false) {
            bAreLegendsLoaded = true;
        }
    }
    return bAreLegendsLoaded;
};

// Définit la directive et le controller
oVmap.module.directive('appMaplegend', nsVmap.nsMapManager.MapLegend.prototype.maplegendDirective);
oVmap.module.directive('legendImageNode', nsVmap.nsMapManager.MapLegend.prototype.maplegendImageDirective);
oVmap.module.controller('AppMaplegendController', nsVmap.nsMapManager.MapLegend.prototype.maplegendController);
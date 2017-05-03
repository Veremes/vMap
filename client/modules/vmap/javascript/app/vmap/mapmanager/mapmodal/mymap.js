/* global oVmap, nsVmap */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.nsMapModal.MyMap
 * cette classe permet d'afficher la liste des cartes disponibles
 */

goog.provide('nsVmap.nsMapManager.nsMapModal.MyMap');

goog.require('oVmap');


/**
 * @classdesc
 * Class {@link nsVmap.nsMapManager.nsMapModal.MyMap}: load the my map tool
 *
 * @constructor
 * @export
 */
nsVmap.nsMapManager.nsMapModal.MyMap = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.MyMap");
};

/************************************************
 ---------- DIRECTIVES AND CONTROLLERS -----------
 *************************************************/

/**
 * my map directive
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.MyMap.prototype.mymapDirective = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.MyMap.prototype.mymapDirective");
    return {
        restrict: 'E',
        scope: {
            'map': '=appMap',
            'lang': '=appLang'
        },
        controller: 'AppMymapController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/layers/mapmodal/mymap.html'
    };
};

/**
 * my map controller
 * @export
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.MyMap.prototype.mymapController = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.MyMap.prototype.mymapController");

    /**
     * Href for the download map button
     * @type {string}
     * @api stable
     */
    this.mapFileHref = this['mapFileHref'] = '';

    /**
     * The layers tree
     * @type {object}
     * @api stable
     */
    this.oLayersTree = this['oLayersTree'] = {};

    /**
     * The view to apply
     * @type {ol.View}
     * @api stable
     */
    this.view = this['view'] = {};
    this['displayedView'] = {};

    var isIE = false || !!document['documentMode'];
    var isEdge = !isIE && !!window['StyleMedia'];

    this['isIE'] = (isIE === true || isEdge === true);
};

/**
 * reload the layers tree view
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.MyMap.prototype.mymapController.prototype.reloadTree = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.MyMap.prototype.mymapController.prototype.reloadTree");

    this['oLayersTree'] = oVmap.getMapManager().getLayersTree();

    this['view'] = {
        'zoom': oVmap.getMap().getOLMap().getView().getZoom(),
        'center': oVmap.getMap().getOLMap().getView().getCenter(),
        'projection': oVmap.getMap().getOLMap().getView().getProjection().getCode(),
        'extent': this['map'].getView().calculateExtent(this['map'].getSize())
    };

    this['displayedView'] = {
        'zoom': this['view']['zoom'],
        'center': this['view']['center'][0] + ', '+this['view']['center'][1],
        'projection': oVmap['oProjections'][this['view']['projection']],
        'extent': this['view']['extent'][0] + ', ' + this['view']['extent'][1] + ', ' + this['view']['extent'][3] + ', ' + this['view']['extent'][3]
    };

    this.reloadMapFile();

    $('[data-toggle="tooltip"]').tooltip();
};

/**
 * Remove a layer from the map and the layers tree
 * @param {ol.layer.Base} olLayer Layer to remove
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.MyMap.prototype.mymapController.prototype.removeLayer = function (olLayer) {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.MyMap.prototype.mymapController.prototype.removeLayer");

    oVmap.getMapManager().removeLayer(olLayer);
    this.reloadTree();
};

/**
 * Set the map.json file to download in the exportMapButton button
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.MyMap.prototype.mymapController.prototype.reloadMapFile = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.MyMap.prototype.mymapController.prototype.reloadMapFile");

    var sMapFile = oVmap.getMapManager().getJSONLayersTree();

    var data = "data:text/json;charset=utf-8," + encodeURIComponent(sMapFile);

    this['mapFileHref'] = data;
    $("#exportMapButton").attr("href", data);
};

/**
 * Download the JSONLayersTree using msSaveBlob (only for windows)
 * @export
 */
nsVmap.nsMapManager.nsMapModal.MyMap.prototype.mymapController.prototype.downloadBlob = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.MyMap.prototype.mymapController.prototype.downloadBlob");

    var oBlob = new Blob([oVmap.getMapManager().getJSONLayersTree()]);
    window.navigator['msSaveBlob'](oBlob, 'map.json');
};

// Définit la directive et le controller
oVmap.module.directive('appMymap', nsVmap.nsMapManager.nsMapModal.MyMap.prototype.mymapDirective);
oVmap.module.controller('AppMymapController', nsVmap.nsMapManager.nsMapModal.MyMap.prototype.mymapController);
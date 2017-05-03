/* global nsVmap, goog, oVmap */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.nsMapModal.MapModalManager
 * cette classe contient les elements de la fenêtre modale permetant la gestion des cartes
 */

goog.provide('nsVmap.nsMapManager.nsMapModal.MapModalManager');

goog.require('oVmap');

goog.require('nsVmap.nsMapManager.nsMapModal.MapList');
goog.require('nsVmap.nsMapManager.nsMapModal.MapListLitle');
goog.require('nsVmap.nsMapManager.nsMapModal.MyMap');
goog.require('nsVmap.nsMapManager.nsMapModal.WMSSuggestions');
goog.require('nsVmap.nsMapManager.nsMapModal.WMTSSuggestions');
goog.require('nsVmap.nsMapManager.nsMapModal.XYZSuggestions');
goog.require('nsVmap.nsMapManager.nsMapModal.LoadGeometry');
goog.require('nsVmap.nsMapManager.nsMapModal.OSMSuggestions');
goog.require('nsVmap.nsMapManager.nsMapModal.BingSuggestions');


/**
 * @classdesc
 * Class {@link nsVmap.nsMapManager.nsMapModal.MapModalManager}: load the modal map manager
 *
 * @param {object} aCatalog Catalog
 * @constructor
 * @export
 */
nsVmap.nsMapManager.nsMapModal.MapModalManager = function (aCatalog) {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.MapModalManager");
    /**
     * Object which contains the map catalog
     * @type {array<object>}
     * @private
     */
    this.oMapCatalog_ = aCatalog;

    /** 
     * Objet which contains the map list litle tool
     * @type {nsVmap.nsMapManager.nsMapModal.MapListLitle} 
     * @private
     */
    this.oMapListLitle_ = new nsVmap.nsMapManager.nsMapModal.MapListLitle();

    /** 
     * Objet which contains the map list tool
     * @type {nsVmap.nsMapManager.nsMapModal.MapList} 
     * @private
     */
    this.oMapList_ = new nsVmap.nsMapManager.nsMapModal.MapList();

    /** 
     * Objet which contains the map my map
     * @type {nsVmap.nsMapManager.nsMapModal.MyMap} 
     * @private
     */
    this.oMyMap_ = new nsVmap.nsMapManager.nsMapModal.MyMap();

    /** 
     * Objet which contains the wms suggestions tool
     * @type {nsVmap.nsMapManager.nsMapModal.WMSSuggestions} 
     * @private
     */
    this.oWMSSuggestions_ = new nsVmap.nsMapManager.nsMapModal.WMSSuggestions();

    /** 
     * Objet which contains the wms suggestions tool
     * @type {nsVmap.nsMapManager.nsMapModal.WMTSSuggestions} 
     * @private
     */
    this.oWMTSSuggestions_ = new nsVmap.nsMapManager.nsMapModal.WMTSSuggestions();

    /**
     * Objet which contains the geometry suggestions tool
     * @type {nsVmap.nsMapManager.nsMapModal.LoadGeometry} 
     * @private
     */
    this.oLoadGeometry_ = new nsVmap.nsMapManager.nsMapModal.LoadGeometry();

    /** 
     * Objet which contains the open street map suggestions tool
     * @type {nsVmap.nsMapManager.nsMapModal.OSMSuggestions} 
     * @private
     */
    this.oOSMSuggestions_ = new nsVmap.nsMapManager.nsMapModal.OSMSuggestions();

    /** 
     * Objet which contains the XYZ suggestions tool
     * @type {nsVmap.nsMapManager.nsMapModal.XYZSuggestions} 
     * @private
     */
    this.oXYZSuggestions_ = new nsVmap.nsMapManager.nsMapModal.XYZSuggestions();

    /** 
     * Objet which contains the Bing suggestions tool
     * @type {nsVmap.nsMapManager.nsMapModal.BingSuggestions} 
     * @private
     */
    this.oBingSuggestions_ = new nsVmap.nsMapManager.nsMapModal.BingSuggestions();
};


/************************************************
 ---------- DIRECTIVES AND CONTROLLERS -----------
 *************************************************/

/**
 * map list directive
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.MapModalManager.prototype.mapmodalDirective = function () {
    oVmap.log("nsVmap.mapmodalDirective");
    return {
        restrict: 'E',
        scope: {
            'map': '=appMap',
            'proj': '=appProj',
            'lang': '=appLang'
        },
        controller: 'AppMapmodalController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/layers/mapmodal/mapmodal.html'
    };
};

/**
 * map list controller
 * @ngInject
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.MapModalManager.prototype.mapmodalController = function () {
    oVmap.log("nsVmap.mapmodalController");
};


/************************************************
 ------------ GETTERS AND SETTERS ----------------
 *************************************************/
/**
 * oMapList_ getter
 * @return {nsVmap.nsMapManager.nsMapModal.MapList} Map list tool
 * @api experimental
 * @export
 */
nsVmap.nsMapManager.nsMapModal.MapModalManager.prototype.getMapListTool = function () {
    return this.oMapList_;
};

/**
 * oMyMap_ getter
 * @return {nsVmap.nsMapManager.nsMapModal.MyMap} My map tool
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.MapModalManager.prototype.getMyMapTool = function () {
    return this.oMyMap_;
};

/**
 * oWMSSuggestions_ getter
 * @return {nsVmap.nsMapManager.nsMapModal.WMSSuggestions} WMSSuggestions tool
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.MapModalManager.prototype.getWMSSuggestionsTool = function () {
    return this.oWMSSuggestions_;
};

/**
 * oOSMSuggestions_ getter
 * @return {nsVmap.nsMapManager.nsMapModal.OSMSuggestions} OSMSuggestions tool
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.MapModalManager.prototype.getOSMSuggestionsTool = function () {
    return this.oOSMSuggestions_;
};

/**
 * oXYZSuggestions_ getter
 * @return {nsVmap.nsMapManager.nsMapModal.XYZSuggestions} XYZSuggestions tool
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.MapModalManager.prototype.getXYZSuggestionsTool = function () {
    return this.oXYZSuggestions_;
};

/**
 * oBingSuggestions_ getter
 * @return {nsVmap.nsMapManager.nsMapModal.BingSuggestions} BingSuggestions tool
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.MapModalManager.prototype.getBingSuggestionsTool = function () {
    return this.oBingSuggestions_;
};

/**
 * oIGNSuggestions_ getter
 * @return {nsVmap.nsMapManager.nsMapModal.IGNSuggestions} IGNSuggestions tool
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.MapModalManager.prototype.getIGNSuggestionsTool = function () {
    return this.oIGNSuggestions_;
};

/**
 * oMapCatalog_ getter
 * @return {array} map catalog
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.MapModalManager.prototype.getMapCatalog = function () {
    return this.oMapCatalog_;
};

/**
 * oMapCatalog_ setter
 * @param {array} aCatalog Map catalog array
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.MapModalManager.prototype.setMapCatalog = function (aCatalog) {
    this.oMapCatalog_ = aCatalog;
};

// Définit la directive et le controller
oVmap.module.directive('appMapmodal', nsVmap.nsMapManager.nsMapModal.MapModalManager.prototype.mapmodalDirective);
oVmap.module.controller('AppMapmodalController', nsVmap.nsMapManager.nsMapModal.MapModalManager.prototype.mapmodalController);
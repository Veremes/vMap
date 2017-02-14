/* global nsVmap, oVmap, goog, oTool, angular */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.ToolsManager
 * cette classe permet l'initialisation des outils de carte
 */

goog.provide('nsVmap.nsToolsManager.ToolsManager');

goog.require('nsVmap.nsToolsManager.BasicTools');
goog.require('nsVmap.nsToolsManager.InfoContainer');
goog.require('nsVmap.nsToolsManager.requireModules');

goog.require('goog.dom');

/**
 * @classdesc
 * Class {@link nsVmap.nsToolsManager.ToolsManager}: initializes the map tools
 *
 * @constructor
 * @export
 */
nsVmap.nsToolsManager.ToolsManager = function () {
    oVmap.log("nsVmap.nsToolsManager.ToolsManager");

    var this_ = this;

    /**
     * Object which contains the tools tree
     * @type {array<object>}
     * @private
     */
    this.aToolsTree_ = this.loadSyncToolsTree();

    /**
     * Object which contains the basic tools
     * @type {object}
     * @private
     */
    this.oBasicTools_ = new nsVmap.nsToolsManager.BasicTools();

    /**
     * Object which contains the info container
     * @type {object}
     * @private
     */
    this.oInfoContainer_ = new nsVmap.nsToolsManager.InfoContainer();

    // Instancie les classes des modules
    this.instanciateAvaliableModules();
    
    // Directives et controleurs Angular
    oVmap.module.directive('appVmaptools', this.vmapToolsDirective);
    oVmap.module.directive('toolsContainer', this.vmapToolsContainerDirective);
    oVmap.module.controller('AppVmaptoolsController', this.vmapToolsController);
};

/**
 * Instanciates all the avaliable modules
 * @export
 */
nsVmap.nsToolsManager.ToolsManager.prototype.instanciateAvaliableModules = function () {
    oVmap.log('nsVmap.nsToolsManager.ToolsManager.instanciateAvaliableModules');
    
    var avaliableModules = Object.keys(nsVmap.nsToolsManager.nsModules);
    
    oVmap.log("avaliableModules: ", avaliableModules);
    
    for (var i = 0; i < avaliableModules.length; i++) {
        this.instanciateModule(avaliableModules[i]);
    }
};

/**
 * Instanciate the given module
 * @param {string} sTool
 */
nsVmap.nsToolsManager.ToolsManager.prototype.instanciateModule = function (sTool) {
    oVmap.log('nsVmap.nsToolsManager.ToolsManager.instanciateModule');

    // Met la première lettre en majuscule
    sTool = sTool.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });

    if (goog.isDefAndNotNull(nsVmap.nsToolsManager.nsModules[sTool])) {
        this[sTool] = new nsVmap.nsToolsManager.nsModules[sTool]();
    } else {
        console.error('tool (' + sTool + ') does not exist');
    }
};

/************************************************
 ---------- DIRECTIVES AND CONTROLLERS -----------
 *************************************************/

/**
 * Basic tools Directive
 * @return {angular.Directive} The directive specs.
 * @export
 * @constructor
 */
nsVmap.nsToolsManager.ToolsManager.prototype.vmapToolsDirective = function () {
    oVmap.log("nsVmap.nsToolsManager.BasicTools.prototype.vmapToolsDirective");
    return {
        restrict: 'E',
        scope: {
            'map': '=appMap',
            'lang': '=appLang',
            'infos': '=appInfos',
            'currentAction': '=appAction'
        },
        controller: 'AppVmaptoolsController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/tools.html'
    };
};

/**
 * tool-sidebar directive: write the tools directives divs
 * @ngInject
 * constructor
 */
nsVmap.nsToolsManager.ToolsManager.prototype.vmapToolsContainerDirective = function ($compile) {
    return function (scope, element, attrs) {
        
        scope['oToolsTree'] = oVmap.getToolsManager().getToolsTree();

        for (var family in scope['oToolsTree']) {

            var htmlTool = '';
            var htmlFamily = '<div id="' + family + '-container" class="right-sidebar" ';
            htmlFamily += 'ng-class="ctrl.openedTool == \'' + family + '\' ? \'open\' : \'\'">';

            for (var tool in scope['oToolsTree'][family]) {
                htmlTool += '<div id="' + tool + '-tool" class="side-tool ng-isolate-scope app-' + tool + '" ';
                htmlTool += 'app-map="ctrl.map" app-lang="ctrl.lang" app-infos="ctrl.infos" app-action="ctrl.currentAction"></div>';
            }

            angular.element($('tools-container')).append($compile(htmlFamily + htmlTool + '</div>')(scope));
        }
    };
};

/**
 * Basic tools Controller
 * @export
 * @constructor
 */
nsVmap.nsToolsManager.ToolsManager.prototype.vmapToolsController = function () {
    oVmap.log("nsVmap.nsToolsManager.BasicTools.prototype.vmapToolsController");

    this['oToolsTree'] = oVmap.getToolsManager().getToolsTree();
    this['openedTool'] = '_';
};



/************************************************
 ------------ GETTERS AND SETTERS ----------------
 *************************************************/

/**
 * Load synchronally the tools tree from the json file
 */
nsVmap.nsToolsManager.ToolsManager.prototype.loadSyncToolsTree = function () {

    var oToolsTree = {};
    $.ajax({
        url: oVmap['properties']['api_url'] + '/vmap/usermodules?token=' + oVmap['properties']['token'],
        async: false
    }).done(function (data) {
        oToolsTree = data['usermodules'];
    }).fail(function () {
//        console.error("toolsTree load failed");
    });
    return oToolsTree;
};

/**
 * @returns {object} Tools tree
 * @export
 */
nsVmap.nsToolsManager.ToolsManager.prototype.getToolsTree = function () {
    return this.aToolsTree_;
};

/**
 * nsVmap.toolsTree setter
 * @param {object} tree Tools tree
 */
nsVmap.nsToolsManager.ToolsManager.prototype.setToolsTree = function (tree) {
    this.aToolsTree_ = tree;
};

/**
 * @returns {object<nsVmap.nsToolsManager.BasicTools>}
 * @export
 */
nsVmap.nsToolsManager.ToolsManager.prototype.getBasicTools = function () {
    return this.oBasicTools_;
};

/**
 * @returns {object<nsVmap.nsToolsManager.InfoContainer>}
 * @export
 */
nsVmap.nsToolsManager.ToolsManager.prototype.getInfoContainer = function () {
    return this.oInfoContainer_;
};

/**
 * Return a tool
 * @param {string} tool name of the tool
 * @return {object<nsVmap.nsToolsManager.tool>}
 * @export
 */
nsVmap.nsToolsManager.ToolsManager.prototype.getTool = function (tool) {
    return this[tool];
};
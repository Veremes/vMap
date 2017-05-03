/* global goog, nsVmap, oVmap */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.BasicTools
 * cette classe permet l'initialisation des outils de base de carte
 */
goog.provide('nsVmap.nsToolsManager.BasicTools');

goog.require('oVmap');

goog.require('nsVmap.nsToolsManager.Controls');
goog.require('nsVmap.nsToolsManager.Location');
goog.require('nsVmap.nsToolsManager.Measure');
goog.require('nsVmap.nsToolsManager.Select');
goog.require('nsVmap.nsToolsManager.Insert');
goog.require('nsVmap.nsToolsManager.Print');


/**
 * @classdesc
 * Class {@link nsVmap.nsToolsManager.BasicTools}: Add the basic tools
 *
 * @constructor
 * @export
 */
nsVmap.nsToolsManager.BasicTools = function () {
    oVmap.log('nsVmap.nsToolsManager.BasicTools');

    this.oLocation_ = new nsVmap.nsToolsManager.Location();
    this.oMeasure_ = new nsVmap.nsToolsManager.Measure();
    this.oSelect_ = new nsVmap.nsToolsManager.Select();
    this.oInsert_ = new nsVmap.nsToolsManager.Insert();
    this.oPrint_ = new nsVmap.nsToolsManager.Print();
    this.oControls_ = new nsVmap.nsToolsManager.Controls();
};

/**
 * Toggle a basic tool
 * @param {object} toolHTML The html id of the tool
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.toggleTool = function (toolHTML) {

    var isActive = $(toolHTML).hasClass('active');

    // Desactive tous les outils
    this.toggleOutTools();

    // Passe en mode actif le bouton html de l'outil
    if (isActive === false) {
        $(toolHTML).addClass('active');
        $(toolHTML).parent().children('.dropdown-menu').show();
    }
};

/**
 * show a basic tool
 * @param {object} toolHTML The html id of the tool
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.showTool = function (toolHTML) {

    $(toolHTML).addClass('active');
    $(toolHTML).parent().children('.dropdown-menu').show();
};

/**
 * hide a basic tool
 * @param {object} toolHTML The html id of the tool
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.hideTool = function (toolHTML) {

    $(toolHTML).removeClass('active');
    $(toolHTML).parent().children('.dropdown-menu').hide();
};

/**
 * Toggle out all the basic tools
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.toggleOutTools = function () {
    oVmap.log('nsVmap.nsToolsManager.BasicTools.prototype.toggleOutTools');

    // Passe tous les boutons en mode inactif
    $('.basic-tools-element').removeClass('active');
    // Ferme les drowdown
    $('.basic-tools-dropdown-element').hide();
    // Supprime les actions en cours
    oVmap.getMap().removeActionsAndTooltips();
    // Lance les évènements
    oVmap.log('oVmap event: toggleOutTools');
    oVmap['scope'].$broadcast('toggleOutTools');
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
nsVmap.nsToolsManager.BasicTools.prototype.basictoolsDirective = function () {
    oVmap.log("nsVmap.nsToolsManager.BasicTools.prototype.basictoolsDirective");
    return {
        restrict: 'A',
        scope: {
            'map': '=appMap',
            'lang': '=appLang',
            'currentAction': '=appAction'
        },
        controller: 'AppBasictoolsController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/basictools.html'
    };
};

/**
 * Basic tools Controller
 * @param {object} $scope
 * @param {object} $timeout
 * @ngInject
 * @export
 * @constructor
 */
nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController = function ($scope, $timeout) {
    oVmap.log("nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController");

    $scope['$oLocation'];
    $scope['$oMeasure'];
    $scope['$oSelect'];
    $scope['$oInsert'];
    $scope['$oPrint'];
    $scope['$oControls'];

    $timeout(function () {
        for (var oChild = $scope.$$childHead; oChild; oChild = oChild.$$nextSibling) {
            if (oChild.ctrl.constructor === nsVmap.nsToolsManager.Location.prototype.locationController)
                $scope['$oLocation'] = oChild;
            if (oChild.ctrl.constructor === nsVmap.nsToolsManager.Measure.prototype.measureController)
                $scope['$oMeasure'] = oChild;
            if (oChild.ctrl.constructor === nsVmap.nsToolsManager.Select.prototype.selecttoolController)
                $scope['$oSelect'] = oChild;
            if (oChild.ctrl.constructor === nsVmap.nsToolsManager.Insert.prototype.inserttoolController)
                $scope['$oInsert'] = oChild;
            if (oChild.ctrl.constructor === nsVmap.nsToolsManager.Print.prototype.printController)
                $scope['$oPrint'] = oChild;
            if (oChild.ctrl.constructor === nsVmap.nsToolsManager.Controls.prototype.controlsController)
                $scope['$oControls'] = oChild;
        }
    });
    
    // Ferme les outils quand on change de carte
    oVmap['scope'].$on('mapChanged', function(){
        oVmap.getToolsManager().getBasicTools().toggleOutTools();
    });
};

/************************************************
 ------------ GETTERS AND SETTERS ----------------
 *************************************************/
/**
 * oSelect_ getter
 * @return {nsVmap.nsToolsManager.Select} Select object
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.BasicTools.prototype.getSelect = function () {
    return this.oSelect_;
};
/**
 * oInsert_ getter
 * @return {nsVmap.nsToolsManager.Insert} Insert object
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.BasicTools.prototype.getInsert = function () {
    return this.oInsert_;
};
/**
 * oLocation_ getter
 * @return {nsVmap.nsToolsManager.Location} Location object
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.BasicTools.prototype.getLocation = function () {
    return this.oLocation_;
};
/**
 * oMeasure_ getter
 * @return {nsVmap.nsToolsManager.Measure} Measure object
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.BasicTools.prototype.getMeasure = function () {
    return this.oMeasure_;
};
/**
 * oPrint_ getter
 * @return {nsVmap.nsToolsManager.Print} Print object
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.BasicTools.prototype.getPrint = function () {
    return this.oPrint_;
};
/**
 * oControls_ getter
 * @return {nsVmap.nsToolsManager.Controls} Controls object
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.BasicTools.prototype.getControls = function () {
    return this.oControls_;
};

// Définit la directive et le controller
oVmap.module.directive('appBasictools', nsVmap.nsToolsManager.BasicTools.prototype.basictoolsDirective);
oVmap.module.controller('AppBasictoolsController', nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController);
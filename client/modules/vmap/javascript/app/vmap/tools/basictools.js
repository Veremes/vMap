/* global goog, nsVmap, oVmap */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.BasicTools
 * cette classe permet l'initialisation des outils de base de carte
 */
goog.provide('nsVmap.nsToolsManager.BasicTools');

goog.require('oVmap');

goog.require('nsVmap.nsToolsManager.VmapUser');
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
    //
    oVmap['scope'].$broadcast('toggleOutTools');
};

/**
 * Hide the mobile menu
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.hideMobileMenu = function () {
    oVmap.log('nsVmap.nsToolsManager.BasicTools.prototype.hideMobileMenu');
    angular.element('#map-basic-tools').scope()['ctrl']['hideMobileMenu']();
    this.toggleOutTools();
};

/**
 * Display the mobile menu
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.displayAdvancedMobileMenu = function () {
    oVmap.log('nsVmap.nsToolsManager.BasicTools.prototype.displayAdvancedMobileMenu');
    angular.element('#map-basic-tools').scope()['ctrl']['displayAdvancedMobileMenu']();
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
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/' + (oVmap['properties']['is_mobile'] ? 'basictools_mobile.html' : 'basictools.html')
    };
};

/**
 * Basic tools Controller
 * @param {object} $scope
 * @param {object} $timeout
 * @param {object} $element
 * @ngInject
 * @export
 * @constructor
 */
nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController = function ($scope, $timeout, $element) {
    oVmap.log("nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController");

    this.$scope_ = $scope;
    this.$element_ = $element;

    $scope['$oLocation'];
    $scope['$oMeasure'];
    $scope['$oSelect'];
    $scope['$oInsert'];
    $scope['$oPrint'];
    $scope['$oControls'];

    // Menus mobile
    $scope['bMobileMenuOpen'] = false;
    $scope['bMobileLocationMenuOpen'] = false;
    $scope['bMobileLayersMenuOpen'] = false;
    $scope['bMobileAdvancedMenuOpen'] = false;
    $scope['locationGoToProjection'] = 'EPSG:4326';
    $scope['locationGoToX'] = '';
    $scope['locationGoToY'] = '';

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
    oVmap['scope'].$on('mapChanged', function () {
        oVmap.getToolsManager().getBasicTools().toggleOutTools();
    });

    // Affiche les modales en plein écran pour la version mobile
    if (oVmap['properties']['is_mobile']) {
        $element.find('.modal').on('shown.bs.modal', function () {
            $('.modal-backdrop.fade.in').hide();
            $('.modal.fade.in').find('.modal-dialog').addClass('mobile-full-modal');
        });
    }
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


/********************************************
 *           INTERFACE MOBILE
 *******************************************/

/**
 * Affiche l'interface menu mobile
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController.prototype.displayMobileMenu = function () {
    oVmap.log('nsVmap.nsToolsManager.BasicTools.basictoolsController.displayMobileMenu');
    this.$scope_['bMobileMenuOpen'] = true;
};

/**
 * Cache l'interface menu mobile et affiche la carte
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController.prototype.hideMobileMenu = function () {
    oVmap.log('nsVmap.nsToolsManager.BasicTools.basictoolsController.hideMobileMenu');

    // Ferme les menus
    this.$scope_['bMobileMenuOpen'] = false;
    this.$scope_['bMobileLocationMenuOpen'] = false;
    this.$scope_['bMobileLayersMenuOpen'] = false;
    this.$scope_['bMobileAdvancedMenuOpen'] = false;
    this.$scope_['bMobileRequeteurOpen'] = false;

    // Ferme l'éventuelle popup affichée
    this.closeSelectionPopup();

    // Ferme l'accordéon
    $(this.$element_).find('.sublinks.collapse.in').collapse('hide');
};

/**
 * Affiche l'outil de localisation pour mobile
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController.prototype.displayLocationMobileMenu = function () {
    oVmap.log('nsVmap.nsToolsManager.BasicTools.basictoolsController.displayLocationMobileMenu');

    this.hideMobileMenu();
    this.$scope_['bMobileLocationMenuOpen'] = true;
    this.displayMobileMenu();
};

/**
 * Affiche l'outil calques et cartes pour mobile
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController.prototype.displayLayersMobileMenu = function () {
    oVmap.log('nsVmap.nsToolsManager.BasicTools.basictoolsController.displayLayersMobileMenu');

    this.hideMobileMenu();
    this.$scope_['bMobileLayersMenuOpen'] = true;
    this.displayMobileMenu();
};

/**
 * Affiche l'outil calques et cartes pour mobile
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController.prototype.displayAdvancedMobileMenu = function () {
    oVmap.log('nsVmap.nsToolsManager.BasicTools.basictoolsController.displayAdvancedMobileMenu');

    this.hideMobileMenu();
    this.$scope_['bMobileAdvancedMenuOpen'] = true;
    this.displayMobileMenu();
};

/**
 * Affiche le requêteur
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController.prototype.displayRequeteur = function () {
    oVmap.log('nsVmap.nsToolsManager.BasicTools.basictoolsController.displayRequeteur');

    this.hideMobileMenu();
    this.$scope_['bMobileRequeteurOpen'] = true;
    this.displayMobileMenu();

    angular.element($('#vmap-advancedselect-tool')).scope()['ctrl'].displaySelectionTable([]);
};


nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController.prototype.closeSelectionPopup = function () {
    oVmap.log('nsVmap.nsToolsManager.BasicTools.basictoolsController.closeSelectionPopup');

    angular.element($('#vmap-basicselect-tool')).scope()['ctrl'].closeSelectionPopup();
};

/*****************************************
 *                Location
 *****************************************/

/**
 * Ferme le menu mobile et place la carte à son étendue propre
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController.prototype.locationGoHome = function () {
    oVmap.log('nsVmap.nsToolsManager.BasicTools.basictoolsController.locationGoHome');

    this.hideMobileMenu();
    angular.element($('#location-search-tool')).scope()['ctrl']['goHome']();
};

/**
 * Ferme le menu mobile et centre sur la position courante
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController.prototype.locationGeolocateMe = function () {
    oVmap.log('nsVmap.nsToolsManager.BasicTools.basictoolsController.locationGeolocateMe');

    this.hideMobileMenu();
    oVmap.getMap().centerGPSPosition();
};

/**
 * Ferme le menu mobile et centre sur l'étendue max
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController.prototype.locationMaxExtent = function () {
    oVmap.log('nsVmap.nsToolsManager.BasicTools.basictoolsController.locationMaxExtent');

    this.hideMobileMenu();
    angular.element($('#location-search-tool')).scope()['ctrl']['maxExtent']();
};

/**
 * Affiche le fromulaire de localisation sur coordonnées
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController.prototype.locationGoCoordinates = function () {
    oVmap.log('nsVmap.nsToolsManager.BasicTools.basictoolsController.locationGoCoordinates');

    this.$scope_['locationGoToProjection'] = 'EPSG:4326';
    this.$scope_['locationGoToX'] = '';
    this.$scope_['locationGoToY'] = '';
    this.$scope_['locationProjections'] = angular.element($('#location-search-tool')).scope()['ctrl']['projections'];
    $('#location-goto-modal').modal('show');
};

/**
 * Ferme le menu mobile et centre sur les coordonnées renseignées
 * @param {number} CoordX
 * @param {number} CoordY
 * @param {string} projection
 * @export
 */
nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController.prototype.locationGoTo = function (CoordX, CoordY, projection) {
    oVmap.log('nsVmap.nsToolsManager.BasicTools.basictoolsController.locationGoTo');

    $('#location-goto-modal').modal('hide');

    this.hideMobileMenu();
    angular.element($('#location-search-tool')).scope()['ctrl']['goTo'](CoordX, CoordY, projection);
};

// Définit la directive et le controller
oVmap.module.directive('appBasictools', nsVmap.nsToolsManager.BasicTools.prototype.basictoolsDirective);
oVmap.module.controller('AppBasictoolsController', nsVmap.nsToolsManager.BasicTools.prototype.basictoolsController);
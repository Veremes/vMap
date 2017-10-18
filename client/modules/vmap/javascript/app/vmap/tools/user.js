/* global oVmap, nsVmap, goog, ol, vitisApp */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.VmapUser
 * cette classe permet à l'utilisateur de se déconnecter et de voir les informations de son compte
 */
goog.provide('nsVmap.nsToolsManager.VmapUser');

goog.require('oVmap');

/**
 * @classdesc
 * Class {@link nsVmap.nsToolsManager.VmapUser}
 * @constructor
 * @export
 */
nsVmap.nsToolsManager.VmapUser = function () {
    oVmap.log('nsVmap.nsToolsManager.VmapUser');

};
// Obligatoire pour instancier dans nsVmap.nsToolsManager.ToolsManager
goog.exportProperty(nsVmap.nsToolsManager, 'VmapUser', nsVmap.nsToolsManager.VmapUser);


/**
 * Directive
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.nsToolsManager.VmapUser.prototype.vmapuserDirective = function () {
    oVmap.log("nsVmap.nsToolsManager.VmapUser.prototype.vmapuserDirective");
    return {
        restrict: 'A',
        scope: {
            'map': '=appMap',
            'lang': '=appLang'
        },
        controller: 'AppVmapUserController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/user.html'
    };
};

/**
 * Controler
 * @constructor
 * @param {object} $scope
 * @returns {undefined}
 * @ngInject
 */
nsVmap.nsToolsManager.VmapUser.prototype.vmapuserController = function ($scope) {
    oVmap.log("nsVmap.nsToolsManager.VmapUser.prototype.vmapuserController");

    $scope['sUserLoginText'] = sessionStorage['user_login'];
};

///**
// * Disconnect the current user
// * @returns {undefined}
// * @export
// */
//nsVmap.nsToolsManager.VmapUser.prototype.vmapuserController.prototype.editUser = function () {
//    oVmap.log("nsVmap.nsToolsManager.VmapUser.vmapuserController.editUser");
//
//    angular.element(vitisApp.appMainDrtv).scope()['selectMode']('user');
//};

/**
 * Disconnect the current user
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.VmapUser.prototype.vmapuserController.prototype.disconnect = function () {
    oVmap.log("nsVmap.nsToolsManager.VmapUser.vmapuserController.disconnect");

    angular.element(vitisApp.appMainDrtv).scope()['disconnect']();
};

// Définit la directive et le controller
oVmap.module.directive('appVmapUser', nsVmap.nsToolsManager.VmapUser.prototype.vmapuserDirective);
oVmap.module.controller('AppVmapUserController', nsVmap.nsToolsManager.VmapUser.prototype.vmapuserController);
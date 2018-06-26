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
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/' + (oVmap['properties']['is_mobile'] ? 'user_mobile.html' : 'user.html')
    };
};

/**
 * Controler
 * @constructor
 * @param {object} $scope
 * @returns {undefined}
 * @ngInject
 */
nsVmap.nsToolsManager.VmapUser.prototype.vmapuserController = function ($scope, $q, $element) {
    oVmap.log("nsVmap.nsToolsManager.VmapUser.prototype.vmapuserController");

    $scope['sUserLoginText'] = sessionStorage['user_login'];

    this.$scope_ = $scope;

    this.$q_ = $q;

    /**
     * The current properties
     */
    this['properties'] = oVmap['properties'];

    /**
     * The current token
     */
    this['token'] = oVmap['properties']['token'];

    // Affiche les modales en plein écran pour la version mobile
    if (oVmap['properties']['is_mobile']) {
        $element.find('.modal').on('shown.bs.modal', function () {
            $('.modal-backdrop.fade.in').hide();
            $('.modal.fade.in').find('.modal-dialog').addClass('mobile-full-modal');
        });
    }
};

/**
 * Display the user form in display mode
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.VmapUser.prototype.vmapuserController.prototype.displayUserInfos = function () {
    oVmap.log("nsVmap.nsToolsManager.VmapUser.vmapuserController.displayUserInfos");

    var this_ = this;

    // Récupère le formulaire
    this.getUserForm_().then(function (oFormDefinition) {
        // Récupère les valeurs
        this_.getUserInfos_().then(function (oUserInfos) {

            var oFormValues = {
                'display': oUserInfos
            };

            // Affiche le formulaire
            var userInfosFormReaderScope = this_.getUserInfos_FormReaderScope();
            userInfosFormReaderScope.$evalAsync(function () {
                userInfosFormReaderScope['ctrl']['setDefinitionName']('display');
                userInfosFormReaderScope['ctrl']['setFormValues'](oFormValues);
                userInfosFormReaderScope['ctrl']['setFormDefinition'](oFormDefinition);
                userInfosFormReaderScope['ctrl']['loadForm']();
                $('#basictools-user-form-reader-modal').modal('show');
            });

        });
    });
};

/**
 * Disconnect the current user
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.VmapUser.prototype.vmapuserController.prototype.disconnect = function () {
    oVmap.log("nsVmap.nsToolsManager.VmapUser.vmapuserController.disconnect");

    angular.element(vitisApp.appMainDrtv).scope()['disconnect']();
};

/**
 * Get the user form in a promise
 * @returns {defer.promise}
 * @private
 */
nsVmap.nsToolsManager.VmapUser.prototype.vmapuserController.prototype.getUserForm_ = function () {
    oVmap.log("nsVmap.nsToolsManager.VmapUser.vmapuserController.getUserForm_");

    var deferred = this.$q_.defer();

    ajaxRequest({
        'method': 'GET',
        'url': 'modules/vitis/forms/user/user_vitis_user.json',
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'scope': this.$scope_,
        'success': function (response) {
            if (goog.isDefAndNotNull(response['data'])) {
                deferred.resolve(response['data']);
            }
        }
    });
    return deferred.promise;
};

/**
 * Get the user infos in a promise
 * @returns {defer.promise}
 * @private
 */
nsVmap.nsToolsManager.VmapUser.prototype.vmapuserController.prototype.getUserInfos_ = function () {
    oVmap.log("nsVmap.nsToolsManager.VmapUser.vmapuserController.getUserInfos_");

    var deferred = this.$q_.defer();

    ajaxRequest({
        'method': 'GET',
        'url': oVmap['properties']['api_url'] + '/vitis/users/' + sessionStorage['user_id'],
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'scope': this.$scope_,
        'success': function (response) {
            if (goog.isDefAndNotNull(response['data'])) {
                if (goog.isDefAndNotNull(response['data']['data'])) {
                    if (goog.isDefAndNotNull(response['data']['data'][0])) {
                        deferred.resolve(response['data']['data'][0]);
                    }
                }
            }
        }
    });
    return deferred.promise;
};

/**
 * Get the UserInfos FormReader scope
 * @returns {angular.scope}
 */
nsVmap.nsToolsManager.VmapUser.prototype.vmapuserController.prototype.getUserInfos_FormReaderScope = function () {
    return angular.element($('#basictools-user-form-reader').children()).scope();
};

// Définit la directive et le controller
oVmap.module.directive('appVmapUser', nsVmap.nsToolsManager.VmapUser.prototype.vmapuserDirective);
oVmap.module.controller('AppVmapUserController', nsVmap.nsToolsManager.VmapUser.prototype.vmapuserController);
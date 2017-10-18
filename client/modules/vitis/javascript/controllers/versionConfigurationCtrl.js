'use strict';

// Google closure
goog.provide("vitis.controllers.versionConfiguration");
goog.require("vitis.modules.main");

/**
 * versionConfiguration Controller.
 * Chargement des données de la version.
 * @param {angular.$log} $log Angular log service.
 * @param {angular.$scope} $scope Angular scope.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @ngInject
 **/
vitisApp.versionConfigurationCtrl = function ($log, $scope, propertiesSrvc) {
    // Initialisation
    $log.info("initVersionConfiguration");
    /**
     * getStateCssClass function.
     * .
     * @param {boolean} oState Etat de l'installation du composant.
     **/
    $scope["getStateCssClass"] = function (oState) {
        if (oState)
            return 'install-state-ok';
        else
            return 'install-state-error';
    };
    // Chargement des données de version.
    ajaxRequest({
        "method": "GET",
        "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vitis/Versions",
        "params": {"app": sessionStorage["application"]},
        "scope": $scope,
        "success": function(response) {
            if (response["data"]["status"] == 1) {
                response["data"]["VM_VERSION"] = propertiesSrvc["version"],
                response["data"]["VM_BUILD"] = propertiesSrvc["build"],
                $scope["oVersion"] = response["data"];
                $scope["oVersion"]["neededUpdate"] = true;
                if (propertiesSrvc["version"] === "trunk") {
                    delete $scope["oVersion"]["appVersion"];
                } else {
                    if($scope["oVersion"]["appVersion"] === null){
                        // Impossible de vérifier les mises à jour, vous pouvez 
                        $scope["oVersion"]["update"] = "ERROR_RETRIEVE_UPDATE_CONFIGURATION";
                    }else{
                        var version = angular.copy(propertiesSrvc["version"]).replace(".", "");
                        var versionUpdate = angular.copy($scope["oVersion"]["appVersion"]).replace(".", "");
                        if (versionUpdate > version) {
                            // Votre version n'est pas à jour, vous pouvez télécharger les mises à jour ici
                            $scope["oVersion"]["update"] = "NEEDED_UPDATE_CONFIGURATION";
                        } else {
                            // Votre version est à jour
                            $scope["oVersion"]["neededUpdate"] = false;
                            $scope["oVersion"]["update"] = "NO_NEEDED_UPDATE_CONFIGURATION";
                        }
                    }
                }
            }
        }
    });
};
vitisApp.module.controller("versionConfigurationCtrl", vitisApp.versionConfigurationCtrl);

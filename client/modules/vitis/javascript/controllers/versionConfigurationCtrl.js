// Google closure
goog.provide("vitis.controllers.versionConfiguration");
goog.require("vitis.modules.main");

/**
 * versionConfiguration Controller.
 * Chargement des données de la version.
 * @param {angular.$log} $log Angular log service.
 * @param {angular.$scope} $scope Angular scope.
 * @param {service} Restangular Service Restangular.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @ngInject
 **/
vitisApp.versionConfigurationCtrl = function ($log, $scope, Restangular, propertiesSrvc) {
        // Initialisation
        $log.info("initVersionConfiguration");
        /**
         * getStateCssClass function.
         * .
         * @param {boolean} oState Etat de l'installation du composant.
         **/
        $scope["getStateCssClass"] = function(oState){
                if (oState)
                        return 'install-state-ok';
                else
                        return 'install-state-error';
        };
        
        // Nom du service web (vitis, gtf...)
        var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vitis");
        // Charge le template de l'onglet (sections).
        var oParams = {
                "token": sessionStorage["session_token"]
        }
        oWebServiceBase["customGET"]("Versions", oParams)
                .then(function(data){
                        if (data["status"] == 1) {
                                data["VM_VERSION"] = propertiesSrvc["version"],
                                data["VM_BUILD"] = propertiesSrvc["build"],
                                $scope["oVersion"] = data;
                        }
                });
};
vitisApp.module.controller("versionConfigurationCtrl", vitisApp.versionConfigurationCtrl);

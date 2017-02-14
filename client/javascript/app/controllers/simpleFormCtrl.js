// Google closure
goog.provide("vitis.controllers.simpleForm");
goog.require("vitis.modules.main");

/**
 * simpleForm Controller.
 * 
 * .
 * 
 * @param {angular.$scope} $scope Angular scope.
 * @param {angular.$log} $log Angular log service.
 * @param {angular.$rootScope} $rootScope Angular rootScope.
 * @param {$translateProvider.$translate} $translate TranslateProvider translate service.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} modesSrvc Liste des modes et objets de l'utilisateur.
 * @ngInject
 **/
vitisApp.simpleFormCtrl = function ($scope, $log, $rootScope, $translate, envSrvc, modesSrvc) {
        $log.info("initSimpleForm");
        // Sauve le nouveau scope crée dans la définition de l'onglet. 
        modesSrvc["addScopeToObject"](envSrvc["oSelectedObject"]["name"], envSrvc["oSelectedMode"]["mode_id"], $scope);
        // Affiche un message de confirmation de validité du formulaire.
        $scope["bFormValidationMessage"] = true;
        // Attends le chargement de la structure et des données du formulaire.
        var clearListener = $rootScope.$on('formDefinitionLoaded', function(event, sFormDefinitionName) {
                // Traduction du titre du formulaire.
                var sFormTitle = envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["title"];
                var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
                $translate([sFormTitle], oFormValues).then(function (translations) {
                        envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["title"] = translations[sFormTitle];
                });
                // Supprime le "listener".
                clearListener();
        });
};
vitisApp.module.controller("simpleFormCtrl", vitisApp.simpleFormCtrl);

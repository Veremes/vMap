// Google closure
goog.provide("vitis.controllers.documentationHelp");
goog.require("vitis.modules.main");

/**
 * documentationHelp Controller.
 * .
 * @param {angular.$log} $log Angular log service.
 * @param {angular.$scope} $scope Angular scope.
 * @param {service} propertiesSrvc Paramètres des properties.
  * @ngInject
**/
vitisApp.documentationHelpCtrl = function ($log, $scope, $sce, propertiesSrvc) {
        // Initialisation
        $log.info("initDocumentationHelp");
        // Url de la doc.
        $scope["sUrlDocumentationHelp"] = $sce.trustAsResourceUrl('https://vmap.readthedocs.io/fr/latest/');
};
vitisApp.module.controller("documentationHelpCtrl", vitisApp.documentationHelpCtrl);

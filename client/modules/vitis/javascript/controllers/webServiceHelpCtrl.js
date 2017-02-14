// Google closure
goog.provide("vitis.controllers.webServiceHelp");
goog.require("vitis.modules.main");

/**
 * webServiceHelp Controller.
 * .
 * @param {angular.$log} $log Angular log service.
 * @param {angular.$scope} $scope Angular scope.
 * @param {service} propertiesSrvc Paramètres des properties.
  * @ngInject
**/
vitisApp.webServiceHelpCtrl = function ($log, $scope, propertiesSrvc) {
        // Initialisation
        $log.info("initWebServiceHelp");
        // Url de la doc.
        $scope["sUrlWebServiceDoc"] = propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["doc_alias"] + "/index.phtml";
};
vitisApp.module.controller("webServiceHelpCtrl", vitisApp.webServiceHelpCtrl);

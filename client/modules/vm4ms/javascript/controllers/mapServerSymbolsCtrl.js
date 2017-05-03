'use strict';

// Google closure
goog.provide("vitis.controllers.mapServerSymbols");
goog.require("vitis.modules.main");

/**
 * mapServerSymbols Controller.
 * .
 * @param {angular.$log} $log Angular log service.
 * @param {angular.$scope} $scope Angular scope.
 * @param {angular.$timeout} $timeout Angular timeout service.
 * @param {angular.$sce} $sce Angular sce service.
 * @param {service} Restangular Service Restangular.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} sessionSrvc Service de gestion des sessions.
 * @ngInject
 **/
vitisApp.mapServerSymbolsCtrl = function ($log, $scope, $timeout, $sce, Restangular, propertiesSrvc, envSrvc, sessionSrvc) {
        // Initialisation
        $log.info("initMapServerSymbols");
        /**
         * loadMapServerSymbols function.
         * Charge la liste des symboles.
         **/
        $scope["loadMapServerSymbols"] = function() {
            $log.info("loadMapServerSymbols");
            var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vm4ms", "mapserver");
            // Requête pour récupérer le chemin vers le fichier ".map" du service wms.
            var $oParams = {
                "token": sessionSrvc["token"]
            };
            oWebServiceBase["customGET"]("Symbols", $oParams)
                .then(function (data) {
                    if (data["status"] == 1) {
                        var oMapServerSymbols = envSrvc["extractWebServiceData"]("mapserver", data)[0];
                        var oMapServerSymbols = angular.copy(oMapServerSymbols["symbols_content"])
                        oMapServerSymbols.forEach(function(oSymbol, iSymbolIndex){
                            oSymbol["definition"].forEach(function(sDefinition, iDefinitionIndex){
                                oMapServerSymbols[iSymbolIndex]["definition"][iDefinitionIndex] = "<span>" + sDefinition.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + "</span>";
                            });
                        });
                        $scope["oMapServerSymbols"] = oMapServerSymbols;
                        $timeout(function () {
                            $(".collapse").collapse('hide');
                        });
                        
                    } else {
                        //
                        var oOptions = {
                            "className": "modal-danger"
                        };
                        // Message d'erreur ?
                        if (data["errorMessage"] != null)
                            oOptions["message"] = data["errorMessage"];
                        $scope.$root["modalWindow"]("alert", "REQUEST_ERROR", oOptions);
                    }
                });
        };
        /**
         * trustAsHtml function.
         * Valeur sans filtre.
         **/
        $scope["trustAsHtml"] = function(value) {
            return $sce.trustAsHtml(value);
        };        
        //
        $scope["loadMapServerSymbols"]();
};
vitisApp.module.controller("mapServerSymbolsCtrl", vitisApp.mapServerSymbolsCtrl);

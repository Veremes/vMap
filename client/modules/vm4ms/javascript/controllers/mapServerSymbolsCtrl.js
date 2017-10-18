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
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} sessionSrvc Service de gestion des sessions.
 * @ngInject
 **/
vitisApp.mapServerSymbolsCtrl = function ($log, $scope, $timeout, $sce, propertiesSrvc, envSrvc, sessionSrvc) {
        // Initialisation
        $log.info("initMapServerSymbols");
        /**
         * loadMapServerSymbols function.
         * Charge la liste des symboles.
         **/
        $scope["loadMapServerSymbols"] = function() {
            $log.info("loadMapServerSymbols");
            ajaxRequest({
                "method": "GET",
                "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vm4ms/mapserver/Symbols",
                "scope": $scope,
                "success": function(response) {
                    if (response["data"]["status"] == 1) {
                        var oMapServerSymbols = envSrvc["extractWebServiceData"]("mapserver", response["data"])[0];
                        var oMapServerSymbols = angular.copy(oMapServerSymbols["symbols_content"])
                        oMapServerSymbols.forEach(function(oSymbol, iSymbolIndex){
                            oSymbol["definition"].forEach(function(sDefinition, iDefinitionIndex){
                                oMapServerSymbols[iSymbolIndex]["definition"][iDefinitionIndex] = "<span>" + sDefinition.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + "</span>";
                            });
                        });
                        $scope["oMapServerSymbols"] = oMapServerSymbols;
                    } else {
                        //
                        var oOptions = {
                            "className": "modal-danger"
                        };
                        // Message d'erreur ?
                        if (response["data"]["errorMessage"] != null)
                            oOptions["message"] = response["data"]["errorMessage"];
                        $scope.$root["modalWindow"]("alert", "REQUEST_ERROR", oOptions);
                    }
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

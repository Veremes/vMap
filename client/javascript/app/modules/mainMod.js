/* global goog, vitisApp, oApplicationFiles */

'use strict';

// Google closure
goog.provide("vitis.modules.main");
goog.require('vitis');
goog.require('vitis.loadApp');
goog.require('vitis.application.config');

// Module.
var aModuleDependencies = ["ui.grid", "ui.grid.selection", "ui.grid.pagination", "ui.grid.moveColumns", "ui.grid.resizeColumns", "pascalprecht.translate", "restangular", "angular.bind.notifier", "formReader"];
aModuleDependencies = aModuleDependencies.concat(oApplicationFiles["vitisModuleDependencies"]);

vitisApp.module = angular.module("vitisApp", aModuleDependencies);

// Services.
vitisApp.module.service("sessionSrvc", vitisApp.sessionSrvc);
vitisApp.module.service("envSrvc", vitisApp.envSrvc);
vitisApp.module.service("modesSrvc", vitisApp.modesSrvc);
vitisApp.module.value("userSrvc", vitisApp.userSrvc);
vitisApp.module.service("externFunctionSrvc", vitisApp.externFunctionSrvc);
vitisApp.module.service("propertiesSrvc", vitisApp.propertiesSrvc);
vitisApp.module.service("formSrvc", vitisApp.formSrvc);

/**
 * Module config
 * 
 * @param {angular.$httpProvider} $httpProvider Angular httpProvider service.
 * @param {angular.$translateProvider} $translateProvider Angular translateProvider service.
 * @param {angular.$translatePartialLoaderProvider} $translatePartialLoaderProvider Angular translatePartialLoaderProvider service.
 * @param {angular.$logProvider} $logProvider Angular logProvider service.
 * @param {angular.$compileProvider} $compileProvider Angular compileProvider service.
 * @param {angular.$controllerProvider} $controllerProvider Angular controllerProvider service.
 * @param {angular.$provide} $provide Angular provide service.
 * @param {angular.$injector} $injector Angular injector service.
 * @param {service} RestangularProvider RestangularProvider service.
 * @ngInject
 **/
vitisApp.config = function ($httpProvider, $translateProvider, $translatePartialLoaderProvider, $logProvider, $compileProvider, $controllerProvider, $provide, $injector, RestangularProvider) {

    // Futur équivalent à properties['debug_mode']
    var debugMode = false;

    vitisApp.on('properties_loaded', function () {
        var properties = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["propertiesSrvc"]);
        debugMode = properties['debug_mode'];
    });

    $logProvider["debugEnabled"](true);
    $provide.decorator('$log', ['$delegate', function ($delegate) {
            return {
                error: function (text) {
                    $delegate.error(text);
                },
                info: function (text) {
                    if (debugMode)
                        $delegate.info(text);
                },
                log: function (text) {
                    if (debugMode)
                        $delegate.log(text);
                },
                warn: function (text) {
                    $delegate.warn(text);
                }
            };
        }]);

    // Force l'entête pour les requêtes POST / PUT (sinon entête json : inconnu de php).
    //$httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=UTF-8';
    //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    // Paramètrage du module de traduction.
    $translateProvider["useLoader"]("$translatePartialLoader", {
        "urlTemplate": "{part}/lang-{lang}.json"
    });
    // Charge le fichier de langue de vitis.
    $translatePartialLoaderProvider["addPart"]('lang');
    // Langue par défaut.
    $translateProvider["preferredLanguage"]('fr');
    // Echappement des tags html.
    //$translateProvider["useSanitizeValueStrategy"]('escape');
    // 
    //RestangularProvider.setBaseUrl('/rest'); // -> récupérer la propertie "services_alias".
    //RestangularProvider.setDefaultRequestParams({"apikey": "secret key"});
    RestangularProvider["setDefaultHeaders"]({"Accept": "application/json"});
    // Sauve le service "RestangularProvider" pour l'utiliser plus tard.
    vitisApp["RestangularProvider"] = RestangularProvider;
    //
    /*
     $httpProvider.interceptors.push(function () {
     return {
     'responseError': function (rejection) {
     if (rejection.status === 401) {
     console.log("Déconnexion");
     }
     }
     };
     });        
     */
    //vitisApp.controllerProvider = $controllerProvider; // Registering a controller after app bootstrap
    vitisApp["compileProvider"] = $compileProvider; // Registering a directive after app bootstrap
    //vitisApp.routeProvider = $routeProvider;
    //vitisApp.filterProvider = $filterProvider;
    //vitisApp.provide = $provide;       
    // Interception des requêtes ajax d'angular.
    $httpProvider.interceptors.push(function () {
        return {
            // Chargement.
            "request": function (config) {
                // Paramètre "version" dans toutes les requêtes.
                if (config["url"].indexOf("ui-grid/") == -1) {
                    if (typeof (config["params"]) == "undefined")
                        config["params"] = {"vitis_version": oClientProperties['build']};
                    else
                        config["params"]["vitis_version"] = oClientProperties['build'];
                }
                // Affiche le loader.
                if (sessionStorage["ajaxLoader"] == "true")
                    showAjaxLoader();
                // Maj du compteur des téléchargements en cours.
                var iLoadingCounter = parseInt(sessionStorage["loading_counter"]);
                iLoadingCounter++;
                sessionStorage["loading_counter"] = iLoadingCounter;
                return config;
            },
            // Chargement terminée.
            "response": function (response) {
                // Erreur passé dans la réponse de la requête ?
                if (typeof (response["data"] == "object") && typeof (response["data"]["errorCode"]) != "undefined") {
                    // Cache la fenêtre modale de chargement.
                    hideAjaxLoader();
                    //
                    var sessionSrvc = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["sessionSrvc"]);
                    var externFunctionSrvc = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["externFunctionSrvc"]);
                    var oOptions = {
                        "className": "modal-danger",
                        "buttons": {
                            "ok": {
                                label: "OK",
                                className: "btn-default"
                            }
                        },
                        "callback": function () {
                            sessionSrvc["disconnect"]();
                        }
                    };
                    var sTitle = "";
                    switch(response["data"]["errorCode"]) {
                        // Token expiré.
                        case 15:
                            // Paramètres de la fenêtre modale.
                            oOptions["message"] = "EXPIRED_TOKEN_ERROR";
                            sTitle = "EXPIRED_TOKEN_ERROR_TITLE";
                            break;
                        // Token invalide.
                        case 16:
                            // Paramètres de la fenêtre modale.
                            oOptions["message"] = "INVALID_TOKEN_ERROR";
                            sTitle = "INVALID_TOKEN_ERROR_TITLE";
                            break;
                    }
                    // Affichage de la fenêtre modale.
                    if (goog.isDef(oOptions["message"]))
                        externFunctionSrvc["modalWindow"]("alert", sTitle, oOptions);
                } else {
                    // Maj du compteur des téléchargements en cours.
                    var iLoadingCounter = parseInt(sessionStorage["loading_counter"]);
                    if (iLoadingCounter > 0)
                        iLoadingCounter--;
                    else
                        iLoadingCounter = 0;
                    sessionStorage["loading_counter"] = iLoadingCounter;
                    // Si tous les chargements sont terminés : supprime le loader.
                    if (iLoadingCounter == 0)
                        hideAjaxLoader();
                }
                return response;
            },
            "requestError": function (rejection) {
                console.error("requestError", rejection);
                return rejection;
            },
            "responseError": function (rejection) {
                console.error("responseError", rejection);
                // Supprime le loader ajax.
                hideAjaxLoader();
                return rejection;
            }
        };
    });
    // Modification du gestionnaire d'erreur d'Angular pour afficher les erreurs.
    if (sessionStorage['debug'] == "true") {
        $provide.decorator("$exceptionHandler", ['$delegate', function($delegate) {
            return function(exception, cause) {
                $delegate(exception, cause);
                // Injection des services.
                var envSrvc = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["envSrvc"]);
                var externFunctionSrvc = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["externFunctionSrvc"]);
                var sHeader = "<b>Mode: " + envSrvc["oSelectedMode"]["title"] + " / " + "Onglet: " + envSrvc["oSelectedObject"]["label"] + "</b><br>";
                var oOptions = {
                    "className": "modal-danger modal-error-log",
                    "message": "<div>" + sHeader + exception["stack"].replace(/[\n\r]/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + "</div>",
                    "buttons": {
                        "ok": {
                            label: "OK",
                            className: "btn-default"
                        }
                    },
                    "callback": function () {
                    }
                };
                // Affichage de la fenêtre modale.
                externFunctionSrvc["modalWindow"]("alert", exception["name"] + ": " + exception["message"], oOptions);
            };
        }]);
    }
};
vitisApp.module.config(vitisApp.config);
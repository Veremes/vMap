/* global goog */
'use strict';

// Google closure
goog.provide("vitis.controllers.htmlForm");

/**
 * htmlForm Controller.
 * Chargement des données et de la structure d'un formulaire.
 * @param {angular.$scope} $scope Angular scope.
 * @param {angular.$log} $log Angular log service.
 * @param {service} $q Angular q service.
 * @param {angular.$timeout} $timeout Angular timeout service.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} sessionSrvc Service de gestion des sessions.
 * @param {service} externFunctionSrvc Fonctions externes à Angular.
 * @ngInject
 **/
vitisApp.htmlFormCtrl = function ($scope, $log, $q, $timeout, envSrvc, propertiesSrvc, sessionSrvc, externFunctionSrvc) {
    $log.info("initHtmlForm");
    $scope["oFormScope"] = $scope;
    $scope["oProperties"] = propertiesSrvc;
    $scope["sToken"] = sessionSrvc['token'];
    
    if (typeof destructor_form === "function") {
        destructor_form();
    }

    // Nom du formulaire.
    if (typeof ($scope["sFormDefinitionName"]) == "undefined")
        $scope["sFormDefinitionName"] = envSrvc["sFormDefinitionName"];
    //
    var deferred = $q.defer();
    var promise = deferred.promise;
    var sTable = envSrvc["oSelectedObject"]["name"];
    var sResourceId = envSrvc["getSectionWebServiceResourceId"]();
    // Formulaire dans une section ?
    if (typeof (sTable) != "undefined") {
        var sSectionName = "";
        if (envSrvc["oSelectedObject"]["sections"].length > 1) {
            //if (envSrvc["sMode"] != "search") {
            // Si 1ere section (general) : pas de nom de section dans le nom du fichier de form.
            var oSectionForm = envSrvc["oSectionForm"][sTable];
            if (typeof (oSectionForm) != "undefined" && !goog.object.isEmpty(oSectionForm))
                if (oSectionForm["iSelectedSectionIndex"] != 0)
                    sSectionName = oSectionForm["sections"][oSectionForm["iSelectedSectionIndex"]]["name"];
            //}
        }
    }
    // Objet des valeurs de form. vide par défaut.
    if (typeof (envSrvc["oFormValues"][$scope["sFormDefinitionName"]]) == "undefined")
        envSrvc["oFormValues"][$scope["sFormDefinitionName"]] = {};
    // Données de formulaire à charger ?
    if (typeof ($scope["bLoadFormValues"]) != "boolean")
        $scope["bLoadFormValues"] = true;
    if (sResourceId != null && (envSrvc["sMode"] == "update" || envSrvc["sMode"] == "display") && $scope["bLoadFormValues"] === true) {
        $log.info("initHtmlForm : Form. values");
        var aResourceId = envSrvc["explodeWebServiceResourceId"](sResourceId);
        // Charge les données du formulaire.
        ajaxRequest({
            "method": "GET",
            "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/" + aResourceId[0] + "/" + aResourceId[1] + "/" + envSrvc["sId"],
            "scope": $scope,
            "success": function(response) {
                if (response["data"]["status"] == 1) {
                    envSrvc["oFormValues"][$scope["sFormDefinitionName"]] = {};
                    // Extraction des données.
                    envSrvc["oFormValues"][$scope["sFormDefinitionName"]] = envSrvc["extractWebServiceData"](aResourceId[1], response["data"])[0];
                    // Sauvegarde (valeurs par défaut).
                    envSrvc["oFormDefaultValues"][$scope["sFormDefinitionName"]] = angular.copy(envSrvc["oFormValues"][$scope["sFormDefinitionName"]]);
                    // Affichage du formulaire.
                    deferred.resolve("load form. def.");
                } else {
                    // Message d'erreur.
                    var oOptions = {
                        "className": "modal-danger",
                        "buttons": {
                            "ok": {
                                label: "OK",
                                className: "btn-default"
                            }
                        }
                    };
                    if (response["data"]["errorMessage"] != null)
                        oOptions["message"] = response["data"]["errorMessage"];
                    externFunctionSrvc["modalWindow"]("alert", "FORM_VALUES_LOADING_ERROR", oOptions);
                }
            }
        });
    } else {
        // Si mode "insert" : suppression des données d'un ancien formulaire.
        if (envSrvc["sMode"] == "insert") {
            envSrvc["oFormValues"][$scope["sFormDefinitionName"]] = {};
            envSrvc["oFormDefaultValues"][$scope["sFormDefinitionName"]] = {};
        }
        // timeout sinon problème de synchro aléatoire (form. json chargé avant le formreader).
        $timeout(function () {
            deferred.resolve("load form. def.");
        });
    }
    // Structure de formulaire à charger ?
    if (typeof (sTable) != "undefined") {
        var oFormRequestParams = {};
        // Paramètres de la requête ajax du form. passée dans le scope ?
        if ($scope["oFormRequestParams"] != null)
            oFormRequestParams = $scope["oFormRequestParams"];
        else {
            oFormRequestParams["sUrl"] = "modules/" + envSrvc["oSelectedMode"]["module_name"] + "/forms/" + envSrvc["oSelectedMode"]["mode_id"] + "/" + sTable;
            // Formulaire dans une section ?
            if (sSectionName != "")
                oFormRequestParams["sUrl"] += "_" + sSectionName;
            oFormRequestParams["sUrl"] += ".json";
        }
        // Paramètre "config" pour $http.
        var oRequestConfig = {
            "params": oFormRequestParams["oParams"]
        };
        if (typeof(oFormRequestParams["oHeaders"]) != "undefined")
            oRequestConfig["headers"] = oFormRequestParams["oHeaders"];
        // Chargement de la structure du formulaire.
        $log.info("initHtmlForm : Form. def. : " + oFormRequestParams["sUrl"]);
        promise.then(function () {            
            ajaxRequest({
                "method": "GET",
                "url": oFormRequestParams["sUrl"],
                "params": oRequestConfig["params"],
                "headers": oRequestConfig["headers"],
                "scope": $scope,
                "success": function(response) {
                    if (response["data"].status != 0) {
                        // Attend que les données du form. soient chargées.
                        envSrvc["oFormDefinition"][$scope["sFormDefinitionName"]] = {};
                        var sJs = "";
                        var sCss = "";
                        var k = "";
                        for (var key in response["data"]) {
                            if (Array.isArray(response["data"][key])) {
                                sJs = response["data"][key][0]["json_form"][1];
                                sCss = response["data"][key][0]["json_form"][2];
                                k = key;
                            }
                        }                            
                        //if(goog.isDef)
                        //response["data"][k][0] = response["data"][k][0]["json_form"];
                        // Fonction à appeler pour extraire la structure du form. ?
                        if (typeof (oFormRequestParams["sExtractData"]) != "undefined") {
                            oFormRequestParams["oData"] = response["data"];
                            //console.warn(angular.copy(response["data"]), 3);
                            //console.warn(angular.copy(oFormRequestParams), 3);
                            response["data"] = $scope.$eval(oFormRequestParams["sExtractData"]);
                        }

                        // Structure de formulaire non vide ?
                        if (response["data"] != null) {
                            if (goog.isDef(response["data"]['datasources']))
                                var datasources = angular.copy(response["data"]['datasources']);

                            response["data"] = response["data"][envSrvc["sMode"]];

                            // Maj de la sctructure.
                            envSrvc["oFormDefinition"][$scope["sFormDefinitionName"]] = response["data"];
                            envSrvc["oFormDefinition"][$scope["sFormDefinitionName"]]["JS_url"] = sJs;
                            envSrvc["oFormDefinition"][$scope["sFormDefinitionName"]]["CSS_url"] = sCss;
                            // Charge le fichier js associé au formulaire.
                            if (sJs != "" && response["data"]["javascript"] !== false)
                                response["data"]["javascript"] = true;
                            // Ajout/remplacement des datasources
                            if (goog.isDefAndNotNull(datasources))
                                envSrvc['oFormDefinition']['datasources'] = datasources;

                            // Emission d'un évènement de chargement des données et de la définition du formulaire.
                            $scope.$root.$emit("formDefinitionLoaded", $scope["sFormDefinitionName"]);
                            if (response["data"]["javascript"] === true) {
                                var sUrl = "";
                                if (oFormRequestParams["sUrl"].indexOf(".json") === -1) {
                                    //var prop = $scope["oProperties"];
                                    //var id = $scope["oFormValues"]["my_work_user_order_insert_form"]["workspace_id"]["selectedOption"]["value"];
                                    sUrl = sJs;
                                } else {
                                    sUrl = oFormRequestParams["sUrl"].replace(/.json/g, ".js");
                                }
                                $log.info("initHtmlForm : javascript assoc. to : " + oFormRequestParams["sUrl"]);
                                loadExternalJs([sUrl], {
                                    "callback": function () {
                                        angular.element(vitisApp.appHtmlFormDrtv).ready();
                                        if (typeof(constructor_form) == "function")
                                            constructor_form($scope, sUrl);
                                    },
                                    "async": true,
                                    "scriptInBody": true
                                });
                            }
                        }
                        $scope["oFormRequestParams"] = null;

                    } else {
                        envSrvc["oFormDefinition"][$scope["sFormDefinitionName"]] = {};
                        envSrvc["oFormValues"][$scope["sFormDefinitionName"]] = {};
                        envSrvc["oFormDefaultValues"][$scope["sFormDefinitionName"]] = {};
                        // Message d'erreur.
                        var oOptions = {
                            "className": "modal-danger",
                            "buttons": {
                                "ok": {
                                    label: "OK",
                                    className: "btn-default"
                                }
                            }
                        };
                        if (response["data"]["errorMessage"] != null)
                            oOptions["message"] = response["data"]["errorMessage"];
                        externFunctionSrvc["modalWindow"]("alert", "FORM_DEFINITION_LOADING_ERROR", oOptions);
                        //$scope.$root.$emit("formDefinitionLoaded", "empty");
                    }
                }
            });
        });
    }
};
vitisApp.module.controller("htmlFormCtrl", vitisApp.htmlFormCtrl);

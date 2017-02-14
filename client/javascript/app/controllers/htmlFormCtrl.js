/* global goog */

// Google closure
goog.provide("vitis.controllers.htmlForm");

/**
 * htmlForm Controller.
 * Chargement des données et de la structure d'un formulaire.
 * @param {angular.$scope} $scope Angular scope.
 * @param {angular.$http} $http Angular http service.
 * @param {angular.$log} $log Angular log service.
 * @param {service} $q Angular q service.
 * @param {service} Restangular Service Restangular.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} sessionSrvc Service de gestion des sessions.
 * @param {service} externFunctionSrvc Fonctions externes à Angular.
 * @ngInject
 **/
vitisApp.htmlFormCtrl = function ($scope, $http, $log, $q, Restangular, envSrvc, propertiesSrvc, sessionSrvc, externFunctionSrvc) {
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
        // Nom du service web (vitis, gtf...)
        var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/" + aResourceId[0], aResourceId[1]);
        // Charge les données du formulaire.
        oWebServiceBase["customGET"](envSrvc["sId"], {"token": sessionSrvc["token"]})
                .then(function (data) {
                    if (data["status"] == 1) {
                        envSrvc["oFormValues"][$scope["sFormDefinitionName"]] = {};
                        // Extraction des données.
                        envSrvc["oFormValues"][$scope["sFormDefinitionName"]] = envSrvc["extractWebServiceData"](aResourceId[1], data)[0];
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
                        if (data["errorMessage"] != null)
                            oOptions["message"] = data["errorMessage"];
                        externFunctionSrvc["modalWindow"]("alert", "FORM_VALUES_LOADING_ERROR", oOptions);
                    }
                });
    } else {
        // Si mode "insert" : suppression des données d'un ancien formulaire.
        if (envSrvc["sMode"] == "insert") {
            envSrvc["oFormValues"][$scope["sFormDefinitionName"]] = {};
            envSrvc["oFormDefaultValues"][$scope["sFormDefinitionName"]] = {};
        }
        deferred.resolve("load form. def.");
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
            $http.get(oFormRequestParams["sUrl"], oRequestConfig).
                    success(function (data, status, headers, config) {                        
                        if (data.status != 0) {
                            // Attend que les données du form. soient chargées.
                            envSrvc["oFormDefinition"][$scope["sFormDefinitionName"]] = {};
                            var sJs = "";
                            var sCss = "";
                            var k = "";
                            for (var key in data) {
                                if (Array.isArray(data[key])) {
                                    sJs = data[key][0]["json_form"][1];
                                    sCss = data[key][0]["json_form"][2];
                                    k = key;
                                }
                            }                            
                            //if(goog.isDef)
                            //data[k][0] = data[k][0]["json_form"];
                            // Fonction à appeler pour extraire la structure du form. ?
                            if (typeof (oFormRequestParams["sExtractData"]) != "undefined") {
                                oFormRequestParams["oData"] = data;
                                //console.warn(angular.copy(data), 3);
                                //console.warn(angular.copy(oFormRequestParams), 3);
                                data = $scope.$eval(oFormRequestParams["sExtractData"]);
                            }
                            
                            // Structure de formulaire non vide ?
                            if (data != null) {
                                if (goog.isDef(data['datasources']))
                                    var datasources = angular.copy(data['datasources']);

                                data = data[envSrvc["sMode"]];

                                // Maj de la sctructure.
                                envSrvc["oFormDefinition"][$scope["sFormDefinitionName"]] = data;
                                envSrvc["oFormDefinition"][$scope["sFormDefinitionName"]]["JS_url"] = sJs;
                                envSrvc["oFormDefinition"][$scope["sFormDefinitionName"]]["CSS_url"] = sCss;

                                // Ajout/remplacement des datasources
                                if (goog.isDefAndNotNull(datasources))
                                    envSrvc['oFormDefinition']['datasources'] = datasources;

                                // Emission d'un évènement de chargement des données et de la définition du formulaire.
                                $scope.$root.$emit("formDefinitionLoaded", $scope["sFormDefinitionName"]);

                                if (data["javascript"] === true) {
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
                            if (data["errorMessage"] != null)
                                oOptions["message"] = data["errorMessage"];
                            externFunctionSrvc["modalWindow"]("alert", "FORM_DEFINITION_LOADING_ERROR", oOptions);
                            //$scope.$root.$emit("formDefinitionLoaded", "empty");
                        }
                    }).
                    error(function (data, status, headers, config) {
                    });
        });
    }
};
vitisApp.module.controller("htmlFormCtrl", vitisApp.htmlFormCtrl);

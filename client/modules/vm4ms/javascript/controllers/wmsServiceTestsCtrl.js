/* global goog, ol, nsVitisComponent */

'use strict';

// Google closure
goog.provide("vitis.controllers.wmsServiceTests");
goog.require("vitis.modules.main");

/**
 * wmsServiceTests Controller.
 * .
 * @param {angular.$log} $log Angular log service.
 * @param {angular.$scope} $scope Angular scope.
 * @param {angular.$templateRequest} $templateRequest Angular templateRequest service.
 * @param {angular.$compile} $compile Angular compile.
 * @param {angular.$timeout} $timeout Angular timeout service.
 * @param {angular.$rootScope} $rootScope Angular rootScope.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} sessionSrvc Service de gestion des sessions.
 * @param {service} formSrvc Service de gestion des formulaires.
 * @param {service} modesSrvc Liste des modes et objets de l'utilisateur.
 * @ngInject
 **/
vitisApp.wmsServiceTestsCtrl = function ($log, $scope, $templateRequest, $compile, $timeout, $rootScope, propertiesSrvc, envSrvc, sessionSrvc, formSrvc, modesSrvc) {
    // Initialisation
    $log.info("initWmsServiceTests");
    // Etat de l'affichage des onglets.
    $scope["aWmsServiceTestTabs"] = {
        "get_capabilities": {
            "loaded": false
        },
        "openlayers_test": {
            "loaded": false
        },
        "maplayer_test": {
            "loaded": false
        },
        "mapserver_log": {
            "loaded": false,
            "file_content": ""
        },
        "map_file": {
            "loaded": false
        }
    };

    // Sauve le nouveau scope crée dans la définition de l'onglet. 
    modesSrvc["addScopeToObject"](envSrvc["oSelectedObject"]["name"], envSrvc["oSelectedMode"]["mode_id"], $scope);

    /**
     * showWmsServiceGetCapabilities function.
     * Affiche le résultat du "GetCapibilities" du flux WMS dans l'éditeur CodeMirror.
     * @param {boolean} bRefresh Force le raffraichissement de l'onglet.
     **/
    $scope["showWmsServiceGetCapabilities"] = function (bRefresh) {
        $log.info("showWmsServiceGetCapabilities");
        if (goog.isDefAndNotNull(propertiesSrvc["ms_cgi_url"]) && propertiesSrvc["ms_cgi_url"] != "") {
            if (!$scope["aWmsServiceTestTabs"]["get_capabilities"]["loaded"] || bRefresh === true) {
                // Requête pour créer et récupérer le fichier ".map" du service wms.
                var oFormData = new FormData();
                oFormData.append("wmsservice_id", envSrvc["sId"]);
                oFormData.append("type", "test");
                if (typeof (envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]) != "undefined") {
                    var sUserLogin = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["wms_service_login"];
                    var sUserPassword = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["wms_service_password"];
                    if (goog.isDefAndNotNull(sUserLogin) && goog.isDefAndNotNull(sUserPassword)) {
                        oFormData.append("user_login", sUserLogin);
                        oFormData.append("user_password", sUserPassword);
                    }
                }
                ajaxRequest({
                    "method": "POST",
                    "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vm4ms/WmsServices/MapFile",
                    "data": oFormData,
                    "scope": $scope,
                    "success": function (response) {
                        if (response["data"]["status"] == 1) {
                            var oWmsService = envSrvc["extractWebServiceData"]("wmsservices", response["data"])[0];
                            var sServiceUrl = propertiesSrvc["ms_cgi_url"] + "/test/" + oWmsService["map_file_hash"];
                            if (envSrvc["sId"] != propertiesSrvc["private_wms_service"])
                                sServiceUrl += "_" + oWmsService["wmsservice_id"];
                            $scope["aWmsServiceTestTabs"]["map_file_hash"] = oWmsService["map_file_hash"];
                            $scope.$root["getCapabilities"](sServiceUrl, {"showErrorMessage": false}).then(function (oGetCapabilities) {
                                if (goog.isDefAndNotNull(oGetCapabilities)) {
                                    $scope["aWmsServiceTestTabs"]["get_capabilities"]["oCodeMirrorEditor"]["setValue"](oGetCapabilities["xml"]);
                                    $scope["oGetCapabilities"] = oGetCapabilities;
                                    $scope["oGetCapabilities"]["service_url"] = sServiceUrl;
                                    if (typeof (oWmsService["layers_sources"]) != "undefined")
                                        $scope["oGetCapabilities"]["layers_sources"] = oWmsService["layers_sources"];
                                } else {
                                    // Affiche la section des logs en cas d'erreur.
                                    $timeout(function () {
                                        // Cache les onglets "GetCapabilities", "MapServer" et "OL3".
                                        document.querySelector(".wms-service-tests .nav-tabs > li:nth-child(1)").style.display = "none";
                                        document.querySelector(".wms-service-tests .nav-tabs > li:nth-child(2)").style.display = "none";
                                        document.querySelector(".wms-service-tests .nav-tabs > li:nth-child(3)").style.display = "none";
                                        // Affiche les logs.
                                        document.querySelector(".wms-service-tests .nav-tabs > li > a[aria-controls='wms_service_tests_wms_service_log']").click();
                                    });
                                }
                            });
                        } else {
                            // Supprime le précédent getCapabilities.
                            delete $scope["oGetCapabilities"];
                            // Vide les onglets
                            $scope["clearWmsServiceTestsTabs"]();
                            // Rechargement obligatoire de tous les onglets.
                            $scope["aWmsServiceTestTabs"]["get_capabilities"]["loaded"] = false;
                            $scope["aWmsServiceTestTabs"]["openlayers_test"]["loaded"] = false;
                            $scope["aWmsServiceTestTabs"]["maplayer_test"]["loaded"] = false;
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
                //
                $scope["aWmsServiceTestTabs"]["get_capabilities"]["loaded"] = true;
            }
        } else {
            var oOptions = {
                "className": "modal-danger",
                "message": "ERROR_MS_CGI_URL_CONFIGURATION_CONFIGURATION_VM4MS_CONFIG"
            };
            $scope.$root["modalWindow"]("dialog", "REQUEST_ERROR", oOptions);
        }
    };

    /**
     * testWmsServiceWithOpenLayers function.
     * Affiche le flux WMS avec OpenLayers.
     * @param {boolean} bRefresh Force le raffraichissement de l'onglet.
     **/
    $scope["testWmsServiceWithOpenLayers"] = function (bRefresh) {
        $log.info("testWmsServiceWithOpenLayers");
        if (goog.isDefAndNotNull(propertiesSrvc["ms_cgi_url"]) && propertiesSrvc["ms_cgi_url"] != "") {
            if (!$scope["aWmsServiceTestTabs"]["openlayers_test"]["loaded"] || bRefresh === true) {
                if (typeof ($scope["oGetCapabilities"]) != "undefined" && typeof ($scope["oGetCapabilities"]["json"]) != "undefined") {
                    // Formulaire spécifique.
                    $scope["sFormDefinitionName"] = envSrvc["sFormDefinitionName"] + "_openlayers_test";
                    $scope["oFormRequestParams"] = {
                        "sUrl": "modules/" + envSrvc["oSelectedMode"]["module_name"] + "/forms/" + envSrvc["oSelectedMode"]["mode_id"] + "/vm4ms_vm4ms_web_service_openlayers_test.json"
                    };
                    // Vide le conteneur de la carte vMap.
                    $("#wms_service_tests_wms_service_ol_map").empty();
                    // Compilation du template de formulaire.
                    $templateRequest("templates/formTpl.html").then(function (sTemplate) {
                        $compile($("#wms_service_tests_wms_service_ol_map").html(sTemplate).contents())($scope);
                        //
                        var clearListener = $scope.$root.$on('formDefinitionLoaded', function () {
                            // Supprime le "listener".
                            clearListener();
                            // 1ere projection compatible.
                            var sProj = $scope.$root["proj"]["projections"][0]["code"];
                            if (typeof ($scope["oGetCapabilities"]["json"]["Capability"]["Layer"]) != "undefined") {
                                $scope.$root["proj"]["projections"].forEach(function (oProjection) {
                                    var iProjIndex = $scope["oGetCapabilities"]["json"]["Capability"]["Layer"]["CRS"].indexOf(oProjection["code"]);
                                    if (iProjIndex != -1 && typeof (sProj) == "undefined")
                                        sProj = $scope["oGetCapabilities"]["json"]["Capability"]["Layer"]["CRS"][iProjIndex];
                                });
                            }
                            var oMapFormElement = formSrvc["getFormElementDefinition"]("wms_service_test_map", $scope["sFormDefinitionName"]);
                            oMapFormElement["map_options"]["bLayersTreeOpen"] = true;
                            oMapFormElement["map_options"]["proj"] = sProj;
                            oMapFormElement["map_options"]["tree"]["children"][0]["view"]["projection"] = sProj;

                            // Ajoute les projections manquantes.
                            nsVitisComponent.Map.prototype.addCustomProjections();
                            // Etendues.
                            if (goog.isDefAndNotNull($scope["oGetCapabilities"]["json"]["Capability"]["Layer"])) {
                                oMapFormElement["map_options"]["center"]["extent"] = ol.proj.transformExtent($scope["oGetCapabilities"]["json"]["Capability"]["Layer"]["EX_GeographicBoundingBox"], "EPSG:4326", sProj);
                            } else {
                                var oExtents = {
                                    'EPSG:3857': [-1901744.2199433097, 4779520.942381757, 2501744.2199433097, 7220479.057618243],
                                    'EPSG:2154': [-2648.2345550218597, 6231825.554877603, 7024177.333740164, 7024177.333740164],
                                    'EPSG:4326': [-4.6307373046875, 42.802734375, 51.0205078125, 51.0205078125]
                                };
                                if (goog.isDefAndNotNull(oExtents[sProj])) {
                                    oMapFormElement["map_options"]["center"]["extent"] = oExtents[sProj];
                                }
                            }
                            oMapFormElement["map_options"]["tree"]["children"][0]["view"]["extent"] = oMapFormElement["map_options"]["center"]["extent"];
                            //oMapFormElement["map_options"]["tree"]["children"][0]["view"]["extent"] = $scope["oGetCapabilities"]["json"]["Capability"]["Layer"]["Layer"][0]["EX_GeographicBoundingBox"];
                            //oMapFormElement["map_options"]["tree"]["children"][0]["view"]["extent"] = $scope["oGetCapabilities"]["json"]["Capability"]["Layer"]["Layer"][0]["BoundingBox"][0]["extent"];
                            // Couches du flux WMS.
                            if (typeof ($scope["oGetCapabilities"]["json"]["Capability"]["Layer"]) != "undefined") {

                                var oService = {
                                    "name": 'Service',
                                    "children": []
                                };

                                var aLayers = angular.copy($scope["oGetCapabilities"]["json"]["Capability"]["Layer"]["Layer"]);

                                // Réordonne les couches à afficher par nom
                                aLayers.sort(function (a, b) {
                                    return a["Name"].localeCompare(b["Name"]);
                                });

                                aLayers.forEach(function (oLayer, iLayerIndex) {
                                    // Définition de la couche.
                                    var oChildrenLayer = {
                                        "name": oLayer["Name"],
                                        "layerType": "imagewms",
                                        "visible": false,
                                        "legend": "true",
                                        "select": true,
                                        "url": $scope["oGetCapabilities"]["service_url"],
                                        "params": {
                                            "LAYERS": oLayer["Name"],
                                            "VERSION": "1.3.0",
                                            "TIMESTAMP": new Date().getTime()
                                        },
                                        "index": iLayerIndex + 1
                                    };
                                    // Source de la couche.
                                    if (typeof ($scope["oGetCapabilities"]["layers_sources"][oLayer["Name"]]) != "undefined") {
                                        oChildrenLayer["attributions"] = [
                                            new ol.Attribution({
                                                html: $scope["oGetCapabilities"]["layers_sources"][oLayer["Name"]]
                                            })
                                                    //ol.source.OSM.ATTRIBUTION
                                        ];
                                    }
                                    // Ajout de la couche.
                                    oService['children'].push(oChildrenLayer);
                                });

                                // Ajout du service.
                                oMapFormElement["map_options"]["tree"]["children"].push(oService);
                            }
                            // Attends la création de la carte.
                            var clearListener2 = $scope.$root.$on("OpenLayersMapCreated", function (event, oMap) {
                                // Supprime le "listener".
                                clearListener2();
                                // Affichage des sources.
                                oMap.MapObject.addControl(new ol.control.Attribution());
                                // Evènement déclenché pas OpernLayers en cas d'erreur de chargement sur une des couches.
                                $scope["aEventKey"] = [];
                                oMap.MapObject.getLayers().getArray().forEach(function (oLayer) {
                                    if (oLayer instanceof ol.layer.Image) {
                                        $scope["aEventKey"][$scope["aEventKey"].length] = oLayer.getSource().on(["imageloaderror", "tileloaderror"], function (event) {
                                            $rootScope["displayLayerLoadingError"](event);
                                        });
                                    }
                                });
                            });
                        });
                    });
                    //
                    $scope["aWmsServiceTestTabs"]["openlayers_test"]["loaded"] = true;
                }
            }
        } else {
            var oOptions = {
                "className": "modal-danger",
                "message": "ERROR_MS_CGI_URL_CONFIGURATION_CONFIGURATION_VM4MS_CONFIG"
            };
            $scope.$root["modalWindow"]("dialog", "REQUEST_ERROR", oOptions);
        }
    };

    /**
     * testWmsServiceWithMapServer function.
     * Affiche le flux WMS avec MapServer.
     * @param {boolean} bRefresh Force le raffraichissement de l'onglet.
     **/
    $scope["testWmsServiceWithMapServer"] = function (bRefresh) {
        $log.info("testWmsServiceWithMapServer");
        if (goog.isDefAndNotNull(propertiesSrvc["ms_cgi_url"]) && propertiesSrvc["ms_cgi_url"] != "") {
            if (!$scope["aWmsServiceTestTabs"]["maplayer_test"]["loaded"] || bRefresh === true) {
                if (typeof ($scope["oGetCapabilities"]) != "undefined" && typeof ($scope["oGetCapabilities"]["json"]) != "undefined") {
                    if (typeof ($scope["oGetCapabilities"]["json"]["Capability"]["Layer"]) != "undefined") {

                        $scope['aMSTestLayers'] = [];
                        $('#wms_service_tests_layer_select_modal').modal('show');

                        $scope["testWmsServiceSelectedLayersWithMapServer"] = function (aLayers) {
                            $log.info("testWmsServiceSelectedLayersWithMapServer", aLayers);

                            $('#wms_service_tests_layer_select_modal').modal('hide');
                            // Url de mapserver dans l'iframe.
                            $scope["aWmsServiceTestTabs"]["map_file"]
                            var sServiceUrl = propertiesSrvc["ms_cgi_url"] + "/test/" + $scope["aWmsServiceTestTabs"]["map_file_hash"];
                            if (envSrvc["sId"] != propertiesSrvc["private_wms_service"])
                                sServiceUrl += "_" + envSrvc["sId"];
                            var sIframeUrl = sServiceUrl + "?ms_cgi_url=" + propertiesSrvc["ms_cgi_url"] + "&LAYERS=" + aLayers.join(" ") + "&no_cache=" + new Date().getTime();
                            // Hauteur et largeur de l'image générée par MapServer.
                            var oIframeWontainer = document.getElementById("wms_service_tests_wms_service_mapserver");
                            if (oIframeWontainer !== null) {
                                var iMapFileWidth = parseInt(oIframeWontainer.clientWidth * 0.75) - 23;
                                var iMapFileHeight = oIframeWontainer.clientHeight - 83;
                                sIframeUrl += "&MAPSIZE=" + iMapFileWidth + "+" + iMapFileHeight;
                            }
                            // Chargement de l'image dans l'iframe.
                            document.getElementById("wms_service_tests_wms_service_ms_iframe").contentWindow.location.href = sIframeUrl;
                            //
                            $scope["aWmsServiceTestTabs"]["maplayer_test"]["loaded"] = true;

                            $("#wms_service_tests_wms_service_ms_iframe").load(function () {
                                var this_ = this;
                                // injecte css
                                $('link').each(function () {
                                    if (this.rel === 'stylesheet' && this.type === 'text/css') {
                                        var cssLink = document.createElement("link");
                                        cssLink.href = this.href;
                                        cssLink.rel = "stylesheet";
                                        cssLink.type = "text/css";
                                        this_.contentWindow.document.body.appendChild(cssLink);
                                    }
                                });
                                // style
                                this.contentWindow.document.body.style.overflow = "auto";
                            });
                        }

                        $scope["testWmsServiceSelectAllLayers"] = function () {
                            $scope['aMSTestLayers'] = [];
                            $scope["oGetCapabilities"]["json"]["Capability"]["Layer"]["Layer"].forEach(function (oLayer) {
                                $scope['aMSTestLayers'].push(oLayer["Name"]);
                            });
                        }
                    }
                }
            }
        } else {
            var oOptions = {
                "className": "modal-danger",
                "message": "ERROR_MS_CGI_URL_CONFIGURATION_CONFIGURATION_VM4MS_CONFIG"
            };
            $scope.$root["modalWindow"]("dialog", "REQUEST_ERROR", oOptions);
        }
    };

    /**
     * refreshWmsServiceTestsTab function.
     * Rechargement et affichage de l'onglet "GetCapabilities" avec les identifiants spécifiés.
     **/
    $scope.$root["refreshWmsServiceTestsTab"] = function () {
        $log.info("refreshWmsServiceTestsTab");
        // Login + mdp obligatoires (si un des 2 est spécifié).
        var sUserLogin = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["wms_service_login"];
        var sUserPassword = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["wms_service_password"];
        var formScope = angular.element("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"]).scope();
        var bRefresh = true;
        formScope[envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"]]["wms_service_login"]["$setValidity"]("wms_service_login", true);
        formScope[envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"]]["wms_service_password"]["$setValidity"]("wms_service_password", true);
        if (!((!goog.isDefAndNotNull(sUserLogin) || sUserLogin == "") && (!goog.isDefAndNotNull(sUserPassword) || sUserPassword == ""))) {
            if ((!goog.isDefAndNotNull(sUserLogin) || sUserLogin == "")) {
                formScope[envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"]]["wms_service_login"]["$setValidity"]("wms_service_login", false);
                formScope[envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"]]["wms_service_login"]["$setDirty"]();
                bRefresh = false;
            }
            if ((!goog.isDefAndNotNull(sUserPassword) || sUserPassword == "")) {
                formScope[envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"]]["wms_service_password"]["$setValidity"]("wms_service_password", false);
                formScope[envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"]]["wms_service_password"]["$setDirty"]();
                bRefresh = false;
            }
        }
        // Création du fichier ".map" et rechargement et affichage de l'onglet "GetCapabilities".
        if (bRefresh) {
            $(".wms-service-tests a[href='#wms_service_tests_get_capabilities']").tab('show');
            $scope["showWmsServiceGetCapabilities"](true);
            // Onglets à recharger.
            $scope["aWmsServiceTestTabs"]["openlayers_test"]["loaded"] = false;
            $scope["aWmsServiceTestTabs"]["maplayer_test"]["loaded"] = false;
            $scope["aWmsServiceTestTabs"]["mapserver_log"]["loaded"] = false;
            $scope["aWmsServiceTestTabs"]["map_file"]["loaded"] = false;
        }
    };

    /**
     * clearWmsServiceTestsTabs function.
     * Vide tous les onglets.
     **/
    $scope["clearWmsServiceTestsTabs"] = function () {
        $log.info("clearWmsServiceTestsTabs");
        //
        $scope["aWmsServiceTestTabs"]["get_capabilities"]["oCodeMirrorEditor"]["setValue"]("");
        document.getElementById("wms_service_tests_wms_service_ms_iframe").contentWindow.location.href = "about:blank";
        $("#wms_service_tests_wms_service_ol_map").empty();
    };

    /**
     * loadWmsServiceMapServerLog function.
     * Charge le fichier de log de MapServer dans l'éditeur CodeMirror.
     * @param {boolean} bRefresh Force le raffraichissement de l'onglet.
     **/
    $scope["loadWmsServiceMapServerLog"] = function (bRefresh) {
        $log.info("loadWmsServiceMapServerLog");
        if (!$scope["aWmsServiceTestTabs"]["mapserver_log"]["loaded"] || bRefresh === true) {
            ajaxRequest({
                "method": "GET",
                "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vm4ms/wmsservices/" + envSrvc["sId"] + "/MapServerLog",
                "scope": $scope,
                "success": function (response) {
                    if (response["data"]["status"] == 1) {
                        var oMapServerLogs = envSrvc["extractWebServiceData"]("wmsservices", response["data"])[0];
                        $scope["aWmsServiceTestTabs"]["mapserver_log"]["file_content"] = oMapServerLogs["log_file_content"];
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
            //
            $scope["aWmsServiceTestTabs"]["mapserver_log"]["loaded"] = true;
        }
    };

    /**
     * loadWmsServiceMapFile function.
     * Charge le fichier .map du flux wms testé dans l'éditeur CodeMirror.
     * @param {boolean} bRefresh Force le raffraichissement de l'onglet.
     **/
    $scope["loadWmsServiceMapFile"] = function (bRefresh) {
        $log.info("loadWmsServiceMapFile");
        if (!$scope["aWmsServiceTestTabs"]["map_file"]["loaded"] || bRefresh === true) {
            var oParams = {
                "wmsservice_id": envSrvc["sId"],
                "type": "test"
            };
            ajaxRequest({
                "method": "GET",
                "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vm4ms/wmsservices/" + envSrvc["sId"] + "/MapFile",
                "params": oParams,
                "scope": $scope,
                "success": function (response) {
                    if (response["data"]["status"] == 1) {
                        var oWmsService = envSrvc["extractWebServiceData"]("wmsservices", response["data"])[0];
                        $scope["aWmsServiceTestTabs"]["map_file"]["oCodeMirrorEditor"]["setValue"](oWmsService["map_file_content"]);
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
            //
            $scope["aWmsServiceTestTabs"]["map_file"]["loaded"] = true;
        }
    };
};
vitisApp.module.controller("wmsServiceTestsCtrl", vitisApp.wmsServiceTestsCtrl);

'use strict';

// Google closure
goog.provide("vitis.controllers.layerTests");
goog.require("vitis.modules.main");

/**
 * layerTests Controller.
 * .
 * @param {angular.$log} $log Angular log service.
 * @param {angular.$scope} $scope Angular scope.
 * @param {angular.$templateRequest} $templateRequest Angular templateRequest service.
 * @param {angular.$compile} $compile Angular compile.
 * @param {angular.$timeout} $timeout Angular timeout service.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} sessionSrvc Service de gestion des sessions.
 * @param {service} formSrvc Service de gestion des formulaires.
 * @param {service} modesSrvc Liste des modes et objets de l'utilisateur.
 * @ngInject
 **/
vitisApp.layerTestsCtrl = function ($log, $scope, $templateRequest, $compile, $timeout, propertiesSrvc, envSrvc, sessionSrvc, formSrvc, modesSrvc) {
    // Initialisation
    $log.info("initLayerTests");
    // Etat de l'affichage des onglets.
    $scope["aLayerTestTabs"] = {
        "get_capabilities": {
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
     * testLayerWithOpenLayers function.
     * Affiche le flux WMS avec OpenLayers.
     * @param {boolean} bRefresh Force le raffraichissement de l'onglet.
     **/
    $scope["testLayerWithOpenLayers"] = function (bRefresh) {
        $log.info("testLayerWithOpenLayers");
        if (goog.isDefAndNotNull(propertiesSrvc["ms_cgi_url"]) && propertiesSrvc["ms_cgi_url"] != "") {
            if (!$scope["aLayerTestTabs"]["openlayers_test"]["loaded"] || bRefresh === true) {
                if (typeof ($scope["oGetCapabilities"]) != "undefined" && typeof ($scope["oGetCapabilities"]["json"]) != "undefined") {
                    // Formulaire spécifique.
                    $scope["sFormDefinitionName"] = envSrvc["sFormDefinitionName"] + "_openlayers_test";
                    $scope["oFormRequestParams"] = {
                        "sUrl": "modules/" + envSrvc["oSelectedMode"]["module_name"] + "/forms/" + envSrvc["oSelectedMode"]["mode_id"] + "/vm4ms_vm4ms_layer_openlayers_test.json"
                    };
                    // Vide le conteneur de la carte vMap.
                    $("#layer_tests_layer_ol_map").empty();
                    // Compilation du template de formulaire.
                    $templateRequest("templates/formTpl.html").then(function (sTemplate) {
                        $compile($("#layer_tests_layer_ol_map").html(sTemplate).contents())($scope);
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
                            var oMapFormElement = formSrvc["getFormElementDefinition"]("layer_test_map", $scope["sFormDefinitionName"]);
                            oMapFormElement["map_options"]["proj"] = sProj;
                            oMapFormElement["map_options"]["tree"]["children"][0]["view"]["projection"] = sProj;

                            // Ajoute les projections manquantes.
                            nsVitisComponent.Map.prototype.addCustomProjections();
                            // Etendues.
                            if (typeof ($scope["oGetCapabilities"]["json"]["Capability"]["Layer"]) != "undefined")
                                oMapFormElement["map_options"]["center"]["extent"] = ol.proj.transformExtent($scope["oGetCapabilities"]["json"]["Capability"]["Layer"]["EX_GeographicBoundingBox"], "EPSG:4326", sProj);
                            oMapFormElement["map_options"]["tree"]["children"][0]["view"]["extent"] = oMapFormElement["map_options"]["center"]["extent"];
                            //oMapFormElement["map_options"]["tree"]["children"][0]["view"]["extent"] = $scope["oGetCapabilities"]["json"]["Capability"]["Layer"]["Layer"][0]["EX_GeographicBoundingBox"];
                            //oMapFormElement["map_options"]["tree"]["children"][0]["view"]["extent"] = $scope["oGetCapabilities"]["json"]["Capability"]["Layer"]["Layer"][0]["BoundingBox"][0]["extent"];

                            // Couches du flux WMS.
                            if (typeof ($scope["oGetCapabilities"]["json"]["Capability"]["Layer"]) != "undefined") {
                                $scope["oGetCapabilities"]["json"]["Capability"]["Layer"]["Layer"].forEach(function (oLayer, iLayerIndex) {
                                    // Définition de la couche.
                                    var oChildrenLayer = {
                                        "name": oLayer["Name"],
                                        "children": [
                                            {
                                                "name": oLayer["Name"],
                                                "layerType": "imagewms",
                                                "visible": true,
                                                //"legend": "true",
                                                "select": true,
                                                "url": $scope["oGetCapabilities"]["service_url"],
                                                "params": {
                                                    "LAYERS": oLayer["Name"],
                                                    "VERSION": "1.3.0",
                                                    "TIMESTAMP": new Date().getTime()
                                                },
                                                "index": iLayerIndex + 1
                                            }
                                        ]
                                    };
                                    // Source de la couche.
                                    if (typeof ($scope["oGetCapabilities"]["layers_sources"][oLayer["Name"]]) != "undefined") {
                                        oChildrenLayer["children"][0]["attributions"] = [
                                            new ol.Attribution({
                                                html: $scope["oGetCapabilities"]["layers_sources"][oLayer["Name"]]
                                            })
                                                    //ol.source.OSM.ATTRIBUTION
                                        ];
                                    }
                                    // Ajout de la couche.
                                    oMapFormElement["map_options"]["tree"]["children"].push(oChildrenLayer);
                                });
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
                                            $scope.$root["displayLayerLoadingError"](event);
                                        });
                                    }
                                });
                            });
                        });
                    });
                    //
                    $scope["aLayerTestTabs"]["openlayers_test"]["loaded"] = true;
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
     * testLayerWithMapServer function.
     * Affiche le flux WMS avec MapServer.
     * @param {boolean} bRefresh Force le raffraichissement de l'onglet.
     **/
    $scope["testLayerWithMapServer"] = function (bRefresh) {
        $log.info("testLayerWithMapServer");
        if (goog.isDefAndNotNull(propertiesSrvc["ms_cgi_url"]) && propertiesSrvc["ms_cgi_url"] != "") {
            if (!$scope["aLayerTestTabs"]["maplayer_test"]["loaded"] || bRefresh === true) {
                if (typeof ($scope["oGetCapabilities"]) != "undefined" && typeof ($scope["oGetCapabilities"]["json"]) != "undefined") {
                    // affiche la barre de scroll de l'iframe.
                    $("#layer_tests_layer_ms_iframe").load(function () {
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
                    // Liste des couches du flux WMS de test et de la couche à tester.
                    var aLayers = [];
                    if (typeof ($scope["oGetCapabilities"]["json"]["Capability"]["Layer"]) != "undefined") {
                        $scope["oGetCapabilities"]["json"]["Capability"]["Layer"]["Layer"].forEach(function (oLayer) {
                            aLayers.push(oLayer["Name"]);
                        });
                    }
                    // Url de mapserver.
                    var sIframeUrl = $scope["oGetCapabilities"]["service_url"] + "?ms_cgi_url=" + propertiesSrvc["ms_cgi_url"] + "&LAYERS=" + aLayers.join(" ") + "&no_cache=" + new Date().getTime();
                    // Hauteur et largeur de l'image générée par MapServer.
                    var oIframeWontainer = document.getElementById("layer_tests_layer_mapserver");
                    if (oIframeWontainer !== null) {
                        var iMapFileWidth = parseInt(oIframeWontainer.clientWidth * 0.75) - 23;
                        var iMapFileHeight = oIframeWontainer.clientHeight - 83;
                        sIframeUrl += "&MAPSIZE=" + iMapFileWidth + "+" + iMapFileHeight;
                    }
                    // Url de mapserver dans l'iframe.
                    document.getElementById("layer_tests_layer_ms_iframe").contentWindow.location.href = sIframeUrl;
                    // Chargement de MapServer dans l'iframe.
                    $scope["aLayerTestTabs"]["maplayer_test"]["loaded"] = true;
                }
            } else {
                // Affiche les scrollbars si besoin (bug chrome).
                document.getElementById("layer_tests_layer_ms_iframe").contentWindow.document.body.style.overflow = "hidden";
                setTimeout(function () {
                    document.getElementById("layer_tests_layer_ms_iframe").contentWindow.document.body.style.overflow = "auto";
                }, 100);
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
     * clearLayerTestsTabs function.
     * Vide tous les onglets.
     **/
    $scope["clearLayerTestsTabs"] = function () {
        $log.info("clearLayerTestsTabs");
        //
        document.getElementById("layer_tests_layer_ms_iframe").contentWindow.location.href = "about:blank";
        $("#layer_tests_layer_ol_map").empty();
    };

    /**
     * loadLayerMapServerLog function.
     * Charge le fichier de log de MapServer dans l'éditeur CodeMirror.
     * @param {boolean} bRefresh Force le raffraichissement de l'onglet.
     **/
    $scope["loadLayerMapServerLog"] = function (bRefresh) {
        $log.info("loadLayerMapServerLog");
        if (!$scope["aLayerTestTabs"]["mapserver_log"]["loaded"] || bRefresh === true) {
            ajaxRequest({
                "method": "GET",
                "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vm4ms/layers/" + envSrvc["sId"] + "/MapServerLog",
                "scope": $scope,
                "success": function(response) {
                    if (response["data"]["status"] == 1) {
                        var oMapServerLogs = envSrvc["extractWebServiceData"]("layers", response["data"])[0];
                        $scope["aLayerTestTabs"]["mapserver_log"]["file_content"] = oMapServerLogs["log_file_content"];
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
            $scope["aLayerTestTabs"]["mapserver_log"]["loaded"] = true;
        }
    };

    /**
     * loadLayerMapFile function.
     * Charge le fichier .map du flux wms de test de la couche dans l'éditeur CodeMirror.
     * @param {boolean} bRefresh Force le raffraichissement de l'onglet.
     **/
    $scope["loadLayerMapFile"] = function (bRefresh) {
        $log.info("loadLayerMapFile");
        if (!$scope["aLayerTestTabs"]["map_file"]["loaded"] || bRefresh === true) {
            // Requête pour récupérer les infos du fichier ".map".
            var oParams = {
                "ms_layer_id": envSrvc["sId"],
                "creation": false
            };
                ajaxRequest({
                    "method": "GET",
                    "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vm4ms/Layers/" +  + envSrvc["sId"] + "/MapFile/",
                    "params": oParams,
                    "scope": $scope,
                    "success": function(response) {
                        if (response["data"]["status"] == 1) {
                            var oLayer = envSrvc["extractWebServiceData"]("layers", response["data"])[0];
                            $scope["oMapFileCodeMirrorEditor"]["setValue"](oLayer["map_file_content"]);
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
            $scope["aLayerTestTabs"]["map_file"]["loaded"] = true;
        }
    };

    // Requête pour créer et récupérer le fichier ".map" de la couche.
    var oFormData = new FormData();
    oFormData.append("ms_layer_id", envSrvc["sId"]);
    if (typeof (envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]) != "undefined") {
        var sUserLogin = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["layer_login"];
        var sUserPassword = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["layer_password"];
        if (goog.isDefAndNotNull(sUserLogin) && goog.isDefAndNotNull(sUserPassword)) {
            oFormData.append("user_login", sUserLogin);
            oFormData.append("user_password", sUserPassword);
        }
    }
    // Paramètres du webservice.
    ajaxRequest({
        "method": "POST",
        "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vm4ms/Layers/MapFile",
        "data": oFormData,
        "scope": $scope,
        "success": function(response) {
            if (response["data"]["status"] == 1) {
                var oLayer = envSrvc["extractWebServiceData"]("layers", response["data"])[0];
                var sServiceUrl = propertiesSrvc["ms_cgi_url"] + "/test/" + oLayer["map_file_hash"] + "_" + oLayer["name"];
                $scope.$root["getCapabilities"](sServiceUrl, {"showErrorMessage":false}).then(function (oGetCapabilities) {
                    if (goog.isDefAndNotNull(oGetCapabilities)) {
                        $scope["oGetCapabilities"] = oGetCapabilities;
                        $scope["oGetCapabilities"]["service_url"] = sServiceUrl;
                        if (typeof (oLayer["layers_sources"]) != "undefined")
                            $scope["oGetCapabilities"]["layers_sources"] = oLayer["layers_sources"];
                        // Lance le test de la couche avec MapServer (1er onglet affiché).
                        $scope["testLayerWithMapServer"]();
                    }
                    else {
                        // Affiche la section des logs en cas d'erreur.
                        $timeout(function () {
                            // Cache les onglets "GetCapabilities", "MapServer" et "OL3".
                            document.querySelector(".layer-tests .nav-tabs > li:nth-child(1)").style.display = "none";
                            document.querySelector(".layer-tests .nav-tabs > li:nth-child(2)").style.display = "none";
                            // Affiche les logs.
                            document.querySelector(".layer-tests .nav-tabs > li > a[aria-controls='layer_mapserver_log']").click();
                        });
                    }
                });
            } else {
                // Supprime le précédent getCapabilities.
                delete $scope["oGetCapabilities"];
                // Vide les onglets
                $scope["clearLayerTestsTabs"]();
                // Rechargement obligatoire de tous les onglets.
                $scope["aLayerTestTabs"]["openlayers_test"]["loaded"] = false;
                $scope["aLayerTestTabs"]["maplayer_test"]["loaded"] = false;
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
};
vitisApp.module.controller("layerTestsCtrl", vitisApp.layerTestsCtrl);

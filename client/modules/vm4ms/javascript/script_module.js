/* global vitisApp, goog */

'use strict';

goog.provide('vmap.vm4ms.script_module');
goog.require('vmap.vm4ms');

vitisApp.on('appMainDrtvLoaded', function () {
    /**
     * appWmsServiceDescriptionColumn directive.
     * Mise en forme de la colonne "description" dans la liste des onglets "Flux WMS".
     * @param {service} $translate Translate service.
     * @ngInject
     **/
    vitisApp.appWmsServiceDescriptionColumnDrtv = function ($translate) {
        return {
            link: function (scope, element, attrs) {

//                scope['aVM4MSLayerLoadingErrorModals'] = [];
//                scope['aVM4MSLayerLoadingErrorLayers'] = [];

                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appWmsServiceDescriptionColumn", function (value) {
                    // Si le champ est vide : supprime l'icône.
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        // Classes css (ui-grid + spécifiques).
                        element[0].className = "ui-grid-cell-contents info-icon";
                        // Traduction du titre et du contenu.
                        $translate(["DESCRIPTION_TOOLTIP_TITLE_VMAP_MAP_MAP"]).then(function (translations) {
                            // Création du "tooltip".
                            $(element)["popover"]({
                                "trigger": "hover",
                                "container": "body",
                                "title": function () {
                                    return translations["DESCRIPTION_TOOLTIP_TITLE_VMAP_MAP_MAP"];
                                },
                                "content": function () {
                                    return scope["row"]["entity"][scope["col"]["field"]];
                                },
                                // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                                "placement": function (oPopoverNode, oElementNode) {
                                    return scope.$root["workspaceTooltipPlacement"](oElementNode);
                                },
                                "html": true
                            });
                        });
                    }
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime le tooltip.
                    $(element)["popover"]("destroy");
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive('appWmsServiceDescriptionColumn', vitisApp.appWmsServiceDescriptionColumnDrtv);

    /**
     * beforeSendingLayerForm function.
     * Traitement avant l'envoi du formulaire d'une couche.
     */
    angular.element(vitisApp.appMainDrtv).scope()['beforeSendingLayerForm'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $q = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["$q"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("beforeSendingLayerForm");
        var scope = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        ajaxRequest({
            "method": "GET",
            "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vm4ms/layerconnections/" + envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["connection_id"]["selectedOption"]["value"],
            "scope": scope,
            "success": function (response) {
                if (response["data"]["status"] == 1) {
                    // Passage d'une connexion publique à privée.
                    if (envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["private_connection"] === false && envSrvc["extractWebServiceData"]("layerconnections", response["data"])[0]["private"] === true) {
                        var oOptions = {
                            "className": "modal-warning",
                            "message": "FORM_PRIVATE_CONNECTION_TOOLTIP_CONTENT_VM4MS_VM4MS_LAYER",
                            "callback": function (bResponse) {
                                if (bResponse)
                                    deferred.resolve();
                                else
                                    deferred.reject();
                            }
                        };
                        scope["modalWindow"]("confirm", "FORM_PRIVATE_CONNECTION_TOOLTIP_TITLE_VM4MS_VM4MS_LAYER", oOptions);
                    } else
                        deferred.resolve();
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
                    scope["modalWindow"]("alert", "REQUEST_ERROR", oOptions);
                }
            }
        });
        //
        return promise;
    };

    /**
     * testVm4msLayer function.
     * Teste la couche en cours d'édition.
     */
    angular.element(vitisApp.appMainDrtv).scope()['testVm4msLayer'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $compile = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$compile"]);
        var $templateRequest = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$templateRequest"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("testVm4msLayer");
        var scope = this;
        // Ne crée pas les fichiers .map des flux WMS associés à la couche.
        envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["create_ws_map_file"] = "false";
        // Sauvegarde la définition dans le champ "definitiontmp".
        envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["test_layer"] = true;
        // Sauvegarde la définition de la couche avant le test.
        var oFormData = formSrvc["getFormData"](envSrvc["sFormDefinitionName"]);
        var sFormElementName = envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"];
        var formScope = angular.element("form[name='" + sFormElementName + "']").scope();
        formScope[sFormElementName]["appFormSubmitted"] = false;
        scope.$root["sendSimpleForm"](undefined, oFormData).then(function (bResponse) {
            envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["create_ws_map_file"] = "true";
            envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["test_layer"] = false;
            if (bResponse) {
                // Carte de test et url de MapServer obligatoires (section configuration).
                var sErrorMessage;
                if (!goog.isDefAndNotNull(propertiesSrvc["test_wms_service"]) || propertiesSrvc["test_wms_service"] == "")
                    sErrorMessage = "ERROR_TEST_WMS_SERVICE_CONFIGURATION_CONFIGURATION_VM4MS_CONFIG";
                else if (!goog.isDefAndNotNull(propertiesSrvc["ms_cgi_url"]) || propertiesSrvc["ms_cgi_url"] == "")
                    sErrorMessage = "ERROR_MS_CGI_URL_CONFIGURATION_CONFIGURATION_VM4MS_CONFIG";
                if (typeof (sErrorMessage) == "undefined") {
                    // Si la couche est privée : login et mdp obligatoires.
                    var bTestLayer = true;
                    var sUserLogin = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["layer_login"];
                    var sUserPassword = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["layer_password"];
                    var bPrivateConnection = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["private_connection"];
                    var oUserLogin = formSrvc["getFormElementDefinition"]("layer_login", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
                    var oUserPassword = formSrvc["getFormElementDefinition"]("layer_password", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
                    // Connexion privée : login et mdp spécifiés ou ceux de l'utilisateur en cours.
                    if (bPrivateConnection) {
                        document.getElementById(oUserLogin["id"]).parentNode.parentNode.parentNode.className = "";
                        document.getElementById(oUserPassword["id"]).parentNode.parentNode.parentNode.className = "";
                        if (!((!goog.isDefAndNotNull(sUserLogin) || sUserLogin == "") && (!goog.isDefAndNotNull(sUserPassword) || sUserPassword == ""))) {
                            if ((!goog.isDefAndNotNull(sUserLogin) || sUserLogin == "") && bPrivateConnection) {
                                document.getElementById(oUserLogin["id"]).parentNode.parentNode.parentNode.className = "has-error";
                                bTestLayer = false;
                            }
                            if ((!goog.isDefAndNotNull(sUserPassword) || sUserPassword == "") && bPrivateConnection) {
                                document.getElementById(oUserPassword["id"]).parentNode.parentNode.parentNode.className = "has-error";
                                bTestLayer = false;
                            }
                        }
                    }
                    // Lance le test.
                    if (bTestLayer) {
                        // Affichage de la fenêtre modale.
                        var oOptions = {
                            "className": "dialog-modal-window layer-test-dialog-modal-window",
                            "message": '<div id="layer_test_container" class="layer_test_container"></div>'
                        };
                        scope.$root["modalWindow"]("dialog", "FORM_MAP_SERVER_MODAL_TITLE_VM4MS_VM4MS_LAYER_DEFINITION", oOptions).then(function (oDialog) {
                            // Ajoute le nom de la couche dans le titre.
                            var sGeneralSectionFormDefinitionName = envSrvc["oSelectedObject"]["name"] + "_general_" + envSrvc["sMode"] + "_form";
                            oDialog[0].querySelector(".modal-title").innerHTML += envSrvc["oFormValues"][sGeneralSectionFormDefinitionName]["name"];
                            // Largeur et hauteur du widget.
                            var iModalWidth = document.querySelector("body").clientWidth - 50;
                            var iModalHeight = document.querySelector("body").clientHeight - 50;
                            oDialog[0].querySelector(".modal-dialog").style.width = iModalWidth + "px";
                            oDialog[0].querySelector(".modal-dialog").style.height = iModalHeight + "px";
                            // Hauteur du header du widget.
                            oDialog[0].querySelector(".modal-header").style.height = "56px";
                            // Hauteur du body du widget.
                            oDialog[0].querySelector(".modal-body").style.height = (iModalHeight - 56 - 4) + "px";
                            // Compilation du template de test de la couche.
                            $templateRequest("modules/vm4ms/template/layerTestsTpl.html").then(function (sTemplate) {
                                $compile($("#layer_test_container").html(sTemplate).contents())(scope);
                            });
                        });
                    }
                } else {
                    var oOptions = {
                        "className": "modal-danger",
                        "message": sErrorMessage
                    };
                    scope["modalWindow"]("dialog", "REQUEST_ERROR", oOptions);
                }
            }
        })
    };

    /**
     * showAddLayersToWmsServiceModalWindow function.
     * Affichage de la liste des couches disponibles pour un service wms dans une fenêtre modale.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['showAddLayersToWmsServiceModalWindow'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $compile = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$compile"]);
        var $templateRequest = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$templateRequest"]);
        var $translate = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$translate"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var uiGridConstants = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["uiGridConstants"]);
        var modesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["modesSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("showAddLayersToWmsServiceModalWindow");
        var scope = this.$new();
        // Sauve le nouveau scope crée dans la définition de l'onglet. 
        modesSrvc["addScopeToObject"](envSrvc["oSelectedObject"]["name"], envSrvc["oSelectedMode"]["mode_id"], scope);
        // Sauve l'ancien onglet
        //var oSaveSelectedObject = angular.copy(envSrvc["oSelectedObject"]);
        var oSaveSelectedObject = modesSrvc["getObject"](envSrvc["oSelectedObject"]["name"], modesSrvc["getMode"](envSrvc["oSelectedMode"]["mode_id"]));
        var sSaveMode = envSrvc["sMode"];
        var sSaveSelectedGridOptionsName = envSrvc["sSelectedGridOptionsName"];
        // Paramètres de l'onglet.
        envSrvc["oSelectedObject"] = {
            "actions": [],
            "columns": [],
            "mode_id": oSaveSelectedObject["mode_id"],
            "name": oSaveSelectedObject["name"] + "_available_layers",
            "ressource_id": "vm4ms/publiclayers",
            "sections": "",
            "template_name": "",
            "sorted_by": "name",
            "sorted_dir": "ASC"
        };
        envSrvc["sMode"] = "search";
        scope['sSelectedObjectName'] = envSrvc["oSelectedObject"]["name"];

        // Paramétrage du module ui-grid
        scope["gridOptions"] = {
            "enableRowSelection": true,
            "enableSelectAll": true,
            "enablePagination": true,
            "enablePaginationControls": false,
            "useExternalPagination": true,
            "paginationPageSize": propertiesSrvc["rows_per_page"],
            "enableColumnMenus": false,
            "enableColumnResizing": true,
            //"enableColumnMoving": true,
            "paginationPageSizes": [10, 20, 50, 100],
            "appHeader": true,
            "appHeaderTitleBar": true,
            "appHeaderSearchForm": false,
            "appHeaderOptionBar": false,
            "appLoadGridData": true,
            "appGridTitle": "TITLE_GRID_AVAILABLE_LAYERS_VM4MS_PUBLIC_WMS_SERVICE_LAYERS",
            "appResizeGrid": true,
            "appFooter": true,
            "appShowPagination": true,
            "appActions": []
        };
        // Id de traduction des libellés des colonnes de la liste.
        var aTranslationsId = ["FORM_LAYER_ID_VM4MS_VM4MS_LAYER", "FORM_LAYER_TITLE_VM4MS_VM4MS_LAYER", "FORM_LAYER_NAME_VM4MS_VM4MS_LAYER"];

        // Définition des colonnes de la liste.
        $translate(aTranslationsId).then(function (aTranslations) {
            scope["gridOptions"]["columnDefs"] = [
                {"name": aTranslations["FORM_LAYER_ID_VM4MS_VM4MS_LAYER"], "displayName": aTranslations["FORM_LAYER_ID_VM4MS_VM4MS_LAYER"], "field": "ms_layer_id", "width": 40, "enableSorting": true, "type": "string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "vm4ms_wms_service_layers_" + envSrvc["oSelectedObject"]["name"] + "_layer_id"},
                {"name": aTranslations["FORM_LAYER_NAME_VM4MS_VM4MS_LAYER"], "displayName": aTranslations["FORM_LAYER_NAME_VM4MS_VM4MS_LAYER"], "field": "name", "width": 200, "enableSorting": true, "type": "string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "vm4ms_wms_service_layers_" + envSrvc["oSelectedObject"]["name"] + "_name", "sort": {"direction": uiGridConstants["ASC"], "ignoreSort": true, "priority": 0}},
                {"name": aTranslations["FORM_LAYER_TITLE_VM4MS_VM4MS_LAYER"], "displayName": aTranslations["FORM_LAYER_TITLE_VM4MS_VM4MS_LAYER"], "field": "title", "width": 300, "enableSorting": true, "type": "string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "vm4ms_wms_service_layers_" + envSrvc["oSelectedObject"]["name"] + "_title"}
            ];
        });

        // Boutons de la liste.
        if (envSrvc["sMode"] != "display") {
            $translate(["BTN_ADD_LAYERS_VM4MS_PUBLIC_WMS_SERVICE_LAYERS"]).then(function (oTranslations) {
                scope["gridOptions"]["appActions"] = [
                    {
                        "label": oTranslations["BTN_ADD_LAYERS_VM4MS_PUBLIC_WMS_SERVICE_LAYERS"],
                        "name": scope["sSelectedObjectName"] + "_add_layer_btn",
                        "event": "addLayersToWmsService()"
                    }
                ];
            });
        }

        // Couches à exclure (celles associées à la carte).
        var aRows = envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["data"];
        if (aRows.length > 0) {
            var i = 0, aLayersId = [];
            while (i < aRows.length) {
                aLayersId.push(aRows[i]["ms_layer_id"]);
                i++;
            }
            envSrvc["oSelectedObject"]["filter"] = {
                "relation": "AND",
                "operators": [{
                        "column": "ms_layer_id",
                        "compare_operator": "NOT IN",
                        "value": aLayersId
                    }]
            };
        }

        // Affichage de la fenêtre modale.
        var sContainerId = "container_" + envSrvc["oSelectedObject"]["name"] + "_available_layers";
        var oOptions = {
            "className": "dialog-modal-window dialog-modal-window-workspace-list dialog-modal-window-available-layers",
            "message": '<div id="' + sContainerId + '" class="col-xs-12"></div>'
        };

        scope["modalWindow"]("dialog", null, oOptions).then(function (oDialog) {
            // Attends la fin de l'affichage de la fenêtre modale.
            $(oDialog).on('shown.bs.modal', function (e) {
                // 
                var oModalContainer = document.querySelector(".dialog-modal-window-available-layers > .modal-dialog");
                oModalContainer.className = oModalContainer.className + " modal-lg";
                // Compile le template de la liste.
                var sTemplateUrl = 'templates/workspaceListTpl.html';
                $templateRequest(sTemplateUrl).then(function (sTemplate) {
                    $compile($("#" + sContainerId).html(sTemplate).contents())(scope);
                });
            });
            // Attends la fermeture de la fenêtre modale.
            $(oDialog).on('hide.bs.modal', function (e) {
                // Restaure l'ancien onglet sauvé.
                envSrvc["oSelectedObject"] = oSaveSelectedObject;
                envSrvc["sMode"] = sSaveMode;
                envSrvc["sSelectedGridOptionsName"] = sSaveSelectedGridOptionsName;
                // Recharge la liste des couches associées à la carte.
                scope.$root["refreshGrid"](scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["grid"]["appScope"], envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]);
            });
        });
    };

    /**
     * addLayersToWmsService function.
     * Association d'une liste de couches à un flux wms.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['addLayersToWmsService'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("addLayersToWmsService");
        var scope = this;
        var oParams = {
            "wmsservice_id": envSrvc["sId"]
        };
        // Liste des couches sélectionnées.
        var aSelectedRows = scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["selection"]["getSelectedRows"]();
        if (aSelectedRows.length > 0) {
            var i = 0, aLayersId = [];
            while (i < aSelectedRows.length) {
                aLayersId.push(aSelectedRows[i]["ms_layer_id"]);
                i++;
            }
            oParams["wmsservice_ms_layers"] = aLayersId.join("|");
            ajaxRequest({
                "method": "PUT",
                "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vm4ms/wmsservicelayers/" + envSrvc["sId"],
                "data": oParams,
                "scope": scope,
                "success": function (response) {
                    if (response["data"]["status"] == 0) {
                        var oOptions = {
                            "className": "modal-danger",
                            "message": response["data"]["errorMessage"]
                        };
                        scope["modalWindow"]("dialog", "REQUEST_ERROR", oOptions);
                    } else {
                        // Efface la sélection.
                        //scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["selection"]["clearSelectedRows"]();
                        // Recharge la liste.
                        //scope["refreshGrid"](scope, scope["gridOptions"]);
                        //
                        bootbox["hideAll"]();
                        // Affichage du message de succés.
                        $translate("SUCCESSFUL_OPERATION").then(function (sTranslation) {
                            $.notify(sTranslation, "success");
                        });
                        // Recharge la section "Tests".
                        var oWmsServiceSectionForm = envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]];
                        oWmsServiceSectionForm["sections"].forEach(function (aSection) {
                            // Force le rechargement de la section "Répertoire projet".
                            if (aSection["name"] == "tests")
                                aSection["bLoaded"] = false;
                        })
                    }
                }
            });
        }
    };

    /**
     * deleteWmsServiceLayers function.
     * Suppression des couches associées à un flux WMS.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['deleteWmsServiceLayers'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("deleteWmsServiceLayers");
        var scope = this;
        var oParams = {
            "wmsservice_id": envSrvc["sId"]
        };
        // Liste des couches sélectionnées.
        var aSelectedRows = scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["selection"]["getSelectedRows"]();
        if (aSelectedRows.length > 0) {
            var i = 0, aLayersId = [];
            while (i < aSelectedRows.length) {
                aLayersId.push(aSelectedRows[i]["ms_layer_id"]);
                i++;
            }
            oParams["idList"] = aLayersId.join("|");
            // Suppression.
            ajaxRequest({
                "method": "DELETE",
                "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vm4ms/wmsservicelayers/" + envSrvc["sId"],
                "params": oParams,
                "scope": scope,
                "success": function (response) {
                    if (response["data"]["status"] == 0) {
                        var oOptions = {
                            "className": "modal-danger",
                            "message": response["data"]["errorMessage"]
                        };
                        scope["modalWindow"]("dialog", "REQUEST_ERROR", oOptions);
                    } else {
                        // Efface la sélection.
                        scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["selection"]["clearSelectedRows"]();
                        // Recharge la liste.
                        scope["refreshGrid"](scope, scope["gridOptions"]);
                        // Affichage du message de succés.
                        $translate("SUCCESSFUL_OPERATION").then(function (sTranslation) {
                            $.notify(sTranslation, "success");
                        });
                        // Recharge la section "Tests".
                        var oWmsServiceSectionForm = envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]];
                        oWmsServiceSectionForm["sections"].forEach(function (aSection) {
                            // Force le rechargement de la section "Répertoire projet".
                            if (aSection["name"] == "tests")
                                aSection["bLoaded"] = false;
                        })
                    }
                }
            });
        }
    };

    /**
     * cloneVm4msLayer function.
     * Clonage d'une couche.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['cloneVm4msLayer'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
        $log.info("cloneVm4msLayer");
        var scope = this;
        var oFormValuesCopy = angular.copy(envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]);
        this["AddSectionForm"]();
        var clearListener = scope.$root.$on('formDefinitionLoaded', function (event, scope) {
            // Supprime le "listener".
            clearListener();
            // Valeurs de l'enregistrement à cloner.
            oFormValuesCopy['name'] = '';
            oFormValuesCopy['title'] = '';
            envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]] = angular.copy(oFormValuesCopy);
        });
    };

    /**
     * initVm4msLayerForm function.
     * Initialisation du formulaire de la section "général" de l'onglet "Couches".
     */
    angular.element(vitisApp.appMainDrtv).scope()['initVm4msLayerForm'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("initVm4msLayerForm");
        var scope = this;
        if (envSrvc["sMode"] == "insert") {
            // Filtrage du champ "name" de la couche.
            var oLayerName = document.querySelector("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] input[name='name']");
            oLayerName.addEventListener("input", function () {
                // Remplace les caractères interdits.
                var sLayerName = this.value;
                var oRules = {
                    "a": "àáâãäå", "A": "ÀÁÂÃÄÅ", "e": "èéêë", "E": "ÈÉÊË", "i": "ìíîï", "I": "ÌÍÎÏ", "o": "òóôõöø", "O": "ÒÓÔÕÖØ", "u": "ùúûü", "U": "ÙÚÛÜ", "y": "ÿ", "Y": "Ÿ", "c": "ç", "C": "Ç", "n": "ñ", "N": "Ñ"
                };
                Object.keys(oRules).forEach(function (sCaracter) {
                    sLayerName = sLayerName.replace(new RegExp("[" + oRules[sCaracter] + "]", "g"), sCaracter);
                });
                // Affiche le nom filtré.
                envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["name"] = sLayerName.replace(/[^a-zA-Z0-9]/g, '_');
                // Rafraîchit le scope du formulaire.
                var formScope = angular.element("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"]).scope();
                formScope.$apply();
            });
            // Définition par défaut d'une couche.
            var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
            if (!goog.isDefAndNotNull(oFormValues["definition"]) || oFormValues["definition"] == "")
                oFormValues["definition"] = "LAYER\r\tNAME \"{LAYER_NAME}\"\r\tTYPE {LAYER_TYPE}\r\tSTATUS ON\r\t{CONNECTION}\r\tDATA \"geom from {TABLE_SCHEMA}.{TABLE_NAME} USING SRID={SRID} USING UNIQUE {TABLE_ID}\"\r\tDEBUG 0\r\r\t{COORDSYS}\r\r\t{METADATA}\r\r\tCLASS\r\t\tNAME \"{LAYER_NAME}\"\r\t\tSTYLE\r\t\t\tSYMBOL \"circle\"\r\t\t\tSIZE 15\r\t\t\tOUTLINECOLOR 0 0 0\r\t\t\tCOLOR 204 204 204\r\t\t\tWIDTH 2\r\t\tEND\r\tEND\rEND";
        }

        // Schéma, table, colonne.
        var clearListener = $rootScope.$on('formExtracted', function (event, sFormDefinitionName) {
            // Supprime le "listener".
            clearListener();
            /**
             * setLayerSchemaOptions function.
             * Charge les paramètres de la connexion sélectionnée et la liste des schémas.
             */
            var setLayerSchemaOptions = function (sConnectionId) {
                if (goog.isDefAndNotNull(sConnectionId) && sConnectionId != "") {
                    ajaxRequest({
                        "method": "GET",
                        "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vm4ms/layerconnections/" + sConnectionId,
                        "scope": scope,
                        "success": function (response) {
                            if (response["data"]["status"] == 1) {
                                var oLayerConnection = envSrvc["extractWebServiceData"]("layerconnections", response["data"])[0];
                                // Valeurs de connexion par défaut.
                                if (!goog.isDefAndNotNull(oLayerConnection["server"]))
                                    oLayerConnection["server"] = propertiesSrvc["server"];
                                if (!goog.isDefAndNotNull(oLayerConnection["port"]))
                                    oLayerConnection["port"] = propertiesSrvc["port"];
                                if (!goog.isDefAndNotNull(oLayerConnection["database"]))
                                    oLayerConnection["database"] = propertiesSrvc["database"];
                                scope["oLayerConnection"] = angular.copy(oLayerConnection);
                                // Charge la liste des schémas de la base de données de la connexion.
                                var oUrlParams = {
                                    "order_by": "schemaname",
                                    "server": oLayerConnection["server"],
                                    "port": oLayerConnection["port"],
                                    "database": oLayerConnection["database"],
                                    "schema": "pg_catalog",
                                    "table": "pg_tables",
                                    "sort_order": "ASC",
                                    "attributs": "schemaname",
                                    "distinct": true
                                };
                                if (goog.isDefAndNotNull(oLayerConnection["user"]))
                                    oUrlParams["login"] = oLayerConnection["user"];
                                if (goog.isDefAndNotNull(oLayerConnection["password"]))
                                    oUrlParams["password"] = oLayerConnection["password"];
                                $rootScope["setOptionsFromWebService"]('tableschema', "vitis/genericquerys", oUrlParams);
                            }
                        }
                    });
                }
            };

            // Charge la liste des schémas de la connexion sélectionnée.
            var iConnectionId = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["connection_id"]["selectedOption"]["value"];
            if (!isNaN(iConnectionId))
                setLayerSchemaOptions(iConnectionId);

            // Paramètres de la connexion sélectionnée.
            var oLayerConnectionDefinition = formSrvc["getFormElementDefinition"]("connection_id", envSrvc["sFormDefinitionName"]);
            document.getElementById(oLayerConnectionDefinition["id"]).addEventListener("change", function (event) {
                setLayerSchemaOptions(this.value);
            });

            // Initialise la palette.
            var oFormElement = document.querySelector("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "']");
            oFormElement.className = oFormElement.className + " form-vm4ms-layer-general"
            var oDefinitionFormRow = document.querySelector(".form-row-layer-palette > div > div > div > div");
            var oPaletteElem = document.createElement("div");
            oPaletteElem["id"] = envSrvc["sFormDefinitionName"] + "_palette";
            oPaletteElem["className"] = "input-group colorpicker-component vm4ms-layer-palette"; //  + envSrvc["sMode"]
            oPaletteElem.innerHTML = '<input type="text" name="color" value="#00AABB" class="form-control"><span class="input-group-addon"><i></i></span>';
            oDefinitionFormRow.appendChild(oPaletteElem);
            // Création du "color picker".
            $(oPaletteElem).colorpicker({
                "format": "hex"
            });

            // Bouton "plein écran" de l'éditeur CodeMirror.
            var oContainerSectionElem = document.querySelector("#container_section_" + envSrvc["oSelectedObject"]["name"] + "_general > div");
            scope["iCodeMirrorDefinitionHeight"] = parseInt(document.querySelector("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] .CodeMirror").style.height);
            var oFullScreenElem = document.createElement("button");
            oFullScreenElem.id = envSrvc["sFormDefinitionName"] + "layer_definition_full_screen_icon";
            oFullScreenElem.className = "btn btn-xs btn-primary layer-definition-full-screen-icon";
            oFullScreenElem.type = "button";
            oFullScreenElem.innerHTML = '<span class="glyphicon glyphicon-fullscreen"></span>';
            oFullScreenElem.setAttribute("aria-label", "Left Align");
            oDefinitionFormRow.appendChild(oFullScreenElem);
            scope["bCodeMirrorDefinitionFullScreen"] = false;
            // Calcule la hauteur de l'éditeur CodeMirror.
            oFullScreenElem.addEventListener("click", function (event) {
                var iCodeMirrorHeight;
                if (scope["bCodeMirrorDefinitionFullScreen"])
                    iCodeMirrorHeight = scope["iCodeMirrorDefinitionHeight"];
                else {
                    var iContainerSectionHeight = document.getElementById("container_section_" + envSrvc["oSelectedObject"]["name"] + "_general").clientHeight;
                    if (document.querySelector(".form-row-layer-btn") != null)
                        iContainerSectionHeight -= parseInt(document.querySelector(".form-row-layer-btn").offsetHeight);
                    iContainerSectionHeight -= parseInt(document.querySelector(".form-row-layer-palette").offsetHeight);
                    iContainerSectionHeight -= parseInt(document.querySelector(".form-row-layer-definition").offsetHeight);
                    iContainerSectionHeight -= 20;
                    iCodeMirrorHeight = scope["iCodeMirrorDefinitionHeight"] + iContainerSectionHeight;
                }
                scope["bCodeMirrorDefinitionFullScreen"] = !scope["bCodeMirrorDefinitionFullScreen"];
                var oCodeMirrorElem = document.querySelector("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] .CodeMirror");
                oCodeMirrorElem.style.height = iCodeMirrorHeight + "px";
                oContainerSectionElem.scrollTop = oContainerSectionElem.scrollHeight - oContainerSectionElem.clientHeight;
                oCodeMirrorElem["CodeMirror"]["refresh"]();
            }, false);

            // Pas de section "Flux WMS" si la connexion est privée.
            var oLayerFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
            if (oLayerFormValues["private_connection"] === true)
                angular.element(document.getElementById("container_mode_" + envSrvc["oSelectedMode"]["mode_id"]).querySelectorAll(".section-form-section")[1]).off('click')

            // Pas de saisie de login ou mdp si la connexion de la couche est publique.
            if (envSrvc["sMode"] == "update") {
                var oLayerLoginDefinition = formSrvc["getFormElementDefinition"]("layer_login", envSrvc["sFormDefinitionName"]);
                var oLayerPasswordDefinition = formSrvc["getFormElementDefinition"]("layer_password", envSrvc["sFormDefinitionName"]);
                // Utilisateur + mdp : label.
                if (oLayerFormValues["private_connection"] === false) {
                    oLayerLoginDefinition["visible"] = false;
                    oLayerPasswordDefinition["visible"] = false;
                } else {
                    oLayerLoginDefinition["visible"] = true;
                    oLayerPasswordDefinition["visible"] = true;
                    document.querySelector(".form-row-layer-palette > div:last-child").style.bottom = "80px";
                }
                // Rafraîchit le formulaire.
                var formScope = angular.element("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"]).scope();
                formScope.$broadcast('$$rebind::refresh');
                formScope.$apply();
            }
        });
    };

    /**
     * displayMapServerSymbolsModal function.
     * Affiche le fichier de symboles de MapServer dans une fenêtre modale.
     */
    angular.element(vitisApp.appMainDrtv).scope()['displayMapServerSymbolsModal'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $compile = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$compile"]);
        var $templateRequest = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$templateRequest"]);
        //
        $log.info("displayMapServerSymbolsModal");
        var scope = this;
        // Affichage de la fenêtre modale.
        var oOptions = {
            "className": "dialog-modal-window dialog-modal-window-mapserver-symbols", //  layer-test-dialog-modal-window
            "message": '<div id="mapserver_symbols_container" class="mapserver-symbols-container"></div>'
        };
        scope.$root["modalWindow"]("dialog", "FORM_MAP_SERVER_SYMBOLS_MODAL_TITLE_VM4MS_VM4MS_LAYER", oOptions).then(function (oDialog) {
            // Largeur et hauteur du widget.
            var iModalWidth = parseInt(document.querySelector("body").clientWidth / 2);
            var iModalHeight = document.querySelector("body").clientHeight - 50;
            oDialog[0].querySelector(".modal-dialog").style.width = iModalWidth + "px";
            oDialog[0].querySelector(".modal-dialog").style.height = iModalHeight + "px";
            // Hauteur du header du widget.
            oDialog[0].querySelector(".modal-header").style.height = "56px";
            // Hauteur du body du widget.
            oDialog[0].querySelector(".modal-body").style.height = (iModalHeight - 56 - 4) + "px";
            // Compilation du template de la liste des symboles.
            $templateRequest("modules/vm4ms/template/mapServerSymbolsTpl.html").then(function (sTemplate) {
                $compile($("#mapserver_symbols_container").html(sTemplate).contents())(scope);
            });
        });
    };

    /**
     * displayMapServerFontsModal function.
     * Affiche la liste des polices de caractères du fichier fonts.list dans une fenêtre modale.
     */
    angular.element(vitisApp.appMainDrtv).scope()["displayMapServerFontsModal"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $compile = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$compile"]);
        var $templateRequest = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$templateRequest"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("displayMapServerFontsModal");
        var scope = this;
        // Affichage de la fenêtre modale.
        var oOptions = {
            "className": "dialog-modal-window dialog-modal-window-mapserver-fonts", //  layer-test-dialog-modal-window
            "message": '<div id="mapserver_fonts_container" class="mapserver-fonts-container"></div>'
        };
        scope.$root["modalWindow"]("dialog", "FORM_MAP_SERVER_FONTS_MODAL_TITLE_VM4MS_VM4MS_LAYER", oOptions).then(function (oDialog) {
            // Largeur et hauteur du widget.
            var iModalWidth = parseInt(document.querySelector("body").clientWidth / 2);
            var iModalHeight = document.querySelector("body").clientHeight - 50;
            oDialog[0].querySelector(".modal-dialog").style.width = iModalWidth + "px";
            oDialog[0].querySelector(".modal-dialog").style.height = iModalHeight + "px";
            // Hauteur du header du widget.
            oDialog[0].querySelector(".modal-header").style.height = "56px";
            // Hauteur du body du widget.
            oDialog[0].querySelector(".modal-body").style.height = (iModalHeight - 56 - 4) + "px";
            //
            ajaxRequest({
                "method": "GET",
                "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vm4ms/mapserver/Fonts",
                "scope": scope,
                "success": function (response) {
                    if (response["data"]["status"] == 1) {
                        scope["oMapServerFonts"] = envSrvc["extractWebServiceData"]("mapserver", response["data"])[0]["fonts"];
                        // Compilation du template de test de la couche.
                        $templateRequest("modules/vm4ms/template/mapServerFontsTpl.html").then(function (sTemplate) {
                            $compile($("#mapserver_fonts_container").html(sTemplate).contents())(scope);
                        });
                    } else {
                        //
                        var oOptions = {
                            "className": "modal-danger"
                        };
                        // Message d'erreur ?
                        if (response["data"]["errorMessage"] != null)
                            oOptions["message"] = response["data"]["errorMessage"];
                        scope.$root["modalWindow"]("alert", "REQUEST_ERROR", oOptions);
                    }
                }
            });
        });
    };

    /**
     * loadPrivateWmsServiceLayers function.
     * Chargement de la section "Couches du flux" de l'onglet "Flux WMS privés".
     */
    angular.element(vitisApp.appMainDrtv).scope()['loadPrivateWmsServiceLayers'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var $translate = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$translate"]);
        //
        $log.info("loadPrivateWmsServiceLayers");
        var scope = this;
        // Sauve la colonne et le sens de tri (onglet Flux WMS privé).
        var sSortedBy = envSrvc["oSelectedObject"]["sorted_by"];
        var sSortedDir = envSrvc["oSelectedObject"]["sorted_dir"];
        // Colonne et sens de tri.
        envSrvc["oSelectedObject"]["sorted_by"] = "name";
        envSrvc["oSelectedObject"]["sorted_dir"] = "ASC";
        // Affiche la liste des couches privées.
        $translate("FORM_GRID_TITLE_VM4MS_PRIVATE_WMS_SERVICE_LAYERS").then(function (sTranslation) {
            scope.$root["loadSectionList"]({
                "appHeader": true,
                "appHeaderSearchForm": false,
                "appGridTitle": sTranslation
            });
        });
        //
        var clearListener = scope.$root.$on('workspaceListTplCompiled', function (event, scope) {
            // Supprime le "listener".
            clearListener();
            // Restaure la colonne et le sens de tri (onglet Flux WMS privé).
            envSrvc["oSelectedObject"]["sorted_by"] = sSortedBy;
            envSrvc["oSelectedObject"]["sorted_dir"] = sSortedDir;
        });
    };

    /**
     * loadPublicWmsServiceLayers function.
     * Chargement de la section "Couches du flux" de l'onglet "Flux WMS publics".
     */
    angular.element(vitisApp.appMainDrtv).scope()['loadPublicWmsServiceLayers'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var $translate = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$translate"]);
        //
        $log.info("loadPublicWmsServiceLayers");
        var scope = this;
        // Sauve la colonne et le sens de tri (onglet Flux WMS public).
        var sSortedBy = envSrvc["oSelectedObject"]["sorted_by"];
        var sSortedDir = envSrvc["oSelectedObject"]["sorted_dir"];
        // Colonne et sens de tri.
        envSrvc["oSelectedObject"]["sorted_by"] = "name";
        envSrvc["oSelectedObject"]["sorted_dir"] = "ASC";
        // Affiche la liste des couches publiques.
        $translate("FORM_GRID_TITLE_VM4MS_PUBLIC_WMS_SERVICE_LAYERS").then(function (sTranslation) {
            scope.$root["loadSectionList"]({
                "appHeader": true,
                "appHeaderSearchForm": false,
                "appGridTitle": sTranslation,
                "oFilter": {
                    "relation": "AND",
                    "operators": [{
                            "column": "wmsservice_id",
                            "compare_operator": "=",
                            "value": envSrvc["sId"]
                        }]
                }
            });
        });
        //
        var clearListener = scope.$root.$on('workspaceListTplCompiled', function (event, scope) {
            // Supprime le "listener".
            clearListener();
            // Restaure la colonne et le sens de tri (onglet Flux WMS public).
            envSrvc["oSelectedObject"]["sorted_by"] = sSortedBy;
            envSrvc["oSelectedObject"]["sorted_dir"] = sSortedDir;
        });
    };

    /**
     * setOptionsFromWebService function.
     * Remplit les options par une liste de valeur retournée par un web service.
     * @param {string} Nom de l'élément
     * @param {string} sWebService Id de la ressource du web service.
     * @param {object} oUrlParams Paramètres pour le web service
     */
    angular.element(vitisApp.appMainDrtv).scope()['setOptionsFromWebService'] = function (sElemName, sWebService, oUrlParams) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $q = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["$q"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var formScope = angular.element("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"]).scope();
        //
        $log.info("setOptionsFromWebService");
        var scope = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        var aWebService = sWebService.split("/");
        aWebService.shift();
        ajaxRequest({
            "method": "GET",
            "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/" + sWebService,
            "params": oUrlParams,
            "scope": scope,
            "success": function (response) {
                if (response["data"]["status"] != 0) {
                    if (!goog.isDefAndNotNull(formScope['oFormValues'][envSrvc["sFormDefinitionName"]][sElemName]))
                        formScope['oFormValues'][envSrvc["sFormDefinitionName"]][sElemName] = {};
                    formScope['oFormValues'][envSrvc["sFormDefinitionName"]][sElemName]['options'] = [];
                    envSrvc["extractWebServiceData"](aWebService[0], response["data"]).forEach(function (oRow) {
                        formScope['oFormValues'][envSrvc["sFormDefinitionName"]][sElemName]['options'].push({
                            'value': oRow[Object.keys(oRow)[0]],
                            'label': oRow[Object.keys(oRow)[0]]
                        });
                    });
                    deferred.resolve();
                } else {
                    formScope['oFormValues'][envSrvc["sFormDefinitionName"]][sElemName]['options'] = [];
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
                    scope["modalWindow"]("alert", "REQUEST_ERROR", oOptions);
                }
            }
        });
        return promise;
    };

    /**
     * loadVm4msConfig function.
     * Chargement de la section "Configuration vMap4MapServer" dans l'onglet "Configuration".
     */
    angular.element(vitisApp.appMainDrtv).scope()['loadVm4msConfig'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("loadVm4msConfig");
        // Supprime l'échappement des doubles quotes. 
        if (typeof (propertiesSrvc["test_wms_service_default_content"]) == "string")
            propertiesSrvc["test_wms_service_default_content"] = propertiesSrvc["test_wms_service_default_content"].replace(/\\+"/g, '"');
        // Paramètres des properties dans les valeurs du formulaire de config de vMap4MapServer.
        angular.element(vitisApp.appMainDrtv).scope()["setPropertiesFormValues"](["mapserver_alias", "test_wms_service"]);
        // Surcharge l'url du formulaire des properties de vMap4MapServer.
        var scope = this;
        var sTable = envSrvc["oSelectedObject"]["name"];
        scope["oFormRequestParams"] = {
            "sUrl": "modules/vm4ms/forms/" + envSrvc["oSelectedMode"]["mode_id"] + "/" + sTable + "_" + envSrvc["oSectionForm"][sTable]["sections"][envSrvc["oSectionForm"][sTable]["iSelectedSectionIndex"]]["name"] + ".json"
        };
    };

    /**
     * setLayerTableOptions function.
     * Charge la liste des tables du schéma sélectionné
     */
    angular.element(vitisApp.appMainDrtv).scope()['setLayerTableOptions'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("setLayerTableOptions");
        var sSchema = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['tableschema']['selectedOption']['value'];
        if (goog.isDefAndNotNull(sSchema) && sSchema != "") {
            var scope = this;
            // Charge la liste des tables du schéma.
            var oUrlParams = {
                'order_by': 'table_name',
                "server": scope["oLayerConnection"]["server"],
                "port": scope["oLayerConnection"]["port"],
                'database': scope["oLayerConnection"]['database'],
                'schema': sSchema,
                'sort_order': 'ASC',
                'attributs': 'table_name',
                'distinct': true
            };
            // Identifiants de connexion.
            if (goog.isDefAndNotNull(scope["oLayerConnection"]["user"]))
                oUrlParams["login"] = scope["oLayerConnection"]["user"];
            if (goog.isDefAndNotNull(scope["oLayerConnection"]["password"]))
                oUrlParams["password"] = scope["oLayerConnection"]["password"];
            scope.$root['setOptionsFromWebService']('tablename', 'vitis/genericquerys', oUrlParams);
        }
    };

    /**
     * setLayerIdFieldOptions function.
     * Charge la liste des colonnes de la table sélectionnée
     */
    angular.element(vitisApp.appMainDrtv).scope()['setLayerIdFieldOptions'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("setLayerIdFieldOptions");
        var sTable = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['tablename']['selectedOption']['value'];
        if (goog.isDefAndNotNull(sTable) && sTable != "") {
            var scope = this;
            // Charge la liste des colonnes de la table.
            var oUrlParams = {
                'order_by': 'column_name',
                "server": scope["oLayerConnection"]["server"],
                "port": scope["oLayerConnection"]["port"],
                'database': scope["oLayerConnection"]['database'],
                'schema': envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['tableschema']['selectedOption']['value'],
                'table': sTable,
                'sort_order': 'ASC',
                'attributs': 'column_name',
                'distinct': true
            };
            // Identifiants de connexion.
            if (goog.isDefAndNotNull(scope["oLayerConnection"]["user"]))
                oUrlParams["login"] = scope["oLayerConnection"]["user"];
            if (goog.isDefAndNotNull(scope["oLayerConnection"]["password"]))
                oUrlParams["password"] = scope["oLayerConnection"]["password"];
            scope.$root['setOptionsFromWebService']('tableidfield', 'vitis/genericquerys/workspace/columns', oUrlParams);
        }
    };

    /**
     * afterSendingWmsServiceForm function.
     * Traitement après l'envoi du formulaire des onglets "Flux WMS privés" et "Flux WMS publics".
     */
    angular.element(vitisApp.appMainDrtv).scope()['afterSendingWmsServiceForm'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
        $log.info("afterSendingWmsServiceForm");
        // Recharge la section "Tests".
        var oWmsServiceSectionForm = envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]];
        oWmsServiceSectionForm["sections"].forEach(function (aSection) {
            if (aSection["name"] == "tests")
                aSection["bLoaded"] = false;
        })
    };

    /**
     * displayLayerLoadingError function.
     * Affiche le message d'erreur au chargement d'une couche.
     * @param {event} event Evènement d'erreur déclenché par OpenLayers.
     */
    angular.element(vitisApp.appMainDrtv).scope()['displayLayerLoadingError'] = function (event) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("displayLayerLoadingError");

        var scope = this;

        if (typeof(scope['oVM4MSLayerLoadingErrorLayers']) == "undefined" || scope['oVM4MSLayerLoadingErrorLayers'] == null)
            scope['oVM4MSLayerLoadingErrorLayers'] = {};
            
        // liste des couches en erreur
        if (goog.isObject(scope['oVM4MSLayerLoadingErrorLayers'])) {
            // Nom générique si la couche n'a pas de nom.
            var oLayerParams = event.target.getParams();
            var sLayerName = oLayerParams['LAYERS'];
            var sLayerIndex = sLayerName;
            if (typeof(sLayerName) == "undefined") {
                if (propertiesSrvc["language"] == "fr")
                    sLayerName = "Couche sans nom";
                else
                    sLayerName = "Unnamed layer";
                sLayerIndex = sLayerName + event.target.ol_uid;
            }
            //Infos de la couche.
            if (!goog.isDefAndNotNull(scope['oVM4MSLayerLoadingErrorLayers'][sLayerIndex])) {
                scope['oVM4MSLayerLoadingErrorLayers'][sLayerIndex] = {
                    'layer': sLayerName,
                    'url': event.image.src_,
                    'errorMessage': null
                };
            }

        } else {
            scope['oVM4MSLayerLoadingErrorLayers'] = {};
        }

        // Affiche la modale si elle n'existe pas encore
        if (!goog.isDefAndNotNull(scope['VM4MSLayerLoadingErrorModal'])) {
            scope['VM4MSLayerLoadingErrorModal'] = {};
            $translate(["ERROR_LOAD_IMAGE_OPEN_LAYERS_M4MS_WMS_SERVICE_TESTS_MULTIPLE"]).then(function (translations) {
                angular.element(vitisApp.appMainDrtv).scope().$root["modalWindow"]("dialog", translations["ERROR_LOAD_IMAGE_OPEN_LAYERS_M4MS_WMS_SERVICE_TESTS_MULTIPLE"], {
                    'className': 'modal-danger',
                    'message': '',
                    'appCallback': function ($rootScope, oDialog) {
                        scope['VM4MSLayerLoadingErrorModal'] = oDialog;

                        oDialog[0]['onblur'] = function () {
                            scope['oVM4MSLayerLoadingErrorLayers'] = null;
                            scope['VM4MSLayerLoadingErrorModal'] = null;
                        };
                    }
                });
            });
        }

        var changeErrorMessage = function () {
            // Création & affichage du message
            $translate(["ERROR_LOAD_IMAGE_OPEN_LAYERS_M4MS_WMS_SERVICE_TESTS_MULTIPLE_INFO"]).then(function (translations) {
                var sMessage = translations["ERROR_LOAD_IMAGE_OPEN_LAYERS_M4MS_WMS_SERVICE_TESTS_MULTIPLE_INFO"];
                var i = 0;
                for (var key in scope['oVM4MSLayerLoadingErrorLayers']) {
                    sMessage += '<div class="">';
                    sMessage += '<li>';
                    sMessage += '<a data-toggle="collapse" href="#ERROR_LOAD_IMAGE_OPEN_LAYERS_M4MS_WMS_SERVICE_TESTS_MULTIPLE_INFO_' + i + '">';
                    sMessage += scope['oVM4MSLayerLoadingErrorLayers'][key]['layer'];
                    sMessage += '</a>';
                    sMessage += '</li>';
                    sMessage += '</div>';
                    sMessage += '<div id="ERROR_LOAD_IMAGE_OPEN_LAYERS_M4MS_WMS_SERVICE_TESTS_MULTIPLE_INFO_' + i + '" class="collapse">';
                    sMessage += '<div class="">';
                    sMessage += goog.isDefAndNotNull(scope['oVM4MSLayerLoadingErrorLayers'][key]['errorMessage']) ? scope['oVM4MSLayerLoadingErrorLayers'][key]['errorMessage'] : '-';
                    sMessage += '</div>';
                    sMessage += '</div>';
                    i++;
                }
                scope['VM4MSLayerLoadingErrorModal'].find('.bootbox-body').html(sMessage);
            });
        };

        // Change le message de la modale en cours
        setTimeout(function () {
            if (goog.isDefAndNotNull(scope['VM4MSLayerLoadingErrorModal'])) {
                for (var key in scope['oVM4MSLayerLoadingErrorLayers']) {
                    if (!goog.isDefAndNotNull(scope['oVM4MSLayerLoadingErrorLayers'][key]['errorMessage'])) {
                        ajaxRequest({
                            "method": "GET",
                            "url": scope['oVM4MSLayerLoadingErrorLayers'][key]['url'],
                            "scope": scope,
                            "responseType": "text",
                            "success": angular.bind(this, function (key, changeErrorMessage, response) {
                                if (goog.isString(response["data"])) {
                                    var parser = new DOMParser();
                                    var xmlDoc = parser.parseFromString(response["data"], "text/xml");
                                    var sErrorMessage = "";
                                    xmlDoc.querySelectorAll("ServiceException").forEach(function (oServiceException) {
                                        sErrorMessage += oServiceException.textContent;
                                    });
                                    scope['oVM4MSLayerLoadingErrorLayers'][key]['errorMessage'] = sErrorMessage;
                                    changeErrorMessage();
                                }
                            }, key, changeErrorMessage)
                        });
                    }
                }
            }
        });
    };

    /**
     * appVm4msConnectionTypeColumn directive.
     * Mise en forme de la colonne "type" dans l'onglet "connexions".
     * @expose
     **/
    vitisApp.appVm4msConnectionTypeColumn = function () {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appVm4msConnectionTypeColumn", function (value) {
                    var sEnabledClassName;
                    if (scope["row"]["entity"][scope["col"]["field"]])
                        sEnabledClassName = "icon-lock";
                    else if (!scope["row"]["entity"][scope["col"]["field"]])
                        sEnabledClassName = "icon-unlocked";
                    // Classes css (ui-grid + spécifiques).
                    element[0].className = "ui-grid-cell-contents ui-grid-cell-svg-icon " + sEnabledClassName;
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive("appVm4msConnectionTypeColumn", vitisApp.appVm4msConnectionTypeColumn);

    /**
     * appTestWmsServiceColumn directive.
     * Mise en forme de la colonne "Flux de test" dans l'onglet "Flux WMS publics".
     * @param {service} propertiesSrvc Paramètres des properties.
     * @ngInject
     * @expose
     **/
    vitisApp.appTestWmsServiceColumn = function (propertiesSrvc) {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appTestWmsServiceColumn", function (value) {
                    var sEnabledClassName = "";
                    if (scope["row"]["entity"]["wmsservice_id"] == propertiesSrvc["test_wms_service"])
                        sEnabledClassName = "true-icon";
                    // Classes css (ui-grid + spécifiques).
                    element[0].className = "ui-grid-cell-contents ui-grid-cell-svg-icon " + sEnabledClassName;
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive("appTestWmsServiceColumn", vitisApp.appTestWmsServiceColumn);

    /**
     * appLayerTitleColumn directive.
     * Mise en forme de la colonne "Titre" dans la liste de l'onglet "Couches".
     * @param {service} $translate Translate service.
     * @ngInject
     **/
    vitisApp.appLayerTitleColumnDrtv = function ($translate) {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appLayerTitleColumn", function (value) {
                    // Si le champ est vide : supprime l'icône.
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        // Classes css (ui-grid + spécifiques).
                        element[0].className = "ui-grid-cell-contents info-icon";
                        // Traduction du titre et du contenu.
                        $translate(["TOOLTIP_TITLE_TITLE_VM4MS_VM4MS_LAYER"]).then(function (translations) {
                            // Création du "tooltip".
                            $(element)["popover"]({
                                "trigger": "hover",
                                "container": "body",
                                "title": function () {
                                    return translations["TOOLTIP_TITLE_TITLE_VM4MS_VM4MS_LAYER"];
                                },
                                "content": function () {
                                    return scope["row"]["entity"][scope["col"]["field"]];
                                },
                                // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                                "placement": function (oPopoverNode, oElementNode) {
                                    return scope.$root["workspaceTooltipPlacement"](oElementNode);
                                },
                                "html": true
                            });
                        });
                    }
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime le tooltip.
                    $(element)["popover"]("destroy");
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive('appLayerTitleColumn', vitisApp.appLayerTitleColumnDrtv);

    /**
     * initVm4msConnectionForm function.
     * Traitement après l'initialisation du formulaire d'une connexion.
     */
    angular.element(vitisApp.appMainDrtv).scope()['initVm4msConnectionForm'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(['$log']);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['envSrvc']);
        var $timeout = angular.element(vitisApp.appMainDrtv).injector().get(['$timeout']);
        //
        $log.info('initVm4msConnectionForm');
        var scope = this;
        var oPrivateConnectionRadios = document.querySelectorAll("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] input[name='private']");
        oPrivateConnectionRadios.forEach(function (oRadioElem) {
            oRadioElem.addEventListener('click', function () {
                scope.$root['setVm4msConnectionForm']();
            });
        });
        if (envSrvc['sMode'] === 'update') {
            var oConnectionFormValues = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']];
            oConnectionFormValues['private_database'] = oConnectionFormValues['database'];
            oConnectionFormValues['public_database'] = oConnectionFormValues['database'];
        }
        // Affiche/cache les champs
        this['setVm4msConnectionForm']();
    };

    /**
     * setVm4msConnectionForm function.
     * Affiche ou cache certains champs de form. en fonction du type de connexion.
     */
    angular.element(vitisApp.appMainDrtv).scope()['setVm4msConnectionForm'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(['$log']);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['envSrvc']);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['formSrvc']);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(['$translate']);
        var $timeout = angular.element(vitisApp.appMainDrtv).injector().get(['$timeout']);
        //
        $log.info('setVm4msConnectionForm');
        // Cache les champs serveur, port, utilisateur et mot de passe si la connexion est privée.
        var formScope = angular.element("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"]).scope();
        var oConnectionFormValues = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']];
        var oServerDef = formSrvc['getFormElementDefinition']('server', envSrvc['sFormDefinitionName']);
        var oPortDef = formSrvc['getFormElementDefinition']('port', envSrvc['sFormDefinitionName']);
        var oUserDef = formSrvc['getFormElementDefinition']('user', envSrvc['sFormDefinitionName']);
        var oPasswordDef = formSrvc['getFormElementDefinition']('password', envSrvc['sFormDefinitionName']);
        var oPublicDatabaseDef = formSrvc['getFormElementDefinition']('public_database', envSrvc['sFormDefinitionName']);
        var oPrivateDatabaseDef = formSrvc['getFormElementDefinition']('private_database', envSrvc['sFormDefinitionName']);
        if (oConnectionFormValues['private'] === true) {
            if (goog.isDefAndNotNull(oServerDef)) {
                oServerDef['visible'] = false;
            }
            if (goog.isDefAndNotNull(oPortDef)) {
                oPortDef['visible'] = false;
            }
            if (goog.isDefAndNotNull(oUserDef)) {
                oUserDef['visible'] = false;
            }
            if (goog.isDefAndNotNull(oPasswordDef)) {
                oPasswordDef['visible'] = false;
            }
            if (goog.isDefAndNotNull(oPublicDatabaseDef)) {
                oPublicDatabaseDef['visible'] = false;
            }
            if (goog.isDefAndNotNull(oPrivateDatabaseDef)) {
                oPrivateDatabaseDef['visible'] = true;
            }
        } else {
            if (goog.isDefAndNotNull(oServerDef)) {
                oServerDef['visible'] = true;
            }
            if (goog.isDefAndNotNull(oPortDef)) {
                oPortDef['visible'] = true;
            }
            if (goog.isDefAndNotNull(oUserDef)) {
                oUserDef['visible'] = true;
            }
            if (goog.isDefAndNotNull(oPasswordDef)) {
                oPasswordDef['visible'] = true;
            }
            if (goog.isDefAndNotNull(oPublicDatabaseDef)) {
                oPublicDatabaseDef['visible'] = true;
            }
            if (goog.isDefAndNotNull(oPrivateDatabaseDef)) {
                oPrivateDatabaseDef['visible'] = false;
            }
        }

        // Rafraîchit la définition du formulaire.
        formScope.$apply();
    };

    /**
     * beforeSendingVm4msConnectionForm function.
     * Traitement avant l'envoi du formulaire de connexion.
     */
    angular.element(vitisApp.appMainDrtv).scope()["beforeSendingVm4msConnectionForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("beforeSendingVm4msConnectionForm");
        var oConnectionFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
        if (oConnectionFormValues["private"] === true) {
            oConnectionFormValues["database"] = oConnectionFormValues["private_database"]["selectedOption"]["value"];
            oConnectionFormValues["server"] = "";
            oConnectionFormValues["port"] = "";
            oConnectionFormValues["user"] = "";
            oConnectionFormValues["password"] = "";
        } else {
            oConnectionFormValues["database"] = oConnectionFormValues["public_database"];
        }
    };

    /**
     * updateVm4msProperties function.
     * Traitement avant la mise à jour des properties de vm4ms.
     */
    angular.element(vitisApp.appMainDrtv).scope()["updateVm4msProperties"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var $timeout = angular.element(vitisApp.appMainDrtv).injector().get(['$timeout']);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("updateVm4msProperties");
        var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
        // Echappement des quotes.
        var sTestWmsServiceDefaultContent = oFormValues['test_wms_service_default_content'];
        //oFormValues['test_wms_service_default_content'] = oFormValues['test_wms_service_default_content'].replace(/'/g, "\\'");
        $rootScope["updateProperties"]('vm4ms');
        $timeout(function () {
            oFormValues['test_wms_service_default_content'] = sTestWmsServiceDefaultContent;
        });
    };
    
    /**
     * activateVm4msLayers function.
     * Active / désactive une couche.
     */
    angular.element(vitisApp.appMainDrtv).scope()["activateVm4msLayers"] = function (bActivate) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $q = angular.element(vitisApp.appMainDrtv).injector().get(["$q"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("activateVm4msLayers");
        // Activation ou désactivation de la couche ?
        if (typeof (bActivate) == "undefined")
            bActivate = true;
        //
        var scope = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        var oParams = {};
        // Des couches sont sélectionnées ?
        var aSelectedRows = scope.$root["gridApi"][scope["sSelectedObjectName"]]["selection"]["getSelectedRows"]();
        var sOperationId;
        if (aSelectedRows.length > 0) {
            // Activation ou désactivation de la couche ?
            var sErrorTitle;
            if (bActivate) {
                sOperationId = "activate";
                sErrorTitle = "ERROR_ACTIVATE_VM4MS_VM4MS_LAYER";
            } else {
                sOperationId = "desactivate";
                sErrorTitle = "ERROR_DESACTIVATE_VM4MS_VM4MS_LAYER";
            }
            // Liste des enregistrements à supprimer.
            var i = 0, aIdToDelete = [];
            while (i < aSelectedRows.length) {
                aIdToDelete.push(aSelectedRows[i][envSrvc["oSelectedObject"]["sIdField"]]);
                i++;
            }
            oParams["idList"] = aIdToDelete.join("|");
            ajaxRequest({
                "method": "PUT",
                "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vm4ms/layers/" + sOperationId,
                "data": oParams,
                "scope": scope,
                "success": function(response) {
                    if (response["data"]["status"] == 0) {
                        var oOptions = {
                            "className": "modal-danger",
                            "message": response["data"]["errorMessage"]
                        };
                        scope["modalWindow"]("dialog", sErrorTitle, oOptions);
                    } else {
                        // Ferme la fenêtre modale.
                        bootbox["hideAll"]();
                        // Recharge la liste des couches.
                        scope.$root["gridApi"][scope["sSelectedObjectName"]]["pagination"]["raise"]["paginationChanged"](1, scope["gridOptions"]["paginationPageSize"]);
                    }
                }
            });
        } else {
            var oOptions = {
                "className": "modal-danger",
                "appDuration": 2000
            };
            scope["modalWindow"]("dialog", "ERROR_NO_SELECTION_RESET_VM4MS_VM4MS_LAYER", oOptions);
        }
        // Retourne la promesse.
        return promise;
    };

    /**
     * desactivateVm4msLayers function.
     * Désactive une couche.
     */
    angular.element(vitisApp.appMainDrtv).scope()["desactivateVm4msLayers"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        //
        $log.info("desactivateVm4msLayers");
        this["activateVm4msLayers"](false);
    }
});
'use strict';

// Google closure
goog.provide("vitis.directives.activeDirectoryTree");
goog.require("vitis.modules.main");

/**
 * appActiveDirectoryFiles directive.
 * Liste des utilisateurs.
 **/
vitisApp.appActiveDirectoryFilesDrtv = function() {
        return {
                restrict: 'A',
                controller : 'activeDirectoryTreeCtrl',
                controllerAs : 'ctrl',
                templateUrl: "templates/workspaceListTpl.html"
        }
};
vitisApp.module.directive("appActiveDirectoryFiles", vitisApp.appActiveDirectoryFilesDrtv);

/**
 * appActiveDirectoryTreeForm directive.
 * Charge le template des éléments de formulaire.
 * @ngInject
 **/
vitisApp.appActiveDirectoryTreeFormDrtv = function() {
        return {
                replace: true,
                templateUrl: "templates/formTpl.html"
        }
};
vitisApp.module.directive("appActiveDirectoryTreeForm", vitisApp.appActiveDirectoryTreeFormDrtv);

/**
 * appActiveDirectoryTreeTreeviewContainer directive.
 * Charge et compile le template des arborescences des activeDirectoryTree.
 * @param {service} $translate Translate service.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} envSrvc Paramètres d'environnement.
 * @ngInject
 **/
vitisApp.appActiveDirectoryTreeTreeviewContainerDrtv = function($translate, propertiesSrvc, envSrvc) {
        return {
                link: function (scope, element, attrs) {
                        // Id de l'élément (pour le comoosant Treeview)
                        element[0].id = scope["sSelectedObjectName"] + "_treeview";
                        // Traduction du titre.
                        $translate("TITLE_SECTION_" + envSrvc["oSelectedObject"]["name"].toUpperCase()).then(function (sTitle) {
                                document.querySelector("#container_mode_" + envSrvc["oSelectedMode"]["mode_id"] + " .double-form-title").textContent = sTitle;
                        });
                        var oParams = {
                                "domain_id": scope["oLdap"]["sIdLdap"],
                                "login": scope["oLdap"]["sLoginLdap"].split("@")[0],
                                "password": scope["oLdap"]["sPwdLdap"],
                                "object": scope["oActiveDirectoryParameters"]["sObject"]
                        };
                        ajaxRequest({
                            "method": "GET",
                            "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vitis/ActiveDirectory/Tree",
                            "params": oParams,
                            "scope": scope,
                            "success": function(response) {
                                if (response["data"]["status"] == 1) {
                                    response["data"] = envSrvc["extractWebServiceData"]("activedirectory", response["data"])[0]["tree"];
                                    // Formate l'arbre pour Bootstrap Treeview.
                                    scope["aTreeviewActiveDirectoryTree"]["data"] = scope["convertAdTreeToBootstrapTreeview"](response["data"]);
                                    // Sauve le "sDn".
                                    scope["oLdap"]["sDn"] = response["data"][0]["id"].split(",").slice(1).join(",");
                                    // Crée l'arborescence dans l'élément.
                                    $(element)["treeview"]({
                                            "showBorder": false,
                                            //"expandIcon": "glyphicon glyphicon-folder-close",
                                            //"collapseIcon": "glyphicon glyphicon-folder-open",
                                            "expandIcon": "glyphicon glyphicon-plus",
                                            "collapseIcon": "glyphicon glyphicon-minus",
                                            "highlightSelected": true,
                                            "multiSelect": false,
                                            //"showCheckbox": true,
                                            "levels": 0,
                                            //"emptyIcon": "glyphicon glyphicon-minus",
                                            "data": scope["aTreeviewActiveDirectoryTree"]["data"],
                                            "onNodeSelected": function(event, data) {
                                                    // Charge le contenu de la branche.
                                                    scope["loadAdTreeBranch"](data["branch"]);
                                            }
                                    });
                                }
                            }
                        });
                        // Attends la suppression du scope.
                        scope.$on("$destroy", function () {
                            // Supprime le treeview.
                            $("#" + element[0].id)["treeview"]("remove");
                        });
                }
        }
};
vitisApp.module.directive("appActiveDirectoryTreeTreeviewContainer", vitisApp.appActiveDirectoryTreeTreeviewContainerDrtv);

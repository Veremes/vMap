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
 * @param {service} Restangular Service Restangular.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} sessionSrvc Service de gestion des sessions.
 * @ngInject
 **/
vitisApp.appActiveDirectoryTreeTreeviewContainerDrtv = function($translate, Restangular, propertiesSrvc, envSrvc, sessionSrvc) {
        return {
                link: function (scope, element, attrs) {
                        // Id de l'élément (pour le comoosant Treeview)
                        element[0].id = scope["sSelectedObjectName"] + "_treeview";
                        // Traduction du titre.
                        $translate("TITLE_SECTION_" + envSrvc["oSelectedObject"]["name"].toUpperCase()).then(function (sTitle) {
                                document.querySelector("#container_mode_" + envSrvc["oSelectedMode"]["mode_id"] + " .double-form-title").textContent = sTitle;
                        });
                        // Charge l'arborescence de l'active directory.
                        var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vitis", "ActiveDirectory");
                        var oParams = {
                                "domain_id": scope["oLdap"]["sIdLdap"],
                                "login": scope["oLdap"]["sLoginLdap"].split("@")[0],
                                "password": scope["oLdap"]["sPwdLdap"],
                                "token": sessionSrvc["token"],
                                "object": scope["oActiveDirectoryParameters"]["sObject"]
                        };
                        oWebServiceBase["customGET"]("Tree", oParams)
                                .then(function(data){
                                        if (data["status"] == 1) {
                                                data = envSrvc["extractWebServiceData"]("activedirectory", data)[0]["tree"];
                                                // Formate l'arbre pour Bootstrap Treeview.
                                                scope["aTreeviewActiveDirectoryTree"]["data"] = scope["convertAdTreeToBootstrapTreeview"](data);
                                                // Sauve le "sDn".
                                                scope["oLdap"]["sDn"] = data[0]["id"].split(",").slice(1).join(",");
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

'use strict';

// Google closure
goog.provide("vitis.controllers.activeDirectoryTree");
goog.require("vitis.modules.main");

/**
 * activeDirectoryTree Controller.
 * .
 * @param {angular.$log} $log Angular log service.
 * @param {angular.$scope} $scope Angular scope.
 * @param {service} $q Angular q service.
 * @param {service} $translate Translate service.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @ngInject
 **/
vitisApp.activeDirectoryTreeCtrl = function ($log, $scope, $q, $translate, envSrvc, propertiesSrvc) {
        // Initialisation
        $log.info("initActiveDirectoryTree");
        // Provisoire
        $scope["aTreeviewActiveDirectoryTree"] = {};
        // Paramétrage du module ui-grid
        $scope["gridOptions"] = {
                "enableRowSelection" : true,
                "enableSelectAll" : true,
                "enablePagination" : true,
                "enablePaginationControls" : false,
                "useExternalPagination" : true,
                "paginationPageSize" : 10,
                "enableColumnMenus" : false,
                "enableColumnResizing": true,    // Redimensionnement des colonnes.
                //"enableColumnMoving": true,      // Déplacement des colonnes.
                "paginationPageSizes": [10, 20, 50, 100],
                "appHeader": true, // Barre d'entête de la liste.
                "appHeaderTitleBar": true, // Barre (boutons...) sous le form. de recherche.
                "appHeaderSearchForm": false, // Formulaire de recherche.
                "appLoadGridData": false,
                "data": [],
                "columnDefs": []
        };
        
        // Définition des colonnes de la liste.
        var aTranslationsId = ["NAME_SEARCH_ACTIVE_DIRECTORY_USERS_USER",
                                "ACCOUNT_SEARCH_ACTIVE_DIRECTORY_USERS_USER",
                                "EMAIL_SEARCH_ACTIVE_DIRECTORY_USERS_USER",
                                "AGENCY_SEARCH_ACTIVE_DIRECTORY_USERS_USER",
                                "DEPARTMENT_SEARCH_ACTIVE_DIRECTORY_USERS_USER",
                                "GROUP_SEARCH_ACTIVE_DIRECTORY_USERS_USER"];
        $translate(aTranslationsId).then(function (aTranslations) {
                if ($scope["oActiveDirectoryParameters"]["sObject"] == "person") {
                        $scope["gridOptions"]["columnDefs"] = [
                                {"name": aTranslations["NAME_SEARCH_ACTIVE_DIRECTORY_USERS_USER"], "displayName": aTranslations["NAME_SEARCH_ACTIVE_DIRECTORY_USERS_USER"], "field": "displayname", "width": 200, "enableSorting": true,"type":"string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "active_directory_" + envSrvc["oSelectedObject"]["name"] + "_name"},
                                {"name": aTranslations["ACCOUNT_SEARCH_ACTIVE_DIRECTORY_USERS_USER"], "displayName": aTranslations["ACCOUNT_SEARCH_ACTIVE_DIRECTORY_USERS_USER"], "field": "userprincipalname", "width": 200, "enableSorting": true,"type":"string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "active_directory_" + envSrvc["oSelectedObject"]["name"] + "_login"},
                                {"name": aTranslations["EMAIL_SEARCH_ACTIVE_DIRECTORY_USERS_USER"],"displayName": aTranslations["EMAIL_SEARCH_ACTIVE_DIRECTORY_USERS_USER"], "field": "email", "width": 300, "enableSorting": true,"type":"string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "active_directory_" + envSrvc["oSelectedObject"]["name"] + "_email"},
                                {"name": aTranslations["AGENCY_SEARCH_ACTIVE_DIRECTORY_USERS_USER"], "displayName": aTranslations["AGENCY_SEARCH_ACTIVE_DIRECTORY_USERS_USER"], "field": "company", "width": 200, "enableSorting": true,"type":"string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "active_directory_" + envSrvc["oSelectedObject"]["name"] + "_company"},
                                {"name": aTranslations["DEPARTMENT_SEARCH_ACTIVE_DIRECTORY_USERS_USER"], "displayName": aTranslations["DEPARTMENT_SEARCH_ACTIVE_DIRECTORY_USERS_USER"], "field": "department", "width": 200, "enableSorting": true,"type":"string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "active_directory_" + envSrvc["oSelectedObject"]["name"] + "_company"}
                        ];
                }
                else {
                        $scope["gridOptions"]["columnDefs"] = [
                                {"name": aTranslations["GROUP_SEARCH_ACTIVE_DIRECTORY_USERS_USER"], "displayName": aTranslations["GROUP_SEARCH_ACTIVE_DIRECTORY_USERS_USER"], "field": "name", "width": 400, "enableSorting": true,"type":"string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "active_directory_" + envSrvc["oSelectedObject"]["name"] + "_name"}
                        ];
                }
        });
        
        // Bouton d'importation de la sélection.
        $translate("BTN_IMPORT_SELECTION_" + envSrvc["oSelectedObject"]["name"].toUpperCase()).then(function (sLabel) {
                envSrvc["oSelectedObject"]["actions"] = [
                        {
                                "label": sLabel,
                                "name": $scope["sSelectedObjectName"] + "_import_btn",
                                "event": "importAdSelection()"
                        }
                ];
                $scope["gridOptions"]["appActions"] = envSrvc["oSelectedObject"]["actions"];
        });
        
        // Nom + url du formulaire.
        $scope["sFormDefinitionName"] = envSrvc["oSelectedObject"]["name"] + "_search_form";
        // Paramètres pour la requête ajax du subform.
        $scope["oFormRequestParams"] = {
                "sUrl": "modules/vitis/forms/users/search_active_directory_" + $scope["oActiveDirectoryParameters"]["sObject"] + ".json"
        };
        // Suppression de la définition et des données du formulaire (sinon problème de cache...).
        //formSrvc["clearFormData"]($scope["sFormDefinitionName"]);
        $scope.$root["clearFormData"]($scope["sFormDefinitionName"], $scope);
        envSrvc["oFormValues"][$scope["sFormDefinitionName"]] = {};
        // Pas de données de form. à charger.
        $scope["bLoadFormValues"] = false;
        
        /**
         * convertAdTreeToBootstrapTreeview function.
         * Convertion d'une arborescence Active Directory pour le composant "Bootstrap Treeview".
         * @param {object} oAdtree Arborescence Active Directory
         * $return {object}
         **/
        $scope["convertAdTreeToBootstrapTreeview"] = function(oAdtree) {
                var oTrees = [], oTree, oNode;
                var i = 0;
                while (i < oAdtree.length) {
                        oTree = {
                                //"text": oAdtree[i]["id"].substr(0, 20),
                                "text": oAdtree[i]["id"].split(",")[0],
                                "branch": oAdtree[i]["id"]
                                //"selectable": false
                        };
                        //
                        //if (oAdtree[i]["items"].length > 0)
                        //oTree["icon"] = "glyphicon glyphicon-file";
                        //
                        if (oAdtree[i]["items"].length > 0)
                                oTree["nodes"] = $scope["convertAdTreeToBootstrapTreeview"](oAdtree[i]["items"]);
                        oTrees.push(oTree);
                        i++;
                }
               return oTrees;
        }
        
        /**
         * loadAdTreeBranch function.
         * Charge le contenu d'une branche d'un arbre active directory.
         * @param {string} sBranch Id de la branche d'un arbre active directory.
         **/
        $scope["loadAdTreeBranch"] = function(sBranch) {
                // Test du domaine
                var oParams = {
                        "domain_id": $scope["oLdap"]["sIdLdap"],
                        "login": $scope["oLdap"]["sLoginLdap"].split("@")[0],
                        "password": $scope["oLdap"]["sPwdLdap"],
                        //"branch": sBranch,
                        //"language": propertiesSrvc["language"],
                        "object": $scope["oActiveDirectoryParameters"]["sObject"]
                };
                // Charge les enregistrements de la branche.
                ajaxRequest({
                    "method": "GET",
                    "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vitis/ActiveDirectory/" + $scope["oActiveDirectoryParameters"]["sWebServicePath"] + "/" + sBranch,
                    "params": oParams,
                    "scope": $scope,
                    "success": function(response) {
                        if (response["data"]["status"] == 1) {
                            // MAJ de la liste des enregistrements.
                            $scope["gridOptions"]["data"] = envSrvc["extractWebServiceData"]("activedirectory", response["data"])[0][$scope["oActiveDirectoryParameters"]["sWebServicePath"].toLowerCase()];
                        }
                    }
                });
        };
        
        /**
         * importAdSelection function.
         * Importation des utilisateurs sélectionnés.
         **/
        $scope["importAdSelection"] = function() {
                var aSelection = $scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["selection"]["getSelectedRows"]();
                $scope["aSelection"] = angular.copy(aSelection);
                var i = 0;
                // Paramètres du service web.
                var oParams = {
                        "domain_id": $scope["oLdap"]["sIdLdap"],
                        "ldap_name": $scope["oLdap"]["sLdapName"]
                };
                //var sHeaders = {"Content-Type": undefined};
                while (i < aSelection.length) {
                        oParams["action"] = 'importFromAd';
                        if ($scope["oActiveDirectoryParameters"]["sObject"] == "person") {
                                oParams["company"] = aSelection[i]["company"];
                                oParams["department"] = aSelection[i]["department"];
                                oParams["email"] = aSelection[i]["email"];
                                oParams["name"] = aSelection[i]["displayname"];
                                oParams["login"] = aSelection[i]["userprincipalname"];
                        }
                        else
                                oParams["name"] = aSelection[i]["name"];
                        // Importation d'un enregistrement sélectionné.
                        ajaxRequest({
                            "method": "POST",
                            "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vitis/" + $scope["oActiveDirectoryParameters"]["sWebServicePath"].toLowerCase(),
                            "params": oParams,
                            "scope": $scope,
                            "success": function(response) {
                                if (response["data"]["status"] == 1) {
                                    $scope["aSelection"].shift();
                                    // Si l'importation est terminée avec succés: message ?
                                    if ($scope["aSelection"].length == 0) {
                                            $translate("SUCCESFULL_IMPORTATION_" + envSrvc["oSelectedObject"]["name"].toUpperCase()).then(function (sTranslation) {
                                                    $.notify(sTranslation, "success");
                                            });
                                            // Supprime la sélection.
                                            $scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["selection"]["clearSelectedRows"]();
                                    }
                                }
                                else {
                                    // Message d'erreur.
                                    $scope["aSelection"] = [];
                                    var oOptions = {"className": "modal-danger"};
                                    // Message d'erreur ?
                                    if (response["data"]["errorMessage"] != null)
                                            oOptions["message"] = response["data"]["errorMessage"];
                                    $scope["modalWindow"]("alert", "FORM_VALIDATION_ERROR", oOptions);
                                }
                            }
                        });
                        i++;
                }
        }
        
        /**
         * searchAdTree function.
         * Cherche un utilisateur ou un groupe dans un arbre active directory.
         * @param {string} sObject Type de recherche (user/group).
         **/
        $scope["searchAdTree"] = function(sObject) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var oParams = {
                        "domain_id": $scope["oLdap"]["sIdLdap"],
                        "login": $scope["oLdap"]["sLoginLdap"].split("@")[0],
                        "password": $scope["oLdap"]["sPwdLdap"],
                        //"branch": sBranch,
                        //"language": propertiesSrvc["language"],
                        //"object": "sObject"
                };
                // Valeurs du formulaire.
                var oFormValues = envSrvc["oFormValues"][$scope["sFormDefinitionName"]];
                var aKeys = Object.keys(oFormValues);
                var i = 0;
                while (i < aKeys.length) {
                        if (oFormValues[aKeys[i]] != "")
                                oParams[aKeys[i]] = oFormValues[aKeys[i]];
                        i++;
                }
                // Charge les enregistrements de la branche.
                ajaxRequest({
                    "method": "GET",
                    "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vitis/ActiveDirectory/" + $scope["oActiveDirectoryParameters"]["sWebServicePath"],
                    "params": oParams,
                    "scope": $scope,
                    "success": function(response) {
                        if (response["data"]["status"] == 1) {
                                // MAJ de la liste des enregistrements.
                                $scope["gridOptions"]["data"] = envSrvc["extractWebServiceData"]("activedirectory", response["data"])[0][$scope["oActiveDirectoryParameters"]["sWebServicePath"].toLowerCase()];
                        }
                        deferred.resolve();
                    }
                });
                // Retourne la promesse.
                return promise;
        };
};
vitisApp.module.controller("activeDirectoryTreeCtrl", vitisApp.activeDirectoryTreeCtrl);

/* global vitisApp, goog, angular, bootbox */

'use strict';
goog.provide('vitis.vitis.script_module');
goog.require('vitis');
goog.require('vitis.directives.htmlForm');
goog.require('vitis.directives.main');

vitisApp.on('appMainDrtvLoaded', function () {


    /**
     * preventUserPasswordChanged function.
     * Fenêtre de confirmation pour valider ou non le changement du mot de passe de l'utilisateur.
     * @param {boolean} bShowConfirm Affiche ou non une fenêtre de confirmation.
     * @return {promise}
     * @expose
     **/
    angular.element(vitisApp.appHtmlFormDrtv).scope().preventUserPasswordChanged = function (bShowConfirm) {
// Injection des services.
        var $q = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["$q"]);
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var userSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["userSrvc"]);
        // Création de la promesse.
        $log.info("preventUserPasswordChanged");
        var scope = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Changement de mot de passe ?
        var oPasswordInput = document.querySelector("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] input[name='password']");
        var oPasswordConfirmInput = document.querySelector("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] input[name='password_confirm']");
        if (envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["domain"] == null && oPasswordInput.value !== "") {
// Injection du service $translate.
            //var $translate = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["$translate"]);
            // Le mot de passe de confirmation est différent du mot de passe ?
            if (oPasswordInput.value !== oPasswordConfirmInput.value) {
// Affichage de la fenêtre d'erreur.
                var oOptions = {
                    "className": "modal-danger",
                    "appCallback": function () {
                        deferred.reject();
                    }
                };
                scope["modalWindow"]("dialog", "ERROR_PASSWORD_CONFIRM_USER_USER", oOptions);
            } else if (bShowConfirm || envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["user_id"] === userSrvc["id"]) {
// Affichage de la fenêtre de confirmation.
                var oOptions = {
                    "className": "modal-warning",
                    "message": "UPDATE_PASSWORD_USER_USER",
                    "callback": function (bResponse) {
                        if (bResponse)
                            deferred.resolve();
                        else
                            deferred.reject();
                    }
                };
                scope["modalWindow"]("confirm", "WARNING_PASSWORD_CHANGE_USER_USER", oOptions);
            } else
                deferred.resolve();
        } else
            deferred.resolve();
        return promise;
    };
    /**
     * disconnectUserPasswordChanged function.
     * Si changement de mot de passe : déconnexion de l'application.
     * @expose
     **/
    angular.element(vitisApp.appHtmlFormDrtv).scope().disconnectUserPasswordChanged = function () {
// Injection des services.
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var userSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["userSrvc"]);
        // Changement de mot de passe ?
        $log.info("disconnectUserPasswordChanged");
        // Pas un utilisateur de l'Active Directory ?
        if (envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["domain"] === null) {
            var oPasswordInput = document.querySelector("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] input[name='password']");
            var oPasswordConfirmInput = document.querySelector("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] input[name='password_confirm']");
            if (oPasswordInput.value !== "" && oPasswordInput.value === oPasswordConfirmInput.value && envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["user_id"] === userSrvc["id"]) {
// Injection des services.
                var sessionSrvc = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["sessionSrvc"]);
                // Déconnexion de l'application.
                sessionSrvc["disconnect"]();
            }
        }
    };
    /**
     * loadLogsJob function.
     * Paramétrage avant la compilation du template des logs. 
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().loadLogsJob = function () {
// Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        // Passage en mode "Update" (pour le formulaire).
        envSrvc["sMode"] = "update";
        $log.info("loadLogsJob");
    };
    /**
     * loadConfiguration function.
     * Paramétrage avant la compilation du template de configuration. 
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().loadConfiguration = function () {
// Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        // Passage en mode "Update" (pour le formulaire).
        envSrvc["sMode"] = "update";
        $log.info("loadConfiguration");
    };
    /**
     * setPropertiesFormValues function.
     * Affiche les valeurs du formulaire de l'onglet "configuration" (properties).
     * @param {array} aPropertiesToCopy Tableau de properties à copier.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().setPropertiesFormValues = function (aPropertiesToCopy) {
// Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        //
        $log.info("setPropertiesFormValues");
        var scope = this;
        // Pas de surcharge des valeurs du form. (sinon problème avec les options de <select> passés dans la structure).
        if (typeof (envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]) === "undefined" || goog.object.isEmpty(envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]])) {
            var clearListener = scope.$root.$on('formDefinitionLoaded', function (event, sFormDefinitionName) {
                // Suppression du "listener".
                clearListener();
                //
                var i = 0;
                var oFormElementDefinition;
                var aPropertiesKeys = Object.keys(propertiesSrvc);
                envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]] = {
                    "log_directories": propertiesSrvc["log_directories"]
                };
                // Properties à copier en options.
                if (!Array.isArray(aPropertiesToCopy))
                    aPropertiesToCopy = [];
                aPropertiesToCopy.forEach(function (sPropertieName) {
                    envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]][sPropertieName] = propertiesSrvc[sPropertieName];
                });
                //
                while (i < aPropertiesKeys.length) {
                    oFormElementDefinition = formSrvc["getFormElementDefinition"](aPropertiesKeys[i], envSrvc["sFormDefinitionName"]);
                    if (typeof (oFormElementDefinition) !== "undefined") {
                        if (oFormElementDefinition["type"] === "select")
                            envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]][aPropertiesKeys[i]] = {"selectedOption": {"value": angular.copy(propertiesSrvc[aPropertiesKeys[i]])}};
                        else
                            envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]][aPropertiesKeys[i]] = angular.copy(propertiesSrvc[aPropertiesKeys[i]]);
                    }
                    i++;
                }
                // max_upload_file_size
                var iMaxUploadFileSize = parseInt(envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["max_upload_file_size"]);
                if (iMaxUploadFileSize === "NaN")
                    iMaxUploadFileSize = "";
                else if (iMaxUploadFileSize > 0)
                    iMaxUploadFileSize = parseInt(iMaxUploadFileSize / (1024 * 1024));
                envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["max_upload_file_size"] = iMaxUploadFileSize;

                // rows_per_page (conversion en type "string").
                if (typeof (envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["rows_per_page"]) != "undefined")
                    envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["rows_per_page"]["selectedOption"]["value"] = String(envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["rows_per_page"]["selectedOption"]["value"]);

                // Sauve les valeurs du formulaire.
                envSrvc["oFormDefaultValues"][envSrvc["sFormDefinitionName"]] = angular.copy(envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]);
            });
        }
    };
    /**
     * 
     * @expose
     */
    angular.element(vitisApp.appHtmlFormDrtv).scope().testPublicConnection = function () {
        var scope = this.$new();
        var Restangular = angular.element(vitisApp.appMainDrtv).injector().get(["Restangular"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);
        var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vitis", "PrivateToken");
        var sPublicUser = document.getElementById("configuration_vitis_configuration_general_update_form_public_login").value;
        var sPublicPassword = document.getElementById("configuration_vitis_configuration_general_update_form_public_password").value;
        var oElem = {"user": sPublicUser, "password": sPublicPassword};
        var sPath = "";
        var oParams = {};
        // Demande de token pour l'utilisateur.
        oWebServiceBase["customPOST"](JSON.stringify(oElem), sPath, oParams)
                .then(function (data) {
                    if (data["status"] === 1) {
                        var oOptions = {"className": "modal-success"};
                        scope["modalWindow"]("dialog", "Connexion Réussie", oOptions);
                    } else {
                        // Message d'erreur.
                        var oOptions = {"className": "modal-danger"};
                        // Message d'erreur ?
                        if (data["errorMessage"] !== null)
                            oOptions["message"] = data["errorMessage"];
                        scope["modalWindow"]("alert", "ERROR_BIND_ACTIVE_DIRECTORY_USERS_USER", oOptions);
                    }
                });
    };
    /**
     * loadUser function.
     * Paramètrage avant l'édition du compte de l'utilisateur connecté.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().loadUser = function () {
// Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var userSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["userSrvc"]);
        //
        $log.info("loadUser");
        envSrvc["sId"] = userSrvc["id"];
        //
        var scope = this;
        var sFunctionName = "before" + goog.string.toTitleCase(envSrvc["oSelectedObject"]["name"], "_").replace(/_/g, "") + "Edition";
        scope.$root[sFunctionName]();
        //
        angular.element(vitisApp.appMainDrtv).scope().loadSimpleForm();
    };
    /**
     * appUserRoleColumn directive.
     * Mise en forme de la colonne "role" dans la liste de l'onglet "users_user" (Utilisateurs).
     * @param {service} $translate Translate service.
     * @expose
     * @ngInject
     **/
    vitisApp.appUserRoleColumnDrtv = function ($translate) {
        return {
            link: function (scope, element, attrs) {
// 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appUserRoleColumn", function (value) {
// Si le champ est vide : supprime l'icône.  
                    if (scope["row"]["entity"][scope["col"]["field"]] === null || scope["row"]["entity"][scope["col"]["field"]] === "")
                        element[0].className = "";
                    else {
                        var sUserRoleClassName;
                        // Classe css suivant le rôle.
                        if (value === "admin")
                            sUserRoleClassName = "admin-role";
                        else if (value === "user")
                            sUserRoleClassName = "user-role";
                        // Classes css (ui-grid + spécifiques).
                        element[0].className = "ui-grid-cell-contents " + sUserRoleClassName;
                        // Traduction du titre et du contenu.
                        $translate(["USER_ROLE_TOOLTIP_TITLE_USERS_USER", "USER_ROLE_ADMIN_TOOLTIP_CONTENT_USERS_USER", "USER_ROLE_USER_TOOLTIP_CONTENT_USERS_USER"]).then(function (translations) {
                            // Création du "tooltip".
                            $(element)["popover"]({
                                "trigger": "hover",
                                "container": "body",
                                "title": translations["USER_ROLE_TOOLTIP_TITLE_USERS_USER"],
                                "content": function () {
                                    var sContent = "";
                                    if (scope["row"]["entity"][scope["col"]["field"]] === "admin")
                                        sContent = translations["USER_ROLE_ADMIN_TOOLTIP_CONTENT_USERS_USER"];
                                    else if (scope["row"]["entity"][scope["col"]["field"]] === "user")
                                        sContent = translations["USER_ROLE_USER_TOOLTIP_CONTENT_USERS_USER"];
                                    return sContent;
                                },
                                // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                                "placement": function (oPopoverNode, oElementNode) {
                                    return scope.$root["workspaceTooltipPlacement"](oElementNode);
                                }
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
        };
    };
    vitisApp["compileProvider"].directive("appUserRoleColumn", vitisApp.appUserRoleColumnDrtv);

    /**
     * hideExcludedUserPrivileges function.
     * Cache les privilèges protégés de l'utilisateur de la liste des options sélectionnées d'un "double-select".
     * @param {string} sFormElementName Nom du champ de formulaire.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().hideExcludedUserPrivileges = function (sFormElementName) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $timeout = angular.element(vitisApp.appMainDrtv).injector().get(["$timeout"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var userSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["userSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        //
        $log.info("hideExcludedUserPrivileges");
        // 
        if (envSrvc["sId"] === userSrvc["id"]) {
            // Attends un cycle de "$digest".
            $timeout(function () {
                // Privilèges à exclure.
                var aUserPrivileges = ["vitis_admin", "vitis_user"];
                // Id et nom des 2 <select>.
                var oFormElementDefinition = formSrvc["getFormElementDefinition"](sFormElementName, envSrvc["sFormDefinitionName"]);
                var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
                var aSelectId = [oFormElementDefinition["id"], oFormElementDefinition["id_from"]];
                var aSelectName = [sFormElementName, oFormElementDefinition["name_from"]];
                // Cache les privilèges exclus dans les 2 <select>.
                var i, oSelect;
                var j = 0;
                while (j < aSelectId.length) {
                    i = 0;
                    oSelect = document.getElementById(aSelectId[j]);
                    while (oSelect.options.length > i) {
                        oSelect.options[i].style.display = "";
                        if (aUserPrivileges.indexOf(oSelect.options[i].text) !== -1) {
                            oSelect.options[i].style.display = "none";
                            oFormValues[aSelectName[j]]["options"][i]["disabled"] = true;
                        }
                        i++;
                    }
                    j++;
                }
            });
        }
        // Formatage de la date de dernière connexion.
        if (goog.isDefAndNotNull(envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["last_connection"]))
            envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["last_connection"] = moment(envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["last_connection"]).format('L LTS');
    };

    /**
     * ImportFromAd function.
     * Affichage de la fenêtre modale et du formulaire de connexion au serveur AD.
     * @param {string} sObject Types d'enregistrements (users/groups).
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().ImportFromAd = function (sObject) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $compile = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$compile"]);
        var $templateRequest = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$templateRequest"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        var modesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["modesSrvc"]);
        //
        $log.info("ImportFromAd");
        // Crée un nouveau scope.
        var scope = this.$new();
        // Sauve le nouveau scope crée dans la définition de l'onglet. 
        //modesSrvc["addScopeToObject"](envSrvc["oSelectedObject"]["name"], envSrvc["oSelectedMode"]["mode_id"], scope);
        // 
        scope["oActiveDirectoryParameters"] = {"sObject": sObject};
        if (sObject == "person")
            scope["oActiveDirectoryParameters"]["sWebServicePath"] = "Users";
        else
            scope["oActiveDirectoryParameters"]["sWebServicePath"] = "Groups";
        //
        var sFormId = "form_active_directory_connection_" + envSrvc["oSelectedObject"]["name"];
        // Traduction du titre et affichage de la fenêtre modale.
        var oOptions = {
            "className": "dialog-modal-window dialog-modal-window-ad-connection",
            "message": '<div id="' + sFormId + '"></div>',
        };
        scope["modalWindow"]("dialog", "TITLE_ACTIVE_DIRECTORY_CONNECTION", oOptions);

        // Nom + url du formulaire.
        scope["sFormDefinitionName"] = envSrvc["oSelectedObject"]["name"] + "_import_ad_form";
        envSrvc["sFormDefinitionName"] = scope["sFormDefinitionName"];
        // Paramètres pour la requête ajax du subform.
        scope["oFormRequestParams"] = {
            "sUrl": "modules/vitis/forms/users/active_directory_connection.json",
        };
        // Suppression de la définition et des données du formulaire (sinon problème de cache...).
        //formSrvc["clearFormData"](scope["sFormDefinitionName"]);
        scope.$root["clearFormData"](scope["sFormDefinitionName"], scope);
        // Pas de données de form. à charger.
        scope["bLoadFormValues"] = false;
        envSrvc["oFormValues"][scope["sFormDefinitionName"]] = {};

        // Compile le template de formulaire.
        var sTemplateUrl = 'templates/formTpl.html';
        $templateRequest(sTemplateUrl).then(function (sTemplate) {
            $compile($("#" + sFormId).html(sTemplate).contents())(scope);
        });
        $log.info('compileObjectTemplate : ' + sTemplateUrl);
        // Attends la fin de l'affichage formulaire.
        var clearListener = scope.$root.$on('endFormNgRepeat', function (event) {
            // Supprime le "listener".
            clearListener();
            // Crée l'élément pour afficher le domaine sélectionné après le login.
            var oLoginDomainElement = document.createElement("span");
            oLoginDomainElement["id"] = envSrvc["sFormDefinitionName"] + "_login_domain";
            oLoginDomainElement["className"] = "dialog-modal-window-login-domain";
            document.querySelector("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] .row:nth-child(2)").appendChild(oLoginDomainElement);
            // Attends la fin du chargement de la liste des domaines.
            var clearListener2 = scope.$root.$on('webServiceSelectOptionsloaded', function (event) {
                // Supprime le "listener".
                clearListener2();
                // Si aucun domaine dans la base : supprime l'option vide crée par angular.
                if (envSrvc["oFormValues"][scope["sFormDefinitionName"]]["domain"]["options"].length == 0)
                    document.querySelector("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] select[name='domain']")["options"]["length"] = 0
                else
                    oLoginDomainElement.innerHTML = "@" + envSrvc["oFormValues"][scope["sFormDefinitionName"]]["domain"]["selectedOption"]["label"];
            });
            // Evènement sur le <select> des domaines.
            document.querySelector("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] select[name='domain']").addEventListener("change", function () {
                oLoginDomainElement.innerHTML = "@" + this["selectedOptions"][0]["text"];
            });
        });
    };

    /**
     * loadImportForm function.
     * Connexion au serveur AD et compilation du template (arborescence, form. de recherche et liste).
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().loadImportForm = function () {
// Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $q = angular.element(vitisApp.appMainDrtv).injector().get(["$q"]);
        var $compile = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$compile"]);
        var $templateRequest = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$templateRequest"]);
        var Restangular = angular.element(vitisApp.appMainDrtv).injector().get(["Restangular"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);
        var modesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["modesSrvc"]);
        //
        $log.info("loadImportForm");
        var scope = this;
        // Sauve le scope parent dans la définition de l'onglet. 
        modesSrvc["addScopeToObject"](envSrvc["oSelectedObject"]["name"], envSrvc["oSelectedMode"]["mode_id"], scope);
        var scope = scope.$new();
        // Sauve le nouveau scope crée dans la définition de l'onglet. 
        modesSrvc["addScopeToObject"](envSrvc["oSelectedObject"]["name"], envSrvc["oSelectedMode"]["mode_id"], scope);
        var deferred = $q.defer();
        var promise = deferred.promise;
        var oFormValues = envSrvc["oFormValues"][scope["sFormDefinitionName"]];
        //
        var key = oFormValues['login'] + "@" + oFormValues['domain']['selectedOption']["label"];
        var ciphertext = des(key, oFormValues['password'], 1, 0);
        // Test du domaine
        var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vitis", "ActiveDirectory");
        var oParams = {
            "login": oFormValues['login'],
            "password": stringToHex(ciphertext),
            "object": scope["oActiveDirectoryParameters"]["sObject"],
            //"language": propertiesSrvc["language"],
            "token": sessionSrvc["token"],
            "domain_id": oFormValues['domain']['selectedOption']["value"]
        };
        // Charge les données du formulaire.
        oWebServiceBase["customGET"]("Test", oParams)
                .then(function (data) {
                    if (data["status"] === 1) {
                        // Connexion ok : suppression de la fenêtre de connexion.
                        bootbox["hideAll"]();
                        // Sauve les données de connexion au serveur AD.
                        scope["oLdap"] = envSrvc["extractWebServiceData"]("activedirectory", data)[0];
                        //
                        envSrvc["oSelectedObject"] = {
                            "actions": [],
                            "columns": [],
                            "mode_id": envSrvc["oSelectedMode"]["mode_id"],
                            "name": "active_directory_" + envSrvc["oSelectedObject"]["name"],
                            //"ressource_id": "gtf/workspaces",
                            "sections": "",
                            "template_name": "activeDirectoryTree",
                            "aScope": envSrvc["oSelectedObject"]["aScope"]
                        };
                        // Sauve le nouvel onglet.
                        var oMode = modesSrvc["getMode"](envSrvc["oSelectedMode"]["mode_id"]);
                        oMode["objects"].push(envSrvc["oSelectedObject"]);
                        // Sauve le nouveau scope crée dans la définition de l'onglet. 
                        modesSrvc["addScopeToObject"](envSrvc["oSelectedObject"]["name"], envSrvc["oSelectedMode"]["mode_id"], scope);
                        // Compilation du template "doubleFormTpl".
                        var sTemplateUrl = 'templates/doubleFormTpl.html';
                        $templateRequest(sTemplateUrl).then(function (sTemplate) {
                            $compile($("#container_mode_" + envSrvc["oSelectedMode"]["mode_id"]).html(sTemplate).contents())(scope);
                        });
                        $log.info('compileObjectTemplate : ' + sTemplateUrl);
                        //
                        deferred.resolve();
                    } else {
                        // Message d'erreur.
                        scope["aSelection"] = [];
                        var oOptions = {"className": "modal-danger"};
                        // Message d'erreur ?
                        if (data["errorMessage"] !== null)
                            oOptions["message"] = data["errorMessage"];
                        scope["modalWindow"]("alert", "ERROR_BIND_ACTIVE_DIRECTORY_USERS_USER", oOptions);
                    }
                });
        // Retourne la promesse.
        return promise;
    };
    /**
     * updateProperties function.
     * Sauve les properties du module.
     * @param {string} sModuleName Nom du module.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().updateProperties = function (sModuleName) {
// Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
        var $window = angular.element(vitisApp.appMainDrtv).injector().get(["$window"]);
        var Restangular = angular.element(vitisApp.appMainDrtv).injector().get(["Restangular"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        //
        $log.info("updateProperties");
        var scope = this;
        // Paramètres du service web.
        var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vitis/Properties", sModuleName);
        // Paramètres du webservice.
        var oElem = {
            "properties": formSrvc["getFormData"](envSrvc["sFormDefinitionName"], true),
            "module_name": sModuleName
        };
//var oElem = oWebServiceParams;
        var sPath = "";
        var oParams = {"token": sessionSrvc["token"]};
        //var sHeaders = {"Content-Type": undefined};
        // Requête REST.
        oWebServiceBase["customPUT"](oElem, sPath, oParams)
                .then(function (data) {
                    if (data["status"] === 1) {
                        // MAJ des properties OK.
                        $translate("FORM_VALIDATION_OK").then(function (sTranslation) {
                            $.notify(sTranslation, "success");
                        });
                        // Rechargement de la page si la langue est modifiée.
                        if (sModuleName === "vitis" && propertiesSrvc["language"] !== oElem["properties"]["language"]) {
                            var oOptions = {
                                "className": "modal-warning",
                                "message": "PAGE_RELOAD_CONFIRM_CONFIGURATION",
                                "callback": function (bResponse) {
                                    if (bResponse)
                                        $window.location.reload();
                                }
                            };
                            scope["modalWindow"]("confirm", "", oOptions);
                        }
                        // Recharge les properties.
                        propertiesSrvc["getFromServer"]();
                    } else {
                        // Message d'erreur.
                        var oOptions = {"className": "modal-danger"};
                        // Message d'erreur ?
                        if (data["errorMessage"] !== null)
                            oOptions["message"] = data["errorMessage"];
                        scope["modalWindow"]("alert", "FORM_VALIDATION_ERROR", oOptions);
                    }
                }
                );
    };
    /**
     * beforeUsersVitisUsersEdition function.
     * Données non modifiables si l'utilidateur vient de l'Active Directory.
     * @param {object} sId Id de l'enregistrement sélectionné dans la liste.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().beforeUsersVitisUsersEdition = function (sId) {
// Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var Restangular = angular.element(vitisApp.appMainDrtv).injector().get(["Restangular"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);
        //
        $log.info("beforeUsersVitisUsersEdition");
        var scope = this;
        var clearListener = scope.$root.$on('formDefinitionLoaded', function (event, sFormDefinitionName) {
            // Suppression du "listener".
            clearListener();
            //
            if (envSrvc["oFormValues"][sFormDefinitionName]["domain"] != null) {
                var oFormElementDefinition = formSrvc["getAllFormElementDefinition"](sFormDefinitionName);
                var i = 0;
                while (i < oFormElementDefinition.length) {
                    switch (oFormElementDefinition[i]["name"]) {
                        case "name":
                        case "email":
                        case "company":
                        case "department":
                            oFormElementDefinition[i]["type"] = "label";
                            break;
                        case "new_password_title":
                        case "password":
                        case "password_confirm":
                            oFormElementDefinition[i]["visible"] = false;
                            break;
                        case "groups":
                        case "privileges":
                            if (!propertiesSrvc["mixed_rights_management"])
                                oFormElementDefinition[i]["visible"] = false;
                            break;
                            // Groupes du domaine dont l'utilisateur est membre.
                        case "active_directory_groups":
                            oFormElementDefinition[i]["visible"] = true;
                            // Paramètres du webservice.
                            var oParams = {"token": sessionSrvc["token"]};
                            var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vitis", "ActiveDirectory");
                            // Requête REST.
                            oWebServiceBase["customGET"]("UserGroups/" + sId, oParams)
                                    .then(function (data) {
                                        if (data["status"] === 1) {
                                            envSrvc["oFormValues"][sFormDefinitionName]["active_directory_groups"] = data["activedirectory"][0]["adGroups"];
                                            envSrvc["oFormValues"][sFormDefinitionName]["all_groups"] = data["activedirectory"][0]["allGroups"];
                                        }
                                    }
                                    );
                            break;
                            // Récapitulatif de tous les groupes de l'utilisateur.
                        case "all_groups":
                            if (propertiesSrvc["mixed_rights_management"])
                                oFormElementDefinition[i]["visible"] = true;
                            break;
                    }
                    i++;
                }
            }
        });
    };
    /**
     * beforeUserVitisUserEdition function.
     * Données non modifiables si l'utilidateur vient de l'Active Directory .
     * @param {object} sId Id de l'enregistrement sélectionné dans la liste.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().beforeUserVitisUserEdition = function (sId) {
// Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        //
        $log.info("beforeUserVitisUserEdition");
        var scope = this;
        var clearListener = scope.$root.$on('formDefinitionLoaded', function (event, sFormDefinitionName) {
            // Supprime le listener.
            clearListener();
            //
            if (envSrvc["oFormValues"][sFormDefinitionName]["domain"] !== null) {
                var oFormElementDefinition = formSrvc["getAllFormElementDefinition"](sFormDefinitionName);
                var i = 0;
                while (i < oFormElementDefinition.length) {
                    switch (oFormElementDefinition[i]["name"]) {
                        case "new_password_title":
                        case "password":
                        case "password_confirm":
                            oFormElementDefinition[i]["visible"] = false;
                            break;
                    }
                    i++;
                }
            }
        });
    };
    /**
     * beforeSendingDomainForm function.
     * Actions à effectuer avant l'envoi du form. d'un domaine.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().beforeSendingDomainForm = function () {
// Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("beforeSendingDomainForm");
        // Cryptage du mot de passe avant la sauvegarde dans la base.
        var scope = this;
        var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
        if (oFormValues['login'] != null) {
// Ajoute "@" + domaine.
            if (oFormValues['login'].indexOf("@") === -1)
                oFormValues['login'] += "@" + oFormValues['domain'];
            // Crypte le mdp.
            if (oFormValues['password'] != null) {
// Ne crypte pas 2 fois le mdp.
                if (oFormValues['password'].substr(0, 2) !== "0x") {
                    var key = oFormValues['login'];
                    var ciphertext = des(key, oFormValues['password'], 1, 0);
                    oFormValues['password'] = stringToHex(ciphertext);
                    // Décryptage
                    //console.log(des (key, hexToString(password), 0, 0));
                }
            }
        }
//

    };
    /**
     * getUsers2DomainFilter function.
     * Actions à effectuer avant l'envoi du form. d'un domaine.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().getUsers2DomainFilter = function () {
// Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("getUsers2DomainFilter");
        if (!propertiesSrvc["mixed_rights_management"])
            return "IS NULL";
    };

    /**
     * isImgFile function.
     * @param {string} sFile FilesName
     * @return {boolean} true if it's an image
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope()["isImgFile"] = function (sFile) {
        //liste des extension image
        var sExtAccepted = ["jpg", "png", "jpeg"];
        //récupération de l'extension dufichier courant
        var aExt = sFile.split(".");
        return (sExtAccepted.indexOf(aExt[aExt.length - 1].toLowerCase()) > -1);
    };
    /**
     * appSignaletiqueImgViewer directive.
     * Visualisation photo.
     * @expose
     * @ngInject
     **/
    vitisApp.appDocumentViewerDrtv = function () {
        return {
            replace: true,
            template: '<div>' +
                    '<img class="miniature_picture ui-grid-cell-contents" width="50" height="50" ng-src="{{urlToPicture}}" ng-hide="true"></img>' +
                    '<span ng-show="responseHavePicture && !bFileIsPdf" ng-click="openViewer()" class="glyphicon glyphicon-picture grid-column-glyph-icon"></span>' +
                    '<a ng-show="responseHavePicture && bFileIsPdf" ng-href="{{urlToPicture}}" target="_blank"><span class="glyphicon glyphicon-link grid-column-glyph-icon"></span></a>' +
                    '</div>',
            link: function (scope, element, attrs) {

                // 1er affichage ou tri de la liste : maj de la mise en forme.
                //console.log(attrs);
                var clearObserver = attrs.$observe("file", function () {
                    if (attrs.file === null || attrs.file === "") {
                        element[0].children[1].className = "";
                    }
                    if (!goog.isDefAndNotNull(attrs["path"])) {
                        console.error("Path attribute is not present on directive caller");
                        return;
                    }

                    if (!goog.isDefAndNotNull(attrs["file"])) {
                        console.error("File attribute is not present on directive caller");
                        return;
                    } else if (attrs["file"] === "") {
                        console.error("File attribute is an empty string");
                        return;
                    }

                    if (!goog.isDefAndNotNull(attrs["maxPopover"])) {
                        console.warn("maxPopover attribute is not present on directive caller (set with default value : 200)");
                        attrs["maxPopover"] = 200;
                    } else if (attrs["maxPopover"] === "") {
                        console.warn("File attribute is an empty string (set with default value : 200)");
                        attrs["maxPopover"] = 200;
                    } else if (goog.isString(attrs["maxPopover"])) {
                        attrs["maxPopover"] = parseInt(attrs["maxPopover"]);
                    }

                    if (!goog.isDefAndNotNull(attrs["imgClass"])) {
                        attrs["imgClass"] = "";
                    } else if (!goog.isString(attrs["imgClass"]) /*&& !goog.isFunction(attrs["imgClass"])*/) {
                        attrs["imgClass"] = "";
                    }

                    if (!goog.isDefAndNotNull(attrs["popoverClass"])) {
                        attrs["popoverClass"] = "";
                    } else if (!goog.isString(attrs["popoverClass"]) /*&& !goog.isFunction(attrs["popoverClass"])*/) {
                        attrs["popoverClass"] = "";
                    }

                    scope["oProperties"] = angular.element("#works_line").scope()["oProperties"];
                    if (goog.isDefAndNotNull(scope[attrs.path])) {
                        scope["path"] = scope[attrs.path];
                    } else {
                        scope["path"] = attrs.path;
                    }

                    scope["urlToPicture"] = scope["oProperties"]["web_server_name"] + "/" + scope["oProperties"]["public_alias"] + "/" + scope["path"] + "/" + attrs.file;
                    if (/^https?:\/\//.test(attrs.file)) {
                        scope["urlToPicture"] = attrs.file;
                    }

                    var img = element.find("img");
                    img[0].onerror = function () {
                        console.error('Fail to load image', attrs.file);
                    };
                    img[0].onload = function () {
                        scope.$applyAsync(function () {
                            scope["responseHavePicture"] = true;
                        });
                    };

                    //var aExt = attrs.file.split(".");
                    scope["bFileIsPdf"] = !scope.$root["isImgFile"](attrs.file);
                    element[0].parentNode.style.textAlign = "center";
                    if (!scope["bFileIsPdf"]) {
                        // Si le champ est vide : supprime le lien.  
                        if (attrs.file === null || attrs.file === "") {
                            element[0].children[1].className = "";
                            // Attends la suppression du scope.
                        } else {
                            var options = {
                                "inline": false,
                                "button": true,
                                "navbar": false,
                                "title": 2,
                                "toolbar": 2,
                                "tooltip": true,
                                "fullscreen": false,
                                "url": function () {
                                    return scope["urlToPicture"];
                                }
                            };
                            if (goog.isDefAndNotNull(scope["viewer"])) {
                                scope["viewer"].update();
                            } else {
                                scope["viewer"] = new Viewer(element[0].children[0], options);
                            }
                            scope["openViewer"] = function () {
                                scope["viewer"].show();
                                angular.element(".viewer-prev").remove();
                                angular.element(".viewer-next").remove();
                            };
                            // Création du "tooltip".
                            $(element[0].children[1])["popover"]({
                                "trigger": "hover",
                                "container": "body",
                                "title": "",
                                "content": function () {
                                    var oImg = document.createElement("img");
                                    oImg.src = scope["urlToPicture"];
                                    var maxSizePopover = attrs["maxPopover"];
                                    var realWidth = oImg.naturalWidth;
                                    var realHeight = oImg.naturalHeight;
                                    var ScalingFactor = (realWidth < realHeight) ? realHeight / maxSizePopover : realWidth / maxSizePopover;
                                    oImg.width = (ScalingFactor > 0) ? realWidth / ScalingFactor : realWidth;
                                    oImg.height = (ScalingFactor > 0) ? realHeight / ScalingFactor : realHeight;
                                    oImg.className = attrs["imgClass"];
                                    return oImg.outerHTML;
                                },
                                "html": true,
                                "template": '<div class="popover ' + attrs["popoverClass"] + ' " role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
                            });
                            // Attends la suppression du scope.
                            scope.$on("$destroy", function () {
                                // Supprime le tooltip.
                                $(element[0].children[1])["popover"]("destroy");
                                scope["viewer"].destroy();
                                // Supprime l'observateur.
                                clearObserver();
                            });
                        }
                    }
                });
            }
        };
    };
    vitisApp["compileProvider"].directive("appDocumentViewer", vitisApp.appDocumentViewerDrtv);

    /**
     * appLinker directive.
     * Lien entre ce champs et un autre champs d'une autre table correspondant au code.
     * @param {object} $timeout Angular Tiemout service.
     * @expose
     * @ngInject
     * 
     **/
    vitisApp.appLinkerDrtv = function ($timeout) {
        return {
            replace: false,
            template: '<a ng-click="goToItem()">{{itemData}}</a>',
            link: function (scope, element, attrs) {

                var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
                var clearObserver = attrs.$observe("itemData", function () {
                    if (!goog.isDefAndNotNull(attrs["itemData"] || attrs["itemData"] === "")) {
                        console.warn("No data display in column");
                        attrs["itemData"] = "";
                    }

                    if (!goog.isDefAndNotNull(attrs["mode"] || attrs["mode"] === "")) {
                        console.warn("No mode selected (set to 'update' as default value)");
                        attrs["mode"] = "update";
                    }

                    if (!goog.isDefAndNotNull(attrs["object"])) {
                        console.error("No object define");
                        return;
                    } else if (attrs["object"] === "") {
                        console.error("objet name is empty");
                        return;
                    }

                    if (!goog.isDefAndNotNull(attrs["fieldToSelect"])) {
                        console.error("No fieldToSelect define");
                        return;
                    } else if (attrs["fieldToSelect"] === "") {
                        console.error("fieldToSelect name is empty");
                        return;
                    }
                    console.log(attrs);
                    scope["itemData"] = attrs["itemData"];
                    //scope["modeToSelect"] = attrs["modetoSelect"];

                    scope["goToItem"] = function () {
                        //var scope_ = scope;

                        angular.element("#object_column").scope()["selectObject"](attrs["object"], undefined, {});
                        $timeout(function () {
                            envSrvc["setSectionForm"](attrs["mode"], attrs["fieldToSelect"]);
                        }, 800);
                    };
                    // Attends la suppression du scope.
                    scope.$on("$destroy", function () {
                        // Supprime l'observateur.
                        clearObserver();
                    });
                });
            }
        };
    };
    vitisApp["compileProvider"].directive("appLinker", vitisApp.appLinkerDrtv);

    /**
     * Set the locked work esi
     * @expose
     * @param {string} sModule Module's name to organize work Objects
     * @param {string} sObjectName Object's name to call work Object
     */
    angular.element(vitisApp.appMainDrtv).scope()["setWorkObject"] = function (sModule, sObjectName) {

        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var $http = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$http"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var appWorkspaceListScope = angular.element(vitisApp.appWorkspaceListDrtv).scope();
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        var appMainScope = angular.element(vitisApp.appMainDrtv).scope();
        var config = angular.element(vitisApp.appMainDrtv).scope()["oWorkObjects"][sModule][sObjectName]["config"];
        // Vérifie si le module signaletique est utilisable pour l'utilisateur

        if (!(sessionStorage["application_modules"].split(',').indexOf(sModule) !== -1))
            return 0;
        $log.info("setWorkObject for module : " + sModule + " on Object " + sObjectName);
        var aSelectedRows = appWorkspaceListScope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["selection"]["getSelectedRows"]();
        if (!goog.isArray(aSelectedRows)) {
            console.error('aSelectedRows is not an array');
            return 0;
        }

        if (aSelectedRows.length !== 1) {
            bootbox.alert('<h4>Veuillez sélectionner un(e) unique ' + sObjectName + '</h4>');
            return 0;
        }

        var oParams = {
            'token': sessionStorage['session_token'],
            'user_id': sessionStorage['user_id']
        };
        oParams[config["sFieldId"]] = aSelectedRows[0][config["sFieldId"]];
        $http({
            method: 'POST',
            url: propertiesSrvc["web_server_name"] + '/' + propertiesSrvc["services_alias"] + '/' + config["sWebService"],
            params: oParams
        }).then(function (response) {

            if (!goog.isDef(response['data'])) {
                bootbox.alert('<h4>Erreur lors de la définition du ' + sObjectName + ' de travail</h4>');
                console.error("response: ", response);
            }
            if (goog.isDef(response['data']['errorMessage'])) {
                bootbox.alert('<h4>Erreur lors de la définition du ' + sObjectName + ' de travail</h4>' + '<br>' + response['data']['errorType'] + '<br>' + response['data']['errorMessage']);
                console.error("response: ", response);
            }

// Recharge la liste
            angular.element(vitisApp.appWorkspaceListDrtv).scope()['refreshGrid'](appWorkspaceListScope, envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]);
            angular.element("#" + config["sIdButtonLock"]).prop("disabled", true);
            angular.element("#" + config["sIdButtonUnlock"]).prop("disabled", false);
            angular.element(vitisApp.appMainDrtv).scope()["oWorkObjects"][sModule][sObjectName]["value"] = aSelectedRows[0][config["sFieldId"]];
            /*appMainScope.$evalAsync(function () {
             appMainScope.updateWorkObject();
             });*/

        }, function (response) {
            bootbox.alert('<h4>Erreur lors de la définition du ' + sObjectName + ' de travail:</h4><br>' + response);
            console.error("response: ", response);
        });
    };
    /**
     * appPostsEsi directive.
     * Mise en forme de la colonne "itinéraire" dans la liste de l'onglet "users_user" (Utilisateurs).
     * @param {service} $translate Translate service.
     * @expose
     * @ngInject
     **/
    vitisApp.appTextPopoverDisplayDrtv = function ($translate) {
        return {
            link: function (scope, element, attrs) {
// 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("text", function () {
                    if (goog.isDef(attrs["text"]) && attrs["text"] !== "") {
                        element[0].className = "ui-grid-cell-contents info-icon";
                        $(element)["popover"]({
                            "trigger": "hover",
                            "container": "body",
                            "title": attrs["title"],
                            "content": function () {
                                var sContent = "";
                                sContent = attrs["text"];
                                return sContent;
                            },
                            "html": (attrs["mode"] === 'html'),
                            // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                            "placement": function (oPopoverNode, oElementNode) {
                                return scope.$root["workspaceTooltipPlacement"](oElementNode);
                            }
                        });
                    } else {
                        element[0].className = "";
                    }
                    scope.$on("$destroy", function () {
                        // Supprime le tooltip.
                        $(element)["popover"]("destroy");
                        // Supprime l'observateur.
                        clearObserver();
                    });
                });
            }
        };
    };
    vitisApp["compileProvider"].directive("appTextPopoverDisplay", vitisApp.appTextPopoverDisplayDrtv);

    /**
     * Clear the locked work Object
     * @param {string} sModule Module's name to organize work Objects
     * @param {string} sObjectName Object's name to call work Object
     * @expose
     */
    angular.element(vitisApp.appMainDrtv).scope()["clearWorkObject"] = function (sModule, sObjectName) {

        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var $http = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$http"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var appWorkspaceListScope = angular.element(vitisApp.appWorkspaceListDrtv).scope();
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        var appMainScope = angular.element(vitisApp.appMainDrtv).scope();
        var config = angular.element(vitisApp.appMainDrtv).scope()["oWorkObjects"][sModule][sObjectName]["config"];
        // Vérifie si le module pdesi est utilisable pour l'utilisateur
        if (!(sessionStorage["application_modules"].split(',').indexOf(sModule) !== -1))
            return 0;
        $log.info("clearWorkPost for module : " + sModule + " on Object " + sObjectName);
        $http({
            method: 'DELETE',
            url: propertiesSrvc["web_server_name"] + '/' + propertiesSrvc["services_alias"] + '/' + config["sWebService"] + '/' + sessionStorage['user_id'],
            params: {
                'token': sessionStorage['session_token']
            }
        }).then(function (response) {

            if (!goog.isDef(response['data'])) {
                bootbox.alert('<h4>Erreur lors de la libération du ' + sObjectName + ' de travail</h4>');
                console.error("response: ", response);
            }
            if (goog.isDef(response['data']['errorMessage'])) {
                bootbox.alert('<h4>Erreur lors de la libération du ' + sObjectName + ' de travail</h4>' + '<br>' + response['data']['errorType'] + '<br>' + response['data']['errorMessage']);
                console.error("response: ", response);
            }

// Recharge la liste
            angular.element(vitisApp.appWorkspaceListDrtv).scope()['refreshGrid'](appWorkspaceListScope, envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]);
            angular.element("#" + config["sIdButtonLock"]).prop("disabled", false);
            angular.element("#" + config["sIdButtonUnlock"]).prop("disabled", true);
            angular.element(vitisApp.appMainDrtv).scope()["oWorkObjects"][sModule][sObjectName]["value"] = false;
            // Update le workObject et affiche ou pas les boutons ajouter et supprimer de la liste ESI
            /*appMainScope.$evalAsync(function () {
             appMainScope.updateWorkObject();
             });*/

        }, function (response) {
            bootbox.alert('<h4>Erreur lors de la libération du ' + sObjectName + ' de travail:</h4><br>' + response);
            console.error("response: ", response);
        });
    };
    /**
     * initialize a work Object
     * @param {string} sModule Module's name to organize work Objects
     * @param {string} sObjectName Object's name to call work Object
     * @param {object} oParams Parameters needed to use function set clear and look
     * @expose
     */
    angular.element(vitisApp.appMainDrtv).scope()["initWorkObject"] = function (sModule, sObjectName, oParams) {
        if (!goog.isDefAndNotNull(angular.element(vitisApp.appMainDrtv).scope()["oWorkObjects"]))
            angular.element(vitisApp.appMainDrtv).scope()["oWorkObjects"] = {};
        angular.element(vitisApp.appMainDrtv).scope()["oWorkObjects"][sModule] = {};
        angular.element(vitisApp.appMainDrtv).scope()["oWorkObjects"][sModule][sObjectName] = {};
        angular.element(vitisApp.appMainDrtv).scope()["oWorkObjects"][sModule][sObjectName]["value"] = false;
        angular.element(vitisApp.appMainDrtv).scope()["oWorkObjects"][sModule][sObjectName]["config"] = oParams;
    };
    /**
     * return value of a work Object
     * @param {string} sModule Module's name to organize work Objects
     * @param {string} sObjectName Object's name to call work Object
     * @return {integer / boolean} false if workObject is empty or id of workObject Selected
     * @expose
     */
    angular.element(vitisApp.appMainDrtv).scope()["getWorkObject"] = function (sModule, sObjectName) {
        return angular.element(vitisApp.appMainDrtv).scope()["oWorkObjects"][sModule][sObjectName]["value"];
    };
    /**
     * test if a work Object is already exist for a defined Object
     * @param {string} sModule Module's name to organize work Objects
     * @param {string} sObjectName Object's name to call work Object
     * @expose
     */
    angular.element(vitisApp.appMainDrtv).scope()["lookWorkObjectIsAlreadyLock"] = function (sModule, sObjectName) {
        var $http = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$http"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var config = angular.element(vitisApp.appMainDrtv).scope()["oWorkObjects"][sModule][sObjectName]["config"];
        $http({
            method: 'GET',
            url: propertiesSrvc["web_server_name"] + '/' + propertiesSrvc["services_alias"] + '/' + config["sWebService"],
            params: {
                'token': sessionStorage['session_token'],
                'filter': "user_id=" + sessionStorage['user_id'],
                'distinct': true
            }
        }).then(function (response) {

            if (!goog.isDef(response['data'])) {
                bootbox.alert('<h4>Erreur lors de la définition du ' + sObjectName + '</h4>');
                console.error("response: ", response);
            }
            if (goog.isDef(response['data']['errorMessage'])) {
                bootbox.alert('<h4>Erreur lors de la définition du ' + sObjectName + '</h4>' + '<br>' + response['data']['errorType'] + '<br>' + response['data']['errorMessage']);
                console.error("response: ", response);
            }

            if (response["data"]["list_count"] === 1) {
                angular.element(vitisApp.appMainDrtv).scope()["oWorkObjects"][sModule][sObjectName]["value"] = response["data"]["data"][0][config["sFieldId"]];
                angular.element("#" + config["sIdButtonLock"]).prop("disabled", true);
                angular.element("#" + config["sIdButtonUnlock"]).prop("disabled", false);
            } else {
                angular.element("#" + config["sIdButtonLock"]).prop("disabled", false);
                angular.element("#" + config["sIdButtonUnlock"]).prop("disabled", true);
            }

        }, function (response) {
            bootbox.alert('<h4>Erreur lors de la récupération du ' + sObjectName + ':</h4><br>' + response);
            console.error("response: ", response);
        });
    };
    /**
     * loadHelp function.
     * Chargement des sections du mode "help".
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().loadHelp = function () {
// Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
        $log.info("loadHelp");
        // Passage en mode "Update" (pour afficher les sections).
        envSrvc["sMode"] = "update";
    };


    angular.element(vitisApp.appMainDrtv).scope().getProj = function () {

        var $http = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$http"]);

        var appMainScope = angular.element(vitisApp.appMainDrtv).scope();
        // Get fichier de langue
        $http.get('modules/vitis/data/proj.json')
                .success(function (data) {
                    // Utilisé par les autres cpmposants
                    appMainScope['proj'] = data;
                })
                .error(function (data, status) {
                    console['error']('ERROR : (AJAX request : ' + status + ' ) On loading Projections, contact Veremes please');
                });
    };
    angular.element(vitisApp.appMainDrtv).scope().getProj();

    /**
     * deleteUsers function.
     * Suppression des utilisateurs sélectionnés (sauf l'utilisateur connecté).
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().deleteUsers = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var userSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["userSrvc"]);
        //
        $log.info("deleteUsers");
        // Désélectionne l'utilisateur connecté.
        var scope = angular.element(vitisApp.appWorkspaceListDrtv).scope();
        var aSelectedRows = scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["selection"]["getSelectedRows"]();
        aSelectedRows.forEach(function (oRow) {
            if (oRow["user_id"] == userSrvc["id"])
                scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["selection"]["unSelectRow"](oRow);
        });
        // Supprime les utilisateurs
        scope.$root["DeleteSelection"]();
    };

    /**
     * hideCurrentUserFromExcludedPrivileges function.
     * Cache l'utilisateur connecté de la liste "Utilisateurs liés au groupe" (Utilisateurs > Privilèges).
     * @param {string} sFormElementName Nom du champ de formulaire.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().hideCurrentUserFromExcludedPrivileges = function (sFormElementName) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $timeout = angular.element(vitisApp.appMainDrtv).injector().get(["$timeout"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var userSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["userSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        //
        $log.info("hideCurrentUserFromExcludedPrivileges");
        // 
        // Privilèges à exclure.
        var aUserPrivileges = ["vitis_admin", "vitis_user"];
        if (aUserPrivileges.indexOf(envSrvc["sId"]) != -1) {
            // Attends un cycle de "$digest".
            $timeout(function () {
                // Id et nom des 2 <select>.
                var oFormElementDefinition = formSrvc["getFormElementDefinition"](sFormElementName, envSrvc["sFormDefinitionName"]);
                var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
                var aSelectId = [oFormElementDefinition["id"], oFormElementDefinition["id_from"]];
                var aSelectName = [sFormElementName, oFormElementDefinition["name_from"]];
                // Cache les privilèges exclus dans les 2 <select>.
                var i, oSelect;
                var j = 0;
                while (j < aSelectId.length) {
                    i = 0;
                    oSelect = document.getElementById(aSelectId[j]);
                    while (oSelect.options.length > i) {
                        oSelect.options[i].style.display = "";
                        if (userSrvc["id"] == oSelect.options[i].value) {
                            oSelect.options[i].style.display = "none";
                            oFormValues[aSelectName[j]]["options"][i]["disabled"] = true;
                        }
                        i++;
                    }
                    j++;
                }
            });
        }
    };
});
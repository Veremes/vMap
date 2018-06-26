'use strict';

// Google closure
goog.provide("vitis.controllers.login");
goog.require("vitis.modules.main");

/**
 * login Controller.
 * Définition et gestion du formulaire de connexion.
 * @param {angular.$scope} $scope Angular scope.
 * @param {$translateProvider.$translate} $translate TranslateProvider translate service.
 * @param {angular.$http} $http Angular ajax provider
 * @param {angular.$rootScope} $rootScope Angular rootScope.
 * @param {service} $q Angular q service.
 * @param {service} sessionSrvc Service de gestion des sessions.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} userSrvc Paramètres de l'utilisateur.
 * @param {angular.$templateRequest} $templateRequest 
 * @param {angular.$compile} $compile
 * @param {service} formSrvc Service de gestion des formulaires.
 * @ngInject
 **/
vitisApp.loginCtrl = function ($scope, $translate, $rootScope, $q, sessionSrvc, externFunctionSrvc, envSrvc, propertiesSrvc, userSrvc, $templateRequest, $compile, formSrvc) {
    /**
 * showErrorAlert function.
 * Affiche un message d'erreur.
 * @param {string} sMessage Message d'erreur.
 **/
    $scope["showErrorAlert"] = function (sMessage) {
        $translate([sMessage]).then(function (translations) {
            $scope["sLoginErrorMessage"] = translations[sMessage];
            document.getElementById("login_error_alert").style.display = "block";
        });

    };

    /**
     * hideErrorAlert function.
     * Cache le message d'erreur.
     **/
    $scope["hideErrorAlert"] = function () {
        document.getElementById("login_error_alert").style.display = "none";
    };

    //
    $rootScope["oFormDefinition"] = {};
    $rootScope["oFormValues"] = {};

    envSrvc["oSelectedObject"] = {
        "name": "login",
        "sections": []
    };

    less.refresh();

    // Si l'application n'est pas stable : message d'erreur.
    if (propertiesSrvc["status"] == "unstable")
        $scope["showErrorAlert"]("FORM_APP_STATUS_ERROR");
    if (propertiesSrvc["VM_STATUS"] == "UNSTABLE")
        $scope["showErrorAlert"]("FORM_VAS_STATUS_ERROR");

    // Paramètres pour la requête ajax du subform.
    $scope["oFormRequestParams"] = {
        "sUrl": envSrvc["sLoginForm"]
    };

    // Affichage du champ de form. "Domaine".
    var clearListener = $rootScope.$on('formDefinitionLoaded', function (event, sFormDefinitionName) {
        // Supprime le "listener".
        clearListener();
        var oDomain = formSrvc["getFormElementDefinition"]('domain', 'login_form');
        if (typeof (propertiesSrvc['domain']) != 'undefined') {
            if (Object.keys(propertiesSrvc['domain']).length > 1 || Object.keys(propertiesSrvc['domain'])[0] != '')
                oDomain['visible'] = true;
        }
    });

    // Options du <select> 'Domaine'.
    var clearListener2 = $rootScope.$on('endFormNgRepeat', function (event, sFormDefinitionName) {
        // Supprime le "listener".
        clearListener2();
        //
        var oDomain = formSrvc["getFormElementDefinition"]('domain', 'login_form');
        if (oDomain['visible']) {
            var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
            var aKeys = Object.keys(propertiesSrvc['domain']);
            var aOptions = [{"label": aKeys[i], "value": ""}];
                var i = 0;
                while (i < aKeys.length) {
                    // Ajoute les options non vides.
                    if (aKeys[i] != '' && propertiesSrvc['domain'][aKeys[i]])
                        aOptions.push({'label': aKeys[i], 'value': propertiesSrvc['domain'][aKeys[i]]});
                    i++;
                }
            oFormValues["domain"] = {
                "options": aOptions,
                "selectedOption": {"label": aKeys[i], "value": ""}
            };
                }
    });

    /*
     $scope["fpwd_enabled"] = true;
     if (goog.isDefAndNotNull(propertiesSrvc["password_forgotten"])) {
     if (propertiesSrvc["password_forgotten"] !== "enabled") {
     $scope["fpwd_enabled"] = false;
     }
     }
     
     $scope["sign_up_enabled"] = false;
     if (goog.isDefAndNotNull(propertiesSrvc["sign_up"])) {
     if (propertiesSrvc["sign_up"] === "enabled") {
     $scope["sign_up_enabled"] = true;
     }
     }
     */
    $('#modal_forgotten_password').on('hidden.bs.modal', function () {
        $scope["sFormDefinitionName"] = "login_form";
        var sUrl = envSrvc["sLoginForm"];
        // Paramètres pour la requête ajax du subform.
        $scope["oFormRequestParams"] = {
            "sUrl": sUrl
        };
        $scope.$digest();
    });

    $('#modal_sign_up').on('hidden.bs.modal', function () {
        $scope["sFormDefinitionName"] = "login_form";
        var sUrl = envSrvc["sLoginForm"];
        // Paramètres pour la requête ajax du subform.
        $scope["oFormRequestParams"] = {
            "sUrl": sUrl
        };
        $scope.$digest();
    });

    $scope["showModalForgottenPassword"] = function () {
        $("#modal_forgotten_password").modal('show');
        // Nom + url du formulaire.
        $scope["sFormDefinitionName"] = envSrvc["oSelectedObject"]["name"] + "_forgotten_password_form";

        // Paramètres pour la requête ajax du subform.
        $scope["oFormRequestParams"] = {
            "sUrl": envSrvc["sForgottenPasswordForm"]
        };
        // Suppression de la définition et des données du formulaire (sinon problème de cache...).

        $scope.$root["clearFormData"]($scope["sFormDefinitionName"], $scope);
        // Pas de données de form. à charger.
        $scope["bLoadFormValues"] = false;
        envSrvc["oFormValues"][$scope["sFormDefinitionName"]] = {};

        // Compile le template de formulaire.
        var sTemplateUrl = 'templates/formTpl.html';
        $templateRequest(sTemplateUrl).then(function (sTemplate) {
            $compile($("#modal_forgotten_password_form_container").html(sTemplate).contents())($scope);
        });
    };

    $scope["showModalSignUp"] = function () {
        $("#modal_sign_up").modal('show');
        // Nom + url du formulaire.
        $scope["sFormDefinitionName"] = envSrvc["oSelectedObject"]["name"] + "_sign_up_form";

        // Paramètres pour la requête ajax du subform.
        $scope["oFormRequestParams"] = {
            "sUrl": envSrvc["sSignUpForm"]
        };
        // Suppression de la définition et des données du formulaire (sinon problème de cache...).

        $scope.$root["clearFormData"]($scope["sFormDefinitionName"], $scope);
        // Pas de données de form. à charger.
        $scope["bLoadFormValues"] = false;
        envSrvc["oFormValues"][$scope["sFormDefinitionName"]] = {};

        // Compile le template de formulaire.
        var sTemplateUrl = 'templates/formTpl.html';
        $templateRequest(sTemplateUrl).then(function (sTemplate) {
            $compile($("#modal_sign_up_form_container").html(sTemplate).contents())($scope);
            // Affichage des conditions générales d'utilisation.
            if (propertiesSrvc["sign_up_cgu"] === true) {
                var clearListenerformDefinitionLoaded = $scope.$root.$on("formDefinitionLoaded", function (event, sFormDefinitionName) {
                    clearListenerformDefinitionLoaded();
                    var oCguElementDef = formSrvc["getFormElementDefinition"]("signupcgu", sFormDefinitionName);
                    oCguElementDef["visible"] = true;
                });
                // Url des CGU.
                var clearListenerformExtracted = $scope.$root.$on("formExtracted", function (event, sFormDefinitionName) {
                    clearListenerformExtracted();
                        var oCguElementDef = formSrvc["getFormElementDefinition"]("signupcgu", sFormDefinitionName);
                        $translate(["ACCEPT_CGU"], propertiesSrvc).then(function (translations) {
                            oCguElementDef["label"] = translations["ACCEPT_CGU"];
                            angular.element("#" + oCguElementDef["id"]).scope().$broadcast('$$rebind::refresh');
                            angular.element("#" + oCguElementDef["id"]).scope().$applyAsync();
                        });
                });
            }
        });

        /*var test = grecaptcha.render("captcha", {
         'sitekey': "6LdWLR8UAAAAAExA8zTXKFIsIwhacAJw1tdpuFw1"
         });
         
         console.log(test);*/
    };

    /**
     * sendInscriptionRequest function.
     * Action à effectuer dès l'envoi du formulaire d'inscription.
     **/
    $scope["sendInscriptionRequest"] = function () {
        var sFormName = $scope["sFormDefinitionName"];
        //check value
        if (!goog.isDefAndNotNull($scope["oFormValues"][sFormName]["captcha"])) {
            var sTitle = "NOCAPTCHA";
            $translate(sTitle).then(function (sTranslation) {
                $.notify(sTranslation, "error");
            });
            return;
        }
        if (propertiesSrvc["sign_up_cgu"] === true) {
            if (!goog.isDefAndNotNull($scope["oFormValues"][sFormName]["signupcgu"])) {
                var sTitle = "CHECKCGU";
                $translate(sTitle).then(function (sTranslation) {
                    $.notify(sTranslation, "error");
                });
                return;
            } else if ($scope["oFormValues"][sFormName]["signupcgu"] === false) {
                var sTitle = "CHECKCGU";
                $translate(sTitle).then(function (sTranslation) {
                    $.notify(sTranslation, "error");
                });
                return;
            }
        }
        if (!goog.isDefAndNotNull($scope["oFormValues"][sFormName]["signuppasswordconfirmation"])) {
            var sTitle = "CONFIRMPASSWORD";
            $translate(sTitle).then(function (sTranslation) {
                $.notify(sTranslation, "error");
            });
            return;
        } else if ($scope["oFormValues"][sFormName]["signuppasswordconfirmation"] !== $scope["oFormValues"][sFormName]["password"]) {
            var sTitle = "CONFIRMPASSWORD";
            $translate(sTitle).then(function (sTranslation) {
                $.notify(sTranslation, "error");
            });
            return;
        }
        showAjaxLoader();
        ajaxRequest({
            'method': 'POST',
            'url': propertiesSrvc["web_server_name"] + '/' + propertiesSrvc["services_alias"] + "/vitis/accounts/sign_up",
            "params": formSrvc["getFormData"](sFormName, true),
            'success': function (response) {
                hideAjaxLoader();
                if (response["status"] === 403) {
                    var sTitle = "ACCOUNTSERVICENOTAVAILABLE";
                    $translate(sTitle).then(function (sTranslation) {
                        $.notify(sTranslation, "error");
                    });
                } else {
                    if (goog.isDefAndNotNull(response["data"]["status"])) {
                        if (response["data"]["status"] === 5) {
                            var sTitle = "LOGINNOTAVAILABLE";
                            $translate(sTitle).then(function (sTranslation) {
                                $.notify(sTranslation, "error");
                            });
                            grecaptcha.reset();
                            $scope["oFormValues"][sFormName]["captcha"] = null;
                        } else {
                            $("#modal_sign_up").modal('hide');
                            var sTitle = "CHECKMAIL";
                            $translate(sTitle).then(function (sTranslation) {
                                $.notify(sTranslation, "success");
                            });
                        }
                    } else if (response["data"] === "") {
                        var sTitle = "LOGINNOTAVAILABLE";
                        $translate(sTitle).then(function (sTranslation) {
                            $.notify(sTranslation, "error");
                        });
                        grecaptcha.reset();
                        $scope["oFormValues"][sFormName]["captcha"] = null;
                    } else {
                        $("#modal_sign_up").modal('hide');
                        var sTitle = "CHECKMAIL";
                        $translate(sTitle).then(function (sTranslation) {
                            $.notify(sTranslation, "success");
                        });
                    }

                }
            },
            'error': function (response) {
                hideAjaxLoader();
                console.error("ERROR");
            }
        });
    };

    /**
     * sendInscriptionRequest function.
     * Action à effectuer dès l'envoi du formulaire d'inscription.
     **/
    $scope["sendFpwdRequest"] = function () {
        var sFormName = $scope["sFormDefinitionName"];
        showAjaxLoader();
        ajaxRequest({
            'method': 'POST',
            'url': propertiesSrvc["web_server_name"] + '/' + propertiesSrvc["services_alias"] + "/vitis/accounts/fpwd",
            'params': {
                "username": $scope["oFormValues"][sFormName]["fpwd_login"],
                "mail": $scope["oFormValues"][sFormName]["fpwdmail"],
                "company": $scope["oFormValues"][sFormName]["fpwdporganization"]
            },
            'success': function (response) {
                hideAjaxLoader();
                if (response["status"] === 403) {
                    var sTitle = "ACCOUNTSERVICENOTAVAILABLE";
                    $translate(sTitle).then(function (sTranslation) {
                        $.notify(sTranslation, "error");
                    });
                } else {
                    if (goog.isDefAndNotNull(response["data"]["status"])) {
                        if (response["data"]["status"] === 7) {
                            var sTitle = "LOGINNOTKNOWN";
                            $translate(sTitle).then(function (sTranslation) {
                                $.notify(sTranslation, "error");
                            });
                        } else {
                            $("#modal_forgotten_password").modal('hide');
                            var sTitle = "CHECKMAIL";
                            $translate(sTitle).then(function (sTranslation) {
                                $.notify(sTranslation, "success");
                            });
                        }
                    }
                }
            },
            'error': function (response) {
                hideAjaxLoader();
                console.error("ERROR");
            }
        });
    };

    /**
     * sendLoginForm function.
     * Action à effectuer dès l'envoi du formulaire de login.
     * @return {promise}
     **/
    $scope["sendLoginForm"] = function () {
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Pas de connexion si l'application n'est pas stable.
        if (propertiesSrvc["status"] == "unstable")
            deferred.reject();
        else {
            // Cache le message d'erreur.
            $scope["hideErrorAlert"]();
            // Envoi une demande de token privé.
            var sFormName = $scope["sFormDefinitionName"];
            // Suppression des accents du login.
            /*
             var aPatternAccent = new Array('à', 'â', 'ä', 'á', 'ã', 'å', 'î', 'ï', 'ì', 'í', 'ô', 'ö', 'ò', 'ó', 'õ', 'ø', 'ù', 'û', 'ü', 'ú', 'é', 'è', 'ê', 'ë', 'ç', 'ÿ', 'ñ');
             var aPatternReplaceAccent = new Array('a', 'a', 'a', 'a', 'a', 'a', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'e', 'e', 'e', 'e', 'c', 'y', 'n');
             var sUser = externFunctionSrvc["preg_replace"](aPatternAccent, aPatternReplaceAccent, $scope["oFormValues"][sFormName]["user_login"]);
             */
            var sUser = $scope["oFormValues"][sFormName]["user_login"];
            // Concatène le domaine au login ?
            var oDomainValue = $scope["oFormValues"][sFormName]["domain"];
            if (typeof (oDomainValue) != "undefined" && typeof (oDomainValue["selectedOption"]) != "undefined" && oDomainValue["selectedOption"]["value"] != "" && typeof (oDomainValue["selectedOption"]["value"]) != "undefined" && sUser.indexOf("@") == -1)
                sUser += "@" + oDomainValue["selectedOption"]["value"];
            // Demande de token pour l'utilisateur.
            ajaxRequest({
                "method": "POST",
                "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/" + sessionSrvc["web_service"] + "/" + sessionSrvc["web_service_controller"],
                "scope": $scope,
                "data": {
                    "user": sUser,
                    "password": $scope["oFormValues"][sFormName]["user_password"]
                },
                "success": function (response) {
                    if (response["data"]["status"] == 1) {
                        // Cache le message d'erreur.
                        $scope["hideErrorAlert"]();
                        // Sauve les données du token.
                        sessionSrvc["token"] = response["data"]["token"];
                        sessionSrvc["validity_date"] = response["data"]["validity_date"];
                        sessionStorage["session_token"] = sessionSrvc["token"];
                        // Sauve les données de l'utilisateur.
                        userSrvc["login"] = sUser;
                        userSrvc["id"] = parseInt(response["data"]["user_id"]);
                        userSrvc["privileges"] = response["data"]["privileges"];
                        sessionStorage["user_login"] = sUser;
                        sessionStorage["user_id"] = userSrvc["id"];
                        sessionStorage["privileges"] = userSrvc["privileges"];
                        // Chargement des properties stockées côté serveur.
                        propertiesSrvc["getFromServer"]().then(function () {
                            // Surcharge la propriété "app_name" par le nom de l'application passé dans l'url.
                            propertiesSrvc["app_name"] = sessionStorage["application"].toLowerCase().charAt(0).toUpperCase() + sessionStorage["application"].slice(1);
                            // Paramètre "environment".
                            if (typeof (sessionStorage['environment']) != "undefined")
                                propertiesSrvc["environment"] = sessionStorage['environment'];
                            // Connexion à l'application.
                            sessionSrvc["connect"]();
                            deferred.resolve();
                        });
                        // Sauve le token dans le localStorage (cookie).
                        if ($scope["oFormValues"][sFormName]["remember_me"] === true) {
                            sessionSrvc["saveSessionToLocalStorage"]();
                        }
                    } else {
                        // Message d'erreur spécifique suivant le code erreur retourné.
                        var sConnectionErrorMessage;
                        if (typeof (response["data"]["errorCode"]) == "undefined")
                            response["data"]["errorCode"] = "";
                        switch (response["data"]["errorCode"]) {
                            // Adresse IP non autorisée.
                            case 11:
                                sConnectionErrorMessage = "FORM_LOGIN_CONNECTION_ERROR_FORBIDDEN_IP";
                                var errorMessage = response["data"]["errorMessage"];
                                var ipAddress = errorMessage.substr(errorMessage.indexOf("'") + 1, errorMessage.lastIndexOf("'") - errorMessage.indexOf("'") - 1);
                                $translate([sConnectionErrorMessage]).then(function (translations) {
                                    sConnectionErrorMessage = translations[sConnectionErrorMessage];y
                                    $scope["showErrorAlert"](sConnectionErrorMessage.replace('[IPAddress]', ipAddress));
                        deferred.reject();
                                });

                                break;
                            default:
                                sConnectionErrorMessage = "FORM_LOGIN_CONNECTION_ERROR";
                                $scope["showErrorAlert"](sConnectionErrorMessage);
                                deferred.reject();
                    }
                }
                }
            });
        }

        // Retourne la promesse.
        return promise;
    }
};
vitisApp.module.controller("loginCtrl", vitisApp.loginCtrl);

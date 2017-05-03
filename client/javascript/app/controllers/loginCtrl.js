// Google closure
goog.provide("vitis.controllers.login");
goog.require("vitis.modules.main");

/**
 * login Controller.
 * Définition et gestion du formulaire de connexion.
 * @param {angular.$scope} $scope Angular scope.
 * @param {$translateProvider.$translate} $translate TranslateProvider translate service.
 * @param {angular.$rootScope} $rootScope Angular rootScope.
 * @param {service} $q Angular q service.
 * @param {service} Restangular Service Restangular.
 * @param {service} sessionSrvc Service de gestion des sessions.
 * @param {service} externFunctionSrvc Fonctions externes à Angular.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} userSrvc Paramètres de l'utilisateur.
 * @ngInject
 **/
vitisApp.loginCtrl = function ($scope, $translate, $rootScope, $q, Restangular, sessionSrvc, externFunctionSrvc, envSrvc, propertiesSrvc, userSrvc) {
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
    }

    /**
     * hideErrorAlert function.
     * Cache le message d'erreur.
     **/
    $scope["hideErrorAlert"] = function () {
        document.getElementById("login_error_alert").style.display = "none";
    }

    //
    $rootScope["oFormDefinition"] = {};
    $rootScope["oFormValues"] = {};

    envSrvc["oSelectedObject"] = {
        "name": "login",
        "sections": []
    };

    less.refresh();

    // document.getElementById("login_form_user_login").disabled = true
    // Sauve les properties du client.
    propertiesSrvc = _["extendOwn"](propertiesSrvc, oClientProperties);
    // Si l'application n'est pas stable : message d'erreur.
    if (propertiesSrvc["status"] == "unstable")
        $scope["showErrorAlert"]("FORM_APP_STATUS_ERROR");
    // Paramètrage de l'url de base pour Restangular.
    vitisApp["RestangularProvider"]["setBaseUrl"](propertiesSrvc["web_server_name"]);
    // Chargement des properties côté serveur.
    propertiesSrvc["getFromServer"]().then(function () {
        // Paramètrage de la langue
        if (propertiesSrvc["VM_STATUS"] == "UNSTABLE")
            $scope["showErrorAlert"]("FORM_VAS_STATUS_ERROR");
        $translate["use"](propertiesSrvc["language"]);
        bootbox["setLocale"](propertiesSrvc["language"]);
        // Surcharge la propriété "app_name" par le nom de l'application passé dans l'url.
        propertiesSrvc["app_name"] = sessionStorage["application"].toLowerCase().charAt(0).toUpperCase() + sessionStorage["application"].slice(1);
        // Nom de l'application
        $scope["translationData"] = {
            "app_name": propertiesSrvc["app_name"]
        };
        // Titre de la page
        document.title = propertiesSrvc["app_name"].toUpperCase();

        $scope.$evalAsync(function () {
            // theme de la page
            // less.modifyVars({'@application-color-theme': '@veremes-' + angular.lowercase(propertiesSrvc["app_name"]) + '-color'});
        });

        // Options du <select> "Domaine".
        if (goog.isDefAndNotNull(propertiesSrvc["domain"])) {
            if (typeof (envSrvc["oFormValues"]["login_form"]["domain"]) == "undefined")
                envSrvc["oFormValues"]["login_form"]["domain"] = {};
            var i = 0;
            var aOptions = [{"label": "", "value": ""}];
            var aKeys = Object.keys(propertiesSrvc["domain"]);
            while (i < aKeys.length) {
                // Ajoute les options non vides.
                if (aKeys[i] != "" && propertiesSrvc["domain"][aKeys[i]])
                    aOptions.push({"label": aKeys[i], "value": propertiesSrvc["domain"][aKeys[i]]});
                i++;
            }
            envSrvc["oFormValues"]["login_form"]["domain"]["options"] = aOptions;
            envSrvc["oFormValues"]["login_form"]["domain"]["selectedOption"] = aOptions[0];
        }
    });

    // Paramètres pour la requête ajax du subform.
    $scope["oFormRequestParams"] = {
        "sUrl": "forms/login.json"
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
            if ($scope["oFormValues"][sFormName]["domain"]["selectedOption"]["value"] != "" && $scope["oFormValues"][sFormName]["domain"]["selectedOption"]["value"] != undefined && sUser.indexOf("@") == -1)
                sUser += "@" + $scope["oFormValues"][sFormName]["domain"]["selectedOption"]["value"];
            // Paramètres du webservice.
            var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/" + sessionSrvc["web_service"], sessionSrvc["web_service_controller"]);
            var oElem = {"user": sUser, "password": $scope["oFormValues"][sFormName]["user_password"]};
            var sPath = "";
            var oParams = {"token": sessionSrvc["token"]};
            // Demande de token pour l'utilisateur.
            oWebServiceBase["customPOST"](JSON.stringify(oElem), sPath, oParams)
                    .then(function (data) {
                        if (data["status"] == 1) {
                            // Cache le message d'erreur.
                            $scope["hideErrorAlert"]();
                            // Sauve les données du token.
                            sessionSrvc["token"] = data["token"];
                            sessionSrvc["validity_date"] = data["validity_date"];
                            sessionStorage["session_token"] = sessionSrvc["token"];
                            // Sauve les données de l'utilisateur.
                            userSrvc["login"] = sUser;
                            userSrvc["id"] = parseInt(data["user_id"]);
                            userSrvc["privileges"] = data["privileges"];
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
                            $scope["showErrorAlert"]("FORM_LOGIN_CONNECTION_ERROR");
                            deferred.reject();
                        }
                    });
        }

        // Retourne la promesse.
        return promise;
    }


};
vitisApp.module.controller("loginCtrl", vitisApp.loginCtrl);

// Google closure
goog.provide("vitis.controllers.init");
goog.require("vitis.modules.main");

/**
 * Init Controller.
 * 
 * @param {angular.$scope} $scope Angular scope.
 * @param {angular.$log} $log Angular log service.
 * @param {service} $q Angular q service.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} sessionSrvc Service de gestion des sessions.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} userSrvc Paramètres de l'utilisateur.
 * @param {$translateProvider.$translate} $translate TranslateProvider translate service.
 * @param {service} Restangular Service Restangular.
 * @ngInject
 **/
vitisApp.initCtrl = function ($scope, $log, $q, envSrvc, sessionSrvc, propertiesSrvc, userSrvc, $translate, Restangular) {
        /**
         * getMainTemplateUrl function.
         * Change le template de l'élément principal de l'application.
         * @return {string}
         **/
        // Change le template de l'élément principal de l'application.
        $scope["getMainTemplateUrl"] = function() {
                return envSrvc["sMainTemplateUrl"];
        };
        
        /**
         * disconnect function.
         * Déconnexion de l'application.
         **/
        $scope["disconnect"] = function() {
                sessionSrvc["disconnect"]();
        };
        
        /**
         * clearFormData function.
         * Supprime toutes les données d'un formulaire (definition, valeurs).
         * @param {string} sFormDefinitionName Id d'un formulaire
         * @expose
         **/
        $scope.$root["clearFormData"] = function (sFormDefinitionName, scope) {
            $log.info("clearFormData");
            envSrvc["toGarbageCollection"](envSrvc["oFormDefinition"][sFormDefinitionName]);
            envSrvc["oFormDefinition"][sFormDefinitionName] = null;
            envSrvc["oFormDefinition"][sFormDefinitionName] = {};
            envSrvc["toGarbageCollection"](envSrvc["oFormValues"][sFormDefinitionName]);
            envSrvc["oFormValues"][sFormDefinitionName] = null;
            envSrvc["oFormValues"][sFormDefinitionName] = {};
            delete scope["oFormDefinition"];
            delete scope["oFormValues"];
            delete scope["oProperties"];
            delete scope["oFormEventsContainer"];
        };
        
        /**
         * connectFromUrl function.
         * Connexion à l'application avec les identifiants passés dans l'url.
         * @param {string} oConnexionId Identifiants de connexion
         * @expose
         **/
        $scope.$root["connectFromUrl"] = function (oConnexionId) {
            $log.info("connectFromUrl");
            // Paramètres du webservice.
            var oWebServiceBase = Restangular["one"](oClientProperties["services_alias"] + "/" + sessionSrvc["web_service"], sessionSrvc["web_service_controller"]);
            var oElem = {"user": oConnexionId["login"], "password": oConnexionId["password"], "duration": sessionSrvc["duration"]};
            var sPath = "";
            var oParams = {"token": sessionSrvc["token"]};
            // Demande de token pour l'utilisateur.
            oWebServiceBase["customPOST"](JSON.stringify(oElem), sPath, oParams)
                    .then(function (data) {
                        if (data["status"] == 1) {
                            // Cache le message d'erreur.
                            //$scope["hideErrorAlert"]();
                            // Sauve les données du token.
                            sessionSrvc["token"] = data["token"];
                            sessionSrvc["validity_date"] = data["validity_date"];
                            sessionStorage["session_token"] = sessionSrvc["token"];
                            // Sauve les données de l'utilisateur.
                            userSrvc["login"] = oConnexionId["login"];
                            userSrvc["id"] = parseInt(data["user_id"]);
                            sessionStorage["user_login"] = oConnexionId["login"];
                            sessionStorage["user_id"] = userSrvc["id"];
                            sessionSrvc["saveSessionToLocalStorage"]();
                            //
                            deferred.resolve();
                        } else
                            sessionSrvc["disconnect"]();
                    });
        };
        
        // Sauve le nom de l'application (pour les modes de l'utilisateur)
        //sessionStorage["application"] = document.location.pathname.split("/").pop();
        
        // Plugin "bootbox" : localisation et définition de la langue.
        $translate(['CONFIRM_OK', 'CONFIRM_CANCEL', 'CONFIRM_CONFIRM']).then(function (translations) {
            bootbox["addLocale"]("fr", {
                    "OK" : translations["CONFIRM_OK"],
                    "CANCEL" : translations["CONFIRM_CANCEL"],
                    "CONFIRM" : translations["CONFIRM_CONFIRM"]
            });
        });
        
        //
        var deferred = $q.defer();
        var promise = deferred.promise;
        
        // Connexion avec les identifiants passés dans l'url (si le cookie avec le token n'existe pas).
        var aUrlParamsKeys = Object.keys(oUrlParams);
        if (sessionSrvc["getAppLocalStorageItem"]("session_token") === null && aUrlParamsKeys.indexOf("login") !== -1 && aUrlParamsKeys.indexOf("password") !== -1)
            $scope.$root["connectFromUrl"](oUrlParams);
        else
            deferred.resolve();
        
        // Si le token est dans le session storage : connexion à l'application (si la date est toujours valide).
        promise.then(function () {
            var sLocalStorageSessionToken = sessionSrvc["getAppLocalStorageItem"]("session_token");
            if (sLocalStorageSessionToken !== null) {
                    // Sauve les properties du client.
                    propertiesSrvc = _["extendOwn"](propertiesSrvc, oClientProperties);
                    if (propertiesSrvc["status"] != "unstable") {
                            // Vérification de la validité du token côté serveur.
                            var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vitis/privatetoken");
                            oWebServiceBase["customGET"]("" , {"token": sLocalStorageSessionToken}).then(function (data) {
                                    if (data["status"] == 1) {
                                            // Sauve le token valide.
                                            sessionStorage["session_token"] = sLocalStorageSessionToken;
                                            // Paramètrage de l'url de base pour Restangular.
                                            vitisApp["RestangularProvider"]["setBaseUrl"](propertiesSrvc["web_server_name"]);
                                            // Charge les properties stockées côté serveur.
                                            propertiesSrvc["getFromServer"]().then(function() {
                                                    // Paramètrage de la langue.
                                                    $translate["use"](propertiesSrvc["language"]);
                                                    bootbox["setLocale"](propertiesSrvc["language"]);
                                                    // Restauration des données de session sauvées dans le local storage.
                                                    sessionSrvc["restoreSessionFromAppLocalStorage"]();
                                                    // Récupération des données (token, utilisateur) sauvé dans la session.
                                                    sessionSrvc["token"] = sLocalStorageSessionToken;
                                                    userSrvc["login"] = sessionStorage["user_login"];
                                                    userSrvc["id"] = parseInt(sessionStorage["user_id"]);
                                                    // Surcharge la propriété "app_name" par le nom de l'application passé dans l'url.
                                                    propertiesSrvc["app_name"] = sessionStorage["application"].toLowerCase().charAt(0).toUpperCase() + sessionStorage["application"].slice(1);
                                                    // Titre de la page
                                                    document.title = propertiesSrvc["app_name"].toUpperCase();
                                                    // Paramètre "environment".
                                                    if (typeof(sessionStorage['environment']) != "undefined")
                                                        propertiesSrvc["environment"] = sessionStorage['environment'];
                                                    // Connexion à l'application.
                                                    sessionSrvc["connect"]();
                                            });
                                    }
                                    else
                                            sessionSrvc["disconnect"]();
                            });
                    }
                    else
                            sessionSrvc["disconnect"]();
            }
            else {
                    // Supprime les données de la session.
                    sessionSrvc["clearSessionStorage"]();
                    // Affichage de la page de login.
                    envSrvc["sMainTemplateUrl"] = "templates/loginTpl.html";
                    envSrvc["sFormDefinitionName"] = "login_form";
            }
        });
};
vitisApp.module.controller("initCtrl", vitisApp.initCtrl);
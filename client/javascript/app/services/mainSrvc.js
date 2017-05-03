/* global goog, vitisApp */

// Google closure
goog.provide('vitis.services.main');
goog.require('vitis');

/**
 * sessionSrvc service.
 * Gestion des sessions.
 * @param {angular.$http} $http Angular http service.
 * @param {angular.$window} $window Angular window service.
 * @param {service} envSrvc Paramètres d'environnement.
 * @constructor
 * @ngInject
 **/
vitisApp.sessionSrvc = function ($http, $window, envSrvc) {
    return {
        "token": "",
        "validity_date": "",
        "duration": 600, // en minutes.
        "web_service": "vitis",
        "web_service_controller": "privatetoken",
        "application_modules": [],
        /**
         * connect function.
         * Connexion à l'application.
         **/
        "connect": function () {
            // Passe le token dans toutes les requêtes de l'application.
            $http.defaults.headers["common"]['Session-token'] = this["token"];
            // Charge le template principal (menus + 1er onglet).
            envSrvc["sMainTemplateUrl"] = "templates/mainTpl.html";
        },
        /**
         * disconnect function.
         * Déconnexion de l'application.
         **/
        "disconnect": function () {
            // Supprime le cookie (session php).
            document.cookie.split(";").forEach(function (sCookie) {
                aCookie = sCookie.split("=");
                if (aCookie[1] == sessionStorage.getItem("session_token"))
                    document.cookie = aCookie[0] + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            });
            // Supprime les données de la session.
            this["clearSessionStorage"]();
            // Supprime le login et le mot de passe dans l'url. 
            var aUrlParamsKeys = Object.keys(oUrlParams);
            if (aUrlParamsKeys.indexOf("login") !== -1 && aUrlParamsKeys.indexOf("password") !== -1) {
                delete oUrlParams["login"];
                delete oUrlParams["password"];
                aUrlParamsKeys = Object.keys(oUrlParams);
                var aUrlParams = [], sUrlParam;
                aUrlParamsKeys.forEach(function (sUrlParamKey) {
                    sUrlParam = sUrlParamKey;
                    if (typeof (oUrlParams[sUrlParamKey]) != "undefined")
                        sUrlParam += oUrlParams[sUrlParamKey];
                    aUrlParams.push(sUrlParam);
                });
                $window.location.search = "?" + aUrlParams.join("&");
            } else
                $window.location.reload();
        },
        /**
         * clearSessionStorage function.
         * Supprime les données de la session.
         * @constructor
         **/
        "clearSessionStorage": function () {
            var aSessionKeys = ["session_token", "user_login", "user_id", "stats_per_date"]; // , "session_validity_date", "remember_me"
            var i = 0;
            while (i < aSessionKeys.length) {
                sessionStorage.removeItem(aSessionKeys[i]);
                this["removeAppLocalStorageItem"](aSessionKeys[i]);
                i++;
            }
        },
        /**
         * saveSessionToLocalStorage function.
         * Sauve les données de la session dans le local storage (cookie).
         * @constructor
         **/
        "saveSessionToLocalStorage": function () {
            var aSessionKeys = ["session_token", "user_login", "user_id"]; // , "session_validity_date"
            var i = 0;
            while (i < aSessionKeys.length) {
                this["setAppLocalStorageItem"](aSessionKeys[i], sessionStorage[aSessionKeys[i]]);
                i++;
            }
        },
        /**
         * restoreSessionFromAppLocalStorage function.
         * Restaure les paramètres de la session sauvés dans le local storage (cookie).
         * @constructor
         **/
        "restoreSessionFromAppLocalStorage": function () {
            var aSessionKeys = ["session_token", "user_login", "user_id"]; // , "session_validity_date"
            var i = 0;
            while (i < aSessionKeys.length) {
                sessionStorage[aSessionKeys[i]] = this["getAppLocalStorageItem"](aSessionKeys[i]);
                i++;
            }
        },
        /**
         * getAppLocalStorageItem function.
         * Retourne la valeur d'un paramètre contenu dans le local storage (cookie) de l'application.
         * @param {string} skeyName Index de la valeur à retourner.
         **/
        "getAppLocalStorageItem": function (skeyName) {
            return localStorage.getItem(sessionStorage["appEnv"] + "_" + skeyName);
        },
        /**
         * setAppLocalStorageItem function.
         * Définition de la valeur d'un paramètre contenu dans le local storage (cookie) de l'application.
         * @param {string} skeyName Index de la valeur à modifier.
         * @param {string} sValue Nouvelle valeur.
         **/
        "setAppLocalStorageItem": function (skeyName, sValue) {
            localStorage.setItem(sessionStorage["appEnv"] + "_" + skeyName, sValue);
        },
        /**
         * removeAppLocalStorageItem function.
         * Supprime un paramètre contenu dans le local storage (cookie) de l'application.
         * @param {string} skeyName Index de la valeur à modifier.
         **/
        "removeAppLocalStorageItem": function (skeyName) {
            localStorage.removeItem(sessionStorage["appEnv"] + "_" + skeyName);
        }
    };
};

/**
 * envSrvc service.
 * Paramètres d'environnement.
 * @param {angular.$rootScope} $rootScope Angular rootScope.
 * @param {service} $injector Angular injector service.
 * @param {service} Restangular Service Restangular.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @constructor
 * @ngInject
 **/
vitisApp.envSrvc = function ($rootScope, $injector, Restangular, propertiesSrvc) {
    return {
        "sMode": "search",
        "oSelectedMode": "",
        "oSelectedObject": "",
        "oSectionForm": {},
        "sSelectedTemplate": "",
        "sMainTemplateUrl": "",
        "sId": "",
        "sIdField": "",
        "sLastSelectedMode": "",
        "oLastSelectedObjectMode": {},
        "oFormDefinition": {},
        "sFormDefinitionName": "",
        "oFormValues": {},
        "oFormDefaultValues": {},
        "oGridOptions": {},
        "oGridOptionsCopy": {},
        "oDefaultGridOptions": {},
        "sTemplateFolder": "templates/",
        "oWorkspaceList": {},
        "oWorkspaceListRefreshTimer": {},
        /**
         * setMode function.
         * Change le mode d'action (update, display, search).
         * @param {string} sMode nom du mode d'action.
         * @param {string} sUrlTemplate Ulr du template.
         **/
        "setMode": function (sMode, sUrlTemplate) {
            var formSrvc = $injector.get(["formSrvc"]);
            var envSrvc = this;
            // Vérifie si un formulaire a été modifié.
            var promise = formSrvc["checkFormModifications"](this["sFormDefinitionName"]);
            promise.then(function () {
                envSrvc["sMode"] = sMode;
                if (sMode == "insert")
                    envSrvc["sId"] = "";
                else if (sMode == "search") {
                    // Remise à zéro de l'index sélectionné.
                    if (typeof (envSrvc["oSectionForm"]) != "undefined") {
                        var oSectionForm = envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]];
                        if (typeof (oSectionForm) != "undefined")
                            oSectionForm["iSelectedSectionIndex"] = 0;
                    }
                }
                //envSrvc["loadObjectTemplate"](true);
                envSrvc["loadObjectTemplate"]({"bForceTemplateCompilation": true, "sUrlTemplate": sUrlTemplate});
            });
            return promise;
        },
        /**
         * loadObjectTemplate function.
         * Charge le template de l'onglet sélectionné.
         * @param {object} oOptions Paramètres optionnels : 
         *      - bForceTemplateCompilation Force la compilation du template.
         *      - sUrlTemplate Url du template.
         **/
        "loadObjectTemplate": function (oOptions) {
            var bCompileTemplate = true;
            if (!this["oSelectedMode"]["reload"] && typeof (this["oLastSelectedObjectMode"][this["oSelectedMode"]["mode_id"]]) != "undefined")
                bCompileTemplate = false;
            // Sauve le dernier objet du mode.
            this["oLastSelectedObjectMode"][this["oSelectedMode"]["mode_id"]] = this["oSelectedObject"];
            this["oLastSelectedObjectMode"][this["oSelectedMode"]["mode_id"]]["lastMode"] = this["sMode"];
            // Nom du formulaire
            this["setFormDefinitionName"]();
            // Compile le template de l'objet sélectionné (ou affiche l'élément du mode).
            var envSrvc = this;
            if (bCompileTemplate || oOptions["bForceTemplateCompilation"]) {
                if (typeof (oOptions["sUrlTemplate"]) != "undefined") {
                    // Compile le template passé en paramètre.
                    $rootScope["compileObjectTemplate"](oOptions["sUrlTemplate"]);
                } else {
                    // Evènement (paramètre "event" de la table "vm_tab") ?
                    if (typeof (this["oSelectedObject"]["event"]) != "undefined") {
                        $rootScope.$eval(this["oSelectedObject"]["event"]);
                        // Nom du formulaire (si changement du mode d'action (insert, update, display) après l'évènement).
                        this["setFormDefinitionName"]();
                        // Sauve le nom et le mode d'action de l'onglet.
                        if (oOptions["bFirstModeObject"] === true) {
                            this["oLastSelectedObjectMode"][this["oSelectedMode"]["mode_id"]] = this["oSelectedObject"];
                            this["oLastSelectedObjectMode"][this["oSelectedMode"]["mode_id"]]["lastMode"] = this["sMode"];
                        }
                    }
                    // Si 1er affichage de l'onglet : chargement de ses sections.
                    if (typeof (envSrvc["oSelectedObject"]["sections"]) == "undefined") {
                        // Nom du service web (vitis, gtf...)
                        var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vitis");
                        // Charge les sections de l'onglet.
                        var sFilterModules = sessionStorage["application_modules"].split(",").map(function (sModule) {
                            return "'" + sModule + "'";
                        }).join(",");
                        var oParams = {
                            "token": sessionStorage["session_token"],
                            "order_by": "index",
                            "filter": "tab_id=" + this["oSelectedObject"]["tab_id"] + " AND lang='" + propertiesSrvc["language"] + "'" + " AND module_name IN(" + sFilterModules + ")"
                        }
                        oWebServiceBase["customGET"]("VitisSections", oParams)
                                .then(function (data) {
                                    if (data["status"] == 1) {
                                        // Sauve les sections et le nom du template.
                                        envSrvc["oSelectedObject"]["sections"] = data["vitissections"];
                                        envSrvc["sSelectedTemplate"] = data["vitissections"][0]["template"];
                                        var sTemplateUrl;
                                        // 1 ou plusieurs sections pour l'onglet ?
                                        if (envSrvc["sMode"] != "search" && data["vitissections"].length > 1)
                                            sTemplateUrl = envSrvc["sTemplateFolder"] + "sectionFormTpl.html";
                                        else {
                                            // Le template de l'objet est dans un répertoire du module ou dans le noyau ?
                                            if (envSrvc["sSelectedTemplate"].indexOf("/") != -1)
                                                sTemplateUrl = envSrvc["sSelectedTemplate"];
                                            else
                                                sTemplateUrl = envSrvc["sTemplateFolder"] + envSrvc["sSelectedTemplate"];
                                        }
                                        envSrvc["setFormDefinitionName"]();
                                        // Compile le template de l'onglet (vm_tab.template).
                                        $rootScope["compileObjectTemplate"](sTemplateUrl);

                                        $rootScope.$broadcast($rootScope["sSelectedObjectName"] + '_form', {});
                                    }
                                });
                    } else {
                        // Onglet deja affiché une fois : sections sauvé dans la définition de l'onglet.
                        envSrvc["sSelectedTemplate"] = this["oSelectedObject"]["sections"][0]["template"];
                        // 1 ou plusieurs sections pour l'onglet ?
                        var sTemplateUrl;
                        if (envSrvc["sMode"] != "search" && envSrvc["oSelectedObject"]["sections"].length > 1)
                            sTemplateUrl = envSrvc["sTemplateFolder"] + "sectionFormTpl.html";
                        else {
                            // Le template de l'objet est dans un répertoire du module ou dans le noyau ?
                            if (envSrvc["sSelectedTemplate"].indexOf("/") != -1)
                                sTemplateUrl = envSrvc["sSelectedTemplate"];
                            else
                                sTemplateUrl = envSrvc["sTemplateFolder"] + envSrvc["sSelectedTemplate"];
                        }
                        $rootScope["compileObjectTemplate"](sTemplateUrl);
                    }
                }
            } else {
                $("#data_column .container-mode").hide();
                $("#container_mode_" + this["oSelectedMode"]["mode_id"]).show();
                /*
                 // Evènement (paramètre "event" de la table "vm_tab") ?
                 if (typeof(this["oSelectedObject"]["event"]) != "undefined") {
                 $rootScope.$eval(this["oSelectedObject"]["event"]);
                 // Nom du formulaire (si changement du mode d'action (insert, update, display) après l'évènement).
                 //this["sFormDefinitionName"] = this["oSelectedObject"]["name"] + "_" + this["sMode"] + "_form";
                 }
                 */
            }
        },
        /**
         * extractWebServiceData function.
         * Extrait les données renvoyées par un web service.
         * @param {string} sController Nom du contrôleur du web service.
         * @param {object} oWebServiceData Objet retourné par le web service.
         * @return {array}
         **/
        "extractWebServiceData": function (sController, oWebServiceData) {
            var sKey = sController;
            var aData = [];
            if (typeof (oWebServiceData[sKey]) != "undefined") {
                // 
                if (Array.isArray(oWebServiceData[sKey])) {
                    if (oWebServiceData[sKey].length > 0)
                        aData = oWebServiceData[sKey];
                } else
                    aData = oWebServiceData[sKey];
            }
            return aData;
        },
        /**
         * addSectionForm function.
         * Création d'un enregistrement.
         **/
        "addSectionForm": function () {
            this["setSectionForm"]("insert");
        },
        /**
         * addDoubleForm function.
         * Création d'un enregistrement.
         **/
        "addDoubleForm": function () {
            this["sSelectedTemplate"] = "doubleFormTpl.html";
            this["sId"] = "";
            // Change le mode.
            this["setMode"]("insert", this["sTemplateFolder"] + this["sSelectedTemplate"]);
        },
        /**
         * setSectionForm function.
         * Insertion, édition ou visualisation d'un enregistrement de la liste.
         * @param {string} sMode Mode d'action (insert, update, display).
         * @param {string} sId Id de l'enregistrement.
         **/
        "setSectionForm": function (sMode, sId) {
            var sTemplateUrl;
            // Template à commpiler.
            this["sSelectedTemplate"] = "simpleFormTpl.html";
            // Si plusieurs sections : compile le template des sections (avant le template simpleForm).
            if (this["oSelectedObject"]["sections"].length > 1)
                sTemplateUrl = "sectionFormTpl.html";
            else
                sTemplateUrl = "simpleFormTpl.html";
            // Sauve l'id de l'enregsitrement sélectionné.
            if (sMode != "insert")
                this["sId"] = sId;
            // Change le mode.
            this["setMode"](sMode, this["sTemplateFolder"] + sTemplateUrl);
        },
        /**
         * explodeWebServiceResourceId function.
         * Décompose l'id d'une ressource d'un web service.
         * @param {string} sResourceId Nom de la ressource du web service.
         * @return {array}
         **/
        "explodeWebServiceResourceId": function (sResourceId) {
            var returnValue = [];
            if (typeof (sResourceId) == "string")
                returnValue = sResourceId.split("/");
            return returnValue;
        },
        /**
         * getSectionWebServiceResourceId function.
         * Retourne l'id de ressource (web service) de la section sélectionnée.
         * @return {string}
         **/
        "getSectionWebServiceResourceId": function () {
            var sResourceId = this["oSelectedObject"]["ressource_id"];
            if (typeof (this["oSectionForm"][this["oSelectedObject"]["name"]]) != "undefined") {
                var sTable = this["oSelectedObject"]["name"];
                var oSectionForm = this["oSectionForm"][sTable];
                if (typeof (oSectionForm["sections"]) != "undefined") {
                    if (oSectionForm["sections"][oSectionForm["iSelectedSectionIndex"]]["ressource_id"] != null)
                        sResourceId = oSectionForm["sections"][oSectionForm["iSelectedSectionIndex"]]["ressource_id"];
                }
            }
            return sResourceId;
        },
        /**
         * setFormDefinitionName function.
         * Définition du nom de formulaire courant.
         **/
        "setFormDefinitionName": function () {
            if (typeof (this["oSelectedObject"]["sections"]) == "undefined")
                this["sFormDefinitionName"] = this["oSelectedObject"]["name"] + "_" + this["sMode"] + "_form";
            else {
                // 
                var iSelectedSectionIndex = 0;
                if (typeof (this["oSectionForm"][this["oSelectedObject"]["name"]]) != "undefined" && typeof (this["oSectionForm"][this["oSelectedObject"]["name"]]["iSelectedSectionIndex"]) != "undefined")
                    iSelectedSectionIndex = this["oSectionForm"][this["oSelectedObject"]["name"]]["iSelectedSectionIndex"];
                //
                if (this["oSelectedObject"]["sections"].length == 1 || this["sMode"] == "search")
                    this["sFormDefinitionName"] = this["oSelectedObject"]["name"] + "_" + this["sMode"] + "_form";
                else
                    this["sFormDefinitionName"] = this["oSelectedObject"]["name"] + "_" + this["oSelectedObject"]["sections"][iSelectedSectionIndex]["name"] + "_" + this["sMode"] + "_form";
            }
        },
        /**
         * toGarbageCollection function.
         * Supprime un tableau / objet et toutes ses références.
         * @param {} reference Référence à supprimer (tableau ou objet).
         **/
        "toGarbageCollection": function (reference) {
            if (reference != null) {
                var envSrvc = this;
                if (Array.isArray(reference))
                    reference.length = 0;
                else if (typeof (reference) == "object") {
                    Object.keys(reference).forEach(function (sParameterName) {
                        if (Array.isArray(reference[sParameterName]) || typeof (reference[sParameterName]) == "object")
                            envSrvc["toGarbageCollection"](reference[sParameterName]);
                        else
                            delete reference[sParameterName];
                    });
                }
            }
        }
    };
};

/**
 * userSrvc service.
 * Paramètres de l'utilisateur.
 **/
vitisApp.userSrvc = function () {
    return {
        "id": "",
        "login": ""
    };
};

/**
 * modesSrvc service.
 * Modes et objets de l'utilisateur.
 * @param {service} $translate Translate service.
 * @param {service} $translatePartialLoader TranslateStaticFilesLoader service.
 * @param {service} $q Angular q service.
 * @param {angular.$rootScope} $rootScope Angular rootScope.
 * @param {service} $timeout Angular timeout.
 * @param {service} Restangular Service Restangular.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} sessionSrvc Service de gestion des sessions.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} formSrvc Service de gestion des formulaires.
 * @constructor
 * @ngInject
 **/
vitisApp.modesSrvc = function ($translate, $translatePartialLoader, $q, $rootScope, $timeout, Restangular, envSrvc, sessionSrvc, propertiesSrvc, formSrvc) {
    return {
        "modes": "", // Liste des modes de l'utilisateur.
        "scope": "",
        /**
         * getMode function.
         * Retourne l'objet d'un mode.
         * @param {string} sModeId id d'un mode
         * @return {string}
         **/
        "getMode": function (sModeId) {
            var i = 0;
            while (i < this["modes"].length) {
                if (this["modes"][i]["mode_id"] == sModeId)
                    return this["modes"][i];
                i++;
            }
            return {};
        },
        /**
         * getObject function.
         * Retourne l'objet d'un onglet.
         * @param {string} sObjectId id de l'onglet
         * @param {object} oMode Objet d'un mode
         * @return {string}
         **/
        "getObject": function (sObjectId, oMode) {
            var i = 0;
            while (i < oMode["objects"].length) {
                if (oMode["objects"][i]["name"] == sObjectId)
                    return oMode["objects"][i];
                i++;
            }
            return {};
        },
        /**
         * selectMode function.
         * Changement de mode.
         * @param {angular.$scope} $scope Angular scope.
         * @param {string} sSelectedMode id du mode sélectionné
         * @param {object} oEvent évènement jQuery.
         **/
        "selectMode": function ($scope, sSelectedMode, oEvent, iObjectId) {
            iObjectId = goog.isDefAndNotNull(iObjectId) ? iObjectId : 0;
            var modesSrvc = this;
            // Vérifie sur un formulaire a été modifié mais pas enregistré.
            var deferred = $q.defer();
            var promise = formSrvc["checkFormModifications"](envSrvc["sFormDefinitionName"]);
            promise.then(function () {
                var bFirstModeObject;
                // Paramètre "reload" du précédent mode.
                var bReloadMode = true;
                if (typeof (envSrvc["oSelectedMode"]["mode_id"]) != "undefined") {
                    bReloadMode = envSrvc["oSelectedMode"]["reload"];
                    // Supprime les paramètres du précédent mode.
                    if (bReloadMode) {
                        // Vide l'élément html contenant le mode précédemment affiché.
                        angular.element("#container_mode_" + envSrvc["oSelectedMode"]["mode_id"]).empty();
                        // Supprime les données du précédent onglet.
                        modesSrvc["clearObjectData"](envSrvc["oSelectedObject"]["name"], envSrvc["oSelectedMode"]["mode_id"]);
                        //formSrvc["clearFormData"](envSrvc["sFormDefinitionName"]);
                        envSrvc["oLastSelectedObjectMode"][envSrvc["oSelectedMode"]["mode_id"]] = null;
                        // Vide les sections de l'objet précédent.
                        if (typeof (envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]) != "undefined")
                            envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]] = {};
                    }
                }
                // Mise à jour de la variable d'environnement.
                var oSelectedMode = modesSrvc["getMode"](sSelectedMode);
                envSrvc["oSelectedMode"] = oSelectedMode;

                // Dernier objet affiché ou 1er objet du mode.
                var oLastSelectedObjectMode = envSrvc["oLastSelectedObjectMode"][envSrvc["oSelectedMode"]["mode_id"]];
                if (!bReloadMode && !goog.object.isEmpty(oLastSelectedObjectMode) && oLastSelectedObjectMode["lastMode"] != "undefined") {
                    // Dernier objet du mode affiché.
                    envSrvc["sMode"] = oLastSelectedObjectMode["lastMode"];
                    envSrvc["oSelectedObject"] = oLastSelectedObjectMode;
                    bFirstModeObject = false;
                } else {
                    // 1er objet du mode.
                    envSrvc["oSelectedObject"] = oSelectedMode["objects"][iObjectId];
                    // Sauve le paramètre "$scope" (car renommé par google closure).
                    modesSrvc["scope"] = $scope;
                    /*
                     if (typeof(modesSrvc["modes_event"][oSelectedMode["mode_id"]]) != "undefined")
                     eval(modesSrvc["modes_event"][oSelectedMode["mode_id"]]);
                     */
                    bFirstModeObject = true;
                }
                // Affiche les onglets
                $rootScope["sSelectedObjectName"] = envSrvc["oSelectedObject"]["name"];

                if (oSelectedMode["objects"].length > 1 || oSelectedMode["objects"][iObjectId]['label'] !== null)
                    $scope["objects"] = oSelectedMode["objects"];
                else
                    $scope["objects"] = {};

                // Ajoute une classe css au mode sélectionné. --> dans une directive ???
                if (typeof (oEvent) !== "undefined") {
                    $("#mode_column > ul > li > a").removeClass("mode_selected");
                    $(oEvent.target).addClass("mode_selected");
                } else {
                    $("#mode_column > ul > li > a").removeClass("mode_selected");
                    $('#mode_' + sSelectedMode).addClass("mode_selected");
                }
                // Lance le chargement des enregistrements de l'objet.
                envSrvc["loadObjectTemplate"]({"bForceTemplateCompilation": false, "bFirstModeObject": bFirstModeObject});
                // émission d'un signal pour chargement de certains objets
                $timeout(function () {
                    $rootScope.$broadcast($rootScope["sSelectedObjectName"], {});
                }, 300);
                deferred.resolve();
            });
            var promise2 = deferred.promise;
            return promise2;
        },
        /**
         * selectObject function.
         * Changement d'onglet.
         * @param {angular.$scope} $scope Angular scope.
         * @param {string} sSelectedObjectName Id du mode sélectionné
         * @param {string} sObjectMode Mode pour le 1er affichage de l'onglet (search, update...).
         * @param {object} oEvent Evènement jQuery.
         **/
        "selectObject": function ($scope, sSelectedObjectName, sObjectMode, oEvent) {
            var modesSrvc = this;
            // Vérifie sur un formulaire a été modifié mais pas enregistré.
            var promise = formSrvc["checkFormModifications"](envSrvc["sFormDefinitionName"]);
            promise.then(function () {
                if (typeof (sObjectMode) == "undefined")
                    sObjectMode = "search";
                // Vide l'élément html contenant le mode précédemment affiché.
                angular.element("#container_mode_" + envSrvc["oSelectedMode"]["mode_id"]).empty();
                // Supprime les données du précédent onglet.
                modesSrvc["clearObjectData"](envSrvc["oSelectedObject"]["name"], envSrvc["oSelectedMode"]["mode_id"]);
                //formSrvc["clearFormData"](envSrvc["sFormDefinitionName"]);
                // Vide les sections de l'objet précédent.
                if (typeof (envSrvc["oSectionForm"][sSelectedObjectName]) != "undefined") {
                    envSrvc["oSectionForm"][sSelectedObjectName] = {};
                    envSrvc["oLastSelectedObjectMode"][envSrvc["oSelectedMode"]["mode_id"]]["sFormDefinitionName"] = null;
                }
                // Mise à jour de la variable d'environnement
                envSrvc["sMode"] = sObjectMode;
                envSrvc["oSelectedObject"] = modesSrvc["getObject"](sSelectedObjectName, envSrvc["oSelectedMode"]);
                // Nom de l'objet sélectionné (affiché).
                $rootScope["sSelectedObjectName"] = envSrvc["oSelectedObject"]["name"];
                // Lance le chargement des enregistrements de l'objet.
                envSrvc["loadObjectTemplate"]({"bForceTemplateCompilation": true});

                // émission d'un signal pour chargement de certains objets
                $timeout(function () {
                    $rootScope.$broadcast($rootScope["sSelectedObjectName"], {});
                }, 1);
            });
        },
        /**
         * loadModes function.
         * Charge la liste des modes de l'application.
         **/
        "loadModes": function () {
            // Nom du service web (vitis, gtf...)
            var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vitis");
            // Chargement des modes.
            var oParams = {
                "token": sessionSrvc["token"],
                "filter": "application_name='" + sessionStorage["application"] + "'",
                "order_by": "index",
                "distinct": "true"
            };
            var modesSrvc = this;
            var deferred = $q.defer();
            oWebServiceBase["customGET"]("modes", oParams, {"Accept": "application/x-vm-json"})
                    .then(function (data) {
                        if (data["status"] == 1) {
                            // Extraction des modes.
                            var aModes = data["data"], aObjects, aRessourceId;
                            var i = 0, j, k;
                            while (i < aModes.length) {
                                // Sauve les onglets du mode.
                                aObjects = aModes[i]["data"][0]["data"];
                                if (!goog.isDef(aObjects)) {
                                    console.error('Objets du mode ' + aModes[i]["mode_id"] + ' non définis');
                                    console.error(aModes[i]);
                                }
                                k = 0;
                                while (k < aObjects.length) {
                                    // Paramètre "name" -> id de l'onglet.
                                    aObjects[k]["name"] = aObjects[k]["mode_id"] + "_" + aObjects[k]["name"];
                                    // Supprime "javascript:" (sinon erreur).
                                    aObjects[k]["event"] = aObjects[k]["event"].replace("javascript:", "");
                                    // Scopes attachés à l'onglet.
                                    aObjects[k]["aScope"] = [];
                                    // Onglet accessible depuis le menu.
                                    aObjects[k]["display_menu"] = true;
                                    k++;
                                }
                                aModes[i]["objects"] = aObjects;
                                aModes[i]["data"] = undefined;
                                aModes[i]["fullScreen"] = false;
                                aModes[i]["ajaxLoader"] = true;
                                i++;
                            }
                            // Sauve les modes de l'utilisateur.
                            modesSrvc["modes"] = aModes;
                            deferred.resolve("modes saved");

                            // Liste des modules de l'application.
                            var aModules = [];
                            var i = 0;
                            while (i < aModes.length) {
                                if (aModules.indexOf(aModes[i]["module_name"]) == -1)
                                    aModules.push(aModes[i]["module_name"]);
                                i++;
                            }
                            // Sauve la liste des modules.
                            sessionStorage["application_modules"] = aModules;

                            // Chargement des fichiers de traductions des modules.
                            var i = 0;
                            while (i < aModules.length) {
                                $translatePartialLoader["addPart"]("modules/" + aModules[i] + "/lang");
                                i++;
                            }

                            // Traduction des titres et textes des modes.
                            $translate["refresh"]()
                                    .then(function () {
                                        var i = 0, j = 0;
                                        var sModeTitleKey, sModeTextKey;
                                        while (i < aModes.length) {
                                            sModeTitleKey = "TITLE_MODE_" + aModes[i]["mode_id"].toUpperCase();
                                            sModeTextKey = "TEXT_MODE_" + aModes[i]["mode_id"].toUpperCase();
                                            $translate([sModeTitleKey, sModeTextKey], {"app_name": propertiesSrvc["app_name"]})
                                                    .then(function (translations) {
                                                        var aTranslationsKeys = Object.keys(translations);
                                                        aModes[j]["title"] = translations[aTranslationsKeys[0]];
                                                        aModes[j]["text"] = translations[aTranslationsKeys[1]];
                                                        j++;
                                                    });
                                            i++;
                                        }
                                    });
                        }
                    });

            var promise = deferred.promise;
            return promise;
        },
        /**
         * setModeReload function.
         * Définition du paramètre "reload" d'un mode.
         * @param {string} sModeId id d'un mode
         * @param {string} bReload paramètre du mode
         **/
        "setModeReload": function (sModeId, bReload) {
            var i = 0;
            while (i < this["modes"].length) {
                if (this["modes"][i]["mode_id"] == sModeId)
                    this["modes"][i]["reload"] = bReload;
                i++;
            }
        },
        /**
         * clearObjectData function.
         * Supprime les données d'un onglet.
         * @param {string} sObjectId id d'un mode
         * @param {string} sModeId id d'un mode
         **/
        "clearObjectData": function (sObjectId, sModeId) {
            // Supprime tous les scopes utilisés par l'onglet.
            var oObject = this["getObject"](sObjectId, this["getMode"](sModeId));
            if (goog.isDefAndNotNull(oObject["aScope"])) {
                oObject["aScope"].forEach(function (scope) {
                    scope.$destroy();
                });
                oObject["aScope"].length = 0;
            }
        },
        /**
         * addScopeToObject function.
         * Ajoute un scope à la liste des scopes utilisés par l'onglet.
         * @param {string} sObjectId id d'un mode
         * @param {string} sModeId id d'un mode
         * @param {angular.scope} scope Scoped'angular
         **/
        "addScopeToObject": function (sObjectId, sModeId, scope) {
            oObject = this["getObject"](sObjectId, this["getMode"](sModeId));
            if (typeof (oObject["aScope"]) == "undefined")
                oObject["aScope"] = [];
            oObject["aScope"].push(scope);
        }
    };
};

/**
 * externFunctionSrvc service.
 * Fonctions externes à Angular.
 * @param {angular.$rootScope} $rootScope Angular rootScope.
 * @param {service} $translate Translate service.
 * @param {service} $q Angular q service.
 * @param {angular.$log} $log Angular log service.
 * @ngInject
 * @export
 **/
vitisApp.externFunctionSrvc = function ($rootScope, $translate, $q, $log) {
    return {
        /**
         * resizeWin function.
         * Redimensionne les éléments html principaux de l'application.
         **/
        "resizeWin": function () {
            // Hauteur de l'élément "footer_line" (menu mode + contenu html des objets).
            var iWorksLineHeight = document.getElementById("container").offsetHeight;
            if (document.getElementById("header_line") != null &&
                    (document.getElementById("header_line").style['margin-top'] === "" || document.getElementById("header_line").style['margin-top'] === '0px'))
                iWorksLineHeight -= document.getElementById("header_line").offsetHeight;
            if (document.getElementById("footer_line") != null &&
                    (document.getElementById("footer_line").style['margin-top'] === "" || document.getElementById("footer_line").style['margin-top'] === '0px'))
                iWorksLineHeight -= document.getElementById("footer_line").offsetHeight;
            document.getElementById("works_line").style.height = iWorksLineHeight + "px";

            // Largeur de l'élément "data_column" (contenu html des objets).
//                        var iDataColumnWidth = document.getElementById("container").offsetWidth;
//                        if (document.getElementById("mode_column") != null)
//                                iDataColumnWidth -= document.getElementById("mode_column").offsetWidth;
//                        document.getElementById("data_column").style.width = iDataColumnWidth + "px";

            // Hauteur des listes ui-grid (liste - header - footer).
            //var oWorkspaceGrid = $("#data_column .workspacelist-grid");
            var oWorkspaceGrid = $(".workspacelist-grid");
            var i = 0;
            while (i < oWorkspaceGrid.length) {
                var iMainGridHeight = oWorkspaceGrid[i].offsetHeight;
                var iMainGridWidth = oWorkspaceGrid[i].offsetWidth;
                if (document.getElementById(oWorkspaceGrid[i].id + "_header") != null)
                    iMainGridHeight -= document.getElementById(oWorkspaceGrid[i].id + "_header").offsetHeight;
                if (document.getElementById(oWorkspaceGrid[i].id + "_footer") != null)
                    iMainGridHeight -= document.getElementById(oWorkspaceGrid[i].id + "_footer").offsetHeight;
                document.getElementById(oWorkspaceGrid[i].id + "_data").style.height = (iMainGridHeight - 2) + "px";
                document.getElementById(oWorkspaceGrid[i].id + "_data").style.width = (iMainGridWidth - 2) + "px";
                i++;
            }
        },
        /**
         * clearLessCache function.
         * Supprime le cache de LESS.
         **/
        "clearLessCache": function () {
            var i = 0;
            while (i < window.localStorage.length) {
                var sKey = window.localStorage.key(i);
                if (sKey.indexOf(".less") != -1)
                    window.localStorage.removeItem(sKey);
                else
                    i++;
            }
        },
        /**
         * preg_replace function.
         * Rechercher et remplacer par expression rationnelle standard.
         * @param {array} array_pattern Tableau de masques à chercher.
         * @param {array} array_pattern_replace Tableau de chaines pour le remplacement.
         * @param {string} my_string Chaine pour le remplacement.
         * @return {string}
         **/
        "preg_replace": function (array_pattern, array_pattern_replace, my_string) {
            var new_string = String(my_string);
            for (i = 0; i < array_pattern.length; i++) {
                var reg_exp = RegExp(array_pattern[i], "gi");
                var val_to_replace = array_pattern_replace[i];
                new_string = new_string.replace(reg_exp, val_to_replace);
            }
            return new_string;
        },
        /**
         * modalWindow function.
         * Affiche une fenêtre modale.
         * @param {string} sType Type de fenêtre (alert, confirm...).
         * @param {string} sTitle Titre de la fenêtre.
         * @param {object} oOptions Paramètres du composant et autres (appDuration, appBootstrapStyle).
         * @return {promise}
         **/
        "modalWindow": function (sType, sTitle, oOptions) {
            $log.info("modalWindow");
            var deferred = $q.defer();
            var promise = deferred.promise;
            // Paramètres optionnels ?
            if (typeof (oOptions) == "undefined")
                oOptions = {};
            // Titre + message à traduire ?
            var aStringsToTranslate = [];
            if (typeof (sTitle) != "undefined" && sTitle != "")
                aStringsToTranslate.push(sTitle);
            if (typeof (oOptions["message"]) != "undefined" && oOptions["message"] != "")
                aStringsToTranslate.push(oOptions["message"]);
            else
                oOptions["message"] = "&nbsp;"
            // Traduction et affichage de la fenêtre modale.
            $translate(aStringsToTranslate).then(function (aTranslations) {
                var sGlyphicon, bCloseButton = false;
                if (oOptions["message"] != "&nbsp;")
                    oOptions["message"] = aTranslations[oOptions["message"]];
                // Mise en forme du titre de la fenêtre suivant la classe css spécifiée.
                if (typeof (sTitle) != "undefined" && sTitle != "") {
                    oOptions["title"] = aTranslations[sTitle];
                    switch (oOptions["className"]) {
                        // Erreur
                        case "modal-danger":
                            sGlyphicon = "exclamation-sign";
                            //oOptions["closeButton"] = true;
                            bCloseButton = true;
                            break;
                            // OK
                        case "modal-success":
                            sGlyphicon = "ok-sign";
                            bCloseButton = true;
                            //oOptions["closeButton"] = true;
                            break;
                            // Warning.
                        case "modal-warning":
                            sGlyphicon = "warning-sign";
                            break;
                    }
                    // Titre avec un glyphicon ?
                    if (typeof (sGlyphicon) != "undefined")
                        oOptions["title"] = '<span class="glyphicon glyphicon-' + sGlyphicon + '" aria-hidden="true"></span>&nbsp;' + aTranslations[sTitle];
                }
                // Bouton de fermeture de la fenêtre ?
                if (bCloseButton && sType == "dialog") {
                    oOptions["buttons"] = {
                        "close": {
                            label: "OK",
                            className: "btn-default" //  pull-left
                        }
                    };
                }
                // Affichage de la fenêtre.
                oDialog = bootbox[sType](oOptions);
                //
                deferred.resolve(oDialog);
                // Suppression du message après x millisecondes ?
                if (typeof (oOptions["appDuration"]) != "undefined") {
                    setTimeout(function () {
                        oDialog["modal"]('hide');
                        if (typeof (oOptions["appCallback"]) != "undefined")
                            oOptions["appCallback"]($rootScope, oDialog);
                    }, oOptions["appDuration"]);
                } else if (typeof (oOptions["appCallback"]) != "undefined")
                    oOptions["appCallback"]($rootScope, oDialog);
            });
            return promise;
        }
    }
};

/**
 * propertiesSrvc service.
 * Gestion des properties.
 * @param {angular.$http} $http Angular http service.
 * @param {service} Restangular Service Restangular.
 * @constructor
 * @ngInject
 **/
vitisApp.propertiesSrvc = function (Restangular, $http) {
    return {
        /**
         * getFromServer function.
         * Charge les properties stockées côté serveur.
         **/
        "getFromServer": function () {
            // Nom du service web (vitis, gtf...)
            var oWebServiceBase = Restangular["one"](this["services_alias"] + "/vitis");
            //
            var propertiesSrvc = this;
            var oParams = {};
            // Passe le token si l'utilisateur est connecté.
            if (typeof (sessionStorage["session_token"]) != "undefined")
                oParams = {"token": sessionStorage["session_token"]};
            return oWebServiceBase["customGET"]("properties", oParams)
                    .then(function (data) {
                        delete data["status"];
                        // Sauve toutes les properties.
                        var i = 0;
                        var aKeys = Object.keys(data);
                        while (i < aKeys.length) {
                            propertiesSrvc[aKeys[i]] = data[aKeys[i]];
                            i++;
                        }
                        // Sauve le token.
                        propertiesSrvc['session_token'] = sessionStorage['session_token'];
                        // Dit à l'application que les properties on étés chargées
                        vitisApp.broadcast('properties_loaded');
                    }
                    );
        },
        /**
         * getFromClient function.
         * Charge les properties stockées côté client.
         **/
        "getFromClient": function () {
            var propertiesSrvc = this;
            return $http.get("conf/properties.json")
                    .success(function (data) {
                        // Sauve toutes les properties.
                        var i = 0;
                        var aKeys = Object.keys(data);
                        while (i < aKeys.length) {
                            propertiesSrvc[aKeys[i]] = data[aKeys[i]];
                            i++;
                        }
                        // Sauve le token.
                        propertiesSrvc['session_token'] = sessionStorage['session_token'];
                    }
                    );
        }
    }
};
'use strict';
// Google closure
goog.provide("vitis.controllers.logs");
goog.require("vitis.modules.main");

/**
 * logs Controller.
 * .
 * @param {angular.$rootScope} $rootScope Angular rootScope.
 * @param {angular.$log} $log Angular log service.
 * @param {angular.$scope} $scope Angular scope.
 * @param {service} $translate Translate service.
 * @param {service} Restangular Service Restangular.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} sessionSrvc Service de gestion des sessions.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @ngInject
 **/
vitisApp.logsCtrl = function ($rootScope, $log, $scope, $translate, Restangular, envSrvc, sessionSrvc, propertiesSrvc) {
    // Initialisation
    $log.info("initLogs");
    // Valeurs du formulaire de log.
    envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]] = {
        'min_days_files': 5
    };

    // Sauve les valeurs du form.
    envSrvc["oFormDefaultValues"][envSrvc["sFormDefinitionName"]] = angular.copy(envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]);

    /**
     * getFileContent function.
     * Charge le contenu d'un fichier.
     * @param {object} oLogFile
     * @param {string} size
     **/
    $rootScope["getFileContent"] = function (oLogFile, size) {
        if (typeof (oLogFile) != "undefined") {
            var iLogSize = propertiesSrvc["log_size"];
            // 1Mo max par défaut.
            if (isNaN(iLogSize)) {
                iLogSize = 1024;
            }
            iLogSize *= 1024;
            if (size < iLogSize) {
                var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vitis", "logs");
                var oParams = {
                    "token": sessionSrvc["token"],
                    "folder": oLogFile['folder']
                };
                oWebServiceBase["customGET"](oLogFile['log_directory'] + "/file/" + oLogFile['name'], oParams)
                        .then(function (data) {
                            if (data["status"] == 1) {
                                $scope["sLogContent"] = data["file"];
                                $rootScope["sLogPath"] = oLogFile['path'];
                                if (typeof ($scope["sLogContent"]) != "undefined") {
                                    // Redimensionne et affiche le <textarea> du log.
                                    $("#logs-content-container").show();
                                    $scope["resizeLogsContainer"]();
                                    window.addEventListener("resize", $scope["resizeLogsContainer"]);
                                }
                            } else {
                                // Affichage de la fenêtre modale d'erreur.
                                var oOptions = {
                                    "className": "modal-danger",
                                    "message": data["errorMessage"],
                                    "appDuration": 2000
                                };
                                $scope["modalWindow"]("dialog", "LOADING_FILE_ERROR_LOGS", oOptions);

                            }
                        });

            } else {
                $rootScope["sLogPath"] = oLogFile['path'];
                $("#logs-content-container").show();
                $scope["sLogContent"] = ""
                var itextAreaContainerheight = $("#logs-content-container").height() - document.getElementById("logs-content-container").children[0].offsetHeight;
                document.getElementById("logs-content-container").children[1].style.height = itextAreaContainerheight + "px";
                // Affichage de la fenêtre modale d'erreur.
                var oOptions = {
                    "className": "dialog-modal-window",
                    "appDuration": 2000
                };
                $scope["modalWindow"]("dialog", "FILE_TOO_BIG_LOGS", oOptions);
            }
        }
    };

    /**
     * deleteFile function.
     * Supprime un fichier.
     * @param {string} aPath Chemin du fichier
     **/
    $rootScope["deleteFile"] = function (oLogFile) {
        if (goog.isDefAndNotNull(oLogFile)) {
            var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vitis", "logs");
            var oParams = {
                "token": sessionSrvc["token"],
                "folder": oLogFile['folder']
            };
            oWebServiceBase["customDELETE"](oLogFile['log_directory'] + '/file/' + oLogFile['name'], oParams)
                    .then(function (data) {
                        var sTitle, sMessage;
                        var oOptions = {};
                        if (data["status"] == 1) {
                            // Affichage du message de succés.
                            sTitle = "DELETE_FILE_SUCCESS_LOGS";
                            $translate(sTitle).then(function (sTranslation) {
                                $.notify(sTranslation, "success");
                            });
                            // Raffraîchissement de l'arborescence.
                            setTimeout(function () {
                                $scope["loadTreeview"]();
                            });
                        } else {
                            // Paramètres de la fenêtre modale.
                            sTitle = "DELETE_FILE_ERROR_LOGS";
                            // Affichage de la fenêtre modale.
                            oOptions["className"] = "modal-danger";
                            oOptions["message"] = data["errorMessage"];
                            $scope["modalWindow"]("dialog", sTitle, oOptions);
                        }
                    });
        }
    };

    /**
     * resizeLogsContainer  function.
     * Redimensionne le conteneur des logs.
     **/
    $scope["resizeLogsContainer"] = function () {
        $log.info("resizeLogsContainer");
        if (envSrvc["oSelectedMode"]["mode_id"] == "logs") {
            var itextAreaContainerheight = $("#logs-content-container").height() - document.getElementById("logs-content-container").children[0].offsetHeight;
            document.getElementById("logs-content-container").children[1].style.height = itextAreaContainerheight + "px";
        }
    };
};
vitisApp.module.controller("logsCtrl", vitisApp.logsCtrl);

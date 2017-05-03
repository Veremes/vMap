// Google closure
goog.provide("vitis.directives.logs");
goog.require("vitis.modules.main");

/**
 * appLogs directive.
 * Association du contrôleur à la directive.
 * @param {service} $translate Translate service.
 * @ngInject
 **/
vitisApp.appLogsDrtv = function ($translate) {
    return {
        restrict: 'A',
        controller: 'logsCtrl',
        controllerAs: 'ctrl',
        link: function (scope, element, attrs) {
            // Traduction et affichage du tooltip.
            $translate(["FORM_BTN_DELETE_FILE_LOGS"]).then(function (aTranslations) {
                var oOptions = {
                    "title": aTranslations["FORM_BTN_DELETE_FILE_LOGS"],
                    "placement": "bottom",
                    "trigger": "hover",
                    "container": "body"
                }
                angular.element("#btn_delete_log_file")["tooltip"](oOptions);
            });
            // Attends la suppression du scope.
            scope.$on("$destroy", function () {
                // Supprime le tooltip.
                angular.element("#btn_delete_log_file")["tooltip"]("destroy");
                // Supprime l'évènement.
                window.removeEventListener("resize", scope["resizeLogsContainer"]);
            });
        }
    }
};
vitisApp.module.directive("appLogs", vitisApp.appLogsDrtv);

/**
 * appLogsForm directive.
 * Charge le template des éléments de formulaire.
 * @ngInject
 **/
vitisApp.appLogsFormDrtv = function () {
    return {
        replace: true,
        templateUrl: "templates/formTpl.html"
    }
};
vitisApp.module.directive("appLogsForm", vitisApp.appLogsFormDrtv);

/**
 * appLogsTreeviewContainer directive.
 * Charge et compile le template des arborescences des logs.
 * @param {angular.$timeout} $timeout Angular timeout service.
 * @param {service} $translate Translate service.
 * @param {service} Restangular Service Restangular.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} sessionSrvc Service de gestion des sessions.
 * @ngInject
 **/
vitisApp.appLogsTreeviewContainerDrtv = function ($timeout, $translate, Restangular, propertiesSrvc, envSrvc, sessionSrvc) {
    return {
        link: function (scope, element, attrs) {
            /**
             * loadTreeview function.
             * Crée le treeview des fichiers de log.
             **/
            scope["loadTreeview"] = function () {
                // Cache le contenu du fichier de log.
                $("#logs-content-container").hide();
                // Charge l'arborescence des logs.
                var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vitis", "Logs");
                var oParams = {
                    "token": sessionSrvc["token"],
                    "application_name": sessionStorage["application"]
                };
                oWebServiceBase["customGET"]("", oParams)
                        .then(function (data) {
                            if (data["status"] == 1) {
                                $timeout(function () {
                                    data = data["tree"];
                                    scope["oSelectedLogFile"] = {};
                                    scope["aTreeviewLogs"] = data;

                                    // Crée l'arborescence dans l'élément.
                                    $(element)["treeview"]({
                                        "showBorder": false,
                                        "expandIcon": "glyphicon glyphicon-folder-close",
                                        "collapseIcon": "glyphicon glyphicon-folder-open",
                                        "onNodeSelected": function (event, data) {

                                            scope["oSelectedLogFile"] = data;

                                            // Fichier trop volumineux ?
                                            scope["getFileContent"](data, data["size"]);

                                        },
                                        "onNodeUnselected": function (event, data) {
                                            scope["oSelectedLogFile"] = [];
                                        },
                                        //"showTags": true,
                                        "highlightSelected": true,
                                        "multiSelect": false,
                                        //"showCheckbox": true,
                                        "data": scope["aTreeviewLogs"]["data"]
                                    });
                                });
                            }
                        });
            };

            /**
             * deleteLogsHistory function.
             * Supprime les fichiers de log de plus de x jours.
             **/
            scope["deleteLogsHistory"] = function () {
                var iMinDays = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["min_days_files"];
                $translate('DELETE_HISTORY_CONFIRM_LOGS', {"min_days_files": iMinDays}).then(function (sText) {
                    var oOptions = {
                        "className": "modal-warning",
                        "message": sText,
                        "callback": function (bResponse) {
                            if (bResponse) {
                                //scope["deleteFile"](aFilesToDelete);
                                var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vitis", "Logs");
                                var oParams = {
                                    "token": sessionSrvc["token"],
                                    "min_days": iMinDays
                                };
                                oWebServiceBase["customDELETE"]("", oParams)
                                        .then(function (data) {
                                            // Raffraîchissement de l'arborescence.
                                            scope["loadTreeview"]();
                                        });
                            }
                        }
                    };
                    scope["modalWindow"]("confirm", "", oOptions);
                });
            };

            /**
             * deleteLogFile function.
             * Supprime un fichier de log.
             * @param {string} sLogFile Chemin du fichier.
             **/
            scope["deleteLogFile"] = function (oLogFile) {                
                var oOptions = {
                    "className": "modal-warning",
                    "message": "DELETE_FILE_CONFIRM_LOGS",
                    "callback": function (bResponse) {
                        if (bResponse)
                            scope["deleteFile"](oLogFile);
                    }
                };
                scope["modalWindow"]("confirm", "", oOptions);
            };

            // Charge les logs.
            scope["loadTreeview"]();

            // Attends la suppression du scope.
            scope.$on("$destroy", function () {
                // Supprime le treeview.
                $("#" + element[0].id)["treeview"]("remove");
            });
        }
    }
};
vitisApp.module.directive("appLogsTreeviewContainer", vitisApp.appLogsTreeviewContainerDrtv);

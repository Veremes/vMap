/* global vitisApp */

// Google closure
goog.provide("vitis.directives.simpleForm");
goog.require("vitis.modules.main");

/**
 * appSimpleForm directive.
 * Association du contrôleur à la directive.
 * @export
 **/
vitisApp.appSimpleFormDrtv = function () {
    return {
        restrict: 'A',
        controller: 'simpleFormCtrl',
        controllerAs: 'ctrl',
        scope: true
    }
};
vitisApp.module.directive("appSimpleForm", vitisApp.appSimpleFormDrtv);

/**
 * appSimpleFormFormular directive.
 * Formulaire.
 * @param {angular.$timeout} $timeout Angular timeout service.
 * @param {service} $translate Translate service.
 * @param {service} $q Angular q service.
 * @param {service} Restangular Service Restangular.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} externFunctionSrvc Fonctions externes à Angular.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} sessionSrvc Service de gestion des sessions.
 * @param {service} formSrvc Service de gestion des formulaires.
 * @ngInject
 **/
vitisApp.appSimpleFormFormularDrtv = function ($timeout, $translate, $q, Restangular, envSrvc, externFunctionSrvc, propertiesSrvc, sessionSrvc, formSrvc) {
    return {
        replace: true,
        templateUrl: "templates/formTpl.html",
        link: function (scope, element, attrs) {
            // Redimensionnement de la fenêtre (attends Angular)
            $timeout(function () {
                externFunctionSrvc["resizeWin"]();
            });

            /**
             * sendSimpleForm function.
             * Action à effectuer dès l'envoi du formulaire.
             * @param {boolean} bClearForm Suppression de la structure et des données du formulaire.
             * @param {object} oFormData objet FormData à utiliser.
             * @return {promise}
             **/
            scope.$root["sendSimpleForm"] = function (bClearForm, oFormData) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var sDefinitionForm = envSrvc["sFormDefinitionName"];
                // Paramètres pour le Web Service (nom + contenu des champs de form.).
                if (!goog.isDefAndNotNull(oFormData)) {
                    oFormData = formSrvc["getFormData"](envSrvc["sFormDefinitionName"]);
                }
                // Paramètres du service web.
                var sResourceId = envSrvc["getSectionWebServiceResourceId"]();
                var aResourceId = envSrvc["explodeWebServiceResourceId"](sResourceId);
                var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/" + aResourceId[0], aResourceId[1]);
                // Paramètres du webservice.
                var oElem = oFormData;
                var sPath = "", sRestangularMethod;
                var oParams = {"token": sessionSrvc["token"]};
                var sHeaders = {"Content-Type": undefined};
                //
                var sFormElementName = envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"];
                var formScope = angular.element("form[name='" + sFormElementName + "']").scope();
                if (typeof (formScope[sFormElementName]["appFormSubmitted"]) == "undefined") {
                    formScope[sFormElementName]["appFormSubmitted"] = false;
                }

                // Le formulaire est valide et n'a pas déja été envoyé.
                if (formScope[sFormElementName].$valid && !formScope[sFormElementName]["appFormSubmitted"]) {
                    formScope[sFormElementName]["appFormSubmitted"] = true;
                    if (envSrvc["sMode"] == "update" || envSrvc["sMode"] == "insert") {
                        // Paramètres de Restangular.
                        if (envSrvc["sMode"] == "update") {
                            sPath = envSrvc["sId"];
                            sRestangularMethod = "customPUT";
                        } else
                            sRestangularMethod = "customPOST";

                        // Requête REST.
                        oWebServiceBase[sRestangularMethod](oElem, sPath, oParams, sHeaders)
                                .then(function (data) {
                                    // Suppression de la définition et des données du formulaire ?
                                    if (bClearForm === true)
                                        scope.$root["clearFormData"](sDefinitionForm, scope);
                                    //formSrvc["clearFormData"](sDefinitionForm);
                                    //
                                    if (data["status"] == 1) {
                                        // Affichage du message de succés.
                                        if (scope["bFormValidationMessage"]) {
                                            $translate("FORM_VALIDATION_OK").then(function (sTranslation) {
                                                $.notify(sTranslation, "success");
                                            });
                                        }
                                        // Si mode "insert" -> redirection vers le mode "update".
                                        if (envSrvc["sMode"] == "insert")
                                            envSrvc["sId"] = data[envSrvc["oSelectedObject"]["sIdField"]];
                                        formScope[sFormElementName]["appFormSubmitted"] = false;
                                        deferred.resolve(true);
                                    } else {
                                        // Affichage du message d'erreur.
                                        if (scope["bFormValidationMessage"]) {
                                            // Message d'erreur ?
                                            if (typeof (data["errorMessage"]) != "undefined" && data["errorMessage"] != null)
                                                var sText = data["errorMessage"];
                                            // Paramètres de la fenêtre modale.
                                            var oOptions = {
                                                "className": "modal-danger",
                                                "message": sText,
                                                "callback": function () {
                                                    deferred.reject(false);
                                                }
                                            };
                                            // Affichage de la fenêtre modale.
                                            scope["modalWindow"]("dialog", "FORM_VALIDATION_ERROR", oOptions);
                                        }
                                        formScope[sFormElementName]["appFormSubmitted"] = false;
                                        deferred.resolve(false);
                                    }
                                });
                    }
                } else {
                    deferred.reject(false);
                }
                // Retourne la promesse.
                return promise;
            };
        }
    };
};
vitisApp.module.directive("appSimpleFormFormular", vitisApp.appSimpleFormFormularDrtv);
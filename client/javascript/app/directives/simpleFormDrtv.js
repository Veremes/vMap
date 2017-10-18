/* global vitisApp */
'use strict';

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
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} externFunctionSrvc Fonctions externes à Angular.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} formSrvc Service de gestion des formulaires.
 * @ngInject
 **/
vitisApp.appSimpleFormFormularDrtv = function ($timeout, $translate, $q, envSrvc, externFunctionSrvc, propertiesSrvc, formSrvc) {
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
                        // Paramètres de la requête.
                        var sRequestUrl = propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/" + aResourceId[0] + "/" + aResourceId[1];
                        var sRequestMethod;
                        if (envSrvc["sMode"] == "update") {
                            sRequestMethod = "PUT";
                            sRequestUrl += "/" + envSrvc["sId"];
                        }
                        else
                            sRequestMethod = "POST";
                        // Requête Ajax de création ou mise à jour d'un enregistrement.
                        ajaxRequest({
                            "method": sRequestMethod,
                            "url": sRequestUrl,
                            "data": oFormData,
                            "scope": scope,
                            "success": function(response){
                                // Suppression de la définition et des données du formulaire ?
                                if (bClearForm === true)
                                    scope.$root["clearFormData"](sDefinitionForm, scope);
                                //
                                if (response["data"]["status"] == 1) {
                                    // Affichage du message de succés.
                                    if (scope["bFormValidationMessage"]) {
                                        $translate("FORM_VALIDATION_OK").then(function (sTranslation) {
                                            $.notify(sTranslation, "success");
                                        });
                                    }
                                    // Si mode "insert" -> redirection vers le mode "update".
                                    if (envSrvc["sMode"] == "insert")
                                        envSrvc["sId"] = response["data"][envSrvc["oSelectedObject"]["sIdField"]];
                                    formScope[sFormElementName]["appFormSubmitted"] = false;
                                    deferred.resolve(true);
                                }
                                else {
                                    // Affichage du message d'erreur.
                                    if (scope["bFormValidationMessage"]) {
                                        // Message d'erreur ?
                                        if (typeof (response["data"]["errorMessage"]) != "undefined" && response["data"]["errorMessage"] != null)
                                            var sText = response["data"]["errorMessage"];
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
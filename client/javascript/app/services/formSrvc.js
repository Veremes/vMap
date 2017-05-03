/* global goog, vitisApp */

// Google closure
goog.provide("vitis.services.form");
goog.require('vitis');

/**
 * formSrvc service.
 * Service de gestion des formulaires.
 * @param {service} $translate Translate service.
 * @param {angular.$rootScope} $rootScope Angular rootScope.
 * @param {service} Restangular Service Restangular.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} sessionSrvc Service de gestion des sessions.
 * @param {service} externFunctionSrvc Fonctions externes à Angular.
 * @ngInject
 * @constructor
 **/
vitisApp.formSrvc = function ($translate, $rootScope, Restangular, envSrvc, propertiesSrvc, sessionSrvc, externFunctionSrvc, formReaderService) {
    return {
        /**
         * getFormData function.
         * Retourne l'objet FormData (ensemble de paires clef-valeur) d'un formulaire.
         * @param {string} sFormDefinitionName Nom du formulaire.
         * @param {boolean} bReturnJson Retourne les clés/valeurs des champs du formulaire dans un objet json.
         * @param {object} opt_options
         * @param {object|undefined} opt_options.oFormDefinition default is envSrvc.oFormDefinition
         * @param {object|undefined} opt_options.oFormValues default is envSrvc.oFormValues
         * @param {array|undefined} opt_options.aParamsToSave default is empty
         **/
        "getFormData": function (sFormDefinitionName, bReturnJson, opt_options) {
            if (!goog.isDefAndNotNull(opt_options)) {
                opt_options = {};
            }
            var oFormDefinition = goog.isDefAndNotNull(opt_options['oFormDefinition']) ? opt_options['oFormDefinition'] : envSrvc['oFormDefinition'];
            var oFormValues = goog.isDefAndNotNull(opt_options['oFormValues']) ? opt_options['oFormValues'] : envSrvc['oFormValues'];
            var aParamsToSave = goog.isDefAndNotNull(opt_options['aParamsToSave']) ? opt_options['aParamsToSave'] : [];
            var aFormRowElementsList, aSelectOptions, aSelectedOptions;
            var aFormStructure = oFormDefinition[sFormDefinitionName]["rows"];
            var aFormValues = oFormValues[sFormDefinitionName];
            var iOptionIndex, ifieldIndex, iRowIndex = 0;
            var oFormKeysValues = {};
            var oFormData;
            while (iRowIndex < aFormStructure.length) {
                // Plusieurs champs par ligne ?
                aFormRowElementsList = aFormStructure[iRowIndex]["fields"];
                ifieldIndex = 0;
                while (ifieldIndex < aFormRowElementsList.length) {
                    if (typeof (aFormRowElementsList[ifieldIndex]) != 'undefined') {

                        switch (aFormRowElementsList[ifieldIndex]["type"]) {
                            // Upload de fichiers ?
                            case "upload":
                            case "file_wsdata":
                            case "image_wsdata":
                                if (document.getElementById(aFormRowElementsList[ifieldIndex]["id"]) != null) {
                                    var bContainFiles = true;
                                    var oFiles = document.getElementById(aFormRowElementsList[ifieldIndex]["id"]).files;
                                    if (goog.isDefAndNotNull(oFiles)) {
                                        if (oFiles.length > 0) {
                                            oFormKeysValues[aFormRowElementsList[ifieldIndex]["name"]] = oFiles[0];
                                        } else {
                                            bContainFiles = false;
                                        }
                                    } else {
                                        bContainFiles = false;
                                    }

                                    if (!bContainFiles) {
                                        var oElemValue = aFormValues[aFormRowElementsList[ifieldIndex]["name"]];
                                        if (goog.isDefAndNotNull(oElemValue)) {
                                            if (goog.isDefAndNotNull(oElemValue['aFiles'])) {
                                                if (goog.isDefAndNotNull(oElemValue['aFiles'][0])) {
                                                    oFormKeysValues[aFormRowElementsList[ifieldIndex]["name"]] = oElemValue['aFiles'][0];
                                                }
                                            }
                                        }
                                    }
                                }
                                break;
                                // Si double liste : valeurs séparé par un champ.
                            case "double_select":
                                aSelectOptions = aFormValues[aFormRowElementsList[ifieldIndex]["name"]];
                                if (typeof (aSelectOptions) != "undefined") {
                                    iOptionIndex = 0;
                                    aSelectedOptions = [];
                                    while (iOptionIndex < aSelectOptions["options"].length) {
                                        aSelectedOptions.push(aSelectOptions["options"][iOptionIndex]["value"]);
                                        iOptionIndex++;
                                    }
                                    oFormKeysValues[aFormRowElementsList[ifieldIndex]["name"]] = aSelectedOptions.join("|");
                                }
                                break;
                                // Si liste : suppression du champ si aucune option est sélectionnée.
                            case "select":
                            case "editable_select":
                                if (goog.isDefAndNotNull(aFormValues[aFormRowElementsList[ifieldIndex]["name"]])) {
                                    var selectedOptionValue = aFormValues[aFormRowElementsList[ifieldIndex]["name"]]["selectedOption"]["value"]
                                    if (typeof (selectedOptionValue) != "undefined" && selectedOptionValue != "?")
                                        oFormKeysValues[aFormRowElementsList[ifieldIndex]["name"]] = selectedOptionValue;
                                }
                                break;
                                // Si liste : suppression du champ si aucune option est sélectionnée.
                            case "list":
                                if (goog.isDefAndNotNull(aFormValues[aFormRowElementsList[ifieldIndex]["name"]])) {
                                    var aSelectOptions = aFormValues[aFormRowElementsList[ifieldIndex]["name"]]["selectedOption"]
                                    if (goog.isArray(aSelectOptions)) {
                                        var aSelectedOptions = [];
                                        for (var i = 0; i < aSelectOptions.length; i++) {
                                            if (goog.isDefAndNotNull(aSelectOptions[i]['value']) && aSelectOptions[i]['value'] != '?') {
                                                aSelectedOptions.push(aSelectOptions[i]['value']);
                                            }
                                        }
                                        oFormKeysValues[aFormRowElementsList[ifieldIndex]["name"]] = aSelectedOptions.join("|");
                                    }
                                }
                                break;
                                // Type de champ à ne pas sauver.
                            case "title":
                            case "subtitle":
                            case "label":
                            case "button":
                                break;
                                //
                            default:
                                if (typeof (aFormValues) != "undefined")
                                    if (aFormValues[aFormRowElementsList[ifieldIndex]["name"]] != null)
                                        oFormKeysValues[aFormRowElementsList[ifieldIndex]["name"]] = aFormValues[aFormRowElementsList[ifieldIndex]["name"]];
                        }
                    }
                    ifieldIndex++;
                }
                iRowIndex++;
            }

            // Retourne un objet json ou un objet "FormData".
            if (bReturnJson === true) {
                oFormData = oFormKeysValues;
                for (var i = 0; i < aParamsToSave.length; i++) {
                    if (!goog.isDefAndNotNull(oFormData[aParamsToSave[i]])) {
                        if (goog.isDefAndNotNull(oFormValues[sFormDefinitionName][aParamsToSave[i]])) {
                            oFormData[aParamsToSave[i]] = oFormValues[sFormDefinitionName][aParamsToSave[i]];
                        }
                    }
                }
            } else {
                // Sauve les clés et valeurs dans un objet "FormData".
                oFormData = new FormData();
                var aFormKeys = Object.keys(oFormKeysValues);
                var i = 0;
                while (i < aFormKeys.length) {
                    oFormData.append(aFormKeys[i], oFormKeysValues[aFormKeys[i]]);
                    i++;
                }
            }
            //
            return oFormData;
        },
        /**
         * setWebServiceSelectOptions function.
         * Crée un objet de libellés et valeurs renvoyés par un web service et formatés pour un <select>.
         * @param {object} oFormElementDefinition Paramètres de definition du <select>.
         * @param {string} sFormDefinitionName Nom du formulaire.
         **/
        "setWebServiceSelectOptions": function (oFormElementDefinition, sFormDefinitionName) {

            formReaderService['setWebServiceSelectOptions'](oFormElementDefinition, sFormDefinitionName, envSrvc["oFormValues"], propertiesSrvc, sessionSrvc["token"]);

        },
        /**
         * setSelectOptions function.
         * Crée un objet de libellés et valeurs pour un <select>.
         * @param {object} oFormElementDefinition Paramètres de definition du <select>.
         * @param {string} sFormDefinitionName Nom du formulaire.
         **/
        "setSelectOptions": function (oFormElementDefinition, sFormDefinitionName) {


            formReaderService['setSelectOptions'](oFormElementDefinition, sFormDefinitionName, envSrvc["oFormValues"]);


        },
        "extractFormDefinitionInfos": function () {


            formReaderService['extractFormDefinitionInfos'](envSrvc['oFormDefinition'][envSrvc['sFormDefinitionName']]['name']);


        },
        /**
         * clearFormData function.
         * Supprime la définition et les données du formulaire spécifié.
         * @param {string} sFormDefinitionName
         **/
        "clearFormData": function (sFormDefinitionName) {
            //envSrvc["oFormValues"][sFormDefinitionName] = null;
            //envSrvc["oFormDefinition"][sFormDefinitionName] = null;
            /*
             envSrvc["oFormValues"][sFormDefinitionName] = {};
             envSrvc["oFormDefinition"][sFormDefinitionName] = {};
             */
        },
        /**
         * reloadSelectField function.
         * Recharge les options du <select> (web service).
         * @param {object} oParentSelect Paramètres de definition du <select> parent.
         * @param {string} sFormDefinitionName Nom du formulaire.
         **/
        "reloadSelectField": function (oParentSelect, sFormDefinitionName) {

            formReaderService['reloadSelectField'](oParentSelect, sFormDefinitionName, envSrvc["oFormValues"], envSrvc["oFormDefinition"]);

        },
        /**
         * getFormElementDefinition function.
         * Retourne la définition d'un élément de form.
         * @param {string} sFormElementName Nom du champ de formulaire.
         * @param {string} sFormDefinitionName Nom du formulaire.
         * @return {object}
         **/
        "getFormElementDefinition": function (sFormElementName, sFormDefinitionName) {

            return formReaderService['getFormElementDefinition'](sFormElementName, sFormDefinitionName, envSrvc["oFormDefinition"]);

        },
        /**
         * getAllFormElementDefinition function.
         * Retourne la définition de tous les éléments de form.
         * @param {string} sFormDefinitionName Nom du formulaire.
         * @return {object}
         **/
        "getAllFormElementDefinition": function (sFormDefinitionName) {

            return formReaderService['getAllFormElementDefinition'](sFormDefinitionName, envSrvc["oFormDefinition"]);

        },
        /**
         * setWebServiceTags function.
         * Crée un objet de libellés et valeurs renvoyés par un web service et formatés pour un champ de "tags".
         * @param {object} oFormElementDefinition Paramètres de definition du <select>.
         * @param {string} sFormDefinitionName Nom du formulaire.
         **/
        "setWebServiceTags": function (oFormElementDefinition, sFormDefinitionName) {


            formReaderService['setWebServiceTags'](oFormElementDefinition, sFormDefinitionName, envSrvc["oFormValues"]);


        },
        /**
         * checkFormModifications function.
         * Vérifie si un formulaire a été modifié et si oui affiche un warning.
         * @param {string} sFormDefinitionName Nom du formulaire.
         * @return {promise}
         **/
        "checkFormModifications": function (sFormDefinitionName) {
            return formReaderService['checkFormModifications'](sFormDefinitionName);
        }
    };
};

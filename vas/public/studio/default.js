/* global angular, goog, vitisApp */

//bloque les delete du destructeur à éviter
//'use strict';

console.info("[FORM_NAME] loaded --> your functions are ready");
/***********************************************************************************
 [FORM_NAME] Javascript
 ***********************************************************************************/

var oFormRequired = {
    "sUrl": "",
    "scope_": {},
    "toDestructor": []
};

/**
 * constructor_form
 * Function called by form init only if javascript boolean is Equal true 
 * @param {type} scope Scope who contain the formreader
 * @param {type} s_url URL of file for destructor
 * @returns {undefined} 
 */
var constructor_form = function (scope, s_url) {
    //////////////////////////////////////////////////////////
    //Don't Edit this Part
    console.log("Constructor");

    oFormRequired.sUrl = s_url;
    oFormRequired.scope_ = scope;
    console.log(scope);
    //////////////////////////////////////////////////////////
    // Push element to Destruct (variable, function, watcher) in oFormRequired.toDestructor

    //*************************************************************************************************
    //Objet de travail Exemple
    //var $timeout = angular.element(vitisApp.appMainDrtv).injector().get(["$timeout"]);
    //var formReaderSrvc = angular.element("[app-form-reader='']").injector().get(["formReaderService"]);
    //var WorkPost = angular.element(vitisApp.appMainDrtv).scope().getWorkObject("signaletique", "post");
    //if (oFormRequired.scope_.sFormDefinitionName.indexOf("insert") > -1) {
    //    $timeout(function () {
    //        if (WorkPost !== false) {
    //            formReaderSrvc["selectOptionAfterLoad"](oFormRequired.scope_.oFormValues,
    //                    formReaderSrvc["getFormElementDefinition"]("post_id", oFormRequired.scope_.sFormDefinitionName, oFormRequired.scope_.oFormDefinition),
    //                    oFormRequired.scope_.sFormDefinitionName,
    //                    "post_id",
    //                    WorkPost);
    //                    
    //            var post_code = oFormRequired.scope_.oFormValues[oFormRequired.scope_.sFormDefinitionName]["post_id"].selectedOption.label;
    //            formReaderSrvc["selectOptionAfterLoad"](oFormRequired.scope_.oFormValues,
    //                    formReaderSrvc["getFormElementDefinition"]("id_com", oFormRequired.scope_.sFormDefinitionName, oFormRequired.scope_.oFormDefinition),
    //                    oFormRequired.scope_.sFormDefinitionName,
    //                    "id_com",
    //                    post_code.split("/")[0]);
    //        }
    //    }, 800);
    //}
    //*************************************************************************************************
    //Champs Conditionnels
    //oFormRequired.toDestructor.push(oFormRequired.scope_.$watch("oFormValues." + oFormRequired.scope_.sFormDefinitionName + ".line_milestone1_id.selectedOption", function (value) {
    //    angular.element("#pict_them1").scope().field.disabled = (goog.isDef(value) && goog.isDefAndNotNull(value.value)) ? true : false;
    //}));
    //oFormRequired.toDestructor.push(oFormRequired.scope_.$watch("oFormValues." + oFormRequired.scope_.sFormDefinitionName + ".pict_them1", function (value) {
    //    angular.element("#line_milestone1_id").attr("disabled", (goog.isDef(value) && value.length > 0) ? true : false);
    //}));
    //*************************************************************************************************
    //Auto Remplissage de champs
    //oFormRequired.toDestructor.push(oFormRequired.scope_.$watch("oFormValues." + oFormRequired.scope_.sFormDefinitionName + ".sign_id.selectedOption", function (value) {
    //    var aCode = [];
    //    if (goog.isDef(oFormRequired.scope_.oFormValues[oFormRequired.scope_.sFormDefinitionName].line_num)) {
    //        aCode = oFormRequired.scope_.oFormValues[oFormRequired.scope_.sFormDefinitionName].line_num.split("/");
    //    }
    //    if (goog.isDef(value))
    //        if (goog.isDef(value.label) && value.label !== aCode[0] + "/" + aCode[1] + "/" + aCode[2])
    //            oFormRequired.scope_.oFormValues[oFormRequired.scope_.sFormDefinitionName].line_num = value.label + "/";
    //}));
    //*************************************************************************************************
    //Comportements différents selon le mode (insert, update, search, display) (GTF : accés uniquement au mode insert)
    //if (oFormRequired.scope_.sFormDefinitionName.indexOf("update") > -1 || oFormRequired.scope_.sFormDefinitionName.indexOf("insert") > -1) {
    //  //Insert Code for UPDATE and INSERT mode
    //}else if (oFormRequired.scope_.sFormDefinitionName.indexOf("search") > -1) {
    //  //Insert Code for SEARCH mode
    //}else {
    //  //Insert code for others mode or error treatment
    //}
};
/**
 * destructor_form
 * Function called before constructor_form of a new form to remove all the watchers, variables, and others objects useless for others forms 
 * @returns {undefined}
 */
var destructor_form = function () {
    console.log("Destructor");

    for (var i = 0; i < oFormRequired.toDestructor.length; i++) {
        oFormRequired.toDestructor[i] = undefined;
        delete oFormRequired.toDestructor[i];
    }

    //remove script Tag for reload javascript if user return on this form
    angular.element('[src="' + oFormRequired.sUrl + '?version=' + oFormRequired.scope_["oProperties"]["build"] + '"]').remove();

    oFormRequired = undefined;
    delete oFormRequired;

    constructor_form = undefined;
    delete constructor_form;
    destructor_form = undefined;
    delete destructor_form;
};
/* global angular, goog, vitisApp */

//bloque les delete du destructeur à éviter
//'use strict';

console.info("Login.js loaded --> your functions are ready");
/***********************************************************************************
 LOGIN Javascript
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
    //////////////////////////////////////////////////////////
    // Push element to Destruct (variable, function, watcher) in oFormRequired.toDestructor   

    // hide signup and forgotten password button if properties not set
    var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
    setTimeout(function () {

        if (propertiesSrvc["password_forgotten"] === "enabled") {
            angular.element("#login_form_fpwd").removeClass("hidden");
        }

        if (propertiesSrvc["sign_up"] === "enabled") {
            angular.element("#login_form_sign_up").removeClass("hidden");
        }

        if (propertiesSrvc["login_remember_me"] === "enabled") {
            angular.element("#login_form_remember_me").parent().removeClass("hidden");
            if (propertiesSrvc["login_remember_me_default"] == true) {
                scope.$applyAsync(function () {
                    scope['oFormValues']['login_form']['remember_me'] = true;
                });
            }
        }

    }, 1);
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
/* global goog */

// Google closure
goog.provide("vitis.directives.htmlForm");

/**
 * appHtmlForm directive.
 * .
 * @param {service} envSrvc Paramètres d'environnement.
 * @ngInject
 * @export
 **/
vitisApp.appHtmlFormDrtv = function (envSrvc) {
    return {
        restrict: 'A',
        controller: 'htmlFormCtrl',
        controllerAs: 'ctrl',
        //scope: true,
        link: function (scope, element, attrs) {
            // Structure et données du formulaire à afficher.
            scope["oFormDefinition"] = envSrvc["oFormDefinition"];
            scope["oFormValues"] = envSrvc["oFormValues"];
            // Bouton "submit" non cliqué.
            scope["submitButton"] = false;
        }
    }
};
vitisApp.module.directive("appHtmlForm", vitisApp.appHtmlFormDrtv);
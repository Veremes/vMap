// Google closure
goog.provide("vitis.directives.init");
goog.require("vitis.modules.main");

/**
 * appInit directive.
 * Charge un template pour l'élément <body> de l'application.
 * @param {service} externFunctionSrvc Fonctions externes à Angular.
 * @ngInject
 * @export
 **/
vitisApp.appInitDrtv = function(externFunctionSrvc) {
        // Supprime le cache de Less.
        externFunctionSrvc["clearLessCache"]();
        // Durée d'affichage des messages de "notify".
        $.notify.defaults({"autoHideDelay": 2000});
        //
        return {
                restrict: 'A',
                controller : 'initCtrl',
                controllerAs : 'ctrl'
        }
};
vitisApp.module.directive("appInit", vitisApp.appInitDrtv);

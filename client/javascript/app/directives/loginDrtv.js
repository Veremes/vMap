// Google closure
goog.provide("vitis.directives.login");
goog.require("vitis.modules.main");

/**
 * appLogin directive.
 * Association du contrôleur à la directive.
 * @export
 **/
vitisApp.appLoginDrtv = function() {
        return {
                restrict: 'A',
                controller : 'loginCtrl',
                controllerAs : 'ctrl'
        }
};
vitisApp.module.directive("appLogin", vitisApp.appLoginDrtv);

/**
 * appLoginForm directive.
 * Charge le template du formulaire de la page login.
 * @param {angular.$timeout} $timeout Angular timeout
 * @param {service} propertiesSrvc Paramètres des properties.
 * @ngInject
 **/
vitisApp.appLoginFormDrtv = function($timeout, propertiesSrvc) {
        return {
                replace: true,
                templateUrl: "templates/formTpl.html",
                link: function (scope, element, attrs) {
                        // Attends le chargement de la structure et des données du formulaire.
                        var clearListener = scope.$root.$on('formDefinitionLoaded', function(event, sFormDefinitionName) {
                                $timeout(function(){
                                        // Si l'application est instable : bouton "submit" désactivé.
                                        if (String(propertiesSrvc["status"]).toLowerCase() == "unstable" || String(propertiesSrvc["VM_STATUS"]).toLowerCase() == "unstable")
                                                document.querySelector("button[type='submit']").disabled = true
                                        // Supprime le "listener".
                                        clearListener();
                                });
                        });
                }
        }
};
vitisApp.module.directive("appLoginForm", vitisApp.appLoginFormDrtv);

/**
 * appLoginForm directive.
 * Charge le template du formulaire de la modal mot d epasse oublié.
 * @ngInject
 **/
vitisApp.appFpwdFormDrtv = function() {
        return {
                replace: true,
                templateUrl: "templates/formTpl.html",
                link: function (scope, element, attrs) {
                        
                }
        };
};
vitisApp.module.directive("appFpwdForm", vitisApp.appFpwdFormDrtv);
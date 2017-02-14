// Google closure
goog.provide("vitis.directives.doubleForm");
goog.require("vitis.modules.main");

/**
 * appDoubleForm directive.
 * Association du contrôleur à la directive.
 * @param {angular.$timeout} $timeout Angular timeout service.
 * @param {service} externFunctionSrvc Fonctions externes à Angular.
 * @param {angular.$rootScope} $rootScope Angular rootScope.
 * @ngInject
 * @export
 **/
vitisApp.appDoubleFormDrtv = function($timeout, $rootScope, externFunctionSrvc) {
        return {
                restrict: 'A',
                controller : 'doubleFormCtrl',
                controllerAs : 'ctrl',
                scope: true,
                replace: true,
                link: function (scope, element, attrs) {
                        // Redimensionnement de la fenêtre (attends Angular)
                        $timeout(function(){
                                // Emission d'un évènement de compilation terminée du template doubleForm.
                                $rootScope.$emit("doubleFormCompiled");
                                //
                                externFunctionSrvc["resizeWin"]();
                        });
                }
        }
};
vitisApp.module.directive("appDoubleForm", vitisApp.appDoubleFormDrtv);

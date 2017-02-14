// Google closure
goog.provide("vitis.directives.main");
goog.require("vitis.modules.main");

/**
 * appMain directive.
 * Association du controller à la directive.
 * @param {angular.$window} $window Angular window service.
 * @param {service} externFunctionSrvc Fonctions externes à Angular.
 * @export
 * @ngInject
 **/
vitisApp.appMainDrtv = function ($window, externFunctionSrvc) {
    return {
        restrict: 'A',
        controller: 'mainCtrl',
        controllerAs: 'ctrl',
        link: function (scope, element, attrs) {

            // Informe l'application que la directive a été chargée
            vitisApp.broadcast('appMainDrtvLoaded');

            // Si redimensionnement de la fenêtre : redimensionne les éléments html principaux.
            $window.onresize = function () {
                externFunctionSrvc["resizeWin"]()
            };
            // Attends la suppression du scope.
            scope.$on("$destroy", function () {
                // Supprime l'évènement.
                $window.onresize = null;
            });
        }
    }
};
vitisApp.module.directive("appMain", vitisApp.appMainDrtv);

/**
 * repeatMode directive.
 * Actions sur le menu des modes.
 * @param {angular.$timeout} $timeout Angular timeout service.
 * @ngInject
 **/
vitisApp.appRepeatModeDrtv = function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            $timeout(function () {
                // Tooltip au survol de la souris.
                $(element).children()["popover"]({
                    "trigger": "hover"
                });
                // Scroll Bar pour le menu des onglets.
                $("#object_column")["mCustomScrollbar"]({
                    "axis": "x",
                    "theme": "dark-thick"
                });
            });
            // Attends la suppression du scope.
            scope.$on("$destroy", function () {
                // Supprime le tooltip.
                $(element).children()["popover"]("destroy");
            });
        }
    }
};
vitisApp.module.directive("repeatMode", vitisApp.appRepeatModeDrtv);
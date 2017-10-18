'use strict';

// Google closure
goog.provide("vitis.directives.mapServerSymbols");
goog.require("vitis.modules.main");

/**
 * appMapServerSymbols directive.
 * .
 * @ngInject
 **/
vitisApp.appMapServerSymbolsDrtv = function() {
    return {
        restrict: 'A',
        controller : 'mapServerSymbolsCtrl',
        controllerAs : 'ctrl',
        scope: true
    }
};
vitisApp.module.directive("appMapServerSymbols", vitisApp.appMapServerSymbolsDrtv);

/**
 * appMapServerSymbolsCollapse directive.
 * Cache toutes les définitions des symboles.
 **/
vitisApp.appMapServerSymbolsCollapseDrtv = function () {
    return {
        replace: true,
        link: function (scope, element, attrs) {
            if (scope["$index"])
                $(element).parent().find(".collapse").collapse('hide');
        }
    }
};
vitisApp.module.directive("appMapServerSymbolsCollapse", vitisApp.appMapServerSymbolsCollapseDrtv);
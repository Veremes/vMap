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
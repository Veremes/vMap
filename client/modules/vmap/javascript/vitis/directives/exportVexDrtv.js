/* global goog, nsVmap, oVmap */


goog.provide('nsVmap.exportVexDrtv');
goog.require('oVmap');

/**
 * Export vex directive
 * @export
 * @ngInject
 */
nsVmap.exportVexDrtv = function () {
    return {
        restrict: 'A',
        controller: 'AppExportVexController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: window['oClientProperties']['vmap_folder'] + '/' + 'template/vitis/exportVex.html',
        link: function (scope, element, attrs, controller) {


        }
    };
};
oVmap.module.directive('appExportVex', nsVmap.exportVexDrtv);
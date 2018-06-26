/* global goog, nsVmap, oVmap */


goog.provide('nsVmap.importVexDrtv');
goog.require('oVmap');

/**
 * Import vex directive
 * @export
 * @ngInject
 */
nsVmap.importVexDrtv = function () {
    return {
        restrict: 'A',
        controller: 'AppImportVexController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: window['oClientProperties']['vmap_folder'] + '/' + 'template/vitis/importVex.html',
        link: function (scope, element, attrs, controller) {

            // File input
            $(element).find('.file')['fileinput']({'showUpload': false, 'showPreview': false, 'mainClass': 'input-group-sm'});

            // Codemirror
            scope['refreshCodeMirror'] = function () {
                setTimeout(function () {
                    $(element).find('.CodeMirror').each(function (i, el) {
                        el['CodeMirror']['refresh']();
                    });
                }, 1000);
            };
        }
    };
};
oVmap.module.directive('appImportVex', nsVmap.importVexDrtv);

/* global goog, nsVmap, oVmap */


goog.provide('nsVmap.importBoDrtv');
goog.require('oVmap');

/**
 * Import bo directive
 * @export
 * @ngInject
 */
nsVmap.importBoDrtv = function () {
    return {
        restrict: 'A',
        controller: 'AppImportBoController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: window['oClientProperties']['vmap_folder'] + '/' + 'template/vitis/importBo.html',
        link: function (scope, element, attrs, controller) {

            // File input
            $(element).find('.file')['fileinput']({'showUpload': false, 'showPreview': false, 'mainClass': 'input-group-sm'});

            // Codemirror
            scope['refreshCodeMirror'] = function () {
                setTimeout(function () {
                    $(element).find('.CodeMirror').each(function (i, el) {
                        el['CodeMirror']['refresh']();
                    });
                });
                setTimeout(function () {
                    $(element).find('.CodeMirror').each(function (i, el) {
                        el['CodeMirror']['refresh']();
                    });
                }, 500);
                setTimeout(function () {
                    $(element).find('.CodeMirror').each(function (i, el) {
                        el['CodeMirror']['refresh']();
                    });
                }, 1000);
            };
        }
    };
};
oVmap.module.directive('appImportBo', nsVmap.importBoDrtv);
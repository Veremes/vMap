'use strict';

// Google closure
goog.provide("vitis.directives.layerTests");
goog.require("vitis.modules.main");

/**
 * appLayerTests directive.
 * .
 * @ngInject
 **/
vitisApp.appLayerTestsDrtv = function() {
    return {
        restrict: 'A',
        controller : 'layerTestsCtrl',
        controllerAs : 'ctrl',
        scope: true,
        link: function (scope, element, attrs) {
            // Hauteur du conteneur des onglets.
            document.querySelector(".layer-test-dialog-modal-window .bootbox-body").style.height = "calc(100% - 3px)";
            // Hauteur du conteneur des onglets.
            element[0].querySelector(".tab-content").style.height = "calc(100% - 46px)";
            // Création de l'élement codeMirror pour le fichier map.
            scope["oMapFileCodeMirrorEditor"] = CodeMirror["fromTextArea"](document.getElementById("layer_map_file_textarea"), {
                "lineNumbers": true,
                "mode":"map",
                "indentUnit": 4,
                "readOnly": "true"
            });
            // Dimensions de l'éditeur CodeMirror.
            scope["oMapFileCodeMirrorEditor"]["setSize"]("100%", "100%");
            // Attends la suppression du scope.
            scope.$on("$destroy", function () {
                // Supprime tous les "listeners" enregistrés.
                if (typeof(scope["aEventKey"]) != "undefined" && scope["aEventKey"].length > 0) {
                    ol.Observable.unByKey(scope["aEventKey"]);
                    scope["aEventKey"].length = 0;
                }
            });
        }
    }
};
vitisApp.module.directive("appLayerTests", vitisApp.appLayerTestsDrtv);
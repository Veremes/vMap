'use strict';

// Google closure
goog.provide("vitis.directives.wmsServiceTests");
goog.require("vitis.modules.main");

/**
 * appWmsServiceTests directive.
 * .
 * @ngInject
 **/
vitisApp.appWmsServiceTestsDrtv = function () {
    return {
        restrict: 'A',
        controller: 'wmsServiceTestsCtrl',
        controllerAs: 'ctrl',
        scope: true,
        link: function (scope, element, attrs) {
            // Hauteur du conteneur des onglets.
            element[0].querySelector(".tab-content").style.height = "calc(100% - 46px)";
            // Création de l'élement codeMirror pour le GetCapabilities.
            var oGetCapabilitiesCmEditor = CodeMirror["fromTextArea"](document.getElementById("wms_service_tests_get_capabilities_textarea"), {
                "lineNumbers": false,
                "mode": "xml",
                "indentUnit": 4
            });
            scope["aWmsServiceTestTabs"]["get_capabilities"]["oCodeMirrorEditor"] = oGetCapabilitiesCmEditor;
            // Dimensions de l'éditeur CodeMirror.
            oGetCapabilitiesCmEditor["setSize"]("100%", "100%");
            // Lance un GetCapabilities (1er onglet affiché).
            scope["showWmsServiceGetCapabilities"]();
            // Création de l'élement codeMirror pour le fichier map.
            var oMapFileCmEditor = CodeMirror["fromTextArea"](document.getElementById("wms_service_tests_wms_service_map_file_textarea"), {
                "lineNumbers": true,
                "mode":"map",
                "indentUnit": 4,
                "readOnly": "true"
            });
            scope["aWmsServiceTestTabs"]["map_file"]["oCodeMirrorEditor"] = oMapFileCmEditor;
            // Dimensions de l'éditeur CodeMirror.
            oMapFileCmEditor["setSize"]("100%", "100%");
            // Attends la suppression du scope.
            scope.$on("$destroy", function () {
                // Supprime tous les "listeners" enregistrés.
                if (typeof (scope["aEventKey"]) != "undefined" && scope["aEventKey"].length > 0) {
                    ol.Observable.unByKey(scope["aEventKey"]);
                    scope["aEventKey"].length = 0;
                }
            });
        }
    }
};
vitisApp.module.directive("appWmsServiceTests", vitisApp.appWmsServiceTestsDrtv);

/**
 * appWmsServiceTestsConnectionForm directive.
 * Charge le template du formulaire de connexion.
 * @param {angular.$templateRequest} $templateRequest Angular templateRequest service.
 * @param {angular.$compile} $compile Angular compile.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @ngInject
 **/
vitisApp.appWmsServiceTestsConnectionFormDrtv = function ($templateRequest, $compile, envSrvc, propertiesSrvc) {
    return {
        replace: true,
        link: function (scope, element, attrs) {
            // Compile le formulaire si le flux WMS est privé.
            if (envSrvc["sId"] == propertiesSrvc["private_wms_service"]) {
                $templateRequest("templates/formTpl.html").then(function (sTemplate) {
                    $compile($(element).html(sTemplate).contents())(scope);
                    // Attends le chargement de la structure et des données du formulaire.
                    var clearListener = scope.$root.$on('formExtracted', function (event, sFormDefinitionName) {
                        // Supprime le listener.
                        clearListener();
                        // Hauteur du conteneur des onglets.
                        element[0].parentNode.parentNode.firstChild.style.height = "Calc(100% - 60px)";
                    });
                });
            }
        }
    }
};
vitisApp.module.directive("appWmsServiceTestsConnectionForm", vitisApp.appWmsServiceTestsConnectionFormDrtv);
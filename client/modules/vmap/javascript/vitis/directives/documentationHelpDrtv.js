// Google closure
goog.provide("vitis.directives.documentationHelp");
goog.require("vitis.modules.main");

/**
 * appDocumentationHelp directive.
 * Association du contrôleur à la directive.
 * @export
 **/
vitisApp.appDocumentationHelpDrtv = function() {
        return {
                restrict: 'A',
                controller : 'documentationHelpCtrl',
                controllerAs : 'ctrl',
                link: function (scope, element, attrs) {
//                        // Affiche le loader ajax.
//                        showAjaxLoader();
//                        // Cache le loader ajax à la fin du chargement.
//                        element[0].onload = hideAjaxLoader;
                }
        }
};
vitisApp.module.directive("appDocumentationHelp", vitisApp.appDocumentationHelpDrtv);

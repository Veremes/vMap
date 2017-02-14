// Google closure
goog.provide("vitis.directives.webServiceHelp");
goog.require("vitis.modules.main");

/**
 * appWebServiceHelp directive.
 * Association du contrôleur à la directive.
 * @export
 **/
vitisApp.appWebServiceHelpDrtv = function() {
        return {
                restrict: 'A',
                controller : 'webServiceHelpCtrl',
                controllerAs : 'ctrl',
                link: function (scope, element, attrs) {
                        // Affiche le loader ajax.
                        showAjaxLoader();
                        element[0].onload = function(){
                                // Supprime l'entête.
                                var oHeaderElement = element[0].contentDocument.querySelector("header");
                                oHeaderElement.parentNode.removeChild(oHeaderElement);
                                // Cache le loader ajax à la fin du chargement.
                                hideAjaxLoader();
                        };
                }
        }
};
vitisApp.module.directive("appWebServiceHelp", vitisApp.appWebServiceHelpDrtv);

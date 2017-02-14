// Google closure
goog.provide("vitis.directives.versionConfiguration");
goog.require("vitis.modules.main");

/**
 * appVersionConfiguration directive.
 * Association du contrôleur à la directive.
 * @export
 **/
vitisApp.appVersionConfigurationDrtv = function() {
        return {
                restrict: 'A',
                controller : 'versionConfigurationCtrl',
                controllerAs : 'ctrl'
        }
};
vitisApp.module.directive("appVersionConfiguration", vitisApp.appVersionConfigurationDrtv);

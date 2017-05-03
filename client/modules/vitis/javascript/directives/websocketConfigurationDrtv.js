// Google closure
goog.provide("vitis.directives.websocketConfiguration");
goog.require("vitis.modules.main");

/**
 * appWebsocketConfiguration directive.
 * Association du contrôleur à la directive.
 * @export
 **/
vitisApp.appWebsocketConfigurationDrtv = function () {
    return {
        restrict: 'A',
        controller: 'websocketConfigurationCtrl',
        controllerAs: 'ctrl'
    };
};
vitisApp.module.directive("appWebsocketConfiguration", vitisApp.appWebsocketConfigurationDrtv);

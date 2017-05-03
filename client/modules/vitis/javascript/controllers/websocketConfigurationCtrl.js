// Google closure
goog.provide("vitis.controllers.websocketConfiguration");
goog.require("vitis.modules.main");

/**
 * websocketConfiguration Controller.
 * Chargement des données de la version.
 * @param {angular.$log} $log Angular log service.
 * @param {angular.$scope} $scope Angular scope.
 * @param {angular.$translate} $translate Angular $translate.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @ngInject
 **/
vitisApp.websocketConfigurationCtrl = function ($log, $scope, $translate, propertiesSrvc) {
    // Initialisation
    $log.info("initWebsocketConfiguration");

    var this_ = this;

    this.$log = $log;
    this.$scope = $scope;
    this.$translate = $translate;
    this['propertiesSrvc'] = propertiesSrvc;

    this.boolean1 = false;
    this.boolean2 = false;

    $scope['sWebSocketUrl'] = 'wss://' + location.host + '/' + propertiesSrvc['websocket_alias'] + '/';
    $scope['oServerInfos'] = null;

    // S'inscrit au service WebSocket Status
//    if (goog.isDefAndNotNull(vitisApp['oWebsocket'])) {
//        vitisApp['oWebsocket'].subscribeService('Status');
//    }

    vitisApp['oWebsocket'].on('serverInfo', function (oResult) {
        this_.$scope.$applyAsync(function () {
            this_.boolean2 = false;
            this_.$scope['oServerInfos'] = oResult;
            if (this_.boolean1) {
                $translate(["WEBSOCKET_INFOS_REFRESHED_CONFIGURATION"]).then(function (oTranslations) {
                    $.notify(oTranslations["WEBSOCKET_INFOS_REFRESHED_CONFIGURATION"], 'success');
                });
            }
        });
    });
};

/**
 * Refresh the websocket server infos
 * @export
 */
vitisApp.websocketConfigurationCtrl.prototype.reloadWebsocketStatus = function () {
    this.$log.info("websocketConfigurationCtrl.reloadWebsocketStatus");

    var this_ = this;

    this.boolean1 = true;
    this.boolean2 = true;

    vitisApp['oWebsocket'].send_('serverInfo', '', 'Status');

    setTimeout(function () {
        if (this_.boolean2) {
            this_.$translate(["WEBSOCKET_NO_SERVER_RESPONSE_CONFIGURATION"]).then(function (oTranslations) {
                $.notify(oTranslations["WEBSOCKET_NO_SERVER_RESPONSE_CONFIGURATION"], 'error');
            });
            this_.$scope.$applyAsync(function () {
                this_.$scope['oServerInfos'] = null;
            });
        }
    }, 2000);
};

/**
 * Refresh the websocket server clients
 * @export
 */
vitisApp.websocketConfigurationCtrl.prototype.refreshClients = function () {
    this.$log.info("websocketConfigurationCtrl.refreshClients");
    vitisApp['oWebsocket'].send_('refreshClients', 'refreshClients');

    var this_ = this;
    var connectedOnce = false;
    vitisApp['oWebsocket'].on('connect', function (oResult) {
        if (!connectedOnce) {
            setTimeout(function () {
                this_.$translate(["WEBSOCKET_USERS_RECONNECTED_CONFIGURATION"]).then(function (oTranslations) {
                    $.notify(oTranslations["WEBSOCKET_USERS_RECONNECTED_CONFIGURATION"], 'success');
                });
                setTimeout(function () {
                    this_.reloadWebsocketStatus();
                }, 1000);
            }, 500);
        }
        connectedOnce = true;
    });
};

vitisApp.module.controller("websocketConfigurationCtrl", vitisApp.websocketConfigurationCtrl);



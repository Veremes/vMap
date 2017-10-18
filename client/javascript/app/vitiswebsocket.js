
/* global MozWebSocket, goog */

goog.provide('vitis.VitisWebsocket');

var VitisWebsocket = function (url) {

    var this_ = this;

    /**
     * @param {string} url Websocket service url
     */
    this.url = url;

    /**
     * @param {object} callbacks callbacks
     */
    this.callbacks = {};

    /**
     * @param {WebSocket|MozWebSocket} conn connection to the websocket
     */
    this.conn;

    /**
     * True if you want to try reconnection when disconnect
     */
    this.tryReconnect = true;

    /**
     * @private
     */
    this.isConnected_ = false;

    /**
     * Timeout de reconnection (tentative de reconnection toutes les reconnectTimeout_ milisecondes)
     */
    this.reconnectTimeout_ = 5000;

    /**
     * Timeout de connection (si l'ordinateur est débranché du réseau par exemple)
     */
    this.connectionTimeout_ = 30000;

    // Connecte la webSocket
    this.connect();

    // Vérifie la connection de la websocket en fonction de connectionTimeout_
    this.watchConnection_();

    // Réception d'un événement
    this.on('reconnectClient', function () {
        this_.send_('reconnectClient', sessionStorage['user_id']);
    });

};

/**
 * Bind an event
 * @param {string} event_name (message, connect, disconnect)
 * @param {string} callback
 * @returns {VitisWebsocket}
 * @export
 */
VitisWebsocket.prototype.on = function (event_name, callback) {
    this.callbacks[event_name] = this.callbacks[event_name] || [];
    this.callbacks[event_name].push(callback);
    return this;// chainable
};

/**
 * Send
 * @param {string} action
 * @param {string} data
 * @param {string|undefined} service
 */
VitisWebsocket.prototype.send_ = function (action, data, service) {

    var mymessage;

    if (goog.isDefAndNotNull(service)) {
        mymessage = {
            'service': service,
            'action': action,
            'data': data
        };
    } else {
        mymessage = {
            'action': action,
            'data': data
        };
    }
    this.conn.send(JSON.stringify(mymessage));
};

/**
 * Subscribe to a service
 * @param {string} service
 * @export
 */
VitisWebsocket.prototype.subscribeService = function (service) {

    var this_ = this;

    var sendSubscribe = function () {
        this_.send_('subscribe', sessionStorage['user_id'], service);
    };

    if (this.conn.readyState === this.conn.OPEN) {
        sendSubscribe();
        this.on('connect', function () {
            sendSubscribe();
        });
    }
    if (this.conn.readyState === this.conn.CONNECTING) {
        this.on('connect', function () {
            sendSubscribe();
        });
    }

};

/**
 * Get if the websocket is connected
 * @returns {Boolean}
 * @export
 */
VitisWebsocket.prototype.isConnected = function () {
    return this.conn.readyState === this.conn.OPEN;
};

/**
 * Send a message to all the connected users
 * @param {string} msg
 * @export
 */
VitisWebsocket.prototype.sendMessage = function (msg) {
    this.send_('echo', msg);
};

/**
 * Send an event to all the connected users
 * @param {string} event_name event name
 * @export
 */
VitisWebsocket.prototype.sendEvent = function (event_name) {
    this.send_('event', event_name);
};

/**
 * Send a ping to the server
 * @export
 */
VitisWebsocket.prototype.sendPing = function () {
    this.send_('ping', '');
};

/**
 * Connect the websocket
 * @export
 */
VitisWebsocket.prototype.connect = function () {

    var this_ = this;

    if (typeof (MozWebSocket) === 'function')
        this.conn = new MozWebSocket(this.url);
    else
        this.conn = new WebSocket(this.url);

    // dispatch les événements
    this.conn.onmessage = function (evt) {

        var oResult, sResult;

        try {
            oResult = JSON.parse(evt.data);
        } catch (e) {
            sResult = evt.data;
        }

        if (goog.isDefAndNotNull(oResult)) {
            if (goog.isDefAndNotNull(oResult['action'])) {
                this_.dispatch_(oResult['action'], oResult['data']);
            }
        }

        if (goog.isDefAndNotNull(sResult)) {
            this_.dispatch_('message', sResult);
        }
    };

    // Deconnection
    this.conn.onclose = function () {
        this.isConnected_ = false;
        this_.dispatch_('disconnect', null);

        if (this_.tryReconnect) {
            setTimeout(function () {
                this_.connect();
            }, this_.reconnectTimeout_);
        }
    };

    // Connection avec le user_id
    this.conn.onopen = function () {
        this_.send_('connect', sessionStorage['user_id']);
    };

    this.on('connect', function (sReturn) {
        this.isConnected_ = true;
    });
};

/**
 * Disconect the websocket
 * @export
 */
VitisWebsocket.prototype.disconnect = function () {
    this.conn.close();
};

/**
 * Dispatch an event
 * @param {string} event_name
 * @param {string} message
 * @private
 */
VitisWebsocket.prototype.dispatch_ = function (event_name, message) {
    var chain = this.callbacks[event_name];
    if (typeof chain === 'undefined')
        return; // no callbacks for this event
    for (var i = 0; i < chain.length; i++) {
        chain[i](message);
    }
};

/**
 * Check the connection eatch this.connectionTimeout_ and disconnect the websocket
 * if the connection is not avaliable any more
 * @private
 */
VitisWebsocket.prototype.watchConnection_ = function () {

    var this_ = this;
    var pingReturned_;

    // Réception d'un ping
    this.on('ping', function () {
        pingReturned_ = true;
    });

    var checkConnection = function () {
        setTimeout(function () {

            // Le client pense qu'il est connecté
            if (goog.isDefAndNotNull(this_.conn.readyState) && goog.isDefAndNotNull(this_.conn.OPEN)) {
                if (this_.conn.readyState === this_.conn.OPEN) {

                    pingReturned_ = false;

                    // envoi un ping
                    this_.sendPing();

                    setTimeout(function () {

                        // Le client n'est en fait pas connecté
                        if (pingReturned_ === false) {
                            console.error('WebSocket connection broken');
                            this_.disconnect();
                        } else {
                            this_.isConnected_ = true;
                        }
                    }, 1000);
                }
            }

            checkConnection();
        }, this_.connectionTimeout_);
    };
    checkConnection();
};
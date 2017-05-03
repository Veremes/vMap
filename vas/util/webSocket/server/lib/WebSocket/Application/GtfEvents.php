<?php

namespace WebSocket\Application;

/**
 * Websocket-Server Service for dealing with GtfEvents
 * @author Armand Bahi <armand.bahi@veremes.com>
 */
class GtfEvents {

    private $_aClients = array();

    /**
     * Class constructor
     * @param object $_oVitisApp
     */
    function __construct($_oVitisApp) {
        $this->_oVitisApp = $_oVitisApp;
    }
    
    /**
     * Get the service clients
     * @return array
     */
    public function getClients() {
        return $this->_aClients;
    }

    /**
     * Remove the client from the lists
     * @param object $client
     */
    public function onDisconnect($client) {        
        $id = $client->getClientId();
        if (isset($this->_aClients[$id])) {
            unset($this->_aClients[$id]);
        }
    }

    /**
     * Add the client to the class $_aClients list
     * @param object $client
     */
    public function _actionSubscribe($decodedData, $client) {
        $sUserId = $decodedData['data'];
        $client->user_id = $sUserId;
        $id = $client->getClientId();
        $this->_aClients[$id] = $client;
        $encodedData = $this->_oVitisApp->_encodeData('subscribe', 'GtfEvents');
        $client->send($encodedData);
    }

    /**
     * Emit an "event" to the users defined in $decodedata.users and present in $this->_aClients.
     * If $decodedata.users not defined, send to all the users defined in $this->_aClients.
     * @param array $decodedData
     * @param object $client
     */
    public function _actionEvent($decodedData) {
        if (isset($decodedData['users'])) {
            $this->_oVitisApp->_sendToUsers('event', $decodedData['data'], $this->_aClients, $decodedData['users']);
        } else {
            $this->_oVitisApp->_sendToUsers('event', $decodedData['data'], $this->_aClients);
        }
    }

}

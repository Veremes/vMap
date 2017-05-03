<?php

namespace WebSocket\Application;

/**
 * Websocket-Server 
 * @author Armand Bahi <armand.bahi@veremes.com>
 */
class VitisApplication extends Application {

    private $_aClients = array();
    private $_aServices = array();
    private $_serverInfo = array();
    private $_serverObject = null;

    /**
     * Add the client to the default $_aClients list
     * @param object $client
     */
    public function onConnect($client) {
        
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
        // Deconnecte l'utilisateur des services
        foreach ($this->_aServices as $sServiceName => $oService) {
            if (method_exists($oService, 'onDisconnect')) {
                $oService->onDisconnect($client);
            }
        }
    }

    /**
     * Set the server info
     * @param array $serverInfo
     */
    public function setServerInfo($serverInfo) {
        if (is_array($serverInfo)) {
            $this->_serverInfo = $serverInfo;
            return true;
        }
        return false;
    }

    /**
     * Get the server info
     * @return array
     */
    public function getServerInfo() {
        return $this->_serverInfo;
    }

    /**
     * Set the server object
     * @param array $serverObject
     */
    public function setServerObject($serverObject) {
        if (isset($serverObject)) {
            $this->_serverObject = $serverObject;
            return true;
        }
        return false;
    }

    /**
     * Get the server object
     * @return array
     */
    public function getServerObject() {
        return $this->_serverObject;
    }

    /**
     * Get the VitisApplication clients
     * @return array
     */
    public function getClients() {
        return $this->_aClients;
    }

    /**
     * Get the VitisApplication services
     * @return array
     */
    public function getServices() {
        return $this->_aServices;
    }

    /**
     * Query all the clients to refresh this->_clients
     */
    public function refreshClients() {
        $aTmpClients = $this->_aClients;
        foreach ($this->_aClients as $client) {
            $id = $client->getClientId();
            if (isset($this->_aClients[$id])) {
                unset($this->_aClients[$id]);
            }
        }
        $this->reconnectClients($aTmpClients);
    }

    /**
     * Query all the clients
     * @param array $aClients
     */
    public function reconnectClients($aClients) {
        $this->_sendToUsers('reconnectClient', 'reconnectClient', $aClients);
    }

    /**
     * Called when recived a message
     * @param string $sData
     * @param object $client
     */
    public function onData($sData, $client) {
        $aData = $this->_decodeData($sData);

        if (!empty($aData['action'])) {
            $actionName = '_action' . ucfirst($aData['action']);

            // S'agit-il d'une action sur un service ?
            if (!empty($aData['service'])) {

                // Intancie la classe ci cela n'a pas été déja fait
                if (!isset($this->_aServices[$aData['service']])) {
                    $sClass = '\WebSocket\Application\\' . $aData['service'];
                    $this->_aServices[$aData['service']] = new $sClass($this);
                }

                // Apelle la fonction désirée
                if (isset($this->_aServices[$aData['service']])) {
                    if (method_exists($this->_aServices[$aData['service']], $actionName)) {
                        call_user_func_array(array($this->_aServices[$aData['service']], $actionName), array($aData, $client));
                    }
                }
            } else {

                // Action sur le service VitisApplication
                if (method_exists($this, $actionName)) {
                    call_user_func_array(array($this, $actionName), array($aData, $client));
                }
            }
        }
    }

    /**
     * Connect the user to $_aClients
     * @param array $decodedData
     * @param object $client
     */
    private function _actionConnect($decodedData, $client) {

        $clientId = $client->getClientId();
        $clientIp = $client->getClientIp();
        $clientPort = $client->getClientPort();
        $sUserId = $decodedData['data'];

        $client->client_id = $clientId;
        $client->client_ip = $clientIp;
        $client->client_port = $clientPort;
        $client->user_id = $sUserId;
        $client->connection_date = date("Y-m-d H:i:s");

        $this->_aClients[$clientId] = $client;

        $encodedData = $this->_encodeData('connect', json_encode($client));
        $client->send($encodedData);
    }

    /**
     * Emit an "echo" to the users defined in $decodedata.users and present in $this->_aClients.
     * If $decodedata.users not defined, send to all the users defined in $this->_aClients.
     * @param array $decodedData
     * @param object $client
     */
    private function _actionEcho($decodedData) {
        if (isset($decodedData['users'])) {
            $this->_sendToUsers('echo', $decodedData['data'], $this->_aClients, $decodedData['users']);
        } else {
            $this->_sendToUsers('echo', $decodedData['data'], $this->_aClients);
        }
    }

    /**
     * Emit a "ping" action to the applicant user
     * @param type $decodedData
     * @param type $client
     */
    private function _actionPing($decodedData, $client) {
        $encodedData = $this->_encodeData('ping', 'pong');
        $client->send($encodedData);
    }

    /**
     * Run the connect action for a specific client
     * @param type $decodedData
     * @param type $client
     */
    private function _actionReconnectClient($decodedData, $client) {
        $this->_actionConnect($decodedData, $client);
    }

    /**
     * Emit a "whoami" action to the applicant user
     * @param type $decodedData
     * @param type $client
     */
    private function _actionWhoami($decodedData, $client) {
        $encodedData = $this->_encodeData('whoami', $client);
        $client->send($encodedData);
    }

    /**
     * Query all the connected clients to refresh this->_clients
     * @param type $decodedData
     * @param type $client
     */
    private function _actionRefreshClients($decodedData, $client) {
        $this->refreshClients();
    }

}

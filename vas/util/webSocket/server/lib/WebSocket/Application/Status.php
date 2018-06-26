<?php

namespace WebSocket\Application;

/**
 * Websocket-Server Service for dealing with Status
 * @author Armand Bahi <armand.bahi@veremes.com>
 */
class Status {

//    private $_aClients = array();

    /**
     * Class constructor
     * @param object $_oVitisApp
     */
    function __construct($_oVitisApp) {
        $this->_oVitisApp = $_oVitisApp;
        $this->_oServer = $this->_oVitisApp->getServerObject();
    }

    /**
     * Get the service clients
     * @return array
     */
//    public function getClients() {
//        return $this->_aClients;
//    }

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
//    public function _actionSubscribe($decodedData, $client) {
//        $sUserId = $decodedData['data'];
//        $client->user_id = $sUserId;
//        $id = $client->getClientId();
//        $this->_aClients[$id] = $client;
//        $encodedData = $this->_oVitisApp->_encodeData('subscribe', 'Status');
//        $client->send($encodedData);
//    }

    /**
     * Get the server infos
     * @param type $decodedData
     * @param type $client
     */
    public function _actionServerInfo($decodedData, $client) {
        $currentServerInfo = $this->_oVitisApp->getServerInfo();
        $currentServerInfo['clientCount'] = count($this->_oVitisApp->getClients());
        $currentServerInfo['clients'] = $this->_oVitisApp->getClients();

        // Infos des Services actifs
        $currentServerInfo['activeServices'] = array();
        $aServices = $this->_oVitisApp->getServices();
        foreach ($aServices as $sServiceName => $oService) {
            $currentServerInfo['activeServices'][$sServiceName] = array();
            if (method_exists($oService, 'getClients')) {
                $currentServerInfo['activeServices'][$sServiceName]['clients'] = $oService->getClients();
                $currentServerInfo['activeServices'][$sServiceName]['clientCount'] = count($oService->getClients());
            }
        }

        $encodedData = $this->_oVitisApp->_encodeData('serverInfo', $currentServerInfo);
        $client->send($encodedData);
    }

    public function _actionRestartServer($decodedData, $client) {
        // To do
    }
}

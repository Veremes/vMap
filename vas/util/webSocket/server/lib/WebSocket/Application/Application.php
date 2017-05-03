<?php

namespace WebSocket\Application;

/**
 * WebSocket Server Application
 * 
 * @author Nico Kaiser <nico@kaiser.me>
 * @author Armand Bahi <armand.bahi@veremes.com>
 */
abstract class Application {

    protected static $instances = array();

    /**
     * Singleton 
     */
    protected function __construct() {
        
    }

    final private function __clone() {
        
    }

    final public static function getInstance() {
        $calledClassName = get_called_class();
        if (!isset(self::$instances[$calledClassName])) {
            self::$instances[$calledClassName] = new $calledClassName();
        }

        return self::$instances[$calledClassName];
    }

    abstract public function onConnect($connection);

    abstract public function onDisconnect($connection);

    abstract public function onData($data, $client);

    // Common methods:

    public function _decodeData($data) {
        $decodedData = json_decode($data, true);
        if ($decodedData === null) {
            return false;
        }

        if (empty($decodedData['action'])) {
            return false;
        }

        return $decodedData;
    }

    public function _encodeData($sAction, $sData) {
        if (empty($sAction)) {
            return false;
        }

        $payload = array(
            'action' => $sAction,
            'data' => $sData
        );

        return json_encode($payload);
    }

    public function _sendToUsers($sAction, $sData, $aClientsList = null, $aUserIds = null) {
        
        if (empty($sAction)) {
            return false;
        }
        if (empty($sData)) {
            return false;
        }
        if (empty($aClientsList)) {
            return false;
        }

        $encodedData = $this->_encodeData($sAction, $sData);

        // Envoi à certains utilisateurs
        if (isset($aUserIds)) {
            if (is_array($aUserIds)) {
                foreach ($aClientsList as $sendto) {
                    if (in_array($sendto->user_id, $aUserIds)) {
                        $sendto->send($encodedData);
                    }
                }
            }
        }
        // Envoi à tous les utilisateurs
        else {
            foreach ($aClientsList as $sendto) {
                $sendto->send($encodedData);
            }
        }
    }
}

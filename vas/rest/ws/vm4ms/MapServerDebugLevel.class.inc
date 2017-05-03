<?php

require_once 'Vmap4MapServer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file MapServerDebugLevel.class.inc
 * \class MapServerDebugLevel
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the MapServerDebugLevel php class
 *
 * This class defines operation for one MapServerDebugLevel
 * 
 */
class MapServerDebugLevel extends Vmap4MapServer {

    public $oError;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $oConnection) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
        $this->aSelectedFields = Array('msdebuglevel_id', 'label_id', 'translation');
    }

    /**
     * get informations about mapserverdebuglevel
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vm4ms'], "v_msdebuglevel", "msdebuglevel_id");
    }

}

?>
<?php

require_once 'Vmap4MapServer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file PrivateWmsServiceLayer.class.inc
 * \class PrivateWmsServiceLayer
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Private WmsServiceLayer php class
 *
 * This class defines operation for one private wms service layer
 * 
 */
class PrivateWmsServiceLayer extends Vmap4MapServer {

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
		$this->aSelectedFields = Array("ms_layer_id", "name", "title", "active", "opacity");
    }

    /**
     * get informations about wms service layer
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vm4ms'], 'v_private_ms_layer', 'ms_layer_id');
    }

    /**
     * delete a wms service layer
     */
    function DELETE(){
    }
}

?>
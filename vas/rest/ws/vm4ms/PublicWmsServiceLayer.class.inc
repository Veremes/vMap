<?php

require_once 'Vmap4MapServer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file PublicWmsServiceLayer.class.inc
 * \class PublicWmsServiceLayer
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Public WmsServiceLayer php class
 *
 * This class defines operation for one public wms service layer
 * 
 */
class PublicWmsServiceLayer extends Vmap4MapServer {

    public $oError;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $bShortcut false to reinit variables
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        parent::__construct($aPath, $aValues, $properties, $bShortcut, $oConnection);
        $this->aSelectedFields = Array("ms_layer_id", "name", "title", "active", "wmsservice_id", "opacity");
    }

    /**
     * get informations about wms service layer
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vm4ms'], 'v_public_wms_service_ms_layer', 'wmsservice_id');
    }

    /**
     * delete a wms service layer
     */
    function DELETE() {
        
    }

}

?>
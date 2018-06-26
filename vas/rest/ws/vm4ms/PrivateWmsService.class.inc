<?php

require_once 'Vmap4MapServer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file PrivateWmsService.class.inc
 * \class PrivateWmsService
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the PrivateWmsService php class
 *
 * This class defines operation for one private wms service
 * 
 */
class PrivateWmsService extends Vmap4MapServer {

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
        $this->aSelectedFields = Array("wmsservice_id", "description", "definition", "web_id", "web_name", "msdebuglevel_id");
    }

    /**
     * get informations about private wms service
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vm4ms'], 'v_private_wms_service', 'wmsservice_id');
        $this->aFields['wms_service_url'] = $this->aProperties["ms_cgi_url"] . '/private/[token]';
    }

    /**
     * delete a private wms service
     */
    function DELETE() {
        require $this->sRessourcesFile;
        $this->oConnection->oBd->delete($this->aProperties['schema_vm4ms'], 'wmsservice', 'wmsservice_id', $this->aValues['my_vitis_id'], 'string');
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
            $this->aFields['wmsservice_id'] = $this->aValues['my_vitis_id'];
        }
    }

}

?>
<?php

require_once 'Vmap4MapServer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file WmsService.class.inc
 * \class WmsService
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the WmsService php class
 *
 * This class defines operation for one wms service
 * 
 */
class WmsService extends Vmap4MapServer {

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
        $this->aSelectedFields = Array("wmsservice_id", "description", "definition", "web_id", "web_name");
    }

    /**
     * @SWG\Get(path="/wmsservices/{wmsservice_id}",
     *   tags={"WmsServices"},
     *   summary="Get Wms Service",
     *   description="Request to get wms service by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="wmsservice_id",
     *     in="path",
     *     description="wmsservice id",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/wmsservices")
     *     )
     *  )
     */

    /**
     * get informations about wms service
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vm4ms'], 'v_wms_service', 'wmsservice_id');
    }

    /**
     * delete a wms service
     */
    function DELETE() {
        require $this->sRessourcesFile;
        $this->oConnection->oBd->delete($this->aProperties['schema_vm4ms'], 'wmsservice', 'wmsservice_id', $this->aValues['my_vitis_id'], 'text');
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
            $this->aFields['wmsservice_id'] = $this->aValues['my_vitis_id'];
        }
    }

}

?>
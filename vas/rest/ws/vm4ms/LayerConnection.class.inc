<?php

require_once 'Vmap4MapServer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file LayerConnection.class.inc
 * \class LayerConnection
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the LayerConnection php class
 *
 * This class defines operation for one connection
 * 
 */
class LayerConnection extends Vmap4MapServer {

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
        $this->aSelectedFields = Array("connection_id", "name", "private", "server", "port", "database", "user", "password");
    }

    /**
     * @SWG\Get(path="/layerconnections/{connection_id}",
     *   tags={"LayerConnections"},
     *   summary="Get connection",
     *   description="Request to get connection by id",
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
     *     name="connection_id",
     *     in="path",
     *     description="connection id",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layerconnections")
     *     )
     *  )
     */

    /**
     * get informations about connection
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vm4ms'], 'connection', 'connection_id');
    }

    /**
     * delete a connection
     */
    function DELETE() {
        require $this->sRessourcesFile;
        $this->oConnection->oBd->delete($this->aProperties['schema_vm4ms'], 'connection', 'connection_id', $this->aValues['my_vitis_id'], 'string');
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
            $this->aFields['connection_id'] = $this->aValues['my_vitis_id'];
        }
    }

}

?>
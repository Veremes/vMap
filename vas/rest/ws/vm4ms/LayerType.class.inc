<?php

require_once 'Vmap4MapServer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file LayerType.class.inc
 * \class LayerType
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the LayerType php class
 *
 * This class defines operation for one layer type
 * 
 */
class LayerType extends Vmap4MapServer {

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
		$this->aSelectedFields = Array("ms_layertype_id");
    }

    /**
     * @SWG\Get(path="/layertypes/{ms_layertype_id}", 
     *   tags={"LayerTypes"},
     *   summary="Get layer type",
     *   description="Request to get layer type by id",
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
     *     name="ms_layertype_id",
     *     in="path",
     *     description="layer type id",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layertypes")
     *     )
     *  )
     */

    /**
     * get informations about layer type
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vm4ms'], 'ms_layertype', 'ms_layertype_id');
    }
}
?>
<?php
/**
* \file PrivateWmsServiceLayers.class.inc
* \class PrivateWmsServiceLayers
*
* \author Armand Bahi <armand.bahi@veremes.com>.
*
* \brief This file contains the PrivateWmsServiceLayers php class
*
* This class defines Rest Api to Vmap PrivateWmsServiceLayers
* 
*/
require_once 'Vmap4MapServer.class.inc';
require_once 'PrivateWmsServiceLayer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class PrivateWmsServiceLayers extends Vmap4MapServer {
    
     /**
     * @SWG\Definition(
     *   definition="/privatewmsservicelayers",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/privatewmsservicelayers")
     *   }
     * )
     * * @SWG\Tag(
     *   name="PrivateWmsServiceLayers",
     *   description=""
     * )
     */
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function __construct($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
		$this->aSelectedFields = Array("ms_layer_id", "name", "title", "active", "opacity");
    }
    
    /**
     * @SWG\Get(path="/privatewmsservicelayers",
     *   tags={"WmsServiceLayers"},
     *   summary="Get private wms service layers",
     *   description="Request to get private wms service layers",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="order_by",
     *     in="query",
     *     description="list of ordering fields",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sort_order",
     *     in="query",
     *     description="sort order",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="limit",
     *     in="query",
     *     description="number of element",
     *     required=false,
     *     type="integer",
     *     format="int32"
     *   ),
     * @SWG\Parameter(
     *     name="offset",
     *     in="query",
     *     description="index of first element",
     *     required=false,
     *     type="string",
     *     format="int32"
     *   ),
     * @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="list of attributs",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="filter",
     *     in="query",
     *     description="filter results",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="distinct",
     *     in="query",
     *     description="delete duplicates",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Porperties Response",
     *         @SWG\Schema(ref="#/definitions/privatewmsservicelayers")
     *     )
     *  )
     */
    
    /**
     * get private wms service layers
     * @return PrivateWmsServiceLayers
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'v_private_ms_layer', 'ms_layer_id');
        return $aReturn['sMessage'];
    }
    
    /**
     * modify layers of wms service
     * @return array containing the status and the message
     */
    function PUT() {
    }
    
    /**
     * delete wms service layers
     * @return id of wms service layer deleted or error object if a wms service layer is not deleted
     */
    function DELETE() {
    }
}
?>
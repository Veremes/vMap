<?php
/**
* \file LayerTypes.class.inc
* \class LayerTypes
*
* \author Armand Bahi <armand.bahi@veremes.com>.
*
* \brief This file contains the LayerTypes php class
*
* This class defines Rest Api to Vmap4MapServer LayerTypes
* 
*/
require_once 'Vmap4MapServer.class.inc';
require_once 'LayerType.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class LayerTypes extends Vmap4MapServer {
    
     /**
     * @SWG\Definition(
     *   definition="/layertypes",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/layertypes")
     *   }
     * )
     * * @SWG\Tag(
     *   name="LayerTypes",
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
		$this->aSelectedFields = Array("ms_layertype_id");
    }
    /**
     * @SWG\Get(path="/layertypes",
     *   tags={"LayerTypes"},
     *   summary="Get layertypes",
     *   description="Request to get layer types",
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
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layertypes")
     *     )
     *  )
     */
    /**
     * get LayerTypes
     * @return  LayerTypes
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'ms_layertype', 'ms_layertype_id');
        return $aReturn['sMessage'];
    }
}
?>
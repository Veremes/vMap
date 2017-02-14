<?php
/**
* \file Formats.class.inc
* \class Formats
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the Formats php class
*
* This class defines Rest Api to Vmap order statutes
* 
*/
require_once 'Vmap.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
require_once 'Format.class.inc';
require_once(__DIR__.'/../../class/vmlib/BdDataAccess.inc');

class Formats extends Vmap {
    
     /**
     * @SWG\Definition(
     *   definition="/formats",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/formats")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Formats",
     *   description="Operations about Formats"
     * )
     */
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function Formats($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->aSelectedFields = Array('rt_format_id');
    }
    
    /**
     * @SWG\Get(path="/formats",
     *   tags={"Formats"},
     *   summary="Get Formats",
     *   description="Request to get Formats",
     *   operationId="GET",
     *   produces={"application/xml", "application/json"},
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
     *     type="boolean"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/formats")
     *     )
     *  )
     */
    
    /**
     * get Formats
     * @return  Formats
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], "rt_format", "rt_format_id");
        return $aReturn['sMessage'];
    }
}
?>
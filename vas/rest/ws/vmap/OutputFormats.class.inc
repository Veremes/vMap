<?php
/**
* \file OutputFormats.class.inc
* \class OutputFormats
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the OutputFormats php class
*
* This class defines Rest Api to Vmap order statutes
* 
*/
require_once 'Vmap.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
require_once 'OutputFormat.class.inc';
require_once(__DIR__.'/../../class/vmlib/BdDataAccess.inc');

class OutputFormats extends Vmap {
    
     /**
     * @SWG\Definition(
     *   definition="/outputformats",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/outputformats")
     *   }
     * )
     * * @SWG\Tag(
     *   name="OutputFormats",
     *   description="Operations about OutputFormats"
     * )
     */
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function OutputFormats($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->aSelectedFields = Array('outputformats_id');
    }
    
    /**
     * @SWG\Get(path="/outputformats",
     *   tags={"OutputFormats"},
     *   summary="Get OutputFormats",
     *   description="Request to get OutputFormats",
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
     *         @SWG\Schema(ref="#/definitions/outputformats")
     *     )
     *  )
     */
    
    /**
     * get OutputFormats
     * @return  OutputFormats
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], "rt_outputformats", "outputformats_id");
        return $aReturn['sMessage'];
    }
}
?>
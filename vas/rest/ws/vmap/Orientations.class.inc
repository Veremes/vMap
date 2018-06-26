<?php
/**
* \file Orientations.class.inc
* \class Orientations
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the Orientations php class
*
* This class defines Rest Api to Vmap order statutes
* 
*/
require_once 'Vmap.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
require_once 'Orientation.class.inc';
require_once(__DIR__.'/../../class/vmlib/BdDataAccess.inc');

class Orientations extends Vmap {
    
     /**
     * @SWG\Definition(
     *   definition="/orientations",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/orientations")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Orientations",
     *   description="Operations about Orientations"
     * )
     */
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
        $this->aSelectedFields = Array('rt_orientation_id');
    }
    
    /**
     * @SWG\Get(path="/orientations",
     *   tags={"Orientations"},
     *   summary="Get Orientations",
     *   description="Request to get Orientations",
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
     *     type="integer"
     *   ),
     * @SWG\Parameter(
     *     name="offset",
     *     in="query",
     *     description="index of first element",
     *     required=false,
     *     type="string"
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
     *         @SWG\Schema(ref="#/definitions/orientations")
     *     )
     *  )
     */
    
    /**
     * get Orientations
     * @return  Orientations
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], "rt_orientation", "rt_orientation_id");
        return $aReturn['sMessage'];
    }
}
?>
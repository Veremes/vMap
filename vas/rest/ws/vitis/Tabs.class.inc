<?php
/**
* \file Tabs.class.inc
* \class Tabs
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the Tabs php class
*
* This class defines Rest Api to Vitis tabs
* 
*/
require_once 'Vitis.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
require_once 'Tab.class.inc';
require_once(__DIR__.'/../../class/vmlib/BdDataAccess.inc');

class Tabs extends Vitis {
    
     /**
     * @SWG\Definition(
     *   definition="/Tabs",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/Tabs")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Tabs",
     *   description="Operations about Tabs"
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
        $this->aSelectedFields = Array("label", "event", "tab_id", "mode_id", "index", "lang", "ressource_id", "show_column", "edit_column", "sorted_by", "sorted_dir", "name");
    }
    
    /**
     * @SWG\Get(path="/tabs",
     *   tags={"Tabs"},
     *   summary="Get Tabs",
     *   description="Request to get Tabs",
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
     *     type="boolean"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/users")
     *     )
     *  )
     */
    /**
     * get Tabs
     * @return Tabs
     */
    function GET() { // getTabs
        $aReturn = $this->genericGet($this->aProperties['schema_framework'], "v_tab", "tab_id");
        return $aReturn['sMessage'];
    }
}
?>
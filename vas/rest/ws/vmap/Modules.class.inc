<?php
/**
* \file Modules.class.inc
* \class Modules
*
* \author Armand Bahi <armand.bahi@veremes.com>.
*
* \brief This file contains the Modules php class
*
* This class defines Rest Api to Vmap Modules
* 
*/
require_once 'Vmap.class.inc';
require_once 'Module.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class Modules extends Vmap {
    
     /**
     * @SWG\Definition(
     *   definition="/modules",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/modules")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Modules",
     *   description=""
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
		$this->aSelectedFields = Array("module_id", "label", "description", "rolname", "rolname_list");
    }
    /**
     * @SWG\Get(path="/modules",
     *   tags={"Modules"},
     *   summary="Get Modules",
     *   description="Request to get Modules",
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
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/modules")
     *     )
     *  )
     */
    /**
     * get Modules
     * @return  Modules
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'module', 'module_id');
        return $aReturn['sMessage'];
    }
    
    /**
     * @SWG\Put(path="/modules/{module_id}",
     *   tags={"Modules"},
     *   summary="Update Module",
     *   description="Request to update module",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   consumes= { "multipart/form-data"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="module_id",
     *     in="path",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="label",
     *     in="query",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="description",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/modules")
     *     ),
     * 
     *  )
     */

    /**
     * modify module
     * @return array containing the status and the message
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_vmap'], 'module', 'module_id');
        return $aReturn['sMessage'];
    }
}
?>
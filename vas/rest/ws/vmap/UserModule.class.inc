<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file UserModule.class.inc
 * \class UserModule
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the UserModule php class
 *
 * This class defines operation for one UserModule
 * 
 */
class UserModule extends Vmap {

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
        $this->aSelectedFields = Array("module_id", "label", "description", "rolname");
    }

    /**
     * @SWG\Get(path="/usermodules/{module_id}", 
     *   tags={"Modules"},
     *   summary="Get UserModule",
     *   description="Request to get UserModule by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="module_id",
     *     in="path",
     *     description="module id",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/usermodules")
     *     )
     *  )
     */

    /**
     * get informations about usermodule
     */
    function GET() {
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'module', 'module_id');
    }
}
?>
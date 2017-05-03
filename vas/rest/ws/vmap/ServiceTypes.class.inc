<?php

/**
 * \file ServiceTypes.class.inc
 * \class ServiceTypes
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the ServiceTypes php class
 *
 * This class defines Rest Api to Vmap ServiceTypes
 * 
 */
require_once 'Vmap.class.inc';
require_once 'ServiceType.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class ServiceTypes extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/servicetypes",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/servicetypes")
     *   }
     * )
     * * @SWG\Tag(
     *   name="ServiceTypes",
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
        $this->aSelectedFields = Array("service_type_id");
    }

    /**
     * @SWG\Get(path="/servicetypes",
     *   tags={"ServiceTypes"},
     *   summary="Get ServiceTypes",
     *   description="Request to get ServiceTypes",
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
     *     type="boolean"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/servicetypes")
     *     )
     *  )
     */

    /**
     * get ServiceTypes
     * @return the array of objects
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'rt_service_type', 'service_type_id');
        return $aReturn['sMessage'];
    }
}
?>
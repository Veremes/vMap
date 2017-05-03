<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file ServiceType.class.inc
 * \class ServiceType
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the ServiceType php class
 *
 * This class defines operation for one ServiceType
 * 
 */
class ServiceType extends Vmap {

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
        $this->aSelectedFields = Array("service_type_id");
    }

    /**
     * @SWG\Get(path="/servicetypes/{service_type_id}", 
     *   tags={"ServiceTypes"},
     *   summary="Get ServiceType",
     *   description="Request to get ServiceType by id",
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
     *     name="service_type_id",
     *     in="path",
     *     description="",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/servicetypes")
     *     )
     *  )
     */

    /**
     * get informations about servicetypes
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'rt_service_type', 'service_type_id');
    }
}
?>
<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file CRS.class.inc
 * \class CRS
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the CRS php class
 *
 * This class defines operation for one CRS
 * 
 */
class CRS extends Vmap {

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
        $this->aSelectedFields = Array("crs_id", "name");
    }

    /**
     * @SWG\Get(path="/crss/{crs_id}", 
     *   tags={"CRSs"},
     *   summary="Get CRS",
     *   description="Request to get CRS by id",
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
     *     name="crs_id",
     *     in="path",
     *     description="",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/crss")
     *     )
     *  )
     */

    /**
     * get informations about crss
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'rt_crs', 'crs_id');
    }
    
}

?>
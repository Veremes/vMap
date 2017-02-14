<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Extent.class.inc
 * \class Extent
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Extent php class
 *
 * This class defines operation for one Extent
 * 
 */
class Extent extends Vmap {

    public $oError;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function Extent($aPath, $aValues, $properties, $oConnection) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
        $this->aSelectedFields = Array("extent_id", "crs_id", "extent", "name");
    }

    /**
     * @SWG\Get(path="/extents/{extent_id}", 
     *   tags={"Extents"},
     *   summary="Get Extent",
     *   description="Request to get Extent by id",
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
     *     name="extent_id",
     *     in="path",
     *     description="",
     *     required=true,
     *     type="string",
     *   format="int32"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/extent")
     *     )
     *  )
     */

    /**
     * get informations about extents
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'extent', 'extent_id');
    }
    
    /**
     * delete a extent
     */
    function DELETE(){
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'extent', 'extent_id', $this->aValues['my_vitis_id'], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new Error(1, $this->oConnection->oBd->getBDMessage());
        } else {
                $this->aFields[extent_id] = $this->aValues['my_vitis_id'];
        }
    }
}

?>
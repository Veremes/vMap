<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../vitis/Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

/**
 * \file lieuditbygeom.class.inc
 * \class LieuDitByGeom
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the LieuDitByGeom php class
 *
 * This class defines the rest api for lieuditbygeom
 * 
 */
class LieuDitByGeom extends Cadastre {
    /**
     * @SWG\Definition(
     *   definition="/lieuditbyGeom",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/lieuditbyGeom")
     *   }
     * )
     * * @SWG\Tag(
     *   name="LieuDitByGeom",
     *   description="Operations about LieuDitByGeom"
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->sSchema = $this->aProperties['schema_cadastre'];
        $this->sTable = 'v_lieudit';
        $this->aAttributs = Array("id", "id_com", "section", "pre", "texte", "geom");
    }

    /**
     * @SWG\Get(path="/lieuditbygeom",
     *   tags={"LieuDit"},
     *   summary="Get the lieuditbygeom whith a table",
     *   description="Request to get a element intersected",
     *   operationId="GET",
     *   produces={"application/json", "application/x-vm-json"},
     * @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="geom",
     *     in="query",
     *     description="wkt geometry to intersect with",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="LieuDitByGeom Response",
     *         @SWG\Schema(ref="#/definitions/lieuditbyGeom")
     *     )
     *  )
     */

    /**
     * Get function to generate a token
     * @return the token
     */
    function GET() {

        $sSchema = $this->sSchema;
        $sTable = $this->sTable;
        $aAttributs = $this->aAttributs;
        $geom = $this->aValues['geom'];

        $aResult = $this->vmapIntersectGet($sSchema, $sTable, $geom, $aAttributs);


        return json_encode($aResult);
    }

}

?>
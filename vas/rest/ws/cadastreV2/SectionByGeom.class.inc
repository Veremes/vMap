<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../vitis/Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

/**
 * \file sectionbygeom.class.inc
 * \class SectionByGeom
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the SectionByGeom php class
 *
 * This class defines the rest api for sectionbygeom
 * 
 */
class SectionByGeom extends Cadastre {
    /**
     * @SWG\Definition(
     *   definition="/sectionbygeom",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/sectionbygeom")
     *   }
     * )
     * * @SWG\Tag(
     *   name="SectionByGeom",
     *   description="Operations about SectionByGeom"
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
        $this->sSchema = $this->aProperties['schema_cadastre'];
        $this->sTable = 'v_vmap_section_cadastrale';
        $this->aAttributs = Array("id_com", "id_sec", "code_com", "section", "pre", "idu", "texte", "geom");
    }

    /**
     * @SWG\Get(path="/sectionbygeom",
     *   tags={"Section"},
     *   summary="Get the sectionbygeom whith a table",
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
     * default="POINT(739845.6672146925 6246677.620524088)",
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="SectionByGeom Response",
     *         @SWG\Schema(ref="#/definitions/sectionbygeom")
     *     )
     *  )
     */

    /**
     * Get function to generate a token
     * @return the token
     */
    function GET() {

        if (!in_array('vmap_cadastre_user', $this->oConnection->aPrivileges)) {
            $oError = new VitisError(0, 'INSUFFICIENT_PRIVILEGES');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        $sSchema = $this->sSchema;
        $sTable = $this->sTable;
        $aAttributs = $this->aAttributs;
        $geom = $this->aValues['geom'];

        $aResult = $this->vmapIntersectGet($sSchema, $sTable, $geom, $aAttributs);

        return json_encode($aResult);
    }

}

?>
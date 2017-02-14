<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../vitis/Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

/**
* \file parcellebygeom.class.inc
* \class ParcelleByGeom
*
* \author Armand Bahi <armand.bahi@veremes.com>.
*
*	\brief This file contains the ParcelleByGeom php class
*
* This class defines the rest api for parcellebygeom
* 
*/
class ParcelleByGeom  extends Cadastre{
    
     /**
     * @SWG\Definition(
     *   definition="/parcellebygeom",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/parcellebygeom")
     *   }
     * )
     * * @SWG\Tag(
     *   name="ParcelleByGeom",
     *   description="Operations about ParcelleByGeom"
     * )
     */
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function parcellebygeom($aPath, $aValues, $properties){
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
		$this->oConnection = new Connection($this->aValues, $this->aProperties);
		$this->sSchema = 'public';
		$this->sTable = 'v_parcelle';
		$this->aAttributs = Array("id_com", "code_com", "parcelle", "section", "pre", "coar", "codm", "indp", "idu", "ID_PAR", "sup_fiscale", "numero", "feuille", "geom");
    }
	/**
     * @SWG\Get(path="/parcellebygeom",
     *   tags={"Parcelle"},
     *   summary="Get the parcellebygeom whith a table",
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
     *         description="ParcelleByGeom Response",
     *         @SWG\Schema(ref="#/definitions/parcellebygeom")
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
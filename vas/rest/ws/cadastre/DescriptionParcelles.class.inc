<?php
/**
* \file DescriptionParcelles.class.inc
* \class DescriptionParcelles
*
* \author Armand Bahi <armand.bahi@veremes.com>.
*
* \brief This file contains the DescriptionParcelles php class
*
* This class defines Rest Api to Vmap DescriptionParcelles
* 
*/
require_once 'Cadastre.class.inc';
require_once 'DescriptionParcelle.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class DescriptionParcelles extends Cadastre {
    
     /**
     * @SWG\Definition(
     *   definition="/descriptionparcelles",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/descriptionparcelles")
     *   }
     * )
     * * @SWG\Tag(
     *   name="DescriptionParcelles",
     *   description="Operations about descriptionparcelles"
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
		$this->aSelectedFields = Array(oid, 'ID_COM', 'IDU_', 'ID_PAR', 'CCODEP', 'CCODIR', 'CCOCOM', 'CCOPRE', 'CCOSEC', 'DNUPLA', 'CENR', 'DCNTPA', 'DSRPAR', 'DNUPRO', 'JDATAT', 'DREFLF', 'GPDL', 'CPRSECR', 'CCOSECR', 'DNUPLAR', 'DNUPDL', 'GURBPA', 'DPARPI', 'CCOARP', 'GPARNF', 'GPARBAT', 'CCOVOI', 'CCORIV', 'CCOCIF', 'CODE_INSEE', 'ID_RIVOLI', 'ID_DNUPRO', 'DNVOIRI', 'DINDIC', 'L_NATURE_VOIE', 'DVOILIB');
    }
    
    /**
     * @SWG\Get(path="/descriptionparcelles",
     *   tags={"Parcelle"},
     *   summary="Get DescriptionParcelles",
     *   description="Request to get DescriptionParcelles",
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
	 *     default="4",
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
     *         @SWG\Schema(ref="#/definitions/descriptionparcelles")
     *     )
     *  )
     */
    /**
     * get DescriptionParcelles
     * @return  DescriptionParcelles
     */
    function GET() {
		$this->aValues['filter'] = str_replace("id_par", "ID_PAR", $this->aValues['filter']);
        $aReturn = $this->genericGet('public', 'v_non_bati_a10_descr_parcelle', 'ID_PAR');
        return $aReturn['sMessage'];
    }
    
}
?>
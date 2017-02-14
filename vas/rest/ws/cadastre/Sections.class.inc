<?php
/**
* \file Sections.class.inc
* \class Sections
*
* \author Armand Bahi <armand.bahi@veremes.com>.
*
* \brief This file contains the Sections php class
*
* This class defines Rest Api to Vmap Sections
* 
*/
require_once 'Cadastre.class.inc';
require_once 'Section.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class Sections extends Cadastre {
    
     /**
     * @SWG\Definition(
     *   definition="/sections",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/sections")
     *   }
     * )
     * * @SWG\Tag(
     *   name="sections",
     *   description="Operations about sections"
     * )
     */
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function Sections($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
		$this->aSelectedFields = Array("id_com", "id_sec", "code_com", "commune", "replace(pre, '000', '')||replace(section, '0', '') as section", "pre", "idu", "tex", "texte", "geom");
    }
    //(pre, '000', '')||replace(section, '0', '') as section
    /**
     * @SWG\Get(path="/sections",
     *   tags={"Section"},
     *   summary="Get Sections",
     *   description="Request to get Sections",
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
     *         @SWG\Schema(ref="#/definitions/sections")
     *     )
     *  )
     */
    /**
     * get Sections
     * @return  Sections
     */
    function GET() {
        $aReturn = $this->genericGet('public', 'v_section', 'id_sec');
        return $aReturn['sMessage'];
    }
    
}
?>
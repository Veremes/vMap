<?php
/**
* \file Proprietaires.class.inc
* \class Proprietaires
*
* \author Armand Bahi <armand.bahi@veremes.com>.
*
* \brief This file contains the Proprietaires php class
*
* This class defines Rest Api to Vmap Proprietaires
* 
*/
require_once 'Cadastre.class.inc';
require_once 'Proprietaire.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class Proprietaires extends Cadastre {
    
     /**
     * @SWG\Definition(
     *   definition="/proprietaires",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/proprietaires")
     *   }
     * )
     * * @SWG\Tag(
     *   name="proprietaires",
     *   description="Operations about proprietaires"
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
		$this->aSelectedFields = Array('oid', 'ID_COM', 'DDENOM', 'DNUPRO', 'COMMUNE');
    }
    
    /**
     * @SWG\Get(path="/proprietaires",
     *   tags={"Proprietaire"},
     *   summary="Get Proprietaires",
     *   description="Request to get Proprietaires",
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
     *         @SWG\Schema(ref="#/definitions/proprietaires")
     *     )
     *  )
     */
    /**
     * get Proprietaires
     * @return  Proprietaires
     */
    function GET() {
        $aReturn = $this->genericGet('public', $this->aProperties['cadastre']['views']['proprietaire'], 'oid');
        return $aReturn['sMessage'];
    }
    
}
?>
<?php

/**
 * \file Adresses.class.inc
 * \class Adresses
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Adresses php class
 *
 * This class defines Rest Api to Vmap Adresses
 * 
 */
require_once 'Cadastre.class.inc';
require_once 'Adresse.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class Adresses extends Cadastre {
    /**
     * @SWG\Definition(
     *   definition="/adresses",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/adresses")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Adresses",
     *   description="Operations about cadastre"
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
        $this->aSelectedFields = Array(oid, 'ID_COM', 'IDU_', 'ID_PAR', 'CCODEP', 'CCODIR', 'CCOCOM', 'CCOPRE', 'CCOSEC', 'DNUPLA', 'CENR', 'DCNTPA', 'DSRPAR', 'DNUPRO', 'JDATAT', 'DREFLF', 'GPDL', 'CPRSECR', 'CCOSECR', 'DNUPLAR', 'DNUPDL', 'GURBPA', 'DPARPI', 'CCOARP', 'GPARNF', 'GPARBAT', 'CCOVOI', 'CCORIV', 'CCOCIF', 'CODE_INSEE', 'ID_RIVOLI', 'ID_DNUPRO', 'DNVOIRI', 'DINDIC', 'L_NATURE_VOIE', 'DVOILIB');
    }

    /**
     * @SWG\Get(path="/adresses",
     *   tags={"Adresse"},
     *   summary="Get Adresses",
     *   description="Request to get Adresses",
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
     *         @SWG\Schema(ref="#/definitions/adresses")
     *     )
     *  )
     */

    /**
     * get Adresses
     * @return  Adresses
     */
    function GET() {
        $aReturn = $this->genericGet('public', $this->aProperties['cadastre']['views']['adresse'], 'ID_PAR');
        return $aReturn['sMessage'];
    }

}

?>
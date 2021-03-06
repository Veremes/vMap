<?php

/**
 * \file Voies.class.inc
 * \class Voies
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Voies php class
 *
 * This class defines Rest Api to Vmap Voies
 * 
 */
require_once 'Cadastre.class.inc';
require_once 'Voie.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class Voies extends Cadastre {
    /**
     * @SWG\Definition(
     *   definition="/voies",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/voies")
     *   }
     * )
     * * @SWG\Tag(
     *   name="voies",
     *   description="Operations about voies"
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
        $this->aSelectedFields = Array('ID_RIVOLI', 'L_NATURE_VOIE', 'DVOILIB');
    }

    /**
     * @SWG\Get(path="/voies",
     *   tags={"Voie"},
     *   summary="Get Voies",
     *   description="Request to get Voies",
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
     *         @SWG\Schema(ref="#/definitions/voies")
     *     )
     *  )
     */

    /**
     * get Voies
     * @return  Voies
     */
    function GET() {
        $aReturn = $this->genericGet('public', $this->aProperties['cadastre']['views']['voie'], 'ID_RIVOLI');
        return $aReturn['sMessage'];
    }

}

?>
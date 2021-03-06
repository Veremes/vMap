<?php

/**
 * \file LieuDits.class.inc
 * \class LieuDits
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the LieuDits php class
 *
 * This class defines Rest Api to Vmap LieuDits
 * 
 */
require_once 'Cadastre.class.inc';
require_once 'LieuDit.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class LieuDits extends Cadastre {
    /**
     * @SWG\Definition(
     *   definition="/lieudits",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/lieudits")
     *   }
     * )
     * * @SWG\Tag(
     *   name="LieuDits",
     *   description="Operations about LieuDits"
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
        $this->aSelectedFields = Array("id", "id_com", "substring (id_com, 3, 3) as code_com", "section", "pre", "texte as tex", "geom", "oid");
    }

    /**
     * @SWG\Get(path="/lieudits",
     *   tags={"LieuDit"},
     *   summary="Get LieuDits",
     *   description="Request to get LieuDits",
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
     *     description="sorted direction",
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
     *         @SWG\Schema(ref="#/definitions/lieudits")
     *     )
     *  )
     */

    /**
     * get LieuDits
     * @return  LieuDits
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_cadastre'], $this->aProperties['cadastre']['views']['lieu_dit'], 'id');
        return $aReturn['sMessage'];
    }

}

?>
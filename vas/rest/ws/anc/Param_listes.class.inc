<?php

/**
 * \file Param_listes.class.inc
 * \class Param_listes
 *
 * \author WAB <support.wab@veremes.com>.
 *
 * 	\brief This file contains the Param_listes php class
 *
 * This class defines Rest Api to Vitis Param_listes
 * 
 */
require_once __DIR__ . '/Anc.class.inc';
require_once 'Param_liste.class.inc';


class Param_listes extends Anc {
    /**
     * @SWG\Definition(
     *   definition="/param_listes",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/param_listes")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Param_listes",
     *   description="Operations about Param_listes"
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
    }

    /**
     * @SWG\Get(path="/param_listes",
     *   tags={"Param_listes"},
     *   summary="Get Param_listes",
     *   description="Request to get Param_listes",
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
     *     description="sort_order",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="limit",
     *     in="query",
     *     description="number of element",
     *     required=false,
     *     type="integer",
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
     *         description="param_liste Response",
     *         @SWG\Schema(ref="#/definitions/param_listes")
     *     )
     *  )
     */

    /**
     * get Param_listes
     * @return  Param_listes
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_anc'], "param_liste", "id_parametre_liste");
        $sMessage = $aReturn['sMessage'];
        return $sMessage;
    }

    /**
     * @SWG\Post(path="/param_listes",
     *   tags={"Param_listes"},
     *   summary="Add param_liste",
     *   description="Request to add Param_listes",
     *   operationId="POST",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="param_liste Response",
     *         @SWG\Schema(ref="#/definitions/param_listes")
     *     )
     *  )
     */

    /**
     * insert param_liste
     * @return id of the param_liste created
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_anc'], 'param_liste', $this->aProperties['schema_anc'].'.param_liste_id_parametre_liste_seq', 'id_parametre_liste');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/param_listes/{id_param_liste}",
     *   tags={"Param_listes"},
     *   summary="update Param_listes",
     *   description="Request to update Param_listes",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Param_liste token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_param_liste",
     *     in="path",
     *     description="id of the Param_listes",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/param_listes")
     *     )
     *  )
     */

    /**
     * update param_listes
     * @return id of param_listes updated or error object if a param_listes is not updated
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_anc'], 'param_liste', 'id_parametre_liste');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/param_listes",
     *   tags={"Param_listes"},
     *   summary="delete Param_listes",
     *   description="Request to delete Param_listes",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id of the param_liste",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="param_liste Response",
     *         @SWG\Schema(ref="#/definitions/param_listes")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/param_listes/{id_param_liste}",
     *   tags={"Param_listes"},
     *   summary="delete Param_listes",
     *   description="Request to delete Param_listes",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Param_liste token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_param_liste",
     *     in="path",
     *     description="id of the Param_listes",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/param_listes")
     *     )
     *  )
     */

    /**
     * delete param_listes
     * @return id of param_listes deleted or error object if a param_listes is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_anc'], 'param_liste', 'id_parametre_liste');
        return $aReturn['sMessage'];
    }
}
?>
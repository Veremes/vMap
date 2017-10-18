<?php

/**
 * \file Param_tarifs.class.inc
 * \class Param_tarifs
 *
 * \author WAB <support.wab@veremes.com>.
 *
 * 	\brief This file contains the Param_tarifs php class
 *
 * This class defines Rest Api to Vitis Param_tarifs
 * 
 */
require_once __DIR__ . '/Anc.class.inc';
require_once 'Param_tarif.class.inc';


class Param_tarifs extends Anc {
    /**
     * @SWG\Definition(
     *   definition="/param_tarifs",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/param_tarifs")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Param_tarifs",
     *   description="Operations about Param_tarifs"
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
        $this->aSelectedFields = Array("id_parametre_tarif", "id_com", "controle_type", "montant", "annee_validite", "devise", "libelle_montant");
    }

    /**
     * @SWG\Get(path="/param_tarifs",
     *   tags={"Param_tarifs"},
     *   summary="Get Param_tarifs",
     *   description="Request to get Param_tarifs",
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
     *         description="param_tarif Response",
     *         @SWG\Schema(ref="#/definitions/param_tarifs")
     *     )
     *  )
     */

    /**
     * get Param_tarifs
     * @return  Param_tarifs
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_anc'], "v_param_tarif", "id_parametre_tarif");
        $sMessage = $aReturn['sMessage'];
        return $sMessage;
    }

    /**
     * @SWG\Post(path="/param_tarifs",
     *   tags={"Param_tarifs"},
     *   summary="Add param_tarif",
     *   description="Request to add Param_tarifs",
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
     *         description="param_tarif Response",
     *         @SWG\Schema(ref="#/definitions/param_tarifs")
     *     )
     *  )
     */

    /**
     * insert param_tarif
     * @return id of the param_tarif created
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_anc'], 'param_tarif', $this->aProperties['schema_anc'].'.param_tarif_id_parametre_tarif_seq', 'id_parametre_tarif');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/param_tarifs/{id_param_tarif}",
     *   tags={"Param_tarifs"},
     *   summary="update Param_tarifs",
     *   description="Request to update Param_tarifs",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Param_tarif token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_param_tarif",
     *     in="path",
     *     description="id of the Param_tarifs",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/param_tarifs")
     *     )
     *  )
     */

    /**
     * update param_tarifs
     * @return id of param_tarifs updated or error object if a param_tarifs is not updated
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_anc'], 'param_tarif', 'id_parametre_tarif');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/param_tarifs",
     *   tags={"Param_tarifs"},
     *   summary="delete Param_tarifs",
     *   description="Request to delete Param_tarifs",
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
     *     description="id of the param_tarif",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="param_tarif Response",
     *         @SWG\Schema(ref="#/definitions/param_tarifs")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/param_tarifs/{id_param_tarif}",
     *   tags={"Param_tarifs"},
     *   summary="delete Param_tarifs",
     *   description="Request to delete Param_tarifs",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Param_tarif token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_param_tarif",
     *     in="path",
     *     description="id of the Param_tarifs",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/param_tarifs")
     *     )
     *  )
     */

    /**
     * delete param_tarifs
     * @return id of param_tarifs deleted or error object if a param_tarifs is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_anc'], 'param_tarif', 'id_parametre_tarif');
        return $aReturn['sMessage'];
    }
}
?>
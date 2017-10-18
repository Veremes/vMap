<?php

/**
 * \file Entreprises.class.inc
 * \class Entreprises
 *
 * \author WAB <support.wab@veremes.com>.
 *
 * 	\brief This file contains the Entreprises php class
 *
 * This class defines Rest Api to Vitis Entreprises
 * 
 */
require_once __DIR__ . '/Anc.class.inc';
require_once 'Entreprise.class.inc';


class Entreprises extends Anc {
    /**
     * @SWG\Definition(
     *   definition="/entreprises",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/entreprises")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Entreprises",
     *   description="Operations about Entreprises"
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
        $this->aSelectedFields = Array("id_parametre_entreprises", "id_com", "siret", "raison_sociale", "nom_entreprise", "nom_contact", "telephone_fixe", "telephone_mobile", "web", "mail", "code_postal", "voie", "bureau_etude", "concepteur", "constructeur", "installateur", "vidangeur", "en_activite", "observations", "creat", "creat_date", "maj", "maj_date", "geom");
    }

    /**
     * @SWG\Get(path="/entreprises",
     *   tags={"Entreprises"},
     *   summary="Get Entreprises",
     *   description="Request to get Entreprises",
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
     *         description="entreprise Response",
     *         @SWG\Schema(ref="#/definitions/entreprises")
     *     )
     *  )
     */

    /**
     * get Entreprises
     * @return  Entreprises
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_anc'], "param_entreprise", "id_parametre_entreprises");
        $sMessage = $aReturn['sMessage'];
        return $sMessage;
    }

    /**
     * @SWG\Post(path="/entreprises",
     *   tags={"Entreprises"},
     *   summary="Add entreprise",
     *   description="Request to add Entreprises",
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
     *         description="entreprise Response",
     *         @SWG\Schema(ref="#/definitions/entreprises")
     *     )
     *  )
     */

    /**
     * insert entreprise
     * @return id of the entreprise created
     */
    function POST() {
        $this->aValues['creat'] = $_SESSION["ses_Login"];
        $this->aValues['creat_date'] = date('Y-m-d');        
        $aReturn = $this->genericPost($this->aProperties['schema_anc'], 'param_entreprise', $this->aProperties['schema_anc'].'.param_entreprise_id_parametre_entreprises_seq', 'id_parametre_entreprises');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/entreprises/{id_entreprise}",
     *   tags={"Entreprises"},
     *   summary="update Entreprises",
     *   description="Request to update Entreprises",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Entreprise token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_entreprise",
     *     in="path",
     *     description="id of the Entreprises",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/entreprises")
     *     )
     *  )
     */

    /**
     * update entreprises
     * @return id of entreprises updated or error object if a entreprises is not updated
     */
    function PUT() {
        if (empty($this->aValues['maj']))
            $this->aValues['maj'] = $_SESSION["ses_Login"];
        if (empty($this->aValues['maj_date']))
            $this->aValues['maj_date'] = date('Y-m-d');
        $aReturn = $this->genericPut($this->aProperties['schema_anc'], 'param_entreprise', 'id_parametre_entreprises');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/entreprises",
     *   tags={"Entreprises"},
     *   summary="delete Entreprises",
     *   description="Request to delete Entreprises",
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
     *     description="id of the entreprise",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="entreprise Response",
     *         @SWG\Schema(ref="#/definitions/entreprises")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/entreprises/{id_entreprise}",
     *   tags={"Entreprises"},
     *   summary="delete Entreprises",
     *   description="Request to delete Entreprises",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Entreprise token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_entreprise",
     *     in="path",
     *     description="id of the Entreprises",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/entreprises")
     *     )
     *  )
     */

    /**
     * delete entreprises
     * @return id of entreprises deleted or error object if a entreprises is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_anc'], 'param_entreprise', 'id_parametre_entreprises');
        return $aReturn['sMessage'];
    }
}
?>
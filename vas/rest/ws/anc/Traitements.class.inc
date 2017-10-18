<?php

/**
 * \file Traitements.class.inc
 * \class Traitements
 *
 * \author WAB <support.wab@veremes.com>.
 *
 * 	\brief This file contains the Traitements php class
 *
 * This class defines Rest Api to Vitis Traitements
 * 
 */
require_once __DIR__ . '/Anc.class.inc';
require_once 'Traitement.class.inc';


class Traitements extends Anc {
    /**
     * @SWG\Definition(
     *   definition="/traitements",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/traitements")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Traitements",
     *   description="Operations about Traitements"
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
     * @SWG\Get(path="/traitements",
     *   tags={"Traitements"},
     *   summary="Get Traitements",
     *   description="Request to get Traitements",
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
     *         description="traitement Response",
     *         @SWG\Schema(ref="#/definitions/traitements")
     *     )
     *  )
     */

    /**
     * get Traitements
     * @return  Traitements
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_anc'], "v_traitement", "id_traitement");
        $sMessage = $aReturn['sMessage'];
        return $sMessage;
    }

    /**
     * @SWG\Post(path="/traitements",
     *   tags={"Traitements"},
     *   summary="Add traitement",
     *   description="Request to add Traitements",
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
     *         description="traitement Response",
     *         @SWG\Schema(ref="#/definitions/traitements")
     *     )
     *  )
     */

    /**
     * insert traitement
     * @return id of the traitement created
     */
    function POST() {
        $this->aValues['create'] = $_SESSION["ses_Login"];
        $this->aValues['create_date'] = date('Y-m-d');
        // Sauve le nom des fichiers.
        if (!empty($_FILES['photos_f']))
            $this->aValues['photos_f'] = $_FILES['photos_f']["name"];
        if (!empty($_FILES['fiche_f']))
            $this->aValues['fiche_f'] = $_FILES['fiche_f']["name"];
        if (!empty($_FILES['schema_f']))
            $this->aValues['schema_f'] = $_FILES['schema_f']["name"];
        if (!empty($_FILES['documents_f']))
            $this->aValues['documents_f'] = $_FILES['documents_f']["name"];
        if (!empty($_FILES['plan_f']))
            $this->aValues['plan_f'] = $_FILES['plan_f']["name"];
        //
        $aReturn = $this->genericPost($this->aProperties['schema_anc'], 'v_traitement', $this->aProperties['schema_anc'].'.traitement_id_traitement_seq', 'id_traitement');
        // Upload les fichiers.
        $this->uploadDocument('photos_f', 'anc_saisie_anc_traitement');
        $this->uploadDocument('fiche_f', 'anc_saisie_anc_traitement');
        $this->uploadDocument('schema_f', 'anc_saisie_anc_traitement');
        $this->uploadDocument('documents_f', 'anc_saisie_anc_traitement');
        $this->uploadDocument('plan_f', 'anc_saisie_anc_traitement');
        //
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/traitements/{id_traitement}",
     *   tags={"Traitements"},
     *   summary="update Traitements",
     *   description="Request to update Traitements",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Traitement token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_traitement",
     *     in="path",
     *     description="id of the Traitements",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/traitements")
     *     )
     *  )
     */

    /**
     * update traitements
     * @return id of traitements updated or error object if a traitements is not updated
     */
    function PUT() {
        if (empty($this->aValues['maj']))
            $this->aValues['maj'] = $_SESSION["ses_Login"];
        if (empty($this->aValues['maj_date']))
            $this->aValues['maj_date'] = date('Y-m-d');
        // Upload les fichiers.
        $this->uploadDocument('photos_f', 'anc_saisie_anc_traitement');
        $this->uploadDocument('fiche_f', 'anc_saisie_anc_traitement');
        $this->uploadDocument('schema_f', 'anc_saisie_anc_traitement');
        $this->uploadDocument('documents_f', 'anc_saisie_anc_traitement');
        $this->uploadDocument('plan_f', 'anc_saisie_anc_traitement');
        //
        $aReturn = $this->genericPut($this->aProperties['schema_anc'], 'v_traitement', 'id_traitement');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/traitements",
     *   tags={"Traitements"},
     *   summary="delete Traitements",
     *   description="Request to delete Traitements",
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
     *     description="id of the traitement",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="traitement Response",
     *         @SWG\Schema(ref="#/definitions/traitements")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/traitements/{id_traitement}",
     *   tags={"Traitements"},
     *   summary="delete Traitements",
     *   description="Request to delete Traitements",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Traitement token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_traitement",
     *     in="path",
     *     description="id of the Traitements",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/traitements")
     *     )
     *  )
     */

    /**
     * delete traitements
     * @return id of traitements deleted or error object if a traitements is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_anc'], 'v_traitement', 'id_traitement');
        return $aReturn['sMessage'];
    }

    
}

?>
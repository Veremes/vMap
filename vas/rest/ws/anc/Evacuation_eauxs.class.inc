<?php

/**
 * \file Evacuation_eauxs.class.inc
 * \class Evacuation_eauxs
 *
 * \author WAB <support.wab@veremes.com>.
 *
 * 	\brief This file contains the Evacuation_eauxs php class
 *
 * This class defines Rest Api to Vitis Evacuation_eauxs
 * 
 */
require_once __DIR__ . '/Anc.class.inc';
require_once 'Evacuation_eaux.class.inc';


class Evacuation_eauxs extends Anc {
    /**
     * @SWG\Definition(
     *   definition="/evacuation_eauxs",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/evacuation_eauxs")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Evacuation_eauxs",
     *   description="Operations about Evacuation_eauxs"
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
     * @SWG\Get(path="/evacuation_eauxs",
     *   tags={"Evacuation_eauxs"},
     *   summary="Get Evacuation_eauxs",
     *   description="Request to get Evacuation_eauxs",
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
     *         description="evacuation_eaux Response",
     *         @SWG\Schema(ref="#/definitions/evacuation_eauxs")
     *     )
     *  )
     */

    /**
     * get Evacuation_eauxs
     * @return  Evacuation_eauxs
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_anc'], "v_evacuation_eaux", "id_eva");
        $sMessage = $aReturn['sMessage'];
        return $sMessage;
    }

    /**
     * @SWG\Post(path="/evacuation_eauxs",
     *   tags={"Evacuation_eauxs"},
     *   summary="Add evacuation_eaux",
     *   description="Request to add Evacuation_eauxs",
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
     *         description="evacuation_eaux Response",
     *         @SWG\Schema(ref="#/definitions/evacuation_eauxs")
     *     )
     *  )
     */

    /**
     * insert evacuation_eaux
     * @return id of the evacuation_eaux created
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
        $aReturn = $this->genericPost($this->aProperties['schema_anc'], 'v_evacuation_eaux', $this->aProperties['schema_anc'].'.evacuation_eaux_id_eva_seq', 'id_eva');
        // Upload les fichiers.
        $this->uploadDocument('photos_f', 'anc_saisie_anc_evacuation_eaux');
        $this->uploadDocument('fiche_f', 'anc_saisie_anc_evacuation_eaux');
        $this->uploadDocument('schema_f', 'anc_saisie_anc_evacuation_eaux');
        $this->uploadDocument('documents_f', 'anc_saisie_anc_evacuation_eaux');
        $this->uploadDocument('plan_f', 'anc_saisie_anc_evacuation_eaux');
        //
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/evacuation_eauxs/{id_evacuation_eaux}",
     *   tags={"Evacuation_eauxs"},
     *   summary="update Evacuation_eauxs",
     *   description="Request to update Evacuation_eauxs",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Evacuation_eaux token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_evacuation_eaux",
     *     in="path",
     *     description="id of the Evacuation_eauxs",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/evacuation_eauxs")
     *     )
     *  )
     */

    /**
     * update evacuation_eauxs
     * @return id of evacuation_eauxs updated or error object if a evacuation_eauxs is not updated
     */
    function PUT() {
        if (empty($this->aValues['maj']))
            $this->aValues['maj'] = $_SESSION["ses_Login"];
        if (empty($this->aValues['maj_date']))
            $this->aValues['maj_date'] = date('Y-m-d');
        // Upload les fichiers.
        $this->uploadDocument('photos_f', 'anc_saisie_anc_evacuation_eaux');
        $this->uploadDocument('fiche_f', 'anc_saisie_anc_evacuation_eaux');
        $this->uploadDocument('schema_f', 'anc_saisie_anc_evacuation_eaux');
        $this->uploadDocument('documents_f', 'anc_saisie_anc_evacuation_eaux');
        $this->uploadDocument('plan_f', 'anc_saisie_anc_evacuation_eaux');
        //
        $aReturn = $this->genericPut($this->aProperties['schema_anc'], 'v_evacuation_eaux', 'id_eva');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/evacuation_eauxs",
     *   tags={"Evacuation_eauxs"},
     *   summary="delete Evacuation_eauxs",
     *   description="Request to delete Evacuation_eauxs",
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
     *     description="id of the evacuation_eaux",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="evacuation_eaux Response",
     *         @SWG\Schema(ref="#/definitions/evacuation_eauxs")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/evacuation_eauxs/{id_evacuation_eaux}",
     *   tags={"Evacuation_eauxs"},
     *   summary="delete Evacuation_eauxs",
     *   description="Request to delete Evacuation_eauxs",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Evacuation_eaux token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_evacuation_eaux",
     *     in="path",
     *     description="id of the Evacuation_eauxs",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/evacuation_eauxs")
     *     )
     *  )
     */

    /**
     * delete evacuation_eauxs
     * @return id of evacuation_eauxs deleted or error object if a evacuation_eauxs is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_anc'], 'v_evacuation_eaux', 'id_eva');
        return $aReturn['sMessage'];
    }
}
?>
<?php

/**
 * \file Filieres_agrees.class.inc
 * \class Filieres_agrees
 *
 * \author WAB <support.wab@veremes.com>.
 *
 * 	\brief This file contains the Filieres_agrees php class
 *
 * This class defines Rest Api to Vitis Filieres_agrees
 * 
 */
require_once __DIR__ . '/Anc.class.inc';
require_once 'Filieres_agree.class.inc';


class Filieres_agrees extends Anc {
    /**
     * @SWG\Definition(
     *   definition="/filieres_agrees",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/filieres_agrees")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Filieres_agrees",
     *   description="Operations about Filieres_agrees"
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
     * @SWG\Get(path="/filieres_agrees",
     *   tags={"Filieres_agrees"},
     *   summary="Get Filieres_agrees",
     *   description="Request to get Filieres_agrees",
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
     *         description="filieres_agree Response",
     *         @SWG\Schema(ref="#/definitions/filieres_agrees")
     *     )
     *  )
     */

    /**
     * get Filieres_agrees
     * @return  Filieres_agrees
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_anc'], "v_filieres_agrees", "id_fag");
        $sMessage = $aReturn['sMessage'];
        return $sMessage;
    }

    /**
     * @SWG\Post(path="/filieres_agrees",
     *   tags={"Filieres_agrees"},
     *   summary="Add filieres_agree",
     *   description="Request to add Filieres_agrees",
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
     *         description="filieres_agree Response",
     *         @SWG\Schema(ref="#/definitions/filieres_agrees")
     *     )
     *  )
     */

    /**
     * insert filieres_agree
     * @return id of the filieres_agree created
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
        // Conversion des dates
        if (isset($this->aValues['fag_en_date'])) {
            if ($this->aValues['fag_en_date'] == '')
                unset($this->aValues['fag_en_date']);
            else
                $this->aValues['fag_en_date'] = date_format(date_create_from_format('d/m/Y', $this->aValues['fag_en_date']), 'Y-m-d');
        }
        //
        $aReturn = $this->genericPost($this->aProperties['schema_anc'], 'v_filieres_agrees', $this->aProperties['schema_anc'].'.filieres_agrees_id_fag_seq', 'id_fag');
        // Upload les fichiers.
        $this->uploadDocument('photos_f', 'anc_saisie_anc_filieres_agree');
        $this->uploadDocument('fiche_f', 'anc_saisie_anc_filieres_agree');
        $this->uploadDocument('schema_f', 'anc_saisie_anc_filieres_agree');
        $this->uploadDocument('documents_f', 'anc_saisie_anc_filieres_agree');
        $this->uploadDocument('plan_f', 'anc_saisie_anc_filieres_agree');
        //
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/filieres_agrees/{id_filieres_agree}",
     *   tags={"Filieres_agrees"},
     *   summary="update Filieres_agrees",
     *   description="Request to update Filieres_agrees",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Filieres_agree token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_filieres_agree",
     *     in="path",
     *     description="id of the Filieres_agrees",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/filieres_agrees")
     *     )
     *  )
     */

    /**
     * update filieres_agrees
     * @return id of filieres_agrees updated or error object if a filieres_agrees is not updated
     */
    function PUT() {
        if (empty($this->aValues['maj']))
            $this->aValues['maj'] = $_SESSION["ses_Login"];
        if (empty($this->aValues['maj_date']))
            $this->aValues['maj_date'] = date('Y-m-d');
        // Upload les fichiers.
        $this->uploadDocument('photos_f', 'anc_saisie_anc_filieres_agree');
        $this->uploadDocument('fiche_f', 'anc_saisie_anc_filieres_agree');
        $this->uploadDocument('schema_f', 'anc_saisie_anc_filieres_agree');
        $this->uploadDocument('documents_f', 'anc_saisie_anc_filieres_agree');
        $this->uploadDocument('plan_f', 'anc_saisie_anc_filieres_agree');
        // Conversion des dates
        if (isset($this->aValues['fag_en_date'])) {
            if ($this->aValues['fag_en_date'] == '')
                unset($this->aValues['fag_en_date']);
            else
                $this->aValues['fag_en_date'] = date_format(date_create_from_format('d/m/Y', $this->aValues['fag_en_date']), 'Y-m-d');
        }
        //
        $aReturn = $this->genericPut($this->aProperties['schema_anc'], 'v_filieres_agrees', 'id_fag');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/filieres_agrees",
     *   tags={"Filieres_agrees"},
     *   summary="delete Filieres_agrees",
     *   description="Request to delete Filieres_agrees",
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
     *     description="id of the filieres_agree",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="filieres_agree Response",
     *         @SWG\Schema(ref="#/definitions/filieres_agrees")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/filieres_agrees/{id_filieres_agree}",
     *   tags={"Filieres_agrees"},
     *   summary="delete Filieres_agrees",
     *   description="Request to delete Filieres_agrees",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Filieres_agree token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_filieres_agree",
     *     in="path",
     *     description="id of the Filieres_agrees",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/filieres_agrees")
     *     )
     *  )
     */

    /**
     * delete filieres_agrees
     * @return id of filieres_agrees deleted or error object if a filieres_agrees is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_anc'], 'v_filieres_agrees', 'id_fag');
        return $aReturn['sMessage'];
    }
}
?>
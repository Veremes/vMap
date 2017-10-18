<?php

/**
 * \file Pretraitements.class.inc
 * \class Pretraitements
 *
 * \author WAB <support.wab@veremes.com>.
 *
 * 	\brief This file contains the Pretraitements php class
 *
 * This class defines Rest Api to Vitis Pretraitements
 * 
 */
require_once __DIR__ . '/Anc.class.inc';
require_once 'Pretraitement.class.inc';


class Pretraitements extends Anc {
    /**
     * @SWG\Definition(
     *   definition="/pretraitements",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/pretraitements")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Pretraitements",
     *   description="Operations about Pretraitements"
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
     * @SWG\Get(path="/pretraitements",
     *   tags={"Pretraitements"},
     *   summary="Get Pretraitements",
     *   description="Request to get Pretraitements",
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
     *         description="pretraitement Response",
     *         @SWG\Schema(ref="#/definitions/pretraitements")
     *     )
     *  )
     */

    /**
     * get Pretraitements
     * @return  Pretraitements
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_anc'], "v_pretraitement", "id_pretraitement");
        $sMessage = $aReturn['sMessage'];
        return $sMessage;
    }

    /**
     * @SWG\Post(path="/pretraitements",
     *   tags={"Pretraitements"},
     *   summary="Add pretraitement",
     *   description="Request to add Pretraitements",
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
     *         description="pretraitement Response",
     *         @SWG\Schema(ref="#/definitions/pretraitements")
     *     )
     *  )
     */

    /**
     * insert pretraitement
     * @return id of the pretraitement created
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
        $aDates = array('ptr_vi_date');
        foreach ($aDates as $sDate) {
            if (isset($this->aValues[$sDate])) {
                if ($this->aValues[$sDate] == '')
                    unset($this->aValues[$sDate]);
                else
                    $this->aValues[$sDate] = date_format(date_create_from_format('d/m/Y', $this->aValues[$sDate]), 'Y-m-d');
            }
        }        
        //
        $aReturn = $this->genericPost($this->aProperties['schema_anc'], 'v_pretraitement', $this->aProperties['schema_anc'].'.pretraitement_id_pretraitement_seq', 'id_pretraitement');
        // Upload les fichiers.
        $this->uploadDocument('photos_f', 'anc_saisie_anc_pretraitement');
        $this->uploadDocument('fiche_f', 'anc_saisie_anc_pretraitement');
        $this->uploadDocument('schema_f', 'anc_saisie_anc_pretraitement');
        $this->uploadDocument('documents_f', 'anc_saisie_anc_pretraitement');
        $this->uploadDocument('plan_f', 'anc_saisie_anc_pretraitement');
        //
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/pretraitements/{id_pretraitement}",
     *   tags={"Pretraitements"},
     *   summary="update Pretraitements",
     *   description="Request to update Pretraitements",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Pretraitement token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_pretraitement",
     *     in="path",
     *     description="id of the Pretraitements",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/pretraitements")
     *     )
     *  )
     */

    /**
     * update pretraitements
     * @return id of pretraitements updated or error object if a pretraitements is not updated
     */
    function PUT() {
        if (empty($this->aValues['maj']))
            $this->aValues['maj'] = $_SESSION["ses_Login"];
        if (empty($this->aValues['maj_date']))
            $this->aValues['maj_date'] = date('Y-m-d');
        // Upload les fichiers.
        $this->uploadDocument('photos_f', 'anc_saisie_anc_pretraitement');
        $this->uploadDocument('fiche_f', 'anc_saisie_anc_pretraitement');
        $this->uploadDocument('schema_f', 'anc_saisie_anc_pretraitement');
        $this->uploadDocument('documents_f', 'anc_saisie_anc_pretraitement');
        $this->uploadDocument('plan_f', 'anc_saisie_anc_pretraitement');
        //
        $aDates = array('ptr_vi_date');
        foreach ($aDates as $sDate) {
            if (isset($this->aValues[$sDate])) {
                if ($this->aValues[$sDate] == '')
                    unset($this->aValues[$sDate]);
                else
                    $this->aValues[$sDate] = date_format(date_create_from_format('d/m/Y', $this->aValues[$sDate]), 'Y-m-d');
            }
        }        
        //
        $aReturn = $this->genericPut($this->aProperties['schema_anc'], 'v_pretraitement', 'id_pretraitement');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/pretraitements",
     *   tags={"Pretraitements"},
     *   summary="delete Pretraitements",
     *   description="Request to delete Pretraitements",
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
     *     description="id of the pretraitement",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="pretraitement Response",
     *         @SWG\Schema(ref="#/definitions/pretraitements")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/pretraitements/{id_pretraitement}",
     *   tags={"Pretraitements"},
     *   summary="delete Pretraitements",
     *   description="Request to delete Pretraitements",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Pretraitement token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_pretraitement",
     *     in="path",
     *     description="id of the Pretraitements",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/pretraitements")
     *     )
     *  )
     */

    /**
     * delete pretraitements
     * @return id of pretraitements deleted or error object if a pretraitements is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_anc'], 'v_pretraitement', 'id_pretraitement');
        return $aReturn['sMessage'];
    }

    
}

?>
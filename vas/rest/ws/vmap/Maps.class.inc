<?php

/**
 * \file Maps.class.inc
 * \class Maps
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Maps php class
 *
 * This class defines Rest Api to Vmap Maps
 * 
 */
require_once 'Vmap.class.inc';
require_once 'Map.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class Maps extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/maps",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/maps")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Maps",
     *   description=""
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
        $this->aSelectedFields = Array("map_id", "crs_id", "name", "description", "crs_name", "extent", "catalog_index", "thumbnail", "theme_name", "theme_description", "maptheme_id", "groups");
    }

    /**
     * @SWG\Get(path="/maps",
     *   tags={"Maps"},
     *   summary="Get Maps",
     *   description="Request to get Maps",
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
     *     type="integer"
     *   ),
     * @SWG\Parameter(
     *     name="offset",
     *     in="query",
     *     description="index of first element",
     *     required=false,
     *     type="string"
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
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/maps")
     *     )
     *  )
     */

    /**
     * get Maps
     * @return  Maps
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'v_map', 'map_id', false, 'vmap_admin_map_vmap_admin_map');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Post(path="/maps",
     *   tags={"Maps"},
     *   summary="Add map",
     *   description="Request to add a map",
     *   operationId="POST",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="formData",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="name",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="extent",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="crs_id",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="description",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="catalog_index",
     *     in="formData",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="thumbnail",
     *     in="formData",
     *     description="Thumbnail of the map",
     *     required=false,
     *     type="file"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/maps")
     *     )
     *  )
     * )
     */

    /**
     * insert map
     * @return array containing the status and the message
     */
    function POST() {
        require $this->sRessourcesFile;

        // Vignette à uploader ?
        if (!empty($_FILES['thumbnail'])) {
            // la colonne thumbnail vaudra le nom du fichier
            $this->aValues["thumbnail"] = $_FILES['thumbnail']["name"];
        }

        // Création de la carte.
        $aReturn = $this->genericPost($this->aProperties['schema_vmap'], 'map', $this->aProperties['schema_vmap'] . '.seq_common', 'map_id');

        // Vignette à uploader ?
        if (!empty($_FILES['thumbnail'])) {
            $sImageDir = $this->aProperties['ws_data_dir'] . '/vitis/vmap_admin_map_vmap_admin_map/documents/' . $this->aValues["my_vitis_id"] . '/thumbnail/' . $_FILES['thumbnail']["name"];

            // Crée les répertoires si ils n'existent pas
            $sDirPath = $this->createElementFilesFolder('vmap_admin_map_vmap_admin_map', $this->aValues["my_vitis_id"]);
            $sDirColumnPath = $sDirPath . '/thumbnail';
            if (!is_dir($sDirColumnPath)) {
                mkdir($sDirColumnPath, 0777, true);
            }

            $sErrorMessage = uploadFile("thumbnail", "", $sImageDir, $_FILES['thumbnail']['size'] + 1);

            if ($sErrorMessage != "")
                writeToErrorLog($sErrorMessage);
        }

        // Si création OK -> maj des groupes rattachés à la carte.
        if ($aReturn['sStatus'] == 1) {
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $oMap = new Map($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
            $oMap->GET();
            // Groupes à rattacher à la carte ?
            if (!empty($this->aValues['groups'])) {
                $aGroups = explode('|', $this->aValues['groups']);
                foreach ($aGroups as $iGroupId) {
                    $sSql = str_replace('[map_id]', $this->aValues["my_vitis_id"], $aSql['insertMapGroups']);
                    $sSql = str_replace('[group_id]', $iGroupId, $sSql);
                    $sSql = str_replace('[sSchemaVmap]', $this->aProperties['schema_vmap'], $sSql);
                    $resultat = $this->oConnection->oBd->execute($sSql);
                    if ($this->oConnection->oBd->enErreur()) {
                        $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                        $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                        $aXmlRacineAttribute['status'] = 0;
                        $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    }
                }
            }
        } else {
            $sMessage = $aReturn['sMessage'];
        }
        return $sMessage;
    }

    /**
     * @SWG\Put(path="/maps/{map_id}",
     *   tags={"Maps"},
     *   summary="Update Map",
     *   description="Request to update map",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   consumes= { "multipart/form-data"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="map_id",
     *     in="path",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="extent_id",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="crs_id",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="name",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="description",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="catalog_index",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="id_theme",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="thumbnail",
     *     in="formData",
     *     description="Thumbnail of the map",
     *     required=false,
     *     type="file"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/maps")
     *     ),
     * 
     *  )
     */

    /**
     * modify map
     * @return array containing the status and the message
     */
    function PUT() {
        require $this->sRessourcesFile;
        // Vignette à uploader ?
        if (!empty($this->aValues["thumbnail_file"])) {

            $sImageDir = $this->aProperties['ws_data_dir'] . '/vitis/vmap_admin_map_vmap_admin_map/documents/' . $this->aValues["my_vitis_id"] . '/thumbnail/' . $this->aValues["thumbnail_name"];

            // Crée les répertoires si ils n'existent pas
            $sDirPath = $this->createElementFilesFolder('vmap_admin_map_vmap_admin_map', $this->aValues["my_vitis_id"]);
            $sDirColumnPath = $sDirPath . '/thumbnail';
            if (!is_dir($sDirColumnPath)) {
                mkdir($sDirColumnPath, 0777, true);
            }

            // la colonne thumbnail vaudra le nom du fichier
            $this->aValues["thumbnail"] = $this->aValues["thumbnail_name"];
            $fp = fopen($sImageDir, "w");
            fwrite($fp, $this->aValues["thumbnail_file"]);
            fclose($fp);
        }
        // Mise à jour.
        $aReturn = $this->genericPut($this->aProperties['schema_vmap'], 'map', 'map_id');
        // Si mise à jour OK -> maj des groupes rattachés à la carte.
        if ($aReturn['sStatus'] == 1) {
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            // Supprime les groupes rattachés à la carte.
            $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'map_group', 'map_id', $this->aValues["my_vitis_id"]);
            // Groupes à rattacher à la carte ?
            if (!empty($this->aValues['groups'])) {
                $aGroups = explode('|', $this->aValues['groups']);
                foreach ($aGroups as $iGroupId) {
                    $sSql = str_replace('[map_id]', $this->aValues["my_vitis_id"], $aSql['insertMapGroups']);
                    $sSql = str_replace('[group_id]', $iGroupId, $sSql);
                    $sSql = str_replace('[sSchemaVmap]', $this->aProperties['schema_vmap'], $sSql);
                    $resultat = $this->oConnection->oBd->execute($sSql);
                    if ($this->oConnection->oBd->enErreur()) {
                        $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                        $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                        $aXmlRacineAttribute['status'] = 0;
                        $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    }
                }
            }
        } else {
            $sMessage = $aReturn['sMessage'];
        }
        return $sMessage;
    }

    /**
     * @SWG\Delete(path="/maps/",
     *   tags={"Maps"},
     *   summary="delete Map",
     *   description="Request to delete Map",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="map token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id of the maps",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/maps")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/maps/{map_id}",
     *   tags={"Maps"},
     *   summary="delete Map",
     *   description="Request to delete Map",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="map token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="map_id",
     *     in="path",
     *     description="id of the map",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/maps")
     *     )
     *  )
     */

    /**
     * delete map
     * @return id of map deleted or error object if a map is not deleted
     */
    function DELETE() {
        if (!empty($this->aValues['idList'])) {
            $aIdList = explode("|", $this->aValues['idList']);
        }
        if (!empty($this->aPath['2'])) {
            $aIdList = array($this->aPath['2']);
        }

        $aReturn = $this->genericDelete($this->aProperties['schema_vmap'], 'map', 'map_id');

        // Supprime les fichiers uploadés
        $this->deleteElementsDocuments('vmap_admin_map_vmap_admin_map', $aIdList);

        return $aReturn['sMessage'];
    }
}

?>
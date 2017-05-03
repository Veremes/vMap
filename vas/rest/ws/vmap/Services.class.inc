<?php

/**
 * \file Services.class.inc
 * \class Services
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Services php class
 *
 * This class defines Rest Api to Vmap Services
 * 
 */
require_once 'Vmap.class.inc';
require_once 'Service.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class Services extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/services",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/services")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Services",
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
        $this->aSelectedFields = Array("service_id", "name", "service_type_id", "description", "url", "key", "thumbnail", "lang", "imagery", "service_type_version", "service_type_type", "service_options", "service_vm4ms");
    }

    /**
     * @SWG\Get(path="/services",
     *   tags={"Services"},
     *   summary="Get Services",
     *   description="Request to get Services",
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
     *     type="boolean"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/services")
     *     )
     *  )
     */

    /**
     * get Services
     * @return  Services
     */
    function GET() {
        $this->genericGet($this->aProperties['schema_vmap'], 'service', 'service_id', false, 'vmap_admin_map_vmap_services');
        
        // Remplace les balises
        for ($i = 0; $i < count($this->aObjects); $i++) {
            $this->aObjects[$i]->aFields['url'] = str_replace('[ms_cgi_url]', $this->aProperties['ms_cgi_url'], $this->aObjects[$i]->aFields['url']);
        }
        
        // Reformatte la réponse 
        if (isset($this->aValues['sEncoding'])) {
            $sEncoding = $this->aValues['sEncoding'];
        } else {
            $sEncoding = null;
        }if (isset($this->aValues['sSourceEncoding'])) {
            $sSourceEncoding = $this->aValues['sSourceEncoding'];
        } else {
            $sSourceEncoding = null;
        }if (isset($this->aValues['output'])) {
            $output = $this->aValues['output'];
        } else {
            $output = null;
        }
        $aXmlRacineAttribute['status'] = 1;
        $sMessage = $this->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $output);
        $aReturn = array('sStatus' => $aXmlRacineAttribute['status'], "sMessage" => $sMessage);

        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Post(path="/services",
     *   tags={"Services"},
     *   summary="Add service",
     *   description="Request to add a service",
     *   operationId="POST",
     *   produces={"application/xml", "application/json"},
     *   consumes= { "multipart/form-data"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="formData",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="service_type_id",
     *     in="formData",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="name",
     *     in="formData",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="description",
     *     in="formData",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="url",
     *     in="formData",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="key",
     *     in="formData",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="service_type_version",
     *     in="formData",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="thumbnail",
     *     in="formData",
     *     description="Thumbnail of the service",
     *     required=false,
     *     type="file"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/services")
     *     )
     *
     *  )
     * 
     * )
     */

    /**
     * insert service
     * @return array containing the status and the message
     */
    function POST() {

        // Vignette à uploader ?
        if (!empty($_FILES['thumbnail'])) {
            // la colonne thumbnail vaudra le nom du fichier
            $this->aValues["thumbnail"] = $_FILES['thumbnail']["name"];
        }

        $aReturn = $this->genericPost($this->aProperties['schema_vmap'], 'service', $this->aProperties['schema_vmap'] . '.seq_common', 'service_id');

        // Vignette à uploader ?
        if (!empty($_FILES['thumbnail'])) {
            $sImageDir = $this->aProperties['ws_data_dir'] . '/vitis/vmap_admin_map_vmap_services/documents/' . $this->aValues["my_vitis_id"] . '/thumbnail/' . $_FILES['thumbnail']["name"];

            // Crée les répertoires si ils n'existent pas
            $sDirPath = $this->createElementFilesFolder('vmap_admin_map_vmap_services', $this->aValues["my_vitis_id"]);
            $sDirColumnPath = $sDirPath . '/thumbnail';
            if (!is_dir($sDirColumnPath)) {
                mkdir($sDirColumnPath, 0777, true);
            }

            $sErrorMessage = uploadFile("thumbnail", "", $sImageDir, $_FILES['thumbnail']['size'] + 1);

            if ($sErrorMessage != "")
                writeToErrorLog($sErrorMessage);
        }

        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/services/{service_id}",
     *   tags={"Services"},
     *   summary="Update Service",
     *   description="Request to update service",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="service_id",
     *     in="path",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="service_type_id",
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
     *     name="url",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="key",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="service_type_version",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="thumbnail",
     *     in="formData",
     *     description="Thumbnail of the service",
     *     required=false,
     *     type="file"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/services")
     *     ),
     * 
     *  )
     */

    /**
     * modify service
     * @return array containing the status and the message
     */
    function PUT() {
        // Vignette à uploader ?
        if (!empty($this->aValues["thumbnail_file"])) {

            $sImageDir = $this->aProperties['ws_data_dir'] . '/vitis/vmap_admin_map_vmap_services/documents/' . $this->aValues["my_vitis_id"] . '/thumbnail/' . $this->aValues["thumbnail_name"];

            // Crée les répertoires si ils n'existent pas
            $sDirPath = $this->createElementFilesFolder('vmap_admin_map_vmap_services', $this->aValues["my_vitis_id"]);
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

        $aReturn = $this->genericPut($this->aProperties['schema_vmap'], 'service', 'service_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/services/",
     *   tags={"Services"},
     *   summary="delete Service",
     *   description="Request to delete Service",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="service token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id of the services",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/services")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/services/{service_id}",
     *   tags={"Services"},
     *   summary="delete Service",
     *   description="Request to delete Service",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="service token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="service_id",
     *     in="path",
     *     description="id of the service",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/services")
     *     )
     *  )
     */

    /**
     * delete service
     * @return id of service deleted or error object if a service is not deleted
     */
    function DELETE() {
        if (!empty($this->aValues['idList'])) {
            $aIdList = explode("|", $this->aValues['idList']);
        }
        if (!empty($this->aPath['2'])) {
            $aIdList = array($this->aPath['2']);
            $this->aValues['idList'] = $this->aPath['2'];
        }
        require $this->sRessourcesFile;
        $sSql = str_replace('[idList]', str_replace('|', ',', $this->aValues['idList']), $aSql['getTotalServiceLayers']);
        $sSql = str_replace('[sSchemaVmap]', $this->aProperties['schema_vmap'], $sSql);
        $resultat = $this->oConnection->oBd->execute($sSql);
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        } else {
            if ($this->oConnection->oBd->objetSuivant($resultat)->nb_layers > 0) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                $oError = new VitisError(1, 'ERROR_SERVICE_DELETE_VMAP_MAP_SERVICE');
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            } else {
                $aReturn = $this->genericDelete($this->aProperties['schema_vmap'], 'service', 'service_id');
                $sMessage = $aReturn['sMessage'];
                // Supprime les fichiers uploadés
                $this->deleteElementsDocuments('vmap_admin_map_vmap_services', $aIdList);
            }
            return $sMessage;
        }
    }

}

?>

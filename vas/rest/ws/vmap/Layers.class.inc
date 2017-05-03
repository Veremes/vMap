<?php

/**
 * \file Layers.class.inc
 * \class Layers
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Layers php class
 *
 * This class defines Rest Api to Vmap Layers
 * 
 */
require_once 'Vmap.class.inc';
require_once 'Layer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Form.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class Layers extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/layers",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/layers")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Layers",
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
    }

    /**
     * @SWG\Get(path="/layers",
     *   tags={"Layers"},
     *   summary="Get Layers",
     *   description="Request to get Layers",
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
     *     type="integer",
     *     default="4"
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
     *         @SWG\Schema(ref="#/definitions/layers")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/layers/{layer_id}/form/{form}",
     *   tags={"Layers"},
     *   summary="Get Layers",
     *   description="Request to get Layers",
     *   operationId="GET",
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="layer_id",
     *     in="path",
     *     description="Layer id",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="form",
     *     in="path",
     *     description="form",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layers")
     *     )
     *  )
     */

    /**
     * get Layers
     * @return  Layers
     */
    function GET() {
        // /layers/{layer_id}/form/{form}
        if (isset($this->aPath[4])) {
            $layerId = $this->aPath[2];
            $formName = $this->aPath[4];
            $form = file_get_contents($this->aProperties['ws_data_dir'] . '/vmap/layer/' . $layerId . '/forms/' . $formName . '.json');
            $jsContent = file_get_contents($this->aProperties['ws_data_dir'] . '/vmap/layer/' . $layerId . '/forms/ressources/' . $formName . '.js');
            $cssContent = file_get_contents($this->aProperties['ws_data_dir'] . '/vmap/layer/' . $layerId . '/forms/ressources/' . $formName . '.css');

            $output = array(json_decode($form), $jsContent, $cssContent);
            return json_encode($output);
        }

        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'v_layer', 'layer_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Post(path="/layers",
     *   tags={"Layers"},
     *   summary="Add layer",
     *   description="Request to add a layer",
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
     *     name="theme_id",
     *     in="formData",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="service_id",
     *     in="formData",
     *     description="",
     *     required=true,
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
     *     name="visible",
     *     in="formData",
     *     description="",
     *     required=false,
     *     type="boolean"
     *   ),
     * @SWG\Parameter(
     *     name="bo_id",
     *     in="formData",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="layer_list",
     *     in="formData",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layers")
     *     )
     *
     *  )
     * 
     * )
     */
    /**
     * @SWG\Post(path="/layers/{layer_id}/form/{form}",
     *   tags={"Layers"},
     *   summary="Generates the layer form",
     *   description="Request to add a layer form",
     *   operationId="POST",
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="formData",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="layer_id",
     *     in="path",
     *     description="Layer id",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="form",
     *     in="path",
     *     description="form",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layers")
     *     )
     *  )
     * )
     */

    /**
     * insert layer
     * @return array containing the status and the message
     */
    function POST() {

        // /layers/{layer_id}/form/{form}
        if (isset($this->aPath[4])) {
            if (isset($this->oConnection->oError) && !empty($this->oConnection->oError)) {
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $this->oConnection->oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                return $sMessage;
            }
            if (!in_array('vmap_admin', $this->oConnection->aPrivileges)) {
                $oError = new VitisError(0, 'INSUFFICIENT_PRIVILEGES');
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                return $sMessage;
            }
            $layerId = $this->aPath[2];
            $sFormName = $this->aPath[4];
            return $this->generateEmptyForm($layerId, $sFormName);
        }

        $aReturn = $this->genericPost($this->aProperties['schema_vmap'], 'layer', $this->aProperties['schema_vmap'] . '.seq_common', 'layer_id');
        return $aReturn['sMessage'];
    }

    /**
     * Generate the form
     * @param string $layerId
     * @param string $sFormName
     * @return string jsonContent of the form
     */
    function generateEmptyForm($layerId, $sFormName) {

        $oForm = new Form($this->aProperties, $this->oConnection);

        $aRows = array();
        $aForm = $oForm->generateFormByRows($aRows, $layerId, $sFormName);

        $sDirPath = $this->aProperties['ws_data_dir'] . '/vmap/layer/' . $layerId;

        // création de l'arborescence si elle n'existe pas
        if (!is_dir($this->aProperties['ws_data_dir'] . '/vmap')) {
            @mkdir($this->aProperties['ws_data_dir'] . '/vmap');
        }
        if (!is_dir($this->aProperties['ws_data_dir'] . '/vmap/layer')) {
            @mkdir($this->aProperties['ws_data_dir'] . '/vmap/layer');
        }
        if (!is_dir($sDirPath)) {
            @mkdir($sDirPath);
        }
        if (!is_dir($sDirPath . '/forms')) {
            @mkdir($sDirPath . '/forms');
        }
        if (!is_dir($sDirPath . '/forms/ressources')) {
            @mkdir($sDirPath . '/forms/ressources');
        }

        $JSONcontent = json_encode($aForm);

        // écrit le fichier demandé
        $formFile = fopen($sDirPath . '/forms/' . $sFormName . '.json', 'w');
        fwrite($formFile, $JSONcontent);
        fclose($formFile);

        // écrit les autres fichiers si ils n'existent pas
        if (!file_exists($sDirPath . '/forms/default.json')) {
            $formFile = fopen($sDirPath . '/forms/default.json', 'w');
            fwrite($formFile, $JSONcontent);
            fclose($formFile);
        }
        if (!file_exists($sDirPath . '/forms/published.json')) {
            $formFile = fopen($sDirPath . '/forms/published.json', 'w');
            fwrite($formFile, $JSONcontent);
            fclose($formFile);
        }
        if (!file_exists($sDirPath . '/forms/custom.json')) {
            $formFile = fopen($sDirPath . '/forms/custom.json', 'w');
            fwrite($formFile, $JSONcontent);
            fclose($formFile);
        }

        return $JSONcontent;
    }

    /**
     * @SWG\Put(path="/layers/{layer_id}",
     *   tags={"Layers"},
     *   summary="Update Layer",
     *   description="Request to update layer",
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
     *     name="layer_id",
     *     in="path",
     *     description="",
     *     required=true,
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
     *     name="theme_id",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="service_id",
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
     *     name="visible",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="boolean"
     *   ),
     * @SWG\Parameter(
     *     name="bo_id",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="layer_list",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layers")
     *     ),
     * 
     *  )
     */
    /**
     * @SWG\Put(path="/layers/{layer_id}/form/{form}",
     *   tags={"Layers"},
     *   summary="Modify layer form",
     *   description="Request to modify a layer form",
     *   operationId="PUT",
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="layer_id",
     *     in="path",
     *     description="Layer id",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="form",
     *     in="path",
     *     description="form name (default, published, custom)",
     *     required=true,
     *     type="integer",
     *     format="string"
     *   ),
     *   @SWG\Parameter(
     *     name="json_file",
     *     in="formData",
     *     description="Wsubform.json",
     *     required=false,
     *     type="file"
     *   ),
     *  @SWG\Parameter(
     *     name="js_file",
     *     in="formData",
     *     description="Javascript file link with WSubform",
     *     required=false,
     *     type="file"
     *   ),
     *  @SWG\Parameter(
     *     name="css_file",
     *     in="formData",
     *     description="Css file link with WSubform",
     *     required=false,
     *     type="file"
     *   ),
     *   @SWG\Parameter(
     *     name="cmd",
     *     in="query",
     *     description="Perso_Save, Perso_Published, Default_Published, Perso_Reset, Default_Reset",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layers")
     *     )
     *  )
     * )
     */

    /**
     * modify layer
     * @return array containing the status and the message
     */
    function PUT() {

        // /layers/{layer_id}/form/{form}
        if (isset($this->aPath[4])) {
            if (isset($this->oConnection->oError) && !empty($this->oConnection->oError)) {
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $this->oConnection->oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                return $sMessage;
            }
            if (!in_array('vmap_admin', $this->oConnection->aPrivileges)) {
                $oError = new VitisError(0, 'INSUFFICIENT_PRIVILEGES');
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                return $sMessage;
            }
            $layerId = $this->aPath[2];
            $sFormName = $this->aPath[4];
            $sComand = $this->aValues['cmd'];
            $this->putForm($layerId, $sFormName, $sComand);
        }

        $aReturn = $this->genericPut($this->aProperties['schema_vmap'], 'layer', 'layer_id');
        return $aReturn['sMessage'];
    }

    /**
     * Change the business object form using this->aValues
     * @param string $layerId
     * @param string $formName
     * @param string $sComand
     */
    function putForm($layerId, $sFormName, $sComand) {

        $sDirPath = $this->aProperties['ws_data_dir'] . '/vmap/layer/' . $layerId;

        // création de l'arborescence si elle n'existe pas
        if (!is_dir($this->aProperties['ws_data_dir'] . '/vmap')) {
            @mkdir($this->aProperties['ws_data_dir'] . '/vmap');
        }
        if (!is_dir($this->aProperties['ws_data_dir'] . '/vmap/layer')) {
            @mkdir($this->aProperties['ws_data_dir'] . '/vmap/layer');
        }
        if (!is_dir($sDirPath)) {
            @mkdir($sDirPath);
        }
        if (!is_dir($sDirPath . '/forms')) {
            @mkdir($sDirPath . '/forms');
        }
        if (!is_dir($sDirPath . '/forms/ressources')) {
            @mkdir($sDirPath . '/forms/ressources');
        }

        if ($this->aValues["cmd"]) {
            switch ($this->aValues["cmd"]) {
                case "Perso_Save":

                    if (!empty($this->aValues['Json'])) {
                        $pFile = fopen($sDirPath . '/forms/' . $sFormName . '.json', 'w');
                        if (fwrite($pFile, $this->aValues["Json"]) == FALSE) {
                            writeToErrorLog('ERROR: ' . $sFormName . '.json save failed');
                        }
                        fclose($pFile);
                    }

                    if ($this->aValues["Js"] != "") {
                        $pFileJS = fopen($sDirPath . '/forms/ressources/' . $sFormName . '.js', 'w+');
                        if (fwrite($pFileJS, $this->aValues["Js"]) == FALSE) {
                            writeToErrorLog('ERROR: ' . $sFormName . '.js save failed');
                        }
                        fclose($pFileJS);
                    }

                    if ($this->aValues["Css"] != "") {
                        $pFileCSS = fopen($sDirPath . '/forms/ressources/' . $sFormName . '.css', 'w+');
                        if (fwrite($pFileCSS, $this->aValues["Css"]) == FALSE) {
                            writeToErrorLog('ERROR: ' . $sFormName . '.css save failed');
                        }
                        fclose($pFileCSS);
                    }

                    break;
                case "Perso_Published":

                    @unlink($sDirPath . "/forms/published.json");
                    copy($sDirPath . "/forms/custom.json", $sDirPath . "/forms/published.json");

                    if (file_exists($sDirPath . "/forms/ressources/custom.js")) {
                        if (file_exists($sDirPath . "/forms/ressources/published.js")) {
                            @unlink($sDirPath . "/forms/ressources/published.js");
                        }
                        copy($sDirPath . "/forms/ressources/custom.js", $sDirPath . "/forms/ressources/published.js");
                    }
                    if (file_exists($sDirPath . "/forms/ressources/custom.css")) {
                        if (file_exists($sDirPath . "/forms/ressources/published.css")) {
                            @unlink($sDirPath . "/forms/ressources/published.css");
                        }
                        copy($sDirPath . "/forms/ressources/custom.css", $sDirPath . "/forms/ressources/published.css");
                    }

                    break;
                case "Default_Published":

                    @unlink($sDirPath . "/forms/published.json");
                    copy($sDirPath . "/forms/default.json", $sDirPath . "/forms/published.json");

                    break;
                case "Perso_Reset":

                    @unlink($sDirPath . "/forms/custom.json");
                    copy($sDirPath . "/forms/default.json", $sDirPath . "/forms/custom.json");

                    break;
                case "Default_Reset" :
                    @unlink($sDirPath . "/forms/default.json");
                    $this->generateEmptyForm($layerId, $sFormName);
                    break;
            }
        }
    }

    /**
     * @SWG\Delete(path="/layers/",
     *   tags={"Layers"},
     *   summary="delete Layer",
     *   description="Request to delete Layer",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="layer token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id of the layers",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layers")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/layers/{layer_id}",
     *   tags={"Layers"},
     *   summary="delete Layer",
     *   description="Request to delete Layer",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="layer token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="layer_id",
     *     in="path",
     *     description="id of the layer",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layers")
     *     )
     *  )
     */

    /**
     * delete layer
     * @return id of layer deleted or error object if a layer is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vmap'], 'layer', 'layer_id');
        return $aReturn['sMessage'];
    }

}

?>
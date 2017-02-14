<?php

/**
 * \file BusinessObjects.class.inc
 * \class BusinessObjects
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the BusinessObjects php class
 *
 * This class defines Rest Api to Vitis businessobjects
 * 
 */
require_once 'Vmap.class.inc';
require_once 'BusinessObject.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Form.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';
require_once 'vmlib/logUtil.inc';

class BusinessObjects extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/businessobjects",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/businessobjects")
     *   }
     * )
     * * @SWG\Tag(
     *   name="BusinessObjects",
     *   description=""
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function BusinessObjects($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->aSelectedFields = Array("business_object_id", "title", "id_field", "database", "schema", "table", "sql_summary", "sql_list", "sorted_by", "geom_column", "search_field", "result_field", "search_use_strict", "event_id", "index");
    }

    /**
     * @SWG\Get(path="/businessobjects",
     *   tags={"BusinessObjects"},
     *   summary="Get BusinessObjects",
     *   description="Request to get BusinessObjects",
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
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/users")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/businessobjects/{business_object_id}/fields", 
     *   tags={"BusinessObjects"},
     *   summary="BusinessObject table fields",
     *   description="Request to get the business object table fields",
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
     *     name="business_object_id",
     *     in="path",
     *     description="business object id",
     *     required=true,
     *     type="integer",
     *     format="int32"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjects")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/businessobjects/{business_object_id}/form/{form}", 
     *   tags={"BusinessObjects"},
     *   summary="Query BusinessObject",
     *   description="Request to query the business object",
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
     *     name="business_object_id",
     *     in="path",
     *     description="business object id",
     *     required=true,
     *     type="integer",
     *     format="int32"
     *   ),
     *   @SWG\Parameter(
     *     name="form",
     *     in="path",
     *     description="form name (default, published, custom)",
     *     required=true,
     *     type="integer",
     *     format="int32"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjects")
     *     )
     *  )
     */

    /**
     * get BusinessObjects
     * @return BusinessObjects
     */
    function GET() {

        // /businessobjects/{business_object_id}/form/{form}
        if (isset($this->aPath[4])) {
            $businessObjectId = $this->aPath[2];
            $formName = $this->aPath[4];
            $form = file_get_contents($this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $businessObjectId . '/forms/' . $formName . '.json');

            if (is_file($this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $businessObjectId . '/forms/ressources/' . $formName . '.js')) {
                $jsContent = file_get_contents($this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $businessObjectId . '/forms/ressources/' . $formName . '.js');
            } else {
                $jsContent = false;
            }
            if (is_file($this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $businessObjectId . '/forms/ressources/' . $formName . '.css')) {
                $cssContent = file_get_contents($this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $businessObjectId . '/forms/ressources/' . $formName . '.css');
            } else {
                $cssContent = false;
            }

            $output = array(json_decode($form), $jsContent, $cssContent);
            return json_encode($output);
        }
        // /businessobjects/{business_object_id}/fields
        else if (isset($this->aPath[3])) {

            // Objet BusinessObject correspondant
            $oBusinessObject = new BusinessObject($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
            $oBusinessObject->GET();

            // Paramètres retenus dans le business object
            $bo_title = $oBusinessObject->aFields['title'];
            $bo_database = $oBusinessObject->aFields['database'];
            $bo_schema = $oBusinessObject->aFields['schema'];
            $bo_table = $oBusinessObject->aFields['table'];
            $bo_id_field = $oBusinessObject->aFields['id_field'];
            $geom_column = $oBusinessObject->aFields['geom_column'];

            $oForm = new Form($this->aProperties, $this->oConnection);
            $aTableColumns = $oForm->getTableColumns($bo_schema, $bo_table);
            $aRows = $oForm->generateRowsByTableColumns($aTableColumns);

            return json_encode($aRows);
        }
        // /businessobjects/{business_object_id}
        else {
            $aReturn = $this->genericGet($this->aProperties['schema_vmap'], "business_object", "business_object_id");
            return $aReturn['sMessage'];
        }
    }

    /**
     * @SWG\Post(path="/businessobjects",
     *   tags={"BusinessObjects"},
     *   summary="Add business_object",
     *   description="Request to add a business_object",
     *   operationId="POST",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="business_object_id",
     *     in="query",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="title",
     *     in="query",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="database",
     *     in="query",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="schema",
     *     in="query",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="table",
     *     in="query",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="id_field",
     *     in="query",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sql_summary",
     *     in="query",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sql_list",
     *     in="query",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sorted_by",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="geom_column",
     *     in="query",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjects")
     *     )
     *  )
     * )
     */
    /**
     * @SWG\Post(path="/businessobjects/{business_object_id}/form/{form}",
     *   tags={"BusinessObjects"},
     *   summary="Add business_object",
     *   description="Request to add a business_object form",
     *   operationId="POST",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="business_object_id",
     *     in="path",
     *     description="business_object_id",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="form",
     *     in="path",
     *     description="form name (default, published, custom)",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="fields",
     *     in="query",
     *     description="list of fields separed by | ",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjects")
     *     )
     *  )
     * )
     */

    /**
     * insert business_object
     * @return array containing the status and the message
     */
    function POST() {
        if (isset($this->aPath[4])) {
            $sBusinessObjectId = $this->aPath[2];
            $sFormName = $this->aPath[4];
            $aFields = explode("|", $this->aValues['fields']);
            return $this->generateBusinessObjectForm($sBusinessObjectId, $sFormName, $aFields);
        } else {
            $aReturn = $this->genericPost($this->aProperties['schema_vmap'], 'business_object', '', 'business_object_id');
            return $aReturn['sMessage'];
        }
    }

    /**
     * Generate the form
     * @param string $sBusinessObjectId
     * @param string $sFormName
     * @param array $aFields fields to use
     * @return string jsonContent of the form
     */
    function generateBusinessObjectForm($sBusinessObjectId, $sFormName, $aFields) {

        // Objet BusinessObject correspondant
        $oBusinessObject = new BusinessObject($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
        $oBusinessObject->GET();

        // Paramètres retenus dans le business object
        $bo_title = $oBusinessObject->aFields['title'];
        $bo_database = $oBusinessObject->aFields['database'];
        $bo_schema = $oBusinessObject->aFields['schema'];
        $bo_table = $oBusinessObject->aFields['table'];
        $bo_id_field = $oBusinessObject->aFields['id_field'];
        $geom_column = $oBusinessObject->aFields['geom_column'];

        $oForm = new Form($this->aProperties, $this->oConnection);
        $aTableColumns = $oForm->getTableColumns($bo_schema, $bo_table);

        // Supprime de la liste des champs générés ceux qui ne sont pas présents dans $aFields        
        $aColumnsToUse = array();
        for ($i = 0; $i < count($aTableColumns); $i++) {
            if (in_array($aTableColumns[$i]['column_name'], $aFields)) {
                array_push($aColumnsToUse, $aTableColumns[$i]);
            }
        }

        $aRows = $oForm->generateRowsByTableColumns($aColumnsToUse);
        $aForm = $oForm->generateFormByRows($aRows, $bo_title, $sFormName);

        $sDirPath = $this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $sBusinessObjectId;

        // création de l'arborescence si elle n'existe pas
        if (!is_dir($this->aProperties['ws_data_dir'] . '/vmap')) {
            @mkdir($this->aProperties['ws_data_dir'] . '/vmap');
        }
        if (!is_dir($this->aProperties['ws_data_dir'] . '/vmap/business_object')) {
            @mkdir($this->aProperties['ws_data_dir'] . '/vmap/business_object');
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
     * @SWG\Put(path="/businessobjects/{business_object_id}",
     *   tags={"BusinessObjects"},
     *   summary="Update BusinessObject",
     *   description="Request to update business_object",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="business_object_id",
     *     in="path",
     *     description="business object id",
     *     required=true,
     *     type="integer",
     *     format="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjects")
     *     ),
     * 
     *  )
     */
    /**
     * @SWG\Put(path="/businessobjects/{business_object_id}/form/{form}",
     *   tags={"BusinessObjects"},
     *   summary="Update BusinessObject",
     *   description="Request to update business_object form",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="business_object_id",
     *     in="path",
     *     description="business object id",
     *     required=true,
     *     type="integer",
     *     format="string"
     *   ),
     * @SWG\Parameter(
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
     *     description="command send from the studio",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjects")
     *     ),
     * 
     *  )
     */

    /**
     * modify the business object
     * @return array containing the status and the message
     */
    function PUT() {
        if (isset($this->aPath[4])) {
            $sBusinessObjectId = $this->aPath[2];
            $sFormName = $this->aPath[4];
            $sComand = $this->aValues['cmd'];
            $this->putForm($sBusinessObjectId, $sFormName, $sComand);
        } else {
            $aReturn = $this->genericPut($this->aProperties['schema_vmap'], 'business_object', 'business_object_id');
            return $aReturn['sMessage'];
        }
    }

    /**
     * Change the business object form using this->aValues
     * @param string $sBusinessObjectId
     * @param string $formName
     * @param string $sComand
     */
    function putForm($sBusinessObjectId, $sFormName, $sComand) {

        $sDirPath = $this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $sBusinessObjectId;

        // création de l'arborescence si elle n'existe pas
        if (!is_dir($this->aProperties['ws_data_dir'] . '/vmap')) {
            @mkdir($this->aProperties['ws_data_dir'] . '/vmap');
        }
        if (!is_dir($this->aProperties['ws_data_dir'] . '/vmap/business_object')) {
            @mkdir($this->aProperties['ws_data_dir'] . '/vmap/business_object');
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
                    $aFields = explode("|", $this->aValues['field']);
                    $this->generateBusinessObjectForm($sBusinessObjectId, $sFormName, $aFields);
                    break;
            }
        }
    }

    /**
     * @SWG\Delete(path="/businessobjects",
     *   tags={"BusinessObjects"},
     *   summary="delete BusinessObject",
     *   description="Request to delete BusinessObject",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="business_object token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id of the businessobjects",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjects")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/businessobjects/{business_object_id}",
     *   tags={"BusinessObjects"},
     *   summary="delete BusinessObject",
     *   description="Request to delete BusinessObject",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="business_object token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="business_object_id",
     *     in="path",
     *     description="id of the business_object",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjects")
     *     )
     *  )
     */

    /**
     * delete business_object
     * @return id of business_object deleted or error object if a business_object is not deleted
     */
    function DELETE() {

        $aBos = array();

        //forme 'veremes_cadastre_parcelle'|'veremes_cadatre_commune'
        if (!empty($this->aValues['idList'])) {
            $aBos = explode("|", $this->aValues['idList']);
            for ($i = 0; $i < count($aBos); $i++) {                        
                if (substr($aBos[$i], 0, 1) === "'") {
                    $aBos[$i] = substr($aBos[$i], 1);
                }    
                if (substr($aBos[$i], -1) === "'") {
                    $aBos[$i] = substr($aBos[$i], 0, -1);
                }         
            }
        }
        if (!empty($this->aPath[2])) {
            array_push($aBos, $this->aPath[2]);
        }

        for ($i = 0; $i < count($aBos); $i++) {
            $this->removeBusinessObjectFiles($aBos[$i]);
        }

        // Supprime l'objet métier de la base
        $aReturn = $this->genericDelete($this->aProperties['schema_vmap'], 'business_object', 'business_object_id');
        return $aReturn['sMessage'];

        return 0;
    }

    function removeBusinessObjectFiles($sBusinessObjectId) {

        // Supprime les fichiers liés à l'objet métier
        $sDirPath = $this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $sBusinessObjectId;
        clearDir($sDirPath);
    }

}

?>
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
     * @param type $bShortcut false to reinit variables
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        parent::__construct($aPath, $aValues, $properties, $bShortcut, $oConnection);
        $this->aSelectedFields = Array("business_object_id", "title", "formtitle", "summarytitle", "id_field", "database", "schema", "table", "sql_summary", "sql_list", "sorted_by", "geom_column", "search_field", "result_field", "search_use_strict", "event_id", "index", "add_form_size", "edit_form_size", "display_form_size", "selection_buffer", "user_rights", "max_edition_scale", "min_edition_scale");
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
     *     type="integer"
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
     *     type="integer"
     *   ),
     *   @SWG\Parameter(
     *     name="form",
     *     in="path",
     *     description="form name (default, published, custom)",
     *     required=true,
     *     type="integer"
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

            // Connexion à la base de donées
            if (!empty($bo_database) && $bo_database != $this->oConnection->oBd->base) {
                $sLogin = $this->oConnection->oBd->login;
                $sPassword = $this->oConnection->oBd->mdp;
                $this->oConnection->oBd = new Vm($sLogin, $sPassword, $bo_database, $this->oConnection->oBd->serveur, $this->oConnection->oBd->port, $this->oConnection->oBd->sgbd, $this->oConnection->oBd->sPageEncoding);
            }

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
     *     in="formData",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="business_object_id",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="title",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="database",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="schema",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="table",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="id_field",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sql_summary",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sql_list",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sorted_by",
     *     in="formData",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="geom_column",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="search_field",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="result_field",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="search_use_strict",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="event_id",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="index",
     *     in="query",
     *     description="",
     *     required=true,
     *     type="integer"
     *   ),
     * @SWG\Parameter(
     *     name="add_form_size",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="edit_form_size",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="display_form_size",
     *     in="query",
     *     description="",
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
     * @SWG\Post(path="/businessobjects/package_definition",
     *   tags={"BusinessObjects"},
     *   summary="Add business_object",
     *   description="Request to add a business_object",
     *   operationId="POST",
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="package_definition",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="file"
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
     * @SWG\Post(path="/businessobjects/data_model",
     *   tags={"BusinessObjects"},
     *   summary="Add business_object",
     *   description="Request to add a business_object",
     *   operationId="POST",
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="data_model",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="file"
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
     *   description="Request to generate a business_object form",
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
     *     in="formData",
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
        if (isset($this->aPath[4])) {
            $sBusinessObjectId = $this->aPath[2];
            $sFormName = $this->aPath[4];
            $aFields = explode("|", $this->aValues['fields']);
            return $this->generateBusinessObjectForm($sBusinessObjectId, $sFormName, $aFields, $this->aValues['label']);
        } else {

            if ($this->aPath[2] === 'package_definition') {
                // Importe le dossier dans /tmp et renvoie son contenu
                return $this->postPackageDefinition();
            } else if ($this->aPath[2] === 'data_model') {
                // Importe le modèle de données de l'objet métier
                return $this->postDataModel();
            } else {
                if ($this->aValues['min_edition_scale'] == "") {
                    $this->aValues['min_edition_scale'] = null;
                }
                if ($this->aValues['max_edition_scale'] == "") {
                    $this->aValues['max_edition_scale'] = null;
                }
                $aReturn = $this->genericPost($this->aProperties['schema_vmap'], 'business_object', '', 'business_object_id');
                return $aReturn['sMessage'];
            }
        }
    }

    /**
     * Post the package definition
     * @return type
     */
    function postPackageDefinition() {

        if (!isset($_FILES['package_definition'])) {
            $oError = new VitisError(0, 'package_definition not found');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }
        if (!in_array('vitis_admin', $this->oConnection->aPrivileges) ||
                !in_array('vmap_admin', $this->oConnection->aPrivileges) ||
                !in_array('vm4ms_admin', $this->oConnection->aPrivileges)) {
            $oError = new VitisError(0, 'insufficient privileges (needs to be vitis_admin, vmap_admin and vm4ms_admin)');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        $sZipName = $_FILES['package_definition']['name'];
        $sPackageFormat = substr($sZipName, -4);
        $sFolderName = str_replace('.vex', '', $sZipName);

        // Test format du package
        if ($sPackageFormat !== '.vex') {
            writeToErrorLog('getBusinessObjectPackage: package format not valid: ' . $sPackageFormat);
            $oError = new VitisError(0, 'Package not valid');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        // Dézippe le contennu dans un dossier dans tmp
        $sDir = $this->UniqFileName();
        $aReturn = $this->postFileSave('package_definition', '../../tmp/', $sDir);
        $sPath = $this->aProperties['vas_home'] . '/tmp/' . $sDir;
        unZip($sPath . '/' . $sZipName, $sPath . '/' . $sFolderName);

        // Cas où il y ait dans le zip un dossier de même nom
        $sFolderPath = $sPath . '/' . $sFolderName;
        if (is_dir($sPath . '/' . $sFolderName . '/' . $sFolderName)) {
            $sFolderPath = $sPath . '/' . $sFolderName . '/' . $sFolderName;
        }

        $aBoFolders = array();
        // Récupère les repertoires contenant des objets métier
        $aFolderPathContent = scandir($sFolderPath);
        if (count($aFolderPathContent) > 2 && !is_dir($sFolderPath . '/json') && !is_dir($sFolderPath . '/forms') && !is_dir($sFolderPath . '/sql') && !is_file($sFolderPath . '/package.json')) {
            for ($i = 0; $i < count($aFolderPathContent); $i++) {
                if ($aFolderPathContent[$i] !== '..' && $aFolderPathContent[$i] !== '.') {
                    array_push($aBoFolders, $sFolderPath . '/' . $aFolderPathContent[$i]);
                }
            }
        } else {
            array_push($aBoFolders, $sFolderPath);
        }

        $aReturn['status'] = 1;

        $aTmpReturn = array();
        for ($i = 0; $i < count($aBoFolders); $i++) {

            // Récupère le contennu du package
            $aResult = $this->getBusinessObjectPackage($aBoFolders[$i]);

            if (!empty($aResult['sMessage'])) {
                if ($this->isJson($aResult['sMessage'])) {
                    $aResult = json_decode($aResult['sMessage'], true);
                }
            }
            if (!empty($aResult['errorMessage'])) {
                $aReturn['errorMessage'] = $aResult['errorMessage'];
                $aReturn['status'] = 0;
            }

            if (!empty($aResult['status'])) {
                if ($aResult['status'] != 1) {
                    $aReturn['status'] = $aResult['status'];
                }
            } else {
                $aReturn['status'] = 0;
            }

            array_push($aTmpReturn, $aResult);
        }

        if ($aReturn['status'] === 1) {
            $aReturn['businessobjects'] = $aTmpReturn;
        }

        // Supprime le dossier précédemment uploadé
        clearDir($sPath);

        return json_encode($aReturn);
    }

    /**
     * Post the data model
     * @return type
     */
    function postDataModel() {

        if (!isset($_FILES['data_model'])) {
            $oError = new VitisError(0, 'data_model not found');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }
        if (!in_array('vitis_admin', $this->oConnection->aPrivileges) ||
                !in_array('vmap_admin', $this->oConnection->aPrivileges) ||
                !in_array('vm4ms_admin', $this->oConnection->aPrivileges)) {
            $oError = new VitisError(0, 'insufficient privileges (needs to be vitis_admin, vmap_admin and vm4ms_admin)');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        $sFileName = $_FILES['data_model']['name'];
        $sDir = $this->UniqFileName();
        $this->postFileSave('data_model', '../../tmp/', $sDir);
        $sPath = $this->aProperties['vas_home'] . '/tmp/' . $sDir;
        $sFilePath = $sPath . '/' . $sFileName;

        if (isset($this->aValues['database']) && !empty($this->aValues['database'])) {
            $sDatabase = $this->aValues['database'];
        } else {
            $sDatabase = $this->aProperties['database'];
        }

        $sFileRequests = $this->getDataModelFileRequests($sFilePath);

        // Execute le SQL
        $aResults = $this->executeDataModelRequests($sFileRequests, $sDatabase);

        // Supprime le dossier précédemment uploadé
        clearDir($sPath);

        if (isset($this->oError)) {
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $this->oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        } else {
            $aReturn = array('status' => 1);
            return json_encode($aReturn);
        }
    }

    /**
     * Parse the data-model file contents and return an array of requests
     * @param string $sFilePath
     * @return string
     */
    function getDataModelFileRequests($sFilePath) {

        // Travail sur chacune des lignes du fichier
        $aFileContents = file($sFilePath);
        $aFileContents = $this->cleanDataModelFileArray($aFileContents);

        $sFileContents = '';
        for ($i = 0; $i < count($aFileContents); $i++) {
            $sFileContents .= $aFileContents[$i] . ' ';
        }

//        // Travail sur chacune des requêtes du fichier
//        $aFileContents = explode(';', $sFileContents);
//        $aFileContents = $this->cleanDataModelFileArray($aFileContents);

        return $sFileContents;
    }

    /**
     * Delete the white spaces and comments from the data-model file array vue
     * @param array $aFileContents
     * @return array
     */
    function cleanDataModelFileArray($aFileContents) {

        for ($i = count($aFileContents); $i >= 0; $i--) {
            // Supprime les espaces
            $aFileContents[$i] = trim($aFileContents[$i]);
            // Supprime les lignes vides
            if ($aFileContents[$i] === '') {
                unset($aFileContents[$i]);
            }
            // Supprime les commentaires
            if (substr($aFileContents[$i], 0, 2) === '--') {
                unset($aFileContents[$i]);
            }
        }
        // Redonne les bons index
        $aFileContents2 = Array();
        foreach ($aFileContents as $key => $value) {
            array_push($aFileContents2, $value);
        }
        $aFileContents = $aFileContents2;

        return $aFileContents;
    }

    /**
     * Execute the data-model requests
     * @param array $aFileRequests
     * @return array results
     */
    function executeDataModelRequests($sFileRequests, $sDatabase) {

        // Connexion avec uVitis
        $oBD = new Vm($this->aProperties['owner_login'], $this->aProperties['owner_pass'], $sDatabase, $this->aProperties['server'], $this->aProperties['port'], $this->aProperties['sgbd'], $this->aProperties['page_encoding']);
        $this->oConnection->oBd = $oBD;

        $this->oConnection->oBd->demarreTransaction();

        $bError = false;
        $oPDOresult = $this->oConnection->oBd->executeBlock($sFileRequests);

        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            $bError = true;
        }else{
            $aResults = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);
        }

        if ($bError) {
            $this->oConnection->oBd->annuleTransaction();
        } else {
            $this->oConnection->oBd->termineTransaction();
        }

        return $aResults;
    }

    /**
     * Generate the form
     * @param string $sBusinessObjectId
     * @param string $sFormName
     * @param array $aFields fields to use
     * @return string jsonContent of the form
     */
    function generateBusinessObjectForm($sBusinessObjectId, $sFormName, $aFields, $oLabel) {

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

        $aRows = $oForm->generateRowsByTableColumns($aColumnsToUse, array(), array(), json_decode(json_encode($oLabel), true));
        $aForm = $oForm->generateFormByRows($aRows, $bo_title, $sFormName);

        // création de l'arborescence si elle n'existe pas
        $sDirPath = $this->createBoPath($sBusinessObjectId);

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
     * Return the imported bo package content
     * @param string $sFolderPath
     * @return array
     */
    function getBusinessObjectPackage($sFolderPath) {

        // Variables Path
        $sPackagePath = $sFolderPath . '/package.json';
        $sSQLPath = $sFolderPath . '/sql';
        $sDefinitionPath = $sFolderPath . '/json';
        $sFormsPath = $sFolderPath . '/forms';

        // Retour
        $aResult = array();

        // Récupère la definition du packet
        if (!is_file($sPackagePath)) {
            writeToErrorLog('getBusinessObjectPackage: package.json not found');
            $aReturn = array(status => 0, errorMessage => 'Package not valid');
            return $aReturn;
        }
        $aResult['package'] = json_decode(file_get_contents($sPackagePath), true);

        // Récupère les définitions json
        if (!is_dir($sDefinitionPath)) {
            writeToErrorLog('getBusinessObjectPackage: json folder not found');
            $aReturn = array(status => 0, errorMessage => 'Package not valid');
            return $aReturn;
        }
        $aResult['json'] = array(
            'business_object' => json_decode(file_get_contents($sDefinitionPath . '/business_object.json'), true),
            'mapserver_layers' => json_decode(file_get_contents($sDefinitionPath . '/mapserver_layers.json'), true),
            'reports' => json_decode(file_get_contents($sDefinitionPath . '/reports.json'), true),
            'event' => json_decode(file_get_contents($sDefinitionPath . '/event.json'), true)
        );

        // Récupère les définitions sql
        if (!is_dir($sSQLPath)) {
            writeToErrorLog('getBusinessObjectPackage: sql folder not found');
            $aReturn = array(status => 0, errorMessage => 'Package not valid');
            return $aReturn;
        }
        $aResult['sql'] = array(
            'structure' => json_decode(file_get_contents($sSQLPath . '/structure.json'), true),
            'table' => file_get_contents($sSQLPath . '/table.sql'),
        );

        // Récupère les formulaires json et leurs ressources
        $aResult['forms'] = array(
            'custom' => json_decode(file_get_contents($sFormsPath . '/custom.json'), true),
            'default' => json_decode(file_get_contents($sFormsPath . '/default.json'), true),
            'published' => json_decode(file_get_contents($sFormsPath . '/published.json'), true)
        );
        if (is_dir($sFormsPath . '/ressources')) {
            $aResult['forms']['ressources'] = array();
            if (is_file($sFormsPath . '/ressources/custom.js')) {
                $aResult['forms']['ressources']['js']['custom'] = file_get_contents($sFormsPath . '/ressources/custom.js');
            }
            if (is_file($sFormsPath . '/ressources/default.js')) {
                $aResult['forms']['ressources']['js']['default'] = file_get_contents($sFormsPath . '/ressources/default.js');
            }
            if (is_file($sFormsPath . '/ressources/published.js')) {
                $aResult['forms']['ressources']['js']['published'] = file_get_contents($sFormsPath . '/ressources/published.js');
            }
            if (is_file($sFormsPath . '/ressources/custom.css')) {
                $aResult['forms']['ressources']['css']['custom'] = file_get_contents($sFormsPath . '/ressources/custom.css');
            }
            if (is_file($sFormsPath . '/ressources/default.css')) {
                $aResult['forms']['ressources']['css']['default'] = file_get_contents($sFormsPath . '/ressources/default.css');
            }
            if (is_file($sFormsPath . '/ressources/published.css')) {
                $aResult['forms']['ressources']['css']['published'] = file_get_contents($sFormsPath . '/ressources/published.css');
            }
        }

        // Vérification/erreurs
        if ($aResult['package'] === null) {
            writeToErrorLog('getBusinessObjectPackage: package.json not valid');
            $aReturn = array(status => 0, errorMessage => 'Package not valid');
            return $aReturn;
        }
        if ($aResult['json']['business_object'] === null) {
            writeToErrorLog('getBusinessObjectPackage: business_object.json not valid');
            $aReturn = array(status => 0, errorMessage => 'Package not valid');
            return $aReturn;
        }
        if ($aResult['json']['mapserver_layers'] === null) {
            writeToErrorLog('getBusinessObjectPackage: mapserver_layers.json not valid');
            $aReturn = array(status => 0, errorMessage => 'Package not valid');
            return $aReturn;
        }
        if ($aResult['sql']['structure'] === null) {
            writeToErrorLog('getBusinessObjectPackage: structure.json not valid');
            $aReturn = array(status => 0, errorMessage => 'Package not valid');
            return $aReturn;
        }
        if ($aResult['sql']['table'] === null) {
            writeToErrorLog('getBusinessObjectPackage: table.sql not valid');
            $aReturn = array(status => 0, errorMessage => 'Package not valid');
            return $aReturn;
        }

        $aResult['status'] = 1;

        return $aResult;
    }

    /**
     * Creates the business object forms directory path
     * @param string $sBusinessObjectId
     * @return string
     */
    function createBoPath($sBusinessObjectId) {

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

        return $sDirPath;
    }

    /**
     * Copy a folder
     * @param string $src
     * @param string $dst
     */
    function recurseCopy($src, $dst) {
        $dir = opendir($src);
        @mkdir($dst);
        while (false !== ( $file = readdir($dir))) {
            if (( $file != '.' ) && ( $file != '..' )) {
                if (is_dir($src . '/' . $file)) {
                    $this->recurseCopy($src . '/' . $file, $dst . '/' . $file);
                } else {
                    copy($src . '/' . $file, $dst . '/' . $file);
                }
            }
        }
        closedir($dir);
    }

    /**
     *
     * @param string $string
     * @return boolean
     */
    function isJson($string) {
        if (!is_string($string)) {
            return false;
        }
        json_decode($string);
        return (json_last_error() == JSON_ERROR_NONE);
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
     * @SWG\Parameter(
     *     name="title",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="database",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="schema",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="table",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="id_field",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sql_summary",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sql_list",
     *     in="query",
     *     description="",
     *     required=false,
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
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="search_field",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="result_field",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="search_use_strict",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="event_id",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="index",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="integer"
     *   ),
     * @SWG\Parameter(
     *     name="add_form_size",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="edit_form_size",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="display_form_size",
     *     in="query",
     *     description="",
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
     *     description="Save, Perso_Save, Perso_Published, Default_Published, Perso_Reset, Default_Reset",
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
        if (isset($this->aPath[4])) {
            $sBusinessObjectId = $this->aPath[2];
            $sFormName = $this->aPath[4];
            $sComand = $this->aValues['cmd'];
            $this->putForm($sBusinessObjectId, $sFormName, $sComand);
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        } else {
            if ($this->aValues['min_edition_scale'] == "") {
                $this->aValues['min_edition_scale'] = null;
            }
            if ($this->aValues['max_edition_scale'] == "") {
                $this->aValues['max_edition_scale'] = null;
            }
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
                case "Save":

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
                    $this->generateBusinessObjectForm($sBusinessObjectId, $sFormName, $aFields, $this->aValues['label']);
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

        // Supprime les Bo un par un
        for ($i = 0; $i < count($aBos); $i++) {
            $aPath = Array('vmap', 'businessobjects', $aBos[$i]);
            $aValues = $this->aValues;
            $aValues['my_vitis_id'] = $aBos[$i];
            $oBo = new BusinessObject($aPath, $aValues, $this->aProperties, $this->oConnection);

            // Supprime l'objet métier
            $oBo->DELETE();

            if (isset($oBo->oError)) {
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oBo->oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                return $sMessage;
            } else {
                $this->removeBusinessObjectFiles($aBos[$i]);
                $aXmlRacineAttribute['status'] = 1;
                $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                return $sMessage;
            }
        }
    }

    function removeBusinessObjectFiles($sBusinessObjectId) {

        // Supprime les fichiers liés à l'objet métier
        $sDirPath = $this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $sBusinessObjectId;
        clearDir($sDirPath);
    }

}

?>

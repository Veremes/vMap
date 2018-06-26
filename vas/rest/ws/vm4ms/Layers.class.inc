<?php

/**
 * \file Layers.class.inc
 * \class Layers
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Layers php class
 *
 * This class defines Rest Api to Vmap4MapServer Layers
 * 
 */
require_once 'Vmap4MapServer.class.inc';
require_once 'Layer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';
require_once 'Vm4msMetadataAccess.class.inc';
require_once 'WmsServices.class.inc';

class Layers extends Vmap4MapServer {
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
     * @param type $bShortcut false to reinit variables
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        parent::__construct($aPath, $aValues, $properties, $bShortcut, $oConnection);
        $this->aSelectedFields = Array("ms_layer_id", "name", "title", "coordsys_id", "coordsys_label", "source_id", "connection_id", "tableschema", "tablename", "tableidfield", "definition", "opacity", "active", "ms_layertype_id", "private_connection", "connection_label", "source_label", "definitiontmp", "metadata_id");
    }

    /**
     * @SWG\Get(path="/layers",
     *   tags={"Layers"},
     *   summary="Get layers",
     *   description="Request to get layers",
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
     * @SWG\Get(path="/layers/{ms_layer_id}/MapFile",
     *   tags={"Layers"},
     *   summary="Get layer map file",
     *   description="Request to get the map file of a layer by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="ms_layer_id",
     *     in="path",
     *     description="layer id",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layers")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/layers/{ms_layer_id}/MapServerLog",
     *   tags={"Layers"},
     *   summary="Get mapserver log of layer test",
     *   description="Request to get the content of the mapserver log for the test of the layer",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="ms_layer_id",
     *     in="path",
     *     description="layer id",
     *     required=true,
     *     type="integer",
     *     format = "int32"
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
        if (in_array('vm4ms_admin', $this->oConnection->aPrivileges)) {
            // Obligatoire pour le test des couches
            $this->preTestLayers();
            $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'v_ms_layer', 'ms_layer_id');
            if ($aReturn['sStatus'] == 1) {
                $sMessage = $this->testLayers();
            } else {
                $sMessage = $aReturn['sMessage'];
            }
        }
        if (!empty($this->aPath[3])) {
            if ($this->aPath[3] == "MapFile")
                $sMessage = $this->getMapFile();
            else if ($this->aPath[3] == "MapServerLog")
                $sMessage = $this->getMapServerLog();
        }
        return $sMessage;
    }

    /**
     * Création d'un fichier ".map" pour la couche avec MapServer.
     */
    function createMapFile() {
        require $this->sRessourcesFile;
        //$oBd = $this->oConnection->oBd;
        $oBd = new BD($this->aProperties["owner_login"], $this->aProperties["owner_pass"], $this->aProperties["database"], $this->aProperties["server"], $this->aProperties["port"], $this->aProperties["sgbd"], $this->aProperties["page_encoding"]);
        if ($oBd->erreurRencontree) {
            $oError = new VitisError(1, $oBd->sMessage);
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $bXMLError = true;
            writeToErrorLog('Error: ' . $oBd->sMessage . ' -> ' . __FUNCTION__ . '(' . $this->aProperties["test_wms_service"] . ')' . ' in ' . __FILE__ . ' on line ' . __LINE__);
        } else {
            // Login et mdp.
            $sLogin = '';
            $sPassword = '';
            if (!empty($this->aValues['user_login']) && !empty($this->aValues['user_password'])) {
                $sLogin = $this->aValues['user_login'];
                $sPassword = $this->aValues['user_password'];
            }
            // Création du fichier ".map".
            $oVm4msMetadataAccess = new Vm4msMetadataAccess($oBd, $sLogin, $sPassword, hash('sha256', session_id()), $this->aProperties);
            $sMapFile = $oVm4msMetadataAccess->saveLayerTestMapFile($this->aProperties["test_wms_service"], $this->aValues['my_vitis_id']);
            $this->aObjects[0]->aFields['map_file'] = $sMapFile;
            // Source des couches du flux de test.
            $aParams['sSchemaVm4ms'] = array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name');
            $aParams['wmsservice_id'] = array('value' => $this->aProperties["test_wms_service"], 'type' => 'string');
            $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getWmsServiceLayersSource'], $aParams);
            if (!$this->oConnection->oBd->erreurRencontree) {
                $aLayersSource = array($this->aObjects[0]->aFields['name'] => $this->aObjects[0]->aFields['source_label']);
                while ($aLayer = $this->oConnection->oBd->ligneSuivante($oPDOresult))
                    $aLayersSource[$aLayer['name']] = $aLayer['source'];
                $this->aObjects[0]->aFields['layers_sources'] = $aLayersSource;
            }
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }
        return $sMessage;
    }

    /**
     * Retourne les infos du fichier ".map" de test pour la couche.
     */
    function getMapFile() {
        require $this->sRessourcesFile;
        // Nom du fichier ".map".
        $sMapFileHash = hash('sha256', $this->aValues['token']);
        $this->aObjects[0]->aFields['map_file'] = $this->aProperties["map_dir"] . '/wms_test/' . $sMapFileHash . '_' . $this->aObjects[0]->aFields['name'] . '.map';
        $this->aObjects[0]->aFields['map_file_hash'] = $sMapFileHash;
        // Contenu du fichier ".map".
        if (file_exists($this->aObjects[0]->aFields['map_file']))
            $this->aObjects[0]->aFields['map_file_content'] = file_get_contents($this->aObjects[0]->aFields['map_file']);
        // Source des couches du flux de test.
        $aParams['sSchemaVm4ms'] = array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name');
        $aParams['wmsservice_id'] = array('value' => $this->aProperties["test_wms_service"], 'type' => 'string');
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getWmsServiceLayersSource'], $aParams);
        if (!$this->oConnection->oBd->erreurRencontree) {
            $aLayersSource = array($this->aObjects[0]->aFields['name'] => $this->aObjects[0]->aFields['source_label']);
            while ($aLayer = $this->oConnection->oBd->ligneSuivante($oPDOresult))
                $aLayersSource[$aLayer['name']] = $aLayer['source'];
            $this->aObjects[0]->aFields['layers_sources'] = $aLayersSource;
        }
        $aXmlRacineAttribute['status'] = 1;
        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        return $sMessage;
    }

    /**
     * Retourne le contenu du fichier de log de MapServer pour le test de la couche.
     */
    function getMapServerLog() {
        // Nom du flux de test utilisé.
        $sMsLogFile = $this->aProperties['ms_log_dir'] . '/test/' . hash('sha256', session_id()) . '_' . $this->aObjects[0]->aFields['name'] . '.log';
        if (file_exists($sMsLogFile))
            $this->aObjects[0]->aFields['log_file_content'] = utf8_encode(file_get_contents($sMsLogFile));
        $aXmlRacineAttribute['status'] = 1;
        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        return $sMessage;
    }

    /**
     * Fonction à lancer avant les tests de couches
     * Ajoute l'attribut definition au cas où definition_structure_valid soit demandé mais definition non
     */
    function preTestLayers() {
        // Obligatoire pour le test des couches
        if (!empty($this->aValues['attributs'])) {
            $aAttributs = explode('|', $this->aValues['attributs']);
            $this->aPreTestOriginialAttributes = $aAttributs;
            // Cas où definition_structure_valid soit demandé mais definition non
            if (!in_array('definition', $aAttributs) && in_array('definition_structure_valid', $aAttributs)) {
                array_push($aAttributs, 'definition');
                $this->aValues['attributs'] = implode('|', $aAttributs);
            }
        }
    }

    /**
     * Fonction à lancer après le test de couche
     * Supprime l'attribut "definition" si il n'était pas dans les attributs demandés
     */
    function postTestLayers() {
        // Supprime l'attribut "definition" si il n'était pas dans les attributs demandés
        if (isset($this->aPreTestOriginialAttributes)) {
            if (!in_array('definition', $this->aPreTestOriginialAttributes)) {
                foreach ($this->aObjects as $oLayer) {
                    if (!empty($oLayer->aFields['definition'])) {
                        unset($oLayer->aFields['definition']);
                    }
                }
            }
        }
    }

    /**
     * Test l'ensemble des couches
     * @return string
     */
    function testLayers() {
        foreach ($this->aObjects as $oObj) {
            if (!empty($oObj->aFields['definition'])) {
                $oObj->testDefinitionIndent();
            }
        }
        $this->postTestLayers();
        $aXmlRacineAttribute['status'] = 1;
        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        return $sMessage;
    }

    /**
     * @SWG\Post(path="/layers",
     *   tags={"Layers"},
     *   summary="Add layer",
     *   description="Request to add a layer",
     *   operationId="POST",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="formData",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="name",
     *     in="formData",
     *     description="layer name (without spaces and accents)",
     *     required=true,
     *     type="string",
     *     format = "int32"
     *   ),
     *   @SWG\Parameter(
     *     name="title",
     *     in="formData",
     *     description="title",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="coordsys_id",
     *     in="formData",
     *     description="coordinate system id",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Parameter(
     *     name="source_id",
     *     in="formData",
     *     description="source id",
     *     required=false,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Parameter(
     *     name="connection_id",
     *     in="formData",
     *     description="connection id",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Parameter(
     *     name="ms_layertype_id",
     *     in="formData",
     *     description="layer type id (LINE, POINT...)",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="tableschema",
     *     in="formData",
     *     description="table schema",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="tablename",
     *     in="formData",
     *     description="table name",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="tableidfield",
     *     in="formData",
     *     description="table id field",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="definition",
     *     in="formData",
     *     description="definition",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="active",
     *     in="formData",
     *     description="active",
     *     required=true,
     *     type="boolean",
     *     default=true
     *   ),
     *   @SWG\Parameter(
     *     name="opacity",
     *     in="formData",
     *     description="opacity",
     *     required=false,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layers")
     *   )
     *  )
     * )
     */
    /**
     * @SWG\Post(path="/layers/MapFile",
     *   tags={"Layers"},
     *   summary="Create layer map file",
     *   description="Request to create the map file of a layer by id",
     *   operationId="POST",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="ms_layer_id",
     *     in="query",
     *     description="layer id",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Parameter(
     *     name="user_login",
     *     in="query",
     *     description="login of the user",
     *     required=false,
     *     type="string",
     *   ),
     *   @SWG\Parameter(
     *     name="user_password",
     *     in="query",
     *     description="password of the user",
     *     required=false,
     *     type="string",
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layers")
     *     )
     *  )
     */

    /**
     * insert layer
     * @return array containing the status and the message
     */
    function POST() {
        // Création d'une couche ou d'un fichier ".map".
        if (!empty($this->aPath[2])) {
            if ($this->aPath[2] == "MapFile") {
                $this->aValues['my_vitis_id'] = $this->aValues['ms_layer_id'];
                $aReturn['sStatus'] = 1;
                if (in_array('vm4ms_admin', $this->oConnection->aPrivileges)) {
                    $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'v_ms_layer', 'ms_layer_id');
                    $sMessage = $aReturn['sMessage'];
                }
                if ($aReturn['sStatus'] == 1) {
                    $this->createMapFile();
                    $sMessage = $this->getMapFile();
                }
            }
        } else {
            require $this->sRessourcesFile;
            // Vide le schéma, la table et la colonne si aucune connexion est sélectionnée.
            if (empty($this->aValues['connection_id'])) {
                $this->aValues['tableschema'] = null;
                $this->aValues['tablename'] = null;
                $this->aValues['tableidfield'] = null;
                $this->aValues['connection_id'] = null;
            }
            // Vérification du nom de la couche (unique).
            $aParams = array();
            $aParams['sSchemaVm4ms'] = array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name');
            $aParams['name'] = array('value' => $this->aValues['name'], 'type' => 'string');
            $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getLayerId'], $aParams);
            if ($this->oConnection->oBd->enErreur()) {
                $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            }
            else {
                if ($this->oConnection->oBd->nombreLigne($oPDOresult) > 0) {
                    $oError = new VitisError(1, 'Une couche avec ce nom existe déja.');
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                }
                else {
                    $aReturn = $this->genericPost($this->aProperties['schema_vm4ms'], 'ms_layer', false, 'ms_layer_id');
                    if ($aReturn['sStatus'] == 1) {
                        $aXmlRacineAttribute['status'] = 1;
                        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                        // Association des flux WMS à la couche.
                        if (!empty($this->aValues['wmsservices'])) {
                            $aWmsServices = explode('|', $this->aValues['wmsservices']);
                            foreach ($aWmsServices as $sWmsService) {
                                $aParams['sSchemaVm4ms'] = array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name');
                                $aParams['ms_layer_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'number');
                                $aParams['wmsservice_id'] = array('value' => $sWmsService, 'type' => 'string');
                                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['insertLayerWmsServices'], $aParams);
                                if ($this->oConnection->oBd->enErreur()) {
                                    $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                                    $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                                    $aXmlRacineAttribute['status'] = 0;
                                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                                }
                            }
                            // Création du fichier .map de tous les flux WMS associés à la couche.
                            $oLayer = new Layer($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
                            $oLayer->GET();
                            $oLayer->createLayerWmsServicesMapFile($oLayer->aFields['private_connection']);
                        }
                    } else
                        $sMessage = $aReturn['sMessage'];
                }
            }
        }
        return $sMessage;
    }

    /**
     * @SWG\Put(path="/layers/{ms_layer_id}",
     *   tags={"Layers"},
     *   summary="Update Layer",
     *   description="Request to update layer",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   consumes= { "multipart/form-data"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="ms_layer_id",
     *     in="path",
     *     description="layer id",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Parameter(
     *     name="title",
     *     in="query",
     *     description="title",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="coordsys_id",
     *     in="query",
     *     description="coordinate system id",
     *     required=false,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Parameter(
     *     name="source_id",
     *     in="query",
     *     description="source id",
     *     required=false,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Parameter(
     *     name="connection_id",
     *     in="query",
     *     description="connection id",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Parameter(
     *     name="ms_layertype_id",
     *     in="query",
     *     description="layer type id",
     *     required=false,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Parameter(
     *     name="tableschema",
     *     in="query",
     *     description="table schema",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="tablename",
     *     in="query",
     *     description="table name",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="tableidfield",
     *     in="query",
     *     description="table id field",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="definition",
     *     in="query",
     *     description="definition",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="active",
     *     in="query",
     *     description="active",
     *     required=false,
     *     type="boolean",
     *     default=true
     *   ),
     *   @SWG\Parameter(
     *     name="opacity",
     *     in="query",
     *     description="opacity",
     *     required=false,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Parameter(
     *     name="create_ws_map_file",
     *     in="query",
     *     description="create wms services map file",
     *     required=true,
     *     type="boolean",
     *     default=true
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
     * @SWG\Put(path="/layers/activate",
     *   tags={"Layers"},
     *   summary="Activate layers",
     *   description="Request to activate layers",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="List of layers id",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layers")
     *     )
     *  )
     */
    /**
     * @SWG\Put(path="/layers/desactivate",
     *   tags={"Layers"},
     *   summary="Desactivate layers",
     *   description="Request to desactivate layers",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="List of layers id",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layers")
     *     )
     *  )
     */

    /**
     * modify layer
     * @return array containing the status and the message
     */
    function PUT() {
        if ($this->aPath[2] == "activate")
            $sMessage = $this->activateLayer();
        else if ($this->aPath[2] == "desactivate")
            $sMessage = $this->desactivateLayer();
        else {
            require $this->sRessourcesFile;
            // Création du fichier .map des flux WMS associés à la couche.
            $bCreateWsMapFile = true;
            if ($this->aValues["create_ws_map_file"] == "false")
                $bCreateWsMapFile = false;
            unset($this->aValues["create_ws_map_file"]);
            // Sauvegarde la définition dans le champ "definitiontmp".
            if ($this->aValues['test_layer'] == 'true') {
                $this->aValues['definitiontmp'] = $this->aValues['definition'];
                unset($this->aValues['definition']);
            } else
                $this->aValues['definitiontmp'] = '';
            // Vide le schéma, la table et la colonne si aucune connexion est sélectionnée.
            if (empty($this->aValues['connection_id'])) {
                $this->aValues['tableschema'] = null;
                $this->aValues['tablename'] = null;
                $this->aValues['tableidfield'] = null;
                $this->aValues['connection_id'] = null;
            }
            // 
            $aReturn = $this->genericPut($this->aProperties['schema_vm4ms'], 'ms_layer', 'ms_layer_id');
            if ($aReturn['sStatus'] == 0) {
                $sMessage = $aReturn['sMessage'];
                return $sMessage;
            }
            // Suppression de l'association de la couche aux flux WMS si la connexion est privée.
            if (!empty($this->aValues['connection_id'])) {
                $aParams['sSchemaVm4ms'] = array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name');
                $aParams['connection_id'] = array('value' => $this->aValues["connection_id"], 'type' => 'number');
                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getConnectionType'], $aParams);
                $aConnection = $this->oConnection->oBd->ligneSuivante($oPDOresult);
                if ($aConnection['private'] === true)
                    $this->oConnection->oBd->delete($this->aProperties['schema_vm4ms'], 'wmsservice_ms_layer', 'ms_layer_id', $this->aValues["my_vitis_id"]);
            }
            $sMessage = $aReturn['sMessage'];
            // Création du fichier .map de tous les flux WMS associés à la couche.
            if ($aReturn["sStatus"] == 1 && $bCreateWsMapFile) {
                $oLayer = new Layer($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
                $oLayer->GET();
                $oLayer->createLayerWmsServicesMapFile($oLayer->aFields['private_connection']);
            }
        }
        return $sMessage;
    }

    /**
     * activateLayer
     */
    function activateLayer() {
        require $this->sRessourcesFile;
        $aReturn = array('sStatus' => 1, 'sMessage' => '');
        $aParams['sSchemaVm4ms'] = array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name');
        $aParams['idList'] = array('value' => $this->aValues['idList'], 'type' => 'group');
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['activateLayers'], $aParams);
        if ($this->oConnection->oBd->enErreur())
            $aReturn = array('sStatus' => 0, 'message' => $this->oConnection->oBd->getBDMessage(), 'error_code' => 1);
        $aXmlRacineAttribute['sStatus'] = $aReturn['sStatus'];
        if ($aReturn['sStatus'] == 1)
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        else {
            $oError = new VitisError($aReturn['error_code'], $aReturn['message']);
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }
        return $sMessage;
    }

    /**
     * desactivateLayer
     */
    function desactivateLayer() {
        require $this->sRessourcesFile;
        $aReturn = array('sStatus' => 1, 'sMessage' => '');
        $aParams['sSchemaVm4ms'] = array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name');
        $aParams['idList'] = array('value' => $this->aValues['idList'], 'type' => 'group');
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['desactivateLayers'], $aParams);
        if ($this->oConnection->oBd->enErreur())
            $aReturn = array('sStatus' => 0, 'message' => $this->oConnection->oBd->getBDMessage(), 'error_code' => 1);
        $aXmlRacineAttribute['sStatus'] = $aReturn['sStatus'];
        if ($aReturn['sStatus'] == 1)
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        else {
            $oError = new VitisError($aReturn['error_code'], $aReturn['message']);
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }
        return $sMessage;
    }

    /**
     * @SWG\Delete(path="/layers/",
     *   tags={"Layers"},
     *   summary="delete Layer",
     *   description="Request to delete Layer",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
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
     * @SWG\Delete(path="/layers/{ms_layer_id}",
     *   tags={"Layers"},
     *   summary="delete Layer",
     *   description="Request to delete Layer",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="ms_layer_id",
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
        $aReturn = $this->genericDelete($this->aProperties['schema_vm4ms'], 'ms_layer', 'ms_layer_id');
        return $aReturn['sMessage'];
    }

}

?>
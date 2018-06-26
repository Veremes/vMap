<?php

/**
 * \file WmsServices.class.inc
 * \class WmsServices
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the WmsServices php class
 *
 * This class defines Rest Api to Vmap4MapServer WmsServices
 *
 */
require_once 'Vmap4MapServer.class.inc';
require_once 'WmsService.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';
require_once 'Vm4msMetadataAccess.class.inc';

class WmsServices extends Vmap4MapServer {
    /**
     * @SWG\Definition(
     *   definition="/wmsservices",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/wmsservices")
     *   }
     * )
     * * @SWG\Tag(
     *   name="WmsServices",
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
        $this->aSelectedFields = Array("wmsservice_id", "description", "definition", "web_id", "web_name");
    }

    /**
     * @SWG\Get(path="/wmsservices",
     *   tags={"WmsServices"},
     *   summary="Get Wms Services",
     *   description="Request to get Wms Services",
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
     *         @SWG\Schema(ref="#/definitions/wmsservices")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/wmsservices/{wmsservice_id}/MapFile",
     *   tags={"WmsServices"},
     *   summary="Get wms service map file",
     *   description="Request to get the map file of a wms service by id",
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
     *     name="wmsservice_id",
     *     in="path",
     *     description="wmsservice_id",
     *     required=true,
     *     type="string",
     *   ),
     *  @SWG\Parameter(
     *     name="type",
     *     in="query",
     *     description="Type of map file",
     *     required=true,
     *     type="array",
     *         @SWG\Items(type="string"),
     *         collectionFormat="multi",
     *         default="prod",
     *         enum={"prod", "test"}
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/wmsservices")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/wmsservices/{wmsservice_id}/MapServerLog",
     *   tags={"WmsServices"},
     *   summary="Get mapserver log of wms service test",
     *   description="Request to get the content of the mapserver log for the test of the wms service",
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
     *     name="wmsservice_id",
     *     in="path",
     *     description="wmsservice_id",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/wmsservices")
     *     )
     *  )
     */

    /**
     * get WmsServices
     * @return  WmsServices
     */
    function GET() {
        if (in_array('vm4ms_admin', $this->oConnection->aPrivileges)) {
            $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'v_wms_service', 'wmsservice_id');
            $sMessage = $aReturn['sMessage'];
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
     * Création d'un fichier ".map" pour le flux wms avec MapServer.
     */
    function createMapFile() {
        require $this->sRessourcesFile;
        //$oBd = $this->oConnection->oBd;
        // Login et mdp.
        $oBd = new BD($this->aProperties["owner_login"], $this->aProperties["owner_pass"], $this->aProperties["database"], $this->aProperties["server"], $this->aProperties["port"], $this->aProperties["sgbd"], $this->aProperties["page_encoding"]);
        if ($oBd->erreurRencontree) {
            $oError = new VitisError(1, $oBd->sMessage);
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $bXMLError = true;
            writeToErrorLog('Error: ' . $oBd->sMessage . ' -> ' . __FUNCTION__ . '(' . $this->aValues['my_vitis_id'] . ')' . ' in ' . __FILE__ . ' on line ' . __LINE__);
        } else {
            $sLogin = '';
            $sPassword = '';
            if (!empty($this->aValues['user_login']) && !empty($this->aValues['user_password'])) {
                $sLogin = $this->aValues['user_login'];
                $sPassword = $this->aValues['user_password'];
            }
            // Création du fichier ".map".
            $oVm4msMetadataAccess = new Vm4msMetadataAccess($oBd, $sLogin, $sPassword, session_id(), $this->aProperties);
            if ($this->aValues['type'] == 'prod')
                $sMapFile = $oVm4msMetadataAccess->saveWmsServiceMapFile($this->aValues['my_vitis_id'], $this->aValues['token']);
            else
                $sMapFile = $oVm4msMetadataAccess->saveWmsServiceTestMapFile($this->aValues['my_vitis_id']);
        }
    }

    /**
     * Retourne les infos du fichier ".map" du flux.
     */
    function getMapFile() {
        if (!empty($this->aObjects[0]->aFields)) {
            require $this->sRessourcesFile;
            $sWmsServiceId = $this->aObjects[0]->aFields['wmsservice_id'];
            // Supprime les accents et caractères spéciaux.
            $sWmsServiceId = htmlentities($sWmsServiceId, ENT_NOQUOTES, 'UTF-8');
            $sWmsServiceId = preg_replace('#&([A-za-z])(?:acute|cedil|caron|circ|grave|orn|ring|slash|th|tilde|uml);#', '\1', $sWmsServiceId);
            $sWmsServiceId = preg_replace('#&([A-za-z]{2})(?:lig);#', '\1', $sWmsServiceId); // pour les ligatures e.g. '&oelig;'
            $sWmsServiceId = preg_replace('#&[^;]+;#', '', $sWmsServiceId); // supprime les autres caractères
            // Nom du fichier ".map".
            $sMapFileHash = hash('sha256', $this->aValues['token']);
            $this->aObjects[0]->aFields['map_file_hash'] = $sMapFileHash;
            if ($this->aValues['my_vitis_id'] == $this->aProperties['private_wms_service']) {
                $sProdDir = 'wms_private';
                $sMapFileName = $sMapFileHash . '.map';
            } else {
                $sProdDir = 'wms_public';
                $sMapFileName = $sMapFileHash . '_' . $sWmsServiceId . '.map';
            }
            // Chemin du fichier.
            if ($this->aValues['type'] == 'prod')
                $this->aObjects[0]->aFields['map_file'] = $this->aProperties["map_dir"] . '/' . $sProdDir . '/' . $sMapFileName;
            else
                $this->aObjects[0]->aFields['map_file'] = $this->aProperties["map_dir"] . '/wms_test/' . $sMapFileName;
            // Contenu du fichier ".map".
            if (file_exists($this->aObjects[0]->aFields['map_file']))
                $this->aObjects[0]->aFields['map_file_content'] = file_get_contents($this->aObjects[0]->aFields['map_file']);
            // Source des couches du flux de test.
            $aParams['sSchemaVm4ms'] = array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name');
            $aParams['wmsservice_id'] = array('value' => $sWmsServiceId, 'type' => 'string');
            $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getWmsServiceLayersSource'], $aParams);
            if (!$this->oConnection->oBd->erreurRencontree) {
                $aLayersSource = array();
                while ($aLayer = $this->oConnection->oBd->ligneSuivante($oPDOresult))
                    $aLayersSource[$aLayer['name']] = $aLayer['source'];
                $this->aObjects[0]->aFields['layers_sources'] = $aLayersSource;
            }
        }
        $aXmlRacineAttribute['status'] = 1;
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
        $sMessage = $this->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $output);
        return $sMessage;
    }

    /**
     * Retourne le contenu du fichier de log de MapServer pour le test du flux WMS.
     */
    function getMapServerLog() {
        if ($this->aObjects[0]->aFields['wmsservice_id'] == $this->aProperties['private_wms_service'])
            $sMsLogFile = $this->aProperties['ms_log_dir'] . '/test/' . hash('sha256', session_id()) . '.log';
        else
            $sMsLogFile = $this->aProperties['ms_log_dir'] . '/test/' . hash('sha256', session_id()) . '_' . $this->aObjects[0]->aFields['wmsservice_id'] . '.log';
        if (file_exists($sMsLogFile))
            $this->aObjects[0]->aFields['log_file_content'] = utf8_encode(file_get_contents($sMsLogFile));
        $aXmlRacineAttribute['status'] = 1;
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
        $sMessage = $this->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $output);
        return $sMessage;
    }

    /**
     * @SWG\Post(path="/wmsservices",
     *   tags={"WmsServices"},
     *   summary="Add wms service",
     *   description="Request to add a wms service",
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
     *     name="wmsservice_id",
     *     in="formData",
     *     description="wms service id",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="description",
     *     in="formData",
     *     description="description",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="definition",
     *     in="formData",
     *     description="definition",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="web_id",
     *     in="formData",
     *     description="web object id",
     *     required=false,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/wmsservices")
     *   )
     *  )
     * )
     */
    /**
     * @SWG\Post(path="/wmsservices/MapFile",
     *   tags={"WmsServices"},
     *   summary="Create wms service map file",
     *   description="Request to create the map file of a wms service by id",
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
     *     name="wmsservice_id",
     *     in="formData",
     *     description="wmsservice_id",
     *     required=true,
     *     type="string",
     *   ),
     *  @SWG\Parameter(
     *     name="type",
     *     in="query",
     *     description="Type of map file",
     *     required=true,
     *     type="array",
     *         @SWG\Items(type="string"),
     *         collectionFormat="multi",
     *         default="prod",
     *         enum={"prod", "test"}
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/wmsservices")
     *     )
     *  )
     */

    /**
     * insert wms service
     * @return array containing the status and the message
     */
    function POST() {
        // Création d'un flux WMS ou d'un fichier ".map".
        if (!empty($this->aPath[2])) {
            if ($this->aPath[2] == "MapFile") {
                $this->aValues['my_vitis_id'] = $this->aValues['wmsservice_id'];
                $aReturn['sStatus'] = 1;
                if (in_array('vm4ms_admin', $this->oConnection->aPrivileges)) {
                    $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'v_wms_service', 'wmsservice_id');
                    $sMessage = $aReturn['sMessage'];
                }
                if ($aReturn['sStatus'] == 1) {
                    $this->createMapFile();
                    $sMessage = $this->getMapFile();
                }
            }
        } else {
            $aReturn = $this->genericPost($this->aProperties['schema_vm4ms'], 'wmsservice', false, 'wmsservice_id');
            if ($aReturn['sStatus'] == 1) {
                $aXmlRacineAttribute['status'] = 1;
                $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                $oWmsService = new WmsService($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
                $oWmsService->GET();
            } else {
                $sMessage = $aReturn['sMessage'];
            }
        }
        return $sMessage;
    }

    /**
     * @SWG\Put(path="/wmsservices/{wmsservice_id}",
     *   tags={"WmsServices"},
     *   summary="Update WmsService",
     *   description="Request to update wms service",
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
     *     name="wmsservice_id",
     *     in="path",
     *     description="wms service id",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="description",
     *     in="query",
     *     description="description",
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
     *     name="web_id",
     *     in="query",
     *     description="web object id",
     *     required=false,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/wmsservices")
     *     ),
     *
     *  )
     */

    /**
     * modify wms service
     * @return array containing the status and the message
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_vm4ms'], 'wmsservice', 'wmsservice_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/wmsservices/",
     *   tags={"WmsServices"},
     *   summary="delete WmsService",
     *   description="Request to delete WmsService",
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
     *     description="id of the wms services",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/wmsservices")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/wmsservices/{wmsservice_id}",
     *   tags={"WmsServices"},
     *   summary="delete WmsService",
     *   description="Request to delete WmsService",
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
     *     name="wmsservice_id",
     *     in="path",
     *     description="id of the wms service",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/wmsservices")
     *     )
     *  )
     */

    /**
     * delete wms service
     * @return id of wms service deleted or error object if a wms service is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vm4ms'], 'wmsservice', 'wmsservice_id');
        return $aReturn['sMessage'];
    }

}

?>

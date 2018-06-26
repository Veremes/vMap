<?php

/**
 * \file WmsServiceLayers.class.inc
 * \class WmsServiceLayers
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the WmsServiceLayers php class
 *
 * This class defines Rest Api to Vmap WmsServiceLayers
 * 
 */
require_once 'Vmap4MapServer.class.inc';
require_once 'WmsServiceLayer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';
require_once 'WmsServices.class.inc';

class WmsServiceLayers extends Vmap4MapServer {
    /**
     * @SWG\Definition(
     *   definition="/wmsservicelayers",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/wmsservicelayers")
     *   }
     * )
     * * @SWG\Tag(
     *   name="WmsServiceLayers",
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
        $this->aSelectedFields = Array("ms_layer_id", "name", "title", "active", "wmsservice_id", "opacity");
    }

    /**
     * @SWG\Get(path="/wmsservicelayers",
     *   tags={"WmsServiceLayers"},
     *   summary="Get  wms service layers",
     *   description="Request to get wms service layers",
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
     *         description="Porperties Response",
     *         @SWG\Schema(ref="#/definitions/wmsservicelayers")
     *     )
     *  )
     */

    /**
     * get  wms service layers
     * @return WmsServiceLayers
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'v_wms_service_ms_layer', 'wmsservice_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/wmsservicelayers",
     *   tags={"WmsServiceLayers"},
     *   summary="Update wms service layers",
     *   description="Request to update the layers of a wms service",
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
     *     name="wmsservice_id",
     *     in="path",
     *     description="Id of the wms service",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="wmsservice_ms_layers",
     *     in="query",
     *     description="Layers of the wms service",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Properties Response",
     *         @SWG\Schema(ref="#/definitions/wmsservicelayers")
     *     ),
     * 
     *  )
     */

    /**
     * modify layers of wms service
     * @return array containing the status and the message
     */
    function PUT() {
        require $this->sRessourcesFile;
        // Couches à rattacher à la carte ?
        if (!empty($this->aValues['wmsservice_ms_layers'])) {
            $aLayers = explode('|', $this->aValues['wmsservice_ms_layers']);
            foreach ($aLayers as $iLayerId) {
                $aParams['sSchemaVm4ms'] = array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name');
                $aParams['ms_layer_id'] = array('value' => $iLayerId, 'type' => 'number');
                $aParams['wmsservice_id'] = array('value' => $this->aValues["my_vitis_id"], 'type' => 'string');
                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['insertWmsServiceLayers'], $aParams);
                if ($this->oConnection->oBd->enErreur()) {
                    $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                } else {
                    $aXmlRacineAttribute['status'] = 1;
                    $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                }
            }
            // Création du fichier .map du flux WMS.
            $aValues = array('token' => session_id(), 'wmsservice_id' => $this->aValues["my_vitis_id"], 'my_vitis_id' => $this->aValues["my_vitis_id"], 'type' => 'prod', 'creation' => true, 'sEncoding' => $this->aValues['sEncoding'], 'sSourceEncoding' => $this->aValues['sSourceEncoding'], 'output' => $this->aValues['output']);
            $aPath = array('vm4ms', 'wmsservices', $this->aValues["my_vitis_id"]);
            $oWmsServices = new WmsServices($this->aPath, $aValues, $this->aProperties, $this->oConnection);
            $oWmsServices->GET();
            if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                return $sMessage;
            }
            $oWmsServices->createMapFile();
        }
        return $sMessage;
    }

    /**
     * @SWG\Delete(path="/wmsservicelayers/{wmsservice_id}",
     *   tags={"WmsServiceLayers"},
     *   summary="Delete  wms service layers",
     *   description="Request to delete layers of a wms service",
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
     *     type="integer",
     *     format = "int32"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id of the wms service layers",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/wmsservicelayers")
     *     )
     *  )
     */

    /**
     * delete wms service layers
     * @return id of wms service layer deleted or error object if a wms service layer is not deleted
     */
    function DELETE() {
        require $this->sRessourcesFile;
        // Couches à supprimer ?
        if (!empty($this->aValues['idList'])) {
            $aParams['sSchemaVm4ms'] = array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name');
            $aParams['wmsservice_id'] = array('value' => $this->aValues["my_vitis_id"], 'type' => 'string');
            $aParamsName = array();
            foreach (explode('|', $this->aValues['idList']) as $iIndex => $iId) {
                $sParamName = 'id_layer_' . $iIndex;
                $aParamsName[] = ':' . $sParamName;
                $aParams[$sParamName] = array('value' => $iId, 'type' => 'number');
            }
            $aSql['deleteWmsServiceLayers'] = str_replace('[idList]', implode(',', $aParamsName), $aSql['deleteWmsServiceLayers']);
            $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['deleteWmsServiceLayers'], $aParams);
            if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            } else {
                $aXmlRacineAttribute['status'] = 1;
                $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            }
            // Création du fichier .map du flux WMS.
            $aValues = array('token' => session_id(), 'wmsservice_id' => $this->aValues["my_vitis_id"], 'my_vitis_id' => $this->aValues["my_vitis_id"], 'type' => 'prod', 'creation' => true);
            $aPath = array('vm4ms', 'wmsservices', $this->aValues["my_vitis_id"]);
            $oWmsServices = new WmsServices($this->aPath, $aValues, $this->aProperties, $this->oConnection);
            $oWmsServices->GET();
            if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                return $sMessage;
            }
            $oWmsServices->createMapFile();
        }
        return $sMessage;
    }

}

?>
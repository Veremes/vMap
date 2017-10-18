<?php

/**
 * \file PrivateWmsServices.class.inc
 * \class PrivateWmsServices
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the PrivateWmsServices php class
 *
 * This class defines Rest Api to Vmap4MapServer PrivateWmsServices
 * 
 */
require_once 'Vmap4MapServer.class.inc';
require_once 'PrivateWmsService.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';
require_once 'Vm4msMetadataAccess.class.inc';

class PrivateWmsServices extends Vmap4MapServer {
    /**
     * @SWG\Definition(
     *   definition="/privatewmsservices",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/privatewmsservices")
     *   }
     * )
     * * @SWG\Tag(
     *   name="PrivateWmsServices",
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
        $this->aSelectedFields = Array("wmsservice_id", "description", "definition", "web_id", "web_name", "msdebuglevel_id");
    }

    /**
     * @SWG\Get(path="/privatewmsservices",
     *   tags={"WmsServices"},
     *   summary="Get Private Wms Services",
     *   description="Request to get Private Wms Services",
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
     *         @SWG\Schema(ref="#/definitions/privatewmsservices")
     *     )
     *  )
     */

    /**
     * get PrivateWmsServices
     * @return  PrivateWmsServices
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'v_private_wms_service', 'wmsservice_id');
        if ($aReturn['sStatus'] == 0) {
            $sMessage = $aReturn['sMessage'];
            return $sMessage;
        }

        // Écrit les url
        for ($i = 0; $i < count($this->aObjects); $i++) {
            $this->aObjects[$i]->aFields['wms_service_url'] = $this->aProperties["ms_cgi_url"] . '/private/[token]';
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
     * insert private wms service
     * @return array containing the status and the message
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_vm4ms'], 'wmsservice', false, 'wmsservice_id');
        if ($aReturn['sStatus'] == 1) {
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $oPrivateWmsService = new PrivateWmsService($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
            $oPrivateWmsService->GET();
        } else {
            $sMessage = $aReturn['sMessage'];
        }
        return $sMessage;
    }

    /**
     * modify private wms service
     * @return array containing the status and the message
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_vm4ms'], 'wmsservice', 'wmsservice_id');
        $sMessage = $aReturn['sMessage'];
        $oBd = new BD($this->aProperties["owner_login"], $this->aProperties["owner_pass"], $this->aProperties["database"], $this->aProperties["server"], $this->aProperties["port"], $this->aProperties["sgbd"], $this->aProperties["page_encoding"]);
        if ($oBd->erreurRencontree) {
            $oError = new VitisError(1, $oBd->sMessage);
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $bXMLError = true;
        } else {
            // Création du fichier .map du flux WMS.
            $oVm4msMetadataAccess = new Vm4msMetadataAccess($this->oConnection->oBd, '', '', session_id(), $this->aProperties);
            $oVm4msMetadataAccess->saveWmsServiceMapFile($this->aValues['my_vitis_id']);
        }
        return $sMessage;
    }

    /**
     * delete private wms service
     * @return id of private wms service deleted or error object if a private wms service is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vm4ms'], 'wmsservice', 'wmsservice_id');
        return $aReturn['sMessage'];
    }

}

?>
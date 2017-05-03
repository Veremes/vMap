<?php

/**
 * \file PublicWmsServices.class.inc
 * \class PublicWmsServices
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the PublicWmsServices php class
 *
 * This class defines Rest Api to Vmap4MapServer PublicWmsServices
 * 
 */
require_once 'Vmap4MapServer.class.inc';
require_once 'PublicWmsService.class.inc';
require_once __DIR__ . '/../vmap/Services.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';
require_once 'Vm4msMetadataAccess.class.inc';

class PublicWmsServices extends Vmap4MapServer {
    /**
     * @SWG\Definition(
     *   definition="/publicwmsservices",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/publicwmsservices")
     *   }
     * )
     * * @SWG\Tag(
     *   name="PublicWmsServices",
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
     * @SWG\Get(path="/publicwmsservices",
     *   tags={"WmsServices"},
     *   summary="Get Public Wms Services",
     *   description="Request to get Public Wms Services",
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
     *         @SWG\Schema(ref="#/definitions/publicwmsservices")
     *     )
     *  )
     */

    /**
     * get PublicWmsServices
     * @return  PublicWmsServices
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'v_public_wms_service', 'wmsservice_id');
        if ($aReturn['sStatus'] == 0) {
            $sMessage = $aReturn['sMessage'];
            return $sMessage;
        }

        // Écrit les url
        for ($i = 0; $i < count($this->aObjects); $i++) {
            $this->aObjects[$i]->aFields['wms_service_url'] = $this->aProperties["ms_cgi_url"] . "/public/" . $this->aObjects[$i]->aFields['wmsservice_id'];
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
     * insert public wms service
     * @return array containing the status and the message
     */
    function POST() {

        // Ajout du flux vm4ms
        $aReturn = $this->genericPost($this->aProperties['schema_vm4ms'], 'wmsservice', false, 'wmsservice_id');
        if ($aReturn['sStatus'] == 1) {
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);

            // Ajout du service vMap associé
            $this->createVmapService();
        } else {
            $sMessage = $aReturn['sMessage'];
        }

        return $sMessage;
    }

    /**
     * Create the associated vMap service
     * @return string
     */
    function createVmapService() {
        //$sFilename = $this->aProperties["map_dir"] . '/wms_public/' . $this->aValues['wmsservice_id'] . ".map";
        $aVmapGetServiceValues = Array(
            'token' => $this->aValues['token'],
            'filter' => "name='vm4ms_" . $this->aValues['my_vitis_id'] . "'",
            'vitis_version' => $this->aValues['vitis_version'],
            'id' => 'services',
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'module' => 'vmap'
        );
        $aVmapPostServiceValues = array(
            'token' => $this->aValues['token'],
            'service_type_id' => 'imagewms',
            'service_type_version' => '1.3.0',
            'service_vm4ms' => true,
            'name' => 'vm4ms_' . $this->aValues['wmsservice_id'],
            'description' => $this->aValues['description'],
            'url' => '[ms_cgi_url]/public/' . $this->aValues['wmsservice_id']
        );
        $oVmapService = new Services($this->aPath, $aVmapGetServiceValues, $this->aProperties);
        $oVmapService->GET();
        if (!isset($oVmapService->aObjects[0])) {
            $oVmapService->aValues = $aVmapPostServiceValues;
            $sMessage = $oVmapService->POST();
            return $sMessage;
        } else {
            return null;
        }
    }

    /**
     * modify public wms service
     * @return array containing the status and the message
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_vm4ms'], 'wmsservice', 'wmsservice_id');
        // Création du fichier .map du flux WMS (et celui de test pour MapServer).
        $oVm4msMetadataAccess = new Vm4msMetadataAccess($this->oConnection->oBd, '', '', session_id(), $this->aProperties);
        $oVm4msMetadataAccess->saveWmsServiceMapFile($this->aValues['my_vitis_id']);
        return $aReturn['sMessage'];
    }

    /**
     * delete public wms service
     * @return id of public wms service deleted or error object if a public wms service is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vm4ms'], 'wmsservice', 'wmsservice_id');
        return $aReturn['sMessage'];
    }

}

?>
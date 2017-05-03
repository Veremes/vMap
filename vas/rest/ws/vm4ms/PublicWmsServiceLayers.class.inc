<?php
/**
* \file PublicWmsServiceLayers.class.inc
* \class PublicWmsServiceLayers
*
* \author Armand Bahi <armand.bahi@veremes.com>.
*
* \brief This file contains the PublicWmsServiceLayers php class
*
* This class defines Rest Api to Vmap PublicWmsServiceLayers
* 
*/
require_once 'Vmap4MapServer.class.inc';
require_once 'PublicWmsServiceLayer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class PublicWmsServiceLayers extends Vmap4MapServer {
    
     /**
     * @SWG\Definition(
     *   definition="/publicwmsservicelayers",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/publicwmsservicelayers")
     *   }
     * )
     * * @SWG\Tag(
     *   name="PublicWmsServiceLayers",
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
		$this->aSelectedFields = Array("ms_layer_id", "name", "title", "active", "wmsservice_id", "opacity");
    }
    
    /**
     * @SWG\Get(path="/publicwmsservicelayers",
     *   tags={"WmsServiceLayers"},
     *   summary="Get public wms service layers",
     *   description="Request to get public wms service layers",
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
     *         @SWG\Schema(ref="#/definitions/publicwmsservicelayers")
     *     )
     *  )
     */
    
    /**
     * get public wms service layers
     * @return PublicWmsServiceLayers
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'v_public_wms_service_ms_layer', 'wmsservice_id');
        return $aReturn['sMessage'];
    }
    
    /**
     * modify layers of wms service
     * @return array containing the status and the message
     */
    function PUT() {
        /*
        require $this->sRessourcesFile;
        // Couches à rattacher à la carte ?
        if (!empty($this->aValues['wmsservice_ms_layers'])) {
            $aLayers = explode('|', $this->aValues['wmsservice_ms_layers']);
            foreach ($aLayers as $iLayerId) {
                $sSql = str_replace('[wmsservice_id]', $this->aValues["my_vitis_id"], $aSql['insertPublicWmsServiceLayers']);
                $sSql = str_replace('[ms_layer_id]', $iLayerId, $sSql);
                $sSql = str_replace('[sSchemaVm4ms]', $this->aProperties['schema_vm4ms'], $sSql);
                $resultat = $this->oConnection->oBd->execute($sSql);
                if ($this->oConnection->oBd->enErreur()) {
                    $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                }
                else {
                    $aXmlRacineAttribute['status'] = 1;
                    $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                }
            }
        }
        return $sMessage;
        */
    }
    
    /**
     * delete wms service layers
     * @return id of wms service layer deleted or error object if a wms service layer is not deleted
     */
    function DELETE() {
        /*
        require $this->sRessourcesFile;
        // Couches à supprimer ?
        if (!empty($this->aValues['idList'])) {
            $sSql = str_replace('[wmsservice_id]', $this->aValues["my_vitis_id"], $aSql['deletePublicWmsServiceLayers']);
            $sSql = str_replace('[idList]', str_replace('|', ',', $this->aValues['idList']), $sSql);
            $sSql = str_replace('[sSchemaVm4ms]', $this->aProperties['schema_vm4ms'], $sSql);
            $resultat = $this->oConnection->oBd->execute($sSql);
            if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            }
            else {
                $aXmlRacineAttribute['status'] = 1;
                $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            }
        }
        return $sMessage;
        */
    }
}
?>
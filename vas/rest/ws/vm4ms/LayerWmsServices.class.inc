<?php
/**
* \file LayerWmsServices.class.inc
* \class LayerWmsServices
*
* \author Armand Bahi <armand.bahi@veremes.com>.
*
* \brief This file contains the LayerWmsServices php class
*
* This class defines Rest Api to Vmap LayerWmsServices
* 
*/
require_once 'Vmap4MapServer.class.inc';
require_once 'LayerWmsService.class.inc';
require_once 'WmsServices.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class LayerWmsServices extends Vmap4MapServer {
    
     /**
     * @SWG\Definition(
     *   definition="/layerwmsservices",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/layerwmsservices")
     *   }
     * )
     * * @SWG\Tag(
     *   name="LayerWmsServices",
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
		$this->aSelectedFields = Array("ms_layer_id", "name", "title", "coordsys_id", "source_id", "connection_id", "tableschema", "tablename", "tableidfield", "definition", "opacity", "active", "ms_layertype_id", "private_connection", "connection_label", "source_label", "definitiontmp");
    }
    
    /**
     * get  wms service layers
     * @return LayerWmsServices
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'v_ms_layer', 'ms_layer_id');
        return $aReturn['sMessage'];
    }
    
    /**
     * @SWG\Put(path="/layerwmsservices/{ms_layer_id}",
     *   tags={"LayerWmsServices"},
     *   summary="Update layer wms services",
     *   description="Request to update the wms services of a layer",
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
     *     name="ms_layer_id",
     *     in="path",
     *     description="Id of the layer",
     *     required=true,
     *     type="integer",
     *     format="int32"
     *   ),
     *   @SWG\Parameter(
     *     name="wmsservices",
     *     in="query",
     *     description="Layers of the wms service",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Properties Response",
     *         @SWG\Schema(ref="#/definitions/layerwmsservices")
     *     )
     *  )
     */

    /**
     * modify layers of wms service
     * @return array containing the status and the message
     */
    function PUT() {
        require $this->sRessourcesFile;
        // Supprime l'association des flux WMS rattachés à la couche.
        $this->oConnection->oBd->delete($this->aProperties['schema_vm4ms'], 'wmsservice_ms_layer', 'ms_layer_id', $this->aValues["my_vitis_id"]);
        // Couches à rattacher à la carte ?
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
                else {
                    $aXmlRacineAttribute['status'] = 1;
                    $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    // Création du fichier .map du flux WMS.
                    $aValues = array('token' => session_id(), 'wmsservice_id' => $sWmsService, 'my_vitis_id' => $sWmsService, 'type' => 'prod', 'creation' => true, 'sEncoding' => $this->aValues['sEncoding'], 'sSourceEncoding' => $this->aValues['sSourceEncoding'], 'output' => $this->aValues['output']);
                    $aPath = array('vm4ms', 'wmsservices', $this->aValues["my_vitis_id"]);
                    $oWmsServices = new WmsServices($this->aPath, $aValues, $this->aProperties, $this->oConnection);
                    $oWmsServices->GET();
                    $oWmsServices->createMapFile();
                }
            }
        }
        return $sMessage;
    }
    
    /**
     * delete wms service layers
     * @return id of wms service layer deleted or error object if a wms service layer is not deleted
     */
    function DELETE() {
    }
}
?>
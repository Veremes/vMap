<?php
/**
* \file PublicLayers.class.inc
* \class PublicLayers
*
* \author Armand Bahi <armand.bahi@veremes.com>.
*
* \brief This file contains the PublicLayers php class
*
* This class defines Rest Api to Vmap4MapServer PublicLayers
* 
*/
require_once 'Vmap4MapServer.class.inc';
require_once 'PublicLayer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class PublicLayers extends Vmap4MapServer {
    
     /**
     * @SWG\Definition(
     *   definition="/publiclayers",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/publiclayers")
     *   }
     * )
     * * @SWG\Tag(
     *   name="PublicLayers",
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
		$this->aSelectedFields = Array("ms_layer_id", "name", "title", "coordsys_id", "source_id", "connection_id", "tableschema", "tablename", "tableidfield", "definition", "opacity", "active", "ms_layertype_id", "private_connection");
    }
    /**
     * @SWG\Get(path="/publiclayers",
     *   tags={"Layers"},
     *   summary="Get public layers",
     *   description="Request to get public layers",
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
     *         @SWG\Schema(ref="#/definitions/publiclayers")
     *     )
     *  )
     */
    /**
     * get PublicLayers
     * @return  PublicLayers
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'v_public_ms_layer', 'ms_layer_id');
        return $aReturn['sMessage'];
    }
    
    /**
     * insert publiclayer
     * @return array containing the status and the message
     */
    function POST() {
        /*
        $aReturn = $this->genericPost($this->aProperties['schema_vm4ms'], 'ms_layer', false, 'ms_layer_id');
        if ($aReturn['sStatus'] == 1){
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $oPublicLayer = new PublicLayer($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
            $oPublicLayer->GET();
            // Ajoute les flux WMS associés à la couche.
            if (!empty($this->aValues['wmsservices'])) {
                require $this->sRessourcesFile;
                $aWmsServices = explode('|', $this->aValues['wmsservices']);
                foreach ($aWmsServices as $iWmsServiceId) {
                    $aParams['sSchemaVm4ms'] = array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name');
                    $aParams['ms_layer_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'number');
                    $aParams['wmsservice_id'] = array('value' => $iWmsServiceId, 'type' => 'string');
                    $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['insertPublicLayerWmsServices'], $aParams);
                }
            }        
        }else{
            $sMessage = $aReturn['sMessage'];
        }
        return $sMessage;
        */
    }
    
    /**
     * modify public layer
     * @return array containing the status and the message
     */
    function PUT() {
        /*
        $aReturn = $this->genericPut($this->aProperties['schema_vm4ms'], 'ms_layer', 'ms_layer_id');
        // Supprime les flux WMS rattachés à la couche.
        $this->oConnection->oBd->delete($this->aProperties['schema_vm4ms'], 'wmsservice_ms_layer', 'ms_layer_id', $this->aValues["my_vitis_id"], 'text');
        // Ajoute les flux WMS associés à la couche.
        if (!empty($this->aValues['wmsservices'])) {
            require $this->sRessourcesFile;
            $aWmsServices = explode('|', $this->aValues['wmsservices']);
            foreach ($aWmsServices as $iWmsServiceId) {
                $aParams['sSchemaVm4ms'] = array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name');
                $aParams['ms_layer_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'number');
                $aParams['wmsservice_id'] = array('value' => $iWmsServiceId, 'type' => 'string');
                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['insertPublicLayerWmsServices'], $aParams);
            }
        }        
        return $aReturn['sMessage'];
        */
    }

    /**
     * delete public layer
     * @return id of layer deleted or error object if a layer is not deleted
     */
    function DELETE() {
        /*
        $aReturn = $this->genericDelete($this->aProperties['schema_vm4ms'], 'ms_layer', 'ms_layer_id');
        // Supprime les flux WMS rattachés à la couche.
        $this->oConnection->oBd->delete($this->aProperties['schema_vm4ms'], 'wmsservice_ms_layer', 'ms_layer_id', $this->aValues["my_vitis_id"], 'text');
        return $aReturn['sMessage'];
        */
    }
}
?>
<?php
/**
* \file LayerConnections.class.inc
* \class LayerConnections
*
* \author Armand Bahi <armand.bahi@veremes.com>.
*
* \brief This file contains the LayerConnections php class
*
* This class defines Rest Api to Vmap4MapServer Connections
* 
*/
require_once 'Vmap4MapServer.class.inc';
require_once 'LayerConnection.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class LayerConnections extends Vmap4MapServer {
    
     /**
     * @SWG\Definition(
     *   definition="/layerconnections",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/layerconnections")
     *   }
     * )
     * * @SWG\Tag(
     *   name="LayerConnections",
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
		$this->aSelectedFields = Array("connection_id", "name", "private", "server", "port", "database", "user", "password");
    }
    /**
     * @SWG\Get(path="/layerconnections",
     *   tags={"LayerConnections"},
     *   summary="Get connection",
     *   description="Request to get connection",
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
     *         @SWG\Schema(ref="#/definitions/layerconnections")
     *     )
     *  )
     */
    /**
     * get LayerConnections
     * @return  LayerConnections
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'connection', 'connection_id');
        return $aReturn['sMessage'];
    }
    
    /**
     * @SWG\Post(path="/layerconnections",
     *   tags={"LayerConnections"},
     *   summary="Add connection",
     *   description="Request to add a connection",
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
     *     description="name",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="server",
     *     in="formData",
     *     description="server",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="database",
     *     in="formData",
     *     description="database",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="port",
     *     in="formData",
     *     description="port",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Parameter(
     *     name="user",
     *     in="formData",
     *     description="user",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="password",
     *     in="formData",
     *     description="password",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="private",
     *     in="formData",
     *     description="private",
     *     required=true,
     *     type="boolean",
     *     default=false
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layerconnections")
     *   )
     *  )
     * )
     */

    /**
     * insert connection
     * @return array containing the status and the message
     */
    function POST() {
        if (!empty($this->aValues['private']) && $this->aValues['private'] == 'true') {
            $this->aValues['server'] = '';
            $this->aValues['port'] = '';
            $this->aValues['user'] = '';
            $this->aValues['password'] = '';
        }
        $aReturn = $this->genericPost($this->aProperties['schema_vm4ms'], 'connection', $this->aProperties['schema_vm4ms'].'.seq_common', 'connection_id');
        if ($aReturn['sStatus'] == 1){
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $oLayerConnection = new LayerConnection($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
            $oLayerConnection->GET();
        }else{
            $sMessage = $aReturn['sMessage'];
        }
        return $sMessage;
    }
    
    /**
     * @SWG\Put(path="/layerconnections/{connection_id}",
     *   tags={"LayerConnections"},
     *   summary="Update LayerConnection",
     *   description="Request to update connection",
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
     *     name="connection_id",
     *     in="path",
     *     description="connection id",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Parameter(
     *     name="name",
     *     in="query",
     *     description="name",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="server",
     *     in="query",
     *     description="server",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="database",
     *     in="query",
     *     description="database",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="port",
     *     in="query",
     *     description="port",
     *     required=false,
     *     type="integer"
     *   ),
     *   @SWG\Parameter(
     *     name="user",
     *     in="query",
     *     description="user",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="password",
     *     in="query",
     *     description="password",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="private",
     *     in="query",
     *     description="private",
     *     required=false,
     *     type="boolean",
     *     default=false
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layerconnections")
     *     ),
     * 
     *  )
     */

    /**
     * modify connection
     * @return array containing the status and the message
     */
    function PUT() {
        if (!empty($this->aValues['private']) && $this->aValues['private'] == 'true') {
            $this->aValues['server'] = '';
            $this->aValues['port'] = '';
            $this->aValues['user'] = '';
            $this->aValues['password'] = '';
        }
        $aReturn = $this->genericPut($this->aProperties['schema_vm4ms'], 'connection', 'connection_id');
        return $aReturn['sMessage'];
    }

    
    /**
     * @SWG\Delete(path="/layerconnections/",
     *   tags={"LayerConnections"},
     *   summary="delete LayerConnection",
     *   description="Request to delete LayerConnection",
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
     *     description="id of the connections",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layerconnections")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/layerconnections/{connection_id}",
     *   tags={"LayerConnections"},
     *   summary="delete LayerConnection",
     *   description="Request to delete LayerConnection",
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
     *     name="connection_id",
     *     in="path",
     *     description="id of the connection",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layerconnections")
     *     )
     *  )
     */
    
    /**
     * delete connection
     * @return id of connection deleted or error object if a connection is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vm4ms'], 'connection', 'connection_id');
        return $aReturn['sMessage'];
    }
}
?>
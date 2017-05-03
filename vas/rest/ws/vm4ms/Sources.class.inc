<?php
/**
* \file Sources.class.inc
* \class Sources
*
* \author Armand Bahi <armand.bahi@veremes.com>.
*
* \brief This file contains the Sources php class
*
* This class defines Rest Api to Vmap4MapServer Sources
* 
*/
require_once 'Vmap4MapServer.class.inc';
require_once 'Source.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class Sources extends Vmap4MapServer {
    
     /**
     * @SWG\Definition(
     *   definition="/sources",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/sources")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Sources",
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
		$this->aSelectedFields = Array("source_id", "name", "definition");
    }
    /**
     * @SWG\Get(path="/sources",
     *   tags={"Sources"},
     *   summary="Get source",
     *   description="Request to get source object",
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
     *         @SWG\Schema(ref="#/definitions/sources")
     *     )
     *  )
     */
    /**
     * get Sources
     * @return  Sources
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'source', 'source_id');
        return $aReturn['sMessage'];
    }
    
    /**
     * @SWG\Post(path="/sources",
     *   tags={"Sources"},
     *   summary="Add source",
     *   description="Request to add a source object",
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
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/sources")
     *   )
     *  )
     * )
     */

    /**
     * insert source
     * @return array containing the status and the message
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_vm4ms'], 'source', $this->aProperties['schema_vm4ms'].'.seq_common', 'source_id');
        if ($aReturn['sStatus'] == 1){
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $oSource = new Source($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
            $oSource->GET();
        }else{
            $sMessage = $aReturn['sMessage'];
        }
        return $sMessage;
    }
    
    /**
     * @SWG\Put(path="/sources/{source_id}",
     *   tags={"Sources"},
     *   summary="Update Source",
     *   description="Request to update source",
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
     *     name="source_id",
     *     in="path",
     *     description="source id",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Parameter(
     *     name="name",
     *     in="query",
     *     description="name",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/sources")
     *     ),
     * 
     *  )
     */

    /**
     * modify source
     * @return array containing the status and the message
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_vm4ms'], 'source', 'source_id');
        return $aReturn['sMessage'];
    }

    
    /**
     * @SWG\Delete(path="/sources/",
     *   tags={"Sources"},
     *   summary="delete Source",
     *   description="Request to delete Source",
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
     *     description="id of the source",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/sources")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/sources/{source_id}",
     *   tags={"Sources"},
     *   summary="delete Source",
     *   description="Request to delete Source",
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
     *     name="source_id",
     *     in="path",
     *     description="id of the source",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/sources")
     *     )
     *  )
     */
    
    /**
     * delete source
     * @return id of source deleted or error object if a source is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vm4ms'], 'source', 'source_id');
        return $aReturn['sMessage'];
    }
}
?>
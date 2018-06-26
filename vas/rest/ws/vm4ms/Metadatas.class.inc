<?php

/**
 * \file Metadatas.class.inc
 * \class Metadatas
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Metadatas php class
 *
 * This class defines Rest Api to Vmap4MapServer Metadatas
 * 
 */
require_once 'Vmap4MapServer.class.inc';
require_once 'Metadata.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class Metadatas extends Vmap4MapServer {
    /**
     * @SWG\Definition(
     *   definition="/metadatas",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/metadatas")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Metadatas",
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
        $this->aSelectedFields = Array("metadata_id", "name", "definition");
    }

    /**
     * @SWG\Get(path="/metadatas",
     *   tags={"Metadatas"},
     *   summary="Get metadate",
     *   description="Request to get metadata",
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
     *         @SWG\Schema(ref="#/definitions/metadatas")
     *     )
     *  )
     */

    /**
     * get Metadatas
     * @return  Metadatas
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'metadata', 'metadata_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Post(path="/metadatas",
     *   tags={"Metadatas"},
     *   summary="Add metadata",
     *   description="Request to add a metadata",
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
     *     name="definition",
     *     in="formData",
     *     description="definition",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/metadatas")
     *   )
     *  )
     * )
     */

    /**
     * insert metadata
     * @return array containing the status and the message
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_vm4ms'], 'metadata', $this->aProperties['schema_vm4ms'] . '.seq_common', 'metadata_id');
        if ($aReturn['sStatus'] == 1) {
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $oMetadata = new Metadata($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
            $oMetadata->GET();
        } else {
            $sMessage = $aReturn['sMessage'];
        }
        return $sMessage;
    }

    /**
     * @SWG\Put(path="/metadatas/{metadata_id}",
     *   tags={"Metadatas"},
     *   summary="Update Metadata",
     *   description="Request to update metadata",
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
     *     name="metadata_id",
     *     in="path",
     *     description="metadata id",
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
     *   @SWG\Parameter(
     *     name="definition",
     *     in="query",
     *     description="definition",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/metadatas")
     *     ),
     * 
     *  )
     */

    /**
     * modify metadata
     * @return array containing the status and the message
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_vm4ms'], 'metadata', 'metadata_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/metadatas/",
     *   tags={"Metadatas"},
     *   summary="delete Metadata",
     *   description="Request to delete Metadata",
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
     *     description="id of the metadatas",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/metadatas")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/metadatas/{metadata_id}",
     *   tags={"Metadatas"},
     *   summary="delete Metadata",
     *   description="Request to delete Metadata",
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
     *     name="metadata_id",
     *     in="path",
     *     description="id of the metadata",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/metadatas")
     *     )
     *  )
     */

    /**
     * delete metadata
     * @return id of metadata deleted or error object if a metadata is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vm4ms'], 'metadata', 'metadata_id');
        return $aReturn['sMessage'];
    }

}

?>
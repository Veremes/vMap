<?php

/**
 * \file WebObjects.class.inc
 * \class WebObjects
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the WebObjects php class
 *
 * This class defines Rest Api to Vmap4MapServer WebObjects
 * 
 */
require_once 'Vmap4MapServer.class.inc';
require_once 'WebObject.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class WebObjects extends Vmap4MapServer {
    /**
     * @SWG\Definition(
     *   definition="/webobjects",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/webobjects")
     *   }
     * )
     * * @SWG\Tag(
     *   name="WebObjects",
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
        $this->aSelectedFields = Array("web_id", "name", "definition");
    }

    /**
     * @SWG\Get(path="/webobjects",
     *   tags={"WebObjects"},
     *   summary="Get web object",
     *   description="Request to get web object",
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
     *         @SWG\Schema(ref="#/definitions/webobjects")
     *     )
     *  )
     */

    /**
     * get WebObjects
     * @return  WebObjects
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'web', 'web_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Post(path="/webobjects",
     *   tags={"WebObjects"},
     *   summary="Add web object",
     *   description="Request to add a web object",
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
     *         @SWG\Schema(ref="#/definitions/webobjects")
     *   )
     *  )
     * )
     */

    /**
     * insert web object
     * @return array containing the status and the message
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_vm4ms'], 'web', $this->aProperties['schema_vm4ms'] . '.seq_common', 'web_id');
        if ($aReturn['sStatus'] == 1) {
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $oWebObject = new WebObject($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
            $oWebObject->GET();
        } else {
            $sMessage = $aReturn['sMessage'];
        }
        return $sMessage;
    }

    /**
     * @SWG\Put(path="/webobjects/{web_id}",
     *   tags={"WebObjects"},
     *   summary="Update WebObject",
     *   description="Request to update web object",
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
     *     name="web_id",
     *     in="path",
     *     description="web id",
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
     *         @SWG\Schema(ref="#/definitions/webobjects")
     *     ),
     * 
     *  )
     */

    /**
     * modify web object
     * @return array containing the status and the message
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_vm4ms'], 'web', 'web_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/webobjects/",
     *   tags={"WebObjects"},
     *   summary="delete WebObject",
     *   description="Request to delete WebObject",
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
     *     description="id of the web objects",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/webobjects")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/webobjects/{web_id}",
     *   tags={"WebObjects"},
     *   summary="delete WebObject",
     *   description="Request to delete WebObject",
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
     *     name="web_id",
     *     in="path",
     *     description="id of the web object",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/webobjects")
     *     )
     *  )
     */

    /**
     * delete web object
     * @return id of web object deleted or error object if a web object is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vm4ms'], 'web', 'web_id');
        return $aReturn['sMessage'];
    }

}

?>
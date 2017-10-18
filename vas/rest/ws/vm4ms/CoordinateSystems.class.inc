<?php

/**
 * \file CoordinateSystems.class.inc
 * \class CoordinateSystems
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the CoordinateSystems php class
 *
 * This class defines Rest Api to Vmap4MapServer CoordinateSystems
 * 
 */
require_once 'Vmap4MapServer.class.inc';
require_once 'CoordinateSystem.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';
require_once 'Vm4msMetadataAccess.class.inc';

class CoordinateSystems extends Vmap4MapServer {
    /**
     * @SWG\Definition(
     *   definition="/coordinatesystems",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/coordinatesystems")
     *   }
     * )
     * * @SWG\Tag(
     *   name="CoordinateSystems",
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
        $this->aSelectedFields = Array("coordsys_id", "epsg", "definition", "label", "epsg_definition");
    }

    /**
     * @SWG\Get(path="/coordinatesystems",
     *   tags={"CoordinateSystems"},
     *   summary="Get coordinate systems",
     *   description="Request to get coordinate systems",
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
     *         @SWG\Schema(ref="#/definitions/coordinatesystems")
     *     )
     *  )
     */

    /**
     * get CoordinateSystems
     * @return  CoordinateSystems
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], 'coordsys', 'coordsys_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Post(path="/coordinatesystems",
     *   tags={"CoordinateSystems"},
     *   summary="Add coordinate system",
     *   description="Request to add a coordinate system",
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
     *     name="coordsys_id",
     *     in="formData",
     *     description="srid",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Parameter(
     *     name="epsg",
     *     in="formData",
     *     description="epsg code",
     *     required=false,
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
     *         @SWG\Schema(ref="#/definitions/coordinatesystems")
     *   )
     *  )
     * )
     */

    /**
     * insert coordinate system
     * @return array containing the status and the message
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_vm4ms'], 'coordsys', false, 'coordsys_id');
        if ($aReturn['sStatus'] == 1) {
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $oCoordinateSystem = new CoordinateSystem($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
            $oCoordinateSystem->GET();
        } else {
            $sMessage = $aReturn['sMessage'];
        }
        return $sMessage;
    }

    /**
     * @SWG\Put(path="/coordinatesystems/{coordsys_id}",
     *   tags={"CoordinateSystems"},
     *   summary="Update CoordinateSystem",
     *   description="Request to update coordinate system",
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
     *     name="coordsys_id",
     *     in="path",
     *     description="srid",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Parameter(
     *     name="epsg",
     *     in="query",
     *     description="epsg code",
     *     required=false,
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
     *         @SWG\Schema(ref="#/definitions/coordinatesystems")
     *     ),
     * 
     *  )
     */

    /**
     * modify coordinate system
     * @return array containing the status and the message
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_vm4ms'], 'coordsys', 'coordsys_id');
        
        // Génère les fichiers de projection        
        $oVm4msMetadataAccess = new Vm4msMetadataAccess($this->oConnection->oBd, '', '', session_id(), $this->aProperties);
        $oVm4msMetadataAccess->generateProjFiles();
        
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/coordinatesystems/",
     *   tags={"CoordinateSystems"},
     *   summary="delete CoordinateSystem",
     *   description="Request to delete CoordinateSystem",
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
     *     description="id of the coordinate systems",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/coordinatesystems")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/coordinatesystems/{coordsys_id}",
     *   tags={"CoordinateSystems"},
     *   summary="delete CoordinateSystem",
     *   description="Request to delete CoordinateSystem",
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
     *     name="coordsys_id",
     *     in="path",
     *     description="id of the coordinate system",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/coordinatesystems")
     *     )
     *  )
     */

    /**
     * delete coordinate system
     * @return id of coordinate system deleted or error object if a coordinate system is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vm4ms'], 'coordsys', 'coordsys_id');
        return $aReturn['sMessage'];
    }

}

?>
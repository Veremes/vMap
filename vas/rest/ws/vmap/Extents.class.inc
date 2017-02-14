<?php

/**
 * \file Extents.class.inc
 * \class Extents
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Extents php class
 *
 * This class defines Rest Api to Vmap Extents
 * 
 */
require_once 'Vmap.class.inc';
require_once 'Extent.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class Extents extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/extents",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/extents")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Extents",
     *   description=""
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function Extents($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->aSelectedFields = Array("extent_id", "crs_id", "extent", "name");
    }

    /**
     * @SWG\Get(path="/extents",
     *   tags={"Extents"},
     *   summary="Get Extents",
     *   description="Request to get Extents",
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
     *     default="4",
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
     *     type="boolean"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/extents")
     *     )
     *  )
     */

    /**
     * get Extents
     * @return the array of objects
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'extent', 'extent_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Post(path="/extents",
     *   tags={"Extents"},
     *   summary="Add extent",
     *   description="Request to add a extent",
     *   operationId="POST",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="crs_id",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="extent",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="name",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/extents")
     *     )
     *
     *  )
     * 
     * )
     */

    /**
     * insert extent
     * @return array containing the status and the message
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_vmap'], 'extent', $this->aProperties['schema_vmap'].'.seq_common', 'extent_id');           
        return $aReturn['sMessage'];
    }
    
    /**
     * @SWG\Put(path="/extents/{extent_id}",
     *   tags={"Extents"},
     *   summary="Update Extent",
     *   description="Request to update extent",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="extent_id",
     *     in="path",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="crs_id",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="extent",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="name",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/extents")
     *     ),
     * 
     *  )
     */

    /**
     * modify extent
     * @return array containing the status and the message
     */
    function PUT() {        
        $aReturn = $this->genericPut($this->aProperties['schema_vmap'], 'extent', 'extent_id');
        return $aReturn['sMessage'];
    }
    
    /**
     * @SWG\Delete(path="/extents/",
     *   tags={"Extents"},
     *   summary="delete Extent",
     *   description="Request to delete Extent",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="extent token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id of the extents",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/extents")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/extents/{extent_id}",
     *   tags={"Extents"},
     *   summary="delete Extent",
     *   description="Request to delete Extent",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="extent token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="extent_id",
     *     in="path",
     *     description="id of the extent",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/extents")
     *     )
     *  )
     */
    
    /**
     * delete extent
     * @return id of extent deleted or error object if a extent is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vmap'], 'extent', 'extent_id');
        return $aReturn['sMessage'];
    }

}

?>
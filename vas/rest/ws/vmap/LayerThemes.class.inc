<?php

/**
 * \file LayerThemes.class.inc
 * \class LayerThemes
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the LayerThemes php class
 *
 * This class defines Rest Api to Vmap LayerThemes
 * 
 */
require_once 'Vmap.class.inc';
require_once 'LayerTheme.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class LayerThemes extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/layerthemes",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/layerthemes")
     *   }
     * )
     * * @SWG\Tag(
     *   name="LayerThemes",
     *   description=""
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function LayerThemes($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->aSelectedFields = Array("layertheme_id", "name", "description");
    }

    /**
     * @SWG\Get(path="/layerthemes",
     *   tags={"LayerThemes"},
     *   summary="Get LayerThemes",
     *   description="Request to get LayerThemes",
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
     *     type="boolean"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layerthemes")
     *     )
     *  )
     */

    /**
     * get LayerThemes
     * @return the array of objects
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'layertheme', 'layertheme_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Post(path="/layerthemes",
     *   tags={"LayerThemes"},
     *   summary="Add layertheme",
     *   description="Request to add a layertheme",
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
     *     name="name",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="description",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layerthemes")
     *     )
     *
     *  )
     * 
     * )
     */

    /**
     * insert layertheme
     * @return array containing the status and the message
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_vmap'], 'layertheme', $this->aProperties['schema_vmap'].'.seq_common', 'layertheme_id');           
        return $aReturn['sMessage'];
    }
    
    /**
     * @SWG\Put(path="/layerthemes/{layertheme_id}",
     *   tags={"LayerThemes"},
     *   summary="Update LayerTheme",
     *   description="Request to update layertheme",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="layertheme_id",
     *     in="path",
     *     description="user id",
     *     required=true,
     *     type="integer",
     *   format="int32"
     *   ),
     *   @SWG\Parameter(
     *     name="name",
     *     in="query",
     *     description="layertheme description",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="description",
     *     in="query",
     *     description="layertheme description",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layerthemes")
     *     ),
     * 
     *  )
     */

    /**
     * modify layertheme
     * @return array containing the status and the message
     */
    function PUT() {        
        $aReturn = $this->genericPut($this->aProperties['schema_vmap'], 'layertheme', 'layertheme_id');
        return $aReturn['sMessage'];
    }
    
    /**
     * @SWG\Delete(path="/layerthemes/",
     *   tags={"LayerThemes"},
     *   summary="delete LayerTheme",
     *   description="Request to delete LayerTheme",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
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
     *     description="id of the layerthemes",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layerthemes")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/layerthemes/{layertheme_id}",
     *   tags={"LayerThemes"},
     *   summary="delete LayerTheme",
     *   description="Request to delete LayerTheme",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="layertheme_id",
     *     in="path",
     *     description="id of the layertheme",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layerthemes")
     *     )
     *  )
     */
    
    /**
     * delete layertheme
     * @return id of layertheme deleted or error object if a layertheme is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vmap'], 'layertheme', 'layertheme_id');
        return $aReturn['sMessage'];
    }

}

?>
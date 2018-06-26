<?php

/**
 * \file MapThemes.class.inc
 * \class MapThemes
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the MapThemes php class
 *
 * This class defines Rest Api to Vmap MapThemes
 * 
 */
require_once 'Vmap.class.inc';
require_once 'MapTheme.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class MapThemes extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/mapthemes",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/mapthemes")
     *   }
     * )
     * * @SWG\Tag(
     *   name="MapThemes",
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
        $this->aSelectedFields = Array("maptheme_id", "name", "description");
    }

    /**
     * @SWG\Get(path="/mapthemes",
     *   tags={"MapThemes"},
     *   summary="Get MapThemes",
     *   description="Request to get MapThemes",
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
     *     type="integer"
     *   ),
     * @SWG\Parameter(
     *     name="offset",
     *     in="query",
     *     description="index of first element",
     *     required=false,
     *     type="string"
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
     *         @SWG\Schema(ref="#/definitions/mapthemes")
     *     )
     *  )
     */

    /**
     * get MapThemes
     * @return the array of objects
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'maptheme', 'maptheme_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Post(path="/mapthemes",
     *   tags={"MapThemes"},
     *   summary="Add maptheme",
     *   description="Request to add a maptheme",
     *   operationId="POST",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="formData",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="name",
     *     in="formData",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="description",
     *     in="formData",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/mapthemes")
     *     )
     *
     *  )
     * 
     * )
     */

    /**
     * insert maptheme
     * @return array containing the status and the message
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_vmap'], 'maptheme', $this->aProperties['schema_vmap'].'.seq_common', 'maptheme_id');           
        return $aReturn['sMessage'];
    }
    
    /**
     * @SWG\Put(path="/mapthemes/{maptheme_id}",
     *   tags={"MapThemes"},
     *   summary="Update MapTheme",
     *   description="Request to update maptheme",
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
     *     name="maptheme_id",
     *     in="path",
     *     description="user id",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Parameter(
     *     name="name",
     *     in="query",
     *     description="maptheme description",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="description",
     *     in="query",
     *     description="maptheme description",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/mapthemes")
     *     ),
     * 
     *  )
     */

    /**
     * modify maptheme
     * @return array containing the status and the message
     */
    function PUT() {        
        $aReturn = $this->genericPut($this->aProperties['schema_vmap'], 'maptheme', 'maptheme_id');
        return $aReturn['sMessage'];
    }
    
    /**
     * @SWG\Delete(path="/mapthemes/",
     *   tags={"MapThemes"},
     *   summary="delete MapTheme",
     *   description="Request to delete MapTheme",
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
     *     description="id of the mapthemes",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/mapthemes")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/mapthemes/{maptheme_id}",
     *   tags={"MapThemes"},
     *   summary="delete MapTheme",
     *   description="Request to delete MapTheme",
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
     *     name="maptheme_id",
     *     in="path",
     *     description="id of the maptheme",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/mapthemes")
     *     )
     *  )
     */
    
    /**
     * delete maptheme
     * @return id of maptheme deleted or error object if a maptheme is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vmap'], 'maptheme', 'maptheme_id');
        return $aReturn['sMessage'];
    }

}

?>
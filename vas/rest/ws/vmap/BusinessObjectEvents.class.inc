<?php

/**
 * \file BusinessObjectEvents.class.inc
 * \class BusinessObjectEvents
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the BusinessObjectEvents php class
 *
 * This class defines Rest Api to Vmap BusinessObjectEvents
 * 
 */
require_once 'Vmap.class.inc';
require_once 'BusinessObjectEvent.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class BusinessObjectEvents extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/businessobjectevents",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/businessobjectevents")
     *   }
     * )
     * * @SWG\Tag(
     *   name="BusinessObjectEvents",
     *   description=""
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function BusinessObjectEvents($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->aSelectedFields = Array("event_id", "description");
    }

    /**
     * @SWG\Get(path="/businessobjectevents",
     *   tags={"BusinessObjectEvents"},
     *   summary="Get BusinessObjectEvents",
     *   description="Request to get BusinessObjectEvents",
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
     *         @SWG\Schema(ref="#/definitions/businessobjectevents")
     *     )
     *  )
     */

    /**
     * get BusinessObjectEvents
     * @return the array of objects
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'event', 'event_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Post(path="/businessobjectevents",
     *   tags={"BusinessObjectEvents"},
     *   summary="Add businessobjectevent",
     *   description="Request to add a businessobjectevent",
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
     *     name="event_id",
     *     in="query",
     *     description="event id",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="description",
     *     in="query",
     *     description="event description",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjectevents")
     *     )
     *
     *  )
     * 
     * )
     */

    /**
     * insert businessobjectevent
     * @return array containing the status and the message
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_vmap'], 'event', '', 'event_id');
        return $aReturn['sMessage'];
    }
    
    /**
     * @SWG\Put(path="/businessobjectevents/{event_id}",
     *   tags={"BusinessObjectEvents"},
     *   summary="Update BusinessObjectEvent",
     *   description="Request to update businessobjectevent",
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
     *     name="event_id",
     *     in="path",
     *     description="event id",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="description",
     *     in="query",
     *     description="event description",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjectevents")
     *     ),
     * 
     *  )
     */

    /**
     * modify businessobjectevent
     * @return array containing the status and the message
     */
    function PUT() {        
        $aReturn = $this->genericPut($this->aProperties['schema_vmap'], 'event', 'event_id');
        return $aReturn['sMessage'];
    }
    
    /**
     * @SWG\Delete(path="/businessobjectevents/",
     *   tags={"BusinessObjectEvents"},
     *   summary="delete BusinessObjectEvent",
     *   description="Request to delete BusinessObjectEvent",
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
     *     description="event id",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjectevents")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/businessobjectevents/{event_id}",
     *   tags={"BusinessObjectEvents"},
     *   summary="delete BusinessObjectEvent",
     *   description="Request to delete BusinessObjectEvent",
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
     *     name="event_id",
     *     in="path",
     *     description="event id",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjectevents")
     *     )
     *  )
     */
    
    /**
     * delete businessobjectevent
     * @return id of businessobjectevent deleted or error object if a businessobjectevent is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vmap'], 'event', 'event_id');
        return $aReturn['sMessage'];
    }

}

?>
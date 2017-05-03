<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file BusinessObjectEvent.class.inc
 * \class BusinessObjectEvent
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the BusinessObjectEvent php class
 *
 * This class defines operation for one BusinessObjectEvent
 * 
 */
class BusinessObjectEvent extends Vmap {

    public $oError;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $oConnection) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
        $this->aSelectedFields = Array("event_id", "description");
    }

    /**
     * @SWG\Get(path="/businessobjectevents/{event_id}", 
     *   tags={"BusinessObjectEvents"},
     *   summary="Get BusinessObjectEvent",
     *   description="Request to get event of business object by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="event_id",
     *     in="path",
     *     description="event id",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjectevent")
     *     )
     *  )
     */

    /**
     * get informations about businessobjectevents
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'event', 'event_id');
    }

    /**
     * delete a businessobjectevent
     */
    function DELETE() {
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'event', 'event_id', $this->aValues['my_vitis_id'], 'text');
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            $this->oConnection->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
            $this->aFields['event_id'] = $this->aValues['my_vitis_id'];
        }
    }

}

?>
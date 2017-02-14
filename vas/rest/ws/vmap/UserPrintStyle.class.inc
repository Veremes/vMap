<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file UserPrintStyle.class.inc
 * \class UserPrintStyle
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the UserPrintStyle php class
 *
 * This class defines operation for one UserPrintStyle
 * 
 */
class UserPrintStyle extends Vmap {

    public $oError;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function UserPrintStyle($aPath, $aValues, $properties, $oConnection) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
        $this->aSelectedFields = Array("printstyle_id", "name", "definition");
    }

    /**
     * @SWG\Get(path="/userprintstyles/{printstyle_id}", 
     *   tags={"PrintStyles"},
     *   summary="Get UserPrintStyle",
     *   description="Request to get UserPrintStyle by id",
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
     *     name="printstyle_id",
     *     in="path",
     *     description="printstyle id",
     *     required=true,
     *     type="integer",
     *   format="int32"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/userprintstyles")
     *     )
     *  )
     */

    /**
     * get informations about UserPrintStyle
     */
    function GET() {
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'v_user_printstyle', 'printstyle_id');
        $this->aFields['definition'] = str_replace(array("\r", "\n", "\t"), '', $this->aFields['definition']);
    }
}

?>
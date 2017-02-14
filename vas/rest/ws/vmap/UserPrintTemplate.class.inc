<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file UserPrintTemplate.class.inc
 * \class UserPrintTemplate
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the UserPrintTemplate php class
 *
 * This class defines operation for one UserPrintTemplate
 * 
 */
class UserPrintTemplate extends Vmap {

    public $oError;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function UserPrintTemplate($aPath, $aValues, $properties, $oConnection) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
        $this->aSelectedFields = Array("printtemplate_id", "name", "rt_format_id", "rt_orientation_id", "definition", "outputformats_id", "sql", "ressource_id", "business_object_id");
    }

    /**
     * @SWG\Get(path="/userprinttemplates/{printtemplate_id}", 
     *   tags={"PrintTemplates"},
     *   summary="Get UserPrintTemplate",
     *   description="Request to get UserPrintTemplate by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="printtemplate_id",
     *     in="path",
     *     description="printtemplate id",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/userprinttemplates")
     *     )
     *  )
     */

    /**
     * get informations about userprinttemplate
     */
    function GET() {
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'v_template', 'printtemplate_id');
    }
}
?>
<?php

/**
 * \file PrintReports.class.inc
 * \class PrintReports
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the PrintReports php class
 *
 * This class defines Rest Api to Vmap PrintReports
 * 
 */
require_once 'Vmap.class.inc';
require_once 'PrintReport.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class PrintReports extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/printreports",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/printreports")
     *   }
     * )
     * * @SWG\Tag(
     *   name="PrintReports",
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
        $this->aSelectedFields = Array("printreport_id", "name", "rt_format_id", "rt_orientation_id", "outputformats_id", "business_object_id", "multiobject", "htmldefinition", "jsonobjects", "business_object_title", "business_object_id_field", "business_object_database", "business_object_schema", "business_object_table", "business_object_geom_column");
    }

    /**
     * @SWG\Get(path="/printreports",
     *   tags={"PrintReports"},
     *   summary="Get PrintReports",
     *   description="Request to get PrintReports",
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
     *         @SWG\Schema(ref="#/definitions/printreports")
     *     )
     *  )
     */
    
    /**
     * get PrintReports
     * @return  PrintReports
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'v_printreport', 'printreport_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Post(path="/printreports",
     *   tags={"PrintReports"},
     *   summary="Add printreport",
     *   description="Request to add a printreport",
     *   operationId="POST",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="formData",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="name",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="rt_format_id",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="rt_orientation_id",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="outputformats_id",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="business_object_id",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="htmldefinition",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="jsonobjects",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="multiobject",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="boolean"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printreports")
     *     )
     *
     *  )
     * 
     * )
     */

    /**
     * insert printreport
     * @return array containing the status and the message
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_vmap'], 'printreport', $this->aProperties['schema_vmap'].'.seq_common', 'printreport_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/printreports/{printreport_id}",
     *   tags={"PrintReports"},
     *   summary="Update PrintReport",
     *   description="Request to update printreport",
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
     *     name="printreport_id",
     *     in="path",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="name",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="rt_format_id",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="rt_orientation_id",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="outputformats_id",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="business_object_id",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="htmldefinition",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="jsonobjects",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printreports")
     *     ),
     * 
     *  )
     */

    /**
     * modify printreport
     * @return array containing the status and the message
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_vmap'], 'printreport', 'printreport_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/printreports/",
     *   tags={"PrintReports"},
     *   summary="delete PrintReport",
     *   description="Request to delete PrintReport",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="printreport token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id of the printreports",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printreports")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/printreports/{printreport_id}",
     *   tags={"PrintReports"},
     *   summary="delete PrintReport",
     *   description="Request to delete PrintReport",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="printreport token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="printreport_id",
     *     in="path",
     *     description="id of the printreport",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printreports")
     *     )
     *  )
     */

    /**
     * delete printreport
     * @return id of printreport deleted or error object if a printreport is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vmap'], 'printreport', 'printreport_id');
        return $aReturn['sMessage'];
    }

}

?>
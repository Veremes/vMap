<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file PrintReport.class.inc
 * \class PrintReport
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the PrintReport php class
 *
 * This class defines operation for one PrintReport
 * 
 */
class PrintReport extends Vmap {

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
        $this->aSelectedFields = Array("printreport_id", "name", "rt_format_id", "rt_orientation_id", "outputformats_id", "business_object_id", "multiobject", "htmldefinition", "jsonobjects", "business_object_title", "business_object_id_field", "business_object_database", "business_object_schema", "business_object_table", "business_object_geom_column");
    }

    /**
     * @SWG\Get(path="/printreports/{printreport_id}", 
     *   tags={"PrintReports"},
     *   summary="Get PrintReport",
     *   description="Request to get PrintReport by id",
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
     *     name="printreport_id",
     *     in="path",
     *     description="printreport id",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printreports")
     *     )
     *  )
     */

    /**
     * get informations about PrintReport
     */
    function GET() {        
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'v_printreport', 'printreport_id');        
    }
    
    /**
     * delete a printreport
     */
    function DELETE(){
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'printreport', 'printreport_id', $this->aValues['my_vitis_id'], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
                $this->aFields[printreport_id] = $this->aValues['id'];
        }
    }
}

?>
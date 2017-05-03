<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file PrintParameter.class.inc
 * \class PrintParameter
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the PrintParameter php class
 *
 * This class defines operation for one PrintParameter
 * 
 */
class PrintParameter extends Vmap {

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
        $this->aSelectedFields = Array("printparameter_id", "printtemplate_id", "name", "editable", "label", "placeholder", "defaultvalue", "print_template");
    }

    /**
     * @SWG\Get(path="/printparameters/{printparameter_id}", 
     *   tags={"PrintParameters"},
     *   summary="Get PrintParameter",
     *   description="Request to get PrintParameter by id",
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
     *     name="printparameter_id",
     *     in="path",
     *     description="printparameter id",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printparameters")
     *     )
     *  )
     */

    /**
     * get informations about PrintParameter
     */
    function GET() {
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'v_print_parameter', 'printparameter_id');
    }
    
    /**
     * delete a printparameter
     */
    function DELETE(){
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'printparameter', 'printparameter_id', $this->aValues['my_vitis_id'], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
                $this->aFields['printparameter_id'] = $this->aValues['my_vitis_id'];
        }
    }
}

?>
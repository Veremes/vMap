<?php

/**
 * \file PrintParameters.class.inc
 * \class PrintParameters
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the PrintParameters php class
 *
 * This class defines Rest Api to Vmap PrintParameters
 * 
 */
require_once 'Vmap.class.inc';
require_once 'PrintParameter.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class PrintParameters extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/printparameters",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/printparameters")
     *   }
     * )
     * * @SWG\Tag(
     *   name="PrintParameters",
     *   description=""
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function __construct($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->aSelectedFields = Array("printparameter_id", "printtemplate_id", "name", "editable", "label", "placeholder", "defaultvalue", "print_template");
    }

    /**
     * @SWG\Get(path="/printparameters",
     *   tags={"PrintParameters"},
     *   summary="Get PrintParameters",
     *   description="Request to get PrintParameters",
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
     *         @SWG\Schema(ref="#/definitions/printparameters")
     *     )
     *  )
     */

    /**
     * get PrintParameters
     * @return  PrintParameters
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'v_print_parameter', 'printparameter_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Post(path="/printparameters",
     *   tags={"PrintParameters"},
     *   summary="Add printparameter",
     *   description="Request to add a printparameter",
     *   operationId="POST",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="formData",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="printtemplate_id",
     *     in="formData",
     *     description="Print template id",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="name",
     *     in="formData",
     *     description="Name",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="editable",
     *     in="formData",
     *     description="editable",
     *     required=false,
     *     type="boolean"
     *   ),
     *  @SWG\Parameter(
     *     name="label",
     *     in="formData",
     *     description="Label",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="placeholder",
     *     in="formData",
     *     description="Placeholder",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="defaultvalue",
     *     in="formData",
     *     description="Default Value",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printparameters")
     *     )
     *
     *  )
     * 
     * )
     */

    /**
     * insert printparameter
     * @return array containing the status and the message
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_vmap'], 'printparameter', $this->aProperties['schema_vmap'].'.seq_common', 'printparameter_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/printparameters/{printparameter_id}",
     *   tags={"PrintParameters"},
     *   summary="Update PrintParameter",
     *   description="Request to update printparameter",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="printparameter_id",
     *     in="path",
     *     description="Print parameter id",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="printtemplate_id",
     *     in="query",
     *     description="Print template id",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="name",
     *     in="query",
     *     description="Name",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="editable",
     *     in="query",
     *     description="editable",
     *     required=false,
     *     type="boolean"
     *   ),
     *  @SWG\Parameter(
     *     name="label",
     *     in="query",
     *     description="Label",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="placeholder",
     *     in="query",
     *     description="Placeholder",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="defaultvalue",
     *     in="query",
     *     description="Default Value",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printparameters")
     *     ),
     * 
     *  )
     */

    /**
     * modify printparameter
     * @return array containing the status and the message
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_vmap'], 'printparameter', 'printparameter_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/printparameters/",
     *   tags={"PrintParameters"},
     *   summary="delete PrintParameter",
     *   description="Request to delete PrintParameter",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="printparameter token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id of the printparameters",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printparameters")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/printparameters/{printparameter_id}",
     *   tags={"PrintParameters"},
     *   summary="delete PrintParameter",
     *   description="Request to delete PrintParameter",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="printparameter token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="printparameter_id",
     *     in="path",
     *     description="id of the printparameter",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printparameters")
     *     )
     *  )
     */

    /**
     * delete printparameter
     * @return id of printparameter deleted or error object if a printparameter is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vmap'], 'printparameter', 'printparameter_id');
        return $aReturn['sMessage'];
    }

}
?>
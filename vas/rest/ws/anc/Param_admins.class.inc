<?php

/**
 * \file Param_admins.class.inc
 * \class Param_admins
 *
 * \author WAB <support.wab@veremes.com>.
 *
 * 	\brief This file contains the Param_admins php class
 *
 * This class defines Rest Api to Vitis Param_admins
 * 
 */
require_once __DIR__ . '/Anc.class.inc';
require_once 'Param_admin.class.inc';


class Param_admins extends Anc {
    /**
     * @SWG\Definition(
     *   definition="/param_admins",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/param_admins")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Param_admins",
     *   description="Operations about Param_admins"
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
    }

    /**
     * @SWG\Get(path="/param_admins",
     *   tags={"Param_admins"},
     *   summary="Get Param_admins",
     *   description="Request to get Param_admins",
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
     *     description="sort_order",
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
     *         description="param_admin Response",
     *         @SWG\Schema(ref="#/definitions/param_admins")
     *     )
     *  )
     */

    /**
     * get Param_admins
     * @return  Param_admins
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_anc'], "v_param_admin", "id_parametre_admin");
        $sMessage = $aReturn['sMessage'];
        return $sMessage;
    }

    /**
     * @SWG\Post(path="/param_admins",
     *   tags={"Param_admins"},
     *   summary="Add param_admin",
     *   description="Request to add Param_admins",
     *   operationId="POST",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="param_admin Response",
     *         @SWG\Schema(ref="#/definitions/param_admins")
     *     )
     *  )
     */

    /**
     * insert param_admin
     * @return id of the param_admin created
     */
    function POST() {
        // Conversion des dates
        $aDates = array('date_fin_validite');
        foreach ($aDates as $sDate) {
            if (isset($this->aValues[$sDate])) {
                if ($this->aValues[$sDate] == '')
                    unset($this->aValues[$sDate]);
                else
                    $this->aValues[$sDate] = date_format(date_create_from_format('d/m/Y', $this->aValues[$sDate]), 'Y-m-d');
            }
        }
        $aReturn = $this->genericPost($this->aProperties['schema_anc'], 'param_admin', $this->aProperties['schema_anc'].'.param_admin_id_parametre_admin_seq', 'id_parametre_admin');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/param_admins/{id_param_admin}",
     *   tags={"Param_admins"},
     *   summary="update Param_admins",
     *   description="Request to update Param_admins",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Param_admin token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_param_admin",
     *     in="path",
     *     description="id of the Param_admins",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/param_admins")
     *     )
     *  )
     */

    /**
     * update param_admins
     * @return id of param_admins updated or error object if a param_admins is not updated
     */
    function PUT() {
        // Conversion des dates
        $aDates = array('date_fin_validite');
        foreach ($aDates as $sDate) {
            if (isset($this->aValues[$sDate])) {
                if ($this->aValues[$sDate] == '')
                    unset($this->aValues[$sDate]);
                else
                    $this->aValues[$sDate] = date_format(date_create_from_format('d/m/Y', $this->aValues[$sDate]), 'Y-m-d');
            }
        }
        $aReturn = $this->genericPut($this->aProperties['schema_anc'], 'param_admin', 'id_parametre_admin');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/param_admins",
     *   tags={"Param_admins"},
     *   summary="delete Param_admins",
     *   description="Request to delete Param_admins",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id of the param_admin",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="param_admin Response",
     *         @SWG\Schema(ref="#/definitions/param_admins")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/param_admins/{id_param_admin}",
     *   tags={"Param_admins"},
     *   summary="delete Param_admins",
     *   description="Request to delete Param_admins",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Param_admin token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_param_admin",
     *     in="path",
     *     description="id of the Param_admins",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/param_admins")
     *     )
     *  )
     */

    /**
     * delete param_admins
     * @return id of param_admins deleted or error object if a param_admins is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_anc'], 'param_admin', 'id_parametre_admin');
        return $aReturn['sMessage'];
    }
}
?>
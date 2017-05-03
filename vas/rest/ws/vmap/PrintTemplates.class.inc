<?php

/**
 * \file PrintTemplates.class.inc
 * \class PrintTemplates
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the PrintTemplates php class
 *
 * This class defines Rest Api to Vmap PrintTemplates
 * 
 */
require_once 'Vmap.class.inc';
require_once 'PrintTemplate.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class PrintTemplates extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/printtemplates",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/printtemplates")
     *   }
     * )
     * * @SWG\Tag(
     *   name="PrintTemplates",
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
        $this->aSelectedFields = Array("printtemplate_id", "name", "rt_format_id", "rt_orientation_id", "definition", "outputformats_id");
    }

    /**
     * @SWG\Get(path="/printtemplates",
     *   tags={"PrintTemplates"},
     *   summary="Get PrintTemplates",
     *   description="Request to get PrintTemplates",
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
     *         @SWG\Schema(ref="#/definitions/printtemplates")
     *     )
     *  )
     */
    
    /**
     * get PrintTemplates
     * @return  PrintTemplates
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'v_template', 'printtemplate_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Post(path="/printtemplates",
     *   tags={"PrintTemplates"},
     *   summary="Add printtemplate",
     *   description="Request to add a printtemplate",
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
     *     name="definition",
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
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printtemplates")
     *     )
     *
     *  )
     * 
     * )
     */

    /**
     * insert printtemplate
     * @return array containing the status and the message
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_vmap'], 'printtemplate', $this->aProperties['schema_vmap'].'.seq_common', 'printtemplate_id');
        // Groupes à rattacher à la carte ?
        if (!empty($this->aValues['groups'])) {
            require $this->sRessourcesFile;
            $aGroups = explode('|', $this->aValues['groups']);
            foreach ($aGroups as $iGroupId) {
                $sSql = str_replace('[printtemplate_id]', $this->aValues["my_vitis_id"], $aSql['insertPrintTemplateGroups']);
                $sSql = str_replace('[group_id]', $iGroupId, $sSql);
                $sSql = str_replace('[sSchemaVmap]', $this->aProperties['schema_vmap'], $sSql);
                $resultat = $this->oConnection->oBd->execute($sSql);
                if ($this->oConnection->oBd->enErreur()) {
                    $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                }
            }
        }
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/printtemplates/{printtemplate_id}",
     *   tags={"PrintTemplates"},
     *   summary="Update PrintTemplate",
     *   description="Request to update printtemplate",
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
     *     name="printtemplate_id",
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
     *     name="definition",
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
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printtemplates")
     *     ),
     * 
     *  )
     */

    /**
     * modify printtemplate
     * @return array containing the status and the message
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_vmap'], 'printtemplate', 'printtemplate_id');
        // Supprime les groupes rattachés au modèle.
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'printtemplate_group', 'printtemplate_id', $this->aValues["my_vitis_id"]);
        // Groupes à rattacher à la carte ?
        if (!empty($this->aValues['groups'])) {
            require $this->sRessourcesFile;
            $aGroups = explode('|', $this->aValues['groups']);
            foreach ($aGroups as $iGroupId) {
                $sSql = str_replace('[printtemplate_id]', $this->aValues["my_vitis_id"], $aSql['insertPrintTemplateGroups']);
                $sSql = str_replace('[group_id]', $iGroupId, $sSql);
                $sSql = str_replace('[sSchemaVmap]', $this->aProperties['schema_vmap'], $sSql);
                $resultat = $this->oConnection->oBd->execute($sSql);
                if ($this->oConnection->oBd->enErreur()) {
                    $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                }
            }
        }
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/printtemplates/",
     *   tags={"PrintTemplates"},
     *   summary="delete PrintTemplate",
     *   description="Request to delete PrintTemplate",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="printtemplate token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id of the printtemplates",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printtemplates")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/printtemplates/{printtemplate_id}",
     *   tags={"PrintTemplates"},
     *   summary="delete PrintTemplate",
     *   description="Request to delete PrintTemplate",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="printtemplate token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="printtemplate_id",
     *     in="path",
     *     description="id of the printtemplate",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printtemplates")
     *     )
     *  )
     */

    /**
     * delete printtemplate
     * @return id of printtemplate deleted or error object if a printtemplate is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vmap'], 'printtemplate', 'printtemplate_id');
        return $aReturn['sMessage'];
    }

}

?>
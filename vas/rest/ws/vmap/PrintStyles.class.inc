<?php

/**
 * \file PrintStyles.class.inc
 * \class PrintStyles
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the PrintStyles php class
 *
 * This class defines Rest Api to Vmap PrintStyles
 * 
 */
require_once 'Vmap.class.inc';
require_once 'PrintStyle.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class PrintStyles extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/printstyles",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/printstyles")
     *   }
     * )
     * * @SWG\Tag(
     *   name="PrintStyles",
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
        $this->aSelectedFields = Array("printstyle_id", "name", "definition", "users");
    }

    /**
     * @SWG\Get(path="/printstyles",
     *   tags={"PrintStyles"},
     *   summary="Get PrintStyles",
     *   description="Request to get PrintStyles",
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
     *         @SWG\Schema(ref="#/definitions/printstyles")
     *     )
     *  )
     */

    /**
     * get PrintStyles
     * @return  PrintStyles
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'printstyle', 'printstyle_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Post(path="/printstyles",
     *   tags={"PrintStyles"},
     *   summary="Add printstyle",
     *   description="Request to add a printstyle",
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
     *     name="name",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="definition",
     *     in="formData",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printstyles")
     *     )
     *
     *  )
     * 
     * )
     */

    /**
     * insert printstyle
     * @return array containing the status and the message
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_vmap'], 'printstyle', $this->aProperties['schema_vmap'].'.seq_common', 'printstyle_id');
        // Si création OK -> maj des utilisateurs rattachés à au style.
        if ($aReturn['sStatus'] == 1){
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $oPrintStyle = new PrintStyle($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
            $oPrintStyle->GET();
            // Utilisateurs à rattacher au style ?
            if (!empty($this->aValues['users'])) {
                require $this->sRessourcesFile;
                $aUsers = explode('|', $this->aValues['users']);
                foreach ($aUsers as $iUserId) {
                    $sSql = str_replace('[printstyle_id]', $this->aValues["my_vitis_id"], $aSql['insertPrintStyleUsers']);
                    $sSql = str_replace('[user_id]', $iUserId, $sSql);
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
        }
        else{
            $sMessage = $aReturn['sMessage'];
        }
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/printstyles/{printstyle_id}",
     *   tags={"PrintStyles"},
     *   summary="Update PrintStyle",
     *   description="Request to update printstyle",
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
     *     name="printstyle_id",
     *     in="path",
     *     description="",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="name",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="definition",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printstyles")
     *     ),
     * 
     *  )
     */

    /**
     * modify printstyle
     * @return array containing the status and the message
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_vmap'], 'printstyle', 'printstyle_id');
        // Si création OK -> maj des utilisateurs rattachés à au style.
        if ($aReturn['sStatus'] == 1){
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            // Supprime les utilisateurs rattachés au style.
            $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'user_printstyle', 'printstyle_id', $this->aValues["my_vitis_id"]);
            // Utilisateurs à rattacher au style ?
            if (!empty($this->aValues['users'])) {
                require $this->sRessourcesFile;
                $aUsers = explode('|', $this->aValues['users']);
                foreach ($aUsers as $iUserId) {
                    $sSql = str_replace('[printstyle_id]', $this->aValues["my_vitis_id"], $aSql['insertPrintStyleUsers']);
                    $sSql = str_replace('[user_id]', $iUserId, $sSql);
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
        }
        else{
            $sMessage = $aReturn['sMessage'];
        }
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/printstyles/",
     *   tags={"PrintStyles"},
     *   summary="delete PrintStyle",
     *   description="Request to delete PrintStyle",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="printstyle token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id of the printstyles",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printstyles")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/printstyles/{printstyle_id}",
     *   tags={"PrintStyles"},
     *   summary="delete PrintStyle",
     *   description="Request to delete PrintStyle",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="printstyle token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="printstyle_id",
     *     in="path",
     *     description="id of the printstyle",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printstyles")
     *     )
     *  )
     */

    /**
     * delete printstyle
     * @return id of printstyle deleted or error object if a printstyle is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_vmap'], 'printstyle', 'printstyle_id');
        return $aReturn['sMessage'];
    }

}
?>
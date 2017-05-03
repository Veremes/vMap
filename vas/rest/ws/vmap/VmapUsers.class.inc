<?php

/**
* \file VmapUsers.class.inc
* \class VmapUsers
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the Modes php class
*
* This class defines Rest Api to Vmap Users
* 
*/
require_once 'Vmap.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
require_once 'VmapUser.class.inc';
require_once(__DIR__.'/../../class/vmlib/BdDataAccess.inc');

class VmapUsers extends Vmap {
    
     /**
     * @SWG\Definition(
     *   definition="/vmapusers",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/vmapusers")
     *   }
     * )
     * * @SWG\Tag(
     *   name="VmapUsers",
     *   description="Operations about Users"
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
        $this->aSelectedFields = Array("user_id", "login", "print_styles");
    }
    
    /**
     * get Users
     * @return  Users
     */
    function GET() {
        $aReturn = $this->genericGet( $this->aProperties['schema_framework'], "v_user", "user_id");
        return $aReturn['sMessage'];
    }
    
    /**
     * @SWG\Put(path="/vmapusers/{user_id}",
     *   tags={"Users"},
     *   summary="Update User",
     *   description="Request to update User",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="user_id",
     *     in="path",
     *     description="id of the user",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * * @SWG\Parameter(
     *     name="maps",
     *     in="query",
     *     description="Maps of the user",
     *     required=false,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="print_styles",
     *     in="query",
     *     description="Print styles of the user",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Properties Response",
     *         @SWG\Schema(ref="#/definitions/users")
     *     )
     *  )
     */

    /**
     * update user
     * @return id of the user if ok error object if ko
     */
    function PUT() {
        require $this->sRessourcesFile;
        $aXmlRacineAttribute['status'] = 1;
        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        // Supprime les styles d'impression rattachés à l'utilisateur.
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'user_printstyle', 'user_id', $this->aValues["my_vitis_id"]);
        // Styles d'impression à rattacher au usere ?
        if (!empty($this->aValues['print_styles'])) {
            $aPrintStyles = explode('|', $this->aValues['print_styles']);
            foreach ($aPrintStyles as $iPrintStyleId) {
                $sSql = str_replace('[printstyle_id]', $iPrintStyleId, $aSql['insertUserPrintStyles']);
                $sSql = str_replace('[user_id]', $this->aValues["my_vitis_id"], $sSql);
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
        return $sMessage;
    }
}
?>
<?php

/**
* \file VmapGroups.class.inc
* \class VmapGroups
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the Modes php class
*
* This class defines Rest Api to Vmap Groups
* 
*/
require_once 'Vmap.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
require_once 'VmapGroup.class.inc';
require_once(__DIR__.'/../../class/vmlib/BdDataAccess.inc');

class VmapGroups extends Vmap {
    
     /**
     * @SWG\Definition(
     *   definition="/vmapgroups",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/vmapgroups")
     *   }
     * )
     * * @SWG\Tag(
     *   name="VmapGroups",
     *   description="Operations about Groups"
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
        $this->aSelectedFields = Array("group_id", "name", "nb_members", "maps", "print_templates");
    }
    
    /**
     * get Groups
     * @return  Groups
     */
    function GET() {
        $aReturn = $this->genericGet( $this->aProperties['schema_framework'], "v_group", "group_id");
        return $aReturn['sMessage'];
    }
    
    /**
     * @SWG\Put(path="/vmapgroups/{group_id}",
     *   tags={"Groups"},
     *   summary="Update Group",
     *   description="Request to update Group",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="group token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="group_id",
     *     in="path",
     *     description="id of the group",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * * @SWG\Parameter(
     *     name="maps",
     *     in="query",
     *     description="Maps of the group",
     *     required=false,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="print_templates",
     *     in="query",
     *     description="Print templates of the group",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Properties Response",
     *         @SWG\Schema(ref="#/definitions/groups")
     *     )
     *  )
     */

    /**
     * update group
     * @return id of the group if ok error object if ko
     */
    function PUT() {
        require $this->sRessourcesFile;
        $aXmlRacineAttribute['status'] = 1;
        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        // Supprime les cartes rattachés au groupe.
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'map_group', 'group_id', $this->aValues["my_vitis_id"]);
        // Cartes à rattacher au groupe ?
        if (!empty($this->aValues['maps'])) {
            $aMaps = explode('|', $this->aValues['maps']);
            foreach ($aMaps as $iMapId) {
                $sSql = $aSql['insertGroupMaps'];
                $aSQLParams = array(
                    'sSchemaVmap' => array('value' => $this->aProperties['schema_vmap'], 'type' => 'column_name'),
                    'group_id' => array('value' => $this->aValues["my_vitis_id"], 'type' => 'number'),
                    'map_id' => array('value' => $iMapId, 'type' => 'number')
                );
                $resultat = $this->oConnection->oBd->executeWithParams($sSql, $aSQLParams);
                if ($this->oConnection->oBd->enErreur()) {
                    $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                }
            }
        }
        // Supprime les modèles d'impression rattachés au groupe.
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'printtemplate_group', 'group_id', $this->aValues["my_vitis_id"]);
        // Modèles d'impression à rattacher au groupe ?
        if (!empty($this->aValues['print_templates'])) {
            $aPrintTemplates = explode('|', $this->aValues['print_templates']);
            foreach ($aPrintTemplates as $iPrintTemplateId) {                
                $sSql = $aSql['insertGroupPrintTemplates'];
                $aSQLParams = array(
                    'sSchemaVmap' => array('value' => $this->aProperties['schema_vmap'], 'type' => 'column_name'),
                    'group_id' => array('value' => $this->aValues["my_vitis_id"], 'type' => 'number'),
                    'printtemplate_id' => array('value' => $iPrintTemplateId, 'type' => 'number')
                );
                $resultat = $this->oConnection->oBd->executeWithParams($sSql, $aSQLParams);
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
<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file PrintTemplate.class.inc
 * \class PrintTemplate
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the PrintTemplate php class
 *
 * This class defines operation for one PrintTemplate
 * 
 */
class PrintTemplate extends Vmap {

    public $oError;

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
        $this->aSelectedFields = Array("printtemplate_id", "name", "rt_format_id", "rt_orientation_id", "definition", "outputformats_id", "groups");        
    }

    /**
     * @SWG\Get(path="/printtemplates/{printtemplate_id}", 
     *   tags={"PrintTemplates"},
     *   summary="Get PrintTemplate",
     *   description="Request to get PrintTemplate by id",
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
     *     name="printtemplate_id",
     *     in="path",
     *     description="printtemplate id",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printtemplates")
     *     )
     *  )
     */

    /**
     * get informations about PrintTemplate
     */
    function GET() {        
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'v_template', 'printtemplate_id');        
        $this->getGroups();
    }
    
    /**
     *  get groups of print template
     */
    function getGroups() {
        require $this->sRessourcesFile;
        if (in_array("groups", $this->aSelectedFields)){
            $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
            $aParams['sSchemaVmap'] = array('value' => $this->aProperties['schema_vmap'], 'type' => 'schema_name');
            $aParams['printtemplate_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'number');
            $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getPrintTemplateGroups'], $aParams);
            $sListGroupId = "";
            $aListGroupName = array();
            while($aLigne=$this->oConnection->oBd->ligneSuivante ($oPDOresult)) {
                    if ($sListGroupId == ""){
                            $sListGroupId = $aLigne["group_id"];
                    }else{
                            $sListGroupId .= "|".$aLigne["group_id"];
                    }
                    $aListGroupName[] = $aLigne["name"];
            }
            $oPDOresult=$this->oConnection->oBd->fermeResultat();
            $this->aFields['groups'] = $sListGroupId;
            $this->aFields['groups_label'] = implode(',', $aListGroupName);
        }
    }
    
    /**
     * delete a printtemplate
     */
    function DELETE(){
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'printtemplate', 'printtemplate_id', $this->aValues['my_vitis_id'], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
                $this->aFields['printtemplate_id'] = $this->aValues['my_vitis_id'];
        }
    }
}

?>
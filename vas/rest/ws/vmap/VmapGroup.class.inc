<?php
require_once 'Vmap.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
/**
* \file VmapGroup.class.inc
* \class VmapGroup
*
* \author Armand Bahi <armand.bahi@veremes.com>.
*
*	\brief This file contains the VmapGroup php class
*
* This class defines operation for one Group
* 
*/
class VmapGroup  extends Vmap {
    
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
        $this->aSelectedFields = Array("group_id", "name", "nb_members", "maps", "print_templates");
    }
      /**
     * @SWG\Get(path="/vmapgroups/{group_id}", 
     *   tags={"Groups"},
     *   summary="Get Group",
     *   description="Request to get Group by id",
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
     *     name="group_id",
     *     in="path",
     *     description="group id",
     *     required=true,
     *     type="integer"
     *   ),
       * @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="list of attributs",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/groups")
     *     )
     *  )
     */
    /**
     * get informations about mode
     */
    function GET(){
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_framework'], "v_group", "group_id");
        $this->getMaps();
        $this->getPrintTemplates();
    }
    
    /**
     *  get maps of group
     */
    function getMaps(){
        require $this->sRessourcesFile;
        if (in_array("maps", $this->aSelectedFields)){
                $aParams['sSchemaVmap'] = array('value' => $this->aProperties['schema_vmap'], 'type' => 'schema_name');
                $aParams['group_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'number');
                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getGroupMaps'], $aParams);
		$sListMapId = "";
		$aListMapName = array();
		while($aLigne=$this->oConnection->oBd->ligneSuivante ($oPDOresult)) {
			if ($sListMapId == ""){
				$sListMapId = $aLigne["map_id"];
			}else{
				$sListMapId .= "|".$aLigne["map_id"];
			}
                        $aListMapName[] = $aLigne["name"];
		}
		$oPDOresult=$this->oConnection->oBd->fermeResultat();
                $this->aFields['maps'] = $sListMapId;
                $this->aFields['maps_label'] = implode(',', $aListMapName);
        }
    }
    
    /**
     *  get print templates of group
     */
    function getPrintTemplates(){
        require $this->sRessourcesFile;
        if (in_array("print_templates", $this->aSelectedFields)){
                $aParams['sSchemaVmap'] = array('value' => $this->aProperties['schema_vmap'], 'type' => 'schema_name');
                $aParams['group_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'number');
                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getGroupPrintTemplates'], $aParams);
		$sListPrintTemplateId = "";
		$aListPrintTemplateName = array();
		while($aLigne=$this->oConnection->oBd->ligneSuivante ($oPDOresult)) {
			if ($sListPrintTemplateId == ""){
				$sListPrintTemplateId = $aLigne["printtemplate_id"];
			}else{
				$sListPrintTemplateId .= "|".$aLigne["printtemplate_id"];
			}
                        $aListPrintTemplateName[] = $aLigne["name"];
		}
		$oPDOresult=$this->oConnection->oBd->fermeResultat();
                $this->aFields['print_templates'] = $sListPrintTemplateId;
                $this->aFields['print_templates_label'] = implode(',', $aListPrintTemplateName);
        }
    }
}
?>
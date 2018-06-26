<?php
require_once 'Vmap.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
/**
* \file VmapUser.class.inc
* \class VmapUser
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the VmapUser php class
*
* This class defines operation for one User
* 
*/
class VmapUser  extends Vmap {
    
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
        $this->aSelectedFields = Array("user_id", "login", "print_styles");
    }
      /**
     * @SWG\Get(path="/vmapusers/{user_id}", 
     *   tags={"Users"},
     *   summary="Get User",
     *   description="Request to get user by id",
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
     *     name="user_id",
     *     in="path",
     *     description="user id",
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
     *         @SWG\Schema(ref="#/definitions/users")
     *     )
     *  )
     */
    /**
     * get informations about mode
     */
    function GET(){
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_framework'], "v_user", "user_id");
        $this->getPrintStyles();
    }
    
    /**
     *  get print styles of user
     */
    function getPrintStyles(){
        require $this->sRessourcesFile;
        if (in_array("print_styles", $this->aSelectedFields)){
                $aParams['sSchemaVmap'] = array('value' => $this->aProperties['schema_vmap'], 'type' => 'schema_name');
                $aParams['user_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'number');
                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getUserPrintStyles'], $aParams);
		$sListPrintStyleId = "";
                $aListPrintStyleId = array();
		while($aLigne=$this->oConnection->oBd->ligneSuivante ($oPDOresult)) {
			if ($sListPrintStyleId == ""){
				$sListPrintStyleId = $aLigne["printstyle_id"];
			}else{
				$sListPrintStyleId .= "|".$aLigne["printstyle_id"];
			}
                        $aListPrintStyleId[] = $aLigne["name"];
		}
		$oPDOresult=$this->oConnection->oBd->fermeResultat();
                $this->aFields['print_styles'] = $sListPrintStyleId;
                $this->aFields['print_styles_label'] = implode(',', $aListPrintStyleId);
        }
    }
}
?>
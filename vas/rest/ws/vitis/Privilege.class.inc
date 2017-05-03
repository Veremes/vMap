<?php
require_once 'Vitis.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
/**
* \file Privilege.class.inc
* \class Privilege
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the Privilege php class
*
* This class defines operation for one Privilege
* 
*/
class Privilege extends Vitis{
    
    public $oError;
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function __construct ($aPath, $aValues, $properties, $oConnection){
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
        $this->aSelectedFields = Array("rolname", "description", "type", "users");
    }
      /**
     * @SWG\Get(path="/privileges/{rolname}", 
     *   tags={"Privileges"},
     *   summary="Get Privilege",
     *   description="Request to get Privilege by rolname",
     *   operationId="GET",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="rolname",
     *     in="path",
     *     description="rolname",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Parameter(
     *     name="description",
     *     in="query",
     *     description="description of privilege",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="users",
     *     in="query",
     *     description="Users of the privilege",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/privileges")
     *     )
     *  )
     */
    /**
     * get informations about mode
     */
    function GET(){
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_framework'], "privileges", "rolname");
        $this->getUsers();
    }
    
    /**
     *  get users of privilege
     */
    function getUsers(){
        require $this->sRessourcesFile;
        if (in_array("users", $this->aSelectedFields)){
                $excludeLogin = '';
                $sSql = str_replace('[sSchemaFramework]', $this->aProperties['schema_framework'], $aSql['getUsersPrivileges']);
                $sSql = str_replace("[sSchemaFramework]", $this->aProperties['schema_framework'], $sSql);
                $sSql = str_replace('[vitis_user]', $this->aValues['my_vitis_id'], $sSql);
                $sSql = str_replace('[excludeLogin]', $excludeLogin, $sSql);
		$oPDOresult =$this->oConnection->oBd->execute ($sSql);
		$sListUserId = "";
		$aListUserName = array();
		while($aLigne=$this->oConnection->oBd->ligneSuivante ($oPDOresult)) {
			if ($sListUserId == ""){
				$sListUserId = $aLigne["user_id"];
			}else{
				$sListUserId .= "|".$aLigne["user_id"];
			}
                        $aListUserName[] = $aLigne["login"];
		}
		$oPDOresult=$this->oConnection->oBd->fermeResultat();
                $this->aFields['users'] = $sListUserId;
                $this->aFields['users_label'] = implode(',', $aListUserName);
        }
    }
}
?>
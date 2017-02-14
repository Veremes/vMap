<?php

require_once 'Vitis.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
/**
* \file User.class.inc
* \class User
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the User php class
*
* This class defines operation for one user
* 
*/
class User  extends Vitis{
    
    public $oError;
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function User ($aPath, $aValues, $properties, $oConnection){
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
        $this->aSelectedFields = Array("user_id", "login", "email", "name", "company", "department","ip_constraint", "domain", "domain_id", "restriction", "last_connection", "groups", "privileges", "role", "restriction");
    }
      /**
     * @SWG\Get(path="/users/{user_id}", 
     *   tags={"Users"},
     *   summary="Get User",
     *   description="Request to get User by id",
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
     *     type="integer",
       *   format="int32"
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
     * get informations about user
     */
    function GET(){
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_framework'], "v_user", "user_id");
        $this->getGroups();
        $this->getPrivileges();
    }
    
    /**
     *  get groups of user
     */
    function getGroups(){
        require $this->sRessourcesFile;
        if (in_array("groups", $this->aSelectedFields)){
           $sSql = str_replace('[sSchemaFramework]', $this->aProperties['schema_framework'], $aSql['getGroups']);
            $sSql = str_replace('[user_id]', $this->aValues['my_vitis_id'], $sSql);
		$oPDOresult =$this->oConnection->oBd->execute ($sSql);
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
     * get privileges of the user
     */
    function getPrivileges(){
        require $this->sRessourcesFile;
        if (in_array("privileges", $this->aSelectedFields)){
            $sSql = str_replace('[sSchemaFramework]', $this->aProperties['schema_framework'], $aSql['getUserPrivileges']);
            $sSql = str_replace('[user_id]', $this->aValues['my_vitis_id'], $sSql);
            $oPDOresult =$this->oConnection->oBd->execute ($sSql);
		$sListPrivileges = "";
		while($aLigne=$this->oConnection->oBd->ligneSuivante ($oPDOresult)) {
			if ($sListPrivileges == ""){
				$sListPrivileges = $aLigne["groname"];
			}else{
				$sListPrivileges .= "|".$aLigne["groname"];
			}
		}
		$oPDOresult=$this->oConnection->oBd->fermeResultat();
                $this->aFields['privileges'] = $sListPrivileges;
                $this->aFields['privileges_label'] = str_replace('|',',', $sListPrivileges);
        }
    }
    /**
     * delete an user
     */
    function DELETE(){
        require $this->sRessourcesFile;
        $sSql = str_replace('[user_id]', $this->aValues['my_vitis_id'], $aSql['getLoginbyId']);
        $sSql = str_replace('[sSchemaFramework]', $this->aProperties['schema_framework'], $sSql);
        $resultat = $this->oConnection->oBd->execute($sSql);
        $oUserDeleted = $this->oConnection->oBd->objetSuivant($resultat);
        $sLoginUserDeleted = $oUserDeleted->login;
        //delete in table
        $this->deleteChild($this->aProperties['schema_framework'], 'v_user', 'user_id', "vitis_admin");
        if (!$this->oConnection->oBd->enErreur()) {
            //delete rolgroup vitis_admin vitis_user ans delete role if no more rolgroup
            $oSgbdDataAccess = new PgsqlDataAccess($this->oConnection->oBd, $this->aProperties["database"], $this->aProperties["server"], "vitis_user", "vitis_admin", $this->aProperties["schema_framework"]);
            //Suppression du role gtf_user pour les utilisateurs supprimés
            $oSgbdDataAccess->deleteDatabaseUser($sLoginUserDeleted);
            //Suppression du role gtf_admin pour les utilisateurs supprimés
            $oSgbdDataAccess->deleteDatabaseAdminV2($sLoginUserDeleted);
            $sErrorMesssage = $oSgbdDataAccess->DeleteDatabaseRole($sLoginUserDeleted);
            if ($sErrorMesssage == "") {
                $this->aFields["user_id"] = $this->aValues['my_vitis_id'];
            } else {
                $this->oError = new Error(1, $this->oConnection->oBd->getBDMessage());
            }
        }
    }
}
?>
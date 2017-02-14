<?php

require_once 'Vitis.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
/**
* \file Group.class.inc
* \class Group
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the Group php class
*
* This class defines operation for one Group
* 
*/
class Group  extends Vitis{
    
    public $oError;
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function Group ($aPath, $aValues, $properties, $oConnection){
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
        $this->aSelectedFields = Array("group_id", "name", "nb_members", "users");
    }
      /**
     * @SWG\Get(path="/groups/{group_id}", 
     *   tags={"Groups"},
     *   summary="Get Group",
     *   description="Request to get Group by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json"},
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
        $this->getUsers();
    }
    
    /**
     *  get users of group
     */
    function getUsers(){
        require $this->sRessourcesFile;
        if (in_array("users", $this->aSelectedFields)){
                $sSql = str_replace('[sSchemaFramework]', $this->aProperties['schema_framework'], $aSql['getGroupUsers']);
                $sSql = str_replace('[group_id]', $this->aValues['my_vitis_id'], $sSql);
		$oPDOresult =$this->oConnection->oBd->execute ($sSql);
		$sListUserId = "";
		$aListUserLogin = array();
		while($aLigne=$this->oConnection->oBd->ligneSuivante ($oPDOresult)) {
			if ($sListUserId == ""){
				$sListUserId = $aLigne["user_id"];
			}else{
				$sListUserId .= "|".$aLigne["user_id"];
			}
                        $aListUserLogin[] = $aLigne["login"];
		}
		$oPDOresult=$this->oConnection->oBd->fermeResultat();
                $this->aFields['users'] = $sListUserId;
                $this->aFields['users_label'] = implode(',', $aListUserLogin);
        }
    }
    
    /**
     * delete an user
     */
    function DELETE(){
        $this->oConnection->oBd->delete($this->aProperties['schema_framework'], 'v_group', 'group_id', $this->aValues['my_vitis_id'], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new Error(1, $this->oConnection->oBd->getBDMessage());
        } else {
                $this->aFields['group_id'] = $this->aValues['my_vitis_id'];
        }
    }
}
?>
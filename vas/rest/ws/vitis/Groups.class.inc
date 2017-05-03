<?php

/**
* \file Groups.class.inc
* \class Groups
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the Modes php class
*
* This class defines Rest Api to Vitis Groups
* 
*/
require_once 'Vitis.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
require_once 'Group.class.inc';
require_once(__DIR__.'/../../class/vmlib/BdDataAccess.inc');

class Groups extends Vitis {
    
     /**
     * @SWG\Definition(
     *   definition="/groups",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/groups")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Groups",
     *   description="Operations about Groups"
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
        $this->aSelectedFields = Array("group_id", "name", "nb_members", "users");
    }
    
    /**
     * @SWG\Get(path="/groups",
     *   tags={"Groups"},
     *   summary="Get Groups",
     *   description="Request to get Groups",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="group token",
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
     *     type="integer",
     *     format="int32"
     *   ),
     * @SWG\Parameter(
     *     name="offset",
     *     in="query",
     *     description="index of first element",
     *     required=false,
     *     type="string",
     *     format="int32"
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
     *         @SWG\Schema(ref="#/definitions/groups")
     *     )
     *  )
     */
    
    
    
    /**
     * get Groups
     * @return  Groups
     */
    function GET() {
        $aReturn = $this->genericGet( $this->aProperties['schema_framework'], "v_group", "group_id");
        return $aReturn['sMessage'];
    }
    
    /**
     * @SWG\Post(path="/groups",
     *   tags={"Groups"},
     *   summary="Add Group",
     *   description="Request to add group",
     *   operationId="POST",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="formData",
     *     description="group token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="name",
     *     in="formData",
     *     description="Name of the group",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="users",
     *     in="formData",
     *     description="Users of the group",
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
     * insert group
     * @return id of the group created
     */
    function POST() {
        // Importation d'un groupe AD ?
        if (!empty($this->aValues['action'])){
                $sMessage = $this->importLdapGroup();
        }
        else {
				$bSframework = false;
				$sSql = "select nspname from pg_catalog.pg_namespace where nspname = 's_framework';";
				$resultat = $this->oConnection->oBd->execute($sSql);
				if ($resultat->rowCount() > 0) {
					$bSframework = true;
					$aReturnFramework = $this->genericPost("s_framework", 'group', "s_framework".'.seq_common', 'group_id', "framework_admin");
				}
                $aReturn = $this->genericPost($this->aProperties['schema_framework'], 'v_group', $this->aProperties['schema_framework'].'.seq_common', 'group_id');
                if ($aReturn['sStatus'] == 1){
					
                    $aXmlRacineAttribute['status'] = 1;
                    $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    $oGroup = new Group($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
                    $oGroup->GET();
                    // Le paramètre "users" est passé dans la requête ?
                    if ($this->aValues['users'] !== NULL) {
                            // Utilisateurs à rattacher au groupe ?
                            if (!empty($this->aValues['users'])) {
                                require $this->sRessourcesFile;
                                $aUsers = explode('|', $this->aValues['users']);
                                foreach ($aUsers as $iUserId) {
                                        $sSql = str_replace('[user_id]', $iUserId, $aSql['insertGroupUsers']);
                                        $sSql = str_replace('[group_id]', $this->aValues["my_vitis_id"], $sSql);
                                        $sSql = str_replace('[sSchemaFramework]', $this->aProperties['schema_framework'], $sSql);
                                        $resultat = $this->oConnection->oBd->execute($sSql);
										if ($bSframework){
											$sSql = "select login from ".$this->aProperties['schema_framework'].".\"user\" where user_id = $iUserId;";
											$resultat = $this->oConnection->oBd->execute($sSql);
											if ($resultat->rowCount() > 0) {
												while($aLigne=$this->oConnection->oBd->ligneSuivante ($resultat)) {
													$sSql = "INSERT INTO s_framework.user_group (user_id, group_id) VALUES ((select user_id from s_framework.\"user\" where login  = '".$aLigne['login']."'), (select group_id from s_framework.\"group\" where name  = '".$oGroup->aFields['name']."'))";
													 $resultat = $this->oConnection->oBd->execute($sSql);
												}
											}
										}
                                }
                            }
                    }
                }else{
                    $sMessage = $aReturn['sMessage'];
                }
        }
        return $sMessage;
    }
    
    /**
     * @SWG\Put(path="/groups/{group_id}",
     *   tags={"Groups"},
     *   summary="Update Group",
     *   description="Request to update Group",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
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
     *     name="name",
     *     in="query",
     *     description="Name of the group",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="users",
     *     in="query",
     *     description="Users of the group",
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
     * update group
     * @return id of the group if ok error object if ko
     */
    function PUT() {
        $aValues = $this->aValues;
		// Recherche de l'ancien nom de groupe
		$sSql = "SELECT name FROM " . $this->aProperties['schema_framework'] . ".group WHERE group_id = " . $aValues['my_vitis_id'] . ";";
		$resultat = $this->oConnection->oBd->execute($sSql);
		$aLigne=$this->oConnection->oBd->ligneSuivante ($resultat);
		$sOldName = $aLigne['name'];

		$bSframework = false;
		$iFrameworkGroudId = 0;
		$sSql = "select nspname from pg_catalog.pg_namespace where nspname = 's_framework';";
		$resultat = $this->oConnection->oBd->execute($sSql);
		if ($resultat->rowCount() > 0) {
			$bSframework = true;
			$sSql = "select group_id from s_framework.group where name = '" . $sOldName . "';";
			$resultat = $this->oConnection->oBd->execute($sSql);
			if ($resultat->rowCount() > 0) {
				while($aLigne=$this->oConnection->oBd->ligneSuivante ($resultat)) {
					$this->aValues['my_vitis_id'] = $aLigne['group_id'];
					$iFrameworkGroudId = $aLigne['group_id'];
					$this->genericPut("s_framework", 'group', 'group_id');
				}
			}
		}
		$this->aValues = $aValues;
        $aReturn = $this->genericPut($this->aProperties['schema_framework'], 'v_group', 'group_id');
        if ($aReturn['sStatus'] == 1){
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $oGroup = new Group($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
            $oGroup->GET();
            // Supprime les Utilisateurs rattachés au groupe.
            $this->oConnection->oBd->delete($this->aProperties['schema_framework'], 'v_user_group', 'group_id', $this->aValues["my_vitis_id"]);
            $this->oConnection->oBd->delete("s_framework", 'user_group', 'group_id', $iFrameworkGroudId);
            // Le paramètre "users" est passé dans la requête ?
            if ($this->aValues['users'] !== NULL) {
                    // Utilisateurs à rattacher au groupe ?
                    if (!empty($this->aValues['users'])) {
                        require $this->sRessourcesFile;
                        $aUsers = explode('|', $this->aValues['users']);
                        foreach ($aUsers as $iUserId) {
                                $sSql = str_replace('[user_id]', $iUserId, $aSql['insertGroupUsers']);
                                $sSql = str_replace('[group_id]', $this->aValues["my_vitis_id"], $sSql);
                                $sSql = str_replace('[sSchemaFramework]', $this->aProperties['schema_framework'], $sSql);
                                $resultat = $this->oConnection->oBd->execute($sSql);
								if ($bSframework){
									$sSql = "select login from ".$this->aProperties['schema_framework'].".\"user\" where user_id = $iUserId;";
									$resultat = $this->oConnection->oBd->execute($sSql);
									if ($resultat->rowCount() > 0) {
										while($aLigne=$this->oConnection->oBd->ligneSuivante ($resultat)) {
											$sSql = "INSERT INTO s_framework.user_group (user_id, group_id) VALUES ((select user_id from s_framework.\"user\" where login  = '".$aLigne['login']."'), (select group_id from s_framework.\"group\" where name  = '".$oGroup->aFields['name']."'))";
											 $resultat = $this->oConnection->oBd->execute($sSql);
										}
									}
								}
                        }
                    }
            }        
        }else{
            $sMessage = $aReturn['sMessage'];
        }
        return $sMessage;
    }
    
    /**
     * @SWG\Delete(path="/groups/",
     *   tags={"Groups"},
     *   summary="delete Group",
     *   description="Request to delete Group",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="group token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id of the groups",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/groups")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/groups/{group_id}",
     *   tags={"Groups"},
     *   summary="delete Group",
     *   description="Request to delete Group",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
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
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/groups")
     *     )
     *  )
     */
    
    /**
     * delete group
     * @return id of group deleted or error object if a group is not deleted
     */
    function DELETE() {
		$sSql = "select nspname from pg_catalog.pg_namespace where nspname = 's_framework';";
		$resultat = $this->oConnection->oBd->execute($sSql);
		if ($resultat->rowCount() > 0) {
			$sSql = "select name from ".$this->aProperties['schema_framework'].".group where group_id IN";
			if (isset($this->aValues['my_vitis_id'])) {
				$sSql .= "(".$this->aValues['my_vitis_id'].")";
			}else{
				$sSql .= "(".str_replace("|", ",", $this->aValues['idList']).")";
			}
			$resultat = $this->oConnection->oBd->execute($sSql);
			if ($resultat->rowCount() > 0) {
				$sDomaineNames = "";
				while($aLigne=$this->oConnection->oBd->ligneSuivante ($resultat)) {
					if ($sDomaineNames == ""){
						$sDomaineNames = "'".$aLigne['name']."'";
					}else{
						$sDomaineNames .= ",'".$aLigne['name']."'";
					}
				}
				$sSql = "delete from s_framework.group where name in (".$sDomaineNames.")";
				$resultat = $this->oConnection->oBd->execute($sSql);
			}
		}
        $aReturn = $this->genericDelete($this->aProperties['schema_framework'], 'v_group', 'group_id');
        return $aReturn['sMessage'];
    }
    
	/*
	**	Import des groupes de l'A.D.
	*/
	Public function importLdapGroup(){
		require $this->sRessourcesFile;
		$bSframework = false;
		$sSql = "select nspname from pg_catalog.pg_namespace where nspname = 's_framework';";
		$resultat = $this->oConnection->oBd->execute($sSql);
		if ($resultat->rowCount() > 0) {
			$bSframework = true;
		}
		// Le groupe existe déja ?
		$sSql = $aSql['getGroupId'];
		$sSql = str_replace('[sSchemaFramework]', $this->aProperties["schema_framework"], $sSql);
		$sSql = str_replace('[sName]', str_replace("'", "''", $this->aValues['name']), $sSql);
		$resultat = $this->oConnection->oBd->execute ($sSql);
		if ($this->oConnection->oBd->enErreur()) {
			$oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
			$aXmlRacineAttribute['status'] = 0;
			$sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
		} else {
			$oResult = $this->oConnection->oBd->objetSuivant ($resultat);
			if($oResult){
				if ($bSframework) {
					$sSql = "select group_id from s_framework.group where name = '". $this->aValues['name']."';";
					$resultat = $this->oConnection->oBd->execute($sSql);
					if ($resultat->rowCount() > 0) {
						while($aLigne=$this->oConnection->oBd->ligneSuivante ($resultat)) {
							 $this->oConnection->oBd->update("s_framework",'group' , $this->aValues, "group_id", $aLigne["group_id"]);
						}
					}
				}
				$this->oConnection->oBd->update($this->aProperties["schema_framework"],'group' , $this->aValues, "group_id", $oResult->group_id);
				$this->aFields['group_id'] = $oResult->group_id;
			} else {
					if ($bSframework) {
						$this->oConnection->oBd->insert("s_framework",'group' , $this->aValues, "s_framework".'.seq_common', 'group_id');
					}
					$iId = $this->oConnection->oBd->insert($this->aProperties["schema_framework"],'group' , $this->aValues, $this->aProperties['schema_framework'].'.seq_common', 'group_id');
					$this->aFields['group_id'] = $iId;
			}
			//
			if ($this->oConnection->oBd->enErreur()){
					$oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
					$aXmlRacineAttribute['status'] = 0;
					$sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
			} else {
					$aXmlRacineAttribute['status'] = 1;
					$sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
			}
		}
		return $sMessage;
	}
}
?>
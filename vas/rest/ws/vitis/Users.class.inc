<?php

/**
 * \file USers.class.inc
 * \class Users
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the Users php class
 *
 * This class Rest api for users
 * 
 */
require_once 'Vitis.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
require_once 'User.class.inc';
require_once(__DIR__.'/../../class/vmlib/BdDataAccess.inc');

class Users extends Vitis {
    /**
     * @SWG\Definition(
     *   definition="/Users",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/Users")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Users",
     *   description="Operations about Users"
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function Users($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->aSelectedFields = Array("user_id", "login", "email", "name", "company", "department","ip_constraint", "domain", "domain_id", "restriction", "last_connection", "groups", "privileges", "role", "restriction");
    }

    /**
     * @SWG\Get(path="/users",
     *   tags={"Users"},
     *   summary="Get Users",
     *   description="Request to get Users",
     *   operationId="GET",
     *   produces={"application/xml", "application/json",  "application/x-vm-json"},
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
     *  @SWG\Parameter(
     *     name="distinct",
     *     in="query",
     *     description="delete duplicates",
     *     required=false,
     *     type="boolean"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/users")
     *     )
     *  )
     */

    /**
     * get users
     * @return  users
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_framework'], "v_user", "user_id");
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Post(path="/users",
     *   tags={"Users"},
     *   summary="Add User",
     *   description="Request to add user",
     *   operationId="POST",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="login",
     *     in="query",
     *     description="Login of the user",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="action",
     *     in="query",
     *     description=action",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="name",
     *     in="query",
     *     description="Name of the user",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="email",
     *     in="query",
     *     description="Email of the user",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="company",
     *     in="query",
     *     description="Company of the user",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="departement",
     *     in="query",
     *     description="Departement of the user",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="groups",
     *     in="query",
     *     description="Groups of the user",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="privileges",
     *     in="query",
     *     description="Privileges of the user",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="ip_constraint",
     *     in="query",
     *     description="Workstation IP address",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="password",
     *     in="query",
     *     description="Password of the user",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/users")
     *     )
     *  )
     *)
     */
    
   

    /**
     * insert user
     * @return id of the user created
     */
    function POST() {
        //verify the connection
        if ($this->oConnection->oError != null) {
            $oError = $this->oConnection->oError;
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            // Importation d'un utilisateur AD ?
            if (!empty($this->aValues['action'])){
                $sMessage = $this->importLdapUser();
            }
            // verify if the user is vitis_admin
            else if (in_array("vitis_admin", $this->oConnection->aPrivileges)) {
                // Changement de mot de passe ?
                    require_once $this->sRessourcesFile;
                    $this->aValues["login"] = mb_strtolower($this->aValues["login"], 'UTF-8');
                    $this->aValues["login"] = str_replace(array('à', 'â', 'ä', 'á', 'ã', 'å', 'î', 'ï', 'ì', 'í', 'ô', 'ö', 'ò', 'ó', 'õ', 'ø', 'ù', 'û', 'ü', 'ú', 'é', 'è', 'ê', 'ë', 'ç', 'ÿ', 'ñ'), array('a', 'a', 'a', 'a', 'a', 'a', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'e', 'e', 'e', 'e', 'c', 'y', 'n',), $this->aValues["login"]);
                    $sSql = str_replace('[sSchemaFramework]', $this->aProperties["schema_framework"], $aSql['loginUnique']);
                    $sSql = str_replace('[sLoginUser]', $this->aValues["login"], $sSql);
                    $resultat = $this->oConnection->oBd->execute($sSql);
                    if ($this->oConnection->oBd->nombreLigne($resultat) > 0) {
                        $oError = new Error(1, "user already exists");
                        $aXmlRacineAttribute['status'] = 0;
                        $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    } else {
                        // create postgres user if not exists
                        $oSgbdDataAccess = new PgsqlDataAccess($this->oConnection->oBd, $this->aProperties["database"], $this->aProperties["server"], "vitis_user", "vitis_admin", $this->aProperties["schema_framework"]);
                        $sErrorMessage = $oSgbdDataAccess->createSgbdUser($this->aValues["login"], $this->aValues["password"]);
                        if ($sErrorMessage != "") {
                            $oError = new Error(1, $sErrorMessage);
                            $aXmlRacineAttribute['status'] = 0;
                            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                        } else {
                            // insert user in table
                            $iId = $this->oConnection->oBd->insert($this->aProperties['schema_framework'], 'v_user', $this->aValues, $this->aProperties['schema_framework'].'.seq_common', 'user_id');
                            if ($this->oConnection->oBd->enErreur()) {
                                $oError = new Error(1, $this->oConnection->oBd->getBDMessage());
                                $aXmlRacineAttribute['status'] = 0;
                                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
								//insert into s_framework if exist
								
                            } else {
								$bSframework = false;
								$sSql = "select nspname from pg_catalog.pg_namespace where nspname = 's_framework';";
								$resultat = $this->oConnection->oBd->execute($sSql);
								if ($resultat->rowCount() > 0) {
									$bSframework = true;
									$iId2 = $this->oConnection->oBd->insert("s_framework", 'v_user', $this->aValues, $this->aProperties['schema_framework'].'.seq_common', 'user_id');
								}
                                $this->aFields["user_id"] = $iId;
                                $aXmlRacineAttribute['status'] = 1;
                                $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                            
                                // Attribution des privilèges.
								if ($this->aValues['privileges'] == NULL) {
									$this->aValues['privileges'] = 'vitis_user';
								}
								if ($bSframework){
									if (strrpos($this->aValues['privileges'], "vitis_user") != false){
										$this->aValues['privileges'] .= "|framework_user";
									}
									if (strrpos($this->aValues['privileges'], "vitis_admin") != false){
										$this->aValues['privileges'] .= "|framework_admin";
									}
									if (strrpos($this->aValues['privileges'], "vmap_user") != false){
										$this->aValues['privileges'] .= "|veremap_user";
									}
									if (strrpos($this->aValues['privileges'], "vmap_admin") != false){
										$this->aValues['privileges'] .= "|veremap_admin";
									}
								}
                                $sMessage = $this->setPrivileges($iId, $bSframework);
                            }
                        }
                    }
            } else {
                $oError = new Error(1, "Rights problem : you don't have right to insert users");
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            }
        }
        return $sMessage;
    }

    /**
     * @SWG\Put(path="/users/{user_id}",
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
     * @SWG\Parameter(
     *     name="login",
     *     in="query",
     *     description="login of the user",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="name",
     *     in="query",
     *     description="Name of the user",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="email",
     *     in="query",
     *     description="Email of the user",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="company",
     *     in="query",
     *     description="Company of the user",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="departement",
     *     in="query",
     *     description="Departement of the user",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="groups",
     *     in="query",
     *     description="Groups of the user",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="privileges",
     *     in="query",
     *     description="Privileges of the user",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="ip_constraint",
     *     in="query",
     *     description="Workstation IP address",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="password",
     *     in="query",
     *     description="Password of the user",
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
     * update user
     * @return id of the user if ok error object if ko
     */
    function PUT() {
		
        $sLogin = mb_strtolower($this->aValues["login"], 'UTF-8');
        $sLogin = str_replace(array('à', 'â', 'ä', 'á', 'ã', 'å', 'î', 'ï', 'ì', 'í', 'ô', 'ö', 'ò', 'ó', 'õ', 'ø', 'ù', 'û', 'ü', 'ú', 'é', 'è', 'ê', 'ë', 'ç', 'ÿ', 'ñ'), array('a', 'a', 'a', 'a', 'a', 'a', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'e', 'e', 'e', 'e', 'c', 'y', 'n',), $sLogin);
        unset($this->aValues['login']);
        $aReturn = $this->genericPut($this->aProperties['schema_framework'], 'v_user', 'user_id');
        $aXmlRacineAttribute['status'] = $aReturn['sStatus'];
        $sMessage = $aReturn['sMessage'];
        if ($aReturn['sStatus'] == 1 && !empty($this->aValues['password'])) {
            // update password if sent
            $oSgbdDataAccess = new PgsqlDataAccess($this->oConnection->oBd, $this->aProperties["database"], $this->aProperties["server"], "vitis_user", "vitis_admin", $this->aProperties["schema_framework"]);
            $sErrorMessage = $oSgbdDataAccess->updateUserPassword($sLogin, $this->aValues["password"]);
            if ($sErrorMessage != "") {
                $oError = new Error(1, $sErrorMessage);
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);     
                return $sMessage;
            }
        }
		$sSql = "select nspname from pg_catalog.pg_namespace where nspname = 's_framework';";
		$resultat = $this->oConnection->oBd->execute($sSql);
		$bIsFrameWork = false;
		if ($resultat->rowCount() > 0) {
			$bIsFrameWork = true;
			$old_id = $this->aValues['my_vitis_id'];
			$sSql = "select user_id from s_framework.\"user\" where login = '". $sLogin ."';";
			$resultat = $this->oConnection->oBd->execute($sSql);
			if ($resultat->rowCount() > 0) {
				while($aLigne=$this->oConnection->oBd->ligneSuivante ($resultat)) {
					$this->aValues['my_vitis_id'] = $aLigne['user_id'];
					$this->genericPut("s_framework", 'v_user', 'user_id');
				}
			}
			$this->aValues['my_vitis_id'] = $old_id;
		}
        // Attribution des privilèges.
        $sMessage = $this->setPrivileges($this->aValues['my_vitis_id'], $bIsFrameWork);
        
        return $sMessage;
    }
    
    /**
     *  Set privileges of user.
     */
    function setPrivileges ($iUserId, $bSframework) {
            require $this->sRessourcesFile;
            // Le paramètre "groups" est passé dans la requête ?
			if (!empty($this->aValues['groups'])) {
                    // Suppression des groupes rattachés à l'utilisateur.
                        $sSql = str_replace('[user_id]', $iUserId, $aSql['deleteUserGroups']);
                        $sSql = str_replace('[sSchemaFramework]', $this->aProperties['schema_framework'], $sSql);
                        $resultat = $this->oConnection->oBd->execute($sSql);
                        if ($this->oConnection->oBd->enErreur()) {
                            $oError = new Error(1, $this->oConnection->oBd->getBDMessage());
                            $aXmlRacineAttribute['status'] = 0;
                            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                            return $sMessage;
                        }else{
							if ($bSframework){
								
								$sSql = "select login from ".$this->aProperties['schema_framework'].".\"user\" where user_id = '".$iUserId."';";
								$resultat = $this->oConnection->oBd->execute($sSql);
								if ($resultat->rowCount() > 0) {
									while($aLigne=$this->oConnection->oBd->ligneSuivante ($resultat)) {
										$sSql = "select user_id from s_framework.\"user\" where login = '".$aLigne["login"]."';";
										$resultat2 = $this->oConnection->oBd->execute($sSql);
										if ($resultat2->rowCount() > 0) {
											while($aLigne2=$this->oConnection->oBd->ligneSuivante ($resultat2)) {
												$this->oConnection->oBd->delete("s_framework", 'user_group', 'user_id', $aLigne2["user_id"]);
											}
										}
									}
								}
							}
							}
						}

                    // Groupes à rattacher à l'utilisateur ?
                    if (!empty($this->aValues['groups'])) {
						$sSql = "select login from ".$this->aProperties['schema_framework'].".\"user\" where user_id = $iUserId;";
						$resultat = $this->oConnection->oBd->execute($sSql);
						if ($resultat->rowCount() > 0) {
							while($aLigne=$this->oConnection->oBd->ligneSuivante ($resultat)) {
								$sLogin = $aLigne['login'];
							}
						}
                        $aGroups = explode('|', $this->aValues['groups']);
                        foreach ($aGroups as $iGroupId) {
                                $sSql = str_replace('[group_id]', $iGroupId, $aSql['insertUserGroups']);
                                $sSql = str_replace('[user_id]', $iUserId, $sSql);
                                $sSql = str_replace('[sSchemaFramework]', $this->aProperties['schema_framework'], $sSql);
                                $resultat = $this->oConnection->oBd->execute($sSql);
                                if ($this->oConnection->oBd->enErreur()) {
                                    $oError = new Error(1, $this->oConnection->oBd->getBDMessage());
                                    $aXmlRacineAttribute['status'] = 0;
                                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                                    return $sMessage;
                                }else{
									if ($bSframework){
										$sSql = "select name from ".$this->aProperties['schema_framework'].".\"group\" where group_id = $iGroupId;";
										$resultat = $this->oConnection->oBd->execute($sSql);
										if ($resultat->rowCount() > 0) {
											while($aLigne=$this->oConnection->oBd->ligneSuivante ($resultat)) {
												$sSql = "INSERT INTO s_framework.user_group (user_id, group_id) VALUES ((select user_id from s_framework.\"user\" where login  = '".$sLogin."'), (select group_id from s_framework.\"group\" where name  = '".$aLigne['name']."'))";
												 $resultat = $this->oConnection->oBd->execute($sSql);
											}
										}
									}
								}
                        }
                    }
            
            // Le paramètre "privileges" est passé dans la requête ?
            if (!empty($this->aValues['privileges'])) {
                    // Récupère le login de l'utilisateur.
                    $this->aValues['my_vitis_id'] = $iUserId;
                    $oUser = new User($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
                    $oUser->GET();

                    // Si login = l'utilisateur -> interdiction de supprimer les privilèges 'vitis_admin' et 'vitis_user'.
                        if ($oUser->aFields['login'] == $_SESSION['ses_Login'])
                                $sExcludePrivileges = "'vitis_admin','vitis_user'";
                        else
                                $sExcludePrivileges = "''";

                    // Supprime tous les privilèges de l'utilisateur.
                        $sSql = $aSql['userPrivileges'];
                        $sSql = str_replace('[login]', $oUser->aFields['login'], $sSql);
                        $sSql = str_replace('[sSchemaFramework]',$this->aProperties["schema_framework"] , $sSql);
                        $sSql = str_replace('[sExcludePrivileges]', $sExcludePrivileges , $sSql);
                        $resultat = $this->oConnection->oBd->execute($sSql);
                        if ($this->oConnection->oBd->enErreur()) {
                            $oError = new Error(1, $this->oConnection->oBd->getBDMessage());
                            $aXmlRacineAttribute['status'] = 0;
                            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                            return $sMessage;
                        }
                        else {
                                if ($resultat->rowCount() > 0) {
                                        $aResult = $this->oConnection->oBd->getResultTableAssoc($resultat);
                                        foreach ($aResult as $aRow) {
                                                $sSql = $aSql['revokePrivilege'];
                                                $sSql = str_replace('[sValue]', $oUser->aFields['login'], $sSql);
                                                $sSql = str_replace('[sId]', $aRow['groname'], $sSql);
                                                $this->oConnection->oBd->execute($sSql);
                                                if ($this->oConnection->oBd->enErreur()) {
                                                    $oError = new Error(1, $this->oConnection->oBd->getBDMessage());
                                                    $aXmlRacineAttribute['status'] = 0;
                                                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                                                    return $sMessage;
                                                }else{
														if ($bSframework){
															if ($aRow['groname'] == 'vitis_user'){
																$sSql = 'REVOKE "framework_user" FROM "'.$oUser->aFields['login'].'"';
																 $this->oConnection->oBd->execute($sSql);
															}
															if ($aRow['groname'] == 'vitis_admin'){
																$sSql = 'REVOKE "framework_admin" FROM "'.$oUser->aFields['login'].'"';
																 $this->oConnection->oBd->execute($sSql);
															}
															if ($aRow['groname'] == 'vmap_admin'){
																$sSql = 'REVOKE "veremap_admin" FROM "'.$oUser->aFields['login'].'"';
																 $this->oConnection->oBd->execute($sSql);
															}
															if ($aRow['groname'] == 'vmap_user'){
																$sSql = 'REVOKE "veremap_user" FROM "'.$oUser->aFields['login'].'"';
																 $this->oConnection->oBd->execute($sSql);
															}
														}
												}
                                        }
                                }
                        }

                    // Privilèges à rattacher à l'utilisateur ?
                    if (!empty($this->aValues['privileges'])) {
                        $aPrivileges = explode('|', $this->aValues['privileges']);
                        foreach ($aPrivileges as $sPrivilegeId) {
                                $sSql = str_replace('[sValue]', $oUser->aFields['login'], $aSql['grantPrivilege']);
                                $sSql = str_replace('[sId]', $sPrivilegeId, $sSql);
                                $resultat = $this->oConnection->oBd->execute($sSql);
                                if ($this->oConnection->oBd->enErreur()) {
                                    $oError = new Error(1, $this->oConnection->oBd->getBDMessage());
                                    $aXmlRacineAttribute['status'] = 0;
                                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                                    return $sMessage;
                                } else{
									if ($bSframework){
										if ($sPrivilegeId == 'vitis_user'){
											$sSql = 'GRANT "framework_user" TO "'.$oUser->aFields['login'].'"';
											 $this->oConnection->oBd->execute($sSql);
										}
										if ($sPrivilegeId == 'vitis_admin'){
											$sSql = 'GRANT "framework_admin" TO "'.$oUser->aFields['login'].'"';
											 $this->oConnection->oBd->execute($sSql);
										}
										if ($sPrivilegeId == 'vmap_admin'){
											$sSql = 'GRANT "veremap_admin" TO "'.$oUser->aFields['login'].'"';
											 $this->oConnection->oBd->execute($sSql);
										}
										if ($sPrivilegeId == 'vmap_user'){
											$sSql = 'GRANT "veremap_user" TO "'.$oUser->aFields['login'].'"';
											 $this->oConnection->oBd->execute($sSql);
										}
									}
								}
                        }
                    }

                // L'utilisateur est administrateur ?
                if (!empty($this->aValues['login']) && $this->aValues['login'] != $_SESSION['ses_Login']) {
                        // L'utilisateur est administrateur ?
                        if (in_array('vitis_admin', $aPrivileges))
                                $sSql = $aSql['userCreateRole'];
                        else
                                $sSql = $aSql['userNoCreateRole'];
                        $sSql = str_replace('[login]', $oUser->aFields['login'], $sSql);
                        $resultat = $this->oConnection->oBd->execute($sSql);
                        if ($this->oConnection->oBd->enErreur()) {
                            $oError = new Error(1, $this->oConnection->oBd->getBDMessage());
                            $aXmlRacineAttribute['status'] = 0;
                            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                            return $sMessage;
                        }
                }
            }
        //
        $aXmlRacineAttribute['status'] = 1;
        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        return $sMessage;
    }            

    /**
     * @SWG\Delete(path="/users/",
     *   tags={"Users"},
     *   summary="delete User",
     *   description="Request to delete User",
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
     *     name="idList",
     *     in="query",
     *     description="id of the users",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/users")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/users/{user_id}",
     *   tags={"Users"},
     *   summary="delete User",
     *   description="Request to delete User",
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
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/users")
     *     )
     *  )
     */

    /**
     * delete user
     * @return id of user deleted or error object if an user is not deleted
     */
    function DELETE() {
		$sSql = "select nspname from pg_catalog.pg_namespace where nspname = 's_framework';";
		$resultat = $this->oConnection->oBd->execute($sSql);
		if ($resultat->rowCount() > 0) {
			$sSql = "select login from ".$this->aProperties['schema_framework'].".\"user\" where user_id IN";
			if (isset($this->aValues['my_vitis_id'])) {
				$sSql .= "(".$this->aValues['my_vitis_id'].")";
			}else{
				$sSql .= "(".str_replace("|", ",", $this->aValues['idList']).")";
			}
			$resultat = $this->oConnection->oBd->execute($sSql);
			if ($resultat->rowCount() > 0) {
				$sUserLogins = "";
				while($aLigne=$this->oConnection->oBd->ligneSuivante ($resultat)) {
					if ($sUserLogins == ""){
						$sUserLogins = "'".$aLigne['login']."'";
					}else{
						$sUserLogins .= ",'".$aLigne['login']."'";
					}
				}
				$sSql = "delete from s_framework.\"user\" where login in (".$sUserLogins.")";
				$resultat = $this->oConnection->oBd->execute($sSql);
			}
		}
        $aReturn = $this->genericDelete($this->aProperties['schema_framework'], 'v_user', 'user_id');

        return $aReturn['sMessage'];
    }
    
	/**
	 * Import des utilisateurs de l'A.D.
	 */
	function importLdapUser() {
		$oSgbdDataAccess = new PgsqlDataAccess($this->oConnection->oBd, $this->aProperties["database"], $this->aProperties["server"], "vitis_user", "vitis_admin", $this->aProperties["schema_framework"]);
		$this->aValues["login"] = mb_strtolower($this->aValues["login"], 'UTF-8');
		$this->aValues["login"] = str_replace(array('à', 'â', 'ä', 'á', 'ã', 'å','î', 'ï', 'ì', 'í', 'ô', 'ö', 'ò', 'ó', 'õ', 'ø', 'ù', 'û', 'ü', 'ú', 'é', 'è', 'ê', 'ë', 'ç', 'ÿ', 'ñ'), array('a', 'a', 'a', 'a', 'a', 'a', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o',  'u', 'u', 'u', 'u', 'e', 'e', 'e', 'e', 'c', 'y', 'n', ),$this->aValues["login"]);
		$sErrorMessage = $oSgbdDataAccess->createSgbdUserNoPassword($this->aValues["login"]);
		if ($sErrorMessage!=""){
                    $oError = new Error(1, $this->oConnection->oBd->getBDMessage());
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
		}else{
			$bSframework = false;
			$sSql = "select nspname from pg_catalog.pg_namespace where nspname = 's_framework';";
			$resultat = $this->oConnection->oBd->execute($sSql);
			if ($resultat->rowCount() > 0) {
				$bSframework = true;
			}
			require $this->sRessourcesFile;
			$sSql = $aSql['grantUser'];
			$sSql = str_replace('[sLdapName]', 'vitis_' . $this->aValues['ldap_name'], $sSql);
			$sSql = str_replace('[sLogin]', $this->aValues['login'], $sSql);
			$resultat = $this->oConnection->oBd->execute ($sSql);
                        if ($this->oConnection->oBd->enErreur()) {
                            $oError = new Error(1, $this->oConnection->oBd->getBDMessage());
                            $aXmlRacineAttribute['status'] = 0;
                            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                        }
                        else {
                                $sSql = $aSql['getLogin'];
                                $sSql = str_replace('[sSchemaName]', $this->aProperties["schema_framework"], $sSql);
                                $sSql = str_replace('[sName]', 'user', $sSql);
                                $sSql = str_replace('[sLogin]', $this->aValues['login'], $sSql);
                                $resultat = $this->oConnection->oBd->execute ($sSql);
                                $oResult = $this->oConnection->oBd->objetSuivant ($resultat);
                                if ($this->oConnection->oBd->enErreur()) {
                                    $oError = new Error(1, $this->oConnection->oBd->getBDMessage());
                                    $aXmlRacineAttribute['status'] = 0;
                                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                                }
                                else {
                                        // Création ou maj de l'utilisateur
                                        if($oResult){
												if ($bSframework) {
													$sSql = "select user_id from s_framework.\"user\" where login = '". $this->aValues['login']."';";
													$resultat = $this->oConnection->oBd->execute($sSql);
													if ($resultat->rowCount() > 0) {
														while($aLigne=$this->oConnection->oBd->ligneSuivante ($resultat)) {
															 $this->oConnection->oBd->update("s_framework",'user' , $this->aValues, "user_id", $aLigne["user_id"]);
														}
													}
												}
                                                $this->oConnection->oBd->update($this->aProperties["schema_framework"],'user' ,$this->aValues, "user_id", $oResult->user_id);
                                                $this->aFields['user_id'] = $oResult->user_id;
                                        }
                                        else{
												if ($bSframework) {
													$this->oConnection->oBd->insert("s_framework",'user' , $this->aValues, "s_framework".'.seq_common', 'user_id');
												}
                                                $iId = $this->oConnection->oBd->insert($this->aProperties["schema_framework"],'user' ,$this->aValues, $this->aProperties['schema_framework'].'.seq_common', 'user_id');
                                                $this->aFields['user_id'] = $iId;
                                        }
                                        //
                                        if ($this->oConnection->oBd->enErreur()){
                                                $oError = new Error(1, $this->oConnection->oBd->getBDMessage());
                                                $aXmlRacineAttribute['status'] = 0;
                                                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                                        }
                                        else {
                                                $aXmlRacineAttribute['status'] = 1;
                                                $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                                        }
                                }
                        }
		}
                return $sMessage;
	}
}

?>
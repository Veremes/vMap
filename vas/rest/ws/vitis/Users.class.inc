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
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once 'User.class.inc';
require_once(__DIR__ . '/../../class/vmlib/BdDataAccess.inc');

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
     * @param type $bShortcut false to reinit variables
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        parent::__construct($aPath, $aValues, $properties, $bShortcut, $oConnection);
        $this->aSelectedFields = Array("user_id", "login", "email", "name", "company", "department", "ip_constraint", "domain", "domain_id", "restriction", "last_connection", "groups", "privileges", "role", "restriction", "name || ' (' || login || ')' as user_string");
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
     *     in="formData",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="login",
     *     in="formData",
     *     description="Login of the user",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="action",
     *     in="formData",
     *     description="action",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="name",
     *     in="formData",
     *     description="Name of the user",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="email",
     *     in="formData",
     *     description="Email of the user",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="company",
     *     in="formData",
     *     description="Company of the user",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="department",
     *     in="formData",
     *     description="Departement of the user",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="groups",
     *     in="formData",
     *     description="Groups of the user",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="privileges",
     *     in="formData",
     *     description="Privileges of the user",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="ip_constraint",
     *     in="formData",
     *     description="Workstation IP address",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="password",
     *     in="formData",
     *     description="Password of the user",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="password_confirm",
     *     in="formData",
     *     description="Password confirmation of the user",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="restriction",
     *     in="formData",
     *     description="Password confirmation of the user",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/users")
     *     )
     *  )
     * )
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
            if (!empty($this->aValues['action'])) {
                $sMessage = $this->importLdapUser();
            }
            // verify if the user is vitis_admin
            else if (in_array("vitis_admin", $this->oConnection->aPrivileges)) {
                // Changement de mot de passe ?
                require_once $this->sRessourcesFile;
                $this->aValues["login"] = mb_strtolower($this->aValues["login"], 'UTF-8');
                $this->aValues["login"] = str_replace(array('à', 'â', 'ä', 'á', 'ã', 'å', 'î', 'ï', 'ì', 'í', 'ô', 'ö', 'ò', 'ó', 'õ', 'ø', 'ù', 'û', 'ü', 'ú', 'é', 'è', 'ê', 'ë', 'ç', 'ÿ', 'ñ'), array('a', 'a', 'a', 'a', 'a', 'a', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'e', 'e', 'e', 'e', 'c', 'y', 'n',), $this->aValues["login"]);
                $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
                $aParams['sLoginUser'] = array('value' => $this->aValues["login"], 'type' => 'string');
                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['loginUnique'], $aParams);
                if ($this->oConnection->oBd->nombreLigne($oPDOresult) > 0) {
                    $oError = new VitisError(1, "user already exists");
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                } else {
                    // create postgres user if not exists
                    $oSgbdDataAccess = new PgsqlDataAccess($this->oConnection->oBd, $this->aProperties["database"], $this->aProperties["server"], "vitis_user", "vitis_admin", $this->aProperties["schema_framework"]);
                    $sErrorMessage = $oSgbdDataAccess->createSgbdUser($this->aValues["login"], $this->aValues["password"]);
                    if ($sErrorMessage != "") {
                        $oError = new VitisError(1, $sErrorMessage);
                        $aXmlRacineAttribute['status'] = 0;
                        $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    } else {
                        // insert user in table
                        $iId = $this->oConnection->oBd->insert($this->aProperties['schema_framework'], 'v_user', $this->aValues, $this->aProperties['schema_framework'] . '.seq_common', 'user_id');
                        if ($this->oConnection->oBd->enErreur()) {
                            $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                            $aXmlRacineAttribute['status'] = 0;
                            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                        } else {
                            $this->aFields["user_id"] = $iId;
                            $aXmlRacineAttribute['status'] = 1;
                            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);

                            // Attribution des privilèges.
                            if ($this->aValues['privileges'] == NULL) {
                                $this->aValues['privileges'] = 'vitis_user';
                            }

                            $sMessage = $this->setPrivileges($iId);
                        }
                    }
                }
            } else {
                $oError = new VitisError(1, "Rights problem : you don't have right to insert users");
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
     *     required=true,
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
     *     name="department",
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
     *  @SWG\Parameter(
     *     name="password_confirm",
     *     in="query",
     *     description="Password confirmation of the user",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="restriction",
     *     in="query",
     *     description="Password confirmation of the user",
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
        if ($this->aValues['login'] == $_SESSION['ses_Login'] || in_array("vitis_admin", $this->oConnection->aPrivileges)) {
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
                    $oError = new VitisError(1, $sErrorMessage);
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    return $sMessage;
                }
            }
            // Attribution des privilèges.
            if (in_array("vitis_admin", $this->oConnection->aPrivileges)) {
                $sMessage = $this->setPrivileges($this->aValues['my_vitis_id'], $bIsFrameWork);
            }
        } else {
            http_response_code(403);
            $aXmlRacineAttribute['status'] = 0;
            $this->aFields['error'] = "ERROR : invalid token";
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }

        return $sMessage;
    }

    /**
     *  Set privileges of user.
     */
    function setPrivileges($iUserId) {
        require $this->sRessourcesFile;

        // Le paramètre "groups" est passé dans la requête ?
        if (isset($this->aValues['groups'])) {
            // Suppression des groupes rattachés à l'utilisateur.
            $aParams = array();
            $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
            $aParams['user_id'] = array('value' => $iUserId, 'type' => 'number');
            $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['deleteUserGroups'], $aParams);
            if ($this->oConnection->oBd->enErreur()) {
                $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                return $sMessage;
            }
        }

        // Groupes à rattacher à l'utilisateur ?
        if (!empty($this->aValues['groups'])) {
            $sSql = "select login from " . $this->aProperties['schema_framework'] . ".\"user\" where user_id = [user_id];";
            $aParams = array();
            $aParams['user_id'] = array('value' => $iUserId, 'type' => 'number');
            $oPDOresult = $this->oConnection->oBd->executeWithParams($sSql, $aParams);
            if ($oPDOresult->rowCount() > 0) {
                while ($aLigne = $this->oConnection->oBd->ligneSuivante($oPDOresult)) {
                    $sLogin = $aLigne['login'];
                }
            }
            $aGroups = explode('|', $this->aValues['groups']);
            foreach ($aGroups as $iGroupId) {
                $aParams = array();
                $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
                $aParams['user_id'] = array('value' => $iUserId, 'type' => 'number');
                $aParams['group_id'] = array('value' => $iGroupId, 'type' => 'number');
                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['insertUserGroups'], $aParams);
                if ($this->oConnection->oBd->enErreur()) {
                    $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    return $sMessage;
                }
            }
        }

        // Le paramètre "privileges" est passé dans la requête ?
        if (isset($this->aValues['privileges'])) {
            // Récupère le login de l'utilisateur.
            $this->aValues['my_vitis_id'] = $iUserId;
            $oUser = new User($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
            $oUser->GET();

            // Si login = l'utilisateur -> interdiction de supprimer les privilèges 'vitis_admin' et 'vitis_user'.
            if ($oUser->aFields['login'] == $_SESSION['ses_Login'])
                $sExcludePrivileges = "vitis_admin|vitis_user";
            else
                $sExcludePrivileges = "";
            // Supprime tous les privilèges de l'utilisateur.
            $aParams = array();
            $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
            $aParams['login'] = array('value' => $oUser->aFields['login'], 'type' => 'string');
            $aParams['sExcludePrivileges'] = array('value' => $sExcludePrivileges, 'type' => 'group');
            $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['userPrivileges'], $aParams);
            if ($this->oConnection->oBd->enErreur()) {
                $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                return $sMessage;
            } else {
                if ($oPDOresult->rowCount() > 0) {
                    $aResult = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);
                    foreach ($aResult as $aRow) {
                        $aParams = array();
                        $aParams['sValue'] = array('value' => $oUser->aFields['login'], 'type' => 'double_quote');
                        $aParams['sId'] = array('value' => $aRow['groname'], 'type' => 'double_quote');
                        $this->oConnection->oBd->executeWithParams($aSql['revokePrivilege'], $aParams);
                        if ($this->oConnection->oBd->enErreur()) {
                            $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                            $aXmlRacineAttribute['status'] = 0;
                            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                            return $sMessage;
                        }
                    }
                }
            }
        }
        if (!empty($this->aValues['privileges'])) {
            // Privilèges à rattacher à l'utilisateur ?
            if (!empty($this->aValues['privileges'])) {
                $aPrivileges = explode('|', $this->aValues['privileges']);
                foreach ($aPrivileges as $sPrivilegeId) {
                    $aParams = array();
                    $aParams['sValue'] = array('value' => $oUser->aFields['login'], 'type' => 'double_quote');
                    $aParams['sId'] = array('value' => $sPrivilegeId, 'type' => 'double_quote');
                    $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['grantPrivilege'], $aParams);
                    if ($this->oConnection->oBd->enErreur()) {
                        $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                        $aXmlRacineAttribute['status'] = 0;
                        $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                        return $sMessage;
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
                $aParams = array();
                $aParams['login'] = array('value' => $oUser->aFields['login'], 'type' => 'double_quote');
                $oPDOresult = $this->oConnection->oBd->executeWithParams($sSql, $aParams);
                if ($this->oConnection->oBd->enErreur()) {
                    $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
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
     *   operationId="DELETE",
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
     *     in="path",
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
     *   operationId="DELETE",
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
        if ($this->oConnection->oError == null && in_array("vitis_admin", $this->oConnection->aPrivileges)) {
            $aReturn = $this->genericDelete($this->aProperties['schema_framework'], 'v_user', 'user_id');
        } else {
            $oError = new Error(1, "Invalid token");
            $aXmlRacineAttribute['status'] = 0;
            $aReturn['sMessage'] = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }

        return $aReturn['sMessage'];
    }

    /**
     * Import des utilisateurs de l'A.D.
     */
    function importLdapUser() {
        $oSgbdDataAccess = new PgsqlDataAccess($this->oConnection->oBd, $this->aProperties["database"], $this->aProperties["server"], "vitis_user", "vitis_admin", $this->aProperties["schema_framework"]);
        $this->aValues["login"] = mb_strtolower($this->aValues["login"], 'UTF-8');
        $this->aValues["login"] = str_replace(array('à', 'â', 'ä', 'á', 'ã', 'å', 'î', 'ï', 'ì', 'í', 'ô', 'ö', 'ò', 'ó', 'õ', 'ø', 'ù', 'û', 'ü', 'ú', 'é', 'è', 'ê', 'ë', 'ç', 'ÿ', 'ñ'), array('a', 'a', 'a', 'a', 'a', 'a', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'e', 'e', 'e', 'e', 'c', 'y', 'n',), $this->aValues["login"]);
        $sErrorMessage = $oSgbdDataAccess->createSgbdUserNoPassword($this->aValues["login"]);
        if ($sErrorMessage != "") {
            $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            require $this->sRessourcesFile;
            $aParams = array();
            $aParams['sLdapName'] = array('value' => 'vitis_' . $this->aValues['ldap_name'], 'type' => 'double_quote');
            $aParams['sLogin'] = array('value' => $this->aValues['login'], 'type' => 'double_quote');
            $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['grantUser'], $aParams);
            if ($this->oConnection->oBd->enErreur()) {
                $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            } else {
                $aParams = array();
                $aParams['sSchemaName'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
                $aParams['sName'] = array('value' => 'user', 'type' => 'column_name');
                $aParams['sLogin'] = array('value' => $this->aValues['login'], 'type' => 'string');
                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getLogin'], $aParams);
                $oResult = $this->oConnection->oBd->objetSuivant($oPDOresult);
                if ($this->oConnection->oBd->enErreur()) {
                    $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                } else {
                    // Création ou maj de l'utilisateur
                    if ($oResult) {
                        $this->oConnection->oBd->update($this->aProperties["schema_framework"], 'user', $this->aValues, "user_id", $oResult->user_id);
                        $this->aFields['user_id'] = $oResult->user_id;
                    } else {
                        $iId = $this->oConnection->oBd->insert($this->aProperties["schema_framework"], 'user', $this->aValues, $this->aProperties['schema_framework'] . '.seq_common', 'user_id');
                        $this->aFields['user_id'] = $iId;
                    }
                    //
                    if ($this->oConnection->oBd->enErreur()) {
                        $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                        $aXmlRacineAttribute['status'] = 0;
                        $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    } else {
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
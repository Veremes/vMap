<?php

require_once 'Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file User.class.inc
 * \class User
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the User php class
 *
 * This class defines operation for one user
 * 
 */
class User extends Vitis {

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
        $this->aSelectedFields = Array("user_id", "login", "email", "name", "company", "department", "ip_constraint", "domain", "domain_id", "restriction", "last_connection", "groups", "privileges", "role", "restriction", "name || ' (' || login || ')' as user_string");
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
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_framework'], "v_user", "user_id");
        $this->getGroups();
        $this->getPrivileges();
    }

    /**
     *  get groups of user
     */
    function getGroups() {
        require $this->sRessourcesFile;
        if (in_array("groups", $this->aSelectedFields)) {
            $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
            $aParams['user_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'number');
            $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getGroups'], $aParams);
            $sListGroupId = "";
            $aListGroupName = array();
            while ($aLigne = $this->oConnection->oBd->ligneSuivante($oPDOresult)) {
                if ($sListGroupId == "") {
                    $sListGroupId = $aLigne["group_id"];
                } else {
                    $sListGroupId .= "|" . $aLigne["group_id"];
                }
                $aListGroupName[] = $aLigne["name"];
            }
            $oPDOresult = $this->oConnection->oBd->fermeResultat();
            $this->aFields['groups'] = $sListGroupId;
            $this->aFields['groups_label'] = implode(',', $aListGroupName);
        }
    }

    /**
     * get privileges of the user
     */
    function getPrivileges() {
        require $this->sRessourcesFile;
        if (in_array("privileges", $this->aSelectedFields)) {
            $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
            $aParams['user_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'number');
            $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getUserPrivileges'], $aParams);
            $sListPrivileges = "";
            while ($aLigne = $this->oConnection->oBd->ligneSuivante($oPDOresult)) {
                if ($sListPrivileges == "") {
                    $sListPrivileges = $aLigne["groname"];
                } else {
                    $sListPrivileges .= "|" . $aLigne["groname"];
                }
            }
            $oPDOresult = $this->oConnection->oBd->fermeResultat();
            $this->aFields['privileges'] = $sListPrivileges;
            $this->aFields['privileges_label'] = str_replace('|', ',', $sListPrivileges);
        }
    }

    /**
     * delete an user
     */
    function DELETE() {
        require $this->sRessourcesFile;
        $sErrorMesssage = '';
        $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
        $aParams['user_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'number');
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getLoginbyId'], $aParams);
        $oUserDeleted = $this->oConnection->oBd->objetSuivant($oPDOresult);
        if (!$this->oConnection->oBd->enErreur()) {
            // Liste des privilèges de l'utilisateur présents dans la table s_vitis.privileges.
            $aParams = array();
            $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
            $aParams['login'] = array('value' => $oUserDeleted->login, 'type' => 'string');
            $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['userApplicationPrivileges'], $aParams);
            if ($this->oConnection->oBd->enErreur()) {
                $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                return $sMessage;
            } else {
                if ($oPDOresult->rowCount() > 0) {
                    $aUserPrivileges = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);
                    // Revoke sur les privilèges.
                    foreach ($aUserPrivileges as $aPrivilege) {
                        $aParams = array();
                        $aParams['sValue'] = array('value' => $oUserDeleted->login, 'type' => 'double_quote');
                        $aParams['sId'] = array('value' => $aPrivilege['groname'], 'type' => 'double_quote');
                        $this->oConnection->oBd->executeWithParams($aSql['revokePrivilege'], $aParams);
                        if ($this->oConnection->oBd->enErreur()) {
                            $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                            $aXmlRacineAttribute['status'] = 0;
                            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                            return $sMessage;
                        }
                    }
                }
                // Si l'utilisateur n'a plus de privilèges associés -> suppression du rôle de connexion.
                $aParams = array();
                $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
                $aParams['login'] = array('value' => $oUserDeleted->login, 'type' => 'string');
                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getAllUserPrivileges'], $aParams);
                if ($oPDOresult->rowCount() == 0) {
                    $oSgbdDataAccess = new PgsqlDataAccess($this->oConnection->oBd, $this->aProperties["database"], $this->aProperties["server"], "vitis_user", "vitis_admin", $this->aProperties["schema_framework"]);
                    $sErrorMesssage = $oSgbdDataAccess->DeleteDatabaseRole($oUserDeleted->login);
                }
                // Supprime l'utilisateur dans la table s_vitis.user.
                $this->deleteChild($this->aProperties['schema_framework'], 'v_user', 'user_id', "vitis_admin");
            }
            if ($sErrorMesssage == "") {
                $this->aFields["user_id"] = $this->aValues['my_vitis_id'];
            } else {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            }
        }
    }

}

?>
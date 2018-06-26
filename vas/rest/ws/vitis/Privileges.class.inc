<?php

/**
 * \file Privileges.class.inc
 * \class Privileges
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the Modes php class
 *
 * This class defines Rest Api to Vitis Privileges
 * 
 */
require_once 'Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once 'Privilege.class.inc';
require_once(__DIR__ . '/../../class/vmlib/BdDataAccess.inc');

class Privileges extends Vitis {
    /**
     * @SWG\Definition(
     *   definition="/privileges",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/privileges")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Privileges",
     *   description="Operations about Privileges"
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
        $this->aSelectedFields = Array("rolname", "description", "type", "users");
    }

    /**
     * @SWG\Get(path="/privileges",
     *   tags={"Privileges"},
     *   summary="Get Privileges",
     *   description="Request to get Privileges",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="privilege token",
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
     *         @SWG\Schema(ref="#/definitions/privileges")
     *     )
     *  )
     */

    /**
     * get Privileges
     * @return  Privileges
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_framework'], "privileges", "rolname");
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/privileges/{rolname}",
     *   tags={"Privileges"},
     *   summary="Update Privilege",
     *   description="Request to update Privilege",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="privilege token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="rolname",
     *     in="path",
     *     description="id of the privilege",
     *     required=true,
     *     type="string",
     *   ),
     * * @SWG\Parameter(
     *     name="description",
     *     in="query",
     *     description="description of the privilege",
     *     required=false,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
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
     * update privilege
     * @return id of the privilege if ok error object if ko
     */
    function PUT() {
        require $this->sRessourcesFile;
        // id = string.
        $iId = $this->aValues['my_vitis_id'];

        $aReturn = $this->genericPut($this->aProperties['schema_framework'], 'privileges', 'rolname');
        // $this->aValues['my_vitis_id'] = "'" . $this->aValues['my_vitis_id'] . "'";
        if ($this->oConnection->oBd->enErreur()) {
            $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        } else {
            // Le paramètre "users" est passé dans la requête ?
            if ($this->aValues['users'] !== NULL) {
                $excludeLogin = '';
                if ($this->aValues['my_vitis_id'] == 'vitis_admin' || $this->aValues['my_vitis_id'] == 'vitis_user')
                    $excludeLogin = $_SESSION['ses_Login'];

                //Chargement des utilisateurs qui ne sont pas dans le groupe
                $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
                $aParams['sId'] = array('value' => $iId, 'type' => 'string');
                $aParams['excludeLogin'] = array('value' => $excludeLogin, 'type' => 'string');
                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getUsename'], $aParams);
                $aUsers = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);
                if ($this->oConnection->oBd->enErreur()) {
                    $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    return $sMessage;
                } else {
                    // Revoke sur tous les utilisateurs le privilège.
                    for ($i = 0; $i < count($aUsers); $i++) {
                        $aParams = array();
                        $aParams['sValue'] = array('value' => $aUsers[$i]["usename"], 'type' => 'double_quote');
                        $aParams['sId'] = array('value' => $iId, 'type' => 'double_quote');
                        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['revokePrivilege'], $aParams);
                        if ($this->oConnection->oBd->enErreur()) {
                            $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                            $aXmlRacineAttribute['status'] = 0;
                            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                            return $sMessage;
                        } else {
                            if ($iId == 'vitis_admin') {
                                $aParams = array();
                                $aParams['sValue'] = array('value' => $aUsers[$i]["usename"], 'type' => 'double_quote');
                                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['revokeCREATEROLE'], $aParams);
                                if ($this->oConnection->oBd->enErreur()) {
                                    $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                                    $aXmlRacineAttribute['status'] = 0;
                                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                                    return $sMessage;
                                }
                            }
                        }
                    }
                    // Utilisateurs à associer au privilège ?
                    if (!empty($this->aValues['users'])) {
                        $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
                        $aParams['user_id'] = array('value' => $this->aValues['users'], 'type' => 'group');
                        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getUsers'], $aParams);
                        if ($this->oConnection->oBd->enErreur()) {
                            $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                            $aXmlRacineAttribute['status'] = 0;
                            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                            return $sMessage;
                        } else {
                            // Grant sur tous les utilisateurs sélectionnés.
                            $aUsers = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);
                            for ($i = 0; $i < count($aUsers); $i++) {
                                $aParams = array();
                                $aParams['sValue'] = array('value' => $aUsers[$i]["login"], 'type' => 'double_quote');
                                $aParams['sId'] = array('value' => $iId, 'type' => 'double_quote');
                                $this->oConnection->oBd->executeWithParams($aSql['grantPrivilege'], $aParams);
                                if ($this->oConnection->oBd->enErreur()) {
                                    $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                                    $aXmlRacineAttribute['status'] = 0;
                                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                                    return $sMessage;
                                } else {
                                    if ($iId == 'vitis_admin') {
                                        $aParams = array();
                                        $aParams['sValue'] = array('value' => $aUsers[$i]["login"], 'type' => 'double_quote');
                                        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['grantCREATEROLE'], $aParams);
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
                    }
                }
            }
        }
        $aXmlRacineAttribute['status'] = 1;
        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        return $sMessage;
    }

}

?>
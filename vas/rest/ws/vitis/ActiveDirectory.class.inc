<?php

/**
 * \file ActiveDirectory.class.inc
 * \class ActiveDirectory
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the ActiveDirectory php class
 *
 * This class defines Rest Api to Gtf workspaces
 * 
 */
require_once 'Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once 'Domain.class.inc';
require_once(__DIR__ . '/../../class/vmlib/BdDataAccess.inc');
require_once(__DIR__ . '/../../class/treeview/Tree.php');
require_once(__DIR__ . '/../../class/treeview/LdapTree.php');
require_once(__DIR__ . '/../../class/Ldap.class.inc');
require_once 'User.class.inc';

class ActiveDirectory extends Vitis {
    /**
     * @SWG\Definition(
     *   definition="/activedirectory",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/activedirectory")
     *   }
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
        $this->aSelectedFields = Array('workspace_id', 'name');
    }

    /**
     * @SWG\Get(path="/ActiveDirectory/Test",
     *   tags={"Domains"},
     *   summary="Test connection to active directory",
     *   description="Request to test connection to active directory",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="domain_id",
     *     in="query",
     *     description="domain id",
     *     required=true,
     *     type="integer",
     *     format="int32"
     *   ),
     *   @SWG\Parameter(
     *     name="login",
     *     in="query",
     *     description="login of user",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="password",
     *     in="query",
     *     description="Encrypted password of user",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="object",
     *     in="query",
     *     type="string",
     *         @SWG\Items(type="string"),
     *         default="person",
     *         enum={"person", "group"},
     *     description="object of test",
     *     required=true,
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/ActiveDirectory")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/ActiveDirectory/Tree",
     *   tags={"Domains"},
     *   summary="Get Active Directory tree of domain",
     *   description="Request to get active Directory tree of domain by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="domain_id",
     *     in="query",
     *     description="domain id",
     *     required=true,
     *     type="integer",
     *     format="int32"
     *   ),
     *   @SWG\Parameter(
     *     name="login",
     *     in="query",
     *     description="login of user",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="password",
     *     in="query",
     *     description="Encrypted password of user",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="object",
     *     in="query",
     *     type="string",
     *         @SWG\Items(type="string"),
     *         default="person",
     *         enum={"person", "group"},
     *     description="object of test",
     *     required=true,
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/ActiveDirectory")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/ActiveDirectory/Users",
     *   tags={"Domains"},
     *   summary="Search Active Directory users",
     *   description="Request to search active Directory users",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="domain_id",
     *     in="query",
     *     description="domain id",
     *     required=true,
     *     type="integer",
     *     format="int32"
     *   ),
     *   @SWG\Parameter(
     *     name="login",
     *     in="query",
     *     description="login of user",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="password",
     *     in="query",
     *     description="Encrypted password of user",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="search_account",
     *     in="query",
     *     description="account to search",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="search_groups",
     *     in="query",
     *     description="groups to search",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="search_department",
     *     in="query",
     *     description="department to search",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/ActiveDirectory")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/ActiveDirectory/Users/{branch}",
     *   tags={"Domains"},
     *   summary="Get Active Directory users of branch",
     *   description="Request to get active Directory users of branch by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="branch",
     *     in="path",
     *     description="branch of tree",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="domain_id",
     *     in="query",
     *     description="domain id",
     *     required=true,
     *     type="integer",
     *     format="int32"
     *   ),
     *   @SWG\Parameter(
     *     name="login",
     *     in="query",
     *     description="login of user",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="password",
     *     in="query",
     *     description="Encrypted password of user",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/ActiveDirectory")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/ActiveDirectory/Groups",
     *   tags={"Domains"},
     *   summary="Search Active Directory groups",
     *   description="Request to search active Directory groups",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="domain_id",
     *     in="query",
     *     description="domain id",
     *     required=true,
     *     type="integer",
     *     format="int32"
     *   ),
     *   @SWG\Parameter(
     *     name="login",
     *     in="query",
     *     description="login of user",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="password",
     *     in="query",
     *     description="Encrypted password of user",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="search_group",
     *     in="query",
     *     description="group to search",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/ActiveDirectory")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/ActiveDirectory/Groups/{branch}",
     *   tags={"Domains"},
     *   summary="Get Active Directory groups of branch",
     *   description="Request to get active Directory groups of branch by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="branch",
     *     in="path",
     *     description="branch of tree",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="domain_id",
     *     in="query",
     *     description="domain id",
     *     required=true,
     *     type="integer",
     *     format="int32"
     *   ),
     *   @SWG\Parameter(
     *     name="login",
     *     in="query",
     *     description="login of user",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="password",
     *     in="query",
     *     description="Encrypted password of user",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/ActiveDirectory")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/ActiveDirectory/UserGroups/{user_id}",
     *   tags={"Domains"},
     *   summary="Get groups of Active Directory user",
     *   description="Request to get the groupd of an active Directory user",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="user_id",
     *     in="path",
     *     description="user id",
     *     required=true,
     *     type="integer",
     *     format="int32"
     *   ),
     *   @SWG\Parameter(
     *     name="mixed_rights_management",
     *     in="query",
     *     description="mixed rights management",
     *     required=true,
     *     type="boolean",
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/ActiveDirectory")
     *     )
     *  )
     */

    /**
     * get active directory users
     * @return active directory users
     */
    function GET() {
        if (isset($this->oConnection->oError) && !empty($this->oConnection->oError)) {
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $this->oConnection->oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }
        if (!empty($this->aPath[2])) {
            // Test de connexion au serveur AD ?
            if ($this->aPath[2] == 'Test') {
                $aReturn = $this->testDomain();
                if ($aReturn['sStatus'] == 1) {
                    $oError = new VitisError(1, $aReturn['sMessage']);
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    return $sMessage;
                }
            }
            // Arborescence du serveur AD ?
            else if ($this->aPath[2] == 'Tree') {
                $aReturn = $this->getDomainADTree();
                if ($aReturn['sStatus'] == 1) {
                    $oError = new VitisError(1, $aReturn['sMessage']);
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    return $sMessage;
                }
            }
            // Utilisateurs d'une branche ou recherche sur tout l'arbre ?
            else if ($this->aPath[2] == 'Users') {
                if (!empty($this->aPath[3])) {
                    $this->aValues['branch'] = $this->aPath[3];
                    $aReturn = $this->getADTreeUsers();
                } else
                    $aReturn = $this->searchADTreeUsers();
                if ($aReturn['sStatus'] == 1) {
                    $oError = new VitisError(1, $aReturn['sMessage']);
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    return $sMessage;
                }
            }
            // Groupes d'une branche ou recherche sur tout l'arbre ?
            else if ($this->aPath[2] == 'Groups') {
                if (!empty($this->aPath[3])) {
                    $this->aValues['branch'] = $this->aPath[3];
                    $aReturn = $this->getADTreeGroups();
                } else
                    $aReturn = $this->searchADTreeGroups();
                if ($aReturn['sStatus'] == 1) {
                    $oError = new VitisError(1, $aReturn['sMessage']);
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    return $sMessage;
                }
            }
            // Groupes d'un utilisateur ?
            else if ($this->aPath[2] == 'UserGroups') {
                $aReturn = $this->getADUserGroups();
                if ($aReturn['sStatus'] == 1) {
                    $oError = new VitisError(1, $aReturn['sMessage']);
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    return $sMessage;
                }
            }
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }
        return $sMessage;
    }

    /**
     * Test domain
     */
    Public function testDomain() {
        $aValues = $this->aValues;
        $aValues['my_vitis_id'] = $this->aValues['domain_id'];
        // Infos du domaine
        $oDomain = new Domain($this->aPath, $aValues, $this->aProperties, $this->oConnection);
        $oDomain->GET();
        $this->aValues = array_merge($oDomain->aFields, $this->aValues);
        $this->aValues['my_vitis_id'] = $oDomain->aFields['domain_id'];
        //
        $aResult = array();
        // Informations de l'AD stocké dans un tableau
        $sLoginLdap = $this->aValues['login'] . '@' . $this->aValues['domain'];
        $aLdap = array('sIdLdap' => $this->aValues['domain_id'], 'sType' => $this->aValues['type'], 'sLdapName' => $this->aValues['domain'], 'sLoginLdap' => $sLoginLdap, 'sPwdLdap' => $this->aValues['password'], 'sServer' => $this->aValues['server'], 'sPort' => $this->aValues['port']);
        $aLdap['sObject'] = $this->aValues['object'];
        // Utilisateur ou groupe ?
        if ($this->aValues['object'] == "person")
            $aLdap['sDnResearch'] = $this->aValues['dn_search_user'];
        else
            $aLdap['sDnResearch'] = $this->aValues['dn_search_group'];
        // Connexion au serveur AD.
        $oLdap = new Ldap(serialize($aLdap));
        $sLdapConn = $oLdap->connectLdap();
        $aReturn = array('sStatus' => 0, 'sMessage' => '');
        if (ldap_error($sLdapConn) == "Success") {
            $this->aObjects[0]->aFields = $aLdap;
            $aReturn['oLdap'] = $oLdap;
        } else {
            if (ldap_error($sLdapConn) == "Invalid credentials")
                $sError = 'ERROR_INVALID_CREDENTIALS_ACTIVE_DIRECTORY_USERS_USER';
            else if (ldap_error($sLdapConn) == "Can't contact LDAP server")
                $sError = 'ERROR_CONTACT_DOMAIN_ACTIVE_DIRECTORY_USERS_USER';
            else
                $sError = ldap_error($sLdapConn);
            $aReturn = array('sStatus' => 1, 'sMessage' => $sError);
        }
        return $aReturn;
    }

    /**
     * getDomainADTree
     */
    Public function getDomainADTree() {
        $aReturn = $this->testDomain();
        if ($aReturn['sStatus'] == 1)
            return $aReturn;
        else {
            $oLdap = $aReturn['oLdap'];
            // Important!
            if ($oLdap->aLdap['sDnResearch'] == '')
                $oLdap->aLdap['sDnResearch'] = 'null';
            $oLdapTree = new LdapTree($oLdap);
            $branch = null;
            $aTree = $oLdapTree->json($branch, true);
            $this->aObjects[0]->aFields = array('tree' => $aTree);
            $aReturn = array('sStatus' => 0, 'sMessage' => '');
        }
        return $aReturn;
    }

    /**
     * getADTreeUsers
     */
    Public function getADTreeUsers() {
        $this->aValues['object'] = 'person';
        $aReturn = $this->testDomain();
        if ($aReturn['sStatus'] == 1)
            return $aReturn;
        else {
            $oLdap = $aReturn['oLdap'];
            $sLdapConn = $oLdap->connectLdap();
            $aReturn = array('sStatus' => 0, 'sMessage' => '');
            if (ldap_error($sLdapConn) == "Success") {
                $aUserList = $oLdap->getUsers($sLdapConn, $this->aValues['branch']);
                $this->aObjects[0]->aFields = array('users' => $aUserList);
                $aReturn = array('sStatus' => 0, 'sMessage' => '');
            } else
                $aReturn = array('sStatus' => 1, 'sMessage' => ldap_error($sLdapConn));
        }
        return $aReturn;
    }

    /**
     * getADTreeUsers
     */
    Public function searchADTreeUsers() {
        $this->aValues['object'] = 'person';
        $aReturn = $this->testDomain();
        if ($aReturn['sStatus'] == 1)
            return $aReturn;
        else {
            $aUserListdouble = array();
            $oLdap = $aReturn['oLdap'];
            $sDn = $oLdap->getDcLdap();
            $sLdapConn = $oLdap->connectLdap();
            $aReturn = array('sStatus' => 0, 'sMessage' => '');
            if (ldap_error($sLdapConn) == "Success") {
                $sFilter = "(&(objectclass=person)";
                if ($_REQUEST["search_account"] != "") {
                    $sFilter .= "(" . $oLdap->userprincipalname . "=" . $_REQUEST["search_account"] . "*)";
                }
                if (!empty($_REQUEST["search_department"])) {
                    $sFilter .= "(department=" . $_REQUEST["search_department"] . "*)";
                }

                if (!empty($_REQUEST["search_groups"])) {
                    $sFilter .= "(|";
                    $aGroup = explode(',', str_replace(", ", ",", $_REQUEST["search_groups"]));

                    foreach ($aGroup as $sGroup) {
                        $aUserListdouble = array_merge($aUserListdouble, $oLdap->get_members($sLdapConn, $sDn, $sGroup, $_REQUEST["search_account"], $_REQUEST["search_department"]));
                        $sPrimaryGroup = $oLdap->getGroupInfo($sLdapConn, $sDn, $sGroup);
                        $sFilter .= "(primaryGroupID=" . $sPrimaryGroup . ")";
                    }
                    $sFilter .= ")";
                }
                $sFilter .= ")";
                $aUserListdouble = array_merge($aUserListdouble, $oLdap->getCriteria($sLdapConn, $sDn, $sFilter, $oLdap->aLdap["sObject"]));
                $known_users = array();
                $aUserList = array();
                foreach ($aUserListdouble as $user) {
                    if (!in_array($user["userprincipalname"], $known_users)) {
                        $aUserList[] = $user;
                        $known_users[] = $user["userprincipalname"];
                    }
                }
                $this->aObjects[0]->aFields = array('users' => $aUserList);
            } else
                $aReturn = array('sStatus' => 1, 'sMessage' => ldap_error($sLdapConn));
        }
        return $aReturn;
    }

    /**
     * getADTreeGroups
     */
    Public function getADTreeGroups() {
        $this->aValues['object'] = 'group';
        $aReturn = $this->testDomain();
        if ($aReturn['sStatus'] == 1)
            return $aReturn;
        else {
            $oLdap = $aReturn['oLdap'];
            $sLdapConn = $oLdap->connectLdap();
            $aReturn = array('sStatus' => 0, 'sMessage' => '');
            if (ldap_error($sLdapConn) == "Success") {
                $aGroupList = $oLdap->getGroups($sLdapConn, $this->aValues['branch']);
                $this->aObjects[0]->aFields = array('groups' => $aGroupList);
                $aReturn = array('sStatus' => 0, 'sMessage' => '');
            } else
                $aReturn = array('sStatus' => 1, 'sMessage' => ldap_error($sLdapConn));
        }
        return $aReturn;
    }

    /**
     * getADTreeGroups
     */
    Public function searchADTreeGroups() {
        $this->aValues['object'] = 'group';
        $aReturn = $this->testDomain();
        if ($aReturn['sStatus'] == 1)
            return $aReturn;
        else {
            $aGroupListdouble = array();
            $oLdap = $aReturn['oLdap'];
            $sDn = $oLdap->getDcLdap();
            $sLdapConn = $oLdap->connectLdap();
            $aReturn = array('sStatus' => 0, 'sMessage' => '');
            if (ldap_error($sLdapConn) == "Success") {
                $sFilter = "(&(|(objectClass=groupOfNames)(objectClass=groupOfUniqueNames)(objectclass=group))(!(objectClass=person))";
                if ($this->aValues['search_group'] != "") {
                    $sFilter .= "(cn=" . $this->aValues['search_group'] . "*)"; // $sFilter .="(cn=".$_REQUEST["name_ad"]."*)";
                }
                $sFilter .= ")";
                $aGroupList = $oLdap->getCriteria($sLdapConn, $sDn, $sFilter, $oLdap->aLdap["sObject"]);
                $this->aObjects[0]->aFields = array('groups' => $aGroupList);
            } else
                $aReturn = array('sStatus' => 1, 'sMessage' => ldap_error($sLdapConn));
        }
        return $aReturn;
    }

    /**
     * getADUserGroups
     */
    Public function getADUserGroups() {
        require $this->sRessourcesFile;
        $aReturn = array('sStatus' => 0, 'sMessage' => '');
        $aUserGroup = Array();
        // Login de l'utilisateur.
        $sSql = $aSql['getUserLogin'];
        $sSql = str_replace('[iUserId]', $this->aPath[3], $sSql);
        $sSql = str_replace('[sSchemaFramework]', $this->aProperties["schema_framework"], $sSql);
        $resultat = $this->oConnection->oBd->execute($sSql);
        if ($this->oConnection->oBd->enErreur()) {
            $aReturn = array('sStatus' => 1, 'sMessage' => $this->oConnection->oBd->getBDMessage());
        } else {
            // Groupes du domaine dont l'utilisateur est membre.
            $oResult = $this->oConnection->oBd->objetSuivant($resultat);
            $aGroupListId = getUserGroups2($oResult->login, $this->oConnection->oBd, $this->aProperties["mixed_rights_management"], $this->aProperties["schema_framework"]);
            // Liste des groupes de l'utilisateur.
            $sSql = $aSql['getUserGroups'];
            $sSql = str_replace('[iUserId]', $this->aPath[3], $sSql);
            $sSql = str_replace('[sSchemaFramework]', $this->aProperties["schema_framework"], $sSql);
            $resultat = $this->oConnection->oBd->execute($sSql);
            if ($this->oConnection->oBd->enErreur()) {
                $aReturn = array('sStatus' => 1, 'sMessage' => $this->oConnection->oBd->getBDMessage());
            } else {
                $sGroup = "";
                $sIdGroup = "";
                while ($oGroup = $this->oConnection->oBd->objetSuivant($resultat)) {
                    $aUserGroup[$oGroup->group_id] = $oGroup->name;
                    if ($sGroup == "") {
                        $sGroup = $oGroup->name;
                    } else {
                        $sGroup .= ", " . $oGroup->name;
                    }
                    if ($sIdGroup == "") {
                        $sIdGroup = $oGroup->group_id;
                    } else {
                        $sIdGroup .= "@@" . $oGroup->group_id;
                    }
                }
                if ($aGroupListId['ad'] != "") {
                    if ($sGroup == "") {
                        $sGroup = $aGroupListId['ad'];
                    } else {
                        $sGroup .= ", " . $aGroupListId['ad'];
                    }
                }
                $this->aObjects[0]->aFields = array('allGroups' => $sGroup, 'adGroups' => $aGroupListId['ad']);
            }
        }
        return $aReturn;
    }

}

?>
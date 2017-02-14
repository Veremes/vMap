<?php

require_once(__DIR__ . "/../vmlib/Vm.class.inc");
require_once(__DIR__ . "/../vmlib/dbUtil.inc");
require_once(__DIR__ . "/../vmlib/logUtil.inc");
require_once(__DIR__ . "/../vmlib/error.inc");
require_once(__DIR__ . "/../vmlib/cryptUtil.inc");

/**
 * \file Connection.class.inc
 * \class Connection
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the class Connection 
 *
 * This class defines methods to connect to the database, get groups and privilges of the connected user.
 * 
 * 
 */
class Connection {

    /**
     * bd object (the connection itself)
     */
    public $oBd;

    /**
     * parameters sent to the class
     */
    public $aValues;

    /**
     * error object if the connection encounters an error
     */
    public $oError;

    /**
     * properties 
     */
    public $aProperties;

    /**
     * list of the user groups
     */
    public $sesGroup;

    /**
     * list of the user privileges
     */
    public $aPrivileges = Array();
    public $sFolderLib = "vitis_lib";

    /**
     * 
     * @param type $aValues paramters to the object
     * @param type $aProperties properties
     */
    function Connection($aValues, $aProperties) {
        $this->aProperties = $aProperties;
        $this->aValues = $aValues;
        session_id($aValues['token']);
        if (session_status() == PHP_SESSION_NONE)
            session_start();
        $bIsconnected = true;
        if ($_SESSION == array()) {
            if ($aValues['token'] == $this->aProperties['public_token']) {
                $this->aValues = $aValues;
                $_SESSION["ses_Login"] = $this->aProperties['public_login'];
                $ciphertext = des($this->aProperties['public_login'], $this->aProperties['public_password'], 1, 0);
                $_SESSION["ses_Password"] = stringToHex($ciphertext);
                if (empty($this->aValues['duration']))
                    $this->aValues['duration'] = 10;
                $_SESSION["ses_Date"] = date('Y-m-d H:i:s', time() + ($this->aValues['duration'] * 60));
            } else {
                $this->oError = new Error(16, 'invalid token');
                $bIsconnected = false;
            }
        }
        if ($bIsconnected) {
            $this->connect();
        }
    }

    function connect() {
        $bIsValidDate = false;
        //verify validity date
        if (isset($_SESSION['ses_Date'])) {
            $now = date('Y-m-d H:i:s');
            $now = new DateTime($now);
            $now = $now->format('YmdHis');
            $next = $_SESSION['ses_Date'];
            $next = new DateTime($next);
            $next = $next->format('YmdHis');
            if ($now < $next)
                $bIsValidDate = true;
            else if ($this->aValues['token'] == $this->aProperties['public_token']) {
                // Régénère un token public qui a expiré.
                if (empty($this->aValues['duration']))
                    $this->aValues['duration'] = 10;
                $_SESSION["ses_Date"] = date('Y-m-d H:i:s', time() + ($this->aValues['duration'] * 60));
                $this->aValues['validity_date'] = $_SESSION["ses_Date"];
                $bIsValidDate = true;
            }
        } else {
            $this->oError = new Error(15, "Token validity outpassed");
        }
        //if valid date
        if ($bIsValidDate == true) {
            //conenction to the database with the token
            if (isset($properties["language"]))
                $lang = $properties["language"];
            else
                $lang = null;
            loadLang('vmlib', $lang, 'vmlib/');
            if (!empty($this->aValues['module']) && isset($this->aProperties['database_' . $this->aValues['module']])) {
                $sDataBase = $this->aProperties['database_' . $this->aValues['module']];
            } else {
                $sDataBase = $this->aProperties['database'];
            }
            if (!empty($this->aValues['module']) && isset($this->aProperties['server_' . $this->aValues['module']])) {
                $sServer = $this->aProperties['server_' . $this->aValues['module']];
            } else {
                $sServer = $this->aProperties['server'];
            }
            if (!empty($this->aValues['module']) && isset($this->aProperties['port_' . $this->aValues['module']])) {
                $iPort = $this->aProperties['port_' . $this->aValues['module']];
            } else {
                $iPort = $this->aProperties['port'];
            }
            if (!empty($this->aValues['module']) && isset($this->aProperties['sgbd_' . $this->aValues['module']])) {
                $sSgbd = $this->aProperties['sgbd_' . $this->aValues['module']];
            } else {
                $sSgbd = $this->aProperties['sgbd'];
            }
            if (isset($this->aValues['sEncoding']))
                $sEncoding = $this->aValues['sEncoding'];
            else
                $sEncoding = null;
            $this->oBd = new Vm($_SESSION["ses_Login"], trim(des(rtrim(utf8_decode($_SESSION["ses_Login"])), hexToString(rtrim($_SESSION["ses_Password"])), 0, 0, null)), $sDataBase, $sServer, $iPort, $sSgbd, $sEncoding);
            if ($this->oBd->erreurRencontree) {
                writeToErrorLog(ERROR_CONNECTION_PROBLEM);
                writeToErrorLog($this->oBd->getBDMessage());
            }

            if ($this->oBd->erreurRencontree) {
                $this->oError = new Error(1, $this->oBd->sMessage);
            } else {
                $this->aValues['login'] = $_SESSION["ses_Login"];
                $this->aValues['validity_date'] = $_SESSION["ses_Date"];
                //get the groups of the user
                if (isset($this->aValues['getGroup']) && !$this->aValues['getGroup'] == false) {
                    $this->sesGroup = getUserGroups($_SESSION["ses_Login"], $this->oBd, $_SESSION["ses_Password"], $this->aProperties["mixed_rights_management"], $this->aProperties["schema_framework"]);
                }

                //get the privileges of the user
                $this->getUserPrivileges();
            }
        } else {

            $this->oError = new Error(15, "Token validity outpassed");
        }
    }

    /**
     * function wich get user privileges
     */
    function getUserPrivileges() {
        $sSql = "SELECT * FROM pg_user s LEFT OUTER JOIN pg_group g on (s.usesysid = any(g.grolist) ) where usename = '" . $_SESSION["ses_Login"] . "'";
        $oResult = $this->oBd->execute($sSql);
        if (empty($this->oBd->enErreur) && $this->oBd->nombreLigne($oResult) > 0) {
            while ($aPrivilege = $this->oBd->ligneSuivante($oResult)) {
                array_push($this->aPrivileges, $aPrivilege['groname']);
            }
        }
    }

    /**
     * Get the rights of a user on a given table
     * @param string $sSchema
     * @param string $sTable
     * @return array array of rights ex: ["SELECT", "TRUNCATE", "UPDATE"]
     */
    function getTableRights($sSchema, $sTable) {

        if (!isset($sSchema) || empty($sSchema)) {
            return [];
        }
        if (!isset($sTable) || empty($sTable)) {
            return [];
        }
        // Version 1
//        $aProperties = $this->aProperties;
//        $aPrivileges = $this->aPrivileges;
//
//        // Ajoute PUBLIC dans les privilèges
//        array_push($aPrivileges, 'PUBLIC');
//
//        // connexion avec u_vitis
//        $oSchedulerBd = new BD('u_vitis', '', $aProperties["database"], $aProperties["server"], $aProperties["port"], $aProperties["sgbd"], $aProperties["page_encoding"]);
//
//        $sSql = "SELECT * FROM information_schema.role_table_grants WHERE table_schema = '" . $sSchema . "' AND table_name = '" . $sTable . "'";
//        $oResult = $oSchedulerBd->execute($sSql);
//
//        $aRights = array();
//
//        // Récupère les droits en fonction des privilèges
//        if (!$oSchedulerBd->enErreur()) {
//            if ($oSchedulerBd->nombreLigne($oResult) > 0) {
//                while ($aLigne = $oSchedulerBd->ligneSuivante($oResult)) {
//                    if (in_array($aLigne['grantee'], $aPrivileges)) {
//                        if (!in_array($aLigne['privilege_type'], $aRights)) {
//                            array_push($aRights, $aLigne['privilege_type']);
//                        }
//                    }
//                }
//            }
//        }
        // Version 2 (Armand 02/09/2016)
        $sSql = "SELECT 
	has_table_privilege('" . $sSchema . "." . $sTable . "','insert') AS \"INSERT\", 
	has_table_privilege('" . $sSchema . "." . $sTable . "','select') AS \"SELECT\", 
	has_table_privilege('" . $sSchema . "." . $sTable . "','update') AS \"UPDATE\",
	has_table_privilege('" . $sSchema . "." . $sTable . "','delete') AS \"DELETE\",
	has_table_privilege('" . $sSchema . "." . $sTable . "','truncate') AS \"TRUNCATE\",
	has_table_privilege('" . $sSchema . "." . $sTable . "','references') AS \"REFERENCES\",
	has_table_privilege('" . $sSchema . "." . $sTable . "','trigger') AS \"TRIGGER\"";

        $oResult = $this->oBd->execute($sSql);

        $aRights = array();

        if (!$this->oBd->enErreur()) {
            if ($this->oBd->nombreLigne($oResult) > 0) {
                while ($aLigne = $this->oBd->ligneSuivante($oResult)) {
                    foreach ($aLigne as $key => $value) {
                        if ($value === true){
                            array_push($aRights, $key);
                        }
                    }
                }
            }
        }
        return $aRights;
    }

}

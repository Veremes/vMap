<?php

/*
 *
 * dbUtil.inc : fonction de r�cup�ration de connexion BD d'apr�s les param�tres de session
 *
 */

/*
 * Variable globale stockant le nom de dossier lib.
 */
require_once __DIR__ . '/error.inc';
require_once __DIR__ .'/../Ldap.class.inc';
$sFolderLib = "vmlib";

/**
  DEPRECATED utiliser la fonction codePass2
 * Cette m�thode code une chaine.
 * \param $sPass Chaine � crypt�e.
 * \return la chaine cod�e.
 */
/* function codepass($sPass) {
  $sCode .= chr(97+strlen($sPass));
  for($i = 0; $i < 20; $i++){
  if ($i  < strlen($sPass)){
  $iChar = ord($sPass[$i]);
  $sCode .= sprintf("%'04s", $iChar);
  }else{
  $sCode .= sprintf("%'04s", rand(0,99));
  }
  }
  return $sCode;
  } */

/**
 * Cette m�thode code une chaine.
 * \param $sKey Cl� de cryptage.
 * \param $sCode Chaine � crypt�e.
 * \return la chaine cod�e.
 */
function codePass2($sKey, $sCode) {
    require_once(__DIR__ . "/cryptUtil.inc");
    $sCode = stringToHex(trim(des(rtrim($sKey), rtrim($sCode), 1, 0, null)));
    return $sCode;
}

/**
  DEPRECATED utiliser la fonction decodePass2
 * Cette m�thode d�code une chaine.
 * \param $sCode Chaine � traduire.
 * \return la chaine d�cod�e.
 */
function decodepass($sCode) {
    require_once(__DIR__ . "/cryptUtil.inc");
    $sCode = trim(des(rtrim($_SESSION["ses_Login"]), hexToString(rtrim($sCode)), 0, 0, null));
    return $sCode;
}

/**
 * Cette m�thode d�code une chaine.
 * \param $sKey Cl� de cryptage.
 * \param $sCode Chaine � traduire.
 * \return la chaine d�cod�e.
 */
function decodePass2($sKey, $sCode) {
    require_once(__DIR__ . "/cryptUtil.inc");
    $sCode = trim(des(rtrim($sKey), hexToString(rtrim($sCode)), 0, 0, null));
    return $sCode;
}

/**
 * Cette m�thode g�n�re une connexion � la base de donn�es.
 * \param $sPageEncoding Encodage de la base de donn�e.
 * \return un objet BD.
 */
function connectFromSessionV2($sPageEncoding = "LATIN1") {
    global $properties, $sFolderLib;
    require_once(__DIR__ . "/cryptUtil.inc");
    loadLang($sFolderLib, $properties["language"], $sFolderLib . "/");
    $oBd = new Vm($_SESSION["ses_Login"], utf8_encode(trim(des(rtrim(utf8_decode($_SESSION["ses_Login"])), hexToString(rtrim($_SESSION["ses_Password"])), 0, 0, null))), $properties["database"], $properties["server"], $properties["port"], $properties["sgbd"], $sPageEncoding);
    if ($oBd->erreurRencontree) {
        writeToErrorLog(ERROR_CONNECTION_PROBLEM);
        writeToErrorLog($oBd->getBDMessage());
    }
    return $oBd;
}

/**
 * Cette m�thode g�n�re une connexion � la base de donn�es.
 * \param $sPageEncoding Encodage de la base de donn�e.
 * \return un objet BD.
 */
function connectFromSession($sPageEncoding = "LATIN1") {
    global $properties, $sFolderLib;
    require_once(__DIR__ . "/cryptUtil.inc");
    $sPassword = decodePass2($_SESSION["ses_Login"], $_SESSION["ses_Password"]);
    loadLang($sFolderLib, $properties["language"], $sFolderLib . "/");
    $oBd = new Vm($_SESSION["ses_Login"], $sPassword, $properties["database"], $properties["server"], $properties["port"], $properties["sgbd"], $sPageEncoding);
    if ($oBd->erreurRencontree) {
        writeToErrorLog(ERROR_CONNECTION_PROBLEM);
        writeToErrorLog($oBd->getBDMessage());
    }
    return $oBd;
}

/**
 * Cette m�thode g�n�re une connexion � une base de donn�es pass�e en param�tre.
 * \param $sPageEncoding Encodage de la base de donn�e.
 * \param $sDatabase Nom de la base de donn�es.
 * \return un objet BD.
 */
function connectFromSessionOtherDatabase($sDatabase, $sPageEncoding = "LATIN1") {
    global $properties, $sFolderLib;
    require_once("vmlib/cryptUtil.inc");
    $sPassword = decodePass2($_SESSION["ses_Login"], $_SESSION["ses_Password"]);
    loadLang($sFolderLib, $properties["language"], $sFolderLib . "/");
    $oBd = new Vm($_SESSION["ses_Login"], $sPassword, $sDatabase, $properties["server"], $properties["port"], $properties["sgbd"], $sPageEncoding);
    if ($oBd->erreurRencontree) {
        writeToErrorLog(ERROR_CONNECTION_PROBLEM);
        writeToErrorLog($oBd->getBDMessage());
    }
    return $oBd;
}

/**
 * Cette m�thode g�n�re une connexion � une base de donn�es pass�e en param�tre.
 * \param $sPageEncoding Encodage de la base de donn�e.
 * \param $sDatabase Nom de la base de donn�es.
 * \return un objet BD.
 */
function connectFromSessionOtherDatabaseV2($sDatabase, $sPageEncoding = "LATIN1") {
    global $properties, $sFolderLib;
    require_once(__DIR__ . "/cryptUtil.inc");
    loadLang($sFolderLib, $properties["language"], $sFolderLib . "/");
    $oBd = new Vm($_SESSION["ses_Login"], utf8_encode(trim(des(rtrim(utf8_decode($_SESSION["ses_Login"])), hexToString(rtrim($_SESSION["ses_Password"])), 0, 0, null))), $sDatabase, $properties["server"], $properties["port"], $properties["sgbd"], $sPageEncoding);
    if ($oBd->erreurRencontree) {
        writeToErrorLog(ERROR_CONNECTION_PROBLEM);
        writeToErrorLog($oBd->getBDMessage());
    }
    return $oBd;
}

/**
 * ?
 */
function getUserGroupsEngines($sSessLogin, $oBd, $bRights, $sSessPassword = "") {
    global $properties;
    $sSql = "SELECT domain_id, user_id FROM " . $properties["schema_framework"] . ".user WHERE lower(login) = '" . utf8_encode(strToLower(utf8_decode($sSessLogin))) . "'";
    $oPDOresult = @$oBd->execute($sSql);
    $sListGroupId = "";
    $aFields = $oBd->ligneSuivante($oPDOresult);
    $oPDOresult = $oBd->fermeResultat();
    if ($aFields['domain_id'] == "" || $bRights) {
        $sSql = "SELECT group_id FROM " . $properties["schema_framework"] . ".user_group WHERE user_id = " . $aFields['user_id'];
        $oPDOresult = @$oBd->execute($sSql);

        while ($aLigne = $oBd->ligneSuivante($oPDOresult)) {
            if ($sListGroupId == "") {
                $sListGroupId = $aLigne["group_id"];
            } else {
                $sListGroupId .= ", " . $aLigne["group_id"];
            }
        }
        $oPDOresult = $oBd->fermeResultat();
    }
    if ($aFields['domain_id'] != "") {
        $sSql = "SELECT * FROM " . $properties["schema_framework"] . ".domain WHERE domain.domain_id='" . $aFields['domain_id'] . "'";
        $resultat = $oBd->execute($sSql);
        $aResultLdap = $oBd->objetSuivant($resultat);
        $resultat = $oBd->fermeResultat();
        if ($aResultLdap) {
            if ($aResultLdap->verify_rights == 1) {
                // Informations de l'AD stock� dans un tableau
                if ($sSessPassword == "") {
                    $sSessLogin2 = $aResultLdap->login;
                    $sSessPassword = $aResultLdap->password;
                } else {
                    $sSessLogin2 = $sSessLogin;
                    $sSessPassword = $sSessPassword;
                }
                if ($_REQUEST['object'] == "person") {
                    $aLdap = array(sIdLdap => $aResultLdap->domain_id, sLdapName => $aResultLdap->domain, sType => $aResultLdap->type, sLoginLdap => utf8_encode(strToLower(utf8_decode($sSessLogin2))), sPwdLdap => $sSessPassword, sServer => $aResultLdap->server, sPort => $aResultLdap->port, sDnResearch => $aResultLdap->dn_search_user);
                } else {
                    $aLdap = array(sIdLdap => $aResultLdap->domain_id, sLdapName => $aResultLdap->domain, sType => $aResultLdap->type, sLoginLdap => utf8_encode(strToLower(utf8_decode($sSessLogin2))), sPwdLdap => $sSessPassword, sServer => $aResultLdap->server, sPort => $aResultLdap->port, sDnResearch => $aResultLdap->dn_search_group);
                }
                $oLdap = new Ldap(serialize($aLdap));
                $sLdapConn = $oLdap->connectLdap();
                if (ldap_error($sLdapConn) == "Success") {
                    $aGroups = $oLdap->getGroup($sLdapConn, utf8_encode(strToLower(utf8_decode($sSessLogin))));
                    $sListGroupName = "";
                    foreach ($aGroups as $iGroupId) {
                        if ($sListGroupName == "") {
                            $sListGroupName = "'" . str_replace("'", "''", utf8_encode(strToLower(utf8_decode($iGroupId)))) . "'";
                        } else {
                            $sListGroupName .= ", '" . str_replace("'", "''", utf8_encode(strToLower(utf8_decode($iGroupId)))) . "'";
                        }
                    }
                    $sSql = "SELECT group_id FROM " . $properties["schema_framework"] . ".group WHERE LOWER(name) IN (" . $sListGroupName . ")";
                    $oPDOresult = @$oBd->execute($sSql);
                    while ($aLigne = $oBd->ligneSuivante($oPDOresult)) {
                        if ($sListGroupId == "") {
                            $sListGroupId = $aLigne["group_id"];
                        } else {
                            $sListGroupId .= ", " . $aLigne["group_id"];
                        }
                    }
                    $oPDOresult = $oBd->fermeResultat();
                } else {
                    if (ldap_error($sLdapConn) == "Invalid credentials")
                        $sErrorMessage = ERROR_0033;
                    else if (ldap_error($sLdapConn) == "Can't contact LDAP server")
                        $sErrorMessage = TEXT_ERROR_CONTACT_DOMAIN;
                    else
                        $sErrorMessage = ldap_error($sLdapConn);
                    writeToErrorLog($sErrorMessage);
                    $aFormContent = $_REQUEST;
                }
            }else {
                $sListGroupId = "0";
            }
        }
    }
    if ($sListGroupId == "") {
        $sListGroupId = "0";
    }
    return $sListGroupId;
}

/**
 * ?
 */
function getUserGroups($sSessLogin, $oBd, $sSessPassword = "", $bRights, $sSchema) {

    $sSql = "SELECT domain_id, user_id FROM " . $sSchema . ".v_user WHERE lower(login) = '" . utf8_encode(strToLower(utf8_decode($sSessLogin))) . "'";
    $oPDOresult = @$oBd->execute($sSql);

    $aFields = $oBd->ligneSuivante($oPDOresult);
    $oPDOresult = $oBd->fermeResultat();
    if ($aFields['domain_id'] == "" || $bRights) {
        $sSql = "SELECT group_id FROM " . $sSchema . ".v_user_group WHERE user_id = " . $aFields['user_id'];
        $oPDOresult = @$oBd->execute($sSql);
        $sListGroupId = "";
        while ($aLigne = $oBd->ligneSuivante($oPDOresult)) {
            if ($sListGroupId == "") {
                $sListGroupId = $aLigne["group_id"];
            } else {
                $sListGroupId .= ", " . $aLigne["group_id"];
            }
        }
        $oPDOresult = $oBd->fermeResultat();
        if ($sListGroupId == "") {
            $sListGroupId = "0";
        }
    }
    if ($aFields['domain_id'] != "") {
        $sSql = 'SELECT * FROM ' . $sSchema . '.domain WHERE domain.domain_id=\'' . $aFields['domain_id'] . '\'';
        $resultat = $oBd->execute($sSql);
        $aResultLdap = $oBd->objetSuivant($resultat);
        $resultat = $oBd->fermeResultat();
        if ($aResultLdap) {
            // Informations de l'AD stock� dans un tableau
            if ($sSessPassword == "") {
                $sSessLogin2 = $aResultLdap->login;
                $sSessPassword = $aResultLdap->password;
            } else {
                $sSessLogin2 = $sSessLogin;
				 $sSessPassword = $sSessPassword;
            }
            if ($_REQUEST['object'] == "person") {
                $aLdap = array(sIdLdap => $aResultLdap->domain_id, sLdapName => $aResultLdap->domain, sLoginLdap => utf8_encode(strToLower(utf8_decode($sSessLogin2))), sPwdLdap => $sSessPassword, sServer => $aResultLdap->server, sPort => $aResultLdap->port, sDnResearch => $aResultLdap->dn_search_user, sType => $aResultLdap->type);
            } else {
                $aLdap = array(sIdLdap => $aResultLdap->domain_id, sLdapName => $aResultLdap->domain, sLoginLdap => utf8_encode(strToLower(utf8_decode($sSessLogin2))), sPwdLdap => $sSessPassword, sServer => $aResultLdap->server, sPort => $aResultLdap->port, sDnResearch => $aResultLdap->dn_search_group, sType => $aResultLdap->type);
            }
            $oLdap = new Ldap(serialize($aLdap));
            $sLdapConn = $oLdap->connectLdap();
            if (ldap_error($sLdapConn) == "Success") {
                $aGroups = $oLdap->getGroup($sLdapConn, $sSessLogin);
                $sListGroupName = "";
                    foreach ($aGroups as $iGroupId) {
                        if ($sListGroupName == "") {
                            $sListGroupName = "'" . str_replace("'", "''", utf8_encode(strToLower(utf8_decode($iGroupId)))) . "'";
                        } else {
                            $sListGroupName .= ", '" . str_replace("'", "''", utf8_encode(strToLower(utf8_decode($iGroupId)))) . "'";
                        }
                    }
                $sSql = "SELECT group_id FROM " . $sSchema . ".group WHERE LOWER(name) IN (" . $sListGroupName . ")";
                $oPDOresult = @$oBd->execute($sSql);

                while ($aLigne = $oBd->ligneSuivante($oPDOresult)) {
                    if ($sListGroupId == "") {
                        $sListGroupId = $aLigne["group_id"];
                    } else {
                        $sListGroupId .= ", " . $aLigne["group_id"];
                    }
                }
                $oPDOresult = $oBd->fermeResultat();
            } else {
                if (ldap_error($sLdapConn) == "Invalid credentials")
                    $sErrorMessage = ERROR_0033;
                else if (ldap_error($sLdapConn) == "Can't contact LDAP server")
                    $sErrorMessage = TEXT_ERROR_CONTACT_DOMAIN;
                else
                    $sErrorMessage = ldap_error($sLdapConn);
                writeToErrorLog($sErrorMessage);
                $aFormContent = $_REQUEST;
            }
        }
    }
    if ($sListGroupId == "") {
        $sListGroupId = "0";
    }
    return $sListGroupId;
}

function getUserGroups2($sSessLogin, $oBd, $bRights, $sSchema) {
    $sListGroupIdBd = "";
    $sListGroupIdAd = "";

    $sSql = "SELECT domain_id, user_id FROM " . $sSchema . ".v_user WHERE lower(login) = '" . utf8_encode(strToLower(utf8_decode($sSessLogin))) . "'";
    $oPDOresult = $oBd->execute($sSql);
    if ($oBd->erreurRencontree) {
        writeToErrorLog($oBd->getBDMessage());
    } else {
        $aFields = $oBd->ligneSuivante($oPDOresult);

        $oPDOresult = $oBd->fermeResultat();
        if ($aFields['domain_id'] == "" || $bRights) {
            $sSql = "SELECT group_id FROM " . $sSchema . ".v_user_group WHERE user_id = " . $aFields['user_id'];
            $oPDOresult = @$oBd->execute($sSql);
            while ($aLigne = $oBd->ligneSuivante($oPDOresult)) {
                if ($sListGroupIdBd == "") {
                    $sListGroupIdBd = $aLigne["group_id"];
                } else {
                    $sListGroupIdBd .= ", " . $aLigne["group_id"];
                }
            }
            $oPDOresult = $oBd->fermeResultat();
        }
        if ($aFields['domain_id'] != "") {
            $sSql = 'SELECT * FROM ' . $sSchema . '.domain WHERE domain.domain_id=\'' . $aFields['domain_id'] . '\'';
            $resultat = $oBd->execute($sSql);
            $aResultLdap = $oBd->objetSuivant($resultat);
            $resultat = $oBd->fermeResultat();
            if ($aResultLdap) {
                // Informations de l'AD stock� dans un tableau
                if ($sSessPassword == "") {
                    $sSessLogin2 = $aResultLdap->login;
                    //$sSessPassword =  stringToHex (des ($sSessLogin2, $aResultLdap->password, 1, 0, null));
                    $sSessPassword = $aResultLdap->password;
                    //writeToErrorLog($aResultLdap->password);
                } else {
                    $sSessLogin2 = $_SESSION[''];
                    $sSessPassword = utf8_encode(trim(des(rtrim(utf8_decode($_SESSION[''])), hexToString(rtrim($_SESSION[''])), 0, 0, null)));
                }
                // if ($_REQUEST['object'] == "person"){
                $aLdap = array(sIdLdap => $aResultLdap->domain_id, sLdapName => $aResultLdap->domain, sLoginLdap => utf8_encode(strToLower(utf8_decode($sSessLogin2))), sPwdLdap => $sSessPassword, sServer => $aResultLdap->server, sPort => $aResultLdap->port, sDnResearch => $aResultLdap->dn_search_user, sType => $aResultLdap->type);
                // }else{
                // $aLdap = array(sIdLdap=>$aResultLdap->domain_id,sLoginLdap=>strtolower($sSessLogin2),sPwdLdap=> $sSessPassword,sServer=>$aResultLdap->server,sPort=>$aResultLdap->port,sDnResearch=>$aResultLdap->dn_search_group);
                // }
                $oLdap = new Ldap(serialize($aLdap));
                $sLdapConn = $oLdap->connectLdap();
                if (ldap_error($sLdapConn) == "Success") {
                    $aGroups = $oLdap->getGroup($sLdapConn, utf8_encode(strToLower(utf8_decode($sSessLogin))));
                    $sListGroupName = "";
                    foreach ($aGroups as $iGroupId) {
                        if ($sListGroupName == "") {
                            $sListGroupName = "'" . utf8_encode(strToLower(utf8_decode($iGroupId))) . "'";
                        } else {
                            $sListGroupName .= ", '" . utf8_encode(strToLower(utf8_decode($iGroupId))) . "'";
                        }
                    }
                    $sSql = "SELECT name FROM " . $sSchema . ".group WHERE LOWER(name) IN (" . $sListGroupName . ")";
                    $oPDOresult = @$oBd->execute($sSql);
                    $sListGroupIdAd = "";
                    while ($aLigne = $oBd->ligneSuivante($oPDOresult)) {
                        if ($sListGroupIdAd == "") {
                            $sListGroupIdAd = $aLigne["name"];
                        } else {
                            $sListGroupIdAd .= ", " . $aLigne["name"];
                        }
                    }
                    $oPDOresult = $oBd->fermeResultat();
                } else {
                    if (ldap_error($sLdapConn) == "Invalid credentials")
                        $sErrorMessage = ERROR_0033;
                    else if (ldap_error($sLdapConn) == "Can't contact LDAP server")
                        $sErrorMessage = TEXT_ERROR_CONTACT_DOMAIN;
                    else
                        $sErrorMessage = ldap_error($sLdapConn);
                    writeToErrorLog($sErrorMessage);
                    $aFormContent = $_REQUEST;
                }
            }
        }
    }
    $aGroupList = array("bd" => $sListGroupIdBd, "ad" => $sListGroupIdAd);
    return $aGroupList;
}

?>
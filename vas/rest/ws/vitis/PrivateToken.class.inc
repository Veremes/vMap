<?php

require_once 'Vitis.class.inc';
require_once("inc/MetadataAccess.class.inc");
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file PrivateToken.class.inc
 * \class PrivateToken
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the PrivateToken php class
 *
 * This class defines Rest Api to private token
 */
class PrivateToken extends Vitis {
    /**
     * @SWG\Definition(
     *   definition="/privatetoken",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/privatetoken")
     *   },
     * )
     *  @SWG\Tag(
     *   name="Token",
     *   description="Operations about token"
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
    }

    /**
     * @SWG\Post(path="/privatetoken",
     *   tags={"Token"},
     *   summary="Get private token",
     *   description="Request to get a token",
     *   operationId="POST",
     *   produces={"application/xml", "application/json"},
     * @SWG\Parameter(
     *     name="user",
     *     in="formData",
     *     description="Login of the user",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="password",
     *     in="formData",
     *     description="Password of the user",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="duration",
     *     in="formData",
     *     description="Session duration (minutes)",
     *     required=false,
     *     type="integer",
     *     format="int32",
     *     default="60"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Token Response",
     *         @SWG\Schema(ref="#/definitions/privatetoken")
     *     )
     *  )
     */

    /**
     * Post function to generate a token
     * @return the token
     */
    function POST() {
        session_name(md5($this->aValues["user"] . '_' . uniqid()));
        session_start();
        require_once $this->sRessourcesFile;
        $bXMLError = false;
        // verify parameters
        if ((!isset($this->aValues['user'])) || (!isset($this->aValues['password']))) {
            $oError = new VitisError(2, "Missing parameters.");
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument($this->aValues['xslstylesheet'], 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $bXMLError = true;
        } else {
            if ($this->aProperties["allow_public_connection"] == false && $this->aValues['user'] == $this->aProperties["public_login"]) {
                $oError = new VitisError(1, "Connection forbidden with public account.");
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                $bXMLError = true;
                writeToErrorLog('ERROR : Connection forbidden with public account.');
            } else {
                // Suppression des majuscules et accents.
                $this->aValues['user'] = mb_strtolower($this->aValues['user'], 'UTF-8');
                $this->aValues['user'] = str_replace(array('à', 'â', 'ä', 'á', 'ã', 'å', 'î', 'ï', 'ì', 'í', 'ô', 'ö', 'ò', 'ó', 'õ', 'ø', 'ù', 'û', 'ü', 'ú', 'é', 'è', 'ê', 'ë', 'ç', 'ÿ', 'ñ'), array('a', 'a', 'a', 'a', 'a', 'a', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'e', 'e', 'e', 'e', 'c', 'y', 'n',), $this->aValues['user']);
                //
                if (!isset($this->aValues['duration'])) {
                    if (!empty($this->aProperties['cookie_lifetime']))
                        $this->aValues['duration'] = $this->aProperties['cookie_lifetime'];
                    else
                        $this->aValues['duration'] = 10;
                }
                if (isset($this->aValues['crypted']) && $this->aValues['crypted'] == 'true') {
                    $this->aValues['password'] = trim(des(rtrim(utf8_decode($this->aValues["user"])), hexToString(rtrim($this->aValues["password"])), 0, 0, null));
                }
            }
        }

        if (!$bXMLError) {
            //connect to database
            $oBd = new BD($this->aValues["user"], $this->aValues["password"], $this->aProperties["database"], $this->aProperties["server"], $this->aProperties["port"], $this->aProperties["sgbd"], $this->aProperties["page_encoding"]);
            $_SESSION["ses_Login"] = $this->aValues["user"];
            $ciphertext = stringToHex(des($this->aValues["user"], $this->aValues["password"], 1, 0));
            $_SESSION["ses_Password"] = $ciphertext;
            $_SESSION["ses_Remember"] = false;
            $_SESSION["ses_Date"] = date('Y-m-d H:i:s', time() + ($this->aValues['duration'] * 60));
            if ($oBd->erreurRencontree) {
                $oError = new VitisError(1, $oBd->sMessage);
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                $bXMLError = true;
            } else {
                // Privilège 'vitis_user' obligatoire.
                $aParams['sLogin'] = array('value' => $this->aValues["user"], 'type' => 'string');
                $oPDOresult = $oBd->executeWithParams($aSql['getUserConnectionPrivileges'], $aParams);
                if ($oBd->nombreLigne($oPDOresult) == 0) {
                    $oError = new VitisError(1, "No 'vitis_user' privilege.");
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    writeToErrorLog("ERROR : No 'vitis_user' privilege for user '" . $this->aValues["user"] . "'.");
                } else {
                    // L'utilisateur doit exister dans la table s_vitis.user
                    $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
                    $aParams['sLogin'] = array('value' => $_SESSION["ses_Login"], 'type' => 'string');
                    $oPDOresult = $oBd->executeWithParams($aSql['checkUser'], $aParams);
                    if ($oBd->nombreLigne($oPDOresult) == 0) {
                        $oError = new VitisError(1, 'The user ' . $_SESSION["ses_Login"] . ' does not exist');
                        $aXmlRacineAttribute['status'] = 0;
                        $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                        writeToErrorLog('ERROR : The user ' . $_SESSION["ses_Login"] . ' does not exist.');
                    }
                    else {
                        //verify the ip from wich the user is connected
                        $aParams = array();
                        $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
                        $aParams['sLogin'] = array('value' => $_SESSION["ses_Login"], 'type' => 'string');
                        $oPDOresult = $oBd->executeWithParams($aSql['checkIP'], $aParams);
                        $aFields = $oBd->ligneSuivante($oPDOresult);
                        $oMetadataAccess = new MetadataAccess($oBd, $_SESSION["ses_Login"], $_SESSION["ses_Password"], session_id(), $this->aProperties);
                        $bAuthorizedIp = $oMetadataAccess->checkUserIp($_SERVER['REMOTE_ADDR']);
                        if (!$bAuthorizedIp) {
                            $oError = new VitisError(11, 'Connection to the database forbidden with the ip \'' . $_SERVER['REMOTE_ADDR'] . '\'.');
                            $aXmlRacineAttribute['status'] = 0;
                            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                            $bXMLError = true;
                            writeToErrorLog('ERROR : Connection to the database forbidden with the ip \'' . $_SERVER['REMOTE_ADDR'] . '\'.');
                        } else {
                            $oConnection = new Connection(Array('token' => session_id()), $this->aProperties);
                            $this->aFields['token'] = session_id();
                            $this->aFields['user'] = $_SESSION["ses_Login"];
                            $this->aFields['validity_date'] = date('Y-m-d H:i:s', time() + ($this->aValues['duration'] * 60));
                            $this->aFields['user_id'] = $aFields['user_id'];
                            $this->aFields['privileges'] = $oConnection->aPrivileges;
                            if ($this->aValues['output'] === 'application/xml') {
                                $this->aFields['privileges'] = implode(',', $this->aFields['privileges']);
                            }
                            $_SESSION["ses_user_id"] = $aFields['user_id'];
                            $_SESSION["ses_restriction"] = $aFields['restriction'];
                            $aXmlRacineAttribute['status'] = 1;
                            $aParams = array();
                            $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
                            $aParams['user_id'] = array('value' => $aFields['user_id'], 'type' => 'number');
                            $aParams['date'] = array('value' => date('Y-m-d H:i:s', time()), 'type' => 'string');
                            $oPDOresult = $oBd->executeWithParams($aSql['updateLastConnection'], $aParams);
                            $sLogString = "connection" . $this->aProperties["log_delim"] . $_SESSION["ses_Login"] . $this->aProperties["log_delim"] . session_id();
                            writeToLog($sLogString, $this->aProperties["connexion_log_file"]);
                            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                        }
                    }
                }
            }
        }
        return $sMessage;
    }

    /**
     * @SWG\Get(path="/privatetoken",
     *   tags={"Token"},
     *   summary="Get token",
     *   description="Request to get a token",
     *   operationId="GET",
     *   produces={"application/xml", "application/json"},
     * @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="token of the user",
     *     required=true,
     *     type="string"
     *   ),
     *
     *
     *   @SWG\Response(
     *         response=200,
     *         description="Token Response",
     *         @SWG\Schema(ref="#/definitions/privatetoken")
     *     )
     *  )
     */

    /**
     * function get to verify the validity of the token
     * @return token
     */
    function GET() {
        require_once $this->sRessourcesFile;
        $oConnection = new Connection($this->aValues, $this->aProperties);
        if ($oConnection->oError != null) {
            $oError = $oConnection->oError;
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            // L'utilisateur doit exister dans la table s_vitis.user
            $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
            $aParams['sLogin'] = array('value' => $_SESSION["ses_Login"], 'type' => 'string');
            $oPDOresult = $oConnection->oBd->executeWithParams($aSql['checkUser'], $aParams);
            if ($oConnection->oBd->nombreLigne($oPDOresult) == 0) {
                $oError = new VitisError(1, 'The user ' . $_SESSION["ses_Login"] . ' does not exist');
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                writeToErrorLog('ERROR : The user ' . $_SESSION["ses_Login"] . ' does not exist.');
            }
            else {
                $this->aFields['token'] = $this->aValues['token'];
                $this->aFields['user'] = $oConnection->aValues['login'];
                $this->aFields['user_id'] = $_SESSION['ses_user_id'];
                $this->aFields['validity_date'] = $oConnection->aValues['validity_date'];
                $this->aFields['privileges'] = $oConnection->aPrivileges;
                if ($this->aValues['output'] === 'application/xml') {
                    $this->aFields['privileges'] = implode(',', $this->aFields['privileges']);
                }
                $sLogString = "connection" . $this->aProperties["log_delim"] . $_SESSION["ses_Login"] . $this->aProperties["log_delim"] . session_id();
                writeToLog($sLogString, $this->aProperties["connexion_log_file"]);
                $aXmlRacineAttribute['status'] = 1;
                $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);

                // Écrit dans la variable de session
                $oBd = $oConnection->oBd;
                $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
                $aParams['sLogin'] = array('value' => $_SESSION["ses_Login"], 'type' => 'string');
                $oPDOresult = $oBd->executeWithParams($aSql['checkIP'], $aParams);
                $aFields = $oBd->ligneSuivante($oPDOresult);
                $_SESSION["ses_user_id"] = $aFields['user_id'];
                $_SESSION["ses_restriction"] = $aFields['restriction'];
            }
        }
        return $sMessage;
    }

}

?>
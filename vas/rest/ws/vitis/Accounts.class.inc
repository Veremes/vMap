<?php

/**
 * \file accounts.class.inc
 * \class accounts
 *
 * \author Anthony Borghi <anthony.borghi@veremes.com>.
 *
 * 	\brief This file contains the Accounts php class
 *
 * This class defines Rest Api to Vitis Accounts
 * 
 */
require_once 'Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';
require_once ("PHPMailer/PHPMailerAutoload.php");

class Accounts extends Vitis {
    /**
     * @SWG\Definition(
     *   definition="/accounts",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/accounts")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Accounts",
     *   description="Operations about accounts"
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
        //$this->aSelectedFields = Array("user_id", "company");
    }

    /**
     * @SWG\Get(path="/accounts/{operation_id}/{command}",
     *   tags={"Accounts"},
     *   summary="Send a mail to ask admin confirmation",
     *   description="Send a mail to ask admin confirmation",
     *   operationId="GET",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="formData",
     *     description="group token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="operation_id",
     *     in="path",
     *     description="(fpwd, sign_up)",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="command",
     *     in="path",
     *     description="(confirm, update)",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="fullname",
     *     in="formData",
     *     description="name of user",
     *     required=false,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="password",
     *     in="formData",
     *     description="password of user",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/accounts")
     *     )
     *  )
     */
    function GET() {
        require 'Accounts.class.mail.inc';
        if ($this->aProperties["advanced_login_page"] === false) {
            http_response_code(403);
        } else {
            if (isset($this->aPath[3])) {
                if ($this->aPath[3] == "confirm") {
                    if ($this->aPath[2] === "sign_up") {
                        session_id($this->aValues["token"]);
                        session_start();
                        $sMessage = $this->addUser();
                        if ($this->aProperties["automated_sign_up"]) {
                            $sHtml = $this->bodyReplacer($aMail["signUpConfirmation"]);
                        } else {
                            $sRoleList = implode(", ", $this->aProperties["sign_up_automated_roles"]) . ", vitis_user";
                            $sContent = str_replace("[ROLES]", $sRoleList, $aMail["SignUpOk"]);
                            //$sHtml = str_replace("[CONTENT]", $sContent, $aMail["confirmationSignUp"]);
                            $sHtml = $this->bodyReplacer($sContent);
                            $sContentMail = htmlentities($aMail["signUpConfirmation"]);
                            //$sMail = str_replace("[CONTENT]", $sContentMail, $aMail["confirmationSignUp"]);
                            $sMail = $this->bodyReplacer($sContentMail);
                            $this->sendMail($this->aValues["email"], $sMail, $aMail["confirmationSignUpTitle"]);
                        }
                        $_SESSION = array();
                        session_destroy();
                        return $sHtml;
                    }
                    if ($this->aPath[2] === "fpwd") {
                        // check session
                        session_id($this->aValues["token"]);
                        session_start();

                        if (isset($_SESSION["login"])) {
                            // Login
                            $sUrl = $this->aProperties["web_server_name"] . "/" . $this->aProperties["services_alias"] . "/vitis/accounts/fpwd/update";
                            $sContent = str_replace("[TOKEN]", $this->aValues["token"], $aMail["fpwdForm"]);
                            $sContent = str_replace("[URL]", $sUrl, $sContent);
                            $sHtml = $this->bodyReplacer($sContent, $aMail["passwordScript"]);
                        } else {
                            //$sContent = str_replace("[CONTENT]", $aMail["alreadyUpdate"], $aMail["confirmationSignUp"]);
                            $sHtml = $this->bodyReplacer($aMail["alreadyUpdate"]);
                        }

                        return $sHtml;
                    }
                }
                if ($this->aPath[3] == "update") {
                    if ($this->aPath[2] === "fpwd") {
                        require 'Accounts.class.sql.inc';
                        // check session
                        session_id($this->aValues["token"]);
                        session_start();
                        if (isset($_SESSION["login"])) {
                            // new objet bd
                            $oBd = new BD($this->aProperties["db_superuser_login"], $this->aProperties["db_superuser_pass"], $this->aProperties["database"], $this->aProperties["server"], $this->aProperties["port"], $this->aProperties["sgbd"]);
                            $aParams['LOGIN'] = array('value' => utf8_encode($_SESSION["login"]), 'type' => 'column_name');
//                            $aParams['PASSWORD'] = array('value' => $this->aValues["password"], 'type' => 'string');
                            // Permet de ne pas afficher le mot de passe dans les logs
                            $aParams['PASSWORD'] = array('value' => 'md5' . md5($this->aValues["password"] . utf8_encode($_SESSION["login"])), 'type' => 'string');
                            $oPDOresult = $oBd->executeWithParams($aSql['updatePassword'], $aParams);
                            // check bd en erreur
                            if ($oBd->enErreur()) {
                                $sContent = $this->bodyReplacer($aMail["fpwdUpdateError"]);
                            } else {
                                $sContent = $this->bodyReplacer($aMail["fpwdUpdateOk"]);
                            }
                            //return html page to confirm success or error
                            $_SESSION = array();
                            session_destroy();
                        }
                        return $sContent;
                    }
                }
            }
        }
    }

    /**
     * @SWG\Post(path="/accounts/{operation_id}",
     *   tags={"Accounts"},
     *   summary="Send a mail to ask admin confirmation",
     *   description="Send a mail to ask admin confirmation",
     *   operationId="POST",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="formData",
     *     description="group token",
     *     required=false,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="operation_id",
     *     in="path",
     *     description="(fpwd, sign_up)",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="username",
     *     in="formData",
     *     description="login of user",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="fullname",
     *     in="formData",
     *     description="name of user",
     *     required=false,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="password",
     *     in="formData",
     *     description="password of user",
     *     required=false,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="mail",
     *     in="formData",
     *     description="mail of user",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="company",
     *     in="formData",
     *     description="organization of user",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/accounts")
     *     )
     *  )
     */

    /**
     * request to add an account or get the password
     * @return error message or confirmation
     */
    function POST() {
        require 'Accounts.class.mail.inc';
        if ($this->aProperties["advanced_login_page"] === false) {
            http_response_code(403);
        } else {
            // Utilisateur en minuscule.
            if (!empty($this->aValues["username"]))
                $this->aValues["username"] = strtolower($this->aValues["username"]);
            //
            if (isset($this->aPath[2])) {
                if ($this->aPath[2] == "sign_up") {
                    //check Captcha
                    $sUrl = "https://www.google.com/recaptcha/api/siteverify?secret=[SECRET]&response=[CAPTCHA]";
                    $sUrl = str_replace("[CAPTCHA]", $this->aValues["captcha"], $sUrl);
                    $sUrl = str_replace("[SECRET]", $this->aProperties["google_private_captcha"], $sUrl);
                    $verifyResponse = file_get_contents($sUrl);
                    $responseData = json_decode($verifyResponse);
                    if ($responseData->success) {
                        // check login available
                        if (!$this->checkUserInfo()) {
                            $sMessage = json_encode(array("status" => 5, "document_id" => $this->aValues["my_vitis_id"]));
                        } else {
                            session_start();
                            $_SESSION["login"] = $this->aValues["username"];
                            $_SESSION["name"] = $this->aValues["fullname"];
                            $_SESSION["email"] = $this->aValues["mail"];
                            $_SESSION["password"] = $this->aValues["password"];
                            $_SESSION["company"] = $this->aValues["company"];
                            $sUrl = $this->aProperties["web_server_name"] . "/" . $this->aProperties["services_alias"] . "/vitis/accounts/sign_up/confirm?token=" . session_id() . "&output=text/html";
                            $sContent = str_replace("[FULLNAME]", $_SESSION["name"], $aMail["newUserBody"]);
                            $sContent = str_replace("[LOGIN]", $_SESSION["login"], $sContent);
                            $sContent = str_replace("[MAIL]", $_SESSION["email"], $sContent);
                            $sContent = str_replace("[COMPANY]", $_SESSION["company"], $sContent);
                            $sContent = str_replace("[URL]", $sUrl, $sContent);
                            $sBody = $this->bodyReplacer($sContent);
                            if ($this->aProperties["automated_sign_up"]) {
                                // send mail to admin
                                $this->sendMail($_SESSION["email"], $sBody, $aMail["newUserTitleAutomated"]);
                                $sMessage = json_encode(array("status" => 1, "document_id" => $this->aValues["my_vitis_id"]));
                            } else {
                                // send mail to admin
                                $this->sendMail($this->aProperties["admin_sign_up"], $sBody, $aMail["newUserTitle"]);
                                $sMessage = json_encode(array("status" => 1, "document_id" => $this->aValues["my_vitis_id"]));
                            }
                        }
                    } else {
                        $sMessage = json_encode(array("status" => 6, "document_id" => $this->aValues["my_vitis_id"]));
                    }
                } elseif ($this->aPath[2] == "fpwd") {
                    // forgot password
                    // check data with database
                    if ($this->checkUserInfos()) {
                        //create Token and insert it in url
                        session_start();
                        $_SESSION["login"] = $this->aValues["username"];
                        $_SESSION["mail"] = $this->aValues["mail"];
                        $sUrl = $this->aProperties["web_server_name"] . "/" . $this->aProperties["services_alias"] . "/vitis/accounts/fpwd/confirm?token=" . session_id() . "&output=text/html";
                        $sContent = str_replace("[LOGIN]", $this->aValues["username"], $aMail["fpwdBody"]);
                        $sContent = str_replace("[URL]", $sUrl, $sContent);
                        $sBody = $this->bodyReplacer($sContent);
                        // send mail to user
                        $this->sendMail($this->aValues["mail"], $sBody, $aMail["fpwdTitle"]);
                        $sMessage = json_encode(array("status" => 1, "document_id" => $this->aValues["my_vitis_id"]));
                    } else {
                        $sMessage = json_encode(array("status" => 7, "document_id" => $this->aValues["my_vitis_id"]));
                    }
                }
            }
        }
        return $sMessage;
    }

    function checkUserInfo() {
        require 'Accounts.class.sql.inc';
        // new objet bd
        $oBd = new BD($this->aProperties["db_superuser_login"], $this->aProperties["db_superuser_pass"], $this->aProperties["database"], $this->aProperties["server"], $this->aProperties["port"], $this->aProperties["sgbd"]);
        // check if login exist
        $aParams['SCHEMA'] = array('value' => $this->aProperties["schema_framework"], 'type' => 'schema_name');
        $aParams['USERNAME'] = array('value' => $this->aValues["username"], 'type' => 'string');
        $oPDOresult = $oBd->executeWithParams($aSql['UserExists'], $aParams);
        if ($oBd->nombreLigne($oPDOresult) > 0) {
            return false;
        }
        return true;
    }

    function checkUserInfos() {
        require 'Accounts.class.sql.inc';
        // new objet bd
        $oBd = new BD($this->aProperties["db_superuser_login"], $this->aProperties["db_superuser_pass"], $this->aProperties["database"], $this->aProperties["server"], $this->aProperties["port"], $this->aProperties["sgbd"]);
        // check if login exist
        $aParams['SCHEMA'] = array('value' => $this->aProperties["schema_framework"], 'type' => 'schema_name');
        $aParams['USERNAME'] = array('value' => $this->aValues["username"], 'type' => 'string');
        $aParams['MAIL'] = array('value' => $this->aValues["mail"], 'type' => 'string');
        $oPDOresult = $oBd->executeWithParams($aSql['checkUser'], $aParams);
        if ($oBd->nombreLigne($oPDOresult) > 0) {
            return true;
        }
        return false;
    }

    function sendMail($sMailAdress, $sBody, $sTitle) {
        $mail = new PHPMailer;

        $mail->isSMTP();                                                // Set mailer to use SMTP
        $mail->SMTPDebug = 0;                                           // 3 pour voir les infos de connexion 
        $mail->Debugoutput = function($str, $level) {
            error_log("debug level $level; message: $str");
        };
        $mail->AuthType = 'LOGIN';
        $mail->Host = $this->aProperties["smtp_host"];                  // Specify main and backup SMTP servers
        $mail->SMTPAuth = $this->aProperties["smtp_authentification"];  // Enable SMTP authentication
        $mail->Username = $this->aProperties["smtp_login"];             // SMTP username
        $mail->Password = $this->aProperties["smtp_password"];          // SMTP password
        $mail->SMTPSecure = 'tls';                                      // Enable TLS encryption, `ssl` also accepted (deprecated)
        $mail->Port = $this->aProperties["smtp_port"];                  // TCP port to connect to

        $mail->setFrom($this->aProperties["mail_sender"], $this->aProperties["mail_sender"]);
        $mail->addAddress($sMailAdress);                                // Add a recipient
        $mail->addReplyTo($this->aProperties["mail_sender"], $this->aProperties["mail_sender"]);

        $mail->isHTML(true);                                            // Set email format to HTML
        $mail->CharSet = 'UTF-8';

        $mail->Subject = $sTitle;
        $mail->Body = utf8_decode($sBody);

        if (!$mail->send()) {
            error_log('Mailer Error: ' . $mail->ErrorInfo);
        }
    }

    function bodyReplacer($sContent, $sScript = "") {
        require 'Accounts.class.mail.inc';
        $sBody = str_replace('[CONTENT]', $sContent, $aMail["mainBody"]);
        $sBody = str_replace('[SCRIPT]', $sScript, $sBody);
        return $sBody;
    }

    function addUser() {
        require 'Accounts.class.sql.inc';
        // new objet bd
        $oBd = new BD($this->aProperties["db_superuser_login"], $this->aProperties["db_superuser_pass"], $this->aProperties["database"], $this->aProperties["server"], $this->aProperties["port"], $this->aProperties["sgbd"]);
        // check if login exist
        $aParams['SCHEMA'] = array('value' => $this->aProperties["schema_framework"], 'type' => 'schema_name');
        $aParams['USERNAME'] = array('value' => utf8_encode($_SESSION["login"]), 'type' => 'string');
        $oPDOresult = $oBd->executeWithParams($aSql['UserExists'], $aParams);
        if ($oBd->nombreLigne($oPDOresult) > 0) {
            $oError = new VitisError(1, "user already exists");
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            // create postgres user if not exists
            $oSgbdDataAccess = new PgsqlDataAccess($oBd, $this->aProperties["database"], $this->aProperties["server"], "vitis_user", "vitis_admin", $this->aProperties["schema_framework"]);
            $sErrorMessage = $oSgbdDataAccess->createSgbdUser($_SESSION["login"], $_SESSION["password"]);
            if ($sErrorMessage != "") {
                $oError = new VitisError(1, $sErrorMessage);
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            } else {
                // insertion s_vitis.user
                error_log(print_r(mb_detect_encoding($_SESSION["name"]), true));
                $_SESSION["name"] = utf8_decode($_SESSION["name"]);
                $_SESSION["company"] = utf8_decode($_SESSION["company"]);
                $iId = $oBd->insert($this->aProperties['schema_framework'], 'v_user', $_SESSION, $this->aProperties['schema_framework'] . '.seq_common', 'user_id');
                if ($oBd->enErreur()) {
                    $oError = new VitisError(1, $oBd->getBDMessage());
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                }
                //ajout des privileges
                for ($i = 0; $i < count($this->aProperties["sign_up_automated_roles"]); $i++) {
                    $aParams['ROLE'] = array('value' => $this->aProperties["sign_up_automated_roles"][$i], 'type' => 'column_name');
                    $aParams['USERNAME'] = array('value' => utf8_encode($_SESSION["login"]), 'type' => 'column_name');
                    $oPDOresult = $oBd->executeWithParams($aSql['setPrivilege'], $aParams);
                    if ($oBd->enErreur()) {
                        $oError = new VitisError(1, $oBd->getBDMessage());
                        $aXmlRacineAttribute['status'] = 0;
                        $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    }
                }
            }
        }

        return $sMessage;
    }

}

?>
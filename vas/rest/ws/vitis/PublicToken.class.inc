<?php

require_once 'Vitis.class.inc';
require_once("inc/MetadataAccess.class.inc");

/**
 * \file PublicToken.class.inc
 * \class PublicToken
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the PublicToken php class
 *
 * This class defines Rest Api to public token
 */
class PublicToken extends Vitis {
    /**
     * @SWG\Definition(
     *   definition="/publictoken",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/publictoken")
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
     * @param type $bShortcut false to reinit variables
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
    }

    /**
     * @SWG\Get(path="/publictoken", 
     *   tags={"Token"},
     *   summary="Get public token",
     *   description="Request to get a token",
     *   operationId="GET",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Response(
     *         response=200,
     *         description="Token Response",
     *         @SWG\Schema(ref="#/definitions/publictoken")
     *     )
     *  )
     */

    /**
     * Method get to get a public token
     * @return user array
     */
    function GET() {
        session_name(md5(uniqid('', true)));
        session_start();
        require_once $this->sRessourcesFile;
        //define the session
        session_id($this->aProperties['public_token']);
        $this->aValues["user"] = $this->aProperties['public_login'];
        $this->aValues["password"] = $this->aProperties['public_password'];
        $oBd = new BD($this->aValues["user"], $this->aValues["password"], $this->aProperties["database"], $this->aProperties["server"], $this->aProperties["port"], $this->aProperties["sgbd"], $this->aProperties["page_encoding"]);
        $_SESSION["ses_Login"] = $this->aValues["user"];
        $ciphertext = stringToHex(des($this->aValues["user"], $this->aValues["password"], 1, 0));
        $_SESSION["ses_Password"] = $ciphertext;
        $_SESSION["ses_Remember"] = false;
        if ($oBd->erreurRencontree) {
            $oError = new VitisError(1, $oBd->sMessage);
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            //verify if the ip from wich the user connect is allowed
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
            } else {
                //if no error return the token
                $this->aFields['token'] = session_id();
                $this->aFields['validity_date'] = date('Y-m-d H:i:s', time() + ($this->aValues['duration'] * 60));
                $aXmlRacineAttribute['status'] = 1;
                $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            }
        }
        return $sMessage;
    }

}

?>
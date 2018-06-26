<?php

require_once 'Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once(__DIR__ . '/../../class/vmlib/BdDataAccess.inc');

/**
 * \file phpinfo.class.inc
 * \class Phpinfo
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the Phpinfo php class
 *
 * This class defines the rest api for phpinfo
 * 
 */
class Phpinfo extends Vitis {
    /**
     * @SWG\Definition(
     *   definition="/phpinfo",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/phpinfo")
     *   }
     * )
     * @SWG\Tag(
     *   name="Phpinfo",
     *   description="Operations about phpinfo"
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $phpinfo ptroperties
     */
    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        parent::__construct($aPath, $aValues, $properties, $bShortcut, $oConnection);
    }

    /**
     * @SWG\Get(path="/phpinfo",
     *   tags={"Phpinfo"},
     *   summary="Get phpinfo",
     *   description="Request to get phpinfo",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/phpinfo")
     *     )
     *  )
     */

    /**
     * 
     * @return phpinfo
     */
    function GET() {
        if ($this->oConnection->oError == null && in_array("vitis_admin", $this->oConnection->aPrivileges)) {
            define('STYLE_START', '<style');
            define('STYLE_END', '</style>');

            ob_start();
            phpinfo();
            $sPhpInfo = ob_get_contents();

            // Supprime les styles des éléments
            if (stripos($sPhpInfo, STYLE_START) !== false && stripos($sPhpInfo, STYLE_END) !== false) {
                $sPhpInfoNoStyle = substr($sPhpInfo, 0, stripos($sPhpInfo, STYLE_START));
                $sPhpInfoNoStyle .= substr($sPhpInfo, stripos($sPhpInfo, STYLE_END) + strlen(STYLE_END));
            }
            ob_end_clean();
            //echo $sPhpInfoNoStyle;
            //
            $this->aFields['phpinfo'] = $sPhpInfoNoStyle;
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        } else {
            http_response_code(403);
            $aXmlRacineAttribute['status'] = 0;
            $this->aFields['phpinfo'] = "ERROR : invalid token";
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }
    }

}

?>
<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../vitis/Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

/**
 * \file downloadrapport.class.inc
 * \class DownloadRapport
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the DownloadRapport php class
 *
 * This class defines the rest api for downloadrapport
 * 
 */
class DownloadRapport extends Cadastre {
    /**
     * @SWG\Definition(
     *   definition="/downloadrapport",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/downloadrapport")
     *   }
     * )
     * * @SWG\Tag(
     *   name="DownloadRapport",
     *   description="Operations about DownloadRapport"
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
    }

    /**
     * @SWG\Get(path="/downloadrapport",
     *   tags={"ReleveDePropriete"},
     *   summary="Create the releve de propriete sheet",
     *   description="Request to get the element",
     *   operationId="GET",
     *   produces={"application/json"},
     * @SWG\Parameter(
     *     name="sYear",
     *     in="query",
     *     description="year folder name (ex: 2013)",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sType",
     *     in="query",
     *     description="type folder name",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sFileName",
     *     in="query",
     *     description="file name (includes the extension)",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="DownloadRapport Response",
     *         @SWG\Schema(ref="#/definitions/downloadrapport")
     *     )
     *  )
     */
    function GET() {
        
        if (!in_array('vmap_cadastre_user', $this->oConnection->aPrivileges)) {
            $oError = new VitisError(0, 'INSUFFICIENT_PRIVILEGES');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }
        
        if ($this->oConnection->oError == null) {
            if (!empty($this->aValues['sFileName'])) {
                $aRestriction = explode('|', $_SESSION['ses_restriction']);
                if (strpos($this->aValues['sFileName'], "../") === false && ($_SESSION['ses_restriction'] == "%" || in_array(substr($this->aValues['sFileName'], 0, 5), $aRestriction))){
                    $sFile = $this->aProperties["cadastre"]["rp"]["rp_dir"] . "/" . $this->aValues['sYear'] . '/' . $this->aValues['sType'] . '/' . $this->aValues['sFileName'];
                    if (is_file($sFile)) {
                        switch (pathinfo($sFile, PATHINFO_EXTENSION)) {
                            case 'pdf':
                                if (file_exists($sFile)) {
                                    header('Content-Type: application/pdf');
                                }
                                break;
                            case 'xls':
                                if (file_exists($sFile)) {
                                    header('Content-Type: application/vnd.ms-excel');
                                }
                                break;
                            default:
                                http_response_code(403);
                                //echo (json_encode(array("status" => "0", "sMessage" => "forbidden")));
                                exit;
                                break;
                        }
                        header('Expires: 0');
                        header('Cache-Control: must-revalidate');
                        header('Pragma: public');
                        header('Content-Length: ' . filesize($sFile));
                        readfile($sFile);
                    } else {
                        return 'Une erreur est survenue lors de la g�n�ration du rapport';
                    }
                }else{
                    http_response_code(403); 
                }
            }
        }else{
            http_response_code(403); 
        }
    }

}

?>
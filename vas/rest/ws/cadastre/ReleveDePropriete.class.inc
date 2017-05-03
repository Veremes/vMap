<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../vitis/Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

/**
 * \file relevedepropriete.class.inc
 * \class ReleveDePropriete
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 *  \brief This file contains the ReleveDePropriete php class
 *
 * This class defines the rest api for relevedepropriete
 * 
 */
class ReleveDePropriete extends Cadastre {
    /**
     * @SWG\Definition(
     *   definition="/relevedepropriete",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/relevedepropriete")
     *   }
     * )
     * * @SWG\Tag(
     *   name="relevedepropriete",
     *   description="Operations about relevedepropriete"
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
     * @SWG\Get(path="/relevedepropriete",
     *   tags={"ReleveDePropriete"},
     *   summary="Create the releve de propriete sheet",
     *   description="Request to get the element",
     *   operationId="GET",
     *   produces={"application/json"},
     * @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="type",
     *     in="query",
     *     description="standard / tiers / parcelle",
     *     required=true,
     *     default="parcelle",
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="IDDNUPRO",
     *     in="query",
     *     description="concaténation entre ID_COM et DNUPRO",
     *     required=false,
     *     default="L00048",
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="ID_PAR",
     *     in="query",
     *     description="ID_PAR",
     *     required=false,
     *     default="340039000AI0166",
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="ReleveDePropriete Response",
     *         @SWG\Schema(ref="#/definitions/relevedepropriete")
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

        $ID_PAR = $this->aValues['ID_PAR'];
        $IDDNUPRO = $this->aValues['IDDNUPRO'];
        $sType = $this->aValues['type'];
        $properties = $this->aProperties;
        $aReturn = Array();

        // Vérifie que l'utilisateur a les droits sur la commune
        $communeRights = false;
        if ($ID_PAR != '')
            $communeRights = $this->haveCommuneRights(substr($ID_PAR, 0, 6));
        if ($IDDNUPRO != '')
            $communeRights = $this->haveCommuneRights(substr($IDDNUPRO, 0, 6));

        // Vérifie les droits sur la commune
        if ($communeRights == false) {
            $aReturn['error']['errorMessage'] .="L'utilisateur n'a pas les droits sur la commune";
            return json_encode($aReturn);
        }

        // Vérifie la validité des informations passées en properties
        if (!is_dir($properties["fop_root_dir"])) {
            $aReturn['error']['errorMessage'] .="Dossier fop introuvable: " . $properties["fop_root_dir"];
            return json_encode($aReturn);
        }
        if (!is_dir(__DIR__ . '/../../class/majic_lib')) {
            $aReturn['error']['errorMessage'] .="Dossier majic_lib introuvable";
            return json_encode($aReturn);
        }

        $oBD = new BD($properties["cadastre"]["rp"]["login"], $properties["cadastre"]["rp"]["pass"], $properties["database"], $properties["server"], $properties["port"], $properties["sgbd"], $properties["page_encoding"]);
        $this->oConnection->oBd = $oBD;

        // Récupère l'année
        $sYear = $this->vmapGet('majic', '"ANNEE_REFERENCE"', array('ANNEE'), '', 'LIMIT 1')[0]['ANNEE'];

        if (strlen($sYear) < 1) {
            $aReturn['error']['errorMessage'] .="Impossible de récupérer l'année de référence dans le schema Majic";
            return json_encode($aReturn);
        }

        // Récupère le chemin du fichier
        switch ($sType) {
			case "tiers" :
            case "standard" :
                $fileName = $IDDNUPRO;
                break;
            
            case "parcelle" :
                $fileName = $ID_PAR;
                break;
        }

        $filePath = $properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear . '/' . $sType . '/' . $fileName . ".pdf";
        if (!file_exists($properties["cadastre"]["rp"]["rp_dir"]))
            @mkdir($properties["cadastre"]["rp"]["rp_dir"]);
        if (!file_exists($properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear))
            @mkdir($properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear);
        if (!file_exists($properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear . '/' . $sType))
            @mkdir($properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear . '/' . $sType);


        if (file_exists($filePath)) {
            $aReturn['data']['releveDePropriete'] = $properties['web_server_name'] . '/' . $properties['services_alias'] . '/cadastre/downloadrapport?sYear=' . $sYear . '&sType=' . $sType . '&sFileName=' . urlencode($fileName) . '.pdf';
            $aReturn['data']['alreadyExists'] = true;
        } else {
            if (!file_exists($properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear)) {
                if (@mkdir($properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear)) {
                    @mkdir($properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear . "/standard");
                    @mkdir($properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear . "/tiers");
                    @mkdir($properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear . "/parcelle");
                } else {
                    $aReturn['error']['errorMessage'] .="Erreur lors de la création des répertoires de l'année courante pour les relevés de propriété.";
                    return json_encode($aReturn);
                }
            }

            // Création d'un nouvel objet Relevé de Propriété
            switch ($sType) {
				 case "tiers" :
                case "standard" :
                    require_once __DIR__ . '/../../class/majic_lib/Mj_Compte_Communal.class.inc';
                    $oRP = new Mj_Compte_Communal($IDDNUPRO, $oBD);
                    if ($oRP->isError()) {
                        $aReturn['error']['errorMessage'] .="Erreur lors de l'extraction des données Majic.";
                        return json_encode($aReturn);
                    } else {
						if ($sType === "tiers"){
							$sDir = $sYear . "/tiers/"; 
						}else{
							$sDir = $sYear . "/standard/";
						}
                        $sFile = str_replace("*", "~", $IDDNUPRO);
                    }
                    break;
               
                case "parcelle" :
                    require_once __DIR__ . '/../../class/majic_lib/Mj_Compte_Communal_Parcelle.class.inc';
                    $oRP = new Mj_Compte_Communal_Parcelle("", $ID_PAR, $oBD);
                    if ($oRP->isError()) {
                        $aReturn['error']['errorMessage'] .="Erreur lors de l'extraction des données Majic.";
                        return json_encode($aReturn);
                    } else {
                        $sDir = $sYear . "/parcelle/";
                        $sFile = str_replace("*", "~", $ID_PAR);
                    }
                    break;
            }
            if (!$bError) {
                $sXMLFile = $properties["cadastre"]["rp"]["rp_dir"] . "/" . $sDir . $sFile . ".xml";
                if ($sType === "tiers") {
                    $sXSLFile = __DIR__ . '/../../class/majic_lib/xsl/Mj_fo_tiers.xsl';
                } else {
                    $sXSLFile = __DIR__ . '/../../class/majic_lib/xsl/Mj_fo.xsl';
                }
                $sPDFFile = $properties["cadastre"]["rp"]["rp_dir"] . "/" . $sDir . $sFile . ".pdf";

                if (!file_exists($sPDFFile)) {
                    $oRP->asXMLFile("", $sXMLFile, "Mj");
                }

                $sCommand = $properties["fop_root_dir"] . "/fop -xml " . $sXMLFile . " -xsl " . $sXSLFile . " -pdf " . $sPDFFile;

                exec($sCommand, $aCommand, $iResult);

                if (!$iResult) {
                    $aReturn['data']['releveDePropriete'] = $properties['web_server_name'] . '/' . $properties['services_alias'] . '/cadastre/downloadrapport?sYear=' . $sYear . '&sType=' . $sType . '&sFileName=' . urlencode($sFile) . '.pdf';
                } else {
                    writeToErrorLog("Erreur lors de la génération du fichier PDF de relevé de propriété :");
                    writeToErrorLog("Ligne de commande : " . $sCommand);
                    writeToErrorLog("Message d'erreur : ");
                    foreach ($aCommand as $sValeur) {
                        writeToErrorLog($sValeur);
                    }
                    $aReturn['error']['errorMessage'] .="Erreur lors de la génération du fichier PDF de relevé de propriété.";
                    return json_encode($aReturn);
                }
            }
        }

        return json_encode($aReturn);
    }

}

?>
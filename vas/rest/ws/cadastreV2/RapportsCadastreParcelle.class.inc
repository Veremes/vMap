<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../vitis/Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

/**
 * \file rapportscadastreparcelle.class.inc
 * \class RapportsCadastreParcelle
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the RapportsCadastreParcelle php class
 *
 * This class defines the rest api for rapportscadastreparcelle
 * 
 */
class RapportsCadastreParcelle extends Cadastre {
    /**
     * @SWG\Definition(
     *   definition="/rapportscadastreparcelle",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/rapportscadastreparcelle")
     *   }
     * )
     * * @SWG\Tag(
     *   name="RapportsCadastreParcelle",
     *   description="Operations about RapportsCadastreParcelle"
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
    }

    /**
     * @SWG\Get(path="/rapportscadastreparcelle",
     *   tags={"RapportsCadastreParcelle"},
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
     *     name="parcelles",
     *     in="query",
     *     description="id_par des parcelles (ex: 340039000AI0166|340332000AC0005)",
     *     required=true,
     *     default="",
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="rapport_type",
     *     in="query",
     *     description="type de rapport: ToutesInfos, BatieNonBatie, Proprietaire, SubdivisionFiscale, EmprisePosPlu, Locaux, ProprietaireLocaux",
     *     required=true,
     *     default="",
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="RapportsCadastreParcelle Response",
     *         @SWG\Schema(ref="#/definitions/rapportscadastreparcelle")
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

        /**
         * Tableau contenant les id_par des parcelles à utiliser
         * @type array
         */
        $aParcelles = explode("|", $this->aValues["parcelles"]);

        /**
         * Type de rapport
         * @type string
         */
        $rapportType = $this->aValues['rapport_type'];

        /**
         * Properties
         * @type array
         */
        $properties = $this->aProperties;

        /**
         * Objet BD
         * @type object
         */
        //$oBd = new BD($properties["cadastre"]["rp"]["login"], $properties["cadastre"]["rp"]["pass"], $properties["database"], $properties["server"], $properties["port"], $properties["sgbd"], $properties["page_encoding"]);

        /**
         * Returned array
         * @type array
         */
        $aReturn = Array();
        // Met à jour la connexion
        $oBd = $this->oConnection->oBd;
        //$oBd = new BD($properties["cadastre"]["rp"]["login"], $properties["cadastre"]["rp"]["pass"], $properties["database"], $properties["server"], $properties["port"], $properties["sgbd"], $properties["page_encoding"]);
        // Mémorise la date de début
        $iDebutPdf = (date("G") * 60) * 60 + (date("i") * 60) + date("s");
        $DebutPdf = date("G") . 'h ' . date("i") . 'min ' . date("s") . 's';

        // Récupère l'année
        $sYear = $this->vmapGet($this->aProperties['schema_majic'], 'v_vmap_annee', array('annee'), array(), array('limit' => 1))[0]['annee'];

        // Patch pour décoder les properties UTF-8 parce que les rapports sont générés en ISO
        if (is_array($properties["cadastre"]["fiche_urb"]["intersect"]["views"])) {
            $properties["cadastre"]["fiche_urb"]["intersect"]["views"] = $this->decodeUtf8Array($properties["cadastre"]["fiche_urb"]["intersect"]["views"]);
        }

        // Charge les données
        if ($rapportType != 'Locaux' && $rapportType != 'ProprietaireLocaux') {
            require_once(__DIR__ . "/../../class/majic_libV2/Mj_Compte_Communal_Parcelles.class.inc");
            $oRapport = new Mj_Compte_Communal_Parcelles($aParcelles, $oBd, $properties, "polygon");
        } else {
            require_once(__DIR__ . "/../../class/majic_libV2/Mj_Bati_Parcelles.class.inc");
            $oRapport = new Mj_Bati_Parcelles($aParcelles, $oBd, $properties);
        }

        if (!file_exists($properties["cadastre"]["rp"]["rp_dir"])) {
            mkdir($properties["cadastre"]["rp"]["rp_dir"]);
        }
        // Crée les dossiers correspondants
        if (!file_exists($properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear)) {
            @mkdir($properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear);
        }
        if (!file_exists($properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear . "/Rapport_Parcelle_" . $rapportType)) {
            @mkdir($properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear . "/Rapport_Parcelle_" . $rapportType);
        }
        // Crée les XML
        if ($oRapport->isError()) {
            http_response_code(500);
            writeToErrorLog('Erreur lors de l\'extraction des données avec la librairie majic : ' . $oRapport->sMessage);
            $aReturn['error']['errorMessage'] = "Erreur lors de la génération du rapport.";
            return json_encode($aReturn);
        } else {
            // Création du fichier XML.
            $sFile = hash('sha256', UniqFileName());

            $sXmlFileName = $properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear . "/Rapport_Parcelle_" . $rapportType . "/" . $sFile . ".xml";

            if ($rapportType === 'ToutesInfos') {
                $sXslFileName = __DIR__ . "/../../class/majic_libV2/xsl/Mj_Rapport.xsl";
            } else {
                $sXslFileName = __DIR__ . "/../../class/majic_libV2/xsl/Mj_Rapport_Parcelle_" . $rapportType . ".xsl";
            }
            if (!file_exists($sXmlFileName)) {
                $oRapport->asXMLFile("", $sXmlFileName, "Rapport_Parcelle", "UTF-8", "ISO-8859-1");
            }
        }

        // Crée les PDF et XSL
        if ($rapportType === 'ToutesInfos') {
            // Chemin vers le fichier
            $filePath = $properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear . "/Rapport_Parcelle_" . $rapportType . "/" . $sFile . ".pdf";
            if (!file_exists($filePath)) {

                // Pour faire du pdf
                $sPdfFileName = $properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear . "/Rapport_Parcelle_" . $rapportType . "/" . $sFile . ".pdf";

                // Création du fichier PDF.
                $sCommandLine = $properties["fop_root_dir"] . "/fop -xsl " . $sXslFileName . " -xml " . $sXmlFileName . " -pdf " . $sPdfFileName;
                exec($sCommandLine, $aCommand, $iResult);

                if ($iResult) {
                    http_response_code(500);
                    $aReturn['error']['errorMessage'] .= "Erreur lors de la génération du rapport.";
                    writeToErrorLog("Erreur lors de la génération d'un rapport au format PDF.");
                    writeToErrorLog("Ligne de commande : " . $sCommandLine);
                }
            }

            $downloadFilePath = $properties['web_server_name'] . '/' . $properties['services_alias'] . '/cadastreV2/downloadrapport?sYear=' . $sYear . '&sType=Rapport_Parcelle_' . $rapportType . '&sFileName=' . urlencode($sFile) . '.pdf';
        } else {

            // Pour faire de l'excel
            $sFileName = $properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear . "/Rapport_Parcelle_" . $rapportType . "/transform.xml";

            // Chemin vers le fichier
            $filePath = $properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear . "/Rapport_Parcelle_" . $rapportType . "/" . $sFile . ".xls";

            if (!file_exists($filePath)) {
                $doc = new DOMDocument();
                $xsl = new XSLTProcessor();
                if (file_exists($sXslFileName)) {
                    $doc->load($sXslFileName);
                    $xsl->importStyleSheet($doc);
                    $doc->load($sXmlFileName);
                    $oHandle = fopen($sFileName, 'w');
                    if ($oHandle == false) {
                        http_response_code(500);
                        $aReturn['error']['errorMessage'] .= "Impossible de créer le fichier " . $sFileName . ". Impossible de générer le rapport.";
                    } else {
                        fwrite($oHandle, $xsl->transformToXML($doc));
                        fclose($oHandle);
                        $sRapportCree = $properties["cadastre"]["rp"]["rp_dir"] . "/" . $sYear . "/Rapport_Parcelle_" . $rapportType . "/" . $sFile . ".xls";
                        // copie du fichier pour créer le fichier excel
                        if (!copy($sFileName, $sRapportCree)) {
                            http_response_code(500);
                            $aReturn['error']['errorMessage'] .= "La copie du fichier '" . $sFileName . "' vers '" . $sRapportCree . "' n'a pas réussi. Impossible de générer le rapport.";
                        }
                    }
                } else {
                    writeToErrorLog("Le fichier " . $sXslFileName . " n'existe pas.");
                }
            } else {
                $aReturn['data']['alreadyExists'] = true;
            }

            $downloadFilePath = $properties['web_server_name'] . '/' . $properties['services_alias'] . '/cadastreV2/downloadrapport?sYear=' . $sYear . '&sType=Rapport_Parcelle_' . $rapportType . '&sFileName=' . urlencode($sFile) . '.xls';
        }

        $iFinPdf = (date("G") * 60) * 60 + (date("i") * 60) + date("s");
        $FinPdf = date("G") . 'h ' . date("i") . 'min ' . date("s") . 's';

        $aReturn['data']['rapport'] = $downloadFilePath;
        $aReturn['data']['format'] = pathinfo($filePath, PATHINFO_EXTENSION);
        $aReturn['data']['debut'] = $DebutPdf;
        $aReturn['data']['fin'] = $FinPdf;
        $aReturn['data']['temps'] = $iFinPdf - $iDebutPdf . 's';

        return json_encode($aReturn);
    }

    /**
     * Fonction permettant de décoder un tableau multidimensionnel UTF8 en ISO.
     * /param $s Tableau à décoder.
     */
    function decodeUtf8Array($s) {
        if (is_array($s)) {
            $result = array();
            foreach ($s as $id => $value) {
                if (is_array($value))
                    $result[$id] = $this->decodeUtf8Array($value);
                else
                    $result[$id] = utf8_decode($value);
            }
            return $result;
        } else
            return $s;
    }

}

?>
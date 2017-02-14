<?php

require_once 'PrintTemplate.class.inc';
require_once 'PrintServices.class.inc';
require_once 'PrintMapServices.class.inc';
require_once __DIR__ . '/../vitis/Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

/**
 * \file printtemplateservices.class.inc
 * \class PrintTemplateServices
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 *  \brief This file contains the PrintTemplateServices php class
 *
 * This class defines the rest api for printtemplateservices
 * 
 */
class PrintTemplateServices extends PrintServices {
    /**
     * @SWG\Definition(
     *   definition="/printtemplateservices",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/printtemplateservices")
     *   }
     * )
     * * @SWG\Tag(
     *   name="printtemplateservices",
     *   description="Operations about printtemplateservices"
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function printtemplateservices($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
    }

    /**
     * @SWG\Post(path="/printtemplateservices",
     *   tags={"PrintServices"},
     *   summary="Creates a map print",
     *   description="Creates a map print",
     *   operationId="GET",
     *   produces={"application/json"},
     * @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="printtemplate_id",
     *     in="query",
     *     description="template to print out",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="maps_json",
     *     in="query",
     *     description="target + map_definition",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="includes_json",
     *     in="query",
     *     description="target + imageUrl|base64Image|html",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="scope_json",
     *     in="query",
     *     description="scope to incorpore",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="quality",
     *     in="query",
     *     description="image quality",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="PrintTemplateServices Response",
     *         @SWG\Schema(ref="#/definitions/printtemplateservices")
     *     )
     *  )
     */
    function POST() {

        $aReturn = Array();

        // Vérification des valeurs
        if (empty($this->aValues['printtemplate_id'])) {
            $aReturn['error']['errorMessage'] .= " printtemplate_id not defined";
            return json_encode($aReturn);
        }

        /**
         * Files to delete after print
         */
        $this->aFilesToDelete = array();

        /**
         * Logs to show
         */
        $this->aLogs = array();

        /**
         * Template id
         */
        $sTemplateId = $this->aValues['printtemplate_id'];

        $aPrintTemplate = $this->getPrintTemplate($sTemplateId);

        /**
         * 'A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'
         */
        $sFormat = $aPrintTemplate['rt_format_id'];

        /**
         * portrait/paysage
         */
        $sOrientation = $aPrintTemplate['rt_orientation_id'];

        /**
         * Declare where to include images and html definitions
         */
        $sJsonIncludes = $this->aValues['includes_json'];

        /**
         * Declare where to include maps
         */
        $sJsonMaps = $this->aValues['maps_json'];

        /**
         * JSON
         */
        $this->sJsonScope = $this->aValues['scope_json'];

        /**
         * API URL
         */
        $RestUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['services_alias'];

        /**
         * Token to use
         */
        $sToken = $this->aValues['token'];

        /**
         * Image quality
         */
        $sQuality = $this->aProperties['print']['quality'];

        /**
         * Path to the PhantomJS .exe
         */
        $sPhantomjsPath = $this->aProperties['phantomjs_root_path'];

        /**
         * Path to the .js
         */
        $sProjectPath = $this->aProperties['vas_home'] . '/util/printserver/server/printtemplate.js';

        /**
         * Path to the client
         */
        $sPrintClientrUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['printserver_alias'] . '/client/template/index.html';

        /**
         * The image name
         */
        $sFileName = 'impression_' . date("YmdHis", time()) . '_' . rand();

        /**
         * Path to the output file
         */
        $sOutputFile = $this->aProperties['vas_home'] . '/public/vmap/prints/' . $sFileName . '.pdf';

        /**
         * The image URL
         */
        $sImageUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['public_alias'] . '/vmap/prints/' . $sFileName . '.pdf';

        // Ajoute les images des cartes de $sJsonMaps à $sJsonIncludes
        $sJsonIncludes = $this->addMapsToIncludes($sJsonIncludes, $sJsonMaps);

        // EncodeUriComponent les définitions html
        $sJsonIncludes = $this->encodeHtmlIncludes($sJsonIncludes);

        // Écrit les paramètres gros dans des fichiers
        if (is_dir($this->aProperties['vas_home'])) {
            if (!is_dir($this->aProperties['vas_home'] . '/public')) {
                mkdir($this->aProperties['vas_home'] . '/public', 0777, true);
            }
            if (!is_dir($this->aProperties['vas_home'] . '/public/vmap')) {
                mkdir($this->aProperties['vas_home'] . '/public/vmap', 0777, true);
            }
            if (!is_dir($this->aProperties['vas_home'] . '/public/vmap/prints')) {
                mkdir($this->aProperties['vas_home'] . '/public/vmap/prints', 0777, true);
            }
        }
        $sIncludesPath = $this->writeToFile($this->aProperties['vas_home'] . '/public/vmap/prints', 'includes_' . $sFileName, $sJsonIncludes);
        $sScopePath = $this->writeToFile($this->aProperties['vas_home'] . '/public/vmap/prints', 'scope_' . $sFileName, $this->sJsonScope);

        // Arguments de la ligne de commande
        $aArguments = array($sProjectPath, $sPrintClientrUrl, $RestUrl, $sToken, $sOutputFile, $sTemplateId, $sFormat, $sOrientation, $sIncludesPath, $sScopePath, $sQuality);

        // Commande à lancer
        $sCommand = '"' . $sPhantomjsPath . '" --ignore-ssl-errors=true --ssl-protocol=any --web-security=false --local-to-remote-url-access=true';

        // Ajoute les argumants à a commande
        for ($i = 0; $i < count($aArguments); $i++) {
            $sCommand .= ' "' . $aArguments[$i] . '"';
        }

        // Ferme la session php (pour que phantomJS puisse faire des requetes Ajax avec ce token)
        session_write_close();

        $aCommand = array();
        exec($sCommand, $aCommand);

        for ($i = 0; $i < count($aCommand); $i++) {
            array_push($this->aLogs, $aCommand[$i]);
        }

        $aReturn['printtemplateservices']['image'] = $sImageUrl;
        $aReturn['printtemplateservices']['command'] = $sCommand;
        $aReturn['printtemplateservices']['logs'] = $this->aLogs;
        $aReturn['printtemplateservices']['result'] = $aCommand[count($aCommand) - 1];
        $aReturn['status'] = $aReturn['printtemplateservices']['result'] === "Done" ? 1 : 0;

        // Supprime les fichiers générés pendant l'impression
        $this->deleteFiles($this->aFilesToDelete);

        return json_encode($aReturn);
    }

    function getPrintTemplate($sPrintTemplateId) {

        $aValues = $this->aValues;
        $aPath = $this->aPath;
        $properties = $this->aProperties;
        $oConnection = $this->oConnection;

        $aPath[2] = $sPrintTemplateId;
        $aValues['my_vitis_id'] = $sPrintTemplateId;

        $aPrintTemplate = new PrintTemplate($aPath, $aValues, $properties, $oConnection);
        $aPrintTemplate->GET();

        return $aPrintTemplate->aFields;
    }

    /**
     * Encode the includes that use html definitions
     * @param string $sJsonIncludes
     * @return string
     */
    function encodeHtmlIncludes($sJsonIncludes) {

        $aIncludes = json_decode($sJsonIncludes, true);

        for ($i = 0; $i < count($aIncludes); $i++) {
            if (!empty($aIncludes[$i]['html'])) {
                $aIncludes[$i]['html'] = rawurlencode($aIncludes[$i]['html']);
            }
        }

        return json_encode($aIncludes);
    }

    /**
     * Effectue les impressions des cartes définies dans $sJsonMaps
     * et les ajoute à la défintion $sJsonIncludes
     * @param string $sJsonIncludes
     * @param string $sJsonMaps
     * reutn string
     */
    function addMapsToIncludes($sJsonIncludes, $sJsonMaps) {

        $aMapsDefinition = json_decode($sJsonMaps, true);
        $aIncludes = json_decode($sJsonIncludes, true);

        if (empty($aIncludes)) {
            $aIncludes = array();
        }

        $aMapIncludes = $this->getMapIncludes($aMapsDefinition);

        for ($i = 0; $i < count($aMapIncludes); $i++) {
            array_push($aIncludes, $aMapIncludes[$i]);
        }

        return json_encode($aIncludes);
    }

    /**
     * Effectue les impressions des cartes et retourne leur définition target/imageUrl
     * @param array $aMapsDefinition
     * @return array
     */
    function getMapIncludes($aMapsDefinition) {

        $aMapsIncludes = array();

        // Ajoute à $aMapsIncludes les définitions des cartes
        for ($i = 0; $i < count($aMapsDefinition); $i++) {

            if (empty($aMapsDefinition[$i]['target']))
                continue;
            if (empty($aMapsDefinition[$i]['map_definition']))
                continue;

            // Cas ou map_json soit un objet au lieu d'une chaine
            if (!empty($aMapsDefinition[$i]['map_definition']['map_json'])) {
                if (gettype($aMapsDefinition[$i]['map_definition']['map_json']) == 'array' || gettype($aMapsDefinition[$i]['map_definition']['map_json']) == 'object') {
                    $aMapsDefinition[$i]['map_definition']['map_json'] = json_encode($aMapsDefinition[$i]['map_definition']['map_json']);
                }
            }

            $oTmpMapPrint = new PrintMapServices($this->aPath, $aMapsDefinition[$i]['map_definition'], $this->aProperties);
            $sTmpMapPrintResult = $oTmpMapPrint->POST();

            array_push($this->aLogs, $sTmpMapPrintResult);

            // Ajoute la définition si tout est ok
            if (!empty($sTmpMapPrintResult)) {

                $oTmpMapPrintResult = json_decode($sTmpMapPrintResult);

                if ($oTmpMapPrintResult->status == 1) {
                    if (!empty($oTmpMapPrintResult->printmapservices->image)) {

                        $oMapInclude = array(
                            'target' => $aMapsDefinition[$i]['target'],
                            'imageUrl' => $oTmpMapPrintResult->printmapservices->image
                        );

                        if ($oTmpMapPrintResult->printmapservices->scale !== null && $aMapsDefinition[$i]['target'] == '#map_image') {
                            $this->setMapScale($oTmpMapPrintResult->printmapservices->scale);
                        }

                        array_push($aMapsIncludes, $oMapInclude);
                        array_push($this->aFilesToDelete, $oTmpMapPrintResult->printmapservices->imagePath);
                    }
                }
            }

            unset($oMapInclude);
            unset($oTmpMapPrint);
            unset($sTmpMapPrintResult);
        }

        return $aMapsIncludes;
    }

    /**
     * Set the map scale in the JsonScope if JsonScope.map_scale is NaN
     * @param string $sScale
     */
    function setMapScale($sScale) {

        $aJsonScope = json_decode($this->sJsonScope, true);

        $aJsonScope['map_scale'] = $sScale;

        $this->sJsonScope = json_encode($aJsonScope);
    }

}

?>
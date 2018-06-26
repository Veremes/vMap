<?php

require_once 'PrintServices.class.inc';
require_once 'PrintReports.class.inc';
require_once 'Querys.class.inc';
require_once 'PrintMapServices.class.inc';
require_once __DIR__ . '/../vitis/Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';
require_once __DIR__ . '/../../class/vmlib/phpUtil.inc';

/**
 * \file printreportservices.class.inc
 * \class PrintReportServices
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 *  \brief This file contains the PrintReportServices php class
 *
 * This class defines the rest api for printreportservices
 * 
 */
class PrintReportServices extends PrintServices {
    /**
     * @SWG\Definition(
     *   definition="/printreportservices",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/printreportservices")
     *   }
     * )
     * * @SWG\Tag(
     *   name="printreportservices",
     *   description="Operations about printreportservices"
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
     * @SWG\Post(path="/printreportservices",
     *   tags={"PrintServices"},
     *   summary="Creates a map print",
     *   description="Creates a map print",
     *   operationId="POST",
     *   produces={"application/json"},
     * @SWG\Parameter(
     *     name="token",
     *     in="formData",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="printreport_id",
     *     in="formData",
     *     description="report to print out",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="ids",
     *     in="formData",
     *     description="id(s) of the business object element(s) to use in the scope",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="scope_json",
     *     in="formData",
     *     description="scope to incorpore",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="includes_json",
     *     in="formData",
     *     description="files to include",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="quality",
     *     in="formData",
     *     description="image quality",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="PrintReportServices Response",
     *         @SWG\Schema(ref="#/definitions/printreportservices")
     *     )
     *  )
     */
    function POST() {

        $this->aReturn = Array();

        // Vérification des valeurs
        if (empty($this->aValues['printreport_id'])) {
            $this->aReturn['error']['errorMessage'] .= " printreport_id not defined";
            return json_encode($this->aReturn);
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
         * Report id
         */
        $this->sReportId = $this->aValues['printreport_id'];

        /**
         * ids
         */
        $this->aIds = explode('|', $this->aValues['ids']);

        /**
         * JSON
         */
        $this->sJsonScope = $this->aValues['scope_json'];

        /**
         * API URL
         */
        $this->sRestUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['services_alias'];

        /**
         * Declare where to include images and html definitions
         */
        $this->sJsonIncludes = $this->aValues['includes_json'];

        /**
         * Token to use
         */
        $this->sToken = $this->aValues['token'];

        /**
         * Image quality
         */
        $this->sQuality = $this->aProperties['print']['quality'];

        /**
         * Path to the PhantomJS .exe
         */
        $this->sPhantomjsPath = $this->aProperties['phantomjs_root_path'];

        /**
         * Path to the .js
         */
        $this->sProjectPath = $this->aProperties['vas_home'] . '/util/printserver/server/printreport.js';

        /**
         * Path to the client
         */
        $this->sPrintClientrUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['printserver_alias'] . '/client/report/index.html';

        /**
         * The image name
         */
        $this->sFileName = 'rapport_' . date("YmdHis", time()) . '_' . rand();

        // Effectue la requête permettant de récupérer les infos sur le printreport
        $aPrintReport = $this->getPrintReport($this->sReportId);

        $this->sOrientation = $aPrintReport['rt_orientation_id'];

        $this->sFormat = $aPrintReport['rt_format_id'];

        $this->sOutputFormat = $aPrintReport['outputformats_id'];

        $this->bMultiObject = $aPrintReport['multiobject'];

        $this->sBusinessObjectId = $aPrintReport['business_object_id'];

        $this->sIdField = $aPrintReport['business_object_id_field'];

        $this->sGeomColumn = $aPrintReport['business_object_geom_column'];

        $this->sJsonObjects = $aPrintReport['jsonobjects'];

        $this->sHtmlDef = $aPrintReport['htmldefinition'];

        // En cas de simple objet, mais plusieurs id
        if (!$this->bMultiObject && count($this->aIds) > 1) {
            // Génère un rapport pour chaque identifiant
            return $this->generateManyReports();
        }

        if ($this->sOutputFormat === 'pdf') {

            $this->sFileDirectory = $this->aProperties['vas_home'] . '/public/vmap/prints';

            $this->sOutputFile = $this->sFileDirectory . '/' . $this->sFileName . '.pdf';

            $this->sFileUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['public_alias'] . '/vmap/prints/' . $this->sFileName . '.pdf';

            $this->sFilePath = $this->sOutputFile;
        } else if ($this->sOutputFormat === 'doc') {

            // Si format doc, alors création d'un dossier qui sera zippé
            mkdir($this->aProperties['vas_home'] . '/public/vmap/prints/' . $this->sFileName);

            $this->sFileDirectory = $this->aProperties['vas_home'] . '/public/vmap/prints/' . $this->sFileName;

            $this->sOutputFile = $this->sFileDirectory . '/' . $this->sFileName . '.doc';

            $this->sFileUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['public_alias'] . '/vmap/prints/' . $this->sFileName . '/' . $this->sFileName . '.doc';

            $this->sFilePath = $this->sOutputFile;
        }

        // Effectue la requête permettant de récupérer les infos des objets séléctionnés
        $this->aQuerys = $this->getQuerys($this->aIds);

        // Ajoute le résultat de getQuerys au scope
        $this->addToScope('BO', $this->aQuerys);

        // Rrécupère les features contenues dans querys
        $this->sFeatures = $this->getEWKTFeatures($this->aQuerys);

        // Ajoute les images des cartes de sJsonObjects à $this->sJsonIncludes
        $this->sJsonIncludes = $this->addJsonIncludes($this->sJsonIncludes, $this->sJsonObjects);

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
        $sIncludesPath = $this->writeToFile($this->aProperties['vas_home'] . '/public/vmap/prints', 'includes_' . $this->sFileName, $this->sJsonIncludes);
        $sScopePath = $this->writeToFile($this->aProperties['vas_home'] . '/public/vmap/prints', 'scope_' . $this->sFileName, $this->sJsonScope);

        // Arguments de la ligne de commande
        $aArguments = array($this->sProjectPath, $this->sPrintClientrUrl, $this->sRestUrl, $this->sToken, $this->sOutputFile, $this->sReportId, $this->sFormat, $this->sOrientation, $this->sOutputFormat, $sIncludesPath, $sScopePath, $this->sQuality);

        // Commande à lancer
        $sCommand = '"' . $this->sPhantomjsPath . '" --ignore-ssl-errors=true --ssl-protocol=any --web-security=false --local-to-remote-url-access=true';

        // Ajoute les arguments à a commande
        for ($i = 0; $i < count($aArguments); $i++) {
            $sCommand .= ' "' . $aArguments[$i] . '"';
        }

        session_write_close();

        $aCommand = array();
        exec($sCommand, $aCommand);

        for ($i = 0; $i < count($aCommand); $i++) {
            array_push($this->aLogs, $aCommand[$i]);
        }

        $this->oConnection = new Connection($this->aValues, $this->aProperties);

        if ($this->sOutputFormat === 'doc') {
            // Crée l'arboresance de retour au format zip si plusieurs fichiers
            $this->zipFileDirectory();
        }

        // Supprime les fichiers générés pendant l'impression
        $this->deleteFiles($this->aFilesToDelete);

        $this->aReturn['printreportservices']['fileurl'] = $this->sFileUrl;
        $this->aReturn['printreportservices']['filepath'] = $this->sFilePath;
        $this->aReturn['printreportservices']['command'] = $sCommand;
        $this->aReturn['printreportservices']['logs'] = $this->aLogs;
        $this->aReturn['printreportservices']['result'] = $aCommand[count($aCommand) - 1];
        $this->aReturn['status'] = $this->aReturn['printreportservices']['result'] === "Done" ? 1 : 0;

        return json_encode($this->aReturn);
    }

    /**
     * Get the print report def
     * @param string $printRportId
     * @return array
     */
    function getPrintReport($printRportId) {

        $aValues = $this->aValues;
        $aPath = $this->aPath;
        $properties = $this->aProperties;
        $oConnection = $this->oConnection;

        $aPath[2] = $printRportId;
        $aValues['my_vitis_id'] = $printRportId;

        $oPrintReport = new PrintReport($aPath, $aValues, $properties, $oConnection);
        $oPrintReport->GET();

        return $oPrintReport->aFields;
    }

    /**
     * Query the objects and return the result
     * @param array $aIds
     * @return array
     */
    function getQuerys($aIds) {

        $aQuerys = array();

        $aValues = $this->aValues;
        $aPath = $this->aPath;
        $properties = $this->aProperties;

        $aFilter = array(
            'relation' => 'OR',
            'operators' => array()
        );
        for ($i = 0; $i < count($aIds); $i++) {
            array_push($aFilter['operators'], array('column' => $this->sIdField, 'compare_operator' => '=', 'value' => $aIds[$i]));
        }
        $sFilter = json_encode($aFilter);
//        for ($i = 0; $i < count($aIds); $i++) {
//            if ($i > 0) {
//                $sFilter .= ' OR ';
//            }
//            $sFilter .= '("' . $this->sIdField . '"= \'' . $aIds[$i] . '\')';
//        }

        $aPath[2] = $this->sBusinessObjectId;

        $aValues['get_geom'] = 'true';
        $aValues['filter'] = $sFilter;
        $aValues['my_vitis_id'] = $this->sBusinessObjectId;

        $oQuerys = new Querys($aPath, $aValues, $properties);
        $oQuerys->GET();

        for ($i = 0; $i < count($oQuerys->aObjects); $i++) {
            array_push($aQuerys, $oQuerys->aObjects[$i]->aFields);
        }
        return $aQuerys;
    }

    /**
     * Add $aQuerys to $this->sJsonScope
     * @param string $sType
     * @param array $aQuerys
     */
    function addToScope($sType, $aQuerys) {

        $aJsonScope = json_decode($this->sJsonScope, true);

        if ($sType === 'BO') {
            if ($this->bMultiObject) {
                $aJsonScope['BO'] = $aQuerys;
            } else {
                $aJsonScope['BO'] = $aQuerys[0];
            }
        }

        $this->sJsonScope = json_encode($aJsonScope);
    }

    /**
     * Get the features separed by "|" from $aQuerys
     * @param array $aQuerys
     * @return string
     */
    function getEWKTFeatures($aQuerys) {
        $sFeatures = '';
        for ($i = 0; $i < count($aQuerys); $i++) {
            if (!empty($aQuerys[$i][$this->sGeomColumn])) {
                if ($sFeatures != '') {
                    $sFeatures .= '|';
                }
                $sFeatures .= $aQuerys[$i][$this->sGeomColumn];
            }
        }
        return $sFeatures;
    }

    /**
     * Add to the $sJsonIncludes the elements defined in $sJsonObjects
     * @param string $sJsonIncludes
     * @param string $sJsonObjects
     * @return string
     */
    function addJsonIncludes($sJsonIncludes, $sJsonObjects) {

        $aJsonObjects = json_decode($sJsonObjects, true);
        $aIncludes = json_decode($sJsonIncludes, true);
        $aJsonScope = json_decode($this->sJsonScope, true);

        if (!empty($sJsonObjects) && !is_array($aJsonObjects)) {
            $this->aReturn['error']['errorMessage'] = "JsonObjects has not a valid JSON definition";
        }

        if (empty($aIncludes)) {
            $aIncludes = array();
        }

        // Valeurs par défaut
        $date = getdate();
        $aJsonScope['date'] = $date['mday'] . '/' . $date['mon'] . '/' . $date['year'];

        for ($i = 0; $i < count($aJsonObjects); $i++) {
            // Type Carte
            if ($aJsonObjects[$i]['type'] === 'map') {

                $aMapDefinition = array();
                $aMapDefinition['token'] = $this->sToken;

                if (isset($aJsonObjects[$i]['target'])) {
                    $sTarget = $aJsonObjects[$i]['target'];
                } else {
                    $this->aReturn['error']['errorMessage'] .= "JsonObjects: target not defined";
                }

                $sImageSize = $this->getTargetSize($sTarget);

                if (isset($aJsonObjects[$i]['map_id'])) {
                    $aMapDefinition['map_id'] = $aJsonObjects[$i]['map_id'];
                } else {
                    $this->aReturn['error']['errorMessage'] = "JsonObjects: map_id not defined";
                }

                if (!empty($sImageSize) && $sImageSize != null) {
                    $aMapDefinition['image_size'] = $sImageSize;
                } else {
                    $this->aReturn['error']['errorMessage'] = "JsonObjects: can't get the image size map_id: " . $aJsonObjects[$i]['map_id'];
                }

                if (!empty($this->sFeatures)) {
                    $aMapDefinition['features'] = $this->sFeatures;
                }

                if (isset($aJsonObjects[$i]['resolution_coeff'])) {
                    $aMapDefinition['resolution_coeff'] = $aJsonObjects[$i]['resolution_coeff'];
                }
                if (isset($aJsonObjects[$i]['scale_target'])) {
                    $aMapDefinition['scale_target'] = $aJsonObjects[$i]['scale_target'];
                }
                if (isset($aJsonObjects[$i]['features_zoom'])) {
                    $aMapDefinition['features_zoom'] = $aJsonObjects[$i]['features_zoom'];
                }

                $aMapPrintResult = $this->printMapImage($aMapDefinition);

                $this->oConnection = new Connection($this->aValues, $this->aProperties);

                if (!empty($aMapPrintResult['printmapservices'])) {
                    // Échelle
                    if (!empty($aMapDefinition['scale_target']) && !empty($aMapPrintResult['printmapservices']['scale'])) {
                        $aJsonScope[$aMapDefinition['scale_target']] = $aMapPrintResult['printmapservices']['scale'];
                    }
                    // Image
                    if ($this->sOutputFormat === 'pdf') {
                        if (!empty($aMapPrintResult['printmapservices']['imagePath'])) {
                            array_push($this->aFilesToDelete, $aMapPrintResult['printmapservices']['imagePath']);
                        }
                        if ($aMapPrintResult['status'] == 1 && !empty($aMapPrintResult['printmapservices']['image'])) {
                            $sImageUrl = $aMapPrintResult['printmapservices']['image'];
                        }
                    }
                    if ($this->sOutputFormat === 'doc') {
                        if ($aMapPrintResult['status'] == 1 && !empty($aMapPrintResult['printmapservices']['imagePath'])) {
                            $sFileName = basename($aMapPrintResult['printmapservices']['imagePath']);
                            // Copie l'image dans le dossier
                            copy($aMapPrintResult['printmapservices']['imagePath'], $this->sFileDirectory . '/' . $sFileName);
                            // Ajoute l'image de base à la liste des fichiers à supprimer
                            array_push($this->aFilesToDelete, $aMapPrintResult['printmapservices']['imagePath']);
                            $sImageUrl = $sFileName;
                        }
                    }
                }

                if (isset($sImageUrl)) {
                    array_push($aIncludes, array(
                        'target' => $sTarget,
                        'imageUrl' => $sImageUrl
                    ));
                }
            }
            // Type Webservice
            if ($aJsonObjects[$i]['type'] === 'webservice') {

                if (!isset($aJsonObjects[$i]['ressource'])) {
                    $this->aReturn['error']['errorMessage'] = "JsonObjects type webservice: ressource not defined";
                    continue;
                }
                if (!isset($aJsonObjects[$i]['target'])) {
                    $this->aReturn['error']['errorMessage'] = "JsonObjects type webservice: target not defined";
                    continue;
                }

                // Regarde si il y a un id dans la ressource et stoque son identifiant dans $sIdIndex
                $aTmp = explode('/', $aJsonObjects[$i]['ressource']);
                for ($ii = count($aTmp); $ii >= 0; $ii--) {
                    if (is_numeric(strpos($aTmp[$ii], '{'))) {
                        if (is_numeric(strpos($aTmp[$ii], '}', strpos($aTmp[$ii], '{')))) {
                            $sIdIndex = $ii;
                        }
                    }
                }

                // Regarde si il y a des valeurs entre {...} à changer
                $aJsonObjects[$i]['ressource'] = $this->replaceStringValueByScope($aJsonObjects[$i]['ressource']);

                // aPath
                $aPath = explode('/', $aJsonObjects[$i]['ressource']);

                // Identifiant
                $sId = '';
                if (isset($sIdIndex)) {
                    $sId = $aPath[$sIdIndex];
                }

                // $aParams
                if (isset($aJsonObjects[$i]['params'])) {
                    if (is_array($aJsonObjects[$i]['params'])) {
                        $aParams = $aJsonObjects[$i]['params'];
                        // Vérifie si il y a des valeurs entre {...} à changer
                        $aParams = $this->replaceArrayValueByScope($aParams);
                    }
                }

                $aQueryResult = $this->queryRessource($aPath, $aParams, $sId);                
                $aJsonScope[$aJsonObjects[$i]['target']] = $aQueryResult;
            }
            // Type Objet
            if ($aJsonObjects[$i]['type'] === 'object') {

                if (!isset($aJsonObjects[$i]['target'])) {
                    $this->aReturn['error']['errorMessage'] = "JsonObjects type object: target not defined";
                    continue;
                }
                if (!isset($aJsonObjects[$i]['content'])) {
                    $this->aReturn['error']['errorMessage'] = "JsonObjects type object: content not defined";
                    continue;
                }
                if (!is_array($aJsonObjects[$i]['content'])) {
                    $this->aReturn['error']['errorMessage'] = "JsonObjects type object: content not an object";
                    continue;
                }

                $aJsonScope[$aJsonObjects[$i]['target']] = $aJsonObjects[$i]['content'];
            }
            // Type Image
            if ($aJsonObjects[$i]['type'] === 'image') {

                if (!isset($aJsonObjects[$i]['imageUrl'])) {
                    $this->aReturn['error']['errorMessage'] = "JsonObjects type image: imageUrl not defined";
                    continue;
                }
                if (!isset($aJsonObjects[$i]['target'])) {
                    $this->aReturn['error']['errorMessage'] = "JsonObjects type image: target not defined";
                    continue;
                }

                $sFileName = $aJsonObjects[$i]['imageUrl'];

                // Sauvvegarde l'image au format png pour faire le lien en cas de .doc
                if ($this->sOutputFormat === 'doc') {
                    $sFileName = 'image_' . $i . '.png';
                    $sOutputFile = $this->sFileDirectory . '/' . $sFileName;
                    $this->saveImage($aJsonObjects[$i]['imageUrl'], $sOutputFile);
                }

                array_push($aIncludes, array(
                    'target' => $aJsonObjects[$i]['target'],
                    'imageUrl' => $sFileName
                ));
            }
        }

        $this->sJsonScope = json_encode($aJsonScope, true);
        return json_encode($aIncludes);
    }

    /**
     * Replace the {...} values by the scope value
     * @param string $sString
     * @return string
     */
    function replaceStringValueByScope($sString) {
        $aJsonScope = json_decode($this->sJsonScope, true);

        $sReplaceChain = '';
        if (is_numeric(strpos($sString, '{{'))) {
            if (is_numeric(strpos($sString, '}}', strpos($sString, '{{')))) {
                $sReplaceChain = substr($sString, strpos($sString, '{{') + 2, strpos($sString, '}}') - strpos($sString, '{{') - 2);
            } else {
                return $sString;
            }
        } else {
            return $sString;
        }

        // Mots clés
        if ($sReplaceChain === 'id') {
            $sReplaceValue = $this->aIds[0];
        } else if ($sReplaceChain === 'ids') {
            $sReplaceValue = implode('|', $this->aIds);
        } else if ($sReplaceChain === "'ids'") {
            $sReplaceValue = "";
            for ($i = 0; $i < count($this->aIds); $i++) {
                if ($i > 0) {
                    $sReplaceValue .= ",";
                }
                $sReplaceValue .= "'" . $this->aIds[$i] . "'";
            }
        }

        // Récupère la valeur de l'identifiant dans $aJsonObjects
        if ($sReplaceChain !== '') {
            $aReplaceChain = explode('.', $sReplaceChain);

            if (isset($aJsonScope[$aReplaceChain[0]])) {
                if (!empty($aJsonScope[$aReplaceChain[0]][$aReplaceChain[1]])) {
                    $sReplaceValue = $aJsonScope[$aReplaceChain[0]][$aReplaceChain[1]];
                }
            }
        }

        $sString = str_replace('{{' . $sReplaceChain . '}}', $sReplaceValue, $sString);

        // Récursive si il en reste encore
        if (strpos($sString, '{{') > 0) {
            if (strpos($sString, '}}', strpos($sString, '{{')) > 1) {
                return $this->replaceStringValueByScope($sString);
            }
        }

        return $sString;
    }

    /**
     * Replace the {...} values by the scope value
     * @param array $aArray
     * @return array
     */
    function replaceArrayValueByScope($aArray) {
        foreach ($aArray as $key => $value) {
            if (is_string($value)) {
                $aArray[$key] = $this->replaceStringValueByScope($value);
            }
            if (is_array($value)) {
                // Récursive si il s'agit d'un tableau imbriqué
                $aArray[$key] = $this->replaceArrayValueByScope($value);
            }
        }
        return $aArray;
    }

    /**
     * Get a template target size using PhantomJS
     * @param string $sTarget
     * @return string
     */
    function getTargetSize($sTarget) {

        session_write_close();

        $sTargetSize = null;

        // Chemin du fichier PhantonJS
        $sProjectPath = $this->aProperties['vas_home'] . '/util/printserver/server/targetsize.js';

        // Arguments de la ligne de commande
        $aArguments = array($sProjectPath, $this->sPrintClientrUrl, $this->sRestUrl, $this->sToken, $this->sReportId, $this->sFormat, $this->sOrientation, $sTarget);

        // Commande à lancer
        $sCommand = '"' . $this->sPhantomjsPath . '" --ignore-ssl-errors=true --ssl-protocol=any --web-security=false --local-to-remote-url-access=true';

        // Ajoute les argumants à a commande
        for ($i = 0; $i < count($aArguments); $i++) {
            $sCommand .= ' "' . $aArguments[$i] . '"';
        }

        $aCommand = array();
        exec($sCommand, $aCommand);

        if (substr($aCommand[count($aCommand) - 1], 0, 4) == 'Done') {
            $sTargetSize = substr($aCommand[count($aCommand) - 1], 6);
        }
        $this->oConnection = new Connection($this->aValues, $this->aProperties);

        return $sTargetSize;
    }

    /**
     * Save the image set on the given sImageUrl on the given sOutputFile
     * @param string $sImageUrl
     * @param string $sOutputFile
     */
    function saveImage($sImageUrl, $sOutputFile) {

        // Chemin du fichier PhantonJS
        $sProjectPath = $this->aProperties['vas_home'] . '/util/printserver/server/saveimage.js';

        // Arguments de la ligne de commande
        $aArguments = array($sProjectPath, $sImageUrl, $sOutputFile);

        // Commande à lancer
        $sCommand = '"' . $this->sPhantomjsPath . '" --ignore-ssl-errors=true --ssl-protocol=any --web-security=false --local-to-remote-url-access=true';

        // Ajoute les argumants à a commande
        for ($i = 0; $i < count($aArguments); $i++) {
            $sCommand .= ' "' . $aArguments[$i] . '"';
        }

        $aCommand = array();
        exec($sCommand, $aCommand);
    }

    /**
     * Print a map and return the definition
     * @param array $aMapDefinition
     * @return string image url
     */
    function printMapImage($aMapDefinition) {

        session_write_close();

        $oMapPrint = new PrintMapServices($this->aPath, $aMapDefinition, $this->aProperties);
        $sMapPrintResult = $oMapPrint->POST();
        array_push($this->aLogs, $sMapPrintResult);
        $aMapPrintResult = json_decode($sMapPrintResult, true);

        return $aMapPrintResult;
    }

    /**
     * Query a webservice ressource
     * @param array $aPath
     * @param array $aParams
     * @param string $sId
     */
    function queryRessource($aPath, $aParams = array(), $sId = "") {

        $sWebService = $aPath[0];
        $sRessource = $aPath[1];

        // Vérifie que le webservice existe
        if (!is_dir(__DIR__ . '/../' . $sWebService)) {
            $this->aReturn['error']['errorMessage'] = ' Webservice ' . $sWebService . ' does not exists';
            return null;
        }

        // Trouve le nom du fichier correspondant à la ressource
        $aFiles = scandir(__DIR__ . '/../' . $sWebService);

        for ($i = 0; $i < count($aFiles); $i++) {
            if (strtolower($aFiles[$i]) === $sRessource . '.class.inc') {
                $sClassName = substr($aFiles[$i], 0, strpos($aFiles[$i], '.class.inc'));
            }
        }

        if (!isset($sClassName)) {
            $this->aReturn['error']['errorMessage'] = ' Ressource ' . $sRessource . ' does not exists in the webservice ' . $sWebService . '';
            return null;
        }

        // Vérifie que la ressource existe
        if (!is_file(__DIR__ . '/../' . $sWebService . '/' . $sClassName . '.class.inc')) {
            $this->aReturn['error']['errorMessage'] = ' unable to find file ' . $sWebService . '/' . $sClassName . '.class.inc';
            return null;
        }

        require_once __DIR__ . '/../' . $sWebService . '/' . $sClassName . '.class.inc';

        $aValues = $this->aValues;
        unset($aValues['printreport_id']);
        unset($aValues['ids']);
        unset($aValues['module']);
        if (!empty($sId)) {
            $aValues['my_vitis_id'] = $sId;
        }
        if (count($aParams) > 0) {
            foreach ($aParams as $key => $value) {
                $aValues[$key] = $value;
            }
        }

        $oRessource = new $sClassName($aPath, $aValues, $this->aProperties, $this->oConnection);
        $oRessource->GET();

        $aQuery = array();

        // Objet simple
        if (isset($oRessource->aFields)) {
            $aQuery = $oRessource->aFields;
        }
        // Objet multiple
        if (isset($oRessource->aObjects)) {
            for ($i = 0; $i < count($oRessource->aObjects); $i++) {
                array_push($aQuery, $oRessource->aObjects[$i]->aFields);
            }
        }

        return $aQuery;
    }

    /**
     * Create zip by $this->sFileDirectory
     * If only one file is found inside $this->sFileDirectory, the directory will be deleted and the file copied on the parent's
     * The one or more files are already zipped, the function will unzip them: we don't want a zip inside an other zip
     * and the file copied on the vmap/prints folder
     */
    function zipFileDirectory() {
        $aScanedFiles = scandir($this->sFileDirectory);
        $aFiles = array();

        for ($i = 0; $i < count($aScanedFiles); $i++) {
            if ($aScanedFiles[$i] != '.' && $aScanedFiles[$i] != '..') {
                array_push($aFiles, $aScanedFiles[$i]);
            }
        }

        // Si il y a plus d'un fichier, crée un zip qui sera donné en sortie
        if (count($aFiles) > 1) {

            // Dézippe les fihiers zippés (on ne ve pas un zip dans un zip)
            for ($i = 0; $i < count($aFiles); $i++) {
                $ext = pathinfo($aFiles[$i], PATHINFO_EXTENSION);
                $dir = pathinfo($aFiles[$i], PATHINFO_BASENAME);
                $sFile = pathinfo($aFiles[$i], PATHINFO_FILENAME);

                if ($ext == 'zip') {

                    unZip($this->sFileDirectory . '/' . $sFile . '.zip', $this->sFileDirectory . '/' . $sFile);

                    // Supprime le fichier zippé
                    unlink($this->sFileDirectory . '/' . $sFile . '.zip');
                }
            }

            $test = createZip($this->sFileDirectory, $this->sFileDirectory . '.zip');
            $this->sFileUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['public_alias'] . '/vmap/prints/' . $this->sFileName . '.zip';
            $this->sFilePath = $this->sFileDirectory . '.zip';

            // Ajoute aux fichiers à supprimer le dossier crée
            array_push($this->aFilesToDelete, $this->sFileDirectory);
        } else {

            // Copie le fichier dans le fichier au dessus (car pas besoin de zip)
            copy($this->sFileDirectory . '/' . $this->sFileName . '.' . $this->sOutputFormat, $this->sFileDirectory . '.' . $this->sOutputFormat);

            $this->sFileUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['public_alias'] . '/vmap/prints/' . $this->sFileName . '.' . $this->sOutputFormat;
            $this->sFilePath = $this->sFileDirectory . '.' . $this->sOutputFormat;

            // Ajoute aux fichiers à supprimer le dossier crée
            array_push($this->aFilesToDelete, $this->sFileDirectory);
        }
    }

    /**
     * Function that calls this->POST for each id in aValues['ids']
     * @return string
     */
    function generateManyReports() {

        $aValues = $this->aValues;
        $aPath = $this->aPath;

        $this->aReturn['printreportservices'] = array();
        $this->aReturn['printreportservices']['printreports'] = array();
        $this->aReturn['printreportservices']['result'] = 'Done';

        // Crée un dossier dans lequel placer les fichiers
        mkdir($this->aProperties['vas_home'] . '/public/vmap/prints/' . $this->sFileName);
        $this->sFileDirectory = $this->aProperties['vas_home'] . '/public/vmap/prints/' . $this->sFileName;

        // Génère les fichiers
        for ($i = 0; $i < count($this->aIds); $i++) {

            $aValues['ids'] = $this->aIds[$i];

            $oPrintReport = new PrintReportServices($aPath, $aValues, $this->aProperties);
            $oPrintReportResult = json_decode($oPrintReport->POST(), true);

            if (isset($oPrintReportResult['printreportservices'])) {
                if (isset($oPrintReportResult['printreportservices']['filepath'])) {

                    // Ajoute le résultat dans printreportservices.printreports
                    array_push($this->aReturn['printreportservices']['printreports'], $oPrintReportResult['printreportservices']);

                    // Copie l'image dans le dossier et l'ajoute à la liste des fichiers à supprimer
                    $sGeneratedFile = $oPrintReportResult['printreportservices']['filepath'];

                    $sGeneratedFileExt = pathinfo($sGeneratedFile, PATHINFO_EXTENSION);

                    copy($sGeneratedFile, $this->sFileDirectory . '/' . $this->aIds[$i] . '.' . $sGeneratedFileExt);
                    array_push($this->aFilesToDelete, $sGeneratedFile);

                    // Dit si tout c'est bien passé
                    if ($oPrintReportResult['printreportservices']['result'] !== "Done") {
                        $this->aReturn['printreportservices']['result'] .= " Error with id:" . $this->aIds[$i];
                    }
                }
            }
        }
        // Crée l'arboresance de retour au format zip si plusieurs fichiers
        $this->zipFileDirectory();

        // Supprime les fichiers générés pendant l'impression
        $this->deleteFiles($this->aFilesToDelete);
        // Valeurs retour
        $this->aReturn['printreportservices']['fileurl'] = $this->sFileUrl;
        $this->aReturn['status'] = $this->aReturn['printreportservices']['result'] === "Done" ? 1 : 0;

        return json_encode($this->aReturn);
    }

}

?>
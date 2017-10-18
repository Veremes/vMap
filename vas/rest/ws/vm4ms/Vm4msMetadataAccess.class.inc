<?php

/**
 * \file Vm4msMetadataAccess.class.inc
 * \brief Vm4msMetadataAccess.class.inc \n \n Ce fichier contient la classe php Vm4msMetadataAccess.
 */
class Vm4msMetadataAccess {

    /**
     * Base de donnée liée.
     */
    var $oBd;

    /**
     * Nom de l'utilisateur courant.
     */
    var $sLogin;

    /**
     * Mot de passe de l'utilisateur courant.
     */
    var $sPassword;

    /**
     * Identifiant de la session PHP.
     */
    var $sSID;

    /**
     * Tableau contenant les paramètres de configuration de l'application.
     */
    var $aProperties;

    /**
     * Fichier contenant les requêtes SQL.
     */
    var $sSQLFile = 'Vm4msMetadataAccess.sql.inc';

    /**
     * Tableau des requêtes sql utilisées par la classe.
     */
    var $aSql;

    /**
     * Test d'une couche ou d'un flux.
     */
    var $bTestMode = false;

    /**
     * Définition d'une connexion. // vm4ms_public
     */
    var $sConnectionDefinition = '
    CONNECTIONTYPE postgis
    CONNECTION "user={CONNECTION_LOGIN} password={CONNECTION_PASSWORD} dbname={CONNECTION_DATABASE} host={CONNECTION_SERVER} port={CONNECTION_PORT}"
    ';

    /**
     * \param $oBd Base de données liée.
     * \param $sLogin Identifiant de l'utilisateur en cours.
     * \param $sPassword Mot de passe de l'utilisateur en cours.
     * \param $sSID Identifiant de la session PHP en cours.
     * \param $properties Tableau contenant les paramètres de configuration de l'application.
     */
    function __construct($oBd, $sLogin, $sPassword, $sSID, $properties) {
        $this->oBd = $oBd;
        $this->sLogin = $sLogin;
        $this->sPassword = $sPassword;
        $this->sSID = $sSID;
        $this->aProperties = $properties;
        include $this->sSQLFile;
        $this->aSql = $aSql[$oBd->sgbd];
        // Création des répertoires pour les flux WMS + dossier temporaire pour MapServer.
        $aWmsDir = array('wms_test', 'wms_public', 'wms_private', 'tmp', 'proj');
        foreach ($aWmsDir as $sWmsDir) {
            $sWmsDir = $this->aProperties["map_dir"] . '/' . $sWmsDir;
            if (!is_dir($sWmsDir))
                mkdir($sWmsDir, 0777);
        }
        // Création des dossiers de logs pour MapServer.
        if (!file_exists($this->aProperties['ms_log_dir']))
            mkdir($this->aProperties['ms_log_dir'], 0777);
        if (!file_exists($this->aProperties['ms_log_dir'] . '/test/'))
            mkdir($this->aProperties['ms_log_dir'] . '/test/', 0777);
        if (!file_exists($this->aProperties['ms_log_dir'] . '/prod/'))
            mkdir($this->aProperties['ms_log_dir'] . '/prod/', 0777);

        // Remplace l'échappement sur les doubles quotes.
        if (!empty($this->aProperties['test_wms_service_default_content']))
            $this->aProperties['test_wms_service_default_content'] = preg_replace('/\\\\+"/', '"', $this->aProperties['test_wms_service_default_content']);
    }

    /**
     * Création du fichier ".map" à utiliser pour le service WMS et ses couches.
     * \param $sWmsServiceId Identifiant du service WMS qui va être utilisée.
     * \return Retourne le chemin du fichier "map" à utiliser.
     */
    function saveWmsServiceTestMapFile($sWmsServiceId) {
        $this->bTestMode = true;
        $this->sWmsServiceId = $sWmsServiceId;
        $sWmsServiceDef = $this->getWmsServiceDef($sWmsServiceId);
        // Supprime les accents et caractères spéciaux.
        $sWmsServiceId = htmlentities($sWmsServiceId, ENT_NOQUOTES, 'UTF-8');
        $sWmsServiceId = preg_replace('#&([A-za-z])(?:acute|cedil|caron|circ|grave|orn|ring|slash|th|tilde|uml);#', '\1', $sWmsServiceId);
        $sWmsServiceId = preg_replace('#&([A-za-z]{2})(?:lig);#', '\1', $sWmsServiceId); // pour les ligatures e.g. '&oelig;'
        $sWmsServiceId = preg_replace('#&[^;]+;#', '', $sWmsServiceId); // supprime les autres caractères        
        $sWmsServiceId = str_replace(' ', '_', $sWmsServiceId); // Remplace les espaces.
        // Nom du fichier ".map".
        $sToken = hash('sha256', $this->sSID);
        $sMapServerProjDir = $this->aProperties["map_dir"] . '/proj';
        if ($sWmsServiceId == $this->aProperties['private_wms_service']) {
            $sFilename = $this->aProperties["map_dir"] . '/wms_test/' . $sToken . ".map";
            $sMapServerLogFile = $this->aProperties['ms_log_dir'] . '/test/' . $sToken . '.log';
        } else {
            $sFilename = $this->aProperties["map_dir"] . '/wms_test/' . $sToken . '_' . $sWmsServiceId . ".map";
            $sMapServerLogFile = $this->aProperties['ms_log_dir'] . '/test/' . $sToken . '_' . $sWmsServiceId . '.log';
        }
        // Fichier de log pour MapServer.
        $sWmsServiceDef = str_replace("{MS_LOG_FILE}", $sMapServerLogFile, $sWmsServiceDef);
        $sWmsServiceDef = str_replace("{MS_PROJ_DIR}", $sMapServerProjDir, $sWmsServiceDef);
        // Contenu par défaut du flux de test.
        if (!empty($this->aProperties['test_wms_service_default_content']))
            $sWmsServiceDef = preg_replace('/^\s*MAP\s*(\n|\r)/', "MAP\r\n#Début Configuration par défaut du serveur de test\r\n" . str_replace("<return>", "\r\n", $this->aProperties['test_wms_service_default_content']) . "\r\n#Fin Configuration par défaut du serveur de test\r\n", $sWmsServiceDef);
        // Génère le fichier .map
        if (file_exists($sFilename))
            unlink($sFilename);
        writeToFile(str_ireplace("STATUS DEFAULT", "STATUS ON", $sWmsServiceDef), $sFilename);
        // Génère le fichier de proj
        $this->generateProjFiles();
        // Supprime le fichier de log de MapServer pour le flux.
        if (file_exists($sMapServerLogFile))
            unlink($sMapServerLogFile);
        return $sFilename;
    }

    /**
     * Création du fichier ".map" à utiliser pour le service WMS et ses couches.
     * \param $sWmsServiceId Identifiant du service WMS qui va être utilisée.
     * \return Retourne le chemin du fichier "map" à utiliser.
     */
    function saveWmsServiceMapFile($sWmsServiceId, $sToken = null) {
        $this->bTestMode = false;
        $this->sWmsServiceId = $sWmsServiceId;
        $sWmsServiceDef = $this->getWmsServiceDef($sWmsServiceId);
        // Supprime les accents et caractères spéciaux.
        $sWmsServiceId = htmlentities($sWmsServiceId, ENT_NOQUOTES, 'UTF-8');
        $sWmsServiceId = preg_replace('#&([A-za-z])(?:acute|cedil|caron|circ|grave|orn|ring|slash|th|tilde|uml);#', '\1', $sWmsServiceId);
        $sWmsServiceId = preg_replace('#&([A-za-z]{2})(?:lig);#', '\1', $sWmsServiceId); // pour les ligatures e.g. '&oelig;'
        $sWmsServiceId = preg_replace('#&[^;]+;#', '', $sWmsServiceId); // supprime les autres caractères        
        $sWmsServiceId = str_replace(' ', '_', $sWmsServiceId); // Remplace les espaces.
        // Nom du fichier ".map".
        $sMapServerProjDir = $this->aProperties["map_dir"] . '/proj';
        $sMapServerLogFile = $this->aProperties['ms_log_dir'] . '/prod/' . $sWmsServiceId . '.log';
        if ($sWmsServiceId == $this->aProperties['private_wms_service'])
            $sFilename = $this->aProperties["map_dir"] . '/wms_private/' . hash('sha256', $sToken) . ".map";
        else
            $sFilename = $this->aProperties["map_dir"] . '/wms_public/' . $sWmsServiceId . ".map";
        // Fichier de log pour MapServer.
        $sWmsServiceDef = str_replace("{MS_LOG_FILE}", $sMapServerLogFile, $sWmsServiceDef);
        $sWmsServiceDef = str_replace("{MS_PROJ_DIR}", $sMapServerProjDir, $sWmsServiceDef);
        // Sauve le fichier .map
        if (file_exists($sFilename))
            unlink($sFilename);
        writeToFile(str_ireplace("STATUS DEFAULT", "STATUS ON", $sWmsServiceDef), $sFilename);
        // Génère le fichier de proj
        $this->generateProjFiles();
        // Supprime le fichier de log de MapServer pour le flux.
        if (file_exists($sMapServerLogFile))
            unlink($sMapServerLogFile);
        return $sFilename;
    }

    /**
     * Retourne la définition d'un service WMS.
     * \param $sWmsServiceId Identifiant du service WMS qui va être utilisé.
     * \param $sLayerDef Definition d'une ou plusieurs couches à associer.
     * \return Retourne la définition d'un service WMS.
     */
    function getWmsServiceDef($sWmsServiceId, $sLayerDef = '') {
        $oBd = $this->oBd;
        $aProperties = $this->aProperties;
        $aParams['sWmsServiceId'] = array('value' => $sWmsServiceId, 'type' => 'string');
        $oPDOresult = $oBd->executeWithParams($this->aSql['getWmsServiceDef'], $aParams);
        $aLigne = $oBd->ligneSuivante($oPDOresult);
        $oPDOresult = $oBd->fermeResultat();
        $sResult = $aLigne["definition"];
        // Mode de debug.
        if ($this->bTestMode)
            $iDebugMode = $this->aProperties["ms_debug_mode"];
        else
            $iDebugMode = $aLigne["msdebuglevel_id"];
        //
        unset($aLigne["definition"]);
        unset($aLigne["msdebuglevel_id"]);
        // Others
        foreach ($aLigne as $sFieldId => $iFieldValue) {
            $sFieldId = substr($sFieldId, 0, -3);
            $aObjDef[strtoupper($sFieldId)] = $this->getObjDef($iFieldValue, $sFieldId);
        }
        // Définitions des couches du service WMS.
        $aParams = array();
        if ($sWmsServiceId == $this->aProperties['private_wms_service'])
            $sSql = $this->aSql['getPrivateWmsServiceLayersDef'];
        else {
            $sSql = $this->aSql['getWmsServiceLayersDef'];
            $aParams['sWmsServiceId'] = array('value' => $sWmsServiceId, 'type' => 'string');
        }
        $oPDOresult = $oBd->executeWithParams($sSql, $aParams);
        $aRecordset = $oBd->getResultTableAssoc($oPDOresult);
        $oPDOresult = $oBd->fermeResultat();
        $aLayerGroups = array();
        $i = 0;
        $aObjDef["LAYERS"] = "";
        foreach ($aRecordset as $valeur => $aLigne)
            $aObjDef["LAYERS"] .= $this->getWmsServiceLayerDef($aLigne);
        // Couches optionnelles à associer.
        $aObjDef["LAYERS"] .= PHP_EOL . $sLayerDef . PHP_EOL;
        // Remplace les balises.
        foreach ($aObjDef as $sObjName => $sObjDef)
            $sResult = str_replace('{' . $sObjName . '}', $sObjDef, $sResult);
        $sResult = str_replace('{MS_DEBUG_MODE}', $iDebugMode, $sResult);
        //
        return $sResult;
    }

    /**
     * Cette méthode récupère la définition MapServer d'un objet du fichier "*.map" à générer.
     * \param $iObjId Identifiant de l'objet à traiter.
     * \param $sObjName Nom de l'objet à traiter (sa Classe). Par ex : "LAYER", "LEGEND"...
     * \private
     * \return Retourne la définition MapServer de l'objet désiré.
     */
    function getObjDef($iObjId, $sObjName) {
        $sResult = "";
        if ($iObjId) {
            if ($sObjName == "connection")
                $sResult = $this->getConnectionDef($iObjId);
            else {
                $oBd = $this->oBd;
                $sSqlTableName = strtolower($sObjName);
                $sSql = str_replace('[sObjName]', $sObjName, $this->aSql['getObjDef']);
                $aParams['sSqlTableName'] = array('value' => $sSqlTableName, 'type' => 'table_name');
                $aParams['iObjId'] = array('value' => $iObjId, 'type' => 'number');
                $oPDOresult = $oBd->executeWithParams($sSql, $aParams);
                $aLigne = $oBd->ligneSuivante($oPDOresult);
                $sResult = $aLigne['definition'];
                if ($sSqlTableName == "web") {
                    // Template pour le test de la couche.
                    if ($this->bTestMode) {
                        $iPos = strrpos($sResult, 'END');
                        $sResult = substr($sResult, 0, $iPos) . '  TEMPLATE "../template/template.html"' . PHP_EOL . '  IMAGEPATH "{TMP_DIR}"' . PHP_EOL . '  IMAGEURL "{TMP_URL}"' . PHP_EOL . substr($sResult, $iPos);
                    }
                    $sResult = str_replace("{TMP_DIR}", $this->aProperties["map_dir"] . '/tmp/', $sResult);
                    $sResult = str_replace("{TMP_URL}", $this->aProperties["map_url"] . '/tmp/', $sResult);
                    $sResult = str_replace("{MS_CGI_URL}", $this->aProperties["ms_cgi_url"] . '/', $sResult);
                    $sResult = str_replace("{WMSSERVICE_ID}", $this->sWmsServiceId, $sResult);
                }
                $oPDOresult = $oBd->fermeResultat();
            }
        }
        return $sResult . chr(13);
    }

    /**
     * Cette méthode privée permet de récupérer la définition des couches à intégrer dans les services wms après avoir effectué
     * une série de tests de validation.
     * \param $aLayerInfos Informations associées à la couche à traiter.
     * \private
     * \return La définition de la couche traitée.
     */
    function getWmsServiceLayerDef($aLayerInfos) {
        $oBd = $this->oBd;
        $aProperties = $this->aProperties;
        $sLayerDef = "";
        $sLayerDef = $this->getObjDef($aLayerInfos["ms_layer_id"], "ms_layer") . chr(13);
        $aParams['ms_layer_id'] = array('value' => $aLayerInfos['ms_layer_id'], 'type' => 'number');
        $oPDOresult = $oBd->executeWithParams($this->aSql['getLayerDef'], $aParams);
        $aLigneLayer = $oBd->ligneSuivante($oPDOresult);
        $oPDOresult = $oBd->fermeResultat();
        // Définition du système de coordonnées.
        $aCoordsys = $this->getCoordsysDef($aLigneLayer["coordsys_id"]);
        list($sCoordsysDef, $iSrid) = $aCoordsys;
        $sLayerDef = str_replace("{COORDSYS}", $sCoordsysDef, $sLayerDef);
        if (is_int($iSrid))
            $sLayerDef = str_replace("{SRID}", $iSrid, $sLayerDef);
        // Définition de la connexion.
        $sConnectionDef = '';
        if (!empty($aLigneLayer["connection_id"]))
            $sConnectionDef = $this->getConnectionDef($aLigneLayer["connection_id"]);
        $sLayerDef = str_replace("{CONNECTION}", $sConnectionDef, $sLayerDef);
        // Définition des métadonnées.
        $sMetadataDef = '';
        if (!empty($aLigneLayer["metadata_id"]))
            $sMetadataDef = $this->getMetadataDef($aLigneLayer["metadata_id"]);
        $sLayerDef = str_replace("{METADATA}", $sMetadataDef, $sLayerDef);
        //
        $sLayerDef = str_replace("{LAYER_NAME}", $aLayerInfos['name'], $sLayerDef);
        $sLayerDef = str_replace("{LAYER_TYPE}", $aLayerInfos['ms_layertype_id'], $sLayerDef);
        $sLayerDef = str_replace("{LAYER_OPACITY}", $aLigneLayer["opacity"], $sLayerDef);
        $sLayerDef = str_replace("{TABLE_ID}", $aLigneLayer["tableidfield"], $sLayerDef);
        $sLayerDef = str_replace("{TABLE_NAME}", '\"' . $aLigneLayer["tablename"] . '\"', $sLayerDef);
        $sLayerDef = str_replace("{TABLE_SCHEMA}", '\"' . $aLigneLayer["tableschema"] . '\"', $sLayerDef);
        $sLayerDef = str_replace("{LAYER_TITLE}", str_replace('"', '\"', $aLigneLayer['title']), $sLayerDef);
        $sDataDir = '';
        if (!empty($aProperties['datadir']))
            $sDataDir = $aProperties['datadir'];
        $sLayerDef = str_replace("{DATADIR}", $sDataDir, $sLayerDef);
        $sLayerDef = $sLayerDef . chr(13);
        return $sLayerDef;
    }

    /**
     * Cette méthode récupère la définition MapServer d'un objet COORDSYS.
     * \param iCoordsysId Identifiant de l'objet COORDSYS
     * \private
     * \return Retourne la définition MapServer de l'objet.
     */
    function getCoordsysDef($iCoordsysId) {
        $aResult = array('', '');
        if ($iCoordsysId) {
            $oBd = $this->oBd;
            $aParams['iCoordsysId'] = array('value' => $iCoordsysId, 'type' => 'number');
            $oPDOresult = $oBd->executeWithParams($this->aSql['getCoordsysDef'], $aParams);
            $aLigne = $oBd->ligneSuivante($oPDOresult);
            $oPDOresult = $oBd->fermeResultat();
            $aResult = array($aLigne["definition"] . chr(13), $aLigne["srid"]);
        }
        return $aResult;
    }

    /**
     * Création du fichier ".map" à utiliser pour le test de la couche associée à un flux WMS de test.
     * \param $sWmsServiceId Nom du flux WMS qui va être utilisé.
     * \param $iLayerToTest Identifiant de la couche à tester.
     * \return Retourne le chemin du fichier "map" à utiliser.
     */
    function saveLayerTestMapFile($sWmsServiceId, $iLayerToTest) {
        $oBd = $this->oBd;
        $this->bTestMode = true;
        $this->sWmsServiceId = $sWmsServiceId;
        // Infos de la couche (si elle n'est pas déja associée au flux wms de test).
        $aParams['iLayerToTest'] = array('value' => $iLayerToTest, 'type' => 'number');
        $aParams['sWmsServiceId'] = array('value' => $sWmsServiceId, 'type' => 'string');
        $oPDOresult = $oBd->executeWithParams($this->aSql['getLayerInfoToTest'], $aParams);
        $aLigne = $oBd->ligneSuivante($oPDOresult);
        if ($aLigne['nb_layer_to_test'] == 0) {
            $oPDOresult = $oBd->fermeResultat();
            // Définition de la couche à tester.
            $sLayersDef = "";
            $sLayer = $aLigne['definitiontmp'];
            // Définition du système de coordonnées.
            $aCoordsys = array($aLigne['coordsys_definition'] . chr(13), $aLigne['srid']);
            list($sCoordsysDef, $iSrid) = $aCoordsys;
            $sLayer = str_replace("{COORDSYS}", $sCoordsysDef, $sLayer);
            if (is_int($iSrid))
                $sLayer = str_replace("{SRID}", $iSrid, $sLayer);
            // Connexion.
            $sConnectionDef = '';
            if (!empty($aLigne['connection_id']))
                $sConnectionDef = $this->getConnectionDef($aLigne['connection_id']);
            $sLayer = str_replace("{CONNECTION}", $sConnectionDef, $sLayer);
            // Définition des métadonnées.
            $sMetadataDef = '';
            if (!empty($aLigne["metadata_id"]))
                $sMetadataDef = $this->getMetadataDef($aLigne["metadata_id"]);
            $sLayer = str_replace("{METADATA}", $sMetadataDef, $sLayer);
            // Autres tags.
            $sLayer = str_replace("{LAYER_NAME}", $aLigne['name'], $sLayer);
            $sLayer = str_replace("{LAYER_TYPE}", $aLigne['ms_layertype_id'], $sLayer);
            $sLayer = str_replace("{LAYER_OPACITY}", $aLigne["opacity"], $sLayer);
            $sLayer = str_replace("{TABLE_ID}", $aLigne["tableidfield"], $sLayer);
            $sLayer = str_replace("{TABLE_NAME}", '\"' . $aLigne["tablename"] . '\"', $sLayer);
            $sLayer = str_replace("{TABLE_SCHEMA}", '\"' . $aLigne["tableschema"] . '\"', $sLayer);
            $sLayer = str_replace("{LAYER_TITLE}", str_replace('"', '\"', $aLigne['title']), $sLayer);
            $sDataDir = '';
            if (!empty($aProperties['datadir']))
                $sDataDir = $aProperties['datadir'];
            $sLayer = str_replace("{DATADIR}", $sDataDir, $sLayer);
            $sLayersDef .= $sLayer;
            // Définition du flux wms de test (et ses couches) avec la couche à tester.
            $sMapDef = $this->getWmsServiceDef($sWmsServiceId, $sLayersDef);
        }
        else {
            // Définition du flux wms de test (et ses couches) sans la couche à tester (déja associée).
            $sMapDef = $this->getWmsServiceDef($sWmsServiceId);
        }
        // Fichier de log pour MapServer.
        $sMapServerLogFile = $this->aProperties['ms_log_dir'] . '/test/' . hash('sha256', session_id()) . '_' . $aLigne['name'] . '.log';
        $sMapDef = str_replace("{MS_LOG_FILE}", $sMapServerLogFile, $sMapDef);

        // Dossier de proj
        $sMapServerProjDir = $this->aProperties["map_dir"] . '/proj';
        $sMapDef = str_replace("{MS_PROJ_DIR}", $sMapServerProjDir, $sMapDef);

        // Contenu par défaut du flux de test.
        if (!empty($this->aProperties['test_wms_service_default_content']))
            $sMapDef = preg_replace('/^\s*MAP\s*(\n|\r)/', "MAP\r\n#Début Configuration par défaut du serveur de test\r\n" . str_replace("<return>", "\r\n", $this->aProperties['test_wms_service_default_content']) . "\r\n#Fin Configuration par défaut du serveur de test\r\n", $sMapDef);
        // Sauve le fichier ".map".
        $sFilename = $this->aProperties["map_dir"] . '/wms_test/' . hash('sha256', session_id()) . '_' . $aLigne['name'] . ".map";
        if (file_exists($sFilename))
            unlink($sFilename);
        writeToFile($sMapDef, $sFilename);
        // Génère le fichier de proj
        $this->generateProjFiles();
        // Supprime le fichier de log de MapServer pour le flux de test + la couche.
        if (file_exists($sMapServerLogFile))
            unlink($sMapServerLogFile);
        return $sFilename;
    }

    /**
     * Retourne la définition d'une connexion.
     * \param iConnectionId Identifiant de la connexion
     * \return Retourne la définition de la connexion.
     */
    function getConnectionDef($iConnectionId) {
        // $sConnectionDefinition
        $sDefinition = "";
        if (!empty($iConnectionId)) {
            $aParams['iConnectionId'] = array('value' => $iConnectionId, 'type' => 'number');
            $oPDOresult = $this->oBd->executeWithParams($this->aSql['getConnection'], $aParams);
            $aLigne = $this->oBd->ligneSuivante($oPDOresult);
            $oPDOresult = $this->oBd->fermeResultat();
            $sDefinition = $this->sConnectionDefinition;
            $sLogin = $this->sLogin;
            $sPassword = $this->sPassword;
            if (empty($sLogin) && empty($sPassword)) {
                if ((!empty($aLigne['user']) && $aLigne['user'] != '{CONNECTION_LOGIN}') && (!empty($aLigne['password']) && $aLigne['password'] != '{CONNECTION_PASSWORD}')) {
                    $sLogin = $aLigne['user'];
                    $sPassword = $aLigne['password'];
                } else {
                    $sLogin = $_SESSION["ses_Login"];
                    $sPassword = decodepass($_SESSION["ses_Password"]);
                }
            }
            $sDefinition = str_replace("{CONNECTION_LOGIN}", $sLogin, $sDefinition);
            $sDefinition = str_replace("{CONNECTION_PASSWORD}", $sPassword, $sDefinition);
            // Serveur.
            if (!empty($aLigne['server']))
                $sServer = $aLigne['server'];
            else
                $sServer = $this->aProperties['server'];
            $sDefinition = str_replace("{CONNECTION_SERVER}", $sServer, $sDefinition);
            // Port.
            if (!empty($aLigne['port']))
                $sPort = $aLigne['port'];
            else
                $sPort = $this->aProperties['port'];
            $sDefinition = str_replace("{CONNECTION_PORT}", $sPort, $sDefinition);
            // Base de données.
            if (!empty($aLigne['database']))
                $sDatabase = $aLigne['database'];
            else
                $sDatabase = $this->aProperties['database'];
            $sDefinition = str_replace("{CONNECTION_DATABASE}", $sDatabase, $sDefinition);
        }
        return $sDefinition;
    }

    /**
     * Generate the epsg file in the proj directory
     * @return string
     */
    function generateProjFiles() {

        $aProj = array();
        $aSQLParams = array(
            'sSchema' => array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name')
        );
        $oResult = $this->oBd->executeWithParams($this->aSql['getCoordsys'], $aSQLParams);
        if (gettype($oResult) == 'object') {
            $aProj = $this->oBd->getResultTableAssoc($oResult);
        }

        $sFilename = $this->aProperties["map_dir"] . '/proj/epsg';
        if (file_exists($sFilename)) {
            unlink($sFilename);
        }

        $sProjDefs = '';
        for ($i = 0; $i < count($aProj); $i++) {
            $sProjDef = '# ' . $aProj[$i]['label'] . PHP_EOL;
            $sProjDef .= '<' . $aProj[$i]['coordsys_id'] . '> ' . $aProj[$i]['epsg_definition'] . ' <>';
            $sProjDefs .= $sProjDef . PHP_EOL;
        }

        writeToFile($sProjDefs, $sFilename);
        return $sFilename;
    }

    /**
     * Retourne la définition des métadonnées d'une couche.
     * \param iMetadataId Identifiant de la métadonnée
     * \return Retourne la définition de la métadonnée.
     */
    function getMetadataDef($iMetadataId) {
        $sDefinition = '';
        if (!empty($iMetadataId)) {
            $aParams['iMetadataId'] = array('value' => $iMetadataId, 'type' => 'number');
            $oPDOresult = $this->oBd->executeWithParams($this->aSql['getMetadata'], $aParams);
            $aLigne = $this->oBd->ligneSuivante($oPDOresult);
            $oPDOresult = $this->oBd->fermeResultat();
            $sDefinition = $aLigne['definition'];
        }
        return $sDefinition;
    }

}

?>
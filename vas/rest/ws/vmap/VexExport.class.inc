<?php

/**
 * \file VexExport.class.inc
 * \class VexExport
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the VexExport php class
 *
 * This class defines php functions to export VEX files
 *
 */
require_once 'Vex.class.inc';
require_once 'VexGetter.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Form.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';
require_once 'vmlib/logUtil.inc';

/**
 * Permet l'export de fichiers VEX en utilisant les paramètres
 * vmap_objects, web_services, sql_objects passés dans $this->aValues
 */
class VexExport extends Vmap {

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
     * Generate a VEX file
     */
    function exportVex() {

        if (!in_array('vitis_admin', $this->oConnection->aPrivileges) ||
                !in_array('vmap_admin', $this->oConnection->aPrivileges) ||
                !in_array('vm4ms_admin', $this->oConnection->aPrivileges)) {
            $oError = new VitisError(0, 'insufficient privileges (needs to be vitis_admin, vmap_admin and vm4ms_admin)');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        // Nom du fichier temporaire
        $this->sTmpName = $this->UniqFileName();

        // Crée un dossier temporaire de travail
        $this->sTmpPath = $this->createTmpFolder($this->sTmpName);

        // SQL
        if (!isset($this->oError) && !isset($this->oConnection->oError) && !$this->oConnection->oBd->enErreur()) {
            $this->exportSQL();
        }

        // Objets vMap
        if (!isset($this->oError) && !isset($this->oConnection->oError) && !$this->oConnection->oBd->enErreur()) {
            $this->exportVMapObjects();
        }

        // Services WEB
        if (!isset($this->oError) && !isset($this->oConnection->oError) && !$this->oConnection->oBd->enErreur()) {
            $this->exportWebServices();
        }

        // Crée le fichier VEX
        if (!isset($this->oError) && !isset($this->oConnection->oError) && !$this->oConnection->oBd->enErreur()) {
            $this->sVexPath = $this->createVexFile();
        }

        // Supprime le dossier temporaire de travail
        $this->deleteTmpFolder($this->sTmpPath);

        if (isset($this->oError)) {
            $oError = new VitisError(1, $this->oError->getMessage());
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        } elseif (isset($this->oConnection->oError)) {
            $oError = $this->oConnection->oError;
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        } elseif ($this->oConnection->oBd->enErreur()) {
            $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        } elseif (is_file($this->sVexPath)) {
            $handle = fopen($this->sVexPath, "r");
            $contents = fread($handle, filesize($this->sVexPath));
            fclose($handle);

            // Supprime le dossier vex
            $this->deleteVexFile($this->sVexPath);

            return $contents;
        } else {
            $oError = new VitisError(1, 'Impossoble de générer le fichier VEX');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }
    }

    /**
     * Crée un répertoire temporaire
     * @param string $sName
     * @return string
     */
    function createTmpFolder($sName) {
        $sTmpPath = $this->aProperties['vas_home'] . '/tmp/' . $sName;
        if (is_dir($sTmpPath)) {
            clearDir($sTmpPath);
        }
        mkdir($sTmpPath, 0777, true);
        return $sTmpPath;
    }

    /**
     * Supprime le répertoire temporaire
     * @param string $sTmpPath
     */
    function deleteTmpFolder($sTmpPath) {
        if (is_dir($sTmpPath)) {
            clearDir($sTmpPath);
        }
    }

    /**
     * Crée le fichier VEX
     */
    function createVexFile() {
        $sVexPath = $this->sTmpPath . '.vex';
        createZip($this->sTmpPath, $sVexPath);
        return $sVexPath;
    }

    /**
     * Supprime le fichier vex
     * @param string $sVexPath
     */
    function deleteVexFile($sVexPath) {
        if (is_file($sVexPath)) {
            @unlink($sVexPath);
        }
    }

    // Export SQL

    /**
     * Exporte le SQL
     */
    function exportSQL() {

        if (empty($this->aValues['sql_objects'])) {
            return false;
        }

        $aSQLObjects = json_decode($this->aValues['sql_objects'], true);

        if (empty($aSQLObjects)) {
            return false;
        }
        if (empty($aSQLObjects['schemas'])) {
            return false;
        }

        /**
         * Objet VexGetter permettant de recueillir des informations essentielles
         */
        $this->oVexGetter = new VexGetter($this->aPath, $this->aValues, $this->aProperties);

        // Dossier sql
        mkdir($this->sTmpPath . '/sql', 0777, true);

        // Liste des schémas utilisés
        $this->aSchemas = [];

        // Fichier SQl contenant le modèle de données SQL
        $this->sSqlFileModelPath = $this->sTmpPath . '/sql/export_model_sql.sql';
        $this->sSqlLogModelPath = $this->sTmpPath . '/sql/export_model_sql.log';

        // Fichier SQl contenant les données SQL
        $this->sSqlFileDataPath = $this->sTmpPath . '/sql/export_data_sql.sql';
        $this->sSqlLogDataPath = $this->sTmpPath . '/sql/export_data_sql.log';

        if (!isset($this->oError)) {
            $this->dumpSqlTables($aSQLObjects);
        }
        if (is_file($this->sSqlFileModelPath)) {
            if (!isset($this->oError)) {
                $this->makeSQLFileReplacements($this->sSqlFileModelPath, true, true, true);
            }
        }
        if (is_file($this->sSqlFileDataPath)) {
            if (!isset($this->oError)) {
                $this->makeSQLFileReplacements($this->sSqlFileDataPath, true);
            }
        }
    }

    /**
     * Fait un dump des tables demandées
     *
     * @param array $aSQLObjects tables à exporter au format suivant:
     * {
     *  "type":"database",
     *  "name":"[database]",
     *  "schemas":[{
     *      "type":"schema",
     *      "name":"[schema1]",
     *      "tables":["[table1]","[table2]"]
     *      }]
     *  }
     *
     * @return boolean
     */
    function dumpSqlTables($aSQLObjects) {

        $this->dumpSqlTablesModel($aSQLObjects);
        $this->dumpSqlTablesData($aSQLObjects);

        // Vérifie si le fichier sql a été généré, sinon renvoie false
        if (!is_file($this->sSqlFileModelPath)) {
            $sErrorMessage = 'Impossible de récupérer les données SQL';

            if (is_file($this->sSqlLogModelPath)) {
                $aLogs = file($this->sSqlLogModelPath);
                $sErrorMessage .= ':<br>';
                for ($i = 0; $i < count($aLogs); $i++) {
                    $sErrorMessage .= '<br>' . $aLogs[$i];
                }
            }

            $this->oError = new Error($sErrorMessage);
            return false;
        } else {
            return true;
        }
    }

    /**
     * Exporte le modèle de données (sans les données) au format sql
     * @param array $aSQLObjects
     */
    function dumpSqlTablesModel($aSQLObjects) {

        $sLogin = $this->aProperties['owner_login'];
        $sPassword = $this->aProperties['owner_pass'];

        $sDatabase = $this->getDatabaseFromSqlObjects($aSQLObjects);
        $aTables = $this->getTablesFromSqlObjects($aSQLObjects);
        $aViews = $this->getViewsFromSqlObjects($aSQLObjects);
        $aSequences = $this->getSequencesFromSqlObjects($aSQLObjects);

        // Si la base de données ou la liste des tables est vide pas de dump
        if (empty($sDatabase) || (empty($aTables) && empty($aViews))) {
            return true;
        }

        $sPgDumpCommand = 'set PGPASSWORD="' . $sPassword . '"';
        $sPgDumpCommand .= ' && ' . $this->aProperties['pg_utils_root_path'] . '/pg_dump';
        $sPgDumpCommand .= ' --host ' . $this->aProperties['server'];
        $sPgDumpCommand .= ' --port ' . $this->aProperties['port'];
        $sPgDumpCommand .= ' --username "' . $sLogin . '"';
        $sPgDumpCommand .= ' --format plain';
        $sPgDumpCommand .= ' --section pre-data';
        $sPgDumpCommand .= ' --section post-data';
        $sPgDumpCommand .= ' --inserts';
        $sPgDumpCommand .= ' --column-inserts';
        $sPgDumpCommand .= ' --verbose';
        $sPgDumpCommand .= ' --no-owner';
        $sPgDumpCommand .= ' --no-privileges';
        $sPgDumpCommand .= ' --file "' . $this->sSqlFileModelPath . '"';
        for ($i = 0; $i < count($aTables); $i++) {
            $sPgDumpCommand .= ' --table "' . $aTables[$i] . '"';
        }
        for ($i = 0; $i < count($aViews); $i++) {
            $sPgDumpCommand .= ' --table "' . $aViews[$i] . '"';
        }
        for ($i = 0; $i < count($aSequences); $i++) {
            $sPgDumpCommand .= ' --table "' . $aSequences[$i] . '"';
        }
        $sPgDumpCommand .= ' "' . $sDatabase . '"';
        $sPgDumpCommand .= ' 2> "' . $this->sSqlLogModelPath . '"';

        exec($sPgDumpCommand);
    }

    /**
     * Exporte les données uniquement au format sql
     * @param array $aSQLObjects
     */
    function dumpSqlTablesData($aSQLObjects) {

        $sLogin = $this->aProperties['owner_login'];
        $sPassword = $this->aProperties['owner_pass'];

        $sDatabase = $this->getDatabaseFromSqlObjects($aSQLObjects);
        $aTables = $this->getTablesFromSqlObjects($aSQLObjects, true);

        // Si la base de données ou la liste des tables est vide pas de dump
        if (empty($sDatabase) || empty($aTables)) {
            return true;
        }

        $sPgDumpCommand = 'set PGPASSWORD="' . $sPassword . '"';
        $sPgDumpCommand .= ' && ' . $this->aProperties['pg_utils_root_path'] . '/pg_dump';
        $sPgDumpCommand .= ' --host ' . $this->aProperties['server'];
        $sPgDumpCommand .= ' --port ' . $this->aProperties['port'];
        $sPgDumpCommand .= ' --username "' . $sLogin . '"';
        $sPgDumpCommand .= ' --format plain';
        $sPgDumpCommand .= ' --data-only';
        $sPgDumpCommand .= ' --column-inserts';
        $sPgDumpCommand .= ' --verbose';
        $sPgDumpCommand .= ' --no-owner';
        $sPgDumpCommand .= ' --no-privileges';
        $sPgDumpCommand .= ' --file "' . $this->sSqlFileDataPath . '"';
        for ($i = 0; $i < count($aTables); $i++) {
            $sPgDumpCommand .= ' --table "' . $aTables[$i] . '"';
        }
        $sPgDumpCommand .= ' "' . $sDatabase . '"';
        $sPgDumpCommand .= ' 2> "' . $this->sSqlLogDataPath . '"';

        exec($sPgDumpCommand);
    }

    /**
     * Récupère le seul nom de base de donnés présent dans $aSQLObjects
     * @param array $aSQLObjects
     * @return type
     */
    function getDatabaseFromSqlObjects($aSQLObjects) {
        if ($aSQLObjects['type'] === 'database') {
            if (!empty($aSQLObjects['name'])) {
                return $aSQLObjects['name'];
            }
        }
    }

    /**
     * Récupère les table définies dans $aSQLObjects,
     * Si $bOnlyData = true alors récupère uniquement celles qui ont de la donnée
     * @param array $aSQLObjects
     * @return type
     */
    function getTablesFromSqlObjects($aSQLObjects, $bOnlyData = false) {
        $aTables = [];

        if (is_array($aSQLObjects['schemas'])) {
            for ($i = 0; $i < count($aSQLObjects['schemas']); $i++) {
                if ($aSQLObjects['schemas'][$i]['type'] === 'schema') {
                    if (is_array($aSQLObjects['schemas'][$i]['tables'])) {
                        for ($ii = 0; $ii < count($aSQLObjects['schemas'][$i]['tables']); $ii++) {
                            if (!$bOnlyData) {
                                array_push($aTables, $aSQLObjects['schemas'][$i]['name'] . '.' . $aSQLObjects['schemas'][$i]['tables'][$ii]['name']);
                            } else {
                                if ($aSQLObjects['schemas'][$i]['tables'][$ii]['data']) {
                                    array_push($aTables, $aSQLObjects['schemas'][$i]['name'] . '.' . $aSQLObjects['schemas'][$i]['tables'][$ii]['name']);
                                }
                            }
                        }
                    }
                }
            }
        }

        return $aTables;
    }

    /**
     * Récupère les vues définies dans $aSQLObjects
     * @param array $aSQLObjects
     * @return type
     */
    function getViewsFromSqlObjects($aSQLObjects) {
        $aViews = [];

        if (is_array($aSQLObjects['schemas'])) {
            for ($i = 0; $i < count($aSQLObjects['schemas']); $i++) {
                if ($aSQLObjects['schemas'][$i]['type'] === 'schema') {
                    if (is_array($aSQLObjects['schemas'][$i]['views'])) {
                        for ($ii = 0; $ii < count($aSQLObjects['schemas'][$i]['views']); $ii++) {
                            array_push($aViews, $aSQLObjects['schemas'][$i]['name'] . '.' . $aSQLObjects['schemas'][$i]['views'][$ii]['name']);
                        }
                    }
                }
            }
        }

        return $aViews;
    }

    /**
     * Récupère le seul nom de base de donnés présent dans $aSQLObjects
     * @param array $aSQLObjects
     * @return type
     */
    function getSequencesFromSqlObjects($aSQLObjects) {
        $aSequences = [];

        if (is_array($aSQLObjects['schemas'])) {
            for ($i = 0; $i < count($aSQLObjects['schemas']); $i++) {
                if ($aSQLObjects['schemas'][$i]['type'] === 'schema') {
                    if (is_array($aSQLObjects['schemas'][$i]['sequences'])) {
                        for ($ii = 0; $ii < count($aSQLObjects['schemas'][$i]['sequences']); $ii++) {
                            array_push($aSequences, $aSQLObjects['schemas'][$i]['name'] . '.' . $aSQLObjects['schemas'][$i]['sequences'][$ii]['name']);
                        }
                    }
                }
            }
        }

        return $aSequences;
    }

    /**
     * Fait les remplacements necessaires au fichier SQL
     * @param string $sSqlFilePath
     */
    function makeSQLFileReplacements($sSqlFilePath, $bReplaceSchema = false, $bReplaceSRID = false, $bAddGrants = false) {

        $aLines = file($sSqlFilePath);

        // Commente la ligne row_security car elle ne fonctionne pas sous pg-9.3
        for ($i = 0; $i < count($aLines); $i++) {
            $aLines[$i] = preg_replace("/SET row_security/", "-- SET row_security", $aLines[$i]);
        }

        // Remplace les différents schémas par [SCHEMA_NAME]
        if ($bReplaceSchema) {
            $aLines = $this->replaceSchemasOnLines($aLines);
        }

        // Ajoute les GRANT [ROLE_USER] et [ROLE_ADMIN]
        if ($bAddGrants) {
            $aLines = $this->addGrantsOnLines($aLines);
        }

        file_put_contents($sSqlFilePath, $aLines);
    }

    /**
     * Remplace les différents schémas par [SCHEMA_NAME]
     * @param array $aLines
     * @return array
     */
    function replaceSchemasOnLines($aLines) {

        $this->aSchemas = array_merge($this->aSchemas, $this->oVexGetter->getSchemasFromLines($aLines));

        for ($i = 0; $i < count($aLines); $i++) {
            for ($ii = 0; $ii < count($this->aSchemas); $ii++) {
                if (preg_match("/\b" . $this->aSchemas[$ii] . "\b/", $aLines[$i])) {
                    $aLines[$i] = preg_replace("/\b" . $this->aSchemas[$ii] . "\b/", "[SCHEMA_NAME]", $aLines[$i]);
                }
            }
        }

        return $aLines;
    }

    /**
     * Récupère la liste des SRID évoqués sur les lignes
     * @param array $aLines
     * @param array $aAvaliableSRIDs
     * @return array
     */
    function getSRIDsFromLines($aLines, $aAvaliableSRIDs) {

        // Expressions régulières geometry permettant de savoir que le SRID se situe sur la ligne
        $aGeomRegexps = array(
            "/\bgeometry\(\b/i",
            "/\bst_srid\(\b/i",
        );

        // Liste des SRID
        $aSRIDs = [];

        // Récupère l'unique SRID utilisé
        for ($i = 0; $i < count($aLines); $i++) {

            // Vérifie si un des mots clés geometry est renseigné
            for ($ii = 0; $ii < count($aGeomRegexps); $ii++) {
                if (preg_match($aGeomRegexps[$ii], $aLines[$i])) {

                    // Vérifie si un des SRID disponibles est sur la ligne
                    for ($iii = 0; $iii < count($aAvaliableSRIDs); $iii++) {
                        if (preg_match("/" . $aAvaliableSRIDs[$iii] . "/", $aLines[$i])) {

                            // Ajoute dans la liste des SRID
                            if (!in_array($aAvaliableSRIDs[$iii], $aSRIDs)) {
                                array_push($aSRIDs, $aAvaliableSRIDs[$iii]);
                            }
                        }
                    }
                }
            }
        }
        return $aSRIDs;
    }

    /**
     * Add the grand commands to $aLines
     * @param array $aLines
     * @return array
     */
    function addGrantsOnLines($aLines) {

        $aGrants = $this->getGrantsForSQLComponent(null, 'SCHEMA');
        for ($i = 0; $i < count($aGrants); $i++) {
            array_push($aLines, $aGrants[$i]);
        }

        $aSQLComponents = $this->oVexGetter->getSQLGrantableObjectsFromLines($aLines);

        for ($i = 0; $i < count($aSQLComponents); $i++) {
            if (!empty($aSQLComponents[$i]['name']) && !empty($aSQLComponents[$i]['type'])) {
                $aGrants = $this->getGrantsForSQLComponent($aSQLComponents[$i]['name'], $aSQLComponents[$i]['type']);

                for ($ii = 0; $ii < count($aGrants); $ii++) {
                    array_push($aLines, $aGrants[$ii]);
                }
            }
        }

        return $aLines;
    }

    /**
     * Get a list with the grant commands for the given component
     * @param string $sName
     * @param string $sType
     * @return array
     */
    function getGrantsForSQLComponent($sName, $sType) {

        $aGrants = [];

        switch ($sType) {
            case 'TABLE':
            case 'VIEW':

                array_push($aGrants, '');
                array_push($aGrants, '--');
                array_push($aGrants, '-- GENERATED BY VMAP');
                array_push($aGrants, '-- Rights on table ' . $sName . '');
                array_push($aGrants, '--');
                array_push($aGrants, '');
                array_push($aGrants, 'ALTER TABLE [SCHEMA_NAME].' . $sName . ' OWNER TO u_vitis;');
                array_push($aGrants, 'REVOKE ALL ON TABLE [SCHEMA_NAME].' . $sName . ' FROM PUBLIC;');
                array_push($aGrants, 'REVOKE ALL ON TABLE [SCHEMA_NAME].' . $sName . ' FROM u_vitis;');
                array_push($aGrants, 'GRANT ALL ON TABLE [SCHEMA_NAME].' . $sName . ' TO u_vitis;');
                array_push($aGrants, 'GRANT SELECT ON TABLE [SCHEMA_NAME].' . $sName . ' TO [ROLE_USER];');
                array_push($aGrants, 'GRANT ALL ON TABLE [SCHEMA_NAME].' . $sName . ' TO [ROLE_ADMIN];');
                array_push($aGrants, '');

                break;
            case 'SEQUENCE':

                array_push($aGrants, '');
                array_push($aGrants, '--');
                array_push($aGrants, '-- GENERATED BY VMAP');
                array_push($aGrants, '-- Rights on sequence ' . $sName . '');
                array_push($aGrants, '--');
                array_push($aGrants, '');
                array_push($aGrants, 'ALTER SEQUENCE [SCHEMA_NAME].' . $sName . ' OWNER TO u_vitis;');
                array_push($aGrants, 'REVOKE ALL ON SEQUENCE [SCHEMA_NAME].' . $sName . ' FROM PUBLIC;');
                array_push($aGrants, 'REVOKE ALL ON SEQUENCE [SCHEMA_NAME].' . $sName . ' FROM u_vitis;');
                array_push($aGrants, 'GRANT ALL ON SEQUENCE [SCHEMA_NAME].' . $sName . ' TO u_vitis;');
                array_push($aGrants, 'GRANT SELECT ON SEQUENCE [SCHEMA_NAME].' . $sName . ' TO [ROLE_USER];');
                array_push($aGrants, 'GRANT ALL ON SEQUENCE [SCHEMA_NAME].' . $sName . ' TO [ROLE_ADMIN];');
                array_push($aGrants, '');

                break;
            case 'SCHEMA':

                array_push($aGrants, '');
                array_push($aGrants, '--');
                array_push($aGrants, '-- GENERATED BY VMAP');
                array_push($aGrants, '-- Rights on schema [SCHEMA_NAME]');
                array_push($aGrants, '--');
                array_push($aGrants, '');
                array_push($aGrants, 'ALTER SCHEMA [SCHEMA_NAME] OWNER TO u_vitis;');
                array_push($aGrants, 'REVOKE ALL ON SCHEMA [SCHEMA_NAME] FROM PUBLIC;');
                array_push($aGrants, 'REVOKE ALL ON SCHEMA [SCHEMA_NAME] FROM u_vitis;');
                array_push($aGrants, 'GRANT ALL ON SCHEMA [SCHEMA_NAME] TO u_vitis;');
                array_push($aGrants, 'GRANT USAGE ON SCHEMA [SCHEMA_NAME] TO [ROLE_USER];');
                array_push($aGrants, 'GRANT ALL ON SCHEMA [SCHEMA_NAME] TO [ROLE_ADMIN];');
                array_push($aGrants, '');

                break;
            default:
                break;
        }

        for ($i = 0; $i < count($aGrants); $i++) {
            $aGrants[$i] .= PHP_EOL;
        }

        return $aGrants;
    }

    // Objets vMap

    /**
     * Exporte les objets vMap (cartes, calques, objets métiers, couches)
     * ainsi que leur dépendances (services, layertheme, evenements, rapports, map_layer)
     */
    function exportVMapObjects() {

        // Dossier vmap_objects
        mkdir($this->sTmpPath . '/vmap_objects', 0777, true);

        $aVMapObjects = json_decode($this->aValues['vmap_objects'], true);

        $this->aOidCounter = 0;
        $this->aOids = [];

        // Cartes
        if (!empty($aVMapObjects['maps'])) {
            $this->exportVMapMaps($aVMapObjects['maps']);
        }

        // Calques
        if (!empty($aVMapObjects['calques'])) {
            $this->exportVMapCalques($aVMapObjects['calques']);
        }

        // Couches mapserver
        if (!empty($aVMapObjects['vm4ms_layers'])) {
            $this->exportVMapVm4msLayers($aVMapObjects['vm4ms_layers']);
        }

        // Objet métier
        if (!empty($aVMapObjects['business_objects'])) {
            $this->exportVMapBusinessObjects($aVMapObjects['business_objects']);
        }

        // Services
        if (!empty($this->aExportedCalques)) {
            $this->exportVMapServices();
        }

        // Themes de calques
        if (!empty($this->aExportedCalques)) {
            $this->exportVMapCalqueThemes();
        }

        // Événements objets métier
        if (!empty($this->aExportedBusinessObjects)) {
            $this->exportVMapEvents();
        }

        // Rapports objets métier
        if (!empty($this->aExportedBusinessObjects)) {
            $this->exportVMapReports();
        }

        // Relations calques / cartes
        if (!empty($this->aExportedCalques) && !empty($this->aExportedMaps)) {
            $this->exportVMapCalqueMapRelations();
        }

        // Remplace les identifiants par les OID
        $this->manageVMapObjectDependencies();

        // Écrit les définitions dans les fichiers JSON
        $this->generateDefinitionFiles();
    }

    /**
     * Gen an oid from a type and an id
     * @param string $sType maps, calque, vm4ms_layer etc..
     * @param string $sId
     * @return string
     */
    function generateOid($sType, $sId) {
        $sOid = 'vex_export_oid_' . $this->aOidCounter;
        $this->aOids[$sType][$sOid] = $sId;
        $this->aOidCounter++;
        return $sOid;
    }

    /**
     * Exporte les définitions des cartes dans le fichier JSON correspondant
     * @param array $aMapIds
     */
    function exportVMapMaps($aMapIds) {
        $this->aExportedMaps = $this->getVMapMapsDefByIds($aMapIds);
    }

    /**
     * Récupère les définitions des cartes en fonction des identifiants passés
     * @param array $aMapIds
     * @return array
     */
    function getVMapMapsDefByIds($aMapIds) {
        require_once 'Maps.class.inc';

        if (empty($aMapIds)) {
            return array();
        }

        $aFilter = array(
            'column' => 'map_id',
            'compare_operator' => 'IN',
            'value' => $aMapIds,
        );

        // Valeurs à ne pas importer
        $aUnusedValues = [
            'crs_name',
            'catalog_index',
            'thumbnail',
            'theme_name',
            'theme_description',
            'maptheme_id'
        ];

        $aPath = ['vmap', 'maps'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'filter' => json_encode($aFilter),
            'module' => 'vmap'
        );

        $oMaps = new Maps($aPath, $aValues, $this->aProperties);
        $oMaps->GET();

        $aMaps = array();
        if (!empty($oMaps->aObjects)) {
            for ($i = 0; $i < count($oMaps->aObjects); $i++) {
                if (!empty($oMaps->aObjects[$i]->aFields)) {
                    array_push($aMaps, $oMaps->aObjects[$i]->aFields);
                }
            }
        }

        // Drop unsused values
        for ($i = 0; $i < count($aMaps); $i++) {
            foreach ($aMaps[$i] as $key => $value) {
                if (in_array($key, $aUnusedValues)) {
                    unset($aMaps[$i][$key]);
                }
            }
        }

        // oids
        for ($i = 0; $i < count($aMaps); $i++) {
            $aMaps[$i]['map_id'] = $this->generateOid('map', $aMaps[$i]['map_id']);
        }

        return $aMaps;
    }

    /**
     * Exporte les définitions des calques dans le fichier JSON correspondant
     * @param array $aCalqueIds
     */
    function exportVMapCalques($aCalqueIds) {
        $this->aExportedCalques = $this->getVMapCalquesDefByIds($aCalqueIds);
    }

    /**
     * Récupère les définitions des calques en fonction des identifiants passés
     * @param array $aCalqueIds
     * @return array
     */
    function getVMapCalquesDefByIds($aCalqueIds) {
        require 'Vex.class.sql.inc';

        if (empty($aCalqueIds)) {
            return array();
        }

        // Valeurs à ne pas importer
        $aUnusedValues = [
            'theme_name',
            'service_name',
            'service_type_id',
            'service_url',
            'service_key',
            'service_type_version',
            'service_thumbnail',
            'service_lang',
            'service_imagery',
            'service_type_type',
            'service_options',
            'service_login',
            'service_password',
        ];

        $aCalques = array();
        $aParams = array();
        $aParams['idList'] = array('value' => implode('|', $aCalqueIds), 'type' => 'group');
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getLayersById'], $aParams);
        if (!$this->oConnection->oBd->enErreur()) {
            $aCalques = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);
        }

        // Drop unsused values
        for ($i = 0; $i < count($aCalques); $i++) {
            foreach ($aCalques[$i] as $key => $value) {
                if (in_array($key, $aUnusedValues)) {
                    unset($aCalques[$i][$key]);
                }
            }
        }

        for ($i = 0; $i < count($aCalques); $i++) {

            // Oid
            $sOid = $this->generateOid('calque', $aCalques[$i]['layer_id']);

            // Formulaires
            if ($aCalques[$i]['is_bo_filtered']) {
                if (!is_dir($this->sTmpPath . '/vmap_objects/calques_forms')) {
                    mkdir($this->sTmpPath . '/vmap_objects/calques_forms', 0777, true);
                }
                mkdir($this->sTmpPath . '/vmap_objects/calques_forms/' . $sOid, 0777, true);
                $sFormsDir = $this->aProperties['ws_data_dir'] . '/vmap/layer/' . $aCalques[$i]['layer_id'] . '/forms';
                if (is_dir($sFormsDir)) {
                    copyDirectory($sFormsDir, $this->sTmpPath . '/vmap_objects/calques_forms/' . $sOid);
                }
            }

            $aCalques[$i]['layer_id'] = $sOid;
        }

        return $aCalques;
    }

    /**
     * Exporte les définitions des couches mapserver dans le fichier JSON correspondant
     * @param array $aVm4msLayerIds
     */
    function exportVMapVm4msLayers($aVm4msLayerIds) {
        $this->aExportedVm4msLayers = $this->getVMapVm4msLayersDefByIds($aVm4msLayerIds);
    }

    /**
     * Récupère les définitions des couches mapserver en fonction des identifiants passés
     * @param array $aVm4msLayerIds
     * @return array
     */
    function getVMapVm4msLayersDefByIds($aVm4msLayerIds) {
        require_once __DIR__ . '/../vm4ms/Layers.class.inc';

        if (empty($aVm4msLayerIds)) {
            return array();
        }

        $aFilter = array(
            'column' => 'name',
            'compare_operator' => 'IN',
            'value' => $aVm4msLayerIds,
        );

        // Valeurs à ne pas importer
        $aUnusedValues = [
            'coordsys_label',
            'source_id',
            'private_connection',
            'connection_label',
            'source_label',
            'definitiontmp',
            'metadata_id',
            'definition_structure_valid'
        ];

        $aPath = ['vmap', 'layers'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'filter' => json_encode($aFilter),
            'module' => 'vmap'
        );

        $oVm4msLayers = new Layers($aPath, $aValues, $this->aProperties);
        $oVm4msLayers->GET();

        $aVm4msLayers = array();
        if (!empty($oVm4msLayers->aObjects)) {
            for ($i = 0; $i < count($oVm4msLayers->aObjects); $i++) {
                if (!empty($oVm4msLayers->aObjects[$i]->aFields)) {
                    array_push($aVm4msLayers, $oVm4msLayers->aObjects[$i]->aFields);
                }
            }
        }

        for ($i = 0; $i < count($aVm4msLayers); $i++) {

            // Set private connection and schema name
            $aVm4msLayers[$i]['connection_id'] = '[PRIVATE_CONNECTION]';
            $aVm4msLayers[$i]['tableschema'] = '[SCHEMA_NAME]';
            $aVm4msLayers[$i]['coordsys_id'] = '[SRID]';

            // Put the metadata in the definition (metadata is not exported)
            if (!empty($aVm4msLayers[$i]['metadata_id'])) {
                $aMetadata = $this->getVMapVm4msMetadataDefById($aVm4msLayers[$i]['metadata_id']);
                if (!empty($aMetadata['definition'])) {
                    $aVm4msLayers[$i]['definition'] = str_replace("{METADATA}", $aMetadata['definition'], $aVm4msLayers[$i]['definition']);
                }
            }

            // Drop unsused values
            foreach ($aVm4msLayers[$i] as $key => $value) {
                if (in_array($key, $aUnusedValues)) {
                    unset($aVm4msLayers[$i][$key]);
                }
            }
        }

        // oids
        for ($i = 0; $i < count($aVm4msLayers); $i++) {
            $aVm4msLayers[$i]['ms_layer_id'] = $this->generateOid('vm4ms_layer', $aVm4msLayers[$i]['ms_layer_id']);
        }

        return $aVm4msLayers;
    }

    /**
     * Get the Vm4ms Metadata definition from his ID
     * @param string $sMetadataId
     * @return array
     */
    function getVMapVm4msMetadataDefById($sMetadataId) {
        require_once __DIR__ . '/../vm4ms/Metadata.class.inc';

        $aPath = ['vmap', 'metadata', $sMetadataId];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'my_vitis_id' => $sMetadataId
        );

        $oVm4msMetadata = new Metadata($aPath, $aValues, $this->aProperties);
        $oVm4msMetadata->GET();

        return $oVm4msMetadata->aFields;
    }

    /**
     * Exporte les définitions des objets métiers dans le fichier JSON correspondant
     * @param array $aBusinessObjectIds
     */
    function exportVMapBusinessObjects($aBusinessObjectIds) {

        // Définitions
        $this->aExportedBusinessObjects = $this->getVMapBusinessObjectDefById($aBusinessObjectIds);

        // Formulaires
        if (count($this->aExportedBusinessObjects) > 0) {
            $this->exportVMapBusinessObjectsForms($this->aExportedBusinessObjects);
        }

        // Remplacements balises
        for ($i = 0; $i < count($this->aExportedBusinessObjects); $i++) {
            $this->aExportedBusinessObjects[$i] = $this->makeVMapBusinessObjectReplacements($this->aExportedBusinessObjects[$i]);
        }
    }

    /**
     * Exporte les formulaires des objets métiers
     * @param array $aBusinessObjects
     */
    function exportVMapBusinessObjectsForms($aBusinessObjects) {

        mkdir($this->sTmpPath . '/vmap_objects/business_objects_forms', 0777, true);
        for ($i = 0; $i < count($aBusinessObjects); $i++) {
            mkdir($this->sTmpPath . '/vmap_objects/business_objects_forms/' . $aBusinessObjects[$i]['business_object_id'], 0777, true);
            $sFormsDir = $this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $aBusinessObjects[$i]['business_object_id'] . '/forms';
            if (is_dir($sFormsDir)) {
                copyDirectory($sFormsDir, $this->sTmpPath . '/vmap_objects/business_objects_forms/' . $aBusinessObjects[$i]['business_object_id']);
            }
        }
    }

    /**
     * Récupère la définition d'un objet métier par son id
     * @param string $sBusinessObjectIds
     * @return array
     */
    function getVMapBusinessObjectDefById($sBusinessObjectIds) {
        require 'Vex.class.sql.inc';

        $aBusinessObjects = false;
        $aParams = array();
        $aParams['idList'] = array('value' => implode('|', $sBusinessObjectIds), 'type' => 'group');
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getBusinessObjectByIds'], $aParams);
        if (!$this->oConnection->oBd->enErreur()) {
            $aBusinessObjects = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);
        }

        return $aBusinessObjects;
    }

    /**
     * Effectue les remplacements de schema et base de données dans la définition ainsi que dans les formulaires
     * @param array $aBusinessObject
     * @return array
     */
    function makeVMapBusinessObjectReplacements($aBusinessObject) {

        $sOriginalDatabase = $aBusinessObject['database'];
        $sOriginalSchema = $aBusinessObject['schema'];

        // Effectue les remplacements dans les fichiers
        $aFileNames = ['custom', 'default', 'published'];
        if (is_dir($this->sTmpPath . '/vmap_objects/business_objects_forms/' . $aBusinessObject['business_object_id'])) {
            for ($i = 0; $i < count($aFileNames); $i++) {
                $sFormPath = $this->sTmpPath . '/vmap_objects/business_objects_forms/' . $aBusinessObject['business_object_id'] . '/' . $aFileNames[$i] . '.json';
                if (is_file($sFormPath)) {
                    $aFileContents = file($sFormPath);

                    for ($ii = 0; $ii < count($aFileContents); $ii++) {
                        $aPatterns = [
                            '/"database": "' . $sOriginalDatabase . '"/',
                            '/"database":"' . $sOriginalDatabase . '"/',
                            '/"schema": "' . $sOriginalSchema . '"/',
                            '/"schema":"' . $sOriginalSchema . '"/'
                        ];
                        $aReplacements = [
                            '"database": "[DATABASE_NAME]"',
                            '"database":"[DATABASE_NAME]"',
                            '"schema": "[SCHEMA_NAME]"',
                            '"schema":"[SCHEMA_NAME]"'
                        ];
                        $aFileContents[$ii] = preg_replace($aPatterns, $aReplacements, $aFileContents[$ii]);
                    }

                    file_put_contents($sFormPath, $aFileContents);
                }
            }
        }

        // Remplacements sur la définition
        $aBusinessObject['database'] = '[DATABASE_NAME]';
        $aBusinessObject['schema'] = '[SCHEMA_NAME]';
        $aBusinessObject['sql_summary'] = preg_replace('/\b'.$sOriginalSchema.'\b/', '[SCHEMA_NAME]', $aBusinessObject['sql_summary']);
        $aBusinessObject['sql_list'] = preg_replace('/\b'.$sOriginalSchema.'\b/', '[SCHEMA_NAME]', $aBusinessObject['sql_list']);

        return $aBusinessObject;
    }

    /**
     * Exporte les définitions des services associés aux calques dans le fichier JSON correspondant
     * @param array $aMapIds
     */
    function exportVMapServices() {
        if (!is_array($this->aExportedCalques)) {
            return false;
        }
        if (!count($this->aExportedCalques) > 0) {
            return false;
        }

        $aServicesIds = [];
        for ($i = 0; $i < count($this->aExportedCalques); $i++) {
            if (!empty($this->aExportedCalques[$i]['service_id'])) {
                array_push($aServicesIds, $this->aExportedCalques[$i]['service_id']);
            }
        }

        $this->aExportedServices = $this->getVMapServicesByIds($aServicesIds);
    }

    /**
     * Récupère les définitions des services en fonction des identifiants
     * @param array $aServiceIds
     * @return array
     */
    function getVMapServicesByIds($aServiceIds) {
        require_once 'Services.class.inc';

        if (empty($aServiceIds)) {
            return array();
        }

        $aFilter = array(
            'column' => 'service_id',
            'compare_operator' => 'IN',
            'value' => $aServiceIds,
        );

        // Valeurs à ne pas importer
        $aUnusedValues = [
            'thumbnail'
        ];

        $aPath = ['vmap', 'services'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'filter' => json_encode($aFilter),
            'module' => 'vmap'
        );

        $oServices = new Services($aPath, $aValues, $this->aProperties);
        $oServices->GET();

        $aServices = array();
        if (!empty($oServices->aObjects)) {
            for ($i = 0; $i < count($oServices->aObjects); $i++) {
                if (!empty($oServices->aObjects[$i]->aFields)) {
                    if ($oServices->aObjects[$i]->aFields['service_vm4ms'] !== true) {
                        array_push($aServices, $oServices->aObjects[$i]->aFields);
                    }
                }
            }
        }

        // Drop unsused values
        for ($i = 0; $i < count($aServices); $i++) {
            foreach ($aServices[$i] as $key => $value) {
                if (in_array($key, $aUnusedValues)) {
                    unset($aServices[$i][$key]);
                }
            }
        }

        // oids
        for ($i = 0; $i < count($aServices); $i++) {
            $aServices[$i]['service_id'] = $this->generateOid('service', $aServices[$i]['service_id']);
        }

        return $aServices;
    }

    /**
     * Exporte les définitions des themes associés aux calques dans le fichier JSON correspondant
     * @param array $aMapIds
     */
    function exportVMapCalqueThemes() {
        if (!is_array($this->aExportedCalques)) {
            return false;
        }
        if (!count($this->aExportedCalques) > 0) {
            return false;
        }
        $aLayerThemeIds = [];
        for ($i = 0; $i < count($this->aExportedCalques); $i++) {
            if (!empty($this->aExportedCalques[$i]['layertheme_id'])) {
                array_push($aLayerThemeIds, $this->aExportedCalques[$i]['layertheme_id']);
            }
        }

        $this->aExportedCalqueThemes = $this->getVMapCalqueThemesByIds($aLayerThemeIds);
    }

    /**
     * Récupère les définitions des themes de calques en fonction des identifiants
     * @param array $aLayerThemeIds
     * @return array
     */
    function getVMapCalqueThemesByIds($aLayerThemeIds) {
        require_once 'LayerThemes.class.inc';

        if (empty($aLayerThemeIds)) {
            return array();
        }

        $aFilter = array(
            'column' => 'layertheme_id',
            'compare_operator' => 'IN',
            'value' => $aLayerThemeIds,
        );

        $aPath = ['vmap', 'layerthemes'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'filter' => json_encode($aFilter),
            'module' => 'vmap'
        );

        $oLayerThemes = new LayerThemes($aPath, $aValues, $this->aProperties);
        $oLayerThemes->GET();

        $aLayerThemes = array();
        if (!empty($oLayerThemes->aObjects)) {
            for ($i = 0; $i < count($oLayerThemes->aObjects); $i++) {
                if (!empty($oLayerThemes->aObjects[$i]->aFields)) {
                    array_push($aLayerThemes, $oLayerThemes->aObjects[$i]->aFields);
                }
            }
        }

        // oids
        for ($i = 0; $i < count($aLayerThemes); $i++) {
            $aLayerThemes[$i]['layertheme_id'] = $this->generateOid('layertheme', $aLayerThemes[$i]['layertheme_id']);
        }

        return $aLayerThemes;
    }

    /**
     * Exporte les définitions des événements associés aux objets métier dans le fichier JSON correspondant
     * @param array $aMapIds
     */
    function exportVMapEvents() {
        if (!is_array($this->aExportedBusinessObjects)) {
            return false;
        }
        if (!count($this->aExportedBusinessObjects) > 0) {
            return false;
        }
        $aEventIds = [];
        for ($i = 0; $i < count($this->aExportedBusinessObjects); $i++) {
            if (!empty($this->aExportedBusinessObjects[$i]['event_id'])) {
                array_push($aEventIds, $this->aExportedBusinessObjects[$i]['event_id']);
            }
        }

        $this->aExportedEvents = $this->getVMapEventsByIds($aEventIds);
    }

    /**
     * Récupère les définitions des événements en fonction des identifiants
     * @param array $aEventIds
     * @return array
     */
    function getVMapEventsByIds($aEventIds) {
        require_once 'BusinessObjectEvents.class.inc';

        if (empty($aEventIds)) {
            return array();
        }

        $aFilter = array(
            'column' => 'event_id',
            'compare_operator' => 'IN',
            'value' => $aEventIds,
        );

        $aPath = ['vmap', 'businessobjectevents'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'filter' => json_encode($aFilter),
            'module' => 'vmap'
        );

        $oEvents = new BusinessObjectEvents($aPath, $aValues, $this->aProperties);
        $oEvents->GET();

        $aEvents = array();
        if (!empty($oEvents->aObjects)) {
            for ($i = 0; $i < count($oEvents->aObjects); $i++) {
                if (!empty($oEvents->aObjects[$i]->aFields)) {
                    array_push($aEvents, $oEvents->aObjects[$i]->aFields);
                }
            }
        }

        return $aEvents;
    }

    /**
     * Exporte les définitions des événements associés aux objets métier dans le fichier JSON correspondant
     * @param array $aMapIds
     */
    function exportVMapReports() {
        if (!is_array($this->aExportedBusinessObjects)) {
            return false;
        }
        if (!count($this->aExportedBusinessObjects) > 0) {
            return false;
        }

        $aBoIds = [];
        for ($i = 0; $i < count($this->aExportedBusinessObjects); $i++) {
            array_push($aBoIds, $this->aExportedBusinessObjects[$i]['business_object_id']);
        }
        $this->aExportedReports = $this->getVMapReportsByBusinessObjectsIds($aBoIds);
    }

    /**
     * Récupère les définitions des événements en fonction des bo_id
     * @param array $aEventIds
     * @return array
     */
    function getVMapReportsByBusinessObjectsIds($aBoIds) {
        require_once 'PrintReports.class.inc';

        if (empty($aBoIds)) {
            return array();
        }

        $aFilter = array(
            'column' => 'business_object_id',
            'compare_operator' => 'IN',
            'value' => $aBoIds,
        );

        // Valeurs à ne pas importer
        $aUnusedValues = [
            'business_object_title',
            'business_object_id_field',
            'business_object_database',
            'business_object_schema',
            'business_object_table',
            'business_object_geom_column'
        ];

        $aPath = ['vmap', 'printreports'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'filter' => json_encode($aFilter),
            'module' => 'vmap'
        );

        $oReports = new PrintReports($aPath, $aValues, $this->aProperties);
        $oReports->GET();

        $aReports = array();
        if (!empty($oReports->aObjects)) {
            for ($i = 0; $i < count($oReports->aObjects); $i++) {
                if (!empty($oReports->aObjects[$i]->aFields)) {
                    array_push($aReports, $oReports->aObjects[$i]->aFields);
                }
            }
        }

        // Drop unsused values
        for ($i = 0; $i < count($aReports); $i++) {
            foreach ($aReports[$i] as $key => $value) {
                if (in_array($key, $aUnusedValues)) {
                    unset($aReports[$i][$key]);
                }
            }
        }

        // oids
        for ($i = 0; $i < count($aReports); $i++) {
            $aReports[$i]['printreport_id'] = $this->generateOid('printreport', $aReports[$i]['printreport_id']);
        }

        return $aReports;
    }

    /**
     * Exporte les définitions des relations calque / map
     * associés aux cartes et calques dans le fichier JSON correspondant
     * @param array $aMapIds
     */
    function exportVMapCalqueMapRelations() {

        if (!is_array($this->aExportedCalques)) {
            return false;
        }
        if (!count($this->aExportedCalques) > 0) {
            return false;
        }
        if (!is_array($this->aExportedMaps)) {
            return false;
        }
        if (!count($this->aExportedMaps) > 0) {
            return false;
        }

        $aMapIds = [];
        for ($i = 0; $i < count($this->aExportedMaps); $i++) {
            if (!empty($this->aExportedMaps[$i]['map_id'])) {
                if (!empty($this->aOids['map'][$this->aExportedMaps[$i]['map_id']])) {
                    array_push($aMapIds, $this->aOids['map'][$this->aExportedMaps[$i]['map_id']]);
                }
            }
        }

        $aCalqueIds = [];
        for ($i = 0; $i < count($this->aExportedCalques); $i++) {
            if (!empty($this->aExportedCalques[$i]['layer_id'])) {
                if (!empty($this->aOids['calque'][$this->aExportedCalques[$i]['layer_id']])) {
                    array_push($aCalqueIds, $this->aOids['calque'][$this->aExportedCalques[$i]['layer_id']]);
                }
            }
        }

        if (!empty($aMapIds) && !empty($aCalqueIds)) {
            $this->aExportedMapCalqueRelations = $this->getVMapCalqueMapRelationsFromIds($aMapIds, $aCalqueIds);
        }
    }

    /**
     * Récupère les définitions des relations calque / map  en fonction des map_id et layer_id
     * @param array $aMapIds
     * @param array $aCalqueIds
     * @return array
     */
    function getVMapCalqueMapRelationsFromIds($aMapIds, $aCalqueIds) {
        require_once 'MapLayers.class.inc';

        if (empty($aMapIds) || empty($aCalqueIds)) {
            return array();
        }

        $aFilter = array(
            'relation' => 'and',
            'operators' => array(array(
                    'column' => 'map_id',
                    'compare_operator' => 'IN',
                    'value' => $aMapIds,
                ), array(
                    'column' => 'layer_id',
                    'compare_operator' => 'IN',
                    'value' => $aCalqueIds,
                ))
        );

        $aPath = ['vmap', 'maplayers'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'filter' => json_encode($aFilter),
            'order_by' => 'layer_index',
            'module' => 'vmap'
        );

        $oMapCalques = new MapLayers($aPath, $aValues, $this->aProperties);
        $oMapCalques->GET();

        $aMapCalques = array();
        if (!empty($oMapCalques->aObjects)) {
            for ($i = 0; $i < count($oMapCalques->aObjects); $i++) {
                if (!empty($oMapCalques->aObjects[$i]->aFields)) {
                    array_push($aMapCalques, $oMapCalques->aObjects[$i]->aFields);
                }
            }
        }

        return $aMapCalques;
    }

    /**
     * Remplace les identifinants des dépendances entre les objets vMap par leurs Oid respectifs
     */
    function manageVMapObjectDependencies() {

        // Calques
        for ($i = 0; $i < count($this->aExportedCalques); $i++) {
            // Services
            if (!empty($this->aOids['service'])) {
                if ($this->aExportedCalques[$i]['service_vm4ms']) {
                    $this->aExportedCalques[$i]['service_id'] = '[PRIVATE_SERVICE]';
                } else {
                    $sOid = array_search($this->aExportedCalques[$i]['service_id'], $this->aOids['service']);
                    if ($sOid !== false) {
                        $this->aExportedCalques[$i]['service_id'] = $sOid;
                    }
                }
            }
            // Themes
            if (!empty($this->aOids['layertheme'])) {
                $sOid = array_search($this->aExportedCalques[$i]['layertheme_id'], $this->aOids['layertheme']);
                if ($sOid !== false) {
                    $this->aExportedCalques[$i]['layertheme_id'] = $sOid;
                }
            }
            // Vérification de l'existance des Couches MS
            if (!empty($this->aExportedCalques[$i]['layer_list'])) {
                $aLayerList = explode(',', $this->aExportedCalques[$i]['layer_list']);
                $aVm4msLayerNames = [];
                if (!empty($this->aExportedVm4msLayers)){
                  for ($ii = 0; $ii < count($this->aExportedVm4msLayers); $ii++) {
                      array_push($aVm4msLayerNames, $this->aExportedVm4msLayers[$ii]['name']);
                  }
                }
                for ($ii = count($aLayerList) - 1; $ii >= 0; $ii--) {
                    if (!in_array($aLayerList[$ii], $aVm4msLayerNames)) {
                        unset($aLayerList[$ii]);
                    }
                }
                $this->aExportedCalques[$i]['layer_list'] = implode(',', $aLayerList);
            }

            // Vérification de l'existance des Objets métier
            if (!empty($this->aExportedCalques[$i]['bo_id_list'])) {
                $aBoList = explode('|', $this->aExportedCalques[$i]['bo_id_list']);
                $aBoNames = [];
                for ($ii = 0; $ii < count($this->aExportedBusinessObjects); $ii++) {
                    array_push($aBoNames, $this->aExportedBusinessObjects[$ii]['business_object_id']);
                }
                for ($ii = count($aBoList) - 1; $ii >= 0; $ii--) {
                    if (!in_array($aBoList[$ii], $aBoNames)) {
                        unset($aBoList[$ii]);
                    }
                }
                $this->aExportedCalques[$i]['bo_id_list'] = implode('|', $aBoList);
            }
        }

        // Relation calque carte
        for ($i = 0; $i < count($this->aExportedMapCalqueRelations); $i++) {
            if (!empty($this->aOids['calque'])) {
                $sOid = array_search($this->aExportedMapCalqueRelations[$i]['layer_id'], $this->aOids['calque']);
                if ($sOid !== false) {
                    $this->aExportedMapCalqueRelations[$i]['layer_id'] = $sOid;
                }
            }
            if (!empty($this->aOids['map'])) {
                $sOid = array_search($this->aExportedMapCalqueRelations[$i]['map_id'], $this->aOids['map']);
                if ($sOid !== false) {
                    $this->aExportedMapCalqueRelations[$i]['map_id'] = $sOid;
                }
            }
        }
    }

    /**
     * Écrit les dépendances dans des fichiers JSON correspondants
     */
    function generateDefinitionFiles() {

        if (!empty($this->aExportedMaps)) {
            if (count($this->aExportedMaps) > 0) {
                $this->aExportedMaps = $this->replaceBooleans($this->aExportedMaps);
                file_put_contents($this->sTmpPath . '/vmap_objects/maps.json', json_encode($this->aExportedMaps));
            }
        }
        if (!empty($this->aExportedCalques)) {
            if (count($this->aExportedCalques) > 0) {
                $this->aExportedCalques = $this->replaceBooleans($this->aExportedCalques);
                file_put_contents($this->sTmpPath . '/vmap_objects/calques.json', json_encode($this->aExportedCalques));
            }
        }
        if (!empty($this->aExportedVm4msLayers)) {
            if (count($this->aExportedVm4msLayers) > 0) {
                $this->aExportedVm4msLayers = $this->replaceBooleans($this->aExportedVm4msLayers);
                file_put_contents($this->sTmpPath . '/vmap_objects/vm4ms_layers.json', json_encode($this->aExportedVm4msLayers));
            }
        }
        if (!empty($this->aExportedServices)) {
            if (count($this->aExportedServices) > 0) {
                $this->aExportedServices = $this->replaceBooleans($this->aExportedServices);
                file_put_contents($this->sTmpPath . '/vmap_objects/services.json', json_encode($this->aExportedServices));
            }
        }
        if (!empty($this->aExportedBusinessObjects)) {
            if (count($this->aExportedBusinessObjects) > 0) {
                $this->aExportedBusinessObjects = $this->replaceBooleans($this->aExportedBusinessObjects);
                file_put_contents($this->sTmpPath . '/vmap_objects/business_objects.json', json_encode($this->aExportedBusinessObjects));
            }
        }
        if (!empty($this->aExportedCalqueThemes)) {
            if (count($this->aExportedCalqueThemes) > 0) {
                $this->aExportedCalqueThemes = $this->replaceBooleans($this->aExportedCalqueThemes);
                file_put_contents($this->sTmpPath . '/vmap_objects/layerthemes.json', json_encode($this->aExportedCalqueThemes));
            }
        }
        if (!empty($this->aExportedEvents)) {
            if (count($this->aExportedEvents) > 0) {
                $this->aExportedEvents = $this->replaceBooleans($this->aExportedEvents);
                file_put_contents($this->sTmpPath . '/vmap_objects/events.json', json_encode($this->aExportedEvents));
            }
        }
        if (!empty($this->aExportedReports)) {
            if (count($this->aExportedReports) > 0) {
                $this->aExportedReports = $this->replaceBooleans($this->aExportedReports);
                file_put_contents($this->sTmpPath . '/vmap_objects/reports.json', json_encode($this->aExportedReports));
            }
        }
        if (!empty($this->aExportedMapCalqueRelations)) {
            if (count($this->aExportedMapCalqueRelations) > 0) {
                $this->aExportedMapCalqueRelations = $this->replaceBooleans($this->aExportedMapCalqueRelations);
                file_put_contents($this->sTmpPath . '/vmap_objects/map_layer.json', json_encode($this->aExportedMapCalqueRelations));
            }
        }
    }

    /**
     * Remplace les booléens par "true" et "false"
     * @param array $aVMapObjects
     * @return array
     */
    function replaceBooleans($aVMapObjects) {
        for ($i = 0; $i < count($aVMapObjects); $i++) {
            foreach ($aVMapObjects[$i] as $key => $value) {
                if ($aVMapObjects[$i][$key] === true) {
                    $aVMapObjects[$i][$key] = 'true';
                }
                if ($aVMapObjects[$i][$key] === false) {
                    $aVMapObjects[$i][$key] = 'false';
                }
            }
        }

        return $aVMapObjects;
    }

    // Services web

    /**
     * Exporte les services web
     */
    function exportWebServices() {

        $aWebServices = $this->aValues['web_services'];

        if (count($aWebServices) > 0) {

            // Dossier web_services
            mkdir($this->sTmpPath . '/web_services', 0777, true);

            for ($i = 0; $i < count($aWebServices); $i++) {
                if (strpos($aWebServices[$i], '../') === false) {
                    if (is_dir($this->aProperties['vas_home'] . '/rest/ws/' . $aWebServices[$i])) {
                        copyDirectory($this->aProperties['vas_home'] . '/rest/ws/' . $aWebServices[$i], $this->sTmpPath . '/web_services/' . $aWebServices[$i]);
                    }
                }
            }
        }
    }

}

?>

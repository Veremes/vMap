<?php

/**
 * \file VexParser.class.inc
 * \class VexParser
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the VexParser php class
 *
 * This class defines php functions to export VEX files
 * 
 */
require_once 'Vex.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Form.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';
require_once 'vmlib/logUtil.inc';

/**
 * Classe contenant les fonctions permettant de récupérer 
 * les informations sur les différents objets à exporter
 */
class VexParser extends Vmap {

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
     * Parse un vex et retourne son contenu au format JSON
     * @return string
     */
    function parseVex() {

        $this->aReturn = Array();

        if (!in_array('vitis_admin', $this->oConnection->aPrivileges) ||
                !in_array('vmap_admin', $this->oConnection->aPrivileges) ||
                !in_array('vm4ms_admin', $this->oConnection->aPrivileges)) {
            $oError = new VitisError(0, 'insufficient privileges (needs to be vitis_admin, vmap_admin and vm4ms_admin)');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }
        if (!isset($_FILES['vex_file'])) {
            $oError = new VitisError(0, 'vex_file not found');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        // Nom du fichier recu
        $this->sFileName = $_FILES['vex_file']['name'];

        // Nom du dossier décompressé
        $this->sFolderName = str_replace('.vex', '', $this->sFileName);

        // Test format du package
        if (substr($this->sFileName, -4) !== '.vex') {
            $oError = new VitisError(0, 'Package not valid');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        // Dossier temporaire
        $this->sTmpFolder = $this->createTmpFolder();

        // Dossier décompressé
        $this->sFolderPath = $this->sTmpFolder . '/' . $this->sFolderName;

        if (!is_dir($this->sFolderPath)) {
            $oError = new VitisError(0, 'Package not valid 2');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        // Contenu SQL
        $aSqlContent = $this->getSQLFromVexContent($this->sFolderPath);
        if (!empty($aSqlContent['export_model_sql'])) {
            $this->aReturn['sql'] = $aSqlContent;
        }

        // Objets vMap
        $aVMapObjectsDef = $this->getVMapObjectsDefFromVexContent($this->sFolderPath);
        if (!empty($aVMapObjectsDef)) {
            $this->aReturn['vmap_objects'] = $aVMapObjectsDef;
        }

        // Services Web
        $aWebServicesNames = $this->getWebServicesNamesFromVexContent($this->sFolderPath);
        if (!empty($aWebServicesNames)) {
            $this->aReturn['web_services'] = $aWebServicesNames;
        }

        // Supprime le dossier temporaire
        $this->deleteTmpFolder($this->sTmpFolder);

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
        } else {

            $this->aReturn = array(
                'vex' => $this->aReturn,
                'status' => 1
            );
            return json_encode($this->aReturn);
        }
    }

    /**
     * Crée un répertoire temporaire de travail
     * @return string
     */
    function createTmpFolder() {
        $sTmpName = $this->UniqFileName();
        $sTmpPath = $this->aProperties['vas_home'] . '/tmp/' . $sTmpName;
        if (is_dir($sTmpPath)) {
            clearDir($sTmpPath);
        }
        // Dézippe le contennu dans un dossier dans tmp
        $this->postFileSave('vex_file', '../../tmp/', $sTmpName);
        unZip($sTmpPath . '/' . $this->sFileName, $sTmpPath . '/' . $this->sFolderName);

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
     * Récupère le contenu SQL
     * @param string $sFolderPath
     * @return array
     */
    function getSQLFromVexContent($sFolderPath) {
        $aReturn = [];
        if (is_dir($sFolderPath . '/sql')) {
            if (is_file($sFolderPath . '/sql/export_model_sql.sql')) {
                $aReturn['export_model_sql'] = file_get_contents($sFolderPath . '/sql/export_model_sql.sql');
                if (is_file($sFolderPath . '/sql/export_data_sql.sql')) {
                    $aReturn['export_data_sql'] = file_get_contents($sFolderPath . '/sql/export_data_sql.sql');
                }
            }
        }
        return $aReturn;
    }

    /**
     * Récupère les définitions des objets vMap
     * @param string $sFolderPath
     * @return array
     */
    function getVMapObjectsDefFromVexContent($sFolderPath) {
        $aReturn = [];
        if (is_dir($sFolderPath . '/vmap_objects')) {

            // Objets métier
            if (is_file($sFolderPath . '/vmap_objects/business_objects.json')) {
                $aReturn['business_objects'] = json_decode(file_get_contents($sFolderPath . '/vmap_objects/business_objects.json'), true);
                $aReturn['business_objects_forms'] = $this->getObjectForms($sFolderPath . '/vmap_objects/business_objects_forms');
            }

            // Calques
            if (is_file($sFolderPath . '/vmap_objects/calques.json')) {
                $aReturn['calques'] = json_decode(file_get_contents($sFolderPath . '/vmap_objects/calques.json'), true);
                $aReturn['calques_forms'] = $this->getObjectForms($sFolderPath . '/vmap_objects/calques_forms');
            }

            // Thèmes des calques
            if (is_file($sFolderPath . '/vmap_objects/layerthemes.json')) {
                $aReturn['calque_themes'] = json_decode(file_get_contents($sFolderPath . '/vmap_objects/layerthemes.json'), true);
            }

            // Events
            if (is_file($sFolderPath . '/vmap_objects/events.json')) {
                $aReturn['events'] = json_decode(file_get_contents($sFolderPath . '/vmap_objects/events.json'), true);
            }

            // Relation carte calque
            if (is_file($sFolderPath . '/vmap_objects/map_layer.json')) {
                $aReturn['map_layer'] = json_decode(file_get_contents($sFolderPath . '/vmap_objects/map_layer.json'), true);
            }

            // Cartes
            if (is_file($sFolderPath . '/vmap_objects/maps.json')) {
                $aReturn['maps'] = json_decode(file_get_contents($sFolderPath . '/vmap_objects/maps.json'), true);
            }

            // Rapports
            if (is_file($sFolderPath . '/vmap_objects/reports.json')) {
                $aReturn['reports'] = json_decode(file_get_contents($sFolderPath . '/vmap_objects/reports.json'), true);
            }

            // Services
            if (is_file($sFolderPath . '/vmap_objects/services.json')) {
                $aReturn['services'] = json_decode(file_get_contents($sFolderPath . '/vmap_objects/services.json'), true);
            }

            // Couches Mapserver
            if (is_file($sFolderPath . '/vmap_objects/vm4ms_layers.json')) {
                $aReturn['vm4ms_layers'] = json_decode(file_get_contents($sFolderPath . '/vmap_objects/vm4ms_layers.json'), true);
            }
        }
        return $aReturn;
    }

    /**
     * Récupère les définitions des formulaires vMap
     * @param string $sFolderPath
     * @return array
     */
    function getObjectForms($sFolderPath) {
        $aForms = [];
        if (is_dir($sFolderPath)) {
            chdir($sFolderPath);
            $aDirs = glob('*', GLOB_ONLYDIR);
            for ($i = 0; $i < count($aDirs); $i++) {
                $sObjectDirPath = $sFolderPath . '/' . $aDirs[$i];
                if (is_dir($sObjectDirPath)) {
                    $aForms[$aDirs[$i]] = $this->getObjectFormsFromPath($sObjectDirPath);
                }
            }
        }
        return $aForms;
    }

    /**
     * Get the forms of a vMap object
     * @param string $sFormsPath
     * @return array
     */
    function getObjectFormsFromPath($sFormsPath) {
        $aReturn = [];

        if (is_file($sFormsPath . '/custom.json')) {
            $aReturn['custom'] = json_decode(file_get_contents($sFormsPath . '/custom.json'), true);
        }
        if (is_file($sFormsPath . '/default.json')) {
            $aReturn['default'] = json_decode(file_get_contents($sFormsPath . '/default.json'), true);
        }
        if (is_file($sFormsPath . '/published.json')) {
            $aReturn['published'] = json_decode(file_get_contents($sFormsPath . '/published.json'), true);
        }
        if (is_dir($sFormsPath . '/ressources')) {
            $aReturn['ressources'] = array();
            if (is_file($sFormsPath . '/ressources/custom.js')) {
                $aReturn['ressources']['js']['custom'] = file_get_contents($sFormsPath . '/ressources/custom.js');
            }
            if (is_file($sFormsPath . '/ressources/default.js')) {
                $aReturn['ressources']['js']['default'] = file_get_contents($sFormsPath . '/ressources/default.js');
            }
            if (is_file($sFormsPath . '/ressources/published.js')) {
                $aReturn['ressources']['js']['published'] = file_get_contents($sFormsPath . '/ressources/published.js');
            }
            if (is_file($sFormsPath . '/ressources/custom.css')) {
                $aReturn['ressources']['css']['custom'] = file_get_contents($sFormsPath . '/ressources/custom.css');
            }
            if (is_file($sFormsPath . '/ressources/default.css')) {
                $aReturn['ressources']['css']['default'] = file_get_contents($sFormsPath . '/ressources/default.css');
            }
            if (is_file($sFormsPath . '/ressources/published.css')) {
                $aReturn['ressources']['css']['published'] = file_get_contents($sFormsPath . '/ressources/published.css');
            }
        }

        return $aReturn;
    }

    /**
     * Récupère les noms des services web
     * @param string $sFolderPath
     * @return array
     */
    function getWebServicesNamesFromVexContent($sFolderPath) {
        $aReturn = [];
        if (is_dir($sFolderPath . '/web_services')) {

            // Liste des répertoires contennus dans web_services
            chdir($sFolderPath . '/web_services');
            $aDirs = glob('*', GLOB_ONLYDIR);
            for ($i = 0; $i < count($aDirs); $i++) {

                // Dossier
                $aFolder = ['name' => $aDirs[$i]];

                // Fichiers
                chdir($sFolderPath . '/web_services/' . $aDirs[$i]);
                $aFolder['files'] = [];
                $aFiles = glob('*');
                for ($ii = 0; $ii < count($aFiles); $ii++) {
                    if (is_file($sFolderPath . '/web_services/' . $aDirs[$i] . '/' . $aFiles[$ii])) {
                        $aFolder['files'][$aFiles[$ii]] = file_get_contents($sFolderPath . '/web_services/' . $aDirs[$i] . '/' . $aFiles[$ii]);
                    }
                }

                array_push($aReturn, $aFolder);
            }
        }
        return $aReturn;
    }

}

?>
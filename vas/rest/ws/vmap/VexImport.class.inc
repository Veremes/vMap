<?php

/**
 * \file VexImport.class.inc
 * \class VexImport
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the VexImport php class
 *
 * This class defines php functions to import VEX files
 *
 */
require_once 'Vex.class.inc';
require_once 'VexGetter.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Form.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';
require_once 'vmlib/logUtil.inc';

/**
 * Permet l'import de fichiers VEX en utilisant les paramètres
 * vmap_objects, web_services, sql_objects passés dans $this->aValues
 */
class VexImport extends Vmap {

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

    // Import d'objets vMap

    /**
     * Permet d'importer les objets vMap
     */
    function importVMapObjects() {

        $this->aReturn = Array();

        if (!in_array('vitis_admin', $this->oConnection->aPrivileges) ||
                !in_array('vmap_admin', $this->oConnection->aPrivileges) ||
                !in_array('vm4ms_admin', $this->oConnection->aPrivileges)) {
            $oError = new VitisError(0, 'insufficient privileges (needs to be vitis_admin, vmap_admin and vm4ms_admin)');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        if (!isset($this->aValues['vmap_objects']) || !isset($this->aValues['database']) || !isset($this->aValues['schema']) || !isset($this->aValues['srid'])) {
            $oError = new VitisError(0, 'Parameters vmap_objects, database, schema, srid required');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        /**
         * Objets vMap à importer
         */
        $this->aVmapObjects = json_decode($this->aValues['vmap_objects'], true);

        /**
         * Objet VexGetter permettant de recueillir des informations essentielles
         */
        $this->oVexGetter = new VexGetter($this->aPath, $this->aValues, $this->aProperties);

        /**
         * Connexion privée
         */
        $this->oPrivateConnection = $this->getPrivateConnection();
        if ($this->oPrivateConnection === false) {
            $oError = new VitisError(0, 'Impossible de récupérer la connexion privée');
        }

        /**
         * Service privé
         */
        $this->oPrivateService = $this->getPrivateService();
        if ($this->oPrivateService === false) {
            $oError = new VitisError(0, 'Impossible de récupérer le service privé');
        }

        /**
         * Gestion erreur contenu
         */
        if (!is_array($this->aVmapObjects)) {
            $oError = new VitisError(0, 'vmap_objects non valide');
        }

        if (!isset($oError)) {

            // Remplace la balise [DATABASE_NAME]
            $this->replaceOccurences('[DATABASE_NAME]', $this->aValues['database']);

            // Remplace la balise [SCHEMA_NAME]
            $this->replaceOccurences('[SCHEMA_NAME]', $this->aValues['schema']);

            // Remplace la balise [SRID]
            $this->replaceOccurences('[SRID]', $this->aValues['srid']);

            // Remplace la balise [PRIVATE_SERVICE]
            $this->replaceOccurences('[PRIVATE_SERVICE]', $this->oPrivateService['service_id']);

            // Remplace la balise [PRIVATE_CONNECTION]
            $this->replaceOccurences('[PRIVATE_CONNECTION]', $this->oPrivateConnection['connection_id']);

            // Import des cartes
            if (!empty($this->aVmapObjects['maps'])) {
                $this->aReturn['maps'] = $this->importVMapMaps($this->aVmapObjects['maps']);
            }

            // Import des services
            if (!empty($this->aVmapObjects['services'])) {
                $this->aReturn['services'] = $this->importVMapServices($this->aVmapObjects['services']);
            }

            // Import themes des calques
            if (!empty($this->aVmapObjects['calque_themes'])) {
                $this->aReturn['calque_themes'] = $this->importVMapCalqueThemes($this->aVmapObjects['calque_themes']);
            }

            // Import événements
            if (!empty($this->aVmapObjects['events'])) {
                $this->aReturn['events'] = $this->importVMapEvents($this->aVmapObjects['events']);
            }

            // Import objets métiers
            if (!empty($this->aVmapObjects['business_objects'])) {
                $this->aReturn['business_objects'] = $this->importVMapBusinessObjects($this->aVmapObjects['business_objects']);
            }

            // Import rapports
            if (!empty($this->aVmapObjects['reports'])) {
                $this->aReturn['reports'] = $this->importVMapReports($this->aVmapObjects['reports']);
            }

            // Import couches Mapserver
            if (!empty($this->aVmapObjects['vm4ms_layers'])) {
                $this->aReturn['vm4ms_layers'] = $this->importVMapVm4msLayers($this->aVmapObjects['vm4ms_layers']);
            }

            // Import des calques
            if (!empty($this->aVmapObjects['calques'])) {
                $this->aReturn['calques'] = $this->importVMapCalques($this->aVmapObjects['calques']);
            }

            // Import relation map layer
            if (!empty($this->aVmapObjects['map_layer'])) {
                $this->aReturn['map_layer'] = $this->importVMapMapCalquesRelation($this->aVmapObjects['map_layer']);
            }
        }

        if (isset($oError)) {
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        } elseif (isset($this->oError)) {
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
                'vmap_objects' => $this->aReturn,
                'status' => 1
            );
            return json_encode($this->aReturn);
        }
    }

    /**
     * Remplace les occurences dans les objet vMap par la valeur passée en paramètre
     * Utilisée pour remplacer les balises et les oid par exemple
     * @param string $sOccurence
     * @param string $sNewValue
     */
    function replaceOccurences($sOccurence, $sNewValue) {
        if (!empty($sNewValue)) {
            foreach ($this->aVmapObjects as $key => $value) {
                switch ($key) {
                    case 'business_objects':
                    case 'calques':
                    case 'calque_themes':
                    case 'events':
                    case 'map_layer':
                    case 'maps':
                    case 'reports':
                    case 'services':
                    case 'vm4ms_layers':
                        for ($i = 0; $i < count($this->aVmapObjects[$key]); $i++) {
                            foreach ($this->aVmapObjects[$key][$i] as $key2 => $value2) {
                                if ($value2 === $sOccurence) {
                                    $this->aVmapObjects[$key][$i][$key2] = $sNewValue;
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    /**
     * Récupère la définition de la connexion privée
     * @return array
     */
    function getPrivateConnection() {

        $aVm4msPrivateConnections = $this->oVexGetter->getVMapVm4msConnections(true);

        $iPrivateConnection = false;
        if (!empty($aVm4msPrivateConnections[0])) {
            if (!empty($aVm4msPrivateConnections[0]['connection_id'])) {
                $iPrivateConnection = $aVm4msPrivateConnections[0];
            }
        }

        return $iPrivateConnection;
    }

    /**
     * Récupère la définition du service privé
     * @return array
     */
    function getPrivateService() {

        $aServices = $this->oVexGetter->getVMapServices(null, ['service_id', 'name', 'url', 'service_vm4ms']);

        $iPrivateService = false;

        // Tente avec l'url
        for ($i = 0; $i < count($aServices); $i++) {
            if ($aServices[$i]['service_vm4ms']) {
                if ($aServices[$i]['url'] = $this->aProperties["ms_cgi_url"] . '/private/[token]') {
                    $iPrivateService = $aServices[$i];
                }
            }
        }

        // Re-tente avec la balise [token]
        if ($iPrivateService === false) {
            for ($i = 0; $i < count($aServices); $i++) {
                if ($aServices[$i]['service_vm4ms']) {
                    if (strpos($aServices[$i]['url'], '[token]') !== false) {
                        $iPrivateService = $aServices[$i];
                    }
                }
            }
        }

        // Re-tente avec le nom
        if ($iPrivateService === false) {
            for ($i = 0; $i < count($aServices); $i++) {
                if ($aServices[$i]['service_vm4ms']) {
                    if ($aServices[$i]['name'] === 'vm4ms_private') {
                        $iPrivateService = $aServices[$i];
                    }
                }
            }
        }

        return $iPrivateService;
    }

    // Import Cartes

    /**
     * Import des cartes vMap
     * @param array $aMaps
     */
    function importVMapMaps($aMaps) {
        $aReturn = [];
        for ($i = 0; $i < count($aMaps); $i++) {
            if (!empty($aMaps[$i]['name'])) {
                $aExistingMaps = $this->getSameNameMaps($aMaps[$i]);
                if (count($aExistingMaps) > 0) {
                    for ($ii = 0; $ii < count($aExistingMaps); $ii++) {
                        if (!empty($aExistingMaps[$ii]['map_id'])) {
                            $sNewId = $this->updateVMapMap($aMaps[$i], $aExistingMaps[$ii]['map_id']);
                            $this->replaceOccurences($aMaps[$i]['map_id'], $sNewId);
                            array_push($aReturn, $sNewId);
                        }
                    }
                } else {
                    $sNewId = $this->addVMapMap($aMaps[$i]);
                    $this->replaceOccurences($aMaps[$i]['map_id'], $sNewId);
                    array_push($aReturn, $sNewId);
                }
            }
        }
        return $aReturn;
    }

    /**
     * Récupère les cartes ayant le même nom
     * @param array $aMap
     * @return array
     */
    function getSameNameMaps($aMap) {
        $aExistingMaps = $this->oVexGetter->getVMapMaps($aMap['name']);
        return $aExistingMaps;
    }

    /**
     * Crée une nouvelle carte
     * @param array $aMap
     */
    function addVMapMap($aMap) {
        require_once 'Maps.class.inc';

        // Attributs à ne pas envoyer
        $aUnusedValues = ['map_id', 'thumbnail', 'theme_name', 'theme_description', 'maptheme_id', 'crs_name', 'catalog_index'];

        // Options à passer
        $aPath = ['vmap', 'maps'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet']
        );
        foreach ($aMap as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }

        $oVitisObject = new Maps($aPath, $aValues, $this->aProperties);
        $oVitisObject->POST();

        $sReturnedId = false;
        if (!empty($oVitisObject->aFields)) {
            if (!empty($oVitisObject->aFields['map_id'])) {
                $sReturnedId = $oVitisObject->aFields['map_id'];
            }
        }
        return $sReturnedId;
    }

    /**
     * Met à jour une carte existante
     * @param array $aMap
     * @param string $sMapId identifiant de la carte à mettre à jour
     */
    function updateVMapMap($aMap, $sMapId) {
        require_once 'Maps.class.inc';

        // Attributs à ne pas envoyer
        $aUnusedValues = ['map_id', 'thumbnail', 'theme_name', 'theme_description', 'maptheme_id', 'crs_name', 'catalog_index'];

        // Options à passer
        $aPath = ['vmap', 'maps', $sMapId];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'my_vitis_id' => $sMapId
        );
        foreach ($aMap as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }

        $oVitisObject = new Maps($aPath, $aValues, $this->aProperties);
        $oVitisObject->PUT();

        $sReturnedId = false;
        if (!empty($oVitisObject->aFields)) {
            if (!empty($oVitisObject->aFields['map_id'])) {
                $sReturnedId = $oVitisObject->aFields['map_id'];
            }
        }
        return $sReturnedId;
    }

    // Import Services

    /**
     * Import des services vMap
     * @param array $aServices
     */
    function importVMapServices($aServices) {
        $aReturn = [];
        for ($i = 0; $i < count($aServices); $i++) {
            if (!empty($aServices[$i]['name'])) {
                $aExistingServices = $this->getSameNameServices($aServices[$i]);
                if (count($aExistingServices) > 0) {
                    for ($ii = 0; $ii < count($aExistingServices); $ii++) {
                        if (!empty($aExistingServices[$ii]['service_id'])) {
                            $sNewId = $this->updateVMapService($aServices[$i], $aExistingServices[$ii]['service_id']);
                            $this->replaceOccurences($aServices[$i]['service_id'], $sNewId);
                            array_push($aReturn, $sNewId);
                        }
                    }
                } else {
                    $sNewId = $this->addVMapService($aServices[$i]);
                    $this->replaceOccurences($aServices[$i]['service_id'], $sNewId);
                    array_push($aReturn, $sNewId);
                }
            }
        }
        return $aReturn;
    }

    /**
     * Récupère les services ayant le même nom
     * @param array $aService
     * @return array
     */
    function getSameNameServices($aService) {
        $aExistingServices = $this->oVexGetter->getVMapServices($aService['name']);
        return $aExistingServices;
    }

    /**
     * Crée un nouveau service
     * @param array $aService
     */
    function addVMapService($aService) {
        require_once 'Services.class.inc';

        // Attributs à ne pas envoyer
        $aUnusedValues = ['service_id', 'thumbnail'];

        // Options à passer
        $aPath = ['vmap', 'services'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet']
        );
        foreach ($aService as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }

        $oVitisObject = new Services($aPath, $aValues, $this->aProperties);
        $oVitisObject->POST();

        $sReturnedId = false;
        if (!empty($oVitisObject->aFields)) {
            if (!empty($oVitisObject->aFields['service_id'])) {
                $sReturnedId = $oVitisObject->aFields['service_id'];
            }
        }
        return $sReturnedId;
    }

    /**
     * Met à jour un service existant
     * @param array $aService
     * @param string $sServiceId identifiant de la service à mettre à jour
     */
    function updateVMapService($aService, $sServiceId) {
        require_once 'Services.class.inc';

        // Attributs à ne pas envoyer
        $aUnusedValues = ['service_id', 'thumbnail'];

        // Options à passer
        $aPath = ['vmap', 'services', $sServiceId];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'my_vitis_id' => $sServiceId
        );
        foreach ($aService as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }

        $oVitisObject = new Services($aPath, $aValues, $this->aProperties);
        $oVitisObject->PUT();

        $sReturnedId = false;
        if (!empty($oVitisObject->aFields)) {
            if (!empty($oVitisObject->aFields['service_id'])) {
                $sReturnedId = $oVitisObject->aFields['service_id'];
            }
        }
        return $sReturnedId;
    }

    // Import Calques

    /**
     * Import les calques vMap
     * @param array $aCalques
     */
    function importVMapCalques($aCalques) {
        $aReturn = [];
        for ($i = 0; $i < count($aCalques); $i++) {
            if (!empty($aCalques[$i]['name'])) {
                $aExistingCalques = $this->getSameNameCalques($aCalques[$i]);
                if (count($aExistingCalques) > 0) {
                    for ($ii = 0; $ii < count($aExistingCalques); $ii++) {
                        if (!empty($aExistingCalques[$ii]['layer_id'])) {
                            $sNewId = $this->updateVMapCalque($aCalques[$i], $aExistingCalques[$ii]['layer_id']);
                            $this->importVMapCalquesForms($aCalques[$i]['layer_id'], $sNewId);
                            $this->replaceOccurences($aCalques[$i]['layer_id'], $sNewId);
                            array_push($aReturn, $sNewId);
                        }
                    }
                } else {
                    $sNewId = $this->addVMapCalque($aCalques[$i]);
                    $this->importVMapCalquesForms($aCalques[$i]['layer_id'], $sNewId);
                    $this->replaceOccurences($aCalques[$i]['layer_id'], $sNewId);
                    array_push($aReturn, $sNewId);
                }
            }
        }
        return $aReturn;
    }

    /**
     * Récupère les calques ayant le même nom
     * @param array $aCalque
     * @return array
     */
    function getSameNameCalques($aCalque) {
        $aExistingCalques = $this->oVexGetter->getVMapCalques($aCalque['name']);
        return $aExistingCalques;
    }

    /**
     * Crée un nouveau calque
     * @param array $aCalque
     */
    function addVMapCalque($aCalque) {
        require_once 'Layers.class.inc';

        // Attributs à ne pas envoyer
        $aUnusedValues = [
            'layer_id',
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
            'service_login'];

        // Options à passer
        $aPath = ['vmap', 'layers'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet']
        );
        foreach ($aCalque as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }

        $oVitisObject = new Layers($aPath, $aValues, $this->aProperties);
        $oVitisObject->POST();

        $sReturnedId = false;
        if (!empty($oVitisObject->aFields)) {
            if (!empty($oVitisObject->aFields['layer_id'])) {
                $sReturnedId = $oVitisObject->aFields['layer_id'];
            }
        }
        return $sReturnedId;
    }

    /**
     * Met à jour un calque existant
     * @param array $aCalque
     * @param string $sCalqueId identifiant de la calque à mettre à jour
     */
    function updateVMapCalque($aCalque, $sCalqueId) {
        require_once 'Layers.class.inc';

        // Attributs à ne pas envoyer
        $aUnusedValues = [
            'layer_id',
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
            'service_login'];

        // Options à passer
        $aPath = ['vmap', 'layers', $sCalqueId];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'my_vitis_id' => $sCalqueId
        );
        foreach ($aCalque as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }

        $oVitisObject = new Layers($aPath, $aValues, $this->aProperties);
        $oVitisObject->PUT();

        $sReturnedId = false;
        if (!empty($oVitisObject->aFields)) {
            if (!empty($oVitisObject->aFields['layer_id'])) {
                $sReturnedId = $oVitisObject->aFields['layer_id'];
            }
        }
        return $sReturnedId;
    }

    /**
     * Importe les forumaires du calque
     * @param string $sOid
     * @param string $sCalqueId
     */
    function importVMapCalquesForms($sOid, $sCalqueId) {
        if (!empty($sCalqueId)) {
            if (!empty($this->aVmapObjects['calques_forms'])) {
                if (!empty($this->aVmapObjects['calques_forms'][$sOid])) {

                    $sFormsDir = $this->aProperties['ws_data_dir'] . '/vmap/layer/' . $sCalqueId;
                    if (!is_dir($sFormsDir)) {
                        mkdir($sFormsDir, 0777, true);
                    }
                    if (!is_dir($sFormsDir . '/forms')) {
                        mkdir($sFormsDir . '/forms', 0777, true);
                    }
                    if (!is_dir($sFormsDir . '/forms/ressources')) {
                        mkdir($sFormsDir . '/forms/ressources', 0777, true);
                    }

                    // Formulaires JSON
                    $aFormNames = ['default', 'custom', 'published'];
                    for ($i = 0; $i < count($aFormNames); $i++) {
                        if (!empty($this->aVmapObjects['calques_forms'][$sOid][$aFormNames[$i]])) {
                            $pFile = fopen($sFormsDir . '/forms/' . $aFormNames[$i] . '.json', 'w');
                            if (fwrite($pFile, json_encode($this->aVmapObjects['calques_forms'][$sOid][$aFormNames[$i]])) == false) {
                                writeToErrorLog('ERROR: ' . $aFormNames[$i] . '.json save failed');
                            }
                            fclose($pFile);
                        }
                    }
                    // Ressources JS
                    if (!empty($this->aVmapObjects['calques_forms'][$sOid]['ressources']['js'])) {
                        $aFormNames = ['default', 'custom', 'published'];
                        for ($i = 0; $i < count($aFormNames); $i++) {
                            if (!empty($this->aVmapObjects['calques_forms'][$sOid]['ressources']['js'][$aFormNames[$i]])) {
                                $pFile = fopen($sFormsDir . '/forms/ressources/' . $aFormNames[$i] . '.js', 'w');
                                if (fwrite($pFile, $this->aVmapObjects['calques_forms'][$sOid]['ressources']['js'][$aFormNames[$i]]) == false) {
                                    writeToErrorLog('ERROR: ' . $aFormNames[$i] . '.js save failed');
                                }
                                fclose($pFile);
                            }
                        }
                    }
                }
            }
        }
    }

    // Import themes des Calques

    /**
     * Import des themes de calques vMap
     * @param array $aCalqueThemes
     */
    function importVMapCalqueThemes($aCalqueThemes) {
        $aReturn = [];
        for ($i = 0; $i < count($aCalqueThemes); $i++) {
            if (!empty($aCalqueThemes[$i]['name'])) {
                $aExistingCalqueThemes = $this->getSameNameCalqueThemes($aCalqueThemes[$i]);
                if (count($aExistingCalqueThemes) > 0) {
                    for ($ii = 0; $ii < count($aExistingCalqueThemes); $ii++) {
                        if (!empty($aExistingCalqueThemes[$ii]['layertheme_id'])) {
                            $sNewId = $this->updateVMapCalqueTheme($aCalqueThemes[$i], $aExistingCalqueThemes[$ii]['layertheme_id']);
                            $this->replaceOccurences($aCalqueThemes[$i]['layertheme_id'], $sNewId);
                            array_push($aReturn, $sNewId);
                        }
                    }
                } else {
                    $sNewId = $this->addVMapCalqueTheme($aCalqueThemes[$i]);
                    $this->replaceOccurences($aCalqueThemes[$i]['layertheme_id'], $sNewId);
                    array_push($aReturn, $sNewId);
                }
            }
        }
        return $aReturn;
    }

    /**
     * Récupère les themes de calque ayant le même nom
     * @param array $aCalqueTheme
     * @return array
     */
    function getSameNameCalqueThemes($aCalqueTheme) {
        $aExistingCalqueThemes = $this->oVexGetter->getVMapCalqueThemes($aCalqueTheme['name']);
        return $aExistingCalqueThemes;
    }

    /**
     * Crée un nouveau theme de calque
     * @param array $aCalqueTheme
     */
    function addVMapCalqueTheme($aCalqueTheme) {
        require_once 'LayerThemes.class.inc';

        // Attributs à ne pas envoyer
        $aUnusedValues = ['layertheme_id'];

        // Options à passer
        $aPath = ['vmap', 'layerthemes'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet']
        );
        foreach ($aCalqueTheme as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }

        $oVitisObject = new LayerThemes($aPath, $aValues, $this->aProperties);
        $oVitisObject->POST();

        $sReturnedId = false;
        if (!empty($oVitisObject->aFields)) {
            if (!empty($oVitisObject->aFields['layertheme_id'])) {
                $sReturnedId = $oVitisObject->aFields['layertheme_id'];
            }
        }
        return $sReturnedId;
    }

    /**
     * Met à jour un theme de calque existant
     * @param array $aCalqueTheme
     * @param string $sCalqueThemeId identifiant de la calque à mettre à jour
     */
    function updateVMapCalqueTheme($aCalqueTheme, $sCalqueThemeId) {
        require_once 'LayerThemes.class.inc';

        // Attributs à ne pas envoyer
        $aUnusedValues = ['layertheme_id'];

        // Options à passer
        $aPath = ['vmap', 'layerthemes', $sCalqueThemeId];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'my_vitis_id' => $sCalqueThemeId
        );
        foreach ($aCalqueTheme as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }

        $oVitisObject = new LayerThemes($aPath, $aValues, $this->aProperties);
        $oVitisObject->PUT();

        $sReturnedId = false;
        if (!empty($oVitisObject->aFields)) {
            if (!empty($oVitisObject->aFields['layertheme_id'])) {
                $sReturnedId = $oVitisObject->aFields['layertheme_id'];
            }
        }
        return $sReturnedId;
    }

    // Import événements

    /**
     * Import les événements vMap
     * @param array $aEvents
     */
    function importVMapEvents($aEvents) {
        $aReturn = [];
        for ($i = 0; $i < count($aEvents); $i++) {
            if (!empty($aEvents[$i]['event_id'])) {
                $aExistingEvents = $this->getSameNameEvents($aEvents[$i]);
                if (count($aExistingEvents) > 0) {
                    for ($ii = 0; $ii < count($aExistingEvents); $ii++) {
                        if (!empty($aExistingEvents[$ii]['event_id'])) {
                            $sNewId = $this->updateVMapEvent($aEvents[$i], $aExistingEvents[$ii]['event_id']);
                            $this->replaceOccurences($aEvents[$i]['event_id'], $sNewId);
                            array_push($aReturn, $sNewId);
                        }
                    }
                } else {
                    $sNewId = $this->addVMapEvent($aEvents[$i]);
                    $this->replaceOccurences($aEvents[$i]['event_id'], $sNewId);
                    array_push($aReturn, $sNewId);
                }
            }
        }
        return $aReturn;
    }

    /**
     * Récupère les événements ayant le même nom
     * @param array $aEvent
     * @return array
     */
    function getSameNameEvents($aEvent) {
        $aExistingEvents = $this->oVexGetter->getVMapEvents($aEvent['event_id']);
        return $aExistingEvents;
    }

    /**
     * Crée un nouvel événement
     * @param array $aEvent
     */
    function addVMapEvent($aEvent) {
        require_once 'BusinessObjectEvents.class.inc';

        // Attributs à ne pas envoyer
        $aUnusedValues = [];

        // Options à passer
        $aPath = ['vmap', 'businessobjectevents'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet']
        );
        foreach ($aEvent as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }

        $oVitisObject = new BusinessObjectEvents($aPath, $aValues, $this->aProperties);
        $oVitisObject->POST();

        $sReturnedId = false;
        if (!empty($oVitisObject->aFields)) {
            if (!empty($oVitisObject->aFields['event_id'])) {
                $sReturnedId = $oVitisObject->aFields['event_id'];
            }
        }
        return $sReturnedId;
    }

    /**
     * Met à jour un événement existant
     * @param array $aEvent
     * @param string $sEventId identifiant de la service à mettre à jour
     */
    function updateVMapEvent($aEvent, $sEventId) {
        require_once 'BusinessObjectEvents.class.inc';

        // Attributs à ne pas envoyer
        $aUnusedValues = [];

        // Options à passer
        $aPath = ['vmap', 'businessobjectevents', $sEventId];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'my_vitis_id' => $sEventId
        );
        foreach ($aEvent as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }

        $oVitisObject = new BusinessObjectEvents($aPath, $aValues, $this->aProperties);
        $oVitisObject->PUT();

        $sReturnedId = false;
        if (!empty($oVitisObject->aFields)) {
            if (!empty($oVitisObject->aFields['event_id'])) {
                $sReturnedId = $oVitisObject->aFields['event_id'];
            }
        }
        return $sReturnedId;
    }

    // Import objets métier

    /**
     * Import les objets métier vMap
     * @param array $aBusinessObjects
     */
    function importVMapBusinessObjects($aBusinessObjects) {
        $aReturn = [];
        for ($i = 0; $i < count($aBusinessObjects); $i++) {
            if (!empty($aBusinessObjects[$i]['business_object_id'])) {

                // Remplacement de la balise [SCHEMA_NAME] dans sql summary / list
                $aBusinessObjects[$i]['sql_summary'] = preg_replace('/\[SCHEMA_NAME\]/', $this->aValues['schema'], $aBusinessObjects[$i]['sql_summary']);
                $aBusinessObjects[$i]['sql_list'] = preg_replace('/\[SCHEMA_NAME\]/', $this->aValues['schema'], $aBusinessObjects[$i]['sql_list']);

                $aExistingBusinessObjects = $this->getSameNameBusinessObjects($aBusinessObjects[$i]);
                if (count($aExistingBusinessObjects) > 0) {
                    for ($ii = 0; $ii < count($aExistingBusinessObjects); $ii++) {
                        if (!empty($aExistingBusinessObjects[$ii]['business_object_id'])) {
                            $sNewId = $this->updateVMapBusinessObject($aBusinessObjects[$i], $aExistingBusinessObjects[$ii]['business_object_id']);
                            $this->importVMapBusinessObjectForms($sNewId);
                            $this->replaceOccurences($aBusinessObjects[$i]['business_object_id'], $sNewId);
                            array_push($aReturn, $sNewId);
                        }
                    }
                } else {
                    $sNewId = $this->addVMapBusinessObject($aBusinessObjects[$i]);
                    $this->importVMapBusinessObjectForms($sNewId);
                    $this->replaceOccurences($aBusinessObjects[$i]['business_object_id'], $sNewId);
                    array_push($aReturn, $sNewId);
                }
            }
        }
        return $aReturn;
    }

    /**
     * Récupère les objets métier ayant le même nom
     * @param array $aBusinessObject
     * @return array
     */
    function getSameNameBusinessObjects($aBusinessObject) {
        $aExistingBusinessObjects = $this->oVexGetter->getVMapBusinessObjects($aBusinessObject['business_object_id']);
        return $aExistingBusinessObjects;
    }

    /**
     * Crée un nouvel objets métier
     * @param array $aBusinessObject
     */
    function addVMapBusinessObject($aBusinessObject) {
        require_once 'BusinessObjects.class.inc';

        // Attributs à ne pas envoyer
        $aUnusedValues = [];

        // Options à passer
        $aPath = ['vmap', 'businessobjects'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet']
        );
        foreach ($aBusinessObject as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }

        $oVitisObject = new BusinessObjects($aPath, $aValues, $this->aProperties);
        $oVitisObject->POST();

        $sReturnedId = false;
        if (!empty($oVitisObject->aFields)) {
            if (!empty($oVitisObject->aFields['business_object_id'])) {
                $sReturnedId = $oVitisObject->aFields['business_object_id'];
            }
        }
        return $sReturnedId;
    }

    /**
     * Met à jour un objets métier existant
     * @param array $aBusinessObject
     * @param string $sBusinessObjectId identifiant de la service à mettre à jour
     */
    function updateVMapBusinessObject($aBusinessObject, $sBusinessObjectId) {
        require_once 'BusinessObjects.class.inc';

        // Attributs à ne pas envoyer
        $aUnusedValues = [];

        // Options à passer
        $aPath = ['vmap', 'businessobjects', $sBusinessObjectId];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'my_vitis_id' => $sBusinessObjectId
        );
        foreach ($aBusinessObject as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }

        $oVitisObject = new BusinessObjects($aPath, $aValues, $this->aProperties);
        $oVitisObject->PUT();

        $sReturnedId = false;
        if (!empty($oVitisObject->aFields)) {
            if (!empty($oVitisObject->aFields['business_object_id'])) {
                $sReturnedId = $oVitisObject->aFields['business_object_id'];
            }
        }
        return $sReturnedId;
    }

    /**
     * Importe les formulaires de l'objet métier
     * @param string $sBusinessObjectId
     */
    function importVMapBusinessObjectForms($sBusinessObjectId) {
        if (!empty($sBusinessObjectId)) {
            if (!empty($this->aVmapObjects['business_objects_forms'])) {
                if (!empty($this->aVmapObjects['business_objects_forms'][$sBusinessObjectId])) {

                    $sFormsDir = $this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $sBusinessObjectId;
                    if (!is_dir($sFormsDir)) {
                        mkdir($sFormsDir, 0777, true);
                    }
                    if (!is_dir($sFormsDir . '/forms')) {
                        mkdir($sFormsDir . '/forms', 0777, true);
                    }
                    if (!is_dir($sFormsDir . '/forms/ressources')) {
                        mkdir($sFormsDir . '/forms/ressources', 0777, true);
                    }

                    // Formulaires JSON
                    $aFormNames = ['default', 'custom', 'published'];
                    for ($i = 0; $i < count($aFormNames); $i++) {

                        $sFormContent = json_encode($this->aVmapObjects['business_objects_forms'][$sBusinessObjectId][$aFormNames[$i]]);

                        if (!empty($sFormContent)) {

                            $aPatterns = [
                                '/\[DATABASE_NAME\]/',
                                '/\[SCHEMA_NAME\]/'
                            ];
                            $aReplacements = [
                                $this->aValues['database'],
                                $this->aValues['schema']
                            ];
                            $sFormContent = preg_replace($aPatterns, $aReplacements, $sFormContent);

                            $pFile = fopen($sFormsDir . '/forms/' . $aFormNames[$i] . '.json', 'w');
                            if (fwrite($pFile, $sFormContent) == false) {
                                writeToErrorLog('ERROR: ' . $aFormNames[$i] . '.json save failed');
                            }
                            fclose($pFile);
                        }
                    }
                    // Ressources JS
                    if (!empty($this->aVmapObjects['business_objects_forms'][$sBusinessObjectId]['ressources']['js'])) {
                        $aFormNames = ['default', 'custom', 'published'];
                        for ($i = 0; $i < count($aFormNames); $i++) {
                            if (!empty($this->aVmapObjects['business_objects_forms'][$sBusinessObjectId]['ressources']['js'][$aFormNames[$i]])) {
                                $pFile = fopen($sFormsDir . '/forms/ressources/' . $aFormNames[$i] . '.js', 'w');
                                if (fwrite($pFile, $this->aVmapObjects['business_objects_forms'][$sBusinessObjectId]['ressources']['js'][$aFormNames[$i]]) == false) {
                                    writeToErrorLog('ERROR: ' . $aFormNames[$i] . '.js save failed');
                                }
                                fclose($pFile);
                            }
                        }
                    }
                }
            }
        }
    }

    // Import rapports

    /**
     * Import des rapports vMap
     * @param array $aReports
     */
    function importVMapReports($aReports) {
        $aReturn = [];
        for ($i = 0; $i < count($aReports); $i++) {
            if (!empty($aReports[$i]['name'])) {
                $aExistingReports = $this->getSameNameReports($aReports[$i]);
                if (count($aExistingReports) > 0) {
                    for ($ii = 0; $ii < count($aExistingReports); $ii++) {
                        if (!empty($aExistingReports[$ii]['printreport_id'])) {
                            $sNewId = $this->updateVMapReport($aReports[$i], $aExistingReports[$ii]['printreport_id']);
                            $this->replaceOccurences($aReports[$i]['printreport_id'], $sNewId);
                            array_push($aReturn, $sNewId);
                        }
                    }
                } else {
                    $sNewId = $this->addVMapReport($aReports[$i]);
                    $this->replaceOccurences($aReports[$i]['printreport_id'], $sNewId);
                    array_push($aReturn, $sNewId);
                }
            }
        }
        return $aReturn;
    }

    /**
     * Récupère les rapports ayant le même nom
     * @param array $aReport
     * @return array
     */
    function getSameNameReports($aReport) {
        $aExistingReports = $this->oVexGetter->getVMapReports($aReport['name']);
        return $aExistingReports;
    }

    /**
     * Crée un nouveau rapport
     * @param array $aReport
     */
    function addVMapReport($aReport) {
        require_once 'PrintReports.class.inc';

        // Attributs à ne pas envoyer
        $aUnusedValues = ['printreport_id'];


        // Options à passer
        $aPath = ['vmap', 'printreports'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet']
        );
        foreach ($aReport as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }

        $oVitisObject = new PrintReports($aPath, $aValues, $this->aProperties);
        $oVitisObject->POST();

        $sReturnedId = false;
        if (!empty($oVitisObject->aFields)) {
            if (!empty($oVitisObject->aFields['printreport_id'])) {
                $sReturnedId = $oVitisObject->aFields['printreport_id'];
            }
        }
        return $sReturnedId;
    }

    /**
     * Met à jour un rapport existant
     * @param array $aReport
     * @param string $sReportId identifiant de la service à mettre à jour
     */
    function updateVMapReport($aReport, $sReportId) {
        require_once 'PrintReports.class.inc';

        // Attributs à ne pas envoyer
        $aUnusedValues = ['printreport_id'];


        // Options à passer
        $aPath = ['vmap', 'printreports', $sReportId];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'my_vitis_id' => $sReportId
        );
        foreach ($aReport as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }

        $oVitisObject = new PrintReports($aPath, $aValues, $this->aProperties);
        $oVitisObject->PUT();

        $sReturnedId = false;
        if (!empty($oVitisObject->aFields)) {
            if (!empty($oVitisObject->aFields['printreport_id'])) {
                $sReturnedId = $oVitisObject->aFields['printreport_id'];
            }
        }
        return $sReturnedId;
    }

    // Import couches Mapserver

    /**
     * Import les couches mapserver vMap
     * @param array $aVm4msLayers
     */
    function importVMapVm4msLayers($aVm4msLayers) {
        $aReturn = [];
        for ($i = 0; $i < count($aVm4msLayers); $i++) {
            if (!empty($aVm4msLayers[$i]['name'])) {
                $aExistingVm4msLayers = $this->getSameNameVm4msLayers($aVm4msLayers[$i]);
                if (count($aExistingVm4msLayers) > 0) {
                    for ($ii = 0; $ii < count($aExistingVm4msLayers); $ii++) {
                        if (!empty($aExistingVm4msLayers[$ii]['ms_layer_id'])) {
                            $sNewId = $this->updateVMapVm4msLayer($aVm4msLayers[$i], $aExistingVm4msLayers[$ii]['ms_layer_id']);
                            $this->replaceOccurences($aVm4msLayers[$i]['ms_layer_id'], $sNewId);
                            array_push($aReturn, $sNewId);
                        }
                    }
                } else {
                    $sNewId = $this->addVMapVm4msLayer($aVm4msLayers[$i]);
                    $this->replaceOccurences($aVm4msLayers[$i]['ms_layer_id'], $sNewId);
                    array_push($aReturn, $sNewId);
                }
            }
        }
        return $aReturn;
    }

    /**
     * Récupère les couches mapserver ayant le même nom
     * @param array $aVm4msLayer
     * @return array
     */
    function getSameNameVm4msLayers($aVm4msLayer) {
        // Attributs à ne pas envoyer
        $aValues = array(
            'token' => $this->aValues['token'],
            'attributs' => implode('|', ['ms_layer_id', 'name', 'tableschema', 'tablename', 'connection_id']),
            'filter' => '{"column": "name", "compare_operator": "=", "value": "' . $aVm4msLayer['name'] . '"}'
        );

        // Ferme temporairement la session
        session_write_close();

        // Envoie une requête curl pour ajouter la couche Mapserver
        $sUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['services_alias'] . '/vm4ms/layers';
        $ch = curl_init($sUrl);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Accept: application/json", "X-HTTP-Method-Override: GET"));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $aValues);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        $sResponse = curl_exec($ch);
        curl_close($ch);

        // Ouvre à nouveau la session
        $this->oConnection = new Connection($this->aValues, $this->aProperties);

        $sReturnedId = false;
        $aResponse = json_decode($sResponse, true);

        $aExistingVm4msLayers = [];
        if (!empty($aResponse['layers'])) {
            $aExistingVm4msLayers = $aResponse['layers'];
        }
        return $aExistingVm4msLayers;
    }

    /**
     * Crée une nouvelle couche mapverver
     * @param array $aVm4msLayer
     */
    function addVMapVm4msLayer($aVm4msLayer) {
        // Attributs à ne pas envoyer
        $aUnusedValues = ['ms_layer_id'];
        $aValues = array(
            'token' => $this->aValues['token'],
        );

        foreach ($aVm4msLayer as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }

        // Ferme temporairement la session
        session_write_close();

        // Envoie une requête curl pour ajouter la couche Mapserver
        $sUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['services_alias'] . '/vm4ms/layers';
        $ch = curl_init($sUrl);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Accept: application/json"));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $aValues);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        $sResponse = curl_exec($ch);
        curl_close($ch);

        // Ouvre à nouveau la session
        $this->oConnection = new Connection($this->aValues, $this->aProperties);

        $sReturnedId = false;
        $aResponse = json_decode($sResponse, true);

        if (!empty($aResponse['ms_layer_id'])) {
            $sReturnedId = $aResponse['ms_layer_id'];
        }
        return $sReturnedId;
    }

    /**
     * Met à jour une couche Mapserver
     * @param array $aVm4msLayer
     * @param string $sVm4msLayerId identifiant de la service à mettre à jour
     */
    function updateVMapVm4msLayer($aVm4msLayer, $sVm4msLayerId) {
        // Attributs à ne pas envoyer
        $aUnusedValues = ['ms_layer_id'];
        $aValues = array(
            'token' => $this->aValues['token']
        );

        foreach ($aVm4msLayer as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }

        // Ferme temporairement la session
        session_write_close();

        // Envoie une requête curl pour ajouter la couche Mapserver
        $sUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['services_alias'] . '/vm4ms/layers/' . $sVm4msLayerId;
        $ch = curl_init($sUrl);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Accept: application/json"));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $aValues);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        $sResponse = curl_exec($ch);
        curl_close($ch);

        // Ouvre à nouveau la session
        $this->oConnection = new Connection($this->aValues, $this->aProperties);

        $sReturnedId = false;
        $aResponse = json_decode($sResponse, true);

        if (!empty($aResponse['ms_layer_id'])) {
            $sReturnedId = $aResponse['ms_layer_id'];
        }
        return $sReturnedId;
    }

    // Import relation carte / calques

    /**
     * Importe les relations cartes calques
     * @param Array $aMapCalques
     */
    function importVMapMapCalquesRelation($aMapCalques) {
        // Association
        for ($i = 0; $i < count($aMapCalques); $i++) {
            if (!empty($aMapCalques[$i]['layer_id']) && !empty($aMapCalques[$i]['map_id'])) {
                $this->updateVMapMapCalques($aMapCalques[$i]);
            }
        }

        // Ordre
        $aMaps = [];
        for ($i = 0; $i < count($aMapCalques); $i++) {
            if (empty($aMaps[$aMapCalques[$i]['map_id']])) {
                $aMaps[$aMapCalques[$i]['map_id']] = [];
            }
            array_push($aMaps[$aMapCalques[$i]['map_id']], $aMapCalques[$i]);
        }
        foreach ($aMaps as $key => $value) {
            $this->updateVMapMapCalquesSorting($aMaps[$key], $key);
        }

        return true;
    }

    /**
     * Associe les calques à la carte
     * @param array $aMapCalque
     */
    function updateVMapMapCalques($aMapCalque) {
        require_once 'MapLayers.class.inc';

        // Attributs à ne pas envoyer
        $aUnusedValues = ['name', 'theme_name', 'layer_id'];

        // Options à passer
        $aPath = ['vmap', 'maplayers', $aMapCalque['map_id']];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'my_vitis_id' => $aMapCalque['map_id']
        );
        foreach ($aMapCalque as $key => $value) {
            if (!in_array($key, $aUnusedValues)) {
                $aValues[$key] = $value;
            }
        }
        $aValues['map_layers'] = $aMapCalque['layer_id'];

        $oVitisObject = new MapLayers($aPath, $aValues, $this->aProperties);
        $oVitisObject->PUT();
    }

    /**
     * Change l'ordre des calques dans la carte
     * @param array $aMapCalques
     * @param string $sMapId
     */
    function updateVMapMapCalquesSorting($aMapCalques, $sMapId) {
        require_once 'MapLayers.class.inc';

        $aLayerIds = [];
        for ($i = 0; $i < count($aMapCalques); $i++) {
            if (!empty($aMapCalques[$i]['layer_id'])) {
                array_push($aLayerIds, $aMapCalques[$i]['layer_id']);
            }
        }

        // Options à passer
        $aPath = ['vmap', 'maplayers', $sMapId, 'sorting'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'my_vitis_id' => $sMapId
        );

        $aValues['map_id'] = $sMapId;
        $aValues['map_layers'] = implode('|', $aLayerIds);

        $oVitisObject = new MapLayers($aPath, $aValues, $this->aProperties);
        $oVitisObject->PUT();
    }

    // Import des wervices web

    /**
     * Permet d'importer des services web
     * @return type
     */
    function importWebServices() {
        $this->aReturn = Array();

        if (!in_array('vitis_admin', $this->oConnection->aPrivileges) ||
                !in_array('vmap_admin', $this->oConnection->aPrivileges) ||
                !in_array('vm4ms_admin', $this->oConnection->aPrivileges)) {
            $oError = new VitisError(0, 'insufficient privileges (needs to be vitis_admin, vmap_admin and vm4ms_admin)');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        if (!isset($this->aValues['web_services'])) {
            $oError = new VitisError(0, 'Parameter web_services required');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        /**
         * Services web à importer
         */
        $this->aWebServices = json_decode($this->aValues['web_services'], true);

        /**
         * Gestion erreur contenu
         */
        if (!is_array($this->aWebServices)) {
            $oError = new VitisError(0, 'web_services not valid');
        }

        if (!isset($oError)) {
            $this->aReturn = $this->importWebServicesFiles($this->aWebServices);
        }

        if (isset($oError)) {
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        } elseif (isset($this->oError)) {
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
                'web_services' => $this->aReturn,
                'status' => 1
            );
            return json_encode($this->aReturn);
        }
    }

    /**
     * Import the web service files
     * @param array $aWebServices
     * @return array
     */
    function importWebServicesFiles($aWebServices) {
        for ($i = 0; $i < count($aWebServices); $i++) {
            if (!empty($aWebServices[$i]['name'] && !empty($aWebServices[$i]['files']))) {

                // Création du dossier
                $sWebServicePath = $this->aProperties['vas_home'] . '/rest/ws/' . $aWebServices[$i]['name'];
                if (!is_dir($sWebServicePath)) {
                    mkdir($sWebServicePath, 0777, true);
                }

                // Import des fichiers
                foreach ($aWebServices[$i]['files'] as $key => $value) {
                    $pFile = fopen($sWebServicePath . '/' . $key, 'w');
                    if (fwrite($pFile, $aWebServices[$i]['files'][$key]) == false) {
                        unset($aWebServices[$i]['files'][$key]);
                        writeToErrorLog('ERROR: ' . $key . '. save failed');
                    }
                    fclose($pFile);
                }
            }
        }
        return $aWebServices;
    }

    // Import SQL

    /**
     * Permet d'importer la partie SQL d'un .vex
     */
    function importSQL() {

        $this->aReturn = Array();

        if (!in_array('vitis_admin', $this->oConnection->aPrivileges) ||
                !in_array('vmap_admin', $this->oConnection->aPrivileges) ||
                !in_array('vm4ms_admin', $this->oConnection->aPrivileges)) {
            $oError = new VitisError(0, 'insufficient privileges (needs to be vitis_admin, vmap_admin and vm4ms_admin)');
        }

        if (!isset($this->aValues['sql_model']) || !isset($this->aValues['database']) || !isset($this->aValues['schema'])) {
            $oError = new VitisError(0, 'Parameter sql_model, database, schema required');
        }

        /**
         * Objet VexGetter permettant de recueillir des informations essentielles
         */
        $this->oVexGetter = new VexGetter($this->aPath, $this->aValues, $this->aProperties);

        /**
         * Modèle SQL importer
         */
        $this->sSQLModel = $this->aValues['sql_model'];

        /**
         * Données SQL importer
         */
        $this->sSQLData = $this->aValues['sql_data'];

        /**
         * Gestion erreur contenu
         */
        if (!is_string($this->sSQLModel)) {
            $oError = $oError = new VitisError(0, 'sql_model no valid');
        }

        if (!isset($oError)) {
            $sStringRequests = $this->sSQLModel;
            if (is_string($this->sSQLData)) {
                if (!empty($this->sSQLData)) {
                    $sStringRequests .= $this->sSQLData;
                }
            }

            // Récupère le contenu au format d'un tableau
            $aArrayRequests = $this->getRequestsAsArray($sStringRequests);

            if ($aArrayRequests !== false) {

                // Récupère la liste des tables, vues etc..
                $aSQLComponents = $this->oVexGetter->getSQLGrantableObjectsFromLines($aArrayRequests);

                // Enlève les les commentaires et lignes vides
                $aArrayRequests = $this->cleanArrayRequests($aArrayRequests);

                // Concatène les requêtes et retourne une chaine de caractère
                $sSQLRequests = $this->concatArrayRequests($aArrayRequests);

                // Éxécute les requêtes
                $bSQLImported = $this->executeSQLRequests($sSQLRequests, $this->aValues['database']);

                // Reprojette les données si besoin
                if (!empty($this->aValues['srid'])) {
                    $this->updateTablesSRID($aSQLComponents, $this->aValues['srid']);
                }

                $this->aReturn = $bSQLImported;
            }
        }

        if (isset($oError)) {
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        } elseif (isset($this->oError)) {
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
                'sql' => $this->aReturn,
                'status' => 1
            );
            return json_encode($this->aReturn);
        }
    }

    /**
     * Parse les requêtes contenant des sauts à la ligne etc.. et retourne un tableau
     * @param string $sStringRequests
     * @return array
     */
    function getRequestsAsArray($sStringRequests) {

        $sTmpPath = $this->aProperties['vas_home'] . '/tmp/' . $this->UniqFileName();

        $pFile = fopen($sTmpPath, 'w');
        if (fwrite($pFile, $sStringRequests) == false) {
            return false;
        }
        fclose($pFile);

        $aArrayRequests = file($sTmpPath);

        unlink($sTmpPath);
        return $aArrayRequests;
    }

    /**
     * Delete the white spaces and comments from the data-model file array vue
     * @param array $aArrayRequests
     * @return array
     */
    function cleanArrayRequests($aArrayRequests) {

        for ($i = count($aArrayRequests) - 1; $i >= 0; $i--) {
            // Supprime les espaces
            $aArrayRequests[$i] = trim($aArrayRequests[$i]);
            // Supprime les lignes vides
            if ($aArrayRequests[$i] === '') {
                unset($aArrayRequests[$i]);
            } else {
                // Supprime les commentaires
                if (substr($aArrayRequests[$i], 0, 2) === '--') {
                    unset($aArrayRequests[$i]);
                } else {
                    // Supprime SET idle_in_transaction_session_timeout = 0;
                    if (substr($aArrayRequests[$i], 0, 39) == 'SET idle_in_transaction_session_timeout') {
                        unset($aArrayRequests[$i]);
                    }
                }
            }
        }
        // Redonne les bons index
        $aArrayRequests2 = Array();
        foreach ($aArrayRequests as $key => $value) {
            array_push($aArrayRequests2, $value);
        }
        $aArrayRequests = $aArrayRequests2;

        return $aArrayRequests;
    }

    /**
     * Concatène les requêtes présentes dans $aArrayRequests
     * @param array $aArrayRequests
     * @return string
     */
    function concatArrayRequests($aArrayRequests) {

        $sStringContents = '';
        for ($i = 0; $i < count($aArrayRequests); $i++) {
            $sStringContents .= $aArrayRequests[$i] . ' ';
        }

        return $sStringContents;
    }

    /**
     * Execute the data-model requests
     * @param array $aFileRequests
     * @return array results
     */
    function executeSQLRequests($sSQLRequests, $sDatabase) {

        // Connexion avec uVitis
        $oBD = new Vm($this->aProperties['owner_login'], $this->aProperties['owner_pass'], $sDatabase, $this->aProperties['server'], $this->aProperties['port'], $this->aProperties['sgbd'], $this->aProperties['page_encoding']);
        $this->oConnection->oBd = $oBD;

        $this->oConnection->oBd->demarreTransaction();

        $bError = false;
        $oPDOresult = $this->oConnection->oBd->executeBlock($sSQLRequests);

        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            $bError = true;
        } else {
            $aResults = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);
        }

        if ($bError) {
            $this->oConnection->oBd->annuleTransaction();
            return false;
        } else {
            $this->oConnection->oBd->termineTransaction();
            return true;
        }
    }

    /**
     * Update and transform the tables SRID
     * @param array $aSQLComponents
     * @param string $sSRID
     */
    function updateTablesSRID($aSQLComponents, $sSRID) {

        $aTables = $this->getTablesFromSQLComponents($aSQLComponents);
        if (is_array($aTables)) {
            for ($i = 0; $i < count($aTables); $i++) {
                $aGeomColumns = $this->getGeometryColumns($this->aValues['schema'], $aTables[$i]);
                if (is_array($aGeomColumns)) {
                    for ($ii = 0; $ii < count($aGeomColumns); $ii++) {
                        $this->updateTableColumnSRID($this->aValues['schema'], $aTables[$i], $aGeomColumns[$ii], $sSRID);
                    }
                }
            }
        }
    }

    /**
     * Get a table list from $aSQLComponents
     * @param array $aSQLComponents
     * @return array
     */
    function getTablesFromSQLComponents($aSQLComponents) {
        $aTables = [];
        for ($i = 0; $i < count($aSQLComponents); $i++) {
            if ($aSQLComponents[$i]['type'] === 'TABLE') {
                if (!empty($aSQLComponents[$i]['name'])) {
                    array_push($aTables, $aSQLComponents[$i]['name']);
                }
            }
        }
        return $aTables;
    }

    /**
     * Get the geometry columns from a table
     * @param string $sSchema
     * @param string $sTable
     * @return array
     */
    function getGeometryColumns($sSchema, $sTable) {
        require 'Vex.class.sql.inc';
        $aColumn = Array();
        $sSql = $aSql['getGeometryColumns'];

        $aSqlParams = array(
            'sSchemaFramework' => array('value' => $sSchema, 'type' => 'column_name'),
            'sTable' => array('value' => $sTable, 'type' => 'column_name')
        );

        $oResult = $this->oConnection->oBd->executeWithParams($sSql, $aSqlParams);

        // vide si postGis n'est pas installé
        if (!empty($oResult)) {
            while ($aObject = $this->oConnection->oBd->ligneSuivante($oResult)) {
                array_push($aColumn, $aObject['f_geometry_column']);
            }
        }

        return $aColumn;
    }

    /**
     * Update the table column srid and transform his data
     * @param string $sSchema
     * @param string $sTable
     * @param string $sColumn
     * @param string $sSRID
     */
    function updateTableColumnSRID($sSchema, $sTable, $sColumn, $sSRID) {
        require 'Vex.class.sql.inc';

        $oResult = $this->oConnection->oBd->executeWithParams('SET search_path TO public', []);

        $aSqlParams = array(
            'sSchema' => array('value' => $sSchema, 'type' => 'quoted_string'),
            'sTable' => array('value' => $sTable, 'type' => 'quoted_string'),
            'sColumn' => array('value' => $sColumn, 'type' => 'quoted_string'),
            'iSRID' => array('value' => $sSRID, 'type' => 'number')
        );
        $oResult = $this->oConnection->oBd->executeWithParams($aSql['updateTableColumnSRID'], $aSqlParams);
    }

}

?>

<?php

/**
 * \file VexGetter.class.inc
 * \class VexGetter
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the VexGetter php class
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
class VexGetter extends Vmap {

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
        require 'Vex.class.sql.inc';
        $this->aSQL = $aSql;
    }

    // Get vMap objects

    /**
     * Retourne la liste des objets vMap au format suivant
     *
     * [{
     *     type: map
     *     name: [map_name]
     *     map_id: [map_id]
     *     calques: [{
     *         type: calque
     *         name: [layer_name]
     *         layer_id: [layer_id]
     *         business_objects: [{
     *               type: business_object
     *               name: [bo_name]
     *         }],
     *         vm4ms_layers: [{
     *               type: vm4ms_layer
     *               name: [layer_name]
     *         }]
     *     }]
     * }]
     *
     * @return string
     */
    function getVMapObjectsList() {

        $this->aReturn = Array();

        $aVMapObjects = array();

        // Liste des cartes
        $this->aMaps = $aMaps = $this->getVMapMaps();

        // Liste des calques
        $this->aCalques = $aCalques = $this->getVMapCalques();

        // Relations cartes / calques
        $this->aMapCalques = $aMapCalques = $this->getVMapMapCalques();

        // Liste des couches mapserver
        $this->aVm4msLayers = $aVm4msLayers = $this->getVMapVm4msLayers();

        // Liste des connexions mapserver
        $this->aVm4msConnections = $aVm4msConnections = $this->getVMapVm4msConnections();

        // Objets métier
        $this->aBusinessObjects = $aBusinessObjects = $this->getVMapBusinessObjects();

        // Arbre contenant ces données
        $aVMapObjects = $this->getTreeOrderedMaps($aMaps, $aCalques, $aMapCalques);

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
            $this->aReturn['status'] = 1;
            $this->aReturn['vmap_objects'] = $aVMapObjects;
            return json_encode($this->aReturn);
        }
    }

    /**
     * Récupère la liste des cartes
     * @param string $sNames names filter
     * @return array
     */
    function getVMapMaps($sNames = null) {
        require_once 'Maps.class.inc';

        $aPath = ['vmap', 'maps'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'attributs' => 'map_id|name',
            'module' => 'vmap',
            'order_by' => 'name'
        );

        // Ajout filtre sur le nom
        if (!empty($sNames)) {
            $aNames = explode('|', $sNames);
            if (!empty($aNames)) {
                $aFilter = array(
                    'column' => 'name',
                    'compare_operator' => 'IN',
                    'value' => $aNames
                );
                $aValues['filter'] = json_encode($aFilter);
            }
        }

        $oMaps = new Maps($aPath, $aValues, $this->aProperties);
        $oMaps->GET();

        $aMaps = array();
        if (!empty($oMaps->aObjects)) {
            for ($i = 0; $i < count($oMaps->aObjects); $i++) {
                if (!empty($oMaps->aObjects[$i]->aFields)) {
                    if (!empty($oMaps->aObjects[$i]->aFields['map_id']) &&
                            !empty($oMaps->aObjects[$i]->aFields['name'])) {
                        array_push($aMaps, array(
                            'name' => $oMaps->aObjects[$i]->aFields['name'],
                            'map_id' => $oMaps->aObjects[$i]->aFields['map_id']
                        ));
                    }
                }
            }
        }

        return $aMaps;
    }

    /**
     * Récupère la liste des services
     * @param string $sNames names filter
     * @param array $aAttributs attributs to request
     * @return array
     */
    function getVMapServices($sNames = null, $aAttributs = ['service_id', 'name']) {
        require_once 'Services.class.inc';

        $aPath = ['vmap', 'services'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'module' => 'vmap',
            'order_by' => 'name'
        );

        if (is_array($aAttributs)) {
            $aValues['attributs'] = implode('|', $aAttributs);
        }

        // Ajout filtre sur le nom
        if (!empty($sNames)) {
            $aNames = explode('|', $sNames);
            if (!empty($aNames)) {
                $aFilter = array(
                    'column' => 'name',
                    'compare_operator' => 'IN',
                    'value' => $aNames
                );
                $aValues['filter'] = json_encode($aFilter);
            }
        }

        $oServices = new Services($aPath, $aValues, $this->aProperties);
        $oServices->GET();

        $aServices = array();
        if (!empty($oServices->aObjects)) {
            for ($i = 0; $i < count($oServices->aObjects); $i++) {
                if (!empty($oServices->aObjects[$i]->aFields)) {
                    array_push($aServices, $oServices->aObjects[$i]->aFields);
                }
            }
        }

        return $aServices;
    }

    /**
     * Récupère la liste des événements
     * @param string $sNames names filter
     * @return array
     */
    function getVMapEvents($sNames = null) {
        require_once 'BusinessObjectEvents.class.inc';

        $aPath = ['vmap', 'businessobjectevents'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'attributs' => 'event_id|description',
            'module' => 'vmap',
            'order_by' => 'event_id'
        );

        // Ajout filtre sur event_id
        if (!empty($sNames)) {
            $aNames = explode('|', $sNames);
            if (!empty($aNames)) {
                $aFilter = array(
                    'column' => 'event_id',
                    'compare_operator' => 'IN',
                    'value' => $aNames
                );
                $aValues['filter'] = json_encode($aFilter);
            }
        }

        $oEvents = new BusinessObjectEvents($aPath, $aValues, $this->aProperties);
        $oEvents->GET();

        $aEvents = array();
        if (!empty($oEvents->aObjects)) {
            for ($i = 0; $i < count($oEvents->aObjects); $i++) {
                if (!empty($oEvents->aObjects[$i]->aFields)) {
                    if (!empty($oEvents->aObjects[$i]->aFields['event_id']) &&
                            !empty($oEvents->aObjects[$i]->aFields['description'])) {
                        array_push($aEvents, array(
                            'description' => $oEvents->aObjects[$i]->aFields['description'],
                            'event_id' => $oEvents->aObjects[$i]->aFields['event_id']
                        ));
                    }
                }
            }
        }

        return $aEvents;
    }

    /**
     * Récupère la liste des rapports
     * @param string $sNames names filter
     * @return array
     */
    function getVMapReports($sNames = null) {
        require_once 'PrintReports.class.inc';

        $aPath = ['vmap', 'printreports'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'attributs' => 'printreport_id|name',
            'module' => 'vmap',
            'order_by' => 'name'
        );

        // Ajout filtre sur le nom
        if (!empty($sNames)) {
            $aNames = explode('|', $sNames);
            if (!empty($aNames)) {
                $aFilter = array(
                    'column' => 'name',
                    'compare_operator' => 'IN',
                    'value' => $aNames
                );
                $aValues['filter'] = json_encode($aFilter);
            }
        }

        $oPrintReports = new PrintReports($aPath, $aValues, $this->aProperties);
        $oPrintReports->GET();

        $aReports = array();
        if (!empty($oPrintReports->aObjects)) {
            for ($i = 0; $i < count($oPrintReports->aObjects); $i++) {
                if (!empty($oPrintReports->aObjects[$i]->aFields)) {
                    if (!empty($oPrintReports->aObjects[$i]->aFields['printreport_id']) &&
                            !empty($oPrintReports->aObjects[$i]->aFields['name'])) {
                        array_push($aReports, array(
                            'name' => $oPrintReports->aObjects[$i]->aFields['name'],
                            'printreport_id' => $oPrintReports->aObjects[$i]->aFields['printreport_id']
                        ));
                    }
                }
            }
        }

        return $aReports;
    }

    /**
     * Récupère la liste des calques
     * @param string $sNames names filter
     * @return array
     */
    function getVMapCalques($sNames = null) {

        $aCalques = array();
        $aParams = array();
        $sSql = $this->aSQL['getLayers'];

        if (!empty($sNames)) {
            $aNames = explode('|', $sNames);
            if (!empty($aNames)) {
                $aParams['namesList'] = array('value' => implode('|', $aNames), 'type' => 'group');
                $sSql = $this->aSQL['getLayersByName'];
            }
        }

        $oPDOresult = $this->oConnection->oBd->executeWithParams($sSql, $aParams);
        if (!$this->oConnection->oBd->enErreur()) {
            $aCalques = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);
        }

        return $aCalques;
    }

    /**
     * Récupère les relations cartes/calques
     * @return array
     */
    function getVMapMapCalques($sMapId = null, $sLayerId = null) {
        require_once 'MapLayers.class.inc';

        $aPath = ['vmap', 'maplayers'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'attributs' => 'layer_id|name|map_id|layer_index',
            'module' => 'vmap',
            'order_by' => 'layer_index'
        );

        $aFilter = [
            'relation' => 'AND',
            'operators' => []
        ];
        if (!empty($sMapId)) {
            array_push($aFilter['operators'], array(
                'column' => 'map_id',
                'compare_operator' => '=',
                'value' => $sMapId
            ));
        }
        if (!empty($sLayerId)) {
            array_push($aFilter['operators'], array(
                'column' => 'layer_id',
                'compare_operator' => '=',
                'value' => $sLayerId
            ));
        }
        if (count($aFilter['operators']) > 0) {
            $aValues['filter'] = json_encode($aFilter);
        }

        $oMapLayers = new MapLayers($aPath, $aValues, $this->aProperties);
        $oMapLayers->GET();

        $aMapCalques = array();
        if (!empty($oMapLayers->aObjects)) {
            for ($i = 0; $i < count($oMapLayers->aObjects); $i++) {
                if (!empty($oMapLayers->aObjects[$i]->aFields)) {
                    if (!empty($oMapLayers->aObjects[$i]->aFields['map_id']) &&
                            !empty($oMapLayers->aObjects[$i]->aFields['name'])) {
                        array_push($aMapCalques, array(
                            'layer_index' => $oMapLayers->aObjects[$i]->aFields['layer_index'],
                            'layer_id' => $oMapLayers->aObjects[$i]->aFields['layer_id'],
                            'map_id' => $oMapLayers->aObjects[$i]->aFields['map_id']
                        ));
                    }
                }
            }
        }

        return $aMapCalques;
    }

    /**
     * Récupère la liste des themes des calques
     * @param string $sNames names filter
     * @return array
     */
    function getVMapCalqueThemes($sNames = null) {
        require_once 'LayerThemes.class.inc';

        $aPath = ['vmap', 'layerthemes'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'module' => 'vmap'
        );

        // Ajout filtre sur le nom
        if (!empty($sNames)) {
            $aNames = explode('|', $sNames);
            if (!empty($aNames)) {
                $aFilter = array(
                    'column' => 'name',
                    'compare_operator' => 'IN',
                    'value' => $aNames
                );
                $aValues['filter'] = json_encode($aFilter);
            }
        }

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

        return $aLayerThemes;
    }

    /**
     * Récupère la liste des couches Mapserver
     * @param string $sNames names filter
     * @return array
     */
    function getVMapVm4msLayers($sNames = null, $aAttributs = ['name', 'tableschema', 'tablename', 'connection_id']) {
        require_once __DIR__ . '/../vm4ms/Layers.class.inc';

        $aPath = ['vm4ms', 'layers'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'module' => 'vm4ms',
            'order_by' => 'name'
        );

        if (is_array($aAttributs)) {
            $aValues['attributs'] = implode('|', $aAttributs);
        }

        // Ajout filtre sur le nom
        if (!empty($sNames)) {
            $aNames = explode('|', $sNames);
            if (!empty($aNames)) {
                $aFilter = array(
                    'column' => 'name',
                    'compare_operator' => 'IN',
                    'value' => $aNames
                );
                $aValues['filter'] = json_encode($aFilter);
            }
        }

        $oLayers = new Layers($aPath, $aValues, $this->aProperties);
        $oLayers->GET();

        $aVm4msLayers = array();
        if (!empty($oLayers->aObjects)) {
            for ($i = 0; $i < count($oLayers->aObjects); $i++) {
                if (!empty($oLayers->aObjects[$i]->aFields)) {
                    array_push($aVm4msLayers, $oLayers->aObjects[$i]->aFields);
                }
            }
        }

        return $aVm4msLayers;
    }

    /**
     * Récupère la liste des couches Mapserver
     * @param string $bPrivate True pour avoir uniquement les connexions privées
     * @return array
     */
    function getVMapVm4msConnections($bPrivate = false) {
        require_once __DIR__ . '/../vm4ms/LayerConnections.class.inc';

        $aPath = ['vm4ms', 'layerconnecitons'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'module' => 'vm4ms',
            'order_by' => 'connection_id'
        );

        if ($bPrivate) {
            $aFilter = array(
                'column' => 'private',
                'compare_operator' => '=',
                'value' => 'true'
            );
            $aValues['filter'] = json_encode($aFilter);
        }

        $oLayerConnections = new LayerConnections($aPath, $aValues, $this->aProperties);
        $oLayerConnections->GET();

        $aVm4msLayerConnections = array();
        if (!empty($oLayerConnections->aObjects)) {
            for ($i = 0; $i < count($oLayerConnections->aObjects); $i++) {
                if (!empty($oLayerConnections->aObjects[$i]->aFields)) {
                    if (!empty($oLayerConnections->aObjects[$i]->aFields['name'])) {
                        array_push($aVm4msLayerConnections, array(
                            'connection_id' => $oLayerConnections->aObjects[$i]->aFields['connection_id'],
                            'name' => $oLayerConnections->aObjects[$i]->aFields['name'],
                            'private' => $oLayerConnections->aObjects[$i]->aFields['private'],
                            'server' => $oLayerConnections->aObjects[$i]->aFields['server'],
                            'port' => $oLayerConnections->aObjects[$i]->aFields['port'],
                            'database' => $oLayerConnections->aObjects[$i]->aFields['database'],
                            'user' => $oLayerConnections->aObjects[$i]->aFields['user'],
                            'password' => $oLayerConnections->aObjects[$i]->aFields['password']
                        ));
                    }
                }
            }
        }

        return $aVm4msLayerConnections;
    }

    /**
     * Récupère la liste des objets métier
     * @param string $sNames names filter
     * @return array
     */
    function getVMapBusinessObjects($sNames = null) {

        $aBusinessObjects = array();
        $aParams = array();
        $sSql = $this->aSQL['getBusinessObjects'];

        if (!empty($sNames)) {
            $aNames = explode('|', $sNames);
            if (!empty($aNames)) {
                $aParams['idList'] = array('value' => implode('|', $aNames), 'type' => 'group');
                $sSql = $this->aSQL['getBusinessObjectByIds'];
            }
        }

        $oPDOresult = $this->oConnection->oBd->executeWithParams($sSql, $aParams);
        if (!$this->oConnection->oBd->enErreur()) {
            $aBusinessObjects = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);
        }

        for ($i = 0; $i < count($aBusinessObjects); $i++) {
            if (empty($aBusinessObjects[$i]['database'])) {
                $aBusinessObjects[$i]['database'] = $this->aProperties['database'];
            }
        }

        return $aBusinessObjects;
    }

    /**
     * Ordonne les cartes, calques, objets métiers, couches vm4ms sous forme d'arbre
     * @param array $aMaps
     * @param array $aCalques
     * @param array $aMapCalques
     * @return array
     */
    function getTreeOrderedMaps($aMaps, $aCalques, $aMapCalques) {

        for ($i = 0; $i < count($aMaps); $i++) {

            $aMaps[$i]['type'] = 'map';
            $aMaps[$i]['calques'] = [];

            // Pour chaque calque dans $aMapCalques
            for ($ii = 0; $ii < count($aMapCalques); $ii++) {
                if ($aMaps[$i]['map_id'] === $aMapCalques[$ii]['map_id']) {

                    // Trouve le calque correspondant dans $aCalques
                    for ($iii = 0; $iii < count($aCalques); $iii++) {
                        if ($aMapCalques[$ii]['layer_id'] === $aCalques[$iii]['layer_id']) {

                            // Ajoute le calque ordonné sous forma d'arbre
                            array_push($aMaps[$i]['calques'], $this->getTreeOrderedCalque($aCalques[$iii]));
                        }
                    }
                }
            }
        }

        return $aMaps;
    }

    /**
     * Retourne le calque sous forme d'arbre
     * @param array $oCalque
     * @return array
     */
    function getTreeOrderedCalque($oCalque) {

        $oTmpCalque = array(
            'type' => 'calque',
            'name' => $oCalque['name'],
            'layer_id' => $oCalque['layer_id']
        );

        // Liste des couches vm4ms
        if (!empty($oCalque['layer_list'])) {
            $oTmpCalque['vm4ms_layers'] = $this->getTreeOrderedVm4msLayers($oCalque);
        }

        // Liste des objets métiers
        if (!empty($oCalque['bo_id_list'])) {
            $oTmpCalque['business_objects'] = $this->getTreeOrderedBOs($oCalque);
        }

        return $oTmpCalque;
    }

    /**
     * Retourne sous forme d'arbre la couche vm4ms
     * @param array $oCalque
     * @return array
     */
    function getTreeOrderedVm4msLayers($oCalque) {
        $aVm4msLayers = [];

        if ($oCalque['service_vm4ms']) {
            if (!empty($oCalque['layer_list'])) {
                $aVm4msLayerList = explode(',', $oCalque['layer_list']);
                for ($i = 0; $i < count($aVm4msLayerList); $i++) {
                    $oLayerConnection = $this->getVm4msLayerConnecitonFromName($aVm4msLayerList[$i]);
                    if ($oLayerConnection !== false) {
                        array_push($aVm4msLayers, array(
                            'type' => 'vm4ms_layer',
                            'name' => $aVm4msLayerList[$i],
                            'server' => $oLayerConnection['server'],
                            'port' => $oLayerConnection['port'],
                            'database' => $oLayerConnection['database'],
                            'schema' => $oLayerConnection['schema'],
                            'table' => $oLayerConnection['table']
                        ));
                    }
                }
            }
        }

        return $aVm4msLayers;
    }

    /**
     * Retourne sous forme d'arbre l'objet métier
     * @param array $oCalque
     * @return array
     */
    function getTreeOrderedBOs($oCalque) {
        $aBOs = [];

        if (!empty($oCalque['bo_id_list'])) {
            $aBOList = explode('|', $oCalque['bo_id_list']);
            for ($i = 0; $i < count($aBOList); $i++) {

                $oBo = $this->getOBFromName($aBOList[$i]);
                if ($oBo !== false) {
                    array_push($aBOs, array(
                        'type' => 'business_object',
                        'name' => $oBo['business_object_id'],
                        'database' => $oBo['database'],
                        'schema' => $oBo['schema'],
                        'table' => $oBo['table'],
                        'id_field' => $oBo['id_field']
                    ));
                }
            }
        }

        return $aBOs;
    }

    /**
     * Récupère server, port, database, schema, table depuis le num d'une couche vm4ms
     * @param string $sLayerName
     * @return array
     */
    function getVm4msLayerConnecitonFromName($sLayerName) {
        $oLayerConnection = false;
        for ($i = 0; $i < count($this->aVm4msLayers); $i++) {
            if ($this->aVm4msLayers[$i]['name'] === $sLayerName) {
                $oConnection = $this->getVm4msConnexionFromId($this->aVm4msLayers[$i]['connection_id']);
                if ($oConnection !== false) {
                    if (empty($oConnection['server'])) {
                        $oConnection['server'] = $this->aProperties['server'];
                    }
                    if (empty($oConnection['port'])) {
                        $oConnection['port'] = $this->aProperties['port'];
                    }
                    if (empty($oConnection['database'])) {
                        $oConnection['database'] = $this->aProperties['database'];
                    }
                    if ($oConnection['server'] === $this->aProperties['server'] &&
                            $oConnection['port'] === $this->aProperties['port']) {

                        $oLayerConnection = array(
                            'server' => $oConnection['server'],
                            'port' => $oConnection['port'],
                            'database' => $oConnection['database'],
                            'schema' => $this->aVm4msLayers[$i]['tableschema'],
                            'table' => $this->aVm4msLayers[$i]['tablename']
                        );
                    }
                }
            }
        }
        return $oLayerConnection;
    }

    /**
     * Récupère la connexion depuis un identifiant
     * @param string $sConnectionId
     * @return array
     */
    function getVm4msConnexionFromId($sConnectionId) {
        $oConnection = false;
        for ($i = 0; $i < count($this->aVm4msConnections); $i++) {
            if ($this->aVm4msConnections[$i]['connection_id'] === $sConnectionId) {
                $oConnection = $this->aVm4msConnections[$i];
            }
        }
        return $oConnection;
    }

    /**
     * Récupère l'objet métier en fonction de son nom
     * @param string $sBOId
     * @return boolean|array
     */
    function getOBFromName($sBOId) {
        $oBO = false;

        for ($i = 0; $i < count($this->aBusinessObjects); $i++) {
            if ($this->aBusinessObjects[$i]['business_object_id'] === $sBOId) {
                return $this->aBusinessObjects[$i];
            }
        }

        return $oBO;
    }

    // Get Web services

    /**
     * Get the web services of the given business objects
     * @return string
     */
    function getWebServicesList() {
        $this->aReturn = Array();

        if (empty($this->aValues['business_objects'])) {
            $oError = new VitisError(2, 'business_objects parameter required');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        // Liste des répertoires contennus dans ws
        $aDirs = $this->getWsDirectoriesList();

        // Récupère les nos des organismes celons la règle de nommage des objets métier
        $aOrganismes = $this->getOrganismeNames();

        // Récupère les répertoires dont les nom correspondend aux organismes
        $aWebServices = $this->getOrganismesWebServices($aDirs, $aOrganismes);

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
            $this->aReturn['status'] = 1;
            $this->aReturn['web_services'] = $aWebServices;
            return json_encode($this->aReturn);
        }
    }

    /**
     * Get the list of the WS directories
     * @return array
     */
    function getWsDirectoriesList() {
        chdir($this->aProperties['vas_home'] . '/rest/ws');
        $aDirs = glob('*', GLOB_ONLYDIR);
        return $aDirs;
    }

    /**
     * Get the list of the organismes founded in aValues.business_objects
     * @return array
     */
    function getOrganismeNames() {

        // Liste des objets métier
        $aBOs = explode('|', $this->aValues['business_objects']);

        // Récupère les nos des organismes celons la règle de nommage des objets métier
        $aOrganismes = array();
        for ($i = 0; $i < count($aBOs); $i++) {
            if (strpos($aBOs[$i], '_') !== false) {
                array_push($aOrganismes, explode('_', $aBOs[$i])[0]);
            }
        }

        return $aOrganismes;
    }

    /**
     * Get the directories matching with the organismes
     * @param array $aDirs
     * @param array $aOrganismes
     * @return array
     */
    function getOrganismesWebServices($aDirs, $aOrganismes) {
        $aWebServices = array();
        for ($i = 0; $i < count($aDirs); $i++) {
            if (strpos($aDirs[$i], '_') !== false) {
                if (in_array(explode('_', $aDirs[$i])[0], $aOrganismes)) {
                    array_push($aWebServices, array(
                        'name' => $aDirs[$i]
                    ));
                }
            }
        }

        // Ajoute les infos sur les fichiers contenus au sein de chaque web service
        $aWebServices = $this->completeWebServicesInfos($aWebServices);

        return $aWebServices;
    }

    /**
     * Complete the web service introducing contained files
     * @param array $aWebServices
     * @return array
     */
    function completeWebServicesInfos($aWebServices) {
        for ($i = 0; $i < count($aWebServices); $i++) {
            chdir($this->aProperties['vas_home'] . '/rest/ws/' . $aWebServices[$i]['name']);
            $aWebServices[$i]['files'] = glob('*');
        }
        return $aWebServices;
    }

    // Get SQL objects

    /**
     * Récupère la liste des objets SQL exportables
     * @return string
     */
    function getSqlObjects() {
        require_once __DIR__ . '/../vitis/GenericQuerys.class.inc';
        $this->aReturn = Array();

        if (empty($this->aValues['database'])) {
            $oError = new VitisError(2, 'database parameter required');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        $aSqlObjects = array();

        // Liste des schémas
        $aSqlObjects = $this->completeSqlObjectsWithSchemas($aSqlObjects);

        // Liste des tables
        $aSqlObjects = $this->completeSqlObjectsWithTablesAndViews($aSqlObjects);

        // Liste des sequences
        $aSqlObjects = $this->completeSqlObjectsWithSequences($aSqlObjects);

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
            $this->aReturn['status'] = 1;
            $this->aReturn['sql_objects'] = $aSqlObjects;
            return json_encode($this->aReturn);
        }
    }

    /**
     * Ajoute à $aSqlObjects les schémas disponibles
     * @param array $aSqlObjects
     * @return array
     */
    function completeSqlObjectsWithSchemas($aSqlObjects) {

        $aSchemas = $this->getSchemas($this->aValues['database']);
        for ($i = 0; $i < count($aSchemas); $i++) {
            array_push($aSqlObjects, array(
                'type' => 'schema',
                'name' => $aSchemas[$i],
                'tables' => array()
            ));
        }

        return $aSqlObjects;
    }

    /**
     * Ajoute à $aSqlObjects les tables et les vues disponibles
     * @param array $aSqlObjects
     * @return array
     */
    function completeSqlObjectsWithTablesAndViews($aSqlObjects) {

        for ($i = 0; $i < count($aSqlObjects); $i++) {
            if ($aSqlObjects[$i]['type'] === 'schema') {
                $aSqlObjects[$i]['tables'] = $this->getTables($this->aValues['database'], $aSqlObjects[$i]['name']);
                $aSqlObjects[$i]['views'] = $this->getViews($this->aValues['database'], $aSqlObjects[$i]['name']);
            }
        }

        return $aSqlObjects;
    }

    /**
     * Ajoute à $aSqlObjects les sequences disponibles
     * @param array $aSqlObjects
     * @return array
     */
    function completeSqlObjectsWithSequences($aSqlObjects) {

        for ($i = 0; $i < count($aSqlObjects); $i++) {
            if ($aSqlObjects[$i]['type'] === 'schema') {
                $aSqlObjects[$i]['sequences'] = $this->getSequences($this->aValues['database'], $aSqlObjects[$i]['name']);
            }
        }

        return $aSqlObjects;
    }

    /**
     * Récupère la liste des schemas exportables
     * @param string $sDatabase
     * @return array
     */
    function getSchemas($sDatabase) {

        $aPath = ['vitis', 'genericquerys', $sDatabase, 'schemas'];
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'my_vitis_id' => $sDatabase,
            'module' => 'vitis',
            'order_by' => 'schema_name'
        );

        $oGenericQuerys = new GenericQuerys($aPath, $aValues, $this->aProperties);
        $oGenericQuerys->GET();

        $aSchemas = array();
        $aUnExportableSchemas = ['information_schema', 'pg_catalog'];
        if (!empty($oGenericQuerys->aObjects)) {
            for ($i = 0; $i < count($oGenericQuerys->aObjects); $i++) {
                if (!empty($oGenericQuerys->aObjects[$i]->aFields)) {
                    if (!empty($oGenericQuerys->aObjects[$i]->aFields['schema_name'])) {
                        if (!in_array($oGenericQuerys->aObjects[$i]->aFields['schema_name'], $aUnExportableSchemas)) {
                            array_push($aSchemas, $oGenericQuerys->aObjects[$i]->aFields['schema_name']);
                        }
                    }
                }
            }
        }

        return $aSchemas;
    }

    /**
     * Récupère la liste des tables exportables
     * @param string $sDatabase
     * @param string $sSchema
     */
    function getTables($sDatabase, $sSchema) {

        $aTables = [];
        if ($sDatabase != $this->oConnection->oBd->base) {
            $this->oBd = new BD($this->oConnection->oBd->login, $this->oConnection->oBd->mdp, $sDatabase, $this->oConnection->oBd->serveur, $this->oConnection->oBd->port, $this->oConnection->oBd->sgbd, $this->oConnection->oBd->sPageEncoding);
        }

        $sSQL = $this->aSQL['getTables'];
        $aSQLParams = array(
            'sSchema' => array('value' => $sSchema, 'type' => 'quoted_string')
        );
        $oResult = $this->oConnection->oBd->executeWithParams($sSQL, $aSQLParams);
        if (!$this->oConnection->oBd->enErreur()) {
            $aResult = $this->oConnection->oBd->getResultTableAssoc($oResult);
            for ($i = 0; $i < count($aResult); $i++) {
                if (!empty($aResult[$i]['tablename'])) {
                    array_push($aTables, $aResult[$i]['tablename']);
                }
            }
        }

        return $aTables;
    }

    /**
     * Récupère la liste des vues exportables
     * @param string $sDatabase
     * @param string $sSchema
     */
    function getViews($sDatabase, $sSchema) {

        $aViews = [];
        if ($sDatabase != $this->oConnection->oBd->base) {
            $this->oBd = new BD($this->oConnection->oBd->login, $this->oConnection->oBd->mdp, $sDatabase, $this->oConnection->oBd->serveur, $this->oConnection->oBd->port, $this->oConnection->oBd->sgbd, $this->oConnection->oBd->sPageEncoding);
        }

        $sSQL = $this->aSQL['getViews'];
        $aSQLParams = array(
            'sSchema' => array('value' => $sSchema, 'type' => 'quoted_string')
        );
        $oResult = $this->oConnection->oBd->executeWithParams($sSQL, $aSQLParams);
        if (!$this->oConnection->oBd->enErreur()) {
            $aResult = $this->oConnection->oBd->getResultTableAssoc($oResult);
            for ($i = 0; $i < count($aResult); $i++) {
                if (!empty($aResult[$i]['viewname'])) {
                    array_push($aViews, $aResult[$i]['viewname']);
                }
            }
        }

        return $aViews;
    }

    /**
     * Récupère la liste des sequences exportables
     * @param string $sDatabase
     * @param string $sSchema
     */
    function getSequences($sDatabase, $sSchema) {

        $aSequences = [];
        if ($sDatabase != $this->oConnection->oBd->base) {
            $this->oBd = new BD($this->oConnection->oBd->login, $this->oConnection->oBd->mdp, $sDatabase, $this->oConnection->oBd->serveur, $this->oConnection->oBd->port, $this->oConnection->oBd->sgbd, $this->oConnection->oBd->sPageEncoding);
        }

        $sSQL = $this->aSQL['getSequences'];
        $aSQLParams = array(
            'sSchema' => array('value' => $sSchema, 'type' => 'quoted_string')
        );
        $oResult = $this->oConnection->oBd->executeWithParams($sSQL, $aSQLParams);
        if (!$this->oConnection->oBd->enErreur()) {
            $aResult = $this->oConnection->oBd->getResultTableAssoc($oResult);
            for ($i = 0; $i < count($aResult); $i++) {
                if (!empty($aResult[$i]['sequence_name'])) {
                    array_push($aSequences, $aResult[$i]['sequence_name']);
                }
            }
        }

        return $aSequences;
    }

    /**
     * Get the list of the grantable objects
     * @param array $aLines
     * @return array
     */
    function getSQLGrantableObjectsFromLines($aLines) {

        $aSQLComponents = [];
        $aAvaliableTypes = array(
            'TABLE',
            'VIEW',
            'SEQUENCE'
        );

        for ($i = 0; $i < count($aLines); $i++) {

            $sName = $this->getCommentLineName($aLines[$i]);
            $sType = $this->getCommentLineType($aLines[$i]);

            if ($sName !== false && $sType !== false) {
                if (in_array($sType, $aAvaliableTypes)) {
                    array_push($aSQLComponents, array(
                        'name' => $sName,
                        'type' => $sType
                    ));
                }
            }
        }
        return $aSQLComponents;
    }

    /**
     * Récupère les noms des différents schémas
     * @param array $aLines
     * @return array
     */
    function getSchemasFromLines($aLines) {
        $sSchemaTag = 'Schema: ';
        $aSchemas = [];

        for ($i = 0; $i < count($aLines); $i++) {
            $sSchema = null;

            // Récupère le nom du schema dans les commentaires
            $sSchema = $this->getCommentLineSchema($aLines[$i]);
            if ($sSchema !== false) {
                if (!in_array($sSchema, $aSchemas)) {
                    array_push($aSchemas, $sSchema);
                }
            }
        }
        return $aSchemas;
    }

    /**
     * Cherche dans un commentaire la valeur de balise Name
     * @param string $sLine
     * @return string
     */
    function getCommentLineName($sLine) {
        $sName = false;
        if (substr($sLine, 0, 9) === '-- Name: ') {
            $iStartPos = 9;
            $iEndPos = strpos($sLine, ';', $iStartPos);
            if ($iEndPos !== false) {
                $sName = substr($sLine, $iStartPos, $iEndPos - $iStartPos);
            }
        }
        return $sName;
    }

    /**
     * Cherche dans un commentaire la valeur de balise Type
     * @param string $sLine
     * @return string
     */
    function getCommentLineType($sLine) {
        $sType = false;
        $sTag = 'Type: ';

        if (substr($sLine, 0, 7) === '-- Name') {
            $iStartPos = strpos($sLine, $sTag, 7);
            if ($iStartPos !== false) {
                $iStartPos = $iStartPos + strlen($sTag);
                $iEndPos = strpos($sLine, ';', $iStartPos);
                if ($iEndPos !== false) {
                    $sType = substr($sLine, $iStartPos, $iEndPos - $iStartPos);
                }
            }
        }

        return $sType;
    }

    /**
     * Cherche dans un commentaire la valeur de balise Schema
     * @param string $sLine
     * @return string
     */
    function getCommentLineSchema($sLine) {
        $sSchema = false;
        $sTag = 'Schema: ';

        if (substr($sLine, 0, 7) === '-- Name') {
            $iStartPos = strpos($sLine, $sTag, 7);
            if ($iStartPos !== false) {
                $iStartPos = $iStartPos + strlen($sTag);
                $iEndPos = strpos($sLine, ';', $iStartPos);
                if ($iEndPos !== false) {
                    $sSchema = substr($sLine, $iStartPos, $iEndPos - $iStartPos);
                }
            }
        }

        return $sSchema;
    }

    // Get Existing vMap Objects

    /**
     * Récupère les objets vMap qui matchent avec les noms passés en paramètre
     * @return string
     */
    function getExistingVMapObjectsList() {

        $this->aReturn = Array();

        $aVMapObjects = array();

        // Liste des cartes
        if (!empty($this->aValues['maps'])) {
            $aMaps = $this->getVMapMaps($this->aValues['maps']);
            if (!empty($aMaps)) {
                $aVMapObjects['maps'] = $aMaps;
            }
        }

        // Liste des services
        if (!empty($this->aValues['services'])) {
            $aServices = $this->getVMapServices($this->aValues['services']);
            if (!empty($aServices)) {
                $aVMapObjects['services'] = $aServices;
            }
        }

        // Liste des calques
        if (!empty($this->aValues['calques'])) {
            $aCalques = $this->getVMapCalques($this->aValues['calques']);
            if (!empty($aCalques)) {
                $aVMapObjects['calques'] = $aCalques;
            }
        }

        // Liste des thèmes des calques
        if (!empty($this->aValues['calque_themes'])) {
            $aCalqueThemes = $this->getVMapCalqueThemes($this->aValues['calque_themes']);
            if (!empty($aCalqueThemes)) {
                $aVMapObjects['calque_themes'] = $aCalqueThemes;
            }
        }

        // Liste des couches mapserver
        if (!empty($this->aValues['vm4ms_layers'])) {
            $aVm4msLayers = $this->getVMapVm4msLayers($this->aValues['vm4ms_layers']);
            if (!empty($aVm4msLayers)) {
                $aVMapObjects['vm4ms_layers'] = $aVm4msLayers;
            }
        }

        // Liste des objets métier
        if (!empty($this->aValues['business_objects'])) {
            $aBusinessObjects = $this->getVMapBusinessObjects($this->aValues['business_objects']);
            if (!empty($aBusinessObjects)) {
                $aVMapObjects['business_objects'] = $aBusinessObjects;
            }
        }

        // Liste des événements
        if (!empty($this->aValues['events'])) {
            $aEvents = $this->getVMapEvents($this->aValues['events']);
            if (!empty($aEvents)) {
                $aVMapObjects['events'] = $aEvents;
            }
        }

        // Liste des rapports
        if (!empty($this->aValues['reports'])) {
            $aReports = $this->getVMapReports($this->aValues['reports']);
            if (!empty($aReports)) {
                $aVMapObjects['reports'] = $aReports;
            }
        }

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
            $this->aReturn['status'] = 1;
            $this->aReturn['vmap_objects'] = $aVMapObjects;
            return json_encode($this->aReturn);
        }
    }

    // Get Existing Web services

    /**
     * Récupère les web services qui matchent avec les noms passés en paramètre
     * @return string
     */
    function getExistingWebServicesList() {

        $this->aReturn = [];
        $aWebServicesReturned = [];

        // Liste des web services déjà présents
        if (!empty($this->aValues['web_services'])) {

            // Liste des répertoires contennus dans ws
            $aDirs = $this->getWsDirectoriesList();

            // Liste des web services demandés
            $aWebServices = explode('|', $this->aValues['web_services']);

            for ($i = 0; $i < count($aDirs); $i++) {
                if (in_array($aDirs[$i], $aWebServices)) {
                    array_push($aWebServicesReturned, $aDirs[$i]);
                }
            }
        }

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
            $this->aReturn['status'] = 1;
            $this->aReturn['web_services'] = $aWebServicesReturned;
            return json_encode($this->aReturn);
        }
    }

}

?>

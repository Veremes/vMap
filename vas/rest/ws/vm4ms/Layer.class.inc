<?php

require_once 'Vmap4MapServer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Layer.class.inc
 * \class Layer
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Layer php class
 *
 * This class defines operation for one layer
 * 
 */
class Layer extends Vmap4MapServer {

    public $oError;

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
        $this->aSelectedFields = Array("ms_layer_id", "name", "title", "coordsys_id", "coordsys_label", "source_id", "connection_id", "tableschema", "tablename", "tableidfield", "definition", "opacity", "active", "ms_layertype_id", "wmsservices", "wmsservices_label", "private_connection", "connection_label", "source_label", "definitiontmp", "metadata_id");
    }

    /**
     * @SWG\Get(path="/layers/{ms_layer_id}", 
     *   tags={"Layers"},
     *   summary="Get layer",
     *   description="Request to get layer by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Parameter(
     *     name="ms_layer_id",
     *     in="path",
     *     description="layer id",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layers")
     *     )
     *  )
     */

    /**
     * get informations about layer
     */
    function GET() {
        require $this->sRessourcesFile;
        // Infos de la couche.
        $aParams['sSchemaVm4ms'] = array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name');
        $aParams['ms_layer_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'number');
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getLayer'], $aParams);
        if ($this->oConnection->oBd->nombreLigne($oPDOresult) > 0) {
            $this->aFields = $this->oConnection->oBd->ligneSuivante($oPDOresult);
            // Flux wms rattachés à la couche.
            if (in_array("wmsservices", $this->aSelectedFields)) {
                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getLayerWmsServices'], $aParams);
                $sListWmsServiceId = "";
                $aListWmsServiceName = array();
                while ($aLigne = $this->oConnection->oBd->ligneSuivante($oPDOresult)) {
                    if ($sListWmsServiceId == "")
                        $sListWmsServiceId = $aLigne["wmsservice_id"];
                    else
                        $sListWmsServiceId .= "|" . $aLigne["wmsservice_id"];
                    $aListWmsServiceName[] = $aLigne["wmsservice_id"];
                }
                $oPDOresult = $this->oConnection->oBd->fermeResultat();
                $this->aFields['wmsservices'] = $sListWmsServiceId;
                $this->aFields['wmsservices_label'] = implode(',', $aListWmsServiceName);
            }
        }
    }

    /**
     * delete a layer
     */
    function DELETE() {
        require $this->sRessourcesFile;
        // Liste des flux WMS associés à la couche.
        $aWmsServicesId = array();
        $aParams['sSchemaVm4ms'] = array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name');
        $aParams['ms_layer_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'number');

        // Services associés
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getLayerWmsServices'], $aParams);
        while ($aLigne = $this->oConnection->oBd->ligneSuivante($oPDOresult)) {
            $aWmsServicesId[] = $aLigne['wmsservice_id'];
        }

        // Nom de la couche.
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getLayerName'], $aParams);
        $aLayer = $this->oConnection->oBd->ligneSuivante($oPDOresult);
        $oPDOresult = $this->oConnection->oBd->fermeResultat();

        // Test si la couche est associée à un calque
        $bAreVmapCalquesAssociated = $this->areVmapCalquesAssociated($aWmsServicesId, $aLayer['name']);

        if ($bAreVmapCalquesAssociated === false) {
            // Supprime l'association des flux WMS rattachés à la couche.
            $this->oConnection->oBd->delete($this->aProperties['schema_vm4ms'], 'wmsservice_ms_layer', 'ms_layer_id', $this->aValues["my_vitis_id"]);
            // Création du fichier .map de tous les flux WMS associés à la couche.
            $oLayer = new Layer($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
            $oLayer->GET();
            $oLayer->createLayerWmsServicesMapFile($oLayer->aFields['private_connection'], $aWmsServicesId);
            // Supprime la couche.
            $this->oConnection->oBd->delete($this->aProperties['schema_vm4ms'], 'ms_layer', 'name', $aLayer['name'], 'text');
            if ($this->oConnection->oBd->enErreur())
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            else
                $this->aFields['ms_layer_id'] = $this->aValues['my_vitis_id'];
        }else {
            $sErrorMessage = 'Le ou les calque(s) vMap suivants sont associés à cette couche: ' . implode(', ', $bAreVmapCalquesAssociated);
            $this->oError = new VitisError(1, $sErrorMessage);
            $this->oConnection->oError = new VitisError(1, $sErrorMessage);
        }
    }

    /**
     * Création du fichier .map (prod.) de tous les flux WMS associés à la couche.
     * @param boolean $bPrivateConnection
     * @param array $aWmsServicesId
     * @return message
     */
    function createLayerWmsServicesMapFile($bPrivateConnection, $aWmsServicesId = array()) {
        require $this->sRessourcesFile;
        // Flux WMS privé.
        if ($bPrivateConnection) { // $this->aFields['private_connection']
            /*
              $aValues = array('token' => session_id(), 'wmsservice_id' => $this->aProperties['private_wms_service'], 'my_vitis_id' => $this->aProperties['private_wms_service'], 'type' => 'prod');
              $oWmsServices = new WmsServices($this->aPath, $aValues, $this->aProperties, $this->oConnection);
              $oWmsServices->GET();
              $oWmsServices->createMapFile();
             */
        } else {
            // Tous les fluxs WMS publics.
            if (empty($aWmsServicesId)) {
                $aParams['sSchemaVm4ms'] = array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name');
                $aParams['ms_layer_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'number');
                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getLayerWmsServices'], $aParams);
                while ($aLigne = $this->oConnection->oBd->ligneSuivante($oPDOresult)) {
                    $aWmsServicesId[] = $aLigne['wmsservice_id'];
                }
                $oPDOresult = $this->oConnection->oBd->fermeResultat();
            }
            // Création des fichiers .map des flux WMS.
            foreach ($aWmsServicesId as $sWmsServiceId) {
                $aValues = array('token' => session_id(), 'wmsservice_id' => $sWmsServiceId, 'my_vitis_id' => $sWmsServiceId, 'type' => 'prod', 'sEncoding' => $this->aValues['sEncoding'], 'sSourceEncoding' => $this->aValues['sSourceEncoding'], 'output' => $this->aValues['output']);
                $oWmsServices = new WmsServices($this->aPath, $aValues, $this->aProperties, $this->oConnection);
                $oWmsServices->GET();
                $oWmsServices->createMapFile();
            }
        }
    }

    /**
     * Return false if any vMap calque is associated to the layer, otherwise returns the list of the associated calques
     * @param string $aWmsServices
     * @param type $sLayerName
     * @return string|false
     */
    function areVmapCalquesAssociated($aWmsServices, $sLayerName) {
        require $this->sRessourcesFile;
        
        if (!count($aWmsServices) > 0) {
            return false;
        }

        for ($i = 0; $i < count($aWmsServices); $i++) {
            $aWmsServices[$i] = "'vm4ms_" . $aWmsServices[$i] . "'";
        }
        
        if (!count($aWmsServices) > 0) {
            return false;
        }

        $aParams['sSchemaVm4ms'] = array();
        $aSql['getVmapCalquesFromVM4MSService'] = str_replace('[serviceIdList]', implode(',', $aWmsServices), $aSql['getVmapCalquesFromVM4MSService']);

        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getVmapCalquesFromVM4MSService'], $aParams);
        $aCalques = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);

        $bAreVmapCalquesAssociated = false;
        for ($i = 0; $i < count($aCalques); $i++) {
            $aCalqueLayerList = explode(',', $aCalques[$i]['layer_list']);
            if (in_array($sLayerName, $aCalqueLayerList)) {
                if ($bAreVmapCalquesAssociated === false) {
                    $bAreVmapCalquesAssociated = array($aCalques[$i]['name']);
                } else {
                    array_push($bAreVmapCalquesAssociated, $aCalques[$i]['name']);
                }
            }
        }
        return $bAreVmapCalquesAssociated;
    }

    /**
     * Test la définition de la couche passée en paramètre
     * en comptant les mots clés et les balises END
     */
    function testDefinitionIndent() {

        $sDefinition = $this->aFields['definition'];
        if (!empty($sDefinition)) {

            /**
             * Mots clés nécessitant une balise END
             */
            $aTagKeywords = array('COMPOSITE', 'MAP', 'LINESET', 'MARKERSET', 'POINTS', 'SHADESET', 'STYLE', 'CLASS', 'FEATURE', 'JOIN', 'LABEL', 'LAYER', 'LEGEND', 'PROJECTION', 'GRID', 'QUERY', 'OUTPUTFORMAT', 'QUERYMAP', 'REFERENCE', 'SCALEBAR', 'WEB', 'METADATA', 'FONTSET', 'SYMBOLSET', 'VALIDATION', 'PATTERN');

            $sTagKeywords = '';
            $iTagKeywords = 0;
            $iEndKeywords = $this->countTagsInDefinition($sDefinition, 'END');
            for ($i = 0; $i < count($aTagKeywords); $i++) {
                $iSubStrCount = $this->countTagsInDefinition($sDefinition, $aTagKeywords[$i]);
                if ($iSubStrCount > 0) {
                    $iTagKeywords += $iSubStrCount;
                    if (!empty($sTagKeywords)) {
                        $sTagKeywords .= ', ';
                    }
                    $sTagKeywords .= $aTagKeywords[$i] . ': ' . $iSubStrCount;
                }
            }
            if ($iTagKeywords === $iEndKeywords) {
                $this->aFields['definition_structure_valid'] = true;
            } else {
                $this->aFields['definition_structure_valid'] = false;
                if ($iTagKeywords > $iEndKeywords) {
                    $this->aFields['definition_structure_error'] = 'MISSING_END_TAG';
                } else if ($iTagKeywords < $iEndKeywords) {
                    $this->aFields['definition_structure_error'] = 'TOO_MUCH_END_TAGS';
                } else {
                    $this->aFields['definition_structure_error'] = 'INDETERMINATED_ERROR';
                }
                $this->aFields['definition_structure_tags'] = $sTagKeywords . ', END: ' . $iEndKeywords;
            }
        }
    }

    /**
     * Compte le nombre de fois qu'une balise est définie dans la définition
     * @param string $sDefinition
     * @param string $sTag
     * @return integer
     */
    function countTagsInDefinition($sDefinition, $sTag) {
        // Tous les mots entiers ne commencant pas par { ou #
        return preg_match_all('/((?:[^{#"]|\A)(\b))' . $sTag . '(\b|\Z)/', $sDefinition);
    }

}

?>
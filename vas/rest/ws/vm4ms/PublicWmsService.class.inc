<?php

require_once 'Vmap4MapServer.class.inc';
require_once 'PublicWmsServiceLayers.class.inc';
require_once __DIR__ . '/../vmap/Services.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file PublicWmsService.class.inc
 * \class PublicWmsService
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the PublicWmsService php class
 *
 * This class defines operation for one public wms service
 * 
 */
class PublicWmsService extends Vmap4MapServer {

    public $oError;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $bShortcut false to reinit variables
     * @param type $oConnection connection object
     * @param type $bShortcut false to reinit variables
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        parent::__construct($aPath, $aValues, $properties, $bShortcut, $oConnection);
        $this->aSelectedFields = Array("wmsservice_id", "description", "definition", "web_id", "web_name", "msdebuglevel_id");
    }

    /**
     * get informations about public wms service
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vm4ms'], 'v_public_wms_service', 'wmsservice_id');
        $this->aFields['wms_service_url'] = $this->aProperties["ms_cgi_url"] . "/public/" . $this->aFields['wmsservice_id'];
    }

    /**
     * delete a public wms service
     */
    function DELETE() {
        require $this->sRessourcesFile;

        $bServicesExist = false;
        $bLayersExist = false;

        // Vérifie qu'il y ait aucune couche associée
        if ($this->areLayersAssociated()) {
            $bLayersExist = true;
            $this->oError = new VitisError(1, 'ERROR_LAYER_ASSOCIATED');
            $this->oConnection->oError = new VitisError(1, 'ERROR_LAYER_ASSOCIATED');
        }

        // Vérifie qu'il y ait aucun service vMap associée
        if ($this->areVmapServicesAssociated()) {
            $bServicesExist = true;
            $this->oError = new VitisError(1, 'ERROR_SERVICE_ASSOCIATED');
            $this->oConnection->oError = new VitisError(1, 'ERROR_SERVICE_ASSOCIATED');
        }

        if (!$bLayersExist && !$bServicesExist) {
            $this->oConnection->oBd->delete($this->aProperties['schema_vm4ms'], 'wmsservice', 'wmsservice_id', $this->aValues['my_vitis_id'], 'text');
            if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            } else {
                $this->aFields['wmsservice_id'] = $this->aValues['my_vitis_id'];
            }
        }
    }

    /**
     * Return true if a vMap service is associated
     * @return boolean
     */
    function areVmapServicesAssociated() {
        $aVmapServicePath = Array('vmap', 'services');

        $this->aValues['my_vitis_id'] = trim($this->aValues['my_vitis_id'], '"');
        $this->aValues['my_vitis_id'] = trim($this->aValues['my_vitis_id'], "'");

        // Récupère l'id du service vMap
        $aVmapGetServiceValues = Array(
            'token' => $this->aValues['token'],
            'filter' => '{"relation": "AND", "operators": [{"column": "name", "compare_operator": "=", "value": "vm4ms_' . $this->aValues['my_vitis_id'] . '"}]}',
            'vitis_version' => $this->aValues['vitis_version'],
            'id' => 'services',
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'module' => 'vmap'
        );
        $oVmapService = new Services($aVmapServicePath, $aVmapGetServiceValues, $this->aProperties, false, $this->oConnection);
        $oVmapService->GET();

        if (count($oVmapService->aObjects) > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Return true if a layer is associated
     * @return boolean
     */
    function areLayersAssociated() {
        $aGetLayersPath = Array('vm4ms', 'publicwmsservicelayers');

        $this->aValues['my_vitis_id'] = trim($this->aValues['my_vitis_id'], '"');
        $this->aValues['my_vitis_id'] = trim($this->aValues['my_vitis_id'], "'");

        // Récupère l'id du service vMap
        $aGetLayersValues = Array(
            'token' => $this->aValues['token'],
            'filter' => '{"relation": "AND", "operators": [{"column": "wmsservice_id", "compare_operator": "=", "value": "' . $this->aValues['my_vitis_id'] . '"}]}',
            'vitis_version' => $this->aValues['vitis_version'],
            'id' => 'publicwmsservicelayers',
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'module' => 'vm4ms'
        );
        $oPublicWmsServiceLayers = new PublicWmsServiceLayers($aGetLayersPath, $aGetLayersValues, $this->aProperties, false, $this->oConnection);
        $oPublicWmsServiceLayers->GET();

        if (count($oPublicWmsServiceLayers->aObjects) > 0) {
            return true;
        } else {
            return false;
        }
    }

}

?>
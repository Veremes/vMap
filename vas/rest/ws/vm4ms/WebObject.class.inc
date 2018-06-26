<?php

require_once 'Vmap4MapServer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file WebObject.class.inc
 * \class WebObject
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the WebObject php class
 *
 * This class defines operation for one web object
 * 
 */
class WebObject extends Vmap4MapServer {

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
        $this->aSelectedFields = Array("web_id", "name", "definition");
    }

    /**
     * @SWG\Get(path="/webobjects/{web_id}", 
     *   tags={"WebObjects"},
     *   summary="Get web object",
     *   description="Request to get web object by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="web_id",
     *     in="path",
     *     description="web id",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/webobjects")
     *     )
     *  )
     */

    /**
     * get informations about web object
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vm4ms'], 'web', 'web_id');
    }

    /**
     * delete a web object
     */
    function DELETE() {
        require $this->sRessourcesFile;

        $bServiceExists = false;

        // Vérifie qu'il y ait aucune couche associée
        if ($this->areWmsServicesAssociated()) {
            $bServiceExists = true;
            $this->oError = new VitisError(1, 'ERROR_WMSSERVICE_ASSOCIATED');
            $this->oConnection->oError = new VitisError(1, 'ERROR_WMSSERVICE_ASSOCIATED');
        }

        if (!$bServiceExists) {
            $this->oConnection->oBd->delete($this->aProperties['schema_vm4ms'], 'web', 'web_id', $this->aValues['my_vitis_id'], 'string');
            if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            } else {
                $this->aFields['web_id'] = $this->aValues['my_vitis_id'];
            }
        }
    }

    /**
     * Return true if a wmsservice is associated
     * @return boolean
     */
    function areWmsServicesAssociated() {
        require_once 'WmsServices.class.inc';

        $aGetWmsServicesPath = Array('vm4ms', 'wmsservices');

        $this->aValues['my_vitis_id'] = trim($this->aValues['my_vitis_id'], '"');
        $this->aValues['my_vitis_id'] = trim($this->aValues['my_vitis_id'], "'");

        // Récupère l'id du service vMap
        $aGetWmsServicesValues = Array(
            'token' => $this->aValues['token'],
            'filter' => '{"relation": "AND", "operators": [{"column": "web_id", "compare_operator": "=", "value": ' . $this->aValues['my_vitis_id'] . '}]}',
            'vitis_version' => $this->aValues['vitis_version'],
            'id' => 'wmsservices',
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'module' => 'vm4ms'
        );
        $oWmsServices = new WmsServices($aGetWmsServicesPath, $aGetWmsServicesValues, $this->aProperties);
        $oWmsServices->GET();

        if (count($oWmsServices->aObjects) > 0) {
            return true;
        } else {
            return false;
        }
    }

}

?>
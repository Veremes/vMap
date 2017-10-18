<?php

require_once 'Vmap4MapServer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file CoordinateSystem.class.inc
 * \class CoordinateSystem
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the CoordinateSystem php class
 *
 * This class defines operation for one coordinate system
 * 
 */
class CoordinateSystem extends Vmap4MapServer {

    public $oError;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $oConnection) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
        $this->aSelectedFields = Array("coordsys_id", "epsg", "definition", "label", "epsg_definition");
    }

    /**
     * @SWG\Get(path="/coordinatesystems/{coordsys_id}", 
     *   tags={"CoordinateSystems"},
     *   summary="Get coordinate system",
     *   description="Request to get coordinate system by id",
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
     *     name="coordsys_id",
     *     in="path",
     *     description="coordsys id",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/coordinatesystems")
     *     )
     *  )
     */

    /**
     * get informations about coordinate system
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vm4ms'], 'coordsys', 'coordsys_id');
    }

    /**
     * delete a coordinate system
     */
    function DELETE() {
        require $this->sRessourcesFile;
        $bLayersExist = false;

        // Vérifie qu'il y ait aucune couche associée
        if ($this->areLayersAssociated()) {
            $bLayersExist = true;
            $this->oError = new VitisError(1, 'ERROR_LAYER_ASSOCIATED');
            $this->oConnection->oError = new VitisError(1, 'ERROR_LAYER_ASSOCIATED');
        }
        
        if (!$bLayersExist) {
            $this->oConnection->oBd->delete($this->aProperties['schema_vm4ms'], 'coordsys', 'coordsys_id', $this->aValues['my_vitis_id'], 'string');
            if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            } else {
                $this->aFields['coordsys_id'] = $this->aValues['my_vitis_id'];
            }
        }
    }

    /**
     * Return true if a layer is associated
     * @return boolean
     */
    function areLayersAssociated() {
        require_once 'Layers.class.inc';

        $aGetLayersPath = Array('vm4ms', 'layers');

        $this->aValues['my_vitis_id'] = trim($this->aValues['my_vitis_id'], '"');
        $this->aValues['my_vitis_id'] = trim($this->aValues['my_vitis_id'], "'");

        // Récupère l'id du service vMap
        $aGetLayersValues = Array(
            'token' => $this->aValues['token'],
            'filter' => '{"relation": "AND", "operators": [{"column": "coordsys_id", "compare_operator": "=", "value": ' . $this->aValues['my_vitis_id'] . '}]}',
            'vitis_version' => $this->aValues['vitis_version'],
            'id' => 'layers',
            'output' => $this->aValues['output'],
            'sEncoding' => $this->aValues['sEncoding'],
            'sSourceEncoding' => $this->aValues['sSourceEncoding'],
            'xslstylesheet' => $this->aValues['xslstylesheet'],
            'module' => 'vm4ms'
        );
        $oLayers = new Layers($aGetLayersPath, $aGetLayersValues, $this->aProperties);
        $oLayers->GET();

        if (count($oLayers->aObjects) > 0) {
            return true;
        } else {
            return false;
        }
    }

}

?>
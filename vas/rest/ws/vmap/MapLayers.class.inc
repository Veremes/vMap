<?php

/**
 * \file MapLayers.class.inc
 * \class MapLayers
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the MapLayers php class
 *
 * This class defines Rest Api to Vmap MapLayers
 * 
 */
require_once 'Vmap.class.inc';
require_once 'MapLayer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class MapLayers extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/maplayers",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/maplayers")
     *   }
     * )
     * * @SWG\Tag(
     *   name="MapLayers",
     *   description=""
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function __construct($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->aSelectedFields = Array("layer_id", "name", "theme_name", "layer_visible", "map_id", "layer_opacity", "layer_index");
    }

    /**
     * @SWG\Get(path="/mapLayers",
     *   tags={"MapLayers"},
     *   summary="Get map layers",
     *   description="Request to get map layers",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="order_by",
     *     in="query",
     *     description="list of ordering fields",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sort_order",
     *     in="query",
     *     description="sort order",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="limit",
     *     in="query",
     *     description="number of element",
     *     required=false,
     *     type="integer"
     *   ),
     * @SWG\Parameter(
     *     name="offset",
     *     in="query",
     *     description="index of first element",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="list of attributs",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="filter",
     *     in="query",
     *     description="filter results",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="distinct",
     *     in="query",
     *     description="delete duplicates",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Porperties Response",
     *         @SWG\Schema(ref="#/definitions/maplayers")
     *     )
     *  )
     */

    /**
     * get MapLayers
     * @return  MapLayers
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'v_map_layer', 'map_id');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/maplayers/{map_id}",
     *   tags={"MapLayers"},
     *   summary="Update map layers",
     *   description="Request to update the layers of a map",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="map_id",
     *     in="path",
     *     description="Id of the map",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Parameter(
     *     name="map_layers",
     *     in="query",
     *     description="Layers of the map",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Properties Response",
     *         @SWG\Schema(ref="#/definitions/maplayers")
     *     ),
     * 
     *  )
     */
    /**
     * @SWG\Put(path="/maplayers/{map_id}/visibility",
     *   tags={"MapLayers"},
     *   summary="Update visibility of map layers",
     *   description="Request to update the visibility of the layers of a map",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="map_id",
     *     in="path",
     *     description="Id of the map",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Parameter(
     *     name="map_layers",
     *     in="query",
     *     description="Layers of the map",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="visibility",
     *     in="query",
     *     description="Visibility of the layers",
     *     required=true,
     *     type="boolean"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Properties Response",
     *         @SWG\Schema(ref="#/definitions/maplayers")
     *     ),
     * 
     *  )
     */
    /**
     * @SWG\Put(path="/maplayers/{map_id}/sorting",
     *   tags={"MapLayers"},
     *   summary="Sort map layers",
     *   description="Request to sort the layers of a map",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="map_id",
     *     in="path",
     *     description="Id of the map",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Parameter(
     *     name="map_layers",
     *     in="query",
     *     description="Layers of the map",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Properties Response",
     *         @SWG\Schema(ref="#/definitions/maplayers")
     *     ),
     *  )
     */
    /**
     * @SWG\Put(path="/maplayers/{map_id}/opacity",
     *   tags={"MapLayers"},
     *   summary="Set opacity of a map layer",
     *   description="Request to set the opacity of a map layer",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="map_id",
     *     in="path",
     *     description="Id of the map",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Parameter(
     *     name="layer_id",
     *     in="query",
     *     description="Layer of the map",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="layer_opacity",
     *     in="query",
     *     description="Opacity of the layer",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Properties Response",
     *         @SWG\Schema(ref="#/definitions/maplayers")
     *     ),
     *  )
     */

    /**
     * modify map
     * @return array containing the status and the message
     */
    function PUT() {
        require $this->sRessourcesFile;
        if (!empty($this->aPath[3])) {
            if ($this->aPath[3] == "visibility") {
                // Calques dont la définition doit changer ?
                if (!empty($this->aValues['map_layers'])) {
                    $sSql = $aSql['updateMapLayersVisibility'];
                    $aSQLParams = array(
                        'sSchemaVmap' => array('value' => $this->aProperties['schema_vmap'], 'type' => 'column_name'),
                        'visibility' => array('value' => $this->aValues['visibility'], 'type' => 'string'),
                        'map_id' => array('value' => $this->aValues['my_vitis_id'], 'type' => 'number'),
                        'map_layers' => array('value' => $this->aValues['map_layers'], 'type' => 'group'),
                    );
                    $resultat = $this->oConnection->oBd->executeWithParams($sSql, $aSQLParams);
                    if ($this->oConnection->oBd->enErreur()) {
                        $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                        $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                        $aXmlRacineAttribute['status'] = 0;
                        $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    } else {
                        $aXmlRacineAttribute['status'] = 1;
                        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    }
                }
            } else if ($this->aPath[3] == "sorting") {
                if (!empty($this->aValues['map_layers'])) {
                    $aXmlRacineAttribute['status'] = 1;
                    $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    $aLayers = explode('|', $this->aValues['map_layers']);
                    $i = 1;
                    foreach ($aLayers as $iLayerId) {
                        $sSql = $aSql['updateMapLayerIndex'];
                        $aSQLParams = array(
                            'sSchemaVmap' => array('value' => $this->aProperties['schema_vmap'], 'type' => 'column_name'),
                            'index' => array('value' => $i, 'type' => 'number'),
                            'map_id' => array('value' => $this->aValues["my_vitis_id"], 'type' => 'number'),
                            'layer_id' => array('value' => $iLayerId, 'type' => 'number')
                        );
                        $resultat = $this->oConnection->oBd->executeWithParams($sSql, $aSQLParams);
                        if ($this->oConnection->oBd->enErreur()) {
                            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                            $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                            $aXmlRacineAttribute['status'] = 0;
                            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                            break;
                        }
                        $i++;
                    }
                }
            } else if ($this->aPath[3] == "opacity") {
                $aXmlRacineAttribute['status'] = 1;
                $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                $sSql = $aSql['updateMapLayerOpacity'];
                $aSQLParams = array(
                    'sSchemaVmap' => array('value' => $this->aProperties['schema_vmap'], 'type' => 'column_name'),
                    'map_id' => array('value' => $this->aValues["my_vitis_id"], 'type' => 'number'),
                    'layer_opacity' => array('value' => $this->aValues['layer_opacity'], 'type' => 'number'),
                    'layer_id' => array('value' => $this->aValues['layer_id'], 'type' => 'number')
                );
                $resultat = $this->oConnection->oBd->executeWithParams($sSql, $aSQLParams);
                if ($this->oConnection->oBd->enErreur()) {
                    $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                }
            }
        } else {
            // Calques à rattacher à la carte ?
            if (!empty($this->aValues['map_layers'])) {
                $aLayers = explode('|', $this->aValues['map_layers']);
                foreach ($aLayers as $iLayerId) {
                    $sSql = $aSql['insertMapLayers'];
                    $aSQLParams = array(
                        'sSchemaVmap' => array('value' => $this->aProperties['schema_vmap'], 'type' => 'column_name'),
                        'map_id' => array('value' => $this->aValues["my_vitis_id"], 'type' => 'number'),
                        'layer_id' => array('value' => $iLayerId, 'type' => 'number')
                    );
                    $resultat = $this->oConnection->oBd->executeWithParams($sSql, $aSQLParams);
                    if ($this->oConnection->oBd->enErreur()) {
                        $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                        $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                        $aXmlRacineAttribute['status'] = 0;
                        $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    } else {
                        $aXmlRacineAttribute['status'] = 1;
                        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    }
                }
            }
        }
        return $sMessage;
    }

    /**
     * @SWG\Delete(path="/maplayers/{map_id}",
     *   tags={"MapLayers"},
     *   summary="Delete map layers",
     *   description="Request to delete layers of a map",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="map token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="map_id",
     *     in="path",
     *     description="id of the map",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id of the map layers",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/maplayers")
     *     )
     *  )
     */

    /**
     * delete map
     * @return id of map deleted or error object if a map is not deleted
     */
    function DELETE() {
        require $this->sRessourcesFile;
        // Calques à supprimer ?
        if (!empty($this->aValues['idList'])) {
            $sSql = $aSql['deleteMapLayers'];
            $aSQLParams = array(
                'sSchemaVmap' => array('value' => $this->aProperties['schema_vmap'], 'type' => 'column_name'),
                'map_id' => array('value' => $this->aValues["my_vitis_id"], 'type' => 'number'),
                'idList' => array('value' => $this->aValues['idList'], 'type' => 'group')
            );            
            $resultat = $this->oConnection->oBd->executeWithParams($sSql, $aSQLParams);
            if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            } else {
                $aXmlRacineAttribute['status'] = 1;
                $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            }
        }
        return $sMessage;
    }

}

?>
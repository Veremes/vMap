<?php

require_once 'Vmap.class.inc';
require_once 'BusinessObject.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Layer.class.inc
 * \class Layer
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Layer php class
 *
 * This class defines operation for one Layer
 * 
 */
class Layer extends Vmap {

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
    }

    /**
     * @SWG\Get(path="/layers/{layer_id}", 
     *   tags={"Layers"},
     *   summary="Get Layer",
     *   description="Request to get Layer by id",
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
     *     name="layer_id",
     *     in="path",
     *     description="layer id",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layers")
     *     )
     *  )
     */

    /**
     * get informations about Layer
     */
    function GET() {

        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'v_layer', 'layer_id');

        // Ajoute (si il existe le formulaire associé au calque)
        $this->aFields['filter_form'] = $this->getFilterForm();
        $this->aFields['crs_list_label'] = str_replace('|', ',', $this->aFields['crs_list']);

        if (!empty($this->aFields['bo_id_list'])) {
            $aBoIds = explode('|', $this->aFields['bo_id_list']);
            $this->aFields['business_objects'] = $this->getBusinessObjectsInfos($aBoIds);
        }
    }

    /**
     * Return (is exists) the json form associate to the layer
     * @return string JSON form
     */
    function getFilterForm() {
        $filter_form = null;
        if ($this->aFields['is_filtered'] === true) {
            $formsPath = $this->aProperties['ws_data_dir'] . '/vmap/layer/' . $this->aFields['layer_id'] . '/forms';
            if (file_exists($formsPath . '/published.json')) {
                $filter_form = file_get_contents($formsPath . '/published.json');
            }
        }
        return $filter_form;
    }

    /**
     * Get the infos from the business objects defined in $aBoIds
     * @param array $aBoIds
     * @return array
     */
    function getBusinessObjectsInfos($aBoIds) {
        $aBoInfos = array();
        for ($i = 0; $i < count($aBoIds); $i++) {
            $aPath = array('vmap', 'businessobjects', $aBoIds[$i]);
            $aValues = $this->aValues;
            $aValues['my_vitis_id'] = $aBoIds[$i];
            $oBo = new BusinessObject($aPath, $aValues, $this->aProperties, $this->oConnection);
            $oBo->GET();
            array_push($aBoInfos, $oBo->aFields);
        }
        return $aBoInfos;
    }

    /**
     * delete a layer
     */
    function DELETE() {

        // Des-associe les objets métiers de la couche
        require $this->sRessourcesFile;
        $aSQLParams = array(
            'sSchemaVmap' => array('value' => $this->aProperties['schema_vmap'], 'type' => 'column_name'),
            'layer_id' => array('value' => $this->aValues['my_vitis_id'], 'type' => 'number')
        );
        $oResult = $this->oConnection->oBd->executeWithParams($aSql['deleteAssociatedBos'], $aSQLParams);

        // Supprime la couche en question
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'layer', 'layer_id', $this->aValues['my_vitis_id'], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
            $this->aFields['layer_id'] = $this->aValues['my_vitis_id'];
        }
    }

}

?>
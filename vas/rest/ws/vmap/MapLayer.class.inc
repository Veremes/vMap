<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file MapLayer.class.inc
 * \class MapLayer
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the MapLayer php class
 *
 * This class defines operation for one MapLayer
 * 
 */
class MapLayer extends Vmap {

    public $oError;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function MapLayer($aPath, $aValues, $properties, $oConnection) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
	$this->aSelectedFields = Array("layer_id", "name", "theme_name", "layer_visible", "map_id", "layer_opacity");
    }

    /**
     * get informations about MapLayer
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'v_map_layer', 'map_id');
    }

    /**
     * delete a map
     */
    function DELETE(){
        /*
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'v_map_layer', 'map_id', $this->aValues['my_vitis_id'], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new Error(1, $this->oConnection->oBd->getBDMessage());
        } else {
                $this->aFields[map_id] = $this->aValues['my_vitis_id'];
        }
        */
    }
}

?>
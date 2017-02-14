<?php
/**
* \file Maps.class.inc
* \class Maps
*
* \author Armand Bahi <armand.bahi@veremes.com>.
*
* \brief This file contains the Maps php class
*
* This class defines Rest Api to Vmap Maps
* 
*/
require_once 'Vmap.class.inc';
require_once 'MapCatalog.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class MapCatalogs extends Vmap {
    
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function MapCatalogs($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
    }
    /**
     * get Maps
     * @return  Maps
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'v_map', 'map_id');        
        return $aReturn['sMessage'];
    }
}
?>
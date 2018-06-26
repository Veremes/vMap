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
require_once 'MapJSON.class.inc';
require_once 'BusinessObject.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class MapJSONs extends Vmap {
    
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
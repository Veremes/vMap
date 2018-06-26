<?php

require_once 'Vmap.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';

/**
* \file Format.class.inc
* \class Format
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the Format php class
*
* This class defines operation for one Format
* 
*/
class Format extends Vmap {
    
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
        $this->aSelectedFields = Array('rt_format_id');
    }
    
    /**
     * get informations about format
     */
    function GET(){
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], "rt_format", "rt_format_id");
    }
}
?>
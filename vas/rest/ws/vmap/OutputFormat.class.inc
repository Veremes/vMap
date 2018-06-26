<?php

require_once 'Vmap.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';

/**
* \file OutputFormat.class.inc
* \class OutputFormat
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the OutputFormat php class
*
* This class defines operation for one OutputFormat
* 
*/
class OutputFormat extends Vmap {
    
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
        $this->aSelectedFields = Array('outputformats_id');
    }
    
    /**
     * get inoutputformations about outputformat
     */
    function GET(){
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], "rt_outputformats", "outputformats_id");
    }
}
?>
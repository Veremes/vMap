<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Query.class.inc
 * \class Query
 *
 * \author Yoann Perollet <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the Query php class
 *
 * This class defines operation for one Query
 * 
 */
class Query extends Vmap {

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
        $this->aSelectedFields = Array();
    }

    /**
     * get informations about query
     */
    function GET() {

    }

}

?>
<?php

require_once 'Vitis.class.inc';

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
class GenericQuery extends Vitis {

    public $oError;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function GenericQuery($aPath, $aValues, $properties, $oConnection) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->aSelectedFields = Array();
        $this->oConnection = $oConnection;
    }

    /**
     * get informations about query
     */
    function GET() {

    }

}

?>
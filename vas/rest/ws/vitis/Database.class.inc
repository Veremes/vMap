<?php

require_once 'Vitis.class.inc';
/**
* \file Action.class.inc
* \class Action
*
* \author Benoit Picavet
*
*	\brief This file contains the Action php class
*
* This class defines operation for one Action
* 
*/
class Database extends Vitis{
    
    public $oError;
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function __construct ($aDatabase){
        $this->aFields = $aDatabase;
        
    }
    
    
    
}
?>
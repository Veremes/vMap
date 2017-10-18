<?php

require_once 'Vitis.class.inc';
/**
* \file Action.class.inc
* \class Action
*
* \author Armand Bahi
*
*	\brief This file contains the Action php class
*
* This class defines operation for one Action
* 
*/
class Schema extends Vitis{
    
    public $oError;
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function __construct ($aSchema){
        $this->aFields = $aSchema;
        
    }
    
    
    
}
?>
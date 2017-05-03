<?php

require_once 'Vitis.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
/**
* \file Action.class.inc
* \class Action
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the Action php class
*
* This class defines operation for one Action
* 
*/
class Action extends Vitis{
    
    public $oError;
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function __construct ($aAction){
        $this->aFields = $aAction;
        
    }
    
    
    
}
?>
<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Proprietaire.class.inc
 * \class Proprietaire
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Proprietaire php class
 *
 * This class defines operation for one Proprietaire
 * 
 */
class Proprietaire extends Cadastre {

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $bShortcut false to reinit variables
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        //parent::__construct($aPath, $aValues, $properties, $bShortcut, $oConnection);
    }

}

?>
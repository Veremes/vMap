<?php

require_once __DIR__ . "/../../class/vitis_lib/DbClass.class.inc";
require_once __DIR__ . '/../vmap/Vmap.class.inc';

class Vmap4MapServer extends Vmap {

    //Chemin du fichier de ressources contenant les requêtes SQL
    var $sRessourcesFile = 'ws/vm4ms/Vmap4MapServer.class.sql.inc';

    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        parent::__construct($aPath, $aValues, $properties, $bShortcut, $oConnection);
    }

}

?>
<?php

require_once __DIR__ . "/../../class/vitis_lib/DbClass.class.inc";
require_once __DIR__ . '/../vmap/Vmap.class.inc';

class Cadastre extends Vmap {

    //Chemin du fichier de ressources contenant les requêtes SQL
    var $sRessourcesFile = 'Vitis.class.sql.inc';

    /**
     * Return true if the user have raghts on the "commune" else return false
     * @param string $id_com
     * @return boolean
     */
    function haveCommuneRights($id_com) {
        // Vérifie si on a les droits sur la commune
        $aFilter = array(
            'column' => 'id_com',
            'compare_operator' => '=',
            'value' => $id_com
        );
        $aCommunes = $this->vmapGet($this->aProperties['schema_cadastre'], $this->aProperties['cadastre']['views']['commune'], array('id_com'), $aFilter, array('limit' => 1));
        if (sizeOf($aCommunes) > 0)
            return true;
        else
            return false;
    }

}

?>
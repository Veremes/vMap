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
        $aCommunes = $this->vmapGet($this->aProperties['schema_cadastre'], 'v_vmap_commune', array('id_com'), "id_com='" . $id_com . "'", 'limit 1', 'vmap_cadastre_user', 'vmap_cadastre_user');        
        if (sizeOf($aCommunes) > 0)
            return true;
        else
            return false;
    }    

}

?>
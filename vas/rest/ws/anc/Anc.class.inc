<?php

require_once __DIR__ . "/../../class/vitis_lib/DbClass.class.inc";
require_once __DIR__ . '/../vitis/Vitis.class.inc';
require_once 'vmlib/logUtil.inc';

class Anc extends Vitis {

    //Chemin du fichier de ressources contenant les requêtes SQL
    var $sRessourcesFile = 'ws/anc/Anc.class.sql.inc';
    
    /**
     * Upload un document dans le ws_data du module Anc.
     * @param type $sIndex
     * @param type $sFolder
     */
    function uploadDocument($sIndex, $sFolder) {
        // Crée le répertoire si inexistant.
        $sDirPath = $this->aProperties['ws_data_dir'] . '/anc/' . $sFolder . '/documents/' . $this->aValues["my_vitis_id"] . '/' . $sIndex . '/';
        if (!is_dir($sDirPath))
            mkdir($sDirPath, 0777, true);
        // Ecrit le fichier.
        if (!empty($_FILES[$sIndex])) {
            $sErrorMessage = uploadFile($sIndex, "", $sDirPath . $_FILES[$sIndex]["name"], $_FILES[$sIndex]['size'] + 1);
            if ($sErrorMessage != "")
                writeToErrorLog($sErrorMessage);
        }
        else {
            $sfileContentIndex = $sIndex . '_file';
            $sfileNameIndex = $sIndex . '_name';
            if (!empty($this->aValues[$sfileContentIndex])) {

                $this->aValues[$sIndex] = $this->aValues[$sfileNameIndex];
                $fp = fopen($sDirPath . $this->aValues[$sfileNameIndex], "w");
                fwrite($fp, $this->aValues[$sfileContentIndex]);
                fclose($fp);
            }
        }
    }
}
?>
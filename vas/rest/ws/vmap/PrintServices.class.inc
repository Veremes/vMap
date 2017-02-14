<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../vitis/Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

/**
 * \file printservices.class.inc
 * \class PrintServices
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 *  \brief This file contains the PrintServices php class
 * 
 */
class PrintServices extends Vmap {

    /**
     * Write a param into a file
     * @param string $sPath
     * @param string $sFileName
     * @param string $sParam
     * @return string
     */
    function writeToFile($sPath, $sFileName, $sParam) {
        $sFile = $sPath . '/' . $sFileName . '.txt';
        file_put_contents($sFile, $sParam);
        array_push($this->aFilesToDelete, $sFile);
        return $sFile;
    }

    function rrmdir($dir) {
        if (is_dir($dir)) {
            $objects = scandir($dir);
            foreach ($objects as $object) {
                if ($object != "." && $object != "..") {
                    if (is_dir($dir . "/" . $object))
                        $this->rrmdir($dir . "/" . $object);
                    else
                        unlink($dir . "/" . $object);
                }
            }
            rmdir($dir);
        }
    }

    /**
     * Supprime les fichiers passés en argument
     * @param array $aFilesToDelete
     */
    function deleteFiles($aFilesToDelete) {
        for ($i = 0; $i < count($aFilesToDelete); $i++) {
            if (is_dir($aFilesToDelete[$i])) {
//                array_map('unlink', glob("$aFilesToDelete[$i]/*.*"));
                $this->rrmdir($aFilesToDelete[$i]);
            }
            if (is_file($aFilesToDelete[$i])) {
                unlink($aFilesToDelete[$i]);
            }
        }
    }

}

?>
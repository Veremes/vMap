<?php

require_once __DIR__ . "/../../class/vitis_lib/DbClass.class.inc";
require_once __DIR__ . '/../vitis/Vitis.class.inc';
require_once 'vmlib/logUtil.inc';

class Vmap extends Vitis {

    //Chemin du fichier de ressources contenant les requêtes SQL
    var $sRessourcesFile = "ws/vmap/Vmap.class.sql.inc";

    /**
     * 
     * @param string $sSchema
     * @param string $sTable
     * @param string $aAttributs
     * @param string $sFilter
     */
    function vmapGet($sSchema, $sTable, $aAttributs, $sFilter, $sOptions = "") {

        if ($this->oConnection->oError != null) {
            $oError = $this->oConnection->oError;
            return 0;
        }

        if (strlen($sSchema) == 0) {
            $oError = 'vmapGet: $sSchema not defined';
            writeToErrorLog('error: ' . $oError);
            return 0;
        }

        if (strlen($sTable) == 0) {
            $oError = 'vmapGet: $sTable not defined';
            writeToErrorLog('error: ' . $oError);
            return 0;
        }

        if (sizeof($aAttributs) == 0) {
            $oError = 'vmapGet: $aAttributs not defined';
            writeToErrorLog('error: ' . $oError);
            return 0;
        }

        // Set the attributs string
        if ($aAttributs[0] == "") {
            $sAttributs = "*";
        } else {
            if (strpos($aAttributs[0], "(") == FALSE && strpos($aAttributs[0], ")") == FALSE && strpos(strtolower($aAttributs[0]), " as ") == FALSE) {
               $sAttributs = "\"" . $aAttributs[0] . "\"";
            } else {
                 $sAttributs = $aAttributs[0];
                
            }
            for ($i = 1; $i < sizeof($aAttributs); $i++) {
                if (strpos($aAttributs[$i], "(") == FALSE && strpos($aAttributs[$i], ")") == FALSE && strpos(strtolower($aAttributs[$i]), " as ") == FALSE) {
                  $sAttributs .= ", \"" . $aAttributs[$i] . "\"";
                } else {
                      $sAttributs .= ", " . $aAttributs[$i] . "";
                    
                }
            }
        }

        // Filter not defined
        if (strlen($sFilter) == 0) {
            $sSql = "SELECT " . $sAttributs . " FROM " . $sSchema . "." . $sTable . " " . $sOptions;
        } else {
            $sSql = "SELECT " . $sAttributs . " FROM " . $sSchema . "." . $sTable . " WHERE " . $sFilter . " " . $sOptions;
        }
        $oResult = $this->oConnection->oBd->execute($sSql);
        if (gettype($oResult) == 'object') {
            $aRecords = Array();
            while ($aLigne = $this->oConnection->oBd->ligneSuivante($oResult)) {
                array_push($aRecords, $aLigne);
            }
        }

        return $aRecords;
    }

    function vmapIntersectGet($sSchema, $sTable, $geom, $aAttributs) {

        array_push($aAttributs, "round(st_area(st_intersection(st_geomfromtext('" . $geom . "',st_srid(geom)), geom))/st_area(st_geomfromtext('" . $geom . "',st_srid(geom))) * 100) || '%' as intersect");

        $sFilter = "st_intersects(st_geomfromtext('" . $geom . "',st_srid(geom)), geom)";

        $aRecords = $this->vmapGet($sSchema, $sTable, $aAttributs, $sFilter);

        return $aRecords;
    }
    
    
    

}

?>
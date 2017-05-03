<?php

require_once ("dbUtil.inc");
require_once ("Vm.class.inc");
require_once ("logUtil.inc");

class PostgisUtil {
    /*
     * Variable globale stockant le nom de dossier lib.
     */

    var $sFolderLib = "vmlib";
    var $oBd;
    var $lang;

    function __construct($oConnection, $lang = "fr") {
        $this->lang = $lang;
        loadLang($this->sFolderLib, $this->lang);
        $this->oBd = $oConnection;
    }

    // construit un buffer de $sSize m de rayon
    function getBuffer($sWkt, $sSize) {
        $sSql = "SELECT st_astext(public.st_buffer(st_geomfromtext('sWkt'),sSize)) as geombuffer";
        $sSql = str_replace('sWkt', $sWkt, $sSql);
        $sSql = str_replace('sSize', $sSize, $sSql);

        $oResultat = $this->oBd->execute($sSql);
        if (!$this->oBd->erreurRencontree) {
            $oGeomBuffer = $this->oBd->objetSuivant($oResultat);
            $sGeomBuffer = $oGeomBuffer->geombuffer;
            $oResultat = $this->oBd->fermeResultat();
        } else {
            // traitement de l'erreur
            writeToErrorLog(ERROR_REQUEST_IMPOSSIBLE . $sSql);
            $oResultat = $this->oBd->fermeResultat();
        }
        return $sGeomBuffer;
    }

    // calcule la distance entre deux points.
    function getDistance($sWkt, $sWkt2) {
        $sSql = "SELECT st_distance('debut','fin') as distance";
        $sSql = str_replace('debut', $sWkt, $sSql);
        $sSql = str_replace('fin', $sWkt2, $sSql);
        $oResultat = $this->oBd->execute($sSql);
        if (!$this->oBd->erreurRencontree) {
            $oDistance = $this->oBd->objetSuivant($oResultat);
            $sDistance = $oDistance->distance;
            $oResultat = $this->oBd->fermeResultat();
        } else {
            // traitement de l'erreur
            writeToErrorLog(ERROR_REQUEST_IMPOSSIBLE . $sSql);
            $oResultat = $this->oBd->fermeResultat();
        }
        return $sDistance;
    }

}

?>
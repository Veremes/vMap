<?php

require_once (__DIR__ . "/XmlAbstract.class.inc");
require_once(__DIR__ . "/../vmlib/Vm.class.inc");
require_once(__DIR__ . "/../vmlib/dbUtil.inc");
require_once(__DIR__ . "/../vmlib/logUtil.inc");
require_once(__DIR__ . "/../vmlib/error.inc");

class DbClass extends XmlAbstract {

    //Champ clé de la table
    var $sPkField;
    //Valeur du champ clé de la table
    var $iPkValue;
    // Tableau de Properties
    var $aProperties;
    var $sTable;
    //Chemin du fichier de ressources contenant les requêtes SQL
    var $sRessourcesFile;
    //Séquence utilisé pour l'obtention d'un nouvel identifiant
    var $sSequence = "s_gtf.seq_order";
    //Variable stockant les messages d'erreur des requêtes
    var $sMessage;
    // Connexion à la base de données
    var $oBd;
    // est vrai si l'objet correspondant n'existe pas dans la base ou en cas d'erreur d'initialisation
    var $bEnErreur;
    // code d'erreur. different de 0 si bEnErreur=True
    var $iErrorCode = 0;

    function setFields($aValues) {
        foreach ($aValues as $sCle => $sValeur) {
            $this->aFields[$sCle] = $sValeur;
        }
    }

    /*
     * Méthode de classe : Insert
     * Cette méthode permet d'insérer un nouvel enregistrement dans la table du shéma passé en pararmètre
     */

    function insert() {
        $iId = $this->oBd->insert($this->aProperties['schema_gtf'], $this->sTable, $this->aFields, $this->sSequence, $this->sPkField, $bGetSql = false);
        if ($iId != "") {
            writeToDebugLog("La demande " . $iId . " a bien été insérée dans la base.");
            $this->sMessage = "La demande " . $iId . " a bien été insérée dans la base.";
            return $iId;
        } else {
            writeToErrorLog(ERROR_0002 . $this->oBd->getBDMessage());
            $this->sMessage = "La création de la demande a échouée.";
            return -1;
        }
    }

    /*
     * Méthode de classe : Update
     * Cette méthode permet de mettre à jour un enregistrement dans la table du shéma passé en pararmètre
     */

    function update() {
        if (!$this->oBd->update($this->aProperties['schema_gtf'], $this->sTable, $this->aFields, $this->sPkField, $this->iPkValue, $sIdType = "")) {
            writeToDebugLog("La demande " . $this->iPkValue . " a bien été mise à jour dans la base.");
            $this->sMessage = "La demande " . $this->iPkValue . " a bien été mise à jour dans la base.";
            //Rajouté par Laurent
            return $this->aFields["order_id"];
        } else {
            writeToErrorLog(str_replace('[order_id]', $this->iPkValue, ERROR_0003) . $this->oBd->getBDMessage());
            $this->sMessage = "La mise à jour de la demande " . $this->iPkValue . " a échouée. -- " . $this->oBd->getBDMessage();
            //Rajouté par Laurent
            return -1;
        }
        return $this->sMessage;
    }

    /*
     * Méthode de classe : Delete
     * Cette méthode permet de supprimer un enregistrement dans la table du shéma passé en pararmètre
     */

    function delete() {
        if ($iDemandeId == "")
            $iDemandeId = $this->iPkValue;

        if (!$this->oBd->delete($this->aProperties['schema_gtf'], $this->sTable, $this->sPkField, $iDemandeId, $sIdType = "")) {
            writeToDebugLog("La demande " . $iDemandeId . " a bien été supprimée de la base.");
            $this->sMessage = "La demande " . $iDemandeId . " a bien été supprimée de la base.";
            return $iDemandeId;
        } else {
            writeToErrorLog(str_replace('[order_id]', $iDemandeId, ERROR_0004) . $this->oBd->getBDMessage());
            $this->sMessage = "La demande " . $iDemandeId . " n'a pas pu être supprimée de la base.";
            return -1;
        }
    }

    function setPkValue($iId) {
        $this->iPkValue = $iId;
    }

    /*
     * Méthode de classe : getSourceEncoding
     * Cette méthode permet de retourner l'encodage de la base de données
     */

    function getSourceEncoding() {
        return $this->oBd->getSourceEncoding();
    }
    
    function isPostGISInstalled(){
        
//        // Version 1
//        $sSql = "SELECT PostGIS_version()";
//        
//        $oResult = $this->oConnection->oBd->execute($sSql);
//        if (!$this->oConnection->oBd->enErreur() && $this->oConnection->oBd->nombreLigne($oResult) > 0) {
//            return true;
//        }else{
//            return false;
//        }
        // Version 2
        $isPostGISInstalled = false;
        $sSql = "select name from pg_available_extensions where installed_version != ''";
        $oResult = $this->oConnection->oBd->execute($sSql);
        if (!$this->oConnection->oBd->enErreur() && $this->oConnection->oBd->nombreLigne($oResult) > 0) {
            while ($aLigne = $this->oConnection->oBd->ligneSuivante($oResult)) {
                if($aLigne['name'] === 'postgis'){
                    $isPostGISInstalled = true;
                }
            }
        }        
        return $isPostGISInstalled;
    }
    
    /**
     * Return the geom columns infos from a table
     * @param string $sSchema
     * @param string $sTable
     * @return array
     */
    function getTableGeomColumnsInfos($sSchema, $sTable) {
        
        if(!$this->isPostGISInstalled()){
            return array();
        }

        $aGeomColumnsInfos = array();
        $sSql = "SELECT f_geometry_column, coord_dimension, srid, type from geometry_columns WHERE f_table_schema='" . $sSchema . "' AND f_table_name='" . $sTable . "'";

        $oResult = $this->oConnection->oBd->execute($sSql);
        if (!$this->oConnection->oBd->enErreur() && $this->oConnection->oBd->nombreLigne($oResult) > 0) {
            while ($aObject = $this->oConnection->oBd->ligneSuivante($oResult)) {
                array_push($aGeomColumnsInfos, $aObject);
            }
        }
        return $aGeomColumnsInfos;
    }
}

?>
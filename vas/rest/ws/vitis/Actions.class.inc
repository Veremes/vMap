<?php

require_once 'Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Actions.class.inc
 * \class Actions
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the Actions php class
 *
 * This class defines operation for one Column
 * 
 */
class Actions extends Vitis {

    public $oError;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function Actions($aPath, $aValues, $properties, $oConnection) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
        $this->aSelectedFields = Array("table_name", "index", "application_name", "module_name");
    }

    /**
     * get informations about table columns
     */
    function GET() {
        require $this->sRessourcesFile;
        require_once "Action.class.inc";
        $aFields = null;
        // 
        if (empty($this->aValues['language']))
            $this->aValues['language'] = 'en';
        //
        $sSql = str_replace('[sSchemaFramework]', $this->aProperties['schema_framework'], $aSql['getTableActions']);
        $sSql = str_replace('[sRessource]', $this->aValues['ressource_id'], $sSql);
        $sSql = str_replace('[module]', $this->aValues['module'], $sSql);
        $sSql = str_replace('[language]', $this->aProperties['language'], $sSql);
        $oPDOresult = $this->oConnection->oBd->execute($sSql);
        if ($this->oConnection->oBd->enErreur()) {
            $oError = new Error(1, $this->oConnection->oBd->getBDMessage());
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            while ($aAction = $this->oConnection->oBd->ligneSuivante($oPDOresult))
                array_push($this->aObjects, new Action($aAction));
        }
        return $aFields;
    }

}

?>
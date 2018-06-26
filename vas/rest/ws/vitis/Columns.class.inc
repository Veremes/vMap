<?php

require_once 'Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Columns.class.inc
 * \class Columns
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the Columns php class
 *
 * This class defines operation for one Column
 * 
 */
class Columns extends Vitis {

    public $oError;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $bShortcut false to reinit variables
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        parent::__construct($aPath, $aValues, $properties, $bShortcut, $oConnection);
        $this->aSelectedFields = Array("table_name", "index", "application_name", "module_name");
    }

    /**
     * get informations about table columns
     */
    function GET() {
        require $this->sRessourcesFile;
        require_once "Column.class.inc";
        $aFields = null;
        //
        $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
        $aParams['sRessource'] = array('value' => $this->aValues['ressource_id'], 'type' => 'string');
        $aParams['language'] = array('value' => $this->aProperties['language'], 'type' => 'string');
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getTableColumns'], $aParams);
        if ($this->oConnection->oBd->enErreur()) {
            $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            while ($aColumn = $this->oConnection->oBd->ligneSuivante($oPDOresult))
                array_push($this->aObjects, new Column($aColumn));
        }
        return $aFields;
    }

}

?>
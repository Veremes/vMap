<?php

/**
 * \class Form
 * \brief Form Class
 * 
 * Class about form operations
 *
 * \author Armand Bahi <armand.bahi@veremes.com>
 */
class Form {

    /**
     * construct
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function __construct($properties, $oConnection) {
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
    }

    /**
     * Get the table columns description array
     * @param string $sSchema
     * @param string $sTable
     * @return array
     */
    function getTableColumns($sSchema, $sTable) {

        // Effectue une requête pour avoir les colonnes de la table        
        $sSql = "SELECT column_name, is_nullable, data_type, is_updatable ";
        $sSql .= "FROM information_schema.columns ";
        $sSql .= "WHERE table_schema = '" . $sSchema . "' AND table_name = '" . $sTable . "'";

        $aColumns = array();

        // Crée le formulaire
        $oResult = $this->oConnection->oBd->execute($sSql);
        if ($this->oConnection->oBd->enErreur()) {
            $aXmlRacineAttribute['status'] = 0;
            $oError = new VitisError(2, $this->oConnection->oBd->getBDMessage());
        } else {
            if (!$this->oConnection->oBd->enErreur()) {
                while ($aLigne = $this->oConnection->oBd->ligneSuivante($oResult)) {
                    array_push($aColumns, $aLigne);
                }
            }
        }
        return $aColumns;
    }

    /**
     * Generate the form rows by the table columns description array
     * @param type $aColumns
     * @param type $aUnusedColumnNames names of the columns witch you dont want to use
     * @param type $aUnupdatableColumnNames names of the columns witch you dont want to bu updatable
     * @return array
     */
    function generateRowsByTableColumns($aColumns, $aUnusedColumnNames = array(), $aUnupdatableColumnNames = array(), $aLabel = array()) {

        $aRows = array();
        $aTypes = array();
        $aTypes["character varying"] = "text";
        $aTypes["integer"] = "integer";

        foreach ($aColumns as $aLigne) {

            // Re-crée la ligne
            $aField = array();
            $aField['fields'] = array();
            $aField['fields'][0] = array();

            if (in_array($aLigne['column_name'], $aUnupdatableColumnNames)) {

                $aField['fields'][0]['type'] = "label";
            } else if (in_array($aLigne['column_name'], $aUnusedColumnNames)) {

                continue;
            } else if (isset($aTypes[$aLigne['data_type']])) {

                $aField['fields'][0]['type'] = $aTypes[$aLigne['data_type']];
            } else if ($aLigne['data_type'] === "tinyint" || $aLigne['data_type'] === "bigint" || $aLigne['data_type'] === "smallint" || $aLigne['data_type'] === "numeric") {

                $aField['fields'][0]['type'] = "text";
                $aField['fields'][0]['pattern'] = "[-+]?(\d*[.])?\d+";
            } else if ($aLigne['data_type'] === "boolean") {

                $aField['fields'][0]['type'] = "radio";
                $aField['fields'][0]['options'] = array();
                $aField['fields'][0]['options']['choices'] = array();
                $aField['fields'][0]['options']['choices'][0]['label'] = "oui";
                $aField['fields'][0]['options']['choices'][0]['value'] = true;
                $aField['fields'][0]['options']['choices'][1]['label'] = "non";
                $aField['fields'][0]['options']['choices'][1]['value'] = false;
            } else {

                $aField['fields'][0]['type'] = "text";
            }

            $aField['fields'][0]['name'] = $aLigne['column_name'];
            if (array_key_exists($aLigne['column_name'], $aLabel)) {
                $aField['fields'][0]['label'] = $aLabel[$aLigne['column_name']];
            } else {
                $aField['fields'][0]['label'] = $aLigne['column_name'];
            }
            
            $aField['fields'][0]['disabled'] = !$aLigne['is_updatable'];
            $aField['fields'][0]['required'] = !$aLigne['is_nullable'];
            $aField['fields'][0]['nb_cols'] = 12;

            array_push($aRows, $aField);
        }

        return $aRows;
    }

    /**
     * Generate the Form
     * @param string $aRows
     * @param string $sFormName
     * @param string $sFormTitle
     * @return array
     */
    function generateFormByRows($aRows, $sFormTitle = "Generated Form", $sFormName = "generated") {

        // Crée les modes diplay/update/insert
        $aForm = array();
        $aForm['display'] = array();
        $aForm['display']['name'] = $sFormName . '-form';
        $aForm['display']['title'] = $sFormTitle;
        $aForm['display']['input_size'] = "xxs";
        $aForm['display']['nb_cols'] = 12;
        $aForm['display']['javascript'] = false;
        $aForm['display']['rows'] = $aRows;
        $aForm['search'] = $aForm['display'];
        $aForm['search']['rows'] = [];
        $aForm['insert'] = $aForm['display'];
        $aForm['update'] = $aForm['display'];

        // Met les champs du mode insert en mode label
        for ($index = 0; $index < count($aForm['display']['rows']); $index++) {
            $aForm['display']['rows'][$index]['fields'][0]['type'] = 'label';
        }

        return $aForm;
    }

}

?>
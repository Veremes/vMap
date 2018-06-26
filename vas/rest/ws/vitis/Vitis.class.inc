<?php

require_once(__DIR__ . "/../../class/vitis_lib/DbClass.class.inc");

/**
 * \file vitis.class.inc
 * \class Vitis
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the vitis php class
 *
 * This class defines generics parameters and functions accessible by vitis php classes
 *
 */
class Vitis extends DbClass {

    /**
     * file containing sql request for vitis classes
     */
    var $sRessourcesFile = "Vitis.class.sql.inc";

    /**
     * parameters sent to rest api
     */
    public $aValues = array();

    /**
     * url sent to rest api
     */
    public $aPath = array();

    /**
     * vitis properties
     */
    public $aProperties = array();

    /**
     * result array of the object
     */
    public $aFields = array();

    /**
     * Connection object(connect to the database, get user groups and privileges)
     */
    public $oConnection;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $bShortcut false to reinit variables
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        if ($bShortcut !== true) {
            $this->aValues = $aValues;
            $this->aPath = $aPath;
            $this->aProperties = $properties;
            if (empty($oConnection)) {
                $this->oConnection = new Connection($this->aValues, $this->aProperties);
            } else {
                $this->oConnection = $oConnection;
            }
        }
    }

    /**
     * accessible data of the object
     */
    public $aSelectedFields = Array();
    public $aOrganizedFields = Array();
    public $aTablePrivileges = Array();

    /**
     * Generic function which get fields of the object stored in the database
     * @param type $sSchema
     * @param type $sTable
     * @param type $sIdField
     *
     */
    function getFields($sSchema, $sTable, $sIdField) {

        $this->aSqlParams = array();

        //generate the structure of the result
        $this->addSelectedFields();

        // Format $this->aSelectedFields for spatial use
        $this->formatSelectedFieldsForGeom($sSchema, $sTable);

        //get the fields present in the database
        $aColumn = $this->getTableColumns($sSchema, $sTable);

        $aData = null;

        //intersect the structure and the fields in the database to get only fields present in the database and the structure
        if (empty($this->aSelectedFields)) {
            $aFieldInTable = $aColumn;
        } else {
            $aFieldInTable = array_intersect($aColumn, $this->aSelectedFields);
        }
        //build request
        if (!empty($aFieldInTable)) {
            if (!in_array($sIdField, $aFieldInTable)) {
                array_push($aFieldInTable, $sIdField);
            }
            $sSql = "SELECT ";
            // les field ne sont pas passés en tant que paramètre column_name car des fois ils ont pour valeur des fonctions ex: "ST_SRID(geom) as proj"
            foreach ($aFieldInTable as $field) {
                if (strpos($field, "(") == FALSE && strpos($field, ")") == FALSE && strpos(strtolower($field), " as ") == FALSE) {
                    $field = "\"" . $field . "\"";
                }
                if ($sSql == "SELECT ") {
                    $sSql .= $field;
                } else {
                    $sSql .= ", " . $field;
                }
            }

            $this->aSqlParams['sSchema'] = array('value' => $sSchema, 'type' => 'column_name');
            $this->aSqlParams['sTable'] = array('value' => $sTable, 'type' => 'column_name');
            $this->aSqlParams['sIdField'] = array('value' => $sIdField, 'type' => 'column_name');
            $this->aSqlParams['my_vitis_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'string');

            $sSql .= " FROM \"[sSchema]\".\"[sTable]\" WHERE \"[sIdField]\" IN ([my_vitis_id])";

            //Get result
            $oResult = $this->oConnection->oBd->executeWithParams($sSql, $this->aSqlParams);
            if (empty($this->oConnection->oBd->enErreur) && $this->oConnection->oBd->nombreLigne($oResult) > 0) {
                $aData = array();
                while ($aObject = $this->oConnection->oBd->ligneSuivante($oResult)) {
                    foreach ($aObject as $sParamKey => $sParamValue) {

                        $aData[$sParamKey] = $sParamValue;
                    }
                }
            }
        }
        return $aData;
    }

    /**
     * Get the columns of the table
     * @param type $sSchema
     * @param type $sTable
     * @return array
     */
    function getTableColumns($sSchema, $sTable) {
        require $this->sRessourcesFile;
        $aColumn = Array();
        $sSql = $aSql['getTableColumn'];
        $aSqlParams = array(
            'sSchemaFramework' => array('value' => $sSchema, 'type' => 'column_name'),
            'sTable' => array('value' => $sTable, 'type' => 'column_name')
        );

        $oResult = $this->oConnection->oBd->executeWithParams($sSql, $aSqlParams);

        if (!empty($oResult)) {
            while ($aObject = $this->oConnection->oBd->ligneSuivante($oResult)) {
                array_push($aColumn, $aObject['column_name']);
            }
            foreach ($this->aSelectedFields as $fields) {
                if (strpos($fields, "(") != FALSE && strpos($fields, ")") != FALSE && strpos(strtolower($fields), " as ") != FALSE) {
                    array_push($aColumn, $fields);
                }
            }
        }
        return $aColumn;
    }

    /**
     * Get the geometry columns of the table
     * @param string $sSchema
     * @param string $sTable
     * @return array
     */
    function getGeometryColumns($sSchema, $sTable) {
        require $this->sRessourcesFile;
        $aColumn = Array();
        $sSql = $aSql['getGeometryColumns'];

        $aSqlParams = array(
            'sSchemaFramework' => array('value' => $sSchema, 'type' => 'column_name'),
            'sTable' => array('value' => $sTable, 'type' => 'column_name')
        );

        $oResult = $this->oConnection->oBd->executeWithParams($sSql, $aSqlParams);

        // vide si postGis n'est pas installé
        if (!empty($oResult)) {
            while ($aObject = $this->oConnection->oBd->ligneSuivante($oResult)) {
                array_push($aColumn, $aObject['f_geometry_column']);
            }
        }

        return $aColumn;
    }

    // fonction get générique à tous les objets
    /**
     * Generic function which get data of the objects in tables
     * @param $sSchema schema of the table
     * @param $sTable table name
     * @param $sIdField name of the id field
     * @param $bOnlyReturnStatus
     * @param $sVitisObjectName Name of the vitis object, if provide and the object contains files stored in ws_data/vitis/$sVitisObjectName the values will be url formed
     * @return the array of objects
     */
    function genericGet($sSchema, $sTable, $sIdField, $bOnlyReturnStatus = false, $sVitisObjectName = "") {
        if (!empty($this->aProperties['ws_data_alias']))
            $ws_data_alias = $this->aProperties['ws_data_alias'];
        else
            $ws_data_alias = '';
        $sParentClassName = get_class($this);
        $sChildClassName = substr($sParentClassName, 0, -1);
        //$oObject = new $sChildClassName($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
        $date = new DateTime();
        $this->aSqlParams = array();
        $this->aSqlParams['sSchema'] = array('value' => $sSchema, 'type' => 'column_name');
        $this->aSqlParams['sTable'] = array('value' => $sTable, 'type' => 'column_name');
        if (isset($this->aValues['sEncoding']))
            $sEncoding = $this->aValues['sEncoding'];
        else
            $sEncoding = null;
        if (isset($this->aValues['sSourceEncoding']))
            $sSourceEncoding = $this->aValues['sSourceEncoding'];
        else
            $sSourceEncoding = null;
        if (isset($this->aValues['output']))
            $output = $this->aValues['output'];
        else
            $output = null;
        //Verify connection
        if ($this->oConnection->oError != null) {
            $oError = $this->oConnection->oError;
        } else {
            $this->getTablePrivileges($sSchema, $sTable);
            //$aPrivileges = array_intersect($this->oConnection->aPrivileges, $this->aTablePrivileges) ;
            if (in_array('SELECT', $this->aTablePrivileges)) {
                //verify if id is present in the url
                if (isset($this->aValues['my_vitis_id'])) {

                    //object instantiation
                    $oObject = new $sChildClassName($this->aPath, $this->aValues, $this->aProperties, false, $this->oConnection);
                    $oObject->GET();

                    // Vérifie si il y a des fichiers à renvoyer
                    if ($sVitisObjectName != "") {
                        $sDataDir = $this->aProperties['ws_data_dir'] . '/vitis/' . $sVitisObjectName . '/documents/' . $oObject->aFields[$sIdField];
                        $sDataUrl = $this->aProperties['web_server_name'] . "/" . $ws_data_alias . "/vitis/" . $sVitisObjectName . "/documents/" . $oObject->aFields[$sIdField];
                        if (is_dir($sDataDir)) {
                            // Remplace le nom du fichier par son url
                            foreach ($oObject->aFields as $key => $value) {
                                if (is_dir($sDataDir . "/" . $key)) {
                                    $oObject->aFields[$key] = $sDataUrl . "/" . $key . "/" . $value . "?d=" . $date->getTimestamp();
                                }
                            }
                        }
                    }
                    array_push($this->aObjects, $oObject);
                    $oError = $oObject->oError;
                    //$sMessage = $this->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $output);
                } else {

                    //build request to get Ids
                    $sSql = "SELECT ";
                    if (!empty($this->aValues['distinct']) && $this->aValues['distinct'] == "true") {
                        $sSql .= "DISTINCT ";
                    }
                    // Format $this->aSelectedFields for spatial use
                    if (empty($this->aValues['result_srid']))
                        $this->aValues['result_srid'] = null;
                    //Fields
                    $this->addSelectedFields();
                    $this->formatSelectedFieldsForGeom($sSchema, $sTable, $this->aValues['result_srid']);
                    //get the fields present in the database
                    $aColumn = $this->getTableColumns($sSchema, $sTable);

                    //intersect the structure and the fields in the database to get only fields present in the database and the structure
                    $aFieldInTable = array();
                    if (empty($this->aSelectedFields)) {
                        foreach ($aColumn as $value) {
                            array_push($aFieldInTable, '"' . $value . '"');
                        }
                    } else {
                        foreach ($this->aOrganizedFields as $key => $value) {
                            if (in_array($key, $aColumn) || in_array($key . " as " . $value, $aColumn)) {
                                // Attention: Injections possible!
                                if (strpos($key, "(") == FALSE && strpos($key, ")") == FALSE) {
                                    if ($value == "") {
                                        array_push($aFieldInTable, '"' . $key . '"');
                                    } else {
                                        array_push($aFieldInTable, '"' . $key . '" as "' . $value . '"');
                                    }
                                } else {
                                    array_push($aFieldInTable, $key . ' as "' . $value . '"');
                                }
                            }
                        }
                    }
                    //build request
                    // les field ne sont pas passés en tant que paramètre column_name car des fois ils ont pour valeur des fonctions ex: "ST_SRID(geom) as proj"
                    if (!empty($aFieldInTable)) {
                        foreach ($aFieldInTable as $fields) {
                            if ($sSql == "SELECT " || $sSql == "SELECT DISTINCT ") {
                                $sSql .= $fields;
                            } else {
                                $sSql .= ", " . $fields;
                            }
                        }
                    }

                    // Filter
                    $sSql .= " FROM \"[sSchema]\".\"[sTable]\"";
                    if (!empty($this->aValues['filter'])) {
                        // filtre
                        $aDecodedFilter = $this->decodeJSONFilter($this->aValues['filter'], $sSchema, $sTable);
                        // Ajout dans la requête
                        $sSecuredFilter = $aDecodedFilter['request'];
                        // Ajout des paramètres
                        foreach ($aDecodedFilter['params'] as $key => $value) {
                            $this->aSqlParams[$key] = $value;
                        }

                        // Ajout du filtre dans la requête
                        if (!empty(trim($sSecuredFilter))) {
                            if (strpos($sSql, " WHERE ") == FALSE) {
                                $sSql .= " WHERE " . $sSecuredFilter;
                            } else {
                                $sSql .= " AND " . $sSecuredFilter;
                            }
                        }
                    }

                    //order by
                    if (!empty($this->aValues['order_by'])) {
                        $aOrder = explode("|", $this->aValues['order_by']);
                        foreach ($aOrder as $value) {
                            $sColumnKey = 'column_' . vitisUniqId();
                            if (strpos($sSql, "ORDER BY") == FALSE) {
                                $sSql .= " ORDER BY " . str_replace("=", " ", "[" . $sColumnKey . "]");
                            } else {
                                $sSql .= ", " . str_replace("=", " ", "[" . $sColumnKey . "]");
                            }
                            $this->aSqlParams[$sColumnKey] = array('value' => $value, 'type' => 'column_name');
                        }
                        if (!empty($this->aValues['sort_order'])) {
                            switch (strtoupper($this->aValues['sort_order'])) {
                                case 'ASC':
                                    $sSql .= " ASC";
                                    break;
                                case 'DESC':
                                    $sSql .= " DESC";
                                    break;
                                default:
                                    break;
                            }
                        }
                    }

                    //limit
                    if (!empty($this->aValues['limit'])) {
                        $sLimitKey = 'limit_' . vitisUniqId();
                        $sSql .= " LIMIT [" . $sLimitKey . "]";
                        $this->aSqlParams[$sLimitKey] = array('value' => $this->aValues['limit'], 'type' => 'number');
                    }
                    //offset
                    if (!empty($this->aValues['offset'])) {
                        $sOffsetKey = 'offset_' . vitisUniqId();
                        $sSql .= " OFFSET [" . $sOffsetKey . "]";
                        $this->aSqlParams[$sOffsetKey] = array('value' => $this->aValues['offset'], 'type' => 'number');
                    }

                    //get the result
                    $oResult = $this->oConnection->oBd->executeWithParams($sSql, $this->aSqlParams);

                    // if no error get the result
                    $this->aValues['my_vitis_id'] = "";
                    $aParams2 = array();
                    if (empty($this->oConnection->oBd->enErreur) && $this->oConnection->oBd->nombreLigne($oResult) > 0) {
                        while ($aLigne = $this->oConnection->oBd->ligneSuivante($oResult)) {
                            $oObject = new $sChildClassName($this->aPath, $this->aValues, $this->aProperties, true);
                            $oObject->aFields = $aLigne;
                            array_push($this->aObjects, $oObject);
                            // Vérifie si il y a des fichiers à renvoyer
                            if ($sVitisObjectName != "") {
                                $sDataDir = $this->aProperties['ws_data_dir'] . '/vitis/' . $sVitisObjectName . '/documents/' . $oObject->aFields[$sIdField];
                                $sDataUrl = $this->aProperties['web_server_name'] . "/" . $ws_data_alias . "/vitis/" . $sVitisObjectName . "/documents/" . $oObject->aFields[$sIdField];
                                if (is_dir($sDataDir)) {
                                    // Remplace le nom du fichier par son url
                                    foreach ($oObject->aFields as $key => $value) {
                                        if (is_dir($sDataDir . "/" . $key)) {
                                            $oObject->aFields[$key] = $sDataUrl . "/" . $key . "/" . $value . "?d=" . $date->getTimestamp();
                                        }
                                    }
                                }
                            }
                        }
                    }
                    $this->aFields['list_count'] = $this->oConnection->oBd->nombreLigne($oResult);
                    $sSql = "select count(*) as total_row_number FROM \"[sSchema]\".\"[sTable]\"";
                    $aParams2['sSchema'] = array('value' => $sSchema, 'type' => 'column_name');
                    $aParams2['sTable'] = array('value' => $sTable, 'type' => 'column_name');
                    if (!empty($this->aValues['filter'])) {
                        // filtre
                        $aDecodedFilter = $this->decodeJSONFilter($this->aValues['filter'], $sSchema, $sTable);
                        // Ajout dans la requête
                        $sSecuredFilter = $aDecodedFilter['request'];
                        // Ajout des paramètres
                        foreach ($aDecodedFilter['params'] as $key => $value) {
                            $aParams2[$key] = $value;
                        }

                        // Ajout à la requête
                        if (!empty(trim($sSecuredFilter))) {
                            if (strpos($sSql, " WHERE ") == FALSE) {
                                $sSql .= " WHERE " . $sSecuredFilter;
                            } else {
                                $sSql .= " AND " . $sSecuredFilter;
                            }
                        }
                    }

                    $oResult = $this->oConnection->oBd->executeWithParams($sSql, $aParams2);
                    $aLigne = $this->oConnection->oBd->ligneSuivante($oResult);
                    $this->aFields['total_row_number'] = $aLigne['total_row_number'];
                }
            } else {
                $oError = new VitisError(1, "Rights problem : you don't have right to list " . $sChildClassName);
            }
        }

        if (isset($oError)) {
            $aXmlRacineAttribute['status'] = 0;
            if (!$bOnlyReturnStatus)
                $sMessage = $oError->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $output);
        } else {
            $aXmlRacineAttribute['status'] = 1;
            if (!$bOnlyReturnStatus)
                $sMessage = $this->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $output);
        }
        if (!$bOnlyReturnStatus)
            $aReturn = array('sStatus' => $aXmlRacineAttribute['status'], "sMessage" => $sMessage);
        else
            $aReturn = array('sStatus' => $aXmlRacineAttribute['status']);

        return $aReturn;
    }

    /**
     * Define the structure of the object (fields returned)
     */
    function addSelectedFields() {
        foreach ($this->aSelectedFields as $value) {
            if (strpos($value, " as ") != false) {
                $aValue = explode(" as ", $value);
                $this->aOrganizedFields[$aValue[0]] = $aValue[1];
            } else {
                $this->aOrganizedFields[$value] = $value;
            }
        }
        if (!empty($this->aValues["attributs"])) {
            if (strpos($this->aValues["attributs"], "-") === 0) {
                $aAtttributs = explode("|", substr($this->aValues["attributs"], 1));
                foreach ($aAtttributs as $value) {
                    if (in_array($value, $this->aOrganizedFields)) {
                        unset($this->aOrganizedFields[array_search($value, $this->aOrganizedFields)]);
                    }
                }
            } else {
                if (strpos($this->aValues["attributs"], "+") === 0) {
                    $aAtttributs = explode("|", substr($this->aValues["attributs"], 1));
                } else {
                    $aAtttributs = explode("|", $this->aValues["attributs"]);
                }
                $oldSelectedFields = $this->aOrganizedFields;
                $this->aOrganizedFields = array();
                foreach ($aAtttributs as $value) {
                    if (in_array($value, $oldSelectedFields)) {
                        $this->aOrganizedFields[array_search($value, $oldSelectedFields)] = $value;
                    } elseif (isset($oldSelectedFields[$value])) {
                        $this->aOrganizedFields[$value] = $oldSelectedFields[$value];
                    }
                }
            }
        }
    }

    /**
     *
     * @param type $sSchema schema containing the table
     * @param type $sTable table to update
     * @param type $sSequence  used sequence to get the id
     * @param type $sIdField id field name
     * @param type $sPrivilegeParent privilege to do the insertion
     * @return array containing the status and the message
     */
    function genericPost($sSchema, $sTable, $sSequence, $sIdField) {
        if (isset($this->aValues['sEncoding']))
            $sEncoding = $this->aValues['sEncoding'];
        else
            $sEncoding = null;
        if (isset($this->aValues['sSourceEncoding']))
            $sSourceEncoding = $this->aValues['sSourceEncoding'];
        else
            $sSourceEncoding = null;
        //verify the connection
        if ($this->oConnection->oError != null) {
            $oError = $this->oConnection->oError;
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $this->aValues['output']);
        } else {
            // verify if the user is framework_admin
            $this->getTablePrivileges($sSchema, $sTable);
            //$aPrivileges = array_intersect($this->oConnection->aPrivileges, $this->aTablePrivileges) ;
            if (in_array('INSERT', $this->aTablePrivileges)) {
                // insert user in table
                $iId = $this->oConnection->oBd->insert($sSchema, $sTable, $this->aValues, $sSequence, $sIdField);
                if ($this->oConnection->oBd->enErreur()) {
                    $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $this->aValues['output']);
                } else {
                    $this->aFields[$sIdField] = $iId;
                    $this->aValues['my_vitis_id'] = $iId;

                    $aXmlRacineAttribute['status'] = 1;
                    $sMessage = $this->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $this->aValues['output']);
                }
            } else {
                $oError = new VitisError(1, "Rights problem : you don't have right to insert in " . $sSchema . "." . $sTable);
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $this->aValues['output']);
            }
        }
        $aReturn = array('sStatus' => $aXmlRacineAttribute['status'], "sMessage" => $sMessage);
        return $aReturn;
    }

    /**
     *
     * @param type $sSchema schema containing the table
     * @param type $sTable table to update
     * @param type $sIdField id field name
     * @param type $sPrivilegeParent privilege to do the insertion
     * @return array containing the status and the message
     */
    function genericPut($sSchema, $sTable, $sIdField) {
        if (isset($this->aValues['sEncoding']))
            $sEncoding = $this->aValues['sEncoding'];
        else
            $sEncoding = null;
        if (isset($this->aValues['sSourceEncoding']))
            $sSourceEncoding = $this->aValues['sSourceEncoding'];
        else
            $sSourceEncoding = null;
        if ($this->oConnection->oError != null) {
            $oError = $this->oConnection->oError;
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $this->aValues['output']);
        } else {
            $this->getTablePrivileges($sSchema, $sTable);
            //$aPrivileges = array_intersect($this->oConnection->aPrivileges, $this->aTablePrivileges) ;
            if (in_array('UPDATE', $this->aTablePrivileges)) {
                $iId = $this->oConnection->oBd->update($sSchema, $sTable, $this->aValues, $sIdField, $this->aValues['my_vitis_id'], "text");
                if ($this->oConnection->oBd->enErreur()) {
                    $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $this->aValues['output']);
                } else {
                    $this->aFields[$sIdField] = $this->aValues['my_vitis_id'];
                    $aXmlRacineAttribute['status'] = 1;
                    $sMessage = $this->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $this->aValues['output']);
                }
            } else {
                $oError = new VitisError(1, "Rights problem : you don't have right to update in " . $sSchema . "." . $sTable);
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $this->aValues['output']);
            }
        }
        $aReturn = array('sStatus' => $aXmlRacineAttribute['status'], "sMessage" => $sMessage);
        return $aReturn;
    }

    function genericDelete($sSchema, $sTable, $sIdField) {
        if (isset($this->aValues['sEncoding']))
            $sEncoding = $this->aValues['sEncoding'];
        else
            $sEncoding = null;
        if (isset($this->aValues['sSourceEncoding']))
            $sSourceEncoding = $this->aValues['sSourceEncoding'];
        else
            $sSourceEncoding = null;
        $sParentClassName = get_class($this);
        $sChildClassName = substr($sParentClassName, 0, -1);
        if ($this->oConnection->oError != null) {
            $oError = $this->oConnection->oError;
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $this->aValues['output']);
        } else {
            $this->getTablePrivileges($sSchema, $sTable);
            //$aPrivileges = array_intersect($this->oConnection->aPrivileges, $this->aTablePrivileges) ;
            if (in_array('DELETE', $this->aTablePrivileges)) {
                if (isset($this->aValues['my_vitis_id'])) {
                    $oObject = new $sChildClassName($this->aPath, $this->aValues, $this->aProperties, false, $this->oConnection);
                    $oObject->DELETE();
                    array_push($this->aObjects, $oObject);
                } else {
                    //if several id
                    $aIdList = explode("|", $this->aValues['idList']);
                    foreach ($aIdList as $value) {
                        $this->aValues['my_vitis_id'] = $value;
                        $oObject = new $sChildClassName($this->aPath, $this->aValues, $this->aProperties, false, $this->oConnection);
                        $oObject->DELETE();
                        array_push($this->aObjects, $oObject);
                    }
                }
            } else {
                $oError = new VitisError(12, "Rights problem : you don't have right to delete in" . $sSchema . "." . $sTable);
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $this->aValues['output']);
            }
        }
        foreach ($this->aObjects as $oObject) {
            if ($oObject->oError != null) {
                $oError = $this->oConnection->oError;
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $this->aValues['output']);
            } else {
                if (!empty($this->aFields['idDeleted']) && !empty($this->aFields['user_id'])) {
                    if ($this->aFields['idDeleted'] == "")
                        $this->aFields['idDeleted'] .= $oUser->aFields['user_id'];
                    else
                        $this->aFields['idDeleted'] .= "|" . $oUser->aFields['user_id'];
                }
            }
        }
        if (!isset($sMessage)) {
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $this->aValues['output']);
        }
        $aReturn = array('sStatus' => $aXmlRacineAttribute['status'], "sMessage" => $sMessage);
        return $aReturn;
    }

    function deleteChild($sSchema, $sTable, $sIdField, $sPrivilegeParent = "") {
        $this->oConnection->oBd->delete($this->aProperties['schema_framework'], 'v_user', 'user_id', $this->aValues['my_vitis_id'], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
            $this->aFields["user_id"] = $this->aValues['my_vitis_id'];
        }
    }

    function getVersion($sRessources = "") {
        require_once (__DIR__ . '/../../conf/' . $sRessources . '/version.inc');
        $this->aFields["version"] = VM_VERSION;
        $this->aFields["build"] = VM_BUILD;
        $this->aFields["date"] = VM_MONTH_YEAR;
    }

    /**
     * Add to the sSelectedFields the PostGIS function to get the geometry on
     * EWKT format instead binary (WKB)
     * @param string $sSchema
     * @param string $sTable
     * @param string $sResultSRID SRID of the resulted proj
     */
    function formatSelectedFieldsForGeom($sSchema, $sTable, $sResultSRID = "") {

        $aGeomColumnsInfos = $this->getTableGeomColumnsInfos($sSchema, $sTable);

        $aGeomColumns = array();
        for ($i = 0; $i < count($aGeomColumnsInfos); $i++) {
            if (in_array($aGeomColumnsInfos[$i]['f_geometry_column'], $this->aSelectedFields)) {
                array_push($aGeomColumns, $aGeomColumnsInfos[$i]['f_geometry_column']);
            }
        }

        for ($i = 0; $i < count($this->aSelectedFields); $i++) {
            if (in_array($this->aSelectedFields[$i], $aGeomColumns)) {
                $sColumnKey = 'column_' . vitisUniqId();
                $sColumnName = $this->aSelectedFields[$i];
                if (!empty($this->aOrganizedFields[$sColumnName])) {
                    if (!empty($sResultSRID)) {
                        $this->aSelectedFields[$i] = "ST_AsEWKT(ST_Transform([" . $sColumnKey . "], [result_srid]::integer)) as " . $this->aSelectedFields[$i];
                        $this->aOrganizedFields["ST_AsEWKT(ST_Transform([" . $sColumnKey . "], [result_srid]::integer))"] = $sColumnName;

                        $this->aSqlParams['result_srid'] = array('value' => $sResultSRID, 'type' => 'integer');
                        $this->aSqlParams[$sColumnKey] = array('value' => $sColumnName, 'type' => 'column_name');
                    } else {
                        $this->aSelectedFields[$i] = "ST_AsEWKT([" . $sColumnKey . "]) as " . $this->aSelectedFields[$i];
                        $this->aOrganizedFields["ST_AsEWKT([" . $sColumnKey . "])"] = $sColumnName;

                        $this->aSqlParams[$sColumnKey] = array('value' => $sColumnName, 'type' => 'column_name');
                    }
                    unset($this->aOrganizedFields[$sColumnName]);
                }
            }
        }
    }

    /**
     * return a uniq file name create with datetime and random number in range 0-100000
     *
     */
    function UniqFileName() {
        $sUniqFileName = date('YmdHis') . rand(1, 100000);
        return $sUniqFileName;
    }

    /**
     * Update a table Join (2PK with FK on other table)
     * @param string $sSchema Schema's name
     * @param string $sTable Table's name
     * @param string $sFieldIdFromRequest Field's name for Delete row and common insert
     * @param string $sFieldIdToUpdate Fild's name for insert list value
     * @param string $sRole Role's name
     * @param string $sNameList List's key in aValues
     */
    function updateJoinTable($sSchema, $sTable, $sFieldIdFromRequest, $sFieldIdToUpdate, $sRole, $sNameList) {

        if (!isset($this->aValues[$sFieldIdFromRequest])) {
            $this->aValues[$sFieldIdFromRequest] = $this->aValues['my_vitis_id'];
        }
        if ($this->aValues[$sNameList] !== null && $this->aValues[$sNameList] !== "") {
            $aIdItems = explode("|", $this->aValues[$sNameList]);
        } else {
            $aIdItems = array();
        }
        $sMode = 'text';
        if (is_numeric($this->aValues[$sFieldIdFromRequest]))
            $sMode = 'integer';
        $this->oConnection->oBd->delete($sSchema, $sTable, $sFieldIdFromRequest, $this->aValues[$sFieldIdFromRequest], $sMode);
        foreach ($aIdItems as $aIdItem) {
            $this->aValues[$sFieldIdToUpdate] = $aIdItem;
            $aReturn = $this->genericPost($sSchema, $sTable, null, $sFieldIdFromRequest);
        }

        return $aReturn;
    }

    function deleteFromJoinTable($sSchema, $sTable, $sFieldIdFromRequest, $sFieldIdToUpdate, $sRole, $sNameList) {
        $this->aValues[$sNameList] = array();
        return $this->updateJoinTable($sSchema, $sTable, $sFieldIdFromRequest, $sFieldIdToUpdate, $sRole, $sNameList);
    }

    /**
     * Save a file in public dir
     * @param string $sFieldName Field's name form request for DB save
     * @param string $sPath realtive path from public_dir
     */
    function postFileSave($sFieldName, $sPath, $sDir = null) {
        $aReturn = array('sStatus' => 0, 'sMessage' => '');
        if ($sDir === null) {
            $sDir = $this->UniqFileName();
        }
        $sPictureDir = $this->aProperties['dir_export'] . $sPath;

        $this->aValues[$sFieldName] = $sDir . "/" . $_FILES[$sFieldName]['name'];

        $sFilePathName = $sPictureDir . $this->aValues[$sFieldName];

        if (!is_dir($sPictureDir . $sDir)) {
            mkdir($sPictureDir . $sDir, 0777, true);
        }

        if (!move_uploaded_file($_FILES[$sFieldName]['tmp_name'], $sFilePathName)) {
            writeToErrorLog(ERROR_0031 . $_FILES[$sFieldName]['name'] . " " . $sFilePathName);
            $aReturn = array('sStatus' => 1, 'sMessage' => WORKSPACE_ERROR_COPYING_FILE);
        }

        return $aReturn;
    }

    /**
     * Update a file in public dir
     * @param string $sFieldName Field's name from request for DB save
     * @param string $sPath relative path from public_dir
     * @param string $sSchema Schema's name
     * @param string $sTable Table's name
     * @param string $sFieldId Field's name for get path of file to update
     */
    function putFileUpdate($sFieldName, $sPath, $sSchema, $sTable, $sFieldId) {
        if (array_key_exists($sFieldName . '_file', $this->aValues) && array_key_exists($sFieldName . '_name', $this->aValues)) {
            $this->aFields = $this->getFields($sSchema, $sTable, $sFieldId);
            $aDir = explode("/", $this->aFields[$sFieldName]);

            if (count($aDir) === 1) {
                array_unshift($aDir, $this->UniqFileName());
            } else if (count($aDir) > 2) {
                writeToErrorLog("ERROR: Too few folder for this file");
            }

            $sFilePathName = $this->aProperties['dir_export'] . $sPath . $aDir[0] . "/" . $this->aValues[$sFieldName . '_name'];
            if (!is_Dir($this->aProperties['dir_export'] . $sPath . $aDir[0] . "/")) {
                mkdir($this->aProperties['dir_export'] . $sPath . $aDir[0], 0777, true);
            }
            if (file_exists($this->aProperties['dir_export'] . $sPath . $aDir[0] . "/" . $aDir[1])) {
                if ($aDir[0] . "/" . $aDir[1] !== $this->aValues[$sFieldName . '_name']) {
                    @unlink($this->aProperties['dir_export'] . $sPath . $aDir[0] . "/" . $aDir[1]);
                }
            }
            $fPicture = fopen($sFilePathName, "w+");
            if (!fwrite($fPicture, $this->aValues[$sFieldName . '_file'])) {
                writeToErrorLog("ERROR: picture save failed");
            }
            fclose($fPicture);
            $this->aValues[$sFieldName] = $aDir[0] . "/" . $this->aValues[$sFieldName . "_name"];
        }
    }

    /**
     * Save a file in ws_data/$sVitisObjectName/documents/$sId/$sFieldName
     * @param string $sFieldName
     * @param string $sVitisObjectName
     * @param string $sId
     * @param string $aReturn
     */
    function postFileSaveWsData($sFieldName, $sVitisObjectName, $sId, $aReturn) {
        if (!isset($aReturn)) {
            $aReturn = array("sStatus" => 1);
        }
        if (!empty($_FILES[$sFieldName])) {
            $sImageDir = $this->aProperties['ws_data_dir'] . '/vitis/' . $sVitisObjectName . '/documents/' . $sId . '/' . $sFieldName . '/' . $_FILES[$sFieldName]["name"];
            $sDirPath = $this->createElementFilesFolder($sVitisObjectName, $sId);
            $sDirColumnPath = $sDirPath . '/' . $sFieldName;
            if (!is_dir($sDirColumnPath)) {
                mkdir($sDirColumnPath, 0777, true);
            }
            $sErrorMessage = uploadFile($sFieldName, "", $sImageDir, $_FILES[$sFieldName]['size'] + 1);
            if ($sErrorMessage != "") {
                $aReturn = array("sStatus" => 0, "sMessage" => $sErrorMessage);
                writeToErrorLog($sErrorMessage);
            }
        }
        return $aReturn;
    }

    /**
     * Update a file in ws_data/$sVitisObjectName/documents/$sId/$sFieldName
     * @param string $sFieldName
     * @param string $sVitisObjectName
     * @param string $sId
     * @param string $aReturn
     */
    function putFileUpdateWsData($sFieldName, $sVitisObjectName, $sId, $aReturn) {
        if (!isset($aReturn)) {
            $aReturn = array("sStatus" => 1);
        }
        if (!empty($this->aValues[$sFieldName . "_file"])) {

            $sImageDir = $this->aProperties['ws_data_dir'] . '/vitis/' . $sVitisObjectName . '/documents/' . $sId . '/' . $sFieldName . '/' . $this->aValues[$sFieldName . "_name"];

            // Crée les répertoires si ils n'existent pas
            $sDirPath = $this->createElementFilesFolder($sVitisObjectName, $sId);
            $sDirColumnPath = $sDirPath . '/' . $sFieldName;
            if (!is_dir($sDirColumnPath)) {
                mkdir($sDirColumnPath, 0777, true);
            }

            // la colonne $sFieldName vaudra le nom du fichier
            $this->aValues[$sFieldName] = $this->aValues[$sFieldName . "_name"];
            $fp = fopen($sImageDir, "w");
            if (!$fp) {
                return array(sStatus => 0, sMessage => WORKSPACE_ERROR_COPYING_FILE);
            }
            $bOK = fwrite($fp, $this->aValues[$sFieldName . "_file"]);
            if (!$bOK) {
                return array(sStatus => 0, sMessage => WORKSPACE_ERROR_COPYING_FILE);
            }
            $bOK = fclose($fp);
            if (!$bOK) {
                return array(sStatus => 0, sMessage => WORKSPACE_ERROR_COPYING_FILE);
            }
        }
        return $aReturn;
    }

    function getTablePrivileges($sSchema, $sTable) {
        $this->aTablePrivileges = $this->oConnection->getTableRights($sSchema, $sTable);
    }

    /**
     * Create the element files container
     * @param string $sVitisObjectName
     * @param string $sId
     * @return string Path to the created directory
     */
    function createElementFilesFolder($sVitisObjectName, $sId) {
        // Répertoires présents ?
        if (is_dir($this->aProperties['ws_data_dir'])) {
            $sDirPath = $this->aProperties['ws_data_dir'] . '/vitis';
            if (!is_dir($sDirPath)) {
                mkdir($sDirPath, 0777, true);
            }
            $sDirPath = $sDirPath . '/' . $sVitisObjectName;
            if (!is_dir($sDirPath)) {
                mkdir($sDirPath, 0777, true);
            }
            $sDirPath = $sDirPath . '/documents';
            if (!is_dir($sDirPath)) {
                mkdir($sDirPath, 0777, true);
            }
            $sDirPath = $sDirPath . '/' . $sId;
            if (!is_dir($sDirPath)) {
                mkdir($sDirPath, 0777, true);
            }
        }

        return $sDirPath;
    }

    /**
     * Delete the documents binded to the elements specified in $aIds
     * @param string $sVitisObjectName
     * @param array $aIds
     */
    function deleteElementsDocuments($sVitisObjectName, $aIds) {
        if (!isset($aIds)) {
            if (!empty($this->aValues['idList'])) {
                $aIds = explode("|", $this->aValues['idList']);
            }
            if (!empty($this->aPath['2'])) {
                $aIds = array($this->aPath['2']);
            }
        }
        for ($i = 0; $i < count($aIds); $i++) {
            $sDir = $this->aProperties['ws_data_dir'] . '/vitis/' . $sVitisObjectName . '/documents/' . $aIds[$i];
            if (is_dir($sDir)) {
                clearDir($sDir);
            }
        }
    }

    /**
     * Decode a JSON filter and returns an array witch contains
     * the string request and the array parameters
     * @param string $sJSONFilter JSON filter, can be passed by string, object or array
     * @param string $sSchema
     * @param string $sTable
     * @return array
     */
    function decodeJSONFilter($sJSONFilter, $sSchema = null, $sTable = null) {

        if (is_object($sJSONFilter) || is_array($sJSONFilter)) {
            $sJSONFilter = json_encode($sJSONFilter);
        }

        $aJSONFilter = json_decode($sJSONFilter, true);
        $sFilter = '';
        $aParams = array();

        // Valeurs par défaut si juste un operator est passé en paramètre
        if (isset($aJSONFilter['column']) &&
                isset($aJSONFilter['compare_operator'])) {
            $aJSONFilter = array(
                'relation' => 'AND',
                'operators' => array($aJSONFilter)
            );
        }

        if (empty($aJSONFilter['relation']) ||
                !is_array($aJSONFilter['operators'])) {
            if (strlen(trim($sJSONFilter)) > 0) {
                writeToErrorLog(ERROR_0034 . ': missing argument on ' . $sJSONFilter);
            }
            return array('request' => $sFilter, 'params' => $aParams);
        }

        if (is_array($aJSONFilter['operators'])) {

            // Vérifie relation
            $sRelation = $this->checkRelationOperator($aJSONFilter['relation']);
            if (empty($sRelation)) {
                writeToErrorLog(ERROR_0034 . ': relation not valid');
                return array('request' => $sFilter, 'params' => $aParams);
            }

            // Pour chacun des opérateurs
            for ($i = 0; $i < count($aJSONFilter['operators']); $i++) {

                // Filtre imbriquée ?
                if (!empty($aJSONFilter['operators'][$i]['relation'])) {

                    // Récupère récursivement le contenu du filtre imbriqué
                    $aDecodedSubFilter = $this->decodeJSONFilter($aJSONFilter['operators'][$i], $sSchema, $sTable);

                    // Ajout des paramètres
                    foreach ($aDecodedSubFilter['params'] as $key => $value) {
                        $aParams[$key] = $value;
                    }

                    // Ajout dans la requête
                    if (strlen($sFilter) > 0) {
                        $sFilter .= ' ' . $sRelation . ' ';
                    } else {
                        $sFilter .= '(';
                    }
                    $sFilter .= $aDecodedSubFilter['request'];
                } else {

                    $aOperator = $this->decodeOperator($aJSONFilter['operators'][$i], $sSchema, $sTable);

                    if (!empty($aOperator)) {

                        // Ajout des paramètres
                        foreach ($aOperator['params'] as $key => $value) {
                            $aParams[$key] = $value;
                        }

                        // Ajout dans la requête
                        if (strlen($sFilter) > 0) {
                            $sFilter .= ' ' . $sRelation . ' ';
                        } else {
                            $sFilter .= '(';
                        }
                        $sFilter .= $aOperator['request'];
                    }
                }
            }
            if (strlen($sFilter) > 0) {
                $sFilter .= ')';
            }
        }

        return array('request' => $sFilter, 'params' => $aParams);
    }

    /**
     * Decode a filter operator and returns an array witch contains
     * the string request and the array parameters
     * @param array $aOperator
     * @param string $sSchema
     * @param string $sTable
     * @return array
     */
    function decodeOperator($aOperator, $sSchema = null, $sTable = null) {

        $sFilter = '';
        $aParams = array();

        $aOperator['value'] = $this->parseBools($aOperator['value']);

        // Vérifications
        if (empty($aOperator['column']) ||
                empty($aOperator['compare_operator'])) {
            return null;
        }
        if (!isset($aOperator['value']) || $aOperator['value'] == '') {
            switch (strtoupper(trim($aOperator['compare_operator']))) {
                case 'NULL':
                case 'IS NULL':
                case 'NOT NULL':
                case 'IS NOT NULL':
                    $aOperator['value'] = "";
                    break;
                default:
                    if (strlen(trim(json_encode($aOperator))) > 0) {
                        writeToErrorLog(ERROR_0034 . ': missing argument on ' . json_encode($aOperator));
                    }
                    return null;
                    break;
            }
        }


        // Vérifie compare_operator
        $sCompare = $this->checkCompareOperator($aOperator['compare_operator']);
        if (empty($sCompare)) {
            writeToErrorLog(ERROR_0034 . ': compare_operator not valid');
            null;
        }

        // Clées à utiliser en guise de variables
        $sColumnKey = 'column_' . vitisUniqId();
        $sValueKey = 'value_' . vitisUniqId();

        switch ($sCompare) {
            case 'IS NULL':
            case 'IS NOT NULL':
                // Ajoute les paramètres
                $aParams[$sColumnKey] = array('value' => $aOperator['column'], 'type' => 'column_name');
                // Ajoute à la requête
                $sFilter .= '"[' . $sColumnKey . ']" ' . $sCompare;
                break;
            case 'IN':
            case 'NOT IN':
                if (is_array($aOperator['value'])) {
                    $sInFilter = '';
                    for ($i = 0; $i < count($aOperator['value']); $i++) {
                        if (strlen($sInFilter) > 0) {
                            $sInFilter .= ', ';
                        }
                        // Clée à utiliser en guise de variable
                        $sValueKey = 'value_' . vitisUniqId() . $i;
                        // Ajout du paramètre
                        $aParams[$sValueKey] = array('value' => $aOperator['value'][$i], 'type' => 'string');
                        // Ajout à la requête
                        $sInFilter .= '[' . $sValueKey . ']';
                    }
                    // Ajout de la colonne
                    $aParams[$sColumnKey] = array('value' => $aOperator['column'], 'type' => 'column_name');
                    // Ajout à la requête
                    $sFilter .= '"[' . $sColumnKey . ']" ' . $sCompare . ' (' . $sInFilter . ')';
                }
                break;
            case 'LIKE':

                // Ajoute les paramètres
                $aParams[$sColumnKey] = array('value' => $aOperator['column'], 'type' => 'column_name');
                $aParams[$sValueKey] = array('value' => $aOperator['value'], 'type' => 'quoted_string');

                $sValueFilter = '[' . $sValueKey . ']';
                $sColumnFilter = '"[' . $sColumnKey . ']"';

                if (!empty($aOperator['compare_operator_options'])) {
                    if ($aOperator['compare_operator_options']['case_insensitive'] == 'true' ||
                            $aOperator['compare_operator_options']['case_insensitive'] == true) {

                        $sValueFilter = 'LOWER(' . $sValueFilter . ')';
                        $sColumnFilter = 'LOWER(' . $sColumnFilter . '::text)';
                    }
                }

                // Ajoute à la requête
                $sFilter .= $sColumnFilter . ' LIKE ' . $sValueFilter;

                break;
            case 'INTERSECT':

                $sGeomDefKey = 'geom_def_' . vitisUniqId();
                $sGeomColumnKey = 'geom_column_' . vitisUniqId();
                $aParams[$sGeomDefKey] = array('value' => $aOperator['value'], 'type' => 'geometry');
                $aParams[$sGeomColumnKey] = array('value' => $aOperator['column'], 'type' => 'column_name');

                $sSQLGeom = "[" . $sGeomDefKey . "]";
                $sSQLColumn = "[" . $sGeomColumnKey . "]";

                // compare_operator_options
                if (!empty($aOperator['compare_operator_options'])) {
                    // source_proj
                    if (!empty($aOperator['compare_operator_options']['source_proj'])) {
                        $sSourceProjKey = 'source_proj_' . vitisUniqId();
                        $aParams[$sSourceProjKey] = array('value' => $aOperator['compare_operator_options']['source_proj'], 'type' => 'integer');
                        $sSQLSRID = "[" . $sSourceProjKey . "]::integer";
                        $sSRID = $aOperator['compare_operator_options']['source_proj'];
                    }
                    // intersect_buffer
                    if (!empty($aOperator['compare_operator_options']['intersect_buffer'])) {
                        $sIntersectBufferKey = 'intersect_buffer' . vitisUniqId();
                        $aParams[$sIntersectBufferKey] = array('value' => $aOperator['compare_operator_options']['intersect_buffer'], 'type' => 'integer');
                        $sSQLBuffer = "[" . $sIntersectBufferKey . "]::float";
                    }
                    // intersect_buffer_geom_type
                    if (!empty($aOperator['compare_operator_options']['intersect_buffer_geom_type'])) {
                        $aIntersectTypes = explode('|', strtoupper($aOperator['compare_operator_options']['intersect_buffer_geom_type']));
                        // Types sous vorme de variable entre crochets
                        $aPostgisIntersectTypes = array();
                        for ($i = 0; $i < count($aIntersectTypes); $i++) {
                            // Types sous forme de chaine
                            $aExcludeTypes = array();
                            switch ($aIntersectTypes[$i]) {
                                case 'POINT':
                                    array_push($aExcludeTypes, 'ST_Point');
                                    array_push($aExcludeTypes, 'ST_MultiPoint');
                                    break;
                                case 'LINE':
                                    array_push($aExcludeTypes, 'ST_Linestring');
                                    array_push($aExcludeTypes, 'ST_MultiLinestring');
                                    break;
                                case 'POLYGON':
                                    array_push($aExcludeTypes, 'ST_Polygon');
                                    array_push($aExcludeTypes, 'ST_MultiPolygon');
                                    break;
                                default:
                                    break;
                            }
                            for ($ii = 0; $ii < count($aExcludeTypes); $ii++) {
                                $sPostgisGeomTypeKey = 'postgis_geom_type_' . vitisUniqId() . $i . $ii;
                                $aParams[$sPostgisGeomTypeKey] = array('value' => $aExcludeTypes[$ii], 'type' => 'string');
                                array_push($aPostgisIntersectTypes, "[" . $sPostgisGeomTypeKey . "]");
                            }
                        }
                    }
                }

                // Si le SRID source n'est pas renseigné
                if (empty($sSQLSRID)) {
                    if (!empty($sSchema) && !empty($sTable)) {
                        $sSRID = $this->getColumnProjection($sSchema, $sTable, $aOperator['column']);
                        $sSourceProjKey = 'source_proj_' . vitisUniqId();
                        $aParams[$sSourceProjKey] = array('value' => $sSRID, 'type' => 'integer');
                        $sSQLSRID = "[" . $sSourceProjKey . "]::integer";
                    } else {
                        writeToErrorLog(ERROR_0034 . ': missing $sSchema and $sTable params');
                        break;
                    }
                }

                if (empty($sSRID)) {
                    $sSRID = 2154;
                }
                // Géométrie
                if ($sSRID === '4326') {
                    $sIntersectFilter = 'ST_GeomFromEWKT(' . $sSQLGeom . ')::geography';
                } else {
                    $sIntersectFilter = 'ST_GeomFromEWKT(' . $sSQLGeom . ')';
                }
                // Buffer de sélection
                if (!empty($sSQLBuffer)) {
                    // Mise en place du buffer
                    if ($sSRID === '4326') {
                        $sBufferFilter = 'ST_Buffer(' . $sIntersectFilter . ', ' . $sSQLBuffer . ')::geometry';
                    } else {
                        $sBufferFilter = 'ST_Buffer(' . $sIntersectFilter . ', ' . $sSQLBuffer . ')';
                    }
                    // Mise en place des conditions celons le type de géométrie retournée
                    if (!empty($aPostgisIntersectTypes)) {
                        $sCaseTypeFilter = " CASE";
                        for ($i = 0; $i < count($aPostgisIntersectTypes); $i++) {
                            $sCaseTypeFilter .= " WHEN ST_GeometryType(" . $sSQLColumn . ")=" . $aPostgisIntersectTypes[$i] . "";
                            $sCaseTypeFilter .= " THEN " . $sBufferFilter;
                        }
                        $sCaseTypeFilter .= " ELSE " . $sIntersectFilter;
                        $sCaseTypeFilter .= " END";
                        $sIntersectFilter = $sCaseTypeFilter;
                    } else {
                        $sIntersectFilter = $sBufferFilter;
                    }
                }
                // Reprojection
                if (!empty($sSQLSRID)) {
                    $sIntersectFilter = 'ST_Transform(' . $sIntersectFilter . ', ' . $sSQLSRID . ')';
                }
                // Intersection
                if (!empty($sSQLColumn)) {
                    $sIntersectFilter = 'ST_Intersects(' . $sIntersectFilter . ', ' . $sSQLColumn . ')';
                }

                $sFilter .= $sIntersectFilter;

                break;
            default:
                // Ajoute les paramètres
                $aParams[$sColumnKey] = array('value' => $aOperator['column'], 'type' => 'column_name');
                if (is_bool($aOperator['value']))
                    $aParams[$sValueKey] = array('value' => var_export($aOperator['value'], true), 'type' => 'boolean');
                else
                    $aParams[$sValueKey] = array('value' => $aOperator['value'], 'type' => 'string');

                // Ajoute à la requête
                $sFilter .= '"[' . $sColumnKey . ']"' . $sCompare . '[' . $sValueKey . ']';
                break;
        }

        return array('request' => $sFilter, 'params' => $aParams);
    }

    /**
     * Get a column projection
     * @param string $sSchema
     * @param string $sTable
     * @param string $sColumn
     * @return string
     */
    function getColumnProjection($sSchema, $sTable, $sColumn) {
        return $this->oConnection->oBd->getColumnSRID($sSchema, $sTable, $sColumn);
    }

    /**
     * Check the given compare operator and return
     * a well formed compare operator string
     * @param string $sCompareOperator
     * @return string
     */
    function checkCompareOperator($sCompareOperator) {
        $sCompare = null;
        switch (strtoupper(trim($sCompareOperator))) {
            case '=':
                $sCompare = '=';
                break;
            case '!=':
                $sCompare = '!=';
                break;
            case '<>':
                $sCompare = '<>';
                break;
            case '>=':
                $sCompare = '>=';
                break;
            case '<=':
                $sCompare = '<=';
                break;
            case '>':
                $sCompare = '>';
                break;
            case '<':
                $sCompare = '<';
                break;
            case 'IN':
                $sCompare = 'IN';
                break;
            case 'NOT IN':
                $sCompare = 'NOT IN';
                break;
            case 'NULL':
            case 'IS NULL':
                $sCompare = 'IS NULL';
                break;
            case 'NOT NULL':
            case 'IS NOT NULL':
                $sCompare = 'IS NOT NULL';
                break;
            case 'LIKE':
                $sCompare = 'LIKE';
                break;
            case 'INTERSECT':
                $sCompare = 'INTERSECT';
                break;
            default:
                break;
        }
        return $sCompare;
    }

    function boolToString($boolVal = false) {
        return ($boolVal ? 'true' : 'false');
    }

    function parseBools($value) {
        if (is_bool($value)) {
            $value = $this->boolToString($value);
        }
        return $value;
    }

    /**
     * Check the given relation operator and return
     * a well formed relation operator string
     * @param string $sRelationOperator
     * @return string
     */
    function checkRelationOperator($sRelationOperator) {
        $sRelation = null;
        switch (strtoupper(trim($sRelationOperator))) {
            case 'AND':
                $sRelation = 'AND';
                break;
            case 'OR':
                $sRelation = 'OR';
                break;
            default:
                break;
        }
        return $sRelation;
    }

    function pictureResampler($sFilePath, $iDstWidth, $iDstHeight, $iCropX = 0, $iCropY = 0, $iOffsetX = 0, $iOffsetY = 0) {
        // récupération de l'extension pour ouverture du fichier
        $sType = strtolower(substr(strrchr($sFilePath, "."), 1));
        if ($sType == 'jpeg' || $sType == 'JPG') {
            $sType = 'jpg';
        }
        // Récupération du format de la source
        list($iCurrentWidth, $iCurrentHeight) = getimagesize($sFilePath);
        list($width, $height) = $this->sizeCalculator($iCurrentWidth, $iCurrentHeight, $iDstWidth, $iDstHeight);
        // Ouverture de la ressource return false si format non réconnu
        switch ($sType) {
            case 'bmp': $img = imagecreatefromwbmp($sFilePath);
                break;
            //case 'gif': $img = imagecreatefromgif($sFilePath);
            //    break;
            case 'jpg': $img = imagecreatefromjpeg($sFilePath);
                break;
            case 'png': $img = imagecreatefrompng($sFilePath);
                break;
            default :
                return false;
        }
        //Suppression du fichier sinon problème de réouverture après si jpg et doublon si autre format
        unlink($sFilePath);

        if ($img === false) {
            writeToErrorLog("ERROR : Vitis cannot open this file");
            return false;
        }
        // création de l'image de sortie
        $image_p = imagecreatetruecolor($width, $height);
        $white = imagecolorallocate($image_p, 255, 255, 255);
        imagefill($image_p, 0, 0, $white);
        // resizer
        if (!imagecopyresampled($image_p, $img, $iOffsetX, $iOffsetY, $iCropX, $iCropY, $width, $height, $iCurrentWidth, $iCurrentHeight)) {
            writeToErrorLog("ERROR : Vitis cannot resampling the picture");
            return false;
        }
        // transformation au format jpeg pour supprimer l'alpha et gagner en taille du fichier
        $aPath = explode(".", $sFilePath);
        $aPath[count($aPath) - 1] = "jpg";
        $dst = implode(".", $aPath);
        // Enregistrement du jpeg
        if (!imagejpeg($image_p, $dst)) {
            writeToErrorLog("ERROR : Vitis failed to write this picture");
            return false;
        }
        // Libération espace mémoire
        imagedestroy($image_p);
        imagedestroy($img);
        // retour du nouveau nom de fichier
        return $dst;
    }

    function sizeCalculator($iCurrentWidth, $iCurrentHeight, $iTargetWidth, $iTargetHeight) {
        $iWidth = $iTargetWidth;
        $iHeight = $iTargetHeight;
        // si image plus grande on retourne les cibles
        if ($iCurrentWidth > $iTargetWidth && $iCurrentHeight > $iTargetHeight) {
            return array($iTargetWidth, $iTargetHeight);
        }
        // On détermine si on conserve la largeur ou la hauteur
        if ($iCurrentWidth > $iTargetWidth && $iCurrentHeight < $iTargetHeight) {
            $iHeight = $iCurrentHeight * $iTargetWidth / $iCurrentWidth;
            $iWidth = $iTargetWidth;
        } else if ($iCurrentWidth < $iTargetWidth && $iCurrentHeight > $iTargetHeight) {
            $iHeight = $iTargetHeight;
            $iWidth = $iCurrentWidth * $iTargetHeight / $iCurrentHeight;
        } else {
            // dans ce cas les les deux distance sont plus petite que le but on
            // calcul donc le delta pour déterminer quel coté est gardé
            $fDeltaWidth = $iCurrentWidth / $iTargetWidth;
            $fDeltaHeight = $iCurrentHeight / $iTargetHeight;
            if ($iDeltaWidth < $iDeltaHeight) {
                $iHeight = $iCurrentHeight;
                $iWidth = $iCurrentHeight * $iTargetWidth / $iTargetHeight;
            } else {
                $iWidth = $iCurrentWidth;
                $iHeight = $iCurrentWidth * $iTargetHeight / $iTargetWidth;
            }
        }

        return array($iWidth, $iHeight);
    }

}

?>

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

        // Format $this->aSelectedFields for spatial use
        $this->formatSelectedFieldsForGeom($sSchema, $sTable);

        //generate the structure of the result
        $this->addSelectedFields();

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
            foreach ($aFieldInTable as $fields) {
                if (strpos($fields, "(") == FALSE && strpos($fields, ")") == FALSE && strpos(strtolower($fields), " as ") == FALSE) {
                    $fields = "\"" . $fields . "\"";
                }
                if ($sSql == "SELECT ") {
                    $sSql .= $fields;
                } else {
                    $sSql .= ", " . $fields;
                }
            }

            $sSql .= " FROM " . $sSchema . "." . $sTable . " WHERE \"" . $sIdField . "\" IN ('" . $this->aValues['my_vitis_id'] . "')";
            //Get result
            $oResult = $this->oConnection->oBd->execute($sSql);
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
        $sSql = str_replace('[sSchemaFramework]', $sSchema, $aSql['getTableColumn']);
        $sSql = str_replace('[sTable]', $sTable, $sSql);
        $oResult = $this->oConnection->oBd->execute($sSql);

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
        $sSql = str_replace('[sSchemaFramework]', $sSchema, $sSql);
        $sSql = str_replace('[sTable]', $sTable, $sSql);

        $oResult = $this->oConnection->oBd->execute($sSql);

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
     * @param $sPrivilegeParent privilege to get all the object
     * @param $sPrivilegeChild privilege the get one object
     * @param $sVitisObjectName Name of the vitis object, if provide and the object contains files stored in ws_data/vitis/$sVitisObjectName the values will be url formed
     * @return the array of objects
     */
    function genericGet($sSchema, $sTable, $sIdField, $bOnlyReturnStatus = false, $sVitisObjectName = "") {
        $sParentClassName = get_class($this);
        $sChildClassName = substr($sParentClassName, 0, -1);
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
                    $oObject = new $sChildClassName($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
                    $oObject->GET();

                    // Vérifie si il y a des fichiers à renvoyer
                    if ($sVitisObjectName != "") {
                        $sDataDir = $this->aProperties['ws_data_dir'] . '/vitis/' . $sVitisObjectName . '/documents/' . $oObject->aFields[$sIdField];
                        $sDataUrl = $this->aProperties['web_server_name'] . "/" . $this->aProperties['ws_data_alias'] . "/vitis/" . $sVitisObjectName . "/documents/" . $oObject->aFields[$sIdField];
                        if (is_dir($sDataDir)) {
                            // Remplace le nom du fichier par son url
                            foreach ($oObject->aFields as $key => $value) {                                
                                if (is_dir($sDataDir . "/" . $key)) {
                                    $oObject->aFields[$key] = $sDataUrl . "/" . $key . "/" . $value;
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
                    if (isset($this->aValues['distinct']) && $this->aValues['distinct'] == "true") {
                        $sSql .= "DISTINCT ";
                    }
                    // Format $this->aSelectedFields for spatial use
                    $this->formatSelectedFieldsForGeom($sSchema, $sTable, $this->aValues['result_srid']);
                    //filter
                    $this->addSelectedFields();
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
                        //$aFieldInTable = array_intersect($aColumn, $this->aSelectedFields);
                    }
                    //build request
                    if (!empty($aFieldInTable)) {

                        foreach ($aFieldInTable as $fields) {
                            if ($sSql == "SELECT " || $sSql == "SELECT DISTINCT ") {
                                $sSql .= $fields;
                            } else {
                                $sSql .= ", " . $fields;
                            }
                        }
                    }
                    $sSql .= " FROM " . $sSchema . "." . $sTable;
                    if (isset($this->aValues['filter'])) {
                        //$aFilter = explode("|", $this->aValues['filter']);

                        if (strpos($sSql, " WHERE ") == FALSE) {
                            $sSql .= " WHERE " . $this->aValues['filter'];
                        } else {
                            $sSql .= " AND " . $this->aValues['filter'];
                        }
                    }
                    //order by
                    if (isset($this->aValues['order_by'])) {
                        $aOrder = explode("|", $this->aValues['order_by']);
                        foreach ($aOrder as $value) {
                            if (strpos($sSql, "ORDER BY") == FALSE) {
                                $sSql .= " ORDER BY " . str_replace("=", " ", "\"" . $value . "\"");
                            } else {
                                $sSql .= ", " . str_replace("=", " ", "\"" . $value . "\"");
                            }
                        }
                        if (isset($this->aValues['sort_order'])) {
                            $sSql .= " " . $this->aValues['sort_order'];
                        }
                    }
                    //limit
                    if (isset($this->aValues['limit'])) {
                        $sSql .= " LIMIT " . $this->aValues['limit'];
                    }
                    //offset
                    if (isset($this->aValues['offset'])) {
                        $sSql .= " OFFSET " . $this->aValues['offset'];
                    }

                    //get the result
                    $oResult = $this->oConnection->oBd->execute($sSql);
                    // if no error get the result
                    $this->aValues['my_vitis_id'] = "";
                    if (empty($this->oConnection->oBd->enErreur) && $this->oConnection->oBd->nombreLigne($oResult) > 0) {
                        while ($aLigne = $this->oConnection->oBd->ligneSuivante($oResult)) {
                            $oObject = new $sChildClassName($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
                            $oObject->aFields = $aLigne;
                            array_push($this->aObjects, $oObject);
                            // Vérifie si il y a des fichiers à renvoyer
                            if ($sVitisObjectName != "") {
                                $sDataDir = $this->aProperties['ws_data_dir'] . '/vitis/' . $sVitisObjectName . '/documents/' . $oObject->aFields[$sIdField];
                                $sDataUrl = $this->aProperties['web_server_name'] . "/" . $this->aProperties['ws_data_alias'] . "/vitis/" . $sVitisObjectName . "/documents/" . $oObject->aFields[$sIdField];
                                if (is_dir($sDataDir)) {
                                    // Remplace le nom du fichier par son url
                                    foreach ($oObject->aFields as $key => $value) {
                                        if (is_dir($sDataDir . "/" . $key)) {
                                            $oObject->aFields[$key] = $sDataUrl . "/" . $key . "/" . $value;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    $this->aFields['list_count'] = $this->oConnection->oBd->nombreLigne($oResult);
                    $sSql = "select count(*) as total_row_number FROM " . $sSchema . "." . $sTable;
                    if (isset($this->aValues['filter'])) {

                        //$aFilter = explode("|", $this->aValues['filter']);

                        if (strpos($sSql, " WHERE ") == FALSE) {
                            $sSql .= " WHERE " . $this->aValues['filter'];
                        } else {
                            $sSql .= " AND " . $this->aValues['filter'];
                        }
                    }


                    $oResult = $this->oConnection->oBd->execute($sSql);
                    $aLigne = $this->oConnection->oBd->ligneSuivante($oResult);
                    $this->aFields['total_row_number'] = $aLigne['total_row_number'];
                }
            } else {
                $oError = new Error(1, "Rights problem : you don't have right to list " . $sChildClassName);
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
        if (isset($this->aValues["attributs"])) {
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
                    $oError = new Error(1, $this->oConnection->oBd->getBDMessage());
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $this->aValues['output']);
                } else {
                    $this->aFields[$sIdField] = $iId;
                    $this->aValues['my_vitis_id'] = $iId;

                    $aXmlRacineAttribute['status'] = 1;
                    $sMessage = $this->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $this->aValues['output']);
                }
            } else {
                $oError = new Error(1, "Rights problem : you don't have right to insert in " . $sSchema . "." . $sTable);
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
                    $oError = new Error(1, $this->oConnection->oBd->getBDMessage());
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $this->aValues['output']);
                } else {
                    $this->aFields[$sIdField] = $this->aValues['my_vitis_id'];
                    $aXmlRacineAttribute['status'] = 1;
                    $sMessage = $this->asDocument('', 'vitis', $sEncoding, True, $aXmlRacineAttribute, $sSourceEncoding, $this->aValues['output']);
                }
            } else {
                $oError = new Error(1, "Rights problem : you don't have right to insert in " . $sSchema . "." . $sTable);
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
                    $oObject = new $sChildClassName($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
                    $oObject->DELETE();
                    array_push($this->aObjects, $oObject);
                } else {
                    //if several id
                    $aIdList = explode("|", $this->aValues['idList']);
                    foreach ($aIdList as $value) {
                        $this->aValues['my_vitis_id'] = $value;
                        $oObject = new $sChildClassName($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
                        $oObject->DELETE();
                        array_push($this->aObjects, $oObject);
                    }
                }
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
            $this->oError = new Error(1, $this->oConnection->oBd->getBDMessage());
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
                if (!empty($sResultSRID)) {
                    $this->aSelectedFields[$i] = "ST_AsEWKT(ST_Transform(" . $this->aSelectedFields[$i] . ", " . $sResultSRID . ")) as " . $this->aSelectedFields[$i];
                } else {
                    $this->aSelectedFields[$i] = "ST_AsEWKT(" . $this->aSelectedFields[$i] . ") as " . $this->aSelectedFields[$i];
                }
            }
        }
    }

    /**
     * return a uniq file name create with datetime and random number in range 0-100000
     * 
     */
    function UniqFileName() {
        $sUniqFileName = date(YmdHis) . rand(1, 100000);
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

        $this->oConnection->oBd->delete($sSchema, $sTable, $sFieldIdFromRequest, $this->aValues[$sFieldIdFromRequest], 'integer');
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
    function postFileSave($sFieldName, $sPath) {
        $sDir = $this->UniqFileName();
        $sPictureDir = $this->aProperties['dir_export'] . $sPath;

        $this->aValues[$sFieldName] = $sDir . "/" . $_FILES[$sFieldName]['name'];

        $sFilePathName = $sPictureDir . $this->aValues[$sFieldName];

        if (!is_dir($sPictureDir . $sDir)) {
            mkdir($sPictureDir . $sDir, 0777, true);
        }

        if (!move_uploaded_file($_FILES[$sFieldName]['tmp_name'], $sFilePathName)) {
            writeToErrorLog(ERROR_0031 . $_FILES[$sFieldName]['name'] . " " . $sFilePathName);
            $aReturn = array(sStatus => 1, sMessage => WORKSPACE_ERROR_COPYING_FILE);
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
        if(!isset($aReturn)){
            $aReturn = array("sStatus" => 1);
        }
        if (!empty($_FILES[$sFieldName])) {
            $sImageDir = $this->aProperties['ws_data_dir'] . '/vitis/'.$sVitisObjectName.'/documents/' . $sId . '/'.$sFieldName.'/' . $_FILES[$sFieldName]["name"];
            $sDirPath = $this->createElementFilesFolder($sVitisObjectName, $sId);
            $sDirColumnPath = $sDirPath . '/'.$sFieldName;
            if (!is_dir($sDirColumnPath)) {
                mkdir($sDirColumnPath, 0777, true);
            }
            $sErrorMessage = uploadFile($sFieldName, "", $sImageDir, $_FILES[$sFieldName]['size'] + 1);
            if ($sErrorMessage != ""){
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
        if(!isset($aReturn)){
            $aReturn = array("sStatus" => 1);
        }
        if (!empty($this->aValues[$sFieldName . "_file"])) {

            $sImageDir = $this->aProperties['ws_data_dir'] . '/vitis/' . $sVitisObjectName . '/documents/' . $sId . '/' . $sFieldName . '/' . $this->aValues[$sFieldName . "_name"];

            // Crée les répertoires si ils n'existent pas
            $sDirPath = $this->createElementFilesFolder($sVitisObjectName, $sId);
            $sDirColumnPath = $sDirPath . '/'.$sFieldName;
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

}

?>
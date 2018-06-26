<?php

require_once __DIR__ . "/../../class/vitis_lib/DbClass.class.inc";
require_once __DIR__ . '/../vitis/Vitis.class.inc';
require_once 'vmlib/logUtil.inc';

class Vmap extends Vitis {

    //Chemin du fichier de ressources contenant les requêtes SQL
    var $sRessourcesFile = "ws/vmap/Vmap.class.sql.inc";

    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        parent::__construct($aPath, $aValues, $properties, $bShortcut, $oConnection);
    }
    
    /**
     * 
     * @param string $sSchema
     * @param string $sTable
     * @param string $aAttributs
     * @param string|array $sFilter
     * @param array $aOptions
     * @param array $aParams
     */
    function vmapGet($sSchema, $sTable, $aAttributs, $sFilter, $aOptions = array(), $aOptionalParams = array()) {

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

        if (is_array($sFilter) || is_object($sFilter)) {
            $sFilter = json_encode($sFilter, true);
        } else if (is_string($sFilter)) {
            $sFilter = $sFilter;
        } else {
            $oError = 'vmapGet: $sFilter type not supported';
            writeToErrorLog('error: ' . $oError);
            return 0;
        }

        // SQL Request building
        $aSqlParams = array(
            'sSchema' => array('value' => $sSchema, 'type' => 'column_name'),
            'sTable' => array('value' => $sTable, 'type' => 'column_name')
        );

        $aSqlParams = array_merge($aSqlParams, $aOptionalParams);

        $sSql = "SELECT ";

        // Set the attributs string
        $sAttributs = "";
        if ($aAttributs[0] == "") {
            $sAttributs = "*";
        } else {
            for ($i = 0; $i < sizeof($aAttributs); $i++) {
                if ($i > 0) {
                    $sAttributs .= ", ";
                }
                if (strpos($aAttributs[$i], "(") == FALSE && strpos($aAttributs[$i], ")") == FALSE && strpos(strtolower($aAttributs[$i]), " as ") == FALSE) {
                    $sAttributKey = 'attribute_' . vitisUniqId();
                    $aSqlParams[$sAttributKey] = array('value' => $aAttributs[$i], 'type' => 'column_name');
                    $sAttributs .= "\"[" . $sAttributKey . "]\"";
                } else {
                    // Attention: Injection possible!
                    $sAttributs .= $aAttributs[$i];
                }
            }
        }
        $sSql .= $sAttributs . " FROM [sSchema].[sTable]";

        if (!empty($sFilter)) {
            // filtre
            $aDecodedFilter = $this->decodeJSONFilter($sFilter, $sSchema, $sTable);

            // Ajout dans la requête
            $sSecuredFilter = $aDecodedFilter['request'];
            // Ajout des paramètres
            foreach ($aDecodedFilter['params'] as $key => $value) {
                $aSqlParams[$key] = $value;
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

        // Options
        foreach ($aOptions as $key => $value) {
            switch (strtoupper($key)) {
                case 'LIMIT':
                    $aSqlParams['limit'] = array('value' => $value, 'type' => 'number');
                    $sSql .= " LIMIT [limit]";
                    break;
                default:
                    break;
            }
        }

        $oResult = $this->oConnection->oBd->executeWithParams($sSql, $aSqlParams);

        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            return $this->oError->aFields;
        }

        if (gettype($oResult) == 'object') {
            $aRecords = Array();
            while ($aLigne = $this->oConnection->oBd->ligneSuivante($oResult)) {
                array_push($aRecords, $aLigne);
            }
        }

        return $aRecords;
    }

    /**
     * 
     * @param string $sSchema
     * @param string $sTable
     * @param string $geom
     * @param array $aAttributs
     * @return type
     */
    function vmapIntersectGet($sSchema, $sTable, $geom, $aAttributs, $iTolerance = 0, $sGeomColumn = 'geom', $sGeomType = 'POLYGON') {

        $sGeomKey = 'geom_key_' . vitisUniqId();
        $aOptionalParams = array(
            $sGeomKey => array('value' => $geom, 'type' => 'geometry'),
            $sGeomColumn => array('value' => $sGeomColumn, 'type' => 'column_name')
        );

        if ($sGeomType === 'POLYGON' || $sGeomType === 'MULTIPOLYGON') {
            $sIntersectPercentage = "round(";
            $sIntersectPercentage .= "ST_Area(";
            $sIntersectPercentage .= "ST_Intersection(";
            $sIntersectPercentage .= "ST_Transform(";
            $sIntersectPercentage .= "ST_GeomFromEWKT([" . $sGeomKey . "]),";
            $sIntersectPercentage .= "ST_SRID([" . $sGeomColumn . "])";
            $sIntersectPercentage .= "), ";
            $sIntersectPercentage .= "[" . $sGeomColumn . "])";
            $sIntersectPercentage .= ")/ST_Area(";
            $sIntersectPercentage .= "ST_Transform(";
            $sIntersectPercentage .= "ST_GeomFromEWKT([" . $sGeomKey . "]),";
            $sIntersectPercentage .= "ST_SRID([" . $sGeomColumn . "])";
            $sIntersectPercentage .= ")";
            $sIntersectPercentage .= ") * 100) as intersect";
        } else if ($sGeomType === 'LINE' || $sGeomType === 'LINESTRING' || $sGeomType === 'MULTILINESTRING') {
            $sIntersectPercentage = "round(";
            $sIntersectPercentage .= "ST_Length(";
            $sIntersectPercentage .= "ST_Intersection(";
            $sIntersectPercentage .= "ST_Transform(";
            $sIntersectPercentage .= "ST_GeomFromEWKT([" . $sGeomKey . "]),";
            $sIntersectPercentage .= "ST_SRID([" . $sGeomColumn . "])";
            $sIntersectPercentage .= "), ";
            $sIntersectPercentage .= "[" . $sGeomColumn . "])";
            $sIntersectPercentage .= ")) as intersect";
        } else {
            $sIntersectPercentage = "100 as intersect";
        }

        array_push($aAttributs, $sIntersectPercentage);
        $sFilter = '{"column":"' . $sGeomColumn . '","compare_operator":"intersect","value":"' . $geom . '"}';

        $aRecords = $this->vmapGet($sSchema, $sTable, $aAttributs, $sFilter, array(), $aOptionalParams);
        $aTolerancedRecords = array();

        for ($i = 0; $i < count($aRecords); $i++) {
            if ($aRecords[$i]['intersect'] >= $iTolerance) {
                array_push($aTolerancedRecords, $aRecords[$i]);
            }
        }
        for ($i = 0; $i < count($aTolerancedRecords); $i++) {
            if ($sGeomType === 'POLYGON' || $sGeomType === 'MULTIPOLYGON') {
                $aTolerancedRecords[$i]['intersect'] = $aTolerancedRecords[$i]['intersect'] . '%';
            } else if ($sGeomType === 'LINE' || $sGeomType === 'LINESTRING' || $sGeomType === 'MULTILINESTRING') {
                $aTolerancedRecords[$i]['intersect'] = $aTolerancedRecords[$i]['intersect'] . 'm';
            } else {
                $aTolerancedRecords[$i]['intersect'] = true;
            }
        }

        return $aTolerancedRecords;
    }

    /**
     * Ajoute la chaîne de caractère au fichier des log vMap.
     * \param $sString Chaîne de caractères.
     */
    function writeMapToVMapLog($sMapId, $sMapName) {
        $sMapName = "\"" . $sMapName . "\"";
        $sLog = $sMapId . $this->aProperties["log_delim"] . $sMapName;
        if (isSet($this->aProperties["log_mode"])) {
            if ($this->aProperties["log_mode"] == true) {
                writeToLog($sLog, $this->aProperties["vmap_map_log_file"]);
            }
        }
    }

}

?>
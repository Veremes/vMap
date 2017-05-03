<?php

require_once 'Vitis.class.inc';
require_once 'GenericQuery.class.inc';
require_once __DIR__ . '/../../class/vmlib/BD.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file PrivateToken.class.inc
 * \class PrivateToken
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the PrivateToken php class
 *
 * This class defines Rest Api to private token
 */
class GenericQuerys extends Vitis {

    public $aSql = array();
    public $oBd;

    /**
     * @SWG\Definition(
     *   definition="/genericquerys",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/genericquerys")
     *   },
     * )
     *  @SWG\Tag(
     *   name="GenericQuerys",
     *   description="Operations about GenericQuerys"
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function __construct($aPath, $aValues, $properties) {
        require_once 'GenericQuerys.class.sql.inc';
        $this->aSql = $aSql;
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
    }

    /**
     * @SWG\Get(path="/genericquerys",
     *   tags={"GenericQuerys"},
     *   summary="Get Querys",
     *   description="Request to query a schema. There is two ways to use this service: with the token witch will use the current server/port/sgbd, with login/password witch can query distant servers",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="login",
     *     in="query",
     *     description="user login",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="password",
     *     in="query",
     *     description="user password",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="server",
     *     in="query",
     *     description="database server",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="port",
     *     in="query",
     *     description="database server port",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sgbd",
     *     in="query",
     *     description="database server sgbd(pgsql/oci)",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="database",
     *     in="query",
     *     description="database to query",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="schema",
     *     in="query",
     *     description="schema to query",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="table",
     *     in="query",
     *     description="table to query",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="filter",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="limit",
     *     in="query",
     *     description="",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/users")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/genericquerys/{table_name}",
     *   tags={"GenericQuerys"},
     *   summary="Get Querys",
     *   description="Request to query a table. There is two ways to use this service: with the token witch will use the current server/port/sgbd, with login/password witch can query distant servers",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="login",
     *     in="query",
     *     description="user login",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="password",
     *     in="query",
     *     description="user password",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="server",
     *     in="query",
     *     description="database server",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="port",
     *     in="query",
     *     description="database server port",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sgbd",
     *     in="query",
     *     description="database server sgbd (pgsql/oci)",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="database",
     *     in="query",
     *     description="database to query",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="schema",
     *     in="query",
     *     description="schema to query",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="table_name",
     *     in="path",
     *     description="table to query",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="encoding",
     *     in="query",
     *     description="table to query",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="order_by",
     *     in="query",
     *     description="list of ordering fields",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sort_order",
     *     in="query",
     *     description="sort order",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="limit",
     *     in="query",
     *     description="number of element",
     *     required=false,
     *     type="integer",
     *     format="int32"
     *   ),
     * @SWG\Parameter(
     *     name="offset",
     *     in="query",
     *     description="index of first element",
     *     required=false,
     *     type="string",
     *     format="int32"
     *   ),
     * @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="list of attributs",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="filter",
     *     in="query",
     *     description="filter results",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="distinct",
     *     in="query",
     *     description="delete duplicates",
     *     required=false,
     *     type="boolean"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/users")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/genericquerys/{table_name}/columns",
     *   tags={"GenericQuerys"},
     *   summary="Get Querys",
     *   description="Request to query. There is two ways to use this service: with the token witch will use the current server/port/sgbd, with login/password witch can query distant servers",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="login",
     *     in="query",
     *     description="user login",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="password",
     *     in="query",
     *     description="user password",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="server",
     *     in="query",
     *     description="database server",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="port",
     *     in="query",
     *     description="database server port",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sgbd",
     *     in="query",
     *     description="database server sgbd (pgsql/oci)",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="database",
     *     in="query",
     *     description="database to query",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="schema",
     *     in="query",
     *     description="schema to query",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="table_name",
     *     in="path",
     *     description="table to query",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="encoding",
     *     in="query",
     *     description="table to query",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/users")
     *     )
     *  )
     */

    /**
     * get Querys
     * @return  Querys
     */
    function GET() {
        if (empty($this->aValues['encoding'])) {
            $this->aValues['encoding'] = "UTF-8";
        }

        if (!empty($this->aValues['token'])) {

            // Connexion par token
            $this->oConnection = new Connection($this->aValues, $this->aProperties);

            if (!empty($this->aValues['table']))
                $this->aPath[2] = $this->aValues['table'];

            $sLogin = $this->aValues['login'];
            if (empty($this->aValues['login']) || $this->aValues['login'] == 'u_vitis')
                $this->aValues['login'] = $this->oConnection->oBd->login;

            if (empty($this->aValues['password']) || $sLogin == 'u_vitis')
                $this->aValues['password'] = $this->oConnection->oBd->mdp;

            if (empty($this->aValues['server']))
                $this->aValues['server'] = $this->oConnection->oBd->serveur;

            if (empty($this->aValues['port']))
                $this->aValues['port'] = $this->oConnection->oBd->port;

            if (empty($this->aValues['database']))
                $this->aValues['database'] = $this->oConnection->oBd->base;

            if (empty($this->aValues['sgbd']))
                $this->aValues['sgbd'] = $this->oConnection->oBd->sgbd;

            if (empty($this->aValues['encoding']))
                $this->aValues['encoding'] = $this->oConnection->oBd->sPageEncoding;
        }
        else {
            if ($this->aValues['login'] == 'u_vitis') {
                $this->aValues['login'] = '';
                $this->aValues['password'] = '';
            }
        }

        $this->oBd = new BD($this->aValues['login'], $this->aValues['password'], $this->aValues['database'], $this->aValues['server'], $this->aValues['port'], $this->aValues['sgbd'], $this->aValues['encoding']);
        if ($this->oBd->erreurRencontree) {
            writeToErrorLog(ERROR_CONNECTION_PROBLEM);
            writeToErrorLog($this->oBd->getBDMessage());
            $oError = new VitisError(1, $this->oBd->sMessage);
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $bXMLError = true;
        } else {
            if (isset($this->aPath[2])) {
                if (!empty($this->aPath[3]) && $this->aPath[3] == "columns") {
                    $this->getTableColumns($this->aValues['schema'], $this->aPath[2]);
                } else {
                    $aDataReturn = $this->getData();
                }
            } else {
                $this->getTables();
            }

            $aXmlRacineAttribute['status'] = $aDataReturn['sStatus'];
            if (!empty($aDataReturn['sMessage']))
                return $aDataReturn['sMessage'];
            else
                $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }
        return $sMessage;
    }

    function getTables() {
        require_once "Table.class.inc";
        $sSql = str_replace('[sSchema]', $this->aValues['schema'], $this->aSql[$this->aValues['sgbd']]['getTables']);
        if (!empty($this->aValues['order_by']))
            $sSql .= ' ORDER BY ' . $this->aValues['order_by'];
        $oPDOresult = $this->oBd->execute($sSql);
        if ($this->oBd->enErreur()) {
            $oError = new VitisError(1, $this->oBd->getBDMessage());
            writeToErrorLog($this->oBd->getBDMessage());
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            while ($aTable = $this->oBd->ligneSuivante($oPDOresult))
                array_push($this->aObjects, new Table($aTable));
        }
        return $aFields;
    }

    function getTableColumns($sSchema, $sTable) {
        require_once "Column.class.inc";
        $sSql = str_replace('[sSchema]', $sSchema, $this->aSql[$this->aValues['sgbd']]['getTableColumns']);
        $sSql = str_replace('[sTable]', $sTable, $sSql);
        $oPDOresult = $this->oBd->execute($sSql);
        if ($this->oBd->enErreur()) {
            $oError = new VitisError(1, $this->oBd->getBDMessage());
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            while ($aColumn = $this->oBd->ligneSuivante($oPDOresult))
                array_push($this->aObjects, new Column($aColumn));
        }
        return $aFields;
    }

    function tableColumns() {
        require_once "Column.class.inc";
        $aColumn = [];
        $sSql = str_replace('[sSchema]', $this->aValues['schema'], $this->aSql[$this->aValues['sgbd']]['getTableColumns']);

        $sSql = str_replace('[sTable]', $this->aPath[2], $sSql);
        
        $oResult = $this->oBd->execute($sSql);
        if (!empty($oResult)) {
            while ($aObject = $this->oBd->ligneSuivante($oResult)) {
                if ($aObject['data_type'] != 'SDO_GEOMETRY' && $aObject['data_type'] != 'geometry') {
                    array_push($aColumn, $aObject['column_name']);
                }
            }
            foreach ($this->aSelectedFields as $fields) {

                if (strpos($fields, "(") != FALSE && strpos($fields, ")") != FALSE && strpos(strtolower($fields), " as ") != FALSE) {
                    array_push($aColumn, $fields);
                }
            }
        }
        $oResult = $this->oBd->fermeResultat();
        return $aColumn;
    }

    function getData($bOnlyReturnStatus = false) {
        //ne gère pas les données géométriques
        $sSql = "SELECT ";
        if ($this->aValues['distinct'] == "true") {
            $sSql .= "DISTINCT ";
        }
        $aColumn = $this->tableColumns();
                
        $aFieldInTable = [];
        //manque la gestion du param attribut
        $aAttribute = explode("|", $this->aValues['attributs']);
        foreach ($aColumn as $value) {
            if (in_array($value, $aAttribute) || empty($this->aValues['attributs'])) {
                array_push($aFieldInTable, '"' . $value . '"');
            }
        }
        if (!empty($aFieldInTable)) {

            foreach ($aFieldInTable as $fields) {
                if ($sSql == "SELECT " || $sSql == "SELECT DISTINCT ") {
                    $sSql .= $fields;
                } else {
                    $sSql .= ", " . $fields;
                }
            }
        }else{
            $sSql = "SELECT * ";
        }
        $sSql .= " FROM " . $this->aValues['schema'] . "." . $this->aPath[2];
        if (isset($this->aValues['filter'])) {
            if (strpos($sSql, " WHERE ") == FALSE) {
                $sSql .= " WHERE " . $this->aValues['filter'];
            } else {
                $sSql .= " AND " . $this->aValues['filter'];
            }
        }
        //order by
        //limit
        switch ($this->aValues['sgbd']) {
            case "oci":
                if (isset($this->aValues['limit']) && isset($this->aValues['offset'])) {
                    $this->aValues['limit'] = $this->aValues['limit'] + $this->aValues['offset'];
                    /* if (strpos($sSql, " WHERE ") == FALSE) {
                      $sSql.= " WHERE and (rownum < " . $this->aValues['limit'] . " AND rownum > " . $this->aValues['limit'] . ")";
                      } else {
                      $sSql.= " and (rownum < " . $this->aValues['limit'] . " AND rownum > " . $this->aValues['offset'] . ")";
                      } */
                }
                /* if (isset($this->aValues['offset'])) {
                  if (strpos($sSql, " WHERE ") == FALSE) {
                  $sSql.= " WHERE and rownum > " . $this->aValues['offset'];
                  } else {
                  $sSql.= " AND rownum > " . $this->aValues['offset'];
                  }
                  } */
                if (isset($this->aValues['limit'])) {
                    if (strpos($sSql, " WHERE ") == FALSE) {
                        $sSql .= " WHERE rownum <= " . $this->aValues['limit'];
                    } else {
                        $sSql .= " AND rownum <= " . $this->aValues['limit'];
                    }
                }

                //offset

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
                break;
            default:
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
                if (isset($this->aValues['limit'])) {
                    $sSql .= " LIMIT " . $this->aValues['limit'];
                }
                //offset
                if (isset($this->aValues['offset'])) {
                    $sSql .= " OFFSET " . $this->aValues['offset'];
                }
                break;
        }

        $oPDOresult = $this->oBd->execute($sSql);

        if ($this->oBd->enErreur()) {
            $oError = new VitisError(1, $this->oBd->getBDMessage());
        } else {
            while ($aLigne = $oPDOresult->fetch(PDO::FETCH_ASSOC)) {

                $oObject = new GenericQuery($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
                $oObject->aFields = $aLigne;
                array_push($this->aObjects, $oObject);
            }
            $this->aFields['list_count'] = $this->oBd->nombreLigne($oPDOresult);
            $sSql = "select count(*) as \"total_row_number\" FROM " . $this->aValues['schema'] . "." . $this->aPath[2];
            if (isset($this->aValues['filter'])) {

                //$aFilter = explode("|", $this->aValues['filter']);

                if (strpos($sSql, " WHERE ") == FALSE) {
                    $sSql .= " WHERE " . $this->aValues['filter'];
                } else {
                    $sSql .= " AND " . $this->aValues['filter'];
                }
            }
        }

        $oPDOresult = $this->oBd->execute($sSql);

        if ($this->oBd->enErreur()) {
            $oError = new VitisError(1, $this->oBd->getBDMessage());
        } else {
            $aLigne = $this->oBd->ligneSuivante($oPDOresult);
            $this->aFields['total_row_number'] = $aLigne['total_row_number'];
        }

        if (isset($oError)) {
            $aXmlRacineAttribute['status'] = 0;
            if (!$bOnlyReturnStatus)
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            $aXmlRacineAttribute['status'] = 1;
            if (!$bOnlyReturnStatus)
                $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }

        if (!$bOnlyReturnStatus)
            $aReturn = array('sStatus' => $aXmlRacineAttribute['status'], "sMessage" => $sMessage);
        else
            $aReturn = array('sStatus' => $aXmlRacineAttribute['status']);
        return $aReturn;
    }

}

?>
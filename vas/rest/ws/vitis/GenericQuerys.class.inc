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
        require 'GenericQuerys.class.sql.inc';
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
     * @SWG\Get(path="/genericquerys/databases",
     *   tags={"GenericQuerys"},
     *   summary="Get Querys",
     *   description="Get the dtabases list",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/users")
     *   )
     * )
     */
    /**
     * @SWG\Get(path="/genericquerys/{database}/schemas",
     *   tags={"GenericQuerys"},
     *   summary="Get Querys",
     *   description="Get the database schemas",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="database",
     *     in="path",
     *     description="database",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/users")
     *   )
     * )
     */

    /**
     * get Querys
     * @return  Querys
     */
    function GET() {
        $aDataReturn = array('sStatus' => 0);
        if (empty($this->aValues['encoding'])) {
            $this->aValues['encoding'] = "UTF-8";
        }

        if (!empty($this->aValues['token'])) {

            // Connexion par token
            $this->oConnection = new Connection($this->aValues, $this->aProperties);

            if (!empty($this->aValues['table']))
                $this->aPath[2] = $this->aValues['table'];

            $sLogin = '';
            if (!empty($this->aValues['login']))
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
                if ($this->aPath[2] == "databases") {
                    $this->getDatabases();
                } else {
                    if (!empty($this->aPath[3]) && $this->aPath[3] == "schemas") {
                        $this->getSchemas($this->aPath[2]);
                        $aDataReturn = array('sStatus' => 1);
                    } else if (!empty($this->aPath[3]) && $this->aPath[3] == "columns") {
                        $this->getTableColumns($this->aValues['schema'], $this->aPath[2]);
                        $aDataReturn = array('sStatus' => 1);
                    } else {
                        $aDataReturn = $this->getData();
                    }
                }
            } else {
                $this->getTables($this->aValues['schema']);
                $aDataReturn = array('sStatus' => 1);
            }
            $aXmlRacineAttribute['status'] = $aDataReturn['sStatus'];
            if (!empty($aDataReturn['sMessage']))
                return $aDataReturn['sMessage'];
            else
                $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }
        return $sMessage;
    }

    /**
     * Display the databases 
     * @param type $sdatabases
     */
    function getDatabases() {
        require_once 'Database.class.inc';
        $sSql = $this->aSql[$this->aValues['sgbd']]['getDatabases'];
        $aSQLParams = array();
        $oPDOresult = $this->oBd->executeWithParams($sSql, $aSQLParams);
        if ($this->oBd->enErreur()) {
            $oError = new VitisError(1, $this->oBd->getBDMessage());
            writeToErrorLog($this->oBd->getBDMessage());
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            while ($aDatabase = $this->oBd->ligneSuivante($oPDOresult)) {
                array_push($this->aObjects, new Database($aDatabase));
            }
        }
    }

    /**
     * Get the schemas list
     * @param String $sDatabase
     */
    function getSchemas($sDatabase) {
        require_once 'Schema.class.inc';
        $this->oBd = new BD($this->aValues['login'], $this->aValues['password'], $sDatabase, $this->aValues['server'], $this->aValues['port'], $this->aValues['sgbd'], $this->aValues['encoding']);
        $sSql = $this->aSql[$this->aValues['sgbd']]['getSchemas'];
        $aSQLParams = array();
        $oPDOresult = $this->oBd->executeWithParams($sSql, $aSQLParams);
        if ($this->oBd->enErreur()) {
            $oError = new VitisError(1, $this->oBd->getBDMessage());
            writeToErrorLog($this->oBd->getBDMessage());
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            while ($aSchema = $this->oBd->ligneSuivante($oPDOresult)) {
                array_push($this->aObjects, new Schema($aSchema));
            }
        }
    }

    /**
     * Display the tables contained in the $sSchema param
     * @param type $sSchema
     */
    function getTables($sSchema) {
        require_once "Table.class.inc";

        $sSql = $this->aSql[$this->aValues['sgbd']]['getTables'];
        $aSQLParams = array('sSchema' => array('value' => $sSchema, 'type' => 'column_name'));

        if (!empty($this->aValues['order_by'])) {
            $aSQLParams['order_by'] = array('value' => $this->aValues['order_by'], 'type' => 'column_name');
            $sSql .= ' ORDER BY "[order_by]"';
        }

        $oPDOresult = $this->oBd->executeWithParams($sSql, $aSQLParams);
        if ($this->oBd->enErreur()) {
            $oError = new VitisError(1, $this->oBd->getBDMessage());
            writeToErrorLog($this->oBd->getBDMessage());
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            while ($aTable = $this->oBd->ligneSuivante($oPDOresult)) {
                array_push($this->aObjects, new Table($aTable));
            }
        }
    }

    /**
     * Display the columns contained in the $sSchema, $sTable param
     * @param type $sSchema
     * @param type $sTable
     */
    function getTableColumns($sSchema, $sTable) {
        require_once "Column.class.inc";

        $sSql = $this->aSql[$this->aValues['sgbd']]['getTableColumns'];
        $aSQLParams = array(
            'sSchema' => array('value' => $sSchema, 'type' => 'column_name'),
            'sTable' => array('value' => $sTable, 'type' => 'column_name')
        );

        $oPDOresult = $this->oBd->executeWithParams($sSql, $aSQLParams);
        if ($this->oBd->enErreur()) {
            $oError = new VitisError(1, $this->oBd->getBDMessage());
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            while ($aColumn = $this->oBd->ligneSuivante($oPDOresult))
                array_push($this->aObjects, new Column($aColumn));
        }
    }

    /**
     * Get the table columns with $this->aSelectedFields  and returns an array
     * @param type $sSchema
     * @param type $sTable
     * @return array
     */
    function tableColumns($sSchema, $sTable) {
        require_once "Column.class.inc";
        $aColumn = [];

        $sSql = $this->aSql[$this->aValues['sgbd']]['getTableColumns'];
        $aSQLParams = array(
            'sSchema' => array('value' => $sSchema, 'type' => 'column_name'),
            'sTable' => array('value' => $sTable, 'type' => 'column_name')
        );

        $oResult = $this->oBd->executeWithParams($sSql, $aSQLParams);
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

    /**
     * Display the result from the requested query
     * Ne gère pas les données géométriques !
     * @param type $bOnlyReturnStatus
     * @return int
     */
    function getData($bOnlyReturnStatus = false) {

        $sSchema = $this->aValues['schema'];
        $sTable = $this->aPath[2];

        $aSQLParams = array(
            'sSchema' => array('value' => $sSchema, 'type' => 'column_name'),
            'sTable' => array('value' => $sTable, 'type' => 'column_name')
        );

        if (isset($this->aValues['limit'])) {
            $aSQLParams['limit'] = array('value' => $this->aValues['limit'], 'type' => 'number');
        }
        if (isset($this->aValues['offset'])) {
            $aSQLParams['offset'] = array('value' => $this->aValues['offset'], 'type' => 'number');
        }
        if (isset($this->aValues['sort_order'])) {
            $aSQLParams['sort_order'] = array('value' => $this->aValues['sort_order'], 'type' => 'column_name');
        }


        $sSql = "SELECT ";
        if ($this->aValues['distinct'] == "true") {
            $sSql .= "DISTINCT ";
        }
        $aColumn = $this->tableColumns($sSchema, $sTable);

        $aFieldInTable = [];
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
        } else {
            $sSql = "SELECT * ";
        }
        $sSql .= ' FROM "[sSchema]"."[sTable]"';

        if (isset($this->aValues['filter'])) {
            // filtre
            $aDecodedFilter = $this->decodeJSONFilter($this->aValues['filter'], $sSchema, $sTable);
            // Ajout dans la requête
            $sSecuredFilter = $aDecodedFilter['request'];
            // Ajout des paramètres
            foreach ($aDecodedFilter['params'] as $key => $value) {
                $aSQLParams[$key] = $value;
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
        //order by
        //limit
        switch ($this->aValues['sgbd']) {
            case "oci":
                if (isset($this->aValues['limit']) && isset($this->aValues['offset'])) {
                    $this->aValues['limit'] = $this->aValues['limit'] + $this->aValues['offset'];
                }
                if (isset($this->aValues['limit'])) {
                    if (strpos($sSql, " WHERE ") == FALSE) {
                        $sSql .= " WHERE rownum <= [limit]";
                    } else {
                        $sSql .= " AND rownum <= [limit]";
                    }
                }

                //offset
                if (isset($this->aValues['order_by'])) {
                    $aOrder = explode("|", $this->aValues['order_by']);
                    foreach ($aOrder as $value) {

                        $sOrderKey = 'order_by_' . vitisUniqId();
                        $aSQLParams[$sOrderKey] = array('value' => $value, 'type' => 'column_name');

                        if (strpos($sSql, "ORDER BY") == FALSE) {
                            $sSql .= " ORDER BY " . str_replace("=", " ", "\"[" . $sOrderKey . "]\"");
                        } else {
                            $sSql .= ", " . str_replace("=", " ", "\"[" . $sOrderKey . "]\"");
                        }
                    }
                    if (isset($this->aValues['sort_order'])) {
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
                break;
            default:
                if (isset($this->aValues['order_by'])) {
                    $aOrder = explode("|", $this->aValues['order_by']);

                    foreach ($aOrder as $value) {

                        $sOrderKey = 'order_by_' . vitisUniqId();
                        $aSQLParams[$sOrderKey] = array('value' => $value, 'type' => 'column_name');

                        if (strpos($sSql, "ORDER BY") == FALSE) {
                            $sSql .= " ORDER BY " . str_replace("=", " ", "\"[" . $sOrderKey . "]\"");
                        } else {
                            $sSql .= ", " . str_replace("=", " ", "\"[" . $sOrderKey . "]\"");
                        }
                    }
                    if (isset($this->aValues['sort_order'])) {
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
                if (isset($this->aValues['limit'])) {
                    $sSql .= " LIMIT [limit]";
                }
                //offset
                if (isset($this->aValues['offset'])) {
                    $sSql .= " OFFSET [offset]";
                }
                break;
        }
        $oPDOresult = $this->oBd->executeWithParams($sSql, $aSQLParams);

        if ($this->oBd->enErreur()) {
            $oError = new VitisError(1, $this->oBd->getBDMessage());
        } else {
            while ($aLigne = $oPDOresult->fetch(PDO::FETCH_ASSOC)) {
                $oObject = new GenericQuery($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
                $oObject->aFields = $aLigne;
                array_push($this->aObjects, $oObject);
            }
            $this->aFields['list_count'] = $this->oBd->nombreLigne($oPDOresult);

            $aSQLParams2 = array(
                'sSchema' => array('value' => $sSchema, 'type' => 'column_name'),
                'sTable' => array('value' => $sTable, 'type' => 'column_name')
            );

            $sSql = 'select count(*) as "total_row_number" FROM "[sSchema]"."[sTable]"';

            if (isset($this->aValues['filter'])) {
                // filtre
                $aDecodedFilter = $this->decodeJSONFilter($this->aValues['filter'], $sSchema, $sTable);
                // Ajout dans la requête
                $sSecuredFilter = $aDecodedFilter['request'];
                // Ajout des paramètres
                foreach ($aDecodedFilter['params'] as $key => $value) {
                    $aSQLParams2[$key] = $value;
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
        }
        $oPDOresult = $this->oBd->executeWithParams($sSql, $aSQLParams2);

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
<?php

/**
 * \file Querys.class.inc
 * \class Querys
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the Querys php class
 *
 * This class defines Rest Api to Vitis querys
 * 
 */
require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once 'Query.class.inc';
require_once 'BusinessObject.class.inc';
require_once(__DIR__ . '/../../class/vmlib/BdDataAccess.inc');
require_once(__DIR__ . '/../../class/vmlib/phpUtil.inc');
require_once 'vmlib/logUtil.inc';

require_once __DIR__ . '/../../class/vmlib/Vm.class.inc';
require_once __DIR__ . '/../../class/vmlib/BD.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

class Querys extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/Querys",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/Querys")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Querys",
     *   description="Operations about querying business objects"
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $bShortcut false to reinit variables
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->aValues['getGroup'] = false;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
    }

    /**
     * @SWG\Get(path="/querys/{business_object_id}/summary",
     *   tags={"Querys"},
     *   summary="Get business object summary querys",
     *   description="Request to get summary querys of a business object",
     *   operationId="GET",
     *   produces={"application/json", "application/x-vm-json"},
     *  @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="business_object_id",
     *     in="path",
     *     description="business object id",
     *     required=true,
     *     type="integer"
     *   ),
     * @SWG\Parameter(
     *     name="filter",
     *     in="query",
     *     description="filter",
     *     required=false,
     *     type="string",
     *     format="string"
     *   ),
     * @SWG\Parameter(
     *     name="intersect_geom",
     *     in="query",
     *     description="geom to intersect",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="intersect_column",
     *     in="query",
     *     description="column to intersect | Undefined",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="intersect_buffer",
     *     in="query",
     *     description="intersection buffer",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="get_geom",
     *     in="query",
     *     description="true if you want to get the geometry",
     *     required=false,
     *     type="boolean",
     *   ),
     * @SWG\Parameter(
     *     name="get_image",
     *     in="query",
     *     description="true if you want to get the image",
     *     required=false,
     *     type="boolean",
     *   ),
     * @SWG\Parameter(
     *     name="geom_field",
     *     in="query",
     *     description="geom to return | Undefined",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="result_srid",
     *     in="query",
     *     description="geom projetion in result | Undefined",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="limit",
     *     in="query",
     *     description="number of element",
     *     required=false,
     *     type="integer"
     *   ),
     * @SWG\Parameter(
     *     name="offset",
     *     in="query",
     *     description="index of first element",
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
     * @SWG\Get(path="/querys/{business_object_id}/list",
     *   tags={"Querys"},
     *   summary="Get business object list querys",
     *   description="Request to get list querys of a business object",
     *   operationId="GET",
     *   produces={"application/json", "application/x-vm-json"},
     *  @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="business_object_id",
     *     in="path",
     *     description="business object id",
     *     required=true,
     *     type="integer"
     *   ),
     * @SWG\Parameter(
     *     name="filter",
     *     in="query",
     *     description="filter",
     *     required=false,
     *     type="string",
     *     format="string"
     *   ),
     * @SWG\Parameter(
     *     name="intersect_geom",
     *     in="query",
     *     description="geom to intersect",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="intersect_column",
     *     in="query",
     *     description="column to intersect | Undefined",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="intersect_buffer",
     *     in="query",
     *     description="intersection buffer",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="get_geom",
     *     in="query",
     *     description="true if you want to get the geometry",
     *     required=false,
     *     type="boolean",
     *   ),
     * @SWG\Parameter(
     *     name="get_image",
     *     in="query",
     *     description="true if you want to get the image",
     *     required=false,
     *     type="boolean",
     *   ),
     * @SWG\Parameter(
     *     name="geom_field",
     *     in="query",
     *     description="geom to return | Undefined",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="result_srid",
     *     in="query",
     *     description="geom projetion in result | Undefined",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="limit",
     *     in="query",
     *     description="number of element",
     *     required=false,
     *     type="integer",
     *     default="4"
     *   ),
     * @SWG\Parameter(
     *     name="offset",
     *     in="query",
     *     description="index of first element",
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
     * @SWG\Get(path="/querys/{business_object_id}/form",
     *   tags={"Querys"},
     *   summary="Get business object form querys",
     *   description="Request to get the form querys of a business object",
     *   operationId="GET",
     *   produces={"application/json", "application/x-vm-json"},
     *  @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="business_object_id",
     *     in="path",
     *     description="business object id",
     *     required=true,
     *     type="integer"
     *   ),
     * @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="attributs",
     *     required=false,
     *     type="string",
     *     format="string"
     *   ),
     * @SWG\Parameter(
     *     name="filter",
     *     in="query",
     *     description="filter",
     *     required=false,
     *     type="string",
     *     format="string"
     *   ),
     * @SWG\Parameter(
     *     name="intersect_geom",
     *     in="query",
     *     description="geom to intersect",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="intersect_column",
     *     in="query",
     *     description="column to intersect | Undefined",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="intersect_buffer",
     *     in="query",
     *     description="intersection buffer",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="get_geom",
     *     in="query",
     *     description="true if you want to get the geometry",
     *     required=false,
     *     type="boolean",
     *   ),
     * @SWG\Parameter(
     *     name="get_image",
     *     in="query",
     *     description="true if you want to get the image",
     *     required=false,
     *     type="boolean",
     *   ),
     * @SWG\Parameter(
     *     name="geom_field",
     *     in="query",
     *     description="geom to return | Undefined",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="result_srid",
     *     in="query",
     *     description="geom projetion in result | Undefined",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="limit",
     *     in="query",
     *     description="number of element",
     *     required=false,
     *     type="integer"
     *   ),
     * @SWG\Parameter(
     *     name="offset",
     *     in="query",
     *     description="index of first element",
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
     * @SWG\Get(path="/querys/{business_object_id}/table",
     *   tags={"Querys"},
     *   summary="Get business object form querys",
     *   description="Request to get the form querys of a business object",
     *   operationId="GET",
     *   produces={"application/json", "application/x-vm-json"},
     *  @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="business_object_id",
     *     in="path",
     *     description="business object id",
     *     required=true,
     *     type="integer"
     *   ),
     * @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="attributs",
     *     required=false,
     *     type="string",
     *     format="string"
     *   ),
     * @SWG\Parameter(
     *     name="filter",
     *     in="query",
     *     description="filter",
     *     required=false,
     *     type="string",
     *     format="string"
     *   ),
     * @SWG\Parameter(
     *     name="intersect_geom",
     *     in="query",
     *     description="geom to intersect",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="intersect_column",
     *     in="query",
     *     description="column to intersect | Undefined",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="intersect_buffer",
     *     in="query",
     *     description="intersection buffer",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="get_geom",
     *     in="query",
     *     description="true if you want to get the geometry",
     *     required=false,
     *     type="boolean",
     *   ),
     * @SWG\Parameter(
     *     name="get_image",
     *     in="query",
     *     description="true if you want to get the image",
     *     required=false,
     *     type="boolean",
     *   ),
     * @SWG\Parameter(
     *     name="geom_field",
     *     in="query",
     *     description="geom to return | Undefined",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="result_srid",
     *     in="query",
     *     description="geom projetion in result | Undefined",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="limit",
     *     in="query",
     *     description="number of element",
     *     required=false,
     *     type="integer"
     *   ),
     * @SWG\Parameter(
     *     name="offset",
     *     in="query",
     *     description="index of first element",
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
     * @SWG\Get(path="/querys/{business_object_id}/geometry",
     *   tags={"Querys"},
     *   summary="Get business object form querys",
     *   description="Request to get the form querys of a business object",
     *   operationId="GET",
     *   produces={"application/json", "application/x-vm-json"},
     *  @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="business_object_id",
     *     in="path",
     *     description="business object id",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Parameter(
     *     name="intersect_geom",
     *     in="query",
     *     description="EWKT intersect geometry",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Parameter(
     *     name="snapping_mode",
     *     in="query",
     *     description="Snapping mode (segment_edge_node, edge_node, node)",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="snapping_limit",
     *     in="query",
     *     description="Returned objets limit",
     *     required=false,
     *     type="integer"
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
    function GET($bOnlyReturnStatus = FALSE) {
        if (isset($this->aPath[3]) && ($this->aPath[3] == 'geometry')) {
            return $this->getBoGeomsFromIntersect($this->aPath[2]);
        } else if (isset($this->aPath[3])) {
            return $this->queryBusinessObject($this->aPath[3]);
        } else {
            return $this->queryBusinessObject('form', true);
        }
    }

    /**
     * Query the business object
     * @param string $type
     * @param boolean $bOnlyResult
     * @return array
     */
    function queryBusinessObject($type, $bOnlyResult = false) {
        require $this->sRessourcesFile;

        if (!empty($this->oConnection->oError)) {
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $this->oConnection->oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $aReturn = array('sStatus' => $aXmlRacineAttribute['status'], "sMessage" => $sMessage);
            return $aReturn['sMessage'];
        }

        // Objet BusinessObject correspondant
        $oBusinessObject = new BusinessObject($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
        $oBusinessObject->GET();

        $date = new DateTime();

        // Paramètres retenus dans l'url
        $filter = !empty($this->aValues['filter']) ? $this->aValues['filter'] : '';
        $intersect_geom = !empty($this->aValues['intersect_geom']) ? $this->aValues['intersect_geom'] : '';
        $intersect_column = !empty($this->aValues['intersect_column']) ? $this->aValues['intersect_column'] : '';
        $intersect_buffer = !empty($this->aValues['intersect_buffer']) ? $this->aValues['intersect_buffer'] : '';
        $get_geom = !empty($this->aValues['get_geom']) ? $this->aValues['get_geom'] : '';
        $get_image = !empty($this->aValues['get_image']) ? $this->aValues['get_image'] : '';
        $result_srid = !empty($this->aValues['result_srid']) ? $this->aValues['result_srid'] : '';
        $geom_field = !empty($this->aValues['geom_field']) ? $this->aValues['geom_field'] : '';
        $limit = !empty($this->aValues['limit']) ? $this->aValues['limit'] : '';
        $offset = !empty($this->aValues['offset']) ? $this->aValues['offset'] : '';
        $order_by = !empty($this->aValues['order_by']) ? $this->aValues['order_by'] : '';
        $sort_order = !empty($this->aValues['sort_order']) ? $this->aValues['sort_order'] : '';

        // Paramètres retenus dans le business object
        $geom_column = $oBusinessObject->aFields['geom_column'];
        $bo_id_field = $oBusinessObject->aFields['id_field'];
        $bo_title = $oBusinessObject->aFields['title'];
        $bo_formtitle = $oBusinessObject->aFields['formtitle'];
        $bo_summarytitle = $oBusinessObject->aFields['summarytitle'];
        $bo_id = $oBusinessObject->aFields['business_object_id'];
        $database = $oBusinessObject->aFields['database'];
        $schema = $oBusinessObject->aFields['schema'];
        $table = $oBusinessObject->aFields['table'];
        $add_form_size = $oBusinessObject->aFields['add_form_size'];
        $edit_form_size = $oBusinessObject->aFields['edit_form_size'];
        $display_form_size = $oBusinessObject->aFields['display_form_size'];
        $aParams = array();

        // Base de données
        if (!empty($database) && $database != $this->oConnection->oBd->base) {
            $this->oConnection->oBd = new Vm($this->oConnection->oBd->login, $this->oConnection->oBd->mdp, $database, $this->oConnection->oBd->serveur, $this->oConnection->oBd->port, $this->oConnection->oBd->sgbd, $this->oConnection->oBd->sPageEncoding);
        }

        // Chaine sql
        if ($type === 'form' || $type === 'table') {
            $sSql = 'SELECT * FROM "[sSchema]"."[sTable]"';
            $aParams['sSchema'] = array('value' => $schema, 'type' => 'schema_name');
            $aParams['sTable'] = array('value' => $table, 'type' => 'table_name');
        } else {
            $sSql = $oBusinessObject->aFields['sql_' . $type];
        }

        // Valeurs par défaut
        $intersect_column = empty($intersect_column) ? $geom_column : $intersect_column;
//        $intersect_buffer = empty($intersect_buffer) ? 0.01 : $intersect_buffer;
        $geom_field = empty($geom_field) ? $intersect_column : $geom_field;
        $get_geom = empty($geom_field) || empty($get_geom) ? false : $get_geom;
        $use_intersect = empty($intersect_geom) || empty($intersect_column) ? false : true;
        $get_image = empty($get_image) ? false : $get_image;

        if (isset($oError)) {
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $aReturn = array('sStatus' => $aXmlRacineAttribute['status'], "sMessage" => $sMessage);
            return $aReturn['sMessage'];
        }

        // Position des attributs dans la requête
        $iAttributesPos = $this->getAttributsPosition($sSql);

        // Intersection
        if ($use_intersect === true) {

            // Projection de la colonne intersectée
            $intersect_column_proj = $this->getColumnProjection($sSql, $iAttributesPos, $intersect_column);

            if (empty($intersect_column_proj)) {
                $intersect_column_proj = '2154';
            }

            $aIntersectOperator = array(
                'column' => $intersect_column,
                'compare_operator' => 'intersect',
                'compare_operator_options' => array(
                    'source_proj' => $intersect_column_proj,
                    'intersect_buffer' => $intersect_buffer,
                    'intersect_buffer_geom_type' => "point|line",
                ),
                'value' => $intersect_geom
            );

            $filter = $this->addFilterOperator($filter, $aIntersectOperator);
        }

        // filtre
        $aDecodedFilter = $this->decodeJSONFilter($filter, $schema, $table);

        // Ajout dans la requête
        $sSecuredFilter = $aDecodedFilter['request'];
        // Ajout des paramètres
        foreach ($aDecodedFilter['params'] as $key => $value) {
            $aParams[$key] = $value;
        }

        // Début de la requête
        $aParams['bo_id_field'] = array('value' => $bo_id_field, 'type' => 'column_name');
        $sSql = substr_replace($sSql, ' "[bo_id_field]" as bo_id_value,', $iAttributesPos, 0);

        if ($get_geom === true || $get_geom === 'true') {
            $aParams['geom_field'] = array('value' => $geom_field, 'type' => 'column_name');
            if (!empty($result_srid)) {
                $aParams['result_srid'] = array('value' => $result_srid, 'type' => 'integer');
                $geom_field_geojson = 'ST_AsEWKT(ST_Transform([geom_field], [result_srid]::integer)) as bo_intersect_geom';
            } else {
                $geom_field_geojson = 'ST_AsEWKT([geom_field]) as bo_intersect_geom';
            }
            $sSql = substr_replace($sSql, ' ' . $geom_field_geojson . ',', $iAttributesPos, 0);
        }

        // Récupère le nombre d'enregistrements disponibles avec ce filtre
        $iTotalRowNumber = $this->getTotalRowNumber($schema, $table, $sSecuredFilter, $aParams);

        // Fin de la requête
        if (!empty($sSecuredFilter) && strlen($sSecuredFilter) > 1) {
            $sSql .= ' WHERE ' . $sSecuredFilter;
        }
        if (!empty($order_by)) {
            $sSql .= ' ORDER BY [order_by]';
            $aParams['order_by'] = array('value' => $order_by, 'type' => 'double_quote');
            if (!empty($sort_order)) {
                $sSql .= ' [sort_order]';
                $aParams['sort_order'] = array('value' => $sort_order, 'type' => 'column_name');
            }
        }
        if (!empty($limit)) {
            $sSql .= ' LIMIT [limit]';
            $aParams['limit'] = array('value' => $limit, 'type' => 'string');
        }
        if (!empty($offset)) {
            $sSql .= ' OFFSET [offset]';
            $aParams['offset'] = array('value' => $offset, 'type' => 'string');
        }

        // Execute la requête
        $this->aValues['my_vitis_id'] = "";

        $oResult = $this->oConnection->oBd->executeWithParams($sSql, $aParams);

        if ($this->oConnection->oBd->enErreur()) {
            $aXmlRacineAttribute['status'] = 0;
            writeToErrorLog($this->oConnection->oBd->getBDMessage());
            $oError = new VitisError(2, $this->oConnection->oBd->getBDMessage());
        } else {
            if (!$this->oConnection->oBd->enErreur() && $this->oConnection->oBd->nombreLigne($oResult) > 0) {
                while ($aLigne = $this->oConnection->oBd->ligneSuivante($oResult)) {

                    if ($type !== 'table') {

                        // Image à la une                        
                        if ($get_image === true || $get_image === 'true') {
                            if (isset($aLigne['[bo_image]'])) {
                                $aLigne['bo_image_path'] = $this->aProperties['web_server_name'] . '/' . $this->aProperties['ws_data_alias'] . '/vitis/' . $bo_id . '/documents/' . $aLigne['bo_id_value'] . '/image/' . $aLigne['[bo_image]'] . "?d=" . $date->getTimestamp();
                                unset($aLigne['[bo_image]']);
                            }
                        }

                        // Permet de récupérer la liste des éléments, leur ordre et leur valeur
                        $aLigne['bo_' . $type . '_attributs'] = Array();
                        $aLigne['bo_' . $type] = Array();
                        foreach ($aLigne as $key => $value) {
                            if (substr($key, 0, 3) !== 'bo_') {
                                array_push($aLigne['bo_' . $type . '_attributs'], $key);
                                $aLigne['bo_' . $type][$key] = $value;
                                unset($aLigne[$key]);
                            }
                        }

                        if (isset($aLigne['bo_' . $type][$geom_column])) {
                            unset($aLigne['bo_' . $type][$geom_column]);
                        }

                        // Si on désire uniquement le résultat
                        if ($bOnlyResult === true) {
                            $aResult = $aLigne['bo_' . $type];
                            if (isset($aLigne['bo_intersect_geom'])) {
                                $aResult[$geom_column] = $aLigne['bo_intersect_geom'];
                            }
                            $aLigne = $aResult;
                        } else {


                            // Récupère le forulaire JSON
                            if ($type === 'form') {
                                $jsonContent = file_get_contents($this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $bo_id . '/forms/published.json');
                                if (is_file($this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $bo_id . '/forms/ressources/published.js')) {
                                    $jsContent = file_get_contents($this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $bo_id . '/forms/ressources/published.js');
                                } else {
                                    $jsContent = false;
                                }
                                if (is_file($this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $bo_id . '/forms/ressources/published.css')) {
                                    $cssContent = file_get_contents($this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $bo_id . '/forms/ressources/published.css');
                                } else {
                                    $cssContent = false;
                                }

                                if ($jsContent !== false)
                                    $js = $this->aProperties['web_server_name'] . '/' . $this->aProperties['ws_data_alias'] . '/vmap/business_object/' . $bo_id . '/forms/ressources/published.js' . "?d=" . $date->getTimestamp();
                                if ($cssContent !== false)
                                    $css = $this->aProperties['web_server_name'] . '/' . $this->aProperties['ws_data_alias'] . '/vmap/business_object/' . $bo_id . '/forms/ressources/published.css' . "?d=" . $date->getTimestamp();

                                $aLigne['bo_json_form'] = json_decode($jsonContent);
                                $aLigne['bo_json_form_js'] = $js;
                                $aLigne['bo_json_form_css'] = $css;
                            }

                            // Attributs métier
                            $aLigne['bo_type'] = $bo_id;
                            $aLigne['bo_title'] = $bo_title;
                            $aLigne['bo_formtitle'] = $bo_formtitle;
                            $aLigne['bo_summarytitle'] = $bo_summarytitle;
                            $aLigne['add_form_size'] = $add_form_size;
                            $aLigne['edit_form_size'] = $edit_form_size;
                            $aLigne['display_form_size'] = $display_form_size;

                            if (!empty($oBusinessObject->aFields['id_field']))
                                $aLigne['bo_id_field'] = $oBusinessObject->aFields['id_field'];

                            if (!empty($geom_column))
                                $aLigne['geom_column'] = $geom_column;

                            $aRights = $this->oConnection->getTableRights($schema, $table);

                            $aLigne['have_update_rights'] = $this->haveUpdateRights($aRights, $schema, $table, $bo_id, $oBusinessObject->aFields['id_field']);
                            $aLigne['have_card_rights'] = $this->haveCardRights($aRights, $schema, $table, $bo_id);
                            $aLigne['have_delete_rights'] = $this->haveDeleteRights($aRights);
                            $aLigne['have_insert_rights'] = $this->haveInsertRights($aRights);

                            // Enlève les arguments non demandés
                            foreach ($aLigne as $key => $value) {
                                if ($this->isAttribute($key) === false) {
                                    unset($aLigne[$key]);
                                }
                            }
                        }

                        // Fichiers à récupérer ?
                        $sDataDir = $this->aProperties['ws_data_dir'] . "/vitis/" . $bo_id . "/documents/" . $aLigne['bo_id_value'];
                        $sDataUrl = $this->aProperties['web_server_name'] . "/" . $this->aProperties['ws_data_alias'] . "/vitis/" . $bo_id . "/documents/" . $aLigne['bo_id_value'];

                        foreach ($aLigne['bo_' . $type] as $key => $value) {
                            if (is_dir($sDataDir . "/" . $key)) {
                                $aLigne['bo_' . $type][$key] = $sDataUrl . "/" . $key . "/" . $value . "?d=" . $date->getTimestamp();
                            }
                        }
                    }

                    // Nombre total d'éléments dans la table
                    if (!empty($iTotalRowNumber)) {
                        $this->aFields['total_row_number'] = $iTotalRowNumber;
                    }

                    // Attributs récupérés
                    $oObject = new QueryResponse();
                    $oObject->aFields = $aLigne;
                    array_push($this->aObjects, $oObject);
                }
            }
        }

        // Message de sortie
        if (isset($oError)) {
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $aReturn = array('sStatus' => $aXmlRacineAttribute['status'], "sMessage" => $sMessage);
            return $aReturn['sMessage'];
        } else {
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $aReturn = array('sStatus' => $aXmlRacineAttribute['status'], "sMessage" => $sMessage);
            return $aReturn['sMessage'];
        }
    }

    /**
     * Add a filter operator
     * @param string $sFilter
     * @param array $aOperator
     * @return string
     */
    function addFilterOperator($sFilter, $aOperator) {

        if (is_object($sFilter) || is_array($sFilter)) {
            $sFilter = json_encode($sFilter);
        }

        try {
            $aJSONFilter = json_decode($sFilter, true);
        } catch (Exception $ex) {
            $aJSONFilter = null;
        }

        if (is_array($aJSONFilter)) {
            if (is_array($aJSONFilter['operators'])) {
                array_push($aJSONFilter['operators'], $aOperator);
            } else {
                $aJSONFilter['operators'] = array($aOperator);
            }
        } else {
            $aJSONFilter = array(
                'relation' => 'AND',
                'operators' => array($aOperator)
            );
        }

        return json_encode($aJSONFilter);
    }

    /**
     * 
     * @param string $schema
     * @param string $table
     * @param string $sSecuredFilter
     * @param array $aParams
     * @return string
     */
    function getTotalRowNumber($schema, $table, $sSecuredFilter, $aParams) {

        $aParams['sSchema'] = array('value' => $schema, 'type' => 'schema_name');
        $aParams['sTable'] = array('value' => $table, 'type' => 'table_name');

        $sSql = 'SELECT count(*) as total_row_number FROM "[sSchema]"."[sTable]"';
        if (!empty($sSecuredFilter) && strlen($sSecuredFilter) > 1) {
            $sSql .= ' WHERE ' . $sSecuredFilter;
        }

        $oPDOresult = $this->oConnection->oBd->executeWithParams($sSql, $aParams);
        $aResult = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);

        if (!empty($aResult[0])) {
            if (!empty($aResult[0]['total_row_number'])) {
                return $aResult[0]['total_row_number'];
            }
        }
    }

    /**
     * Check if the attr has to be returned
     * @param string $sElement
     * @return boolean
     */
    function isAttribute($sElement) {
        if (!isset($this->aValues['attributs'])) {
            return true;
        }
        if (empty($this->aValues['attributs'])) {
            return true;
        }

        $aAttributs = explode('|', $this->aValues['attributs']);

        if (!is_array($aAttributs)) {
            return true;
        }
        if (count($aAttributs) == 0) {
            return true;
        }
        if (array_search($sElement, $aAttributs) === 0) {
            return true;
        }
        if (array_search($sElement, $aAttributs) == null) {
            return false;
        }
        return true;
    }

    /**
     * Check if connection rights contains update and if the form is present
     * @param string $aRights
     * @param string $schema
     * @param string $table
     * @param string $bo_id
     * @param string $bo_id_field
     * @return string true if the update is possible, false if is not
     */
    function haveUpdateRights($aRights, $schema, $table, $bo_id, $bo_id_field) {
        if (!file_exists($this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $bo_id . '/forms/published.json'))
            return "false";

        if (in_array("UPDATE", $aRights))
            return "true";
        else
            return "false";
    }

    /**
     * heck if connection rights contains select and if the form is present
     * @param string $aRights
     * @param string $schema
     * @param string $table
     * @param string $bo_id
     * @return string true if the card is visible, false if is not
     */
    function haveCardRights($aRights, $schema, $table, $bo_id) {
        if (!file_exists($this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $bo_id . '/forms/published.json'))
            return "false";

        if (in_array("SELECT", $aRights))
            return "true";
        else
            return "false";
    }

    /**
     * heck if connection rights contains delete
     * @param string $aRights
     * @return string true if the object is deletable
     */
    function haveDeleteRights($aRights) {
        if (in_array("DELETE", $aRights))
            return "true";
        else
            return "false";
    }

    /**
     * heck if connection rights contains insert
     * @param string $aRights
     * @return string true if the object is deletable
     */
    function haveInsertRights($aRights) {
        if (in_array("INSERT", $aRights))
            return "true";
        else
            return "false";
    }

    /**
     * Get the position of the firt attribute in a SQL request
     * @param string $sSql
     * @return int the position of the firt attribute
     */
    function getAttributsPosition($sSql) {
        // Position du permier select de la requête
        $iSelectPos = strpos(strtoupper($sSql), 'SELECT');
        $iSelectPos = is_numeric($iSelectPos) ? $iSelectPos + 6 : 0;

        // Position du permier distinct de la requête
        $iDistinctPos = strpos(strtoupper($sSql), 'SELECT DISTINCT', $iSelectPos);
        $iDistinctPos = is_numeric($iDistinctPos) ? $iDistinctPos + 9 : 0;

        // Position du permier all de la requête
        $iALLPos = strpos(strtoupper($sSql), 'SELECT ALL', $iSelectPos);
        $iALLPos = is_numeric($iALLPos) ? $iALLPos + 4 : 0;

        // Position des attributs dans la requête
        $iAttributesPos = $iSelectPos + $iDistinctPos + $iALLPos;

        return $iAttributesPos;
    }

    /**
     * Get the projection of a column from an SQL request
     * @param type $sSql SQL request witch contains the table, schema etc..
     * @param type $columnName name of the column to look the projection
     */
    function getColumnProjection($sSql, $iAttributesPos, $columnName) {
        $sSql_tmp = substr_replace($sSql, ' ST_SRID([intersect_column]) as bo_intersect_column_srid,', $iAttributesPos, 0) . ' where ST_SRID([intersect_column]) != 0 limit 1';

        $aParams = array(
            'intersect_column' => array('value' => $columnName, 'type' => 'column_name')
        );

        $oResult = $this->oConnection->oBd->executeWithParams($sSql_tmp, $aParams);


        if ($this->oConnection->oBd->enErreur()) {
            writeToErrorLog($this->oConnection->oBd->getBDMessage());
        } else {
            if (!isset($this->oConnection->oBd->enErreur)) {
                $this->oConnection->oBd->enErreur = false;
            }
            if (!$this->oConnection->oBd->enErreur && $this->oConnection->oBd->nombreLigne($oResult) > 0) {
                $aData = array();
                while ($aObject = $this->oConnection->oBd->ligneSuivante($oResult)) {
                    foreach ($aObject as $sParamKey => $sParamValue) {
                        if ($sParamKey === 'bo_intersect_column_srid')
                            $intersect_column_proj = $sParamValue;
                    }
                }
            }
        }
        return $intersect_column_proj;
    }

    /**
     * Get the geometries from a business object intersecting intersect_geom
     */
    function getBoGeomsFromIntersect($sBusinessObjectId) {

        if (!empty($this->oConnection->oError)) {
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $this->oConnection->oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $aReturn = array('sStatus' => $aXmlRacineAttribute['status'], "sMessage" => $sMessage);
            return $aReturn['sMessage'];
        }
        if (empty($sBusinessObjectId) || empty($this->aValues['intersect_geom']) || empty($this->aValues['snapping_mode'])) {
            $oError = new VitisError(0, 'Parameters business_object_id, intersect_geom, snapping_mode required');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $aReturn = array('sStatus' => $aXmlRacineAttribute['status'], "sMessage" => $sMessage);
            return $aReturn['sMessage'];
        }

        // Objet BusinessObject correspondant
        $aPath = array('vmap', 'businessobjects', $sBusinessObjectId);
        $aValues = array(
            'token' => $this->aValues['token'],
            'output' => 'application/json',
            'sEncoding' => 'UTF-8',
            'sSourceEncoding' => 'UTF-8',
            'my_vitis_id' => $sBusinessObjectId,
            'module' => 'vmap',
        );
        $oBusinessObject = new BusinessObject($aPath, $aValues, $this->aProperties, $this->oConnection);
        $oBusinessObject->GET();

        // Vérifie l'éxistance de l'objet métier
        if (empty($oBusinessObject->aFields['business_object_id'])) {
            $oError = new VitisError(0, 'Business object ' . $sBusinessObjectId . ' not founded');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $aReturn = array('sStatus' => $aXmlRacineAttribute['status'], "sMessage" => $sMessage);
            return $aReturn['sMessage'];
        }

        // Paramètres retenus dans l'url
        $sSchema = $oBusinessObject->aFields['schema'];
        $sTable = $oBusinessObject->aFields['table'];
        $intersectGeom = $this->aValues['intersect_geom'];
        $sSnapMode = $this->aValues['snapping_mode'];
        $iSnappingLimit = !empty($this->aValues['snapping_limit']) ? $this->aValues['snapping_limit'] : 100000;

        // Paramètres retenus dans le business object
        $sGeomColumn = $oBusinessObject->aFields['geom_column'];
        $sDatabase = $oBusinessObject->aFields['database'];

        // Base de données
        if (!empty($sDatabase) && $sDatabase != $this->oConnection->oBd->base) {
            $this->oConnection->oBd = new Vm($this->oConnection->oBd->login, $this->oConnection->oBd->mdp, $sDatabase, $this->oConnection->oBd->serveur, $this->oConnection->oBd->port, $this->oConnection->oBd->sgbd, $this->oConnection->oBd->sPageEncoding);
        }

        // Paramètres de la requête
        $aParams = array();
        $aParams['sSchema'] = array('value' => $sSchema, 'type' => 'schema_name');
        $aParams['sTable'] = array('value' => $sTable, 'type' => 'table_name');
        $aParams['sGeomColumn'] = array('value' => $sGeomColumn, 'type' => 'column_name');
        $aParams['iSnappingLimit'] = array('value' => $iSnappingLimit, 'type' => 'integer');

        // Projection de la colonne intersectée
        $iColumnProj = $this->oConnection->oBd->getColumnSRID($sSchema, $sTable, $sGeomColumn);
        if (empty($iColumnProj)) {
            $iColumnProj = '2154';
        }

        // Filtre
        $aFilter = array(
            'column' => $sGeomColumn,
            'compare_operator' => 'intersect',
            'compare_operator_options' => array(
                'source_proj' => $iColumnProj,
            ),
            'value' => $intersectGeom
        );
        $aDecodedFilter = $this->decodeJSONFilter($aFilter, $sSchema, $sTable);

        $sSecuredFilter = $aDecodedFilter['request'];
        foreach ($aDecodedFilter['params'] as $key => $value) {
            $aParams[$key] = $value;
        }

        // Compte le nomber d'éléments qui seront affichés
        $sSqlCount = 'SELECT COUNT(ST_NPoints([sGeomColumn])) FROM "[sSchema]"."[sTable]" AS geom WHERE ' . $sSecuredFilter . ' AND [sGeomColumn] IS NOT NULL';
        $oResult = $this->oConnection->oBd->executeWithParams($sSqlCount, $aParams);
        if ($this->oConnection->oBd->enErreur()) {
            $aXmlRacineAttribute['status'] = 0;
            writeToErrorLog($this->oConnection->oBd->getBDMessage());
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            $aReturn = array('sStatus' => $aXmlRacineAttribute['status'], "sMessage" => $sMessage);
            return $aReturn['sMessage'];
        } else {
            $aCountResult = $this->oConnection->oBd->getResultTableAssoc($oResult);
        }

        // Si le nombre d'éléments est correct, alors effectue la vraie requête
        if ($aCountResult[0]['count'] < $iSnappingLimit) {

            // Mise en place de la requête
            switch ($sSnapMode) {
                case 'segment_edge_node':
                case 'edge_node':
                    $sSql = 'SELECT ST_AsEWKT(ST_Union([sGeomColumn]))';
                    break;
                case 'node':
                    $sSql = 'SELECT ST_AsEWKT(ST_Union(ST_Collect(ST_StartPoint([sGeomColumn]), ST_EndPoint([sGeomColumn]))))';
                    break;
                default:
                    $sSql = 'SELECT ST_AsEWKT(ST_Union([sGeomColumn]))';
                    break;
            }
            $sSql .= ' AS geom FROM "[sSchema]"."[sTable]" WHERE ' . $sSecuredFilter . ' AND [sGeomColumn] IS NOT NULL';

            // Execution de la requête
            $oResult = $this->oConnection->oBd->executeWithParams($sSql, $aParams);
            if ($this->oConnection->oBd->enErreur()) {
                $aXmlRacineAttribute['status'] = 0;
                writeToErrorLog($this->oConnection->oBd->getBDMessage());
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                $aReturn = array('sStatus' => $aXmlRacineAttribute['status'], "sMessage" => $sMessage);
                return $aReturn['sMessage'];
            } else {
                $aResult = $this->oConnection->oBd->getResultTableAssoc($oResult);
            }

            return json_encode($aResult);
        } else {
            return json_encode($aCountResult);
        }
    }

    /**
     * @SWG\Put(path="/querys/{business_object_id}",
     *   tags={"Querys"},
     *   summary="Update an element of a business object",
     *   description="Request to update an element of a business object",
     *   operationId="PUT",
     *   produces={"application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="business_object_id",
     *     in="path",
     *     description="business object id",
     *     required=true,
     *     type="integer",
     *     format="string"
     *   ),
     * @SWG\Parameter(
     *     name="body",
     *     in="body",
     *     description="",
     *     required=false,
     *     type="body",
     *     format="string",
     *     @SWG\Schema(ref="#/definitions/businessobjects")
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjects")
     *     ),
     * 
     *  )
     */

    /**
     * modify an element by business_object_id
     * @return array containing the status and the message
     */
    function PUT() {

        $sBusinessObjectId = $this->aPath['2'];

        if (!isset($sBusinessObjectId)) {
            return 'business_object_id required';
        }

        $this->aPath['3'] = $sBusinessObjectId;
        $this->aValues['my_vitis_id'] = $sBusinessObjectId;

        $oBusinessObject = new BusinessObject($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
        $oBusinessObject->GET();

        $bo_database = $oBusinessObject->aFields['database'];
        $bo_schema = $oBusinessObject->aFields['schema'];
        $bo_table = $oBusinessObject->aFields['table'];
        $bo_id_field = $oBusinessObject->aFields['id_field'];
        $bo_event = $oBusinessObject->aFields['event_id'];

        if (!empty($bo_database) && $bo_database != $this->oConnection->oBd->base) {
            $this->oConnection->oBd = new Vm($this->oConnection->oBd->login, $this->oConnection->oBd->mdp, $bo_database, $this->oConnection->oBd->serveur, $this->oConnection->oBd->port, $this->oConnection->oBd->sgbd, $this->oConnection->oBd->sPageEncoding);
        }

        $this->aValues['my_vitis_id'] = $this->aValues[$bo_id_field];

        // Définit si il a des fichiers a uploader
        $bUploadFiles = false;
        foreach ($this->aValues as $key => $value) {
            if (strrpos($key, '_file')) {
                $sName = substr($key, 0, strrpos($key, '_file'));
                if (isset($this->aValues[$sName . '_name'])) {
                    $bUploadFiles = true;
                }
            }
        }

        // Fichiers à uploader ?
        if ($bUploadFiles) {
            // Création du dossier contenneur si il n'existe pas
            $sDirPath = $this->createElementFilesFolder($sBusinessObjectId, $this->aValues['my_vitis_id']);
            if (!is_dir($sDirPath)) {
                $oError = new VitisError(1, "Unable to acces to the business object direrctory :" . $sDirPath);
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                return $sMessage;
            }
            // Mise en place des fichiers
            $this->aValues = $this->extractFilesFromValues($this->aValues, $sDirPath);
        }

        $aReturn = $this->genericPut($bo_schema, $bo_table, $bo_id_field);

        // Lance l'évènement webSocket
        if (!empty($bo_event)) {
            sendWebsocketMessage($this->aProperties['websocket_server'], $this->aProperties['websocket_port'], $this->aProperties['websocket_alias'], array(
                'action' => 'event',
                'service' => 'VmapEvents',
                'data' => $bo_event
            ));
        }
        return $aReturn['sMessage'];
    }

    /**
     * Extract the files from aValues and modify the paths
     * @param array $aValues
     * @param string $sDirPath
     * @param string $sFilePrefix
     * @return array Parsed $aValues
     */
    function extractFilesFromValues($aValues, $sDirPath) {

        foreach ($aValues as $key => $value) {
            if (strrpos($key, '_file')) {

                $sName = substr($key, 0, strrpos($key, '_file'));
                $sFileName = $aValues[$sName . '_name'];

                if (!empty($sFileName)) {

                    $sDirColumnPath = $sDirPath . '/' . $sName;
                    if (!is_dir($sDirColumnPath)) {
                        mkdir($sDirColumnPath, 0777, true);
                    }

                    // Cŕee le fichier sur le serveur
                    $fp = fopen($sDirColumnPath . '/' . $sFileName, "w");
                    fwrite($fp, $value);
                    fclose($fp);

                    // Mise en place pour la base de données
                    $aValues[$sName] = $aValues[$sName . '_name'];
                    unset($aValues[$sName . '_file']);
                    unset($aValues[$sName . '_name']);
                }
            }
        }

        return $aValues;
    }

    /**
     * Create the element files container
     * @param string $sBoId
     * @param string $sId
     * @return string Path to the created directory
     */
    function createElementFilesFolder($sBoId, $sId) {

        // Répertoires présents ?
        if (is_dir($this->aProperties['ws_data_dir'])) {
            $sDirPath = $this->aProperties['ws_data_dir'] . '/vitis';
            if (!is_dir($sDirPath)) {
                mkdir($sDirPath, 0777, true);
            }
            $sDirPath = $sDirPath . '/' . $sBoId;
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
     * @SWG\Post(path="/querys/{business_object_id}",
     *   tags={"Querys"},
     *   summary="Insert an element of a business object",
     *   description="Request to insert an element of a business object",
     *   operationId="POST",
     *   produces={"application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="business_object_id",
     *     in="path",
     *     description="business object id",
     *     required=true,
     *     type="integer",
     *     format="string"
     *   ),
     * @SWG\Parameter(
     *     name="body",
     *     in="body",
     *     description="",
     *     required=false,
     *     type="body",
     *     format="string",
     *     @SWG\Schema(ref="#/definitions/businessobjects")
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjects")
     *     ),
     * 
     *  )
     */

    /**
     * modify an element by business_object_id
     * @return array containing the status and the message
     */
    function POST() {

        $sBusinessObjectId = $this->aPath['2'];

        if (!isset($sBusinessObjectId)) {
            return 'business_object_id required';
        }

        $this->aPath['3'] = $sBusinessObjectId;
        $this->aValues['my_vitis_id'] = $sBusinessObjectId;

        $oBusinessObject = new BusinessObject($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
        $oBusinessObject->GET();

        $bo_database = $oBusinessObject->aFields['database'];
        $bo_schema = $oBusinessObject->aFields['schema'];
        $bo_table = $oBusinessObject->aFields['table'];
        $bo_id_field = $oBusinessObject->aFields['id_field'];
        $bo_event = $oBusinessObject->aFields['event_id'];

        if (!empty($bo_database) && $bo_database != $this->oConnection->oBd->base) {
            $this->oConnection->oBd = new Vm($this->oConnection->oBd->login, $this->oConnection->oBd->mdp, $bo_database, $this->oConnection->oBd->serveur, $this->oConnection->oBd->port, $this->oConnection->oBd->sgbd, $this->oConnection->oBd->sPageEncoding);
        }

        // $this->aValues['my_vitis_id'] = $this->aValues[$bo_id_field];
        unset($this->aValues['my_vitis_id']);

        $aReturn = $this->genericPost($bo_schema, $bo_table, '', $bo_id_field);

        // Fichiers à uploader ?
        if (!empty($_FILES) && !empty($this->aValues['my_vitis_id'])) {

            // Création du dossier contenneur
            $sDirPath = $this->createElementFilesFolder($sBusinessObjectId, $this->aValues['my_vitis_id']);
            if (!is_dir($sDirPath)) {
                $oError = new VitisError(1, "Unable to acces to the business object direrctory :" . $sDirPath);
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                return $sMessage;
            }
            // Écriture du fichier
            foreach ($_FILES as $sName => $aFile) {

                $sDirColumnPath = $sDirPath . '/' . $sName;
                if (!is_dir($sDirColumnPath)) {
                    mkdir($sDirColumnPath, 0777, true);
                }

                $this->aValues[$sName] = $aFile['name'];

                // Écrit le fichier dans son enplacement
                uploadFile($sName, "", $sDirColumnPath . "/" . $aFile['name'], $aFile['size'] + 1);
            }
            $this->genericPut($bo_schema, $bo_table, $bo_id_field);
        }

        // Lance l'évènement webSocket
        if (!empty($bo_event)) {
            sendWebsocketMessage($this->aProperties['websocket_server'], $this->aProperties['websocket_port'], $this->aProperties['websocket_alias'], array(
                'action' => 'event',
                'service' => 'VmapEvents',
                'data' => $bo_event
            ));
        }
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/querys/{business_object_id}",
     *   tags={"Querys"},
     *   summary="delete elements of a business object",
     *   description="Request to delete elements of a business object",
     *   operationId="DELETE",
     *   produces={"application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="business_object token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="business_object_id",
     *     in="path",
     *     description="id of the businessobjects",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id list of the elements to delete separed by |",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjects")
     *     )
     *  )
     */

    /**
     * delete business_object
     * @return id of business_object deleted or error object if a business_object is not deleted
     */
    function DELETE() {

        $sBusinessObjectId = $this->aPath['2'];

        if (!isset($sBusinessObjectId)) {
            return 'business_object_id required';
        }

        if (empty($this->aValues['idList']) && !empty($this->aPath['3'])) {
            $this->aValues['idList'] = $this->aPath['3'];
        }

        $this->aPath['3'] = $sBusinessObjectId;
        $this->aValues['my_vitis_id'] = $sBusinessObjectId;

        $oBusinessObject = new BusinessObject($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
        $oBusinessObject->GET();

        $bo_database = $oBusinessObject->aFields['database'];
        $bo_schema = $oBusinessObject->aFields['schema'];
        $bo_table = $oBusinessObject->aFields['table'];
        $bo_id_field = $oBusinessObject->aFields['id_field'];
        $bo_event = $oBusinessObject->aFields['event_id'];

        $aIdList = explode("|", $this->aValues['idList']);

        $sIdList = "";
        for ($i = 0; $i < count($aIdList); $i++) {
            if ($i > 0)
                $sIdList .= ", ";
            $sIdList .= "'" . $aIdList[$i] . "'";
        }

        if (!empty($bo_database) && $bo_database != $this->oConnection->oBd->base) {
            $this->oConnection->oBd = new Vm($this->oConnection->oBd->login, $this->oConnection->oBd->mdp, $bo_database, $this->oConnection->oBd->serveur, $this->oConnection->oBd->port, $this->oConnection->oBd->sgbd, $this->oConnection->oBd->sPageEncoding);
        }

        $this->oConnection->oBd->delete($bo_schema, $bo_table, $bo_id_field, $this->aValues['idList']);

        if ($this->oConnection->oBd->enErreur()) {
            $aXmlRacineAttribute['status'] = 0;
            $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            $this->deleteElementsDocuments($sBusinessObjectId, $aIdList);
            $this->aFields['idList'] = $sIdList;
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }

        $aReturn = array('sStatus' => $aXmlRacineAttribute['status'], "sMessage" => $sMessage);
        $sMessage = $aReturn['sMessage'];

        // Lance l'évènement webSocket
        if (!empty($bo_event)) {
            sendWebsocketMessage($this->aProperties['websocket_server'], $this->aProperties['websocket_port'], $this->aProperties['websocket_alias'], array(
                'action' => 'event',
                'service' => 'VmapEvents',
                'data' => $bo_event
            ));
        }

        return $sMessage;
    }

    /**
     * Delete the documents binded to the elements specified in $aIds
     * @param string $sBusinessObjectId
     * @param array $aIds
     */
    function deleteElementsDocuments($sBusinessObjectId, $aIds) {
        for ($i = 0; $i < count($aIds); $i++) {
            if (!empty($aIds[$i])) {
                $sDir = $this->aProperties['ws_data_dir'] . '/vitis/' . $sBusinessObjectId . '/documents/' . $aIds[$i];
                if (is_dir($sDir)) {
                    clearDir($sDir);
                }
            }
        }
    }

}

class QueryResponse extends Vitis {

    function __construct() {
        
    }

}

?>

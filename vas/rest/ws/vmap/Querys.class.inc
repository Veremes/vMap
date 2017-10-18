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
     */
    function __construct($aPath, $aValues, $properties) {
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
     * get Querys
     * @return  Querys
     */
    function GET($bOnlyReturnStatus = FALSE) {

        if (isset($this->aPath[3])) {
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

        // Paramètres retenus dans le business object
        $geom_column = $oBusinessObject->aFields['geom_column'];
        $sorted_by = $oBusinessObject->aFields['sorted_by'];
        $bo_id_field = $oBusinessObject->aFields['id_field'];
        $bo_title = $oBusinessObject->aFields['title'];
        $bo_id = $oBusinessObject->aFields['business_object_id'];
        $database = $oBusinessObject->aFields['database'];
        $schema = $oBusinessObject->aFields['schema'];
        $table = $oBusinessObject->aFields['table'];
        $add_form_size = $oBusinessObject->aFields['add_form_size'];
        $edit_form_size = $oBusinessObject->aFields['edit_form_size'];
        $display_form_size = $oBusinessObject->aFields['display_form_size'];

        // Base de données
        if (!empty($database) && $database != $this->oConnection->oBd->base) {
            $this->oConnection->oBd = new Vm($this->oConnection->oBd->login, $this->oConnection->oBd->mdp, $database, $this->oConnection->oBd->serveur, $this->oConnection->oBd->port, $this->oConnection->oBd->sgbd, $this->oConnection->oBd->sPageEncoding);
        }

        // Chaine sql
        if ($type === 'form') {
            $sSql = 'SELECT * FROM "' . $schema . '"."' . $table . '"';
        } else {
            $sSql = $oBusinessObject->aFields['sql_' . $type];
        }

        $aParams = array();

        // Valeurs par défaut
        $intersect_column = empty($intersect_column) ? $geom_column : $intersect_column;
        $intersect_buffer = empty($intersect_buffer) ? 0.01 : $intersect_buffer;
        $sorted_dir = empty($sorted_dir) ? 'ASC' : $sorted_dir;
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

        // filtre
        $aDecodedFilter = $this->decodeJSONFilter($filter, $schema, $table);

        // Ajout dans la requête
        $sSecuredFilter = $aDecodedFilter['request'];
        // Ajout des paramètres
        foreach ($aDecodedFilter['params'] as $key => $value) {
            $aParams[$key] = $value;
        }

        // Position des attributs dans la requête
        $iAttributesPos = $this->getAttributsPosition($sSql);

        // Filtre de la requête
        if ($use_intersect === true) {

            // Projection de la colonne intersectée
            $intersect_column_proj = $this->getColumnProjection($sSql, $iAttributesPos, $intersect_column);

            if (empty($intersect_column_proj)) {
                $intersect_column_proj = '2154';
            }

            $aParams['intersect_buffer'] = array('value' => $intersect_buffer, 'type' => 'number');
            $aParams['intersect_geom'] = array('value' => $intersect_geom, 'type' => 'geometry');
            $aParams['intersect_column'] = array('value' => $intersect_column, 'type' => 'column_name');
            $aParams['intersect_column_proj'] = array('value' => $intersect_column_proj, 'type' => 'integer');

            // Buffer pour les coordsys non métriques
            if ($result_srid == '4326') {
                $sGeometryFilter = 'ST_Intersects(ST_Transform(ST_Buffer(ST_GeomFromEWKT([intersect_geom])::geography, [intersect_buffer]::float)::geometry, [intersect_column_proj]::integer), [intersect_column])';
            } else {
                $sGeometryFilter = 'ST_Intersects(ST_Transform(ST_Buffer(ST_GeomFromEWKT([intersect_geom]), [intersect_buffer]::float), [intersect_column_proj]::integer), [intersect_column])';
            }
            if (strlen($sSecuredFilter) === 0) {
                $sSecuredFilter = $sGeometryFilter;
            } else {
                $sSecuredFilter .= ' AND (' . $sGeometryFilter . ')';
            }
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

        // Fin de la requête
        if (!empty($sSecuredFilter) && strlen($sSecuredFilter) > 1) {
            $sSql .= ' WHERE ' . $sSecuredFilter;
        }
        if (!empty($sorted_by)) {
            $sSql .= ' ORDER BY [sorted_by]';
            $aParams['sorted_by'] = array('value' => $sorted_by, 'type' => 'column_name');
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
        $sSql_tmp = substr_replace($sSql, ' ST_SRID([intersect_column]) as bo_intersect_column_srid,', $iAttributesPos, 0) . ' limit 1';

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
    
}

?>

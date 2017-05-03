<?php

require_once 'Vmap.class.inc';
require_once 'Map.class.inc';
require_once 'Layers.class.inc';
require_once 'BusinessObject.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Map.class.inc
 * \class Map
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Map php class
 *
 * This class defines operation for one Map
 * 
 */
class MapJSON extends Vmap {

    public $oError;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $oConnection) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
    }

    /**
     * @SWG\Get(path="/mapjsons/{map_id}", 
     *   tags={"MapJSON"},
     *   summary="Get Map",
     *   description="Request to get Map by id",
     *   operationId="GET",
     *   produces={"application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="map_id",
     *     in="path",
     *     description="map id",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/mapjsons")
     *     )
     *  )
     */

    /**
     * get informations about Map
     */
    function GET() {
        require $this->sRessourcesFile;

        $aValues = $this->aValues;
        $aPath = $this->aPath;
        $properties = $this->aProperties;
        $oConnection = $this->oConnection;

        // Récupère la carte correspondante
        $oMap = new Map(Array('vmap', 'maps'), $aValues, $properties, $oConnection);
        $oMap->GET();

        // Récupère les calques correspondants
        $aLayers = $this->getMapLayers($aPath[2]);

        for ($i = 0; $i < count($aLayers); $i++) {
            $aLayers[$i]->aFields['events'] = $this->getLayersEvents($aLayers[$i]->aFields['layer_id']);
        }

        // Forme l'objet mapjson
        $oMapJSON['name'] = 'Tree';
        $oMapJSON['children'] = Array();

        $extent = explode('|', $oMap->aFields['extent']);

        foreach ($extent as $key => $value) {
            $extent[$key] = floatval($value);
        }

        $oMapJSON['children'][0]['view']['extent'] = $extent;
        $oMapJSON['children'][0]['view']['projection'] = $oMap->aFields['crs_id'];

        // Réordonne les calques pour qu'ils correspondent à la définition vmap
        $aThemes = $this->reorderLayers($aLayers);

        $i = 1;
        foreach ($aThemes as $themeName => $themeParams) {
            $oMapJSON['children'][$i]['name'] = $themeName;
            $oMapJSON['children'][$i]['children'] = $themeParams;
            $i++;
        }

        $this->aFields = $oMapJSON;
    }

    /**
     * Get an array of layers (with state infos like opacity etc..) by map_id
     * @param number $map_id
     * @return array aLayers
     */
    function getMapLayers($map_id) {

        $aValues = $this->aValues;
        $aPath = $this->aPath;
        $properties = $this->aProperties;
        $oConnection = $this->oConnection;
        $filterList = '';

        $sSql = "SELECT * FROM " . $this->aProperties['schema_vmap'] . ".map_layer WHERE \"map_id\" = '" . $map_id . "'";
        $oResult = $this->oConnection->oBd->execute($sSql);
        if (gettype($oResult) == 'object') {
            $aLayers_infos = Array();
            while ($aLigne = $this->oConnection->oBd->ligneSuivante($oResult)) {
                // stocke le layer id dans la chaine de caractères
                if ($filterList == '')
                    $filterList .= $aLigne['layer_id'];
                else
                    $filterList .= ',' . $aLigne['layer_id'];

                // stocke les infos complémentaires du calque (visible, opacity etc...)
                $tmp['layer_index'] = $aLigne['layer_index'];
                $tmp['layer_visible'] = $aLigne['layer_visible'];
                $tmp['layer_opacity'] = $aLigne['layer_opacity'];
                $aLayers_infos[$aLigne['layer_id']] = $tmp;
                unset($tmp);
            }
        } else {
            return Array();
        }

        if (empty($filterList)) {
            return Array();
        }

        unset($aValues['my_vitis_id']);
        $aValues['filter'] = 'layer_id in (' . $filterList . ')';
        $aValues['order_by'] = 'name';

        $oLayers = new Layers(Array('vmap', 'layer'), $aValues, $this->aProperties);
        $oLayers->GET();

        // Transforme oLayers en tableau de Layer
        $aLayers = Array();
        foreach ($oLayers->aObjects as $oLayer) {
            // Rajoute les informations sur l'état du calque
            foreach ($aLayers_infos[$oLayer->aFields['layer_id']] as $key => $value) {
                $oLayer->aFields[$key] = $value;
            }
            $oLayer->aFields['filter_form'] = $oLayer->getFilterForm();
            array_push($aLayers, $oLayer);
        }

        return $aLayers;
    }

    /**
     * Get the events from a layer
     * @param string $layer_id
     * @return array
     */
    function getLayersEvents($layer_id) {

        $sSql = "SELECT * FROM " . $this->aProperties['schema_vmap'] . ".layer_event WHERE \"layer_id\" = '" . $layer_id . "'";
        $oResult = $this->oConnection->oBd->execute($sSql);
        if (gettype($oResult) == 'object') {
            $aEvents = Array();
            while ($aLigne = $this->oConnection->oBd->ligneSuivante($oResult)) {
                array_push($aEvents, $aLigne['event_id']);
            }
        }

        return $aEvents;
    }

    /**
     * Reorder the layers like vmap definition
     * @param array $aLayers
     * @return array
     */
    function reorderLayers($aLayers) {

        $aThemes = Array();
        foreach ($aLayers as $oLayer) {

            if (!isset($oLayer->aFields['theme_name']))
                $oLayer->aFields['theme_name'] = $oLayer->aFields['service_name'];

            if (!isset($aThemes[$oLayer->aFields['theme_name']]))
                $aThemes[$oLayer->aFields['theme_name']] = Array();

            if (!empty($oLayer->aFields['name']))
                $tmp['name'] = $oLayer->aFields['name'];
            else
                continue;

            if (!empty($oLayer->aFields['service_type_id']))
                $tmp['layerType'] = $oLayer->aFields['service_type_id'];
            else
                continue;

            if (!empty($oLayer->aFields['service_url'])) {
                $tmp['url'] = $oLayer->aFields['service_url'];
                $tmp['url'] = str_replace('[token]', $this->aValues['token'], $tmp['url']);
                if (isset($this->aProperties['ms_cgi_url'])) {
                    $tmp['url'] = str_replace('[ms_cgi_url]', $this->aProperties['ms_cgi_url'], $tmp['url']);
                }
            }

            if (!empty($oLayer->aFields['layer_index']))
                $tmp['index'] = $oLayer->aFields['layer_index'];
            else
                $tmp['index'] = 0;

            if (!empty($oLayer->aFields['service_key']))
                $tmp['key'] = $oLayer->aFields['service_key'];

            $tmp['visible'] = $oLayer->aFields['layer_visible'];

            if (!empty($oLayer->aFields['layer_opacity']))
                $tmp['opacity'] = $oLayer->aFields['layer_opacity'] / 100;

            if (!empty($oLayer->aFields['events']))
                $tmp['events'] = $oLayer->aFields['events'];

            if (!empty($oLayer->aFields['is_dynamic']))
                $tmp['is_dynamic'] = $oLayer->aFields['is_dynamic'];
            else
                $tmp['is_dynamic'] = false;

            if (!empty($oLayer->aFields['is_filtered']) && !empty($oLayer->aFields['filter_form']))
                $tmp['is_filtered'] = $oLayer->aFields['is_filtered'];
            else
                $tmp['is_filtered'] = false;

            if (!empty($oLayer->aFields['filter_form']))
                $tmp['filter_form'] = $oLayer->aFields['filter_form'];

            if (!empty($oLayer->aFields['matrix_set']))
                $tmp['matrixSet'] = $oLayer->aFields['matrix_set'];

            if (!empty($oLayer->aFields['layer_style']))
                $tmp['style'] = $oLayer->aFields['layer_style'];

            if (!empty($oLayer->aFields['layer_format']))
                $tmp['format'] = $oLayer->aFields['layer_format'];

            // Problèmes en cas de rest
            if (!empty($oLayer->aFields['service_type_type']))
                $tmp['requestEncoding'] = $oLayer->aFields['service_type_type'];

            if (!empty($oLayer->aFields['layer_options']))
                $tmp['layer_options'] = $oLayer->aFields['layer_options'];

            if (!empty($oLayer->aFields['service_options']))
                $tmp['service_options'] = $oLayer->aFields['service_options'];

            if (!empty($oLayer->aFields['service_type_version']))
                $tmp['version'] = $oLayer->aFields['service_type_version'];


            if ($oLayer->aFields['service_type_id'] == 'tilewms' || $oLayer->aFields['service_type_id'] == 'imagewms') {
                if (!empty($oLayer->aFields['layer_list']))
                    $tmp['params']['LAYERS'] = $oLayer->aFields['layer_list'];
                if (!empty($oLayer->aFields['service_type_version']))
                    $tmp['params']['VERSION'] = $oLayer->aFields['service_type_version'];
            } else if ($oLayer->aFields['service_type_id'] == 'bing') {
                $tmp['imagerySet'] = $oLayer->aFields['service_imagery'];
                $tmp['culture'] = $oLayer->aFields['service_lang'];
            } else {
                if (!empty($oLayer->aFields['layer_list']))
                    $tmp['layer'] = $oLayer->aFields['layer_list'];
            }

            // Définit si le calque est interrogeable en consultation
            if (!empty($oLayer->aFields['bo_id'])) {
                $tmp['bo_queryable'] = true;
            } else {
                $tmp['bo_queryable'] = false;
            }

            if (!empty($oLayer->aFields['bo_id'])) {

                $aBusinessObjectValues = $this->aValues;
                $aBusinessObjectValues['my_vitis_id'] = $oLayer->aFields['bo_id'];
                $aBusinessObjectValues['module'] = 'vitis';

                // Objet BusinessObject correspondant
                $oBusinessObject = new BusinessObject(array("vitis", "businessobjects", $oLayer->aFields['bo_id']), $aBusinessObjectValues, $this->aProperties, $this->oConnection);
                $oBusinessObject->GET();

                if (!empty($oBusinessObject->aFields['schema']))
                    $schema = $oBusinessObject->aFields['schema'];
                else
                    $schema = '';
                if (!empty($oBusinessObject->aFields['table']))
                    $table = $oBusinessObject->aFields['table'];
                else
                    $table = '';
                if (!empty($oBusinessObject->aFields['database'])) {
                    $database = $oBusinessObject->aFields['database'];

                    $sLogin = $this->oConnection->oBd->login;
                    $sPassword = $this->oConnection->oBd->mdp;

                    $oBD = new Vm($sLogin, $sPassword, $database, $this->aProperties['server'], $this->aProperties['port'], $this->aProperties['sgbd'], $this->aProperties['page_encoding']);
                    $this->oConnection->oBd = $oBD;

                    $tmp['bo_user_rights'] = $this->oConnection->getTableRights($schema, $table);

                    $oBD = new Vm($sLogin, $sPassword, $this->aProperties['database'], $this->aProperties['server'], $this->aProperties['port'], $this->aProperties['sgbd'], $this->aProperties['page_encoding']);
                    $this->oConnection->oBd = $oBD;
                } else {
                    $tmp['bo_user_rights'] = $this->oConnection->getTableRights($schema, $table);
                }

                $tmp['bo_id'] = $oLayer->aFields['bo_id'];
                $tmp['bo_title'] = $oLayer->aFields['bo_title'];
                $tmp['bo_search_field'] = $oLayer->aFields['bo_search_field'];
                $tmp['bo_result_field'] = $oLayer->aFields['bo_result_field'];
                $tmp['bo_search_use_strict'] = $oLayer->aFields['bo_search_use_strict'];
                $tmp['bo_id_field'] = '';
                if (!empty($oBusinessObject->aFields['id_field']))
                    $tmp['bo_id_field'] = $oBusinessObject->aFields['id_field'];
                $tmp['bo_geom_column'] = '';
                if (!empty($oBusinessObject->aFields['geom_column']))
                    $tmp['bo_geom_column'] = $oBusinessObject->aFields['geom_column'];
                $tmp['bo_geom_type'] = '';
                if (!empty($oBusinessObject->aFields['geom_type']))
                    $tmp['bo_geom_type'] = $oBusinessObject->aFields['geom_type'];
                $tmp['bo_index'] = '';
                if (!empty($oBusinessObject->aFields['index']))
                    $tmp['bo_index'] = $oBusinessObject->aFields['index'];

                if (is_array($oLayer->aFields['events'])) {
                    array_push($oLayer->aFields['events'], $oBusinessObject->aFields['event_id']);
                    $tmp['events'] = $oLayer->aFields['events'];
                } else if (!empty($oBusinessObject->aFields['event_id'])) {
                    $oLayer->aFields['events'] = $oBusinessObject->aFields['event_id'];
                    $tmp['events'] = $oLayer->aFields['events'];
                }
            }

            $tmp['layer_id'] = $oLayer->aFields['layer_id'];

            array_push($aThemes[$oLayer->aFields['theme_name']], $tmp);
            unset($tmp);
        }

        return $aThemes;
    }

}

?>
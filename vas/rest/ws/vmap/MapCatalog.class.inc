<?php

require_once 'Vmap.class.inc';
require_once 'Maps.class.inc';
require_once 'Services.class.inc';
require_once 'Layers.class.inc';
require_once __DIR__ . '/../vitis/Users.class.inc';
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
class MapCatalog extends Vmap {

    public $oError;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->aValues['getGroup'] = true;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
    }

    /**
     * @SWG\Get(path="/mapcatalog", 
     *   tags={"Catalog"},
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
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/mapcatalog")
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

        // Récupère les groupes correspondants
        $sGroup_id = $this->oConnection->sesGroup;

        // Récupère les cartes correspondante      
        $aMaps = $this->getMaps($sGroup_id);

        // Récupère les services correspondants
        $aServices = $this->getServices();

        $MapCatalog['usedMap'] = 0;
        $MapCatalog['maps'] = $aMaps;
        $MapCatalog['services'] = $aServices;

        $this->aFields = $MapCatalog;

        $aXmlRacineAttribute['status'] = 1;
        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);

        // Génération du flux wms privé.
        if (!empty($properties["use_veremap_api"]) && $properties["use_veremap_api"] === true) {
            // 1- Récupère le token veremap 2015
            $params = array(
                "user" => $oConnection->oBd->login,
                "password" => $oConnection->oBd->mdp,
                "duration" => 600
            );
            $oVeremap = json_decode($this->httpPost($properties["api_veremap"] . "/vitis/privatetoken", $params));
            if (is_object($oVeremap)) {
                $veremapToken = $oVeremap->token;
                // 2- Génère le flux privé qui aura pour nom de mapFile le token de vitis 2016
                $params = array(
                    "token" => $veremapToken,
                    "fileName" => $aValues['token']
                );
                $this->httpPost($properties["api_veremap"] . "/veremap/WMS", $params);
            }
        }
        // Création du fichier ".map" du flux wms privé de Vmap4MapServer (nom du fichier = token de l'utilisateur connecté).
        if (!empty($properties["use_vm4ms_api"]) && $properties["use_vm4ms_api"] === true && file_exists(__DIR__ . '/../vm4ms/WmsServices.class.inc')) {
            require_once __DIR__ . '/../vm4ms/WmsServices.class.inc';

            $aPath = array('vm4ms', 'wmsservices', 'private', 'MapFile');

            $aValues = array(
                'token' => $this->aValues['token'],
                'my_vitis_id' => $properties['private_wms_service'],
                'creation' => 'true',
                'type' => 'prod'
            );

            $oWmsServices = new WmsServices($aPath, $aValues, $this->aProperties, $this->oConnection);
            $oWmsServices->GET();
            $oWmsServices->createMapFile();
        }
        return $sMessage;
    }

    /**
     * Return the list of the group_id for the current user (ex: 12,16)
     * @param string $aValues
     * @return string group_id
     */
    /* function getGroupId($aValues) {

      $user_id = $_SESSION['ses_user_id'];

      // Récupère les groupes liés à l'utilisateur
      $sGroup_id = '';
      $sSql = "SELECT * FROM " . $this->aProperties['schema_framework'] . ".user_group WHERE \"user_id\" = '" . $user_id . "'";
      $oResult = $this->oConnection->oBd->execute($sSql);
      if (gettype($oResult) == 'object') {
      while ($aLigne = $this->oConnection->oBd->ligneSuivante($oResult)) {
      // stocke le layer id dans la chaine de caractères
      if ($sGroup_id == '')
      $sGroup_id.=$aLigne['group_id'];
      else
      $sGroup_id.=',' . $aLigne['group_id'];
      }
      } else {
      return '';
      }

      return $sGroup_id;
      } */

    /**
     * Get the maps for the group_id
     * @param string $sGroup_id
     * @return array
     */
    function getMaps($sGroup_id) {

        if (empty($sGroup_id)) {
            return array();
        }

        $aValues = $this->aValues;
        $aPath = $this->aPath;
        $properties = $this->aProperties;
        $oConnection = $this->oConnection;
        $filterList = '';

        $sSql = "SELECT map_id, group_id FROM " . $this->aProperties['schema_vmap'] . ".map_group WHERE \"group_id\" in (" . $sGroup_id . ")";
        $oResult = $this->oConnection->oBd->execute($sSql);
        if (gettype($oResult) == 'object') {
            $aLayers_infos = Array();
            while ($aLigne = $this->oConnection->oBd->ligneSuivante($oResult)) {
                // stocke le layer id dans la chaine de caractères
                if ($filterList == '')
                    $filterList .= $aLigne['map_id'];
                else
                    $filterList .= ',' . $aLigne['map_id'];
            }
        } else {
            return Array();
        }

        unset($aValues['my_vitis_id']);
        $aValues['filter'] = 'map_id in (' . $filterList . ')';
        $aValues['attributs'] = 'name|description|theme_name|theme_description|extent_crs_id|map_id|thumbnail|catalog_index';
        $aValues['order_by'] = 'catalog_index';

        $oMaps = new Maps(Array('vmap', 'map'), $aValues, $this->aProperties);
        $oMaps->GET();

        // Transforme $oMaps en tableau de Map
        $aMaps = Array();
        foreach ($oMaps->aObjects as $oMap) {
            $oMap->aFields['url'] = $properties['web_server_name'] . '/' . $properties['services_alias'] . '/vmap/mapjsons/' . $oMap->aFields['map_id'] . '?token=' . $aValues['token'];
            array_push($aMaps, $oMap->aFields);
        }

        return $aMaps;
    }

    /**
     * Get the services avaliables (with the layers params for bing and ign)
     * @return array
     */
    function getServices() {

        $aValues = $this->aValues;
        $aPath = $this->aPath;
        $properties = $this->aProperties;
        $oConnection = $this->oConnection;

        unset($aValues['my_vitis_id']);
        $oServices = new Services(Array('vmap', 'services'), $aValues, $this->aProperties);
        $oServices->GET();

        $aServices['wms'] = Array();
        $aServices['osm'] = Array();
        $aServices['bing'] = Array();
        $aServices['ign'] = Array();
        $aServices['wmts'] = Array();
        $aServices['xyz'] = Array();
        foreach ($oServices->aObjects as $oService) {
            switch ($oService->aFields['service_type_id']) {
                case 'tilewms':
                case 'imagewms':
                    $oService->aFields['url'] = str_replace('[token]', $aValues['token'], $oService->aFields['url']);
                    if (isset($this->aProperties['ms_cgi_url'])) {
                        $oService->aFields['url'] = str_replace('[ms_cgi_url]', $this->aProperties['ms_cgi_url'], $oService->aFields['url']);
                    }
                    array_push($aServices['wms'], $oService->aFields);
                    break;
                case 'wmts':
                    array_push($aServices['wmts'], $oService->aFields);
                    break;
                case 'xyz':
                    array_push($aServices['xyz'], $oService->aFields);
                    break;
                case 'osm':
                    array_push($aServices['osm'], $oService->aFields);
                    break;
                case 'bing':
                    $oService->aFields['imagerySet'] = $oService->aFields['imagery'];
                    $oService->aFields['culture'] = $oService->aFields['lang'];
                    array_push($aServices['bing'], $oService->aFields);
                    break;
                case 'geoportail':
                    break;
            }
        }

        return $aServices;
    }

    function httpPost($url, $params) {
        $postData = '';
        //create name value pairs seperated by &
        foreach ($params as $k => $v) {
            $postData .= $k . '=' . $v . '&';
        }
        $postData = rtrim($postData, '&');

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_POST, count($postData));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);

        $output = curl_exec($ch);

        curl_close($ch);
        return $output;
    }

}

?>
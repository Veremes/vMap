<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file BusinessObject.class.inc
 * \class BusinessObject
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the BusinessObject php class
 *
 * This class defines operation for one BusinessObject
 * 
 */
class BusinessObject extends Vmap {

    public $oError;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function BusinessObject($aPath, $aValues, $properties, $oConnection) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
        $this->aSelectedFields = Array("business_object_id", "title", "id_field", "database", "schema", "table", "sql_summary", "sql_list", "sorted_by", "geom_column", "search_field", "result_field", "search_use_strict", "event_id", "index");
    }

    /**
     * @SWG\Get(path="/businessobjects/{business_object_id}", 
     *   tags={"BusinessObjects"},
     *   summary="Get BusinessObject",
     *   description="Request to get BusinessObject by mode id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="business_object_id",
     *     in="path",
     *     description="id",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="list of attributs",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/businessobjects")
     *     )
     *  )
     */

    /**
     * get informations about table businessobjects
     */
    function GET() {

        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], "business_object", "business_object_id");

        // Formulaire JSON
        $this->aFields['json_form'] = array();
        if (!empty($this->aFields['business_object_id']))
            $businessObjectId = $this->aFields['business_object_id'];
        else
            $businessObjectId = '';
        if (file_exists($this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $businessObjectId . '/forms/published.json')) {
            $form = file_get_contents($this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $businessObjectId . '/forms/published.json');
            array_push($this->aFields['json_form'], json_decode($form));
        }
        if (file_exists($this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $businessObjectId . '/forms/ressources/published.js')) {            
            $this->aFields['json_form_js'] = $this->aProperties['web_server_name'] . '/' . $this->aProperties['ws_data_alias'] . '/vmap/business_object/' . $businessObjectId . '/forms/ressources/published.js';
        }
        if (file_exists($this->aProperties['ws_data_dir'] . '/vmap/business_object/' . $businessObjectId . '/forms/ressources/published.css')) {            
            $this->aFields['json_form_js'] = $this->aProperties['web_server_name'] . '/' . $this->aProperties['ws_data_alias'] . '/vmap/business_object/' . $businessObjectId . '/forms/ressources/published.js';
        }
        if (!empty($this->aFields['geom_column'])) {
            $aGeomColumnsInfos = $this->getTableGeomColumnsInfos($this->aFields['schema'], $this->aFields['table']);
            for ($i = 0; $i < count($aGeomColumnsInfos); $i++) {
                if ($aGeomColumnsInfos[$i]['f_geometry_column'] === $this->aFields['geom_column']) {
                    $this->aFields['geom_type'] = $aGeomColumnsInfos[$i]['type'];
                }
            }
        }
        
        $this->aFields['list_fields'] = $this->getListFields();
    }

    /**
     * Get the fields from the list
     * @return array
     */
    function getListFields() {
        $aFields = array();
        if (!empty($this->aFields['sql_list'])) {
            $sSql = $this->aFields['sql_list'] . ' limit 1';
            $oResult = $this->oConnection->oBd->execute($sSql);
            if (!$this->oConnection->oBd->enErreur()) {
                while ($aLigne = $this->oConnection->oBd->ligneSuivante($oResult)) {
                    foreach ($aLigne as $key => $value) {
                        array_push($aFields, $key);
                    }
                }
            }
        }
        return $aFields;
    }

    /**
     * delete a business_object
     */
    function DELETE() {
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'business_object', 'business_object_id', $this->aValues['my_vitis_id'], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new Error(1, $this->oConnection->oBd->getBDMessage());
        } else {
            $this->aFields['business_object_id'] = $this->aValues['my_vitis_id'];
        }
    }

}

?>
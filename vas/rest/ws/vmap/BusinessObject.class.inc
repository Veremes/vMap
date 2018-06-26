<?php

require_once 'Vmap.class.inc';
require_once 'Layers.class.inc';
require_once 'BusinessObjectEvent.class.inc';
require_once 'PrintReports.class.inc';
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
     * @param type $bShortcut false to reinit variables
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        parent::__construct($aPath, $aValues, $properties, $bShortcut, $oConnection);
        $this->aSelectedFields = Array("business_object_id", "title", "formtitle", "summarytitle", "id_field", "database", "schema", "table", "sql_summary", "sql_list", "sorted_by", "geom_column", "search_field", "result_field", "search_use_strict", "event_id", "index", "add_form_size", "edit_form_size", "display_form_size", "selection_buffer", "user_rights", "max_edition_scale", "min_edition_scale");
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
        if (!empty($this->aFields['database']) && $this->aFields['database'] != $this->oConnection->oBd->base) {
            $sLogin = $this->oConnection->oBd->login;
            $sPassword = $this->oConnection->oBd->mdp;
            $this->oConnection->oBd = new Vm($sLogin, $sPassword, $this->aFields['database'], $this->oConnection->oBd->serveur, $this->oConnection->oBd->port, $this->oConnection->oBd->sgbd, $this->oConnection->oBd->sPageEncoding);
        }

        if (!$this->oConnection->oBd->enErreur()) {
            if (!empty($this->aFields['geom_column'])) {
                $aGeomColumnsInfos = $this->getTableGeomColumnsInfos($this->aFields['schema'], $this->aFields['table']);
                for ($i = 0; $i < count($aGeomColumnsInfos); $i++) {
                    if ($aGeomColumnsInfos[$i]['f_geometry_column'] === $this->aFields['geom_column']) {
                        $this->aFields['geom_type'] = $aGeomColumnsInfos[$i]['type'];
                    }
                }
            }
            $this->aFields['user_rights'] = $this->oConnection->getTableRights($this->aFields['schema'], $this->aFields['table']);
            $this->aFields['list_fields'] = $this->getListFields();
        }

        if (!empty($sLogin) && isset($sPassword)) {
            $this->oConnection->oBd = new Vm($sLogin, $sPassword, $this->aProperties['database'], $this->aProperties['server'], $this->aProperties['port'], $this->aProperties['sgbd'], $this->aProperties['page_encoding']);
        }
    }

    /**
     * Get the fields from the list
     * @return array
     */
    function getListFields() {
        $aFields = array();
        if (!empty($this->aFields['sql_list'])) {
            $sSql = $this->aFields['sql_list'] . ' limit 1';
            $oResult = $this->oConnection->oBd->executeWithParams($sSql, array());
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

        $this->GET();
        $bEventExists = false;
        $bReportExists = false;
        $bLayerExists = false;

        // Test existance rapports
        $aPath = Array('vmap', 'printreports');
        $aValues = $this->aValues;
        unset($aValues['my_vitis_id']);
        // $aValues['filter'] = "business_object_id='" . $this->aFields['business_object_id'] . "'";
        $aValues['filter'] = '{"column":"business_object_id","compare_operator":"=","value":"' . $this->aFields['business_object_id'] . '"}';
        $oPrintReports = new PrintReports($aPath, $aValues, $this->aProperties, $this->oConnection);
        $oPrintReports->GET();
        if (count($oPrintReports->aObjects) > 0) {
            $this->oError = new VitisError(1, 'ERROR_BO_DELETE_REPPORT');
            $bReportExists = true;
        }

        // Test existance événement
        if (isset($this->aFields['event_id']) && !empty($this->aFields['event_id'])) {
            $aPath = Array('vmap', 'businessobjectevents', $this->aFields['event_id']);
            $aValues = $this->aValues;
            $aValues['my_vitis_id'] = $this->aFields['event_id'];
            $oEvent = new BusinessObjectEvent($aPath, $aValues, $this->aProperties, $this->oConnection);
            $oEvent->GET();

            // L'événement existe
            if (isset($oEvent->aFields['event_id']) && !empty($oEvent->aFields['event_id'])) {
                $this->oError = new VitisError(1, 'ERROR_BO_DELETE_EVENT');
                $bEventExists = true;
            }
        }

        // Des-associe les objets métiers de la couche
        require $this->sRessourcesFile;
        $aSQLParams = array(
            'sSchemaVmap' => array('value' => $this->aProperties['schema_vmap'], 'type' => 'column_name'),
            'business_object_id' => array('value' => $this->aValues['my_vitis_id'], 'type' => 'number')
        );
        $oResult = $this->oConnection->oBd->executeWithParams($aSql['deleteAssociatedLayers'], $aSQLParams);

        // Suppression objet
        if (!$bEventExists && !$bReportExists && !$bLayerExists) {
            $this->aFields = array();
            $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'business_object', 'business_object_id', $this->aValues['my_vitis_id'], 'text');
            if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
            } else {
                $this->aFields['business_object_id'] = $this->aValues['my_vitis_id'];
            }
        }
    }

}

?>
<?php

require_once __DIR__ . '/Anc.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Evacuation_eaux.class.inc
 * \class Evacuation_eaux
 *
 * \author WAB <support.wab@veremes.com>.
 *
 * 	\brief This file contains the Evacuation_eaux php class
 *
 * This class defines operation for one Evacuation_eaux
 * 
 */
class Evacuation_eaux extends Anc {

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
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
    }

    /**
     * @SWG\Get(path="/evacuation_eauxs/{id_evacuation_eaux}", 
     *   tags={"Evacuation_eauxs"},
     *   summary="Get Evacuation_eaux",
     *   description="Request to get Evacuation_eaux by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="id_evacuation_eaux",
     *     in="path",
     *     description="id_evacuation_eaux",
     *     required=true,
     *     type="integer",
     *   format="int32"
     *   ),
     * @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="list of attributs",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Evacuation_eaux Response",
     *         @SWG\Schema(ref="#/definitions/evacuation_eauxs")
     *     )
     *  )
     */

    /**
     * get informations about mode
     */
    function GET() {
        $this->aFields = $this->getFields($this->aProperties['schema_anc'], "v_evacuation_eaux", "id_eva");
        // Url des fichiers.
        $sWsDataUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['ws_data_alias'] . '/anc/anc_saisie_anc_evacuation_eaux/documents/' . $this->aValues["my_vitis_id"];
        if (!empty($this->aFields['photos_f']))
            $this->aFields['photos_f'] = $sWsDataUrl . '/photos_f/' . $this->aFields['photos_f'];
        if (!empty($this->aFields['fiche_f']))
            $this->aFields['fiche_f'] = $sWsDataUrl . '/fiche_f/' . $this->aFields['fiche_f'];
        if (!empty($this->aFields['schema_f']))
            $this->aFields['schema_f'] = $sWsDataUrl . '/schema_f/' . $this->aFields['schema_f'];
        if (!empty($this->aFields['documents_f']))
            $this->aFields['documents_f'] = $sWsDataUrl . '/documents_f/' . $this->aFields['documents_f'];
        if (!empty($this->aFields['plan_f']))
            $this->aFields['plan_f'] = $sWsDataUrl . '/plan_f/' . $this->aFields['plan_f'];
    }

    /**
     * delete a Point_situation
     */
    function DELETE() {
        $this->oConnection->oBd->delete($this->aProperties['schema_anc'], 'v_evacuation_eaux', 'id_eva', $this->aValues["my_vitis_id"], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
            $this->aFields["id_eva"] = $this->aValues["my_vitis_id"];
        }
    }

}

?>
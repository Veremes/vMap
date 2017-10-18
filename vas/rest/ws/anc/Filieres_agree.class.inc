<?php

require_once __DIR__ . '/Anc.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Filieres_agree.class.inc
 * \class Filieres_agree
 *
 * \author WAB <support.wab@veremes.com>.
 *
 * 	\brief This file contains the Filieres_agree php class
 *
 * This class defines operation for one Filieres_agree
 * 
 */
class Filieres_agree extends Anc {

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
     * @SWG\Get(path="/filieres_agrees/{id_filieres_agree}", 
     *   tags={"Filieres_agrees"},
     *   summary="Get Filieres_agree",
     *   description="Request to get Filieres_agree by id",
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
     *     name="id_filieres_agree",
     *     in="path",
     *     description="id_filieres_agree",
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
     *         description="Filieres_agree Response",
     *         @SWG\Schema(ref="#/definitions/filieres_agrees")
     *     )
     *  )
     */

    /**
     * get informations about mode
     */
    function GET() {
        $this->aFields = $this->getFields($this->aProperties['schema_anc'], "v_filieres_agrees", "id_fag");
        // Url des fichiers.
        $sWsDataUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['ws_data_alias'] . '/anc/anc_saisie_anc_filieres_agree/documents/' . $this->aValues["my_vitis_id"];
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
        $this->oConnection->oBd->delete($this->aProperties['schema_anc'], 'v_filieres_agrees', 'id_fag', $this->aValues["my_vitis_id"], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
            $this->aFields["id_fag"] = $this->aValues["my_vitis_id"];
        }
    }

}

?>
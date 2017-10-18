<?php

require_once __DIR__ . '/Anc.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Entreprise.class.inc
 * \class Entreprise
 *
 * \author WAB <support.wab@veremes.com>.
 *
 * 	\brief This file contains the Entreprise php class
 *
 * This class defines operation for one Entreprise
 * 
 */
class Entreprise extends Anc {

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
        $this->aSelectedFields = Array("id_parametre_entreprises", "id_com", "siret", "raison_sociale", "nom_entreprise", "nom_contact", "telephone_fixe", "telephone_mobile", "web", "mail", "code_postal", "voie", "bureau_etude", "concepteur", "constructeur", "installateur", "vidangeur", "en_activite", "observations", "creat", "creat_date", "maj", "maj_date", "geom");
    }

    /**
     * @SWG\Get(path="/entreprises/{id_entreprise}", 
     *   tags={"Entreprises"},
     *   summary="Get Entreprise",
     *   description="Request to get Entreprise by id",
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
     *     name="id_entreprise",
     *     in="path",
     *     description="id_entreprise",
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
     *         description="Entreprise Response",
     *         @SWG\Schema(ref="#/definitions/entreprises")
     *     )
     *  )
     */

    /**
     * get informations about mode
     */
    function GET() {
        $this->aFields = $this->getFields($this->aProperties['schema_anc'], "param_entreprise", "id_parametre_entreprises");
    }

    /**
     * delete a Point_situation
     */
    function DELETE() {
        $this->oConnection->oBd->delete($this->aProperties['schema_anc'], 'param_entreprise', 'id_parametre_entreprises', $this->aValues["my_vitis_id"], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
            $this->aFields["id_parametre_entreprises"] = $this->aValues["my_vitis_id"];
        }
    }

}

?>
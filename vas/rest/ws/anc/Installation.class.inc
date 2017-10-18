<?php

require_once __DIR__ . '/Anc.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Installation.class.inc
 * \class Installation
 *
 * \author WAB <support.wab@veremes.com>.
 *
 * 	\brief This file contains the Installation php class
 *
 * This class defines operation for one Installation
 * 
 */
class Installation extends Anc {

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
        $this->aSelectedFields = Array("id_installation", "id_com", "id_parc", "parc_sup", "parc_parcelle_associees", "parc_adresse", "code_postal", "parc_commune", "prop_titre", "prop_nom_prenom", "prop_adresse", "prop_code_postal", "prop_commune", "prop_tel", "prop_mail", "bati_type", "bati_ca_nb_pp", "bati_ca_nb_eh", "bati_ca_nb_chambres", "bati_ca_nb_autres_pieces", "bati_ca_nb_occupant", "bati_nb_a_control", "bati_date_achat", "bati_date_mutation", "cont_zone_enjeu", "cont_zone_sage", "cont_zone_autre", "cont_zone_urba", "cont_zone_anc", "cont_alim_eau_potable", "cont_puits_usage", "cont_puits_declaration", "cont_puits_situation", "cont_puits_terrain_mitoyen", "observations", "maj", "maj_date", "create", "create_date", "archivage", "geom", "photo_f", "document_f", "num_dossier", "commune", "section", "parcelle", "nb_controle", "last_date_control", "cl_avis", "next_control", "classement_installation");
    }

    /**
     * @SWG\Get(path="/installations/{id_installation}", 
     *   tags={"Installations"},
     *   summary="Get Installation",
     *   description="Request to get Installation by id",
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
     *     name="id_installation",
     *     in="path",
     *     description="id_installation",
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
     *         description="Installation Response",
     *         @SWG\Schema(ref="#/definitions/installations")
     *     )
     *  )
     */

    /**
     * get informations about mode
     */
    function GET() {
        $this->aFields = $this->getFields($this->aProperties['schema_anc'], "v_installation", "id_installation");
        // Url des fichiers.
        if (!empty($this->aFields['photo_f']))
            $this->aFields['photo_f'] = $this->aProperties['web_server_name'] . '/' . $this->aProperties['ws_data_alias'] . '/anc/anc_saisie_anc_installation/documents/' . $this->aValues["my_vitis_id"] . '/photo_f/' . $this->aFields['photo_f'];
        if (!empty($this->aFields['document_f']))
            $this->aFields['document_f'] = $this->aProperties['web_server_name'] . '/' . $this->aProperties['ws_data_alias'] . '/anc/anc_saisie_anc_installation/documents/' . $this->aValues["my_vitis_id"] . '/document_f/' . $this->aFields['document_f'];
    }

    /**
     * delete a Point_situation
     */
    function DELETE() {
        $this->oConnection->oBd->delete($this->aProperties['schema_anc'], 'v_installation', 'id_installation', $this->aValues["my_vitis_id"], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
            $this->aFields["id_installation"] = $this->aValues["my_vitis_id"];
        }
    }

}

?>
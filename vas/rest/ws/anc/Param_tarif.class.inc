<?php

require_once __DIR__ . '/Anc.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Param_tarif.class.inc
 * \class Param_tarif
 *
 * \author WAB <support.wab@veremes.com>.
 *
 * 	\brief This file contains the Param_tarif php class
 *
 * This class defines operation for one Param_tarif
 * 
 */
class Param_tarif extends Anc {

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
        $this->aSelectedFields = Array("id_parametre_tarif", "id_com", "controle_type", "montant", "annee_validite", "devise", "libelle_montant");
    }

    /**
     * @SWG\Get(path="/param_tarifs/{id_param_tarif}", 
     *   tags={"Param_tarifs"},
     *   summary="Get Param_tarif",
     *   description="Request to get Param_tarif by id",
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
     *     name="id_param_tarif",
     *     in="path",
     *     description="id_param_tarif",
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
     *         description="Param_tarif Response",
     *         @SWG\Schema(ref="#/definitions/param_tarifs")
     *     )
     *  )
     */

    /**
     * get informations about mode
     */
    function GET() {
        $this->aFields = $this->getFields($this->aProperties['schema_anc'], "v_param_tarif", "id_parametre_tarif");
    }

    /**
     * delete a Point_situation
     */
    function DELETE() {
        $this->oConnection->oBd->delete($this->aProperties['schema_anc'], 'param_tarif', 'id_parametre_tarif', $this->aValues["my_vitis_id"], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
            $this->aFields["id_parametre_tarif"] = $this->aValues["my_vitis_id"];
        }
    }

}

?>
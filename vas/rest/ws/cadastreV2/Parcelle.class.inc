<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Parcelle.class.inc
 * \class Parcelle
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Parcelle php class
 *
 * This class defines operation for one Parcelle
 * 
 */
class Parcelle extends Cadastre {

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
        $this->aSelectedFields = Array("id_com", "id_sec", "code_com", "commune", "parcelle", "section", "pre", "coar", "indp", "idu", "id_par", "sup_fiscale", "numero", "feuille", "geom");
    }

    /**
     * @SWG\Get(path="/parcelles/{id_par}", 
     *   tags={"Parcelle"},
     *   summary="Get Parcelle",
     *   description="Request to get Parcelle by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="id_par",
     *     in="path",
     *     description="parcelle id",
     *     required=true,
     *     type="integer",
     *   format="int32"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/parcelle")
     *     )
     *  )
     */

    /**
     * get informations about Parcelle
     */
    function GET() {
        require __DIR__ . "/../vitis/" . $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_cadastre'], 'v_vmap_parcelle', 'id_par', 'vmap_cadastre_user', 'vmap_cadastre_user');
    }

}

?>
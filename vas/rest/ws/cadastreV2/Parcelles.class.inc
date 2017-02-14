<?php

/**
 * \file Parcelles.class.inc
 * \class Parcelles
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Parcelles php class
 *
 * This class defines Rest Api to Vmap Parcelles
 * 
 */
require_once 'Cadastre.class.inc';
require_once 'Parcelle.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class Parcelles extends Cadastre {
    /**
     * @SWG\Definition(
     *   definition="/parcelles",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/parcelles")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Parcelles",
     *   description="Operations about Parcelles"
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function Parcelles($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->aSelectedFields = Array("id_com", "id_sec", "substring (id_com, 3, 3) as code_com", "commune", "parcelle", "section", "pre", "coar", "indp", "substring (id_par, 3, 12) as idu", "id_par", "sup_fiscale", "numero", "feuille", "geom");
    }

    /**
     * @SWG\Get(path="/parcelles",
     *   tags={"Parcelle"},
     *   summary="Get Parcelles",
     *   description="Request to get Parcelles",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="order_by",
     *     in="query",
     *     description="list of ordering fields",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sort_order",
     *     in="query",
     *     description="sorted direction",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="limit",
     *     in="query",
     *     description="number of element",
     *     required=false,
     *     type="integer",
     *     default="4",
     *     format="int32"
     *   ),
     * @SWG\Parameter(
     *     name="offset",
     *     in="query",
     *     description="index of first element",
     *     required=false,
     *     type="string",
     *     format="int32"
     *   ),
     * @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="list of attributs",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="filter",
     *     in="query",
     *     description="filter results",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="distinct",
     *     in="query",
     *     description="delete duplicates",
     *     required=false,
     *     type="boolean"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/parcelles")
     *     )
     *  )
     */

    /**
     * get Parcelles
     * @return  Parcelles
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_cadastre'], 'v_vmap_parcelle', 'id_par');
        return $aReturn['sMessage'];
    }

}

?>
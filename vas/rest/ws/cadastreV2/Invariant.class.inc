<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Invariant.class.inc
 * \class Invariant
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Invariant php class
 *
 * This class defines operation for one Invariant
 * 
 */
class Invariant extends Cadastre {

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
        $this->aSelectedFields = Array('id_local', 'id_local as ID_BAT', 'id_com as ID_COM', 'invar as INVAR', 'dnupro as DNUPRO', 'id_par as ID_PAR', 'ccosec as CCOSEC', 'dnupla as DNUPLA');
    }

    /**
     * @SWG\Get(path="/invariants/{ID_BAT}", 
     *   tags={"Invariant"},
     *   summary="Get Invariant",
     *   description="Request to get Invariant by id",
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
     *     name="ID_BAT",
     *     in="path",
     *     description="invariant id",
     *     required=true,
     *     type="integer",
     *   format="int32"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/invariant")
     *     )
     *  )
     */

    /**
     * get informations about Invariant
     */
    function GET() {
        require __DIR__ . "/../vitis/" . $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_majic'], $this->aProperties['cadastre']['views']['invariant'], 'id_local', 'vmap_cadastre_user', 'vmap_cadastre_user');
    }

}

?>
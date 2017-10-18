<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Voie.class.inc
 * \class Voie
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Voie php class
 *
 * This class defines operation for one Voie
 * 
 */
class Voie extends Cadastre {

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
        $this->aSelectedFields = Array('libcom as LIBCOM1', 'id_com as ID_COM', 'id_voie as ID_RIVOLI', 'ccodep as CCODEP', 'ccodir as CCODIR', 'ccocom as CCOCOM', 'rivoli as RIVOLI', 'clerivoli as CLERIVOLI', 'libvoie as LIBVOIE', 'typcom as TYPCOM', 'rur as RUR', 'carvoie as CARVOIE', 'annulation as ANNULATION', 'dateannul as DATEANNUL', 'datecrea as DATECREA', 'majic2 as MAJIC2', 'typevoie as TYPEVOIE', 'indic as INDIC', 'motclass as MOTCLASS', 'nature as NATURE', 'l_nature_voie as L_NATURE_VOIE');
    }

    /**
     * @SWG\Get(path="/voies/{ID_RIVOLI}", 
     *   tags={"Voie"},
     *   summary="Get Voie",
     *   description="Request to get Voie by id",
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
     *     name="ID_RIVOLI",
     *     in="path",
     *     description="voie id",
     *     required=true,
     *     type="integer",
     *   format="int32"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Voie Response",
     *         @SWG\Schema(ref="#/definitions/voie")
     *     )
     *  )
     */

    /**
     * get informations about Voie
     */
    function GET() {
        require __DIR__ . "/../vitis/" . $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_majic'], $this->aProperties['cadastre']['views']['voie'], 'id_voie');
    }

}

?>
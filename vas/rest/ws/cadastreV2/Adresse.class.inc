<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Adresse.class.inc
 * \class Adresse
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Adresse php class
 *
 * This class defines operation for one Adresse
 * 
 */
class Adresse extends Cadastre {

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
        $this->aSelectedFields = Array(id_par, 'id_com as ID_COM', 'id_par as ID_PAR', 'ccodep as CCODEP', 'ccodir as CCODIR', 'ccocom as CCOCOM', 'ccopre as CCOPRE', ' ccosec as CCOSEC', 'dnupla as DNUPLA', 'cenr as CENR', 'dcntpa as DCNTPA', 'dsrpar as DSRPAR', 'dnupro as DNUPRO', 'jdatat as JDATAT', 'dreflf as DREFLF', 'gpdl as GPDL', 'cprsecr as CPRSECR', 'ccosecr as CCOSECR', 'dnuplar as DNUPLAR', 'dnupdl as DNUPDL', 'gurbpa as GURBPA', 'dparpi as DPARPI', 'ccoarp as CCOARP', 'gparnf as GPARNF', 'gparbat as GPARBAT', 'ccovoi as CCOVOI', 'ccoriv as CCORIV', 'ccocif as CCOCIF', 'id_voie as ID_RIVOLI', 'id_dnupro as ID_DNUPRO', 'dnvoiri as DNVOIRI', 'dindic as DINDIC', 'l_nature_voie as L_NATURE_VOIE', 'dvoilib as DVOILIB');
    }

    /**
     * @SWG\Get(path="/adresses/{ID_PAR}", 
     *   tags={"Adresse"},
     *   summary="Get Adresse",
     *   description="Request to get Adresse by id",
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
     *     name="ID_PAR",
     *     in="path",
     *     description="adresse id",
     *     required=true,
     *     type="integer",
     *   format="int32"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/adresse")
     *     )
     *  )
     */

    /**
     * get informations about Adresse
     */
    function GET() {
        require __DIR__ . "/../vitis/" . $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_majic'], $this->aProperties['cadastre']['views']['adresse'], 'id_par');
    }

}

?>
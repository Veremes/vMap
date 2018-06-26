<?php

/**
 * \file DescriptionParcelles.class.inc
 * \class DescriptionParcelles
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the DescriptionParcelles php class
 *
 * This class defines Rest Api to Vmap DescriptionParcelles
 * 
 */
require_once 'Cadastre.class.inc';
require_once 'DescriptionParcelle.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class DescriptionParcelles extends Cadastre {
    /**
     * @SWG\Definition(
     *   definition="/descriptionparcelles",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/descriptionparcelles")
     *   }
     * )
     * * @SWG\Tag(
     *   name="DescriptionParcelles",
     *   description="Operations about DescriptionParcelles"
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $bShortcut false to reinit variables
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        parent::__construct($aPath, $aValues, $properties, $bShortcut, $oConnection);
        $this->aSelectedFields = Array('id_par', 'id_com as ID_COM', 'id_par as ID_PAR', 'ccodep as CCODEP', 'ccodir as CCODIR', 'ccocom as CCOCOM', 'ccopre as CCOPRE', 'ccosec as CCOSEC', 'dnupla as DNUPLA', 'cenr as CENR', 'dcntpa as DCNTPA', 'dsrpar as DSRPAR', ' dnupro as DNUPRO', 'jdata as JDATAT', 'dreflf as DREFLF', 'gpdl as GPDL', 'cprsecr as CPRSECR', 'ccosecr as CCOSECR', 'dnuplar as DNUPLAR', 'dnupdl as DNUPDL', 'gurbpa as GURBPA', 'dparpi as DPARPI', 'ccoarp as CCOARP', 'gparnf as GPARNF', 'gparbat as  GPARBAT', 'ccovoi as CCOVOI', 'ccoriv as CCORIV', 'ccocif as CCOCIF', 'id_voie as ID_RIVOLI', 'id_dnupro as ID_DNUPRO', 'dnvoiri as DNVOIRI', 'dindic as DINDIC', 'l_nature_voie as L_NATURE_VOIE', 'dvoilib as DVOILIB');
    }

    /**
     * @SWG\Get(path="/descriptionparcelles",
     *   tags={"Parcelle"},
     *   summary="Get DescriptionParcelles",
     *   description="Request to get DescriptionParcelles",
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
     *         @SWG\Schema(ref="#/definitions/descriptionparcelles")
     *     )
     *  )
     */

    /**
     * get DescriptionParcelles
     * @return  DescriptionParcelles
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_majic'], $this->aProperties['cadastre']['views']['description_parcelle'], 'ID_PAR');
        return $aReturn['sMessage'];
    }

}

?>
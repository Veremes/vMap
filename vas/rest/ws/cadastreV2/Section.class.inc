<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Section.class.inc
 * \class Section
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Section php class
 *
 * This class defines operation for one Section
 * 
 */
class Section extends Cadastre {

    public $oError;

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
        $this->aSelectedFields = Array("id_com", "id_sec", "code_com", "commune", "section", "pre", "idu", "texte", "geom");
    }

    /**
     * @SWG\Get(path="/sections/{id_sec}", 
     *   tags={"Section"},
     *   summary="Get Section",
     *   description="Request to get Section by id",
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
     *     name="id_sec",
     *     in="path",
     *     description="section id",
     *     required=true,
     *     type="integer",
     *   format="int32"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Section Response",
     *         @SWG\Schema(ref="#/definitions/section")
     *     )
     *  )
     */

    /**
     * get informations about Section
     */
    function GET() {
        require __DIR__ . "/../vitis/" . $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_cadastre'], $this->aProperties['cadastre']['views']['section'], 'id_sec', 'vmap_cadastre_user', 'vmap_cadastre_user');
    }

}

?>
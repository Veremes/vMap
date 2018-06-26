<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file LayerTheme.class.inc
 * \class LayerTheme
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the LayerTheme php class
 *
 * This class defines operation for one LayerTheme
 * 
 */
class LayerTheme extends Vmap {

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
        $this->aSelectedFields = Array("layertheme_id", "name", "description");
    }

    /**
     * @SWG\Get(path="/layerthemes/{layertheme_id}", 
     *   tags={"LayerThemes"},
     *   summary="Get LayerTheme",
     *   description="Request to get LayerTheme by id",
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
     *     name="layertheme_id",
     *     in="path",
     *     description="",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layerthemes")
     *     )
     *  )
     */

    /**
     * get informations about layerthemes
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'layertheme', 'layertheme_id');
    }
    
    /**
     * delete a layertheme
     */
    function DELETE(){
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'layertheme', 'layertheme_id', $this->aValues['my_vitis_id'], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
                $this->aFields['layertheme_id'] = $this->aValues['my_vitis_id'];
        }
    }
}

?>
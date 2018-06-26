<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Service.class.inc
 * \class Service
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Service php class
 *
 * This class defines operation for one Service
 * 
 */
class Service extends Vmap {

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
        $this->aSelectedFields = Array("service_id", "name", "service_type_id", "description", "url", "key", "thumbnail", "lang", "imagery", "service_type_version", "service_type_type", "service_options", "service_vm4ms", "service_login", "service_password");
    }

    /**
     * @SWG\Get(path="/services/{service_id}", 
     *   tags={"Services"},
     *   summary="Get Service",
     *   description="Request to get Service by id",
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
     *     name="service_id",
     *     in="path",
     *     description="",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/services")
     *     )
     *  )
     */

    /**
     * get informations about Service
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'service', 'service_id');

        // Remplace les balises
        $this->aFields['url'] = str_replace('[ms_cgi_url]', $this->aProperties['ms_cgi_url'], $this->aFields['url']);
    }

    /**
     * delete a theme
     */
    function DELETE() {
        // Supprime la vignette.
        $oService = new Service($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
        $oService->GET();
        if (!empty($oService->aFields['thumbnail'])) {
            $sFile = $oService->aProperties['dir_export'] . '/vmap/' . $oService->aFields['thumbnail'];
            if (file_exists($sFile))
                unlink($sFile);
        }
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'service', 'service_id', $this->aValues['my_vitis_id'], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
            $this->aFields['theme_id'] = $this->aValues['my_vitis_id'];
        }
    }

}

?>

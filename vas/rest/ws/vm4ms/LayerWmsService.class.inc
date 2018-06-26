<?php

require_once 'Vmap4MapServer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file LayerWmsService.class.inc
 * \class LayerWmsService
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the LayerWmsService php class
 *
 * This class defines operation for one  wms service layer
 * 
 */
class LayerWmsService extends Vmap4MapServer {

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
        $this->aSelectedFields = Array("ms_layer_id", "name", "title", "coordsys_id", "source_id", "connection_id", "tableschema", "tablename", "tableidfield", "definition", "opacity", "active", "ms_layertype_id", "wmsservices", "wmsservices_label", "private_connection", "connection_label", "source_label", "definitiontmp");
    }

    /**
     * @SWG\Get(path="/layerwmsservices/{ms_layer_id}", 
     *   tags={"LayerWmsServices"},
     *   summary="Get layer",
     *   description="Request to get layer by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     *   @SWG\Parameter(
     *     name="ms_layer_id",
     *     in="path",
     *     description="layer id",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/layerwmsservices")
     *     )
     *  )
     */

    /**
     * get informations about wms service layer
     */
    function GET() {
        require $this->sRessourcesFile;
        // Infos de la couche.
        $aParams['sSchemaVm4ms'] = array('value' => $this->aProperties['schema_vm4ms'], 'type' => 'schema_name');
        $aParams['ms_layer_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'number');
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getLayer'], $aParams);
        if ($this->oConnection->oBd->nombreLigne($oPDOresult) > 0) {
            $this->aFields = $this->oConnection->oBd->ligneSuivante($oPDOresult);
            // Flux wms rattachés à la couche.
            if (in_array("wmsservices", $this->aSelectedFields)) {
                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getLayerWmsServices'], $aParams);
                $sListWmsServiceId = "";
                $aListWmsServiceName = array();
                while ($aLigne = $this->oConnection->oBd->ligneSuivante($oPDOresult)) {
                    if ($sListWmsServiceId == "")
                        $sListWmsServiceId = $aLigne["wmsservice_id"];
                    else
                        $sListWmsServiceId .= "|" . $aLigne["wmsservice_id"];
                    $aListWmsServiceName[] = $aLigne["wmsservice_id"];
                }
                $oPDOresult = $this->oConnection->oBd->fermeResultat();
                $this->aFields['wmsservices'] = $sListWmsServiceId;
                $this->aFields['wmsservices_label'] = implode(',', $aListWmsServiceName);
            }
        }
    }

    /**
     * delete a wms service layer
     */
    function DELETE() {
        
    }

}

?>
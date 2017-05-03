<?php

require_once 'Vmap4MapServer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file PrivateLayer.class.inc
 * \class PrivateLayer
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the PrivateLayer php class
 *
 * This class defines operation for one private layer
 * 
 */
class PrivateLayer extends Vmap4MapServer {

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
		$this->aSelectedFields = Array("ms_layer_id", "name", "title", "coordsys_id", "source_id", "connection_id", "tableschema", "tablename", "tableidfield", "definition", "opacity", "active", "ms_layertype_id", "wmsservices", "wmsservices_label", "private_connection");
    }

    /**
     * get informations about private layer
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vm4ms'], 'v_private_ms_layer', 'ms_layer_id');
        /*
        // Flux wms rattachés à la couche.
        if (in_array("wmsservices", $this->aSelectedFields)){
            $sSql = str_replace('[sSchemaVm4ms]', $this->aProperties['schema_vm4ms'], $aSql['getPrivateLayerWmsServices']);
            $sSql = str_replace('[ms_layer_id]', $this->aValues['my_vitis_id'], $sSql);
		$oPDOresult =$this->oConnection->oBd->execute ($sSql);
		$sListWmsServiceId = "";
		$aListWmsServiceName = array();
		while($aLigne=$this->oConnection->oBd->ligneSuivante ($oPDOresult)) {
			if ($sListWmsServiceId == ""){
				$sListWmsServiceId = $aLigne["wmsservice_id"];
			}else{
				$sListWmsServiceId .= "|".$aLigne["wmsservice_id"];
			}
                        $aListWmsServiceName[] = $aLigne["wmsservice_id"];
		}
		$oPDOresult=$this->oConnection->oBd->fermeResultat();
                $this->aFields['wmsservices'] = $sListWmsServiceId;
                $this->aFields['wmsservices_label'] = implode(',', $aListWmsServiceName);
        }
        */
    }
    
    /**
     * delete a private layer
     */
    function DELETE() {
        /*
        require $this->sRessourcesFile;
        $this->oConnection->oBd->delete($this->aProperties['schema_vm4ms'], 'ms_layer', 'ms_layer_id', $this->aValues['my_vitis_id'], 'string');
        if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
                $this->aFields['ms_layer_id'] = $this->aValues['my_vitis_id'];
        }
        */
    }
}

?>
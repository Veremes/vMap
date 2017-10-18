<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Map.class.inc
 * \class Map
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Map php class
 *
 * This class defines operation for one Map
 * 
 */
class Map extends Vmap {

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
		$this->aSelectedFields = Array("map_id", "crs_id", "name", "description", "crs_name", "extent", "catalog_index", "thumbnail", "theme_name", "theme_description", "maptheme_id", "groups");
    }

    /**
     * @SWG\Get(path="/maps/{map_id}", 
     *   tags={"Maps"},
     *   summary="Get Map",
     *   description="Request to get Map by id",
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
     *     name="map_id",
     *     in="path",
     *     description="map id",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/maps")
     *     )
     *  )
     */

    /**
     * get informations about Map
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'v_map', 'map_id');
        $this->getGroups();
    }

    /**
     *  get groups of map
     */
    function getGroups() {
        require $this->sRessourcesFile;
        if (in_array("groups", $this->aSelectedFields)){
            $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
            $aParams['sSchemaVmap'] = array('value' => $this->aProperties['schema_vmap'], 'type' => 'schema_name');
            $aParams['map_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'number');
            $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getMapGroups'], $aParams);
            $sListGroupId = "";
            $aListGroupName = array();
            while($aLigne=$this->oConnection->oBd->ligneSuivante ($oPDOresult)) {
                    if ($sListGroupId == ""){
                            $sListGroupId = $aLigne["group_id"];
                    }else{
                            $sListGroupId .= "|".$aLigne["group_id"];
                    }
                    $aListGroupName[] = $aLigne["name"];
            }
            $oPDOresult=$this->oConnection->oBd->fermeResultat();
            $this->aFields['groups'] = $sListGroupId;
            $this->aFields['groups_label'] = implode(',', $aListGroupName);
        }
    }
    
    /**
     * delete a map
     */
    function DELETE() {
        // Supprime la vignette.
        $oMap = new Map($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
        $oMap->GET();
        if (!empty($oMap->aFields['thumbnail'])) {
            $sFile = $oMap->aProperties['dir_export'] . '/vmap/' . $oMap->aFields['thumbnail'];
            if (file_exists($sFile))
                unlink($sFile);
        }
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'map', 'map_id', $this->aValues['my_vitis_id'], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
                $this->aFields['map_id'] = $this->aValues['my_vitis_id'];
        }
    }
}

?>
<?php

require_once 'Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once 'Tab.class.inc';
require_once 'Mode.class.inc';

/**
 * \file VitisSection.class.inc
 * \class VitisSection
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the VitisSection php class
 *
 * This class defines operation for one VitisSection
 * 
 */
class VitisSection extends Vitis {

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
        $this->aSelectedFields = Array("section_id", "tab_id", "event", "index", "label", "name", "link_table_name", "template", "ressource_id");
    }

    /**
     * @SWG\Get(path="/vitissections/{section_id}", 
     *   tags={"VitisSections"},
     *   summary="Get VitisSection",
     *   description="Request to get VitisSection by mode id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="section_id",
     *     in="path",
     *     description="section_id name",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="list of attributs",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/vitissections")
     *     )
     *  )
     */

    /**
     * get informations about table v_sections
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_framework'], "v_section", "section_id");

        if (empty($this->aFields['ressource_id'])) {
            if (!empty($this->aFields['tab_id'])) {

                $aTabPath = array("vitis", "tabs", $this->aFields['tab_id']);
                $aTabValues = $this->aValues;
                $aTabValues['my_vitis_id'] = $this->aFields['tab_id'];

                $oTab = new Tab($aTabPath, $aTabValues, $this->aProperties, $this->oConnection);
                $oTab->GET();

                $aTabFields = $oTab->aFields;
                
                $this->aFields['ressource_id'] = $aTabFields['ressource_id'];
                $this->aFields['mode_id'] = $aTabFields['mode_id'];
                $this->aFields['tab_name'] = $aTabFields['name'];
                $this->aFields['sorted_by'] = $aTabFields['sorted_by'];
                
                $aModePath = array("vitis", "modes", $aTabFields['mode_id']);
                $aModeValues = $this->aValues;
                $aModeValues['my_vitis_id'] = $aTabFields['mode_id'];
                
                $oMode = new Mode($aModePath, $aModeValues, $this->aProperties, $this->oConnection);
                $oMode->GET();
                
                $aModeFields = $oMode->aFields;                
                $this->aFields['module_name'] = $aModeFields['module_name'];
                $this->aFields['application_name'] = $aModeFields['application_name'];
            }
        }
    }

}

?>
<?php

require_once 'Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Mode.class.inc
 * \class Mode
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the Mode php class
 *
 * This class defines operation for one Mode
 * 
 */
class Mode extends Vitis {

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
        $this->aSelectedFields = Array("mode_id", "index", "application_name", "module_name", "objects");
    }

    /**
     * @SWG\Get(path="/modes/{mode_id}", 
     *   tags={"Modes"},
     *   summary="Get Mode",
     *   description="Request to get Mode by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="mode_id",
     *     in="path",
     *     description="user id",
     *     required=true,
     *     type="integer",
     *   format="int32"
     *   ),
     * @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="list of attributs",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/modes")
     *     )
     *  )
     */

    /**
     * get informations about mode
     */
    function GET() {
        require $this->sRessourcesFile;        
        $this->aFields = $this->getFields($this->aProperties['schema_framework'], "v_mode", "mode_id");
        $aValues = array("filter" => "mode_id='" . $this->aFields["mode_id"]."'", "token" => $this->aValues['token']);
        require_once'Tabs.class.inc';
        $oTabs = new Tabs($this->aPath, $aValues, $this->aProperties);
        $oTabs->GET();
        array_push($this->aObjects, $oTabs);
    }

}

?>
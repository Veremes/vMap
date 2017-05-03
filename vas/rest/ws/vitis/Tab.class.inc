<?php

require_once 'Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Tab.class.inc
 * \class Tab
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the Tab php class
 *
 * This class defines operation for one Tab
 * 
 */
class Tab extends Vitis {

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
        $this->aSelectedFields = Array("label", "event", "tab_id", "mode_id", "index", "lang", "ressource_id", "show_column", "edit_column", "sorted_by", "sorted_dir", "name");
    }

    /**
     * @SWG\Get(path="/tabs/{tab_id}", 
     *   tags={"Tabs"},
     *   summary="Get Tab",
     *   description="Request to get Tab by mode id",
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
     *     name="tab_id",
     *     in="path",
     *     description="tab id",
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
     *         @SWG\Schema(ref="#/definitions/tabs")
     *     )
     *  )
     */

    /**
     * get informations about table tabs
     */
    function GET() {
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_framework'], "v_tab", "tab_id");
    }

}

?>
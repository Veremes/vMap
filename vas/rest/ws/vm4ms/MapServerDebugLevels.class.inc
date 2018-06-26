<?php

/**
 * \file MapServerDebugLevels.class.inc
 * \class MapServerDebugLevels
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the MapServerDebugLevels php class
 *
 * This class defines Rest Api to Gtf order statutes
 * 
 */
require_once 'Vmap4MapServer.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once 'MapServerDebugLevel.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class MapServerDebugLevels extends Vmap4MapServer {
    /**
     * @SWG\Definition(
     *   definition="/mapserverdebuglevels",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/mapserverdebuglevels")
     *   }
     * )
     * * @SWG\Tag(
     *   name="MapServerDebugLevels",
     *   description="Operations about MapServerDebugLevels"
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
        $this->aSelectedFields = Array('msdebuglevel_id', 'label_id', 'translation');
    }

    /**
     * @SWG\Get(path="/mapserverdebuglevels",
     *   tags={"MapServerDebugLevels"},
     *   summary="Get MapServerDebugLevels",
     *   description="Request to get MapServerDebugLevels",
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
     *     name="order_by",
     *     in="query",
     *     description="list of ordering fields",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sort_order",
     *     in="query",
     *     description="sort order",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="limit",
     *     in="query",
     *     description="number of element",
     *     required=false,
     *     type="integer",
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
     *         @SWG\Schema(ref="#/definitions/mapserverdebuglevels")
     *     )
     *  )
     */

    /**
     * get MapServerDebugLevels
     * @return  MapServerDebugLevels
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vm4ms'], "v_msdebuglevel", "msdebuglevel_id");
        return $aReturn['sMessage'];
    }

}

?>
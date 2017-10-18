<?php

/**
 * \file Modes.class.inc
 * \class Modes
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the Modes php class
 *
 * This class defines Rest Api to Vitis modes
 * 
 */
require_once 'Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once 'Mode.class.inc';
require_once(__DIR__ . '/../../class/vmlib/BdDataAccess.inc');

class Modes extends Vitis {
    /**
     * @SWG\Definition(
     *   definition="/Modes",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/Modes")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Modes",
     *   description="Operations about Modes"
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function __construct($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->aSelectedFields = Array("mode_id", "index", "application_name", "module_name", "objects");
    }

    /**
     * @SWG\Get(path="/modes",
     *   tags={"Modes"},
     *   summary="Get Modes",
     *   description="Request to get Modes",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
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
     *   @SWG\Parameter(
     *     name="action",
     *     in="query",
     *     type="string",
     *         @SWG\Items(type="string"),
     *         enum={"", "getAll"},
     *     description="object of test",
     *     required=false,
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/users")
     *     )
     *  )
     */

    /**
     * get Modes
     * @return  Modes
     */
    function GET() {
        if ($this->oConnection->oError == null) {
            if (isset($this->aValues['action']) && !empty($this->aValues['action'])) {
                if ($this->aValues['action'] == 'getAll') {
                    $aReturn = $this->genericGet($this->aProperties['schema_framework'], "vm_mode_rolname", "mode_id", true);
                } else {
                    $aReturn = $this->genericGet($this->aProperties['schema_framework'], "v_mode", "mode_id", true);
                }
            } else {
                $aReturn = $this->genericGet($this->aProperties['schema_framework'], "v_mode", "mode_id", true);
            }
            if ((!isset($this->aValues['attributs']) || strpos($this->aValues['attibuts'], 'objects') != false) && $aReturn['sStatus'] == 1) {
                $aObjects = $this->aObjects;
                $this->aObjects = array();
                require_once'Tabs.class.inc';
                foreach ($aObjects as $oMode) {
                    $oMode->aFields["reload"] = true;
                    $aValues = array("filter" => '{"relation": "AND","operators":[{"column": "mode_id","compare_operator": "=","value": "' . $oMode->aFields["mode_id"] . '"}, {"column": "lang","compare_operator": "=","value": "' . $this->aProperties["language"] . '"}]}', "token" => $this->aValues['token'], 'order_by' => 'index');
                    $oTabs = new Tabs($this->aPath, $aValues, $this->aProperties);
                    $oTabs->GET();
                    array_push($oMode->aObjects, $oTabs);
                    array_push($this->aObjects, $oMode);
                }
            }
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            http_response_code(403);
            $aXmlRacineAttribute['status'] = 0;
            $this->aFields['error'] = "ERROR : invalid token";
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }

        return $sMessage;
    }

    /**
     * @SWG\Put(path="/modes/sorting",
     *   tags={"Modes"},
     *   summary="Sort modes",
     *   description="Request to sort the modes of the application",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="modes_id",
     *     in="query",
     *     description="Modes of the application",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Properties Response",
     *         @SWG\Schema(ref="#/definitions/modes")
     *     ),
     *  )
     */

    /**
     * modify mode
     * @return array containing the status and the message
     */
    function PUT() {
        require $this->sRessourcesFile;
        if (!empty($this->aPath[2])) {
            if ($this->aPath[2] == "sorting") {
                if (!empty($this->aValues['modes_id'])) {
                    $aXmlRacineAttribute['status'] = 1;
                    $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    $aModes = explode('|', $this->aValues['modes_id']);
                    $i = 1;
                    foreach ($aModes as $iModeId) {
                        $aParams = array();
                        $aParams['sSchemaName'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
                        $aParams['mode_id'] = array('value' => $iModeId, 'type' => 'string');
                        $aParams['index'] = array('value' => $i, 'type' => 'number');
                        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['updateModesIndex'], $aParams);
                        if ($this->oConnection->oBd->enErreur()) {
                            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                            $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
                            $aXmlRacineAttribute['status'] = 0;
                            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                            break;
                        }
                        $i++;
                    }
                }
            }
        }
        return $sMessage;
    }

}

?>
<?php
/**
* \file Modes.class.inc
* \class Modes
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the Modes php class
*
* This class defines Rest Api to Vitis modes
* 
*/
require_once 'Vitis.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
require_once 'Mode.class.inc';
require_once(__DIR__.'/../../class/vmlib/BdDataAccess.inc');

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
    function Modes($aPath, $aValues, $properties) {
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
        $aReturn =$this->genericGet( $this->aProperties['schema_framework'], "v_mode", "mode_id", true);
        if ((!isset($this->aValues['attributs']) ||  strpos($this->aValues['attibuts'], 'objects') != false) && $aReturn['sStatus'] == 1){
            $aObjects  = $this->aObjects;
            $this->aObjects = array();
            require_once'Tabs.class.inc';
            foreach($aObjects as $oMode){
                $oMode->aFields["reload"] = true;
                $aValues = array("filter"=>"mode_id='".$oMode->aFields["mode_id"]."' AND lang='".$this->aProperties["language"] . "'", "token" => $this->aValues['token'], 'order_by'=>'index');
                $oTabs = new Tabs($this->aPath, $aValues, $this->aProperties);
                $oTabs->GET();
                array_push($oMode->aObjects, $oTabs);
                array_push($this->aObjects, $oMode);
            }
        }
        $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                
        return $sMessage;
    }
    
}
?>
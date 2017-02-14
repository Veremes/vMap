<?php

require_once 'Vitis.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
/**
* \file VitisSection.class.inc
* \class VitisSection
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the VitisSection php class
*
* This class defines operation for one VitisSection
* 
*/
class VitisSection  extends Vitis{
    
    public $oError;
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function VitisSection ($aPath, $aValues, $properties, $oConnection){
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
         $this->aSelectedFields = Array("VitisSection_id", "tab_id", "event", "index", "label", "name", "link_table_name", "template", "ressource_id");
    }
      /**
     * @SWG\Get(path="/VitisSections/{VitisSection_id}", 
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
     *     name="VitisSection_id",
     *     in="path",
     *     description="VitisSection_id name",
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
     *         @SWG\Schema(ref="#/definitions/VitisSections")
     *     )
     *  )
     */
    
    /**
     * get informations about table VitisSections
     */
    function GET(){
          require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_framework'], "v_VitisSection", "VitisSection_id");
    }
}
?>
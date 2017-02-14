<?php

require_once 'Vitis.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
/**
* \file Update.class.inc
* \class Update
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the Update php class
*
* This class defines operation for one Update
* 
*/
class Update  extends Vitis{
    
    public $oError;
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function Update ($aPath, $aValues, $properties, $oConnection){
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
        $this->aSelectedFields = Array("update_id", "name", "publishing_date", "from", "to", "status", "telechargement", "installation", "log", "error_log");
    }
      /**
     * @SWG\Get(path="/updates/{update_id}", 
     *   tags={"Updates"},
     *   summary="Get Update",
     *   description="Request to get Update by mode id",
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
     *     name="update_id",
     *     in="path",
     *     description="update id",
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
     *         @SWG\Schema(ref="#/definitions/updates")
     *     )
     *  )
     */
    
    /**
     * get informations about table updates
     */
    function GET(){
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_framework'], "v_update", "update_id");
    }
    
}
?>
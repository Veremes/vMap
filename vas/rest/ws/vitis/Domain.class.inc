<?php

require_once 'Vitis.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
/**
* \file Domain.class.inc
* \class Domain
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the Domain php class
*
* This class defines operation for one Domain
* 
*/
class Domain extends Vitis{
    
    public $oError;
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function __construct ($aPath, $aValues, $properties, $oConnection){
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
        $this->aSelectedFields = Array("domain_id", "domain", "alias", "server", "port", "dn_search_user", "filter_user", "dn_search_group", "filter_group", "login", "password", "verify_rights", "type");
    }
      /**
     * @SWG\Get(path="/domains/{domain_id}", 
     *   tags={"Domains"},
     *   summary="Get Domain",
     *   description="Request to get Domain by id",
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
     *     name="domain_id",
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
     *         @SWG\Schema(ref="#/definitions/domains")
     *     )
     *  )
     */
    /**
     * get informations about mode
     */
    function GET(){
        require $this->sRessourcesFile;
        $this->aFields = $this->getFields($this->aProperties['schema_framework'], "domain", "domain_id");
    }
    
    /**
     * delete a domain
     */
    function DELETE(){
        $this->oConnection->oBd->delete($this->aProperties['schema_framework'], 'domain', 'domain_id', $this->aValues['my_vitis_id'], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
                $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
                $this->aFields['domain_id'] = $this->aValues['my_vitis_id'];
        }
    }
}
?>
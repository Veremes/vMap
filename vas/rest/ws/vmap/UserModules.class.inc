<?php

/**
 * \file UserModules.class.inc
 * \class UserModules
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the UserModules php class
 *
 * This class defines Rest Api to Gtf usermodules
 * 
 */
require_once 'Vmap.class.inc';
require_once 'UserModule.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once(__DIR__ . '/../../class/vmlib/BdDataAccess.inc');

class UserModules extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/usermodules",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/usermodules")
     *   }
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
        $this->aSelectedFields = Array("module_id", "label", "description", "rolname");
    }

    /**
     * @SWG\Get(path="/usermodules",
     *   tags={"Modules"},
     *   summary="Get User UserModules",
     *   description="Request to get UserModules",
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
     *     name="limit",
     *     in="query",
     *     description="number of element",
     *     required=false,
     *     type="integer"
     *   ),
     * @SWG\Parameter(
     *     name="offset",
     *     in="query",
     *     description="index of first element",
     *     required=false,
     *     type="string"
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
     *         @SWG\Schema(ref="#/definitions/usermodules")
     *     )
     *  )
     */

    /**
     * get UserModules
     * @return  UserModules
     */
    function GET() {
        require $this->sRessourcesFile;
        // Structure json des modules et leurs paramètres.
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'module', 'module_id');
        if ($aReturn['sStatus'] == 1) {

            $oUserModules = new stdClass();
            $oUserModules->usermodules = array();
            
            if (empty($this->aValues['my_vitis_id'])) {
                // Nombre d'enregistrements total
                $oUserModules->total_row_number = $this->aFields['total_row_number'];
            }
            
            $iListCount = 0;
            $oUserModules->status = $aReturn['sStatus'];
            foreach ($this->aObjects as $oModule) {
                if (in_array($oModule->aFields['rolname'], $this->oConnection->aPrivileges)) {
                    $iListCount++;
                    $oUserModule = new stdClass();
                    $oUserModule->infos = new stdClass();
                    $sModuleId = $oModule->aFields['module_id'];
                    $oUserModule->infos->icon = 'icon-' . $sModuleId;
                    $oUserModule->infos->image = '';
                    $oUserModule->infos->tooltip = $oModule->aFields['label'];
                    $oUserModules->usermodules[] = $oUserModule;
                    $oUserModule->$sModuleId = new stdClass();
                }
            }
            // Nombre d'enregistrements affichés
            $oUserModules->list_count = $iListCount;
           
            $this->aFields = $oUserModules;

            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }
        else
            $sMessage = $aReturn['sMessage'];
        return $sMessage;
    }

}

?>
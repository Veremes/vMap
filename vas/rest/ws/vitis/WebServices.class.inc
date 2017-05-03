<?php

/**
 * \file WebServices.class.inc
 * \class WebServices
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the WebServices php class
 *
 * This class defines Rest Api to Vitis WebServices
 * 
 */
require_once 'Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once(__DIR__ . '/../../class/vmlib/BdDataAccess.inc');

class WebServices extends Vitis {
    /**
     * @SWG\Definition(
     *   definition="/WebServices",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/WebServices")
     *   }
     * )
     * * @SWG\Tag(
     *   name="WebServices",
     *   description="Operations about WebServices"
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
//        $this->aSelectedFields = Array("web_service", "module", "name", "description", "fields", "columns", "objects", "actions");
        $this->aRessourceFields = Array("ressource_id", "module", "name", "description", "fields", "columns", "objects", "actions");
    }

    /**
     * @SWG\Get(path="/webservices",
     *   tags={"WebServices"},
     *   summary="Get WebServices",
     *   description="Request to get webservices",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x_vm_json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="attributs",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/webservices")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/webservices/{web_service}", 
     *   tags={"WebServices"},
     *   summary="Get WebService",
     *   description="Request to get WebService by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x_vm_json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="web_service",
     *     in="path",
     *     description="webservice name",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="attributs",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/webservices")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/webservices/{web_service}/ressources", 
     *   tags={"WebServices"},
     *   summary="Get ressources list",
     *   description="Request to get ressources list",
     *   operationId="GET",
     *   produces={"application/json", "application/x_vm_json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="web_service",
     *     in="path",
     *     description="webservice name",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="attributs",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/webservices")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/webservices/{web_service}/ressources/{ressource}", 
     *   tags={"WebServices"},
     *   summary="Get ressources infos",
     *   description="Request to get ressources infos",
     *   operationId="GET",
     *   produces={"application/json", "application/x_vm_json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="web_service",
     *     in="path",
     *     description="webservice name",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="ressource",
     *     in="path",
     *     description="ressource name",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="attributs",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/webservices")
     *     )
     *  )
     */

    /**
     * get Columns
     * @return Columns
     */
    function GET() {
        if ($this->oConnection->oError == null) {
            require("../doc/vendor/autoload.php");

            //$sWebServiceName = '';
            if (!empty($this->aPath[2]))
                $sWebServiceName = $this->aPath[2];
            $sRessourceName = '';
            if (!empty($this->aPath[4]))
                $sRessourceName = $this->aPath[4];

            if (!empty($sRessourceName)) {
                // infos de la ressource
                $this->getRessourceInfos($sWebServiceName, $sRessourceName);
            } else if (!empty($this->aPath[3])) {
                // liste des ressources
                $this->getRessourceInfos($sWebServiceName, $sRessourceName);
            } else if (!empty($sWebServiceName)) {
                // infos du web service
    			$aAttributs = array();
    			if (!empty($this->aValues['attributs'])){
    				$aAttributs = explode("|", $this->aValues['attributs']);
    			}
                $oWebService = $this->getWebServiceInfos($sWebServiceName, $aAttributs);
                array_push($this->aObjects, $oWebService);
            } else {
                // liste des web services
                // Tableau web services
                $aWebServices = $this->getWebServicesList();

    			$aAttributs = array();
    			if (!empty($this->aValues['attributs'])){
    				$aAttributs = explode("|", $this->aValues['attributs']);
    			}
                // Ajout dans l'output
                for ($i = 0; $i < count($aWebServices); $i++) {
                    $oWebService = $this->getWebServiceInfos($aWebServices[$i], $aAttributs);
                    array_push($this->aObjects, $oWebService);
                }
            }


            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }else{
            http_response_code(403); 
            $aXmlRacineAttribute['status']=0;
            $this->aFields['error'] = "ERROR : invalid token";
            $sMessage = $this->asDocument('','vitis',$this->aValues['sEncoding'],True,$aXmlRacineAttribute,$this->aValues['sSourceEncoding'],$this->aValues['output']);
            return $sMessage;
        }
        return $sMessage;
    }

    /**
     * Get the web services list
     * @return array list of the web services
     */
    function getWebServicesList() {
        $aWebServices = [];
        if (is_dir("./ws")) {
            $aDir = scandir("./ws");
            foreach ($aDir as $sDir) {
                if ($sDir != "." && $sDir != "..") {
                    array_push($aWebServices, $sDir);
                }
            }
        }
        else
            writeToErrorLog('scandir(./ws): failed to open dir');
        return $aWebServices;
    }

    /**
     * Get the webservice infos
     * @param string $sWebServiceName
     * @param array $sAttributs
     * @return \WebService object witch contains aFields = infos
     */
    function getWebServiceInfos($sWebServiceName, $aAttributs) {
        $swagger = \Swagger\scan('./ws/' . $sWebServiceName . '/overview.phtml');
        $aServer = explode("://", $this->aProperties["web_server_name"]);
        $swagger = str_replace("[service_alias]", $this->aProperties["services_alias"], $swagger);
        $swagger = str_replace("[protocol]", $aServer[0], $swagger);
        $swagger = str_replace("[server]", $aServer[1], $swagger);
        $oJson = json_decode($swagger)->info;
        $oJson->name = $sWebServiceName;

        if (count($aAttributs) > 0) {
            foreach ($oJson as $key => $value) {                
                if(!in_array($key, $aAttributs)){
                    unset($oJson->$key);
                }
            }
        }

        $oWebService = new WebService($this->aPath, $this->aValues, $this->aProperties);
        $oWebService->aFields = $oJson;

        return $oWebService;
    }

    /**
     * Get the ressources list
     * @param string $sWebServiceName
     * @return array list of the ressources
     */
    function getRessourcesList($sWebServiceName) {

        $swagger = \Swagger\scan('./ws/' . $sWebServiceName);
        $aServer = explode("://", $this->aProperties["web_server_name"]);
        $swagger = str_replace("[service_alias]", $this->aProperties["services_alias"], $swagger);
        $swagger = str_replace("[protocol]", $aServer[0], $swagger);
        $swagger = str_replace("[server]", $aServer[1], $swagger);
        $oJson = json_decode($swagger)->paths;

        $aRessources = [];
        foreach ($oJson as $key => $value) {
            if (isset($value->get)) {
                if (strpos($key, '{') === false) {
                    array_push($aRessources, substr($key, 1));
                }
            }
        }

        return $aRessources;
    }

    /**
     * Get the ressource infos, if sRessourceName is not provided, get the infos of all the ressources
     * @param string $sWebServiceName
     * @param string $sRessourceName
     */
    function getRessourceInfos($sWebServiceName, $sRessourceName) {

        if (isset($this->aValues['attributs'])) {
            $aAttributs = explode("|", $this->aValues['attributs']);
            $aFields = array_intersect($aAttributs, $this->aRessourceFields);
        } else {
            $aFields = $this->aRessourceFields;
        }

        $swagger = \Swagger\scan('./ws/' . $sWebServiceName);
        $aServer = explode("://", $this->aProperties["web_server_name"]);
        $swagger = str_replace("[service_alias]", $this->aProperties["services_alias"], $swagger);
        $swagger = str_replace("[protocol]", $aServer[0], $swagger);
        $swagger = str_replace("[server]", $aServer[1], $swagger);
        $oJson = json_decode($swagger);

        foreach ($oJson->tags as $value) {
            if (strtolower($sWebServiceName . '/' . $sRessourceName) == strtolower($sWebServiceName . "/" . $value->name) || $sRessourceName === "") {
                if (file_exists("./ws/" . $sWebServiceName . "/" . $value->name . ".class.inc")) {
                    require_once("./ws/" . $sWebServiceName . "/" . $value->name . ".class.inc");
                    $sClassName = $value->name;
                    $sClass = new ReflectionClass($value->name);
                    // $sClass = new $sClassName($this->aPath, $this->aValues, $this->aProperties);
                    if (in_array("ressource_id", $aFields)) {
                        $sClass->aFields["ressource_id"] = strtolower($sWebServiceName . "/" . $value->name);
                    }
                    if (in_array("module", $aFields)) {
                        $sClass->aFields["module"] = $sWebServiceName;
                    }
                    if (in_array("name", $aFields)) {
                        $sClass->aFields["name"] = $value->name;
                    }
                    if (in_array("description", $aFields)) {
                        $sClass->aFields["description"] = $value->description;
                    }
                    if (in_array("fields", $aFields)) {
                        $sClass->aFields["fields"] = "";
                        if (!empty($aRessourceFields)){
                            foreach ($sClass->aRessourceFields as $sFields) {
                                if (strpos($sFields, " as ")) {
                                    $field = explode(" as ", $sFields)[1];
                                } else {
                                    $field = $sFields;
                                }
                                if ($sClass->aFields["fields"] == "") {
                                    $sClass->aFields["fields"] = $field;
                                } else {
                                    $sClass->aFields["fields"] .= ", " . $field;
                                }
                            }
                        }
                    }
                    if (in_array("columns", $aFields)) {
                        require_once 'Columns.class.inc';
                        $oColumn = new Columns($this->aPath, array("ressource_id" => $sClass->aFields["ressource_id"], "module" => $sWebServiceName), $this->aProperties, $this->oConnection);
                        $oColumn->GET();
                        if (empty($sClass->aObjects)){
                            $sClass->aObjects = array();
                        }
                        array_push($sClass->aObjects, $oColumn);
                    }
                    if (in_array("actions", $aFields)) {
                        require_once 'Actions.class.inc';
                        $oActions = new Actions($this->aPath, array("ressource_id" => $sClass->aFields["ressource_id"], "module" => $sWebServiceName), $this->aProperties, $this->oConnection);
                        $oActions->GET();
                        array_push($sClass->aObjects, $oActions);
                    }
                    if (in_array("objects", $aFields)) {
                        require_once'Tabs.class.inc';
                        $aValues = array("filter" => "ressource_id='" . $sClass->aFields["ressource_id"] . "' AND lang = '" . $this->aProperties['language'] . "'", "distinct" => "true", "token" => $this->aValues['token']);
                        $oTabs = new Tabs($this->aPath, $aValues, $this->aProperties);
                        $oTabs->GET();
                        array_push($sClass->aObjects, $oTabs);
                    }
                    array_push($this->aObjects, $sClass);
                    unset($oObject);
                }
            }
        }
    }

}

class WebService extends WebServices {

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     */
    function __construct($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
    }

}

class Ressource extends WebServices {

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     */
    function __construct($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
    }

}

class RessourceList extends WebServices {

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     */
    function __construct($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
    }

}

?>
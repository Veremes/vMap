<?php

/**
 * \file Ressources.class.inc
 * \class Ressources
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the Ressources php class
 *
 * This class defines Rest Api to Vitis Ressources
 * 
 */
require_once 'Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once(__DIR__ . '/../../class/vmlib/BdDataAccess.inc');

class Ressources extends Vitis {
  

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function Ressources($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->aSelectedFields = Array("ressource_id", "module", "name", "description", "fields", "columns", "objects", "actions");
    }

      /**
     * get Columns
     * @return Columns
     */
    function GET() {
        require("../doc/vendor/autoload.php");


        if (isset($this->aPath[2]) && isset($this->aPath[3])) {
            $this->aValues['ressource_id'] = $this->aPath[2] . '/' . $this->aPath[3];
            $this->getData($this->aPath[2]);
        } else {
            if (is_dir("./ws")) {
                $aDir = scandir("./ws");
                foreach ($aDir as $sDir) {
                    if ($sDir != "." && $sDir != "..") {
                        $this->getData($sDir);
                    }
                }
            }
            else
                writeToErrorLog('scandir(./ws): failed to open dir');
        }

        $aXmlRacineAttribute['status'] = 1;
        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        return $sMessage;
    }

    function getData($sDir) {
        if (isset($this->aValues['attributs'])) {
            $aAttributs = explode("|", $this->aValues['attributs']);
            $aFields = array_intersect($aAttributs, $this->aSelectedFields);
        } else {
            $aFields = $this->aSelectedFields;
        }

        $swagger = \Swagger\scan('./ws/' . $sDir);
        $aServer = explode("://", $this->aProperties["web_server_name"]);
        $swagger = str_replace("[service_alias]", $this->aProperties["services_alias"], $swagger);
        $swagger = str_replace("[protocol]", $aServer[0], $swagger);
        $swagger = str_replace("[server]", $aServer[1], $swagger);
        $oJson = json_decode($swagger);
        foreach ($oJson->tags as $value) {
            if (strtolower($this->aValues['ressource_id']) == strtolower($sDir . "/" . $value->name) || !isset($this->aValues['ressource_id'])) {
                if (file_exists("./ws/" . $sDir . "/" . $value->name . ".class.inc")) {
                    require_once("./ws/" . $sDir . "/" . $value->name . ".class.inc");
                    $sClassName = $value->name;
                    $sClass = new $sClassName($this->aPath, $this->aValues, $this->aProperties);
                    if (in_array("ressource_id", $aFields)) {
                        $sClass->aFields["ressource_id"] = strtolower($sDir . "/" . $value->name);
                    }
                    if (in_array("module", $aFields)) {
                        $sClass->aFields["module"] = $sDir;
                    }
                    if (in_array("name", $aFields)) {
                        $sClass->aFields["name"] = $value->name;
                    }
                    if (in_array("description", $aFields)) {
                        $sClass->aFields["description"] = $value->description;
                    }
                    if (in_array("fields", $aFields)) {
                        $sClass->aFields["fields"] = "";
                        foreach ($sClass->aSelectedFields as $sFields) {
                            if (strpos($sFields, " as ")){
                                $field = explode(" as ", $sFields)[1];
                            }else{
                                 $field = $sFields;
                            }
                            if ($sClass->aFields["fields"] == "") {
                                $sClass->aFields["fields"] =  $field;
                            } else {
                                $sClass->aFields["fields"] .= ", " . $field;
                            }
                        }
                    }
                    if (in_array("columns", $aFields)) {
                        require_once 'Columns.class.inc';
                        $oColumn = new Columns($this->aPath, array("ressource_id" => $sClass->aFields["ressource_id"], "module" => $sDir), $this->aProperties, $this->oConnection);
                        $oColumn->GET();
                        array_push($sClass->aObjects, $oColumn);
                    }
                    if (in_array("actions", $aFields)) {
                        require_once 'Actions.class.inc';
                        $oActions = new Actions($this->aPath, array("ressource_id" => $sClass->aFields["ressource_id"], "module" => $sDir), $this->aProperties, $this->oConnection);
                        $oActions->GET();
                        array_push($sClass->aObjects, $oActions);
                    }
                    if (in_array("objects", $aFields)) {
                        require_once'Tabs.class.inc';
                        $aValues = array("filter" => "ressource_id='" .  $sClass->aFields["ressource_id"]."' AND lang = '".$this->aProperties['language']."'", "distinct" => "true", "token" => $this->aValues['token']);
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

?>
<?php

/**
 * \file Vex.class.inc
 * \class Vex
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the Vex php class
 *
 * This class defines Rest Api to Vitis vex
 * 
 */
require_once 'Vmap.class.inc';
require_once 'VexExport.class.inc';
require_once 'VexImport.class.inc';
require_once 'VexGetter.class.inc';
require_once 'VexParser.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Form.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';
require_once 'vmlib/logUtil.inc';

class Vex extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/vex",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/vex")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Vex",
     *   description=""
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
    }

    /**
     * @SWG\Get(path="/vex",
     *   tags={"Vex"},
     *   summary="",
     *   description="",
     *   operationId="GET",
     *   produces={"application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="vex url",
     *         @SWG\Schema(ref="#/definitions/vex")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/vex/vmap_objects",
     *   tags={"Vex"},
     *   summary="Get vMap objects list",
     *   description="Return the list of maps, calques, business objects and layers",
     *   operationId="GET",
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Web services list",
     *         @SWG\Schema(ref="#/vex/web_services")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/vex/web_services",
     *   tags={"Vex"},
     *   summary="Get web services list",
     *   description="Return the list of the web services of one or many business objects",
     *   operationId="GET",
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="business_objects",
     *     in="query",
     *     description="business objects list",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Web services list",
     *         @SWG\Schema(ref="#/vex/web_services")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/vex/sql_objects",
     *   tags={"Vex"},
     *   summary="Get avaliable sql objects list",
     *   description="Return the list of the schemas, tables, views avaliable to dump",
     *   operationId="GET",
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="database",
     *     in="query",
     *     description="Database to search in",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Web services list",
     *         @SWG\Schema(ref="#/vex/web_services")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/vex/existing_vmap_objects",
     *   tags={"Vex"},
     *   summary="Get existing vMap objects",
     *   description="Return the list of the existing vMap objects with the same names than those paseed in parametters",
     *   operationId="GET",
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="maps",
     *     in="query",
     *     description="Map names separed by pipes",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="services",
     *     in="query",
     *     description="Service names separed by pipes",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="calques",
     *     in="query",
     *     description="Calque names separed by pipes",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="vm4ms_layers",
     *     in="query",
     *     description="Vm4ms Layer names separed by pipes",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="business_objects",
     *     in="query",
     *     description="Business object names separed by pipes",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="events",
     *     in="query",
     *     description="Event names separed by pipes",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="repports",
     *     in="query",
     *     description="Report names separed by pipes",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Web services list",
     *         @SWG\Schema(ref="#/vex/web_services")
     *     )
     *  )
     */

    /**
     * @SWG\Get(path="/vex/existing_web_services",
     *   tags={"Vex"},
     *   summary="Get existing web services",
     *   description="Return the list of the existing web services with the same names than those paseed in parametters",
     *   operationId="GET",
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="web_services",
     *     in="query",
     *     description="Web services names separed by pipes",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Web services list",
     *         @SWG\Schema(ref="#/vex/web_services")
     *     )
     *  )
     */
    function GET() {
        if ($this->aPath[2] === 'vmap_objects') {
            $oVexGetter = new VexGetter($this->aPath, $this->aValues, $this->aProperties);
            return $oVexGetter->getVMapObjectsList();
        }
        if ($this->aPath[2] === 'web_services') {
            $oVexGetter = new VexGetter($this->aPath, $this->aValues, $this->aProperties);
            return $oVexGetter->getWebServicesList();
        }
        if ($this->aPath[2] === 'sql_objects') {
            $oVexGetter = new VexGetter($this->aPath, $this->aValues, $this->aProperties);
            return $oVexGetter->getSqlObjects();
        }
        if ($this->aPath[2] === 'existing_vmap_objects') {
            $oVexGetter = new VexGetter($this->aPath, $this->aValues, $this->aProperties);
            return $oVexGetter->getExistingVMapObjectsList();
        }
        if ($this->aPath[2] === 'existing_web_services') {
            $oVexGetter = new VexGetter($this->aPath, $this->aValues, $this->aProperties);
            return $oVexGetter->getExistingWebServicesList();
        }
    }

    // POST

    /**
     * @SWG\Post(path="/vex/parse_vex",
     *   tags={"Vex"},
     *   summary="Get Vex file contents",
     *   description="Request to parse the given vex file and get his contents",
     *   operationId="POST",
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="vex_file",
     *     in="formData",
     *     description="vex file",
     *     required=true,
     *     type="file"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Generated VEX URL",
     *         @SWG\Schema(ref="#/vex/export_vex")
     *     )
     *  )
     * )
     */
    /**
     * @SWG\Post(path="/vex/export_vex",
     *   tags={"Vex"},
     *   summary="Get Vex file",
     *   description="Request to generate and get a .vex file",
     *   operationId="POST",
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="vmap_objects",
     *     in="formData",
     *     description="Maps, calques, business objects in JSON",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="web_services",
     *     in="formData",
     *     description="Web services folders names",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="sql_objects",
     *     in="formData",
     *     description="Database, schemas, tables, to export in JSON",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Generated VEX URL",
     *         @SWG\Schema(ref="#/vex/export_vex")
     *     )
     *  )
     * )
     */

    /**
     * @SWG\Post(path="/vex/import/vmap_objects",
     *   tags={"Vex"},
     *   summary="Import vMap objects",
     *   description="Request to import .vex vMap object",
     *   operationId="POST",
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="vmap_objects",
     *     in="formData",
     *     description="Maps, services, calques, vm4ms_layers, business_objects, business_objects_forms, events, reports definitions in JSON",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="database",
     *     in="formData",
     *     description="database",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="schema",
     *     in="formData",
     *     description="schema",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="srid",
     *     in="formData",
     *     description="srid",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="",
     *         @SWG\Schema(ref="#/vex/import/vmap_objects")
     *     )
     *  )
     * )
    /**
     * @SWG\Post(path="/vex/import/web_services",
     *   tags={"Vex"},
     *   summary="Import web services",
     *   description="Request to import .vex web services",
     *   operationId="POST",
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="web_services",
     *     in="formData",
     *     description="Web services content",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="",
     *         @SWG\Schema(ref="#/vex/import/vmap_objects")
     *     )
     *  )
     * )
     */
    /**
     * @SWG\Post(path="/vex/import/sql",
     *   tags={"Vex"},
     *   summary="Import sql",
     *   description="Request to import .vex SQL",
     *   operationId="POST",
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="sql_model",
     *     in="formData",
     *     description="SQL model",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="sql_data",
     *     in="formData",
     *     description="SQL data",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="database",
     *     in="formData",
     *     description="Database",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="schema",
     *     in="formData",
     *     description="Schema",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="srid",
     *     in="formData",
     *     description="SRID",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="",
     *         @SWG\Schema(ref="#/vex/import/vmap_objects")
     *     )
     *  )
     * )
     */
    function POST() {
        if ($this->aPath[2] === 'parse_vex') {
            $oVexParser = new VexParser($this->aPath, $this->aValues, $this->aProperties);
            return $oVexParser->parseVex();
        }
        if ($this->aPath[2] === 'export_vex') {
            $oVexExport = new VexExport($this->aPath, $this->aValues, $this->aProperties);
            return $oVexExport->exportVex();
        }
        if ($this->aPath[2] === 'import') {
            $oVexImport = new VexImport($this->aPath, $this->aValues, $this->aProperties);
            if ($this->aPath[3] === 'vmap_objects') {
                return $oVexImport->importVMapObjects();
            }
            if ($this->aPath[3] === 'web_services') {
                return $oVexImport->importWebServices();
            }
            if ($this->aPath[3] === 'sql') {
                return $oVexImport->importSQL();
            }
        }
    }

    function PUT() {
        
    }

    function DELETE() {
        
    }

}

?>
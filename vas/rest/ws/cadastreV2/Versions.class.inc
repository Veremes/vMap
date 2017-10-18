<?php

require_once 'Cadastre.class.inc';

/**
 * \file versions.class.inc
 * \class Versions
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the Versions php class
 *
 * This class defines the rest api for versions
 * 
 */
class Versions extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/Versions",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/Versions")
     *   }
     * )
     * @SWG\Tag(
     *   name="Versions",
     *   description="Operations about Versions"
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $versions ptroperties
     */
    function __construct($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
    }

    /**
     * @SWG\Get(path="/Versions",
     *   tags={"Versions"},
     *   summary="Get versions",
     *   description="Request to get versions",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *  @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/Versions")
     *     )
     *  )
     */

    /**
     * 
     * @return versions
     */
    function GET() {
        $this->getVersion("cadastreV2");
        //$this->aFields = $this->aVersions;
        //
        $aXmlRacineAttribute['status'] = 1;
        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        return $sMessage;
    }

}

?>
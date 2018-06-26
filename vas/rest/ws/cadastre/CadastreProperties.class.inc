<?php

require_once __DIR__ . '/../vitis/Vitis.class.inc';

/**
 * \file cadastreproperties.class.inc
 * \class CadatsreProperties
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the Properties php class
 *
 * This class defines the rest api for properties
 * 
 */
class CadastreProperties extends Vitis {
    /**
     * @SWG\Definition(
     *   definition="/cadastreproperties",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/cadastreproperties")
     *   }
     * )
     * * @SWG\Tag(
     *   name="properties",
     *   description="Operations about properties"
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
    function properties($aPath, $aValues, $properties, $bShortcut = false) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = (object) $properties;
    }

    /**
     * @SWG\Get(path="/cadastreproperties", 
     *   tags={"Properties"},
     *   summary="Get the cadastre properties",
     *   description="Request to get properties",
     *   operationId="GET",
     *   produces={"application/json", "application/x-vm-json"},
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitionscadastre/properties")
     *     )
     *  )
     */

    /**
     * 
     * @return properties
     */
    function GET() {

        $this->aFields['data'] = $this->aProperties->cadastre;
        $aXmlRacineAttribute['status'] = 1;
        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);

        return $sMessage;
    }

}

?>
<?php

require_once 'Vmap.class.inc';
require_once 'UserPrintTemplates.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file UserPrintTemplate.class.inc
 * \class UserPrintTemplate
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the UserPrintTemplate php class
 *
 * This class defines operation for one UserPrintTemplate
 * 
 */
class UserPrintTemplate extends Vmap {

    public $oError;

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
        $this->aSelectedFields = Array("printtemplate_id", "name", "rt_format_id", "rt_orientation_id", "definition", "outputformats_id", "sql", "ressource_id", "business_object_id", "printstyles");
    }

    /**
     * @SWG\Get(path="/userprinttemplates/{printtemplate_id}", 
     *   tags={"PrintTemplates"},
     *   summary="Get UserPrintTemplate",
     *   description="Request to get UserPrintTemplate by id",
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
     *     name="printtemplate_id",
     *     in="path",
     *     description="printtemplate id",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/userprinttemplates")
     *     )
     *  )
     */

    /**
     * get informations about userprinttemplate
     */
    function GET() {
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'v_template', 'printtemplate_id');
//        $this->aFields['definition'] = $this->getPrintTemplateWithStyles();
        
        $this->aFields['printstyles'] = $this->getPrintStylesFromUser();
    }

    /**
     * Get the printstyles associated to current user
     * @return array
     */
//    function getPrintTemplateWithStyles() {
//        $aPrintStyles = $this->getPrintStylesFromUser();        
//        $sPrintStyle = $this->concatPrintStyles($aPrintStyles);        
//        $sTemplateDefinition = $sPrintStyle . $this->aFields['definition'];
//        
//        return $sTemplateDefinition;
//    }

    /**
     * Get the printstyles associated to current user
     * @return array
     */
    function getPrintStylesFromUser() {
        $oUserPrintStyles = new UserPrintStyles($this->aPath, $this->aValues, $this->aProperties);
        $oUserPrintStyles->aValues['my_vitis_id'] = null;
        $oUserPrintStyles->aValues['filter'] = '';
        $oUserPrintStyles->GET();

        $aPrintStyles = $oUserPrintStyles->aFields->userprintstyles;

        return $aPrintStyles;
    }

    /**
     * Concat the definitions of the given print styles
     * @param array $aPrintStyles
     * @return string
     */
//    function concatPrintStyles($aPrintStyles) {
//        $sPrintStyle = "";
//        for ($i = 0; $i < count($aPrintStyles); $i++) {
//            $sPrintStyle .= $aPrintStyles[$i]->definition;
//        }
//
//        return $sPrintStyle;
//    }

}

?>
<?php

/**
 * \file UserPrintStyles.class.inc
 * \class UserPrintStyles
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the UserPrintStyles php class
 *
 * This class defines Rest Api to Vmap UserPrintStyles
 * 
 */
require_once 'Vmap.class.inc';
require_once 'UserPrintStyle.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

class UserPrintStyles extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/userprintstyles",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/printstyles")
     *   }
     * )
     * * @SWG\Tag(
     *   name="UserPrintStyles",
     *   description=""
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
        $this->aSelectedFields = Array("printstyle_id", "name", "definition");
    }

    /**
     * @SWG\Get(path="/userprintstyles",
     *   tags={"PrintStyles"},
     *   summary="Get UserPrintStyles",
     *   description="Request to get UserPrintStyles",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
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
     *     name="sort_order",
     *     in="query",
     *     description="sort order",
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
     *         @SWG\Schema(ref="#/definitions/userprintstyles")
     *     )
     *  )
     */

    /**
     * get UserPrintStyles
     * @return  UserPrintStyles
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'v_user_printstyle', 'printstyle_id');

        if ($aReturn['sStatus'] == 1) {
            $oUserPrintStyles = new stdClass();
            $oUserPrintStyles->userprintstyles = array();
            if (empty($this->aValues['my_vitis_id'])) {
                $oUserPrintStyles->list_count = $this->aFields['list_count'];
                $oUserPrintStyles->total_row_number = $this->aFields['total_row_number'];
            }
            $oUserPrintStyles->status = $aReturn['sStatus'];
            foreach ($this->aObjects as $oPrintStyle) {
                $oUserPrintStyle = new stdClass();
                $oUserPrintStyle->printstyle_id = $oPrintStyle->aFields['printstyle_id'];
                $oUserPrintStyle->name = $oPrintStyle->aFields['name'];
                $oUserPrintStyle->definition = str_replace(array("\r", "\n", "\t"), '', $oPrintStyle->aFields['definition']);
                $oUserPrintStyles->userprintstyles[] = $oUserPrintStyle;
            }
            $this->aFields = $oUserPrintStyles;
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }

        return $sMessage;
    }

}

?>
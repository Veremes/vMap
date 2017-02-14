<?php

/**
 * \file UserPrintTemplates.class.inc
 * \class UserPrintTemplates
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the UserPrintTemplates php class
 *
 * This class defines Rest Api to Gtf userprinttemplates
 * 
 */
require_once 'Vmap.class.inc';
require_once 'UserPrintTemplate.class.inc';
require_once 'UserPrintStyles.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once(__DIR__ . '/../../class/vmlib/BdDataAccess.inc');
require_once(__DIR__ . '/../../class/vmlib/phpUtil.inc');

class UserPrintTemplates extends Vmap {
    /**
     * @SWG\Definition(
     *   definition="/userprinttemplates",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/userprinttemplates")
     *   }
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function UserPrintTemplates($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->aValues['getGroup'] = true;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->aSelectedFields = Array("printtemplate_id", "name", "rt_format_id", "rt_orientation_id", "definition", "outputformats_id", "sql", "ressource_id", "business_object_id");
    }

    /**
     * @SWG\Get(path="/userprinttemplates",
     *   tags={"PrintTemplates"},
     *   summary="Get User UserPrintTemplates",
     *   description="Request to get UserPrintTemplates",
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
     *     name="limit",
     *     in="query",
     *     description="number of element",
     *     required=false,
     *     type="integer",
     *     format="int32"
     *   ),
     * @SWG\Parameter(
     *     name="offset",
     *     in="query",
     *     description="index of first element",
     *     required=false,
     *     type="string",
     *     format="int32"
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
     *         @SWG\Schema(ref="#/definitions/userprinttemplates")
     *     )
     *  )
     */

    /**
     * get UserPrintTemplates
     * @return  UserPrintTemplates
     */
    function GET() {
        require $this->sRessourcesFile;
        // Structure json des modèles d'impression et leurs paramètres.
        $sesGroup = $this->oConnection->sesGroup;
        $old_filter = $this->aValues['filter'];
        if (isset($this->aValues['filter']) && $this->aValues['filter'] != "") {
            $this->aValues['filter'] = '(' . ($this->aValues['filter']) . ')' . " AND group_id in ($sesGroup)";
        } else {
            $this->aValues['filter'] = "group_id in ($sesGroup)";
        }
        $aReturn = $this->genericGet($this->aProperties['schema_vmap'], 'v_user_template', 'printtemplate_id');
        $this->aValues['filter'] = $old_filter;
        //$aUserGroupsPrintIds = $this->getPrintIdsFromUserGroups();
        $aPrintStyles = $this->getPrintStylesFromUser();
        $sPrintStyle = $this->concatPrintStyles($aPrintStyles);

        if ($aReturn['sStatus'] == 1) {
            $oUserPrintTemplates = new stdClass();
            $oUserPrintTemplates->userprinttemplates = array();
            $oUserPrintTemplates->data = array();
            if (empty($this->aValues['my_vitis_id'])) {
                $oUserPrintTemplates->list_count = $this->aFields['list_count'];
                $oUserPrintTemplates->total_row_number = $this->aFields['total_row_number'];
            }
            $oUserPrintTemplates->status = $aReturn['sStatus'];
            foreach ($this->aObjects as $oPrintTemplate) {
                $oUserPrintTemplate = new stdClass();
                $oUserPrintTemplate->printtemplate_id = $oPrintTemplate->aFields['printtemplate_id'];
                $oUserPrintTemplate->name = $oPrintTemplate->aFields['name'];
                $oUserPrintTemplate->format = $oPrintTemplate->aFields['rt_format_id'];
                $oUserPrintTemplate->orientation = $oPrintTemplate->aFields['rt_orientation_id'];
                $oUserPrintTemplate->definition = $sPrintStyle . str_replace(array("\r", "\n"), '', $oPrintTemplate->aFields['definition']);
                $oUserPrintTemplate->variables = array();
                $oUserPrintTemplates->userprinttemplates[] = $oUserPrintTemplate;
                $oUserPrintTemplates->data[] = $oUserPrintTemplate;
                // Paramètres du modèle d'impression.
                $sSql = str_replace('[printtemplate_id]', $oPrintTemplate->aFields["printtemplate_id"], $aSql['getPrintTemplateParameters']);
                $sSql = str_replace('[sSchemaVmap]', $this->aProperties['schema_vmap'], $sSql);
                $resultat = $this->oConnection->oBd->execute($sSql);
                if ($this->oConnection->oBd->enErreur()) {
                    $this->oError = new Error(1, $this->oConnection->oBd->getBDMessage());
                    $oError = new Error(1, $this->oConnection->oBd->getBDMessage());
                    $aXmlRacineAttribute['status'] = 0;
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                    return $sMessage;
                } else {
                    while ($aPrintParameter = $this->oConnection->oBd->ligneSuivante($resultat)) {
                        $oPrintParameter = new stdClass();
                        $oPrintParameter->printtemplate_id = $aPrintParameter['printtemplate_id'];
                        $oPrintParameter->name = $aPrintParameter['name'];
                        $oPrintParameter->editable = $aPrintParameter['editable'];
                        $oPrintParameter->label = $aPrintParameter['label'];
                        $oPrintParameter->description = $aPrintParameter['placeholder'];
                        $oPrintParameter->value = $aPrintParameter['defaultvalue'];
                        $oUserPrintTemplate->variables[] = $oPrintParameter;
                    }
                }
            }
            $this->aFields = $oUserPrintTemplates;
            $aXmlRacineAttribute['status'] = 1;
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }
        return $sMessage;
    }

    /**
     * Get the printstyles associated to current user
     * @return array
     */
    function getPrintStylesFromUser() {

        $oUserPrintStyles = new UserPrintStyles($this->aPath, $this->aValues, $this->aProperties);
        $oUserPrintStyles->aValues['my_vitis_id'] = null;
        $oUserPrintStyles->GET();

        $aPrintStyles = $oUserPrintStyles->aFields->userprintstyles;

        return $aPrintStyles;
    }

    /**
     * Concat the definitions of the given print styles
     * @param array $aPrintStyles
     * @return string
     */
    function concatPrintStyles($aPrintStyles) {

        $sPrintStyle = "";
        for ($i = 0; $i < count($aPrintStyles); $i++) {
            $sPrintStyle .= $aPrintStyles[$i]->definition;
        }

        return $sPrintStyle;
    }

}

?>
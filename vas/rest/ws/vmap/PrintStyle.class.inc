<?php

require_once 'Vmap.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file PrintStyle.class.inc
 * \class PrintStyle
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the PrintStyle php class
 *
 * This class defines operation for one PrintStyle
 * 
 */
class PrintStyle extends Vmap {

    public $oError;

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $oConnection) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = $oConnection;
        $this->aSelectedFields = Array("printstyle_id", "name", "definition", "users");
    }

    /**
     * @SWG\Get(path="/printstyles/{printstyle_id}", 
     *   tags={"PrintStyles"},
     *   summary="Get PrintStyle",
     *   description="Request to get PrintStyle by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="printstyle_id",
     *     in="path",
     *     description="printstyle id",
     *     required=true,
     *     type="integer"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/printstyles")
     *     )
     *  )
     */

    /**
     * get informations about PrintStyle
     */
    function GET() {
        $this->aFields = $this->getFields($this->aProperties['schema_vmap'], 'printstyle', 'printstyle_id');
        $this->getUsers();
    }

    /**
     *  get users of user
     */
    function getUsers() {
        require $this->sRessourcesFile;
        if (in_array("users", $this->aSelectedFields)) {
            $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
            $aParams['sSchemaVmap'] = array('value' => $this->aProperties['schema_vmap'], 'type' => 'schema_name');
            $aParams['printstyle_id'] = array('value' => $this->aValues['my_vitis_id'], 'type' => 'number');
            $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getPrintStyleUsers'], $aParams);
            $sListUserId = "";
            $aListUserLogin = array();
            while ($aLigne = $this->oConnection->oBd->ligneSuivante($oPDOresult)) {
                if ($sListUserId == "") {
                    $sListUserId = $aLigne["user_id"];
                } else {
                    $sListUserId .= "|" . $aLigne["user_id"];
                }
                $aListUserLogin[] = $aLigne["login"];
            }
            $oPDOresult = $this->oConnection->oBd->fermeResultat();
            $this->aFields['users'] = $sListUserId;
            $this->aFields['users_label'] = implode(',', $aListUserLogin);
        }
    }

    /**
     * delete a printstyle
     */
    function DELETE() {
        // Supprime les utilisateurs rattachés au style.
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'user_printstyle', 'printstyle_id', $this->aValues["my_vitis_id"]);
        // Supprime le style
        $this->oConnection->oBd->delete($this->aProperties['schema_vmap'], 'printstyle', 'printstyle_id', $this->aValues['my_vitis_id'], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
            $this->aFields[printstyle_id] = $this->aValues['my_vitis_id'];
        }
    }

}

?>
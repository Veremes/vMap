<?php

/**
 * \file Installations.class.inc
 * \class Installations
 *
 * \author WAB <support.wab@veremes.com>.
 *
 * 	\brief This file contains the Installations php class
 *
 * This class defines Rest Api to Vitis Installations
 * 
 */
require_once __DIR__ . '/Anc.class.inc';
require_once 'Installation.class.inc';


class Installations extends Anc {
    /**
     * @SWG\Definition(
     *   definition="/installations",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/installations")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Installations",
     *   description="Operations about Installations"
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
        $this->aSelectedFields = Array("id_installation", "id_com", "id_parc", "parc_sup", "parc_parcelle_associees", "parc_adresse", "code_postal", "parc_commune", "prop_titre", "prop_nom_prenom", "prop_adresse", "prop_code_postal", "prop_commune", "prop_tel", "prop_mail", "bati_type", "bati_ca_nb_pp", "bati_ca_nb_eh", "bati_ca_nb_chambres", "bati_ca_nb_autres_pieces", "bati_ca_nb_occupant", "bati_nb_a_control", "bati_date_achat", "bati_date_mutation", "cont_zone_enjeu", "cont_zone_sage", "cont_zone_autre", "cont_zone_urba", "cont_zone_anc", "cont_alim_eau_potable", "cont_puits_usage", "cont_puits_declaration", "cont_puits_situation", "cont_puits_terrain_mitoyen", "observations", "maj", "maj_date", "create", "create_date", "archivage", "geom", "photo_f", "document_f", "num_dossier", "commune", "section", "parcelle", "nb_controle", "last_date_control", "cl_avis", "next_control", "classement_installation");
    }

    /**
     * @SWG\Get(path="/installations",
     *   tags={"Installations"},
     *   summary="Get Installations",
     *   description="Request to get Installations",
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
     *     description="sort_order",
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
     *         description="installation Response",
     *         @SWG\Schema(ref="#/definitions/installations")
     *     )
     *  )
     */

    /**
     * get Installations
     * @return  Installations
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_anc'], "v_installation", "id_installation");
        $sMessage = $aReturn['sMessage'];
        return $sMessage;
    }

    /**
     * @SWG\Post(path="/installations",
     *   tags={"Installations"},
     *   summary="Add installation",
     *   description="Request to add Installations",
     *   operationId="POST",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="installation Response",
     *         @SWG\Schema(ref="#/definitions/installations")
     *     )
     *  )
     */

    /**
     * insert installation
     * @return id of the installation created
     */
    function POST() {
        $this->aValues['create'] = $_SESSION["ses_Login"];
        $this->aValues['create_date'] = date('Y-m-d');
        $aReturn = $this->genericPost($this->aProperties['schema_anc'], 'v_installation', $this->aProperties['schema_anc'].'.installation_id_installation_seq', 'id_installation');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/installations/{id_installation}",
     *   tags={"Installations"},
     *   summary="update Installations",
     *   description="Request to update Installations",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Installation token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_installation",
     *     in="path",
     *     description="id of the Installations",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/installations")
     *     )
     *  )
     */

    /**
     * update installations
     * @return id of installations updated or error object if a installations is not updated
     */
    function PUT() {
        if (empty($this->aValues['maj']))
            $this->aValues['maj'] = $_SESSION["ses_Login"];
        if (empty($this->aValues['maj_date']))
            $this->aValues['maj_date'] = date('Y-m-d');
        // Upload les fichiers.
        $this->uploadDocument('photo_f', 'anc_saisie_anc_installation');
        $this->uploadDocument('document_f', 'anc_saisie_anc_installation');
        // Zone PLU.
        if (!empty($this->aValues['geom'])) {
            $sSchema = $this->aProperties["anc"]["cont_zone_urba"]["intersect"]["schema"];
            $sTable = $this->aProperties["anc"]["cont_zone_urba"]["intersect"]["table"];
            $sColumn = $this->aProperties["anc"]["cont_zone_urba"]["intersect"]["column"];
            $sColumnGeom = $this->aProperties["anc"]["cont_zone_urba"]["intersect"]["column_geom"];
            if (!empty($sSchema) && !empty($sTable) && !empty($sColumn) && !empty($sColumnGeom)) {
                require $this->sRessourcesFile;
                $aParams['sSchema'] = array('value' => $sSchema, 'type' => 'schema_name');
                $aParams['sTable'] = array('value' => $sTable, 'type' => 'table_name');
                $aParams['sColumn'] = array('value' => $sColumn, 'type' => 'column_name');
                $aParams['sColumnGeom'] = array('value' => $sColumnGeom, 'type' => 'column_name');
                $aParams['geom'] = array('value' => $this->aValues['geom'], 'type' => 'geometry');
                $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getContZoneUrbaIntersect'], $aParams);
                if ($this->oConnection->oBd->nombreLigne($oPDOresult) > 0) {
                    $aLigne = $this->oConnection->oBd->ligneSuivante ($oPDOresult);
                    $this->aValues['cont_zone_urba'] = $aLigne[$sColumn];
                }
            }
        }
        $aReturn = $this->genericPut($this->aProperties['schema_anc'], 'v_installation', 'id_installation');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/installations",
     *   tags={"Installations"},
     *   summary="delete Installations",
     *   description="Request to delete Installations",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id of the installation",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="installation Response",
     *         @SWG\Schema(ref="#/definitions/installations")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/installations/{id_installation}",
     *   tags={"Installations"},
     *   summary="delete Installations",
     *   description="Request to delete Installations",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Installation token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_installation",
     *     in="path",
     *     description="id of the Installations",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/installations")
     *     )
     *  )
     */

    /**
     * delete installations
     * @return id of installations deleted or error object if a installations is not deleted
     */
    function DELETE() {
        require $this->sRessourcesFile;
        // Pas de Suppression si des contrôles sont associés.
        $aParams['sSchemaAnc'] = array('value' => $this->aProperties['schema_anc'], 'type' => 'schema_name');
        $aParams['idList'] = array('value' => $this->aValues['idList'], 'type' => 'group');
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getInstallationControls'], $aParams);
        if ($this->oConnection->oBd->enErreur()) {
            $aReturn = array('status' => 0, 'message' => $this->oConnection->oBd->getBDMessage(), 'error_code' => 1);
            return json_encode($aReturn);
        }
        else {
            if ($this->oConnection->oBd->nombreLigne($oPDOresult) > 0) {
                $aReturn = array('status' => 0, 'errorMessage' => 'Des contrôles sont associés à / aux installation(s) à supprimer.', 'error_code' => 1);
                return json_encode($aReturn);
            }
            else {
                $aReturn = $this->genericDelete($this->aProperties['schema_anc'], 'v_installation', 'id_installation');
                return $aReturn['sMessage'];
            }
        }
    }
}
?>
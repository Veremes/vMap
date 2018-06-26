<?php

/**
 * \file Controles.class.inc
 * \class Controles
 *
 * \author WAB <support.wab@veremes.com>.
 *
 * 	\brief This file contains the Controles php class
 *
 * This class defines Rest Api to Vitis Controles
 * 
 */
require_once __DIR__ . '/Anc.class.inc';
require_once 'Controle.class.inc';
require_once 'Evacuation_eauxs.class.inc';
require_once 'Filieres_agrees.class.inc';
require_once 'Pretraitements.class.inc';
require_once 'Traitements.class.inc';
require_once 'Composants.class.inc';

class Controles extends Anc {
    /**
     * @SWG\Definition(
     *   definition="/controles",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/controles")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Controles",
     *   description="Operations about Controles"
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
    }

    /**
     * @SWG\Get(path="/controles",
     *   tags={"Controles"},
     *   summary="Get Controles",
     *   description="Request to get Controles",
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
     *         description="controle Response",
     *         @SWG\Schema(ref="#/definitions/controles")
     *     )
     *  )
     */

    /**
     * get Controles
     * @return  Controles
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_anc'], "v_controle", "id_controle");
        $sMessage = $aReturn['sMessage'];
        return $sMessage;
    }

    /**
     * @SWG\Post(path="/controles",
     *   tags={"Controles"},
     *   summary="Add controle",
     *   description="Request to add Controles",
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
     *         description="controle Response",
     *         @SWG\Schema(ref="#/definitions/controles")
     *     )
     *  )
     */

    /**
     * insert controle
     * @return id of the controle created
     */
    function POST() {
        $this->aValues['create'] = $_SESSION["ses_Login"];
        $this->aValues['create_date'] = date('Y-m-d');
        //if (empty($this->aValues['des_date_control']))
            //$this->aValues['des_date_control'] = date('Y-m-d');
        if (empty($this->aValues['des_interval_control']))
            $this->aValues['des_interval_control'] = 0;
        // Sauve le nom des fichiers.
        if (!empty($_FILES['photos_f']))
            $this->aValues['photos_f'] = $_FILES['photos_f']["name"];
        if (!empty($_FILES['fiche_f']))
            $this->aValues['fiche_f'] = $_FILES['fiche_f']["name"];
        if (!empty($_FILES['rapport_f']))
            $this->aValues['rapport_f'] = $_FILES['rapport_f']["name"];
        if (!empty($_FILES['schema_f']))
            $this->aValues['schema_f'] = $_FILES['schema_f']["name"];
        if (!empty($_FILES['documents_f']))
            $this->aValues['documents_f'] = $_FILES['documents_f']["name"];
        if (!empty($_FILES['plan_f']))
            $this->aValues['plan_f'] = $_FILES['plan_f']["name"];
        // Conversion des dates
        $aDates = array('cl_date_avis', 'cl_facture_le', 'des_date_installation', 'des_date_recommande', 'dep_date_depot', 'dep_date_envoi_incomplet', 'des_date_control');
        foreach ($aDates as $sDate) {
            if (isset($this->aValues[$sDate])) {
                if ($this->aValues[$sDate] == '')
                    unset($this->aValues[$sDate]);
                else
                    $this->aValues[$sDate] = date_format(date_create_from_format('d/m/Y', $this->aValues[$sDate]), 'Y-m-d');
            }
        }
        //
        $aReturn = $this->genericPost($this->aProperties['schema_anc'], 'v_controle', $this->aProperties['schema_anc'] . '.controle_id_controle_seq', 'id_controle');
        // Upload les fichiers.
        $this->uploadDocument('photos_f', 'anc_saisie_anc_controle');
        $this->uploadDocument('fiche_f', 'anc_saisie_anc_controle');
        $this->uploadDocument('rapport_f', 'anc_saisie_anc_controle');
        $this->uploadDocument('schema_f', 'anc_saisie_anc_controle');
        $this->uploadDocument('documents_f', 'anc_saisie_anc_controle');
        $this->uploadDocument('plan_f', 'anc_saisie_anc_controle');
        //
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/controles/{id_controle}",
     *   tags={"Controles"},
     *   summary="update Controles",
     *   description="Request to update Controles",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Controle token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_controle",
     *     in="path",
     *     description="id of the Controles",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/controles")
     *     )
     *  )
     */

    /**
     * update controles
     * @return id of controles updated or error object if a controles is not updated
     */
    function PUT() {
        if (empty($this->aValues['maj']))
            $this->aValues['maj'] = $_SESSION["ses_Login"];
        if (empty($this->aValues['maj_date']))
            $this->aValues['maj_date'] = date('Y-m-d');
        // Upload les fichiers.
        $this->uploadDocument('photos_f', 'anc_saisie_anc_controle');
        $this->uploadDocument('fiche_f', 'anc_saisie_anc_controle');
        $this->uploadDocument('rapport_f', 'anc_saisie_anc_controle');
        $this->uploadDocument('schema_f', 'anc_saisie_anc_controle');
        $this->uploadDocument('documents_f', 'anc_saisie_anc_controle');
        $this->uploadDocument('plan_f', 'anc_saisie_anc_controle');

        // Si il y a des composants à ajouter/supprimer/mettre à jour
        if (!empty($this->aValues['composants'])) {

            // Supprime les composants liés au controle
            $this->deleteControleComposants($this->aPath[2]);

            // Récupère les composants au bon format
            $aComposants = $this->getTableFormedComposants(json_decode($this->aValues['composants'], true));

            // Inserre les composants
            $this->createComposants($aComposants);
        }
        // Conversion des dates
        $aDates = array('cl_date_avis', 'cl_facture_le', 'des_date_control', 'des_date_installation', 'des_date_recommande', 'dep_date_depot', 'dep_date_envoi_incomplet');
        foreach ($aDates as $sDate) {
            if (isset($this->aValues[$sDate])) {
                if ($this->aValues[$sDate] == '')
                    unset($this->aValues[$sDate]);
                else
                    $this->aValues[$sDate] = date_format(date_create_from_format('d/m/Y', $this->aValues[$sDate]), 'Y-m-d');
            }
        }
        //
        $aReturn = $this->genericPut($this->aProperties['schema_anc'], 'v_controle', 'id_controle');
        return $aReturn['sMessage'];
    }

    /**
     * Get the composant on table format
     * @param array $aGeoJSONComposants
     * @return array
     */
    function getTableFormedComposants($aGeoJSONComposants) {
        $aComposants = array();

        for ($i = 0; $i < count($aGeoJSONComposants['features']); $i++) {

            $aTmpComposant = array();

            // Récupère la géométrie en EWKT
            if (!empty($aGeoJSONComposants['features'][$i]['geometry'])) {
                $sSql = 'SELECT ST_AsEWKT(ST_SetSRID(ST_GeomFromGeoJSON([geom]), 4326)) as ewktgeom';
                $aSQLParams = array('geom' => array('value' => json_encode($aGeoJSONComposants['features'][$i]['geometry']), 'type' => 'geometry'));
                $oPDOresult = $this->oConnection->oBd->executeWithParams($sSql, $aSQLParams);
                if (!$this->oConnection->oBd->enErreur()) {
                    while ($aLine = $this->oConnection->oBd->ligneSuivante($oPDOresult)) {
                        $aTmpComposant['geom'] = $aLine['ewktgeom'];
                    }
                }
            }

            if (!empty($aGeoJSONComposants['features'][$i]['properties'])) {
                if (!empty($aGeoJSONComposants['features'][$i]['properties']['attributes'])) {
                    foreach ($aGeoJSONComposants['features'][$i]['properties']['attributes'] as $key => $value) {
                        $aTmpComposant[$key] = $value;
                    }
                }
                if (!empty($aGeoJSONComposants['features'][$i]['properties']['style'])) {
                    if (!empty($aGeoJSONComposants['features'][$i]['properties']['style']['draw'])) {
                        foreach ($aGeoJSONComposants['features'][$i]['properties']['style']['draw'] as $key => $value) {
                            $aTmpComposant['draw_' . $key] = $value;
                        }
                    }
                    if (!empty($aGeoJSONComposants['features'][$i]['properties']['style']['text'])) {
                        foreach ($aGeoJSONComposants['features'][$i]['properties']['style']['text'] as $key => $value) {
                            $aTmpComposant['text_' . $key] = $value;
                        }
                    }
                }
            }
            array_push($aComposants, $aTmpComposant);
        }


        return $aComposants;
    }

    /**
     * Insert the composants defined in $aComposants
     * @param array $aComposants
     */
    function createComposants($aComposants) {
        for ($i = 0; $i < count($aComposants); $i++) {
            $aPath = array('anc', 'composants');
            $aValues = array(
                'token' => $this->aValues['token'],
                'output' => $this->aValues['output'],
                'sEncoding' => $this->aValues['sEncoding'],
                'sSourceEncoding' => $this->aValues['sSourceEncoding'],
                'xslstylesheet' => $this->aValues['xslstylesheet'],
                'module' => $this->aValues['module'],
                'id_controle' => $this->aPath[2]
            );
            $aValues = array_merge($aValues, $aComposants[$i]);
            $oComposants = new Composants($aPath, $aValues, $this->aProperties, $this->oConnection);
            $oComposants->POST();
        }
    }

    /**
     * @SWG\Delete(path="/controles",
     *   tags={"Controles"},
     *   summary="delete Controles",
     *   description="Request to delete Controles",
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
     *     description="id of the controle",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="controle Response",
     *         @SWG\Schema(ref="#/definitions/controles")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/controles/{id_controle}",
     *   tags={"Controles"},
     *   summary="delete Controles",
     *   description="Request to delete Controles",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Controle token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_controle",
     *     in="path",
     *     description="id of the Controles",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/controles")
     *     )
     *  )
     */

    /**
     * delete controles
     * @return id of controles deleted or error object if a controles is not deleted
     */
    function DELETE() {
        require $this->sRessourcesFile;

        // Supprime les objets dépendants
        $this->deleteControleDependencies($this->aValues['idList']);

//        $aParams['idControle'] = array('value' => $this->aValues['id_controle'], 'type' => 'integer');
//        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getInstallationControls'], $aParams);
//        if ($this->oConnection->oBd->enErreur()) {
//            $aReturn = array('status' => 0, 'message' => $this->oConnection->oBd->getBDMessage(), 'error_code' => 1);
//            return json_encode($aReturn);
//        }

        $aReturn = $this->genericDelete($this->aProperties['schema_anc'], 'v_controle', 'id_controle');
        return $aReturn['sMessage'];
    }

    /**
     * Delete the controle dependencies
     * @param string $sIdControles
     */
    function deleteControleDependencies($sIdControles) {

        // Suppression dpépendance s_anc.evacuation_eaux
        $this->deleteControleEvacuationEaux($sIdControles);

        // Suppression dpépendance s_anc.filieres_agrees
        $this->deleteControleFilieresAgrees($sIdControles);

        // Suppression dpépendance s_anc.pretraitement
        $this->deleteControlePretraitements($sIdControles);

        // Suppression dpépendance s_anc.traitement
        $this->deleteControleTraitements($sIdControles);
        
        // Suppression dpépendance s_anc.composant
        $this->deleteControleComposants($sIdControles);
    }

    /**
     * Get the composant's evacuationEaux
     * @param string $sIdControles
     * @return array|null
     */
    function getControleEvacuationEaux($sIdControles) {
        require $this->sRessourcesFile;

        $aParams = array();
        $aParams['sSchemaAnc'] = array('value' => $this->aProperties['schema_anc'], 'type' => 'schema_name');
        $aParams['idList'] = array('value' => $sIdControles, 'type' => 'group');
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getControleEvacuationEaux'], $aParams);
        if ($this->oConnection->oBd->enErreur()) {
            return null;
        } else {
            $aEvacuationEaux = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);
            return $aEvacuationEaux;
        }
    }

    /**
     * Get the composant's FilieresAgrees
     * @param string $sIdControles
     * @return array|null
     */
    function getControleFilieresAgrees($sIdControles) {
        require $this->sRessourcesFile;

        $aParams = array();
        $aParams['sSchemaAnc'] = array('value' => $this->aProperties['schema_anc'], 'type' => 'schema_name');
        $aParams['idList'] = array('value' => $sIdControles, 'type' => 'group');
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getControleFilieresAgrees'], $aParams);
        if ($this->oConnection->oBd->enErreur()) {
            return null;
        } else {
            $aFilieresAgrees = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);
            return $aFilieresAgrees;
        }
    }

    /**
     * Get the composant's Pretraitement
     * @param string $sIdControles
     * @return array|null
     */
    function getControlePretraitements($sIdControles) {
        require $this->sRessourcesFile;

        $aParams = array();
        $aParams['sSchemaAnc'] = array('value' => $this->aProperties['schema_anc'], 'type' => 'schema_name');
        $aParams['idList'] = array('value' => $sIdControles, 'type' => 'group');
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getControlePretraitements'], $aParams);
        if ($this->oConnection->oBd->enErreur()) {
            return null;
        } else {
            $aPretraitement = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);
            return $aPretraitement;
        }
    }

    /**
     * Get the composant's Traitement
     * @param string $sIdControles
     * @return array|null
     */
    function getControleTraitements($sIdControles) {
        require $this->sRessourcesFile;

        $aParams = array();
        $aParams['sSchemaAnc'] = array('value' => $this->aProperties['schema_anc'], 'type' => 'schema_name');
        $aParams['idList'] = array('value' => $sIdControles, 'type' => 'group');
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getControleTraitements'], $aParams);
        if ($this->oConnection->oBd->enErreur()) {
            return null;
        } else {
            $aTraitement = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);
            return $aTraitement;
        }
    }

    /**
     * Get the composant's Composant
     * @param string $sIdControles
     * @return array|null
     */
    function getControleComposants($sIdControles) {
        require $this->sRessourcesFile;

        $aParams = array();
        $aParams['sSchemaAnc'] = array('value' => $this->aProperties['schema_anc'], 'type' => 'schema_name');
        $aParams['idList'] = array('value' => $sIdControles, 'type' => 'group');
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getControleComposants'], $aParams);
        if ($this->oConnection->oBd->enErreur()) {
            return null;
        } else {
            $aComposant = $this->oConnection->oBd->getResultTableAssoc($oPDOresult);
            return $aComposant;
        }
    }

    /**
     * Delete the composant's EvacuationEaux
     * @param string $sIdControles
     */
    function deleteControleEvacuationEaux($sIdControles) {

        $aEvacuationEaux = $this->getControleEvacuationEaux($sIdControles);
        if (!empty($aEvacuationEaux)) {
            if (count($aEvacuationEaux) > 0) {
                $sIdList = '';
                $aIdList = array();
                for ($i = 0; $i < count($aEvacuationEaux); $i++) {
                    if (!empty($aEvacuationEaux[$i]['id_eva'])) {
                        array_push($aIdList, $aEvacuationEaux[$i]['id_eva']);
                    }
                }
                $sIdList = join('|', $aIdList);
                $aPath = array('anc', 'evacuation_eauxs');
                $aValues = array(
                    'token' => $this->aValues['token'],
                    'output' => $this->aValues['output'],
                    'sEncoding' => $this->aValues['sEncoding'],
                    'sSourceEncoding' => $this->aValues['sSourceEncoding'],
                    'xslstylesheet' => $this->aValues['xslstylesheet'],
                    'module' => $this->aValues['module'],
                    'idList' => $sIdList,
                );
                $oComposants = new Evacuation_eauxs($aPath, $aValues, $this->aProperties, $this->oConnection);
                $oComposants->DELETE();
            }
        }
    }

    /**
     * Delete the composant's FilieresAgrees
     * @param string $sIdControles
     */
    function deleteControleFilieresAgrees($sIdControles) {

        $aFilieresAgrees = $this->getControleFilieresAgrees($sIdControles);

        if (!empty($aFilieresAgrees)) {
            if (count($aFilieresAgrees) > 0) {
                $sIdList = '';
                $aIdList = array();
                for ($i = 0; $i < count($aFilieresAgrees); $i++) {
                    if (!empty($aFilieresAgrees[$i]['id_fag'])) {
                        array_push($aIdList, $aFilieresAgrees[$i]['id_fag']);
                    }
                }
                $sIdList = join('|', $aIdList);
                $aPath = array('anc', 'evacuation_eauxs');
                $aValues = array(
                    'token' => $this->aValues['token'],
                    'output' => $this->aValues['output'],
                    'sEncoding' => $this->aValues['sEncoding'],
                    'sSourceEncoding' => $this->aValues['sSourceEncoding'],
                    'xslstylesheet' => $this->aValues['xslstylesheet'],
                    'module' => $this->aValues['module'],
                    'idList' => $sIdList,
                );
                $oComposants = new Filieres_agrees($aPath, $aValues, $this->aProperties, $this->oConnection);
                $oComposants->DELETE();
            }
        }
    }

    /**
     * Delete the composant's Pretraitement
     * @param string $sIdControles
     */
    function deleteControlePretraitements($sIdControles) {

        $aPretraitement = $this->getControlePretraitements($sIdControles);

        if (!empty($aPretraitement)) {
            if (count($aPretraitement) > 0) {
                $sIdList = '';
                $aIdList = array();
                for ($i = 0; $i < count($aPretraitement); $i++) {
                    if (!empty($aPretraitement[$i]['id_pretraitement'])) {
                        array_push($aIdList, $aPretraitement[$i]['id_pretraitement']);
                    }
                }
                $sIdList = join('|', $aIdList);
                $aPath = array('anc', 'evacuation_eauxs');
                $aValues = array(
                    'token' => $this->aValues['token'],
                    'output' => $this->aValues['output'],
                    'sEncoding' => $this->aValues['sEncoding'],
                    'sSourceEncoding' => $this->aValues['sSourceEncoding'],
                    'xslstylesheet' => $this->aValues['xslstylesheet'],
                    'module' => $this->aValues['module'],
                    'idList' => $sIdList,
                );
                $oComposants = new Pretraitements($aPath, $aValues, $this->aProperties, $this->oConnection);
                $oComposants->DELETE();
            }
        }
    }

    /**
     * Delete the composant's Traitement
     * @param string $sIdControles
     */
    function deleteControleTraitements($sIdControles) {

        $aTraitement = $this->getControleTraitements($sIdControles);

        if (!empty($aTraitement)) {
            if (count($aTraitement) > 0) {
                $sIdList = '';
                $aIdList = array();
                for ($i = 0; $i < count($aTraitement); $i++) {
                    if (!empty($aTraitement[$i]['id_traitement'])) {
                        array_push($aIdList, $aTraitement[$i]['id_traitement']);
                    }
                }
                $sIdList = join('|', $aIdList);
                $aPath = array('anc', 'evacuation_eauxs');
                $aValues = array(
                    'token' => $this->aValues['token'],
                    'output' => $this->aValues['output'],
                    'sEncoding' => $this->aValues['sEncoding'],
                    'sSourceEncoding' => $this->aValues['sSourceEncoding'],
                    'xslstylesheet' => $this->aValues['xslstylesheet'],
                    'module' => $this->aValues['module'],
                    'idList' => $sIdList,
                );
                $oComposants = new Traitements($aPath, $aValues, $this->aProperties, $this->oConnection);
                $oComposants->DELETE();
            }
        }
    }

    /**
     * Delete the composant's Composant
     * @param string $sIdControles
     */
    function deleteControleComposants($sIdControles) {

        $aComposant = $this->getControleComposants($sIdControles);

        if (!empty($aComposant)) {
            if (count($aComposant) > 0) {
                $sIdList = '';
                $aIdList = array();
                for ($i = 0; $i < count($aComposant); $i++) {
                    if (!empty($aComposant[$i]['id_composant'])) {
                        array_push($aIdList, $aComposant[$i]['id_composant']);
                    }
                }
                $sIdList = join('|', $aIdList);
                $aPath = array('anc', 'evacuation_eauxs');
                $aValues = array(
                    'token' => $this->aValues['token'],
                    'output' => $this->aValues['output'],
                    'sEncoding' => $this->aValues['sEncoding'],
                    'sSourceEncoding' => $this->aValues['sSourceEncoding'],
                    'xslstylesheet' => $this->aValues['xslstylesheet'],
                    'module' => $this->aValues['module'],
                    'idList' => $sIdList,
                );
                $oComposants = new Composants($aPath, $aValues, $this->aProperties, $this->oConnection);
                $oComposants->DELETE();
            }
        }
    }

}

?>
<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../vitis/Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

/**
 * \file fichedescriptiveinvariant.class.inc
 * \class FicheDescriptiveInvariant
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the FicheDescriptiveInvariant php class
 *
 * This class defines the rest api for fichedescriptiveinvariant
 * 
 */
class FicheDescriptiveInvariant extends Cadastre {
    /**
     * @SWG\Definition(
     *   definition="/fichedescriptiveinvariant",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/fichedescriptiveinvariant")
     *   }
     * )
     * * @SWG\Tag(
     *   name="fichedescriptiveinvariant",
     *   description="Operations about fichedescriptiveinvariant"
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
    }

    /**
     * @SWG\Get(path="/fichedescriptiveinvariant/{ID_BAT}",
     *   tags={"Invariant"},
     *   summary="Get the fichedescriptiveinvariant whith a table",
     *   description="Request to get a element intersected",
     *   operationId="GET",
     *   produces={"application/json"},
     * @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="ID_BAT",
     *     in="path",
     *     description="ID_BAT",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="FicheDescriptiveInvariant Response",
     *         @SWG\Schema(ref="#/definitions/fichedescriptiveinvariant")
     *     )
     *  )
     */

    /**
     * Get function to generate a token
     * @return the token
     */
    function GET() {
        
        if (!in_array('vmap_cadastre_user', $this->oConnection->aPrivileges)) {
            $oError = new VitisError(0, 'INSUFFICIENT_PRIVILEGES');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        // Infos sur l'invariant
        $ID_BAT = $this->aPath[2];
        $sSchema = 'public';
        $sTable = 'v_maj_fiche_inv_descr';
        $sFilter = "\"ID_BAT\" = '" . $ID_BAT . "'";
        $aAttributs = Array('ID_BAT', 'DVOILIB', 'LIBCOM', 'ID_COM', 'L_DTELOC', 'L_CCONLC', 'L_DNATLC', 'JDATAT', 'JANNAT', 'CCHPR', 'BIPEVLA1', 'DNBNIV', 'DNUBAT', 'DESC', 'DNIV', 'DVLTRT', 'INVAR');

        $oInvariantInfos['data'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $sFilter)[0];

        // Infos sur le P.E.V
        $sTable = 'v_maj_fiche_inv_pev';
        $aAttributs = Array('ID_BAT', 'DNUPEV', 'L_CCOAFF', 'DCAPEC', 'CCOSTB', 'DNUREF', 'BIPEVLA1', 'VLBAIA1');

        $oInvariantInfos['data']['PEV'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $sFilter);

        // Infos sur les habitations
        $sTable = 'v_maj_fiche_inv_hab';
        $aAttributs = Array('ID_BAT', 'DNUPEV', 'GEAULC', 'GELELC', 'GCHCLC', 'GTEGLC', 'DNBBAI', 'DNBDOU', 'DNBLAV', 'DNBWC', 'DEQDHA', 'DNBPPR', 'DNBPDC', 'DSUPDC', 'L_DMATGM', 'L_DMATTO', 'JANNAT', 'L_DETENT', 'DNBNIV', 'DNBSAM', 'DNBCHA', 'DNBCU8', 'DNBCU9', 'DNBSEA', 'DNBANN', 'CCONAD1', 'L_CCONAD1', 'DSUEIC1', 'CCONAD2', 'L_CCONAD2', 'DSUEIC2', 'CCONAD3', 'L_CCONAD3', 'DSUEIC3', 'CCONAD4', 'L_CCONAD4', 'DSUEIC4');

        $oInvariantInfos['data']['habitations'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $sFilter);

        // Infos sur les locaux pros
        $sTable = 'v_maj_fiche_inv_local_pro';
        $aAttributs = Array('ID_BAT', 'DNUPEV', 'DNUDES', 'VSURZT');

        $oInvariantInfos['data']['locauxPros'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $sFilter);

        // Infos sur les dépendances
        $sTable = 'v_maj_fiche_inv_dep';
        $aAttributs = Array('ID_BAT', 'DNUPEV', 'DSUDEP', 'GEAULC', 'GELELC', 'GCHCLC', 'DNBBAI', 'DNBDOU', 'DNBLAV', 'DNBWC', 'L_DMATGM', 'L_DMATTO', 'L_DETENT', 'L_CCONAD');

        $oInvariantInfos['data']['dependances'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $sFilter);

        // Infos sur les propriétaires
        $sTable = 'v_maj_fiche_inv_prop';
        $aAttributs = Array('ID_BAT', 'DQUALP', 'DDENOM', 'JDATNSS', 'DLDNSS', 'DLIGN3', 'DLIGN4', 'DLIGN6', 'L_CCODEM', 'L_CCODRO');

        $oInvariantInfos['data']['proprietaires'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $sFilter);

        // Infos sur les lots
        $sTable = 'v_maj_fiche_inv_lot';
        $aAttributs = Array('ID_BAT', 'KLOT', 'DNUMQL', 'DDENQL');

        $oInvariantInfos['data']['lots'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $sFilter);

        return json_encode($oInvariantInfos);
    }

}

?>
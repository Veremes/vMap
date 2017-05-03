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
     *   name="FicheDescriptiveInvariant",
     *   description="Operations about FicheDescriptiveInvariant"
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
        $sSchema = $this->aProperties['schema_majic'];
        $sTable = 'v_vmap_maj_fiche_inv_descr';
        $sFilter = "\"id_local\" = '" . $ID_BAT . "'";
        $aAttributs = Array('id_local as "ID_BAT"', 'dvoilib as "DVOILIB"', 'libcom as "LIBCOM"', 'id_com as "ID_COM"', 'l_dteloc as "L_DTELOC"', 'l_cconlc as "L_CCONLC"', 'l_dnatlc as "L_DNATLC"', 'jdatat as "JDATAT"', 'jannat as "JANNAT"', 'cchpr as "CCHPR"', 'bipevla1 as "BIPEVLA1"', 'dnbniv as "DNBNIV"', 'dnubat as "DNUBAT"', '"desc" as "DESC"', 'dniv as "DNIV"', 'dvltrt as "DVLTRT"', 'invar as "INVAR"');

        $oInvariantInfos['data'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $sFilter)[0];

        // Infos sur le P.E.V
        $sSchema = $this->aProperties['schema_majic'];
        $sTable = 'v_vmap_maj_fiche_inv_pev';
        $aAttributs = Array('id_local as "ID_BAT"', 'dnupev as "DNUPEV"', 'l_ccoaff as "L_CCOAFF"', 'dcapec as "DCAPEC"', 'ccostb as "CCOSTB"', 'dnuref as "DNUREF"', 'bipevla1 as "BIPEVLA1"', 'vlbaia1 as "VLBAIA1"');

        $oInvariantInfos['data']['PEV'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $sFilter);

        // Infos sur les habitations
        $sSchema = $this->aProperties['schema_majic'];
        $sTable = 'v_vmap_maj_fiche_inv_hab';
        $aAttributs = Array('id_local as "ID_BAT"', 'dnupev as "DNUPEV"', 'geaulc as "GEAULC"', 'gelelc as "GELELC"', 'gchclc as "GCHCLC"', 'gteglc as "GTEGLC"', 'dnbbai as "DNBBAI"', 'dnbdou as "DNBDOU"', 'dnblav as "DNBLAV"', 'dnbwc as "DNBWC"', 'deqdha as "DEQDHA"', 'dnbppr as "DNBPPR"', 'dnbpdc as "DNBPDC"',
            'dsupdc as "DSUPDC"', 'l_dmagtm as "L_DMATGM"', 'l_dmatto as "L_DMATTO"', 'jannat as "JANNAT"', 'l_detent as "L_DETENT"', 'dnbniv as "DNBNIV"', 'dnbsam as "DNBSAM"', 'dnbcha as "DNBCHA"', 'dnbcu8 as "DNBCU8"', 'dnbcu9 as "DNBCU9"', 'dnbsea as "DNBSEA"', 'dnbann as "DNBANN"', 'cconad1 as "CCONAD1"',
            'l_cconad1 as "L_CCONAD1"', 'dsueic1 as "DSUEIC1"', 'cconad2 as "CCONAD2"', 'l_cconad2 as "L_CCONAD2"', 'dsueic2 as "DSUEIC2"', 'cconad3 as "CCONAD3"', 'l_cconad3 as "L_CCONAD3"', 'dsueic3 as "DSUEIC3"', 'cconad4 as "CCONAD4"', 'l_cconad4 as "L_CCONAD4"', 'dsueic4 as "DSUEIC4"');

        $oInvariantInfos['data']['habitations'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $sFilter);

        // Infos sur les locaux pros
        $sSchema = $this->aProperties['schema_majic'];
        $sTable = 'v_vmap_maj_fiche_inv_local_pro';
        $aAttributs = Array('id_local as "ID_BAT"', 'dnupev as "DNUPEV"', 'dnudes as "DNUDES"', 'vsurzt as "VSURZT"');

        $oInvariantInfos['data']['locauxPros'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $sFilter);

        // Infos sur les dépendances
        $sSchema = $this->aProperties['schema_majic'];
        $sTable = 'v_vmap_maj_fiche_inv_dep';
        $aAttributs = Array('id_local as "ID_BAT"', 'dnupev as "DNUPEV"', 'dsudep as "DSUDEP"', 'geaulc as "GEAULC"', 'gelelc as "GELELC"', 'gchclc as "GCHCLC"', 'dnbbai as "DNBBAI"', 'dnbdou as "DNBDOU"', 'dnblav as "DNBLAV"', 'dnbwc as "DNBWC"', 'l_dmagtm as "L_DMATGM"', 'l_dmatto as "L_DMATTO"', 'l_detent as "L_DETENT"', 'l_cconad as "L_CCONAD"');

        $oInvariantInfos['data']['dependances'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $sFilter);

        // Infos sur les propriétaires
        $sSchema = $this->aProperties['schema_majic'];
        $sTable = 'v_vmap_maj_fiche_inv_prop';
        $aAttributs = Array('id_local as "ID_BAT"', 'dqualp as "DQUALP"', 'ddenom as "DDENOM"', 'jdatnss as "JDATNSS"', 'dldnss as "DLDNSS"', 'dlign3 as "DLIGN3"', 'dlign4 as "DLIGN4"', 'dlign6 as "DLIGN6"', 'l_ccodem as "L_CCODEM"', 'l_ccodro as "L_CCODRO"');

        $oInvariantInfos['data']['proprietaires'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $sFilter);

        // Infos sur les lots
        $sSchema = $this->aProperties['schema_majic'];
        $sTable = 'v_vmap_maj_fiche_inv_lot';
        $aAttributs = Array('id_local as "ID_BAT"', 'klot as "KLOT"', 'dnumql as "DNUMQL"', 'ddenql as "DDENQL"');

        $oInvariantInfos['data']['lots'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $sFilter);

        return json_encode($oInvariantInfos);
    }

}

?>
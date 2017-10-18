<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../vitis/Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

/**
 * \file fichedescriptiveparcelle.class.inc
 * \class FicheDescriptiveParcelle
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the FicheDescriptiveParcelle php class
 *
 * This class defines the rest api for fichedescriptiveparcelle
 * 
 */
class FicheDescriptiveParcelle extends Cadastre {
    /**
     * @SWG\Definition(
     *   definition="/fichedescriptiveparcelle",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/fichedescriptiveparcelle")
     *   }
     * )
     * * @SWG\Tag(
     *   name="FicheDescriptiveParcelle",
     *   description="Operations about FicheDescriptiveParcelle"
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
     * @SWG\Get(path="/fichedescriptiveparcelle/{ID_PAR}",
     *   tags={"Parcelle"},
     *   summary="Get the fichedescriptiveparcelle whith a table",
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
     *     name="ID_PAR",
     *     in="path",
     *     description="ID_PAR",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="FicheDescriptiveParcelle Response",
     *         @SWG\Schema(ref="#/definitions/fichedescriptiveparcelle")
     *     )
     *  )
     */

    /**
     * Get function to generate a token
     * @return the token
     */
    function GET() {

        $ID_PAR = $this->aPath[2];

        if (!in_array('vmap_cadastre_user', $this->oConnection->aPrivileges) && !in_array('vmap_cadastre_light_user', $this->oConnection->aPrivileges)) {
            $oError = new VitisError(0, 'INSUFFICIENT_PRIVILEGES');
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        // Vérifie les droits de d'utilisateur sur la commune
        if ($this->haveCommuneRights(substr($ID_PAR, 0, 5)) == false) {
            http_response_code(403);
            $aReturn['error']['errorMessage'] .= "L'utilisateur n'a pas les droits sur la commune";
            return json_encode($aReturn);
        }

        // Infos sur la parcelle
        $sSchema = $this->aProperties['schema_majic'];
        $sTable = 'v_vmap_maj_fiche_prc_descr';
        $aFilter = array(
            'column' => 'id_par',
            'compare_operator' => '=',
            'value' => $ID_PAR
        );
        $aAttributs = Array('id_par as "ID_PAR"', 'id_com as "ID_COM"', 'parcelle', 'commune', 'sup_fiscale', 'dcntpa as "DCNTPA"', 'dnvoiri as "DNVOIRI"', 'dindic as "DINDIC"', 'l_nature_voie as "L_NATURE_VOIE"', 'dvoilib as "DVOILIB"', 'ccoriv as "CCORIV"', 'gparbat as "GPARBAT"', 'gurbpa as "GURBPA"');

        $oParcelleInfos['data'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $aFilter)[0];

        // Infos sur le proprietaire
        $sSchemaProp = $this->aProperties['schema_majic'];
        $sTableProp = 'v_vmap_maj_fiche_prc_prop';
        $aFilterProp = array(
            'column' => 'id_par',
            'compare_operator' => '=',
            'value' => $ID_PAR
        );
        $aAttributsProp = Array('id_par as "ID_PAR"', 'dqualp as "DQUALP"', 'dnupro as "DNUPRO"', 'ddenom as "DDENOM"', 'jdatnss as "JDATNSS"', 'dldnss as "DLDNSS"', 'dlign3 as "DLIGN3"', 'dlign6 as "DLIGN6"', 'l_ccodem as "L_CCODEM"', 'l_ccodro as "L_CCODRO"', 'gdesip as "GDESIP"', 'dlign4 as "DLIGN4"');

        $oParcelleInfos['data']['aProprietaires'] = $this->vmapGet($sSchemaProp, $sTableProp, $aAttributsProp, $aFilterProp);

        // infos sur la subdivision fiscale
        $sSchemaSub = $this->aProperties['schema_majic'];
        $sTableSub = 'v_vmap_maj_fiche_prc_suf';
        $aFilterSub = array(
            'column' => 'id_par',
            'compare_operator' => '=',
            'value' => $ID_PAR
        );
        $aAttributsSub = Array('id_par as "ID_PAR"', 'ccosub as "CCOSUB"', 'dsgrpf as "DSGRPF"', 'cnatsp as "CNATSP"', 'l_dsgrpf as "L_DSGRPF"', 'dclssf as "DCLSSF"', 'dcntsf as "DCNTSF"', 'drcsuba as "DRCSUBA"', 'drcsub as "DRCSUB"');

        $oParcelleInfos['data']['aSubdivisionFiscale'] = $this->vmapGet($sSchemaSub, $sTableSub, $aAttributsSub, $aFilterSub);

        // Infos sur le bâti
        $sSchemaBatis = $this->aProperties['schema_majic'];
        $sTableBatis = 'v_vmap_maj_fiche_prc_bat';
        $aFilterBatis = array(
            'column' => 'id_par',
            'compare_operator' => '=',
            'value' => $ID_PAR
        );
        $aAttributsBatis = Array('id_local as "ID_BAT"', 'id_par as "ID_PAR"', 'invar as "INVAR"', 'id_local as "ID_BAT"', 'l_dteloc as "L_DTELOC"', 'l_cconlc as "L_CCONLC"', 'l_dnatlc as "L_DNATLC"', 'jdatat as "JDATAT"', 'jannat as "JANNAT"', 'ddenom as "DDENOM"');

        $oParcelleInfos['data']['aBatis'] = $this->vmapGet($sSchemaBatis, $sTableBatis, $aAttributsBatis, $aFilterBatis);


        // Infos complémentaires (paramétrées par l'administrateur)
        $aIntersectionViews = $this->aProperties['cadastre']['descr_parcel']['intersect']['views'];
        $iTolerance = $this->aProperties["cadastre"]["descr_parcel"]["intersect"]["tolerance"];

        // Récupère la géométrie de la parcelle
        $sSchema = $this->aProperties['schema_cadastre'];
        $sTable = $this->aProperties['cadastre']['views']['parcelle'];
        $aFilter = array(
            'column' => 'id_par',
            'compare_operator' => '=',
            'value' => $ID_PAR
        );
        $aAttributs = Array('ST_AsEWKT(geom) as geom');
        $parcelleGeom = $this->vmapGet($sSchema, $sTable, $aAttributs, $aFilter)[0]['geom'];

        // Récupère les intersections
        $oParcelleInfos['data']['aIntersections'] = array();
        

        foreach ($aIntersectionViews as $key => $value) {

            if (strpos($key, ".") === false) {
                $sSchema = "public";
                $sTable = $key;
            } else {
                $aTmp = explode(".", $key);
                $sSchema = $aTmp[0];
                $sTable = $aTmp[1];
            }
            $aAttributs = Array();

            foreach ($value as $key2 => $value2) {
                if ($key2 != 'title' && $key2 != 'type' && $key2 != 'intersect') {
                    array_push($aAttributs, $key2);
                }
            }

            $oIntersect = $this->vmapIntersectGet($sSchema, $sTable, $parcelleGeom, $aAttributs, $iTolerance);

            $value['data'] = $oIntersect;
            if (isset($value['data'][0]) && !empty($value['data'][0])) {
                $value['aFields'] = array_keys($value['data'][0]);
            } else {
                $value['aFields'] = array();
            }

            array_push($oParcelleInfos['data']['aIntersections'], $value);
        }

        return json_encode($oParcelleInfos);
    }

}

?>
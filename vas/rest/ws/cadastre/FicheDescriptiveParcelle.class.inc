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
     * @param type $bShortcut false to reinit variables
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        parent::__construct($aPath, $aValues, $properties, $bShortcut, $oConnection);
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
        if ($this->haveCommuneRights(substr($ID_PAR, 0, 6)) == false) {
            http_response_code(403);
            $aReturn['error']['errorMessage'] .= "L'utilisateur n'a pas les droits sur la commune";
            return json_encode($aReturn);
        }

        // Infos sur la parcelle
        $sSchema = 'public';
        $sTable = 'v_maj_fiche_prc_descr';
//        $sFilter = "\"ID_PAR\" = '" . $ID_PAR . "'";
        $aFilter = array(
            'column' => 'ID_PAR',
            'compare_operator' => '=',
            'value' => $ID_PAR
        );
        $aAttributs = Array('ID_PAR', 'ID_COM', 'parcelle', 'commune', 'sup_fiscale', 'DCNTPA', 'DNVOIRI', 'DINDIC', 'L_NATURE_VOIE', 'DVOILIB', 'CCORIV', 'GPARBAT', 'GURBPA');

        $oParcelleInfos['data'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $aFilter)[0];

        // Infos sur le proprietaire
        $sSchemaProp = 'public';
        $sTableProp = 'v_maj_fiche_prc_prop';
//        $sFilterProp = "\"ID_PAR\" = '" . $ID_PAR . "'";
        $aFilterProp = array(
            'column' => 'ID_PAR',
            'compare_operator' => '=',
            'value' => $ID_PAR
        );
        $aAttributsProp = Array('ID_PAR', 'DQUALP', 'DNUPRO', 'DDENOM', 'JDATNSS', 'DLDNSS', 'DLIGN3', 'DLIGN6', 'L_CCODEM', 'L_CCODRO', 'GDESIP', 'DLIGN4');

        $oParcelleInfos['data']['aProprietaires'] = $this->vmapGet($sSchemaProp, $sTableProp, $aAttributsProp, $aFilterProp);

        // infos sur la subdivision fiscale
        $sSchemaSub = 'public';
        $sTableSub = 'v_maj_fiche_prc_suf';
//        $sFilterSub = "\"ID_PAR\" = '" . $ID_PAR . "'";
        $aFilterSub = array(
            'column' => 'ID_PAR',
            'compare_operator' => '=',
            'value' => $ID_PAR
        );
        $aAttributsSub = Array('ID_PAR', 'CCOSUB', 'DSGRPF', 'CNATSP', 'L_DSGRPF', 'DCLSSF', 'DCNTSF', 'DRCSUBA', 'DRCSUB');

        $oParcelleInfos['data']['aSubdivisionFiscale'] = $this->vmapGet($sSchemaSub, $sTableSub, $aAttributsSub, $aFilterSub);

        // Infos sur le bâti
        $sSchemaBatis = 'public';
        $sTableBatis = 'v_maj_fiche_prc_bat';
//        $sFilterBatis = "\"ID_PAR\" = '" . $ID_PAR . "'";
        $aFilterBatis = array(
            'column' => 'ID_PAR',
            'compare_operator' => '=',
            'value' => $ID_PAR
        );
        $aAttributsBatis = Array('ID_BAT', 'ID_PAR', 'INVAR', 'ID_BAT', 'L_DTELOC', 'L_CCONLC', 'L_DNATLC', 'JDATAT', 'JANNAT', 'DDENOM');

        $oParcelleInfos['data']['aBatis'] = $this->vmapGet($sSchemaBatis, $sTableBatis, $aAttributsBatis, $aFilterBatis);


        // Infos complémentaires (paramétrées par l'administrateur)
        $iTolerance = $this->aProperties["cadastre"]["descr_parcel"]["intersect"]["tolerance"];
        $aIntersectionViews = $this->aProperties['cadastre']['descr_parcel']['intersect']['views'];

        // Récupère la géométrie de la parcelle
        $sSchema = 'public';
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
                if ($key2 != 'title' && $key2 != 'type' && $key2 != 'intersect' && $key2 != 'geom_column') {
                    array_push($aAttributs, $key2);
                }
            }

            if (!empty($value['geom_column'])) {
                $sGeomColumn = $value['geom_column'];
            } else {
                $sGeomColumn = 'geom';
            }

            if (!empty($value['type'])) {
                $sGeomType = $value['type'];
            } else {
                $sGeomType = 'POLYGON';
            }

            $aIntersect = $this->vmapIntersectGet($sSchema, $sTable, $parcelleGeom, $aAttributs, $iTolerance, $sGeomColumn, $sGeomType);

            $value['data'] = $aIntersect;
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
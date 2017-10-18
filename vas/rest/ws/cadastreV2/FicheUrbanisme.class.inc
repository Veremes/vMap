<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../vitis/Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once __DIR__ . '/../../class/vmlib/BdDataAccess.inc';

/**
 * \file ficheurbanisme.class.inc
 * \class FicheUrbanisme
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the FicheUrbanisme php class
 *
 * This class defines the rest api for ficheurbanisme
 * 
 */
class FicheUrbanisme extends Cadastre {
    /**
     * @SWG\Definition(
     *   definition="/ficheurbanisme",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/ficheurbanisme")
     *   }
     * )
     * * @SWG\Tag(
     *   name="FicheUrbanisme",
     *   description="Operations about FicheUrbanisme"
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
     * @SWG\Get(path="/ficheurbanisme/{ID_PAR}",
     *   tags={"Parcelle"},
     *   summary="Get the ficheurbanisme whith a table",
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
     *         description="FicheUrbanisme Response",
     *         @SWG\Schema(ref="#/definitions/ficheurbanisme")
     *     )
     *  )
     */

    /**
     * Get function to generate a token
     * @return the token
     */
    function GET() {

        $ID_PAR = $this->aPath[2];

        if (!in_array('vmap_cadastre_user', $this->oConnection->aPrivileges)) {
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
        $sTable = 'v_vmap_maj_fiche_urb';
        // $sFilter = "\"id_par\" = '" . $ID_PAR . "'";
        $aFilter = array(
            'column' => 'id_par',
            'compare_operator' => '=',
            'value' => $ID_PAR
        );
        $aAttributs = Array('id_par as "ID_PAR"', 'libdep as "LIBDEP"', 'libcom as "LIBCOM"', 'dnupla as "DNUPLA"', 'ccosec as "CCOSEC"', 'dcntpa as "DCNTPA"', 'ddenom as "DDENOM"', 'dlign3 as "DLIGN3"', 'dlign4 as "DLIGN4"', 'dlign6 as "DLIGN6"', 'l_dsgrpf as "DSGRPF"', '"dnvoiri" || "dindic" || \' \' || "cconvo" || \' \' || "dvoilib" as "ADRESSE"');

        $oParcelleInfos['data'] = $this->vmapGet($sSchema, $sTable, $aAttributs, $aFilter);
        // Géométrie
        $sSchema = $this->aProperties['schema_cadastre'];
        $sTable = $this->aProperties['cadastre']['views']['parcelle'];
        // $sFilter = "id_par = '" . $ID_PAR . "'";
        $aFilter = array(
            'column' => 'id_par',
            'compare_operator' => '=',
            'value' => $ID_PAR
        );
        if (!empty($this->aValues['result_srid']))
            $aAttributs = Array('ST_AsEWKT(ST_Transform(geom, ' . $this->aValues['result_srid'] . ')) as geom');
        else
            $aAttributs = Array('ST_AsEWKT(geom) as geom');

        $aRecords = $this->vmapGet($sSchema, $sTable, $aAttributs, $aFilter);
        $oParcelleInfos['data']['geometry'] = $aRecords[0];

        // Récupère la géométrie de la parcelle
        $parcelleGeom = $aRecords[0]['geom'];

        // Récupère les intersections
        $oParcelleInfos['data']['aIntersections'] = array();
        $oParcelleInfos['data']['aIntersectionsArray'] = array();

        // Infos complémentaires (paramétrées par l'administrateur)
        $aIntersectionViews = $this->aProperties['cadastre']['fiche_urb']['intersect']['views'];
        $iTolerance = $this->aProperties["cadastre"]["fiche_urb"]["intersect"]["tolerance"];
        if (is_array($aIntersectionViews)) {
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
                array_push($oParcelleInfos['data']['aIntersections'], $value);
            }
        }
        $aIntersectionArrayViews = $this->aProperties['cadastre']['fiche_urb']['intersect']['array_views'];
        if (is_array($aIntersectionArrayViews)) {
            for ($i = 0; $i < count($aIntersectionArrayViews); $i++) {
                foreach ($aIntersectionArrayViews[$i] as $key => $value) {
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
                    array_push($oParcelleInfos['data']['aIntersectionsArray'], $value);
                }
            }
        }

        return json_encode($oParcelleInfos);
    }

}

?>
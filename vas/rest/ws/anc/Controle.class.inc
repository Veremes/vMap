<?php

require_once __DIR__ . '/Anc.class.inc';
require_once __DIR__ . '/Composants.class.inc';
require_once __DIR__ . '/ComposantTypeFeatureStyles.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Controle.class.inc
 * \class Controle
 *
 * \author WAB <support.wab@veremes.com>.
 *
 * 	\brief This file contains the Controle php class
 *
 * This class defines operation for one Controle
 * 
 */
class Controle extends Anc {

    public $oError;

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
     * @SWG\Get(path="/controles/{id_controle}", 
     *   tags={"Controles"},
     *   summary="Get Controle",
     *   description="Request to get Controle by id",
     *   operationId="GET",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="id_controle",
     *     in="path",
     *     description="id_controle",
     *     required=true,
     *     type="integer",
     *   format="int32"
     *   ),
     * @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="list of attributs",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Controle Response",
     *         @SWG\Schema(ref="#/definitions/controles")
     *     )
     *  )
     */

    /**
     * get informations about mode
     */
    function GET() {
        $this->aFields = $this->getFields($this->aProperties['schema_anc'], "v_controle", "id_controle");
        // Url des fichiers.
        $sWsDataUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['ws_data_alias'] . '/anc/anc_saisie_anc_controle/documents/' . $this->aValues["my_vitis_id"];
        if (!empty($this->aFields['photos_f']))
            $this->aFields['photos_f'] = $sWsDataUrl . '/photos_f/' . $this->aFields['photos_f'];
        if (!empty($this->aFields['fiche_f']))
            $this->aFields['fiche_f'] = $sWsDataUrl . '/fiche_f/' . $this->aFields['fiche_f'];
        if (!empty($this->aFields['rapport_f']))
            $this->aFields['rapport_f'] = $sWsDataUrl . '/rapport_f/' . $this->aFields['rapport_f'];
        if (!empty($this->aFields['schema_f']))
            $this->aFields['schema_f'] = $sWsDataUrl . '/schema_f/' . $this->aFields['schema_f'];
        if (!empty($this->aFields['documents_f']))
            $this->aFields['documents_f'] = $sWsDataUrl . '/documents_f/' . $this->aFields['documents_f'];
        if (!empty($this->aFields['plan_f']))
            $this->aFields['plan_f'] = $sWsDataUrl . '/plan_f/' . $this->aFields['plan_f'];

        // Champ sur lequel sera fait le typage pour changer les styles etc..
        $this->sTyleField = 'composant_type';
        // custom_form du controle pour map_workbench
        $this->getCustomFormInfos();
        // Composants du controle
        $this->getComposants();
    }

    /**
     * Récupère au format GeoJSON les composants à afficher
     */
    function getComposants() {
        $aPath = array('anc', 'composants');
        $aValues = $this->aValues;
        unset($aValues['my_vitis_id']);
        unset($aValues['attributs']);
        //$aValues['attributs'] = 'composant_type|label|observations||geom';
        $aValues['filter'] = '{"column":"id_controle","compare_operator":"=","value":"' . $this->aFields['id_controle'] . '"}';
        $oComposants = new Composants($aPath, $aValues, $this->aProperties, $this->oConnection);
        $oComposants->GET();
        $aComposants = array();
        if (!empty($oComposants->aObjects)) {
            for ($i = 0; $i < count($oComposants->aObjects); $i++) {
                if (!empty($oComposants->aObjects[$i]->aFields)) {
                    array_push($aComposants, $oComposants->aObjects[$i]->aFields);
                }
            }
        }
        $aFeatures = array();
        for ($i = 0; $i < count($aComposants); $i++) {
            if (!empty($aComposants[$i]['geom'])) {
                $aGeom = json_decode($aComposants[$i]['geom'], true);
                $aAttributes = $aComposants[$i];
                unset($aAttributes['geom']);
                $aTmpFeature = array(
                    'type' => 'Feature',
                    'geometry' => $aGeom,
                    'properties' => array(
                        'style' => $this->getGeoJSONStyle($aAttributes),
                        'attributes' => $aAttributes
                    )
                );
                array_push($aFeatures, $aTmpFeature);
            }
        }
        if (!empty($aFeatures)) {
            $this->aFields['composants'] = json_encode(array(
                'type' => 'FeatureCollection',
                'features' => $aFeatures
            ));
        }
    }

    /**
     * Récupère les informations à merger dans le custom_form
     */
    function getCustomFormInfos() {
        $aPath = array('anc', 'composanttypefeaturestyles');
        $aValues = $this->aValues;
        unset($aValues['my_vitis_id']);
        unset($aValues['filter']);
        unset($aValues['attributs']);
        $oComposantTypeFeatureStyles = new ComposantTypeFeatureStyles($aPath, $aValues, $this->aProperties, $this->oConnection);
        $oComposantTypeFeatureStyles->GET();
        if (!empty($oComposantTypeFeatureStyles->aObjects)) {
            $this->aFields['custom_form'] = array(
                'featureStructure' => array(
                    'field' => $this->sTyleField,
                    'types' => array()
                )
            );
            for ($i = 0; $i < count($oComposantTypeFeatureStyles->aObjects); $i++) {
                if (!empty($oComposantTypeFeatureStyles->aObjects[$i]->aFields)) {
                    $aStyle = $oComposantTypeFeatureStyles->aObjects[$i]->aFields;
                    if (!empty($aStyle[$this->sTyleField])) {
                        $this->aFields['custom_form']['featureStructure']['types'][$aStyle[$this->sTyleField]] = array(
                            'style' => $this->getGeoJSONStyle($aStyle),
                            'geometryType' => $aStyle['feature_type']
                        );
                    }
                }
            }
        }
    }

    /**
     * Returns a GeoJSON format style from an array format style
     * @param array $aStyle
     * @return array
     */
    function getGeoJSONStyle($aStyle) {
        $aGeoJSONStyle = array(
            'draw' => array(),
            'text' => array()
        );
        // Draw
        if (!empty($aStyle['draw_color'])) {
            $aGeoJSONStyle['draw']['color'] = $aStyle['draw_color'];
        }
        if (!empty($aStyle['draw_outline_color'])) {
            $aGeoJSONStyle['draw']['outline_color'] = $aStyle['draw_outline_color'];
        }
        if (!empty($aStyle['draw_size'])) {
            $aGeoJSONStyle['draw']['size'] = $aStyle['draw_size'];
        }
        if (!empty($aStyle['draw_dash'])) {
            $aGeoJSONStyle['draw']['dash'] = $aStyle['draw_dash'];
        }
        if (!empty($aStyle['draw_symbol'])) {
            $aGeoJSONStyle['draw']['symbol'] = $aStyle['draw_symbol'];
        }
        if (!empty($aStyle['image'])) {
            $aGeoJSONStyle['draw']['image'] = $aStyle['image'];
        }
        // Text    
        if (!empty($aStyle['text_font'])) {
            $aGeoJSONStyle['text']['font'] = $aStyle['text_font'];
        }
        if (!empty($aStyle['text_color'])) {
            $aGeoJSONStyle['text']['color'] = $aStyle['text_color'];
        }
        if (!empty($aStyle['text_outline_color'])) {
            $aGeoJSONStyle['text']['outline_color'] = $aStyle['text_outline_color'];
        }
        if (!empty($aStyle['text_size'])) {
            $aGeoJSONStyle['text']['size'] = $aStyle['text_size'];
        }
        if (!empty($aStyle['text_outline_size'])) {
            $aGeoJSONStyle['text']['outline_size'] = $aStyle['text_outline_size'];
        }
        if (!empty($aStyle['text_offset_x'])) {
            $aGeoJSONStyle['text']['offsetX'] = $aStyle['text_offset_x'];
        }
        if (!empty($aStyle['text_offset_y'])) {
            $aGeoJSONStyle['text']['offsetY'] = $aStyle['text_offset_y'];
        }
        if (!empty($aStyle['text_rotation'])) {
            $aGeoJSONStyle['text']['rotation'] = $aStyle['text_rotation'];
        }
        if (!empty($aStyle['text_text'])) {
            $aGeoJSONStyle['text']['text'] = $aStyle['text_text'];
        }
        // Vide draw ou text si ils sont vides
        if (empty($aGeoJSONStyle['draw'])) {
            unset($aGeoJSONStyle['draw']);
        }
        if (empty($aGeoJSONStyle['text'])) {
            unset($aGeoJSONStyle['text']);
        }
        return $aGeoJSONStyle;
    }

    /**
     * delete a Point_situation
     */
    function DELETE() {
        $this->oConnection->oBd->delete($this->aProperties['schema_anc'], 'v_controle', 'id_controle', $this->aValues["my_vitis_id"], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
            $this->aFields["id_controle"] = $this->aValues["my_vitis_id"];
        }
    }

}

?>
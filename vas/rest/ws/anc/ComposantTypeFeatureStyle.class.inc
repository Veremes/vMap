<?php

require_once __DIR__ . '/Anc.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file ComposantTypeFeatureStyle.class.inc
 * \class ComposantTypeFeatureStyle
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the ComposantTypeFeatureStyle php class
 *
 * This class defines operation for one ComposantTypeFeatureStyle
 * 
 */
class ComposantTypeFeatureStyle extends Anc {

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
     * @SWG\Get(path="/composanttypefeaturestyles/{composant_type}", 
     *   tags={"ComposantTypeFeatureStyles"},
     *   summary="Get ComposantTypeFeatureStyle",
     *   description="Request to get ComposantTypeFeatureStyle by id",
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
     *     name="composant_type",
     *     in="path",
     *     description="composant_type",
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
     *         description="ComposantTypeFeatureStyle Response",
     *         @SWG\Schema(ref="#/definitions/composanttypefeaturestyles")
     *     )
     *  )
     */

    /**
     * get informations about mode
     */
    function GET() {
        $this->aFields = $this->getFields($this->aProperties['schema_anc'], "v_composant_type_feature_style", "composant_type");
    }

    /**
     * delete a Point_situation
     */
    function DELETE() {
        $this->oConnection->oBd->delete($this->aProperties['schema_anc'], 'v_composant_type_feature_style', 'composant_type', $this->aValues["my_vitis_id"], 'integer');
        if ($this->oConnection->oBd->enErreur()) {
            $this->oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
        } else {
            $this->aFields["composant_type"] = $this->aValues["my_vitis_id"];
        }
    }
}

?>
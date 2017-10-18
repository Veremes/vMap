<?php

/**
 * \file ComposantTypeFeatureStyles.class.inc
 * \class ComposantTypeFeatureStyles
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the ComposantTypeFeatureStyles php class
 *
 * This class defines Rest Api to Vitis ComposantTypeFeatureStyles
 * 
 */
require_once __DIR__ . '/Anc.class.inc';
require_once 'ComposantTypeFeatureStyle.class.inc';


class ComposantTypeFeatureStyles extends Anc {
    /**
     * @SWG\Definition(
     *   definition="/composanttypefeaturestyles",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/composanttypefeaturestyles")
     *   }
     * )
     * * @SWG\Tag(
     *   name="ComposantTypeFeatureStyles",
     *   description="Operations about ComposantTypeFeatureStyles"
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
     * @SWG\Get(path="/composanttypefeaturestyles",
     *   tags={"ComposantTypeFeatureStyles"},
     *   summary="Get ComposantTypeFeatureStyles",
     *   description="Request to get ComposantTypeFeatureStyles",
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
     *         description="ComposantTypeFeatureStyle Response",
     *         @SWG\Schema(ref="#/definitions/composanttypefeaturestyles")
     *     )
     *  )
     */

    /**
     * get ComposantTypeFeatureStyles
     * @return  ComposantTypeFeatureStyles
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_anc'], "v_composant_type_feature_style", "composant_type");
        $sMessage = $aReturn['sMessage'];
        return $sMessage;
    }

    /**
     * @SWG\Post(path="/composanttypefeaturestyles",
     *   tags={"ComposantTypeFeatureStyles"},
     *   summary="Add composant",
     *   description="Request to add ComposantTypeFeatureStyles",
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
     *         description="composant Response",
     *         @SWG\Schema(ref="#/definitions/composanttypefeaturestyles")
     *     )
     *  )
     */

    /**
     * insert ComposantTypeFeatureStyle
     * @return id of the ComposantTypeFeatureStyle created
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_anc'], 'v_composant_type_feature_style', null, 'composant_type');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/composanttypefeaturestyles/{composant_type}",
     *   tags={"ComposantTypeFeatureStyles"},
     *   summary="update ComposantTypeFeatureStyles",
     *   description="Request to update ComposantTypeFeatureStyles",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="ComposantTypeFeatureStyle token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="composant_type",
     *     in="path",
     *     description="id of the ComposantTypeFeatureStyles",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/composanttypefeaturestyles")
     *     )
     *  )
     */

    /**
     * update composanttypefeaturestyles
     * @return id of composanttypefeaturestyles updated or error object if a composanttypefeaturestyles is not updated
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_anc'], 'v_composant_type_feature_style', 'composant_type');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/composanttypefeaturestyles",
     *   tags={"ComposantTypeFeatureStyles"},
     *   summary="delete ComposantTypeFeatureStyles",
     *   description="Request to delete ComposantTypeFeatureStyles",
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
     *     description="id of the composant",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="composant Response",
     *         @SWG\Schema(ref="#/definitions/composanttypefeaturestyles")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/composanttypefeaturestyles/{composant_type}",
     *   tags={"ComposantTypeFeatureStyles"},
     *   summary="delete ComposantTypeFeatureStyles",
     *   description="Request to delete ComposantTypeFeatureStyles",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="ComposantTypeFeatureStyle token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="composant_type",
     *     in="path",
     *     description="id of the ComposantTypeFeatureStyles",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/composanttypefeaturestyles")
     *     )
     *  )
     */

    /**
     * delete composanttypefeaturestyles
     * @return id of composanttypefeaturestyles deleted or error object if a composanttypefeaturestyles is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_anc'], 'v_composant_type_feature_style', 'composant_type');
        return $aReturn['sMessage'];
    }
}

?>
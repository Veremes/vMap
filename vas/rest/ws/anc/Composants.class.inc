<?php

/**
 * \file Composants.class.inc
 * \class Composants
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * 	\brief This file contains the Composants php class
 *
 * This class defines Rest Api to Vitis Composants
 * 
 */
require_once __DIR__ . '/Anc.class.inc';
require_once 'Composant.class.inc';


class Composants extends Anc {
    /**
     * @SWG\Definition(
     *   definition="/composants",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/composants")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Composants",
     *   description="Operations about Composants"
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
        $this->aSelectedFields = Array( "id_installation", "id_controle", "id_composant", "composant_type", "label", "observations", "size", "rotation", "feature_style_id", "draw_color", "draw_outline_color", "draw_size", "draw_dash", "draw_symbol", "draw_rotation", "image", "text_font", "text_color", "text_outline_color", "text_size", "text_outline_size", "text_offset_x", "text_offset_y", "text_rotation", "text_text", "ST_AsGeoJSON(ST_Transform(geom, 4326)) as geom");
    }

    /**
     * @SWG\Get(path="/composants",
     *   tags={"Composants"},
     *   summary="Get Composants",
     *   description="Request to get Composants",
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
     *         description="composant Response",
     *         @SWG\Schema(ref="#/definitions/composants")
     *     )
     *  )
     */

    /**
     * get Composants
     * @return  Composants
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_anc'], "v_composant", "id_composant");
        $sMessage = $aReturn['sMessage'];
        return $sMessage;
    }

    /**
     * @SWG\Post(path="/composants",
     *   tags={"Composants"},
     *   summary="Add composant",
     *   description="Request to add Composants",
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
     *         @SWG\Schema(ref="#/definitions/composants")
     *     )
     *  )
     */

    /**
     * insert composant
     * @return id of the composant created
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_anc'], 'v_composant', null, 'id_composant');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Put(path="/composants/{id_composant}",
     *   tags={"Composants"},
     *   summary="update Composants",
     *   description="Request to update Composants",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Composant token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_composant",
     *     in="path",
     *     description="id of the Composants",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/composants")
     *     )
     *  )
     */

    /**
     * update composants
     * @return id of composants updated or error object if a composants is not updated
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_anc'], 'v_composant', 'id_composant');
        return $aReturn['sMessage'];
    }

    /**
     * @SWG\Delete(path="/composants",
     *   tags={"Composants"},
     *   summary="delete Composants",
     *   description="Request to delete Composants",
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
     *         @SWG\Schema(ref="#/definitions/composants")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/composants/{id_composant}",
     *   tags={"Composants"},
     *   summary="delete Composants",
     *   description="Request to delete Composants",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="Composant token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="id_composant",
     *     in="path",
     *     description="id of the Composants",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/composants")
     *     )
     *  )
     */

    /**
     * delete composants
     * @return id of composants deleted or error object if a composants is not deleted
     */
    function DELETE() {
        $aReturn = $this->genericDelete($this->aProperties['schema_anc'], 'v_composant', 'id_composant');
        return $aReturn['sMessage'];
    }
}

?>
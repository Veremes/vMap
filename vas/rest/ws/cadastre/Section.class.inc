<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Section.class.inc
 * \class Section
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Section php class
 *
 * This class defines operation for one Section
 * 
 */
class Section extends Cadastre {

	public $oError;

	/**
	 * construct
	 * @param type $aPath url of the request
	 * @param type $aValues parameters of the request
	 * @param type $properties properties
	 * @param type $oConnection connection object
	 */
	function Section($aPath, $aValues, $properties, $oConnection) {
		$this->aValues = $aValues;
		$this->aPath = $aPath;
		$this->aProperties = $properties;
		$this->oConnection = $oConnection;
		$this->aSelectedFields = Array("id_com", "id_sec", "code_com", "commune", "section", "pre", "idu", "tex", "texte", "geom");
	}

	/**
	 * @SWG\Get(path="/sections/{id_sec}", 
	 *   tags={"Section"},
	 *   summary="Get Section",
	 *   description="Request to get Section by id",
	 *   operationId="GET",
	 *   produces={"application/xml", "application/json", "application/x-vm-json"},
	 *   @SWG\Parameter(
	 *     name="token",
	 *     in="query",
	 *     description="user token",
	 *     required=true,
	 *     type="string"
	 *   ),
	 *   @SWG\Parameter(
	 *     name="id_sec",
	 *     in="path",
	 *     description="section id",
	 *     required=true,
	 *     type="integer",
	 *   format="int32"
	 *   ),
	 *   @SWG\Response(
	 *         response=200,
	 *         description="Poprerties Response",
	 *         @SWG\Schema(ref="#/definitions/sections")
	 *     )
	 *  )
	 */

	/**
	 * get informations about Section
	 */
	function GET() {
		require __DIR__ . "/../vitis/" . $this->sRessourcesFile;
		$this->aFields = $this->getFields('public', 'v_section', 'id_sec');
	}

}

?>
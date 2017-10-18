<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Commune.class.inc
 * \class Commune
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Commune php class
 *
 * This class defines operation for one Commune
 * 
 */
class Commune extends Cadastre {

	public $oError;

	/**
	 * construct
	 * @param type $aPath url of the request
	 * @param type $aValues parameters of the request
	 * @param type $properties properties
	 * @param type $oConnection connection object
	 */
	function __construct($aPath, $aValues, $properties, $oConnection) {
		$this->aValues = $aValues;
		$this->aPath = $aPath;
		$this->aProperties = $properties;
		$this->oConnection = $oConnection;
		$this->aSelectedFields = Array("id_com", "code_com", "nom", "geom");
	}

	/**
	 * @SWG\Get(path="/communes/{id_com}", 
	 *   tags={"Commune"},
	 *   summary="Get Commune",
	 *   description="Request to get Commune by id",
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
	 *     name="id_com",
	 *     in="path",
	 *     description="commune id",
	 *     required=true,
	 *     type="integer",
	 *   format="int32"
	 *   ),
	 *   @SWG\Response(
	 *         response=200,
	 *         description="Poprerties Response",
	 *         @SWG\Schema(ref="#/definitions/communes")
	 *     )
	 *  )
	 */

	/**
	 * get informations about Commune
	 */
	function GET() {
		require __DIR__ . "/../vitis/" . $this->sRessourcesFile;
		$this->aFields = $this->getFields('public', $this->aProperties['cadastre']['views']['commune'], 'id_com');
	}
}

?>
<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file Voie.class.inc
 * \class Voie
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the Voie php class
 *
 * This class defines operation for one Voie
 * 
 */
class Voie extends Cadastre {

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
		$this->aSelectedFields = Array('LIBCOM', 'ID_COM', 'ID_RIVOLI', 'CCODEP', 'CCODIR', 'CCOCOM', 'RIVOLI', 'CLERIVOLI', 'LIBVOIE', 'TYPCOM', 'RUR', 'CARVOIE', 'ANNULATION', 'DATEANNUL', 'DATECREA', 'MAJIC2', 'TYPEVOIE', 'INDIC', 'MOTCLASS', 'CODE_INSEE', 'NATURE', 'L_NATURE_VOIE');
	}

	/**
	 * @SWG\Get(path="/voies/{ID_RIVOLI}", 
	 *   tags={"Voie"},
	 *   summary="Get Voie",
	 *   description="Request to get Voie by id",
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
	 *     name="ID_RIVOLI",
	 *     in="path",
	 *     description="voie id",
	 *     required=true,
	 *     type="integer",
	 *   format="int32"
	 *   ),
	 *   @SWG\Response(
	 *         response=200,
	 *         description="Poprerties Response",
	 *         @SWG\Schema(ref="#/definitions/voies")
	 *     )
	 *  )
	 */

	/**
	 * get informations about Voie
	 */
	function GET() {
		require __DIR__ . "/../vitis/" . $this->sRessourcesFile;
		$this->aFields = $this->getFields('public', $this->aProperties['cadastre']['views']['voie'], 'ID_RIVOLI');
	}

}

?>
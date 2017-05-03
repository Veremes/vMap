<?php

require_once 'Cadastre.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';

/**
 * \file DescriptionParcelle.class.inc
 * \class DescriptionParcelle
 *
 * \author Armand Bahi <armand.bahi@veremes.com>.
 *
 * \brief This file contains the DescriptionParcelle php class
 *
 * This class defines operation for one DescriptionParcelle
 * 
 */
class DescriptionParcelle extends Cadastre {

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
		$this->aSelectedFields = Array(oid, 'ID_COM', 'IDU_', 'ID_PAR', 'CCODEP', 'CCODIR', 'CCOCOM', 'CCOPRE', 'CCOSEC', 'DNUPLA', 'CENR', 'DCNTPA', 'DSRPAR', 'DNUPRO', 'JDATAT', 'DREFLF', 'GPDL', 'CPRSECR', 'CCOSECR', 'DNUPLAR', 'DNUPDL', 'GURBPA', 'DPARPI', 'CCOARP', 'GPARNF', 'GPARBAT', 'CCOVOI', 'CCORIV', 'CCOCIF', 'CODE_INSEE', 'ID_RIVOLI', 'ID_DNUPRO', 'DNVOIRI', 'DINDIC', 'L_NATURE_VOIE', 'DVOILIB');
	}

	/**
	 * @SWG\Get(path="/descriptionparcelles/{ID_PAR}", 
	 *   tags={"Parcelle"},
	 *   summary="Get DescriptionParcelle",
	 *   description="Request to get DescriptionParcelle by id",
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
	 *     name="ID_PAR",
	 *     in="path",
	 *     description="descriptionparcelle id",
	 *     required=true,
	 *     type="integer",
	 *   format="int32"
	 *   ),
	 *   @SWG\Response(
	 *         response=200,
	 *         description="Poprerties Response",
	 *         @SWG\Schema(ref="#/definitions/descriptionparcelles")
	 *     )
	 *  )
	 */

	/**
	 * get informations about DescriptionParcelle
	 */
	function GET() {
		require __DIR__ . "/../vitis/" . $this->sRessourcesFile;
		$this->aFields = $this->getFields('public', 'v_non_bati_a10_descr_parcelle', 'ID_PAR');
	}

}

?>
<?php
/**
* \file Mj_Lot_Local.class.inc
* \brief Mj_Lot_Local.class.inc \n \n Ce fichier contient la classe php Mj_Lot_Local
* 
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie lot-local.
*
* \author Damien Bedel
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
/**
* \class Mj_Lot_Local
* \brief Mj_Lot_Local Class \n \n Mj_Lot_Local est une classe PHP qui hérite de la classe Mj.
*
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie lot-local.
*
* \author Damien Bedel
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
require_once ("Mj.class.inc");

class Mj_Lot_Local extends Mj {
	/**
	* \param $sIdBat Identifiant de bâti
	* \param $sKlot Identifiant d'un lot
	* \param $oBD Objet de connexion PDO_BD
	*/
	function Mj_Lot_Local($sIdBat,$sKlot,$oBD){
		include $this->sRessourcesFile;
		$this->sSql=$aSql[$oBD->sgbd]['lot_local'];
		$this->sSql=str_replace('$sIdBat', $sIdBat, $this->sSql);
		$this->sSql=str_replace('$sKlot', $sKlot, $this->sSql);
		$oPDOresult=$oBD->execute($this->sSql);
		if ($oBD->enErreur()){
			$this->sStatus=1;
			$this->sMessage=$oBD->getBDMessage();
		}else{
			$this->aFields=$oBD->ligneSuivante ($oPDOresult);
			$this->sStatus=0;
		}
	}
	/**
	* Cette méthode permet de construire un tableau correspondant au relevé de propriété.
	* \return Retourne un tableau associatif correspondant au relevé de propriété.
	*/
	function getExportFields(){
		$aExportFields=array();
		if($this->isEmpty()){
			$aExportFields="";
		}else{
			$aExportFields['lot']=$this->getLot();
		}
		return $aExportFields;
	}
	/**
	* Cette méthode permet de concaténer les différents attributs d'un lot-local afin d'obtenir une seul chaine de caractères.
	* \return Retourne une chaine de caractères.
	*/
	function getLot(){
		$NumLot = (string) ((int) $this->aFields['dnulot']);
		$sLot = $this->aFields['dnupdl']." LOT ".$NumLot." ".$this->aFields['dnumql']." /".$this->aFields['ddenql'];
		return $sLot;
	}
}

?>
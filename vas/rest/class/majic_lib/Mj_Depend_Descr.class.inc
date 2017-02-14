<?php
/**
* \file Mj_Depend_Descr.class.inc
* \brief Mj_Depend_Descr.class.inc \n \n Ce fichier contient la classe php Mj_Depend_Descr
* 
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie Description Dépendance.
*
* \author John Bosch
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/

require_once ("Mj.class.inc");

class Mj_Depend_Descr extends Mj {
	/**
	* \param $sIdDep Identifiant de la dépendance
	* \param $oBD Objet de connexion PDO_BD
	*/
	function Mj_Depend_Descr($sIdDep,$oBD){
		include $this->sRessourcesFile;
		$this->sSql=$aSql[$oBD->sgbd]['depend_descr'];
		$this->sSql=str_replace('$sIdDep',$sIdDep,$this->sSql);
		$oPDOresult=$oBD->execute($this->sSql);
		if($oBD->enErreur()){
			$this->sStatus=1;
			$this->sMessage=$oBD->getBDMessage();
		}else{
			$this->aFields=$oBD->ligneSuivante($oPDOresult);
			$this->sStatus=0;
		}
	}
	/**
	* Cette méthode permet de construire un tableau correspondant au relevé de propriété/Fiche Parcelle.
	* \return Retourne un tableau associatif correspondant au relevé de propriété/Fiche Parcelle.
	*/
	function getExportFields(){
		$aExportFields=array();
		if($this->isEmpty()){
			$aExportFields="";
		}else{
			$aExportFields['num_invar']=$this->aFields['invar'];
			$aExportFields['num_pev']=$this->aFields['dnupev'];
			$aExportFields['num_depend']=$this->aFields['dnudes'];
			$aExportFields['nature']=$this->aFields['l_cconad'];
			$aExportFields['surface']=$this->aFields['dsudep'];
			$aExportFields['ponderation']=$this->aFields['dcimlc'];
			$aExportFields['Etat']=$this->aFields['detent'];
			$aExportFields['l_Etat']=$this->aFields['l_detent'];
			$aExportFields['mat_gros_mur']=$this->aFields['dmatgm'];
			$aExportFields['lib_mat_gros_mur']=$this->aFields['lib_dmatgm'];
			$aExportFields['mat_toiture']=$this->aFields['dmatto'];
			$aExportFields['lib_mat_toiture']=$this->aFields['lib_dmatto'];
			$aExportFields['nb_baignoires']=$this->aFields['dnbbai'];
			$aExportFields['nb_douches']=$this->aFields['dnbdou'];
			$aExportFields['nb_lavabos']=$this->aFields['dnblav'];
			$aExportFields['nb_wc']=$this->aFields['dnbwc'];
			$aExportFields['eau']=$this->getEau();
			$aExportFields['elect']=$this->getElect();
			$aExportFields['chauf']=$this->getChauf();
		}
		return $aExportFields;
	}

	/*
	DEPRECATED 2013
	function getNature(){
		if ($this->aFields['cconad'] == "TR") {
			return "Terrasse(s)";
		}
		if ($this->aFields['cconad'] == "CV") {
			return "Cave(s)";
		}
		if ($this->aFields['cconad'] == "GR") {
			return "Grenier(s)";
		}
		if ($this->aFields['cconad'] == "GA") {
			return "Garage(s)";
		}
	}
	*/

	function getEau(){
		if($this->aFields["geaulc"] == "O"){
			return "EAU";
		}
	}

	function getElect(){
		if($this->aFields["gelelc"] == "O"){
			return "ELECT";
		}
	}

	function getChauf(){
		if($this->aFields["gchclc"] == "O"){
			return "CHAUF";
		}
	}

}

?>
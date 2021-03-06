<?php
/**
* \file Mj_Prof_Descr.class.inc
* \brief Mj_Prof_Descr.class.inc \n \n Ce fichier contient la classe php Mj_Prof_Descr
* 
* Cette classe permet de s�lectionner les attributs n�cessaires afin de traiter la partie Description Professionel.
*
* \author John Bosch
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/

require_once ("Mj.class.inc");

class Mj_Prof_Descr extends Mj {
	/**
	* \param $sIdPev Identifiant de la partie d'Evaluation
	* \param $oBD Objet de connexion PDO_BD
	*/
	function __construct($sIdPev,$oBD){
		include $this->sRessourcesFile;
		$this->sSql=$aSql[$oBD->sgbd]['prof_descr'];
		$this->sSql=str_replace('$sIdPev', $sIdPev, $this->sSql);
		$oPDOresult=$oBD->execute($this->sSql);
		if ( $oBD->enErreur()) {
		    $this->sStatus=1;
		    $this->sMessage=$oBD->getBDMessage();    	
		}
		else{
			$this->aFields=$oBD->ligneSuivante ($oPDOresult);
			$this->sStatus=0;
		}	
		
	}
	/**
	* Cette m�thode permet de construire un tableau correspondant au relev� de propri�t�/Fiche Parcelle.
	* \return Retourne un tableau associatif correspondant au relev� de propri�t�/Fiche Parcelle.
	*/
	function getExportFields(){
		$aExportFields=array();
		if($this->isEmpty()){
			$aExportFields="";
		} 
		else{
			$aExportFields['num_invar']=$this->aFields['invar'];
			$aExportFields['num_pev']=$this->aFields['dnupev'];
			$aExportFields['num_prof']=$this->aFields['dnudes'];
			$aExportFields['surface']=$this->aFields['vsurzt'];
		}
		return $aExportFields;
	}
	
}

?>
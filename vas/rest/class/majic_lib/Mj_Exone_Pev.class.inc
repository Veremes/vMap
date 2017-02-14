<?php
/**
* \file Mj_Exone_Pev.class.inc
* \brief Mj_Exone_Pev.class.inc \n \n Ce fichier contient la classe php Mj_Exone_Pev
* 
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie Exone-Pev. 
*
* \author Damien Bedel <damien.bedel@veremes.com>
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
/**
* \class Mj_Exone_Pev
* \brief Mj_Exone_Pev Class \n \n Mj_Exone_Pev est une classe PHP qui hérite de la classe Mj.
*
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie Exone-Pev. 
*
* \author Damien Bedel <damien.bedel@veremes.com>
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
require_once ("Mj.class.inc");

class Mj_Exone_Pev extends Mj {
	/**
	* \param $sIdEx Identifiant de l'exonération de la partie d'évaluation
	* \param $oBD Objet de connexion PDO_BD
	*/
	function Mj_Exone_Pev($sIdEx,$oBD){
		include $this->sRessourcesFile;
		$this->sSql = $aSql[$oBD->sgbd]['exone_pev'];
		$this->sSql = str_replace('$sIdEx', $sIdEx, $this->sSql);
		$oPDOresult= $oBD->execute($this->sSql);
		if ($oBD->enErreur()) {
			$this->sStatus=1;
			$this->sMessage = $oBD->getBDMessage();  	
		}else{
			$this->aFields =  $oBD->ligneSuivante ($oPDOresult);
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
		} 
		else{
			$aExportFields['coll']=$this->aFields['ccolloc'];
			$aExportFields['nat_exo']=$this->aFields['gnextl'];
			$aExportFields['an_ret']=$this->getAnret();
			$aExportFields['an_deb']=$this->getAndeb();
			$aExportFields['fraction_rc_exo']=$this->aFields['rcexba2'];
			$aExportFields['pourc_exo']=$this->getPourcExo();
			$aExportFields['tx_om']="<font color=red><b>Info Manquante</b></font>";
			$aExportFields['coef']="<font color=red><b>Info Manquante</b></font>";
		}
		return $aExportFields;
	}

	/**
	* Cette méthode permet de récupérer les deux derniers caractères de l'attribut janimp.
	* /return Retourne une chaîne de caractères.
	*/
	function getAnret(){
		$sAnret=$this->aFields['janimp'];
		$sAnret= substr("$sAnret", 2, 2);
		return $sAnret;
	}
	/**
	* Cette méthode permet de récupérer les deux derniers caractères de l'attribut jandeb.
	* /return Retourne une chaîne de caractères.
	*/
	function getAndeb(){
		$sAndeb=$this->aFields['jandeb'];
		$sAndeb= substr("$sAndeb", 2, 2);
		return $sAndeb;
	}
	/**
	* Cette méthode permet de récupérer le pourcentage d'éxonération à partir du champ 'pexb'.
	* /return Retourne un entier
	*/
	function getPourcExo(){
		$iPourcExo=(int)($this->aFields['pexb'])/100;
		return $iPourcExo;
	}
}

?>
<?php
/**
* \file Mj_Exone_Pev.class.inc
* \brief Mj_Exone_Pev.class.inc \n \n Ce fichier contient la classe php Mj_Exone_Pev
* 
* Cette classe permet de s�lectionner les attributs n�cessaires afin de traiter la partie Exone-Pev. 
*
* \author Damien Bedel <damien.bedel@veremes.com>
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
/**
* \class Mj_Exone_Pev
* \brief Mj_Exone_Pev Class \n \n Mj_Exone_Pev est une classe PHP qui h�rite de la classe Mj.
*
* Cette classe permet de s�lectionner les attributs n�cessaires afin de traiter la partie Exone-Pev. 
*
* \author Damien Bedel <damien.bedel@veremes.com>
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
require_once ("Mj.class.inc");

class Mj_Exone_Pev extends Mj {
	/**
	* \param $sIdEx Identifiant de l'exon�ration de la partie d'�valuation
	* \param $oBD Objet de connexion PDO_BD
	*/
	function __construct($sIdEx,$oBD){
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
	* Cette m�thode permet de construire un tableau correspondant au relev� de propri�t�.
	* \return Retourne un tableau associatif correspondant au relev� de propri�t�.
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
	* Cette m�thode permet de r�cup�rer les deux derniers caract�res de l'attribut janimp.
	* /return Retourne une cha�ne de caract�res.
	*/
	function getAnret(){
		$sAnret=$this->aFields['janimp'];
		$sAnret= substr("$sAnret", 2, 2);
		return $sAnret;
	}
	/**
	* Cette m�thode permet de r�cup�rer les deux derniers caract�res de l'attribut jandeb.
	* /return Retourne une cha�ne de caract�res.
	*/
	function getAndeb(){
		$sAndeb=$this->aFields['jandeb'];
		$sAndeb= substr("$sAndeb", 2, 2);
		return $sAndeb;
	}
	/**
	* Cette m�thode permet de r�cup�rer le pourcentage d'�xon�ration � partir du champ 'pexb'.
	* /return Retourne un entier
	*/
	function getPourcExo(){
		$iPourcExo=(int)($this->aFields['pexb'])/100;
		return $iPourcExo;
	}
}

?>
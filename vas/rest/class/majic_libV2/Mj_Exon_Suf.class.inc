<?php

/**
* \file Mj_Exon_Suf.class.inc
* \brief Mj_Exon_Suf.class.inc \n \n Ce fichier contient la classe php Mj_Exon_Suf
* 
* Cette classe permet de s�lectionner les attributs n�cessaires afin de traiter la partie Exon-Suf.
*
* \author Damien Bedel <damien.bedel@veremes.com>
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
/**
* \class Mj_Exon_Suf
* \brief Mj_Exon_Suf Class \n \n Mj_Exon_Suf est une classe PHP qui h�rite de la classe Mj.
*
* Cette classe permet de s�lectionner les attributs n�cessaires afin de traiter la partie Exon-Suf.
*
* \author Damien Bedel <damien.bedel@veremes.com>
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
require_once ("Mj.class.inc");

class Mj_Exon_Suf extends Mj {
	/**
	* \param $sIdSuf Identifiant de l'exon�ration de la partie d'�valuation
	* \param $sRnuexn Num�ro d'ordre d'exoneration temporaire
	* \param $oBD Objet de connexion PDO_BD
	*/
	function __construct($sIdSuf,$sRnuexn,$oBD){
		include $this->sRessourcesFile;
		$this->sSql = $aSql[$oBD->sgbd]['exon_suf'];
		$this->sSql = str_replace('$sIdSuf', $sIdSuf, $this->sSql);
		$this->sSql = str_replace('$sRnuexn', $sRnuexn, $this->sSql);
		$oPDOresult= $oBD->execute($this->sSql);
		if ( $oBD->enErreur()) {
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
		}else{
			$aExportFields['rnuexn']=$this->aFields['rnuexn'];
			$aExportFields['ccolloc']=$this->aFields['ccolloc'];
			$aExportFields['nat_exo']=$this->aFields['gnexts'];
			$aExportFields['jfinex']=$this->aFields['jfinex'];
			$aExportFields['pexn']=$this->aFields['pexn'];
			$aExportFields['rcexnba']=$this->aFields['rcexnba'];
		}
		return $aExportFields;
	}
}

?>
<?php
/**
* \file Mj_Proprietaire.class.inc
* \brief Mj_Proprietaire.class.inc \n \n Ce fichier contient la classe php Mj_Proprietaire
* 
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie proprietaire.
*
* \author Damien Bedel <damien.bedel@veremes.com>
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
/**
* \class Mj_Proprietaire
* \brief Mj_Proprietaire Class \n \n Mj_Proprietaire est une classe PHP qui hérite de la classe Mj.
*
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie proprietaire.
*
* \author Damien Bedel <damien.bedel@veremes.com>
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
require_once ("Mj.class.inc");

class Mj_Proprietaire extends Mj {
	/**
	* Tableau associatif comportant la liste des objets Pev du bâti
	*/
	var $aProprietaireNom=array();
	
	/**
	* \param $sIdDnupro Identifiant National de compte communal
	* \param $sIdPro Identifiant d'un propriétaire pour le département et le CDIF
	* \param $oBD Objet de connexion PDO_BD
	*/
	function Mj_Proprietaire($sIdDnupro,$sIdPro,$oBD, $sEncryptedKey=''){
		$this->sEncryptKey = $sEncryptedKey;
		include $this->sRessourcesFile;
		$this->sSql = $aSql[$oBD->sgbd]['proprietaire'];
		$this->sSql= str_replace('$sIdDnupro', $this->encrypt($sIdDnupro),$this->sSql);
		$this->sSql = str_replace('$sIdPro', $sIdPro, $this->sSql);
		$oPDOresult= $oBD->execute($this->sSql);
		
		if ( $oBD->enErreur()) {
		    $this->sStatus=1;
		    $this->sMessage=$oBD->getBDMessage();    	
		}else{
			$this->aFields=$oBD->ligneSuivante ($oPDOresult);
			$this->aFields['id_dnupro'] = $sIdDnupro;
			$this->sStatus=0;
		}
		$oPDOresult = $oBD->fermeResultat();
		
		$this->aProprietaireNom = $this->getProprietaireNom();
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
			$aExportFields['l_ccodro']=$this->aFields['l_ccodro'];
			$aExportFields['l_ccodem']=$this->aFields['l_ccodem'];
			$aExportFields['dnuper']=$this->aFields['dnuper'];
			$aExportFields['dnupro']=$this->aFields['dnupro'];
			$aExportFields['proprietaire_nom']=$this->getProprietaireNom();
			$aExportFields['proprietaire_nom_tiers']=$this->getProprietaireNomTiers();
			$aExportFields['proprietaire_adresse']=$this->getProprietaireAdresse();
			$aExportFields['jdatnss']=$this->getJdatnss();
			$aExportFields['dldnss']=$this->getDldnss();
		}
		return $aExportFields;
	}
	/**
	* Cette méthode permet de récupérer le nom du propriétaire en fonction de la valeur de l'attribut epxnee.
	* \return Retourne une chaîne de caractères.
	*/
	function getProprietaireNom(){
		switch($this->aFields["epxnee"]){
			case 'EPX' : 
				$sProprietaireNom = rtrim($this->aFields["dqualp"])." ".rtrim($this->aFields["ddenom"])." EP ".rtrim($this->aFields["dnomcp"])." ".rtrim($this->aFields["dprncp"]);
				break;
			case 'NEE' :
				$sProprietaireNom = rtrim($this->aFields["dqualp"])." ".rtrim($this->aFields["ddenom"])." EP ".rtrim($this->aFields["dnomlp"])." ".rtrim($this->aFields["dprnlp"]);
				break;
			default : 
				$sProprietaireNom = rtrim($this->aFields["dqualp"])." ".rtrim($this->aFields["ddenom"]);
				break;
		}
		return $sProprietaireNom;
	}
	/**
	* Cette méthode permet de récupérer l'adresse complète du propriétaire en concaténant les attributs dlign3, dlign4, dlign5 et dlign6.
	* \return Retourne une chaîne de caractères.
	*/
	function getProprietaireAdresse(){
		$sProprietaireAdresse = rtrim($this->aFields['dlign3'])." ".ltrim(rtrim($this->aFields['dlign4']),'0')." ".rtrim($this->aFields['dlign5'])." ".rtrim($this->aFields['dlign6']);
		return $sProprietaireAdresse;
	}
	/**
	* Cette méthode permet de concaténer les attributs dnvoiri et indic.
	* \return Retourne une chaîne de caractères. Elle est vide si l'attribut dqualp est vide.
	*/
	function getJdatnss(){
		if($this->aFields["gtoper"]=='2'){
			$sJdatnss = '';
		}else{
			$sJdatnss = "NE(E) le ".$this->aFields['jdatnss'];
		}
		return $sJdatnss;
	}
	/**
	* Cette méthode permet de concaténer les attributs dnvoiri et indic.
	* \return Retourne une chaîne de caractères. Elle est vide si l'attribut dqualp est vide.
	*/
	function getDldnss(){
		if($this->aFields["gtoper"]=='2'){
			$sJdatnss = '';
		}else{
			$sDldnss = "A ".$this->aFields['dldnss'];
		}
		return $sDldnss;
	}
	/**
	* Cette méthode permet de récupérer le nom du propriétaire correspondant à un relevé de propriété destiné aux tiers.
	* \return Retourne une chaîne de caractères.
	*/
	function getProprietaireNomTiers(){
		$sProprietaireNomTiers = rtrim($this->aFields["dqualp"])." ".rtrim($this->aFields["ddenom"]);
		return $sProprietaireNomTiers;
	}
}

?>
<?php
/**
* \file Mj_Suf.class.inc
* \brief Mj_Suf.class.inc \n \n Ce fichier contient la classe php Mj_Suf
* 
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie Suf. 
*
* \author Fabien Marty <fabien.marty@veremes.com>
* \author Damien Bedel
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
/**
* \class Mj_Suf
* \brief Mj_Suf Class \n \n Mj_Suf est une classe PHP qui hérite de la classe Mj.
*
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie Suf. 
*
* \author Fabien Marty <fabien.marty@veremes.com>
* \author Damien Bedel
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
require_once ("Mj.class.inc");
require_once ("Mj_Exon_Suf.class.inc");

class Mj_Suf extends Mj {
	/**
	* Tableau associatif comportant la liste des objets Exon_Suf d'une parcelle
	*/
	var $aExonSuf=array();
	/**
	* \param $oBD Objet de connexion PDO_BD
	* \param $sIdSuf Identifiant de la suf
	* \param $sIdDnupro Identifiant du propriétaire
	*/
	function __construct($oBD,$sIdSuf,$sIdDnupro,$sEncryptedKey='', $bAllSuf=false){
		$this->bAllSuf = $bAllSuf;
		$this->sEncryptKey = $sEncryptedKey;
		include $this->sRessourcesFile;
		// récupèration du dnupro de la suf
		$this->sSql=$aSql[$oBD->sgbd]['suf_dnupro'];
		$this->sSql=str_replace('$sIdSuf', $sIdSuf, $this->sSql);
		
		$oPDOresult=$oBD->execute($this->sSql);
		if ($oBD->enErreur()){
			$this->sStatus=1;
			$this->sMessage=$oBD->getBDMessage();
			$this->sSql=$aSql['suf'];
		}else{
			$this->sStatus=0;
			$aSufPar=$oBD->ligneSuivante ($oPDOresult);
			// Si le DNUPRO de la suf est différent de la parcelle il s'agit d'une parcelle concernée par des lots en biens non délimités
			if (trim($aSufPar['dnupro'])==trim(substr($sIdDnupro,5))){
				$this->sSql=$aSql[$oBD->sgbd]['suf'];
			}else{
				if($this->bAllSuf){
					$this->sSql=$aSql[$oBD->sgbd]['suf_bnd_all'];
				}else{
					$this->sSql=$aSql[$oBD->sgbd]['suf_bnd'];
				}
			}
		}
		$this->sSql=str_replace('$sIdSuf', $sIdSuf, $this->sSql);
		$this->sSql=str_replace('sIdDnupro', substr($sIdDnupro, 5), $this->sSql);
		$oPDOresult=$oBD->execute($this->sSql);
		if ($oBD->enErreur()){
			$this->sStatus=1;
			$this->sMessage=$oBD->getBDMessage();
		}else{
			$this->aFields=$oBD->ligneSuivante ($oPDOresult);
			$this->sStatus=0;
		}
		$this->aExonSuf=$this->get_aExon_Suf($oBD);
		if ($this->aFields['dnulot']){
			$this->aPro=$this->get_aPro($oBD);
			$this->aObjects = array_merge ($this->aPro,$this->aExonSuf);
		}else{
			$this->aObjects=$this->aExonSuf;
		}
	}
	/**
	* Cette méthode permet de récupérer les ID_PRO en fonction d'un ID_DNUPRO donné.
	* \return Retourne un tableau de ID_PRO.
	*/
	function get_aId_Pro($oBD){
		if($this->isEmpty()){
			$aIdPro="";
		}else{
			include $this->sRessourcesFile;
			$aIdPro=array();
			$this->sSql = $aSql[$oBD->sgbd]['get_id_pro'];
			$this->sSql = str_replace('$sIdDnupro', $this->encrypt($this->aFields['id_dnupro']), $this->sSql);
			$oPDOresult= $oBD->execute($this->sSql);
			if ( $oBD->enErreur()) {
				$this->sStatus=1;
				$this->sMessage = $oBD->getBDMessage();
			}else{
				while($aResultFetch = $oBD->tableauSuivant ($oPDOresult)){
					array_push($aIdPro,$aResultFetch[0]);
					$this->sStatus=0;
				}
			}
		}
		return $aIdPro;
		$oPDOresult=$oBD->fermeResultat();
	}
	/**
	* Cette méthode permet de récupérer la liste des objets Proprietaire
	* \param $oBD Objet de connexion PDO_BD
	* \return Retourne un tableau d'objets Proprietaire
	*/
	function get_aPro($oBD){
		$aPro=array();
		if($this->isEmpty()){
			$aPro="";
		}else{
			$aIdPro = $this->get_aId_Pro($oBD);
			foreach($aIdPro as $sIdPro){
				array_push($aPro,new Mj_Proprietaire($this->encrypt($this->aFields['id_dnupro']),$sIdPro,$oBD));
			}
		}
		return $aPro;
	}
	/**
	* Cette méthode permet de récupérer les Rnuexn en fonction d'un Id_Suf donné
	* \return Retourne un tableau de chaîne de caractères.
	*/
	function get_aRnuexn($oBD){
		if($this->isEmpty()){
			$aRnuexn="";
		}else{
			include $this->sRessourcesFile;
			$aRnuexn=array();
			$this->sSql=$aSql[$oBD->sgbd]['get_rnuexn'];
			$this->sSql=str_replace('$sIdSuf', $this->aFields['id_suf'], $this->sSql);
			$oPDOresult=$oBD->execute($this->sSql);
			if ($oBD->enErreur()){
				$this->sStatus=1;
				$this->sMessage=$oBD->getBDMessage();
			}else{
				while($aResultFetch = $oBD->tableauSuivant ($oPDOresult)){
					array_push($aRnuexn,$aResultFetch[0]);
					$this->sStatus=0;
				}
			}
		}
		return $aRnuexn;
	}
	/**
	* Cette méthode permet de récupérer la liste des objets Exon_Suf d'une parcelle
	* \return Retourne un tableau d'objets Exon_Suf
	*/
	function get_aExon_Suf($oBD){
		$aExonSuf=array();
		if($this->isEmpty()){
			$aExonSuf="";
		}else{
			$aRnuexn=$this->get_aRnuexn($oBD);
			foreach($aRnuexn as $sRnuexn){
				array_push($aExonSuf,new Mj_Exon_Suf($this->aFields['id_suf'],$sRnuexn,$oBD));
			}
		}
		return $aExonSuf;
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
			$aExportFields['dnupro']=$this->aFields['dnupro'];
			$aExportFields['id_dnupro']=$this->aFields['id_dnupro'];
			$aExportFields['s_tar']=$this->aFields['ccostn'];
			$aExportFields['suf']=$this->aFields['ccosub'];
			$aExportFields['gnexps']=$this->aFields['gnexps'];
			$aExportFields['grss_gr']=$this->aFields['dsgrpf'];
			$aExportFields['occupation']=$this->aFields['l_dsgrpf'];
			$aExportFields['nature']=$this->aFields['l_dsgrpf'];
			$aExportFields['groupe']=$this->aFields['l_cgrnum'];
			$aExportFields['clas']=$this->aFields['dclssf'];
			$aExportFields['nat_cult']=$this->aFields['cnatsp'];
			$aExportFields['ha']=$this->getContenanceHA();
			if ($aExportFields['ha'] == 0){
				$aExportFields['ha']=' ';
			}
			$aExportFields['a']=$this->getContenanceA();
			$sContenanceA=$aExportFields['a'];
			$sContenanceA= strval($sContenanceA);
			$sTlenA=strlen($sContenanceA);
			if ($aExportFields['ha'] == ' ' and $aExportFields['a'] == 0){
				$aExportFields['a']=' ';
			}else{
				if ($aExportFields['ha'] == ' ' and $sTlenA == 2 and (substr($aExportFields['a'],0,1)== 0)){
					$sDeuxiemeValeur= substr($aExportFields['a'],1,1);
					$aExportFields['a']= ' '.$sDeuxiemeValeur;
				}else{
					if ($aExportFields['ha'] != ' ' and $sTlenA == 1){
						$aExportFields['a']='0'.$aExportFields['a'];
					}
				}
			}
			$aExportFields['ca']=$this->getContenanceCA();
			$sContenanceCa=$aExportFields['ca'];
			$sContenanceCa=strval($sContenanceCa);
			$sTlen=strlen($sContenanceCa);
			if ($aExportFields['a'] != 0)
				if ($sTlen == 1){
					$aExportFields['ca']='0'.$aExportFields['ca'];
				}
			$aExportFields['revenu_cadastral']=$this->getRevenuCadastral();
			$aExportFields['revenu_cadastral_txt']=$this->setFloatToText($this->getRevenuCadastral());
			$aExportFields['revenu_cadastral_exo']=$this->getRevenuCadastralExo($sCollectivite);
			$aExportFields['revenu_reference']=$this->getRevenuReference();
			$aExportFields['revenu_reference_txt']=$this->setFloatToText($this->getRevenuReference());
			$aExportFields['nat_exo']=$this->getNatExo();
			$aExportFields['ccolloc']=$this->getCcolloc($sCollectivite);
			$aExportFields['contenance_suf']=$this->getContenance();
			if ($this->aFields['dnulot']){
				$aExportFields['num_voirie']='*****';
				$aExportFields['dnulot']=$this->aFields['dnulot'];
				$aExportFields['dnupdl']=$this->aFields['dnupdl'];
				$aExportFields['dnumql']=$this->aFields['dnumql'];
				$aExportFields['ddenql']=$this->aFields['ddenql'];
			}
		}
		return $aExportFields;
	}
	/**
	* Cette méthode permet de récupérer les caractères correspondants à la colonne HA depuis l'attribut dcntsf.
	* \return Retourne une chaîne de caractères.
	*/
	function getContenanceHA(){
		$sContenanceHA=$this->aFields['dcntsf'];
		$sContenanceHA=substr("$sContenanceHA",0,5);
		$iContenanceHA= (int) $sContenanceHA;
		return $iContenanceHA;
	}
	/**
	* Cette méthode permet de récupérer les caractères correspondants à la colonne A depuis l'attribut dcntsf.
	* \return Retourne une chaîne de caractères.
	*/
	function getContenanceA(){
		$sContenanceA=$this->aFields['dcntsf'];
		$sContenanceA=substr("$sContenanceA", 5, 2);
		return $sContenanceA;
	}
	/**
	* Cette méthode permet de récupérer les caractères correspondants à la colonne CA depuis l'attribut dcntsf.
	* \return Retourne une chaîne de caractères.
	*/
	function getContenanceCA(){
		$sContenanceCA=$this->aFields['dcntsf'];
		$sContenanceCA=substr("$sContenanceCA", 7, 2);
		return $sContenanceCA;
	}
	/*
	* Cette méthode permet de récupérer la contenance totale d'une suf.
	* \return Retourne un entier.
	*/
	function getContenance(){
		$iContenanceHA = (int) $this->getContenanceHA();
		$iContenanceA = (int) $this->getContenanceA();
		$iContenanceCA = (int) $this->getContenanceCA();
		$iContenance = ($iContenanceHA*10000)+($iContenanceA*100)+($iContenanceCA);
		return $iContenance;
	}
	/**
	* Cette méthode permet de diviser l'attribut drcsuba par 100.
	* \return Retourne un float.
	*/
	function getRevenuCadastral(){
		$fRevenuCadastral=floatval($this->aFields['drcsuba']);
		$fRevenuCadastral=$fRevenuCadastral/100;
		return $fRevenuCadastral;
	}
	/**
	* Cette méthode permet de diviser l'attribut drcsub par 100.
	* \return Retourne un float.
	*/
	function getRevenuReference(){
		$fRevenuReference=floatval($this->aFields['drcsub']);
		$fRevenuReference=$fRevenuReference/100;
		return $fRevenuReference;
	}

	/**
	* Cette méthode permet de diviser l'attribut rcexnba par 100.
	* \return Retourne un float.
	*/
	function getRevenuCadastralExo($sCollectivite){
		foreach($this->aExonSuf as $aFieldsRevExo) {
			if (rtrim($aFieldsRevExo->aFields['ccolloc']) == $sCollectivite) {
				$fRevenuCadastral=floatval($aFieldsRevExo->aFields['rcexnba']);
				$fRevenuCadastral=$fRevenuCadastral/100;
			}
		}
		return $fRevenuCadastral;
	}
	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 'nat_exo' du tableau aExonSuf.
	* \return Retourne une chaîne de caractères.
	*/
	function getNatExo(){
		return $this->aExonSuf[0]->aFields['gnexts'];
	}
	/** 
	* Cette méthode permet de récupérer la valeur de l'attribut 'ccolloc' du tableau aExonSuf.
	* \return Retourne une chaîne de caractères.
	*/
	function getCcolloc($sCollectivite){
		$bVal=false;
		foreach($this->aExonSuf as $aFieldsExo) {
			if(rtrim($aFieldsExo->aFields['ccolloc']) == $sCollectivite) {
				$aReturn=$aFieldsExo;
				$bVal=true;
			}
		}
		return $bVal;
	}
	/**
	* Cette méthode permet de formater un décimal pour l'affichage.
	* \return Retourne une chaine
	*/
	function setFloatToText($fFloat){
		return number_format($fFloat,2,'.','');
	}
}

?>
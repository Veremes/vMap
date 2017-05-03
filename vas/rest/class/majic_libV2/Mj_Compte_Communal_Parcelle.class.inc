<?php
/**
* \file Mj_Compte_Communal_Parcelle.class.inc
* \brief Mj_Compte_Communal_Parcelle.class.inc \n \n Ce fichier contient la classe php Mj_Compte_Communal_Parcelle
*
* Cette classe permet de s�lectionner les attributs n�cessaires afin de traiter un relev� de propri�t� en fonction d'un compte communal et d'un num�ro de parcelle.
*
* \author Damien Bedel
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
require_once ("Mj_Compte_Communal.class.inc");

class Mj_Compte_Communal_Parcelle extends Mj_Compte_Communal {
	/**
	* Identifiant national de la parcelle sur 15 caract�res.
	*/
	var $sIdPar;
	/**
	* Bool�en servant � savoir si on recherche une parcelle avec tout les batiments
	*/
	var $bFP=false;
        
        var $oBD;
        
        var $sIdDnupro;

	/**
	* \param $sIdDnupro peut etre vide, un identifiant sera d�fini par une requete sql sur l'identifiant parcelle
	* \param $sIdPar Identifiant de la parcelle.
	* \param $oBD Objet de connexion PDO_BD
	*/
	function __construct($sIdDnupro,$sIdPar,$oBD,$properties,$bFP=false,$sEncryptedKey='',$AllSuf=false){
           
                $oBD = new BD ($properties["cadastre"]["rp"]["login"], $properties["cadastre"]["rp"]["pass"], $properties["database"], $properties["server"], $properties["port"], $properties["sgbd"], $properties["page_encoding"]);                
                $this->bAllSuf=$AllSuf;
		$this->sEncryptKey=$sEncryptedKey;
		include $this->sRessourcesFile;
                if($sIdDnupro==""){
                        $sSql=$aSql[$oBD->sgbd]['get_id_dnupro'];
			$sSql=str_replace('idparpro', $sIdPar, $sSql);
			$oPDOresult=$oBD->execute($sSql);
                        $aIdDnuProSql=$oBD->ligneSuivante ($oPDOresult);
                        $sIdDnupro=$aIdDnuProSql['iddnupro'];
			$sDnupro=$aIdDnuProSql['dnupro'];
                        $oPDOresult=$oBD->fermeResultat();
		}
		$this->sSql=$aSql[$oBD->sgbd]['compte_communal_parcelle'];
		$this->sSql=str_replace('$sIdDnupro', $this->encrypt($sIdDnupro), $this->sSql);
		$this->sSql=str_replace('$sIdPar', $sIdPar, $this->sSql);
		$oPDOresult= $oBD->execute($this->sSql);
		if($oBD->enErreur()){
			$this->sStatus=1;
			$this->sMessage=$oBD->getBDMessage();
		}else{
			if($aCompteCom=$oBD->ligneSuivante($oPDOresult)){
				$this->aFields=$aCompteCom;
				$this->aFields['id_dnupro']=$sIdDnupro;
				//$this->aFields['dnupro']=$sIdDnupro;
				$this->sStatus=0;
				$oPDOresult=$oBD->fermeResultat();
				$this->aPro=$this->get_aPro($oBD);
				$this->aBat=$this->get_aBat($oBD,$bFP);
				$this->aPar=$this->get_aPar($oBD,$sIdPar,$sIdDnupro);
				// r�cup�ration de l'ann�e de r�f�rence
				$this->sSql=$aSql[$oBD->sgbd]['annee_reference'];
				$oPDOresult=$oBD->execute($this->sSql);
				if($oBD->enErreur()){
					$this->sStatus=1;
					$this->sMessage=$oBD->getBDMessage();
				}else{
					$aAnneeReference=$oBD->ligneSuivante ($oPDOresult);
					$this->sAnneeReference=$aAnneeReference['annee'];
				}
				$oPDOresult=$oBD->fermeResultat();
				$this->aObjects=array_merge ($this->aPro,$this->aBat,$this->aPar);
			}else{
				$this->sStatus=1;
				$this->sMessage="Aucun compte communal trouvé pour la parcelle : ".$sIdPar;
				$oPDOresult=$oBD->fermeResultat();
			}
		}
	}
	/**
	* Cette m�thode permet de r�cup�rer les ID_BAT en fonction d'un ID_DNUPRO donn�
	* \return Retourne un tableau de ID_BAT
	*/
	function get_aId_Bat($sIdPar, $oBD, $bFP){
		if($this->isEmpty()){
			$aIdBat="";
		}else{
			include $this->sRessourcesFile;
			$aIdBat=array();
			if (!$bFP){
				$this->sSql=$aSql[$oBD->sgbd]['get_id_bat_parcelle'];
				$this->sSql=str_replace('$sIdDnupro', $this->aFields['id_dnupro'], $this->sSql);
				$this->sSql=str_replace('$sIdPar', $this->aFields['id_par'], $this->sSql);
			}else{
				$this->sSql=$aSql[$oBD->sgbd]['get_par_id_bat'];
				$this->sSql=str_replace('sIdPar', $this->aFields['id_par'], $this->sSql);
			}
			$oPDOresult= $oBD->execute($this->sSql);
			if($oBD->enErreur()){
				$this->sStatus=1;
				$this->sMessage=$oBD->getBDMessage();
			}else{
				while($aResultFetch = $oBD->tableauSuivant ($oPDOresult)){
					array_push($aIdBat,$aResultFetch[0]);
					$this->sStatus=0;
				}
			}
		}
		return $aIdBat;
	}
	/**
	* Cette m�thode permet de r�cup�rer la liste des objets BATI
	* \param $oBD Objet de connexion PDO_BD
	* \return Retourne un tableau d'objets BATI
	*/
	function get_aBat($oBD,$bFP){
		$aBat=array();
		if($this->isEmpty()){
			$aBat="";
		}else{
			$aIdBat=$this->get_aId_Bat($sIdPar,$oBD,$bFP);
			foreach($aIdBat as $sIdBat){
				array_push($aBat,new Mj_Bati($sIdBat,$oBD, $this->sEncryptKey));
			}
		}
		return $aBat;
	}
	/**
	* Cette m�thode permet de r�cup�rer la liste des objets PARCELLE
	* \param $oBD Objet de connexion PDO_BD
	* \param $sIdPar Identifiant de la parcelle
	* \param $sIdDnupro Identifiant du propri�taire
	* \return Retourne un tableau d'objets PARCELLE
	*/
	function get_aPar($oBD,$sIdPar,$sIdDnupro){
		$aPar=array();
		if($this->isEmpty()){
			$aPar="";
		}else{
			$aIdPar=Array($sIdPar);
			foreach($aIdPar as $sIdPar){
				array_push($aPar,new Mj_Parcelle($oBD,$sIdPar,$sIdDnupro,$this->sEncryptKey,$this->bAllSuf));
			}
		}
		return $aPar;
	}
}
?>
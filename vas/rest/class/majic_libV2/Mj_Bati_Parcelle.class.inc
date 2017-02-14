<?php
/**
* \file Mj_Bati_Parcelle.class.inc
* \brief Mj_Bati_Parcelle.class.inc \n \n Ce fichier contient la classe php Mj_Bati_Parcelle
*
* Cette classe permet de s�lectionner les attributs n�cessaires afin de traiter les batis associ�s � une parcelle.
*
* \author Damien Bedel
* \author Olivier Gayte <olivier.gayte@veremes.com>
* \author Fabien Marty <fabien.marty@veremes.com>
*/

require_once ("Mj.class.inc");
require_once ("Mj_Bati.class.inc");
require_once ("Mj_Proprietaire.class.inc");

class Mj_Bati_Parcelle extends Mj {
	/**
	* Tableau associatif comportant la liste des objets Bati de la parcelle.
	*/
	var $aBat=array();
	/**
	* Chaine qui stocke l'anne� de r�f�rence des donn�es  casdatrales.
	*/
	var $sAnneeReference;

	/**
	* \param $sIdPar Identifiant de la parcelle
	* \param $oBD Objet de connexion
	*/
	function Mj_Bati_Parcelle($sIdPar,$oBD){
		include $this->sRessourcesFile;
		$this->sSql=$aSql[$oBD->sgbd]['bati_parcelle'];
		$this->sSql=str_replace('sIdPar',$sIdPar,$this->sSql);
		$oPDOresult=$oBD->execute($this->sSql);
		if($oBD->enErreur()){
			$this->sStatus=1;
			$this->sMessage=$oBD->getBDMessage();
		}else{
			$this->sStatus=0;
			$this->aFields=$oBD->ligneSuivante ($oPDOresult);
		}
		$oPDOresult=$oBD->fermeResultat();
		$this->aBat=$this->get_aBat($oBD,$sIdPar);
		$this->sSql=$aSql[$oBD->sgbd]['annee_reference'];
		$oPDOresult=$oBD->execute($this->sSql);
		if ($oBD->erreurRencontree != 0){
			$this->sStatus=1;
			$this->sMessage=$oBD->getBDMessage();
		}else{
			$aAnneeReference=$oBD->ligneSuivante ($oPDOresult);
			$this->sAnneeReference=$aAnneeReference['annee'];
		}
  		$this->aObjects=$this->aBat;
	}
	/**
	* Cette m�thode permet de r�cup�rer les ID_BAT en fonction d'un ID_PAR donn�
	* \param $oBD Objet de connexion
	* \param $sIdPar Chaine identifiant de la parcelle
	* \return Retourne un tableau de ID_BAT
	*/
	function get_aId_Bat($oBD,$sIdPar){
		if($this->isEmpty()){
			$aIdBat="";
		}else{
			include $this->sRessourcesFile;
			$aIdBat=array();
			$this->sSql=$aSql[$oBD->sgbd]['get_par_id_bat'];
			$this->sSql=str_replace('sIdPar',$sIdPar,$this->sSql);
			$oPDOresult=$oBD->execute($this->sSql);
			if($oBD->enErreur()){
				$this->sStatus=1;
				$this->sMessage=$oBD->getBDMessage();
			}else{
				while($aResultFetch=$oBD->tableauSuivant ($oPDOresult)){
					array_push($aIdBat,$aResultFetch[0]);
					$this->sStatus=0;
				}
			}
		}
		return $aIdBat;
	}
	/**
	* Cette m�thode permet de r�cup�rer la liste des objets BATI
	* \param $oBD Objet de connexion
	* \param $sIdPar Chaine identifiant de la parcelle
	* \return Retourne un tableau d'objets BATI
	*/
	function get_aBat($oBD,$sIdPar){
		$aBat=array();
		if($this->isEmpty()){
			$aBat="";
		}else{
			$aIdBat=$this->get_aId_Bat($oBD,$sIdPar);
			foreach($aIdBat as $sIdBat){
				array_push($aBat,new Mj_Bati($sIdBat,$oBD));
			}
		}
		return $aBat;
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
			$aExportFields['id_par']=$this->aFields['id_par'];
			$aExportFields['annee_de_maj']=$this->sAnneeReference;
			$aExportFields['dep_dir']=$this->getDepdir();
			$aExportFields['code_dep']=$this->aFields['ccodep'];
			$aExportFields['code_com']=$this->aFields['ccocom'];
			$aExportFields['lib_dep']=$this->aFields['libdep'];
			$aExportFields['com']=$this->getCom();
			$aExportFields['libcom']=$this->aFields['libcom'];
			$aExportFields['role']="";
			$aExportFields['vue']="";
			$aExportFields['contenance']=$this->aFields['dcntpa'];
			$aExportFields['adresse']=$this->getAdresseParcelle();
			$aExportFields['total_valeur_locative']=$this->getValeurLocativeBati();
		}
		return $aExportFields;
	}
	/**
	* Cette m�thode permet de concat�ner les attributs ccodep et ccodir.
	* /return Retourne une cha�ne de caract�res correspondant au DEP DIR du RP.
	*/
	function getDepdir(){
		$sDepdir=$this->aFields['ccodep']." ".$this->aFields['ccodir'];
		return $sDepdir;
	}
	/**
	* Cette m�thode permet de concat�ner les attributs ccocom et libcom.
	* /return Retourne une cha�ne de carcat�res correspondant au COM du RP.
	*/
	function getCom(){
		$sCom=$this->aFields['ccocom']." ".$this->aFields['libcom'];
		return $sCom;
	}
	/**
	* Cette m�thode permet de concat�ner les attributs cconvo et dvoilib.
	* \return Retourne une cha�ne de caract�res.
	*/
	function getAdresseParcelle(){
		$sAdresseParcelle=ltrim(rtrim($this->aFields['dnvoiri']),'0').rtrim($this->aFields['dindic'])." ".rtrim($this->aFields['cconvo'])." ".rtrim($this->aFields['dvoilib']);
		return $sAdresseParcelle;
	}
	/**
	* Cette m�thode permet de r�cup�rer la valeur locative totale du b�ti.
	* \return Retourne un double
	*/
	function getValeurLocativeBati(){
		$iValeurLocativeBati=0;
		foreach($this->aBat as $oBat){
			$iValeurLocativeBati=$oBat->aFields['dvlpera']+$iValeurLocativeBati;
		}
		return $iValeurLocativeBati;
	}
}
?>
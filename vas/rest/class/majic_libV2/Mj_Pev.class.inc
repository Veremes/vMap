<?php
/**
* \file Mj_Pev.class.inc
* \brief Mj_Pev.class.inc \n \n Ce fichier contient la classe php Mj_Pev
* 
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie pev. 
*
* \author Damien Bedel
* \author Fabien Marty <fabien.marty@veremes.com>
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
/**
* \class Mj_Pev
* \brief Mj_Pev Class \n \n Mj_Pev est une classe PHP qui hérite de la classe Mj.
*
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie pev. 
*
* \author Damien Bedel
* \author Fabien Marty <fabien.marty@veremes.com>
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
require_once ("Mj.class.inc");
require_once ("Mj_Exone_Pev.class.inc");
require_once ("Mj_Habit_Descr.class.inc");
require_once ("Mj_Depend_Descr.class.inc");
require_once ("Mj_Prof_Descr.class.inc");

class Mj_Pev extends Mj {
	/**
	* Tableau associatif comportant la liste des objets Exone_Pev du bâti.
	*/
	var $aExPev=array();
	/**
	* Tableau associatif comportant la liste des objets Descr de(s) habitation(s)
	*/
	var $aDescr_Hab=array();
	/**
	* Tableau associatif comportant la liste des objets Descr de(s) dépendance(s)
	*/
	var $aDescr_Depend=array();
	/**
	* Tableau associatif comportant la liste des objets Descr professionel
	*/
	var $aDescr_Prof=array();
	/**
	* \param $sIdPev Identifiant de la partie d'Evaluation
	* \param $oBD Objet de connexion PDO_BD
	*/
	function Mj_Pev($sIdPev,$oBD){
		include $this->sRessourcesFile;
		$this->sSql=$aSql[$oBD->sgbd]['pev'];
		$this->sSql=str_replace('$sIdPev', $sIdPev, $this->sSql);
		$oPDOresult=$oBD->execute($this->sSql);
		if ($oBD->enErreur()) {
			$this->sStatus=1;
			$this->sMessage=$oBD->getBDMessage();  	
		}else{
			$this->aFields=$oBD->ligneSuivante ($oPDOresult);
			$this->sStatus=0;
		}
		$this->aExPev=$this->get_aEx_Pev($oBD);
		$this->aDescr_Hab=$this->get_aDescr_Hab($sIdPev,$oBD);
		$this->aDescr_Depend=$this->get_aDescr_Depend($sIdPev,$oBD);
		$this->aDescr_Prof=$this->get_aDescr_Prof($sIdPev,$oBD);
		$this->aObjects=array_merge($this->aExPev,$this->aDescr_Hab,$this->aDescr_Depend,$this->aDescr_Prof);
	}
	/**
	* Cette méthode permet de récupérer les Id_Ex en fonction d'un Id_Pev donné
	* \param $oBD Objet de connexion PDO_BD
	* \return Retourne un tableau de chaînes de caractères.
	*/
	function get_aId_Ex_Pev($oBD){
		if($this->isEmpty()){
			$aIdExPev="";
		}else{
			include $this->sRessourcesFile;
			$aIdExPev=array();
			$this->sSql=$aSql[$oBD->sgbd]['get_id_ex_pev'];
			$this->sSql=str_replace('$sIdPev', $this->aFields['id_pev'], $this->sSql);
			$oPDOresult=$oBD->execute($this->sSql);
			if($oBD->enErreur()){
				$this->sStatus=1;
				$this->sMessage=$oBD->getBDMessage();
			}else{
				while($aResultFetch=$oBD->tableauSuivant ($oPDOresult)){
					array_push($aIdExPev,$aResultFetch[0]);
					$this->sStatus=0;
				}
			}
		}
		return $aIdExPev;
	}
	/**
	* Cette méthode permet de récupérer la liste des objets Exone_Pev du bâti
	* \return Retourne un tableau d'objets Exone_Pev
	*/
	function get_aEx_Pev($oBD){
		$aExPev=array();
		if($this->isEmpty()){
			$aExPev="";
		}else{
			$aIdExPev=$this->get_aId_Ex_Pev($oBD);
			foreach($aIdExPev as $sValue){
				array_push($aExPev,new Mj_Exone_Pev($sValue,$oBD));
			}
		}
		return $aExPev;
	}
	/**
	* Cette méthode permet de récupérer les Id_Descr_Hab en fonction d'un Id_Pev donné
	* \param $oBD Objet de connexion PDO_BD
	* \return Retourne un tableau de chaînes de caractères.
	*/
	function get_aId_Descr_Hab($oBD){
		if($this->isEmpty()){
			$aIdDescrHab="";
		}else{
			include $this->sRessourcesFile;
			$aIdDescrHab=array();
			$this->sSql=$aSql[$oBD->sgbd]['get_id_descr_hab'];
			$this->sSql=str_replace('$sIdPev',$this->aFields['id_pev'],$this->sSql);
			$oPDOresult=$oBD->execute($this->sSql);
			if($oBD->enErreur()){
				$this->sStatus=1;
				$this->sMessage=$oBD->getBDMessage();
			}else{
				while($aResultFetch=$oBD->ligneSuivante($oPDOresult)){
					array_push($aIdDescrHab,$aResultFetch);
					$this->sStatus=0;
				}
			}
		}
		return $aIdDescrHab;
	}
	/**
	* Cette méthode permet de récupérer la liste des objets Descr du bâti
	* \return Retourne un tableau d'objets Descr_Hab
	*/
	function get_aDescr_Hab($sIdPev,$oBD){
		$aDescrHab=array();
		if($this->isEmpty()){
			$aDescrHab="";
		}else{
			$aIdDescrHab=$this->get_aId_Descr_Hab($oBD);
			foreach($aIdDescrHab as $aValue){
				array_push($aDescrHab,new Mj_Habit_Descr($aValue,$oBD));
			}
			//array_push($aDescrHab,new Mj_Habit_Descr($sIdPev,$oBD));
		}
		return $aDescrHab;
	}
	/**
	* Cette méthode permet de récupérer les Id_Descr_Depend en fonction d'un Id_Pev donné
	* \param $oBD Objet de connexion PDO_BD
	* \return Retourne un tableau de chaînes de caractères.
	*/
	function get_aId_Descr_Depend($oBD){
		if($this->isEmpty()){
			$aIdDescrDepend="";
		}else{
			include $this->sRessourcesFile;
			$aIdDescrDepend=array();
			$this->sSql=$aSql[$oBD->sgbd]['get_id_descr_depend'];
			$this->sSql=str_replace('$sIdPev', $this->aFields['id_pev'], $this->sSql);
			$oPDOresult=$oBD->execute($this->sSql);
			if($oBD->enErreur()){
				$this->sStatus=1;
				$this->sMessage=$oBD->getBDMessage();
			}else{
				while($aResultFetch=$oBD->tableauSuivant($oPDOresult)){
					array_push($aIdDescrDepend,$aResultFetch[0]);
					$this->sStatus=0;
				}
			}
		}
		return $aIdDescrDepend;
	}
	/**
	* Cette méthode permet de récupérer la liste des objets Descr_Depend du bâti
	* \return Retourne un tableau d'objets Descr_Depend
	*/
	function get_aDescr_Depend($sIdPev,$oBD){
		$aDescrDepend=array();
		if($this->isEmpty()){
			$aDescrDepend="";
		}else{
			$aIdDescrDepend=$this->get_aId_Descr_Depend($oBD);
			foreach($aIdDescrDepend as $sValue){
				array_push($aDescrDepend,new Mj_Depend_Descr($sValue,$oBD));
			}
		}
		return $aDescrDepend;
	}
	/**
	* Cette méthode permet de récupérer la liste des objets Descr_Prof du bâti
	* \return Retourne un tableau d'objets Descr_Prof
	*/
	function get_aDescr_Prof($sIdPev,$oBD){
		$aDescr_Prof=array();
		if($this->isEmpty()){
			$aDescr_Prof="";
		}else{
			array_push($aDescr_Prof,new Mj_Prof_Descr($sIdPev,$oBD));
		}
		return $aDescr_Prof;
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
			$aExportFields['s_tar']=$this->aFields['ccostb'];
			$aExportFields['af']=$this->aFields['ccoaff'];
			$aExportFields['l_nature']=$this->aFields['l_ccoaff'];
			$aExportFields['cat']=$this->aFields['dcapec'];
			$aExportFields['nat_exo']=$this->getNatExo();
			$aExportFields['revenu_cadastral']=$this->getRevenuCadastral();
			$aExportFields['num_pev']=$this->aFields['dnupev'];
			$aExportFields['val_loc_ref']=$this->aFields['dvlper'];
			$aExportFields['val_loc_ann']=$this->aFields['dvlpera'];
			$aExportFields['nature']=$this->aFields['gnexpl'];
			$aExportFields['l_nat_exon']=$this->aFields['l_gnexpl'];
			$aExportFields['local_type']=$this->aFields['dnuref'];
		}
		return $aExportFields;
	}
	/**
	* Cette méthode permet de récupérer le revenu cadastral d'une Pev.
	* \return Retourne un entier.
	*/
	function getRevenuCadastral(){
		if ($this->getNatExo()==''){
			$iRevenuCadastral=(int)$this->aFields['bipevla1'];
		}else{
			$fRevenuCadastral=(float)($this->aFields['dvlpera'])/2;
			$iRevenuCadastral=round($fRevenuCadastral);
		}
		return $iRevenuCadastral;
	}
	/**
	* Cette méthode permet de récupérer le revenu cadastral d'une Pev.
	* \return Retourne un float.
	*/
	function getRevenuCadastralfloat(){
		if ($this->getNatExo()==''){
			$fRevenuCadastral=(float)$this->aFields['bipevla1'];
		}else{
			$fRevenuCadastral=(float)($this->aFields['dvlpera'])/2;
		}
		return $fRevenuCadastral;
	}
	/**
	* Cette méthode permet de récupérer la nature de l'exonération qui peut provenir soit de l'attribut 'gnexpl' soit de l'attribut 'gnextl' contenu dans le tableau aExPev.
	* \return Retourne une chaîne de caractères.
	*/
	function getNatExo(){
		if($this->aFields['gnexpl']==''){
			$sNatExo=$this->aExPev[0]->aFields['gnextl'];
		}else{
			$sNatExo=$this->aFields['gnexpl'];
		}
		return $sNatExo;
	}
}

?>
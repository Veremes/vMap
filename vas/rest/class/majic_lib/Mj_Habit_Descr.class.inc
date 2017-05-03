<?php
/**
* \file Mj_Habit_Descr.class.inc
* \brief Mj_Habit_Descr.class.inc \n \n Ce fichier contient la classe php Mj_Habit_Descr
* 
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie Description Habitation.
*
* \author John Bosch
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/

require_once ("Mj.class.inc");

class Mj_Habit_Descr extends Mj {
	/**
	* \param $aIdDescrHab Identifiants de la partie Description Habitation (id_pev et dnudes) 
	* \param $oBD Objet de connexion PDO_BD
	*/
	function __construct($aIdDescrHab,$oBD){
		include $this->sRessourcesFile;
		$this->sSql=$aSql[$oBD->sgbd]['habit_descr'];
		$this->sSql=str_replace('$sIdPev',$aIdDescrHab['id_pev'],$this->sSql);
		$this->sSql=str_replace('$sDnudes',$aIdDescrHab['dnudes'],$this->sSql);
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
			$aExportFields['garage']=$this->getGarage();
			$aExportFields['suf_garage']=$this->aFields['dsueic1'];
			$aExportFields['cave']=$this->getCave();
			$aExportFields['suf_cave']=$this->aFields['dsueic2'];
			$aExportFields['grenier']=$this->getGrenier();
			$aExportFields['suf_grenier']=$this->aFields['dsueic3'];
			$aExportFields['terrasse']=$this->getTerrasse();
			$aExportFields['suf_terrasse']=$this->aFields['dsueic4'];
			$aExportFields['nb_baignoires']=$this->aFields['dnbbai'];
			$aExportFields['nb_douches']=$this->aFields['dnbdou'];
			$aExportFields['nb_lavabos']=$this->aFields['dnblav'];
			$aExportFields['nb_wc']=$this->aFields['dnbwc'];
			$aExportFields['nb_piece_principal']=$this->aFields['dnbppr'];
			$aExportFields['nb_sam']=$this->aFields['dnbsam'];
			$aExportFields['nb_chambre']=$this->aFields['dnbcha'];
			$aExportFields['nb_cuisine_m9']=$this->aFields['dnbcu8'];
			$aExportFields['nb_cuisine_p9']=$this->aFields['dnbcu9'];
			$aExportFields['nb_salle_eau']=$this->aFields['dnbsea'];
			$aExportFields['nb_annexe']=$this->aFields['dnbann'];
			$aExportFields['nb_piece_total']=$this->aFields['dnbpdc'];
			$aExportFields['suf_piece_total']=$this->aFields['dsupdc'];
			$aExportFields['mat_gros_mur']=$this->aFields['dmatgm'];
			$aExportFields['lib_mat_gros_mur']=$this->aFields['lib_dmatgm'];
			$aExportFields['mat_toiture']=$this->aFields['dmatto'];
			$aExportFields['lib_mat_toiture']=$this->aFields['lib_dmatto'];
			$aExportFields['annee_constr']=$this->aFields['jannat'];
			$aExportFields['Etat']=$this->aFields['detent'];
			$aExportFields['l_Etat']=$this->aFields['l_detent'];
			$aExportFields['nb_niveaux']=$this->aFields['dnbniv'];
			$aExportFields['eau']=$this->getEau();
			$aExportFields['elect']=$this->getElect();
			$aExportFields['esc_serv']=$this->getEsc();
			$aExportFields['gaz']=$this->getGaz();
			$aExportFields['asc']=$this->getAsc();
			$aExportFields['chauf']=$this->getChauf();
			$aExportFields['vide_ord']=$this->getVide();
			$aExportFields['egout']=$this->getEgout();
		}
		return $aExportFields;
	}

	function getGarage(){
		if ($this->aFields['cconad1'] == "GA"){
			return "Garage(s)";
		}
	}

	function getCave(){
		if ($this->aFields['cconad2'] == "CV"){
			return "Cave(s)";
		}
	}

	function getGrenier(){
		if ($this->aFields['cconad3'] == "GR"){
			return "Greniers(s)";
		}
	}

	function getTerrasse(){
		if ($this->aFields['cconad4'] == "TR"){
			return "Terrasse(s)";
		}
	}

	function getEau(){
		if ($this->aFields["geaulc"] == "O"){
			return "EAU";
		}
	}

	function getElect(){
		if ($this->aFields["gelelc"] == "O"){
			return "ELECT";
		}
	}

	function getEsc(){
		if ($this->aFields["gesclc"] == "O"){
			return "ESC_SERV";
		}
	}

	function getGaz(){
		if ($this->aFields["ggazlc"] == "O"){
			return "GAZ";
		}
	}

	function getAsc(){
		if ($this->aFields["gasclc"] == "O"){
			return "ASC";
		}
	}

	function getChauf(){
		if ($this->aFields["gchclc"] == "O"){
			return "CHAUF";
		}
	}

	function getVide(){
		if ($this->aFields["gvorlc"] == "O"){
			return "VIDE_ORD";
		}
	}

	function getEgout(){
		if ($this->aFields["gteglc"] == "O"){
			return "EGOUT";
		}
	}

}
?>
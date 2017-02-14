<?php
/**
* \file Mj_Bati_Parcelles.class.inc
* \brief Mj_Bati_Parcelles.class.inc \n \n Ce fichier contient la classe php Mj_Bati_Parcelles
*
* Cette classe permet de s�lectionner les attributs n�cessaires afin de traiter les batis associ�s � une parcelle.
*
* \author Damien Bedel
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/

require_once ("Mj.class.inc");
require_once ("Mj_Compte_Communal_Parcelle.class.inc");

class Mj_Compte_Communal_Parcelles extends Mj {

	/**
	* \param $aIdPar Tableau Identifiants des parcelles
	* \param $oBD Objet de connexion
	* \param $properties Tableau des propri�t�s
	* \param $sLayerTypeParcelle Chaine Type de g�om�trie des parcelles
	*/
	function Mj_Compte_Communal_Parcelles($aIdPar,$oBD,$properties,$sLayerTypeParcelle){
             $oBD = new BD ($properties["cadastre"]["rp"]["login"], $properties["cadastre"]["rp"]["pass"], $properties["database"], $properties["server"], $properties["port"], $properties["sgbd"], $properties["page_encoding"]);                
		$i=0;
                while ($aIdPar[$i]){
			array_push ($this->aObjects, new Mj_Compte_Communal_Parcelle("",$aIdPar[$i],$oBD,$properties));
			$i++;
		}
		foreach($this->getObjects('Mj_Compte_Communal_Parcelle') as $oCptParcelle){
			foreach($oCptParcelle->getObjects('Mj_Parcelle') as $oParcelle){
				$oParcelle->getEmprises($properties,$oBD,$sLayerTypeParcelle);
				foreach($oParcelle->getObjects('Mj_Emprises') as $oEmprises){
					if($oEmprises->isError()){
						$this->sStatus=1;
						$this->sMessage="Erreur lors des récupérations des emprises, consulter le error.log";
                                                //error_log($oEmprises);
					}
				}
			}
		}
	}

	/**
	* \brief R�cup�ration de la surface totale des parcelles
	*/
	function getSurfaceCadastrale() {
		$dSurfaceCadastrale = 0;
		foreach($this->getObjects('Mj_Compte_Communal_Parcelle') as $oCptCom) {
			$aFields=$oCptCom->getExportFields();
			$dSurfaceCadastrale = $aFields['total_contenance'] + $dSurfaceCadastrale;
		}
		return $dSurfaceCadastrale;
	}
	/**
	* \brief R�cup�ration de la surface totale des parcelles en mettre carr�
	*/
	function getSurfaceCadastraleM2() {
		$dSurfaceCadastraleM2 = 0;
		foreach($this->getObjects('Mj_Compte_Communal_Parcelle') as $oCptCom) {
			$aFields=$oCptCom->getExportFields();
			$dSurfaceCadastraleM2 = $aFields['total_contenance_m2'] + $dSurfaceCadastraleM2;
		}
		return $dSurfaceCadastraleM2;
	}
	/**
	* \brief R�cup�ration des revenus de la subdivision fiscale des parcelles
	*/
	function getRevenuCadastral() {
		$dRevenuCadastral=0;
		foreach($this->getObjects('Mj_Compte_Communal_Parcelle') as $oCptCom) {
			$aFields=$oCptCom->getExportFields();
			$dRevenuCadastral = $aFields['total_revenu_cadastral'] + $dRevenuCadastral;
		}
		return $dRevenuCadastral;
	}

	/**
	* \brief R�cup�ration des valeurs locatives
	*/
	function getValeurLocative() {
		$dValeurLocative=0;
		foreach($this->getObjects('Mj_Compte_Communal_Parcelle') as $oCptCom) {
			$aFields=$oCptCom->getExportFields();
			$dValeurLocative=$aFields['total_valeur_locative'] + $dValeurLocative;
		}
		return $dValeurLocative;
	}
	/**
	* \brief R�cup�ration de la emprises b�ties totale des parcelles
	*/
	function getSurfaceCadastraleBati() {
		$dSurfaceCadastraleBati = 0;
		foreach($this->getObjects('Mj_Compte_Communal_Parcelle') as $oCptCom) {
			foreach($oCptCom->getObjects('Mj_Parcelle') as $oParcelle){
		  		foreach($oParcelle->getObjects('Mj_Emprises') as $oEmprises){
					$aFields=$oEmprises->getExportFields();
		  			if($aFields['titre']=="Emprise Bati"){
						$dSurfaceCadastraleBati = $aFields['emprise_totale_intersect'] + $dSurfaceCadastraleBati;
		  			}
		  		}
			}
		}
		return $dSurfaceCadastraleBati;
	}
	/**
	* \brief Cette m�thode permet de construire un tableau correspondant au relev� de propri�t�.
	* \return Retourne un tableau associatif correspondant au relev� de propri�t�.
	*/
	function getExportFields(){
		$aExportFields=array();
		if(!empty($this->aObjects)){
			//partie des sommes (surfaces,revenus,valeurs locatives)
			$aExportFields['Sum_revenu']=$this->getRevenuCadastral();
			$aExportFields['Sum_contenance']=$this->getSurfaceCadastrale();
			$aExportFields['Sum_contenance_m2']=$this->getSurfaceCadastraleM2();
			$aExportFields['Sum_valeur_locative']=$this->getValeurLocative();
			$aExportFields['Sum_contenance_bati']=$this->getSurfaceCadastraleBati();
		}
		return $aExportFields;
	}
}
?>
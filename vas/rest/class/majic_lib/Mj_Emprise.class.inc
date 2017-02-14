<?php

/**
* \file Mj_Emprise.class.inc
* \brief Mj_Emprise.class.inc \n \n Ce fichier contient la classe php Mj_Emprise
* 
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie parcelle. 
*
* \author Nicolas Chazeau
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/

/**
* \class Mj_Emprise
* \brief Mj_Emprise Class \n \n Mj_Emprise est une classe PHP qui hérite de la classe Mj_Emprise.
*
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie Emprise. 
*
* \author Nicolas Chazeau
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
require_once ("Mj.class.inc");
require_once ("Mj_Attributes.class.inc");

class Mj_Emprise extends Mj {

	var $sIdEmprise="";
	/**
	* Tableau
	*/
	var $aAttributesEmprise= array();

	/**
	* Cette méthode métier permet de récupérer les informations sur les couches intersectées par la surface de la parcelle interrogée.
	* \param $aField Tableau des noms de champs associées à la vue utilisée.
	* \param $aRow
	* \param $iCompteur
	* \param $iTolerance Valeur minimum de surface intersecté à partir de laquelle le contenu d'un enregistrement est affiché.
	*/
	function Mj_Emprise($aField,$aRow,$iCompteur, $iTolerance) {
		$aEmpriseParcelle= array();
		switch(strtoupper($aField["type"])) {
			case "POINT" :
				$aEmpriseParcelle["intersectsuf"] = $aRow;
				$this->sIdEmprise=$iCompteur;
			break;
			case "LINE" :
				if(round($aRow["intersect"]) >= $iTolerance){
					$aEmpriseParcelle["intersectsuf"] = $aRow;
					$aEmpriseParcelle["intersectsuf"]["intersect_label"]= $aEmpriseParcelle["intersectsuf"]["intersect"]." m";
					$this->sIdEmprise=$iCompteur;
				}else{
					$aEmpriseParcelle["intersectsuf"]["intersect"] = "0";
					$aEmpriseParcelle["intersectsuf"]["intersect_label"] = "0 m";
					$this->sIdEmprise=$iCompteur;
				}
			break;
			case "POLYGON" :
				if(round($aRow["intersect"]) >= $iTolerance){
					$aEmpriseParcelle["intersectsuf"] = $aRow;
					$aEmpriseParcelle["ratio"] = @(round(($aEmpriseParcelle["intersectsuf"]["intersect"] / $aEmpriseParcelle["intersectsuf"]["suf_parcelle"]), 2) * 100);
					$aEmpriseParcelle["intersectsuf"]["intersect_label"].=$aEmpriseParcelle["intersectsuf"]["intersect"]." m²";
					$aEmpriseParcelle["ratio_label"]=$aEmpriseParcelle["ratio"]." %";
					$this->sIdEmprise=$iCompteur;
				}else{
					$aEmpriseParcelle["intersectsuf"]["intersect"]="0";
					$aEmpriseParcelle["intersectsuf"]["intersect_label"]="0 m²";
					$aEmpriseParcelle["ratio"]= "0";
					$aEmpriseParcelle["ratio_label"]=$aEmpriseParcelle["ratio"]." %";
					$this->sIdEmprise=$iCompteur;
				}
			break;
		}
		$this->aFields=$aEmpriseParcelle;
		if(is_array($aEmpriseParcelle)){
			array_push($this->aAttributesEmprise, new Mj_Attributes($aEmpriseParcelle,$aField));
		}
		$this->aObjects=$this->aAttributesEmprise;
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
			$aExportFields['emprise_intersect']=$this->aFields["intersectsuf"]["intersect"];
			$aExportFields['emprise_intersect_label']=$this->aFields["intersectsuf"]["intersect_label"];
			if($this->aFields["ratio"]){
				$aExportFields['emprise_ratio']=$this->aFields["ratio"];
				$aExportFields['emprise_ratio_label']=$this->aFields["ratio_label"];
			}
			$aExportFields['id_emprise']=$this->sIdEmprise;
		}
		return $aExportFields;
	}

}
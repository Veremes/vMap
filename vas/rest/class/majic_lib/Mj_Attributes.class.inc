<?php
/**
* \file Mj_Attributes.class.inc
* \brief Mj_Attributes.class.inc \n \n Ce fichier contient la classe php Mj_Attributes
* 
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie Attributes d'une Emprise. 
*
* \author Nicolas Chazeau
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
/**
* \class Mj_Attributes
* \brief Mj_Attributes Class \n \n Mj_Attributes est une classe PHP qui hérite de la classe Mj.
*
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie Attributes d'une Emprise. 
*
* \author Nicolas Chazeau
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
require_once ("Mj.class.inc");
require_once ("Mj_Attribute.class.inc");

class Mj_Attributes extends Mj {
	/**
	* Tableau associatif comportant la liste des objets Attribut d'une Emprise.
	*/
	var $aAttributes =array();

	/**
	* Cette méthode métier permet de récupérer les attributs d'une emprise calculée sur la parcelle d'un compte communal.
	* \param $aAttributesEmprise Tableau des attributs.
	* \param $aField Tableau des libellés issue des properties.
	* \private
	* \return Un tableau HTML sous la forme d'une chaîne de caractères.
	*/
	function Mj_Attributes($aAttributesEmprise,$aField=Array()){
		foreach ($aAttributesEmprise as $sAttributeEmprise => $aValue){
			if (is_array($aValue)){
				foreach ($aValue as $sLabel => $sValue){
					$aAttribute["label"]=$sLabel;
					$aAttribute["value"]=$sValue;
					array_push($this->aAttributes,new Mj_Attribute($aAttribute,$aField));
				}
			}
		}
		$aTest["test"]="test";
		$this->aFields=$aTest;
		$this->aObjects=$this->aAttributes;
	}

	/**
	* Cette méthode permet de construire un tableau.
	* \return Retourne un tableau associatif.
	*/
	function getExportFields(){
		$aExportFields=array();
		if($this->isEmpty()){
			$aExportFields="";
		}
		return $aExportFields;
	}

}
?>
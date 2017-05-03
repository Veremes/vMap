<?php
/**
* \file Mj_Attribute.class.inc
* \brief Mj_Attribute.class.inc \n \n Ce fichier contient la classe php Mj_Attribute
* 
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie Attribute. 
*
* \author Nicolas Chazeau
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
/**
* \class Mj_Attribute
* \brief Mj_Attribute Class \n \n Mj_Attributes est une classe PHP qui hérite de la classe Mj_Attribute.
*
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie Attribute. 
*
* \author Nicolas Chazeau
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
require_once ("Mj.class.inc");

class Mj_Attribute extends Mj {
	/**
	* Cette méthode métier permet de récupérer l'attribut parmi les attributs d'une emprise calculée sur la parcelle d'un compte communal.
	* \param $aAttributes Tableau.
	* \param $aField Tableau des libellés issue des properties.
	* \private
	*/
	function __construct($aAttributes,$aField=Array()){
		$aAttribute=array();
		$aAttribute["label"]=$aAttributes["label"];
		$aAttribute["title"]=$aField[$aAttributes["label"]];
		$aAttribute["value"]=$aAttributes["value"];
		$this->aFields=$aAttribute;
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
			$aExportFields['label']=$this->aFields["label"];
			$aExportFields['title']=$this->aFields["title"];
			$aExportFields['value']=$this->aFields["value"];
		}
		return $aExportFields;
	}

}
?>
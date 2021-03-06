<?php
/**
* \file Mj_Attributes.class.inc
* \brief Mj_Attributes.class.inc \n \n Ce fichier contient la classe php Mj_Attributes
* 
* Cette classe permet de s�lectionner les attributs n�cessaires afin de traiter la partie Attributes d'une Emprise. 
*
* \author Nicolas Chazeau
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
/**
* \class Mj_Attributes
* \brief Mj_Attributes Class \n \n Mj_Attributes est une classe PHP qui h�rite de la classe Mj.
*
* Cette classe permet de s�lectionner les attributs n�cessaires afin de traiter la partie Attributes d'une Emprise. 
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
	* Cette m�thode m�tier permet de r�cup�rer les attributs d'une emprise calcul�e sur la parcelle d'un compte communal.
	* \param $aAttributesEmprise Tableau des attributs.
	* \param $aField Tableau des libell�s issue des properties.
	* \private
	* \return Un tableau HTML sous la forme d'une cha�ne de caract�res.
	*/
	function __construct($aAttributesEmprise,$aField=Array()){
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
	* Cette m�thode permet de construire un tableau.
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
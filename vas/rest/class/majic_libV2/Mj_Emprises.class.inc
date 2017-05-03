<?php

/**
* \file Mj_Emprises.class.inc
* \brief Mj_Emprises.class.inc \n \n Ce fichier contient la classe php Mj_Emprises
* 
* Cette classe permet de s�lectionner les attributs n�cessaires afin de traiter la partie parcelle. 
*
* \author Nicolas Chazeau
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/

/**
* \class Mj_Emprises
* \brief Mj_Emprises Class \n \n Mj_Emprises est une classe PHP qui h�rite de la classe Mj_Parcelle.
*
* Cette classe permet de s�lectionner les attributs n�cessaires afin de traiter la partie Emprises. 
*
* \author Nicolas Chazeau
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
require_once ("Mj.class.inc");
require_once ("Mj_Parcelle.class.inc");
require_once ("Mj_Emprise.class.inc");

class Mj_Emprises extends Mj {

	/**
	* Cette m�thode m�tier permet de r�cup�rer les informations sur les couches intersect�es par la surface de la parcelle int�rrog�e.
	* \param $oCadastre Objet classe Cadastre.
	* \param $sIdPar Identifiant de la parcelle s�lectionn�e.
	* \param $sView Vue Postgis � interroger.
	* \param $iTolerance Valeur minimum de surface intersect� � partir de laquelle le contenu d'un enregistrement est affich�.
	* \param $aField Tableau des noms de champs associ�es � la vue utilis�e.
	* \param $sLayerType Type de g�om�trie contenue dans la couche parcelle de r�f�rence.
	* \param $sInclude Fichier de rendu (*.vhtml) � afficher en cas d'erreur.
	* \param $sType (Facultatif) Param�tre signifiant si on veut un tableau HTML (par d�faut) ou aucune mise en forme en sortie (valeurs possibles : HTML, TEXT).
	* \private
	* \return Un tableau HTML sous la forme d'une cha�ne de caract�res.
	*/

	/**
	* Tableau associatif comportant la liste des objets Emprises d'une parcelle
	*/
	var $aEmprisesParcellesSuf=array();

	function __construct($oBD, $sIdPar, $sView, $iTolerance, $aField, $sLayerType) {
                
		$sFunction = "";
		switch(strtoupper($aField["type"])) {
			case "POINT" :
				$sFunction.= "st_area2d";
			break;
			case "LINE" :
				$sFunction.= "st_length2d";
			break;
			case "POLYGON" :
				$sFunction.= "st_area2d";
			break;
		}
		($sLayerType == "polygon") ? $sPrcTable = "s_cadastre.v_vmap_parcelle" : $sPrcTable = "s_cadastre.v_vmap_parcelle_point";
                $sSql = "SELECT CAST(".$sFunction."(st_intersection(".$sPrcTable.".geom, CASE WHEN st_srid(".$sPrcTable.".geom) = st_srid(".$sView.".geom) THEN ".$sView.".geom ELSE st_transform(".$sView.".geom, st_srid(".$sPrcTable.".geom)) END)) AS DECIMAL(10,1)) AS intersect, ";
		$sSql.= "st_area2d(".$sPrcTable.".geom) AS suf_parcelle, ".$sView.".* FROM ".$sPrcTable.", ".$sView." WHERE ";
		$sSql.= "st_intersects(".$sPrcTable.".geom, CASE WHEN st_srid(".$sPrcTable.".geom) = st_srid(".$sView.".geom) THEN ".$sView.".geom ELSE st_transform(".$sView.".geom, st_srid(".$sPrcTable.".geom)) END) ";
		$sSql.= "AND ".$sPrcTable.".id_par = '".$sIdPar."' ;";

		$iResult=$oBD->execute($sSql);
		if ($oBD->enErreur()) {
			$this->sStatus = 1;
			$this->sMessage = $oBD->getBDMessage();
		}else{
			$i=0;
			while($aRow = $oBD->ligneSuivante ($iResult)) {
				$oEmprise=new Mj_Emprise($aField,$aRow,$i,$iTolerance);
				if($oEmprise->aFields["intersectsuf"]["intersect"]!="0"){
					array_push($this->aEmprisesParcellesSuf,$oEmprise);
					$i++;
				}
			}
			$iResult = $oBD->fermeResultat();
		}
		$aValue["titre"]=$aField["title"];
		$aValue["type_geom"]=$aField["type"];
		$this->aFields=$aValue;
		$this->aObjects=$this->aEmprisesParcellesSuf;
	}
	/*
	* R�cup�re l'emprise totale d'un ensemble d'emprise (bati ou pos ou servitude etc)
	* \return D�cimal l'emprise totale
	*/
	function getEmpriseTotale() {
		$dEmpriseTotale = 0;
		foreach ($this->aEmprisesParcellesSuf as $oEmprise) {
			$dEmpriseTotale = $dEmpriseTotale + (float) $oEmprise->aFields["intersectsuf"]["intersect"];
		}
		return $dEmpriseTotale;
	}

	function getEmpriseRatioTotale() {
		$dEmpriseRatioTotale = 0;
		foreach ($this->aEmprisesParcellesSuf as $oEmprise) {
			$dEmpriseRatioTotale = $dEmpriseRatioTotale + (float) $oEmprise->aFields["ratio"];
		}
		return $dEmpriseRatioTotale;
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
			$aExportFields['titre']=$this->aFields["titre"];
			$aExportFields['type_geom']=$this->aFields["type_geom"];
			$aExportFields['emprise_totale_intersect']=$this->getEmpriseTotale();
			$aExportFields['emprise_totale_ratio']=$this->getEmpriseRatioTotale();
		}
		return $aExportFields;
	}

}
?>
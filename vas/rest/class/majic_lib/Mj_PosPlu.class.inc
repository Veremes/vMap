<?php
/**
* \file Mj_Parcelle.class.inc
* \brief Mj_Parcelle.class.inc \n \n Ce fichier contient la classe php Mj_Parcelle
* 
* Cette classe permet de sélectionner les attributs POS/PLU nécessaires.
*
* \author John Bosch <john.bosch@veremes.com>
*/
require_once ("Mj.class.inc");
require_once ("Mj_Parcelle.class.inc");

class Mj_PosPlu extends Mj {

	/**
	* Constructeur
	* \param $oBD Objet de connexion PDO_BD
	* \param $sIdPar Identifiant de la parcelle
	* \param $sCodCom Code Insee de la commune
	*/
	function Mj_PosPlu($oBD,$sObjectId, $sIdPar,$sCodCom) {
		include $this->sRessourcesFile;
		$this->sSql=$aSql[$oBD->sgbd]['pos_plu'];
		$this->sSql=str_replace('$sObjectId', $sObjectId, $this->sSql);
		$this->sSql=str_replace('$sIdPar', $sIdPar, $this->sSql);
		$this->sSql=str_replace('$sCodCom', $sCodCom, $this->sSql);
		$oPDOresult=$oBD->execute($this->sSql);
		if ( $oBD->enErreur()) {
		    $this->sStatus=1;
		    $this->sMessage=$oBD->getBDMessage();    	
		}else{
			while($aRow = $oBD->ligneSuivante ($oPDOresult)) {
				$this->aFields=$aRow;
			}
			
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
		} 
		else{
			$aExportFields['zonage']=$this->aFields['TYPE'];
			$aExportFields['lib_zonage']=$this->aFields['LIBELLE'];
			$aExportFields['surface']=$this->getSurface();
			$aExportFields['cos']=$this->aFields['COS'];
			$aExportFields['ces']=$this->aFields['CES'];
			$aExportFields['hauteur']=$this->aFields['HAUTEUR'];
			$aExportFields['idreg']=$this->aFields['IDREG'];
			$aExportFields['codecom']=$this->aFields['CODCOM'];
		}
		return $aExportFields;
	}
	function getSurface(){
		$iSurface= round($this->aFields['SURFACE']);
		return $iSurface;
	}
	

}

?>
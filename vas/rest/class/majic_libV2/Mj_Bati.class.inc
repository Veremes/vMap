<?php
/**
* \file Mj_Bati.class.inc
* \brief Mj_Bati.class.inc \n \n Ce fichier contient la classe php Mj_Bati
* 
* Cette classe permet de s�lectionner les attributs n�cessaires afin de traiter la partie bati. 
*
* \author Damien Bedel
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
/**
* \class Mj_Bati
* \brief Mj_Bati Class \n \n Mj_Bati est une classe PHP qui h�rite de la classe Mj.
*
* Cette classe permet de s�lectionner les attributs n�cessaires afin de traiter la partie b�ti. 
*
* \author Damien Bedel
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
require_once ("Mj.class.inc");
require_once ("Mj_Pev.class.inc");
require_once ("Mj_Lot_Local.class.inc");

class Mj_Bati extends Mj {
	/**
	* Tableau associatif comportant la liste des objets Pev du b�ti
	*/
	var $aPev=array();
	/**
	* Tableau associatif comportant la liste des objets Lot_Local du b�ti
	*/
	var $aLotLocal=array();

	/**
	* \param $sIdBat Identifiant de b�ti
	* \param $oBD Objet de connexion PDO_BD
	*/
	function Mj_Bati($sIdBat,$oBD, $sEncryptedKey=''){
		$this->sEncryptKey = $sEncryptedKey;
		include $this->sRessourcesFile;
		$this->sSql=$aSql[$oBD->sgbd]['bati'];
		$this->sSql=str_replace('$sIdBat', $sIdBat, $this->sSql);
		$oPDOresult= $oBD->execute($this->sSql);
		if ($oBD->enErreur()) {
			$this->sStatus=1;
			$this->sMessage=$oBD->getBDMessage();
		}else{
			$this->aFields=$oBD->ligneSuivante($oPDOresult);
			$this->sStatus=0;
		}
		$this->aPev=$this->get_aPev($oBD);
		$this->aPro=$this->get_aPro($oBD);
		$this->aLotLocal=$this->get_aLot_Local($oBD);
		$this->aObjects=array_merge ($this->aPev, $this->aLotLocal, $this->aPro);
	}
	/**
	* Cette m�thode permet de r�cup�rer les ID_PRO en fonction d'un ID_DNUPRO donn�.
	* \return Retourne un tableau de ID_PRO.
	*/
	function get_aId_Pro($oBD){
		if($this->isEmpty()){
			$aIdPro="";
		}else{
			include $this->sRessourcesFile;
			$aIdPro=array();
			$this->sSql=$aSql[$oBD->sgbd]['get_id_pro'];
			$this->sSql=str_replace('$sIdDnupro', $this->encrypt($this->aFields['b_iddnupro']), $this->sSql);
			$oPDOresult= $oBD->execute($this->sSql);
			if ( $oBD->enErreur()) {
				$this->sStatus=1;
				$this->sMessage=$oBD->getBDMessage();
			}else{
				while($aResultFetch=$oBD->tableauSuivant ($oPDOresult)){
					array_push($aIdPro,$aResultFetch[0]);
					$this->sStatus=0;
				}
			}
		}
		return $aIdPro;
		$oPDOresult=$oBD->fermeResultat();
	}	
	/**
	* Cette m�thode permet de r�cup�rer la liste des objets Proprietaire
	* \return Retourne un tableau d'objets Proprietaire
	*/
	function get_aPro($oBD){
		$aPro=array();
		if($this->isEmpty()){
			$aPro="";
		}else{
			$aIdPro=$this->get_aId_Pro($oBD);
			foreach($aIdPro as $sIdPro){
				array_push($aPro,new Mj_Proprietaire($this->aFields['b_iddnupro'],$sIdPro,$oBD, $this->sEncryptKey));
			}
		}
		return $aPro;
	}
	/**
	* Cette m�thode permet de r�cup�rer les Id_Pev en fonction d'un Id_Bat donn�.
	* \return Retourne un tableau de cha�nes de caract�res.
	*/
	function get_aId_Pev($oBD){
		if($this->isEmpty()){
			$aIdPev="";
		}else{
			include $this->sRessourcesFile;
			$aIdPev=array();
			$this->sSql=$aSql[$oBD->sgbd]['get_id_pev'];
			$this->sSql=str_replace('$sIdBat', $this->aFields['id_local'], $this->sSql);
			$oPDOresult=$oBD->execute($this->sSql);
			if ($oBD->enErreur()){
				$this->sStatus=1;
				$this->sMessage=$oBD->getBDMessage();
			}else{
				while($aResultFetch=$oBD->tableauSuivant ($oPDOresult)){
					array_push($aIdPev,$aResultFetch[0]);
					$this->sStatus=0;
				}
			}
		}
		return $aIdPev;
	}	
	/**
	* Cette m�thode permet de r�cup�rer la liste des objets Pev du b�ti
	* \return Retourne un tableau d'objets Pev
	*/
	function get_aPev($oBD){
		$aPev=array();
		if($this->isEmpty()){
			$aPev="";
		}else{
		  $aIdPev=$this->get_aId_Pev($oBD);
			foreach($aIdPev as $sValue){
				array_push($aPev,new Mj_Pev($sValue,$oBD));
			}
		}
		return $aPev;
	}
	/**
	* Cette m�thode permet de r�cup�rer les Klot en fonction d'un Id_Bat donn�
	* \return Retourne un tableau de cha�nes de caract�res
	*/
	function get_aKlot($oBD){
		if($this->isEmpty()){
			$aKlot="";
		}else{
			include $this->sRessourcesFile;
			$aKlot=array();
			$this->sSql=$aSql[$oBD->sgbd]['get_klot'];
			$this->sSql=str_replace('$sIdBat', $this->aFields['id_local'], $this->sSql);
			$oPDOresult=$oBD->execute($this->sSql);
			if ( $oBD->enErreur()) {
				$this->sStatus=1;
				$this->sMessage=$oBD->getBDMessage();   	
			}else{
				while($aResultFetch=$oBD->tableauSuivant ($oPDOresult)){
					array_push($aKlot,$aResultFetch[0]);
					$this->sStatus=0;
				}
			}
		}
		return $aKlot;
	}	
	/**
	* Cette m�thode permet de r�cup�rer la liste des objets Lot-Local du b�ti
	* \return Retourne un tableau d'objets Lot-Local
	*/
	function get_aLot_Local($oBD){
		$aLotLocal=array();
		if($this->isEmpty()){
			$aLotLocal="";
		}else{
			$aKlot=$this->get_aKlot($oBD);
			foreach($aKlot as $sKlot){
				array_push($aLotLocal,new Mj_Lot_Local($this->aFields['id_local'],$sKlot,$oBD));
			}
		}
		return $aLotLocal;	
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
			$aExportFields['date']=$this->getJdatat();
			$aExportFields['section']=$this->aFields['ccosec'];
			$aExportFields['num_plan']=$this->aFields['dnupla'];
			$aExportFields['cp']=$this->aFields['ccoplc'];
			$aExportFields['voirie']=$this->getVoirie();
			$aExportFields['adresse']=$this->aFields['dvoilib'];
			$aExportFields['code_rivoli']=$this->aFields['ccoriv'];
			$aExportFields['bat']=$this->aFields['dnubat'];
			$aExportFields['ent']=$this->aFields['nesc']; // anciennement desc , mot réservé par sql
			$aExportFields['niv']=$this->aFields['dniv'];
			$aExportFields['num_de_porte']=$this->aFields['dpor'];
			$aExportFields['num_invar']=$this->getNumeroInvar();
			$aExportFields['m_eva']=$this->aFields['ccoeva'];
			$aExportFields['nat_loc']=$this->getNatLoc();
			$aExportFields['tx_om']=$this->aFields['gtauom'];
			$aExportFields['s_tar']=$this->getSTar();
			$aExportFields['af']=$this->getAf();
			$aExportFields['cat']=$this->getCat();
			$aExportFields['revenu_cadastral']=$this->getRevenuCadastral();
			$aExportFields['revenu_cadastral_txt']=$this->setFloatToText($this->getRevenuCadastral());
			$aExportFields['dvlpera']=$this->aFields['dvlpera'];
			$aExportFields['b_dnupro']=$this->aFields['b_dnupro'];
			$aExportFields['b_iddnupro']=$this->aFields['b_iddnupro'];
			$aExportFields['dteloc']=$this->aFields['dteloc'];
			$aExportFields['dvltrt']=$this->aFields['dvltrt'];
			$aExportFields['dnumql']=$this->aFields['dnumql'];
			$aExportFields['ddenql']=$this->aFields['ddenql'];
			//$aExportFields['nat_exo']=$this->getNatExo();
			//$aExportFields['exoneration']=$this->getExoneration();
			//$aExportFields['revenu_cadastral_avec_exo']=$this->getRevenuCadastralAvecExo();
			//$aExportFields['revenu_cadastral_avec_pp']=$this->getRevenuCadastralAvecPP();
			$aExportFields['num_invar']=$this->aFields['invar'];
			$aExportFields['ddenql']=$this->aFields['ddenql'];
			$aExportFields['local_type']=$this->aFields['dteloc'];
			$aExportFields['nature']=$this->aFields['cconlc'];
			$aExportFields['lib_nature']=$this->aFields['lib_cconlc'];
			$aExportFields['occupation']=$this->aFields['dnatlc'];
			$aExportFields['lib_occupation']=$this->getOccupation();
			$aExportFields['date_mut']=$this->getJdatat_full();
			$aExportFields['annee_constr']=$this->aFields['jannat'];
			$aExportFields['niveaux']=$this->aFields['dnbniv'];
			$aExportFields['libcom']=$this->aFields['libcom'];
		}
		return $aExportFields;
	}
	/**
	* Cette m�thode permet de r�cup�rer les deux derniers caract�res de l'attribut Jdatat et d'y ajouter 1.
	* \return Retourne une cha�ne de caract�res.
	*/
	function getJdatat_full(){
		$sjdatat=$this->aFields['jdatat'];
		if ($sjdatat != ""){
			if (preg_match( '`^\d{1,2}/\d{1,2}/\d{4}$`' , $sjdatat ) ){
				$sNewJdatat_full=$sjdatat;
			}else if (preg_match( '`^\d{1,2}/\d{1,2}/\d{2}$`' , $sjdatat ) ){
				$sNewJdatat_full=$sjdatat;
			}else{
				$sNewJdatat_full=substr($sjdatat,0,2)."/".substr($sjdatat,2,2)."/".substr($sjdatat,4,4);
			}
		}
		return $sNewJdatat_full;
	}
	/**
	* Cette m�thode permet de r�cup�rer les deux derniers caract�res de l'attribut Jdatat et d'y ajouter 1.
	* \return Retourne une cha�ne de caract�res.
	*/
	function getJdatat(){
		$sNewJdatat=$this->aFields['jdatat'];
		if (preg_match( '`^\d{1,2}/\d{1,2}/\d{4}$`' , $sNewJdatat ) ){			
			$sNewJdatat=substr("$sNewJdatat", 6, 4)+1;
			$sNewJdatat=(string)(substr("$sNewJdatat", 2, 2));
		}else if (preg_match( '`^\d{1,2}/\d{1,2}/\d{2}$`' , $sNewJdatat ) ){
			$sNewJdatat=(string) (substr("$sNewJdatat", 6, 2)+1);
			if(strlen($sNewJdatat) == 1){
				$sNewJdatat='0'.$sNewJdatat;
			}
			$sNewJdatat=(string) (substr("$sNewJdatat", -2, 2));
		}else{
			$sNewJdatat=substr("$sNewJdatat", 4, 4)+1;
			$sNewJdatat=(string)(substr("$sNewJdatat", 2, 2));
		}
		return $sNewJdatat;
	}
	/**
	* Cette m�thode permet de supprimer le code commune de l'attribut invar.
	* \return Retourne une cha�ne de caract�res.
	*/
	function getNumeroInvar(){
		$sNumeroInvar=$this->aFields['invar'];
		$sNumeroInvar= substr("$sNumeroInvar", 3, 7);
		return $sNumeroInvar;
	}
	/**
	* Cette m�thode permet de concat�ner les attributs dnvoiri et indic.
	* \return Retourne une cha�ne de caract�res.
	*/
	function getVoirie(){
		$sVoirie=ltrim($this->aFields['dnvoiri'],'0').$this->aFields['dindic'];
		return $sVoirie;
	}
	/**
	* Cette m�thode permet de r�cup�rer la valeur de l'attribut 's_tar' dans le tableau aPev.
	* \return Retourne une cha�ne de caract�res.
	*/
	function getSTar(){
		if(count($this->aPev)==1){
			return $this->aPev[0]->aFields['ccostb'];
		}else{
			return '';
		}
	}
	/**
	* Cette m�thode permet de r�cup�rer la valeur de l'attribut 'af' dans le tableau aPev.
	* \return Retourne une cha�ne de caract�res.
	*/
	function getAf(){
		if(count($this->aPev)==1){
			return $this->aPev[0]->aFields['ccoaff'];
		}else{
			return '';
		}
	}
	/**
	* Cette m�thode permet de r�cup�rer la valeur de l'attribut 'cat' dans le tableau aPev.
	* \return Retourne une cha�ne de caract�res.
	*/
	function getCat(){
		if(count($this->aPev)==1){
			return $this->aPev[0]->aFields['dcapec'];
		}else{
			return '';
		}
	}
	/**
	* Cette m�tode permet de r�cup�rer la somme du revenu cadastral pour un b�ti avec exon�ration de type EP, CD, CR, DR ou NI.
	* \return Retourne un entier.
	*/
	/*function getRevenuCadastralAvecExo(){
		$iRevenuCadastralAvecExo=0;
		foreach ($this->aPev as $oPev) {
			if(ereg ("EP|CD|CR|DR|NI|ND", $oPev->aExportFields['nat_exo'])){
				$iRevenuCadastralAvecExo=$iRevenuCadastralAvecExo + $oPev->aExportFields['revenu_cadastral'];
			}
		} 
		return $iRevenuCadastralAvecExo;
	}*/
	/**
	* Cette m�tode permet de r�cup�rer la somme du revenu cadastral pour un b�ti avec exon�ration de type PP.
	* \return Retourne un entier.
	*/
	/*function getRevenuCadastralAvecPP(){
		$iRevenuCadastralAvecPP=0;
		foreach ($this->aPev as $oPev) {
			if((ereg ("PP", $oPev->aExportFields['nat_exo'])) && ((int) ($this->aFields['dnupev']>1))){
				$iRevenuCadastralAvecPP=$iRevenuCadastralAvecPP + $oPev->aExportFields['revenu_cadastral'];
			}
		} 
		return $iRevenuCadastralAvecPP;
	}
	/**
	* Cette m�tode permet de r�cup�rer la somme du revenu cadastral pour un b�ti.
	* \return Retourne un entier.
	*/
	function getRevenuCadastral(){
		$iRevenuCadastral=0;
		foreach($this->aPev as $oPev){
			$iRevenuCadastral=$iRevenuCadastral+ (int) $oPev->getRevenuCadastral();
		}
		return $iRevenuCadastral;
	}
	/**
	* Cette m�tode permet de r�cup�rer la somme du revenu cadastral pour un b�ti.
	* \return Retourne un float.
	*/
	function getRevenuCadastralfloat(){
		$iRevenuCadastral=0;
		foreach($this->aPev as $oPev){
			$fRevenuCadastral=$fRevenuCadastral+ (float) $oPev->getRevenuCadastral();
		}
		return $fRevenuCadastral;
	}
	/**
	* Cette m�thode permet de r�cup�rer la somme des exon�rations pour un b�ti.
	* \return Retourne un entier.
	*/
	function getExoneration($sLccodem){
		$iExoneration=0;
		foreach ($this->aPev as $oPev){
			if (($sLccodem!='') && (ereg ("PP", $oPev->getNatExo())) && ((int) ($this->aFields['dnupev']>1))){
				$iExoneration=$iExoneration + $oPev->getRevenuCadastral();
			}elseif($oPev->getNatExo()!=''){
				$iExoneration=$iExoneration + $oPev->getRevenuCadastral();
			}
		} 
		return $iExoneration;
	}
	/**
	* Cette m�thode permet de r�cup�rer la somme des exon�rations pour un b�ti.
	* \return Retourne un float.
	*/
	function getExonerationfloat($sLccodem){
		$fExoneration=0;
		foreach ($this->aPev as $oPev){
			if (($sLccodem!='') && (ereg ("PP", $oPev->getNatExo())) && ((int) ($this->aFields['dnupev']>1))){
				$fExoneration=$fExoneration + $oPev->getRevenuCadastralfloat();
			}elseif($oPev->getNatExo()!=''){
				$fExoneration=$fExoneration + $oPev->getRevenuCadastralfloat();
			}
		} 
		return $fExoneration;
	}
	/**
	* Cette m�thode permet de retourner la nature du local.
	* \return Retourne une cha�ne de caract�res qui peut �tre valide (la cha�ne de caract�res a �t� v�rifi�e d'apr�s des exemples de relev�s de propri�t�) ou non valide (la cha�ne de caract�res n'a pas pu �tre v�rifi�e).
	*/
	function getNatLoc(){
		switch($this->aFields["cconlc"]){
			case 'MA' :
				$sNatLoc="MAIS"; // Cas valid�
			break;
			case 'AP' :
				$sNatLoc="APP"; // Cas valid�
			break;
			case 'DE' :
				$sNatLoc=$this->getNatureDep(); // Cf fonction getNatureDep()
			break;
			case 'DC' :
				$sNatLoc="DLC"; // cas non valid�
			break;
			case 'LC' :
				$sNatLoc="L.COM"; // Cas valid�
			break;
			case 'CM' :
				$sNatLoc="CM"; // Cas valid�
			break;
			case 'CA' :
				$sNatLoc="CA"; // Cas valid�
			break;
			case 'CD' :
				$sNatLoc="DEP.C"; // Cas valid�
			break;
			case 'CB' :
				$sNatLoc="L.DIV"; // Cas valid�
			break;
			case 'ME' :
				$sNatLoc="M.EXC"; // Cas valid�
			break;
			case 'MP' :
				$sNatLoc="M.PAR"; // Cas valid�
			break;
			case 'SM' :
				$sNatLoc="SOLM"; // Cas non valid�
			break;
			case 'AU' :
				$sNatLoc="AU"; // Cas valid�
			break;
			case 'CH' :
				$sNatLoc="CHANT"; // Cas valid�
			break;
			case 'U ' :
				$sNatLoc="E.IND"; // Cas valid�
			break;
			case 'US' :
				$sNatLoc="US"; // Cas valid�
			break;
			case 'UG' :
				$sNatLoc="AGAZ"; // Cas non valid�
			break;
			case 'UE' :
				$sNatLoc="UE"; // Cas valid�
			break;
			case 'U1' :
				$sNatLoc="GARE"; // Cas non valid�
			break;
			case 'U2' :
				$sNatLoc="GTRI"; // Cas non valid�
			break;
			case 'U3' :
				$sNatLoc="GAMAT"; // Cas non valid�
			break;
			case 'U4' :
				$sNatLoc="GAMAG"; // Cas non valid�
			break;
			case 'U5' :
				$sNatLoc="GDETI"; // Cas non valid�
			break;
			case 'U6' :
				$sNatLoc="GDERE"; // Cas non valid�
			break;
			case 'U7' :
				$sNatLoc="GMATR"; // Cas non valid�
			break;
			case 'U8' :
				$sNatLoc="GEMR"; // Cas non valid�
			break;
			case 'U9' :
				$sNatLoc="GSTUS"; // Cas non valid�
			break;
			case 'AT' :
				$sNatLoc="AT"; // Cas valid�
			break;
			default :
				$sNatLoc=substr($this->aFields["cconlc"],0,4);
			break;
		}
		return $sNatLoc;
	}
	/**
	* Cette m�thode permet de retourner la nature de d�pendance.
	* \return Retourne une cha�ne de caract�res qui peut �tre valide (la cha�ne de caract�res a �t� v�rifi�e d'apr�s des exemples de relev�s de propri�t�) ou non valide (la cha�ne de caract�res n'a pas pu �tre v�rifi�e).
	*/
	function getNatureDep(){
		switch($this->aFields["cconad"]){
			case 'GA' :
				$sNatureDep="GAR"; // Cas valid�
			break;
			case 'CV' :
				$sNatureDep="CAVE"; // Cas valid�
			break;
			case 'GR' :
				$sNatureDep="GREN"; // Cas valid�
			break;
			case 'TR' :
				$sNatureDep="TERR"; // Cas non valid�
			break;
			case 'GP' :
				$sNatureDep="GPARK"; // Cas valid�
			break;
			case 'GC' :
				$sNatureDep="GRCA"; // Cas non valid�
			break;
			case 'BX' :
				$sNatureDep="BOX"; // Cas valid�
			break;
			case 'PK' :
				$sNatureDep="PARK"; // Cas valid�
			break;
			case 'CL' :
				$sNatureDep="CELL"; // Cas non valid�
			break;
			case 'BD' :
				$sNatureDep="BUAN"; // Cas non valid�
			break;
			case 'BC' :
				$sNatureDep="BUCH"; // Cas non valid�
			break;
			case 'RS' :
				$sNatureDep="REMI"; // Cas non valid�
			break;
			case 'TT' :
				$sNatureDep="TT"; // Cas valid�
			break;
			case 'PI' :
				$sNatureDep="P.IND"; // Cas valid�
			break;
			case 'PA' :
				$sNatureDep="AGREM"; // Cas valid�
			break;
			case 'CD' :
				$sNatureDep="CHDO"; // Cas non valid�
			break;
			case 'DC' :
				$sNatureDep="DEP.C"; // Cas valid�
			break;
			case 'JH' :
				$sNatureDep="J.HIV"; // Cas valid�
			break;
			case 'PS' :
				$sNatureDep="PISC"; // Cas valid�
			break;
			case 'SR' :
				$sNatureDep="SERR"; // Cas non valid�
			break;
			default :
				$sNatureDep=substr($this->aFields["cconad"],0,4);
			break;
		}
		return $sNatureDep;
	}
	/**
	* Cette m�thode permet de formater un d�cimal pour l'affichage.
	* \return Retourne une chaine
	*/
	function setFloatToText($fFloat){
		return number_format($fFloat,2,'.','');
	}
	/**
	* Cette m�thode permet de retourner l'occupation du logement
	* \return Retourne une cha�ne de caract�res qui peut �tre valide (la cha�ne de caract�res a �t� v�rifi�e d'apr�s des exemples de relev�s de propri�t�) ou non valide (la cha�ne de caract�res n'a pas pu �tre v�rifi�e).
	*/
	function getOccupation(){
		switch($this->aFields["dnatlc"]){
			case 'P' :
				$sOccupation="Proprietaire ou  Usufruitier";
			break;
			case 'L' :
				$sOccupation="Location autre que propri�taire ou usufruitier";
			break;
			case 'V' :
				$sOccupation="Vacant";
			break;
			case 'T' :
				$sOccupation="Location, non affect�e � l�habitation, soumise � TVA";
			break;
			case 'D' :
				$sOccupation="Habitation principale occup�e par le propri�taire";
			break;
			default :
				$sOccupation=substr($this->aFields["dnatlc"],0,1);
			break;
		}
		return $sOccupation;
	}
}

?>
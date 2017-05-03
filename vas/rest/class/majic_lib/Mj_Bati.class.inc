<?php
/**
* \file Mj_Bati.class.inc
* \brief Mj_Bati.class.inc \n \n Ce fichier contient la classe php Mj_Bati
* 
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie bati. 
*
* \author Damien Bedel
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
/**
* \class Mj_Bati
* \brief Mj_Bati Class \n \n Mj_Bati est une classe PHP qui hérite de la classe Mj.
*
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie bâti. 
*
* \author Damien Bedel
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
require_once ("Mj.class.inc");
require_once ("Mj_Pev.class.inc");
require_once ("Mj_Lot_Local.class.inc");

class Mj_Bati extends Mj {
	/**
	* Tableau associatif comportant la liste des objets Pev du bâti
	*/
	var $aPev=array();
	/**
	* Tableau associatif comportant la liste des objets Lot_Local du bâti
	*/
	var $aLotLocal=array();

	/**
	* \param $sIdBat Identifiant de bâti
	* \param $oBD Objet de connexion PDO_BD
	*/
	function __construct($sIdBat,$oBD, $sEncryptedKey=''){
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
	* Cette méthode permet de récupérer les ID_PRO en fonction d'un ID_DNUPRO donné.
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
	* Cette méthode permet de récupérer la liste des objets Proprietaire
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
	* Cette méthode permet de récupérer les Id_Pev en fonction d'un Id_Bat donné.
	* \return Retourne un tableau de chaînes de caractères.
	*/
	function get_aId_Pev($oBD){
		if($this->isEmpty()){
			$aIdPev="";
		}else{
			include $this->sRessourcesFile;
			$aIdPev=array();
			$this->sSql=$aSql[$oBD->sgbd]['get_id_pev'];
			$this->sSql=str_replace('$sIdBat', $this->aFields['id_bat'], $this->sSql);
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
	* Cette méthode permet de récupérer la liste des objets Pev du bâti
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
	* Cette méthode permet de récupérer les Klot en fonction d'un Id_Bat donné
	* \return Retourne un tableau de chaînes de caractères
	*/
	function get_aKlot($oBD){
		if($this->isEmpty()){
			$aKlot="";
		}else{
			include $this->sRessourcesFile;
			$aKlot=array();
			$this->sSql=$aSql[$oBD->sgbd]['get_klot'];
			$this->sSql=str_replace('$sIdBat', $this->aFields['id_bat'], $this->sSql);
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
	* Cette méthode permet de récupérer la liste des objets Lot-Local du bâti
	* \return Retourne un tableau d'objets Lot-Local
	*/
	function get_aLot_Local($oBD){
		$aLotLocal=array();
		if($this->isEmpty()){
			$aLotLocal="";
		}else{
			$aKlot=$this->get_aKlot($oBD);
			foreach($aKlot as $sKlot){
				array_push($aLotLocal,new Mj_Lot_Local($this->aFields['id_bat'],$sKlot,$oBD));
			}
		}
		return $aLotLocal;	
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
			$aExportFields['date']=$this->getJdatat();
			$aExportFields['section']=$this->aFields['ccosec'];
			$aExportFields['num_plan']=$this->aFields['dnupla'];
			$aExportFields['cp']=$this->aFields['ccoplc'];
			$aExportFields['voirie']=$this->getVoirie();
			$aExportFields['adresse']=$this->aFields['dvoilib'];
			$aExportFields['code_rivoli']=$this->aFields['ccoriv'];
			$aExportFields['bat']=$this->aFields['dnubat'];
			$aExportFields['ent']=$this->aFields['desc'];
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
	* Cette méthode permet de récupérer les deux derniers caractères de l'attribut Jdatat et d'y ajouter 1.
	* \return Retourne une chaîne de caractères.
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
	* Cette méthode permet de récupérer les deux derniers caractères de l'attribut Jdatat et d'y ajouter 1.
	* \return Retourne une chaîne de caractères.
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
	* Cette méthode permet de supprimer le code commune de l'attribut invar.
	* \return Retourne une chaîne de caractères.
	*/
	function getNumeroInvar(){
		$sNumeroInvar=$this->aFields['invar'];
		$sNumeroInvar= substr("$sNumeroInvar", 3, 7);
		return $sNumeroInvar;
	}
	/**
	* Cette méthode permet de concaténer les attributs dnvoiri et indic.
	* \return Retourne une chaîne de caractères.
	*/
	function getVoirie(){
		$sVoirie=ltrim($this->aFields['dnvoiri'],'0').$this->aFields['dindic'];
		return $sVoirie;
	}
	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 's_tar' dans le tableau aPev.
	* \return Retourne une chaîne de caractères.
	*/
	function getSTar(){
		if(count($this->aPev)==1){
			return $this->aPev[0]->aFields['ccostb'];
		}else{
			return '';
		}
	}
	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 'af' dans le tableau aPev.
	* \return Retourne une chaîne de caractères.
	*/
	function getAf(){
		if(count($this->aPev)==1){
			return $this->aPev[0]->aFields['ccoaff'];
		}else{
			return '';
		}
	}
	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 'cat' dans le tableau aPev.
	* \return Retourne une chaîne de caractères.
	*/
	function getCat(){
		if(count($this->aPev)==1){
			return $this->aPev[0]->aFields['dcapec'];
		}else{
			return '';
		}
	}
	/**
	* Cette métode permet de récupérer la somme du revenu cadastral pour un bâti avec exonération de type EP, CD, CR, DR ou NI.
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
	* Cette métode permet de récupérer la somme du revenu cadastral pour un bâti avec exonération de type PP.
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
	* Cette métode permet de récupérer la somme du revenu cadastral pour un bâti.
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
	* Cette métode permet de récupérer la somme du revenu cadastral pour un bâti.
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
	* Cette méthode permet de récupérer la somme des exonérations pour un bâti.
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
	* Cette méthode permet de récupérer la somme des exonérations pour un bâti.
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
	* Cette méthode permet de retourner la nature du local.
	* \return Retourne une chaîne de caractères qui peut être valide (la chaîne de caractères a été vérifiée d'après des exemples de relevés de propriété) ou non valide (la chaîne de caractères n'a pas pu être vérifiée).
	*/
	function getNatLoc(){
		switch($this->aFields["cconlc"]){
			case 'MA' :
				$sNatLoc="MAIS"; // Cas validé
			break;
			case 'AP' :
				$sNatLoc="APP"; // Cas validé
			break;
			case 'DE' :
				$sNatLoc=$this->getNatureDep(); // Cf fonction getNatureDep()
			break;
			case 'DC' :
				$sNatLoc="DLC"; // cas non validé
			break;
			case 'LC' :
				$sNatLoc="L.COM"; // Cas validé
			break;
			case 'CM' :
				$sNatLoc="CM"; // Cas validé
			break;
			case 'CA' :
				$sNatLoc="CA"; // Cas validé
			break;
			case 'CD' :
				$sNatLoc="DEP.C"; // Cas validé
			break;
			case 'CB' :
				$sNatLoc="L.DIV"; // Cas validé
			break;
			case 'ME' :
				$sNatLoc="M.EXC"; // Cas validé
			break;
			case 'MP' :
				$sNatLoc="M.PAR"; // Cas validé
			break;
			case 'SM' :
				$sNatLoc="SOLM"; // Cas non validé
			break;
			case 'AU' :
				$sNatLoc="AU"; // Cas validé
			break;
			case 'CH' :
				$sNatLoc="CHANT"; // Cas validé
			break;
			case 'U ' :
				$sNatLoc="E.IND"; // Cas validé
			break;
			case 'US' :
				$sNatLoc="US"; // Cas validé
			break;
			case 'UG' :
				$sNatLoc="AGAZ"; // Cas non validé
			break;
			case 'UE' :
				$sNatLoc="UE"; // Cas validé
			break;
			case 'U1' :
				$sNatLoc="GARE"; // Cas non validé
			break;
			case 'U2' :
				$sNatLoc="GTRI"; // Cas non validé
			break;
			case 'U3' :
				$sNatLoc="GAMAT"; // Cas non validé
			break;
			case 'U4' :
				$sNatLoc="GAMAG"; // Cas non validé
			break;
			case 'U5' :
				$sNatLoc="GDETI"; // Cas non validé
			break;
			case 'U6' :
				$sNatLoc="GDERE"; // Cas non validé
			break;
			case 'U7' :
				$sNatLoc="GMATR"; // Cas non validé
			break;
			case 'U8' :
				$sNatLoc="GEMR"; // Cas non validé
			break;
			case 'U9' :
				$sNatLoc="GSTUS"; // Cas non validé
			break;
			case 'AT' :
				$sNatLoc="AT"; // Cas validé
			break;
			default :
				$sNatLoc=substr($this->aFields["cconlc"],0,4);
			break;
		}
		return $sNatLoc;
	}
	/**
	* Cette méthode permet de retourner la nature de dépendance.
	* \return Retourne une chaîne de caractères qui peut être valide (la chaîne de caractères a été vérifiée d'après des exemples de relevés de propriété) ou non valide (la chaîne de caractères n'a pas pu être vérifiée).
	*/
	function getNatureDep(){
		switch($this->aFields["cconad"]){
			case 'GA' :
				$sNatureDep="GAR"; // Cas validé
			break;
			case 'CV' :
				$sNatureDep="CAVE"; // Cas validé
			break;
			case 'GR' :
				$sNatureDep="GREN"; // Cas validé
			break;
			case 'TR' :
				$sNatureDep="TERR"; // Cas non validé
			break;
			case 'GP' :
				$sNatureDep="GPARK"; // Cas validé
			break;
			case 'GC' :
				$sNatureDep="GRCA"; // Cas non validé
			break;
			case 'BX' :
				$sNatureDep="BOX"; // Cas validé
			break;
			case 'PK' :
				$sNatureDep="PARK"; // Cas validé
			break;
			case 'CL' :
				$sNatureDep="CELL"; // Cas non validé
			break;
			case 'BD' :
				$sNatureDep="BUAN"; // Cas non validé
			break;
			case 'BC' :
				$sNatureDep="BUCH"; // Cas non validé
			break;
			case 'RS' :
				$sNatureDep="REMI"; // Cas non validé
			break;
			case 'TT' :
				$sNatureDep="TT"; // Cas validé
			break;
			case 'PI' :
				$sNatureDep="P.IND"; // Cas validé
			break;
			case 'PA' :
				$sNatureDep="AGREM"; // Cas validé
			break;
			case 'CD' :
				$sNatureDep="CHDO"; // Cas non validé
			break;
			case 'DC' :
				$sNatureDep="DEP.C"; // Cas validé
			break;
			case 'JH' :
				$sNatureDep="J.HIV"; // Cas validé
			break;
			case 'PS' :
				$sNatureDep="PISC"; // Cas validé
			break;
			case 'SR' :
				$sNatureDep="SERR"; // Cas non validé
			break;
			default :
				$sNatureDep=substr($this->aFields["cconad"],0,4);
			break;
		}
		return $sNatureDep;
	}
	/**
	* Cette méthode permet de formater un décimal pour l'affichage.
	* \return Retourne une chaine
	*/
	function setFloatToText($fFloat){
		return number_format($fFloat,2,'.','');
	}
	/**
	* Cette méthode permet de retourner l'occupation du logement
	* \return Retourne une chaîne de caractères qui peut être valide (la chaîne de caractères a été vérifiée d'après des exemples de relevés de propriété) ou non valide (la chaîne de caractères n'a pas pu être vérifiée).
	*/
	function getOccupation(){
		switch($this->aFields["dnatlc"]){
			case 'P' :
				$sOccupation="Proprietaire ou  Usufruitier";
			break;
			case 'L' :
				$sOccupation="Location autre que propriétaire ou usufruitier";
			break;
			case 'V' :
				$sOccupation="Vacant";
			break;
			case 'T' :
				$sOccupation="Location, non affectée à l’habitation, soumise à TVA";
			break;
			case 'D' :
				$sOccupation="Habitation principale occupée par le propriétaire";
			break;
			default :
				$sOccupation=substr($this->aFields["dnatlc"],0,1);
			break;
		}
		return $sOccupation;
	}
}

?>
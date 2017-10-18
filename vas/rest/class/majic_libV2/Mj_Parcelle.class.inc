<?php
/**
* \file Mj_Parcelle.class.inc
* \brief Mj_Parcelle.class.inc \n \n Ce fichier contient la classe php Mj_Parcelle
* 
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie parcelle. 
*
* \author Fabien Marty <fabien.marty@veremes.com>
* \author Damien Bedel
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/
/**
* \class Mj_Parcelle
* \brief Mj_Parcelle Class \n \n Mj_Parcelle est une classe PHP qui hérite de la classe Mj.
*
* Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie parcelle. 
*
* \author Fabien Marty <fabien.marty@veremes.com>
* \author Damien Bedel
* \author Olivier Gayte <olivier.gayte@veremes.com>
*/


require_once ("Mj.class.inc");
require_once ("Mj_Suf.class.inc");
require_once ("Mj_Emprises.class.inc");
require_once ("Mj_PosPlu.class.inc");

class Mj_Parcelle extends Mj {
	/**
	* Tableau associatif comportant la liste des objets Suf d'une parcelle
	*/
	var $aSuf=array();
	/**
	* Tableau associatif comportant la liste des objets Emprises d'une parcelle 
	*/
	var $aIntersect=array();
	/**
	* Tableau associatif comportant la liste des objets PosPlu d'une parcelle
	*/
	var $aPosPlu=array();

	/**
	* Constructeur
	* \param $oBD Objet de connexion PDO_BD
	* \param $sIdPar Identifiant de la parcelle
	* \param $sIdDnupro Identifiant du propriétaire
	*/
	function __construct($oBD,$sIdPar,$sIdDnupro,$sEncryptedKey='', $bAllSuf=false){
		include $this->sRessourcesFile;
		$this->sSql=$aSql[$oBD->sgbd]['parcelle'];
		$this->sSql=str_replace('$sIdPar', $sIdPar, $this->sSql);
		$oPDOresult=$oBD->execute($this->sSql);
		if ($oBD->enErreur()){
			$this->sStatus=1;
			$this->sMessage=$oBD->getBDMessage();
		}else{
			if (!$this->aFields=$oBD->ligneSuivante ($oPDOresult)){
				$this->sMessage='La parcelle "'.$sIdPar.'" n\'existe pas dans les données Majic.';
				$this->sStatus=1;
			}else{
				$this->sStatus=0;
			}
		}
		$aSuf=$this->get_aSuf($oBD,$sIdPar,$sIdDnupro, $sEncryptedKey, $bAllSuf);
		
		//$this->get_aPosPlu($oBD,$sIdPar);
		if ($this->aPosPlu==""){
			$this->aObjects=$this->aSuf;
		}else{
			$this->aObjects=array_merge ($this->aSuf, $this->aPosPlu);
		}
	}

	/**
	* Cette méthode permet de récupérer la liste des objets PosPlu d'une parcelle
	* \param $oBD Objet de connexion PDO_BD
	* \param $sIdPar Identifiant de la parcelle
	* \return Retourne un tableau d'objets PosPlu
	*/
	function get_aPosPlu($oBD,$sIdPar){
		$aPosPlu=array();
		if($this->isEmpty()){
			$this->aPosPlu="";
		}else{
			$sIdParpos = substr($sIdPar,3);
			$sCodCom=$this->get_sCodCom($oBD,$sIdPar);
			$aIdPosPlu=$this->get_aId_PosPlu($oBD,$sIdParpos,$sCodCom);
			foreach($aIdPosPlu as $sIdPosPlu){
				array_push($this->aPosPlu, new Mj_PosPlu($oBD,$sIdPosPlu, $sIdParpos,$sCodCom));
			}
		}
		return $aPosPlu;
	}
	
	function get_aId_PosPlu($oBD,$sIdPar,$sCodCom){
		include $this->sRessourcesFile;
		$aIdPosPlu=array();
		$this->sSql=$aSql[$oBD->sgbd]['get_id_pos_plu'];
		$this->sSql=str_replace('$sIdPar',$sIdPar,$this->sSql);
		$this->sSql=str_replace('$sCodCom',$sCodCom,$this->sSql);
		$oPDOresult=$oBD->execute($this->sSql);
		if ($oBD->enErreur()){
			$this->sStatus=1;
			$this->sMessage=$oBD->getBDMessage();
		}else{
			while($aResultFetch=$oBD->tableauSuivant ($oPDOresult)){
				
				array_push($aIdPosPlu,$aResultFetch[0]);
				$this->sStatus=0;
			}
		}
		return $aIdPosPlu;
	}
	/**
	* Cette méthode permet de récupérer le CodCom en fonction d'un Id_Par donné
	* \param $oBD Objet de connexion PDO_BD
	* \param $sIdPar Identifiant de la parcelle
	* \return Retourne une chaîne de caractères
	*/
	function get_sCodCom($oBD,$sIdPar){
		include $this->sRessourcesFile;
		$aCodCom=array();
		$this->sSql=$aSql[$oBD->sgbd]['get_codcom'];
		$this->sSql=str_replace('$sIdPar',$sIdPar,$this->sSql);
		$oPDOresult=$oBD->execute($this->sSql);
		if ($oBD->enErreur()){
			$this->sStatus=1;
			$this->sMessage=$oBD->getBDMessage();
		}else{
			while($aResultFetch=$oBD->tableauSuivant ($oPDOresult)){
				array_push($aCodCom,$aResultFetch[0]);
				$this->sStatus=0;
			}
		}
		$sCodCom=$aCodCom[0];
		return $sCodCom;
	}

	/**
	* Cette méthode permet de récupérer la liste des objets Suf d'une parcelle
	* \param $oBD Objet de connexion PDO_BD
	* \param $sIdPar Identifiant de la parcelle
	* \param $sIdDnupro Identifiant du propriétaire
	* \return Retourne un tableau d'objets Suf
	*/
	function get_aSuf($oBD,$sIdPar,$sIdDnupro,$sEncryptedKey='',$bAllSuf){
		if($this->isEmpty()){
			$this->aSuf="";
		}else{
			$aIdSuf=$this->get_aId_Suf($oBD,$sIdPar,$sIdDnupro);
			foreach($aIdSuf as $sIdSuf){
				array_push($this->aSuf,new Mj_Suf($oBD,$sIdSuf,$sIdDnupro,$sEncryptedKey,$bAllSuf));
			}
		}
		return $aSuf;
	}
	/**
	* Cette méthode permet de récupérer les Id_Suf en fonction d'un Id_Par donné
	* \param $oBD Objet de connexion PDO_BD
	* \param $sIdPar Identifiant de la parcelle
	* \param $sIdDnupro Identifiant du propriétaire
	* \return Retourne un tableau de chaînes de caractères
	*/
	function get_aId_Suf($oBD,$sIdPar,$sIdDnupro){
		include $this->sRessourcesFile;
		$aIdSuf=array();
		$this->sSql=$aSql[$oBD->sgbd]['get_id_suf'];
		$this->sSql=str_replace('sIdPar',$sIdPar,$this->sSql);
		$this->sSql=str_replace('sIdDnupro',$sIdDnupro,$this->sSql);
		$this->sSql=str_replace('sDnupro',substr($sIdDnupro,5),$this->sSql);
		$oPDOresult=$oBD->execute($this->sSql);
		if ($oBD->enErreur()){
			$this->sStatus=1;
			$this->sMessage=$oBD->getBDMessage();
		}else{
			while($aResultFetch=$oBD->tableauSuivant ($oPDOresult)){
				array_push($aIdSuf,$aResultFetch[0]);
				$this->sStatus=0;
			}
		}
		return $aIdSuf;
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
			$aExportFields['dateheure']=date("d/m/Y")." a ".date("H:m");
			$aExportFields['idpar']=$this->aFields['id_par'];
			$aExportFields['date']=$this->getJdatat();
			$aExportFields['section']=$this->aFields['ccosec'];
			$aExportFields['num_plan']=$this->aFields['dnupla'];
			$aExportFields['num_parc']=$this->getNumeroParcelle();
			$aExportFields['num_voirie']=$this->getNumeroVoirie();
			$aExportFields['adresse']=$this->getAdresseParcelle();
			$aExportFields['code_rivoli']=$this->aFields['ccoriv'];
			$aExportFields['num_parc_prim']=$this->aFields['dparpi'];
			$aExportFields['fp_dp']=$this->aFields['gparnf'];
			
			if($this->aFields['gurbpa'] == "U" ) {
				$aExportFields['gurbpa'] = "Oui";
			}else{
				$aExportFields['gurbpa'] = "Non";
			}

			if($this->aFields['gparbat'] == "" || $this->aFields['gparbat'] == "0") {
				$aExportFields['gparbat'] = "Non";
			}else{
				$aExportFields['gparbat'] = "Oui";
			}
			$aExportFields['typevoie']=$this->aFields['typevoie'];
			if ($this->aFields['typevoie'] == "3" ) {
				$aExportFields['lieudit']=$this->getAdresseParcelle();
			}else{
				$aExportFields['lieudit']="";
			}

			$aExportFields['surface']=$this->aFields['dcntpa'];
			$aExportFields['dnupro']=$this->aFields['dnupro'];
			$aExportFields['s_tar']=$this->getSTar();
			$aExportFields['suf']=$this->getSuf();
			$aExportFields['grss_gr']=$this->getGrssGr();
			$aExportFields['clas']=$this->getClas();
			$aExportFields['nat_cult']=$this->getNatCult();
			$iContenance = $this->getContenance ();
			$aExportFields['ha']=intval($iContenance/10000);
			if ($aExportFields['ha'] == 0) {
				$aExportFields['ha']= ' ';
			}
			$aExportFields['a']=intval(($iContenance%10000)/100);
			$sContenanceA=$aExportFields['a'];
			$sContenanceA=strval($sContenanceA);
			$sTlenA=strlen($sContenanceA);
			if ($aExportFields['ha'] == ' ' and $aExportFields['a'] == 0){
				$aExportFields['a']= ' ';
			}else{
				if ($aExportFields['ha'] == ' ' and $sTlenA == 2 and (substr($aExportFields['a'],0,1)== 0)) {
					$sDeuxiemeValeur= substr($aExportFields['a'],1,1);
					$aExportFields['a']= ' '.$sDeuxiemeValeur;
				} else {
					if ($aExportFields['ha'] != ' ' and $sTlenA == 1) {
						$aExportFields['a']= '0'.$aExportFields['a'];
					}
				}
			}
			$aExportFields['ca']=$iContenance%100;
			$sContenanceCa=$aExportFields['ca'];
			$sContenanceCa= strval($sContenanceCa);
			$sTlen=strlen($sContenanceCa);
			if ($aExportFields['a'] != 0)
				if ($sTlen == 1) {
					$aExportFields['ca']= '0'.$aExportFields['ca'];
				}
			$aExportFields['revenu_cadastral_avec_exo']=$this->getRevenuCadastralAvecExo();
			$aExportFields['revenu_cadastral_com_avec_exo']=$this->getRevenuCadastralComAvecExo();
			$aExportFields['revenu_cadastral_dep_avec_exo']=$this->getRevenuCadastralDepAvecExo();
			$aExportFields['revenu_cadastral_reg_avec_exo']=$this->getRevenuCadastralRegAvecExo();
			$aExportFields['revenu_cadastral']=$this->getRevenuCadastral();
			$aExportFields['revenu_cadastral_txt']=$this->setFloatToText($this->getRevenuCadastral());
			$aExportFields['revenu_reference']=$this->getRevenuReference();
			$aExportFields['revenu_reference_txt']=$this->setFloatToText($this->getRevenuReference());
			//$aExportFields['nat_exo']=$this->getNatExo();
			$aExportFields['contenance']=$iContenance;
		}
		return $aExportFields;
	}
	/**
	* Cette méthode permet d'avoir l'attribut dnupla sur 4 caractères.
	* \return Retourne une chaîne de caractères.
	*/
	function getNumeroParcelle(){
		if(strlen($this->aFields['dnupla']) == 1){
			return "000".$this->aFields['dnupla'];
		}
		if(strlen($this->aFields['dnupla']) == 2){
			return "00".$this->aFields['dnupla'];
		}
		if(strlen($this->aFields['dnupla']) == 3){
			return "0".$this->aFields['dnupla'];
		}
		if(strlen($this->aFields['dnupla']) == 4){
			return $this->aFields['dnupla'];
		}
		
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
	* Cette méthode permet de concaténer les attributs dnvoiri et indic.
	* \return Retourne une chaîne de caractères.
	*/
	function getNumeroVoirie(){
		$sNumeroVoirie = ltrim($this->aFields['dnvoiri'],'0').$this->aFields['dindic'];
		return $sNumeroVoirie;
	}
	/**
	* Cette méthode permet de concaténer les attributs cconvo et dvoilib.
	* \return Retourne une chaîne de caractères.
	*/
	function getAdresseParcelle(){
		$sAdresseParcelle = rtrim($this->aFields['cconvo'])." ".rtrim($this->aFields['dvoilib']);
		return $sAdresseParcelle;
	}
	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 's_tar' dans le tableau aSuf.
	* \return Retourne une chaîne de caractères.
	*/
	function getSTar(){
		if(count($this->aSuf)==1) {
			return $this->aSuf[0]->aFields['ccostn'];
		} else {
			return '';
		}
	}
	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 'suf' dans le tableau aSuf.
	* \return Retourne une chaîne de caractères.
	*/
	function getSuf(){
		if(count($this->aSuf)==1) {
			return $this->aSuf[0]->aFields['ccosub'];
		}else {
			return '';
		}
	}
	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 'grss_gr' dans le tableau aSuf.
	* \return Retourne une chaîne de caractères.
	*/
	function getGrssGr(){
		if(count($this->aSuf)==1) {
			return $this->aSuf[0]->aFields['dsgrpf'];
		}else {
			return '';
		}
	}
	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 'clas' dans le tableau aSuf.
	* \return Retourne une chaîne de caractères.
	*/
	function getClas(){
		if(count($this->aSuf)==1) {
			return $this->aSuf[0]->aFields['dclssf'];
		}else {
			return '';
		}
	}
	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 'nat_cult' dans le tableau aSuf.
	* \return Retourne une chaîne de caractères.
	*/
	function getNatCult(){
		if(count($this->aSuf)==1) {
			return $this->aSuf[0]->aFields['cnatsp'];
		}else {
			return '';
		}
	}
	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 'revenu cadastral' dans le tableau aSuf.
	* \return Retourne un nombre réel (float).
	*/
	function getRevenuCadastral(){
		$fRevenuCadastral = 0;
	  	foreach ($this->aSuf as $oSuf) {
	    	$fRevenuCadastral = $fRevenuCadastral + (float) $oSuf->getRevenuCadastral();
		} 
		return $fRevenuCadastral;
	}
	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 'revenu reference' dans le tableau aSuf.
	* \return Retourne un nombre réel (float).
	*/
	function getRevenuReference(){
		$fRevenuReference = 0;
		foreach ($this->aSuf as $oSuf) {
			$fRevenuReference = $fRevenuReference + (float) $oSuf->getRevenuReference();
		} 
		return $fRevenuReference;
	}
	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 'revenu cadastral' pour des parcelles avec exonération dans le tableau aSuf.
	* \return Retourne un nombre réel (float).
	*/
	function getRevenuCadastralAvecExo(){
		$fRevenuCadastralAvecExo = 0;
		foreach ($this->aSuf as $oSuf) {
			if(preg_match ("/TA/", $oSuf->getNatExo())){
				$fRevenuCadastralAvecExo = $fRevenuCadastralAvecExo + (float) $oSuf->getRevenuCadastral();
			}
		} 
		return $fRevenuCadastralAvecExo;
	}

	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 'revenu cadastral' pour des parcelles avec exonération dans le tableau aSuf.
	* lorsque l'exoneration est procuré par une commune, un groupement de commune ou toutes collectivité
	* \return Retourne un nombre réel (float).
	*/
	function getRevenuCadastralComAvecExo(){
		$fRevenuCadastralComAvecExo = 0;
		foreach ($this->aSuf as $oSuf) {
			if(preg_match("/EP/", $oSuf->aFields['gnexps']) or preg_match("/CD/", $oSuf->aFields['gnexps']) or preg_match("/CR/", $oSuf->aFields['gnexps']) or preg_match("/NI/", $oSuf->aFields['gnexps']) or preg_match("/RT/", $oSuf->aFields['gnexps'])){
				$fRevenuCadastralComAvecExo = $fRevenuCadastralComAvecExo + (float) $oSuf->getRevenuCadastral();
			} else {
				if($oSuf->getCcolloc("C") == true) {
					$fRevenuCadastralComExo = $oSuf->getRevenuCadastralExo("C");
					$fRevenuCadastralComAvecExo = $fRevenuCadastralComAvecExo + (float) $fRevenuCadastralComExo;
				} else {
					if($oSuf->getCcolloc("TC") == true) {
						$fRevenuCadastralComExo = $oSuf->getRevenuCadastralExo("TC");
						$fRevenuCadastralComAvecExo = $fRevenuCadastralComAvecExo + (float) $fRevenuCadastralComExo;
					} else {
						if($oSuf->getCcolloc("GC") == true) {
							$fRevenuCadastralComExo = $oSuf->getRevenuCadastralExo("GC");
					    	$fRevenuCadastralComAvecExo = $fRevenuCadastralComAvecExo + (float) $fRevenuCadastralComExo;
						}
					}
				}
			}
		}
		return $fRevenuCadastralComAvecExo;
	}
	
	function getRevenuCadastralTaxeADAvecExo(){
		$fRevenuCadastralTaxeADAvecExo = 0;
		foreach ($this->aSuf as $oSuf) {
			if(preg_match("/EP/", $oSuf->aFields['gnexps']) or preg_match("/CD/", $oSuf->aFields['gnexps']) or preg_match("/CR/", $oSuf->aFields['gnexps']) or preg_match("/NI/", $oSuf->aFields['gnexps']) or preg_match("/RT/", $oSuf->aFields['gnexps'])){
				$fRevenuCadastralTaxeADAvecExo = $fRevenuCadastralTaxeADAvecExo + (float) $oSuf->getRevenuCadastral();
			} else {
				if($oSuf->getCcolloc("A") == true) {
					
					$fRevenuCadastralTaxeADExo = $oSuf->getRevenuCadastralExo("A");
					
					$fRevenuCadastralTaxeADAvecExo = $fRevenuCadastralTaxeADAvecExo + (float) $fRevenuCadastralTaxeADExo;
				}
			}
		}
		return $fRevenuCadastralTaxeADAvecExo;
	}
	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 'revenu cadastral' pour des parcelles avec exonération dans le tableau aSuf.
	* lorsque l'exoneration est procuré par le département ou toutes collectivité
	* \return Retourne un nombre réel (float).
	*/
	function getRevenuCadastralDepAvecExo(){
		$fRevenuCadastralDepAvecExo = 0;
		foreach ($this->aSuf as $oSuf) {
			if(preg_match("/EP/", $oSuf->aFields['gnexps']) or preg_match("/CD/", $oSuf->aFields['gnexps']) or preg_match("/DR/", $oSuf->aFields['gnexps']) or preg_match("/NI/", $oSuf->aFields['gnexps']) or preg_match("/RT/", $oSuf->aFields['gnexps'])){
				$fRevenuCadastralDepAvecExo = $fRevenuCadastralDepAvecExo + (float) $oSuf->getRevenuCadastral();
			} else {
				if($oSuf->getCcolloc("D") == true) {
					$fRevenuCadastralDepExo = $oSuf->getRevenuCadastralExo("D");
					$fRevenuCadastralDepAvecExo = $fRevenuCadastralDepAvecExo + (float) $fRevenuCadastralDepExo;
				} else {
					if($oSuf->getCcolloc("TC") == true) {
						$fRevenuCadastralDepExo = $oSuf->getRevenuCadastralExo("TC");
						$fRevenuCadastralDepAvecExo = $fRevenuCadastralDepAvecExo + (float) $fRevenuCadastralDepExo;
					}
				}
			}
		}
		return $fRevenuCadastralDepAvecExo;
	}
	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 'revenu cadastral' pour des parcelles avec exonération dans le tableau aSuf.
	* lorsque l'exoneration est procuré par la région ou toutes collectivité
	* \return Retourne un nombre réel (float).
	*/
	function getRevenuCadastralRegAvecExo(){
		$fRevenuCadastralRegAvecExo = 0;
		foreach ($this->aSuf as $oSuf) {
			if(preg_match("/EP/", $oSuf->aFields['gnexps']) or preg_match("/DR/", $oSuf->aFields['gnexps']) or preg_match("/CR/", $oSuf->aFields['gnexps']) or preg_match("/NI/", $oSuf->aFields['gnexps']) or preg_match("/RT/", $oSuf->aFields['gnexps'])){
				$fRevenuCadastralRegAvecExo = $fRevenuCadastralRegAvecExo + (float) $oSuf->getRevenuCadastral();
			} else {
				if($oSuf->getCcolloc("R") == true) {
					$fRevenuCadastralRegExo = $oSuf->getRevenuCadastralExo("R");
					$fRevenuCadastralRegAvecExo = $fRevenuCadastralRegAvecExo + (float) $fRevenuCadastralRegExo;
				} else {
					if($oSuf->getCcolloc("TC") == true) {
						$fRevenuCadastralRegExo = $oSuf->getRevenuCadastralExo("TC");
						$fRevenuCadastralRegAvecExo = $fRevenuCadastralRegAvecExo + (float) $fRevenuCadastralRegExo;
					}
				}
			}
		}
		return $fRevenuCadastralRegAvecExo;
	}
	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 'contenance' pour des parcelles avec exonération dans le tableau aSuf.
	* \return Retourne un entier.
	*/
	function getContenance (){
		$iContenance=0;
		foreach($this->aSuf as $oSuf){
			$iContenance=$iContenance+$oSuf->getContenance();
		}
		return $iContenance;
	}
	
	/**
	* Cette méthode permet de récupérer l'ensemble des emprises de la parcelles à partir des properties de la fiche d'urbanisme
	* \return 
	*/
	function getEmprises($aProperties,$oBD,$sLayerTypeParcelle) {
		// boucler sur toutes les couches à intersecter
		if(isset($aProperties["cadastre"]["fiche_urb"]["intersect"]["views"])) {
			foreach($aProperties["cadastre"]["fiche_urb"]["intersect"]["views"] as $sView => $aViewValue) {
				$oEmprises = new Mj_Emprises($oBD,$this->aFields['id_par'],$sView, $aProperties["cadastre"]["fiche_urb"]["intersect"]["tolerance"], $aViewValue, $sLayerTypeParcelle);				
				array_push($this->aIntersect,$oEmprises);
			}
		}
		// calcule de l'emprise du bati
		$sViewBati=$aProperties["cadastre"]["view"]["bati"];
		if(isset($aProperties["cadastre"]["view"]["bati"])){
			$aField["type"]="POLYGON";
			$aField["title"]="Emprise Bati";
			$oEmprises = new Mj_Emprises($oBD,$this->aFields['id_par'],$sViewBati,$aProperties["cadastre"]["fiche_urb"]["intersect"]["tolerance"], $aField, $sLayerTypeParcelle);
			array_push($this->aIntersect,$oEmprises);
		}
		$this->aObjects=array_merge($this->aObjects,$this->aIntersect);
	}

	/**
	* Cette méthode permet de récupérer la valeur de l'attribut 'nat_exo' dans le tableau aSuf.
	* \return Retourne une chaîne de caractères.
	*
	*/
	/*function getNatExo(){
		if(count($this->aSuf)==1) {
			return $this->aSuf[0]->getNatExo();
		} else{
			return '';
		}
	}*/
	/**
	* Cette méthode permet de formater un décimal pour l'affichage.
	* \return Retourne une chaine
	*/
	function setFloatToText($fFloat){
		return number_format($fFloat,2,'.','');
	}
}

?>
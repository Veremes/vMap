<?php
	header('Content-Type: text/html; charset=UTF-8;');
	// require_once("../properties.inc");
        require_once(__DIR__.'/vmlib/phpUtil.inc');
        require_once(__DIR__.'/vmlib/logUtil.inc');
        require_once(__DIR__.'/vmlib/cryptUtil.inc');
class Ldap {

    // Tableau des informations de l'AD
    public $aLdap = array();
	public $userprincipalname = '';
	private $sDcLdap = '';
	
    public function __construct($sLdap) {
		$this->aLdap = unserialize($sLdap);
		$aTmp = explode('.',$this->aLdap['sLdapName']);
		foreach($aTmp as $sDomain){
			if($this->sDcLdap=="")
				$this->sDcLdap .= "dc=".$sDomain;
			else
				$this->sDcLdap .= ",dc=".$sDomain;
		}

		if($this->aLdap['sType'] == 'AD')
			$this->userprincipalname = 'userprincipalname';
		else
			$this->userprincipalname = 'uid';
    }
	
	 /*
     * Permet la connexion au serveur AD
     */
	public function connectLdap(){
		$sLdapConn = ldap_connect($this->aLdap['sServer'], $this->aLdap['sPort']) or die(writeToErrorLog("Could not connect to LDAP server."));
		if ($sLdapConn) { // Si la connexion s'est bien déroulée
			ldap_set_option($sLdapConn, LDAP_OPT_PROTOCOL_VERSION, 3);
			ldap_set_option($sLdapConn, LDAP_OPT_REFERRALS, 0);
			//Authentification	
			$sPwdLdap =utf8_encode(trim(des (rtrim(utf8_decode($this->aLdap['sLoginLdap'])), hexToString(rtrim($this->aLdap['sPwdLdap'])), 0, 0, null)));
			$sLoginLdap = mb_strtolower($this->aLdap['sLoginLdap'], 'UTF-8');
			$sLoginLdap = str_replace(array('à', 'â', 'ä', 'á', 'ã', 'å','î', 'ï', 'ì', 'í', 'ô', 'ö', 'ò', 'ó', 'õ', 'ø', 'ù', 'û', 'ü', 'ú', 'é', 'è', 'ê', 'ë', 'ç', 'ÿ', 'ñ'), array('a', 'a', 'a', 'a', 'a', 'a', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o',  'u', 'u', 'u', 'u', 'e', 'e', 'e', 'e', 'c', 'y', 'n', ), $sLoginLdap);
			$sLdapBind = ldap_bind($sLdapConn,$sLoginLdap,$sPwdLdap);
			return $sLdapConn;
		}
		return "Could not connect to LDAP server.";
	}
	
	/*
     * Permet la déconnexion au serveur AD
     */
	public function closeLdap($sLdapConn) {      
		ldap_close($sLdapConn);
	}
    /**
     * Retourne la liste des OU du noeud
     */

	 public function getOU($sLdapConn, $sDn) {
		$sFilter = "(|(objectclass=organizationalUnit)(objectClass=container))";
		$aOUList = array();
		
		if($sDn == null){
			if($this->aLdap['sDnResearch'] == 'null'){
				$sDn = $this->sDcLdap;
			}else{
				$sDn = $this->aLdap['sDnResearch'].",".$this->sDcLdap;
				$aOUList[] = $sDn;
				return $aOUList;
			}
		}
		$oSearch= ldap_list($sLdapConn, $sDn, $sFilter);
		$aInfo = ldap_get_entries($sLdapConn, $oSearch);
		$i=0;
		for ($i=0;$i<$aInfo['count'];$i++) {
			$aOUList[] = $aInfo[$i]['dn'];
		}
		natcasesort($aOUList);
		
        return $aOUList;
    }

    /**
     * Retourne la liste des utilisateurs du noeud
     */
    public function getUsers($sLdapConn, $sDn) {
		$sFilter = "objectclass=person";
		$aUserList = array();
		$oSearch= ldap_list($sLdapConn, $sDn, $sFilter);
		$aInfo = ldap_get_entries($sLdapConn, $oSearch);
		$i=0;
		for ($i=0;$i<$aInfo['count'];$i++) {
			//company et department non tester sur openldap car pas de données pour ses attibuts
			if($aInfo[$i][$this->userprincipalname][0]!='') {
				$aUser = array('userprincipalname'=>'', 'displayname'=>'', 'email'=>'', 'company'=>'', 'department'=>'');
                                if (!empty($aInfo[$i][$this->userprincipalname]))
                                    $aUser['userprincipalname'] = $aInfo[$i][$this->userprincipalname][0];
                                if (!empty($aInfo[$i]['cn']))
                                    $aUser['displayname'] = $aInfo[$i]['cn'][0];
                                if (!empty($aInfo[$i]['mail']))
                                    $aUser['email'] = $aInfo[$i]['mail'][0];
                                if (!empty($aInfo[$i]['company']))
                                    $aUser['company'] = $aInfo[$i]['company'][0];
                                if (!empty($aInfo[$i]['department']))
                                    $aUser['department'] = $aInfo[$i]['department'][0];
				$aUserList[] = $aUser;
                        }
		}

		if(count($aUserList)>1){
			// Permet de trier le tableau par rapport à "displayname" (insensible à la casse)
			foreach ($aUserList as $key => $row)
				$displayname[$key]  = strtolower($row['displayname']);
			array_multisort($displayname, $aUserList);
		}

        return $aUserList;
	}
	function explode_dn($dn, $with_attributes=0) {
		$result = ldap_explode_dn($dn, $with_attributes);
		//translate hex code into ascii again
		foreach($result as $key => $value) $result[$key] = preg_replace("/\\\([0-9A-Fa-f]{2})/e", "''.chr(hexdec('\\1')).''", $value);
		return $result;
	}
	
	 public function getCriteria($sLdapConn, $sDn, $sFilter, $sObject) {
		$aUserList = array();
		$oSearch= ldap_search($sLdapConn, $sDn, $sFilter);
		$aInfo = ldap_get_entries($sLdapConn, $oSearch);
		$i=0;
		for ($i=0;$i<$aInfo['count'];$i++) {
			if ($sObject == "person"){
				if($aInfo[$i][$this->userprincipalname][0]!='') {
                                    $aUser = array('userprincipalname'=>'', 'displayname'=>'', 'email'=>'', 'company'=>'', 'department'=>'');
                                    if (!empty($aInfo[$i][$this->userprincipalname]))
                                        $aUser['userprincipalname'] = $aInfo[$i][$this->userprincipalname][0];
                                    if (!empty($aInfo[$i]['cn']))
                                        $aUser['displayname'] = $aInfo[$i]['cn'][0];
                                    if (!empty($aInfo[$i]['mail']))
                                        $aUser['email'] = $aInfo[$i]['mail'][0];
                                    if (!empty($aInfo[$i]['company']))
                                        $aUser['company'] = $aInfo[$i]['company'][0];
                                    if (!empty($aInfo[$i]['department']))
                                        $aUser['department'] = $aInfo[$i]['department'][0];
                                    $aUserList[] = $aUser;
                                }
			}else{
				$aUserList[] = array('name'=>$aInfo[$i]['name'][0]);
			}
		}

		if(count($aUserList)>1){
			if ($sObject == "person"){
				// Permet de trier le tableau par rapport à "displayname" (insensible à la casse)
				foreach ($aUserList as $key => $row)
					$displayname[$key]  = strtolower($row['displayname']);
				array_multisort($displayname, $aUserList);
			}else{
				// Permet de trier le tableau par rapport à "name" (insensible à la casse)
				foreach ($aUserList as $key => $row)
                                    if (!empty($row['cn']))
					$name[$key]  = strtolower($row['cn']);
                                if (!empty($name))
                                    array_multisort($name, $aUserList);
			}
		}

        return $aUserList;
	}
	
	function get_members($sLdapConn, $sDn, $group, $sLogin, $sDepartment) {
		$results = ldap_search($sLdapConn,$sDn, "cn=" . $group);
		$member_list = ldap_get_entries($sLdapConn, $results);
		$dirty = 0;
		$aUserList = array();
		if(count($member_list[0]['member'])>0){
			foreach($member_list[0]['member'] as $member) {
				if($dirty == 0) {
					$dirty = 1;
				} else {
					$member_dn = $this->explode_dn($member);
					$member_cn = str_ireplace("cn=","",$member_dn[0]);
					$member_search = ldap_search($sLdapConn,$sDn, "(cn=" . $member_cn . ")");
					$member_details = ldap_get_entries($sLdapConn, $member_search);
					$bGet = true;
					if ($sLogin != ""){
						if (!($this->startsWith($member_details[0][$this->userprincipalname][0],$sLogin))){
							$bGet = false;
						}
					}
					if ($sDepartment != ""){
						if (!($this->startsWith($member_details[0]['department'][0],$sDepartment))){
							$bGet = false;
						}
					}
					if ($bGet){
						$aUserList[] = array('userprincipalname'=>$member_details[0][$this->userprincipalname][0], 'displayname'=>$member_details[0]['cn'][0], 'email'=>$member_details[0]['mail'][0], 'company'=>$member_details[0]['company'][0], 'department'=>$member_details[0]['department'][0]);
					}
				}
			}
		}
		return $aUserList;
	}
	
	function startsWith($haystack, $needle)	{
		return $needle === "" || strpos($haystack, $needle) === 0;
	}
	
	public function getGroups($sLdapConn, $sDn) {
		$sFilter = "(&(|(objectClass=groupOfNames)(objectClass=groupOfUniqueNames)(objectClass=group))(!(objectClass=person)))";
		$aGroupList = array();
		$oSearch= ldap_list($sLdapConn, $sDn, $sFilter);
		$aInfo = ldap_get_entries($sLdapConn, $oSearch);
		$i=0;
		for ($i=0;$i<$aInfo['count'];$i++) {
			if($aInfo[$i]['cn'][0]!='')
				$aGroupList[] = array('name'=>$aInfo[$i]['cn'][0]);
		}

		if(count($aGroupList)>1){
			// Permet de trier le tableau par rapport à "name" (insensible à la casse)
			foreach ($aGroupList as $key => $row)
                            if (!empty($row['cn']))
				$name[$key]  = strtolower($row['cn']);
                        if (!empty($name))
                            array_multisort($name, $aGroupList);
		}

        return $aGroupList;
	}
	
	public function getGroupInfo($sLdapConn, $sDn,  $group) {
		$sFilter = '(&(objectClass=group)(name='.$group.'))';
		//Recherche de la personne dans l'AD
		$oSearch = ldap_search($sLdapConn, $sDn, $sFilter);	
		$aInfo = ldap_first_entry($sLdapConn, $oSearch);
		$objectSid = ldap_get_values($sLdapConn,$aInfo,"objectSid"); 
		$hex_Sid= $this->getTextSID($objectSid[0]);
		//Récupération des autres groupes de l'utilisateur
		$aPrimaryGroupId = explode('-',$hex_Sid);
		$iPrimaryGroupId = $aPrimaryGroupId[count($aPrimaryGroupId) - 1];
		return $iPrimaryGroupId;
	}

	/*
	*	Retourne les groupes de l'utilisateur
	*/
	function getGroup($sLdapConn, $userprincipalname){
		if($this->aLdap['sType'] == 'AD')
			$sFilter = "userprincipalname=".$userprincipalname;
		else
			$sFilter = "(&(|(objectClass=groupOfNames)(objectClass=groupOfUniqueNames))(member=".$sDn."))";
		
		$aGroupList = array();
		//Recherche de la personne dans l'AD
		if($this->aLdap['sDnResearch'] == '')
			$sDn = $this->sDcLdap;
		else
			$sDn = $this->aLdap['sDnResearch'].",".$this->sDcLdap;

		$oSearch = ldap_search($sLdapConn, $sDn, $sFilter);	
		$aInfo = ldap_get_entries($sLdapConn, $oSearch);
		if($this->aLdap['sType'] == 'AD'){
			//Récupération de son groupe principal
			$aGroupList[] = $this->getPrimaryGroup($sLdapConn,$aInfo[0]["primarygroupid"][0], $aInfo[0]["objectsid"][0]);
			//Récupération des autres groupes de l'utilisateur
			if(!empty($aInfo[0]["memberof"])){
				foreach ($aInfo[0]["memberof"] as $sGroup){
					$sGroup = explode(',',$sGroup);
					$aGroupList[] = substr($sGroup[0],3); 
				}
			}
		}else{
			foreach ($aInfo as $aGroupInfo){
				$aGroupList[] = $aGroupInfo["cn"][0];
			}
		}
		natcasesort($aGroupList);
		return $aGroupList;
	}

	/*
	*	Retourne le DN d'une personne à partir de son uid
	*/
	function getDN($sLdapConn, $sUid){
		$sFilter = $this->userprincipalname."=".$sUid;
		$sDn = "dc=cpa,dc=fr";
		$oSearch = ldap_search($sLdapConn, $sDn, $sFilter);
		$aInfo = ldap_get_entries($sLdapConn, $oSearch);
		return $aInfo[0]["dn"];
	}

	/*
	*	Retourne le groupe principal de l'utilisateur
	*/
	function getPrimaryGroup($sLdapConn, $iGid, $sUsersId){
		if ($iGid === NULL || $sUsersId === NULL) { return false; }
		$oSearch = false;
		//Plusieurs calculs pour retrouver les sid du groupe principal
		$sGsid = substr_replace($sUsersId, pack('V',$iGid), strlen($sUsersId)-4,4);
		
		$sFilter = '(&(objectClass=group)(objectsid='.$this->getTextSID($sGsid).'))';
		
		// Recherche sur le serveur du SID du groupe
		// if($this->aLdap['sDnResearch'] == ''){
			$sDn = $this->sDcLdap;
		// }
		// else{
			// $sDn = $this->aLdap['sDnResearch'].",".$this->sDcLdap;
		// }
		
		$oSearch= ldap_search($sLdapConn, $sDn, $sFilter);
		$aInfo = ldap_get_entries($sLdapConn, $oSearch);
		if (isset($aInfo[0]['name'][0])) {
			return $aInfo[0]['name'][0];
		}
		return false;
    }	
	 
	/*
	*	Les 2 fonctions suivantes servent à calculer le SID du groupe principal
	*/	
	function getTextSID($binsid){
		$hex_sid = bin2hex($binsid);
		$rev = hexdec(substr($hex_sid, 0, 2));
		$subcount = hexdec(substr($hex_sid, 2, 2));
		$auth = hexdec(substr($hex_sid, 4, 12));
		$result = "$rev-$auth";
		for ($x=0;$x < $subcount; $x++) {
			$subauth[$x] = hexdec($this->littleEndian(substr($hex_sid, 16 + ($x * 8), 8)));
			$result .= "-" . $subauth[$x];
		}
		return 'S-' . $result;
	 }
	function littleEndian($hex){
		$result = '';
		for ($x = strlen($hex) - 2; $x >= 0; $x = $x - 2) {
			$result .= substr($hex, $x, 2);
		} 
		return $result;
	 }	 

	function getDcLdap(){
		return $this->sDcLdap;
	 }	 
         
}
?>
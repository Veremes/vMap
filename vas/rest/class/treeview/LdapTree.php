<?php
/*
require_once("../../properties.inc");
require_once("vmlib/phpUtil.inc");
require_once("vmlib/logUtil.inc");
*/
// a class to show OU LDAP based aciTree

class LdapTree extends Tree {
    private $oLdap = null;
    public function __construct(Ldap $oLdap) {
        $this->Ldap = $oLdap;
    }
	 
    public function branch($sParentId = null) {
		$aBranch = array();
		$sLdapConn = $this->Ldap->connectLdap();
        if($sLdapConn){
			$aOUList = $this->Ldap->getOU($sLdapConn, $sParentId);
			// R�cup�ration du nom de dossier
			foreach ($aOUList as $sOU) {
				if(substr($sOU, 0, 3)!="DC=")
				{
					$aOU = explode(",",$sOU);
					$aBranch[$sOU] = "<a href=\"javascript: document.getElementById('stat_import_ad').style.display='none'; loadDirectoryUsers ('".$sOU."', document.getElementById('sLdap').value); \">".$aOU[0]."</a>";
				}
				else
					$aBranch[$sOU] = $sOU;
			}
			$this->Ldap->closeLdap($sLdapConn);
			return $aBranch;
		}
    }

    /*
     * $itemId will be the path to the file/folder.
     */
    public function itemProps($itemId) {
            return array_merge(parent::itemProps($itemId), array(
                        'isFolder' => true,
                        'icon' => 'folder',
                        'random' => mt_rand(0, 99) // just a random property
                    ));
        return parent::itemProps($itemId);
    }
}
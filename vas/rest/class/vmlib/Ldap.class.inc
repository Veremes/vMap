<?php

/**
 * \file Ldap.class.inc
 * \brief Ldap.class.inc \n \n Ce fichier contient la classe php Ldap.
 * 
 * Cette classe permet de cr�er une connexion � l'annuaire Ldap et contient plusieurs m�thodes (recherche, gestion du message d'erreur).
 *
 * \author Fabien Marty <fabien.marty@veremes.com>
 * \author Nicolas Chazeau <nicolas.chazeau@veremes.com>
 */

/**
 * \class Ldap
 * \brief Ldap Class \n \n Ldap est une classe PHP qui permet de cr�er une connexion � l'annuaire Ldap .
 * 
 * Cette classe permet de cr�er une connexion � l'annuaire Ldap et contient plusieurs m�thodes (recherche, gestion du message d'erreur).
 *
 * \author Fabien Marty <fabien.marty@veremes.com>
 * \author Nicolas Chazeau <nicolas.chazeau@veremes.com>
 */
class Ldap {
    /*
     * Variable globale stockant le nom de dossier lib.
     */

    var $sFolderLib = "vmlib";

    /**
     * Objet connexion en cours au serveur.
     */
    var $oConnexion;

    /**
     * Message � afficher.
     */
    var $sMessage = "";

    /**
     * Bool�en, permet de savoir si une erreur � �t� rencontr�e.
     */
    var $bErreurRencontree = false;

    /**
     * Identifiant de l'utilisateur.
     */
    var $sLogin;
    var $lang;

    /**
     * \param $sLogin Identifiant de l'utilisateur.
     * \param $sMotDePasse Mot de passe de l'utilisateur.
     * \param $sDomaine Nom de domaine.
     * \param $sServeur Nom ou IP du serveur utilis�.
     */
    function Ldap($sLogin, $sMotDePasse, $sDomaine, $sServeur, $sPageEncoding = "ISO-8859-1", $lang = "fr") {
        $this->lang = $lang;
        loadLang($this->sFolderLib, $this->lang);
        $this->sLogin = $sLogin;

        // connecxion au serveur ldap
        $this->oConnexion = ldap_connect($sServeur);
        ldap_set_option($this->oConnexion, LDAP_OPT_PROTOCOL_VERSION, 3);
        if ($this->oConnexion) {
            @$oLdapbind = ldap_bind($this->oConnexion, $sDomaine . "\\" . $sLogin, $sMotDePasse);
            if (!$oLdapbind) {
                //Test utilisateur Active Directory
                $sErrorMessage = ERROR_USER_NOT_FOUND_LDAP;
                $sErrorMessage = $this->setEncodeLdapMessage($sErrorMessage);
                $sErrorMessage = str_replace("[LOGIN]", $this->sLogin, $sErrorMessage);
                $this->setLdapMessage($sErrorMessage);
                $this->bErreurRencontree = true;
            }
        } else {
            //Test connection Active Directory
            $sErrorMessage = ERROR_CONNECT_LDAP;
            $this->bErreurRencontree = true;
            $this->setLdapMessage($sErrorMessage);
        }
    }

    /**
     * M�thodes permettant d'encoder la chaine ISO-8859-1 vers l'encodage du client ($this->sPageEncoding).
     * \param $sMessage Message � encoder.
     * \private
     */
    function setEncodeLdapMessage($sMessage) {
        $sEncodeLdapMessage = iconv("ISO-8859-1", $this->sPageEncoding, $sMessage) . "<br>";
        return $sEncodeLdapMessage;
    }

    /**
     * M�thodes pour valoriser le message � afficher.
     * \param $sMessage Message � afficher.
     * \private
     */
    function setLdapMessage($sMessage) {
        $this->sMessage .= $sMessage . "<br>";
    }

    /**
     * Retourne le messsage � afficher en HTML.
     * \private
     * \return Le message � afficher.
     */
    function getLdapMessage() {
        if ($this->sMessage != "")
            $sResult = USER_LABEL . $this->sLogin . "<br>" . ERROR_LABEL . $this->sMessage;
        else
            $sResult = "";
        return $sResult;
    }

    /**
     * D�connexion.
     */
    function quitter() {
        ldap_close($this->oConnexion);
    }

    /*
     * Recherche sur l'ensemble des niveaux.
     * \param $sBase_dn       La base DN pour le dossier.
     * \param $sFilter        Filtre
     * \param $aAttributes    Un tableau d'attributs requis, e.g. array("mail", "sn", "cn"). 
     * \param $iAttrsOnly     Doit �tre d�fini � 1 si seuls les types des attributs sont demand�s. S'il est d�fini � 0, les types et les valeurs des attributs sont r�cup�r�s, ce qui correspond au comportement par d�faut. 
     * \return l'objet r�sultat de la recherche.
     */

    function search($sBaseDn, $sFilter, $aAttributes, $iAttrsOnly = 0) {
        return ldap_search($this->oConnexion, $sBaseDn, $sFilter, $aAttributes, $iAttrsOnly);
    }

    /*
     * Recherche par niveau.
     * \param $sBaseDn        La base DN pour le dossier.
     * \param $sFilter        Filtre
     * \param $aAttributes    Un tableau d'attributs requis, e.g. array("mail", "sn", "cn"). 
     * \param $iAttrsOnly     Doit �tre d�fini � 1 si seuls les types des attributs sont demand�s. S'il est d�fini � 0, les types et les valeurs des attributs sont r�cup�r�s, ce qui correspond au comportement par d�faut. 
     * \return l'objet r�sultat de la recherche.
     */

    function searchByLevel($sBaseDn, $sFilter, $aAttributes, $iAttrsOnly = 0) {
        if ($aAttributes == array() or $aAttributes == "") {
            return @ldap_list($this->oConnexion, $sBaseDn, $sFilter);
        } else {
            return @ldap_list($this->oConnexion, $sBaseDn, $sFilter, $aAttributes, $iAttrsOnly);
        }
    }

    /*
     * M�thode de lecture d'un objet r�sultat d'une recherche pass� en param�tre.
     * \param $oSearch R�sultat de la recherche
     * \return 
     */

    function getResult($oSearch) {
        return ldap_get_entries($this->oConnexion, $oSearch);
    }

    /*
     * M�thode permettant de compter le nombre d'entr�e d'un objet r�sultat d'une recherche pass� en param�tre.
     * \param $oSearch R�sultat de la recherche
     * \return un entier
     */

    function countResult($oSearch) {
        return ldap_count_entries($this->oConnexion, $oSearch);
    }

    /*
     * M�thode permettant de r�cup�rer les groupe d'un utilisateur Ldap.
     * \param $ldap_serveur Adresse IP du serveur
     * \param $ldap_baseRecherche Base de recherche dans l'Active Directory
     * \param $ldap_userConnexion Utilisateur de l'Active Directory
     * \param $ldap_passwordConnexion Mot de passe de l'utilisateur de l'Active Directory
     * \param $ldap_user Utilisateur de l'Active Directory
     * \param $ldap_attributUtilisateur Attribut LDAP portant le nom de l'utilisateur
     * \param $ldap_attributGroupe Attribut LDAP portant le nom du groupe
     * \return la fin de la clause where
     */

    // FONCTION UTILISEE POUR GTF (projet EDGAR)

    /*
      function whereUserGroup($ldap_serveur,$ldap_baseRecherche,$ldap_userConnexion,$ldap_passwordConnexion,$ldap_user,$ldap_attributUtilisateur,$ldap_attributGroupe, $sUserPrefixe="", $sUserSuffixe="", $oBd="", $sldap_allUserGroup="") {
      define('LDAP_HOST',$ldap_serveur);  // Serveur AD
      define('LDAP_DN',$ldap_baseRecherche);// DN de base pour la recherche

      //Connexion au serveur LDAP
      $ldap = ldap_connect(LDAP_HOST) or die(ERROR_CONNECT_LDAP);

      if ($ldap) {
      if ($oBd!=""){
      $sBaseEncoding=$oBd->getSourceEncoding();
      //Le login ainsi que le mot de passe est encod� dans l'encodage de l'AD du client (encodage en ISO-8859-1) pour permettre de r�cup�rer les groupes de l'utilisateur dans l'AD
      $ldap_userConnexion=iconv($sBaseEncoding,"ISO-8859-1",$ldap_userConnexion);
      $ldap_passwordConnexion=iconv($sBaseEncoding,"ISO-8859-1",$ldap_passwordConnexion);
      $ldap_user=iconv($sBaseEncoding,"ISO-8859-1",$ldap_user);
      }

      //Connexion au serveur LDAP
      $ldapbind = ldap_bind($ldap, $sUserPrefixe.$ldap_userConnexion.$sUserSuffixe, $ldap_passwordConnexion);
      if ($ldapbind) {
      // Une fois connect�, on v�rifie si l'ensemble des utilisateurs de l'AD sont associ� � un ou plusieurs groupes
      //(ex : tous les utilisateurs de l'AD sont associ� au groupe "Domaine User"... comme au cg67)
      $sWhereAllUserGroup="";
      if ($sldap_allUserGroup!=""){
      $aldap_allUserGroup=explode("|",$sldap_allUserGroup);
      $j==0;
      foreach ($aldap_allUserGroup as $sAllUserGroup) {
      if ($j==0){
      $sWhereAllUserGroup="groupe.groupe=SimpleQuote".$sAllUserGroup."SimpleQuote";
      }else{
      $sWhereAllUserGroup.=" or groupe.groupe=SimpleQuote".$sAllUserGroup."SimpleQuote";
      }
      $j++;
      }
      }

      //$ldap_attributUtilisateur est le nom de l'attribut LDAP portant le nom de l'utilisateur
      $filter = "(".$ldap_attributUtilisateur."=".$ldap_user.")";
      //$ldap_attributGroupe est le nom de l'attribut LDAP portant le nom du groupe (il y en a plusieurs, un par groupe)
      $attrs = array($ldap_attributGroupe);
      $result = ldap_search($ldap, LDAP_DN, $filter, $attrs);
      $entries = ldap_get_entries($ldap, $result);

      //Le nom de l'�l�ment du groupe est en minuscule dans le tableau "entries" g�n�r�
      $ldap_attributGroupe=strtolower($ldap_attributGroupe);
      $i=0;
      $bEntreForeach=false;
      $sWhereUserGroup="";
      foreach ($entries[0][$ldap_attributGroupe] as $sMemberOf) {
      $asMemberOf=explode(",",$sMemberOf);
      $asMemberOfGroupe=explode("=",$asMemberOf[0]);
      $sGroupe=$asMemberOfGroupe[1];

      //Quand il est �gal � 0 $asMemberOfGroupe[1] est vide car le 1er �l�ment du tableau "$entries[0]["memberof"]"  correspond au norbre de r�sultat trouv�.
      if ($i==1){
      if ($sWhereAllUserGroup!=""){
      $sWhereUserGroup="and (".$sWhereAllUserGroup." or groupe.groupe=SimpleQuote".$sGroupe."SimpleQuote";
      }else{
      $sWhereUserGroup="and (groupe.groupe=SimpleQuote".$sGroupe."SimpleQuote";
      }

      }else{
      $sWhereUserGroup.=" or groupe.groupe=SimpleQuote".$sGroupe."SimpleQuote";
      }
      $bEntreForeach=true;
      $i++;
      }
      if ($bEntreForeach==true){
      $sWhereUserGroup.=")";
      }else{
      if ($sWhereAllUserGroup!=""){
      $sWhereUserGroup="and (".$sWhereAllUserGroup.")";
      }
      }
      if ($sWhereUserGroup!=""){
      $sWhereUserGroup = str_replace("'", "''", $sWhereUserGroup);
      $sWhereUserGroup = str_replace("SimpleQuote", "'", $sWhereUserGroup);
      $sWhereUserGroup = $this->setEncodeLdapMessage($sWhereUserGroup);
      $sWhereUserGroup = str_replace("<br>", "", $sWhereUserGroup);
      }
      } else {
      writeToErrorLog(ERROR_LDAP_FAILED);
      }
      }else {
      writeToErrorLog(ERROR_LDAP_FAILED);
      }
      return $sWhereUserGroup;
      }
     */
}

?>
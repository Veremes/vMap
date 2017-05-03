<?php
/**
* \file MetadataAccess.class.inc
* \brief MetadataAccess.class.inc \n \n Ce fichier contient la classe php MetadataAccess.
*
* Cette classe à été élaborée par VEREMES.
*
* MetadataAccess se connecte à une base de données PostgreSQL pour récupérer et structurer les informations d'après la requête de l'utilisateur.
*
* \author Olivier Gayte <olivier.gayte@veremes.com>
* \author Frédéric Mauro
* \author Fabien Marty <fabien.marty@veremes.com>
*/

/**
* \class MetadataAccess
* \brief MetadataAccess Class \n \n MetadataAccess est une classe PHP qui permet récuperer des Meta données dans une base MySQL ou PostgreSQL.
*
* Cette classe à été élaborée par VEREMES.
*
* MetadataAccess se connecte à une base de données MySQL ou PostgreSQL pour récupérer et structurer les informations d'après la requête de l'utilisateur.
*
*
* \author Olivier Gayte <olivier.gayte@veremes.com>
* \author Frédéric Mauro
* \author Fabien Marty <fabien.marty@veremes.com>
*/

class MetadataAccess{
	/**
	* Base de donnée liée.
	*/
	var $oBd;
	/**
	* Nom de l'utilisateur courant.
	*/
	var $sLogin;
	/**
	* Mot de passe de l'utilisateur courant.
	*/
	var $sPassword;
	/**
	* Identifiant de la session PHP.
	*/
	var $sSID;
	/**
	* Tableau contenant les paramètres de configuration de l'application.
	*/
	var $aProperties;
	/**
	* Fichier contenant les requêtes SQL.
	*/
	var $sSQLFile='MetadataAccess.sql.inc';
	/**
	* Tableau des requêtes sql utilisées par la classe.
	*/
	var $aSql;

	/**
	* \param $oBd Base de données liée.
	* \param $sLogin Identifiant de l'utilisateur en cours.
	* \param $sPassword Mot de passe de l'utilisateur en cours.
	* \param $sSID Identifiant de la session PHP en cours.
	* \param $properties Tableau contenant les paramètres de configuration de l'application.
	*/
	function __construct($oBd, $sLogin, $sPassword, $sSID, $properties){
		$this->oBd=$oBd;
		$this->sLogin=$sLogin;
		$this->sPassword=$sPassword;
		$this->sSID=$sSID;
		$this->aProperties=$properties;
		include $this->sSQLFile;
		$this->aSql=$aSql[$oBd->sgbd];
	}
	/**
	* Cette méthode permet de tester l'IP de l'utilisateur en cours de connexion et de la comparer
	* à la ou aux valeurs IP authorisées pour cet utilisateur dans la base de données.
	* \param $sIp Adresse IP depuis laquelle l'utilisateur essaie de se connecter à l'application.
	* \return Booléen (Vrai ou faux)
	*/
	function checkUserIp($sIp){
		$oBd=$this->oBd;
		$sSql=$this->aSql['checkUserIp'];
		$sSql=str_replace("[sIp]", $sIp, $sSql);
		$sSql=str_replace("[sLogin]", $this->sLogin, $sSql);
		$sSql=str_replace("[sSchemaFramework]", $this->aProperties['schema_framework'], $sSql);

		$iRecordset=$oBd->execute ($sSql);
		$aLigne=$oBd->ligneSuivante ($iRecordset);
		$bReturn=false;

		if($aLigne["login"] === $this->sLogin)
			$bReturn=true;

		$iRecordset=$oBd->fermeResultat();
		return $bReturn;
	}
	/**
	* Cette méthode récupère l'ID du groupe de l'utilisateur en cours.
	* \return Retourne l'ID du groupe de l'utilisateur en cours.
	*/
	function getUserGroup(){
		$oBd=$this->oBd;
		$sSql=$this->aSql['getUserGroup'];
		$sSql=str_replace('[sLogin]', $this->sLogin, $sSql);
		$sSql=str_replace("[sSchemaFramework]", $this->aProperties['schema_framework'], $sSql);
		$iRecordset=$oBd->execute ($sSql);
		$sUserGroupId="";
		$sSep="";
		while($aLigne=$oBd->ligneSuivante ($iRecordset)) {
			$sUserGroupId .= $sSep.$aLigne["group_id"];
			$sSep=", ";
		}
		$iRecordset=$oBd->fermeResultat();
		return $sUserGroupId;
	}
	/**
	* Cette méthode récupère le nom du groupe de l'utilisateur en cours.
	* \return Retourne le nom du groupe de l'utilisateur en cours.
	*/
	function getUserGroupName(){
		$oBd=$this->oBd;
		$sSql=$this->aSql['getUserGroup'];
		$sSql=str_replace('[sLogin]', $this->sLogin, $sSql);
		$sSql=str_replace("[sSchemaFramework]", $this->aProperties['schema_framework'], $sSql);
		$iRecordset=$oBd->execute ($sSql);
		$sUserGroupName="";
		$sSep="";
		while($aLigne=$oBd->ligneSuivante ($iRecordset)) {
			$sUserGroupName .= $sSep.$aLigne["name"];
			$sSep="|";
		}
		$iRecordset=$oBd->fermeResultat();
		return $sUserGroupName;
	}
	/**
	* Cette méthode récupère le nom de la société de l'utilisateur en cours.
	* \return Retourne le nom de la société de l'utilisateur en cours.
	*/
	function getUserCompany(){
		$oBd=$this->oBd;
		$sLogin = $this->sLogin;
		$sSql=$this->aSql['getUserGroup'];
		$sSql=str_replace('[sLogin]', $sLogin, $sSql);
		$sSql=str_replace("[sSchemaFramework]", $this->aProperties['schema_framework'], $sSql);
		$iRecordset = $oBd->execute ($sSql);
		$aLigne = $oBd->ligneSuivante ($iRecordset);
		$iRecordset = $oBd->fermeResultat();
		return $aLigne["company"];
	}
		/**
	* Cette méthode récupère le nom du service de l'utilisateur en cours.
	* \return Retourne le nom du service de l'utilisateur en cours.
	*/
	function getUserDepartment(){
		$oBd=$this->oBd;
		$sLogin = $this->sLogin;
		$sSql=$this->aSql['getUserGroup'];
		$sSql=str_replace('[sLogin]', $sLogin, $sSql);
		$sSql=str_replace("[sSchemaFramework]", $this->aProperties['schema_framework'], $sSql);
		$iRecordset = $oBd->execute ($sSql);
		$aLigne = $oBd->ligneSuivante ($iRecordset);
		$iRecordset = $oBd->fermeResultat();
		return $aLigne["department"];
	}

}

?>
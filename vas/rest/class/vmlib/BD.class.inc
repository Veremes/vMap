<?php

/**
 * \file BD.class.inc
 * \brief BD.class.inc \n \n Ce fichier contient la classe php BD.
 *
 * Elle est bas�e sur un classe �labor�e par Philippe Rigaux qui permet d'utiliser les fonctions natives de php pour l'exploitation du SGBD
 * MySQL en fran�ais. Toutes les manipulations les plus courantes de MySQL sont impl�ment�es dans cette classe.
 * Elle a �t� reprise pour pouvoir fonctionner aussi bien avec une base  MySQL que PostgreSQL.
 *
 * Les sessions php permettent de conserver les donn�es n�cessaires pour g�n�rer un objet BD r�current.
 *
 * \author Philippe Rigaux <rigaux@lamsade.dauphine.fr>.
 * \author Olivier Gayte <olivier.gayte@veremes.com>.
 * \author Fabien Marty <fabien.marty@veremes.com>.
 * \author Armand Bahi <armand.bahi@veremes.com>.
 */
/**
 * \class BD
 * \brief BD Class \n \n Cette classe totalement g�n�rique permet de manipuler des donn�es
 * contenues dans une base MySQL, Oracle ou PostgreSQL.
 *
 * Elle est bas�e sur un classe �labor�e par Philippe Rigaux qui permet d'utiliser les fonctions natives de php pour l'exploitation du SGBD
 * MySQL en fran�ais. Toutes les manipulations les plus courantes de MySQL sont impl�ment�es dans cette classe.
 * Elle a �t� reprise pour pouvoir fonctionner aussi bien avec une base  MySQL que PostgreSQL.
 *
 * Les sessions php permettent de conserver les donn�es n�cessaires pour g�n�rer un objet BD r�current.
 *
 * \author  Philippe Rigaux <rigaux@lamsade.dauphine.fr>.
 * \author Olivier Gayte <olivier.gayte@veremes.com>.
 * \author Fabien Marty <fabien.marty@veremes.com>.
 * \author Armand Bahi <armand.bahi@veremes.com>.
 */
require_once ("logUtil.inc");
require_once ("stringUtil.inc");
require_once ("phpUtil.inc");

class BD {

    /**
     * Dossier contenant le fichier lib.
     */
    var $sFolderLib = "vmlib";

    /**
     * Objet connexion en cours.
     */
    var $connexion;

    /**
     * Bool�en, permet de savoir si une erreur � �t� rencontr�e.
     */
    var $erreurRencontree = 0;

    /**
     * Identifiant de l'utilisateur.
     */
    var $login;

    /**
     * Mot de passe de l'utilisateur.
     */
    var $mdp;

    /**
     * Nom de la base de donn�es utilis�e.
     */
    var $base;

    /**
     * Nom ou IP du serveur utilis�.
     */
    var $serveur;

    /**
     * Port de connexion.
     */
    var $port;

    /**
     * Message � afficher.
     */
    var $sMessage = "";

    /**
     * Commande DSN de connexion.
     */
    var $sDsn;

    /**
     * Casse des attributs renvoy�es par la fonction LigneSuite ("min", "maj" ou "").
     */
    var $sAttributeCase = ""; //"min", "maj"
    /**
     * nom du SGBD dans la syntaxe du dsn ("mysql", "pgsql", "oci")
     */
    var $sgbd;

    /**
     * langue de l'application par d�faut fr
     */
    var $lang;

    /**
     * Connexion � la base
     * \param $login Identifiant de l'utilisateur.
     * \param $motDePasse Mot de passe de l'utilisateur.
     * \param $base Nom de la base de donn�es utilis�e.
     * \param $serveur Nom ou IP du serveur utilis�.
     * \param $port Port de connexion utilis� : 5432 pour postgresql
     * \param $sgbd SGBD utilis� : "pgsql" - "mysql" - "oci" (Oracle)
     */
    function BD($login, $motDePasse, $base, $serveur, $port, $sgbd, $sPageEncoding = "ISO-8859-1", $lang = "fr") {
        $this->login = $login;
        $this->mdp = $motDePasse;
        $this->base = $base;
        $this->serveur = $serveur;
        $this->sgbd = $sgbd;
        $this->port = $port;
        $this->sPageEncoding = $sPageEncoding;
        $this->lang = $lang;
        loadLang($this->sFolderLib, $this->lang);
        if ($this->sgbd != "") {
            try {
                switch ($this->sgbd) {
                    case "sqlite":
                        $this->connexion = new PDO($this->sgbd . ':' . $this->serveur . '/' . $this->base);
                        break;
                    case "mysql" :
                        $this->sDsn = $this->sgbd . ':host=' . $this->serveur . ';dbname=' . $this->base;
                        $this->connexion = new PDO($this->sDsn, $this->login, $this->mdp);
                        break;
                    case "pgsql" :
                        $this->connexion = new PDO($this->sgbd . ':host=\'' . $this->serveur . '\' port=' . $this->port . ' dbname=\'' . $this->base . '\' user=\'' . $this->login . '\' password=\'' . $this->mdp . '\'');
                        $oPDOresult = $this->connexion->query("SET CLIENT_ENCODING TO '" . $this->sPageEncoding . "'");
                        break;
                    case "oci" :
                        if ($this->serveur != "") {
                            // $this->sDsn= $this->sgbd.':dbname=//'.$this->serveur.':'.$this->port.'/'.$this->base.';charset='.$this->sPageEncoding;
                            $this->sDsn = $this->sgbd . ':dbname=//' . $this->serveur . ':' . $this->port . '/' . $this->base;
                        } else {
                            //Pour oracle, la variable $this->sPageEncoding est "AL32UTF8" et non "UTF8"
                            $this->sDsn = $this->sgbd . ':dbname=' . $this->base . ';charset=' . $this->sPageEncoding;
                        }

                        $this->connexion = new PDO($this->sDsn, $this->login, $this->mdp);
                        break;
                    default:
                        $this->erreurRencontree = 1;
                        $this->setStringMessage(ERROR_INCORRECT_SGBD);
                        writeToErrorLog($this->stringMessageEncode(ERROR_INCORRECT_SGBD));
                        break;
                }
            } catch (PDOException $e) {
                $this->erreurRencontree = 1;
                writeToErrorLog($this->stringMessageEncode(ERROR_ACCESS_SERVER . $this->base . ", " . $this->serveur . " , " . $this->login . " , ip: " . $_SERVER['REMOTE_ADDR'] . " ** " . $e->getMessage()));
                $this->setStringMessage(ERROR_CONNECT_SERVER);
                $this->setStringMessage($e->getMessage());
            }
        } else {
            $this->erreurRencontree = 1;
            $this->setStringMessage(ERROR_SGBD_UNDEFINED);
            writeToErrorLog($this->stringMessageEncode(ERROR_SGBD_UNDEFINED));
        }
    }

    // ---- Partie priv�e : les m�thodes

    /**
     * M�thodes getSourceEncoding
     * \return Cette m�thode permet de retourner l'encodage de la base de donn�es selon le type de BD.
     */
    function getSourceEncoding() {
        if ($this->sgbd != "") {
            try {
                switch ($this->sgbd) {
                    case "sqlite":
                        // Requ�te qui va permettre de r�cup�rer l'encodage de la base
                        break;
                    case "pgsql" :
                        $sSql = "SELECT datname,encoding FROM pg_database where datname='sDataBase'";
                        $sSql = str_replace('sDataBase', $this->base, $sSql);
                        $oPDOresult = $this->execute($sSql);
                        $this->aSourceEncoding = $this->ligneSuivante($oPDOresult);
                        switch ($this->aSourceEncoding["encoding"]) {
                            case 6:
                                $sSourceEncoding = "UTF-8";
                                break;
                            case 8:
                                $sSourceEncoding = "ISO-8859-1";
                                break;
                            case 24:
                                $sSourceEncoding = "WIN1252";
                                break;
                            default:
                                $sSourceEncoding = "ISO-8859-1";
                                break;
                        }
                        break;
                    case "oci" :
                        $sSql = "select * from NLS_DATABASE_PARAMETERS where parameter='NLS_CHARACTERSET'";
                        $sSql = str_replace('sDataBase', $this->base, $sSql);
                        $oPDOresult = $this->execute($sSql);
                        $this->aSourceEncoding = $this->ligneSuivante($oPDOresult);
                        switch ($this->aSourceEncoding["NLS_CHARACTERSET"]) {
                            /* case 6:
                              $sSourceEncoding="UTF-8";
                              break;
                              case 8:
                              $sSourceEncoding="ISO-8859-1";
                              break; */
                            case "WE8MSWIN1252":
                                $sSourceEncoding = "WIN1252";
                                break;
                            default:
                                $sSourceEncoding = "WIN1252";
                                break;
                        }

                        break;
                    default:
                        $this->erreurRencontree = 1;
                        $this->setStringMessage(ERROR_INCORRECT_SGBD);
                        writeToErrorLog($this->stringMessageEncode(ERROR_INCORRECT_SGBD));
                        break;
                }
            } catch (PDOException $e) {
                $this->erreurRencontree = 1;
                writeToErrorLog($this->stringMessageEncode(ERROR_ACCESS_SERVER . $this->base . ", " . $this->serveur . " , " . $this->login . " ** " . $e->getMessage()));
                $this->setStringMessage(ERROR_CONNECT_SERVER);
                $this->setStringMessage($e->getMessage());
            }
        } else {
            $this->erreurRencontree = 1;
            $this->setStringMessage(ERROR_SGBD_UNDEFINED);
            writeToErrorLog($this->stringMessageEncode(ERROR_SGBD_UNDEFINED));
        }
        return $sSourceEncoding;
    }

    /**
     * M�thodes pour afficher le message en HTML.
     * \param $message Message � afficher.
     * \private
     */
    function setBDMessage($message) {
        $this->sMessage .= $message . "<br>";
    }

    /**
     * M�thodes pour afficher le message en HTML encod� en UTF-8. 
     * ATTENTION : A utiliser seulement pour des chaines �crites � la main. Ne pas utiliser pour des chaines ou il y a concat�nation entre "chaine �crite � la main" et chaine venant de la Base de donn�es
     * \param $message Message � afficher.
     * \private
     */
    function setStringMessage($message) {
        $this->sMessage .= iconv("ISO-8859-1", $this->sPageEncoding, $message) . "<br>";
    }

    /**
     * M�thodes qui permet d'encoder une chaine en UTF-8 pour que celle-ci soit correctement �crite dans les fichier de log. 
     * \param $sMessageEncode Message � afficher.
     * \return La chaine � �crire dans le fichier de log.
     */
    function stringMessageEncode($sMessageEncode) {
        $sMessageEncode = iconv("ISO-8859-1", $this->sPageEncoding, $sMessageEncode);
        return $sMessageEncode;
    }

    /**
     * \private
     * \return Le message � afficher.
     */
    function getBDMessage() {
        if ($this->sMessage != "")
            $sResult = USER_LABEL . $this->login . ERROR_LABEL . $this->sMessage;
        else
            $sResult = "";
        return $sResult;
    }

    /**
     * Supprime le message � afficher.
     * \private
     */
    function cleanMessage() {
        $this->sMessage = "";
    }

    // ---- Partie publique -------------------------

    /**
     * M�thode indiquant la liste des tables contenues dans la base de donn�es.
     * \return Le jeu d'enregistrement de la liste des tables.
     */
    function listeDesTables() {
        $sSql = "SHOW TABLES FROM " . $this->base;
        $oPDOresult = $this->execute($sSql);
        return $oPDOresult;
    }

    /**
     * M�thode d'ex�cution d'une requ�te.
     * \param $sRequete Requ�te � ex�cuter.
     * \return Le jeu d'enregistrement g�n�r� par l'ex�cution.
     */
    function execute($sRequete) {
        writeToDebugLog($sRequete);
        //$iDebut = (date("G")*60)*60 + (date("i")*60) + date("s");
        if (strtolower(substr($sRequete, 0, 6)) != "select") {
            writeToSqlLog($this->login . " | " . $sRequete);
        }
        $oPDOresult = $this->connexion->query($sRequete);

        //$iFin = (date("G")*60)*60 + (date("i")*60) + date("s");
        //writeToDebugLog('Temps d\'ex�cution : '.($iFin-$iDebut));
        if ($this->connexion->errorCode() === "00000") {
            $this->erreurRencontree = 0;
            return $oPDOresult;
        } else {
            $aPDOError = $this->connexion->errorInfo();
            $this->erreurRencontree = 1;
            //$this->setStringMessage(ERROR_REQUEST_IMPOSSIBLE.$sRequete);
            $this->setBDMessage(RETURN_BD_LABEL . "'" . $aPDOError[2] . "'");
            writeToErrorLog(html_entity_decode(ERROR_REQUEST_IMPOSSIBLE . $sRequete . "." . RETURN_BD_LABEL . "'" . $aPDOError[2] . "'"));
            return false;
        }
    }

    /**
     * M�thode permettant de d�marrer une transaction.
     */
    function demarreTransaction() {
        $this->connexion->beginTransaction();
    }

    /**
     * M�thode permettant de terminer une transaction.
     */
    function termineTransaction() {
        $this->connexion->commit();
    }

    /**
     * M�thode permettant d'annuler une transaction.
     */
    function annuleTransaction() {
        $this->connexion->rollBack();
    }

    /**
     * M�thode de suppression d'un objet PDO::Statement (n�cessaire pour l'ex�cution
     * de requ�tes successives).
     * \return Null.
     */
    function fermeResultat() {
        return null;
    }

    /**
     * Acc�s � la ligne suivante, sous forme d'objet
     * \param $oPDOresult  Jeu d'enregistrement r�sultant de l'�x�cution d'une requ�te.
     * \return La ligne suivante dans le jeu d'enregistrement.
     */
    function objetSuivant($oPDOresult) {
        return $oPDOresult->fetch(PDO::FETCH_OBJ);
    }

    /**
     * Acc�s � la ligne suivante, sous forme de tableau associatif
     * \param $oPDOresult  Jeu d'enregistrement r�sultant de l'�x�cution d'une requ�te.
     * \return La ligne suivante dans le jeu d'enregistrement.
     */
    function ligneSuivante($oPDOresult) {
        return $oPDOresult->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Acc�s au r�sultat sous forme de tableau associatif
     * \param $oPDOresult  Jeu d'enregistrement r�sultant de l'�x�cution d'une requ�te.
     * \return un tableau contenant les enregistrements sous forme de tableau associatif (champs=>valeur).
     */
    function getResultTableAssoc($oPDOresult) {
        return $oPDOresult->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Acc�s � la ligne suivante, sous forme de tableau indic�
     * \param $oDBresultat Jeu d'enregistrement.
     * \return La ligne suivante dans le jeu d'enregistrement.
     */
    function tableauSuivant($oPDOresult) {
        return $oPDOresult->fetch(PDO::FETCH_NUM);
    }

    /**
     * M�thode indiquant si une erreur a �t� rencontr�e
     * \return L'erreur rencontr�e.
     */
    function enErreur() {
        return $this->erreurRencontree;
    }

    /**
     * DEPRECATED ?
     * M�thode donnant l'id de la derni�re ligne ins�r�e.
     * \return L'id de la derni�re ligne ins�r�e.
     */
    function idDerniereLigne() {
        return mysql_insert_id();
    }

    /**
     * M�thode permettant de prot�ger les caract�res sp�ciaux d'une cha�ne de caract�re
     * dans une requ�te.
     * \param $chaine Cha�ne de caract�re � prot�ger.
     */
    function protegeChaine($chaine) {
        return $this->connexion->quote($chaine);
    }

    /**
     * M�thode indiquant le nombre d'attributs dans le r�sultat.
     * \param $res  Jeu d'enregistrement r�sultant de l'�x�cution d'une requ�te.
     * \return Le nombre d'attributs dans le r�sultat.
     */
    function getFieldsNumber($oPDOresult) {
        return $oPDOresult->columnCount();
    }

    /**
     * M�thode donnant le nom d'un attribut.
     * \param $oPDOresult  Jeu d'enregistrement r�sultant de l'�x�cution d'une requ�te.
     * \param $iFieldCount Nombre d'attributs.
     * \param $iPosition Position de l'attribut.
     * \return Le nom d'un attribut.
     */
    function getFieldName($oPDOresult, $iFieldCount, $iPosition, $sTable) {
        // Test sur la position
        if ($iPosition < 0 or $iPosition >= $iFieldCount) {
            $this->setStringMessage(ATTRIBUT_POSITION_BD_LABEL);
            return UNKNOWN_BD_LABEL;
        } else {
            if ($this->sgbd == 'oci') {
                $resultat = $this->execute('SELECT * FROM COLS WHERE name = \'' . strtoupper($sTable) . '\'');
                for ($i = 0; $aLigne = $this->ligneSuivante($resultat); $i++) {
                    if ($i == $iPosition) {
                        return $aLigne['COLUMN_NAME'];
                    }
                }
            } else {
                $aMeta = $oPDOresult->getColumnMeta($iPosition);
                return $aMeta['name'];
                //if ($this->sgbd=='pgsql')
                //else return  $aMeta['name'];
            }
        }
    }

    /**
     * M�thode indiquant le nombre de lignes dans le r�sultat. Utilisez  PHP> 5.1
     * \param $oPDOresult Jeu d'enregistrement r�sultant de l'�x�cution d'une requ�te.
     * \return Le nombre de lignes dans le r�sultat.
     */
    function nombreLigne($oPDOresult) {
        return $oPDOresult->rowCount();
    }

    /**
     * M�thode de d�connexion.
     */
    function quitter() {
        $this->connexion->null;
    }

    /**
     * M�thode permettant de r�cup�rer le type d'une attribut.
     * \param $oPDOresult Jeu d'enregistrement r�sultant de l'�x�cution d'une requ�te.
     * \param $iNumFields Nombres d'attributs.
     * \param $sFieldName Nom de l'attribut.
     * \return Le type d'une attribut (-1 si l'attribut pass� en param�tre n'est pas trouv�, 'VAR_STRING' texte, 'DATE' date, ... ).
     */
    function getType($oPDOresult, $iNumFields, $sFieldName, $sTable) {
        $sType = -1;
        if ($this->sgbd == 'oci') {
            $resultat = $this->execute('SELECT * FROM COLS WHERE name = \'' . strtoupper($sTable) . '\'');
            for ($i = 0; $aLigne = $this->ligneSuivante($resultat); $i++) {
                if ($aLigne['COLUMN_NAME'] == $sFieldName) {
                    return $aLigne['DATA_TYPE'];
                }
            }
        } else {
            for ($i = 0; $i < $iNumFields; $i++) {
                $aMeta = $oPDOresult->getColumnMeta($i);
                if ($aMeta['name'] == $sFieldName)
                    $sType = $aMeta['native_type'];
            }
        }
        // si le champ n'a pas �t� trouv�, il s'agit d'une erreur
        return $sType;
    }

    /**
     * M�thode permettant de construire une clause WHERE SQL � partir d'une liste de valeur pass�es en requ�te.
     * La table cible est sp�cifi�e en param�tre de la m�thode.
     * \param $sSchema Schema de la base de donn�es
     * \param $sTable Table dans laquelle on recherche.
     * \param $aValues Valeurs contenues dans la requ�te.
     * \param $bListQuery Liste des champs filtr�s.
     * \param $bUpper Modification de la casse. Facultatif, false par d�faut.
     * \param $bClause Type de clause : AND ou OR. Facultatif, AND par d�faut.
     * \return La clause WHERE de la requ�te SQL de recherche.
     */
    function getWhereClause($sSchema, $sTable, $aValues, $bListQuery, $bLower = false, $sClause = "AND") {
        // LIKE g�re tous les types de champs.
        switch ($this->sgbd) {
            case 'mysql' :
                $sProtectField = '`';
                $sSql = $this->AddLimite(0, 1, "SELECT * FROM " . $sTable);
                break;
            case 'pgsql' :
                $sTable = $sSchema . "." . $sTable;
                $sProtectField = '"';
                $sSql = $this->AddLimite(0, 1, "SELECT * FROM " . $sTable);
                break;
            case 'oci' :
                $sProtectField = '';
                $sSql = $this->AddLimite(0, 1, "SELECT " . $sTable . ".* FROM " . $sTable);
                break;
        }
        $resultat = $this->execute($sSql);

        $iNumFields = $this->getFieldsNumber($resultat);
        for ($i = 0; $i < $iNumFields; $i++) {
            $aField["name"][$i] = $this->getFieldName($resultat, $iNumFields, $i, $sTable);
            $aField["type"][$i] = $this->getType($resultat, $iNumFields, $aField["name"][$i], $sTable);
        }
        $sWhereClause = "";
        $sQueryList = "";
        foreach ($aValues as $sKey => $sValue) {
            $i = 0;

            while ($aField["name"][$i]) {
                if ($aField["name"][$i] == $sKey && $sValue != "") {
                    $sChamp = $sKey;
                    $sKey = addDelimitedAttribute("", $sKey, "", $sProtectField);
                    switch ($aField["type"][$i]) {
                        case (ereg("LONG|int4|int|NUMBER|float4|float8", $aField["type"][$i]) > 0) :
                            $sCondition = "=";
                            if (isset($aValues["condition_" . $sChamp])) {
                                if ($aValues["condition_" . $sChamp] != "") {
                                    $sCondition = $aValues["condition_" . $sChamp];
                                    ($sWhereClause == "") ? $sWhereClause .= " WHERE " : $sWhereClause .= " " . $sClause . " ";
                                    $sWhereClause .= $sTable . "." . $sKey . " " . $sCondition . " " . $sValue . " ";
                                    if ($bListQuery)
                                        $sQueryList .= $sChamp . " " . $sCondition . " " . $sValue . " & ";
                                }
                            }else {
                                ($sWhereClause == "") ? $sWhereClause .= " WHERE " : $sWhereClause .= " " . $sClause . " ";
                                $sWhereClause .= $sTable . "." . $sKey . "::varchar LIKE '" . $sValue . "' ";
                                if ($bListQuery)
                                    $sQueryList .= $sChamp . " " . $sCondition . " " . $sValue . " & ";
                            }
                            if (isset($aValues["condition_interval_sup_" . $sChamp]) && $aValues["condition_interval_sup_" . $sChamp] != "") {
                                $sCondition = $aValues["condition_interval_sup_" . $sChamp];
                                if ($aValues["interval_sup_" . $sChamp] != "") {
                                    ($sWhereClause == "") ? $sWhereClause .= " WHERE " : $sWhereClause .= " " . $sClause . " ";
                                    $sWhereClause .= $sTable . "." . $sKey . " " . $sCondition . " " . $aValues["interval_sup_" . $sChamp] . " ";
                                    if ($bListQuery)
                                        $sQueryList .= $sChamp . " " . $sCondition . " " . $aValues["interval_sup_" . $sChamp] . " & ";
                                }
                            }
                            break;
                        case 'bool' :
                            if ($sValue == '1')
                                $sValue = 'TRUE';
                            if ($sValue == '0')
                                $sValue = 'FALSE';
                            if ($sWhereClause == "")
                                $sWhereClause .= " WHERE " . $sTable . "." . $sKey . " = " . $sValue . " ";
                            else
                                $sWhereClause .= " " . $sClause . " " . $sTable . "." . $sKey . " = " . $sValue . " ";
                            if ($bListQuery)
                                $sQueryList .= $sKey . "=" . $sValue . " & ";
                            break;
                        //case "datetime" || "timestamp"  :

                        case (ereg("DATE|date|timestamp", $aField["type"][$i]) > 0) :
                            $sCondition = "=";
                            $DateUneFr = $aValues[$sChamp];
                            $DateDeuxFr = $aValues["interval_sup_" . $sChamp];
                            $sValue = substr($this->formatForSql($aValues[$sChamp], $aField["type"][$i]), 1, -1);
                            $aValues["interval_sup_" . $sChamp] = substr($this->formatForSql($aValues["interval_sup_" . $sChamp], $aField["type"][$i]), 1, -1);
                            if (isset($aValues["condition_" . $sChamp])) {
                                if ($aValues["condition_" . $sChamp] != "") {
                                    $sCondition = $aValues["condition_" . $sChamp];
                                    ($sWhereClause == "") ? $sWhereClause .= " WHERE " : $sWhereClause .= " " . $sClause . " ";
                                    $sWhereClause .= $sTable . "." . $sKey . " " . $sCondition . " '" . $sValue . "' ";
                                    if ($bListQuery)
                                        $sQueryList .= $sChamp . " " . $sCondition . " '" . $DateUneFr . "' & ";
                                }
                            } else {
                                //if($this->sgbd === "oci") $sFunction = "TO_CHAR(".$sTable.".".$sKey.", 'DD/MM/YYYY')";
                                ($sWhereClause == "") ? $sWhereClause .= " WHERE " : $sWhereClause .= " " . $sClause . " ";
                                $sWhereClause .= $sTable . "." . $sKey . "::varchar LIKE '%" . $sValue . "%' ";
                                if ($bListQuery)
                                    $sQueryList .= $sChamp . " " . $sCondition . " " . $DateUneFr . " & ";
                            }
                            if (isset($aValues["condition_interval_sup_" . $sChamp]) && $aValues["condition_interval_sup_" . $sChamp] != "") {
                                $sCondition = $aValues["condition_interval_sup_" . $sChamp];
                                if ($aValues["interval_sup_" . $sChamp] != "") {
                                    ($sWhereClause == "") ? $sWhereClause .= " WHERE " : $sWhereClause .= " " . $sClause . " ";
                                    $sWhereClause .= $sTable . "." . $sKey . " " . $sCondition . " '" . $aValues["interval_sup_" . $sChamp] . "' ";
                                    if ($bListQuery)
                                        $sQueryList .= $sChamp . " " . $sCondition . " '" . $DateDeuxFr . "' & ";
                                }
                            }
                            break;
                        default :
                            $sValue = str_replace("'", "''", $sValue);
                            if ($bLower) {
                                $sValue = strtolower($sValue);
                                if ($sWhereClause == "")
                                    $sWhereClause .= " WHERE lower(" . $sTable . "." . $sKey . ") LIKE '%" . $sValue . "%' ";
                                else
                                    $sWhereClause .= " " . $sClause . " lower(" . $sTable . "." . $sKey . ") LIKE '%" . $sValue . "%' ";
                            }else {
                                if ($sWhereClause == "")
                                    $sWhereClause .= " WHERE " . $sTable . "." . $sKey . " LIKE '%" . $sValue . "%' ";
                                else
                                    $sWhereClause .= " " . $sClause . " " . $sTable . "." . $sKey . " LIKE '%" . $sValue . "%' ";
                            }
                            if ($bListQuery)
                                $sQueryList .= $sKey . "='" . $sValue . "' & ";
                            break;
                    }
                }
                $i++;
            }
        }
        $resultat = $this->fermeResultat();
        if ($sQueryList != "")
            $sQueryList = substr($sQueryList, 0, -3);
        return array("WhereClause" => $sWhereClause, "QueryList" => $sQueryList);
    }

    /**
     * M�thode permettant d'ajouter des enregistrements.
     * \param $sSchema Schema de la base de donn�es
     * \param $sTable Table dans laquelle on ajoute.
     * \param $aValues Valeurs � ajouter.
     * \param $sSequence Nom de la s�quence � utiliser.
     * \param $iIdField Nom de l'attribut identifiant.
     * \param $bGetSql Bool�en : doit on renvoyer le code sql ou ex�cuter la requ�te? Vaut 'false' par d�faut.
     * \return L'id de la derni�re ligne ins�r�e.
     */
    function insert($sSchema, $sTable, $aValues, $sSequence, $iIdField, $bGetSql = false) {
        // Ins�re les �l�ments du tableau $aValues dans $sTable et renvoie l'identifiant de l'enregistrement correspondant (en fait le dernier)
        switch ($this->sgbd) {
            case 'mysql' :
                $sSQL = "INSERT INTO `$sTable` (";
                $sSqlList = $this->AddLimite(0, 0, "SELECT * FROM " . $sTable);
                $sProtectField = "`";
                break;
            case 'pgsql' :
                $sSQL = 'INSERT INTO ' . $sSchema . '.' . $sTable . '(';
                $sSqlList = $this->AddLimite(0, 0, 'SELECT * FROM ' . $sSchema . '.' . $sTable);
                $sProtectField = '"';
                // Utilisation de la sequence pour r�cup�rer un identifiant
                if ($sSequence) {
                    $oPDOresult = $this->execute('SELECT nextval(\'' . $sSequence . '\')');
                    if ($oPDOresult !== false)
                        $aIdValue = $this->ligneSuivante($oPDOresult);
                    $iIdValue = $aIdValue['nextval'];
                    $aValues[$iIdField] = $iIdValue;
                    $oPDOresult = $this->fermeResultat();
                }
                break;
            case 'oci' :
                $sSQL = 'INSERT INTO ' . $sTable . '(';
                $sSqlList = 'SELECT ' . $sTable . '.* FROM ' . $sTable . ' WHERE ROWNUM <=1 AND ROWNUM >=0';
                $sProtectField = '"';
                // Utilisation de la sequence pour r�cup�rer un identifiant
                if ($sSequence) {
                    $oPDOresult = $this->execute('SELECT ' . $sSequence . '.nextval FROM dual');
                    if ($oPDOresult !== false)
                        $aIdValue = $this->ligneSuivante($oPDOresult);
                    $iIdValue = $aIdValue['NEXTVAL'];
                    $aValues[$iIdField] = $iIdValue;
                    $oPDOresult->closeCursor();
                }
                break;
        }
        $sFields = "";
        $sValues = "";

        $resultat = $this->execute($sSqlList);
        $iNumFields = $this->getFieldsNumber($resultat);
        foreach ($aValues as $sField => $sValue) {
            if ($iIdField == $sField)
                $iIdValue = $sValue;
            if (substr_count($sField, '.') == 1)
                $sField = substr($sField, strlen($sTable) + 1);
            $sType = $this->getType($resultat, $iNumFields, $sField, $sTable);

            if ($sType != -1) {
                $sFields = addDelimitedAttribute($sFields, $sField, ",", $sProtectField);
                $sValue = $this->formatForSql($sValue, $sType, $sSchema, $sTable);
                $sValues = addDelimitedString($sValues, $sValue, ",");
            }
        }

        if (empty($iIdValue)) {
            $sSQL = $sSQL . $sFields . ") VALUES (" . $sValues . ") RETURNING \"" . $iIdField . "\"";
        } else {
            $sSQL = $sSQL . $sFields . ") VALUES (" . $sValues . ")";
        }

        $resultat = $this->fermeResultat();
        if ($bGetSql) {
            return $sSQL;
        } else {
            $iResult = $this->execute($sSQL);
            // Valeur retour au cas où $iIdValue soit vide
            if (empty($iIdValue)) {
                $iIdValue = $iResult->fetchColumn();
            }
            if ($iResult !== false) {
                $iResult = $this->fermeResultat();
            }

            if ($this->sgbd == 'mysql')
                $iIdValue = $this->connexion->lastInsertId();
            return $iIdValue;
        }
    }

    /**
     * M�thode permettant d'ajouter des enregistrements par le biais de la commande SQL 'COPY'.
     * Methode impl�ment�e pour PostgreSQL.
     * \param $sSchema Schema de la base de donn�es
     * \param $sTable Table dans laquelle on ajoute.
     * \param $aValues Valeurs � ajouter.
     * \param $sSequence Nom de la s�quence � utiliser.
     * \param $sIdField Nom de l'attribut identifiant.
     */
    function copy($sSchema, $sTable, $aValues, $sSequence, $sIdField) {
        //$iIdValue = $aIdValue['nextval'];
        $sSqlField = $this->AddLimite(0, 0, "SELECT * FROM " . $sSchema . "." . $sTable);
        $iFieldResult = $this->execute($sSqlField);
        $iNumField = $this->getFieldsNumber($iFieldResult);

        $sCopy = "";
        $aType = array();
        foreach ($aValues as $i => $aRow) {
            if ($i == 0) {
                $sCopy .= "COPY " . $sSchema . "." . $sTable . " (";
                foreach ($aRow as $sField => $sValue) {
                    if (substr_count($sField, '.') == 1)
                        $sField = substr($sField, strlen($sTable) + 1);
                    $aType[$sField] = $this->getType($iFieldResult, $iNumField, $sField, $sTable);
                    $sFields = addDelimitedAttribute($sFields, $sField, ",", "\"");
                }
                $sCopy .= $sFields . ") FROM stdin;\n";
            }
            $iSeqResult = $this->execute("SELECT nextval('" . $sSequence . "')");
            if ($iSeqResult !== false)
                $aIdValue = $this->ligneSuivante($iSeqResult);
            $iSeqResult = $this->fermeResultat();
            foreach ($aRow as $sField => $sValue) {
                if ($sIdField === $sField)
                    $sValue = $aIdValue["nextval"];
                if ($sValue === "null")
                    $sValue = "\\N";
                $sValues = addDelimitedString($sValues, $sValue, "\t");
            }
            $sCopy .= $sValues . "\n";
        }
        $sCopy .= "\\.";
        $iNumField = $this->fermeResultat();

        $iResult = $this->execute($sCopy);
        if ($iResult !== false) {
            $iResult = $this->fermeResultat();
            return true;
        } else {
            return false;
        }
    }

    /**
     * M�thode permettant de mettre � jour des enregistrements.
     * \param $sSchema Schema de la base de donn�es
     * \param $sTable Table dans laquelle on met � jour.
     * \param $aValues Valeurs � mettre � jour.
     * \param $sAttribute Attribut de la clause "WHERE".
     * \param $sId Valeur de l'attribut.
     * \param $sIdType Type de l'attribut.
     */
    function update($sSchema, $sTable, $aValues, $sAttribute, $sId, $sIdType = "") {
// Modifie la table $sTable � partir du contenu du tableau $aValues
// Le nom des �l�ments de $aValues doit �tre le m�me que les nom de champs
// Le type de chaque champ est pris en compte de mani�re dynamque
        switch ($this->sgbd) {
            case 'mysql' :
                $sSQL = "UPDATE `$sTable` set ";
                $sSqlList = $this->AddLimite(0, 0, "SELECT * FROM " . $sTable);
                $sProtectField = "`";
                break;
            case 'pgsql' :
                $sSQL = 'UPDATE ' . $sSchema . '.' . $sTable . ' set ';
                $sSqlList = $this->AddLimite(0, 0, 'SELECT * FROM ' . $sSchema . '.' . $sTable);
                $sProtectField = '"';
                break;
            case 'oci' :
                $sSQL = 'UPDATE ' . $sTable . ' set ';
                $sSqlList = $this->AddLimite(0, 1, 'SELECT * FROM ' . $sTable);
                $sProtectField = '';
                break;
        }
        $sPaires = "";
        $sFields = "";
        $sValues = "";
        $resultat = $this->execute($sSqlList);
        $iNumFields = $this->getFieldsNumber($resultat);

        foreach ($aValues as $sField => $sValue) {
            if (substr_count($sField, '.') == 1)
                $sField = substr($sField, strlen($sTable) + 1);
            $sType = $this->getType($resultat, $iNumFields, $sField, $sTable);
            if ($sType != -1) {
                $sValue = $this->formatForSql($sValue, $sType, $sSchema, $sTable);
                $sPaire = addDelimitedAttribute("", $sField, "", $sProtectField) . '=' . $sValue;
                $sPaires = addDelimitedString($sPaires, $sPaire, ", ");
            }
        }

        if ($sPaires != "") {
            $sSQL = $sSQL . $sPaires;
            if ($sAttribute != "") {
                if (!is_array($sId)) {
                    $sWhereClause = $this->AddWhereClause($sAttribute, $sId, $sIdType);
                } else {
                    $sId = implode(",", $sId);
                    $sWhereClause = " WHERE " . $this->AddInClause($sSchema, $sAttribute, $sId);
                }
                $sSQL = $sSQL . $sWhereClause;
            }
            $resultat = $this->fermeResultat();
            $iResult = $this->execute($sSQL);
            if ($iResult !== false) {
                $iResult = $this->fermeResultat();
            }
        }
    }

    /**
     * M�thode permettant de supprimer des enregistrements de la table pass�e en param�tre conform�ment � la clause sp�cifi�e.
     * \param $sSchema Schema de la base de donn�es
     * \param $sTable Table dans laquelle on supprime.
     * \param $sAttribute Attribut de la clause "WHERE".
     * \param $sId Valeur de l'attribut.
     * \param $sIdType Types de l'attribut.
     */
    function delete($sSchema, $sTable, $sAttribute, $sId, $sIdType = "") {
        switch ($this->sgbd) {
            case 'mysql' :
                $sSQL = "DELETE FROM `$sTable` WHERE " . $sAttribute;
                break;
            case 'pgsql' :
                if (substr_count($sAttribute, '.') != 1)
                    $sAttribute = '"' . $sAttribute . '"';
                else {
                    $sAttribute = str_replace('.', '."', $sAttribute . '"');
                    $sAttribute = $sSchema . '.' . $sAttribute;
                }

                $sSQL = 'DELETE FROM ' . $sSchema . '.' . $sTable . ' WHERE ' . $sAttribute . '';
                break;
            case 'oci' :
                $sSQL = "DELETE FROM $sTable WHERE " . $sAttribute;
                break;
        }
        if ($sIdType == "text") {
            $sSQL .= " IN ('" . $sId . "')";
            $sSQL = str_replace(',', "','", $sSQL);
        } else {
            $sSQL .= ' IN (' . $sId . ')';
        }
        $iResult = $this->execute($sSQL);
        if ($iResult !== false) {
            $iResult = $this->fermeResultat();
        }
    }

    /**
     * M�thode permettant d'ajouter des enregistrements dans une table li�e.
     * \param $sTableName Table dans laquelle on ajoute.
     * \param $sAttributePK Attribut PK.
     * \param $sPKValue Valeur de l'attribut PK.
     * \param $aAttributeList Tableau contenant les attributs et leurs valeurs.
     * \param $sSequence S�quence.
     * \param $sSchema Sch�ma.
     */
    function insertLinkedTable($sTableName, $sAttributePK, $sPKValue, $aAttributeList, $sSequence, $sSchema) {
        switch ($this->sgbd) {
            case 'mysql' :
                //m�thode non impl�ment� pour mysql
                break;
            case 'pgsql' :
                break;
            case 'oci' :
                $sSql = "SELECT " . $sAttributeFK . " FROM " . $sTableName . " WHERE " . $sAttributePK . "=" . $sPKValue;
                $sSqlDel = "DELETE FROM " . $sTableName . " WHERE " . $sAttributePK . "=" . $sPKValue . " AND " . $sAttributeFK . "='";
                break;
        }

        $aValues = Array();
        foreach ($aAttributeList as $aValue) {
            $aValues[$aValue[0]] = $aValue[1];
        }
        $this->insert($sSchema, $sTableName, $aValues, $sSequence, $sAttributePK);
    }

    /**
     * M�thode permettant d'ajouter des enregistrements sans ajout de nouvel Id dans une table li�e.
     * \param $sSchema Sch�ma.
     * \param $sTable Table dans laquelle on ajoute.
     * \param $aAttributeFK Tableau contenant les attributs.
     * \param $aValueList Tableau contenant les valeurs.
     */
    function insertWithoutIdLinkedTable($sSchema, $sTable, $aAttributeList, $aValueList) {
        //M�thode impl�ment� uniquement pour postgresql
        if ($sSchema != "") {
            $sTable = $sSchema . "." . $sTable;
        }
        foreach ($aValueList as $iKey => $sValue) {
            if (gettype($sValue) == "string") {
                $aValueList[$iKey] = "'" . $sValue . "'";
            }
        }
        $sSql = "INSERT INTO " . $sTable . ' ("' . implode('","', $aAttributeList) . '") VALUES (' . implode(',', $aValueList) . ')';
        $this->execute($sSql);
    }

    /**
     * M�thode permettant de mettre � jour des enregistrements dans une table li�e.
     * \param $sTableName Table dans laquelle on met un enregistrement � jour.
     * \param $sAttributePK Attribut PK.
     * \param $sAttributeFK Attribut FK.
     * \param $sFKList Liste des valeurs de l'attribut FK.
     * \param $sPKValue Valeur de l'attribut PK.
     */
    function updateLinkedTable($sTableName, $sAttributePK, $sAttributeFK, $sFKList, $sPKValue) {
        switch ($this->sgbd) {
            case 'mysql' :
                //m�thode non impl�ment� pour mysql
                break;
            case 'pgsql' :
                $sSql = "UPDATE " . $sTableName . " SET " . $sAttributePK . "=" . $sPKValue . " WHERE " . $sAttributeFK . "=";
                break;
            case 'oci' :
                //m�thode non impl�ment� pour oci
                break;
        }
        $aFKList = explode("@", $sFKList);
        //Met � jour les enregistrements de $aFKList
        foreach ($aFKList as $sFKValue) {
            writeToDebugLog($sSql . $sFKValue);
            writeToSqlLog($this->login . " | " . $sSQL);
            $this->connexion->query($sSql . $sFKValue);
        }
    }

    /**
     * M�thode permettant de g�n�rer une clause SQL simple de type "LIMIT" selon le sgbd.
     * \param $iMinRowValue Valeur minimale du limit.
     * \param $iRowPage Nombre d'enregistrements s�lectionn�s.
     */
    function AddLimite($iMinRowValue, $iRowPage, $sSql) {
        switch ($this->sgbd) {
            case 'mysql' :
                $sSql .= " LIMIT " . $iMinRowValue . "," . $iRowPage;
                break;
            case 'pgsql' :
                $sSql .= " LIMIT " . $iRowPage . " OFFSET " . $iMinRowValue;
                break;
            case 'oci' :
                $iRowPage = $iRowPage + $iMinRowValue;
                $sSql1 = "SELECT * FROM ( SELECT * FROM (" . $sSql . ") WHERE ROWNUM <= " . $iRowPage . ") MINUS ( SELECT * FROM (" . $sSql . ") WHERE ROWNUM <= " . $iMinRowValue . ")";
                if (substr_count($sSql, "ORDER BY") >= 1) {
                    $sSql = "SELECT * FROM ( " . $sSql1 . ")" . stristr($sSql, "ORDER BY");
                } else {
                    $sSql = $sSql1;
                }
                break;
        }
        return $sSql;
    }

    /**
     * M�thode permettant de g�n�rer une clause SQL simple de type "ORDER BY" selon le sgbd.
     * \param $sAttribute Attribut.
     * \param $sOrder Ordre dans lequel doivent �tre tri�es les donn�es "ASC" ou "DESC".
     */
    function AddOrder($sAttibute, $sOrder) {
        if (is_null($sOrder))
            $sOrder = 'ASC';
        switch ($this->sgbd) {
            case 'mysql' :
                $sSql = " ORDER BY '" . $sAttibute . "' " . $sOrder;
                break;
            case 'pgsql' :
                $sSql = ' ORDER BY "' . $sAttibute . '" ' . $sOrder;
                break;
            case 'oci' :
                $sSql = ' ORDER BY "' . $sAttibute . '" ' . $sOrder;
                break;
        }
        return $sSql;
    }

    /**
     * M�thode permettant de g�n�rer une clause SQL simple de type "WHERE" selon le sgbd.
     * \param $sAttribute Attribut.
     * \param $sId Valeur de l'attribut.
     * \param $sType Type de l'attribut.
     */
    function AddWhereClause($sAttribute, $sId, $sType = "") {
        switch ($this->sgbd) {
            case 'mysql' :
                $sSql = " WHERE " . $sAttribute . "=" . $sId;
                break;
            case 'pgsql' :
                if (substr_count($sAttribute, '.') != 1) {
                    $sAttribute = '"' . $sAttribute . '"';
                }
                if ($sType == "text")
                    $sId = "'" . $sId . "'";
                $sSql = ' WHERE ' . $sAttribute . '= ' . $sId;
                break;
            case 'oci' :
                $sId = "'" . $sId . "'";
                $sSql = ' WHERE ' . $sAttribute . '= ' . $sId;
                break;
        }
        return $sSql;
    }

    /**
     * M�thode permettant de g�n�rer une clause SQL simple de type "AND" selon le sgbd.
     * \param $sSchema Schema de la base de donn�es
     * \param $sAttribute Attribut.
     * \param $sId Valeur de l'attribut.
     */
    function AddAndClause($sSchema, $sAttribute, $sId, $sType = "") {
        switch ($this->sgbd) {
            case 'mysql' :
                $sSql = " AND " . $sAttribute . "=" . $sId;
                break;
            case 'pgsql' :
                if (substr_count($sAttribute, '.') != 1) {
                    $sAttribute = '"' . $sAttribute . '"';
                } else {
                    if (substr_count($sAttribute, '."') != 1) {
                        $sAttribute = str_replace('.', '."', $sAttribute . '"');
                    }
                    if (strcmp($sSchema, "") != 0) {
                        $sAttribute = $sSchema . '.' . $sAttribute;
                    }
                }
                $sId = "'" . $sId . "'";
                $sSql = ' AND ' . $sAttribute . '= ' . $sId;
                break;
            case 'oci' :
                if ($sType == "text")
                    $sId = "'" . $sId . "'";
                $sSql = " AND " . $sAttribute . "=" . $sId;
                break;
        }
        return $sSql;
    }

    /**
     * M�thode permettant de g�n�rer une clause SQL simple de type "IN" selon le sgbd.
     * \param $sSchema Schema de la base de donn�es
     * \param $sAttribute Attribut.
     * \param $sId Valeurs de l'attribut.
     */
    function AddInClause($sSchema, $sAttribute, $sId) {
        switch ($this->sgbd) {
            case 'mysql' :
                // Vide
                break;
            case 'pgsql' :
                if (substr_count($sAttribute, '.') != 1) {
                    $sAttribute = '"' . $sAttribute . '"';
                } else {
                    $sSchema = "\"" . $sSchema . "\"";
                    $sAttribute = $sSchema . ".\"" . str_replace(".", "\".\"", $sAttribute) . "\"";
                }
                break;
            case 'oci' :
                // Vide
                break;
        }
        $sSql = $sAttribute . " IN (" . $sId . ")";
        return $sSql;
    }

    /**
     * M�thode qui renvoie une cha�ne format�e pour pouvoir �tre utilis� dans un requ�te insert, update ou select.
     * \param $sValue Cha�ne qui va doit �tre format�e.
     * \param $sType Type de l'attribut.
     * \param $sSchema Schema contenant la table dont est issu le champ � traiter (vide par d�faut).
     * \param $sTable Table dont est issu le champ � traiter (vide par d�faut).
     */
    function formatForSql($sValue, $sType, $sSchema = "", $sTable = "") {

        // Gestion du type spatiale
        switch ($this->sgbd) {
            case "pgsql" :
                if (($sType === "geometry") && ($sValue !== "")) {
                    $iTableDimension = $this->getTableDimension($sTable, $sSchema);
                    $sForce3DDebut = "";
                    $sForce3DFin = "";
                    if ($iTableDimension == 3) {
                        $sForce3DDebut = "st_force_3d(";
                        $sForce3DFin = ")";
                    }
                    $sOriginTable = $this->ifTableIsAView($sTable, $sSchema);
                    if ($sOriginTable != $sTable) {
                        $sTable = $sOriginTable;
                        $sOriginSchema = $this->getTableSchema($sTable);
                        if ($sOriginSchema != $sSchema)
                            $sSchema = $sOriginSchema;
                    }
                    // Si il s'agit de format EWKT, alors on connait la projection de la géométrie. On peut alors procéder à une reprojection automatique des données
                    if ($this->isEWKTFormat($sValue)) {
                        $sValue = $sForce3DDebut . "ST_transform(ST_GeomFromEWKT('" . $sValue . "'), " . $this->getTableSRID($sTable, $sSchema) . ")" . $sForce3DFin;
                    } else {
                        $sValue = $sForce3DDebut . "st_geometryFromText('" . $sValue . "'," . $this->getTableSRID($sTable, $sSchema) . ") " . $sForce3DFin;
                    }
                } else {
                    $sValue = str_replace("'", "''", $sValue);
                    //$sValue = str_replace("\\", "\\\\", $sValue);
                    //$sValue = str_replace("\\\\\\''", "\\\\\\\\\\\\'", $sValue);
                }

                break;
        }
        // Gestion des types alphanum�riques
        if ($sValue === "") {
            $sValue = "null";
        } else {
            switch ($sType) {
                case ($sType == "BLOB" || $sType == "bool"):
                    if ($sValue == "")
                        $sValue = 0;
                case ($sType == "bpchar" || $sType == "DATE" || $sType == "varchar" || $sType == "VARCHAR2" || $sType == "VAR_STRING" || $sType == "text" || $sType == "timestamp"):
                    if ((empty($sValue) && $sValue != 0) || $sValue == "") {
                        $sValue = "null";
                    } else {
                        $sValue = "'" . $sValue . "'";
                    }
                    break;
                case ($sType == "date" || $sType == "DATETIME"):
                    $sValue = "'" . implode("-", array_reverse(explode("/", $sValue))) . "'";
                    break;
                default:
                    if ($sValue == "")
                        $sValue = "null";
                    break;
            }
        }
        // Cas particulier : le bool�en 'faux' dans PostgreSQL
        if ($sType == "bool" && $this->sgbd == "pgsql" && $sValue == "null")
            $sValue = "false";
        return $sValue;
    }

    /**
     * M�thode permettant de construire une clause WHERE SQL � partir d'une liste de valeur pass�es en requ�te et avec une jointure sur une autre table.
     * La table cible est sp�cifi�e en param�tre de la m�thode.
     * \param $sSchema Schema de la base de donn�es
     * \param $sTable Table dans laquelle on recherche.
     * \param $aValues Valeurs contenues dans la requ�te.
     * \param $bListQuery.
     * \param $sTable_sql
     * \param $pKey
     * \param $isWhereExist
     * \return La clause WHERE de la requ�te SQL de recherche.
     */
    function getWhereAndClause($sSchema, $sTable, $aValues, $bListQuery, $sTable_sql, $pKey, $isWhereExist = false) {
        // LIKE g�re tous les types de champs.
        switch ($this->sgbd) {
            case 'mysql' :
                $sProtectField = '`';
                $sSql = $this->AddLimite(0, 1, "SELECT * FROM " . $sTable);
                break;
            case 'pgsql' :
                $sTable = $sSchema . "." . $sTable;
                $sProtectField = '"';
                $sSql = $this->AddLimite(0, 1, "SELECT * FROM " . $sTable);
                break;
            case 'oci' :
                $sProtectField = '';
                $sSql = $this->AddLimite(0, 1, "SELECT " . $sTable . ".* FROM " . $sTable);
                break;
        }
        $resultat = $this->execute($sSql);

        $iNumFields = $this->getFieldsNumber($resultat);
        for ($i = 0; $i < $iNumFields; $i++) {
            $aField["name"][$i] = $this->getFieldName($resultat, $iNumFields, $i, $sTable);
            $aField["type"][$i] = $this->getType($resultat, $iNumFields, $aField["name"][$i], $sTable);
        }
        $sWhereClause = "";
        $sQueryList = "";
        foreach ($aValues as $sKey => $sValue) {
            $i = 0;

            while ($aField["name"][$i]) {
                //echo $aField["name"][$i]." ".$aField["type"][$i]."<BR>";
                if ($aField["name"][$i] == $sKey && $sValue != "") {
                    $sKey = addDelimitedAttribute("", $sKey, "", $sProtectField);
                    switch ($aField["type"][$i]) {
                        case (ereg("LONG|int4|NUMBER", $aField["type"][$i]) > 0) :
                            if ($sWhereClause == "" & !$isWhereExist)
                                $sWhereClause .= " WHERE " . $sTable . "." . $sKey . "::varchar LIKE '" . $sValue . "' ";
                            else
                                $sWhereClause .= " AND " . $sTable . "." . $sKey . "::varchar LIKE '" . $sValue . "' ";
                            if ($bListQuery)
                                $sQueryList .= $sKey . "=" . $sValue . " & ";
                            break;
                        case 'bool' :
                            if ($sValue == '1')
                                $sValue = 'TRUE';
                            if ($sValue == '0')
                                $sValue = 'FALSE';
                            if ($sWhereClause == "" & !$isWhereExist)
                                $sWhereClause .= " WHERE " . $sTable . "." . $sKey . " = " . $sValue . " ";
                            else
                                $sWhereClause .= " AND " . $sTable . "." . $sKey . " = " . $sValue . " ";
                            if ($bListQuery)
                                $sQueryList .= $sKey . "=" . $sValue . " & ";
                            break;
                        //case "datetime" || "timestamp"  :
                        case (ereg("DATE|date", $aField["type"][$i]) > 0) :
                            $sValue = substr($this->formatForSql($sValue, $aField["type"][$i]), 1, -1);
                            if ($this->sgbd === "oci")
                                $sFunction = "TO_CHAR(" . $sTable . "." . $sKey . ", 'DD/MM/YYYY')";
                        default :
                            if (!empty($sFunction)) {
                                if ($sWhereClause == "" & !$isWhereExist)
                                    $sWhereClause .= " WHERE " . $sFunction . " LIKE '%" . $sValue . "%' ";
                                else
                                    $sWhereClause .= " AND " . $sFunction . " LIKE '%" . $sValue . "%' ";
                            }else {
                                if ($sWhereClause == "" & !$isWhereExist)
                                    $sWhereClause .= " WHERE " . $sTable . "." . $sKey . " LIKE '%" . $sValue . "%' ";
                                else
                                    $sWhereClause .= " AND " . $sTable . "." . $sKey . " LIKE '%" . $sValue . "%' ";
                            }
                            if ($bListQuery)
                                $sQueryList .= $sKey . "='" . $sValue . "' & ";
                            break;
                    }
                    $sWhereClause .= " AND " . $sTable . "." . $pKey . " = " . $sTable_sql . "." . $pKey;
                }

                $i++;
            }
        }
        $resultat = $this->fermeResultat();
        if ($sQueryList != "")
            $sQueryList = substr($sQueryList, 0, -3);
        return array("WhereClause" => $sWhereClause, "QueryList" => $sQueryList);
    }

// Fin de la classe
}

?>
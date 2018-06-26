<?php

/**
 * \file BD.class.inc
 * \brief BD.class.inc \n \n Ce fichier contient la classe php BD.
 *
 * Elle est basée sur un classe élaborée par Philippe Rigaux qui permet d'utiliser les fonctions natives de php pour l'exploitation du SGBD
 * MySQL en français. Toutes les manipulations les plus courantes de MySQL sont implémentées dans cette classe.
 * Elle a été reprise pour pouvoir fonctionner aussi bien avec une base  MySQL que PostgreSQL.
 *
 * Les sessions php permettent de conserver les données nécessaires pour générer un objet BD récurrent.
 *
 * \author Philippe Rigaux <rigaux@lamsade.dauphine.fr>.
 * \author Olivier Gayte <olivier.gayte@veremes.com>.
 * \author Fabien Marty <fabien.marty@veremes.com>.
 * \author Armand Bahi <armand.bahi@veremes.com>.
 */
/**
 * \class BD
 * \brief BD Class \n \n Cette classe totalement générique permet de manipuler des données
 * contenues dans une base MySQL, Oracle ou PostgreSQL.
 *
 * Elle est basée sur un classe élaborée par Philippe Rigaux qui permet d'utiliser les fonctions natives de php pour l'exploitation du SGBD
 * MySQL en français. Toutes les manipulations les plus courantes de MySQL sont implémentées dans cette classe.
 * Elle a été reprise pour pouvoir fonctionner aussi bien avec une base  MySQL que PostgreSQL.
 *
 * Les sessions php permettent de conserver les données nécessaires pour générer un objet BD récurrent.
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
     * Booléen, permet de savoir si une erreur à été rencontrée.
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
     * Nom de la base de données utilisée.
     */
    var $base;

    /**
     * Nom ou IP du serveur utilisé.
     */
    var $serveur;

    /**
     * Port de connexion.
     */
    var $port;

    /**
     * Message à afficher.
     */
    var $sMessage = "";

    /**
     * Commande DSN de connexion.
     */
    var $sDsn;

    /**
     * Casse des attributs renvoyées par la fonction LigneSuite ("min", "maj" ou "").
     */
    var $sAttributeCase = ""; //"min", "maj"
    /**
     * nom du SGBD dans la syntaxe du dsn ("mysql", "pgsql", "oci")
     */
    var $sgbd;

    /**
     * langue de l'application par défaut fr
     */
    var $lang;

    /**
     * Connexion à la base
     * \param $login Identifiant de l'utilisateur.
     * \param $motDePasse Mot de passe de l'utilisateur.
     * \param $base Nom de la base de données utilisée.
     * \param $serveur Nom ou IP du serveur utilisé.
     * \param $port Port de connexion utilisé : 5432 pour postgresql
     * \param $sgbd SGBD utilisé : "pgsql" - "mysql" - "oci" (Oracle)
     */
    function __construct($login, $motDePasse, $base, $serveur, $port, $sgbd, $sPageEncoding = "ISO-8859-1", $lang = "fr") {
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
                $this->connectSGBD();
            } catch (PDOException $e) {
                /**
                 * En cas d'utilisation de l'AD, le mot de passe doit respecter
                 * certaines règles de codage, le code situé ci-dessous
                 * correspond à ce type de cas
                 */
                // $this->mdp = utf8_decode($motDePasse);
                $this->mdp = iconv("UTF-8", "CP1252", $motDePasse);
                try {
                    $this->connectSGBD();
                } catch (PDOException $e) {
                    $this->erreurRencontree = 1;
                    writeToErrorLog($this->stringMessageEncode(ERROR_ACCESS_SERVER . $this->base . ", " . $this->serveur . " , " . $this->login . " , ip: " . $_SERVER['REMOTE_ADDR'] . " ** " . $e->getMessage()));
                    $this->setStringMessage(ERROR_CONNECT_SERVER);
                    $this->setStringMessage($e->getMessage());
                }
            }
        } else {
            $this->erreurRencontree = 1;
            $this->setStringMessage(ERROR_SGBD_UNDEFINED);
            writeToErrorLog($this->stringMessageEncode(ERROR_SGBD_UNDEFINED));
        }
    }

    // ---- Partie privée : les méthodes

    /**
     * Connexion à PDO
     */
    function connectSGBD() {
        switch ($this->sgbd) {
            case "sqlite":
                $this->connexion = new PDO($this->sgbd . ':' . $this->serveur . '/' . $this->base);
                break;
            case "mysql" :
                $this->sDsn = $this->sgbd . ':host=' . $this->serveur . ';dbname=' . $this->base;
                $this->connexion = new PDO($this->sDsn, $this->login, $this->mdp);
                break;
            case "pgsql" :
                $this->connexion = new PDO($this->sgbd . ':host=\'' . $this->serveur . '\' port=' . $this->port . ' dbname=\'' . $this->base . '\'', $this->login, $this->mdp);
                $oPDOresult = $this->connexion->query("SET CLIENT_ENCODING TO '" . $this->sPageEncoding . "'");
                break;
            case "oci" :
                if ($this->serveur != "") {
                    // $this->sDsn= $this->sgbd.':dbname=//'.$this->serveur.':'.$this->port.'/'.$this->base.';charset='.$this->sPageEncoding;
                    $this->sDsn = $this->sgbd . ':dbname=//' . $this->serveur . ':' . $this->port . '/' . $this->base . ';charset='.$this->sPageEncoding;
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
    }

    /**
     * Méthodes getSourceEncoding
     * \return Cette méthode permet de retourner l'encodage de la base de données selon le type de BD.
     */
    function getSourceEncoding() {
        if ($this->sgbd != "") {
            try {
                switch ($this->sgbd) {
                    case "sqlite":
                        // Requête qui va permettre de récupérer l'encodage de la base
                        break;
                    case "pgsql" :
                        $sSql = "SELECT datname,encoding FROM pg_database where datname=[sDataBase]";
                        $oPDOresult = $this->executeWithParams($sSql, array('sDataBase' => array('type' => 'string', 'value' => $this->base)));
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
//                        $sSql = str_replace('sDataBase', $this->base, $sSql);
                        $oPDOresult = $this->executeWithParams($sSql, array());
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
     * Méthodes pour afficher le message en HTML.
     * \param $message Message à afficher.
     * \private
     */
    function setBDMessage($message) {
        $this->sMessage .= $message . "<br>";
    }

    /**
     * Méthodes pour afficher le message en HTML encodé en UTF-8. 
     * ATTENTION : A utiliser seulement pour des chaines écrites à la main. Ne pas utiliser pour des chaines ou il y a concaténation entre "chaine écrite à la main" et chaine venant de la Base de données
     * \param $message Message à afficher.
     * \private
     */
    function setStringMessage($message) {
        $this->sMessage .= iconv("ISO-8859-1", $this->sPageEncoding, $message) . "<br>";
    }

    /**
     * Méthodes qui permet d'encoder une chaine en UTF-8 pour que celle-ci soit correctement écrite dans les fichier de log. 
     * \param $sMessageEncode Message à afficher.
     * \return La chaine à écrire dans le fichier de log.
     */
    function stringMessageEncode($sMessageEncode) {
        $sMessageEncode = iconv("ISO-8859-1", $this->sPageEncoding, $sMessageEncode);
        return $sMessageEncode;
    }

    /**
     * \private
     * \return Le message à afficher.
     */
    function getBDMessage() {
        if ($this->sMessage != "")
            $sResult = USER_LABEL . $this->login . ERROR_LABEL . $this->sMessage;
        else
            $sResult = "";
        return $sResult;
    }

    /**
     * Supprime le message à afficher.
     * \private
     */
    function cleanMessage() {
        $this->sMessage = "";
    }

    // ---- Partie publique -------------------------

    /**
     * DEPRECATED
     * Méthode indiquant la liste des tables contenues dans la base de données.
     * \return Le jeu d'enregistrement de la liste des tables.
     */
    function listeDesTables() {
        $sSql = "SHOW TABLES FROM " . $this->base;
        $oPDOresult = $this->execute($sSql);
        return $oPDOresult;
    }

    /**
     * Méthode d'exécution d'une requête.
     * Si la requête SQL est variable en fonction d'un ou plusieurs paramètres
     * il faut ABSOLUMENT utiliser executeWithParams au lieu de execute
     * afin d'éviter les injections SQL
     * \param $sRequete Requête à exécuter.
     * \return Le jeu d'enregistrement généré par l'exécution.
     */
    function execute($sRequete) {
        writeToDebugLog($sRequete);
        if (is_null($this->connexion)) {
            $this->erreurRencontree = 1;
            $this->setBDMessage(ERROR_REQUEST_ERROR);
            writeToErrorLog(html_entity_decode(ERROR_REQUEST_IMPOSSIBLE . $sRequete));
            writeToSqlErrorLog($sRequete);
            return false;
        }
        $oPDOresult = $this->connexion->query($sRequete);
        if ($this->connexion->errorCode() === "00000") {
            $this->erreurRencontree = 0;
            if (strtolower(substr($sRequete, 0, 6)) != "select") {
                writeToSqlLog($sRequete);
            }
            return $oPDOresult;
        } else {
            $aPDOError = $this->connexion->errorInfo();
            $this->erreurRencontree = 1;
            $this->setBDMessage(ERROR_REQUEST_ERROR);
            writeToErrorLog(html_entity_decode(ERROR_REQUEST_IMPOSSIBLE . $sRequete . "." . RETURN_BD_LABEL . "'" . $aPDOError[2] . "'"));
            writeToSqlErrorLog($sRequete);
            return false;
        }
    }

    /**
     * Méthode sure d'exécution d'une requête avec paramètres.
     * Si la requête SQL est variable en fonction d'un ou plusieurs paramètres
     * il faut ABSOLUMENT utiliser executeWithParams au lieu de execute
     * afin d'éviter les injections SQL
     * \param $sRequete Requête à exécuter.
     * \param $aParams Paramètres à ajouter dans la requête.
     * \param $bLogSQL true si on veut logger les requêtes autre que SELECT dans sql.log
     * \return Le jeu d'enregistrement généré par l'exécution.
     */
    function executeWithParams($sRequete, $aParams, $bLogSQL = true) {

        $this->connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);

        // Supprime les paramètres non présents dans la requête
        foreach ($aParams as $key => $value) {
            if (strpos($sRequete, $key) === false) {
                unset($aParams[$key]);
            }
        }
        
        $aSqlParams = array();
        $aParamsCpy = $aParams;
        $sRequeteToLog2 = $sRequete . ' | ' . json_encode($aParams, true);

        // Pré-traitement des paramètres
        foreach ($aParamsCpy as $key => $value) {
            switch ($aParamsCpy[$key]['type']) {
                case 'group':
                    $aGroupValues = explode('|', $aParamsCpy[$key]['value']);
                    $sInFilter = '';
                    for ($i = 0; $i < count($aGroupValues); $i++) {
                        $aGroupValues[$i] = trim($aGroupValues[$i]);
                        if (strlen($sInFilter) > 0) {
                            $sInFilter .= ', ';
                        }
                        $sValueKey = 'value_' . vitisUniqId();
                        $aParams[$sValueKey] = array('value' => $aGroupValues[$i], 'type' => 'string');
                        $sInFilter .= '[' . $sValueKey . ']';
                    }
                    unset($aParams[$key]);
                    $sRequete = str_replace('[' . $key . ']', $sInFilter, $sRequete);
                    break;
                default:
                    break;
            }
        }

        $sRequeteToLog1 = $sRequete;

        // Traitement des paramètres
        foreach ($aParams as $key => $value) {

            // Requête à logger
            switch ($aParams[$key]['type']) {
                case 'integer':
                case 'column_name':
                case 'schema_name':
                case 'table_name':
                    $sRequeteToLog1 = str_replace('[' . $key . ']', $aParams[$key]['value'], $sRequeteToLog1);
                    break;
                default:
                    $sRequeteToLog1 = str_replace('[' . $key . ']', "'" . $aParams[$key]['value'] . "'", $sRequeteToLog1);
                    break;
            }

            // Requête à executer
            switch ($aParams[$key]['type']) {
                case 'integer':
                case 'number':
                case 'string':
                case 'boolean':
                    // Valeur de type booléen et vide.
                    if ($aParams[$key]['type'] == 'boolean' && $aParams[$key]['value'] == '')
                        $aParams[$key]['value'] = null;
                    // Configuration du pramètre à utiliser lors de l'execution
                    $aSqlParams[':' . $key] = $aParams[$key]['value'];
                    $sRequete = str_replace('[' . $key . ']', ':' . $key, $sRequete);
                    break;
                    // Configuration du pramètre à utiliser lors de l'execution
                    $aSqlParams[':' . $key] = $aParams[$key]['value'];
                    $sRequete = str_replace('[' . $key . ']', ':' . $key, $sRequete);
                    break;
                case 'geometry':
                case 'quoted_string':
                    // Protège contre les quotes
                    $aParams[$key]['value'] = $this->protegeChaine($aParams[$key]['value']);
                    // Remplacement dans la reaqête
                    $sRequete = str_replace('[' . $key . ']', $aParams[$key]['value'], $sRequete);
                    break;
                case 'column_name':
                case 'schema_name':
                case 'table_name':
                    // Vérification de la syntaxe pour qu'elle corresponde à une colonne, table, schema
                    if (preg_match('/^[\p{L}\p{N}@$#_]{0,127}$/', $aParams[$key]['value'])) {
                        // Remplacement dans la reaqête
                        $sRequete = str_replace('[' . $key . ']', $aParams[$key]['value'], $sRequete);
                    } else {
                        writeToSqlErrorLog($sRequeteToLog2 . ' | ' . $sRequeteToLog1 . ' | ' . $aParams[$key]['value'] . ' not match with column_name, schema_name, table_name');
                    }
                    break;
                case 'double_quote':
                    $aParams[$key]['value'] = '"' . $this->protegeSpecialChar($aParams[$key]['value']) . '"';
                    $sRequete = str_replace('[' . $key . ']', $aParams[$key]['value'], $sRequete);
                    break;
                default:
                    break;
            }
        }

        $oPDOresult = $this->connexion->prepare($sRequete);
        if ($oPDOresult) {
            foreach ($aParams as $key => $value) {
                $bBindOk = true;
                switch ($aParams[$key]['type']) {
                    case 'integer':
                        $bBindOk = $oPDOresult->bindValue(':' . $key, $aParams[$key]['value'], PDO::PARAM_INT);
                        break;
                    case 'number':
                        // Vérifications
                        if (is_string($aParams[$key]['value'])) {
                            // Valeur vide ?
                            if (strlen(trim($aParams[$key]['value'])) == 0) {
                                $aParams[$key]['value'] = null;
                            }
                            // Valeur non numérique ?
                            elseif (!is_numeric($aParams[$key]['value'])) {
                                writeToErrorLog('Error when trying to insert a textual value into a numeric attribute' . json_encode($aParams[$key], true));
                                writeToSqlErrorLog($sRequeteToLog2 . ' | ' . $sRequeteToLog1);
                                $this->setBDMessage(ERROR_REQUEST_ERROR);
                                $this->erreurRencontree = 1;
                                return false;
                            }
                            // Valeur numérique entre côtes
                            else {
                                $aParams[$key]['value'] = floatval($aParams[$key]['value']);
                            }
                        }
                        $bBindOk = $oPDOresult->bindValue(':' . $key, $aParams[$key]['value']);
                        break;
                    case 'string':
                        $bBindOk = $oPDOresult->bindValue(':' . $key, $aParams[$key]['value'], PDO::PARAM_STR);
                        break;
                    case 'boolean':
                        $bBindOk = $oPDOresult->bindValue(':' . $key, $aParams[$key]['value'], PDO::PARAM_BOOL);
                        break;
                    default:
                        break;
                }
                if (!$bBindOk) {
                    writeToErrorLog('Error when binding ' . print_r($aParams[$key], true));
                    $this->setBDMessage(ERROR_REQUEST_ERROR);
                    writeToErrorLog(print_r($this->connexion->errorInfo(), true));
                    return false;
                }
            }

            $oPDOresult->execute();
            if ($bLogSQL) {
                writeToDebugLog($sRequeteToLog2 . ' | ' . $sRequeteToLog1);
            }

            if ($oPDOresult->errorCode() === "00000") {
                $this->erreurRencontree = 0;
                if (strtolower(substr($sRequete, 0, 6)) != "select" && $bLogSQL) {
                    writeToSqlLog($sRequeteToLog1);
                }
                return $oPDOresult;
            } else {
                $aPDOError = $oPDOresult->errorInfo();
                $this->erreurRencontree = 1;
                $this->setBDMessage(ERROR_REQUEST_ERROR);
                writeToErrorLog(html_entity_decode(ERROR_REQUEST_IMPOSSIBLE . $sRequete . "." . RETURN_BD_LABEL . "'" . $aPDOError[2] . "'"));
                writeToSqlErrorLog($sRequeteToLog2 . ' | ' . $sRequeteToLog1);
                return false;
            }
        }
    }

    /**
     * Execute un bloc de multiples requêtes SQL
     * @param string $sSql
     * @return Le jeu d'enregistrement généré par l'exécution.
     */
    function executeBlock($sSql) {

        $this->connexion->setAttribute(PDO::ATTR_EMULATE_PREPARES, 1);
        $this->connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        try {
            $oPDOresult = $this->connexion->prepare($sSql);
            if ($oPDOresult) {
                $oPDOresult->execute();
                writeToDebugLog($sSql);
                if ($this->connexion->errorCode() === "00000") {
                    $this->erreurRencontree = 0;
                    writeToSqlLog($sSql);
                    return $oPDOresult;
                } else {
                    $aPDOError = $this->connexion->errorInfo();
                    $this->erreurRencontree = 1;
                    $this->setBDMessage(ERROR_REQUEST_ERROR);
                    writeToErrorLog(html_entity_decode(ERROR_REQUEST_IMPOSSIBLE . $sSql . "." . RETURN_BD_LABEL . "'" . $aPDOError[2] . "'"));
                    writeToSqlErrorLog($sSql);
                    return false;
                }
            }
        } catch (PDOException $e) {
            $sPDOErrorMessage = $e->getMessage();
            $this->erreurRencontree = 1;
            $this->setBDMessage(ERROR_REQUEST_ERROR);
            writeToErrorLog(html_entity_decode(ERROR_REQUEST_IMPOSSIBLE . $sSql . "." . RETURN_BD_LABEL . "'" . $sPDOErrorMessage . "'"));
            writeToSqlErrorLog($sSql);
            die();
            return false;
        }
    }

    /**
     * Méthode permettant de démarrer une transaction.
     */
    function demarreTransaction() {
        $this->connexion->beginTransaction();
    }

    /**
     * Méthode permettant de terminer une transaction.
     */
    function termineTransaction() {
        $this->connexion->commit();
    }

    /**
     * Méthode permettant d'annuler une transaction.
     */
    function annuleTransaction() {
        $this->connexion->rollBack();
    }

    /**
     * Méthode de suppression d'un objet PDO::Statement (nécessaire pour l'exécution
     * de requêtes successives).
     * \return Null.
     */
    function fermeResultat() {
        return null;
    }

    /**
     * Accès à la ligne suivante, sous forme d'objet
     * \param $oPDOresult  Jeu d'enregistrement résultant de l'éxécution d'une requête.
     * \return La ligne suivante dans le jeu d'enregistrement.
     */
    function objetSuivant($oPDOresult) {
        return $oPDOresult->fetch(PDO::FETCH_OBJ);
    }

    /**
     * Accès à la ligne suivante, sous forme de tableau associatif
     * \param $oPDOresult  Jeu d'enregistrement résultant de l'éxécution d'une requête.
     * \return La ligne suivante dans le jeu d'enregistrement.
     */
    function ligneSuivante($oPDOresult) {
        return $oPDOresult->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Accès au résultat sous forme de tableau associatif
     * \param $oPDOresult  Jeu d'enregistrement résultant de l'éxécution d'une requête.
     * \return un tableau contenant les enregistrements sous forme de tableau associatif (champs=>valeur).
     */
    function getResultTableAssoc($oPDOresult) {
        return $oPDOresult->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Accès à la ligne suivante, sous forme de tableau indicé
     * \param $oDBresultat Jeu d'enregistrement.
     * \return La ligne suivante dans le jeu d'enregistrement.
     */
    function tableauSuivant($oPDOresult) {
        return $oPDOresult->fetch(PDO::FETCH_NUM);
    }

    /**
     * Méthode indiquant si une erreur a été rencontrée
     * \return L'erreur rencontrée.
     */
    function enErreur() {
        return $this->erreurRencontree;
    }

    /**
     * DEPRECATED
     * Méthode donnant l'id de la dernière ligne insérée.
     * \return L'id de la dernière ligne insérée.
     */
    function idDerniereLigne() {
        return mysql_insert_id();
    }

    /**
     * Méthode permettant de protéger les caractéres spéciaux d'une chaine de caractère
     * dans une requête.
     * \param $chaine Chaine de caractère à protéger.
     */
    function protegeChaine($chaine) {
        return $this->connexion->quote($chaine);
    }

    /**
     * Merthode permettant de remplacer les caractères critiques.
     * Ces caractères sont les guillemets simples ('), guillemets doubles ("), antislash (\) et NULLE (le caractère NULL).
     * @param string $chaine
     * @return string
     */
    function protegeSpecialChar($chaine) {
        return addslashes($chaine);
    }

    /**
     * Méthode indiquant le nombre d'attributs dans le résultat.
     * \param $res  Jeu d'enregistrement résultant de l'éxécution d'une requête.
     * \return Le nombre d'attributs dans le résultat.
     */
    function getFieldsNumber($oPDOresult) {
        return $oPDOresult->columnCount();
    }

    /**
     * Méthode donnant le nom d'un attribut.
     * \param $oPDOresult  Jeu d'enregistrement résultant de l'éxécution d'une requête.
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
//                $resultat = $this->execute('SELECT * FROM COLS WHERE name = \'' . strtoupper($sTable) . '\'');
                $resultat = $this->executeWithParams('SELECT * FROM COLS WHERE name = \'[sTable]\'', array('sTable' => array('type' => 'column_name', 'value' => $sTable)));
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
     * Méthode indiquant le nombre de lignes dans le résultat. Utilisez  PHP> 5.1
     * \param $oPDOresult Jeu d'enregistrement résultant de l'éxécution d'une requête.
     * \return Le nombre de lignes dans le résultat.
     */
    function nombreLigne($oPDOresult) {
        return $oPDOresult->rowCount();
    }

    /**
     * Méthode de déconnexion.
     */
    function quitter() {
        $this->connexion->null;
    }

    /**
     * Méthode permettant de récupérer le type d'une attribut.
     * \param $oPDOresult Jeu d'enregistrement résultant de l'éxécution d'une requête.
     * \param $iNumFields Nombres d'attributs.
     * \param $sFieldName Nom de l'attribut.
     * \return Le type d'une attribut (-1 si l'attribut passé en paramètre n'est pas trouvé, 'VAR_STRING' texte, 'DATE' date, ... ).
     */
    function getType($oPDOresult, $iNumFields, $sFieldName, $sTable) {
        $sType = -1;
        if ($this->sgbd == 'oci') {
//            $resultat = $this->execute('SELECT * FROM COLS WHERE name = \'' . strtoupper($sTable) . '\'');
            $resultat = $this->executeWithParams('SELECT * FROM COLS WHERE name = \'[sTable]\'', array('sTable' => array('type' => 'column_name', 'value' => $sTable)));
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
        // si le champ n'a pas été trouvé, il s'agit d'une erreur
        return $sType;
    }

    /**
     * DEPRECATED
     * Méthode permettant de construire une clause WHERE SQL à partir d'une liste de valeur passées en requête.
     * La table cible est spécifiée en paramètre de la méthode.
     * \param $sSchema Schema de la base de données
     * \param $sTable Table dans laquelle on recherche.
     * \param $aValues Valeurs contenues dans la requête.
     * \param $bListQuery Liste des champs filtrés.
     * \param $bUpper Modification de la casse. Facultatif, false par défaut.
     * \param $bClause Type de clause : AND ou OR. Facultatif, AND par défaut.
     * \return La clause WHERE de la requête SQL de recherche.
     */
    function getWhereClause($sSchema, $sTable, $aValues, $bListQuery, $bLower = false, $sClause = "AND") {
        // LIKE gère tous les types de champs.
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
     * Méthode permettant d'ajouter des enregistrements.
     * \param $sSchema Schema de la base de données
     * \param $sTable Table dans laquelle on ajoute.
     * \param $aValues Valeurs à ajouter.
     * \param $sSequence Nom de la séquence à utiliser.
     * \param $iIdField Nom de l'attribut identifiant.
     * \param $bGetSql Booléen : doit on renvoyer le code sql ou exécuter la requête? Vaut 'false' par défaut.
     * \return L'id de la dernière ligne insérée.
     */
    function insert($sSchema, $sTable, $aValues, $sSequence, $iIdField, $bGetSql = false) {

        $aSQLParams = array(
            'sSchema' => array('type' => 'column_name', 'value' => $sSchema),
            'sTable' => array('type' => 'column_name', 'value' => $sTable)
        );

        // Insére les éléments du tableau $aValues dans $sTable et renvoie l'identifiant de l'enregistrement correspondant (en fait le dernier)
        switch ($this->sgbd) {
//            case 'mysql' :
//                $sSql = "INSERT INTO `$sTable` (";
//                $sSqlList = $this->AddLimite(0, 0, "SELECT * FROM " . $sTable);
//                $sProtectField = "`";
//                break;
            case 'pgsql' :
                $sSql = 'INSERT INTO "[sSchema]"."[sTable]" (';
//                $sSqlList = $this->AddLimite(0, 0, 'SELECT * FROM ' . $sSchema . '.' . $sTable);

                $aSqlList = $this->AddLimiteWithParams(0, 0, 'SELECT * FROM "[sSchema]"."[sTable]"');
                $sSqlList = $aSqlList['sql'];
                $aSQLListParams = array_merge($aSQLParams, $aSqlList['params']);

                $sProtectField = '"';
                // Utilisation de la sequence pour récupérer un identifiant
                if ($sSequence) {
//                    $oPDOresult = $this->execute('SELECT nextval(\'' . $sSequence . '\')');
                    $oPDOresult = $this->executeWithParams('SELECT nextval([sSequence])', array('sSequence' => array('type' => 'string', 'value' => $sSequence)));
                    if ($oPDOresult !== false)
                        $aIdValue = $this->ligneSuivante($oPDOresult);
                    $iIdValue = $aIdValue['nextval'];
                    $aValues[$iIdField] = $iIdValue;
                    $oPDOresult = $this->fermeResultat();
                }
                break;
//            case 'oci' :
//                $sSql = 'INSERT INTO ' . $sTable . '(';
//                $sSqlList = 'SELECT ' . $sTable . '.* FROM ' . $sTable . ' WHERE ROWNUM <=1 AND ROWNUM >=0';
//                $sProtectField = '"';
//                // Utilisation de la sequence pour récupérer un identifiant
//                if ($sSequence) {
//                    $oPDOresult = $this->execute('SELECT ' . $sSequence . '.nextval FROM dual');
//                    if ($oPDOresult !== false)
//                        $aIdValue = $this->ligneSuivante($oPDOresult);
//                    $iIdValue = $aIdValue['NEXTVAL'];
//                    $aValues[$iIdField] = $iIdValue;
//                    $oPDOresult->closeCursor();
//                }
//                break;
        }
        $sFields = "";
        $sValues = "";

//        $resultat = $this->execute($sSqlList);
        $resultat = $this->executeWithParams($sSqlList, $aSQLListParams);
        $iNumFields = $this->getFieldsNumber($resultat);

        foreach ($aValues as $sField => $sValue) {
            if ($iIdField == $sField)
                $iIdValue = $sValue;
            if (substr_count($sField, '.') == 1)
                $sField = substr($sField, strlen($sTable) + 1);
            $sType = $this->getType($resultat, $iNumFields, $sField, $sTable);
            if ($sType != -1) {

                $sFields = addDelimitedAttribute($sFields, $sField, ",", $sProtectField);
                $aFormatedField = $this->formatForSqlWithParams($sValue, $sField, $sType, $sSchema, $sTable);
                $sValues = addDelimitedString($sValues, $aFormatedField['field'], ",");

                switch ($this->parseType($sType)) {
                    case 'int':
                        $aSQLParams[$aFormatedField['fieldKey']] = array('type' => 'number', 'value' => $aFormatedField['value']);
                        break;
                    case 'float':
                    case 'decimal':
                        $aSQLParams[$aFormatedField['fieldKey']] = array('type' => 'number', 'value' => $aFormatedField['value']);
                        break;
                    case 'bool':
                        $aSQLParams[$aFormatedField['fieldKey']] = array('type' => 'boolean', 'value' => $aFormatedField['value']);
                        break;
                    case 'geometry':
                        $aSQLParams[$aFormatedField['fieldKey']] = array('type' => 'geometry', 'value' => $aFormatedField['value']);
                        break;
                    default:
                        $aSQLParams[$aFormatedField['fieldKey']] = array('type' => 'string', 'value' => $aFormatedField['value']);
                        break;
                }
            }
        }

        if (empty($iIdValue)) {
            $sSql = $sSql . $sFields . ") VALUES (" . $sValues . ") RETURNING \"" . $iIdField . "\"";
        } else {
            $sSql = $sSql . $sFields . ") VALUES (" . $sValues . ")";
        }

        $resultat = $this->fermeResultat();
        if ($bGetSql) {
            return $sSql;
        } else {

            $iResult = $this->executeWithParams($sSql, $aSQLParams);
            if ($iResult === false) {
                return $iResult;
            }

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
     * DEPRECATED
     * Méthode permettant d'ajouter des enregistrements par le biais de la commande SQL 'COPY'.
     * Methode implémentée pour PostgreSQL.
     * \param $sSchema Schema de la base de données
     * \param $sTable Table dans laquelle on ajoute.
     * \param $aValues Valeurs à ajouter.
     * \param $sSequence Nom de la séquence à utiliser.
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
     * Méthode permettant de mettre à jour des enregistrements.
     * \param $sSchema Schema de la base de données
     * \param $sTable Table dans laquelle on met à jour.
     * \param $aValues Valeurs à mettre à jour.
     * \param $sAttribute Attribut de la clause "WHERE".
     * \param $sId Valeur de l'attribut.
     * \param $sIdType Type de l'attribut.
     */
    function update($sSchema, $sTable, $aValues, $sAttribute, $sId, $sIdType = "") {

        $aSQLParams = array(
            'sSchema' => array('type' => 'column_name', 'value' => $sSchema),
            'sTable' => array('type' => 'column_name', 'value' => $sTable)
        );

        // Modifie la table $sTable à partir du contenu du tableau $aValues
        // Le nom des éléments de $aValues doit être le même que les nom de champs
        // Le type de chaque champ est pris en compte de manière dynamque
        switch ($this->sgbd) {
//            case 'mysql' :
//                $sSql = "UPDATE `$sTable` set ";
//                $sSqlList = $this->AddLimite(0, 0, "SELECT * FROM " . $sTable);
//                $sProtectField = "`";
//                break;
            case 'pgsql' :
                $sSql = 'UPDATE "' . $sSchema . '"."' . $sTable . '" set ';
//                $sSqlList = $this->AddLimite(0, 0, 'SELECT * FROM ' . $sSchema . '.' . $sTable);
                $aSqlList = $this->AddLimiteWithParams(0, 0, 'SELECT * FROM "[sSchema]"."[sTable]"');
                $sSqlList = $aSqlList['sql'];
                $aSQLListParams = array_merge($aSQLParams, $aSqlList['params']);
                $sProtectField = '"';
                break;
//            case 'oci' :
//                $sSql = 'UPDATE ' . $sTable . ' set ';
//                $sSqlList = $this->AddLimite(0, 1, 'SELECT * FROM ' . $sTable);
//                $sProtectField = '';
//                break;
        }
        $sPaires = "";
        $sFields = "";
        $sValues = "";

        $resultat = $this->executeWithParams($sSqlList, $aSQLListParams);
        $iNumFields = $this->getFieldsNumber($resultat);

        foreach ($aValues as $sField => $sValue) {
            if (substr_count($sField, '.') == 1)
                $sField = substr($sField, strlen($sTable) + 1);
            $sType = $this->getType($resultat, $iNumFields, $sField, $sTable);

            if ($sType != -1) {

                $aFormatedField = $this->formatForSqlWithParams($sValue, $sField, $sType, $sSchema, $sTable);
                $sPaire = addDelimitedAttribute("", $sField, "", $sProtectField) . '=' . $aFormatedField['field'];
                $sPaires = addDelimitedString($sPaires, $sPaire, ", ");

                switch ($this->parseType($sType)) {
                    case 'int':
                        $aSQLParams[$aFormatedField['fieldKey']] = array('type' => 'number', 'value' => $aFormatedField['value']);
                        break;
                    case 'float':
                    case 'decimal':
                        $aSQLParams[$aFormatedField['fieldKey']] = array('type' => 'number', 'value' => $aFormatedField['value']);
                        break;
                    case 'bool':
                        $aSQLParams[$aFormatedField['fieldKey']] = array('type' => 'boolean', 'value' => $aFormatedField['value']);
                        break;
                    case 'geometry':
                        $aSQLParams[$aFormatedField['fieldKey']] = array('type' => 'geometry', 'value' => $aFormatedField['value']);
                        break;
                    default:
                        $aSQLParams[$aFormatedField['fieldKey']] = array('type' => 'string', 'value' => $aFormatedField['value']);
                        break;
                }
            }
        }

        if ($sPaires != "") {
            $sSql = $sSql . $sPaires;
            if ($sAttribute != "") {

                if (!is_array($sId)) {
                    $aWhereClause = $this->AddWhereClauseWithParams($sAttribute, $sId, 'string');
                    $aSQLParams = array_merge($aSQLParams, $aWhereClause['params']);
                    $sSql = $sSql . $aWhereClause['sql'];
                } else {
                    $sId = implode(",", $sId);
                    $aInClause = $this->AddInClauseWithParams($sSchema, $sAttribute, $sId);
                    $aSQLParams = array_merge($aSQLParams, $aInClause['params']);
                    $sSql = $sSql . ' WHERE ' . $aInClause['sql'];
                }
            }
            $resultat = $this->fermeResultat();
            $iResult = $this->executeWithParams($sSql, $aSQLParams);

            if ($iResult !== false) {
                $iResult = $this->fermeResultat();
            }
        }
    }

    /**
     * Récupère un type de colonne Postgres (int8, varchar(255) etc..) et renvoie le type simple (int, varchar, float)
     * @param string $str
     * @return string
     */
    function parseType($str) {

        $sType = '';
        $arr = str_split($str);
        $pattern = '/^[a-z]/';

        for ($i = 0; $i < count($arr); $i++) {
            if (!preg_match($pattern, $arr[$i])) {
                break;
            } else {
                $sType .= $arr[$i];
            }
        }

        return $sType;
    }

    /**
     * Méthode permettant de supprimer des enregistrements de la table passée en paramètre conformément à la clause spécifiée.
     * \param $sSchema Schema de la base de données
     * \param $sTable Table dans laquelle on supprime.
     * \param $sAttribute Attribut de la clause "WHERE".
     * \param $sId Valeur de l'attribut.
     * \param $sIdType Types de l'attribut.
     */
    function delete($sSchema, $sTable, $sAttribute, $sId, $sIdType = "") {

        $aSQLParams = array(
            'sSchema' => array('type' => 'column_name', 'value' => $sSchema),
            'sTable' => array('type' => 'column_name', 'value' => $sTable)
        );

        switch ($this->sgbd) {
//            case 'mysql' :
//                $sSql = "DELETE FROM `$sTable` WHERE " . $sAttribute;
//                break;
            case 'pgsql' :

                $aAttributs = explode('.', $sAttribute);

                // Si le schema est ou pas défini dans sAttribute
                if (count($aAttributs) === 1) {
                    $sColumnKey = 'column_' . vitisUniqId();
                    $sSql = 'DELETE FROM "[sSchema]"."[sTable]" WHERE "[' . $sColumnKey . ']"';
                    $aSQLParams[$sColumnKey] = array('type' => 'column_name', 'value' => $aAttributs[0]);
                } else if (count($aAttributs) === 2) {
                    $sSchemaKey = 'schema_' . vitisUniqId();
                    $sColumnKey = 'column_' . vitisUniqId();
                    $sSql = 'DELETE FROM "[sSchema]"."[sTable]" WHERE "[' . $sSchemaKey . ']"."[' . $sColumnKey . ']"';
                    $aSQLParams[$sSchemaKey] = array('type' => 'column_name', 'value' => $aAttributs[0]);
                    $aSQLParams[$sColumnKey] = array('type' => 'column_name', 'value' => $aAttributs[1]);
                }

                break;
//            case 'oci' :
//                $sSql = "DELETE FROM $sTable WHERE " . $sAttribute;
//                break;
        }
        $sSql .= ' IN ([sIds])';
        $aSQLParams['sIds'] = array('type' => 'group', 'value' => $sId);
        $iResult = $this->executeWithParams($sSql, $aSQLParams);
        if ($iResult !== false) {
            $iResult = $this->fermeResultat();
        }
    }

    /**
     * DEPRECATED
     * Méthode permettant d'ajouter des enregistrements dans une table liée.
     * \param $sTableName Table dans laquelle on ajoute.
     * \param $sAttributePK Attribut PK.
     * \param $sPKValue Valeur de l'attribut PK.
     * \param $aAttributeList Tableau contenant les attributs et leurs valeurs.
     * \param $sSequence Séquence.
     * \param $sSchema Schéma.
     */
    function insertLinkedTable($sTableName, $sAttributePK, $sPKValue, $aAttributeList, $sSequence, $sSchema) {
        switch ($this->sgbd) {
            case 'mysql' :
                //méthode non implémenté pour mysql
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
     * DEPRECATED
     * Méthode permettant d'ajouter des enregistrements sans ajout de nouvel Id dans une table liée.
     * \param $sSchema Schéma.
     * \param $sTable Table dans laquelle on ajoute.
     * \param $aAttributeFK Tableau contenant les attributs.
     * \param $aValueList Tableau contenant les valeurs.
     */
    function insertWithoutIdLinkedTable($sSchema, $sTable, $aAttributeList, $aValueList) {
        //Méthode implémenté uniquement pour postgresql
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
     * DEPRECATED
     * Méthode permettant de mettre à jour des enregistrements dans une table liée.
     * \param $sTableName Table dans laquelle on met un enregistrement à jour.
     * \param $sAttributePK Attribut PK.
     * \param $sAttributeFK Attribut FK.
     * \param $sFKList Liste des valeurs de l'attribut FK.
     * \param $sPKValue Valeur de l'attribut PK.
     */
    function updateLinkedTable($sTableName, $sAttributePK, $sAttributeFK, $sFKList, $sPKValue) {
        switch ($this->sgbd) {
            case 'mysql' :
                //méthode non implémenté pour mysql
                break;
            case 'pgsql' :
                $sSql = "UPDATE " . $sTableName . " SET " . $sAttributePK . "=" . $sPKValue . " WHERE " . $sAttributeFK . "=";
                break;
            case 'oci' :
                //méthode non implémenté pour oci
                break;
        }
        $aFKList = explode("@", $sFKList);
        //Met à jour les enregistrements de $aFKList
        foreach ($aFKList as $sFKValue) {
            writeToDebugLog($sSql . $sFKValue);
            writeToSqlLog($sSql);
            $this->connexion->query($sSql . $sFKValue);
        }
    }

    /**
     * DEPRECATED
     * Méthode permettant de générer une clause SQL simple de type "LIMIT" selon le sgbd.
     * \param $iMinRowValue Valeur minimale du limit.
     * \param $iRowPage Nombre d'enregistrements sélectionnés.
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
     * Méthode permettant de générer une clause SQL simple de type "LIMIT" selon le sgbd.
     * \param $iMinRowValue Valeur minimale du limit.
     * \param $iRowPage Nombre d'enregistrements sélectionnés.
     */
    function AddLimiteWithParams($iMinRowValue, $iRowPage, $sSql) {
        switch ($this->sgbd) {
//            case 'mysql' :
//                $sSql .= " LIMIT " . $iMinRowValue . "," . $iRowPage;
//                break;
            case 'pgsql' :
                $sSql .= " LIMIT [iRowPage] OFFSET [iMinRowValue]";
                $aSQLParams = array(
                    'iRowPage' => array('type' => 'string', 'value' => $iRowPage),
                    'iMinRowValue' => array('type' => 'string', 'value' => $iMinRowValue)
                );
                break;
//            case 'oci' :
//                $iRowPage = $iRowPage + $iMinRowValue;
//                $sSql1 = "SELECT * FROM ( SELECT * FROM (" . $sSql . ") WHERE ROWNUM <= " . $iRowPage . ") MINUS ( SELECT * FROM (" . $sSql . ") WHERE ROWNUM <= " . $iMinRowValue . ")";
//                if (substr_count($sSql, "ORDER BY") >= 1) {
//                    $sSql = "SELECT * FROM ( " . $sSql1 . ")" . stristr($sSql, "ORDER BY");
//                } else {
//                    $sSql = $sSql1;
//                }
//                break;
        }
        return array(
            'sql' => $sSql,
            'params' => $aSQLParams
        );
    }

    /**
     * DEPRECATED
     * Méthode permettant de générer une clause SQL simple de type "ORDER BY" selon le sgbd.
     * \param $sAttribute Attribut.
     * \param $sOrder Ordre dans lequel doivent étre triées les données "ASC" ou "DESC".
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
     * DEPRECATED
     * Méthode permettant de générer une clause SQL simple de type "WHERE" selon le sgbd.
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
     * Selon executeWithParams
     * Méthode permettant de générer une clause SQL simple de type "WHERE" selon le sgbd.
     * \param $sAttribute Attribut.
     * \param $sId Valeur de l'attribut.
     * \param $sType Type de l'attribut.
     */
    function AddWhereClauseWithParams($sAttribute, $sId, $sType = "string") {
        switch ($this->sgbd) {
//            case 'mysql' :
//                $sSql = " WHERE " . $sAttribute . "=" . $sId;
//                break;
            case 'pgsql' :

                $aAttributs = explode('.', $sAttribute);

                // Si le schema est ou pas défini dans sAttribute
                if (count($aAttributs) === 1) {

                    $sColumnKey = 'column_' . vitisUniqId();
                    $sValueKey = 'value_' . vitisUniqId();

                    $sSql = ' WHERE "[' . $sColumnKey . ']" = [' . $sValueKey . ']';
                    $aSQLParams = array(
                        $sColumnKey => array('type' => 'column_name', 'value' => $aAttributs[0]),
                        $sValueKey => array('type' => $sType, 'value' => $sId)
                    );
                } else if (count($aAttributs) === 2) {

                    $sSchemaKey = 'schema_' . vitisUniqId();
                    $sColumnKey = 'column_' . vitisUniqId();
                    $sValueKey = 'value_' . vitisUniqId();

                    $sSql = ' WHERE "[' . $sSchemaKey . ']"."[' . $sColumnKey . ']" = [' . $sValueKey . ']';
                    $aSQLParams = array(
                        $sSchemaKey => array('type' => 'column_name', 'value' => $aAttributs[0]),
                        $sColumnKey => array('type' => 'column_name', 'value' => $aAttributs[1]),
                        $sValueKey => array('type' => $sType, 'value' => $sId)
                    );
                }

                break;
//            case 'oci' :
//                $sId = "'" . $sId . "'";
//                $sSql = ' WHERE ' . $sAttribute . '= ' . $sId;
//                break;
        }
        return array(
            'sql' => $sSql,
            'params' => $aSQLParams
        );
    }

    /**
     * DEPRECATED
     * Méthode permettant de générer une clause SQL simple de type "AND" selon le sgbd.
     * \param $sSchema Schema de la base de données
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
     * DEPRECATED
     * Méthode permettant de générer une clause SQL simple de type "IN" selon le sgbd.
     * \param $sSchema Schema de la base de données
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
     * Selon executeWithParams
     * Méthode permettant de générer une clause SQL simple de type "IN" selon le sgbd.
     * \param $sSchema Schema de la base de données
     * \param $sAttribute Attribut.
     * \param $sId Valeurs de l'attribut.
     */
    function AddInClauseWithParams($sSchema, $sAttribute, $sId) {
        switch ($this->sgbd) {
//            case 'mysql' :
//                // Vide
//                break;
            case 'pgsql' :

                $aAttributs = explode('.', $sAttribute);

                // Si le schema est ou pas défini dans sAttribute
                if (count($aAttributs) === 1) {

                    $sColumnKey = 'column_' . vitisUniqId();
                    $sValueKey = 'value_' . vitisUniqId();

                    $sSql = '"[' . $sColumnKey . ']" IN ([' . $sValueKey . '])';
                    $aSQLParams = array(
                        $sColumnKey => array('type' => 'column_name', 'value' => $aAttributs[0]),
                        $sValueKey => array('type' => 'group', 'value' => $sId)
                    );
                } else if (count($aAttributs) === 2) {

                    $sSchemaKey = 'schema_' . vitisUniqId();
                    $sColumnKey = 'column_' . vitisUniqId();
                    $sValueKey = 'value_' . vitisUniqId();

                    $sSql = '"[' . $sSchemaKey . ']"."[' . $sColumnKey . ']" IN ([' . $sValueKey . '])';
                    $aSQLParams = array(
                        $sSchemaKey => array('type' => 'column_name', 'value' => $aAttributs[0]),
                        $sColumnKey => array('type' => 'column_name', 'value' => $aAttributs[1]),
                        $sValueKey => array('type' => 'group', 'value' => $sId)
                    );
                }
                break;
//            case 'oci' :
//                // Vide
//                break;
        }
        return array(
            'sql' => $sSql,
            'params' => $aSQLParams
        );
    }

    /**
     * DEPRECATED
     * Méthode qui renvoie une chaine formatée pour pouvoir étre utilisé dans un requête insert, update ou select.
     * \param $sValue Chaine qui va doit être formatée.
     * \param $sType Type de l'attribut.
     * \param $sSchema Schema contenant la table dont est issu le champ à traiter (vide par défaut).
     * \param $sTable Table dont est issu le champ à traiter (vide par défaut).
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
        // Gestion des types alphanumériques
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
                case ($sType == "date" || $sType == "DATETIME" || $sType == "timestamptz"):
                    $sValue = "'" . implode("-", array_reverse(explode("/", $sValue))) . "'";
                    break;
                default:
                    if ($sValue == "")
                        $sValue = "null";
                    break;
            }
        }
        // Cas particulier : le booléen 'faux' dans PostgreSQL
        if ($sType == "bool" && $this->sgbd == "pgsql" && $sValue == "null")
            $sValue = "false";
        return $sValue;
    }

    /**
     * Méthode qui renvoie une chaine formatée pour pouvoir étre utilisé dans un requête insert, update ou select.
     * \param $sValue Chaine qui va doit être formatée.
     * \param $sType Type de l'attribut.
     * \param $sSchema Schema contenant la table dont est issu le champ à traiter (vide par défaut).
     * \param $sTable Table dont est issu le champ à traiter (vide par défaut).
     */
    function formatForSqlWithParams($sValue, $sField, $sType, $sSchema = "", $sTable = "") {

        $sFieldKey = $sField . '_' . vitisUniqId();

        switch ($this->sgbd) {
            case "pgsql" :
                if (($sType === "geometry") && ($sValue !== "")) {                    
                    $iColumnDimension = $this->getColumnDimension($sSchema, $sTable, $sField);
                    $sForce3DDebut = "";
                    $sForce3DFin = "";
                    $sSRID = $this->getColumnSRID($sSchema, $sTable, $sField);
                    if ($iColumnDimension == 3) {
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
                    if ($this->isEWKTFormat($sValue) && $sSRID != "0") {
                        $sField = $sForce3DDebut . "ST_transform(ST_GeomFromEWKT([" . $sFieldKey . "]), " . $sSRID . ")" . $sForce3DFin;
                    } else {
                        $sField = $sForce3DDebut . "st_geometryFromText([" . $sFieldKey . "]," . $sSRID . ") " . $sForce3DFin;
                    }
                } else {
                    $sField = '[' . $sFieldKey . ']';
                }
                break;
        }

        return array(
            'field' => $sField,
            'fieldKey' => $sFieldKey,
            'value' => $sValue
        );
    }

    /**
     * DEPRECATED
     * Méthode permettant de construire une clause WHERE SQL é partir d'une liste de valeur passées en requête et avec une jointure sur une autre table.
     * La table cible est spécifiée en paramètre de la méthode.
     * \param $sSchema Schema de la base de données
     * \param $sTable Table dans laquelle on recherche.
     * \param $aValues Valeurs contenues dans la requête.
     * \param $bListQuery.
     * \param $sTable_sql
     * \param $pKey
     * \param $isWhereExist
     * \return La clause WHERE de la requête SQL de recherche.
     */
    function getWhereAndClause($sSchema, $sTable, $aValues, $bListQuery, $sTable_sql, $pKey, $isWhereExist = false) {
        // LIKE gère tous les types de champs.
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
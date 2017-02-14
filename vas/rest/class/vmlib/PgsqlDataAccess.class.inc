<?php

/**
 * \file PgsqlDataAccess.class.inc
 * \brief PgsqlDataAccess.class.inc \n \n Ce fichier contient la classe php PgsqlDataAccess
 *
 * Cette classe permet la gestion des utilisateurs PostgreSQL.
 *
 * Elle permet de créer un utilisateur un niveau du noyau PostgreSQL, mais aussi
 * d'attribuer différents niveaux de droits à cet utilisateur sur une base de données distincte :
 *
 * \li Utilisateur simple (sélection).
 * \li Administrateur (sélection, mise à jour, suppression)
 *
 * Avec cette classe, la gestion des utilisateurs se fait toujours au niveau du noyau PostgreSQL.
 *
 * \author Frédéric Mauro
 * \author Fabien Marty <fabien.marty@veremes.com>
 */

/**
 * \class PgsqlDataAccess
 * \brief PgsqlDataAccess Class \n \n PgsqlDataAccess est une classe PHP qui permet de récuperer des Meta données du noyau PostgreSQL.
 *
 * Cette classe permet la gestion des utilisateurs PostgreSQL.
 *
 * Elle permet de créer un utilisateur un niveau du noyau PostgreSQL, mais aussi
 * d'attribuer différents niveaux de droits à cet utilisateur sur une base de données distincte :
 *
 * \li Utilisateur simple (sélection).
 * \li Administrateur (sélection, mise à jour, suppression)
 *
 * Avec cette classe, la gestion des utilisateurs se fait toujours au niveau du noyau PostgreSQL.
 *
 * \author Frédéric Mauro
 * \author Fabien Marty <fabien.marty@veremes.com>
 */
class PgsqlDataAccess {

    /**
     * Objet connexion à la base de données PostgreSQL.
     */
    var $oBd;

    /**
     * Base de données métier.
     */
    var $sDatabase;

    /**
     * Serveur courant.
     */
    var $sServer;

    /**
     * Nom des groupes d'utilisateur
     */
    var $sRoleUser;
    var $sRoleAdmin;

    /**
     * \param $oBd Base de données noyau PostgreSQL.
     * \param $sDatabase Base de données métier.
     * \param $sServer IP ou Nom du serveur PostgreSQL.
     * \param $sRoleUser Nom du rôle pour les droits d'utilisateur.
     * \param $sRoleAdmin Nom du rôle pour les droits d'administration.
     * \param $sSchema Nom du schéma ou sont stockées les tables.
     */
    function PgsqlDataAccess($oBd, $sDatabase, $sServer, $sRoleUser = "veremap_pro_user", $sRoleAdmin = "veremap_pro_admin", $sSchema = "veremap_pro") {
        $this->oBd = $oBd;
        $this->sDatabase = $sDatabase;
        $this->sServer = $sServer;
        $this->sRoleUser = $sRoleUser;
        $this->sRoleAdmin = $sRoleAdmin;
        $this->sSchema = $sSchema;
    }

    /**
     * Cette méthode recherche quel est le statut PostgreSQL de l'utilisateur à gérer.
     * \param $sLogin Identifiant de l'utilisateur à gérer.
     * \return Le statut de l'utilisateur à gérer.
     */
    function getStatus($sLogin) {
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $sSql = "SELECT * FROM pg_user s LEFT OUTER JOIN pg_group g on (s.usesysid = any(g.grolist) ) WHERE usename='" . $sLogin . "' and groname IN ('" . $this->sRoleUser . "', '" . $this->sRoleAdmin . "')";
        $iRecordset = $oBd->execute($sSql);
        $aResultat = $iRecordset->fetchAll(PDO::FETCH_ASSOC);
        if ($aResultat == array())
            return "unknown";
        $sStatut = "";
        foreach ($aResultat as $aLigne) {
            if ($aLigne['usesuper'] == true || $aLigne['groname'] == $this->sRoleAdmin)
                return "database_admin";
            else
            if ($aLigne['groname'] == $this->sRoleUser)
                $sStatut = "database_user";
            else
            if ($sStatut == "")
                $sStatut = "sgbd_only";
        }
        return $sStatut;
    }

    /**
     * Cette méthode tente de créer un utilisateur PostgreSQL.
     * \param $sLogin Identifiant de l'utilisateur à créer.
     * \param $sPassword Mot de passe de l'utilisateur à créer.
     * \return Un message d'erreur s'il y a lieu.
     */
    function createSgbdUser($sLogin, $sPassword) {
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $sServer = $this->sServer;
        $sErrorMessage = "";
        $sSql = "select * from pg_user where usename = '" . $sLogin . "'";
        $resultat = $oBd->execute($sSql);
        if ($oBd->erreurRencontree) {
            $sErrorMessage = $oBd->getBDMessage();
        } else {
            if (!$aLigne = $oBd->ligneSuivante($resultat)) {
                $sSql = "CREATE USER \"" . $sLogin . "\" PASSWORD '" . $sPassword . "' IN ROLE " . $this->sRoleUser;
                $oBd->execute($sSql);
                if ($oBd->erreurRencontree) {
                    $sErrorMessage = $oBd->getBDMessage();
                } else {
                    $sSql = " GRANT vitis_user TO \"" . $sLogin . "\";";
                    $oBd->execute($sSql);
                    if ($oBd->erreurRencontree)
                        $sErrorMessage = $oBd->getBDMessage();
                }
            }
        }
        return $sErrorMessage;
    }

    /**
     * Cette méthode tente de créer un utilisateur PostgreSQL.
     * \param $sLogin Identifiant de l'utilisateur à créer.
     * \param $sPassword Mot de passe de l'utilisateur à créer.
     * \return Un message d'erreur s'il y a lieu.
     */
    function createSgbdUserNoPassword($sLogin) {
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $sServer = $this->sServer;
        $sErrorMessage = "";
        $sSql = "select * from pg_user where usename = '" . $sLogin . "'";
        $resultat = $oBd->execute($sSql);
        if ($aLigne = $oBd->ligneSuivante($resultat)) {
            $sErrorMessage = $this->createDatabaseUser($sLogin);
        } else {
            $sSql = "CREATE USER \"" . $sLogin . "\" PASSWORD NULL IN ROLE " . $this->sRoleUser;
            $oBd->execute($sSql);
            if ($oBd->erreurRencontree)
                $sErrorMessage = $oBd->getBDMessage();
        }
        return $sErrorMessage;
    }

    /**
      /**
     * Cette méthode tente de mettre à jour un utilisateur PostgreSQL comme utilisateur d'une nouvelle Db.
     * \param $sLogin Identifiant de l'utilisateur à modifier.
     * \return Un message d'erreur s'il y a lieu.
     */
    function createDatabaseUser($sLogin) {
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $sServer = $this->sServer;
        $sErrorMessage = "";
        $sSql = 'GRANT ' . $this->sRoleUser . ' TO "' . $sLogin . '"';
        $oBd->execute($sSql);
        if ($oBd->erreurRencontree)
            $sErrorMessage = $oBd->getBDMessage();
        return $sErrorMessage;
    }

    /**
     * Cette méthode tente de mettre à jour le mot de passe d'un utilisateur PostgreSQL.
     * \param $sLogin Identifiant de l'utilisateur à modifier.
     * \param $sPasword Nouveau mot de passe de l'utilisateur.
     * \return Un message d'erreur s'il y a lieu.
     */
    function updateUserPassword($sLogin, $sPassword) {
        $oBd = $this->oBd;
        $sServer = $this->sServer;
        $sErrorMessage = "";
        $sSql = 'ALTER Role "' . $sLogin . '" PASSWORD \'' . $sPassword . '\'';
        $oBd->execute($sSql);
        if ($oBd->erreurRencontree)
            $sErrorMessage = $oBd->getBDMessage();
        return $sErrorMessage;
    }

    /**
     * Cette méthode tente de supprimer un utilisateur PostgreSQL comme utilisateur d'une Db en particulier.
     * \param $sLogin Identifiant de l'utilisateur à supprimer.
     * \return Un message d'erreur s'il y a lieu.
     */
    function deleteDatabaseUser($sLogin) {
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $sServer = $this->sServer;
        $sErrorMessage = "";
        $sSql = 'REVOKE ' . $this->sRoleUser . ' FROM "' . $sLogin . '"';
        $oBd->execute($sSql);
        if ($oBd->erreurRencontree)
            $sErrorMessage = $oBd->getBDMessage();
        return $sErrorMessage;
    }

    /**
     * Cette méthode tente de mettre à jour un utilisateur PostgreSQL comme administrateur d'une nouvelle Db.
     * \param $sLogin Identifiant de l'utilisateur à modifier.
     * \return Un message d'erreur s'il y a lieu.
     */
    function createDatabaseAdmin($sLogin) {
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $sServer = $this->sServer;
        $siLoginOrUserId = intval($sLogin);
        // Deprecated Juillet 2012
        // Si siLoginOrUserId renvoi 0 c'est que la valeur passée en entré est une chaine et non un entier (Compatibilité avec Veremap)
        if (is_int($siLoginOrUserId) and $siLoginOrUserId <> 0) {
            $sSql = 'SELECT "LOGIN" FROM ' . $this->sSchema . '."user" WHERE "USER_ID"=' . $sLogin . '';
            $resultat = $oBd->execute($sSql);
            if ($oBd->erreurRencontree) {
                $sErrorMessage = $oBd->getBDMessage();
            } else {
                $oUser = $oBd->objetSuivant($resultat);
                $sLogin = $oUser->LOGIN;
            }
        }
        $sErrorMessage = "";
        $sSql = 'GRANT ' . $this->sRoleAdmin . ' TO "' . $sLogin . '"';
        $oBd->execute($sSql);
        if ($oBd->erreurRencontree) {
            $sErrorMessage .= $oBd->getBDMessage();
        } else {
            $sSql = 'ALTER ROLE "' . $sLogin . '" SUPERUSER CREATEROLE';
            $oBd->execute($sSql);
            if ($oBd->erreurRencontree)
                $sErrorMessage .= $oBd->getBDMessage();
        }
        return $sErrorMessage;
    }

    /**
     * Même fonction que la précédente mais pour gtf_v2
     */
    function createDatabaseAdminV2($sLogin) {
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $sServer = $this->sServer;
        $siLoginOrUserId = intval($sLogin);
        // Deprecated Juillet 2012
        // Si siLoginOrUserId renvoi 0 c'est que la valeur passée en entré est une chaine et non un entier (Compatibilité avec Veremap)
        if (is_int($siLoginOrUserId) and $siLoginOrUserId <> 0) {
            $sSql = 'SELECT "login" FROM ' . $this->sSchema . '."user" WHERE "user_id"=' . $sLogin . '';
            $resultat = $oBd->execute($sSql);
            if ($oBd->erreurRencontree) {
                $sErrorMessage = $oBd->getBDMessage();
            } else {
                $oUser = $oBd->objetSuivant($resultat);
                $sLogin = $oUser->login;
            }
        }
        $sErrorMessage = "";
        $sSql = 'GRANT ' . $this->sRoleAdmin . ' TO "' . $sLogin . '"';
        $oBd->execute($sSql);
        if ($oBd->erreurRencontree) {
            $sErrorMessage .= $oBd->getBDMessage();
        } else {
            $sSql = 'ALTER ROLE "' . $sLogin . '" CREATEROLE';
            $oBd->execute($sSql);
            if ($oBd->erreurRencontree)
                $sErrorMessage .= $oBd->getBDMessage();
        }
        return $sErrorMessage;
    }

    /**
     * Cette méthode tente de supprimer un utilisateur PostgreSQL comme administrateur d'une Db en particulier,
     * l'utilisateur redevient simple utilisateur de la base.
     * \param $sLogin Identifiant de l'utilisateur à supprimer.
     * \return Un message d'erreur s'il y a lieu.
     */
    function deleteDatabaseAdmin($sLogin) {
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $sServer = $this->sServer;
        $siLoginOrUserId = intval($sLogin);
        // Deprecated Juillet 2012
        // Si siLoginOrUserId renvoi 0 c'est que la valeur passée en entré est une chaine et non un entier (Compatibilité avec Veremap)
        if (is_int($siLoginOrUserId) and $siLoginOrUserId <> 0) {
            $sSql = 'SELECT "LOGIN" FROM ' . $this->sSchema . '."user" WHERE "USER_ID"=' . $sLogin . '';
            $resultat = $oBd->execute($sSql);
            if ($oBd->erreurRencontree) {
                $sErrorMessage = $oBd->getBDMessage();
            } else {
                $oUser = $oBd->objetSuivant($resultat);
                $sLogin = $oUser->LOGIN;
            }
        }
        $sErrorMessage = "";
        $sSql = 'REVOKE ' . $this->sRoleAdmin . ' FROM "' . $sLogin . '"';
        $oBd->execute($sSql);
        if ($oBd->erreurRencontree) {
            $sErrorMessage .= "<br>" . $oBd->getBDMessage();
        } else {
            $sSql = 'ALTER ROLE "' . $sLogin . '" NOSUPERUSER NOCREATEROLE';
            $oBd->execute($sSql);
            if ($oBd->erreurRencontree)
                $sErrorMessage .= "<br>" . $oBd->getBDMessage();
        }
        return $sErrorMessage;
    }

    /**
     * Même fonction que la précédente mais pour gtf_v2
     */
    function deleteDatabaseAdminV2($sLogin) {
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $sServer = $this->sServer;
        $siLoginOrUserId = intval($sLogin);
        // Deprecated Juillet 2012
        // Si siLoginOrUserId renvoi 0 c'est que la valeur passée en entré est une chaine et non un entier (Compatibilité avec Veremap)
        if (is_int($siLoginOrUserId) and $siLoginOrUserId <> 0) {
            $sSql = 'SELECT "login" FROM ' . $this->sSchema . '."user" WHERE "user_id"=' . $sLogin . '';
            $resultat = $oBd->execute($sSql);
            if ($oBd->erreurRencontree) {
                $sErrorMessage = $oBd->getBDMessage();
            } else {
                $oUser = $oBd->objetSuivant($resultat);
                $sLogin = $oUser->login;
            }
        }
        $sErrorMessage = "";
        $sSql = 'REVOKE ' . $this->sRoleAdmin . ' FROM "' . $sLogin . '"';
        $oBd->execute($sSql);
        if ($oBd->erreurRencontree) {
            $sErrorMessage .= "<br>" . $oBd->getBDMessage();
        }
        return $sErrorMessage;
    }

    /**
     * Cette méthode permet de déterminer si l'utilisateur se connectant à l'interface d'administration en à le droit.
     * \param $sSessLogin Identifiant de l'utilisateur en cours de connexion.
     * \return Vrai si l'utilisateur est administrateur.
     */
    function isDatabaseAdmin($sSessLogin) {
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $sSql = "SELECT groname FROM pg_user RIGHT JOIN pg_group ON pg_user.usesysid = ANY(grolist) WHERE usename = '" . $sSessLogin . "'";
        $iRecordset = $oBd->execute($sSql);
        $bAdmin = false;
        while ($aLigne = $oBd->ligneSuivante($iRecordset))
            if ($aLigne["groname"] == $this->sRoleAdmin)
                $bAdmin = true;
        $iRecordset = $oBd->fermeResultat();
        if ($bAdmin)
            return $bAdmin;
        else {
            $sSql = "SELECT * FROM pg_roles WHERE rolname='" . $sSessLogin . "' AND (rolsuper = true)";
            $iRecordset = $oBd->execute($sSql);
            if ($aLigne = $oBd->ligneSuivante($iRecordset)) {
                $iRecordset = $oBd->fermeResultat();
                return true;
            } else {
                $iRecordset = $oBd->fermeResultat();
                return false;
            }
        }
    }

    /**
     * Cette méthode permet de déterminer si l'utilisateur est un utilisateur de la base.
     * \param $sSessLogin Identifiant de l'utilisateur en cours de connexion.
     * \return Vrai si l'utilisateur est utilisateur.
     */
    function isDatabaseUser($sSessLogin) {
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $sSql = "SELECT groname FROM pg_user RIGHT JOIN pg_group ON pg_user.usesysid = ANY(grolist) WHERE usename = '" . $sSessLogin . "'";
        $iRecordset = $oBd->execute($sSql);
        $bUser = false;
        while ($aLigne = $oBd->ligneSuivante($iRecordset))
            if ($aLigne["groname"] == $this->sRoleUser)
                $bUser = true;
        $iRecordset = $oBd->fermeResultat();
        return $bUser;
    }

    function getUserModules($sSessLogin, $modules) {
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $modules = "'" . str_replace(',', "','", $modules) . "'";
        $sSql = "SELECT distinct module_id FROM pg_user RIGHT JOIN pg_group ON pg_user.usesysid = ANY(grolist) inner join " . $this->sSchema . ".vm_mode_rolname ON groname = vm_mode_rolname.rolname left join " . $this->sSchema . ".vm_mode ON vm_mode_rolname.mode_id = vm_mode.mode_id WHERE usename = '" . $sSessLogin . "' and module_id IN (" . $modules . ")";

        $iRecordset = $oBd->execute($sSql);
        while ($aLigne = $oBd->ligneSuivante($iRecordset)) {

            $aModules[] = $aLigne['module_id'];
        }
        $iRecordset = $oBd->fermeResultat();
        return $aModules;
    }

    function getUserModes($sSessLogin) {
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $sSql = "SELECT distinct mode_id, \"index\" FROM pg_user RIGHT JOIN pg_group ON pg_user.usesysid = ANY(grolist) inner join " . $this->sSchema . ".vm_mode_rolname ON groname = vm_mode_rolname.rolname WHERE usename = '" . $sSessLogin . "' order by \"index\"";

        $iRecordset = $oBd->execute($sSql);
        while ($aLigne = $oBd->ligneSuivante($iRecordset)) {

            $aMode[] = $aLigne["mode_id"];
        }
        $iRecordset = $oBd->fermeResultat();
        return $aMode;
    }

    function getUserModesFramework($sSessLogin, $modules) {
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $modules = "'" . str_replace(',', "','", $modules) . "'";
        $sSql = "SELECT distinct module_id, vm_mode.mode_id, \"index\" FROM pg_user RIGHT JOIN pg_group ON pg_user.usesysid = ANY(grolist) inner join " . $this->sSchema . ".vm_mode_rolname ON groname = vm_mode_rolname.rolname left join " . $this->sSchema . ".vm_mode ON vm_mode_rolname.mode_id = vm_mode.mode_id WHERE usename = '" . $sSessLogin . "'  and module_id IN (" . $modules . ") order by \"index\"";

        $iRecordset = $oBd->execute($sSql);
        while ($aLigne = $oBd->ligneSuivante($iRecordset)) {

            $aMode[] = $aLigne;
        }
        $iRecordset = $oBd->fermeResultat();
        return $aMode;
    }

    function getModeTabsFramework($aMode, $lang = 'fr') {
        $sModeId = $aMode['mode_id'];
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $sSql = "SELECT vm_translation.translation as label, event FROM " . $this->sSchema . ".vm_tab LEFT JOIN " . $this->sSchema . ".vm_translation ON vm_tab.label_id = vm_translation.translation_id where mode_id='" . $sModeId . "' and vm_translation.lang='" . $lang . "' order by \"index\"";
        $iRecordset = $oBd->execute($sSql);
        while ($aLigne = $oBd->ligneSuivante($iRecordset)) {
            $aTab['module_id'] = $aMode['module_id'];
            $aTab['tab'][] = $aLigne;
        }
        $iRecordset = $oBd->fermeResultat();

        return $aTab;
    }

    function getModeTabs($sMode, $lang = 'fr') {
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $sSql = "SELECT vm_translation.translation as label, event FROM " . $this->sSchema . ".vm_tab LEFT JOIN " . $this->sSchema . ".vm_translation ON vm_tab.label_id = vm_translation.translation_id where mode_id='" . $sMode . "' and vm_translation.lang='" . $lang . "' order by \"index\"";

        $iRecordset = $oBd->execute($sSql);
        while ($aLigne = $oBd->ligneSuivante($iRecordset)) {
            $aTab[] = $aLigne;
        }
        $iRecordset = $oBd->fermeResultat();
        return $aTab;
    }

    function DeleteDatabaseRole($sSessLogin) {
        $oBd = $this->oBd;
        $sDatabase = $this->sDatabase;
        $sSql = "SELECT * FROM pg_user s LEFT OUTER JOIN pg_group g on (s.usesysid = any(g.grolist) ) WHERE usename='" . $sSessLogin . "'";
        $iRecordset = $oBd->execute($sSql);
        $sMessage = "";
        if ($aLigne = $oBd->ligneSuivante($iRecordset)) {
            $sSql = "DROP ROLE IF EXISTS \"" . $sSessLogin . "\"";
            $oPDOresult = $oBd->execute($sSql);
            $sMessage = $oBd->getBDMessage();
        }
        return $sMessage;
    }

}

?>
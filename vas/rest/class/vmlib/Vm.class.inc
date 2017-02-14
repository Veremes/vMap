<?php

/**
 * \file Vm.class.inc
 * \brief Vm.class.inc \n \n Ce fichier contient la classe php Vm.
 *
 *
 * \author  Olivier Gayte <olivier.gayte@veremes.com>.
 * \author Fabien Marty <fabien.marty@veremes.com>.
 * \author Armand Bahi <armand.bahi@veremes.com>.
 */
/**
 * \class Vm
 * \brief Vm Class \n \n
 */
require_once (__DIR__ . "/BD.class.inc");

class Vm extends BD {
    ## ============================================ ##
    ## METHODES D'INTERROGATION DU CONTENU VM_TABLE ##
    ## ============================================ ##

    /**
     * M�thode qui renvoie un tableau associatif contenant des informations sur la table syst�me pass�e en param�tre.
     * \param $sTable Nom de la table syst�me.
     * \param $sSchema Nom du sch�ma � utiliser ('veremap_pro' par d�faut).
     * \return Un tableau associatif.
     */
    function getVM_TableInfo($sTable, $sSchema = "veremap_pro") {
        include('vmlib/Vm.class.sql.inc');
        $sSql = $aSql[$this->sgbd]['getVM_TableInfo'];
        $aTag = array("[sSchema]", "[sTable]");
        $aReplacer = array($sSchema, $sTable);
        $sSql = str_replace($aTag, $aReplacer, $sSql);
        $resultat = $this->execute($sSql);
        if ($resultat !== false) {
            if (!$aValues = $this->ligneSuivante($resultat))
                $aValues = array();
            $resultat = $this->fermeResultat();
            return $aValues;
        }
    }

    /**
     * M�thode qui renvoie un tableau associatif contenant des informations sur la table syst�me pass�e en param�tre.
     * \param $sTable Nom de la table syst�me.
     * \param $sSchema Nom du sch�ma � utiliser ('veremap_pro' par d�faut).
     * \param $lang langue de l'application ('fr' par d�faut).
     * \return Un tableau associatif.
     */
    function getVM_TableInfoTrad($sTable, $sSchema = "veremap_pro", $lang = "fr") {
        include('vmlib/Vm.class.sql.inc');
        $sSql = $aSql[$this->sgbd]['getVM_TableInfoTrad'];
        $aTag = array("[sSchema]", "[sTable]", "[sLang]");
        $aReplacer = array($sSchema, $sTable, $lang);
        $sSql = str_replace($aTag, $aReplacer, $sSql);
        $resultat = $this->execute($sSql);
        if ($resultat !== false) {
            if (!$aValues = $this->ligneSuivante($resultat))
                $aValues = array();
            $resultat = $this->fermeResultat();
            return $aValues;
        }
    }

    /**
     * M�thode qui renvoie un tableau associatif contenant des informations sur la table syst�me pass�e en param�tre.
     * \param $sTable Nom de la table syst�me.
     * \param $sSchema Nom du sch�ma � utiliser ('veremap_pro' par d�faut).
     * \param $lang langue de l'application ('fr' par d�faut).
     * \return Un tableau associatif.
     */
    function getVM_TableInfoTradFramework($sTable, $sSchema = "veremap_pro", $lang = "fr") {
        include('vmlib/Vm.class.sql.inc');
        $sSql = $aSql[$this->sgbd]['getVM_TableInfoTradFramework'];
        $aTag = array("[sSchema]", "[sTable]", "[sLang]");
        $aReplacer = array($sSchema, $sTable, $lang);
        $sSql = str_replace($aTag, $aReplacer, $sSql);
        $resultat = $this->execute($sSql);
        if ($resultat !== false) {
            if (!$aValues = $this->ligneSuivante($resultat))
                $aValues = array();
            $resultat = $this->fermeResultat();
            return $aValues;
        }
    }

    /**
     * M�thode qui renvoie un tableau associatif contenant des informations sur la couche syst�me pass�e en param�tre.
     * \param $sLayer Nom de la couche syst�me.
     * \param $sSchema Nom du sch�ma � utiliser ('veremap_pro' par d�faut).
     * \return Un tableau associatif.
     */
    function getVM_LayerInfo($sLayer, $sSchema = "veremap_pro") {
        include('vmlib/Vm.class.sql.inc');
        $sSql = $aSql[$this->sgbd]['getVM_LayerInfo'];
        $aTag = array("[sSchema]", "[sLayer]");
        $aReplacer = array($sSchema, $sLayer);
        $sSql = str_replace($aTag, $aReplacer, $sSql);
        $resultat = $this->execute($sSql);
        if ($resultat !== false) {
            if (!$aValues = $this->ligneSuivante($resultat))
                $aValues = array();
            $resultat = $this->fermeResultat();
            return $aValues;
        }
    }

    ## ============================================================ ##
    ## METHODES D'INTERROGATION DES DROITS SUR LES COUCHES ##
    ## ============================================================ ##

    /**
     * M�thode qui renvoie un tableau associatif contenant les droits sur la couche pour un groupe pass�e en param�tre.
     * \param $sLayer Nom de la couche syst�me.
     * \param $iGroupId Groupe de l'utilisateur.
     * \return Un tableau associatif.
     */
    function getVM_LayerRightInfo($sLayer, $iGroupId, $sSchema = 'veremap_pro') {
        include('vmlib/Vm.class.sql.inc');
        $aValues = Array("UPDATE" => false, "DELETE" => false, "INSERT" => false, "EXTRACT" => false, "UPLOAD" => false);
        $sSql = $aSql[$this->sgbd]['getVM_LayerRightInfo'];
        $sSql = str_replace('[sSchema]', $sSchema, $sSql);
        $sSql = str_replace(array("[sLayerName]", "[iGroupId]"), array($sLayer, $iGroupId), $sSql);
        $oResultat = $this->execute($sSql);
        // DEPRECATED 2011_01
        if ($this->erreurRencontree) {
            $sSql = $aSql[$this->sgbd]['getVM_LayerRightInfo_0'];
            $sSql = str_replace('[sSchema]', $sSchema, $sSql);
            $sSql = str_replace(array("[sLayerName]", "[iGroupId]"), array($sLayer, $iGroupId), $sSql);
            $oResultat = $this->execute($sSql);
        }
        //
        if ($oResultat !== false) {
            $aValues = $this->ligneSuivante($oResultat);
        }
        $resultat = $this->fermeResultat();
        return $aValues;
    }

    ## ===================================================== ##
    ## METHODES AUTOUR DE LA STRUCTURE DE LA BASE DE DONNEES ##
    ## ===================================================== ##

    /**
     * M�thode permettant de tester si une table est une vue.
     * Si c'est le cas, cette m�thode permet de rapatrier le nom de la table contenant la colonne g�om�trique utilis�e dans la vue.
     * \param $sTable Nom de la table � tester.
     * \param $sSchema Nom du sch�ma contenant la table � tester (vide par d�faut).
     * \return Le nom de la table d'origine de la g�om�trie.
     */
    function ifTableIsAView($sTable, $sSchema = "") {
        $bReturn = false;
        include("vmlib/Vm.class.sql.inc");
        $sSql = $aSql[$this->sgbd]['ifTableIsAView'];

        switch ($this->sgbd) {
            case "pgsql" :
                $aTag = array("[sSchema]", "[sTable]");
                $aReplacer = array($sSchema, $sTable);
                $sSql = str_replace($aTag, $aReplacer, $sSql);
                break;
        }
        $sOriginTable = $sTable;
        $iResult = $this->execute($sSql);

        if ($aValues = $this->ligneSuivante($iResult)) {
            $iPos = strpos($aValues["definition"], ".geom_cad");
            if ($iPos === false) {
                $sGeometrieColumn = ".geom";
                $iPos = strpos($aValues["definition"], $sGeometrieColumn);
            } else {
                $sGeometrieColumn = ".geom_cad";
            }
            $schaineAnalyse = substr($aValues["definition"], 0, $iPos + strlen($sGeometrieColumn));
            $iPosVirgule = strpos($schaineAnalyse, ",");
            if ($iPosVirgule == "") {
                $aTableauVirg = explode(" ", $schaineAnalyse);
                $iNbrValTabVirg = count($aTableauVirg);
                $sValeur2 = $aTableauVirg[$iNbrValTabVirg - 1];
                $iPosChaineAnalyse2 = strpos($sValeur2, $sGeometrieColumn);
                $sOriginTable = trim(substr($sValeur2, 0, $iPosChaineAnalyse2));
            } else {
                $sOriginTable = trim(substr(strrchr(substr($aValues["definition"], 0, $iPos), ","), 1));
            }
            $iPosParenthese = strpos($sOriginTable, "(");
            if ($iPosParenthese != "") {
                $aTableauPar = explode("(", $sOriginTable);
                $iNbrValTab = count($aTableauPar);
                $sOriginTable = trim($aTableauPar[$iNbrValTab - 1]);
            }
        }
        $iResult = $this->fermeResultat();
        return $sOriginTable;
    }

    /**
     * M�thode permettant de r�cup�rer le nom du sch�ma contenant la table pass�e en param�tre.
     * \param $sTable Nom de la table � tester.
     * \return Le nom du sch�ma.
     */
    function getTableSchema($sTable) {
        $bReturn = false;
        include("vmlib/Vm.class.sql.inc");
        $sSql = $aSql[$this->sgbd]['getTableSchema'];
        switch ($this->sgbd) {
            case "pgsql" :
                $sSql = str_replace("[sTable]", $sTable, $sSql);
                break;
        }
        $sSchema = "";
        $iResult = $this->execute($sSql);
        if ($aValues = $this->ligneSuivante($iResult)) {
            $sSchema = $aValues["nspname"];
        }
        $iResult = $this->fermeResultat();
        return $sSchema;
    }

    /**
     * M�thode permettant de cloner un enregistrement en tenant compte de la liste des cl�s uniques 
     * sp�cifi�es dans la vm_table et en leur associant la valeur 'null' lors de l'insertion.
     * \param $sSchema Schema de la base de donn�es
     * \param $sTable Table dans laquelle on ajoute.
     * \param $aValues Valeurs � ajouter.
     * \param $sSequence Nom de la s�quence � utiliser.
     * \param $iIdField Nom de l'attribut identifiant.
     * \param $sUkList Liste des cl�s uniques dans la table s�par�es par un '|'.
     * \return L'id de la derni�re ligne ins�r�e.
     */
    function cloneObj($sSchema, $sTable, $aValues, $sSequence, $iIdField, $sUkList) {
        $aUk = explode("|", $sUkList);
        foreach ($aUk as $sUk)
            foreach ($aValues as $sKey => $sValue)
                if ($sKey === $sUk)
                    $aValues[$sKey] = "";

        return $this->insert($sSchema, $sTable, $aValues, $sSequence, $iIdField);
    }

    ## ============================================ ##
    ## METHODES DE MANIPULATION DES OBJETS SPATIAUX ##
    ## ============================================ ##

    /**
     * M�thode permettant de tester si une g�om�trie est au format EWKT
     * \param $sGeom G�om�trie
     * \return Bool�en.
     */
    function isEWKTFormat($sGeom) {
        if (strtoupper(substr($sGeom, 0, 5)) === 'SRID=')
            return true;
        else
            return false;
    }

    /**
     * M�thode permettant de tester si une table contient une colonne supportant le stockage de donn�es spatiales.
     * \param $sTable Nom de la table � tester.
     * \param $sSchema Nom du sch�ma contenant la table � tester (vide par d�faut).
     * \return Bool�en.
     */
    function isTableSpatial($sTable, $sSchema = "") {
        $bReturn = false;
        include("vmlib/Vm.class.sql.inc");
        $sSql = $aSql[$this->sgbd]['isTableSpatial'];
        switch ($this->sgbd) {
            case "pgsql" :
                $aTag = array("[sSchema]", "[sTable]");
                $aReplacer = array($sSchema, $sTable);
                $sSql = str_replace($aTag, $aReplacer, $sSql);
                break;
        }

        $iResult = $this->execute($sSql);
        if ($this->nombreLigne($iResult) != 0)
            $bReturn = true;
        $iResult = $this->fermeResultat();
        return $bReturn;
    }

    /**
     * M�thode permettant de r�cup�rer le 'SRID' d'une table contenant des donn�es spatiales.
     * \private
     * \param $sTable Nom de la table.
     * \param $sSchema Nom du sch�ma contenant la table (vide par d�faut).
     * \return Code SRID (nombre entier, 4 ou 5 chiffres) retourne 0 si aucun SRID d�fini.
     */
    function getTableSRID($sTable, $sSchema = "") {
        $iSrid = 0;
        include("vmlib/Vm.class.sql.inc");
        $sSql = $aSql[$this->sgbd]['getTableSrid'];
        switch ($this->sgbd) {
            case "pgsql" :
                $aTag = array("[sSchema]", "[sTable]");
                $aReplacer = array($sSchema, $sTable);
                $sSql = str_replace($aTag, $aReplacer, $sSql);
                break;
        }
        $iResult = $this->execute($sSql);
        if ($aValue = $this->ligneSuivante($iResult))
            $iSrid = $aValue['srid'];
        $iResult = $this->fermeResultat();
        return $iSrid;
    }

    /**
     * M�thode permettant de r�cup�rer le type de g�om�trie d'une table contenant des donn�es spatiales.
     * \private
     * \param $sTable Nom de la table.
     * \param $sSchema Nom du sch�ma contenant la table (vide par d�faut).
     * \return Type de g�om�trie support�e retourne GEOMETRY si aucun type de g�om�trie d�fini.
     */
    function getTableGeometryType($sTable, $sSchema = "") {
        $sGeometryType = "GEOMETRY";
        include("vmlib/Vm.class.sql.inc");
        $sSql = $aSql[$this->sgbd]['getTableGeometryType'];
        switch ($this->sgbd) {
            case "pgsql" :
                $aTag = array("[sSchema]", "[sTable]");
                $aReplacer = array($sSchema, $sTable);
                $sSql = str_replace($aTag, $aReplacer, $sSql);
                break;
        }
        $iResult = $this->execute($sSql);
        if ($aValue = $this->ligneSuivante($iResult))
            $sGeometryType = $aValue['type'];
        $iResult = $this->fermeResultat();
        return $sGeometryType;
    }

    /**
     * M�thode permettant de r�cup�rer la dimension d'une table contenant des donn�es spatiales (2 pour 2D, 3 pour 3D...).
     * \private
     * \param $sTable Nom de la table.
     * \param $sSchema Nom du sch�ma contenant la table (vide par d�faut).
     * \return Un entier correspondant au nombre de dimension d'une table.
     */
    function getTableDimension($sTable, $sSchema = "") {
        $iDims = "2";
        include("vmlib/Vm.class.sql.inc");
        $sSql = $aSql[$this->sgbd]['getTableDimension'];
        switch ($this->sgbd) {
            case "pgsql" :
                $aTag = array("[sSchema]", "[sTable]");
                $aReplacer = array($sSchema, $sTable);
                $sSql = str_replace($aTag, $aReplacer, $sSql);
                break;
        }
        $iResult = $this->execute($sSql);
        if ($aValue = $this->ligneSuivante($iResult))
            $iDims = $aValue['coord_dimension'];
        $iResult = $this->fermeResultat();
        return $iDims;
    }

    /**
     * M�thode permettant de renvoyer la g�om�trie (sous la forme d'une cha�ne WKT) en cours d'�dtion 
     * apr�s ajout des d'un nouveau vertex dont les coordonn�es ont �t� interpol�es selon les coordonn�es 
     * du point saisie par l'utilisateur dans l'interface graphique.
     * \param $sTable Nom de la table dans laquelle se trouve la g�om�trie en cours d'�dition.
     * \param $sSchema Sch�ma contenant la 'vm_table' � exploiter.
     * \param $sX Coordonn�es X du point cliqu�.
     * \param $sY Coordonn�es Y du point cliqu�.
     * \param $sWKT Cha�ne WKT constitutive de la g�om�trie en cours d'�dition.
     * \param $dTolerance Tol�rance de distance entre le nouveau vertex et la g�om�trie en cours d'�dition.
     * \return La cha�ne WKT mise � jour.
     */
    function geomAddVertex($sTable, $sSchema = "", $sX, $sY, $sWKT, $dTolerance) {
        include("vmlib/Vm.class.sql.inc");
        $sSql = $aSql[$this->sgbd]['geomAddVertex'];

        $aTableInfo = $this->getVM_TableInfo($sTable, $sSchema);
        $sTable = $this->ifTableIsAView($sTable, $aTableInfo["SCHEMA_NAME"]);
        if ($sTable != $aTableInfo["TABLE_NAME"]) {
            $sSchema = $this->getTableSchema($sTable);
            $iSRID = $this->getTableSRID($sTable, $sSchema);
        } else {
            $iSRID = $this->getTableSRID($sTable, $aTableInfo["SCHEMA_NAME"]);
        }
        $sVertexCoords = $sX . " " . $sY;

        // Cas des polygones
        $bPolygon = false;
        if (substr_count($sWKT, "POLYGON") === 1)
            $bPolygon = true;

        if ($bPolygon)
            $sWKT = str_replace(array("POLYGON((", "))"), array("LINESTRING(", ")"), $sWKT);
        // ----

        $dCurrentDistance = $this->getVertexDistance($sWKT, $iSRID, $sVertexCoords);
        if ($dTolerance >= $dCurrentDistance) {
            switch ($this->sgbd) {
                case "pgsql" :
                    $aTag = array("[sWKT]", "[sVertexCoords]", "[iSRID]");
                    $aReplacer = array($sWKT, $sVertexCoords, $iSRID);
                    $sSql = str_replace($aTag, $aReplacer, $sSql);
                    break;
            }

            $iResult = $this->execute($sSql);
            if ($iResult !== false) {
                $aValues = $this->ligneSuivante($iResult);
                $sWKT = $aValues["wkt"];
            }
            $iResult = $this->fermeResultat();
        }

        if ($bPolygon)
            $sWKT = str_replace(array("LINESTRING(", ")"), array("POLYGON((", "))"), $sWKT);

        return $sWKT;
    }

    /**
     * M�thode permettant de renvoyer deux g�om�tries (sous la forme de deux cha�nes WKT) 
     * apr�s d�coupe de la g�om�trie d'origine (selon la localisation d'un vertex de d�coupe...).
     * \param $sTable Nom de la table dans laquelle se trouve la g�om�trie en cours d'�dition.
     * \param $sSchema Sch�ma contenant la 'vm_table' � exploiter.
     * \param $sX Coordonn�es X du point cliqu�.
     * \param $sY Coordonn�es Y du point cliqu�.
     * \param $sWKT Cha�ne WKT constitutive de la g�om�trie en cours d'�dition.
     * \param $dTolerance Tol�rance de distance entre le nouveau vertex et la g�om�trie en cours d'�dition.
     * \return La cha�ne WKT mise � jour.
     */
    function geomCutLine($sTable, $sSchema = "", $sX, $sY, $sWKT, $dTolerance) {
        include("vmlib/Vm.class.sql.inc");
        $sSql = $aSql[$this->sgbd]['geomCutLine'];

        $aTableInfo = $this->getVM_TableInfo($sTable, $sSchema);
        $sTable = $this->ifTableIsAView($sTable, $aTableInfo["SCHEMA_NAME"]);
        if ($sTable != $aTableInfo["TABLE_NAME"]) {
            $sSchema = $this->getTableSchema($sTable);
            $iSRID = $this->getTableSRID($sTable, $sSchema);
        } else {
            $iSRID = $this->getTableSRID($sTable, $aTableInfo["SCHEMA_NAME"]);
        }

        $sVertexCoords = $sX . " " . $sY;

        $dCurrentDistance = $this->getVertexDistance($sWKT, $iSRID, $sVertexCoords);
        if ($dTolerance >= $dCurrentDistance) {
            switch ($this->sgbd) {
                case "pgsql" :
                    $aTag = array("[sWKT]", "[sVertexCoords]", "[iSRID]");
                    $aReplacer = array($sWKT, $sVertexCoords, $iSRID);
                    $sSql = str_replace($aTag, $aReplacer, $sSql);
                    break;
            }

            $iResult = $this->execute($sSql);
            ($iResult !== false) ?
                            $aValues = $this->ligneSuivante($iResult) :
                            $aValues = array();
            $iResult = $this->fermeResultat();
        }

        return $aValues;
    }

    /**
     * M�thode permettant d'assurer l'accrochage de la g�om�trie en cours d'�dition s'il y a lieu.
     * \param $sIdValue Valeur de l'identifiant associ� � la g�om�trie (vide lors d'un ajout).
     * \param $sWKT Cha�ne WKT constitutive de la g�om�trie en cours d'�dition.
     * \param $aTableInfo Informations provenant de la vm_table pour la table en cours d'�dition.
     * \param $sExtendLine Param�tre valoris� uniquement pour le prolongement des lignes (vaut "start" ou "end" dans ce cas, vide sinon).
     * \return La cha�ne WKT mise � jour.
     */
    function geomBinding($sIdValue, $sWKT, $aTableInfo, $sExtendLine = "") {
        include("vmlib/Vm.class.sql.inc");
        $sWhereClause = "";
        if ($sIdValue != "")
            $sWhereClause = $aTableInfo["ID_FIELD"] . " != " . $sIdValue . " AND";
        $sOriginTable = $this->ifTableIsAView($aTableInfo["TABLE_NAME"], $aTableInfo["SCHEMA_NAME"]);
        if ($sOriginTable != $aTableInfo["TABLE_NAME"])
            $sSchema = $this->getTableSchema($sOriginTable);
        else
            $sSchema = $aTableInfo["SCHEMA_NAME"];
        $iSRID = $this->getTableSRID($sOriginTable, $sSchema);
        $sGeomType = $this->getTableGeometryType($sOriginTable, $sSchema);
        if ($sGeomType == "GEOMETRY" || $sGeomType == "ST_Geometry")
            $sGeomType = substr($sWKT, 0, 10);
        if ($sGeomType == "LINESTRING" || $sGeomType == "ST_LineString") {
            $sSqlStart = $aSql[$this->sgbd]['geomBinding_1'];
            $sSqlEnd = $aSql[$this->sgbd]['geomBinding_2'];
            switch ($this->sgbd) {
                case "pgsql" :
                    $aTag = array("[sWKT]", "[iSRID]", "[sSchema]", "[sTable]", "[sWhereClause]", "[dTolerance]");
                    $aReplacer = array($sWKT, $iSRID, $aTableInfo["SCHEMA_NAME"], $aTableInfo["TABLE_NAME"], $sWhereClause, round($aTableInfo["BIND_TOLERANCE"], 2));
                    $sSqlStart = str_replace($aTag, $aReplacer, $sSqlStart);
                    $sSqlEnd = str_replace($aTag, $aReplacer, $sSqlEnd);
                    break;
            }
            $bStart = $bEnd = true;
            switch ($sExtendLine) {
                case "start" :
                    $bEnd = false;
                    break;
                case "end" :
                    $bStart = false;
                    break;
            }

            if ($bStart) {
                $iResult = $this->execute($sSqlStart);
                if ($iResult !== false) {
                    if ($aValues = $this->ligneSuivante($iResult)) {
                        if ($aValues["distance"] <= $aTableInfo["BIND_TOLERANCE"]) {
                            $iVertexIndex = 0;
                            $aValues = array($sWKT, $iSRID, $aValues["wkt"], $iVertexIndex);
                            $sWKT = $this->geomBinding_private($aSql[$this->sgbd]['geomBinding_3'], $aValues);
                        }
                    }
                }
                $iResult = $this->fermeResultat();
            }

            if ($bEnd) {
                $iResult = $this->execute($sSqlEnd);
                if ($iResult !== false) {
                    if ($aValues = $this->ligneSuivante($iResult)) {
                        if ($aValues["distance"] <= $aTableInfo["BIND_TOLERANCE"]) {
                            $iVertexIndex = ($aValues["nb_vertex"] - 1);
                            $aValues = array($sWKT, $iSRID, $aValues["wkt"], $iVertexIndex);
                            $sWKT = $this->geomBinding_private($aSql[$this->sgbd]['geomBinding_3'], $aValues);
                        }
                    }
                }
                $iResult = $this->fermeResultat();
            }
        }

        return $sWKT;
    }

    /**
     * M�thode priv�e permettant de finaliser l'accorchage des g�om�tries.
     * \param $sSqlTemplate Requ�te SQL mod�le.
     * \param $aValues Tableau contenant les valeurs � associer � la requ�te mod�le.
     * \private
     * \return La g�om�trie accroch�e selon un num�ro d'index de vertex.
     */
    function geomBinding_private($sSqlTemplate, $aValues) {
        switch ($this->sgbd) {
            case "pgsql" :
                $sWKT = $aValues[0];
                $aTag = array("[sWKT]", "[iSRID]", "[sVertexWKT]", "[iVertexIndex]");
                $aReplacer = array($aValues[0], $aValues[1], $aValues[2], $aValues[3]);
                $sSql = str_replace($aTag, $aReplacer, $sSqlTemplate);
                break;
        }

        $iResult = $this->execute($sSql);
        if ($iResult !== false) {
            $aValues = $this->ligneSuivante($iResult);
            $sWKT = $aValues["wkt"];
        }
        $iResult = $this->fermeResultat();

        return $sWKT;
    }

    /**
     * Cette m�thode permet de r�cup�rer la distance (exprim�e en unit� terrain) entre un vertex (correspondant aux 
     * coordonn�es du point cliqu� sur la carte) 'utilisateur' et la g�om�trie en cours d'�dition.
     * \private
     * \param $sWKT Cha�ne WKT constitutive de la g�om�trie en cours d'�dition.
     * \param $iSRID Code SRID du syst�me de projection de la g�om�trie en cours d'�dition.
     * \param $sWKT Cha�ne WKT constitutive de la g�om�trie en cours d'�dition.
     * \return La distance du nouveau vertex.
     */
    function getVertexDistance($sWKT, $iSRID, $sVertexCoords) {
        include("vmlib/Vm.class.sql.inc");
        $sSql = $aSql[$this->sgbd]['getVertexDistance'];

        switch ($this->sgbd) {
            case "pgsql" :
                $aTag = array("[sWKT]", "[iSRID]", "[sVertexCoords]");
                $aReplacer = array($sWKT, $iSRID, $sVertexCoords);
                $sSql = str_replace($aTag, $aReplacer, $sSql);
                break;
        }

        $iResult = $this->execute($sSql);

        $dDistance = 0;
        if ($iResult !== false) {
            $aValues = $this->ligneSuivante($iResult);
            $dDistance = $aValues["distance"];
        }

        $iResult = $this->fermeResultat();

        return $dDistance;
    }

    ## ===================================== ##
    ## METHODES DE STRUCTURATION DE TABLEAUX ##
    ## ===================================== ##

    /**
     * M�thode qui renvoie une cha�ne de caract�re de type html pr�sentant sous forme de tableau le contenu du resultset.
     * \param $resultset  Le jeu d'enregistrement r�sultant de l'�x�cution d'une requ�te.
     * \param $sMessageSiVide Message affich� dans le tableau si le resultset est vide
     * \param $sCssLabel Style css � appliquer au noms d'attributs - 1�re ligne du tableau
     * \param $sCssValue Style css � appliquer aux valeurs - lignes suivantes
     * \return Une cha�ne de caract�res .
     */
    function resultset2Table($resultset, $sMessageSiVide = "", $sCssLabel, $sCssValue = "") {
        if ($sMessageSiVide == "") {
            $sMessageSiVide = NOT_RECORD_FOUND_VM;
        }
        $sResult = "<center><table border='1'>";
        if ($aValues = $this->tableauSuivant($resultset)) {
            // s'il y a un r�sultat on construit la premi�re ligne du tableau
            $iFieldCount = $this->getFieldsNumber($resultset);

            $sLigne = "<tr CLASS='$sCssLabel'>";
            for ($i = 0; $i < $iFieldCount; $i++)
                $sLigne .= "<td>" . $this->getFieldName($resultset, $i) . "</td>";
            $sLigne .= "</tr>";

            // Deuxi�me ligne avec les valeurs
            $sLigne .= "<tr CLASS='$sCssValue'>";
            for ($i = 0; $i < $iFieldCount; $i++)
                $sLigne .= "<td>" . $aValues{$i} . "</td>";
            $sLigne .= "</tr>";
            $sResult .= $sLigne;

            // lignes suivantes
            while ($aValues = $this->tableauSuivant($resultset)) {
                $sLigne = "<tr CLASS='$sCssValue'>";
                for ($i = 0; $i < $iFieldCount; $i++)
                    $sLigne .= "<td>" . $aValues{$i} . "</td>";
                $sLigne .= "</tr>";
                $sResult .= $sLigne;
            }
        } else {
            $sLigne = "<tr><td>$sMessageSiVide</td></tr>";
            $sResult .= $sLigne;
        }
        $sResult .= "</table></center>";
        return $sResult;
    }

    /**
     * M�thode qui renvoie une cha�ne de caract�re de type html pr�sentant sous forme de tableau editable.
     * Ce tableau a les caract�ristiques suivantes :
     * Nom de champ clickable (pour d�finir l'ordre de pr�sentation)
     * La premi�re colonne permet de se mettre en mode �dition
     * La seconde colonne permet de supprimer l'enregistrement
     * La troisi�me colonne permet d'afficher l'enregistrement
     * \param $resultset  Le jeu d'enregistrement r�sultant de l'�x�cution d'une requ�te.
     * \param $sMessageSiVide Message affich� dans le tableau si le resultset est vide
     * \param $sCssLabel Style css � appliquer au noms d'attributs - 1�re ligne du tableau
     * \param $sCssValue Style css � appliquer aux valeurs - lignes suivantes
     * \param $sIdField : nom du champ identifiant de la table pr�sent�e
     * \return Une cha�ne de caract�res .
     */
    function resultset2EditTable($resultset, $sMessageSiVide = "", $sCssLabel, $sCssValue = "", $sCssValue2 = "", $sIdField, $aRights = array(), $aTableParams = array()) {
        if ($sMessageSiVide == "") {
            $sMessageSiVide = NOT_RECORD_FOUND_VM;
        }
        // Tableau de param�trage de la m�thode
        if ($aTableParams != array()) {
            extract($aTableParams);
        } else {
            $IMAGE = false;
            $CENTER = true;
            $SPACING = 1;
            $PADDING = 5;
            $EMPTY_HEAD_CELLS = true;
            $IMAGE_PATH = "../images/";
            $GEOM = false;
        }

        // Red�claration des variables (pour plus de lisibilit�)
        $bImage = $IMAGE;
        $sImagePath = $IMAGE_PATH;
        if (isset($LAYER))
            $sLayerName = $LAYER;
        $bGeom = $GEOM;

        if ($CENTER)
            $aCenter = array("tag" => "<center>", "endtag" => "</center>");
        else
            $aCenter = array("tag" => "", "endtag" => "");

        if ($EMPTY_HEAD_CELLS)
            $sEmptyCellCss = " class='emptyCell'";
        else
            $sEmptyCellCss = "";

        $sResult = "";
        $bDisplay = true;
        $bGeom ? ($iColspan = 2) : ($iColspan = 1);

        if ($aRights == array()) {
            $bEdit = true;
            $bDelete = true;
            $bCheckBox = true;
            $iColspan = $iColspan + 3;
        } else {
            if ($aRights["UPDATE"] == true) {
                $bEdit = true;
                $iColspan++;
            } else {
                $bEdit = false;
            }
            if ($aRights["DELETE"] == true) {
                $bDelete = true;
                $bCheckBox = true;
                $iColspan = $iColspan + 2;
            } else {
                $bDelete = false;
                $bCheckBox = false;
            }
        }

        $iIdField = 4;
        $bPremiereLigne = true;
        $iJ = 0;
        $iN = 0;

        //ligneSuivante � la place tableauSuivant
        while ($aValues = $this->ligneSuivante($resultset)) {
            $iJ++;
            $iN++;
            $sLigne = "";
            if ($bPremiereLigne) {
                $sResult = $aCenter["tag"] . "<table border='0' cellpadding='" . $PADDING . "' cellspacing='" . $SPACING . "'><form name='listForm'>";
                $iFieldCount = $this->getFieldsNumber($resultset);
                $iColspan = $iColspan + $iFieldCount;
                $sLigne = "<tr class='$sCssLabel'>";
                if ($bEdit)
                    $sLigne .= "<td" . $sEmptyCellCss . ">&nbsp;</td>";
                if ($bDisplay)
                    $sLigne .= "<td" . $sEmptyCellCss . ">&nbsp;</td>";
                if ($bGeom)
                    $sLigne .= "<td" . $sEmptyCellCss . ">&nbsp;</td>";
                if ($bDelete)
                    $sLigne .= "<td" . $sEmptyCellCss . ">&nbsp;</td>";
                if ($bCheckBox)
                    $sLigne .= "<td" . $sEmptyCellCss . ">&nbsp;</td>";
                $i = 0;
                foreach ($aValues as $valueName => $value) {
                    if ($valueName != 'LIMIT_NUM_ROW') {
                        $i++;
                        $sField = $valueName;
                        $sLigne .= '<td><a class="tabLink" href="javascript:parent.orderby(\'' . $sField . '\');">' . $sField . '</a></td>';
                    }
                }
                $sLigne .= "</tr>";
                if ($bImage)
                    $sLigne.= "<tr><td colspan='" . $iColspan . "' width='100%' class='interligne'>&nbsp;</td></tr>";
                $bPremiereLigne = false;
            }
            if (($iN % 2) == 0)
                $sLigne .= "<tr CLASS='$sCssValue2'>";
            else
                $sLigne .= "<tr CLASS='$sCssValue'>";

            $IdValue = $aValues{$sIdField};
            if ($bEdit)
                $sLigne .= '<td><a href="javascript:parent.edit(\'' . $IdValue . '\');"><img src="' . $sImagePath . 'button_edit.png" alt="Modifier" title="Modifier" border="0" /></a></td>';
            if ($bDisplay)
                $sLigne .= '<td><a href="javascript:parent.display(\'' . $IdValue . '\');"><img src="' . $sImagePath . 'button_display.png" alt="Voir" title="Voir" border="0" /></a></td>';
            if ($bGeom)
                $sLigne .= '<td><a href="javascript:parent.zoom(\'' . $sLayerName . '\', \'' . $IdValue . '\');"><img src="' . $sImagePath . 'button_zoom.png" alt="Zoomer" title="Zoomer" border="0" /></a></td>';
            if ($bDelete)
                $sLigne .= '<td><a href="javascript:parent.deleteRecord(\'' . $IdValue . '\');" onclick="return confirm(' . WARNING_DELETE_VM_01 . $IdValue . WARNING_DELETE_VM_02 . '\')"><img src="' . $sImagePath . 'button_delete.png" alt="Supprimer" title="Supprimer" border="0" /></a></td>';
            if ($bCheckBox)
                $sLigne .= '<td><input type="checkbox" name="' . $IdValue . '" value="" id="checkbox_' . $iJ . '" /></td>';

            foreach ($aValues as $valueName => $value)
                if ($valueName != 'LIMIT_NUM_ROW')
                    $sLigne .= "<td>" . $value . "</td>";
            //for ($i=0;$i<$iFieldCount;$i++) $sLigne .= "<td>".$aValues{$i}."</td>";
            $sLigne .= "</tr>";
            if ($bImage)
                $sLigne.= "<tr><td colspan='" . $iColspan . "' width='100%' class='interligne'>&nbsp;</td></tr>";
            $sResult .= $sLigne;
        }
        if ($sResult == "")
            $sResult = $aCenter["tag"] . "<table border='1' cellpadding='" . $PADDING . "' cellspacing='" . $SPACING . "'><form name='listForm'><tr CLASS='$sCssValue'><td>$sMessageSiVide</td></tr>";
        $sResult .= "</form></table>" . $aCenter["endtag"];
        return $sResult;
    }

// Fin de la classe
}

?>
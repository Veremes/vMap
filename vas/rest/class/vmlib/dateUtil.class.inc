<?php

/**
 * \file dateUtil.class.inc
 * \brief dateUtil.class.inc \n \n Ce fichier contient la classe php dateOp.
 *
 * Cette classe � �t� �labor�e par Dorian Constant. 
 * Fonctions de calcul de dates : addition, soustraction et comparaison.
 *
 * \author Alf05.
 */

/**
 * \class dateOp
 * \brief dateOp Class \n \n Cette classe totalement g�n�rique permet de faire des calcules sur les dates.
 *
 * Cette classe � �t� �labor�e par Dorian Constant. Tous les param�tres li�s � la cr�ation de formulaires
 * Fonctions de calcul de dates : addition, soustraction et comparaison.
 *
 * Exemples :
 * 	$madate=new dateOp("18/06/2008 12:00","jj/mm/aaaa hh:ii");
 *     ou 
 * 	$madate=new dateOp("18.6.08 12:00","jj.m.aa h:ii");
 *
 *     Addition et soustraction
 * 	$madate->AjouteJours(5);		
 * 	$madate->AjouteJours(-9);
 * 	$madate->AjouteMois(5);
 * 	$madate->AjouteMois(-9);
 * 	$madate->AjouteAnnees(5);
 * 	$madate->AjouteAnnees(-9);
 * 	$madate->AjouteHeures(5);
 * 	$madate->AjouteHeures(-9);
 * 	$madate->AjouteMinutes(5);
 * 	$madate->AjouteMinutes(-9);	
 * 	$madate->AjouteSecondes(5);
 * 	$madate->AjouteSecondes(-9);
 *
 *     Comparaison
 * 	$difference=$madate->DiffenrenceEntreDate('11/04/2000','jj/mm/aaaa');
 *
 *     Affichage
 * 	echo $madate->GetDate('h:i:s jj/mm/aaaa'); // r�sultat = "12:30:00 18/06/2008"
 *
 *     D�finition du format de date
 * 	'j' repr�sente les jours ('jj' pour avoir le zero initial)
 * 	'm' repr�sente les mois ('mm' pour avoir le zero initial)
 * 	'aa' repr�sente les ann�es ('aaaa' pour avoir l'ann�e sur 4 chiffres)
 * 	'h' repr�sente les heures ('hh' pour avoir le zero initial)
 * 	'ii' repr�sente les minutes
 * 	'ss' repr�sente les secondes
 *
 * \author Alf05.
 */
class dateOp {

    /**
     * Constructeur.
     * \param $dat Date. 
     * \param $format Format de la date.
     * \return Vrai.

     */
    /*
     * Variable globale stockant le nom de dossier lib.
     */
    var $sFolderLib = "vmlib";
    var $lang;

    function dateOp($dat, $format = "jj/mm/aaaa hh:ii:ss", $lang = "fr") {
        $this->lang = $lang;
        loadLang($this->sFolderLib, $this->lang);
        $this->errno = array();

        if (strlen($dat) != strlen($format)) {
            $this->_error(ERROR_DATE_FORMAT_INCOMPATIBLE);
            return false;
        }

        $this->dat['origine'] = $dat;
        $this->format = strtolower($format);
        return $this->_ExplodeDate($this->dat, $this->format);
    }

    /**
     * Ajoute un ou plusieurs jours .
     * \param $nb nombre de jours 
     * \return Vrai.
     */
    function AjouteJours($nb) {
        $this->dat['jj']+=floatval($nb);
        return true;
    }

    /**
     * Ajoute un ou plusieurs mois.
     * \param $nb nombre de mois 
     * \return Vrai.
     */
    function AjouteMois($nb) {
        $this->dat['mm']+=floatval($nb);
        return true;
    }

    /**
     * Ajoute une ou plusieurs ann�es.
     * \param $nb nombre d'ann�e 
     * \return Vrai.
     */
    function AjouteAnnees($nb) {
        $this->dat['aaaa']+=floatval($nb);
        return true;
    }

    /**
     * Ajoute un ou plusieurs heures.
     * \param $nb nombre d'heures 
     * \return Vrai.
     */
    function AjouteHeures($nb) {
        $this->dat['hh']+=floatval($nb);
        return true;
    }

    /**
     * Ajoute un ou plusieurs minutes.
     * \param $nb nombre de minutes 
     * \return Vrai.
     */
    function AjouteMinutes($nb) {
        $this->dat['ii']+=floatval($nb);
        return true;
    }

    /**
     * Ajoute une ou plusieurs secondes.
     * \param $nb nombre de secondes 
     * \return Vrai.
     */
    function AjouteSecondes($nb) {
        $this->dat['ss']+=floatval($nb);
        return true;
    }

    /**
     * Calcule la difference avec une date pass� en param�tre.
     * \param $dat Date. 
     * \param $format Format de la date.
     * \return Un tableau.
     */
    function DiffenrenceEntreDate($dat, $format = "jj/mm/aaaa hh:ii:ss") {
        if (strlen($dat) != strlen($format)) {
            $this->_error(ERROR_DATE_FORMAT_INCOMPATIBLE);
            return false;
        }
        $this->dat2['origine'] = $dat;
        $this->format2 = strtolower($format);
        $this->_ExplodeDate($this->dat2, $this->format2);
        $d1 = mktime($this->dat['hh'], $this->dat['ii'], $this->dat['ss'], $this->dat['mm'], $this->dat['jj'], $this->dat['aaaa']);
        $d2 = mktime($this->dat2['hh'], $this->dat2['ii'], $this->dat2['ss'], $this->dat2['mm'], $this->dat2['jj'], $this->dat2['aaaa']);

        if ($d2 > $d1)
            $d = $d2 - $d1;
        else
            $d = $d1 - $d2;

        return array("ans" => date('Y', $d) - 1970, "mois" => date('m', $d) - 1, "jours" => date('d', $d) - 1, "joursTotal" => $d / 60 / 60 / 24, "heures" => date("G", $d) - 1, "minutes" => date("i", $d), "secondes" => date("s", $d));
    }

    /**
     * Retourne la date dans un format pr�cis.
     * \param $format Format de la date � renvoyer.
     * \return Un tableau.
     */
    function GetDate($format = "jj/mm/aaaa") {
        $format = str_replace(array('jj', 'j', 'm', 'nn', 'aaaa', 'aa', 'hh', 'h', 'ii', 'ss'), array('d', 'D', 'n', 'm', 'Y', 'y', 'H', 'G', 'i', 's'), $format);
        //
        if (intval($this->dat['aaaa']) <= 1901 || intval($this->dat['aaaa']) >= 2038) {
            $sDay = $this->dat['jj'];
            $sMonth = $this->dat['mm'];
            $sYear = $this->dat['aaaa'];
            if (intval($sDay) <= 9)
                $sDay = "0" . $sDay;
            if (intval($sMonth) <= 9)
                $sMonth = "0" . $sMonth;
            if ($format == "d/m/Y") {
                return $sDay . "/" . $sMonth . "/" . $sYear;
            }
            // TODO : Si besoin, g�rer tous les autres formats de dates possibles
        }
        //
        return date($format, mktime($this->dat['hh'], $this->dat['ii'], $this->dat['ss'], $this->dat['mm'], $this->dat['jj'], $this->dat['aaaa']));
    }

    /**
     * V�rifie si la date pass� en param�tre correspond au format pass� en param�tre.
     * \param $dat Date. 
     * \param $format Format de la date.
     * \return Vrai.
     * \private
     */
    function _ExplodeDate(&$dat, $format) {
        $j[0] = 2;
        if (($j[1] = strpos($format, 'jj')) === false) {
            $j[0] = 1;
            if (($j[1] = strpos($format, 'j')) === false)
                $this->_error($format . " : " . ERROR_DAY_NOT_FOUND);
        }
        $m[0] = 2;
        if (($m[1] = strpos($format, 'mm')) === false)
            $m[0] = 1;
        if (($m[1] = strpos($format, 'm')) === false)
            $this->_error($format . " : " . ERROR_MONTH_NOT_FOUND);
        $a[0] = 4;
        if (($a[1] = strpos($format, 'aaaa')) === false) {
            //cherche pour un aa au lieu de aaaa
            $a[0] = 2;
            if (($a[1] = strpos($format, 'aa')) === false)
                $this->_error($format . " : " . ERROR_YEAR_NOT_FOUND);
        }
        $h[0] = 2;
        if (($h[1] = strpos($format, 'hh')) === false)
            $h[0] = 1;
        if (($h[1] = strpos($format, 'h')) === false)
            $this->_error($format . " : " . ERROR_HOUR_NOT_FOUND);
        $i[0] = 2;
        if (($i[1] = strpos($format, 'ii')) === false)
            $i[0] = 1;
        if (($i[1] = strpos($format, 'i')) === false)
            $this->_error($format . " : " . ERROR_MINUTE_NOT_FOUND);
        $s[0] = 2;
        if (($s[1] = strpos($format, 'ss')) === false)
            $s[0] = 1;
        if (($s[1] = strpos($format, 's')) === false)
            $this->_error($format . " : " . ERROR_SECOND_NOT_FOUND);
        $dat['jj'] = ($j[1] !== false) ? floatval(substr($dat['origine'], $j[1], $j[0])) : 1;
        $dat['mm'] = ($m[1] !== false) ? floatval(substr($dat['origine'], $m[1], $m[0])) : 1;
        $dat['aaaa'] = ($a[1] !== false) ? floatval(substr($dat['origine'], $a[1], $a[0])) : 1970;
        if ($a[0] == 2)
            $dat['aaaa'] = floatval(substr(date('Y'), 0, 2) . $dat['aaaa']);
        $dat['hh'] = ($h[1] !== false) ? floatval(substr($dat['origine'], $h[1], $h[0])) : 0;
        $dat['ii'] = ($i[1] !== false) ? floatval(substr($dat['origine'], $i[1], $i[0])) : 0;
        $dat['ss'] = ($s[1] !== false) ? floatval(substr($dat['origine'], $s[1], $s[0])) : 0;
        return true;
    }

    /**
     * Stocke le message d'erreur.
     * \param $str.
     * \return Vrai.
     * \private
     */
    function _error($str) {
        $this->errno[] = $str;
        return true;
    }

}

?>
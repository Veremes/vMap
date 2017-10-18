<?php

/**
 * \file Mj_Compte_Communal.class.inc
 * \brief Mj_Compte_Communal.class.inc \n \n Ce fichier contient la classe php Mj_Compte_Communal
 * 
 * Cette classe permet de sélectionner les attributs nécessaires afin de traiter la partie compte communal.
 *
 * \author Damien Bedel 
 * \author Olivier Gayte <olivier.gayte@veremes.com>
 */
require_once ("Mj.class.inc");
require_once ("Mj_Proprietaire.class.inc");
require_once ("Mj_Bati.class.inc");
require_once ("Mj_Parcelle.class.inc");

class Mj_Compte_Communal extends Mj {

    /**
     * Tableau associatif comportant la liste des objets Proprietaire d'un compte communal.
     */
    var $aPro = array();

    /**
     * Tableau associatif comportant la liste des objets Bati d'un compte communal.
     */
    var $aBat = array();

    /**
     * Tableau associatif comportant la liste des objets Non Bati d'un compte communal.
     */
    var $aPar = array();

    /**
     * Chaine qui stocke l'année de référence des données casdatrales.
     */
    var $sAnneeReference;

    /**
     * \param $sIdDnupro Identifiant national de compte communal
     * \param $oBD Objet de connexion PDO_BD
     */
    function __construct($sIdDnupro, $oBD, $properties, $sEncryptKey = '') {
        $oBD = new BD($properties["cadastre"]["rp"]["login"], $properties["cadastre"]["rp"]["pass"], $properties["database"], $properties["server"], $properties["port"], $properties["sgbd"], $properties["page_encoding"]);
        if (is_null($oBD->connexion)) {
            $this->sStatus = 1;
            $this->sMessage = "Connexion impossible avec " . $properties["cadastre"]["rp"]["login"];
            writeToErrorLog($this->sMessage);
            return null;
        }
        $this->sEncryptKey = $sEncryptKey;
        include $this->sRessourcesFile;
        $this->sSql = $aSql[$oBD->sgbd]['compte_communal'];
        $this->sSql = str_replace('$sIdDnupro', $this->encrypt($sIdDnupro), $this->sSql);
        $oPDOresult = $oBD->execute($this->sSql);
        if ($oBD->enErreur()) {
            $this->sStatus = 1;
            $this->sMessage = $oBD->getBDMessage();
        } else {
            $this->sStatus = 0;
            $this->aFields = $oBD->ligneSuivante($oPDOresult);
            $this->aFields['id_dnupro'] = $sIdDnupro;
        }
        $oPDOresult = $oBD->fermeResultat();
        $this->aPro = $this->get_aPro($oBD);
        $this->aBat = $this->get_aBat($oBD);
        $this->aPar = $this->get_aPar($oBD);
        $this->sSql = $aSql[$oBD->sgbd]['annee_reference'];
        $oPDOresult = $oBD->execute($this->sSql);
        if ($oBD->erreurRencontree != 0) {
            $this->sStatus = 1;
            $this->sMessage = $oBD->getBDMessage();
        } else {
            $aAnneeReference = $oBD->ligneSuivante($oPDOresult);
            $this->sAnneeReference = $aAnneeReference['annee'];
        }
        $this->aObjects = array_merge($this->aPro, $this->aBat, $this->aPar);
    }

    /**
     * Cette méthode permet de récupérer les ID_PRO en fonction d'un ID_DNUPRO donné.
     * \return Retourne un tableau de ID_PRO.
     */
    function get_aId_Pro($oBD) {
        if ($this->isEmpty()) {
            $aIdPro = "";
        } else {
            include $this->sRessourcesFile;
            $aIdPro = array();
            $this->sSql = $aSql[$oBD->sgbd]['get_id_pro'];
            $this->sSql = str_replace('$sIdDnupro', $this->encrypt($this->aFields['id_dnupro']), $this->sSql);

            $oPDOresult = $oBD->execute($this->sSql);
            if ($oBD->enErreur()) {
                $this->sStatus = 1;
                $this->sMessage = $oBD->getBDMessage();
            } else {
                while ($aResultFetch = $oBD->tableauSuivant($oPDOresult)) {
                    array_push($aIdPro, $aResultFetch[0]);
                    $this->sStatus = 0;
                }
            }
        }
        return $aIdPro;
        $oPDOresult = $oBD->fermeResultat();
    }

    /**
     * Cette méthode permet de récupérer la liste des objets Proprietaire
     * \param $oBD Objet de connexion PDO_BD
     * \return Retourne un tableau d'objets Proprietaire
     */
    function get_aPro($oBD) {
        $aPro = array();
        if ($this->isEmpty()) {
            $aPro = "";
        } else {
            $aIdPro = $this->get_aId_Pro($oBD);

            foreach ($aIdPro as $sIdPro) {
                array_push($aPro, new Mj_Proprietaire($this->aFields['id_dnupro'], $sIdPro, $oBD, $this->sEncryptKey));
            }
        }
        return $aPro;
    }

    /**
     * Cette méthode permet de récupérer les ID_BAT en fonction d'un ID_DNUPRO donné
     * \param $oBD Objet de connexion PDO_BD
     * \return Retourne un tableau de ID_BAT
     */
    function get_aId_Bat($oBD) {
        if ($this->isEmpty()) {
            $aIdBat = "";
        } else {
            include $this->sRessourcesFile;
            $aIdBat = array();
            $this->sSql = $aSql[$oBD->sgbd]['get_id_bat'];
            $this->sSql = str_replace('$sIdDnupro', $this->aFields['id_dnupro'], $this->sSql);
            $oPDOresult = $oBD->execute($this->sSql);
            if ($oBD->enErreur()) {
                $this->sStatus = 1;
                $this->sMessage = $oBD->getBDMessage();
            } else {
                while ($aResultFetch = $oBD->tableauSuivant($oPDOresult)) {
                    array_push($aIdBat, $aResultFetch[0]);
                    $this->sStatus = 0;
                }
            }
        }
        return $aIdBat;
    }

    /**
     * Cette méthode permet de récupérer la liste des objets BATI
     * \param $oBD Objet de connexion PDO_BD
     * \return Retourne un tableau d'objets BATI
     */
    function get_aBat($oBD) {
        $aBat = array();
        if ($this->isEmpty()) {
            $aBat = "";
        } else {
            $aIdBat = $this->get_aId_Bat($oBD);
            foreach ($aIdBat as $sIdBat) {
                array_push($aBat, new Mj_Bati($sIdBat, $oBD, $this->sEncryptKey));
            }
        }
        return $aBat;
    }

    /**
     * Cette méthode permet de récupérer les ID_PAR en fonction d'un ID_DNUPRO donné
     * \param $oBD Objet de connexion PDO_BD
     * \return Retourne un tableau de ID_PAR
     */
    function get_aId_Par($oBD) {
        if ($this->isEmpty()) {
            $aIdPar = "";
        } else {
            include $this->sRessourcesFile;
            $aIdPar = array();
            $this->sSql = $aSql[$oBD->sgbd]['get_id_par'];
            $this->sSql = str_replace('$sDnupro', $this->aFields['dnupro'], $this->sSql);
            $this->sSql = str_replace('$sIdCom', $this->aFields['ccodep'] . $this->aFields['ccocom'], $this->sSql);
            //$this->sSql=str_replace('$sIdDnupro', $this->aFields['id_dnupro'], $this->sSql);
            $oPDOresult = $oBD->execute($this->sSql);
            if ($oBD->enErreur()) {
                $this->sStatus = 1;
                $this->sMessage = $oBD->getBDMessage();
            } else {
                while ($aResultFetch = $oBD->tableauSuivant($oPDOresult)) {
                    array_push($aIdPar, $aResultFetch[0]);
                    $this->sStatus = 0;
                }
            }
            $this->sSql = $aSql[$oBD->sgbd]['get_id_par_bnd'];
            $this->sSql = str_replace('sIdDnupro', $this->aFields['id_dnupro'], $this->sSql);
            $this->sSql = str_replace('sDnupro', substr($this->aFields['id_dnupro'], 6), $this->sSql);
            $this->sSql = str_replace('sIdCom', $this->aFields['ccodep'] . $this->aFields['ccodir'] . $this->aFields['ccocom'], $this->sSql);
            //$this->sSql=str_replace('$sIdDnupro', $this->aFields['id_dnupro'], $this->sSql);
            $oPDOresult = $oBD->execute($this->sSql);
            if ($oBD->enErreur()) {
                $this->sStatus = 1;
                $this->sMessage = $oBD->getBDMessage();
            } else {
                while ($aResultFetch = $oBD->tableauSuivant($oPDOresult)) {
                    array_push($aIdPar, $aResultFetch[0]);

                    $this->sStatus = 0;
                }
            }
            $this->aExportFields = $this->getExportFields();
        }
        return $aIdPar;
    }

    /**
     * Cette méthode permet de récupérer la liste des objets PARCELLE
     * \param $oBD Objet de connexion PDO_BD
     * \return Retourne un tableau d'objets PARCELLE
     */
    function get_aPar($oBD) {
        $aPar = array();
        if ($this->isEmpty()) {
            $aPar = "";
        } else {
            $aIdPar = $this->get_aId_Par($oBD);
            foreach ($aIdPar as $sIdPar) {
                array_push($aPar, new Mj_Parcelle($oBD, $sIdPar, $this->aFields['id_dnupro']));
            }
        }
        return $aPar;
    }

    /**
     * Cette méthode permet de construire un tableau correspondant au relevé de propriété.
     * \return Retourne un tableau associatif correspondant au relevé de propriété.
     */
    function getExportFields() {
        $aExportFields = array();
        if ($this->isEmpty()) {
            $aExportFields = "";
        } else {
            $aExportFields['codeinsee'] = $this->aFields['codeinsee'];
            $aExportFields['annee_de_maj'] = $this->sAnneeReference;
            $aExportFields['dep_dir'] = $this->getDepdir();
            $aExportFields['code_dep'] = $this->aFields['ccodep'];
            $aExportFields['code_com'] = $this->aFields['ccocom'];
            $aExportFields['lib_dep'] = $this->aFields['libdep'];
            $aExportFields['com'] = $this->getCom();
            $aExportFields['libcom'] = $this->aFields['libcom'];
            $aExportFields['role'] = "";
            $aExportFields['vue'] = "";
            $aExportFields['numero_communal'] = $this->aFields['dnupro'];
            $aExportFields['rev_impo_bati'] = $this->getRevImpoBati();
            $aExportFields['rev_impo_par'] = $this->getRevImpoPar();
            $iContenance = 0;
            foreach ($this->aPar as $oPar) {
                $iContenance = $iContenance + $oPar->getContenance();
            }
            $aExportFields['total_contenance'] = $this->getTotalContenance();
            $aExportFields['total_contenance_m2'] = $this->getTotalContenanceM2();
            $aExportFields['total_revenu_cadastral'] = $this->getRevenuCadastralTotal();
            $aExportFields['total_valeur_locative'] = $this->getValeurLocativeBati();
            $aExportFields['emprise_totale_intersect'] = $this->getTotalContenanceBati();
            $aExportFields['ha'] = intval($iContenance / 10000);
            if ($aExportFields['ha'] == 0) {
                $aExportFields['ha'] = ' ';
            }

            $aExportFields['a'] = intval(($iContenance % 10000) / 100);
            $sContenanceA = $aExportFields['a'];
            $sContenanceA = strval($sContenanceA);
            $sTlenA = strlen($sContenanceA);
            if ($aExportFields['ha'] == ' ' and $aExportFields['a'] == 0) {
                $aExportFields['a'] = ' ';
            } else {
                if ($aExportFields['ha'] == ' ' and $sTlenA == 2 and substr($aExportFields['a'], 0, 1) == 0) {
                    $sDeuxiemeValeur = substr($aExportFields['a'], 1, 1);
                    $aExportFields['a'] = ' ' . $sDeuxiemeValeur;
                } else {
                    if ($aExportFields['ha'] != ' ' and $sTlenA == 1) {
                        $aExportFields['a'] = '0' . $aExportFields['a'];
                    }
                }
            }
            $aExportFields['ca'] = $iContenance % 100;
            $sContenanceCa = $aExportFields['ca'];
            $sContenanceCa = strval($sContenanceCa);
            $sTlen = strlen($sContenanceCa);
            if ($aExportFields['a'] != 0)
                if ($sTlen == 1) {
                    $aExportFields['ca'] = '0' . $aExportFields['ca'];
                }
            $aExportFields['exo_com_bati'] = $this->getExoComBati();
            $aExportFields['rev_impo_com_bati'] = $this->getRevImpoComBati();
            $aExportFields['exo_dep_bati'] = $this->getExoDepBati();
            $aExportFields['rev_impo_dep_bati'] = $this->getRevImpoDepBati();
            $aExportFields['exo_reg_bati'] = $this->getExoRegBati();
            $aExportFields['rev_impo_reg_bati'] = $this->getRevImpoRegBati();
            $aExportFields['exo_com_par'] = $this->getExoComPar();
            $aExportFields['rev_impo_com_par'] = $this->getRevImpoComPar();
            //$aExportFields['exo_dep_reg_par']=$this->getExoDepRegPar();
            //$aExportFields['rev_impo_dep_reg_par']=$this->getRevImpoDepRegPar();
            $aExportFields['exo_dep_par'] = $this->getExoDepPar();
            $aExportFields['rev_impo_dep_par'] = $this->getRevImpoDepPar();
            $aExportFields['exo_reg_par'] = $this->getExoRegPar();
            $aExportFields['rev_impo_reg_par'] = $this->getRevImpoRegPar();
            //modif float
            $aExportFields['rev_impo_bati_float'] = $this->getRevImpoBatifloat();
            $aExportFields['rev_impo_par_float'] = $this->getRevImpoParfloat();
            $aExportFields['exo_com_bati_float'] = $this->getExoComBatifloat();
            $aExportFields['rev_impo_com_bati_float'] = $this->getRevImpoComBatifloat();
            $aExportFields['exo_dep_bati_float'] = $this->getExoDepBatifloat();
            $aExportFields['rev_impo_dep_bati_float'] = $this->getRevImpoDepBatifloat();
            $aExportFields['exo_reg_bati_float'] = $this->getExoRegBatifloat();
            $aExportFields['rev_impo_reg_bati_float'] = $this->getRevImpoRegBatifloat();
            $aExportFields['exo_com_par_float'] = $this->getExoComParfloat();
            $aExportFields['rev_impo_com_par_float'] = $this->getRevImpoComParfloat();
            //$aExportFields['exo_dep_reg_par_float']=$this->getExoDepRegParfloat();
            //$aExportFields['rev_impo_dep_reg_par_float']=$this->getRevImpoDepRegParfloat();
            $aExportFields['exo_dep_par_float'] = $this->getExoDepParfloat();
            $aExportFields['rev_impo_dep_par_float'] = $this->getRevImpoDepParfloat();
            $aExportFields['exo_reg_par_float'] = $this->getExoRegParfloat();
            $aExportFields['rev_impo_reg_par_float'] = $this->getRevImpoRegParfloat();
            $aExportFields['exo_tax_ad_par_float'] = $this->getExoTaxeADParfloat();
            $aExportFields['rev_impo_tax_ad_par_float'] = $this->getRevImpoTaxeADParfloat();
            $aExportFields['exo_tax_ad_par'] = $this->getExoTaxeADPar();
            $aExportFields['rev_impo_tax_ad_par'] = $this->getRevImpoTaxeADPar();
        }
        return $aExportFields;
    }

    /**
     * Cette méthode permet de concaténer les attributs ccodep et ccodir.
     * /return Retourne une chaîne de caractères correspondant au DEP DIR du RP.
     */
    function getDepdir() {
        $sDepdir = $this->aFields['ccodep'] . " " . $this->aFields['ccodir'];
        return $sDepdir;
    }

    /**
     * Cette méthode permet de concaténer les attributs ccocom et libcom.
     * /return Retourne une chaîne de carcatères correspondant au COM du RP.
     */
    function getCom() {
        $sCom = $this->aFields['ccocom'] . " " . $this->aFields['libcom'];
        return $sCom;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable total du bâti.
     * \return Retourne un entier.
     */
    function getRevImpoBati() {
        $iRevImpoBati = 0;
        foreach ($this->aBat as $oBat) {
            $iRevImpoBati = $iRevImpoBati + (int) $oBat->getRevenuCadastral();
            ;
        }
        return $iRevImpoBati;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable total du bâti.
     * \return Retourne un float.
     */
    function getRevImpoBatifloat() {
        $fRevImpoBati = 0;
        foreach ($this->aBat as $oBat) {
            $fRevImpoBati = $fRevImpoBati + (float) $oBat->getRevenuCadastralfloat();
            ;
        }
        return $fRevImpoBati;
    }

    /**
     * Cette méthode permet de calculer l'exonération communale totale du bâti.
     * \return Retourne un entier
     */
    function getExoComBati() {
        $iExoComBati = 0;
        foreach ($this->aBat as $oBat) {
            $iExoComBati = $iExoComBati + $oBat->getExoneration($oPro->aFields['l_ccodem']);
        }
        return $iExoComBati;
    }

    /**
     * Cette méthode permet de calculer l'exonération communale totale du bâti.
     * \return Retourne un float
     */
    function getExoComBatifloat() {
        $fExoComBati = 0;
        foreach ($this->aBat as $oBat) {
            $fExoComBati = $fExoComBati + $oBat->getExonerationfloat($oPro->aFields['l_ccodem']);
        }
        return $fExoComBati;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable communal du bâti en fonction du revenu imposable total (bâti) et de l'exonération communale totale (bâti).
     * \return Retourne un entier.
     */
    function getRevImpoComBati() {
        $iRevImpoComBati = $this->getRevImpoBati() - $this->getExoComBati($oPro->aFields['l_ccodem']);
        return $iRevImpoComBati;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable communal du bâti en fonction du revenu imposable total (bâti) et de l'exonération communale totale (bâti).
     * \return Retourne un float.
     */
    function getRevImpoComBatifloat() {
        $fRevImpoComBati = $this->getRevImpoBatifloat() - $this->getExoComBatifloat($oPro->aFields['l_ccodem']);
        return $fRevImpoComBati;
    }

    /**
     * Cette méthode permet de calculer l'exonération départementale totale du bâti.
     * \return Retourne un entier
     */
    function getExoDepBati() {
        $iExoDepBati = 0;
        foreach ($this->aBat as $oBat) {
            $iExoDepBati = $iExoDepBati + $oBat->getExoneration($oPro->aFields['l_ccodem']);
        }
        return $iExoDepBati;
    }

    /**
     * Cette méthode permet de calculer l'exonération départementale totale du bâti.
     * \return Retourne un float
     */
    function getExoDepBatifloat() {
        $fExoDepBati = 0;
        foreach ($this->aBat as $oBat) {
            $fExoDepBati = $fExoDepBati + $oBat->getExonerationfloat($oPro->aFields['l_ccodem']);
        }
        return $fExoDepBati;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable départemental du bâti en fonction du revenu imposable total (bâti) et de l'exonération départemantale totale (bâti).
     * \return Retourne un entier.
     */
    function getRevImpoDepBati() {
        $iRevImpoDepBati = $this->getRevImpoBati() - $this->getExoDepBati();
        return $iRevImpoDepBati;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable départemental du bâti en fonction du revenu imposable total (bâti) et de l'exonération départemantale totale (bâti).
     * \return Retourne un float.
     */
    function getRevImpoDepBatifloat() {
        $fRevImpoDepBati = $this->getRevImpoBatifloat() - $this->getExoDepBatifloat();
        return $fRevImpoDepBati;
    }

    /**
     * Cette méthode permet de calculer l'exonération régionale totale du bâti.
     * \return Retourne un entier
     */
    function getExoRegBati() {
        $iExoRegBati = 0;
        foreach ($this->aBat as $oBat) {
            $iExoRegBati = $iExoRegBati + $oBat->getExoneration($oPro->aFields['l_ccodem']);
        }
        return $iExoRegBati;
    }

    /**
     * Cette méthode permet de calculer l'exonération régionale totale du bâti.
     * \return Retourne un float
     */
    function getExoRegBatifloat() {
        $fExoRegBati = 0;
        foreach ($this->aBat as $oBat) {
            $fExoRegBati = $fExoRegBati + $oBat->getExonerationfloat($oPro->aFields['l_ccodem']);
        }
        return $fExoRegBati;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable régional du bâti en fonction du revenu imposable total (bâti) et de l'exonération régionale totale (bâti).
     * \return Retourne un entier.
     */
    function getRevImpoRegBati() {
        $iRevImpoRegBati = $this->getRevImpoBati() - $this->getExoRegBati();
        return $iRevImpoRegBati;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable régional du bâti en fonction du revenu imposable total (bâti) et de l'exonération régionale totale (bâti).
     * \return Retourne un float.
     */
    function getRevImpoRegBatifloat() {
        $fRevImpoRegBati = $this->getRevImpoBatifloat() - $this->getExoRegBatifloat();
        return $fRevImpoRegBati;
    }

    /**
     * Cette méthode permet de calculer l'emprise bâtie totale des parcelles.
     * \return Retourne un entier.
     */
    function getTotalContenanceBati() {
        $iContenance = 0;
        foreach ($this->aPar as $oPar) {
            foreach ($oPar->aIntersect as $oIntersect) {
                $iContenanceBati = $iContenanceBati + $oIntersect->getEmpriseTotale();
            }
        }
        return $iContenanceBati;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable total des parcelles.
     * \return Retourne un entier.
     */
    function getRevImpoPar() {
        $fRevImpoPar = 0;
        foreach ($this->aPar as $oPar) {
            $fRevImpoPar = $fRevImpoPar + (float) $oPar->getRevenuCadastral();
            $iRevImpoPar = round($fRevImpoPar);
        }
        return $iRevImpoPar;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable total des parcelles.
     * \return Retourne un float.
     */
    function getRevImpoParfloat() {
        $fRevImpoPar = 0;
        foreach ($this->aPar as $oPar) {
            $fRevImpoPar = $fRevImpoPar + (float) $oPar->getRevenuCadastral();
        }
        return $fRevImpoPar;
    }

    /** DEPRECATED
      /**
     * Cette méthode permet de calculer l'exonération (départementale et régionale) totale des parcelles.
     * \return Retourne un entier
     */
    /*
      function getExoDepRegPar(){
      $fExoDepRegPar=0;
      foreach($this->aPar as $oPar){
      $fExoDepRegPar=$fExoDepRegPar + $oPar->getRevenuCadastralAvecExo();
      }
      $iExoDepRegPar = round($fExoDepRegPar);
      return $iExoDepRegPar;
      }
     */
    /**
     * Cette méthode permet de calculer le revenu imposable (départemental et régional) des parcelles en fonction du revenu imposable total (parcelles) et de l'exonération (départementale et régionale) totale (parcelles).
     * \return Retourne un entier.
     */
    /*
      function getRevImpoDepRegPar(){
      $iRevImpoDepRegPar=$this->getRevImpoPar()-$this->getExoDepRegPar();
      return $iRevImpoDepRegPar;
      }
     */

    /**
     * Cette méthode permet de calculer l'exonération départementale totale des parcelles.
     * \return Retourne un entier
     */
    function getExoDepPar() {
        $fExoDepPar = 0;
        foreach ($this->aPar as $oPar) {
            $fExoDepPar = $fExoDepPar + $oPar->getRevenuCadastralDepAvecExo();
        }
        $iExoDepPar = round($fExoDepPar);
        return $iExoDepPar;
    }

    /**
     * Cette méthode permet de calculer l'exonération départementale totale des parcelles.
     * \return Retourne un float
     */
    function getExoDepParfloat() {
        $fExoDepPar = 0;
        foreach ($this->aPar as $oPar) {
            $fExoDepPar = $fExoDepPar + $oPar->getRevenuCadastralDepAvecExo();
        }
        return $fExoDepPar;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable départemental des parcelles en fonction du revenu imposable total (parcelles) et de l'exonération (départementale et régionale) totale (parcelles).
     * \return Retourne un entier.
     */
    function getRevImpoDepPar() {
        $iRevImpoDepPar = $this->getRevImpoPar() - $this->getExoDepPar();
        return $iRevImpoDepPar;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable départemental des parcelles en fonction du revenu imposable total (parcelles) et de l'exonération (départementale et régionale) totale (parcelles).
     * \return Retourne un float.
     */
    function getRevImpoDepParfloat() {
        $fRevImpoDepPar = $this->getRevImpoParfloat() - $this->getExoDepParfloat();
        return $fRevImpoDepPar;
    }

    /**
     * Cette méthode permet de calculer l'exonération régionale totale des parcelles.
     * \return Retourne un entier
     */
    function getExoRegPar() {
        $fExoRegPar = 0;
        foreach ($this->aPar as $oPar) {
            $fExoRegPar = $fExoRegPar + $oPar->getRevenuCadastralRegAvecExo();
        }
        $iExoRegPar = round($fExoRegPar);
        return $iExoRegPar;
    }

    /**
     * Cette méthode permet de calculer l'exonération régionale totale des parcelles.
     * \return Retourne un float
     */
    function getExoRegParfloat() {
        $fExoRegPar = 0;
        foreach ($this->aPar as $oPar) {
            $fExoRegPar = $fExoRegPar + $oPar->getRevenuCadastralRegAvecExo();
        }
        return $fExoRegPar;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable régional des parcelles en fonction du revenu imposable total (parcelles) et de l'exonération (départementale et régionale) totale (parcelles).
     * \return Retourne un entier.
     */
    function getRevImpoRegPar() {
        $iRevImpoRegPar = $this->getRevImpoPar() - $this->getExoRegPar();
        return $iRevImpoRegPar;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable régional des parcelles en fonction du revenu imposable total (parcelles) et de l'exonération (départementale et régionale) totale (parcelles).
     * \return Retourne un float.
     */
    function getRevImpoRegParfloat() {
        $fRevImpoRegPar = $this->getRevImpoParfloat() - $this->getExoRegParfloat();
        return $fRevImpoRegPar;
    }

    /**
     * Cette méthode permet de calculer la contenance totale des parcelles.
     * \return Retourne un entier.
     */
    function getTotalContenance() {
        $iContenance = 0;
        foreach ($this->aPar as $oPar) {
            $iContenance = $iContenance + $oPar->aFields['dcntpa'];
        }
        return $iContenance;
    }

    /**
     * Cette méthode permet de calculer la contenance totale des parcelles en mettre carré. 
     * \return Retourne un entier.
     */
    function getTotalContenanceM2() {
        $iContenanceM2 = 0;
        foreach ($this->aPar as $oPar) {
            $iContenanceM2 = $iContenanceM2 + $oPar->getContenance();
        }
        return $iContenanceM2;
    }

    /**
     * Cette méthode permet de récupérer le revenu cadastral total des parcelles.
     * \return Retourne un double
     */
    function getRevenuCadastralTotal() {
        $dRevCadastralTotal = 0;
        foreach ($this->aPar as $oPar) {
            $dRevCadastralTotal = $dRevCadastralTotal + $oPar->getRevenuCadastral();
        }
        //$iRevCadastralTotal = round($dRevCadastralTotal);
        return $dRevCadastralTotal;
    }

    /**
     * Cette méthode permet de calculer l'éxonération communale totale des parcelles.
     * \return Retourne 0;
     */
    function getExoComPar() {
        $iExoComPar = 0;
        foreach ($this->aPar as $oPar) {
            $fExoComPar = $fExoComPar + $oPar->getRevenuCadastralComAvecExo();
        }
        $iExoComPar = round($fExoComPar);
        return $iExoComPar;
    }

    /**
     * Cette méthode permet de calculer l'éxonération communale totale des parcelles.
     * \return Retourne 0;
     */
    function getExoComParfloat() {
        $fExoComPar = 0;
        foreach ($this->aPar as $oPar) {
            $fExoComPar = $fExoComPar + $oPar->getRevenuCadastralComAvecExo();
        }
        return $fExoComPar;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable communal des parcelles en fonction du revenu imposable total (parcelles) et de l'exonération communale totale (parcelles).
     * \return Retourne un entier.
     */
    function getRevImpoComPar() {
        $iRevImpoComPar = $this->getRevImpoPar() - $this->getExoComPar();
        return $iRevImpoComPar;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable communal des parcelles en fonction du revenu imposable total (parcelles) et de l'exonération communale totale (parcelles).
     * \return Retourne un float.
     */
    function getRevImpoComParfloat() {
        $fRevImpoComPar = $this->getRevImpoParfloat() - $this->getExoComParfloat();
        return $fRevImpoComPar;
    }

    function getExoTaxeADPar() {
        $iExoTaxeAdPar = 0;
        foreach ($this->aPar as $oPar) {
            $fExoTaxeADPar = $fExoTaxeADPar + $oPar->getRevenuCadastralTaxeADAvecExo();
        }
        $iExoTaxeADPar = round($fExoTaxeADPar);
        return $iExoTaxeADPar;
    }

    /**
     * Cette méthode permet de calculer l'éxonération des taxes additionnelles totale des parcelles.
     * \return Retourne 0;
     */
    function getExoTaxeADParfloat() {
        $fExoTaxeADPar = 0;
        foreach ($this->aPar as $oPar) {
            $fExoTaxeADPar = $fExoTaxeADPar + $oPar->getRevenuCadastralTaxeADAvecExo();
        }
        return $fExoTaxeADPar;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable des taxes additionnelles des parcelles en fonction du revenu imposable total (parcelles) et de l'exonération communale totale (parcelles).
     * \return Retourne un entier.
     */
    function getRevImpoTaxeAdPar() {
        $iRevImpoTaxeADPar = $this->getRevImpoPar() - $this->getExoTaxeADPar();
        return $iRevImpoTaxeADPar;
    }

    /**
     * Cette méthode permet de calculer le revenu imposable des taxes additionnelles des parcelles en fonction du revenu imposable total (parcelles) et de l'exonération communale totale (parcelles).
     * \return Retourne un float.
     */
    function getRevImpoTaxeADParfloat() {
        $fRevImpoTaxeADPar = $this->getRevImpoParfloat() - $this->getExoTaxeADParfloat();
        return $fRevImpoTaxeADPar;
    }

    /**
     * Cette méthode permet de récupérer la valeur locative totale du bâti.
     * \return Retourne un double
     */
    function getValeurLocativeBati() {
        $iValeurLocativeBati = 0;
        foreach ($this->aBat as $oBat) {
            $iValeurLocativeBati = $oBat->aFields['dvlpera'] + $iValeurLocativeBati;
        }
        return $iValeurLocativeBati;
    }

}

?>
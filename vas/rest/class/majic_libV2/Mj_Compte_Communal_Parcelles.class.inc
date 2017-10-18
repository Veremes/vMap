<?php

/**
 * \file Mj_Bati_Parcelles.class.inc
 * \brief Mj_Bati_Parcelles.class.inc \n \n Ce fichier contient la classe php Mj_Bati_Parcelles
 *
 * Cette classe permet de sélectionner les attributs nécessaires afin de traiter les batis associés à une parcelle.
 *
 * \author Damien Bedel
 * \author Olivier Gayte <olivier.gayte@veremes.com>
 */
require_once ("Mj.class.inc");
require_once ("Mj_Compte_Communal_Parcelle.class.inc");

class Mj_Compte_Communal_Parcelles extends Mj {

    /**
     * \param $aIdPar Tableau Identifiants des parcelles
     * \param $oBD Objet de connexion
     * \param $properties Tableau des propriétés
     * \param $sLayerTypeParcelle Chaine Type de géométrie des parcelles
     */
    function __construct($aIdPar, $oUserBD, $properties, $sLayerTypeParcelle) {
        $oBD = new BD($properties["cadastre"]["rp"]["login"], $properties["cadastre"]["rp"]["pass"], $properties["database"], $properties["server"], $properties["port"], $properties["sgbd"], $properties["page_encoding"]);
        if (is_null($oBD->connexion)) {
            $this->sStatus = 1;
            $this->sMessage = "Connexion impossible avec " . $properties["cadastre"]["rp"]["login"];
            writeToErrorLog($this->sMessage);
            return null;
        }
        $i = 0;
        while ($aIdPar[$i]) {
            array_push($this->aObjects, new Mj_Compte_Communal_Parcelle("", $aIdPar[$i], $oBD, $properties));
            $i++;
        }
        foreach ($this->getObjects('Mj_Compte_Communal_Parcelle') as $oCptParcelle) {
            foreach ($oCptParcelle->getObjects('Mj_Parcelle') as $oParcelle) {
                $oParcelle->getEmprises($properties, $oUserBD, $sLayerTypeParcelle);
                foreach ($oParcelle->getObjects('Mj_Emprises') as $oEmprises) {
                    if ($oEmprises->isError()) {
                        $this->sStatus = 1;
                        $this->sMessage = "Erreur lors des récupérations des emprises, consulter le error.log";
                        //error_log($oEmprises);
                    }
                }
            }
        }
    }

    /**
     * \brief Récupération de la surface totale des parcelles
     */
    function getSurfaceCadastrale() {
        $dSurfaceCadastrale = 0;
        foreach ($this->getObjects('Mj_Compte_Communal_Parcelle') as $oCptCom) {
            $aFields = $oCptCom->getExportFields();
            $dSurfaceCadastrale = $aFields['total_contenance'] + $dSurfaceCadastrale;
        }
        return $dSurfaceCadastrale;
    }

    /**
     * \brief Récupération de la surface totale des parcelles en mettre carré
     */
    function getSurfaceCadastraleM2() {
        $dSurfaceCadastraleM2 = 0;
        foreach ($this->getObjects('Mj_Compte_Communal_Parcelle') as $oCptCom) {
            $aFields = $oCptCom->getExportFields();
            $dSurfaceCadastraleM2 = $aFields['total_contenance_m2'] + $dSurfaceCadastraleM2;
        }
        return $dSurfaceCadastraleM2;
    }

    /**
     * \brief Récupération des revenus de la subdivision fiscale des parcelles
     */
    function getRevenuCadastral() {
        $dRevenuCadastral = 0;
        foreach ($this->getObjects('Mj_Compte_Communal_Parcelle') as $oCptCom) {
            $aFields = $oCptCom->getExportFields();
            $dRevenuCadastral = $aFields['total_revenu_cadastral'] + $dRevenuCadastral;
        }
        return $dRevenuCadastral;
    }

    /**
     * \brief Récupération des valeurs locatives
     */
    function getValeurLocative() {
        $dValeurLocative = 0;
        foreach ($this->getObjects('Mj_Compte_Communal_Parcelle') as $oCptCom) {
            $aFields = $oCptCom->getExportFields();
            $dValeurLocative = $aFields['total_valeur_locative'] + $dValeurLocative;
        }
        return $dValeurLocative;
    }

    /**
     * \brief Récupération de la emprises bâties totale des parcelles
     */
    function getSurfaceCadastraleBati() {
        $dSurfaceCadastraleBati = 0;
        foreach ($this->getObjects('Mj_Compte_Communal_Parcelle') as $oCptCom) {
            foreach ($oCptCom->getObjects('Mj_Parcelle') as $oParcelle) {
                foreach ($oParcelle->getObjects('Mj_Emprises') as $oEmprises) {
                    $aFields = $oEmprises->getExportFields();
                    if ($aFields['titre'] == "Emprise Bati") {
                        $dSurfaceCadastraleBati = $aFields['emprise_totale_intersect'] + $dSurfaceCadastraleBati;
                    }
                }
            }
        }
        return $dSurfaceCadastraleBati;
    }

    /**
     * \brief Cette méthode permet de construire un tableau correspondant au relevé de propriété.
     * \return Retourne un tableau associatif correspondant au relevé de propriété.
     */
    function getExportFields() {
        $aExportFields = array();
        if (!empty($this->aObjects)) {
            //partie des sommes (surfaces,revenus,valeurs locatives)
            $aExportFields['Sum_revenu'] = $this->getRevenuCadastral();
            $aExportFields['Sum_contenance'] = $this->getSurfaceCadastrale();
            $aExportFields['Sum_contenance_m2'] = $this->getSurfaceCadastraleM2();
            $aExportFields['Sum_valeur_locative'] = $this->getValeurLocative();
            $aExportFields['Sum_contenance_bati'] = $this->getSurfaceCadastraleBati();
        }
        return $aExportFields;
    }

}

?>
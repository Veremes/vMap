<?php

/**
 * \file Mj_Bati_Parcelles.class.inc
 * \brief Mj_Bati_Parcelles.class.inc \n \n Ce fichier contient la classe php Mj_Bati_Parcelles
 *
 * Cette classe permet de s�lectionner les attributs n�cessaires afin de traiter les batis associ�s � une parcelle.
 *
 * \author Olivier Gayte <olivier.gayte@veremes.com>
 * \author Fabien Marty <fabien.marty@veremes.com>
 */
require_once ("Mj.class.inc");
require_once ("Mj_Bati_Parcelle.class.inc");

class Mj_Bati_Parcelles extends Mj {

    /**
     * \param $aIdPar Identifiant de la parcelle
     * \param $oBD Objet de connexion
     */
    function __construct($aIdPar, $oBD, $properties) {
        $oBD = new BD($properties["cadastre"]["rp"]["login"], $properties["cadastre"]["rp"]["pass"], $properties["database"], $properties["server"], $properties["port"], $properties["sgbd"], $properties["page_encoding"]);
        if (is_null($oBD->connexion)) {
            $this->sStatus = 1;
            $this->sMessage = "Connexion impossible avec " . $properties["cadastre"]["rp"]["login"];
            writeToErrorLog($this->sMessage);
            return null;
        }
        $i = 0;
        while ($aIdPar[$i]) {
            array_push($this->aObjects, new Mj_Bati_Parcelle($aIdPar[$i], $oBD));
            $i++;
        }
    }

    /**
     * \brief Cette m�thode permet de construire un tableau.
     * \return Retourne un tableau associatif.
     */
    function getExportFields() {
        $aExportFields = array();
        $aExportFields['sum_contenance_m2'] = $this->getSurfaceCadastraleM2();
        $aExportFields['sum_valeur_locative'] = $this->getValeurLocative();
        return $aExportFields;
    }

    /**
     * \brief R�cup�ration de la surface totale des parcelles en mettre carr�.
     */
    function getSurfaceCadastraleM2() {
        $dSurfaceCadastraleM2 = 0;
        foreach ($this->getObjects('Mj_Bati_Parcelle') as $oBatiPar) {
            $aFields = $oBatiPar->getExportFields();
            $dSurfaceCadastraleM2 = ((int) $aFields['contenance']) + $dSurfaceCadastraleM2;
        }
        return $dSurfaceCadastraleM2;
    }

    /**
     * \brief R�cup�ration des valeurs locatives
     */
    function getValeurLocative() {
        $dValeurLocative = 0;
        foreach ($this->getObjects('Mj_Bati_Parcelle') as $oBatiPar) {
            $aFields = $oBatiPar->getExportFields();
            $dValeurLocative = $aFields['total_valeur_locative'] + $dValeurLocative;
        }
        return $dValeurLocative;
    }

}

?>
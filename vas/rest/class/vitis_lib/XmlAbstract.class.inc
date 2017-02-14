<?php

/**
 * \file XmlAbstract.class.inc
 * \brief XmlAbstract.class.inc \n \n Ce fichier contient la classe php XmlAbstract.
 * 
 * Cette classe est une classe abstraite qui peut être appelé par les autres classes par héritage afin de construire un fichier XML.
 *
 * \author Nicolas Chazeau
 */

/**
 * \class XmlAbstract
 * \brief XmlAbstract Class \n \n XmlAbstract est une classe PHP.
 * 
 * Cette classe permet de retourner un objet de sélection dans un fichier XML.
 *
 * \author Olivier Gayte <olivier.gayte@veremes.com>
 * \author Nicolas Chazeau
 */
class XmlAbstract {
    /*
     * Tableau associatif contenant les attributs de l'objet.
     */

    var $aFields = array();
    /*
     * Tableau d'objets
     */
    var $aObjects = array();

    /**
     * Cette méthode permet d'afficher l'objet de sélection sous la forme d'un tableau HTML.
     * \return Retourne plusieurs chaînes de caractères ou une chaine de caractères vide si le tableau est vide. 
     */
    function asTable() {
        if ($this->isEmpty()) {
            $sResult = "";
        } else {
            $sResult = "<table border=3 rules=all>\n";
            foreach ($this->aExportFields as $sAttribut => $sValue) {
                $sResult .= "<td>" . $sAttribut . "</td>\n";
            }
            $sResult .= "\t<tr>\n";
            foreach ($this->aExportFields as $sAttribut => $sValue) {
                $sResult .= "<td>" . $sValue . "</td>\n";
            }
            $sResult .= "</table>\n";
        }
        return $sResult;
    }

    /**
     * Cette méthode permet de déterminer si le tableau $this->aFields est vide ou non.
     * \return Retourne false si $this->aFields est non vide.
     */
    function isEmpty() {
        return empty($this->aFields);
    }

    /**
     * Cette méthode permet de créer un tableau identique au tableau $this->aFields.
     * \return Retourne un tableau.
     */
    function getExportFields() {
        return $this->aFields;
    }

    /**
     * Cette méthode permet de générer un document XML sous la forme d'une chaîne de caractères encodé en UTF-8
     * \param $sXSLUrl Nom du fichier de style XSL utilisé.
     * \param $sXmlRacine Nom de l'élément racine du fichier XML.
     * \param $sEncodageXML Encodage. UTF-8 par défaut.
     * \param $sSourceEncoding Encodage de la base de données : ISO-8859-1 par défaut.
     * \return Retourne un objet DomDocument.
     */
    function asXML($sXSLUrl, $sXmlRacine, $sEncodageXML = 'UTF-8', $bAttributAsElement = False, $aXmlRacineAttribute = Array(), $sSourceEncoding = "ISO-8859-1") {
        $oDomDocument = new DOMDocument('1.0', $sEncodageXML);
        if (!Empty($sXSLUrl)) {
            $oDomDocument->appendChild($oDomDocument->createProcessingInstruction('xml-stylesheet', 'href="' . $sXSLUrl . '" type="text/xsl"'));
        }
        $oObject = $oDomDocument->appendChild(new DOMElement($sXmlRacine));
        foreach ($aXmlRacineAttribute as $sXmlAttribute => $sValue) {
            $oObject->setAttribute($sXmlAttribute, $this->sourceEncoding_targetEncoding($sSourceEncoding, $sEncodageXML, $sValue));
        }
        $oObject->appendChild($this->asDOMElement($oDomDocument, $bAttributAsElement, $sSourceEncoding, $sEncodageXML));
        return $oDomDocument->saveXML();
    }

    /**
     * Cette méthode permet de générer un document JSON sous la forme d'une chaîne de caractères encodé en UTF-8
     * \param $sXSLUrl Nom du fichier de style XSL utilisé.
     * \param $sXmlRacine Nom de l'élément racine du fichier XML.
     * \param $sEncodageXML Encodage. UTF-8 par défaut.
     * \param $sSourceEncoding Encodage de la base de données : ISO-8859-1 par défaut.
     * \return Retourne un objet DomDocument.
     */
    function asJSON($sXSLUrl, $sXmlRacine, $sEncodageXML = 'UTF-8', $bAttributAsElement = False, $aXmlRacineAttribute = Array(), $sSourceEncoding = "ISO-8859-1",$sEncodageJSONXML) {
        $oObject = $this->getObjects($this, $sEncodageJSONXML);
        foreach ($aXmlRacineAttribute as $sXmlAttribute => $sValue) {
            $oObject->$sXmlAttribute = $sValue;
        }
        $data = json_encode($oObject);
        return ($data);
    }

    function getJSON() {
        $aObjClass = array();
        foreach ($aObjClass->aObjects as $oObj) {
            if (get_class($oObj) == $sClasse) {
                array_push($aObjClass, $oObj);
            }
        }
        return $aObjClass;
    }

    function asHTML($aExportFields) {
        //Base case: an empty array produces no list
        if (empty($aExportFields))
            return '';

        //Recursive Step: make a list with child lists
        $output = '<ul>';
        if (is_array($aExportFields) == false) {
            $output .= '<li>' . $aExportFields . '</li>';
        } else {
            foreach ($aExportFields as $key => $subArray) {
                $output .= '<li>' . $key . $this->asHTML($subArray) . '</li>';
            }
        }

        $output .= '</ul>';

        return $output;
    }

    /**
     * Cette méthode permet de générer un document XML ou JSON sous la forme d'une chaîne de caractères encodé en UTF-8
     * \param $sXSLUrl Nom du fichier de style XSL utilisé.
     * \param $sXmlRacine Nom de l'élément racine du fichier XML.
     * \param $sEncodageXML Encodage. UTF-8 par défaut.
     * \param $sSourceEncoding Encodage de la base de données : ISO-8859-1 par défaut.
     * \param $sEncodageJSONXML Encodage XML par défaut, JSON sur demande
     * \return Retourne un objet DomDocument.
     */
    function asDocument($sXSLUrl, $sXmlRacine, $sEncodageXML = 'UTF-8', $bAttributAsElement = False, $aXmlRacineAttribute = Array(), $sSourceEncoding = "UTF-8", $sEncodageJSONXML = "xml") {
        if (strpos($sEncodageJSONXML, "xml") != false)
            return $this->asXML($sXSLUrl, $sXmlRacine, $sEncodageXML, $bAttributAsElement, $aXmlRacineAttribute, $sSourceEncoding);
        else if (strpos($sEncodageJSONXML, "json") != false)
            return $this->asJSON($sXSLUrl, $sXmlRacine, $sEncodageXML, $bAttributAsElement, $aXmlRacineAttribute, $sSourceEncoding, $sEncodageJSONXML);
        else if (strpos($sEncodageJSONXML, "html") != false) {
            $aExportFields = $this->getExportFields();
            return $this->asHTML($aExportFields);
        }
    }

    /**
     * Cette méthode permet de générer un document XML sous la forme d'un fichier téléchargeable.
     * \param $sXSLUrl Nom du Fichier de style XSL utilisé.
     * \param $sFileName Nom du fichier XML à générer.
     * \param $sXmlRacine Nom de l'élément racine du fichier XML.
     * \param $sEncodageXML Encodage. UTF-8 par défaut.
     * \param $sSourceEncoding Encodage de la base de données : ISO-8859-1 par défaut.
     */
    function asXMLFile($sXSLUrl, $sFileName, $sXmlRacine = "Mj", $sEncodageXML = 'UTF-8', $sSourceEncoding = "ISO-8859-1") {
        $sXML = $this->asXML($sXSLUrl, $sXmlRacine, $sEncodageXML, False, Array(), $sSourceEncoding);
        return file_put_contents($sFileName, $sXML);
    }

    /**
     * Cette méthode permet de créer un élément DomElement.
     * \param $oDomDocument : DOMDocument pere
     * \param $sSourceEncoding Encodage de la base de données : ISO-8859-1 par défaut.
     * \param $sEncodageXML Encodage. UTF-8 par défaut.
     * \return Retourne un objet DomElement.
     */
    function asDOMElement($oDomDocument, $bAttributAsElement = False, $sSourceEncoding = "ISO-8859-1", $sEncodageXML = 'UTF-8') {
        $oDomElement = $oDomDocument->appendChild(new DOMElement(get_class($this)));
        $aExportFields = $this->getExportFields();
        //si aExportFields n'est pas vide
        if ($aExportFields != "" && count($aExportFields) > 0) {
            foreach ($aExportFields as $sAttribut => $sValue) {
                if (is_array($sValue)) {
                    
                } else {
                    if ($bAttributAsElement) {
                        //nouveau fils , attribut : $sAttribut, valeur : sValue UTF-8
                        $oDomElement->appendChild(new DOMElement($sAttribut, $this->sourceEncoding_targetEncoding($sSourceEncoding, $sEncodageXML, $sValue)));
                    } else {
                        //nouvel attribut , attribut : $sAttribut, valeur : sValue UTF-8
                        $oDomElement->setAttribute($sAttribut, $this->sourceEncoding_targetEncoding($sSourceEncoding, $sEncodageXML, $sValue));
                    }
                }
            }
            //si le Fields est vide
        } elseif (!$this->isEmpty()) {
            foreach ($aExportFields as $sAttribut => $sValue) {
                //nouvel attribut , attribut : $sAttribut, valeur : sValue UTF-8
                $oDomElement->setAttribute($sAttribut, $this->sourceEncoding_targetEncoding($sSourceEncoding, $sEncodageXML, $sValue));
            }
        }
        foreach ($this->aObjects as $s => $oMj) {
            if (get_class($oMj) != "") {
                $oDomElement->appendChild($oMj->asDOMElement($oDomDocument, $bAttributAsElement, $sSourceEncoding, $sEncodageXML));
            }
        }
        return $oDomElement;
    }

    /**
     * Cette méthode renvoie un tableau contenant les objets de la classe $sClasse composant l'objet.
     * \return Retourne un tableau.
     */
    function getObjects($sClasse, $jsonFormat) {
        $aObjClass = new stdClass();
        if (strpos($jsonFormat, "x-vm-json") != false) {
            $sClassName = "data";
            $aObjClass->$sClassName = array();
        } else {
            $sClassName = strtolower(get_class($sClasse));
        }
        if (!empty($sClasse->aObjects)) {
           $aObjClass->$sClassName = array();
            foreach ($sClasse->aObjects as $oObj) {
                array_push($aObjClass->$sClassName, $this->getObjects($oObj, $jsonFormat));
            }
        }
        if (!empty($sClasse->aFields)) {
            foreach ($sClasse->aFields as $key => $value) {
                $aObjClass->$key = $value;
            }
        }
        if (empty($aObjClass->$sClassName) && isset($aObjClass->$sClassName)){
            unset($aObjClass->$sClassName);
        }
        return $aObjClass;
    }

    /**
     * Cette méthode permet d'encoder une chaine dans un encodage prédéfini "sTargetEncoding".
     * \param $sSourceEncoding Encodage de la donnée source
     * \param $sTargetEncoding Encodage dans lequel la donnée source source être encodée
     * \param $sString Chaine à encoder
     * \return Retourne un objet DomElement.
     */
    function sourceEncoding_targetEncoding($sSourceEncoding, $sTargetEncoding, $sString) {
        if ($sSourceEncoding != $sTargetEncoding) {
            return iconv($sSourceEncoding, $sTargetEncoding, $sString);
        } else {
            return $sString;
        }
    }

}

?>
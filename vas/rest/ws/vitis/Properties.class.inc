<?php

require_once 'Vitis.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
//require_once 'Domain.class.inc';
require_once(__DIR__ . '/../../class/vmlib/BdDataAccess.inc');

/**
 * \file properties.class.inc
 * \class Properties
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the Properties php class
 *
 * This class defines the rest api for properties
 * 
 */
class Properties extends Vitis {
    /**
     * @SWG\Definition(
     *   definition="/properties",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/properties")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Properties",
     *   description="Operations about properties"
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     * @param type $bShortcut false to reinit variables
     * @param type $oConnection connection object
     */
    function __construct($aPath, $aValues, $properties, $bShortcut = false, $oConnection = false) {
        parent::__construct($aPath, $aValues, $properties, $bShortcut, $oConnection);

        $this->aSelectedFields = Array("services_alias", 'language', 'domain.*', 'vas_home', 'database', 'sign_up', 'password_forgotten');

        // Properties accessibles
        if (in_array('vitis_admin', $this->oConnection->aPrivileges)) {
            $this->aSelectedFields = array_merge($this->aSelectedFields, $properties['aAdminFields']);
        }
        if (in_array('vitis_user', $this->oConnection->aPrivileges)) {
            $this->aSelectedFields = array_merge($this->aSelectedFields, $properties['aUserFields']);
        }
    }

    /**
     * @SWG\Get(path="/properties", 
     *   tags={"Properties"},
     *   summary="Get properties",
     *   description="Request to get properties",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *  @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/properties")
     *     )
     *  )
     */

    /**
     * 
     * @return properties
     */
    function GET() {

        if (isset($this->aSelectedFields) && !empty($this->aSelectedFields)) {
            $this->aFields = $this->getSelectedFields($this->aProperties);
        } else {
            $this->aFields = $this->aProperties;
        }
        require_once __DIR__ . "/../../conf/version.inc";

        if (VM_STATUS != "STABLE") {
            $this->aFields['VM_STATUS'] = "UNSTABLE";
        } else {
            $this->aFields['VM_STATUS'] = "STABLE";
            if ($pointeur = opendir(__DIR__ . "/../../conf/")) {
                while (($fichier = readdir($pointeur)) !== false) {

                    if (($fichier != '.') && ($fichier != '..')) {

                        if (is_dir(__DIR__ . "/../../conf/" . $fichier)) {
                            $sTexte = file_get_contents(__DIR__ . "/../../conf/" . $fichier . "/version.inc");

                            if (strpos($sTexte, "define (\"VM_STATUS\", \"STABLE\");") == false) {
                                $this->aFields['VM_STATUS'] = "UNSTABLE";
                            }
                        }
                    }
                }
                //fermeture du pointeur
                closedir($pointeur);
            }
            //pour chaque fichier et dossier
        }
        $aXmlRacineAttribute['status'] = 1;
        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        return $sMessage;
    }

    /**
     * Returns the properties to display
     * @param arrya $aProperties
     * @return array
     */
    function getSelectedFields($aProperties) {
        $aFields = Array();
        foreach ($aProperties as $key => $value) {
            if (is_array($aProperties[$key])) {
                foreach ($this->aSelectedFields as $sSelectedField) {
                    if (strpos($sSelectedField, '.')) {
                        $aSubSelectedFields = explode('.', $sSelectedField);
                        if ($aSubSelectedFields[0] === $key) {
                            if ($aSubSelectedFields[1] === '*') {
                                $aFields[$key] = $aProperties[$key];
                            } else {
                                if (!array_key_exists($key, $aFields)) {
                                    $aFields[$key] = array();
                                }
                                if (!array_key_exists($aSubSelectedFields[1], $aFields[$key])) {
                                    $aFields[$key][$aSubSelectedFields[1]] = array();
                                }
                                $aFields[$key][$aSubSelectedFields[1]] = $this->recursiveGetSubSelectedFields($aProperties[$key], $aSubSelectedFields, $aFields[$key], 1);
                            }
                        }
                    }
                }
            } else {
                if (in_array($key, $this->aSelectedFields)) {
                    $aFields[$key] = $aProperties[$key];
                }
            }
        }
        return $aFields;
    }

    /**
     * Recursive function called by getSelectedFields that returns the sub-selected fields
     * @param array $aSubProperties
     * @param array $aSubSelectedFields
     * @param array $aField
     * @param number $index
     * @return array|string
     */
    function recursiveGetSubSelectedFields($aSubProperties, $aSubSelectedFields, $aField, $index) {
        if (isset($aSubProperties[$aSubSelectedFields[$index]]) && !empty($aSubProperties[$aSubSelectedFields[$index]])) {
            if (empty($aSubSelectedFields[$index + 1])) {
                $aSubSelectedFields[$index + 1] = "";
            }
            if ($aSubSelectedFields[$index + 1] === '*') {
                $aField[$aSubSelectedFields[$index]] = $aSubProperties[$aSubSelectedFields[$index]];
            } else {
                if (is_array($aSubProperties[$aSubSelectedFields[$index]])) {
                    foreach ($aSubProperties[$aSubSelectedFields[$index]] as $key => $value) {
                        if ($key === $aSubSelectedFields[$index + 1]) {
                            if (!empty($aSubProperties[$aSubSelectedFields[$index]][$aSubSelectedFields[$index + 1]])) {
                                if (!array_key_exists($aSubSelectedFields[$index], $aField)) {
                                    $aField[$aSubSelectedFields[$index]] = array();
                                }
                                $aField[$aSubSelectedFields[$index]][$key] = $this->recursiveGetSubSelectedFields($aSubProperties[$aSubSelectedFields[$index]], $aSubSelectedFields, $aField[$aSubSelectedFields[$index]], $index + 1);
                            }
                        }
                    }
                    if (empty($aField[$aSubSelectedFields[$index]])) {
                        $aField[$aSubSelectedFields[$index]] = null;
                    }
                } else {
                    $aField[$aSubSelectedFields[$index]] = $aSubProperties[$aSubSelectedFields[$index]];
                }
            }
        }

        return $aField[$aSubSelectedFields[$index]];
    }

    /**
     * @SWG\Put(path="/properties/{module_name}",
     *   tags={"Properties"},
     *   summary="Update properties",
     *   description="Request to update the properties",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="formData",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="module_name",
     *     in="path",
     *     description="module name",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/properties")
     *     ),
     * 
     *  )
     */

    /**
     * Update properties
     */
    function PUT() {
        // Verify connection.
        if (!empty($this->oConnection->oError)) {
            $oError = $this->oConnection->oError;
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }
        // Privilège "vitis_admin" requis.
        if (!in_array('vitis_admin', $this->oConnection->aPrivileges)) {
            $oError = new VitisError(1, "Rights problem : you don't have right to delete log files");
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }
        if (!empty($this->aValues["properties"])) {
            // Paramètres pour le fichier de 'properties'
            define('PROPERTIES_HEADER', 'require "constants.inc";' . PHP_EOL . 'require "properties_server.inc";' . PHP_EOL . 'require "properties_domain.inc";' . PHP_EOL . 'require "selected_properties.inc";');
            define('PROPERTIES_FOOTER', '$properties[\'shared_dir\'] = "{$properties[\'vas_home\']}/shared";' . PHP_EOL . PHP_EOL
                    . '// Require tous les fichiers de tous les dossiers contenus sans properties' . PHP_EOL
                    . '$aDir = scandir(__DIR__);' . PHP_EOL
                    . 'foreach ($aDir as $dir) {' . PHP_EOL
                    . '	if($dir != \'.\' && $dir != \'..\'){' . PHP_EOL
                    . '		if(is_dir(__DIR__.\'/\'.$dir)){' . PHP_EOL
                    . '			$aFiles = scandir(__DIR__.\'/\'.$dir);' . PHP_EOL
                    . '			foreach ($aFiles as $file) {' . PHP_EOL
                    . '				if((filetype(__DIR__.\'/\'.$dir.\'/\'.$file) == \'file\') && (pathinfo(__DIR__.\'/\'.$dir.\'/\'.$file)[\'extension\']) == \'inc\' && $file != "version.inc"){' . PHP_EOL
                    . '					require_once __DIR__.\'/\'.$dir.\'/\'.$file;' . PHP_EOL
                    . '				}' . PHP_EOL
                    . '			}' . PHP_EOL
                    . '		}' . PHP_EOL
                    . '	}' . PHP_EOL
                    . '}' . PHP_EOL
                    . PHP_EOL . 'require "properties_post.inc";' . PHP_EOL . 'include "php_conf.inc";');
            define('PROPERTIES_TEMPLATE', '$properties[\'[key]\'] = [value];'); // Modèle pour chaque ligne du fichier
            define('PHP_START', '<?php'); // Début du php
            define('PHP_END', '?>'); // Fin du php
            define('ARRAY_DECLARATION_TEMPLATE', 'array([value])'); // Modèle de la déclaration d'un tableau
            define('ARRAY_CONTENT_TEMPLATE', '[key] => [value]'); // Modèle du contenu d'un tableau
            define('ARRAY_VALUE_SEPARATOR', ', '); // Caractère séparant les valeurs d'un tableau
            define('STR_CH_ENCLOSE', '\''); // Caractère entourant les valeurs de type 'string'
            define('NUMERIC_ENCLOSE', false); // Entoure avec des simples/doubles quotes les valeurs numérique comme les chaines de caractères ?
            define('REQUEST_SUCCESS', 0);
            define('REQUEST_ERROR', 1);

            $aReturn = $this->writeProperties($this->aValues["properties"]);
        }
        //
        $aXmlRacineAttribute['status'] = $aReturn['status'];
        if ($aReturn['status'] == 1)
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        else {
            $oError = new VitisError($aReturn['error_code'], $aReturn['message']);
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }
        return $sMessage;
    }

    /*     * ********************************
      Ecrase le fichier des properties avec le
      contenu des paramètres du formulaire
      $aPropertiesForm : tableau contenant la liste des clés/valeurs à écrire dans le fichier de properties
      $aPropertiesExclude : tableau contenant des champs du formulaire à exclure pour l'écriture du fichier de properties
     * ********************************* */

    function writeProperties($aPropertiesForm, $aPropertiesExclude = array()) {
        $aReturn = array('status' => 1, 'message' => '');
        // Vérifie que le formulaire de properties n'est pas vide
        if (!empty($aPropertiesForm)) {

            // Message de retour
            $aMessage = array('status' => REQUEST_SUCCESS);

            // Ouverture de php	
            $sPropertiesFile = PHP_START . PHP_EOL;

            // Texte à ajouter avant le tableau des properties
            if ($this->aValues['module_name'] == 'vitis')
                $sPropertiesFile .= PROPERTIES_HEADER . PHP_EOL;

            // Convertit chaque valeur du tableau 'properties' en ligne de code php
            foreach ($aPropertiesForm as $sKey => $v) {
                // La valeur n'est pas à exclure ?
                if (!in_array($sKey, $aPropertiesExclude)) {
                    // Formate la valeur suivant le type
                    if (is_array($v))
                        $v = $this->exportArray($v);
                    else {
                        // Booléen ?
                        if ($v == 'true')
                            $v = true;
                        else if ($v == 'false')
                            $v = false;

                        $v = $this->formatValue($v);
                    }

                    // Exception pour 'max_upload_file_size' : conversion en octets
                    if ($sKey == 'max_upload_file_size')
                        $v .= ' * 1024 * 1024';

                    // Remplit la clé, la valeur et le retour à la ligne
                    $sKey = str_replace('.', "']['", $sKey);
                    $sPropertiesLine = str_replace('[key]', $sKey, PROPERTIES_TEMPLATE);
                    $sPropertiesLine = str_replace('[value]', $v, $sPropertiesLine);
                    $sPropertiesLine .= PHP_EOL;

                    // Ajoute la nouvelle ligne
                    $sPropertiesFile .= $sPropertiesLine;
                }
            }

            // Texte à ajouter après le tableau des properties
            if ($this->aValues['module_name'] == 'vitis') {
                $sPropertiesFile .= PROPERTIES_FOOTER . PHP_EOL;
            }

            // Fermeture de php	
            $sPropertiesFile .= PHP_END;

            // Sauve le fichier (LOCK_EX = accés exclusif au fichier)
            if ($this->aValues['module_name'] == 'vitis')
                $sPathProperties = __DIR__ . '/../../conf/properties.inc';
            else
                $sPathProperties = __DIR__ . '/../../conf/' . $this->aValues['module_name'] . '/properties.inc';
            //
            if (file_put_contents($sPathProperties, $sPropertiesFile, LOCK_EX) === false)
                $aReturn = array('status' => 0, 'message' => "FORM_ERROR_FILE_WRITING_CONFIGURATION");
        }
        //else
        //$aReturn = array('status' => 0, 'message' => "Le formulaire de properties passé en paramètre est vide");
        // Retourne le tableau contenant le message
        return $aReturn;
    }

    /*     * ********************************
      Retourne la déclaration d'un tableau en php
      (fonction récursive pour les tableaux multi-dimmensions)
      $aArray : le tableau à retourner
     * ********************************* */

    function exportArray($aArray) {
        $sMyArray = '';
        foreach ($aArray as $sKey => $v) {
            // Pas la 1ere valeur du tableau ?
            if ($sMyArray != '')
                $sMyArray .= ARRAY_VALUE_SEPARATOR;

            // Ajoute la clé du tableau
            if (is_int($sKey))
                $sMyArray .= str_replace('[key]', $sKey, ARRAY_CONTENT_TEMPLATE);
            else
                $sMyArray .= str_replace('[key]', (STR_CH_ENCLOSE . $sKey . STR_CH_ENCLOSE), ARRAY_CONTENT_TEMPLATE);

            // Si la valeur est un tableau : récursif
            if (is_array($v))
                $v = exportArray($v);
            else
                $v = $this->formatValue($v);

            // Ajoute la valeur du tableau
            $sMyArray = str_replace('[value]', $v, $sMyArray);
        }

        // Ajoute la valeur du tableau
        $sMyArray = str_replace('[value]', $sMyArray, ARRAY_DECLARATION_TEMPLATE);
        return $sMyArray;
    }

    /*     * ********************************
      Retourne une valeur formatée suivant le type (str, nombre, bool...)
      $MyValue : Valeur du tableau à formater
     * ********************************* */

    function formatValue($MyValue) {
        // Type numérique ?	--> pour les nombres qui sont entre 'quotes'
        if (is_numeric($MyValue)) {
            if (is_int($MyValue)) {
                $MyValue = (int) $MyValue; // Force en entier
            } else if (is_float($MyValue)) {
                $MyValue = (float) $MyValue; // Force en décimal
            }
            // Transforme les valeur numériques	en chaine de caractères ?
            if (NUMERIC_ENCLOSE) {
                $MyValue = STR_CH_ENCLOSE . addslashes($MyValue) . STR_CH_ENCLOSE;
            }
        }
        // Une chaine de caractère ?
        else if (is_string($MyValue))
            $MyValue = STR_CH_ENCLOSE . addslashes($MyValue) . STR_CH_ENCLOSE;
        else
            $MyValue = var_export($MyValue, true);

        return $MyValue;
    }

}

?>
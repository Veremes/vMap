<?php

/**
 * \file Mj.class.inc
 * \brief Mj.class.inc \n \n Ce fichier contient la classe php Mj.
 * 
 * Cette classe est une classe virtuelle qui peut �tre appel� par les autres classes de la librairie majic_lib par h�ritage.
 *
 * \author Damien Bedel <damien.bedel@veremes.com>
 * \author Olivier Gayte <olivier.gayte@veremes.com>
 */
/**
 * \class Mj
 * \brief Mj Class \n \n Mj est une classe PHP.
 * 
 * Cette classe permet de retourner un objet de s�lection dans une table sous la forme d'un tableau HTML.
 *
 * \author Damien Bedel
 * \author Olivier Gayte <olivier.gayte@veremes.com>
 */
require_once __DIR__ . "/../vitis_lib/XmlAbstract.class.inc";

class Mj extends XmlAbstract {

    /**
     * Requ�te SQL de s�lection dans la table.
     */
    var $sSql;

    /**
     * Statut de l'objet cr�e lors de la requ�te. 1 si erreur; 0 si l'objet a pu �tre instanci�.
     */
    var $sStatus = 0;

    /**
     * Message d'erreur.
     */
    var $sMessage;

    /**
     * Nom du fichier SQL.
     */
    var $sRessourcesFile = 'Mj.sql.inc';

    /**
     * Clef de cryptage
     */
    var $sEncryptKey = '';

    /**
     * Clef de cryptage
     */
    var $bAllSuf = false;

    /**
     * Cette m�thode permet de retourner un code d'erreur en fonction du statut de l'objet r�sultant de la s�lection.
     * \return Retourne 1 s'il y a une erreur, 0 si ok.
     */
    function isError() {
        if ($this->sStatus == 1) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Cette m�thode permet de renvoyer un message d'erreur.
     * \return Retourne une cha�ne de caract�res.
     */
    function getMessage() {
        return $this->sMessage;
    }

    function encrypt($cleartext) {
        if ($this->sEncryptKey != '') {
            if (empty($cleartext) || USE_ENCRYPTION == false) {
                return $cleartext;
            }
            $cipher = mcrypt_module_open(MCRYPT_BLOWFISH, '', MCRYPT_MODE_CBC, '');
            $key = substr($this->sEncryptKey, 0, mcrypt_enc_get_key_size($cipher));
            $iv = '00000000';

            // add the padding.
            $cleartext_length = strlen($cleartext) % 8;
            for ($i = $cleartext_length; $i < 8; $i++) {
                $cleartext .= chr(8 - $cleartext_length);
            }

            $ciphertext = '';
            // 128-bit Blowfish encryption:
            if (mcrypt_generic_init($cipher, $key, $iv) != - 1) {
                // PHP pads with NULL bytes if $cleartext IS NOT a multiple of the block size ..
                if (empty($cleartext)) {
                    return '';
                }
                $ciphertext = mcrypt_generic($cipher, $cleartext);
                mcrypt_generic_deinit($cipher);
            }

            return base64_encode($ciphertext);
        } else {
            return $cleartext;
        }
    }

    function getObjects($sClasse) {
        $aObjClass = array();
        foreach ($this->aObjects as $oObj) {
            if (get_class($oObj) == $sClasse) {
                array_push($aObjClass, $oObj);
            }
        }
        return $aObjClass;
    }

}

?>
<?php

/**
 * \file logUtil.inc
 * \brief
 *
 * Fonctions de mise en place de logs
 *
 * \author Olivier Gayte <olivier.gayte@veremes.com>
 * \author Fr�d�ric Mauro
 */
/*
 * Variable globale stockant une erreur.
 */
$sMessageLogError = "";

/*
 * Variable globale stockant le nom de dossier lib.
 */
$sFolderLib = "vmlib";
/**
 * Converti une chaine ISO-8859-1 en UTF-8
 * \param $sString Cha�ne de caract�res � convertir.
 * \return une chaine encod�e en UTF-8
 */
/* function Latin1ToUtf8($sString){ 
  if( mb_detect_encoding($sString,"UTF-8, ISO-8859-1")!="UTF-8" ){
  return  iconv("ISO-8859-1","UTF-8",$sString);
  }
  else{
  return $sString;
  }
  }
  bfd


  function baseEncoding_pageEncoding($sDatabaseEncoding,$sPageEncoding,$sString){
  return  iconv($sDatabaseEncoding,$sPageEncoding,$sString);
  }
 */

require_once("phpUtil.inc");

/**
 * Ajoute la cha�ne de caract�re au fichier de log $sFileName.
 * \param $sString Cha�ne de caract�res.
 * \param $sFileName Fichier dans lequel �crire la cha�ne.
 * \return un bool�en, true si l'�criture a fonctionn� sinon false.
 */
function writeToLog($sString, $sFileName) {
    if (empty($sFileName))
        return false;
    global $properties, $sMessageLogError, $sFolderLib;

    // Fred 05/06/2013 : Si le r�pertoire de log n'existe pas : cr�ation	
    if (!is_dir(dirname($sFileName)))
        mkdir(dirname($sFileName), 0777, true);
    if (empty(pathinfo($sFileName, PATHINFO_EXTENSION)))
        return false;
 
    loadLang($sFolderLib, $properties["language"], $sFolderLib . "/");
    $sString = str_replace(chr(13), '[\n]', $sString);
    $sString = str_replace(chr(10), '[\n]', $sString);
    $handle = fopen($sFileName, 'a');
    if(isset($_SESSION['ses_Login']) && isset($_SERVER['REMOTE_ADDR']) && isset($_SERVER['REMOTE_PORT'])){
        $sPrelog = date("d/n/Y H:i:s").' '.$_SESSION['ses_Login'].' '.$_SERVER['REMOTE_ADDR'] . ':' . $_SERVER['REMOTE_PORT'];
    } else {
        $sPrelog = date("d/n/Y H:i:s");
    }
    if (fwrite($handle, $sPrelog . $properties["log_delim"] . $sString . CR . LF) === false) {
        fclose($handle);
        if (is_writable($sFileName)) {
            $sMessageLogError = ERROR_IMPOSSIBLE_WRITE . $sFileName . ERROR_RIGHTS_ON_FILE . " (" . $sString . ").";
        } else {
            $sMessageLogError = ERROR_IMPOSSIBLE_WRITE . $sFileName . ERROR_WRITING_FILE . " (" . $sString . ").";
        }
        return false;
    } else {
        fclose($handle);
        $sMessageLogError = "";
        return true;
    }
}

/**
 * Ajoute la cha�ne de caract�re au fichier des log SQL.
 * \param $sString Cha�ne de caract�res.
 */
function writeToSqlLog($sString) {
    global $properties;
    if (isSet($properties["log_mode"])) {
        if ($properties["log_mode"] == true) {
            writeToLog($sString, $properties["sql_log_file"]);
        }
    }
}

/**
 * Ajoute la cha�ne de caract�re au fichier des log SQL.
 * \param $sString Cha�ne de caract�res.
 */
function writeToSqlErrorLog($sString) {
    global $properties;
    if (isSet($properties["log_mode"])) {
        if ($properties["log_mode"] == true) {
            writeToLog($sString, $properties["sql_error_log_file"]);
        }
    }
}

/**
 * Ajoute la cha�ne de caract�re au fichier des log ERROR.
 * \param $sString Cha�ne de caract�res.
 */
function writeToErrorLog($sString) {
    global $properties;
    if (isSet($properties["log_mode"])) {
        if ($properties["log_mode"] == true) {
            writeToLog($sString, $properties["error_log_file"]);
        }
    }
}

/**
 * Ajoute la cha�ne de caract�re au fichier des log Proxy.
 * \param $sString Cha�ne de caract�res.
 */
function writeToProxyLog($sString) {
    global $properties;
    if (isSet($properties["log_mode"])) {
        if ($properties["log_mode"] == true) {
            writeToLog($sString, $properties["proxy_log_file"]);
        }
    }
}

/**
 * Ajoute la cha�ne de caract�re au fichier des log DEBUG.
 * \param $sString Cha�ne de caract�res.
 */
function writeToDebugLog($sString) {
    global $properties;
    if (isSet($properties["debug_mode"])) {
        if ($properties["debug_mode"] == true) {
            writeToLog($sString, $properties["debug_log_file"]);
        }
    }
}

/**
 * Ajoute la cha�ne de caract�re au fichier $sFileName.
 * \param $sString Cha�ne de caract�res.
 * \param $sFileName Fichier dans lequel �crire la cha�ne.
 * \return un bool�en, true si l'�criture a fonctionn� sinon false.
 */
function writeToFile($sString, $sFileName) {
    global $properties, $sFolderLib;
    loadLang($sFolderLib, $properties["language"], $sFolderLib . "/");
    $handle = fopen($sFileName, 'a');
    if (fwrite($handle, $sString . CR . LF)) {
        fclose($handle);
        if (is_writable($sFileName)) {
            $sMessageLogError = ERROR_IMPOSSIBLE_WRITE . $sFileName . ERROR_RIGHTS_ON_FILE . " (" . $sString . ").";
        } else {
            $sMessageLogError = ERROR_IMPOSSIBLE_WRITE . $sFileName . ERROR_WRITING_FILE . " (" . $sString . ").";
        }
        return false;
    } else {
        fclose($handle);
        $sMessageLogError = "";
        return true;
    }
}

?>
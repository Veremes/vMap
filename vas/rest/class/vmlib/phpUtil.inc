<?php

/*
 * \file vmlib/phpUtil.inc
 * \brief Fonctions php diverses
 *
 * \author Fabien Marty <fabien.marty@veremes.com> 
 */
/*
 * Variable globale stockant le nom de dossier lib.
 */
$sFolderLib = "vmlib";

/**
 * Cette fonction supprime les backslashes de tous les éléments d'un tableau.
 * return Retourne un tableau.
 */
function stripslashes_deep($aString) {
    $aString = is_array($aString) ?
            array_map('stripslashes_deep', $aString) :
            stripslashes($aString);

    return $aString;
}

/**
 * Cette fonction permet d'uploader un fichier sur le server.
 * \param $sNomObjet Nom de l'objet parcourir.
 * \param $sFileType Type de fichier attendu.
 * \param $sServerPath Chemin où le fichier doit être copié.
 * \param $sMaxSize Taille maximal du fichier.
 * return Retourne un tableau.
 */
function uploadFile($sNomObjet, $sFileType, $sServerPath, $sMaxSize) {
    global $properties, $sFolderLib;
    loadLang($sFolderLib, $properties["language"], $sFolderLib . "/");
    $aExtensionPicture = array('gif', 'jpg', 'jpeg', 'png');
    $aExtensionPictureAndPdf = array('gif', 'jpg', 'jpeg', 'png', 'pdf');
    $aExtensionFile = array('pdf', 'gif', 'jpg', 'jpeg', 'png', 'txt');
    $aExtensionZip = array('zip', 'gex');
    $aExtensionFmw = array('fmw');
    $sTmpFile = $_FILES[$sNomObjet]['tmp_name'];
    // Si l'utilisateur n'a indiqué aucun fichier à uploader, il ne se passe rien
    $sErrorMsg = "";

    if ($sTmpFile == '') {
        if ($_FILES[$sNomObjet]['name'] != "") {
            switch ($_FILES[$sNomObjet]['error']) {
                case "1" :
                    $sErrorMsg = ERROR_DOWNLOAD_FILE . $_FILES[$sNomObjet]['name'] . " : " . ERROR_UPLOAD_MAX_FILE_SIZE;
                    break;
                case "2" :
                    $sErrorMsg = ERROR_DOWNLOAD_FILE . $_FILES[$sNomObjet]['name'] . " : " . ERROR_MAX_FILE_SIZE;
                    break;
                case "3" :
                    $sErrorMsg = ERROR_DOWNLOAD_FILE . $_FILES[$sNomObjet]['name'] . " : " . ERROR_PARTIAL_DOWNLOAD;
                    break;
                case "4" :
                    $sErrorMsg = ERROR_NO_FILE_DOWNLOADED;
                    break;
                case "6" :
                    $sErrorMsg = ERROR_DOWNLOAD_FILE . $_FILES[$sNomObjet]['name'] . " : " . ERROR_MISSING_TEMP_FOLDER;
                    break;
                case "7" :
                    $sErrorMsg = ERROR_DOWNLOAD_FILE . $_FILES[$sNomObjet]['name'] . " : " . ERROR_WRITING_DISK;
                    break;
                case "8" :
                    $sErrorMsg = ERROR_DOWNLOAD_FILE . $_FILES[$sNomObjet]['name'] . " : " . ERROR_PHP_EXT_SEND;
                    break;
            }
            writeToErrorLog($sErrorMsg);
        }
        return $sErrorMsg;
    }
    $aTemp = explode("\\", $sServerPath);
    if (is_uploaded_file($sTmpFile)) {

        //Teste si le fichier correspont au format voulu.
        $bAllowUpload = false;
        $sFormat = "";
        switch ($sFileType) {
            case "image" :
                if (in_array(extension($aTemp[count($aTemp) - 1]), $aExtensionPicture)) {
                    $bAllowUpload = true;
                } else {
                    foreach ($aExtensionPicture as $sValue) {
                        $sFormat .= " " . $sValue;
                    }
                    writeToErrorLog(ERROR_FILE . $_FILES[$sNomObjet]['name'] . ERROR_NOT_FILE . $sFileType);
                    $sErrorMsg = FILE_LABEL_PHPUTIL . $_FILES[$sNomObjet]['name'] . ERROR_NOT_FILE . $sFileType . ERROR_VALID_FILE . $sFormat . '.';
                }
                break;
            case "image-pdf" :
                if (in_array(extension($aTemp[count($aTemp) - 1]), $aExtensionPictureAndPdf)) {
                    $bAllowUpload = true;
                } else {
                    foreach ($aExtensionPictureAndPdf as $sValue) {
                        $sFormat .= " " . $sValue;
                    }
                    writeToErrorLog(ERROR_FILE . $_FILES[$sNomObjet]['name'] . ERROR_NOT_FILE . $sFileType);
                    $sErrorMsg = FILE_LABEL_PHPUTIL . $_FILES[$sNomObjet]['name'] . ERROR_NOT_FILE . $sFileType . ERROR_VALID_FILE . $sFormat . '.';
                }
                break;
            case "document" :
                if (in_array(extension($aTemp[count($aTemp) - 1]), $aExtensionFile)) {
                    $bAllowUpload = true;
                } else {
                    foreach ($aExtensionFile as $sValue) {
                        $sFormat .= " " . $sValue;
                    }
                    writeToErrorLog(ERROR_FILE . $_FILES[$sNomObjet]['name'] . ERROR_NOT_FILE . $sFileType);
                    $sErrorMsg = FILE_LABEL_PHPUTIL . $_FILES[$sNomObjet]['name'] . ERROR_NOT_FILE . $sFileType . ERROR_VALID_FILE . $sFormat . '.';
                }
                break;
            case "zip" :
                if (in_array(extension($aTemp[count($aTemp) - 1]), $aExtensionZip)) {
                    $bAllowUpload = true;
                } else {
                    foreach ($aExtensionZip as $sValue) {
                        $sFormat .= " " . $sValue;
                    }
                    writeToErrorLog(ERROR_FILE . $_FILES[$sNomObjet]['name'] . ERROR_NOT_FILE . $sFileType);
                    $sErrorMsg = FILE_LABEL_PHPUTIL . $_FILES[$sNomObjet]['name'] . ERROR_NOT_FILE . $sFileType . ERROR_VALID_FILE . $sFormat . '.';
                }
                break;
            case "fmw" :
                if (in_array(extension($aTemp[count($aTemp) - 1]), $aExtensionFmw)) {
                    $bAllowUpload = true;
                } else {
                    foreach ($aExtensionFmw as $sValue) {
                        $sFormat .= " " . $sValue;
                    }
                    writeToErrorLog(ERROR_FILE . $_FILES[$sNomObjet]['name'] . ERROR_NOT_FILE . $sFileType);
                    $sErrorMsg = FILE_LABEL_PHPUTIL . $_FILES[$sNomObjet]['name'] . ERROR_NOT_FILE . $sFileType . ERROR_VALID_FILE . $sFormat . '.';
                }
                break;
            default :
                $bAllowUpload = true;
                break;
        }

        //Teste si le fichier n'est pas de trop grande taille.
        if ($_FILES[$sNomObjet]['size'] > $sMaxSize || $_FILES[$sNomObjet]['error'] == 1) {
            $bAllowUpload = false;
            if ($_FILES[$sNomObjet]['size'] > $sMaxSize)
                $sErrorMsg .=FILE_LABEL_PHPUTIL . $_FILES[$sNomObjet]['name'] . OF_LABEL_PHPUTIL . $_FILES[$sNomObjet]['size'] . ERROR_EXCEED_MAX_SIZE . ' (' . $sMaxSize . LABEL_BYTES_PHPUTIL . ').';
            if ($_FILES[$sNomObjet]['error'] > $sMaxSize)
                $sErrorMsg .=FILE_LABEL_PHPUTIL . $_FILES[$sNomObjet]['name'] . ERROR_EXCEED_MAX_SIZE_PHP . ' (' . $sMaxSize . LABEL_BYTES_PHPUTIL . ').';
        }
        //Lance l'upload.
        if ($bAllowUpload) {
            if (!move_uploaded_file($sTmpFile, utf8_decode($sServerPath))) {
                writeToErrorLog(ERROR_COPYING_FILE . $_FILES[$sNomObjet]['name'] . ON_SERVER_PHPUTIL . ', ' . $sTmpFile . ', ' . $sServerPath);
                $sErrorMsg = ERROR_COPYING_FILE . $_FILES[$sNomObjet]['name'] . ON_SERVER_PHPUTIL . '.';
            }
            //chmod($sServerPath,755);
        }
    } else {
        writeToErrorLog(ERROR_FILE . $_FILES[$sNomObjet]['name'] . ERROR_DOWNLOAD_SERVER);
        $sErrorMsg = FILE_LABEL_PHPUTIL . $_FILES[$sNomObjet]['name'] . ERROR_DOWNLOAD_SERVER . ' (' . ERROR_CODE_PHPUTIL . $_FILES[$sNomObjet]['error'] . ').';
    }
    return $sErrorMsg;
}

/**
 * Cette fonction retourne l'extension d'un fichier.
 * \param $sString Nom complet du fichier.
 * return Retourne une chaine.
 */
function extension($sString) {
    $aTemp = explode(".", $sString);
    $sString = strtolower($aTemp[count($aTemp) - 1]);

    return $sString;
}

/**
 * Cette fonction retourne le nom d'un fichier à partir du nom complet (chemin complet).
 * \param $sFullFileName Nom complet du fichier.
 * return Retourne une chaine.
 */
function getFileName($sFullFileName) {
    $aTemp = explode("/", $sFullFileName);
    $aTemp2 = explode("\\", $aTemp[(count($aTemp) - 1)]);

    return $aTemp2[(count($aTemp2) - 1)];
}

/**
 * Cette fonction permet de dézipper un fichier zip.
 * \param $sZipExeDir Emplacement de l'utilitaire unzip.
 * \param $sZipFileDir Emplacement du fichier zip.
 * \param $sDirToExtract Chemin où les fichiers doivent être extrait.
 * return Retourne un tableau.
 */
function unZip($sZipExeDir, $sZipFileDir, $sDirToExtract) {
    $sLigneCommande = "\"" . $sZipExeDir . "\"  \"" . $sZipFileDir . "\" -d \"" . $sDirToExtract . "\"";
    exec($sLigneCommande, $aResult, $iResult);
    if ($iResult) {
        writeToErrorLog(ERROR_ZIP_IMPOSSIBLE . $sZipFileDir . TO_LABEL_PHPUTIL . $sDirToExtract . ".");
        writeToErrorLog(ERROR_ZIP_COMMAND . $sLigneCommande);
        foreach ($aResult as $sValeur) {
            writeToErrorLog("	" . $sValeur);
        }
    }
    return $iResult;
}

/**
 * Cette fonction permet de décompresser un fichier avec 7z.
 * \param $s7ZipExeDir Emplacement de l'utilitaire 7z.
 * \param $s7ZipFileDir Emplacement du fichier à décompresser.
 * \param $sDirToExtract Chemin où les fichiers doivent être extraits.
 * return Retourne un tableau.
 */
function un7Zip($s7ZipExeDir, $s7ZipFileDir, $sDirToExtract) {
    $sLigneCommande = "\"" . $s7ZipExeDir . "\" x \"" . $s7ZipFileDir . "\" -o\"" . $sDirToExtract . "\" -y -r";
    exec($sLigneCommande, $aResult, $iResult);

    if ($iResult) {
        writeToErrorLog(ERROR_ZIP_IMPOSSIBLE . $s7ZipFileDir . TO_LABEL_PHPUTIL . $sDirToExtract . "(7zip).");
        writeToErrorLog(ERROR_ZIP_COMMAND . $sLigneCommande);
        foreach ($aResult as $sValeur) {
            writeToErrorLog("	" . $sValeur);
        }
    }
    return $iResult;
}

/**
 * Cette fonction permet de zipper des fichiers.
 * \param $sZipExeDir Emplacement de l'utilitaire zip.
 * \param $sZipFileDir Emplacement du fichier zip à créer.
 * \param $sZipFileName Nom du fichier zip à créer.
 * \param $aExtensionToZip Tableau contenant les extensions des fichiers qui doivent être zippé (* si tout zipper).
 * return Retourne un false si il n'y a pas d'erreur .
 */
function Zip($sZipExeDir, $sZipFileDir, $sZipFileName, $aExtensionToZip) {
    $bErreur = true;
    $sExtensionErreur = "";
    if (is_dir($sZipFileDir)) { //vérifie si le répertoire a bien été créé
        chdir($sZipFileDir); //on se place dans le répertoire des fichiers à compresser.
        foreach ($aExtensionToZip as $sExtension) {
            $sExtension = "*." . $sExtension;
            $sLigneCommande = $sZipExeDir . " -9 -r " . $sZipFileDir . "/" . $sZipFileName . ".zip zipfile " . $sExtension . " -x \"*log\"";
            @exec($sLigneCommande, $aResult, $iResult);
            if (!$iResult) {
                $bErreur = false;
            } else {
                $sExtensionErreur .= $sExtension . ", ";
            }
        }
    } else {
        return $bErreur;
    }

    if ($bErreur) {
        writeToErrorLog(ERROR_ZIP_IMPOSSIBLE . $sExtensionErreur . FOLDER_LABEL_PHPUTIL . $sZipFileDir . ".");
        foreach ($aResult as $sValeur) {
            writeToErrorLog("	" . $sValeur);
        }
    }

    return $bErreur;
}

/**
 * Cette fonction permet de 7zipper des fichiers.
 * \param $sZipExeDir Emplacement de l'utilitaire 7zip.
 * \param $sZipDir Répertoire à compresser
 * \param $sZipFileDir Emplacement du fichier zip à créer.
 * \param $sZipFileName Nom du fichier zip à créer.
 * \param $aExtensionToZip Tableau contenant les extensions des fichiers qui doivent être zippé (* si tout zipper).
 * return Retourne un false si il n'y a pas d'erreur.
 */
function Sevenzip($sZipExeDir, $sZipDir, $sZipFileDir, $sZipFileName, $aExtensionToZip) {
    $bErreur = true;
    $sExtensionErreur = "";
    if (is_dir($sZipDir)) { //vérifie si le répertoire a bien été créé//chdir($sZipDir); //on se place dans le répertoire des fichiers à compresser.
        foreach ($aExtensionToZip as $sExtension) {
            $sExtension = "*." . $sExtension;
            //$sLigneCommande =$sZipExeDir." a -r -mx9 -mmt=on ".$sZipFileDir."/".$sZipFileName.".zip ".$sExtension." -xr!*.log";
            $sLigneCommande = "\"" . $sZipExeDir . "\" a -r -mx9 -mmt=on \"" . $sZipDir . "/" . $sZipFileName . ".zip\" \"" . $sZipDir . $sExtension . "\" -xr!*.log";
            @exec($sLigneCommande, $aResult, $iResult);
            if (!$iResult) {
                $bErreur = false;
            } else {
                $sExtensionErreur .= $sExtension . ", ";
            }
        }
    } else {
        return $bErreur;
    }

    if ($bErreur) {
        writeToErrorLog(ERROR_ZIP_IMPOSSIBLE . $sExtensionErreur . FOLDER_LABEL_PHPUTIL . $sZipFileDir . ".");
        foreach ($aResult as $sValeur) {
            writeToErrorLog("	" . $sValeur);
        }
    }

    return $bErreur;
}

/**
 * Teste un code pour savoir si il correspond à une fréquence.
 * Ce code est d'un jour (de 1 à 31), d'un mois (de 1 à 12) et d'un type de jour de la semaine (de 1 à 7).
 * Ces éléments doivent être définis ainsi : * défini tout le temps et / défini une répétition.
 * \param $sCode Code de la fréquence.
 * return Retourne rien si le code est bon sinon retourne un message d'erreur.
 */
function TesteCode($sCode) {
    $bIsCorrecte = true;
    $sErrorMessage = "";
    $aCode = explode(" ", $sCode);
    if (count($aCode) == 3) {
        $aCode = Array('jour' => $aCode[0], 'mois' => $aCode[1], 'jour_semaine' => $aCode[2]);

        //Teste sur le jour
        if ($aCode['jour'] != "*") {
            if (($aCode['mois'] == "*" || is_numeric($aCode['mois'])) && $aCode['jour_semaine'] == "*") {
                if (is_numeric($aCode['jour'])) {
                    if ($aCode['jour'] >= 32 && $aCode['jour'] <= 0) {
                        $sErrorMessage = ERROR_DAY_CODE . $aCode['jour'] . ERROR_CODE_NOT_VALID . ERROR_NOT_INF . "1" . ERROR_NOT_SUP . '31.';
                        $bIsCorrecte = false;
                    }
                } else {
                    if (substr($aCode['jour'], 0, 2) != '*/' || !is_numeric(substr($aCode['jour'], 2, 2))) {
                        $sErrorMessage = ERROR_DAY_CODE . $aCode['jour'] . ERROR_CODE_NOT_VALID;
                        $bIsCorrecte = false;
                    } else {
                        if (substr($aCode['jour'], 2, 1) >= 31 && substr($aCode['jour'], 2, 2) <= 0) {
                            $sErrorMessage = ERROR_DAY_CODE . $aCode['jour'] . ERROR_CODE_NOT_VALID . ERROR_NOT_INF . '1' . ERROR_NOT_SUP . '30.';
                            $bIsCorrecte = false;
                        }
                    }
                }
            } else {
                $sErrorMessage = ERROR_DAY_WEEK;
                $bIsCorrecte = false;
            }
        }

        //Teste sur le mois
        if ($aCode['mois'] != "*" && $bIsCorrecte == true) {
            if (($aCode['jour'] == "*" || is_numeric($aCode['jour']) ) && $aCode['jour_semaine'] == "*") {
                if (is_numeric($aCode['mois'])) {
                    if ($aCode['mois'] >= 13 && $aCode['mois'] <= 0) {
                        $sErrorMessage = ERROR_MONTH_CODE . $aCode['mois'] . ERROR_CODE_NOT_VALID . ERROR_NOT_INF . '1' . ERROR_NOT_SUP . '12.';
                        $bIsCorrecte = false;
                    }
                } else {
                    if (substr($aCode['mois'], 0, 2) != '*/' || !is_numeric(substr($aCode['mois'], 2, 2))) {
                        $sErrorMessage = ERROR_MONTH_CODE . $aCode['mois'] . ERROR_CODE_NOT_VALID;
                        $bIsCorrecte = false;
                    } else {
                        if (substr($aCode['mois'], 2, 1) >= 13 && substr($aCode['mois'], 2, 2) <= 0) {
                            $sErrorMessage = ERROR_MONTH_CODE . $aCode['mois'] . ERROR_CODE_NOT_VALID . ERROR_CODE_NOT_VALID . ERROR_NOT_INF . '1' . ERROR_NOT_SUP . '12.';
                            $bIsCorrecte = false;
                        }
                    }
                }
            } else {
                $sErrorMessage = ERROR_DAY_WEEK;
                $bIsCorrecte = false;
            }
        }

        //Teste sur le jour de la semaine
        if ($aCode['jour_semaine'] != "*" && $bIsCorrecte == true) {
            if ($aCode['jour'] == "*" && $aCode['mois'] == "*") {
                if (is_numeric($aCode['jour_semaine'])) {
                    $sErrorMessage = ERROR_WEEK_CODE . $aCode['jour_semaine'] . ERROR_CODE_NOT_VALID . ERROR_NUMBER_PHPUTIL;
                    $bIsCorrecte = false;
                } else {
                    if (substr($aCode['jour_semaine'], 0, 2) != '*/' || !is_numeric(substr($aCode['jour_semaine'], 2, 2))) {
                        $sErrorMessage = ERROR_WEEK_CODE . $aCode['jour_semaine'] . ERROR_CODE_NOT_VALID;
                        $bIsCorrecte = false;
                    } else {
                        if (substr($aCode['jour_semaine'], 2, 2) >= 13 && substr($aCode['jour_semaine'], 2, 2) <= 0) {
                            $sErrorMessage = ERROR_WEEK_CODE . $aCode['jour_semaine'] . ERROR_CODE_NOT_VALID . ERROR_CODE_NOT_VALID . ERROR_NOT_INF . '1' . ERROR_NOT_SUP . '12.';
                            $bIsCorrecte = false;
                        }
                    }
                }
            } else {
                $sErrorMessage = ERROR_DAY_WEEK;
                $bIsCorrecte = false;
            }
        }
    } else {
        $sErrorMessage = ERROR_CODE_3_VALUES;
        $bIsCorrecte = false;
    }

    $sReturn = $sErrorMessage;

    return $sReturn;
}

/**
 * Cette méthode permet de générer un nom de fichier unique.
 * \return une chaîne de caractères.
 */
function UniqFileName() {
    $sUniqFileName = date(YmdHis) . rand(1, 100000);
    return $sUniqFileName;
}

/*
 * function html2rgb
 * \brief  Ce code convertit les couleurs HTML (codées en hexa), en RGB .
 * \param $color chaine correspondant à la couleur
 * \return un tableau correspondant à la couleur en rgb
 */

function html2rgb($color) {
    // gestion du #...
    if (substr($color, 0, 1) == "#")
        $color = substr($color, 1, 6);
    $tablo[0] = hexdec(substr($color, 0, 2));
    $tablo[1] = hexdec(substr($color, 2, 2));
    $tablo[2] = hexdec(substr($color, 4, 2));
    return $tablo;
}

/*
 * function rgb2html
 * \brief  La réciproque exacte de la fonction html2rgb.
 * \param $tablo tableau correspondant à la couleur en rgb
 * \return un chaine correspondant à la couleur
 */

function rgb2html($tablo) {
    for ($i = 0; $i <= 2; $i++) {
        $tablo[$i] = bornes($tablo[$i], 0, 255);
    }
    // Le str_pad permet de remplir avec des 0
    // parce que sinon rgb2html(Array(0,255,255)) retournerai #0ffff<=manque un 0 !
    return "#" . str_pad(dechex(($tablo[0] << 16) | ($tablo[1] << 8) | $tablo[2]), 6, "0", STR_PAD_LEFT);
}

/*
 * function rgb2html
 * \brief Une petite fonction utile pour borner les nombres entre 0 et 255.
 */

function bornes($nb, $min, $max) {
    if ($nb < $min)
        $nb = $min; // $nb est borné bas
    if ($nb > $max)
        $nb = $max; // $nb est Borné haut 
    return $nb;
}

/*
 * function verifyFolder
 * \brief vérifie l'existance d'un répertoire
 * \param $sFolder : chemin du répertoire
 * \return $bFolderExist : booleen , true si le répertoire existe sinon false
 */

function verifyFolder($sFolder) {
    @$bFolderExist = dir($sFolder);
    return (@$bFolderExist);
}

/**
 * Cette fonction permet de supprimer un dossier sur le serveur.
 * \param $sDossier Dossier à supprimer.
 * return un booleen.
 */
function clearDir($sDossier) {
    $ouverture = @opendir($sDossier);
    if (!$ouverture)
        return;
    while ($sFichier = readdir($ouverture)) {

        if ($sFichier == '.' || $sFichier == '..')
            continue;
        if (is_dir($sDossier . "/" . $sFichier)) {
            $bCleared = clearDir($sDossier . "/" . $sFichier);
            if (!$bCleared)
                return false;
        }
        else {
            $bCleared = @unlink($sDossier . "/" . $sFichier);
            if (!$bCleared)
                return false;
        }
    }
    closedir($ouverture);
    $bCleared = @rmdir($sDossier);
    if (!$bCleared)
        return false;
    return true;
}

/*
 * function loadLang
 * charge le fichier de lang
 */

function loadLang($folderExt, $lang = "fr", $folderRoot = "", $encodage = "UTF-8") {
    if ($lang == "") {
        $lang = "fr";
    }
    if ($folderExt != "") {
        include_once($folderRoot . 'lang_' . $folderExt . '/' . $lang . '-lang.inc');
    } else {
        include_once($folderRoot . 'lang/' . $lang . '-lang.inc');
    }
}

/**
 * Cette fonction retourne le contenu d'un fichier dans une variable.
 * \param $sFilePath chaine Nom complet du fichier.
 * \return une chaine contenant le contenu du fichier, rien si le fichier n'existe pas.
 */
function getFileContent($sFilePath) {
    $sFileContent = "";
    if (file_exists($sFilePath)) {
        ob_start();
        include($sFilePath);
        $sFileContent = ob_get_contents();
        ob_end_clean();
    }
    return $sFileContent;
}

/**
 * ?
 */
function convert($value_in = false, $source_base = 10, $target_base = 32) {
    // We use these values for our conversions
    $values = array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-', '_');
    $characters = array_flip($values);
    $string_out = '';
    // Easy answers
    if ($source_base == $target_base) {
        return $value_in;
    }
    $len = strlen($value_in);
    $sum = array();
    if ($source_base > $target_base) {
        for ($i = 0; $i < $len; $i++) {
            $char = substr($value_in, $len - $i - 1, 1);
            $sum[$i] = $characters[$char] * pow($source_base, $i);
        }
    } else {
        if ($source_base != 10) {
            $value = convert($value_in, $source_base, 10);
        } else {
            $value = $value_in;
        }
        $cnt = 0;
        while ($value > 0) {
            $times = $value / $target_base;
            $sum[] = mod($value, $target_base);
            $value = floor2($times); // get rid of our remainder
        }
        for ($i = count($sum); $i > 0; $i--) {
            $string_out .= $values[$sum[$i - 1]];
        }
        return $string_out;
    }
    if ($target_base == 10) {
        return array_sum($sum);
    }
    return implode($sum);
}

function mod($val, $mod) {
    return $val - floor2($val / $mod) * $mod;
}

function floor2($val) {
    $bits = explode('.', $val);
    return $bits[0];
}

function sendWebsocketMessage($webSocketServer, $webSocketPort, $webSocketAlias, $sAction, $sMessage){
	require_once 'vmlib/class.websocket_client.php';
	
	$client = new WebsocketClient;
	$client->connect($webSocketServer, $webSocketPort, '/'.$webSocketAlias);

	usleep(5000);

	$payload = json_encode(array(
		'action' => $sAction,
		'data' => $sMessage
	));

		$client->sendData($payload);
		usleep(5000);
}

/**
 * \class array2xml
 * \brief array2xml Class \n \n Cette classe totalement générique permet de générer du XML à partir d'un tableau PHP
 */
class array2xml extends DomDocument {

    private $xpath;
    private $sRoot;
    private $sNodeName;

    /**
     * Constructeur
     * \param $sRoot              Nom du premier noeud (string)
     * \param $sNodeName   The name numeric keys are called (string)
     */
    //public function __construct($sRoot='root', $node_name='node')
    public function array2xml($sRoot = 'root', $sNodeName = 'node') {
        parent::__construct();
        //$this->encoding = "ISO-8859-1";
        $this->encoding = "utf-8";
        $this->formatOutput = true;
        $this->sNodeName = $sNodeName;
        $this->sRoot = $this->appendChild($this->createElement($sRoot));
        $this->xpath = new DomXPath($this);
    }

    /*
     * Crée le XML à partir du tableau
     * \param   $aValueXml    Le tableau à convertir
     * \param  $sNode             Nom du noeud dans lequelle inlure les valeurs (string)
     */

    public function createNode($aValueXml, $sNode = null) {
        if (is_null($sNode)) {
            $sNode = $this->sRoot;
        }
        foreach ($aValueXml as $element => $value) {
            $element = is_numeric($element) ? $this->sNodeName : $element;
            $child = $this->createElement($element, (is_array($value) ? null : utf8_encode($value)));
            $sNode->appendChild($child);
            if (is_array($value)) {
                self::createNode($value, $child);
            }
        }
    }

    /*
     * Retourne le XML généré sous forme de chaine
     * return    le XML (string)
     */

    public function __toString() {
        return $this->saveXML();
    }

    /*
     * Perform an XPath query on the XML representation of the array
     * \param str $query - query to perform
     * return mixed
     */

    public function query($query) {
        return $this->xpath->evaluate($query);
    }

}

// end of class
?>
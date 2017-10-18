<?php

/**
 * \file Logs.class.inc
 * \class Logs
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the Logs php class
 *
 * This class defines Rest Api to Vitis logs
 * 
 */
require_once 'Vitis.class.inc';
require_once 'Properties.class.inc';
require_once __DIR__ . '/../../class/vitis_lib/Connection.class.inc';
require_once(__DIR__ . '/../../class/vmlib/BdDataAccess.inc');

class Logs extends Vitis {
    /**
     * @SWG\Definition(
     *   definition="/logs",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/logs")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Logs",
     *   description="Operations about Logs"
     * )
     */

    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $properties properties
     */
    function __construct($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->aSelectedFields = Array();
    }

    /**
     * @SWG\Get(path="/logs",
     *   tags={"Logs"},
     *   summary="Get logs tree",
     *   description="Request to get the logs tree",
     *   operationId="GET",
     *   produces={"application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="application_name",
     *     in="query",
     *     description="",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/logs")
     *     )
     *  )
     */
    /**
     * @SWG\Get(path="/logs/{log_directory}/file/{file_name}",
     *   tags={"Logs"},
     *   summary="Get log file content",
     *   description="Request to get the content of a log file",
     *   operationId="GET",
     *   produces={"application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="log_directory",
     *     in="path",
     *     description="Key in properties.log_directories",
     *     required=true,
     *     type="string",
     *   ),
     * @SWG\Parameter(
     *     name="file_name",
     *     in="path",
     *     description="",
     *     required=true,
     *     type="string",
     *   ),
     * @SWG\Parameter(
     *     name="folder",
     *     in="query",
     *     description="File path from the log_directory",
     *     required=false,
     *     type="string",
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/logs")
     *     )
     *  )
     */

    /**
     * get Logs
     * @return  Logs
     */
    function GET() {
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

        if (!empty($this->aPath[4])) {

            $sDirectoryName = $this->aPath[2];
            $sFileName = $this->aPath[4];
            $sFileFolder = empty($this->aValues['folder']) ? '' : $this->aValues['folder'];
            $sFilePath = $sFileFolder . '/' . $sFileName;

            // Contenu d'un fichier de log
            $aReturn = $this->getLogFileContent($sDirectoryName, $sFileName, $sFilePath);
        } else {
            // Arborescence de l'arbre
            $aReturn = $this->getLogsTree();
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

    /**
     * @SWG\Delete(path="/logs",
     *   tags={"Logs"},
     *   summary="delete log files",
     *   description="Request to delete log files from min_days",
     *   operationId="DELETE",
     *   produces={"application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="min_days",
     *     in="query",
     *     description="number of days from the last revision",
     *     required=true,
     *     type="integer",
     *     format="int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/logs")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/logs/{log_directory}/file/{file_name}",
     *   tags={"Logs"},
     *   summary="delete log files",
     *   description="Request to delete log files",
     *   operationId="DELETE",
     *   produces={"application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="log_directory",
     *     in="path",
     *     description="",
     *     required=true,
     *     type="string",
     *   ),
     * @SWG\Parameter(
     *     name="file_name",
     *     in="path",
     *     description="",
     *     required=true,
     *     type="string",
     *   ),
     * @SWG\Parameter(
     *     name="folder",
     *     in="query",
     *     description="File path from the log_directory",
     *     required=false,
     *     type="string",
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/logs")
     *     )
     *  )
     */

    /**
     * delete log files
     */
    function DELETE() {
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
        $aFilesToDelete = array();
        if (!empty($this->aValues['min_days'])) {
            // min_days
            if (is_numeric($this->aValues['min_days'])) {
                $iMinDays = $this->aValues['min_days'];
                if (!empty($this->aProperties['log_directories'])) {
                    foreach ($this->aProperties['log_directories'] as $sLogName => $sLogDir) {
                        if (is_dir($sLogDir)) {
                            $aDirStructure = $this->getDirStructure($sLogDir, $sLogName, $sLogName, "");
                            if (!empty($aDirStructure["files"])) {
                                foreach ($aDirStructure["files"] as $aFiles) {
                                    if ($aFiles['last_modif'] >= $iMinDays) {
                                        $aFilesToDelete[] = $aFiles['path'];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else if (!empty($this->aPath[2]) && !empty($this->aPath[4])) {

            $sDirectoryName = $this->aPath[2];
            $sFileName = $this->aPath[4];
            $sFileFolder = empty($this->aValues['folder']) ? '' : $this->aValues['folder'];
            $sFilePath = $sFileFolder . '/' . $sFileName;
            $aLogDirectories = $this->aProperties['log_directories'];

            if (!isset($aLogDirectories[$sDirectoryName]) || empty($aLogDirectories[$sDirectoryName])) {
                $aReturn = array('status' => 0, 'message' => "FILE_NOT_FOUND_LOGS", 'error_code' => 1);
                return $aReturn;
            }

            $sPath = realpath($aLogDirectories[$sDirectoryName] . '/' . $sFilePath);
            $aFilesToDelete[] = $sPath;
        } else {
            $oError = new VitisError(1, "Wrong given params");
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            return $sMessage;
        }

        $aReturn = $this->deleteFilesList($aFilesToDelete);

        //
        $aXmlRacineAttribute['status'] = $aReturn['status'];
        if ($aReturn['status'] == 1) {
            $this->aFields['files_deleted'] = $aReturn['files_deleted'];
            $this->aFields['files_not_found'] = $aReturn['files_not_found'];
            $this->aFields['files_not_deleted'] = $aReturn['files_not_deleted'];
            $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        } else {
            $oError = new VitisError($aReturn['error_code'], $aReturn['message']);
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }
        return $sMessage;
    }

    /**
     * Get logs tree.
     */
    function getLogsTree() {
        require $this->sRessourcesFile;
        $aReturn = array('status' => 1, 'message' => '');
        // Liste des modules de l'application.
        $aParams['sSchemaFramework'] = array('value' => $this->aProperties['schema_framework'], 'type' => 'schema_name');
        $aParams['application_name'] = array('value' => $this->aValues['application_name'], 'type' => 'string');
        $oPDOresult = $this->oConnection->oBd->executeWithParams($aSql['getApplicationModules'], $aParams);
        if ($this->oConnection->oBd->enErreur()) {
            $aReturn = array('status' => 1, 'message' => $this->oConnection->oBd->getBDMessage(), 'error_code' => 1);
            /*
              $oError = new VitisError(1, $this->oConnection->oBd->getBDMessage());
              $aXmlRacineAttribute['status'] = 0;
              $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
             */
        } else {
            // Charge toutes les properties.
            $oProperties = new Properties($this->aPath, $this->aValues, $this->aProperties);
            $oProperties->GET();
            $properties = $oProperties->aFields;
            // Création de l'arborescence des fichiers de logs.
            if (!empty($properties['log_directories'])) {
                foreach ($properties['log_directories'] as $sLogName => $sLogDir) {
                    if (is_string($sLogDir)) {
                        if (is_dir($sLogDir)) {
                            $aDirStructure = $this->getDirStructure($sLogDir, $sLogName, $sLogName, "");
                            $aTreeviewLogs["data"][] = $aDirStructure["data"];
                            if (!empty($aDirStructure["files"])) {
                                foreach ($aDirStructure["files"] as $aFiles) {
                                    $aTreeviewLogs["files"][] = $aFiles;
                                }
                            }
                        } else
                            writeToErrorLog('scandir(' . $sLogDir . '): failed to open dir');
                    }
                }
            }
            $this->aFields['tree'] = $aTreeviewLogs;
        }
        return $aReturn;
    }

    /*
     * Retourne l'arborescence d'un répertoire formaté pour "bootstrap-treeview".
     */

    function getDirStructure($sLogDir, $sDirName, $sLogName, $sFolder) {
        $aFilteredDir['data'] = array('text' => $sDirName, 'selectable' => false);
        $aDir = scandir($sLogDir);

        if ($sDirName !== $sLogName) {
            $sFolder .= '/' . $sDirName;
        }

        foreach ($aDir as $sName) {
            $sPath = $sLogDir . '/' . $sName;
            $sFileType = filetype($sPath);
            // Répertoire ?
            if ($sFileType == 'dir') {
                if ($sName != '.' && $sName != '..') {
                    if (is_dir($sPath)) {
                        $aDirStructure = $this->getDirStructure($sPath . '/', $sName, $sLogName, $sFolder);
                        if (!empty($aDirStructure['data']['nodes'])) {
                            // Structure du répertoire.
                            $aFilteredDir['data']['nodes'][] = $aDirStructure['data'];
                            // Liste des fichiers .log du répertoire.
                            foreach ($aDirStructure["files"] as $aFiles) {
                                $aFilteredDir["files"][] = $aFiles;
                            }
                        }
                    } else
                        writeToErrorLog('scandir(' . $sPath . '): failed to open dir');
                }
            }
            // fichier et .log ?
            if ($sFileType == 'file' && pathinfo($sName, PATHINFO_EXTENSION) == 'log') {
                // Taille + unité du fichier.
                //$iFileSize = filesize($sPath);
                $aFileInfos = stat($sPath);
                $iFileSizeLabel = $aFileInfos['size'];
                $aFileSizeUnity = array('o', 'Ko', 'Mo', 'Go', 'To');
                $i = 0;
                while ($iFileSizeLabel > 1024) {
                    $iFileSizeLabel /= 1024;
                    $i++;
                }
                // Sauve la structure du fichier pour le treeview.
                $sFileLabel = $sName . ' (' . round($iFileSizeLabel) . ' ' . $aFileSizeUnity[$i] . ')';
                $aFilteredDir['data']['nodes'][] = array(
                    'folder' => $sFolder,
                    'log_directory' => $sLogName,
                    'name' => $sName,
                    'text' => $sFileLabel,
                    'icon' => 'glyphicon glyphicon-file',
                    'path' => $sLogName . $sFolder . '/' . $sName,
                    //'tags' => array('<span class="glyphicon glyphicon-trash"></span>'),
                    'size' => $aFileInfos['size']
                );
                // Sauve le nom et la date du fichier.
                $aFilteredDir['files'][] = array(
                    'path' => $sPath,
                    'last_modif' => floor((time() - $aFileInfos['mtime']) / (24 * 3600))    // dernière modif. (Nb jours). 
                );
            }
        }
        return $aFilteredDir;
    }

    /**
     * Delete the log files defined in $aFilesToDelete
     * @param array $aFilesToDelete
     */
    function deleteFilesList($aFilesToDelete) {

        $aReturn = array('status' => 1, 'message' => '');
        $aFilesDeleted = array();
        $aFilesNotFound = array();
        $aFilesNotDeleted = array();
        foreach ($aFilesToDelete as $sPath) {
            if (!empty($sPath)) {
                if ($this->isLogFile($sPath)) {
                    if (is_file($sPath)) {
                        if (unlink($sPath)) {
                            $aFilesDeleted[] = $sPath;
                        } else {
                            $aFilesNotDeleted[] = $sPath;
                            $aLastError = error_get_last();
                            if (strpos(strtolower($aLastError['message']), 'permission denied') !== false) {
                                $sErrorMessage = 'DELETE_FILE_ERROR_PERMISSION_DENIED_LOGS';
                            }
                        }
                    } else {
                        $aFilesNotFound[] = $sPath;
                    }
                }
            }
        }
        //
        if (empty($aFilesDeleted)) {
            $aReturn = array('status' => 0, 'error_code' => 1);
            if (isset($sErrorMessage)) {
                $aReturn['message'] = $sErrorMessage;
            } else if (count($aFilesToDelete) == 1) {
                $aReturn['message'] = 'DELETE_FILE_ERROR_LOGS';
            } else {
                $aReturn['message'] = 'DELETE_FILES_ERROR_LOGS';
            }
        }
        if (!empty($aFilesNotFound) && count($aFilesToDelete) == 1) {
            $aReturn = array('status' => 0, 'message' => "FILE_NOT_FOUND_LOGS", 'error_code' => 1);
        }

        if ($aReturn['status'] == 1) {
            $aReturn['files_deleted'] = $aFilesDeleted;
            $aReturn['files_not_found'] = $aFilesNotFound;
            $aReturn['files_not_deleted'] = $aFilesNotDeleted;
        }

        return $aReturn;
    }

    /**
     * Get the content of a log file.
     */
    function getLogFileContent($sDirectoryName, $sFileName, $sFilePath) {
		
		// Charge toutes les properties.
		$oProperties = new Properties($this->aPath, $this->aValues, $this->aProperties);
		$oProperties->GET();
		$properties = $oProperties->aFields;
        $aLogDirectories = $properties['log_directories'];
        if (!isset($aLogDirectories[$sDirectoryName]) || empty($aLogDirectories[$sDirectoryName])) {
            $aReturn = array('status' => 0, 'message' => "FILE_NOT_FOUND_LOGS", 'error_code' => 1);
            return $aReturn;
        }

        $sPath = realpath($aLogDirectories[$sDirectoryName] . '/' . $sFilePath);		
        $aReturn = array('status' => 1, 'message' => '');
        if (file_exists($sPath) && $this->isLogFile($sPath)) {
            $sFileContent = iconv("UTF-8", "UTF-8//IGNORE", file_get_contents($sPath));
            if ($sFileContent !== false) {
                $this->aFields['file'] = $sFileContent;
            } else {
                $aReturn = array('status' => 0, 'message' => "LOADING_FILE_ERROR_LOGS");
            }
        } else {
            $aReturn = array('status' => 0, 'message' => "FILE_NOT_FOUND_LOGS", 'error_code' => 1);
        }
        return $aReturn;
    }

    /**
     * .
     */
    function isLogFile($sFilePath) {
        $bIsLogFile = false;
        $aPathInfo = pathinfo($sFilePath);

        // Charge toutes les properties.
        $oProperties = new Properties($this->aPath, $this->aValues, $this->aProperties);
        $oProperties->GET();
        $properties = $oProperties->aFields;

        // Extension ".log" obligatoire.
        if ($aPathInfo['extension'] == 'log') {
            // Répertoire des logs sans backslashes et plusieurs slashes.
            $aLogDirectories = $properties['log_directories'];
            foreach ($aLogDirectories as &$sLogDirectorie) {
                if (is_string($sLogDirectorie))
                    $sLogDirectorie = realpath($sLogDirectorie);
            }
            // Fichier de log sans backslashes et plusieurs slashes.
            $sFilePath = realpath($sFilePath);
            
            // Le fichier est dans un des répertoires de logs ?
            foreach ($aLogDirectories as $sLogDirectorie) {
                if (stripos($sFilePath, $sLogDirectorie) !== false) {
                    $bIsLogFile = true;
                    break;
                }
            }
        }
        return $bIsLogFile;
    }

}

?>
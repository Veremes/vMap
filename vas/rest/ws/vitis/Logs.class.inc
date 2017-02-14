<?php
/**
* \file Logs.class.inc
* \class Logs
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the Logs php class
*
* This class defines Rest Api to Vitis logs
* 
*/
require_once 'Vitis.class.inc';
require_once 'Properties.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
require_once(__DIR__.'/../../class/vmlib/BdDataAccess.inc');

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
    function Logs($aPath, $aValues, $properties) {
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->aSelectedFields = Array();
    }
    
    /**
     * @SWG\Get(path="/logs/Tree",
     *   tags={"Logs"},
     *   summary="Get logs tree",
     *   description="Request to get the logs tree",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
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
     * @SWG\Get(path="/logs/File/{file_path}",
     *   tags={"Logs"},
     *   summary="Get log file content",
     *   description="Request to get the content of a log file",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="file_path",
     *     in="path",
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
     * get Logs
     * @return  Logs
     */
    function GET() {
        // Verify connection.
        if (!empty($this->oConnection->oError)) {
            $oError = $this->oConnection->oError;
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }
        else {
            // Arborescence de l'arbre ?
            if ($this->aPath[2] == "Tree")
                    $aReturn = $this->getLogsTree();
            // Contenu d'un fichier de log ?
            else if ($this->aPath[2] == "File")
                    $aReturn = $this->getLogFileContent();
            //
            $aXmlRacineAttribute['status'] = $aReturn['status'];
            if ($aReturn['status'] == 1)
                    $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            else {
                    $oError = new Error($aReturn['error_code'], $aReturn['message']);
                    $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            }
        }
        return $sMessage;
    }
    
    /**
     * @SWG\Delete(path="/logs/",
     *   tags={"Logs"},
     *   summary="delete log files",
     *   description="Request to delete log files",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="files_paths_list",
     *     in="query",
     *     description="id of the logs",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="min_days",
     *     in="query",
     *     description="number of days",
     *     required=false,
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
     * delete log files
     */
    function DELETE() {
        // Verify connection.
        if (!empty($this->oConnection->oError)) {
            $oError = $this->oConnection->oError;
            $aXmlRacineAttribute['status'] = 0;
            $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
        }
        else {
            // Privilège "vitis_admin" requis.
            if (!in_array('vitis_admin', $this->oConnection->aPrivileges)) {
                $oError = new Error(1, "Rights problem : you don't have right to delete log files");
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
            }
            else {
                if (!empty($this->aValues['min_days'])) {
                    if (!empty($this->aProperties['log_directories'])) {
                            $aFilesToDelete = array();
                            foreach ($this->aProperties['log_directories'] as $sLogName => $sLogDir) {
                                    if (is_dir($sLogDir)) {
                                        $aDirStructure = $this->getDirStructure($sLogDir, $sLogName);
                                        if (!empty($aDirStructure["files"])) {
                                            foreach ($aDirStructure["files"] as $aFiles) {
                                                    if ($aFiles['last_modif'] >= $this->aValues['min_days'])
                                                        $aFilesToDelete[] = $aFiles['path'];
                                            }
                                        }
                                    }
                            }
                            $this->aValues['files_paths_list'] = implode('|', $aFilesToDelete);
                    }
                }
                $aPath = explode('|', $this->aValues['files_paths_list']);
                $aReturn = array('status' => 1, 'message' => '');
                $aFilesDeleted = array();
                $aFilesNotFound = array();
                $aFilesNotDeleted = array();
                foreach ($aPath as $sPath) {
                        if (!empty($sPath)) {
                            if ($this->isLogFile($sPath)) {
                                if (is_file($sPath)) {
                                        if (unlink($sPath))
                                                $aFilesDeleted[] = $sPath;
                                        else {
                                                $aFilesNotDeleted[] = $sPath;
                                                $aLastError = error_get_last();
                                                    if (strpos(strtolower($aLastError['message']), 'permission denied') !== false)
                                                        $sErrorMessage = 'DELETE_FILE_ERROR_PERMISSION_DENIED_LOGS';
                                        }
                                }
                                else
                                        $aFilesNotFound[] = $sPath;
                            }
                        }
                }
                //
                if (empty($aFilesDeleted)) {
                        $aReturn = array('status' => 0, 'error_code' => 1);
                        if (isset($sErrorMessage))
                                $aReturn['message'] = $sErrorMessage;
                        else if (count($aPath) == 1)
                                $aReturn['message'] = 'DELETE_FILE_ERROR_LOGS';
                        else
                                $aReturn['message'] = 'DELETE_FILES_ERROR_LOGS';
                }
                if (!empty($aFilesNotFound) && count($aPath) == 1)
                        $aReturn = array('status' => 0, 'message' => "FILE_NOT_FOUND_LOGS", 'error_code' => 1);
                //
                $aXmlRacineAttribute['status'] = $aReturn['status'];
                if ($aReturn['status'] == 1) {
                        $this->aFields['files_deleted'] = $aFilesDeleted;
                        $this->aFields['files_not_found'] = $aFilesNotFound;
                        $this->aFields['files_not_deleted'] = $aFilesNotDeleted;
                        $sMessage = $this->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                }
                else {
                        $oError = new Error($aReturn['error_code'], $aReturn['message']);
                        $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']);
                }
            }
        }
        return $sMessage;
    }
    
    
    /**
     * Get logs tree.
     */
    function getLogsTree(){
        require $this->sRessourcesFile;
        $aReturn = array('status' => 1, 'message' => '');
        // Liste des modules de l'application.
        $sSql = str_replace('[sSchemaFramework]', $this->aProperties['schema_framework'], $aSql['getApplicationModules']);
        $sSql = str_replace('[application_name]', $this->aValues['application_name'], $sSql);
        $oPDOresult = $this->oConnection->oBd->execute($sSql);
        if ($this->oConnection->oBd->enErreur()) {
                $aReturn = array('status' => 1, 'message' => $this->oConnection->oBd->getBDMessage(), 'error_code' => 1);
            /*
            $oError = new Error(1, $this->oConnection->oBd->getBDMessage());
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
                                if (is_dir($sLogDir)) {
                                    $aDirStructure = $this->getDirStructure($sLogDir, $sLogName);
                                    $aTreeviewLogs["data"][] = $aDirStructure["data"];
                                    if (!empty($aDirStructure["files"])) {
                                        foreach ($aDirStructure["files"] as $aFiles) {
                                                $aTreeviewLogs["files"][] = $aFiles;
                                        }
                                    }
                                }
                                else
                                    writeToErrorLog('scandir(' . $sLogDir . '): failed to open dir');
                        }
                }
                $this->aFields['tree'] = $aTreeviewLogs;
        }
        return $aReturn;
    }
    
        /*
         * Retourne l'arborescence d'un répertoire formaté pour "bootstrap-treeview".
         */
        function getDirStructure($sLogDir, $sDirName) {
                $aFilteredDir['data'] = array('text' => $sDirName, 'selectable' => false);
                $aDir = scandir($sLogDir);
                foreach ($aDir as $sName) {
                        $sPath = $sLogDir . '/' . $sName;
                        $sFileType = filetype($sPath);
                        // Répertoire ?
                        if ($sFileType == 'dir') {
                                if ($sName != '.' && $sName != '..') {
                                    if (is_dir($sPath)) {
                                        $aDirStructure = $this->getDirStructure($sPath . '/', $sName);
                                        if (!empty($aDirStructure['data']['nodes'])) {
                                                // Structure du répertoire.
                                                $aFilteredDir['data']['nodes'][] = $aDirStructure['data'];
                                                // Liste des fichiers .log du répertoire.
                                                foreach ($aDirStructure["files"] as $aFiles) {
                                                        $aFilteredDir["files"][] = $aFiles;
                                                }
                                        }
                                    }
                                    else
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
                                        'text' => $sFileLabel,
                                        'icon' => 'glyphicon glyphicon-file',
                                        'path' => $sPath,
                                        //'tags' => array('<span class="glyphicon glyphicon-trash"></span>'),
                                        'size' => $aFileInfos['size']
                                );
                                // Sauve le nom et la date du fichier.
                                $aFilteredDir['files'][] = array(
                                        'path' => $sPath,
                                        'last_modif' => floor((time() - $aFileInfos['mtime']) / (24*3600))    // dernière modif. (Nb jours). 
                                );
                        }
                }
                return $aFilteredDir;
        }
        
    /**
     * Get the content of a log file.
     */
    function getLogFileContent() {
        $sPath = implode('/', array_slice($this->aPath, 3));
		if (DIRECTORY_SEPARATOR == '/')
			$sPath = '/'.$sPath;
        $aReturn = array('status' => 1, 'message' => '');
        if (file_exists($sPath)) {
			
                $sFileContent = iconv("UTF-8","UTF-8//IGNORE", file_get_contents($sPath));
                if ($sFileContent !== false)
                        $this->aFields['file'] = $sFileContent;
                else
                        $aReturn = array('status' => 0, 'message' => "LOADING_FILE_ERROR_LOGS");
        }
        else
                $aReturn = array('status' => 0, 'message' => "FILE_NOT_FOUND_LOGS", 'error_code' => 1);
        return $aReturn;
    }
    
    /**
     * .
     */
    function isLogFile($sFilePath) {
        $bIsLogFile = false;
        $aPathInfo = pathinfo($sFilePath);
        // Extension ".log" obligatoire.
        if ($aPathInfo['extension'] == 'log') {
            // Répertoire des logs sans backslashes et plusieurs slashes.
            $aLogDirectories = $this->aProperties['log_directories'];
            foreach($aLogDirectories as &$sLogDirectorie) {
                $sLogDirectorie = str_replace('\\', '/', $sLogDirectorie);
                $sLogDirectorie = preg_replace('/\/{2,}/', '/', $sLogDirectorie);
            }
            // Fichier de log sans backslashes et plusieurs slashes.
            $sFilePath = str_replace('\\', '/', $sFilePath);
            $sFilePath = preg_replace('/\/{2,}/', '/', $sFilePath);
            // Le fichier est dans un des répertoires de logs ?
            foreach($aLogDirectories as $sLogDirectorie) {
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
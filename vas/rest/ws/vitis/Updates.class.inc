<?php
require_once 'Vitis.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
require_once(__DIR__.'/../../class/vmlib/BdDataAccess.inc');
require_once 'Update.class.inc';

/**
* \file updates.class.inc
* \class Updates
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the Updates php class
*
* This class defines the rest api for updates
* 
*/
class Updates  extends Vitis{
    
    /**
     * @SWG\Definition(
     *   definition="/updates",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/updates")
     *   }
     * )
     * @SWG\Tag(
     *   name="Updates",
     *   description="Operations about updates"
     * )
     */
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $updates ptroperties
     */
    function Updates($aPath, $aValues, $properties){
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
        $this->aSelectedFields = Array("update_id", "name", "publishing_date", "from", "to", "status", "telechargement", "installation", "log", "error_log");
    }
    
    /**
     * @SWG\Get(path="/updates",
     *   tags={"Updates"},
     *   summary="Get Updates",
     *   description="Request to get Updates",
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
     *     name="order_by",
     *     in="query",
     *     description="list of ordering fields",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="sort_order",
     *     in="query",
     *     description="sort order",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="limit",
     *     in="query",
     *     description="number of element",
     *     required=false,
     *     type="integer",
     *     format="int32"
     *   ),
     * @SWG\Parameter(
     *     name="offset",
     *     in="query",
     *     description="index of first element",
     *     required=false,
     *     type="string",
     *     format="int32"
     *   ),
     * @SWG\Parameter(
     *     name="attributs",
     *     in="query",
     *     description="list of attributs",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="filter",
     *     in="query",
     *     description="filter results",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="distinct",
     *     in="query",
     *     description="delete duplicates",
     *     required=false,
     *     type="boolean"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/updates")
     *     )
     *  )
     */
    /**
     * 
     * @return updates
     */
    function GET(){
        $this->setUpdates();
        $aReturn = $this->genericGet($this->aProperties['schema_framework'], "v_update", "update_id");
        return $aReturn['sMessage'];
    }
    
    /**
     * Mise à jour de la table "update".
     */
    function setUpdates(){
        require 'Updates.class.sql.inc';    
        require __DIR__.'/../../conf/version.inc';
        //
        $bError = false;
        $sInfo=$sErreur='';
        $sUrlXmlFile=$this->aProperties["web_server_update"]."/maj.xml";

        ob_start();
        ob_flush();
        $oCurseurCurl=curl_init($sUrlXmlFile);
        curl_setopt($oCurseurCurl, CURLOPT_RETURNTRANSFER, 1);
        if ($this->aProperties["url_proxy"]!="") curl_setopt($oCurseurCurl, CURLOPT_PROXY, $this->aProperties["url_proxy"]);
        if ($this->aProperties["port_proxy"]!="") curl_setopt($oCurseurCurl, CURLOPT_PROXYPORT, $this->aProperties["port_proxy"]);
        curl_setopt($oCurseurCurl, CURLOPT_CONNECTTIMEOUT, 5);
        $sXml=curl_exec($oCurseurCurl);

        if ($sXml == false){
                $sErreur = GTF_VERSION_LIST_ERROR.curl_error($oCurseurCurl);
                writeToErrorLog($sErreur);
                $bError = true;
        }else{
                curl_close($oCurseurCurl);

                if($oXml=@simplexml_load_string($sXml)){
                        // Stockage dans un tableau PHP
                        $iCpt=0;
                        $aAttributeMaj = array();
                        foreach($oXml->children() as $category){

                                $aAttributeMaj['status'][$iCpt]=1;
                                // Récupération du nom de la mise à jour
                                $aAttributeMaj['name'][$iCpt]=(string)$category['name'];
                                // Récupération du nom du produit sur lequel est fait la mise à jour
                                $sPublishDate=$category['publishing_date'];
                                $aAttributeMaj['publishing_date'][$iCpt]=(string)$sPublishDate;
                                // Récupération de la version applicable
                                $sDeVersion=$category['from'];
                                $aAttributeMaj['de_version'][$iCpt]=(string)$sDeVersion;
                                $aAttributeMaj['stable'][$iCpt]=(string)$category['stable'];
                                $aAttributeMaj['vitis_version'][$iCpt]=$category['vitis_version'];
                                // Récupération de la version applicable
                                $sVersVersion=$category['to'];
                                $aAttributeMaj['vers_version'][$iCpt]=(string)$sVersVersion;
                                $iCpt++;
                        }

                        // Récupération de la liste des modules installés
                        $sSql = $aSql[$this->oConnection->oBd->sgbd]['getModules'];
                        $sSql = str_replace('[sSchemaFramework]',$this->aProperties["schema_framework"] , $sSql);				
                        $oResultat = $this->oConnection->oBd->execute($sSql);
                        $aModules = array();
                        while($oModules = $this->oConnection->oBd->objetSuivant($oResultat))
                                if($oModules->module_id != 'vitis')
                                        $aModules[$oModules->module_id] = $oModules->version;
                        $oResultat = $this->oConnection->oBd->fermeResultat();

                        $aCorrectif = array();
                        $aCorrectif['correctifNumber'] = 0;
                        $i=0;
                        $sSql = $aSql["pgsql"]["delete_maj"];
                        $sSql = str_replace('[sSchemaFramework]', $this->aProperties["schema_framework"], $sSql);
                        $oResultat = $this->oConnection->oBd->execute($sSql);
                        $oResultat = $this->oConnection->oBd->fermeResultat();
                        while($aAttributeMaj['name'][$i]){
                                $bInsert = false;
                                $aAttributeName = explode("_", $aAttributeMaj['name'][$i]);
                                $aVitisVersion =  explode("-", VM_VERSION);

                                if ($_REQUEST['sConfigTab'] == 'install'){
                                        $sAppName = $aAttributeName[1];
                                        $pattern = '#^install_(.+)_([0-9]{4})-([0-9]{2})\.([0-9]{2})#';
                                }else{
                                        $sAppName = $aAttributeName[0];
                                        $pattern = '#^(.+)_([0-9]{4})-([0-9]{2})\.00_to_([0-9]{4})-([0-9]{2})\.([0-9]{2})#';
                                        if($sAppName == 'vitis')
                                                $aVersion = explode("-", VM_VERSION); // _
                                        else
                                                $aVersion = explode("-", $aModules[$sAppName]);

                                }
                                $found = preg_match($pattern, $aAttributeMaj['name'][$i], $matches, PREG_OFFSET_CAPTURE, 0);
                                if($found){
                                        if ($_REQUEST['sConfigTab'] == 'install'){
                                                if (array_key_exists($matches[1][0], $aModules) == false){
                                                        $bInsert = true;
                                                }
                                        }else{
                                                if($matches[1][0] == 'vitis' || array_key_exists($matches[1][0], $aModules)){
                                                        if ($aVersion[0] == $matches[2][0]){
                                                                $aVersion2 = explode(".", $aVersion[1]);
                                                                $aAttributeMaj['module'][$i] = $matches[1][0];
                                                                if((int)$aVersion2[0] <= $matches[3][0]){
                                                                        $bInsert = true;
                                                                }
                                                        }
                                                }
                                        }

                                }else{
                                        // Ou correctif ?        
                                        $pattern = '#^(.+)_([0-9]{4})-([0-9]{2})\.([0-9]{2})#';
                                        $found = preg_match($pattern, $aAttributeMaj['name'][$i], $matches, PREG_OFFSET_CAPTURE, 0);
                                        if($found){
                                                if($matches[1][0] == 'vitis' || array_key_exists($matches[1][0], $aModules)){
                                                        $aVersion2 = explode(".", $aVersion[1]);
                                                        if($aVersion[0] == $matches[2][0] && intval($aVersion2[0]) == intval($matches[3][0]) && intval($aVersion2[1]) < intval($matches[4][0])){
                                                                if( intval($aCorrectif['correctifNumber']) < intval($matches[4][0])){
                                                                        $aCorrectif['correctifNumber'] = $matches[4][0];
                                                                        $aCorrectif['from'] = $aAttributeMaj['de_version'][$i];
                                                                        $aCorrectif['anne'] = $matches[2][0];
                                                                        $aCorrectif['version'] = $matches[3][0];
                                                                        $aCorrectif['name'] = $aAttributeMaj['name'][$i];
                                                                        $aCorrectif['to'] = $aAttributeMaj['vers_version'][$i];
                                                                        $aCorrectif['vitis_version'] = $aAttributeMaj['vitis_version'][$i];
                                                                        $aCorrectif['publishing_date'] = $aAttributeMaj['publishing_date'][$i];
                                                                        $aCorrectif['module'] = $matches[1][0];
                                                                        $bInsert = true;
                                                                }
                                                        }
                                                }
                                        }
                        }
                     if ($bInsert && ($aAttributeMaj['stable'][$i] == "true" || (isset($this->aProperties["only_stable_module"]) && $this->aProperties["only_stable_module"] == false))){ 
                                        // verification de l'existance de la maj dans la table
                                        $sSql = $aSql["pgsql"]["verif_maj"];
                                        $sSql = str_replace('[sMajName]',$aAttributeMaj['name'][$i],$sSql);
                                        $sSql = str_replace('[sSchemaFramework]',$this->aProperties["schema_framework"] , $sSql);
                                        $oResultat = $this->oConnection->oBd->execute($sSql);
                                        $oName = $this->oConnection->oBd->objetSuivant($oResultat);
                                        $sExist = $oName->name;
                                        $oResultat = $this->oConnection->oBd->fermeResultat();
                                        // si elle n'existe pas, insertion dans la table s_vitis.update
                                        if($sExist == ""){
                                                $sInfo .= $aAttributeMaj['name'][$i]." ".$aAttributeMaj['vers_version'][$i]." ajoutée<br>";
                                                $sSql = $aSql["pgsql"]["insert_maj"];
                                                $sSql = str_replace('[sMajName]', $aAttributeMaj['name'][$i], $sSql);
                                                $sSql = str_replace('[publishing_date_maj]', $aAttributeMaj['publishing_date'][$i], $sSql);
                                                $sSql = str_replace('[de_version_maj]', $aAttributeMaj['de_version'][$i], $sSql);
                                                $sSql = str_replace('[vers_version_maj]', $aAttributeMaj['vers_version'][$i], $sSql);
                                                $sSql = str_replace('[vitis_version]', $aAttributeMaj['vitis_version'][$i], $sSql);
                                                $sSql = str_replace('[status_maj]', $aAttributeMaj['status'][$i], $sSql);
                                                $sSql = str_replace('[sSchemaFramework]', $this->aProperties["schema_framework"], $sSql);
                                                $sSql = str_replace('[sModule]', $aAttributeMaj['module'][$i], $sSql);
                                                $oResultat = $this->oConnection->oBd->execute($sSql);
                                                $oResultat = $this->oConnection->oBd->fermeResultat();
                                        }
                                }
                                $i++;
                        }

                        if(isset($aCorrectif['name'])){
                                $sSql = $aSql["pgsql"]["delete_correct"];
                                $sSql = str_replace('[from_correct]',$aCorrectif['from'],$sSql);
                                $sSql = str_replace('[name_correct]',"gtf_".$aCorrectif['anne']."-".$aCorrectif['version'],$sSql);
                                $sSql = str_replace('[sSchemaFramework]',$this->aProperties["schema_framework"] , $sSql);
                                $oResultat = $this->oConnection->oBd->execute($sSql);
                                $sSql = $aSql["pgsql"]["verif_maj"];
                                $sSql = str_replace('[sMajName]',$aCorrectif['name'],$sSql);
                                $sSql = str_replace('[sSchemaFramework]',$this->aProperties["schema_framework"] , $sSql);
                                $oResultat = $this->oConnection->oBd->execute($sSql);
                                $oName = $this->oConnection->oBd->objetSuivant($oResultat);
                                $sExist = $oName->name;
                                $oResultat = $this->oConnection->oBd->fermeResultat();
                                        // si elle n'existe pas, insertion dans la table s_vitis.update
                                if($sExist == ""){
                                        $sInfo .= $aCorrectif['name']." ".$aCorrectif['to']." ajoutée<br>";
                                        $sSql = $aSql["pgsql"]["insert_maj"];
                                        $sSql = str_replace('[sMajName]', $aCorrectif['name'], $sSql);
                                        $sSql = str_replace('[publishing_date_maj]', $aCorrectif['publishing_date'], $sSql);
                                        $sSql = str_replace('[de_version_maj]', $aCorrectif['from'], $sSql);
                                        $sSql = str_replace('[vers_version_maj]', $aCorrectif['to'], $sSql);
                                        $sSql = str_replace('[status_maj]', 1, $sSql);
                                        $sSql = str_replace('[sSchemaFramework]', $this->aProperties["schema_framework"], $sSql);
                                        $sSql = str_replace('[sModule]', $aCorrectif['module'], $sSql);
                                        $oResultat = $this->oConnection->oBd->execute($sSql);
                                        $oResultat = $this->oConnection->oBd->fermeResultat();
                                }
                        }
                }
        }
    }
}
?>
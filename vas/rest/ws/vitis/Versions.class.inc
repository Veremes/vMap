<?php

require_once 'Vitis.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
require_once(__DIR__.'/../../class/vmlib/BdDataAccess.inc');
/**
* \file versions.class.inc
* \class Versions
*
* \author Yoann Perollet <yoann.perollet@veremes.com>.
*
*	\brief This file contains the Versions php class
*
* This class defines the rest api for versions
* 
*/
class Versions  extends Vitis{
    
    /**
     * @SWG\Definition(
     *   definition="/versions",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/versions")
     *   }
     * )
     * @SWG\Tag(
     *   name="Versions",
     *   description="Operations about versions"
     * )
     */
    /**
     * construct
     * @param type $aPath url of the request
     * @param type $aValues parameters of the request
     * @param type $versions ptroperties
     */
    function Versions($aPath, $aValues, $properties){
        $this->aValues = $aValues;
        $this->aPath = $aPath;
        $this->aProperties = $properties;
        $this->oConnection = new Connection($this->aValues, $this->aProperties);
    }
    
    /**
     * @SWG\Get(path="/versions",
     *   tags={"Versions"},
     *   summary="Get versions",
     *   description="Request to get versions",
     *   operationId="GET",
     *   produces={"application/xml", "application/json", "application/x-vm-json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/versions")
     *     )
     *  )
     */
    /**
     * 
     * @return versions
     */
    function GET(){
        $this->getVersion();
        if (isset($this->aValues['token'])){

       
		
            //$this->aFields = $this->aVersions;
            $this->aFields['php_version'] = phpversion();
            
            //*** PDO
            $bPdo = false;
            if (extension_loaded('pdo'))
                    $bPdo = true;
            else
                    $bVeremap = false;
            $this->aFields['pdo_extension_loaded'] = $bPdo;
            
            //*** PDO Postgresql
            $bPdoPgsql = false;
            if (extension_loaded('pdo_pgsql'))
                    $bPdoPgsql = true;
            else
                    $bVeremap = false;
            $this->aFields['pdo_pgsql_extension_loaded'] = $bPdoPgsql;
            
            //*** Curl
            $bCurl = false;
            if (extension_loaded('curl'))
                    $bCurl = true;
            else
                    $bVeremap = false;
            $this->aFields['curl_extension_loaded'] = $bCurl;
            
            //*** Xsl
            $bXsl = false;
            if (extension_loaded('xsl'))
                    $bXsl = true;
            $this->aFields['xsl_extension_loaded'] = $bXsl;
            
            //*** Ldap
            $bLdap = false;
            if (extension_loaded('ldap'))
                    $bLdap = true;
            $this->aFields['ldap_extension_loaded'] = $bLdap;
            
            // OS.
            $this->aFields['os_version'] = php_uname();
            
            // Info disque.
            $this->aFields['disk_info'] = round(disk_free_space("/")/1073741824)." GO / ".round(disk_total_space("/")/1073741824)." GO";
            
            //
            $this->aFields['server_software'] = $_SERVER['SERVER_SOFTWARE'];
            $this->aFields['server_addr'] = $_SERVER['SERVER_ADDR'];
            $this->aFields['server_name'] = $_SERVER['SERVER_NAME'];
            $this->aFields['server_port'] = $_SERVER['SERVER_PORT'];
            
            //** Postgresql et Postgis
            $bPostgresql = false;
            $bPostgis = false;
            if(!$this->oConnection->oBd->erreurRencontree) {
                    $bPostgresql = true;
                    $sSql = "SHOW server_version";
                    $iResult = $this->oConnection->oBd->execute($sSql);
                    $oPgVersion = $this->oConnection->oBd->objetSuivant($iResult);
                    $sPostgresql = $oPgVersion->server_version;
                    $this->aFields['postgresql_version'] = $sPostgresql;
                    $this->oConnection->oBd->fermeResultat();

                    $aVersion = explode(".",$sPostgresql);
                    $bExtension =false;
                    if ($aVersion[0] >=9){
                            if ($aVersion[1] >=1){
                                    $bExtension =true;
                            }
                    }
                    if ($bExtension == true){
                            $sSql = "SELECT default_version FROM   pg_catalog.pg_available_extensions where name = 'postgis';";
                            $iResult = $this->oConnection->oBd->execute($sSql);
                            if($aPostgis=$this->oConnection->oBd->ligneSuivante($iResult)){
                                    $bPostgis = true;
                                    $sPostgis = $aPostgis['default_version'];
                            }else{
                                    $bPostgis = false;
                            }
                    }else{
                            $sSql = "SELECT datname    FROM pg_catalog.pg_database where datname = 'template_postgis_20';";
                            $iResult = $this->oConnection->oBd->execute($sSql);
                            if($aPostgis=$this->oConnection->oBd->ligneSuivante($iResult)){
                                    $bPostgis = true;
                                    $sPostgis = '2.0';
                            }else{
                                    $bPostgis = false;
                            }
                    }
                    $this->aFields['postgis_version'] = $sPostgis;
                    $this->oConnection->oBd->fermeResultat();
                    $iResult=$this->oConnection->oBd->execute("SELECT distinct module_id from ".$this->aProperties["schema_framework"].".vm_mode");
                    while($aLigne=$this->oConnection->oBd->ligneSuivante($iResult)){
                            $aModules[] = $aLigne['module_id'];
                    }
                    $iRecordset=$this->oConnection->oBd->fermeResultat();
            }
            $this->aFields['postgresql'] = $bPostgresql;
            $this->aFields['postgis'] = $bPostgis;
            //
        }
        $aXmlRacineAttribute['status']=1;
        $sMessage = $this->asDocument('','vitis',$this->aValues['sEncoding'],True,$aXmlRacineAttribute,$this->aValues['sSourceEncoding'],$this->aValues['output']);
        return $sMessage;
    }
}
 
?>
<?php

/**
 * \file Domains.class.inc
 * \class Domains
 *
 * \author Yoann Perollet <yoann.perollet@veremes.com>.
 *
 * 	\brief This file contains the Modes php class
 *
 * This class defines Rest Api to Vitis Domains
 * 
 */
require_once 'Vitis.class.inc';
require_once __DIR__.'/../../class/vitis_lib/Connection.class.inc';
require_once 'Domain.class.inc';
require_once(__DIR__.'/../../class/vmlib/BdDataAccess.inc');

class Domains extends Vitis {
    /**
     * @SWG\Definition(
     *   definition="/domains",
     *   allOf={
     *     @SWG\Schema(ref="#/definitions/domains")
     *   }
     * )
     * * @SWG\Tag(
     *   name="Domains",
     *   description="Operations about Domains"
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
        $this->aSelectedFields = Array("domain_id", "domain", "alias", "server", "port", "dn_search_user", "filter_user", "dn_search_group", "filter_group", "login", "password", "verify_rights", "type");
    }

    /**
     * @SWG\Get(path="/domains",
     *   tags={"Domains"},
     *   summary="Get Domains",
     *   description="Request to get Domains",
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
     *         @SWG\Schema(ref="#/definitions/users")
     *     )
     *  )
     */

    /**
     * get Domains
     * @return  Domains
     */
    function GET() {
        $aReturn = $this->genericGet($this->aProperties['schema_framework'], "domain", "domain_id");
        $sMessage = $aReturn['sMessage'];
        return $sMessage;
    }

    /**
     * @SWG\Post(path="/domains",
     *   tags={"Domains"},
     *   summary="Add Domain",
     *   description="Request to add domain",
     *   operationId="POST",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="formData",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="domain",
     *     in="formData",
     *     description="domain name",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="alias",
     *     in="formData",
     *     description="Domain alias",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="server",
     *     in="formData",
     *     description="Ad server",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="port",
     *     in="formData",
     *     description="Ad server port",
     *     required=true,
     *     type="integer",
     *    format="int32"
     *   ),
     * @SWG\Parameter(
     *     name="dn_search_user",
     *     in="formData",
     *     description="Search DN base for users",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="filter_user",
     *     in="formData",
     *     description="Filter to search users",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="dn_search_group",
     *     in="formData",
     *     description="Search DN base for groups",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="filter_group",
     *     in="formData",
     *     description="Filter to search groups",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="login",
     *     in="formData",
     *     description="login to connect to ldap",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="password",
     *     in="formData",
     *     description="password to connect to ldap",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="type",
     *     in="formData",
     *     description="type of ldap server (AD or openldap supported)",
     *     required=false,
     *     type="array",
     *         @SWG\Items(type="string"),
     *         collectionFormat="multi",
     *         default="AD",
     *         enum={"AD", "OpenLdap"}
     *   ),
     *  @SWG\Parameter(
     *     name="verify_rights",
     *     in="formData",
     *     description="verify rights",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/domains")
     *     ),
     * 
     *  )
     */

    /**
     * insert user
     * @return id of the user created
     */
    function POST() {
        $aReturn = $this->genericPost($this->aProperties['schema_framework'], 'domain', $this->aProperties['schema_framework'].'.seq_common', 'domain_id');
		$sSql = "select nspname from pg_catalog.pg_namespace where nspname = 's_framework';";
		$resultat = $this->oConnection->oBd->execute($sSql);
		if ($resultat->rowCount() > 0) {
			$this->genericPost("s_framework", 'domain', "s_framework".'.seq_common', 'domain_id', "framework_admin");
		}
        if ($aReturn['sStatus'] == 1){
            $oDomain = new Domain($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
            $oDomain->GET();
            $error = $this->writeDomainInProperties($oDomain->aFields, "insert");
            if ($error['sStatus'] == 1){
                $sMessage = $aReturn['sMessage'];
            }else{
                $oError = new VitisError(1, $error['sMessage']);
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']); 
            }
        }else{
            $sMessage = $aReturn['sMessage'];
        }
        return $sMessage;
        
    }

    /**
     * 
     * @param type $aExternalValues
     * @param type $sAction
     * @return type
     */
    Function writeDomainInProperties($aValues, $sAction) {
        require $this->sRessourcesFile;
        $sSql2 = $aSql['listDomain'];
        $sSql2 = str_replace('[sSchemaFramework]', $this->aProperties["schema_framework"], $sSql2);
        $resultat = $this->oConnection->oBd->execute($sSql2);
        $fPropertiesDomain = fopen('conf/properties_domain.inc', 'w');
        fputs($fPropertiesDomain, "<?php" . PHP_EOL);
        fputs($fPropertiesDomain, '$properties[\'domain\'] [""] = "";' . PHP_EOL);
        while ($oDomain = $this->oConnection->oBd->objetSuivant($resultat)) {
            fputs($fPropertiesDomain, '$properties[\'domain\'] ["' . $oDomain->alias . '"] = "' . $oDomain->domain . '";' . PHP_EOL);
        }
        fputs($fPropertiesDomain, "?>" . PHP_EOL);
        fclose($fPropertiesDomain);
        if ($sAction == "insert") {
            $sSql = $aSql['getInfoRolname'];
            $sSql = str_replace('[sDomain]', $aValues["domain"], $sSql);
            $resultat = $this->oConnection->oBd->execute($sSql);
            if ($this->oConnection->oBd->nombreLigne($resultat) == 0) {
                $sSql = $aSql['createRolname'];
                $sSql = str_replace('[sDomain]', $aValues["domain"], $sSql);
                $oPDOResult = $this->oConnection->oBd->execute($sSql);
                if ($this->oConnection->oBd->enErreur()) {
                    $aReturn = array(sStatus => 0, sMessage => $this->oBd->getBDMessage());
                    return array(aReturn => $aReturn);

                }
            }
        }
        
        $aReturn = array('sStatus' => 1, 'sMessage' => "");
        return  $aReturn;
    }

    /**
     * @SWG\Put(path="/domains/{domain_id}",
     *   tags={"Domains"},
     *   summary="Update Domain",
     *   description="Request to update domain",
     *   operationId="PUT",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="user token",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="domain_id",
     *     in="path",
     *     description="domain id",
     *     required=true,
     *     type="integer",
       *   format="int32"
     *   ),
     *   @SWG\Parameter(
     *     name="domain",
     *     in="query",
     *     description="domain name",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="alias",
     *     in="query",
     *     description="Domain alias",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="server",
     *     in="query",
     *     description="Ad server",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="port",
     *     in="query",
     *     description="Ad server port",
     *     required=true,
     *     type="integer",
     *    format="int32"
     *   ),
     * @SWG\Parameter(
     *     name="dn_search_user",
     *     in="query",
     *     description="Search DN base for users",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="filter_user",
     *     in="query",
     *     description="Filter to search users",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="dn_search_group",
     *     in="query",
     *     description="Search DN base for groups",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="filter_group",
     *     in="query",
     *     description="Filter to search groups",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="login",
     *     in="query",
     *     description="login to connect to ldap",
     *     required=false,
     *     type="string"
     *   ),
     *  @SWG\Parameter(
     *     name="password",
     *     in="query",
     *     description="password to connect to ldap",
     *     required=false,
     *     type="string"
     *   ),
     * @SWG\Parameter(
     *     name="type",
     *     in="query",
     *     description="type of ldap server (AD or openldap supported)",
     *     required=false,
     *     type="array",
     *         @SWG\Items(type="string"),
     *         collectionFormat="multi",
     *         default="AD",
     *         enum={"AD", "OpenLdap"}
     *   ),
     *  @SWG\Parameter(
     *     name="verify_rights",
     *     in="query",
     *     description="verify rights",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/domains")
     *     ),
     * 
     *  )
     */

    /**
     * insert user
     * @return id of the user created
     */
    function PUT() {
        $aReturn = $this->genericPut($this->aProperties['schema_framework'], 'domain', 'domain_id');
        if ($aReturn['sStatus'] == 1){
			
            $oDomain = new Domain($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
            $oDomain->GET();
            $error = $this->writeDomainInProperties($oDomain->aFields, "update");
            if ($error['sStatus'] == 1){
                $sMessage = $aReturn['sMessage'];
				$sSql = "select nspname from pg_catalog.pg_namespace where nspname = 's_framework';";
				$resultat = $this->oConnection->oBd->execute($sSql);
				if ($resultat->rowCount() > 0) {
					$sSql = "select domain_id from s_framework.domain where domain = '".$oDomain->aFields['domain']."';";
					$resultat = $this->oConnection->oBd->execute($sSql);
					if ($resultat->rowCount() > 0) {
						while($aLigne=$this->oConnection->oBd->ligneSuivante ($resultat)) {
							$this->aValues['my_vitis_id'] = $aLigne['domain_id'];
							$this->genericPut("s_framework", 'domain', 'domain_id');
						}
					}
				}
            }else{
				
                $oError = new VitisError(1, $error['sMessage']);
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']); 
            }
        }else{
            $sMessage = $aReturn['sMessage'];
        }
        return $sMessage;
    }
    
    /**
     * @SWG\Delete(path="/domains/",
     *   tags={"Domains"},
     *   summary="delete Domain",
     *   description="Request to delete Domain",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="domain token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="idList",
     *     in="query",
     *     description="id of the domains",
     *     required=true,
     *     type="string"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/domains")
     *     )
     *  )
     */
    /**
     * @SWG\Delete(path="/domains/{domain_id}",
     *   tags={"Domains"},
     *   summary="delete Domain",
     *   description="Request to delete Domain",
     *   operationId="DELETE",
     *   produces={"application/xml", "application/json"},
     *   @SWG\Parameter(
     *     name="token",
     *     in="query",
     *     description="domain token",
     *     required=true,
     *     type="string"
     *   ),
     * * @SWG\Parameter(
     *     name="domain_id",
     *     in="path",
     *     description="id of the domain",
     *     required=true,
     *     type="integer",
     *     format = "int32"
     *   ),
     * @SWG\Response(
     *         response=200,
     *         description="Poprerties Response",
     *         @SWG\Schema(ref="#/definitions/domains")
     *     )
     *  )
     */
    
    /**
     * delete domain
     * @return id of domain deleted or error object if a domain is not deleted
     */
    function DELETE() {
		$sSql = "select nspname from pg_catalog.pg_namespace where nspname = 's_framework';";
		$resultat = $this->oConnection->oBd->execute($sSql);
		if ($resultat->rowCount() > 0) {
			$sSql = "select domain from ".$this->aProperties['schema_framework'].".domain where domain_id IN";
			if (isset($this->aValues['my_vitis_id'])) {
				$sSql .= "(".$this->aValues['my_vitis_id'].")";
			}else{
				$sSql .= "(".str_replace("|", ",", $this->aValues['idList']).")";
			}
			$resultat = $this->oConnection->oBd->execute($sSql);
			if ($resultat->rowCount() > 0) {
				$sDomaineNames = "";
				while($aLigne=$this->oConnection->oBd->ligneSuivante ($resultat)) {
					if ($sDomaineNames == ""){
						$sDomaineNames = "'".$aLigne['domain']."'";
					}else{
						$sDomaineNames .= ",'".$aLigne['domain']."'";
					}
				}
				$sSql = "delete from s_framework.domain where domain in (".$sDomaineNames.")";
				$resultat = $this->oConnection->oBd->execute($sSql);
			}
		}
        $aReturn = $this->genericDelete($this->aProperties['schema_framework'], 'domain', 'domain_id');
        if ($aReturn['sStatus'] == 1){
            $oDomain = new Domain($this->aPath, $this->aValues, $this->aProperties, $this->oConnection);
            $oDomain->GET();
            $error = $this->writeDomainInProperties($oDomain->aFields, 'delete');
            if ($error['sStatus'] == 1){
                $sMessage = $aReturn['sMessage'];
            }else{
                $oError = new VitisError(1, $error['sMessage']);
                $aXmlRacineAttribute['status'] = 0;
                $sMessage = $oError->asDocument('', 'vitis', $this->aValues['sEncoding'], True, $aXmlRacineAttribute, $this->aValues['sSourceEncoding'], $this->aValues['output']); 
            }
        }else{
            $sMessage = $aReturn['sMessage'];
        }
        return $sMessage;
    }
}
?>
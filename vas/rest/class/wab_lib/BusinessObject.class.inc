<?php

//Par défaut il faudra inclure la lib de log pour pouvoir logger
//D’autres lib pourront être chargées ici en fonction des besoins

require_once("vmlib/logUtil.inc");
require_once("vmlib/Email.class.inc");
require_once("vmlib/phpUtil.inc");
require_once("gtf_lib/gtf_object/User.class.inc");

class WabBusinessObject {

    protected $bo_id;
    protected $className;
    private $status;
    protected $history;
    protected $oBd;
    public $aValues = array();
    protected $aTableInfo = array();
    protected $aProperties = array();
    protected $aSql = array();
    protected $bNoError = true;
    protected $sErrorMessage;

    /*     * ****************************************************
      Class constructor
      \oBd : Connection object.
      \aProperties : Array of properties.

     * **************************************************** */

    public function __construct($oBd, $aTableInfo, $aValues, $aProperties, $className, $iId = null) {
        require 'BusinessObject.class.sql.inc';
        //$this->aTableInfo = $aTableInfo;
        $this->oBd = $oBd;
        $this->aValues = $aValues;
        $this->aProperties = $aProperties;
        $this->className = $className;
        $this->bo_id = $iId;
        $this->history = "";
    }

    /*     * ****************************************************
      Sauve l'action réalisé par l'utilisateur
      \sEvent : action réalisé (changement de statut...)
     * **************************************************** */

    private function addHistoryEvent($sEvent) {
        $this->history .= date('d/m/Y H:i') . ' | ' . $_SESSION['ses_Login'] . ' | ' . $sEvent . PHP_EOL;
    }

    /*     * ****************************************************
      Change le statut
      \sStatus : statut
     * **************************************************** */
/*
    protected function setStatus($sStatus) {
        // Mode insertion ?	
        if (!empty($this->iId))
            $this->bo_id = $this->iId;
        //	
        $this->status = $sStatus;
        $this->addHistoryEvent($this->status);
        $this->save();
    }
*/
    public function wabSetStatus($sSchema, $sTable, $sBoNameField, $mBoIdValue, $sStatusName) {
        require 'BusinessObject.class.sql.inc';
        // get status Id avec le StatusName
        $aParams = array(
          "SCHEMA"=> array("value"=> $sSchema, "type"=>'column_name'),
          "TABLE"=> array("value"=> $sTable, "type"=>'column_name'),
          "STATUS_NAME"=> array("value"=> $sStatusName, "type"=>'string')
          );
        $oResultat = $this->oBd->executeWithParams($aSQL["getStatusId"], $aParams);

        $this->status = $this->oBd->objetSuivant($oResultat)->status_id;
        // ajout historique
        $this->addHistoryEvent($this->status);
        // UPDATE dans la table avec le boName
        $sSql = $aSQL["updateStatus"];
        $aParams = array(
          "SCHEMA" => array("value"=> $sSchema, "type"=> 'column_name'),
          "TABLE" => array("value"=> $sTable, "type"=> 'column_name'),
          "STATUS_ID" => array("value"=> $this->status, "type"=> 'number'),
          "BOIDFIELD" => array("value"=> $sBoNameField, "type"=> 'column_name'),
          "BOID" => array("value"=> $mBoIdValue, "type"=> 'number')
          );

        $this->oBd->executeWithParams($sSql, $aParams);
    }

    /*     * ********************************************************************
      Ajoute une note
      \sLineAttribute : Champ de form. contenant la note à ajouter
      \sNoteAttribute : Champ de form. contenant l'historique des notes
     * ******************************************************************** */

    protected function addNote($sLineAttribute, $sNoteAttribute) {
        if (!empty($this->aValues[$sLineAttribute])) {
            // Mode insertion ?
            if (!empty($this->iId))
                $this->bo_id = $this->iId;
            //	
            $note = preg_replace('/^<br>/', '', $this->aValues[$sNoteAttribute]);
            $note .= date('d/m/Y H:i') . ' | ' . $_SESSION['ses_Login'] . ' | ' . $this->aValues[$sLineAttribute] . PHP_EOL;
            $this->aValues[$sNoteAttribute] = $note;
            $this->save();
        }
    }

    /*     * *********************************************
      Retourne toutes les infos d'une méthode pour
      la transition
      \sMethodName : Nom de la méthode
     * ********************************************* */
    /* function getMethodParameters($sMethodName) {
      $sSql = $this->aSql[$this->oBd->sgbd]['getMethodParameters'];
      $sSql = str_replace('[methodName]', $sMethodName , $sSql);
      $sSql = str_replace('[schema_gpm]', $this->aProperties['schema_gpm'] , $sSql);
      $sSql = str_replace('[className]', $this->className , $sSql);
      $result = $this->oBd->execute($sSql);
      if(!$oBd->erreurRencontree) {
      $oMethodParameters = $this->oBd->objetSuivant($result);
      }
      return $oMethodParameters;
      } */

    /*     * **********************************************
      Exécute le processus de transition par défaut.
      \sMethodName : Nom de la méthode
     * ********************************************** */
    /* function setTransition($sMethodName) {
      $oMethodParameters = $this->getMethodParameters($sMethodName . '()');
      // Before script
      if (!empty($oMethodParameters->before_transition_code))
      eval($oMethodParameters->before_transition_code);
      // Mise à jour du status
      if ($this->bNoError) {
      $this->setStatus($oMethodParameters->transition_to_status);
      // After script
      if (!empty($oMethodParameters->after_transition_code))
      eval($oMethodParameters->after_transition_code);
      }

      } */

    /*     * ************************************************************
      Vérifie si la méthode appelée inexistante est une méthode de
      transition.
      \$sMethodName : Nom de la méthode inexistante
      \$aMethodArguments : Arguments de la méthode
      /Retour : Tableau avec un message si erreur.
     * ************************************************************ */
    /* public function __call($sMethodName, $aMethodArguments) {
      $sSql = $this->aSql[$this->oBd->sgbd]['isTransitionMethod'];
      $sSql = str_replace('[methodName]', $sMethodName . '()' , $sSql);
      $sSql = str_replace('[schema_gpm]', $this->aProperties['schema_gpm'] , $sSql);
      $sSql = str_replace('[className]', $this->className , $sSql);
      $oResult = $this->oBd->execute($sSql);
      if(!$oBd->erreurRencontree) {
      if ($this->oBd->nombreLigne ($oResult) > 0) {
      $this->setTransition($sMethodName);
      }
      }
      if ($this->bNoError) {
      $aReturn = array('sStatus' => 0);
      $bFinishCreateWorkspace = true;
      } else {
      $aReturn = array('sStatus' => 1, 'sMessage' => $this->sErrorMessage);
      $bFinishCreateWorkspace = false;
      }
      return array('bFinishCreateWorkspace' => $bFinishCreateWorkspace, 'aReturn' => $aReturn);
      } */

    /*     * ********************************************************************
      Modifie un paramètre de la classe
      \sParameterName : nom du paramètre à modifier
      \sValue : Nouvelle valeur
     * ******************************************************************** */

    function set($sParameterName, $sValue) {
        if (property_exists($this, $sParameterName))
            $this->$sParameterName = $sValue;
        else
            $this->aValues[$sParameterName] = $sValue;
    }

    /*     * ********************************************************************
      Retourne un paramètre de la classe
      \sParameterName : nom du paramètre à retourner
      /Retour : Valeur du paramètre (si il existe)
     * ******************************************************************** */

    function get($sParameterName) {
        if (property_exists($this, $sParameterName))
            return $this->$sParameterName;
    }

    /*     * ********************************************************************
      Sauve tous les paramètres de la classe
     * ******************************************************************** */

    function save() {
        $aValues = $this->getClassParameters();
        $this->oBd->update($this->aTableInfo['schema_name'], str_replace($this->aTableInfo["module"] . "_", "", $this->aTableInfo['name']), $aValues, $this->aTableInfo['id_field'], $this->bo_id, $this->aTableInfo['id_field_type']);
    }

    /*     * ********************************************************************
      Fusionne les propriétés de l'objet et le tableau aValues
      /Return : tableau
     * ******************************************************************** */

    function getClassParameters() {
        foreach (get_object_vars($this) as $sIndex => $value) {
            if (!is_array($value) && !is_object($value))
                $aClassParameters[$sIndex] = $value;
        }
        return array_merge($this->aValues, $aClassParameters);
    }

    /*     * ********************************************************************
      Insère une demande pour un projet FME
      \$sWorkspaceKey : Clé du projet FME
      \$sWkParams : Paramètres de la demande
      \$iPriorityId : Priority level
      \$iEmailOptionId : Identifier for email option
      \$sEmailNotifications : Notificiation email address
      \$sXslStyleSheet : Stylesheet path
      /Retour : booléen (T:ok, F:erreur)
     * ******************************************************************** */

    function insertOrder($sWorkspaceKey, $sWkParams, $iPriorityId = 1, $iEmailOptionId = 3, $sEmailNotifications = '', $sXslStyleSheet = '') {
        
      $bNoError = true;

      if($properties['web_server_name'] === "[HTTP_HOST]"){
        $properties['web_server_name'] = "https://localhost";
      }

      // Get token  
      $sToken = $this->getToken();

      if ($sToken !== false) {

        //get workspace id
        $sSQL = "SELECT workspace_id FROM [SCHEMA_GTF].workspace WHERE key = [WK_KEY];";
        $aParams = array(
          "SCHEMA_GTF" => array('value'=> $this->aProperties["schema_gtf"], 'type' => 'column_name'),
          "WK_KEY" => array('value'=> $sWorkspaceKey, 'type' => 'string'),
        );
        $oWK = $this->oBd->executeWithParams($sSQL, $aParams);
        // oBd en erreur
        $iWKid = $this->oBd->objetSuivant ($oWK)->workspace_id;
        // Insertion de la demande
        $sUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['services_alias'] . '/gtf/userorders';
        $postfields = array(
          'token'=>$sToken, 
          'order_date' => date('Y-m-d'),
          'workspace_id'=>$iWKid, 
          'priority_id'=>$iPriorityId,
          'email_option_id'=>$iEmailOptionId,
          'wk_params'=>$sWkParams,
          'xslstylesheet'=>$sXslStyleSheet,
          'email_notifications'=>$sEmailNotifications
        );
        $oReturn = $this->postCurlRequest ($sUrl, $postfields);
                 
      } else
        $sErrorMsg = 'Error while performing a cURL session (' . __METHOD__ . ' (get token))';

      if ($sErrorMsg != '') {
        writeToErrorLog($sErrorMsg);
        $bNoError = false;
        $this->sErrorMessage = $sErrorMsg;
      }
      $this->bNoError = $bNoError;
      return $bNoError;
    }

    /*     * ********************************************************************
      Envoi un email
      \$iEmailTemplateId : Id du modèle d'email.
      /Retour : Message
     * ******************************************************************** */

    function sendMail($iEmailTemplateId = null) {
        $sMessage = '';
        $aObjects = array('oBusinessObject' => $this);
        if (empty($iEmailTemplateId))
            $iEmailTemplateId = $this->aProperties['default_mail_model'];
        writeToErrorLog(print_r($this->aProperties, true));
        $oEmail = new Email($this->oBd, $iEmailTemplateId, $this->aProperties, $aObjects);
        if (!empty($oEmail->oEmailTemplate->name))
            $sMessage = $oEmail->send();
        return $sMessage;
    }

    /*     * ********************************************************************
      Retourne un objet de la classe "User".
      \$sUserLogin : Login d'un utilisateur
      /Retour : Objet de la classe User
     * ******************************************************************** */

    function getUser($sUserLogin) {
        $sSql = $this->aSql[$this->oBd->sgbd]['getUserId'];
        //$sSql = str_replace('[login]', $this->aValues[$sUserLogin], $sSql);
        //$sSql = str_replace('[schema_framework]', $this->aProperties['schema_framework'], $sSql);
        $aParams = array(
          "login"=>array("value"=>$this->aValues[$sUserLogin], "type"=>"string"),
          "schema_framework"=>array("value"=>$this->aProperties['schema_framework'], "type"=>"column_name"),
        );
        $oResult = $this->oBd->executeWithParams($sSql, $aParams);
        if (!$this->oBd->erreurRencontree) {
            if ($this->oBd->nombreLigne($oResult) > 0) {
                $oUser = new User($this->oBd, $this->oBd->objetSuivant($oResult)->user_id, $this->aProperties);
                return $oUser;
            }
        }
    }

    /*     * ********************************************************************
      Récupére un token de session utilisateur.
      /Retour : string token
     * ******************************************************************** */

    function getToken () {

      if($this->aProperties['web_server_name'] === "[HTTP_HOST]"){
        $this->aProperties['web_server_name'] = "https://localhost";
      }
        $sUrl = $this->aProperties['web_server_name'] . '/' . $this->aProperties['services_alias'] . '/vitis/privatetoken';

        if(!empty($_SESSION["ses_Login"])){
          $sUserPassword = trim(des(rtrim(utf8_decode($_SESSION['ses_Login'])), hexToString(rtrim($_SESSION['ses_Password'])), 0, 0, null));
          $postfields = array('user'=>$_SESSION["ses_Login"], 'password'=>$sUserPassword);
        } else {
          $postfields = array('user'=>$this->aProperties["login_bot"], 'password'=>$this->aProperties["pass_bot"]);
        }

        $oToken = json_decode($this->postCurlRequest ($sUrl, $postfields));
        return $oToken->token;
    }

    /*     * ********************************************************************
      envoi une requete curl en POST
      \$sUrl : Url pour envoyer la requete
      \$postfields : array contenant les paramètres à envoyer
      /Retour : string token
     * ******************************************************************** */
    function postCurlRequest ($sUrl, $postfields) {
      $ch = curl_init($sUrl);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Accept: application/json"));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postfields);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        return curl_exec($ch);
    }

}

?>

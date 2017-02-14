<?php

require_once("vmlib/logUtil.inc");
require_once 'vmlib/error.inc';

class EmailTemplateLib {

    public $id;
    public $name;
    public $to;
    public $cc;
    public $cci;
    public $subject;
    public $body;
    public $code;
    public $use_advanced;
    public $oBd;
    public $context;
    public $aObjects;
    public $aAttachments;
    public $aProperties;

    /*     * ****************************************************
      Récupère les paramètres du modèle de mail
      \$oBd : objet PDO
      \$iEmailTemplateId : id du modèle de mail
     * **************************************************** */

    function __construct($oBd, $iEmailTemplateId, $aProperties, $aObjects) {
        require("EmailTemplate.class.sql.inc");
        $this->aProperties = $aProperties;
        $this->aObjects = $aObjects;
        // Récupère les données du modèle de mail	
        $sSql = $aSql[$oBd->sgbd]['getMailModel'];
        $sSql = str_replace('[iEmailTemplateId]', $iEmailTemplateId, $sSql);
        $sSql = str_replace('[sSchemaGtf]', $aProperties['schema_gtf'], $sSql);
        $oResult = $oBd->execute($sSql);
        if ($oBd->erreurRencontree)
            $sErrorMsg = $oBd->getBDMessage();
        else {
            if ($oBd->nombreLigne($oResult) > 0) {
                $oRow = $oBd->objetSuivant($oResult);
                $this->id = $oRow->email_template_id;
                $this->name = $oRow->name;
                $this->to = $oRow->to;
                $this->cc = $oRow->cc;
                $this->cci = $oRow->cci;
                $this->subject = $oRow->subject;
                $this->body = $oRow->body;
                $this->code = $oRow->code;
                $this->use_advanced = $oRow->use_advanced;
                $this->oBd = $oBd;
                $this->context = $oRow->rt_emailcontext_id;
            } else
                $sErrorMsg = str_replace('[iEmailTemplateId]', $iEmailTemplateId, ERROR_0024);
        }
        if (isset($sErrorMsg))
            writeToErrorLog($sErrorMsg);
    }

    /*     * *****************************************************
      Génère le code php correspondant à l'édition simple.
      /Return : Code php (string)
     * ***************************************************** */

    function generateCode($bUseAdvanced = false) {
        $sMailModelCode = '';
        if (!$bUseAdvanced) {
            // Edition simple (récupère la valeur des balises)
            require 'vmlib/context/' . $this->context . '.inc';
        } else {
            // Edition avancée (récupère la syntaxe du code des balises)
            $sMailContextCode = file_get_contents('vmlib/context/' . $this->context . '.inc', true);
            preg_match_all('/=.+;/', $sMailContextCode, $aTagCode);
            foreach ($aTagCode[0] as $iIndex => $sTagCode) {
                $sTagCode = trim(substr($sTagCode, 1, strlen($sTagCode) - 2));
                if (preg_match('/^[^\'"]/', $sTagCode) === 1)
                    $sMailContextCode = str_replace($sTagCode, "'" . str_replace("'", "\'", $sTagCode) . "'", $sMailContextCode);
            }
            $sMailContextCode = preg_replace("/'{2,}/", "'", $sMailContextCode);
            $sMailContextCode = str_replace(array('<?php', '?>'), '', $sMailContextCode);
            eval($sMailContextCode);
        }
        // Remplace toutes les balises par les valeurs du fichier de contexte.
        if (!empty($properties)) {
            foreach ($properties as $sIndex => $aValues)
                $aContextTag[$sIndex] = $aValues['value'];
            $aEmailParameter = array('to', 'cc', 'cci', 'subject', 'body');
            foreach ($aEmailParameter as $sEmailParameter) {
                $sEmailParameterValue = str_replace("'", "\'", $this->$sEmailParameter);
                foreach ($aContextTag as $sTag => $sValue) {
                    if ($bUseAdvanced) {
                        if (substr($sValue, 0, 1) == '$')
                            $sValue = "' . $sValue . '";
                        $sEmailParameterValue = str_replace("[$sTag]", $sValue, $sEmailParameterValue);
                    } else
                        $sEmailParameterValue = str_replace("[$sTag]", str_replace("'", "\'", $sValue), $sEmailParameterValue);
                }
                $sMailModelCode .= '$this->' . $sEmailParameter . ' = \'' . $sEmailParameterValue . '\';' . PHP_EOL;
            }
        }
        return $sMailModelCode;
    }

}

?>

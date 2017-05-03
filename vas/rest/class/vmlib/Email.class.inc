<?php

require_once ("vmlib/logUtil.inc");
require_once ("PEAR/Mail.php");
require_once ("PEAR/Mail/mime.php");
require_once ("vmlib/EmailTemplate.class.inc");
require_once("gtf_lib/gtf_object/Order.class.inc");
require_once 'vmlib/error.inc';

class Email {

    protected $to;
    protected $cc;
    protected $cci;
    protected $subject;
    protected $body;
    protected $aAttachments;
    protected $mimeVersion = '1.0';
    protected $contentType = 'text/html; charset=utf-8';
    protected $from;
    protected $replyTo;
    protected $xMailer;
    protected $date;
    protected $aObjects;
    protected $aProperties;
    protected $oBd;
    public $oEmailTemplate;

    /*     * ****************************************************

     * **************************************************** */

    function __construct($oBd, $iEmailTemplateId, $aProperties, $aObjects) {
        $this->oBd = $oBd;
        $this->aProperties = $aProperties;
        $this->aObjects = $aObjects;
        $this->xMailer = array('PHP/' => phpversion());
        $this->from = $this->aProperties['nickname_sender'] . '<' . $this->aProperties['mail_sender'] . '>';
        $this->replyTo = '<>';
        $this->date = date("D, j M Y H:i:s ");

        // Sauve les attributs du mail
        $this->oEmailTemplate = new EmailTemplateLib($oBd, $iEmailTemplateId, $aProperties, $aObjects);
        if (!empty($this->oEmailTemplate->name)) {
            if (!empty($aObjects)) {
                // Si édition simple : génère le code de l'email
                if (!$this->oEmailTemplate->use_advanced)
                    $this->oEmailTemplate->code = $this->oEmailTemplate->generateCode();
                //	
                eval($this->oEmailTemplate->code);
            }
			$this->to = str_replace(chr(13), ',', $this->to);
            $this->cc = str_replace(chr(13), ',', $this->cc);
            $this->cci = str_replace(chr(13), ',', $this->cci);
            $this->to = str_replace(';', ',', $this->to);
            $this->cc = str_replace(';', ',', $this->cc);
            $this->cci = str_replace(';', ',', $this->cci);
        }
    }

    /*     * ****************************************************
      Envoi un email.
      /Retour : message
     * **************************************************** */

    function send() {
        $sErrorMessage = '';
        $crlf = ""; // \n
        //	
        $oMime = new Mail_mime(array('eol' => $crlf));
        // Pièce jointe ?	
        if (is_array($this->aAttachments) && !empty($this->aAttachments)) {
            foreach ($this->aAttachments as $sAttachment) {
                if (file_exists($sAttachment))
                    $oMime->addAttachment($sAttachment, 'application/octet-stream');
            }
        }
        //	
        $oMime->setHTMLBody('<html><body>' . $this->body . '</body></html>');
        $aMimeParams = array(
            'text_encoding' => '7bit',
            'text_charset' => 'UTF-8',
            'html_charset' => 'UTF-8',
            'head_charset' => 'UTF-8'
        );
        $sBody = $oMime->get($aMimeParams);
        //	
        $aHeaders = array(
            'From' => $this->from,
            'Date' => $this->date,
            'To' => $this->to,
            'Subject' => $this->subject,
            'cc' => $this->cc,
        );
        $aHeaders = $oMime->headers($aHeaders);
        //
		$oMail = new Mail();
		$aSmtp = $oMail->factory('smtp', array(
                    'host' => $this->aProperties["smtp_host"],
                    'port' => $this->aProperties["smtp_port"],
                    'auth' => $this->aProperties["smtp_authentification"],
                    'username' => $this->aProperties["smtp_login"],
                    'password' => $this->aProperties["smtp_password"]));
        //
        if ($this->to != '') {
            $sDestinataire = $this->to;
            if (!empty($this->cc))
                $sDestinataire .= ',' . $this->cc;
            if (!empty($this->cci))
                $sDestinataire .= ',' . $this->cci;
            $sMail = $aSmtp->send($sDestinataire, $aHeaders, $sBody);
            if (PEAR::isError($sMail)) {
                writeToErrorLog(ERROR_0023 . $this->to . '.');
                writeToErrorLog("Error message : " . $sMail->getMessage() . ".");
                writeToLog("Failed sending email to the following address : " . $this->to . ' et ' . $this->cc, $this->aProperties['mail_log_file']);
                writeToLog("Error message : " . $sMail->getMessage() . '.', $this->aProperties['mail_log_file']);
                $sErrorMessage = $sMail->getMessage();
            } else
                writeToLog("|INFORM|PHP| An email has been sent to the following address : $sDestinataire", $this->aProperties['mail_log_file']);
        }
        //	
        return $sErrorMessage;
    }

}

?>

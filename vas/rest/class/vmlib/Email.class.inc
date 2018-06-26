<?php

require_once ("vmlib/logUtil.inc");
//require_once ("PEAR/Mail.php");
//require_once ("PEAR/Mail/mime.php");
require_once ("vmlib/EmailTemplate.class.inc");
require_once("gtf_lib/gtf_object/Order.class.inc");
require_once("gtf_lib/Imap.php");
require_once 'vmlib/error.inc';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require_once 'PHPMailer/src/Exception.php';
require_once 'PHPMailer/src/PHPMailer.php';
require_once 'PHPMailer/src/SMTP.php';

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
    public $aValues;

    /*     * ****************************************************

     * **************************************************** */

    function __construct($oBd, $iEmailTemplateId, $aProperties, $aObjects) {
        $this->oBd = $oBd;
        $this->aProperties = $aProperties;
        $this->aObjects = $aObjects;
        $this->xMailer = array('PHP/' => phpversion());
        //$this->from = $this->aProperties['nickname_sender'] . '<' . $this->aProperties['mail_sender'] . '>';
        //$this->replyTo = '<>';
        //$this->date = date("D, j M Y H:i:s ");
        $this->aValues = array();

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

    /*function send() {
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
    }*/
	function send(){
        $mail = new PHPMailer;

        $mail->isSMTP();                                                // Set mailer to use SMTP
        //$mail->SMTPDebug = 3;                                         // debugger level (3 all with connection)
        $mail->Debugoutput = function($str, $level) {error_log("debug level $level; message: $str");};
        $mail->Host = $this->aProperties["smtp_host"];                  // Specify main and backup SMTP servers
        $mail->Port = $this->aProperties["smtp_port"];                  // TCP port to connect to
        $mail->SMTPAuth = $this->aProperties["smtp_authentification"];  // Enable SMTP authentication
        // if authentication add parameter to connect SMTP
        if ($this->aProperties["smtp_authentification"] === true){
            $mail->AuthType = 'LOGIN';
            $mail->Username = $this->aProperties["smtp_login"];             // SMTP username
            $mail->Password = $this->aProperties["smtp_password"];          // SMTP password
            $mail->SMTPSecure = 'tls';                                      // Enable TLS encryption, `ssl` also accepted (deprecated)
        } 

        $mail->SetFrom($this->aProperties['mail_sender'], $this->aProperties['nickname_sender']);
        // add recipients
        $aTo = explode(",", $this->to);
        if (is_array($aTo) && !empty($aTo)) {
            foreach ($aTo as $sTo) {
                error_log($sTo);
                    $mail->AddAddress($sTo);
            }
        }
        // add copy recipient
        $aCC = explode(",", $this->cc);
        if (is_array($aCC) && !empty($aCC)) {
            foreach ($aCC as $sCC) {
                    $mail->AddCC($sCC);
            }
        }

        // add CCI recipient
        $aCCI = explode(",", $this->cci);
        if (is_array($aCCI) && !empty($aCCI)) {
            foreach ($aCCI as $sCCI) {
                    $mail->AddBCC($sCCI);
            }
        }

        $mail->AddReplyTo($this->aProperties["mail_sender"], $this->aProperties["nickname_sender"]);

        $mail->IsHTML(true);                                            // Set email format to HTML
        $mail->CharSet = 'UTF-8';

        $mail->Subject = $this->subject;
        $mail->Body = /*utf8_decode*/('<html><body>' . $this->body . '</body></html>');

        // Pièce jointe ?   
        if (is_array($this->aAttachments) && !empty($this->aAttachments)) {
            foreach ($this->aAttachments as $sAttachment) {
                if (file_exists($sAttachment))
                    //$mail->addAttachment($path, $name, $encoding = 'base64', $type = 'application/octet-stream');
                    $mail->addAttachment($sAttachment);
            }
        }
        // Depuis PHP 5.6 -> vérification du certificat SSL.
        if (!$this->aProperties['proxy_check_ssl']) {
            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );
        }
        //
        if (!$mail->send()) {
            writeToErrorLog(ERROR_0023 . $this->to . '.');
            writeToErrorLog("Error message : " . $mail->ErrorInfo);
            writeToLog("|WARN|PHP|Failed sending email to the following address : " . $this->to . ' and copy to : ' . $this->cc, $this->aProperties['mail_log_file']);
                //$sErrorMessage = $sMail->getMessage();
        } else {
            writeToLog("|INFORM|PHP| An email has been sent to the following address : " . $this->to . ' and copy to : ' . $this->cc, $this->aProperties['mail_log_file']);

            if($this->aProperties['SaveSentMail'] === true){

                $imap = new Imap($this->aProperties['imapBotSender_host'], $this->aProperties['imapBotSender_port'], $this->aProperties['imapBotSender_login'], $this->aProperties['imapBotSender_pwd'], $this->aProperties['imapBotSender_encrypt']);

                if($imap->isConnected()===false){
                    writeToLog("|WARN|PHP| can't connect to the IMAP at hostname : " . $this->aProperties['imapBotSender_host'], $this->aProperties['mail_log_file']);
                }else{
                    $imap->selectFolder("Sent");
                    $imap->saveMessageInSent($mail->getSentMIMEMessage(), "");
                }
            }

        }

        return $sErrorMessage;
	}
}

?>

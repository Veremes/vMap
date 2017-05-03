<?php

require_once(__DIR__."/DbClass.class.inc");

class VitisError extends DbClass  {
		
    function __construct($iErrorId, $sMessage=""){
		$this->aFields['errorCode']=$iErrorId;	
		switch ($iErrorId){
			case 1 :
				$this->aFields['errorType']="Low-level error on database";
			break;
			case 2 :
				$this->aFields['errorType']="Missing parameter(s)";
			break;
			case 3 :
				$this->aFields['errorType']="Order not found";
			break;
			case 4 :
				$this->aFields['errorType']="Empty parameter(s)";
			break;
			case 5 :
				$this->aFields['errorType']="Empty service";
			break;
			case 6 :
				$this->aFields['errorType']="Unknown operation";
			break;
			case 7 :
				$this->aFields['errorType']="Invalid output format";
			break;
			case 8 :
				$this->aFields['errorType']="Error upload";
			break;
			case 9 :
				$this->aFields['errorType']="Error creating folder";
			break;
			case 10 :
				$this->aFields['errorType']="The application requested is not responding. Use UTF-8 to generate an XML result.";
			break;
			case 11 :
				$this->aFields['errorType']="Connection to the database forbidden";
			break;
			case 12 :
				$this->aFields['errorType']="Rights problem";
			break;
			case 13 :
				$this->aFields['errorType']="Workspace not found";
			break;
			case 14 :
				$this->aFields['errorType']="Missing operation";
			break;
			case 15 :
				$this->aFields['errorType']="Expired token";
			break;
			case 16 :
				$this->aFields['errorType']="Invalid token";
			break;
		}
		$this->aFields['errorMessage']=$sMessage; //Message renvoyé par la base de donnée
    }
}
?>
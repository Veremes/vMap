<?php

// gtf.engines/engine.php	
define('ERROR_0001', 'Impossible de récupérer les noms des moteurs GTF et FME');

// gtf_lib/DbClass.class.inc
define('ERROR_0002', 'The order creation has failed. -- ');
define('ERROR_0003', 'The order update [order_id] has failed. -- ');
define('ERROR_0004', 'The suppression order [order_id] has failed. -- ');

// gtf_object/Ldap.class.inc	
define('ERROR_0005', 'Could not connect to LDAP server.');

// gtf_object/Order.class.inc
define('ERROR_0006', "ATTENTION - Le tag du traitement n°[iOrderId] n'est associé à aucun moteur. Le tag default est utilisé pour définir le numéro de moteur.");
define('ERROR_0007', "ATTENTION - Le tag du traitement n'est associé à aucun moteur. Le tag default n'est pas non plus associé à un moteur. Parmi la liste des moteurs disponibles, le moteur n°[aGtfEngineList[0]] a été affecté à la demande de traitement n°[iOrderId]");
define('ERROR_0008', "ERROR - Aucune méthode n'a permis d'affecté un moteur au traitement. le moteur n°1 a été affecté à la demande de traitement n°[iOrderId].");
// define('ERROR_0026', 'ERROR - Parmi la liste des moteurs disponibles, le moteur n°[aGtfEngineList[0]] a été affecté à la demande de traitement n°[iOrderId]');
// define('ERROR_0009', "ERROR - L'algorithme ne permet pas de retourner un numéro de moteur exploitable. Le numéro de moteur retourné n'est pas de type entier. Type de la valeur retournée par la méthode : ");
// define('ERROR_0010', "ERROR - Le numéro du moteur retourné par l'algorithme n'existe pas dans la liste des moteurs disponible dans GTF.");
define('ERROR_0011', "Erreur Le fichier [_FILES[sNomObjet][name]] n'est pas téléchargé sur le serveur");

// veremap/DownloadMaj.class.inc
define('ERROR_0012', "Unable to write file");
define('ERROR_0013', 'Unable to download file');
define('ERROR_0014', 'Error downloading binaries');
define('ERROR_0015', "Une erreur s'est produite lors du telechargment de la mise à jour");
define('ERROR_0016', 'Unable to unzip the file ');

// veremap/FopTemplate.class.inc	
define('ERROR_0017', 'Error Pdf generation');
define('ERROR_0018', 'Command : ');
define('ERROR_0019', 'aCommand array ');
define('ERROR_0020', 'Erreur lors de la génération du Fichier Jpeg [sNameJpg] dans [sDirDestination]');
define('ERROR_0021', 'Command : ');
define('ERROR_0022', 'aCommand array ');

// vmlib\Email.class.inc
define('ERROR_0023', 'Failed sending email to the following address : ');

// vmlib\EmailTemplate.class.inc
define('ERROR_0024', 'The e-mail template (id=[iEmailTemplateId]) does not exist...');

// gtf.engines\subscription.php
define('ERROR_0025', 'Error creating directory ');

// configuration\getLicense.phtml
define('ERROR_0027', "Failed to send the mail to the following address : ");

// configuration\properties.phtml
define('ERROR_0028', "Error writing file properties.inc");
define('ERROR_0029', 'Le formulaire de properties passé en paramètre est vide!');

// forms\widget.phtml
define('ERROR_0030', 'invalid token.');

// workspace\importWorkspaces.phtml	
define('ERROR_0031', 'Erreur lors de la copie du fichier FMW : ');
define('ERROR_0032', "Le fichier SubForm.class.inc du traitement [sLabelName] n'a pas été généré.");

// vmlib\dbUtil.inc
define('ERROR_0033', 'Invalid credentials'); // -> TEXT_INVALID_CREDENTIALS
?>
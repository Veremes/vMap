<?php

// Adresse email du demandeur
$properties['order.user.email']['value'] = $this->aObjects["oOrder"]->getUser()->aFields['email'];
$properties['order.user.email']['fr'] = "Adresse email du demandeur";
$properties['order.user.email']['en'] = "Adresse email du demandeur";

// Nom du demandeur du traitement
$properties['order.user.name']['value'] = $this->aObjects["oOrder"]->getUser()->aFields['name'];
$properties['order.user.name']['fr'] = "Nom du demandeur du traitement";
$properties['order.user.name']['en'] = "Nom du demandeur du traitement";

// Compte de connexion du demandeur du traitement
$properties['order.user.login']['value'] = $this->aObjects["oOrder"]->getUser()->aFields['login'];
$properties['order.user.login']['fr'] = "Compte du demandeur du traitement";
$properties['order.user.login']['en'] = "Compte du demandeur du traitement";

// Date et heure de la demande
$properties['order.order_date']['value'] = $this->aObjects["oOrder"]->aFields['order_date'];
$properties['order.order_date']['fr'] = "Date et heure de la demande de traitement";
$properties['order.order_date']['en'] = "Date et heure de la demande de traitement";

// Url de téléchargement du résultat
$properties['order.result_url']['value'] = $this->aObjects["oOrder"]->aFields['result_url'];
$properties['order.result_url']['fr'] = "Url de téléchargement du résultat";
$properties['order.result_url']['en'] = "Url de téléchargement du résultat";

// Url de téléchargement du log
$properties['order.log_url']['value'] = $this->aObjects["oOrder"]->aFields['log_url'];
$properties['order.log_url']['fr'] = "Url de téléchargement du fichier de log";
$properties['order.log_url']['en'] = "Url de téléchargement du fichier de log";

// Identifiant de la demande de traitement
$properties['order.order_id']['value'] = $this->aObjects["oOrder"]->aFields['order_id'];
$properties['order.order_id']['fr'] = "Identifiant de la demande de traitement";
$properties['order.order_id']['en'] = "Identifiant de la demande de traitement";

//	Nom du traitement 
$properties['order.workspace.name']['value'] = $this->aObjects["oOrder"]->getWorkspace()->aFields['name'];
$properties['order.workspace.name']['fr'] = "Nom du traitement";
$properties['order.workspace.name']['en'] = "Nom du traitement";

//	Catégorie du traitement
$properties['order.workspace.category.name']['value'] = $this->aObjects["oOrder"]->getWorkspace()->getCategory()->aFields['name'];
$properties['order.workspace.category.name']['fr'] = "Catégorie du traitement";
$properties['order.workspace.category.name']['en'] = "Catégorie du traitement";

// Durée du traitement
$properties['order.length_sec']['value'] = $this->aObjects["oOrder"]->aFields['length_sec'];
$properties['order.length_sec']['fr'] = "Durée du traitement en secondes";
$properties['order.length_sec']['en'] = "Durée du traitement";

// Date et heure de fin de traitement
$properties['order.execution_date']['value'] = $this->aObjects["oOrder"]->aFields['execution_date'];
$properties['order.execution_date']['fr'] = "Date et heure de fin de traitement";
$properties['order.execution_date']['en'] = "Date et heure de fin de traitement";

//Adresse mail du destinataire en copie 
$properties['order.email_notifications']['value'] = $this->aObjects["oOrder"]->aFields['email_notifications'];
$properties['order.email_notifications']['fr'] = "Adresse email du destinataire en copie du mail";
$properties['order.email_notifications']['en'] = "Adresse email du destinataire en copie du mail";
?>
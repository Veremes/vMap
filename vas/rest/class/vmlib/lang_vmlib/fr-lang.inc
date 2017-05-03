<?php

define('USER_LABEL', 'Utilisateur : ');
define('ERROR_LABEL', '<br>Erreur : ');
define('ERROR_REQUEST_IMPOSSIBLE', 'Impossible d\'exécuter la requête : ');

//logUtil
define('ERROR_IMPOSSIBLE_WRITE', 'Impossible d\'écrire dans le fichier ');
define('ERROR_RIGHTS_ON_FILE', ' : l\'application ne dispose pas de droits en écriture sur le fichier');
define('ERROR_WRITING_FILE', ' : échec de l\'écriture');

//BD.class
define('ERROR_INCORRECT_SGBD', 'Le sgbd spécifié n\'est pas correct.\n Connexion à la base impossible.');
define('ERROR_ACCESS_SERVER', 'Accès au serveur impossible pour :');
define('ERROR_CONNECT_SERVER', 'Connexion au serveur impossible\n');
define('ERROR_SGBD_UNDEFINED', 'Vous n\'avez pas spécifié votre sgbd.\n Connexion à la base impossible.');
define('RETURN_BD_LABEL', 'Le serveur renvoit : ');
define('ATTRIBUT_POSITION_BD_LABEL', '"Il n\'y a pas d\'attribut en position $position');
define('UNKNOWN_BD_LABEL', 'Inconnu');

//dateUtil
define('ERROR_DATE_FORMAT_INCOMPATIBLE', 'Format de date incompatible avec la date fournie');
define('ERROR_DAY_NOT_FOUND', 'Les jours n\'ont pas été trouvés... Les jours doivent être précisés par \'jj\' ou par \'j\' (ex: jj/mm/aaaa)');
define('ERROR_MONTH_NOT_FOUND', 'Les mois n\'ont pas été trouvés... Les mois doivent être précisés par \'mm\' ou par \'m\' (ex: jj/mm/aaaa)');
define('ERROR_YEAR_NOT_FOUND', 'Les années n\'ont pas été trouvés... Les années doivent être précisés par \'aaaa\' ou par \'aa\' (ex: jj/mm/aaaa)');
define('ERROR_HOUR_NOT_FOUND', 'Les heures n\'ont pas été trouvées... Les heures doivent être précisées par \'hh\' ou \'h\' (ex: jj/mm/aaaa hh:ii:ss)');
define('ERROR_MINUTE_NOT_FOUND', 'Les minutes n\'ont pas été trouvées... Les minutes doivent être précisées par \'ii\' ou \'i\' (ex: jj/mm/aaaa hh:ii:ss)');
define('ERROR_SECOND_NOT_FOUND', 'Les secondes n\'ont pas été trouvées... Les secondes doivent être précisés par \'ss\' ou \'s\' (ex: jj/mm/aaaa hh:ii:ss)');

//dbUtil
define('ERROR_DECODE_EMPTY_STRING', 'Erreur : La chaine à décoder est vide');
define('ERROR_CONNECTION_PROBLEM', 'Problème de connexion :');

//Formulaire
define('ENLARGE_INPUT_FORMULAIRE_LABEL', 'Agrandir la zone de saisie');
define('DECREASE_INPUT_FORMULAIRE_LABEL', 'Diminuer la zone de saisie');
define('PALLET_FORMULAIRE_LABEL', 'palette');
define('SYMBOL_FORMULAIRE_LABEL', 'symboles');
define('FONT_FORMULAIRE_LABEL', 'polices');
define('ASSISTANT_FORMULAIRE_LABEL', 'assistant');
define('MOVE_RIGHT_FORMULAIRE_LABEL', 'Déplacer à droite');
define('MOVE_LEFT_FORMULAIRE_LABEL', 'Déplacer à gauche');
define('ERROR_UNKNOWN_TYPE', 'ERREUR: $pType est un type inconnu\n');
define('DELETE_FORMULAIRE_LABEL', 'Supprimer');
define('ADD_FORMULAIRE_LABEL', 'Ajouter');
define('SHOW_CALENDAR_FORMULAIRE_LABEL', 'Afficher le calendrier');
define('CALENDAR_FORMULAIRE_LABEL', 'Calendrier');
define('VALIDATE_FORMULAIRE_LABEL', 'Valider');
define('CANCEL_FORMULAIRE_LABEL', 'Annuler');
define('NO_DOCUMENT_FORMULAIRE_LABEL', 'Aucun document');

//formVerif
define('INPUT_FORMVERIF_LABEL', 'Le champ');
define('NOT_NULL_FORMVERIF_LABEL', 'ne doit pas être \"NULL\".');
define('NOT_CORRESPOND_FORMVERIF_LABEL', 'ne correspond pas a ');
define('NOT_NUMERIC_FORMVERIF_LABEL', 'doit être de type numérique.');
define('NOT_INTEGER_FORMVERIF_LABEL', 'doit être de type entier.');
define('NOT_DECIMAL_FORMVERIF_LABEL', 'doit être de type entier décimal.');
define('NOT_DATE_FORMVERIF_LABEL', 'doit être de type date ');
define('NOT_SPACE_FORMVERIF_LABEL', 'ne doit pas contenir d\'espaces ou de caractères spéciaux (\'point\' accepté).');
define('NOT_EXTENSION_FORMVERIF_LABEL', 'interdit l\'upload de fichiers d\'extension ');
define('NOT_CONTAINS_FORMVERIF_LABEL', 'ne doit pas contenir : ');

//ldap
define('ERROR_USER_NOT_FOUND_LDAP', 'Connexion refusée. L\'utilisateur [LOGIN] n\'a pas été trouvé dans l\'Active Directory.');
define('ERROR_CONNECT_LDAP', 'Connexion impossible. Impossible de se connecter au serveur de l\'Active Directory.');
define('ERROR_LDAP_FAILED', 'Connexion LDAP échouée');

//vm
define('NOT_RECORD_FOUND_VM', 'Aucun enregistrement de ce type n\'a été trouvé');
define('WARNING_DELETE_VM_01', '\'Attention ! l\\\'enregistrement n° ');
define('WARNING_DELETE_VM_02', ' va être supprimé.');

//phpUtil
define('ERROR_DOWNLOAD_FILE', 'Erreur lors du téléchargement du fichier ');
define('ERROR_UPLOAD_MAX_FILE_SIZE', 'il excède la taille de upload_max_filesize, configurée dans le php.ini');
define('ERROR_MAX_FILE_SIZE', 'il excède la taille de MAX_FILE_SIZE, qui a été spécifiée dans le formulaire HTML.');
define('ERROR_NO_FILE_DOWNLOADED', 'Aucun fichier n\'a été téléchargé.');
define('ERROR_PARTIAL_DOWNLOAD', 'il n\'a été que partiellement téléchargé.');
define('ERROR_MISSING_TEMP_FOLDER', 'un dossier temporaire est manquant.');
define('ERROR_WRITING_DISK', 'échec de l\'écriture du fichier sur le disque.');
define('ERROR_PHP_EXT_SEND', 'une extension PHP a arrété l\'envoi de fichier.');
define('ERROR_FILE', 'Erreur Le fichier ');
define('ERROR_NOT_FILE', ' n\'est pas un fichier ');
define('FILE_LABEL_PHPUTIL', 'Le fichier ');
define('ERROR_VALID_FILE', ' valide.<br> Les formats autorisés sont :');
define('OF_LABEL_PHPUTIL', ' de ');
define('ERROR_EXCEED_MAX_SIZE', ' octets dépasse la taille maximale autorisée');
define('LABEL_BYTES_PHPUTIL', ' octets');
define('ERROR_EXCEED_MAX_SIZE_PHP', ' dépasse la taille maximale autorisée par la configuration PHP');
define('ERROR_COPYING_FILE', 'Erreur lors de la copie du fichier ');
define('ON_SERVER_PHPUTIL', ' sur le serveur');
define('ERROR_DOWNLOAD_SERVER', ' n\'est pas téléchargé sur le serveur');
define('ERROR_CODE_PHPUTIL', 'Code erreur : ');
define('ERROR_DAY_CODE', 'Le code du jour "');
define('ERROR_CODE_NOT_VALID', '" n\'est pas valide');
define('ERROR_NOT_INF', 'Il ne doit pas être inférieure à ');
define('ERROR_NOT_SUP', ' et supérieure à ');
define('ERROR_DAY_WEEK', 'Vous ne pouvez pas définir un mois et un jour ou un jour de la semaine.');
define('ERROR_MONTH_CODE', 'Le code du mois "');
define('ERROR_NUMBER_PHPUTIL', 'Il ne peut pas être un nombre.');
define('ERROR_WEEK_CODE', 'Le code du jour de la semaine "');
define('ERROR_CODE_3_VALUES', 'Le code ne contient pas trois valeurs séparées par un espace.');

define('YES', 'Oui');
define('NO', 'Non');

define('SUCCESS_REQUEST', htmlentities("Requête exécutée avec succés."));
define('FAILED_REQUEST', htmlentities("Erreur lors de l'exécution de la requête. Erreur HTTP : "));

// genericTreeviewField()
define('HTMLFORM_GENERIC_TREEVIEW_FIELD_TITLE', htmlentities("Aperçu de votre sélection", ENT_COMPAT | ENT_HTML401, $encodage));
?>
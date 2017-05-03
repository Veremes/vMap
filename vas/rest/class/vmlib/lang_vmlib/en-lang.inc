<?php

define('USER_LABEL', 'User: ');
define('ERROR_LABEL', '<br>Error: ');

//logUtil
define('ERROR_IMPOSSIBLE_WRITE', 'Impossible to write in the file ');
define('ERROR_RIGHTS_ON_FILE', ': the application does not arrange rights in writing on the file');
define('ERROR_WRITING_FILE', ': failure of the writing');

//BD.class
define('ERROR_INCORRECT_SGBD', 'The dbms is not correct.\n Connection to the database impossible.');
define('ERROR_ACCESS_SERVER', 'Access to the server impossible for:');
define('ERROR_CONNECT_SERVER', 'Connection to the server impossible\n');
define('ERROR_SGBD_UNDEFINED', 'You have not specified the dbms.\n Connection to the database impossible.');
define('ERROR_REQUEST_IMPOSSIBLE', 'Execution of the request impossible: ');
define('RETURN_BD_LABEL', 'The server return: ');
define('ATTRIBUT_POSITION_BD_LABEL', '"There is not attribute in order $position');
define('UNKNOWN_BD_LABEL', 'Unknown');

//dateUtil
define('ERROR_DATE_FORMAT_INCOMPATIBLE', 'Format of date incompatible with supplied date');
define('ERROR_DAY_NOT_FOUND', 'Days were not found... Days must be specified by \'jj\' or by \'j\' (ex: jj/mm/aaaa)');
define('ERROR_MONTH_NOT_FOUND', 'Monthes were not found... Monthes must be specified by \'mm\' or by \'m\' (ex: jj/mm/aaaa)');
define('ERROR_YEAR_NOT_FOUND', 'Years were not found... Years must be specified by \'aaaa\' or by \'aa\' (ex: jj/mm/aaaa)');
define('ERROR_HOUR_NOT_FOUND', 'Hours were not found... Hours must be specified by \'hh\' or by \'h\' (ex: jj/mm/aaaa hh:ii:ss)');
define('ERROR_MINUTE_NOT_FOUND', 'Minutes were not found... Minutes must be specified by \'ii\' or by \'i\' (ex: jj/mm/aaaa hh:ii:ss)');
define('ERROR_SECOND_NOT_FOUND', 'Seconds were not found... Seconds must be specified by \'ss\' or by \'s\' (ex: jj/mm/aaaa hh:ii:ss)');

//dbUtil
define('ERROR_DECODE_EMPTY_STRING', 'Error: The string to be decoded is empty');
define('ERROR_CONNECTION_PROBLEM', 'Problem of connection:');

//Formulaire
define('ENLARGE_INPUT_FORMULAIRE_LABEL', 'Enlarge the input field');
define('DECREASE_INPUT_FORMULAIRE_LABEL', 'Decrease the input field');
define('PALLET_FORMULAIRE_LABEL', 'pallet');
define('SYMBOL_FORMULAIRE_LABEL', 'symbols');
define('FONT_FORMULAIRE_LABEL', 'fonts');
define('ASSISTANT_FORMULAIRE_LABEL', 'assistant');
define('MOVE_RIGHT_FORMULAIRE_LABEL', 'Move to the right');
define('MOVE_LEFT_FORMULAIRE_LABEL', 'Move to the left');
define('ERROR_UNKNOWN_TYPE', 'ERROR: $pType is an unknown type\n');
define('DELETE_FORMULAIRE_LABEL', 'Delete');
define('ADD_FORMULAIRE_LABEL', 'Add');
define('SHOW_CALENDAR_FORMULAIRE_LABEL', 'Show calendar');
define('CALENDAR_FORMULAIRE_LABEL', 'Calendar');
define('VALIDATE_FORMULAIRE_LABEL', 'Validate');
define('CANCEL_FORMULAIRE_LABEL', 'Cancel');
define('NO_DOCUMENT_FORMULAIRE_LABEL', 'No document');

//formVerif
define('INPUT_FORMVERIF_LABEL', 'The field');
define('NOT_NULL_FORMVERIF_LABEL', 'must not be \"NULL\".');
define('NOT_CORRESPOND_FORMVERIF_LABEL', 'does not correspond at ');
define('NOT_NUMERIC_FORMVERIF_LABEL', 'must be numeric.');
define('NOT_INTEGER_FORMVERIF_LABEL', 'must be an integer.');
define('NOT_DECIMAL_FORMVERIF_LABEL', 'must be a decimal.');
define('NOT_DATE_FORMVERIF_LABEL', 'must ba a date ');
define('NOT_SPACE_FORMVERIF_LABEL', 'does not have to contain of spaces or special characters (accepted \'point\').');
define('NOT_EXTENSION_FORMVERIF_LABEL', 'forbids the upload of files of extension ');
define('NOT_CONTAINS_FORMVERIF_LABEL', 'does not have to contain: ');

//ldap
define('ERROR_USER_NOT_FOUND_LDAP', 'Refused connection. The user [LOGIN] was not found in Active Directory.');
define('ERROR_CONNECT_LDAP', 'Impossible connection. Impossible to connect to the server of Active Directory.');
define('ERROR_LDAP_FAILED', 'Failed connection LDAP');

//vm
define('NOT_RECORD_FOUND_VM', 'No recording of this type was found');
define('WARNING_DELETE_VM_01', '\'Warning! The recording N ');
define('WARNING_DELETE_VM_02', ' is going to be deleted.');

//phpUtil
define('ERROR_DOWNLOAD_FILE', 'Erreur downloading file ');
define('ERROR_UPLOAD_MAX_FILE_SIZE', 'it exceeds the size of upload_max_filesize, configured in the php.ini');
define('ERROR_MAX_FILE_SIZE', 'it exceeds the size of MAX_FILE_SIZE, which was specified in the HTML form.');
define('ERROR_NO_FILE_DOWNLOADED', 'No file was downloaded.');
define('ERROR_PARTIAL_DOWNLOAD', 'It had only partially downloaded.');
define('ERROR_MISSING_TEMP_FOLDER', 'a temporary folder is missing.');
define('ERROR_WRITING_DISK', 'Failure of the writing of the file on the disk.');
define('ERROR_PHP_EXT_SEND', 'a PHP extension stopped the sending of file.');
define('ERROR_FILE', 'Error the file ');
define('ERROr_NOT_FILE', ' is not a file ');
define('FILE_LABEL_PHPUTIL', 'The file ');
define('ERROR_VALID_FILE', ' valid.<br> The authorized formats are:');
define('OF_LABEL_PHPUTIL', ' of ');
define('ERROR_EXCEED_MAX_SIZE', ' bytes exceeds the authorized maximal size');
define('LABEL_BYTES_PHPUTIL', ' bytes');
define('ERROR_EXCEED_MAX_SIZE_PHP', '  exceeds the authorized maximal size by the PHP configuration');
define('ERROR_COPYING_FILE', 'Error during the file copy ');
define('ON_SERVER_PHPUTIL', ' on the server');
define('ERROR_DOWNLOAD_SERVER', ' is not downloaded on the server');
define('ERROR_CODE_PHPUTIL', 'Error code: ');
define('ERROR_DAY_CODE', 'The day code "');
define('ERROR_CODE_NOT_VALID', 'is not valid');
define('ERROR_NOT_INF', 'He was have to be lower in ');
define('ERROR_NOT_SUP', ' and supérior in ');
define('ERROR_DAY_WEEK', 'You cannot define one month and a day or a day of the week.');
define('ERROR_MONTH_CODE', 'The month code "');
define('ERROR_NUMBER_PHPUTIL', 'It can\'t be a number.');
define('ERROR_WEEK_CODE', 'The day code of the week "');
define('ERROR_CODE_3_VALUES', 'The code does not contain three values separated by a space.');

define('YES', 'Yes');
define('NO', 'No');

define('SUCCESS_REQUEST', htmlentities("Request processed successfully"));
define('FAILED_REQUEST', htmlentities("Error during request processing. HTTP error:"));

// genericTreeviewField()
define('HTMLFORM_GENERIC_TREEVIEW_FIELD_TITLE', htmlentities("Aperçu de votre sélection", ENT_COMPAT | ENT_HTML401, $encodage));
?>
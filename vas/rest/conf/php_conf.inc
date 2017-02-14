<?php
//Définition de l'include path
set_include_path(get_include_path() . PATH_SEPARATOR . $properties['vas_home']."/rest/class");
//Définition de l'utilisation de cookies pour les variables de sessions
ini_set("session.use_cookies", 1);
ini_set("upload_tmp_dir", $properties["extract_dir"]);
//Définition de la portée des cookies et de leur durée de vie
if (isset($properties["cookie_path"]))
    session_set_cookie_params($properties["cookie_lifetime"], $properties["cookie_path"]);
// max_execution_time
ini_set("max_execution_time", $properties["max_execution_time"]);
// error_log
ini_set("error_log", $properties['vas_home']."/server/php/log/php_".date('Y-m').".log");
?>
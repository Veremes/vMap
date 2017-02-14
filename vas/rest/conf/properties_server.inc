<?php
$properties['vas_home'] = '[VAS_HOME]';
$properties['sgbd'] = 'pgsql';
$properties['database'] = '[DATABASE]';
$properties['server'] = '[SERVER]';
$properties['port'] = [PORT];
$properties['schema_framework'] = 's_vitis';
$properties['web_server_name'] = 'https://'.$_SERVER["HTTP_HOST"];
$properties['log_directories'] ['Apache'] = "[APACHE]/logs";
$properties['log_directories'] ['Php'] = $properties['vas_home']."/server/php/log";
$properties['log_directories'] ['Application'] = $properties['vas_home']."/log";
?>
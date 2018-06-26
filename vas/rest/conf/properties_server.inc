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
$properties['websocket_server'] = '127.0.0.1';
$properties['websocket_port'] = [WEBSOCKET_PORT];
$properties['websocket_alias'] = 'websocket[ENV]';
$properties['environment_alias'] = '[ENV]';
$properties["vitis_owner_login"] = 'u_vitis';
$properties["vitis_owner_pass"] = '[U_VITIS_PASSWORD]';
?>

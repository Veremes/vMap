<?php
$properties['page_encoding'] = 'UTF-8';
$properties["log_delim"] = HT;
$properties['log_dir'] = $properties['vas_home'] . '/log/web';
$properties['sql_log_file'] = $properties['log_dir'] . '/' . date($properties["log_period"]) . '/sql.log';
$properties['error_log_file'] = $properties['log_dir'] . '/error.log';
$properties['connexion_log_file'] = $properties['log_dir'] . '/' . date($properties["log_period"]) . '/connexion.log';
$properties['debug_log_file'] = $properties['log_dir'] . '/' . date($properties["log_period"]) . '/debug.log';
$properties['upload_dir'] = $properties['vas_home'] . '/upload';
$properties['login'] = 'u_scheduler';
$properties['convert_utf8'] = false;
$properties['dir_export'] = $properties['vas_home'] . '/public';
$properties['url_export'] = $properties['web_server_name'] . '/' . $properties['public_alias'];
$properties['ws_data_dir'] = $properties['vas_home'] . '/ws_data';

?>
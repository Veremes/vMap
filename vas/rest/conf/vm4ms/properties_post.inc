<?php

$properties['map_dir'] = $properties['vas_home'] . '/ws_data/vm4ms/map';
$properties['map_url'] = $properties['web_server_name'] . '/' . $properties['ws_data_alias'] . '/vm4ms/map';
$properties['private_wms_service'] = 'private';
$properties['ms_debug_mode'] = 2;
$properties['ms_cgi_url'] = $properties['web_server_name'] . '/' . $properties['mapserver_alias'];
$properties['ms_log_dir'] = "{$properties['vas_home']}/log/mapserver";
?>
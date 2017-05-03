<?php

$aAdminFields = Array(
    'schema_vm4ms',
    'ms_cgi_url',
    'test_wms_service',
    'map_dir',
    'map_url',
    'private_wms_service',
    'ms_debug_mode',
    'log_directories.MapServer',
    'mapserver_alias',
    'ms_log_dir', 
    'test_wms_service_default_content'
);
$aUserFields = Array(
    'ms_cgi_url',
    'test_wms_service',
    'map_dir',
    'map_url',
    'private_wms_service',
    'ms_debug_mode',
    'mapserver_alias',
    'ms_log_dir'
);

$properties['aAdminFields'] = array_merge($properties['aAdminFields'], $aAdminFields);
$properties['aUserFields'] = array_merge($properties['aUserFields'], $aUserFields);
?>
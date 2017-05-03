<?php

$aAdminFields = Array(
    'fop_root_dir',
    'phantomjs_root_path',
    'schema_vmap',
    'printserver_alias',
    'api_veremap',
    'use_veremap_api',
    'use_vm4ms_api',
    'vmap.*',
    'popup.*',
    'controls.*',
    'selection.*',
    'print.*',
    'cadastre.api'
);
$aUserFields = Array(
    'phantomjs_root_path',
    'printserver_alias',
    'api_veremap',
    'use_veremap_api',
    'use_vm4ms_api',
    'vmap.*',
    'popup.*',
    'controls.*',
    'selection.*',
    'print.*',
    'cadastre.api'
);

$properties['aAdminFields'] = array_merge($properties['aAdminFields'], $aAdminFields);
$properties['aUserFields'] = array_merge($properties['aUserFields'], $aUserFields);
?>
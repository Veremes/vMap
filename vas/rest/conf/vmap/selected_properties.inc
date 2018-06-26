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
    'snapping.*',
    'print.*',
    'cadastre.api',
    'vmap_geocoders',
    'vmap_default_geocoders',
    'use_proxy_for_tiles',
    'vmap_export.*'
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
    'snapping.*',
    'print.*',
    'cadastre.api',
    'vmap_geocoders',
    'vmap_default_geocoders',
    'use_proxy_for_tiles',
    'vmap_export.*'
);

$properties['aAdminFields'] = array_merge($properties['aAdminFields'], $aAdminFields);
$properties['aUserFields'] = array_merge($properties['aUserFields'], $aUserFields);
?>

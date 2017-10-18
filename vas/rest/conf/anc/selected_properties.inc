<?php

$aAdminFields = Array(
    'schema_anc',
    'anc.*'
);
$aUserFields = Array(
    'schema_anc',
    'anc.*'
);

$properties['aAdminFields'] = array_merge($properties['aAdminFields'], $aAdminFields);
$properties['aUserFields'] = array_merge($properties['aUserFields'], $aUserFields);
?>
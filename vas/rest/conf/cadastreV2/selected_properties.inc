<?php

$aAdminFields = Array(
    'schema_cadastre',
    'schema_majic',
    'cadastre.selection_limit',
    'cadastre.rp.rp_url',
    'cadastre.database_projection',
    'cadastre.descr_parcel.intersect.*',
    'cadastre.fiche_urb.*',
    'cadastre.view.bati',
    'cadastre.fiche_urb.intersect.*'
);
$aUserFields = Array(
    'cadastre.selection_limit',
    'cadastre.rp.rp_url',
    'cadastre.database_projection',
    'cadastre.descr_parcel.intersect.*',
    'cadastre.fiche_urb.*',
    'cadastre.view.bati',
    'cadastre.fiche_urb.intersect.*'
);

$properties['aAdminFields'] = array_merge($properties['aAdminFields'], $aAdminFields);
$properties['aUserFields'] = array_merge($properties['aUserFields'], $aUserFields);
?>
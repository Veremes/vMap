<?php
$properties['schema_vmap'] = 's_vmap';
$properties['use_proxy_for_tiles'] = false;
$properties["cadastre"]["api"] = "cadastreV2";
$properties['print']['equality_timeout'] = 1000;
$properties['print']['tile_size'] = 1024;
$properties['print']['features_zoom'] = 100;
$properties['print']['quality'] = 100;
$properties["use_veremap_api"] = false;
$properties["use_vm4ms_api"] = true;
$properties["owner_login"] = 'u_vitis';
$properties["owner_pass"] = '';
$properties['vmap_log_dir'] = "{$properties['vas_home']}/log/vmap";
$properties['vmap_map_log_file'] = $properties['vmap_log_dir'] . '/map/' . date($properties["log_period"]) . '/map.log';
$properties['vmap_geocoders'] = '{"osm":{"title":"OpenStreetMap","url":"https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=[limit]&extratags=1&namedetails=1&polygon_geojson=1&countrycodes=fr&q=[search]","data_field":"data","title_field":"display_name","geojson_field":"geojson","summary_fields":[{"key":"address.country","label":"Pays"},{"key":"address.state","label":"Région"},{"key":"address.postcode","label":"Code postal"},{"key":"extratags.population","label":"Population"}]},"national_adresse":{"title":"Base nationale","url":"https://api-adresse.data.gouv.fr/search/?q=[search]&limit=[limit]","data_field":"data.features","title_field":"properties.label","geojson_field":"geometry","summary_fields":[{"key":"properties.context","label":"Département"},{"key":"properties.city","label":"Ville"},{"key":"properties.postcode","label":"Code postal"}]}}';
$properties['vmap_default_geocoders'] = 'osm';
?>

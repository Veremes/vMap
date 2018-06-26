<?php

$aSql['getAvaliableSRID'] = "SELECT srid from spatial_ref_sys";
$aSql['getLayers'] = "SELECT * FROM s_vmap.v_layer";
$aSql['getLayersById'] = "SELECT * FROM s_vmap.v_layer WHERE layer_id IN ([idList])";
$aSql['getLayersByName'] = "SELECT * FROM s_vmap.v_layer WHERE name IN ([namesList])";
$aSql['getBusinessObjects'] = "SELECT \"business_object_id\", \"database\", \"schema\", \"table\", \"id_field\" FROM s_vmap.business_object";
$aSql['getBusinessObjectByIds'] = "SELECT * FROM s_vmap.business_object WHERE business_object_id IN ([idList])";
$aSql['getGeometryColumns'] = 'SELECT f_geometry_column FROM public.geometry_columns WHERE f_table_schema = \'[sSchemaFramework]\' AND f_table_name = \'[sTable]\'';
$aSql['updateTableColumnSRID'] = 'SELECT UpdateAndTransformGeometrySRID([sSchema], [sTable], [sColumn], [iSRID]);';
$aSql['getTables'] = "SELECT tablename, schemaname FROM pg_catalog.pg_tables WHERE schemaname = [sSchema]";
$aSql['getViews'] = "SELECT viewname, schemaname FROM pg_catalog.pg_views  WHERE schemaname = [sSchema]";
$aSql['getSequences'] = "SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = [sSchema]";

?>
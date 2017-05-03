<?php
//Définition des requêtes de l'api Vitis
$aSql['checkIP'] = "SELECT user_id, ip_constraint FROM [sSchemaFramework].user WHERE login ='[sLogin]'";
$aSql['getGroups'] = "SELECT group_id FROM [sSchemaFramework].user_group WHERE user_id = [user_id]";
$aSql['loginUnique'] = 'SELECT UPPER("login") FROM [sSchemaFramework]."user" WHERE UPPER("login")=UPPER(\'sLoginUser\')';
$aSql['getLoginbyId'] = 'SELECT "login" FROM [sSchemaFramework]."user" WHERE user_id=[user_id]';
$aSql['getTableColumn'] = 'SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema = \'[sSchemaFramework]\' and table_name= \'[sTable]\'';
$aSql['getUserPrivileges'] = 'SELECT groname FROM pg_user s LEFT OUTER JOIN pg_group g on (s.usesysid = any(g.grolist) )inner join [sSchemaFramework].user on "user".login = usename WHERE user_id = [user_id]';
$aSql['listDomain'] = 'SELECT distinct domain, alias FROM [sSchemaFramework].domain WHERE "type" = \'AD\'';
$aSql['createRolname'] = 'CREATE ROLE "vitis_[sDomain]" NOSUPERUSER INHERIT NOCREATEDB CREATEROLE;';
$aSql['getInfoRolname'] = 'SELECT * FROM pg_authid WHERE rolname = \'vitis_[sDomain]\'';
// Layers
$aSql['getLayerWmsServices'] = "SELECT DISTINCT wmsservice_id FROM [sSchemaVm4ms].wmsservice_ms_layer WHERE ms_layer_id = '[ms_layer_id]' ORDER BY wmsservice_id";
$aSql['insertLayerWmsServices'] = "INSERT INTO [sSchemaVm4ms].wmsservice_ms_layer(wmsservice_id, ms_layer_id) VALUES('[wmsservice_id]', '[ms_layer_id]')";
$aSql['getLayer'] = "SELECT ms_layer.ms_layer_id, ms_layer.name, ms_layer.title, ms_layer.coordsys_id, coordsys.label as coordsys_label, ms_layer.source_id, ms_layer.connection_id, ms_layer.tableschema, ms_layer.tablename, ms_layer.tableidfield, ms_layer.definition, ms_layer.active, ms_layer.opacity, ms_layer.ms_layertype_id , COALESCE(connection.private, false) AS private_connection, connection.name AS connection_label, source.name AS source_label, ms_layer.definitiontmp, connection.database AS database FROM [sSchemaVm4ms].ms_layer LEFT JOIN [sSchemaVm4ms].connection ON connection.connection_id = ms_layer.connection_id LEFT JOIN [sSchemaVm4ms].source ON source.source_id = ms_layer.source_id LEFT JOIN [sSchemaVm4ms].coordsys ON coordsys.coordsys_id = ms_layer.coordsys_id WHERE ms_layer_id = [ms_layer_id]";
$aSql['getDefaultLayerId'] = "SELECT ms_layer_id FROM [sSchemaVm4ms].ms_layer WHERE name = (SELECT name FROM [sSchemaVm4ms].ms_layer WHERE ms_layer_id = [ms_layer_id])";
$aSql['getLayerName'] = "SELECT name FROM [sSchemaVm4ms].ms_layer WHERE ms_layer_id = [ms_layer_id]";
$aSql['publishLayerDefinition'] = "UPDATE s_vm4ms.ms_layer SET definition = definitiontmp WHERE ms_layer_id = [ms_layer_id]";
$aSql['getConnectionType'] = "SELECT private FROM [sSchemaVm4ms].connection WHERE connection_id = [connection_id]";
// WmsServices
$aSql['insertWmsServiceLayers'] = "INSERT INTO [sSchemaVm4ms].wmsservice_ms_layer(wmsservice_id, ms_layer_id) VALUES('[wmsservice_id]', '[ms_layer_id]')";
$aSql['deleteWmsServiceLayers'] = "DELETE FROM [sSchemaVm4ms].wmsservice_ms_layer WHERE wmsservice_id='[wmsservice_id]' AND ms_layer_id IN ([idList])";
$aSql['getWmsServiceLayersSource'] = "SELECT wmsservice_ms_layer.wmsservice_id, ms_layer.name, source.name as source FROM [sSchemaVm4ms].wmsservice_ms_layer LEFT JOIN [sSchemaVm4ms].ms_layer ON ms_layer.ms_layer_id = wmsservice_ms_layer.ms_layer_id LEFT JOIN [sSchemaVm4ms].source ON source.source_id = ms_layer.source_id WHERE wmsservice_id = '[wmsservice_id]'";
$aSql['getPrivateLayersSource'] = "SELECT ms_layer.name, source.name as source FROM [sSchemaVm4ms].ms_layer LEFT JOIN [sSchemaVm4ms].source ON source.source_id = ms_layer.source_id LEFT JOIN [sSchemaVm4ms].connection ON connection.connection_id = ms_layer.connection_id WHERE connection.private = true";
?>
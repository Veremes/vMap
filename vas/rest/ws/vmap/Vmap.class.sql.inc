<?php
//Définition des requêtes de l'api Vitis
$aSql['checkIP'] = "SELECT user_id, ip_constraint FROM [sSchemaFramework].v_user WHERE login ='[sLogin]'";
$aSql['getGroups'] = "SELECT group_id FROM [sSchemaFramework].v_user_group_by_rights WHERE user_id = [user_id]";
$aSql['loginUnique'] = 'SELECT UPPER("login") FROM [sSchemaFramework]."v_user" WHERE UPPER("login")=UPPER(\'sLoginUser\')';
$aSql['getLoginbyId'] = 'SELECT "login" FROM [sSchemaFramework]."v_user" WHERE user_id=[user_id]';
$aSql['getTableColumn'] = 'SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema = \'[sSchemaFramework]\' and table_name= \'[sTable]\'';
$aSql['getUserPrivileges'] = 'SELECT groname FROM pg_user s LEFT OUTER JOIN pg_group g on (s.usesysid = any(g.grolist) )inner join [sSchemaFramework].v_user on "v_user".login = usename WHERE user_id = [user_id]';
$aSql['listDomain'] = 'SELECT distinct domain, alias FROM [sSchemaFramework].domain WHERE "type" = \'AD\'';
$aSql['createRolname'] = 'CREATE ROLE "vitis_[sDomain]" NOSUPERUSER INHERIT NOCREATEDB CREATEROLE;';
$aSql['getInfoRolname'] = 'SELECT * FROM pg_catalog.pg_roles WHERE rolname = \'vitis_[sDomain]\'';
// Maps
$aSql['getMapGroups'] = "SELECT map_group.group_id, \"group\".name FROM [sSchemaVmap].map_group LEFT JOIN [sSchemaFramework].\"group\" ON \"group\".group_id = map_group.group_id WHERE map_group.map_id = [map_id]";
$aSql['insertMapGroups'] = "INSERT INTO [sSchemaVmap].map_group(group_id, map_id) VALUES([group_id], [map_id])";
$aSql['getMapLayers'] = "SELECT v_layer.layer_id,name,theme_name,layer_visible FROM [sSchemaVmap].v_layer,[sSchemaVmap].map_layer WHERE v_layer.layer_id=map_layer.layer_id";
// VmapGroups
$aSql['getGroupMaps'] = "SELECT map_group.map_id, map.name FROM [sSchemaVmap].map_group LEFT JOIN [sSchemaVmap].map ON map.map_id = map_group.map_id WHERE map_group.group_id = [group_id]";
$aSql['insertGroupMaps'] = "INSERT INTO [sSchemaVmap].map_group(group_id, map_id) VALUES([group_id], [map_id])";
$aSql['getGroupPrintTemplates'] = "SELECT printtemplate_group.printtemplate_id, printtemplate.name FROM [sSchemaVmap].printtemplate_group LEFT JOIN [sSchemaVmap].printtemplate ON printtemplate.printtemplate_id = printtemplate_group.printtemplate_id WHERE printtemplate_group.group_id = [group_id]";
$aSql['insertGroupPrintTemplates'] = "INSERT INTO [sSchemaVmap].printtemplate_group(group_id, printtemplate_id) VALUES([group_id], [printtemplate_id])";
// MapLayers
$aSql['updateMapLayersVisibility'] = "UPDATE [sSchemaVmap].map_layer SET layer_visible=[visibility] WHERE map_id=[map_id] AND layer_id IN ([map_layers])";
$aSql['insertMapLayers'] = "INSERT INTO [sSchemaVmap].map_layer(layer_id, map_id) VALUES([layer_id], [map_id])";
$aSql['deleteMapLayers'] = "DELETE FROM [sSchemaVmap].map_layer WHERE map_id=[map_id] AND layer_id IN ([idList])";
$aSql['updateMapLayerIndex'] = "UPDATE [sSchemaVmap].map_layer SET layer_index=[index] WHERE map_id=[map_id] AND layer_id=[layer_id]";
$aSql['updateMapLayerOpacity'] = "UPDATE [sSchemaVmap].map_layer SET layer_opacity=[layer_opacity] WHERE map_id=[map_id] AND layer_id=[layer_id]";
// VmapUsers
$aSql['getUserPrintStyles'] = "SELECT user_printstyle.printstyle_id,printstyle.name FROM [sSchemaVmap].user_printstyle LEFT JOIN [sSchemaVmap].printstyle ON user_printstyle.printstyle_id = printstyle.printstyle_id WHERE user_printstyle.user_id = [user_id]";
$aSql['insertUserPrintStyles'] = "INSERT INTO [sSchemaVmap].user_printstyle(user_id, printstyle_id) VALUES([user_id], [printstyle_id])";
// PrintTemplates
$aSql['getPrintTemplateParameters'] = "SELECT * FROM [sSchemaVmap].v_print_parameter WHERE printtemplate_id=[printtemplate_id]";
$aSql['insertPrintTemplateGroups'] = "INSERT INTO [sSchemaVmap].printtemplate_group(group_id, printtemplate_id) VALUES([group_id], [printtemplate_id])";
$aSql['getPrintTemplateGroups'] = "SELECT printtemplate_group.group_id, \"group\".name FROM [sSchemaVmap].printtemplate_group LEFT JOIN [sSchemaFramework].\"group\" ON \"group\".group_id = printtemplate_group.group_id WHERE printtemplate_group.printtemplate_id = [printtemplate_id]";
$aSql['getUserPrintTemplateIds'] = "SELECT printtemplate_id FROM [sSchemaVmap].printtemplate_group WHERE group_id IN (SELECT group_id FROM [sSchemaFramework].v_user_group_by_rights WHERE user_id = (SELECT user_id FROM [sSchemaFramework].v_user WHERE login ='[sLogin]')) GROUP BY printtemplate_id";
// Services
$aSql['getTotalServiceLayers'] = "SELECT COUNT(*) AS nb_layers FROM [sSchemaVmap].layer WHERE service_id IN([idList])";
// PrintStyles
$aSql['getPrintStyleUsers'] = "SELECT user_printstyle.user_id, \"v_user\".login FROM [sSchemaVmap].user_printstyle LEFT JOIN [sSchemaFramework].\"v_user\" ON user_printstyle.user_id = \"v_user\".user_id WHERE user_printstyle.printstyle_id = [printstyle_id]";
$aSql['insertPrintStyleUsers'] = "INSERT INTO [sSchemaVmap].user_printstyle(user_id, printstyle_id) VALUES([user_id], [printstyle_id])";
// Layers
$aSql['setLayerBoId'] = "UPDATE [sSchemaVmap].layer SET bo_id = NULL WHERE layer_id = [layer_id]";
$aSql['deleteAssociatedBos'] = "DELETE FROM [sSchemaVmap].layer_businessobject WHERE layer_id = [layer_id]";
$aSql['deleteAssociatedLayers'] = "DELETE FROM [sSchemaVmap].layer_businessobject WHERE business_object_id = [business_object_id]";
$aSql['addAssociatedBos'] = "INSERT INTO [sSchemaVmap].layer_businessobject(layer_id, business_object_id) VALUES ([layer_id], [business_object_id]);";
?>
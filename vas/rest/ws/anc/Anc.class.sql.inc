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
// Installations
$aSql['getInstallationControls'] = "SELECT id_controle FROM [sSchemaAnc].v_controle WHERE id_installation IN([idList]) LIMIT 1";
$aSql['getContZoneUrbaIntersect'] = "SELECT [sColumn]::text FROM [sSchema].[sTable] WHERE ST_INTERSECTS([sTable].[sColumnGeom], [geom])";
$aSql['getControleComposants'] = "SELECT id_composant FROM [sSchemaAnc].v_composant WHERE id_controle = [idControle]";
?>
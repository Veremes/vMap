<?php

//Définition des requêtes de l'api Vitis
$aSql['checkIP'] = "SELECT user_id, ip_constraint, restriction FROM [sSchemaFramework].v_user WHERE lower(login) = [sLogin]";
$aSql['updateLastConnection'] = "update [sSchemaFramework].v_user set last_connection = [date] where user_id = [user_id]";
$aSql['getGroups'] = "SELECT v_user_group_by_rights.group_id, \"group\".name FROM [sSchemaFramework].v_user_group_by_rights LEFT JOIN [sSchemaFramework].group ON v_user_group_by_rights.group_id = \"group\".group_id WHERE v_user_group_by_rights.user_id = [user_id]";
$aSql['loginUnique'] = 'SELECT UPPER("login") FROM [sSchemaFramework]."v_user" where UPPER("login")=UPPER([sLoginUser])';
$aSql['getLoginbyId'] = 'SELECT "login" FROM [sSchemaFramework]."v_user" where user_id=[user_id]';
$aSql['getTableColumn'] = 'SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS where table_schema = \'[sSchemaFramework]\' and table_name= \'[sTable]\'';
$aSql['getUserPrivileges'] = 'SELECT groname FROM pg_user s LEFT OUTER JOIN pg_group g on (s.usesysid = any(g.grolist) )inner join [sSchemaFramework].v_user on "v_user".login = usename where user_id = [user_id]';
$aSql['listDomain'] = 'SELECT distinct domain, alias FROM [sSchemaFramework].domain WHERE "type" = \'AD\'';
$aSql['getAdId'] = 'SELECT domain_id FROM [sSchemaFramework].domain WHERE "domain" = [domain]';
$aSql['createRolname'] = 'CREATE ROLE "vitis_[sDomain]" NOSUPERUSER INHERIT NOCREATEDB CREATEROLE;';
$aSql['getInfoRolname'] = 'SELECT * FROM pg_authid WHERE rolname = [sDomain]';
// Groups
$aSql['getGroupUsers'] = "SELECT v_user_group_by_rights.user_id, \"v_user\".login FROM [sSchemaFramework].v_user_group_by_rights LEFT JOIN [sSchemaFramework].v_user ON v_user_group_by_rights.user_id = \"v_user\".user_id WHERE v_user_group_by_rights.group_id = [group_id]";
$aSql['insertGroupUsers'] = "INSERT INTO [sSchemaFramework].v_user_group_by_rights(user_id, group_id) VALUES([user_id], [group_id])";
$aSql['getGroupId'] = "SELECT group_id FROM [sSchemaFramework].group WHERE lower(name) = [sName]";
// Privileges
$aSql['getUsersPrivileges'] = 'SELECT [sSchemaFramework].v_user.user_id, [sSchemaFramework].v_user.login FROM pg_group RIGHT JOIN pg_user ON pg_user.usesysid = any(pg_group.grolist) RIGHT JOIN [sSchemaFramework].v_user ON [sSchemaFramework].v_user.login = pg_user.usename WHERE groname = [vitis_user] AND [sSchemaFramework].v_user.login != [excludeLogin]';
$aSql['getUsename'] = 'SELECT DISTINCT "usename" FROM pg_group RIGHT JOIN pg_user ON pg_user.usesysid = any(pg_group.grolist) RIGHT JOIN [sSchemaFramework].v_user ON [sSchemaFramework].v_user.login = pg_user.usename WHERE "groname" = [sId] AND [sSchemaFramework].v_user.login != [excludeLogin]';
$aSql['getUsers'] = "SELECT login FROM [sSchemaFramework].v_user WHERE user_id IN([user_id])";
// Users
$aSql['insertUserGroups'] = "INSERT INTO [sSchemaFramework].v_user_group_by_rights(user_id, group_id) VALUES([user_id], [group_id])";
$aSql['grantPrivilege'] = 'GRANT [sId] TO [sValue]';
$aSql['grantCREATEROLE'] = 'ALTER USER [sValue] CREATEROLE;"';
$aSql['revokePrivilege'] = 'REVOKE [sId] FROM [sValue]';
$aSql['revokeCREATEROLE'] = 'ALTER USER [sValue] NOCREATEROLE;"';
$aSql['deleteUserGroups'] = "DELETE FROM [sSchemaFramework].v_user_group_by_rights WHERE user_id=[user_id]";
$aSql['userPrivileges'] = "SELECT pg_group.grosysid,pg_group.groname FROM pg_group,pg_user,[sSchemaFramework].v_user,[sSchemaFramework].privileges WHERE pg_user.usesysid = any(pg_group.grolist) AND [sSchemaFramework].v_user.login = pg_user.usename AND pg_group.groname=[sSchemaFramework].privileges.rolname AND [sSchemaFramework].v_user.login = [login] AND pg_group.groname NOT IN([sExcludePrivileges]) ORDER BY groname";
$aSql['userCreateRole'] = 'ALTER ROLE [login] CREATEROLE';
$aSql['userNoCreateRole'] = 'ALTER ROLE [login] NOCREATEROLE';
$aSql['grantUser'] = 'GRANT [sLdapName] TO [sLogin]';
$aSql['getLogin'] = 'SELECT login,user_id FROM [sSchemaName].[sName] WHERE lower(login) = [sLogin]';
$aSql['userApplicationPrivileges'] = "SELECT pg_group.grosysid,pg_group.groname FROM pg_group,pg_user,[sSchemaFramework].v_user,[sSchemaFramework].privileges WHERE pg_user.usesysid = any(pg_group.grolist) AND [sSchemaFramework].v_user.login = pg_user.usename AND pg_group.groname=[sSchemaFramework].privileges.rolname AND [sSchemaFramework].v_user.login = [login] ORDER BY groname";
$aSql['getAllUserPrivileges'] = "SELECT DISTINCT pg_group.grosysid,pg_group.groname FROM pg_group,pg_user,[sSchemaFramework].v_user,[sSchemaFramework].privileges WHERE pg_user.usesysid = any(pg_group.grolist) AND pg_user.usename = [login]";
// Modes
$aSql['updateModesIndex'] = "UPDATE [sSchemaName].vm_mode_rolname SET index=[index] WHERE mode_id=[mode_id]";
// Columns
$aSql['getTableColumns'] = 'SELECT vm_table_field.table_field_id, name, translation as field_label, sortable, resizeable, "index",  width, align, template FROM [sSchemaFramework].vm_table_field INNER JOIN [sSchemaFramework].vm_translation ON vm_table_field.label_id = vm_translation.translation_id WHERE ressource_id=[sRessource] and lang=[language] ORDER BY "index"';
$aSql['getTableActions'] = 'SELECT button_class, table_button_id, translation as button_label, event FROM [sSchemaFramework].vm_table_button INNER JOIN [sSchemaFramework].vm_translation ON vm_table_button.label_id = vm_translation.translation_id WHERE ressource_id=[sRessource] and lang=[language] ORDER BY table_button_id';
$aSql['getColumns'] = 'SELECT vm_table_field.table_field_id, name, translation as field_label, sortable, resizeable, "index",  width, align, table_name FROM [sSchemaFramework].vm_table_field INNER JOIN [sSchemaFramework].vm_translation ON vm_table_field.label_id = vm_translation.translation_id WHERE lang=\'[language]\' ORDER BY table_name, "index"';
$aSql['getGeometryColumns'] = 'SELECT f_geometry_column FROM geometry_columns WHERE f_table_schema = \'[sSchemaFramework]\' AND f_table_name = \'[sTable]\'';
// Tabs
$aSql['getModeTabs'] = "SELECT vm_translation.translation as label, \"index\", event, replace(substring(event from '''[a-zA-Z_]+'''), '''', '') AS name FROM [sSchemaFramework].vm_tab LEFT JOIN [sSchemaFramework].vm_translation ON vm_tab.label_id = vm_translation.translation_id where mode_id='[mode_id]' and vm_translation.lang='[language]' order by \"index\"";
$aSql['getTabs'] = "SELECT vm_translation.translation as label, \"index\", event, replace(substring(event from '''[a-zA-Z_]+'''), '''', '') AS name, mode_id FROM [sSchemaFramework].vm_tab LEFT JOIN [sSchemaFramework].vm_translation ON vm_tab.label_id = vm_translation.translation_id where vm_translation.lang='[language]' order by mode_id, \"index\"";
// Sections
$aSql['getTabSections'] = "SELECT table_name, link_table_name, name, vm_translation.translation as label, \"index\", event FROM [sSchemaFramework].vm_section LEFT JOIN [sSchemaFramework].vm_translation ON vm_section.label_id = vm_translation.translation_id WHERE table_name='[table_name]' AND vm_translation.lang='fr' ORDER BY \"index\"";
$aSql['getSections'] = "SELECT table_name, link_table_name, name, vm_translation.translation as label, \"index\", event FROM [sSchemaFramework].vm_section LEFT JOIN [sSchemaFramework].vm_translation ON vm_section.label_id = vm_translation.translation_id WHERE vm_translation.lang='fr' ORDER BY table_name, \"index\"";
// Logs
$aSql['getApplicationModules'] = "SELECT module_name FROM [sSchemaFramework].vm_application_module WHERE application_name=[application_name];";
// Domains
$aSql['getUserGroups'] = 'SELECT [sSchemaFramework].v_user_group_by_rights."group_id", [sSchemaFramework].v_user_group_by_rights."user_id", [sSchemaFramework].group."name" FROM [sSchemaFramework].v_user_group_by_rights LEFT JOIN [sSchemaFramework].group ON [sSchemaFramework].v_user_group_by_rights."group_id"=[sSchemaFramework].group."group_id" WHERE [sSchemaFramework].v_user_group_by_rights."user_id" = [iUserId] ORDER BY "name"';
$aSql['getUserLogin'] = 'SELECT login FROM [sSchemaFramework].v_user WHERE user_id = [iUserId]';

$aSql['getTablePrivileges'] = 'SELECT grantee FROM information_schema.role_table_grants WHERE table_name=\'[sTable]\' and table_schema = \'[sSchema]\' and privilege_type = \'[sType]\'';
// PrivateToken
$aSql['getUserConnectionPrivileges'] = 'SELECT * FROM pg_group WHERE groname=\'vitis_user\' AND ((SELECT usesysid FROM pg_user WHERE usename=[sLogin]) = ANY (grolist));';
$aSql['checkUser'] = 'SELECT user_id FROM [sSchemaFramework].v_user WHERE lower(login) = [sLogin]';
?>
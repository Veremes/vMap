<?php
//*** Ensemble des requêtes de classe MetadataAccess pour pgsql ***
$aSql['pgsql']['checkUserIp'] ='SELECT lower("login") as login FROM [sSchemaFramework].v_user WHERE (\'[sIp]\' ~* "ip_constraint" or "ip_constraint" is null) AND lower("login") = \'[sLogin]\' ';
$aSql['pgsql']['getUserGroup']='SELECT [sSchemaFramework].group."group_id", [sSchemaFramework].group."name", [sSchemaFramework].v_user."company", [sSchemaFramework].v_user."department" FROM [sSchemaFramework].group LEFT JOIN [sSchemaFramework].v_user_group_by_rights ON [sSchemaFramework].v_user_group_by_rights."group_id" = [sSchemaFramework].group."group_id" LEFT JOIN [sSchemaFramework].v_user ON [sSchemaFramework].v_user."user_id" = [sSchemaFramework].v_user_group_by_rights."user_id" WHERE "login" = \'[sLogin]\'';
?>
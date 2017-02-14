<?php
//*** Ensemble des requêtes de classe MetadataAccess pour pgsql ***
$aSql['pgsql']['checkUserIp'] ='SELECT "login" FROM [sSchemaFramework].user WHERE (\'[sIp]\' ~* "ip_constraint" or "ip_constraint" is null) AND "login" = \'[sLogin]\' ';
$aSql['pgsql']['getUserGroup']='SELECT [sSchemaFramework].group."group_id", [sSchemaFramework].group."name", [sSchemaFramework].user."company", [sSchemaFramework].user."department" FROM [sSchemaFramework].group LEFT JOIN [sSchemaFramework].user_group ON [sSchemaFramework].user_group."group_id" = [sSchemaFramework].group."group_id" LEFT JOIN [sSchemaFramework].user ON [sSchemaFramework].user."user_id" = [sSchemaFramework].user_group."user_id" WHERE "login" = \'[sLogin]\'';
?>
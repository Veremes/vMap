<?php

//Définition des requêtes de l'api Vitis
$aSql['oci']['getTables'] = "SELECT table_name as \"table_name\" FROM user_tables WHERE TABLESPACE_NAME <> 'SYSTEM'";
$aSql['oci']['getTableColumns'] = "Select COLUMN_NAME as \"column_name\", data_type as \"data_type\" from USER_TAB_COLUMNS where TABLE_NAME = '[sTable]' ";

$aSql['pgsql']['getTables'] = "select table_name from(select viewname as \"table_name\", schemaname from pg_catalog.pg_views UNION select tablename as \"table_name\", schemaname from pg_catalog.pg_tables) as tables where schemaname = '[sSchema]'";
$aSql['pgsql']['getTableColumns'] = "SELECT column_name, udt_name as data_type FROM INFORMATION_SCHEMA.COLUMNS where table_schema = '[sSchema]' and table_name = '[sTable]' ORDER BY column_name";

$aSql['pgsql']['getDatabases'] = "select pg_database.datname as database from pg_database order by database";
$aSql['pgsql']['getSchemas'] = "SELECT DISTINCT(table_schema) as schema_name FROM information_schema.tables";
?>


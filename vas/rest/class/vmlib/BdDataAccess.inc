<?php

/*
 *
 * BdDataAccess.inc :
 *
 */

switch ($properties["sgbd"]) {
    case "mysql" :
        require_once("vmlib/MysqlDataAccess.class.inc");
        break;
    case "pgsql" :
        require_once(__DIR__ . "/PgsqlDataAccess.class.inc");
        break;
    case "oci" :
        //require_once("vmlib/OciDataAccess.class.inc");
        break;
}
?>
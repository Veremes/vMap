<?php
header('Content-Type: application/json');
require_once "../rest/conf/properties.inc";
require("vendor/autoload.php");
$swagger = \Swagger\scan('../rest/ws/'.$_REQUEST['service']);
//$swagger = \Swagger\scan('C:/Users/yoann/Desktop/swagger-php-master/Examples/petstore.swagger.io');
$aServer = explode("://", $properties["web_server_name"]);
$swagger = str_replace("[service_alias]", $properties["services_alias"], $swagger);
$swagger = str_replace("[protocol]", $aServer[0], $swagger);
$swagger = str_replace("[server]", $aServer[1], $swagger);

echo  "$swagger";
?>
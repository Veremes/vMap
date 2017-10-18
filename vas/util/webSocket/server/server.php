<?php

require __DIR__ . "/../../../rest/conf/properties.inc";
require __DIR__ . '/lib/SplClassLoader.php';

$classLoader = new SplClassLoader('WebSocket', __DIR__ . '/lib');
$classLoader->register();

$server = new \WebSocket\Server($properties['websocket_server'], $properties['websocket_port'], false, $properties['vas_home']);

$iMaxClients = 10000;
$iMaxRequestsPerMinutePerUser = 120;

// server settings:
$server->setMaxClients($iMaxClients);
$server->setCheckOrigin(false);
$server->setMaxConnectionsPerIp($iMaxClients);
$server->setMaxRequestsPerMinute($iMaxRequestsPerMinutePerUser);


// Hint: Status application should not be removed as it displays usefull server informations:
$server->registerApplication($properties['websocket_alias'], \WebSocket\Application\VitisApplication::getInstance());

$server->run();

?>
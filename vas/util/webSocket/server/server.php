<?php

$myservicename = 'websocket_vitis';
require_once __DIR__ . "/../../../rest/conf/properties.inc";
ini_set('max_execution_time', 0);
ini_set('max_input_time ', -1);
set_time_limit(0);
if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    if (!empty($argv[1])) {
        if ($argv[1] != 'install') {
            die();
        } else {
            $result = win32_create_service(array(
                'service' => $myservicename,
                'display' => $myservicename,
                'params' => __FILE__,
                'path' => $properties['vas_home'] . '\\server\\php\\php.exe'));
            exit($result);
        }
    }
}

if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    define('WIN32_ERROR_CALL_NOT_IMPLEMENTED', 120);
    // Connect to service dispatcher and notify that startup was successful
    if (!win32_start_service_ctrl_dispatcher($myservicename))
        die('Could not connect to service :' . $myservicename);
    win32_set_service_status(WIN32_SERVICE_RUNNING);
}
$bServerDown = True;
// Main Server Loop
while (1) {
    // If the server is running on Windows
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        switch (win32_get_last_control_message()) {
            case WIN32_SERVICE_CONTROL_CONTINUE: break; // Continue server routine
            case WIN32_SERVICE_CONTROL_INTERROGATE: win32_set_service_status(WIN32_NO_ERROR);
                break; // Respond with status
            case WIN32_SERVICE_CONTROL_STOP: win32_set_service_status(WIN32_SERVICE_STOPPED);
                $command = 'taskkill /F /pid ' . getmypid();
                $output = shell_exec($command);
                exit(0); // Terminate script
            default: win32_set_service_status(0); // Add more cases to handle other service calls
        }
    }
    if ($bServerDown) {
        unset($worker);
        if (!empty($worker)) {
            if ($worker->isWorking) {
                $worker->shutdown();
            }
            unset($worker);
        }
        $worker = new WebSocketServer();
        $worker->start();
        $bServerDown = False;
    } else {
        require_once 'vmlib/class.websocket_client.php';

        $client = new WebsocketClient;
        $client->connect($properties['websocket_server'], $properties['websocket_port'], '/' . $properties['websocket_alias']);

        // Check each 10ms if the server is yet connected and send the data via the websocket
        for ($index = 0; $index < 10; $index++) {
            if ($client->isConnected() === true) {
                break;
            } else {
                usleep(100000);
            }
        }
        if ($client->isConnected() === true) {
            $result = $client->checkConnection();
            if (!$result) {
                $bServerDown = true;
            }
        } else {
            $bServerDown = true;
        }
        if (!$bServerDown) {
            $client->disconnect();
        }
    }
    sleep(10); // Run every 10 seconds
}
// If the server is running on Windows
if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    win32_set_service_status(WIN32_SERVICE_STOPPED);
}

class WebSocketServer extends Worker {

    function run() {
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
    }

}

?>
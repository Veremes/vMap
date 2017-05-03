<?php
require_once __DIR__ . "/../../rest/conf/properties.inc";
$url = $_GET["url"];

unset($_GET["url"]);

foreach ($_GET as $key => $value) {
    if (strpos($url, '?') == false) {
        $url.='?' . $key . '=' . urlencode($value);
    } else {
        $url.='&' . $key . '=' . urlencode($value);
    }
}

$arrContextOptions=array(
    "ssl"=>array(
        "verify_peer"=>$properties['proxy_check_ssl'],
        "verify_peer_name"=>$properties['proxy_check_ssl'],
    ),
);  
stream_context_set_default($arrContextOptions);

if (filter_var($url, FILTER_VALIDATE_URL) != false && (strpos($url, "http://") === 0 || strpos($url, "https://") === 0)){
	list($status) = get_headers($url);
	if (strpos($status, '200') !== FALSE) {
		$string = file_get_contents($url);
		echo($string);
	}else{
		http_response_code(404);
		echo (json_encode(array("status" => "0", "sMessage" => "Not found")));
	}
}else{
	http_response_code(403);
	echo (json_encode(array("status" => "0", "sMessage" => "forbidden")));
}

?>
<?php

require_once __DIR__ . "/../../rest/conf/properties.inc";
require_once __DIR__ . "/../../rest/class/vmlib/logUtil.inc";

// Temps max file_get_contents (900 = 15min)
ini_set('default_socket_timeout', 900);

/**
 * Return true if the result is an XML
 * @param string $xml_string
 * @return boolean
 */
function isXML($xml_string) {
    $aXmlArray = simplexml_load_string($xml_string);
    if (!$aXmlArray) {
        return false;
    }
    $xml = new XMLReader();
    if (!$xml->xml($xml_string, NULL, LIBXML_DTDVALID)) {
        echo "XML not valid: load error";
        return false;
    } else {
        return true;
    }
}

/**
 * Return true if the result is an image
 * @param string $image_string
 * @return boolean
 */
function isImage($image_string) {
    if (@is_array(getimagesizefromstring($image_string))) {
        return true;
    } else {
        return false;
    }
}

$url = $_GET["url"];

unset($_GET["url"]);

$sLogString = "proxy" . $properties["log_delim"] . $_SERVER['REMOTE_ADDR'] . $properties["log_delim"] . $url;
writeToProxyLog($sLogString);

foreach ($_GET as $key => $value) {
    if (strpos($url, '?') == false) {
        $url .= '?' . $key . '=' . urlencode($value);
    } else {
        $url .= '&' . $key . '=' . urlencode($value);
    }
}

/**
 * Restrictions SSL
 */
$arrContextOptions = array(
    "ssl" => array(
        "verify_peer" => $properties['proxy_check_ssl'],
        "verify_peer_name" => $properties['proxy_check_ssl'],
    )
);

/**
 * Authentification basic
 */
$aApacheHeaders = apache_request_headers();
if (!empty($aApacheHeaders['Authorization'])) {
    $arrContextOptions['http'] = array(
        'header' => "Authorization: " . $aApacheHeaders['Authorization']
    );
}
stream_context_set_default($arrContextOptions);

if (filter_var($url, FILTER_VALIDATE_URL) != false && (strpos($url, "http://") === 0 || strpos($url, "https://") === 0)) {
    list($status) = get_headers($url);
    if (strpos($status, '200') !== FALSE) {
        $string = file_get_contents($url);
        if (isXML($string)) {
            echo htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
        } else if (isImage($string)) {
            echo $string;
        } else {
            http_response_code(403);
            echo (json_encode(array("status" => "0", "sMessage" => "forbidden")));
        }
    } else {
        http_response_code(404);
        echo (json_encode(array("status" => "0", "sMessage" => "Not found")));
    }
} else {
    http_response_code(403);
    echo (json_encode(array("status" => "0", "sMessage" => "forbidden")));
}
?>
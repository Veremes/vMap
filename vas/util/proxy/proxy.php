<?php

$url = $_GET["url"];

unset($_GET["url"]);

foreach ($_GET as $key => $value) {
    if (strpos($url, '?') == false) {
        $url.='?' . $key . '=' . urlencode($value);
    } else {
        $url.='&' . $key . '=' . urlencode($value);
    }
}

$string = file_get_contents($url);
echo($string);
?>
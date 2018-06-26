<?php

$aSql["UserExists"] = "SELECT \"user\".login FROM [SCHEMA].\"user\" WHERE \"user\".login=[USERNAME];";
$aSql["checkUser"] = "SELECT * FROM [SCHEMA].\"user\" WHERE \"user\".login=[USERNAME] AND \"user\".email=[MAIL];";
$aSql["setPrivilege"] = "GRANT [ROLE] TO [USERNAME];";
$aSql["getUserToUnsubscribe"] = "SELECT login, role FROM [SCHEMA].v_user WHERE v_user.user_id = [USER_ID];";
$aSql["disableAccount"] = "REVOKE vitis_user FROM [LOGIN]";
?>
<?php
	$aSql["UserExists"] = "SELECT \"v_user\".login FROM [SCHEMA].\"v_user\" WHERE \"v_user\".login=[USERNAME];";
        $aSql["checkUser"] = "SELECT * FROM [SCHEMA].\"v_user\" WHERE \"v_user\".login=[USERNAME] AND \"v_user\".email=[MAIL];";
        $aSql["setPrivilege"] = "GRANT [ROLE] TO [USERNAME];";
        $aSql["updatePassword"] = "ALTER USER [LOGIN] WITH PASSWORD [PASSWORD]";
?>
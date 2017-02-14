<?php
require("constants.inc");
require("properties_server.inc");
require("properties_domain.inc");
$properties['language'] = 'fr';
$properties['cookie_lifetime'] = 525600;
$properties['max_upload_file_size'] = 100 * 1024 * 1024;
$properties['max_execution_time'] = 3600;
$properties['refresh_period'] = 45;
$properties['forbidden_extension'] = '*.bat|*.com|*.exe|*.php|*.phtml|*.vhtml|*.js|*.vbe|*.wsf|*.dll';
$properties['rows_per_page'] = 20;
$properties['extract_dir'] = "{$properties['vas_home']}/tmp";
$properties['date_format'] = 'd/m/Y';
$properties['log_mode'] = true;
$properties['debug_mode'] = false;
$properties['log_period'] = 'Y-m';
$properties['shared_dir'] = "{$properties['vas_home']}/shared";
$properties['public_dir'] = "{$properties['vas_home']}/public";
$properties['ws_data_dir'] = "{$properties['vas_home']}/ws_data";
$properties['public_alias'] = 'public[ENV]';
$properties['ws_data_alias'] = 'ws_data[ENV]';
$properties['doc_alias'] = 'doc[ENV]';
$properties['services_alias'] = 'rest[ENV]';
$properties['log_size'] = 2048;
$properties['mixed_rights_management'] = true;
$properties['public_token'] = '';
$properties['allow_public_connection'] = false;
$properties['public_login'] = '';
$properties['public_password'] = '';

// Require tous les fichiers de tous les dossiers contenus sans properties
$aDir = scandir(__DIR__);
foreach ($aDir as $dir) {
	if($dir != '.' && $dir != '..'){
		if(is_dir(__DIR__.'/'.$dir)){
			$aFiles = scandir(__DIR__.'/'.$dir);
			foreach ($aFiles as $file) {
				if((filetype(__DIR__.'/'.$dir.'/'.$file) == 'file') && (pathinfo(__DIR__.'/'.$dir.'/'.$file)['extension']) == 'inc' && $file != "version.inc"){
					require_once __DIR__.'/'.$dir.'/'.$file;
				}
			}
		}
	}
}

require("properties_post.inc");
include("php_conf.inc");
?>
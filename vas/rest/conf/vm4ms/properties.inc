<?php
$properties['mapserver_alias'] = 'wms[ENV]';
$properties['test_wms_service'] = 'Test';
$properties['test_wms_service_default_content'] = '	STATUS ON<return>	# Étentue de la carte<return>	EXTENT -460868 6194115 1693884 7208427<return>	# Taille de l\'image générée<return>	SIZE 800 500<return>	# Couleur de fond de l\'image générée<return>	IMAGECOLOR 244 244 255<return>	<return>	# Format de sortie de l\'image générée (Jpeg)<return>	OUTPUTFORMAT<return>		NAME "AGG_JPEG"<return>		DRIVER AGG/JPEG<return>		IMAGEMODE RGB<return>	END<return>	<return>	# Type de légende générée (HTML)<return>	LEGEND<return>		STATUS ON<return>		IMAGECOLOR 244 244 244<return>		KEYSIZE 15 15 <return>		KEYSPACING 5 5<return>		LABEL<return>			TYPE TRUETYPE<return>			FONT "arial"<return>			SIZE 8<return>			COLOR 0 0 0<return>			PARTIALS TRUE<return>		END<return>		TEMPLATE "../template/legend.html"<return>	END';
$properties['datadir'] = $properties['shared_dir'];
?>
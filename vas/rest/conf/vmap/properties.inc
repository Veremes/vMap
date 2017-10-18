<?php
$properties["fop_root_dir"] = $properties['vas_home'].'/server/fop';
$properties['phantomjs_root_path'] = $properties['vas_home'].'/server/phantomjs/bin/phantomjs';
$properties['printserver_alias'] = 'printserver[ENV]';
$properties["api_veremap"] = '';
$properties["vmap"]["wmsTilesWidth"] = 512;
$properties["vmap"]["wmsTilesHeight"] = 512;
$properties['popup']['style'] = 'max-height: 350px;<return>max-width: 350px;<return>min-height: 100px;<return>min-width: 200px;';
$properties["vmap"]["layers_collapsed"] = false;
$properties["vmap"]["layerstree_collapsed"] = false;
$properties["vmap"]["layersorder_collapsed"] = true;
$properties["vmap"]["legend_collapsed"] = false;
$properties['controls']['active_controls'] = 'Attribution|MousePosition|CurrentProjection|MapName|Scale|ScaleLine|OverviewMap|Zoom|ZoomSlider|RefreshSocket';
$properties["selection"]["limit_popup"] = 1;
$properties["selection"]["limit_list"] = 50;
?>

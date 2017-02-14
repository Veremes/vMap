<?php

// FOP
$properties["fop_root_dir"] = $properties['vas_home'].'/server/fop';

// PhantomJS
$properties['phantomjs_root_path'] = $properties['vas_home'].'/server/phantomjs/bin/phantomjs';

// Alias printserver
$properties['printserver_alias'] = 'printserver[ENV]';

// API Veremap
$properties["api_veremap"] = '';

// Taille des tuiles
$properties["vmap"]["wmsTilesWidth"] = 512;
$properties["vmap"]["wmsTilesHeight"] = 512;

// true si les groupes de couches doivent etre collapsés
$properties["vmap"]["layers_collapsed"] = false;

// true si "Jeux de données" doit etre collapsé
$properties["vmap"]["layerstree_collapsed"] = false;

// true si "Table des matières" doit etre collapsé
$properties["vmap"]["layersorder_collapsed"] = true;

// true si "Légende" doit etre collapsé
$properties["vmap"]["legend_collapsed"] = false;

// Nombre de popups max
$properties["selection"]["limit_popup"] = 1;
// Nombre le selections dans la liste
$properties["selection"]["limit_list"] = 50;
// Buffer en mm sur l'écran
$properties["selection"]["buffer"] = 5;
// Echelle à partir de laquelle le buffer terrin arrete d'augmenter
$properties["selection"]["max_scale_buffer"] = 5000;

// Style popup par défaut
$properties['popup']['style'] = 'max-height: 350px;<return>max-width: 350px;';

// Style de la popup au format CSSStyleDeclaration JavaScript
$properties["popup"]["style"]["maxWidth"] = "280px";
$properties["popup"]["style"]["minWidth"] = "140px";
$properties["popup"]["style"]["width"] = "";
$properties["popup"]["style"]["height"] = "";

// Outils activés par défaut
$properties['controls']['active_controls'] = [
    'Attribution',
    'MousePosition',
    'CurrentProjection',
    'Scale',
    'OverviewMap',
    'ScaleLine',
    'Zoom',
    'ZoomSlider',
    'RefreshSocket'
];

// False pour ne pas garder les tuiles déjà affichées lors du rafraichissement par socket
$properties['controls']['RefreshSocket']['keep_loaded_tiles'] = true;
?>
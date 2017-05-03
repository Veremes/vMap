/* global oVmap, nsVmap, goog, ol, angular, vitisApp */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.LayersTree
 * cette classe permet l'initialisation de l'arborescence de couches
 */

goog.provide('nsVmap.nsMapManager.LayersTree');

goog.require('oVmap');

goog.require('MapJSON');

goog.require('nsVmap.Map');
goog.require('ol.proj');
goog.require('ol.proj.Projection');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Tile');
goog.require('ol.layer.Image');
goog.require('ol.source.OSM');
goog.require('ol.source.BingMaps');
goog.require('ol.source.TileWMS');
goog.require('ol.source.Image');
goog.require('ol.source.ImageWMS');
goog.require('ol.source.WMTS');
goog.require('ol.format.WMTSCapabilities');
goog.require('ol.tilegrid.TileGrid');

/**
 * @classdesc
 * Class {@link nsVmap.nsMapManager.LayersTree}: initializes the layers defined in data/map.json
 *
 * @constructor
 * @export
 */
nsVmap.nsMapManager.LayersTree = function () {
    oVmap.log("nsVmap.nsMapManager.LayersTree");
};

/**
 * An application-specific directive wrapping the ngeo tree layer directive.
 * The directive includes a controller defining the tree tree.
 *
 * @return {angular.Directive} The Directive Definition Object.
 * @constructor
 */
nsVmap.nsMapManager.LayersTree.prototype.layertreeDirective = function () {
    oVmap.log("nsVmap.nsMapManager.LayersTree.prototype.layertreeDirective");
    return {
        restrict: 'A',
        scope: {
            'map': '=appMap',
            'proj': '=appProj',
            'lang': '=appLang'
        },
        controller: 'AppLayertreeController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/layers/layertree.html'
    };
};

/**
 * 
 * @param {object} $scope
 * @constructor
 * @ngInject
 * @export
 * @returns {undefined}
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController = function ($scope, $http) {
    oVmap.log("nsVmap.nsMapManager.LayersTree.prototype.LayertreeController");

    var this_ = this;

    /**
     * @private
     */
    this.scope_ = $scope;

    this.http_ = $http;

    /**
     * The MapManager.layersTree
     * @type {object}
     */
    $scope['tree'] = oVmap.getMapManager().getLayersTree();

    /**
     * The current properties
     */
    this['properties'] = oVmap['properties'];

    /**
     * The current token
     */
    this['token'] = oVmap['properties']['token'];

    /**
     * Contains the layer to apply the filter
     */
    this['olFilteredLayer'] = {};

    this['refreshLayersEvents'] = [];

    if (goog.isDefAndNotNull(oVmap['properties']['vmap'])) {
        /**
         * true if the layers have to be collapsed
         */
        this['layers_collapsed'] = oVmap['properties']['vmap']['layers_collapsed'];
        /**
         * true if the tool have to be collapsed
         */
        this['layerstree_collapsed'] = oVmap['properties']['vmap']['layerstree_collapsed'];
    }

    this.loadTree();

    // Événements sur les couches
    var keepLoadedTiles = true;
    if (goog.isDefAndNotNull(vitisApp['oWebsocket'])) {
        vitisApp['oWebsocket'].on('event', function (event) {
            for (var i = 0; i < this_['refreshLayersEvents'].length; i++) {
                if (this_['refreshLayersEvents'][i]['event'] === event) {
                    if (oVmap['bRefreshWebsockets']) {
                        if (goog.isDefAndNotNull(this_['refreshLayersEvents'][i]['layer'])) {
                            if (goog.isDefAndNotNull(this_['refreshLayersEvents'][i]['layer'].refreshWithTimestamp)) {
                                this_['refreshLayersEvents'][i]['layer'].refreshWithTimestamp(keepLoadedTiles);
                            }
                        }
                    }
                }
            }
        });
    }
};

/**
 * Set a layer visible or not
 * @param {ol.layer.Base} layer
 * @param {boolean} bVisible
 * @export
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.setVisible = function (layer, bVisible) {
    oVmap.log('nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.setVisible', bVisible);

    layer.setVisible(bVisible);
    this['map'].render();
};

/**
 * Set a layer group selectable or not
 * @param {object} node service node in the layers tree
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.setGroupSelectable = function (node) {

    // Affiche ou cache les couches mémorisées
    for (var i = 0; i < node['children'].length; i++) {
        if (node['children'][i]['olLayer'].get('select') !== undefined)
            node['children'][i]['olLayer'].set('select', node['selectable']);
    }

    this.memoriseGroupSelectable(node);
};

/**
 * Function returns if a group is full visible/hidden or half visible
 * @param {object} node service node in the layers tree
 * @returns {Boolean|null} true if all layers from a group are visible, false if they are all hidden, null otherwise
 * @export
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.isGroupVisible = function (node) {

    var bGroupVisible;
    var iVisibleLayers = 0;

    // Affiche ou cache les couches mémorisées
    for (var i = 0; i < node['children'].length; i++) {
        if (node['children'][i]['olLayer'].getVisible(node['visible']) === true) {
            iVisibleLayers++;
        }
    }

    if (iVisibleLayers === node['children'].length)
        bGroupVisible = true;
    else if (iVisibleLayers === 0)
        bGroupVisible = false;
    else
        bGroupVisible = null;

    return bGroupVisible;

};

/**
 * Set a layer group visible or invisible
 * @param {object} node service node in the layers tree
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.setGroupVisible = function (node) {

    // Affiche ou cache les couches mémorisées
    for (var i = 0; i < node['children'].length; i++) {
        node['children'][i]['olLayer'].setVisible(node['visible']);
    }

    this.memoriseGroupVisible(node);
};

/**
 * Memorise the selectable layers in a group
 * @param {object} node service node in the layers tree
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.memoriseGroupSelectable = function (node) {

    if (node !== undefined) {
        var aGroup = node['children'];

        if (node.selectableLayers === undefined)
            node.selectableLayers = [];

        // Mémorise les couches affichées
        node.selectableLayers.length = 0;
        for (var i = 0; i < aGroup.length; i++) {
            if (aGroup[i]['olLayer'].get('select') === true)
                node.selectableLayers.push(aGroup[i]['olLayer']);
        }

        if (node.selectableLayers.length === 0)
            node['selectable'] = false;
        else
            node['selectable'] = true;
    }
};

/**
 * Memorise the visible layers in a group
 * @param {object} node service node in the layers tree
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.memoriseGroupVisible = function (node) {

    if (node !== undefined) {
        var aGroup = node['children'];

        if (node.visibleLayers === undefined)
            node.visibleLayers = [];

        // Mémorise les couches affichées
        node.visibleLayers.length = 0;
        for (var i = 0; i < aGroup.length; i++) {
            if (aGroup[i]['olLayer'].getVisible() === true)
                node.visibleLayers.push(aGroup[i]['olLayer']);
        }

        if (node.visibleLayers.length === 0)
            node['visible'] = false;
        else
            node['visible'] = true;
    }
};

/**
 * Function that reload the layers tree
 * @export
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.reloadTree = function () {
    oVmap.log('nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.reloadTree');

    // recupère une copie de l'arbre des couches
    var oTree = jQuery.extend(true, {}, oVmap.getMapManager().getLayersTree());

    // Change la variable oLayersTree
    oVmap.getMapManager().setLayersTree(oTree);

    // Vide les couches en cours de la carte
    if (this['map'].getLayers().getArray().length > 0)
        this['map'].getLayers().clear();

    this.scope_['tree'] = oTree;

    // relance le chargement des couches avec le nouvel arbre
    this.loadTree();

    oVmap.resizeLayerTools(false);
};

/**
 * Load layers from the tree
 * @returns {undefined}
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.loadTree = function () {
    oVmap.log('nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.loadTree');

    if (this['map'].getLayers().getArray().length > 0)
        this['map'].getLayers().clear();

    oVmap.log(this.scope_['tree']);

    var tileSize = [oVmap['properties']['vmap']['wmsTilesWidth'], oVmap['properties']['vmap']['wmsTilesHeight']];

    /**
     * Objet permettant de lancer des fonctions utiles
     * pour parser la définition de la carte
     * @type MapJSON
     */
    var oMapJSON = new MapJSON({
        'properties': oVmap['properties']
    });

    /**
     * Vue à utiliser
     * @type ol.View
     */
    var olView = oMapJSON.getViewFromDef(this.scope_['tree'], {
        'size': this['map'].getSize(),
        'tileSize': tileSize
    });

    /**
     * Tableau de couches ol
     * @type Array<ol.layer>
     */
    var olLayers = oMapJSON.getLayersFromDef(this.scope_['tree'], {
        'size': this['map'].getSize(),
        'tileSize': tileSize
    });

    // Définit la vue de la carte
    this.addView(olView);

    // Crée les évènements sur les couches
    goog.array.clear(this['refreshLayersEvents']);
    for (var i = 0; i < olLayers.length; i++) {
        var aEvents = olLayers[i].get('events');
        if (goog.isArray(aEvents)) {
            goog.array.removeDuplicates(aEvents);
            for (var ii = 0; ii < aEvents.length; ii++) {
                this['refreshLayersEvents'].push({
                    'layer': olLayers[i],
                    'event': aEvents[ii]
                });
            }
        }
    }

    // Définit les couches de la carte
    for (var i = 0; i < olLayers.length; i++) {
        this.addLayer(olLayers[i]);
    }

};

/**
 * Add the olView
 * @param {object} olView
 * @returns {undefined}
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.addView = function (olView) {
    oVmap.log('nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.addView');

    // Récupère l'ancienne étendue
    var oldExtent = this['map'].getView().calculateExtent(this['map'].getSize());

    // Récupère l'ancienne et la nouvelle projection
    var oldProjection = this['map'].getView().getProjection().getCode();
    var newProjection = olView.getProjection().getCode();

    // Set le home position
    olView.set('homePosition', {
        center: olView.getCenter(),
        resolution: olView.getResolution()
    });

    // Récupère l'ancien home position
    var oldPosition = this['map'].getView().get('homePosition');

    oVmap.getMap().setOpenLayersView(olView);
    this['map'].setView(olView);
    this['proj'] = olView.getProjection().getCode();

    // Reprojette en cas de changment de carte
    if (goog.isDef(oldProjection) && goog.isDef(newProjection) && goog.isDef(oldExtent) && goog.isDef(oldPosition)) {
        // Reprojette l'étendue
        var newExtent = ol.proj.transformExtent(oldExtent, oldProjection, newProjection);
        this['map'].getView().fit(newExtent, this['map'].getSize(), {
            nearest: true
        });

        // Reprojette les features
        oVmap.getMap().reprojectFeatures(oldProjection, newProjection);
    }

    // Met à jour l'outil d'overview en fonction de la nouvelle carte
    var overviewMap = oVmap.getToolsManager().getBasicTools().getControls().getOverviewMap();
    if (overviewMap !== undefined) {
        overviewMap.ovmap_.setView(new ol.View({
            resolution: olView.getProperties().resolution,
            rotation: olView.getProperties().rotation,
            center: olView.getProperties().center,
            projection: olView.getProjection().getCode()
        }));
    }

    // Met à jour l'outil CurrentProjection
    $("#current-projection").html(oVmap['oProjections'][this['map'].getView().getProjection().getCode()]);
};

/**
 * Add a layer on the map
 * @param {object} olLayer
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.addLayer = function (olLayer) {
    oVmap.log('nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.addLayer');

    this['map'].addLayer(olLayer);
    oVmap.layerAdded(olLayer);
};

/**
 * Get the filter FormReader scope
 * @returns {angular.scope}
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.getFilterFormReaderScope = function () {
    return angular.element($('#layerstree_filter_formreader').children()).scope();
};

/**
 * Display the layer filter form
 * @param {ol.layer} olLayer
 * @export
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.displayFilterLayerModal = function (olLayer) {
    oVmap.log('nsVmap.nsMapManager.LayersTree.LayertreeController.displayFilterLayerModal');

    var this_ = this;

    this['olFilteredLayer'] = olLayer;
    if (!goog.isDefAndNotNull(olLayer.get('filter_form'))) {
        olLayer.set('filter_form', {
            'search': {}
        });
    }
    if (!goog.isDefAndNotNull(olLayer.get('filter_values'))) {
        olLayer.set('filter_values', {
            'search': {}
        });
    }

    var oFormDefinition = olLayer.get('filter_form');
    var oFormValues = olLayer.get('filter_values');

    // Supprime les valeurs qui sont égales à -1000000

    // Bouton submit
    var button = {
        "fields": [{
                "type": "button",
                "class": "btn-ungroup btn-group-sm hidden",
                "nb_cols": 12,
                "buttons": [{
                        "visibleAllTabs": true,
                        "id": "layerstree_filter_formreader_submit_btn",
                        "type": "submit",
                        "label": "FORM_UPDATE",
                        "name": "form_submit",
                        "class": "btn-primary"
                    }
                ]
            }
        ]
    };

    // Ajout du bouton caché submit (si il n'existe pas déjà)
    if (!angular.equals(oFormDefinition['search']['rows'][oFormDefinition['search']['rows'].length - 1], button))
        oFormDefinition['search']['rows'].push(button);

    // Evènement submit
    oFormDefinition['search']['event'] = function (oFormValuesResulted) {
        olLayer.set('filter_values', oFormValuesResulted);
        olLayer['applyFilter']();
        $('#layerstree-filter-modal').modal('hide');
        $.notify("Opération réalisée avec succès, les couches de la carte se mettent à jour", "info");
    };

    var filterFormReaderScope = this.getFilterFormReaderScope();
    filterFormReaderScope.$evalAsync(function () {

        filterFormReaderScope['ctrl']['setDefinitionName']('search');
        filterFormReaderScope['ctrl']['setFormValues'](oFormValues);
        filterFormReaderScope['ctrl']['setFormDefinition'](oFormDefinition);
        filterFormReaderScope['ctrl']['loadForm']();

        $('#layerstree-filter-modal').modal('show');
    });
};

// Définit la directive et le controller
oVmap.module.directive('appLayertree', nsVmap.nsMapManager.LayersTree.prototype.layertreeDirective);
oVmap.module.controller('AppLayertreeController', nsVmap.nsMapManager.LayersTree.prototype.LayertreeController);
/* global oVmap, nsVmap, goog, ol, angular */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.LayersTree
 * cette classe permet l'initialisation de l'arborescence de couches
 */

goog.provide('nsVmap.nsMapManager.LayersTree');

goog.require('nsVmap.Map');
goog.require('ol.proj');
goog.require('ol.proj.Projection');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Tile');
goog.require('ol.layer.Image');
goog.require('ol.source.MapQuest');
goog.require('ol.source.OSM');
goog.require('ol.source.Stamen');
goog.require('ol.source.BingMaps');
goog.require('ol.source.TileWMS');
goog.require('ol.source.Image');
goog.require('ol.source.ImageWMS');
goog.require('ol.source.WMTS');
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

    // Directives et controleurs Angular
    oVmap.module.directive('appLayertree', this.layertreeDirective);
    oVmap.module.controller('AppLayertreeController', this.LayertreeController);
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
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController = function ($scope) {
    oVmap.log("nsVmap.nsMapManager.LayersTree.prototype.LayertreeController");

    /**
     * @private
     */
    this.scope_ = $scope;

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

    this.layersList_ = [];

    this.loadTree();
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

    this.layersList_.length = 0;

    oVmap.log(this.scope_['tree']);

    for (var node in this.scope_['tree'].children) {
        if (goog.isDef(this.scope_['tree'].children[node]['view']))
            // Charge la vue
            this.addView(this.scope_['tree'].children[node]);
        else {
            // Extrait et ajoute les couches
            this.extractLayers(this.scope_['tree'].children[node]);
        }
    }

    // Réordonne les couches en fonction de leur index
    var this_ = this;
    setTimeout(function () {
        goog.array.sortObjectsByKey(this_.layersList_, 'index');
        this_['map'].getLayers().clear();
        for (var i = 0; i < this_.layersList_.length; i++) {
            this_['map'].addLayer(this_.layersList_[i]['layer']);
        }
    }, 500);
};

/**
 * Extract and add the layers from the node
 * @param {object} node
 * @returns {undefined}
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.extractLayers = function (node) {

    if (goog.isDef(node['children'])) {
        for (var node2 in node['children'])
            this.extractLayers(node['children'][node2]);
    } else if (goog.isDef(node['layerType'])) {
        this.addLayer(node);
    }

};

/**
 * Add the view by the tree node
 * @param {object} node
 * @returns {undefined}
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.addView = function (node) {
    oVmap.log('nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.addView');

    var view = {};
    view.center = goog.isDef(node['view']['center']) ? node['view']['center'] : [0, 0];
    view.zoom = goog.isDef(node['view']['zoom']) ? node['view']['zoom'] : 0;
    view.constrainRotation = node['view']['constrainRotation'];
    view.enableRotation = node['view']['enableRotation'];
//    view.extent = node['view']['extent']; --> extent: étendue maximale de la carte
    view.maxResolution = node['view']['maxResolution'];
    view.minResolution = node['view']['minResolution'];
    view.maxZoom = node['view']['maxZoom'];
    view.minZoom = node['view']['minZoom'];
    view.projection = node['view']['projection'];
    view.resolution = node['view']['resolution'];
    view.resolutions = node['view']['resolutions'];
    view.rotation = node['view']['rotation'];
    view.zoomFactor = node['view']['zoomFactor'];

    // Récupère l'ancienne étendue
    var oldExtent = this['map'].getView().calculateExtent(this['map'].getSize());

    // Nouvelle vue
    var myView = new ol.View(view);

    if (goog.isDef(node['view']['extent'])) {
        myView.fit(node['view']['extent'], this['map'].getSize(), {
            nearest: true
        });
    }

    // Récupère l'ancienne et la nouvelle projection
    var oldProjection = this['map'].getView().getProjection().getCode();
    var newProjection = goog.isDef(view.projection) ? view.projection : myView.getProjection().getCode();

    // Set le home position
    myView.set('homePosition', {
        center: myView.getCenter(),
        resolution: myView.getResolution()
    });

    // Récupère l'ancien home position
    var oldPosition = this['map'].getView().get('homePosition');

    oVmap.getMap().setOpenLayersView(myView);
    this['map'].setView(myView);
    this['proj'] = view.projection;

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
            resolution: myView.getProperties().resolution,
            rotation: myView.getProperties().rotation,
            center: myView.getProperties().center,
            projection: view.projection
        }));
    }

    // Met à jour l'outil CurrentProjection
    $("#current-projection").html(oVmap['oProjections'][this['map'].getView().getProjection().getCode()]);
};

/**
 * Add a layer on the map by the tree node
 * @param {object} node
 * @returns {undefined}
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.addLayer = function (node) {

    // Définition de la source
    var source = this.getSource(node);

    // Définition de la couche
    var layer = this.getLayer(node, source);

    // Mémorise l'ordre des couches
    if (node['index'])
        var index = node['index'];
    else
        var index = 0;

    this.layersList_.push({
        'index': index,
        'layer': layer
    });

    this['map'].addLayer(layer);

    // Rend la couche visible si le paramètre visible vaut true
    if (node['visible'] === "true" || node['visible'] === true) {
        node['visible'] = true;
        layer.setVisible(true);
    } else if (node['visible'] === "false") {
        node['visible'] = false;
    }

    // Determine l'opacité de la couche
    if (goog.isDef(node['opacity']))
        layer.setOpacity(node['opacity']);

    node['olLayer'] = layer;

    // Lors que l'ajout de la couche est terminé
    oVmap.layerAdded(layer);
};

/**
 * Get a source from a tree node
 * @param {object} node
 * @returns {ol.source}
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.getSource = function (node) {

    var type = node['layerType'];
    var source;
    var this_ = this;

    // Ajout d'un timestamp afin de maitriser les caches lors du rafraichissement
    // L'ajout de ce paramètre a également pour effet d'annuler les caches lors du chargement des couches
    if (goog.isDef(node['params'])) {
        if (node['is_dynamic'] === true) {
            node['params']['TIMESTAMP'] = Date.now();
        }
    }

    /**
     * @param {object} node
     * @return {ol.source.WMTS}
     */
    var getWMTSSource = function (node) {
        var resolutions = [];
        var matrixIds = [];
        var projection = oVmap.getMap().getOLMap().getView().getProjection();
        var maxResolution = ol.extent.getWidth(projection.getExtent()) / 256;

        for (var i = 0; i < 18; i++) {
            matrixIds[i] = i.toString();
            resolutions[i] = maxResolution / Math.pow(2, i);
        }

        var tileGrid = new ol.tilegrid.WMTS({
            origin: [projection.getExtent()[0], projection.getExtent()[3]],
            resolutions: resolutions,
            matrixIds: matrixIds
        });

        if (!node['matrixSet'])
            node['matrixSet'] = 'PM';
        if (!node['format'])
            node['format'] = 'image/jpeg';
        if (!node['style'])
            node['style'] = 'normal';

        var wmts_source = new ol.source.WMTS({
            url: oVmap['properties']['use_proxy_for_tiles'] ? oVmap.getMapManager().parseProxyUrl(node["url"]) : node["url"],
            urls: oVmap['properties']['use_proxy_for_tiles'] ? oVmap.getMapManager().parseProxyUrl(node["urls"]) : node["urls"],
            layer: node['layer'],
            matrixSet: node['matrixSet'],
            format: node['format'],
            projection: node["projection"],
            tileGrid: tileGrid,
            style: node['style'],
            crossOrigin: node['crossOrigin'],
            logo: node['logo'],
            requestEncoding: node['requestEncoding'],
            tilePixelRatio: node['tilePixelRatio'],
            version: node['version'],
            dimensions: node['dimensions'],
            maxZoom: node['maxZoom'],
            wrapX: node['wrapX']
        });

        return wmts_source;
    };

    if (type === 'stamen') {
        source = new ol.source.Stamen({
            url: node["url"],
            layer: node["layer"]
        });
    } else if (type === 'mapquest') {
        source = new ol.source.MapQuest({
            layer: node["layer"]
        });
    } else if (type === 'bing') {
        source = new ol.source.BingMaps({
            key: node["key"],
            wrapX: node["wrapX"],
            culture: node["culture"],
            maxZoom: node["maxZoom"],
            tileLoadFunction: node["tileLoadFunction"],
            imagerySet: node["imagerySet"]
        });
    } else if (type === 'tilewms') {

        var resolutions = [];
        var projection = oVmap.getMap().getOLMap().getView().getProjection();
        var maxResolution = ol.extent.getWidth(projection.getExtent()) / 256;
        var tileSize = [oVmap['properties']['vmap']['wmsTilesWidth'], oVmap['properties']['vmap']['wmsTilesHeight']];

        tileSize = goog.isDef(tileSize) ? tileSize : [512, 512];

        for (var i = 0; i < 18; i++) {
            resolutions[i] = maxResolution / Math.pow(2, i);
        }

        var tileGrid = new ol.tilegrid.TileGrid({
            origin: [projection.getExtent()[0], projection.getExtent()[3]],
            resolutions: resolutions,
            tileSize: tileSize
        });

        source = new ol.source.TileWMS({
            url: oVmap['properties']['use_proxy_for_tiles'] ? oVmap.getMapManager().parseProxyUrl(node["url"]) : node["url"],
            urls: oVmap['properties']['use_proxy_for_tiles'] ? oVmap.getMapManager().parseProxyUrl(node["urls"]) : node["urls"],
            logo: node["logo"],
            hidpi: node["hidpi"],
            wrapX: node["wrapX"],
            gutter: node["gutter"],
            maxZoom: node["maxZoom"],
            tileGrid: tileGrid,
            projection: node["projection"],
            serverType: node["serverType"],
            crossOrigin: node["crossOrigin"],
            tileLoadFunction: node["tileLoadFunction"],
            params: node["params"]
        });
    } else if (type === 'imagewms') {
        source = new ol.source.ImageWMS({
            url: oVmap['properties']['use_proxy_for_tiles'] ? oVmap.getMapManager().parseProxyUrl(node["url"]) : node["url"],
            logo: node["logo"],
            hidpi: node["hidpi"],
            ratio: node["ratio"],
            projection: node["projection"],
            serverType: node["serverType"],
            resolutions: node["resolutions"],
            crossOrigin: node["crossOrigin"],
            attributions: node["attributions"],
            imageLoadFunction: node["imageLoadFunction"],
            params: node["params"]
        });

    } else if (type === 'imagevector') {
        if (node["features"]) {
            vectorSource = new ol.source.Vector({
                features: node["features"]
            });
        } else if (node["url"]) {
            vectorSource = new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: oVmap['properties']['use_proxy_for_tiles'] ? oVmap.getMapManager().parseProxyUrl(node["url"]) : node["url"]
            });
        } else {
            console.error("Error: veuillez renseinger une url ou une feature");
            return;
        }
        source = new ol.source.ImageVector({
            style: goog.isDefAndNotNull(node["style"]) ? node["style"] : new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.6)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#319FD3',
                    width: 1
                })
            }),
            source: vectorSource
        });

    } else if (type === 'tilewmts') {
        source = getWMTSSource(node);
    } else if (type === 'osm') {
        if (!goog.isDef(node["url"]) || node["url"] === '')
            node["url"] = "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png";

        source = new ol.source.OSM({
            url: node["url"]
        });
    } else if (type === 'layerGroup') {

    } else {
        console.error("Error: layerType (" + type + ") is not supported");
        source = new ol.source.OSM();
    }

    return source;
};

/**
 * Get a layer from a tree node and a source
 * @param {type} node
 * @param {type} source
 * @returns {ol.layer.Tile|ol.layer.Image|nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.getLayer.layer|ol.layer.Group}
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.getLayer = function (node, source) {

    var layer;
    var type = node['layerType'];

    if (type === 'imagewms' || type === 'imagevector') {
        layer = new ol.layer.Image({
            source: source
        });
    } else {
        layer = new ol.layer.Tile({
            source: source
        });
    }
    layer.set('type', type);
    layer.set('name', node["name"]);

    // definit si la légende est visible ou non
    layer.set('legend', true);

    // definit si la légende est selectionnable ou non
    // queryable: la couche peut être ou pas interrogeable
    // select: la couche est interrogeable par défaut
    layer.set('queryable', true);
    if ((type !== "imagewms") && (type !== "tilewms"))
        layer.set('queryable', false);

    node["select"] = true;
    layer.set('select', true);

    // Défini si la couche est interrogeable par le business object
    if (node['bo_queryable'] === true) {
        layer.set('bo_queryable', true);

        // Défini les droits sur le business object
        if (goog.isDefAndNotNull(node['bo_user_rights'])) {
            layer.set('bo_user_rights', node['bo_user_rights']);
        }
    }

    layer.set('layer_id', node['layer_id']);

    if (goog.isDefAndNotNull(node['bo_id']))
        layer.set('bo_id', node['bo_id']);
    if (goog.isDefAndNotNull(node['bo_title']))
        layer.set('bo_title', node['bo_title']);
    if (goog.isDefAndNotNull(node['bo_id_field']))
        layer.set('bo_id_field', node['bo_id_field']);
    if (goog.isDefAndNotNull(node['bo_search_field']))
        layer.set('bo_search_field', node['bo_search_field']);
    if (goog.isDefAndNotNull(node['bo_result_field']))
        layer.set('bo_result_field', node['bo_result_field']);
    if (goog.isDefAndNotNull(node['bo_search_use_strict']))
        layer.set('bo_search_use_strict', node['bo_search_use_strict']);
    if (goog.isDefAndNotNull(node['bo_geom_column']))
        layer.set('bo_geom_column', node['bo_geom_column']);
    if (goog.isDefAndNotNull(node['bo_geom_type']))
        layer.set('bo_geom_type', node['bo_geom_type']);
    if (goog.isDefAndNotNull(node['bo_index']))
        layer.set('bo_index', node['bo_index']);
    if (goog.isDefAndNotNull(node['events']))
        layer.set('events', node['events']);
    if (goog.isDefAndNotNull(node['is_dynamic']))
        layer.set('is_dynamic', node['is_dynamic']);
    if (goog.isDefAndNotNull(node['is_filtered'])) {
        if (goog.isDefAndNotNull(node['filter_form'])) {
            if (goog.isString(node['filter_form']) && node['filter_form'].length !== 0) {
                node['filter_form'] = JSON.parse(node['filter_form']);
                node['filter_values'] = this.getFilterFormValues(node['filter_form']);
                layer.set('filter_form', node['filter_form']);
                layer.set('is_filtered', node['is_filtered']);
                layer.set('filter_values', node['filter_values']);
                this.setFilterOnLayer(layer);
            }
        }
    }

    // Ajout des couches en mode invisible
    layer.setVisible(false);

    // export à la compilation pour les values
    layer['values'] = layer.values_;

    return layer;
};

/**
 * Change the layer source URL to apply the filter_values
 * @param {ol.layer} olLayer
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.setFilterOnLayer = function (olLayer) {
    oVmap.log('nsVmap.nsMapManager.LayersTree.LayertreeController.setFilterOnLayer');

    var oValues = this.getBOValuesFromFormValues(olLayer.get('filter_values')['search']);

    if (
            olLayer.getSource() instanceof ol.source.ImageWMS ||
            olLayer.getSource() instanceof ol.source.TileWMS
            ) {
        var params = olLayer.getSource().getParams();

        for (var key in oValues) {

            if (!goog.isDefAndNotNull(oValues[key]) || oValues[key] === '')
                oValues[key] = '-1000000';

            if (goog.isArray(oValues[key])) {
                // en cas de tableau, affiche les valeurs séparées par des virgules
                params[key] = oValues[key].join('|');
            } else {
                params[key] = oValues[key];
            }

            if (!goog.isString(params[key]))
                delete params[key];
            if (!params[key].length > 0)
                delete params[key];
            if (!goog.isDefAndNotNull(params[key])) {
                // Valeur par défaut
                params[key] = '-1000000';
            }
        }

        olLayer.getSource().updateParams(params);
        olLayer.getSource().refresh();
    }

    oVmap.log("Filter values: ", oValues);
};

/**
 * Return the filter form values, from the filter form
 * @param {object} filterForm
 * @returns {object} filter form values
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.getFilterFormValues = function (filterForm) {
    oVmap.log('nsVmap.nsMapManager.LayersTree.LayertreeController.getFilterFormValues');

    var filterValues = {};
    for (var key in filterForm) {
        if (key !== 'datasources') {
            filterValues[key] = {};

            for (var i = 0; i < filterForm[key]['rows'].length; i++) {
                for (var ii = 0; ii < filterForm[key]['rows'][i]['fields'].length; ii++) {
                    var name = filterForm[key]['rows'][i]['fields'][ii]['name'];
                    var defaultValue = filterForm[key]['rows'][i]['fields'][ii]['default_value'];

                    // Ajoute la valeur si elle n'existe pas déjà ou qu'elle est vide
                    if (!goog.isDef(filterValues[key][name])) {
                        filterValues[key][name] = '';
                        if (goog.isDef(defaultValue)) {
                            filterValues[key][name] = defaultValue;
                        }
                    } else {
                        if (goog.isDef(defaultValue) && filterValues[key][name] === '') {
                            filterValues[key][name] = defaultValue;
                        }
                    }
                    delete name;
                    delete defaultValue;
                }
                delete ii;
            }
            delete i;
        }
    }
    return filterValues;
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
        this_.setFilterOnLayer(olLayer);
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

/**
 * Get the values from oFormValues
 * @param {object} oFormValues
 * @returns {object}
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.getBOValuesFromFormValues = function (oFormValues) {
    oVmap.log('nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.getBOValuesFromFormValues');

    var oFormValuesValues = goog.object.clone(oFormValues);

    for (var key in oFormValuesValues) {
        if (goog.isObject(oFormValuesValues[key])) {
            if (goog.isDefAndNotNull(oFormValuesValues[key]['selectedOption'])) {
                if (goog.isDefAndNotNull(oFormValuesValues[key]['selectedOption']['value'])) {
                    oFormValuesValues[key] = oFormValuesValues[key]['selectedOption']['value'];
                } else
                // Cas de liste à choix multiples    
                if (goog.isArray(oFormValuesValues[key]['selectedOption'])) {
                    var aValues = [];
                    for (var i = 0; i < oFormValuesValues[key]['selectedOption'].length; i++) {
                        if (goog.isDefAndNotNull(oFormValuesValues[key]['selectedOption'][i]['value'])) {
                            aValues.push(oFormValuesValues[key]['selectedOption'][i]['value']);
                        }
                    }
                    oFormValuesValues[key] = angular.copy(aValues);
                    delete aValues;
                } else {
                    delete oFormValuesValues[key];
                }
            }
        } else if (!goog.isDefAndNotNull(oFormValuesValues[key])) {
            delete oFormValuesValues[key];
        }
    }

    return oFormValuesValues;
};
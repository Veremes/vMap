/* global goog, ol, nsVitisComponent, vitisApp, URL, oVmap */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVitisComponent.MapJSON
 * Classe utile contenant plusieurs fonctions utiles permetant d'instancier
 * des composants OpenLayers3 à partir d'un fichier JSON
 */

'use strict';

goog.provide('MapJSON');

goog.require('ol');
goog.require('ol.View');
goog.require('ol.Map');
goog.require('ol.extent');
goog.require('ol.tilegrid.TileGrid');
goog.require('ol.format.GeoJSON');
goog.require('ol.format.WMTSCapabilities');

goog.require('ol.style.Style');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');
goog.require('ol.style.Circle');

goog.require('ol.source.BingMaps');
goog.require('ol.source.TileWMS');
goog.require('ol.source.ImageWMS');
goog.require('ol.source.Vector');
goog.require('ol.source.ImageVector');
goog.require('ol.source.WMTS');
goog.require('ol.source.XYZ');
goog.require('ol.source.OSM');

goog.require('ol.layer.Tile');
goog.require('ol.layer.Image');
goog.require('ol.layer.Vector');

// ol3-ext
goog.require('ol.ordering');
goog.require('ol.style.Shadow');
goog.require('ol.style.FontSymbol');
goog.require('ol.style.FontSymbol.FontAwesome');

// ol3-veremes
goog.require('ol.veremes');



MapJSON = function (opt_options) {

    if (!goog.isDefAndNotNull(opt_options)) {
        console.error('opt_options undefied');
        return 0;
    }
    if (!goog.isDefAndNotNull(opt_options['properties'])) {
        console.error('opt_options.properties undefied');
        return 0;
    }

    this['properties'] = opt_options['properties'];
};

/**
 * Get the ol view from the map definition
 * @param {object} oMapDefinition
 * @param {object} opt_options
 * @param {array} opt_options.size
 * @returns {ol.View}
 * @export
 */
MapJSON.prototype.getViewFromDef = function (oMapDefinition, opt_options) {

    opt_options = goog.isDefAndNotNull(opt_options) ? opt_options : {};

    if (!goog.isDefAndNotNull(oMapDefinition)) {
        console.error('oMapDefinition is not defined: ' + oMapDefinition);
        return null;
    }
    if (!goog.isDefAndNotNull(oMapDefinition['children'])) {
        console.error('oMapDefinition.children is not defined: ' + oMapDefinition);
        return null;
    }
    if (!goog.isDefAndNotNull(oMapDefinition['children'][0])) {
        console.error('oMapDefinition.children[0] is not defined: ' + oMapDefinition);
        return null;
    }
    if (!goog.isDefAndNotNull(oMapDefinition['children'][0]['view'])) {
        console.error('oMapDefinition.children[0].view is not defined: ' + oMapDefinition);
        return null;
    }

    var oViewDef = oMapDefinition['children'][0]['view'];

    var oViewOptions = {};
    oViewOptions.center = goog.isDefAndNotNull(oViewDef['center']) ? oViewDef['center'] : [0, 0];
    oViewOptions.zoom = goog.isDefAndNotNull(oViewDef['zoom']) ? oViewDef['zoom'] : 0;
    oViewOptions.constrainRotation = oViewDef['constrainRotation'];
    oViewOptions.enableRotation = goog.isDefAndNotNull(oViewDef['enableRotation']) ? oViewDef['enableRotation'] : false;
    oViewOptions.extent = oViewDef['maxExtent'];
    oViewOptions.maxResolution = oViewDef['maxResolution'];
    oViewOptions.minResolution = oViewDef['minResolution'];
    oViewOptions.maxZoom = oViewDef['maxZoom'];
    oViewOptions.minZoom = oViewDef['minZoom'];
    oViewOptions.projection = oViewDef['projection'];
    oViewOptions.resolution = oViewDef['resolution'];
    oViewOptions.resolutions = oViewDef['resolutions'];
    oViewOptions.rotation = oViewDef['rotation'];
    oViewOptions.zoomFactor = oViewDef['zoomFactor'];

    var olView = new ol.View(oViewOptions);

    // Étendue de la vue
    if (goog.isDefAndNotNull(oViewDef['extent'])) {
        if (goog.isDefAndNotNull(opt_options['size'])) {
            olView.fit(oViewDef['extent'], {
                size: opt_options['size'],
                nearest: true
            });
        } else {
            console.error('Cannot calc olView.extent if opt_options.size is not defined');
        }
    }

    return olView;
};

/**
 * Get an array of ol layers from the map definition
 * @param {object} oMapDefinition
 * @param {object} opt_options
 * @param {array} opt_options.size
 * @param {array} opt_options.tileSize
 * @returns {Array<ol.layer>}
 * @export
 */
MapJSON.prototype.getLayersFromDef = function (oMapDefinition, opt_options) {

    opt_options = goog.isDefAndNotNull(opt_options) ? opt_options : {};

    if (!goog.isDefAndNotNull(oMapDefinition)) {
        console.error('oMapDefinition is not defined: ' + oMapDefinition);
        return null;
    }
    if (!goog.isDefAndNotNull(oMapDefinition['children'])) {
        console.error('oMapDefinition.children is not defined: ' + oMapDefinition);
        return null;
    }
    if (!goog.isDefAndNotNull(opt_options['size'])) {
        console.error('opt_options.size not defined');
        return null;
    }
    if (!goog.isDefAndNotNull(opt_options['tileSize'])) {
        console.error('opt_options.tileSize not defined');
        return null;
    }

    var oSource, oLayer;
    var aLayersDef = this.getLayersDef_(oMapDefinition);
    var aLayers = [];

    for (var i = 0; i < aLayersDef.length; i++) {
        if (goog.isDefAndNotNull(aLayersDef[i]["url"])) {
            if (aLayersDef[i]["url"].indexOf("[token]") > -1) {
                aLayersDef[i]["url"] = aLayersDef[i]["url"].replace(/\[token\]/, sha256(sessionStorage["session_token"]));
            }
            if (aLayersDef[i]["url"].indexOf("[localhost]") > -1) {
                aLayersDef[i]["url"] = aLayersDef[i]["url"].replace(/\[localhost\]/, this['properties']["web_server_name"]);
            }
        }
        oSource = this.getSourceFromLayerDef_(oMapDefinition, aLayersDef[i], opt_options);
        if (goog.isDefAndNotNull(oSource)) {
            oLayer = this.getLayerFromLayerDef_(oMapDefinition, aLayersDef[i], oSource);
            if (goog.isDefAndNotNull(oLayer)) {
                aLayers.push(oLayer);
            }
        }
    }

    return aLayers;
};

/**
 * Get the ol tile grid from the map definition
 * @param {object} oMapDefinition
 * @param {object} opt_options
 * @param {array} opt_options.size
 * @param {array} opt_options.tileSize
 * @returns {ol.tilegrid.TileGrid}
 * @export
 */
MapJSON.prototype.getTileGridFromDef = function (oMapDefinition, opt_options) {

    opt_options = goog.isDefAndNotNull(opt_options) ? opt_options : {};

    var olView = this.getViewFromDef(oMapDefinition, opt_options);

    if (!goog.isDefAndNotNull(olView)) {
        return null;
    }
    if (!goog.isDefAndNotNull(opt_options['tileSize'])) {
        console.error('opt_options.tileSize not defined');
        return null;
    }
    if (!goog.isDefAndNotNull(opt_options['size'])) {
        console.error('opt_options.size not defined');
        return null;
    }

    var extent = olView.calculateExtent(opt_options['size']);

    var projExtent = olView.getProjection().getExtent();
    var startResolution = ol.extent.getWidth(projExtent) / 256;
    var resolutions = new Array(22);

    for (var i = 0, ii = resolutions.length; i < ii; ++i) {
        resolutions[i] = startResolution / Math.pow(2, i);
    }

    var tileGrid = new ol.tilegrid.TileGrid({
        origin: ol.extent.getTopLeft(extent),
        extent: projExtent,
        resolutions: resolutions,
        tileSize: opt_options['tileSize']
    });

    return tileGrid;
};





// Privées


/**
 * Get the layers definition from the map definition
 * @param {object} oMapDefinition
 * @returns {Array}
 */
MapJSON.prototype.getLayersDef_ = function (oMapDefinition) {

    var aServices = oMapDefinition['children'];
    var aLayersDef = [];

    // Ne prend pas le premier element (il s'agit de la vue)
    for (var i = 1; i < aServices.length; i++) {
        for (var ii = 0; ii < aServices[i]['children'].length; ii++) {
            aLayersDef.push(aServices[i]['children'][ii]);
        }
    }

    // Ordonne les couches suivant leur index
    aLayersDef = this.sortLayersDef_(aLayersDef);

    return aLayersDef;
};

/**
 * Sort the layers by index
 * @param {array} aLayersDef
 * @returns {array}
 */
MapJSON.prototype.sortLayersDef_ = function (aLayersDef) {
    function compare(a, b) {
        if (a['index'] < b['index'])
            return -1;
        if (a['index'] > b['index'])
            return 1;
        return 0;
    }
    aLayersDef.sort(compare);
    return aLayersDef;
};

/**
 * Get the ol source from the layer definition
 * @param {object} oMapDefinition
 * @param {object} oLayerDef
 * @param {object} opt_options
 * @param {array} opt_options.size
 * @param {array} opt_options.tileSize
 * @returns {ol.source.TileWMS|ol.source.ImageVector|ol.source.WMTS|ol.source.ImageWMS|ol.source.BingMaps|ol.source.OSM|ol.source.XYZ|undefined}
 */
MapJSON.prototype.getSourceFromLayerDef_ = function (oMapDefinition, oLayerDef, opt_options) {

    opt_options = goog.isDefAndNotNull(opt_options) ? opt_options : {};

    if (!goog.isDefAndNotNull(opt_options['tileSize'])) {
        console.error('opt_options.tileSize not defined');
        return null;
    }
    if (!goog.isDefAndNotNull(opt_options['size'])) {
        console.error('opt_options.size not defined');
        return null;
    }

    var type = oLayerDef['layerType'];
    var source;

    // Ajout d'un timestamp afin de maitriser les caches lors du rafraichissement
    // L'ajout de ce paramètre a également pour effet d'annuler les caches lors du chargement des couches
    if (goog.isDefAndNotNull(oLayerDef['params'])) {
        if (oLayerDef['is_dynamic'] === true) {
            oLayerDef['params']['TIMESTAMP'] = Date.now();
        }
    }

    // Options du service
    var oServiceOptions = {};
    if (typeof (oLayerDef['service_options']) === "string") {
        try {
            oServiceOptions = JSON.parse(oLayerDef['service_options']);
        } catch (e) {
            oServiceOptions = {};
        }
    } else if (typeof (oLayerDef['service_options']) !== "object") {
        oServiceOptions = oLayerDef['service_options'];
    }

    // Options de la couche
    var oLayerOptions = {};
    if (typeof (oLayerDef['layer_options']) === "string") {
        try {
            oLayerOptions = JSON.parse(oLayerDef['layer_options']);
        } catch (e) {
            oLayerOptions = {};
        }
    } else if (typeof (oLayerDef['layer_options']) !== "object") {
        oLayerOptions = oLayerDef['layer_options'];
    }

    // Paramétrage en fonction du type de couche
    if (type === 'tilewms' || type === 'imagewms') {
        // Styles des couches
        if (goog.isDefAndNotNull(oLayerOptions)) {
            if (goog.isDefAndNotNull(oLayerOptions['layer_style'])) {
                if (goog.isDefAndNotNull(oLayerDef['params']['LAYERS'])) {
                    var aLayers = oLayerDef['params']['LAYERS'].split(',');
                    var aStyles = [];
                    for (var i = 0; i < aLayers.length; i++) {
                        if (goog.isDefAndNotNull(oLayerOptions['layer_style'][aLayers[i]])) {
                            aStyles.push(oLayerOptions['layer_style'][aLayers[i]]['Name']);
                        } else {
                            aStyles.push('');
                        }
                    }
                    oLayerDef['params']['STYLES'] = aStyles.join(',');
                }
            }
        }
        if (!goog.isDefAndNotNull(oLayerDef['params']['STYLES']) &&
                !goog.isDefAndNotNull(oLayerDef['params']['styles'])) {
            oLayerDef['params']['STYLES'] = '';
        }
        if (!goog.isDefAndNotNull(oLayerDef['tileLoadFunction'])) {
            oLayerDef['tileLoadFunction'] = function (imageTile, src) {
                src = src.replace('STYLES&', 'STYLES=&');
                imageTile.getImage().src = src;
            };
        }

        // Retrocompatibilité: authentification des couches
        if (goog.isDefAndNotNull(oServiceOptions)) {
            if (goog.isDefAndNotNull(oServiceOptions['login'])) {
                oLayerDef['service_login'] = oServiceOptions['login'];
            }
            if (goog.isDefAndNotNull(oServiceOptions['password'])) {
                oLayerDef['service_password'] = oServiceOptions['password'];
            }
        }
    }

    // Login / MP
    if (goog.isDefAndNotNull(oLayerDef['service_login']) && goog.isDefAndNotNull(oLayerDef['service_password'])) {
        // Si login et password sont renseignés, alors effectue une requête "fantome" pour logguer l'ip client
        var newLoadFunction = function (image, src) {
            // Styles pour le WMS
            src = src.replace('STYLES&', 'STYLES=&');
            // Authentification
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    image.getImage().src = URL.createObjectURL(xhr.response);
                }
            };
            xhr.open('GET', src, true);
            xhr.setRequestHeader("Authorization", "Basic " + btoa(oLayerDef['service_login'] + ":" + oLayerDef['service_password']));
            xhr.send();
        };
        oLayerDef['tileLoadFunction'] = newLoadFunction;
        oLayerDef['imageLoadFunction'] = newLoadFunction;
    }

    if (type === 'bing') {

        source = new ol.source.BingMaps({
            key: oLayerDef["key"],
            wrapX: oLayerDef["wrapX"],
            culture: oLayerDef["culture"],
            maxZoom: oLayerDef["maxZoom"],
            tileLoadFunction: oLayerDef["tileLoadFunction"],
            imagerySet: oLayerDef["imagerySet"]
        });

    } else if (type === 'tilewms') {

        source = new ol.source.TileWMS({
            url: (this['properties']['use_proxy_for_tiles']) ? this.parseProxyUrl(oLayerDef['url']) : oLayerDef['url'],
            urls: (this['properties']['use_proxy_for_tiles']) ? this.parseProxyUrls(oLayerDef['urls']) : oLayerDef['urls'],
            logo: oLayerDef['logo'],
            hidpi: oLayerDef['hidpi'],
            wrapX: oLayerDef['wrapX'],
            gutter: oLayerDef['gutter'],
            maxZoom: oLayerDef['maxZoom'],
            tileGrid: this.getTileGridFromDef(oMapDefinition, opt_options),
            projection: oLayerDef['projection'],
            serverType: oLayerDef['serverType'],
            crossOrigin: oLayerDef['crossOrigin'],
            tileLoadFunction: oLayerDef['tileLoadFunction'],
            params: oLayerDef['params']
        });

    } else if (type === 'imagewms') {

        source = new ol.source.ImageWMS({
            url: (this['properties']['use_proxy_for_tiles']) ? this.parseProxyUrl(oLayerDef['url']) : oLayerDef['url'],
            logo: oLayerDef['logo'],
            hidpi: oLayerDef['hidpi'],
            ratio: oLayerDef['ratio'],
            projection: oLayerDef['projection'],
            serverType: oLayerDef['serverType'],
            resolutions: oLayerDef['resolutions'],
            crossOrigin: oLayerDef['crossOrigin'],
            attributions: oLayerDef['attributions'],
            imageLoadFunction: oLayerDef['imageLoadFunction'],
            params: oLayerDef['params']
        });

    } else if (type === 'imagevector') {

        if (oLayerDef["features"]) {
            source = new ol.source.Vector({
                features: oLayerDef["features"]
            });
        } else if (oLayerDef["url"]) {
            source = new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: (this['properties']['use_proxy_for_tiles']) ? this.parseProxyUrl(oLayerDef["url"]) : oLayerDef["url"]
            });
        } else {
            console.error("Error: veuillez renseinger une url ou une feature");
            return;
        }

    } else if (type === 'wmts') {

        var oOptions;
        if (!goog.isDefAndNotNull(oLayerDef["service_options"])) {
            console.error('oLayerDef.service_options undefined');
            return null;
        }

        try {
            var oCapabilities = JSON.parse(oLayerDef["service_options"]);
            var oOptions = ol.source.WMTS.optionsFromCapabilities(oCapabilities, {
                'layer': oLayerDef['layer'],
                'matrixSet': oLayerDef['matrixSet'],
                'requestEncoding': oLayerDef['requestEncoding'],
                'style': oLayerDef['style'],
                'format': oLayerDef['format']
            });

            // Des fois optionsFromCapabilities est ronchon et ne donne pas le bon style
            if (goog.isDefAndNotNull(oLayerDef['style'])) {
                oOptions.style = oLayerDef['style'];
            }
            if (goog.isDefAndNotNull(oLayerDef['tileLoadFunction'])) {
                oOptions.tileLoadFunction = oLayerDef['tileLoadFunction'];
            }
        } catch (e) {
            console.error('error while parsing options');
        }

        var source = new ol.source.WMTS(oOptions);

    } else if (type === 'xyz') {

        source = new ol.source.XYZ({
            url: oLayerDef["url"],
            tileLoadFunction: oLayerDef['tileLoadFunction']
        });

    } else if (type === 'osm') {

        if (!goog.isDefAndNotNull(oLayerDef["url"]) || oLayerDef["url"] === '')
            oLayerDef["url"] = "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png";

        source = new ol.source.OSM({
            url: oLayerDef["url"]
        });

    } else {
        console.error("Error: layerType (" + type + ") is not supported");
        source = null;
    }
    return source;
};

/**
 * Get the ol layer from the layer definition
 * @param {object} oMapDefinition
 * @param {object} oLayerDef
 * @param {object} oSource
 * @returns {ol.layer.Tile|ol.layer.Image}
 */
MapJSON.prototype.getLayerFromLayerDef_ = function (oMapDefinition, oLayerDef, oSource) {

    var layer;
    var this_ = this;
    var type = oLayerDef['layerType'];

    if (type === 'imagewms') {
        layer = new ol.layer.Image({
            source: oSource
        });
    } else if (type === 'imagevector') {
        layer = new ol.layer.Vector({
            renderMode: 'image',
            style: oLayerDef["style"],
            source: oSource
        });
    } else {
        layer = new ol.layer.Tile({
            source: oSource
        });
    }
    layer.set('type', type);
    layer.set('name', oLayerDef["name"]);

    // definit si la légende est visible ou non
    layer.set('legend', true);

    // definit si la légende est selectionnable ou non
    // queryable: la couche peut être ou pas interrogeable
    // select: la couche est interrogeable par défaut
    layer.set('queryable', true);
    if ((type !== "imagewms") && (type !== "tilewms"))
        layer.set('queryable', false);

    oLayerDef["select"] = true;
    layer.set('select', true);

    // Défini si la couche est interrogeable par le business object
    if (oLayerDef['bo_queryable'] === true) {
        layer.set('bo_queryable', true);

//        // Défini les droits sur le business object
//        if (goog.isDefAndNotNull(oLayerDef['bo_user_rights'])) {
//            layer.set('bo_user_rights', oLayerDef['bo_user_rights']);
//        }

        // Défini les business object
        if (goog.isDefAndNotNull(oLayerDef['business_objects'])) {
            layer.set('business_objects', oLayerDef['business_objects']);
        }
    }

    layer.set('layer_id', oLayerDef['layer_id']);

//    if (goog.isDefAndNotNull(oLayerDef['bo_id']))
//        layer.set('bo_id', oLayerDef['bo_id']);
//    if (goog.isDefAndNotNull(oLayerDef['bo_title']))
//        layer.set('bo_title', oLayerDef['bo_title']);
//    if (goog.isDefAndNotNull(oLayerDef['bo_id_field']))
//        layer.set('bo_id_field', oLayerDef['bo_id_field']);
//    if (goog.isDefAndNotNull(oLayerDef['bo_search_field']))
//        layer.set('bo_search_field', oLayerDef['bo_search_field']);
//    if (goog.isDefAndNotNull(oLayerDef['bo_result_field']))
//        layer.set('bo_result_field', oLayerDef['bo_result_field']);
//    if (goog.isDefAndNotNull(oLayerDef['bo_search_use_strict']))
//        layer.set('bo_search_use_strict', oLayerDef['bo_search_use_strict']);
//    if (goog.isDefAndNotNull(oLayerDef['bo_selection_buffer']))
//        layer.set('bo_selection_buffer', oLayerDef['bo_selection_buffer']);
//    if (goog.isDefAndNotNull(oLayerDef['bo_geom_column']))
//        layer.set('bo_geom_column', oLayerDef['bo_geom_column']);
//    if (goog.isDefAndNotNull(oLayerDef['bo_geom_type']))
//        layer.set('bo_geom_type', oLayerDef['bo_geom_type']);
//    if (goog.isDefAndNotNull(oLayerDef['bo_index']))
//        layer.set('bo_index', oLayerDef['bo_index']);

    if (goog.isDefAndNotNull(oLayerDef['service_login'])) {
        layer.set('service_login', oLayerDef['service_login']);
    }
    if (goog.isDefAndNotNull(oLayerDef['service_password'])) {
        layer.set('service_password', oLayerDef['service_password']);
    }

    if (goog.isDefAndNotNull(oLayerDef['events'])) {
        layer.set('events', oLayerDef['events']);
    }
    if (goog.isDefAndNotNull(oLayerDef['params'])) {
        if (goog.isDefAndNotNull(oLayerDef['params']['LAYERS'])) {
            var aLayers = oLayerDef['params']['LAYERS'].split(',');
            if (goog.isArray(aLayers)) {
                layer.set('sublayers', aLayers);
                layer.set('activeSublayers', aLayers);
            }
        }
    }
    if (goog.isDefAndNotNull(oLayerDef['is_dynamic']))
        layer.set('is_dynamic', oLayerDef['is_dynamic']);
    if (goog.isDefAndNotNull(oLayerDef['is_filtered'])) {
        if (goog.isDefAndNotNull(oLayerDef['filter_form'])) {
            if (goog.isString(oLayerDef['filter_form']) && oLayerDef['filter_form'].length !== 0) {
                oLayerDef['filter_form'] = JSON.parse(oLayerDef['filter_form']);
                oLayerDef['filter_values'] = this.getFilterFormValues_(oLayerDef['filter_form']);
                layer.set('filter_form', oLayerDef['filter_form']);
                layer.set('filter_form_embedjs', oLayerDef['filter_form_embedjs']);
                layer.set('is_filtered', oLayerDef['is_filtered']);
                layer.set('is_bo_filtered', oLayerDef['is_bo_filtered']);
                layer.set('filter_values', oLayerDef['filter_values']);
                layer['applyFilter'] = function () {
                    this_.setFilterOnLayer_(this);
                };
                layer['applyFilter']();
            }
        }
    }

    // Visibilité de la couche
    if (oLayerDef['visible'] === "true" || oLayerDef['visible'] === true) {
        oLayerDef['visible'] = true;
    } else {
        oLayerDef['visible'] = false;
    }
    layer.setVisible(oLayerDef['visible']);

    // Opacité de la couche
    if (goog.isDefAndNotNull(oLayerDef['opacity']))
        layer.setOpacity(oLayerDef['opacity']);

    // Mémorise la couche dans la definition
    oLayerDef['olLayer'] = layer;

    // export à la compilation pour les values
    layer['values'] = layer.values_;

    return layer;
};

/**
 * Change the layer source URL to apply the filter_values
 * @param {ol.layer} olLayer
 */
MapJSON.prototype.setFilterOnLayer_ = function (olLayer) {

    if (!goog.isDefAndNotNull(olLayer.get('filter_values'))) {
        return null;
    }
    if (!goog.isDefAndNotNull(olLayer.get('filter_values')['search'])) {
        return null;
    }

    var oValues = this.getBOValuesFromFormValues_(olLayer.get('filter_values')['search']);
    olLayer.set('filter_values_cleared', oValues);

    if (typeof oVmap !== "undefined") { // Obligatoire lors d'une impression
        if (goog.isDefAndNotNull(oVmap)) {
            if (goog.isDefAndNotNull(oVmap['scope'])) {
                oVmap['scope'].$broadcast('layersChanged');
            }
        }
    }

    if (
            olLayer.getSource() instanceof ol.source.ImageWMS ||
            olLayer.getSource() instanceof ol.source.TileWMS
            ) {
        var params = olLayer.getSource().getParams();

        for (var key in oValues) {

//            if (!goog.isDefAndNotNull(oValues[key]) || oValues[key] === ''){
//                oValues[key] = '-1000000';
//            }

            if (goog.isArray(oValues[key])) {
                // en cas de tableau, affiche les valeurs séparées par des virgules
                params[key] = oValues[key].join('|');
            } else {
                params[key] = oValues[key];
            }

            if (goog.isDefAndNotNull(params[key])) {
                if (goog.isArray(params[key]) && goog.isObject(params[key])) {
                    delete params[key];
                    continue;
                }
                if (goog.isString(params[key])) {
                    if (params[key] === '') {
                        delete params[key];
                        continue;
                    }
                }
            } else {
//                params[key] = '-1000000';
            }
        }

        olLayer.getSource().updateParams(params);
        olLayer.getSource().refresh();
    }

};

/**
 * Return the filter form values, from the filter form
 * @param {object} filterForm
 * @returns {object} filter form values
 */
MapJSON.prototype.getFilterFormValues_ = function (filterForm) {

    var filterValues = {};
    for (var key in filterForm) {
        if (key !== 'datasources') {
            filterValues[key] = {};

            for (var i = 0; i < filterForm[key]['rows'].length; i++) {
                for (var ii = 0; ii < filterForm[key]['rows'][i]['fields'].length; ii++) {
                    var name = filterForm[key]['rows'][i]['fields'][ii]['name'];
                    var defaultValue = filterForm[key]['rows'][i]['fields'][ii]['default_value'];

                    // Ajoute la valeur si elle n'existe pas déjà ou qu'elle est vide
                    if (!goog.isDefAndNotNull(filterValues[key][name])) {
                        filterValues[key][name] = '';
                        if (goog.isDefAndNotNull(defaultValue)) {
                            filterValues[key][name] = defaultValue;
                        }
                    } else {
                        if (goog.isDefAndNotNull(defaultValue) && filterValues[key][name] === '') {
                            filterValues[key][name] = defaultValue;
                        }
                    }
                }
            }
        }
    }
    return filterValues;
};

/**
 * Get the values from oFormValues
 * @param {object} oFormValues
 * @returns {object}
 */
MapJSON.prototype.getBOValuesFromFormValues_ = function (oFormValues) {

    try {
        var oFormValuesValues = goog.object.clone(oFormValues);
    } catch (e) {
        return {};
    }

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

/**
 * Add the proxy to the wms/wmts... url
 * @param {string} url
 * @returns {String}
 */
MapJSON.prototype.parseProxyUrl = function (url) {

    var parsedProxyUrl = url;

    if (typeof oVmap !== "undefined") { // Obligatoire lors d'une impression
        if (goog.isDefAndNotNull(oVmap)) {
            if (goog.isDefAndNotNull(oVmap.getMapManager)) {
                if (goog.isDefAndNotNull(oVmap.getMapManager().parseProxyUrl)) {
                    parsedProxyUrl = oVmap.getMapManager().parseProxyUrl(url);
                }
            }
        }
    }

    return parsedProxyUrl;
};

/**
 * Add the proxy to the wms/wmts... urls
 * @param {array<string>} aUrls
 * @returns {Array<string>}
 */
MapJSON.prototype.parseProxyUrls = function (aUrls) {

    var parsedProxyUrls = aUrls;

    if (typeof oVmap !== "undefined") { // Obligatoire lors d'une impression
        if (goog.isDefAndNotNull(oVmap)) {
            if (goog.isDefAndNotNull(oVmap.getMapManager)) {
                if (goog.isDefAndNotNull(oVmap.getMapManager().parseProxyUrls)) {
                    parsedProxyUrls = oVmap.getMapManager().parseProxyUrls(aUrls);
                }
            }
        }
    }

    return parsedProxyUrls;
};
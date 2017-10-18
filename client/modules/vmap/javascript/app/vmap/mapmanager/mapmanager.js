/* global nsVmap, oVmap, ol, goog, angular, vitisApp, bootbox, oUrlParams */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.MapManager
 * cette classe permet l'initialisation des outils de couches
 */

goog.provide('nsVmap.nsMapManager.MapManager');

goog.require('nsVmap.nsMapManager.LayersTree');
goog.require('nsVmap.nsMapManager.LayersOrder');
goog.require('nsVmap.nsMapManager.MapLegend');
goog.require('nsVmap.nsMapManager.nsMapModal.MapModalManager');
goog.require('ol.source.Vector');
goog.require('ol.layer.Image');
goog.require('ol.source.ImageVector');
goog.require('ol.format.GPX');
goog.require('ol.format.GeoJSON');
goog.require('ol.format.IGC');
goog.require('ol.format.KML');
goog.require('ol.format.TopoJSON');
goog.require('goog.dom');

/**
 * @classdesc
 * Class {@link nsVmap.nsMapManager.MapManager}: initializes the layers tools
 *
 * @constructor
 * @export
 */
nsVmap.nsMapManager.MapManager = function () {
    oVmap.log('nsVmap.nsMapManager.MapManager');

    /**
     * Object which contains the map catalog
     * @type {array<object>}
     * @private
     */
    this.oMapCatalog_ = [];

    /**
     * Object which contains the layers tree
     * @type {object}
     * @private
     */
    this.oLayersTree_ = {};

    /** 
     * Objet which contains the map modal manager tool
     * @type {nsVmap.nsMapManager.nsMapModal.MapModalManager} 
     * @private
     */
    this.oMapModalTool_ = {};

    /** 
     * Objet which contains the layers tree tool and initialize the map
     * @type {nsVmap.nsMapManager.LayersTree} 
     * @private
     */
    this.oLayersTreeTool_ = {};

    /** 
     * Objet which contains the layers order tool
     * @type {nsVmap.nsMapManager.LayersOrder} 
     * @private
     */
    this.oLayersOrderTool_ = {};

    /** 
     * Objet which contains the map legend tool
     * @type {nsVmap.nsMapManager.MapLegend} 
     * @private
     */
    this.oMapLegendTool_ = {};


    // Charge le catalogue et les objets de MapManager
    if (goog.isDef(oVmap['properties']['token'])) {

        var this_ = this;
        ajaxRequest({
            'method': 'GET',
            'url': oVmap['properties']['api_url'] + "/vmap/mapcatalog",
            'async': false,
            'responseType': '',
            'success': function (response) {
                var oMapCatalog = JSON.parse(response['data']);
                if (goog.isDef(oMapCatalog['mapcatalogs']))
                    oMapCatalog = oMapCatalog['mapcatalogs'][0];
                this_.loadMapTools(oMapCatalog);
            },
            'error': function (response) {
                var oMapCatalog = {
                    'maps': [],
                    'services': {
                        'wms': [],
                        'bing': [],
                        'osm': []
                    },
                    'usedMap': null
                };
                this_.loadMapTools(oMapCatalog);
            }
        });

    } else {

        // cas ou le token ne soit pas renseigné
        this.loadMapTools({
            "maps": [],
            "services": {},
            "status": 0
        });
    }
};

/**
 * Load the json files and initialize oMapCatalog_ and oLayersTree_
 * @param {object} oMapCatalog
 * @export
 */
nsVmap.nsMapManager.MapManager.prototype.loadMapTools = function (oMapCatalog) {
    oVmap.log('nsVmap.nsMapManager.MapManager.loadMapTools');
    oVmap.log("oMapCatalog: ", oMapCatalog);

    // Vérifie si l'utilisateur a le droit à au moins une carte
    if (oMapCatalog['maps'].length === 0) {
        oMapCatalog['maps'].push({
            "name": "Carte vide",
            "description": "",
            "thumbnail": "",
            "projection": "EPSG:3857",
            "url": null
        });

        // Si status === 1 cela veut dire que le chargement c'est bien effectué, 
        // l'utilisateur n'a donc tout simplement aucune carte associée
        if (oMapCatalog['status'] === 1) {
            // Vérifie si le mode vmap a été chargé
            if (goog.isDefAndNotNull(angular.element(vitisApp.appMainDrtv).injector())) {
                setTimeout(function () {
                    var $envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
                    if ($envSrvc['oSelectedMode']['mode_id'] === 'vmap')
                        bootbox.alert('<h4>Aucune carte n\'est associée à cet utilisateur, veuillez contacter l\'administrateur de l\'application</h4>');
                }, 3000);
            }
        }
    }

    this.oMapCatalog_ = oMapCatalog;

    var usedMap = oMapCatalog['usedMap'];

    // Utilisation de la carte donnée dans l'URL
    if (goog.isDefAndNotNull(oUrlParams['map_id'])) {
        for (var i = 0; i < oMapCatalog['maps'].length; i++) {
            if (oMapCatalog['maps'][i]['map_id'] === parseFloat(oUrlParams['map_id'])) {
                usedMap = angular.copy(i);
                oMapCatalog['usedMap'] = usedMap;
            }
        }
    }

    if (goog.isDefAndNotNull(usedMap) && goog.isDefAndNotNull(oMapCatalog['maps'][usedMap]['url'])) {

        // Signale la carte utilisée
        this.setUsedMap();

        // Chargement de l'arbre de couches
        this.loadLayersTools(oMapCatalog['maps'][usedMap]['url']);

        // Instanciation des objets
        this.oMapModalTool_ = new nsVmap.nsMapManager.nsMapModal.MapModalManager(oMapCatalog);

    } else {

        this.oLayersTree_ = {
            "name": "Tree",
            "children": [{
                    "view": {
                        "center": [225989.8114356043, 6761426.974988975],
                        "zoom": 11,
                        "projection": "EPSG:2154"
                    }
                }]
        };

        // Instanciation des objets
        this.oLayersTreeTool_ = new nsVmap.nsMapManager.LayersTree();
        this.oLayersOrderTool_ = new nsVmap.nsMapManager.LayersOrder();
        this.oMapLegendTool_ = new nsVmap.nsMapManager.MapLegend();

        // Instanciation des objets
        this.oMapModalTool_ = new nsVmap.nsMapManager.nsMapModal.MapModalManager(oMapCatalog);

    }
};

/**
 * Load the layers tree from the json file
 * @param {string} sUrl url to the file
 * @export
 */
nsVmap.nsMapManager.MapManager.prototype.loadLayersTools = function (sUrl) {
    oVmap.log('nsVmap.nsMapManager.MapManager.loadLayersTools');

    var MapManager = this;

    if (goog.isDefAndNotNull(sUrl)) {

        ajaxRequest({
            'method': 'GET',
            'url': sUrl,
            'async': false,
            'responseType': '',
            'success': function (response) {

                var oLayersTree = JSON.parse(response['data']);
                if (goog.isDef(oLayersTree['mapjsons']))
                    oLayersTree = oLayersTree['mapjsons'][0];
                oVmap.log(oLayersTree);
                MapManager.oLayersTree_ = oLayersTree;

                // Instanciation des objets
                MapManager.oLayersTreeTool_ = new nsVmap.nsMapManager.LayersTree();
                MapManager.oLayersOrderTool_ = new nsVmap.nsMapManager.LayersOrder();
                MapManager.oMapLegendTool_ = new nsVmap.nsMapManager.MapLegend();
            }
        });
    }
};

/**
 * Load a new map
 * @param {object} element Html element witch contains the url to the map.json file
 * @param {object} element.url link to the map.json file
 * @export
 */
nsVmap.nsMapManager.MapManager.prototype.loadMap = function (element) {
    oVmap.log('nsVmap.nsMapManager.MapManager.loadMap');

    // Récupère l'url
    var sUrl = element.getAttribute("url");

    if (!goog.isDefAndNotNull(sUrl)) {
        return 0;
    }
    if (sUrl.length === 0) {
        return 0;
    }

    // Récupère l'arbre de couches
    var oTree = this.ajaxGetLayersTree(sUrl);

    oVmap.log("oTree: ", oTree);

    // Change la variable oLayersTree
    this.setLayersTree(oTree);

    // Rafraichit la carte
    this.reloadMap();

    // Signale que c'est la carte utilisée
    for (var i = 0; i < this.oMapCatalog_['maps'].length; i++) {
        if (this.oMapCatalog_['maps'][i]['url'] === sUrl)
            this.oMapCatalog_['usedMap'] = i;
    }
    this.setUsedMap();

    oVmap.log("oVmap.event: mapChanged");
    oVmap['scope'].$broadcast('mapChanged');

};

/**
 * Put the used map to used
 * @returns {undefined}
 */
nsVmap.nsMapManager.MapManager.prototype.setUsedMap = function () {
    oVmap.log('nsVmap.nsMapManager.MapManager.prototype.setUsedMap');

    // Met toutes les cartes à used = false
    for (var i = 0; i < this.oMapCatalog_['maps'].length; i++) {
        this.oMapCatalog_['maps'][i]['used'] = false;
    }

    // Met la carte utilisée à used = true
    this.oMapCatalog_['maps'][this.oMapCatalog_['usedMap']]['used'] = true;

    oVmap.resizeLayerTools(false);
};

/**
 * Add a new layer with url service
 * @param {object} oLayer Layer to add, contains: 
 * oLayer.layerType : layer type (tilewms, imagewms, osm, bing, wmts, imagevector)
 * oLayer.url : the url of the layer
 * oLayer.serviceName : service name
 * oLayer.layerName : the layer name 
 * oLayer.layerTitle : the displayed layer name
 * oLayer.queryable : true if the layer is queryable
 * oLayer.key : use key
 * oLayer.culture : language to use
 * oLayer.style : style to use
 *
 * @export
 * @experimental
 */
nsVmap.nsMapManager.MapManager.prototype.addLayer = function (oLayer) {
    oVmap.log("nsVmap.nsMapManager.MapManager.prototype.addLayer");

    var newLayer = {};
    var aExistingUrls = [];
    var doesServiceExist = false;
    var oTree = jQuery.extend(true, {}, oVmap.getMapManager().getLayersTree());
    var aLayers = oVmap.getMap().getOLMap().getLayers().getArray();
    var aCenter = oVmap.getMap().getOLMap().getView().getCenter();
    var sResolution = oVmap.getMap().getOLMap().getView().getResolution();
    var sZoom = oVmap.getMap().getOLMap().getView().getZoom();

    // Test si le service est déjà inclus, si il l'est, la variable
    // doesServiceExist prend la valeur de l'index du service
    for (var i = 0; i < oTree['children'].length; i++) {
        if (oTree['children'][i]['name'] === oLayer.serviceName)
            doesServiceExist = i;
    }

    // Test si la couche est interrogeable (non checkée par défaut)
    oLayer.select = null;
    if (oLayer.queryable === "true")
        oLayer.select = false;

    // Recrée la vue
    oTree['children'][0]['view']['zoom'] = sZoom;
    oTree['children'][0]['view']['center'] = aCenter;
    oTree['children'][0]['view']['resolution'] = sResolution;

    // Recrée un arble de couches
    if ((oLayer.layerType === "tilewms") || (oLayer.layerType === "imagewms")) {

        // Test si la couche existe
        var aWMSServicesParams = [];

        // Mémorise les couches présentes
        for (var i = 0; i < aLayers.length; i++) {
            if (aLayers[i].get('type') === "tilewms") {
                // TileWMS peut supporter plusieurs URL, si se cas se présente on vérifie chacune des url
                var aUrls = aLayers[i].getSource().getUrls();
                for (var ii = 0; ii < aUrls.length; ii++) {
                    aWMSServicesParams.push({
                        url: aUrls[ii],
                        layers: aLayers[i].getSource().getParams()['LAYERS']
                    });
                }
            }
            if (aLayers[i].get('type') === "imagewms") {

                aWMSServicesParams.push({
                    url: aLayers[i].getSource().getUrl(),
                    layers: aLayers[i].getSource().getParams()['LAYERS']
                });
            }
        }
        // Les compare à la couche ajoutée
        for (var i = 0; i < aWMSServicesParams.length; i++) {
            if (aWMSServicesParams[i].url === oVmap['properties']['use_proxy_for_tiles'] ? oVmap.getMapManager().parseProxyUrl(oLayer.url) : oLayer.url && aWMSServicesParams[i].layers === oLayer.layerName) {
                $.notify('La couche est déjà présente', 'wms-log-message');
                return null;
            }
        }

        // Login/Password
        oLayer.service_options = '';
        if (goog.isString(oLayer.login) && goog.isString(oLayer.password)) {
            if (oLayer.login.trim().length > 0 && oLayer.password.trim().length > 0) {
                oLayer.service_options = JSON.stringify({
                    'login': oLayer.login,
                    'password': oLayer.password
                });
            }
        }

        // Ajout de la couche dans oTree
        if (doesServiceExist === false) {
            newLayer = {
                "name": oLayer.serviceName,
                "children": [{
                        "name": oLayer.layerTitle,
                        "index": 1000000,
                        "layerType": "tilewms",
                        "visible": "true",
                        "legend": "true",
                        "select": oLayer.select,
                        "url": oLayer.url,
                        "service_options": oLayer.service_options,
                        "params": {
                            "LAYERS": oLayer.layerName,
                            "VERSION": oLayer.version,
                            "STYLES": goog.isDefAndNotNull(oLayer.style) ? oLayer.style : ''
                        }
                    }]
            };
            oTree['children'].push(newLayer);
        } else {
            newLayer = {
                "name": oLayer.layerTitle,
                "index": 1000000,
                "layerType": "tilewms",
                "visible": "true",
                "legend": "true",
                "select": oLayer.select,
                "url": oLayer.url,
                "service_options": oLayer.service_options,
                "params": {
                    "LAYERS": oLayer.layerName,
                    "VERSION": oLayer.version,
                    "STYLES": goog.isDefAndNotNull(oLayer.style) ? oLayer.style : ''
                }
            };

            oTree['children'][doesServiceExist]['children'].push(newLayer);
        }
    } else if (oLayer.layerType === "osm") {
        // Test si la couche est déjà incluse
        for (var i = 0; i < oTree['children'].length; i++) {
            if (oTree['children'][i]['children']) {
                for (var ii = 0; ii < oTree['children'][i]['children'].length; ii++) {
                    if (oTree['children'][i]['children'][ii]['url'] === oLayer.url) {
                        $.notify('La couche est déjà présente', 'error');
                        return 0;
                    }
                    if (oLayer.url == '' && oTree['children'][i]['children'][ii]['url'] == 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png') {
                        $.notify('La couche est déjà présente', 'error');
                        return 0;
                    }
                }
            }
        }
        // Ajout de la couche dans oTree
        if (doesServiceExist === false) {
            newLayer = {
                "name": oLayer.serviceName,
                "children": [{
                        "index": 1000000,
                        "name": oLayer.layerTitle,
                        "visible": "true",
                        "layerType": "osm",
                        "url": oLayer.url
                    }]
            };
            oTree['children'].push(newLayer);
        } else {
            newLayer = {
                "name": oLayer.layerTitle,
                "index": 1000000,
                "visible": "true",
                "layerType": "osm",
                "url": oLayer.url
            };

            oTree['children'][doesServiceExist]['children'].push(newLayer);
        }
    } else if (oLayer.layerType === "xyz") {
        // Test si la couche est déjà incluse
        for (var i = 0; i < oTree['children'].length; i++) {
            if (oTree['children'][i]['children']) {
                for (var ii = 0; ii < oTree['children'][i]['children'].length; ii++) {
                    if (oTree['children'][i]['children'][ii]['url'] === oLayer.url) {
                        $.notify('La couche est déjà présente', 'error');
                        return 0;
                    }
                }
            }
        }
        // Ajout de la couche dans oTree
        if (doesServiceExist === false) {
            newLayer = {
                "name": oLayer.serviceName,
                "children": [{
                        "index": 1000000,
                        "name": oLayer.layerTitle,
                        "visible": "true",
                        "layerType": "xyz",
                        "url": oLayer.url
                    }]
            };
            oTree['children'].push(newLayer);
        } else {
            newLayer = {
                "name": oLayer.layerTitle,
                "index": 1000000,
                "visible": "true",
                "layerType": "xyz",
                "url": oLayer.url
            };

            oTree['children'][doesServiceExist]['children'].push(newLayer);
        }
    } else if (oLayer.layerType === "bing") {
        // Test si la couche est déjà incluse
        for (var i = 0; i < oTree['children'].length; i++) {
            if (oTree['children'][i]['children']) {
                for (var ii = 0; ii < oTree['children'][i]['children'].length; ii++) {
                    if (oTree['children'][i]['children'][ii]['imagerySet'] === oLayer.layerName) {
                        $.notify('La couche est déjà présente', 'error');
                        return 0;
                    }
                }
            }
        }
        // Ajout de la couche dans oTree
        if (doesServiceExist === false) {
            newLayer = {
                "name": oLayer.serviceName,
                "children": [{
                        "name": oLayer.layerName,
                        "index": 1000000,
                        "imagerySet": oLayer.layerName,
                        "visible": "true",
                        "layerType": "bing",
                        "key": oLayer.key,
                        "culture": oLayer.culture
                    }]
            };
            oTree['children'].push(newLayer);
        } else {
            newLayer = {
                "name": oLayer.layerName,
                "index": 1000000,
                "imagerySet": oLayer.layerName,
                "visible": "true",
                "layerType": "bing",
                "key": oLayer.key,
                "culture": oLayer.culture
            };

            oTree['children'][doesServiceExist]['children'].push(newLayer);
        }
    } else if (oLayer.layerType === "wmts") {
        // Test si la couche est déjà incluse
        for (var i = 0; i < oTree['children'].length; i++) {
            if (oTree['children'][i]['children']) {
                for (var ii = 0; ii < oTree['children'][i]['children'].length; ii++) {
                    if (oTree['children'][i]['children'][ii]['layer'] === oLayer.layerName) {
                        $.notify('La couche est déjà présente', 'error');
                        return 0;
                    }
                }
            }
        }
        // Ajout de la couche dans oTree
        if (doesServiceExist === false) {
            newLayer = {
                "name": oLayer.serviceName,
                "children": [{
                        "name": oLayer.layerTitle,
                        "index": 1000000,
                        "layer": oLayer.layerName,
                        "visible": "true",
                        "layerType": "wmts",
                        "matrixSet": oLayer.matrixSet,
                        "style": oLayer.style,
                        "format": oLayer.format,
                        "requestEncoding": oLayer.requestEncoding,
                        "service_options": oLayer.service_options,
                        "version": oLayer.version,
                        "url": oLayer.url
                    }]
            };
            oTree['children'].push(newLayer);
        } else {
            newLayer = {
                "name": oLayer.layerTitle,
                "index": 1000000,
                "layer": oLayer.layerName,
                "visible": "true",
                "layerType": "wmts",
                "matrixSet": oLayer.matrixSet,
                "style": oLayer.style,
                "format": oLayer.format,
                "requestEncoding": oLayer.requestEncoding,
                "service_options": oLayer.service_options,
                "version": oLayer.version,
                "url": oLayer.url
            };

            oTree['children'][doesServiceExist]['children'].push(newLayer);
        }
    } else if (oLayer.layerType === "imagevector") {

        // Test si la couche est déjà incluse
        for (var i = 0; i < oTree['children'].length; i++) {
            if (oTree['children'][i]['children']) {
                for (var ii = 0; ii < oTree['children'][i]['children'].length; ii++) {
                    if (oTree['children'][i]['children'][ii]['layerType'] === 'imagevector')
                        if (oTree['children'][i]['children'][ii]['url'] !== undefined) {
                            if (oTree['children'][i]['children'][ii]['url'] === oVmap['properties']['use_proxy_for_tiles'] ? oVmap.getMapManager().parseProxyUrl(oLayer.url) : oLayer.url) {
                                $.notify('La couche est déjà présente', 'error');
                                return 0;
                            }
                        }
                }
            }
        }
        // Ajout de la couche dans oTree
        if (doesServiceExist === false) {
            newLayer = {
                "name": oLayer.serviceName,
                "children": [{
                        "name": oLayer.layerTitle,
                        "index": 1000000,
                        "visible": "true",
                        "layerType": "imagevector",
                        "url": oLayer.url,
                        "features": oLayer.features,
                        "style": oLayer.style
                    }]
            };
            oTree['children'].push(newLayer);
        } else {
            newLayer = {
                "name": oLayer.layerTitle,
                "index": 1000000,
                "visible": "true",
                "layerType": "imagevector",
                "url": oLayer.url,
                "features": oLayer.features,
                "style": oLayer.style
            };
            oTree['children'][doesServiceExist]['children'].push(newLayer);
        }
    } else {
        console.error('type :"' + oLayer.layerType + '" non pris en compte');
    }

    // Change la variable oLayersTree
    oVmap.getMapManager().setLayersTree(oTree);
    oVmap.getMapManager().reloadMap();

    // resize les outils de couches
    oVmap.resizeLayerTools(false);
};

/**
 * Remove a layer from the map and the layers tree
 * @param {ol.layer.Base} olLayer Layer to remove
 * @export
 */
nsVmap.nsMapManager.MapManager.prototype.removeLayer = function (olLayer) {
    oVmap.log("removeLayer");

    var oLayersTree = this.oLayersTree_;
    var resolution = oVmap.getMap().getOLMap().getView().getResolution();
    var center = oVmap.getMap().getOLMap().getView().getCenter();

    // Supprime la couche de MapManager.oLayersTree
    for (var i = 0; i < oLayersTree['children'].length; i++) {
        if (oLayersTree['children'][i]['children']) {
            var oService = oLayersTree['children'][i]['children'];
            for (var ii = 0; ii < oService.length; ii++) {
                if (oService[ii]['olLayer']['$$hashKey'] === olLayer['$$hashKey'])
                    oService.splice(ii, 1);
            }
        }
    }

    // Supprime la couche de la carte
    oVmap.getMap().getOLMap().removeLayer(olLayer);

    // Verifie si le parent n'est pas vide et le supprime si c'est le cas
    for (var i = 0; i < oLayersTree['children'].length; i++) {
        if (oLayersTree['children'][i]['children']) {
            if (oLayersTree['children'][i]['children'].length === 0) {
                oVmap.getMap().getOLMap().getLayers().getArray().length = 0;
                oLayersTree['children'].splice(i, 1);
                // Comme il y a un watch sur oLayersTree_, lors du splice, LayersTree recharge l'arbre des couches
                // Il est donc important de vider les couches visibles avant le splice pour pas se retrouver 
                // avec des couches en double
                this.reloadMap();
            }
        }
    }

    // Retourne au zoom d'avant la suppression
    oVmap.getMap().getOLMap().getView().setResolution(resolution);
    oVmap.getMap().getOLMap().getView().setCenter(center);
};

/**
 * Add a Layer from a vector content
 * @param {string|object} content
 * @param {string} serviceName
 * @param {string} layerTitle
 * @export
 */
nsVmap.nsMapManager.MapManager.prototype.addLayerFromVectorContent = function (content, serviceName, layerTitle) {
    oVmap.log('nsVmap.nsMapManager.MapManager.addLayerFromVectorContent');

    var sFeatures;

    try {
        sFeatures = $.parseJSON(content);
    } catch (e) {
        sFeatures = content;
    }

    // Récupère l'objet features depuis la chaine de caractères
    var formatConstructors = [
        ol.format.GPX,
        ol.format.GeoJSON,
        ol.format.IGC,
        ol.format.KML,
        ol.format.TopoJSON
    ];

    // Essaye de lire la source celon les formats suivants
    for (var i = 0; i < formatConstructors.length; i++) {
        var format = new formatConstructors[i]();
        try {
            var features = format.readFeatures(sFeatures, {
                featureProjection: oVmap.getMap().getOLMap().getView().getProjection()
            });
            // Si la lecture a réussi, alors oFeaturesReaded prend la valeur de la géométrie
            if (features.length > 0) {
                var oFeaturesReaded = features;
                i = formatConstructors.length;
            }
        } catch (err) {
        }
    }

    if (goog.isDefAndNotNull(oFeaturesReaded)) {

        // Ajoute la couche
        var oLayer = {
            layerType: 'imagevector',
            serviceName: serviceName,
            layerTitle: layerTitle,
            features: oFeaturesReaded,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.1)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#319FD3',
                    width: 2
                })
            })
        };
        this.addLayer(oLayer);
        return true;
    } else {
        $.notify('Impossible de lire les géométries', 'error');
        console.error('Impossible de lire les géométries: ', content);
        return false;
    }
};

/**
 * Load a new map from a file
 * @param {object} element Html element witch contains the file-container, url
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.MapManager.prototype.loadMapFromFile = function (element) {
    oVmap.log('nsVmap.nsMapManager.MapManager.loadMapFromFile');

    var fileContainer = element.getAttribute("file-container");
    var url = element.getAttribute("url");

    $("#maplist-log-message").empty();

    // si on utilise l'url
    if (url !== "") {

        // var firstCharacters=url.substr(0,3);
        var firstCharacters = url;

        // Si l'url vient du web
        if (firstCharacters === 'htt' || firstCharacters === 'www') {
            // Récupère l'arbre de couches
            oTree = oVmap.getMapManager().ajaxGetLayersTree(url);

            // Cange les variables oLayersTree et aLayersList des objets dans les layers tools
            oVmap.getMapManager().setLayersTree(oTree);

            // Simule le click de la souris sur le bouton "btn-reload-map"
            oVmap.getMapManager().reloadMap();
        } else {
            // For security reasons JavaScript's access to the file system on the client is restricted
            var error = 'Erreur lors du chargement du fichier: Pour de raisons de sécurité,';
            error += ' lors de l\'utilisation d\'un fichier local, vous devez utiliser le bouton "Chercher"';
            $.notify(error, 'error');
            return;
        }
    } else if (fileContainer !== "") {// si on utilise le fichier uploadé

        var files = document.getElementById(fileContainer).files;
        if (!files.length) {
            $.notify('Veuillez sélectionner un fichier', 'error');
            return;
        }
        var file = files[0];
        var reader = new FileReader();

        // If we use onloadend, we need to check the readyState.
        reader.onloadend = function (evt) {
            if (evt.target.readyState === FileReader.DONE) { // DONE == 2

                // Récupère l'objet oTree depuis la chaine de caractères
                var oTree = $.parseJSON(evt.target.result);
                // Cange les variables oLayersTree et aLayersList des objets dans les layers tools
                oVmap.getMapManager().setLayersTree(oTree);
                // Simule le click de la souris sur le bouton "btn-reload-map"
                oVmap.getMapManager().reloadMap();
            }
        };
        reader.readAsText(file);
    } else {
        $.notify('Veuillez sélectionner un fichier', 'error');
        return;
    }
    oVmap.simuleClick('close-modal-button');
};

/**
 * Reload the map
 * @export
 */
nsVmap.nsMapManager.MapManager.prototype.reloadMap = function () {
    oVmap.log('nsVmap.nsMapManager.MapManager.reloadMap');

    var scope = angular.element($("#layertree")).scope();
    scope.$evalAsync(function (scope) {
        scope['ctrl'].reloadTree();
    });
};

/**
 * Load the catalog array from the json file
 * @param {string} sUrl url to the file
 * @return {object<oMapCatalog>}
 */
nsVmap.nsMapManager.MapManager.prototype.ajaxGetMapCatalog = function (sUrl) {
    var oMapCatalog;

    ajaxRequest({
        'method': 'GET',
        'url': sUrl,
        'async': false,
        'responseType': '',
        'success': function (response) {
            var data = JSON.parse(response['data']);
            if (goog.isDef(data['mapcatalogs'])) {
                oMapCatalog = data['mapcatalogs'][0];
            }
        }
    });

    return oMapCatalog;
};

/**
 * Load the layers tree from the json file
 * @param {string} sUrl url to the file
 * @return {object<LayersTree>}
 */
nsVmap.nsMapManager.MapManager.prototype.ajaxGetLayersTree = function (sUrl) {
    var LayersTree;

    ajaxRequest({
        'method': 'GET',
        'url': sUrl,
        'async': false,
        'responseType': '',
        'success': function (response) {
            var data = JSON.parse(response['data']);
            if (goog.isDef(data['mapjsons'])) {
                LayersTree = data['mapjsons'][0];
            }
        }
    });

    oVmap.log(LayersTree);

    return LayersTree;
};

/**
 * Remove the selection layers
 */
nsVmap.nsMapManager.MapManager.prototype.removeSelectionLayers = function () {
    oVmap.log("removeSelectionLayers");
    var map = oVmap.getMap().getOLMap();
    var aLayers = map.getLayers().getArray();
    for (var i = aLayers.length - 1; i >= 0; i--) {
        if (aLayers[i].get('type') === 'selection') {
            map.removeLayer(aLayers[i]);
        }
    }
    ;
};

/**
 * Remove the selection features
 */
nsVmap.nsMapManager.MapManager.prototype.removeSelectionFeatures = function () {
    oVmap.log("removeSelectionFeatures");
    var featureOverlay = oVmap.getMap().getSelectionOverlay();
    var aFeatures = featureOverlay.getSource().getFeatures();
    for (var i = aFeatures.length - 1; i >= 0; i--) {
        featureOverlay.getSource().removeFeature(aFeatures[i])
    }
};

/**
 * Collapse in/out the tool
 * @param {object} element html trigger element witch have a "data-target" attr with is the #id of the target
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.MapManager.prototype.collapseElement = function (element) {
    var collapse = element.getAttribute("collapse");
    var targetElement = $(element.getAttribute("data-target"))[0];

    if (collapse === "in") {
        element.setAttribute("collapse", "out");
        $(element).find('.list-group-icon2').removeClass('icon-keyboard_arrow_down');
        $(element).find('.list-group-icon2').addClass('icon-keyboard_arrow_right');
    } else if (collapse === "out") {
        element.setAttribute("collapse", "in");
        $(element).find('.list-group-icon2').removeClass('icon-keyboard_arrow_right');
        $(element).find('.list-group-icon2').addClass('icon-keyboard_arrow_down');
    } else
        console.error("value 'collapse' of element is not allowed: " + element);

    targetElement.setAttribute("collapse", element.getAttribute("collapse"));
    oVmap.resizeLayerTools(true);
};

/**
 * Add the proxy to the wms/wmts... url
 * @param {string} url
 * @returns {String}
 */
nsVmap.nsMapManager.MapManager.prototype.parseProxyUrl = function (url) {

    if (!goog.isDef(url))
        return undefined;

    var proxyUrl = oVmap['properties']['proxy_url'];

    url = url.replace(/\?/g, "&");

    var parsedProxyUrl = proxyUrl + '?url=' + url;

    return parsedProxyUrl;
};

/**
 * Add the proxy to the wms/wmts... urls
 * @param {array<string>} aUrls
 * @returns {Array<string>}
 */
nsVmap.nsMapManager.MapManager.prototype.parseProxyUrls = function (aUrls) {

    if (!goog.isDef(aUrls))
        return undefined;

    var parsedProxyUrls = [];

    for (var i = 0; i < aUrls.length; i++) {
        parsedProxyUrls.push(this.parseProxyUrl(aUrls[i]));
    }

    return parsedProxyUrls;
};

/**
 * Reload the layers implicated by the event_id
 * @param {string} sEventId 
 * @export
 */
nsVmap.nsMapManager.MapManager.prototype.reloadEventLayers = function (sEventId) {

    var aLayers = oVmap.getMap().getOLMap().getLayers().getArray();
    var keepLoadedTiles = true;

    if (goog.isDefAndNotNull(oVmap['properties']['controls']))
        if (goog.isDefAndNotNull(oVmap['properties']['controls']['RefreshSocket']))
            if (goog.isDefAndNotNull(oVmap['properties']['controls']['RefreshSocket']['keep_loaded_tiles']))
                keepLoadedTiles = oVmap['properties']['controls']['RefreshSocket']['keep_loaded_tiles'];

    for (var i = 0; i < aLayers.length; i++) {
        var aEvents = aLayers[i].get('events');
        if (goog.isDefAndNotNull(aEvents)) {
            if (aEvents.indexOf(sEventId) !== -1) {
                aLayers[i].refreshWithTimestamp(keepLoadedTiles);
            }
        }
        delete aEvents;
    }
};

/**
 * Get a tiled layer from an image layer
 * @param {ol.layer.Image} imageLayer Image layer
 * @param {object} tile_options
 * @param {array} tile_options.tileSize size of the tiles
 * @param {array} tile_options.tileOrigin origin of the tiles
 * @returns {ol.layer.Tile} Tiled layer
 */
nsVmap.nsMapManager.MapManager.prototype.getImageWMSFromTiledWMS = function (imageLayer, tile_options) {
    oVmap.log('nsVmap.nsMapManager.MapManager.prototype.getImageWMSFromTiledWMS');
    oVmap.log("tile_options: ", tile_options);

    var imageSource = imageLayer.getSource();
    var olMap = oVmap.getMap().getOLMap();
    var resolutions = [];
    var projection = olMap.getView().getProjection();
    var maxResolution = ol.extent.getWidth(projection.getExtent()) / 256;
    var tileSize = goog.isDef(tile_options.tileSize) ? tile_options.tileSize : [2000, 2000];
    var origin = goog.isDef(tile_options.tileOrigin) ? tile_options.tileOrigin : [projection.getExtent()[0], projection.getExtent()[3]];

    for (var i = 0; i < 18; i++) {
        resolutions[i] = maxResolution / Math.pow(2, i);
    }

    var tileGrid = new ol.tilegrid.TileGrid({
        origin: origin,
        resolutions: resolutions,
        tileSize: tileSize
    });


    var tileSource = new ol.source.TileWMS({
        attributions: imageSource.attributions_,
        params: imageSource.params_,
        crossOrigin: imageSource.crossOrigin_,
        hidpi: imageSource.hidpi_,
        logo: imageSource.logo_,
        tileGrid: tileGrid,
        projection: imageSource.projection_,
        serverType: imageSource.serverType_,
        url: imageSource.url_,
        wrapX: imageSource.wrapX_
    });

    var tiledLayer = new ol.layer.Tile({
        opacity: imageSource.values_.opacity,
        source: tileSource,
        visible: imageSource.values_.visible,
        minResolution: imageSource.values_.minResolution,
        maxResolution: imageSource.values_.maxResolution
    });

    return tiledLayer;
};

/**
 * Use getImageWMSFromTiledWMS to set non visible the imageWMS layers and add the tileWMS copys layers
 * @param {object} tile_options
 * @param {array} tile_options.tileSize size of the tiles
 * @param {array} tile_options.tileOrigin origin of the tiles
 */
nsVmap.nsMapManager.MapManager.prototype.changeImageWMSLayersToTiledWMS = function (tile_options) {
    oVmap.log('nsVmap.nsMapManager.MapManager.prototype.changeImageWMSLayersToTiledWMS');

    var this_ = this;
    var olMap = oVmap.getMap().getOLMap();
    var olLayers = olMap.getLayers();

    /**
     * Container of the layers removed by changeImageWMSFromTiledWMS()
     */
    this.removedImageLayers_ = [];

    /**
     * Container of the layers added by changeImageWMSFromTiledWMS()
     */
    this.addedImageLayers_ = [];

    olLayers.forEach(function (oLayer) {
        if (oLayer.getSource() instanceof ol.source.ImageWMS && oLayer.getVisible()) {

            // Copie de la couche en version tuilée
            var tiledLayer = this_.getImageWMSFromTiledWMS(oLayer, tile_options);

            // Mémorise la couche dans this.removedImageLayers_
            this_.removedImageLayers_.push(oLayer);

            // Mémorise la couche dans this.removedImageLayers_
            this_.addedImageLayers_.push(tiledLayer);

            // Ajoute la couche tiled
            olMap.addLayer(tiledLayer);

            // Rend invisible la couche image
            oLayer.setVisible(false);
        }
    });
};

/**
 * Revert the changed made by changeImageWMSLayersToTiledWMS()
 */
nsVmap.nsMapManager.MapManager.prototype.revertImageWMSToTiledWMS = function () {
    oVmap.log('nsVmap.nsMapManager.MapManager.prototype.revertImageWMSToTiledWMS');

    var olMap = oVmap.getMap().getOLMap();

    // rend visible les couches précédament rendues invisibles
    if (goog.isDefAndNotNull(this.removedImageLayers_)) {
        for (var i = 0; i < this.removedImageLayers_.length; i++) {
            this.removedImageLayers_[i].setVisible(true);
        }
    }

    // Supprime les couches précédament ajoutées
    if (goog.isDefAndNotNull(this.addedImageLayers_)) {
        for (var i = 0; i < this.addedImageLayers_.length; i++) {
            olMap.removeLayer(this.addedImageLayers_[i]);
        }
    }
};


/************************************************
 ------------ GETTERS AND SETTERS ----------------
 *************************************************/
/**
 * oLayersTree_ getter
 * @return {nsVmap.nsMapManager.LayersTree} LayersTree tool
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.MapManager.prototype.getLayersTreeTool = function () {
    return this.oLayersTreeTool_;
};

/**
 * oLayersOrderTool_ getter
 * @return {nsVmap.nsMapManager.LayersOrder} LayersOrder tool
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.MapManager.prototype.getLayersOrderTool = function () {
    return this.oLayersOrderTool_;
};

/**
 * oMapLegendTool_ getter
 * @return {nsVmap.nsMapManager.MapLegend} MapLegend tool
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.MapManager.prototype.getMapLegendTool = function () {
    return this.oMapLegendTool_;
};

/**
 * oMapModalTool_ getter
 * @return {nsVmap.nsMapManager.nsMapModal.MapModal} MapModal tool
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.MapManager.prototype.getMapModalTool = function () {
    return this.oMapModalTool_;
};

/**
 * LayersTree_ getter (also set the visibility of the layers with the new ones)
 * @return {object} Layers tree
 * @api experimental
 * @export
 */
nsVmap.nsMapManager.MapManager.prototype.getLayersTree = function () {

    var oMap = oVmap.getMap().getOLMap();
    var aLayers = oMap.getLayers().getArray();

    /**
     * Recursive function that update parameters recursively
     * @param {object} node
     */
    var updateOnTree = function (node) {
        // Recursive
        if (goog.isDef(node['children'])) {
            for (var i = 0; i < node['children'].length; i++) {
                updateOnTree(node['children'][i]);
            }
        }
        // Update
        if (goog.isDef(node['olLayer'])) {
            node['visible'] = node['olLayer'].getVisible();
            node['index'] = aLayers.indexOf(node['olLayer']);
            node['opacity'] = node['olLayer'].getOpacity();
        }
    };

    for (var i = 0; i < this.oLayersTree_['children'].length; i++) {
        updateOnTree(this.oLayersTree_['children'][i]);
    }

    return this.oLayersTree_;
};

/**
 * Get the JSON layers tree
 * @returns {String}
 * @export
 */
nsVmap.nsMapManager.MapManager.prototype.getJSONLayersTree = function () {

    // recupère une copie de l'arbre des couches
    var oLayersTree = jQuery.extend(true, {}, oVmap.getMapManager().getLayersTree());
    var oMap = oVmap.getMap().getOLMap();
    var aDiscardedAttributes = [
        'olLayer',
        '$$hashKey',
        'visibleLayers'
    ];

    /**
     * Recursive function that cleans the nodes of layers tree
     * @param {object} node
     */
    var cleanNode = function (node) {
        if (goog.isDef(node['children'])) {
            for (var i = 0; i < node['children'].length; i++) {
                cleanNode(node['children'][i]);
            }
        }
        // Supprime les objets à structure circulaire (non transformables en JSON)
        for (var i = 0; i < aDiscardedAttributes.length; i++) {
            if (goog.isDef(node[aDiscardedAttributes[i]])) {
                delete node[aDiscardedAttributes[i]];
            }
        }
        if (goog.isDef(node['view'])) {
            node['view']['extent'] = oMap.getView().calculateExtent(oMap.getSize());
            node['view']['projection'] = oMap.getView().getProjection().getCode();
        }
        if (node['layerType'] === 'imagevector') {
            if (goog.isDefAndNotNull(node['features'])) {
                delete node['features'];
                node['features'] = [];
            }
        }
    };

    // Nettoie les paramètres définis par aDiscardedAttributes
    for (var i = 0; i < oLayersTree['children'].length; i++) {
        cleanNode(oLayersTree['children'][i]);
    }

    // Convertit en JSON tout en ignorant les objets de structure circulaire
    var cache = [];
    var sJSONLayersTree = JSON.stringify(oLayersTree, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found
                return;
            }
            cache.push(value);
        }
        return value;
    });
    cache = null;

    return sJSONLayersTree;
};

/**
 * LayersTree_ setter
 * @param {object} oTree Layers tree
 * @api experimental
 * @export
 */
nsVmap.nsMapManager.MapManager.prototype.setLayersTree = function (oTree) {
    this.oLayersTree_ = oTree;
};

/**
 * oMapCatalog_ getter
 * @return {array} map catalog
 * @api experimental
 * @export
 */
nsVmap.nsMapManager.MapManager.prototype.getMapCatalog = function () {
    return this.oMapCatalog_;
};

/**
 * oMapCatalog_ setter
 * @param {array} aCatalog Map catalog array
 * @api experimental
 */
nsVmap.nsMapManager.MapManager.prototype.setMapCatalog = function (aCatalog) {
    this.oMapCatalog_ = aCatalog;
};

/**
 * sMapToLoadUrl_ getter
 * @return {string} the url when calling loadMap
 * @api experimental
 */
nsVmap.nsMapManager.MapManager.prototype.getMapToLoadUrl = function () {
    return this.sMapToLoadUrl_;
};

/**
 * sMapToLoadUrl_ setter
 * @param {string} sMapToLoadUrl the url when calling loadMap
 * @api experimental
 */
nsVmap.nsMapManager.MapManager.prototype.setMapToLoadUrl = function (sMapToLoadUrl) {
    this.sMapToLoadUrl_ = sMapToLoadUrl;
};

/**
 * Get the list of the queryable by layer_id layers
 * @param {boolean} bOnlyVisible true if you want to get only the visible layers
 * @returns {Array} List of the queryable layers
 * @export
 */
nsVmap.nsMapManager.MapManager.prototype.getQueryableLayers = function (bOnlyVisible) {
    oVmap.log('nsVmap.nsMapManager.MapManager.prototype.getQueryableLayers');

    bOnlyVisible = goog.isDef(bOnlyVisible) ? bOnlyVisible : false;
    var aLayers = oVmap.getMap().getOLMap().getLayers().getArray();
    var aQueryableLayers = [];

    for (var i = 0; i < aLayers.length; i++) {
        if ((aLayers[i].get('bo_queryable') === true) && goog.isDef(aLayers[i].get('layer_id'))) {
            if (bOnlyVisible !== true || aLayers[i].getVisible() === true) {
                aQueryableLayers.push(aLayers[i]);
            }
        }
    }
    return aQueryableLayers;
};

/**
 * Get the businessObjects from the passed layers
 * @param {array} aLayers
 * @returns {array}
 */
nsVmap.nsMapManager.MapManager.prototype.getBusinessObjectsFromLayers = function (aLayers) {
    oVmap.log('nsVmap.nsMapManager.MapManager.prototype.getBusinessObjectsFromLayers');

    var oBusinessObjects = {};
    var aBos, bo_id;

    for (var i = 0; i < aLayers.length; i++) {
        aBos = aLayers[i].get('business_objects');
        for (var ii = 0; ii < aBos.length; ii++) {
            bo_id = aBos[ii]['business_object_id'];

            // Si le bo est déjà dans la liste
            if (goog.isDefAndNotNull(oBusinessObjects[bo_id])) {
                oBusinessObjects[bo_id]['layers'].push(aLayers[i]);
                continue;
            }

            oBusinessObjects[bo_id] = {
                'bo_id': bo_id,
                'layers': [aLayers[i]],
                'bo_title': aBos[ii]['title'],
                'bo_id_field': aBos[ii]['id_field'],
                'bo_user_rights': aBos[ii]['user_rights'],
                'bo_search_field': aBos[ii]['search_field'],
                'bo_result_field': aBos[ii]['result_field'],
                'bo_search_use_strict': aBos[ii]['search_use_strict'],
                'bo_selection_buffer': aBos[ii]['selection_buffer'],
                'bo_geom_column': aBos[ii]['geom_column'],
                'bo_geom_type': aBos[ii]['geom_type'],
                'bo_index': goog.isDefAndNotNull(aBos[ii]['index']) ? aBos[ii]['index'] : 1000000
            };
        }
    }

    return oBusinessObjects;
};

/**
 * Use getQueryableLayers to get the queryable business objects, group by bo_id if the same bo is used by two different layers
 * @param {boolean} bOnlyVisible true if you want to get only the visible layers
 * @returns {object} the queryables business objects
 * @export
 */
nsVmap.nsMapManager.MapManager.prototype.getQueryableBusinessObjects = function (bOnlyVisible) {
    oVmap.log('nsVmap.nsMapManager.MapManager.prototype.getQueryableBusinessObjects');

    var aQueryableLayers = this.getQueryableLayers(bOnlyVisible);
    var oQueryableBOs = this.getBusinessObjectsFromLayers(aQueryableLayers);

    return oQueryableBOs;
};

/**
 * Use getQueryableLayers to get the queryable business objects, group by bo_id if the same bo is used by two different layers
 * @param {boolean} bOnlyVisible true if you want to get only the visible layers
 * @returns {array} the queryables business objects
 * @export
 */
nsVmap.nsMapManager.MapManager.prototype.getQueryableBusinessObjectsAsArray = function (bOnlyVisible) {
    oVmap.log('nsVmap.nsMapManager.MapManager.prototype.getQueryableBusinessObjectsAsArray');

    var aQueryableBOs = [];
    var oQueryableBOs = this.getQueryableBusinessObjects(bOnlyVisible);

    for (var key in oQueryableBOs) {
        aQueryableBOs.push(oQueryableBOs[key]);
    }

    return aQueryableBOs;
};

/**
 * Get the insertable business objects
 * @returns {object}
 * @export
 */
nsVmap.nsMapManager.MapManager.prototype.getInsertableBusinessObjects = function () {
    oVmap.log('nsVmap.nsMapManager.MapManager.prototype.getInsertableBusinessObjects');

    var aBusinessObjects = this.getBusinessObjectsFromLayers(this.getQueryableLayers());
    var aInsertableBOs = [];

    for (var key in aBusinessObjects) {
        if (goog.isDefAndNotNull(aBusinessObjects[key]['bo_user_rights'])) {
            if (aBusinessObjects[key]['bo_user_rights'].indexOf('INSERT') !== -1) {
                aInsertableBOs.push(aBusinessObjects[key]);
            }
        }
    }

    return aInsertableBOs;
};
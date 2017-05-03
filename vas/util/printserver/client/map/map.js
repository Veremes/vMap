/* global ol */

/**
 * Class Map
 * @param {object} opt_options
 */
PrintMap = function (opt_options) {

    var this_ = this;
    
    this.mapSize = [document.getElementById('map').offsetWidth, document.getElementById('map').offsetHeight];

    this.tileSize = (isDef(window.oProperties.print.tile_size) && window.oProperties.print.features_zoom >= 0) ? window.oProperties.print.tile_size : 2048;

    this.cacheSize = 0;

    this.featuresZoom = (parseFloat(opt_options.featuresZoom) >= 0) ? opt_options.featuresZoom : (isDef(window.oProperties.print.features_zoom) && window.oProperties.print.features_zoom >= 0) ? window.oProperties.print.features_zoom : 100;

    this.resolutionCoeff = (parseFloat(opt_options.resolutionCoeff) > 0) ? opt_options.resolutionCoeff : 1;

    this.defaultScale = 1000;

    this.apiUrl = opt_options.apiUrl;

    this.token = opt_options.token;

    this.mapDefinition = isDef(opt_options.mapJSON) ? opt_options.mapJSON : this.getMapDefinition(opt_options.mapId);

    this.mapJsonParser = new MapJSON({
        'properties': window.oProperties
    });
        
    this.view = this.mapJsonParser.getViewFromDef(this.mapDefinition, {
        'size': this.mapSize,
        'tileSize': [this.tileSize, this.tileSize]
    });

    this.features = isDef(opt_options.features) ? this.getFeaturesFromEWKT(opt_options.features) : null;

    this.extent = this.getExtent(opt_options);

    this.tileGrid = this.getTileGridFromDefinition(this.tileSize);    
    
    this.layers = this.mapJsonParser.getLayersFromDef(this.mapDefinition, {
        'size': this.mapSize,
        'tileSize': [this.tileSize, this.tileSize]
    });
    
    this.map = this.setMap(this.layers, this.view);

    this.featuresOverlay = this.setFeaturesOverlay(this.map);

    this.scaleTools = new Scale(this.map, this.resolutionCoeff);

    // Ajoute les features
    if (isDef(opt_options.features)) {
        this.featuresOverlay.getSource().addFeatures(this.features);
    }

    // Centre la carte sur son étendue
    this.setMapExtent(this.extent);

    // Supprime tous les controls par défaut
    this.removeMapControls();

    // Si aucune étendue a été donnée et que seul un point a été donné, alors zoom sur this.defaultScale
    if (!isDef(opt_options.extent) && !isDef(this.features)) {
        if (this.features.length === 1 && this.features[0].getGeometry().getType() === 'Point') {
            this.scaleTools.setScale(this.defaultScale);
        }
    }

    // Renseigne l'échelle en cours
    tryCallPhantom({'cmd': 'setScale', 'scale': this.scaleTools.getScale({'pretty': true})});
};

/**
 * Get the extent to use
 * @param {object} opt_options
 * @returns {array} extent
 */
PrintMap.prototype.getExtent = function (opt_options) {

    var bError = false;

    if (isDef(opt_options.extent)) {
        if (opt_options.extent.length === 4) {
            return opt_options.extent;
        }
    }

    if (isDef(opt_options.features)) {
        return this.getExtentFromFeatures(this.features);
    }

    // Si on arrive ici c'est qu'il n'y a aucune possibilité de trouver une étendue valable
    callError('No way to find extent: Neigther extent nor features given on a acceptable format');
};

/**
 * Get the extent of the features
 * @param {array<ol.Feature>} aFeatures
 * @returns {Array} Extent
 */
PrintMap.prototype.getExtentFromFeatures = function (aFeatures) {

    var totalExtent = [];

    for (var i = 0; i < aFeatures.length; i++) {
        var geomExtent = aFeatures[i].getGeometry().getExtent();

        if (i === 0) {
            totalExtent = geomExtent;
            continue;
        }

        if (geomExtent[0] < totalExtent[0])
            totalExtent[0] = geomExtent[0];
        if (geomExtent[1] < totalExtent[1])
            totalExtent[1] = geomExtent[1];
        if (geomExtent[2] > totalExtent[2])
            totalExtent[2] = geomExtent[2];
        if (geomExtent[3] > totalExtent[3])
            totalExtent[3] = geomExtent[3];

        delete geomExtent;
    }

    var xDist = totalExtent[2] - totalExtent[0];
    var yDist = totalExtent[3] - totalExtent[1];

    totalExtent[0] -= (xDist * this.featuresZoom / 100) / 2;
    totalExtent[1] -= (yDist * this.featuresZoom / 100) / 2;
    totalExtent[2] += (xDist * this.featuresZoom / 100) / 2;
    totalExtent[3] += (yDist * this.featuresZoom / 100) / 2;

    // Par mesure de sécurité
    if (totalExtent.length < 4) {
        totalExtent = [0, 10, 0, 10];
    }

    // En cas de simple point par exemple
    if (totalExtent[0] === totalExtent[2]) {
        totalExtent[0] = totalExtent[0] - totalExtent[0] * 0.0001;
        totalExtent[2] = totalExtent[2] + totalExtent[2] * 0.0001;
    }
    if (totalExtent[1] === totalExtent[3]) {
        totalExtent[1] = totalExtent[1] - totalExtent[1] * 0.0001;
        totalExtent[3] = totalExtent[3] + totalExtent[3] * 0.0001;
    }

    return totalExtent;
};

/**
 * Get a tilegrid grom a tile size
 * @param {number} tileSize
 * @returns {ol.tilegrid.TileGrid}
 */
PrintMap.prototype.getTileGridFromDefinition = function (tileSize) {

    var projExtent = this.view.getProjection().getExtent();
    var startResolution = ol.extent.getWidth(projExtent) / 256;
    var resolutions = new Array(22);

    for (var i = 0, ii = resolutions.length; i < ii; ++i) {
        resolutions[i] = startResolution / Math.pow(2, i);
    }

    var tileGrid = new ol.tilegrid.TileGrid({
        origin: ol.extent.getTopLeft(this.extent),
        extent: projExtent,
        resolutions: resolutions,
        tileSize: [tileSize, tileSize]
    });

    return tileGrid;
};

/**
 * Get SYNCHRONELY the map definition from API URL
 * @param {string} mapId
 * @returns {Array|Object}
 */
PrintMap.prototype.getMapDefinition = function (mapId) {

    var apiUrl = this.apiUrl;

    var token = this.token;

    if (typeof apiUrl != "string" || apiUrl == null) {
        callError("getMapDefinition: Can't get the apiUrl");
    }
    if (typeof token != "string" || token == null) {
        callError("getMapDefinition: Can't get the token");
    }
    if (typeof mapId == "undefined" || mapId == null) {
        callError("getMapDefinition: Can't get the mapId");
    }

    var http = new nsUtils.Http();
    var mapDefinition;

    http.get({
        url: apiUrl + '/vmap/mapjsons/' + mapId + '?token=' + token,
        async: false,
        successCallback: function (response) {
            if (!isDef(response)) {
                callError("getMapDefinition: Can't get the response");
            }
            if (!isDef(response['mapjsons'])) {
                callError("getMapDefinition: Can't get the response.mapjsons");
            }
            if (!isDef(response['mapjsons'][0])) {
                callError("getMapDefinition: Can't get the response.mapjsons[0]");
            }
            mapDefinition = response['mapjsons'][0];
        }
    });

    return mapDefinition;
};

/**
 * Remove the map controls
 */
PrintMap.prototype.removeMapControls = function () {
    var aControls = this.map.getControls().getArray();

    for (var i = 0; i < aControls.length; i++) {
        this.map.removeControl(aControls[i]);
    }
};

/**
 * Fit the map on thie given extent
 * @param {type} extent
 */
PrintMap.prototype.setMapExtent = function (extent) {
    this.map.getView().fit(extent, this.map.getSize(), {
        constrainResolution: false,
        nearest: true
    });
};

/**
 * Set the app map
 * @param {array<ol.layer.Base>} aLayers
 * @param {ol.View} olView
 * @returns {ol.Map}
 */
PrintMap.prototype.setMap = function (aLayers, olView) {

    var map = new ol.Map({
        layers: aLayers,
        target: 'map',
        view: olView
    });

    return map;
};

/**
 * Set the map features overlay
 * @param {ol.Map} olMap
 * @returns {ol.layer.Vector}
 */
PrintMap.prototype.setFeaturesOverlay = function (olMap) {

    var featuresOverlay = new ol.layer.Vector({
        map: olMap,
        source: new ol.source.Vector({}),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.3)'
            }),
            stroke: new ol.style.Stroke({
                color: '#d9534f',
                width: 3
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#d9534f'
                })
            })
        })
    });

    return featuresOverlay;
};

/**
 * Get the olFeatures from an array of EWKT features
 * @param {array<string>} aEWKTFeatures Array of EWKT features
 * @returns {array<ol.Feature>}
 */
PrintMap.prototype.getFeaturesFromEWKT = function (aEWKTFeatures) {

    var aFeatures = [];
    var proj = this.view.getProjection().getCode();

    for (var i = 0; i < aEWKTFeatures.length; i++) {
        aFeatures.push(new ol.Feature({
            geometry: this.getGeomFromEWKT(aEWKTFeatures[i], proj)
        }));
    }

    return aFeatures;
};

/**
 * Return true if EWKTGeom is an EWKT geometry 
 * @param {string} EWKTGeom
 * @returns {boolean}
 */
PrintMap.prototype.isEWKTGeom = function (EWKTGeom) {

    if (EWKTGeom.substr(0, 5).toUpperCase() !== 'SRID=')
        return false;

    var WKTFormat = new ol.format.WKT();
    var WKTGeom = EWKTGeom.substr(EWKTGeom.indexOf(';') + 1);

    try {
        WKTFormat.readGeometry(WKTGeom);
    } catch (e) {
        console.error('readGeometry failed: ', EWKTGeom);
        return false;
    }

    return true;
};

/**
 * Return an OpenLayers geometry from a EWKT geom
 * @param {string} EWKTGeom
 * @param {string} proj
 * @returns {ol.geom.Geometry}
 */
PrintMap.prototype.getGeomFromEWKT = function (EWKTGeom, proj) {

    if (typeof EWKTGeom !== 'string') {
        console.error('EWKTGeom is not a string: ', EWKTGeom);
        return null;
    }
    if (typeof proj !== 'string') {
        console.error('proj is not a string: ', proj);
        return null;
    }

    if (this.isEWKTGeom(EWKTGeom)) {

        var WKTFormat = new ol.format.WKT();
        var WKTGeom = EWKTGeom.substr(EWKTGeom.indexOf(';') + 1);
        var EWKTGeomProj = 'EPSG:' + EWKTGeom.slice(5, EWKTGeom.indexOf(';'));

        var oGeom = WKTFormat.readGeometry(WKTGeom, {
            dataProjection: EWKTGeomProj,
            featureProjection: proj
        });

        return oGeom;

    } else {
        console.error('Geom is not an EWKT Geometry: ', EWKTGeom);
        return null;
    }

};
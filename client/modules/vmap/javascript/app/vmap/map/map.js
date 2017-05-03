/* global nsVmap, ol, oVmap, goog, angular, vitisApp */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.Map
 * cette classe permet l'initialisation de la carte
 */

goog.provide('nsVmap.Map');

goog.require('oVmap');

goog.require('nsVmap.olFunctions');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Tile');
goog.require('ol.source.OSM');
goog.require('ol.style.Style');
goog.require('ol.source.Vector');
goog.require('ol.layer.Vector');
goog.require('ol.Collection');
goog.require('ol.proj.Projection');
goog.require('goog.async.AnimationDelay');

/**
 * @classdesc
 * Class {@link nsVmap.Map}: initializes the map
 *
 * @constructor
 * @export 
 */
nsVmap.Map = function () {
    oVmap.log("nsVmap.Map");

    var this_ = this;

    /**
     * Map layers
     * @type {Array.<ol.layer>}
     * @private
     */
    this.olLayers_ = [];

    /**
     * Map view
     * @type {ol.View}
     * @private
     */
    this.olView_ = new ol.View({
        center: [0, 0],
        zoom: 2
    });

    /**
     * Map
     * @type {ol.map}
     * @private
     */
    this.oOpenLayersMap_ = new ol.Map({
        layers: this.olLayers_,
        view: this.olView_
    });

    /**
     * Selections style
     * @type {ol.style.Style}
     */
    this.oOpenLayersSelectionStyle_ = new ol.style.Style({
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
    });

    /**
     * @type {ol.Collection}
     * @private
     */
    this.oOpenLayersSelectionOverlayFeatures_ = new ol.Collection();

    /**
     * @type {ol.layer.Vector}
     * @private
     */
    this.oOpenLayersSelectionOverlay_ = new ol.layer.Vector({
        map: this.oOpenLayersMap_,
        style: this.oOpenLayersSelectionStyle_,
        source: new ol.source.Vector({
            features: this.oOpenLayersSelectionOverlayFeatures_,
            useSpatialIndex: false
        }),
        updateWhileAnimating: true,
        updateWhileInteracting: true
    });

    /**
     * Location style
     * @type {ol.style.Style}
     */
    this.oOpenLayersLocationStyle_ = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.3)'
        }),
        stroke: new ol.style.Stroke({
            color: '#337ab7',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 10,
            stroke: new ol.style.Stroke({
                color: '#337ab7',
                width: 2
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            })
        })
    });

    /**
     * @type {ol.Collection}
     * @private
     */
    this.oOpenLayersLocationOverlayFeatures_ = new ol.Collection();

    /**
     * @type {ol.layer.Vector}
     * @private
     */
    this.oOpenLayersLocationOverlay_ = new ol.layer.Vector({
        map: this.oOpenLayersMap_,
        style: this.oOpenLayersLocationStyle_,
        source: new ol.source.Vector({
            features: this.oOpenLayersLocationOverlayFeatures_,
            useSpatialIndex: false
        })
    });

    /**
     * @type {ol.Collection}
     * @private
     */
    this.oOpenLayersPopupOverlayFeatures_ = new ol.Collection();

    /**
     * @type {ol.layer.Vector}
     * @private
     */
    this.oOpenLayersPopupOverlay_ = new ol.layer.Vector({
        map: this.oOpenLayersMap_,
        style: this.oOpenLayersLocationStyle_,
        source: new ol.source.Vector({
            features: this.oOpenLayersPopupOverlayFeatures_,
            useSpatialIndex: false
        })
    });

    /**
     * Contient les évènements ajoutés sur la carte par la méthode addEventOnMap ou setEventOnMap
     * @type {array}
     * @private
     */
    this.vmapEvents_ = [];
    
    /**
     * Contient les évènements ajoutés sur la carte par la méthode addDrawInteraction ou setDrawInteraction
     * @type {array}
     * @private
     */
    this.vmapInteractions_ = [];

    /**
     * Contient les tooltips ajoutés par addTooltip
     * @type {array}
     * @private
     */
    this.vmapOverlays_ = [];

    /**
     * Initialisé dans le controlleur
     * @type {nsVmap.Map.MapTooltip}
     * @private
     */
    this.vmapTooltip_ = {};

    /**
     * @private
     */
    this.vmapTextOverlayFeatures_ = new ol.Collection();

    /**
     * @private
     */
    this.vmapTextOverlay_ = new ol.layer.Vector({
        map: this.oOpenLayersMap_,
        source: new ol.source.Vector({
            features: this.vmapTextOverlayFeatures_
        })
    });

    // Ajoute les projections
    this.addCustomProjections();

    // Désactive le DoubleClickAndZoom
    var aInteractions = this.oOpenLayersMap_.getInteractions().getArray();
    for (var i = 0; i < aInteractions.length; i++) {
        if (aInteractions[i] instanceof ol.interaction.DoubleClickZoom)
            this.oOpenLayersMap_.removeInteraction(aInteractions[i]);
    }

    this.oOpenLayersMap_.getViewport().setAttribute('id', 'map1');

    // Lors du click sur 'echap', désactive les actions et le tooltip
    $(document).keydown(function (e) {
        if (e.keyCode === 27) {
            // Supprime les actions sur la carte et cache les tooltip
            oVmap.getMap().removeActionsAndTooltips();
        }
    });

    // Ajoute les couches à reprojeter en cas de changement de carte dans layersToTransform_
    this.layersToTransform_ = [];
    this.layersToTransform_.push(this.oOpenLayersSelectionOverlay_);
    this.layersToTransform_.push(this.oOpenLayersLocationOverlay_);
    this.layersToTransform_.push(this.oOpenLayersPopupOverlay_);
    this.layersToTransform_.push(this.vmapTextOverlay_);
};

/**
 * Get the current scale
 * @param {object} opt_options
 * @param {boolean|undefined} opt_options.pretty true for pretty format (ex: 1:25,000)
 * @returns {Number|String}
 * @export
 */
nsVmap.Map.prototype.getScale = function (opt_options) {
    oVmap.log('nsVmap.Map.prototype.getScale');

    opt_options = goog.isDef(opt_options) ? opt_options : {};
    opt_options['pretty'] = goog.isDef(opt_options['pretty']) ? opt_options['pretty'] : false;

    var wgs84Sphere_ = new ol.Sphere(6378137);
    var projection = this.oOpenLayersMap_.getView().getProjection();

    var map = oVmap.getMap().getOLMap();

    // récupère les coordonnées d'une ligue de 1cm (avec le zoom en cours)
    var line = map.getView().calculateExtent([37.795275591, 0]);
    var c1 = ol.proj.transform([line[0], line[1]], projection, 'EPSG:4326');
    var c2 = ol.proj.transform([line[2], line[3]], projection, 'EPSG:4326');

    // Récuère la longueur sur la carte de la ligne de 1cm
    var length = wgs84Sphere_.haversineDistance(c1, c2);

    // donc 1m sur la carte correspond à (length mètres dans la réalité x 100)
    var scale = length * 100;

    // Rend l'échelle sous format (1:25,000)
    if (opt_options['pretty'] === true) {
        scale = this.getPrettyScale(scale);
    }

    return scale;
};

/**
 * Get the scale like (1:25,000)
 * @param {number} scale
 * @returns {String} scale (pretty)
 */
nsVmap.Map.prototype.getPrettyScale = function (scale) {

    // Rend l'échelle sous format (1:25,000)
    scale = String(Math.round(scale));
    var j = 1;
    for (var i = scale.length - 1; i > 0; i--) {
        if (j % 3 === 0)
            scale = scale.slice(0, i) + ',' + scale.slice(i + Math.abs(0));
        j++;
    }
    scale = '1:' + scale;

    return scale;
};

/**
 * Set the map scale
 * @param {number} scale
 * @returns {number} new scale
 * @export
 */
nsVmap.Map.prototype.setScale = function (scale) {
    oVmap.log('nsVmap.Map.prototype.setScale');

    // calcule et va à l'échelle celon une règle de 3
    var currentScale = this.getScale();
    var currentResolution = this.oOpenLayersMap_.getView().getResolution();

    var scaleResolution = scale * currentResolution / currentScale;
    this.oOpenLayersMap_.getView().setResolution(scaleResolution);

    // Ajuste l'échelle en augementant la résolution
    currentScale = this.getScale();

    oVmap.log(currentScale);
};

/**
 * Add projections
 */
nsVmap.Map.prototype.addCustomProjections = function () {

    var lambert93 = new ol.proj.Projection({
        code: 'EPSG:2154',
        // Cette extent est celle du niveau de zoom 0, on peut les trouver sur http://epsg.io/
        extent: [-378305.81, 6093283.21, 1212610.74, 7186901.68],
        units: 'm'
    });
    ol.proj.addProjection(lambert93);
    var WGSToLambert = this.WGSToLambert;
    var lambertToWGS = this.lambertToWGS;
    // Ajoute les fonctions de transformation de EPSG:4326 vers EPSG:2154
    ol.proj.addCoordinateTransforms('EPSG:4326', 'EPSG:2154', this.WGSToLambert, this.lambertToWGS);
    ol.proj.addCoordinateTransforms('EPSG:3857', 'EPSG:2154',
            function (coordinate3857) {
                var coordinate4326 = ol.proj.transform(coordinate3857, 'EPSG:3857', 'EPSG:4326');
                var coordinate2154 = ol.proj.transform(coordinate4326, 'EPSG:4326', 'EPSG:2154');
                return coordinate2154;
            },
            function (coordinate2154) {
                var coordinate4326 = ol.proj.transform(coordinate2154, 'EPSG:2154', 'EPSG:4326');
                var coordinate3857 = ol.proj.transform(coordinate4326, 'EPSG:4326', 'EPSG:3857');
                return coordinate3857;
            });
};

/**
 * Tansform WGS83 coordinates to Lambert93
 * @param {ol.coordinates} coordinates WGS coordinates to transform
 * @returns {ol.coordinates} Lambert93 coordinates
 */
nsVmap.Map.prototype.WGSToLambert = function (coordinates) {

    var longitude = coordinates[0];
    var latitude = coordinates[1];
    var deg2rad = function deg2rad(angle) {
        return (angle / 180) * Math.PI;
    };
    //variables:
    var a = 6378137; //demi grand axe de l'ellipsoide (m)
    var e = 0.08181919106; //première excentricité de l'ellipsoide
    var l0 = lc = deg2rad(3);
    var phi0 = deg2rad(46.5); //latitude d'origine en radian
    var phi1 = deg2rad(44); //1er parallele automécoïque
    var phi2 = deg2rad(49); //2eme parallele automécoïque

    var x0 = 700000; //coordonnées à l'origine
    var y0 = 6600000; //coordonnées à l'origine

    var phi = deg2rad(latitude);
    var l = deg2rad(longitude);
    //calcul des grandes normales
    var gN1 = a / Math.sqrt(1 - e * e * Math.sin(phi1) * Math.sin(phi1));
    var gN2 = a / Math.sqrt(1 - e * e * Math.sin(phi2) * Math.sin(phi2));
    //calculs des latitudes isométriques
    var gl1 = Math.log(Math.tan(Math.PI / 4 + phi1 / 2) * Math.pow((1 - e * Math.sin(phi1)) / (1 + e * Math.sin(phi1)), e / 2));
    var gl2 = Math.log(Math.tan(Math.PI / 4 + phi2 / 2) * Math.pow((1 - e * Math.sin(phi2)) / (1 + e * Math.sin(phi2)), e / 2));
    var gl0 = Math.log(Math.tan(Math.PI / 4 + phi0 / 2) * Math.pow((1 - e * Math.sin(phi0)) / (1 + e * Math.sin(phi0)), e / 2));
    var gl = Math.log(Math.tan(Math.PI / 4 + phi / 2) * Math.pow((1 - e * Math.sin(phi)) / (1 + e * Math.sin(phi)), e / 2));
    //calcul de l'exposant de la projection
    var n = (Math.log((gN2 * Math.cos(phi2)) / (gN1 * Math.cos(phi1)))) / (gl1 - gl2);
    //calcul de la constante de projection
    var c = ((gN1 * Math.cos(phi1)) / n) * Math.exp(n * gl1);
    //calcul des coordonnées
    var ys = y0 + c * Math.exp(-1 * n * gl0);
    var x93 = x0 + c * Math.exp(-1 * n * gl) * Math.sin(n * (l - lc));
    var y93 = ys - c * Math.exp(-1 * n * gl) * Math.cos(n * (l - lc));
    return [x93, y93];
};

/**
 * Tansform Lambert93 coordinates to WGS83
 * @param {ol.coordinates} coordinates Lambert93 coordinates to transform
 * @returns {ol.coordinates} WGS84 coordinates
 */
nsVmap.Map.prototype.lambertToWGS = function (coordinates) {

    Math.atanh = Math.atanh || function (x) {
        return Math.log((1 + x) / (1 - x)) / 2;
    };

    Math.tanh = Math.tanh || function (x) {
        if (x === Infinity) {
            return 1;
        } else if (x === -Infinity) {
            return -1;
        } else {
            return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
        }
    };

    var x = parseFloat(coordinates[0]).toFixed(10);
    var y = parseFloat(coordinates[1]).toFixed(10);
    var b6 = 6378137.0000;
    var b7 = 298.257222101;
    var b8 = 1 / b7;
    var b9 = 2 * b8 - b8 * b8;
    var b10 = Math.sqrt(b9);
    var b13 = 3.000000000;
    var b14 = 700000.0000;
    var b15 = 12655612.0499;
    var b16 = 0.7256077650532670;
    var b17 = 11754255.426096;
    var delx = x - b14;
    var dely = y - b15;
    var gamma = Math.atan(-(delx) / dely);
    var r = Math.sqrt((delx * delx) + (dely * dely));
    var latiso = Math.log(b17 / r) / b16;
    var sinphiit0 = Math.tanh(latiso + b10 * Math.atanh(b10 * Math.sin(1)));
    var sinphiit1 = Math.tanh(latiso + b10 * Math.atanh(b10 * sinphiit0));
    var sinphiit2 = Math.tanh(latiso + b10 * Math.atanh(b10 * sinphiit1));
    var sinphiit3 = Math.tanh(latiso + b10 * Math.atanh(b10 * sinphiit2));
    var sinphiit4 = Math.tanh(latiso + b10 * Math.atanh(b10 * sinphiit3));
    var sinphiit5 = Math.tanh(latiso + b10 * Math.atanh(b10 * sinphiit4));
    var sinphiit6 = Math.tanh(latiso + b10 * Math.atanh(b10 * sinphiit5));
    var longrad = gamma / b16 + b13 / 180 * Math.PI;
    var latrad = Math.asin(sinphiit6);
    var lon = (longrad / Math.PI * 180);
    var lat = (latrad / Math.PI * 180);
    return ([lon, lat]);
};

/**
 * Set a event on the map and remove the others.
 * @param {string|Array.<string>} type The event type or array of event types.
 * @param {function(?): ?} listener The listener function.
 * @param {Object=} opt_this The object to use as `this` in `listener`.
 * @param {string|undefined} currentAction name of the current action
 * @return {goog.events.Key} Unique key for the listener.
 * @export
 */
nsVmap.Map.prototype.setEventOnMap = function (type, listener, opt_this, currentAction) {
    oVmap.log('nsVmap.Map.prototype.setEventOnMap');
    if (!goog.isDef(type)) {
        console.error('setEventOnMap: type not defined');
        return 0;
    }

    if (!goog.isDef(listener)) {
        console.error('setEventOnMap: listener not defined');
        return 0;
    }

    opt_this = goog.isDef(opt_this) ? opt_this : '';
    // Supprime les anciens évènements et interractions
    this.removeActionsOnMap();
    // Ajoute le nouvel évènement
    var event = this.addEventOnMap(type, listener, opt_this);
    // Définit l'action en cours
    if (goog.isDef(currentAction))
        this.setCurrentAction(currentAction);
    return event;
};

/**
 * Add a certain type of event on the map.
 * @param {string|Array.<string>} type The event type or array of event types.
 * @param {function(?): ?} listener The listener function.
 * @param {Object=} opt_this The object to use as `this` in `listener`.
 * @param {string|undefined} currentAction name of the current action
 * @return {goog.events.Key} Unique key for the listener.
 * @export
 */
nsVmap.Map.prototype.addEventOnMap = function (type, listener, opt_this, currentAction) {

    if (!goog.isDef(type)) {
        console.error('setEventOnMap: type not defined');
        return 0;
    }

    if (!goog.isDef(listener)) {
        console.error('setEventOnMap: listener not defined');
        return 0;
    }

    opt_this = goog.isDef(opt_this) ? opt_this : '';
    // Active l'évènement
    var event = this.oOpenLayersMap_.on(type, listener, opt_this);
    // Stocke l'évènement
    this.vmapEvents_.push(event);
    // Définit l'action en cours
    if (goog.isDef(currentAction))
        this.setCurrentAction(currentAction);
    return event;
};

/**
 * Add a draw event on the map and remove the others.
 * @param {object} opt_options
 * @param {number | undefined} opt_options.clickTolerance The maximum distance in pixels between "down" and "up" for a "up" event to be considered a "click" event and actually add a point/vertex to the geometry being drawn. Default is 6 pixels. That value was chosen for the draw interaction to behave correctly on mouse as well as on touch devices.
 * @param {ol.Collection.<ol.Feature> | undefined} opt_options.features Destination collection for the drawn features.
 * @param {ol.source.Vector | undefined} opt_options.source Destination source for the drawn features.
 * @param {number | undefined} opt_options.snapTolerance Pixel distance for snapping to the drawing finish. Default is 12.
 * @param {ol.geom.GeometryType} opt_options.type Drawing type ('Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon' or 'Circle'). Required.
 * @param {number | undefined} opt_options.maxPoints The number of points that can be drawn before a polygon ring or line string is finished. The default is no restriction.
 * @param {number | undefined} opt_options.minPoints The number of points that must be drawn before a polygon ring or line string can be finished. Default is 3 for polygon rings and 2 for line strings.
 * @param {ol.style.Style | Array.<ol.style.Style> | ol.style.StyleFunction | undefined} opt_options.style Style for sketch features.
 * @param {ol.interaction.DrawGeometryFunctionType | undefined} opt_options.geometryFunction Function that is called when a geometry's coordinates are updated.
 * @param {string | undefined} opt_options.geometryName Geometry name to use for features created by the draw interaction.
 * @param {ol.events.ConditionType | undefined} opt_options.condition A function that takes an ol.MapBrowserEvent and returns a boolean to indicate whether that event should be handled. By default ol.events.condition.noModifierKeys, i.e. a click, adds a vertex or deactivates freehand drawing.
 * @param {ol.events.ConditionType | undefined} opt_options.freehandCondition Condition that activates freehand drawing for lines and polygons. This function takes an ol.MapBrowserEvent and returns a boolean to indicate whether that event should be handled. The default is ol.events.condition.shiftKeyOnly, meaning that the Shift key activates freehand drawing.
 * @param {boolean | undefined} opt_options.wrapX Wrap the world horizontally on the sketch overlay. Default is false.
 * @param {string|undefined} currentAction name of the current action
 * @returns {ol.interaction.Draw|Number}
 * @export
 */
nsVmap.Map.prototype.setDrawInteraction = function (opt_options, currentAction) {
    oVmap.log('nsVmap.Map.prototype.setDrawInteraction');
    if (!goog.isDef(opt_options.type)) {
        console.error('addDrawOnMap: opt_options.type not defined');
        return 0;
    }

    // Supprime les anciens évènements et interractions
    this.removeActionsOnMap();
    // Ajout de l'interaction dessin
    var draw = this.addDrawInteraction(opt_options);
    // Définit l'action en cours
    if (goog.isDef(currentAction))
        this.setCurrentAction(currentAction);
    return draw;
};

/**
 * Add a draw event on the map.
 * @param {object} opt_options
 * @param {number | undefined} opt_options.clickTolerance The maximum distance in pixels between "down" and "up" for a "up" event to be considered a "click" event and actually add a point/vertex to the geometry being drawn. Default is 6 pixels. That value was chosen for the draw interaction to behave correctly on mouse as well as on touch devices.
 * @param {ol.Collection.<ol.Feature> | undefined} opt_options.features Destination collection for the drawn features.
 * @param {ol.source.Vector | undefined} opt_options.source Destination source for the drawn features.
 * @param {number | undefined} opt_options.snapTolerance Pixel distance for snapping to the drawing finish. Default is 12.
 * @param {ol.geom.GeometryType} opt_options.type Drawing type ('Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon' or 'Circle'). Required.
 * @param {number | undefined} opt_options.maxPoints The number of points that can be drawn before a polygon ring or line string is finished. The default is no restriction.
 * @param {number | undefined} opt_options.minPoints The number of points that must be drawn before a polygon ring or line string can be finished. Default is 3 for polygon rings and 2 for line strings.
 * @param {ol.style.Style | Array.<ol.style.Style> | ol.style.StyleFunction | undefined} opt_options.style Style for sketch features.
 * @param {ol.interaction.DrawGeometryFunctionType | undefined} opt_options.geometryFunction Function that is called when a geometry's coordinates are updated.
 * @param {string | undefined} opt_options.geometryName Geometry name to use for features created by the draw interaction.
 * @param {ol.events.ConditionType | undefined} opt_options.condition A function that takes an ol.MapBrowserEvent and returns a boolean to indicate whether that event should be handled. By default ol.events.condition.noModifierKeys, i.e. a click, adds a vertex or deactivates freehand drawing.
 * @param {ol.events.ConditionType | undefined} opt_options.freehandCondition Condition that activates freehand drawing for lines and polygons. This function takes an ol.MapBrowserEvent and returns a boolean to indicate whether that event should be handled. The default is ol.events.condition.shiftKeyOnly, meaning that the Shift key activates freehand drawing.
 * @param {boolean | undefined} opt_options.wrapX Wrap the world horizontally on the sketch overlay. Default is false.
 * @param {string|undefined} currentAction name of the current action
 * @returns {ol.interaction.Draw|Number}
 * @export
 */
nsVmap.Map.prototype.addDrawInteraction = function (opt_options, currentAction) {

    if (!goog.isDef(opt_options.type)) {
        console.error('addDrawOnMap: opt_options.type not defined');
        return 0;
    }

    // Valeurs par défaut
    opt_options.style = goog.isDef(opt_options.style) ? opt_options.style : new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(54,184,255,0.6)'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.7)'
            }),
            fill: new ol.style.Fill({
                color: 'rgba(54,184,255,0.6)'
            })
        })
    });

    // Ajout de l'interaction dessin
    var draw = new ol.interaction.Draw(opt_options);
    this.addInteraction(draw);

    // Définit l'action en cours
    if (goog.isDef(currentAction))
        this.setCurrentAction(currentAction);

    return draw;
};

/**
 * Remove events and interactions and then add a interaction
 * @param {ol.interaction.Interaction} interaction
 * @param {string|undefined} currentAction name of the current action
 * @returns {ol.interaction.Interaction}
 */
nsVmap.Map.prototype.setInteraction = function (interaction, currentAction) {
    oVmap.log('nsVmap.Map.prototype.setInteraction');
    // Supprime les anciens évènements et interractions
    this.removeActionsOnMap();
    // Ajoute la nouvelle interaction
    this.addInteraction(interaction);
    // Définit l'action en cours
    if (goog.isDef(currentAction))
        this.setCurrentAction(currentAction);
    return interaction;
};

/**
 * Add a interaction
 * @param {ol.interaction.Interaction} interaction
 * @param {string|undefined} currentAction name of the current action
 * @returns {ol.interaction.Interaction}
 */
nsVmap.Map.prototype.addInteraction = function (interaction, currentAction) {
    oVmap.log('nsVmap.Map.prototype.addInteraction');
    // Ajout de l'interaction
    this.oOpenLayersMap_.addInteraction(interaction);
    // Stocke l'interaction
    this.vmapInteractions_.push(interaction);
    // Définit l'action en cours
    if (goog.isDef(currentAction))
        this.setCurrentAction(currentAction);
    return interaction;
};

/**
 * Remove the events and draw interactions added by addEventOnMap, setEventOnMap, addDrawInteraction or setDrawInteraction
 * @returns {undefined}
 * @export
 */
nsVmap.Map.prototype.removeActionsOnMap = function () {
    oVmap.log('nsVmap.Map.prototype.removeActionsOnMap');
    // Supprime les évènements
    for (var i = 0; i < this.vmapEvents_.length; i++) {
        ol.Observable.unByKey(this.vmapEvents_[i]);
    }

    // Supprime les interractions
    for (var i = 0; i < this.vmapInteractions_.length; i++) {

        // Supprime les features occasionelles
        if (goog.isDef(this.vmapInteractions_[i].getFeatures))
            this.vmapInteractions_[i].getFeatures().clear();
        this.oOpenLayersMap_.removeInteraction(this.vmapInteractions_[i]);
    }

    // Définit l'action en cours
    this.setCurrentAction('');
};

/**
 * Add an overlay witch will be remove when using removeActionsAndTooltips
 * @param {ol.Overlay} overlay
 * @returns {undefined}
 * @export
 */
nsVmap.Map.prototype.addOverlay = function (overlay) {
    this.vmapOverlays_.push(overlay);
    this.oOpenLayersMap_.addOverlay(overlay);
};

/**
 * Remove the mapTooltip and the actions added by addEventOnMap, setEventOnMap, addDrawInteraction or setDrawInteraction
 * @returns {undefined}
 * @export
 */
nsVmap.Map.prototype.removeActionsAndTooltips = function () {
    this.removeActionsOnMap();
    this.getMapTooltip().hide();
    for (var i = 0; i < this.vmapOverlays_.length; i++) {
        this.vmapOverlays_[i].getElement().style.display = "none";
    }
};

/**
 * Transform the layers contained in layersToTransform to the new projection
 * @param {ol.proj.ProjectionLike} oldProjection
 * @param {ol.proj.ProjectionLike} newProjection
 * @returns {undefined}
 */
nsVmap.Map.prototype.reprojectFeatures = function (oldProjection, newProjection) {
    oVmap.log('nsVmap.Map.prototype.reprojectFeatures');

    for (var i = 0; i < this.layersToTransform_.length; i++) {
        this.layersToTransform_[i].getSource().transformFeatures(oldProjection, newProjection);
    }
};

/**
 * Remove the text features and a new one
 * @param {string} text
 * @param {array} coordinates
 * @returns {undefined}
 * @export
 */
nsVmap.Map.prototype.setTextOverlayFeature = function (text, coordinates) {

    // Vide les features existantes
    this.vmapTextOverlayFeatures_.clear();

    // Ajoute la nouvelle text feature
    this.addTextOverlayFeature(text, coordinates);
};

/**
 * Add a text feature
 * @param {string} text
 * @param {array} coordinates
 * @returns {undefined}
 * @export
 */
nsVmap.Map.prototype.addTextOverlayFeature = function (text, coordinates) {

    var tmpstyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 3,
            stroke: new ol.style.Stroke({
                color: '#fff'
            }),
            fill: new ol.style.Fill({
                color: 'blue'
            })
        }),
        text: new ol.style.Text({
            text: text,
            fill: new ol.style.Fill({
                color: 'blue'
            }),
            offsetY: -13
        })
    });

    var tmpMarker = new ol.Feature({
        geometry: new ol.geom.Point(coordinates)
    });

    tmpMarker.setStyle(tmpstyle);

    this.vmapTextOverlay_.getSource().addFeature(tmpMarker);
};

/**
 * Use this function to add a new vector layer
 * @param {object} opt_options
 * @param {object} opt_options.style
 * @param {object} opt_options.extent
 * @param {object} opt_options.minResolution
 * @param {object} opt_options.maxResolution
 * @param {object} opt_options.opacity
 * @param {object} opt_options.properties
 * @param {object} opt_options.visible
 * @param {object} opt_options.zIndex
 * @returns {undefined}
 */
nsVmap.Map.prototype.addVectorLayer = function (opt_options) {
    oVmap.log('nsVmap.Map.prototype.addVectorLayer');

    var vectorLayer = new ol.layer.Vector({
        map: this.oOpenLayersMap_,
        source: new ol.source.Vector({
            useSpatialIndex: false
        }),
        updateWhileAnimating: true,
        updateWhileInteracting: true
    });

    if (goog.isDef(opt_options)) {
        if (goog.isDef(opt_options.style))
            vectorLayer.setStyle(opt_options.style);

        if (goog.isDef(opt_options.extent))
            vectorLayer.setExtent(opt_options.extent);

        if (goog.isDef(opt_options.minResolution))
            vectorLayer.setMinResolution(opt_options.minResolution);

        if (goog.isDef(opt_options.maxResolution))
            vectorLayer.setMaxResolution(opt_options.maxResolution);

        if (goog.isDef(opt_options.opacity))
            vectorLayer.setOpacity(opt_options.opacity);

        if (goog.isDef(opt_options.properties))
            vectorLayer.setProperties(opt_options.properties);

        if (goog.isDef(opt_options.visible))
            vectorLayer.setVisible(opt_options.visible);

        if (goog.isDef(opt_options.zIndex))
            vectorLayer.setZIndex(opt_options.zIndex);
    }

    // Ajoute la couche à layersToTransform_ pour que les features soient reprojetés en cas de changement de projection
    this.layersToTransform_.push(vectorLayer);

    return vectorLayer;
};

/**
 * Initialize the vmapTooltip_
 * @returns {undefined}
 */
nsVmap.Map.prototype.initMapTooltip = function () {

    this.vmapTooltip_ = new nsVmap.Map.MapTooltip({id: 'map-tooltip'});
};

/**
 * Refresh the map without caches
 * @export
 */
nsVmap.Map.prototype.refresh = function () {
    oVmap.log('nsVmap.Map.prototype.refresh');
    this.oOpenLayersMap_.refreshWithTimestamp();
};


/************************************************
 ---------- DIRECTIVES AND CONTROLLERS -----------
 *************************************************/

/**
 * App-specific directive wrapping the ngeo map directive. The directive's
 * controller has a property "map" including a reference to the OpenLayers
 * map.
 *
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.Map.prototype.mapDirective = function () {
    oVmap.log("nsVmap.Map.prototype.mapDirective");
    return {
        restrict: 'E',
        scope: {
            'map': '=appMap',
            'proj': '=appProj',
            'currentAction': '=appAction'
        },
        controller: 'AppMapController',
        controllerAs: 'ctrl',
        bindToController: true,
        template: '<div id="olMap"></div>'
    };
};

/**
 * The application's main controller.
 * @ngInject
 * @constructor
 */
nsVmap.Map.prototype.mapController = function ($scope, $window, $element, $http) {
    oVmap.log("nsVmap.Map.prototype.mapController");
    var this_ = this;

    /**
     * @private
     */
    this.$http_ = $http;

    /**
     * @type {object}
     */
    this.element = $element;

    /**
     * Animation duration
     * @type Number
     * @private
     */
    this.duration = 1000;

    /**
     * @type {ol.Map}
     * @private
     */
    this.map = this['map'];

    /**
     * @type string
     * @private
     */
    this.proj = this['proj'];

    /**
     * Contains the tileloaderror and imageloaderror events
     * @private
     */
    this.loadErrorEventsContainer_ = [];

    this.map.setTarget('olMap');

    /**
     * Update the map size with animation
     * @type goog.async.AnimationDelay
     */
    this.animationDelay = new goog.async.AnimationDelay(
            function () {
                this_.map.updateSize();
                this_.map.renderSync();
                if (goog.now() - start < this_.duration) {
                    this_.animationDelay.start();
                }
            }, $window);

    /**
     * Watch for resizing
     */
    $scope.$watchCollection(function () {
        return [this_.element.children()[0]['clientWidth'], this_.element.children()[0]['clientHeight']];
    }, function () {
        this_.startAnimation();
    });

    // Initialise vmapTooltip_
    oVmap.getMap().initMapTooltip();

    // évènement lorsque les couches ont changés (avec timeout en cas de changement rapide de plusieurs couches)
    var iChangedLayers = 0;
    this['map'].getLayers().on('change:length', function () {
        iChangedLayers++;
        var tmpChangedLayers = angular.copy(iChangedLayers);
        setTimeout(function () {
            if (iChangedLayers === tmpChangedLayers) {
                oVmap.log('oVmap event: layersChanged');
                oVmap['scope'].$broadcast('layersChanged');
            }
        }, 500);
    });

    oVmap['scope'].$on('layersChanged', function () {
        this_.emptyLoadErrorsEvents();
        this_.listenLoadErrors();
    });

    // Vide selectionOverlay, locationOverlay quand on change de carte
    oVmap['scope'].$on('mapChanged', function () {
        oVmap.getMap().getSelectionOverlay().getSource().clear();
        oVmap.getMap().getLocationOverlay().getSource().clear();
    });
};

/**
 * Empty the events created by listenLoadErrors()
 */
nsVmap.Map.prototype.mapController.prototype.emptyLoadErrorsEvents = function () {
    oVmap.log('nsVmap.Map.prototype.emptyLoadErrorsEvents');

    for (var i = 0; i < this.loadErrorEventsContainer_.length; i++) {
        this.loadErrorEventsContainer_[i].layer.getSource().unByKey(this.loadErrorEventsContainer_[i].event);
    }
};

/**
 * Listen the layers load errors
 */
nsVmap.Map.prototype.mapController.prototype.listenLoadErrors = function () {
    oVmap.log('nsVmap.Map.prototype.listenLoadErrors');

    var this_ = this;
    var oLayers = this['map'].getLayers();

    oLayers.forEach(function (olLayer) {

        if (olLayer.getSource() instanceof ol.source.TileWMS) {

            this_.loadErrorEventsContainer_.push({
                event: olLayer.getSource().on('tileloaderror', function (event) {
                    if (goog.isDefAndNotNull(event['tile'])) {
                        if (goog.isDefAndNotNull(event['tile'].src_)) {
                            this_.displayLoadErrors(event['tile'].src_);
                        } else
                            console.error('tileloaderror: ', event['tile']);
                    } else
                        console.error('tileloaderror: ', event);
                }),
                layer: olLayer
            });

        } else if (olLayer.getSource() instanceof ol.source.ImageWMS) {

            this_.loadErrorEventsContainer_.push({
                event: olLayer.getSource().on('imageloaderror', function (event) {
                    if (goog.isDefAndNotNull(event['image'])) {
                        if (goog.isDefAndNotNull(event['image'].src_)) {
                            this_.displayLoadErrors(event['image'].src_);
                        } else
                            console.error('imageloaderror: ', event['image']);
                    } else
                        console.error('imageloaderror: ', event);
                }),
                layer: olLayer
            });

        }

    });
};

/**
 * Display the link errors on the console
 * @param {string} sSrc url from the error
 */
nsVmap.Map.prototype.mapController.prototype.displayLoadErrors = function (sSrc) {
    oVmap.log('nsVmap.Map.prototype.mapController.prototype.displayLoadErrors');

    this.$http_({
        method: 'GET',
        url: sSrc
    }).then(function successCallback(response) {

        var error = jQuery.parseXML(response['data']);
        if (goog.isDefAndNotNull(error)) {
            console.error('Layer server error: ', error);
        } else {
            if (goog.isDefAndNotNull(response['data']) && response['data'] !== "") {
                console.error('Layer server error: ', response['data']);
            } else {
                console.error('Layer server error: ', response);
            }
        }

    }, function errorCallback(response) {
        console.error(response);
    });
};

/**
 * Update the map size with animation
 * @returns {undefined}
 * @export
 */
nsVmap.Map.prototype.mapController.prototype.startAnimation = function () {
    oVmap.log('nsVmap.Map.prototype.mapController.prototype.startAnimation');
    start = goog.now();
    this.animationDelay.stop();
    this.animationDelay.start();
};

/************************************************
 ------------ GETTERS AND SETTERS ----------------
 *************************************************/
/**
 * nsVmap.Map.olLayers_ getter
 * @return {Array.<ol.layer>} Layers array
 * @export
 * @api experimental
 */
nsVmap.Map.prototype.getOpenLayersLayers = function () {
    return this.oOpenLayersMap_.getLayers();
};

/**
 * nsVmap.Map.olLayers_ setter
 * @param {Array.<ol.layer.Base>} layers Layers array
 * @export
 * @api experimental
 */
nsVmap.Map.prototype.setOpenLayersLayers = function (layers) {
    this.olLayers_ = layers;
    this.oOpenLayersMap_.setLayerGroup(layers);
};

/**
 * nsVmap.Map.olView_ getter
 * @return {ol.View} Used view
 * @export
 * @api experimental
 */
nsVmap.Map.prototype.getOpenLayersView = function () {
    return this.oOpenLayersMap_.getView();
};

/**
 * nsVmap.Map.olView_ setter
 * @param {ol.View} view View to use
 * @export
 * @api experimental
 */
nsVmap.Map.prototype.setOpenLayersView = function (view) {
    this.olView_ = view;
    this.oOpenLayersMap_.setView(this.olView_);
};

/**
 * nsVmap.Map.oOpenLayersMap_ getter
 * @return {ol.map} Used map
 * @export
 * @api experimental
 */
nsVmap.Map.prototype.getOLMap = function () {
    return this.oOpenLayersMap_;
};

/**
 * nsVmap.Map.oOpenLayersMap_ setter
 * @param {ol.Map} map Map to use
 * @export
 * @api experimental
 */
nsVmap.Map.prototype.setOpenLayersMap = function (map) {
    this.oOpenLayersMap_ = map;
};

/**
 * nsVmap.Map.oOpenLayersSelectionOverlay_ getter
 * @return {ol.layer.Vector} Selection overlay
 * @export
 * @api experimental
 */
nsVmap.Map.prototype.getSelectionOverlay = function () {
    return this.oOpenLayersSelectionOverlay_;
};

/**
 * nsVmap.Map.oOpenLayersSelectionOverlayFeatures_ getter
 * @return {ol.Collection<ol.Feature>} Selection overlay features
 * @export
 * @api experimental
 */
nsVmap.Map.prototype.getSelectionOverlayFeatures = function () {
    return this.oOpenLayersSelectionOverlayFeatures_;
};

/**
 * nsVmap.Map.oOpenLayersLocationOverlay_ getter
 * @return {ol.layer.Vector} Location overlay
 * @export
 * @api experimental
 */
nsVmap.Map.prototype.getLocationOverlay = function () {
    return this.oOpenLayersLocationOverlay_;
};

/**
 * nsVmap.Map.oOpenLayersLocationOverlay_ source getter
 * @return {ol.source.Vector} Location overlay vector source
 * @export
 = */
nsVmap.Map.prototype.getLocationOverlaySource = function () {
    return this.oOpenLayersLocationOverlay_.getSource();
};

/**
 * nsVmap.Map.oOpenLayersLocationOverlayFeatures_ getter
 * @return {ol.Collection<ol.Feature>} Location overlay features
 * @export
 * @api experimental
 */
nsVmap.Map.prototype.getLocationOverlayFeatures = function () {
    return this.oOpenLayersLocationOverlayFeatures_;
};

/**
 * nsVmap.Map.oOpenLayersPopupOverlay_ getter
 * @return {ol.layer.Vector} Popup overlay
 * @export
 * @api experimental
 */
nsVmap.Map.prototype.getPopupOverlay = function () {
    return this.oOpenLayersPopupOverlay_;
};

/**
 * nsVmap.Map.oOpenLayersPopupOverlay_ source getter
 * @return {ol.source.Vector} Popup overlay vector source
 * @export
 = */
nsVmap.Map.prototype.getPopupOverlaySource = function () {
    return this.oOpenLayersPopupOverlay_.getSource();
};

/**
 * nsVmap.Map.oOpenLayersPopupOverlayFeatures_ getter
 * @return {ol.Collection<ol.Feature>} Popup overlay features
 * @export
 * @api experimental
 */
nsVmap.Map.prototype.getPopupOverlayFeatures = function () {
    return this.oOpenLayersPopupOverlayFeatures_;
};

/**
 * nsVmap.Map.oOpenLayersSelectionStyle_ getter
 * @return {ol.style.Style} Selection overlay
 * @export
 * @api experimental
 */
nsVmap.Map.prototype.getSelectionStyle = function () {
    return this.oOpenLayersSelectionStyle_;
};

/**
 * nsVmap.Map.oOpenLayersSelectionStyle_ setter
 * @param {ol.style.Style} style FeatureOverlay Selection overlay
 * @export
 * @api unstable
 */
nsVmap.Map.prototype.setSelectionStyle = function (style) {
    this.oOpenLayersSelectionStyle_ = style;
};

/**
 * vmapTooltip_ getter
 * @returns {nsVmap.Map.MapTooltip}
 */
nsVmap.Map.prototype.getMapTooltip = function () {
    return this.vmapTooltip_;
};

/**
 * currentAction getter
 * @returns {string} currentAction
 * @export
 */
nsVmap.Map.prototype.getCurrentAction = function () {
    return angular.element($('#map1')).scope()['ctrl']['currentAction'];
};

/**
 * currentAction setter
 * @param {string} currentAction
 * @export
 */
nsVmap.Map.prototype.setCurrentAction = function (currentAction) {
    var scope = angular.element($("#map1")).scope();
    scope.$evalAsync(function (scope) {
        scope['ctrl']['currentAction'] = currentAction;
    });
};

/**
 * vmapTextOverlay_ getter
 * @returns {ol.layer.Vector}
 * @export
 */
nsVmap.Map.prototype.getTextOverlay = function () {
    return this.vmapTextOverlay_;
};

/**
 * vmapTextOverlayFeatures_ getter
 * @returns {nsVmap.Map.vmapTextOverlayFeatures__}
 * @export
 */
nsVmap.Map.prototype.getTextOverlayFeatures = function () {
    return this.vmapTextOverlayFeatures_;
};

/**
 * layersToTransform_ getter
 * @returns {nsVmap.Map.layersToTransform_}
 * @export
 */
nsVmap.Map.prototype.getLayersToTransform = function () {
    return this.layersToTransform_;
};

/**
 * Get the layers by layer_id
 * @param {string} layerId
 * @returns {ol.layer.Base}
 * @export
 */
nsVmap.Map.prototype.getLayerById = function (layerId) {

    var aLayers = this.oOpenLayersMap_.getLayers().getArray();

    for (var i = 0; i < aLayers.length; i++) {
        if (aLayers[i].get('layer_id') === layerId)
            return aLayers[i];
    }

    // Si aucun layer ne correspondait
    return null;
};

// Définit la directive et le controller
oVmap.module.directive('appMap', nsVmap.Map.prototype.mapDirective);
oVmap.module.controller('AppMapController', nsVmap.Map.prototype.mapController);
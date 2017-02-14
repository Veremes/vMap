/* global goog, ol, nsVitisComponent, vitisApp */

/**
 * @author: Anthony Borghi, Armand Bahi
 * @Description: Fichier contenant la classe nsVitisComponent.Map
 * Permet d'instancier un composant OpenLayers3
 */

/*********************************************************************************************************
 *  TODO LIST  (100%)
 *********************************************************************************************************/

'use strict';

goog.provide('nsVitisComponent.Map');

goog.require('nsVitisComponent');

goog.require('ol');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.proj');
goog.require('ol.proj.Projection');
goog.require('ol.Collection');

goog.require('ol.layer.Tile');
goog.require('ol.layer.Vector');
goog.require('ol.layer.Image');
goog.require('ol.layer.Group');

goog.require('ol.source.OSM');
goog.require('ol.source.BingMaps');
goog.require('ol.source.Vector');
goog.require('ol.source.WMTS');
goog.require('ol.source.Stamen');
goog.require('ol.source.MapQuest');
goog.require('ol.source.TileWMS');
goog.require('ol.source.ImageWMS');
goog.require('ol.source.Vector');
goog.require('ol.source.ImageVector');
goog.require('ol.source.TileJSON');

goog.require('ol.format.WKT');

goog.require('ol.control');
goog.require('ol.control.MousePosition');
goog.require('ol.control.Control');
goog.require('ol.control.ScaleLine');

goog.require('ol.style.Style');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');
goog.require('ol.style.Circle');

goog.require('ol.animation');
goog.require('ol.easing');

goog.require('ol.interaction.Interaction');
goog.require('ol.interaction.Select');
goog.require('ol.interaction.Modify');
goog.require('ol.interaction.Draw');

goog.require('ol.events.condition');
goog.require('ol.Extent');
goog.require('ol.tilegrid.WMTS');
goog.require('ol.format.GeoJSON');

goog.require('ol.Sphere');

var featureID = 0;

/**
 * Create a Componant Map on an element with options
 * @param {Object} id HTML Element where the componant will be 
 * @param {Object} options options to configure the componant
 * @param {string} hiddenFieldId id of output's geometries field
 * @param {string} oFormValues value of the output
 * @param {string} sFormName
 * @constructor
 * @export
 */
nsVitisComponent.Map = function (id, options, hiddenFieldId, oFormValues, sFormName, oProj) {

    /**
     * @private
     */
    this.$propertiesSrvc_ = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["propertiesSrvc"]);
    /**
     * @private
     */
    this.$translate_ = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["$translate"]);
    /**
     * @private
     */
    this.$log_ = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["$log"]);

    var this_ = this;

    this.$log_.log('nsVitisComponent.Map', options);

    this.appColor = $(".banner_line").css("background-color");
    if (goog.isDef(this.appColor)) {
        if (this.appColor.charAt(3) !== 'a') {
            this.appColor = this.appColor.split('(');
            this.appColor = this.appColor[1].split(')');
            this.appColor = "rgba(" + this.appColor[0] + ",0.58)";
        }
    }

    /********************** Translates **************************/

    var aTranslates = [
        'COMPONENT_MAP_LAYERSTREE',
        'COMPONENT_MAP_FULLSCREEN',
        'COMPONENT_MAP_ZOOM_EXTENT',
        'COMPONENT_MAP_DELETE_FEATURE',
        'COMPONENT_MAP_DELETE_ALL',
        'COMPONENT_MAP_MODIFY_FEATURE',
        'COMPONENT_MAP_DRAW_POINT',
        'COMPONENT_MAP_DRAW_LINE',
        'COMPONENT_MAP_DRAW_POLYGON',
        'COMPONENT_MAP_ZOOM_EXTENT',
        'COMPONENT_MAP_OVERSIZED_EXTENT'
    ];

    this.$translate_(aTranslates).then(function (translations) {
        this_.oTranslates = translations;
    });

    /*********************View**********************/
    this.addCustomProjections();

    var center, extent;

    if (goog.isDef(options["center"]["coord"]))
        center = options["center"]["coord"];
    if (goog.isDef(options["center"]["extent"]))
        extent = options["center"]["extent"];


    this.proj_ = options["proj"];

    if (options["center"]["coord"]) {
        this.View = new ol.View({
            center: center,
            zoom: 5,
            projection: ol.proj.get(options["proj"])
        });
    } else {
        this.View = new ol.View({
            center: [((extent[0] + extent[2]) / 2), ((extent[1] + extent[3]) / 2)],
            zoom: 5,
            projection: ol.proj.get(options["proj"])
        });
    }


    /****************Initialisation***********************/
    /**
     * contains all the used translates
     * @type object
     */
    this.oTranslates = {};
    /**
     * @type {Object}
     * @private
     */
    this.Id = id;
    /**
     * @type {Object}
     * @private
     */
    this.Target = document.getElementById(id);
    /**
     * @type {number}
     * @private
     */
    this.Accuracy = options["coord_accuracy"];
    /**
     * @type {Array.<ol.control.Control>}
     * @private
     */
    this.Controls = [];
    /**
     * @type {Array.<ol.layer.Tile>}
     * @private
     */
    this.Layers = [];
    /**
     * @type {ol.Collection.<ol.Feature>}
     * @private
     */
    this.Features = new ol.Collection();

    /**
     * @type {ol.interaction.Interaction}
     * @private
     */
    this.interaction = "none";
    /**
     * @type {Object}
     * @private
     */
    this.Config = {};
    /**
     * @type {Object}
     * @private
     */
    this.oProj_ = oProj;
    /**
     * @type {boolean}
     * @private
     */
    this.multiGeom = options["interactions"]["multi_geometry"];


    this['bLayersTreeOpen'] = false;


    /*********************Layers**********************/
    if (options["type"] === "OSM") {
        this.Layers.push(new ol.layer.Tile({
            source: new ol.source.OSM()
        }));
    } else if (options["type"] === "bing") {
        this.Layers.push(new ol.layer.Tile({
            source: new ol.source.BingMaps({
                culture: options["source"]["culture"],
                key: options["source"]["key"],
                imagerySet: options["source"]["style"]
            })
        }));
    }

    /*******************Current Projection Element***************************/
    this.element = document.createElement("DIV");
    $(this.element).addClass("ol-current-projection-studio ol-unselectable");

    /*******************Controls************************************/
    if (options["controls"]["MP"]) {
        this.Controls.push(new ol.control.MousePosition({
            coordinateFormat: function (coordinate) {
                //coordinate = ol.proj.transform(coordinate, "EPSG:3857", this_.proj_);
                return [coordinate[0].toPrecision(this_.Accuracy), coordinate[1].toPrecision(this_.Accuracy)];
            }
        }));
    }
    if (options["controls"]["SL"]) {
        this.Controls.push(new ol.control.ScaleLine());
    }
    if (options["controls"]["CP"]) {
        this.Controls.push(new ol.control.Control({
            element: this_.element,
            render: function () {
                var currentProj = "";
                for (var i = 0; i < this_.oProj_["projections"].length; i++) {
                    if (this_.proj_ === this_.oProj_["projections"][i]["code"]) {
                        currentProj = this_.oProj_["projections"][i]["name"];
                    }
                }
                if (currentProj !== '') {
                    $(".ol-current-projection-studio").html(currentProj);
                } else {
                    $(".ol-current-projection-studio").html(this_.proj_);
                }
            }
        }));
    }

    if (options["controls"]["ZO"]) {
        // Timeout pour attendre que les traductions soient faites
        setTimeout(function () {
            this_.ZoomGroup = this_.zoomControls(this_.Target);
        }, 500);
    }

    setTimeout(function () {
        this_.IntractionsGroup = this_.addInteractions(this_.Target, options["interactions"]);
    });

    if (Array.isArray(options["layers"])) {
        if (options["layers"].length > 0) {
            this.Layers.push(options["layers"]);
        }
    }

    /****************************************************Map*******************************/

    this.MapObject = new ol.Map({
        target: this_.Target,
        layers: this_.Layers,
        view: this_.View,
        controls: this_.Controls
    });

    if (goog.isDefAndNotNull(options["center"]["scale"])) {
        this.setScale(options["center"]["scale"]);
    }

    if (goog.isDefAndNotNull(options["center"]["extent"])) {
        this.setExtent(options["center"]["extent"]);
    }

    if (options["type"] === "vmap" && options["tree"]) {
        this['aTree'] = this.loadTree(options["tree"]);
    } else {
        this['aTree'] = [{
                'service': options["type"],
                'layers': this.Layers
            }];
    }

    /****************************************Extent***************************************/

    // Vérifie que l'étendue soit valable
    var projExtent = ol.proj.get(options["proj"]).getExtent();
    var viewExtent = this.View.calculateExtent(this.MapObject.getSize());

    if (this.isInsideProjExtent(viewExtent, projExtent)) {
        this.Extent = this.View.calculateExtent(this.MapObject.getSize());
    } else {
        setTimeout(function () {
            $.notify(this_.oTranslates['COMPONENT_MAP_OVERSIZED_EXTENT'], 'warn');
        }, 500);
        this.MapObject.getView().fit(projExtent, this.MapObject.getSize());
    }


    //****************************************CSS******************************************/
    $(".ol-mouse-position").css("bottom", "8px");
    $(".ol-mouse-position").css("top", "auto");
    $(".ol-mouse-position").css("background", this.appColor);
    $(".ol-mouse-position").css("color", "#ffffff");
    $(".ol-mouse-position").css("border-radius", "4px");

    $(".ol-scale-line").css("background", this.appColor);

    $(".ol-current-projection-studio").css("background", this.appColor);

    /****************************************Feature Overlay********************************/

    options["draw_color"] = goog.isDef(options["draw_color"]) ? options["draw_color"] : "rgba(54,184,255,0.6)";
    options["contour_color"] = goog.isDef(options["contour_color"]) ? options["contour_color"] : "rgba(0,0,0,0.4)";
    options["contour_size"] = goog.isDef(options["contour_size"]) ? options["contour_size"] : 2;
    options["circle_radius"] = goog.isDef(options["circle_radius"]) ? options["circle_radius"] : 7;

    var style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: options["draw_color"]
        }),
        stroke: new ol.style.Stroke({
            color: options["contour_color"],
            width: options["contour_size"]
        }),
        image: new ol.style.Circle({
            radius: options["circle_radius"],
            fill: new ol.style.Fill({
                color: options["draw_color"]
            }),
            stroke: new ol.style.Stroke({
                color: options["contour_color"],
                width: options["contour_size"]
            })
        })
    });

    this.FeatureOverlay = new ol.layer.Vector({
        style: style,
//        map: this_.MapObject,
        updateWhileAnimating: true, // optional, for instant visual feedback
        updateWhileInteracting: true,
        source: new ol.source.Vector({
            features: this_.Features
        })
    });
    setTimeout(function () {
        this_.MapObject.addLayer(this_.FeatureOverlay);
    }, 500);

    /**************************************** Select hover interaction ********************************/

    /**
     * @type {ol.interaction.Select}
     * @private
     */
    this.selectHover_ = new ol.interaction.Select({
        source: this.FeatureOverlay.getSource(),
        condition: ol.events.condition.pointerMove
    });

    this.MapObject.addInteraction(this.selectHover_);

    /**********************Hidden field**************************/

    var wktFormat = new ol.format.WKT();
    var hiddenFeatures = $("#" + hiddenFieldId).val();

    if (goog.isDef(hiddenFeatures)) {
        if (!goog.string.isEmpty(hiddenFeatures) && hiddenFeatures !== "[object Object]") {
            var aFeatures = wktFormat.readFeatures(hiddenFeatures);
            for (var i = 0; i < aFeatures.length; i++) {
                this.FeatureOverlay.getSource().addFeature(aFeatures[i]);
            }
            var featuresExtent = this.FeatureOverlay.getSource().getExtent();
            this.MapObject.getView().fit(featuresExtent, this.MapObject.getSize());

            // En cas de simple point
            if (aFeatures.length === 1) {
                if (aFeatures[0].getGeometry().getType() === 'Point') {
                    this.MapObject.getView().setZoom(12);
                }
            }
        }
    }
    this.Features.on("change", function () {
        var this_ = this;
        setTimeout(function () {

            var wktFeatures = wktFormat.writeFeatures(this_.getArray());
            if (goog.isDef(hiddenFieldId)) {
                document.getElementById(hiddenFieldId).setAttribute('value', wktFeatures);
                //$("#" + hiddenFieldId).val(wktFeatures);
            }
            if (goog.isDef(sFormName) && goog.isDef(oFormValues)) {
                oFormValues[sFormName] = wktFeatures;
            }
            this_.MapObject.dispatchEvent('moveend');
        }, 1);
    });

    return this;
};

/**
 * Add projections EPSG:2154
 */
nsVitisComponent.Map.prototype.addCustomProjections = function () {

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
nsVitisComponent.Map.prototype.WGSToLambert = function (coordinates) {

    var longitude = coordinates[0];
    var latitude = coordinates[1];
    var deg2rad = function deg2rad(angle) {
        return (angle / 180) * Math.PI;
    };
    //variables:
    var a = 6378137; //demi grand axe de l'ellipsoide (m)
    var e = 0.08181919106; //première excentricité de l'ellipsoide
    var lc = deg2rad(3);
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
nsVitisComponent.Map.prototype.lambertToWGS = function (coordinates) {

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

    var x = coordinates[0].toFixed(10);
    var y = coordinates[1].toFixed(10);
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
 * add Custom zoom Control
 * @param {Object} target target Element HTML where button will be
 * @returns {Object} Element who contain this control
 */
nsVitisComponent.Map.prototype.zoomControls = function (target) {

    var this_ = this;

    var buttonPlus = document.createElement("BUTTON");
    var buttonMinus = document.createElement("BUTTON");
    var buttonExtent = document.createElement("BUTTON");

    buttonPlus['innerHTML'] = "<span class='fa fa-search-plus fa-x1' aria-hidden='true'></span>";
    buttonMinus['innerHTML'] = "<span class='fa fa-search-minus fa-x1' aria-hidden='true'></span>";
    buttonExtent['innerHTML'] = "<span class='fa fa-compass fa-x1' aria-hidden='true'></span>";

    buttonPlus["className"] = "btn btn-success Map-btn map-ZoomIn";
    buttonMinus["className"] = "btn btn-success Map-btn map-ZoomOut";
    buttonExtent["className"] = "btn btn-success Map-btn map-ZoomToExtent";

    $(buttonPlus).prop("type", "button");
    $(buttonMinus).prop("type", "button");
    $(buttonExtent).prop("type", "button");

    $(buttonExtent).prop("title", this.oTranslates['COMPONENT_MAP_ZOOM_EXTENT']);

    $(buttonPlus).on("click", function () {
        var currentResolution = this_.View.getResolution();
        this_.MapObject.beforeRender(ol.animation.zoom({
            "resolution": currentResolution,
            "duration": 250,
            "easing": ol.easing.easeOut
        }));
        var newResolution = this_.View.constrainResolution(currentResolution, 1);
        this_.View.setResolution(newResolution);

        var zoom = this_.MapObject.getView().getZoom();
        this_.MapObject.getView().setZoom(zoom + 1);
    });
    $(buttonMinus).on("click", function () {
        var currentResolution = this_.View.getResolution();
        this_.MapObject.beforeRender(ol.animation.zoom({
            "resolution": currentResolution,
            "duration": 250,
            "easing": ol.easing.easeOut
        }));
        var newResolution = this_.View.constrainResolution(currentResolution, -1);
        this_.View.setResolution(newResolution);

        var zoom = this_.MapObject.getView().getZoom();
        this_.MapObject.getView().setZoom(zoom - 1);
    });
    $(buttonExtent).on("click", function () {
        this_.MapObject.getView().fit(this_.Extent, this_.MapObject.getSize());
    });

    var element = document.createElement("DIV");
    element["className"] = "btn-group-vertical btn-group-md form-map-Group-btn-zoom";

    element.appendChild(buttonPlus);
    element.appendChild(buttonMinus);
    element.appendChild(buttonExtent);

    target.appendChild(element);

    return element;
};

/**
 * Add all Interactions of the map
 * @param {Object} target target Element HTML where button will be
 * @param {Object} objInter who specify if an interaction is present or not
 * @returns {Object} Return the Element who contains all interaction's buttons
 */
nsVitisComponent.Map.prototype.addInteractions = function (target, objInter) {
    var arrButton = [];
    var this_ = this;
    
    var scope = this.$scope_;

    /**
     * Full Screen
     */
    if (objInter["full_screen"]) {

        // Si il est possible d'afficher en fullScreen
        if (
                document['fullscreenEnabled'] ||
                document['webkitFullscreenEnabled'] ||
                document['mozFullScreenEnabled'] ||
                document['msFullscreenEnabled']
                ) {

            var button_full_screen = document.createElement("BUTTON");
            button_full_screen['innerHTML'] = "<span class='icon-enlarge' aria-hidden='true'></span>";
            button_full_screen["className"] = "btn btn-success Map-btn map-FullScreen";
            button_full_screen["title"] = this.oTranslates['COMPONENT_MAP_FULLSCREEN'];
            $(button_full_screen).prop("type", "button");
            $(button_full_screen).on("click", function () {

                var elem = this_.Target;

                // Si on est déjà en mode plein écran
                if (
                        document.fullscreenElement ||
                        document.webkitFullscreenElement ||
                        document.mozFullScreenElement ||
                        document.msFullscreenElement
                        ) {

//                    $(button_full_screen).children('span').removeClass('icon-shrink');

                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {

//                    $(button_full_screen).children('span').addClass('icon-shrink');

                    if (elem.requestFullscreen) {
                        elem.requestFullscreen();
                    } else if (elem.mozRequestFullScreen) {
                        elem.mozRequestFullScreen();
                    } else if (elem.webkitRequestFullscreen) {
                        elem.webkitRequestFullscreen();
                    }
                }

            });
            arrButton.push(button_full_screen);
        }
    }
    if (objInter["layer_tree"]) {

        var button_layer_tree = document.createElement("BUTTON");
        button_layer_tree['innerHTML'] = "<span class='icon-layers2' aria-hidden='true'></span>";
        button_layer_tree["className"] = "btn btn-success Map-btn map-LayerTree";
        button_layer_tree["title"] = this.oTranslates['COMPONENT_MAP_LAYERSTREE'];
        $(button_layer_tree).prop("type", "button");
        $(button_layer_tree).on("click", function () {

            this_['bLayersTreeOpen'] = !this_['bLayersTreeOpen'];
            this_.MapObject.dispatchEvent('moveend');

        });
        arrButton.push(button_layer_tree);

    }
    /**
     * Remode All Features
     */
    if (objInter["RA"]) {
        var button_ra = document.createElement("BUTTON");
        button_ra['innerHTML'] = "<span class='icon-trash' aria-hidden='true'></span>";
        button_ra["className"] = "btn btn-success Map-btn map-AllRemove";
        button_ra["title"] = this.oTranslates['COMPONENT_MAP_DELETE_ALL'];
        $(button_ra).prop("type", "button");
        $(button_ra).on("click", function () {
            if (this_.interaction !== "none") {
                this_.MapObject.removeInteraction(this_.interaction);
            }
            this_.FeatureOverlay.getSource().getFeaturesCollection().clear();
            this_.FeatureOverlay.getSource().changed();
            this_.Features.changed();
        });
        arrButton.push(button_ra);
    }
    /**
     * Remove Feature
     */
    if (objInter["RO"]) {
        var button_ro = document.createElement("BUTTON");
        button_ro['innerHTML'] = "<span class='icon-eraser' aria-hidden='true'></span>";
        button_ro["className"] = "btn btn-success Map-btn map-Remove";
        button_ro["title"] = this.oTranslates['COMPONENT_MAP_DELETE_FEATURE'];
        $(button_ro).prop("type", "button");
        $(button_ro).on("click", function () {
            var isActive = $(button_ro).hasClass('active');
            if (this_.interaction !== "none") {
                this_.MapObject.removeInteraction(this_.interaction);
                // allow to toggle the interaction
                if (isActive)
                    return 0;
            }
            this_.interaction = new ol.interaction.Select({
                condition: ol.events.condition.click,
                source: this_.FeatureOverlay.getSource()
            });
            this_.selectHover_.setActive(true);
            this_.interaction.set('binded-button', button_ro);
            this_.MapObject.addInteraction(this_.interaction);
            this_.interaction.getFeatures().on("add", function () {

                this_.FeatureOverlay.getSource().removeFeature(this_.interaction.getFeatures().getArray()[0]);
                this_.interaction.getFeatures().clear();
                this_.selectHover_.getFeatures().clear();

                this_.FeatureOverlay.getSource().changed();
                this_.Features.changed();
            });
        });
        arrButton.push(button_ro);
    }
    /**
     * Modify Feature
     */
    if (objInter["ED"]) {
        var button_ed = document.createElement("BUTTON");
        button_ed['innerHTML'] = "<span class='icon-edit' aria-hidden='true'></span>";
        button_ed["className"] = "btn btn-success Map-btn map-Modify";
        button_ed["title"] = this.oTranslates['COMPONENT_MAP_MODIFY_FEATURE'];
        $(button_ed).prop("type", "button");
        $(button_ed).on("click", function () {
            var isActive = $(button_ed).hasClass('active');
            if (this_.interaction !== "none") {
                this_.MapObject.removeInteraction(this_.interaction);
                // allow to toggle the interaction
                if (isActive)
                    return 0;
            }
            this_.interaction = new ol.interaction.Modify({
                features: this_.FeatureOverlay.getSource().getFeaturesCollection()
            });
            this_.interaction.set('binded-button', button_ed);
            this_.MapObject.addInteraction(this_.interaction);
            this_.interaction.on('modifyend', function () {
                this_.Features.changed();
            });
        });
        arrButton.push(button_ed);
    }
    /**
     * Draw Point
     */
    if (objInter["DP"]) {
        var button_dp = document.createElement("BUTTON");
        button_dp['innerHTML'] = "<span class='icon-point' aria-hidden='true'></span>";
        button_dp["className"] = "btn btn-success Map-btn map-Point";
        button_dp["title"] = this.oTranslates['COMPONENT_MAP_DRAW_POINT'];
        $(button_dp).prop("type", "button");
        $(button_dp).on("click", function () {
            var isActive = $(button_dp).hasClass('active');
            if (this_.interaction !== "none") {
                this_.MapObject.removeInteraction(this_.interaction);
                // allow to toggle the interaction
                if (isActive)
                    return 0;
            }
            this_.interaction = new ol.interaction.Draw({
                source: this_.FeatureOverlay.getSource(),
                type: "Point"
            });
            this_.interaction.set('binded-button', button_dp);
            this_.MapObject.addInteraction(this_.interaction);
            this_.interaction.on('drawend', function (event) {

                // Supprime si besoin les anciennes features
                if (objInter["multi_geometry"] !== true) {
                    var features = this_.FeatureOverlay.getSource().getFeaturesCollection().clear();
                }

                var featureID = featureID + 1;
                event.feature.d_ = featureID;
                //this_.Features.changed();
                this_.Features.dispatchEvent("change");
            });
        });

        arrButton.push(button_dp);
    }
    /**
     * Draw Line
     */
    if (objInter["DL"]) {
        var button_dl = document.createElement("BUTTON");
        button_dl['innerHTML'] = "<span class='icon-line' aria-hidden='true'></span>";
        button_dl["className"] = "btn btn-success Map-btn map-Line";
        button_dl["title"] = this.oTranslates['COMPONENT_MAP_DRAW_LINE'];
        $(button_dl).prop("type", "button");
        $(button_dl).on("click", function () {
            var isActive = $(button_dl).hasClass('active');
            if (this_.interaction !== "none") {
                this_.MapObject.removeInteraction(this_.interaction);
                // allow to toggle the interaction
                if (isActive)
                    return 0;
            }
            this_.interaction = new ol.interaction.Draw({
                source: this_.FeatureOverlay.getSource(),
                type: "LineString"
            });
            this_.interaction.set('binded-button', button_dl);
            this_.MapObject.addInteraction(this_.interaction);

            this_.interaction.on('drawend', function (event) {
                // Supprime si besoin les anciennes features
                if (objInter["multi_geometry"] !== true) {
                    var features = this_.FeatureOverlay.getSource().getFeaturesCollection().clear();
                }
                var featureID = featureID + 1;
                event.feature.d_ = featureID;
                this_.Features.changed();
            });
        });

        arrButton.push(button_dl);
    }
    /**
     * Draw Polygon
     */
    if (objInter["DPol"]) {
        var button_dpol = document.createElement("BUTTON");
        button_dpol['innerHTML'] = "<span class='icon-polygon' aria-hidden='true'></span>";
        button_dpol["className"] = "btn btn-success Map-btn map-Polygon";
        button_dpol["title"] = this.oTranslates['COMPONENT_MAP_DRAW_POLYGON'];
        $(button_dpol).prop("type", "button");
        $(button_dpol).on("click", function () {
            var isActive = $(button_dpol).hasClass('active');
            if (this_.interaction !== "none") {
                this_.MapObject.removeInteraction(this_.interaction);
                // allow to toggle the interaction
                if (isActive)
                    return 0;
            }
            this_.interaction = new ol.interaction.Draw({
                source: this_.FeatureOverlay.getSource(),
                type: "Polygon"
            });
            this_.interaction.set('binded-button', button_dpol);
            this_.MapObject.addInteraction(this_.interaction);
            this_.interaction.on('drawend', function (event) {
                // Supprime si besoin les anciennes features
                if (objInter["multi_geometry"] !== true) {
                    var features = this_.FeatureOverlay.getSource().getFeaturesCollection().clear();
                }
                var featureID = featureID + 1;
                event.feature.d_ = featureID;
                this_.Features.changed();
            });
        });
        arrButton.push(button_dpol);
    }

    var element = document.createElement("DIV");
    element["className"] = "btn-group-vertical btn-group-md form-map-Group-btn-interact";

    for (var i = 0; i < arrButton.length; i++) {
        element.appendChild(arrButton[i]);
    }

    target.appendChild(element);

    // actions sur les interactions
    setTimeout(function () {
        var interactions = this_.MapObject.getInteractions();

        // active la bouton lorsque l'interaction est en cours d'utilisation
        interactions.on('change:length', function () {
            // enlève active et focus de tous les éléments
            $(element).children().removeClass('active');
            $(element).children().blur();
            // rajoute active aux éléments actifs
            interactions.forEach(function (element, index, array) {
                $(element.get('binded-button')).addClass('active');
            });
        });

        // Désactive le selectHover lorsqu'une interraction est supprimée
        interactions.on('remove', function () {
            this_.selectHover_.setActive(false);
        });

        // désactive les interactions quand on appuie sur echap
        $(document).keydown(function (e) {
            if (e.keyCode === 27) {
                interactions.forEach(function (element, index, array) {
                    if (goog.isDef(element.get('binded-button'))) {
                        this_.MapObject.removeInteraction(element);
                    }
                });
            }
        });
    }, 1000);

    return element;
};

/**
 * Load a Map.json to set layers and view of the map
 * @param {Object} tree Json tree to set the map (he's generated by Vmap)
 * @export
 */
nsVitisComponent.Map.prototype.loadTree = function (tree) {

    if (this.MapObject.getLayers().getArray().length > 0)
        this.MapObject.getLayers().clear();

    this.Layers.length = 0;
    var oLayer;
    var aTree = [];

    for (var i = 0; i < tree["children"].length; i++) {
        if (goog.isDef(tree["children"][i]['view'])) {
            this.setVmapView(tree["children"][i]['view']);
        } else if (goog.isDef(tree["children"][i]['children'])) {

            var aLayers = [];

            for (var ii = 0; ii < tree["children"][i]['children'].length; ii++) {
                oLayer = this.addLayer(tree["children"][i]['children'][ii]);
                aLayers.push(oLayer);
            }

            aTree.push({
                'service': tree["children"][i]['name'],
                'layers': aLayers
            });
        }
    }

    // Réordonne les couches en fonction de leur index
    var this_ = this;
    setTimeout(function () {
        goog.array.sortObjectsByKey(this_.Layers, 'index');
        this_.MapObject.getLayers().clear();
        for (var i = 0; i < this_.Layers.length; i++) {
            this_.MapObject.addLayer(this_.Layers[i]['layer']);
        }
    }, 500);

    console.log("aTree: ", aTree);

    return aTree;
};

/**
 * Set the map View
 * @param {object} node
 * @export
 */
nsVitisComponent.Map.prototype.setVmapView = function (node) {

    if (goog.isArray(node['extent'])) {
        this.setExtent(node['extent']);
    } else {
        if (goog.isDefAndNotNull(node['scale'])) {
            this.setScale(node['scale']);
        }
        if (goog.isDefAndNotNull(node['center'])) {
            this.setCenter(node['center']);
        }
        if (goog.isDefAndNotNull(node['zoom'])) {
            this.setZoom(node['zoom']);
        }
    }
};

/**
 * Calculates if the viewExtent is inside the projExtent
 * @param {ol.Extent} viewExtent
 * @param {ol.Extent} projExtent
 * @returns {Boolean} true if the viewExtent is inside the projExtent
 */
nsVitisComponent.Map.prototype.isInsideProjExtent = function (viewExtent, projExtent) {

    var bIsInside = true;

    if (projExtent[0] > viewExtent[0])
        bIsInside = false;
    if (projExtent[1] > viewExtent[1])
        bIsInside = false;
    if (projExtent[2] < viewExtent[2])
        bIsInside = false;
    if (projExtent[3] < viewExtent[3])
        bIsInside = false;

    return bIsInside;
};

/**
 * Add a Layer from the Json tree 
 * @param {Object} node node of the Json tree will be add in the map
 */
nsVitisComponent.Map.prototype.addLayer = function (node) {
    // Définition de la source
    var source = this.getSource(node);

    // Définition de la couche
    var layer = this.getLayer(node, source);

    // Exporte les valeurs
    layer['values'] = layer.values_;

    var index = 0;
    // Mémorise l'ordre des couches
    if (node['index'])
        index = node['index'];

    var oLayer = {
        'index': index,
        'layer': layer
    };

    this.Layers.push(oLayer);

    this.MapObject.addLayer(layer);

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

    //node['olLayer'] = layer;

    // Lors que l'ajout de la couche est terminé
    // oVmap.layerAdded(layer);

    return oLayer;
};

/**
 * Return the source for a layer 
 * @param {Object} node node to generate source of the layer
 * @return {Object} source for the layer
 */
nsVitisComponent.Map.prototype.getSource = function (node) {

    var type = node['layerType'];
    var source;
    var this_ = this;

    /**
     * @param {object} node
     * @return {ol.source.WMTS}
     */
    var getWMTSSource = function (node) {
        var resolutions = [];
        var matrixIds = [];
        var projection = this_.Vie.getProjection();
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
            url: node["url"],
            urls: node["urls"],
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
        source = new ol.source.TileWMS({
            url: node["url"],
            urls: node["urls"],
            logo: node["logo"],
            hidpi: node["hidpi"],
            wrapX: node["wrapX"],
            gutter: node["gutter"],
            maxZoom: node["maxZoom"],
            tileGrid: node["tileGrid"],
            projection: node["projection"],
            serverType: node["serverType"],
            crossOrigin: node["crossOrigin"],
            tileLoadFunction: node["tileLoadFunction"],
            params: node["params"]
        });
    } else if (type === 'imagewms') {
        source = new ol.source.ImageWMS({
            url: node["url"],
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
        var vectorSource;
        if (node["features"]) {
            vectorSource = new ol.source.Vector({
                features: node["features"]
            });
        } else if (node["url"]) {
            vectorSource = new ol.source.GeoJSON({
                url: node["url"]
            });

        } else {
            console.error("Error: veuillez renseinger une url ou une feature");
            return;
        }
        source = new ol.source.ImageVector({
            style: node["style"],
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
 * Add all Layers from the Json tree 
 * @param {Object} node node of the Json tree to extract layer
 * @param {ol.source.Source} source for the layer will be added
 * @return {ol.layer.Tile} layer to add
 */
nsVitisComponent.Map.prototype.getLayer = function (node, source) {
    var layer;
    var type = node['layerType'];

    if (type === 'imagewms' || type === 'imagevector') {
        layer = new ol.layer.Image({
            source: source
        });
    } else if (type === 'layerGroup') {
        layer = new ol.layer.Group({
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.TileJSON({
                        url: 'http://api.tiles.mapbox.com/v3/' +
                                'mapbox.20110804-hoa-foodinsecurity-3month.jsonp',
                        crossOrigin: 'anonymous'
                    })
                }),
                new ol.layer.Tile({
                    source: new ol.source.TileJSON({
                        url: 'http://api.tiles.mapbox.com/v3/' +
                                'mapbox.world-borders-light.jsonp',
                        crossOrigin: 'anonymous'
                    })
                })
            ]
        });
    } else {
        layer = new ol.layer.Tile({
            source: source
        });
    }
    layer.set('type', type);
    layer.set('name', node["name"]);

    // definit si la légende est visible ou non
    //layer.set('legend', true);


    // definit si la légende est selectionnable ou non
    // queryable: la couche peut être ou pas interrogeable
    // select: la couche est interrogeable par défaut
    //layer.set('queryable', true);
    //if ((type !== "imagewms") && (type !== "tilewms"))
    //    layer.set('queryable', false);

    //node["select"] = true;
    //layer.set('select', true);

    // Ajout des couches en mode invisible
    layer.setVisible(false);

    return layer;
};

/**
 * return the scal eof the map
 * @return {number} scale of the map
 * @export
 */
nsVitisComponent.Map.prototype.getScale = function () {
    var wgs84Sphere_ = new ol.Sphere(6378137);
    var projection = this.MapObject.getView().getProjection();

    var map = this.MapObject;

    // récupère les coordonnées d'une ligue de 1cm (avec le zoom en cours)
    var line = map.getView().calculateExtent([37.795275591, 0]);
    var c1 = ol.proj.transform([line[0], line[1]], projection, 'EPSG:4326');
    var c2 = ol.proj.transform([line[2], line[3]], projection, 'EPSG:4326');

    // Récuère la longueur sur la carte de la ligne de 1cm
    var length = wgs84Sphere_.haversineDistance(c1, c2);

    // donc 1m sur la carte correspond à (length mètres dans la réalité x 100)
    var scale = length * 100;
    // stringifier 
    //scale = this.getPrettyScale(scale);

    return scale;
};

/**
 * set the scale of the map
 * @param {number} scale set the scale of the map and change the view
 * @export
 */
nsVitisComponent.Map.prototype.setScale = function (scale) {

    // calcule et va à l'échelle celon une règle de 3
    var currentScale = this["getScale"]();
    var currentResolution = this.MapObject.getView().getResolution();

    var scaleResolution = scale * currentResolution / currentScale;
    this.MapObject.getView().setResolution(scaleResolution);

    // Ajuste l'échelle en augementant la résolution
    currentScale = this["getScale"]();
};

/**
 * Set the map extent
 * @param {ol.Extent} extent
 */
nsVitisComponent.Map.prototype.setExtent = function (extent) {
    this.Extent = extent;
    this.MapObject.getView().fit(extent, this.MapObject.getSize(), {nearest: true});
};

/**
 * return the zoom value
 * @return {number} zoom Value
 * @export
 */
nsVitisComponent.Map.prototype.getZoom = function () {
    return this.MapObject.getView().getZoom();
};

/**
 * set the zoom value
 * @param {number} zoom value to resize Map
 * @export
 */
nsVitisComponent.Map.prototype.setZoom = function (zoom) {
    this.MapObject.getView().setZoom(zoom);
};

/**
 * set the coordinate of the View's center
 * @param {ol.Coordinate} coord coordinate of the center
 * @export
 */
nsVitisComponent.Map.prototype.setCenter = function (coord) {
    this.MapObject.getView().setCenter(coord);
};

/**
 * set the Controls on the map
 * @param {Object} obj object to configure Controls
 * @export
 */
nsVitisComponent.Map.prototype.setControls = function (obj) {
    var this_ = this;
    // on supprime tous les Controls
    this.MapObject.getControls().clear();
    //si le zoom est défini on le supprime
    if (this.ZoomGroup !== "undefined") {
        $(this.ZoomGroup).remove();
    }
    //on réinstancie les controls OK
    if (obj["ZO"]) {
        this.ZoomGroup = this.zoomControls(this.Target);
    }
    if (obj["MP"]) {
        this.MapObject.addControl(new ol.control.MousePosition({
            coordinateFormat: function (coordinate) {
                //var coord = ol.proj.transform(coordinate, "EPSG:3857", this_.proj_);
                return [coordinate[0].toPrecision(this_.Accuracy), coordinate[1].toPrecision(this_.Accuracy)];
            }
        }));
        $(".ol-mouse-position").css("bottom", "8px");
        $(".ol-mouse-position").css("top", "auto");
        $(".ol-mouse-position").css("background", "rgba(218, 94, 209, 0.58)");
        $(".ol-mouse-position").css("color", "#ffffff");
        $(".ol-mouse-position").css("border-radius", "4px");
    }
    if (obj["SL"]) {
        this.MapObject.addControl(new ol.control.ScaleLine());

        $(".ol-scale-line").css("background", "rgba(218, 94, 209, 0.58)");
    }
    if (obj["CP"]) {
        this.MapObject.addControl(new ol.control.Control({
            "element": this_.element,
            "render": function () {
                $(this_.element).html(this_.proj_);
            }
        }));
    }
};

/**
 * set the Interactions on the map
 * @param {Object} obj object to configure Interactions
 * @export
 */
nsVitisComponent.Map.prototype.setInteractions = function (obj) {
    this.MapObject.getInteractions().clear();
    if (this.IntractionsGroup !== "undefined") {
        $(this.IntractionsGroup).remove();
    }
    this.IntractionsGroup = this.addInteractions(this.Target, obj);

    ol.interaction.defaults().forEach(function (el, index, arr) {
        this.MapObject.addInteraction(el);
    }, this);
};

/**
 * set the Source for Bing's Map
 * @param {Object} objSource an object who contain key, culture, imageryset for the Map
 * @export
 */
nsVitisComponent.Map.prototype.setBingSource = function (objSource) {
    this.MapObject.getLayers().getArray()[0].setSource(
            new ol.source.BingMaps({
                culture: objSource["culture"],
                key: objSource["key"],
                imagerySet: objSource["style"]
            })
            );
};

/**
 * return the config object of the map
 * @return {object} an object who contain extent, coord of center and scale of the map
 * @export
 */
nsVitisComponent.Map.prototype.getConfig = function () {
    this.Config["extent"] = this.View.calculateExtent(this.MapObject.getSize());
    this.Config["coord"] = this.View.getCenter();
    this.Config["scale"] = Math.round(this["getScale"]());
    return this.Config;
};

/**
 * return the map Object
 * @return {Object} the Map object
 * @export
 */
nsVitisComponent.Map.prototype.getMap = function () {
    return this.MapObject;
};

/**
 * set the Map's View
 * @param {Object} options an object to configure the view of the map
 * @export
 */
nsVitisComponent.Map.prototype.setView = function (options) {

    this.proj_ = options["proj"];

    var center, extent;
    /*if (options["proj"] !== "EPSG:3857") {
     if (goog.isDef(options["center"]["coord"]))
     center = ol.proj.transform(options["center"]["coord"], options["proj"], "EPSG:3857");
     if (goog.isDef(options["center"]["extent"]))
     extent = ol.proj.transform(options["center"]["extent"], options["proj"], "EPSG:3857");
     } else {*/
    if (goog.isDef(options["center"]["coord"]))
        center = options["center"]["coord"];
    if (goog.isDef(options["center"]["extent"]))
        extent = options["center"]["extent"];
    //}

    if (options["center"]["coord"] && options["center"]["zoom"]) {
        this.View = new ol.View({
            "center": center,
            "zoom": options["center"]["zoom"],
            "projection": ol.proj.get(this.proj_)
        });
        this.MapObject.setView(this.View);
    } else {
        this.View = new ol.View({
            "center": [((extent[0] + extent[2]) / 2), ((extent[1] + extent[3]) / 2)],
            //"zoom": options["center"]["zoom"],
            "projection": ol.proj.get(this.proj_)
        });
        this.MapObject.setView(this.View);
        this.MapObject.getView().fit(extent, this.MapObject.getSize(), {nearest: true});
    }

    var currentProj = "";
    for (var i = 0; i < this.oProj_["projections"]; i++) {
        if (this.proj_ === this.oProj["projections"][i]["code"]) {
            currentProj = this.oProj["projections"][i]["name"];
        }
    }
    if (currentProj !== '') {
        $(".ol-current-projection-studio").html(currentProj);
    } else {
        $(".ol-current-projection-studio").html(this.proj_);
    }
};

/**
 * load a json tree to configure the map
 * @param {Object} tree  Json tree (create him with Vmap)
 * @export
 */
nsVitisComponent.Map.prototype.setJsonTree = function (tree) {
    this.loadTree(tree);
};


/**
 * return the Features draw on the map
 * @return {array.<ol.Feature>} the Feature on the map
 * @export
 */
nsVitisComponent.Map.prototype.getFeatures = function () {
    return this.Features.getArray();
};

/**
 * return the EPSG reference of the projection
 * @return {string} projection code EPSG
 * @export
 */
nsVitisComponent.Map.prototype.getProj = function () {
    return this.proj_;
};

/**
 * return extent of the view
 * @return {array <number>} coord of extent
 * @export
 */
nsVitisComponent.Map.prototype.getExtent = function () {
    return this.View.calculateExtent(this.MapObject.getSize());
};

/**
 * return the center of the view
 * @return {array <number>} coord of center
 * @export
 */
nsVitisComponent.Map.prototype.getCenter = function () {
    return this.View.getCenter();
};


/**
 * return reprojection of coordinate pass as data in a projection to another projection
 * @param {array.<float>} data data for the transformation
 * @param {string} epsgFrom origin's Code EPSG 
 * @param {string} epsgTo destination's Code EPSG 
 * @return {array.<float>} projection code EPSG
 * @export
 */
nsVitisComponent.Map.prototype.transformer = function (data, epsgFrom, epsgTo) {
    return ol.proj.transform(data, epsgFrom, epsgTo);
};

/**
 * return reprojection of extent pass as data in a projection to another projection
 * @param {array.<float>} extent extent for the transformation
 * @param {string} epsgFrom origin's Code EPSG 
 * @param {string} epsgTo destination's Code EPSG 
 * @return {array.<float>} projection code EPSG
 * @export
 */
nsVitisComponent.Map.prototype.transformExtent = function (extent, epsgFrom, epsgTo) {
    return ol.proj.transformExtent(extent, epsgFrom, epsgTo);
};

/**
 * return the Features draw on the map
 * @return {array.<ol.Feature>} the Feature on the map
 * @export
 */
nsVitisComponent.Map.prototype.on = function (event, handler, this_) {
    this.MapObject.on(event, handler, this_);
};

nsVitisComponent.Map.prototype.drawPoint = function (x, y) {
    var Map = this.getMap();
    var this_ = this;
    var Point = new ol.Feature({
        "geometry": new ol.geom.Point([x, y])
    });
    var array = Map.getLayers().getArray();

    array.forEach(function (item, index, array) {
        if (goog.isDef(item.getSource().getFeatures)) {
            var Features = item.getSource().getFeaturesCollection();

            if (this_.multiGeom !== true) {
                item.getSource().getFeaturesCollection().clear();
            }

            Features.push(Point);
        }
    });
    this.setCenter([x, y]);
};


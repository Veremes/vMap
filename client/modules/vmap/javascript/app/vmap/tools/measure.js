/* global oVmap, ol, nsVmap, goog */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.Measure
 * cette classe permet l'initialisation des outils de measure
 */
goog.provide('nsVmap.nsToolsManager.Measure');

goog.require('ol.interaction.Draw');
goog.require('ol.style.Style');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');
goog.require('ol.style.Circle');
goog.require('ol.Sphere');
goog.require('ol.source.Vector');
goog.require('ol.layer.Vector');
goog.require('ol.Collection');
goog.require('ol.interaction.Modify');
goog.require('ol.interaction.Select');
goog.require('ol.Overlay');
goog.require('ol.interaction.Draw');
goog.require('ol.geom.LineString');


/**
 * @classdesc
 * Class {@link nsVmap.nsToolsManager.Measure}: Add the measure tools defined in data/tools.json
 *
 * @constructor
 * @export
 */
nsVmap.nsToolsManager.Measure = function () {
    oVmap.log('nsVmap.nsToolsManager.Measure');

    // Directives et controleurs Angular
    oVmap.module.directive('appMeasure', this.measureDirective);
    oVmap.module.controller('AppmeasureController', this.measureController);
};
goog.exportProperty(nsVmap.nsToolsManager, 'Measure', nsVmap.nsToolsManager.Measure);

/**
 * App-specific directive wrapping the measure tools. The directive's
 * controller has a property "map" including a reference to the OpenLayers
 * map.
 *
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.nsToolsManager.Measure.prototype.measureDirective = function () {
    oVmap.log("nsVmap.nsToolsManager.Measure.prototype.measureDirective");
    return {
        restrict: 'A',
        scope: {
            'map': '=appMap',
            'lang': '=appLang',
            'currentAction': '=appAction'
        },
        controller: 'AppmeasureController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/measure.html'
    };
};

/**
 * @ngInject
 * @export
 * @constructor
 */
nsVmap.nsToolsManager.Measure.prototype.measureController = function () {
    oVmap.log("nsVmap.nsToolsManager.Measure.prototype.measureController");

    var this_ = this;

    /**
     * @type {ol.Sphere}
     * @private
     */
    this.wgs84Sphere_ = new ol.Sphere(6378137);

    /**
     * @type {ol.map}
     * @private
     */
    this.map_ = oVmap.getMap().getOLMap();

    /**
     * @type {ol.style.Style}
     */
    var style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            }),
            stroke: new ol.style.Stroke({
                color: '#FFFFFF'
            })
        })
    });

    /**
     * @type {ol.layer.Vector}
     * @private
     */
    this.oOpenLayersMeasureOverlay_ = oVmap.getMap().addVectorLayer({style: style});

    /**
     * @type {ol.Collection}
     * @private
     */
    this.oOpenLayersMeasureOverlayFeatures_ = this.oOpenLayersMeasureOverlay_.getSource().getFeaturesCollection();

    /**
     * Currently drawn feature.
     * @type {ol.Feature}
     * @private
     */
    this.sketch_;

    /**
     * The measure measure-tooltip element.
     * @type {Element}
     * @private
     */
    this.measureTooltipElement_;

    /**
     * The measure measure-tooltip element that is hided on changing action.
     * @type {Element}
     * @private
     */
    this.measureTooltipElementTemp_;

    /**
     * Overlay to show the measurement.
     * @type {ol.Overlay}
     * @private
     */
    this.measureTooltip_;

    /**
     * Overlay to show the measurement that is hided on changing action..
     * @type {ol.Overlay}
     * @private
     */
    this.measureTooltipTemp_;

    /**
     * Map tooltip
     * @type {object}
     * @private
     */
    this.helpTooltip_ = new nsVmap.Map.MapTooltip({id: 'measure-tooltip'});

    /**
     * Message to show when the user is drawing a polygon.
     * @type {string}
     * @private
     */
    this.continuePolygonMsg_ = 'Doublecliquer pour terminer le polygone';

    /**
     * Message to show when the user is drawing a line.
     * @type {string}
     * @private
     */
    this.continueLineMsg_ = 'Doublecliquer pour terminer la ligne';

    /**
     * Message to show when the user is drawing a circle.
     * @type {string}
     * @private
     */
    this.continueCircleMsg_ = 'Cliquer pour terminer le cercle';

    /**
     * Message to show when the user is drawing a point.
     * @type {string}
     * @private
     */
    this.continuePointMsg_ = 'Cliquer pour terminer le point';

    /**
     * @type {ol.interaction.Draw}
     * @private
     */
    this.draw_;

    /**
     * @type {ol.interaction.Modify}
     * @private
     */
    this.modify_ = new ol.interaction.Modify({
        features: this.oOpenLayersMeasureOverlayFeatures_
    });

    /**
     * @type {ol.interaction.Select}
     * @private
     */
    this.selectHover_ = new ol.interaction.Select({
        layers: [this.oOpenLayersMeasureOverlay_],
        condition: ol.events.condition.pointerMove
    });

    /**
     * @type {ol.interaction.Select}
     * @private
     */
    this.delete_ = new ol.interaction.Select({
        layers: [this.oOpenLayersMeasureOverlay_]
    });

    /**
     * Current projection
     * @private
     */
    this['projection'] = this['map'].getView().getProjection().getCode();

    /**
     * List of the avaliable projections with their names
     * @private
     */
    this['oProjections'] = oVmap['oProjections'];
    
    this['transform'] = ol.proj.transform;

    this['map'].on('change:view', function () {
        this_['projection'] = this_['map'].getView().getProjection().getCode();
    });

    this.delete_.on('select', function () {
        var aSelectedFeatures = this.delete_.getFeatures().getArray();
        var aOverlays = [];
        var aMeasuresToDelete = [];

        // Supprime les features du featureOverlay et leurs annotations
        for (var i = aSelectedFeatures.length - 1; i >= 0; i--) {
            // remove the overlays measures
            aOverlays = oVmap.getMap().getOLMap().getOverlays().getArray();
            aMeasuresToDelete = [];
            for (var ii = aOverlays.length - 1; ii >= 0; ii--) {
                if (aOverlays[ii].get('feature') === aSelectedFeatures[i] || aOverlays[ii].get('feature') === 'info') {
                    aMeasuresToDelete.push(aOverlays[ii]);
                }
            }

            for (var ii = aMeasuresToDelete.length - 1; ii >= 0; ii--) {
                oVmap.getMap().getOLMap().getOverlays().remove(aMeasuresToDelete[ii]);
            }

            this.oOpenLayersMeasureOverlayFeatures_.remove(aSelectedFeatures[i]);
        }

        // Supprime les features de la selection
        this.delete_.getFeatures().clear();
        // Supprime les features de la selectionHover
        this.selectHover_.getFeatures().clear();
        // enlève l'outil de suppression
//		this.removeMeasuresInteractions();
    }, this);

    this.geodesicCheckbox_ = document.getElementById('geodesic');
};

/**
 * Creates a new measure measure-tooltip
 * @param {ol.Feature} oFeature Feature to create the tooltip
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.createMeasureTooltip = function (oFeature) {
    if (this.measureTooltipElement_) {
        this.measureTooltipElement_.parentNode.removeChild(this.measureTooltipElement_);
    }
    this.measureTooltipElement_ = document.createElement('div');
    this.measureTooltipElement_.className = 'measure-tooltip measure-tooltip-measure';
    this.measureTooltip_ = new ol.Overlay({
        element: this.measureTooltipElement_,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    this.measureTooltip_.set('type', 'measure');

    if (oFeature !== undefined)
        this.measureTooltip_.set('feature', oFeature);

//    oVmap.getMap().addOverlay(this.measureTooltip_);
    this.map_.addOverlay(this.measureTooltip_);
};
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.createMeasureTooltip2 = function (oFeature) {
    if (this.measureTooltipElementTemp_) {
        this.measureTooltipElementTemp_.parentNode.removeChild(this.measureTooltipElementTemp_);
    }
    this.measureTooltipElementTemp_ = document.createElement('div');
    this.measureTooltipElementTemp_.className = 'measure-tooltip measure-tooltip-measure';
    this.measureTooltipTemp_ = new ol.Overlay({
        element: this.measureTooltipElementTemp_,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    this.measureTooltipTemp_.set('type', 'measure');

    if (oFeature !== undefined)
        this.measureTooltipTemp_.set('feature', oFeature);

    oVmap.getMap().addOverlay(this.measureTooltipTemp_);
//    this.map_.addOverlay(this.measureTooltip_);
};

/**
 * Add an OpenLayers interaction on the map
 * @param {string} type Intreaction type
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.addInteraction = function (type) {
    oVmap.log('addInteraction');

    var this_ = this;

    this.draw_ = oVmap.getMap().setDrawInteraction({type: type, features: this.oOpenLayersMeasureOverlayFeatures_}, 'basicTools-measure' + type);

    this.createMeasureTooltip('info');

    this.draw_.on('drawstart', function (evt) {
        this.createMeasureTooltip2(evt.feature);
        // set this.sketch_
        this.sketch_ = evt.feature;

        /** @type {ol.Coordinate|undefined} */
        var tooltipCoord = evt.coordinate;


        this_.listener = this.sketch_.getGeometry().on('change', function (evt) {

            var geom = evt.target;
            var output;

            if (geom instanceof ol.geom.Polygon) {
                output = this_.formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
                output = this_.formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            } else if (geom instanceof ol.geom.Circle) {
                output = this_.formatRadius(geom);
                tooltipCoord = geom.getLastCoordinate();
            }

            this_.measureTooltipElementTemp_.innerHTML = output;
            this_.measureTooltipTemp_.setPosition(tooltipCoord);
        });

    }, this);
    this.draw_.on('drawend',
            function (evt) {
                this.createMeasureTooltip(evt.feature);
                this.setInfosToFeature(evt.feature);
                this.measureTooltipElement_.innerHTML = this_.measureTooltipElementTemp_.innerHTML;
                this.measureTooltipElementTemp_.style.display = 'none';
                this.measureTooltipElement_.className = 'measure-tooltip measure-tooltip-static';
                this.measureTooltip_.setOffset([0.8, -13]);
                this.measureTooltip_.setPosition(this.getTooltipPosition(evt.feature.getGeometry()));
                // unset this.sketch_
                this.sketch_ = null;
                // unset measure-tooltip so that a new one can be created
                this.measureTooltipElement_ = null;
                this.showHideAnotations();
                this.updateTooltip(evt.feature);

                if (this.measureTooltipElement_) {
                    this.measureTooltipElement_.className = 'measure-tooltip measure-tooltip-static';
                    this.measureTooltipElement_.remove();
                    this.measureTooltip_.setOffset([0, -7]);
                    // unset this.sketch_
                    this.sketch_ = null;
                    // unset measure-tooltip so that a new one can be created
                    this.measureTooltipElement_ = null;
                }

                // Fonctions appelées après modification de la feature
                evt.feature.on('change', function () {
                    this.updateTooltip(evt.feature);
                }, this);

                ol.Observable.unByKey(this_.listener);

            }, this);
};

/**
 * Update the tooltip of a feature
 * @param {ol.Feature} olFeature
 * @param {boolean|undefined} bReloadInos true if you want to reload the feature infos. Default is true
 * @returns {undefined}
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.updateTooltip = function (olFeature, bReloadInos) {
    oVmap.log('nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.updateTooltip');

    var reload = goog.isDef(bReloadInos) ? bReloadInos : true;

    // Met à jour les infos de la feature
    if (reload)
        this.setInfosToFeature(olFeature);

    // Met à jour l'étiquette
    var aOverlays = oVmap.getMap().getOLMap().getOverlays();
    for (var i = aOverlays.getArray().length - 1; i >= 0; i--) {
        if (aOverlays.getArray()[i].get('feature') === olFeature) {
            aOverlays.getArray()[i].setPosition(this.getTooltipPosition(olFeature.getGeometry()));
            if (olFeature.get('Type') === 'Ligne') {
                aOverlays.getArray()[i].getElement().innerHTML = olFeature.get('Longueur');
            } else if (olFeature.get('Type') === 'Polygone') {
                aOverlays.getArray()[i].getElement().innerHTML = olFeature.get('Superficie');
            } else if (olFeature.get('Type') === 'Cercle') {
                aOverlays.getArray()[i].getElement().innerHTML = olFeature.get('Perimètre');
            } else if (olFeature.get('Type') === 'Point') {

                var coords = ol.proj.transform(olFeature.get('Coordonnées'), this['projection'], olFeature.get('Projection'));
                var option;
                var htmlSelect = document.createElement('select');
                
                for (var code in this['oProjections']) {
                    option = document.createElement('option');
                    option.value = code;
                    option.innerHTML = oVmap['oProjections'][code];
                    htmlSelect.appendChild(option);
                }

                htmlSelect.value = olFeature.get('Projection');

                var htmlInfos = document.createElement('div');
                htmlInfos.innerHTML = 'X = ' + parseFloat(coords[0]).toPrecision(9);
                htmlInfos.innerHTML += '<br>';
                htmlInfos.innerHTML += 'Y = ' + parseFloat(coords[1]).toPrecision(9);

                var this_ = this;
                htmlSelect.onchange = function () {
                    var newProjection = this.value;
                    olFeature.set('Projection', newProjection);
                    this_.updateTooltip(olFeature, false);
                };

                $(aOverlays.getArray()[i].getElement()).empty();
                aOverlays.getArray()[i].getElement().appendChild(htmlSelect);
                aOverlays.getArray()[i].getElement().appendChild(htmlInfos);

            }
        }
    }
};

/**
 * Put the infos in to the feature
 * @param {ol.Feature} olFeature Feature to put the infos in
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.setInfosToFeature = function (olFeature) {

    if (olFeature.getGeometry() instanceof ol.geom.Point) {
        // Type
        olFeature.set('Type', 'Point');
        // Coordonnées
        olFeature.set('Coordonnées', this.formatCoordinate(olFeature.getGeometry()));
        // Projection
        olFeature.set('Projection', this['map'].getView().getProjection().getCode());

    } else if (olFeature.getGeometry() instanceof ol.geom.LineString) {
        // Type
        olFeature.set('Type', 'Ligne');
        // Longueur
        olFeature.set('Longueur', this.formatLength(olFeature.getGeometry()));
        // Projection
        olFeature.set('Projection', this['map'].getView().getProjection().getCode());

    } else if (olFeature.getGeometry() instanceof ol.geom.Polygon) {
        // Type
        olFeature.set('Type', 'Polygone');
        // Perimetre
        olFeature.set('Perimètre', this.formatPerimeter(olFeature.getGeometry()));
        // Superficie
        olFeature.set('Superficie', this.formatArea(olFeature.getGeometry()));
        // Projection
        olFeature.set('Projection', this['map'].getView().getProjection().getCode());

    } else if (olFeature.getGeometry() instanceof ol.geom.Circle) {

        var radius = parseFloat(this.formatRadius(olFeature.getGeometry()));
        var unit = this.formatRadius(olFeature.getGeometry()).replace(radius, '');
        var diameter = radius * 2;
        var perimeter = Math.PI * radius * 2;
        var area = Math.PI * Math.pow(radius, 2);
        // Type
        olFeature.set('Type', 'Cercle');
        // Rayon
        olFeature.set('Rayon', radius + unit);
        // Diamètre
        olFeature.set('Diamètre', diameter.toFixed(4) + unit);
        // Perimetre
        olFeature.set('Perimètre', perimeter.toFixed(4) + unit);
        // Superficie
        olFeature.set('Superficie', area.toFixed(4) + unit + "²");
        // Centre
        olFeature.set('Centre', [olFeature.getGeometry().getCenter()[0].toFixed(4), olFeature.getGeometry().getCenter()[1].toFixed(4)]);
        // Projection
        olFeature.set('Projection', this['map'].getView().getProjection().getCode());

    } else {
        // Type
        olFeature.set('Type', 'undefined');
    }

    // Id
    var id = this.oOpenLayersMeasureOverlayFeatures_.getLength() - 1;
    olFeature.set('Id', id);

    // Keys
    olFeature.set('Keys', olFeature.getKeys());
};

/**
 * Set the tooltip position
 * @param {ol.geom.Geometry} geom The feature to place the tooltip in
 * return {ol.Coordinate} The coordinates where place the tooltip
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.getTooltipPosition = function (geom) {

    if (geom.getType() === 'Polygon') {

        var position = geom.getInteriorPoint().getLastCoordinate();

    } else if (geom.getType() === 'LineString') {

        var position = geom.getLastCoordinate();

    } else if (geom.getType() === 'Circle') {

        var position = geom.getCenter();

    } else if (geom.getType() === 'Point') {

        var position = geom.getLastCoordinate();

    } else {
        return geom.getLastCoordinate();
    }

    return position;
};

/**
 * format length output
 * @param {ol.geom.LineString} line
 * @return {string}
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.formatLength = function (line) {
    var length;
    if (this.geodesicCheckbox_.checked
            && (this.map_.getView().getProjection().getCode() === 'EPSG:3857')
            || this.map_.getView().getProjection().getCode() === 'EPSG:4326') {
        var coordinates = line.getCoordinates();
        length = this.calcDistance(coordinates);
    } else {
        length = line.getLength();
    }
    var output;
    if (length > 1000) {
        output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km';
    } else {
        output = (Math.round(length * 100) / 100) +
                ' ' + 'm';
    }
    return output;
};

/**
 * Calculate the distance between points with the haversine method
 * @param {array<ol.Coordinate>} coordinates Coordinates
 * @return {number} Distance between the two points
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.calcDistance = function (coordinates) {
    length = 0;
    var sourceProj = this.map_.getView().getProjection();
    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
        var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
        length += this.wgs84Sphere_.haversineDistance(c1, c2);
    }

    return length;
};

/**
 * format length output
 * @param {ol.geom.Point} point
 * @param {string} proj projection code
 * @return {string}
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.formatCoordinate = function (point) {
    var output = [point.getCoordinates()[0].toPrecision(9), point.getCoordinates()[1].toPrecision(9)];
    return output;
};

/**
 * format radius output
 * @param {ol.geom.Circle} circle
 * @return {string}
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.formatRadius = function (circle) {
    var radius;
    if (this.geodesicCheckbox_.checked
            && (this.map_.getView().getProjection().getCode() === 'EPSG:3857')
            || this.map_.getView().getProjection().getCode() === 'EPSG:4326') {
        var coordinates = [circle.getFirstCoordinate(), circle.getLastCoordinate()];
        radius = this.calcDistance(coordinates);
    } else {
        radius = Math.round(circle.getRadius() * 100) / 100;
    }
    var output;
    if (radius > 1000) {
        output = (Math.round(radius / 1000 * 100) / 100) +
                ' ' + 'km';
    } else {
        output = (Math.round(radius * 100) / 100) +
                ' ' + 'm';
    }
    return output;
};

/**
 * format perimeter output
 * @param {ol.geom.Polygon} polygon
 * @return {string}
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.formatPerimeter = function (polygon) {

    var lineString = new ol.geom.LineString(
            polygon.getCoordinates()[0],
            polygon.getLayout()
            );

    return this.formatLength(lineString);
};

/**
 * format area output
 * @param {ol.geom.Polygon} polygon
 * @return {string}
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.formatArea = function (polygon) {
    var area;
    if (this.geodesicCheckbox_.checked
            && (this.map_.getView().getProjection().getCode() === 'EPSG:3857')
            || this.map_.getView().getProjection().getCode() === 'EPSG:4326') {
        var sourceProj = this.map_.getView().getProjection();
        var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
                sourceProj, 'EPSG:4326'));
        var coordinates = geom.getLinearRing(0).getCoordinates();
        area = Math.abs(this.wgs84Sphere_.geodesicArea(coordinates));
    } else {
        area = polygon.getArea();
    }
    var output;
    if (area > 1000000) {
        output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'km²';
    } else {
        output = (Math.round(area * 100) / 100) +
                ' ' + 'm²';
    }
    return output;
};

/**
 * zoom to the selected feature
 * @param{ol.Feature}
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.zoomToFeature = function (feature) {
    oVmap.log("nsVmap.nsToolsManager.Measure.prototype.measureController.zoomToFeature");

    if (feature.get('Type') === 'Point') {
        this.map_.getView().setCenter(feature.getGeometry().getCoordinates());
    } else if (feature.get('Type') === 'Cercle') {
        this.map_.getView().fit(
                feature.getGeometry(),
                [400, 400],
                {padding: [0, 0, 0, 0]}
        );
        this.map_.getView().setCenter(feature.getGeometry().getCenter());
    } else {
        this.map_.getView().fit(
                feature.getGeometry(),
                [800, 800],
                {padding: [0, 0, 0, 0]}
        );
    }
};

/**
 * show/hide anotations
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.showHideAnotations = function () {
    oVmap.log("nsVmap.nsToolsManager.Measure.prototype.measureController.showHideAnotations");

    if (document.getElementById('measure-anotations').checked)
        $('.measure-tooltip-static').show();
    else
        $('.measure-tooltip-static').hide();
};

/**
 * Start draw point interaction
 * @param {boolean} isActive true if the action is already active
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.drawPoint = function (isActive) {
    oVmap.log("nsVmap.nsToolsManager.Measure.prototype.measureController.drawPoint");

    this.removeMeasuresInteractions();

    if (!isActive) {
        oVmap.getMap().getMapTooltip().displayMessage('Cliquer pour mesurer l\'emplacement d\'un point');
        this.addInteraction('Point');
    }
};

/**
 * Start measure line interaction
 * @param {boolean} isActive true if the action is already active
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.measureLine = function (isActive) {
    oVmap.log("nsVmap.nsToolsManager.Measure.prototype.measureController.measureLine");

    this.removeMeasuresInteractions();

    if (!isActive) {
        oVmap.getMap().getMapTooltip().displayMessage('Cliquer pour commencer à mesurer');
        this.addInteraction('LineString');
    }
};

/**
 * Start measure polygon interaction
 * @param {boolean} isActive true if the action is already active
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.measurePolygon = function (isActive) {
    oVmap.log("nsVmap.nsToolsManager.Measure.prototype.measureController.measurePolygon");

    this.removeMeasuresInteractions();

    if (!isActive) {
        oVmap.getMap().getMapTooltip().displayMessage('Cliquer pour commencer à mesurer');
        this.addInteraction('Polygon');
    }
};

/**
 * Start measure circle interaction
 * @param {boolean} isActive true if the action is already active
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.measureCircle = function (isActive) {
    oVmap.log("nsVmap.nsToolsManager.Measure.prototype.measureController.measureCircle");

    this.removeMeasuresInteractions();

    if (!isActive) {
        oVmap.getMap().getMapTooltip().displayMessage('Cliquer pour commencer à mesurer');
        this.addInteraction('Circle');
    }
};

/**
 * modify the selected measure feature
 * @param {boolean} isActive true if the action is already active
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.modifyFeature = function (isActive) {
    oVmap.log("nsVmap.nsToolsManager.Measure.prototype.measureController.modifyFeature");

    this.removeMeasuresInteractions();

    if (!isActive) {
        oVmap.getMap().getMapTooltip().displayMessage('Cliquer sur une mesure pour la modifier');
        oVmap.getMap().setInteraction(this.modify_, 'basicTools-modifyMeasure');
    }
};

/**
 * remove the selected measure feature
 * @param {boolean} isActive true if the action is already active
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.deleteFeature = function (isActive) {
    oVmap.log("nsVmap.nsToolsManager.Measure.prototype.measureController.deleteFeature");

    this.removeMeasuresInteractions();

    if (!isActive) {
//        oVmap.getMap().setInteraction(this.selectHover_, 'basicTools-deleteMeasure');
//        oVmap.getMap().addInteraction(this.delete_, 'basicTools-deleteMeasure');
//        oVmap.getMap().getMapTooltip().displayMessage('Cliquer sur une mesure pour la supprimer');

        oVmap.getMap().setInteraction(this.delete_, 'basicTools-deleteMeasure');
        oVmap.getMap().getMapTooltip().displayMessage('Cliquer sur une mesure pour la supprimer');
    }
};

/**
 * remove all the measure features
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.deleteAllFeatures = function () {
    oVmap.log("nsVmap.nsToolsManager.Measure.prototype.measureController.deleteAllFeatures");
    // remove the draw/measure tool
    this.removeMeasuresInteractions();
    // remove the features
    this.oOpenLayersMeasureOverlayFeatures_.clear();
    // remove the overlays measures
    var aOverlays = oVmap.getMap().getOLMap().getOverlays().getArray();
    var aMeasureOverlays = [];
    for (var i = aOverlays.length - 1; i >= 0; i--) {
        if (aOverlays[i].get('type') === 'measure')
            aMeasureOverlays.push(aOverlays[i]);
    }
    for (var i = aMeasureOverlays.length - 1; i >= 0; i--) {
        oVmap.getMap().getOLMap().getOverlays().remove(aMeasureOverlays[i]);
    }
};

/**
 * remove all the measure interactions
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.removeMeasuresInteractions = function () {
    oVmap.log("nsVmap.nsToolsManager.Measure.prototype.measureController.removeMeasuresInteractions");

    if (this.measureTooltipElement_) {
        this.measureTooltipElement_.className = 'measure-tooltip measure-tooltip-static';
        this.measureTooltipElement_.remove();
        this.measureTooltip_.setOffset([0, -7]);
        // unset this.sketch_
        this.sketch_ = null;
        // unset measure-tooltip so that a new one can be created
        this.measureTooltipElement_ = null;
    }

    // Cache la tooltip
    oVmap.getMap().getMapTooltip().hide();
    // Désactive les interactions
    oVmap.getMap().removeActionsOnMap();
};

/**
 * display the sketches in a list
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.displayFeatures = function () {
    oVmap.log("nsVmap.nsToolsManager.Measure.prototype.measureController.displayFeatures");
    this['sketches'] = this.oOpenLayersMeasureOverlayFeatures_.getArray();
    var allCSV = "";
    var jsonObject = "";
    var csv = "";

    // Points correspondants
    for (var i = 0; i < this['sketches'].length; i++) {
        this['sketches'][i]['Points'] = this.getPointsInfos(this['sketches'][i]);
        var featureKeys = this['sketches'][i].getKeys();
        var featureInfos = {};

        for (var ii = 0; ii < featureKeys.length; ii++) {
            if (featureKeys[ii] !== 'geometry' && featureKeys[ii] !== 'Keys')
                featureInfos[featureKeys[ii]] = this['sketches'][i].get(featureKeys[ii]);
        }

        featureInfos = [featureInfos];

        jsonObject = JSON.stringify(featureInfos);
        csv = oVmap.JSON2CSV(jsonObject, true, true);
        allCSV += csv + '\n';

        jsonObject = JSON.stringify(this['sketches'][i]['Points']);
        csv = oVmap.JSON2CSV(jsonObject, true, true);
        allCSV += csv + '\n\n';
    }

    var href = "data:text/csv;charset=utf-8," + encodeURIComponent(allCSV);
    $("#export-csv-button").attr('href', href);
};

/**
 * Get all the points informations
 * @param {ol.Feature} olFeature OpenLayers Feature
 * @return {array} Points informations
 */
nsVmap.nsToolsManager.Measure.prototype.measureController.prototype.getPointsInfos = function (olFeature) {

    var aPoints = [];

    if (olFeature.get('Type') === 'Ligne' || olFeature.get('Type') === 'Polygone') {
        aPoints = [];

        // keys
        aPoints['keys'] = ['Points', 'Coordonnées', 'Longueur-segment', 'Longueur-totale', 'Delta-x', 'Delta-y', 'Angle/Nord'];

        if (olFeature.get('Type') === 'Polygone')
            var coordinates = olFeature.getGeometry().getCoordinates()[0];
        else
            var coordinates = olFeature.getGeometry().getCoordinates();

        var vectorDistance = 0;
        var totalDistance = 0;
        var vectorXDistance = 0;
        var vectorYDistance = 0;
        var angleValue = 0;
        var totalCoordinates = [];
        var lineString = {};

        for (var ii = 0; ii < coordinates.length; ii++) {
            aPoints[ii] = {};
            aPoints[ii]['Points'] = ii + 1;
            aPoints[ii]['Coordonnées'] = coordinates[ii];
            totalCoordinates.push(coordinates[ii]);
            if (ii !== 0) {

                // vector distance
                lineString = new ol.geom.LineString(
                        [coordinates[ii - 1], coordinates[ii]],
                        olFeature.getGeometry().getLayout()
                        );
                vectorDistance = this.formatLength(lineString);

                // total distance
                lineString = new ol.geom.LineString(
                        totalCoordinates,
                        olFeature.getGeometry().getLayout()
                        );
                totalDistance = this.formatLength(lineString);

                // delta x
                lineString = new ol.geom.LineString(
                        [[coordinates[ii - 1][0], 0], [coordinates[ii][0], 0]],
                        olFeature.getGeometry().getLayout()
                        );
                vectorXDistance = this.formatLength(lineString);
                if (coordinates[ii][0] < coordinates[ii - 1][0])
                    vectorXDistance = "-" + vectorXDistance;

                // delta y
                lineString = new ol.geom.LineString(
                        [[0, coordinates[ii - 1][1]], [0, coordinates[ii][1]]],
                        olFeature.getGeometry().getLayout()
                        );
                vectorYDistance = this.formatLength(lineString);
                if (coordinates[ii][1] < coordinates[ii - 1][1])
                    vectorYDistance = "-" + vectorYDistance;

                // Angle/nord
                var x1 = coordinates[ii - 1][0];
                var x2 = coordinates[ii][0];
                var y1 = coordinates[ii - 1][1];
                var y2 = coordinates[ii][1];
                angleValue = (Math.atan2((y2 - y1), (x2 - x1))) * (180 / Math.PI);
                angleValue = 90 - angleValue;
                angleValue < 0 ? (angleValue = 360 - angleValue * (-1)) : angleValue = angleValue;
                angleValue = angleValue.toFixed(2) + "°";

            }

            aPoints[ii]['Longueur-segment'] = vectorDistance;
            aPoints[ii]['Longueur-totale'] = totalDistance;
            aPoints[ii]['Delta-x'] = vectorXDistance;
            aPoints[ii]['Delta-y'] = vectorYDistance;
            aPoints[ii]['Angle/Nord'] = angleValue;
        }
        ;
    }

    return aPoints;
};
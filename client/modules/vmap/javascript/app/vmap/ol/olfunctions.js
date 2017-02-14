

/* global ol, goog, oVmap */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant les fonctions 
 * que vMap rajoute à la librairie OpenLayers
 */

goog.provide('nsVmap.olFunctions');
goog.require('ol.source.Vector');
goog.require('ol.Map');
goog.require('ol.layer.Layer');
goog.require('ol.source.Source');
goog.require('ol.geom.SimpleGeometry');

/**
 * Transform all the features from the layer
 * @param {ol.proj.ProjectionLike} oldProjection
 * @param {ol.proj.ProjectionLike} newProjection
 * @returns {undefined}
 */
ol.source.Vector.prototype.transformFeatures = function (oldProjection, newProjection) {

    var features = this.getFeatures();
    var aReprojectedGeoms = [];

    for (var i = 0; i < features.length; i++) {
        features[i].setGeometry(features[i].getGeometry().transform(oldProjection, newProjection));
    }
};

/**
 * Refresh the sources (only for ImageWMS and TileWMS)
 * @param {boolean} keepLoadedTiles true if you don't want to clear currently rendered tiles before loading and rendering new tiles
 * @export
 */
ol.Map.prototype.refreshWithTimestamp = function (keepLoadedTiles) {
    oVmap.log('Map.refreshWithTimestamp', this);

    this.getLayers().forEach(function (layer) {
        layer.getSource().refreshWithTimestamp(keepLoadedTiles);
    });
};

/**
 * Refresh the source (only for ImageWMS and TileWMS)
 * @param {boolean} keepLoadedTiles true if you don't want to clear currently rendered tiles before loading and rendering new tiles
 * @export
 */
ol.layer.Layer.prototype.refreshWithTimestamp = function (keepLoadedTiles) {
    oVmap.log('layer.refreshWithTimestamp', this);
    this.getSource().refreshWithTimestamp(keepLoadedTiles);
};

/**
 * Refresh the source (only for ImageWMS and TileWMS)
 * @param {boolean} keepLoadedTiles true if you don't want to clear currently rendered tiles before loading and rendering new tiles
 * @export
 */
ol.source.Source.prototype.refreshWithTimestamp = function (keepLoadedTiles) {
    oVmap.log('source.refreshWithTimestamp', this);

    // Methode avec updateParams
    if (
            this instanceof ol.source.ImageWMS ||
            this instanceof ol.source.TileWMS
            ) {
        var params = this.getParams();
        params['TIMESTAMP'] = Date.now();
        this.updateParams(params);

        if (keepLoadedTiles !== true) {
            this.refresh();
        }
    }
};

/**
 * Get if the feature contains all the points from the passed polygon geometry
 * @param {ol.geom.Polygon} polygon
 * @returns {Boolean}
 */
ol.geom.SimpleGeometry.prototype.containsPolygon = function (polygon) {
    var polygonCoordinates = polygon.getCoordinates()[0];
    for (var i = 0; i < polygonCoordinates.length; i++) {
        if (!this.containsXY(polygonCoordinates[i][0], polygonCoordinates[i][1])) {
            return false;
        }
    }
    return true;
};
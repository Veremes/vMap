/* global ol, goog, oVmap, vitisApp */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant les fonctions 
 * que Veremes rajoute à la librairie OpenLayers
 */

goog.provide('ol.veremes');
goog.require('ol.source.Vector');
goog.require('ol.Map');
goog.require('ol.layer.Layer');
goog.require('ol.source.Source');
goog.require('ol.geom.SimpleGeometry');
goog.require('ol.Feature');

// ol3-ext
goog.require('ol.ordering');
goog.require('ol.style.Shadow');
goog.require('ol.style.FontSymbol');
goog.require('ol.style.FontSymbol.FontAwesome');

var $log = null;
var log = function (sMessage) {
    if (!goog.isDefAndNotNull($log)) {
        try {
            $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        } catch (e) {
            $log = null;
        }
    }
    if (goog.isDefAndNotNull($log)) {
        $log.info(sMessage);
    }
};

/**
 * Transform all the features from the layer
 * @param {ol.proj.ProjectionLike} oldProjection
 * @param {ol.proj.ProjectionLike} newProjection
 * @returns {undefined}
 */
ol.source.Vector.prototype.transformFeatures = function (oldProjection, newProjection) {
    log('ol.source.Vector.prototype.transformFeatures');

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
    log('ol.Map.prototype.refreshWithTimestamp');

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
    log('ol.layer.Layer.prototype.refreshWithTimestamp ');
    this.getSource().refreshWithTimestamp(keepLoadedTiles);
};

/**
 * Refresh the source (only for ImageWMS and TileWMS)
 * @param {boolean} keepLoadedTiles true if you don't want to clear currently rendered tiles before loading and rendering new tiles
 * @export
 */
ol.source.Source.prototype.refreshWithTimestamp = function (keepLoadedTiles) {
    log('ol.source.Source.prototype.refreshWithTimestamp');

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
    log('ol.geom.SimpleGeometry.prototype.containsPolygon');

    var polygonCoordinates = polygon.getCoordinates()[0];
    for (var i = 0; i < polygonCoordinates.length; i++) {
        if (!this.containsXY(polygonCoordinates[i][0], polygonCoordinates[i][1])) {
            return false;
        }
    }
    return true;
};

/**
 * Get the feature JSON style definition
 * @returns {object} JSON style definition
 * @export
 */
ol.Feature.prototype.getStyleAsJSON = function () {
    log('ol.Feature.prototype.getStyleAsJSON');

    switch (this.getGeometry().getType()) {
        case 'Point':
        case 'MultiPoint':
            return this.getPointJSONStyle_(this.style_);
            break;
        case 'LineString':
        case 'MultiLineString':
            return this.getLineJSONStyle_(this.style_);
            break;
        case 'Polygon':
        case 'MultiPolygon':
            return this.getPolygonJSONStyle_(this.style_);
            break;
        default:
            console.error("undefined type: ", this.getGeometry().getType());
            break;
    }
};

/**
 * Get the point JSON style definition
 * @param {ol.style.Style} olStyle
 * @returns {object} JSON style definition
 */
ol.Feature.prototype.getPointJSONStyle_ = function (olStyle) {

    var oStyle = {
        'draw': {
            'color': 'rgba(54,184,255,0.6)',
            'outline_color': 'rgba(0,0,0,0.4)',
            'size': 7
        },
        'text': null
    };

    if (goog.isDefAndNotNull(olStyle)) {
        if (goog.isDefAndNotNull(olStyle.getImage())) {
            if (goog.isDefAndNotNull(olStyle.getImage().getGlyph)) {
                if (goog.isDefAndNotNull(olStyle.getImage().getGlyph())) {
                    if (goog.isDefAndNotNull(olStyle.getImage().getGlyph().name)) {
                        oStyle['draw']['symbol'] = olStyle.getImage().getGlyph().name;
                    }
                }
            }
            if (goog.isDefAndNotNull(olStyle.getImage().radius2_)) {
                oStyle['draw']['size'] = olStyle.getImage().radius2_;
            }
            if (goog.isDefAndNotNull(olStyle.getImage().getFill)) {
                if (goog.isDefAndNotNull(olStyle.getImage().getFill())) {
                    oStyle['draw']['color'] = olStyle.getImage().getFill().color_;
                }
            }
            if (goog.isDefAndNotNull(olStyle.getImage().getStroke)) {
                if (goog.isDefAndNotNull(olStyle.getImage().getStroke())) {
                    oStyle['draw']['outline_color'] = olStyle.getImage().getStroke().color_;
                }
            }
            if (goog.isDefAndNotNull(olStyle.getImage().getSrc)) {
                if (goog.isDefAndNotNull(olStyle.getImage().getSrc())) {
                    oStyle['draw']['image'] = olStyle.getImage().getSrc();
                }
            }
        }
        oStyle['text'] = this.getTextJSONStyle_(olStyle);
    }

    return oStyle;
};

/**
 * Get the line JSON style definition
 * @param {ol.style.Style} olStyle
 * @returns {object} JSON style definition
 */
ol.Feature.prototype.getLineJSONStyle_ = function (olStyle) {

    var oStyle = {
        'draw': {
            'color': 'rgba(54,184,255,0.6)',
            'outline_color': 'rgba(0,0,0,0.4)',
            'size': 7
        },
        'text': null
    };

    if (goog.isDefAndNotNull(olStyle)) {
        if (goog.isDefAndNotNull(olStyle.getFill())) {
            if (goog.isDefAndNotNull(olStyle.getFill().getColor())) {
                oStyle['draw']['color'] = olStyle.getFill().getColor();
            }
        }
        if (goog.isDefAndNotNull(olStyle.getStroke())) {
            if (goog.isArray(olStyle.getStroke().getLineDash())) {
                oStyle['draw']['dash'] = olStyle.getStroke().getLineDash()[0];
            }
            if (goog.isDefAndNotNull(olStyle.getStroke().getWidth())) {
                oStyle['draw']['size'] = olStyle.getStroke().getWidth();
            }
        }
        oStyle['text'] = this.getTextJSONStyle_(olStyle);
    }
    return oStyle;
};

/**
 * Get the polygon JSON style definition
 * @param {ol.style.Style} olStyle
 * @returns {object} JSON style definition
 */
ol.Feature.prototype.getPolygonJSONStyle_ = function (olStyle) {

    var oStyle = {
        'draw': {
            'color': 'rgba(54,184,255,0.6)',
            'outline_color': 'rgba(0,0,0,0.4)',
            'size': 7
        },
        'text': null
    };

    if (goog.isDefAndNotNull(olStyle)) {
        if (goog.isDefAndNotNull(olStyle.getFill())) {
            if (goog.isDefAndNotNull(olStyle.getFill().getColor())) {
                oStyle['draw']['color'] = olStyle.getFill().getColor();
            }
        }
        if (goog.isDefAndNotNull(olStyle.getStroke())) {
            if (goog.isDefAndNotNull(olStyle.getStroke().getColor())) {
                oStyle['draw']['outline_color'] = olStyle.getStroke().getColor();
            }
            if (goog.isDefAndNotNull(olStyle.getStroke().getWidth())) {
                oStyle['draw']['size'] = olStyle.getStroke().getWidth();
            }
        }
        oStyle['text'] = this.getTextJSONStyle_(olStyle);
    }
    return oStyle;
};

/**
 * Get the text JSON style definition
 * @param {ol.style.Style} olStyle
 * @returns {object} JSON style definition
 */
ol.Feature.prototype.getTextJSONStyle_ = function (olStyle) {

    var oText = null;
    if (goog.isDefAndNotNull(olStyle.getText())) {
        oText = {};
        if (goog.isDefAndNotNull(olStyle.getText().getFont())) {
            var sFontWithPx = olStyle.getText().getFont();
            var aFontWithPx = sFontWithPx.split(' ');
            var sFontSize = 14;
            var sFontName = 'Arial';
            if (goog.isString(aFontWithPx[0])) {
                if (aFontWithPx[0].indexOf('px') !== -1) {
                    sFontSize = parseInt(angular.copy(aFontWithPx[0]));
                    aFontWithPx.shift();
                }
            }
            sFontName = aFontWithPx.join(' ');
            oText['font'] = sFontName;
            oText['size'] = sFontSize;
        }
        if (goog.isDefAndNotNull(olStyle.getText().getFill())) {
            if (goog.isDefAndNotNull(olStyle.getText().getFill().getColor())) {
                oText['color'] = olStyle.getText().getFill().getColor();
            }
        }
        if (goog.isDefAndNotNull(olStyle.getText().getOffsetX())) {
            oText['offsetX'] = olStyle.getText().getOffsetX();
        }
        if (goog.isDefAndNotNull(olStyle.getText().getOffsetY())) {
            oText['offsetY'] = (-1) * parseFloat(olStyle.getText().getOffsetY());
        }
        if (goog.isDefAndNotNull(olStyle.getText().getStroke())) {
            if (goog.isDefAndNotNull(olStyle.getText().getStroke().getColor())) {
                oText['outline_color'] = olStyle.getText().getStroke().getColor();
            }
            if (goog.isDefAndNotNull(olStyle.getText().getStroke().getWidth())) {
                oText['outline_size'] = olStyle.getText().getStroke().getWidth();
            }
        }
        if (goog.isDefAndNotNull(olStyle.getText().getRotation())) {
            oText['rotation'] = parseFloat(olStyle.getText().getRotation()) * 180 / Math.PI;
        }
        if (goog.isDefAndNotNull(olStyle.getText().getText())) {
            oText['text'] = olStyle.getText().getText();
        }
    }
    return oText;
};

/**
 * Set the feature style by a JSON style definition
 * @param {object|string} oJSON JSON style definition
 * @param {object|string} oJSON.draw
 * @param {object|string} oJSON.draw.symbol
 * @param {object|string} oJSON.draw.color
 * @param {object|string} oJSON.draw.outline_color
 * @param {object|string} oJSON.draw.size
 * @param {object|string} oJSON.draw.dash
 * @param {object|string} oJSON.text
 * @param {object|string} oJSON.text.text
 * @param {object|string} oJSON.text.size
 * @param {object|string} oJSON.text.font
 * @param {object|string} oJSON.text.color
 * @param {object|string} oJSON.text.outline_color
 * @param {object|string} oJSON.text.outline_size
 * @param {object|string} oJSON.text.offsetX
 * @param {object|string} oJSON.text.offsetY
 * @param {object|string} oJSON.text.rotation
 * @export
 */
ol.Feature.prototype.setStyleByJSON = function (oJSON) {
    log('ol.Feature.prototype.setStyleByJSON');

    if (!goog.isDefAndNotNull(oJSON)) {
        console.error('oJSON not provided');
        return false;
    }
    if (goog.isString(oJSON)) {
        oJSON = JSON.parse(oJSON);
    }
    if (!goog.isObject(oJSON)) {
        console.error('oJSON is neither JSON string nor object');
        return false;
    }

    switch (this.getGeometry().getType()) {
        case 'Point':
        case 'MultiPoint':
            this.setStyle(this.getPointStyleByJSON_(oJSON));
            break;
        case 'LineString':
        case 'MultiLineString':
            this.setStyle(this.getLineStyleByJSON_(oJSON));
            break;
        case 'Polygon':
        case 'MultiPolygon':
            this.setStyle(this.getPolygonStyleByJSON_(oJSON));
            break;
        default:
            console.error("undefined type: ", this.getGeometry().getType());
            break;
    }
};

/**
 * Get the point style by the JSON definition
 * @param {object} oJSON JSON style definition
 * @returns {ol.style.Style}
 */
ol.Feature.prototype.getPointStyleByJSON_ = function (oJSON) {

    // Varleurs par défaut
    oJSON['draw'] = goog.isDefAndNotNull(oJSON['draw']) ? oJSON['draw'] : {};
    oJSON['draw']['color'] = goog.isDefAndNotNull(oJSON['draw']['color']) ? oJSON['draw']['color'] : 'rgba(54,184,255,0.6)';
    oJSON['draw']['outline_color'] = goog.isDefAndNotNull(oJSON['draw']['outline_color']) ? oJSON['draw']['outline_color'] : 'rgba(0,0,0,0.4)';
    oJSON['draw']['size'] = goog.isDefAndNotNull(oJSON['draw']['size']) ? oJSON['draw']['size'] : 7;

    var style = new ol.style.Style({
        stroke: new ol.style.Stroke({
            width: oJSON['draw']['size'],
            color: oJSON['draw']['color']
        }),
        fill: new ol.style.Fill({
            color: oJSON['draw']['outline_color']
        })
    });

    // Symbologie
    if (goog.isDefAndNotNull(oJSON['draw']['symbol'])) {
        // Symbole SVG
        style.setImage(new ol.style.FontSymbol({
            form: 'none', // forme du conteneur (none, circle, poi, bubble, marker, coma, shield, blazon, bookmark, hexagon, diamond, triangle, sign, ban, lozenge, square)
            gradient: false, // dégradé (true/false)
            glyph: oJSON['draw']['symbol'], // symbole à utiliser
            fontSize: 0.6,
            radius: oJSON['draw']['size'],
            //offsetX: -15,
            rotation: 0,
            rotateWithView: false, // true pour que l'icone bouge qand on rotate la carte
            offsetY: 0, // Pour mettre un offset il faut utiliser -radius
            color: '', // couleur du symbole ou vide pour utiliser la couleur du contour
            fill: new ol.style.Fill({
                color: oJSON['draw']['color'] // couleur du conteneur
            }),
            stroke: new ol.style.Stroke({
                color: oJSON['draw']['outline_color'], // couleur du contour
                width: 2 // taille du contour
            })
        }));
    } else if (goog.isDefAndNotNull(oJSON['draw']['image'])) {
        // Image
        style.setImage(new ol.style.Icon({
            src: oJSON['draw']['image']
        }));
    } else {
        // Cercle
        style.setImage(new ol.style.Circle({
            radius: oJSON['draw']['size'],
            fill: new ol.style.Fill({
                color: oJSON['draw']['color']
            }),
            stroke: new ol.style.Stroke({
                color: oJSON['draw']['outline_color'],
                width: 2
            })
        }));
    }

    // Texte
    if (goog.isDefAndNotNull(oJSON['text'])) {

        // Varleurs par défaut
        oJSON['text']['size'] = goog.isDefAndNotNull(oJSON['text']['size']) ? oJSON['text']['size'] : 14;
        oJSON['text']['font'] = goog.isDefAndNotNull(oJSON['text']['font']) ? oJSON['text']['font'] : 'Arial';
        oJSON['text']['color'] = goog.isDefAndNotNull(oJSON['text']['color']) ? oJSON['text']['color'] : 'black';
        oJSON['text']['outline_color'] = goog.isDefAndNotNull(oJSON['text']['outline_color']) ? oJSON['text']['outline_color'] : 'white';
        oJSON['text']['outline_size'] = goog.isDefAndNotNull(oJSON['text']['outline_size']) ? oJSON['text']['outline_size'] : 1;
        oJSON['text']['offsetX'] = goog.isDefAndNotNull(oJSON['text']['offsetX']) ? oJSON['text']['offsetX'] : 0;
        oJSON['text']['offsetY'] = goog.isDefAndNotNull(oJSON['text']['offsetY']) ? oJSON['text']['offsetY'] : 0;
        oJSON['text']['rotation'] = goog.isDefAndNotNull(oJSON['text']['rotation']) ? oJSON['text']['rotation'] : 0;

        style.setText(new ol.style.Text({
            font: oJSON['text']['size'] + 'px ' + oJSON['text']['font'],
            text: oJSON['text']['text'],
            fill: new ol.style.Fill({color: oJSON['text']['color']}),
            stroke: new ol.style.Stroke({color: oJSON['text']['outline_color'], width: oJSON['text']['outline_size']}),
            offsetX: oJSON['text']['offsetX'],
            offsetY: (-1) * parseFloat(oJSON['text']['offsetY']),
            rotation: parseFloat(oJSON['text']['rotation']) * Math.PI / 180
        }));
    }

    return style;
};

/**
 * Get the line style by the JSON definition
 * @param {object} oJSON JSON style definition
 * @returns {ol.style.Style}
 */
ol.Feature.prototype.getLineStyleByJSON_ = function (oJSON) {

    // Varleurs par défaut
    oJSON['draw'] = goog.isDefAndNotNull(oJSON['draw']) ? oJSON['draw'] : {};
    oJSON['draw']['color'] = goog.isDefAndNotNull(oJSON['draw']['color']) ? oJSON['draw']['color'] : 'rgba(54,184,255,0.6)';
    oJSON['draw']['size'] = goog.isDefAndNotNull(oJSON['draw']['size']) ? oJSON['draw']['size'] : 2;
    oJSON['draw']['dash'] = goog.isDefAndNotNull(oJSON['draw']['dash']) ? oJSON['draw']['dash'] : 0;

    // Dessin
    var style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: oJSON['draw']['color']
        }),
        stroke: new ol.style.Stroke({
            color: oJSON['draw']['color'],
            width: oJSON['draw']['size'],
            lineDash: [oJSON['draw']['dash']]
        })
    });

    // Texte
    if (goog.isDefAndNotNull(oJSON['text'])) {

        // Varleurs par défaut
        oJSON['text']['size'] = goog.isDefAndNotNull(oJSON['text']['size']) ? oJSON['text']['size'] : 14;
        oJSON['text']['font'] = goog.isDefAndNotNull(oJSON['text']['font']) ? oJSON['text']['font'] : 'Arial';
        oJSON['text']['color'] = goog.isDefAndNotNull(oJSON['text']['color']) ? oJSON['text']['color'] : 'black';
        oJSON['text']['outline_color'] = goog.isDefAndNotNull(oJSON['text']['outline_color']) ? oJSON['text']['outline_color'] : 'white';
        oJSON['text']['outline_size'] = goog.isDefAndNotNull(oJSON['text']['outline_size']) ? oJSON['text']['outline_size'] : 1;
        oJSON['text']['offsetX'] = goog.isDefAndNotNull(oJSON['text']['offsetX']) ? oJSON['text']['offsetX'] : 0;
        oJSON['text']['offsetY'] = goog.isDefAndNotNull(oJSON['text']['offsetY']) ? oJSON['text']['offsetY'] : 0;
        oJSON['text']['rotation'] = goog.isDefAndNotNull(oJSON['text']['rotation']) ? oJSON['text']['rotation'] : 0;

        style.setText(new ol.style.Text({
            font: oJSON['text']['size'] + 'px ' + oJSON['text']['font'],
            text: oJSON['text']['text'],
            fill: new ol.style.Fill({color: oJSON['text']['color']}),
            stroke: new ol.style.Stroke({color: oJSON['text']['outline_color'], width: oJSON['text']['outline_size']}),
            offsetX: oJSON['text']['offsetX'],
            offsetY: (-1) * parseFloat(oJSON['text']['offsetY']),
            rotation: parseFloat(oJSON['text']['rotation']) * Math.PI / 180
        }));
    }

    return style;
};

/**
 * Get the polygon style by the JSON definition
 * @param {object} oJSON JSON style definition
 * @returns {ol.style.Style}
 */
ol.Feature.prototype.getPolygonStyleByJSON_ = function (oJSON) {

    // Varleurs par défaut
    oJSON['draw'] = goog.isDefAndNotNull(oJSON['draw']) ? oJSON['draw'] : {};
    oJSON['draw']['color'] = goog.isDefAndNotNull(oJSON['draw']['color']) ? oJSON['draw']['color'] : 'rgba(54,184,255,0.6)';
    oJSON['draw']['outline_color'] = goog.isDefAndNotNull(oJSON['draw']['outline_color']) ? oJSON['draw']['outline_color'] : 'rgba(0,0,0,0.4)';
    oJSON['draw']['size'] = goog.isDefAndNotNull(oJSON['draw']['size']) ? oJSON['draw']['size'] : 2;

    // Dessin
    var style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: oJSON['draw']['color']
        }),
        stroke: new ol.style.Stroke({
            color: oJSON['draw']['outline_color'],
            width: oJSON['draw']['size']
        })
    });

    // Texte
    if (goog.isDefAndNotNull(oJSON['text'])) {

        // Varleurs par défaut
        oJSON['text']['size'] = goog.isDefAndNotNull(oJSON['text']['size']) ? oJSON['text']['size'] : 14;
        oJSON['text']['font'] = goog.isDefAndNotNull(oJSON['text']['font']) ? oJSON['text']['font'] : 'Arial';
        oJSON['text']['color'] = goog.isDefAndNotNull(oJSON['text']['color']) ? oJSON['text']['color'] : 'black';
        oJSON['text']['outline_color'] = goog.isDefAndNotNull(oJSON['text']['outline_color']) ? oJSON['text']['outline_color'] : 'white';
        oJSON['text']['outline_size'] = goog.isDefAndNotNull(oJSON['text']['outline_size']) ? oJSON['text']['outline_size'] : 1;
        oJSON['text']['offsetX'] = goog.isDefAndNotNull(oJSON['text']['offsetX']) ? oJSON['text']['offsetX'] : 0;
        oJSON['text']['offsetY'] = goog.isDefAndNotNull(oJSON['text']['offsetY']) ? oJSON['text']['offsetY'] : 0;
        oJSON['text']['rotation'] = goog.isDefAndNotNull(oJSON['text']['rotation']) ? oJSON['text']['rotation'] : 0;

        style.setText(new ol.style.Text({
            font: oJSON['text']['size'] + 'px ' + oJSON['text']['font'],
            text: oJSON['text']['text'],
            fill: new ol.style.Fill({color: oJSON['text']['color']}),
            stroke: new ol.style.Stroke({color: oJSON['text']['outline_color'], width: oJSON['text']['outline_size']}),
            offsetX: oJSON['text']['offsetX'],
            offsetY: (-1) * parseFloat(oJSON['text']['offsetY']),
            rotation: parseFloat(oJSON['text']['rotation']) * Math.PI / 180
        }));
    }

    return style;
};
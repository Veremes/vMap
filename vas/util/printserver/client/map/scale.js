/* global ol */

/**
 * Class scale
 * Usefull tools to manipulate scales
 * @param {ol.Map} olMap
 * @returns {Scale}
 */
Scale = function (olMap, sResolutionCoeff) {

    this.map = olMap;
    
    this.resolutionCoeff = sResolutionCoeff;
};

/**
 * Get the current scale
 * @param {object} opt_options
 * @returns {Number|String}
 * @export
 */
Scale.prototype.getScale = function (opt_options) {

    opt_options = isDef(opt_options) ? opt_options : {};

    var map = this.map;
    var wgs84Sphere_ = new ol.Sphere(6378137);
    var projection = map.getView().getProjection();


    // récupère les coordonnées d'une ligue de 1cm (avec le zoom en cours)
    var line = map.getView().calculateExtent([37.795275591, 0]);
    var c1 = ol.proj.transform([line[0], line[1]], projection, 'EPSG:4326');
    var c2 = ol.proj.transform([line[2], line[3]], projection, 'EPSG:4326');

    // Récuère la longueur sur la carte de la ligne de 1cm
    var length = wgs84Sphere_.haversineDistance(c1, c2);

    // donc 1m sur la carte correspond à (length mètres dans la réalité x 100)
    var scale = length * 100 * this.resolutionCoeff;

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
Scale.prototype.getPrettyScale = function (scale) {

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
Scale.prototype.setScale = function (scale) {

    // calcule et va à l'échelle celon une règle de 3
    var currentScale = this.getScale();
    var currentResolution = this.map.getView().getResolution();

    var scaleResolution = scale * currentResolution / currentScale;
    this.map.getView().setResolution(scaleResolution);

    // Ajuste l'échelle en augementant la résolution
    currentScale = this.getScale();

};
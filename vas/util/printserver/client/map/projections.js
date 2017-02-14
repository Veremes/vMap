/* global ol */

/**
 * Class Projections
 * this class allows to use other projections than 3857 or 4326
 */
Projections = function () {
    
    // Ajoute les systemes de proj externes à OL3
    this.addCustomProjections();
};

/**
 * Add projections
 */
Projections.prototype.addCustomProjections = function () {

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
Projections.prototype.WGSToLambert = function (coordinates) {

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
Projections.prototype.lambertToWGS = function (coordinates) {

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
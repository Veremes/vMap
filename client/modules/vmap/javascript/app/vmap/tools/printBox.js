/* global nsVmap, oVmap, goog, ol, angular */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.PrintBox
 * cette classe permet l'apparition d'une zone d'impression sur la carte
 */
goog.provide('nsVmap.nsToolsManager.PrintBox');
goog.require('ol.interaction.Translate');

/**
 * @classdesc
 * Class {@link nsVmap.nsToolsManager.PrintBox}: Add the print tools defined in data/tools.json
 *
 * @constructor
 * @export
 */
nsVmap.nsToolsManager.PrintBox = function (opt_options) {
    oVmap.log('nsVmap.nsToolsManager.PrintBox');

    this.map_ = oVmap.getMap().getOLMap();

    // Valeurs par défaut
    opt_options = goog.isDefAndNotNull(opt_options) ? opt_options : {};

    /**
     * The print box feature
     * @private
     */
    this.printBoxFeature_;

    /**
     * The printBox size
     * @private
     */
    this.printBoxSize_ = opt_options['size'];

    /**
     * Event to reload the this.printBoxFeature_
     * @private
     */
    this.printBoxEvent_;

    /**
     * @type {ol.layer.Vector}
     * @private
     */
    this.oOpenLayersOverlay_ = oVmap.getMap().addVectorLayer();

    /**
     * @type {ol.Collection}
     * @private
     */
    this.oOpenLayersOverlayFeatures_ = this.oOpenLayersOverlay_.getSource().getFeaturesCollection();

    /**
     * @private
     * @type ol.interaction.Translate
     */
    this.translateInteraction_ = new ol.interaction.Translate({
        features: this.oOpenLayersOverlayFeatures_
    });

};
goog.exportProperty(nsVmap.nsToolsManager, 'Print', nsVmap.nsToolsManager.Print);

/**
 * Show the print box on map
 * @param {boolean} bListenMovements allows to follow the map movements, default is true
 * @export
 */
nsVmap.nsToolsManager.PrintBox.prototype.show = function (bListenMovements) {

    if (!goog.isDefAndNotNull(bListenMovements)) {
        bListenMovements = true;
    }

    // Crée la première printBox
    this.drawPrintBox();

    // Re-dessine une printBox à chaque mouvement de la carte si bListenMovements
    if (bListenMovements)
        this.listenMapMovements();
};

/**
 * Hide the printbox on map
 * @export
 */
nsVmap.nsToolsManager.PrintBox.prototype.hide = function () {

    // Arrête d'écouter les mouvements de la carte
    this.unlistenMapMovements();

    // Supprime la print box en cours
    this.oOpenLayersOverlayFeatures_.clear();
};

/**
 * Detach the printZone from the view and allow to translate it
 * @param {string} sInteractionName name of the interaction
 * @export
 */
nsVmap.nsToolsManager.PrintBox.prototype.managePrintBox = function (sInteractionName) {
    oVmap.log('nsVmap.nsToolsManager.PrintBox.managePrintBox');

    sInteractionName = goog.isDefAndNotNull(sInteractionName) ? sInteractionName : 'modifyPrintZone';

    // Arrete le mouvement de la printBox en même temps que la carte
    this.unlistenMapMovements();

    // Ajoute l'interaction de déplacement de la printBox
    oVmap.getMap().setInteraction(this.translateInteraction_, sInteractionName);

};

/**
 * Cancel the printZone manage interaction and adapt the view on it
 * @export
 */
nsVmap.nsToolsManager.PrintBox.prototype.unmanagePrintBox = function () {
    oVmap.log('nsVmap.nsToolsManager.PrintBox.unmanagePrintBox');

    // remove l'action de modification
    oVmap.getMap().removeActionsAndTooltips();

    this.drawPrintBox();
    this.listenMapMovements();
};

/**
 * Get the print box scale
 * @returns {Number|String}
 * @export
 */
nsVmap.nsToolsManager.PrintBox.prototype.getScale = function () {

    var this_ = this;

    // Mémorise la position initiale
    var currentResolution = this.map_.getView().getResolution();
    var currentCenter = this.map_.getView().getCenter();
    var printBox = this.getExtent();


    // Positionne la vue sur l'étendue de la printBox
    this.map_.getView().fit(this.getExtent(), this.map_.getSize(), {
        constrainResolution: false,
        nearest: true
    });

    var scale = oVmap.getMap().getScale();

    setTimeout(function () {
        // Retrouve la position initiale
        this_.map_.getView().setResolution(currentResolution);
        this_.map_.getView().setCenter(currentCenter);
    });

    return scale;
};

/**
 * Set a new scale to the printbox (warning: this only works when the printBox zone is managed)
 * @param {number} newScale
 * @export
 */
nsVmap.nsToolsManager.PrintBox.prototype.setScale = function (newScale) {
    
    // Échelle courante
    var currentScale = this.getScale();

    // Calcul du delta entre l'échelle courrante et l'échelle voulue
    var deltaScale = newScale / currentScale;
    
    // Mise sous forme de variables pour une meilleure compréhension
    var currentExtent = this.getExtent();
    var xmin = currentExtent[0];
    var ymin = currentExtent[1];
    var xmax = currentExtent[2];
    var ymax = currentExtent[3];
    var length = xmax - xmin;
    var height = ymax - ymin;

    // Calcul de la nouvelle hauteur/largeur de la printBox
    var newLength = length * deltaScale;
    var newHeight = height * deltaScale;
    
    // Calcul des nouvelles coordonnées en fonction du centre et des nouvelles hauteur/largeur
    var center = this.printBoxFeature_.getGeometry().getInteriorPoint().getCoordinates();
    var newXmin = center[0] - newLength / 2;
    var newXmax = center[0] + newLength / 2;
    var newYmin = center[1] - newHeight / 2;
    var newYmax = center[1] + newHeight / 2;

    // Dessin de la nouvelle feature
    var box = ol.geom.Polygon.fromExtent([newXmin, newYmin, newXmax, newYmax]);
    this.printBoxFeature_ = new ol.Feature({
        geometry: box
    });
    
    // Supprime l'ancienne feature
    this.oOpenLayersOverlayFeatures_.clear();
    
    // Ajoute la nouvelle feature
    this.oOpenLayersOverlay_.getSource().addFeature(this.printBoxFeature_);
};

/**
 * Get the printBox size (warning: this only works when the printBox zone is managed)
 * @export
 * @returns {array<number>}
 */
nsVmap.nsToolsManager.PrintBox.prototype.getSize = function () {
    return this.printBoxSize_;
};

/**
 * Set the printBox size
 * @param {array<number>} printBoxSize
 * @export
 */
nsVmap.nsToolsManager.PrintBox.prototype.setSize = function (printBoxSize) {
    this.printBoxSize_ = printBoxSize;
};

/**
 * Get the printBox extent
 * @export
 * @returns {array<number>}
 */
nsVmap.nsToolsManager.PrintBox.prototype.getExtent = function () {
    return this.printBoxFeature_.getGeometry().getExtent();
};

/**
 * Draw a new print box on each map precompose
 * @private
 */
nsVmap.nsToolsManager.PrintBox.prototype.listenMapMovements = function () {

    this.printBoxEvent_ = oVmap.getMap().setEventOnMap('precompose', this.drawPrintBox, this);
};

/**
 * Stop drawing print boxes on each map precompose
 * @private
 */
nsVmap.nsToolsManager.PrintBox.prototype.unlistenMapMovements = function () {

    this.map_.unByKey(this.printBoxEvent_);
};

/**
 * Draw the printBox descrived by this.printBoxFeature_
 * @returns {undefined}
 * @private
 */
nsVmap.nsToolsManager.PrintBox.prototype.drawPrintBox = function () {

    if (!goog.isDefAndNotNull(this.printBoxSize_)) {
        console.error('Print box size undefined');
        return 0;
    }
    if (!goog.isDefAndNotNull(this.printBoxSize_)) {
        console.error('Print box feature undefined');
        return 0;
    }

    // supprime la zone d'impression
    this.oOpenLayersOverlayFeatures_.clear();

    // dessine la zone d'impression
    this.printBoxFeature_ = this.createPrintBox(this.printBoxSize_);
    this.oOpenLayersOverlay_.getSource().addFeature(this.printBoxFeature_);
};

/**
 * Create a printBox feature according to this.printedMapSize
 * @param {array<number>} printBoxSize
 * @returns {ol.Feature}
 * @private
 */
nsVmap.nsToolsManager.PrintBox.prototype.createPrintBox = function (printBoxSize) {

    var boxWidth = printBoxSize[0];
    var boxHeight = printBoxSize[1];

    var x1 = $('#map1').width() / 2 - boxWidth / 2;
    var x2 = $('#map1').width() / 2 + boxWidth / 2;
    var y1 = $('#map1').height() / 2 - boxHeight / 2;
    var y2 = $('#map1').height() / 2 + boxHeight / 2;

    var point1 = [x1, y2];
    var point3 = [x2, y1];

    var coord1 = this.map_.getCoordinateFromPixel(point1);
    var coord3 = this.map_.getCoordinateFromPixel(point3);

    var box = ol.geom.Polygon.fromExtent([coord1[0], coord3[1], coord3[0], coord1[1]]);

    var boxFeature = new ol.Feature({
        geometry: box
    });

    boxFeature.set('pixelExtent', [x1, y1, x2, y2]);

    return boxFeature;
};
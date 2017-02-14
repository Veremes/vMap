/* global nsVmap, ol, oVmap, goog, angular */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.Map
 * cette classe permet l'initialisation de la carte
 */

goog.provide('nsVmap.Map.MapTooltip');
goog.require('ol.Overlay');

/**
 * @classdesc
 * Class {@link nsVmap.Map.MapTooltip}: A tooltip on the map
 *
 * @param {object} opt_options
 * @param {string} opt_options.id id of the tooltip
 * @param {string} opt_options.className class of the tooltip
 * @constructor
 * @export
 */
nsVmap.Map.MapTooltip = function (opt_options) {
    oVmap.log('nsVmap.Map.MapTooltip');
    // Param obligatiores
    if (!goog.isDef(opt_options.id))
        return 0;
    // Params
    this.id = opt_options.id;
    this.className = goog.isDef(opt_options.className) ? opt_options.className : 'map-tooltip';
    this.map = oVmap.getMap().getOLMap();
    this.helpTooltipElement_ = document.createElement('div');
    this.helpTooltipElement_.id = this.id;
    this.helpTooltipElement_.className = this.className;
    this.helpTooltipElement_.style.display = "none";
    this.helpTooltip_ = new ol.Overlay({
        element: this.helpTooltipElement_,
        offset: [15, 15],
        positioning: 'center-left'
    });
    this.map.addOverlay(this.helpTooltip_);
    this.map.on('pointermove', function (evt) {
        this.helpTooltip_.setPosition(evt.coordinate);
    }, this);
};

/**
 * Display the tooltip whith a message
 * @param {string} message to display
 * @returns {string} error
 */
nsVmap.Map.MapTooltip.prototype.displayMessage = function (message) {

    if (!goog.isDef(message))
        return 'message not defined';
    this.helpTooltipElement_.innerHTML = message;
    this.helpTooltipElement_.style.display = "block";
    this.helpTooltip_.setPosition([0, 0]);
};

/**
 * Hide the tooltip
 * @returns {string} error
 */
nsVmap.Map.MapTooltip.prototype.hide = function () {

    this.helpTooltipElement_.style.display = "none";
};
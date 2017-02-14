/* global nsVmap, ol, oVmap, goog, angular */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.Map
 * cette classe permet l'initialisation de la carte
 */

goog.provide('nsVmap.Map.MapPopup');
goog.require('ol.Overlay');

/**
 * @classdesc
 * Class {@link nsVmap.Map.MapPopup}: A tooltip on the map
 *
 * @param {ol.Feature} olFeature Feature to bind with the popup
 * @param {ol.geom.Point|undefined} olPoint point where to put the popup
 * @constructor
 * @export
 */
nsVmap.Map.MapPopup = function (olFeature, olPoint) {
    oVmap.log('nsVmap.Map.MapPopup');

    /**
     * @type nsVmap.Map.MapPopup
     * @private
     */
    var this_ = this;

    /**
     * @type ol.Feature
     * @private
     */
    this.olFeature_ = olFeature;

    /**
     * @type ol.Map
     * @private
     */
    this.map_ = oVmap.getMap().getOLMap();

    /**
     * @type ol.proj
     * @private
     */
    this.projection_ = this.map_.getView().getProjection().getCode();

    /**
     * Actions to add to the popup
     */
    this.actions = [];

    // Ajoute la feature sur la carte
    if (!goog.array.contains(oVmap.getMap().getPopupOverlaySource().getFeatures(), olFeature))
        oVmap.getMap().getPopupOverlaySource().addFeature(olFeature);

    // Création du HTML relatif
    this.HTML_ = document.createElement('div');
    this.HTML_.className = 'ol-popup';
//    this.HTML_.draggable = 'true';

    this.HTMLContainer_ = document.createElement('div');
    this.HTML_.appendChild(this.HTMLContainer_);

    this.HTMLButtonsContainer_ = document.createElement('div');
    this.HTMLButtonsContainer_.style = 'height: 7px;';
    this.HTMLContainer_.appendChild(this.HTMLButtonsContainer_);

    // Ajoute le style définit en properties
    if (goog.isDefAndNotNull(oVmap['properties']['popup'])) {
        if (goog.isDefAndNotNull(oVmap['properties']['popup']['style'])) {
            if (goog.isString(oVmap['properties']['popup']['style'])) {

                // Style définit en properties en enlevant les "\n"
                var sStyle = oVmap['properties']['popup']['style'].replace('<return>', '');
                var aStyle1 = sStyle.split(';');
                var oStyle = {};

                for (var i = 0; i < aStyle1.length; i++) {
                    var aStyle2 = aStyle1[i].split(':');
                    if (goog.isDefAndNotNull(aStyle2[0]) && goog.isDefAndNotNull(aStyle2[1])) {
                        oStyle[aStyle2[0]] = aStyle2[1];
                    }
                    delete aStyle2;
                }
                for (var key in oStyle) {
                    this.HTML_.style[key] = oStyle[key];
                }
            }
        }
    }

    // Bouton close
    this.HTMLCloser_ = document.createElement('a');
    this.HTMLCloser_.href = '#';
    this.HTMLCloser_.className = 'ol-popup-closer';
    this.HTMLButtonsContainer_.appendChild(this.HTMLCloser_);

    this.HTMLContent_ = document.createElement('div');
    this.HTMLContainer_.appendChild(this.HTMLContent_);


    /**
     * @type {ol.Overlay}
     * @private
     */
    this.popupOverlay_ = new ol.Overlay(({
        element: this.HTML_,
        autoPan: true,
        position: goog.isDefAndNotNull(olPoint) ? this.getGeometryCenter(olPoint) : this.getGeometryCenter(olFeature.getGeometry()),
        autoPanAnimation: {
            duration: 250
        }
    }));

    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    this.HTMLCloser_.onclick = function () {
        this_.remove();
        return false;
    };

    /**
     * Put the current element upon of the others
     */
    this.HTML_.onclick = function () {

        var map = oVmap.getMap().getOLMap();
        var aOverlays = map.getOverlays().getArray();

        // Met tous z-index à 10
        for (var i = 0; i < aOverlays.length; i++) {
            if ($(aOverlays[i].getElement()).hasClass('ol-popup')) {
                $(aOverlays[i].getElement()).css('z-index', 10);
            }
        }

        // Met le z-index de l'élément clické à 11
        $(this_.HTML_).css('z-index', 11);
    };

    var positionEnd = [0, 0];
    var pixelStart = [0, 0];
    var diffX = 0;
    var diffY = 0;

//    function drag_start(event) {
//        pixelStart = this_.map_.getPixelFromCoordinate(this_.popupOverlay_.getPosition());
//        var posX = event.clientX;
//        var posY = event.clientY;
//        diffX = posX - pixelStart[0];
//        diffY = posY - pixelStart[1];
//        return false;
//    }
//    function drag(event) {
//        var posX = event.clientX;
//        var posY = event.clientY;
//        if (posX === 0 || posY === 0)
//            return false;
//        positionEnd = this_.map_.getCoordinateFromPixel([posX - diffX, posY - diffY]);
//        this_.popupOverlay_.setPosition(positionEnd);
//        return false;
//    }
//    this_.HTMLContainer_.addEventListener('dragstart', drag_start, false);
//    this_.HTMLContainer_.addEventListener('drag', drag, false);

    this.map_.addOverlay(this.popupOverlay_);


    // Change de coordonnées lorsqu'on change de projection
    this.map_.on('change:view', function () {

        var oldProj = this.projection_;
        var oldCoord = this.popupOverlay_.getPosition();

        if (!goog.isDef(oldCoord))
            return 0;
        if (!goog.isDef(oldProj))
            return 0;

        var newProj = this.map_.getView().getProjection().getCode();
        var newCoord = ol.proj.transform(oldCoord, oldProj, newProj);

        this.popupOverlay_.setPosition(newCoord);
        this.projection_ = newProj;

    }, this);
};

/**
 * Display a message
 * @param {string} message
 * @returns {undefined}
 * @export
 */
nsVmap.Map.MapPopup.prototype.displayMessage = function (message) {
    oVmap.log('nsVmap.Map.MapPopup.prototype.displayMessage');
    this.removeMessages();
    this.addMessage(message);
};

/**
 * Display a table on the popup according to the object
 * @param {object} data data to display
 * @returns {Boolean}
 */
nsVmap.Map.MapPopup.prototype.displayMessageTable = function (data) {
    oVmap.log('nsVmap.Map.MapPopup.prototype.displayMessage');
    this.removeMessages();
    this.addMessageTable(data);
};

/**
 * Add a message
 * @param {string} message
 * @returns {undefined}
 * @export
 */
nsVmap.Map.MapPopup.prototype.addMessage = function (message) {
    oVmap.log('nsVmap.Map.MapPopup.prototype.displayMessage');

    if (!goog.isDef(message)) {
        console.error('MapPopup: message not defined');
        return 0;
    }

    this.HTMLContent_.innerHTML = message;
    return true;
};

/**
 * 
 * @param {string} photoURL
 * @returns {Number|Boolean}
 * @export
 */
nsVmap.Map.MapPopup.prototype.addPhoto = function (photoURL) {
    oVmap.log('nsVmap.Map.MapPopup.prototype.addPhoto');

    if (!goog.isDef(photoURL)) {
        console.error('MapPopup: addPhoto not defined');
        return 0;
    }

    var this_ = this;

    var img = document.createElement("img");
    img.style.width = '100px';
    img.src = photoURL;

    if (!goog.isDef(this.HTMLImageContainer_)) {

        this.HTMLImageContainer_ = document.createElement("div");
        this.HTMLImageContainer_.style['position'] = 'relative';
        this.HTMLImageContainer_.style['float'] = 'right';
        this.HTMLImageContainer_.style['cursor'] = 'pointer';
        this.HTMLContent_.style['float'] = 'left';

        this.HTMLImageEnlargeButton_ = document.createElement("div");
        this.HTMLImageEnlargeButton_.className = 'select-img-enlarge-button';
        this.HTMLImageEnlargeButton_.innerHTML = '<span class="icon-enlarge2"></span>';

        this.HTMLImageSaveButton_ = document.createElement("a");
        this.HTMLImageSaveButton_.className = 'select-download-img-button';
        this.HTMLImageSaveButton_.href = photoURL;
        this.HTMLImageSaveButton_.download = "image.jpg";
        this.HTMLImageSaveButton_.style.display = "none";
        this.HTMLImageSaveButton_.innerHTML = '<span class="glyphicon glyphicon-save"></span>';

        this.HTMLImageContainer_.appendChild(this.HTMLImageEnlargeButton_);
        this.HTMLImageContainer_.appendChild(this.HTMLImageSaveButton_);
        this.HTMLContainer_.appendChild(this.HTMLImageContainer_);
    }

    this.HTMLImageContainer_.appendChild(img);
    $(this.HTML_).width($(this.HTMLImageContainer_).width() + $(this.HTMLContent_).width());

    this.HTMLImageContainer_.addEventListener('click', function () {
        if (img.style.width === '100px') {
            $(img).animate({
                width: $(this_.HTML_).width() + 'px'
            }, 500);
            this_.HTMLImageSaveButton_.style.display = 'block';
            this_.HTMLImageEnlargeButton_.innerHTML = '<span class="icon-shrink2"></span>';
        } else {
            $(img).animate({
                width: '100px'
            }, 500, "linear");
            this_.HTMLImageSaveButton_.style.display = 'none';
            this_.HTMLImageEnlargeButton_.innerHTML = '<span class="icon-enlarge2"></span>';
        }
    }, false);

    return true;
};

/**
 * Add a table on the popup according to the object
 * @param {object} data data to display
 * @returns {Boolean}
 */
nsVmap.Map.MapPopup.prototype.addMessageTable = function (data) {
    oVmap.log('nsVmap.Map.MapPopup.prototype.displayTable');

    if (!goog.isDef(data)) {
        console.error('MapPopup: data not defined');
        return 0;
    }

    var HTMLMessageContainer = document.createElement('table');

    for (var item in data) {

        // car feature est le mot clé utilisé pour stocker la feature dans infocontainer
        if (item === 'feature')
            continue;

        var row = document.createElement('tr');

        var column1 = document.createElement('td');
        column1.className = 'padding-sides-5 map-popup-cell';
        row.appendChild(column1);

        var column2 = document.createElement('td');
        column2.className = 'padding-sides-5 map-popup-cell';
        row.appendChild(column2);

        column1.innerHTML = item;
        column2.innerHTML = data[item];

        HTMLMessageContainer.appendChild(row);

        delete row;
        delete column1;
        delete column2;
    }

    this.HTMLContent_.appendChild(HTMLMessageContainer);
    return true;
};

/**
 * Add an action button on the popup
 * @param {object} action
 * @param {object} action.content content of the buton
 * @param {object} action.event event onclick
 * @export
 */
nsVmap.Map.MapPopup.prototype.addAction = function (action) {

    if (this.actions.indexOf(action) === -1) {
        this.actions.push(action);
        this.compileActions();
    }
};

/**
 * Remove an action button from the popup
 * @param {object} action action to remove
 * @export
 */
nsVmap.Map.MapPopup.prototype.removeAction = function (action) {
    if (this.actions.indexOf(action) !== -1) {
        this.actions.splice(this.actions.indexOf(action), 1);
        this.compileActions();
    }
};

/**
 * Compile the actions by this.actions
 * @export
 */
nsVmap.Map.MapPopup.prototype.compileActions = function () {
    oVmap.log('nsVmap.Map.MapPopup.prototype.compileActions');

    var this_ = this;

    // Container
    if (goog.isDef(this.HTMLDropup_))
        this.HTMLButtonsContainer_.removeChild(this.HTMLDropup_);
    this.HTMLDropup_ = document.createElement('div');
    this.HTMLDropup_.className = 'dropup';
    this.HTMLDropup_.style.position = 'inherit';

    // Bouton dropup
    this.HTMLList_ = document.createElement('a');
    this.HTMLList_.href = '#';
    this.HTMLList_.className = 'ol-popup-list icon-format_list_bulleted';
    this.HTMLList_.addEventListener('click', function () {
        $(this_.HTMLListUl_).toggleClass('block');
    });
    $('body').click(function (e) {
        if ($(this_.HTMLList_)[0] !== $(e.target)[0])
            $(this_.HTMLListUl_).removeClass('block');
    });

    // Liste
    this.HTMLListUl_ = document.createElement('ul');
    this.HTMLListUl_.style = 'right: 0;left: inherit;';
    this.HTMLListUl_.className = 'dropdown-menu';

    for (var i = 0; i < this.actions.length; i++) {
        this.HTMLListLi_ = document.createElement('li');
        this.HTMLListLiA_ = document.createElement('a');
        this.HTMLListLiA_.href = '#';
        this.HTMLListLiA_.innerHTML = this.actions[i]['content'];
        this.HTMLListLiA_.addEventListener('click', this.actions[i]['event']);
        this.HTMLListLiA_.addEventListener('click', function () {
            $(this_.HTMLListUl_).removeClass('block');
        });

        this.HTMLListUl_.appendChild(this.HTMLListLi_);
        this.HTMLListLi_.appendChild(this.HTMLListLiA_);
    }

    this.HTMLDropup_.appendChild(this.HTMLListUl_);
    this.HTMLDropup_.appendChild(this.HTMLList_);
    this.HTMLButtonsContainer_.appendChild(this.HTMLDropup_);
};

/**
 * remove the content of the table
 */
nsVmap.Map.MapPopup.prototype.removeMessages = function () {
    oVmap.log('nsVmap.Map.MapPopup.prototype.removeMessages');
    this.HTMLContent_.innerHTML = "";
};

/**
 * Remove the popup
 * @param {boolean|undefined} bRemoveFeature false if you dont want to remove the binded feature, default is true
 * @return {boolean}
 */
nsVmap.Map.MapPopup.prototype.remove = function (bRemoveFeature) {
    oVmap.log('nsVmap.Map.MapPopup.prototype.remove');

    bRemoveFeature = goog.isDef(bRemoveFeature) ? bRemoveFeature : true;

    this.popupOverlay_.setPosition(undefined);
    this.HTMLCloser_.blur();

    // supprime la feature
    if (goog.isDef(this.olFeature_) && bRemoveFeature !== false) {
        if (goog.array.contains(oVmap.getMap().getPopupOverlaySource().getFeatures(), this.olFeature_))
            oVmap.getMap().getPopupOverlaySource().removeFeature(this.olFeature_);
    }

    return true;
};

/**
 * Get the center of the geometry
 * @param {ol.geom} geom
 * @returns {Number}
 */
nsVmap.Map.MapPopup.prototype.getGeometryCenter = function (geom) {
    oVmap.log('nsVmap.Map.MapPopup.prototype.getGeometryCenter');

    if (geom.getType() === 'Polygon') {
        var position = geom.getInteriorPoint().getLastCoordinate();
    } else if (geom.getType() === 'MultiPolygon') {

        var aPolygons = geom.getPolygons();
        var maxArea = 0;
        var bigestPolygon = 0;

        // Retrouve le plus gros polygone
        for (var i = 0; i < aPolygons.length; i++) {
            if (maxArea < aPolygons[i].getArea()) {
                maxArea = aPolygons[i].getArea();
                bigestPolygon = i;
            }
        }
        var position = aPolygons[bigestPolygon].getInteriorPoint().getLastCoordinate();

    } else if (geom.getType() === 'LineString') {
        var centerPoint = Math.round(geom.getCoordinates().length / 2);
        var position = geom.getCoordinates()[centerPoint];
    } else if (geom.getType() === 'Circle') {
        var position = geom.getCenter();
    } else if (geom.getType() === 'Point' || geom.getType() === 'MultiPoint') {
        var position = geom.getLastCoordinate();
    } else if (geom.getType() === 'GeometryCollection') {
        return 0;
    } else {
        return geom.getLastCoordinate();
    }

    return position;
};
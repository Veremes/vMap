/* global oVmap, nsVmap, goog, ol */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.Controls
 * cette classe permet l'initialisation des interactons, controles etc..
 */
goog.provide('nsVmap.nsToolsManager.Controls');

goog.require('oVmap');

goog.require('ol.Map');
goog.require('ol.control');
goog.require('ol.control.Attribution');
goog.require('ol.control.Control');
goog.require('ol.control.FullScreen');
goog.require('ol.control.MousePosition');
goog.require('ol.control.OverviewMap');
goog.require('ol.control.Rotate');
goog.require('ol.control.ScaleLine');
goog.require('ol.control.Zoom');
goog.require('ol.control.ZoomSlider');
goog.require('ol.control.ZoomToExtent');
goog.require('ol.interaction.DragAndDrop');
goog.require('ol.format.GPX');
goog.require('ol.format.GeoJSON');
goog.require('ol.format.IGC');
goog.require('ol.format.KML');
goog.require('ol.format.TopoJSON');

/**
 * @classdesc
 * Class {@link nsVmap.nsToolsManager.Controls}: Add the controls defined in data/tools.json,
 * available : Attribution, FullScreen, MousePosition, OverviewMap, Rotate, ScaleLine, Zoom, ZoomSlider, 
 * ZoomToExtent, CurrentProjection, DragAndDrop (GPX,GeoJSON,IGC,KML,TopoJSON)
 * @param {array} aControls Controls to set
 * @constructor
 * @export
 */
nsVmap.nsToolsManager.Controls = function (aControls) {
    oVmap.log('nsVmap.nsToolsManager.Controls');

    var this_ = this;

    /**
     * Controls avaliable
     * @type {array}
     */
    this.aAvaliableControls = [{
            'id': 'Attribution',
            'title': 'Attributions',
            'description': 'Affiche les attributions de la couche'
        }, {
            'id': 'MousePosition',
            'title': 'Position de la souris',
            'description': 'Affiche la position de la souris'
        }, {
            'id': 'CurrentProjection',
            'title': 'Projection en cours',
            'description': 'Affiche la projection de la carte en cours'
        }, {
            'id': 'MapName',
            'title': 'Nom de la carte en cours',
            'description': 'Affiche le nom de la carte en cours'
        }, {
            'id': 'OverviewMap',
            'title': 'Carte de supervision',
            'description': 'Affiche la carte de supervision'
        }, {
            'id': 'Scale',
            'title': 'Échelle numérique',
            'description': 'Outil de changement d\'échelle'
        }, {
            'id': 'ScaleLine',
            'title': 'Échelle graphique',
            'description': 'Affiche la barre d\'échelle'
        }, {
            'id': 'Zoom',
            'title': 'Zoom',
            'description': 'Affiche les boutons de zoom + et -'
        }, {
            'id': 'ZoomSlider',
            'title': 'Slider de zoom',
            'description': 'Affiche le slider de zoom'
        }, {
            'id': 'RefreshSocket',
            'title': 'Rafraichissement auto',
            'description': 'Rafraichit automatiquement les couches lorsque les données sont modifiées'
        }
    ];

    /**
     * @type {ol.Map}
     * @private
     */
    this.map_ = oVmap.getMap().getOLMap();

    this.handleDragOver = function (event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    };

    this.handleFileSelect = function (event) {
        event.stopPropagation();
        event.preventDefault();
        var files = event.dataTransfer.files;

        // donne la valeur du fichier au bouton 'chercher'
        document.getElementById('browse-geometry-button').files = files;
        // ouvre la modale en mode geométrie
        oVmap.simuleClick('map-manager-button');
        oVmap.simuleClick('modal-geomerty-modal-button');
    };

    this.DragAndDrop = false;

    // Mobile
    var aAvaliableMobileControls = ['MapName', 'Scale', 'ScaleLine', 'Zoom', 'RefreshSocket'];
    if (oClientProperties['is_mobile']) {
        for (var i = this.aAvaliableControls.length - 1; i >= 0; i--) {
            if (aAvaliableMobileControls.indexOf(this.aAvaliableControls[i]['id']) === -1) {
                this.aAvaliableControls.splice(i, 1);
            }
        }
    }
};
// Obligatoire pour instancier dans nsVmap.nsToolsManager.ToolsManager
goog.exportProperty(nsVmap.nsToolsManager, 'Controls', nsVmap.nsToolsManager.Controls);

/**
 * Add a control to the ol map
 * @param {string} control Control to add
 * @return {boolean} False if the control cannot be added
 * @api experimental
 */
nsVmap.nsToolsManager.Controls.prototype.addControl = function (control) {
    oVmap.log('nsVmap.nsToolsManager.Controls.prototype.addControl: ' + control);

    switch (control) {
        case 'Attribution':

            var oControl = new ol.control.Attribution();
            oControl.set('type', control);
            this.map_.addControl(oControl);
            break;
        case 'FullScreen':

            var oControl = new ol.control.FullScreen();
            oControl.set('type', control);
            this.map_.addControl(oControl);
            break;
        case 'MousePosition':

            var oControl = new ol.control.MousePosition({
                coordinateFormat: function (coordinate) {
                    return [coordinate[0].toPrecision(8), coordinate[1].toPrecision(8)];
                }
            });
            oControl.set('type', control);
            this.map_.addControl(oControl);
            break;
        case 'OverviewMap':

            var oControl = new ol.control.OverviewMap({
                view: new ol.View({
                    projection: this.map_.getView().getProjection()
                })
            });
            this.overviewMap_ = oControl;
            oControl.set('type', control);
            this.map_.addControl(oControl);
            break;
        case 'Rotate':

            var oControl = new ol.control.Rotate({
                autoHide: false
            });
            oControl.set('type', control);
            this.map_.addControl(oControl);
            break;
        case 'ScaleLine':

            var oControl = new ol.control.ScaleLine({
                minWidth: 80
            });
            oControl.set('type', control);
            this.map_.addControl(oControl);
            break;
        case 'Zoom':

            var oControl = new ol.control.Zoom();
            oControl.set('type', control);
            this.map_.addControl(oControl);
            break;
        case 'ZoomSlider':

            var oControl = new ol.control.ZoomSlider();
            oControl.set('type', control);
            this.map_.addControl(oControl);
            break;
        case 'ZoomToExtent':

            var oControl = new ol.control.ZoomToExtent();
            oControl.set('type', control);
            this.map_.addControl(oControl);
            break;
//    case 'DragAndDrop':
//        var mapDiv = document.getElementsByClassName('ol-viewport');
//        for (var i = 0; i < mapDiv.length; i++) {
//            mapDiv[i].addEventListener('dragover', this.handleDragOver, false);
//            mapDiv[i].addEventListener('drop', this.handleFileSelect, false);
//        }
//        this.DragAndDrop = true;
//        break;
        case 'CurrentProjection':

            $('#olMap').children().children('.ol-overlaycontainer-stopevent').append('<div class="ol-current-projection ol-unselectable"><span id="current-projection" class="ol-control"></span></div>');

            $("#current-projection").html(oVmap['oProjections'][oVmap.getMap().getOLMap().getView().getProjection().getCode()]);

            break;

        case 'MapName':

            $('#olMap').children().children('.ol-overlaycontainer-stopevent').append('<div class="ol-map-name ol-unselectable"><span id="map-name" class="ol-control"></span></div>');
            var vMapCatalog = oVmap.getMapManager().getMapCatalog();
            for (var i = 0; i < vMapCatalog['maps'].length; i++) {
                if (vMapCatalog['maps'][i]['used'] === true) {
                    var currentMapName = vMapCatalog['maps'][i]['name'];
                }
            }
            $("#map-name").html(currentMapName);
            break;

        case 'Scale':

            var tool = '<div class="dropup"> <button class="btn btn-sm btn-default dropdown-toggle padding-sides-10 set-scale-btn" style="width: auto" type="button" onclick="$(\'#scale-list\').toggle()"> <span id="current-scale">' + oVmap.getMap().getScale({
                "pretty": true
            }) + '</span> <span class="caret"></span> </button> <ul id="scale-list" style="font-size: 12px" class="dropdown-menu" aria-labelledby="dropdownMenu2"> ' + (oVmap['properties']['is_mobile'] ? '' : '<li><a class="pointer" onclick="$(\'#scale-modal\').modal(\'show\')">Ajouter à la liste</a></li>') + ' <li><a class="pointer" onclick="oVmap.getMap().setScale(1000000)">1:1,000,000</a></li> <li><a class="pointer" onclick="oVmap.getMap().setScale(500000)">1:500,000</a></li> <li><a class="pointer" onclick="oVmap.getMap().setScale(250000)">1:250,000</a></li> <li><a class="pointer" onclick="oVmap.getMap().setScale(100000)">1:100,000</a></li> <li><a class="pointer" onclick="oVmap.getMap().setScale(50000)">1:50,000</a></li> <li><a class="pointer" onclick="oVmap.getMap().setScale(25000)">1:25,000</a></li> <li><a class="pointer" onclick="oVmap.getMap().setScale(10000)">1:10,000</a></li> <li><a class="pointer" onclick="oVmap.getMap().setScale(5000)">1:5,000</a></li> <li><a class="pointer" onclick="oVmap.getMap().setScale(1000)">1:1,000</a></li> <li><a class="pointer" onclick="oVmap.getMap().setScale(250)">1:250</a></li> <li><a class="pointer" onclick="oVmap.getMap().setScale(100)">1:100</a></li> </ul> </div>';

            $('#olMap').children().children('.ol-overlaycontainer-stopevent').append('<div id="current-scale-tool" class="ol-current-scale ol-unselectable ol-control"></div>');
            $("#current-scale-tool").html(tool);

            this.map_.on('click', function () {
                $('#scale-list').hide();
            }, this);

            var i = 0;
            this.map_.on('moveend', function () {
                i++;
                var ii = angular.copy(i);
                setTimeout(function () {
                    if (i === ii) {
                        $("#current-scale").html(oVmap.getMap().getScale({
                            'pretty': true
                        }));
                    }
                }, 100);
            }, this);

            break;
        case 'RefreshSocket':
            oVmap['bRefreshWebsockets'] = true;
            break;
        default:
            console.error("Warning : control (" + control + ") is not available");
            return false;
            break;
    }
};

/**
 * Toggle a control to the ol map
 * @param {string} control Control to toggle
 * @param {boolean} bActive 
 * @export
 */
nsVmap.nsToolsManager.Controls.prototype.setToolActive = function (control, bActive) {
    oVmap.log('nsVmap.nsToolsManager.Controls.prototype.setToolActive: ' + control, bActive);

    var oMap = oVmap.getMap().getOLMap();
    var aControls = oMap.getControls().getArray();
    bActive = goog.isDef(bActive) ? bActive : true;

    if (bActive === true) {
        // Ajout du controle
        this.addControl(control);
    } else {
        // Suppression du controls
        for (var i = 0; i < aControls.length; i++) {
            if (aControls[i].get('type') === control) {
                oMap.removeControl(aControls[i]);
                return 0;
            }
        }
    }

    if (control === 'CurrentProjection') {

        if (bActive === true) {
            $("#current-projection").show();
        } else {
            $("#current-projection").remove();
        }

    } else if (control === 'Scale') {

        if (bActive === true) {
            $("#current-scale-tool").show();
        } else {
            $("#current-scale-tool").hide();
        }
    } else if (control === 'MapName') {

        if (bActive === true) {
            $("#map-name").show();
        } else {
            $("#map-name").remove();
        }

    } else if (control === 'RefreshSocket') {
        oVmap['bRefreshWebsockets'] = bActive;
    }
};

/**
 * App-specific directive wrapping the control tools.
 *
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.nsToolsManager.Controls.prototype.controlsDirective = function () {
    oVmap.log("nsVmap.nsToolsManager.Controls.prototype.controlsDirective");
    return {
        restrict: 'A',
        scope: {
            'map': '=appMap',
            'lang': '=appLang'
        },
        controller: 'AppControlsController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/controls.html'
    };
};

/**
 * Controler that initialise the control tools to use
 * @ngInject
 * @constructor
 */
nsVmap.nsToolsManager.Controls.prototype.controlsController = function () {
    oVmap.log("nsVmap.nsToolsManager.Controls.prototype.controlsController");

    /**
     * The OpenLayers controls
     * @type {object}
     * @api stable
     */
    this.Controls = this['Controls'] = oVmap.getToolsManager().getBasicTools().getControls();

    /**
     * Controls avaliable
     * @type {array}
     */
    this['aAvaliableControls'] = this['Controls'].getAvaliableControls();

    /**
     * Actived controls on array
     * @type {array}
     * @private
     */
    this.aActiveControls_ = oVmap['properties']['controls']['active_controls'];

    // Vide les controls par défaut
    var map = oVmap.getMap().getOLMap();
    var controls = map.getControls().getArray();
    for (var i = 0; i < controls.length; i++) {
        map.removeControl(controls[i]);
    }

    // Ajout des controls
    for (var i = 0; i < this['aAvaliableControls'].length; i++) {
        if (this.aActiveControls_.indexOf(this['aAvaliableControls'][i]['id']) !== -1) {
            this['aAvaliableControls'][i]['active'] = true;
        } else {
            this['aAvaliableControls'][i]['active'] = false;
        }
        // Ajoute le controle
        this['Controls'].addControl(this['aAvaliableControls'][i]['id']);

        // Désactive le controle si par défaut il n'est pas actif
        if (this['aAvaliableControls'][i]['active'] === false)
            this['Controls'].setToolActive(this['aAvaliableControls'][i]['id'], this['aAvaliableControls'][i]['active']);
    }

    setTimeout(function () {
        $('[data-toggle="tooltip"]').tooltip({
            animation: false
        });
    }, 500);
};


/************************************************
 ------------ GETTERS AND SETTERS ----------------
 *************************************************/

/**
 * nsVmap.aAvaliableControls getter
 * @return {array} Controls on the map
 * @export
 */
nsVmap.nsToolsManager.Controls.prototype.getAvaliableControls = function () {
    return this.aAvaliableControls;
};

/**
 * this.overviewMap_ getter
 * @returns {ol.OverveiwMap}
 */
nsVmap.nsToolsManager.Controls.prototype.getOverviewMap = function () {
    return this.overviewMap_;
};

// Définit la directive et le controller
oVmap.module.directive('appControls', nsVmap.nsToolsManager.Controls.prototype.controlsDirective);
oVmap.module.controller('AppControlsController', nsVmap.nsToolsManager.Controls.prototype.controlsController);
/* global oVmap, goog, nsVmap, ol, bootbox */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.Location
 * cette classe permet l'initialisation des outils de locatlisation
 */
goog.provide('nsVmap.nsToolsManager.Location');

goog.require('ol.Geolocation');


/**
 * @classdesc
 * Class {@link nsVmap.nsToolsManager.Location}: Add the location tools defined in data/tools.json
 *
 * @constructor
 * @export
 */
nsVmap.nsToolsManager.Location = function () {
    oVmap.log('nsVmap.nsToolsManager.Location');

    // Directives et controleurs Angular
    oVmap.module.directive('appLocation', this.locationDirective);
    oVmap.module.controller('ApplocationController', this.locationController);
};

/**
 * App-specific directive wrapping the location tools. The directive's
 * controller has a property "map" including a reference to the OpenLayers
 * map.
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.nsToolsManager.Location.prototype.locationDirective = function () {
    oVmap.log("nsVmap.nsToolsManager.Location.prototype.locationDirective");
    return {
        restrict: 'A',
        scope: {
            'map': '=appMap',
            'lang': '=appLang'
        },
        controller: 'ApplocationController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/location.html'
    };
};

/**
 * @ngInject
 * @export
 * @constructor
 */
nsVmap.nsToolsManager.Location.prototype.locationController = function ($scope, $http, $q, $timeout) {
    oVmap.log("nsVmap.nsToolsManager.Location.prototype.locationController");

    var this_ = this;

    /**
     * @private
     */
    this.$scope_ = $scope;

    /**
     * @private
     */
    this.$timeout_ = $timeout;

    /**
     * @private
     */
    this.$http_ = $http;

    /**
     * @private
     */
    this.$q_ = $q;

    /**
     * Dummy canceler (use canceler.resolve() for cancel the $http request)
     * @private
     */
    this.canceler_ = $q.defer();

    /**
     * The current map
     * @type{ol.Map}
     * @private
     */
    this.map_ = this['map'];

    /**
     * Home position
     * @type {object}
     * @private
     */
    this.homePosition_ = {
        center: this.map_.getView().getCenter(),
        zoom: this.map_.getView().getZoom()
    };

    /**
     * @type pbject
     */
    this['projections'] = oVmap['oProjections'];

    /**
     * @type {array}
     */
    this['locationResults'] = [];

    /**
     * @type {string}
     */
    this['locationSearch'] = "";

    /**
     * @type {boolean}
     */
    this['searching'] = false;

    /**
     * @type {string}
     */
    this['noResults'] = "";

    /**
     * @type {string}
     */
    this['locationService'] = 'osm';

    /**
     * @type {array}
     */
    this['customLocationServicesProperties'] = [];

    /**
     * @tyle {number}
     */
    this['scale'] = Math.round(oVmap.getMap().getScale());

    // Récupère les properties de locatisation de l'API
    this.setAPILocationProperties();

    // Effectue une recherche lors du changement de ctrl.locationSearch
    $scope.$watch('ctrl.locationSearch', function () {
        $scope['ctrl'].searchLocation(this.last);
    }, true);

    /**
     * Get the size of an object
     * @param {type} obj
     * @returns {Number|Object.keys.ret.length}
     */
    $scope['sizeOf'] = function (obj) {
        return Object.keys(obj).length;
    };

    // Recharge la liste des services de recherche quand les couches changent
    oVmap['scope'].$on('layersChanged', function () {
        this_.$scope_.$applyAsync(function () {
            // Vide la recherche en cours
            this_.locationSearch = "";
            // Met OSM en mode de recherche
            this_.locationService = "osm";
            // Récupère les properties de locatisation de l'API
            this_.setAPILocationProperties();
        });
    });
};

/**
 * Refresh the map layers (witch are refreshables) without caches
 * @export
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.refreshMap = function () {
    oVmap.log('nsVmap.nsToolsManager.Location.prototype.locationController.prototype.refreshMap');
    this['map'].refreshWithTimestamp();
};

/**
 * Add a scale to the scale control
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.addScale = function () {
    oVmap.log('nsVmap.nsToolsManager.Location.prototype.locationController.prototype.addScale');

    var newScale = $('#new-scale-input').val();

    var parseScale = function (scale) {
        var j = 1;
        for (var i = scale.length - 1; i > 0; i--) {
            if (j % 3 === 0)
                scale = scale.slice(0, i) + ',' + scale.slice(i + Math.abs(0));
            j++;
        }
        return '1:' + scale;
    };

    $('#scale-list').append('<li><a class="pointer" onclick="oVmap.getMap().setScale(' + newScale + ')">' + parseScale(newScale) + '</a></li>');


    $('#scale-modal').modal('hide');
};

/**
 * Set the customLocationServicesProperties value
 * @returns {String} error
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.setAPILocationProperties = function () {
    oVmap.log('nsVmap.nsToolsManager.Location.prototype.locationController.prototype.setAPILocationProperties');

    this['customLocationServicesProperties'] = oVmap.getMapManager().getQueryableBusinessObjects();
};

/**
 * Localise the map on the home position
 * @export
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.maxExtent = function () {
    oVmap.log("nsVmap.nsToolsManager.Location.prototype.locationController.maxExtent");

    var map = this['map'];
    var view = this['map'].getView();
    var extent = view.getProjection().getExtent();
    var size = map.getSize();
    view.fit(extent, size);
};

/**
 * Localise the map on the home position
 * @export
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.goHome = function () {
    oVmap.log("nsVmap.nsToolsManager.Location.prototype.locationController.goHome");

    var currentView = oVmap.getMap().getOLMap().getView();
    var originalPosition = currentView.get('homePosition');

    currentView.setCenter(originalPosition.center);
    currentView.setResolution(originalPosition.resolution);
};

/**
 * Localise the map on the entry position
 * @param {string} Xid html id to the X value
 * @param {string} Yid html id to the Y value
 * @param {string} projectionId html id to the projection value
 * @export
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.goTo = function (Xid, Yid, projectionId) {
    oVmap.log("nsVmap.nsToolsManager.Location.prototype.locationController.goTo");

    var coordinates = [parseFloat($('#' + Xid).val()), parseFloat($('#' + Yid).val())];
    var projection = $('#' + projectionId).val();

    var currentProjeciton = oVmap.getMap().getOLMap().getView().getProjection();
    var projectedCoordinates = ol.proj.transform(coordinates, projection, currentProjeciton);

    // Affcihe un point sur les coordonnées
    var point = new ol.Feature(new ol.geom.Point(projectedCoordinates));

    if (isNaN(projectedCoordinates[0]) || isNaN(projectedCoordinates[1])) {
        bootbox.alert('<h4>Ces coordonnées ne sont pas disponibles dans la projection saisie</h4>');
        return 0;
    }

    if (projection !== 'EPSG:4326') {
        var message = 'X: ' + coordinates[0];
        message += '<br>Y: ' + coordinates[1];
    } else {
        var message = 'Lat: ' + coordinates[0];
        message += '<br>Long: ' + coordinates[1];
    }
    message += '<br><i>' + oVmap['oProjections'][projection] + '</i>';

    this.locateFeature(point, message);

    // Centre sur les coordonnées
    this['map'].getView().setCenter(projectedCoordinates);
};

/**
 * Localise the map on the geolocation position
 * @export
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.geolocateMe = function () {
    oVmap.log("nsVmap.nsToolsManager.Location.prototype.locationController.geolocateMe");

    var this_ = this;
    var geolocation = new ol.Geolocation({
        projection: 'EPSG:4326'
    });


    // enable or disable tracking
    geolocation.setTracking(true);

    geolocation.on('change:position', function () {
        var projeciton = oVmap.getMap().getOLMap().getView().getProjection();
        var coordinates = ol.proj.transform(geolocation.getPosition(), 'EPSG:4326', projeciton);

        // Affcihe un point sur les coordonnées
        var point = new ol.Feature(new ol.geom.Point(coordinates));
        this_.locateFeature(point, 'Vous êtes ici');


        // disable or disable tracking
        geolocation.setTracking(false);
    });

    // handle geolocation error.
    geolocation.on('error', function () {
        console.error('error');
    });

};

/**
 * Search a location
 * @param {string} location
 * @param {integer} limit
 * @export
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.searchLocation = function (location, limit) {
    oVmap.log('nsVmap.nsToolsManager.Location.prototype.locationController.prototype.searchLocation');

    location = goog.isDef(location) ? location : this['locationSearch'];
    limit = goog.isDef(limit) ? limit : 4;

    if (location.length === 0)
        return 0;

    // Annule les requêtes ayant pour timeout canceler_.promise
    this.canceler_.resolve();
    // Réinitialise canceler_
    this.canceler_ = this.$q_.defer();

    oVmap.getToolsManager().getBasicTools().toggleOutTools();

    // Affiche la fenêtre
    if (location !== "")
        oVmap.getToolsManager().getBasicTools().showTool('#location-search-form');

    this['searching'] = true;
    this['noResults'] = '';

    var url = '';
    if (this['locationService'] === 'osm')
        url = 'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=' + limit + '&extratags=1&namedetails=1&polygon_geojson=1&countrycodes=fr&q=' + location;
    else {
        var service = this['locationService'];
        var bo_id = this['customLocationServicesProperties'][service]['bo_id'];
        var bo_search_field = this['customLocationServicesProperties'][service]['bo_search_field'];
        var bo_search_use_strict = this['customLocationServicesProperties'][service]['bo_search_use_strict'];

        if (bo_search_use_strict === 'true' || bo_search_use_strict === true)
            var filter = '"' + bo_search_field + '"=\'' + location + '\'';
        else if (bo_search_use_strict === 'left')
            var filter = 'LOWER("' + bo_search_field + '") LIKE LOWER(\'' + location + '%\')';
        else if (bo_search_use_strict === 'right')
            var filter = 'LOWER("' + bo_search_field + '") LIKE LOWER(\'%' + location + '\')';
        else
            var filter = 'LOWER("' + bo_search_field + '") LIKE LOWER(\'%' + location + '%\')';

        url = oVmap['properties']['api_url'] + '/vmap/querys/' + bo_id + '/summary';
    }

    var this_ = this;
    this.$http_({
        method: 'GET',
        url: url,
        params: {
            'token': oVmap['properties']['token'],
            'filter': filter,
            'limit': limit
        },
        timeout: this.canceler_.promise
    }).then(function successCallback(response) {

        // Cache le gif de chargement
        this_['searching'] = false;
        this_['locationResults'] = [];
        this_['noResults'] = '';

        // Vérifie si il y a des données à afficher
        if (!goog.isDef(response['data']) || goog.isNull(response['data'])) {
            this_['noResults'] = 'Aucun résultat';
            console.error('Pas de données à afficher');
            return 0;
        }

        // Vérifie si il y a une erreur
        if (goog.isDef(response['data']['error'])) {
            if (goog.isDef(response['data']['error']['errorMessage'])) {
                console.error(response['data']['error']['errorMessage']);
                this_['noResults'] = response['data'].error.errorMessage;
                return response['data']['error'];
            }
        }

        // Ajoute le résultat
        if (this_['locationService'] === 'osm') {
            this_['locationResults'] = response['data'];
        } else if (goog.isDef(response['data']['data'])) {
            this_['locationResults'] = response['data']['data'];
        }

        if (!goog.isDef(this_['locationResults']))
            return 0;

        // Si aucun résultat n'est disponible
        if (this_['locationResults'].length === 0) {
            this_['noResults'] = 'Aucun résultat';
            return 0;
        }
    });
};

/**
 * Zoom on a place
 * @param {object} place
 * @param {object} place.lon longitude
 * @param {object} place.lat latitude
 * @param {object} place.geojson geometry
 * @returns {Number|String} error
 * @export
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.locatePlace = function (place) {
    oVmap.log('nsVmap.nsToolsManager.Location.prototype.locationController.prototype.locatePlace');

    if (!goog.isDef(place))
        return 'place not defined';

    var geojson = place['geojson'];
    var currentProjeciton = this['map'].getView().getProjection();

    // Centre par rapport aux params lon/lat (au cas où la géométrie soit mal renseingée)
    if (goog.isDef(place['lon']) && goog.isDef(place['lat'])) {

        var projectedCoordinates = ol.proj.transform([parseFloat(place['lon']), parseFloat(place['lat'])], 'EPSG:4326', currentProjeciton);
        this['map'].getView().setCenter(projectedCoordinates);
    }

    // Affiche la géométrie et centre dessus
    if (!goog.isDef(geojson))
        return 0;

    this.locateGeom(geojson, 'EPSG:4326', place['display_name']);
};

/**
 * Add to the selection list of nsVmap.nsToolsManager.Select
 * @param {object} selection object attributes
 * @param {string} selection.geom GeoJSON geometry
 * @param {object} service
 * @param {string} service.idField Unique id field
 * @param {string} service.title Title of the entity
 * @param {string} service.bo_type Business object type
 * @param {string} service.geom_field Name of the geometry column
 * @export
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.addToSelection = function (selection, service) {
    oVmap.log('nsVmap.nsToolsManager.Location.prototype.locationController.prototype.addSelection');

    var this_ = this;

    var url = oVmap['properties']['api_url'] + '/vmap/querys/' + selection['bo_type'] + '/summary';

    var filter = '"' + selection['bo_id_field'].replace(/\./g, '"."') + '"=\'' + selection['bo_id_value'] + '\'';

    var proj = this['map'].getView().getProjection().getCode().substring(5);

    this.$http_({
        method: 'GET',
        url: url,
        params: {
            'token': oVmap['properties']['token'],
            'filter': filter,
            'get_geom': true,
            'result_proj': proj,
            'get_image': true,
            'limit': 200
        }
    }).then(function successCallback(response) {

        $('body').css({"cursor": ""});

        // Vérifie si il y a une erreur
        if (goog.isDef(response['data']['error'])) {
            if (goog.isDef(response['data']['error']['errorMessage'])) {
                console.error(response['data']['error']['errorMessage']);
            }
        }

        // Vérifie si il y a des données à afficher
        if (!goog.isDef(response['data']['data'])) {
            console.error('Pas de données à afficher');
        } else {
            var data = response['data']['data'];
        }

        // Au cas ou le résultat soit vide
        if (data.length === 0)
            return 0;

        var selection = data[0];

        this_.centerGeom(selection['bo_intersect_geom']);

        var selectScope = angular.element($('#select-list-modal')).scope();
        selectScope.$evalAsync(function () {
            var this_ = selectScope['ctrl'];
            var newSelection = goog.array.clone(this_['aSelections']);
            goog.array.extend(this_.aLastSelections, newSelection);
            this_.removeSelections();
            this_.addQueryResult({
                data: [selection],
                dataType: 'summary',
                callback: function () {
                    this_.closeSelectionPopup(this_.aLastSelections, true);
                    this_.displaySelectionPopup(this_['aSelections']);
                }
            });
        });


    }, function (response) {
        console.error(response);
        $('body').css({"cursor": ""});
    });
};

/**
 * Center the map on the geom center
 * @param {string} EWKTGeom EWKT geometry
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.centerGeom = function (EWKTGeom) {
    oVmap.log('nsVmap.nsToolsManager.Location.prototype.locationController.prototype.centerGeom');

    var geom = oVmap.getGeomFromEWKT(EWKTGeom);
    var resolution = this['map'].getView().getResolution();

    // Zoom sur la feature
    if (geom.getType() === 'Point') {
        this['map'].getView().setCenter(geom.getCoordinates());
        this['map'].getView().setResolution(resolution);
    } else if (geom.getType() === 'MultiPoint') {
        this['map'].getView().fit(geom.getExtent(), this['map'].getSize());
        this['map'].getView().setResolution(resolution);
    } else {
        this['map'].getView().fit(geom.getExtent(), this['map'].getSize());
    }
};

/**
 * Locate a geom
 * @param {string|object} geojson geoJSON geometry
 * @param {string} proj geom projection (ex: EPSG:2154)
 * @param {string} message message to display on the popup
 * @returns {String}
 * @export
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.locateGeom = function (geojson, proj, message) {
    oVmap.log('nsVmap.nsToolsManager.Location.prototype.locationController.prototype.locateGeom');

    if (!goog.isDef(geojson))
        return 'geom not defined';

    if (typeof geojson === 'string')
        geojson = JSON.parse(geojson);

    var currentProjeciton = this['map'].getView().getProjection();

    // Affiche la nouvelle feature
    var GeoJSON = new ol.format.GeoJSON({
        defaultDataProjection: currentProjeciton
    });
    var geom = GeoJSON.readGeometry(geojson, {
        dataProjection: proj,
        featureProjection: currentProjeciton
    });
    var feature = new ol.Feature({
        geometry: geom
    });

    this.locateFeature(feature, message);

};

/**
 * Locate a feature and display a popup
 * @param {olFeature} feature
 * @param {string} message
 * @returns {undefined}
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.locateFeature = function (feature, message) {
    oVmap.log('nsVmap.nsToolsManager.Location.prototype.locationController.prototype.locateFeature');

    var extent = feature.getGeometry().getExtent();
    var resolution = this['map'].getView().getResolution();

    // Zoom sur la feature
    if (feature.getGeometry().getType() === 'Point') {
        this['map'].getView().setCenter(feature.getGeometry().getCoordinates());
    } else if (feature.getGeometry().getType() === 'MultiPoint') {
        this['map'].getView().fit(extent, this['map'].getSize());
        this['map'].getView().setZoom(resolution);
    } else {
        this['map'].getView().fit(extent, this['map'].getSize());
    }

    if (goog.isDef(this.locationPopup)) {
        this.locationPopup.remove();
    }

    this.locationPopup = new nsVmap.Map.MapPopup(feature);
    this.locationPopup.displayMessage(message);
};

/**
 * Remove the location and hide the panel
 * @export
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.removeLocation = function () {
    oVmap.getToolsManager().getBasicTools().hideTool('#location-search-form');
};

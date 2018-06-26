/* global oVmap, goog, nsVmap, ol, bootbox */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.Location
 * cette classe permet l'initialisation des outils de locatlisation
 */
goog.provide('nsVmap.nsToolsManager.Location');

goog.require('oVmap');

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
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/' + (oVmap['properties']['is_mobile'] ? 'location_mobile.html' : 'location.html')
    };
};

/**
 * @ngInject
 * @export
 * @constructor
 */
nsVmap.nsToolsManager.Location.prototype.locationController = function ($scope, $q, $timeout) {
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
    this.$q_ = $q;

    /**
     * Dummy canceler (use canceler.resolve() for cancel the ajax request)
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
    this['sSelectedLocationService'] = null;

    /**
     * @type {array}
     */
    this['oBusinessObjects'] = [];

    /**
     * @tyle {number}
     */
    this['scale'] = Math.round(oVmap.getMap().getScale());

    $scope['goToX'] = '';
    $scope['goToY'] = '';
    $scope['goToProj'] = 'EPSG:4326';

    // Récupère les properties de locatisation de l'API
    this.setBusinessObjectsList();

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
            this_['locationSearch'] = "";
            // Récupère les properties de locatisation de l'API
            this_.setBusinessObjectsList();
            // Définit le service de recherche par défaut
            setTimeout(function () {
                this_.$scope_.$applyAsync(function () {
                    this_['sSelectedLocationService'] = this_.getDefaultlocationService_();
                });
            });
        });
    });

    // Vide les localisations quand on change de carte
    oVmap['scope'].$on('mapChanged', function () {
        if (goog.isDef(this_.locationPopup)) {
            this_.locationPopup.remove();
        }
    });

    $scope['locationServiceType'] = 'geocoder';

    this['locationServices'] = JSON.parse(oVmap['properties']['vmap_geocoders']);

    setTimeout(function () {
        $scope.$applyAsync(function () {
            $scope['ctrl']['sSelectedLocationService'] = this_.getDefaultlocationService_();
        });
    });
};

/**
 * Get the default location service
 * @returns {String}
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.getDefaultlocationService_ = function () {
    oVmap.log('nsVmap.nsToolsManager.Location.prototype.locationController.prototype.getDefaultlocationService_');

    var aBusinessObjects = [];
    for (var key in this['oBusinessObjects']) {
        aBusinessObjects.push(this['oBusinessObjects'][key]);
    }

    if (oVmap['properties']['vmap_default_geocoders'] === 'business_object' && aBusinessObjects.length > 0) {
        var firstBoIndex = 0;
        if (!goog.isDefAndNotNull(aBusinessObjects[firstBoIndex]['bo_index'])) {
            aBusinessObjects[firstBoIndex]['bo_index'] = 1000000;
        }
        if (aBusinessObjects.length > 1) {
            for (var i = 1; i < aBusinessObjects.length; i++) {
                if (goog.isDefAndNotNull(aBusinessObjects[i]['bo_index']) && goog.isDefAndNotNull(aBusinessObjects[i]['bo_search_field']) && goog.isDefAndNotNull(aBusinessObjects[i]['bo_result_field'])) {
                    if (aBusinessObjects[i]['bo_index'] < aBusinessObjects[firstBoIndex]['bo_index']) {
                        firstBoIndex = angular.copy(i);
                    }
                }
            }
        }
        if (!(goog.isDefAndNotNull(aBusinessObjects[firstBoIndex]['bo_search_field']) && goog.isDefAndNotNull(aBusinessObjects[firstBoIndex]['bo_result_field']))) {
            return 'osm';
        } else {
            return aBusinessObjects[firstBoIndex]['bo_id'];
        }
    } else if (goog.isDefAndNotNull(this['locationServices'][oVmap['properties']['vmap_default_geocoders']])) {
        return oVmap['properties']['vmap_default_geocoders'];
    } else {
        return 'osm';
    }
};

/**
 * Refresh the map layers (witch are refreshables) without caches
 * @export
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.refreshMap = function () {
    oVmap.log('nsVmap.nsToolsManager.Location.prototype.locationController.prototype.refreshMap');
    var _this = this;
    // Création du fichier ".map" du flux wms privée.
    var oFormData = new FormData();
    oFormData.append("wmsservice_id", oVmap['properties']['private_wms_service']);
    oFormData.append("type", "prod");
    ajaxRequest({
        "method": "POST",
        "url": oVmap['properties']["web_server_name"] + "/" + oVmap['properties']["services_alias"] + "/vm4ms/WmsServices/MapFile",
        "data": oFormData,
        "success": function (response) {
            _this['map'].refreshWithTimestamp();
        },
        "error": function (response) {
            _this['map'].refreshWithTimestamp();
        }
    });
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
 * Set the oBusinessObjects value
 * @returns {String} error
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.setBusinessObjectsList = function () {
    oVmap.log('nsVmap.nsToolsManager.Location.prototype.locationController.prototype.setBusinessObjectsList');

    this['oBusinessObjects'] = oVmap.getMapManager().getQueryableBusinessObjects();
};

/**
 * Localise the map on the home position
 * @export
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.maxExtent = function () {
    oVmap.log("nsVmap.nsToolsManager.Location.prototype.locationController.maxExtent");

    var view = this['map'].getView();
    var extent = view.getProjection().getExtent();
    view.fit(extent);
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
 * @param {string} CoordX html id to the X value
 * @param {string} CoordY html id to the Y value
 * @param {string} projectionId html id to the projection value
 * @export
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.goTo = function (CoordX, CoordY, projection) {
    oVmap.log("nsVmap.nsToolsManager.Location.prototype.locationController.goTo");

    var coordinates = [parseFloat(CoordX), parseFloat(CoordY)];
    var currentProjeciton = oVmap.getMap().getOLMap().getView().getProjection();
    var projectedCoordinates = ol.proj.transform(coordinates, projection, currentProjeciton);

    // Affcihe un point sur les coordonnées
    var point = new ol.Feature(new ol.geom.Point(projectedCoordinates));

    if (isNaN(projectedCoordinates[0]) || isNaN(projectedCoordinates[1])) {
        bootbox.alert('<h4>Ces coordonnées ne sont pas disponibles dans la projection saisie</h4>');
        return 0;
    }

    var message = 'X: ' + coordinates[0];
    message += '<br>Y: ' + coordinates[1];
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
    if (oVmap['properties']['is_mobile']) {
        oVmap.getMap().centerGPSPosition();
    } else {
        var aGPSPosition = oVmap.getMap().getGPSPosition(oVmap.getMap().getOLMap().getView().getProjection());
        if (goog.isDefAndNotNull(aGPSPosition)) {
            // Affcihe un point sur les coordonnées
            var point = new ol.Feature(new ol.geom.Point(aGPSPosition));
            this_.locateFeature(point, 'Vous êtes ici');
        }
    }
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

    var getFieldValue = function (sField, oObject) {
        var recursiveGetObjectValue = function (aFields, oObject) {
            if (aFields.length === 1) {
                if (goog.isDefAndNotNull(oObject[aFields[0]])) {
                    return oObject[aFields[0]];
                } else {
                    return null;
                }
            } else if (aFields.length > 1) {
                if (goog.isDefAndNotNull(oObject[aFields[0]])) {
                    oObject = oObject[aFields[0]];
                    aFields.splice(0, 1);
                    return recursiveGetObjectValue(aFields, oObject);
                } else {
                    return null;
                }
            } else {
                return null;
            }
        };
        return recursiveGetObjectValue(sField.split('.'), oObject);
    };

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

    var url = null;
    var oParams = {};

    // Géocodeur paramétré
    if (goog.isDefAndNotNull(this['locationServices'][this['sSelectedLocationService']])) {

        this.$scope_['locationServiceType'] = 'geocoder';
        var oLocationService = this['locationServices'][this['sSelectedLocationService']];

        if (goog.isDefAndNotNull(oLocationService['url'])) {
            url = oLocationService['url'].replace('[limit]', limit).replace('[search]', location);
        }
    }
    // Objet métier
    else if (goog.isDefAndNotNull(this['oBusinessObjects'][this['sSelectedLocationService']])) {

        this.$scope_['locationServiceType'] = 'business_object';
        var service = this['sSelectedLocationService'];
        var bo_id = this['oBusinessObjects'][service]['bo_id'];
        var bo_search_field = this['oBusinessObjects'][service]['bo_search_field'];
        var bo_search_use_strict = this['oBusinessObjects'][service]['bo_search_use_strict'];
        var filter = '';

        if (bo_search_use_strict === 'true' || bo_search_use_strict === true) {
            filter = {
                "column": bo_search_field,
                "compare_operator": "=",
                "value": bo_search_use_strict
            };
        } else if (bo_search_use_strict === 'left') {
            filter = {
                "column": bo_search_field,
                "compare_operator": "LIKE",
                "compare_operator_options": {
                    "case_insensitive": true
                },
                "value": location + '%'
            };
        } else if (bo_search_use_strict === 'right') {
            filter = {
                "column": bo_search_field,
                "compare_operator": "LIKE",
                "compare_operator_options": {
                    "case_insensitive": true
                },
                "value": '%' + location
            };
        } else {
            filter = {
                "column": bo_search_field,
                "compare_operator": "LIKE",
                "compare_operator_options": {
                    "case_insensitive": true
                },
                "value": '%' + location + '%'
            };
        }

        url = oVmap['properties']['api_url'] + '/vmap/querys/' + bo_id + '/summary';
        oParams = {
            'filter': filter,
            'limit': limit
        };
    }

    if (goog.isDefAndNotNull(url)) {
        var this_ = this;
        ajaxRequest({
            'method': 'GET',
            'url': url,
            'headers': {
                'Accept': 'application/x-vm-json'
            },
            'params': oParams,
            'scope': this.$scope_,
            'timeout': 5000,
            'abord': this.canceler_.promise,
            'success': function (response) {
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

                // Objet métier
                if (goog.isDefAndNotNull(this_['oBusinessObjects'][this_['sSelectedLocationService']])) {
                    if (goog.isDefAndNotNull(response['data'])) {
                        if (goog.isDefAndNotNull(response['data']['data'])) {
                            this_['locationResults'] = response['data']['data'];
                        }
                    }
                }

                // Géocodeur
                if (goog.isDefAndNotNull(this_['locationServices'][this_['sSelectedLocationService']])) {

                    var oLocationService = this_['locationServices'][this_['sSelectedLocationService']];
                    var aResponse = getFieldValue(oLocationService['data_field'], response);

                    for (var i = 0; i < aResponse.length; i++) {
                        var oResult = {};
                        oResult['title'] = getFieldValue(oLocationService['title_field'], aResponse[i]);
                        if (goog.isDefAndNotNull(oLocationService['description_field'])) {
                            oResult['description'] = getFieldValue(oLocationService['description_field'], aResponse[i]);
                        }
                        if (goog.isDefAndNotNull(oLocationService['geojson_field'])) {
                            oResult['geojson'] = getFieldValue(oLocationService['geojson_field'], aResponse[i]);
                        }
                        if (goog.isArray(oLocationService['summary_fields'])) {
                            oResult['summary'] = [];
                            for (var ii = 0; ii < oLocationService['summary_fields'].length; ii++) {
                                oResult['summary'].push({
                                    'label': oLocationService['summary_fields'][ii]['label'],
                                    'value': getFieldValue(oLocationService['summary_fields'][ii]['key'], aResponse[i])
                                });
                            }
                        }
                        this_['locationResults'].push(oResult);
                    }
                }

                if (!goog.isDef(this_['locationResults']))
                    return 0;

                // Si aucun résultat n'est disponible
                if (this_['locationResults'].length === 0) {
                    this_['noResults'] = 'Aucun résultat';
                    return 0;
                }
            },
            'error': function () {
                // Cache le gif de chargement
                this_['searching'] = false;
                this_['locationResults'] = [];
                this_['noResults'] = '';
                this_['noResults'] = 'Requête en erreur';
            }
        });
    }
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

    if (oVmap['properties']['is_mobile']) {
        oVmap.getToolsManager().getBasicTools().hideMobileMenu();
    }

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

    this.locateGeom(geojson, 'EPSG:4326', place['title']);
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

    if (oVmap['properties']['is_mobile']) {
        oVmap.getToolsManager().getBasicTools().hideMobileMenu();
    }

    var this_ = this;
    var url = oVmap['properties']['api_url'] + '/vmap/querys/' + selection['bo_type'] + '/summary';
//    var filter = '"' + selection['bo_id_field'].replace(/\./g, '"."') + '"=\'' + selection['bo_id_value'] + '\'';
    var proj = this['map'].getView().getProjection().getCode().substring(5);

    ajaxRequest({
        'method': 'GET',
        'url': url,
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'params': {
            'filter': {
                "column": selection['bo_id_field'].replace(/\./g, '"."'),
                "compare_operator": "=",
                "value": selection['bo_id_value']
            },
            'get_geom': true,
            'result_proj': proj,
            'get_image': true,
            'limit': 200
        },
        'scope': this.$scope_,
        'success': function (response) {

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

            // Cas ou il n'y ait pas de géométrie
            if (!goog.isDefAndNotNull(selection['bo_intersect_geom'])) {
                $.notify('Géométrie non disponible');
                return 0;
            }

            this_.centerGeom(selection['bo_intersect_geom']);

            var selectScope = angular.element($('#vmap-basicselect-tool')).scope();
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
        }
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
        this['map'].getView().fit(geom.getExtent());
        this['map'].getView().setResolution(resolution);
    } else {
        this['map'].getView().fit(geom.getExtent());
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
 * @param {string|undefined|null} message
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
        this['map'].getView().fit(extent);
        this['map'].getView().setZoom(resolution);
    } else {
        this['map'].getView().fit(extent);
    }

    if (goog.isDef(this.locationPopup)) {
        this.locationPopup.remove();
    }

    if (goog.isDefAndNotNull(message)) {
        this.locationPopup = new nsVmap.Map.MapPopup(feature);
        this.locationPopup.displayMessage(message);
    }
};

/**
 * Remove the location and hide the panel
 * @export
 */
nsVmap.nsToolsManager.Location.prototype.locationController.prototype.removeLocation = function () {
    oVmap.getToolsManager().getBasicTools().hideTool('#location-search-form');
};

// Définit la directive et le controller
oVmap.module.directive('appLocation', nsVmap.nsToolsManager.Location.prototype.locationDirective);
oVmap.module.controller('ApplocationController', nsVmap.nsToolsManager.Location.prototype.locationController);
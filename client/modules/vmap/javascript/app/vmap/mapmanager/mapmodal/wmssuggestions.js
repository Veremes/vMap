/* global angular, oVmap, ol, goog, nsVmap */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.nsMapModal.WMSSuggestions
 * cette classe permet d'afficher les suggestions wms'
 */

goog.provide('nsVmap.nsMapManager.nsMapModal.WMSSuggestions');

goog.require('oVmap');

goog.require('ol.source.ImageWMS');
goog.require('ol.format.WMSCapabilities');


/**
 * @classdesc
 * Class {@link nsVmap.nsMapManager.nsMapModal.WMSSuggestions}: load the map list suggestions
 *
 * @constructor
 * @export
 */
nsVmap.nsMapManager.nsMapModal.WMSSuggestions = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.WMSSuggestions");
};

/************************************************
 ---------- DIRECTIVES AND CONTROLLERS -----------
 *************************************************/
/**
 * map list directive
 * @return {angular.Directive} The directive specs.
 * @export
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsDirective = function () {
    oVmap.log("nsVmap.wmssuggestionsDirective");
    return {
        restrict: 'E',
        scope: {
            'map': '=appMap',
            'proj': '=appProj',
            'lang': '=appLang'
        },
        controller: 'AppWmssuggestionsController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/layers/mapmodal/wmssuggestions.html'
    };
};

/**
 * map list controller
 * @export
 * @ngInject
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsController = function ($scope) {
    oVmap.log("nsVmap.wmssuggestionsController");

    var this_ = this;

    /**
     * @private
     */
    this.$scope_ = $scope;
    
    /**
     * The displayed layers
     * @type {array<ol.Layer>}
     * @api stable
     */
    this['aLayers'] = [];

    /**
     * The displayed services
     * @type {array}
     * @api stable
     */
    $scope['aServices'] = [];
    
    /**
     * The service url
     * @type string
     */
    this.sServiceUrl_ = '';
    
    /**
     * The service login
     * @type string
     */
    this.sServiceLogin_ = '';
    
    /**
     * The service password
     * @type string
     */
    this.sServicePassword_ = '';

    /**
     * The selected service
     */
    $scope['oSelectedService'] = {
        'url': '',
        'login': '',
        'password': ''
    };

    /**
     * Id of the selected style
     * @type number
     */
    $scope['oSelectedStyle'] = {};

    /**
     * Filter string
     * @type string
     */
    $scope['filter'] = "";

    // Filtre le résultat
    $scope.$watch('filter', function () {

        var filteredArray = goog.array.filter(this_['aLayers'], function (element, index, array) {

            var filter = String($scope['filter']).toLowerCase().withoutAccents();
            var name = String(element['Name']).toLowerCase().withoutAccents();
            var title = String(element['Title']).toLowerCase().withoutAccents();
            var projections = String(element['projections']).toLowerCase().withoutAccents();

            // Vérifie si la carte est conforme au filter
            if (name.indexOf(filter) !== -1 || title.indexOf(filter) !== -1 || projections.indexOf(filter) !== -1) {
                return true;
            } else
                return false;
        });

        this_['aLayersFiltered'] = filteredArray;
    });

    this.reloadServicesList();
};

/**
 * Make a getCapabilities request and load the layers list
 * @ngInject
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsController.prototype.getCapabilities = function () {
    oVmap.log("getCapabilities");

    var this_ = this;
    var sUrl = angular.copy(this.$scope_['oSelectedService']['url'].removeURLParams(['request', 'service', 'version']));
    var aLayers = [];

    // Clear la liste des couches proposées
    goog.array.clear(this['aLayers']);
    goog.array.clear(this['aLayersFiltered']);

    if (sUrl === "") {
        $.notify('Veuillez renseigner une URL', 'error');
        return 0;
    }

    // Effectue une copie (au cas où l'utilisateur modifie l'url après le getCapabilities)
    this.sServiceUrl_ = angular.copy(this.$scope_['oSelectedService']['url'].removeURLParams(['request', 'service', 'version']));
    this.sServiceLogin_ = angular.copy(this.$scope_['oSelectedService']['login']);
    this.sServicePassword_ = angular.copy(this.$scope_['oSelectedService']['password']);

    // Crée l'url
    if (sUrl.indexOf("?") === -1)
        sUrl += "?";
    else
        sUrl += "&";
    sUrl += "service=WMS&version=1.3.0&request=GetCapabilities";

    // Efface le message d'erreur
    $("#log-message").empty();
    // Affiche l'image d'attente
    $("#load-img-wms").show();

    var oHeaders = {
        "charset": "charset=utf-8"
    };
    if (goog.isDefAndNotNull(this.$scope_['oSelectedService']['login']) && goog.isDefAndNotNull(this.$scope_['oSelectedService']['password'])) {
        oHeaders['Authorization'] = "Basic " + btoa(this.$scope_['oSelectedService']['login'] + ":" + this.$scope_['oSelectedService']['password']);
    }

    // appel ajax
    ajaxRequest({
        'method': 'GET',
        'url': oVmap['properties']['proxy_url'] + '?url=' + encodeURIComponent(sUrl),
        'headers': oHeaders,
        'scope': this.$scope_,
        'timeout': 5000,
        'responseType': 'text',
        'success': function (resp) {

            function rhtmlspecialchars(str) {
                if (typeof (str) == "string") {
                    str = str.replace(/&gt;/ig, ">");
                    str = str.replace(/&lt;/ig, "<");
                    str = str.replace(/&#039;/g, "'");
                    str = str.replace(/&quot;/ig, '"');
                    str = str.replace(/&amp;/ig, '&'); /* must do &amp; last */
                }
                return str;
            }

            // Cache l'image d'attente
            $("#load-img-wms").hide();
            if (resp['data'] === "") {
                oVmap.log("GetCapabilities sans résultat");
                // Affiche le nouveau message d'erreur
                var error = 'Requête GetCapabilities sans résultat, veuillez vérifier l\'URL du service';
                $.notify(error, 'error');
                return 0;
            }

            oVmap.log("GetCapabilities pass");
            var parser = new ol.format.WMSCapabilities();
            var result = rhtmlspecialchars(resp['data']);

            try {
                result = parser.read(result);
            } catch (e) {
                bootbox.alert(resp['data']);
                return 0;
            }

            var aLayerProjection = [];
            var mapProjection = oVmap.getMap().getOLMap().getView().getProjection().getCode();
            var serviceTitle = result['Service']['Title'];

            /**
             * Browse all the <layer> tags to fill aLayers
             * @param {object} layer node
             */
            var searchLayers = function (layer) {
                if (layer['Layer'] === undefined)
                    aLayers.push(layer);
                else
                    for (var i = 0; i < layer['Layer'].length; i++) {
                        searchLayers(layer['Layer'][i]);
                    }
            };

            searchLayers(result['Capability']['Layer']);
            aLayers['serviceTitle'] = serviceTitle;
            aLayers['version'] = result['version'];

            // Récupère les projections admises pour chaque couche
            $(rhtmlspecialchars(resp['data'])).find('Layer').each(function () {
                var oProjection = {
                    sName: $(this).children("Name").text(),
                    sCodes: ''
                };

                if ($(this).children("CRS").length > 0 && $(this).children("CRS").length < 10) {
                    for (var i = 0; i < $(this).children("CRS").length; i++) {
                        oProjection.sCodes += $(this).children("CRS")[i]['innerHTML'] + ' ';
                    }
                }
                if ($(this).children("SRS").length > 0 && $(this).children("SRS").length < 10) {
                    for (var i = 0; i < $(this).children("SRS").length; i++) {
                        oProjection.sCodes += $(this).children("SRS")[i]['innerHTML'] + ' ';
                    }
                }
                aLayerProjection.push(oProjection);
            });

            // Regarde si la couche est compatible
            for (var i = 0; i < aLayers.length; i++) {
                for (var ii = 0; ii < aLayerProjection.length; ii++) {
                    if (aLayerProjection[ii].sName === aLayers[i]['Name']) {
                        aLayers[i]['projections'] = aLayerProjection[ii].sCodes;
                    }
                }
            }

            // Affiche la liste
            $("#wms-suggestions-list").show();

            this_['aLayers'] = aLayers;
            this_['aLayersFiltered'] = aLayers;
        },
        'error': function (response) {
            // Cache l'image d'attente
            $("#load-img-wms").hide();
            console.error(response);

            // Affiche le nouveau message d'erreur
            var error = 'Erreur lors du chargement (plus d\'infos en console)';
            $.notify(error, 'error');
        }
    });
};

/**
 * Add the selected layer
 * @param {object} oLayerOptions
 * @param {string|undefined} sStyleName
 * @export
 */
nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsController.prototype.addLayer = function (oLayerOptions, sStyleName) {
    oVmap.log('nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsController.prototype.addLayer');

    var sUrl = this.sServiceUrl_;
    var sLayerName = oLayerOptions['Name'];
    var sLayerTitle = oLayerOptions['Title'];
    var bQueryable = oLayerOptions['queryable'];
    var version = this['aLayers']['version'];
    var style;

    if (goog.isDefAndNotNull(sStyleName)) {
        style = sStyleName;
        $('#wms-select-style-modal').modal('hide');
    } else {
        if (goog.isArray(oLayerOptions['Style'])) {
            if (oLayerOptions['Style'].length > 1) {
                this['oLayerToAdd'] = oLayerOptions;
                this.$scope_['oSelectedStyle'] = this['oLayerToAdd']['Style'][0];
                $('#wms-select-style-modal').modal('show');
                return 0;
            } else {
                if (goog.isDefAndNotNull(oLayerOptions['Style'][0])) {
                    if (goog.isDefAndNotNull(oLayerOptions['Style'][0]['Name'])) {
                        style = oLayerOptions['Style'][0]['Name'];
                    }
                }
            }
        }
    }

    // Ajoute ?service=wms
    if (sUrl.indexOf("?") === -1)
        sUrl += "?service=wms";

    // Récupère le nom du service
    var sServiceName = this.getServiceTitle(oLayerOptions);

    var oLayer = {};
    oLayer.url = sUrl;
    oLayer.login = this.sServiceLogin_;
    oLayer.password = this.sServicePassword_;
    oLayer.layerType = "imagewms";
    oLayer.serviceName = sServiceName;
    oLayer.layerName = sLayerName;
    oLayer.layerTitle = sLayerTitle;
    oLayer.queryable = bQueryable;
    oLayer.version = version;
    oLayer.style = style;

    oVmap.getMapManager().addLayer(oLayer);
};

/**
 * Get the service title
 * @param {object} oLayerOptions
 * @returns {string}
 */
nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsController.prototype.getServiceTitle = function (oLayerOptions) {
    oVmap.log('nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsController.prototype.getServiceTitle');

    var sServiceName;
    var aCatalogServices = this.$scope_['aServices'];

    for (var i = 0; i < aCatalogServices.length; i++) {
        if (aCatalogServices[i]['url'] === this.sServiceUrl_) {
            sServiceName = aCatalogServices[i]['name'];
        }
    }

    if (!goog.isDefAndNotNull(sServiceName)) {
        sServiceName = this['aLayers']['serviceTitle'];
    }

    return sServiceName;
};

/**
 * Get the avaliable services (with login and password)
 * @returns {Array}
 * @export
 */
nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsController.prototype.reloadServicesList = function () {
    oVmap.log('nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsController.prototype.reloadServicesList');

    var aServices = [];
    var oOptions;
    var oCatalog = angular.copy(oVmap.getMapManager().getMapCatalog());

    for (var i = 0; i < oCatalog['services']['wms'].length; i++) {
        aServices.push(oCatalog['services']['wms'][i]);
    }

    for (var i = 0; i < aServices.length; i++) {
        oOptions = {};
        if (goog.isDefAndNotNull(aServices[i]['service_options'])) {
            if (goog.isString(aServices[i]['service_options'])) {
                try {
                    oOptions = JSON.parse(aServices[i]['service_options']);
                } catch (e) {
                    oOptions = {};
                }
            } else if (goog.isObject(aServices[i]['service_options'])) {
                oOptions = aServices[i]['service_options'];
            }
        }
        if (goog.isDefAndNotNull(oOptions['login']) && goog.isDefAndNotNull(oOptions['password'])) {
            aServices[i]['login'] = oOptions['login'];
            aServices[i]['password'] = oOptions['password'];
        } else {
            aServices[i]['login'] = '';
            aServices[i]['password'] = '';
        }
    }

    this.$scope_['aServices'] = aServices;
};

// Définit la directive et le controller
oVmap.module.directive('appWmssuggestions', nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsDirective);
oVmap.module.controller('AppWmssuggestionsController', nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsController);
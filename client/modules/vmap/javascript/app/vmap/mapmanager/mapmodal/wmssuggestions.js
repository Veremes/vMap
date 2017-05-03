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
nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsController = function ($http, $scope) {
    oVmap.log("nsVmap.wmssuggestionsController");

    var this_ = this;

    /**
     * @private
     * @type {angular.$http}
     */
    this.http_ = $http;

    /**
     * The maps catalog
     * @type {object}
     * @api stable
     */
    this['catalog'] = oVmap.getMapManager().getMapModalTool().getMapCatalog();

    /**
     * The displayed layers
     * @type {array<ol.Layer>}
     * @api stable
     */
    this['aLayers'] = [];

    /**
     * The url to request
     * @type string
     */
    this['sRequestUrl'] = '';

    /**
     * The service url
     * @type string
     */
    this.sServiceUrl_ = '';

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
};

/**
 * Make a getCapabilities request and load the layers list
 * @ngInject
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsController.prototype.getCapabilities = function () {
    oVmap.log("getCapabilities");

    var sUrl = angular.copy(this['sRequestUrl'].removeURLParams(['request', 'service', 'version']));
    var aLayers = [];

    // Clear la liste des couches proposées
    goog.array.clear(this['aLayers']);
    goog.array.clear(this['aLayersFiltered']);

    if (sUrl === "") {
        $.notify('Veuillez renseigner une URL', 'error');
        return 0;
    }

    // Effectue une copie (au cas où l'utilisateur modifie l'url après le getCapabilities)
    this.sServiceUrl_ = angular.copy(this['sRequestUrl'].removeURLParams(['request', 'service', 'version']));

    // Crée l'url
    if (sUrl.indexOf("?") === -1)
        sUrl += "?";
    else
        sUrl += "&";
    sUrl += "service=wms&version=1.3.0&request=GetCapabilities";

    // Efface le message d'erreur
    $("#log-message").empty();
    // Affiche l'image d'attente
    $("#load-img-wms").show();

    // appel ajax
    this.http_({
        url: oVmap['properties']['proxy_url'] + '?url=' + encodeURIComponent(sUrl),
        headers: {
            "charset": "charset=utf-8"
        }
    }).then(angular.bind(this, function (resp) {

        // Cache l'image d'attente
        $("#load-img-wms").hide();
        if (resp.data === "") {
            oVmap.log("GetCapabilities sans résultat");
            // Affiche le nouveau message d'erreur
            var error = 'Requête GetCapabilities sans résultat, veuillez vérifier l\'URL du service';
            $.notify(error, 'error');
            return 0;
        }

        oVmap.log("GetCapabilities pass");
        var parser = new ol.format.WMSCapabilities();
        var result = resp.data;

        try {
            result = parser.read(result);
        } catch (e) {
            bootbox.alert(result);
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
        $(resp.data).find('Layer').each(function () {
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

        this['aLayers'] = aLayers;
        this['aLayersFiltered'] = aLayers;

    })), function errorCallback(response) {
        // Cache l'image d'attente
        $("#load-img-wms").hide();
        console.error(response);

        // Affiche le nouveau message d'erreur
        var error = 'Erreur lors du chargement (plus d\'infos en console)';
        $.notify(error, 'error');
    };
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

//    if (goog.isDefAndNotNull(sStyleName)) {
//        style = sStyleName;
//        $('#wms-select-style-modal').modal('hide');
//    } else {
//        if (goog.isArray(oLayerOptions['Style'])) {
//            if (oLayerOptions['Style'].length > 1) {
//                this['oLayerToAdd'] = oLayerOptions;
//                $('#wms-select-style-modal').modal('show');
//                return 0;
//            } else {
//                if (goog.isDefAndNotNull(oLayerOptions['Style'][0])) {
//                    if (goog.isDefAndNotNull(oLayerOptions['Style'][0]['Name'])) {
//                        style = oLayerOptions['Style'][0]['Name'];
//                    }
//                }
//            }
//        }
//    }

    // Ajoute ?service=wms
    if (sUrl.indexOf("?") === -1)
        sUrl += "?service=wms";

    // Récupère le nom du service
    var sServiceName = this.getServiceTitle(oLayerOptions);

    var oLayer = {};
    oLayer.url = sUrl;
    oLayer.layerType = "imagewms";
    oLayer.serviceName = sServiceName;
    oLayer.layerName = sLayerName;
    oLayer.layerTitle = sLayerTitle;
    oLayer.queryable = bQueryable;
    oLayer.version = version;
//    oLayer.style = style;

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
    var aCatalogServices = this['catalog']['services']['wms'];

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

// Définit la directive et le controller
oVmap.module.directive('appWmssuggestions', nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsDirective);
oVmap.module.controller('AppWmssuggestionsController', nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsController);
/* global goog, oVmap, nsVmap, this */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.nsMapModal.WMTSSuggestions
 * cette classe permet d'afficher les suggestions wmts'
 */

goog.provide('nsVmap.nsMapManager.nsMapModal.WMTSSuggestions');

goog.require('oVmap');

/**
 * @classdesc
 * Class {@link nsVmap.nsMapManager.nsMapModal.WMTSSuggestions}: load the map list suggestions
 *
 * @constructor
 * @export
 */
nsVmap.nsMapManager.nsMapModal.WMTSSuggestions = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.WMTSSuggestions");
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
nsVmap.nsMapManager.nsMapModal.WMTSSuggestions.prototype.wmtssuggestionsDirective = function () {
    oVmap.log("nsVmap.wmtssuggestionsDirective");
    return {
        restrict: 'E',
        scope: {
            'map': '=appMap',
            'lang': '=appLang'
        },
        controller: 'AppWmtssuggestionsController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/layers/mapmodal/wmtssuggestions.html'
    };
};

/**
 * map list controller
 * @export
 * @ngInject
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.WMTSSuggestions.prototype.wmtssuggestionsController = function ($scope) {
    oVmap.log('nsVmap.nsMapManager.nsMapModal.WMTSSuggestions.prototype.wmtssuggestionsController');

    var this_ = this;

    this.$scope_ = $scope;

    this.appMainScope_ = angular.element(vitisApp.appMainDrtv).scope();

    /**
     * The maps catalog
     * @type {object}
     */
    this['catalog'] = oVmap.getMapManager().getMapModalTool().getMapCatalog();

    /**
     * The displayed layers
     * @type {array}
     */
    this['aLayers'] = [];

    /**
     * Filter string
     * @type string
     */
    $scope['filter'] = "";

    this['oService'];
    this['sRequestUrl'] = '';
    this['sRequestType'] = 'KVP';
    this['sRequestVersion'] = '1.0.0';

    this['oLayerToAdd'];
    this['sLayerToAdd_name'];
    this['sLayerToAdd_style_name'];
    this['sLayerToAdd_matrix_name'];
    this['oLayerToAdd_matrix_def'] = {};

    this['oCapabilities'];

    $scope['iServiceIndex'];
    $scope['iSelectedStyleIndex'];

    // Rafraichit oLayerToAdd_matrix_def quand sLayerToAdd_matrix_name est modifié
    $scope.$watch('ctrl.sLayerToAdd_matrix_name', function (value) {

        goog.object.clear(this_['oLayerToAdd_matrix_def']);

        if (goog.isDefAndNotNull(value) && value !== '') {
            if (goog.isDefAndNotNull(this_['oCapabilities'])) {
                if (goog.isDefAndNotNull(this_['oCapabilities']['Contents'])) {
                    if (goog.isDefAndNotNull(this_['oCapabilities']['Contents'])) {
                        if (goog.isArray(this_['oCapabilities']['Contents']['TileMatrixSet'])) {
                            var aTileMatrixSet = this_['oCapabilities']['Contents']['TileMatrixSet'];
                            for (var i = 0; i < aTileMatrixSet.length; i++) {
                                if (aTileMatrixSet[i]['Identifier'] === value) {
                                    this_['oLayerToAdd_matrix_def'] = angular.copy(aTileMatrixSet[i]);
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Filtre le résultat
    $scope.$watch('filter', function () {

        var filteredArray = goog.array.filter(this_['aLayers'], function (element, index, array) {

            var filter = String($scope['filter']).toLowerCase().withoutAccents();
            var name = String(element['Identifier']).toLowerCase().withoutAccents();
            var title = String(element['Title']).toLowerCase().withoutAccents();

            // Vérifie si la carte est conforme au filter
            if (name.indexOf(filter) !== -1 || title.indexOf(filter) !== -1) {
                return true;
            } else
                return false;
        });

        this_['aLayersFiltered'] = filteredArray;
    });
};

/**
 * Select a service on the template
 * @param {integer} iServiceIndex
 * @export
 */
nsVmap.nsMapManager.nsMapModal.WMTSSuggestions.prototype.wmtssuggestionsController.prototype.selectService = function (iServiceIndex) {
    oVmap.log('nsVmap.nsMapManager.nsMapModal.WMTSSuggestions.prototype.wmtssuggestionsController.prototype.selectService');

    this['oService'] = this['catalog']['services']['wmts'][iServiceIndex];
    if (goog.isDefAndNotNull(this['oService'])) {
        this['sRequestUrl'] = goog.isDefAndNotNull(this['oService']['url']) ? this['oService']['url'] : '';
        this['sRequestType'] = goog.isDefAndNotNull(this['oService']['service_type_type']) ? this['oService']['service_type_type'] : 'KVP';
        this['sRequestVersion'] = goog.isDefAndNotNull(this['oService']['service_type_version']) ? this['oService']['service_type_version'] : '1.0.0';
    } else {
        this['sRequestUrl'] = '';
        this['sRequestType'] = 'KVP';
        this['sRequestVersion'] = '1.0.0';
    }
};

/**
 * Make a getCapabilities request and load the layers list
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.WMTSSuggestions.prototype.wmtssuggestionsController.prototype.getCapabilities = function () {
    oVmap.log('nsVmap.nsMapManager.nsMapModal.WMTSSuggestions.prototype.wmtssuggestionsController.prototype.getCapabilities');

    if (!goog.isDefAndNotNull(this['sRequestUrl']) || this['sRequestUrl'] === '') {
        $.notify('Informations insuffisantes: URL', 'error');
        return null;
    }
    if (!goog.isDefAndNotNull(this['sRequestType']) || this['sRequestType'] === '') {
        $.notify('Informations insuffisantes: Type', 'error');
        return null;
    }
    if (!goog.isDefAndNotNull(this['sRequestVersion']) || this['sRequestVersion'] === '') {
        $.notify('Informations insuffisantes: Version', 'error');
        return null;
    }

    var this_ = this;

    // Affiche l'image d'attente
    $("#load-img-wmts").show();

    // Cache la liste
    $("#wmts-suggestions-list").hide();

    // Clear les informations
    goog.array.clear(this['aLayers']);
    goog.array.clear(this['aLayersFiltered']);
    goog.object.clear(this_['oCapabilities']);

    // Enlève certains attributs au cas où l'utilisateur est ait écrits dans l'url
    var sRequestUrl = angular.copy(this['sRequestUrl'].removeURLParams(['request', 'service', 'version']));

    this.appMainScope_['WMTSCapabilities']({
        'serviceUrl': sRequestUrl,
        'serviceVersion': this['sRequestVersion'],
        'WMTSType': this['sRequestType']
    }, function (oCapabilities) {

        this_['oCapabilities'] = oCapabilities;

        // Cache l'image d'attente
        $("#load-img-wmts").hide();

        // Affiche la liste
        $("#wmts-suggestions-list").show();

        var bCapabilitiesOk = false;
        if (goog.isDefAndNotNull(this_['oCapabilities'])) {
            if (goog.isDefAndNotNull(this_['oCapabilities']['Contents'])) {
                if (goog.isDefAndNotNull(this_['oCapabilities']['Contents']['Layer'])) {
                    bCapabilitiesOk = true;
                }
            }
        }
        if (!bCapabilitiesOk) {
            $.notify('Contenu du service incohérent', 'error');
            return null;
        } else {
            this_['aLayers'] = this_['oCapabilities']['Contents']['Layer'];
            this_['aLayersFiltered'] = this_['oCapabilities']['Contents']['Layer'];
        }

    }, function (sError) {
        // Cache l'image d'attente
        $("#load-img-wmts").hide();
        this_.appMainScope_.$root['modalWindow']('dialog', 'Service non valide', {
            'className': 'modal-danger',
            'message': sError
        });
    });
};

/**
 * Add a wmts layer
 * @param {object} oLayer
 * @param {array<object>} oLayer.Style
 * @param {array<object>} oLayer.TileMatrixSetLink
 * @param {string} oLayer.Identifier
 * @export
 */
nsVmap.nsMapManager.nsMapModal.WMTSSuggestions.prototype.wmtssuggestionsController.prototype.addLayer = function (oLayer) {
    oVmap.log('nsVmap.nsMapManager.nsMapModal.WMTSSuggestions.prototype.wmtssuggestionsController.prototype.addLayer');

    // Réinit les variables
    this['sLayerToAdd_name'] = '';
    this['sLayerToAdd_style_name'] = '';
    this['sLayerToAdd_format_name'] = '';
    this['sLayerToAdd_matrix_name'] = '';

    if (!goog.isArray(oLayer['Style'])) {
        $.notify('Informations insuffisantes: Style', 'error');
        return null;
    }
    if (!goog.isArray(oLayer['TileMatrixSetLink'])) {
        $.notify('Informations insuffisantes: Matrice', 'error');
        return null;
    }

    this['oLayerToAdd'] = oLayer;
    this['sLayerToAdd_name'] = oLayer['Identifier'];
    this['sLayerToAdd_title'] = oLayer['Title'];

    if (oLayer['Style'].length === 1 && oLayer['Format'].length === 1 && oLayer['TileMatrixSetLink'].length === 1) {
        this['sLayerToAdd_style_name'] = this['oLayerToAdd']['Style'][0]['Identifier'];
        this['sLayerToAdd_format_name'] = this['oLayerToAdd']['Format'][0];
        this['sLayerToAdd_matrix_name'] = this['oLayerToAdd']['TileMatrixSetLink'][0]['TileMatrixSet'];
        this.addLayerToAdd();
    } else {
        this['sLayerToAdd_style_name'] = '?';
        this['sLayerToAdd_format_name'] = '?';
        this['sLayerToAdd_matrix_name'] = '?';
        $('#wmts-select-matrix-modal').modal('show');
    }
};

/**
 * Add the layer to add using
 * this.oCapabilities
 * this.sLayerToAdd_name
 * this.sLayerToAdd_title
 * this.sLayerToAdd_style_name
 * this.sLayerToAdd_matrix_name
 * this.sLayerToAdd_format_name
 * this.sRequestType
 * this.sRequestVersion
 * this.sRequestUrl
 * @export
 */
nsVmap.nsMapManager.nsMapModal.WMTSSuggestions.prototype.wmtssuggestionsController.prototype.addLayerToAdd = function () {
    oVmap.log('nsVmap.nsMapManager.nsMapModal.WMTSSuggestions.prototype.wmtssuggestionsController.prototype.addLayerToAdd');
    
    console.log("this['sLayerToAdd_style_name']: ", this['sLayerToAdd_style_name']);

    if (!goog.isDefAndNotNull(this['sLayerToAdd_name']) || this['sLayerToAdd_name'] === '') {
        $.notify('Informations insuffisantes: Nom de la couche', 'error');
        return null;
    }
    if (!goog.isDefAndNotNull(this['sLayerToAdd_title']) || this['sLayerToAdd_title'] === '') {
        $.notify('Informations insuffisantes: Titre de la couche', 'error');
        return null;
    }
    if (!goog.isDefAndNotNull(this['sLayerToAdd_style_name']) || this['sLayerToAdd_style_name'] === '?') {
        $.notify('Informations insuffisantes: Style', 'error');
        return null;
    }
    if (!goog.isDefAndNotNull(this['sLayerToAdd_matrix_name']) || this['sLayerToAdd_matrix_name'] === '?') {
        $.notify('Informations insuffisantes: Matrice', 'error');
        return null;
    }
    if (!goog.isDefAndNotNull(this['sLayerToAdd_format_name']) || this['sLayerToAdd_format_name'] === '?') {
        $.notify('Informations insuffisantes Format', 'error');
        return null;
    }

    var bCapabilitiesOk = false;
    if (goog.isDefAndNotNull(this['oCapabilities'])) {
        if (goog.isDefAndNotNull(this['oCapabilities']['Contents'])) {
            if (goog.isDefAndNotNull(this['oCapabilities']['Contents']['Layer'])) {
                bCapabilitiesOk = true;
            }
        }
    }
    if (!bCapabilitiesOk) {
        $.notify('Contenu du service incohérent', 'error');
        return null;
    }

    $('#wmts-select-matrix-modal').modal('hide');

    var oLayer = {};
    oLayer.layerType = "wmts";
    oLayer.layerName = this['sLayerToAdd_name'];
    oLayer.layerTitle = this['sLayerToAdd_title'];
    oLayer.style = this['sLayerToAdd_style_name'];
    oLayer.matrixSet = this['sLayerToAdd_matrix_name'];
    oLayer.format = this['sLayerToAdd_format_name'];
    oLayer.requestEncoding = this['sRequestType'];
    oLayer.version = this['sRequestVersion'];
    oLayer.url = this['sRequestUrl'];
    oLayer.service_options = JSON.stringify(this['oCapabilities']);

    // Définit le nom du service (depuis le catalogue, ServiceIdentification, ServiceProvider)
    if (goog.isDefAndNotNull(this.$scope_['iServiceIndex'])) {
        if (goog.isDefAndNotNull(this['catalog'])) {
            if (goog.isDefAndNotNull(this['catalog']['services'])) {
                if (goog.isDefAndNotNull(this['catalog']['services']['wmts'])) {
                    if (goog.isDefAndNotNull(this['catalog']['services']['wmts'][this.$scope_['iServiceIndex']])) {
                        if (goog.isDefAndNotNull(this['catalog']['services']['wmts'][this.$scope_['iServiceIndex']]['name'])) {
                            oLayer.serviceName = this['catalog']['services']['wmts'][this.$scope_['iServiceIndex']]['name'];
                        }
                    }
                }
            }
        }
    }
    if (!goog.isDefAndNotNull(oLayer.serviceName)) {
        if (goog.isDefAndNotNull(this['oCapabilities']['ServiceProvider'])) {
            if (goog.isDefAndNotNull(this['oCapabilities']['ServiceProvider']['ProviderName'])) {
                oLayer.serviceName = this['oCapabilities']['ServiceProvider']['ProviderName'];
            }
        }
    }
    if (!goog.isDefAndNotNull(oLayer.serviceName)) {
        if (goog.isDefAndNotNull(this['oCapabilities']['ServiceIdentification'])) {
            if (goog.isDefAndNotNull(this['oCapabilities']['ServiceIdentification']['Title'])) {
                oLayer.serviceName = this['oCapabilities']['ServiceIdentification']['Title'];
            }
        }
    }
    if (!goog.isDefAndNotNull(oLayer.serviceName)) {
        oLayer.serviceName = 'Service WMTS';
    }

    oVmap.getMapManager().addLayer(oLayer);
};

// Définit la directive et le controller
oVmap.module.directive('appWmtssuggestions', nsVmap.nsMapManager.nsMapModal.WMTSSuggestions.prototype.wmtssuggestionsDirective);
oVmap.module.controller('AppWmtssuggestionsController', nsVmap.nsMapManager.nsMapModal.WMTSSuggestions.prototype.wmtssuggestionsController);
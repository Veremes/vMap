/* global goog, nsVmap, oVmap, bootbox, vitisApp, this */

goog.provide('nsVmap.exportVexCtrl');
goog.require('oVmap');

/**
 * ExportVex controller
 * @param {object} $scope
 * @param {object} $log
 * @param {object} $q
 * @param {object} $translate
 * @returns {nsVmap.exportVexCtrl}
 * @export
 * @ngInject
 */
nsVmap.exportVexCtrl = function ($scope, $log, $q, $translate) {
    $log.info("nsVmap.exportVexCtrl");

    this.$log_ = $log;
    this.$scope_ = $scope;
    this.$q_ = $q;
    this.$translate_ = $translate;
    this.mainScope_ = angular.element(vitisApp.appMainDrtv).scope();

    this['oProperties'] = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
    this['sToken'] = sessionStorage['session_token'];
    this['oTranslations'] = {};

    this.aExportedObjects_ = [];
    this.schemaRegexp_ = new RegExp(/^([a-zA-Z0-9_]*)$/);

    /**
     * Current step
     */
    $scope['displayedStep'] = '';

    // Étapes
    $scope['steps'] = ['select_vmap_objects', 'select_web_services', 'select_sql_objects', 'execute_export'];

    /**
     * Export efectué avec succés
     */
    $scope['bExportOk'] = false;

    /**
     * Listes des objets vMap exportables
     */
    $scope['oVmapObjects'] = {
        'maps': [],
        'calques': [],
        'vm4ms_layers': [],
        'business_objects': []
    };

    /**
     * Objets vMap à exporter
     */
    $scope['oSelectedVmapObjects'] = {
        'maps': [],
        'calques': [],
        'vm4ms_layers': [],
        'business_objects': []
    };

    /**
     * Liste des services web exploitables
     */
    $scope['aWebServices'] = [];

    /**
     * Liste des services web sélectionnés
     */
    $scope['aSelectedWebServices'] = [];

    /**
     * Liste des bases de données exploitables
     */
    $scope['aAvaliableDatabases'] = [];

    /**
     * Base de données sélectionnée
     */
    $scope['sSelectedDatabase'] = null;

    /**
     * Objets SQL exploitables
     */
    $scope['aSQLObjects'] = null;

    /**
     * Objets SQL sélectionnés
     */
    $scope['aSelectedSQLObjects'] = [];

    // Traductions
    this.importTranslations_();

    // Première étape
    this.goStep('select_vmap_objects');
};


// Fonctions publiques

/**
 * Function called to submit a step
 * @param {string} step
 * @export
 */
nsVmap.exportVexCtrl.prototype.submitStep = function (step) {
    this.$log_.info("nsVmap.exportVexCtrl.submitStep");

    var this_ = this;

    switch (step) {
        case 'select_vmap_objects':
            this.validateSelectedVMapObjects_().then(function () {
                this_.nextStep();
            });
            break;
        case 'select_web_services':
            this.validateSelectedWebServices_().then(function () {
                this_.nextStep();
            });
            break;
        case 'select_sql_objects':
            this.validateSelectedSQLObjects_().then(function () {
                this_.nextStep();
            });
            break;
        default:
            this.nextStep();
            break;
    }
};

/**
 * Function called to display the next step
 * @export
 */
nsVmap.exportVexCtrl.prototype.nextStep = function () {
    this.$log_.info("nsVmap.exportVexCtrl.nextStep");

    var this_ = this;
    var step = angular.copy(this.$scope_['displayedStep']);
    var nextStep;

    // Changement de step
    var stepIndex = this.$scope_['steps'].indexOf(step);
    if (stepIndex !== -1) {
        if (goog.isDefAndNotNull(this.$scope_['steps'][stepIndex + 1])) {
            nextStep = this.$scope_['steps'][stepIndex + 1];
        } else {
            console.error('next step doesn\'t exists');
            return null;
        }
    } else {
        console.error('this step doesn\'t exists');
        return null;
    }

    this.goStep(nextStep);
};

/**
 * Function called to display the previous step
 * @export
 */
nsVmap.exportVexCtrl.prototype.prevStep = function () {
    this.$log_.info("nsVmap.exportVexCtrl.prevStep");

    var this_ = this;
    var step = angular.copy(this.$scope_['displayedStep']);
    var prevStep;

    // Changement de step
    var stepIndex = this.$scope_['steps'].indexOf(step);
    if (stepIndex !== -1) {
        if (goog.isDefAndNotNull(this.$scope_['steps'][stepIndex - 1])) {
            prevStep = this.$scope_['steps'][stepIndex - 1];
        } else {
            console.error('previous step doesn\'t exists');
            return null;
        }
    } else {
        console.error('this step doesn\'t exists');
        return null;
    }

    this.goStep(prevStep);
};

/**
 * Go to the specified step
 * @param {string} step
 * @export
 */
nsVmap.exportVexCtrl.prototype.goStep = function (step) {
    this.$log_.info("nsVmap.exportVexCtrl.goStep");

    var this_ = this;

    var currentIndex = this_.$scope_['steps'].indexOf(this_.$scope_['displayedStep']);
    var stepIndex = this_.$scope_['steps'].indexOf(step);

    // Marche avant
    if (!(currentIndex > stepIndex)) {
        switch (step) {
            case 'select_vmap_objects':
                this.loadVMapObjects_().then(function () {
                    this_.$scope_['displayedStep'] = step;
                    this_.loadVMapObjectsTreeview_();
                });
                break;
            case 'select_web_services':
                this.loadWebServices_().then(function success() {
                    this_.$scope_['displayedStep'] = step;
                    this_.loadWebServicesTreeview_();
                }, function error() {
                    // En cas d'erreur passe à l'étape suivante/précédante
                    if (currentIndex !== -1 && stepIndex !== -1) {
                        this_.$scope_['displayedStep'] = step;
                        if (currentIndex < stepIndex) {
                            this_.nextStep();
                            return true;
                        }
                        if (currentIndex > stepIndex) {
                            this_.prevStep();
                            return true;
                        }
                    }
                });
                break;
            case 'select_sql_objects':
                this.loadSQLObjects_().then(function () {
                    this_.$scope_['displayedStep'] = step;
                });
                break;
            default:
                this.$scope_['displayedStep'] = step;
                break;
        }
    }

    // Marche arrière
    if (currentIndex > stepIndex) {
        switch (step) {
            case 'select_web_services':
                this.loadWebServices_().then(function success() {
                    this_.$scope_['displayedStep'] = step;
                    this_.loadWebServicesTreeview_();
                }, function error() {
                    // En cas d'erreur passe à l'étape suivante/précédante
                    if (currentIndex !== -1 && stepIndex !== -1) {
                        this_.$scope_['displayedStep'] = step;
                        if (currentIndex < stepIndex) {
                            this_.nextStep();
                            return true;
                        }
                        if (currentIndex > stepIndex) {
                            this_.prevStep();
                            return true;
                        }
                    }
                });
                break;
            default:
                this.$scope_['displayedStep'] = step;
                break;
        }
    }
};

/**
 * Close the export modal
 * @export
 */
nsVmap.exportVexCtrl.prototype.closeExportModal = function () {
    this.$log_.info("nsVmap.exportVexCtrl.closeExportModal");

    $('.bootbox.modal').each(function () {
        $(this).modal('hide');
    });

    this.mainScope_['setMode']('development');
};


// Utiles

/**
 * Export the translations in this.oTranslations
 * @private
 */
nsVmap.exportVexCtrl.prototype.importTranslations_ = function () {

    var this_ = this;

    var aTranslationsCodes = [];

    // étapes
    for (var i = 0; i < this.$scope_['steps'].length; i++) {
        aTranslationsCodes.push('CTRL_EXPORT_VEX_STEP_' + this.$scope_['steps'][i]);
    }

    // erreurs
    aTranslationsCodes.push('CTRL_EXPORT_VEX_ERROR_REQUEST_GET_VMAP_OBJETS');
    aTranslationsCodes.push('CTRL_EXPORT_VEX_ERROR_REQUEST_GET_WEB_SERVICES');
    aTranslationsCodes.push('CTRL_EXPORT_VEX_NO_RESULT_REQUEST_GET_WEB_SERVICES');
    aTranslationsCodes.push('CTRL_EXPORT_VEX_ERROR_REQUEST_GET_SQL_DATABASES');
    aTranslationsCodes.push('CTRL_EXPORT_VEX_ERROR_REQUEST_GET_SQL_OBJECTS');
    aTranslationsCodes.push('CTRL_EXPORT_VEX_ERROR_REQUEST_EXPORT_VEX');
    aTranslationsCodes.push('CTRL_EXPORT_VEX_SELECT_DB');

    this.$translate_(aTranslationsCodes).then(function (aTranslations) {
        this_['oTranslations'] = aTranslations;
    });
};



// Étape Selection objets vMap

/**
 * Load the avaliable databases list
 * @returns {defer.promise}
 * @private
 */
nsVmap.exportVexCtrl.prototype.loadVMapObjects_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.loadVMapObjects_");

    var this_ = this;
    var deferred = this.$q_.defer();

    // Chargement Ajax des objets vMap
    this.getVMapObjects_().then(function (aVmapObjects) {

        var aMaps = [];
        var aCalques = [];
        var aBos = [];
        var aVm4msLayers = [];

        // Ajout des couches
        for (var i = 0; i < aVmapObjects.length; i++) {
            if (aVmapObjects[i]['type'] === 'map') {
                aMaps.push({
                    'type': 'map',
                    'map_id': aVmapObjects[i]['map_id'],
                    'name': aVmapObjects[i]['name'],
                    'properties_': aVmapObjects[i]
                });

                // Ajout des calques
                if (goog.isArray(aVmapObjects[i]['calques'])) {
                    for (var ii = 0; ii < aVmapObjects[i]['calques'].length; ii++) {
                        if (aVmapObjects[i]['calques'][ii]['type'] === 'calque') {
                            aCalques.push({
                                'type': 'calque',
                                'map_id': aVmapObjects[i]['map_id'],
                                'layer_id': aVmapObjects[i]['calques'][ii]['layer_id'],
                                'name': aVmapObjects[i]['calques'][ii]['name'],
                                'properties_': aVmapObjects[i]['calques'][ii]
                            });
                        }

                        // Ajout des objets métier
                        if (goog.isArray(aVmapObjects[i]['calques'][ii]['business_objects'])) {
                            for (var iii = 0; iii < aVmapObjects[i]['calques'][ii]['business_objects'].length; iii++) {
                                if (aVmapObjects[i]['calques'][ii]['business_objects'][iii]['type'] === 'business_object') {
                                    aBos.push({
                                        'type': 'business_object',
                                        'map_id': aVmapObjects[i]['map_id'],
                                        'layer_id': aVmapObjects[i]['calques'][ii]['layer_id'],
                                        'business_object_id': aVmapObjects[i]['calques'][ii]['business_objects'][iii]['name'],
                                        'properties_': aVmapObjects[i]['calques'][ii]['business_objects'][iii]
                                    });
                                }
                            }
                        }

                        // Ajout des couches vm4ms
                        if (goog.isArray(aVmapObjects[i]['calques'][ii]['vm4ms_layers'])) {
                            for (var iii = 0; iii < aVmapObjects[i]['calques'][ii]['vm4ms_layers'].length; iii++) {
                                if (aVmapObjects[i]['calques'][ii]['vm4ms_layers'][iii]['type'] === 'vm4ms_layer') {
                                    aVm4msLayers.push({
                                        'type': 'vm4ms_layer',
                                        'map_id': aVmapObjects[i]['map_id'],
                                        'layer_id': aVmapObjects[i]['calques'][ii]['layer_id'],
                                        'name': aVmapObjects[i]['calques'][ii]['vm4ms_layers'][iii]['name'],
                                        'properties_': aVmapObjects[i]['calques'][ii]['vm4ms_layers'][iii]
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }

        this_.$scope_['oVmapObjects']['maps'] = aMaps;
        this_.$scope_['oVmapObjects']['calques'] = aCalques;
        this_.$scope_['oVmapObjects']['business_objects'] = aBos;
        this_.$scope_['oVmapObjects']['vm4ms_layers'] = aVm4msLayers;
        deferred.resolve();
    });

    return deferred.promise;
};

/**
 * Chargement de la liste des objets vMap
 * @returns {defer.promise}
 */
nsVmap.exportVexCtrl.prototype.getVMapObjects_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.getVMapObjects_");

    var this_ = this;
    var deferred = this.$q_.defer();

    ajaxRequest({
        'method': 'GET',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vmap/vex/vmap_objects',
        'headers': {
            'Accept': 'application/json'
        },
        'scope': this.$scope_,
        'success': function (response) {

            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_VMAP_OBJETS'], "error");
                deferred.reject();
                return null;
            }
            if (goog.isDefAndNotNull(response['data'])) {
                if (goog.isDefAndNotNull(response['data']['errorMessage'])) {
                    angular.element(vitisApp.appMainDrtv).scope()["modalWindow"]("dialog", "Erreur serveur", {
                        "className": "modal-danger",
                        "message": response['data']['errorMessage']
                    });
                    return null;
                }
            }
            if (response['data']['status'] !== 1) {
                $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_VMAP_OBJETS'], "error");
                deferred.reject();
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['vmap_objects'])) {
                $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_VMAP_OBJETS'], "error");
                deferred.reject();
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['vmap_objects'][0])) {
                $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_VMAP_OBJETS'], "error");
                deferred.reject();
                return null;
            }

            deferred.resolve(response['data']['vmap_objects']);

        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_VMAP_OBJETS'], "error");
            deferred.reject();
        }
    });

    return deferred.promise;
};

/**
 * Load the treeview to select vMap objects
 */
nsVmap.exportVexCtrl.prototype.loadVMapObjectsTreeview_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.loadVMapObjectsTreeview_");

    var this_ = this;

    $('#export-vex-vmap-objects-treeview')['treeview']({
        'data': this.getTreeviewDataFromVMapObjects_(),
        'onNodeChecked': function (event, oNode) {
            this_.onVMapObjectsTreeviewUpdate_('nodeChecked', oNode);
        },
        'onNodeCollapsed': function (event, oNode) {
            this_.onVMapObjectsTreeviewUpdate_('nodeCollapsed', oNode);
        },
        'onNodeExpanded': function (event, oNode) {
            this_.onVMapObjectsTreeviewUpdate_('nodeExpanded', oNode);
        },
        'onNodeUnchecked': function (event, oNode) {
            this_.onVMapObjectsTreeviewUpdate_('nodeUnchecked', oNode);
        },
        'expandIcon': '',
        'collapseIcon': '',
        'showBorder': false,
        'showCheckbox': true
    });
};

/**
 * Get the treeview formed objects from scope.oVmapObjects
 * @returns {Array}
 */
nsVmap.exportVexCtrl.prototype.getTreeviewDataFromVMapObjects_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.getTreeviewDataFromVMapObjects_");

    var aData = [];
    var oMap;

    if (goog.isArray(this.$scope_['oVmapObjects']['maps'])) {
        for (var i = 0; i < this.$scope_['oVmapObjects']['maps'].length; i++) {

            // Cartes
            oMap = {
                'text': 'Carte: ' + this.$scope_['oVmapObjects']['maps'][i]['name'],
                'icon': 'icon-map',
                'selectable': false,
                'state': {
                    'checked': false,
                    'expanded': false
                },
                'properties_': this.$scope_['oVmapObjects']['maps'][i],
                'nodes': this.getTreeviewCalquesFromMap_(this.$scope_['oVmapObjects']['maps'][i])
            };

            aData.push(oMap);
        }
    } else {
        console.error('oVmapObjects.maps undefined');
    }

    return aData;
};

/**
 * Get the treeview formed calques from the given map
 * @param {object} oMap
 * @returns {Array}
 */
nsVmap.exportVexCtrl.prototype.getTreeviewCalquesFromMap_ = function (oMap) {
    this.$log_.info("nsVmap.exportVexCtrl.getTreeviewCalqueFromMap_");

    var aCalques = [], oCalque;
    for (var i = 0; i < this.$scope_['oVmapObjects']['calques'].length; i++) {
        if (this.$scope_['oVmapObjects']['calques'][i]['map_id'] === oMap['map_id']) {

            var aVm4msLayers = this.getTreeviewVm4msLayersFromCalque_(this.$scope_['oVmapObjects']['calques'][i]);
            var aBos = this.getTreeviewBOsFromCalque_(this.$scope_['oVmapObjects']['calques'][i]);

            oCalque = {
                'text': 'Calque: ' + this.$scope_['oVmapObjects']['calques'][i]['name'],
                'icon': 'icon-layers2',
                'selectable': false,
                'state': {
                    'checked': false,
                    'expanded': false
                },
                'properties_': this.$scope_['oVmapObjects']['calques'][i],
                'nodes': goog.array.join(aVm4msLayers, aBos)
            };

            if (!goog.isArray(aCalques)) {
                aCalques = [];
            }
            aCalques.push(oCalque);
        }
    }

    return aCalques;
};

/**
 * Get the treeview formed vm4ms layers from a calque
 * @param {object} oCalque
 * @returns {Array}
 */
nsVmap.exportVexCtrl.prototype.getTreeviewVm4msLayersFromCalque_ = function (oCalque) {
    this.$log_.info("nsVmap.exportVexCtrl.getTreeviewVm4msLayersFromCalque_");

    var aVm4msLayers = [], oVm4msLayer;
    for (var i = 0; i < this.$scope_['oVmapObjects']['vm4ms_layers'].length; i++) {
        if (this.$scope_['oVmapObjects']['vm4ms_layers'][i]['layer_id'] === oCalque['layer_id']
            && this.$scope_['oVmapObjects']['vm4ms_layers'][i]['map_id'] === oCalque['map_id']) {

            oVm4msLayer = {
                'text': 'Couche Mapserver: ' + this.$scope_['oVmapObjects']['vm4ms_layers'][i]['name'],
                'icon': 'icon-layers',
                'selectable': false,
                'state': {
                    'checked': false,
                    'expanded': false
                },
                'nodes': [],
                'properties_': this.$scope_['oVmapObjects']['vm4ms_layers'][i]
            };

            if (!goog.isArray(aVm4msLayers)) {
                aVm4msLayers = [];
            }
            aVm4msLayers.push(oVm4msLayer);
        }
    }

    return aVm4msLayers;
};

/**
 * Get the treeview formed business objects from a calque
 * @param {object} oCalque
 * @returns {Array}
 */
nsVmap.exportVexCtrl.prototype.getTreeviewBOsFromCalque_ = function (oCalque) {
    this.$log_.info("nsVmap.exportVexCtrl.getTreeviewBOsFromCalque_");

    var aBOs = [], oBO;
    for (var i = 0; i < this.$scope_['oVmapObjects']['business_objects'].length; i++) {
        if (this.$scope_['oVmapObjects']['business_objects'][i]['layer_id'] === oCalque['layer_id']
            && this.$scope_['oVmapObjects']['business_objects'][i]['map_id'] === oCalque['map_id']) {

            oBO = {
                'text': 'Objet métier: ' + this.$scope_['oVmapObjects']['business_objects'][i]['business_object_id'],
                'icon': 'icon-vmap_business_object',
                'selectable': false,
                'state': {
                    'checked': false,
                    'expanded': false
                },
                'nodes': [],
                'properties_': this.$scope_['oVmapObjects']['business_objects'][i]
            };

            if (!goog.isArray(aBOs)) {
                aBOs = [];
            }
            aBOs.push(oBO);
        }
    }

    return aBOs;
};

/**
 * Function called when a node state is updated
 * @param {string} sEvent
 * @param {object} oNode
 */
nsVmap.exportVexCtrl.prototype.onVMapObjectsTreeviewUpdate_ = function (sEvent, oNode) {
    this.$log_.info("nsVmap.exportVexCtrl.onVMapObjectsTreeviewUpdate_");

    // Sélectionne automatiquement les noeuds ouverts
    if (sEvent === 'nodeCollapsed' || sEvent === 'nodeExpanded') {
        // Sélectionne tous les noeuds ouverts
        var aExpandedNodes = $('#export-vex-vmap-objects-treeview').data('treeview')['getExpanded']();
        for (var i = 0; i < aExpandedNodes.length; i++) {
            if (aExpandedNodes[i]['state']['checked'] === false) {
                $('#export-vex-vmap-objects-treeview').data('treeview')['checkNode'](aExpandedNodes[i]);
            }
        }
        // Dé-sélectionne tous les noeuds fermés
        var aCollapsedNodes = $('#export-vex-vmap-objects-treeview').data('treeview')['getCollapsed']();
        for (var i = 0; i < aCollapsedNodes.length; i++) {
            if (aCollapsedNodes[i]['state']['checked'] === true) {
                $('#export-vex-vmap-objects-treeview').data('treeview')['uncheckNode'](aCollapsedNodes[i]);
            }
        }
    }

    // Ouvre automatiquement les noeuds fermés
    if (sEvent === 'nodeChecked' || sEvent === 'nodeUnchecked') {
        // Ouvre tous les noeuds sélectionnés
        var aCheckedNodes = $('#export-vex-vmap-objects-treeview').data('treeview')['getChecked']();
        for (var i = 0; i < aCheckedNodes.length; i++) {
            if (aCheckedNodes[i]['state']['expanded'] === false) {
                $('#export-vex-vmap-objects-treeview').data('treeview')['expandNode'](aCheckedNodes[i]);
            }
        }
        // Ferme tous les noeuds non sélectionnés
        var aUncheckedNodes = $('#export-vex-vmap-objects-treeview').data('treeview')['getUnchecked']();
        for (var i = 0; i < aUncheckedNodes.length; i++) {
            if (aUncheckedNodes[i]['state']['expanded'] === true) {
                $('#export-vex-vmap-objects-treeview').data('treeview')['collapseNode'](aUncheckedNodes[i]);
            }
        }
    }

    // Ouvre recursivement les enfants du noeud ouvert
    if (sEvent === 'nodeExpanded') {
        // Ouvre tous les enfants
        if (goog.isArray(oNode['nodes'])) {
            for (var i = 0; i < oNode['nodes'].length; i++) {
                if (oNode['nodes'][i]['state']['expanded'] === false) {
                    $('#export-vex-vmap-objects-treeview').data('treeview')['expandNode'](oNode['nodes'][i]['nodeId']);
                }
            }
        }
    }
};

/**
 * Update scope.oSelectedVmapObjects from the treeview data
 */
nsVmap.exportVexCtrl.prototype.updateSelectedVMapObjectsFromTreeviewData_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.updateSelectedVMapObjectsFromTreeviewData_");

    var this_ = this;

    // Vide les listes
    goog.array.clear(this.$scope_['oSelectedVmapObjects']['maps']);
    goog.array.clear(this.$scope_['oSelectedVmapObjects']['calques']);
    goog.array.clear(this.$scope_['oSelectedVmapObjects']['vm4ms_layers']);
    goog.array.clear(this.$scope_['oSelectedVmapObjects']['business_objects']);

    var aCheckedNodes = $('#export-vex-vmap-objects-treeview').data('treeview')['getChecked']();

    for (var i = 0; i < aCheckedNodes.length; i++) {
        if (aCheckedNodes[i]['properties_']['type'] === 'map') {
            this_.$scope_['oSelectedVmapObjects']['maps'].push(aCheckedNodes[i]['properties_']['map_id']);
            goog.array.removeDuplicates(this_.$scope_['oSelectedVmapObjects']['maps']);
        }
        if (aCheckedNodes[i]['properties_']['type'] === 'calque') {
            this_.$scope_['oSelectedVmapObjects']['calques'].push(aCheckedNodes[i]['properties_']['layer_id']);
            goog.array.removeDuplicates(this_.$scope_['oSelectedVmapObjects']['calques']);
        }
        if (aCheckedNodes[i]['properties_']['type'] === 'vm4ms_layer') {
            this_.$scope_['oSelectedVmapObjects']['vm4ms_layers'].push(aCheckedNodes[i]['properties_']['name']);
            goog.array.removeDuplicates(this_.$scope_['oSelectedVmapObjects']['vm4ms_layers']);
        }
        if (aCheckedNodes[i]['properties_']['type'] === 'business_object') {
            this_.$scope_['oSelectedVmapObjects']['business_objects'].push(aCheckedNodes[i]['properties_']['business_object_id']);
            goog.array.removeDuplicates(this_.$scope_['oSelectedVmapObjects']['business_objects']);
        }
    }
};

/**
 * Check if the given vMap objects are valid
 * @returns {defer.promise}
 */
nsVmap.exportVexCtrl.prototype.validateSelectedVMapObjects_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.validateSelectedVMapObjects_");

    var this_ = this;
    var deferred = this.$q_.defer();

    this.updateSelectedVMapObjectsFromTreeviewData_();
    console.log("this.$scope_['oSelectedVmapObjects']: ", this_.$scope_['oSelectedVmapObjects']);
    setTimeout(function () {
        if (goog.isArray(this_.$scope_['oSelectedVmapObjects']['maps']) &&
                goog.isArray(this_.$scope_['oSelectedVmapObjects']['calques']) &&
                goog.isArray(this_.$scope_['oSelectedVmapObjects']['vm4ms_layers']) &&
                goog.isArray(this_.$scope_['oSelectedVmapObjects']['business_objects'])) {
            deferred.resolve();
        }
    });

    return deferred.promise;
};



// Étape web services

/**
 * Load the avaliable web services list
 * @returns {defer.promise}
 * @private
 */
nsVmap.exportVexCtrl.prototype.loadWebServices_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.loadWebServices_");

    var this_ = this;
    var deferred = this.$q_.defer();

    this.getBoWebServices_(this.$scope_['oSelectedVmapObjects']['business_objects']).then(function success(aWebServices) {
        this_.$scope_['aWebServices'] = aWebServices;
        deferred.resolve();
    }, function error() {
        deferred.reject();
    });

    return deferred.promise;
};

/**
 * Make Ajax request to get the web services list
 * @param {array} aBOs
 * @returns {defer.promise}
 */
nsVmap.exportVexCtrl.prototype.getBoWebServices_ = function (aBOs) {
    this.$log_.info("nsVmap.exportVexCtrl.getBoWebServices_");

    var this_ = this;
    var deferred = this.$q_.defer();

    setTimeout(function () {
        if (!goog.isArray(aBOs)) {
            deferred.reject();
            return 0;
        }
        if (!aBOs.length > 0) {
            deferred.reject();
            return 0;
        }

        ajaxRequest({
            'method': 'GET',
            'url': this_['oProperties']['web_server_name'] + '/' + this_['oProperties']['services_alias'] + '/vmap/vex/web_services',
            'headers': {
                'Accept': 'application/json'
            },
            'params': {
                'business_objects': aBOs.join('|')
            },
            'scope': this_.$scope_,
            'success': function (response) {

                if (!goog.isDefAndNotNull(response['data'])) {
                    $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_WEB_SERVICES'], "error");
                    deferred.reject();
                    return null;
                }
                if (goog.isDefAndNotNull(response['data'])) {
                    if (goog.isDefAndNotNull(response['data']['errorMessage'])) {
                        angular.element(vitisApp.appMainDrtv).scope()["modalWindow"]("dialog", "Erreur serveur", {
                            "className": "modal-danger",
                            "message": response['data']['errorMessage']
                        });
                        deferred.reject();
                        return null;
                    }
                }
                if (response['data']['status'] !== 1) {
                    $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_WEB_SERVICES'], "error");
                    deferred.reject();
                    return null;
                }
                if (!goog.isDefAndNotNull(response['data']['web_services'])) {
                    $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_WEB_SERVICES'], "error");
                    deferred.reject();
                    return null;
                }
                if (!goog.isDefAndNotNull(response['data']['web_services'][0])) {
                    $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_NO_RESULT_REQUEST_GET_WEB_SERVICES'], "success");
                    deferred.reject();
                    return null;
                }

                deferred.resolve(response['data']['web_services']);

            },
            'error': function (response) {
                $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_WEB_SERVICES'], "error");
                deferred.reject();
            }
        });
    });

    return deferred.promise;
};

/**
 * Load the treeview to select web services
 */
nsVmap.exportVexCtrl.prototype.loadWebServicesTreeview_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.loadWebServicesTreeview_");

    var this_ = this;

    $('#export-vex-web-services-treeview')['treeview']({
        'data': this.getTreeviewDataFromWebServices_(),
        'onNodeChecked': function (event, oNode) {
            this_.onWebServicesTreeviewUpdate_('nodeChecked', oNode);
        },
        'onNodeCollapsed': function (event, oNode) {
            this_.onWebServicesTreeviewUpdate_('nodeCollapsed', oNode);
        },
        'onNodeExpanded': function (event, oNode) {
            this_.onWebServicesTreeviewUpdate_('nodeExpanded', oNode);
        },
        'onNodeUnchecked': function (event, oNode) {
            this_.onWebServicesTreeviewUpdate_('nodeUnchecked', oNode);
        },
        'expandIcon': '',
        'collapseIcon': '',
        'showBorder': false,
        'showCheckbox': true
    });
};

/**
 * Get the treeview formed objects from scope.aWebServices
 * @returns {Array}
 */
nsVmap.exportVexCtrl.prototype.getTreeviewDataFromWebServices_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.getTreeviewDataFromWebServices_");

    var aData = [];
    var oWebService;

    if (goog.isArray(this.$scope_['aWebServices'])) {
        for (var i = 0; i < this.$scope_['aWebServices'].length; i++) {

            oWebService = {
                'text': this.$scope_['aWebServices'][i]['name'],
                'icon': 'glyphicon glyphicon-folder-open',
                'selectable': false,
                'state': {
                    'checked': false,
                    'expanded': false
                },
                'properties_': {
                    'type': 'folder',
                    'name': this.$scope_['aWebServices'][i]['name']
                },
                'nodes': this.getTreeviewFilesFromWebService_(this.$scope_['aWebServices'][i])
            };

            aData.push(oWebService);
        }
    } else {
        console.error('aWebServices undefined');
    }

    return aData;
};

/**
 * Get the treeview formed files from the given web service
 * @param {object} oWebService
 * @returns {Array}
 */
nsVmap.exportVexCtrl.prototype.getTreeviewFilesFromWebService_ = function (oWebService) {
    this.$log_.info("nsVmap.exportVexCtrl.getTreeviewFilesFromWebService_");

    var aFiles = [];
    var oFile;
    if (goog.isArray(oWebService['files'])) {
        for (var i = 0; i < oWebService['files'].length; i++) {
            oFile = {
                'text': oWebService['files'][i],
                'selectable': false,
                'properties_': {
                    'type': 'file'
                }
            };
            aFiles.push(oFile);
        }
    }

    return aFiles;
};

/**
 * Function called when a node state is updated
 * @param {string} sEvent
 * @param {object} oNode
 */
nsVmap.exportVexCtrl.prototype.onWebServicesTreeviewUpdate_ = function (sEvent, oNode) {
    this.$log_.info("nsVmap.exportVexCtrl.onWebServicesTreeviewUpdate_");

    // Ignore les événements venus des fichiers
    if (oNode['properties_']['type'] === 'file') {
        if (sEvent === 'nodeUnchecked') {
            $('#export-vex-web-services-treeview').data('treeview')['checkNode'](oNode['nodeId'], {'silent': true});
        }
        return 0;
    }

    if (oNode['properties_']['type'] === 'folder') {
        if (sEvent === 'nodeChecked') {
            $('#export-vex-web-services-treeview').data('treeview')['expandNode'](oNode['nodeId']);
        }
        if (sEvent === 'nodeUnchecked') {
            $('#export-vex-web-services-treeview').data('treeview')['collapseNode'](oNode['nodeId']);
        }
    }

    // Sélectionne tous les noeuds ouverts
    var aExpandedNodes = $('#export-vex-web-services-treeview').data('treeview')['getExpanded']();
    for (var i = 0; i < aExpandedNodes.length; i++) {
        if (aExpandedNodes[i]['properties_']['type'] === 'folder') {
            if (aExpandedNodes[i]['state']['checked'] === false) {
                $('#export-vex-web-services-treeview').data('treeview')['checkNode'](aExpandedNodes[i]);
            }
            // Sélectionne les enfants
            if (goog.isArray(aExpandedNodes[i]['nodes'])) {
                for (var ii = 0; ii < aExpandedNodes[i]['nodes'].length; ii++) {
                    if (aExpandedNodes[i]['nodes'][ii]['state']['checked'] === false) {
                        $('#export-vex-web-services-treeview').data('treeview')['checkNode'](aExpandedNodes[i]['nodes'][ii]['nodeId'], {'silent': true});
                    }
                }
            }
        }
    }

    // Dé-sélectionne tous les noeuds fermés
    var aCollapsedNodes = $('#export-vex-web-services-treeview').data('treeview')['getCollapsed']();
    for (var i = 0; i < aCollapsedNodes.length; i++) {
        if (aCollapsedNodes[i]['properties_']['type'] === 'folder') {
            if (aCollapsedNodes[i]['state']['checked'] === true) {
                $('#export-vex-web-services-treeview').data('treeview')['uncheckNode'](aCollapsedNodes[i]);
            }
            // Dé-sélectionne les enfants
            if (goog.isArray(aCollapsedNodes[i]['nodes'])) {
                for (var ii = 0; ii < aCollapsedNodes[i]['nodes'].length; ii++) {
                    if (aCollapsedNodes[i]['nodes'][ii]['state']['checked'] === true) {
                        $('#export-vex-web-services-treeview').data('treeview')['uncheckNode'](aCollapsedNodes[i]['nodes'][ii]['nodeId'], {'silent': true});
                    }
                }
            }
        }
    }

};

/**
 * Update scope.aSelectedWebServices from the treeview data
 */
nsVmap.exportVexCtrl.prototype.updateSelectedWebServicesFromTreeviewData_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.updateSelectedWebServicesFromTreeviewData_");

    // Vide les listes
    goog.array.clear(this.$scope_['aSelectedWebServices']);

    var aCheckedNodes = $('#export-vex-web-services-treeview').data('treeview')['getChecked']();

    for (var i = 0; i < aCheckedNodes.length; i++) {
        if (goog.isDefAndNotNull(aCheckedNodes[i]['properties_'])) {
            if (goog.isDefAndNotNull(aCheckedNodes[i]['properties_']['type'])) {
                if (aCheckedNodes[i]['properties_']['type'] === 'folder') {
                    this.$scope_['aSelectedWebServices'].push(aCheckedNodes[i]['properties_']['name']);
                }
            }
        }
    }
};

/**
 * Check if the given Web services are valid
 * @returns {defer.promise}
 */
nsVmap.exportVexCtrl.prototype.validateSelectedWebServices_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.validateSelectedWebServices_");

    var this_ = this;
    var deferred = this.$q_.defer();

    this.updateSelectedWebServicesFromTreeviewData_();
    setTimeout(function () {
        console.log("this.$scope_['aSelectedWebServices']: ", this_.$scope_['aSelectedWebServices']);
        deferred.resolve();
    });

    return deferred.promise;
};



// Étape SQL

/**
 * Load the avaliable SQL objects list
 * @returns {defer.promise}
 * @private
 */
nsVmap.exportVexCtrl.prototype.loadSQLObjects_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.loadSQLObjects_");

    var this_ = this;
    var deferred = this.$q_.defer();

    // Vide les anciennes valeurs
    if (goog.isDefAndNotNull(this.selectedDatabaseWatcher)) {
        this.selectedDatabaseWatcher();
    }
    this.$scope_['sSelectedDatabase'] = null;
    goog.array.clear(this_.$scope_['aAvaliableDatabases']);
    if (goog.isDefAndNotNull($('#export-vex-sql-objects-treeview')['treeview'])) {
        $('#export-vex-sql-objects-treeview')['treeview']('remove');
    }


    // Ajoute les nouvelles valeurs
    this.geAvaliableDatabases_().then(function success(aAvaliableDatabases) {

        // set scope.aAvaliableDatabases
        for (var i = 0; i < aAvaliableDatabases.length; i++) {
            this_.$scope_['aAvaliableDatabases'].push(aAvaliableDatabases[i]['database']);
        }

        // watch scope.sSelectedDatabase et charge les objets correspondants
        this_.selectedDatabaseWatcher = this_.$scope_.$watch('sSelectedDatabase', function () {
            if (goog.isDefAndNotNull(this_.$scope_['sSelectedDatabase'])) {
                this_.getSQLObjects_(this_.$scope_['sSelectedDatabase']).then(function (oSqlObjects) {
                    this_.$scope_['aSQLObjects'] = oSqlObjects;

                    // Vérifie que les couches utilisent bien cette base de données
                    this_.checkLayersDatabase_();

                    // Vérifie que les objets métiers utilisent bien cette base de données
                    this_.checkBOsDatabase_();

                    // Charge le treeview
                    this_.loadSQLObjectsTreeview_();
                });
            }
        });

        // Trouve la base de données utilisée par les objets métier et les couches vm4ms
        var sDefaultDatabase = this_.findDefaultDatabase_();
        if (goog.isDefAndNotNull(sDefaultDatabase)) {
            this_.$scope_['sSelectedDatabase'] = sDefaultDatabase;
        }

        deferred.resolve();
    });

    return deferred.promise;
};

/**
 * Make Ajax request to get the avaliable databases
 * @returns {defer.promise}
 */
nsVmap.exportVexCtrl.prototype.geAvaliableDatabases_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.geAvaliableDatabases_");

    var this_ = this;
    var deferred = this.$q_.defer();

    ajaxRequest({
        'method': 'GET',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vitis/genericquerys/databases',
        'headers': {
            'Accept': 'application/json'
        },
        'scope': this.$scope_,
        'success': function (response) {

            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_SQL_DATABASES'], "error");
                deferred.reject();
                return null;
            }
            if (goog.isDefAndNotNull(response['data'])) {
                if (goog.isDefAndNotNull(response['data']['errorMessage'])) {
                    angular.element(vitisApp.appMainDrtv).scope()["modalWindow"]("dialog", "Erreur serveur", {
                        "className": "modal-danger",
                        "message": response['data']['errorMessage']
                    });
                    deferred.reject();
                    return null;
                }
            }
            if (!goog.isDefAndNotNull(response['data']['genericquerys'])) {
                $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_SQL_DATABASES'], "error");
                deferred.reject();
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['genericquerys'][0])) {
                $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_SQL_DATABASES'], "error");
                console.error('error');
                return null;
            }

            deferred.resolve(response['data']['genericquerys']);

        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_SQL_DATABASES'], "error");
            deferred.reject();
        }
    });

    return deferred.promise;
};

/**
 * Make Ajax request to get schemas, tables, views list
 * @param {string} sDatabase
 * @returns {defer.promise}
 */
nsVmap.exportVexCtrl.prototype.getSQLObjects_ = function (sDatabase) {
    this.$log_.info("nsVmap.exportVexCtrl.getSQLObjects_");

    var this_ = this;
    var deferred = this.$q_.defer();

    ajaxRequest({
        'method': 'GET',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vmap/vex/sql_objects',
        'headers': {
            'Accept': 'application/json'
        },
        'params': {
            'database': sDatabase
        },
        'scope': this.$scope_,
        'success': function (response) {

            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_SQL_OBJECTS'], "error");
                deferred.reject();
                return null;
            }
            if (goog.isDefAndNotNull(response['data'])) {
                if (goog.isDefAndNotNull(response['data']['errorMessage'])) {
                    angular.element(vitisApp.appMainDrtv).scope()["modalWindow"]("dialog", "Erreur serveur", {
                        "className": "modal-danger",
                        "message": response['data']['errorMessage']
                    });
                    deferred.reject();
                    return null;
                }
            }
            if (response['data']['status'] !== 1) {
                $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_SQL_OBJECTS'], "error");
                deferred.reject();
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['sql_objects'])) {
                $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_SQL_OBJECTS'], "error");
                deferred.reject();
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['sql_objects'][0])) {
                $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_SQL_OBJECTS'], "error");
                deferred.reject();
                return null;
            }

            deferred.resolve(response['data']['sql_objects']);

        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_SQL_OBJECTS'], "error");
            deferred.reject();
        }
    });

    return deferred.promise;
};

/**
 * Load the treeview to select sql objects
 */
nsVmap.exportVexCtrl.prototype.loadSQLObjectsTreeview_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.loadSQLObjectsTreeview_");

    var this_ = this;

    $('#export-vex-sql-objects-treeview')['treeview']({
        'data': this.getTreeviewDataFromSQLObjects_(),
        'onNodeChecked': function (event, oNode) {
            this_.onSQLObjcetsTreeviewUpdate_('nodeChecked', oNode);
        },
        'onNodeCollapsed': function (event, oNode) {
            this_.onSQLObjcetsTreeviewUpdate_('nodeCollapsed', oNode);
        },
        'onNodeExpanded': function (event, oNode) {
            this_.onSQLObjcetsTreeviewUpdate_('nodeExpanded', oNode);
        },
        'onNodeUnchecked': function (event, oNode) {
            this_.onSQLObjcetsTreeviewUpdate_('nodeUnchecked', oNode);
        },
        'expandIcon': '',
        'collapseIcon': '',
        'showBorder': false,
        'showCheckbox': true
    });
};

/**
 * Get the treeview formed objects from scope.aSQLObjects
 * @returns {Array}
 */
nsVmap.exportVexCtrl.prototype.getTreeviewDataFromSQLObjects_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.getTreeviewDataFromSQLObjects_");

    var aData = [];
    var oSchema;

    if (goog.isArray(this.$scope_['aSQLObjects'])) {
        for (var i = 0; i < this.$scope_['aSQLObjects'].length; i++) {

            oSchema = {
                'text': this.$scope_['aSQLObjects'][i]['name'],
                'icon': 'icon-tree',
                'selectable': false,
                'state': {
                    'checked': false,
                    'expanded': false
                },
                'properties_': {
                    'type': 'schema',
                    'name': this.$scope_['aSQLObjects'][i]['name']
                },
                'nodes': goog.array.concat(this.getTreeviewTablesFromSchema_(this.$scope_['aSQLObjects'][i]), this.getTreeviewViewsFromSchema_(this.$scope_['aSQLObjects'][i]), this.getTreeviewSequencesFromSchema_(this.$scope_['aSQLObjects'][i]))
            };

            aData.push(oSchema);
        }
    } else {
        console.error('aSQLObjects undefined');
    }

    // Sélectionne automatiquement les talbes mentionnées dans les couches vm4ms
    aData = this.autoSelectVm4msLayersTables_(aData);

    // Sélectionne automatiquement les talbes mentionnées dans les objets métier
    aData = this.autoSelectBusinessObjectsTables_(aData);

    return aData;
};

/**
 * Sélectionne automatiquement les schémas et tables utilisés dans les couches
 * @param {array} aData
 */
nsVmap.exportVexCtrl.prototype.autoSelectVm4msLayersTables_ = function (aData) {
    this.$log_.info("nsVmap.exportVexCtrl.autoSelectVm4msLayersTables_");

    var sSelectedDatabase = this.$scope_['sSelectedDatabase'];
    var aVm4msLayers = this.$scope_['oVmapObjects']['vm4ms_layers'];
    var aSelectedVm4msLayers = this.$scope_['oSelectedVmapObjects']['vm4ms_layers'];

    var aUsedSchemas = [];
    var aUsedTables = [];

    // Stoke la liste des schémas et tables/vues
    if (goog.isArray(aVm4msLayers) && goog.isArray(aSelectedVm4msLayers)) {
        for (var i = 0; i < aVm4msLayers.length; i++) {
            if (aSelectedVm4msLayers.indexOf(aVm4msLayers[i]['name']) !== -1) {
                if (goog.isDefAndNotNull(aVm4msLayers[i]['properties_'])) {
                    if (aVm4msLayers[i]['properties_']['database'] === sSelectedDatabase) {
                        // Schemas
                        if (aUsedSchemas.indexOf(aVm4msLayers[i]['properties_']['schema']) === -1) {
                            aUsedSchemas.push(aVm4msLayers[i]['properties_']['schema']);
                        }
                        // Tables/vues
                        if (aUsedTables.indexOf(aVm4msLayers[i]['properties_']['table']) === -1) {
                            aUsedTables.push(aVm4msLayers[i]['properties_']['table']);
                        }
                    }
                }
            }
        }
    }

    // Sélectionne les schemas, tables, vues
    for (var i = 0; i < aData.length; i++) {
        if (goog.isDefAndNotNull(aData[i]['properties_'])) {
            if (aData[i]['properties_']['type'] === 'schema') {
                if (aUsedSchemas.indexOf(aData[i]['properties_']['name']) !== -1) {
                    aData[i]['state']['checked'] = true;
                    aData[i]['state']['expanded'] = true;

                    // Sélectionne les tables, vues
                    if (goog.isArray(aData[i]['nodes'])) {
                        for (var ii = 0; ii < aData[i]['nodes'].length; ii++) {
                            if (goog.isDefAndNotNull(aData[i]['nodes'][ii]['properties_'])) {
                                if (aData[i]['nodes'][ii]['properties_']['type'] === 'table' ||
                                        aData[i]['nodes'][ii]['properties_']['type'] === 'view') {
                                    if (aUsedTables.indexOf(aData[i]['nodes'][ii]['properties_']['name']) !== -1) {
                                        aData[i]['nodes'][ii]['state']['checked'] = true;
                                        aData[i]['nodes'][ii]['state']['expanded'] = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return aData;
};

/**
 * Sélectionne automatiquement les schémas et tables utilisés dans les objets métier
 * @param {array} aData
 */
nsVmap.exportVexCtrl.prototype.autoSelectBusinessObjectsTables_ = function (aData) {
    this.$log_.info("nsVmap.exportVexCtrl.autoSelectBusinessObjectsTables_");

    var sSelectedDatabase = this.$scope_['sSelectedDatabase'];
    var aBusinessObjects = this.$scope_['oVmapObjects']['business_objects'];
    var aSelectedaBusinessObjects = this.$scope_['oSelectedVmapObjects']['business_objects'];

    var aUsedSchemas = [];
    var aUsedTables = [];

    // Stoke la liste des schémas et tables/vues
    if (goog.isArray(aBusinessObjects) && goog.isArray(aSelectedaBusinessObjects)) {
        for (var i = 0; i < aBusinessObjects.length; i++) {
            if (aSelectedaBusinessObjects.indexOf(aBusinessObjects[i]['business_object_id']) !== -1) {
                if (goog.isDefAndNotNull(aBusinessObjects[i]['properties_'])) {
                    if (aBusinessObjects[i]['properties_']['database'] === sSelectedDatabase) {
                        // Schemas
                        if (aUsedSchemas.indexOf(aBusinessObjects[i]['properties_']['schema']) === -1) {
                            aUsedSchemas.push(aBusinessObjects[i]['properties_']['schema']);
                        }
                        // Tables/vues
                        if (aUsedTables.indexOf(aBusinessObjects[i]['properties_']['table']) === -1) {
                            aUsedTables.push(aBusinessObjects[i]['properties_']['table']);
                        }
                    }
                }
            }
        }
    }

    // Sélectionne les schemas, talbes, vues
    for (var i = 0; i < aData.length; i++) {
        if (goog.isDefAndNotNull(aData[i]['properties_'])) {
            if (aData[i]['properties_']['type'] === 'schema') {
                if (aUsedSchemas.indexOf(aData[i]['properties_']['name']) !== -1) {
                    aData[i]['state']['checked'] = true;
                    aData[i]['state']['expanded'] = true;

                    // Sélectionne les tables/vues
                    if (goog.isArray(aData[i]['nodes'])) {
                        for (var ii = 0; ii < aData[i]['nodes'].length; ii++) {
                            if (goog.isDefAndNotNull(aData[i]['nodes'][ii]['properties_'])) {
                                if (aData[i]['nodes'][ii]['properties_']['type'] === 'table' ||
                                        aData[i]['nodes'][ii]['properties_']['type'] === 'view') {
                                    if (aUsedTables.indexOf(aData[i]['nodes'][ii]['properties_']['name']) !== -1) {
                                        aData[i]['nodes'][ii]['state']['checked'] = true;
                                        aData[i]['nodes'][ii]['state']['expanded'] = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return aData;
};

/**
 * Vérifie que toutes les couches vm4ms utilisent bien cette base de données et affiche un warning en cas contraire
 * @returns {boolean}
 */
nsVmap.exportVexCtrl.prototype.checkLayersDatabase_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.checkLayersDatabase_");

    var sSelectedDatabase = this.$scope_['sSelectedDatabase'];
    var aVm4msLayers = this.$scope_['oVmapObjects']['vm4ms_layers'];
    var aSelectedVm4msLayers = this.$scope_['oSelectedVmapObjects']['vm4ms_layers'];

    var bReturn = false;
    if (goog.isArray(aVm4msLayers) && goog.isArray(aSelectedVm4msLayers)) {
        bReturn = true;
        for (var i = 0; i < aVm4msLayers.length; i++) {
            if (aSelectedVm4msLayers.indexOf(aVm4msLayers[i]['name']) !== -1) {
                if (goog.isDefAndNotNull(aVm4msLayers[i]['properties_'])) {
                    if (aVm4msLayers[i]['properties_']['database'] !== sSelectedDatabase) {
                        $.notify('La couche ' + aVm4msLayers[i]['name'] + ' utilise une autre base de données');
                        bReturn = false;
                    }
                }
            }
        }
    }

    return bReturn;
};

/**
 * Vérifie que tous les objets métier utilisent bien cette base de données et affiche un warning en cas contraire
 * @returns {boolean}
 */
nsVmap.exportVexCtrl.prototype.checkBOsDatabase_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.checkBOsDatabase_");

    var sSelectedDatabase = this.$scope_['sSelectedDatabase'];
    var aBusinessObjects = this.$scope_['oVmapObjects']['business_objects'];
    var aSelectedaBusinessObjects = this.$scope_['oSelectedVmapObjects']['business_objects'];

    var bReturn = false;
    if (goog.isArray(aBusinessObjects) && goog.isArray(aSelectedaBusinessObjects)) {
        bReturn = true;
        for (var i = 0; i < aBusinessObjects.length; i++) {
            if (aSelectedaBusinessObjects.indexOf(aBusinessObjects[i]['business_object_id']) !== -1) {
                if (goog.isDefAndNotNull(aBusinessObjects[i]['properties_'])) {
                    if (aBusinessObjects[i]['properties_']['database'] !== sSelectedDatabase) {
                        $.notify('L\'objet métier ' + aBusinessObjects[i]['business_object_id'] + ' utilise une autre base de données');
                        bReturn = false;
                    }
                }
            }
        }
    }

    return bReturn;
};

/**
 * Trouve la base de données utilisée par les objets métiers et couches vm4ms
 * si la valeur difère, retourne null
 * @returns {null|string}
 */
nsVmap.exportVexCtrl.prototype.findDefaultDatabase_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.findDefaultDatabase_");

    var sDatabase = null;
    var aBusinessObjects = this.$scope_['oVmapObjects']['business_objects'];
    var aSelectedaBusinessObjects = this.$scope_['oSelectedVmapObjects']['business_objects'];
    var aVm4msLayers = this.$scope_['oVmapObjects']['vm4ms_layers'];
    var aSelectedVm4msLayers = this.$scope_['oSelectedVmapObjects']['vm4ms_layers'];

    // Recherche dans les couches vm4ms
    if (goog.isArray(aVm4msLayers) && goog.isArray(aSelectedVm4msLayers)) {
        for (var i = 0; i < aVm4msLayers.length; i++) {
            if (aSelectedVm4msLayers.indexOf(aVm4msLayers[i]['name']) !== -1) {
                if (goog.isDefAndNotNull(aVm4msLayers[i]['properties_'])) {
                    if (!goog.isDefAndNotNull(sDatabase)) {
                        // Première valeur
                        sDatabase = aVm4msLayers[i]['properties_']['database'];
                    } else {
                        // Si la valeur difère c'est qu'il y a multiple databases, alors return null
                        if (aVm4msLayers[i]['properties_']['database'] !== sDatabase) {
                            return null;
                        }
                    }
                }
            }
        }
    }

    // Recherche dans les objets métier
    if (goog.isArray(aBusinessObjects) && goog.isArray(aSelectedaBusinessObjects)) {
        for (var i = 0; i < aBusinessObjects.length; i++) {
            if (aSelectedaBusinessObjects.indexOf(aBusinessObjects[i]['business_object_id']) !== -1) {
                if (goog.isDefAndNotNull(aBusinessObjects[i]['properties_'])) {
                    if (!goog.isDefAndNotNull(sDatabase)) {
                        // Première valeur
                        sDatabase = aBusinessObjects[i]['properties_']['database'];
                    } else {
                        // Si la valeur difère c'est qu'il y a multiple databases, alors return null
                        if (aBusinessObjects[i]['properties_']['database'] !== sDatabase) {
                            return null;
                        }
                    }
                }
            }
        }
    }

    return sDatabase;
};

/**
 * Get the treeview formed tables from the given sql schema
 * @param {object} oSchema
 * @returns {Array}
 */
nsVmap.exportVexCtrl.prototype.getTreeviewTablesFromSchema_ = function (oSchema) {
    this.$log_.info("nsVmap.exportVexCtrl.getTreeviewTablesFromSchema_");

    var aFiles = [];
    var oFile;
    if (goog.isArray(oSchema['tables'])) {
        for (var i = 0; i < oSchema['tables'].length; i++) {
            oFile = {
                'text': oSchema['tables'][i],
                'icon': 'icon-table',
                'selectable': false,
                'state': {
                    'checked': false,
                    'expanded': false
                },
                'nodes': [{
                        'text': 'Modèle',
                        'icon': 'icon-code',
                        'selectable': false,
                        'state': {
                            'checked': true,
                            'expanded': false
                        },
                        'nodes': [],
                        'properties_': {
                            'type': 'model'
                        }
                    }, {
                        'text': 'Données',
                        'icon': 'icon-format_list_bulleted',
                        'selectable': false,
                        'state': {
                            'checked': false,
                            'expanded': false
                        },
                        'nodes': [],
                        'properties_': {
                            'type': 'data'
                        }
                    }],
                'properties_': {
                    'type': 'table',
                    'name': oSchema['tables'][i]
                }
            };
            aFiles.push(oFile);
        }
    }

    return aFiles;
};

/**
 * Get the treeview formed views from the given sql schema
 * @param {object} oSchema
 * @returns {Array}
 */
nsVmap.exportVexCtrl.prototype.getTreeviewViewsFromSchema_ = function (oSchema) {
    this.$log_.info("nsVmap.exportVexCtrl.getTreeviewViewsFromSchema_");

    var aFiles = [];
    var oFile;
    if (goog.isArray(oSchema['views'])) {
        for (var i = 0; i < oSchema['views'].length; i++) {
            oFile = {
                'text': 'Vue: ' + oSchema['views'][i],
                'icon': 'icon-code',
                'selectable': false,
                'state': {
                    'checked': false,
                    'expanded': false
                },
                'nodes': [],
                'properties_': {
                    'type': 'view',
                    'name': oSchema['views'][i]
                }
            };
            aFiles.push(oFile);
        }
    }

    return aFiles;
};

/**
 * Get the treeview formed sequences from the given sql schema
 * @param {object} oSchema
 * @returns {Array}
 */
nsVmap.exportVexCtrl.prototype.getTreeviewSequencesFromSchema_ = function (oSchema) {
    this.$log_.info("nsVmap.exportVexCtrl.getTreeviewSequencesFromSchema_");

    var aFiles = [];
    var oFile;
    if (goog.isArray(oSchema['sequences'])) {
        for (var i = 0; i < oSchema['sequences'].length; i++) {
            oFile = {
                'text': 'Séquence: ' + oSchema['sequences'][i],
                'icon': 'icon-code',
                'selectable': false,
                'state': {
                    'checked': false,
                    'expanded': false
                },
                'nodes': [],
                'properties_': {
                    'type': 'sequence',
                    'name': oSchema['sequences'][i]
                }
            };
            aFiles.push(oFile);
        }
    }

    return aFiles;
};

/**
 * Function called when a node state is updated
 * @param {string} sEvent
 * @param {object} oNode
 */
nsVmap.exportVexCtrl.prototype.onSQLObjcetsTreeviewUpdate_ = function (sEvent, oNode) {
    this.$log_.info("nsVmap.exportVexCtrl.onSQLObjcetsTreeviewUpdate_");

    // Sélectionne un schéma quand il s'ouvre
    if (sEvent === 'nodeExpanded' && oNode['properties_']['type'] === 'schema') {
        if (oNode['state']['checked'] === false) {
            $('#export-vex-sql-objects-treeview').data('treeview')['checkNode'](oNode['nodeId'], {'silent': true});
        }
        return 0;
    }

    // Dé-sélectionne un schéma ainsi que ses tables quand il se ferme
    if (sEvent === 'nodeCollapsed' && oNode['properties_']['type'] === 'schema') {
        if (oNode['state']['checked'] === true) {
            $('#export-vex-sql-objects-treeview').data('treeview')['uncheckNode'](oNode['nodeId'], {'silent': true});
        }
        if (goog.isArray(oNode['nodes'])) {
            for (var i = 0; i < oNode['nodes'].length; i++) {
                if (oNode['nodes'][i]['state']['checked'] === true) {
                    $('#export-vex-sql-objects-treeview').data('treeview')['uncheckNode'](oNode['nodes'][i]['nodeId'], {'silent': true});
                }
            }
        }
        return 0;
    }

    // Ouvre un schéma ou une table quand on le sélectionne
    if (sEvent === 'nodeChecked' && (oNode['properties_']['type'] === 'schema' || oNode['properties_']['type'] === 'table')) {
        if (oNode['state']['expanded'] === false) {
            $('#export-vex-sql-objects-treeview').data('treeview')['expandNode'](oNode['nodeId'], {'silent': true});
        }
        return 0;
    }

    // Ferme une table quand on la déselectionne
    if (sEvent === 'nodeUnchecked' && oNode['properties_']['type'] === 'table') {
        if (oNode['state']['expanded'] === true) {
            $('#export-vex-sql-objects-treeview').data('treeview')['collapseNode'](oNode['nodeId'], {'silent': true});
        }
        return 0;
    }

    // Ferme un schéma quand on le déselectionne et désélectionne ses tables au passage
    if (sEvent === 'nodeUnchecked' && oNode['properties_']['type'] === 'schema') {
        if (oNode['state']['expanded'] === true) {
            $('#export-vex-sql-objects-treeview').data('treeview')['collapseNode'](oNode['nodeId']);
        }
        return 0;
    }

    //Re-sélectionne un modèle quand on le dé-sélectionne ou qu'on le ferme
    if ((sEvent === 'nodeUnchecked' || sEvent === 'nodeCollapsed') && oNode['properties_']['type'] === 'model') {
        if (oNode['state']['expanded'] === false) {
            $('#export-vex-sql-objects-treeview').data('treeview')['expandNode'](oNode['nodeId'], {'silent': true});
        }
        if (oNode['state']['checked'] === false) {
            $('#export-vex-sql-objects-treeview').data('treeview')['checkNode'](oNode['nodeId'], {'silent': true});
        }
        return 0;
    }

    // Sélectionne table ou modele ou donnée quand on l'ouvre
    if (sEvent === 'nodeExpanded' &&
            (oNode['properties_']['type'] === 'table' ||
                    oNode['properties_']['type'] === 'sequence' ||
                    oNode['properties_']['type'] === 'model' ||
                    oNode['properties_']['type'] === 'data')) {
        if (oNode['state']['checked'] === false) {
            $('#export-vex-sql-objects-treeview').data('treeview')['checkNode'](oNode['nodeId'], {'silent': true});
        }
        return 0;
    }

    // Dé-sélectionne table ou donnée quand on la ferme
    if (sEvent === 'nodeCollapsed' &&
            (oNode['properties_']['type'] === 'table' ||
                    oNode['properties_']['type'] === 'sequence' ||
                    oNode['properties_']['type'] === 'data')) {
        if (oNode['state']['checked'] === true) {
            $('#export-vex-sql-objects-treeview').data('treeview')['uncheckNode'](oNode['nodeId'], {'silent': true});
        }
        return 0;
    }


};

/**
 * Update scope.aSelectedSQLObjects from the treeview data
 */
nsVmap.exportVexCtrl.prototype.updateSelectedSQLObjectsFromTreeviewData_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.updateSelectedSQLObjectsFromTreeviewData_");

    // Vide les listes
    goog.array.clear(this.$scope_['aSelectedSQLObjects']);

    if (!goog.isDefAndNotNull($('#export-vex-sql-objects-treeview').data('treeview'))) {
        return false;
    }

    var aCheckedNodes = $('#export-vex-sql-objects-treeview').data('treeview')['getChecked']();

    var oSchema;
    for (var i = 0; i < aCheckedNodes.length; i++) {
        if (goog.isDefAndNotNull(aCheckedNodes[i]['properties_'])) {
            if (goog.isDefAndNotNull(aCheckedNodes[i]['properties_']['type'])) {
                if (aCheckedNodes[i]['properties_']['type'] === 'schema') {

                    oSchema = this.getSchemaFromTreeViewData_(aCheckedNodes[i]);
                    if (goog.isDefAndNotNull(oSchema)) {
                        this.$scope_['aSelectedSQLObjects'].push(oSchema);
                    }
                }
            }
        }
    }
    return true;
};

/**
 * Get the schema from the tree view data node
 * @param {object} oNode
 * @returns {object}
 */
nsVmap.exportVexCtrl.prototype.getSchemaFromTreeViewData_ = function (oNode) {
    this.$log_.info("nsVmap.exportVexCtrl.getSchemaFromTreeViewData_");

    var aTables = [];
    var aViews = [];
    var aSequences = [];
    var oSchema, oTable, oView, oSequence;
    if (goog.isArray(oNode['nodes'])) {
        for (var i = 0; i < oNode['nodes'].length; i++) {
            if (goog.isDefAndNotNull(oNode['nodes'][i]['state'])) {
                if (oNode['nodes'][i]['state']['checked'] === true) {
                    // Tables
                    if (oNode['nodes'][i]['properties_']['type'] === 'table') {
                        oTable = this.getTableFromTreeViewData_(oNode['nodes'][i]);
                        if (goog.isDefAndNotNull(oTable)) {
                            aTables.push(oTable);
                        }
                    }
                    // Vues
                    if (oNode['nodes'][i]['properties_']['type'] === 'view') {
                        oView = this.getViewFromTreeViewData_(oNode['nodes'][i]);
                        if (goog.isDefAndNotNull(oView)) {
                            aViews.push(oView);
                        }
                    }
                    // Séquences
                    if (oNode['nodes'][i]['properties_']['type'] === 'sequence') {
                        oSequence = this.getSequenceFromTreeViewData_(oNode['nodes'][i]);
                        if (goog.isDefAndNotNull(oSequence)) {
                            aSequences.push(oSequence);
                        }
                    }
                }
            }
        }
    }

    if (aTables.length > 0) {
        oSchema = {
            'type': 'schema',
            'name': oNode['properties_']['name'],
            'tables': angular.copy(aTables),
            'views': angular.copy(aViews),
            'sequences': angular.copy(aSequences)
        };
    }

    return oSchema;
};

/**
 * Get the table from the tree view data node
 * @param {object} oNode
 * @returns {object}
 */
nsVmap.exportVexCtrl.prototype.getTableFromTreeViewData_ = function (oNode) {
    this.$log_.info("nsVmap.exportVexCtrl.getTableFromTreeViewData_");

    var oTable;
    var isModelChecked = false;
    var isDataChecked = false;

    if (goog.isArray(oNode['nodes'])) {
        for (var i = 0; i < oNode['nodes'].length; i++) {
            if (goog.isDefAndNotNull(oNode['nodes'][i]['properties_'])) {
                if (oNode['nodes'][i]['properties_']['type'] === 'model') {
                    if (oNode['nodes'][i]['state']['checked'] === true) {
                        isModelChecked = true;
                    }
                }
                if (oNode['nodes'][i]['properties_']['type'] === 'data') {
                    if (oNode['nodes'][i]['state']['checked'] === true) {
                        isDataChecked = true;
                    }
                }
            }
        }
    }

    if (isModelChecked) {
        oTable = {
            'type': 'table',
            'name': oNode['properties_']['name'],
            'model': isModelChecked,
            'data': isDataChecked
        };
    }

    return oTable;
};

/**
 * Get the sequence from the tree view data node
 * @param {object} oNode
 * @returns {object}
 */
nsVmap.exportVexCtrl.prototype.getSequenceFromTreeViewData_ = function (oNode) {
    this.$log_.info("nsVmap.exportVexCtrl.getSequenceFromTreeViewData_");

    var oSequence;
    oSequence = {
        'type': 'sequence',
        'name': oNode['properties_']['name']
    };

    return oSequence;
};

/**
 * Get the view from the tree view data node
 * @param {object} oNode
 * @returns {object}
 */
nsVmap.exportVexCtrl.prototype.getViewFromTreeViewData_ = function (oNode) {
    this.$log_.info("nsVmap.exportVexCtrl.getViewFromTreeViewData_");

    var oView;
    oView = {
        'type': 'view',
        'name': oNode['properties_']['name']
    };

    return oView;
};

/**
 * Check if the given SQL objects are valid
 * @returns {defer.promise}
 */
nsVmap.exportVexCtrl.prototype.validateSelectedSQLObjects_ = function () {
    this.$log_.info("nsVmap.exportVexCtrl.validateSelectedSQLObjects_");

    var this_ = this;
    var deferred = this.$q_.defer();

    var bSelectedSQLObjectsUpdated = this.updateSelectedSQLObjectsFromTreeviewData_();
    setTimeout(function () {
        console.log("this.$scope_['aSelectedSQLObjects']: ", this_.$scope_['aSelectedSQLObjects']);
        deferred.resolve();
    });

    return deferred.promise;
};


// Execution export

/**
 * Execute the export
 * @export
 */
nsVmap.exportVexCtrl.prototype.executeExport = function () {
    this.$log_.info("nsVmap.exportVexCtrl.executeExport");

    var this_ = this;
    var deferred = this.$q_.defer();

    var oRequestParams = {};

    if (goog.isDefAndNotNull(this.$scope_['oSelectedVmapObjects'])) {
        oRequestParams['vmap_objects'] = JSON.stringify(this.$scope_['oSelectedVmapObjects']);
    }

    if (goog.isDefAndNotNull(this.$scope_['aSelectedWebServices'])) {
        oRequestParams['web_services'] = this.$scope_['aSelectedWebServices'];
    }

    if (goog.isDefAndNotNull(this.$scope_['sSelectedDatabase']) && goog.isDefAndNotNull(this.$scope_['aSelectedSQLObjects'])) {

        var oSQLObjects = {
            'type': 'database',
            'name': this.$scope_['sSelectedDatabase'],
            'schemas': this.$scope_['aSelectedSQLObjects']
        };
        oRequestParams['sql_objects'] = JSON.stringify(oSQLObjects);
    }

    ajaxRequest({
        'method': 'POST',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vmap/vex/export_vex',
        'headers': {
            'Accept': 'application/json'
        },
        'data': oRequestParams,
        'scope': this.$scope_,
        'responseType': 'blob',
        'success': function (response) {

            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_EXPORT_VEX'], "error");
                deferred.reject();
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['size'])) {
                $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_EXPORT_VEX'], "error");
                deferred.reject();
                return null;
            }
            if (!response['data']['size'] > 0) {
                $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_EXPORT_VEX'], "error");
                deferred.reject();
                return null;
            }
            if (goog.isDefAndNotNull(response['data'])) {
                if (goog.isDefAndNotNull(response['data']['errorMessage'])) {
                    angular.element(vitisApp.appMainDrtv).scope()["modalWindow"]("dialog", "Erreur serveur", {
                        "className": "modal-danger",
                        "message": response['data']['errorMessage']
                    });
                    deferred.reject();
                    return null;
                }
            }

            // IE
            if (window.navigator['msSaveOrOpenBlob']) {
                window.navigator['msSaveOrOpenBlob'](response['data'], 'vmap_export.vex');
            }
            // Others
            else {
                oVmap.downloadBlob(response['data'], 'vmap_export.vex');
            }

            this_.$scope_['bExportOk'] = true;
        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_EXPORT_VEX_ERROR_REQUEST_GET_SQL_DATABASES'], "error");
            deferred.reject();
        }
    });

    return deferred.promise;
};


// Definition du controlleur angular
oVmap.module.controller('AppExportVexController', nsVmap.exportVexCtrl);

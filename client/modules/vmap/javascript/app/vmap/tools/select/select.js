/* global goog, nsVmap, oVmap, ol, angular, scope, bootbox, vitisApp, destructor_form, oUrlParams */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.Select
 * cette classe permet l'interrogation de couches
 */
goog.provide('nsVmap.nsToolsManager.Select');

goog.require('oVmap');

goog.require('nsVmap.nsToolsManager.BasicSelect');
goog.require('nsVmap.nsToolsManager.AdvancedSelect');


/**
 * @classdesc
 * Class {@link nsVmap.nsToolsManager.Select}: allow selection
 *
 * @constructor
 * @export
 */
nsVmap.nsToolsManager.Select = function () {

    this.oAdvancedSelect_ = new nsVmap.nsToolsManager.AdvancedSelect();
    this.oBasicSelect_ = new nsVmap.nsToolsManager.BasicSelect();
};

/**
 * Query the given BO by a EWKT geometry and run the given callback with the data param
 * @param {object} opt_options
 * @param {boolean} opt_options.useTableFormat
 * @param {string} opt_options.EWKTGeometry
 * @param {string} opt_options.bo_id
 * @param {object} opt_options.canceler
 * @param {function} opt_options.callback
 */
nsVmap.nsToolsManager.Select.prototype.queryByEWKTGeom = function (opt_options) {
    var scope = angular.element($('#vmap-select-tool')).scope();
    return scope['ctrl'].queryByEWKTGeom(opt_options);
};

/**
 * Creature and return a new feature based on the geojson geometry property
 * @param {object} data
 * @returns {ol.Feature}
 */
nsVmap.nsToolsManager.Select.prototype.extractFeatureFromData = function (data) {
    var scope = angular.element($('#vmap-select-tool')).scope();
    return scope['ctrl'].extractFeatureFromData(data);
};

/**
 * Display the object card
 * @param {object} selection
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.displayObjectCard = function (selection) {
    var scope = angular.element($('#vmap-select-tool')).scope();
    return scope['ctrl'].displayObjectCard(selection);
};

/**
 * Display the edit form
 * @param {object} selection
 * @param {function|undefined} onsubmit
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.displayEditFrom = function (selection, onsubmit) {
    var scope = angular.element($('#vmap-select-tool')).scope();
    return scope['ctrl'].displayEditFrom(selection, onsubmit);
};

/**
 * Remove the duplicate values without taking care of the 'loked' item
 * @param {array} aSelections
 * @returns {array}
 */
nsVmap.nsToolsManager.Select.prototype.removeDuplicateSelections = function (aSelections) {
    var scope = angular.element($('#vmap-select-tool')).scope();
    return scope['ctrl'].removeDuplicateSelections(aSelections);
};

/**
 * Add the query result to this['aSelections'] removing the duplicate selections
 * @param {object} opt_options
 * @param {array<object>} opt_options.data
 * @param {array<object>} opt_options.selection
 * @param {string} opt_options.dataType summary|list|form
 * @param {function} opt_options.callback callback to run at the end of the function
 */
nsVmap.nsToolsManager.Select.prototype.addQueryResult = function (opt_options) {
    var scope = angular.element($('#vmap-select-tool')).scope();
    return scope['ctrl'].addQueryResult(opt_options);
};

/**
 * Download the summary infos in the selection, if the summary infos is already present it will not downloaded
 * @param {array} aSelection
 * @param {function} callback
 */
nsVmap.nsToolsManager.Select.prototype.getSummaryInfos = function (aSelection, callback) {
    var scope = angular.element($('#vmap-select-tool')).scope();
    return scope['ctrl'].getSummaryInfos(aSelection, callback);
};

/**
 * Download the list infos in the selection, if the list infos is already present it will not downloaded
 * @param {array} aSelection
 * @param {function} callback
 */
nsVmap.nsToolsManager.Select.prototype.getListInfos = function (aSelection, callback) {
    var scope = angular.element($('#vmap-select-tool')).scope();
    return scope['ctrl'].getListInfos(aSelection, callback);
};

/**
 * Download the form infos in the selection, if the form infos is already present it will not downloaded
 * @param {array} aSelection
 * @param {function} callback
 */
nsVmap.nsToolsManager.Select.prototype.getFormInfos = function (aSelection, callback) {
    var scope = angular.element($('#vmap-select-tool')).scope();
    return scope['ctrl'].getFormInfos(aSelection, callback);
};

/**
 * Update on database the BO values
 * @param {string} bo_type
 * @param {object} boValues
 * @param {function} successCallback
 * @param {function} errorCallback
 */
nsVmap.nsToolsManager.Select.prototype.updateBOValues = function (bo_type, boValues, successCallback, errorCallback) {
    var scope = angular.element($('#vmap-select-tool')).scope();
    return scope['ctrl'].updateBOValues(bo_type, boValues, successCallback, errorCallback);
};

/**
 * Get the form values to send
 * @param {object} oFormValues
 * @param {object} oFormDefinition
 * @param {string} sFormDefinitionName
 * @param {array|undefined} aParamsToSave
 * @returns {object|null}
 */
nsVmap.nsToolsManager.Select.prototype.getFormData = function (oFormValues, oFormDefinition, sFormDefinitionName, aParamsToSave) {
    var scope = angular.element($('#vmap-select-tool')).scope();
    return scope['ctrl'].getFormData(oFormValues, oFormDefinition, sFormDefinitionName, aParamsToSave);
};

/**
 * Suggest if realy want to delete the object and call submitDeleteObject
 * @param {object} selection
 * @param {object} selection.bo_type
 * @param {object} selection.bo_id_value
 * @param {function} callback
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.deleteObject = function (selection, callback) {
    var scope = angular.element($('#vmap-select-tool')).scope();
    return scope['ctrl'].deleteObject(selection, callback);
};

/**
 * Suggest if realy want to delete the objects and call submitDeleteObject
 * @param {array<object>} aSelection
 * @param {function} callback
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.deleteMultipleObjects = function (selection, callback) {
    var scope = angular.element($('#vmap-select-tool')).scope();
    return scope['ctrl'].deleteMultipleObjects(selection, callback);
};

/**
 * Add the selected elements from the table to the card
 * @param {array} aSelection
 * @param {boolean} bReplace true to empty the card before adding items
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.addToCard = function (sSelection, bReplace) {
    var scope = angular.element($('#vmap-select-tool')).scope();
    return scope['ctrl'].addToCard(sSelection, bReplace);
};

/**
 * Start the geometry edition
 * @param {object} selection
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.editFeature = function (selection) {
    var scope = angular.element($('#vmap-select-tool')).scope();
    return scope['ctrl'].editFeature(selection);
};

/**
 * App-specific directive wrapping the select tools.
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.nsToolsManager.Select.prototype.selectDirective = function () {
    oVmap.log("nsVmap.nsToolsManager.Select.prototype.selectDirective");
    return {
        restrict: 'A',
        scope: {
            'map': '=appMap',
            'lang': '=appLang',
            'currentAction': '=appAction'
        },
        controller: 'AppSelectController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/select.html'
    };
};

/**
 * @ngInject
 * @constructor
 * @param {object} $scope
 * @param {object} $timeout
 * @param {object} $q
 * @returns {nsVmap.nsToolsManager.Select.prototype.selectController}
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.selectController = function ($scope, $timeout, $q) {
    oVmap.log("nsVmap.nsToolsManager.Select.prototype.selectController");

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
     * The current properties
     */
    this['properties'] = oVmap['properties'];

    /**
     * The current token
     */
    this['token'] = oVmap['properties']['token'];

    /**
     * Type de géométrie à utiliser
     */
    this['addPartGeomType'] = "";

    /**
     * Maximum popup mode objects
     * @type integer
     */
    this.limitPopup_ = oVmap['properties']["selection"]["limit_popup"];

    /**
     * Maximum list mode objects
     * @type integer
     */
    this.limitList_ = oVmap['properties']["selection"]["limit_list"];

    /**
     * @type {ol.layer.Vector}
     * @private
     */
    this.oOverlayLayer_ = oVmap.getMap().addVectorLayer({
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.6)'
            }),
            stroke: new ol.style.Stroke({
                color: '#319FD3',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#319FD3'
                })
            })
        })
    });

    /**
     * @type {ol.Collection}
     * @private
     */
    this.oOverlayFeatures_ = this.oOverlayLayer_.getSource().getFeaturesCollection();

    /**
     * Overlay contenant les trous des polygones (invisible)
     * @type {ol.layer.Vector}
     * @private
     */
    this.oOverlayHolesLayer_ = oVmap.getMap().addVectorLayer({
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 0, 0.2)'
            })
        })
    });

    /**
     * @type {ol.interaction.Modify}
     * @private
     */
    this.modify_ = new ol.interaction.Modify({
        features: this.oOverlayFeatures_
    });

    this.modify_.on('modifyend', function () {
        setTimeout(function () {
            this_.putFeaturesOnTheElement(this_.oOverlayFeatures_.getArray());
        });
    });

    /**
     * @type {ol.interaction.Select}
     * @private
     */
    this.delete_ = new ol.interaction.Select({
        layers: [this.oOverlayLayer_]
    });

    // Supprime la feature lors de la sélection sur l'interaction this.delete_
    this.delete_.on('select', function () {
        var aSelectedFeatures = this.delete_.getFeatures().getArray();
        for (var i = 0; i < aSelectedFeatures.length; i++) {
            this.oOverlayLayer_.getSource().removeFeature(aSelectedFeatures[i]);
        }
        this.delete_.getFeatures().clear();
        setTimeout(function () {
            this_.putFeaturesOnTheElement(this_.oOverlayFeatures_.getArray());
        });
    }, this);

    /**
     * Outil de suppression de trous
     * @type {ol.interaction.Select}
     * @private
     */
    this.deleteHole_ = new ol.interaction.Select({
        layers: [this.oOverlayHolesLayer_]
    });

    // Supprime du trou de la feature (si il existe) feature lors de la sélection sur l'interaction this.deleteHole_
    this.deleteHole_.on('select', this.deleteHole, this);

    // Anulle l'édition quand on change d'outil
    oVmap['scope'].$on('toggleOutTools', function () {
        this_.clearOverlays();
        this_.canceler_.resolve();
    });

    // Zoom sur les objets passés dans l'url
    if (goog.isString(oUrlParams['bo_id']) && goog.isString(oUrlParams['ids'])) {
        if (oUrlParams['bo_id'].length > 0 && oUrlParams['ids'].length > 0) {
            setTimeout(function () {

                var oBusinessObjects = oVmap.getMapManager().getQueryableBusinessObjects();

                if (goog.isDefAndNotNull(oBusinessObjects[oUrlParams['bo_id']])) {

                    var aSelection = [];
                    var aIds = oUrlParams['ids'].split('|');

                    for (var i = 0; i < aIds.length; i++) {
                        aSelection.push({
                            'bo_type': oUrlParams['bo_id'],
                            'bo_id_value': aIds[i],
                            'bo_id_field': oBusinessObjects[oUrlParams['bo_id']]['bo_id_field'],
                            'bo_title': oBusinessObjects[oUrlParams['bo_id']]['bo_title']
                        });
                    }

                    if (aSelection.length > 0) {
                        this_.addToCard(aSelection, true);
                    }
                }
            });
        }
    }
};

/**
 * Query the given BO by a EWKT geometry and run the given callback with the data param
 * @param {object} opt_options
 * @param {boolean} opt_options.useTableFormat
 * @param {string} opt_options.EWKTGeometry
 * @param {string} opt_options.bo_id
 * @param {object} opt_options.canceler
 * @param {function} opt_options.callback
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.queryByEWKTGeom = function (opt_options) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.queryByEWKTGeom');

    var this_ = this;

    if (!goog.isDefAndNotNull(opt_options)) {
        return;
    }
    if (!goog.isDefAndNotNull(opt_options.useTableFormat)) {
        console.error('opt_options.useTableFormat not defined');
        return;
    }
    if (!goog.isDefAndNotNull(opt_options.EWKTGeometry)) {
        console.error('opt_options.EWKTGeometry not defined');
        return;
    }
    if (!goog.isDefAndNotNull(opt_options.bo_id)) {
        console.error('opt_options.bo_id not defined');
        return;
    }
    if (!goog.isDefAndNotNull(opt_options.canceler)) {
        console.error('opt_options.canceler not defined');
        return;
    }
    if (!goog.isDefAndNotNull(opt_options.callback)) {
        console.error('opt_options.callback not defined');
        return;
    }

    // Si on est en mode tableFormat, alors on ne demande pas la géométrie
    var get_geom = !opt_options.useTableFormat;

    // Type de résultat: list ou summary
    var formType = opt_options.useTableFormat === true ? 'list' : 'summary';

    // Projection en cours
    var srid = this['map'].getView().getProjection().getCode().substring(5);

    // Récupère le type de géométrie
    var geomType = oVmap.getGeomFromEWKT(opt_options.EWKTGeometry).getType();

    // Calcul du buffer
    var buffer = 0.01;
    if (geomType === 'Point') {
        if (goog.isDefAndNotNull(opt_options.buffer)) {
            var scale = oVmap.getMap().getScale();
            buffer = (opt_options.buffer * scale) / 1000;
        }
    }

    // Limite de features
    if (opt_options.useTableFormat === true)
        var limit = this.limitList_;
    else
        var limit = this.limitPopup_;

    ajaxRequest({
        'method': 'POST',
        'url': oVmap['properties']['api_url'] + '/vmap/querys/' + opt_options.bo_id + '/' + formType,
        'headers': {
            'X-HTTP-Method-Override': 'GET',
            'Accept': 'application/x-vm-json'
        },
        'data': {
            'intersect_geom': opt_options.EWKTGeometry,
            'intersect_buffer': buffer,
            'get_geom': get_geom,
            'get_image': get_geom,
            'result_srid': srid,
            'limit': limit,
            'd': Date.now()
        },
        'scope': this.$scope_,
        'abord': opt_options.canceler.promise,
        'success': function (response) {

            // Si le opt_options.canceler à été resolved (on a appuillé sur echap ou on à lancé une autre requête)
            if (opt_options.canceler.promise['$$state'].status === 1)
                return 0;

            // Résultat vide par défaut, il faut passer par addQueryResult même en cas de résultat vide
            var data = [];

            // Vérifie si il y a des données à afficher et les ajoute
            if (goog.isDefAndNotNull(response['data'])) {
                if (goog.isDefAndNotNull(response['data']['data'])) {
                    data = response['data']['data'];
                } else {
                    oVmap.log('Pas de données à afficher');
                }
            } else {
                oVmap.log('Pas de données à afficher');
            }

            if (data.length === this_.limitList_)
                $.notify("Limite d'objets à afficher atteinte", "warn");

            opt_options.callback.call(this, data);
        }
    });
};

/**
 * Creature and return a new feature based on the geojson geometry property
 * @param {object} data
 * @returns {ol.Feature}
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.extractFeatureFromData = function (data) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.extractFeatureFromData');

    // Récupère la géométrie
    var geom = oVmap.getGeomFromEWKT(data['bo_intersect_geom']);
    var feature = new ol.Feature({
        geometry: geom
    });

    return feature;
};

/**
 * Get the BasicSelect scope
 * @returns {angular.scope}
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.getBasicSelectScope = function () {
    return angular.element($('#vmap-basicselect-tool')).scope();
};

/**
 * Get the AdvancedSelect scope
 * @returns {angular.scope}
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.getAdvancedSelectScope = function () {
    return angular.element($('#vmap-advancedselect-tool')).scope();
};

/**
 * Get the Display Form reader scope
 * @returns {angular.scope}
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.getDisplayFormReaderScope = function () {
    return angular.element($('#select_display_form_reader').children()).scope();
};

/**
 * Get the Edit Form reader scope
 * @returns {angular.scope}
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.getEditFormReaderScope = function () {
    return angular.element($('#select_edit_form_reader').children()).scope();
};

/**
 * Display the object card
 * @param {object} selection
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.displayObjectCard = function (selection) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.displayObjectCard');

    var this_ = this;

    if (selection['bo_title'].length === 0)
        return 0;

    this['editSelection'] = {
        'bo_title': selection['bo_title'],
        'display_form_size': selection['display_form_size']
    };

    // Récupere les informations du formuaire
    this_.getFormInfos([selection], function (data) {

        selection = data[0];

        var oFormDefinition = selection['bo_json_form'];

        var oFormValues = {
            "update": goog.object.clone(selection['bo_form']),
            "display": goog.object.clone(selection['bo_form'])
        };

        oVmap.log('oFormValues: ', oFormValues);
        oVmap.log('oFormDefinition: ', oFormDefinition);

        var displayFormReaderScope = this_.getDisplayFormReaderScope();
        displayFormReaderScope.$evalAsync(function () {

            var loadForm = function () {
                // Set le formulaire
                displayFormReaderScope['ctrl']['setDefinitionName']('display');
                displayFormReaderScope['ctrl']['setFormValues'](oFormValues);
                displayFormReaderScope['ctrl']['setFormDefinition'](oFormDefinition);

                displayFormReaderScope.$applyAsync(function () {
                    displayFormReaderScope['ctrl']['loadForm']();
                    $('#select-card-modal').modal('show');
                });
            };

            // Tente de lancer destructor_form
            try {
                if (goog.isDef(destructor_form)) {
                    destructor_form();
                }
            } catch (e) {
                oVmap.log("destructor_form does not exist");
            }

            // Chargement des js associés au bo
            if (goog.isDefAndNotNull(selection['bo_json_form_js'])) {
                var sUrl = selection['bo_json_form_js'];
                oVmap.log("initHtmlForm : javascript assoc. to : " + sUrl);
                loadExternalJs([sUrl], {
                    "callback": function () {
                        loadForm();
                        try {
                            if (goog.isDef(constructor_form)) {
                                constructor_form(displayFormReaderScope, sUrl);
                            }
                        } catch (e) {
                            oVmap.log("constructor_form does not exist");
                        }
                    },
                    "async": true,
                    "scriptInBody": true
                });
            } else {
                loadForm();
            }
        });
    });
};

/**
 * Display the edit form
 * @param {object} selection
 * @param {function|undefined} onsubmit
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.displayEditFrom = function (selection, onsubmit) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.displayEditFrom');

    var this_ = this;

    if (selection['bo_title'].length === 0)
        return 0;

    this['editSelection'] = selection;

    // Récupere les informations du formuaire
    this_.getSummaryInfos([selection], function (aSelection) {
        this_.getFormInfos(aSelection, function (aSelection) {

            selection = aSelection[0];

            var oFormDefinition = selection['bo_json_form'];
            var oFormValues = {
                "update": goog.object.clone(selection['bo_form']),
                "display": goog.object.clone(selection['bo_form'])
            };

            // Bouton submit
            var button = {
                "fields": [{
                        "type": "button",
                        "class": "btn-ungroup btn-group-sm",
                        "nb_cols": 12,
                        "buttons": [{
                                "visibleAllTabs": true,
                                "type": "submit",
                                "label": "FORM_UPDATE",
                                "name": "form_submit",
                                "class": "btn-primary hidden",
                                "id": "basictools-select-form-reader-submit-btn"
                            }
                        ]
                    }
                ]
            };
            if (!angular.equals(oFormDefinition['update']['rows'][oFormDefinition['update']['rows'].length - 1], button))
                oFormDefinition['update']['rows'].push(button);

            // Evènement submit
            oFormDefinition['update']['event'] = function (oFormValuesResulted) {

                $('#select_edit_form_reader').find('button').attr('disabled', true);
                showAjaxLoader();

                // Paramètres peut être non fournis dans le formulaire à sauvegarger
                var aParamsToSave = [selection['bo_id_field']];
                if (goog.isDefAndNotNull(this_['editableSelection'])) {
                    if (goog.isDefAndNotNull(this_['editableSelection']['geom_column'])) {
                        aParamsToSave.push(this_['editableSelection']['geom_column']);
                    }
                }

                var boValues = this_.getFormData(oFormValuesResulted, oFormDefinition, 'update', aParamsToSave);

                selection['bo_form'] = boValues;

                this_.updateBOValues(selection['bo_type'], boValues, function () {
                    $('#select-edit-modal').modal('hide');
                    $('#select_edit_form_reader').find('button').attr('disabled', false);
                    this_.clearOverlays();
                    if (goog.isDefAndNotNull(onsubmit)) {
                        onsubmit.call(this, boValues);
                    }
                }, function () {
                    $('#select-edit-modal').modal('hide');
                    $('#select_edit_form_reader').find('button').attr('disabled', false);
                    this_.clearOverlays();
                    if (goog.isDefAndNotNull(onsubmit)) {
                        onsubmit.call(this, boValues);
                    }
                });

            };


            var editFormReaderScope = this_.getEditFormReaderScope();
            editFormReaderScope.$evalAsync(function () {

                var loadForm = function () {
                    // Set le formulaire
                    editFormReaderScope['ctrl']['setDefinitionName']('update');
                    editFormReaderScope['ctrl']['setFormValues'](oFormValues);
                    editFormReaderScope['ctrl']['setFormDefinition'](oFormDefinition);

                    editFormReaderScope.$applyAsync(function () {
                        editFormReaderScope['ctrl']['loadForm']();
                        $('#select-edit-modal').modal('show');
                    });
                };

                // Tente de lancer destructor_form
                try {
                    if (goog.isDef(destructor_form)) {
                        destructor_form();
                    }
                } catch (e) {
                    oVmap.log("destructor_form does not exist");
                }

                // Chargement des js associés au bo
                if (goog.isDefAndNotNull(selection['bo_json_form_js'])) {
                    var sUrl = selection['bo_json_form_js'];
                    oVmap.log("initHtmlForm : javascript assoc. to : " + sUrl);
                    loadExternalJs([sUrl], {
                        "callback": function () {
                            loadForm();
                            try {
                                if (goog.isDef(constructor_form)) {
                                    constructor_form(editFormReaderScope, sUrl);
                                }
                            } catch (e) {
                                oVmap.log("constructor_form does not exist");
                            }
                        },
                        "async": true,
                        "scriptInBody": true
                    });
                } else {
                    loadForm();
                }
            });
        });
    });
};

/**
 * Download the summary infos in the selection, if the summary infos is already present it will not downloaded
 * @param {array} aSelection
 * @param {function} callback
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.getSummaryInfos = function (aSelection, callback) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.getSummaryInfos');
    this.complementDataOnSelection({
        aSelection: aSelection,
        dataType: 'summary',
        callback: callback
    });
};

/**
 * Download the list infos in the selection, if the list infos is already present it will not downloaded
 * @param {array} aSelection
 * @param {function} callback
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.getListInfos = function (aSelection, callback) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.getListInfos');
    this.complementDataOnSelection({
        aSelection: aSelection,
        dataType: 'list',
        callback: callback
    });
};

/**
 * Download the form infos in the selection, if the form infos is already present it will not downloaded
 * @param {array} aSelection
 * @param {function} callback
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.getFormInfos = function (aSelection, callback) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.getFormInfos');
    this.complementDataOnSelection({
        aSelection: aSelection,
        dataType: 'form',
        callback: callback
    });
};

/**
 * Complete data on the dataType param off the selection, the request is maked by the business_object_id. If the param already exists the data is not erased
 * @param {object} opt_options
 * @param {array} opt_options.aSelection
 * @param {string} opt_options.dataType summary|list|form
 * @param {object} opt_options.complementParams params to add on the http request
 * @param {function} opt_options.callback
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.complementDataOnSelection = function (opt_options) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.complementDataOnSelection');

    var aSelection = goog.isDef(opt_options.aSelection) ? opt_options.aSelection : [];
    var dataType = goog.isDef(opt_options.dataType) ? opt_options.dataType : null;
    var complementParams = goog.isDef(opt_options.complementParams) ? opt_options.complementParams : {};
    var callback = goog.isDef(opt_options.callback) ? opt_options.callback : function () {
        return 0;
    };

    // Récupère la liste des bo
    var aBusinessObjects = [];
    for (var i = 0; i < aSelection.length; i++) {
        goog.array.binaryInsert(aBusinessObjects, aSelection[i]['bo_type']);
    }

    // Met à jour le compteur de requêtes
    this.requestCounter_ = goog.isNumber(this.requestCounter_) ? this.requestCounter_ : 0;
    this.requestCounter_ += aBusinessObjects.length;

    if (aBusinessObjects.length > 0)
        showAjaxLoader();

    var tmpSelection = [];

    for (var i = 0; i < aBusinessObjects.length; i++) {
        goog.array.clear(tmpSelection);

        // Récupère la liste des selections par couche
        for (var ii = 0; ii < aSelection.length; ii++) {
            if (aSelection[ii]['bo_type'] === aBusinessObjects[i])
                tmpSelection.push(aSelection[ii]);
        }

        this.complementDataOnSelection2_({
            aSelection: goog.array.clone(tmpSelection),
            bo_type: aBusinessObjects[i],
            dataType: dataType,
            complementParams: complementParams,
            callback: callback
        });

    }
};

/**
 * Add the data on the dataType param off the selection, if the param already exists the data is not erased
 * @param {object} opt_options
 * @param {array} opt_options.aSelection
 * @param {string} opt_options.bo_type
 * @param {string} opt_options.dataType summary|list|form
 * @param {object} opt_options.complementParams params to add on the http request
 * @param {function} opt_options.callback
 * @private
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.complementDataOnSelection2_ = function (opt_options) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.complementDataOnSelection2_');

    var aSelection = goog.isDef(opt_options.aSelection) ? opt_options.aSelection : [];
    var dataType = goog.isDef(opt_options.dataType) ? opt_options.dataType : null;
    var complementParams = goog.isDef(opt_options.complementParams) ? opt_options.complementParams : {};
    var callback = goog.isDef(opt_options.callback) ? opt_options.callback : function () {
        return 0;
    };

    var this_ = this;

    // Construction du filtre
    var filter = {
        'relation': 'OR',
        'operators': []
    };
    for (var i = 0; i < aSelection.length; i++) {
        if (!goog.isDef(aSelection[i]['bo_' + dataType])) {
            filter['operators'].push({
                'column': aSelection[i]['bo_id_field'].replace(/\./g, '"."'),
                'compare_operator': '=',
                'value': aSelection[i]['bo_id_value']
            });
        }
    }

    // Projection en cours
    var proj = this['map'].getView().getProjection().getCode().substring(5);

    // url de la requête
    if (goog.isDef(opt_options.bo_type)) {
        var url = oVmap['properties']['api_url'] + '/vmap/querys/' + opt_options.bo_type + '/' + dataType;
    } else {
        console.error('opt_options.bo_type not defined');
        return 0;
    }

    var params = {
        'result_srid': proj,
        'limit': 200
    };

    // Si on demande un type summary, alors on demande la geom
    if (dataType === 'summary') {
        params['get_geom'] = true;
        params['get_image'] = true;
    }

    // Ajoute si besoin les paramètres compémentaires
    goog.object.extend(params, complementParams);

    if (filter['operators'].length > 0) {
        params['filter'] = JSON.stringify(filter);

        ajaxRequest({
            'method': 'POST',
            'url': url,
            'headers': {
                'X-HTTP-Method-Override': 'GET',
                'Accept': 'application/x-vm-json'
            },
            'data': params,
            'scope': this.$scope_,
            'success': function (response) {

                var data = [];

                // Décrémente le compteur de requêtes
                this_.requestCounter_--;

                // Si le compteur de requêtes vaut zéro, alors on remet le curceur normal
                if (this_.requestCounter_ === 0) {
                    $('body').css({"cursor": ""});
                    hideAjaxLoader();
                }

                // Vérifie si il y a une erreur
                if (goog.isDef(response['data'])) {
                    if (goog.isDef(response['data']['errorMessage'])) {
                        bootbox.alert(response['data']['errorMessage']);
                    }
                }

                // Vérifie si il y a des données à afficher
                if (!goog.isDef(response['data']['data'])) {
                    oVmap.log('Pas de données à afficher');
                } else {
                    var data = response['data']['data'];
                }

                // Vérifie si la limite de données à afficher n'a pas été dépassée
                if (data.length > 199) {
                    var sAlert = '<h4>Attention, vous avez atteint la limite d\'objects affichables sur la carte</h4>';
                    bootbox.alert(sAlert);
                }

                // Ajoute le résultat de la requête
                this_.addQueryResult({
                    data: data,
                    selection: aSelection,
                    dataType: dataType,
                    callback: callback
                });
            },
            'error': function (response) {
                // Décrémente le compteur de requêtes
                this_.requestCounter_--;

                // Si le compteur de requêtes vaut zéro, alors on remet le curceur normal
                if (this_.requestCounter_ === 0) {
                    $('body').css({"cursor": ""});
                    hideAjaxLoader();
                    callback.call(this, aSelection);
                }
            }
        });
    } else {
        // Décrémente le compteur de requêtes
        this_.requestCounter_--;

        // Si le compteur de requêtes vaut zéro, alors on remet le curceur normal
        if (this_.requestCounter_ === 0) {
            $('body').css({"cursor": ""});
            hideAjaxLoader();
            callback.call(this, aSelection);
        }
    }
};

/**
 * Add the query result to this['aSelections'] removing the duplicate selections
 * @param {object} opt_options
 * @param {array<object>} opt_options.data
 * @param {array<object>} opt_options.selection
 * @param {string} opt_options.dataType summary|list|form
 * @param {function} opt_options.callback callback to run at the end of the function
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.addQueryResult = function (opt_options) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.addQueryResult');

    var aData = goog.isDef(opt_options.data) ? opt_options.data : [];
    var aSelections = goog.isDef(opt_options.selection) ? opt_options.selection : [];
    var dataType = goog.isDef(opt_options.dataType) ? opt_options.dataType : null;
    var callback = goog.isDef(opt_options.callback) ? opt_options.callback : function () {
        return 0;
    };

    // Formatage du résultat
    var aResult = [];
    for (var i = 0; i < aData.length; i++) {
        aResult.push(aData[i]);
        if (goog.isDef(aData[i]['bo_intersect_geom'])) {
            aResult[i]['olFeature'] = this.extractFeatureFromData(aData[i]);
        }
    }

    // Ajoute les résultats
    goog.array.insertArrayAt(aSelections, aResult, -1);

    // supprime les doublons
    aSelections = this.removeDuplicateSelections(aSelections);

    callback.call(this, aSelections);
};

/**
 * Remove the duplicate values without taking care of the 'loked' item
 * @param {array} aSelections
 * @returns {array}
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.removeDuplicateSelections = function (aSelections) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.removeDuplicateSelections');

    var itemsToRemove = [];

    for (var i = 0; i < aSelections.length; i++) {

        goog.array.clear(itemsToRemove);

        // Mémorise les élements à supprimer
        for (var ii = i + 1; ii < aSelections.length; ii++) {

            // Compare les objets
//            if (angular.equals(aSelections[i]['bo_id_field'], aSelections[ii]['bo_id_field']) &&
//                    angular.equals(aSelections[i]['bo_id_value'], aSelections[ii]['bo_id_value']) &&
//                    angular.equals(aSelections[i]['bo_type'], aSelections[ii]['bo_type'])) {

            if (aSelections[i]['bo_id_field'] == aSelections[ii]['bo_id_field'] &&
                    aSelections[i]['bo_type'] == aSelections[ii]['bo_type'] &&
                    aSelections[i]['bo_id_value'] == aSelections[ii]['bo_id_value']) {

                itemsToRemove.push(ii);

                // Si le deuxième est locked, alors le premier passe locked (le deuxième sera supprimé dans tous les cas)
                if (aSelections[ii]['locked'] === true)
                    aSelections[i]['locked'] = true;

                // Paramètres à sauvegarder si une des deux l'a
                var paramsToSave = ['olFeature', 'mapPopup', 'bo_image_path', 'bo_summary', 'bo_summary_attributs', 'bo_list', 'bo_list_attributs', 'bo_form', 'bo_form_attributs', 'bo_json_form', 'bo_json_form_js', 'bo_json_form_css'];

                for (var iii = 0; iii < paramsToSave.length; iii++) {

                    // Si le deuxième a le paramètre, alors le premier le prend et vice versa
                    if (goog.isDef(aSelections[ii][paramsToSave[iii]]) && !goog.isDef(aSelections[i][paramsToSave[iii]]))
                        aSelections[i][paramsToSave[iii]] = aSelections[ii][paramsToSave[iii]];
                    if (goog.isDef(aSelections[i][paramsToSave[iii]]) && !goog.isDef(aSelections[ii][paramsToSave[iii]]))
                        aSelections[ii][paramsToSave[iii]] = aSelections[i][paramsToSave[iii]];
                }
            }
        }

        // Supprime les doublons
        for (var j = 0; j < itemsToRemove.length; j++) {
            goog.array.removeAt(aSelections, itemsToRemove[j]);
        }
    }

    return aSelections;
};

/**
 * Update on database the BO values
 * @param {string} bo_type
 * @param {object} boValues
 * @param {function} successCallback
 * @param {function} errorCallback
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.updateBOValues = function (bo_type, boValues, successCallback, errorCallback) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.updateBOValues');

    if (!goog.isDef(bo_type))
        return 0;

    boValues = goog.isDef(boValues) ? boValues : {};
    successCallback = goog.isDef(successCallback) ? successCallback : angular.noop;
    errorCallback = goog.isDef(errorCallback) ? errorCallback : angular.noop;

    var data = this.getFormDataFromValues(boValues);
    var aLayers = this['map'].getLayers().getArray();

    showAjaxLoader();
    ajaxRequest({
        'method': 'PUT',
        'url': oVmap['properties']['api_url'] + '/vmap/querys/' + bo_type,
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'data': data,
        'scope': this.$scope_,
        'success': function (response) {

            if (!goog.isDef(response['data'])) {
                console.log('Aucune valeur retournée');
                errorCallback.call();
                return 0;
            }

            if (goog.isDef(response['data']['errorMessage'])) {
                console.log(response['data']['errorMessage']);
                errorCallback.call();
                return 0;
            }

            // recharge les couches impliquées
            for (var i = 0; i < aLayers.length; i++) {
                var aBusinessObjects = aLayers[i].getProperties()['business_objects'];
                if (goog.isArray(aBusinessObjects)) {
                    for (var ii = 0; ii < aBusinessObjects.length; ii++) {
                        if (aBusinessObjects[ii]['business_object_id'] === bo_type) {
                            aLayers[i].refreshWithTimestamp();
                        }
                    }
                }
            }

            // Message ok
            $.notify("Opération réalisée avec succès, les couches de la carte se mettent à jour", "info");

            successCallback.call();
        }
    });
};

/**
 * Get the form values to send
 * @param {object} oFormValues
 * @param {object} oFormDefinition
 * @param {string} sFormDefinitionName
 * @param {array|undefined} aParamsToSave
 * @returns {object|null}
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.getFormData = function (oFormValues, oFormDefinition, sFormDefinitionName, aParamsToSave) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.getFormData');

    if (!goog.isDefAndNotNull(oFormValues)) {
        console.error('oFormValues is undefined or null');
        return null;
    }
    if (!goog.isDefAndNotNull(oFormDefinition)) {
        console.error('oFormDefinition is undefined or null');
        return null;
    }
    if (!goog.isDefAndNotNull(sFormDefinitionName)) {
        console.error('sFormDefinitionName is undefined or null');
        return null;
    }
    if (!goog.isDefAndNotNull(aParamsToSave)) {
        aParamsToSave = [];
    }

    var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
    var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);

    envSrvc["oFormValues"] = oFormValues;
    envSrvc["oFormDefinition"] = oFormDefinition;
    envSrvc["sFormDefinitionName"] = sFormDefinitionName;

    var oFormData = formSrvc['getFormData'](sFormDefinitionName, true);

    for (var i = 0; i < aParamsToSave.length; i++) {
        if (goog.isDefAndNotNull(oFormValues[sFormDefinitionName][aParamsToSave[i]])) {
            oFormData[aParamsToSave[i]] = oFormValues[sFormDefinitionName][aParamsToSave[i]];
        }
    }

    return oFormData;
};

/**
 * Creates a FormData object from oValues
 * @param {object} oValues
 * @returns {FormData}
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.getFormDataFromValues = function (oValues) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.getFormDataFromValues');

    var oFormData_ = new FormData();

    for (var key in oValues) {
        // Fichier ?
        if (goog.isDefAndNotNull(oValues[key]['aFiles'])) {
            oFormData_.append(key + '_attached_content', oValues[key]['aFiles'][0]);
            oFormData_.append(key, oValues[key]['aFiles'][0]['name']);
        } else {
            oFormData_.append(key, oValues[key]);
        }
    }

    return oFormData_;
};

/**
 * Suggest if realy want to delete the object and call submitDeleteObject
 * @param {object} selection
 * @param {object} selection.bo_type
 * @param {object} selection.bo_id_value
 * @param {function} callback
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.deleteObject = function (selection, callback) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.deleteObject');

    var this_ = this;

    bootbox.confirm("<h4>Supprimer définitivement cet objet de la base de données ?</h4>", function (result) {
        if (result === true)
            this_.submitDeleteObject(selection, callback);
    });

};

/**
 * Suggest if realy want to delete the objects and call submitDeleteObject
 * @param {array<object>} aSelection
 * @param {function} callback
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.deleteMultipleObjects = function (aSelection, callback) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.deleteMultipleObjects');

    var this_ = this;

    bootbox.confirm("<h4>Supprimer définitivement ces objets de la base de données ?</h4>", function (result) {
        if (result === true) {
            for (var i = 0; i < aSelection.length; i++) {
                this_.submitDeleteObject(aSelection[i], callback);
            }
        }
    });

};

/**
 * Submit a DELETE request to the server for delete the object from the datasource
 * @param {object} selection
 * @param {object} selection.bo_type
 * @param {object} selection.bo_id_value
 * @param {function} callback
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.submitDeleteObject = function (selection, callback) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.submitDeleteObject');

    var boId = selection['bo_type'];
    var boIdValue = selection['bo_id_value'];
    var aLayers = this['map'].getLayers().getArray();

    ajaxRequest({
        'method': 'DELETE',
        'url': oVmap['properties']['api_url'] + '/vmap/querys/' + boId,
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'params': {
            'idList': boIdValue
        },
        'scope': this.$scope_,
        'success': function (response) {

            // recharge les couches impliquées
            for (var i = 0; i < aLayers.length; i++) {
                var aBusinessObjects = aLayers[i].getProperties()['business_objects'];
                if (goog.isArray(aBusinessObjects)) {
                    for (var ii = 0; ii < aBusinessObjects.length; ii++) {
                        if (aBusinessObjects[ii]['business_object_id'] === boId) {
                            aLayers[i].refreshWithTimestamp();
                        }
                    }
                }
            }

            // Message ok
            $.notify("Opération réalisée avec succès, les couches de la carte se mettent à jour", "info");

            // Callback
            callback.call();
        },
        'error': function (response) {

        }
    });
};

/**
 * Add the selected elements from the table to the card
 * @param {array} aSelection
 * @param {boolean} bReplace true to empty the card before adding items
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.addToCard = function (aSelection, bReplace) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.addToCard');

    // Vide le panier
    if (bReplace) {
        oVmap.getToolsManager().getInfoContainer().removeAll();
    }

    var this_ = this;

    // Télécharge les features de la sélection
    setTimeout(function () {
        this_.getSummaryInfos(aSelection, function (aSelection) {
            this_.getListInfos(aSelection, function (aSelection) {

                if (!goog.isDef(aSelection) || aSelection.length <= 0) {
                    console.error('aSelection empty or inexistent');
                    return 0;
                }

                var aData = [];
                var bo_type = aSelection[0]['bo_type'];
                var bo_title = aSelection[0]['bo_title'];

                var rowOptions = {
                    invisibleColumns: ['selection', 'state']
                };

                // Extrait la data (qui cette fois ci contient la feature)
                for (var i = 0; i < aSelection.length; i++) {
                    if (!goog.isDefAndNotNull(aSelection[i]['bo_list'])) {
                        console.error("Selection[i]['bo_list'] undefined");
                        continue;
                    }
                    if (!goog.isDefAndNotNull(aSelection[i]['olFeature'])) {
                        console.error("Selection[i]['olFeature'] undefined");
                        continue;
                    }
                    aData.push(aSelection[i]['bo_list']);
                    aData[i]['feature'] = aSelection[i]['olFeature'];

                    // Si ne contient pas le champ identifiant
                    if (!goog.isDefAndNotNull(aData[i][aSelection[i]['bo_id_field']])) {
                        aData[i][aSelection[i]['bo_id_field']] = aSelection[i]['bo_id_value'];
                        rowOptions.invisibleColumns.push(aSelection[i]['bo_id_field']);
                    }
                }

                // Crée l'onglet correspondant
                if (oVmap.getToolsManager().getInfoContainer().getTabByCode(bo_type) === undefined)
                    oVmap.getToolsManager().getInfoContainer().addTab({tabCode: bo_type, tabName: bo_title, actions: ['zoom', 'delete']});

                var tabOptions = {tabCode: bo_type};
                rowOptions.data = aData;

                // Ajoute les inos au panier
                oVmap.getToolsManager().getInfoContainer().addMultipleRows(tabOptions, rowOptions);

                // Ferme la modale
                $('#select-list-modal').modal('hide');

                // Affiche le panier
                oVmap.getToolsManager().getInfoContainer().showBar();

                // Affiche les features
                oVmap.getToolsManager().getInfoContainer().displayTabFeatures(bo_type);

                setTimeout(function () {
                    oVmap.getToolsManager().getInfoContainer().zoomOnTabFeatures(bo_type);
                }, 500);
            });
        });
    });
};



// Édition de la géométrie

/**
 * Edit the form feature
 * @param {object} selection
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.editFormFeature = function (selection) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.editFormFeature');

    // Ferme le formulaire d'édition
    $('#select-edit-modal').modal('hide');

    // Ferme les popup
    this.getBasicSelectScope()['ctrl'].removePopups();

    // Ferme le requêteur
    $('#select-list-modal').modal('hide');

    // Lance l'édition
    this.editFeature(selection, true);
};

/**
 * Start the geometry edition
 * @param {object} selection
 * @param {boolean} bFromEditForm true if the request comes to the EditForm
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.editFeature = function (selection, bFromEditForm) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.editFeature');

    var this_ = this;

    var oBusinessObjects = oVmap.getMapManager().getQueryableBusinessObjects();

    if (!goog.isDefAndNotNull(selection['bo_type'])) {
        console.error("selection['bo_type'] not defined");
        return 0;
    }
    if (!goog.isDefAndNotNull(oBusinessObjects[selection['bo_type']])) {
        console.error("oBusinessObjects[selection['bo_type']] not defined");
        return 0;
    }
    if (!goog.isDefAndNotNull(oBusinessObjects[selection['bo_type']]['bo_geom_type'])) {
        console.error("oBusinessObjects[selection['bo_type']]['bo_geom_type'] not defined");
        return 0;
    }

    this['editableSelection'] = selection;
    this['editableFeatureType'] = oBusinessObjects[selection['bo_type']]['bo_geom_type'];

    if (this['editableFeatureType'] === 'GEOMETRYCOLLECTION') {
        this['addPartGeomType'] = '';
    } else if (this['editableFeatureType'] === 'POLYGON' || this['editableFeatureType'] === 'MULTIPOLYGON') {
        this['addPartGeomType'] = 'Polygon';
    } else if (this['editableFeatureType'] === 'LINESTRING' || this['editableFeatureType'] === 'MULTILINESTRING') {
        this['addPartGeomType'] = 'LineString';
    } else if (this['editableFeatureType'] === 'POINT' || this['editableFeatureType'] === 'MULTIPOINT') {
        this['addPartGeomType'] = 'Point';
    }


    if (bFromEditForm) {
        this['editGeometryFromForm'] = true;
    } else {
        this['editGeometryFromForm'] = false;
    }

    // Affiche la palette de modification
    $('#basictools-select-modify-palette').show();

    // Timeout car lors du toggleOutTools, clearOverlays est lancé
    setTimeout(function () {
        // Ajoute la/les feature(s) 
        if (goog.isDefAndNotNull(this_['editableSelection']['olFeature'])) {
            this_.putElementFeatureOnOverlay();
        }

        setTimeout(function () {
            // Ajoute l'interraction
            if (this_.oOverlayLayer_.getSource().getFeaturesCollection().getLength() > 0) {
                this_.startEdition('editFeature', this_.currentAction === 'basicTools-select-editFeature');
            }
        }, 100);
    }, 500);
};

/**
 * Set the drawTool
 * @param {string} type (editFeature, deleteFeature, addHole)
 * @param {boolean} isActive true if the selection is already active
 * @returns {Number}
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.startEdition = function (type, isActive) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.startEdition');

    var this_ = this;

    this.cancelEdition();

    if (isActive === true)
        return 0;

    if (type.substr(0, 6) === 'insert') {

        //Ajoute la tooltip
        oVmap.getMap().getMapTooltip().displayMessage('Cliquez pour commencer à dessiner');

        // Ajoute l'interraction
        this.startDrawing(type.substr(6));

    } else if (type === 'editFeature') {

        //Ajoute la tooltip
        oVmap.getMap().getMapTooltip().displayMessage('Cliquez sur la géométrie pour la modifier');

        // Ajoute l'interraction
        oVmap.getMap().setInteraction(this.modify_, 'basicTools-select-' + type);

    } else if (type === 'deleteFeature') {

        //Ajoute la tooltip
        oVmap.getMap().getMapTooltip().displayMessage('Cliquez sur la géométrie pour la supprimer');

        // Ajoute l'interraction
        oVmap.getMap().setInteraction(this.delete_, 'basicTools-select-' + type);

    } else if (type === 'addHole') {

        //Ajoute la tooltip
        oVmap.getMap().getMapTooltip().displayMessage('Dessinez un polygone à l\'intérieur d\'un autre pour créer un trou');

        // Ajoute l'interraction (reliée à aucune featureCollection)
        this.draw_ = oVmap.getMap().setDrawInteraction({
            type: 'Polygon'
        }, 'basicTools-select-' + type);

        // Copie les features présentes avant le dessin
        var aFeaturesCopy = goog.array.clone(this.oOverlayFeatures_.getArray());

        this.draw_.on('drawend',
                function (evt) {
                    // Récupère la feature ajoutée
                    var feature = evt.feature;
                    var linearRing = feature.getGeometry().getLinearRing(0);
                    var bIsContained = false;
                    for (var i = 0; i < aFeaturesCopy.length; i++) {
                        // Si le trou est contenu dans une des features
                        if (aFeaturesCopy[i].getGeometry().containsPolygon(feature.getGeometry())) {
                            // Troue le polygone
                            aFeaturesCopy[i].getGeometry().appendLinearRing(linearRing);
                            bIsContained = true;
                        }
                    }

                    if (!bIsContained) {
                        bootbox.alert('<h4>Trou non valide: il doit être contenu dans un polygone dessiné</h4>');
                    } else {
                        setTimeout(function () {
                            this_.putFeaturesOnTheElement(this_.oOverlayFeatures_.getArray());
                        });
                    }
                }, this);

    } else if (type === 'deleteHole') {

        //Ajoute la tooltip
        oVmap.getMap().getMapTooltip().displayMessage("Cliquez dans un trou pour le supprimer");

        // Ajoute les trous dans la couche oOverlayHolesLayer_
        this.addHolesIntoHolesLayer();

        // Ajoute l'interraction de suppresion des trous
        oVmap.getMap().setInteraction(this.deleteHole_, 'basicTools-select-' + type);

    } else {
        console.error('startEdition: type (' + type + ') not allowed');
        return 0;
    }
};

/**
 * Cancel the edition
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.cancelEdition = function () {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.cancelEdition');

    // Supprime les interractions
    oVmap.getMap().removeActionsOnMap();

    // Cache la tooltip
    oVmap.getMap().getMapTooltip().hide();

    // vide oOverlayHolesLayer_
    this.oOverlayHolesLayer_.getSource().clear();
};

/**
 * This function add the holes contained into oOverlayLayer_ to oOverlayHolesLayer_
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.addHolesIntoHolesLayer = function () {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.addHolesIntoHolesLayer');

    var aFeatures = this.oOverlayFeatures_.getArray();

    this.oOverlayHolesLayer_.getSource().clear();

    for (var i = 0; i < aFeatures.length; i++) {
        var aLinearRings = aFeatures[i].getGeometry().getLinearRings();
        if (aLinearRings.length > 1) {

            for (var ii = 1; ii < aLinearRings.length; ii++) {

                var newPolygon = new ol.geom.Polygon();
                newPolygon.setCoordinates([aLinearRings[ii].getCoordinates()]);

                this.oOverlayHolesLayer_.getSource().addFeature(new ol.Feature({
                    geometry: newPolygon
                }));
            }
        }
    }
};

/**
 * Delete the selected hole
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.deleteHole = function () {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.deleteHole');

    var this_ = this;

    /**
     * Holes selected by deleteHole_
     * @type array
     */
    var aSelectedHoles = this.deleteHole_.getFeatures().getArray();

    if (aSelectedHoles.length > 0) {
        for (var i = 0; i < aSelectedHoles.length; i++) {

            /**
             * Selected hole
             * @type ol.geom.polygon
             */
            var hole = aSelectedHoles[i].getGeometry();

            var bHoleFounded = false;

            // Compare pour chaque polygone si il a un trou ayant les mêmes coordonnées que hole
            var aFeatures = this.oOverlayFeatures_.getArray();
            for (var ii = 0; ii < aFeatures.length; ii++) {
                var aHolesCoords = aFeatures[ii].getGeometry().getCoordinates();
                for (var iii = aHolesCoords.length - 1; iii >= 0; iii--) {
                    if (angular.equals(hole.getCoordinates()[0], aHolesCoords[iii])) {
                        aHolesCoords.splice(iii, 1);
                        bHoleFounded = true;
                    }
                }
                aFeatures[ii].getGeometry().setCoordinates(aHolesCoords);
            }
            if (bHoleFounded)
                this.oOverlayHolesLayer_.getSource().removeFeature(aSelectedHoles[i]);
        }

        this.deleteHole_.getFeatures().clear();


        setTimeout(function () {
            this_.putFeaturesOnTheElement(this_.oOverlayFeatures_.getArray());
        });
    }
};

/**
 * Start the drawing experience
 * @param {ol.geom} type geometry type
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.startDrawing = function (type) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.startDrawing');

    var this_ = this;

    // Lance setDrawInteraction avec this.oOverlayFeatures_ comme cible pour les features
    this.draw_ = oVmap.getMap().setDrawInteraction({
        type: type,
        features: this.oOverlayFeatures_
    }, 'basicTools-select-insert' + type);
    this.draw_.on('drawend', function (evt) {

        // Récupère la feature ajoutée
        var feature = evt.feature;

        setTimeout(function () {

            // Transforme les cercles en polygones de 32 côtés
            // car ils ne sont pas acceptés par WKT
            if (type === 'Circle') {
                var circleGeom = feature.getGeometry();
                var polygonGeom = new ol.geom.Polygon.fromCircle(circleGeom);

                // Supprime l'ancienne feature de l'overlay
                this_.oOverlayLayer_.getSource().removeFeature(feature);

                feature = new ol.Feature({
                    geometry: polygonGeom
                });

                // Ajoute la nouvelle feature à l'overlay
                this_.oOverlayLayer_.getSource().addFeature(feature);
            }

            // Ajoute les géométries en mode multi ou simple à editableSelection.olFeature
            this_.putFeaturesOnTheElement(this_.oOverlayFeatures_.getArray());
        });
    }, this);
};

/**
 * Put the array of features passed on aFeatures on editableSelection.olFeature with MULTI... form
 * @param {array} aFeatures
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.putFeaturesOnTheElement = function (aFeatures) {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.putFeaturesOnTheElement');

    if (!goog.isDefAndNotNull(aFeatures)) {
        console.error('aFeatures undefined');
        return 0;
    }
    if (!goog.isArray(aFeatures)) {
        console.error('aFeatures is not an array');
        return 0;
    }

    // Cas de feature simple
    if (this['editableFeatureType'].substr(0, 5) !== 'MULTI' && this['editableFeatureType'] !== 'GEOMETRYCOLLECTION') {
        // La nouvelle feature devient la feature de référence
        this['editableSelection']['olFeature'] = aFeatures[aFeatures.length - 1];
        // Supprime les aurtes features
        for (var i = 0; i < aFeatures.length - 1; i++) {
            this.oOverlayLayer_.getSource().removeFeature(aFeatures[i]);
        }
    }
    // Cas de feature multiple
    else {
        if (this['editableFeatureType'] === 'MULTIPOLYGON') {
            var oMultiPolygon = new ol.geom.MultiPolygon();
            for (var i = 0; i < aFeatures.length; i++) {
                if (aFeatures[i].getGeometry().getType() === 'Polygon')
                    oMultiPolygon.appendPolygon(aFeatures[i].getGeometry());
            }
            this['editableSelection']['olFeature'] = new ol.Feature({geometry: oMultiPolygon});
        }
        if (this['editableFeatureType'] === 'MULTILINESTRING') {
            var oMultiLineString = new ol.geom.MultiLineString();
            for (var i = 0; i < aFeatures.length; i++) {
                if (aFeatures[i].getGeometry().getType() === 'LineString')
                    oMultiLineString.appendLineString(aFeatures[i].getGeometry());
            }
            this['editableSelection']['olFeature'] = new ol.Feature({geometry: oMultiLineString});
        }
        if (this['editableFeatureType'] === 'MULTIPOINT') {
            var oMultiPoint = new ol.geom.MultiPoint();
            for (var i = 0; i < aFeatures.length; i++) {
                if (aFeatures[i].getGeometry().getType() === 'Point')
                    oMultiPoint.appendPoint(aFeatures[i].getGeometry());
            }
            this['editableSelection']['olFeature'] = new ol.Feature({geometry: oMultiPoint});
        }
    }
};

/**
 * Put the features in editableSelection.olFeature on the map (disabling the Multi.... form)
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.putElementFeatureOnOverlay = function () {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.putElementFeatureOnOverlay');

    if (!goog.isDefAndNotNull(this['editableSelection']['olFeature'])) {
        console.error("this['editableSelection']['olFeature'] not defined");
        return 0;
    }
    if (!goog.isDefAndNotNull(this['editableSelection']['olFeature'].getGeometry())) {
        console.error("this['editableSelection']['olFeature'].getGeometry() not defined");
        return 0;
    }

    // Cas de feature simple
    if (this['editableFeatureType'].substr(0, 5) !== 'MULTI' && this['editableFeatureType'] !== 'GEOMETRYCOLLECTION') {
        this.oOverlayLayer_.getSource().clear;
        this.oOverlayLayer_.getSource().addFeature(this['editableSelection']['olFeature']);
    }
    // Cas de feature multiple
    else {
        var aFeatures = [];
        var aGeoms = [];

        if (this['editableFeatureType'] === 'MULTIPOINT') {
            aGeoms = goog.array.clone(this['editableSelection']['olFeature'].getGeometry().getPoints());
        }
        if (this['editableFeatureType'] === 'MULTILINESTRING') {
            aGeoms = goog.array.clone(this['editableSelection']['olFeature'].getGeometry().getLineStrings());
        }
        if (this['editableFeatureType'] === 'MULTIPOLYGON') {
            aGeoms = goog.array.clone(this['editableSelection']['olFeature'].getGeometry().getPolygons());
        }

        for (var i = 0; i < aGeoms.length; i++) {
            aFeatures.push(new ol.Feature({
                geometry: aGeoms[i]
            }));
        }
        this.oOverlayLayer_.getSource().clear;
        this.oOverlayLayer_.getSource().addFeatures(aFeatures);
    }

};

/**
 * Submit the geometry modifications
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.submitGeomEdition = function () {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.submitGeomEdition');

    var oFormValues = {};
    oFormValues[this['editableSelection']['bo_id_field']] = this['editableSelection']['bo_id_value'];

    if (goog.isDefAndNotNull(this['editableSelection']['olFeature']))
        oFormValues[this['editableSelection']['geom_column']] = oVmap.getEWKTFromGeom(this['editableSelection']['olFeature'].getGeometry());
    else
        oFormValues[this['editableSelection']['geom_column']] = '';

    this.updateBOValues(this['editableSelection']['bo_type'], oFormValues, function () {
        oVmap.getToolsManager().getBasicTools().toggleOutTools();
    }, function () {
        oVmap.getToolsManager().getBasicTools().toggleOutTools();
    });
};

/**
 * Write the feature into the EditForm oFormValues and open it
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.validateGeomAndDisplayEditForm = function () {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.prototype.validateGeomAndDisplayEditForm');

    var this_ = this;

    var editFormReaderScope = this.getEditFormReaderScope();
    editFormReaderScope.$evalAsync(function () {

        if (goog.isDefAndNotNull(this_['editableSelection']['olFeature']))
            if (goog.isDefAndNotNull(this_['editableSelection']['olFeature'].getGeometry()))
                editFormReaderScope['oFormValues']['update'][this_['editableSelection']['geom_column']] = oVmap.getEWKTFromGeom(this_['editableSelection']['olFeature'].getGeometry());
            else
                editFormReaderScope['oFormValues']['update'][this_['editableSelection']['geom_column']] = '';
        else
            editFormReaderScope['oFormValues']['update'][this_['editableSelection']['geom_column']] = '';


        // Cache la palette de modification
        $('#basictools-select-modify-palette').hide();

        // Enlève les interractions
        oVmap.getMap().removeActionsAndTooltips();

        // Affiche le formulaire d'édition
        $('#select-edit-modal').modal('show');

        // Enlève la feature de la carte
        this_.clearOverlays();
    });
};

/**
 * Remove all was did during the geometry edition
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.clearOverlays = function () {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.clearOverlays');

    // Supprime la feature
    if (this.oOverlayLayer_.getSource().getFeaturesCollection().getLength() > 0) {
        this.oOverlayLayer_.getSource().clear();
    }
    if (this.oOverlayHolesLayer_.getSource().getFeaturesCollection().getLength() > 0) {
        this.oOverlayHolesLayer_.getSource().clear();
    }
};

/**
 * Remove all was did during the geometry edition
 * @export
 */
nsVmap.nsToolsManager.Select.prototype.selectController.prototype.finishEdition = function () {
    oVmap.log('nsVmap.nsToolsManager.Select.prototype.selectController.finishEdition');

    // Supprime la feature
    this.clearOverlays();

    // Cache la tooltip
    oVmap.getMap().getMapTooltip().hide();

    // cache la palette d'édition
    oVmap.getToolsManager().getBasicTools().toggleOutTools();
};



// Définit la directive et le controller
oVmap.module.directive('appSelect', nsVmap.nsToolsManager.Select.prototype.selectDirective);
oVmap.module.controller('AppSelectController', nsVmap.nsToolsManager.Select.prototype.selectController);
/* global goog, nsVmap, oVmap, bootbox, vitisApp, this */

goog.provide('nsVmap.importBoCtrl');
goog.require('oVmap');

/**
 * ImportBo controller
 * @param {object} $scope
 * @param {object} $log
 * @param {object} $q
 * @returns {nsVmap.importBoCtrl}
 * @export
 * @ngInject
 */
nsVmap.importBoCtrl = function ($scope, $log, $q, $translate) {
    $log.info("nsVmap.importBoCtrl");

    this.$log_ = $log;
    this.$scope_ = $scope;
    this.$q_ = $q;
    this.$translate_ = $translate;
    this.mainScope_ = angular.element(vitisApp.appMainDrtv).scope();

    this['oProperties'] = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
    this['sToken'] = sessionStorage['session_token'];
    this['oTranslations'] = {};

    this.aImportedObjects_ = [];
    this.schemaRegexp_ = new RegExp(/^([a-zA-Z0-9_]*)$/);

    /**
     * Current step
     */
    $scope['displayedStep'] = 'import_folder';

    /**
     * The imported bo
     */
    $scope['oImportedBo'] = null;

    /**
     * Database to use
     */
    $scope['usedDatabase'] = null;

    /**
     * Schema to use
     */
    $scope['usedSchema'] = null;

    /**
     * Coordsys to use
     */
    $scope['oCoordsys'] = null;

    /**
     * Sql to execute
     */
    $scope['sSql'] = null;

    // Listes
    $scope['aDatabases'] = [];
    $scope['aSchemas'] = [];
    $scope['aCoordsys'] = [];
    $scope['aConnections'] = null;
    $scope['aWmsServices'] = null;
    $scope['aVmapServices'] = null;

    // Étape choix schéma
    $scope['creatingNewSchema'] = '';
    $scope['selectedExistingSchema'] = '';

    // Valeurs définition
    $scope['oBoDef'] = null;
    $scope['oEventDef'] = null;
    $scope['aReportsDef'] = null;
    $scope['aLayersDef'] = [];

    // Formulaires
    $scope['oBoForm'] = null;
    $scope['oEventForm'] = null;
    $scope['oReportForm'] = null;

    // Éléments à importer
    $scope['selectedSteps'] = {
        'import_sql': true,
        'import_layers': true,
        'import_bo': true
    };

    // Execution import    
    $scope['oImportSteps'] = {
        'test': null,
        'business_object': null,
        'business_object_reports': null,
        'business_object_events': null,
        'layers': null,
        'sql': null
    };
    $scope['oTestSteps'] = {
        'business_objet': null,
        'reports': null,
        'event': null,
        'layers': null,
        'schema': null,
        'tables': null
    };
    $scope['bImportOk'] = false;

    // Étapes
    $scope['steps'] = ['import_folder', 'select_elements', 'select_database', 'import_schema', 'import_coordsys', 'import_sql', 'import_layers', 'import_bo', 'execute_import', 'finalize'];

    // Traductions
    this.importTranslations_();
};


// Fonctions publiques

/**
 * Function called to submit a step
 * @param {string} step
 * @export
 */
nsVmap.importBoCtrl.prototype.submitStep = function (step) {
    this.$log_.info("nsVmap.importBoCtrl.submitStep");

    var this_ = this;

    switch (step) {
        case 'import_folder':
            this.importFolder_();
            break;
        case 'select_elements':
            this.validateSelectedSteps_().then(function () {
                this_.nextStep();
            });
            break;
        case 'select_database':
            this.validateDatabase_().then(function () {
                this_.nextStep();
            });
            break;
        case 'import_schema':
            this.validateSchema_().then(function () {
                this_.nextStep();
            });
            break;
        case 'import_coordsys':
            this.validateCoordsys_().then(function () {
                this_.nextStep();
            });
            break;
        case 'import_layers':
            this.validateLayers_().then(function () {
                this_.nextStep();
            });
            break;
        case 'import_bo':
            this.submitBo_();
            this.validateBo_().then(function (bTestResult) {
                if (bTestResult === true) {
                    this_.nextStep();
                } else {
                    this_.loadBo_();
                }
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
nsVmap.importBoCtrl.prototype.nextStep = function () {
    this.$log_.info("nsVmap.importBoCtrl.nextStep");

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
nsVmap.importBoCtrl.prototype.prevStep = function () {
    this.$log_.info("nsVmap.importBoCtrl.prevStep");

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
nsVmap.importBoCtrl.prototype.goStep = function (step) {
    this.$log_.info("nsVmap.importBoCtrl.goStep");

    var this_ = this;

    // Cas où il faille ignorer l'étape
    switch (step) {
        case 'import_sql':
        case 'import_layers':
        case 'import_bo':
            if (this.$scope_['selectedSteps'][step] === false) {
                var currentIndex = this.$scope_['steps'].indexOf(this.$scope_['displayedStep']);
                var stepIndex = this.$scope_['steps'].indexOf(step);
                if (currentIndex !== -1 && stepIndex !== -1) {
                    this.$scope_['displayedStep'] = step;
                    if (currentIndex < stepIndex) {
                        this_.nextStep();
                        return true;
                    }
                    if (currentIndex > stepIndex) {
                        this_.prevStep();
                        return true;
                    }
                }
                break;
            }
            break;
    }

    // Fonctions à appeler lors du changement
    switch (step) {
        case 'select_database':
            this.loadDatabases_().then(function () {
                this_.$scope_['displayedStep'] = step;
            });
            break;
        case 'select_elements':
            this_.$scope_['displayedStep'] = step;
            break;
        case 'import_schema':
            this.loadSchemas_().then(function () {
                this_.$scope_['displayedStep'] = step;
            });
            break;
        case 'import_coordsys':
            this.loadCoordsys_().then(function () {
                this_.$scope_['displayedStep'] = step;
            });
            break;
        case 'import_sql':
            this.loadSql_();
            this.$scope_['displayedStep'] = step;
            break;
        case 'import_layers':
            this.loadLayers_().then(function () {
                this_.$scope_['displayedStep'] = step;
            });
            break;
        case 'import_bo':
            this.loadBo_();
            this.$scope_['displayedStep'] = step;
            break;
        case 'execute_import':
            this.$scope_['oImportSteps'] = {
                'test': null,
                'business_object': null,
                'business_object_reports': null,
                'business_object_events': null,
                'layers': null,
                'sql': null
            };
            this.$scope_['oTestSteps'] = {
                'business_objet': null,
                'reports': null,
                'event': null,
                'layers': null,
                'schema': null,
                'tables': null
            };
            this.$scope_['displayedStep'] = step;
            break;
        default:
            this.$scope_['displayedStep'] = step;
            break;
    }
};

/**
 * Set scope.usedSchema (called in view)
 * @param {string} sSchema 
 * @param {boolean} bIsNew 
 * @export
 */
nsVmap.importBoCtrl.prototype.setUsedSchema = function (sSchema, bIsNew) {
    this.$log_.info("nsVmap.importBoCtrl.setUsedSchema");

    if (bIsNew) {
        this.$scope_['selectedExistingSchema'] = '';
    } else {
        this.$scope_['creatingNewSchema'] = '';
    }

    if ((!goog.isDefAndNotNull(this.$scope_['creatingNewSchema']) || this.$scope_['creatingNewSchema'] === '')
            && (!goog.isDefAndNotNull(this.$scope_['selectedExistingSchema']) || this.$scope_['selectedExistingSchema'] === '')) {
        this.$scope_['usedSchema'] = null;
    } else {
        this.$scope_['usedSchema'] = sSchema;
    }

};

/**
 * Run the import execution
 * @param {boolean} bOnlyTest
 * @export
 */
nsVmap.importBoCtrl.prototype.executeImport = function (bOnlyTest) {
    this.$log_.info("nsVmap.importBoCtrl.executeImport");

    var this_ = this;

    this.$scope_['bImportOk'] = false;
    this.$scope_['oImportSteps'] = {
        'test': null,
        'business_object': null,
        'business_object_reports': null,
        'business_object_events': null,
        'layers': null,
        'sql': null
    };

    // Contient les objets importés, est utilisé pour les backup
    goog.array.clear(this.aImportedObjects_);

    // Test import
    this.$scope_['oImportSteps']['test'] = false;
    this.testImport_().then(function (bResult) {

        // Tests Ok
        if (bResult === true) {
            this_.$scope_['oImportSteps']['test'] = true;

            if (bOnlyTest) {
                return null;
            }

            // Import Objet métier
            this_.importBo_().then(function (bResult) {
                if (bResult === true) {
                    this_.$scope_['oImportSteps']['business_object'] = true;

                    // Import Rapports
                    this_.importReports_().then(function (bResult) {
                        if (bResult === true) {
                            this_.$scope_['oImportSteps']['business_object_reports'] = true;

                            // Import Événements
                            this_.importEvent_().then(function (bResult) {
                                if (bResult === true) {
                                    this_.$scope_['oImportSteps']['business_object_events'] = true;

                                    // Import Couches
                                    this_.importLayers_().then(function (bResult) {
                                        if (bResult === true) {
                                            this_.$scope_['oImportSteps']['layers'] = true;

                                            // Import Modèle de données
                                            this_.importSql_().then(function (bResult) {
                                                if (bResult === true) {
                                                    this_.$scope_['oImportSteps']['sql'] = true;
                                                    this_.$scope_['bImportOk'] = true;
                                                } else {
                                                    this_.cancelImport();
                                                    this_.$scope_['oImportSteps']['sql'] = false;
                                                }
                                            });
                                        } else {
                                            this_.cancelImport();
                                            this_.$scope_['oImportSteps']['layers'] = false;
                                        }
                                    });
                                } else {
                                    this_.cancelImport();
                                    this_.$scope_['oImportSteps']['business_object_events'] = false;
                                }
                            });
                        } else {
                            this_.cancelImport();
                            this_.$scope_['oImportSteps']['business_object_reports'] = false;
                        }
                    });
                } else {
                    this_.cancelImport();
                    this_.$scope_['oImportSteps']['business_object'] = false;
                }
            });
        } else {
            this_.$scope_['oImportSteps']['test'] = false;
        }
    });
};

/**
 * Cancel the import and delete all the posted elements
 * @export
 */
nsVmap.importBoCtrl.prototype.cancelImport = function () {
    this.$log_.info("nsVmap.importBoCtrl.cancelImport");

    var this_ = this;

    var i = this.aImportedObjects_.length;
    var recursiveDelete = function () {
        i--;
        if (i >= 0) {
            this_.deleteObject_(this_.aImportedObjects_[i]['sRessource'], this_.aImportedObjects_[i]['sId']).then(function () {
                recursiveDelete();
            });
        }
    };
    recursiveDelete();
};

/**
 * Close the import modal
 * @export
 */
nsVmap.importBoCtrl.prototype.closeImportModal = function () {
    this.$log_.info("nsVmap.importBoCtrl.closeImportModal");

    $('.bootbox.modal').each(function () {
        $(this).modal('hide');
    });

    this.mainScope_['setMode']('development');
};


// Utiles

/**
 * Import the translations in this.oTranslations
 * @private
 */
nsVmap.importBoCtrl.prototype.importTranslations_ = function () {

    var this_ = this;

    var aTranslationsCodes = [];

    // étapes
    for (var i = 0; i < this.$scope_['steps'].length; i++) {
        aTranslationsCodes.push('CTRL_IMPORT_BO_STEP_' + this.$scope_['steps'][i]);
    }

    // erreurs
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_SELECT_FOLDER');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_NO_FOLDER_RESULT');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_NO_DB_CONNECTION');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_ANY_SELECTED_STEP_SELECTED');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_NO_DB_VALID');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_NO_SCHEMA_VALID');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_NO_COORDSYS_VALID');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_NO_VALID_LAYER_1');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_NO_VALID_LAYER_2');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_NO_COMPLETE_OBJECT');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_OBJECT_ALREADY_EXISTS');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_NO_DEFINED_SCHEMA');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_NO_TABLES_TO_IMPORT');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_TABLE_ALREADY_PRESENT');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_NO_DEFINED_SCHEMA');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_1');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_2_IMPORT');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_2_ASSOCIATE_LAYER');
    aTranslationsCodes.push('CTRL_IMPORT_BO_ERROR_REMOVE_ERROR');

    this.$translate_(aTranslationsCodes).then(function (aTranslations) {
        this_['oTranslations'] = aTranslations;
    });
};

/**
 * Get if a schema is new
 * @param {string} sSchema
 * @private
 */
nsVmap.importBoCtrl.prototype.isNewSchema_ = function (sSchema) {
    var bIsNew = this.$scope_['aSchemas'].indexOf(sSchema) === -1;
    return bIsNew;
};

/**
 * Import the package definition folder in #import-bo-folder-input to the server
 * @private
 */
nsVmap.importBoCtrl.prototype.importFolder_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.importFolder_");

    var this_ = this;

    var aFiles = $('#import-bo-folder-input').prop('files');

    if (!goog.isDefAndNotNull(aFiles[0])) {
        $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_SELECT_FOLDER'], 'error');
        return null;
    }

    var oFormData_ = new FormData();
    oFormData_.append('package_definition', aFiles[0]);

    ajaxRequest({
        'method': 'POST',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vmap/businessobjects/package_definition',
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'data': oFormData_,
        'scope': this.$scope_,
        'success': function (response) {

            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
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
            if (!goog.isDefAndNotNull(response['data']['businessobjects'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_NO_FOLDER_RESULT'], "error");
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['businessobjects'][0])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_NO_FOLDER_RESULT'], "error");
                return null;
            }
            if (response['data']['status'] !== 1) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
                return null;
            }

            this_.$scope_['oImportedBo'] = response['data']['businessobjects'][0];

            this_.nextStep();

        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
        }
    });
};

/**
 * Submit business object step
 * @private
 */
nsVmap.importBoCtrl.prototype.submitBo_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.submitBo_");

    var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);

    // Formulaire Objet métier
    var oBoDefFormReader = angular.element($('#import_bo_def_formreader').children()).scope();
    var oBoDefFormValues = formSrvc['getFormData'](oBoDefFormReader['sFormDefinitionName'], true, {
        'oFormDefinition': oBoDefFormReader['oFormDefinition'],
        'oFormValues': oBoDefFormReader['oFormValues']
    });
    this.$scope_['oBoDef'] = oBoDefFormValues;

    // Formulaire Événements
    if (goog.isDefAndNotNull(this.$scope_['oEventDef'])) {
        var oBoEventFormReader = angular.element($('#import_bo_event_formreader').children()).scope();
        var oBoEventFormValues = formSrvc['getFormData'](oBoEventFormReader['sFormDefinitionName'], true, {
            'oFormDefinition': oBoEventFormReader['oFormDefinition'],
            'oFormValues': oBoEventFormReader['oFormValues']
        });
        this.$scope_['oEventDef'] = oBoEventFormValues;
    }

    // Formulaires Rapports
    if (goog.isDefAndNotNull(this.$scope_['aReportsDef'])) {
        var aBoReportFormReaders = [];
        for (var i = 0; i < this.$scope_['aReportsDef'].length; i++) {
            aBoReportFormReaders[i] = angular.element($('#import_bo_reports_' + this.$scope_['aReportsDef'][i]['printreport_id'] + '_formreader').children()).scope();
        }
        var aBoReportValues = [];
        for (var i = 0; i < aBoReportFormReaders.length; i++) {
            aBoReportValues[i] = formSrvc['getFormData'](aBoReportFormReaders[i]['sFormDefinitionName'], true, {
                'oFormDefinition': aBoReportFormReaders[i]['oFormDefinition'],
                'oFormValues': aBoReportFormReaders[i]['oFormValues'],
                'aParamsToSave': ['printreport_id']
            });
        }
        this.$scope_['aReportsDef'] = aBoReportValues;
    }

    if (goog.isDefAndNotNull(this.$scope_['oImportedBo'])) {
        if (goog.isDefAndNotNull(this.$scope_['oImportedBo']['json'])) {
            this.$scope_['oImportedBo']['json']['business_object'] = this.$scope_['oBoDef'];
            if (goog.isDefAndNotNull(this.$scope_['oEventDef'])) {
                this.$scope_['oImportedBo']['json']['event'] = this.$scope_['oEventDef'];
            }
            if (goog.isDefAndNotNull(this.$scope_['aReportsDef'])) {
                this.$scope_['oImportedBo']['json']['reports'] = this.$scope_['aReportsDef'];
            }
        }
    }
};

/**
 * Make an ajax request and return the form un a promise
 * @param {string} sForm (vmap_business_object, vmap_printreport, vmap_event)
 * @returns {defer.promise}
 * @private
 */
nsVmap.importBoCtrl.prototype.getJsonForm_ = function (sForm) {
    this.$log_.info("nsVmap.importBoCtrl.getJsonForm_");

    var this_ = this;

    var deferred = this.$q_.defer();

    if (!goog.isString(sForm)) {
        console.error('importBoCtrl.getJsonForm missing parameter sForm');
        return null;
    }

    if (sForm === 'vmap_business_object') {
        var sUrl = this['oProperties']['web_server_name'] + '/' + sessionStorage['appEnv'] + '/modules/vmap/forms/vmap_business_object/vmap_business_object_vmap_business_object.json';
    }
    if (sForm === 'vmap_printreport') {
        var sUrl = this['oProperties']['web_server_name'] + '/' + sessionStorage['appEnv'] + '/modules/vmap/forms/vmap_business_object/vmap_business_object_vmap_business_object_printreport.json';
    }
    if (sForm === 'vmap_event') {
        var sUrl = this['oProperties']['web_server_name'] + '/' + sessionStorage['appEnv'] + '/modules/vmap/forms/vmap_business_object/vmap_business_object_vmap_business_object_event.json';
    }

    ajaxRequest({
        'method': 'GET',
        'url': sUrl,
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'params': {
            'vitis_version': this['oProperties']['build']
        },
        'scope': this.$scope_,
        'success': function (response) {
            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
                return null;
            }
            var oForm = response['data'];
            deferred.resolve(this_.prepareForm_(oForm, sForm));
        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
        }
    });

    return deferred.promise;
};

/**
 * Delete the last line of a form if it's a buttons line
 * Disable the schema field
 * @param {object} oForm
 * @param {string} sForm
 * @returns {object}
 */
nsVmap.importBoCtrl.prototype.prepareForm_ = function (oForm, sForm) {
    this.$log_.info("nsVmap.prepareForm_");

    var lastRow;
    var oDisabledFields = {
        'vmap_business_object': ['database', 'schema', 'table', 'id_field', 'event_id'],
        'vmap_printreport': ['business_object_id'],
        'vmap_event': []
    };
    var oTextFields = {
        'vmap_business_object': ['event_id'],
        'vmap_printreport': ['business_object_id'],
        'vmap_event': []
    };

    for (var key in oForm) {
        if (goog.isArray(oForm[key]['rows'])) {

            // Supprime les boutons de la dernière ligne
            lastRow = oForm[key]['rows'][oForm[key]['rows'].length - 1];
            if (goog.isArray(lastRow['fields'])) {
                for (var i = lastRow['fields'].length - 1; i >= 0; i--) {
                    if (lastRow['fields'][i]['type'] === 'button') {
                        lastRow['fields'].splice(i, 1);
                    }
                }
            }
            delete i;

            // Disable fields
            if (goog.isDefAndNotNull(oDisabledFields[sForm])) {
                for (var i = 0; i < oForm[key]['rows'].length; i++) {
                    if (goog.isArray(oForm[key]['rows'][i]['fields'])) {
                        for (var ii = 0; ii < oForm[key]['rows'][i]['fields'].length; ii++) {
                            if (oDisabledFields[sForm].indexOf(oForm[key]['rows'][i]['fields'][ii]['name']) !== -1) {
                                oForm[key]['rows'][i]['fields'][ii]['disabled'] = true;
                            }
                            if (oDisabledFields[sForm].indexOf(oForm[key]['rows'][i]['fields'][ii]['name']) !== -1) {
                                oForm[key]['rows'][i]['fields'][ii]['type'] = 'text';
                            }
                        }
                    }
                }
            }
            delete i;
            delete ii;
        }
    }

    return oForm;
};


// Fonctions de Chargement

/**
 * Load the avaliable databases list
 * @private
 */
nsVmap.importBoCtrl.prototype.loadDatabases_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.loadDatabases_");

    var this_ = this;
    var deferred = this.$q_.defer();
    var aUnallowedDatabases = ['postgres'];

    if (!goog.isDefAndNotNull(this.$scope_['usedDatabase'])) {
        goog.array.clear(this.$scope_['aDatabases']);
        ajaxRequest({
            'method': 'GET',
            'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vitis/genericquerys/databases',
            'headers': {
                'Accept': 'application/x-vm-json'
            },
            'scope': this.$scope_,
            'success': function (response) {

                if (!goog.isDefAndNotNull(response['data'])) {
                    $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
                    return null;
                }
                if (!goog.isDefAndNotNull(response['data']['data'])) {
                    console.error("Aucun résultat: databases", response);
                    return null;
                }

                for (var i = 0; i < response['data']['data'].length; i++) {
                    if (goog.isDefAndNotNull(response['data']['data'][i]['database'])) {
                        if (aUnallowedDatabases.indexOf(response['data']['data'][i]['database']) === -1) {
                            this_.$scope_['aDatabases'].push(response['data']['data'][i]['database']);
                        }
                    }
                }

                this_.$scope_['usedDatabase'] = this_['oProperties']['database'];
                deferred.resolve();
            },
            'error': function (response) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
            }
        });
    } else {
        setTimeout(function () {
            deferred.resolve();
        });
    }

    return deferred.promise;
};

/**
 * Load the avaliable schemas list
 * @private
 */
nsVmap.importBoCtrl.prototype.loadSchemas_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.loadSchemas_");

    var this_ = this;
    var deferred = this.$q_.defer();
    var aUnallowedSchemas = ['pg_catalog', 'information_schema'];

    goog.array.clear(this.$scope_['aSchemas']);

    ajaxRequest({
        'method': 'GET',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vitis/genericquerys/' + this.$scope_['usedDatabase'] + '/schemas',
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'scope': this.$scope_,
        'success': function (response) {

            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['data'])) {
                console.error("Aucun résultat: schemas", response);
                return null;
            }

            for (var i = 0; i < response['data']['data'].length; i++) {
                if (goog.isDefAndNotNull(response['data']['data'][i]['schema_name'])) {
                    if (aUnallowedSchemas.indexOf(response['data']['data'][i]['schema_name']) === -1) {
                        this_.$scope_['aSchemas'].push(response['data']['data'][i]['schema_name']);
                    }
                }
            }

            // Pré-rempli le choix du schéma à utiliser
            setTimeout(function () {
                if (goog.isDefAndNotNull(this_.$scope_['usedSchema'])) {
                    if (this_.$scope_['aSchemas'].indexOf(this_.$scope_['usedSchema']) !== -1) {
                        this_.$scope_['selectedExistingSchema'] = this_.$scope_['usedSchema'];
                        this_.$scope_['creatingNewSchema'] = '';
                    } else {
                        this_.$scope_['creatingNewSchema'] = this_.$scope_['usedSchema'];
                        this_.$scope_['selectedExistingSchema'] = '';
                    }
                }
            });

            deferred.resolve();
        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
        }
    });

    return deferred.promise;
};

/**
 * Load the avaliable coordinate systems
 * @private
 */
nsVmap.importBoCtrl.prototype.loadCoordsys_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.loadCoordsys_");

    var this_ = this;
    var deferred = this.$q_.defer();

    if (!goog.isDefAndNotNull(this_.$scope_['oCoordsys'])) {
        goog.array.clear(this_.$scope_['aCoordsys']);
        ajaxRequest({
            'method': 'GET',
            'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vm4ms/coordinatesystems',
            'headers': {
                'Accept': 'application/x-vm-json'
            },
            'params': {
                'order_by': 'coordsys_id'
            },
            'scope': this.$scope_,
            'success': function (response) {

                if (!goog.isDefAndNotNull(response['data'])) {
                    $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
                    return null;
                }
                if (!goog.isDefAndNotNull(response['data']['data'])) {
                    console.error("Aucun résultat: coordinatesystems", response);
                    return null;
                }

                this_.$scope_['aCoordsys'] = response['data']['data'];

                // Pré-rempli le choix du coordsys à utiliser
                if (goog.isDefAndNotNull(this_.$scope_['oImportedBo']['sql'])) {
                    if (goog.isDefAndNotNull(this_.$scope_['oImportedBo']['sql']['structure'])) {
                        if (goog.isDefAndNotNull(this_.$scope_['oImportedBo']['sql']['structure']['srid'])) {
                            var sProposedSRID = this_.$scope_['oImportedBo']['sql']['structure']['srid'];

                            for (var i = 0; i < this_.$scope_['aCoordsys'].length; i++) {
                                if (parseFloat(this_.$scope_['aCoordsys'][i]['coordsys_id']) === parseFloat(sProposedSRID)) {
                                    this_.$scope_['oCoordsys'] = this_.$scope_['aCoordsys'][i];
                                }
                            }
                        }
                    }
                }

                deferred.resolve();
            },
            'error': function (response) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
            }
        });
    } else {
        setTimeout(function () {
            deferred.resolve();
        });
    }

    return deferred.promise;
};

/**
 * Load the SQL to insert
 * @private
 */
nsVmap.importBoCtrl.prototype.loadSql_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.loadSql_");

    // Init codemirror
    this.$scope_['codemirrorSQLOptions'] = {
        "styleActiveLine": true,
        "indentWithTabs": true,
        'lineWrapping': true,
        'lineNumbers': true,
        'readOnly': false,
        'mode': 'sql',
        "tabSize": 2,
        'foldGutter': true,
        'gutters': ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    };

    if (!goog.isDefAndNotNull(this.$scope_['sSql'])) {

        this.$scope_['sSql'] = '';

        // Schéma
        if (this.isNewSchema_(this.$scope_['usedSchema'])) {
            if (this.$scope_['usedSchema'].length > 0) {
                this.$scope_['sSql'] += '\n--';
                this.$scope_['sSql'] += '\n-- Creation Schema';
                this.$scope_['sSql'] += '\n--';
                this.$scope_['sSql'] += '\n';
                this.$scope_['sSql'] += '\nCREATE SCHEMA [TABLE_SCHEMA] AUTHORIZATION u_vitis;';
                this.$scope_['sSql'] += '\nGRANT ALL ON SCHEMA [TABLE_SCHEMA] TO u_vitis;';
                this.$scope_['sSql'] += '\n';
                this.$scope_['sSql'] += '\n';
            }
        }

        // Definition tables
        if (goog.isDefAndNotNull(this.$scope_['oImportedBo'])) {
            if (goog.isDefAndNotNull(this.$scope_['oImportedBo']['sql'])) {
                if (goog.isDefAndNotNull(this.$scope_['oImportedBo']['sql']['table'])) {
                    this.$scope_['sSql'] += this.$scope_['oImportedBo']['sql']['table'];
                }
            }
        }
    }
};

/**
 * Load the layers def to insert
 * @private
 */
nsVmap.importBoCtrl.prototype.loadLayers_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.loadLayers_");

    var this_ = this;
    var deferred = this.$q_.defer();

    // Init codemirror
    this.$scope_['codemirrorLayerDefOptions'] = {
        "styleActiveLine": true,
        "indentWithTabs": true,
        'lineWrapping': true,
        'lineNumbers': true,
        'readOnly': false,
        'mode': 'map',
        "tabSize": 2,
        'foldGutter': true,
        'gutters': ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    };


    if (goog.isDefAndNotNull(this.$scope_['aLayersDef'])
            && this.$scope_['aLayersDef'].length > 0) {

    } else {
        // Remplit les informations
        if (goog.isDefAndNotNull(this.$scope_['oImportedBo'])) {
            if (goog.isDefAndNotNull(this.$scope_['oImportedBo']['json'])) {
                if (goog.isDefAndNotNull(this.$scope_['oImportedBo']['json']['mapserver_layers'])) {
                    var aLayers = this.$scope_['oImportedBo']['json']['mapserver_layers'];
                    for (var i = 0; i < aLayers.length; i++) {
                        this.$scope_['aLayersDef'].push({
                            'title': aLayers[i]['title'],
                            'name': aLayers[i]['name'],
                            'ms_layertype_id': aLayers[i]['ms_layertype_id'],
                            'tablename': aLayers[i]['tablename'],
                            'tableidfield': aLayers[i]['tableidfield'],
                            'definition': aLayers[i]['definition'],
                            'database': '[DATABASE]',
                            'tableschema': '[TABLE_SCHEMA]',
                            'coordsys_id': this_.$scope_['oCoordsys']['coordsys_id'],
                            'connection_id': '',
                            'wmsservice_id': '',
                            'private_connection': false,
                            'active': false
                        });
                    }
                }
            }
        }
    }

    // Load la liste des connexions
    if (!goog.isDefAndNotNull(this_.$scope_['aConnections'])) {
        ajaxRequest({
            'method': 'GET',
            'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vm4ms/layerconnections',
            'headers': {
                'Accept': 'application/x-vm-json'
            },
            'params': {
                'order_by': 'name',
//                'filter': 'database=\'' + this_.$scope_['usedDatabase'] + '\''
                'filter': '{"relation": "OR","operators": [{"column":"database","compare_operator":"=","value":"' + this_.$scope_['usedDatabase'] + '"}, {"column":"database","compare_operator":"IS NULL","value":""}]}'
            },
            'scope': this.$scope_,
            'success': function (response) {

                if (!goog.isDefAndNotNull(response['data'])) {
                    $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
                    return null;
                }
                if (response['data']['list_count'] === 0) {
                    $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_NO_DB_CONNECTION'], 'warning');
                    response['data']['data'] = [];
                }
                if (!goog.isDefAndNotNull(response['data']['data'])) {
                    console.error("Aucun résultat: layerconnections", response);
                    return null;
                }

                this_.$scope_['aConnections'] = response['data']['data'];

                if (goog.isDefAndNotNull(this_.$scope_['aVmapServices'])) {
                    deferred.resolve();
                }
            },
            'error': function (response) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
                return null;
            }
        });
    } else {
        setTimeout(function () {
            deferred.resolve();
        });
    }
    // Load la liste des services vMap
    if (!goog.isDefAndNotNull(this_.$scope_['aVmapServices'])) {
        ajaxRequest({
            'method': 'GET',
            'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vmap/services',
            'headers': {
                'Accept': 'application/x-vm-json'
            },
            'scope': this.$scope_,
            'success': function (response) {

                if (!goog.isDefAndNotNull(response['data'])) {
                    $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
                    return null;
                }
                if (!goog.isDefAndNotNull(response['data']['data'])) {
                    console.error("Aucun résultat: services", response);
                    return null;
                }

                this_.$scope_['aVmapServices'] = response['data']['data'];

                if (goog.isDefAndNotNull(this_.$scope_['aConnections'])) {
                    deferred.resolve();
                }

            },
            'error': function (response) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
                return null;
            }
        });
    } else {
        setTimeout(function () {
            deferred.resolve();
        });
    }

    // Refresh the codemirror
    this.$scope_['refreshCodeMirror']();

    return deferred.promise;
};

/**
 * Load business object step
 * @private
 */
nsVmap.importBoCtrl.prototype.loadBo_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.loadBo_");

    var this_ = this;

    if (goog.isDefAndNotNull(this.$scope_['oImportedBo'])) {
        if (goog.isDefAndNotNull(this.$scope_['oImportedBo']['json'])) {

            this.$scope_['oBoDef'] = this.$scope_['oImportedBo']['json']['business_object'];
            this.$scope_['oEventDef'] = this.$scope_['oImportedBo']['json']['event'];
            this.$scope_['aReportsDef'] = this.$scope_['oImportedBo']['json']['reports'];

            // Formulaire Objet métier
            this.$scope_['oBoDef']['database'] = '[DATABASE]';
            this.$scope_['oBoDef']['schema'] = '[TABLE_SCHEMA]';
            this.$scope_['oBoDef']['event_id'] = '[EVENT]';
            var oBoDefFormReader = angular.element($('#import_bo_def_formreader').children()).scope();
            if (!goog.isDefAndNotNull(this.$scope_['oBoForm'])) {
                this.getJsonForm_('vmap_business_object').then(function (oForm) {
                    this_.$scope_['oBoForm'] = oForm;
                    this_.loadBoForm_({
                        'oFormReader': oBoDefFormReader,
                        'sFormDefinitionName': 'insert',
                        'oFormDefinition': this_.$scope_['oBoForm'],
                        'oFormValues': {
                            'insert': angular.copy(this_.$scope_['oBoDef'])
                        }
                    });
                });
            } else {
                // Si le formulaire est déjà défini on modifie juste les valeurs
                this_.loadBoFormValues_({
                    'oFormReader': oBoDefFormReader,
                    'oFormValues': {
                        'insert': angular.copy(this_.$scope_['oBoDef'])
                    }
                });
            }

            // Formulaire Événements
            if (goog.isDefAndNotNull(this.$scope_['oEventDef'])) {
                var oBoEventFormReader = angular.element($('#import_bo_event_formreader').children()).scope();
                if (!goog.isDefAndNotNull(this.$scope_['oEventForm'])) {
                    this.getJsonForm_('vmap_event').then(function (oForm) {
                        this_.$scope_['oEventForm'] = oForm;
                        this_.loadBoForm_({
                            'oFormReader': oBoEventFormReader,
                            'sFormDefinitionName': 'insert',
                            'oFormDefinition': this_.$scope_['oEventForm'],
                            'oFormValues': {
                                'insert': angular.copy(this_.$scope_['oEventDef'])
                            }
                        });
                    });
                } else {
                    // Si le formulaire est déjà défini on modifie juste les valeurs
                    this_.loadBoFormValues_({
                        'oFormReader': oBoEventFormReader,
                        'oFormValues': {
                            'insert': angular.copy(this_.$scope_['oEventDef'])
                        }
                    });
                }
            }

            // Formulaires Rapports
            if (goog.isDefAndNotNull(this.$scope_['aReportsDef'])) {
                for (var i = 0; i < this.$scope_['aReportsDef'].length; i++) {
                    this.$scope_['aReportsDef'][i]['business_object_id'] = '[BUSINESS_OBJECT]';
                }
                if (!goog.isDefAndNotNull(this.$scope_['oReportForm'])) {
                    this.getJsonForm_('vmap_printreport').then(function (oForm) {
                        this_.$scope_['oReportForm'] = oForm;
                        var aBoReportFormReaders = [];
                        for (var i = 0; i < this_.$scope_['aReportsDef'].length; i++) {
                            aBoReportFormReaders[i] = angular.element($('#import_bo_reports_' + this_.$scope_['aReportsDef'][i]['printreport_id'] + '_formreader').children()).scope();
                            this_.loadBoForm_({
                                'oFormReader': aBoReportFormReaders[i],
                                'sFormDefinitionName': 'insert',
                                'oFormDefinition': this_.$scope_['oReportForm'],
                                'oFormValues': {
                                    'insert': angular.copy(this_.$scope_['aReportsDef'][i])
                                }
                            });
                        }
                    });
                } else {
                    var aBoReportFormReaders = [];
                    for (var i = 0; i < this_.$scope_['aReportsDef'].length; i++) {
                        aBoReportFormReaders[i] = angular.element($('#import_bo_reports_' + this_.$scope_['aReportsDef'][i]['printreport_id'] + '_formreader').children()).scope();
                        this_.loadBoForm_({
                            'oFormReader': aBoReportFormReaders[i],
                            'sFormDefinitionName': 'insert',
                            'oFormDefinition': this_.$scope_['oReportForm'],
                            'oFormValues': {
                                'insert': angular.copy(this_.$scope_['aReportsDef'][i])
                            }
                        });
                    }
                }
            }
        }
    }
};

/**
 * Load the FormReader definition and values
 * @param {object} opt_options
 * @param {object} opt_options.oFormReader
 * @param {string} opt_options.sFormDefinitionName
 * @param {object} opt_options.oFormDefinition
 * @param {object|undefined} opt_options.oFormValues
 * @private
 */
nsVmap.importBoCtrl.prototype.loadBoForm_ = function (opt_options) {
    this.$log_.info("nsVmap.importBoCtrl.loadBoForm_");

    var oFormReader = opt_options['oFormReader'];
    var sFormDefinitionName = opt_options['sFormDefinitionName'];
    var oFormDefinition = opt_options['oFormDefinition'];
    var oFormValues = opt_options['oFormValues'];

    if (!goog.isDefAndNotNull(oFormReader)) {
        console.error('cannot execute importBoCtrl.loadBoForm_: missing parameter oFormReader');
        return null;
    }
    if (!goog.isDefAndNotNull(sFormDefinitionName)) {
        console.error('cannot execute importBoCtrl.loadBoForm_: missing parameter sFormDefinitionName');
        return null;
    }
    if (!goog.isDefAndNotNull(oFormDefinition)) {
        console.error('cannot execute importBoCtrl.loadBoForm_: missing parameter oFormDefinition');
        return null;
    }

    oFormReader['ctrl']['setDefinitionName'](sFormDefinitionName);
    if (goog.isDefAndNotNull(oFormValues)) {
        oFormReader['ctrl']['setFormValues'](oFormValues);
    }
    oFormReader['ctrl']['setFormDefinition'](oFormDefinition);
    oFormReader['ctrl']['loadForm']();

};

/**
 * Load the FormReader values
 * @param {object} opt_options
 * @param {object} opt_options.oFormReader
 * @param {object} opt_options.oFormValues
 * @private
 */
nsVmap.importBoCtrl.prototype.loadBoFormValues_ = function (opt_options) {
    this.$log_.info("nsVmap.importBoCtrl.loadBoFormValues_");

    var oFormReader = opt_options['oFormReader'];
    var oFormValues = opt_options['oFormValues'];

    if (!goog.isDefAndNotNull(oFormReader)) {
        console.error('cannot execute importBoCtrl.loadBoFormValues_: missing parameter oFormReader');
        return null;
    }
    if (!goog.isDefAndNotNull(oFormValues)) {
        console.error('cannot execute importBoCtrl.loadBoFormValues_: missing parameter oFormValues');
        return null;
    }

    oFormReader['ctrl']['setFormValues'](oFormValues);
    oFormReader['ctrl']['loadForm']();

};


// Fonctions de validation

/**
 * Check if the given schema is valid
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.validateSelectedSteps_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.validateSelectedSteps_");

    var this_ = this;
    var deferred = this.$q_.defer();
    var bIsValid = false;

    setTimeout(function () {

        if (this_.$scope_['selectedSteps']['import_sql'] !== false ||
                this_.$scope_['selectedSteps']['import_layers'] !== false ||
                this_.$scope_['selectedSteps']['import_bo'] !== false) {
            bIsValid = true;
        }

        if (bIsValid) {
            deferred.resolve(true);
        } else {
            $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_ANY_SELECTED_STEP_SELECTED'], "error");
        }

    });

    return deferred.promise;
};

/**
 * Check if the given schema is valid
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.validateDatabase_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.validateDatabase_");

    var this_ = this;
    var deferred = this.$q_.defer();
    var bIsValid = false;

    setTimeout(function () {

        if (goog.isDefAndNotNull(this_.$scope_['usedDatabase'])) {
            if (goog.isString(this_.$scope_['usedDatabase']) && this_.$scope_['usedDatabase'].length > 0) {
                bIsValid = true;
            }
        }

        if (bIsValid) {
            deferred.resolve(true);
        } else {
            $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_NO_DB_VALID'], "error");
        }

    });

    return deferred.promise;
};

/**
 * Check if the given schema is valid
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.validateSchema_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.validateSchema_");

    var this_ = this;
    var deferred = this.$q_.defer();
    var bIsValid = false;
    var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
    var aUnrecommendedSchemas = ['s_vmap', 's_vitis', 's_vm4ms', 's_majic', 's_cadastre'];

    setTimeout(function () {

        if (goog.isDefAndNotNull(this_.$scope_['usedSchema'])) {
            if (goog.isString(this_.$scope_['usedSchema']) && this_.$scope_['usedSchema'].length > 0) {
                if (this_.schemaRegexp_.test(this_.$scope_['usedSchema'])) {
                    bIsValid = true;
                }
            }
        }

        if (bIsValid) {
            if (aUnrecommendedSchemas.indexOf(this_.$scope_['usedSchema']) !== -1) {
                $translate(['CREATE_BO_ON_UNRECOMMENDED_SCHEMA1', 'CREATE_BO_ON_UNRECOMMENDED_SCHEMA2', 'CREATE_BO_ON_UNRECOMMENDED_SCHEMA3']).then(function (aTranslations) {
                    var oOptions = {
                        "className": "modal-warning",
                        "message": '<b>' + aTranslations['CREATE_BO_ON_UNRECOMMENDED_SCHEMA1'] + this_.$scope_['usedSchema'] + aTranslations['CREATE_BO_ON_UNRECOMMENDED_SCHEMA2'] + '<br>' + aTranslations['CREATE_BO_ON_UNRECOMMENDED_SCHEMA3'] + '</b>',
                        "callback": function (bResponse) {
                            if (bResponse)
                                deferred.resolve(true);
                            else
                                deferred.reject();
                        }
                    };
                    angular.element(vitisApp.appMainDrtv).scope()['modalWindow']('confirm', '', oOptions);
                });
            } else {
                deferred.resolve(true);
            }
        } else {
            $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_NO_SCHEMA_VALID'], "error");
        }

    });

    return deferred.promise;
};

/**
 * Check if the given coordsys is valid
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.validateCoordsys_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.validateCoordsys_");

    var this_ = this;
    var deferred = this.$q_.defer();
    var bIsValid = false;

    setTimeout(function () {

        if (goog.isDefAndNotNull(this_.$scope_['oCoordsys'])) {
            if (goog.isNumber(this_.$scope_['oCoordsys']['coordsys_id']) && this_.$scope_['oCoordsys']['coordsys_id'] > 0) {
                bIsValid = true;
            }
        }

        if (bIsValid) {
            deferred.resolve(true);
        } else {
            $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_NO_COORDSYS_VALID'], "error");
        }

    });

    return deferred.promise;
};

/**
 * Check if the given layers are valid
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.validateLayers_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.validateLayers_");

    var this_ = this;
    var deferred = this.$q_.defer();
    var bIsValid = true;

    var aLayersDef = this.$scope_['aLayersDef'];
    var aRequiredKeys = ['name', 'title', 'coordsys_id', 'wmsservice_id', 'connection_id', 'active', 'ms_layertype_id', 'tableidfield', 'tableschema', 'tablename'];

    setTimeout(function () {
        for (var i = 0; i < aLayersDef.length; i++) {
            if (!this_.checkObjectKeys_(aLayersDef[i], aRequiredKeys)) {
                console.error(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_NO_VALID_LAYER_1'] + aLayersDef[i]['title'] + this_['oTranslations']['CTRL_IMPORT_BO_ERROR_NO_VALID_LAYER_2']);
                this_.mainScope_["modalWindow"]("dialog", "Error", {
                    "className": "modal-danger",
                    "message": this_['oTranslations']['CTRL_IMPORT_BO_ERROR_NO_VALID_LAYER_1'] + aLayersDef[i]['title'] + this_['oTranslations']['CTRL_IMPORT_BO_ERROR_NO_VALID_LAYER_2']
                });
                bIsValid = false;
            }
        }

        if (bIsValid) {
            this_.testLayers_().then(function (bTestResult) {
                if (bTestResult === true) {
                    deferred.resolve(true);
                }
            });

        }
    });

    return deferred.promise;
};

/**
 * Check if the given bo elements are valid
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.validateBo_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.validateBo_");

    var this_ = this;
    var deferred = this.$q_.defer();

    // Test existance objet métier
    this.testBo_().then(function (bTestResult) {
        if (bTestResult === true) {
            // Test existance rapports
            this_.testReports_().then(function (bTestResult) {
                if (bTestResult === true) {
                    // Test existance événements
                    this_.testEvent_().then(function (bTestResult) {
                        if (bTestResult === true) {
                            deferred.resolve(true);
                        } else {
                            deferred.resolve(false);
                        }
                    });
                } else {
                    deferred.resolve(false);
                }
            });
        } else {
            deferred.resolve(false);
        }
    });

    return deferred.promise;
};


// Fonctions de test

/**
 * Runs the import tests
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.testImport_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.testImport_");

    var this_ = this;
    var deferred = this.$q_.defer();

    this.$scope_['oTestSteps'] = {
        'business_objet': null,
        'reports': null,
        'event': null,
        'layers': null,
        'schema': null,
        'tables': null
    };

    // Test existance objet métier
    this.testBo_().then(function (bTestResult) {
        if (bTestResult === true) {
            this_.$scope_['oTestSteps']['business_objet'] = true;

            // Test existance rapports
            this_.testReports_().then(function (bTestResult) {
                if (bTestResult === true) {
                    this_.$scope_['oTestSteps']['reports'] = true;

                    // Test existance événements
                    this_.testEvent_().then(function (bTestResult) {
                        if (bTestResult === true) {
                            this_.$scope_['oTestSteps']['event'] = true;

                            // Test existance couches
                            this_.testLayers_().then(function (bTestResult) {
                                if (bTestResult === true) {
                                    this_.$scope_['oTestSteps']['layers'] = true;

                                    // Test existance schema
                                    this_.testSchema_().then(function (bTestResult) {
                                        if (bTestResult === true) {
                                            this_.$scope_['oTestSteps']['schema'] = true;

                                            // Test existance tables
                                            this_.testTables_().then(function (bTestResult) {
                                                if (bTestResult === true) {
                                                    this_.$scope_['oTestSteps']['tables'] = true;
                                                    deferred.resolve(true);
                                                } else {
                                                    this_.$scope_['oTestSteps']['tables'] = false;
                                                    deferred.resolve(false);
                                                }
                                            });
                                        } else {
                                            this_.$scope_['oTestSteps']['schema'] = false;
                                            deferred.resolve(false);
                                        }
                                    });
                                } else {
                                    this_.$scope_['oTestSteps']['layers'] = false;
                                    deferred.resolve(false);
                                }
                            });
                        } else {
                            this_.$scope_['oTestSteps']['event'] = false;
                            deferred.resolve(false);
                        }
                    });
                } else {
                    this_.$scope_['oTestSteps']['reports'] = false;
                    deferred.resolve(false);
                }
            });
        } else {
            this_.$scope_['oTestSteps']['business_objet'] = false;
            deferred.resolve(false);
        }
    });


    return deferred.promise;
};

/**
 * Check the existance of the given keys in the given object
 * @param {object} oCheckObject
 * @param {array} aRequiredKeys
 * @private
 */
nsVmap.importBoCtrl.prototype.checkObjectKeys_ = function (oCheckObject, aRequiredKeys) {
    this.$log_.info("nsVmap.importBoCtrl.checkObjectKeys_");

    for (var i = 0; i < aRequiredKeys.length; i++) {
        if (!goog.isDefAndNotNull(oCheckObject[aRequiredKeys[i]])) {
            console.error('checkObjectKeys_: missing ' + aRequiredKeys[i] + ' in object', oCheckObject);
            return false;
        } else {
            if (goog.isString(oCheckObject[aRequiredKeys[i]])
                    || goog.isArray(oCheckObject[aRequiredKeys[i]])) {
                if (!oCheckObject[aRequiredKeys[i]].length > 0) {
                    console.error('checkObjectKeys_: missing ' + aRequiredKeys[i] + ' in object', oCheckObject);
                    return false;
                }
            }
        }
    }
    return true;
};

/**
 * Test a ressource
 * @param {object} oObject Object to test
 * @param {string} sObjectUniqueField Object unique field to search on 
 * @param {string} sRessource Api-rest service (ex: vmap/businessobjects)
 * @param {array} aRequiredKeys Required values in oObject
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.testRessource_ = function (oObject, sObjectUniqueField, sRessource, aRequiredKeys) {
    this.$log_.info("nsVmap.importBoCtrl.testRessource_");

    var this_ = this;
    var deferred = this.$q_.defer();

    if (!this.checkObjectKeys_(oObject, aRequiredKeys)) {
        setTimeout(function () {
            var sObject = goog.isDefAndNotNull(oObject[sObjectUniqueField]) ? oObject[sObjectUniqueField] : sRessource;
            console.error(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_NO_COMPLETE_OBJECT'], sObject);
            this_.mainScope_["modalWindow"]("dialog", "Error", {
                "className": "modal-danger",
                "message": this_['oTranslations']['CTRL_IMPORT_BO_ERROR_NO_COMPLETE_OBJECT'] + oObject
            });

            deferred.resolve(false);
        });
        return deferred.promise;
    }

    // Test de l'existance de l'objet
    ajaxRequest({
        'method': 'GET',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/' + sRessource,
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'params': {
//            'filter': '"' + sObjectUniqueField + '"=\'' + oObject[sObjectUniqueField] + '\''
            'filter': '{"column":"' + sObjectUniqueField + '","compare_operator":"=","value":"' + oObject[sObjectUniqueField] + '"}'
        },
        'scope': this.$scope_,
        'success': function (response) {

            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
                console.error(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], oObject[sObjectUniqueField]);
                deferred.resolve(false);
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['list_count'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
                console.error(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], oObject[sObjectUniqueField]);
                deferred.resolve(false);
                return null;
            }

            if (response['data']['list_count'] > 0) {
                console.error(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_OBJECT_ALREADY_EXISTS'], oObject[sObjectUniqueField]);
                this_.mainScope_["modalWindow"]("dialog", "Error", {
                    "className": "modal-danger",
                    "message": this_['oTranslations']['CTRL_IMPORT_BO_ERROR_OBJECT_ALREADY_EXISTS'] + oObject[sObjectUniqueField]
                });

                deferred.resolve(false);
            } else {
                deferred.resolve(true);
            }

        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
        }
    });

    return deferred.promise;
};

/**
 * Test the business object
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.testBo_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.testBo_");

    var deferred = this.$q_.defer();

    var oBo = this.$scope_['oBoDef'];
    var aRequiredKeys = ['business_object_id', 'title', 'database', 'schema', 'table', 'id_field', 'sql_summary', 'sql_list', 'geom_column', 'index'];

    // Cas ou il faille sauter l'étape
    if (this.$scope_['selectedSteps']['import_bo'] === false) {
        deferred.resolve(true);
    } else {
        this.testRessource_(oBo, 'business_object_id', 'vmap/businessobjects', aRequiredKeys).then(function (bTestResult) {
            deferred.resolve(bTestResult);
        });
    }

    return deferred.promise;
};

/**
 * Test the business object reports
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.testReports_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.testReports_");

    var deferred = this.$q_.defer();

    var aReports = this.$scope_['aReportsDef'];
    var aRequiredKeys = ['name', 'rt_format_id', 'rt_orientation_id', 'outputformats_id', 'business_object_id', 'htmldefinition'];
    var iTested = 0;

    // Cas ou il faille sauter l'étape
    if (this.$scope_['selectedSteps']['import_bo'] === false) {
        deferred.resolve(true);
    } else {
        if (goog.isDefAndNotNull(this.$scope_['aReportsDef'])) {
            for (var i = 0; i < aReports.length; i++) {
                this.testRessource_(aReports[i], 'name', 'vmap/printreports', aRequiredKeys).then(function (bTestResult) {

                    // Incémente le nombre d'objets ayant étés testés
                    iTested++;

                    // Promesse
                    if (bTestResult === false) {
                        deferred.resolve(false);
                    } else {
                        if (iTested === aReports.length) {
                            deferred.resolve(true);
                        }
                    }
                });
            }
        } else {
            setTimeout(function () {
                deferred.resolve(true);
            });
        }
    }

    return deferred.promise;
};

/**
 * Test the business object event
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.testEvent_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.Event_");

    var deferred = this.$q_.defer();

    var oEvent = this.$scope_['oEventDef'];
    var aRequiredKeys = ['event_id'];

    // Cas ou il faille sauter l'étape
    if (this.$scope_['selectedSteps']['import_bo'] === false) {
        deferred.resolve(true);
    } else {
        if (goog.isDefAndNotNull(this.$scope_['oEventDef'])) {
            this.testRessource_(oEvent, 'event_id', 'vmap/businessobjectevents', aRequiredKeys).then(function (bTestResult) {
                deferred.resolve(bTestResult);
            });
        } else {
            setTimeout(function () {
                deferred.resolve(true);
            });
        }
    }

    return deferred.promise;
};

/**
 * Test the layers
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.testLayers_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.testLayers_");

    var deferred = this.$q_.defer();
    var aLayersDef = this.$scope_['aLayersDef'];
    var aRequiredKeys = ['name', 'title', 'coordsys_id', 'connection_id', 'active', 'ms_layertype_id', 'tableidfield', 'tableschema', 'tablename'];
    var iTested = 0;
    var this_ = this;

    // Cas ou il faille sauter l'étape
    if (this.$scope_['selectedSteps']['import_layers'] === false) {
        deferred.resolve(true);
    } else {
        for (var i = 0; i < aLayersDef.length; i++) {
            // Permet la sauvegarde de i
            (function (i) {
                // Test de l'existance de la couche
                this_.testRessource_(aLayersDef[i], 'name', 'vm4ms/layers', aRequiredKeys).then(function (bTestResult) {
                    // Test de l'existance du calque
                    var oVmapLayer = {
                        'service_id': 'vm4ms_' + aLayersDef[i]['wmsservice_id'],
                        'name': aLayersDef[i]['title'],
                        'layer_list': aLayersDef[i]['name'],
                        'bo_id_list': '[BUSINESS_OBJECT]',
                        'is_dynamic': true,
                        'is_filtered': false
                    };
                    if (bTestResult === false) {
                        deferred.resolve(false);
                    } else {
                        this_.testRessource_(oVmapLayer, 'name', 'vmap/layers', []).then(function (bTestResult) {

                            // Incémente le nombre d'objets ayant étés testés
                            iTested++;

                            // Promesse
                            if (bTestResult === false) {
                                deferred.resolve(false);
                            } else {
                                if (iTested === aLayersDef.length) {
                                    deferred.resolve(true);
                                }
                            }
                        });
                    }
                });
            })(i);
        }
    }

    return deferred.promise;
};

/**
 * Test schema
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.testSchema_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.testSchema_");

    var this_ = this;
    var deferred = this.$q_.defer();

    setTimeout(function () {
        // Cas ou il faille sauter l'étape
        if (this_.$scope_['selectedSteps']['import_sql'] === false) {
            deferred.resolve(true);
        } else {
            if (goog.isDefAndNotNull(this_.$scope_['usedSchema'])) {
                deferred.resolve(true);
            } else {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_NO_DEFINED_SCHEMA'], "error");
                deferred.resolve(false);
            }
        }
    });

    return deferred.promise;
};

/**
 * Test if tables are defined and not already present
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.testTables_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.testTables_");

    var this_ = this;
    var deferred = this.$q_.defer();

    setTimeout(function () {
        if (this_.$scope_['selectedSteps']['import_sql'] === false) {
            deferred.resolve(true);
        } else {
            if (goog.isDefAndNotNull(this_.$scope_['usedSchema'])) {
                // Si le schéma doit être crée
                if (this_.isNewSchema_(this_.$scope_['usedSchema'])) {
                    deferred.resolve(true);
                } else {
                    ajaxRequest({
                        'method': 'GET',
                        'url': this_['oProperties']['web_server_name'] + '/' + this_['oProperties']['services_alias'] + '/vitis/genericquerys',
                        'headers': {
                            'Accept': 'application/x-vm-json'
                        },
                        'params': {
                            'attributs': 'tablename',
                            'schema': 'pg_catalog',
                            'table': 'pg_tables',
                            'distinct': 'true',
                            'sort_order': 'ASC',
                            'filter': '{"column":"schemaname","compare_operator":"=","value":"' + this_.$scope_['usedSchema'] + '"}'
                        },
                        'scope': this.$scope_,
                        'success': function (response) {

                            if (!goog.isDefAndNotNull(response['data'])) {
                                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
                                deferred.resolve(false);
                                return null;
                            }
                            if (!goog.isDefAndNotNull(response['data']['data'])) {
                                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
                                deferred.resolve(false);
                                return null;
                            }

                            // Tables du schema
                            var aSchemaTables = [];
                            for (var i = 0; i < response['data']['data'].length; i++) {
                                if (goog.isDefAndNotNull(response['data']['data'][i]['tablename'])) {
                                    aSchemaTables.push(response['data']['data'][i]['tablename']);
                                }
                            }

                            // Tables à importer
                            var aImportedTables = this_.$scope_['oImportedBo']['sql']['structure']['tables'];
                            if (!goog.isDefAndNotNull(aImportedTables)) {
                                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_NO_TABLES_TO_IMPORT'], "error");
                                console.error(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_NO_TABLES_TO_IMPORT']);
                                deferred.resolve(false);
                                return null;
                            }

                            // Les tables existenet déjà ?
                            for (var i = 0; i < aImportedTables.length; i++) {
                                if (aSchemaTables.indexOf(aImportedTables[i]) !== -1) {
                                    $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_TABLE_ALREADY_PRESENT'] + ": " + aImportedTables[i], "error");
                                    deferred.resolve(false);
                                    return null;
                                }
                            }

                            deferred.resolve(true);

                        },
                        'error': function (response) {
                            $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
                        }
                    });
                }

            } else {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_NO_DEFINED_SCHEMA'], "error");
                deferred.resolve(false);
            }
        }
    });



    return deferred.promise;
};


// Fonctions import

/**
 * Post an object to the server
 * @param {object} oObject
 * @param {string} sRessource (ex: vmap/businessobjects)
 * @param {string} sObjectId
 * @param {array} aUnsavedParams Params to delete before POST
 * @param {boolean} oFileData if defined send the oObject values as files
 * @returns {defer.promise}
 * @private
 */
nsVmap.importBoCtrl.prototype.importObject_ = function (oObject, sRessource, sObjectId, aUnsavedParams, oFileData) {
    this.$log_.info("nsVmap.importBoCtrl.importObject_");

    aUnsavedParams = goog.isDefAndNotNull(aUnsavedParams) ? aUnsavedParams : [];

    var this_ = this;
    var deferred = this.$q_.defer();

    // Valeurs à envoyer
    var oValues = angular.copy(oObject);

    // Remplace les balises
    for (var key in oValues) {
        if (goog.isString(oValues[key])) {
            if (goog.isDefAndNotNull(this.$scope_['usedSchema'])) {
                oValues[key] = oValues[key].replace(/\[TABLE_SCHEMA\]/g, this.$scope_['usedSchema']);
            }
            if (goog.isDefAndNotNull(this.$scope_['usedDatabase'])) {
                oValues[key] = oValues[key].replace(/\[DATABASE\]/g, this.$scope_['usedDatabase']);
            }
            if (goog.isDefAndNotNull(this.$scope_['oCoordsys'])) {
                if (goog.isDefAndNotNull(this.$scope_['oCoordsys']['coordsys_id'])) {
                    oValues[key] = oValues[key].replace(/\[SRID\]/g, this.$scope_['oCoordsys']['coordsys_id']);
                }
            }
            if (goog.isDefAndNotNull(this.$scope_['oBoDef'])) {
                if (goog.isDefAndNotNull(this.$scope_['oBoDef']['business_object_id'])) {
                    oValues[key] = oValues[key].replace(/\[BUSINESS_OBJECT\]/g, this.$scope_['oBoDef']['business_object_id']);
                }
            }
            if (goog.isDefAndNotNull(this.$scope_['oEventDef'])) {
                oValues[key] = oValues[key].replace(/\[EVENT\]/g, this.$scope_['oEventDef']['event_id']);
            }
        }
    }
    if (goog.isDefAndNotNull(oFileData)) {
        for (var key in oFileData) {
            if (goog.isString(oFileData[key])) {
                if (goog.isDefAndNotNull(this.$scope_['usedSchema'])) {
                    oFileData[key] = oFileData[key].replace(/\[TABLE_SCHEMA\]/g, this.$scope_['usedSchema']);
                }
                if (goog.isDefAndNotNull(this.$scope_['usedDatabase'])) {
                    oFileData[key] = oFileData[key].replace(/\[DATABASE\]/g, this.$scope_['usedDatabase']);
                }
                if (goog.isDefAndNotNull(this.$scope_['oCoordsys'])) {
                    if (goog.isDefAndNotNull(this.$scope_['oCoordsys']['coordsys_id'])) {
                        oFileData[key] = oFileData[key].replace(/\[SRID\]/g, this.$scope_['oCoordsys']['coordsys_id']);
                    }
                }
                if (goog.isDefAndNotNull(this.$scope_['oBoDef'])) {
                    if (goog.isDefAndNotNull(this.$scope_['oBoDef']['business_object_id'])) {
                        oFileData[key] = oFileData[key].replace(/\[BUSINESS_OBJECT\]/g, this.$scope_['oBoDef']['business_object_id']);
                    }
                }
                if (goog.isDefAndNotNull(this.$scope_['oEventDef'])) {
                    oFileData[key] = oFileData[key].replace(/\[EVENT\]/g, this.$scope_['oEventDef']['event_id']);
                }
            }
        }
    }

    // Supprime les valeurs non désirées
    for (var i = 0; i < aUnsavedParams.length; i++) {
        if (goog.isDefAndNotNull(oValues[aUnsavedParams[i]])) {
            delete oValues[aUnsavedParams[i]];
        }
    }

    var oFormData_ = new FormData();
    for (var key in oValues) {
        oFormData_.append(key, oValues[key]);
    }

    if (goog.isDefAndNotNull(oFileData)) {
        for (var key in oFileData) {
            var blob = new Blob([oFileData[key]], {type: "text"});
            oFormData_.append(key, blob);
        }
    }

    ajaxRequest({
        'method': 'POST',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/' + sRessource,
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'data': oFormData_,
        'scope': this.$scope_,
        'success': function (response) {

            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_1'] + this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_2_IMPORT'] + sRessource, "error");
                console.error(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_1'] + this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_2_IMPORT'] + sRessource);
                deferred.resolve({
                    status: false
                });
                return null;
            }
            if (goog.isDefAndNotNull(response['data'])) {
                if (goog.isDefAndNotNull(response['data']['errorMessage'])) {
                    angular.element(vitisApp.appMainDrtv).scope()["modalWindow"]("dialog", "Erreur serveur", {
                        "className": "modal-danger",
                        "message": response['data']['errorMessage']
                    });
                    deferred.resolve({
                        status: false
                    });
                    return null;
                }
            }

            if (response['data']['status'] === 1) {
                if (goog.isDefAndNotNull(sObjectId)) {
                    this_.aImportedObjects_.push({
                        'sId': response['data'][sObjectId],
                        'sRessource': sRessource
                    });
                }
                deferred.resolve({
                    'status': true,
                    'objectId': goog.isDefAndNotNull(sObjectId) ? response['data'][sObjectId] : null
                });
            } else {
                deferred.resolve({
                    status: false
                });
            }

        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_1'] + this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_2_IMPORT'] + sRessource, "error");
            console.error(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_1'] + this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_2_IMPORT'] + sRessource);
            deferred.resolve({
                status: false
            });
        }
    });

    return deferred.promise;
}
;

/**
 * Put a business object form
 * @param {object} oForms
 * @param {string} sRessource
 * @param {string} sFormName
 * @returns {defer.promise}
 * @private
 */
nsVmap.importBoCtrl.prototype.putForm_ = function (oForms, sRessource, sFormName) {
    this.$log_.info("nsVmap.importBoCtrl.putForm_");

    var this_ = this;
    var deferred = this.$q_.defer();

    var oFormData = new FormData();
    for (var key in oForms) {
        oFormData.append(key, oForms[key]);
    }

    ajaxRequest({
        'method': 'PUT',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/' + sRessource + '/' + sFormName,
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'params': {
            'cmd': 'Save'
        },
        'data': oFormData,
        'scope': this.$scope_,
        'success': function (response) {

            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_1'] + this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_2_IMPORT'] + sRessource, "error");
                console.error(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_1'] + this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_2_IMPORT'] + sRessource);
                deferred.resolve(false);
                return null;
            }

            deferred.resolve(true);

        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_1'] + this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_2_IMPORT'] + sRessource, "error");
            console.error(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_1'] + this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_2_IMPORT'] + sRessource);
        }
    });

    return deferred.promise;
};

/**
 * Delete an object
 * @param {string} sRessource (ex: vmap/businessobjects)
 * @param {string} sObjectId
 * @private
 */
nsVmap.importBoCtrl.prototype.deleteObject_ = function (sRessource, sObjectId) {
    this.$log_.info("nsVmap.importBoCtrl.deleteObject_");

    var deferred = this.$q_.defer();

    var this_ = this;

    ajaxRequest({
        'method': 'DELETE',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/' + sRessource + '/' + sObjectId,
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'scope': this.$scope_,
        'abord': deferred.promise,
        'success': function (response) {

            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REMOVE_ERROR'] + sRessource, "error");
                console.error(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REMOVE_ERROR'] + sRessource);
                return null;
            }

            if (response['data']['status'] === 1) {
                this_.$log_.info("deleteObject_ (" + sRessource + ") ok");
            }

            deferred.resolve();

        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REMOVE_ERROR'] + sRessource, "error");
            console.error(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REMOVE_ERROR'] + sRessource);
        }
    });

    // Resolve au cas où la requête échoue
    setTimeout(function () {
        deferred.resolve();
    }, 5000);

    return deferred.promise;
};

/**
 * Import the business object defined by scope.oBoDef
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.importBo_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.importBo_");

    var this_ = this;
    var deferred = this.$q_.defer();

    setTimeout(function () {
        // Cas ou il faille sauter l'étape
        if (this_.$scope_['selectedSteps']['import_bo'] === false) {
            deferred.resolve(true);
        } else {
            // Définition
            this_.importObject_(this_.$scope_['oBoDef'], 'vmap/businessobjects', 'business_object_id', ['$$hashKey']).then(function (oResult) {
                if (oResult['status'] === true) {

                    // Formulaires
                    var aForms = ['default', 'custom', 'published'];
                    var oForms;
                    var iFormsUpdated = 0;
                    var iFormsUpdatedOk = 0;
                    for (var i = 0; i < aForms.length; i++) {
                        if (goog.isDefAndNotNull(this_.$scope_['oImportedBo']['forms'][aForms[i]])) {

                            iFormsUpdated++;
                            oForms = {
                                'Json': JSON.stringify(this_.$scope_['oImportedBo']['forms'][aForms[i]])
                            };

                            // Fichiers JS
                            if (goog.isDefAndNotNull(this_.$scope_['oImportedBo']['forms']['ressources'])) {
                                if (goog.isDefAndNotNull(this_.$scope_['oImportedBo']['forms']['ressources']['js'])) {
                                    if (goog.isDefAndNotNull(this_.$scope_['oImportedBo']['forms']['ressources']['js'][aForms[i]])) {
                                        oForms['Js'] = this_.$scope_['oImportedBo']['forms']['ressources']['js'][aForms[i]];
                                    }
                                }
                            }

                            // Fichiers Css
                            if (goog.isDefAndNotNull(this_.$scope_['oImportedBo']['forms']['ressources'])) {
                                if (goog.isDefAndNotNull(this_.$scope_['oImportedBo']['forms']['ressources']['css'])) {
                                    if (goog.isDefAndNotNull(this_.$scope_['oImportedBo']['forms']['ressources']['css'][aForms[i]])) {
                                        oForms['Css'] = this_.$scope_['oImportedBo']['forms']['ressources']['css'][aForms[i]];
                                    }
                                }
                            }

                            this_.putForm_(angular.copy(oForms), 'vmap/businessobjects/' + oResult['objectId'] + '/forms', aForms[i]).then(function (oResult) {
                                if (oResult === true) {
                                    iFormsUpdatedOk++;
                                    if (iFormsUpdatedOk === iFormsUpdated) {
                                        deferred.resolve(true);
                                    }
                                }
                            });
                        }
                    }

                    // Si il n'y a aucun formulaire à uploader
                    if (iFormsUpdated === 0) {
                        deferred.resolve(true);
                    }

                } else {
                    deferred.resolve(false);
                }
            });
        }
    });

    return deferred.promise;
};

/**
 * Import the business object reports defined by scope.aReportsDef
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.importReports_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.importReports_");

    var this_ = this;
    var deferred = this.$q_.defer();

    var aReports = this.$scope_['aReportsDef'];
    var iObjectsImported = 0;

    setTimeout(function () {
        // Cas ou il faille sauter l'étape
        if (this_.$scope_['selectedSteps']['import_bo'] === false) {
            deferred.resolve(true);
        } else {
            if (goog.isDefAndNotNull(this_.$scope_['aReportsDef'])) {
                for (var i = 0; i < aReports.length; i++) {
                    this_.importObject_(aReports[i], 'vmap/printreports', 'printreport_id', ['printreport_id', '$$hashKey']).then(function (oResult) {
                        if (oResult['status'] === true) {
                            iObjectsImported++;
                            if (iObjectsImported === aReports.length) {
                                deferred.resolve(true);
                            }
                        } else {
                            deferred.resolve(true);
                        }
                    });
                }
            } else {
                deferred.resolve(true);
            }
        }
    });

    return deferred.promise;
};

/**
 * Import the business object event defined by scope.oEventDef
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.importEvent_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.importEvent_");

    var this_ = this;
    var deferred = this.$q_.defer();

    setTimeout(function () {
        // Cas ou il faille sauter l'étape
        if (this_.$scope_['selectedSteps']['import_bo'] === false) {
            deferred.resolve(true);
        } else {
            if (goog.isDefAndNotNull(this_.$scope_['oEventDef'])) {
                this_.importObject_(this_.$scope_['oEventDef'], 'vmap/businessobjectevents', 'event_id', ['$$hashKey']).then(function (oResult) {
                    deferred.resolve(oResult['status']);
                });
            } else {
                deferred.resolve(true);
            }
        }
    });

    return deferred.promise;
};

/**
 * Import the vm4ms layers defined by scope.aLayersDef
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.importLayers_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.importLayers_");

    var this_ = this;
    var deferred = this.$q_.defer();

    var aLayers = this.$scope_['aLayersDef'];
    var iObjectsImported = 0;

    setTimeout(function () {
        // Cas ou il faille sauter l'étape
        if (this_.$scope_['selectedSteps']['import_layers'] === false) {
            deferred.resolve(true);
        } else {
            for (var i = 0; i < aLayers.length; i++) {
                // Permet la sauvegarde de i
                (function (i) {
                    // Import de la couche
                    this_.importObject_(aLayers[i], 'vm4ms/layers', 'ms_layer_id', ['$$hashKey', 'ms_layer_id']).then(function (oResult) {
                        if (oResult['status'] === true) {

                            // Id du service
                            for (var ii = 0; ii < this_.$scope_['aVmapServices'].length; ii++) {
                                if (this_.$scope_['aVmapServices'][ii]['name'] === 'vm4ms_' + aLayers[i]['wmsservice_id']) {
                                    var sVmapServiceId = this_.$scope_['aVmapServices'][ii]['service_id'];
                                }
                            }

                            // Id de la couche
                            aLayers[i]['ms_layer_id'] = oResult['objectId'];

                            // Associe la couche au service wms
                            this_.associateLayer_(aLayers[i]).then(function (oResult) {
                                if (oResult['status'] === true) {

                                    // Import du calque (si le service existe)
                                    if (goog.isDefAndNotNull(sVmapServiceId)) {
                                        var oVmapLayer = {
                                            'service_id': sVmapServiceId,
                                            'name': aLayers[i]['name'],
                                            'layer_list': aLayers[i]['name'],
                                            'bo_id_list': '[BUSINESS_OBJECT]',
                                            'is_dynamic': true,
                                            'is_filtered': false
                                        };
                                        this_.importObject_(oVmapLayer, 'vmap/layers', 'layer_id', ['$$hashKey', 'layer_id']).then(function (oResult) {
                                            if (oResult['status'] === true) {
                                                iObjectsImported++;
                                                if (iObjectsImported === aLayers.length) {
                                                    deferred.resolve(true);
                                                }
                                            } else {
                                                deferred.resolve(false);
                                            }
                                        });
                                    } else {
                                        deferred.resolve(false);
                                    }

                                } else {
                                    deferred.resolve(false);
                                }
                            });
                        } else {
                            deferred.resolve(false);
                        }
                    });
                })(i);
            }
        }
    });

    return deferred.promise;
};

/**
 * Associate the given layer with the service defines in oLayer.wmsservice_id
 * @param {object} oLayer
 * @returns {defer.promise}
 * @private
 */
nsVmap.importBoCtrl.prototype.associateLayer_ = function (oLayer) {
    this.$log_.info("nsVmap.importBoCtrl.associateLayers_");

    var this_ = this;
    var deferred = this.$q_.defer();

    ajaxRequest({
        'method': 'PUT',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vm4ms/layerwmsservices/' + oLayer['ms_layer_id'],
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'data': {
            'wmsservices': oLayer['wmsservice_id']
        },
        'scope': this.$scope_,
        'success': function (response) {

            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_1'] + this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_2_ASSOCIATE_LAYER'] + oLayer['name'], "error");
                console.error(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_1'] + this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_2_ASSOCIATE_LAYER'] + oLayer['name']);
                deferred.resolve({
                    status: false
                });
                return null;
            }

            if (response['data']['status'] === 1) {
                deferred.resolve({
                    'status': true
                });
            } else {
                deferred.resolve({
                    status: false
                });
            }

        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_1'] + this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_2_ASSOCIATE_LAYER'] + oLayer['name'], "error");
            console.error(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_1'] + this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END_2_ASSOCIATE_LAYER'] + oLayer['name']);
            deferred.resolve({
                status: false
            });
        }
    });

    return deferred.promise;
};

/**
 * Import the business object event defined by scope.oEventDef
 * @returns {defer.promise}
 */
nsVmap.importBoCtrl.prototype.importSql_ = function () {
    this.$log_.info("nsVmap.importBoCtrl.importSql_");

    var this_ = this;
    var deferred = this.$q_.defer();

    setTimeout(function () {
        // Cas ou il faille sauter l'étape
        if (this_.$scope_['selectedSteps']['import_sql'] === false) {
            deferred.resolve(true);
        } else {
            this_.importObject_({'database': this_.$scope_['usedDatabase']}, 'vmap/businessobjects/data_model', null, [], {'data_model': this_.$scope_['sSql']}).then(function (oResult) {
                deferred.resolve(oResult['status']);
            });
        }
    });

    return deferred.promise;
};

/**
 * Set 
 * @export
 */
nsVmap.importBoCtrl.prototype.setWmsServices = function (connection_id) {
    this.$log_.info("nsVmap.importBoCtrl.setWmsServices");
    var this_ = this;
    // Type de connexion (publique / privée)
    var bPrivateConnection = false;
    for (var i in this.$scope_['aConnections']) {
        if (this.$scope_['aConnections'][i]["connection_id"] == connection_id) {
            if (this.$scope_['aConnections'][i]["private"] === true)
                bPrivateConnection = true;
            break;
        }
    }
    // Affichage des services wms correspondants au type de connexion.
    var sWmsService = "publicwmsservices";
    if (bPrivateConnection)
        sWmsService = "privatewmsservices";
    ajaxRequest({
        'method': 'GET',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vm4ms/' + sWmsService,
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'params': {
            'order_by': 'wmsservice_id'
        },
        'scope': this.$scope_,
        'success': function (response) {
            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['data'])) {
                console.error("Aucun résultat: wmsservices", response);
                return null;
            }
            //
            this_.$scope_['aWmsServices'] = response['data']['data'];
        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_BO_ERROR_REQUEST_UNABLE_TO_END'], "error");
        }
    });
};

// Definition du controlleur angular
oVmap.module.controller('AppImportBoController', nsVmap.importBoCtrl);
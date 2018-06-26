/* global goog, nsVmap, oVmap, bootbox, vitisApp, this */

goog.provide('nsVmap.importVexCtrl');
goog.require('oVmap');

/**
 * ImportVex controller
 * @param {object} $scope
 * @param {object} $log
 * @param {object} $q
 * @param {object} $translate
 * @returns {nsVmap.importVexCtrl}
 * @export
 * @ngInject
 */
nsVmap.importVexCtrl = function ($scope, $log, $q, $translate) {
    $log.info("nsVmap.importVexCtrl");

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
    $scope['displayedStep'] = '';

    // Étapes
    $scope['steps'] = ['import_vex_file', 'config', 'vmap_objects', 'web_services', 'import_sql', 'execute_import', 'finalize'];

    /**
     * Objets SQL exploitables
     */
    $scope['oSql'] = null;

    /**
     * Objets vMap exportables
     */
    $scope['oVMapObjects'] = null;

    /**
     * Liste des services web exploitables
     */
    $scope['aWebServices'] = null;


    // Sélections

    /**
     * Base de données sélectionnée
     * par défaut vaut la valaur de la connexion privée
     */
    $scope['usedDatabase'] = null;

    /**
     * Schema sélectionné
     */
    $scope['usedSchema'] = null;

    /**
     * SRID sélectionné
     * par défaut vaut 2154
     */
    $scope['usedSRID'] = null;

    /**
     * User role in database
     */
    $scope['usedUserRole'] = null;

    /**
     * Admin role in database
     */
    $scope['usedAdminRole'] = null;


    // Listes

    /**
     * Liste des bases de données disponibles
     */
    $scope['aDatabases'] = [];

    /**
     * Liste des schemas disponibles
     */
    $scope['aSchemas'] = [];

    /**
     * Liste des roles group disponibles
     */
    $scope['aRoleGroups'] = [];

    /**
     * Liste des coordsys disponibles
     */
    $scope['aCoordsys'] = [];

    /**
     * Connexion privée
     */
    $scope['oPrivateConnection'] = null;


    // Interface

    /**
     * Étapes à passer
     */
    $scope['selectedSteps'] = {
        'import_vex_file': true,
        'config': true,
        'vmap_objects': true,
        'import_sql': true,
        'web_services': true,
        'execute_import': true,
        'finalize': true
    };

    /**
     * Modèle de données SQL
     */
    $scope['sSQLModel'] = '';

    /**
     * Données SQL
     */
    $scope['sSQLData'] = '';

    /**
     * Étapes de l'import
     */
    $scope['oImportSteps'] = {
        'vmap_objects': null,
        'vmap_objects_maps': null,
        'vmap_objects_services': null,
        'vmap_objects_calques': null,
        'vmap_objects_calque_themes': null,
        'vmap_objects_vm4ms_layers': null,
        'vmap_objects_business_objects': null,
        'vmap_objects_events': null,
        'vmap_objects_reports': null,
        'web_services': null,
        'sql': null,
        'sql_model': null,
        'sql_data': null
    };

    $scope['bImportDone'] = false;

    // temporaires
    this.lastParentCollapseTimeout_ = 0;
    this.selectedDatabaseWatcher = null;
    this.oExistingVMapObjects_ = null;
    this.aExistingWebServices_ = null;
    this.oImportedVmapObjects_ = null;

    // Traductions
    this.importTranslations_();

    // Première étape
    this.goStep('import_vex_file');
};


// Fonctions publiques

/**
 * Function called to submit a step
 * @param {string} step
 * @export
 */
nsVmap.importVexCtrl.prototype.submitStep = function (step) {
    this.$log_.info("nsVmap.importVexCtrl.submitStep");

    var this_ = this;

    switch (step) {
        case 'import_vex_file':
            this.parseVexFile_().then(function () {
                this_.nextStep();
            });
            break;
        case 'config':
            if (this.isConfigStateValid()) {
                this_.nextStep();
            }
            break;
        case 'vmap_objects':
            if (goog.isObject(this_.oExistingVMapObjects_)) {
                if (Object.keys(this_.oExistingVMapObjects_).length > 0) {

                    var iNumber = 0;
                    var sMessage = this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_EXISTING_VMAP_OBJETS'];
                    for (var key in this_.oExistingVMapObjects_) {
                        if (goog.isArray(this_.oExistingVMapObjects_[key])) {
                            iNumber += this_.oExistingVMapObjects_[key].length;
                        }
                    }
                    sMessage = sMessage.replace('[number]', iNumber);

                    bootbox.confirm('<h4>' + sMessage + '</h4>', function (result) {
                        if (result) {
                            this_.$scope_.$applyAsync(function () {
                                this_.nextStep();
                            });
                        }
                    });
                    break;
                }
            }
            this_.nextStep();
            break;
        case 'import_sql':
            bootbox.confirm('<h4>' + this_['oTranslations']['CTRL_IMPORT_VEX_WARNING_SQL'] + '</h4>', function (result) {
                if (result) {
                    this_.$scope_.$applyAsync(function () {
                        this_.nextStep();
                    });
                }
            });
            break;
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
nsVmap.importVexCtrl.prototype.nextStep = function () {
    this.$log_.info("nsVmap.importVexCtrl.nextStep");

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
nsVmap.importVexCtrl.prototype.prevStep = function () {
    this.$log_.info("nsVmap.importVexCtrl.prevStep");

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
nsVmap.importVexCtrl.prototype.goStep = function (step) {
    this.$log_.info("nsVmap.importVexCtrl.goStep");

    var this_ = this;

    var currentIndex = this_.$scope_['steps'].indexOf(this_.$scope_['displayedStep']);
    var stepIndex = this_.$scope_['steps'].indexOf(step);

    // Marche avant
    if (!(currentIndex > stepIndex)) {
        if (this_.$scope_['selectedSteps'][step] !== false) {
            switch (step) {
                case 'config':
                    this.loadConfigObjects_().then(function () {
                        this_.$scope_['displayedStep'] = step;
                    });
                    break;
                case 'vmap_objects':
                    this.loadVMapObjects_().then(function () {
                        this_.$scope_['displayedStep'] = step;
                    }, function () {
                        this_.$scope_['displayedStep'] = step;
                        this_.nextStep();
                    });
                    break;
                case 'import_sql':
                    this.loadSql_().then(function () {
                        this_.$scope_['displayedStep'] = step;
                    }, function () {
                        this_.$scope_['displayedStep'] = step;
                        this_.nextStep();
                    });
                    break;
                case 'web_services':
                    this.loadWebServices_().then(function () {
                        this_.$scope_['displayedStep'] = step;
                    }, function () {
                        this_.$scope_['displayedStep'] = step;
                        this_.nextStep();
                    });
                    break;
                case 'execute_import':
                    this_.$scope_['oImportSteps']['vmap_objects'] = null;
                    this_.$scope_['oImportSteps']['vmap_objects_maps'] = null;
                    this_.$scope_['oImportSteps']['vmap_objects_services'] = null;
                    this_.$scope_['oImportSteps']['vmap_objects_calques'] = null;
                    this_.$scope_['oImportSteps']['vmap_objects_calque_themes'] = null;
                    this_.$scope_['oImportSteps']['vmap_objects_vm4ms_layers'] = null;
                    this_.$scope_['oImportSteps']['vmap_objects_business_objects'] = null;
                    this_.$scope_['oImportSteps']['vmap_objects_events'] = null;
                    this_.$scope_['oImportSteps']['vmap_objects_reports'] = null;
                    this_.$scope_['oImportSteps']['web_services'] = null;
                    this_.$scope_['oImportSteps']['sql'] = null;
                    this_.$scope_['oImportSteps']['sql_model'] = null;
                    this_.$scope_['oImportSteps']['sql_data'] = null;
                    this_.$scope_['displayedStep'] = step;
                    break;
                default:
                    this.$scope_['displayedStep'] = step;
                    break;
            }
        } else {

            // Cas où l'étape ait été sautée
            switch (step) {
                case 'vmap_objects':
                    this_.$scope_['oVMapObjects'] = null;
                    this.$scope_['displayedStep'] = step;
                    this.nextStep();
                    break;
                case 'import_sql':
                    this_.$scope_['oSql'] = null;
                    this_.$scope_['sSQLModel'] = '';
                    this_.$scope_['sSQLData'] = '';
                    this.$scope_['displayedStep'] = step;
                    this.nextStep();
                    break;
                case 'web_services':
                    this_.$scope_['aWebServices'] = null;
                    this.$scope_['displayedStep'] = step;
                    this.nextStep();
                    break;
                default:
                    this.$scope_['displayedStep'] = step;
                    this.nextStep();
                    break;
            }
        }
    }

    // Marche arrière
    if (currentIndex > stepIndex) {
        if (this_.$scope_['selectedSteps'][step] !== false) {
            switch (step) {
                case 'vmap_objects':
                    this.$scope_['displayedStep'] = step;
                    if (this.$scope_['oVMapObjects'] === null) {
                        this_.prevStep();
                    }
                    break;
                case 'import_sql':
                    this.$scope_['displayedStep'] = step;
                    if (this.$scope_['oSql'] === null) {
                        this_.prevStep();
                    }
                    break;
                case 'web_services':
                    this.$scope_['displayedStep'] = step;
                    if (this.$scope_['aWebServices'] === null) {
                        this_.prevStep();
                    }
                    break;
                default:
                    this.$scope_['displayedStep'] = step;
                    break;
            }
        } else {
            this_.$scope_['displayedStep'] = step;
            this_.prevStep();
        }
    }
};

/**
 * Close the import modal
 * @export
 */
nsVmap.importVexCtrl.prototype.closeImportModal = function () {
    this.$log_.info("nsVmap.importVexCtrl.closeImportModal");

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
nsVmap.importVexCtrl.prototype.importTranslations_ = function () {

    var this_ = this;

    var aTranslationsCodes = [];

    // étapes
    for (var i = 0; i < this.$scope_['steps'].length; i++) {
        aTranslationsCodes.push('CTRL_IMPORT_VEX_STEP_' + this.$scope_['steps'][i]);
    }

    // erreurs
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_SELECT_VEX_FILE');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_VEX_IMPORT_FAIL');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_REQUEST_GET_DATABASES');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_REQUEST_GET_SCHEMAS');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_REQUEST_GET_ROLEGROUPS');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_REQUEST_GET_COORDSYS');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_REQUEST_GET_PRIVATE_CONNECTION');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_PRIVATE_CONNECTION_DATABASE_DIFFERENT');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_DATABASE_REQUIRED');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_SCHEMA_REQUIRED');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_COORDSYS_REQUIRED');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_EDIT_NAME_NOT_VALID');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_USER_ROLE_REQUIRED');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_ADMIN_ROLE_REQUIRED');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_EXISTING_VMAP_OBJETS');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_WARNING_SQL');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_REQUEST_IMPORT_VMAP_OBJECTS');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_REQUEST_IMPORT_WEB_SERVICES');
    aTranslationsCodes.push('CTRL_IMPORT_VEX_ERROR_REQUEST_IMPORT_SQL');

    this.$translate_(aTranslationsCodes).then(function (aTranslations) {
        this_['oTranslations'] = aTranslations;
    });
};

/**
 * Get if a schema is new
 * @param {string} sSchema
 * @private
 */
nsVmap.importVexCtrl.prototype.isNewSchema_ = function (sSchema) {
    var bIsNew = this.$scope_['aSchemas'].indexOf(sSchema) === -1;
    return bIsNew;
};


// Etape Import du fichier

/**
 * Récupère le contenu du fichier vex sélectionné
 * @returns {defer.promise}
 */
nsVmap.importVexCtrl.prototype.parseVexFile_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.parseVexFile_");

    var this_ = this;
    var deferred = this.$q_.defer();

    var aFiles = $('#import-vex-file-input').prop('files');

    if (!goog.isDefAndNotNull(aFiles[0])) {
        $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_SELECT_VEX_FILE'], 'error');
        return null;
    }

    // Récupère le contenu au format JSON
    this.getVexFileContent_(aFiles[0]).then(function (oVexContent) {

        // SQL
        if (goog.isDefAndNotNull(oVexContent['sql'])) {
            this_.$scope_['oSql'] = oVexContent['sql'];
        }

        // Web services
        if (goog.isDefAndNotNull(oVexContent['web_services'])) {
            this_.$scope_['aWebServices'] = oVexContent['web_services'];
        }

        // Objets vMap
        if (goog.isDefAndNotNull(oVexContent['vmap_objects'])) {
            this_.$scope_['oVMapObjects'] = oVexContent['vmap_objects'];
        }

        deferred.resolve();
    });

    return deferred.promise;
};

/**
 * Récupère le contenu du fichier vex passé en paramètre
 * @param {object} oVexFile
 * @returns {defer.promise}
 */
nsVmap.importVexCtrl.prototype.getVexFileContent_ = function (oVexFile) {
    this.$log_.info("nsVmap.importVexCtrl.getVexFileContent_");

    var this_ = this;
    var deferred = this.$q_.defer();

    var oFormData_ = new FormData();
    oFormData_.append('vex_file', oVexFile);

    ajaxRequest({
        'method': 'POST',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vmap/vex/parse_vex',
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'data': oFormData_,
        'scope': this.$scope_,
        'success': function (response) {
            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_VEX_IMPORT_FAIL'], "error");
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
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_VEX_IMPORT_FAIL'], "error");
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['vex'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_VEX_IMPORT_FAIL'], "error");
                return null;
            }
            deferred.resolve(response['data']['vex']);
        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_VEX_IMPORT_FAIL'], "error");
            deferred.reject();
        }
    });

    return deferred.promise;
};


// Etape Configuration

/**
 * Charge aDatabases, aSchemas, aCoordsys et oPrivateConnection
 * @returns {defer.promise}
 */
nsVmap.importVexCtrl.prototype.loadConfigObjects_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.loadConfigObjects_");

    var this_ = this;
    var deferred = this.$q_.defer();

    var tmpCounter = 0;
    var tmpCounterLimit = 3;
    var displayNextStepOnListsLoaded = function () {
        tmpCounter++;
        if (tmpCounter >= tmpCounterLimit) {
            deferred.resolve();
        }
    };

    // Charge la connexion privée
    this.loadVm4msPrivateConnection_().then(function () {

        // Set la base de données en fonction de la connexion privée
        if (!goog.isDefAndNotNull(this_.$scope_['oPrivateConnection'])) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_PRIVATE_CONNECTION'], "error");
            return null;
        }
        if (!goog.isDefAndNotNull(this_.$scope_['oPrivateConnection']['database'])) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_PRIVATE_CONNECTION'], "error");
            return null;
        }

        // Charge les bases de données
        this_.loadDatabases_(this_.$scope_['oPrivateConnection']['database']).then(function () {

            // Vérifie que la base de données soit bien celle de la connexion privée
            if (goog.isDefAndNotNull(this_.selectedDatabaseWatcher)) {
                this_.selectedDatabaseWatcher();
            }

            // Chargement des schémas et coordsys
            this_.loadSchemas_().then(displayNextStepOnListsLoaded);
            this_.loadRoleGroups_().then(displayNextStepOnListsLoaded);
            this_.loadCoordsys_().then(displayNextStepOnListsLoaded);

            // Évènement sur le changement de database
            this_.selectedDatabaseWatcher = this_.$scope_.$watch('usedDatabase', function (newVal, oldVal) {
                if (newVal == oldVal) {
                    return;
                }

                if (goog.isDefAndNotNull(this_.$scope_['oPrivateConnection'])) {
                    if (goog.isDefAndNotNull(this_.$scope_['oPrivateConnection']['database'])) {
                        this_.loadSchemas_();
                        this_.loadRoleGroups_();
                        if (this_.$scope_['usedDatabase'] !== this_.$scope_['oPrivateConnection']['database']) {
                            bootbox.alert('<h4>' + this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_PRIVATE_CONNECTION_DATABASE_DIFFERENT'] + '</h4>');
                        }
                    }
                }
            });
        });
    });

    return deferred.promise;
};

/**
 * Load the avaliable databases list
 * @param {string} sDefaultDatabase
 * @private
 */
nsVmap.importVexCtrl.prototype.loadDatabases_ = function (sDefaultDatabase) {
    this.$log_.info("nsVmap.importVexCtrl.loadDatabases_");

    var this_ = this;
    var deferred = this.$q_.defer();
    var aUnallowedDatabases = ['postgres'];

    goog.array.clear(this.$scope_['aDatabases']);
    this.$scope_['usedDatabase'] = null;
    ajaxRequest({
        'method': 'GET',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vitis/genericquerys/databases',
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'scope': this.$scope_,
        'success': function (response) {

            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_DATABASES'], "error");
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

            if (this_.$scope_['aDatabases'].indexOf(sDefaultDatabase) !== 1) {
                this_.$scope_['usedDatabase'] = sDefaultDatabase;
            } else {
                bootbox.alert(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_PRIVATE_CONNECTION_DATABASE_DIFFERENT']);
                this_.$scope_['usedDatabase'] = this_['oProperties']['database'];
            }

            deferred.resolve();
        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_DATABASES'], "error");
        }
    });

    return deferred.promise;
};

/**
 * Load the avaliable schemas list
 * @private
 */
nsVmap.importVexCtrl.prototype.loadSchemas_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.loadSchemas_");

    var this_ = this;
    var deferred = this.$q_.defer();
    var aUnallowedSchemas = ['pg_catalog', 'information_schema'];

    goog.array.clear(this.$scope_['aSchemas']);
    this.$scope_['usedSchema'] = null;
    ajaxRequest({
        'method': 'GET',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vitis/genericquerys/' + this_.$scope_['usedDatabase'] + '/schemas',
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'scope': this.$scope_,
        'success': function (response) {

            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_SCHEMAS'], "error");
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

            deferred.resolve();
        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_SCHEMAS'], "error");
        }
    });

    return deferred.promise;
};

/**
 * Load the avaliable role groups list
 * @private
 */
nsVmap.importVexCtrl.prototype.loadRoleGroups_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.loadRoleGroups_");

    var this_ = this;
    var deferred = this.$q_.defer();

    goog.array.clear(this.$scope_['aRoleGroups']);
    this.$scope_['usedSchema'] = null;
    ajaxRequest({
        'method': 'GET',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vitis/genericquerys/',
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'params': {
            'database': this_.$scope_['usedDatabase'],
            'schema': 'pg_catalog',
            'table': 'pg_group'
        },
        'scope': this.$scope_,
        'success': function (response) {

            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_ROLEGROUPS'], "error");
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['data'])) {
                console.error("Aucun résultat", response);
                return null;
            }

            for (var i = 0; i < response['data']['data'].length; i++) {
                if (goog.isDefAndNotNull(response['data']['data'][i]['groname'])) {
                    this_.$scope_['aRoleGroups'].push(response['data']['data'][i]['groname']);
                }
            }

            deferred.resolve();
        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_ROLEGROUPS'], "error");
        }
    });

    return deferred.promise;
};

/**
 * Load the avaliable coordinate systems
 * @private
 */
nsVmap.importVexCtrl.prototype.loadCoordsys_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.loadCoordsys_");

    var this_ = this;
    var deferred = this.$q_.defer();

    goog.array.clear(this.$scope_['aCoordsys']);
    this.$scope_['usedSRID'] = null;
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
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_COORDSYS'], "error");
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['data'])) {
                console.error("Aucun résultat: coordinatesystems", response);
                return null;
            }

            this_.$scope_['aCoordsys'] = response['data']['data'];
            this_.$scope_['usedSRID'] = 2154;

            deferred.resolve();
        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_COORDSYS'], "error");
        }
    });


    return deferred.promise;
};

/**
 * Load the vm4ms private connection
 * @private
 */
nsVmap.importVexCtrl.prototype.loadVm4msPrivateConnection_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.loadVm4msPrivateConnection_");

    var this_ = this;
    var deferred = this.$q_.defer();

    ajaxRequest({
        'method': 'GET',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vm4ms/layerconnections',
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'params': {
            'filter': '{"column":"private","compare_operator":"=","value":true}'
        },
        'scope': this.$scope_,
        'success': function (response) {

            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_PRIVATE_CONNECTION'], "error");
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['data'])) {
                console.error("Aucun résultat: coordinatesystems", response);
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['data'][0])) {
                console.error("Aucun résultat: coordinatesystems", response);
                return null;
            }

            this_.$scope_['oPrivateConnection'] = response['data']['data'][0];
            if (!goog.isDefAndNotNull(this_.$scope_['oPrivateConnection']['database'])) {
                this_.$scope_['oPrivateConnection']['database'] = this_['oProperties']['database'];
            }

            deferred.resolve();
        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_PRIVATE_CONNECTION'], "error");
        }
    });

    return deferred.promise;
};

/**
 * Set scope.usedSchema (called in html view)
 * @param {boolean} bIsNew
 * @export
 */
nsVmap.importVexCtrl.prototype.setUsedSchema = function (bIsNew) {
    this.$log_.info("nsVmap.importVexCtrl.setUsedSchema");

    if (bIsNew) {
        this.$scope_['selectedExistingSchema'] = '';
        this.$scope_['usedSchema'] = this.$scope_['createdNewSchema'];
    } else {
        this.$scope_['createdNewSchema'] = '';
        this.$scope_['usedSchema'] = this.$scope_['selectedExistingSchema'];
    }
};

/**
 * Return true if the state is valid, otherwise display an error and return false
 * @returns {Boolean}
 */
nsVmap.importVexCtrl.prototype.isConfigStateValid = function () {
    this.$log_.info("nsVmap.importVexCtrl.isConfigStateValid");

    if (!goog.isDefAndNotNull(this.$scope_['usedDatabase'])) {
        $.notify(this['oTranslations']['CTRL_IMPORT_VEX_ERROR_DATABASE_REQUIRED'], "error");
        return false;
    }
    if (!goog.isDefAndNotNull(this.$scope_['usedSchema'])) {
        $.notify(this['oTranslations']['CTRL_IMPORT_VEX_ERROR_SCHEMA_REQUIRED'], "error");
        return false;
    }
    if (!goog.isDefAndNotNull(this.$scope_['usedSRID'])) {
        $.notify(this['oTranslations']['CTRL_IMPORT_VEX_ERROR_COORDSYS_REQUIRED'], "error");
        return false;
    }
    if (!goog.isDefAndNotNull(this.$scope_['usedUserRole'])) {
        $.notify(this['oTranslations']['CTRL_IMPORT_VEX_ERROR_USER_ROLE_REQUIRED'], "error");
        return false;
    }
    if (!goog.isDefAndNotNull(this.$scope_['usedAdminRole'])) {
        $.notify(this['oTranslations']['CTRL_IMPORT_VEX_ERROR_ADMIN_ROLE_REQUIRED'], "error");
        return false;
    }
    return true;
};


// Étape Objets vMap

/**
 * Load the vmap_objects step
 * @returns {defer.promise}
 */
nsVmap.importVexCtrl.prototype.loadVMapObjects_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.loadVMapObjects_");

    var this_ = this;
    var deferred = this.$q_.defer();
    this.oExistingVMapObjects_ = {};

    // Récupère les objets vMap ayant les mêmes noms que ceux définis dans $scope.vmap_objects
    if (goog.isDefAndNotNull(this.$scope_['oVMapObjects'])) {
        this.getExistingVMapObjects_().then(function (oExistingVMapObjects) {

            this_.oExistingVMapObjects_ = oExistingVMapObjects;

            // Chage les données sur l'arbre
            this_.loadVMapObjectsTreeview_();
            setTimeout(function () {
                deferred.resolve();
            });
        });
    } else {
        setTimeout(function () {
            deferred.reject();
        });
    }

    return deferred.promise;
};

/**
 * Récupère les objets vMap qui existent déjà (vérification par le nom)
 * @returns {defer.promise}
 */
nsVmap.importVexCtrl.prototype.getExistingVMapObjects_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.getExistingVMapObjects_");

    var this_ = this;
    var deferred = this.$q_.defer();

    var oVMapObjectsNames = this.getVMapObjectNames_(true);

    ajaxRequest({
        'method': 'GET',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vmap/vex/existing_vmap_objects',
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'params': oVMapObjectsNames,
        'scope': this.$scope_,
        'success': function (response) {
            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_EXISTING_VMAP_OBJETS'], "error");
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
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_EXISTING_VMAP_OBJETS'], "error");
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['vmap_objects'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_EXISTING_VMAP_OBJETS'], "error");
                return null;
            }
            deferred.resolve(response['data']['vmap_objects']);
        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_EXISTING_VMAP_OBJETS'], "error");
            deferred.reject();
        }
    });

    return deferred.promise;
};

/**
 * Get the vMap objets names defined in scope.oVMapObjects
 * @param {boolean} bAsString trus to return the result on strings delimited by pipes
 * @returns {Object}
 */
nsVmap.importVexCtrl.prototype.getVMapObjectNames_ = function (bAsString) {
    this.$log_.info("nsVmap.importVexCtrl.getVMapObjectNames_");

    bAsString = goog.isDefAndNotNull(bAsString) ? bAsString : false;

    var this_ = this;

    if (!goog.isDefAndNotNull(this_.$scope_['oVMapObjects'])) {
        return;
    }

    /**
     * get the vMap objects names
     * @param {string} sObjectKey object key (map, calque ...)
     * @param {string} sNameField name field (name, business_object_id)
     * @returns {Array}
     */
    var getObjectNamesGeniric = function (sObjectKey, sNameField) {
        var aNames = [];
        if (goog.isArray(this_.$scope_['oVMapObjects'][sObjectKey])) {
            for (var i = 0; i < this_.$scope_['oVMapObjects'][sObjectKey].length; i++) {
                if (this_.$scope_['oVMapObjects'][sObjectKey][i][sNameField]) {
                    aNames.push(this_.$scope_['oVMapObjects'][sObjectKey][i][sNameField]);
                }
            }
        }
        return aNames;
    };

    var oVMapObjectsNames = {};
    if (goog.isDefAndNotNull(this.$scope_['oVMapObjects'])) {

        // Cartes
        var aMapNames = getObjectNamesGeniric('maps', 'name');
        if (aMapNames.length > 0) {
            oVMapObjectsNames['maps'] = !bAsString ? aMapNames : aMapNames.join('|');
        }

        // Services
        var aServiceNames = getObjectNamesGeniric('services', 'name');
        if (aServiceNames.length > 0) {
            oVMapObjectsNames['services'] = !bAsString ? aServiceNames : aServiceNames.join('|');
        }

        // Calques
        var aCalqueNames = getObjectNamesGeniric('calques', 'name');
        if (aCalqueNames.length > 0) {
            oVMapObjectsNames['calques'] = !bAsString ? aCalqueNames : aCalqueNames.join('|');
        }

        // Thème des calques
        var aCalqueThemeNames = getObjectNamesGeniric('calque_themes', 'name');
        if (aCalqueThemeNames.length > 0) {
            oVMapObjectsNames['calque_themes'] = !bAsString ? aCalqueThemeNames : aCalqueThemeNames.join('|');
        }

        // Couches Mapserver
        var aVm4msLayerNames = getObjectNamesGeniric('vm4ms_layers', 'name');
        if (aVm4msLayerNames.length > 0) {
            oVMapObjectsNames['vm4ms_layers'] = !bAsString ? aVm4msLayerNames : aVm4msLayerNames.join('|');
        }

        // Objets métier
        var aBONames = getObjectNamesGeniric('business_objects', 'business_object_id');
        if (aBONames.length > 0) {
            oVMapObjectsNames['business_objects'] = !bAsString ? aBONames : aBONames.join('|');
        }

        // Événements
        var aEventNames = getObjectNamesGeniric('events', 'event_id');
        if (aEventNames.length > 0) {
            oVMapObjectsNames['events'] = !bAsString ? aEventNames : aEventNames.join('|');
        }

        // Rapports
        var aReportNames = getObjectNamesGeniric('reports', 'name');
        if (aReportNames.length > 0) {
            oVMapObjectsNames['reports'] = !bAsString ? aReportNames : aReportNames.join('|');
        }
    }

    return oVMapObjectsNames;
};

/**
 * Load the treeview to select vMap objects
 */
nsVmap.importVexCtrl.prototype.loadVMapObjectsTreeview_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.loadVMapObjectsTreeview_");

    var this_ = this;

    $('#import-vex-vmap-objects-treeview')['treeview']({
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
        'showCheckbox': false
    });
};

/**
 * Get the treeview format node for vMap Objects
 * @returns {array}
 */
nsVmap.importVexCtrl.prototype.getTreeviewDataFromVMapObjects_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.getTreeviewDataFromVMapObjects_");

    var aData = [];

    if (goog.isDefAndNotNull(this.$scope_['oVMapObjects'])) {

        // maps
        if (goog.isDefAndNotNull(this.$scope_['oVMapObjects']['maps'])) {
            aData.push(this.getTreeviewMaps_(this.$scope_['oVMapObjects']['maps']));
        }

        // services
        if (goog.isDefAndNotNull(this.$scope_['oVMapObjects']['services'])) {
            aData.push(this.getTreeviewServices_(this.$scope_['oVMapObjects']['services']));
        }

        // calques
        if (goog.isDefAndNotNull(this.$scope_['oVMapObjects']['calques'])) {
            aData.push(this.getTreeviewCalques_(this.$scope_['oVMapObjects']['calques']));
        }

        // calque_themes
        if (goog.isDefAndNotNull(this.$scope_['oVMapObjects']['calque_themes'])) {
            aData.push(this.getTreeviewCalqueThemes_(this.$scope_['oVMapObjects']['calque_themes']));
        }

        // vm4ms_layers
        if (goog.isDefAndNotNull(this.$scope_['oVMapObjects']['vm4ms_layers'])) {
            aData.push(this.getTreeviewVm4msLayers_(this.$scope_['oVMapObjects']['vm4ms_layers']));
        }

        // business_objects
        if (goog.isDefAndNotNull(this.$scope_['oVMapObjects']['business_objects'])) {
            aData.push(this.getTreeviewBOs_(this.$scope_['oVMapObjects']['business_objects']));
        }

        // events
        if (goog.isDefAndNotNull(this.$scope_['oVMapObjects']['events'])) {
            aData.push(this.getTreeviewEvents_(this.$scope_['oVMapObjects']['events']));
        }

        // reports
        if (goog.isDefAndNotNull(this.$scope_['oVMapObjects']['reports'])) {
            aData.push(this.getTreeviewReports_(this.$scope_['oVMapObjects']['reports']));
        }
    }

    return aData;
};

/**
 * Get the treeview format node for maps
 * @param {array} aMaps
 * @returns {object}
 */
nsVmap.importVexCtrl.prototype.getTreeviewMaps_ = function (aMaps) {
    this.$log_.info("nsVmap.importVexCtrl.getTreeviewMaps_");

    var oNode = {
        'text': 'Cartes',
        'icon': 'icon-map',
        'selectable': false,
        'state': {
            'checked': true,
            'expanded': true
        },
        'nodes': []
    };

    var isExistingObject;
    if (goog.isArray(aMaps)) {
        for (var i = 0; i < aMaps.length; i++) {
            isExistingObject = this.isVMapObjectAlreadyPresent('maps', 'name', aMaps[i]['name']);
            oNode['nodes'].push({
                'text': 'Carte: ' + aMaps[i]['name'] + (isExistingObject ? ' (Déjà présent sur l\'application) <span class="icon-draw"></span>' : ''),
                'color': isExistingObject ? "#337ab7" : "#333",
                'icon': 'icon-map',
                'selectable': false,
                'state': {
                    'checked': true,
                    'expanded': true
                },
                'type_': 'map',
                'properties_': aMaps[i],
                'isExisting_': isExistingObject,
                'nodes': []
            });
        }
    }

    return oNode;
};

/**
 * Get the treeview format node for services
 * @param {array} aServices
 * @returns {object}
 */
nsVmap.importVexCtrl.prototype.getTreeviewServices_ = function (aServices) {
    this.$log_.info("nsVmap.importVexCtrl.getTreeviewServices_");

    var oNode = {
        'text': 'Services',
        'icon': 'icon-link-external',
        'selectable': false,
        'state': {
            'checked': true,
            'expanded': true
        },
        'nodes': []
    };

    var isExistingObject;
    if (goog.isArray(aServices)) {
        for (var i = 0; i < aServices.length; i++) {
            isExistingObject = this.isVMapObjectAlreadyPresent('services', 'name', aServices[i]['name']);
            oNode['nodes'].push({
                'text': 'Service: ' + aServices[i]['name'] + (isExistingObject ? ' (Déjà présent sur l\'application) <span class="icon-draw"></span>' : ''),
                'color': isExistingObject ? "#337ab7" : "#333",
                'icon': 'icon-link-external',
                'selectable': false,
                'state': {
                    'checked': true,
                    'expanded': true
                },
                'type_': 'service',
                'properties_': aServices[i],
                'isExisting_': isExistingObject,
                'nodes': []
            });
        }
    }

    return oNode;
};

/**
 * Get the treeview format node for calques
 * @param {array} aCalques
 * @returns {object}
 */
nsVmap.importVexCtrl.prototype.getTreeviewCalques_ = function (aCalques) {
    this.$log_.info("nsVmap.importVexCtrl.getTreeviewCalques_");

    var oNode = {
        'text': 'Calques',
        'icon': 'icon-layers',
        'selectable': false,
        'state': {
            'checked': true,
            'expanded': true
        },
        'nodes': []
    };

    var isExistingObject;
    if (goog.isArray(aCalques)) {
        for (var i = 0; i < aCalques.length; i++) {
            isExistingObject = this.isVMapObjectAlreadyPresent('calques', 'name', aCalques[i]['name']);
            oNode['nodes'].push({
                'text': 'Calque: ' + aCalques[i]['name'] + (isExistingObject ? ' (Déjà présent sur l\'application) <span class="icon-draw"></span>' : ''),
                'color': isExistingObject ? "#337ab7" : "#333",
                'icon': 'icon-layers',
                'selectable': false,
                'state': {
                    'checked': true,
                    'expanded': true
                },
                'type_': 'calque',
                'properties_': aCalques[i],
                'isExisting_': isExistingObject,
                'nodes': []
            });
        }
    }

    return oNode;
};

/**
 * Get the treeview format node for calque themes
 * @param {array} aCalqueThemes
 * @returns {object}
 */
nsVmap.importVexCtrl.prototype.getTreeviewCalqueThemes_ = function (aCalqueThemes) {
    this.$log_.info("nsVmap.importVexCtrl.getTreeviewCalqueThemes_");

    var oNode = {
        'text': 'Thèmes des calques',
        'icon': 'icon-layers',
        'selectable': false,
        'state': {
            'checked': true,
            'expanded': true
        },
        'nodes': []
    };

    var isExistingObject;
    if (goog.isArray(aCalqueThemes)) {
        for (var i = 0; i < aCalqueThemes.length; i++) {
            isExistingObject = this.isVMapObjectAlreadyPresent('calque_themes', 'name', aCalqueThemes[i]['name']);
            oNode['nodes'].push({
                'text': 'Thème : ' + aCalqueThemes[i]['name'] + (isExistingObject ? ' (Déjà présent sur l\'application) <span class="icon-draw"></span>' : ''),
                'color': isExistingObject ? "#337ab7" : "#333",
                'icon': 'icon-layers',
                'selectable': false,
                'state': {
                    'checked': true,
                    'expanded': true
                },
                'type_': 'calque_theme',
                'properties_': aCalqueThemes[i],
                'isExisting_': isExistingObject,
                'nodes': []
            });
        }
    }

    return oNode;
};

/**
 * Get the treeview format node for vm4ms_layers
 * @param {array} aVm4msLayers
 * @returns {object}
 */
nsVmap.importVexCtrl.prototype.getTreeviewVm4msLayers_ = function (aVm4msLayers) {
    this.$log_.info("nsVmap.importVexCtrl.getTreeviewVm4msLayers_");

    var oNode = {
        'text': 'Couches Mapserver',
        'icon': 'icon-layers2',
        'selectable': false,
        'state': {
            'checked': true,
            'expanded': true
        },
        'nodes': []
    };

    var isExistingObject;
    if (goog.isArray(aVm4msLayers)) {
        for (var i = 0; i < aVm4msLayers.length; i++) {
            isExistingObject = this.isVMapObjectAlreadyPresent('vm4ms_layers', 'name', aVm4msLayers[i]['name']);
            oNode['nodes'].push({
                'text': 'Couche Mapserver: ' + aVm4msLayers[i]['name'] + (isExistingObject ? ' (Déjà présent sur l\'application) <span class="icon-draw"></span>' : ''),
                'color': isExistingObject ? "#337ab7" : "#333",
                'icon': 'icon-layers2',
                'selectable': false,
                'state': {
                    'checked': true,
                    'expanded': true
                },
                'type_': 'vm4ms_layer',
                'properties_': aVm4msLayers[i],
                'isExisting_': isExistingObject,
                'nodes': []
            });
        }
    }

    return oNode;
};

/**
 * Get the treeview format node for business_objects
 * @param {array} aBOs
 * @returns {object}
 */
nsVmap.importVexCtrl.prototype.getTreeviewBOs_ = function (aBOs) {
    this.$log_.info("nsVmap.importVexCtrl.getTreeviewBOs_");

    var oNode = {
        'text': 'Objets métiers',
        'icon': 'icon-vmap_business_object',
        'selectable': false,
        'state': {
            'checked': true,
            'expanded': true
        },
        'nodes': []
    };

    var isExistingObject;
    if (goog.isArray(aBOs)) {
        for (var i = 0; i < aBOs.length; i++) {
            isExistingObject = this.isVMapObjectAlreadyPresent('business_objects', 'business_object_id', aBOs[i]['business_object_id']);
            oNode['nodes'].push({
                'text': 'Objet métier: ' + aBOs[i]['business_object_id'] + (isExistingObject ? ' (Déjà présent sur l\'application) <span class="icon-draw"></span>' : ''),
                'color': isExistingObject ? "#337ab7" : "#333",
                'icon': 'icon-vmap_business_object',
                'selectable': false,
                'state': {
                    'checked': true,
                    'expanded': true
                },
                'type_': 'business_object',
                'properties_': aBOs[i],
                'isExisting_': isExistingObject,
                'nodes': []
            });
        }
    }

    return oNode;
};

/**
 * Get the treeview format node for events
 * @param {array} aEvents
 * @returns {object}
 */
nsVmap.importVexCtrl.prototype.getTreeviewEvents_ = function (aEvents) {
    this.$log_.info("nsVmap.importVexCtrl.getTreeviewEvents_");

    var oNode = {
        'text': 'Evènements',
        'icon': 'icon-vmap_business_object',
        'selectable': false,
        'state': {
            'checked': true,
            'expanded': true
        },
        'nodes': []
    };

    var isExistingObject;
    if (goog.isArray(aEvents)) {
        for (var i = 0; i < aEvents.length; i++) {
            isExistingObject = this.isVMapObjectAlreadyPresent('events', 'event_id', aEvents[i]['event_id']);
            oNode['nodes'].push({
                'text': 'Evènement: ' + aEvents[i]['event_id'] + (isExistingObject ? ' (Déjà présent sur l\'application) <span class="icon-draw"></span>' : ''),
                'color': isExistingObject ? "#337ab7" : "#333",
                'icon': 'icon-vmap_business_object',
                'selectable': false,
                'state': {
                    'checked': true,
                    'expanded': true
                },
                'type_': 'event',
                'properties_': aEvents[i],
                'isExisting_': isExistingObject,
                'nodes': []
            });
        }
    }

    return oNode;
};

/**
 * Get the treeview format node for reports
 * @param {array} aReports
 * @returns {object}
 */
nsVmap.importVexCtrl.prototype.getTreeviewReports_ = function (aReports) {
    this.$log_.info("nsVmap.importVexCtrl.getTreeviewReports_");

    var oNode = {
        'text': 'Rapports',
        'icon': 'icon-vmap_business_object',
        'selectable': false,
        'state': {
            'checked': true,
            'expanded': true
        },
        'nodes': []
    };

    var isExistingObject;
    if (goog.isArray(aReports)) {
        for (var i = 0; i < aReports.length; i++) {
            isExistingObject = this.isVMapObjectAlreadyPresent('reports', 'name', aReports[i]['name']);
            oNode['nodes'].push({
                'text': 'Rapport: ' + aReports[i]['name'] + (isExistingObject ? ' (Déjà présent sur l\'application) <span class="icon-draw"></span>' : ''),
                'color': isExistingObject ? "#337ab7" : "#333",
                'icon': 'icon-vmap_business_object',
                'selectable': false,
                'state': {
                    'checked': true,
                    'expanded': true
                },
                'type_': 'report',
                'properties_': aReports[i],
                'isExisting_': isExistingObject,
                'nodes': []
            });
        }
    }

    return oNode;
};

/**
 * Return true if the object already exists
 * @param {string} sObjectKey object key (map, calque ...)
 * @param {string} sNameField name field (name, business_object_id)
 * @param {string} sTestName the name to test with
 * @returns {Boolean}
 */
nsVmap.importVexCtrl.prototype.isVMapObjectAlreadyPresent = function (sObjectKey, sNameField, sTestName) {
    this.$log_.info("nsVmap.importVexCtrl.isVMapObjectAlreadyPresent");

    var isExisting = false;

    if (goog.isDefAndNotNull(this.oExistingVMapObjects_)) {
        if (goog.isArray(this.oExistingVMapObjects_[sObjectKey])) {
            for (var i = 0; i < this.oExistingVMapObjects_[sObjectKey].length; i++) {
                if (goog.isDefAndNotNull(this.oExistingVMapObjects_[sObjectKey][i][sNameField])) {
                    if (this.oExistingVMapObjects_[sObjectKey][i][sNameField] === sTestName) {
                        return true;
                    }
                }
            }
        }
    }

    return isExisting;
};

/**
 * Function called when a node state is updated
 * @param {string} sEvent
 * @param {object} oNode
 */
nsVmap.importVexCtrl.prototype.onVMapObjectsTreeviewUpdate_ = function (sEvent, oNode) {
    this.$log_.info("nsVmap.importVexCtrl.onVMapObjectsTreeviewUpdate_");

    // Empèche le collapse et la sélection
    if (sEvent === 'nodeCollapsed') {
        $('#import-vex-vmap-objects-treeview').data('treeview')['expandNode'](oNode['nodeId'], {'silent': true});
    }
    if (sEvent === 'nodeUnchecked') {
        $('#import-vex-vmap-objects-treeview').data('treeview')['checkNode'](oNode['nodeId'], {'silent': true});
    }

    if (sEvent === 'nodeCollapsed' || sEvent === 'nodeExpanded') {
        if (goog.isDefAndNotNull(oNode['type_']) && goog.isDefAndNotNull(oNode['properties_'])) {
            if (this.lastParentCollapseTimeout_ + 500 < Date.now()) {
                this.editVMapObject_(oNode['properties_'], oNode['type_']);
            }
        } else {
            this.lastParentCollapseTimeout_ = Date.now();
        }
    }
};

/**
 * Edit the vMap object name in a modal
 * @param {object} oObject treeview node
 * @param {string} sType
 */
nsVmap.importVexCtrl.prototype.editVMapObject_ = function (oObject, sType) {
    this.$log_.info("nsVmap.importVexCtrl.editVMapObject_");

    var this_ = this;

    var sValue;
    switch (sType) {
        case 'map':
        case 'service':
        case 'calque':
        case 'calque_theme':
        case 'vm4ms_layer':
        case 'report':
            sValue = oObject['name'];
            break;
        case 'business_object':
            sValue = oObject['business_object_id'];
            break;
        case 'event':
            sValue = oObject['event_id'];
            break;
        default:
            break;
    }

    bootbox['prompt']({
        'title': 'Modifier le nom',
        'inputType': 'text',
        'value': sValue,
        'callback': function (result) {
            if (goog.isDefAndNotNull(result)) {
                this_.changeVMapObjectName_(oObject, sType, result);
            }
        }
    });
};

/**
 * Permet d'éditer génériquement le nom d'un objet vMap ayant un identificant numérique
 * @param {object} oObject
 * @param {string} sType
 * @param {string} sNewName
 */
nsVmap.importVexCtrl.prototype.changeVMapObjectName_ = function (oObject, sType, sNewName) {
    this.$log_.info("nsVmap.importVexCtrl.changeVMapObjectName_");

    var this_ = this;
    var sIdField, sNameField, sVMapObjectsKey, sPattern, bEdited = false;
    switch (sType) {
        case 'map':
            sIdField = 'map_id';
            sNameField = 'name';
            sVMapObjectsKey = 'maps';
            break;
        case 'service':
            sIdField = 'service_id';
            sNameField = 'name';
            sVMapObjectsKey = 'services';
            break;
        case 'calque':
            sIdField = 'layer_id';
            sNameField = 'name';
            sVMapObjectsKey = 'calques';
            break;
        case 'calque_theme':
            sIdField = 'layertheme_id';
            sNameField = 'name';
            sVMapObjectsKey = 'calque_themes';
            break;
        case 'vm4ms_layer':
            sIdField = 'ms_layer_id';
            sNameField = 'name';
            sVMapObjectsKey = 'vm4ms_layers';
            sPattern = "^[A-Za-z0-9_]{1,32}$";
            break;
        case 'business_object':
            sIdField = 'business_object_id';
            sNameField = 'business_object_id';
            sVMapObjectsKey = 'business_objects';
            sPattern = "^[A-Za-z0-9_]{1,32}$";
            break;
        case 'report':
            sIdField = 'printreport_id';
            sNameField = 'name';
            sVMapObjectsKey = 'reports';
            break;
        case 'event':
            sIdField = 'event_id';
            sNameField = 'event_id';
            sVMapObjectsKey = 'events';
            sPattern = "^[A-Za-z0-9_]{1,32}$";
            break;
        default:
            break;
    }

    // Regexp
    if (goog.isDefAndNotNull(sPattern)) {
        if (RegExp(sPattern).test(sNewName) !== true) {
            $.notify(this['oTranslations']['CTRL_IMPORT_VEX_ERROR_EDIT_NAME_NOT_VALID'], "error");
            return false;
        }
    }

    // Met à jour le nom
    if (goog.isDefAndNotNull(sIdField) &&
            goog.isDefAndNotNull(sNameField) &&
            goog.isDefAndNotNull(sVMapObjectsKey)) {

        if (goog.isDefAndNotNull(oObject[sIdField]) &&
                goog.isDefAndNotNull(this.$scope_['oVMapObjects'][sVMapObjectsKey])) {

            for (var i = 0; i < this.$scope_['oVMapObjects'][sVMapObjectsKey].length; i++) {
                if (this.$scope_['oVMapObjects'][sVMapObjectsKey][i][sIdField] === oObject[sIdField]) {
                    this.$scope_['oVMapObjects'][sVMapObjectsKey][i][sNameField] = sNewName;
                    bEdited = true;
                }
            }
        }

    }

    // Change le nom dans les dépendances
    if (bEdited) {
        if (sType === 'business_object') {
            // Calques
            this.changeVMapObjectNameInDependencies_('calques', 'bo_id_list', oObject[sNameField], sNewName);
            // Rapports
            this.changeVMapObjectNameInDependencies_('reports', 'business_object_id', oObject[sNameField], sNewName);
            // Formulaires objet métier
            this.changeBONameFormDependencies(oObject[sNameField], sNewName);
        }
        if (sType === 'event') {
            // Objets métiers
            this.changeVMapObjectNameInDependencies_('business_objects', 'event_id', oObject[sNameField], sNewName);
        }
        if (sType === 'vm4ms_layer') {
            // Calques
            this.changeVMapObjectNameInDependencies_('calques', 'layer_list', oObject[sNameField], sNewName);
        }
    }

    setTimeout(function () {
        this_.loadVMapObjects_();
    });
};

/**
 * Édite le nom d'un objet dans les dépendances
 * @param {string} sVMapObjectsDepKey
 * @param {string} sDepNameField
 * @param {object} oldName
 * @param {string} sNewName
 */
nsVmap.importVexCtrl.prototype.changeVMapObjectNameInDependencies_ = function (sVMapObjectsDepKey, sDepNameField, oldName, sNewName) {
    this.$log_.info("nsVmap.importVexCtrl.changeVMapObjectNameInDependencies_");

    var oRegex = new RegExp("\\b" + oldName + "\\b");
    if (goog.isDefAndNotNull(this.$scope_['oVMapObjects'][sVMapObjectsDepKey])) {
        for (var i = 0; i < this.$scope_['oVMapObjects'][sVMapObjectsDepKey].length; i++) {
            if (goog.isString(this.$scope_['oVMapObjects'][sVMapObjectsDepKey][i][sDepNameField])) {
                if (oRegex.test(this.$scope_['oVMapObjects'][sVMapObjectsDepKey][i][sDepNameField])) {
                    this.$scope_['oVMapObjects'][sVMapObjectsDepKey][i][sDepNameField] = this.$scope_['oVMapObjects'][sVMapObjectsDepKey][i][sDepNameField].replace(oRegex, sNewName);
                }
            }
        }
    }
};

/**
 * Change le nom des clés permettant de lier un objet métier à ses formulaires
 * @param {string} oldName
 * @param {string} newName
 */
nsVmap.importVexCtrl.prototype.changeBONameFormDependencies = function (oldName, newName) {
    this.$log_.info("nsVmap.importVexCtrl.changeBONameFormDependencies");

    if (goog.isDefAndNotNull(this.$scope_['oVMapObjects'])) {
        if (goog.isDefAndNotNull(this.$scope_['oVMapObjects']['business_objects_forms'])) {
            if (goog.isDefAndNotNull(this.$scope_['oVMapObjects']['business_objects_forms'][oldName])) {
                this.$scope_['oVMapObjects']['business_objects_forms'][newName] = this.$scope_['oVMapObjects']['business_objects_forms'][oldName];
                delete this.$scope_['oVMapObjects']['business_objects_forms'][oldName];
            }
        }
    }
};


// Etape SQL

/**
 * Load the SQL step
 */
nsVmap.importVexCtrl.prototype.loadSql_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.loadSql_");

    var this_ = this;
    var deferred = this.$q_.defer();

    // Init codemirror
    this.$scope_['codemirrorSQLModelOptions'] = {
        'mode': 'sql'
    };
    this.$scope_['codemirrorSQLDataOptions'] = {
//        'mode': 'sql'
    };

    this.$scope_['sSQLModel'] = '';
    this.$scope_['sSQLData'] = '';

    if (goog.isDefAndNotNull(this.$scope_['oSql'])) {
        if (goog.isDefAndNotNull(this.$scope_['oSql']['export_model_sql'])) {

            // Schéma
            if (this.isNewSchema_(this.$scope_['usedSchema'])) {
                if (this.$scope_['usedSchema'].length > 0) {
                    this.$scope_['sSQLModel'] += '\n--';
                    this.$scope_['sSQLModel'] += '\n-- GENERATED BY VMAP';
                    this.$scope_['sSQLModel'] += '\n-- Creation Schema';
                    this.$scope_['sSQLModel'] += '\n--';
                    this.$scope_['sSQLModel'] += '\n';
                    this.$scope_['sSQLModel'] += '\nCREATE SCHEMA [SCHEMA_NAME] AUTHORIZATION u_vitis;';
                    this.$scope_['sSQLModel'] += '\nGRANT ALL ON SCHEMA [SCHEMA_NAME] TO u_vitis;';
                    this.$scope_['sSQLModel'] += '\n';
                    this.$scope_['sSQLModel'] += '\n';
                }
            }

            this.$scope_['sSQLModel'] = this.getReplacedSQL_(this.$scope_['sSQLModel'] += this.$scope_['oSql']['export_model_sql']);
        }
        if (goog.isDefAndNotNull(this.$scope_['oSql']['export_data_sql'])) {
            this.$scope_['sSQLData'] = this.getReplacedSQL_(this.$scope_['sSQLData'] += this.$scope_['oSql']['export_data_sql']);
        }
    } else {
        setTimeout(function () {
            deferred.reject();
        });
    }

    this.$scope_['refreshCodeMirror']();

    setTimeout(function () {
        deferred.resolve();
    });

    return deferred.promise;
};

/**
 * Make the SQL replacements et return the result
 * @param {string} sSQL
 * @returns {string}
 */
nsVmap.importVexCtrl.prototype.getReplacedSQL_ = function (sSQL) {
    this.$log_.info("nsVmap.importVexCtrl.getReplacedSQL_");

    if (goog.isDefAndNotNull(this.$scope_['usedDatabase'])) {
        sSQL = sSQL.replace(/\[DATABASE_NAME\]/g, this.$scope_['usedDatabase']);
    }
    if (goog.isDefAndNotNull(this.$scope_['usedSchema'])) {
        sSQL = sSQL.replace(/\[SCHEMA_NAME\]/g, this.$scope_['usedSchema']);
    }
    if (goog.isDefAndNotNull(this.$scope_['usedSRID'])) {
        sSQL = sSQL.replace(/\[SRID\]/g, this.$scope_['usedSRID']);
    }
    if (goog.isDefAndNotNull(this.$scope_['usedUserRole'])) {
        sSQL = sSQL.replace(/\[ROLE_USER\]/g, this.$scope_['usedUserRole']);
    }
    if (goog.isDefAndNotNull(this.$scope_['usedAdminRole'])) {
        sSQL = sSQL.replace(/\[ROLE_ADMIN\]/g, this.$scope_['usedAdminRole']);
    }

    return sSQL;
};

// Étape services WEB

/**
 * Load the avaliable web services list
 * @returns {defer.promise}
 * @private
 */
nsVmap.importVexCtrl.prototype.loadWebServices_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.loadWebServices_");

    var this_ = this;
    var deferred = this.$q_.defer();

    // Récupère les objets vMap ayant les mêmes noms que ceux définis dans $scope.vmap_objects
    if (goog.isDefAndNotNull(this.$scope_['aWebServices'])) {
        this.getExistingWebServices_().then(function (aExistingWebServices) {

            this_.aExistingWebServices_ = aExistingWebServices;

            // Charge les données sur l'arbre
            this_.loadWebServicesTreeview_();
            setTimeout(function () {
                deferred.resolve();
            });
        });
    } else {
        setTimeout(function () {
            deferred.reject();
        });
    }

    return deferred.promise;
};

/**
 * Récupère les objets vMap qui existent déjà (vérification par le nom)
 * @returns {defer.promise}
 */
nsVmap.importVexCtrl.prototype.getExistingWebServices_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.getExistingWebServices_");

    var this_ = this;
    var deferred = this.$q_.defer();

    var sWebServiceNames = this.getWebServicesNames_(true);

    ajaxRequest({
        'method': 'GET',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vmap/vex/existing_web_services',
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'params': {
            'web_services': sWebServiceNames
        },
        'scope': this.$scope_,
        'success': function (response) {
            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_EXISTING_WEB_SERVICES'], "error");
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
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_EXISTING_WEB_SERVICES'], "error");
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['web_services'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_EXISTING_WEB_SERVICES'], "error");
                return null;
            }
            deferred.resolve(response['data']['web_services']);
        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_GET_EXISTING_WEB_SERVICES'], "error");
            deferred.reject();
        }
    });

    return deferred.promise;
};

/**
 * Get the web services names defined in scope.aWebServices
 * @param {boolean} bAsString trus to return the result on strings delimited by pipes
 * @returns {Object}
 */
nsVmap.importVexCtrl.prototype.getWebServicesNames_ = function (bAsString) {
    this.$log_.info("nsVmap.importVexCtrl.getWebServicesNames_");

    bAsString = goog.isDefAndNotNull(bAsString) ? bAsString : false;

    if (!goog.isDefAndNotNull(this.$scope_['aWebServices'])) {
        return;
    }

    var aWebServiceNames = [];

    for (var i = 0; i < this.$scope_['aWebServices'].length; i++) {
        if (goog.isDefAndNotNull(this.$scope_['aWebServices'][i]['name'])) {
            aWebServiceNames.push(this.$scope_['aWebServices'][i]['name']);
        }
    }

    return bAsString ? aWebServiceNames.join('|') : aWebServiceNames;
};

/**
 * Load the treeview to select web services
 */
nsVmap.importVexCtrl.prototype.loadWebServicesTreeview_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.loadWebServicesTreeview_");

    var this_ = this;

    $('#import-vex-web-services-treeview')['treeview']({
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
nsVmap.importVexCtrl.prototype.getTreeviewDataFromWebServices_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.getTreeviewDataFromWebServices_");

    var aData = [];
    var oWebService, isExistingWebService;

    if (goog.isArray(this.$scope_['aWebServices'])) {
        for (var i = 0; i < this.$scope_['aWebServices'].length; i++) {
            isExistingWebService = this.isWebServiceAlreadyPresent(this.$scope_['aWebServices'][i]['name']);
            oWebService = {
                'text': this.$scope_['aWebServices'][i]['name'] + (isExistingWebService ? ' (Déjà présent sur l\'application)' : ''),
                'color': isExistingWebService ? "#ff0700" : "#333",
                'icon': 'glyphicon glyphicon-folder-open',
                'selectable': false,
                'state': {
                    'checked': true,
                    'expanded': true
                },
                'properties_': {
                    'type': 'folder',
                    'name': this.$scope_['aWebServices'][i]['name']
                },
                'isExisting_': isExistingWebService,
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
 * Return true if the web service already exists
 * @param {string} sWebService web service name
 * @returns {Boolean}
 */
nsVmap.importVexCtrl.prototype.isWebServiceAlreadyPresent = function (sWebService) {
    var bIsPresent = false;

    if (goog.isDefAndNotNull(this.aExistingWebServices_)) {
        if (this.aExistingWebServices_.indexOf(sWebService) !== -1) {
            return true;
        }
    }

    return bIsPresent;
};

/**
 * Get the treeview formed files from the given web service
 * @param {object} oWebService
 * @returns {Array}
 */
nsVmap.importVexCtrl.prototype.getTreeviewFilesFromWebService_ = function (oWebService) {
    this.$log_.info("nsVmap.importVexCtrl.getTreeviewFilesFromWebService_");

    var aFiles = [];
    var oFile;
    if (goog.isArray(oWebService['files'])) {
        for (var key in oWebService['files']) {
            oFile = {
                'text': key,
                'selectable': false,
                'state': {
                    'checked': true,
                    'expanded': true
                },
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
nsVmap.importVexCtrl.prototype.onWebServicesTreeviewUpdate_ = function (sEvent, oNode) {
    this.$log_.info("nsVmap.importVexCtrl.onWebServicesTreeviewUpdate_");

    // Empèche le collapse et la sélection
    if (sEvent === 'nodeCollapsed') {
        $('#import-vex-web-services-treeview').data('treeview')['expandNode'](oNode['nodeId'], {'silent': true});
    }
    if (sEvent === 'nodeUnchecked') {
        $('#import-vex-web-services-treeview').data('treeview')['checkNode'](oNode['nodeId'], {'silent': true});
    }
};


// Etape export

/**
 * Execute the import
 * @export
 */
nsVmap.importVexCtrl.prototype.executeImport = function () {
    this.$log_.info("nsVmap.importVexCtrl.executeImport");

    var this_ = this;

    this_.$scope_['bImportDone'] = false;
    this_.$scope_['oImportSteps']['vmap_objects'] = null;
    this_.$scope_['oImportSteps']['vmap_objects_maps'] = null;
    this_.$scope_['oImportSteps']['vmap_objects_services'] = null;
    this_.$scope_['oImportSteps']['vmap_objects_calques'] = null;
    this_.$scope_['oImportSteps']['vmap_objects_calque_themes'] = null;
    this_.$scope_['oImportSteps']['vmap_objects_vm4ms_layers'] = null;
    this_.$scope_['oImportSteps']['vmap_objects_business_objects'] = null;
    this_.$scope_['oImportSteps']['vmap_objects_events'] = null;
    this_.$scope_['oImportSteps']['vmap_objects_reports'] = null;
    this_.$scope_['oImportSteps']['web_services'] = null;
    this_.$scope_['oImportSteps']['sql'] = null;
    this_.$scope_['oImportSteps']['sql_model'] = null;
    this_.$scope_['oImportSteps']['sql_data'] = null;

    // Importe les objets vMap
    this.importVMapObjects_().then(function (oImportedVmapObjects) {

        if (goog.isDefAndNotNull(oImportedVmapObjects)) {
            this_.oImportedVmapObjects_ = oImportedVmapObjects;
        }

        this_.$scope_['oImportSteps']['vmap_objects'] = true;
        this_.$scope_['oImportSteps']['vmap_objects_maps'] = true;
        this_.$scope_['oImportSteps']['vmap_objects_services'] = true;
        this_.$scope_['oImportSteps']['vmap_objects_calques'] = true;
        this_.$scope_['oImportSteps']['vmap_objects_calque_themes'] = true;
        this_.$scope_['oImportSteps']['vmap_objects_vm4ms_layers'] = true;
        this_.$scope_['oImportSteps']['vmap_objects_business_objects'] = true;
        this_.$scope_['oImportSteps']['vmap_objects_events'] = true;
        this_.$scope_['oImportSteps']['vmap_objects_reports'] = true;

        this_.importWebServices_().then(function (oImportedWebServices) {

            if (goog.isDefAndNotNull(oImportedWebServices)) {
                this_.oImportedWebServices_ = oImportedWebServices;
            }

            this_.$scope_['oImportSteps']['web_services'] = true;

            this_.importSQL_().then(function (oImportedSql) {

                if (goog.isDefAndNotNull(oImportedSql)) {
                    this_.oImportedSql_ = oImportedSql;
                }

                if (oImportedSql === true) {
                    this_.$scope_['oImportSteps']['sql'] = true;
                    this_.$scope_['oImportSteps']['sql_model'] = true;
                    this_.$scope_['oImportSteps']['sql_data'] = true;
                }

                this_.$scope_['bImportDone'] = true;
            }, function () {
                this_.$scope_['oImportSteps']['sql'] = false;
                this_.$scope_['oImportSteps']['sql_model'] = false;
                this_.$scope_['oImportSteps']['sql_data'] = false;
            });
        }, function () {
            this_.$scope_['oImportSteps']['web_services'] = false;
        });
    }, function () {
        this_.$scope_['oImportSteps']['vmap_objects'] = false;
        this_.$scope_['oImportSteps']['vmap_objects_maps'] = false;
        this_.$scope_['oImportSteps']['vmap_objects_services'] = false;
        this_.$scope_['oImportSteps']['vmap_objects_calques'] = false;
        this_.$scope_['oImportSteps']['vmap_objects_calque_themes'] = false;
        this_.$scope_['oImportSteps']['vmap_objects_vm4ms_layers'] = false;
        this_.$scope_['oImportSteps']['vmap_objects_business_objects'] = false;
        this_.$scope_['oImportSteps']['vmap_objects_events'] = false;
        this_.$scope_['oImportSteps']['vmap_objects_reports'] = false;
    });
};

/**
 * Import the vMap objects
 * @returns {defer.promise}
 */
nsVmap.importVexCtrl.prototype.importVMapObjects_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.importVMapObjects_");

    var this_ = this;
    var deferred = this.$q_.defer();

    // cas où scope.oVMapObjects soit null
    if (!goog.isDefAndNotNull(this.$scope_['oVMapObjects']) || this_.$scope_['selectedSteps']['vmap_objects'] === false) {
        setTimeout(function () {
            deferred.resolve();
        });
        return deferred.promise;
    }

    ajaxRequest({
        'method': 'POST',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vmap/vex/import/vmap_objects',
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'data': {
            'vmap_objects': JSON.stringify(this.$scope_['oVMapObjects']),
            'database': this.$scope_['usedDatabase'],
            'schema': this.$scope_['usedSchema'],
            'srid': this.$scope_['usedSRID']
        },
        'scope': this.$scope_,
        'success': function (response) {
            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_IMPORT_VMAP_OBJECTS'], "error");
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
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_IMPORT_VMAP_OBJECTS'], "error");
                deferred.reject();
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['vmap_objects'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_IMPORT_VMAP_OBJECTS'], "error");
                deferred.reject();
                return null;
            }
            deferred.resolve(response['data']['vmap_objects']);
        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_IMPORT_VMAP_OBJECTS'], "error");
            deferred.reject();
        }
    });

    return deferred.promise;
};

/**
 * Import the web services
 * @returns {defer.promise}
 */
nsVmap.importVexCtrl.prototype.importWebServices_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.importWebServices_");

    var this_ = this;
    var deferred = this.$q_.defer();

    // cas où scope.aWebServices soit null
    if (!goog.isDefAndNotNull(this.$scope_['aWebServices']) || this_.$scope_['selectedSteps']['web_services'] === false) {
        setTimeout(function () {
            deferred.resolve();
        });
        return deferred.promise;
    }

    ajaxRequest({
        'method': 'POST',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vmap/vex/import/web_services',
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'data': {
            'web_services': JSON.stringify(this.$scope_['aWebServices'])
        },
        'scope': this.$scope_,
        'success': function (response) {
            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_IMPORT_WEB_SERVICES'], "error");
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
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_IMPORT_WEB_SERVICES'], "error");
                deferred.reject();
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['web_services'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_IMPORT_WEB_SERVICES'], "error");
                deferred.reject();
                return null;
            }
            deferred.resolve(response['data']['web_services']);
        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_IMPORT_WEB_SERVICES'], "error");
            deferred.reject();
        }
    });

    return deferred.promise;
};

/**
 * Import the SQL
 * @returns {defer.promise}
 */
nsVmap.importVexCtrl.prototype.importSQL_ = function () {
    this.$log_.info("nsVmap.importVexCtrl.importSQL_");

    var this_ = this;
    var deferred = this.$q_.defer();

    // cas où scope.aWebServices soit null
    if (!goog.isDefAndNotNull(this.$scope_['sSQLModel']) || this_.$scope_['selectedSteps']['import_sql'] === false) {
        setTimeout(function () {
            deferred.resolve();
        });
        return deferred.promise;
    }

    ajaxRequest({
        'method': 'POST',
        'url': this['oProperties']['web_server_name'] + '/' + this['oProperties']['services_alias'] + '/vmap/vex/import/sql',
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'data': {
            'sql_model': this.$scope_['sSQLModel'],
            'sql_data': this.$scope_['sSQLData'],
            'database': this.$scope_['usedDatabase'],
            'schema': this.$scope_['usedSchema'],
            'srid': this.$scope_['usedSRID']
        },
        'scope': this.$scope_,
        'success': function (response) {
            if (!goog.isDefAndNotNull(response['data'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_IMPORT_SQL'], "error");
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
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_IMPORT_SQL'], "error");
                deferred.reject();
                return null;
            }
            if (!goog.isDefAndNotNull(response['data']['sql'])) {
                $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_IMPORT_SQL'], "error");
                deferred.reject();
                return null;
            }
            deferred.resolve(response['data']['sql']);
        },
        'error': function (response) {
            $.notify(this_['oTranslations']['CTRL_IMPORT_VEX_ERROR_REQUEST_IMPORT_SQL'], "error");
            deferred.reject();
        }
    });

    return deferred.promise;
};


// Definition du controlleur angular
oVmap.module.controller('AppImportVexController', nsVmap.importVexCtrl);

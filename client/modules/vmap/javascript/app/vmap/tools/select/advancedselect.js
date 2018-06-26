/* global goog, nsVmap, oVmap, ol, angular, scope, bootbox, vitisApp, destructor_form */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.AdvancedSelect
 * cette classe permet l'interrogation de couches
 */
goog.provide('nsVmap.nsToolsManager.AdvancedSelect');

goog.require('oVmap');

goog.require('ol.layer.Vector');
goog.require('ol.format.GeoJSON');
goog.require('ol.style.Style');
goog.require('ol.style.Stroke');
goog.require('ol.format.WKT');
goog.require('goog.array');
goog.require('goog.object');


/**
 * @classdesc
 * Class {@link nsVmap.nsToolsManager.AdvancedSelect}: allow select
 *
 * @constructor
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect = function () {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect');
};

/**
 * App-specific directive wrapping the select tools.
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectDirective = function () {
    oVmap.log("nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectDirective");
    return {
        restrict: 'A',
        scope: {
            'map': '=appMap',
            'lang': '=appLang',
            'currentAction': '=appAction'
        },
        controller: 'AppAdvancedselectController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/' + (oVmap['properties']['is_mobile'] ? 'advancedselect_mobile.html' : 'advancedselect.html')
    };
};

/**
 * @ngInject
 * @constructor
 * @param {object} $scope
 * @param {object} $timeout
 * @param {object} $q
 * @returns {nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController}
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController = function ($scope, $timeout, $q) {
    oVmap.log("nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController");
    
    var this_ = this;
    
    /**
     * The vMap scope
     */
    $scope['vmapScope'] = oVmap['scope'];
    
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
     * Parent element
     */
    this.oSelect = oVmap.getToolsManager().getBasicTools().getSelect();
    
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
    this['selectGeomType'] = "Polygon";
    
    /**
     * Maximum popup mode objects
     * @type integer
     */
    this.limitPopup_ = oVmap['properties']["selection"]["limit_popup"];
    
    /**
     * Maximum list mode objects
     * @type integer
     */
    this['limitList_'] = oVmap['properties']["selection"]["limit_list"];
    
    /**
     * Query buffer in mm on screen (look postgis st_buffer for more information)
     * @type integer
     */
    this.buffer_ = oVmap['properties']["selection"]["buffer"];
    
    /**
     * The buffer is calculed with the scale, this parameter is the maximum scale to calculate
     */
    this.maxBuffer_ = oVmap['properties']["selection"]["max_buffer"];
    
    /**
     * @type {ol.interaction.Draw}
     * @private
     */
    this.draw_;
    
    /**
     * @type {ol.layer.Vector}
     * @private
     */
    this.oOpenLayersOverlay_ = oVmap.getMap().addVectorLayer();
    
    /**
     * @type {ol.Collection}
     * @private
     */
    this.oOpenLayersOverlayFeatures_ = this.oOpenLayersOverlay_.getSource().getFeaturesCollection();
    
    this.goTablePageWithTimeoutCounter_ = 0;
    
    /**
     * @private
     */
    this['allQueryables_'] = false;
    
    /**
     * contains the current selections
     * @type {array}
     */
    this['aSelections'] = [];
    
    /**
     * contains the selection before
     * @type {array}
     */
    this.aLastSelections = [];
    
    /**
     * Contains the information used by the table
     * @type object
     */
    this['tableSelection'] = {};
    
    /**
     * Contains the information used by the table
     * @type object
     */
    this['tableSelectionMetadata'] = {};
    
    /**
     * Queryable business objects
     */
    this['oQueryableBOs'] = oVmap.getMapManager().getQueryableBusinessObjects();
    
    /**
     * Business objects list
     */
    this['aBusinessObjectsList'] = [];
    
    /**
     * Business objects infos
     */
    this['oBusinessObjects'] = {};
    
    /**
     * Old values from search forms
     * @type object
     */
    this.tmpSearchValues_ = {};
    
    /**
     * the selected bo
     */
    this['sSelectedBo'] = null;
    
    /**
     * True/false
     */
    this['bGTFExport'] = false;
    
    /**
     * Attributes used to export via GTF
     */
    this['oGTFExportAttibutes'] = null;
    
    if (goog.isDefAndNotNull(oVmap['properties']['vmap_export'])) {
        if (goog.isString(oVmap['properties']['vmap_export']['gtf_api_url'])
                && goog.isString(oVmap['properties']['vmap_export']['gtf_public_token'])
                && goog.isString(oVmap['properties']['vmap_export']['gtf_priority_id'])
                && goog.isString(oVmap['properties']['vmap_export']['gtf_email_option_id'])
                && goog.isString(oVmap['properties']['vmap_export']['gtf_workspace_id'])
                && goog.isString(oVmap['properties']['vmap_export']['gtf_export_formats'])
                && goog.isString(oVmap['properties']['vmap_export']['gtf_export_coordsys'])) {
            this['bGTFExport'] = true;
            this['gtf_export_formats'] = JSON.parse(oVmap['properties']['vmap_export']['gtf_export_formats']);
            this['gtf_export_coordsys'] = JSON.parse(oVmap['properties']['vmap_export']['gtf_export_coordsys']);
        }
    }
    
    // rempli this.oQueryableBOs
    oVmap['scope'].$on('layersChanged', function () {
        this_.$scope_.$applyAsync(function () {
            
            // rempli this.oQueryableBOs
            this_['oQueryableBOs'] = oVmap.getMapManager().getQueryableBusinessObjects();
            
            // rempli this.aBusinessObjectsList
            goog.array.clear(this_['aBusinessObjectsList']);
            for (var bo_id in this_['oQueryableBOs']) {
                this_['aBusinessObjectsList'].push(bo_id);
            }
        });
    });
    
    // rempli this.aBusinessObjectsList
    goog.array.clear(this_['aBusinessObjectsList']);
    for (var bo_id in this_['oQueryableBOs']) {
        this_['aBusinessObjectsList'].push(bo_id);
    }
    
    // Lors du click sur 'echap', annule les requêtes en cours
    $(document).keydown(function (e) {
        if (e.keyCode === 27) {
            this_.canceler_.resolve();
        }
    });
    
    // Vide les selections quand on change de carte
    oVmap['scope'].$on('mapChanged', function () {
        this_.removeSelections();
    });
};


// Interrogation par intersection géométrique

/**
 * Set the drawTool
 * @param {string} type (Point, Line, Rectangle, Polygon, Circle)
 * @param {boolean} isActive true if the selection is already active
 * @returns {Number}
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.startSelection = function (type, isActive) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.startSelection');
    
    var tmpMessage = '';
    
    // Supprime les interractions
    oVmap.getMap().removeActionsOnMap();
    
    // Cache la tooltip
    oVmap.getMap().getMapTooltip().hide();
    
    if (isActive === true)
        return 0;
    
    if (type === 'Point') {
        
        //Ajoute la tooltip
        tmpMessage = 'Cliquez sur un point pour effectuer la sélection';
        oVmap.getMap().getMapTooltip().displayMessage(tmpMessage);
        
        // Ajoute l'interraction
        this.queryByDrawing(type);
        
    } else if (type === 'MultiPoint') {
        
        //Ajoute la tooltip
        tmpMessage = 'Dessinez un ou plusieurs points pour effectuer la sélection';
        oVmap.getMap().getMapTooltip().displayMessage(tmpMessage);
        
        // Ajoute l'interraction
        this.queryByDrawing(type);
        
    } else if (type === 'LineString') {
        //Ajoute la tooltip
        tmpMessage = 'Dessinez une ligne pour effectuer la sélection';
        oVmap.getMap().getMapTooltip().displayMessage(tmpMessage);
        
        // Ajoute l'interraction
        this.queryByDrawing(type);
        
    } else if (type === 'Polygon') {
        //Ajoute la tooltip
        tmpMessage = 'Dessinez un polygone pour effectuer la sélection';
        oVmap.getMap().getMapTooltip().displayMessage(tmpMessage);
        
        // Ajoute l'interraction
        this.queryByDrawing(type);
        
    } else if (type === 'Circle') {
        //Ajoute la tooltip
        tmpMessage = 'Dessinez un cercle pour effectuer la sélection';
        oVmap.getMap().getMapTooltip().displayMessage(tmpMessage);
        
        // Ajoute l'interraction
        this.queryByDrawing(type);
        
    } else {
        console.error('startSelection: type (' + type + ') not allowed');
        return 0;
    }
    
};

/**
 * Cancel the selection
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.cancelSelection = function () {
    // Supprime les interractions
    oVmap.getMap().removeActionsOnMap();
    
    // Cache la tooltip
    oVmap.getMap().getMapTooltip().hide();
};

/**
 * Query layer by the db_table informed in map.layer and shows the popup
 * @param {ol.geom} type geometry type
 * @returns {undefined}
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.queryByDrawing = function (type) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.queryByDrawing');
    
    var this_ = this;
    
    // Réinitialise la projection au cas où elle ait changée entre temps
    this.sProjection = this['map'].getView().getProjection().getCode();
    this.GeoJSON_ = new ol.format.GeoJSON({defaultDataProjection: this.sProjection});
    
    this.draw_ = oVmap.getMap().setDrawInteraction({
        type: type,
        features: this.oOpenLayersOverlayFeatures_
    }, 'basicTools-selectBy' + type);
    this.draw_.on('drawend',
    function (evt) {
        // Cas de multiple géométrie
        if (type.substr(0, 5) === 'Multi') {
            bootbox['dialog']({
                'message': "<h4>Valider la géométrie ?</h4>",
                'buttons': {
                    'addPart': {
                        'label': 'Ajouter une autre partie',
                        'className': 'btn-primary width-100 margin-10',
                        'callback': function () {
                            
                        }
                    },
                    'confirm': {
                        'label': 'Oui, terminer',
                        'className': 'btn-success width-100 margin-10',
                        'callback': function () {
                            var aFeatures = this_.oOpenLayersOverlayFeatures_.getArray();
                            var olFeature = oVmap.getMultiGeomFromSingleFeatures(aFeatures, type);
                            this_.queryByFeature(olFeature, type);
                        }
                    }
                }
            });
        } else {
            this_.queryByFeature(evt.feature, type);
        }
        
    }, this);
};

/**
 * Query the business object by a spatial intersection with olFeature
 * @param {ol.Feature} olFeature
 * @param {string} sType
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.queryByFeature = function (olFeature, sType) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.queryByFeature');
    
    var this_ = this;
    
    // Transforme les cercles en polygones de 32 côtés
    // car ils ne sont pas acceptés par WKT
    if (sType === 'Circle') {
        var circleGeom = olFeature.getGeometry();
        var polygonGeom = new ol.geom.Polygon.fromCircle(circleGeom);
        olFeature = new ol.Feature({
            geometry: polygonGeom
        });
    }
    
    // Transforme la feature en EWKT
    var EWKTGeometry = oVmap.getEWKTFromGeom(olFeature.getGeometry());
    
    this.queryByEWKTGeom(EWKTGeometry, true, true);
    
    // vide l'overlay
    setTimeout(function () {
        this_.oOpenLayersOverlay_.getSource().clear();
    });
};

/**
 * Call sendQueryByEWKTGeom_ for the selected layers
 * @param {string} EWKTGeometry
 * @param {boolean} useTableFormat true to result in table format, false for popup
 * @param {boolean} bOnlyChecked true if the query layers have to be the checked layers, false to query all the queryables
 * @returns {undefined}
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.queryByEWKTGeom = function (EWKTGeometry, useTableFormat, bOnlyChecked) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.queryByEWKTGeom');
    
    var this_ = this;
    
    this.EWKTGeometry = EWKTGeometry;
    
    // Récupère la liste des bo interrogeables
    var oQueryableBOs = oVmap.getMapManager().getQueryableBusinessObjects(true);
    
    // Met le compteur de requêtes en cours au nombre de requêtes à effectuer
    this.requestCounter_ = Object.keys(oQueryableBOs).length;
    
    if (this.requestCounter_ > 0)
        $('body').css({"cursor": "wait"});
    
    // Garde en mémoire les anciennes selections pour supprimer leurs popup plus tard
    var newSelection = goog.array.clone(this['aSelections']);
    goog.array.extend(this.aLastSelections, newSelection);
    
    // Supprime toutes les anciennes selections
    this.removeSelections();
    
    // Annule les anciennes requêtes
    this.canceler_.resolve();
    
    // Réinitialise canceler_
    this.canceler_ = this.$q_.defer();
    
    // Interroge chacune des couches de le liste
    var oFilter, sGeomColumn
    for (var bo_id in oQueryableBOs) {
        
        sGeomColumn = oQueryableBOs[bo_id]['bo_geom_column'];
        oFilter = {};
        oFilter[sGeomColumn] = EWKTGeometry;
        
        this.updateSelectionTable(bo_id, oFilter, sGeomColumn, {
            warning: false
        }).then(function (data) {
            
            // Décrémente le compteur de requêtes
            this_.requestCounter_--;
            
            // Si le compteur de requêtes vaut zéro, alors on remet le curceur normal
            if (this_.requestCounter_ === 0) {
                $('body').css({"cursor": ""});
            }
            
            // Vide this.tmpSearchValues_
            this_.tmpSearchValues_ = {};
            
            if (this_.requestCounter_ === 0) {
                this_.displaySelectionTable(this_['aSelections']);
            }
        });
    }
};


// Ajout de la sélection

/**
 * Add the query result to this['aSelections'] removing the duplicate selections
 * @param {object} opt_options
 * @param {array<object>} opt_options.data
 * @param {string} opt_options.dataType summary|list|form
 * @param {function} opt_options.callback callback to run at the end of the function
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.addQueryResult = function (opt_options) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.addQueryResult');
    
    var aData = goog.isDef(opt_options.data) ? opt_options.data : [];
    var dataType = goog.isDef(opt_options.dataType) ? opt_options.dataType : null;
    var callback = goog.isDef(opt_options.callback) ? opt_options.callback : function () {
        return 0;
    };
    
    // Formatage du résultat
    var aResult = [];
    for (var i = 0; i < aData.length; i++) {
        aResult.push(aData[i]);
        if (goog.isDef(aData[i]['bo_intersect_geom'])) {
            aResult[i]['olFeature'] = this.oSelect.extractFeatureFromData(aData[i]);
        }
    }
    
    // Ajoute les résultats
    goog.array.insertArrayAt(this['aSelections'], aResult, -1);
    
    // supprime les doublons
    this['aSelections'] = this.oSelect.removeDuplicateSelections(this['aSelections']);
    
    callback.call();
};


// Fonctions mode popup

/**
 * 
 * @param {object} selection
 * @private
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.displaySelectionPopup = function (selection) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.displaySelectionPopup');
    
    var aSelection = [selection];
    var basicScope = angular.element($('#vmap-basicselect-tool')).scope();
    this.oSelect.getSummaryInfos(aSelection, function (aSelection) {
        
        if (!goog.isDefAndNotNull(aSelection[0]['olFeature'])) {
            $.notify("L'objet n'a pas de géométrie");
            return 0;
        }
        if (!goog.isDefAndNotNull(aSelection[0]['olFeature'].getGeometry())) {
            $.notify("L'objet n'a pas de géométrie");
            return 0;
        }
        
        // Sauvegarde la géométrie (pour faire re-apparaitre la popup lors de l'édition du formulaire)
        if (goog.isDefAndNotNull(aSelection[0])) {
            if (goog.isDefAndNotNull(aSelection[0]['olFeature'])) {
                var olGeom = aSelection[0]['olFeature'].getGeometry();
                var EWKTGeometry = oVmap.getEWKTFromGeom(olGeom);
                basicScope['ctrl'].EWKTGeometry = EWKTGeometry;
                basicScope['ctrl'].olPoint = olGeom;
            }
        }
        
        oVmap.getToolsManager().getBasicTools().hideMobileMenu();
        
        basicScope['ctrl'].centerMapOnPopup(aSelection[0]);
        basicScope['ctrl'].replaceSelectionPopup(aSelection);
        
        $('#select-list-modal').modal('hide');
    });
};


// Fonctions mode Table

/**
 * Get the Search Form reader scope
 * @param {strinf} bo_type bo id
 * @returns {angular.scope}
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.getSearchFormReaderScope = function (bo_type) {
    return angular.element($('#select_search_form_reader_' + bo_type).children()).scope();
};

/**
 * Get the Search Form reader scope
 * @param {strinf} bo_type bo id
 * @returns {angular.scope}
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.getSearchFormReaderService = function (bo_type) {
    var searchFormReaderService;
    var oInjector = angular.element($('#select_search_form_reader_' + bo_type).children()).injector();
    if (goog.isDefAndNotNull(oInjector)) {
        searchFormReaderService = oInjector.get(["formReaderService"]);
    }
    return searchFormReaderService;
};

/**
 * Display the selection on tables
 * @param {array} aSelection
 * @param {string|undefined} boId Tab to show
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.displaySelectionTable = function (aSelection, boId) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.displaySelectionTable');
    
    var this_ = this;
    
    this_.setBoInfos(this['aBusinessObjectsList'], function () {
        
        oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.AdvancedSelectController.setBoInfos finished');
        
        $('.select_modal_table').bootstrapTable('destroy');
        
        setTimeout(function () {
            
            // Initialise les formulaires de filtrage
            for (var i = 0; i < this_['aBusinessObjectsList'].length; i++) {
                this_.setSearchForm(this_['aBusinessObjectsList'][i]);
            }
            
            // Initialise les tables
            for (var i = 0; i < this_['aBusinessObjectsList'].length; i++) {
                $('#select_table_' + this_['aBusinessObjectsList'][i]).bootstrapTable({
                    'data': [],
                    'onSort': angular.bind(this_, function (bo_id, name, order) {
                        var oFilter = this_['tableSelectionMetadata'][bo_id]['filter'];
                        var sGeomColumn = this_['tableSelectionMetadata'][bo_id]['geom_column'];
                        var iPage = this_['tableSelectionMetadata'][bo_id]['current_page'];
                        if (goog.isDefAndNotNull(oFilter)) {
                            if (goog.isDefAndNotNull(sGeomColumn)) {
                                this.updateSelectionTable(bo_id, oFilter, sGeomColumn, {
                                    offsetPage: goog.isDefAndNotNull(iPage) ? iPage : 1,
                                    orderBy: name,
                                    sortOrder: order
                                });
                            } else {
                                console.error('sGeomColumn not defined');
                            }
                        } else {
                            console.error('oFilter not defined');
                        }
                    }, this_['aBusinessObjectsList'][i])
                });
                if (oVmap['properties']['is_mobile']) {
                    var toolHeight = $('#vmap-advancedselect-tool').parent().height();
                    $('#select_table_' + this_['aBusinessObjectsList'][i]).parent().height(toolHeight - 175);
                    
                } else {
                    $('#select_table_' + this_['aBusinessObjectsList'][i]).parent().height($('body').height() / 2);
                }
            }
        }, 100);
        
        // Télécharge (si besoin) des données correcpondantes à la liste puis rempli les tables
        this_.oSelect.getListInfos(aSelection, function () {
            
            // Vide l'objet
            goog.object.clear(this_['tableSelection']);
            
            // Met les selections dans un format convenable
            this_['tableSelection'] = this_.formatTableSelection(aSelection);
            
            oVmap.log("tableSelection: ", this_['tableSelection']);
            
            setTimeout(function () {
                for (var bo_type in this_['tableSelection']) {
                    $('#select_table_' + bo_type).bootstrapTable('load', this_['tableSelection'][bo_type]);
                }
            }, 100);
        });
        
        // Affiche l'outil (car la modale se trouve dedans)
        oVmap.getToolsManager().getBasicTools().showTool($('#basic-tools-dropdown-select-btn'));
        
        setTimeout(function () {
            // Affiche la modale
            $('#select-list-modal').modal('show');
            // Affiche l'onglet correspondant (si besoin)
            this_.$scope_.$applyAsync(function () {
                if (goog.isDefAndNotNull(boId)) {
                    this_['sSelectedBo'] = boId;
                } else {
                    this_['sSelectedBo'] = oVmap.getToolsManager().getBasicTools().getSelect().getSelectedBo();
                }
            })
        }, 100);
    });
    
};

/**
 * Complete this.oBusinessObjects
 * @param {array} aBusinessObjectsList
 * @param {function} callback
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.setBoInfos = function (aBusinessObjectsList, callback) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.setBoInfos');
    
    var this_ = this;
    var bo_id;
    var counter = 0;
    
    aBusinessObjectsList = goog.isDef(aBusinessObjectsList) ? aBusinessObjectsList : [];
    callback = goog.isDef(callback) ? callback : angular.noop;
    
    // Supprime les bo dans oBusinessObjects non contenus dansaBusinessObjectsList
    for (var oBusinessOject in this['oBusinessObjects']) {
        if (aBusinessObjectsList.indexOf(oBusinessOject) === -1) {
            delete this['oBusinessObjects'][oBusinessOject];
        }
    }
    
    for (var i = 0; i < aBusinessObjectsList.length; i++) {
        
        bo_id = aBusinessObjectsList[i];
        
        if (goog.isDefAndNotNull(this_['oBusinessObjects'][bo_id])) {
            counter++;
            if (counter === aBusinessObjectsList.length) {
                callback.call();
            }
            continue;
        }
        
        ajaxRequest({
            'method': 'GET',
            'url': oVmap['properties']['api_url'] + '/vmap/businessobjects/' + bo_id,
            'headers': {
                'Accept': 'application/x-vm-json'
            },
            'scope': this.$scope_,
            'success': function (response) {
                
                counter++;
                
                if (!goog.isDef(response['data'])) {
                    bootbox.alert("response['data'] undefined");
                    return 0;
                }
                if (goog.isDef(response['data']['errorMessage'])) {
                    bootbox.alert(response['data']['errorType'] + ': ' + response['data']['errorMessage']);
                    return 0;
                }
                if (!goog.isDefAndNotNull(response['data']['data'])) {
                    console.error('Aucune valeur retournée');
                    return 0;
                }
                
                var bo_id = response['data']['data'][0]['business_object_id'];
                
                this_['oBusinessObjects'][bo_id] = response['data']['data'][0];
                
                if (counter === aBusinessObjectsList.length) {
                    callback.call();
                }
                
            },
            'error': function (response) {
                counter++;
                if (counter === aBusinessObjectsList.length) {
                    callback.call();
                }
                console.error(response);
            }
        });
    }
};

/**
 * Return the selection in a appropriate format
 * @param {array} aSelection
 * @returns {object}
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.formatTableSelection = function (aSelection) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.AdvancedSelectController.formatTableSelection');
    
    if (!goog.isDefAndNotNull(aSelection)) {
        return {};
    }
    
    var oTableSelection = {};
    var tmp = {};
    
    for (var i = 0; i < aSelection.length; i++) {
        
        // Création du type (si besoin)
        if (!goog.object.containsKey(oTableSelection, aSelection[i]['bo_type'])) {
            oTableSelection[aSelection[i]['bo_type']] = new Array();
        }
        
        if (goog.isDefAndNotNull(aSelection[i]['bo_list']))
            tmp = goog.object.clone(aSelection[i]['bo_list']);
        
        // Données cachées
        tmp['bo_selection_'] = aSelection[i];
        
        // Données à afficher
        if (goog.isDefAndNotNull(tmp))
            oTableSelection[aSelection[i]['bo_type']].push(tmp);
    }
    
    // Prévient des injections JavaScript
    for (var bo_id in oTableSelection) {
        for (var i = 0; i < oTableSelection[bo_id].length; i++) {
            for (var key in oTableSelection[bo_id][i]) {
                if (goog.isString(oTableSelection[bo_id][i][key])) {
                    //                    oTableSelection[bo_id][i][key] = oTableSelection[bo_id][i][key].replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    
                    // Recherche les liens
                    if (oVmap.isLink(oTableSelection[bo_id][i][key], 'bo_link')) {
                        oTableSelection[bo_id][i][key] = oVmap.parseLink(oTableSelection[bo_id][i][key], 'bo_link');
                    }
                    
                    // Prévention d'injections XSS
                    oTableSelection[bo_id][i][key] = oVmap['$sanitize'](oTableSelection[bo_id][i][key]);
                }
            }
        }
    }
    
    return oTableSelection;
};

/**
 * Set the selection table using this.oBusinessObjects and the bo_type passed in parameter
 * @param {string} bo_type
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.setSearchForm = function (bo_type) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.AdvancedSelectController.setSearchForm');
    
    var this_ = this;
    
    // Formulaire de recherche par défaut (vide)
    if (!goog.isDefAndNotNull(this['oBusinessObjects'][bo_type]['json_form'])) {
        this['oBusinessObjects'][bo_type]['json_form'] = {};
    }
    if (!goog.isDefAndNotNull(this['oBusinessObjects'][bo_type]['json_form'][0])) {
        this['oBusinessObjects'][bo_type]['json_form'][0] = {};
    }
    if (!goog.isDefAndNotNull(this['oBusinessObjects'][bo_type]['json_form'][0]['search'])) {
        this['oBusinessObjects'][bo_type]['json_form'][0]['search'] = {
            'name': 'search-form',
            'title': bo_type,
            'input_size': 'xxs',
            'nb_cols': 12,
            'javascript': false,
            'rows': []
        };
    }
    if (!goog.isDefAndNotNull(this['oBusinessObjects'][bo_type]['json_form'][0]['search']['name'])) {
        this['oBusinessObjects'][bo_type]['json_form'][0]['search']['name'] = 'search-form';
    }
    if (!goog.isDefAndNotNull(this['oBusinessObjects'][bo_type]['json_form'][0]['search']['title'])) {
        this['oBusinessObjects'][bo_type]['json_form'][0]['search']['title'] = bo_type;
    }
    if (!goog.isDefAndNotNull(this['oBusinessObjects'][bo_type]['json_form'][0]['search']['input_size'])) {
        this['oBusinessObjects'][bo_type]['json_form'][0]['search']['title'] = 'xxs';
    }
    if (!goog.isDefAndNotNull(this['oBusinessObjects'][bo_type]['json_form'][0]['search']['nb_cols'])) {
        this['oBusinessObjects'][bo_type]['json_form'][0]['search']['title'] = 12;
    }
    if (!goog.isDefAndNotNull(this['oBusinessObjects'][bo_type]['json_form'][0]['search']['javascript'])) {
        this['oBusinessObjects'][bo_type]['json_form'][0]['search']['javascript'] = false;
    }
    if (!goog.isDefAndNotNull(this['oBusinessObjects'][bo_type]['json_form'][0]['search']['rows'])) {
        this['oBusinessObjects'][bo_type]['json_form'][0]['search']['rows'] = [];
    }
    
    // Rempli chaque formulaire de recherche correspondant
    var oFormDefinition = this['oBusinessObjects'][bo_type]['json_form'][0];
    var oFormValues = {
        'search': {}
    };
    
    // Complémente les infos pour avoir la géométrie intersectée
    var sGeomColumn = this['oBusinessObjects'][bo_type]['geom_column'];
    sGeomColumn = goog.isDefAndNotNull(sGeomColumn) ? sGeomColumn : 'geom';
    
    // Si les valeurs d'un formulaire de recherche ont étés mémorisées, elles sont incorporées
    if (goog.isDefAndNotNull(this.tmpSearchValues_[bo_type])) {
        oFormValues['search'] = this.tmpSearchValues_[bo_type];
    } else {
        oFormValues['search'][sGeomColumn] = this.EWKTGeometry;
        oFormValues['search']['advanceddselect_use_geom'] = true;
    }
    
    // Champ contenant la géométrie
    if (!oClientProperties['is_mobile']) {
        var geomField = {
            "fields": [{
                    "type": "checkbox",
                    "name": "advanceddselect_use_geom",
                    "id": "advanceddselect_use_geom_" + bo_type,
                    "class": "advanced-select-geom-checkbox",
                    "nb_cols": 8
                }, {
                    "visibleAllTabs": true,
                    "type": "text",
                    "name": sGeomColumn,
                    "label": "Activer / Désactiver la requête spatiale",
                    "class_label": "advanced-select-geom-field-label",
                    "disabled": false,
                    "required": false,
                    "nb_cols": 4
                }
            ]
        };
        
        if (!angular.equals(oFormDefinition['search']['rows'][oFormDefinition['search']['rows'].length - 2], geomField))
            oFormDefinition['search']['rows'].push(geomField);
        
        // Ajoute les champs dans les onglets
        if (goog.isDefAndNotNull(oFormDefinition['search']['tabs'])) {
            if (goog.isDefAndNotNull(oFormDefinition['search']['tabs']['list'])) {
                for (var i = 0; i < oFormDefinition['search']['tabs']['list'].length; i++) {
                    if (oFormDefinition['search']['tabs']['list'][i]['elements'].indexOf('advanceddselect_use_geom') === -1) {
                        oFormDefinition['search']['tabs']['list'][i]['elements'].push('advanceddselect_use_geom');
                    }
                    if (oFormDefinition['search']['tabs']['list'][i]['elements'].indexOf(sGeomColumn) === -1) {
                        oFormDefinition['search']['tabs']['list'][i]['elements'].push(sGeomColumn);
                    }
                }
            }
        }
    }
    // Bouton "Rechercher"
    var buttonSearch = {
        "fields": [{
                "type": "button",
                "class": "btn-ungroup btn-group-xs",
                "nb_cols": 12,
                "buttons": [{
                        "visibleAllTabs": true,
                        "id": "select_search_form_reader_" + bo_type + "_submit_buton",
                        "type": "submit",
                        "label": "Rechercher",
                        "name": "form_submit",
                        "class": "btn-primary right"
                    }, {
                        "visibleAllTabs": true,
                        "id": "select_search_form_reader_" + bo_type + "_empty_buton",
                        "type": "button",
                        "label": "Réinitialiser",
                        "name": "form_reinit",
                        "class": "btn-primary right margin-sides-10",
                        "event": function () {
                            this_.emptySearchForm(bo_type);
                            this_.emptySelectionTable(bo_type);
                        }
                    }
                ]
            }
        ]
    };
    if (!angular.equals(oFormDefinition['search']['rows'][oFormDefinition['search']['rows'].length - 1], buttonSearch))
        oFormDefinition['search']['rows'].push(buttonSearch);
    
    if (goog.isDefAndNotNull(oFormDefinition['search']['tabs'])) {
        if (goog.isDefAndNotNull(oFormDefinition['search']['tabs']['list'])) {
            for (var i = 0; i < oFormDefinition['search']['tabs']['list'].length; i++) {
                if (oFormDefinition['search']['tabs']['list'][i]['elements'].indexOf('form_submit') === -1) {
                    oFormDefinition['search']['tabs']['list'][i]['elements'].push('form_submit');
                }
                if (oFormDefinition['search']['tabs']['list'][i]['elements'].indexOf('form_reinit') === -1) {
                    oFormDefinition['search']['tabs']['list'][i]['elements'].push('form_reinit');
                }
            }
        }
    }
    
    // Evènement submit
    oFormDefinition['search']['event'] = function (oFormValuesResulted) {
        var boValues = this_.oSelect.getFormData(oFormValuesResulted, oFormDefinition, 'search');
        
        // Active/désactive le champ geom
        if (goog.isDefAndNotNull(boValues['advanceddselect_use_geom'])) {
            if (boValues['advanceddselect_use_geom'] === false) {
                if (goog.isDefAndNotNull(boValues[sGeomColumn])) {
                    delete boValues[sGeomColumn];
                }
            }
            delete boValues['advanceddselect_use_geom'];
        }
        
        this_.updateSelectionTable(angular.copy(bo_type), boValues, angular.copy(sGeomColumn));
    };
    
    // Init le formulaire de search
    setTimeout(function () {
        var searchFormReaderScope = this_.getSearchFormReaderScope(bo_type);
        var searchFormReaderService = this_.getSearchFormReaderService(bo_type);
        if (goog.isDefAndNotNull(searchFormReaderScope)) {
            searchFormReaderScope.$apply(function () {
                searchFormReaderScope['ctrl']['setDefinitionName']('search');
                searchFormReaderScope['ctrl']['setFormValues'](angular.copy(oFormValues));
                searchFormReaderScope['ctrl']['setFormDefinition'](angular.copy(oFormDefinition));
                searchFormReaderScope['ctrl']['loadForm']();
            });
        }
        
        // Active/désactive le champ geom en fonction de la checkbox advanceddselect_use_geom
        if (!oClientProperties['is_mobile']) {
            searchFormReaderScope.$watch('oFormValues.search.advanceddselect_use_geom', function (newVal, oldVal, scope) {
                if (newVal == oldVal) {
                    return null;
                }
                var oGeomColumnDef = searchFormReaderService["getFormElementDefinition"](sGeomColumn, 'search', searchFormReaderScope['oFormDefinition']);
                searchFormReaderScope.$applyAsync(function () {
                    oGeomColumnDef['disabled'] = !newVal;
                });
            });
        }
    }, 500);
};

/**
 * 
 * @param {string} bo_id
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.sumbitSearchForm = function (bo_id) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.sumbitSearchForm');
    oVmap.simuleClick("select_search_form_reader_" + bo_id + "_submit_buton");
};

/**
 * Put the search form to the initial state
 * @param {string} bo_id
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.emptySearchForm = function (bo_id) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.emptySearchForm');
    
    var oFormValues = {
        'search': {}
    };
    var searchFormReaderScope = this.getSearchFormReaderScope(bo_id);
    if (goog.isDefAndNotNull(searchFormReaderScope)) {
        searchFormReaderScope.$applyAsync(function () {
            searchFormReaderScope['ctrl']['setFormValues'](angular.copy(oFormValues));
            searchFormReaderScope['ctrl']['loadForm']();
        });
    }
};

/**
 * Put the selection table to the initial state
 * @param {string} bo_id
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.emptySelectionTable = function (bo_id) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.emptySelectionTable');
    
    this['tableSelection'][bo_id] = [];
    
        // Charge les nouvelles données sur les tables
        $('#select_table_' + bo_id).bootstrapTable('load', this['tableSelection'][bo_id]);
        
        // Vide la sélection
        this.removeSelections(bo_id);
    
    // Ajoute le résultat de la requête dans la sélection
    this.addQueryResult({
        data: [],
        dataType: 'list'
    });
    
    this['tableSelectionMetadata'][bo_id] = {
        'total_row_number': 0,
        'total_pages': 1,
        'current_page': 1
    };
    
};

/**
 * Update the rows on the selection lists to filter by the search form
 * @param {string} bo_id
 * @param {string} oFilter
 * @param {string} sGeomColumn
 * @param {number} opt_options.offsetPage
 * @param {number} opt_options.orderBy
 * @param {number} opt_options.sortOrder
 * @param {number} opt_options.limit
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.updateSelectionTable = function (bo_id, oFilter, sGeomColumn, opt_options) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.AdvancedSelectController.updateSelectionTable');
    
    if (!goog.isDefAndNotNull(bo_id)) {
        console.error('bo_id not defined or null');
        return 0;
    }
    
    opt_options = goog.isDefAndNotNull(opt_options) ? opt_options : {};
    
    var this_ = this;
    var $scope = this.$scope_;
    var $q = this.$q_;
    var deferred = $q.defer();
    var promise = deferred.promise;
    
    var offsetPage = goog.isDefAndNotNull(opt_options.offsetPage) ? opt_options.offsetPage : 1;
    var orderBy = goog.isDefAndNotNull(opt_options.orderBy) ? opt_options.orderBy : this['oQueryableBOs'][bo_id]['bo_id_field'];
    var sortOrder = goog.isDefAndNotNull(opt_options.sortOrder) ? opt_options.sortOrder : 'asc';
    var limit = goog.isDefAndNotNull(opt_options.limit) ? opt_options.limit : this['limitList_'];
    
    this['tableSelectionMetadata'][bo_id] = {
        'total_row_number': goog.isDefAndNotNull(this['tableSelectionMetadata'][bo_id]) ? this['tableSelectionMetadata'][bo_id]['total_row_number'] : null,
        'total_pages': goog.isDefAndNotNull(this['tableSelectionMetadata'][bo_id]) ? this['tableSelectionMetadata'][bo_id]['total_pages'] : null,
        'current_page': goog.isDefAndNotNull(this['tableSelectionMetadata'][bo_id]) ? this['tableSelectionMetadata'][bo_id]['current_page'] : null,
        'order_by': goog.isDefAndNotNull(this['tableSelectionMetadata'][bo_id]) ? this['tableSelectionMetadata'][bo_id]['order_by'] : null,
        'sort_order': goog.isDefAndNotNull(this['tableSelectionMetadata'][bo_id]) ? this['tableSelectionMetadata'][bo_id]['sort_order'] : null,
        'filter': angular.copy(oFilter),
        'geom_column': angular.copy(sGeomColumn)
    };
    
    // Récupère les données
    this.queryBusinessObject_(bo_id, oFilter, sGeomColumn, opt_options).then(function (response) {
        
        if (!goog.isDef(response['data'])) {
            bootbox.alert("response['data'] undefined");
            $scope['selectedLayerId'] = "";
            return 0;
        }
        if (goog.isDef(response['data']['errorMessage'])) {
            bootbox.alert(response['data']['errorType'] + ': ' + response['data']['errorMessage']);
            $scope['selectedLayerId'] = "";
            return 0;
        }
        if (!goog.isDefAndNotNull(response['data']['data'])) {
            if (opt_options.warning !== false) {
                $.notify("Aucune valeur retournée", "warn");
            }
            response['data']['data'] = [];
        }
        if (goog.isNumber(parseFloat(response['data']['total_row_number']))) {
            this_['tableSelectionMetadata'][bo_id] = {
                'total_row_number': response['data']['total_row_number'],
                'total_pages': Math.ceil(parseFloat(response['data']['total_row_number']) / parseFloat(this_['limitList_'])),
                'current_page': offsetPage,
                'order_by': orderBy,
                'sort_order': sortOrder,
                'filter': this_['tableSelectionMetadata'][bo_id]['filter'],
                'geom_column': this_['tableSelectionMetadata'][bo_id]['geom_column']
            };
        }
        this_['tableSelection'][bo_id] = this_.formatTableSelection(response['data']['data'])[bo_id];
        
        if (!goog.isDefAndNotNull(this_['tableSelection'][bo_id])) {
            this_['tableSelection'][bo_id] = [];
        }
        
        // Charge les nouvelles données sur les tables
        for (var bo_id2 in this_['tableSelection']) {
            $('#select_table_' + bo_id2).bootstrapTable('load', this_['tableSelection'][bo_id2]);
        }
        
        // Vide la sélection
        this_.removeSelections(bo_id);
        
        // Ajoute le résultat de la requête dans la sélection
        this_.addQueryResult({
            data: response['data']['data'],
            dataType: 'list'
        });
        
        if (oVmap['properties']['is_mobile']) {
            $('#vmap_menu_requeteur_menu_filtre_' + bo_id).removeClass('in');
            $('#vmap_menu_requeteur_menu_table_' + bo_id).addClass('in');
        }
        deferred.resolve(response);
    });
    return promise;
};

/**
 * Get the infos from the business object with ajax request
 * @param {string} bo_id
 * @param {string} oFilter
 * @param {string} sGeomColumn
 * @param {number} opt_options.offsetPage
 * @param {number} opt_options.orderBy
 * @param {number} opt_options.sortOrder
 * @param {number} opt_options.limit
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.queryBusinessObject_ = function (bo_id, oFilter, sGeomColumn, opt_options) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.AdvancedSelectController.queryBusinessObject_');
    
    if (!goog.isDefAndNotNull(bo_id)) {
        console.error('bo_id not defined or null');
        return 0;
    }
    
    opt_options = goog.isDefAndNotNull(opt_options) ? opt_options : {};
    
    var $q = this.$q_;
    var deferred = $q.defer();
    var promise = deferred.promise;
    var offsetPage = goog.isDefAndNotNull(opt_options.offsetPage) ? opt_options.offsetPage : 1;
    var orderBy = goog.isDefAndNotNull(opt_options.orderBy) ? opt_options.orderBy : this['oQueryableBOs'][bo_id]['bo_id_field'];
    var sortOrder = goog.isDefAndNotNull(opt_options.sortOrder) ? opt_options.sortOrder : 'asc';
    var limit = goog.isDefAndNotNull(opt_options.limit) ? opt_options.limit : this['limitList_'];
    
    oFilter = goog.isDefAndNotNull(oFilter) ? oFilter : {};
    
    // Filtre à utiliser dans la requête
    var sFilter = this.getAPIFilterFromObject_(oFilter, bo_id, sGeomColumn);
    
    // Filtre à mémoriser
    this.tmpSearchValues_[bo_id] = oFilter;
    
    // Buffer à utiliser
    var buffer = this.getAPIBuffer_(bo_id, oFilter[sGeomColumn]);
    
    var url = oVmap['properties']['api_url'] + '/vmap/querys/' + bo_id + '/list';
    var proj = this['map'].getView().getProjection().getCode().substring(5);
    
    // Ajouter get_geom, get_image, intersect_buffer
    var data = {
        'filter': sFilter,
        'intersect_geom': oFilter[sGeomColumn],
        'result_srid': proj,
        'get_geom': false,
        'get_image': false,
        'intersect_buffer': buffer,
        'limit': limit,
        'offset': offsetPage * limit - limit,
        'order_by': orderBy,
        'sort_order': sortOrder
    };
    
    ajaxRequest({
        'method': 'POST',
        'url': url,
        'headers': {
            'X-HTTP-Method-Override': 'GET',
            'Accept': 'application/x-vm-json'
        },
        'data': data,
        'scope': this.$scope_,
        'timeout': 5000,
        'success': function (response) {
            deferred.resolve(response);
        }
    });
    return promise;
};

/**
 * Get the API format filter
 * @param {string} oFilter
 * @param {string} bo_id
 * @param {string} sGeomColumn
 * @returns {String}
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.getAPIFilterFromObject_ = function (oFilter, bo_id, sGeomColumn) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.AdvancedSelectController.getAPIFilterFromObject_');
    
    var searchFormReaderScope = this.getSearchFormReaderScope(bo_id);
    var searchFormReaderService = this.getSearchFormReaderService(bo_id);
    
    var sFilter = "";
    var i = 0;
    
    // Crée le filter
    var filter = {
        'relation': 'AND',
        'operators': []
    };
    var oElemDef;
    for (var key in oFilter) {
        // Ne tient pas compte de geom
        if (key === sGeomColumn)
            continue;
        
        if (oFilter[key] === '')
            continue;
        
        if (goog.isDefAndNotNull(searchFormReaderScope)
                && goog.isDefAndNotNull(searchFormReaderService)) {
            
            oElemDef = searchFormReaderService["getFormElementDefinition"](key, 'search', searchFormReaderScope['oFormDefinition']);
            
            if (oElemDef['type'] === 'select' || oElemDef['type'] === 'editable_select') {
                filter['operators'].push({
                    'column': key,
                    'compare_operator': '=',
                    'value': oFilter[key]
                });
            } else if (oElemDef['type'] === 'list') {
                filter['operators'].push({
                    'column': key,
                    'compare_operator': 'IN',
                    'value': oFilter[key].split('|')
                });
            } else {
                filter['operators'].push({
                    'column': key,
                    'compare_operator': 'LIKE',
                    'value': '%' + oFilter[key] + '%',
                    'compare_operator_options': {
                        'case_insensitive': true
                    }
                });
            }
        } else {
            filter['operators'].push({
                'column': key,
                'compare_operator': 'LIKE',
                'value': '%' + oFilter[key] + '%',
                'compare_operator_options': {
                    'case_insensitive': true
                }
            });
        }
        i++;
    }
    sFilter = JSON.stringify(filter);
    return sFilter;
};

/**
 * Get the query buffer
 * @param {string} bo_id
 * @param {string} sEWKTGeom
 * @returns {Number}
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.getAPIBuffer_ = function (bo_id, sEWKTGeom) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.AdvancedSelectController.getAPIBuffer_');
    
    if (!goog.isDefAndNotNull(bo_id)) {
        return null;
    }
    if (!goog.isDefAndNotNull(sEWKTGeom)) {
        return null;
    }
    
    var geomType = oVmap.getGeomFromEWKT(sEWKTGeom).getType();
    var iBoBuffer = this['oQueryableBOs'][bo_id]['bo_selection_buffer'];
    
    // Calcul du buffer
    var buffer = this.oSelect.getRealScaleBuffer(iBoBuffer, geomType);
    return buffer;
};

/**
 * Add the selected elements from the table to the card
 * @param {object} htmlTable html index from the table (ex: #select_table_0)
 * @param {boolean} bReplace true to empty the card before adding the items
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.tableAddToCard = function (htmlTable, bReplace) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.tableAddToCard');
    
    var tableSelection = $(htmlTable).bootstrapTable('getSelections');
    var aSelection = [];
    var this_ = this;
    
    // Extrait la sélection
    for (var i = 0; i < tableSelection.length; i++) {
        aSelection.push(tableSelection[i]['bo_selection_']);
    }
    
    this.oSelect.addToCard(aSelection, bReplace);
};

/**
 * Remove the elements selected on the table
 * @param {object} htmlTable html index from the table (ex: #select_table_0)
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.tableDeleteSelection = function (htmlTable) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.tableDeleteSelection');
    
    var this_ = this;
    var tableSelection = $(htmlTable).bootstrapTable('getSelections');
    var aSelection = [];
    
    // Chaque élément de la table possède un attribut caché contenant sa sélection
    for (var i = 0; i < tableSelection.length; i++) {
        aSelection.push(tableSelection[i]['bo_selection_']);
    }
    
    this.oSelect.deleteMultipleObjects(aSelection, function () {
        // Supprime de la selection en cours
        for (var i = 0; i < aSelection.length; i++) {
            this_.removeFromTableSelection(aSelection[i]);
            if ($('#select-list-modal').hasClass('in')) {
            }
        }
        this_.displaySelectionTable(this_['aSelections']);
    });
};

/**
 * Used for pagination: go to the given page
 * @param {string} bo_id
 * @param {number} iPage
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.goTablePage = function (bo_id, iPage) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.goTablePage');
    
    if (!goog.isDefAndNotNull(bo_id)) {
        console.error('bo_id not defined');
        return null;
    }
    if (!goog.isDefAndNotNull(iPage)) {
        console.error('iPage not defined');
        return null;
    }
    
    // Vérification page
    if (iPage < 1 || iPage > this['tableSelectionMetadata'][bo_id]['total_pages']) {
        $.notify('Impossible d\'afficher la page ' + angular.copy(iPage), 'error');
        iPage = 1;
    }
    
    var oFilter = this['tableSelectionMetadata'][bo_id]['filter'];
    var sGeomColumn = this['tableSelectionMetadata'][bo_id]['geom_column'];
    
    if (goog.isDefAndNotNull(oFilter)) {
        if (goog.isDefAndNotNull(sGeomColumn)) {
            this.updateSelectionTable(bo_id, oFilter, sGeomColumn, {
                offsetPage: iPage,
                orderBy: this['tableSelectionMetadata'][bo_id]['order_by'],
                sortOrder: this['tableSelectionMetadata'][bo_id]['sort_order']
            });
        } else {
            console.error('sGeomColumn not defined');
        }
    } else {
        console.error('oFilter not defined');
    }
};

/**
 * Calls goTablePage with timeout
 * @param {string} bo_id
 * @param {number} iPage
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.goTablePageWithTimeout = function (bo_id, iPage) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.goTablePageWithTimeout');
    
    var this_ = this;
    this.goTablePageWithTimeoutCounter_++;
    var tmp = angular.copy(this.goTablePageWithTimeoutCounter_);
    setTimeout(function () {
        if (tmp === this_.goTablePageWithTimeoutCounter_) {
            this_.goTablePage(bo_id, iPage);
        }
    }, 1000);
};

/**
 * Export a table into a file
 * @param {string} bo_id
 * @param {object} htmlTable html index from the table (ex: #select_table_0)
 * @param {string} sFormat (json, xml, csv, txt, sql, excel)
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.exportTable = function (bo_id, htmlTable, sFormat) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.exportTable');
    
    var this_ = this;
    var totalRowNumber = this['tableSelectionMetadata'][bo_id]['total_row_number'];
    var aTableSelection = $(htmlTable).bootstrapTable('getSelections');
    var oButtons = {};
    
    aTableSelection = angular.copy(aTableSelection);
    
    // Affichage de la modale en fonction des options
    if (aTableSelection.length > 0) {
        oButtons['selected_rows'] = {
            'label': "Enregistrements sélectionnés (" + aTableSelection.length + ")",
            'className': 'btn-primary',
            'callback': function () {
                if (sFormat !== 'gtf') {
                    this_.exportSelectionElems(bo_id, aTableSelection, sFormat);
                } else {
                    this_.showGtfExportFormModal_({
                        bo_id: bo_id,
                        aTableSelection: aTableSelection,
                        sFormat: sFormat
                    });
                }
            }
        };
    }
    if (totalRowNumber > 0) {
        oButtons['all_records'] = {
            'label': "Tous les enregistrements (" + totalRowNumber + ")",
            'className': 'btn-primary',
            'callback': function () {
                if (sFormat !== 'gtf') {
                    this_.exportAllTableElems(bo_id, sFormat);
                } else {
                    this_.showGtfExportFormModal_({
                        bo_id: bo_id,
                        oFilter: this_['tableSelectionMetadata'][bo_id]['filter'],
                        sFormat: sFormat
                    });
                }
            }
        };
    }
    if (!totalRowNumber > 0 && !aTableSelection.length > 0) {
        $.notify('Aucun enregistrement à exporter', 'error');
        return null;
    }
    bootbox['dialog']({
        'message': "<h4>Données à exporter</h4>",
        'buttons': oButtons
    });
};

/**
 * Exports the given selection into the given format file
 * @param {string} bo_id
 * @param {array} aSelection
 * @param {string} sFormat
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.exportSelectionElems = function (bo_id, aSelection, sFormat) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.exportSelectionElems');
    
    if (!goog.isArray(aSelection)) {
        return null;
    }
    if (!aSelection.length > 0) {
        $.notify('Aucun enregistrement à exporter', 'error');
    }
    
    // suppresison de bo_selection_ qui ne sert à rien pour l'export
    for (var i = 0; i < aSelection.length; i++) {
        if (goog.isDefAndNotNull(aSelection[i]['bo_selection_'])) {
            delete aSelection[i]['bo_selection_'];
        }
    }
    
    if (sFormat === 'csv') {
        alasql("SELECT * INTO CSV(" + "'" + bo_id + "." + sFormat + "'" + " ,{headers:true}) FROM ? ", [aSelection]);
    }
    if (sFormat === 'json') {
        alasql("SELECT * INTO JSON(" + "'" + bo_id + "." + sFormat + "'" + " ,{headers:true}) FROM ? ", [aSelection]);
    }
    if (sFormat === 'xlsx') {
        alasql("SELECT * INTO XLSX(" + "'" + bo_id + "." + sFormat + "'" + " ,{headers:true}) FROM ? ", [aSelection]);
    }
};

/**
 * Make an Ajax request and exports the given result into the given format file
 * @param {string} bo_id
 * @param {string} sFormat
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.exportAllTableElems = function (bo_id, sFormat) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.exportAllTableElems');
    
    var this_ = this;
    var oFilter = this['tableSelectionMetadata'][bo_id]['filter'];
    var sGeomColumn = this['tableSelectionMetadata'][bo_id]['geom_column'];
    
    if (goog.isDefAndNotNull(oFilter)) {
        if (goog.isDefAndNotNull(sGeomColumn)) {
            this.queryBusinessObject_(bo_id, oFilter, sGeomColumn, {
                limit: ""
            }).then(function (response) {
                var aSelection = [];
                if (goog.isDefAndNotNull(response['data'])) {
                    if (goog.isDefAndNotNull(response['data']['data'])) {
                        aSelection = this_.formatTableSelection(response['data']['data'])[bo_id];
                        this_.exportSelectionElems(bo_id, aSelection, sFormat);
                    }
                }
            });
        } else {
            console.error('sGeomColumn not defined');
        }
    } else {
        console.error('oFilter not defined');
    }
};

/**
 * Premare and show the GTF export modal
 * @param {object} opt_options
 * @param {string} opt_options.bo_id
 * @param {array} opt_options.aTableSelection
 * @param {object} opt_options.oFilter
 * @returns {unresolved}
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.showGtfExportFormModal_ = function (opt_options) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.showGtfExportFormModal_');
    
    var oAPIFilter, sAPIFilter, sIntersectGeom;
    
    var this_ = this;
    
    // Vérifications des valeurs d'entrée
    if (!goog.isDefAndNotNull(opt_options.bo_id)) {
        console.error('opt_options.bo_id non défini');
        return null;
    }
    if (!goog.isDefAndNotNull(this['oQueryableBOs'][opt_options.bo_id])) {
        console.error('opt_options.bo_id non défini');
        return null;
    }
    
    // Recherche par filtre
    var bFilterSelection = goog.isDefAndNotNull(opt_options.oFilter);
    
    // Recherche par id
    var bIdSelection = goog.isDefAndNotNull(opt_options.aTableSelection);
    
    // Colonne gémétrie
    var sGeomColumn = this['oQueryableBOs'][opt_options.bo_id]['bo_geom_column'];
    
    // Complète oAPIFilter suivant si il s'agit d'une recherche par id où par filtre
    if (bIdSelection) {
        if (goog.isArray(opt_options.aTableSelection)) {
            if (opt_options.aTableSelection.length > 0) {
                oAPIFilter = {
                    'relation': 'AND',
                    'operators': [{
                            'column': opt_options.aTableSelection[0]['bo_selection_']['bo_id_field'],
                            'compare_operator': 'in',
                            'value': []
                        }]
                };
                for (var i = 0; i < opt_options.aTableSelection.length; i++) {
                    oAPIFilter['operators'][0]['value'].push(opt_options.aTableSelection[i]['bo_selection_']['bo_id_value']);
                }
                sAPIFilter = JSON.stringify(oAPIFilter);
            }
        }
    } else if (bFilterSelection) {
        sIntersectGeom = opt_options.oFilter[sGeomColumn];
        sAPIFilter = this.getAPIFilterFromObject_(opt_options.oFilter, opt_options.bo_id, sGeomColumn);
    } else {
        console.error('ni opt_options.oFilter ni opt_options.aTableSelection définis');
        return null;
    }
    
    // Ajoute les informations dans this.oGTFExportAttibutes
    this.$scope_.$applyAsync(function () {
        this_['oGTFExportAttibutes'] = {
            'boId': opt_options.bo_id,
            'format': 'shape',
            'coordsys': '2154',
            'mails': '',
            'filter': '',
            'intersectGeom': null,
            'intersectBuffer': null
        };
        
        if (bIdSelection) {
            this_['oGTFExportAttibutes']['filter'] = sAPIFilter;
        } else if (bFilterSelection) {
            this_['oGTFExportAttibutes']['filter'] = sAPIFilter;
            if (goog.isDefAndNotNull(sIntersectGeom)) {
                this_['oGTFExportAttibutes']['intersectGeom'] = sIntersectGeom;
                this_['oGTFExportAttibutes']['intersectBuffer'] = this_.getAPIBuffer_(opt_options.bo_id, sIntersectGeom);
            }
        }
        
        $('#vmap-gtf-export-form-modal').modal('show');
    });
    
};

/**
 * Submit the GTF export
 * @param {object} oGTFExportAttibutes
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.submitGtfExportFormModal = function (oGTFExportAttibutes) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.submitGtfExportFormModal');
    
    $('#vmap-gtf-export-form-modal').modal('hide');
    
    // Vérifications arguments
    var oError = false;
    if (!goog.isDefAndNotNull(oGTFExportAttibutes['boId'])) {
        console.error('oGTFExportAttibutes.bo_id non défini');
        oError = true;
    }
    if (!goog.isDefAndNotNull(oGTFExportAttibutes['coordsys'])) {
        console.error('oGTFExportAttibutes.coordsys non défini');
        oError = true;
    }
    if (!goog.isDefAndNotNull(oGTFExportAttibutes['format'])) {
        console.error('oGTFExportAttibutes.format non défini');
        oError = true;
    }
    if (!goog.isDefAndNotNull(oGTFExportAttibutes['mails'])) {
        console.error('oGTFExportAttibutes.mails non défini');
        oError = true;
    }
    if (!goog.isDefAndNotNull(oGTFExportAttibutes['filter'])) {
        console.error('oGTFExportAttibutes.filter non défini');
        oError = true;
    }
    if (!goog.isDefAndNotNull(oVmap['properties']['vmap_export']['gtf_api_url'])) {
        console.error('properties.vmap_export.gtf_api_url non défini');
        oError = true;
    }
    if (!goog.isDefAndNotNull(oVmap['properties']['vmap_export']['gtf_public_token'])) {
        console.error('properties.vmap_export.gtf_public_token non défini');
        oError = true;
    }
    if (!goog.isDefAndNotNull(oVmap['properties']['vmap_export']['gtf_workspace_id'])) {
        console.error('properties.vmap_export.gtf_workspace_id non défini');
        oError = true;
    }
    if (!goog.isDefAndNotNull(oVmap['properties']['vmap_export']['gtf_priority_id'])) {
        console.error('properties.vmap_export.gtf_workspace_id non défini');
        oError = true;
    }
    if (!goog.isDefAndNotNull(oVmap['properties']['vmap_export']['gtf_email_option_id'])) {
        console.error('properties.vmap_export.gtf_workspace_id non défini');
        oError = true;
    }
    if (oError) {
        $.notify("Impossible de demander l'export", "error");
        return null;
    }
    
    oGTFExportAttibutes['vmapServerApi'] = oVmap['properties']['api_url'];
    
    // Génère un nouveau token
    this.getTokenForGtfExport_().then(function (sToken) {
        
        oGTFExportAttibutes['vmapUserToken'] = sToken;
        
        var aWkParams = [];
        for (var key in oGTFExportAttibutes) {
            aWkParams.push(key + '=' + oGTFExportAttibutes[key]);
        }
        
        ajaxRequest({
            'method': 'POST',
            'url': oVmap['properties']['vmap_export']['gtf_api_url'] + '/gtf/userorders',
            'headers': {
                'Token': oVmap['properties']['vmap_export']['gtf_public_token']
            },
            'data': {
                'workspace_id': oVmap['properties']['vmap_export']['gtf_workspace_id'],
                'priority_id': oVmap['properties']['vmap_export']['gtf_priority_id'],
                'email_option_id': oVmap['properties']['vmap_export']['gtf_email_option_id'],
                'wk_params': aWkParams.join('|')
            },
            'scope': this.$scope_,
            'timeout': 5000,
            'sendToken': false,
            'success': function (response) {
                if (!goog.isDef(response['data'])) {
                    console.error("response['data'] undefined");
                    $.notify("Échec lors de l'envoi de la demande", 'error');
                    return null;
                }
                if (goog.isDef(response['data']['errorMessage'])) {
                    bootbox.alert(response['data']['errorType'] + ': ' + response['data']['errorMessage']);
                    $.notify("Échec lors de l'envoi de la demande", 'error');
                    return null;
                }
                if (goog.isDefAndNotNull(response['data']['order_id'])) {
                    $.notify("Demande envoyée, le résultat sera renvoyé par email", "success");
                } else {
                    $.notify("Échec lors de l'envoi de la demande", 'error');
                    console.error('Aucune valeur retournée');
                    return null;
                }
            },
            'error': function (response) {
                $.notify("Échec lors de l'envoi de la demande", 'error');
            }
        });
    });
};

/**
 * Récupère un nouveau token vMap valable 24h
 * @returns {.$q@call;defer.promise}
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.getTokenForGtfExport_ = function () {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.getTokenForGtfExport_');
    
    var $q = this.$q_;
    var deferred = $q.defer();
    var promise = deferred.promise;
    
    ajaxRequest({
        'method': 'POST',
        'url': oVmap['properties']['api_url'] + '/vitis/privatetoken',
        'data': {
            'duration': 1440
        },
        'scope': this.$scope_,
        'timeout': 5000,
        'success': function (response) {
            if (!goog.isDef(response['data'])) {
                console.error("response['data'] undefined");
                $.notify("Échec lors de l'envoi de la demande", 'error');
                return null;
            }
            if (goog.isDef(response['data']['errorMessage'])) {
                bootbox.alert(response['data']['errorType'] + ': ' + response['data']['errorMessage']);
                $.notify("Échec lors de l'envoi de la demande", 'error');
                return null;
            }
            if (goog.isDefAndNotNull(response['data']['token'])) {
                deferred.resolve(response['data']['token']);
            } else {
                console.error("response['token'] undefined");
                $.notify("Échec lors de l'envoi de la demande", 'error');
                return null;
            }
        },
        'error': function (response) {
            $.notify("Échec lors de l'envoi de la demande", 'error');
        }
    });
    
    return promise;
};

/**
 * GTF function to encode a string to be usefull in wkparams
 * @param {string} str
 * @returns {String}
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.encoderFME_ = function (str) {
    
    if (!goog.isString(str))
        return str;
    // table de correspondance
    var caracInGTF = [" ", "=", "\r\n", "(", ")", "$", "&", "@", "°", "'", ",", "\"", "{", "}", "[", "]", "|", ";", "/", "\\", "é", "à"];
    var caracForFME = ["<space>", "<GTF_EQUAL>", "<lf>", "<openparen>", "<closeparen>", "<dollar>", "<amp>", "<at>", "<u00b0>", "<apos>", "<comma>", "<quote>", "<opencurly>", "<closecurly>", "<openbracket>", "<closebracket>", "<GTF_PIPE>", "<semicolon>", "<solidus>", "<backslash>", "<u00e9>", "<u00e0>"];
    //variables parcours de chaine
    var result = str;
    var istr = 0;
    var iresult = 0;
    // remplacement des <> par parcours de chaine
    // avec vérification des mots clef
    // et gestion des caractère unicode
    while (istr < str.length) {
        if (str.charAt(istr) === "<") {
            
            var j = 0;
            var find = false;
            while (j < caracForFME.length && !find) {
                var clipper = result.substr(iresult, caracForFME[j].length);
                if (clipper === caracForFME[j]) {
                    istr += caracForFME[j].length;
                    iresult += caracForFME[j].length;
                    find = true;
                }
                j++;
            }
            /*****************************/
            //GTF_QUOTE et GTF BACKSLASH
            /* var quote = "<GTF_QUOTE>";
             var backslash = "<GTF_BACKSLASH>";
            
             var clipper = result.substr(iresult, quote.length);
             if (clipper === quote) {
             istr += quote.length;
             iresult += quote.length;
             find = true;
             }
            
             clipper = result.substr(iresult, backslash.length);
             console.error(result,clipper, iresult);
             if (clipper === backslash) {
             istr += backslash.length;
             iresult += backslash.length;
             find = true;
             }
             /*****************************/
            
            if (!find) {
                var part1 = result.substr(0, iresult);
                var part2 = result.substr(iresult + 1, result.length - 1);
                result = part1 + "<lt>" + part2;
                iresult += 4;
                istr += 1;
            }
        } else if (str.charAt(istr) === ">") {
            var part1 = result.substr(0, iresult);
            var part2 = result.substr(iresult + 1, result.length - 1);
            result = part1 + "<gt>" + part2;
            istr += 1;
            iresult += 4;
        } else {
            //unicode
            var code = str.charCodeAt(istr);
            if (code > 127) {
                var part1 = result.substr(0, iresult);
                var part2 = result.substr(iresult + 1, result.length - 1);
                var charCode = (+code).toString(16);
                
                while (charCode.length < 4) {
                    charCode = "0" + charCode;
                }
                
                result = part1 + "<u" + charCode + ">" + part2;
                istr += 1;
                iresult += 7;
            } else {
                istr += 1;
                iresult += 1;
            }
            /*******************************************/
        }
    }
    
    for (var j = 0; j < caracInGTF.length; j++) {
        while (result.indexOf(caracInGTF[j]) !== - 1)
            result = result.replace(caracInGTF[j], caracForFME[j]);
    }
    
    return result;
};

/**
 * 
 * @param {type} value
 * @param {type} row
 * @param {type} index
 * @returns {Array}
 * @private
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.selectTableFormatter = function (value, row, index) {
    
    var have_card_rights = row['bo_selection_']['have_card_rights'];
    var have_update_rights = row['bo_selection_']['have_update_rights'];
    var have_delete_rights = row['bo_selection_']['have_delete_rights'];
    
    // Régule la largeur de la colonne en fonciton des droits de l'utilisateur
    var width = 20;
    if (have_card_rights === "true" && !oVmap['properties']['is_mobile'])
        width += 20;
    if (have_update_rights === "true" && !oVmap['properties']['is_mobile'])
        width += 20;
    if (have_delete_rights === "true" && !oVmap['properties']['is_mobile'])
        width += 20;
    
    var aReturn = [
        '<div style="width: ' + width + 'px">',
        '<a class="selection-table-popup" href="javascript:void(0)" title="Popup">',
        '<i class="icon-comment padding-sides-5"></i>',
        '</a>'
    ];
    
    if (have_card_rights === "true" && !oVmap['properties']['is_mobile']) {
        aReturn.push('<a class="selection-table-card" href="javascript:void(0)" title="Fiche descriptive">');
        aReturn.push('<i class="glyphicon glyphicon-file padding-sides-5"></i>');
        aReturn.push('</a>');
    }
    if (have_update_rights === "true" && !oVmap['properties']['is_mobile']) {
        aReturn.push('<a class="selection-table-edit" href="javascript:void(0)" title="Editer">');
        aReturn.push('<i class="icon-draw padding-sides-5"></i>');
        aReturn.push('</a>');
    }
    if (have_delete_rights === "true" && !oVmap['properties']['is_mobile']) {
        aReturn.push('<a class="selection-table-delete" href="javascript:void(0)" title="Supprimer">');
        aReturn.push('<i class="icon-trash padding-sides-5"></i>');
        aReturn.push('</a>');
    }
    
    aReturn.push('</div>');
    
    return aReturn.join('');
};

window['selectTableEvents'] = {
    'click .selection-table-popup': function (e, value, row, index) {
        var scope = angular.element($('#vmap-advancedselect-tool')).scope();
        scope.$evalAsync(function () {
            scope['ctrl'].displaySelectionPopup(row['bo_selection_']);
        });
    },
    'click .selection-table-card': function (e, value, row, index) {
        var scope = angular.element($('#vmap-advancedselect-tool')).scope();
        scope.$evalAsync(function () {
            scope['ctrl'].displayObjectCard(row['bo_selection_']);
        });
    },
    'click .selection-table-edit': function (e, value, row, index) {
        var scope = angular.element($('#vmap-advancedselect-tool')).scope();
        scope.$evalAsync(function () {
            scope['ctrl'].displayEditFrom(row['bo_selection_']);
        });
    },
    'click .selection-table-delete': function (e, value, row, index) {
        var scope = angular.element($('#vmap-advancedselect-tool')).scope();
        scope.$evalAsync(function () {
            scope['ctrl'].deleteObject(row['bo_selection_']);
        });
    }
};


// Foncitons Édition/consultation formReader

/**
 * Display the object card
 * @param {object} selection
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.displayObjectCard = function (selection) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.displayObjectCard');
    this.oSelect.displayObjectCard(selection);
};

/**
 * Display the edit form
 * @param {object} selection
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.displayEditFrom = function (selection) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.displayEditFrom');
    var this_ = this;
    this.oSelect.displayEditFrom(selection, function () {
        // évènement submit
        setTimeout(function () {
            $('#select-list-modal').modal('show');
            this_.sumbitSearchForm(selection['bo_type']);
        });
    });
};


// Suppression

/**
 * Suggest if realy want to delete the object and call submitDeleteObject
 * @param {object} selection
 * @param {object} selection.bo_type
 * @param {object} selection.bo_id_value
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.deleteObject = function (selection) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.AdvancedSelectController.deleteObject');
    
    var this_ = this;
    
    this.oSelect.deleteObject(selection, function () {
        
        // Supprime de la selection en cours
        this_.removeFromTableSelection(selection);
        if ($('#select-list-modal').hasClass('in')) {
            this_.displaySelectionTable(this_['aSelections']);
        }
    });
    
};


// Utilitaires

/**
 * Remove all the selections from this['aSelections']
 * @param {string|undefined} bo_id if defined, the function will only remove the selections witch belong the business object
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.removeSelections = function (bo_id) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.removeSelections');
    
    // Supprime toutes les selections
    for (var i = this['aSelections'].length - 1; i >= 0; i--) {
        // Si bo_id est défini, supprime uniquement les selections correspondantes au bo_id
        if (goog.isDefAndNotNull(bo_id)) {
            if (this['aSelections'][i]['bo_type'] === bo_id)
                goog.array.removeAt(this['aSelections'], i);
        } else {
            goog.array.removeAt(this['aSelections'], i);
        }
    }
};

/**
 * Remove an element from this.aSelections
 * @param {type} selection
 * @returns {undefined}
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.removeFromTableSelection = function (selection) {
    
    for (var i = this['aSelections'].length - 1; i >= 0; i--) {
        if (angular.equals(this['aSelections'][i], selection)) {
            this['aSelections'].splice(i, 1);
        }
    }
};


// Définit la directive et le controller
oVmap.module.directive('appAdvancedselect', nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectDirective);
oVmap.module.controller('AppAdvancedselectController', nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController);

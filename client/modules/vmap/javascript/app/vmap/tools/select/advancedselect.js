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
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/advancedselect.html'
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

    // Réinitialise la projection au cas où elle ait changée entre temps
    this.sProjection = this['map'].getView().getProjection().getCode();
    this.GeoJSON_ = new ol.format.GeoJSON({defaultDataProjection: this.sProjection});

    this.draw_ = oVmap.getMap().setDrawInteraction({type: type}, 'basicTools-selectBy' + type);
    this.draw_.on('drawend',
            function (evt) {

                // Récupère la dernière feature ajoutée
                var feature = evt.feature;

                // Transforme les cercles en polygones de 32 côtés
                // car ils ne sont pas acceptés par WKT
                if (type === 'Circle') {
                    var circleGeom = feature.getGeometry();
                    var polygonGeom = new ol.geom.Polygon.fromCircle(circleGeom);
                    feature = new ol.Feature({
                        geometry: polygonGeom
                    });
                }

                // Transforme la feature en EWKT
                var EWKTGeometry = oVmap.getEWKTFromGeom(feature.getGeometry());

                this.queryByEWKTGeom(EWKTGeometry, true, true);


            }, this);
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
    var oQueryableBOs = oVmap.getMapManager().getQueryableBusinessObjects();

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
    for (var bo_id in oQueryableBOs) {
        this.oSelect.queryByEWKTGeom({
            bo_id: bo_id,
            EWKTGeometry: EWKTGeometry,
            canceler: this.canceler_,
            useTableFormat: true,
            buffer: oQueryableBOs[bo_id]['bo_selection_buffer'],
            callback: function (data) {

                // Décrémente le compteur de requêtes
                this_.requestCounter_--;

                // Si le compteur de requêtes vaut zéro, alors on remet le curceur normal
                if (this_.requestCounter_ === 0) {
                    $('body').css({"cursor": ""});
                }

                // Vide this.tmpSearchValues_
                this_.tmpSearchValues_ = {};

                // Ajoute le résultat de la requête dans this['aSelections']
                this_.addQueryResult({
                    data: data,
                    dataType: 'list',
                    callback: function () {
                        if (this_.requestCounter_ === 0) {
                            this_.displaySelectionTable(this_['aSelections']);

                        }
                    }
                }, function (response) {
                    console.error(response);
                    $('body').css({"cursor": ""});
                    this_.requestCounter_--;
                    this_.addQueryResult({
                        data: [],
                        dataType: 'list',
                        callback: function () {
                            if (this_.requestCounter_ === 0) {
                                this_.displaySelectionTable(this_['aSelections']);

                            }
                        }
                    });
                });
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
                    data: []
                });
                $('#select_table_' + this_['aBusinessObjectsList'][i]).parent().height($('body').height() / 2);
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
            if (goog.isDefAndNotNull(boId)) {
                $('#select_modal_tab_' + boId).tab('show');
            }
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

        showAjaxLoader();
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
        tmp['selection'] = aSelection[i];

        // Données à afficher
        if (goog.isDefAndNotNull(tmp))
            oTableSelection[aSelection[i]['bo_type']].push(tmp);
    }

    // Prévient des injections JavaScript
    for (var bo_id in oTableSelection) {
        for (var i = 0; i < oTableSelection[bo_id].length; i++) {
            for (var key in oTableSelection[bo_id][i]) {
                if (goog.isString(oTableSelection[bo_id][i][key])) {
                    oTableSelection[bo_id][i][key] = oTableSelection[bo_id][i][key].replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
    var geom_column = this['oBusinessObjects'][bo_type]['geom_column'];
    geom_column = goog.isDefAndNotNull(geom_column) ? geom_column : 'geom';

    // Si les valeurs d'un formulaire de recherche ont étés mémorisées, elles sont incorporées
    if (goog.isDefAndNotNull(this.tmpSearchValues_[bo_type])) {
        oFormValues['search'] = this.tmpSearchValues_[bo_type];
    } else {
        oFormValues['search'][geom_column] = this.EWKTGeometry;
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
                    }
                ]
            }
        ]
    };
    if (!angular.equals(oFormDefinition['search']['rows'][oFormDefinition['search']['rows'].length - 1], buttonSearch))
        oFormDefinition['search']['rows'].push(buttonSearch);

    // Champ contenant la géométrie
    var geomField = {
        "fields": [
            {
                "visibleAllTabs": true,
                "type": "text",
                "name": geom_column,
                "label": "Géométrie",
                "disabled": false,
                "required": false,
                "nb_cols": 12
            }
        ]
    };
    if (!angular.equals(oFormDefinition['search']['rows'][0], geomField))
        oFormDefinition['search']['rows'].unshift(geomField);

    // Evènement submit
    oFormDefinition['search']['event'] = function (oFormValuesResulted) {

//        var boValues = this_.oSelect.getBOValuesFromFormValues(oFormValuesResulted['search']);
        var boValues = this_.oSelect.getFormData(oFormValuesResulted, oFormDefinition, 'search');

        this_.updateSelectionTable(angular.copy(bo_type), boValues, angular.copy(geom_column));
    };

    // Init le formulaire de search
    setTimeout(function () {
        var searchFormReaderScope = this_.getSearchFormReaderScope(bo_type);
        if (goog.isDefAndNotNull(searchFormReaderScope)) {
            searchFormReaderScope.$apply(function () {
                searchFormReaderScope['ctrl']['setDefinitionName']('search');
                searchFormReaderScope['ctrl']['setFormValues'](angular.copy(oFormValues));
                searchFormReaderScope['ctrl']['setFormDefinition'](angular.copy(oFormDefinition));
                searchFormReaderScope['ctrl']['loadForm']();
            });
        }
    }, 500);
};

/**
 * 
 * @param {string} bo_id
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.sumbitSearchForm = function (bo_id) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.updateSelectionTable');
    oVmap.simuleClick("select_search_form_reader_" + bo_id + "_submit_buton");
};

/**
 * Update the rows on the selection lists to filter by the search form
 * @param {string} bo_id
 * @param {string} oFilter
 * @param {string} geom_column
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.prototype.AdvancedSelectController.prototype.updateSelectionTable = function (bo_id, oFilter, geom_column) {
    oVmap.log('nsVmap.nsToolsManager.AdvancedSelect.AdvancedSelectController.updateSelectionTable');

    if (!goog.isDefAndNotNull(bo_id)) {
        console.error('bo_id not defined or null');
        return 0;
    }

    var this_ = this;
    var $scope = this.$scope_;
    var $q = this.$q_;

    oFilter = goog.isDefAndNotNull(oFilter) ? oFilter : {};

    var sFilter = "";
    var i = 0;

    // Crée le filter

    var filter = {
        'relation': 'AND',
        'operators': []
    };
    for (var key in oFilter) {
        // Ne tient pas compte de geom
        if (key === geom_column)
            continue;

        if (oFilter[key] === '')
            continue;

        filter['operators'].push({
            'column': key,
            'compare_operator': '=',
            'value': oFilter[key]
        });
        i++;
    }
    sFilter = JSON.stringify(filter);

    // Mémorise le filter
    this.tmpSearchValues_[bo_id] = oFilter;

    // Calcul du buffer
    var buffer = 0.01;
    var scale = oVmap.getMap().getScale();
    buffer = (this.buffer_ * scale) / 1000;

    if (buffer > this.maxBuffer_)
        buffer = this.maxBuffer_;


    var url = oVmap['properties']['api_url'] + '/vmap/querys/' + bo_id + '/list';
    var proj = this['map'].getView().getProjection().getCode().substring(5);

    // Ajouter get_geom, get_image, intersect_buffer
    var data = {
        'filter': sFilter,
        'intersect_geom': oFilter[geom_column],
        'result_srid': proj,
        'get_geom': false,
        'get_image': false,
        'intersect_buffer': buffer,
        'limit': this['limitList_']
    };

    var canceler = $q.defer();

    showAjaxLoader();
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
        'abord': canceler.promise,
        'success': function (response) {

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
                $.notify("Aucune valeur retournée", "warn");
                response['data']['data'] = [];
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

            if (response['data']['data'].length === this_['limitList_'])
                $.notify("Limite d'objets à afficher atteinte", "warn");
        }
    });
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
        aSelection.push(tableSelection[i]['selection']);
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
        aSelection.push(tableSelection[i]['selection']);
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
 * 
 * @param {type} value
 * @param {type} row
 * @param {type} index
 * @returns {Array}
 * @private
 * @export
 */
nsVmap.nsToolsManager.AdvancedSelect.selectTableFormatter = function (value, row, index) {

    var have_card_rights = row['selection']['have_card_rights'];
    var have_update_rights = row['selection']['have_update_rights'];
    var have_delete_rights = row['selection']['have_delete_rights'];

    // Régule la largeur de la colonne en fonciton des droits de l'utilisateur
    var width = 20;
    if (have_card_rights === "true")
        width += 20;
    if (have_update_rights === "true")
        width += 20;
    if (have_delete_rights === "true")
        width += 20;

    var aReturn = [
        '<div style="width: ' + width + 'px">',
        '<a class="selection-table-popup" href="javascript:void(0)" title="Popup">',
        '<i class="icon-comment padding-sides-5"></i>',
        '</a>'
    ];

    if (have_card_rights === "true") {
        aReturn.push('<a class="selection-table-card" href="javascript:void(0)" title="Fiche descriptive">');
        aReturn.push('<i class="glyphicon glyphicon-file padding-sides-5"></i>');
        aReturn.push('</a>');
    }
    if (have_update_rights === "true") {
        aReturn.push('<a class="selection-table-edit" href="javascript:void(0)" title="Editer">');
        aReturn.push('<i class="icon-draw padding-sides-5"></i>');
        aReturn.push('</a>');
    }
    if (have_delete_rights === "true") {
        aReturn.push('<a class="selection-table-delete" href="javascript:void(0)" title="Supprimer">');
        aReturn.push('<i class="icon-trash padding-sides-5"></i>');
        aReturn.push('</a>');
    }

    aReturn.push('</div>');

    return aReturn.join('');
};

window['selectTableEvents'] = {
    'click .selection-table-popup': function (e, value, row, index) {
        var scope = angular.element($('#select-list-modal')).scope();
        scope.$evalAsync(function () {
            scope['ctrl'].displaySelectionPopup(row['selection']);
        });
    },
    'click .selection-table-card': function (e, value, row, index) {
        var scope = angular.element($('#select-list-modal')).scope();
        scope.$evalAsync(function () {
            scope['ctrl'].displayObjectCard(row['selection']);
        });
    },
    'click .selection-table-edit': function (e, value, row, index) {
        var scope = angular.element($('#select-list-modal')).scope();
        scope.$evalAsync(function () {
            scope['ctrl'].displayEditFrom(row['selection']);
        });
    },
    'click .selection-table-delete': function (e, value, row, index) {
        var scope = angular.element($('#select-list-modal')).scope();
        scope.$evalAsync(function () {
            scope['ctrl'].deleteObject(row['selection']);
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
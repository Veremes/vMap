/* global goog, nsVmap, oVmap, ol, angular, scope, bootbox, vitisApp, destructor_form */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.BasicSelect
 * cette classe permet l'interrogation de couches
 */
goog.provide('nsVmap.nsToolsManager.BasicSelect');


/**
 * @classdesc
 * Class {@link nsVmap.nsToolsManager.BasicSelect}: allow select
 *
 * @constructor
 * @export
 */
nsVmap.nsToolsManager.BasicSelect = function () {

    // Directives et controleurs Angular
    oVmap.module.directive('appBasicselect', this.basicSelectDirective);
    oVmap.module.controller('AppBasicselectController', this.basicSelectController);
};

/**
 * App-specific directive wrapping the select tools.
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectDirective = function () {
    oVmap.log("nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectDirective");
    return {
        restrict: 'A',
        scope: {
            'map': '=appMap',
            'lang': '=appLang',
            'currentAction': '=appAction'
        },
        controller: 'AppBasicselectController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/basicselect.html'
    };
};

/**
 * @ngInject
 * @constructor
 * @param {object} $http
 * @param {object} $scope
 * @param {object} $timeout
 * @param {object} $q
 * @returns {nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController}
 * @export
 */
nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController = function ($http, $scope, $timeout, $q) {
    oVmap.log("nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController");

    var this_ = this;

    /**
     * The vMap scope
     */
    $scope['vmapScope'] = oVmap['scope'];

    /**
     * @private
     */
    this.$http_ = $http;

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
     * Dummy canceler (use canceler.resolve() for cancel the $http request)
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
     * The selected business object
     */
    this['sSelectedBo'] = '';

    /**
     * Queryable business objects
     */
    this['oQueryableBOs'] = {};

    /**
     * Queryable business objects list
     */
    this['aBusinessObjectsList'] = [];
    
    var setQueryableBos = function(){
        this_.$scope_.$applyAsync(function () {
            // rempli this.oQueryableBOs
            this_['oQueryableBOs'] = oVmap.getMapManager().getQueryableBusinessObjects();
            this_['aBusinessObjectsList'] = Object.keys(this_['oQueryableBOs']);

            // séléctionne le premier objet métier si besoin
            if (!goog.isDefAndNotNull(this_['oQueryableBOs'][this_['sSelectedBo']])) {
                
                var iSmallestIndex = 1000000;
                var sFirstBo = '';
                
                for (var bo in this_['oQueryableBOs']) {
                    if(this_['oQueryableBOs'][bo]['bo_index'] < iSmallestIndex){
                        iSmallestIndex = this_['oQueryableBOs'][bo]['bo_index'];
                        sFirstBo = this_['oQueryableBOs'][bo]['bo_id'];
                    }
                }                
                this_['sSelectedBo'] = sFirstBo;
            }
        });
    };

    // Rempli les bo disponibles
    oVmap['scope'].$on('layersChanged', function () {
        setQueryableBos();
    });
    setTimeout(function () {
        setQueryableBos();
    });

    // Effectue une sélection lors d'un click sur la carte
    this['map'].on('click', function (evt) {
        if (oVmap.getMap().getCurrentAction() === '') {
            // Re-crée la géométrie en WKT
            var olPoint = new ol.geom.Point(evt.coordinate);
            var EWKTGeometry = oVmap.getEWKTFromGeom(olPoint);
            
            // Ferme les outils
            oVmap.getToolsManager().getBasicTools().toggleOutTools();

            // Interroge les couches selectionnées
            this.queryByEWKTGeom(EWKTGeometry, olPoint);
        }
    }, this);

    // Anulle l'édition quand on change d'outil
    oVmap['scope'].$on('toggleOutTools', function () {
        this_.canceler_.resolve();
    });

    // Lors du click sur 'echap', annule les requêtes en cours
    $(document).keydown(function (e) {
        if (e.keyCode === 27) {
            this_.canceler_.resolve();
        }
    });
};


// Interrogation par intersection géométrique

/**
 * Call sendQueryByEWKTGeom_ for the selected layers
 * @param {string} EWKTGeometry
 * @param {boolean} useTableFormat true to result in table format, false for popup
 * @returns {undefined}
 */
nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.queryByEWKTGeom = function (EWKTGeometry, olPoint) {
    oVmap.log('nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.queryByEWKTGeom');

    var this_ = this;

    // Stoque les paramètres d'interrogation
    this.EWKTGeometry = EWKTGeometry;
    this.olPoint = olPoint;

    $('body').css({"cursor": "wait"});

    // Annule les anciennes requêtes
    this.canceler_.resolve();

    // Réinitialise canceler_
    this.canceler_ = this.$q_.defer();

    // Interroge l'objet métier sélectionné
    this.oSelect.queryByEWKTGeom({
        bo_id: this['sSelectedBo'],
        EWKTGeometry: EWKTGeometry,
        canceler: this.canceler_,
        useTableFormat: false,
        callback: function (data) {
            $('body').css({"cursor": ""});
            this_.replaceSelectionPopup(data, olPoint);
        }
    });
};

// Ajout de la sélection

/**
 * Add the query result to this['aSelections'] removing the duplicate selections
 * @param {object} opt_options
 * @param {array<object>} opt_options.data
 * @param {string} opt_options.dataType summary|list|form
 * @param {function} opt_options.callback callback to run at the end of the function
 */
nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.addQueryResult = function (opt_options) {
    oVmap.log('nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.addQueryResult');

    var this_ = this;
    var aData = goog.isDef(opt_options.data) ? opt_options.data : [];
    var dataType = goog.isDef(opt_options.dataType) ? opt_options.dataType : null;
    var callback = goog.isDef(opt_options.callback) ? opt_options.callback : function () {
        return 0;
    };

    this.oSelect.addQueryResult({
        data: aData,
        selection: this['aSelections'],
        dataType: dataType,
        callback: function (aSelections) {
            this_['aSelections'] = aSelections;
            callback.call();
        }
    });
};


// Fonctions mode popup

/**
 * Replace the last popup by a new
 * @param {array} aSelection
 * @param {ol.geom.Point|undefined} olPoint position where to center the popup
 * @export
 */
nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.replaceSelectionPopup = function (aSelection, olPoint) {
    oVmap.log('nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.replaceSelectionPopup');

    var this_ = this;

    // Vérifie que la feature soit bien présente    
    for (var i = aSelection.length - 1; i >= 0; i--) {

        var error = false;
        if (!goog.isDefAndNotNull(aSelection[i]['bo_intersect_geom']) && !goog.isDefAndNotNull(aSelection[i]['olFeature'])) {
            error = true;
        }
        if (goog.isDefAndNotNull(aSelection[i]['olFeature'])) {
            if (!goog.isDefAndNotNull(aSelection[i]['olFeature'].getGeometry())) {
                error = true;
            }
        }
        if (error) {
            $.notify("L'objet sélectionné (" + aSelection[i]['bo_id_field'] + " = " + aSelection[i]['bo_id_value'] + ") n'a pas de géométrie");
            aSelection.splice(i, 1);
        }
    }

    if (aSelection.length === 0) {
        return;
    }

    // Garde en mémoire les anciennes selections pour supprimer leurs popup plus tard
    var newSelection = goog.array.clone(this['aSelections']);
    goog.array.extend(this.aLastSelections, newSelection);

    // Supprime toutes les anciennes popup
    this.removePopups();

    // Ajoute le résultat de dans this['aSelections']
    this_.addQueryResult({
        data: aSelection,
        dataType: 'summary',
        callback: function () {
            this_.closeSelectionPopup(this_.aLastSelections);
            this_.displaySelectionPopup(this_['aSelections'], olPoint);
        }
    });

};

/**
 * Display a selection of popups
 * @param {array} aSelection
 * @param {ol.geom.Point|undefined} olPoint position where to center the popup
 * @private
 */
nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.displaySelectionPopup = function (aSelection, olPoint) {
    oVmap.log('nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.displaySelectionPopup');

    var scope = this.$scope_;

    for (var i = 0; i < aSelection.length; i++) {

        // Crée la nouvelle popup
        if (goog.isDef(aSelection[i]['mapPopup']))
            aSelection[i]['mapPopup'].remove(false);

        aSelection[i]['mapPopup'] = new nsVmap.Map.MapPopup(aSelection[i]['olFeature'], olPoint);

        // Ajoute au bonton "closse" la fonction qui rend la popup unlocked quand on la ferme
        aSelection[i]['mapPopup'].HTMLCloser_.selection = aSelection[i];
        aSelection[i]['mapPopup'].HTMLCloser_.addEventListener('click', function () {
            this.selection['locked'] = false;
        }, true);

        // Ajoute le bouton "édition" si have_update_rights est true
        if (aSelection[i]['have_update_rights'] === "true" || aSelection[i]['have_update_rights'] === true) {
            aSelection[i]['mapPopup'].HTMLEdit_ = document.createElement('a');
            aSelection[i]['mapPopup'].HTMLEdit_.href = '#';
            aSelection[i]['mapPopup'].HTMLEdit_.className = 'ol-popup-edit icon-draw';
            aSelection[i]['mapPopup'].HTMLButtonsContainer_.appendChild(aSelection[i]['mapPopup'].HTMLEdit_);

            // Ajoute l'interraction sur le bouton "édition"
            aSelection[i]['mapPopup'].HTMLEdit_.scope = this.$scope_;
            aSelection[i]['mapPopup'].HTMLEdit_.selection = aSelection[i];
            aSelection[i]['mapPopup'].HTMLEdit_.addEventListener('click', function () {
                var selection = this.selection;
                scope.$apply(function () {
                    scope['ctrl'].displayEditFrom(selection);
                });
            }, true);
        }

        // Ajoute le bouton "fiche descriptive" si have_card_rights est true
        if (aSelection[i]['have_card_rights'] === "true" || aSelection[i]['have_card_rights'] === true) {
            aSelection[i]['mapPopup'].HTMLCard_ = document.createElement('a');
            aSelection[i]['mapPopup'].HTMLCard_.href = '#';
            aSelection[i]['mapPopup'].HTMLCard_.className = 'ol-popup-card glyphicon glyphicon-file';
            aSelection[i]['mapPopup'].HTMLButtonsContainer_.appendChild(aSelection[i]['mapPopup'].HTMLCard_);

            // Ajoute l'interraction sur le bouton "fiche descriptive"
            aSelection[i]['mapPopup'].HTMLCard_.scope = this.$scope_;
            aSelection[i]['mapPopup'].HTMLCard_.selection = aSelection[i];
            aSelection[i]['mapPopup'].HTMLCard_.addEventListener('click', function () {
                var selection = this.selection;
                scope.$apply(function () {
                    scope['ctrl'].displayObjectCard(selection);
                });
            }, true);
        }

        // Ajoute une image si il y a un bo_image_path
        aSelection[i]['mapPopup'].displayMessage('<b>' + aSelection[i]['bo_title'] + ':</b>');
        aSelection[i]['mapPopup'].addMessageTable(aSelection[i]['bo_summary']);
        if (goog.isDef(aSelection[i]['bo_image_path']))
            aSelection[i]['mapPopup'].addPhoto(aSelection[i]['bo_image_path']);


        // Ajoute le bouton "Modifier la géométrie" si have_update_rights = true
        if (aSelection[i]['have_update_rights'] === "true" || aSelection[i]['have_update_rights'] === true) {
            aSelection[i]['mapPopup'].addAction({
                'content': '<span class="icon-polygon"></span> Modifier la géométrie',
                'event': function () {
                    scope.$apply(function () {
                        scope['ctrl'].editFeature(scope['ctrl']['aSelections'][0]);
                    });
                }
            });
        }

        // Ajoute le bouton "Supprimer l'objet" si have_delete_rights = true
        if (aSelection[i]['have_delete_rights'] === "true" || aSelection[i]['have_delete_rights'] === true) {
            aSelection[i]['mapPopup'].addAction({
                'content': '<span class="icon-trash"></span> Supprimer l\'objet',
                'event': function () {
                    scope.$apply(function () {
                        scope['ctrl'].deleteObject(scope['ctrl']['aSelections'][0]);
                    });
                }
            });
        }

        // Ajoute le bouton "Ajouter au panier"
        aSelection[i]['mapPopup'].addAction({
            'content': '<span class="icon-shopping_basket"></span> Ajouter au panier',
            'event': function () {
                scope.$apply(function () {
                    scope['ctrl'].addToCard(scope['ctrl']['aSelections'][0]);
                });
            }
        });

        // Google street view
        if (oVmap['properties']['selection']['street_view'] !== false) {
            var geometry = aSelection[i]['olFeature'].getGeometry();
            var pointCoords = geometry.getFirstCoordinate();
            var proj = this['map'].getView().getProjection().getCode();
            pointCoords = ol.proj.transform(pointCoords, proj, 'EPSG:4326');
            var url = 'http://maps.google.com/maps?q=&layer=c&cbll=' + pointCoords[1] + ',' + pointCoords[0] + '';
            aSelection[i]['mapPopup'].addAction({
                'content': '<span class="icon-street-view"></span> Google Street View',
                'event': function () {
                    var win = window.open(url, '_blank');
                    win.focus();
                }
            });
        }
    }

    // Ajoute les résultats
    goog.array.insertArrayAt(this['aSelections'], aSelection, -1);

    // supprime les doublons
    this['aSelections'] = this.oSelect.removeDuplicateSelections(this['aSelections']);
};

/**
 * Center the map on a popup
 * @param {object} selection
 * @param {object} selection.olFeature
 */
nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.centerMapOnPopup = function (selection) {
    oVmap.log('nsVmap.nsToolsManager.BasicSelect.basicSelectController.centerMapOnPopup');

    if (!goog.isDefAndNotNull(selection['olFeature'])) {
        console.error("selection['olFeature'] undefined:", selection['olFeature'])
        return 0;
    }

    var geom = selection['olFeature'].getGeometry();
    
    if (!goog.isDefAndNotNull(geom)) {
        console.error("selection['olFeature'].getGeometry() not defined");
        return 0;
    }

    if (geom.getType() === 'Point') {
        this['map'].getView().setCenter(geom.getCoordinates());
    } else if (geom.getType() === 'MultiPoint') {
        if (geom.getPoints().length === 1) {
            this['map'].getView().setCenter(geom.getPoint(0).getCoordinates());
        } else {
            this['map'].getView().fit(geom, this['map'].getSize());
        }
    } else {
        this['map'].getView().fit(geom, this['map'].getSize());
    }

};


// Foncitons Édition/consultation formReader

/**
 * Display the object card
 * @param {object} selection
 * @export
 */
nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.displayObjectCard = function (selection) {
    oVmap.log('nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.displayObjectCard');
    this.oSelect.displayObjectCard(selection);
};

/**
 * Display the edit form
 * @param {object} selection
 * @export
 */
nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.displayEditFrom = function (selection) {
    oVmap.log('nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.displayEditFrom');
    var this_ = this;
    this.oSelect.displayEditFrom(selection, function(){
        this_.queryByEWKTGeom(this_.EWKTGeometry, this_.olPoint);
    });
};


// Édition de la géométrie


/**
 * Start the geometry edition
 * @param {object} selection
 * @export
 */
nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.editFeature = function (selection) {
    oVmap.log('nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.editFeature');
    
    // Ferme l'ensemble des popups
    this.closeSelectionPopup();
    
    this.oSelect.editFeature(selection);
};


// Suppression

/**
 * Suggest if realy want to delete the object and call submitDeleteObject
 * @param {object} selection
 * @param {object} selection.bo_type
 * @param {object} selection.bo_id_value
 * @export
 */
nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.deleteObject = function (selection) {
    oVmap.log('nsVmap.nsToolsManager.BasicSelect.basicSelectController.deleteObject');

    var this_ = this;

    this.oSelect.deleteObject(selection, function () {

        // Ferme les popup
        this_.closeSelectionPopup();

        // Supprime de la selection en cours
        this_.removeFromTableSelection(selection);
    });
};


// Utilitaires

/**
 * Remove the popups and empty this['aSelections']
 * @export
 */
nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.removePopups = function (){
    oVmap.log('nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.removePopups');
    
    // Supprime toutes les anciennes popup
    this.closeSelectionPopup();
    
    // Supprime toutes les anciennes selections
    this.removeSelections();
};

/**
 * Remove all the selections from this['aSelections']
 * @param {string|undefined} bo_id if defined, the function will only remove the selections witch belong the business object
 */
nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.removeSelections = function (bo_id) {
    oVmap.log('nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.removeSelections');

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
nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.removeFromTableSelection = function (selection) {

    for (var i = this['aSelections'].length - 1; i >= 0; i--) {
        if (angular.equals(this['aSelections'][i], selection)) {
            this['aSelections'].splice(i, 1);
        }
    }
};

/**
 * Remove the popups from aSelection or this['aSelections']
 * @param {array|undefined} aSelection
 */
nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.closeSelectionPopup = function (aSelection) {
    oVmap.log('nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.closeSelectionPopup');

    aSelection = goog.isDefAndNotNull(aSelection) ? aSelection : this['aSelections'];

    for (var i = 0; i < aSelection.length; i++) {
        if (goog.isDef(aSelection[i]['mapPopup']))
            aSelection[i]['mapPopup'].remove();
    }

};

/**
 * Add the selected elements from the table to the card
 * @param {object} oSelection
 * @export
 */
nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.addToCard = function (oSelection) {
    oVmap.log('nsVmap.nsToolsManager.BasicSelect.prototype.basicSelectController.prototype.tableAddToCard');
    this.oSelect.addToCard([oSelection]);
};
/* global goog, nsVmap, oVmap, ol, angular, scope, bootbox, destructor_form, constructor_form, vitisApp */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.Insert
 * cette classe permet l'insertion de données danns les objets métier
 */
goog.provide('nsVmap.nsToolsManager.Insert');

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
 * Class {@link nsVmap.nsToolsManager.Insert}: allow insert
 *
 * @constructor
 * @export
 */
nsVmap.nsToolsManager.Insert = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert');
};

/**
 * App-specific directive wrapping the insert tools.
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolDirective = function () {
    oVmap.log("nsVmap.nsToolsManager.Insert.prototype.inserttoolDirective");
    return {
        restrict: 'A',
        scope: {
            'map': '=appMap',
            'lang': '=appLang',
            'currentAction': '=appAction'
        },
        controller: 'AppInsertController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/insert.html'
    };
};

/**
 * @ngInject
 * @constructor
 * @param {object} $scope
 * @param {object} $rootScope
 * @param {object} $q
 * @returns {nsVmap.nsToolsManager.Insert.prototype.inserttoolController}
 * @export
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController = function ($scope, $rootScope, $q) {
    oVmap.log("nsVmap.nsToolsManager.Insert.prototype.inserttoolController");

    /**
     * The vMap scope
     */
    $scope['vmapScope'] = oVmap['scope'];

    /**
     * Pointer on "this"
     * @type nsVmap.nsToolsManager.Insert.prototype.inserttoolController
     */
    var this_ = this;

    /**
     * @private
     */
    this.$scope_ = $scope;

    /**
     * @private
     */
    this.$rootScope_ = $rootScope;

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
     * @type string
     * @private
     */
    this.sProjection = this['map'].getView().getProjection().getCode();

    /**
     * @type ol.format.GeoJSON
     * @private
     */
    this.GeoJSON_ = new ol.format.GeoJSON({defaultDataProjection: this.sProjection});

    /**
     * @type {ol.interaction.Draw}
     * @private
     */
    this.draw_;

    /**
     * @type {ol.layer.Vector}
     * @private
     */
    this.oOverlayLayer_ = oVmap.getMap().addVectorLayer();

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
                color: 'rgba(0, 0, 0, 0)'
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

    /**
     * @type {ol.interaction.Select}
     * @private
     */
    this.delete_ = new ol.interaction.Select({
        layers: [this.oOverlayLayer_]
    });

    /**
     * The current properties
     */
    this['properties'] = oVmap['properties'];

    /**
     * The current token
     */
    this['token'] = oVmap['properties']['token'];

    /**
     * 
     */
    this['addPartGeomType'] = '';

    /**
     * The bo selected for insert in
     */
    $scope['selectedBoId'];

    /**
     * Insertable Business Objects
     */
    $scope['aInsertableBOs'] = oVmap.getMapManager().getInsertableBusinessObjects();

    /**
     * Object to insert
     * oInsertObject.sFormDefinitionName name of the form (insert, upload, display)
     * oInsertObject.oResult result to send via http request
     * oInsertObject.sGeomColumn name of the column witch contains the geom of the business object
     * oInsertObject.sGeomType type of the sGeomColumn (POINT, MULTIPOINT, GEOMETRYCOLLECTION)
     * oInsertObject.oFormDefinition Form definition (JSON)
     * oInsertObject.oFormValues Values of the form
     * @type {object}
     */
    $scope['oInsertObject'] = {
        'sFormDefinitionName': 'insert',
        'business_object_id': null,
        'oResult': {},
        'sGeomColumn': null,
        'sGeomType': null,
        'oFormDefinition': {},
        'add_form_size': 1,
        'oFormValues': {
            'insert': {}
        }
    };

    $scope['featuresLength'] = 0;

    // Alimente $scope['aInsertableLayers'] lors des changements de couches
    oVmap['scope'].$on('layersChanged', function () {
        this_.$scope_.$applyAsync(function () {
            $scope['aInsertableBOs'] = oVmap.getMapManager().getInsertableBusinessObjects();
        });
    });
    setTimeout(function () {
        this_.$scope_.$applyAsync(function () {
            $scope['aInsertableBOs'] = oVmap.getMapManager().getInsertableBusinessObjects();
        });
    });

    // Supprime la feature lors de la sélection sur l'interaction this.delete_
    this.delete_.on('select', function () {
        var aSelectedFeatures = this.delete_.getFeatures().getArray();
        for (var i = 0; i < aSelectedFeatures.length; i++) {
            this.oOverlayLayer_.getSource().removeFeature(aSelectedFeatures[i]);
        }
        this.delete_.getFeatures().clear();
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

    // Lance updateInsertObjectFeature lors de chaque changement sur this.oOverlayFeatures_ 
    // si il n'y a pas eut de changements pendant 500ms
    var iTmpChanges = 0;
    this.oOverlayLayer_.getSource().on('change', function () {

        // Retire les anciennes features si on est pas en mode multi
        var sGeomType = $scope['oInsertObject']['sGeomType'];
        // Si il ne s'agit pas d'une géométrie multiple
        if (goog.isDefAndNotNull(sGeomType)) {
            if (sGeomType.substr(0, 5) !== 'MULTI' && sGeomType !== 'GEOMETRYCOLLECTION') {
                if (this.oOverlayFeatures_.getLength() > 1) {
                    while (this.oOverlayFeatures_.getLength() > 1) {
                        this.oOverlayFeatures_.removeAt(0);
                    }
                }
            }
        }

        // Si il n'y a pas eut de changements pendant 500ms, lance updateInsertObjectFeature
        iTmpChanges++;
        var iTmpChangesCopy = angular.copy(iTmpChanges);
        setTimeout(function () {
            if (iTmpChanges === iTmpChangesCopy) {
                this_.updateInsertObjectFeature();
            }
        }, 500);
    }, this);

    // Scroll en haut du formReader lors de l'affichage de la modale
    $('#basictools-insert-form-reader-modal').on('shown.bs.modal', function (e) {
        $('#basictools-insert-form-reader').parent().scrollTop(0);
    });

    // Vide les information saisies quand on change d'outil
    oVmap['scope'].$on('toggleOutTools', function () {
        // Vide oResult et oFormValues
        $scope['oInsertObject']['oResult'] = {};
        $scope['oInsertObject']['oFormValues']['insert'] = {};
        // Vide selected bo_id
        $scope['selectedBoId'] = null;
        // Vide les features ayant pu être dessinées
        this_.oOverlayFeatures_.clear();
    });

    this.oOverlayFeatures_.on('change:length', function () {
        $scope.$applyAsync(function () {
            $scope['featuresLength'] = this_.oOverlayFeatures_.getLength();
        });
    }, this);
};




// Opérations sur les couches

/**
 * Get the Insertable layers
 * @returns {Array}
 * @export
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.getInsertableLayers = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.getInsertableLayers');
    return oVmap.getMapManager().getInsertableLayers();
};

/**
 * Reload the layer by his business object ID
 * @param {string} sBusinessObjectID
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.reloadImpactedLayer = function (sBusinessObjectID) {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.reloadImpactedLayer');

    var aLayers = this['map'].getLayers().getArray();
    var aBos;

    for (var i = 0; i < aLayers.length; i++) {
        aBos = aLayers[i].get('business_objects');
        if (goog.isArray(aBos)) {
            for (var ii = 0; ii < aBos.length; ii++) {
                if (aBos[ii]['business_object_id'] === sBusinessObjectID) {
                    aLayers[i].refreshWithTimestamp();
                }
            }
        }
    }
};




// Edition des attributs

/**
 * Display the edit form
 * @export
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.displayEditFrom = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.displayEditFrom');

    var $scope = this.$scope_;

    oVmap.getToolsManager().getBasicTools().showTool($('#basic-tools-dropdown-insert-btn'));
    $('#basictools-insert-form-reader-modal').modal('show');

    // Charge les valeurs par défaut, listes etc..
    var editFormReaderScope = this.getEditFormReaderScope();
    editFormReaderScope.$evalAsync(function () {

        // Tente de lancer destructor_form
        try {
            if (goog.isDef(destructor_form)) {
                destructor_form();
            }
        } catch (e) {
            oVmap.log("destructor_form does not exist");
        }


        // Chargement des js associés au bo
        if (goog.isDefAndNotNull($scope['oInsertObject']['oFormDefinition_js'])) {
            var sUrl = $scope['oInsertObject']['oFormDefinition_js'];
            oVmap.log("initHtmlForm : javascript assoc. to : " + sUrl);
            loadExternalJs([sUrl], {
                "callback": function () {
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
        }

        // Set le formulaire
        editFormReaderScope['ctrl']['loadForm']();
    });
};

/**
 * Simule a click on the submit button of the formReader to know if the form is html5 valid
 * and run getBOValuesFromFormValue() to complete $scope['oInsertObject']['oResult']
 * @export
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.validateForm = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.validateForm');

    var this_ = this;
    var $scope = this.$scope_;

    $scope.isFormValid_ = false;

    setTimeout(function () {
//        oVmap.simuleClick("basictools-insert-form-reader-submit-btn");
        var oFormReaderScope = this_.getEditFormReaderScope();
        oFormReaderScope['sendForm']();
        setTimeout(function () {
            if ($scope.isFormValid_) {
                // Récupère les valeurs sous un format propice à l'insertion (sans "selectedOption")
                $scope['oInsertObject']['oResult'] = this_.getBOValuesFromFormValues($scope['oInsertObject']['oFormValues']);
                $('#basictools-insert-form-reader-modal').modal('hide');
            }
        });
    });
};

/**
 * Get the values from oFormValues
 * @param {object} oFormValues
 * @returns {object}
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.getBOValuesFromFormValues = function (oFormValues) {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.getBOValuesFromFormValues');

    var $scope = this.$scope_;
    var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);

    var oFormValuesValues = goog.object.clone(oFormValues);

    var oFormValuesValues = formSrvc['getFormData']('insert', true, {
        'oFormDefinition': $scope['oInsertObject']['oFormDefinition'],
        'oFormValues': oFormValuesValues,
        'aParamsToSave': ['geom']
    });

    return oFormValuesValues;
};

/**
 * Run validateForm() and if the form is correct run submitInsertion()
 * @export
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.trySubmitInsertion = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.trySubmitInsertion');

    var this_ = this;
    var $scope = this.$scope_;

    $scope.isFormValid_ = false;

    this.validateForm();
    setTimeout(function () {
        if ($scope.isFormValid_) {
            this_.submitInsertion();
        }
    }, 500);
};

/**
 * Return true if all the required params defined in oFormDefinition have been completed in oResult
 * otherwise return an array with the non compleded required params or false in case of error
 * @param {object} oResult
 * @param {object} oFormDefinition
 * @returns {Array|Boolean}
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.isResultValid = function (oResult, oFormDefinition) {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.isResultValid');

    if (!goog.isDefAndNotNull(oResult)) {
        console.error('oResult not defined');
        return false;
    }
    if (!goog.isDefAndNotNull(oFormDefinition)) {
        console.error('oFormDefinition not defined');
        return false;
    }

    var aUnregistredFields = [];
    var rows = oFormDefinition['insert']['rows'];

    for (var i = 0; i < rows.length; i++) {
        for (var ii = 0; ii < rows[i]['fields'].length; ii++) {
            if (rows[i]['fields'][ii]['required'] === true) {
                if (!goog.isDefAndNotNull(oResult[rows[i]['fields'][ii]['name']]) || oResult[rows[i]['fields'][ii]['name']] === "") {

                    // Si le label est renseigné, communique le label, sinon le nom
                    if (goog.isString(rows[i]['fields'][ii]['label']) && rows[i]['fields'][ii]['label'] !== "")
                        aUnregistredFields.push(rows[i]['fields'][ii]['label'] + '(' + rows[i]['fields'][ii]['name'] + ')');
                    else
                        aUnregistredFields.push(rows[i]['fields'][ii]['name']);
                }
            }
        }
    }

    if (aUnregistredFields.length === 0)
        return true;
    else
        return aUnregistredFields;
};

/**
 * Reload oInsertObject.oFormDefinition and oInsertObject.oFormValues
 * @export
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.updateInsertForm = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.updateInsertForm');

    var this_ = this;
    var $scope = this.$scope_;
    var $q = this.$q_;

    var oFormReaderScope = this.getEditFormReaderScope();
    var boId = $scope['selectedBoId'];

    // Vide les variables oInsertObject
    $scope['oInsertObject']['oResult'] = {};
    $scope['oInsertObject']['sGeomColumn'] = null;
    $scope['oInsertObject']['sGeomType'] = null;
    $scope['oInsertObject']['business_object_id'] = null;
    $scope['oInsertObject']['oFormDefinition'] = {};
    $scope['oInsertObject']['oFormValues']['insert'] = {};

    // Vide les features ayant pu être dessinées
    this.oOverlayFeatures_.clear();

    // Rafraichit le formReader
    if (goog.isDefAndNotNull(oFormReaderScope))
        oFormReaderScope['ctrl']['refreshForm']();

    var bRequestOk = false;
    var canceler = $q.defer();
    showAjaxLoader();
    ajaxRequest({
        'method': 'GET',
        'url': oVmap['properties']['api_url'] + '/vmap/businessobjects/' + boId,
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'scope': this.$scope_,
        'abord': canceler.promise,
        'success': function (response) {

            bRequestOk = true;

            if (!goog.isDef(response['data'])) {
                bootbox.alert("response['data'] undefined");
                $scope['selectedBoId'] = "";
                return 0;
            }
            if (goog.isDef(response['data']['errorMessage'])) {
                bootbox.alert(response['data']['errorType'] + ': ' + response['data']['errorMessage']);
                $scope['selectedBoId'] = "";
                return 0;
            }
            if (!goog.isDefAndNotNull(response['data']['data'])) {
                bootbox.alert('Aucune valeur retournée, impossible de charger le formulaire correspondant à la couche');
                $scope['selectedBoId'] = "";
                return 0;
            }
            if (!goog.isDefAndNotNull(response['data']['data'][0]['json_form'][0])) {
                bootbox.alert('Impossible de charger le formulaire correspondant à la couche');
                $scope['selectedBoId'] = "";
                return 0;
            }

            // Formulaire
            $scope['oInsertObject']['oFormDefinition'] = response['data']['data'][0]['json_form'][0];
            $scope['oInsertObject']['oFormDefinition_js'] = response['data']['data'][0]['json_form_js'];
            $scope['oInsertObject']['add_form_size'] = response['data']['data'][0]['add_form_size'];

            // sBusinessObjectID
            $scope['oInsertObject']['sBusinessObjectID'] = boId;

            // Champs comtenant la géométrie
            if (goog.isDef(response['data']['data'][0]['geom_column']))
                $scope['oInsertObject']['sGeomColumn'] = response['data']['data'][0]['geom_column'];
            if (goog.isDef(response['data']['data'][0]['geom_type']))
                $scope['oInsertObject']['sGeomType'] = response['data']['data'][0]['geom_type'];

            if ($scope['oInsertObject']['sGeomType'] === 'GEOMETRYCOLLECTION') {
                this_['addPartGeomType'] = '';
            } else if ($scope['oInsertObject']['sGeomType'] === 'POLYGON' || $scope['oInsertObject']['sGeomType'] === 'MULTIPOLYGON') {
                this_['addPartGeomType'] = 'Polygon';
            } else if ($scope['oInsertObject']['sGeomType'] === 'LINESTRING' || $scope['oInsertObject']['sGeomType'] === 'MULTILINESTRING') {
                this_['addPartGeomType'] = 'LineString';
            } else if ($scope['oInsertObject']['sGeomType'] === 'POINT' || $scope['oInsertObject']['sGeomType'] === 'MULTIPOINT') {
                this_['addPartGeomType'] = 'Point';
            }

            // Ajout du bouton caché submit
            $scope['oInsertObject']['oFormDefinition']['insert']['rows'].push({
                "fields": [{
                        "type": "button",
                        "class": "btn-ungroup btn-group-sm",
                        "nb_cols": 12,
                        "buttons": [{
                                "visibleAllTabs": true,
                                "type": "submit",
                                "label": "Sauvegarder",
                                "name": "form_submit",
                                "class": "btn-primary hidden",
                                "id": "basictools-insert-form-reader-submit-btn"
                            }
                        ]
                    }
                ]
            });
            $scope['oInsertObject']['oFormDefinition']['insert']['event'] = function () {
                $scope.isFormValid_ = true;
            };

            // Rafraichit le formulaire
            oFormReaderScope['ctrl']['refreshForm']();

        },
        'error': function (response) {
            $scope['selectedBoId'] = "";
            bootbox.alert(response);
        }
    });

    // Montre le message d'annulation de la requete si celle-ci n'est pas terminée apres un timeout
    var showCancelRequestMessageAfterTimeout = function () {
        setTimeout(function () {
            if (bRequestOk === false) {
                bootbox.confirm('Annuler la requête ?', function (result) {
                    if (result === true) {
                        canceler.resolve();
                        hideAjaxLoader();
                        $scope['selectedBoId'] = "";
                    } else {
                        showCancelRequestMessageAfterTimeout();
                    }
                });
            }
        }, 5000);
    };
    showCancelRequestMessageAfterTimeout();
};

/**
 * Get the Edit Form reader scope
 * @returns {angular.scope}
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.getEditFormReaderScope = function () {
    return angular.element($('#basictools-insert-form-reader').children()).scope();
};



// Edition de la géométrie

/**
 * Set the drawTool
 * @param {string} type (Point, Line, Rectangle, Polygon, Circle, Edit, Delete)
 * @param {boolean} isActive true if the selection is already active
 * @returns {Number}
 * @export
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.startInsertion = function (type, isActive) {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolControlle.startInsertion');

    // Supprime les interractions
    oVmap.getMap().removeActionsOnMap();

    // Cache la tooltip
    oVmap.getMap().getMapTooltip().hide();

    if (isActive === true)
        return 0;

    // inserPoint, insertPolygon, insertLine, insertCircle
    if (type.substr(0, 6) === 'insert') {

        //Ajoute la tooltip
        oVmap.getMap().getMapTooltip().displayMessage('Cliquez pour commencer à dessiner');

        // Ajoute l'interraction
        this.startDrawing(type.substr(6));

    } else if (type === 'editFeature') {

        //Ajoute la tooltip
        oVmap.getMap().getMapTooltip().displayMessage('Cliquez sur un dessin pour le modifier');

        // Ajoute l'interraction
        oVmap.getMap().setInteraction(this.modify_, 'basicTools-insert-' + type);

    } else if (type === 'deleteFeature') {

        //Ajoute la tooltip
        oVmap.getMap().getMapTooltip().displayMessage('Cliquez sur un dessin pour le supprimer');

        // Ajoute l'interraction
        oVmap.getMap().setInteraction(this.delete_, 'basicTools-insert-' + type);

    } else if (type === 'addHole') {

        //Ajoute la tooltip
        oVmap.getMap().getMapTooltip().displayMessage('Dessinez un polygone à l\'intérieur d\'un autre pour créer un trou');

        // Ajoute l'interraction (reliée à aucune featureCollection)
        this.draw_ = oVmap.getMap().setDrawInteraction({
            type: 'Polygon'
        }, 'basicTools-insert-' + type);

        // Copie les features présentes avant le dessin
        var aFeatures = goog.array.clone(this.oOverlayFeatures_.getArray());
        var aFeaturesCopy = [];

        for (var i = 0; i < aFeatures.length; i++) {
            if (aFeatures[i].getGeometry().getType() === 'Polygon') {
                aFeaturesCopy.push(aFeatures[i]);
            } else if (aFeatures[i].getGeometry().getType() === 'MultiPolygon') {
                var aPolygons = goog.array.clone(aFeatures[i].getGeometry().getPolygons());
                for (var ii = 0; ii < aPolygons.length; ii++) {
                    aFeaturesCopy.push(new ol.Feature({
                        geometry: aPolygons[ii]
                    }));
                }
            }
        }
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
                        bootbox.alert('Trou non valide: il doit être contenu dans un polygone dessiné');
                    } else {
                        this.oOverlayLayer_.getSource().clear();
                        this.oOverlayLayer_.getSource().addFeatures(aFeaturesCopy);
                    }

                }, this);

    } else if (type === 'deleteHole') {

        //Ajoute la tooltip
        oVmap.getMap().getMapTooltip().displayMessage("Cliquez dans un trou pour le supprimer");

        // Ajoute les trous dans la couche oOverlayHolesLayer_
        this.addHolesIntoHolesLayer();

        // Ajoute l'interraction de suppresion des trous
        oVmap.getMap().setInteraction(this.deleteHole_, 'basicTools-insert-' + type);

    } else {
        console.error('startSelection: type (' + type + ') not allowed');
        return 0;
    }
};

/**
 * This function add the holes contained into oOverlayLayer_ to oOverlayHolesLayer_
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.addHolesIntoHolesLayer = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.addHolesIntoHolesLayer');

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
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.deleteHole = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.deleteHole');

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
    }
};

/**
 * Start the drawing experience
 * @param {ol.geom} type geometry type
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.startDrawing = function (type) {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.startDrawing');

    // Lance setDrawInteraction avec this.oOverlayFeatures_ comme cible pour les features
    this.draw_ = oVmap.getMap().setDrawInteraction({
        type: type,
        features: this.oOverlayFeatures_
    }, 'basicTools-insert-insert' + type);


    this.draw_.on('drawend',
            function (evt) {
                // Si la géométrie est un cercle, alors elle est remplacée par un polygone à 32 côtés
                var feature = evt.feature;
                if (feature.getGeometry() instanceof ol.geom.Circle) {
                    var circleGeom = feature.getGeometry();
                    var polygonGeom = new ol.geom.Polygon.fromCircle(circleGeom);
                    feature.setGeometry(polygonGeom);
                }
            }, this);
};

/**
 * Update feature for scope.oInsertObject
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.updateInsertObjectFeature = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.updateInsertObjectFeature');

    var $scope = this.$scope_;
    var aOverlayFeatures = goog.array.clone(this.oOverlayFeatures_.getArray());
    var sGeomType = $scope['oInsertObject']['sGeomType'];

    // Transforme les cercles en polygones de 32 côtés
    for (var i = 0; i < aOverlayFeatures.length; i++) {
        if (aOverlayFeatures[i].getGeometry() instanceof ol.geom.Circle) {
            var circleGeom = aOverlayFeatures[i].getGeometry();
            var polygonGeom = new ol.geom.Polygon.fromCircle(circleGeom);
            aOverlayFeatures[i] = new ol.Feature({
                geometry: polygonGeom
            });
        }
    }

    // Transforme la feature en WKT
    var WKT = new ol.format.WKT();
    var WKTGeometry = "";

    if (aOverlayFeatures.length > 0) {

        if (sGeomType === 'MULTIPOINT') {

            var oMultiPoint = new ol.geom.MultiPoint();
            for (var i = 0; i < aOverlayFeatures.length; i++) {
                if (aOverlayFeatures[i].getGeometry().getType() === 'Point')
                    oMultiPoint.appendPoint(aOverlayFeatures[i].getGeometry());
            }
            var Feature = new ol.Feature({
                geometry: oMultiPoint
            });

        } else if (sGeomType === 'MULTILINESTRING') {

            var oMultiLineString = new ol.geom.MultiLineString();
            for (var i = 0; i < aOverlayFeatures.length; i++) {
                if (aOverlayFeatures[i].getGeometry().getType() === 'LineString')
                    oMultiLineString.appendLineString(aOverlayFeatures[i].getGeometry());
            }
            var Feature = new ol.Feature({
                geometry: oMultiLineString
            });

        } else if (sGeomType === 'MULTIPOLYGON') {

            var oMultiPolygon = new ol.geom.MultiPolygon();
            for (var i = 0; i < aOverlayFeatures.length; i++) {
                if (aOverlayFeatures[i].getGeometry().getType() === 'Polygon')
                    oMultiPolygon.appendPolygon(aOverlayFeatures[i].getGeometry());
            }
            var Feature = new ol.Feature({
                geometry: oMultiPolygon
            });

        } else {
            var Feature = aOverlayFeatures[0];
        }

        WKTGeometry = WKT.writeFeature(Feature, {
            dataProjection: this['map'].getView().getProjection().getCode(),
            featureProjection: this['map'].getView().getProjection().getCode()
        });
    }

    if (WKTGeometry === "") {
        console.error("WKTGeometry is empty");
        return 0;
    }

    // Transforme la feature en EWKT
    var EWKTGeometry = oVmap.getEWKTFromWKT(WKTGeometry, this['map'].getView().getProjection().getCode());

    // Écrit la géométrie WKT
    $scope['oInsertObject']['oFormValues']['insert'][$scope['oInsertObject']['sGeomColumn']] = EWKTGeometry;
    $scope['oInsertObject']['oResult'][$scope['oInsertObject']['sGeomColumn']] = EWKTGeometry;
};




// Submit

/**
 * Test if all the required params were completed and send the insert http request
 * @export
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.submitInsertion = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.submitInsertion');

    var this_ = this;
    var $scope = this.$scope_;

    var oResult = $scope['oInsertObject']['oResult'];
    var oFormDefinition = $scope['oInsertObject']['oFormDefinition'];
    var sBusinessObjectID = $scope['oInsertObject']['sBusinessObjectID'];

    var isResultValid = this.isResultValid(oResult, oFormDefinition);

    if (isResultValid === true) {

        this.sendInsertRequest(oResult, sBusinessObjectID);

    } else {

        if (goog.isArray(isResultValid)) {
            var alertMessage = "Votre requête n'a pas pu aboutir, les attributs suivants sont obligatoires: <br>";
            for (var i = 0; i < isResultValid.length; i++) {
                alertMessage = (i === 0 ? alertMessage : alertMessage + ', ');
                alertMessage += isResultValid[i];
            }
        } else {
            var alertMessage = "Votre requête n'a pas pu aboutir, certains attributs obligatoires n'ont pas étés renseignés";
        }

        bootbox['dialog']({
            'message': alertMessage,
            'buttons': {
                'cancel': {
                    'label': "Annuler",
                    'className': "btn-default"
                },
                'editAttr': {
                    'label': "Éditer les attributs",
                    'className': "btn-primary",
                    'callback': function () {
                        this_.displayEditFrom();
                    }
                }
            }
        });
    }

};

/**
 * Sent the insert http request
 * @param {object} oResult
 * @param {string} sBusinessObjectID
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.sendInsertRequest = function (oResult, sBusinessObjectID) {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.sendInsertRequest');

    if (!goog.isDefAndNotNull(oResult)) {
        console.error('oResult not defined');
        return 0;
    }
    if (!goog.isDefAndNotNull(sBusinessObjectID)) {
        console.error('sBusinessObjectID not defined');
        return 0;
    }

    var this_ = this;
    var data = this.getFormDataFromValues(oResult);

    showAjaxLoader();
    ajaxRequest({
        'method': 'POST',
        'url': oVmap['properties']['api_url'] + '/vmap/querys/' + sBusinessObjectID,
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'data': data,
        'scope': this.$scope_,
        'success': function (response) {

            if (!goog.isDef(response['data'])) {
                bootbox.alert("response['data'] undefined");
                return 0;
            }
            if (response['status'] !== 200) {
                if (response['status'] === 500) {
                    $.notify("Erreur interne du serveur", "error");
                } else {
                    if (goog.isDefAndNotNull(response['statusText'])) {
                        $.notify(response['statusText'], "error");
                    } else {
                        $.notify("Erreur " + response['status'], "error");
                    }
                }
                return 0;
            }
            if (goog.isDef(response['data']['errorMessage'])) {
                bootbox.alert(response['data']['errorType'] + ': ' + response['data']['errorMessage']);
                return 0;
            }

            if (response['data']['status'] === 1) {
                $.notify("Opération réalisée avec succès, les couches de la carte se mettent à jour", "info");
                // Recharge le formulaire
                this_.updateInsertForm();
                // Recharge la carte
                this_.reloadImpactedLayer(sBusinessObjectID);
                // Enlève l'outil en cours (insertion)
                oVmap.getToolsManager().getBasicTools().toggleOutTools();
            }
        }
    });
};

/**
 * Creates a FormData object from oValues
 * @param {object} oValues
 * @returns {FormData}
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.getFormDataFromValues = function (oValues) {
    oVmap.log('nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.getFormDataFromValues');

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



// Définit la directive et le controller
oVmap.module.directive('appInsert', nsVmap.nsToolsManager.Insert.prototype.inserttoolDirective);
oVmap.module.controller('AppInsertController', nsVmap.nsToolsManager.Insert.prototype.inserttoolController);
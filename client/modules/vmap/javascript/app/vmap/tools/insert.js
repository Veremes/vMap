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
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/' + (oVmap['properties']['is_mobile'] ? 'insert_mobile.html' : 'insert.html')
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
nsVmap.nsToolsManager.Insert.prototype.inserttoolController = function ($scope, $rootScope, $q, $element) {
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
     * Booléen représentant l'ouverture du SnapMenu
     */
    this['isSnapMenuCollapse'] = false;

    /**
     * Object contenant les diverses options de snapping
     */
    this['snapOptions'] = {
        'mode': 'segment_edge_node',
        'tolerance': 15,
        'limit': 2000,
        'visible': false
    };
    if (goog.isDefAndNotNull(oVmap['properties']['snapping'])) {
        this['snapOptions']['tolerance'] = oVmap['properties']['snapping']['defaut_tolerance'];
        this['snapOptions']['mode'] = oVmap['properties']['snapping']['defaut_snapp_mode'];
        this['snapOptions']['limit'] = oVmap['properties']['snapping']['defaut_limit'];
        this['snapOptions']['visible'] = oVmap['properties']['snapping']['defaut_visibility'];
    }

    /**
     * Object temporaire permettant l'édition des diverses options de snapping
     */
    this['tmpSnapOptions'] = angular.copy(this['snapOptions']);

    /**
     * Définit si l'échélle est dans la tranche allouée par l'objet métier
     */
    this['isMaxScaleOk'] = true;

    /**
     * Définit si l'échélle est dans la tranche allouée par l'objet métier
     */
    this['isMinScaleOk'] = true;

    /**
     * @type {ol.layer.Vector}
     * @private
     */
    this.oSnapOverlayLayer_ = new ol.layer.Vector({
        map: oVmap.getMap().getOLMap(),
        visible: false,
        source: new ol.source.Vector({
            useSpatialIndex: false
        }),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#1000ff',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 3,
                fill: new ol.style.Fill({
                    color: '#1000ff'
                })
            })
        }),
    });

    /**
     * @type {ol.interaction.Snap}
     * @private
     */
    this.snap_ = new ol.interaction.Snap({
        vertex: true,
        edge: (this['snapOptions']['mode'] === 'segment_edge_node' ? true : false),
        pixelTolerance: this['snapOptions']['tolerance'],
        source: this.oSnapOverlayLayer_.getSource()
    });

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
        this_.loadInsertableBos();
    });
    setTimeout(function () {
        this_.loadInsertableBos();
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
        // Supprime le snapping
        this_.oSnapOverlayLayer_.getSource().clear();
        oVmap.getMap().getOLMap().removeInteraction(this_.snap_);
    });

    this.oOverlayFeatures_.on('change:length', function () {
        $scope.$applyAsync(function () {
            $scope['featuresLength'] = this_.oOverlayFeatures_.getLength();
        });
    }, this);

    // Au changement d'objet métier en cours d'insertion
    this.$scope_.$watch('selectedBoId', function () {
        this_.updateInsertForm();
        this_.selectCurrentBoForSnapping();
    });

    // Affiche les modales en plein écran pour la version mobile
    if (oVmap['properties']['is_mobile']) {
        $element.find('.modal').on('shown.bs.modal', function () {
            $('.modal-backdrop.fade.in').hide();
            $('.modal.fade.in').find('.modal-dialog').addClass('mobile-full-modal');
        });
    }

    // Lance la fonction de rechargement à chaque fois qui l'utilisateur finit de bouger la carte
    oVmap.getMap().getOLMap().on('moveend', function () {
        this_.checkEditionScale();
        this_.loadVectorSnappingData();
    });
};

/**
 * Charge la liste des objets métier
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.loadInsertableBos = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.loadInsertableBos');
    var this_ = this;

    this.$scope_.$applyAsync(function () {
        setTimeout(function () {
            this_.$scope_['aInsertableBOs'] = oVmap.getMapManager().getInsertableBusinessObjects();

            // Mobile: cache le bouton "Insertion" si aucun bo est insertable
            if (goog.isDefAndNotNull(this_.$scope_['aInsertableBOs'])) {
                if (oVmap['properties']['is_mobile']) {
                    if (this_.$scope_['aInsertableBOs'].length > 0) {
                        $('#vmap_menu_mobile_menu_insert_button').show();
                    } else {
                        $('#vmap_menu_mobile_menu_insert_button').hide();
                    }
                }
            }
        });
    });

    this.checkEditionScale();
};

/**
 * Charge la liste des objets métier pour le snapping
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.selectCurrentBoForSnapping = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.selectCurrentBoForSnapping');
    var this_ = this;

    for (var i = 0; i < this_.$scope_['aInsertableBOs'].length; i++) {
        this_.$scope_['aInsertableBOs'][i]['loadCanceller'] = this_.$q_.defer();
        this_.$scope_['aInsertableBOs'][i]['isMouseOverSnaoMenuOb'] = false;
        this_.$scope_['aInsertableBOs'][i]['bo_snapping_loaded'] = null;
        if (this_.$scope_['aInsertableBOs'][i]['bo_id'] === this_.$scope_['selectedBoId']) {
            this_.$scope_['aInsertableBOs'][i]['bo_snapping_enabled'] = true;
        } else
            this_.$scope_['aInsertableBOs'][i]['bo_snapping_enabled'] = false;
    }

    this.checkEditionScale();
};

/**
 * Vérifie que l'échelle en cours respecte les spécification de l'objet métier
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.checkEditionScale = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.checkEditionScale');

    var oBo;
    for (var i = 0; i < this.$scope_['aInsertableBOs'].length; i++) {
        if (this.$scope_['aInsertableBOs'][i]['bo_id'] === this.$scope_['selectedBoId']) {
            oBo = this.$scope_['aInsertableBOs'][i];
            break;
        }
    }

    if (!goog.isDefAndNotNull(oBo)) {
        return;
    }

    var maxScale = oBo['bo_max_edition_scale'];
    var minScale = oBo['bo_min_edition_scale'];

    this['isMaxScaleOk'] = true;
    this['isMinScaleOk'] = true;

    if (this['currentAction'].substr(0, 18) === 'basicTools-insert-') {
        if (goog.isDefAndNotNull(minScale)) {
            minScale = parseFloat(minScale);
            if (oVmap.getMap().getScale() < minScale) {
                oVmap.getMap().getMapTooltip().displayMessage('Échelle minimale de saisie atteinte, dé-zoomez pour continuer');
                this['isMinScaleOk'] = false;
                if (this['addPartGeomType'] === 'Point') {
                    this.draw_.setActive(false);
                }
            } else {
                this['isMinScaleOk'] = true;
            }
        }
        if (goog.isDefAndNotNull(maxScale)) {
            maxScale = parseFloat(maxScale);
            if (oVmap.getMap().getScale() > maxScale) {
                oVmap.getMap().getMapTooltip().displayMessage('Échelle maximale de saisie atteinte, zoomez pour continuer');
                this['isMaxScaleOk'] = false;
                if (this['addPartGeomType'] === 'Point') {
                    this.draw_.setActive(false);
                }
            } else {
                this['isMaxScaleOk'] = true;
            }
        }
        if (this['isMinScaleOk'] && this['isMaxScaleOk']) {
            if (!this.draw_.getActive()) {
                this.draw_.setActive(true);
            }
            if (this.draw_.getActive()) {
                oVmap.getMap().getMapTooltip().displayMessage('Cliquez pour commencer à dessiner');
            }
        }
    }
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
                if (goog.isDefAndNotNull($scope['oInsertObject']['oResult'][$scope['oInsertObject']['sGeomColumn']])) {
                    var EWKTGeometry = angular.copy($scope['oInsertObject']['oResult'][$scope['oInsertObject']['sGeomColumn']]);
                }
                $scope['oInsertObject']['oResult'] = this_.getBOValuesFromFormValues($scope['oInsertObject']['oFormValues']);
                if (!goog.isDefAndNotNull($scope['oInsertObject']['oResult'][$scope['oInsertObject']['sGeomColumn']])) {
                    $scope['oInsertObject']['oResult'][$scope['oInsertObject']['sGeomColumn']] = EWKTGeometry;
                }
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
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.updateInsertForm = function (sBoId, callback) {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.updateInsertForm');

    var this_ = this;
    var $scope = this.$scope_;
    var $q = this.$q_;

    var oFormReaderScope = this.getEditFormReaderScope();
    var boId = goog.isDefAndNotNull(sBoId) ? sBoId : $scope['selectedBoId'];

    if (!goog.isDefAndNotNull(boId)) {
        return null;
    }

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

            // Modifie l'identifiant du formulaire
            response['data']['data'][0]['json_form'][0]['insert']['name'] = 'basictools-insert-form-reader-form';

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

            if (goog.isDefAndNotNull(callback)) {
                callback.call(this_);
            }

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

    var this_ = this;

    // Supprime les interractions
    oVmap.getMap().removeActionsOnMap();

    // Cache la tooltip
    oVmap.getMap().getMapTooltip().hide();

    // Supprime le snapping
    this.oSnapOverlayLayer_.getSource().clear();
    oVmap.getMap().getOLMap().removeInteraction(this.snap_);

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

    var this_ = this;
    this.draw_.on('drawend',
            function (evt) {
                // Si la géométrie est un cercle, alors elle est remplacée par un polygone à 32 côtés
                var feature = evt.feature;
                feature = this_.updateCircleGeoms(feature);
            }, this);


    // Empèche la saisie si l'échelle n'est pas bonne
    this.draw_.on('drawstart', function () {

        if (!this_['isMaxScaleOk']) {
            this_.draw_.removeLastPoint();
        }
        if (!this_['isMinScaleOk']) {
            this_.draw_.removeLastPoint();
        }

        var iNbPoints = 0;
        this_.draw_.sketchFeature_.on('change', function (event) {
            if (goog.isDefAndNotNull(event.target)) {
                if (goog.isDefAndNotNull(event.target.getGeometry)) {
                    var oGeom = event.target.getGeometry();
                    if (goog.isDefAndNotNull(oGeom.getType)) {
                        switch (oGeom.getType()) {
                            case 'LineString':
                            case 'MultiLineString':
                            case 'Point':
                            case 'MultiPoint':
                            case 'Polygon':
                            case 'MultiPolygon':
                                if (oGeom.getCoordinates().length > iNbPoints) {
                                    if (!this_['isMaxScaleOk']) {
                                        this_.draw_.removeLastPoint();
                                    }
                                    if (!this_['isMinScaleOk']) {
                                        this_.draw_.removeLastPoint();
                                    }
                                }
                                iNbPoints = oGeom.getCoordinates().length;
                                break;
                            default:

                                break;
                        }
                    }
                }
            }
        });
    });

    // Lance le snapping et vérifie l'échelle de saisie
    setTimeout(function () {
        this_.checkEditionScale();
        this_.loadVectorSnappingData();
    });
};

/**
 * Si la géométrie est un cercle, alors elle est remplacée par un polygone à 32 côtés
 * @param {ol.Feature} feature
 * @returns {ol.Feature}
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.updateCircleGeoms = function (feature) {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.updateCircleGeoms');

    if (feature.getGeometry() instanceof ol.geom.Circle) {
        var circleGeom = feature.getGeometry();
        var polygonGeom = new ol.geom.Polygon.fromCircle(circleGeom);
        feature.setGeometry(polygonGeom);
    }

    return feature;
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
                oVmap.getToolsManager().getBasicTools().hideMobileMenu();
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
        if (goog.isDefAndNotNull(oValues[key])) {
            if (goog.isDefAndNotNull(oValues[key]['aFiles'])) {
                oFormData_.append(key + '_attached_content', oValues[key]['aFiles'][0]);
                oFormData_.append(key, oValues[key]['aFiles'][0]['name']);
            } else {
                oFormData_.append(key, oValues[key]);
            }
        }
    }

    return oFormData_;
};




// Mobile

/**
 * Start the mobile insertion procedure
 * @param {string} sBoId
 * @export
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.mobileStartInsertion = function (sBoId) {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.mobileStartInsertion');

    var this_ = this;
    var $scope = this.$scope_;

    this.updateInsertForm(sBoId, function () {

        // Récupère le type de géométrie à inserrer: affiche une modale en cas de multiple types
        this_.getMobileBoGeomType_($scope['oInsertObject']).then(function (sGeomType) {

            // Commence la saisie géométrique
            oVmap.getToolsManager().getBasicTools().hideMobileMenu();
            oVmap.getMap().startMobileDraw(sGeomType, function (olFeature) {

                // En cas de feature multiples (multipolygon, multilinestring etc...)
                if (goog.isArray(olFeature)) {
                    for (var i = 0; i < olFeature.length; i++) {
                        olFeature[i] = this_.updateCircleGeoms(olFeature[i]);
                    }
                    this_.oOverlayLayer_.getSource().addFeatures(olFeature);
                } else {
                    olFeature = this_.updateCircleGeoms(olFeature);
                    this_.oOverlayLayer_.getSource().addFeature(olFeature);
                }

                setTimeout(function () {
                    // Affiche l'outil d'insertion (car la modale est dedans)
                    oVmap.getToolsManager().getBasicTools().displayAdvancedMobileMenu();
                    $('#vmap_menu_mobile_menu_insert').removeClass('collapse');

                    // Affiche le formulaire dans la modale
                    this_.displayEditFrom();
                });
            });
        });

    });
};

/**
 * Retourne le type de géométrie à inserrer en demandant à l'utilisateur en cas de multiples types supportés
 * @param {object} oInsertObject
 * @returns {defer.promise}
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.getMobileBoGeomType_ = function (oInsertObject) {
    oVmap.log('nsVmap.nsToolsManager.Insert.inserttoolController.getMobileBoGeomType_');

    var deferred = this.$q_.defer();
    var sGeomType = angular.copy(oInsertObject['sGeomType']);

    if (sGeomType === 'GEOMETRY' || sGeomType === 'GEOMETRYCOLLECTION') {
        bootbox.prompt({
            title: "Type de géométrie à insérer",
            inputType: 'select',
            inputOptions: [
                {
                    text: 'Point',
                    value: 'POINT'
                },
                {
                    text: 'Ligne',
                    value: 'LINESTRING'
                },
                {
                    text: 'Polygone',
                    value: 'POLYGON'
                },
                {
                    text: 'Cercle',
                    value: 'CIRCLE'
                }
            ],
            callback: function (result) {
                deferred.resolve(result);
            }
        });
    } else {
        setTimeout(function () {
            deferred.resolve(sGeomType);
        });
    }

    return deferred.promise;
};



// Snapping

/**
 * Show the snapping options modal
 * @export
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.showSnappingOptionsModal = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.showSnappingOptionsModal');

    this['tmpSnapOptions'] = angular.copy(this['snapOptions']);
    $('#vmap-insert-snap-options-modal').modal('show');
};

/**
 * Validate and hide the snapping options modal
 * @export
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.submitSnappingOptionsModal = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.submitSnappingOptionsModal');

    this['snapOptions'] = angular.copy(this['tmpSnapOptions']);

    oVmap.getMap().getOLMap().removeInteraction(this.snap_);
    this.snap_ = new ol.interaction.Snap({
        vertex: true,
        edge: (this['snapOptions']['mode'] === 'segment_edge_node' ? true : false),
        pixelTolerance: this['snapOptions']['tolerance'],
        source: this.oSnapOverlayLayer_.getSource()
    });
    oVmap.getMap().getOLMap().addInteraction(this.snap_);

    $('#vmap-insert-snap-options-modal').modal('hide');

    this.checkEditionScale();
    this.loadVectorSnappingData();
};

/**
 * Reset snapping option to default values
 * @export
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.resetSnapOptions = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.resetSnapOptions');

    if (goog.isDefAndNotNull(oVmap['properties']['snapping'])) {
        this['tmpSnapOptions']['tolerance'] = oVmap['properties']['snapping']['defaut_tolerance'];
        this['tmpSnapOptions']['mode'] = oVmap['properties']['snapping']['defaut_snapp_mode'];
        this['tmpSnapOptions']['limit'] = oVmap['properties']['snapping']['defaut_limit'];
        this['tmpSnapOptions']['visible'] = oVmap['properties']['snapping']['defaut_visibility'];
    }
    this.submitSnappingOptionsModal();
};

/**
 * Selector function to only reload object when needed
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.loadVectorSnappingData = function () {
    oVmap.log('nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.loadVectorSnappingData');

    var this_ = this;
    var oBo = null;
    this_.oSnapOverlayLayer_.setVisible(this_['snapOptions']['visible']);
    this_.oSnapOverlayLayer_.getSource().clear();
    this_.checkEditionScale();
    oVmap.getMap().getOLMap().removeInteraction(this_.snap_);

    setTimeout(function () {
        if (goog.isDefAndNotNull(this_['currentAction'])) {
            if (this_['currentAction'].substr(0, 18) === 'basicTools-insert-') {
                if (this_['isMaxScaleOk'] && this_['isMinScaleOk']) {

                    for (var i = 0; i < this_.$scope_['aInsertableBOs'].length; i++) {
                        oBo = this_.$scope_['aInsertableBOs'][i];
                        this_.stopLoadingBoVectorSnappingData(oBo);
                        this_.loadBoVectorSnappingData(oBo);
                    }
                    for (var i = 0; i < oBo.length; i++) {
                        if (oBo[i]['bo_snapping_loaded'] === null) {
                            oBo[i]['bo_snapping_enabled'] = false;
                        }
                    }
                    oVmap.getMap().getOLMap().addInteraction(this_.snap_);
                }
            }
        }
    });
};

/**
 * Retrieve the object given in parameter with ajaxRequest
 * @param {type} oBo
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.loadBoVectorSnappingData = function (oBo) {
    oVmap.log('nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.loadBoVectorSnappingData');

    var this_ = this;
    var bo_id = oBo['bo_id'];
    var aFeatures = [];
    var geom = null;
    var extent = oVmap.getMap().getOLMap().getView().calculateExtent(oVmap.getMap().getOLMap().getSize());
    var polygonGeom = new ol.geom.Polygon.fromExtent(extent);
    if (oBo['bo_snapping_enabled'] === true) {
        oBo['bo_snapping_loaded'] = false;
        ajaxRequest({
            'method': 'POST',
            'url': oVmap['properties']['api_url'] + '/vmap/querys/' + bo_id + '/geometry',
            'headers': {
                'X-HTTP-Method-Override': 'GET',
                'Accept': 'application/x-vm-json'
            },
            'data': {
                'intersect_geom': oVmap.getEWKTFromGeom(polygonGeom),
                'snapping_limit': this_['snapOptions']['snappingObjectsLimit'],
                'snapping_mode': this_['snapOptions']['mode']
            },
            'ajaxLoader': false,
            'abord': oBo['loadCanceller'].promise,
            'scope': this.$scope_,
            'success': function (response) {
                if (!goog.isDefAndNotNull(response['data'])) {
                    oBo['bo_snapping_loaded'] = null;
                    return 0;
                }
                if (goog.isDefAndNotNull(response['data']['errorMessage'])) {
                    console.error(response['data']['errorMessage']);
                    oBo['bo_snapping_loaded'] = null;
                    return 0;
                }
                if (response['data'][0]['count'] > this_['snapOptions']['snappingObjectsLimit']) {
                    oBo['bo_snapping_loaded'] = null;
                    var text = 'Limit de points atteinte pour object ';
                    text += oBo['bo_title'];
                    $.notify(text, "warn");
                    return 0;
                }
                oBo['bo_snapping_loaded'] = true;
                for (var i = 0; i < response['data'].length; i++) {
                    if (goog.isDefAndNotNull(response['data'][i]['geom'])) {
                        geom = response['data'][i]['geom'];
                        aFeatures.push(new ol.Feature({
                            geometry: oVmap.getGeomFromEWKT(geom)
                        }));
                    }
                }
                this_.oSnapOverlayLayer_.getSource().addFeatures(aFeatures);
            },
            'error': function (response) {
                oBo['bo_snapping_loaded'] = null;
            }
        });
    }
};

/**
 * Cancel request with a resolve callback
 * @param {type} oBo
 */
nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.stopLoadingBoVectorSnappingData = function (oBo) {
    oVmap.log('nsVmap.nsToolsManager.Insert.prototype.inserttoolController.prototype.stopLoadingBoVectorSnappingData');
    var this_ = this;
    if (goog.isDefAndNotNull(oBo['loadCanceller'])) {
        oBo['loadCanceller'].resolve();
        oBo['loadCanceller'] = this_.$q_.defer();
        oBo['bo_snapping_loaded'] = null;
    }
};

// Définit la directive et le controller
oVmap.module.directive('appInsert', nsVmap.nsToolsManager.Insert.prototype.inserttoolDirective);
oVmap.module.controller('AppInsertController', nsVmap.nsToolsManager.Insert.prototype.inserttoolController);

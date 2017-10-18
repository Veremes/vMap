/* global goog, nsVmap, oVmap, ol, angular, bootbox */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.nsModules.Cadastre
 * cette classe permet l'initialisation du module cadastre
 */
goog.provide('nsVmap.nsToolsManager.nsModules.Cadastre');

goog.require('oVmap');

goog.require('ol.geom.Point');
goog.require('ol.format.WKT');
goog.require('ol.Feature');
goog.require('ol.source.Vector');
goog.require('ol.layer.Vector');
goog.require('ol.Collection');

/**
 * @classdesc
 * Class {@link nsVmap.nsToolsManager.nsModules.Cadastre}: Add the cadastre tools defined in data/tools.json
 * @param {object} opt_options options
 * @constructor
 * @export 
 */
nsVmap.nsToolsManager.nsModules.Cadastre = function (opt_options) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre');
};
goog.exportProperty(nsVmap.nsToolsManager.nsModules, 'Cadastre', nsVmap.nsToolsManager.nsModules.Cadastre);

/**
 * Check all the rows in a table and reset the view
 * @param {string} table table html identifier
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.tableCheckAll = function (table) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.tableCheckAll');

    $(table).bootstrapTable('checkAll');
    $(table).bootstrapTable('toggleView');
    $(table).bootstrapTable('toggleView');
};

/**
 * Uncheck all the rows in a table and reset the view
 * @param {string} table table html identifier
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.tableUncheckAll = function (table) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.tableCheckAll');

    $(table).bootstrapTable('uncheckAll');
    $(table).bootstrapTable('toggleView');
    $(table).bootstrapTable('toggleView');
};

/**
 * App-specific directive wrapping the cadastre tools. The directive's
 * controller has a property "map" including a reference to the OpenLayers
 * map.
 *
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreDirective = function () {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreDirective");
    return {
        restrict: 'C',
        scope: {
            'map': '=appMap',
            'lang': '=appLang',
            'selection': '=appInfos',
            'currentAction': '=appAction'
        },
        controller: 'AppcadastreController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/modules/cadastre.html'
    };
};

/**
 * Cadastre controller
 * @param {object} $scope
 * @export
 * @constructor
 * @ngInject
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController = function ($scope, $sce) {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController");

    /**
     * Limite des valeurs sélectionnables
     */
    this.limit = 100;

    if (goog.isDefAndNotNull(oVmap['properties']['cadastre'])) {
        if (goog.isDefAndNotNull(oVmap['properties']['cadastre']['selection_limit'])) {
            this.limit = oVmap['properties']['cadastre']['selection_limit'];
        }
    }

    /**
     * @type {ol.interaction.Draw}
     * @private
     */
    this.draw_;

    /**
     * Query buffer in mm on screen (look postgis st_buffer for more information)
     * @type integer
     */
    this.buffer_ = oVmap['properties']["cadastre"]["selection_buffer"];

    /**
     * temp for bootstrap table
     * type {array<object>}
     */
    this.bootstrapTableTemp = [];

    this['isCadastreLightUser'] = sessionStorage['privileges'].indexOf('vmap_cadastre_user') === -1 && sessionStorage['privileges'].indexOf('vmap_cadastre_light_user') !== -1;

    /**
     * Current mode
     * @type {string}
     */
    this['currentMode'] = '';

    /**
     * Current parcelle mode
     * @type {string}
     */
    this['currentParcelleMode'] = '';

    /**
     * Current mode
     * @type {string}
     */
    this['searchOnMapCurrentMode'] = '';

    /**
     * Current parcelle mode
     * @type {string}
     */
    this['searchOnMapCurrentDrawMode'] = '';

    /**
     * temp variable witch contains id_par
     * @type {string}
     */
    this['tmpID_PAR'] = '';

    /**
     * temp variable witch contains id_par
     * @type {string}
     */
    this['tmpID_DNUPRO'] = '';

    /**
     * @private
     */
    this.$scope_ = $scope;

    /**
     * @private
     */
    this.$sce_ = $sce;

    /**
     * Infos sur la parcelle à décrire dans la fiche descriptive
     * @type {object}
     */
    this['oParcelleInfos'] = {};

    /**
     * Tableau des communes
     * @type {object}
     */
    this['aCommunes'] = [];

    /**
     * Tableau des sections
     * @type {array<object>}
     */
    this['aSections'] = [];

    /**
     * Tableau des adresses
     * @type {array<object>}
     */
    this['aAdresses'] = [];

    /**
     * Définit si la sélection est multiple ou pas
     * @type {boolean}
     */
    this['locationMultiple'] = false;

    this['tablesSelection'] = {
        '#Cadastre-rapports-table-parcelle': [],
        '#Cadastre-rapports-table-comptes': []
    };

    /**
     * List of the form elements
     * @type {array}
     * @private
     */
    this.aFormList_ = [];

    /**
     * Number of elemnts on the aFormList_ displayed
     * @type {integer}
     * @private
     */
    this.aFormElementsDisplayed_ = 0;

    /**
     * Projection of the cadastre database
     * @type {string}
     * @private
     */
    this.cadastreProjection_ = oVmap['properties']['cadastre']['database_projection'];

    /**
     * Name of the cadastre api
     * @type string
     * @private
     */
    this['cadastreAPI_'] = oVmap["properties"]["cadastre"]["api"];

    // Charge les communes
    this.getBaseElem(oVmap["properties"]["cadastre"]["api"] + '/communes', 'aCommunes', '', 'nom');

    $('#Section-table-section').bootstrapTable({data: {}});
    $('#Lieu-dit-table-lieu-dit').bootstrapTable({data: {}});
    $('#Parcelle-table-parcelle').bootstrapTable({data: {}});
    // $('#Parcelle-par-adresse-DGFiP-table-voie').bootstrapTable({data:{}});
    // $('#Parcelle-par-proprietaire-table-proprietaire').bootstrapTable({data:{}});
    $('#Parcelle-par-proprietaire-table-comptes').bootstrapTable({data: {}});
    $('#Parcelle-par-proprietaire-table-parcelles').bootstrapTable({data: {}});
    // $('#Bati-par-proprietaire-table-proprietaire').bootstrapTable({data:{}});
    $('#Bati-par-proprietaire-table-comptes').bootstrapTable({data: {}});
    $('#Bati-par-proprietaire-table-invariants').bootstrapTable({data: {}});
    $('#Bati-par-proprietaire-table-parcelles').bootstrapTable({data: {}});

    // Donne au bouton dropdown la valeur qui lui correspond
    $(".dropdown-menu-auto li a").click(function () {
        var selText = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle').find('div').html(selText);
        $('.inactive').removeClass('active');
    });

    $scope['parseFloat'] = function (value) {
        return parseFloat(value);
    };
    $scope['trim'] = function (value) {
        return value.trim();
    };
    $scope['isLink'] = function (sString) {
        return oVmap.isLink(sString, 'link');
    };
    $scope['getRenderedParsedLink'] = function (sString) {
        sString = oVmap.parseLink(sString, 'link');
        return $sce.trustAsHtml(sString);
    };
};

/**
 * Add a item to the Card (selection)
 * @param {string} type (commune/section/lieuDit/parcelle/bati)
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addToCard = function (type) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addToCard');
    oVmap.log('addToCard: ' + type);

    var this_ = this;

    // timeout le temps que le curçeur se mette à wait
    setTimeout(function () {

        if (type === "commune") {

            this_.selectCommuneForm('#Commune-select-commune');

        } else if (type === "section") {

            this_.selectSectionForm('#Section-select-commune', '#Section-table-section');

        } else if (type === "lieuDit") {

            this_.selectLieuDitForm('#Lieu-dit-select-commune', '#Lieu-dit-table-lieu-dit');

        } else if (type === "parcelle") {

            oVmap.log('addToCard: ' + this_['currentParcelleMode']);
            if (this_['currentParcelleMode'] === 'section') {

                this_.selectParcelleBySectionForm('#Parcelle-select-commune',
                        '#Parcelle-select-section',
                        '#Parcelle-table-parcelle');

            } else if (this_['currentParcelleMode'] === 'adresse') {

                this_.selectParcelleByAdresse('#Parcelle-par-adresse-DGFiP-select-commune',
                        '#Parcelle-par-adresse-DGFiP-table-voie',
                        '#Parcelle-par-adresse-DGFiP-select-adresse');

            } else if (this_['currentParcelleMode'] === 'proprietaire') {

                this_.selectParcelleByProprietaire('#Parcelle-par-proprietaire-select-commune',
                        '#Parcelle-par-proprietaire-table-proprietaire',
                        '#Parcelle-par-proprietaire-table-comptes',
                        '#Parcelle-par-proprietaire-table-parcelles');
            }

        } else if (type === "bati") {

            this_.selectBatiByProprietaire('#Bati-par-proprietaire-select-commune',
                    '#Bati-par-proprietaire-table-proprietaire',
                    '#Bati-par-proprietaire-table-comptes',
                    '#Bati-par-proprietaire-table-invariants',
                    '#Bati-par-proprietaire-table-parcelles');
        }
    }, 100);
};

/**
 * Add a item to the location
 * @param {string} type (commune/section/lieuDit/parcelle/bati)
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.locateSelection = function (type) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.locateSelection');

    if (type === "commune") {

        this.localiseFromSelect(oVmap["properties"]["cadastre"]["api"] + '/communes', 'id_com', '#Commune-select-commune');

    } else if (type === "section") {

        this.localiseFromTable(oVmap["properties"]["cadastre"]["api"] + '/sections', 'id_sec', '#Section-table-section');

    } else if (type === "lieuDit") {

        this.localiseFromTable(oVmap["properties"]["cadastre"]["api"] + '/lieudits', 'oid', '#Lieu-dit-table-lieu-dit');

    } else if (type === "parcelle") {

        oVmap.log(this['currentParcelleMode']);

        if (this['currentParcelleMode'] === 'section') {

            this.localiseFromTable(oVmap["properties"]["cadastre"]["api"] + '/parcelles', 'id_par', '#Parcelle-table-parcelle');

        } else if (this['currentParcelleMode'] === 'adresse') {

            this.localiseParcelleByAdresse('#Parcelle-par-adresse-DGFiP-table-voie', '#Parcelle-par-adresse-DGFiP-select-adresse');

        } else if (this['currentParcelleMode'] === 'proprietaire') {

            this.localiseFromTable(oVmap["properties"]["cadastre"]["api"] + '/parcelles', 'id_par', '#Parcelle-par-proprietaire-table-parcelles', 'ID_PAR');

        }

    } else if (type === "bati") {

        this.localiseFromTable(oVmap["properties"]["cadastre"]["api"] + '/parcelles', 'id_par', '#Bati-par-proprietaire-table-parcelles');

    }
};

/**
 * Select the located elements
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectLocation = function () {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectLocation');

    var aLocatedFeatures = oVmap.getMap().getLocationOverlayFeatures().getArray();
    var tmpType = '';

    // Contiendra toutes les features de chache type
    var tempFeatures = {
        'commune': [],
        'section': [],
        'lieuDit': [],
        'parcelle': [],
        'bati': []
    };

    // Stocke toutes les features de chache type
    for (var i = 0; i < aLocatedFeatures.length; i++) {
        tmpType = aLocatedFeatures[i].get('type');
        tempFeatures[tmpType].push(aLocatedFeatures[i]);
    }

    // Ajoute les elements stockés au panier
    for (var typeItem in tempFeatures) {

        if (tempFeatures[typeItem].length > 0) {

            // Récupère les infos
            for (var i = 0; i < tempFeatures[typeItem].length; i++) {
                tempFeatures[typeItem][i] = tempFeatures[typeItem][i].get('infos');
            }

            if (typeItem === "commune") {

                // Crée l'onglet correspondant
                if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_commune') === undefined)
                    oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_commune', tabName: 'Commune', actions: ['zoom', 'delete']});

                this.addSelectionFromArray(oVmap["properties"]["cadastre"]["api"] + '/communes', 'id_com', tempFeatures[typeItem], 'id_com', 'veremes_cadastre_commune', function () {
                    oVmap.getToolsManager().getInfoContainer().showBar();
                    oVmap.getToolsManager().getInfoContainer().displayTabFeatures('veremes_cadastre_commune');
                });

            } else if (typeItem === "section") {

                // Crée l'onglet correspondant
                if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_section') === undefined)
                    oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_section', tabName: 'Section', actions: ['zoom', 'delete']});

                this.addSelectionFromArray(oVmap["properties"]["cadastre"]["api"] + '/sections', 'id_sec', tempFeatures[typeItem], 'id_sec', 'veremes_cadastre_section', function () {
                    oVmap.getToolsManager().getInfoContainer().showBar();
                    oVmap.getToolsManager().getInfoContainer().displayTabFeatures('veremes_cadastre_section');
                });

            } else if (typeItem === "lieuDit") {

                // Crée l'onglet correspondant
                if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_lieu_dit') === undefined)
                    oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_lieu_dit', tabName: 'Lieu-dit', actions: ['zoom', 'delete']});

                this.addSelectionFromArray(oVmap["properties"]["cadastre"]["api"] + '/lieudits', 'oid', tempFeatures[typeItem], 'oid', 'veremes_cadastre_lieu_dit', function () {
                    oVmap.getToolsManager().getInfoContainer().showBar();
                    oVmap.getToolsManager().getInfoContainer().displayTabFeatures('veremes_cadastre_lieu_dit');
                });

            } else if (typeItem === "parcelle") {

                // Crée l'onglet correspondant
                if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_parcelle') === undefined)
                    oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_parcelle', tabName: 'Parcelle', actions: ['zoom', 'delete']});

                this.addSelectionFromArray(oVmap["properties"]["cadastre"]["api"] + '/parcelles', 'id_par', tempFeatures[typeItem], 'id_par', 'veremes_cadastre_parcelle', function () {
                    oVmap.getToolsManager().getInfoContainer().showBar();
                    oVmap.getToolsManager().getInfoContainer().displayTabFeatures('veremes_cadastre_parcelle');
                });

            } else if (typeItem === "bati") {

                // Crée l'onglet correspondant à la parcelle
                if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_parcelle') === undefined)
                    oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_parcelle', tabName: 'Parcelle', actions: ['zoom', 'delete']});

                // Crée l'onglet correspondant
                if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_invariant') === undefined)
                    oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_invariant', tabName: 'Invariant', actions: ['delete']});

                // Ajoute les infos de l'invariant
                this.addSelectionFromArray(oVmap["properties"]["cadastre"]["api"] + '/invariants', 'ID_PAR', tempFeatures[typeItem], 'id_par', 'veremes_cadastre_invariant', function () {
                    oVmap.getToolsManager().getInfoContainer().showBar();
                    oVmap.getToolsManager().getInfoContainer().displayTabFeatures('veremes_cadastre_invariant');
                    oVmap.getToolsManager().getInfoContainer().displayTabByCode('veremes_cadastre_invariant');
                });

                // Ajoute les infos de la parcelle
                this.addSelectionFromArray(oVmap["properties"]["cadastre"]["api"] + '/parcelles', 'id_par', tempFeatures[typeItem], 'id_par', 'veremes_cadastre_parcelle', function () {
                    oVmap.getToolsManager().getInfoContainer().showBar();
                    oVmap.getToolsManager().getInfoContainer().displayTabFeatures('veremes_cadastre_parcelle');
                    oVmap.getToolsManager().getInfoContainer().displayTabByCode('veremes_cadastre_invariant');
                });

            }
        }
    }
};

/**
 * Select the cadastre infos on the map
 * @param {string} type Type of selection
 * @param {boolean} isActive true if the action is already active
 * @returns {Number}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.locateCadastreOnMap = function (type, isActive) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.locateCadastreOnMap');

    this.removeMapInteractions();

    if (isActive) {
        return 0;
    }

    if (this['searchOnMapCurrentMode'] === '')
        return 0;

    if (type === 'Point') {

        // Affiche la tooltip
        oVmap.getMap().getMapTooltip().displayMessage('Cliquer sur un point pour sélectionner');
        // Active l'évènement sur la carte		
        oVmap.getMap().setEventOnMap('singleclick', this.locateByPoint, this, 'cadastre-selectBy' + type);

    } else if (type === 'LineString') {

        // Affiche la tooltip
        oVmap.getMap().getMapTooltip().displayMessage('Dessiner une ligne pour sélectionner');
        this.locateByDrawing('LineString');

    } else if (type === 'Polygon') {

        // Affiche la tooltip
        oVmap.getMap().getMapTooltip().displayMessage('Dessiner un polygone pour sélectionner');
        this.locateByDrawing('Polygon');

    } else if (type === 'Circle') {

        // Affiche la tooltip
        oVmap.getMap().getMapTooltip().displayMessage('Dessiner un cercle pour sélectionner');
        this.locateByDrawing('Circle');

    }
};

/**
 * Select the cadastre infos on the map
 * @param {string} type Type of selection
 * @param {boolean} isActive true if the action is already active
 * @returns {Number}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectCadastreOnMap = function (type, isActive) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectCadastreOnMap');

    this.removeMapInteractions();

    if (isActive) {
        return 0;
    }

    if (type === 'FicheDescriptive') {

        // Change de mode
        this['searchOnMapCurrentMode'] = 'FicheDescriptive';
        // Affiche la tooltip
        oVmap.getMap().getMapTooltip().displayMessage('Cliquer sur un point pour générer la fiche descriptive');
        // Active l'évènement sur la carte		
        oVmap.getMap().setEventOnMap('singleclick', function (evt) {
            this.selectRapportOnMap(evt, 'ficheDescriptive');
        }, this, 'cadastre-' + type);

    }
    if (type === 'ReleveDePropriete') {

        // Change de mode
        this['searchOnMapCurrentMode'] = 'ReleveDePropriete';
        // Affiche la tooltip
        oVmap.getMap().getMapTooltip().displayMessage('Cliquer sur un point pour générer le relevé de propriété');
        // Active l'évènement sur la carte
        oVmap.getMap().setEventOnMap('singleclick', function (evt) {
            this.selectRapportOnMap(evt, 'releveDePropriete');
        }, this, 'cadastre-' + type);

    }
    if (type === 'FicheUrbanisme') {

        // Change de mode
        this['searchOnMapCurrentMode'] = 'FicheUrbanisme';
        // Affiche la tooltip
        oVmap.getMap().getMapTooltip().displayMessage('Cliquer sur un point pour générer la fiche d\'urbanisme');
        // Active l'évènement sur la carte
        oVmap.getMap().setEventOnMap('singleclick', function (evt) {
            this.selectRapportOnMap(evt, 'ficheUrbanisme');
        }, this, 'cadastre-' + type);

    }
};

/**
 * 
 * @param {event} evt
 * @param {string} type (ficheDescriptive/releveDePropriete/ficheUrbanisme
 * @returns {undefined}
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectRapportOnMap = function (evt, type) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectRapportOnMap');

    // Construction d'une feature en wkt dans la projection de la base
    var geometry = new ol.geom.Point(evt.coordinate);
    var EWKTGeometry = oVmap.getEWKTFromGeom(geometry);

    this['tmpID_PAR'] = '';
    this['tmpID_DNUPRO'] = '';

    var buffer = 0.01;
    var scale = oVmap.getMap().getScale();
    buffer = (this.buffer_ * scale) / 1000;

    // Trouve la parcelle correspondante
//    var filter = 'ST_Intersects(ST_Transform(ST_GeomFromEWKT(\'' + EWKTGeometry + '\'), ' + this.cadastreProjection_.substring(5) + '), geom)';
    var filter = {
        "column": "geom",
        "compare_operator": "intersect",
        "compare_operator_options": {
            "source_proj": this.cadastreProjection_.substring(5),
            "intersect_buffer": buffer,
            "intersect_buffer_geom_type": 'point'
        },
        "value": EWKTGeometry
    };

    var cadastreController = this;

    showAjaxLoader();
    ajaxRequest({
        'method': 'GET',
        'url': oVmap['properties']['api_url'] + '/' + oVmap['properties']['cadastre']['api'] + '/parcelles',
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'params': {
            'filter': filter,
            'limit': 1,
            'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
        },
        'scope': this.$scope_,
        'success': function (response) {

            // Vide les text features
            oVmap.getMap().getTextOverlayFeatures().clear();

            // Vérifie si il y a un résultat
            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                return 0;
            }

            // Vérifie si il y a un résultat
            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                oVmap.getMap().addTextOverlayFeature('Pas de données à afficher', evt.coordinate);
                return 0;
            }

            var data = response['data']['data'];

            if (data.length >= cadastreController.limit) {
                var sAlert = '<h4>Attention, vous avez atteint la limite d\'objects affichables sur la carte</h4>';
                bootbox.alert(sAlert);
            }

            var id_par = data[0]['id_par'];
            cadastreController['tmpID_PAR'] = id_par;

            // Vide la locatlisation
            if (cadastreController['locationMultiple'] === false)
                oVmap.getMap().getLocationOverlayFeatures().clear();

            // Ajoute la nouvelle localisation
            cadastreController.addLocationGeometries(data, 'parcelle', false);

            // Fiche descriptive de la parcelle
            if (type === 'ficheDescriptive')
                cadastreController.displayParcelleDescriptiveSheet(id_par);

            // Relevé de propriété
            if (type === 'releveDePropriete') {
                $('#releve-propriete-modal-menu').modal('show');
            }

            // Fiche d'urbanisme
            if (type === 'ficheUrbanisme') {
                cadastreController.displayUrbanismeSheet(id_par);
            }
            if (cadastreController['cadastreAPI_'] === "cadastre") {
                var param = "ID_PAR";
            } else {
                var param = "id_par";
            }

            // Récupère d'IDDNUPRO
            showAjaxLoader();
            ajaxRequest({
                'method': 'GET',
                'url': oVmap['properties']['api_url'] + '/' + oVmap['properties']['cadastre']['api'] + '/descriptionparcelles',
                'headers': {
                    'Accept': 'application/x-vm-json'
                },
                'params': {
//                    'filter': '"' + param + '"=\'' + id_par + '\'',
                    'filter': {
                        "column": param,
                        "compare_operator": "=",
                        "value": id_par
                    },
                    'limit': cadastreController.limit,
                    'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
                },
                'scope': cadastreController.$scope_,
                'success': function (response) {

                    // Vérifie si il y a un résultat
                    if (!goog.isDef(response['data']['data'])) {
                        console.error('Pas de données à afficher');
                        return 0;
                    }

                    var data = response['data']['data'];

                    if (data.length >= cadastreController.limit) {
                        var sAlert = 'Attention, vous avez atteint la limite d\'objects affichables sur la carte';
                        $.notify(sAlert, "warn");
                    }

                    cadastreController['tmpID_DNUPRO'] = data[0]['ID_DNUPRO'];
                }
            });
        }
    });
};

/**
 * Locate item by EWKT geometry
 * @param {string} WKTGeometry EWKT Geometry
 * @param {string} currentMode the current mode (parcelle/commune...)
 * @param {string} lastPointCoordinates last Point Coordinates
 * @returns {String}
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.locateByWKTGeom = function (EWKTGeometry, currentMode, lastPointCoordinates) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.locateByWKTGeom');

    var ressource = '';
    var cadastreController = this;

    var sGeomType = oVmap.getGeomFromEWKT(EWKTGeometry).getType();
    var buffer = null;
    if (sGeomType === 'Point' || sGeomType === 'LineString') {
        var scale = oVmap.getMap().getScale();
        buffer = (this.buffer_ * scale) / 1000;
    }

    // Réinitialise aFormList_
    this.aFormList_.length = 0;

    // Réinitialise aFormElementsDisplayed_
    this.aFormElementsDisplayed_ = 0;

//    var filter = 'ST_Intersects(ST_Transform(ST_GeomFromEWKT(\'' + EWKTGeometry + '\'), ' + this.cadastreProjection_.substring(5) + '), geom)';
    var filter = {
        "column": "geom",
        "compare_operator": "intersect",
        "compare_operator_options": {
            "source_proj": this.cadastreProjection_.substring(5)
        },
        "value": EWKTGeometry
    };

    if (goog.isDefAndNotNull(buffer)) {
        filter['compare_operator_options']['intersect_buffer'] = buffer;
        filter['compare_operator_options']['intersect_buffer_geom_type'] = 'point';
    }

    if (currentMode === 'commune') {
        // Sélection de la commune
        ressource = 'communes';
    } else if (currentMode === 'section') {
        // Sélection de la section
        ressource = 'sections';
    } else if (currentMode === 'lieuDit') {
        // Sélection du lieu dit
        ressource = 'lieudits';
    } else if (currentMode === 'parcelle') {
        // Sélection de la parcelle
        ressource = 'parcelles';
    } else if (currentMode === 'bati') {
        ressource = 'parcelles';
    } else {
        return 'mode non valide';
    }

    var limit = this.limit;
    if (sGeomType === 'Point') {
        limit = 1;
    }

    $('body').css({"cursor": "wait"});
    ajaxRequest({
        'method': 'POST',
        'url': oVmap['properties']['api_url'] + '/' + oVmap['properties']['cadastre']['api'] + '/' + ressource,
        'headers': {
            'Accept': 'application/x-vm-json',
            'X-HTTP-Method-Override': 'GET'
        },
        'data': {
            'filter': filter,
            'limit': limit,
            'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
        },
        'scope': this.$scope_,
        'success': function (response) {
            $('body').css({"cursor": ""});

            // Vide les text features
            oVmap.getMap().getTextOverlayFeatures().clear();

            // Vérifie si il y a un résultat
            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                oVmap.getMap().addTextOverlayFeature('Pas de données à afficher', lastPointCoordinates);
                return 0;
            }

            var data = response['data']['data'];

            if (data.length >= cadastreController.limit) {
                var sAlert = 'Attention, vous avez atteint la limite d\'objects affichables sur la carte';
                $.notify(sAlert, "warn");
            }

            // Vide la localisation
            if (cadastreController['locationMultiple'] === false) {
                oVmap.getMap().getLocationOverlayFeatures().clear();
            }

            // Ajoute la nouvelle localisation
            cadastreController.addLocationGeometries(data, currentMode, false);
        },
        'error': function (response) {
            $('body').css({"cursor": ""});
        }
    });
};

/**
 * Locate by point
 * @param {object} evt html event onclick
 * @returns {undefined}
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.locateByPoint = function (evt) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.locateByPoint');

    // Construction d'une feature en wkt dans la projection de la base
    var geometry = new ol.geom.Point(evt.coordinate);
    var EWKTGeometry = oVmap.getEWKTFromGeom(geometry);

    this.locateByWKTGeom(EWKTGeometry, this['searchOnMapCurrentMode'], evt.coordinate);
};

/**
 * Add the interaction of drawing for location
 * @param {ol.geom.GeometryType} type Type of draw
 * @returns {undefined}
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.locateByDrawing = function (type) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.locateByDrawing');

    this.draw_ = oVmap.getMap().setDrawInteraction({type: type}, 'cadastre-selectBy' + type);

    this.draw_.on('drawend',
            function (evt) {

                // Récupère la dernière feature ajoutée
                var feature = evt.feature;
                var EWKTGeometry = oVmap.getEWKTFromGeom(feature.getGeometry());

                // Localise le contenu
                this.locateByWKTGeom(EWKTGeometry, this['searchOnMapCurrentMode'], evt.feature.getGeometry().getLastCoordinate());
            }, this);
};

/**
 * In the 'Recherche avancée' menu, put Point mode selection by default
 * @param {string} searchOnMapCurrentMode
 * @returns {Number}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.searchOnMapInit = function (searchOnMapCurrentMode) {

    if (this['searchOnMapCurrentMode'] === searchOnMapCurrentMode) {
        this['searchOnMapCurrentMode'] = '';
        if (this['currentAction'] === 'cadastre-selectByPoint' || this['currentAction'] !== 'cadastre-selectByLineString' || this['currentAction'] !== 'cadastre-selectByPolygon')
            oVmap.getMap().removeActionsAndTooltips();
        return 0;
    }

    this['searchOnMapCurrentMode'] = searchOnMapCurrentMode;

    if (this['currentAction'] !== 'cadastre-selectByLineString' && this['currentAction'] !== 'cadastre-selectByPolygon' && this.currentAction !== 'cadastre-selectByPoint')
        this.locateCadastreOnMap('Point', this.currentAction === 'cadastre-selectByPoint');
};

/**
 * Init the tables
 * @param {rapports} rapports rapports div identifier 
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.initRapportsBootstrapTables = function (rapports) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.initRapportsBootstrapTables');

    var this_ = this;

    // initialise les tables de la fenêtre rapport
    if ($('#Cadastre-rapports-table-parcelle').bootstrapTable('getOptions').dataType === undefined) {
        $(rapports).find('[data-toggle="table"]').bootstrapTable({});

        // Rempli tablesSelection lorsque on clique sur une des lignes
        var tmp = Date.now();
        var setSelectedNumber = function (parcelleTable) {
            if (tmp > Date.now() - 100) {
                return null;
            }
            tmp = Date.now();
            setTimeout(function () {
                var aSelected = $(parcelleTable).bootstrapTable('getAllSelections');
                this_['tablesSelection'][parcelleTable] = aSelected;
            });
        };

        $('#Cadastre-rapports-table-parcelle').on('all.bs.table', function () {
            setSelectedNumber('#Cadastre-rapports-table-parcelle');
        });
        $('#Cadastre-rapports-table-comptes').on('all.bs.table', function () {
            setSelectedNumber('#Cadastre-rapports-table-comptes');
        });
    }

    // Vide les tables
    $(rapports).find('[data-toggle="table"]').bootstrapTable('load', []);

    if (this['selection'].length === 0) {

        goog.events.listenOnce(document.body, goog.events.EventType.CLICK, function (evt) {
            var text = 'Ajoutez d\'abord des données au panier';
            oVmap.displayTooltipError({target: '#cadastre-btn-container-actions-map-replace-card', type: 'top-left'}, text);
        });

        return 0;
    }

    this['show_veremes_cadastre_parcelle'] = false;
    this['show_veremes_cadastre_compte'] = false;

    for (var i = 0; i < this['selection'].length; i++) {
        if (this['selection'][i]['tabCode'] === 'veremes_cadastre_parcelle') {

            oVmap.log(this['selection'][i]['tableParams']['data']);

            this['show_veremes_cadastre_parcelle'] = true;

            $(rapports).find('#Cadastre-rapports-table-parcelle').bootstrapTable('load', this['selection'][i]['tableParams']['data']);
        }
        if (this['selection'][i]['tabCode'] === 'veremes_cadastre_compte') {
            this['show_veremes_cadastre_compte'] = true;
            $(rapports).find('#Cadastre-rapports-table-comptes').bootstrapTable('load', this['selection'][i]['tableParams']['data']);
        }
    }

    if (this['show_veremes_cadastre_parcelle'] || this['show_veremes_cadastre_compte']) {
        $('#rapports-modal').modal('show');
    } else {
        $.notify('Aucun rapport disponible pour cette sélection');
    }

};

/**
 * Display the fiche descriptive by a talbe
 * @param {string} parcelleTable parcelle table identifier
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayParcelleDescriptiveSheetByTable = function (parcelleTable) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayParcelleDescriptiveSheetByTable');

    var selectedParcelles = $(parcelleTable).bootstrapTable('getAllSelections');

    if (selectedParcelles.length !== 1) {
//        bootbox.alert('<h4>Veuillez sélectionner une unique parcelle</h4>');
        $.notify('Veuillez sélectionner une unique parcelle', 'info');
        return 0;
    }

    this.displayParcelleDescriptiveSheet(selectedParcelles[0]['id_par']);
};

/**
 * Display the fiche descriptive by id_par
 * @param {string} id_par id_par
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayParcelleDescriptiveSheet = function (id_par) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayParcelleDescriptiveSheet');

    // Ajoute la description de la parcelle
    var cadastreController = this;

    showAjaxLoader();
    ajaxRequest({
        'method': 'POST',
        'url': oVmap['properties']['api_url'] + '/' + oVmap['properties']['cadastre']['api'] + '/fichedescriptiveparcelle/' + id_par,
        'headers': {
            'Accept': 'application/x-vm-json',
            'X-HTTP-Method-Override': 'GET'
        },
        'data': {
            'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
        },
        'scope': this.$scope_,
        'success': function (response) {

            // Vérifie si il y a un résultat
            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                return 0;
            }
            var data = response['data']['data'];

            cadastreController['oParcelleInfos'] = data;

            cadastreController.displayParcelleDescriptiveSheet2();
        }
    });

};

/**
 * Function called after the displayParcelleDescriptiveSheet ajax http requests
 * @returns {Number}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayParcelleDescriptiveSheet2 = function () {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayParcelleDescriptiveSheet2');

    var data = this['oParcelleInfos'];

    /* Mise en page des données de la parcelle (le reste de la mise en page se fait dans cadastre.html)*/
    // Surface Géographique
    if (data['sup_fiscale'])
        data['sup_fiscale'] = parseFloat(data['sup_fiscale']) + ' m²';
    // Contenance
    if (data['DCNTPA'])
        data['DCNTPA'] = parseFloat(data['DCNTPA']) + ' m²';
    // Batie
    if (data['GPARBAT'] === '' || data['GPARBAT'] === ' ' || data['GPARBAT'] === 0 || data['GPARBAT'] === null)
        data['GPARBAT'] = 'N';
    else
        data['GPARBAT'] = 'O';
    // Urbaine
    if (data['GURBPA'] !== 'U')
        data['GURBPA'] = 'N';
    else
        data['GURBPA'] = 'O';

    // Propriétaires
    if (data['aProprietaires']) {
        for (var i = 0; i < data['aProprietaires'].length; i++) {
            data['aProprietaires'][i]['accordSexe'] = "(e)";

            data['aProprietaires'][i]['DQUALP'] = goog.isDefAndNotNull(data['aProprietaires'][i]['DQUALP']) ? data['aProprietaires'][i]['DQUALP'] : "";

            if (data['aProprietaires'][i]['DQUALP']) {
                data['aProprietaires'][i]['DQUALP'] = data['aProprietaires'][i]['DQUALP'].trim();
                if (data['aProprietaires'][i]['DQUALP'] === 'M')
                    data['aProprietaires'][i]['accordSexe'] = "";
                if (data['aProprietaires'][i]['DQUALP'] === 'MLE' || data['aProprietaires'][i]['DQUALP'] === 'MME')
                    data['aProprietaires'][i]['accordSexe'] = "e";
            }
        }
    }

    // Subdivision Fiscales
    if (data['aSubdivisionFiscale'])
        data['aSubdivisionFiscale']['totalDcntsf'] = 0;
    data['aSubdivisionFiscale']['totalDrcsuba'] = 0;
    data['aSubdivisionFiscale']['totalDrcsub'] = 0;

    for (var i = 0; i < data['aSubdivisionFiscale'].length; i++) {

        if (goog.isDefAndNotNull(data['aSubdivisionFiscale'][i]['DCNTSF']))
            data['aSubdivisionFiscale'][i]['DCNTSF'] = parseFloat(data['aSubdivisionFiscale'][i]['DCNTSF']) + ' m²';
        if (goog.isDefAndNotNull(data['aSubdivisionFiscale'][i]['DRCSUBA']))
            data['aSubdivisionFiscale'][i]['DRCSUBA'] = (Math.pow(10, -2) * parseFloat(data['aSubdivisionFiscale'][i]['DRCSUBA'])).toFixed(2) + ' €';
        if (goog.isDefAndNotNull(data['aSubdivisionFiscale'][i]['DRCSUB']))
            data['aSubdivisionFiscale'][i]['DRCSUB'] = (Math.pow(10, -2) * parseFloat(data['aSubdivisionFiscale'][i]['DRCSUB'])).toFixed(2) + ' €';


        if (goog.isDefAndNotNull(data['aSubdivisionFiscale'][i]['DCNTSF']))
            data['aSubdivisionFiscale']['totalDcntsf'] += parseFloat(data['aSubdivisionFiscale'][i]['DCNTSF']);
        if (goog.isDefAndNotNull(data['aSubdivisionFiscale'][i]['DRCSUBA']))
            data['aSubdivisionFiscale']['totalDrcsuba'] += parseFloat(data['aSubdivisionFiscale'][i]['DRCSUBA']);
        if (goog.isDefAndNotNull(data['aSubdivisionFiscale'][i]['DRCSUB']))
            data['aSubdivisionFiscale']['totalDrcsub'] += parseFloat(data['aSubdivisionFiscale'][i]['DRCSUB']);

    }

    if (goog.isDefAndNotNull(data['aSubdivisionFiscale']['totalDcntsf']))
        data['aSubdivisionFiscale']['totalDcntsf'] = parseFloat(data['aSubdivisionFiscale']['totalDcntsf']) + ' m²';
    if (goog.isDefAndNotNull(data['aSubdivisionFiscale']['totalDrcsuba']))
        data['aSubdivisionFiscale']['totalDrcsuba'] = parseFloat(data['aSubdivisionFiscale']['totalDrcsuba']).toFixed(2) + ' €';
    if (goog.isDefAndNotNull(data['aSubdivisionFiscale']['totalDrcsub']))
        data['aSubdivisionFiscale']['totalDrcsub'] = parseFloat(data['aSubdivisionFiscale']['totalDrcsub']).toFixed(2) + ' €';

    // Liens dans les intersections
//    var sLink;
//    if (goog.isArray(data['aIntersections'])) {
//        for (var i = 0; i < data['aIntersections'].length; i++) {
//            if (goog.isArray(data['aIntersections'][i]['data'])) {
//                for (var ii = 0; ii < data['aIntersections'][i]['data'].length; ii++) {
//                    for (var key in data['aIntersections'][i]['data'][ii]) {
//                        sLink = null;
//                        if (oVmap.isLink(data['aIntersections'][i]['data'][ii][key], 'link')) {
//                            data['aIntersections'][i]['data'][ii][key] = oVmap.parseLink(data['aIntersections'][i]['data'][ii][key], 'link');
//                            data['aIntersections'][i]['data'][ii][key] = this.$sce_.trustAsHtml(data['aIntersections'][i]['data'][ii][key]);
//                        }
//                    }
//                }
//            }
//        }
//    }

    this['oParcelleInfos'] = data;

    // Affiche la modale
    $('#descriptive-parcelle-sheet-modal').modal('show');

};

/**
 * Display the fiche descriptive by a talbe
 * @param {string} parcelleTable parcelle table identifier
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayUrbanismeSheetByTable = function (parcelleTable) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayUrbanismeSheetByTable');

    var selectedParcelles = $(parcelleTable).bootstrapTable('getAllSelections');

    if (selectedParcelles.length !== 1) {
//        bootbox.alert('<h4>Veuillez sélectionner une unique parcelle</h4>');
        $.notify('Veuillez sélectionner une unique parcelle', 'info');
        return 0;
    }

    this.displayUrbanismeSheet(selectedParcelles[0]['id_par']);
};

/**
 * Print the Urbanisme sheet by id_par
 * @param {string} id_par
 * @returns {Number}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayUrbanismeSheet = function (id_par) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayUrbanismeSheet');

    if (!goog.isDef(id_par))
        return 0;

    var this_ = this;

    showAjaxLoader();
    ajaxRequest({
        'method': 'POST',
        'url': oVmap['properties']['api_url'] + '/' + oVmap['properties']['cadastre']['api'] + '/ficheurbanisme/' + id_par,
        'headers': {
            'Accept': 'application/x-vm-json',
            'X-HTTP-Method-Override': 'GET'
        },
        'data': {
            'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
        },
        'timeout': 120000,
        'scope': this.$scope_,
        'success': function (response) {

            // Vérifie si il y a un résultat
            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                return 0;
            }
            var data = response['data']['data'];
            this_.displayUrbanismeSheet2(data);
        }
    });
};

/**
 * Print the Urbanisme sheet by data
 * @param {object} data
 * @private
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayUrbanismeSheet2 = function (data) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayUrbanismeSheet2');

    var proprietaires = [];

    var i = 0;
    while (goog.isDef(data[i])) {

        // Valeurs par défaut
        data[i]['CCOSEC'] = goog.isDefAndNotNull(data[i]['CCOSEC']) ? data[i]['CCOSEC'] : "";
        data[i]['DCNTPA'] = goog.isDefAndNotNull(data[i]['DCNTPA']) ? data[i]['DCNTPA'] : "";
        data[i]['DDENOM'] = goog.isDefAndNotNull(data[i]['DDENOM']) ? data[i]['DDENOM'] : "";
        data[i]['DLIGN3'] = goog.isDefAndNotNull(data[i]['DLIGN3']) ? data[i]['DLIGN3'] : "";
        data[i]['DLIGN4'] = goog.isDefAndNotNull(data[i]['DLIGN4']) ? data[i]['DLIGN4'] : "";
        data[i]['DLIGN6'] = goog.isDefAndNotNull(data[i]['DLIGN6']) ? data[i]['DLIGN6'] : "";
        data[i]['DNUPLA'] = goog.isDefAndNotNull(data[i]['DNUPLA']) ? data[i]['DNUPLA'] : "";
        data[i]['ID_PAR'] = goog.isDefAndNotNull(data[i]['ID_PAR']) ? data[i]['ID_PAR'] : "";
        data[i]['LIBCOM'] = goog.isDefAndNotNull(data[i]['LIBCOM']) ? data[i]['LIBCOM'] : "";
        data[i]['LIBDEP'] = goog.isDefAndNotNull(data[i]['LIBDEP']) ? data[i]['LIBDEP'] : "";
        data[i]['ADRESSE'] = goog.isDefAndNotNull(data[i]['ADRESSE']) ? data[i]['ADRESSE'] : "";
        data[i]['NATURE'] = goog.isDefAndNotNull(data[i]['DSGRPF']) ? data[i]['DSGRPF'] : "";

        // en cas de multiple propriétaires
        proprietaires.push({
            'nom': data[i]['DDENOM'].trim(),
            'adresse': data[i]['DLIGN3'].trim() + data[i]['DLIGN4'].trim(),
            'ville': data[i]['DLIGN6'].trim()
        });

        i++;
    }
    delete i;

    if (proprietaires.length === 0) {
        $.notify('Pas d\'information sur les propriétaires', 'error');
        console.error('Pas d\'information sur les propriétaires');
    }

    // Récupère la date d'aujoud'hui
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0

    // Ajoute des 0 si besoin
    mm = (mm > 9 ? '' : '0') + mm;
    dd = (dd > 9 ? '' : '0') + dd;

    var yyyy = today.getFullYear();

    if (!goog.isDef(oVmap['properties']['cadastre']["fiche_urb"]))
        oVmap['properties']['cadastre']["fiche_urb"] = {};

    // Valeurs par défaut de l'entête
    var logo = goog.isDef(oVmap['properties']['cadastre']["fiche_urb"]["logo"]) ? oVmap['properties']['cadastre']["fiche_urb"]["logo"] : '';
    var company = goog.isDef(oVmap['properties']['cadastre']["fiche_urb"]["company"]) ? oVmap['properties']['cadastre']["fiche_urb"]["company"] : '';

    var scope = {
        'logo': logo,
        'company': company,
        'departement': goog.isDef(data[0]) ? data[0]['LIBDEP'].trim() : '',
        'commune': goog.isDef(data[0]) ? data[0]['LIBCOM'].trim() : '',
        'parcelle': goog.isDef(data[0]) ? parseFloat(data[0]['DNUPLA']) : '',
        'section': goog.isDef(data[0]) ? data[0]['CCOSEC'].trim() : '',
        'contenance': goog.isDef(data[0]) ? parseFloat(data[0]['DCNTPA']) : '',
        'adresse': goog.isDef(data[0]) ? data[0]['ADRESSE'].trim() : '',
        'date': dd + '/' + mm + '/' + yyyy,
        'nature': goog.isDef(data[0]) ? data[0]['NATURE'].trim() : '',
        'proprietaires': proprietaires,
        'aIntersections': data['aIntersections'],
        'aIntersectionsArray': data['aIntersectionsArray']
    };

    // Ajout de la feature
    var olView = this['map'].getView();
    var sProjection = olView.getProjection().getCode();

    var geom = oVmap.getGeomFromEWKT(data['geometry']['geom'], sProjection);

    var feature = new ol.Feature({
        geometry: geom
    });

    if (!goog.isDefAndNotNull(oVmap['properties']['cadastre']["fiche_urb"]['printtemplate_id'])) {
        $.notify('properties.cadastre.fiche_urb.printtemplate_id undefined', 'error');
        return 0;
    }
    if (!goog.isDefAndNotNull(oVmap['properties']['cadastre']["fiche_urb"]['map_id'])) {
        $.notify('properties.cadastre.fiche_urb.map_id undefined', 'error');
        return 0;
    }

    // Impression
    oVmap.getToolsManager().getBasicTools().getPrint().print({
        scope: scope,
        templateId: oVmap['properties']['cadastre']["fiche_urb"]['printtemplate_id'],
        mapId: oVmap['properties']['cadastre']["fiche_urb"]['map_id'],
        features: [feature],
        featuresZoom: oVmap['properties']['cadastre']["fiche_urb"]['features_zoom']
    });
};

/**
 * Display de descriptive sheet
 * @param {string} id_bat
 * @returns {String}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayInvariantDescriptiveSheet = function (id_bat) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayInvariantDescriptiveSheet');

    if (!goog.isDef(id_bat))
        return 'id_bat undefined';

    // Ajoute la description de la parcelle
    var cadastreController = this;

    showAjaxLoader();
    ajaxRequest({
        'method': 'POST',
        'url': oVmap['properties']['api_url'] + '/' + oVmap['properties']['cadastre']['api'] + '/fichedescriptiveinvariant/' + id_bat,
        'headers': {
            'Accept': 'application/x-vm-json',
            'X-HTTP-Method-Override': 'GET'
        },
        'data': {
            'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
        },
        'scope': this.$scope_,
        'success': function (response) {

            // Vérifie si il y a un résultat
            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                return 0;
            }
            var data = response['data']['data'];

            cadastreController['oInvariant'] = data;

            cadastreController.displayInvariantDescriptiveSheet2();
        }
    });
};

/**
 * function called after the ajax requests
 * @returns {Number}
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayInvariantDescriptiveSheet2 = function () {

    if (!goog.isDef(this['oInvariant'])) {
        console.error('oInvariant non défini');
        // return 0;
    }
    if (!goog.isDef(this['oInvariant']['PEV'])) {
        console.error('oInvariant.PEV non défini');
        // return 0;
    }
    if (!goog.isDef(this['oInvariant']['habitations'])) {
        console.error('oInvariant.habitations non défini');
        // return 0;
    }
    if (!goog.isDef(this['oInvariant']['locauxPros'])) {
        console.error('oInvariant.locauxPros non défini');
        // return 0;
    }
    if (!goog.isDef(this['oInvariant']['dependances'])) {
        console.error('oInvariant.dependances non défini');
        // return 0;
    }
    if (!goog.isDef(this['oInvariant']['proprietaires'])) {
        console.error('oInvariant.proprietaires non défini');
        // return 0;
    }
    if (!goog.isDef(this['oInvariant']['lots'])) {
        console.error('oInvariant.lots non défini');
        // return 0;
    }

    // Récupère la bonne adresse
    for (var i = 0; i < this['oInvariant']['proprietaires'].length; i++) {

        this['oInvariant']['proprietaires'][i]['DLIGN4'] = goog.isDefAndNotNull(this['oInvariant']['proprietaires'][i]['DLIGN4']) ? this['oInvariant']['proprietaires'][i]['DLIGN4'] : "";

        var adresse = this['oInvariant']['proprietaires'][i]['DLIGN4'].trim();
        for (var ii = 0; ii < adresse.length; ii++) {
            if (adresse.charAt(ii) !== "0") {
                adresse = adresse.substring(ii);
                ii = adresse.length;
            }
        }
        this['oInvariant']['proprietaires'][i]['DLIGN4'] = adresse;
    }

//	$('#descriptive-parcelle-sheet-modal').modal('hide');
    $('#descriptive-invariant-sheet-modal').modal('show');
};

/**
 * Display a Relevé de propeiété sheet
 * @param {string} type type (parcelle, standard, tiers)
 * @param {string} idnupro idnupro (id_com + dnupro)
 * @param {string} id_par id_par
 * @returns {undefined}
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayReleveDeProprieteSheet = function (type, idnupro, id_par) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayReleveDeProprieteSheet');

    var params = {
        'type': type,
        'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
    };

    var cadastreController = this;

    if (goog.isDef(id_par))
        params['ID_PAR'] = id_par;

    if (goog.isDef(idnupro))
        params['IDDNUPRO'] = idnupro;

    ajaxRequest({
        'method': 'POST',
        'url': oVmap['properties']['api_url'] + '/' + oVmap['properties']['cadastre']['api'] + '/relevedepropriete',
        'headers': {
            'Accept': 'application/x-vm-json',
            'X-HTTP-Method-Override': 'GET'
        },
        'data': params,
        'scope': this.$scope_,
        'timeout': 120000,
        'success': function (response) {

            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                if (goog.isDef(cadastreController.releveWindow))
                    cadastreController.releveWindow.close();
                cadastreController.releveWindow = window.open("", 'Relevé de propriété ', 'height=400,width=600');
                cadastreController.releveWindow.document.write('<div style="width: 100%; text-align: center; margin-top: 80px">Pas de données à afficher</div>');
                return 0;
            }
            var data = response['data']['data'];

            ajaxRequest({
                'method': 'GET',
                'url': data['releveDePropriete'] + '&',
                'headers': {
                    'Accept': 'application/x-vm-json'
                },
                'scope': this.$scope_,
                'responseType': 'blob',
                'success': function (response) {

                    // IE
                    if (window.navigator['msSaveOrOpenBlob']) {
                        window.navigator['msSaveOrOpenBlob'](response['data'], 'releve_de_propriete_' + id_par + '.pdf');
                        cadastreController.releveWindow.close();
                    }
                    // Others
                    else {
//                        var url = window.URL.createObjectURL(response['data']);
//                        cadastreController.releveWindow.location.href = url;
                        oVmap.downloadBlob(response['data'], 'releve_de_propriete_' + id_par + '.pdf');
                        cadastreController.releveWindow.close();
                    }
                }
            });
        },
        'error': function (response) {

            if (goog.isDef(response['data']['error'])) {
                if (goog.isDef(response['data']['error']['errorMessage'])) {
                    console.error(response['data']['error']['errorMessage']);
                    $.notify(response['data']['error']['errorMessage'], 'error');
                    if (goog.isDef(cadastreController.releveWindow))
                        cadastreController.releveWindow.close();
                    cadastreController.releveWindow = window.open("", 'Relevé de propriété ', 'height=400,width=600');
                    cadastreController.releveWindow.document.write('<div style="width: 100%; text-align: center; margin-top: 80px">' + response['data']['error']['errorMessage'] + '</div>');
                    return 0;
                }
            }
            if (response['status'] === 500) {
                $.notify('Une erreur est survenue au sein du serveur', 'error');
                if (goog.isDef(cadastreController.releveWindow))
                    cadastreController.releveWindow.close();
                return 0;
            }
            if (goog.isDef(cadastreController.releveWindow)) {
                cadastreController.releveWindow.close();
            }
        }
    });
};

/**
 * Display a relevé de propriété parcelle sheet
 * @param {string} parcelleTable identifier of the parcelle table
 * @returns {Number}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayReleveDeProprieteSheetParcelle = function (parcelleTable) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayReleveDeProprieteSheetTiers');

    var selectedParcelles = $(parcelleTable).bootstrapTable('getAllSelections');

    if (selectedParcelles.length !== 1) {
//        bootbox.alert('<h4>Veuillez sélectionner une unique parcelle</h4>');
        $.notify('Veuillez sélectionner une unique parcelle', 'info');
        return 0;
    }

    // Ouvre une première fenêtre vide car on ne peut ouvrir une fenêtre avec window.open uniquement sur action directe
    if (goog.isDef(this.releveWindow))
        this.releveWindow.close();
    this.releveWindow = window.open("", 'Relevé de propriété ', 'height=400,width=600');
    this.releveWindow.document.write('<div style="width: 100%; text-align: center; margin-top: 80px"><img src="images/ajax-big-loader.GIF" alt="Load img" style="width: 200px;height: 170px;"><br><br><i style="color: gray">Construction de la fiche en cours..</i></div>');

    var id_par = selectedParcelles[0]['id_par'];
    this.displayReleveDeProprieteSheet('parcelle', '', id_par);
};

/**
 * Display a relevé de propriété standard sheet 
 * @param {string} compteTable identifier of the compte table
 * @returns {Number}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayReleveDeProprieteSheetStandard = function (compteTable) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayReleveDeProprieteSheetStandard');

    var selectedComptes = $(compteTable).bootstrapTable('getAllSelections');

    if (selectedComptes.length !== 1) {
//        bootbox.alert('<h4>Veuillez sélectionner une unique parcelle</h4>');
        $.notify('Veuillez sélectionner un unique compte', 'info');
        return 0;
    }

    // Ouvre une première fenêtre vide car on ne peut ouvrir une fenêtre avec window.open uniquement sur action directe
    if (goog.isDef(this.releveWindow))
        this.releveWindow.close();
    this.releveWindow = window.open("", 'Relevé de propriété ', 'height=400,width=600');
    this.releveWindow.document.write('<div style="width: 100%; text-align: center; margin-top: 80px"><img src="images/ajax-big-loader.GIF" alt="Load img" style="width: 200px;height: 170px;"><br><br><i style="color: gray">Construction de la fiche en cours..</i></div>');

    var iddnupro = selectedComptes[0]['ID_COM'] + selectedComptes[0]['DNUPRO'];

    this.displayReleveDeProprieteSheet('standard', iddnupro);
};

/**
 * Display a relevé de propriété tiers sheet 
 * @param {string} parcelleTable identifier of the parcelle table
 * @returns {Number}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayReleveDeProprieteSheetTiers = function (compteTable) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayReleveDeProprieteSheetTiers');

    var selectedComptes = $(compteTable).bootstrapTable('getAllSelections');

    if (selectedComptes.length !== 1) {
//        bootbox.alert('<h4>Veuillez sélectionner une unique parcelle</h4>');
        $.notify('Veuillez sélectionner un unique compte', 'info');
        return 0;
    }


    // Ouvre une première fenêtre vide car on ne peut ouvrir une fenêtre avec window.open uniquement sur action directe
    if (goog.isDef(this.releveWindow))
        this.releveWindow.close();
    this.releveWindow = window.open("", 'Relevé de propriété ', 'height=400,width=600');
    this.releveWindow.document.write('<div style="width: 100%; text-align: center; margin-top: 80px"><img src="images/ajax-big-loader.GIF" alt="Load img" style="width: 200px;height: 170px;"><br><br><i style="color: gray">Construction de la fiche en cours..</i></div>');

    var iddnupro = selectedComptes[0]['ID_COM'] + selectedComptes[0]['DNUPRO'];
    this.displayReleveDeProprieteSheet('tiers', iddnupro);
};

/**
 * Display a Relevé de propeiété sheet
 * @param {string} type type (parcelle, standard, tiers)
 * @param {string} idnupro idnupro (id_com + dnupro)
 * @param {string} id_par id_par
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayReleveDeProprieteSheetOnMap = function (type, idnupro, id_par) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayReleveDeProprieteSheetOnMap');

    // Ouvre une première fenêtre vide car on ne peut ouvrir une fenêtre avec window.open uniquement sur action directe	
    if (goog.isDef(this.releveWindow))
        this.releveWindow.close();
    this.releveWindow = window.open("", 'Relevé de propriété ', 'height=400,width=600');
    this.releveWindow.document.write('<div style="width: 100%; text-align: center; margin-top: 80px"><img src="images/ajax-big-loader.GIF" alt="Load img" style="width: 200px;height: 170px;"><br><br><i style="color: gray">Construction de la fiche en cours..</i></div>');

    this.displayReleveDeProprieteSheet(type, idnupro, id_par);
};

/**
 * Display the parcelle rapports (ToutesInfos, BatieNonBatie, Proprietaire, SubdivisionFiscale, EmprisePosPlu, Locaux, ProprietaireLocaux)
 * @param {string} parcelleTable identifier of the parcelle table
 * @param {string} rapportType ToutesInfos, BatieNonBatie, Proprietaire, SubdivisionFiscale, EmprisePosPlu, Locaux, ProprietaireLocaux
 * @param {boolean|undefined} bOpenWindow true if you want the result on a new window, false to download it. Default is true
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayRapportParcelle = function (parcelleTable, rapportType, bOpenWindow) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayRapportParcelle');

    var selectedParcelles = $(parcelleTable).bootstrapTable('getAllSelections');

    bOpenWindow = goog.isDef(bOpenWindow) ? bOpenWindow : true;

    if (selectedParcelles.length === 0) {
//        bootbox.alert('<h4>Veuillez sélectionner au moins une parcelle</h4>');
        $.notify('Veuillez sélectionner une unique parcelle', 'info');
        return 0;
    }

    var parcelles = '';
    for (var i = 0; i < selectedParcelles.length; i++) {
        if (i > 0)
            parcelles += '|';
        parcelles += selectedParcelles[i]['id_par'];
    }

    var this_ = this;

    // Ouvre une première fenêtre vide car on ne peut ouvrir une fenêtre avec window.open uniquement sur action directe
    if (goog.isDef(this.releveWindow))
        this.releveWindow.close();
    if (bOpenWindow) {
        this.releveWindow = window.open("", 'Rapport parcellaire', 'height=400,width=600');
        this.releveWindow.document.write('<div style="width: 100%; text-align: center; margin-top: 80px"><img src="images/ajax-big-loader.GIF" alt="Load img" style="width: 200px;height: 170px;"><br><br><i style="color: gray">Construction de la fiche en cours..</i></div>');
    } else {
        // Message d'attente
        var message = '<h4>Rapport en cours de création...</h4>';
        message += '<br>';
        message += '<div class="progress">';
        message += '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%">';
        message += '<span class="sr-only">45% Complete</span>';
        message += '<span class="sr-only">45% Complete</span>';
        message += '</div>';
        message += '</div>';
        bootbox.alert(message);
    }

    showAjaxLoader();
    ajaxRequest({
        'method': 'POST',
        'url': oVmap['properties']['api_url'] + '/' + oVmap['properties']['cadastre']['api'] + '/rapportscadastreparcelle',
        'headers': {
            'Accept': 'application/x-vm-json',
            'X-HTTP-Method-Override': 'GET'
        },
        'data': {
            'rapport_type': rapportType,
            'parcelles': parcelles,
            'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
        },
        'timeout': 120000,
        'scope': this.$scope_,
        'success': function (response) {

            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                $.notify('Pas de données à afficher', 'warn');
                if (bOpenWindow)
                    this_.releveWindow.close();
                else
                    $('.bootbox-alert').modal('hide');
                return 0;
            }

            var data = response['data']['data'];
            var rapportLink = data['rapport'] + '&';

            showAjaxLoader();
            ajaxRequest({
                'method': 'GET',
                'url': rapportLink,
                'headers': {
                    'Accept': 'application/x-vm-json'
                },
                'scope': this.$scope_,
                'responseType': 'blob',
                'success': function (response) {

                    // Ouvre la nouvelle fenêtre ou lance le téléchargement du fichier
                    if (bOpenWindow) {
                        this_.releveWindow.location.href = rapportLink;

                        // IE
                        if (window.navigator['msSaveOrOpenBlob']) {
                            window.navigator['msSaveOrOpenBlob'](response['data'], 'vmap_cadastre_' + rapportType + '.pdf');
                            this_.releveWindow.close();
                        }
                        // Others
                        else {
                            var url = window.URL.createObjectURL(response['data']);
                            this_.releveWindow.location.href = url;
                        }
                    } else {
                        var url = window.URL.createObjectURL(response['data']);
                        $('#cadastre-download-file').attr('href', url);
                        $('#cadastre-download-file').attr('download', rapportType + "." + data['format']);
                        oVmap.simuleClick('cadastre-download-file');
                        $('.bootbox-alert').modal('hide');
                    }
                }
            });
        },
        'error': function (response) {

            // Vérifie si il y a une erreur
            if (goog.isDef(response['data']['error'])) {
                if (goog.isDef(response['data']['error']['errorMessage'])) {
                    console.error(response['data']['error']['errorMessage']);
                    $.notify(response['data']['error']['errorMessage'], 'error');
                    if (bOpenWindow)
                        this_.releveWindow.document.write('<div style="width: 100%; text-align: center; margin-top: 80px">' + response['data']['error']['errorMessage'] + '</div>');
                    else
                        $('.bootbox-alert').modal('hide');
                    return 0;
                }
            }
            if (response['status'] === 500) {
                $.notify('Une erreur est survenue au sein du serveur', 'error');
                if (bOpenWindow)
                    this_.releveWindow.close();
                else
                    $('.bootbox-alert').modal('hide');
                return 0;
            }
            if (goog.isDef(this_.releveWindow)) {
                this_.releveWindow.close();
            }
        }
    });
};

/**
 * Add the gemetries to the location feature overlay on the map
 * @param {array<object>} aData 
 * @param {object} aData.i.geom: geometry
 * @param {string} aData.i.proj: projection integers of the geometry (ex: 2154)
 * @param {string|undefined} type the type of element (commune/parcelle/lieuDit..)
 * @param {boolean|undefined} zoom true for zoom on the feature after
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addLocationGeometries = function (aData, type, zoom) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addLocationGeometries');

    zoom = goog.isDef(zoom) ? zoom : true;
    type = goog.isDef(type) ? type : '';

    var aFeatures = [];
    for (var i = aData.length - 1; i >= 0; i--) {
        var feature = new ol.Feature({
            geometry: oVmap.getGeomFromEWKT(aData[i]['geom'])
        });
        // Renseigne le type d'entitée
        feature.set('type', type);
        aFeatures.push(feature);
        // Renseigne les infos
        var featureInfos = {};
        for (var item in aData[i]) {
            if (item !== 'geom')
                featureInfos[item] = aData[i][item];
        }
        feature.set('infos', featureInfos)

    }

    var removeOldLocation = true;
    if (this['locationMultiple']) {
        removeOldLocation = false;
    }

    oVmap.getMap().locateFeatures(aFeatures, removeOldLocation, zoom);
};

/**
 * Add the gemetries to the location selection overlay on the map
 * @param {array<object>} aInfos 
 * geom: geometry, 
 * proj: projection integers of the geometry (ex: 2154)
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.setSelectionGeometries = function (aInfos) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.setSelectionGeometries');

    // Ajoute les features
    for (var i = aInfos.length - 1; i >= 0; i--) {
        if (aInfos[i]['geom'] !== undefined) {

            var geom = oVmap.getGeomFromEWKT(aInfos[i]['geom']);
            var feature = new ol.Feature({
                geometry: geom
            });

            // Ajoute la géométrie aux infos de l'objet (se qui permet de le supprimer depuis le infoContainer)
            aInfos[i]['feature'] = feature;

            delete geom;
            delete feature;
        }
    }

    return aInfos;
};

/**
 * add the infos on the infoContainer
 * @param {array<object>} data 
 * example: {id_com: "340006", sections: "A", state: true}
 * @param {string} tabCode Code of the tab
 * @return {string} error if something goes wrong
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addInfos = function (data, tabCode) {

    if (!goog.isDef(data))
        return 'data is not defined';
    if (!goog.isDef(tabCode))
        return 'tabCode is not defined';

    if (oVmap.getToolsManager().getInfoContainer().getTabByCode(tabCode) === undefined) {
        // Affiche en remplaçant les infos
        var scope = angular.element($("#cadastre-tools")).scope();
        scope.$evalAsync(function (scope) {
            scope['ctrl'].setInfos(data, tabCode);
        });
    } else {
        var tabOptions = {tabCode: tabCode};
        var rowOptions = {
            data: data,
            invisibleColumns: ['geom']
        };
        oVmap.getToolsManager().getInfoContainer().addMultipleRows(tabOptions, rowOptions);
    }
};

/**
 * Display the infos on the infoContainer
 * @param {array<object>} data bootstrap-table data, example: {id_com: "340006", sections: "A", state: true}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.setInfos = function (data, tabCode) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.setInfos');

    if (!goog.isDef(data))
        return 'data is not defined';
    tabCode = goog.isDef(tabCode) ? tabCode : 'Cadastre';

    var tabOptions = {
        tabCode: tabCode,
        data: data,
        deleteBtn: true,
        invisibleColumns: ['geom'],
        actions: goog.isDef(data[0]['geom']) ? ['zoom', 'delete'] : ['delete'],
        layer: oVmap.getMap().getSelectionOverlay()
    };

    oVmap.getToolsManager().getInfoContainer().addTab(tabOptions);
};

/**
 * Add selection from filter
 * @param {string} path API path
 * @param {string} filter API filter
 * @param {string} tabCode Code of the tab to create
 * @param {function} callBack function to load after
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addSelectionFromFilter = function (path, filter, tabCode, callBack) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addSelectionFromFilter');
    oVmap.log('filter: ' + filter);

    var cadastreController = this;
    var url = oVmap['properties']['api_url'] + '/' + path;

    tabCode = goog.isDef(tabCode) ? tabCode : 'Cadastre';
    callBack = goog.isDef(callBack) ? callBack : function () {
        return 0;
    };

    showAjaxLoader();
    ajaxRequest({
        'method': 'POST',
        'url': url,
        'headers': {
            'Accept': 'application/x-vm-json',
            'X-HTTP-Method-Override': 'GET'
        },
        'data': {
            'filter': filter,
            'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
        },
        'scope': this.$scope_,
        'success': function (response) {

            // Vérifie si il y a un résultat
            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                return 0;
            }

            var data = response['data']['data'];

            // Vide la locatlisation
            oVmap.getMap().getLocationOverlayFeatures().clear();
            // Ajoute la géométrie
            data = cadastreController.setSelectionGeometries(data);
            // Ajoute les infos
            cadastreController.addInfos(data, tabCode);
            // Zoom sur les géométries du dernier onglet à ajouter
            cadastreController.zoomOnLastTabFeatures(tabCode);
            // Appelle le callback
            callBack(tabCode);
        }
    });
};

/**
 * Add the select selection to the selection
 * @param {string} path API path (ex: cadastre/communes)
 * @param {string} param type of param to filter by (ex: id_com)
 * @param {string} value value
 * @param {string} tabCode name of the tab
 * @param {function} callBack function to call after the ajax request
 * @returns {Number}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addSelectionFromValue = function (path, param, value, tabCode, callBack) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addSelectionFromValue');
    if (this['cadastreAPI_'] == "cadastre") {
        var paramField = param;
    } else {
        var paramField = param.toLowerCase();
    }
//    var filter = '"' + paramField + '"' + '=' + '\'' + value + '\'';
    var filter = {
        "column": paramField,
        "compare_operator": "=",
        "value": value
    };
    this.addSelectionFromFilter(path, filter, tabCode, callBack);
};

/**
 * 
 * @param {string} path API path (ex: cadastre/communes)
 * @param {string} param1
 * @param {string} value1
 * @param {string} param2
 * @param {string} value2
 * @param {string} tabCode name of the tab
 * @param {function} callBack function to call after the ajax request
 * @returns {Number}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addSelectionFrom2Values = function (path, param1, value1, param2, value2, tabCode, callBack) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addSelectionFrom2Values');
    if (this['cadastreAPI_'] === "cadastre") {
        var paramField1 = param1;
        var paramField2 = param2;
    } else {
        var paramField1 = param1.toLowerCase();
        var paramField2 = param2.toLowerCase();
    }
//    var filter = '"' + paramField1 + '"' + '=' + '\'' + value1 + '\' AND "' + paramField2 + '"' + '=' + '\'' + value2 + '\'';
    var filter = {
        "relation": "AND",
        "operators": [{
                "column": paramField1,
                "compare_operator": "=",
                "value": value1
            }, {
                "column": paramField2,
                "compare_operator": "=",
                "value": value2
            }]
    };
    this.addSelectionFromFilter(path, filter, tabCode, callBack);
};

/**
 * Add the table selection on the selection
 * @param {string} path API path (ex: cadastre/communes)
 * @param {string} param type of param to filter by (ex: id_com)
 * @param {string} array array
 * @param {string} arrayParam param name
 * @param {string} tabCode name of the tab to create
 * @param {function} callBack function to load after the request
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addSelectionFromArray = function (path, param, array, arrayParam, tabCode, callBack) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addSelectionFromTable');
    if (this['cadastreAPI_'] === "cadastre") {
        var paramField = param;
    } else {
        var paramField = param.toLowerCase();
    }

//    var filter = '';
//    for (var i = 0; i < array.length; i++) {
//        if (i !== 0) {
//            filter += ' OR "' + paramField + '"' + '=' + '\'' + array[i][arrayParam] + '\'';
//        } else {
//            filter += '"' + paramField + '"' + '=' + '\'' + array[i][arrayParam] + '\'';
//        }
//    }

    var filter = {
        "relation": "OR",
        "operators": []
    };
    for (var i = 0; i < array.length; i++) {
        filter['operators'].push({
            "column": paramField,
            "compare_operator": "=",
            "value": array[i][arrayParam]
        });
    }

    this.addSelectionFromFilter(path, filter, tabCode, callBack);
};

/**
 * Add the select selection to the selection
 * @param {string} path API path (ex: cadastre/communes)
 * @param {string} param type of param to filter by (ex: id_com)
 * @param {string} selectorId identifier of the select
 * @param {string} tabCode name of the tab
 * @param {function} callBack function to call after the ajax request
 * @returns {Number}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addSelectionFromSelect = function (path, param, selectorId, tabCode, callBack) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addSelectionFromSelect');
    if (this['cadastreAPI_'] === "cadastre") {
        var paramField = param;
    } else {
        var paramField = param.toLowerCase();
    }
//    var filter = '"' + paramField + '"' + '=' + '\'' + $(selectorId).val() + '\'';
    var filter = {
        "column": paramField,
        "compare_operator": "=",
        "value": $(selectorId).val()
    };

    this.addSelectionFromFilter(path, filter, tabCode, callBack);
};

/**
 * Add the select selection to the selection
 * @param {string} path API path (ex: cadastre/communes)
 * @param {type} param1 type of param to filter by (ex: id_com)
 * @param {type} selectorId1 identifier of the select
 * @param {type} param2 type of param to filter by (ex: id_com)
 * @param {type} selectorId2 identifier of the select
 * @param {string} tabCode name of the tab
 * @param {function} callBack function to call after the ajax request
 * @returns {Number}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addSelectionFrom2Select = function (path, param1, selectorId1, param2, selectorId2, tabCode, callBack) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addSelectionFromSelect');
    if (this['cadastreAPI_'] === "cadastre") {
        var paramField1 = param1;
        var paramField2 = param2;
    } else {
        var paramField1 = param1.toLowerCase();
        var paramField2 = param2.toLowerCase();
    }
    var value1 = $(selectorId1).val();
    var value2 = $(selectorId2).val();
//    var filter = '"' + paramField1 + '"' + '=' + '\'' + value1 + '\' AND "' + paramField2 + '"' + '=' + '\'' + value2 + '\'';
    var filter = {
        "relation": "AND",
        "operators": [{
                "column": paramField1,
                "compare_operator": "=",
                "value": value1
            }, {
                "column": paramField2,
                "compare_operator": "=",
                "value": value2
            }]
    };
    this.addSelectionFromFilter(path, filter, tabCode, callBack);
};

/**
 * Add the table selection on the selection
 * @param {string} path API path (ex: cadastre/communes)
 * @param {string} param type of param to filter by (ex: id_com)
 * @param {string} tableId id of the bootstrap-table element
 * @param {string} tabCode name of the tab to create
 * @param {function} callBack function to load after the request
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addSelectionFromTable = function (path, param, tableId, tabCode, callBack) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.addSelectionFromTable');
    var tableSelections = $(tableId).bootstrapTable('getAllSelections');
    if (this['cadastreAPI_'] === "cadastre") {
        var paramField = param;
    } else {
        var paramField = param.toLowerCase();
    }
//    var filter = '';
//    for (var i = 0; i < tableSelections.length; i++) {
//        if (i !== 0)
//            filter += ' OR "' + paramField + '"' + '=' + '\'' + tableSelections[i][param] + '\'';
//        else
//            filter += '"' + paramField + '"' + '=' + '\'' + tableSelections[i][param] + '\'';
//    }

    var filter = {
        "relation": "OR",
        "operators": []
    };
    for (var i = 0; i < tableSelections.length; i++) {
        filter['operators'].push({
            "column": paramField,
            "compare_operator": "=",
            "value": tableSelections[i][param]
        });
    }

    this.addSelectionFromFilter(path, filter, tabCode, callBack);
};

/**
 * Empty the selection
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.emptySelection = function () {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.emptySelection');
    oVmap.getToolsManager().getInfoContainer().removeAll();
};

/**
 * Localise the element on the select
 * @param {string} path API path (ex: cadastre/communes)
 * @param {string} param type of param to filter by (ex: id_com)
 * @param {string} selectorId html id of the select
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.localiseFromSelect = function (path, param, selectorId) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.localiseFromSelect');

    var value = $(selectorId).val();
    var url = oVmap['properties']['api_url'] + '/' + path;
    var cadastreController = this;

    if (value !== "") {
        showAjaxLoader();
        ajaxRequest({
            'method': 'POST',
            'url': url,
            'headers': {
                'Accept': 'application/x-vm-json',
                'X-HTTP-Method-Override': 'GET'
            },
            'data': {
                'attributs': 'geom|proj',
//                'filter': '"' + param + '"' + '=\'' + value + '\'',
                'filter': {
                    "column": param,
                    "compare_operator": "=",
                    "value": value
                },
                'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
            },
            'scope': this.$scope_,
            'success': function (response) {

                // Vérifie si il y a un résultat
                if (!goog.isDef(response['data']['data'])) {
                    console.error('Pas de données à afficher');
                    return 0;
                }

                var data = response['data']['data'];

                cadastreController.addLocationGeometries(data);
            }
        });
    } else {
        $.notify('Veuillez sélectionner au moins un objet spatial', 'info');
    }
};

/**
 * Localise the element sected on the table
 * @param {string} path API path (ex: cadastre/communes)
 * @param {string} param type of param to filter by (ex: id_com)
 * @param {string} array 
 * @param {string} arrayParam 
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.localiseFromArray = function (path, param, array, arrayParam) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.localiseFromTable');

    var cadastreController = this;
    var url = oVmap['properties']['api_url'] + '/' + path;

//    var sParams = '';
//    for (var i = 0; i < array.length; i++) {
//        if (i !== 0)
//            sParams += ' OR "' + param + '"' + '=' + '\'' + array[i][arrayParam] + '\'';
//        else
//            sParams += '"' + param + '"' + '=' + '\'' + array[i][arrayParam] + '\'';
//    }

    var filter = {
        "relation": "OR",
        "operators": []
    };
    for (var i = 0; i < array.length; i++) {
        filter['operators'].push({
            "column": param,
            "compare_operator": "=",
            "value": array[i][arrayParam]
        });
    }

    showAjaxLoader();
    ajaxRequest({
        'method': 'POST',
        'url': url,
        'headers': {
            'Accept': 'application/x-vm-json',
            'X-HTTP-Method-Override': 'GET'
        },
        'data': {
            'attributs': 'geom|proj',
            'filter': filter,
            'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
        },
        'scope': this.$scope_,
        'success': function (response) {

            // Vérifie si il y a un résultat
            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                return 0;
            }

            var data = response['data']['data'];

            cadastreController.addLocationGeometries(data);
        }
    });
};

/**
 * Localise the element sected on the table
 * @param {string} path API path (ex: cadastre/communes)
 * @param {string} param type of param to filter by (ex: id_com)
 * @param {string} tableId html id of the table
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.localiseFromTable = function (path, param, tableId, tableParam) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.localiseFromTable');

    tableParam = goog.isDef(tableParam) ? tableParam : param;

    var cadastreController = this;
    var tableSelections = $(tableId).bootstrapTable('getAllSelections');
    var url = oVmap['properties']['api_url'] + '/' + path;

    var loadHttp = function () {
//        var sParams = '';
//        for (var i = 0; i < tableSelections.length; i++) {
//            if (i !== 0)
//                sParams += ' OR "' + param + '"' + '=' + '\'' + tableSelections[i][tableParam] + '\'';
//            else
//                sParams += '"' + param + '"' + '=' + '\'' + tableSelections[i][tableParam] + '\'';
//        }

        var filter = {
            "relation": "OR",
            "operators": []
        };
        for (var i = 0; i < tableSelections.length; i++) {
            filter['operators'].push({
                "column": param,
                "compare_operator": "=",
                "value": tableSelections[i][tableParam]
            });
        }

        showAjaxLoader();
        ajaxRequest({
            'method': 'POST',
            'url': url,
            'headers': {
                'Accept': 'application/x-vm-json',
                'X-HTTP-Method-Override': 'GET'
            },
            'data': {
                'attributs': 'geom|proj',
                'filter': filter,
                'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
            },
            'scope': this.$scope_,
            'success': function (response) {

                // Vérifie si il y a un résultat
                if (!goog.isDef(response['data']['data'])) {
                    console.error('Pas de données à afficher');
                    return 0;
                }

                var data = response['data']['data'];

                cadastreController.addLocationGeometries(data);
            }
        });
    };

    if (tableSelections.length > this.limit) {
        var sAlert = '<h4>Attention, vous allez afficher ' + tableSelections.length + ' objets, cela peut ralentir l\'application';
        sAlert += '<br>voulez-vous continuer ?</h4>';

        bootbox.confirm(sAlert, function (result) {
            if (result === true) {
                loadHttp();
            }
        });
    } else if (tableSelections.length !== 0) {
        loadHttp();
    } else {
        $.notify('Veuillez sélectionner au moins un objet de la liste', 'info');
    }
};

/**
 * Update the variableName value
 * @param {string} path API path (ex: cadastre/communes)
 * @param {string} variableName name of the controller variable to update
 * @param {string} filter filter
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBaseElem = function (path, variableName, filter, order_by) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBaseElem');

    filter = goog.isDef(filter) ? filter : '';
    order_by = goog.isDef(order_by) ? order_by : '';

    var cadastreController = this;
    var url = oVmap['properties']['api_url'] + '/' + path;
    var params = {
        'attributs': '-geom|proj',
        'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
    };

    if (filter !== '')
        params['filter'] = filter;

    if (order_by !== '')
        params['order_by'] = order_by;

    this[variableName].length = 0;

    showAjaxLoader();
    ajaxRequest({
        'method': 'POST',
        'url': url,
        'headers': {
            'Accept': 'application/x-vm-json',
            'X-HTTP-Method-Override': 'GET'
        },
        'data': params,
        'scope': this.$scope_,
        'success': function (response) {
            // Vérifie si il y a un résultat
            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                return 0;
            }
            var data = response['data']['data'];

            cadastreController[variableName] = data;
        }
    });
};

/**
 * Update the variableName value by the selector value
 * @param {string} path API path (ex: cadastre/communes)
 * @param {type} param param (ex: id_com)
 * @param {type} selector selector identifier
 * @param {string} variableName name of the controller variable to update
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBaseElemBySelect = function (path, param, selector, variableName, order_by) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBaseElemBySelect');

    order_by = goog.isDef(order_by) ? order_by : '';
    this[variableName].length = 0;

    var cadastreController = this;
    var url = oVmap['properties']['api_url'] + '/' + path;
    var value = $(selector).val();
    var params = {
        'attributs': '-geom|proj',
//        'filter': '"' + param + '"' + '=' + '\'' + value + '\'',
        'filter': {
            "column": param,
            "compare_operator": "=",
            "value": value
        },
        'jsonformat': 'anonymous',
        'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
    };

    if (order_by !== '')
        params['order_by'] = order_by;

    showAjaxLoader();
    ajaxRequest({
        'method': 'POST',
        'url': url,
        'headers': {
            'Accept': 'application/x-vm-json',
            'X-HTTP-Method-Override': 'GET'
        },
        'data': params,
        'scope': this.$scope_,
        'success': function (response) {

            // Vérifie si il y a un résultat
            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                return 0;
            }
            var data = response['data']['data'];

            cadastreController[variableName] = data;
        }
    });
};

/**
 * Get database elements and put the result on a table
 * @param {string} path
 * @param {string} filter
 * @param {string} table
 * @param {string} order_by
 * @returns {undefined}
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.putBaseElemOnTable = function (path, filter, table, order_by) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.putBaseElemOnTable');

    $(table).bootstrapTable('showLoading');
    $(table).bootstrapTable('removeAll');

    order_by = goog.isDef(order_by) ? order_by : '';

    var params = {
        'filter': filter,
        'jsonformat': 'anonymous',
        'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
    };

    if (order_by !== '') {
        params['order_by'] = order_by;
    }

    showAjaxLoader();
    ajaxRequest({
        'method': 'POST',
        'url': oVmap['properties']['api_url'] + '/' + path,
        'headers': {
            'Accept': 'application/x-vm-json',
            'X-HTTP-Method-Override': 'GET'
        },
        'data': params,
        'scope': this.$scope_,
        'success': function (response) {

            $(table).bootstrapTable('hideLoading');

            // Vérifie si il y a un résultat
            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                return 0;
            }

            var data = response['data']['data'];

            // Met à jour les données du tableau
            $(table).bootstrapTable('load', data);

            // Affiche les outils du tableau
            $(table + "-toolbar").show();

            // Si une seule ligne est proposée, alors on la sélectionne
            if (data.length === 1) {
                $(table).bootstrapTable('check', 0);
            }
        },
        'error': function (response) {
            $(table).bootstrapTable('hideLoading');
        }
    });
};

/**
 * Get database elements from the select and put the result on a table
 * @param {string} path API path (ex: cadastre/communes)
 * @param {string} param type of param to filter by (ex: id_com)
 * @param {string} selectorId identifier of the select
 * @param {string} table identifier of the table
 * @param {string} order_by
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.putBaseElemBySelectOnTable = function (path, param, selectorId, table, order_by) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.putBaseElemBySelectOnTable');

    order_by = goog.isDef(order_by) ? order_by : '';

    var value = $(selectorId).val();
//    var filter = '"' + param + '"' + '=' + '\'' + value + '\'';
    var filter = {
        "column": param,
        "compare_operator": "=",
        "value": value
    };

    this.putBaseElemOnTable(path, filter, table, order_by);
};

/**
 * Get database elements from the selects and put the result on a table
 * @param {string} path API path (ex: cadastre/communes)
 * @param {string} param1 type of param to filter by (ex: id_com)
 * @param {string} selector1 identifier of the select
 * @param {string} param2 type of param to filter by (ex: id_com)
 * @param {string} selector2 identifier of the select
 * @param {string} table identifier of the table
 * @param {string} order_by
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.putBaseElemBy2SelectOnTable = function (path, param1, selector1, param2, selector2, table, order_by) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.putBaseElemBy2SelectOnTable');

    order_by = goog.isDef(order_by) ? order_by : '';

    var value1 = $(selector1).val();
    var value2 = $(selector2).val();
//    var filter = '"' + param1 + '"' + '=' + '\'' + value1 + '\' AND "' + param2 + '"' + '=' + '\'' + value2 + '\'';
    var filter = {
        "relation": "AND",
        "operators": [{
                "column": param1,
                "compare_operator": "=",
                "value": value1
            }, {
                "column": param2,
                "compare_operator": "=",
                "value": value2
            }]
    };

    this.putBaseElemOnTable(path, filter, table, order_by);
};

/**
 * Get database elements from the select and put the result on a table
 * @param {string} path API path (ex: cadastre/communes)
 * @param {string} param type of param to filter by (ex: id_com)
 * @param {string} selectorId identifier of the select
 * @param {string} tableId identifier of the table
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBaseVoiesOnTable = function (path, param, selectorId, tableId) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBaseVoiesOnTable');

    var value = $(selectorId).val();
    var url = oVmap['properties']['api_url'] + '/' + path;
    var cadastreController = this;

    $(tableId).bootstrapTable({
        data: {}
    });
    if (cadastreController['cadastreAPI_'] === "cadastre") {
        var order = "DVOILIB";
    } else {
        var order = "dvoilib";
    }
    $(tableId).bootstrapTable('showLoading');

    showAjaxLoader();
    ajaxRequest({
        'method': 'POST',
        'url': url,
        'headers': {
            'Accept': 'application/x-vm-json',
            'X-HTTP-Method-Override': 'GET'
        },
        'data': {
            'order_by': order,
//            'filter': '"' + param + '"' + '=' + '\'' + value + '\'',
            'filter': {
                "column": param,
                "compare_operator": "=",
                "value": value
            },
            'jsonformat': 'anonymous',
            'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
        },
        'scope': this.$scope_,
        'success': function (response) {
            $(tableId).bootstrapTable('hideLoading');

            // Vérifie si il y a un résultat
            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                return 0;
            }

            var data = response['data']['data'];

            // Met à jour les données du tableau
            $(tableId).bootstrapTable('load', data);

            $(tableId).off('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table');
            $(tableId).on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e, row) {
                $("#Parcelle-par-adresse-DGFiP-select-adresse").prop('disabled', true);
                var afterLoad = function () {
                    $("#Parcelle-par-adresse-DGFiP-select-adresse").prop('disabled', false);
                };
                if (cadastreController['cadastreAPI_'] === "cadastre") {
                    var paramField = 'ID_RIVOLI';
                } else {
                    var paramField = 'id_voie';
                }
                cadastreController.getBaseElemByValue({
                    'path': oVmap["properties"]["cadastre"]["api"] + '/adresses',
                    'variableName': 'aAdresses',
                    'param': paramField,
                    'value': row['ID_RIVOLI'],
                    'order_by': 'DNVOIRI',
                    'callback': afterLoad
                });
            });
            // Si une seule ligne est proposée, alors on la sélectionne
            if (data.length === 1)
                $(tableId).bootstrapTable('check', 0);
        },
        'error': function (response) {
            $(tableId).bootstrapTable('hideLoading');
        }
    });
};

/**
 * Update a varialbe value
 * @param {object} opt_options
 * @param {string} opt_options.path API path (ex: cadastre/communes)
 * @param {string} opt_options.variableName name of the variable
 * @param {string} opt_options.param API param
 * @param {string} opt_options.value API param value
 * @param {string} opt_options.callback Function to load after the http request
 * @returns {undefined}
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBaseElemByValue = function (opt_options) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBaseElemByValue');

    var path = opt_options['path'];
    var variableName = opt_options['variableName'];
    var param = opt_options['param'];
    var value = opt_options['value'];
    var callback = opt_options['callback'];
    var orderBy = opt_options['order_by'];

    callback = goog.isDef(callback) ? callback : function () {
        return 0;
    };

    var cadastreController = this;
    var url = oVmap['properties']['api_url'] + '/' + path;

    this[variableName].length = 0;

    showAjaxLoader();
    ajaxRequest({
        'method': 'POST',
        'url': url,
        'headers': {
            'Accept': 'application/x-vm-json',
            'X-HTTP-Method-Override': 'GET'
        },
        'data': {
            'attributs': '-geom|proj',
//            'filter': '"' + param + '"' + '=' + '\'' + value + '\'',
            'filter': {
                "column": param,
                "compare_operator": "=",
                "value": value
            },
            'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5),
            'order_by': goog.isDefAndNotNull(orderBy) ? orderBy : ''
        },
        'scope': this.$scope_,
        'success': function (response) {

            // Vérifie si il y a un résultat
            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                return 0;
            }
            var data = response['data']['data'];

            // Donne la valeur à la variable
            cadastreController[variableName] = data;

            // lance le callback
            callback();
        }
    });
};

/**
 * Update the  list and the table
 * @param {string} communeSelectorId id of the communes selector
 * @param {string} proprietaireSearchId id of the proprietaire search field
 * @param {string} tableId id of the table to load
 * @param {string} comptesTableId id of the comptes table to load the infos when clicking on the proprietaire table
 * @param {string} parcelleTableId id of the comptes table to load the infos when clicking on the compte table
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getParcelleBaseProprietairesOnTable = function (communeSelectorId, proprietaireSearchId, tableId, comptesTableId, parcelleTableId) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getParcelleBaseProprietairesOnTable');

    var cadastreController = this;
    var commune = $(communeSelectorId).val();
    var proprietaire = $(proprietaireSearchId).val().toUpperCase();
    var url = oVmap['properties']['api_url'] + '/' + oVmap['properties']['cadastre']['api'] + '/proprietaires';
    var limit = 500;
    if (commune != "") {
        if (proprietaire.length >= 3) {
            $(tableId).bootstrapTable({data: {}});
            $(tableId).bootstrapTable('showLoading');
            $(comptesTableId).bootstrapTable('removeAll');
            $(parcelleTableId).bootstrapTable('removeAll');
            if (this['cadastreAPI_'] === "cadastre") {
                var id_com = 'ID_COM';
                var ddenom = 'DDENOM';
            } else {
                var id_com = 'id_com';
                var ddenom = 'ddenom';
            }

            proprietaire = proprietaire.replace(/'/g, "''");

            showAjaxLoader();
            ajaxRequest({
                'method': 'POST',
                'url': url,
                'headers': {
                    'Accept': 'application/x-vm-json',
                    'X-HTTP-Method-Override': 'GET'
                },
                'data': {
                    //            'filter': '"' + id_com + '"=\'' + commune + '\' AND "' + ddenom + '" LIKE \'%' + proprietaire + '%\'',
                    'filter': {
                        "relation": "AND",
                        "operators": [{
                                "column": id_com,
                                "compare_operator": "=",
                                "value": commune
                            }, {
                                "column": ddenom,
                                "compare_operator": "LIKE",
                                "compare_operator_options": {
                                    "case_insensitive": true
                                },
                                "value": "%" + proprietaire + "%"
                            }]
                    },
                    'limit': limit,
                    'attributs': ddenom + '|' + id_com,
                    'distinct': true,
                    'order_by': ddenom,
                    'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
                },
                'scope': this.$scope_,
                'success': function (response) {
                    $(tableId).bootstrapTable('hideLoading');

                    // Vérifie si il y a un résultat
                    if (!goog.isDef(response['data']['data'])) {
                        $(tableId).bootstrapTable('removeAll');
                        console.error('Pas de données à afficher');
                        return 0;
                    }
                    var data = response['data']['data'];

                    if (data.length >= limit)
                        $.notify('Attention: limite d\'occurrences atteinte, veuillez affiner votre recherche', 'info');

                    // Met à jour les données du tableau
                    $(tableId).bootstrapTable('load', data);

                    // Affiche les outils du tableau
                    $(tableId + "-toolbar").show();

                    if (comptesTableId !== '') {
                        $(tableId).off('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table');
                        $(tableId).on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e, row) {
                            $(comptesTableId).bootstrapTable('removeAll');
                            $(parcelleTableId).bootstrapTable('removeAll');
                            cadastreController.getParcelleBaseComptesOnTable(row, comptesTableId, parcelleTableId);
                        });
                    }
                    // Si une seule ligne est proposée, alors on la sélectionne
                    if (data.length === 1) {
                        $(tableId).bootstrapTable('check', 0);
                    }
                },
                'error': function (response) {
                    $(tableId).bootstrapTable('hideLoading');
                }
            });
        } else {
            $(tableId).bootstrapTable('removeAll');
            $.notify('Veuillez entrer au moins 3 caractères...', 'error');
        }
    } else {
        $(tableId).bootstrapTable('removeAll');
        $.notify('Veuillez sélectionner une commune', 'error');
    }
};

/**
 * Update the  list and the table
 * @param {string} row row (contains DDENOM DNUPRO ID_COM state)
 * @param {string} tableId id of the table to write
 * @param {string} parcelleTableId id of the parcelle table
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getParcelleBaseComptesOnTable = function (row, tableId, parcelleTableId) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getParcelleBaseComptesOnTable');

    var cadastreController = this;
    var url = oVmap['properties']['api_url'] + '/' + oVmap['properties']['cadastre']['api'] + '/proprietaires';
    $(tableId).bootstrapTable('showLoading');
    if (this['cadastreAPI_'] === "cadastre") {
        var id_com = 'ID_COM';
        var ddenom = 'DDENOM';
        var dnupro = 'DNUPRO';
    } else {
        var id_com = 'id_com';
        var ddenom = 'ddenom';
        var dnupro = 'dnupro';
    }

    showAjaxLoader();
    ajaxRequest({
        'method': 'POST',
        'url': url,
        'headers': {
            'Accept': 'application/x-vm-json',
            'X-HTTP-Method-Override': 'GET'
        },
        'data': {
//            'filter': '"' + id_com + '" = \'' + row['ID_COM'] + '\' AND "' + ddenom + '" = \'' + row['DDENOM'].replace(/'/g, "''") + '\'',
            'filter': {
                "relation": "AND",
                "operators": [{
                        "column": id_com,
                        "compare_operator": "=",
                        "value": row['ID_COM']
                    }, {
                        "column": ddenom,
                        "compare_operator": "=",
                        "value": row['DDENOM'].replace(/'/g, "''")
                    }]
            },
            'attributs': id_com + '|' + dnupro,
            'order_by': dnupro,
            'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
        },
        'scope': this.$scope_,
        'success': function (response) {
            $(tableId).bootstrapTable('hideLoading');

            // Vérifie si il y a un résultat
            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                return 0;
            }
            var data = response['data']['data'];

            // Met à jour les données du tableau
            $(tableId).bootstrapTable('load', data);

            // Affiche les outils du tableau
            $(tableId + "-toolbar").show();

            $(tableId).off('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table');
            $(tableId).on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e, row) {
                $(parcelleTableId).bootstrapTable('removeAll');
                cadastreController.getBaseParcellesByProprietaireOnTable(row['ID_COM'], $(tableId).bootstrapTable('getAllSelections'), parcelleTableId);
            });
            // Si une seule ligne est proposée, alors on la sélectionne
            if (data.length === 1) {
                $(tableId).bootstrapTable('check', 0);
            }
        },
        'error': function (response) {
            $(tableId).bootstrapTable('hideLoading');
        }
    });
};

/**
 * Update the  list and the table
 * @param {string} id_com commune id_com
 * @param {array<object>} tableSelections comptes selectionnés
 * @param {string} tableId id of the table to write
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBaseParcellesByProprietaireOnTable = function (id_com, tableSelections, tableId) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBaseParcellesByProprietaireOnTable');

    if (tableSelections.length !== 0) {
        var cadastreController = this;
        var url = oVmap['properties']['api_url'] + '/' + oVmap['properties']['cadastre']['api'] + '/descriptionparcelles';
        $(tableId).bootstrapTable('showLoading');
        if (this['cadastreAPI_'] === "cadastre") {
            var id_com = 'ID_COM';
            var dnupro = 'DNUPRO';
            var id_par = 'ID_PAR';
        } else {
            var id_com = 'id_com';
            var dnupro = 'dnupro';
            var id_par = 'id_par';
        }
//        var filter = '';
//        for (var i = 0; i < tableSelections.length; i++) {
//            if (i === 0)
//                filter += '( "' + id_com + '"=\'' + tableSelections[i]['ID_COM'] + '\' AND "' + dnupro + '"=\'' + tableSelections[i]['DNUPRO'] + '\' )';
//            else
//                filter += ' OR ( "' + id_com + '"=\'' + tableSelections[i]['ID_COM'] + '\' AND "' + dnupro + '"=\'' + tableSelections[i]['DNUPRO'] + '\' )';
//        }

        var filter = {
            "relation": "OR",
            "operators": []
        };
        for (var i = 0; i < tableSelections.length; i++) {
            filter['operators'].push({
                "relation": "AND",
                "operators": [{
                        "column": id_com,
                        "compare_operator": "=",
                        "value": tableSelections[i]['ID_COM']
                    }, {
                        "column": dnupro,
                        "compare_operator": "=",
                        "value": tableSelections[i]['DNUPRO']
                    }]
            });
        }

        showAjaxLoader();
        ajaxRequest({
            'method': 'POST',
            'url': url,
            'headers': {
                'Accept': 'application/x-vm-json',
                'X-HTTP-Method-Override': 'GET'
            },
            'data': {
                'attributs': id_par,
                'filter': filter,
                'order_by': id_par,
                'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
            },
            'scope': this.$scope_,
            'success': function (response) {
                $(tableId).bootstrapTable('hideLoading');

                // Vérifie si il y a une erreur
                if (goog.isDef(response['data']['errorMessage'])) {
                    console.error(response['data']['errorMessage']);
                    return 0;
                }
                if (response['status'] === 500) {
                    $.notify('Une erreur est survenue au sein du serveur', 'error');
                    return 0;
                }

                // Vérifie si il y a un résultat
                if (!goog.isDef(response['data']['data'])) {
                    console.error('Pas de données à afficher');
                    return 0;
                }
                var data = response['data']['data'];

                // Met à jour les données du tableau
                $(tableId).bootstrapTable('load', data);

                // Affiche les outils du tableau
                $(tableId + "-toolbar").show();

                // Si une seule ligne est proposée, alors on la sélectionne
                if (data.length === 1) {
                    $(tableId).bootstrapTable('check', 0);
                }
            },
            'error': function (response) {
                $(tableId).bootstrapTable('hideLoading');
            }
        });
    }
};

/**
 * Update the  list and the table
 * @param {string} communeSelectorId id of the communes selector
 * @param {string} proprietaireSearchId id of the proprietaire search field
 * @param {string} tableId id of the table to load
 * @param {string} comptesTableId id of the compte table to load the infos when clicking on the proprietaire table
 * @param {string} invariantsTableId id of the compte table to load the infos when clicking on the comptes table
 * @param {string} parcellesTableId id of the compte table to load the infos when clicking on the invariants table
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBatiBaseProprietairesOnTable = function (communeSelectorId, proprietaireSearchId, tableId, comptesTableId, invariantsTableId, parcellesTableId) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBatiBaseProprietairesOnTable');

    var cadastreController = this;
    var commune = $(communeSelectorId).val();
    var proprietaire = $(proprietaireSearchId).val().toUpperCase().replace(/'/g, "''");
    var url = oVmap['properties']['api_url'] + '/' + oVmap['properties']['cadastre']['api'] + '/proprietaires';

    if (commune != "") {
        if (proprietaire.length >= 3) {
            $(tableId).bootstrapTable({data: {}});
            $(tableId).bootstrapTable('showLoading');
            $(comptesTableId).bootstrapTable('removeAll');
            $(invariantsTableId).bootstrapTable('removeAll');
            $(parcellesTableId).bootstrapTable('removeAll');
            if (this['cadastreAPI_'] === "cadastre") {
                var id_com = 'ID_COM';
                var ddenom = 'DDENOM';
            } else {
                var id_com = 'id_com';
                var ddenom = 'ddenom';
            }

            showAjaxLoader();
            ajaxRequest({
                'method': 'POST',
                'url': url,
                'headers': {
                    'Accept': 'application/x-vm-json',
                    'X-HTTP-Method-Override': 'GET'
                },
                'data': {
                    //            'filter': '"' + id_com + '"=\'' + commune + '\' AND "' + ddenom + '" LIKE \'%' + proprietaire + '%\'',
                    'filter': {
                        "relation": "AND",
                        "operators": [{
                                "column": id_com,
                                "compare_operator": "=",
                                "value": commune
                            }, {
                                "column": ddenom,
                                "compare_operator": "LIKE",
                                "compare_operator_options": {
                                    "case_insensitive": true
                                },
                                "value": "%" + proprietaire + "%"
                            }]
                    },
                    'limit': '50',
                    'attributs': ddenom + '|' + id_com,
                    'distinct': true,
                    'order_by': ddenom,
                    'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
                },
                'scope': this.$scope_,
                'success': function (response) {
                    $(tableId).bootstrapTable('hideLoading');

                    // Vérifie si il y a un résultat
                    if (!goog.isDef(response['data']['data'])) {
                        console.error('Pas de données à afficher');
                        return 0;
                    }
                    var data = response['data']['data'];

                    // Met à jour les données du tableau
                    $(tableId).bootstrapTable('load', data);

                    // Affiche les outils du tableau
                    $(tableId + "-toolbar").show();

                    if (comptesTableId !== '') {
                        $(tableId).off('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table');
                        $(tableId).on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e, row) {
                            $(comptesTableId).bootstrapTable('removeAll');
                            $(invariantsTableId).bootstrapTable('removeAll');
                            $(parcellesTableId).bootstrapTable('removeAll');
                            cadastreController.getBatiBaseComptesOnTable(row, comptesTableId, invariantsTableId, parcellesTableId);
                        });
                    }
                    // Si une seule ligne est proposée, alors on la sélectionne
                    if (data.length === 1) {
                        $(tableId).bootstrapTable('check', 0);
                    }
                },
                'error': function (response) {
                    $(tableId).bootstrapTable('hideLoading');
                }
            });
        } else {
            $(tableId).bootstrapTable('removeAll');
            $.notify('Veuillez entrer au moins 3 caractères...', 'error');
        }
    } else {
        $(tableId).bootstrapTable('removeAll');
        $.notify('Veuillez sélectionner une commune', 'error');
    }
};

/**
 * Update the comptes list and the table
 * @param {string} row row (ID_COM, DDENOM)
 * @param {string} tableId id of the table to write
 * @param {string} invariantsTableId id of the compte table to load the infos when clicking on the comptes table
 * @param {string} parcellesTableId id of the compte table to load the infos when clicking on the invariants table
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBatiBaseComptesOnTable = function (row, tableId, invariantsTableId, parcellesTableId) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBatiBaseComptesOnTable');

    var cadastreController = this;
    var url = oVmap['properties']['api_url'] + '/' + oVmap['properties']['cadastre']['api'] + '/proprietaires';

    $(tableId).bootstrapTable('showLoading');
    if (this['cadastreAPI_'] === "cadastre") {
        var id_com = 'ID_COM';
        var ddenom = 'DDENOM';
        var dnupro = 'DNUPRO';
    } else {
        var id_com = 'id_com';
        var ddenom = 'ddenom';
        var dnupro = 'dnupro';
    }

    showAjaxLoader();
    ajaxRequest({
        'method': 'POST',
        'url': url,
        'headers': {
            'Accept': 'application/x-vm-json',
            'X-HTTP-Method-Override': 'GET'
        },
        'data': {
//            'filter': '"' + id_com + '" = \'' + row['ID_COM'] + '\' AND "' + ddenom + '" = \'' + row['DDENOM'].replace(/'/g, "''") + '\'',
            'filter': {
                "relation": "AND",
                "operators": [{
                        "column": id_com,
                        "compare_operator": "=",
                        "value": row['ID_COM']
                    }, {
                        "column": ddenom,
                        "compare_operator": "=",
                        "value": row['DDENOM'].replace(/'/g, "''")
                    }]
            },
            'attributs': dnupro + '|' + id_com,
            'order_by': dnupro,
            'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
        },
        'scope': this.$scope_,
        'success': function (response) {
            $(tableId).bootstrapTable('hideLoading');

            // Vérifie si il y a un résultat
            if (!goog.isDef(response['data']['data'])) {
                console.error('Pas de données à afficher');
                return 0;
            }
            var data = response['data']['data'];

            // Met à jour les données du tableau
            $(tableId).bootstrapTable('load', data);

            // Affiche les outils du tableau
            $(tableId + "-toolbar").show();

            $(tableId).off('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table');
            $(tableId).on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e, row) {
                $(invariantsTableId).bootstrapTable('removeAll');
                $(parcellesTableId).bootstrapTable('removeAll');

                cadastreController.getBatiBaseInvariantsOnTable($(tableId).bootstrapTable('getAllSelections'), invariantsTableId, parcellesTableId);
            });

            // Si une seule ligne est proposée, alors on la sélectionne
            if (data.length === 1) {
                $(tableId).bootstrapTable('check', 0);
            }
        },
        'error': function (response) {
            $(tableId).bootstrapTable('hideLoading');
        }
    });
};

/**
 * Update the invariants list and the table
 * @param {string} commune commune
 * @param {string} tableSelections
 * @param {string} tableId id of the table to write
 * @param {string} parcellesTableId id of the compte table to load the infos when clicking on the invariants table
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBatiBaseInvariantsOnTable = function (tableSelections, tableId, parcellesTableId) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBatiBaseInvariantsOnTable');

    if (tableSelections.length !== 0) {
        var cadastreController = this;
        var url = oVmap['properties']['api_url'] + '/' + oVmap['properties']['cadastre']['api'] + '/invariants';
        if (this['cadastreAPI_'] === "cadastre") {
            var id_com = 'ID_COM';
            var dnupro = 'DNUPRO';
            var attributs = 'INVAR|ID_PAR|oid';
        } else {
            var id_com = 'id_com';
            var dnupro = 'dnupro';
            var attributs = 'INVAR|ID_PAR|id_local'
        }
//        var filter = '';
//        for (var i = 0; i < tableSelections.length; i++) {
//            if (i === 0)
//                filter += '("' + dnupro + '"=\'' + tableSelections[i]['DNUPRO'] + '\' AND "' + id_com + '"=\'' + tableSelections[i]['ID_COM'] + '\')';
//            else
//                filter += ' OR ("' + dnupro + '"=\'' + tableSelections[i]['DNUPRO'] + '\' AND "' + id_com + '"=\'' + tableSelections[i]['ID_COM'] + '\')';
//        }

        var filter = {
            "relation": "OR",
            "operators": []
        };
        for (var i = 0; i < tableSelections.length; i++) {
            filter['operators'].push({
                "relation": "AND",
                "operators": [{
                        "column": dnupro,
                        "compare_operator": "=",
                        "value": tableSelections[i]['DNUPRO']
                    }, {
                        "column": id_com,
                        "compare_operator": "=",
                        "value": tableSelections[i]['ID_COM']
                    }]
            });
        }

        $(tableId).bootstrapTable('showLoading');

        showAjaxLoader();
        ajaxRequest({
            'method': 'POST',
            'url': url,
            'headers': {
                'Accept': 'application/x-vm-json',
                'X-HTTP-Method-Override': 'GET'
            },
            'data': {
                'filter': filter,
                'attributs': attributs,
                'jsonformat': 'anonymous',
                'order_by': 'INVAR',
                'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
            },
            'scope': this.$scope_,
            'success': function (response) {
                $(tableId).bootstrapTable('hideLoading');

                // Vérifie si il y a des données à afficher
                if (!goog.isDef(response['data']['data'])) {
                    console.error('Pas de données à afficher');
                    return 0;
                }
                var data = response['data']['data'];

                // Met à jour les données du tableau
                $(tableId).bootstrapTable('load', data);

                // Affiche les outils du tableau
                $(tableId + "-toolbar").show();

                $(tableId).off('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table');
                $(tableId).on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e, row) {
                    $(parcellesTableId).bootstrapTable('removeAll');
                    cadastreController.getBatiBaseParcellesOnTable($(tableId).bootstrapTable('getAllSelections'), parcellesTableId);
                });

                // Si une seule ligne est proposée, alors on la sélectionne
                if (data.length === 1) {
                    $(tableId).bootstrapTable('check', 0);
                }
            },
            'error': function (response) {
                $(tableId).bootstrapTable('hideLoading');
            }
        });
    }
};

/**
 * Update the parcelles list and the table
 * @param {string} tableSelections
 * @param {string} tableId id of the table to write
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBatiBaseParcellesOnTable = function (tableSelections, tableId) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.getBatiBaseParcellesOnTable');

    if (tableSelections.length !== 0) {
        $(tableId).bootstrapTable('showLoading');

        var url = oVmap['properties']['api_url'] + '/' + oVmap['properties']['cadastre']['api'] + '/parcelles';

//        var filter = '';
//        for (var i = 0; i < tableSelections.length; i++) {
//            if (i === 0)
//                filter += '"id_par"=\'' + tableSelections[i]['ID_PAR'] + '\'';
//            else
//                filter += ' OR "id_par"=\'' + tableSelections[i]['ID_PAR'] + '\'';
//        }

        var filter = {
            "relation": "OR",
            "operators": []
        };
        for (var i = 0; i < tableSelections.length; i++) {
            filter['operators'].push({
                "relation": "AND",
                "operators": [{
                        "column": "id_par",
                        "compare_operator": "=",
                        "value": tableSelections[i]['ID_PAR']
                    }]
            });
        }

        showAjaxLoader();
        ajaxRequest({
            'method': 'POST',
            'url': url,
            'headers': {
                'Accept': 'application/x-vm-json',
                'X-HTTP-Method-Override': 'GET'
            },
            'data': {
                'filter': filter,
                'attributs': 'id_par',
                'order_by': 'parcelle',
                'result_srid': oVmap.getMap().getOLMap().getView().getProjection().getCode().substring(5)
            },
            'scope': this.$scope_,
            'success': function (response) {
                $(tableId).bootstrapTable('hideLoading');

                // Vérifie si il y a des données à afficher
                if (!goog.isDef(response['data']['data'])) {
                    console.error('Pas de données à afficher');
                    return 0;
                }
                var data = response['data']['data'];

                // Met à jour les données du tableau
                $(tableId).bootstrapTable('load', data);

                // Affiche les outils du tableau
                $(tableId + "-toolbar").show();

                // Si une seule ligne est proposée, alors on la sélectionne
                if (data.length === 1) {
                    $(tableId).bootstrapTable('check', 0);
                }
            },
            'error': function (response) {
                $(tableId).bootstrapTable('hideLoading');
            }
        });
    }
};

/**
 * Zoom on the features of the last tab to add
 * @param {string} tabCode Code of the tabzoomOnLastTabFeatures
 * @returns {undefined}
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.zoomOnLastTabFeatures = function (tabCode) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.zoomOnLastTabFeatures');

    angular.element($("#cadastre-tools")).scope()['ctrl'].aFormElementsDisplayed_++;

    var aFormElementsDisplayed_ = angular.element($("#cadastre-tools")).scope()['ctrl'].aFormElementsDisplayed_;
    var aFormList_ = angular.element($("#cadastre-tools")).scope()['ctrl'].aFormList_;
    var lastElement = aFormList_[aFormList_.length - 1];

    if (aFormList_.length === aFormElementsDisplayed_) {
        oVmap.getToolsManager().getInfoContainer().zoomOnTabFeatures(lastElement);
        oVmap.getToolsManager().getInfoContainer().showBar();
    }
};

/**
 * Display the last tab to add
 * @param {string} tabCode Code of the tab
 * @returns {undefined}
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayLastTab = function (tabCode) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.displayLastTab');

    angular.element($("#cadastre-tools")).scope()['ctrl'].aFormElementsDisplayed_++;

    var aFormElementsDisplayed_ = angular.element($("#cadastre-tools")).scope()['ctrl'].aFormElementsDisplayed_;
    var aFormList_ = angular.element($("#cadastre-tools")).scope()['ctrl'].aFormList_;
    var lastElement = aFormList_[aFormList_.length - 1];

    if (aFormList_.length === aFormElementsDisplayed_) {
        oVmap.getToolsManager().getInfoContainer().displayTabFeatures(lastElement);
        oVmap.getToolsManager().getInfoContainer().showBar();
    }
};

/**
 * Add all the elements from the form to the selection
 * @param {string} selectCommune commune selector
 * @returns {string} error
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectCommuneForm = function (selectCommune) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectCommuneForm');

    if (!goog.isDef(selectCommune))
        return 'selectCommune non renseigné';

    // Réinitialise aFormList_
    this.aFormList_.length = 0;

    // Réinitialise aFormElementsDisplayed_
    this.aFormElementsDisplayed_ = 0;

    // Ajoute les infos de la commune
    if ($(selectCommune).val() !== "") {
        this.aFormList_.push('veremes_cadastre_commune');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_commune') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_commune', tabName: 'Commune', actions: ['zoom', 'delete']});

        // Ajoute les infos
        this.addSelectionFromSelect(oVmap["properties"]["cadastre"]["api"] + '/communes', 'id_com', selectCommune, 'veremes_cadastre_commune');
    }

    //Ouvre le dernier des onglets
    var lastElement = this.aFormList_[this.aFormList_.length - 1];
    oVmap.getToolsManager().getInfoContainer().displayTabByCode(lastElement);
};

/**
 * Add all the elements from the form to the selection
 * @param {string} selectCommune commune selector
 * @param {string} tableSection section selector
 * @returns {string} error
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectSectionForm = function (selectCommune, tableSection) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectSectionForm');

    if (!goog.isDef(selectCommune))
        return 'selectCommune non renseigné';
    if (!goog.isDef(tableSection))
        return 'tableSection non renseigné';

    // Réinitialise aFormList_
    this.aFormList_.length = 0;

    // Réinitialise aFormElementsDisplayed_
    this.aFormElementsDisplayed_ = 0;

    // Ajoute les infos de la commune
    if ($(selectCommune).val() !== "") {
        this.aFormList_.push('veremes_cadastre_commune');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_commune') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_commune', tabName: 'Commune', actions: ['zoom', 'delete']});

        // Ajoute les infos
        this.addSelectionFromSelect(oVmap["properties"]["cadastre"]["api"] + '/communes', 'id_com', selectCommune, 'veremes_cadastre_commune');
    }

    // Ajoute les infos de la section
    if ($(tableSection).bootstrapTable('getAllSelections').length > 0) {
        this.aFormList_.push('veremes_cadastre_section');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_section') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_section', tabName: 'Section', actions: ['zoom', 'delete']});

        // Ajoute les infos
        this.addSelectionFromTable(oVmap["properties"]["cadastre"]["api"] + '/sections', 'id_sec', tableSection, 'veremes_cadastre_section');
    }

    // Ouvre le dernier des onglets
    var lastElement = this.aFormList_[this.aFormList_.length - 1];
    oVmap.getToolsManager().getInfoContainer().displayTabByCode(lastElement);
};

/**
 * Add all the elements from the form to the selection
 * @param {string} selectCommune commune selector
 * @param {string} tableLieuDit Lieu-dit selector
 * @returns {string} error
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectLieuDitForm = function (selectCommune, tableLieuDit) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectSectionForm');

    if (!goog.isDef(selectCommune))
        return 'selectCommune non renseigné';
    if (!goog.isDef(tableLieuDit))
        return 'tableLieuDit non renseigné';

    // Réinitialise aFormList_
    this.aFormList_.length = 0;

    // Réinitialise aFormElementsDisplayed_
    this.aFormElementsDisplayed_ = 0;

    // Ajoute les infos de la commune
    if ($(selectCommune).val() !== "") {
        this.aFormList_.push('veremes_cadastre_commune');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_commune') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_commune', tabName: 'Commune', actions: ['zoom', 'delete']});

        // Ajoute les infos
        this.addSelectionFromSelect(oVmap["properties"]["cadastre"]["api"] + '/communes', 'id_com', selectCommune, 'veremes_cadastre_commune');
    }

    // Ajoute les infos du lieu dit
    if ($(tableLieuDit).bootstrapTable('getAllSelections').length > 0) {
        this.aFormList_.push('veremes_cadastre_lieu_dit');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_lieu_dit') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_lieu_dit', tabName: 'Lieu-dit', actions: ['zoom', 'delete']});

        // Ajoute les infos
        this.addSelectionFromTable(oVmap["properties"]["cadastre"]["api"] + '/lieudits', 'oid', tableLieuDit, 'veremes_cadastre_lieu_dit');
    }

    // Ouvre le dernier des onglets
    var lastElement = this.aFormList_[this.aFormList_.length - 1];
    oVmap.getToolsManager().getInfoContainer().displayTabByCode(lastElement);
};

/**
 * Add all the elements from the form to the selection
 * @param {string} selectCommune commune selector
 * @param {string} selectSection section selector
 * @param {string} tableParcelle parcelle selector
 * @returns {string} error
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectParcelleBySectionForm = function (selectCommune, selectSection, tableParcelle) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectSectionForm');

    if (!goog.isDef(selectCommune))
        return 'selectCommune non renseigné';
    if (!goog.isDef(selectSection))
        return 'selectSection non renseigné';
    if (!goog.isDef(tableParcelle))
        return 'tableParcelle non renseigné';

    // Réinitialise aFormList_
    this.aFormList_.length = 0;

    // Réinitialise aFormElementsDisplayed_
    this.aFormElementsDisplayed_ = 0;

    // Ajoute les infos de la commune
    if ($(selectCommune).val() !== "") {
        this.aFormList_.push('veremes_cadastre_commune');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_commune') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_commune', tabName: 'Commune', actions: ['zoom', 'delete']});

        // Ajoute les infos
        this.addSelectionFromSelect(oVmap["properties"]["cadastre"]["api"] + '/communes', 'id_com', selectCommune, 'veremes_cadastre_commune');
    }

    // Ajoute les infos de la section
    if ($(selectSection).val() !== "") {
        this.aFormList_.push('veremes_cadastre_section');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_section') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_section', tabName: 'Section', actions: ['zoom', 'delete']});

        // Ajoute les infos
        this.addSelectionFromSelect(oVmap["properties"]["cadastre"]["api"] + '/sections', 'id_sec', selectSection, 'veremes_cadastre_section');
    }

    // Ajoute les infos de la Parcelle
    if ($(tableParcelle).bootstrapTable('getAllSelections').length > 0) {
        this.aFormList_.push('veremes_cadastre_parcelle');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_parcelle') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_parcelle', tabName: 'Parcelle', actions: ['zoom', 'delete']});

        // Ajoute les infos
        this.addSelectionFromTable(oVmap["properties"]["cadastre"]["api"] + '/parcelles', 'id_par', tableParcelle, 'veremes_cadastre_parcelle');
    }

    // Ouvre le dernier des onglets
    var lastElement = this.aFormList_[this.aFormList_.length - 1];
    oVmap.getToolsManager().getInfoContainer().displayTabByCode(lastElement);
};

/**
 * Add all the elements from the form to the selection
 * @param {string} selectCommune commune selector
 * @param {string} tableVoie voie selector
 * @param {string} selectAdresse adresse selector
 * @returns {string} error
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectParcelleByAdresse = function (selectCommune, tableVoie, selectAdresse) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectParcelleByAdresse');

    if (!goog.isDef(selectCommune))
        return 'selectCommune non renseigné';
    if (!goog.isDef(tableVoie))
        return 'selectSection non renseigné';
    if (!goog.isDef(selectAdresse))
        return 'tableParcelle non renseigné';

    // Réinitialise aFormList_
    this.aFormList_.length = 0;

    // Réinitialise aFormElementsDisplayed_
    this.aFormElementsDisplayed_ = 0;

    // Ajoute les infos de la commune
    if ($(selectCommune).val() !== "") {
        this.aFormList_.push('veremes_cadastre_commune');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_commune') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_commune', tabName: 'Commune', actions: ['zoom', 'delete']});

        // Ajoute les infos
        this.addSelectionFromSelect(oVmap["properties"]["cadastre"]["api"] + '/communes', 'id_com', selectCommune, 'veremes_cadastre_commune');
    }

    // Ajoute les infos de la Voie
    if ($(tableVoie).bootstrapTable('getAllSelections').length > 0) {
        this.aFormList_.push('veremes_cadastre_voie');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_voie') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_voie', tabName: 'Voie', actions: ['delete']});

        // Ajoute les infos
        this.addSelectionFromTable(oVmap["properties"]["cadastre"]["api"] + '/voies', 'ID_RIVOLI', tableVoie, 'veremes_cadastre_voie');
    }

    // Ajoute les infos de l'adresse
    if ($(selectAdresse).val() !== "") {
        this.aFormList_.push('veremes_cadastre_adresse');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_adresse') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_adresse', tabName: 'Adresse', actions: ['delete']});

        // Ajoute les infos
        this.addSelectionFromSelect(oVmap["properties"]["cadastre"]["api"] + '/adresses', 'ID_PAR', selectAdresse, 'veremes_cadastre_adresse');
    }

    // Ajoute les infos des parcelles
    if ($(selectAdresse).val() !== "") {
        this.aFormList_.push('veremes_cadastre_parcelle');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_parcelle') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_parcelle', tabName: 'Parcelle', actions: ['zoom', 'delete']});

        // Ajoute les infos
        this.addSelectionFromSelect(oVmap["properties"]["cadastre"]["api"] + '/parcelles', 'id_par', selectAdresse, 'veremes_cadastre_parcelle');

        // Si on choisit de voir toutes les géométries
    } else if ($(tableVoie).bootstrapTable('getAllSelections').length > 0 && this['aAdresses'].length > 0) {
        this.aFormList_.push('veremes_cadastre_parcelle');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_parcelle') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_parcelle', tabName: 'Parcelle', actions: ['zoom', 'delete']});

        // Ajoute les infos
        this.addSelectionFromArray(oVmap["properties"]["cadastre"]["api"] + '/parcelles', 'id_par', this['aAdresses'], 'ID_PAR', 'veremes_cadastre_parcelle');
    }

    // Ouvre le dernier des onglets
    var lastElement = this.aFormList_[this.aFormList_.length - 1];
    oVmap.getToolsManager().getInfoContainer().displayTabByCode(lastElement);
};

/**
 * Localise parcelles by adresse
 * @param {type} tableVoie
 * @param {type} selectAdresse
 * @returns {undefined}
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.localiseParcelleByAdresse = function (tableVoie, selectAdresse) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.localiseParcelleByAdresse');

    if ($(selectAdresse).val() !== "")
        this.localiseFromSelect(oVmap["properties"]["cadastre"]["api"] + '/parcelles', 'id_par', selectAdresse);
    else if ($(tableVoie).bootstrapTable('getAllSelections').length > 0) {
        this.localiseFromArray(oVmap["properties"]["cadastre"]["api"] + '/parcelles', 'id_par', this['aAdresses'], 'ID_PAR');
    }
};

/**
 * Add all the elements from the form to the selection
 * @param {string} selectCommune commune selector
 * @param {string} tableProprietaires Prorpietaires selector
 * @param {string} tableComptes Comptes selector
 * @param {string} tableParcelles Parcelles selector
 * @returns {string} error
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectParcelleByProprietaire = function (selectCommune, tableProprietaires, tableComptes, tableParcelles) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectParcelleByProprietaire');

    if (!goog.isDef(selectCommune))
        return 'selectCommune non renseigné';
    if (!goog.isDef(tableProprietaires))
        return 'tableProprietaires non renseigné';
    if (!goog.isDef(tableComptes))
        return 'tableComptes non renseigné';
    if (!goog.isDef(tableParcelles))
        return 'tableParcelles non renseigné';

    // Réinitialise aFormList_
    this.aFormList_.length = 0;

    // Réinitialise aFormElementsDisplayed_
    this.aFormElementsDisplayed_ = 0;

    // Ajoute les infos de la commune
    if ($(selectCommune).val() !== "") {
        this.aFormList_.push('veremes_cadastre_commune');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_commune') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_commune', tabName: 'Commune', actions: ['zoom', 'delete']});

        // Ajoute les infos
        this.addSelectionFromSelect(oVmap["properties"]["cadastre"]["api"] + '/communes', 'id_com', selectCommune, 'veremes_cadastre_commune');
    }

    // Ajoute les infos du propriétaire
    if ($(tableProprietaires).bootstrapTable('getAllSelections').length > 0) {
        this.aFormList_.push('veremes_cadastre_proprietaire');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_proprietaire') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_proprietaire', tabName: 'Propriétaire', actions: ['delete']});

        // Ajoute les infos
        var proprietaire = $(tableProprietaires).bootstrapTable('getAllSelections')[0];
        this.addSelectionFrom2Values(oVmap["properties"]["cadastre"]["api"] + '/proprietaires', 'DDENOM', proprietaire['DDENOM'].replace(/'/g, "''"), 'ID_COM', proprietaire['ID_COM'], 'veremes_cadastre_proprietaire');

    }

    // Ajoute les infos du compte
    if ($(tableComptes).bootstrapTable('getAllSelections').length > 0) {
        this.aFormList_.push('veremes_cadastre_compte');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_compte') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_compte', tabName: 'Compte', actions: ['delete']});

        // Ajoute les infos
        var aComptes = $(tableComptes).bootstrapTable('getAllSelections');
        if (this['cadastreAPI_'] === "cadastre") {
            var id_com = 'ID_COM';
            var dnupro = 'DNUPRO';
        } else {
            var id_com = 'id_com';
            var dnupro = 'dnupro';
        }
//        var filter = '';
//        for (var i = 0; i < aComptes.length; i++) {
//            if (i !== 0)
//                filter += 'OR ("' + id_com + '"=\'' + aComptes[i]['ID_COM'] + '\' AND "' + dnupro + '"=\'' + aComptes[i]['DNUPRO'] + '\')';
//            else
//                filter += '("' + id_com + '"=\'' + aComptes[i]['ID_COM'] + '\' AND "' + dnupro + '"=\'' + aComptes[i]['DNUPRO'] + '\')';
//        }

        var filter = {
            "relation": "OR",
            "operators": []
        };
        for (var i = 0; i < aComptes.length; i++) {
            filter['operators'].push({
                "relation": "AND",
                "operators": [{
                        "column": id_com,
                        "compare_operator": "=",
                        "value": aComptes[i]['ID_COM']
                    }, {
                        "column": dnupro,
                        "compare_operator": "=",
                        "value": aComptes[i]['DNUPRO']
                    }]
            });
        }

        this.addSelectionFromFilter(oVmap["properties"]["cadastre"]["api"] + '/proprietaires', filter, 'veremes_cadastre_compte');
    }

    // Ajoute les infos de la parcelle
    if ($(tableParcelles).bootstrapTable('getAllSelections').length > 0) {
        this.aFormList_.push('veremes_cadastre_parcelle');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_parcelle') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_parcelle', tabName: 'Parcelle', actions: ['zoom', 'delete']});

        // Ajoute les infos		
        var aParcelles = $(tableParcelles).bootstrapTable('getAllSelections');
        this.addSelectionFromArray(oVmap["properties"]["cadastre"]["api"] + '/parcelles', 'id_par', aParcelles, 'ID_PAR', 'veremes_cadastre_parcelle');
    }

    // Ouvre le dernier des onglets
    var lastElement = this.aFormList_[this.aFormList_.length - 1];
    oVmap.getToolsManager().getInfoContainer().displayTabByCode(lastElement);
};

/**
 * Add all the elements from the form to the selection
 * @param {string} selectCommune commune selector
 * @param {string} tableProprietaires Prorpietaires selector
 * @param {string} tableComptes Comptes selector
 * @param {string} tableInvariants Invariants selector
 * @param {string} tableParcelles Parcelles selector
 * @returns {string} error
 * @export
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectBatiByProprietaire = function (selectCommune, tableProprietaires, tableComptes, tableInvariants, tableParcelles) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.selectBatiByProprietaire');

    if (!goog.isDef(selectCommune))
        return 'selectCommune non renseigné';
    if (!goog.isDef(tableProprietaires))
        return 'tableProprietaires non renseigné';
    if (!goog.isDef(tableComptes))
        return 'tableComptes non renseigné';
    if (!goog.isDef(tableInvariants))
        return 'tableInvariants non renseigné';
    if (!goog.isDef(tableParcelles))
        return 'tableParcelles non renseigné';

    if (this['cadastreAPI_'] === "cadastre") {
        var ddenomF = 'DDENOM';
        var id_comF = 'ID_COM';
    } else {
        var ddenomF = 'ddenom';
        var id_comF = 'id_com';
    }

    // Réinitialise aFormList_
    this.aFormList_.length = 0;

    // Réinitialise aFormElementsDisplayed_
    this.aFormElementsDisplayed_ = 0;

    // Ajoute les infos de la commune
    if ($(selectCommune).val() !== "") {
        this.aFormList_.push('veremes_cadastre_commune');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_commune') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_commune', tabName: 'Commune', actions: ['zoom', 'delete']});

        // Ajoute les infos
        this.addSelectionFromSelect(oVmap["properties"]["cadastre"]["api"] + '/communes', 'id_com', selectCommune, 'veremes_cadastre_commune');
    }

    // Ajoute les infos du propriétaire
    if ($(tableProprietaires).bootstrapTable('getAllSelections').length > 0) {
        this.aFormList_.push('veremes_cadastre_proprietaire');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_proprietaire') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_proprietaire', tabName: 'Propriétaire', actions: ['delete']});

        // Ajoute les infos
        var proprietaire = $(tableProprietaires).bootstrapTable('getAllSelections')[0];
        this.addSelectionFrom2Values(oVmap["properties"]["cadastre"]["api"] + '/proprietaires', ddenomF, proprietaire['DDENOM'].replace(/'/g, "''"), id_comF, proprietaire['ID_COM'], 'veremes_cadastre_proprietaire');
    }

    // Ajoute les infos du compte
    if ($(tableComptes).bootstrapTable('getAllSelections').length > 0) {
        this.aFormList_.push('veremes_cadastre_compte');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_compte') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_compte', tabName: 'Compte', actions: ['delete']});

        var aComptes = $(tableComptes).bootstrapTable('getAllSelections');
        if (this['cadastreAPI_'] === "cadastre") {
            var id_com = 'ID_COM';
            var dnupro = 'DNUPRO';
            var id_local = 'oid';
        } else {
            var id_com = 'id_com';
            var dnupro = 'dnupro';
            var id_local = 'id_local';
        }
//        var filter = '';
//        for (var i = 0; i < aComptes.length; i++) {
//            if (i !== 0)
//                filter += 'OR ("' + id_com + '"=\'' + aComptes[i]['ID_COM'] + '\' AND "' + dnupro + '"=\'' + aComptes[i]['DNUPRO'] + '\')';
//            else
//                filter += '("' + id_com + '"=\'' + aComptes[i]['ID_COM'] + '\' AND "' + dnupro + '"=\'' + aComptes[i]['DNUPRO'] + '\')';
//        }

        var filter = {
            "relation": "OR",
            "operators": []
        };
        for (var i = 0; i < aComptes.length; i++) {
            filter['operators'].push({
                "relation": "AND",
                "operators": [{
                        "column": id_com,
                        "compare_operator": "=",
                        "value": aComptes[i]['ID_COM']
                    }, {
                        "column": dnupro,
                        "compare_operator": "=",
                        "value": aComptes[i]['DNUPRO']
                    }]
            });
        }

        this.addSelectionFromFilter(oVmap["properties"]["cadastre"]["api"] + '/proprietaires', filter, 'veremes_cadastre_compte');
    }

    // Ajoute les infos de l'invariant
    if ($(tableInvariants).bootstrapTable('getAllSelections').length > 0) {
        this.aFormList_.push('veremes_cadastre_invariant');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_invariant') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_invariant', tabName: 'Invariant', actions: ['delete']});

        // Ajoute les infos
        this.addSelectionFromTable(oVmap["properties"]["cadastre"]["api"] + '/invariants', id_local, tableInvariants, 'veremes_cadastre_invariant');
    }

    // Ajoute les infos de la parcelle
    if ($(tableParcelles).bootstrapTable('getAllSelections').length > 0) {
        this.aFormList_.push('veremes_cadastre_parcelle');

        // Crée l'onglet correspondant
        if (oVmap.getToolsManager().getInfoContainer().getTabByCode('veremes_cadastre_parcelle') === undefined)
            oVmap.getToolsManager().getInfoContainer().addTab({tabCode: 'veremes_cadastre_parcelle', tabName: 'Parcelle', actions: ['zoom', 'delete']});

        // Ajoute les infos
        this.addSelectionFromTable(oVmap["properties"]["cadastre"]["api"] + '/parcelles', 'id_par', tableParcelles, 'veremes_cadastre_parcelle');
    }

    // Ouvre le dernier des onglets
    var lastElement = this.aFormList_[this.aFormList_.length - 1];
    oVmap.getToolsManager().getInfoContainer().displayTabByCode(lastElement);
};

/**
 * Remove the cadastre map interactions
 * @returns {undefined}
 */
nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.removeMapInteractions = function () {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController.prototype.removeMapInteractions');

    // Désactive les évènements sur la carte
    oVmap.getMap().removeActionsOnMap();
    // Cache le tooltip
    oVmap.getMap().getMapTooltip().hide();
};

// Définit la directive et le controller
oVmap.module.directive('appCadastre', nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreDirective);
oVmap.module.controller('AppcadastreController', nsVmap.nsToolsManager.nsModules.Cadastre.prototype.cadastreController);
/* global oVmap, nsVmap, goog, ol, angular, vitisApp */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.LayersTree
 * cette classe permet l'initialisation de l'arborescence de couches
 */

goog.provide('nsVmap.nsMapManager.LayersTree');

goog.require('oVmap');

goog.require('MapJSON');

goog.require('nsVmap.Map');
goog.require('ol.proj');
goog.require('ol.proj.Projection');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Tile');
goog.require('ol.layer.Image');
goog.require('ol.source.OSM');
goog.require('ol.source.BingMaps');
goog.require('ol.source.TileWMS');
goog.require('ol.source.Image');
goog.require('ol.source.ImageWMS');
goog.require('ol.source.WMTS');
goog.require('ol.format.WMTSCapabilities');
goog.require('ol.tilegrid.TileGrid');

/**
 * @classdesc
 * Class {@link nsVmap.nsMapManager.LayersTree}: initializes the layers defined in data/map.json
 *
 * @constructor
 * @export
 */
nsVmap.nsMapManager.LayersTree = function () {
    oVmap.log("nsVmap.nsMapManager.LayersTree");
};

/**
 * Layer tree directive.
 * @return {angular.Directive} The Directive Definition Object.
 * @constructor
 */
nsVmap.nsMapManager.LayersTree.prototype.layertreeDirective = function () {
    oVmap.log("nsVmap.nsMapManager.LayersTree.prototype.layertreeDirective");
    return {
        restrict: 'A',
        scope: {
            'map': '=appMap',
            'proj': '=appProj',
            'lang': '=appLang'
        },
        controller: 'AppLayertreeController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/layers/layertree.html'
    };
};
oVmap.module.directive('appLayertree', nsVmap.nsMapManager.LayersTree.prototype.layertreeDirective);

/**
 * Directive for the layer opacity sliders
 * @return {angular.Directive} The Directive Definition Object.
 * @constructor
 */
nsVmap.nsMapManager.LayersTree.prototype.layerOpacitySliderDirective = function () {
    oVmap.log("nsVmap.nsMapManager.LayersTree.prototype.layerOpacitySliderDirective");
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            setTimeout(function () {
                var oOpacitySlider = new Slider(element[0], {
                    'value': scope['layer']['olLayer'].getOpacity() * 100,
                    'step': 1,
                    'min': 0,
                    'max': 100,
                    formatter: function (value) {
                        return value + ' %';
                    }
                });
                oOpacitySlider.on('change', function () {
                    var value = oOpacitySlider['getValue']();
                    scope['layer']['olLayer'].setOpacity(value / 100);
                });
            });
        }
    };
};
oVmap.module.directive('appLayerOpacitySlider', nsVmap.nsMapManager.LayersTree.prototype.layerOpacitySliderDirective);

/**
 * 
 * @param {object} $scope
 * @constructor
 * @ngInject
 * @export
 * @returns {undefined}
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController = function ($scope, $element) {
    oVmap.log("nsVmap.nsMapManager.LayersTree.prototype.LayertreeController");

    var this_ = this;

    /**
     * @private
     */
    this.scope_ = $scope;

    /**
     * The MapManager.layersTree
     * @type {object}
     */
    $scope['tree'] = oVmap.getMapManager().getLayersTree();

    /**
     * The current properties
     */
    this['properties'] = oVmap['properties'];

    /**
     * The current token
     */
    this['token'] = oVmap['properties']['token'];

    /**
     * Contains the layer to apply the filter
     */
    this['olFilteredLayer'] = {};

    this['refreshLayersEvents'] = [];

    if (goog.isDefAndNotNull(oVmap['properties']['vmap'])) {
        /**
         * true if the layers have to be collapsed
         */
        this['layers_collapsed'] = oVmap['properties']['vmap']['layers_collapsed'];
        /**
         * true if the tool have to be collapsed
         */
        this['layerstree_collapsed'] = oVmap['properties']['vmap']['layerstree_collapsed'];
    }

    this.loadTree();

    // Événements sur les couches
    var keepLoadedTiles = true;
    if (goog.isDefAndNotNull(vitisApp['oWebsocket'])) {
        vitisApp['oWebsocket'].on('event', function (event) {
            for (var i = 0; i < this_['refreshLayersEvents'].length; i++) {
                if (this_['refreshLayersEvents'][i]['event'] === event) {
                    if (oVmap['bRefreshWebsockets']) {
                        if (goog.isDefAndNotNull(this_['refreshLayersEvents'][i]['layer'])) {
                            if (goog.isDefAndNotNull(this_['refreshLayersEvents'][i]['layer'].refreshWithTimestamp)) {
                                this_['refreshLayersEvents'][i]['layer'].refreshWithTimestamp(keepLoadedTiles);
                            }
                        }
                    }
                }
            }
        });
    }

    // Ferme les menus dropdowns des couches quand on clique ailleurs que sur eux ou sur leur bouton
    $('body').click(function (evt) {
        if ($(evt.target).hasClass('.layer-menu'))
            return;
        if ($(evt.target).closest('.layer-menu').length)
            return;
        if ($(evt.target).hasClass('.layer-menu-button'))
            return;
        if ($(evt.target).closest('.layer-menu-button').length)
            return;
        $scope.$applyAsync(function () {
            this_.closeLayersMenus();
        });
    });

    // Affiche les modales en plein écran pour la version mobile
    if (oVmap['properties']['is_mobile']) {
        $element.find('.modal').on('shown.bs.modal', function () {
            $('.modal-backdrop.fade.in').hide();
            $('.modal.fade.in').find('.modal-dialog').addClass('mobile-full-modal');
        });
    }
};
oVmap.module.controller('AppLayertreeController', nsVmap.nsMapManager.LayersTree.prototype.LayertreeController);

/**
 * Set a layer visible or not
 * @param {ol.layer.Base} layer
 * @param {boolean} bVisible
 * @export
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.setVisible = function (layer, bVisible) {
    oVmap.log('nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.setVisible', bVisible);

    layer.setVisible(bVisible);
    this['map'].render();
};

/**
 * Set a layer group selectable or not
 * @param {object} node service node in the layers tree
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.setGroupSelectable = function (node) {

    // Affiche ou cache les couches mémorisées
    for (var i = 0; i < node['children'].length; i++) {
        if (node['children'][i]['olLayer'].get('select') !== undefined)
            node['children'][i]['olLayer'].set('select', node['selectable']);
    }

    this.memoriseGroupSelectable(node);
};

/**
 * Function returns if a group is full visible/hidden or half visible
 * @param {object} node service node in the layers tree
 * @returns {Boolean|null} true if all layers from a group are visible, false if they are all hidden, null otherwise
 * @export
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.isGroupVisible = function (node) {

    var bGroupVisible;
    var iVisibleLayers = 0;

    // Affiche ou cache les couches mémorisées
    for (var i = 0; i < node['children'].length; i++) {
        if (node['children'][i]['olLayer'].getVisible(node['visible']) === true) {
            iVisibleLayers++;
        }
    }

    if (iVisibleLayers === node['children'].length)
        bGroupVisible = true;
    else if (iVisibleLayers === 0)
        bGroupVisible = false;
    else
        bGroupVisible = null;

    return bGroupVisible;

};

/**
 * Set a layer group visible or invisible
 * @param {object} node service node in the layers tree
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.setGroupVisible = function (node) {

    // Affiche ou cache les couches mémorisées
    for (var i = 0; i < node['children'].length; i++) {
        node['children'][i]['olLayer'].setVisible(node['visible']);
    }

    this.memoriseGroupVisible(node);
};

/**
 * Memorise the selectable layers in a group
 * @param {object} node service node in the layers tree
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.memoriseGroupSelectable = function (node) {

    if (node !== undefined) {
        var aGroup = node['children'];

        if (node.selectableLayers === undefined)
            node.selectableLayers = [];

        // Mémorise les couches affichées
        node.selectableLayers.length = 0;
        for (var i = 0; i < aGroup.length; i++) {
            if (aGroup[i]['olLayer'].get('select') === true)
                node.selectableLayers.push(aGroup[i]['olLayer']);
        }

        if (node.selectableLayers.length === 0)
            node['selectable'] = false;
        else
            node['selectable'] = true;
    }
};

/**
 * Memorise the visible layers in a group
 * @param {object} node service node in the layers tree
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.memoriseGroupVisible = function (node) {

    if (node !== undefined) {
        var aGroup = node['children'];

        if (node['visibleLayers'] === undefined)
            node['visibleLayers'] = [];

        // Mémorise les couches affichées
        node['visibleLayers'].length = 0;
        for (var i = 0; i < aGroup.length; i++) {
            if (aGroup[i]['olLayer'].getVisible() === true)
                node['visibleLayers'].push(aGroup[i]['olLayer']);
        }

        if (node['visibleLayers'].length === 0)
            node['visible'] = false;
        else
            node['visible'] = true;
    }
};

/**
 * Function that reload the layers tree
 * @export
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.reloadTree = function () {
    oVmap.log('nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.reloadTree');

    // recupère une copie de l'arbre des couches
    var oTree = jQuery.extend(true, {}, oVmap.getMapManager().getLayersTree());

    // Change la variable oLayersTree
    oVmap.getMapManager().setLayersTree(oTree);

    // Vide les couches en cours de la carte
    if (this['map'].getLayers().getArray().length > 0)
        this['map'].getLayers().clear();

    this.scope_['tree'] = oTree;

    // relance le chargement des couches avec le nouvel arbre
    this.loadTree();

    oVmap.resizeLayerTools(false);
};

/**
 * Load layers from the tree
 * @returns {undefined}
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.loadTree = function () {
    oVmap.log('nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.loadTree');

    if (this['map'].getLayers().getArray().length > 0)
        this['map'].getLayers().clear();

    oVmap.log(this.scope_['tree']);

    var tileSize = [oVmap['properties']['vmap']['wmsTilesWidth'], oVmap['properties']['vmap']['wmsTilesHeight']];

    /**
     * Objet permettant de lancer des fonctions utiles
     * pour parser la définition de la carte
     * @type MapJSON
     */
    var oMapJSON = new MapJSON({
        'properties': oVmap['properties']
    });

    /**
     * Vue à utiliser
     * @type ol.View
     */
    var olView = oMapJSON.getViewFromDef(this.scope_['tree'], {
        'size': this['map'].getSize(),
        'tileSize': tileSize
    });

    /**
     * Tableau de couches ol
     * @type Array<ol.layer>
     */
    var olLayers = oMapJSON.getLayersFromDef(this.scope_['tree'], {
        'size': this['map'].getSize(),
        'tileSize': tileSize
    });

    // Définit la vue de la carte
    this.addView(olView);

    // Crée les évènements sur les couches
    goog.array.clear(this['refreshLayersEvents']);
    for (var i = 0; i < olLayers.length; i++) {
        var aEvents = olLayers[i].get('events');
        if (goog.isArray(aEvents)) {
            goog.array.removeDuplicates(aEvents);
            for (var ii = 0; ii < aEvents.length; ii++) {
                this['refreshLayersEvents'].push({
                    'layer': olLayers[i],
                    'event': aEvents[ii]
                });
            }
        }
    }

    // Définit les couches de la carte
    for (var i = 0; i < olLayers.length; i++) {
        this.addLayer(olLayers[i]);
    }

};

/**
 * Add the olView
 * @param {object} olView
 * @returns {undefined}
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.addView = function (olView) {
    oVmap.log('nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.addView');

    // Récupère l'ancienne étendue
    var oldExtent = this['map'].getView().calculateExtent(this['map'].getSize());

    // Récupère l'ancienne et la nouvelle projection
    var oldProjection = this['map'].getView().getProjection().getCode();
    var newProjection = olView.getProjection().getCode();

    // Set le home position
    olView.set('homePosition', {
        center: olView.getCenter(),
        resolution: olView.getResolution()
    });

    // Récupère l'ancien home position
    var oldPosition = this['map'].getView().get('homePosition');

    oVmap.getMap().setOpenLayersView(olView);
    this['map'].setView(olView);
    this['proj'] = olView.getProjection().getCode();

    // Reprojette en cas de changment de carte
    if (goog.isDef(oldProjection) && goog.isDef(newProjection) && goog.isDef(oldExtent) && goog.isDef(oldPosition)) {
        // Reprojette l'étendue
        var newExtent = ol.proj.transformExtent(oldExtent, oldProjection, newProjection);
        this['map'].getView().fit(newExtent, {
            nearest: true
        });

        // Reprojette les features
        oVmap.getMap().reprojectFeatures(oldProjection, newProjection);
    }

    // Met à jour l'outil d'overview en fonction de la nouvelle carte
    var overviewMap = oVmap.getToolsManager().getBasicTools().getControls().getOverviewMap();
    if (overviewMap !== undefined) {
        overviewMap.ovmap_.setView(new ol.View({
            resolution: olView.getProperties().resolution,
            rotation: olView.getProperties().rotation,
            center: olView.getProperties().center,
            projection: olView.getProjection().getCode()
        }));
    }

    // Met à jour l'outil CurrentProjection & MapName
    $("#current-projection").html(oVmap['oProjections'][this['map'].getView().getProjection().getCode()]);
    var currentMap = "";
    var vMapCatalog = oVmap.getMapManager().getMapCatalog();
    for (var i = 0; i < vMapCatalog['maps'].length; i++) {
        if (vMapCatalog['maps'][i]['used'] === true) {
            var currentMapName = vMapCatalog['maps'][i]['name'];
        }
    }
    $("map-name").html(currentMapName);
};

/**
 * Add a layer on the map
 * @param {object} olLayer
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.addLayer = function (olLayer) {
    oVmap.log('nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.addLayer');

    this['map'].addLayer(olLayer);
    oVmap.layerAdded(olLayer);
};

/**
 * Get the filter FormReader scope
 * @returns {angular.scope}
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.getFilterFormReaderScope = function () {
    return angular.element($('#layerstree_filter_formreader').children()).scope();
};

/**
 * Display the layer filter form
 * @param {ol.layer} olLayer
 * @export
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.displayFilterLayerModal = function (olLayer) {
    oVmap.log('nsVmap.nsMapManager.LayersTree.LayertreeController.displayFilterLayerModal');

    var this_ = this;

    this['olFilteredLayer'] = olLayer;
    if (!goog.isDefAndNotNull(olLayer.get('filter_form'))) {
        olLayer.set('filter_form', {
            'search': {}
        });
    }
    if (!goog.isDefAndNotNull(olLayer.get('filter_values'))) {
        olLayer.set('filter_values', {
            'search': {}
        });
    }

    var oFormDefinition = olLayer.get('filter_form');
    var oFormValues = olLayer.get('filter_values');
    var sLayerEmbedJs = olLayer.get('filter_form_embedjs');

    // Supprime les valeurs qui sont égales à -1000000

    // Bouton submit
    var button = {
        "fields": [{
                "type": "button",
                "class": "btn-ungroup btn-group-sm hidden",
                "nb_cols": 12,
                "buttons": [{
                        "visibleAllTabs": true,
                        "id": "layerstree_filter_formreader_submit_btn",
                        "type": "submit",
                        "label": "FORM_UPDATE",
                        "name": "form_submit",
                        "class": "btn-primary"
                    }
                ]
            }
        ]
    };

    // Ajout du bouton caché submit (si il n'existe pas déjà)
    if (!angular.equals(oFormDefinition['search']['rows'][oFormDefinition['search']['rows'].length - 1], button))
        oFormDefinition['search']['rows'].push(button);

    // Evènement submit
    oFormDefinition['search']['event'] = function (oFormValuesResulted) {
        olLayer.set('filter_values', oFormValuesResulted);
        olLayer['applyFilter']();
        $('#layerstree-filter-modal').modal('hide');
        $.notify("Opération réalisée avec succès, les couches de la carte se mettent à jour", "info");
    };

    var filterFormReaderScope = this.getFilterFormReaderScope();
    filterFormReaderScope.$evalAsync(function () {

        filterFormReaderScope['ctrl']['setDefinitionName']('search');
        filterFormReaderScope['ctrl']['setFormValues'](oFormValues);
        filterFormReaderScope['ctrl']['setFormDefinition'](oFormDefinition);
        filterFormReaderScope['ctrl']['loadForm']();

        // eval du js + call constructor form

        if (typeof destructor_form === "function") {
            destructor_form();
        }
        // Suppression de la fonction "constructor_form" (sinon s'éxècute à chaque ouverture de formulaire).
        if (typeof constructor_form === "function"){
            constructor_form = undefined;
        }

        if(goog.isDefAndNotNull(sLayerEmbedJs)){
            eval(sLayerEmbedJs);
            constructor_form(filterFormReaderScope, null);
        }

        $('#layerstree-filter-modal').modal('show');
    });
};

/**
 * Display/hide the layer menu
 * @param {ol.Layer} oLayer
 * @export
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.toggleLayerMenu = function (oLayer, $event) {
    oVmap.log('nsVmap.nsMapManager.LayersTree.LayertreeController.toggleLayerMenu');

    if (oLayer['displayedMenu'] === true) {
        this.closeLayersMenus();
    } else {
        this.closeLayersMenus();
        oLayer['displayedMenu'] = true;
    }

    // Resize la fenêtre
    setTimeout(function () {
        var iMenuTop = $($event.target).closest('.layers-tree-ul').find('.layer-menu').position()['top'];
        var iBodyHeight = $('body').height();
        var iMaxHeight = iBodyHeight - iMenuTop - 40;
        $($event.target).closest('.layers-tree-ul').find('.layer-menu').css('max-height', iMaxHeight + 'px');
    });
};

/**
 * Close all the layers manus
 * @export
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.closeLayersMenus = function () {
//    oVmap.log('nsVmap.nsMapManager.LayersTree.LayertreeController.closeLayersMenus');

    for (var i = 0; i < this.scope_['tree']['children'].length; i++) {
        if (goog.isDefAndNotNull(this.scope_['tree']['children'][i]['children'])) {
            for (var ii = 0; ii < this.scope_['tree']['children'][i]['children'].length; ii++) {
                if (goog.isDefAndNotNull(this.scope_['tree']['children'][i]['children'][ii]['olLayer'])) {
                    this.scope_['tree']['children'][i]['children'][ii]['displayedMenu'] = false;
                }
            }
        }
    }
};

/**
 * Toggle the sublayer sSublayer in the olLayer
 * @param {ol.Layer} olLayer
 * @param {string} sSublayer
 * @param {string} sCheckboxId
 * @export
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.toggleSubLayer = function (olLayer, sSublayer, sCheckboxId) {
    oVmap.log('nsVmap.nsMapManager.LayersTree.LayertreeController.toggleSubLayer');

    // Vérifie que la sous-couche soit bien disponibles
    var aAvaliableSublayers = olLayer.get('sublayers');
    if (aAvaliableSublayers.indexOf(sSublayer) === -1) {
        console.error('Sublayer not avaliable');
        return null;
    }

    // Vérifie que les paramètres soient bien disponibles
    var oParams = olLayer.getSource().getParams();
    if (!goog.isDefAndNotNull(oParams)) {
        console.error('Params not avaliable');
        return null;
    }
    if (!goog.isString(oParams['LAYERS'])) {
        console.error('Params[LAYERS] not avaliable');
        return null;
    }

    var isSublayerActive = this.isSublayerActive(olLayer, sSublayer);
    if (isSublayerActive === true) {
        this.unactiveSublayer(olLayer, sSublayer, sCheckboxId);
    } else if (isSublayerActive === false) {
        this.activeSublayer(olLayer, sSublayer);
    }
};

/**
 * Return true if the sublayer sSublayer is active on olLayer
 * @param {ol.Layer} olLayer
 * @param {string} sSublayer
 * @returns {boolean}
 * @export
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.isSublayerActive = function (olLayer, sSublayer) {

    // Vérifie que la sous-couche soit bien disponibles
    var aActiveSublayers = olLayer.get('activeSublayers');
    if (!goog.isDefAndNotNull(aActiveSublayers)) {
        console.error('aActiveSublayers undefined');
        return false;
    }

    if (aActiveSublayers.indexOf(sSublayer) !== -1) {
        return true;
    } else {
        return false;
    }
};

/**
 * Active the sublayer sSublayer in olLayer
 * @param {ol.Layer} olLayer
 * @param {string} sSublayer
 * @export
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.activeSublayer = function (olLayer, sSublayer) {
    oVmap.log('nsVmap.nsMapManager.LayersTree.LayertreeController.activeSublayer');

    // Vérifie que la sous-couche soit bien disponibles
    var aAvaliableSublayers = olLayer.get('sublayers');
    var aActiveSublayers = olLayer.get('activeSublayers');
    if (aAvaliableSublayers.indexOf(sSublayer) === -1) {
        console.error('Sublayer not avaliable');
        return null;
    }

    // Vérifie que les paramètres soient bien disponibles
    var oParams = olLayer.getSource().getParams();
    if (!goog.isDefAndNotNull(oParams)) {
        console.error('Params not avaliable');
        return null;
    }
    if (!goog.isString(oParams['LAYERS'])) {
        console.error('Params[LAYERS] not avaliable');
        return null;
    }
    if (aActiveSublayers.indexOf(sSublayer) !== -1) {
        console.error('sublayer already active in layer');
        return null;
    }

    // Ajoute la sous-couche
    var tmpActiveSublayers = [];
    for (var i = 0; i < aAvaliableSublayers.length; i++) {
        if (aAvaliableSublayers[i] == sSublayer ||
                aActiveSublayers.indexOf(aAvaliableSublayers[i]) !== -1) {
            tmpActiveSublayers.push(aAvaliableSublayers[i]);
        }
    }

    // Enregistre le résultat
    olLayer.set('activeSublayers', tmpActiveSublayers);
    oParams['LAYERS'] = tmpActiveSublayers.join(',');
    olLayer.getSource().updateParams(oParams);
};

/**
 * Unactive the sublayer sSublayer in olLayer
 * @param {ol.Layer} olLayer
 * @param {string} sSublayer
 * @param {string} sCheckboxId
 * @export
 */
nsVmap.nsMapManager.LayersTree.prototype.LayertreeController.prototype.unactiveSublayer = function (olLayer, sSublayer, sCheckboxId) {
    oVmap.log('nsVmap.nsMapManager.LayersTree.LayertreeController.unactiveSublayer');

    // Vérifie que la sous-couche soit bien disponibles
    var aAvaliableSublayers = olLayer.get('sublayers');
    if (aAvaliableSublayers.indexOf(sSublayer) === -1) {
        console.error('Sublayer not avaliable');
        return null;
    }

    // Vérifie que les paramètres soient bien disponibles
    var oParams = olLayer.getSource().getParams();
    if (!goog.isDefAndNotNull(oParams)) {
        console.error('Params not avaliable');
        return null;
    }
    if (!goog.isString(oParams['LAYERS'])) {
        console.error('Params[LAYERS] not avaliable');
        return null;
    }

    var aSublayers = oParams['LAYERS'].split(',');

    // Vérification que au moins une couche est définie
    if (aSublayers.length <= 1) {
        $.notify('Au moins une couche doit être présente par calque', 'error');
        $(sCheckboxId.replace(':', '\\:')).prop('checked', true);
        return null;
    }

    // Vide la sous-couche
    if (aSublayers.indexOf(sSublayer) !== -1) {
        aSublayers.splice(aSublayers.indexOf(sSublayer), 1);
    } else {
        console.error('sublayer not defined in layer');
        return null;
    }

    // Enregistre le résultat
    olLayer.set('activeSublayers', aSublayers);
    oParams['LAYERS'] = aSublayers.join(',');
    olLayer.getSource().updateParams(oParams);
};
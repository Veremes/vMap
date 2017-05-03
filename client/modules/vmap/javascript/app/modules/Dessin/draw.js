/* global oVmap, ol, nsVmap, bootbox, goog */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.nsModules.Draw
 * cette classe permet l'initialisation des outils de dessin
 */
goog.provide('nsVmap.nsToolsManager.nsModules.Draw');

goog.require('oVmap');

goog.require('ol.interaction.Draw');
goog.require('ol.style.Style');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');
goog.require('ol.style.Circle');
goog.require('ol.Sphere');
goog.require('ol.source.Vector');
goog.require('ol.layer.Vector');
goog.require('ol.Collection');
goog.require('ol.interaction.Modify');
goog.require('ol.interaction.Select');
goog.require('ol.Overlay');
goog.require('ol.interaction.Draw');
goog.require('ol.geom.LineString');
goog.require('ol.geom.Point');
goog.require('ol.geom.Polygon');
goog.require('ol.geom.Circle');
goog.require('goog.asserts');
goog.require('ol.extent');
goog.require('ol.geom.GeometryType');
goog.require('ol.geom.SimpleGeometry');
goog.require('ol.geom.flat.deflate');
goog.require('ol.proj');
goog.require('ol.format.GeoJSON');


/**
 * @classdesc
 * Class {@link nsVmap.nsToolsManager.nsModules.Draw}: Add the draw tools defined in data/tools.json
 *
 * @constructor
 * @export 
 */
nsVmap.nsToolsManager.nsModules.Draw = function (opt_options) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Draw');
    
    opt_options = goog.isDef(opt_options) ? opt_options : {};

    /**
     * Fields for the feature form
     * name: Texte à afficher
     * id: identifiant du champ (sans espaces ni paranthèses)
     * type: text/color/number
     * required: "true" si le champ est requis
     * value: valeur par défaut
     * @type {object}
     * @private
     */
    this['fields_'] = [{
            "name": "Nom",
            "id": "Nom",
            "type": "text",
            "required": "true",
            "value": ""
        }, {
            "name": "Thème / Projet",
            "id": "theme",
            "type": "text",
            "required": "false",
            "value": ""
        }, {
            "name": "Commentaire",
            "id": "commentaire",
            "type": "text",
            "required": "false",
            "value": ""
        }, {
            "name": "Afficher l'étiquette",
            "id": "ShowName",
            "type": "boolean",
            "required": "",
            "value": ""
        }, {
            "name": "Afficher la partie vectorielle",
            "id": "ShowVector",
            "type": "boolean",
            "required": "",
            "value": ""
        }, {
            "name": "Couleur de fond",
            "id": "Fill",
            "type": "color",
            "required": "false",
            "value": "rgba(54,184,255,0.6)"
        }, {
            "name": "Couleur du contour",
            "id": "Stroke",
            "type": "color",
            "required": "false",
            "value": "rgba(0,0,0,0.4)"
        }, {
            "name": "Taille du contour",
            "id": "StrokeSize",
            "type": "number",
            "required": "false",
            "value": "2"
        }, {
            "name": "Couleur du texte",
            "id": "Text",
            "type": "color",
            "required": "false",
            "value": "rgba(0,0,0,1)"
        }, {
            "name": "Fond du texte",
            "id": "TextBackground",
            "type": "color",
            "required": "false",
            "value": "rgba(48,183,255,1)"
        }, {
            "name": "Taille du texte",
            "id": "TextSize",
            "type": "number",
            "required": "false",
            "value": "12"
        }];

    /**
     * features to add
     * @type {object}
     * @private
     */
    this['features_'] = opt_options['features'];
};
goog.exportProperty(nsVmap.nsToolsManager.nsModules, 'Draw', nsVmap.nsToolsManager.nsModules.Draw);


/**
 * App-specific directive wrapping the draw tools. The directive's
 * controller has a property "map" including a reference to the OpenLayers
 * map.
 *
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawDirective = function () {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawDirective");
    return {
        restrict: 'C',
        scope: {
            'map': '=appMap',
            'lang': '=appLang',
            'currentAction': '=appAction'
        },
        controller: 'AppdrawController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/modules/draw.html'
    };
};

/**
 * Draw controller
 * @ngInject
 * @export
 * @constructor
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController = function () {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController");

    // test de la validité du token
    oVmap.testToken();

    var drawController = this;

    /**
     * List of the fields description
     * @type {object}
     */
    this['fields_'] = oVmap.getToolsManager().getTool('Draw').getFields();

    /**
     * features to add
     * @type {object}
     * @private
     */
    this['features_'] = oVmap.getToolsManager().getTool('Draw').getFeatures();

    /**
     * List of the export formats
     * @type {array<string>}
     * @private
     */
    this['exportFormats_'] = [
        'GeoJSON'
    ];

    /**
     * List of the export formats constructors
     * @type {array<string>}
     * @private
     */
    this['exportFormatsConstructors_'] = [ol.format.GeoJSON];

    /**
     * @type {ol.Sphere}
     * @private
     */
    this.wgs84Sphere_ = new ol.Sphere(6378137);

    /**
     * @type {ol.map}
     * @private
     */
    this.map_ = oVmap.getMap().getOLMap();

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

    /**
     * The help draw-tooltip element.
     * @type {Element}
     * @private
     */
    this.helpTooltipElement_;

    /**
     * Overlay to show the help messages.
     * @type {ol.Overlay}
     * @private
     */
    this.helpTooltip_;

    /**
     * The draw draw-tooltip element.
     * @type {Element}
     * @private
     */
    this.drawTooltipElement_;

    /**
     * Overlay to show the drawment.
     * @type {ol.Overlay}
     * @private
     */
    this.drawTooltip_;

    /**
     * @type {ol.interaction.Draw}
     * @private
     */
    this.draw_;

    /**
     * @type {ol.interaction.Modify}
     * @private
     */
    this.modify_ = new ol.interaction.Modify({
        features: this.oOpenLayersOverlayFeatures_
    });

    /**
     * @type {ol.interaction.Select}
     * @private
     */
    this.editInfosClick_ = new ol.interaction.Select({
        layers: [this.oOpenLayersOverlay_]
    });

    this.editInfosClick_.on('select', function () {
        var aSelectedFeatures = this.editInfosClick_.getFeatures().getArray();
        this.editFeatureInfos(aSelectedFeatures[0]);
        // Supprime les features de la editInfosClick_
        this.editInfosClick_.getFeatures().clear();
    }, this);

    /**
     * @type {ol.interaction.Select}
     * @private
     */
    this.showInfosClick_ = new ol.interaction.Select({
        layers: [this.oOpenLayersOverlay_]
    });

    this.showInfosClick_.on('select', function () {
        var aSelectedFeatures = this.showInfosClick_.getFeatures().getArray();
        this.displayFeatureInfos(aSelectedFeatures[0]);
        // Supprime les features de la showInfosClick
        this.showInfosClick_.getFeatures().clear();
    }, this);

    /**
     * @type {ol.interaction.Select}
     * @private
     */
    this.selectHover_ = new ol.interaction.Select({
        layers: [this.oOpenLayersOverlay_],
        condition: ol.events.condition.pointerMove
    });

    /**
     * @type {ol.interaction.Select}
     * @private
     */
    this.delete_ = new ol.interaction.Select({
        layers: [this.oOpenLayersOverlay_]
    });

    this.delete_.on('select', function () {
        var aSelectedFeatures = this.delete_.getFeatures().getArray();
        var aOverlays = [];
        var aDrawsToDelete = [];

        // Supprime les features du featureOverlay et leurs annotations
        this.removeFeaturesWithControl(aSelectedFeatures);
//		this.removeDrawsInteractions();		
    }, this);

    this.geodesicCheckbox_ = document.getElementById('geodesic');

    // Ajoute les features 
    if (this['features_'] !== undefined)
        this.addFeatures(this['features_']);
};

/**
 * Creates a new draw draw-tooltip
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.createDrawTooltip = function (oFeature) {
    if (this.drawTooltipElement_) {
        this.drawTooltipElement_.parentNode.removeChild(this.drawTooltipElement_);
    }
    this.drawTooltipElement_ = document.createElement('div');
    this.drawTooltipElement_.className = 'draw-tooltip draw-tooltip-draw';
    this.drawTooltip_ = new ol.Overlay({
        element: this.drawTooltipElement_,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    this.drawTooltip_.set('type', 'draw');

    if (oFeature !== undefined)
        this.drawTooltip_.set('feature', oFeature);

    this.map_.addOverlay(this.drawTooltip_);
};

/**
 * Set to the Feature a tooltip
 * @param {ol.Feature} olFeature Feature to set stuff
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.setFeatureTooltip = function (olFeature) {

    if (olFeature.get('infoValues') === undefined)
        return;

    var i = 0;

    // Crée une nouvelle annotation
    this.createDrawTooltip(olFeature);

    for (key in olFeature.get('infoValues')) {
        if (i == 0)
            this.drawTooltipElement_.innerHTML = olFeature.get('infoValues')[key];
        i++;
    }

    // positionne la tooltip
    // this.drawTooltip_.setPosition(olFeature.getGeometry().getLastCoordinate());
    this.drawTooltip_.setPosition(this.getTooltipPosition(olFeature.getGeometry()));


    this.drawTooltipElement_.className = 'draw-tooltip draw-tooltip-static';
    this.drawTooltip_.setOffset([0, -7]);
    this.drawTooltipElement_.style.color = olFeature.get('infoValues')['Text'];
    this.drawTooltipElement_.style.backgroundColor = olFeature.get('infoValues')['TextBackground'];
    this.drawTooltipElement_.style.fontSize = olFeature.get('infoValues')['TextSize'];
    if (olFeature.get('infoValues')['ShowName'] === "false")
        this.drawTooltipElement_.style.opacity = 0;
    // Si la partie vectorielle ne doit pas être affichée, alors on affiche pas non plus l'étiquette
    if (olFeature.get('infoValues')['ShowVector'] === "false")
        this.drawTooltipElement_.style.opacity = 0;

    // unset draw-tooltip so that a new one can be created
    this.drawTooltipElement_ = null;
    this.createDrawTooltip(olFeature);
    this.showHideAnotations();
    this.removeDrawsInteractions();
};

/**
 * Set the tooltip position
 * @param {ol.geom.Geometry} geom The feature to place the tooltip in
 * return {ol.Coordinate} The coordinates where place the tooltip
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.getTooltipPosition = function (geom) {

    if (geom.getType() === 'Polygon') {

        var position = geom.getInteriorPoint().getLastCoordinate();

    } else if (geom.getType() === 'MultiPolygon') {

        var position = geom.getInteriorPoints().getLastCoordinate();

    } else if (geom.getType() === 'LineString') {

        var centerPoint = Math.round(geom.getCoordinates().length / 2);
        var position = geom.getCoordinates()[centerPoint];

    } else if (geom.getType() === 'Circle') {

        var position = geom.getCenter();

    } else if (geom.getType() === 'Point' || geom.getType() === 'MultiPoint') {

        var position = geom.getLastCoordinate();

    } else if (geom.getType() === 'GeometryCollection') {

        return 0;

    } else {
        return geom.getLastCoordinate();
    }

    return position;
};

/**
 * Creates a new help draw-tooltip
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.createHelpTooltip = function () {
    if (this.helpTooltipElement_) {
        this.helpTooltipElement_.parentNode.removeChild(this.helpTooltipElement_);
    }
    this.helpTooltipElement_ = document.createElement('div');
    this.helpTooltipElement_.className = 'draw-tooltip draw-tooltip-help';
    this.helpTooltip_ = new ol.Overlay({
        element: this.helpTooltipElement_,
        offset: [15, 0],
        positioning: 'center-left'
    });
    this.map_.addOverlay(this.helpTooltip_);
};

/**
 * Add a openLayers interaction
 * @param {ol.geom.GeometryType} type Type of interaction
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.addInteraction = function (type) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.addInteraction');

    oVmap.getMap().getMapTooltip().displayMessage('Cliquer pour commencer à dessiner');

    this.draw_ = oVmap.getMap().setDrawInteraction({type: type, features: this.oOpenLayersOverlayFeatures_}, 'draw-draw' + type);

    this.draw_.on('drawstart',
            function (evt) {
                if (type === 'Point' || type === 'Circle') {
                    oVmap.getMap().getMapTooltip().displayMessage('Cliquez pour terminer le dessin');
                } else if (type === 'LineString' || type === 'Polygon') {
                    oVmap.getMap().getMapTooltip().displayMessage('Double-cliquez pour terminer le dessin');
                }
            }, this);

    this.draw_.on('drawend',
            function (evt) {

                $("#draw-edit-modal-header").addClass('hidden');

                this.setInfosToFeature(evt.feature);
                this.editFeatureInfos(evt.feature);
                oVmap.getMap().getMapTooltip().hide();

                // Fonctions appelées après modification de la feature
                evt.feature.on('change', function () {
                    // Bouge la tooltip lors qu'on bouge la feature
                    aOverlays = oVmap.getMap().getOLMap().getOverlays();
                    for (var i = aOverlays.getArray().length - 1; i >= 0; i--) {
                        if (aOverlays.getArray()[i].get('feature') === evt.feature) {
                            aOverlays.getArray()[i].setPosition(this.getTooltipPosition(evt.feature.getGeometry()));
                        }
                    }
                    // Recalcule la superficie et le périmètre
                    this.setInfosToFeature(evt.feature);
                }, this);
            }, this);
};

/**
 * Add the features in the oOpenLayersOverlay_
 * @param {object} oFeatures Features to add
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.addFeatures = function (oFeatures) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.addFeatures');

    // Récupère l'objet features depuis la chaine de caractères
    var formatConstructors = [
        ol.format.GPX,
        ol.format.GeoJSON,
        ol.format.IGC,
        ol.format.KML,
        ol.format.TopoJSON
    ];

    var aFeaturesReaded = [];

    // Essaye de lire la source celon les formats suivants
    for (var i = 0; i < formatConstructors.length; i++) {
        var format = new formatConstructors[i]();
        try {
            var features = format.readFeatures(oFeatures);
            // Si la lecture a réussi, alors oFeaturesReaded prend la valeur de la géométrie
            if (features.length > 0) {
                aFeaturesReaded = features;
                i = formatConstructors.length;
            }
        } catch (err) {
        }
    }

    for (var i = 0; i < aFeaturesReaded.length; i++) {

        // Le GeoJSON ne peut pas lire les cercles, alors 
        // si une des figures en est un, il faut le recréer
        if (aFeaturesReaded[i].get('Type') === 'Cercle') {

            var center = aFeaturesReaded[i].get('Coordinates')[0];
            var radius = aFeaturesReaded[i].get('Coordinates')[1];

            var olCircle = new ol.geom.Circle([NaN, NaN]);

            olCircle.setCenterAndRadius(center, radius, 'XY');
            aFeaturesReaded[i].setGeometry(olCircle);
        }

        this.oOpenLayersOverlay_.getSource().addFeature(aFeaturesReaded[i]);
        this.setFeatureTooltip(aFeaturesReaded[i]);
        this.setFeatureStyle(aFeaturesReaded[i]);

        // Fonctions après modification de la feature
        var drawController = this;
        aFeaturesReaded[i].on('change', function () {
            // Bouge la tooltip lors qu'on bouge la feature
            aOverlays = oVmap.getMap().getOLMap().getOverlays();
            for (var ii = aOverlays.getArray().length - 1; ii >= 0; ii--) {
                if (aOverlays.getArray()[ii].get('feature') === this) {
                    aOverlays.getArray()[ii].setPosition(drawController.getTooltipPosition(this.getGeometry()));
                }
            }
            ;
            // Recalcule la superficie et le périmètre
            drawController.setInfosToFeature(this);
        }, aFeaturesReaded[i]);
    }
    ;
};

/**
 * Remove the features in the array
 * @param {array<ol.Feature>} aFeatures Features to delete
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.removeFeatures = function (aFeatures) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.removeFeatures');

    // Supprime les features du featureOverlay et leurs annotations
    for (var i = aFeatures.length - 1; i >= 0; i--) {
        // Supprime les annotations
        aOverlays = oVmap.getMap().getOLMap().getOverlays().getArray();
        aDrawsToDelete = [];
        for (var ii = aOverlays.length - 1; ii >= 0; ii--) {
            if (aOverlays[ii].get('feature') === aFeatures[i] || aOverlays[ii].get('feature') === 'info') {
                aDrawsToDelete.push(aOverlays[ii]);
            }
        }
        for (var ii = aDrawsToDelete.length - 1; ii >= 0; ii--) {
            oVmap.getMap().getOLMap().getOverlays().remove(aDrawsToDelete[ii]);
        }
        // Supprime la feature
        this.oOpenLayersOverlay_.getSource().removeFeature(aFeatures[i]);
        this.removeDrawsInteractions();
    }

    // Change la propriété 'id' des dessins restants
    aFeatures = this.oOpenLayersOverlayFeatures_.getArray();
    for (var i = 0; i < aFeatures.length; i++) {
        aFeatures[i].set('Id', i);
    }
};

/**
 * Remove the features in the array with a control modal
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.removeFeaturesWithControl = function (aFeatures) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.removeFeaturesWithControl');

    var ii = 0;
    var featureName = [];
    var featureId = [];
    var drawController = this;
    var noms = "";
    var currentPosition = this.map_.getView().getCenter();
    var currentZoom = this.map_.getView().getZoom();

    // Zoom sur la feature
    if (aFeatures.length === 1)
        this.zoomToFeature(aFeatures[0]);


    // Récupère le premier champ de chaque dessin
    for (var i = 0; i < aFeatures.length; i++) {
        ii = 0;
        featureId.push(aFeatures[i].get('Id'));
        for (key in aFeatures[i].get('infoValues')) {
            if (ii === 0)
                featureName.push(aFeatures[i].get('infoValues')[key]);
            ii++;
        }
    }
    ;

    var message = '';

    if (featureName.length === 1)
        message = "<h4>Etes-vous certain de vouloir supprimer le dessin: <br><br> Id: " + featureId[0] + ", Nom: " + featureName[0] + " ?</h4>";
    else if (featureName.length > 1) {

        for (var i = 0; i < featureName.length; i++) {

            noms += "<br> Id: " + featureId[i] + ", Nom: " + featureName[i] + "";

        }
        ;
        message = "<h4>Etes-vous certain de vouloir supprimer les dessins ci-dessous ? <br>" + noms + " </h4>";
    } else
        return;

    bootbox.confirm(message, function (result) {
        if (result === true)
            drawController.removeFeatures(aFeatures);

        drawController.map_.getView().setCenter(currentPosition);
        drawController.map_.getView().setZoom(currentZoom);
    });
};

/**
 * Remove the selected by the checkbox draw feature
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.removeSelectedFeatures = function () {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.removeSelectedFeatures");

    // Récupère les Id des features à supprimer
    var ids = $.map($('#draw-features-list-table').bootstrapTable('getSelections'), function (row) {
        return row['column1'];
    });

    var aFeaturesToDelete = [];
    var aFeatures = this.oOpenLayersOverlayFeatures_.getArray();

    for (var i = 0; i < ids.length; i++) {
        aFeaturesToDelete.push(aFeatures[ids[i]]);
    }

    this.removeFeaturesWithControl(aFeaturesToDelete);

};

/**
 * Cancel the editFeature : if the feature already exists, the function just close the modal
 * but if the feature is being created, the function remove the created points
 * @param {ol.Feature} olFeature feature to cancel
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.calcelEditFeature = function (olFeature) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.calcelEditFeature');
    if (olFeature.get('infoValues') === undefined) {
        this.removeFeatures([olFeature]);
    }
    this.removeDrawsInteractions();
};

/**
 * Set to the Feature a style
 * @param {ol.Feature} olFeature Feature to set stuff
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.setFeatureStyle = function (olFeature) {

    if (olFeature.get('infoValues') === undefined)
        return;

    var color = {
        Fill: olFeature.get('infoValues')['Fill'],
        Stroke: olFeature.get('infoValues')['Stroke'],
        StrokeSize: olFeature.get('infoValues')['StrokeSize'],
        ShowVector: olFeature.get('infoValues')['ShowVector']
    };

    if (color.ShowVector === "false") {
        color.Fill = 'rgba(255, 255, 255, 0)';
        color.Fill2 = 'rgba(255, 255, 255, 0)';
        color.Stroke = 'rgba(255, 255, 255, 0)';
    }
    if (color.Fill === "" || color.Fill === undefined) {
        color.Fill = 'rgba(54,184,255,0.6)';
        color.Fill2 = 'rgba(255,255,255,1)';
    } else {
        color.Fill2 = color.Fill;
    }
    if (color.Stroke === "" || color.Stroke === undefined)
        color.Stroke = 'rgba(255,255,255,1)';

    if (color.StrokeSize === "" || color.StrokeSize === undefined)
        color.StrokeSize = 2;

    olFeature.setStyle(new ol.style.Style({
        fill: new ol.style.Fill({
            color: color.Fill
        }),
        stroke: new ol.style.Stroke({
            color: color.Stroke,
            width: color.StrokeSize
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: color.Fill2
            }),
            stroke: new ol.style.Stroke({
                color: color.Stroke,
                width: color.StrokeSize
            })
        })
    }));
};

/**
 * Put the infos in to the feature
 * @param {ol.Feature} olFeature Feature to put the infos in
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.setInfosToFeature = function (olFeature) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.setInfosToFeature');

    // Id
    if (olFeature.get('Id') === undefined) {
        var id = this.oOpenLayersOverlayFeatures_.getLength();
        olFeature.set('Id', id);
    }

    // Remplit le premier element du formulaire à vide
    var firstElem = this['fields_'][0]['name'];
    olFeature.set(firstElem, '');

    if (olFeature.getGeometry() instanceof ol.geom.Point) {
        olFeature.set('Type', 'Point');
        olFeature.set('Périmètre/longueur', '-');
        olFeature.set('Superficie', '-');
        olFeature.set('Coordinates', olFeature.getGeometry().getCoordinates());

    } else if (olFeature.getGeometry() instanceof ol.geom.LineString) {
        olFeature.set('Type', 'Ligne');
        olFeature.set('Périmètre/longueur', this.formatLength(olFeature.getGeometry()));
        olFeature.set('Superficie', '-');
        olFeature.set('Coordinates', olFeature.getGeometry().getCoordinates());

    } else if (olFeature.getGeometry() instanceof ol.geom.Polygon) {
        olFeature.set('Type', 'Polygone');
        olFeature.set('Périmètre/longueur', this.formatPerimeter(olFeature.getGeometry()));
        olFeature.set('Superficie', this.formatArea(olFeature.getGeometry()));
        olFeature.set('Coordinates', olFeature.getGeometry().getCoordinates());

    } else if (olFeature.getGeometry() instanceof ol.geom.Circle) {

        var radius = parseFloat(this.formatRadius(olFeature.getGeometry()));
        var unit = this.formatRadius(olFeature.getGeometry()).replace(radius, '');
        var perimeter = Math.PI * radius * 2;
        var area = Math.PI * Math.pow(radius, 2);

        olFeature.set('Type', 'Cercle');
        olFeature.set('Périmètre/longueur', perimeter.toFixed(4) + unit);
        olFeature.set('Superficie', area.toFixed(4) + unit + "²");
        olFeature.set('Coordinates', [olFeature.getGeometry().getCenter(), olFeature.getGeometry().getRadius()]);

    } else {
        olFeature.set('Type', 'undefined');
        olFeature.set('Périmètre/longueur', '-');
        olFeature.set('Superficie', '-');
    }
};

/**
 * Update the feature infos after creating or editing
 * @param {ol.Feature} olFeature feature to update
 * @param {object} aInfos to update
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.updateFeatureInfos = function (olFeature, aInfos) {
    oVmap.log('nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.updateFeatureInfos');

    $('.modal').modal('hide');

    var tmpValue = "";
    var oInfoValues = {};
    var aOverlays = oVmap.getMap().getOLMap().getOverlays();

    // Ajoute un style a la figure
    var color = {};
    for (var i = 0; i < this['fields_'].length; i++) {
        if (this['fields_'][i]['id'] === 'Fill')
            color.Fill = $("#print-" + aInfos[i]['id'] + "-input").val();
        else if (this['fields_'][i]['id'] === 'Stroke')
            color.Stroke = $("#print-" + aInfos[i]['id'] + "-input").val();
        else if (this['fields_'][i]['id'] === 'Text')
            color.Text = $("#print-" + aInfos[i]['id'] + "-input").val();
        else if (this['fields_'][i]['id'] === 'TextBackground')
            color.TextBackground = $("#print-" + aInfos[i]['id'] + "-input").val();
        else if (this['fields_'][i]['id'] === 'TextSize')
            color.TextSize = $("#print-" + aInfos[i]['id'] + "-input").val();
        else if (this['fields_'][i]['id'] === 'StrokeSize')
            color.StrokeSize = $("#print-" + aInfos[i]['id'] + "-input").val();
        else if (this['fields_'][i]['id'] === 'ShowName') {
            color.ShowName = $("#print-" + aInfos[i]['id'] + "-input")[0].checked;
            $("#print-" + aInfos[i]['id'] + "-input").val(color.ShowName);
        } else if (this['fields_'][i]['id'] === 'ShowVector') {
            color.ShowVector = $("#print-" + aInfos[i]['id'] + "-input")[0].checked;
            $("#print-" + aInfos[i]['id'] + "-input").val(color.ShowVector);
        }
    }

    if (color.ShowVector === false) {
        color.Fill = 'rgba(255, 255, 255, 0)';
        color.Fill2 = 'rgba(255, 255, 255, 0)';
        color.Stroke = 'rgba(255, 255, 255, 0)';
        color.ShowName = false;
    }
    if (color.Fill === "") {
        color.Fill = 'rgba(54,184,255,0.6)';
        color.Fill2 = 'rgba(255,255,255,1)';
    } else {
        color.Fill2 = color.Fill;
    }
    if (color.Stroke === "")
        color.Stroke = 'rgba(255,255,255,1)';
    if (color.StrokeSize === "")
        color.StrokeSize = 2;

    olFeature.setStyle(new ol.style.Style({
        fill: new ol.style.Fill({
            color: color.Fill
        }),
        stroke: new ol.style.Stroke({
            color: color.Stroke,
            width: parseFloat(color.StrokeSize)
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: color.Fill2
            }),
            stroke: new ol.style.Stroke({
                color: color.Stroke,
                width: parseFloat(color.StrokeSize)
            })
        })
    }));

    // Supprime les annotations précédentes
    for (var i = aOverlays.getArray().length - 1; i >= 0; i--) {
        if (aOverlays.getArray()[i].get('feature') === olFeature) {
            aOverlays.remove(aOverlays.getArray()[i]);
        }
    }
    ;

    // Crée une nouvelle annotation
    this.createDrawTooltip(olFeature);
    for (var i = 0; i < aInfos.length; i++) {
        // ecrit sur le tooltip ainsi que dans la feature le resultat du premier element du formulaire
        if (i === 0) {
            this.drawTooltipElement_.innerHTML = $("#print-" + aInfos[i]['id'] + "-input").val();
            olFeature.set(aInfos[i]['name'], $("#print-" + aInfos[i]['id'] + "-input").val());
        }
        oInfoValues[aInfos[i]['id']] = $("#print-" + aInfos[i]['id'] + "-input").val();
    }

    olFeature.set('infoValues', oInfoValues);

    this.drawTooltip_.setPosition(this.getTooltipPosition(olFeature.getGeometry()));
    this.drawTooltipElement_.className = 'draw-tooltip draw-tooltip-static';
    this.drawTooltip_.setOffset([0, -7]);
    this.drawTooltipElement_.style.color = color.Text;
    this.drawTooltipElement_.style.backgroundColor = color.TextBackground;
    this.drawTooltipElement_.style.fontSize = color.TextSize;
    if (color.ShowName === false)
        this.drawTooltipElement_.style.opacity = 0;

    // unset draw-tooltip so that a new one can be created
    this.drawTooltipElement_ = null;
    this.createDrawTooltip(olFeature);
    this.showHideAnotations();
    this.removeDrawsInteractions();

    oVmap.log('updateFeatureInfos done');
};

/**
 * format length output
 * @param {ol.geom.LineString} line
 * @return {string}
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.formatLength = function (line) {
    var length;
    if (this.geodesicCheckbox_.checked
            && (this.map_.getView().getProjection().getCode() == 'EPSG:3857')
            || this.map_.getView().getProjection().getCode() == 'EPSG:4326') {
        var coordinates = line.getCoordinates();
        length = this.calcDistance(coordinates);
    } else {
        length = line.getLength();
    }
    var output;
    if (length > 1000) {
        output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km';
    } else {
        output = (Math.round(length * 100) / 100) +
                ' ' + 'm';
    }
    return output;
};

/**
 * Calculate the distance between points with the haversine method
 * @param {array<ol.Coordinate>} coordinates Coordinates
 * @return {number} Distance between the two points
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.calcDistance = function (coordinates) {
    length = 0;
    var sourceProj = this.map_.getView().getProjection();
    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
        var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
        length += this.wgs84Sphere_.haversineDistance(c1, c2);
    }

    return length;
};

/**
 * Calculate the coordinates
 * @param {ol.geom.Point} point
 * @return {string}
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.formatCoordinate = function (point) {
    output = [point.getCoordinates()[0].toFixed(4), point.getCoordinates()[1].toFixed(4)];
    return output;
};

/**
 * Calculate the radius
 * @param {ol.geom.Circle} circle
 * @return {string}
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.formatRadius = function (circle) {
    var radius;
    if (this.geodesicCheckbox_.checked
            && (this.map_.getView().getProjection().getCode() == 'EPSG:3857')
            || this.map_.getView().getProjection().getCode() == 'EPSG:4326') {
        var coordinates = [circle.getFirstCoordinate(), circle.getLastCoordinate()];
        radius = this.calcDistance(coordinates);
    } else {
        radius = Math.round(circle.getRadius() * 100) / 100;
    }
    var output;
    if (radius > 1000) {
        output = (Math.round(radius / 1000 * 100) / 100) +
                ' ' + 'km';
    } else {
        output = (Math.round(radius * 100) / 100) +
                ' ' + 'm';
    }
    return output;
};

/**
 * Calculate the perimeter
 * @param {ol.geom.Polygon} polygon
 * @return {string}
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.formatPerimeter = function (polygon) {

    var lineString = new ol.geom.LineString(
            polygon.getCoordinates()[0],
            polygon.getLayout()
            );

    output = this.formatLength(lineString);

    return output;
};

/**
 * Calculate the area
 * @param {ol.geom.Polygon} polygon
 * @return {string}
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.formatArea = function (polygon) {
    var area;
    if (this.geodesicCheckbox_.checked
            && (this.map_.getView().getProjection().getCode() == 'EPSG:3857')
            || this.map_.getView().getProjection().getCode() == 'EPSG:4326') {
        var sourceProj = this.map_.getView().getProjection();
        var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
                sourceProj, 'EPSG:4326'));
        var coordinates = geom.getLinearRing(0).getCoordinates();
        area = Math.abs(this.wgs84Sphere_.geodesicArea(coordinates));
    } else {
        area = polygon.getArea();
    }
    var output;
    if (area > 1000000) {
        output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'km²';
    } else {
        output = (Math.round(area * 100) / 100) +
                ' ' + 'm²';
    }
    return output;
};

/**
 * zoom to the selected feature
 * @param{ol.Feature} feature feature to zoom in
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.zoomToFeature = function (feature) {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.zoomToFeature");

    if (feature.get('Type') === 'Point') {
        this.map_.getView().setCenter(feature.getGeometry().getCoordinates());
    } else if (feature.get('Type') === 'Cercle') {
        this.map_.getView().fit(
                feature.getGeometry(),
                [400, 400],
                {padding: [0, 0, 0, 0]}
        );
        this.map_.getView().setCenter(feature.getGeometry().getCenter());
    } else {
        this.map_.getView().fit(
                feature.getGeometry(),
                [800, 800],
                {padding: [0, 0, 0, 0]}
        );
    }
};

/**
 * Put the href on the export buttons
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.initExportFeatureButtons = function () {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.initExportFeatureButtons");

    var aFeatures = this.oOpenLayersOverlayFeatures_.getArray();
    var sFormats = this['exportFormats_'];
    var formatConstructors = this['exportFormatsConstructors_'];
    var sProjection = oVmap.getMap().getOLMap().getView().getProjection().getCode();
    var sFeatures = '';

    // Export GeoJSON et autres
    for (var i = 0; i < sFormats.length; i++) {
        // Essaye d'ecrire la geométrie celon les formats suivants
        for (var i = 0; i < formatConstructors.length; i++) {
            var format = new formatConstructors[i]();
            try {
                // Ecrit la feature dans une chaine
                sFeatures = format.writeFeatures(aFeatures, {
                    dataProjection: sProjection,
                    featureProjection: sProjection
                });

                // Ajoute les sauts à la ligne
                sFeatures = sFeatures.replace(/{/g, "{\n");
                sFeatures = sFeatures.replace(/}/g, "\n}");

                // Si le bouton n'existe pas, alors on l'joute aux boutons d'export de bootstraptable
                if ($("#draw-export-" + sFormats[i] + "-button").length == 0) {
                    var node = document.createElement("li");
                    var link = document.createElement("a");
                    link.setAttribute("id", "draw-export-" + sFormats[i] + "-button");
                    link.setAttribute("download", "Features.json");
                    node.appendChild(link);
                    var textnode = document.createTextNode(sFormats[i]);
                    link.appendChild(textnode);

                    $("#draw-features-list-table").parents('.bootstrap-table').find('.export').find('ul')[0].appendChild(node);
                }

                // Donne comme href le fichier de geométrie
                $("#draw-export-" + sFormats[i] + "-button").attr('href',
                        "data:text/csv;charset=utf-8," + encodeURIComponent(sFeatures));

            } catch (err) {
            }
        }
    }
    ;
};

/**
 * Display the feature infos in a modal with the bootrap-table plugin
 * avaliable on (http://bootstrap-table.wenzhixin.net.cn/examples)
 * @param{ol.Feature} olFeature Feature to show infos
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.displayFeatureInfos = function (olFeature) {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.displayFeatureInfos");

    this['selectedFeature'] = olFeature;

    var columns = [{
            'field': 'field',
            'title': '',
            'sortable': true,
            'cellStyle': function (a, b) {
                return {'classes': 'active bold'}
            }
        }, {
            'field': 'result',
            'title': '',
            'sortable': true
        }];

    var data = [];

    for (var i = 0; i < this['fields_'].length; i++) {
        data.push({
            'field': this['fields_'][i]['name'],
            'result': olFeature.get('infoValues')[this['fields_'][i]['id']]
        });
    }
    ;

    $('#draw-feature-description-table').bootstrapTable({
        'columns': columns,
        'data': data,
        'search': true,
        'showHeader': false,
        'showExport': 'true',
        // pagination: true,
        'height': $("#feature-description-modal").height() * 0.6,
        'rowStyle': function (a, b) {
            return {'classes': ['active', 'success']}
        }
    });

    $('#draw-feature-description-table').bootstrapTable('load', data);
    $('.modal').modal('hide');
    $('#feature-description-modal').modal('show');
};

/**
 * Edit the features infos in a modal
 * @param{ol.Feature} olFeature Feature to show infos
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.editFeatureInfos = function (olFeature) {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.editFeatureInfos");

    var drawController = this;
    var initColor = function (i) {
        // Initialise colorpicker
        $("#print-" + drawController['fields_'][i]['id'] + "-input").colorpicker({
            format: 'rgba',
            color: $("#print-" + drawController['fields_'][i]['id'] + "-input").val()
        }).on('changeColor', function () {
            $(this).parent().find('.color-span2').css('background-color', $(this).val());
        });

        // Colorie la balise span
        $("#print-" + drawController['fields_'][i]['id'] + "-input").parent().find('.color-span2').css('background-color',
                $("#print-" + drawController['fields_'][i]['id'] + "-input").val());
    }


    for (var i = 0; i < this['fields_'].length; i++) {

        // Donne la valeur aux champs

        // Lors de l'edition d'une feature existante
        if (olFeature.get('infoValues') != undefined) {
            $("#print-" + this['fields_'][i]['id'] + "-input").val(olFeature.get('infoValues')[this['fields_'][i]['id']]);

            if (this['fields_'][i]['type'] == 'color') {
                initColor(i);
            } else if (this['fields_'][i]['type'] == 'boolean') {
                if (olFeature.get('infoValues')[this['fields_'][i]['id']] == 'false')
                    $("#print-" + this['fields_'][i]['id'] + "-input").bootstrapToggle('off');
                else
                    $("#print-" + this['fields_'][i]['id'] + "-input").bootstrapToggle('on');
            }
            // Lors d'une nouvelle feature
        } else if (this['fields_'][i]['value'] != undefined) {
            $("#print-" + this['fields_'][i]['id'] + "-input").val(this['fields_'][i]['value']);
            if (this['fields_'][i]['type'] == 'color') {
                initColor(i);
            } else if (this['fields_'][i]['type'] == 'boolean') {
                if ([this['fields_'][i]['value']] == 'false')
                    $("#print-" + this['fields_'][i]['id'] + "-input").bootstrapToggle('off');
                else
                    $("#print-" + this['fields_'][i]['id'] + "-input").bootstrapToggle('on');
            }
            // Lors d'une nouvelle feature sans valeurs associées
        } else {
            $("#print-" + this['fields_'][i]['id'] + "-input").val("");
            if (this['fields_'][i]['type'] == 'boolean') {
                $("#print-" + this['fields_'][i]['id'] + "-input").bootstrapToggle('on');
            }
            $('.colorpicker').colorpicker({format: 'rgba'}).on('changeColor', function () {
                $(this).parent().find('.color-span2').css('background-color', $(this).val());
            });
        }
    }
    ;
    this['selectedFeature'] = olFeature;
    $('.modal').modal('hide');
    $('#feature-edit-modal').modal('show');
    $('.bootstrap-toggle').bootstrapToggle();
};

/** 
 * Display the sketches in a list with the bootrap-table plugin
 * avaliable on (http://bootstrap-table.wenzhixin.net.cn/examples)
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.displayFeaturesList = function () {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.displayFeaturesList");

    var drawController = this;
    var aFeatures = this.oOpenLayersOverlayFeatures_.getArray();
    var featuresListData = [];

    this['sketchesLenght'] = aFeatures.length;

    if (aFeatures.length === 0) {
        $('.modal').modal('hide');
        $('#draw-features-list-modal').modal('show');
        $('#draw-features-list-table').bootstrapTable('load', []);
        return;
    }

    var actionFormatter = function (value, row, index) {
        return [
            '<a class="show-feature margin-sides-5" href="javascript:void(0)" title="Voir">',
            '<i class="glyphicon glyphicon-search"></i>',
            '</a>',
            '<a class="edit-feature margin-sides-5" href="javascript:void(0)" title="Editer">',
            '<i class="glyphicon glyphicon-edit"></i>',
            '</a>',
            '<a class="zoom-to-feature margin-sides-5" href="javascript:void(0)" title="Voir sur la carte">',
            '<i class="glyphicon glyphicon-globe"></i>',
            '</a>',
            '<a class="remove-feature margin-sides-5" href="javascript:void(0)" title="Supprimer">',
            '<i class="glyphicon glyphicon-trash"></i>',
            '</a>'
        ].join('');
    };

    var actionEvents = {
        'click .show-feature': function (e, value, row, index) {
            drawController.displayFeatureInfos(aFeatures[row['column1']]);
        },
        'click .edit-feature': function (e, value, row, index) {
            drawController.editFeatureInfos(aFeatures[row['column1']]);
        },
        'click .zoom-to-feature': function (e, value, row, index) {
            $(".modal").modal('hide');
            drawController.zoomToFeature(aFeatures[row['column1']]);
        },
        'click .remove-feature': function (e, value, row, index) {
            $(".modal").modal('hide');
            drawController.removeFeaturesWithControl([aFeatures[row['column1']]]);
        }
    };

    var aKeys = aFeatures[0].getKeys();
    var columns = [{
            'field': 'state',
            'checkbox': true
        }, {
            'field': 'action',
            'formatter': actionFormatter,
            'events': actionEvents,
            'class': 'draw-features-list-button-column'
        }];

    featuresListData = [];

    for (var i = 0; i < aFeatures.length; i++) {
        var lineData = {};
        for (var ii = 0; ii < aKeys.length; ii++) {
            if (aKeys[ii] !== 'geometry' && aKeys[ii] !== 'infoValues' && aKeys[ii] !== 'tooltip' && aKeys[ii] !== 'infoKeys') {

                // Enregistrement des infos sur les colones
                if (i === 0) {
                    if (aKeys[ii] !== 'Coordinates') {
                        columns.push({
                            'field': "column" + ii,
                            'title': aKeys[ii],
                            'sortable': true
                        });
                        // colones non visibles par défaut
                    } else {
                        columns.push({
                            'field': "column" + ii,
                            'title': aKeys[ii],
                            'sortable': true,
                            'visible': false
                        });
                    }
                }

                // Enregistrement des infos sur les lignes
                lineData["column" + ii] = aFeatures[i].get(aKeys[ii]);
            }
        }

        // Ajoute dans featuresListData lineData et libère la mémoire
        featuresListData.push(lineData);
        delete lineData;
    }

    $('#draw-features-list-table').bootstrapTable({
        'columns': columns,
        'data': featuresListData,
        'search': true,
        'showColumns': true,
        'showExport': 'true',
        // pagination: true,
        'height': $("#feature-description-modal").height() * 0.6,
        'rowStyle': function (a, b) {
            return {'classes': ['active', 'success']};
        }
    });

    $('#draw-features-list-table').bootstrapTable('load', featuresListData);

    $('.modal').modal('hide');
    $('#draw-features-list-modal').modal('show');

    this.initExportFeatureButtons();
};

/**
 * show/hide anotations
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.showHideAnotations = function () {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.showHideAnotations");

    if (document.getElementById('draw-anotations').checked)
        $('.draw-tooltip-static').show();
    else
        $('.draw-tooltip-static').hide();
};

/**
 * Start draw point interaction
 * @param {boolean} isActive true if the action is already active
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.drawPoint = function (isActive) {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.drawPoint");

    this.removeDrawsInteractions();

    if (!isActive) {
        this.addInteraction('Point');
    }
};

/**
 * Start draw line interaction
 * @param {boolean} isActive true if the action is already active
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.drawLine = function (isActive) {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.drawLine");

    this.removeDrawsInteractions();

    if (!isActive) {
        this.addInteraction('LineString');
    }
};

/**
 * Start draw polygon interaction
 * @param {boolean} isActive true if the action is already active
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.drawPolygon = function (isActive) {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.drawPolygon");

    this.removeDrawsInteractions();

    if (!isActive) {
        this.addInteraction('Polygon');
    }
};

/**
 * Start draw circle interaction
 * @param {boolean} isActive true if the action is already active
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.drawCircle = function (isActive) {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.drawCircle");

    this.removeDrawsInteractions();

    if (!isActive) {
        this.addInteraction('Circle');
    }
};

/**
 * Start modify feature interaction
 * @param {boolean} isActive true if the action is already active
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.modifyFeature = function (isActive) {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.modifyFeature");

    this.removeDrawsInteractions();

    if (!isActive) {
        oVmap.getMap().getMapTooltip().displayMessage('Cliquez sur un dessin pour le modifier');
        oVmap.getMap().setInteraction(this.modify_, 'draw-modifyFeature');
    }
};

/**
 * Start update feature infos interaction
 * @param {boolean} isActive true if the action is already active
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.editInfosClick = function (isActive) {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.modifyFeature");

    this.removeDrawsInteractions();

    if (!isActive) {
        oVmap.getMap().getMapTooltip().displayMessage('Cliquez sur un dessin pour éditer les infos');
        oVmap.getMap().setInteraction(this.editInfosClick_, 'draw-editInfosFeature');
//        oVmap.getMap().addInteraction(this.selectHover_, 'draw-editInfosFeature');
    }
};

/**
 * Start show feature infos interaction
 * @param {boolean} isActive true if the action is already active
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.showInfosClick = function (isActive) {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.showInfosClick");

    this.removeDrawsInteractions();

    if (!isActive) {
        oVmap.getMap().getMapTooltip().displayMessage('Cliquez sur un dessin pour voir les infos');
        oVmap.getMap().setInteraction(this.showInfosClick_, 'showInfosFeature');
//        oVmap.getMap().addInteraction(this.selectHover_, 'showInfosFeature');
    }
};

/**
 * Start delete feature interaction
 * @param {boolean} isActive true if the action is already active
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.deleteFeature = function (isActive) {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.deleteFeature");

    this.removeDrawsInteractions();

    if (!isActive) {
        oVmap.getMap().getMapTooltip().displayMessage('Cliquez sur un dessin pour le supprimer');
        oVmap.getMap().setInteraction(this.delete_, 'draw-deleteFeature');
//        oVmap.getMap().addInteraction(this.selectHover_, 'draw-deleteFeature');
    }
};

/**
 * remove all the draw features
 * @export
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.deleteAllFeatures = function () {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.deleteAllFeatures");
    // remove the draw/draw tool
    this.removeDrawsInteractions();
    // remove the features
    this.oOpenLayersOverlayFeatures_.clear();
    // remove the overlays draws
    var aOverlays = oVmap.getMap().getOLMap().getOverlays().getArray();
    var aDrawOverlays = [];
    for (var i = aOverlays.length - 1; i >= 0; i--) {
        if (aOverlays[i].get('type') === 'draw')
            aDrawOverlays.push(aOverlays[i]);
    }
    for (var i = aDrawOverlays.length - 1; i >= 0; i--) {
        oVmap.getMap().getOLMap().getOverlays().remove(aDrawOverlays[i]);
    }

    // Change la propriété 'id' des dessins restants
    aFeatures = this.oOpenLayersOverlayFeatures_.getArray();
    for (var i = 0; i < aFeatures.length; i++) {
        aFeatures[i].set('Id', i);
    }
};

/**
 * remove all the draw interactions
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.prototype.removeDrawsInteractions = function () {
    oVmap.log("nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController.removeDrawsInteractions");

    // Cache la tooltip
    oVmap.getMap().getMapTooltip().hide();
    // Désactive les interactions
    oVmap.getMap().removeActionsOnMap();
};

// Définit la directive et le controller
oVmap.module.directive('appDraw', nsVmap.nsToolsManager.nsModules.Draw.prototype.drawDirective);
oVmap.module.controller('AppdrawController', nsVmap.nsToolsManager.nsModules.Draw.prototype.drawController);

/************************************************
 ------------ GETTERS AND SETTERS ----------------
 *************************************************/

/**
 * nsVmap.fields_ getter
 * @return {object} Feature fields to use
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.getFields = function () {
    return this['fields_'];
};
/**
 * nsVmap.fields_ setter
 * @param {object} fields Feature fields to use
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.setFields = function (fields) {
    this['fields_'] = fields;
};
/**
 * nsVmap.features_ getter
 * @return {object} Features to use
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.getFeatures = function () {
    return this['features_'];
};
/**
 * nsVmap.features_ setter
 * @param {object} features Features to use
 * @export
 * @api experimental
 */
nsVmap.nsToolsManager.nsModules.Draw.prototype.setFeatures = function (features) {
    this['features_'] = features;
};
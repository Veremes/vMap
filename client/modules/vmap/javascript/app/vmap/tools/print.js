/* global nsVmap, oVmap, goog, ol, angular */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.Print
 * cette classe permet l'initialisation des outils de locatlisation
 */
goog.provide('nsVmap.nsToolsManager.Print');
goog.require('oVmap');
goog.require('nsVmap.nsToolsManager.PrintBox');

/**
 * @classdesc
 * Class {@link nsVmap.nsToolsManager.Print}: Add the print tools defined in data/tools.json
 *
 * @constructor
 * @export
 */
nsVmap.nsToolsManager.Print = function () {
    oVmap.log('nsVmap.nsToolsManager.Print');
};
goog.exportProperty(nsVmap.nsToolsManager, 'Print', nsVmap.nsToolsManager.Print);

/**
 * Run the printing process
 * @param {object} opt_options
 * @param {object} opt_options.scope
 * @param {ol.Extent} opt_options.extent
 * @param {string} opt_options.mapId
 * @param {string} opt_options.templateId
 * @param {number} opt_options.resolutionCoeff
 * @param {array<ol.Feature>} opt_options.features feature to zoom on
 * @param {number} opt_options.featuresZoom
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.Print.prototype.print = function (opt_options) {
    oVmap.log('nsVmap.nsToolsManager.Print.prototype.print');

    var scope = angular.element($("#select-print-format")).scope();
    scope.$evalAsync(function (scope) {
        scope['ctrl'].print(opt_options);
    });
};

/**
 * App-specific directive wrapping the print tools. The directive's
 * controller has a property "map" including a reference to the OpenLayers
 * map.
 *
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.nsToolsManager.Print.prototype.printDirective = function () {
    oVmap.log("nsVmap.nsToolsManager.Print.prototype.printDirective");
    return {
        restrict: 'A',
        scope: {
            'map': '=appMap',
            'lang': '=appLang',
            'currentAction': '=appAction'
        },
        controller: 'AppprintController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/print.html'
    };
};

/**
 * App controler
 * @export
 * @constructor
 * @ngInject
 */
nsVmap.nsToolsManager.Print.prototype.printController = function ($timeout, $compile, $scope, $q) {
    oVmap.log("nsVmap.nsToolsManager.Print.prototype.printController");

    var this_ = this;

    /**
     * @private
     */
    this.$timeout_ = $timeout;

    /**
     * @private
     */
    this.$compile_ = $compile;

    /**
     * @private
     */
    this.$scope_ = $scope;

    /**
     * @private
     */
    this.$q_ = $q;

    /**
     * @public
     */
    $scope['modelIndex'] = 0;

    /**
     * @public
     */
    $scope['printstyle_id'] = "";

    /**
     * Prints models
     */
    this['models'];

    /**
     * Prints styles
     */
    this['printStyles'] = [];

    /**
     * Print selectedModel used
     */
    this['selectedModel'];

    /**
     * Print zone resolution
     */
    this['resolution'] = 2;

    /**
     * dpi selection
     */
    this['dpi'] = 1;

    /**
     * Scale selections
     */
    this['scale'] = 'auto';

    /**
     * The current scale
     */
    this['currentScale'] = oVmap.getMap().getScale({
        'pretty': true
    });

    /**
     * Listen the maps moveends to set this.currentScale
     * @private
     */
    this.scaleListener_;

    /**
     * Html definition of the template
     * @private
     */
    this.template_;

    /**
     * Size of the printZone
     * @private
     */
    this.printedMapSize_;

    /**
     * this.printedMapSize_ resize coeff
     * @private
     */
    this.resizeCoeff_;

    /**
     * The print box object
     * @private
     */
    this.printBox_ = new nsVmap.nsToolsManager.PrintBox();

    // mise à jour de l'échelle dans le forulaire d'impression lors d'un mouvement sur la carte
    this.listenScaleChanges();

    $('#print-select-btn').click(function () {
        if ($('#print-select-btn').hasClass('active')) {
            // Charge les paramètres d'impression
            this_.loadPrintProperties().then(function () {
                if (this_['models'].length > 0) {
                    if (!goog.isDefAndNotNull(this_['models'][$scope['modelIndex']]) || $scope['modelIndex'] === 0) {
                        $scope['modelIndex'] = "0";
                    }
                    this_['printStyles'] = [];
                    this_.loadModelParmas($scope['modelIndex']);
                }
            });
        }
    });

    // Supprime la zone d'impression lors d'un toggleOutTools
    oVmap['scope'].$on('toggleOutTools', function () {
        if (!$('#print-select-btn').hasClass('active')) {
            this_.printBox_.hide();
        }
    });
};

/**
 * Load the print models
 * @returns {undefined}
 * @private
 */
nsVmap.nsToolsManager.Print.prototype.printController.prototype.loadPrintProperties = function () {
    oVmap.log('nsVmap.nsToolsManager.Print.printController.loadPrintProperties');

    var this_ = this;
    var deferred = this.$q_.defer();

    ajaxRequest({
        'method': 'GET',
        'url': oVmap['properties']['api_url'] + '/vmap/userprinttemplates',
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'params': {
            'distinct': true
        },
        'scope': this.$scope_,
        'success': function (response) {

            this_['models'] = [];

            // Vérifie si le fichier a bien été chargé, donne un modèle par défaut en cas d'erreur
            if (goog.isDefAndNotNull(response['data'])) {
                if (goog.isArray(response['data']['userprinttemplates'])) {
                    if (response['data']['userprinttemplates'].length > 0) {
                        this_['models'] = response['data']['userprinttemplates'];
                        this_.$scope_['printstyle_id'] = null;
                    }
                }
            }

            deferred.resolve();
        }
    });
    return deferred.promise;
};

/**
 * Listen for scale changes and update the scale on the print form
 * @returns {undefined}
 * @private
 */
nsVmap.nsToolsManager.Print.prototype.printController.prototype.listenScaleChanges = function () {
    oVmap.log('nsVmap.nsToolsManager.Print.printController.listenScaleChanges');

    // Vérifie si la résolution (niveau de zoom) change
    var i = 0;
    var this_ = this;
    this.scaleListener_ = this['map'].on('moveend', function () {
        i++;
        var ii = angular.copy(i);
        setTimeout(function () {
            if (i === ii) {
                if (this_['currentAction'] !== 'print-modifyPrintZone') {
                    this_['scale'] = 'auto';
                    this_['currentScale'] = oVmap.getMap().getPrettyScale(oVmap.getMap().getScale() / this_.resizeCoeff_);
                    this_.$scope_.$apply();
                }
            }
        }, 100);
    });
};

/**
 * Unlisten for scale changes and stop updating the scale on the print form
 * @returns {undefined}
 * @private
 */
nsVmap.nsToolsManager.Print.prototype.printController.prototype.unlistenScaleChanges = function () {
    oVmap.log('nsVmap.nsToolsManager.Print.printController.unlistenScaleChanges');
    ol.Observable.unByKey(this.scaleListener_);
};

/**
 * Load the selectedModel params
 * @param {number} modelIndex index in models
 * @export
 */
nsVmap.nsToolsManager.Print.prototype.printController.prototype.loadModelParmas = function (modelIndex) {
    oVmap.log('nsVmap.nsToolsManager.Print.printController.loadModelParmas');

    // Charge le modèle
    this['selectedModel'] = this['models'][modelIndex];

    // Charge le template
    this.setTemplate(this['selectedModel'], this.loadModelParmas2);

    // Charge la liste des styles disponibles
    this['printStyles'] = this['selectedModel']['printstyles'];
};

/**
 * Load the selectedModel params 2
 * @private
 */
nsVmap.nsToolsManager.Print.prototype.printController.prototype.loadModelParmas2 = function () {
    oVmap.log('nsVmap.nsToolsManager.Print.printController.loadModelParmas2');

    // Récupère la taille de la carte this.printedMapSize_ ainsi que le coefficient this.resizeCoeff_
    this.setPrintedMapSize(this.template_);

    // Pré-rempli le champ "Résolution"
    this['resolution'] = this.resizeCoeff_;

    // Ajuste l'échelle avec le niveau de détail
    this['currentScale'] = oVmap.getMap().getPrettyScale(oVmap.getMap().getScale() / this.resizeCoeff_);

    // Dessine un carré d'impression à chaque mouvement de la carte
    this.printBox_.setSize(this.printedMapSize_);
    this.printBox_.show();

};

/**
 * Set the template in this.template_ and run loadModelParmas2
 * @param {object} oModel
 * @param {string|undefined} oModel.url template url starting form the vmap folder
 * @param {function} callback
 * @returns {undefined}
 * @private
 */
nsVmap.nsToolsManager.Print.prototype.printController.prototype.setTemplate = function (oModel, callback) {
    oVmap.log('nsVmap.nsToolsManager.Print.printController.setTemplate');

    var this_ = this;

    if (!goog.isDefAndNotNull(oModel['definition']) && !goog.isDefAndNotNull(oModel['url'])) {
        bootbox.alert('<h4>Aucune définition présente dans le modèle d\'impression</h4>');
    }

    if (goog.isDefAndNotNull(oModel['definition'])) {
        var template = document.createElement("div");
        template.innerHTML = oModel['definition'];
        this_.template_ = template;
        callback.call(this, [template]);
    }
};

/**
 * Set this.printedMapSize_ and this.resizeCoeff_
 * @param {object} template
 */
nsVmap.nsToolsManager.Print.prototype.printController.prototype.setPrintedMapSize = function (template) {
    oVmap.log('nsVmap.nsToolsManager.Print.printController.setPrintedMapSize');

    var imageDiv = $(template).find('#map_image');

    // Vérifie la présence de '#map_image'
    if (!goog.isDef(imageDiv.get(0))) {
        console.error('Aucune balise #map_image trouvée dans le template');
        return 0;
    }

    // Ajoute temporairement le template au body de Vmap
    $(template).addClass('print_template');
    $('body').append(template);

    var mapHeight = imageDiv.height();
    var mapWidth = imageDiv.width();

    // Supprime le template du body de Vmap
    $(template).remove();

    // Vérifie si la taille de la carte est suppérieur à la taille de l'écran
    this.resizeCoeff_ = 1;
    var tmpWidth = angular.copy(mapWidth);
    var tmpHeight = angular.copy(mapHeight);
    while (mapWidth > ($('#map1').width()) || mapHeight > ($('#map1').height())) {
        this.resizeCoeff_++;
        mapWidth = tmpWidth / this.resizeCoeff_;
        mapHeight = tmpHeight / this.resizeCoeff_;
    }

    this.printedMapSize_ = [mapWidth, mapHeight];
};

/**
 * Change the map scale for the print-zone
 * @param {number} scale
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.Print.prototype.printController.prototype.changeScale = function (scale) {
    oVmap.log('nsVmap.nsToolsManager.Print.prototype.printController.prototype.changeScale');

    if (scale === 'auto')
        return 0;

    // Positionne la vue en fonction de la printZone
    if (this['currentAction'] === 'print-modifyPrintZone') {
        this.printBox_.setScale(scale);
        this.currentScale = scale;
        return 0;
    }

    // Si le cadre d'impression est plus grand que l'écran, alors la taille du cadre est divisée par deux, se qui signifie que l'échelle aussi
    var viewScale = scale * this.resizeCoeff_;

    // Change la résolution en fonction de l'échelle
    oVmap.getMap().setScale(viewScale);

};

/**
 * Detach the printZone from the view and allow to translate it
 * @export
 */
nsVmap.nsToolsManager.Print.prototype.printController.prototype.managePrintZone = function () {
    oVmap.log('nsVmap.nsToolsManager.Print.prototype.printController.prototype.managePrintZone');

    if (this['currentAction'] === 'print-modifyPrintZone') {
        this.printBox_.unmanagePrintBox();
    } else {
        this.printBox_.managePrintBox('print-modifyPrintZone');
    }
};

/**
 * Prepare the print params and launch it
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.Print.prototype.printController.prototype.prepareAndLaunchPrint = function () {
    oVmap.log('nsVmap.nsToolsManager.Print.prototype.printController.prototype.prepareAndLaunchPrint');

    // Enregistre l'échelle actuelle
    this.currentScale_ = oVmap.getMap().getScale({
        'pretty': true
    });

    // Prépare scope
    var scope = {};
    for (var i = 0; i < this['selectedModel']['variables'].length; i++)
        scope[this['selectedModel']['variables'][i]['name']] = this['selectedModel']['variables'][i]['value'];

    // Prépare extent
    var extent = this.printBox_.getExtent();

    // templateId
    var templateId = this['selectedModel']['printtemplate_id'];

    var aLocationOverlayFeatures = oVmap.getMap().getLocationOverlayFeatures().getArray();
    var aPopupOverlayFeatures = oVmap.getMap().getPopupOverlayFeatures().getArray();
    var aSelectionOverlayFeatures = oVmap.getMap().getSelectionOverlayFeatures().getArray();

    // Lance l'impression
    var returnPrint = this.print({
        scope: scope,
        extent: extent,
        templateId: templateId,
        printStyleId: this.$scope_['printstyle_id'],
        resolutionCoeff: this['dpi'],
        features: goog.array.concat(aLocationOverlayFeatures, aPopupOverlayFeatures, aSelectionOverlayFeatures)
    });

    if (returnPrint === 1) {
        // Ferme l'outil d'impression
        oVmap.getToolsManager().getBasicTools().toggleOutTools();
    }
};

/**
 * Run the printing process
 * @param {object} opt_options
 * @param {object|undefined} opt_options.scope
 * @param {ol.Extent|undefined} opt_options.extent
 * @param {string|undefined} opt_options.mapId
 * @param {string} opt_options.templateId
 * @param {string} opt_options.printStyleId
 * @param {number|undefined} opt_options.resolutionCoeff
 * @param {array<ol.Feature>|undefined} opt_options.features feature to zoom on
 * @param {number|undefined} opt_options.featuresZoom
 * @returns {number} 1 if all semms good
 * @export
 */
nsVmap.nsToolsManager.Print.prototype.printController.prototype.print = function (opt_options) {
    oVmap.log('nsVmap.nsToolsManager.Print.prototype.printController.prototype.print');

    var this_ = this;

    if (!goog.isDefAndNotNull(opt_options)) {
        console.error('opt_options.templateId not defined');
        return 0;
    }

    // Récupère la date
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = dd + '/' + mm + '/' + yyyy;

    // Valeurs par défaut
    var resolutionCoeff = goog.isDefAndNotNull(opt_options.resolutionCoeff) ? opt_options.resolutionCoeff : 1;
    var templateId = opt_options.templateId;
    var printStyleId = opt_options.printStyleId;

    // Set includesJSON
    var includesJson = JSON.stringify([{
            'target': '#map_legend',
            'html': this_.getLegendTemplate()
        }]);

    // Set scope
    var oPrintScope = goog.isDefAndNotNull(opt_options.scope) ? opt_options.scope : {};
    oPrintScope['date'] = goog.isDefAndNotNull(oPrintScope['date']) ? oPrintScope['date'] : today;
    var sScope = JSON.stringify(oPrintScope);

    // Set mapId/mapJson
    var sMapId;
    var sMapJSON;
    if (goog.isDefAndNotNull(opt_options.mapId)) {
        sMapId = opt_options.mapId;
    } else {
        sMapJSON = oVmap.getMapManager().getJSONLayersTree();
    }

    // set EWKTFeatures
    var aFeatures = goog.isDefAndNotNull(opt_options.features) ? opt_options.features : [];
    var sEWKTFeatures = '';
    for (var i = 0; i < aFeatures.length; i++) {
        if (i > 0)
            sEWKTFeatures += '|';
        sEWKTFeatures += oVmap.getEWKTFromGeom(aFeatures[i].getGeometry());
    }

    // set extent
    var aExtent = goog.isDefAndNotNull(opt_options.extent) ? opt_options.extent : [];
    var sExtent = '';
    var aOverviewExtent = [
        aExtent[0] - (aExtent[2] - aExtent[0]),
        aExtent[1] - (aExtent[3] - aExtent[1]),
        aExtent[2] + (aExtent[2] - aExtent[0]),
        aExtent[3] + (aExtent[3] - aExtent[1])
    ];
    var sOverviewExtent = '';
    for (var i = 0; i < aExtent.length; i++) {
        if (i > 0) {
            sExtent += '|';
            sOverviewExtent += '|';
        }
        sExtent += aExtent[i];
        sOverviewExtent += aOverviewExtent[i];
    }

    // Features zoom
    var sFeaturesZoom = 100;
    if (goog.isDefAndNotNull(opt_options.featuresZoom)) {
        sFeaturesZoom = opt_options.featuresZoom;
    } else if (goog.isDefAndNotNull(oVmap['properties']['print']['features_zoom'])) {
        sFeaturesZoom = oVmap['properties']['print']['features_zoom'];
    }

    // Ouvre la fenêtre d'impression
    var printWindow = window.open("", '_blank', 'height=400,width=600');

    // Si le navigateur bloque les fenêtres
    if (!goog.isDefAndNotNull(printWindow)) {
        $.notify('Fenêtre d\'impression bloquée par le navigateur', 'error');
        return 0;
    }
    printWindow.document.write('<div style="width: 100%; text-align: center; margin-top: 80px"><img src="images/ajax-big-loader.GIF" alt="Load img" style="width: 200px;height: 170px;"><br><br><i style="color: gray">Construction de la fiche en cours..</i></div>');

    // Récupère les infos du template
    ajaxRequest({
        'method': 'GET',
        'url': oVmap['properties']['api_url'] + '/vmap/printtemplates/' + templateId,
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'scope': this.$scope_,
        'success': function (response) {
            var bError = false;
            if (!goog.isDefAndNotNull(response['data'])) {
                bError = true;
            } else if (!goog.isDefAndNotNull(response['data']['data'])) {
                bError = true;
            } else if (!goog.isDefAndNotNull(response['data']['data'][0])) {
                bError = true;
            } else if (!goog.isDefAndNotNull(response['data']['data'][0]['definition'])) {
                bError = true;
            } else if (!goog.isDefAndNotNull(response['data']['data'][0]['rt_format_id'])) {
                bError = true;
            } else if (!goog.isDefAndNotNull(response['data']['data'][0]['rt_orientation_id'])) {
                bError = true;
            }
            if (bError) {
                $.notify('Erreur lors du chargement des données du template ' + templateId, 'error');
                console.error("response: ", response);
                return 0;
            }

            var sFormat = response['data']['data'][0]['rt_format_id'];
            var sOrientation = response['data']['data'][0]['rt_orientation_id'];

            var template = document.createElement("div");
            template.innerHTML = response['data']['data'][0]['definition'];

            var mapImageSize = this_.getTemplateTargetSize(template, '#map_image');
            var overviezSize = this_.getTemplateTargetSize(template, '#map_overview');

            if (goog.isDefAndNotNull(mapImageSize)) {
                var oMapDef = {
//                    'token': oVmap['properties']['token'],
                    'map_id': sMapId,
                    'map_json': sMapJSON,
                    'image_size': (mapImageSize[0] * resolutionCoeff) + '|' + (mapImageSize[1] * resolutionCoeff),
                    'resolution_coeff': resolutionCoeff,
                    'extent': sExtent,
                    'features': sEWKTFeatures,
                    'features_zoom': sFeaturesZoom
                };
            }

            if (goog.isDefAndNotNull(overviezSize)) {
                var oOverviewDef = {
//                    'token': oVmap['properties']['token'],
                    'map_id': sMapId,
                    'map_json': sMapJSON,
                    'image_size': (overviezSize[0] * resolutionCoeff) + '|' + (overviezSize[1] * resolutionCoeff),
                    'resolution_coeff': resolutionCoeff,
                    'extent': sOverviewExtent,
                    'features': sEWKTFeatures,
                    'features_zoom': 400
                };
            }

            var oMapsJson = [];
            if (goog.isDefAndNotNull(oMapDef)) {
                oMapsJson.push({
                    'target': '#map_image',
                    'map_definition': oMapDef
                });
            }
            if (goog.isDefAndNotNull(oOverviewDef)) {
                oMapsJson.push({
                    'target': '#map_overview',
                    'map_definition': oOverviewDef
                });
            }
            var mapsJson = JSON.stringify(oMapsJson);

            // Récupère les infos de l'utilisateur
            this_.getUserInfos_().then(function (oUserInfos) {

                // Merge les infos utilisateur
                var oPrintScope = JSON.parse(sScope);
                for (var key in oUserInfos) {
                    if (!goog.isDef(oPrintScope['user_' + key])) {
                        oPrintScope['user_' + key] = oUserInfos[key];
                    }
                }
                sScope = JSON.stringify(oPrintScope);

                ajaxRequest({
                    'method': 'POST',
                    'url': oVmap['properties']['api_url'] + '/vmap/printtemplateservices',
                    'headers': {
                        'Accept': 'application/x-vm-json'
                    },
                    'data': {
                        'printtemplate_id': templateId,
                        'printstyle_id': printStyleId,
                        'format': sFormat,
                        'orientation': sOrientation,
                        'includes_json': includesJson,
                        'maps_json': mapsJson,
                        'scope_json': sScope
                    },
                    'scope': this_.$scope_,
                    'timeout': 120000,
                    'success': function (response) {

                        var bError = false;
                        if (!goog.isDefAndNotNull(response['data'])) {
                            bError = true;
                        } else if (!goog.isDefAndNotNull(response['data']['printtemplateservices'])) {
                            bError = true;
                        } else if (!goog.isDefAndNotNull(response['data']['printtemplateservices']['image'])) {
                            bError = true;
                        } else if (response['data']['status'] !== 1) {
                            bError = true;
                        }
                        if (bError) {
                            $.notify('Une erreur est survenue lors de l\'impression', 'error');
                            printWindow.document.write('<div style="width: 100%; text-align: center; margin-top: 80px">Une erreur est survenue lors de l\'impression</div>');
                            console.error("response: ", response);
                            return 0;
                        }

                        $.notify('Impression réussie', 'success');
                        printWindow.location.href = response['data']['printtemplateservices']['image'];
                    },
                    'error': function (response) {
                        console.error(response);
                        $.notify('Une erreur est survenue lors de l\'impression', 'error');
                        printWindow.document.write('<div style="width: 100%; text-align: center; margin-top: 80px">Une erreur est survenue lors de l\'impression</div>');
                    }
                });
            });
        },
        'error': function (response) {
            console.error(response);
            $.notify('Une erreur est survenue lors de l\'impression', 'error');
            printWindow.document.write('<div style="width: 100%; text-align: center; margin-top: 80px">Une erreur est survenue lors de l\'impression</div>');
        }
    });
    return 1;
};

/**
 * Get the size of a target in a template
 * @param {string} template
 * @param {string} target
 * @returns {Array<Number>|undefined}
 */
nsVmap.nsToolsManager.Print.prototype.printController.prototype.getTemplateTargetSize = function (template, target) {

    var targetDiv = $(template).find(target);

    // Vérifie la présence de '#map_image'
    if (!goog.isDef(targetDiv.get(0))) {
        oVmap.log('Aucune balise ' + target + ' trouvée dans le template');
        return undefined;
    }

    $('body').append(template);

    var targetHeight = targetDiv.height();
    var targetWidth = targetDiv.width();

    // Supprime le template du body de Vmap
    $(template).remove();

    return [targetWidth, targetHeight];
};

/**
 * Get the html definition of the template with base64 images
 * @returns {String}
 */
nsVmap.nsToolsManager.Print.prototype.printController.prototype.getLegendTemplate = function () {

    var template = $('#maplegend').clone();

    // Transforme les images en base64
    template.find('img').each(function (index) {

        try {

            var image = this;
            var imgCanvas = document.createElement("canvas");
            var imgContext = imgCanvas.getContext("2d");

            imgCanvas.width = image.width;
            imgCanvas.height = image.height;

            imgContext.drawImage(image, 0, 0, image.width, image.height);

            var base64Img = imgCanvas.toDataURL("image/png");

            $(this).attr('src', base64Img);
            $(this).removeAttr('ng-src');

        } catch (e) {

        }
    });

    var sTemplate = template.html();

    sTemplate = sTemplate.replace(/&amp;/g, '&');
    sTemplate = sTemplate.replace(/"/g, '\\"');

    return sTemplate;
};

/**
 * Get the user infos in a promise
 * @returns {defer.promise}
 * @private
 */
nsVmap.nsToolsManager.Print.prototype.printController.prototype.getUserInfos_ = function () {
    oVmap.log("nsVmap.nsToolsManager.Print.prototype.printController.prototype.getUserInfos_");

    var deferred = this.$q_.defer();

    ajaxRequest({
        'method': 'GET',
        'url': oVmap['properties']['api_url'] + '/vitis/users/' + sessionStorage['user_id'],
        'headers': {
            'Accept': 'application/x-vm-json'
        },
        'scope': this.$scope_,
        'success': function (response) {
            if (goog.isDefAndNotNull(response['data'])) {
                if (goog.isDefAndNotNull(response['data']['data'])) {
                    if (goog.isDefAndNotNull(response['data']['data'][0])) {
                        deferred.resolve(response['data']['data'][0]);
                    }
                }
            }
        }
    });
    return deferred.promise;
};

// Définit la directive et le controller
oVmap.module.directive('appPrint', nsVmap.nsToolsManager.Print.prototype.printDirective);
oVmap.module.controller('AppprintController', nsVmap.nsToolsManager.Print.prototype.printController);

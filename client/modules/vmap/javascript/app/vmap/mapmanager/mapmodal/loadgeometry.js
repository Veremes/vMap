/* global oVmap, FileReader, goog, nsVmap */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.nsMapModal.LoadGeometry
 * cette classe permet d'afficher les suggestions geometry'
 */

goog.provide('nsVmap.nsMapManager.nsMapModal.LoadGeometry');

goog.require('oVmap');

/**
 * @classdesc
 * Class {@link nsVmap.nsMapManager.nsMapModal.LoadGeometry}: load the map list suggestions
 *
 * @constructor
 * @export
 */
nsVmap.nsMapManager.nsMapModal.LoadGeometry = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.LoadGeometry");
};

/************************************************
 ---------- DIRECTIVES AND CONTROLLERS -----------
 *************************************************/
/**
 * map list directive
 * @return {angular.Directive} The directive specs.
 * @export
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.LoadGeometry.prototype.loadgeometryDirective = function () {
    oVmap.log("nsVmap.loadgeometryDirective");
    return {
        restrict: 'E',
        scope: {
            'map': '=appMap',
            'lang': '=appLang'
        },
        controller: 'AppLoadgeometryController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/layers/mapmodal/loadgeometry.html'
    };
};

/**
 * map list controller
 * @export
 * @ngInject
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.LoadGeometry.prototype.loadgeometryController = function ($scope) {
    oVmap.log("nsVmap.loadgeometryController");


    var this_ = this;
    this.$scope = $scope;

    /**
     * Id of the html element witch contains the file
     * @type string
     */
    this.sFileContainer;

    /**
     * The selected file
     * @type object
     */
    $scope['oSelectedFile'] = {};

    /**
     * The selected file name
     * @type string
     */
    $scope['sFileName'] = '';

    /**
     * Service to add name
     * @type string
     */
    $scope['sServiceName'] = '';

    /**
     * Layer to add name
     * @type string
     */
    $scope['sLayerTitle'] = '';

    /**
     * True if the function needs to search from an url, 
     * false from a file ginven in this.sFileContainer
     * @type boolean
     */
    $scope['bIsUrl'] = false;

    /**
     * The html drop zone
     * @type {object}
     * @api stable
     */
    var dropZone = document.getElementById('upload-geometry-file-drop-zone');

    /**
     * The html browse element
     * @type {object}
     * @api stable
     */
    var browseButton = document.getElementById('browse-geometry-button');


    // Active et configure le bouton browse

    /**
     * Function called after the browse event
     * @function
     */
    var fileChanged = function () {

        var element = this;

        // Informe qui porte le fichier
        this_.sFileContainer = element.id;

        // Applique les changements sur le scope
        $scope.$applyAsync(function () {
            $scope['oSelectedFile'] = element.files[0];
            $scope['bIsUrl'] = false;
            if (goog.isDefAndNotNull($scope['oSelectedFile'])) {
                $scope['sFileName'] = angular.copy($scope['oSelectedFile']['name']);
            } else {
                $scope['sFileName'] = '';
            }
        });
    };

    browseButton.addEventListener('change', fileChanged, false);


    // Active et configure le drag and drop

    /**
     * Function called after the drop event
     * @function
     * @api experimental
     */
    var ondrop = function (event) {
        event.stopPropagation();
        event.preventDefault();
        var files = event.dataTransfer.files;
        this.files = files;

        // Informe qui porte le fichier
        this_.sFileContainer = this.id;

        // Applique les changements sur le scope
        $scope.$applyAsync(function () {
            $scope['oSelectedFile'] = files[0];
            $scope['bIsUrl'] = false;
            if (goog.isDefAndNotNull($scope['oSelectedFile'])) {
                $scope['sFileName'] = angular.copy($scope['oSelectedFile']['name']);
            } else {
                $scope['sFileName'] = '';
            }
        });

        this.className = 'upload-drop-zone';
        return false;
    }

    /**
     * Function called after the dragover event
     * @function
     * @api experimental
     */
    var ondragover = function (event) {
        this.className = 'upload-drop-zone drop';
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        return false;
    }

    /**
     * Function called after the dragleave event
     * @function
     * @api experimental
     */
    var ondragleave = function () {
        this.className = 'upload-drop-zone';
        return false;
    }

    dropZone.addEventListener('dragover', ondragover, false);
    dropZone.addEventListener('dragleave', ondragleave, false);
    dropZone.addEventListener('drop', ondrop, false);
};

/**
 * Adds the layer
 * @export
 */
nsVmap.nsMapManager.nsMapModal.LoadGeometry.prototype.loadgeometryController.prototype.addLayer = function () {
    oVmap.log('nsVmap.nsMapManager.nsMapModal.LoadGeometry.prototype.loadgeometryController.prototype.addLayer');

    var this_ = this;

    var fileContainer = this.sFileContainer;
    var url = this.$scope['sFileName'];
    var serviceName = this.$scope['sServiceName'];
    var layerTitle = this.$scope['sLayerTitle'];

    // Noms par défaut
    serviceName = serviceName !== '' ? serviceName : 'Local';
    layerTitle = layerTitle !== '' ? layerTitle : 'Local';

    if (serviceName === "" || layerTitle === "") {
        $.notify('Veuillez renseigner les noms du service et de la couche', 'error');
        return;
    }

    if (this.$scope['bIsUrl'] && url !== "") {// si on utilise l'url

        if (url.substr(0, 4) !== 'http') {
            $.notify('URL incorrecte');
            return;
        }
        showAjaxLoader();
        $.get(url).done(function (data) {
            hideAjaxLoader();
            if (oVmap.getMapManager().addLayerFromVectorContent(data, serviceName, layerTitle)) {
                oVmap.simuleClick('close-modal-button');
            }
        }).error(function (data) {
            hideAjaxLoader();
            $.notify('impossible de charger le contenu de l\'URL');
        });

    } else if (goog.isString(fileContainer) && fileContainer !== '') {// si on utilise le fichier uploadé

        var files = document.getElementById(fileContainer).files;
        if (!files.length) {
            $.notify('Veuillez sélectionner un fichier ou une url', 'error');
            return;
        }
        var file = files[0];
        var reader = new FileReader();

        layerTitle = layerTitle !== 'Local' ? layerTitle : file['name'];

        // If we use onloadend, we need to check the readyState.
        reader.onloadend = function (evt) {
            if (evt.target.readyState === FileReader.DONE) {
                if (oVmap.getMapManager().addLayerFromVectorContent(evt.target.result, serviceName, layerTitle)) {
                    oVmap.simuleClick('close-modal-button');
                }
            }
        };
        reader.readAsText(file);
    } else {
        $.notify('Veuillez sélectionner un fichier ou une URL', 'error');
        return;
    }
};

// Définit la directive et le controller
oVmap.module.directive('appLoadgeometry', nsVmap.nsMapManager.nsMapModal.LoadGeometry.prototype.loadgeometryDirective);
oVmap.module.controller('AppLoadgeometryController', nsVmap.nsMapManager.nsMapModal.LoadGeometry.prototype.loadgeometryController);
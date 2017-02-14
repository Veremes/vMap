/* global angular, oVmap, ol */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.nsMapModal.WMSSuggestions
 * cette classe permet d'afficher les suggestions wms'
 */

goog.provide('nsVmap.nsMapManager.nsMapModal.WMSSuggestions');

goog.require('ol.source.ImageWMS');
goog.require('ol.format.WMSCapabilities');


/**
 * @classdesc
 * Class {@link nsVmap.nsMapManager.nsMapModal.WMSSuggestions}: load the map list suggestions
 *
 * @constructor
 * @export
 */
nsVmap.nsMapManager.nsMapModal.WMSSuggestions = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.WMSSuggestions");
    
    // Directives et controleurs Angular
    oVmap.module.directive('appWmssuggestions', this.wmssuggestionsDirective);
    oVmap.module.controller('AppWmssuggestionsController', this.wmssuggestionsController);
}



/************************************************
 ---------- DIRECTIVES AND CONTROLLERS -----------
 *************************************************/
/**
 * map list directive
 * @return {angular.Directive} The directive specs.
 * @export
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsDirective = function () {
    oVmap.log("nsVmap.wmssuggestionsDirective");
    return {
        restrict: 'E',
        scope: {
            'map': '=appMap',
            'proj': '=appProj',
            'lang': '=appLang'
        },
        controller: 'AppWmssuggestionsController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/layers/mapmodal/wmssuggestions.html'
    };
};

/**
 * map list controller
 * @export
 * @ngInject
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsController = function ($http) {
    oVmap.log("nsVmap.wmssuggestionsController");
    
    /**
     * The maps catalog
     * @type {object}
     * @api stable
     */
    this.catalog = this['catalog'] = oVmap.getMapManager().getMapModalTool().getMapCatalog();
    
    /**
     * The displayed layers
     * @type {array<ol.Layer>}
     * @api stable
     */
    this.aLayers = this['aLayers'] = [];
    
    /**
     * @private
     * @type {angular.$http}
     */
    this.http_ = $http;
    
    $("#select-wms-service").change(function () {
        $("#getCapabilities-url-field").val($("#select-wms-service").val());
    });
};

/**
 * Make a getCapabilities request and load the layers list
 * @ngInject
 * @export
 * @api experimental
 */
nsVmap.nsMapManager.nsMapModal.WMSSuggestions.prototype.wmssuggestionsController.prototype.getCapabilities = function () {
    oVmap.log("getCapabilities");
    
    var sUrl = $("#getCapabilities-url-field").val();
    var aLayers = [];
    var myObject = this;

    // Clear la liste des couches proposées
    this['aLayers'].length = 0;
    
    $("#wms-log-message").empty();
    if (sUrl === "") {
//        oVmap.displayError('Veuillez renseigner une URL', 'wms-log-message');
        $.notify('Veuillez renseigner une URL', 'error');
        return 0;
    }
    
    // Crée l'url
    if (sUrl.indexOf("?") === -1)
        sUrl += "?";
    else
        sUrl += "&";
    sUrl += "service=wms&version=1.3.0&request=GetCapabilities";
    
    // Efface le message d'erreur
    $("#log-message").empty();
    // Affiche l'image d'attente
    $("#load-img").show();
    
    // appel ajax
    this.http_({
        url: oVmap['properties']['proxy_url'] + '?url=' + encodeURIComponent(sUrl),
        headers: {
            "charset": "charset=utf-8"
        }
    }).then(angular.bind(this, function (resp) {
        
        // Cache l'image d'attente
        $("#load-img").hide();
        if (resp.data === "") {
            oVmap.log("GetCapabilities sans résultat");
            // Affiche le nouveau message d'erreur
            var error = 'Requête GetCapabilities sans résultat, veuillez vérifier l\'URL du service';
//            oVmap.displayError(error, 'wms-log-message');
            $.notify(error, 'error');
            return 0;
        }
        
        oVmap.log("GetCapabilities pass");
        var parser = new ol.format.WMSCapabilities();
        var result = resp.data;

        try {
            result = parser.read(result);
        } catch (e) {
            bootbox.alert(result);
            return 0;
        }        
        
        var aLayerProjection = [];
        var mapProjection = oVmap.getMap().getOLMap().getView().getProjection().getCode();
        var serviceTitle = result['Service']['Title'];
        
        /**
         * Browse all the <layer> tags to fill aLayers
         * @param {object} layer node
         */
        var searchLayers = function (layer) {
            if (layer['Layer'] === undefined)
                aLayers.push(layer);
            else
                for (var i = 0; i < layer['Layer'].length; i++) {
                    searchLayers(layer['Layer'][i]);
                }
        };
        
        searchLayers(result['Capability']['Layer']);
        aLayers['serviceTitle'] = serviceTitle;
        aLayers['version'] = result['version'];

        // Récupère les projections admises pour chaque couche
        $(resp.data).find('Layer').each(function () {
            var oProjection = {
                sName: $(this).children("Name").text(),
                sCodes: ''
            };
            
            if ($(this).children("CRS").length > 0 && $(this).children("CRS").length < 10) {
                for (var i = 0; i < $(this).children("CRS").length; i++) {
                    oProjection.sCodes += $(this).children("CRS")[i]['innerHTML'] + ' ';
                }
            }
            if ($(this).children("SRS").length > 0 && $(this).children("SRS").length < 10) {
                for (var i = 0; i < $(this).children("SRS").length; i++) {
                    oProjection.sCodes += $(this).children("SRS")[i]['innerHTML'] + ' ';
                }
            }
            aLayerProjection.push(oProjection);
        });
        
        // Regarde si la couche est compatible
        for (var i = 0; i < aLayers.length; i++) {
            for (var ii = 0; ii < aLayerProjection.length; ii++) {
                if (aLayerProjection[ii].sName === aLayers[i]['Name']) {
                    aLayers[i]['projections'] = aLayerProjection[ii].sCodes;
                }
            }
        }
        
        // Affiche la liste
        $("#wms-suggestions-list").show();
        
        this['aLayers'] = aLayers;

    })), function errorCallback(response) {
        // Cache l'image d'attente
        $("#load-img").hide();
        console.error(response);
        
        // Affiche le nouveau message d'erreur
        var error = 'Erreur lors du chargement (plus d\'infos en console)';
//        oVmap.displayError(error, 'wms-log-message');
        $.notify(error, 'error');
    };
};

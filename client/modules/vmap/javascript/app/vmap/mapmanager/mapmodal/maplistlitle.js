/* global oVmap, nsVmap, goog */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.nsMapModal.MapListLitle
 * cette classe permet d'afficher la liste des cartes disponibles
 */

goog.provide('nsVmap.nsMapManager.nsMapModal.MapListLitle');

goog.require('oVmap');

/**
 * @classdesc
 * Class {@link nsVmap.nsMapManager.nsMapModal.MapListLitle}: load the map list litle tool
 *
 * @constructor
 * @export
 */
nsVmap.nsMapManager.nsMapModal.MapListLitle = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.MapListLitle");
};


/************************************************
 ---------- DIRECTIVES AND CONTROLLERS -----------
 *************************************************/

/**
 * map list directive
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.MapListLitle.prototype.maplistlitleDirective = function () {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.MapListLitle.prototype.maplistlitleDirective");
    return {
        restrict: 'E',
        scope: {
            'map': '=appMap',
            'lang': '=appLang'
        },
        controller: 'AppMaplistlitleController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/layers/mapmodal/' + (oVmap['properties']['is_mobile'] ? 'maplistlitle_mobile.html' : 'maplistlitle.html')
    };
};

/**
 * map list controller
 * @param {object} $scope the current scope
 * @export
 * @constructor
 * @ngInject
 */
nsVmap.nsMapManager.nsMapModal.MapListLitle.prototype.maplistlitleController = function ($scope) {
    oVmap.log("nsVmap.nsMapManager.nsMapModal.MapListLitle.prototype.maplistlitleController");

    var maplistlitleController = this;
    var scope = $scope;

    /**
     * The maps catalog
     * @type {object}
     */
    this['catalog'] = oVmap.getMapManager().getMapModalTool().getMapCatalog();

    /**
     * Filter string
     * @type string
     */
    $scope['filter'] = "";

    /**
     * Map themes
     * @type array
     */
    $scope['themes'] = this.getMapThemes(this['catalog']['maps']);

    /**
     * Displayed maps grouped by themes
     * @type object
     */
    $scope['mapsByThemes'] = [];

    /**
     * @private
     */
    $scope['filterTheme'] = "";

    // Filtre le résultat
    $scope.$watchGroup(['filter', 'filterTheme'], function () {

        var filteredArray = goog.array.filter(maplistlitleController['catalog']['maps'], function (element, index, array) {

            var filter = String(scope['filter']).toLowerCase().withoutAccents();
            var name = String(element['name']).toLowerCase().withoutAccents();
            var description = String(element['description']).toLowerCase().withoutAccents();
            var themeName = String(element['theme_name']).toLowerCase().withoutAccents();
            themeName = (themeName === 'null') ? 'autres' : themeName;

            // Vérifie si la carte est conforme au filter
            if (name.indexOf(filter) !== -1 || description.indexOf(filter) !== -1 || themeName.indexOf(filter) !== -1) {

                // Vérifie si la carte est conforme au theme selectionné
                if ($scope['filterTheme'] === '' || $scope['filterTheme'].toLowerCase() === themeName) {
                    return true;
                } else {
                    return false;
                }
            } else
                return false;

        });

        scope['mapsByThemes'] = maplistlitleController.groupMapByThemes(filteredArray);
    });

    $('body').click(function (e) {
        try {
            if (!$.contains($('#maplistlitle-container')[0], $(e.target)[0])) {
                $('#maplistlitle-container').removeClass('open');
            }
        } catch (e) {
        }
    });

    $('.maplist-map').click(function () {
        $('#maplistlitle-container').removeClass('open');
    });
};

/**
 * Group the maps by theme and return a tree
 * @param {array} aMaps
 * @returns {object}
 */
nsVmap.nsMapManager.nsMapModal.MapListLitle.prototype.maplistlitleController.prototype.groupMapByThemes = function (aMaps) {

    var oMapsByThemes = {};

    for (var i = 0; i < aMaps.length; i++) {
        if (!goog.isDef(oMapsByThemes[aMaps[i]['theme_name']])) {
            oMapsByThemes[aMaps[i]['theme_name']] = [aMaps[i]];
        } else {
            oMapsByThemes[aMaps[i]['theme_name']].push(aMaps[i]);
        }
    }

    return oMapsByThemes;
};

/**
 * Get the list of the themes
 * @param {array} aMaps
 * @returns {Array} themes
 */
nsVmap.nsMapManager.nsMapModal.MapListLitle.prototype.maplistlitleController.prototype.getMapThemes = function (aMaps) {

    var aThemes = [];
    var themeName;

    for (var i = 0; i < aMaps.length; i++) {
        themeName = aMaps[i]['theme_name'] === null ? 'Autres' : aMaps[i]['theme_name'];
        if (aThemes.indexOf(themeName) === -1) {
            //  Mémorise le theme en remplaçant null par Autres
            aThemes.push(themeName);
        }
    }

    return aThemes;
};

// Définit la directive et le controller
oVmap.module.directive('appMaplistlitle', nsVmap.nsMapManager.nsMapModal.MapListLitle.prototype.maplistlitleDirective);
oVmap.module.controller('AppMaplistlitleController', nsVmap.nsMapManager.nsMapModal.MapListLitle.prototype.maplistlitleController);
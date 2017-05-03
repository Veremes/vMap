/* global goog, nsVmap, oVmap, angular */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsToolsManager.InfoContainer
 * cette classe permet l'affichage des infos sur la barre du bas
 */
goog.provide('nsVmap.nsToolsManager.InfoContainer');

goog.require('oVmap');

goog.require('goog.array');
goog.require('goog.object');

/**
 * @classdesc
 * Class {@link nsVmap.nsToolsManager.InfoContainer}: Add the info container
 *
 * @constructor
 * @export
 */
nsVmap.nsToolsManager.InfoContainer = function () {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer');
};


/**
 * Show the InfoContainer toggle bar
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.showBar = function () {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.showBar');

    var map = oVmap.getMap().getOLMap();
    map.once('postcompose', function () {
        var scope = angular.element($("#infocontainer-info-container")).scope();
        scope.$evalAsync(function (scope) {
            scope['ctrl'].showBar();
        });
    });
};

/**
 * Create and display a tab, if the tab already exist, then the tab is erased
 * @param {object} opt_options 
 * @param {String} opt_options.tabCode The code of the tab
 * @param {String} opt_options.tabName The name of the tab
 * @param {array | undefined} opt_options.columns Array of columns (data keys if undefined)
 * @param {array | undefined} opt_options.invisibleColumns Array of non visible columns
 * @param {array<object> | undefined} opt_options.data Data to add ex: [{column1: 'test'}]
 * @param {ol.Feature | undefined} opt_options.data[i].feature Feature to bind
 * @param {object | undefined} opt_options.layer layer of the features
 * @param {array<string> | undefined} opt_options.actions list of the action buttons, avaliable: ["delete", "zoom"]
 * @returns {string} erorr if something goes wrong
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.addTab = function (opt_options) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.addTab');

    if (!goog.isDef(opt_options))
        return 'opt_options not defined';
    if (!goog.isDef(opt_options.tabCode))
        return 'opt_options.tabCode not defined';
    if (!goog.isDef(opt_options.tabName))
        return 'opt_options.tabName not defined';

    var scope = angular.element($("#infocontainer-info-container")).scope();
    scope.$evalAsync(function (scope) {
        var tab = new nsVmap.nsToolsManager.InfoContainer.Tab(opt_options);
        scope['ctrl'].addTab(tab);
    });
};

/**
 * Create and display a tab, all the other tabs are removed
 * @param {object} opt_options 
 * @param {String} opt_options.tabCode The code of the tab
 * @param {String} opt_options.tabName The name of the tab
 * @param {array | undefined} opt_options.columns Array of columns (data keys if undefined)
 * @param {array | undefined} opt_options.invisibleColumns Array of non visible columns
 * @param {array<object> | undefined} opt_options.data Data to add ex: [{column1: 'test'}]
 * @param {ol.Feature | undefined} opt_options.data[i].feature Feature to bind
 * @param {object | undefined} opt_options.layer layer of the features
 * @param {array<string> | undefined} opt_options.actions list of the action buttons, avaliable: ["delete", "zoom"]
 * @returns {string} erorr if something goes wrong
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.setTab = function (opt_options) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.setTab');

    if (!goog.isDef(opt_options))
        return 'opt_options not defined';
    if (!goog.isDef(opt_options.tabCode))
        return 'opt_options.tabCode not defined';
    if (!goog.isDef(opt_options.tabName))
        return 'opt_options.tabName not defined';

    var scope = angular.element($("#infocontainer-info-container")).scope();

    // Vide les onglets
    if (scope['ctrl']['infos'] !== undefined)
        for (var i = scope['ctrl']['infos'].length - 1; i >= 0; i--) {
            scope['ctrl']['infos'].splice(i, 1);
        }
    ;

    // Ajoute le nouvel onglet
    scope.$evalAsync(function (scope) {
        var tab = new nsVmap.nsToolsManager.InfoContainer.Tab(opt_options);
        scope['ctrl'].addTab(tab);
    });
};

/**
 * Add one row on a tab
 * 
 * @param {object} row_options
 * @param {object} row_options.data bootstrap-table data
 * @param {ol.Feature | undefined} row_options.data[i].feature Feature to bind
 * @param {object} row_options.columns bootstrap-table columns
 * @param {array} row_options.invisibleColumns list of the invisible columns
 *
 * @param {object} tab_options
 * @param {string} tab_options.tabCode tab code
 * @param {integer} tab_options.tabIndex tab index
 *
 * @returns {string} error or true if all was executed
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.addRow = function (tab_options, row_options) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.addRow');

    if (tab_options.tabCode === undefined && tab_options.tabIndex === undefined)
        return 'bad tab_options';
    if (row_options.data === undefined)
        return 'row_options.data undefined';

    var scope = angular.element($("#infocontainer-info-container")).scope();
    scope.$evalAsync(function (scope) {
        scope['ctrl'].addRow(tab_options, row_options);
        scope['ctrl'].refreshTabs();
    });

    return true;
};

/**
 * Add multiple rows on a tab
 *
 * @param {object} tab_options
 * @param {string} tab_options.tabCode tab code
 * @param {integer} tab_options.tabIndex tab index
 * 
 * @param {object} row_options
 * @param {array<object>} row_options.data bootstrap-table data
 * @param {ol.Feature | undefined} row_options.data[i].feature Feature to bind
 * @param {object} row_options.columns bootstrap-table columns
 * @param {array} row_options.invisibleColumns list of the invisible columns
 *
 * @returns {string} error or true if all was executed
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.addMultipleRows = function (tab_options, row_options) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.addMultipleRows');

    if (tab_options.tabCode === undefined && tab_options.tabIndex === undefined)
        return 'bad tab_options';
    if (row_options.data === undefined)
        return 'row_options.data undefined';

    var scope = angular.element($("#infocontainer-info-container")).scope();
    scope.$evalAsync(function (scope) {

        var tmpRow = {};
        for (var i = 0; i < row_options.data.length; i++) {
            tmpRow = {
                data: row_options.data[i],
                columns: row_options.columns,
                invisibleColumns: row_options.invisibleColumns
            };
            scope['ctrl'].addRow(tab_options, tmpRow);
        }
        ;
        scope['ctrl'].refreshTabs();
    });

    return true;
};

/**
 * Refresh the tabs
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.refreshTabs = function () {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.refreshTabs');

    var scope = angular.element($("#infocontainer-info-container")).scope();
    scope.$evalAsync(function (scope) {
        scope['ctrl'].refreshTabs();
    });

    return true;
};

/**
 * Display the tab by the name
 * @param {string} tabCode Code of the tab
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.displayTabByCode = function (tabCode) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.displayTabByCode');

    var scope = angular.element($("#infocontainer-info-container")).scope();
    scope.$evalAsync(function (scope) {
        scope['ctrl'].displayTabByCode(tabCode);
    });
};

/**
 * Display the tab by the index
 * @param {integer} index Unique index of the tab
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.displayTabByIndex = function (index) {
    console.log("1");
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.displayTabByIndex');

    var scope = angular.element($("#infocontainer-info-container")).scope();
    scope.$evalAsync(function (scope) {
        scope['ctrl'].displayTabByIndex(index);
    });
};

/**
 * Show the InfoContainer
 * @param {array<object>} infos infos to show:
 * infos[i]['tabCode'] {string} code of the tab
 * infos[i]['tabName'] {string} name of the tab
 * infos[i]['contant'] {string} conent to show before the tab
 * infos[i]['tableParams'] {object} the params of the bootstrap-table element
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.displayInfos = function (infos) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.displayInfos');

    this.showBar();
    this.setInfos(infos);
};

/**
 * Return the tab
 * @returns {object} infos of the table
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.getTabByCode = function (tabCode) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.getTabByCode');

    var tab = angular.element($("#infocontainer-info-container")).scope()['ctrl'].getTabByCode(tabCode);
    if (tab !== undefined)
        return jQuery.extend(true, {}, tab);
    else
        return undefined;
};

/**
 * Get the tab bootstrap-table element
 * @param {tab} tab tab
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.getTabTable = function (tab) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.infocontainerController.getTabTable');

    return angular.element($("#infocontainer-info-container")).scope()['ctrl'].getTabTable(tab);
};

/**
 * Return the infos of the table
 * @returns {object} infos of the table
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.getInfos = function () {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.getInfos');

    var aInfos = angular.element($("#infocontainer-info-container")).scope()['ctrl']['infos'];
    return jQuery.extend(true, [], aInfos);
};

/**
 * Set the infos of the table
 * @param {array<object>} infos infos to show:
 * infos[i]['tabCode'] {string} code of the tab
 * infos[i]['contant'] {string} conent to show before the tab
 * infos[i]['tableParams'] {object} the params of the bootstrap-table element
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.setInfos = function (infos) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.setInfos');
    oVmap.log(infos);

    //	Remplit this['infos']
    var scope = angular.element($("#infocontainer-info-container")).scope();
    scope.$evalAsync(function (scope) {
        scope['ctrl'].setInfos(infos);
    });
};

/**
 * Add the infos of a table
 * @param {array<object>} infos infos to show:
 * @param {string} infos.i.tabCode code of the tab
 * @param {string} infos.i.tabName name of the tab
 * @param {object} infos.i.tableParams the params of the bootstrap-table element
 * @returns {undefined}
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.addInfos = function (infos) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.addInfos');
    oVmap.log(infos);

    //	Remplit this['infos']
    var scope = angular.element($("#infocontainer-info-container")).scope();
    scope.$evalAsync(function (scope) {
        scope['ctrl'].addInfos(infos);
    });
};

/**
 * Delete a tab by tabCode. Warning: this function will not remove the possible features binded on the rows
 * @param {string} tabCode code of the tab
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.removeTabByCode = function (tabCode) {
    var scope = angular.element($("#infocontainer-info-container")).scope();
    var aInfos = scope['ctrl']['infos'];

    if (tabCode === undefined)
        return 0;
    if (aInfos === undefined)
        return 0;

    for (var i = aInfos.length - 1; i >= 0; i--) {
        if (aInfos[i]['tabCode'] === tabCode) {
            aInfos.splice(i, 1);
        }
    }
    ;
    // Applique la modification à la vue
    scope.$evalAsync(function (scope) {
        scope['ctrl'].loadTables();
    });
};

/**
 * Delete all the tabs. 
 * Warning: this function will remove the possible features binded on the rows
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.removeAll = function () {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.removeAll');

    // Vide la couche sélection
    oVmap.getMap().getSelectionOverlayFeatures().clear();

    var scope = angular.element($("#infocontainer-info-container")).scope();
    var aInfos = scope['ctrl']['infos'];

    if (aInfos === undefined)
        return 0;

    for (var i = aInfos.length - 1; i >= 0; i--) {
        aInfos.splice(i, 1);
    }
    ;
    // Applique la modification à la vue
    scope.$evalAsync(function (scope) {
        scope['ctrl'].loadTables();
    });
};

/**
 * Delete all the rows in the tab. 
 * Warning: this function will remove the possible features binded on the rows
 * @param {string} tabCode tabCode of the tab
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.removeTabRows = function (tabCode) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.removeTabRows');

    if (tabCode === undefined)
        return 0;

    var scope = angular.element($("#infocontainer-info-container")).scope();
    var tab = this.getTabByCode(tabCode);
    var tabTable = this.getTabTable(tab);

    for (var i = tab['tableParams']['data'].length - 1; i >= 0; i--) {
        this.removeRow(tabCode, i);
    }
    ;
};

/**
 * Delete a row in a tab. 
 * Warning: this function will remove the possible features binded on the rows
 * @param {string} tabCode tabCode of the tab
 * @param {integer} rowIndex index of the row
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.removeRow = function (tabCode, rowIndex) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.removeRow');

    var scope = angular.element($("#infocontainer-info-container")).scope();
    var aInfos = scope['ctrl']['infos'];

    if (tabCode === undefined)
        return 0;
    if (aInfos === undefined)
        return 0;
    if (rowIndex === undefined)
        return 0;

    var tab = this.getTabByCode(tabCode);
    var tabTable = this.getTabTable(tab);
    var row = tabTable.bootstrapTable('getData')[rowIndex];

    // Supprime si elle existe, la feature correspondante
    if (goog.isDef(row['feature']))
        oVmap.getMap().getSelectionOverlay().getSource().removeFeature(row['feature']);

    // Supprime la ligne correspondante
    for (var i = aInfos.length - 1; i >= 0; i--) {
        if (aInfos[i]['tabCode'] === tabCode) {
            aInfos[i]['tableParams']['data'].splice(rowIndex, 1);
        }
    }
    ;

    // Applique la modification à la vue
    scope.$evalAsync(function (scope) {
        scope['ctrl'].loadTables();
    });
};

/**
 * Zoom on the tab features and pass them on the top of the featureOverlay
 * @param {string} tabCode code of the tab
 * @return {string} error
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.zoomOnTabFeatures = function (tabCode) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.zoomOnTabFeatures');

    if (!goog.isDef(tabCode))
        return 'tabCode not defined';

    var scope = angular.element($("#infocontainer-info-container")).scope();
    scope.$evalAsync(function (scope) {
        scope['ctrl'].zoomOnTabFeatures(tabCode);
    });
};

/**
 * Pass the tab features on the top of the featureOverlay
 * @param {string} tabCode code of the tab
 * @return {string} error
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.displayTabFeatures = function (tabCode) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.displayTabFeatures');

    if (!goog.isDef(tabCode))
        return 'tabCode not defined';

    var scope = angular.element($("#infocontainer-info-container")).scope();
    scope.$evalAsync(function (scope) {
        scope['ctrl'].displayTabFeatures(tabCode);
    });
};

/**
 * Class tab
 * @param {object} opt_options 
 * @param {String} opt_options.tabCode The code of the tab
 * @param {String} opt_options.tabName The name of the tab
 * @param {array | undefined} opt_options.columns Array of columns (data keys if undefined)
 * @param {array | undefined} opt_options.invisibleColumns Array of non visible columns
 * @param {array<object> | undefined} opt_options.data Data to add ex: [{column1: 'test'}]
 * @param {ol.Feature | undefined} opt_options.data[i].feature Feature to bind
 * @param {array<string> | undefined} opt_options.actions list of the action buttons, avaliable: ["delete", "zoom"]
 * @returns {integer} 
 * @constructor
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.Tab = function (opt_options) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.Tab');

    if (!goog.isDef(opt_options))
        return 0;
    if (!goog.isDef(opt_options.tabCode))
        return 0;
    if (!goog.isDef(opt_options.tabName))
        return 0;

    var columns = [];
    var htmlContent = [];
    var actionEvents = {};
    var className = "";

    opt_options.data = goog.isDef(opt_options.data) ? opt_options.data : [];
    opt_options.actions = goog.isDef(opt_options.actions) ? opt_options.actions : [];

    // Colones non visibles, vaut "feature" par défaut
    opt_options.invisibleColumns = goog.isDef(opt_options.invisibleColumns) ?
            (function () {
                var tmp = opt_options.invisibleColumns;
                if (!goog.array.contains(tmp, 'feature'))
                    tmp.push('feature');
                return tmp;
            }()) : ['feature'];

    // Définit les boutons d'action
    for (var i = 0; i < opt_options.actions.length; i++) {

        if (opt_options.actions[i] === 'delete') {
            className = 'info-container-' + goog.string.createUniqueString() + '-remove-feature';
            htmlContent.push('<a class="' + className + '" href="javascript:void(0)" title="Enlever du panier">');
            htmlContent.push('<i class="glyphicon glyphicon-remove padding-sides-5"></i>');
            htmlContent.push('</a>');

            actionEvents['click .' + className] = function (e, value, row, index) {
                oVmap.getToolsManager().getInfoContainer().removeRow(opt_options.tabCode, index);
            };

        } else if (opt_options.actions[i] === 'zoom') {
            className = 'info-container-' + goog.string.createUniqueString() + '-zoom-feature';
            htmlContent.push('<a class="' + className + '" href="javascript:void(0)" title="Zoom sur la géométrie">');
            htmlContent.push('<i class="glyphicon glyphicon-globe padding-sides-5"></i>');
            htmlContent.push('</a>');

            actionEvents['click .' + className] = function (e, value, row, index) {
                if (!goog.isDef(row['feature'])) {
                    console.error('Aucune géométrie renseignée dans la colone "feature"');
                    return 0;
                }
                var olView = oVmap.getMap().getOLMap().getView();
                var size = oVmap.getMap().getOLMap().getSize();
                var extent = row['feature'].getGeometry().getExtent();
                var resolution = olView.getResolution();
                // vide la couche de localisation
                oVmap.getMap().getLocationOverlayFeatures().clear();
                // ajoute la géométrie à la couche de localisation
                oVmap.getMap().getLocationOverlaySource().addFeature(row['feature']);
                // zoom sur la géométrie
                olView.fit(extent, size, {
                    padding: [50, 50, 50, 50]
                });

                // Si il s'agit d'un point, il faut garder le zoom actuel
                if (row['feature'].getGeometry().getType() === 'Point' || (row['feature'].getGeometry().getType() === 'MultiPoint' && row['feature'].getGeometry().getPoints().length <= 1))
                    olView.setResolution(resolution);
            };
        }
    }
    ;

    var actionFormatter = function (value, row, index) {
        return htmlContent.join('');
    };
    columns.push({
        'checkbox': true,
        'clickToSelect': true,
        'class': 'info-container-checkbox-column'
    });
    columns.push({
        'formatter': actionFormatter,
        'class': 'info-container-list-events-column',
        'events': actionEvents
    });

    // Si elles ne sont pas renseignées, les colones prennent pour valeur les clés de data
    opt_options.columns = goog.isDef(opt_options.columns) ? opt_options.columns : (function () {
        for (var key in opt_options.data[0]) {
            columns.push({
                'field': key,
                'title': key,
                'sortable': true,
                'visible': !goog.array.contains(opt_options.invisibleColumns, key)
            });
        }
        return columns;
    })();

    var tableParams = {
        'search': true,
//        'clickToSelect': true,
        'checkboxHeader': true,
        'data': opt_options.data,
        'columns': opt_options.columns
    };

    this['tabCode'] = opt_options.tabCode;
    this['tabName'] = opt_options.tabName;
    this['tableParams'] = tableParams;
};

/************************************************
 ---------- DIRECTIVES AND CONTROLLERS -----------
 *************************************************/

/**
 * Directive
 * @returns {angular.Directive} The directive specs.
 * @export
 * @constructor
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerDirective = function () {
    oVmap.log("nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerDirective");
    return {
        restrict: 'A',
        scope: {
            'map': '=appMap',
            'lang': '=appLang',
            'infos': '=appInfos'
        },
        controller: 'AppInfocontainerController',
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/tools/infocontainer.html'
    };
};

/**
 * Controller
 * @ngInject
 * @export
 * @constructor
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController = function ($timeout, $scope, $http) {
    oVmap.log("nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController");

    this.$timeout = $timeout;

    this.$http_ = $http;

    /**
     * Infos to display
     * @type {array<object>}
     */
    this['infos'] = [];

    /**
     * 
     */
    this['selectedTabIndex'] = 0;

    this['avaliablePrintReports'] = [];

    // Vide la panier quand on change de carte
    oVmap['scope'].$on('mapChanged', function () {
        oVmap.getToolsManager().getInfoContainer().removeAll();
    });
};

/**
 * Show the infos container's bar
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.showBar = function () {
    oVmap.log("nsVmap.nsToolsManager.InfoContainer.infocontainerController.showBar");

    // Affiche la barre de selection
    if ($("#opener-bottombar").css("visibility") === "hidden") {
        $("#opener-bottombar").css("visibility", "visible");
    }
    $("#map-container").addClass('minus');

    // Ouvre la barre
    this.$timeout(function () {
        if (($("#map-container").hasClass("open") === false) && ($("#map-container").hasClass("open2") === false))
            oVmap.simuleClick('opener-bottombar-1');
    });
};

/**
 * Display the tab by the index
 * @param {number} tabIndex index of the tab
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.displayTabByIndex = function (tabIndex) {
    console.log("2");
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.infocontainerController.displayTabByIndex');
    this['selectedTabIndex'] = tabIndex;
};

/**
 * Display the tab by the name
 * @param {string} tabCode Code of the tab
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.displayTabByCode = function (tabCode) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.infocontainerController.displayTabByCode');

    // Cherche l'onglet
    for (var i = 0; i < this['infos'].length; i++) {
        if (this['infos'][i]['tabCode'] === tabCode) {
            var tabIndex = i;
        }
    }

    // Afiche l'onglet
    this.displayTabByIndex(tabIndex);
};

/**
 * Get the tab by the name
 * @param {string} tabCode Code of the tab
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.getTabByCode = function (tabCode) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.infocontainerController.getTabByCode');

    // Cherche l'onglet
    for (var i = 0; i < this['infos'].length; i++) {
        if (this['infos'][i]['tabCode'] === tabCode) {
            return this['infos'][i];
        }
    }
    ;
};

/**
 * Get the tab bootstrap-table element
 * @param {tab} tab tab
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.getTabTable = function (tab) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.infocontainerController.getTabTable');

    if (tab === undefined)
        return 0;

    return $("#infocontainer-table-" + tab['index']);
};

/**
 * Add a tab on the bar, if the tab already exist, then the tab is erased
 * @param {array<object>} tab Tab parameters
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.addTab = function (tab) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.infocontainerController.addTab');

    // Vérifie si l'onglet existe		
    for (var i = 0; i < this['infos'].length; i++) {
        if (this['infos'][i]['tabCode'] === tab['tabCode']) {
            var bTabExists = true;
            oVmap.log('onglet "' + this['infos'][i]['tabCode'] + '"" déjà présent');
            this['infos'][i] = tab;
        }
    }

    if (bTabExists === undefined)
        this['infos'].push(tab);

    var infocontainerController = this;
    // Reload les données des tableaux après avoir mis à jour la vue
    this.$timeout(function () {
        // Recharge les tables
        infocontainerController.loadTables();
    });
};

/**
 * Add a row on a tab
 * 
 * @param {object} row_options
 * @param {object} row_options.data bootstrap-table data
 * @param {object} row_options.columns bootstrap-table columns
 * @param {array} row_options.invisibleColumns list of the invisible columns
 *
 * @param {object} tab_options
 * @param {string} tab_options.tabCode tab code
 * @param {integer} tab_options.tabIndex tab index
 *
 * @returns {string} error or true if all was executed
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.addRow = function (tab_options, row_options) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.infocontainerController.addRow');

    if (tab_options.tabCode === undefined && tab_options.tabIndex === undefined)
        return 'bad tab_options';
    if (row_options.data === undefined)
        return 'row_options.data undefined';

    // Paramétrage des colones non visibles, "feature" par défaut
    row_options.invisibleColumns = goog.isDef(row_options.invisibleColumns) ?
            (function () {
                var tmp = row_options.invisibleColumns;
                if (!goog.array.contains(tmp, 'feature'))
                    tmp.push('feature');
                return tmp;
            }()) : ['feature'];

    // Paramétrage de l'onglet correspondant
    var tab = goog.isDef(tab_options.tabCode) ? this.getTabByCode(tab_options.tabCode) : this['infos'][tab_options.tabIndex];

    if (!goog.isDefAndNotNull(tab)) {
        cosnole.error('impossible de trouver la tab, tab_options:', tab_options);
        return 0;
    }

    // Si elles ne sont pas renseignées, les colones prennent pour valeur les clés de data
    var columns = goog.isDef(row_options.columns) ? row_options.columns : (function () {
        var columns = [];
        for (var key in row_options.data) {
            columns.push({
                'field': key,
                'title': key,
                'sortable': true,
                'visible': !goog.array.contains(row_options.invisibleColumns, key)
            });
        }
        return columns;
    })();

    // Test si la ligne existe
    for (var i = 0; i < tab['tableParams']['data'].length; i++) {
        bRowExists = true;
        for (var ii = 0; ii < columns.length; ii++) {
            if (columns[ii]['field'] !== 'feature')
                if (goog.object.contains(tab['tableParams']['data'][i], row_options.data[columns[ii]['field']]) === false)
                    bRowExists = false;
        }
        // Si la ligne existe
        if (bRowExists === true) {
            oVmap.log('ligne déjà existante');
            return 'ligne déjà existante';
        }
    }
    ;

    // Ajoute les nouvelles colonnes si besoin
    for (var i = 0; i < columns.length; i++) {
        var bColumnExists = false;

        // Test si la colonnes existe
        for (var ii = 0; ii < tab['tableParams']['columns'].length; ii++) {
            if (tab['tableParams']['columns'][ii]['field'] === columns[i]['field'])
                bColumnExists = true;
        }

        // Insertion de la colonne 
        if (bColumnExists === false)
            goog.array.insert(tab['tableParams']['columns'], columns[i]);
    }
    ;

    // Insertion de la ligne
    goog.array.insert(tab['tableParams']['data'], row_options.data);

    return true;
};

/**
 * Refresh the tabs
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.refreshTabs = function () {

    // Reload les données des tableaux
    var infocontainerController = this;
    this.$timeout(function () {
        // Recharge les tables
        infocontainerController.loadTables();
    });
};

/**
 * Add the infos of a table
 * @param {array<object>} infos infos to show:
 * @param {string} infos.i.tabCode code of the tab
 * @param {string} infos.i.tabName name of the tab
 * @param {object} infos.i.tableParams the params of the bootstrap-table element
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.addInfos = function (infos) {
    oVmap.log("nsVmap.nsToolsManager.InfoContainer.infocontainerController.addInfos");

    if (infos === undefined)
        return 0;
    if (this['infos'].length === 0)
        return this.setInfos(infos);

    for (var i = 0; i < infos.length; i++) {

        var bTabExists = false;
        for (var ii = 0; ii < this['infos'].length; ii++) {
            // Vérifie si l'onglet existe déjà		
            if (this['infos'][ii]['tabCode'] === infos[i]['tabCode']) {
                bTabExists = true;

                // Ajoute les lignes correspondantes
                for (var iii = 0; iii < infos[i]['tableParams']['data'].length; iii++) {
                    goog.array.insert(this['infos'][ii]['tableParams']['data'], infos[i]['tableParams']['data'][iii]);
                }
            }
        }

        if (bTabExists === false)
            goog.array.insert(this['infos'], infos[i]);
    }

    var infocontainerController = this;

    // Reload les données des tableaux après avoir mis à jour la vue
    this.$timeout(function () {
        // Recharge les tables
        infocontainerController.loadTables();
    });
};

/**
 * Set the infos
 * @param {object} infos
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.setInfos = function (infos) {
    oVmap.log("nsVmap.nsToolsManager.InfoContainer.infocontainerController.setInfos");

    if (infos === undefined)
        return 0;

    this['infos'] = infos;

    var infocontainerController = this;

    // Reload les données des tableaux après avoir mis à jour la vue
    this.$timeout(function () {
        // Recharge les tables
        infocontainerController.loadTables();
    });
};

/**
 * Delete all the rows in the tab. 
 * Warning: this function will remove the possible features binded on the rows
 * @param {string} tabCode tabCode of the tab
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.removeTabRows = function (tabCode) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.infocontainerController.removeTabRows');

    if (tabCode === undefined)
        return 0;

    $('body').css({"cursor": "wait"});
    var tab = this.getTabByCode(tabCode);
    var row = {};

    for (var i = tab['tableParams']['data'].length - 1; i >= 0; i--) {
        row = tab['tableParams']['data'][i];
        if (goog.array.contains(oVmap.getMap().getSelectionOverlay().getSource().getFeatures(), row['feature']))
            oVmap.getMap().getSelectionOverlay().getSource().removeFeature(row['feature']);
        tab['tableParams']['data'].splice(i, 1);
    }
    ;
    $('body').css({"cursor": ""});

    var infocontainerController = this;
    // Reload les données des tableaux après avoir mis à jour la vue
    this.$timeout(function () {
        // Recharge les tables
        infocontainerController.loadTables();
    });
};

/**
 * Delete a tab by tabCode. Warning: this function will not remove the possible features binded on the rows
 * @param {string} tabCode code of the tab
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.removeTabByCode = function (tabCode) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.infocontainerController.removeTabByNam');

    var aInfos = this['infos'];

    for (var i = aInfos.length - 1; i >= 0; i--) {
        if (aInfos[i]['tabCode'] === tabCode) {
            this.removeTabRows(tabCode);
            aInfos.splice(i, 1);
        }
    }
    ;
};

/**
 * Zoom on the tab features and pass them on the top of the featureOverlay
 * @param {string} tabCode code of the tab
 * @return {string} error
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.zoomOnTabFeatures = function (tabCode) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.infocontainerController.zoomOnTabFeatures');

    if (!goog.isDef(tabCode))
        return 'tabCode not defined';

    var features = [];
    var totalExtent = [];
    var data = this.getTabByCode(tabCode)['tableParams']['data'];

    /**
     * Stockage des features
     */
    for (var i = data.length - 1; i >= 0; i--) {
        if (goog.isDef(data[i]['feature']))
            goog.array.insert(features, data[i]['feature']);
    }

    if (features.length === 0)
        return 0;

    totalExtent = jQuery.extend(true, [], features[0].getGeometry().getExtent());
    for (var i = features.length - 1; i >= 0; i--) {
        var featureExtent = features[i].getGeometry().getExtent();
        if (featureExtent[0] < totalExtent[0])
            totalExtent[0] = featureExtent[0];
        if (featureExtent[1] < totalExtent[1])
            totalExtent[1] = featureExtent[1];
        if (featureExtent[2] > totalExtent[2])
            totalExtent[2] = featureExtent[2];
        if (featureExtent[3] > totalExtent[3])
            totalExtent[3] = featureExtent[3];
        delete featureExtent;
    }

    // En cas de simple point par exemple
    if (totalExtent[0] === totalExtent[2]) {
        totalExtent[0] = totalExtent[0] - totalExtent[0] * 0.0001;
        totalExtent[2] = totalExtent[2] + totalExtent[2] * 0.0001;
    }
    if (totalExtent[1] === totalExtent[3]) {
        totalExtent[1] = totalExtent[1] - totalExtent[1] * 0.0001;
        totalExtent[3] = totalExtent[3] + totalExtent[3] * 0.0001;
    }

    setTimeout(function () {

        // Zoom sur l'étendue totale
        var olView = oVmap.getMap().getOLMap().getView();
        olView.fit(totalExtent, oVmap.getMap().getOLMap().getSize(), {
            padding: [50, 50, 50, 50]
        });

        /**
         * Passe les features au dessus
         */
        for (var i = features.length - 1; i >= 0; i--) {
            if (goog.array.contains(oVmap.getMap().getSelectionOverlay().getSource().getFeatures(), features[i]))
                oVmap.getMap().getSelectionOverlay().getSource().removeFeature(features[i]);
            oVmap.getMap().getSelectionOverlay().getSource().addFeature(features[i]);
        }
    });
};

/**
 * Display pass the tab features on the top of the featureOverlay
 * @param {string} tabCode code of the tab
 * @return {string} error
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.displayTabFeatures = function (tabCode) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.infocontainerController.displayTabFeatures');

    if (!goog.isDef(tabCode))
        return 'tabCode not defined';

    var features = [];
    var data = this.getTabByCode(tabCode)['tableParams']['data'];

    /**
     * Stockage des features
     */
    for (var i = data.length - 1; i >= 0; i--) {
        if (goog.isDef(data[i]['feature']))
            goog.array.insert(features, data[i]['feature']);
    }

    if (features.length === 0)
        return 0;

    /**
     * Ajoute les features au dessus
     */
    for (var i = features.length - 1; i >= 0; i--) {
        if (goog.array.contains(oVmap.getMap().getSelectionOverlay().getSource().getFeatures(), features[i]))
            oVmap.getMap().getSelectionOverlay().getSource().removeFeature(features[i]);
        oVmap.getMap().getSelectionOverlay().getSource().addFeature(features[i]);
    }
};

/**
 * Load the tables
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.loadTables = function () {
    oVmap.log("nsVmap.nsToolsManager.InfoContainer.infocontainerController.loadTables");

    for (var i = this['infos'].length - 1; i >= 0; i--) {

        $("#infocontainer-table-" + i).bootstrapTable('destroy');
        $("#infocontainer-table-" + i).bootstrapTable(this['infos'][i]['tableParams']);
        $("#infocontainer-table-" + i).bootstrapTable('load', this['infos'][i]['tableParams']);
        $("#infocontainer-table-" + i).bootstrapTable('resetView', this['infos'][i]['tableParams']);
        $("#infocontainer-table-" + i).bootstrapTable('resetWidth');
    }
};

/**
 * Set the avaliable business objects
 * @param {string} business_object_id
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.setAvaliablePrintReports = function (business_object_id) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.infocontainerController.setReports');

    var this_ = this;

    // Vide le tableau de rapports en cours
    if (goog.isArray(this['avaliablePrintReports']))
        this['avaliablePrintReports'].length = 0;
    else
        this['avaliablePrintReports'] = [];

    if (!goog.isDefAndNotNull(business_object_id)) {
        $.notify('Aucun rapport disponible', 'warning');
        return 0;
    }

    // Recharge les nouvelles valeurs du tableau de rapports
    showAjaxLoader();
    this.$http_({
        method: "GET",
        url: oVmap['properties']['api_url'] + '/vmap/printreports',
        params: {
            'token': oVmap['properties']['token'],
            'attributs': 'name|printreport_id|business_object_id|business_object_id_field|multiobject',
            'filter': "business_object_id='" + business_object_id + "'"
        }
    }).then(function (response) {
        hideAjaxLoader();

        if (!goog.isDefAndNotNull(response['data'])) {
            console.error('response.data undefined: ', response);
            $('#infocontainer-dropdown-reports').dropdown('toggle');
            return 0;
        }
        if (!goog.isDefAndNotNull(response['data']['data'])) {
            $.notify('Aucun rapport disponible pour ' + business_object_id, 'warning');
            $('#infocontainer-dropdown-reports').dropdown('toggle');
            return 0;
        }

        this_['avaliablePrintReports'] = response['data']['data'];

    }, function (response) {
        hideAjaxLoader();
        $.notify('Impossible de récupèrer les rapports liés à l\'objet métier');
        console.error(response);
    });

};

/**
 * Generate the report
 * @param {object} printreport
 * @param {string} printreport.printreport_id
 * @param {string} printreport.business_object_id_field
 * @param {string} tabIndex
 * @export
 */
nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController.prototype.generatePrintReport = function (printreport, tabIndex) {
    oVmap.log('nsVmap.nsToolsManager.InfoContainer.infocontainerController.generatePrintReport');

    var aSelection = $('#infocontainer-table-' + tabIndex).bootstrapTable('getSelections');

    if (!goog.isArray(aSelection)) {
        $.notify('Impossible de récupérer la sélection du tableau');
        return 0;
    }
    if (aSelection.length <= 0) {
        $.notify('Aucun élément sélectionné');
        return 0;
    }

    // Construction de aIds
    var aIds = [];
    for (var i = 0; i < aSelection.length; i++) {
        if (goog.isDefAndNotNull(aSelection[i][printreport['business_object_id_field']])) {
            aIds.push(aSelection[i][printreport['business_object_id_field']]);
        }
    }

    if (!aIds.length > 0) {
        $.notify('Génération du document impossible');
        console.error('generated aIds is empty');
        return 0;
    }

    oVmap.generatePrintReport({
        'printReportId': printreport['printreport_id'],
        'ids': aIds
    });
};

// Définit la directive et le controller
oVmap.module.directive('appInfocontainer', nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerDirective);
oVmap.module.controller('AppInfocontainerController', nsVmap.nsToolsManager.InfoContainer.prototype.infocontainerController);
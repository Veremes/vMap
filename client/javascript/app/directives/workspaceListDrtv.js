/* global vitisApp, goog */

// Google closure
goog.provide("vitis.directives.workspaceList");
goog.require("vitis.modules.main");

/**
 * appWorkspaceList directive.
 * .
 * @param {angular.$timeout} $timeout Angular timeout service.
 * @param {angular.$rootScope} $rootScope Angular rootScope.
 * @param {angular.$templateRequest} $templateRequest Angular templateRequest service.
 * @param {angular.$compile} $compile Angular compile.
 * @param {} uiGridConstants.
 * @param {service} externFunctionSrvc Fonctions externes à Angular.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} envSrvc Paramètres d'environnement.
 * @ngInject
 * @export
 **/
vitisApp.appWorkspaceListDrtv = function ($timeout, $rootScope, $templateRequest, $compile, uiGridConstants, externFunctionSrvc, propertiesSrvc, envSrvc) {
    return {
        restrict: 'A',
        controller: 'workspaceListCtrl',
        controllerAs: 'ctrl',
        scope: true,
        link: function (scope, element, attrs) {
            var clearListenerFormExtracted;
            // Sauve l'api de ui-grid dans le scope.
            scope["gridOptions"]["onRegisterApi"] = function (gridApi) {
                scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]] = gridApi;
                // Initialisation du tri par défaut pour l"api rest.
                if (goog.isDefAndNotNull(scope["gridOptions"]["oUrlParams"])) {
                    envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oUrlParams"] = scope["gridOptions"]["oUrlParams"];
                } else {
                    envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oUrlParams"] = {
                        "order_by": envSrvc["oSelectedObject"]["sorted_by"],
                        "sort_order": envSrvc["oSelectedObject"]["sorted_dir"]
                    };
                }

                // Evènement déclenché si la page sélectionnée change.
                gridApi["pagination"]["on"]["paginationChanged"](scope, function (newPage, pageSize) {
                    // Change la page.
                    if (gridApi["grid"]["options"]["useExternalPagination"] !== false) {
                        if (typeof (envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]) !== "undefined" && typeof (scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]) !== "undefined") {
                            var oFilter = envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oFilter"];
                            //envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oFilter"] = angular.copy(oFilterDistinct);
                            envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oFilter"] = angular.copy(oFilter);
                            scope["setGridPage"](newPage, pageSize, envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oFilter"], envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oUrlParams"]);
                            // Sauve le nombre d'éléments par page.
                            propertiesSrvc["rows_per_page"] = envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationPageSize"];
                        }
                    } else
                        scope.$root["setPaginationStatus"]();
                });
                // Evènement déclenché si le tri change.
                gridApi["core"]["on"]["sortChanged"](scope, function (grid, sortColumns) {
                    var oUrlParams = {};
                    if (sortColumns.length > 0) {
                        oUrlParams["order_by"] = sortColumns[0]["field"];
                        oUrlParams["sort_order"] = sortColumns[0]["sort"]["direction"].toUpperCase();
                    }
                    // Sauve le tri.
                    envSrvc["oGridOptionsCopy"][envSrvc["sSelectedGridOptionsName"]]["oUrlParams"]["order_by"] = oUrlParams["order_by"];
                    envSrvc["oGridOptionsCopy"][envSrvc["sSelectedGridOptionsName"]]["oUrlParams"]["sort_order"] = oUrlParams["sort_order"];

                    // Index de la section affichée.
                    var iSelectedSectionIndex = 0;
                    if (typeof (envSrvc["oSectionForm"]) != "undefined" && typeof (envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]) != "undefined" && typeof (envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]["iSelectedSectionIndex"]) != "undefined")
                        iSelectedSectionIndex = envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]["iSelectedSectionIndex"];
                    // Sauve le tri (colonne + direction).
                    if (Array.isArray(envSrvc["oSelectedObject"]["sections"])) {
                        var aGridColumns = envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["columns"];
                        var i = 0;
                        while (i < aGridColumns.length) {
                            delete aGridColumns[i]["sort"];
                            // La colonne est celle du tri sélectionné ?
                            if (aGridColumns[i]["field"] === oUrlParams["order_by"]) {
                                aGridColumns[i]["sort"] = {
                                    "direction": uiGridConstants[oUrlParams["sort_order"]],
                                    "ignoreSort": true,
                                    "priority": 0
                                };
                            }
                            i++;
                        }
                        envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["columns"] = aGridColumns;
                    }
                    // Sauve les paramètres passés dans l'url pour l'api Rest.
                    envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oUrlParams"] = oUrlParams;
                    // Charge la 1ere page avec le tri
                    if (envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationCurrentPage"] === 1)
                        scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["pagination"]["raise"]["paginationChanged"](1, envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationPageSize"]);
                    else
                        envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationCurrentPage"] = 1;
                });
                // Module "ui.grid.draggable-rows" chargé ?
                if (typeof (gridApi["dragndrop"]) !== "undefined") {
                    // Activation ou désactivation du drag'n drop.
                    if (scope["gridOptions"]["appEnableDragAndDrop"] === true) {
                        gridApi["dragndrop"]["setDragDisabled"] = false;
                        // Début du drag'n drop.
                        gridApi["draggableRows"]["on"]["rowDragged"](scope, function (info, rowElement) {
                        });
                        // Fin du drag'n drop.
                        gridApi["draggableRows"]["on"]["rowFinishDrag"](scope, function () {
                            if (typeof (scope["gridOptions"]["appDragAndDropEvent"]) !== "undefined" && typeof (scope["gridOptions"]["appDragAndDropEvent"]["rowFinishDrag"]) !== "undefined")
                                scope.$root[scope["gridOptions"]["appDragAndDropEvent"]["rowFinishDrag"]]();
                        });
                        //
                        gridApi["draggableRows"]["on"]["rowEnterRow"](scope, function (info, rowElement) {
                        });
                        //
                        gridApi["draggableRows"]["on"]["beforeRowMove"](scope, function (from, to, data) {
                        });
                    } else
                        gridApi["dragndrop"]["setDragDisabled"] = true;
                }

                // Charge la 1ere page quand la liste des colonnes est ok.
                envSrvc["oGridOptionsCopy"][envSrvc["sSelectedGridOptionsName"]] = angular.copy(envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]);
                if (envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["appLoadGridData"]) {
                    var columnsAddedEvent = $rootScope.$on("workspaceListColumnsAdded", function (event, arg) {

                        // Permet de sauvegarder la page en cours quand on revient sur la liste
                        var iPageNumber = goog.isDefAndNotNull(envSrvc["oSelectedObject"]["iPageNumber"]) ? envSrvc["oSelectedObject"]["iPageNumber"] : 1;
                        // Si on est dans une liste de section, il ne faut pas utiliser la page sauvegardée
                        if (envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["sectionGrid"] === true) {
                            iPageNumber = goog.isDefAndNotNull(envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationCurrentPage"]) ? envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationCurrentPage"] : 1;
                        }

                        scope["setGridPage"](iPageNumber, envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationPageSize"], envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oFilter"], envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oUrlParams"]);
                        columnsAddedEvent();
                    });
                }
                //
                if (envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["appResizeGrid"] === true) {
                    scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["core"]["handleWindowResize"]();
                    scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["core"]["refreshRows"]();
                }
                // Mise à jour de la barre de statut.
                scope.$root["setPaginationStatus"]();
            };
            //
            $timeout(function () {
                // Redimensionnement de la fenêtre (attends Angular)
                externFunctionSrvc["resizeWin"]();
                scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["core"]["handleWindowResize"]();
                scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["core"]["refreshRows"]();
                // ui-grid : sélectionne toute la ligne si click sur une de ses colonnes.
                $(element).find(".ui-grid-render-container-body").on("click.selectRow", function (event) {
                    var oCell = event.target;
                    // Click sur la colonne de données ou d'action (boutons) ?
                    if ($(oCell).hasClass("ui-grid-cell") || $(oCell).hasClass("ui-grid-cell-contents")) {
                        var iRowIndex = $(element).find(".ui-grid-render-container-body .ui-grid-canvas").children().index($(oCell).parents(".ui-grid-row"));
                        $(element).find(".ui-grid-render-container-left .ui-grid-row").eq(iRowIndex).find(".ui-grid-selection-row-header-buttons").click();
                    }
                });
                // Hauteur auto. du "body" de la liste.
                element[0].querySelector(".ui-grid-render-container-body").style.height = "100%";
                element[0].querySelector(".ui-grid-render-container-body .ui-grid-viewport").style.height = "Calc(100% - 30px)";
                // Emission d'un évènement de fin de compilation du template workspaceList.
                $rootScope.$emit("workspaceListTplCompiled");
            }, 1);

            // Affiche / cache le formulaire de recherche de la liste.
            $(element).find(".workspacelist-grid-header-search-button-arrow-right").click(function () {
                // Compilation du template de formulaire des filtres.
                if (!scope["searchFormCompiled"]) {
                    $templateRequest("templates/formTpl.html").then(function (sTemplate) {
                        $compile($("#" + envSrvc["oSelectedObject"]["name"] + "_" + envSrvc["sSelectedSectionName"] + "_grid_header_search_form").html(sTemplate).contents())(scope);
                        // Attends la fin de l'affichage formulaire.
                        clearListenerFormExtracted = scope.$root.$on("formExtracted", function (event, sFormDefinitionName) {
                            if (sFormDefinitionName === envSrvc["sFormDefinitionName"]) {
                                // Supprime le "listener".
                                clearListenerFormExtracted();
                                // Sauve le formulaire par défaut des filtres.
                                if (typeof (envSrvc["oWorkspaceList"][envSrvc["sSelectedGridOptionsName"]]["oDefaultValues"]) == "undefined") {
                                    envSrvc["oWorkspaceList"][envSrvc["sSelectedGridOptionsName"]]["oDefaultValues"] = angular.copy(envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]);
                                    envSrvc["oWorkspaceList"][envSrvc["sSelectedGridOptionsName"]]["oValues"] = angular.copy(envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]);
                                    envSrvc["oWorkspaceList"][envSrvc["sSelectedGridOptionsName"]]["oFormDefinition"] = angular.copy(envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]);
                                } else {
                                    // Copie du formulaire sauvé (le formReader remet le form. à vide ?).
                                    envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]] = angular.copy(envSrvc["oWorkspaceList"][envSrvc["sSelectedGridOptionsName"]]["oValues"]);
                                    envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]] = angular.copy(envSrvc["oWorkspaceList"][envSrvc["sSelectedGridOptionsName"]]["oFormDefinition"]);
                                    // Rafraîchit le formulaire.
                                    scope.$broadcast('$$rebind::refresh');
                                    scope.$apply();
                                }
                            }
                        });
                    });
                    scope["searchFormCompiled"] = true;
                }
                // Attend un cycle de $digest (sinon les valeurs du formulaire s'affichent en retard).
                $timeout(function () {
                    $(this).parent().find('.workspacelist-grid-header-search-button-arrow-icon').toggleClass('icon-keyboard_arrow_right');
                    $(this).parent().find('.workspacelist-grid-header-search-button-arrow-icon').toggleClass('icon-keyboard_arrow_down');
                    $(element).find(".workspacelist-grid-header-search-form").slideToggle(400, function () {
                        externFunctionSrvc["resizeWin"]();
                        scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["core"]["handleWindowResize"]();
                        scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["core"]["refreshRows"]();
                    });
                });
            });
            // Attend la suppression du scope.
            scope.$on("$destroy", function () {
                // Supprime l'évènement.
                $(element).find(".ui-grid-render-container-body").off("click.selectRow");
                // Supprime les données de la liste.
                var oGridOptions = envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]];
                if (oGridOptions !== null) {
                    var aParametersToClear = ["columnDefs", "data", "appActions", "oFilter", "oUrlParams", "paginationPageSizes"];
                    aParametersToClear.forEach(function (sParameterName) {
                        envSrvc["toGarbageCollection"](oGridOptions[sParameterName]);
                    });
                    oGridOptions["onRegisterApi"] = null;
                    // Supprime les données sauvegardées de la liste.
                    envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]] = null;
                    scope["gridOptions"] = null;
                    $rootScope["gridApi"][envSrvc["sSelectedGridOptionsName"]] = null;
                    envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]] = {};
                }
                if (goog.isFunction(clearListenerFormExtracted)) {
                    clearListenerFormExtracted();
                }
            });
        }
    };
};
vitisApp.module.directive("appWorkspaceList", vitisApp.appWorkspaceListDrtv);

/**
 * appUiGridAction directive.
 * Boutons de la colonne "Actions" du module ui-grid.
 * @ngInject
 **/
vitisApp.appUiGridActionDrtv = function () {
    return {
        replace: true,
        templateUrl: "templates/uiGridActionTpl.html"
    };
};
vitisApp.module.directive("appUiGridAction", vitisApp.appUiGridActionDrtv);

/**
 * appUiGridPagination directive.
 * Pagination du module ui-grid.
 * @ngInject
 **/
vitisApp.appUiGridPaginationDrtv = function () {
    return {
        templateUrl: "templates/uiGridPaginationTpl.html"
    };
};
vitisApp.module.directive("appUiGridPagination", vitisApp.appUiGridPaginationDrtv);

/**
 * appSearchForm directive.
 * Charge le template de formulaire pour la recherche.
 **/
vitisApp.appSearchFormDrtv = function () {
    return {
        replace: true
    };
};
vitisApp.module.directive("appSearchForm", vitisApp.appSearchFormDrtv);

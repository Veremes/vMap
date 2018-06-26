/* global vitisApp, goog, entity */
'use strict';

// Google closure
goog.provide("vitis.controllers.workspaceList");
goog.require("vitis.modules.main");

/**
 * workspaceList Controller.
 * 
 * Affiche la liste des enregistrements d'un objet (vm_table).
 * 
 * @param {angular.$scope} $scope Angular scope.
 * @param {angular.$log} $log Angular log service.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} modesSrvc Liste des modes et objets de l'utilisateur.
 * @param {service} uiGridExporterService Modes pour l'export des grid list
 * @ngInject
 **/
vitisApp.workspaceListCtrl = function ($scope, $log, envSrvc, propertiesSrvc, modesSrvc, uiGridExporterService) {
    $log.info("initWorkspaceList");
    $scope.$emit("initWorkspaceList", $scope);
    // Sauve le nouveau scope crée dans la définition de l'onglet. 
    modesSrvc["addScopeToObject"](envSrvc["oSelectedObject"]["name"], envSrvc["oSelectedMode"]["mode_id"], $scope);
    //envSrvc["aSelectedObjectScopes"].push($scope.$id);
    // Titre de la liste.
    //$scope['sSelectedObjectLabel'] = envSrvc["oSelectedObject"]["label"];
    // Boutons d'actions à afficher pour chaque enregistrement (modifier, visualiser)
    $scope["edit_column"] = envSrvc["oSelectedObject"]["edit_column"];
    $scope["show_column"] = envSrvc["oSelectedObject"]["show_column"];
    // Vérifie si un précédent filtre de recherche existe (si le mode ne doit pas être rechargé automatiquement).
    var oFilter;
    // Paramétrage du module ui-grid (si pas déja fait).
    if (Object.keys($scope["gridOptions"]).length === 0) {
        $log.info("Init GridOptions");
        $scope["gridOptions"] = {
            "enableRowSelection": true,
            "enableSelectAll": true,
            //"enableRowHeaderSelection" : false,
            //"enableFullRowSelection" : true,
            "enablePagination": true,
            "enablePaginationControls": false,
            "useExternalPagination": true,
            "paginationPageSize": propertiesSrvc["rows_per_page"],
            "enableColumnMenus": false,
            "enableColumnResizing": true, // Redimensionnement des colonnes.
            //"enableColumnMoving": true,      // Déplacement des colonnes.
            "paginationPageSizes": [5, 10, 20, 50, 100, 200, 500],
            "appHeader": true, // Barre d'entête de la liste.
            "appHeaderTitleBar": true, // Barre (boutons...) sous le form. de recherche.
            "appHeaderSearchForm": true, // Formulaire de recherche.
            "appHeaderOptionBar": false,
            "appLoadGridData": true, // Charge les données à la création de la liste.
            "appGridTitle": envSrvc["oSelectedObject"]["label"], // Titre de la liste.
            "appResizeGrid": false, // Redimensionne la grille après sa création.
            "appFooter": true, // Barre de pied de page de la liste.
            "appShowPagination": true, // Affiche le template de pagination.
            "appEnableDragAndDrop": false, // Activation ou désactivation du drag'n drop.
            "appDragAndDropEvent": {}, // Evènements pour le drag'n drop.
            "appActions": [], // Boutons d'actions.
            "appShowActions": true, // Affichage des boutons d'actions.
            "appEnableCsvExport": true, // Activation ou désactivation de l'exportation csv.
            "exporterCsvFilename": new String(envSrvc["oSelectedObject"]['label'])
        };
    }
    // Sauve l'objet ui-grid.
    var sSelectedObjectName = envSrvc["oSelectedObject"]["name"];
    $scope['sSelectedObjectName'] = sSelectedObjectName;
    $scope["sSelectedSectionName"] = envSrvc["sSelectedSectionName"];
    envSrvc["sSelectedGridOptionsName"] = sSelectedObjectName;
    if (envSrvc["sSelectedSectionName"] != "")
        envSrvc["sSelectedGridOptionsName"] += "_" + envSrvc["sSelectedSectionName"];
    $scope["sSelectedGridOptionsName"] = envSrvc["sSelectedGridOptionsName"];
    envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]] = $scope["gridOptions"];

    // Sauve la définition originale de la liste.
    if (typeof (envSrvc["oDefaultGridOptions"][envSrvc["sSelectedGridOptionsName"]]) === "undefined")
        envSrvc["oDefaultGridOptions"][envSrvc["sSelectedGridOptionsName"]] = angular.copy($scope["gridOptions"]);
    // Récupère un filtre et les valeurs de formulaires sauvegardés.
    if (typeof (envSrvc["oWorkspaceList"][envSrvc["sSelectedGridOptionsName"]]) === "undefined")
        envSrvc["oWorkspaceList"][envSrvc["sSelectedGridOptionsName"]] = {};
    else {
        if (typeof (envSrvc["oWorkspaceList"][envSrvc["sSelectedGridOptionsName"]]["oFilter"]) !== "undefined")
            oFilter = angular.copy(envSrvc["oWorkspaceList"][envSrvc["sSelectedGridOptionsName"]]["oFilter"]);
        if (typeof (envSrvc["oWorkspaceList"][envSrvc["sSelectedGridOptionsName"]]["oFormValue"]) !== "undefined")
            envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]] = angular.copy(envSrvc["oWorkspaceList"][envSrvc["sSelectedGridOptionsName"]]["oFormValue"]);
    }
    // Paramètres des filtres
    if (typeof (oFilter) !== "undefined")
        $scope["gridOptions"]["oFilter"] = oFilter;
    // Paramètres de tri.
    if (typeof (envSrvc["oGridOptionsCopy"][envSrvc["sSelectedGridOptionsName"]]) !== "undefined")
        $scope["gridOptions"]["oUrlParams"] = angular.copy(envSrvc["oGridOptionsCopy"][envSrvc["sSelectedGridOptionsName"]]["oUrlParams"]);

    // Template pour activer le drag'n drop.
    if ($scope["gridOptions"]["appEnableDragAndDrop"] === true)
        $scope["gridOptions"]["rowTemplate"] = '<div grid="grid" class="ui-grid-draggable-row" draggable="true"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'custom\': true }" ui-grid-cell></div></div>';

    // Titre de la liste.
    // Chargement de la définition des colonnes (si pas déja fait).
    var sResourceId = envSrvc["getSectionWebServiceResourceId"]();

    // Index de la section affichée.
    var iSelectedSectionIndex = 0;
    if (typeof (envSrvc["oSectionForm"]) !== "undefined" && typeof (envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]) !== "undefined" && typeof (envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]["iSelectedSectionIndex"]) !== "undefined")
        iSelectedSectionIndex = envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]["iSelectedSectionIndex"];
    // Recharge les ressources de l'onglet si la liste est dans une section.
    if (iSelectedSectionIndex > 0)
        delete envSrvc["oSelectedObject"]["sections"][0]["columns"];
    //
    if (sResourceId !== null && typeof ($scope["gridOptions"]["columnDefs"]) === "undefined") {
        // Si 1er affichage de l'onglet : chargement des colonnes et boutons de la liste.
        if (!goog.isDefAndNotNull(envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["columns"])) {
            envSrvc["oWorkspaceList"][envSrvc["oSelectedObject"]["name"]]["oldPaginationSave"] = 1;
            ajaxRequest({
                "method": "GET",
                "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vitis/ressources/" + sResourceId,
                "scope": $scope,
                "success": function (response) {
                    if (response["data"]["status"] === 1) {
                        var aResourceId = envSrvc["explodeWebServiceResourceId"](sResourceId);
                        var aData = response["data"]["ressources"][0][aResourceId[1]][0]["columns"];
                        if (aData.length > 0) {
                            // Formatte les colonnes pour ui-grid.
                            aData = $scope.$root["formatGridColumn"](aData, sSelectedObjectName);
                            $log.info($scope.$root["formatGridColumn"](aData, sSelectedObjectName));
                            // Sauve le nom du champ qui correspond à l'id.
                            //envSrvc["sIdField"] = aData[0]["field"];
                            envSrvc["oSelectedObject"]["sIdField"] = aData[0]["field"];
                            // Ajoute la colonne d'actions (boutons "update" & "display")
                            if (typeof ($scope["gridOptions"]["appShowActions"]) == "undefined" || $scope["gridOptions"]["appShowActions"] !== false) {
                                if (envSrvc["oSelectedObject"]["edit_column"] !== null || envSrvc["oSelectedObject"]["show_column"] !== null) {
                                    aData.unshift({
                                        "name": "",
                                        "field": "actions",
                                        //"cellClass":"workspace-list-action",
                                        "cellTemplate": "<app-ui-grid-action></app-ui-grid-action>",
                                        "width": 60,
                                        "enableSorting": false,
                                        "enableColumnMoving": false,
                                        "enableColumnResizing": false
                                    });
                                }
                            }
                            // Sauvegarde et mise à jour de la définition des colonnes.
                            envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["columns"] = aData.slice(0);
                            $scope["gridOptions"]["columnDefs"] = envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["columns"].slice(0);
                            // désactivation de l'édition de la cellule par défaut
                            for (var i = 0; i < $scope["gridOptions"]["columnDefs"].length; i++) {
                                $scope["gridOptions"]["columnDefs"][i]["cellEditableCondition"] = false;
                            }
                            // Sauvegarde et mise à jour de la définition des actions (boutons).
                            var aActions = response["data"]["ressources"][0][aResourceId[1]][1]["actions"];
                            if (typeof (aActions) !== "undefined") {
                                envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["actions"] = $scope.$root["formatGridAction"](aActions, sSelectedObjectName);
                            } else {
                                envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["actions"] = [];
                            }
                            if (envSrvc["sMode"] != "display") {
                                $scope["gridOptions"]["appActions"] = envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["actions"].slice(0);
                            }
                            // Emission d'un évènement de fin d'ajout des boutons d'actions pour post traitement (utilisé dans WAB)
                            $scope.$root.$emit("workspaceListHeaderActionsAdded", $scope["gridOptions"]);
                            // Emission d'un évèvement permettant de savoir que la liste des colonnes a été chargée
                            $scope.$root.$emit("workspaceListColumnsAdded", $scope["gridOptions"]);
                        }
                    }
                }
            });
        } else {
            envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationCurrentPage"] = envSrvc["oWorkspaceList"][envSrvc["sSelectedGridOptionsName"]]["oldPaginationSave"];
            // Mise à jour de la définition des colonnes.
            $scope["gridOptions"]["columnDefs"] = envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["columns"].slice(0);
            // désactivation de l'édition de la cellule par défaut
            for (var i = 0; i < $scope["gridOptions"]["columnDefs"].length; i++) {
                $scope["gridOptions"]["columnDefs"][i]["cellEditableCondition"] = false;
            }
            // Mise à jour de la définition des actions (boutons).
            if (envSrvc["sMode"] != "display")
                $scope["gridOptions"]["appActions"] = envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["actions"].slice(0);
            // Emission d'un évènement de fin d'ajout des boutons d'actions pour post traitement (utilisé dans WAB)
            $scope.$root.$emit("workspaceListHeaderActionsAdded", $scope["gridOptions"]);
            // Emission d'un évèvement permettant de savoir que la liste des colonnes a été chargée
            setTimeout(function () {
                $scope.$root.$emit("workspaceListColumnsAdded", $scope["gridOptions"]);
            });
        }
    } else {
        // Emission d'un évèvement permettant de savoir que la liste des colonnes a été chargée
        setTimeout(function () {
            $scope.$root.$emit("workspaceListColumnsAdded", $scope["gridOptions"]);
        });
    }

    $scope['showExportModal'] = function () {
        $log.info("showExportModal");
        $('#ExportModal').modal('show');
        // Paramètres par défaut.
        envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oUrlParams"]['limit'] = 10000;
        envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["exporterCsvFilename"] = envSrvc["oSelectedObject"]['label'];
        document.getElementById("ExportModal").querySelector("#SelectValue").options.selectedIndex = 0;
    };

    $scope['exportCSVFormat'] = function () {
        $log.info("ExportCSVFormat");

        var sResourceId = envSrvc["getSectionWebServiceResourceId"]();
        var aResourceId = envSrvc["explodeWebServiceResourceId"](sResourceId);

        var oUrlParams = envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oUrlParams"];

        var e = document.getElementById("SelectValue");
        var testSelect = e.options[e.selectedIndex].text;
        var FilenameXLSX = $scope['gridOptions']['exporterCsvFilename'] + '.xlsx';
        var FilenameCSV = $scope['gridOptions']['exporterCsvFilename'] + '.csv';

        var aExportColumnHeaders = [];
        var aExportData = [];
        for (i = 0; i < envSrvc["oSelectedObject"]["sections"][0]["columns"].length; i++) {
            if (envSrvc["oSelectedObject"]["sections"][0]["columns"][i].name !== "") {
                aExportColumnHeaders.push(envSrvc["oSelectedObject"]["sections"][0]["columns"][i]);
            }
        }

        ajaxRequest({
            "method": "GET",
            "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/" + aResourceId[0] + "/" + aResourceId[1],
            "params": angular.copy(oUrlParams),
            "scope": $scope,
            "success": function (response) {

                if (response["data"]["status"] === 1) {

                    var aData = response["data"][aResourceId[1]];
                    for (i = 0; i < aData.length; i++) {
                        var values = [];
                        var value = {};
                        angular.forEach(aExportColumnHeaders, function (column) {
                            if (response["data"][aResourceId[1]][i][column['field']] !== null) {

                                value = response["data"][aResourceId[1]][i][column['field']];

                            } else {
                                value = "null";

                            }
                            if (response["data"][aResourceId[1]][i][column['field']] === "") {
                                value = "null";
                            }
                            values[column['displayName']] = value;
                        });
                        aExportData.push(values);
                    }
                    ;
                    
                    console.log("aExportData: ", aExportData);

                    if (testSelect === ".XLSX") {
                        alasql("SELECT * INTO XLSX(" + "'" + FilenameXLSX + "'" + " ,{headers:true}) FROM ? ", [aExportData]);
                    }
                    if (testSelect === ".CSV") {
                        alasql("SELECT * INTO CSV(" + "'" + FilenameCSV + "'" + " ,{headers:true}) FROM ? ", [aExportData]);
                    }
                }
            }
        });
    };
};

vitisApp.module.controller("workspaceListCtrl", vitisApp.workspaceListCtrl);

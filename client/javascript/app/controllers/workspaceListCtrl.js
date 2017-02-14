/* global vitisApp */

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
 * @param {service} Restangular Service Restangular.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} sessionSrvc Service de gestion des sessions.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @param {service} formSrvc Service de gestion des formulaires.
 * @param {service} modesSrvc Liste des modes et objets de l'utilisateur.
 * @ngInject
 **/
vitisApp.workspaceListCtrl = function ($scope, $log, Restangular, envSrvc, sessionSrvc, propertiesSrvc, formSrvc, modesSrvc) {
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
    var aFilter, oUrlParams;
    /*
    if (!envSrvc["oSelectedMode"]["reload"]) {
        var oGridOptionsCopy = envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]];
        if (typeof (oGridOptionsCopy) !== "undefined" && typeof (oGridOptionsCopy["aFilter"]) !== "undefined")
            aFilter = oGridOptionsCopy["aFilter"];

        if (typeof (oGridOptionsCopy) !== "undefined" && typeof (oGridOptionsCopy["oUrlParams"]) !== "undefined")
            oUrlParams = oGridOptionsCopy["oUrlParams"];
    } else
        envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]] = {};
    */
    // Paramétrage du module ui-grid (si pas déja fait).
    if (Object.keys($scope["gridOptions"]).length === 0) {
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
            "paginationPageSizes": [10, 20, 50, 100, 200, 500],
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
            "appShowActions": true // Affichage des boutons d'actions.
        };
    }
    // Récupère un filtre et les valeurs de formulaires sauvegardés.
    if (typeof(envSrvc["oWorkspaceList"][envSrvc["oSelectedObject"]["name"]]) == "undefined")
        envSrvc["oWorkspaceList"][envSrvc["oSelectedObject"]["name"]] = {};
    else {
        if (typeof(envSrvc["oWorkspaceList"][envSrvc["oSelectedObject"]["name"]]["aFilter"]) != "undefined")
            aFilter = angular.copy(envSrvc["oWorkspaceList"][envSrvc["oSelectedObject"]["name"]]["aFilter"]);
        if (typeof(envSrvc["oWorkspaceList"][envSrvc["oSelectedObject"]["name"]]["oFormValue"]) != "undefined")
            envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]] = angular.copy(envSrvc["oWorkspaceList"][envSrvc["oSelectedObject"]["name"]]["oFormValue"]);
    }
    //
    if (typeof (aFilter) !== "undefined")
        $scope["gridOptions"]["aFilter"] = aFilter;
    //
    if (typeof (oUrlParams) !== "undefined")
        $scope["gridOptions"]["oUrlParams"] = oUrlParams;

    // Template pour activer le drag'n drop.
    if ($scope["gridOptions"]["appEnableDragAndDrop"] === true)
        $scope["gridOptions"]["rowTemplate"] = '<div grid="grid" class="ui-grid-draggable-row" draggable="true"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'custom\': true }" ui-grid-cell></div></div>';

    // Charge la liste des enregistrements de l'onglet
    var sSelectedObjectName = envSrvc["oSelectedObject"]["name"];
    $scope['sSelectedObjectName'] = sSelectedObjectName;
    // Sauve l'objet ui-grid.
    envSrvc["oGridOptions"][sSelectedObjectName] = $scope["gridOptions"];

    // Titre de la liste.
    // Chargement de la définition des colonnes (si pas déja fait).
    var sResourceId = envSrvc["getSectionWebServiceResourceId"]();
    
    // Index de la section affichée.
    var iSelectedSectionIndex = 0;
    if (typeof (envSrvc["oSectionForm"]) != "undefined" && typeof (envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]) != "undefined" && typeof (envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]["iSelectedSectionIndex"]) != "undefined")
        iSelectedSectionIndex = envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]["iSelectedSectionIndex"];
    // Recharge les ressources de l'onglet si la liste est dans une section.
    if (iSelectedSectionIndex > 0)
        delete envSrvc["oSelectedObject"]["sections"][0]["columns"]
    //
    if (sResourceId !== null && typeof ($scope["gridOptions"]["columnDefs"]) === "undefined") {
        // Si 1er affichage de l'onglet : chargement des colonnes et boutons de la liste.
        if (typeof (envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["columns"]) === "undefined") {
            // Nom du service web (vitis, gtf...)
            var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vitis");
            // Charge la définition des colonnes de la liste.
            var oParams = {
                "token": sessionSrvc["token"]
            };
            oWebServiceBase["customGET"]("ressources/" + sResourceId, oParams)
                    .then(function (data) {
                        if (data["status"] === 1) {
                            var aResourceId = envSrvc["explodeWebServiceResourceId"](sResourceId);
                            var aData = data["ressources"][0][aResourceId[1]][0]["columns"];
                            if (aData.length > 0) {
                                // Formatte les colonnes pour ui-grid.
                                aData = $scope.$root["formatGridColumn"](aData, sSelectedObjectName);
                                // Sauve le nom du champ qui correspond à l'id.
                                //envSrvc["sIdField"] = aData[0]["field"];
                                envSrvc["oSelectedObject"]["sIdField"] = aData[0]["field"];
                                // Ajoute la colonne d'actions (boutons "update" & "display")
                                if (typeof($scope["gridOptions"]["appShowActions"]) == "undefined" || $scope["gridOptions"]["appShowActions"] !== false) {
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
                                // Sauvegarde et mise à jour de la définition des actions (boutons).
                                var aActions = data["ressources"][0][aResourceId[1]][1]["actions"];
                                if (typeof (aActions) !== "undefined")
                                    envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["actions"] = $scope.$root["formatGridAction"](aActions, sSelectedObjectName);
                                else
                                    envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["actions"] = [];
                                if (envSrvc["sMode"] != "display")
                                    $scope["gridOptions"]["appActions"] = envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["actions"].slice(0);
                            }
                        }
                    });
        } else {
            // Mise à jour de la définition des colonnes.
            $scope["gridOptions"]["columnDefs"] = envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["columns"].slice(0);
            // Mise à jour de la définition des actions (boutons).
            if (envSrvc["sMode"] != "display")
                $scope["gridOptions"]["appActions"] = envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["actions"].slice(0);
        }
    }
};
vitisApp.module.controller("workspaceListCtrl", vitisApp.workspaceListCtrl);

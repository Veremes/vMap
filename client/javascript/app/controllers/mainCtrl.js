

/* global oUrlParams, goog, vitisApp */

goog.provide("vitis.controllers.main");
goog.require("vitis.modules.main");
goog.require("vitis.services.main");

/**
 * Main Controller.
 * Contrôleur principal de l'application (après connexion).
 * @param {angular.$scope} $scope Angular scope.
 * @param {angular.$http} $http Angular http service.
 * @param {angular.$timeout} $timeout Angular timeout service.
 * @param {service} $translate Translate service.
 * @param {service} $translatePartialLoader TranslateStaticFilesLoader service.
 * @param {angular.$rootScope} $rootScope Angular rootScope.
 * @param {angular.$templateRequest} $templateRequest Angular templateRequest service.
 * @param {angular.$compile} $compile Angular compile.
 * @param {angular.$log} $log Angular log service.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} modesSrvc Liste des modes et objets de l'utilisateur.
 * @param {service} userSrvc Paramètres de l'utilisateur.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @ngInject
 **/
vitisApp.mainCtrl = function ($scope, $http, $timeout, $translate, $translatePartialLoader, $rootScope, $templateRequest, $compile, $log, envSrvc, modesSrvc, userSrvc, propertiesSrvc) {
    // Vide le cache des templates.
    /*
     $templateCache.remove("templates/mainTpl.html");
     $templateCache.remove("templates/formTpl.html");
     $templateCache.remove("templates/uiGridActionTpl.html");
     $templateCache.remove("templates/uiGridPaginationTpl.html");
     */
    $rootScope["oFormDefinition"] = {};
    $rootScope["oFormValues"] = {};
    $rootScope["oSectionForm"] = envSrvc["oSectionForm"];
    // Sinon erreur ???
    $rootScope["gridOptions"] = {};
    $rootScope["gridApi"] = {};

    $scope["oProperties"] = propertiesSrvc;

    less.refresh();

    // Plugin "moment" : définition de la langue.
    moment["locale"](propertiesSrvc["language"]);

    /* $scope.$evalAsync(function () {
     // theme de la page
     // less.modifyVars({'@application-color-theme': '@veremes-' + angular.lowercase(propertiesSrvc["app_name"]) + '-color'});
     });*/

    // Login de l'utilisateur au dessus du logo.
    $translate(["USER"], {"sUserLogin": userSrvc["login"]})
            .then(function (translations) {
                $scope["sUserLoginText"] = translations["USER"];
            });

    // Charge les modes de l'application.
    modesSrvc["loadModes"]().then(function (result) {
        // Affichage du menu des modes
        $scope["modes"] = modesSrvc["modes"];


        // Affichage du menu des objets (onglet)
        $rootScope["sSelectedObjectName"] = envSrvc["oSelectedObject"]["name"];
        $scope["objects"] = modesSrvc["modes"][0]["objects"];

        // Sélection du mode à afficher.
        if (goog.isDefAndNotNull(oUrlParams['mode_id'])) {
            setTimeout(function () {
                modesSrvc["selectMode"]($scope, oUrlParams['mode_id']);
                setTimeout(function () {
                    $('.mode_selected').removeClass('mode_selected');
                    $('#mode_' + oUrlParams['mode_id']).addClass('mode_selected');
                }, 500);
            });

        } else {
            modesSrvc["selectMode"]($scope, modesSrvc["modes"][0]["mode_id"]);
        }

        // Sélection de l'objet à afficher
        if (goog.isDefAndNotNull(oUrlParams['object_id']) && goog.isDefAndNotNull(oUrlParams['mode_id'])) {
            modesSrvc["selectObject"]($scope, oUrlParams['object_id'], oUrlParams['mode_id']);
            $rootScope.$on(oUrlParams['object_id'] + '_form', function () {
                // Sélection de l'objet à afficher
                if (goog.isDefAndNotNull(oUrlParams['action']) && goog.isDefAndNotNull(oUrlParams['ids'])) {
                    var oId = oUrlParams['ids'].split('|')[0];
                    setTimeout(function () {
                        angular.element(vitisApp.appWorkspaceListDrtv).scope().$root[oUrlParams['action']](oId);
                    }, 1000);
                }
            });
        }
    });


    /**
     * Display the edit form of an element
     * @param {string} sElementMode
     * @param {string} sElementObject
     * @param {string} sElementId
     */
    $scope["editObjectElement"] = function (sElementMode, sElementObject, sElementId) {
        var sAction = 'editSectionForm';
        this['actionOnObjectElement'](sElementMode, sElementObject, sElementId, sAction);
    };

    /**
     * Display the display form of an element
     * @param {string} sElementMode
     * @param {string} sElementObject
     * @param {string} sElementId
     */
    $scope["displayObjectElement"] = function (sElementMode, sElementObject, sElementId) {
        var sAction = 'showSectionForm';
        this['actionOnObjectElement'](sElementMode, sElementObject, sElementId, sAction);
    };

    /**
     * Set an action on the given element
     * @param {string} sElementMode
     * @param {string} sElementObject
     * @param {string} sElementId
     * @param {string} sAction
     */
    $scope["actionOnObjectElement"] = function (sElementMode, sElementObject, sElementId, sAction) {
        modesSrvc.scope["selectObject"](sElementObject, sElementMode);
        var oTmpEvent = $rootScope.$on(sElementObject, function () {
            // Sélection de l'objet à afficher
            if (goog.isDefAndNotNull(sAction) && goog.isDefAndNotNull(sElementId)) {
                $timeout(function () {
                    angular.element(vitisApp.appWorkspaceListDrtv).scope().$root[sAction](sElementId);
                }, 500);
            }
            oTmpEvent();
        });
    };

    /**
     * selectMode function.
     * Sélection d'un mode de l'application.
     * @param {string} sSelectedMode Id du mode sélectionné.
     * @param {object} oEvent Evènement jQuery.
     **/
    $scope["selectMode"] = function (sSelectedMode, oEvent) {
        modesSrvc["selectMode"]($scope, sSelectedMode, oEvent).then(function () {
            $timeout(function () {
                $scope["setFullScreen"](envSrvc["oSelectedMode"]["fullScreen"]);
                sessionStorage["ajaxLoader"] = envSrvc["oSelectedMode"]["ajaxLoader"];
            }, 100);
            // Redimensionnement d'une liste ui-grid (si déja affiché).
            var gridApi = $scope.$root["gridApi"][$scope["sSelectedObjectName"]];
            if (gridApi != null)
                gridApi["core"]["handleWindowResize"]();
            //
        });
    };

    /**
     * selectObject function.
     * Sélection de l'onglet d'un mode.
     * @param {string} sSelectedObjectName Id de l'objet sélectionné.
     * @param {string} sObjectMode Mode d'action de l'objet (update, insert...).
     * @param {object} oEvent Evènement jQuery.
     **/
    $scope["selectObject"] = function (sSelectedObjectName, sObjectMode, oEvent) {

        // Si sObjectMode est différent du mode en cours
        if (goog.isDefAndNotNull(sObjectMode) && envSrvc['oSelectedMode']['mode_id'] !== sObjectMode) {
            var iObjectId;
            var oMode = modesSrvc["getMode"](sObjectMode);

            if (!goog.isDefAndNotNull(oMode['objects'])) {
                console.error(sSelectedObjectName + ' is not object of ' + sObjectMode);
                return 0;
            }

            for (var i = 0; i < oMode['objects'].length; i++) {
                if (oMode['objects'][i]['name'] === sSelectedObjectName) {
                    iObjectId = angular.copy(i);
                }
            }

            if (!goog.isDefAndNotNull(iObjectId)) {
                console.error(sSelectedObjectName + ' is not object of ' + sObjectMode);
                return 0;
            }

            modesSrvc["selectMode"]($scope, sObjectMode, oEvent, iObjectId).then(function () {
                $timeout(function () {
                    $scope["setFullScreen"](envSrvc["oSelectedMode"]["fullScreen"]);
                    sessionStorage["ajaxLoader"] = envSrvc["oSelectedMode"]["ajaxLoader"];
                }, 100);
                // Redimensionnement d'une liste ui-grid (si déja affiché).
                var gridApi = $scope.$root["gridApi"][$scope["sSelectedObjectName"]];
                if (gridApi != null)
                    gridApi["core"]["handleWindowResize"]();
                //
            });
        } else {
            modesSrvc["selectObject"]($scope, sSelectedObjectName, sObjectMode, oEvent);
        }
    };

    /**
     * compileObjectTemplate function.
     * Compile le template passé en paramètre dans l'élement html de l'onglet sélectionné.
     * @param {string} sTemplateUrl Url du template.
     **/
    $rootScope["compileObjectTemplate"] = function (sTemplateUrl) {
        // Compile le template de l'onglet
        $templateRequest(sTemplateUrl).then(function (sTemplate) {
            $compile($("#container_mode_" + envSrvc["oSelectedMode"]["mode_id"]).html(sTemplate).contents())($scope);
            $("#data_column .container-mode").hide();
            $("#container_mode_" + envSrvc["oSelectedMode"]["mode_id"]).show();
        });
        $log.info('compileObjectTemplate : ' + sTemplateUrl);
    };

    /**
     * loadList function.
     * Paramètre "event" de la table "vm_tab".
     * @param {string} sEvent Code à éxécuter après la compilation du template "workspaceList".
     * @param {object} oFilter Filtres à passer dans la requête de la liste ?
     **/
    $rootScope["loadList"] = function (sEvent, oFilter) {
        $log.info("loadList");
        envSrvc["sMode"] = "search";
        // Filtres à passer à la requête de la liste ?
        if (typeof (oFilter) !== "undefined") {
            var aFilter = [];
            var aFilterKeys = Object.keys(oFilter);
            var i = 0;
            while (i < aFilterKeys.length) {
                if (oFilter["lang"] === "")
                    oFilter["lang"] = "'" + propertiesSrvc["language"] + "'";
                aFilter.push(aFilterKeys + "=" + oFilter[aFilterKeys[i]]);
                i++;
            }
            // Sauve les données du filtre.
            envSrvc["oSelectedObject"]["filter"] = aFilter;
        }
        // Code à éxécuter ?
        if (sEvent !== null) {
            // Attend la compilation du template workspaceList.
            var clearListener = $rootScope.$on('workspaceListTplCompiled', function (event) {
                $rootScope.$eval(sEvent);
                // Supprime le "listener".
                clearListener();
            });
        }
    };

    $rootScope["showModeScrollBoutton"] = function () {
        return document.getElementById('mode_column').scrollHeight > document.getElementById('mode_column').clientHeight;
    };

    $rootScope["scrollMode"] = function (ScrollValue) {
        $('#mode_column').animate({'scrollTop': $('#mode_column').scrollTop() + ScrollValue}, 200);
    };
};
vitisApp.module.controller("mainCtrl", vitisApp.mainCtrl);
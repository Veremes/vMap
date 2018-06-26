'use strict';

/* global goog, vitisApp, angular, bootbox, moment */

goog.provide('vitis.script_client');
goog.require('vitis');
goog.require('vitis.directives.main');
goog.require('vitis.directives.workspaceList');
goog.require('vitis.VitisWebsocket');

goog.require('goog.object');
goog.require('goog.array');

goog.require('ol.Geolocation');

vitisApp.on('appInitCtrlLoaded', function () {

    // Injection des services.
    var $q = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["$q"]);
    var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
    var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
    var formSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["formSrvc"]);
    var $timeout = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$timeout"]);
    var $compile = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$compile"]);
    var modesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["modesSrvc"]);
    var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
    var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
    var uiGridConstants = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["uiGridConstants"]);
    var $templateRequest = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$templateRequest"]);
    var externFunctionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["externFunctionSrvc"]);

    vitisApp.on('properties_loaded', function () {

        // WebSocket
        if (goog.isDefAndNotNull(propertiesSrvc['websocket_alias'])) {

            var sWebSocketUrl = 'wss://' + location.host + '/' + propertiesSrvc['websocket_alias'] + '/';

            vitisApp['oWebsocket'] = new VitisWebsocket(sWebSocketUrl);

            // Espace de stockage pour le refraichissement des grilles lors d'evenements
            vitisApp['oWebsocket']['oGridRefreshEvents'] = {};

            // Connection réussie
            vitisApp['oWebsocket'].on('connect', function (sReturn) {
                $log.info('VitisWebsocket: Connected to ' + sWebSocketUrl + ' with ' + sReturn);
            });

            // Déconnection
            vitisApp['oWebsocket'].on('disconnect', function () {
                $log.info('VitisWebsocket: Disconnected');
            });

            // Souscription
            vitisApp['oWebsocket'].on('subscribe', function (sReturn) {
                $log.info('VitisWebsocket: Subscribed to ' + sReturn);
            });

            // Réception d'un message echo
            vitisApp['oWebsocket'].on('echo', function (message) {
                $log.info('VitisWebsocket echo: ' + message);
                $.notify('VitisWebsocket: ' + message, 'success');
            });

            // Réception d'un événement
            vitisApp['oWebsocket'].on('event', function (event) {
                $log.info('VitisWebsocket event: ', event);
            });

            // Test si la connection a pu être faite
            setTimeout(function () {
                if (!vitisApp['oWebsocket'].isConnected()) {
                    $log.error('VitisWebsocket was not able to connect');
                    $translate(["INACCESSIBLE_WEBSOCKET"]).then(function (oTranslations) {
                        console.error(oTranslations["INACCESSIBLE_WEBSOCKET"]);
//                    $.notify(oTranslations["INACCESSIBLE_WEBSOCKET"], 'error');
                    });
                }
            }, 5000);
        }
    });
    setTimeout(function () {
        // Geolocation
        if (ol.Geolocation && propertiesSrvc["geolocation_enabled"] === true) {
            /**
             * Précision
             * vitisApp['oGeoLocation'].getAccuracy()
             * vitisApp['oGeoLocation'].getAltitudeAccuracy()
             *
             * Altitude
             * vitisApp['oGeoLocation'].getAltitude()
             *
             * Position
             * vitisApp['oGeoLocation'].getPosition()
             *
             * Vitesse
             * vitisApp['oGeoLocation'].getSpeed()
             *
             * Orientation en radians depuis le nord dans le sens des aiguilles d'une montre
             * vitisApp['oGeoLocation'].getHeading()
             */
            vitisApp['oGeoLocation'] = new ol.Geolocation({
                projection: 'EPSG:4326',
                tracking: true,
                trackingOptions: {
                    maximumAge: 10000,
                    enableHighAccuracy: true,
                    timeout: 300000
                }
            });
        }
    }, 2000);

    // Geolocation
    if (ol.Geolocation && window['oClientProperties']['geolocation'] == "true") {
        /**
         * Précision
         * vitisApp['oGeoLocation'].getAccuracy()
         * vitisApp['oGeoLocation'].getAltitudeAccuracy()
         *
         * Altitude
         * vitisApp['oGeoLocation'].getAltitude()
         *
         * Position
         * vitisApp['oGeoLocation'].getPosition()
         *
         * Vitesse
         * vitisApp['oGeoLocation'].getSpeed()
         *
         * Orientation en radians depuis le nord dans le sens des aiguilles d'une montre
         * vitisApp['oGeoLocation'].getHeading()
         */
        vitisApp['oGeoLocation'] = new ol.Geolocation({
            projection: 'EPSG:4326',
            tracking: true,
            trackingOptions: {
                maximumAge: 10000,
                enableHighAccuracy: true,
                timeout: 300000
            }
        });
    }

    angular.element(vitisApp.appMainDrtv).scope()['is_mobile'] = oClientProperties['is_mobile'];
    /**
     * loadSimpleForm function.
     * Paramétrage avant la compilation du template simpleForm (vm_tab.event).
     **/
    angular.element(vitisApp.appMainDrtv).scope()['loadSimpleForm'] = function () {
        // Passage en mode "Update" (pour le formulaire).
        envSrvc["sMode"] = "update";
        $log.info("loadSimpleForm");
    };

    /**
     * scopeEval function.
     * Evaluation d'une chaine de caractère dans un scope.
     * @param {angular.$scope} scope Angular scope.
     * @param {string} sStringToEval chaine de caractère à évaluer.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['scopeEval'] = function (scope, sStringToEval) {
        $log.info(sStringToEval);
        scope.$eval(sStringToEval);
    };

    /**
     * Select a Vitis mode
     * @param {string} sModeId
     */
    angular.element(vitisApp.appMainDrtv).scope()['selectMode'] = function (sModeId) {
        $log.info("appMainDrtv.selectMode");

        if (!goog.isDefAndNotNull(sModeId)) {
            console.error('sModeId not defined');
            return null;
        }

        var oMode = modesSrvc["getMode"](sModeId);

        if (!goog.isDefAndNotNull(oMode['objects'])) {
            console.error('sModeId ' + sModeId + ' is not valid');
            return null;
        }

        var deferred = $q.defer();
        var $scope = angular.element($('#mode_column')).scope();
        modesSrvc["selectMode"]($scope, sModeId).then(function () {
            $timeout(function () {
                externFunctionSrvc["resizeWin"]();
                $scope["setFullScreen"](envSrvc["oSelectedMode"]["fullScreen"]);
                sessionStorage["ajaxLoader"] = envSrvc["oSelectedMode"]["ajaxLoader"];
                var gridApi = $scope.$root["gridApi"][$scope["sSelectedGridOptionsName"]];
                if (gridApi != null) {
                    gridApi["core"]["handleWindowResize"]();
                    gridApi["core"]["refreshRows"]();
                }
                deferred.resolve();
            }, 100);
        });
        return deferred.promise;
    };

    /**
     * Select a Vitis mode and object
     * @param {string} sModeId
     * @param {string} sObjectId
     */
    angular.element(vitisApp.appMainDrtv).scope()['selectObject'] = function (sModeId, sObjectId) {
        $log.info("appMainDrtv.selectObject");

        if (!goog.isDefAndNotNull(sModeId)) {
            console.error('sModeId not defined');
            return null;
        }
        if (!goog.isDefAndNotNull(sObjectId)) {
            console.error('sObjectId not defined');
            return null;
        }

        var oEvent, iObjectId;
        var oMode = modesSrvc["getMode"](sModeId);

        if (!goog.isDefAndNotNull(oMode['objects'])) {
            console.error('sModeId ' + sModeId + ' is not valid');
            return null;
        }

        for (var i = 0; i < oMode['objects'].length; i++) {
            if (oMode['objects'][i]['name'] === sObjectId) {
                iObjectId = angular.copy(i);
            }
        }

        var deferred = $q.defer();
        var $scope = angular.element($('#mode_column')).scope();
        modesSrvc["selectMode"]($scope, sModeId, oEvent, iObjectId).then(function () {
            $timeout(function () {
                externFunctionSrvc["resizeWin"]();
                $scope["setFullScreen"](envSrvc["oSelectedMode"]["fullScreen"]);
                sessionStorage["ajaxLoader"] = envSrvc["oSelectedMode"]["ajaxLoader"];
                var gridApi = $scope.$root["gridApi"][$scope["sSelectedGridOptionsName"]];
                if (gridApi != null) {
                    gridApi["core"]["handleWindowResize"]();
                    gridApi["core"]["refreshRows"]();
                }
                deferred.resolve();
            }, 100);
        });
        return deferred.promise;
    };

    /**
     * Select a Vitis mode, object and element on update
     * @param {string} sModeId
     * @param {string} sObjectId
     * @param {string} sElemId
     * @param {string|undefined} sMode update/display
     */
    angular.element(vitisApp.appMainDrtv).scope()['selectElement'] = function (sModeId, sObjectId, sElemId, sMode) {
        $log.info("appMainDrtv.selectElement");

        if (!goog.isDefAndNotNull(sModeId)) {
            console.error('sModeId not defined');
            return null;
        }
        if (!goog.isDefAndNotNull(sObjectId)) {
            console.error('sObjectId not defined');
            return null;
        }
        if (!goog.isDefAndNotNull(sElemId)) {
            console.error('sElemId not defined');
            return null;
        }

        sMode = goog.isDefAndNotNull(sMode) ? sMode : 'update';

        this['selectObject'](sModeId, sObjectId).then(function () {
            var oDataAddedEvent = angular.element(vitisApp.appWorkspaceListDrtv).scope().$root.$on('workspaceListDataAdded', function () {
                setTimeout(function () {
                    if (sMode === 'update') {
                        angular.element(vitisApp.appWorkspaceListDrtv).scope().$root['editSectionForm'](sElemId);
                    } else if (sMode === 'display') {
                        angular.element(vitisApp.appWorkspaceListDrtv).scope().$root['showSectionForm'](sElemId);
                    }
                });
                oDataAddedEvent();
            });
        });
    };

    /**
     * AddDoubleForm function.
     * Création d'un enregistrement (doubleForm).
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()['AddDoubleForm'] = function () {
        // Compilation et affichage du template doubleForm en mode "insert".
        envSrvc["addDoubleForm"]();
        $log.info("AddDoubleForm");
    };

    /**
     * AddSectionForm function.
     * Création d'un enregistrement (simpleForm ou sectionForm).
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()['AddSectionForm'] = function () {
        $log.info("AddSectionForm");
        // Fonction à appeler avant la création d'un enregistrement ?
        var scope = this;
        var sFunctionName = "before" + goog.string.toTitleCase(envSrvc["oSelectedObject"]["name"], "_").replace(/_/g, "") + "Edition";
        if (typeof (scope[sFunctionName]) != "undefined")
            scope[sFunctionName]();
        // Compilation et affichage du template simpleForm ou sectionForm en mode "insert".
        envSrvc["addSectionForm"]();
    };

    /**
     * setMode function.
     * Change le mode d'action (update,display...).
     * @param {string} sMode Mode d'action.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['setMode'] = function (sMode) {
        $log.info("setMode: " + sMode);
        //formSrvc["clearFormData"](envSrvc["sFormDefinitionName"]);
        // Changement de mode d'action.
        var sModeId = envSrvc["oSelectedMode"]["mode_id"];
        var sTabName = envSrvc["oSelectedObject"]["name"];
        envSrvc["setMode"](sMode).then(function () {
            // Vide l'élément html contenant le mode précédemment affiché.
            angular.element("#container_mode_" + sModeId).empty();
            // Supprime les données de l'onglet (scopes).
            modesSrvc["clearObjectData"](sTabName, sModeId);
        });
    };

    /**
     * setFullScreen function.
     * Affichage en plein écran.
     * @param {boolean} bFullScreen Activer ou annuler le plein écran.
     **/
    angular.element(vitisApp.appMainDrtv).scope()["setFullScreen"] = function (bFullScreen) {
        $log.info("setFullScreen", bFullScreen);

        var headerLineHeight = $('#header_line').height();
        if (!goog.isDefAndNotNull(bFullScreen) || bFullScreen === true) {
            if ($('#header_line').css('margin-top') === '0px') {
                $('#header_line').animate({'margin-top': -headerLineHeight + 'px'});
                $('#works_line').animate({'height': headerLineHeight + $('#works_line').height() + 'px'});
                $('.popover').hide();
            }
        } else {
            if ($('#header_line').css('margin-top') !== '0px') {
                $('#header_line').animate({'margin-top': '0px'});
                $('#works_line').animate({'height': $('#works_line').height() - headerLineHeight + 'px'});
                // Redimensionne les éléments html principaux de l'application.
                $timeout(function () {
                    externFunctionSrvc["resizeWin"]();
                }, 500);
            }
        }
    };

    /**
     * reloadSection function.
     * Recharge l'onglet.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['reloadSection'] = function () {
        $log.info("reloadSection : " + envSrvc["sMode"]);
        envSrvc["setSectionForm"](envSrvc["sMode"], envSrvc["sId"]);
    };

    /**
     * getProperty function.
     * Retourne la valeur d'une des "properties".
     * @param {string} sPropertieName Nom de la propriété.
     * @param {object} oOptions Paramètres optionnels.
     * @return {string}
     **/
    angular.element(vitisApp.appMainDrtv).scope()['getProperty'] = function (sPropertieName, oOptions) {
        // Edition d'un enregistrement.
        $log.info("getProperty : " + sPropertieName);
        var sValue;
        if (sPropertieName.indexOf(".") != -1)
            eval("sValue = propertiesSrvc." + sPropertieName);
        else
            sValue = propertiesSrvc[sPropertieName];
        // Paramères optionnels.
        if (typeof (oOptions) != "undefined") {
            if (typeof (oOptions["concatBefore"]) != "undefined")
                sValue = oOptions["concatBefore"] + sValue;
            if (typeof (oOptions["concatAfter"]) != "undefined")
                sValue = sValue + oOptions["concatAfter"];
        }
        return sValue;
    };

    /**
     * DEPRECATED
     * getPropertie function.
     * Retourne la valeur d'une "propertie".
     * @param {string} sPropertieName Nom de la "propertie".
     * @return {string}
     **/
    angular.element(vitisApp.appMainDrtv).scope()['getPropertie'] = function (sPropertieName) {
        return angular.element(vitisApp.appMainDrtv).scope()["getProperty"](sPropertieName);
    };

    /**
     * appSetBooleanIconColumn directive.
     * Mise en forme de la colonne d'une liste avec un icône True/False.
     * @expose
     **/
    vitisApp["compileProvider"].directive('appSetBooleanIconColumn', function () {
        return {
            link: function (scope, element, attrs) {

                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appSetBooleanIconColumn", function (value) {
                    var sEnabledClassName;
                    if (scope["row"]["entity"][scope["col"]["field"]]) {
                        sEnabledClassName = "true-icon";
                    } else if (!scope["row"]["entity"][scope["col"]["field"]]) {
                        sEnabledClassName = "false-icon";
                    }
                    // Classes css (ui-grid + spécifiques).
                    element[0].className = "ui-grid-cell-contents " + sEnabledClassName;
                    if (goog.isDefAndNotNull(attrs['popup'])) {
                        // Traduction du titre et du contenu.
                        $translate([attrs['popup'], ]).then(function (translations) {

                            if (goog.isString(attrs['popup'])) {
                                if (attrs['popup'].length > 0) {
                                    // Création du "tooltip".
                                    $(element)["popover"]({
                                        "trigger": "hover",
                                        "container": "body",
                                        "content": function () {
                                            return translations[attrs['popup']];
                                        },
                                        // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                                        "placement": function (oPopoverNode, oElementNode) {
                                            return scope.$root["workspaceTooltipPlacement"](oElementNode);
                                        },
                                        "html": true
                                    });
                                }
                            }

                        });
                    }

                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    });
    vitisApp.module.directive("appSetBooleanIconColumn", vitisApp.appSetBooleanIconColumn);

    /**
     * appSetTrueIconColumn directive.
     * Mise en forme de la colonne d'une liste avec un icône True ou colonne vide.
     * @expose
     **/
    vitisApp["compileProvider"].directive('appSetTrueIconColumn', function () {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appSetTrueIconColumn", function (value) {
                    var sEnabledClassName;
                    if (scope["row"]["entity"][scope["col"]["field"]])
                        sEnabledClassName = "true-icon";
                    else if (!scope["row"]["entity"][scope["col"]["field"]])
                        sEnabledClassName = "";
                    // Classes css (ui-grid + spécifiques).
                    element[0].className = "ui-grid-cell-contents " + sEnabledClassName;
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {                     // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    });
    vitisApp.module.directive("appSetTrueIconColumn", vitisApp.appSetTrueIconColumn);

    /**
     * modalWindow function.
     * Affiche une fenêtre modale.
     * @param {string} sType Type de fenêtre (alert, confirm...).
     * @param {string} sTitle Titre de la fenêtre.
     * @param {object} oOptions Paramètres du composant et autres (appDuration, appBootstrapStyle).
     * @return {promise}
     **/
    angular.element(vitisApp.appMainDrtv).scope()['modalWindow'] = function (sType, sTitle, oOptions) {
        $log.info("modalWindow");
        return externFunctionSrvc["modalWindow"](sType, sTitle, oOptions);
    };

    /**
     * selectFirstOption function.
     * Sélectionne la 1ere option d'un <select>.
     * @param {string} sFormElementName Nom du <select>.
     * @param {boolean} bEmptyOption Ajoute une <option> vide si le <select> est vide.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['selectFirstOption'] = function (sFormElementName, bEmptyOption) {
        $log.info("selectFirstOption");
        // Création de la structure du <select> si non existante.
        oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
        if (typeof (oFormValues[sFormElementName]) == "undefined")
            oFormValues[sFormElementName] = {
                "options": []
            };
        // Insertion d'une <option> vide.
        if (oFormValues[sFormElementName]["options"].length == 0 && bEmptyOption === true) {
            oFormValues[sFormElementName]["options"].push({
                "label": "",
                "value": ""
            });
        }
        // 1ere option = option sélectionnée.
        oFormValues[sFormElementName]["selectedOption"] = oFormValues[sFormElementName]["options"][0];
    };

    /**
     * loadSection function.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['loadSection'] = function () {
        $log.info("loadSection");
    };

    /**
     * reloadSectionForm function.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['reloadSectionForm'] = function () {
        $log.info("reloadSectionForm");
    };

    /**
     * Refresh the grid defined by sRefreshObjectId when the event definid by sEvent is listened
     * Uses properties.minimum_refresh_period to prevent refreshing too fast
     * @param {string} sRefreshObjectId
     * @param {string} sEvent
     * @param {function} condition
     */
    angular.element(vitisApp.appMainDrtv).scope()['refreshGridByEvent'] = function (sRefreshObjectId, sEvent, condition) {
        $log.info("refreshGridByEvent");

        if (!goog.isDefAndNotNull(vitisApp['oWebsocket'])) {
            return null;
        }

        // Période minimum entre deux rafraichissements
        var minimumRefreshTime = goog.isDefAndNotNull(propertiesSrvc["minimum_refresh_period"]) ? propertiesSrvc["minimum_refresh_period"] : 100;

        if (!goog.isDefAndNotNull(sRefreshObjectId)) {
            return null;
        }
        if (!goog.isDefAndNotNull(sEvent)) {
            return null;
        }

        // Vérifie si l'évènement existe pas déjà
        if (goog.isDefAndNotNull(vitisApp['oWebsocket']['oGridRefreshEvents'][sRefreshObjectId])) {
            if (goog.isDefAndNotNull(vitisApp['oWebsocket']['oGridRefreshEvents'][sRefreshObjectId]['events'][sEvent])) {
                return null;
            }
        }

        // Stocke les infos sur l'evenement
        if (!goog.isDefAndNotNull(vitisApp['oWebsocket']['oGridRefreshEvents'][sRefreshObjectId])) {
            vitisApp['oWebsocket']['oGridRefreshEvents'][sRefreshObjectId] = {
                'events': [],
                'lastUpdateDate': new Date().getTime()
            };
        }
        if (!goog.isDefAndNotNull(vitisApp['oWebsocket']['oGridRefreshEvents'][sRefreshObjectId]['events'][sEvent])) {
            vitisApp['oWebsocket']['oGridRefreshEvents'][sRefreshObjectId]['events'].push(sEvent);
        }

        var scope = this;
        vitisApp['oWebsocket'].on('event', function (data) {

            // Conditions
            if (data['event'] !== sEvent) {
                return null;
            }
            if (envSrvc["oSelectedObject"]["name"] !== sRefreshObjectId) {
                return null;
            }

            // cas où l'event est lancé trop de fois simulanément
            var iNow = new Date().getTime();
            var iLastUpdateDate = vitisApp['oWebsocket']['oGridRefreshEvents'][sRefreshObjectId]['lastUpdateDate'];
            var iLastUpdateTime = iNow - iLastUpdateDate;
            if (iLastUpdateTime < minimumRefreshTime) {
                return null;
            }

            // Condition perso
            if (goog.isDefAndNotNull(condition)) {
                if (!condition.call(this, data)) {
                    return null;
                }
            }

            vitisApp['oWebsocket']['oGridRefreshEvents'][sRefreshObjectId]['lastUpdateDate'] = iNow;

            // Sauve la sélection
            scope['saveGridSelection'](scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]['grid']['appScope'], scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]['grid']['options']);

            // Recharge la liste.
            scope.$root['refreshGrid'](scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]['grid']['appScope'], envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]);
        });
    };

    /**
     * resetForm function.
     * Remise à zéro d'un formulaire.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['resetForm'] = function (sFormDefinitionName) {
        $log.info("resetForm");
        var sFormName;
        if (typeof (sFormDefinitionName) == "undefined")
            sFormName = envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"];
        else
            sFormName = envSrvc["oFormDefinition"][sFormDefinitionName]["name"];
        var scope = angular.element("form[name='" + sFormName + "']").scope();
        // Remise à zéro du formulaire (angular).
        scope[sFormName].$setPristine();
        document.querySelector("form[name='" + sFormName + "']").reset();
    };

    /**
     * editSectionForm function.
     * Edition d'un enregistrement (template simpleForm / sectionForm).
     * @param {object} sId Id de l'enregistrement sélectionné dans la liste.
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()['editSectionForm'] = function (sId) {
        $log.info("editSectionForm");
        //
        var scope = this;
        // Fonction à appeler avant l'édition de l'enregistrement ?
        var sFunctionName = "before" + goog.string.toTitleCase(envSrvc["oSelectedObject"]["name"], "_").replace(/_/g, "") + "Edition";
        if (typeof (scope[sFunctionName]) != "undefined")
            scope[sFunctionName](sId);
        // Edition de l'enregistrement.
        if (typeof (sId) == "undefined")
            sId = envSrvc["sId"];
        envSrvc["setSectionForm"]("update", sId);
    };

    /**
     * showSectionForm function.
     * Visualisation d'un enregistrement (template simpleForm / sectionForm).
     * @param {object} sId Id de l'enregistrement sélectionné dans la liste.
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()['showSectionForm'] = function (sId) {
        $log.info("showSectionForm");
        if (typeof (sId) == "undefined")
            sId = envSrvc["sId"];
        envSrvc["setSectionForm"]("display", sId);
    };

    /**
     * editDoubleForm function.
     * Edition d'un enregistrement (template doubleForm).
     * @param {object} sId Id de l'enregistrement sélectionné dans la liste.
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()['editDoubleForm'] = function (sId) {
        $log.info("editDoubleForm");
        if (typeof (sId) == "undefined")
            sId = envSrvc["sId"];
        envSrvc["sSelectedTemplate"] = "doubleFormTpl.html";
        envSrvc["sId"] = sId;         // Change le mode.
        envSrvc["setMode"]("update", envSrvc["sTemplateFolder"] + envSrvc["sSelectedTemplate"]);
    };

    /**
     * showDoubleForm function.
     * Visualisation d'un enregistrement (template doubleForm).
     * @param {object} sId Id de l'enregistrement sélectionné dans la liste.
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()['showDoubleForm'] = function (sId) {
        $log.info("showDoubleForm");
        if (typeof (sId) == "undefined")
            sId = envSrvc["sId"];
        envSrvc["sSelectedTemplate"] = "doubleFormTpl.html";
        envSrvc["sId"] = sId;         // Change le mode.
        envSrvc["setMode"]("display", envSrvc["sTemplateFolder"] + envSrvc["sSelectedTemplate"]);
    };

    /**
     * showCredits function.
     * Affichage de la fenêtre modale des crédits.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['showCredits'] = function () {
        $log.info("showCredits");
        // Crée un nouveau scope.
        var scope = this.$new();
        // Sauve le nouveau scope crée dans la définition de l'onglet.
        modesSrvc["addScopeToObject"](envSrvc["oSelectedObject"]["name"], envSrvc["oSelectedMode"]["mode_id"], scope);
        // Charge les données de crédit de l'application.
        ajaxRequest({
            "method": "GET",
            "url": "conf/credits.json",
            "scope": scope,
            "success": function (response) {
                if (typeof (response["data"]) == "object") {
                    scope["oCredits"] = response["data"];
                    // Affichage de la fenêtre modale.
                    var sCreditsContainerId = "login_credits";
                    var oOptions = {
                        "className": "dialog-modal-window",
                        "message": '<div id="' + sCreditsContainerId + '" class="login-credits"></div>'
                    };
                    scope["modalWindow"]("dialog", "CREDITS", oOptions);
                    // Données de traduction.
                    scope["translationData"] = {
                        "app_name": propertiesSrvc["app_name"],
                        "build": propertiesSrvc["build"],
                        "version": propertiesSrvc["version"],
                        "month_year": propertiesSrvc["month_year"]
                    };
                    // Compile le template des crédits.
                    var sTemplateUrl = 'templates/creditsTpl.html';
                    $templateRequest(sTemplateUrl).then(function (sTemplate) {
                        $compile($("#" + sCreditsContainerId).html(sTemplate).contents())(scope);
                    });
                    $log.info('compileObjectTemplate : ' + sTemplateUrl);
                }
            }
        });
    };

    /**
     * showCredits function.
     * Affichage de la fenêtre modale des crédits.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['showDocumentation'] = function () {
        $log.info("showDocumentation");
        if (goog.isArray(propertiesSrvc['documentation'])) {

            // Crée un nouveau scope.
            var scope = this.$new();

            scope['aDocumentation'] = propertiesSrvc['documentation'];

            // Sauve le nouveau scope crée dans la définition de l'onglet.
            modesSrvc["addScopeToObject"](envSrvc["oSelectedObject"]["name"], envSrvc["oSelectedMode"]["mode_id"], scope);

            // Affichage de la fenêtre modale.
            var sCreditsContainerId = "client_documentation_modal";
            var oOptions = {
                "className": "dialog-modal-window",
                "message": '<div id="' + sCreditsContainerId + '" class="login-credits"></div>'
            };
            scope["modalWindow"]("dialog", "DOCUMENTATION", oOptions);

            // Compile le template des crédits.
            var sTemplateUrl = 'templates/clientDocumentationTpl.html';
            $templateRequest(sTemplateUrl).then(function (sTemplate) {
                $compile($("#" + sCreditsContainerId).html(sTemplate).contents())(scope);
            });
            $log.info('compileObjectTemplate : ' + sTemplateUrl);

        } else {
            console.error('properties.documentation not an array');
        }
    };

    /**
     * setTagsInput function.
     * Mise en forme d'un ou plusieurs tag (tagsinput).
     * @param {array} aElementsId Tableau d'id d'éléments utilisants "tagsinput".
     **/
    angular.element(vitisApp.appMainDrtv).scope()['setTagsInput'] = function (aElementsId) {
        $log.info("setTagsInput");
        var i, aTags;
        aElementsId.forEach(function (sElementId) {
            i = 0;
            aTags = document.getElementById(sElementId).parentNode.querySelectorAll(".tag");
            while (i < aTags.length) {
                aTags[i].addEventListener("click", function () {
                    this.querySelector("span[data-role='remove']").click();
                });
                i++;
            }
        });
    };

    /**
     * refreshGrid function.
     * Raffraichît une liste "ui-grid".
     * @param {angular.scope} scope Scope de la liste.
     * @param {object} gridOptions Liste ui-grid.
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()["refreshGrid"] = function (scope, oGridOptions) {
        $log.info("refreshGrid");
        // Sauve la sélection
        scope["saveGridSelection"](scope, oGridOptions);
        // Recharge la liste.
        scope["setGridPage"](oGridOptions["paginationCurrentPage"], oGridOptions["paginationPageSize"], envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oFilter"], envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oUrlParams"]);
    };

    // Currently in Test
    /**
     * showExportModal function.
     * Show Export Modal
     **/
    /*angular.element(vitisApp.appWorkspaceListDrtv).scope()["showExportModal"] = function (){
     $log.info("showExportModal");

     envSrvc["setModalExportForm"]("insert");
     };*/

    /**
     * saveGridSelection function.
     * Sauve la sélection d'une liste "ui-grid".
     * @param {angular.scope} scope Scope de la liste.
     * @param {object} gridOptions Liste ui-grid.
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()['saveGridSelection'] = function (scope, oGridOptions) {
        $log.info("saveGridSelection");
        // Sauve la sélection
        var aSelectedRows = oGridOptions["appSelectedRows"] = scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["selection"]["getSelectedRows"]();
        if (aSelectedRows.length > 0) {             // Liste des enregistrements à supprimer.
            var i = 0, aSelectedId = [];
            while (i < aSelectedRows.length) {
                aSelectedId.push(aSelectedRows[i][envSrvc["oSelectedObject"]["sIdField"]]);
                i++;
            }
        }
        oGridOptions["appSelectedRows"] = aSelectedId;
    };

    /**
     * setGridFilter function.
     * Définition des filtres pour la liste ui-grid.
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()["setGridFilter"] = function () {
        $log.info("setGridFilter");
        // Sauve le formulaire des filtres avec les nouvelles valeurs.
        envSrvc["oWorkspaceList"][envSrvc["sSelectedGridOptionsName"]]["oValues"] = angular.copy(envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]);
        //
        var scope = this;
        var sValue, oFormElement;
        var oFilter = {
            "relation": "AND",
            "operators": []
        };
        var oFormData = formSrvc["getFormData"](envSrvc["sFormDefinitionName"], true);
        var aFormElementsKeys = Object.keys(oFormData);
        var i = 0;
        while (i < aFormElementsKeys.length) {
            oFormElement = formSrvc["getFormElementDefinition"](aFormElementsKeys[i], envSrvc["sFormDefinitionName"]);
            sValue = oFormData[aFormElementsKeys[i]];

            // Si l'élément de form. est une date : conversion au format sql.
            if (oFormElement["type"] === "date" || oFormElement["type"] === "datetime") {
                var oDate = $("#" + oFormElement["id"]).data("DateTimePicker")["date"]();
                if (oDate !== null) {
                    if (oFormElement["type"] === "date")
                        sValue = oDate["format"]("YYYY-MM-DD");
                    else
                        sValue = oDate["format"]("YYYY-MM-DD HH:mm:ss");
                }
            }

            if (typeof (sValue) !== "undefined" && (sValue.toString()) !== "") {
                if (goog.isDefAndNotNull(oFormElement["comparator"])) {
                    if (goog.isDefAndNotNull(oFormElement["comparator"]["formater"])) {
                        sValue = oFormElement["comparator"]["formater"].replace(/<VALUE_TO_REPLACE>/g, sValue);
                    }
                    oFormElement["comparator"]["value"] = sValue;

                    oFilter["operators"].push(oFormElement["comparator"]);
                    /*
                     for (var j = 0; j < oFormElement["comparator"].length; j++) {
                     var sFormElement = "";
                     if (goog.isDefAndNotNull(oFormElement["attrToCompare"])) {
                     sFormElement = (goog.isDefAndNotNull(oFormElement["attrToCompare"][j]) ? oFormElement["attrToCompare"][j] : oFormElement["name"]);
                     } else {
                     sFormElement = oFormElement["name"];
                     }
                     var bIsNotNumber = true;
                     if (goog.isDefAndNotNull(oFormElement["NaNForced"])) {
                     bIsNotNumber = (goog.isDefAndNotNull(oFormElement["NaNForced"][j]) ? oFormElement["NaNForced"][j] : isNaN(sValue));
                     } else {
                     bIsNotNumber = isNaN(sValue);
                     }
                     switch (oFormElement["comparator"][j]) {
                     case 'LIKE' :
                     oFilter.push('lower("' + sFormElement + '") LIKE lower(\'%' + sValue + '%\')');
                     break;
                     case 'SQL' :
                     oFilter.push(sFormElement.replace(/<VALUE_TO_REPLACE>/g, sValue));
                     break;
                     // ajouter d'autre comparateur si besoin ex: BETWEEN ______ AND ______
                     default:
                     // = < <= > >= basique
                     if (bIsNotNumber) {
                     sValue = "'" + sValue + "'";
                     }
                     oFilter.push(sFormElement + oFormElement["comparator"][j] + sValue);
                     break;
                     }
                     }
                     */
                } else {
                    if (oFormElement["type"] == "text") {
                        oFilter["operators"].push({
                            "column": aFormElementsKeys[i],
                            "compare_operator": "LIKE",
                            "compare_operator_options": {
                                "case_insensitive": true
                            },
                            "value": "%" + sValue + "%"
                        });
                    } else if (oFormElement["type"] == "date" || oFormElement["type"] == "datetime") {
                        oFilter["operators"].push(
                                {
                                    "column": aFormElementsKeys[i],
                                    "compare_operator": ">",
                                    "value": sValue
                                },
                                {
                                    "column": aFormElementsKeys[i],
                                    "compare_operator": "<",
                                    "value": moment(sValue).add(1, 'days').format('YYYY-MM-DD')
                                }
                        );
                    } else {
                        oFilter["operators"].push({
                            "column": aFormElementsKeys[i],
                            "compare_operator": "=",
                            "value": sValue
                        });
                    }
                }
            }
            i++;
        }

        // Sauve le filtre dans la définition de l'onglet.
        envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oFilter"] = angular.copy(oFilter);
        if (envSrvc["sMode"] == "search")
            envSrvc["oWorkspaceList"][envSrvc["sSelectedGridOptionsName"]]["oFilter"] = angular.copy(oFilter);
        //
        scope.$root.$broadcast("oFilterLoaded_" + envSrvc["oSelectedObject"]["name"], envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oFilter"]);
        // Charge la 1ere page avec les filtres.
        if (envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationCurrentPage"] == 1)
            scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["pagination"]["raise"]["paginationChanged"](1, envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationPageSize"]);
        else
            envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationCurrentPage"] = 1;
    };

    /**
     * resetGridFilter function.
     * Suppression des filtres pour la liste ui-grid / valeurs par défaut du formulaire de filtre.
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()["resetGridFilter"] = function () {
        $log.info("resetGridFilter");
        var scope = this;
        var oFormData = formSrvc["getFormData"](envSrvc["sFormDefinitionName"], true);
        var aFormElementsKeys = Object.keys(oFormData);
        var i = 0;
        //si il y a des champs date on les reset pour une nouvelle utilisation (sinon conservation de la date précédente)
        while (i < aFormElementsKeys.length) {
            var oFormElement = formSrvc["getFormElementDefinition"](aFormElementsKeys[i], envSrvc["sFormDefinitionName"]);
            if (oFormElement["type"] === "date" || oFormElement["type"] === "datetime")
                angular.element("#" + oFormElement["id"]).data("DateTimePicker").clear();
            i++;
        }
        // Valeurs par défaut du formulaire.
        envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]] = angular.copy(envSrvc["oWorkspaceList"][envSrvc["sSelectedGridOptionsName"]]["oDefaultValues"]);
        // Supprime et charge la 1ere page sans filtre.
        envSrvc["oGridOptionsCopy"][envSrvc["sSelectedGridOptionsName"]]["oFilter"] = envSrvc["oDefaultGridOptions"][envSrvc["sSelectedGridOptionsName"]]["oFilter"];
        scope["setGridFilter"]();
        // 1 seul élément <options> sélectionné.
        $timeout(function () {
            aFormElementsKeys.forEach(function (sFormElementKey) {
                var oFormElementDef = formSrvc["getFormElementDefinition"](sFormElementKey, envSrvc["sFormDefinitionName"]);
                if (oFormElementDef["type"] === "select") {
                    document.querySelectorAll("#" + oFormElementDef["id"]).forEach(function (oFormElement) {
                        if (typeof (oFormElement["options"]) != "undefined") {
                            Array.from(oFormElement["options"]).forEach(function (oOptions) {
                                var oSelectValue = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]][sFormElementKey];
                                oOptions.selected = false;
                                if (typeof (oSelectValue) == "object" && typeof (oSelectValue["selectedOption"]) == "object") {
                                    if (oOptions.value == oSelectValue["selectedOption"]["value"])
                                        oOptions.selected = true;
                                }
                            });
                        }
                    });
                }
            });
        });
    };

    /**
     * setPaginationStatus function.
     * Affichage du statut dans la barre de pagination.
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()['setPaginationStatus'] = function () {
        $log.info("setPaginationStatus");
        var scope = this, sTranslationId;
        if (envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["totalItems"] > 0) {
            sTranslationId = "PAGINATION_STATUS";
            // 1er élément affiché + total.
            var oTranslationValues = {
                "totalItems": envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["totalItems"],
                "itemStart": (envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationCurrentPage"] - 1) * envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationPageSize"] + 1
            };
            // Dernier élément affiché.
            oTranslationValues["itemEnd"] = oTranslationValues["itemStart"] + envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationPageSize"] - 1;
            if (oTranslationValues["itemEnd"] > oTranslationValues["totalItems"])
                oTranslationValues["itemEnd"] = oTranslationValues["totalItems"];
        } else
            sTranslationId = "PAGINATION_STATUS_NO_ITEMS";
        // Traduction.
        $translate([sTranslationId], oTranslationValues).then(function (translations) {
            scope["sPaginationStatus"] = translations[sTranslationId];
        });
    };

    /**
     * setGridPage function.
     * Charge une page pour la liste ui-grid.
     * @param {integer} iPageNumber N° de la page.
     * @param {integer} iPageSize Nb lignes par page.
     * @param {array} oFilter Filtre de recherche.
     * @param {object} oUrlParams Paramètres optionnels pour le web service.
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()['setGridPage'] = function (iPageNumber, iPageSize, oFilter, oUrlParams) {
        $log.info("setGridPage");

        var scope = angular.element(vitisApp.appWorkspaceListDrtv).scope();
        if (typeof (iPageNumber) != "number") {
            iPageNumber = 1;
        }
        if (envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["sectionGrid"] !== true) {
            envSrvc["oSelectedObject"]["iPageNumber"] = angular.copy(iPageNumber);
        }
        iPageNumber--;
        var iOffset = iPageNumber * iPageSize;
        // Paramètres pour le web service.
        if (typeof (oUrlParams) == "undefined")
            oUrlParams = {};
        else
            oUrlParams = angular.copy(oUrlParams);
        goog.object.extend(oUrlParams, {
            "offset": iOffset,
            "limit": iPageSize
        });
        if (typeof (oFilter) == "undefined") {
            oFilter = {
                "relation": "AND",
                "operators": []
            };
        }

        // Numéro de page
        if (typeof (envSrvc["oSelectedObject"]["iPageNumber"]) != "undefined") {
            if (envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["sectionGrid"] !== true) {
                envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationCurrentPage"] = envSrvc["oSelectedObject"]["iPageNumber"];
            }
        }
        // Filtre de recherche pour la liste ?
        if (typeof (envSrvc["oSelectedObject"]["filter"]) != "undefined")
            oFilter["operators"] = oFilter["operators"].concat(envSrvc["oSelectedObject"]["filter"]["operators"]);
        // Filtre de recherche pour tous les onglets du mode.
        if (typeof (envSrvc["oSelectedObject"]["aModeFilter"]) != "undefined")
            oFilter["operators"] = oFilter["operators"].concat(envSrvc["oSelectedObject"]["aModeFilter"]["operators"]);
        // Filtres pour la requête.
        if (oFilter["operators"].length > 0)
            oUrlParams["filter"] = angular.copy(oFilter);
        else
            delete oUrlParams["filter"];
        // Paramètres du service web (vitis, gtf...)
        var sResourceId = envSrvc["getSectionWebServiceResourceId"]();
        var aResourceId = envSrvc["explodeWebServiceResourceId"](sResourceId);
        // Evènement à éxécuter avant le chargement de la liste ?
        if (typeof (envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["appBeforeEvent"]) != "undefined")
            scope.$root.$eval(envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["appBeforeEvent"]);
        // Attributs à demander
        if (goog.isDefAndNotNull(envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]])) {
            if (goog.isArray(envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["columnDefs"])) {
                var aAttributs = [];
                for (var i = 0; i < envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["columnDefs"].length; i++) {
                    if (goog.isDefAndNotNull(envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["columnDefs"][i]['field'])) {
                        aAttributs.push(envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["columnDefs"][i]['field']);
                    }
                }
                if (aAttributs.length > 0) {
                    oUrlParams['attributs'] = aAttributs.join('|');
                }
            }
        }

        // Charge la liste des enregistrements de l'onglet.
        ajaxRequest({
            "method": "GET",
            "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/" + aResourceId[0] + "/" + aResourceId[1],
            "params": angular.copy(oUrlParams),
            "scope": scope,
            "success": function (response) {
                if (parseInt(response["data"]["status"]) == 1) {
                    var aGridData = [];
                    if (typeof (response["data"][aResourceId[1]]) != "undefined")
                        aGridData = response["data"][aResourceId[1]];
                    // Mise à jour de la liste ui-grid.
                    envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["data"] = aGridData;
                    //if (response["data"]["total_row_number"] > 0)
                    envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["totalItems"] = response["data"]["total_row_number"];
                    // Maj du libellé de pagination.
                    scope.$root["setPaginationStatus"]();
                    // Evènement à éxécuter après le chargement de la liste ?
                    if (typeof (envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["appAfterEvent"]) != "undefined")
                        scope.$root.$eval(envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["appAfterEvent"]);
                    // Lignes à sélectionner ?
                    if (typeof (envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["appSelectedRows"]) != "undefined") {
                        scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["grid"]["modifyRows"](envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["data"]);
                        aGridData.forEach(function (oRow, iIndex) {
                            if (envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["appSelectedRows"].indexOf(oRow[envSrvc["oSelectedObject"]["sIdField"]]) != -1)
                                scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["selection"]["selectRow"](envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["data"][iIndex])
                        });
                    }
                    scope.$root.$emit("workspaceListDataAdded");
                }
            }
        });
    };

    /**
     * formatGridColumn function.
     * Formatte des colonnes pour la liste ui-grid.
     * @param {array} aColumns Tableau des colonnes.
     * @param {string} sSelectedObjectName id de l'objet (onglet).
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()['formatGridColumn'] = function (aColumns, sSelectedObjectName) {
        $log.info("formatGridColumn");
        var aGridColumns = [], aGridColumn;
        var i = 0;
        while (i < aColumns.length) {
            if (typeof (aColumns[i]["width"]) != "number")
                aColumns[i]["width"] = "50";
            // <app.+><\/app.+>
            aGridColumn = {
                "name": aColumns[i]["field_label"],
                "displayName": aColumns[i]["field_label"],
                "field": aColumns[i]["name"],
                "width": parseInt(aColumns[i]["width"]) + 15,
                "enableSorting": aColumns[i]["sortable"],
                "enableColumnResizing": aColumns[i]["resizeable"],
                "headerCellClass": sSelectedObjectName + "_" + aColumns[i]["name"],
                "cellClass": "cell-align-" + aColumns[i]["align"]
            };

            // Un template est défini pour la colonne ?
            if (aColumns[i]["template"] != null)
                aGridColumn["cellTemplate"] = aColumns[i]["template"];
            // La colonne est celle du tri par défaut ?
            if (aGridColumn["field"] == envSrvc["oSelectedObject"]["sorted_by"]) {
                aGridColumn["sort"] = {
                    "direction": uiGridConstants[envSrvc["oSelectedObject"]["sorted_dir"]],
                    "ignoreSort": true,
                    "priority": 0
                };
            }
            //
            aGridColumns.push(aGridColumn);
            i++;
        }
        return aGridColumns;
    };

    /**
     * formatGridAction function.
     * Récupère les actions associées à la ressource.
     * @param {array} aAction Tableau des actions.
     * @param {string} sSelectedObjectName id de l'objet (onglet).
     * @return {array}
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()["formatGridAction"] = function (aAction, sSelectedObjectName) {
        $log.info("formatGridAction");
        var aGridActions = [];
        var i = 0;
        while (i < aAction.length) {
            // Parenthèses passées ?
            if (typeof (aAction[i]["event"]) === "string" && aAction[i]["event"].indexOf("(") === -1)
                aAction[i]["event"] = aAction[i]["event"] + "()";
            // Création du bouton.
            aGridActions.push({
                "label": goog.string.toTitleCase(aAction[i]["button_label"], ""),
                "event": aAction[i]["event"],
                "name": sSelectedObjectName + "_" + aAction[i]["button_class"]
            });
            i++;
        }
        return aGridActions;
    };

    /**
     * executeActionButtonEvent function.
     * Appel de la fonction liée au bouton d'action (modifier, visualiser...).
     * @param {object} oRow Element html de l'enregistrement sélectionné dans la liste.
     * @param {string} sEvent Fonction à appeler.
     * @param {object} oGridOptions Options de la liste ui-grid.
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()['executeActionButtonEvent'] = function (oRow, sEvent, oGridOptions) {
        $log.info("executeActionButtonEvent");
        var scope = angular.element(vitisApp.appWorkspaceListDrtv).scope();
        var sIdField = envSrvc["oSelectedObject"]["sIdField"];
        if (typeof (oGridOptions["appIdField"]) != "undefined")
            sIdField = oGridOptions["appIdField"];
        scope.$root[sEvent](oRow["entity"][sIdField]);
    };

    /**
     * DeleteSelection function.
     * Supprime les enregistrements sélectionnés.
     * @param {object} oOptions Paramètres optionnels.
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()['DeleteSelection'] = function (oOptions) {
        $log.info("DeleteSelection");
        var scope = angular.element(vitisApp.appWorkspaceListDrtv).scope();
        var aSelectedRows = scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["selection"]["getSelectedRows"]();
        if (aSelectedRows.length > 0) {
            if (typeof (oOptions) == "undefined")
                oOptions = {};
            // Traduction du texte de confirmation.
            var sMessage = "LIST_DELETE_CONFIRM";
            if (typeof (oOptions["sMessage"]) != "undefined")
                sMessage = oOptions["sMessage"];
            var oWindowOptions = {
                "message": sMessage,
                "callback": function (bResponse) {
                    if (bResponse) {
                        // Liste des enregistrements à supprimer.
                        var i = 0, aIdToDelete = [], sId;
                        if (typeof (oOptions["aSelectedId"]) != "undefined")
                            aIdToDelete = oOptions["aSelectedId"];
                        else {
                            // Colonne id de la table.
                            var sIdField = envSrvc["oSelectedObject"]["sIdField"];
                            if (typeof (oOptions) != "undefined" && typeof (oOptions["sIdField"]) != "undefined")
                                sIdField = oOptions["sIdField"];
                            // Liste des id à supprimer.
                            while (i < aSelectedRows.length) {
                                sId = aSelectedRows[i][sIdField];
//                                if (isNaN(sId))
//                                    sId = "'" + sId + "'";
                                aIdToDelete.push(sId);
                                i++;
                            }
                        }
                        if (aIdToDelete.length > 0) {
                            // Suppression des enregistrements sélectionnés.
                            var sResourceId = envSrvc["getSectionWebServiceResourceId"]();
                            var aResourceId = envSrvc["explodeWebServiceResourceId"](sResourceId);
                            ajaxRequest({
                                "method": "DELETE",
                                "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/" + aResourceId[0] + "/" + aResourceId[1],
                                "params": {
                                    "idList": aIdToDelete.join("|")
                                },
                                "scope": scope,
                                "success": function (response) {
                                    if (response["data"]["status"] == 1) {
                                        // Recharge la page actuelle.
                                        if (envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationCurrentPage"] == 1)
                                            scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["pagination"]["raise"]["paginationChanged"](1, envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationPageSize"]);
                                        else
                                            envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["paginationCurrentPage"] = 1;
                                        // Fonction à appeler après la suppression (idem afterEvent du form.) ?
                                        var sFunctionName = "after" + goog.string.toTitleCase(envSrvc["oSelectedMode"]["mode_id"], "_").replace(/_/g, "") + "Removal";
                                        if (typeof (scope.$root[sFunctionName]) != "undefined")
                                            scope.$root[sFunctionName]();
                                        // Evènement émis après la suppression des enregistrements.
                                        scope.$root.$emit("WorkspaceListSelectionRemoved", envSrvc["oSelectedObject"]["name"]);
                                    } else {
                                        // Affichage de la fenêtre modale d'erreur.
                                        var oWindowOptions2 = {
                                            "className": "modal-danger",
                                            "message": response["data"]["errorMessage"]
                                        };
                                        scope.$root["modalWindow"]("dialog", "LIST_DELETE_ERROR", oWindowOptions2);
                                    }
                                }
                            });
                        } else {
                            // Supprime la sélection.
                            scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["selection"]["clearSelectedRows"]();
                            // Raffraichit la grille.
                            scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]]["core"]["refresh"]();
                        }
                    }
                }
            };
            scope.$root["modalWindow"]("confirm", "", oWindowOptions);
        } else {
            $translate(["LIST_DELETE_NO_SELECTION"]).then(function (aTranslations) {
                var oOptions = {
                    "className": "modal-danger",
                    "message": aTranslations["LIST_DELETE_NO_SELECTION"]
                };
                scope.$root["modalWindow"]("dialog", "REQUEST_ERROR", oOptions);
            });
        }
    };

    /**
     * toGarbageCollection function.
     * Supprime un tableau / objet et toutes ses références.
     * @param {} reference Référence à supprimer (tableau ou objet).
     **/
    angular.element(vitisApp.appMainDrtv).scope()['toGarbageCollection'] = function (reference) {
        envSrvc["toGarbageCollection"](reference);
    };

    /**
     * concatSelectAttributes function.
     * Concatène l'id et le libéllé des options d'un <select>.
     * @param {string} sFormElementName Nom du <select>.
     * @param {string} sDelimiter Caractère délimiteur (un espace par défaut).
     **/
    angular.element(vitisApp.appMainDrtv).scope()['concatSelectAttributes'] = function (sFormElementName, sDelimiter) {
        $log.info("concatSelectAttributes");
        if (typeof (sDelimiter) == "undefined")
            sDelimiter = " ";
        var oSelect;
        var aFormElements = sFormElementName.split("|");
        aFormElements.forEach(function (sName) {
            oSelect = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]][sName];
            if (!goog.object.isEmpty(oSelect)) {
                if (!goog.object.isEmpty(oSelect["options"])) {
                    oSelect["options"].forEach(function (oOption) {
                        if (oOption["label"] != "" && oOption["value"] != "")
                            oOption["label"] = oOption["value"] + sDelimiter + oOption["label"];
                    });
                }
            }
        });
    };

    /**
     * workspaceTooltipPlacement function.
     * Retourne la valeur du paramètre "placement" d'un tooltip suivant sa position horizontale (avant ou après le milieu de l'écran).
     * @param {object} oElementNode DOM node element.
     * @return {string}
     **/
    angular.element(vitisApp.appMainDrtv).scope()['workspaceTooltipPlacement'] = function (oElementNode) {
        $log.info("workspaceTooltipPlacement");
        if ($(oElementNode).offset().left < (window.innerWidth / 2))
            return "right";
        else
            return "left";
    };

    /**
     * hideAllModalWindow function.
     * Ferme toutes les fenêtres modales.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['hideAllModalWindow'] = function (oElementNode) {
        $log.info("hideAllModalWindow");
        bootbox["hideAll"]();
    };

    /**
     * addSelectEmptyOption function.
     * Ajoute une <option> vide dans un <select> et la sélectionne (si aucune option est sélectionné).
     * @param {string} sFormElementName Nom du <select>.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['addSelectEmptyOption'] = function (sFormElementName) {
        $log.info("addSelectEmptyOption");
        // Création de la structure du <select> si non existante.
        oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
        if (typeof (oFormValues[sFormElementName]) == "undefined")
            oFormValues[sFormElementName] = {
                "options": []
            };
        // Ajoute une <option> vide.
        oFormValues[sFormElementName]["options"].unshift({
            "label": "",
            "value": ""
        });
        // Sélectionne l'option vide si aucune option est sélectionnée.
        if (typeof (oFormValues[sFormElementName]["selectedOption"]) == "undefined" || typeof (oFormValues[sFormElementName]["selectedOption"]["value"]) == "undefined")
            oFormValues[sFormElementName]["selectedOption"] = oFormValues[sFormElementName]["options"][0];
    };

    /**
     * appFormatDateColumn directive.
     * Formate la date d'une colonne ui-grid suivant la langue de l'application.
     * @expose
     **/
    vitisApp["compileProvider"].directive('appFormatDateColumn', function () {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appFormatDateColumn", function (value) {
                    if (!goog.isDefAndNotNull(attrs["format"])) {
                        attrs["format"] = 'L LTS';
                    }
                    // Classe css ui-grid pour la mise en forme de la colonne.
                    element[0].className += " ui-grid-cell-contents";
                    // Formate la date suivant la langue de l'application.
                    if (goog.isDefAndNotNull(scope["row"]["entity"][scope["col"]["field"]])) {
                        var momentSelected = moment(scope["row"]["entity"][scope["col"]["field"]])
                        if (goog.isDefAndNotNull(attrs["offset"])) {
                            momentSelected = momentSelected["utcOffset"](parseInt(attrs["offset"]), false);
                        }
                        element[0].innerHTML = momentSelected.format(attrs["format"]);
                    } else {
                        element[0].innerHTML = "";
                    }
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    });
    vitisApp.module.directive("appFormatDateColumn", vitisApp.appFormatDateColumn);

    /**
     * getBooleanTranslation function.
     * Retourne la traduction d'une valeur booléenne.
     * @param {boolean} bValue Valeur à traduire.
     * @return {promise}
     **/
    angular.element(vitisApp.appMainDrtv).scope()['getBooleanTranslation'] = function (bValue) {
        $log.info("getBooleanTranslation");
        var deferred = $q.defer();
        var promise = deferred.promise;
        if (typeof (bValue) == "boolean") {
            $translate(["FORM_YES", "FORM_NO"]).then(function (oTranslations) {
                var sTranslation;
                if (bValue)
                    sTranslation = oTranslations["FORM_YES"];
                else
                    sTranslation = oTranslations["FORM_NO"];
                deferred.resolve(sTranslation);
            });
        } else
            deferred.resolve(bValue);
        return promise;
    };

    /**
     * loadSectionList function.
     * Paramétrage d'une liste ui-grid pour l'affichage dans une section.
     * @param {object} oOptions Paramètres optionnels pour ui-grid (surcharge ceux par défaut).
     **/
    angular.element(vitisApp.appMainDrtv).scope()['loadSectionList'] = function (oOptions) {
        $log.info("loadSectionList");
        var scope = this;
        // Attend l'initialisation du contrôleur workspaceListCtrl.
        var clearListener = scope.$root.$on('initWorkspaceList', function (event, scope) {
            // Supprime le "listener".
            clearListener();
            // Paramètres de la liste "ui-grid".
            scope["gridOptions"] = {
                "enableRowSelection": true,
                "enableSelectAll": true,
                //"enableRowHeaderSelection" : false,
                //"enableFullRowSelection" : true,
                "enablePagination": true,
                "enablePaginationControls": false,
                "useExternalPagination": true,
                "paginationPageSize": propertiesSrvc["rows_per_page"],
                "enableColumnMenus": false,
                "enableColumnResizing": true,
                //"enableColumnMoving": true,
                "paginationPageSizes": [10, 20, 50, 100, 200, 500],
                "appHeader": false,
                "appHeaderTitleBar": true,
                "appHeaderSearchForm": false,
                "appHeaderOptionBar": false,
                "appLoadGridData": true,
                "appGridTitle": envSrvc["oSelectedObject"]["label"],
                "appResizeGrid": false,
                "appFooter": true,
                "appShowPagination": true,
                "appEnableDragAndDrop": false,
                "appDragAndDropEvent": {},
                "appActions": [],
                //"oFilter": [envSrvc["oSelectedObject"]["sIdField"] + "=" + sId],
                "oFilter": {
                    "relation": "AND",
                    "operators": [
                        {
                            "column": envSrvc["oSelectedObject"]["sIdField"],
                            "compare_operator": "=",
                            "value": envSrvc["sId"]
                        }]
                },
                "appShowActions": false, // Affichage des boutons d'actions.
                "paginationCurrentPage": 1,
                "sectionGrid": true
            };
            // Surcharge les paramètres par ceux passés à la fonction.
            if (typeof (oOptions) != "undefined")
                goog.object.extend(scope["gridOptions"], oOptions);

            // Pas de données à charger pour le formulaire de filtre.
            scope["bLoadFormValues"] = false;
        });
    };

    /**
     * getTabIdFieldValue function.
     * Retourne la valeur du champ ID d'un onglet.
     * @return {}
     **/
    angular.element(vitisApp.appMainDrtv).scope()['getTabIdFieldValue'] = function () {
        $log.info("getTabIdFieldValue");
        return envSrvc["sId"];
    };

    /**
     * setRadioTranslation function.
     * Change la valeur d'un champ radio par sa traduction (oui / non).
     * @param {string} sFormElementName Nom du champ de form. à traduire.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['setRadioTranslation'] = function (sFormElementName) {
        $log.info("setRadioTranslation");
        angular.element(vitisApp.appMainDrtv).scope().$root["getBooleanTranslation"](envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]][sFormElementName]).then(function (sTranslation) {
            envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]][sFormElementName] = sTranslation;
        });
    };

    /**
     * cloneSectionForm function.
     * Clone un enregistrement.
     * @param {array} aFormField Nom des champs de form. à vider.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['cloneSectionForm'] = function (aFormField) {
        $log.info("cloneSectionForm");
        var scope = this;
        var oFormValuesCopy = angular.copy(envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]);
        // Vide les champs spécifiés.
        if (typeof (aFormField) != "undefined") {
            for (var i = 0; i < aFormField.length; i++) {
                delete oFormValuesCopy[aFormField[i]];
            }
        }
        // Mode "insert".
        this["AddSectionForm"]();
        var clearListener = scope.$root.$on('formExtracted', function (event, sFormDefinitionName) {
            if (sFormDefinitionName === envSrvc["sFormDefinitionName"]) {
                // Supprime le "listener".
                clearListener();
                // Valeurs de l'enregistrement à cloner.
                envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]] = angular.copy(oFormValuesCopy);
                // Rafraichissement du formulaire.
                scope.$broadcast('$$rebind::refresh');
                scope.$apply();
            }
        });
    };

    /**
     * copyFormElemContentToClipboard function.
     * Copie le contenu d'un champ de form. dans le presse papier.
     * @param {string} sFormElementName Nom du champ de formulaire.
     **/
    angular.element(vitisApp.appMainDrtv).scope()["copyFormElemContentToClipboard"] = function (sFormElementName) {
        $log.info("copyFormElemContentToClipboard");
        var oTempElem = document.createElement("textarea");
        document.getElementsByTagName("body")[0].appendChild(oTempElem);
        oTempElem.innerHTML = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]][sFormElementName];
        oTempElem.select();
        document.execCommand("copy");
        document.getElementsByTagName("body")[0].removeChild(oTempElem);
    };


    /**
     * addModalSectionForm function.
     * Création d'un enregistrement (simpleForm) dans une fenêtre modale.
     **/
    angular.element(vitisApp.appMainDrtv).scope()["addModalSectionForm"] = function () {
        $log.info("addModalSectionForm");
        envSrvc["setModalSectionForm"]("insert");
    };

    /**
     * editModalSectionForm function.
     * Edition d'un enregistrement (simpleForm) dans une fenêtre modale.
     * @param {object} sId Id de l'enregistrement sélectionné dans la liste.
     **/
    angular.element(vitisApp.appMainDrtv).scope()["editModalSectionForm"] = function (sId) {
        $log.info("editModalSectionForm");
        if (typeof (sId) == "undefined")
            sId = envSrvc["sId"];
        envSrvc["setModalSectionForm"]("update", sId);
    };

    /**
     * showModalSectionForm function.
     * Edition d'un enregistrement (simpleForm) dans une fenêtre modale.
     * @param {object} sId Id de l'enregistrement sélectionné dans la liste.
     **/
    angular.element(vitisApp.appMainDrtv).scope()["showModalSectionForm"] = function (sId) {
        $log.info("showModalSectionForm");
        if (typeof (sId) == "undefined")
            sId = envSrvc["sId"];
        envSrvc["setModalSectionForm"]("display", sId);
    };

    /**
     * closeModalSectionForm function.
     * Fermeture de la fenêtre modale du from. d'un enregistrement.
     * @param {boolean} bRefreshGrid Raffraichissement de la liste actuelle.
     **/
    angular.element(vitisApp.appMainDrtv).scope()["closeModalSectionForm"] = function (bRefreshGrid) {
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        $log.info("closeModalSectionForm");
        // Recharge la liste.
        if (bRefreshGrid === true)
            $rootScope['refreshGrid']($rootScope["gridApi"][envSrvc["sSelectedGridOptionsName"]]['grid']['appScope'], envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]);
        // Ferme la fenêtre.
        $rootScope["hideAllModalWindow"]();
    };

    /**
     * setModeFilter function.
     * Définition d'un filtre pour les listes de tous les onglets du mode.
     * @param {array} aObjectsToExclude Liste de noms d'objets à exclure.
     **/
    angular.element(vitisApp.appMainDrtv).scope()["setModeFilter"] = function (aObjectsToExclude) {
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        $log.info("setModeFilter");
        // Au moins un enregistrement doit être sélectionné dans la liste.
        var aSelectedRows = $rootScope["gridApi"][envSrvc["sSelectedGridOptionsName"]]["selection"]["getSelectedRows"]();
        if (aSelectedRows.length > 0) {
            // Onglets à exclure (onglet du bouton).
            if (typeof (aObjectsToExclude) == "undefined")
                aObjectsToExclude = [];
            aObjectsToExclude.push(envSrvc["oSelectedObject"]["name"]);
            // Définition du filtre dans tous les onglets du mode.
            for (var i = 0; i < envSrvc["oSelectedMode"]["objects"].length; i++) {
                if (aObjectsToExclude.indexOf(envSrvc["oSelectedMode"]["objects"][i]["name"]) == -1)
                    envSrvc["oSelectedMode"]["objects"][i]["aModeFilter"] = {
                        "relation": "AND",
                        "operators": [{
                                "column": envSrvc["oSelectedObject"]["sIdField"],
                                "compare_operator": "=",
                                "value": aSelectedRows[0][envSrvc["oSelectedObject"]["sIdField"]]
                            }]
                    };
            }
            // Désactive le bouton.
            var oActions = envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["appActions"];
            for (i = 0; i < oActions.length; i++) {
                if (oActions[i]["name"].indexOf("_set_mode_filter") != -1)
                    oActions[i]["disabled"] = true;
                else if (oActions[i]["name"].indexOf("_unset_mode_filter") != -1)
                    oActions[i]["disabled"] = false;
            }
            // Rafraîchit le scope de la liste ui-grid.
            var gridScope = $rootScope["gridApi"][envSrvc["sSelectedGridOptionsName"]]['grid']['appScope'];
            gridScope.$broadcast('$$rebind::refresh');
            gridScope.$applyAsync();
        }
    };

    /**
     * unsetModeFilter function.
     * Suppression du filtre pour les listes de tous les onglets du mode.
     **/
    angular.element(vitisApp.appMainDrtv).scope()["unsetModeFilter"] = function () {
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        $log.info("unsetModeFilter");
        // Définition du filtre dans tous les onglets du mode.
        for (var i = 0; i < envSrvc["oSelectedMode"]["objects"].length; i++) {
            delete envSrvc["oSelectedMode"]["objects"][i]["aModeFilter"];
        }
        // Désactive le bouton.
        var oActions = envSrvc["oGridOptions"][envSrvc["sSelectedGridOptionsName"]]["appActions"];
        for (i = 0; i < oActions.length; i++) {
            if (oActions[i]["name"].indexOf("set_mode_filter") != -1)
                oActions[i]["disabled"] = false;
        }
        // Rafraîchit le scope de la liste ui-grid.
        var gridScope = $rootScope["gridApi"][envSrvc["sSelectedGridOptionsName"]]['grid']['appScope'];
        gridScope.$broadcast('$$rebind::refresh');
        gridScope.$applyAsync();
    };

    /**
     * appHideColumn directive.
     * Cache la colonne de la liste.
     * @expose
     **/
    vitisApp["compileProvider"].directive('appHideColumn', function () {
        return {
            link: function (scope, element, attrs) {
                // Cache la colonne.
                var oGridApi = scope.$root["gridApi"][envSrvc["sSelectedGridOptionsName"]];
                var oGridOptions = oGridApi["grid"]["appScope"]["gridOptions"];
                for (var i in oGridOptions["columnDefs"]) {
                    if (oGridOptions["columnDefs"][i]["name"] == scope["col"]["name"]) {
                        oGridOptions["columnDefs"][i]["visible"] = false;
                        break;
                    }
                }
                // Rafraîchissement de la liste.
                oGridApi["core"]["refresh"]();
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                });
            }
        }
    });
    vitisApp.module.directive("appHideColumn", vitisApp.appHideColumn);
});

/* global oVFB, vitisApp, goog, ol */

'use strict';

goog.provide('vmap.script_module');
goog.require('vmap');
goog.require('ol.proj');
goog.require('ol.source.WMTS');
goog.require('ol.format.WMTSCapabilities');
goog.require('nsVmap.importBoDrtv');
goog.require('nsVmap.importBoCtrl');
goog.require('goog.array');

vitisApp.on('appMainDrtvLoaded', function () {

    angular.element(vitisApp.appHtmlFormDrtv).scope().$on("updateStudio_vmap_business_object_vmap_business_object", function (event, data) {
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);

        if (data["index"] === 1 && data["oSectionForm"]["template"] === "modules/vmap/template/studio.html") {
            oVFB["reset"]();
            oVFB["setId"](envSrvc["sId"]);
            oVFB["setApplication"]("vmap");
            oVFB["setToken"](sessionSrvc["token"]);
            oVFB["setContainer"]("#container_section_" + envSrvc["oSelectedObject"]["name"] + "_studio");
            oVFB["setAppProperties"](propertiesSrvc);
        }

    }, true);

    /**
     * loadVmap function.
     * Function éxécutée au chargement de Vmap.
     **/
    angular.element(vitisApp.appMainDrtv).scope()["loadVmap"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $timeout = angular.element(vitisApp.appMainDrtv).injector().get(["$timeout"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var modesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["modesSrvc"]);

        $log.info("loadVmap");

        // Vmap en mode plein écran.
        envSrvc["oSelectedMode"]["fullScreen"] = true;

        // Permet de ne pas recharger le mode lors du re-clic
        modesSrvc["setModeReload"]("vmap", false);

        vitisApp.externFunctionSrvc()["resizeWin"]();
        angular.element(vitisApp.appMainDrtv).scope()["setFullScreen"]();

        // Pas d'affichage de l'anim ajax.
        var oModeVmap = modesSrvc["getMode"]("vmap");
        oModeVmap["ajaxLoader"] = false;
        // Si vmap est le 1er mode de l'appli. -> obligatoire.
        if (modesSrvc["modes"][0]["mode_id"] == "vmap")
            sessionStorage["ajaxLoader"] = false;

        oVmap.init();
    };

    /**
     * appMapDescriptionColumn directive.
     * Mise en forme de la colonne "description" dans la liste de l'onglet "Cartes".
     * @param {service} $translate Translate service.
     * @ngInject
     **/
    vitisApp.appMapDescriptionColumnDrtv = function ($translate) {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appMapDescriptionColumn", function (value) {
                    // Si le champ est vide : supprime l'icône.
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        // Classes css (ui-grid + spécifiques).
                        element[0].className = "ui-grid-cell-contents info-icon";
                        // Traduction du titre et du contenu.
                        $translate(["DESCRIPTION_TOOLTIP_TITLE_VMAP_MAP_MAP"]).then(function (translations) {
                            // Création du "tooltip".
                            $(element)["popover"]({
                                "trigger": "hover",
                                "container": "body",
                                "title": function () {
                                    return translations["DESCRIPTION_TOOLTIP_TITLE_VMAP_MAP_MAP"];
                                },
                                "content": function () {
                                    return scope["row"]["entity"][scope["col"]["field"]];
                                },
                                // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                                "placement": function (oPopoverNode, oElementNode) {
                                    return scope.$root["workspaceTooltipPlacement"](oElementNode);
                                },
                                "html": true
                            });
                        });
                    }
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime le tooltip.
                    $(element)["popover"]("destroy");
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive('appMapDescriptionColumn', vitisApp.appMapDescriptionColumnDrtv);

    /**
     * appMapThumbnailColumn directive.
     * Mise en forme de la colonne "vignette" dans la liste de l'onglet "Cartes".
     * @param {service} propertiesSrvc Paramètres des properties.
     * @ngInject
     **/
    vitisApp.appMapThumbnailColumnDrtv = function (propertiesSrvc) {
        return {
            replace: true,
            template: '<span class="glyphicon glyphicon-picture grid-column-glyph-icon"></span>',
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appMapThumbnailColumn", function (value) {
                    // Si le champ est vide : supprime le lien.  
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        element[0].className = "glyphicon glyphicon-picture grid-column-glyph-icon";
                        element[0].parentNode.style.textAlign = "center";
                        // Création du "tooltip".
                        $(element)["popover"]({
                            //"trigger": "hover",
                            "trigger": "hover",
                            "container": "body",
                            "title": "",
                            "content": function () {
                                var oImg = document.createElement("img");
                                oImg.onerror = function () {
                                    $(element)["popover"]("destroy");
                                };
                                oImg.src = scope["row"]["entity"][scope["col"]["field"]];
                                oImg.className = "popover-thumbnail-img";
                                return oImg.outerHTML;
                            },
                            "html": true,
                            // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                            "placement": function (oPopoverNode, oElementNode) {
                                return scope.$root["workspaceTooltipPlacement"](oElementNode);
                            },
                            "template": '<div class="popover popover-thumbnail" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
                        });
                    }
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime le tooltip.
                    $(element)["popover"]("destroy");
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive('appMapThumbnailColumn', vitisApp.appMapThumbnailColumnDrtv);

    /**
     * appServiceUrlColumn directive.
     * Mise en forme de la colonne "url" dans la liste de l'onglet "Services".
     * @ngInject
     **/
    vitisApp.appServiceUrlColumnDrtv = function () {
        return {
            replace: true,
            template: '<a href="" target="_blank" class="glyphicon glyphicon-link grid-column-glyph-icon"></a>',
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appServiceUrlColumn", function (value) {
                    // Si le champ est vide : supprime le lien.  
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        element[0].className = "glyphicon glyphicon-link grid-column-glyph-icon";
                        element[0].href = scope["row"]["entity"][scope["col"]["field"]];
                        element[0].alt = element[0].href;
                        element[0].title = element[0].href;
                        element[0].parentNode.style.textAlign = "center";
                    }
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime le tooltip.
                    $(element)["popover"]("destroy");
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive('appServiceUrlColumn', vitisApp.appServiceUrlColumnDrtv);

    /**
     * appServiceDescriptionColumn directive.
     * Mise en forme de la colonne "description" dans la liste de l'onglet "Services".
     * @param {service} $translate Translate service.
     * @ngInject
     **/
    vitisApp.appServiceDescriptionColumnDrtv = function ($translate) {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appServiceDescriptionColumn", function (value) {
                    // Si le champ est vide : supprime l'icône.  
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        // Classes css (ui-grid + spécifiques).
                        element[0].className = "ui-grid-cell-contents info-icon";
                        // Traduction du titre et du contenu.
                        $translate(["DESCRIPTION_TOOLTIP_TITLE_VMAP_MAP_SERVICE"]).then(function (translations) {
                            // Création du "tooltip".
                            $(element)["popover"]({
                                "trigger": "hover",
                                "container": "body",
                                "title": function () {
                                    return translations["DESCRIPTION_TOOLTIP_TITLE_VMAP_MAP_SERVICE"];
                                },
                                "content": function () {
                                    return scope["row"]["entity"][scope["col"]["field"]];
                                },
                                // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                                "placement": function (oPopoverNode, oElementNode) {
                                    return scope.$root["workspaceTooltipPlacement"](oElementNode);
                                },
                                "html": true
                            });
                        });
                    }
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime le tooltip.
                    $(element)["popover"]("destroy");
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive('appServiceDescriptionColumn', vitisApp.appServiceDescriptionColumnDrtv);

    /**
     * appServiceThumbnailColumn directive.
     * Mise en forme de la colonne "vignette" dans la liste de l'onglet "Services".
     * @param {service} propertiesSrvc Paramètres des properties.
     * @ngInject
     **/
    vitisApp.appServiceThumbnailColumnDrtv = function (propertiesSrvc) {
        return {
            replace: true,
            template: '<span class="glyphicon glyphicon-picture grid-column-glyph-icon"></span>',
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appServiceThumbnailColumn", function (value) {
                    // Si le champ est vide : supprime le lien.  
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        element[0].className = "glyphicon glyphicon-picture grid-column-glyph-icon";
                        element[0].parentNode.style.textAlign = "center";
                        // Création du "tooltip".
                        $(element)["popover"]({
                            "trigger": "hover",
                            "container": "body",
                            "title": "",
                            "content": function () {
                                var oImg = document.createElement("img");
                                oImg.onerror = function () {
                                    $(element)["popover"]("destroy");
                                };
                                oImg.src = scope["row"]["entity"][scope["col"]["field"]];
                                oImg.className = "popover-thumbnail-img";
                                return oImg.outerHTML;
                            },
                            "html": true,
                            // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                            "placement": function (oPopoverNode, oElementNode) {
                                return scope.$root["workspaceTooltipPlacement"](oElementNode);
                            },
                            "template": '<div class="popover popover-thumbnail" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
                        });
                    }
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime le tooltip.
                    $(element)["popover"]("destroy");
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive("appServiceThumbnailColumn", vitisApp.appServiceThumbnailColumnDrtv);

    /**
     * appLayerDescriptionColumn directive.
     * Mise en forme de la colonne "description" dans la liste de l'onglet "Calques".
     * @param {service} $translate Translate service.
     * @ngInject
     **/
    vitisApp.appLayerDescriptionColumnDrtv = function ($translate) {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appLayerDescriptionColumn", function (value) {
                    // Si le champ est vide : supprime l'icône.  
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        // Classes css (ui-grid + spécifiques).
                        element[0].className = "ui-grid-cell-contents info-icon";
                        // Traduction du titre et du contenu.
                        $translate(["DESCRIPTION_TOOLTIP_TITLE_VMAP_MAP_LAYER"]).then(function (translations) {
                            // Création du "tooltip".
                            $(element)["popover"]({
                                "trigger": "hover",
                                "container": "body",
                                "title": function () {
                                    return translations["DESCRIPTION_TOOLTIP_TITLE_VMAP_MAP_LAYER"];
                                },
                                "content": function () {
                                    return scope["row"]["entity"][scope["col"]["field"]];
                                },
                                // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                                "placement": function (oPopoverNode, oElementNode) {
                                    return scope.$root["workspaceTooltipPlacement"](oElementNode);
                                },
                                "html": true
                            });
                        });
                    }
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime le tooltip.
                    $(element)["popover"]("destroy");
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive("appLayerDescriptionColumn", vitisApp.appLayerDescriptionColumnDrtv);

    /**
     * loadVmapGroup function.
     * Chargement de la section "Vmap" dans l'onglet "Groupes" (mode "Utilisateurs").
     **/
    angular.element(vitisApp.appMainDrtv).scope()['loadVmapGroup'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
        $log.info("loadVmapGroup");
        // Surcharge l'url du formulaire des groupes de Vmap.
        var scope = this;
        var sTable = envSrvc["oSelectedObject"]["name"];
        scope["oFormRequestParams"] = {
            "sUrl": "modules/vmap/forms/" + envSrvc["oSelectedMode"]["mode_id"] + "/" + sTable + "_" + envSrvc["oSectionForm"][sTable]["sections"][envSrvc["oSectionForm"][sTable]["iSelectedSectionIndex"]]["name"] + ".json"
        };
    };

    /**
     * appCrsListDescriptionColumn directive.
     * Mise en forme de la colonne "description" dans la liste de l'onglet "Services".
     * @param {service} $translate Translate service.
     * @ngInject
     **/
    vitisApp.appCrsListDescriptionColumnDrtv = function ($translate) {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appCrsListDescriptionColumn", function (value) {
                    // Si le champ est vide : supprime l'icône.  
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        // Classes css (ui-grid + spécifiques).
                        element[0].className = "ui-grid-cell-contents info-icon";
                        // Traduction du titre et du contenu.
                        $translate(["COORDINATE_SYSTEM_TOOLTIP_TITLE_VMAP_MAP_LAYER"]).then(function (translations) {
                            // Création du "tooltip".
                            $(element)["popover"]({
                                "trigger": "hover",
                                "container": "body",
                                "title": function () {
                                    return translations["COORDINATE_SYSTEM_TOOLTIP_TITLE_VMAP_MAP_LAYER"];
                                },
                                "content": function () {
                                    return scope["row"]["entity"][scope["col"]["field"]].replace(/\|/g, "<br>");
                                },
                                // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                                "placement": function (oPopoverNode, oElementNode) {
                                    return scope.$root["workspaceTooltipPlacement"](oElementNode);
                                },
                                "html": true
                            });
                        });
                    }
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime le tooltip.
                    $(element)["popover"]("destroy");
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive("appCrsListDescriptionColumn", vitisApp.appCrsListDescriptionColumnDrtv);

    /**
     * initVmapServiceForm function.
     * Traitements avant l'affichage du formulaire de service.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['initVmapServiceForm'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("initVmapServiceForm");

        var scope = angular.element(vitisApp.appMainDrtv).scope();
        // Evènement sur la sélection dy type de service uniquement en mode "insert".
        if (envSrvc["sMode"] == "insert") {
            var oServiceTypeFormElement = document.querySelector("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] select[name='service_type_id']");
            oServiceTypeFormElement.addEventListener("change", function () {
                // Affichage des champs de formulaires suivant le type de service sélectionné.
                scope.$root["setVmapServiceForm"](this.value);
                // Lance un cycle $digest pour appliquer les changements de champs de form.
                angular.element("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "']").scope().$apply();
            });
        } else {
            // Affichage des champs de formulaires suivant le type de service sélectionné.
            scope.$root["setVmapServiceForm"](envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["service_type_id"]);
            // Lance un cycle $digest pour appliquer les changements de champs de form.
            angular.element("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "']").scope().$apply();
        }
    };

    /**
     * setVmapServiceForm function.
     * Affichage des champs de formulaires suivant le type de service sélectionné.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['setVmapServiceForm'] = function (sServiceTypeId) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(['$log']);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(['$translate']);
        var $timeout = angular.element(vitisApp.appMainDrtv).injector().get(['$timeout']);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['envSrvc']);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['formSrvc']);
        //
        $log.info('setVmapServiceForm');
        // Champs de form. à afficher pour chaque type de service.
        var oServiceFormElements = {
            'xyz': ['name', 'description', 'url', 'thumbnail', 'form_submit', 'return_list'],
            'osm': ['name', 'description', 'url', 'thumbnail', 'form_submit', 'return_list'],
            'bing': ['name', 'description', 'key', 'thumbnail', 'lang', 'imagery', 'form_submit', 'return_list'],
            'imagewms': ['name', 'wms_service_type', 'description', 'url', 'service_type_version', 'wms_test_button', 'wms_test_submit_button', 'return_list'],
            'tilewms': ['name', 'wms_service_type', 'description', 'url', 'service_type_version', 'wms_test_button', 'wms_test_submit_button', 'return_list'],
            'wmts': ['name', 'description', 'url', 'service_type_version', 'service_type_type', 'capabilities_url', 'wmts_test_button', 'wmts_test_submit_button', 'return_list']
        };
        // Champs de form. affichés par défaut.
        Object.keys(oServiceFormElements).forEach(function (sServiceType) {
            oServiceFormElements[sServiceType].unshift('service_id', 'service_type_id');
        });
        // Affiche ou cache les champs de formulaires suivant le type de service.
        var oAllFormElementDefinition = formSrvc['getAllFormElementDefinition'](envSrvc['sFormDefinitionName']);
        if (typeof (sServiceTypeId) == 'undefined') {
            sServiceTypeId = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['service_type_id'];
        }
        if (sServiceTypeId === 'tilewms' || sServiceTypeId === 'imagewms') {
            envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['wms_service_type'] = sServiceTypeId;
        }

        //if (typeof(oServiceFormElements[sServiceTypeId]) == 'undefined')
        //sServiceTypeId = Object.keys(oServiceFormElements)[0];
        oAllFormElementDefinition.forEach(function (oFormElementDefinition) {
            var bVisible = true;

            // Définit si le champ est visible
            if (typeof (oServiceFormElements[sServiceTypeId]) != 'undefined') {
                if (oFormElementDefinition['type'] !== 'button') {
                    if (oServiceFormElements[sServiceTypeId].indexOf(oFormElementDefinition['name']) == -1)
                        var bVisible = false;
                } else {
                    var aButtons = oFormElementDefinition['buttons'];
                    if (goog.isDefAndNotNull(aButtons)) {
                        aButtons.forEach(function (oButton) {
                            if (oServiceFormElements[sServiceTypeId].indexOf(oButton['name']) === -1)
                                oButton['visible'] = false;
                            else
                                oButton['visible'] = true;
                        });
                    }
                }
            }

            // Si le champ version est visible : tooltip.
            if (oFormElementDefinition['name'] == 'service_type_version' && bVisible) {
                $timeout(function () {
                    $translate(['FORM_SERVICE_TYPE_VERSION_TOOLTIP_VMAP_MAP_SERVICE']).then(function (translations) {
                        var oOptions = {
                            'title': '',
                            'content': translations['FORM_SERVICE_TYPE_VERSION_TOOLTIP_VMAP_MAP_SERVICE'],
                            'container': 'body',
                            'trigger': 'hover'
                        };
                        // Création de l'élément qui contient le tooltip.
                        if (document.getElementById(oFormElementDefinition['id'] + '_tooltip') == null) {
                            var oTooltipElement = document.createElement('span');
                            oTooltipElement.className = 'form-field-label-tooltip';
                            var sTooltipElementId = oFormElementDefinition['id'] + '_tooltip';
                            oTooltipElement.id = sTooltipElementId;
                            if (document.getElementById(oFormElementDefinition['id'] + '_label') != null)
                                document.getElementById(oFormElementDefinition['id'] + '_label').appendChild(oTooltipElement);
                        }
                        // Création du tooltip.
                        angular.element(oTooltipElement)['popover'](oOptions);
                    });
                });
            }
            //
            oFormElementDefinition['visible'] = bVisible;

            if (envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['service_vm4ms']) {
                if (oFormElementDefinition['name'] === 'name' || oFormElementDefinition['name'] === 'url') {
                    oFormElementDefinition['type'] = 'label';
                }
            }
        });

        if ((sServiceTypeId === 'tilewms' || sServiceTypeId === 'imagewms') && envSrvc['sMode'] === 'update') {
            formSrvc['getFormElementDefinition']('service_type_id', envSrvc['sFormDefinitionName'], envSrvc['sFormDefinition'])['visible'] = false;
        } else {
            formSrvc['getFormElementDefinition']('service_type_id', envSrvc['sFormDefinitionName'], envSrvc['sFormDefinition'])['visible'] = true;
        }

        if (sServiceTypeId === 'wmts') {
            $timeout(function () {
                // Version du service
                if (envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['service_type_version'] === '' ||
                        !goog.isDefAndNotNull(envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['service_type_version'])) {
                    envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['service_type_version'] = '1.0.0';
                }
            });
        }
    };

    /**
     * Function called before sending the vMap service form
     */
    angular.element(vitisApp.appMainDrtv).scope()['beforeVmapServiceForm'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(['$log']);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['envSrvc']);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['formSrvc']);

        $log.info('beforeVmapServiceForm');

        var sServiceTypeId = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['service_type_id'];

        if (sServiceTypeId === 'tilewms' || sServiceTypeId === 'imagewms') {
            envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['service_type_id'] = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['wms_service_type']['selectedOption']['value'];
            formSrvc['getFormElementDefinition']('service_type_id', envSrvc['sFormDefinitionName'], envSrvc['sFormDefinition'])['type'] = 'text';
        }
    };

    /**
     * Function called after sending the vMap service form
     */
    angular.element(vitisApp.appMainDrtv).scope()['afterVmapServiceForm'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(['$log']);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['envSrvc']);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['formSrvc']);

        $log.info('afterVmapServiceForm');

        var sServiceTypeId = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['service_type_id'];

        if (sServiceTypeId === 'tilewms' || sServiceTypeId === 'imagewms') {
            formSrvc['getFormElementDefinition']('service_type_id', envSrvc['sFormDefinitionName'], envSrvc['sFormDefinition'])['type'] = 'label';
        }

        this['editSectionForm']();
    };


    /**
     * Test the WMTS service doing a getCapabilities request and show a message
     * to say if the service is correct or not
     * @param {boolean} bSendForm true if the form has to bo sended if the test is correct
     */
    angular.element(vitisApp.appMainDrtv).scope()['testWMTSCapabilities'] = function (bSendForm) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(['$log']);
        var $timeout = angular.element(vitisApp.appMainDrtv).injector().get(['$timeout']);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['envSrvc']);

        $log.info('testWMTSCapabilities');

        var this_ = this;
        var serviceUrl = angular.copy(envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['url']);
        var serviceVersion = angular.copy(envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['service_type_version']);
        var WMTSType = angular.copy(envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['service_type_type']);
        var serviceName = angular.copy(envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['name']);
        if (goog.isObject(WMTSType)) {
            if (goog.isDefAndNotNull(WMTSType['selectedOption'])) {
                if (goog.isDefAndNotNull(WMTSType['selectedOption']['value'])) {
                    WMTSType = WMTSType['selectedOption']['value'];
                }
            }
        }

        if (!goog.isDefAndNotNull(serviceName) || serviceName === '') {
            $.notify('Nom non défini', 'error');
            return null;
        }
        if (!goog.isDefAndNotNull(serviceUrl) || serviceUrl === '') {
            $.notify('Lien non défini', 'error');
            return null;
        }
        if (!goog.isDefAndNotNull(serviceVersion) || serviceVersion === '') {
            $.notify('Version non définie', 'error');
            return null;
        }
        if (!goog.isDefAndNotNull(WMTSType) || WMTSType === '') {
            $.notify('Type non défini', 'error');
            return null;
        }
        if (serviceUrl.toLowerCase().indexOf('service=') > 0) {
            $.notify('Veuillez ne pas utiliser le paramètre SERVICE dans le champ "Lien"', 'error');
            return null;
        }
        if (serviceUrl.toLowerCase().indexOf('request=') > 0) {
            $.notify('Veuillez ne pas utiliser le paramètre REQUEST dans le champ "Lien"', 'error');
            return null;
        }
        if (serviceUrl.toLowerCase().indexOf('version=') > 0) {
            $.notify('Veuillez ne pas utiliser le paramètre VERSION dans le champ "Lien"', 'error');
            return null;
        }

        this['WMTSCapabilities']({
            'serviceUrl': serviceUrl,
            'serviceVersion': serviceVersion,
            'WMTSType': WMTSType
        }, function (oCapabilities) {
            $.notify('Service valide', 'success');
            $timeout(function () {
                var sOptions = JSON.stringify(oCapabilities);
                envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['service_options'] = sOptions;
                if (bSendForm) {

                    // Enlève certains attributs au cas où l'utilisateur est ait écrits dans l'url
                    envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['url'] = serviceUrl.removeURLParams(['request', 'service', 'version']);

                    var sFormName = envSrvc["oFormDefinition"][envSrvc['sFormDefinitionName']]["name"];
                    var scope = angular.element("form[name='" + sFormName + "']").scope();
                    scope[sFormName].$setPristine();
                    scope['sendForm']();
                }
            });
        });
    };

    /**
     * Make a WMTS getCapabilities
     * @param {object} opt_options
     * @param {string} opt_options.serviceUrl
     * @param {string} opt_options.serviceVersion
     * @param {string} opt_options.WMTSType
     * @param {function} successCallback
     * @param {function} errorCallback
     */
    angular.element(vitisApp.appMainDrtv).scope()['WMTSCapabilities'] = function (opt_options, successCallback, errorCallback) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(['$log']);
        var $http = angular.element(vitisApp.appMainDrtv).injector().get(['$http']);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['propertiesSrvc']);
        var this_ = this;

        $log.info('WMTSCapabilities');

        if (!goog.isDefAndNotNull(opt_options['serviceUrl'])) {
            console.error('serviceUrl not defined');
            return null;
        }
        if (!goog.isDefAndNotNull(opt_options['serviceVersion'])) {
            console.error('serviceVersion not defined');
            return null;
        }
        if (!goog.isDefAndNotNull(opt_options['WMTSType'])) {
            console.error('WMTSType not defined');
            return null;
        }
        if (!goog.isDefAndNotNull(errorCallback)) {
            errorCallback = function (sError) {
                this_.$root['modalWindow']('dialog', 'Service non valide', {
                    'className': 'modal-danger',
                    'message': sError
                });
            };
        }

        var serviceUrl = opt_options['serviceUrl'];
        var serviceVersion = opt_options['serviceVersion'];
        var WMTSType = opt_options['WMTSType'];

        var sCapabilitiesUrl;
        var bError = true;
        var sError = '';

        // Enlève certains attributs au cas où l'utilisateur est ait écrits dans l'url
        serviceUrl = serviceUrl.removeURLParams(['request', 'service', 'version']);

        if (WMTSType === 'KVP') {
            if (serviceUrl.indexOf('?') === -1)
                sCapabilitiesUrl = serviceUrl + '?SERVICE=WMTS&VERSION=' + serviceVersion + '&REQUEST=GetCapabilities';
            else
                sCapabilitiesUrl = serviceUrl + '&SERVICE=WMTS&VERSION=' + serviceVersion + '&REQUEST=GetCapabilities';
        } else if (WMTSType === 'REST') {
            sCapabilitiesUrl = serviceUrl + '/' + serviceVersion + '/WMTSCapabilities.xml';
        }

        if (goog.isDefAndNotNull(sCapabilitiesUrl)) {
            $http({
                url: propertiesSrvc['proxy_url'] + '?url=' + encodeURIComponent(sCapabilitiesUrl),
                headers: {
                    'charset': 'charset=utf-8'
                }
            }).then(angular.bind(this, function (response) {
                var text = response['data'];
                if (goog.isString(response['data'])) {
                    if (response['data'].length > 0) {

                        try {
                            var result = new ol.format.WMTSCapabilities().read(text);
                        } catch (e) {
                            var result = {};
                            sError = text;
                        }

                        $log.info(result);

                        if (goog.isDefAndNotNull(result['Contents'])) {
                            if (goog.isArray(result['Contents']['Layer'])) {
                                if (goog.isDefAndNotNull(result['Contents']['Layer'][0])) {
                                    if (goog.isArray(result['Contents']['Layer'][0]['TileMatrixSetLink'])) {
                                        if (goog.isDefAndNotNull(result['Contents']['Layer'][0]['TileMatrixSetLink'][0])) {
                                            if (goog.isString(result['Contents']['Layer'][0]['TileMatrixSetLink'][0]['TileMatrixSet'])) {
                                                bError = false;
                                            } else {
                                                sError = 'Contents.Layer[0].TileMatrixSetLink[0].TileMatrixSet undefined';
                                            }
                                        } else {
                                            sError = 'Contents.Layer[0].TileMatrixSetLink[0] undefined';
                                        }
                                    } else {
                                        sError = 'Contents.Layer[0].TileMatrixSetLink undefined';
                                    }
                                } else {
                                    sError = 'Contents.Layer[0] undefined';
                                }
                            } else {
                                sError = 'Contents.Layer undefined';
                            }
                        } else {
                            sError = 'Contents undefined';
                        }
                    }
                }

                if (bError) {
                    var message = 'Impossible de récupérer les informations depuis ' + sCapabilitiesUrl;
                    if (text.length < 500) {
                        message += '<br><br>' + text;
                    }
                    if (goog.isDefAndNotNull(errorCallback)) {
                        errorCallback.call(this_, message);
                    }
                } else {
                    successCallback.call(this_, result);
                }
            })), function errorCallback(response) {
                if (goog.isDefAndNotNull(errorCallback)) {
                    errorCallback.call(this_, 'Impossible de récupérer les informations depuis ' + sCapabilitiesUrl);
                }
                console.error('error: ', response);
            };
        }
    };

    /**
     * Test the WMS service doing a getCapabilities request and show a message
     * to say if the service is correct or not
     * @param {boolean} bSendForm true if the form has to bo sended if the test is correct
     */
    angular.element(vitisApp.appMainDrtv).scope()['testWMSCapabilities'] = function (bSendForm) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(['$log']);
        var $timeout = angular.element(vitisApp.appMainDrtv).injector().get(['$timeout']);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['envSrvc']);

        $log.info('testWMSCapabilities');

        var this_ = this;
        var serviceUrl = angular.copy(envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['url']);
        var serviceName = angular.copy(envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['name']);

        if (!goog.isDefAndNotNull(serviceUrl) || serviceUrl === '') {
            $.notify('Lien non défini', 'error');
            return null;
        }
        if (!goog.isDefAndNotNull(serviceName) || serviceName === '') {
            $.notify('Nom non défini', 'error');
            return null;
        }
        if (serviceUrl.toLowerCase().indexOf('service=') > 0) {
            $.notify('Veuillez ne pas utiliser le paramètre SERVICE dans le champ "Lien"', 'error');
            return null;
        }
        if (serviceUrl.toLowerCase().indexOf('request=') > 0) {
            $.notify('Veuillez ne pas utiliser le paramètre REQUEST dans le champ "Lien"', 'error');
            return null;
        }
        if (serviceUrl.toLowerCase().indexOf('version=') > 0) {
            $.notify('Veuillez ne pas utiliser le paramètre VERSION dans le champ "Lien"', 'error');
            return null;
        }

        this['getCapabilities'](serviceUrl).then(function (oResult) {
            if (goog.isDefAndNotNull(oResult)) {
                if (goog.isDefAndNotNull(oResult['json'])) {
                    $.notify('Service valide', 'success');
                    $timeout(function () {
                        if (bSendForm) {

                            // Enlève certains attributs au cas où l'utilisateur est ait écrits dans l'url
                            envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['url'] = serviceUrl.removeURLParams(['request', 'service', 'version']);

                            var sFormName = envSrvc["oFormDefinition"][envSrvc['sFormDefinitionName']]["name"];
                            var scope = angular.element("form[name='" + sFormName + "']").scope();
                            scope[sFormName].$setPristine();
                            scope['sendForm']();
                        } else {

                            this_['showLayerModalWindow']({
                                'capabilities': oResult,
                                'service_url': serviceUrl
                            });
                        }
                    });
                } else {
                    $.notify('Service non valide', 'error');
                }
            } else {
                $.notify('Service non valide', 'error');
            }
        });
    };

    /**
     * cloneService function.
     * Clonage d'un service de vmap.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['cloneService'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        //
        $log.info("cloneService");
    };

    /**
     * initVmapLayerForm function.
     * Traitements avant l'affichage du formulaire des calques.
     * @param {object} sId Id de l'enregistrement sélectionné dans la liste.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['initVmapLayerForm'] = function (sId) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var Restangular = angular.element(vitisApp.appMainDrtv).injector().get(["Restangular"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        $log.info("initVmapLayerForm");

        // Affiche ou pas la section "Formulaire de filtre"
        this['showStudioIfLayerIsFiltered']()
        //
        // rootScope
        var scope = angular.element(vitisApp.appMainDrtv).scope();
        // Paramètres du service web.
        var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vmap", "services");
        // Attend la fin du chargement de la définition du formulaire.
        //var clearListener = scope.$root.$on('formDefinitionLoaded', function (event, sFormDefinitionName) {
        // Requête pour la liste des services.
        oWebServiceBase["customGET"]("", {"token": sessionSrvc["token"]}).then(function (data) {
            if (data["status"] == 1) {
                // Sauve le type de chaque service.
                if (data["list_count"] > 0) {
                    var oServices = {};
                    data["services"].forEach(function (oService) {
                        oServices[oService["service_id"]] = oService;
                    });
                    // Sauve la liste des services.
                    scope["oServices"] = oServices;
                    // Affichage du formulaire du calque suivant le service sélectionné.
                    if (envSrvc["sMode"] == "update") {
                        scope.$root["setVmapLayerForm"]();
                    }
                }
            }
        });
        // Supprime le "listener".
        //clearListener();
        //});

        // Attend la fin de la compilation du formulaire.
        //var clearListener2 = scope.$root.$on('endFormNgRepeat', function (event) {
        var sServiceTypeId = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["service_type_id"];
        if (sServiceTypeId == "tilewms" || sServiceTypeId == "imagewms") {
            // Charge les infos des calques associés au calque. 
            if (envSrvc["sMode"] == "update") {
                var oGridOptions = angular.element("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] .ui-grid-form-field-data").scope().$parent["gridOptions"];
                var sServiceUrl = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["service_url"];

                var sSelectedLayers = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["layer_list"];
                var aSelectedLayers = [];
                var aGridData = [];

                if (sSelectedLayers != null)
                    aSelectedLayers = sSelectedLayers.split(",");

                for (var i = aSelectedLayers.length - 1; i >= 0; i--) {
                    aGridData.push({
                        "name": aSelectedLayers[i]
                    });
                }
                oGridOptions["data"] = aGridData;
            }
        }
        // Supprime le "listener".
        //clearListener2();
        //});

        // Attend la fin de la création du formulaire (DOM).
        //var clearListener3 = scope.$root.$on('endFormNgRepeat', function (event, sFormDefinitionName) {
        if (envSrvc["sMode"] == "insert") {
            setTimeout(function () {
                var oServiceFormElement = document.querySelector("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] select[name='service_id']");
                oServiceFormElement.addEventListener("change", function () {
                    // Affichage des champs de formulaires suivant le type de service sélectionné.
                    scope.$root["setVmapLayerForm"](this.value);
                    // Lance un cycle $digest pour appliquer les changements de champs de form.
                    angular.element("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "']").scope().$apply();
                });
            });
        } else {
            scope.$root["setVmapLayerForm"](envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["service_id"]);
        }
        // Supprime le "listener".
        //clearListener3();
        //});
    };

    /**
     * setVmapLayerForm function.
     * Affichage des champs de formulaires suivant le service sélectionné.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['setVmapLayerForm'] = function (sServiceId) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(['$log']);
        var $http = angular.element(vitisApp.appMainDrtv).injector().get(['$http']);
        var $timeout = angular.element(vitisApp.appMainDrtv).injector().get(['$timeout']);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['envSrvc']);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['formSrvc']);
        //
        $log.info('setVmapLayerForm');
        var scope = angular.element(vitisApp.appMainDrtv).scope();
        var this_ = this;

        // Champs de form. à afficher pour chaque type de service.
        var oLayerFormElements = {
            'xyz': ['layer_id', 'service_id', 'service_name', 'name', 'layertheme_id', 'theme_name', 'bo_id', 'form_submit', 'return_list'],
            'osm': ['layer_id', 'service_id', 'service_name', 'name', 'layertheme_id', 'theme_name', 'bo_id', 'form_submit', 'return_list'],
            'bing': ['layer_id', 'service_id', 'service_name', 'name', 'layertheme_id', 'theme_name', 'bo_id', 'form_submit', 'return_list'],
            'tilewms': ['layer_id', 'service_id', 'service_name', 'name', 'description', 'layertheme_id', 'theme_name', 'layer_list', 'bo_id', 'is_dynamic', 'is_filtered', 'form_submit', 'return_list'],
            'imagewms': ['layer_id', 'service_id', 'service_name', 'name', 'description', 'layertheme_id', 'theme_name', 'layer_list', 'bo_id', 'is_dynamic', 'is_filtered', 'form_submit', 'return_list'],
            'wmts': ['layer_id', 'service_id', 'service_name', 'name', 'description', 'layertheme_id', 'theme_name', 'wmts_layer', 'matrix_set', 'layer_style', 'layer_format', 'layer_options', 'bo_id', 'form_submit', 'return_list']
        };

        var sServiceType;
        var sName;
        var aRows = formSrvc['getAllFormElementDefinition'](envSrvc['sFormDefinitionName']);

        // Identifiant du service
        if (!goog.isDefAndNotNull(sServiceId)) {
            sServiceId = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['service_id'];
            if (goog.isDefAndNotNull(sServiceId['selectedOption'])) {
                if (goog.isDefAndNotNull(sServiceId['selectedOption']['value'])) {
                    sServiceId = sServiceId['selectedOption']['value'];
                }
            }
        }

        // Type de service
        if (envSrvc['sMode'] === 'insert') {
            if (goog.isDefAndNotNull(scope['oServices'][sServiceId])) {
                sServiceType = scope['oServices'][sServiceId]['service_type_id'];
                envSrvc["oFormValues"][envSrvc['sFormDefinitionName']]["service_type_id"] = sServiceType;
                if (goog.isDefAndNotNull(scope['oServices'][sServiceId]['url'])) {
                    envSrvc["oFormValues"][envSrvc['sFormDefinitionName']]["service_url"] = scope['oServices'][sServiceId]['url'];
                }
            }
        } else {
            sServiceType = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['service_type_id'];
        }

        // Cache les éléments à cacher
        aRows.forEach(function (oElement) {
            if (goog.isDefAndNotNull(oLayerFormElements[sServiceType])) {
                // Récupère le nom de l'élément
                if (oElement['type'] === 'button') {
                    var aButtons = oElement['buttons'];
                    if (goog.isDefAndNotNull(aButtons)) {
                        aButtons.forEach(function (oButton) {
                            if (oLayerFormElements[sServiceType].indexOf(oButton['name']) === -1)
                                oButton['visible'] = false;
                            else
                                oButton['visible'] = true;
                        });
                    }
                } else {
                    // si l'élément est présent dans la liste, alors il est visible
                    if (oLayerFormElements[sServiceType].indexOf(oElement['name']) !== -1) {
                        oElement['visible'] = true;
                    } else {
                        oElement['visible'] = false;
                    }
                }
            }
        });

        // Charge les infos pour wmts
        if (sServiceType === 'wmts') {

            var oLayers = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['wmts_layer'];
            var oMatrix = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['matrix_set'];
            var oStyles = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['layer_style'];
            var oFormats = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['layer_format'];

            // Valeurs par défaut
            oLayers = goog.isDefAndNotNull(oLayers) ? oLayers : {
                'options': [],
                'selectedOption': {
                    'value': ''
                }
            };
            oMatrix = goog.isDefAndNotNull(oMatrix) ? oMatrix : {
                'options': [],
                'selectedOption': {
                    'value': ''
                }
            };
            oStyles = goog.isDefAndNotNull(oStyles) ? oStyles : {
                'options': [],
                'selectedOption': {
                    'value': ''
                }
            };
            oFormats = goog.isDefAndNotNull(oFormats) ? oFormats : {
                'options': [],
                'selectedOption': {
                    'value': ''
                }
            };

            $timeout(function () {
                if (envSrvc['sMode'] === 'update') {
                    // Donne à wmts_layer la valeur sélectionnée dans layer_list
                    oLayers['selectedOption']['value'] = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['layer_list'];
                    // Rempli au préalable les options (qui se renpliront plus tard avec le getCapabilities)
                    if (goog.isArray(oLayers['options'])) {
                        if (oLayers['options'].length === 0) {
                            oLayers['options'] = [{
                                    'label': oLayers['selectedOption']['value'],
                                    'value': oLayers['selectedOption']['value']
                                }];
                        }
                    }
                    if (goog.isArray(oMatrix['options'])) {
                        if (oMatrix['options'].length === 0) {
                            oMatrix['options'] = [{
                                    'label': oMatrix['selectedOption']['value'],
                                    'value': oMatrix['selectedOption']['value']
                                }];
                        }
                    }
                    if (goog.isArray(oStyles['options'])) {
                        if (oStyles['options'].length === 0) {
                            oStyles['options'] = [{
                                    'label': oStyles['selectedOption']['value'],
                                    'value': oStyles['selectedOption']['value']
                                }];
                        }
                    }
                    if (goog.isArray(oFormats['options'])) {
                        if (oFormats['options'].length === 0) {
                            oFormats['options'] = [{
                                    'label': oFormats['selectedOption']['value'],
                                    'value': oFormats['selectedOption']['value']
                                }];
                        }
                    }
                } else if (envSrvc['sMode'] === 'display') {
                    envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['wmts_layer'] = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['layer_list'];
                }
            });

            var getLayersSelectOptions = function (oCapabilities) {
                var options = [];
                if (goog.isDefAndNotNull(oCapabilities['Contents'])) {
                    if (goog.isArray(oCapabilities['Contents']['Layer'])) {
                        var aLayers = oCapabilities['Contents']['Layer'];
                        for (var i = 0; i < aLayers.length; i++) {
                            options.push({
                                'label': aLayers[i]['Title'],
                                'value': aLayers[i]['Identifier']
                            });
                        }

                    }
                }
                return options;
            };

            var getMatrixSelectOptions = function (oCapabilities, oSelectedLayer) {
                var options = [];
                var aTileMatrixSets = [];
                var aTileMatrixIdentifiers = [];

                if (goog.isDefAndNotNull(oSelectedLayer)) {
                    if (goog.isDefAndNotNull(oSelectedLayer['value'])) {

                        var sSelectedLayer = oSelectedLayer['value'];

                        if (goog.isDefAndNotNull(oCapabilities['Contents'])) {
                            if (goog.isDefAndNotNull(oCapabilities['Contents']['Layer'])) {

                                var aLayers = oCapabilities['Contents']['Layer'];

                                // Rempli aTileMatrixIdentifiers
                                for (var i = 0; i < aLayers.length; i++) {
                                    if (aLayers[i]['Identifier'] === sSelectedLayer) {
                                        if (goog.isDefAndNotNull(aLayers[i]['TileMatrixSetLink'])) {
                                            for (var ii = 0; ii < aLayers[i]['TileMatrixSetLink'].length; ii++) {
                                                if (goog.isString(aLayers[i]['TileMatrixSetLink'][ii]['TileMatrixSet'])) {
                                                    aTileMatrixIdentifiers.push(aLayers[i]['TileMatrixSetLink'][ii]['TileMatrixSet']);
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            // Rempli aTileMatrixSets
                            if (goog.isDefAndNotNull(oCapabilities['Contents']['TileMatrixSet']) && aTileMatrixIdentifiers.length > 0) {
                                for (var i = 0; i < oCapabilities['Contents']['TileMatrixSet'].length; i++) {
                                    if (aTileMatrixIdentifiers.indexOf(oCapabilities['Contents']['TileMatrixSet'][i]['Identifier']) !== -1) {
                                        aTileMatrixSets.push(oCapabilities['Contents']['TileMatrixSet'][i]);
                                    }
                                }
                            }

                            // Rempli options
                            if (aTileMatrixSets.length > 0) {
                                for (var i = 0; i < aTileMatrixSets.length; i++) {
                                    options.push({
                                        'label': aTileMatrixSets[i]['Identifier'] + ' (' + aTileMatrixSets[i]['SupportedCRS'] + ')',
                                        'value': aTileMatrixSets[i]['Identifier']
                                    });
                                }
                            }
                        }
                    }
                }
                return options;
            };

            var getStylesSelectOptions = function (oCapabilities, oSelectedLayer) {
                var options = [];
                var aStyles = [];

                if (goog.isDefAndNotNull(oSelectedLayer)) {
                    if (goog.isDefAndNotNull(oSelectedLayer['value'])) {

                        var sSelectedLayer = oSelectedLayer['value'];

                        if (goog.isDefAndNotNull(oCapabilities['Contents'])) {
                            if (goog.isDefAndNotNull(oCapabilities['Contents']['Layer'])) {

                                var aLayers = oCapabilities['Contents']['Layer'];

                                // Rempli aStyles
                                for (var i = 0; i < aLayers.length; i++) {
                                    if (aLayers[i]['Identifier'] === sSelectedLayer) {
                                        if (goog.isDefAndNotNull(aLayers[i]['Style'])) {
                                            aStyles = aLayers[i]['Style'];
                                        }
                                    }
                                }
                            }

                            // Rempli options
                            if (aStyles.length > 0) {
                                for (var i = 0; i < aStyles.length; i++) {
                                    options.push({
                                        'label': aStyles[i]['Identifier'],
                                        'value': aStyles[i]['Identifier']
                                    });
                                }
                            }
                        }
                    }
                }
                return options;
            };

            var getFormatsSelectOptions = function (oCapabilities, oSelectedLayer) {
                var options = [];
                var aFormats = [];

                if (goog.isDefAndNotNull(oSelectedLayer)) {
                    if (goog.isDefAndNotNull(oSelectedLayer['value'])) {

                        var sSelectedLayer = oSelectedLayer['value'];

                        if (goog.isDefAndNotNull(oCapabilities['Contents'])) {
                            if (goog.isDefAndNotNull(oCapabilities['Contents']['Layer'])) {

                                var aLayers = oCapabilities['Contents']['Layer'];

                                // Rempli aFormats
                                for (var i = 0; i < aLayers.length; i++) {
                                    if (aLayers[i]['Identifier'] === sSelectedLayer) {
                                        if (goog.isDefAndNotNull(aLayers[i]['Format'])) {
                                            aFormats = aLayers[i]['Format'];
                                        }
                                    }
                                }
                            }

                            // Rempli options
                            if (aFormats.length > 0) {
                                for (var i = 0; i < aFormats.length; i++) {
                                    options.push({
                                        'label': aFormats[i],
                                        'value': aFormats[i]
                                    });
                                }
                            }
                        }
                    }
                }
                return options;
            };

            var loadSelectOptions = function (oCapabilities) {

                var aLayers = getLayersSelectOptions(oCapabilities);
                var aMatrixSets, aStyles, aFormats;

                $timeout(function () {
                    if (goog.isDefAndNotNull(oLayers)) {
                        oLayers['options'] = aLayers;
                    }
                });

                // Fonction appelée lors des changements de wmts_layer, 
                // ceci défini dans le json du formulaire
                this_['wmtsLayerSelected'] = function () {
                    $log.info('wmtsLayerSelected');

                    if (goog.isDefAndNotNull(oLayers)) {
                        if (goog.isDefAndNotNull(oLayers['selectedOption'])) {
                            if (goog.isDefAndNotNull(oLayers['selectedOption']['value'])) {

                                aMatrixSets = getMatrixSelectOptions(oCapabilities, oLayers['selectedOption']);
                                aStyles = getStylesSelectOptions(oCapabilities, oLayers['selectedOption']);
                                aFormats = getFormatsSelectOptions(oCapabilities, oLayers['selectedOption']);

                                $timeout(function () {

                                    if (goog.isDefAndNotNull(oMatrix)) {
                                        oMatrix['options'] = aMatrixSets;
                                        envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['matrix_set'] = oMatrix;
                                    }
                                    if (goog.isDefAndNotNull(oStyles)) {
                                        oStyles['options'] = aStyles;
                                        envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['layer_style'] = oStyles;
                                    }
                                    if (goog.isDefAndNotNull(oFormats)) {
                                        oFormats['options'] = aFormats;
                                        envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['layer_format'] = oFormats;
                                    }
                                    // Donne à layer_list la valeur sélectionnée dans wmts_layer
                                    envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['layer_list'] = oLayers['selectedOption']['value'];
                                });
                            }
                        }
                    }
                };
                if (goog.isDefAndNotNull(oLayers)) {
                    if (goog.isDefAndNotNull(oLayers['selectedOption'])) {
                        if (goog.isDefAndNotNull(oLayers['selectedOption']['value'])) {
                            if (oLayers['selectedOption']['value'].length > 0) {
                                this_['wmtsLayerSelected']();
                            }
                        }
                    }
                }
            };

            var oService = scope['oServices'][sServiceId];
            if (goog.isDefAndNotNull(oService) && envSrvc["sMode"] !== "display") {
                if (goog.isDefAndNotNull(oService['service_options'])) {
                    // Charge la liste des calques/matrices/styles en prenant les infos écrites en base dans service.service_options
                    var oCapabilities = JSON.parse(oService['service_options']);
                    loadSelectOptions(oCapabilities);
                } else {
                    // Charge la liste des calques/matrices/styles en faisant un getCapabilities
                    this['WMTSCapabilities']({
                        'serviceUrl': oService['url'],
                        'serviceVersion': oService['service_type_version'],
                        'WMTSType': oService['service_type_type']
                    }, function (oCapabilities) {
                        loadSelectOptions(oCapabilities);
                    });
                }
            }
        }
        // Vide la liste ui-grid des calques associés (uniquement en insertion).
        if (envSrvc['sMode'] == 'insert') {
            var oGridElement = document.querySelector("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] .ui-grid-form-field-data");
            if (oGridElement != null)
                angular.element(oGridElement).scope().$parent['gridOptions']['data'].length = 0;
        }
    };

    /**
     * loadVmapMapLayers function.
     * Chargement de la section "Calques de la carte" dans l'onglet "Cartes".
     **/
    angular.element(vitisApp.appMainDrtv).scope()['loadVmapMapLayers'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
        $log.info("loadVmapMapLayers");
        var scope = this;
        // Sauve le tri par défaut de l'onglet "Cartes".
        var sSortedBy = envSrvc["oSelectedObject"]["sorted_by"];
        var sSortedDir = envSrvc["oSelectedObject"]["sorted_dir"];
        var oSaveUrlParams = angular.copy(envSrvc["oGridOptionsCopy"][envSrvc["oSelectedObject"]["name"]]["oUrlParams"]);
        // Tri pour la section "Calques de la carte".
        envSrvc["oSelectedObject"]["sorted_by"] = "layer_index";
        envSrvc["oSelectedObject"]["sorted_dir"] = "ASC";
        // Classe spécifique pour séparer la liste ui-grid de la liste des sections.
        var oSectionContainer = document.getElementById("container_section_" + envSrvc["oSelectedObject"]["name"] + "_layers");
        oSectionContainer.className = oSectionContainer.className + " section-container-workspace-list";

        // Paramétrage du module ui-grid
        scope["gridOptions"] = {
            "enableRowSelection": true,
            "enableSelectAll": true,
            "enablePagination": false,
            "enablePaginationControls": false,
            "useExternalPagination": true,
            "paginationPageSize": 999, // Pas de pagination
            "enableColumnMenus": false,
            "enableColumnResizing": true,
            //"enableColumnMoving": true,
            "paginationPageSizes": [10, 20, 50, 100],
            "appHeader": true,
            "appHeaderTitleBar": true,
            "appHeaderSearchForm": false,
            "appHeaderOptionBar": false,
            "appLoadGridData": true,
            "aFilter": ["map_id=" + envSrvc["sId"]], // Id de la carte.
            "appGridTitle": "TITLE_GRID_MAP_LAYERS_VMAP_MAP_MAP_LAYERS",
            "appFooter": false,
            "appShowPagination": false,
            "appEnableDragAndDrop": true,
            "appDragAndDropEvent": {
                "rowFinishDrag": "updateMapLayerSorting"
            },
            "appActions": [],
            "oUrlParams": {
                "order_by": "layer_index",
                "sort_order": "DESC"
            }
        };
        envSrvc["oGridOptionsCopy"][envSrvc["oSelectedObject"]["name"]]["oUrlParams"] = angular.copy(scope["gridOptions"]["oUrlParams"]);

        // Pas de chargement de données.
        scope["bLoadFormValues"] = false;

        // Id de traduction des libellés des colonnes de la liste.
        var aTranslationsId = ["FORM_MAP_ID_VMAP_MAP_MAP",
            "FORM_NAME_VMAP_MAP_MAP",
            "FORM_THEME_VMAP_MAP_MAP",
            "FORM_VISIBLE_VMAP_MAP_MAP_LAYERS",
            "FORM_OPACITY_VMAP_MAP_MAP_LAYERS"
        ];
        // Définition des colonnes de la liste.
        $translate(aTranslationsId).then(function (aTranslations) {
            scope["gridOptions"]["columnDefs"] = [
                {"name": aTranslations["FORM_MAP_ID_VMAP_MAP_MAP"], "displayName": aTranslations["FORM_MAP_ID_VMAP_MAP_MAP"], "field": "layer_id", "width": 50, "enableSorting": false, "type": "number", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "vmap_map_layers_" + envSrvc["oSelectedObject"]["name"] + "_layer_id", "cellClass": "cell-align-right"},
                {"name": aTranslations["FORM_NAME_VMAP_MAP_MAP"], "displayName": aTranslations["FORM_NAME_VMAP_MAP_MAP"], "field": "name", "width": 250, "enableSorting": false, "type": "string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "vmap_map_layers_" + envSrvc["oSelectedObject"]["name"] + "_name"},
                {"name": aTranslations["FORM_THEME_VMAP_MAP_MAP"], "displayName": aTranslations["FORM_THEME_VMAP_MAP_MAP"], "field": "theme_name", "width": 200, "enableSorting": false, "type": "string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "vmap_map_layers_" + envSrvc["oSelectedObject"]["name"] + "_theme_name"},
                {"name": aTranslations["FORM_VISIBLE_VMAP_MAP_MAP_LAYERS"], "displayName": aTranslations["FORM_VISIBLE_VMAP_MAP_MAP_LAYERS"], "field": "layer_visible", "width": 60, "enableSorting": false, "type": "string", "enableColumnMoving": true, "enableColumnResizing": true, "cellTemplate": '<div data-app-set-boolean-icon-column="{{row.entity[col.field]}}"></div>', "headerCellClass": "vmap_map_layers_" + envSrvc["oSelectedObject"]["name"] + "_layer_visible"},
                {"name": aTranslations["FORM_OPACITY_VMAP_MAP_MAP_LAYERS"], "displayName": aTranslations["FORM_OPACITY_VMAP_MAP_MAP_LAYERS"], "field": "layer_opacity", "width": 65, "enableSorting": false, "type": "number", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "vmap_map_layers_" + envSrvc["oSelectedObject"]["name"] + "_layer_opacity", "cellClass": "cell-align-right", "cellTemplate": '<div data-app-map-layers-opacity-column="{{row.entity.layer_id}}" class="cell-input-type-text"><input type="number" class="form-control" min="0" max="100"></div>'},
            ];
        });

        // Boutons de la liste.
        if (envSrvc["sMode"] == "update") {
            $translate(["BTN_VISIBLE_VMAP_MAP_MAP_LAYERS", "BTN_INVISIBLE_VMAP_MAP_MAP_LAYERS", "BTN_ADD_LAYERS_VMAP_MAP_MAP_LAYERS", "BTN_DELETE_LAYERS_VMAP_MAP_MAP_LAYERS"]).then(function (oTranslations) {
                scope["gridOptions"]["appActions"] = [
                    {
                        "label": oTranslations["BTN_ADD_LAYERS_VMAP_MAP_MAP_LAYERS"],
                        "name": scope["sSelectedObjectName"] + "_add_layer_btn",
                        "event": "showAddLayersToMapModalWindow()"
                    },
                    {
                        "label": oTranslations["BTN_DELETE_LAYERS_VMAP_MAP_MAP_LAYERS"],
                        "name": scope["sSelectedObjectName"] + "_delete_layer_btn",
                        "event": "deleteMapLayers()"
                    },
                    {
                        "label": oTranslations["BTN_VISIBLE_VMAP_MAP_MAP_LAYERS"],
                        "name": scope["sSelectedObjectName"] + "_visible_btn",
                        "event": "setMapLayerVisibility(true)"
                    },
                    {
                        "label": oTranslations["BTN_INVISIBLE_VMAP_MAP_MAP_LAYERS"],
                        "name": scope["sSelectedObjectName"] + "_invisible_btn",
                        "event": "setMapLayerVisibility(false)"
                    }
                ];
            });

            // Attends la compilation du template workspaceList.
            var clearListener = scope.$root.$on('workspaceListTplCompiled', function (event) {
                // Supprime le "listener".
                clearListener();
                // Insertion des boutons pour changer l'ordre des calques.
                //var sGridFooterId = envSrvc["oSelectedObject"]["name"] + "_grid_footer";
                //document.getElementById(sGridFooterId).className += " workspacelist-grid-footer-map";
                //workspacelist-grid-data
                var oGridData = document.querySelector("#" + envSrvc["oSelectedObject"]["name"] + "_grid .workspacelist-grid-data");
                // arrow-up / chevron-up / triangle-top
                var sLayerUpId = scope["sSelectedObjectName"] + "_layer_up_btn";
                var sLayerDownId = scope["sSelectedObjectName"] + "_layer_down_btn";
                angular.element(oGridData).append('<button type="button" id="' + sLayerUpId + '" class="btn btn-sm btn-primary map-layer-order-up" aria-label="Left Align"><span class="glyphicon glyphicon-chevron-up"></span></button>');
                angular.element(oGridData).append('<button type="button" id="' + sLayerDownId + '" class="btn btn-sm btn-primary map-layer-order-down" aria-label="Left Align"><span class="glyphicon glyphicon-chevron-down"></span></button>');
                // Evènements sur les boutons.
                document.getElementById(sLayerUpId).addEventListener("click", function () {
                    scope.$root["changeMapLayerSorting"]("up");
                });
                document.getElementById(sLayerDownId).addEventListener("click", function () {
                    scope.$root["changeMapLayerSorting"]("down");
                });
                // Restaure le tri par défaut de l'onglet "Cartes".
                envSrvc["oSelectedObject"]["sorted_by"] = sSortedBy;
                envSrvc["oSelectedObject"]["sorted_dir"] = sSortedDir;
                envSrvc["oGridOptionsCopy"][envSrvc["oSelectedObject"]["name"]]["oUrlParams"] = angular.copy(oSaveUrlParams);
            });
        }
    };

    /**
     * showAddLayersToMapModalWindow function.
     * Affichage de la liste des calques disponibles pour une carte dans une fenêtre modale.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['showAddLayersToMapModalWindow'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $compile = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$compile"]);
        var $templateRequest = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$templateRequest"]);
        var $translate = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$translate"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        var uiGridConstants = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["uiGridConstants"]);
        var modesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["modesSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("showAddLayersToMapModalWindow");
        var scope = this.$new();
        // Sauve le nouveau scope crée dans la définition de l'onglet. 
        modesSrvc["addScopeToObject"](envSrvc["oSelectedObject"]["name"], envSrvc["oSelectedMode"]["mode_id"], scope);
        // Sauve l'ancien onglet
        //var oSaveSelectedObject = angular.copy(envSrvc["oSelectedObject"]);
        var oSaveSelectedObject = modesSrvc["getObject"](envSrvc["oSelectedObject"]["name"], modesSrvc["getMode"](envSrvc["oSelectedMode"]["mode_id"]));
        var sSaveMode = envSrvc["sMode"];
        // Paramètres de l'onglet.
        envSrvc["oSelectedObject"] = {
            "actions": [],
            "columns": [],
            "mode_id": oSaveSelectedObject["mode_id"],
            "name": oSaveSelectedObject["name"] + "_available_layers",
            "ressource_id": "vmap/layers",
            "sections": "",
            "template_name": ""
        };
        envSrvc["sMode"] = "search";
        scope['sSelectedObjectName'] = envSrvc["oSelectedObject"]["name"];

        // Paramétrage du module ui-grid
        scope["gridOptions"] = {
            "enableRowSelection": true,
            "enableSelectAll": true,
            "enablePagination": true,
            "enablePaginationControls": false,
            "useExternalPagination": true,
            "paginationPageSize": 100,
            "enableColumnMenus": false,
            "enableColumnResizing": true,
            //"enableColumnMoving": true,
            "paginationPageSizes": [10, 20, 50, 100],
            "appHeader": true,
            "appHeaderTitleBar": true,
            "appHeaderSearchForm": true,
            "appHeaderOptionBar": false,
            "appLoadGridData": true,
            "appGridTitle": "TITLE_GRID_AVAILABLE_LAYERS_VMAP_MAP_MAP_LAYERS",
            "appResizeGrid": true,
            "appFooter": true,
            "appShowPagination": true,
            "appActions": []
        };
        // Id de traduction des libellés des colonnes de la liste.
        var aTranslationsId = ["FORM_MAP_ID_VMAP_MAP_MAP",
            "FORM_NAME_VMAP_MAP_MAP",
            "FORM_THEME_VMAP_MAP_MAP",
            "FORM_COORDINATE_SYSTEM_VMAP_MAP_LAYER",
            "FORM_DESCRIPTION_VMAP_MAP_LAYER"
        ];

        // Définition des colonnes de la liste.
        $translate(aTranslationsId).then(function (aTranslations) {
            scope["gridOptions"]["columnDefs"] = [
                {"name": aTranslations["FORM_MAP_ID_VMAP_MAP_MAP"], "displayName": aTranslations["FORM_MAP_ID_VMAP_MAP_MAP"], "field": "layer_id", "width": 50, "enableSorting": true, "type": "number", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "vmap_map_layers_" + envSrvc["oSelectedObject"]["name"] + "_layer_id"},
                {"name": aTranslations["FORM_NAME_VMAP_MAP_MAP"], "displayName": aTranslations["FORM_NAME_VMAP_MAP_MAP"], "field": "name", "width": 380, "enableSorting": true, "type": "string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "vmap_map_layers_" + envSrvc["oSelectedObject"]["name"] + "_name", "sort": {"direction": uiGridConstants["ASC"], "ignoreSort": true, "priority": 0}},
                {"name": aTranslations["FORM_THEME_VMAP_MAP_MAP"], "displayName": aTranslations["FORM_THEME_VMAP_MAP_MAP"], "field": "theme_name", "width": 200, "enableSorting": true, "type": "string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "vmap_map_layers_" + envSrvc["oSelectedObject"]["name"] + "_theme_name"},
                {"name": aTranslations["FORM_DESCRIPTION_VMAP_MAP_LAYER"], "displayName": aTranslations["FORM_DESCRIPTION_VMAP_MAP_LAYER"], "field": "description", "width": 150, "enableSorting": true, "type": "string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "vmap_map_layers_" + envSrvc["oSelectedObject"]["name"] + "_crs_list", "cellTemplate": '<div data-app-layer-description-column="{{row.entity[col.field]}}"></div>'}
            ];
        });

        // Boutons de la liste.
        if (envSrvc["sMode"] != "display") {
            $translate(["BTN_ADD_VMAP_MAP_MAP_LAYERS"]).then(function (oTranslations) {
                scope["gridOptions"]["appActions"] = [
                    {
                        "label": oTranslations["BTN_ADD_VMAP_MAP_MAP_LAYERS"],
                        "name": scope["sSelectedObjectName"] + "_add_layer_btn",
                        "event": "addLayersToMap()"
                    }
                ];
            });
        }

        // Calques à exclure (ceux associées à la carte).
        var aRows = envSrvc["oGridOptions"][oSaveSelectedObject["name"]]["data"];
        if (aRows.length > 0) {
            var i = 0, aLayersId = [];
            while (i < aRows.length) {
                aLayersId.push(aRows[i]["layer_id"]);
                i++;
            }
            //scope["gridOptions"]["aFilter"] = ["layer_id NOT IN(" + aLayersId.join(",") + ")"];
            envSrvc["oSelectedObject"]["filter"] = ["layer_id NOT IN(" + aLayersId.join(",") + ")"];
        }

        // Affichage de la fenêtre modale.
        var sContainerId = "container_" + envSrvc["oSelectedObject"]["name"] + "_available_layers";
        var oOptions = {
            "className": "dialog-modal-window dialog-modal-window-workspace-list dialog-modal-window-available-layers",
            "message": '<div id="' + sContainerId + '" class="col-xs-12"></div>'
        };

        scope["modalWindow"]("dialog", null, oOptions).then(function (oDialog) {
            // Attends la fin de l'affichage de la fenêtre modale.
            $(oDialog).on('shown.bs.modal', function (e) {
                // 
                var oModalContainer = document.querySelector(".dialog-modal-window-available-layers > .modal-dialog");
                oModalContainer.className = oModalContainer.className + " modal-lg";
                // Compile le template de la liste.
                var sTemplateUrl = 'templates/workspaceListTpl.html';
                $templateRequest(sTemplateUrl).then(function (sTemplate) {
                    $compile($("#" + sContainerId).html(sTemplate).contents())(scope);
                });
            });
            // Attends la fermeture de la fenêtre modale.
            $(oDialog).on('hide.bs.modal', function (e) {
                // Restaure l'ancien onglet sauvé.
                envSrvc["oSelectedObject"] = oSaveSelectedObject;
                envSrvc["sMode"] = sSaveMode;
                // Recharge la liste des calques associés à la carte.
                scope.$root["refreshGrid"](scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["grid"]["appScope"], envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]);
            });
        });
    };

    /**
     * setMapLayerVisibility function.
     * Définition de la visibilité d'un calque associé à une carte.
     * @param {boolean} bVisibility Visibilité du calque (T/F).
     **/
    angular.element(vitisApp.appMainDrtv).scope()['setMapLayerVisibility'] = function (bVisibility) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
        var Restangular = angular.element(vitisApp.appMainDrtv).injector().get(["Restangular"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("setMapLayerVisibility");
        var scope = this;
        var oParams = {
            "token": sessionSrvc["token"],
            "visibility": "" + bVisibility,
            "map_id": envSrvc["sId"]
        };
        // Liste des calques sélectionnés.
        var aSelectedRows = scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["selection"]["getSelectedRows"]();
        if (aSelectedRows.length > 0) {
            var i = 0, aLayersId = [];
            while (i < aSelectedRows.length) {
                aLayersId.push(aSelectedRows[i]["layer_id"]);
                i++;
            }
            oParams["map_layers"] = aLayersId.join("|");
            //
            var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vmap", "maplayers");
            oWebServiceBase["customPUT"](oParams, envSrvc["sId"] + "/visibility", {"token": sessionSrvc["token"]}).then(function (data) {
                if (data["status"] == 0) {
                    var oOptions = {
                        "className": "modal-danger",
                        "message": data["errorMessage"]
                    };
                    scope["modalWindow"]("dialog", "ERROR_MAP_LAYER_VISIBILITY_VMAP_MAP_MAP_LAYERS", oOptions);
                } else {
                    // Efface la sélection.
                    scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["selection"]["clearSelectedRows"]();
                    // Recharge la liste.
                    scope["refreshGrid"](scope, scope["gridOptions"]);
                    // Affichage du message de succés.
                    $translate("SUCCESSFUL_OPERATION").then(function (sTranslation) {
                        $.notify(sTranslation, "success");
                    });
                }
            });
        }
    };

    /**
     * addLayersToMap function.
     * Association d'une liste de calques à une carte.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['addLayersToMap'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
        var Restangular = angular.element(vitisApp.appMainDrtv).injector().get(["Restangular"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("addLayersToMap");
        var scope = this;
        var oParams = {
            "token": sessionSrvc["token"],
            "map_id": envSrvc["sId"]
        };
        // Liste des calques sélectionnés.
        var aSelectedRows = scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["selection"]["getSelectedRows"]();
        if (aSelectedRows.length > 0) {
            var i = 0, aLayersId = [];
            while (i < aSelectedRows.length) {
                aLayersId.push(aSelectedRows[i]["layer_id"]);
                i++;
            }
            oParams["map_layers"] = aLayersId.join("|");
            //
            var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vmap", "maplayers");
            oWebServiceBase["customPUT"](oParams, envSrvc["sId"], {"token": sessionSrvc["token"]}).then(function (data) {
                if (data["status"] == 0) {
                    var oOptions = {
                        "className": "modal-danger",
                        "message": data["errorMessage"]
                    };
                    scope["modalWindow"]("dialog", "ERROR_ADD_MAP_LAYERS_VMAP_MAP_MAP_LAYERS", oOptions);
                } else {
                    // Efface la sélection.
                    //scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["selection"]["clearSelectedRows"]();
                    // Recharge la liste.
                    //scope["refreshGrid"](scope, scope["gridOptions"]);
                    //
                    bootbox["hideAll"]();
                    // Affichage du message de succés.
                    $translate("SUCCESSFUL_OPERATION").then(function (sTranslation) {
                        $.notify(sTranslation, "success");
                    });
                }
            });
        }
    };

    /**
     * deleteMapLayers function.
     * Suppression des calques associés à la carte.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['deleteMapLayers'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
        var Restangular = angular.element(vitisApp.appMainDrtv).injector().get(["Restangular"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("deleteMapLayers");
        var scope = this;
        var oParams = {
            "token": sessionSrvc["token"],
            "map_id": envSrvc["sId"]
        };
        // Liste des calques sélectionnés.
        var aSelectedRows = scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["selection"]["getSelectedRows"]();
        if (aSelectedRows.length > 0) {
            var i = 0, aLayersId = [];
            while (i < aSelectedRows.length) {
                aLayersId.push(aSelectedRows[i]["layer_id"]);
                i++;
            }
            oParams["idList"] = aLayersId.join("|");
            // Suppression.
            var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vmap", "maplayers");
            oWebServiceBase["customDELETE"](envSrvc["sId"], oParams).then(function (data) {
                if (data["status"] == 0) {
                    var oOptions = {
                        "className": "modal-danger",
                        "message": data["errorMessage"]
                    };
                    scope["modalWindow"]("dialog", "ERROR_DELETE_MAP_LAYER_VMAP_MAP_MAP_LAYERS", oOptions);
                } else {
                    // Efface la sélection.
                    scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["selection"]["clearSelectedRows"]();
                    // Recharge la liste.
                    scope["refreshGrid"](scope, scope["gridOptions"]);
                    // Affichage du message de succés.
                    $translate("SUCCESSFUL_OPERATION").then(function (sTranslation) {
                        $.notify(sTranslation, "success");
                    });
                }
            });
        }
    };

    /**
     * changeMapLayerSorting function.
     * Change l'ordre des calques sélectionnés d'une carte.
     * @param {string} sDirection Sens de déplacement des calques sélectionnés ("up"/"down").
     **/
    angular.element(vitisApp.appMainDrtv).scope()['changeMapLayerSorting'] = function (sDirection) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
        var Restangular = angular.element(vitisApp.appMainDrtv).injector().get(["Restangular"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("changeMapLayerSorting");
        var scope = this;
        var oParams = {
            "token": sessionSrvc["token"],
            "map_id": envSrvc["sId"]
        };
        // Liste des calques sélectionnés.
        var oGridApi = scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]];
        var oGridOptions = envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]];
        var aSelectedRows = oGridApi["selection"]["getSelectedRows"]();
        if (aSelectedRows.length > 0) {
            var bUpdateMapLayersIndex = false;
            // Index des calques dont l'ordre change.
            var i = 0, aLayersIndex = [];
            while (i < aSelectedRows.length) {
                oGridOptions["data"].forEach(function (oRow, iIndex) {
                    if (oRow["$$hashKey"] == aSelectedRows[i]["$$hashKey"])
                        aLayersIndex.push(iIndex);
                });
                i++;
            }
            // Change l'ordre des calques sélectionnés vers le haut.
            if (sDirection == "up") {
                aLayersIndex.forEach(function (iLayerIndex, iIndex) {
                    var oRow;
                    if (iLayerIndex > 0 && iLayerIndex > iIndex) {
                        oRow = oGridOptions["data"].splice(iLayerIndex, 1);
                        oGridOptions["data"].splice(iLayerIndex - 1, 0, oRow[0]);
                        bUpdateMapLayersIndex = true;
                    }
                });
            }
            // Change l'ordre des calques sélectionnés vers le bas.
            aLayersIndex.reverse();
            if (sDirection == "down") {
                aLayersIndex.forEach(function (iLayerIndex, iIndex) {
                    var oRow;
                    if (iLayerIndex < oGridOptions["data"].length - 1 && iLayerIndex < oGridOptions["data"].length - 1 - iIndex) {
                        oRow = oGridOptions["data"].splice(iLayerIndex, 1);
                        oGridOptions["data"].splice(iLayerIndex + 1, 0, oRow[0]);
                        bUpdateMapLayersIndex = true;
                    }
                });
            }
            // Sauve la liste des id des calques.
            var i = 0, aLayersId = [];
            while (i < oGridOptions["data"].length) {
                aLayersId.push(oGridOptions["data"][i]["layer_id"]);
                i++;
            }
            oParams["map_layers"] = aLayersId.join("|");

            // Mise à jour de l'index des calques de la carte dans la base.
            if (bUpdateMapLayersIndex)
                scope.$root["updateMapLayerSorting"]();
        }
    };

    /**
     * updateMapLayerSorting function.
     * Change l'ordre des calques sélectionnés d'une carte.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['updateMapLayerSorting'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var Restangular = angular.element(vitisApp.appMainDrtv).injector().get(["Restangular"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("updateMapLayerSorting");
        var scope = this;
        var oParams = {
            "token": sessionSrvc["token"],
            "map_id": envSrvc["sId"]
        };
        // Sauve la liste des id des calques.
        var oGridOptions = envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]];
        var i = 0, aLayersId = [];
        for (var i = oGridOptions["data"].length - 1; i >= 0; i--) {
            aLayersId.push(oGridOptions["data"][i]["layer_id"]);
        }

        oParams["map_layers"] = aLayersId.join("|");

        // Mise à jour de l'index des calques de la carte dans la base.
        var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vmap", "maplayers");
        oWebServiceBase["customPUT"](oParams, envSrvc["sId"] + "/sorting", {"token": sessionSrvc["token"]}).then(function (data) {
            // Erreur ?
            if (data["status"] == 0) {
                var oOptions = {
                    "className": "modal-danger",
                    "message": data["errorMessage"]
                };
                scope["modalWindow"]("dialog", "ERROR_ADD_MAP_LAYERS_VMAP_MAP_MAP_LAYERS", oOptions);
            }
        });
    };

    /**
     * appLayerThemeDescriptionColumn directive.
     * Mise en forme de la colonne "description" dans la liste de l'onglet "Thèmes des calques".
     * @param {service} $translate Translate service.
     * @ngInject
     **/
    vitisApp.appLayerThemeDescriptionColumnDrtv = function ($translate) {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appLayerThemeDescriptionColumn", function (value) {
                    // Si le champ est vide : supprime l'icône.  
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        // Classes css (ui-grid + spécifiques).
                        element[0].className = "ui-grid-cell-contents info-icon";
                        // Traduction du titre et du contenu.
                        $translate(["DESCRIPTION_TOOLTIP_TITLE_VMAP_MAP_LAYER_THEME"]).then(function (translations) {
                            // Création du "tooltip".
                            $(element)["popover"]({
                                "trigger": "hover",
                                "container": "body",
                                "title": function () {
                                    return translations["DESCRIPTION_TOOLTIP_TITLE_VMAP_MAP_LAYER_THEME"];
                                },
                                "content": function () {
                                    return scope["row"]["entity"][scope["col"]["field"]];
                                },
                                // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                                "placement": function (oPopoverNode, oElementNode) {
                                    return scope.$root["workspaceTooltipPlacement"](oElementNode);
                                },
                                "html": true
                            });
                        });
                    }
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime le tooltip.
                    $(element)["popover"]("destroy");
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive("appLayerThemeDescriptionColumn", vitisApp.appLayerThemeDescriptionColumnDrtv);

    /**
     * appMapThemeDescriptionColumn directive.
     * Mise en forme de la colonne "description" dans la liste de l'onglet "Thèmes des calques".
     * @param {service} $translate Translate service.
     * @ngInject
     **/
    vitisApp.appMapThemeDescriptionColumnDrtv = function ($translate) {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appMapThemeDescriptionColumn", function (value) {
                    // Si le champ est vide : supprime l'icône.  
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        // Classes css (ui-grid + spécifiques).
                        element[0].className = "ui-grid-cell-contents info-icon";
                        // Traduction du titre et du contenu.
                        $translate(["DESCRIPTION_TOOLTIP_TITLE_VMAP_MAP_MAP_THEME"]).then(function (translations) {
                            // Création du "tooltip".
                            $(element)["popover"]({
                                "trigger": "hover",
                                "container": "body",
                                "title": function () {
                                    return translations["DESCRIPTION_TOOLTIP_TITLE_VMAP_MAP_MAP_THEME"];
                                },
                                "content": function () {
                                    return scope["row"]["entity"][scope["col"]["field"]];
                                },
                                // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                                "placement": function (oPopoverNode, oElementNode) {
                                    return scope.$root["workspaceTooltipPlacement"](oElementNode);
                                },
                                "html": true
                            });
                        });
                    }
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime le tooltip.
                    $(element)["popover"]("destroy");
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive("appMapThemeDescriptionColumn", vitisApp.appMapThemeDescriptionColumnDrtv);

    /**
     * appModuleDescriptionColumn directive.
     * Mise en forme de la colonne "description" dans la liste de l'onglet "Modules".
     * @param {service} $translate Translate service.
     * @ngInject
     **/
    vitisApp.appModuleDescriptionColumnDrtv = function ($translate) {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appModuleDescriptionColumn", function (value) {
                    // Si le champ est vide : supprime l'icône.
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        // Classes css (ui-grid + spécifiques).
                        element[0].className = "ui-grid-cell-contents info-icon";
                        // Traduction du titre et du contenu.
                        $translate(["DESCRIPTION_TOOLTIP_TITLE_VMAP_MAP_MAP"]).then(function (translations) {
                            // Création du "tooltip".
                            $(element)["popover"]({
                                "trigger": "hover",
                                "container": "body",
                                "title": function () {
                                    return translations["DESCRIPTION_TOOLTIP_TITLE_VMAP_MAP_MAP"];
                                },
                                "content": function () {
                                    return scope["row"]["entity"][scope["col"]["field"]];
                                },
                                // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                                "placement": function (oPopoverNode, oElementNode) {
                                    return scope.$root["workspaceTooltipPlacement"](oElementNode);
                                },
                                "html": true
                            });
                        });
                    }
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime le tooltip.
                    $(element)["popover"]("destroy");
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive("appModuleDescriptionColumn", vitisApp.appModuleDescriptionColumnDrtv);

    /**
     * loadVmapUser function.
     * Chargement de la section "Vmap" dans l'onglet "Utilisateurs" (mode "Utilisateurs").
     **/
    angular.element(vitisApp.appMainDrtv).scope()['loadVmapUser'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("loadVmapUser");
        // Surcharge l'url du formulaire des utilisateurs de Vmap.
        var scope = this;
        var sTable = envSrvc["oSelectedObject"]["name"];
        scope["oFormRequestParams"] = {
            "sUrl": "modules/vmap/forms/" + envSrvc["oSelectedMode"]["mode_id"] + "/" + sTable + "_" + envSrvc["oSectionForm"][sTable]["sections"][envSrvc["oSectionForm"][sTable]["iSelectedSectionIndex"]]["name"] + ".json"
        };
    };

    /**
     * beforeVmapAdminPrintVmapAdminTemplateEdition function.
     * Chargement de l'onglet "Modèles" (mode "Impressions").
     **/
    angular.element(vitisApp.appMainDrtv).scope()['beforeVmapAdminPrintVmapAdminTemplateEdition'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        //
        $log.info("beforeVmapAdminPrintVmapAdminTemplateEdition");
        /*
         if (envSrvc["sMode"] != "display") {
         var scope = this;
         // Attends la fin du chargement de la définition du formulaire.
         var clearListener = scope.$root.$on('endFormNgRepeat', function (event, sFormDefinitionName) {
         var oWebServiceFormElement = document.querySelector("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] select[name='web_service_id']");
         var oWebService = formSrvc["getFormElementDefinition"]("web_service_id", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
         var oRessource = formSrvc["getFormElementDefinition"]("ressource", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
         var oWebServiceParams = {
         "ressource_id": "vitis/webservices",
         "id_key": "name",
         "label_key": "name",
         "parameters": {
         "attributs": "name"
         }
         };
         
         // Web service et ressource sélectionnés.
         if (envSrvc["sMode"] == "update") {
         var sRessourceId = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["ressource_id"];
         if (goog.isDefAndNotNull(sRessourceId)) {
         if (sRessourceId != "") {
         var aRessourceId = sRessourceId.split("/");
         oWebService["default_value"] = aRessourceId[0];
         oRessource["default_value"] = aRessourceId[1];
         oRessource["web_service"] = angular.copy(oWebServiceParams);
         oRessource["web_service"]["ressource_id"] += "/" + aRessourceId[0] + "/ressources";
         }
         }
         }
         
         // Charge les ressources du service sélectionné.
         oWebServiceFormElement.addEventListener("change", function () {
         oRessource["web_service"] = angular.copy(oWebServiceParams);
         oRessource["web_service"]["ressource_id"] += "/" + envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["web_service_id"]["selectedOption"]["value"] + "/ressources";
         oWebService["child_select"] = "ressource";
         formSrvc["reloadSelectField"](oWebService, envSrvc["sFormDefinitionName"], envSrvc["oFormValues"], envSrvc["oFormDefinition"]);
         });
         // Supprime le "listener".
         clearListener();
         });
         }
         */
    };

    /**
     * beforeVmapAdminTemplateSubmit function.
     * Traitements avant l'envoi d'un form. de l'onglet "Modèles" (mode "Impressions").
     **/
    angular.element(vitisApp.appMainDrtv).scope()['beforeVmapAdminTemplateSubmit'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $q = angular.element(vitisApp.appMainDrtv).injector().get(["$q"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        //
        $log.info("beforeVmapAdminTemplateSubmit");
        /*
         var formScope = angular.element("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "']").scope();
         var oEditor = formScope["oCodeMirrorEditor"]["definition"];
         var deferred = $q.defer();
         var promise = deferred.promise;
         if (oEditor["getDoc"]()["getValue"]() != "")
         deferred.resolve();
         return promise;
         */
        /*
         var scope = this;
         var sRessourceId = "";
         var oWebServiceId = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["web_service_id"];
         var oRessource = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["ressource"];
         // Sauve la ressource dans le champ caché.
         if (oWebServiceId["selectedOption"]["value"] != "" && oRessource["selectedOption"]["value"] != "")
         sRessourceId = oWebServiceId["selectedOption"]["value"] + "/" + oRessource["selectedOption"]["value"];
         envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["ressource_id"] = sRessourceId;
         */
    };

    /**
     * appPrintParameterPlaceholderColumn directive.
     * Mise en forme de la colonne "placeholder" dans la liste de l'onglet "Paramètres" (impression).
     * @param {service} $translate Translate service.
     * @ngInject
     **/
    vitisApp.appPrintParameterPlaceholderColumnDrtv = function ($translate) {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appPrintParameterPlaceholderColumn", function (value) {
                    // Si le champ est vide : supprime l'icône.
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        // Classes css (ui-grid + spécifiques).
                        element[0].className = "ui-grid-cell-contents info-icon";
                        // Traduction du titre et du contenu.
                        $translate(["PLACEHOLDER_TOOLTIP_TITLE_VMAP_PRINT_PARAMETER"]).then(function (translations) {
                            // Création du "tooltip".
                            $(element)["popover"]({
                                "trigger": "hover",
                                "container": "body",
                                "title": function () {
                                    return translations["PLACEHOLDER_TOOLTIP_TITLE_VMAP_PRINT_PARAMETER"];
                                },
                                "content": function () {
                                    return scope["row"]["entity"][scope["col"]["field"]];
                                },
                                // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                                "placement": function (oPopoverNode, oElementNode) {
                                    return scope.$root["workspaceTooltipPlacement"](oElementNode);
                                },
                                "html": true
                            });
                        });
                    }
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime le tooltip.
                    $(element)["popover"]("destroy");
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive("appPrintParameterPlaceholderColumn", vitisApp.appPrintParameterPlaceholderColumnDrtv);

    /**
     * appPrintParameterDefaultValueColumn directive.
     * Mise en forme de la colonne "defaultvalue" dans la liste de l'onglet "Paramètres" (impression).
     * @param {service} $translate Translate service.
     * @ngInject
     **/
    vitisApp.appPrintParameterDefaultValueColumnDrtv = function ($translate) {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appPrintParameterDefaultValueColumn", function (value) {
                    // Si le champ est vide : supprime l'icône.
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        // Classes css (ui-grid + spécifiques).
                        element[0].className = "ui-grid-cell-contents info-icon";
                        // Traduction du titre et du contenu.
                        $translate(["PLACEHOLDER_TOOLTIP_TITLE_VMAP_PRINT_PARAMETER"]).then(function (translations) {
                            // Création du "tooltip".
                            $(element)["popover"]({
                                "trigger": "hover",
                                "container": "body",
                                "title": function () {
                                    return translations["PLACEHOLDER_TOOLTIP_TITLE_VMAP_PRINT_PARAMETER"];
                                },
                                "content": function () {
                                    return scope["row"]["entity"][scope["col"]["field"]];
                                },
                                // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                                "placement": function (oPopoverNode, oElementNode) {
                                    return scope.$root["workspaceTooltipPlacement"](oElementNode);
                                },
                                "html": true
                            });
                        });
                    }
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime le tooltip.
                    $(element)["popover"]("destroy");
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive("appPrintParameterDefaultValueColumn", vitisApp.appPrintParameterDefaultValueColumnDrtv);

    /**
     * appMapLayersOpacityColumn directive.
     * Mise en forme de la colonne "layer_opacity" dans la liste de la section "Calques de la carte" (Cartes).
     * @ngInject
     **/
    vitisApp.appMapLayersOpacityColumnDrtv = function () {
        return {
            link: function (scope, element, attrs) {
                // Mise à jour des données si l'ordre change.
                var clearObserver = attrs.$observe("appMapLayersOpacityColumn", function (value) {
                    // Opacité et id du calque dans le champ de form. de type "number".
                    var oOpacityElement = element[0].querySelector("input[type='number']");
                    oOpacityElement.value = scope["row"]["entity"][scope["col"]["field"]];
                    oOpacityElement.setAttribute("data-layer-id", scope["row"]["entity"]["layer_id"]);
                });
                // Mise à jour de l'opacité du calque dans la base.
                element[0].querySelector("input[type='number']").addEventListener("change", scope.$root["setMapLayerOpacity"]);
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime l'observateur.
                    clearObserver();
                    // 
                    element[0].querySelector("input[type='number']").removeEventListener("change", scope.$root["setMapLayerOpacity"]);
                });
            }
        }
    };
    vitisApp["compileProvider"].directive("appMapLayersOpacityColumn", vitisApp.appMapLayersOpacityColumnDrtv);

    /**
     * setMapLayerOpacity function.
     * Mise à jour de l'opacité du calque d'une carte dans la base.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['setMapLayerOpacity'] = function (oEvent) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var Restangular = angular.element(vitisApp.appMainDrtv).injector().get(["Restangular"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);

        $log.info("setMapLayerOpacity");
        var scope = angular.element(vitisApp.appMainDrtv).scope();
        // 0 >= Opacité >= 100
        var iOpacity = parseInt(oEvent["target"].value);
        if (iOpacity < 0)
            iOpacity = 0;
        else if (iOpacity > 100)
            iOpacity = 100;
        oEvent["target"].value = iOpacity;
        //
        var oParams = {
            "token": sessionSrvc["token"],
            "map_id": envSrvc["sId"],
            "layer_id": oEvent["target"].getAttribute("data-layer-id"),
            "layer_opacity": iOpacity
        };
        // Mise à jour de l'opacité du calque de la carte dans la base.
        var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vmap", "maplayers");
        oWebServiceBase["customPUT"](oParams, envSrvc["sId"] + "/opacity", {"token": sessionSrvc["token"]}).then(function (data) {
            // Erreur ?
            if (data["status"] == 0) {
                var oOptions = {
                    "className": "modal-danger",
                    "message": data["errorMessage"]
                };
                scope["modalWindow"]("dialog", "ERROR_ADD_MAP_LAYERS_VMAP_MAP_MAP_LAYERS", oOptions);
            } else {
                // Recharge la liste des calques associés à la carte.
                scope.$root["refreshGrid"](scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["grid"]["appScope"], envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]);
            }
        });
    };

    /**
     * Init the openlayers field to bind the extent
     */
    angular.element(vitisApp.appMainDrtv).scope()['initOLMapExtent'] = function () {

        var $log = angular.element(vitisApp.appMainDrtv).injector().get(['$log']);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        $log.info('initOLMapExtent');

        setTimeout(function () {

            var oMap = angular.element($('#vmap_map_map_extent')).scope()['oMap'].MapObject;

            // Centre la composant ol sur la projection à utiliser
            angular.element(vitisApp.appMainDrtv).scope()['updateOLMapExtent']();

            // Re-calcule l'étendue lors de chaque mouvement de la carte
            oMap.on('moveend', function () {
                angular.element(vitisApp.appMainDrtv).scope()['updateExtent']();
            });

            var oCrsSelecteorFormElement = document.querySelector("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] select[name='crs_id']");
            oCrsSelecteorFormElement.addEventListener("change", function () {
                angular.element(vitisApp.appMainDrtv).scope()['updateExtent']();
            });

        }, 1000);
    };

    /**
     * updateExtent function.
     * Mise à jour de l'étendue avec les données du champ openlayers.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['updateExtent'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(['$log']);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['envSrvc']);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['formSrvc']);

        $log.info('updateExtent');

        // Définition de l'élément de la carte openlayers
        var oMapExtentDefinition = formSrvc['getFormElementDefinition']('map_extent', envSrvc['sFormDefinitionName'], envSrvc['oFormDefinition']);
        //
        var aExtent = [];
        var aMapExtent = oMapExtentDefinition['map_options']['center']['extent'];


        // Reprojection de l'étendue
        var oMap = angular.element($('#vmap_map_map_extent')).scope()['oMap'].MapObject;

        var mapProj = oMap.getView().getProjection().getCode();
        var destinationProj = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['crs_id']['selectedOption']['value'];

        var projectedExtent = ol.proj.transformExtent(aMapExtent, mapProj, destinationProj);

        projectedExtent.forEach(function (coord) {
            aExtent.push(Math.round(coord));
        });

        // Met à jour l'étendue dans le champ 'Etendue'.
        envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['extent'] = aExtent.join('|');

        var updateFormScope = angular.element($('[name=vmap_map_update_form]')).scope();
        var insertFormScope = angular.element($('[name=vmap_map_insert_form]')).scope();

        if (goog.isDefAndNotNull(updateFormScope)) {
            updateFormScope.$apply();
        }
        if (goog.isDefAndNotNull(insertFormScope)) {
            insertFormScope.$apply();
        }
    };

    /**
     * updateOLMapExtent function.
     * Mise à jour de l'étendue du champ openLayers à partir des données du formulaire
     */
    angular.element(vitisApp.appMainDrtv).scope()['updateOLMapExtent'] = function () {

        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(['$log']);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['envSrvc']);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(['formSrvc']);

        $log.info('updateOLMapExtent');

        if (!goog.isDefAndNotNull(envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['extent'])) {
            angular.element(vitisApp.appMainDrtv).scope()["updateExtent"]();
            return 0;
        }

        // Définition de l'élément de la carte openlayers
        var oMapExtentDefinition = formSrvc['getFormElementDefinition']('map_extent', envSrvc['sFormDefinitionName'], envSrvc['oFormDefinition']);

        // Etendue à utiliser par l'objet openLayers
        var aMapExtent = oMapExtentDefinition['map_options']['center']['extent'];

        // objet openLayers
        var oMap = angular.element($('#vmap_map_map_extent')).scope()['oMap'].MapObject;

        // Étendue du formulaire
        var aFormExtent = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['extent'].split('|');

        for (var i = 0; i < aFormExtent.length; i++) {
            aFormExtent[i] = parseFloat(aFormExtent[i]);
        }

        // Projection du champ ol
        var sMapProj = oMap.getView().getProjection().getCode();

        // Projection utilisée dans le formulaire
        var sFormProj = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['crs_id']['selectedOption']['value'];

        // Étendue reprojetée
        var projectedExtent = ol.proj.transformExtent(aFormExtent, sFormProj, sMapProj);

        oMap.getView().fit(projectedExtent, oMap.getSize(), {nearest: true});
    };

    /**
     * showAddLayersToLayerModalWindow function.
     * Affichage de la liste des calques depuis un getCapabilities() dans une fenêtre modale (onglet "calques").
     **/
    angular.element(vitisApp.appMainDrtv).scope()['showAddLayersToLayerModalWindow'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $translate = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$translate"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);

        //
        $log.info("showAddLayersToLayerModalWindow");

        var this_ = this;
        var sParentFormDefinitionName = envSrvc["sFormDefinitionName"];
        var scope = this.$new();

        $translate(["BTN_ADD_LAYERS_VMAP_MAP_LAYER"]).then(function (oTranslations) {
            var sServiceUrl = envSrvc["oFormValues"][sParentFormDefinitionName]["service_url"];
            sServiceUrl = sServiceUrl.replace("[token]", sessionSrvc["token"]);
            sServiceUrl = sServiceUrl.replace("[ms_cgi_url]", propertiesSrvc["ms_cgi_url"]);
            this_['showLayerModalWindow']({
                'service_url': sServiceUrl,
                'buttons': [{
                        "label": oTranslations["BTN_ADD_LAYERS_VMAP_MAP_LAYER"],
                        "name": scope["sSelectedObjectName"] + "_add_layer_btn",
                        "event": "addLayersToLayer('" + sParentFormDefinitionName + "')"
                    }]
            });
        });
    };

    /**
     * showLayerModalWindow function.
     * Affichage de la liste des calques depuis un getCapabilities() dans une fenêtre modale (onglet "calques").
     * @param {object} opt_options
     * @param {object} opt_options.service_url
     * @param {object} opt_options.capabilities
     * @param {object} opt_options.buttons
     */
    angular.element(vitisApp.appMainDrtv).scope()['showLayerModalWindow'] = function (opt_options) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $http = angular.element(vitisApp.appMainDrtv).injector().get(["$http"]);
        var $compile = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$compile"]);
        var $templateRequest = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$templateRequest"]);
        var $translate = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$translate"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var uiGridConstants = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["uiGridConstants"]);
        var modesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["modesSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);

        var sParentFormDefinitionName = envSrvc["sFormDefinitionName"];

        opt_options = goog.isDefAndNotNull(opt_options) ? opt_options : {};
        var sServiceUrl = goog.isDefAndNotNull(opt_options['service_url']) ? opt_options['service_url'] : envSrvc["oFormValues"][sParentFormDefinitionName]["service_url"];
        var oCapabilities = goog.isDefAndNotNull(opt_options['capabilities']) ? opt_options['capabilities'] : null;
        var appActions = goog.isDefAndNotNull(opt_options['buttons']) ? opt_options['buttons'] : [];

        //
        $log.info("showLayerModalWindow");
        var scope = this.$new();
        // Sauve l'ancien onglet
        var oSaveSelectedObject = modesSrvc["getObject"](envSrvc["oSelectedObject"]["name"], modesSrvc["getMode"](envSrvc["oSelectedMode"]["mode_id"]));
        var sSaveMode = envSrvc["sMode"];
        // Paramètres de l'onglet.
        envSrvc["oSelectedObject"] = {
            "actions": [],
            "columns": [],
            "mode_id": oSaveSelectedObject["mode_id"],
            "name": oSaveSelectedObject["name"] + "_wms_layers",
            "sections": "",
            "template_name": ""
        };
        envSrvc["sMode"] = "search";
        scope['sSelectedObjectName'] = envSrvc["oSelectedObject"]["name"];
        scope["sFormDefinitionName"] = envSrvc["oSelectedObject"]["name"];
        envSrvc["sFormDefinitionName"] = scope["sFormDefinitionName"];

        // Paramétrage du module ui-grid
        scope["gridOptions"] = {
            "enableRowSelection": true,
            "enableSelectAll": true,
            "enablePagination": true,
            "enablePaginationControls": false,
            "useExternalPagination": true,
            "paginationPageSize": propertiesSrvc["rows_per_page"],
            "enableColumnMenus": false,
            "enableColumnResizing": true,
            //"enableColumnMoving": true,
            "paginationPageSizes": [10, 20, 50, 100],
            "appHeader": true,
            "appHeaderTitleBar": true,
            "appHeaderSearchForm": false,
            "appHeaderOptionBar": false,
            "appLoadGridData": false,
            "appGridTitle": "TITLE_GRID_VMAP_MAP_LAYER_WMS_LAYERS",
            "appResizeGrid": true,
            "appFooter": false,
            "appShowPagination": false,
            "appActions": []
        };
        // Id de traduction des libellés des colonnes de la liste.
        var aTranslationsId = [
            "FORM_NAME_VMAP_MAP_LAYER_WMS_LAYERS",
            "FORM_CRS_VMAP_MAP_LAYER_WMS_LAYERS",
            "FORM_DESCRIPTION_VMAP_MAP_LAYER_WMS_LAYERS"
        ];

        // Définition des colonnes de la liste.
        $translate(aTranslationsId).then(function (aTranslations) {
            scope["gridOptions"]["columnDefs"] = [
                {"name": aTranslations["FORM_NAME_VMAP_MAP_LAYER_WMS_LAYERS"], "displayName": aTranslations["FORM_NAME_VMAP_MAP_LAYER_WMS_LAYERS"], "field": "name", "width": 250, "enableSorting": true, "type": "string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "vmap_map_layers_" + envSrvc["oSelectedObject"]["name"] + "_name", "sort": {"direction": uiGridConstants["ASC"], "ignoreSort": true, "priority": 0}},
                {"name": aTranslations["FORM_DESCRIPTION_VMAP_MAP_LAYER_WMS_LAYERS"], "displayName": aTranslations["FORM_DESCRIPTION_VMAP_MAP_LAYER_WMS_LAYERS"], "field": "description", "width": 350, "enableSorting": true, "type": "string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "vmap_map_layers_" + envSrvc["oSelectedObject"]["name"] + "_crs_list"},
                {"name": aTranslations["FORM_CRS_VMAP_MAP_LAYER_WMS_LAYERS"], "displayName": aTranslations["FORM_CRS_VMAP_MAP_LAYER_WMS_LAYERS"], "field": "crs_list", "width": 180, "enableSorting": true, "type": "string", "enableColumnMoving": true, "enableColumnResizing": true, "headerCellClass": "vmap_map_layers_" + envSrvc["oSelectedObject"]["name"] + "_crs_list", "cellTemplate": '<div data-app-crs-list-description-column="{{row.entity[col.field]}}"></div>'}
            ];
        });

        // Boutons de la liste.
        $translate(["BTN_ADD_VMAP_MAP_MAP_LAYERS"]).then(function (oTranslations) {
            scope["gridOptions"]["appActions"] = appActions;
        });

        var fillModal = function (oCapabilities) {

            if (!goog.isDefAndNotNull(oCapabilities)) {
                return null;
            }
            if (!goog.isDefAndNotNull(oCapabilities['json'])) {
                return null;
            }
            if (!goog.isDefAndNotNull(oCapabilities['xml'])) {
                return null;
            }

            var aGridData = [];
            var aLayers = [];
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

            if (typeof (oCapabilities) != "undefined") {
                // Liste des calques.
                var aSelectedLayers = [];
                var sSelectedLayers = envSrvc["oFormValues"][sParentFormDefinitionName]["layer_list"];
                if (sSelectedLayers != null)
                    aSelectedLayers = sSelectedLayers.split(",");

                searchLayers(oCapabilities["json"]['Capability']['Layer']);
                for (var i = 0; i < aLayers.length; i++) {
                    // Exclusion des calques déja associés à la carte.
                    if (aSelectedLayers.indexOf(aLayers[i]["Name"]) == -1) {
                        aGridData.push({
                            "name": aLayers[i]["Name"],
                            "description": aLayers[i]["Title"],
                            "crs_list": goog.isDefAndNotNull(aLayers[i]["CRS"]) ? aLayers[i]["CRS"].join(",") : []
                        });
                    }
                }
            }
            // Réordonne les couches à afficher parnom
            goog.array.sortByKey(aGridData, function (elem) {
                return elem['name']
            });
            // Mise à jour de la liste ui-grid.
            scope["gridOptions"]["data"] = aGridData;
            scope["gridOptions"]["totalItems"] = aGridData.length;

            // Affichage de la fenêtre modale.
            var sContainerId = "container_" + envSrvc["oSelectedObject"]["name"] + "_wms_layers";
            var oOptions = {
                "className": "dialog-modal-window dialog-modal-window-workspace-list dialog-modal-window-wms_layers",
                "message": '<div id="' + sContainerId + '" class="col-xs-12"></div>'
            };
            scope["modalWindow"]("dialog", null, oOptions).then(function (oDialog) {
                // Attend la fin de l'affichage de la fenêtre modale.
                $(oDialog).on('shown.bs.modal', function (e) {
                    // 
                    var oModalContainer = document.querySelector(".dialog-modal-window-wms_layers > .modal-dialog");
                    oModalContainer.className = oModalContainer.className + " modal-lg";

                    // Compile le template
                    var sTemplateUrl = 'modules/vmap/template/vitis/serviceLayers.html';
                    $templateRequest(sTemplateUrl).then(function (sTemplate) {
                        $compile($("#" + sContainerId).html(sTemplate).contents())(scope);
                        var oServiceLayersScope = angular.element($("#" + sContainerId)).scope();

                        // Liste
                        var sTemplateUrl = 'templates/workspaceListTpl.html';
                        $templateRequest(sTemplateUrl).then(function (sTemplate) {
                            $compile($("#" + sContainerId).find("#service_layers_layers_list").html(sTemplate).contents())(scope);
                        });

                        // XML
                        if (goog.isDefAndNotNull(oServiceLayersScope)) {
                            oServiceLayersScope.$applyAsync(function () {
                                oServiceLayersScope['xml'] = oCapabilities['xml'];
                                oServiceLayersScope['codemirror_options'] = {
                                    'lineWrapping': true,
                                    'lineNumbers': true,
                                    'readOnly': 'nocursor',
                                    'mode': 'xml'
                                };
                            });
                            $("#" + sContainerId).find("#service_layers_capabilities_codemirror").find('.CodeMirror').css('height', '100%');
                        }

                        // OpenLayers
                        var bMapLoaded = false;
                        oServiceLayersScope['showOlMap'] = function () {
                            if (!bMapLoaded) {
                                $http.get('modules/vmap/forms/vmap_admin_map/vmap_admin_map_vmap_layers_openlayers_test.json').
                                        success(function (data, status, headers, config) {
                                            bMapLoaded = true;

                                            var oFormDefinition = data;
                                            var sFormDefinitionName = 'update';
                                            var oFormScope = angular.element($("#" + sContainerId).find('#service_layers_layers_ol_formreader').children()).scope();
                                            var oMap = oFormDefinition['update']['rows'][0]['fields'][0];

                                            var aProjections = [{
                                                    'extent': [-1901744.2199433097, 4779520.942381757, 2501744.2199433097, 7220479.057618243],
                                                    'projection': 'EPSG:3857'
                                                }, {
                                                    'extent': [-2648.2345550218597, 6231825.554877603, 7024177.333740164, 7024177.333740164],
                                                    'projection': 'EPSG:2154'
                                                }, {
                                                    'extent': [-4.6307373046875, 42.802734375, 51.0205078125, 51.0205078125],
                                                    'projection': 'EPSG:4326'
                                                }];
                                            var sUsedProjectionIndex = 0;

                                            for (var i = 0; i < aProjections.length; i++) {
                                                var bIsAllowedProj = true;
                                                for (var ii = 0; ii < aLayers.length; ii++) {
                                                    var aCrs = goog.isArray(aLayers[ii]['CRS']) ? aLayers[ii]['CRS'] : goog.isArray(aLayers[ii]['SRS']) ? aLayers[ii]['CRS'] : [];
                                                    if (aCrs.indexOf(aProjections[i]['projection']) === -1) {
                                                        bIsAllowedProj = false;
                                                    }
                                                }
                                                if (bIsAllowedProj) {
                                                    sUsedProjectionIndex = angular.copy(i);
                                                    break;
                                                }
                                            }

                                            oMap['map_options']['proj'] = aProjections[sUsedProjectionIndex]['projection'];
                                            oMap['map_options']['center'] = {'extent': aProjections[sUsedProjectionIndex]['extent']};
                                            oMap['map_options']['tree']['children'][0]['view'] = aProjections[sUsedProjectionIndex];

                                            var oChildrenService = {
                                                'name': 'Service WMS',
                                                'children': []
                                            };
                                            for (var i = 0; i < aLayers.length; i++) {
                                                // Définition de la couche.
                                                var oChildrenLayer = {
                                                    'name': aLayers[i]['Name'],
                                                    'layerType': 'imagewms',
                                                    'visible': false,
                                                    //'legend': 'true',
                                                    'select': true,
                                                    'url': sServiceUrl,
                                                    'params': {
                                                        'LAYERS': aLayers[i]['Name'],
                                                        'VERSION': '1.3.0',
                                                        'TIMESTAMP': new Date().getTime()
                                                    },
                                                    'index': i + 1
                                                };
                                                oChildrenService['children'].push(oChildrenLayer);
                                            }
                                            // Ajout du service
                                            oMap['map_options']['tree']['children'].push(oChildrenService);

                                            oMap['style']['height'] = $('#' + sContainerId).find('#service_layers_layers_ol').height() + 'px';

                                            // Affiche le layertree par défaut
                                            oFormScope['showMapLayerTree'] = function () {
                                                setTimeout(function () {
                                                    var oMapScope = angular.element($("#" + sContainerId).find('#service_layers_layers_ol_formreader').find('#layer_test_map')).scope();
                                                    oMapScope.$applyAsync(function () {
                                                        oMapScope['oMap']['bLayersTreeOpen'] = true;
                                                    });
                                                });
                                            };
                                            oFormDefinition['update']['initEvent'] = 'showMapLayerTree()';

                                            oFormScope['ctrl']['setDefinitionName'](sFormDefinitionName);
                                            oFormScope['ctrl']['setFormValues']({
                                                'display': {},
                                                'insert': {},
                                                'update': {}
                                            });

                                            oFormScope['ctrl']['setFormDefinition'](oFormDefinition);
                                            oFormScope['ctrl']['loadForm']();

                                        });
                            }
                        };
                    });

                });
                // Attends la fermeture de la fenêtre modale.
                $(oDialog).on('hide.bs.modal', function (e) {
                    // Restaure l'ancien onglet sauvé.
                    envSrvc["oSelectedObject"] = oSaveSelectedObject;
                    envSrvc["sMode"] = sSaveMode;
                    envSrvc["sFormDefinitionName"] = sParentFormDefinitionName;
                    // Supprime le scope crée.
                    scope.$destroy();
                });
            });
        };

        if (goog.isDefAndNotNull(oCapabilities)) {
            fillModal(oCapabilities);
        } else if (goog.isDefAndNotNull(sServiceUrl)) {
            // Calques du service wms.
            scope.$root["getCapabilities"](sServiceUrl).then(function (oGetCapabilities) {
                oCapabilities = oGetCapabilities;
                if (goog.isDefAndNotNull(oCapabilities)) {
                    if (goog.isDefAndNotNull(oCapabilities['xml']) && goog.isDefAndNotNull(oCapabilities['json'])) {
                        fillModal(oGetCapabilities);
                    }
                } else {
                    envSrvc["sFormDefinitionName"] = sParentFormDefinitionName;
                }
            });
        }
    };

    /**
     * getCapabilities function.
     * .
     * @param {string} sServiceUrl Url du service.
     * @param {object} oOptions Paramètres optionnels.
     * @return {object}
     **/
    angular.element(vitisApp.appMainDrtv).scope()['getCapabilities'] = function (sServiceUrl, oOptions) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $http = angular.element(vitisApp.appMainDrtv).injector().get(["$http"]);
        var $q = angular.element(vitisApp.appMainDrtv).injector().get(["$q"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);

        //
        $log.info("getCapabilities");
        var scope = this;
        // Promise pour retourner les données du getCapabilities.
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Paramètres par défaut.
        var oDefaultOptions = {
            "showErrorMessage": true
        };
        if (typeof (oOptions) == "undefined")
            oOptions = oDefaultOptions;
        else {
            goog.object.extend(oDefaultOptions, oOptions);
            oOptions = oDefaultOptions;
        }
        // Création de l'url vers le service.
        if (sServiceUrl.indexOf("?") === -1)
            sServiceUrl += "?";
        else
            sServiceUrl += "&";
        sServiceUrl += "service=wms&version=1.3.0&request=GetCapabilities&no_cache=" + new Date().getTime();

        var sUrl = propertiesSrvc['proxy_url'] + '?url=' + encodeURIComponent(sServiceUrl);

        var runRequest = function (sServiceUrl) {
            $http.get(sUrl)
                    .success(function (data, status, headers, config) {
                        var oGetCapabilities;
                        // Si aucun résultat renvoyé : erreur.
                        if (data == "") {
                            if (oOptions["showErrorMessage"]) {
                                var oWindowOptions = {
                                    "className": "modal-danger",
                                    "message": "ERROR_CONTENT_NO_DATA_VMAP_MAP_LAYER_WMS_LAYERS"
                                };
                                scope["modalWindow"]("dialog", "ERROR_TITLE_GET_CAPABILITIES_VMAP_MAP_LAYER_WMS_LAYERS", oWindowOptions);
                            }
                        } else {
                            // Sauve le résultat du GetCapabilities
                            oGetCapabilities = {
                                "xml": data
                            };
                            // Vérification du résultat.
                            var parser = new DOMParser();
                            var xmlDoc = parser.parseFromString(data, "text/xml");
                            if (xmlDoc.querySelector("WMS_Capabilities") === null) {
                                oGetCapabilities = null;
                                if (data['status'] == 0) {
                                    if (goog.isDefAndNotNull(data['sMessage'])) {
                                        var sErrorMessage = '<a href="' + sServiceUrl + '" target="_blank">' + sServiceUrl + '</a><br><br>';
                                        sErrorMessage += data['sMessage'];
                                    }
                                }
                                if (!goog.isDefAndNotNull(sErrorMessage)) {
                                    if (goog.isDefAndNotNull(xmlDoc.querySelector("BODY"))) {
                                        if (goog.isDefAndNotNull(xmlDoc.querySelector("BODY").textContent)) {
                                            var sErrorMessage = xmlDoc.querySelector("BODY").textContent;
                                        } else {
                                            var sErrorMessage = $(xmlDoc).find('body').html();
                                        }
                                    } else {
                                        var sErrorMessage = $(xmlDoc).find('body').html();
                                    }
                                }

                                // Affiche l'erreur.
                                if (oOptions["showErrorMessage"]) {
                                    var oWindowOptions = {
                                        "className": "modal-danger",
                                        "message": sErrorMessage
                                    };
                                    scope["modalWindow"]("dialog", "ERROR_TITLE_GET_CAPABILITIES_VMAP_MAP_LAYER_WMS_LAYERS", oWindowOptions);
                                }
                            } else {
                                // Parse le xml retourné par le getCapabilities du service.
                                var oParser = new ol.format.WMSCapabilities();
                                oGetCapabilities["json"] = oParser.read(data);
                            }
                        }
                        // Retourne les données du getCapabilities.
                        deferred.resolve(oGetCapabilities);
                    }).
                    error(function (data, status, headers, config) {
                    });
        };

        // Couche privée
        if (new RegExp(/\[token\]/).test(sServiceUrl)) {

            // remplace la token au cas où c'est un flux privé
            sServiceUrl = sServiceUrl.replace(/\[token\]/, sessionSrvc["token"]);

            $http({
                method: 'GET',
                url: propertiesSrvc["web_server_name"] + '/' + propertiesSrvc["services_alias"] + '/vm4ms/wmsservices/private/MapFile',
                params: {
                    'token': sessionSrvc["token"],
                    'creation': true,
                    'type': 'prod'
                }
            }).then(function successCallback(response) {

                runRequest(sServiceUrl);

            }, function errorCallback(response) {

            });

        } else {
            runRequest(sServiceUrl);
        }


        //
        return promise;
    };

    /**
     * addLayersToLayer function.
     * Association de calques sélectionnés à une calque dans une liste ui-grid (onglet "calques").
     * @param {string} sParentFormDefinitionName Nom du formulaire contenant la liste ui-grid à mettre à jour.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['addLayersToLayer'] = function (sParentFormDefinitionName) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("addLayersToLayer");
        var scope = this;
        var oParentGridOptions = angular.element("form[name='" + envSrvc["oFormDefinition"][sParentFormDefinitionName]["name"] + "'] .ui-grid-form-field-data").scope().$parent["gridOptions"];
        // Liste des calques sélectionnés.
        var aSelectedRows = scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["selection"]["getSelectedRows"]();
        if (aSelectedRows.length > 0) {
            var i = 0;
            // Calques déja associés.
            var aLayersName = envSrvc["oFormValues"][sParentFormDefinitionName]["layer_list"];
            if (typeof (aLayersName) == "string")
                aLayersName = aLayersName.split(",");
            else
                aLayersName = [];

            // Calques sélectionnée à concaténer.          
            for (var i = aSelectedRows.length - 1; i >= 0; i--) {
                delete aSelectedRows[i]["$$hashKey"];
                if (aLayersName.indexOf(aSelectedRows[i]["name"]) === -1) {
                    aLayersName.unshift(aSelectedRows[i]["name"]);
                } else {
                    $.notify('Calque déjà présent: ' + aSelectedRows[i]["name"], 'warning');
                    aSelectedRows.splice(i, 1);
                }
            }

            // Mise à jour de la liste ui-grid (formulaire parent).
            oParentGridOptions["data"] = oParentGridOptions["data"].concat(aSelectedRows);
            oParentGridOptions["totalItems"] = oParentGridOptions["data"].length;
            // Sauve le champ "layer_list" (liste des calques sélectionnés)
            envSrvc["oFormValues"][sParentFormDefinitionName]["layer_list"] = aLayersName.join(",");
            // Supprime les lignes sélectionnées.
            var aData = [];
            scope["gridOptions"]["data"].forEach(function (oRowData) {
                if (aSelectedRows.indexOf(oRowData) == -1)
                    aData.push(oRowData);
            });
            scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["selection"]["clearSelectedRows"]();
            scope["gridOptions"]["data"] = aData;
        }
    };

    /**
     * updateLayerLayersSorting function.
     * Change l'ordre des calques d'un calque.
     **/
    angular.element(vitisApp.appMainDrtv).scope()['updateLayerLayersSorting'] = function () {

        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);

        $log.info("updateLayerLayersSorting");

        var sParentFormDefinitionName = envSrvc["sFormDefinitionName"];

        if (!goog.isDefAndNotNull(envSrvc["oFormValues"][sParentFormDefinitionName])) {
            return 0;
        }

        var oGridOptions = angular.element("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] .ui-grid-form-field-data").scope().$parent["gridOptions"];
        var aGridData = oGridOptions["data"];
        if (aGridData.length > 0) {
            var aLayersName = [];
            for (var i = aGridData.length - 1; i >= 0; i--) {
                if (goog.isDefAndNotNull(aGridData[i]['name'])) {
                    aLayersName.push(aGridData[i]['name']);
                }
            }
            // Sauve le champ "layer_list" (liste des calques sélectionnés)
            envSrvc["oFormValues"][sParentFormDefinitionName]["layer_list"] = aLayersName.join(",");
        }
    };

    /**
     * removeLayersOfLayer function.
     * Supprime les calques sélectionnés (celles associées à la calque) dans la liste ui-grid (onglet "calques").
     **/
    angular.element(vitisApp.appMainDrtv).scope()['removeLayersOfLayer'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("removeLayersOfLayer");
        var oGridOptions = angular.element("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"] + "'] .ui-grid-form-field-data").scope().$parent["gridOptions"];
        // Liste des calques sélectionnés.
        var aSelectedRows = oGridOptions["gridApi"]["selection"]["getSelectedRows"]();
        if (aSelectedRows.length > 0) {
            var aData = [];
            var aLayersName = [];
            oGridOptions["data"].forEach(function (oRowData) {
                if (aSelectedRows.indexOf(oRowData) == -1) {
                    aData.push(oRowData);
                    aLayersName.unshift(oRowData["name"]);
                }
            });
            // Sauve le champ "layer_list" (liste des calques sélectionnés)
            envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["layer_list"] = aLayersName.join(",");
            // Mise à jour de la liste ui-grid.
            oGridOptions["gridApi"]["selection"]["clearSelectedRows"]();
            oGridOptions["data"] = aData;
        }
    };

    /**
     * loadVmapConfig function.
     * Chargement de la section "Configuration vMap" dans l'onglet "Configuration".
     */
    angular.element(vitisApp.appMainDrtv).scope()['loadVmapConfig'] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("loadVmapConfig");
        // Paramètres des properties dans les valeurs du formulaire de config de vMap.
        angular.element(vitisApp.appMainDrtv).scope()["setPropertiesFormValues"](["vmap", "popup", "print", "selection", "controls"]);
        // Surcharge l'url du formulaire des properties de vMap.
        var scope = this;
        var sTable = envSrvc["oSelectedObject"]["name"];
        scope["oFormRequestParams"] = {
            "sUrl": "modules/vmap/forms/" + envSrvc["oSelectedMode"]["mode_id"] + "/" + sTable + "_" + envSrvc["oSectionForm"][sTable]["sections"][envSrvc["oSectionForm"][sTable]["iSelectedSectionIndex"]]["name"] + ".json"
        };
        //
        //envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["vmap"] = propertiesSrvc["vmap"];
    };

    /**
     * Load the studio with the apropriate params
     * @param {string} type business_object/layer_filter
     */
    angular.element(vitisApp.appMainDrtv).scope()['loadStudioVmap'] = function (type) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["propertiesSrvc"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);
        //
        $log.info("loadStudioVmap");

        var aAvaliableItems = ["title", "subtitle", "label", "checkbox", "radio", "textarea", "select", "list", "double_select", "date", "datetime", "tinymce", "codemirror", "hidden", "text", "password", "email", "url", "integer", "float", "button", "color_picker", "slider", "hr", "map_osm", "map_bing", "map_vmap", "imageurl", "image_wsdata", "linkurl", "file_wsdata", "bo_grid", "section_grid"];

        if (type === 'business_object') {

            /**
             * config.avaliable_elems {array} Type d'éléments disponibles
             * config.avaliable_form_types {array|undefined} Types de formulaire (update, insert etcc..) dispo. Si avaliable_form_types est null, alors l'application utilisera tous les types disponibles du formulaire
             * config.default_form_type {string} Type de formulaire selectionné par défaut
             * config.get.api API à utiliser pour le GET/POST des formulaires
             * config.get.ressource Ressource à utiliser pour le GET/PUT des formulaires sous la forme suivante: /[ressource]/{object_id}/form/{form}
             * config.get.no_result_function fonction à lancer quand aucun formulaire n'est retourné
             * @type object
             */
            var config = {
                'avaliable_elems': aAvaliableItems,
                'avaliable_form_types': ['display', 'search', 'update', 'insert'],
                'default_form_type': 'update',
                'get': {
                    'api': 'vmap',
                    'ressource': 'businessobjects',
                    'no_result_function': 'suggestGenerateForm'
                },
                'reset_default_function': 'suggestColumnsToGenerateForm'
            };
        }
        if (type === 'layer_filter') {
            var config = {
                'avaliable_elems': aAvaliableItems,
                'avaliable_form_types': ['search'],
                'default_form_type': 'search',
                'get': {
                    'api': 'vmap',
                    'ressource': 'layers',
                    'no_result_function': 'useEmptyForm'
                }
            };
        }

        oVFB["reset"]();
        oVFB["setId"](envSrvc["sId"]);
        oVFB["setApplication"]("vmap");
        oVFB["setToken"](sessionSrvc["token"]);
        oVFB["setContainer"]("#container_section_" + envSrvc["oSelectedObject"]["name"] + "_studio");
        oVFB["setAppProperties"](propertiesSrvc);

        if (goog.isDefAndNotNull(config)) {
            oVFB.init(config);
        }
    };

    /**
     * Hide the section "Layer form" if the value is_filtered is not true
     */
    angular.element(vitisApp.appMainDrtv).scope()['showStudioIfLayerIsFiltered'] = function () {

        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        var sFormName = 'vmap_admin_map_vmap_layers_general_update_form';

        $log.info("showStudioIfLayerIsFiltered");

        setTimeout(function () {
            if (goog.isDefAndNotNull(envSrvc['oFormValues'][sFormName])) {
                var isFiltered = envSrvc['oFormValues'][sFormName]['is_filtered'];
                if (!isFiltered) {
                    $('#container_mode_vmap_admin_map').find('.section-form-edit-first').find('.section-form-section').hide();
                } else {
                    $('#container_mode_vmap_admin_map').find('.section-form-edit-first').find('.section-form-section').show();
                }
            }
            if (envSrvc["sMode"] === "insert") {
                $('#container_mode_vmap_admin_map').find('.section-form-edit-first').find('.section-form-section-insert').hide();
            }
        }, 500);
    };

    /**
     * Show the import modal
     */
    angular.element(vitisApp.appMainDrtv).scope()['importBusinessObject'] = function () {

        var $compile = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$compile"]);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
        var $scope = this;
        var bHavePrivileges = false;

        var aUserPrivileges = sessionStorage['privileges'].split(',');

        if (goog.isArray(aUserPrivileges)) {
            if (aUserPrivileges.indexOf('vitis_admin') !== -1 &&
                    aUserPrivileges.indexOf('vmap_admin') !== -1 &&
                    aUserPrivileges.indexOf('vm4ms_admin') !== -1) {
                bHavePrivileges = true;
            }
        }

        $translate(['CTRL_IMPORT_BO_ERROR_INSUFFICIENT_PRIVILEGES', 'CTRL_IMPORT_BO_ERROR_INSUFFICIENT_PRIVILEGES_DESCRIPTION', 'CTRL_IMPORT_BO_IMPORT_TITLE', 'CTRL_IMPORT_BO_LOADING']).then(function (aTranslations) {
            if (!bHavePrivileges) {
                $scope["modalWindow"]("dialog", aTranslations['CTRL_IMPORT_BO_ERROR_INSUFFICIENT_PRIVILEGES'], {
                    "className": "modal-danger",
                    "message": aTranslations['CTRL_IMPORT_BO_ERROR_INSUFFICIENT_PRIVILEGES_DESCRIPTION']
                });
                return 0;
            }
            var dialog = bootbox['dialog']({
                size: 'large',
                title: aTranslations['CTRL_IMPORT_BO_IMPORT_TITLE'],
                message: '<div app-import-bo id="import-bo">' + aTranslations['CTRL_IMPORT_BO_LOADING'] + '</div>'
            });
            dialog['init'](function () {
                setTimeout(function () {
                    var template = dialog['find']('.bootbox-body');
                    var content = $compile(template)($scope);
                }, 1000);
            });
        });
    };

    /**
     * Check if the used schema is one of the unrecommended
     */
    angular.element(vitisApp.appMainDrtv).scope()['checkBoSchema'] = function () {

        var $q = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["$q"]);
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);

        $log.info("checkBoSchema");

        var scope = this;
        var deferred = $q.defer();
        var sSchema = envSrvc['oFormValues'][envSrvc['sFormDefinitionName']]['schema'];
        var aUnrecommendedSchemas = ['s_vmap', 's_vitis', 's_vm4ms', 's_majic', 's_cadastre'];
        var bIsUnrecommended = false;

        for (var i = 0; i < aUnrecommendedSchemas.length; i++) {
            if (sSchema === aUnrecommendedSchemas[i]) {
                bIsUnrecommended = true;
                $translate(['CREATE_BO_ON_UNRECOMMENDED_SCHEMA1', 'CREATE_BO_ON_UNRECOMMENDED_SCHEMA2', 'CREATE_BO_ON_UNRECOMMENDED_SCHEMA3']).then(function (aTranslations) {
                    var oOptions = {
                        "className": "modal-warning",
                        "message": '<b>' + aTranslations['CREATE_BO_ON_UNRECOMMENDED_SCHEMA1'] + sSchema + aTranslations['CREATE_BO_ON_UNRECOMMENDED_SCHEMA2'] + '<br>' + aTranslations['CREATE_BO_ON_UNRECOMMENDED_SCHEMA3'] + '</b>',
                        "callback": function (bResponse) {
                            if (bResponse)
                                deferred.resolve();
                            else
                                deferred.reject();
                        }
                    };
                    scope['modalWindow']('confirm', '', oOptions);
                });
            }
        }

        if (!bIsUnrecommended) {
            setTimeout(function () {
                deferred.resolve();
            });
        }

        return deferred.promise;
    };


    /**
     * appBusinessObjectEventDescriptionColumn directive.
     * Mise en forme de la colonne "description" dans la liste de l'onglet "Evènements" (objet métier).
     * @param {service} $translate Translate service.
     * @ngInject
     **/
    vitisApp.appBusinessObjectEventDescriptionColumnDrtv = function ($translate) {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appBusinessObjectEventDescriptionColumn", function (value) {
                    // Si le champ est vide : supprime l'icône.
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        // Classes css (ui-grid + spécifiques).
                        element[0].className = "ui-grid-cell-contents info-icon";
                        // Traduction du titre et du contenu.
                        $translate(["FORM_DESCRIPTION_VMAP_BUSINESS_OBJECT_EVENT"]).then(function (translations) {
                            // Création du "tooltip".
                            $(element)["popover"]({
                                "trigger": "hover",
                                "container": "body",
                                "title": function () {
                                    return translations["FORM_DESCRIPTION_VMAP_BUSINESS_OBJECT_EVENT"];
                                },
                                "content": function () {
                                    return scope["row"]["entity"][scope["col"]["field"]];
                                },
                                // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                                "placement": function (oPopoverNode, oElementNode) {
                                    return scope.$root["workspaceTooltipPlacement"](oElementNode);
                                },
                                "html": true
                            });
                        });
                    }
                });
                // Attends la suppression du scope.
                scope.$on("$destroy", function () {
                    // Supprime le tooltip.
                    $(element)["popover"]("destroy");
                    // Supprime l'observateur.
                    clearObserver();
                });
            }
        }
    };
    vitisApp["compileProvider"].directive('appBusinessObjectEventDescriptionColumn', vitisApp.appBusinessObjectEventDescriptionColumnDrtv);
});
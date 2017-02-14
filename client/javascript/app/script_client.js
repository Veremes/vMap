
/* global goog, vitisApp, angular */

goog.provide('vitis.script_client');
goog.require('vitis');
goog.require('vitis.directives.main');
goog.require('vitis.directives.workspaceList');

vitisApp.on('appMainDrtvLoaded', function () {
    /**
     * loadSimpleForm function.
     * Paramétrage avant la compilation du template simpleForm (vm_tab.event).
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().loadSimpleForm = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        // Passage en mode "Update" (pour le formulaire).
        envSrvc["sMode"] = "update";
        $log.info("loadSimpleForm");
    };

    /**
     * scopeEval function.
     * Evaluation d'une chaine de caractère dans un scope.
     * @param {angular.$scope} scope Angular scope.
     * @param {string} sStringToEval chaine de caractère à évaluer.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().scopeEval = function (scope, sStringToEval) {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        $log.info(sStringToEval);
        scope.$eval(sStringToEval);
    };

    /**
     * AddDoubleForm function.
     * Création d'un enregistrement (doubleForm).
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope().AddDoubleForm = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        // Compilation et affichage du template doubleForm en mode "insert".
        envSrvc["addDoubleForm"]();
        $log.info("AddDoubleForm");
    };

    /**
     * AddSectionForm function.
     * Création d'un enregistrement (simpleForm ou sectionForm).
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope().AddSectionForm = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
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
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().setMode = function (sMode) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var modesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["modesSrvc"]);
        //
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
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope()["setFullScreen"] = function (bFullScreen) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
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
            }
        }
    };

    /**
     * reloadSection function.
     * Recharge l'onglet.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().reloadSection = function () {         // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("reloadSection : " + envSrvc["sMode"]);
        envSrvc["setSectionForm"](envSrvc["sMode"], envSrvc["sId"]);
    };

    /**
     * getProperty function.
     * Retourne la valeur d'une des "properties".
     * @param {string} sPropertieName Nom de la propriété.
     * @return {string}
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().getProperty = function (sPropertieName) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        // Edition d'un enregistrement.
        $log.info("getProperty : " + sPropertieName);
        var sValue;
        if (sPropertieName.indexOf(".") != -1)
            eval("sValue = propertiesSrvc." + sPropertieName);
        else
            sValue = propertiesSrvc[sPropertieName];
        return sValue;
    };

    /**
     * DEPRECATED
     * getPropertie function.
     * Retourne la valeur d'une "propertie".
     * @param {string} sPropertieName Nom de la "propertie".
     * @return {string}
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().getPropertie = function (sPropertieName) {
        return angular.element(vitisApp.appMainDrtv).scope().getProperty(sPropertieName);
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
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().modalWindow = function (sType, sTitle, oOptions) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var externFunctionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["externFunctionSrvc"]);
        // 
        $log.info("modalWindow");
        return externFunctionSrvc["modalWindow"](sType, sTitle, oOptions);
    };

    /**
     * selectFirstOption function.
     * Sélectionne la 1ere option d'un <select>.
     * @param {string} sFormElementName Nom du <select>.
     * @param {boolean} bEmptyOption Ajoute une <option> vide si le <select> est vide.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().selectFirstOption = function (sFormElementName, bEmptyOption) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
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
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().loadSection = function () {         // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        //
        $log.info("loadSection");
    };

    /**
     * reloadSectionForm function.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().reloadSectionForm = function () {         // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        //
        $log.info("reloadSectionForm");
    };

    /**
     * refreshWorkspaceListByPeriod function.
     * Actualise une liste "ui-grid" (timer) en fonction de la propriété "refresh_period".
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope().refreshWorkspaceListByPeriod = function () {         // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("refreshWorkspaceListByPeriod");
        // Sauve le nom de l'onglet qui doit être raffraîchit.
        var sSelectedObject = envSrvc["oSelectedObject"]["name"];
        // Supprime le précédent timer de l'onglet.
        if (typeof (envSrvc["oWorkspaceListRefreshTimer"][sSelectedObject]) == "number")
            clearInterval(envSrvc["oWorkspaceListRefreshTimer"][sSelectedObject]);
        //
        if (typeof (propertiesSrvc["refresh_period"]) != "number")
            propertiesSrvc["refresh_period"] = 30;
        // Création du timer.
        var scope = this;
        envSrvc["oWorkspaceListRefreshTimer"][sSelectedObject] = setInterval(function () {             // Recharge la liste uniquement si l'onglet actuel est celui qui contient le timer.
            if (envSrvc["oSelectedObject"]["name"] == sSelectedObject && envSrvc["sMode"] == "search") {
                // Sauve la sélection
                scope["saveGridSelection"](scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["grid"]["appScope"], scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["grid"]["options"]);
                // Recharge la liste.
                var iPaginationCurrentPage = envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["paginationCurrentPage"];
                var iPaginationPageSize = envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["paginationPageSize"];
                scope.$root["refreshGrid"](scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["grid"]["appScope"], envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]);
            }
        }, propertiesSrvc["refresh_period"] * 1000);
    };

    /**
     * resetForm function.
     * Remise à zéro d'un formulaire.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().resetForm = function (sFormDefinitionName) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
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
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope().editSectionForm = function (sId) {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
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
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope().showSectionForm = function (sId) {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
        $log.info("showSectionForm");
        if (typeof (sId) == "undefined")
            sId = envSrvc["sId"];
        envSrvc["setSectionForm"]("display", sId);
    };

    /**
     * editDoubleForm function.
     * Edition d'un enregistrement (template doubleForm).
     * @param {object} sId Id de l'enregistrement sélectionné dans la liste.
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope().editDoubleForm = function (sId) {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
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
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope().showDoubleForm = function (sId) {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
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
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().showCredits = function () {         // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $compile = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$compile"]);
        var $templateRequest = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$templateRequest"]);
        var $http = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$http"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var modesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["modesSrvc"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("showCredits");
        // Crée un nouveau scope.
        var scope = this.$new();
        // Sauve le nouveau scope crée dans la définition de l'onglet. 
        modesSrvc["addScopeToObject"](envSrvc["oSelectedObject"]["name"], envSrvc["oSelectedMode"]["mode_id"], scope);
        // Charge les données de crédit de l'application.
        $http.get("conf/credits.json")
                .success(function (data, status, headers, config) {
                    if (typeof (data) == "object") {
                        scope["oCredits"] = data;
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
                ).
                error(function (data, status, headers, config) {
                });
    };

    /**
     * setTagsInput function.
     * Mise en forme d'un ou plusieurs tag (tagsinput).
     * @param {array} aElementsId Tableau d'id d'éléments utilisants "tagsinput".
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().setTagsInput = function (aElementsId) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        //
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
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()["refreshGrid"] = function (scope, oGridOptions) {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
        $log.info("refreshGrid");
        // Sauve la sélection
        scope["saveGridSelection"](scope, oGridOptions);
        // Recharge la liste.
        scope["setGridPage"](oGridOptions["paginationCurrentPage"], oGridOptions["paginationPageSize"], envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["aFilter"], envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["oUrlParams"]);
    };

    /**
     * saveGridSelection function.
     * Sauve la sélection d'une liste "ui-grid".
     * @param {angular.scope} scope Scope de la liste.
     * @param {object} gridOptions Liste ui-grid.
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope().saveGridSelection = function (scope, oGridOptions) {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
        $log.info("saveGridSelection");
        // Sauve la sélection
        var aSelectedRows = oGridOptions["appSelectedRows"] = scope.$root["gridApi"][scope["sSelectedObjectName"]]["selection"]["getSelectedRows"]();
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
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()["setGridFilter"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["formSrvc"]);
        //
        $log.info("setGridFilter");
        // Sauve le formulaire des filtres avec les nouvelles valeurs.
        envSrvc["oWorkspaceList"][envSrvc["oSelectedObject"]["name"]]["oValues"] = angular.copy(envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]);
        //
        var scope = this;
        var sValue, aFilter = [], oFormElement;
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
                //si svalue contient une ' on la double pour la requete SQL
                if (goog.isString(sValue)) {
                    if (sValue.indexOf("'") !== -1) {
                        sValue = sValue.replace(/'/g, "''");
                    }
                }

                if (goog.isDefAndNotNull(oFormElement["comparator"])) {

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
                                aFilter.push('lower(' + sFormElement + ") LIKE lower('%" + sValue + "%')");
                                break;
                            case 'SQL' :
                                aFilter.push(sFormElement.replace(/<VALUE_TO_REPLACE>/g, sValue));
                                break;
                                // ajouter d'autre comparateur si besoin ex: BETWEEN ______ AND ______
                            default:
                                // = < <= > >= basique
                                if (bIsNotNumber) {
                                    sValue = "'" + sValue + "'";
                                }
                                aFilter.push(sFormElement + oFormElement["comparator"][j] + sValue);
                                break;
                        }
                    }
                } else {
                    if (oFormElement["type"] == "text") {
                        // Paramétrage  suivant le type de valeur à filtrer (texte ou numérique).
                        if (isNaN(sValue))
                            aFilter.push('lower(' + aFormElementsKeys[i] + ") LIKE lower('%" + sValue + "%')");
                        else
                            aFilter.push(aFormElementsKeys[i] + "=" + sValue);
                    } else if (oFormElement["type"] == "date" || oFormElement["type"] == "datetime") {
                        aFilter.push(aFormElementsKeys[i] + "::text LIKE'%" + sValue + "%'");
                    } else {
                        if (typeof (sValue) != "boolean")
                            sValue = "'" + sValue + "'";
                        aFilter.push(aFormElementsKeys[i] + "=" + sValue);
                    }
                }
            }
            i++;
        }
        // Sauve et charge la 1ere page avec les filtres.
        envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["aFilter"] = aFilter;
        // Sauve le filtre dans la définition de l'onglet.
        if (envSrvc["sMode"] == "search")
            envSrvc["oWorkspaceList"][envSrvc["oSelectedObject"]["name"]]["aFilter"] = angular.copy(aFilter);
        //        
        scope.$root.$broadcast("aFilterLoaded_" + envSrvc["oSelectedObject"]["name"], envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["aFilter"]);
        // Charge la 1ere page avec les filtres.
        if (envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["paginationCurrentPage"] == 1)
            scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["pagination"]["raise"]["paginationChanged"](1, envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["paginationPageSize"]);
        else
            envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["paginationCurrentPage"] = 1;
    };

    /**
     * resetGridFilter function.
     * Suppression des filtres pour la liste ui-grid / valeurs par défaut du formulaire de filtre.
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()["resetGridFilter"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["formSrvc"]);
        //
        $log.info("resetGridFilter");
        var scope = this;
        var oFormData = formSrvc["getFormData"](envSrvc["sFormDefinitionName"], true);
        var aFormElementsKeys = Object.keys(oFormData);
        var i = 0;
        //si il y a des champs date on les reset pour une nouvelle utilisation (sinon conservation de la date précédente)
        while (i < aFormElementsKeys.length) {
            var oFormElement = formSrvc["getFormElementDefinition"](aFormElementsKeys[i], envSrvc["sFormDefinitionName"]);
            if (oFormElement["type"] === "date" || oFormElement["type"] === "datetime") {
                angular.element("#" + oFormElement["id"]).data("DateTimePicker").clear();
            }
            i++;
        }
        // Valeurs par défaut du formulaire.
        envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]] = angular.copy(envSrvc["oWorkspaceList"][envSrvc["oSelectedObject"]["name"]]["oDefaultValues"]);
        // Supprime et charge la 1ere page sans filtre.
        scope["setGridFilter"]();
    };

    /**
     * setPaginationStatus function.
     * Affichage du statut dans la barre de pagination.
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope().setPaginationStatus = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
        $log.info("setPaginationStatus");
        var scope = this, sTranslationId;
        if (envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["totalItems"] > 0) {
            sTranslationId = "PAGINATION_STATUS";
            // 1er élément affiché + total.
            var oTranslationValues = {
                "totalItems": envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["totalItems"],
                "itemStart": (envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["paginationCurrentPage"] - 1) * envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["paginationPageSize"] + 1
            };
            // Dernier élément affiché.
            oTranslationValues["itemEnd"] = oTranslationValues["itemStart"] + envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["paginationPageSize"] - 1;
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
     * @param {array} aFilter Filtre de recherche.
     * @param {object} oUrlParams Paramètres optionnels pour le web service.
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope().setGridPage = function (iPageNumber, iPageSize, aFilter, oUrlParams) {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var Restangular = angular.element(vitisApp.appMainDrtv).injector().get(["Restangular"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //         $log.info("setGridPage");
        if (typeof (iPageNumber) != "number")
            iPageNumber = 1;
        var scope = angular.element(vitisApp.appWorkspaceListDrtv).scope();
        iPageNumber--;
        var iOffset = iPageNumber * iPageSize;
        // Paramètres pour le web service.
        if (typeof (oUrlParams) == "undefined")
            oUrlParams = {};
        goog.object.extend(oUrlParams, {
            "token": sessionSrvc["token"],
            "offset": iOffset,
            "limit": iPageSize
        });
        if (typeof (aFilter) == "undefined")
            aFilter = [];
        // Filtre de recherche pour la liste ?
        if (typeof (envSrvc["oSelectedObject"]["filter"]) != "undefined")
            Array.prototype.push.apply(aFilter, envSrvc["oSelectedObject"]["filter"]);
        // Dédoublonnage du tableau de filtres.
        aFilter = aFilter.filter(function (x, i, a) {
            return a.indexOf(x) == i;
        });
        //
        if (aFilter.length > 0)
            oUrlParams["filter"] = aFilter.join(" AND ");
        else
            delete oUrlParams["filter"];
        // Paramètres du service web (vitis, gtf...)
        var sResourceId = envSrvc["getSectionWebServiceResourceId"]();
        var aResourceId = envSrvc["explodeWebServiceResourceId"](sResourceId);
        var oWebServiceBase = Restangular["all"](propertiesSrvc["services_alias"] + "/" + aResourceId[0]);
        // Evènement à éxécuter avant le chargement de la liste ?
        if (typeof (envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["appBeforeEvent"]) != "undefined")
            scope.$root.$eval(envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["appBeforeEvent"]);
        // Charge la liste des enregistrements de l'onglet.
        oWebServiceBase["customGET"](aResourceId[1], oUrlParams).then(function (data) {
            // Met à jour la liste des enregistrements.
            if (parseInt(data["status"]) == 1) {
                var aGridData = [];
                if (typeof (data[aResourceId[1]]) != "undefined")
                    aGridData = data[aResourceId[1]];
                // Mise à jour de la liste ui-grid.
                envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["data"] = aGridData;
                //if (data["total_row_number"] > 0)
                envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["totalItems"] = data["total_row_number"];
                // Maj du libellé de pagination.
                scope.$root["setPaginationStatus"]();
                // Evènement à éxécuter après le chargement de la liste ?
                if (typeof (envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["appAfterEvent"]) != "undefined")
                    scope.$root.$eval(envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["appAfterEvent"]);
                // Lignes à sélectionner ?    
                if (typeof (envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["appSelectedRows"]) != "undefined") {
                    scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["grid"]["modifyRows"](envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["data"]);
                    aGridData.forEach(function (oRow, iIndex) {
                        if (envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["appSelectedRows"].indexOf(oRow[envSrvc["oSelectedObject"]["sIdField"]]) != -1)
                            scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["selection"]["selectRow"](envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["data"][iIndex])
                    });
                }
            }
        });
    };

    /**
     * formatGridColumn function.
     * Formatte des colonnes pour la liste ui-grid.
     * @param {array} aColumns Tableau des colonnes.
     * @param {string} sSelectedObjectName id de l'objet (onglet).
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope().formatGridColumn = function (aColumns, sSelectedObjectName) {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        var uiGridConstants = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["uiGridConstants"]);         //
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
                "field": aColumns[i]["name"], "width": parseInt(aColumns[i]["width"]) + 15,
                "enableSorting": aColumns[i]["sortable"],
                "enableColumnResizing": aColumns[i]["resizeable"], "headerCellClass": sSelectedObjectName + "_" + aColumns[i]["name"],
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
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope()["formatGridAction"] = function (aAction, sSelectedObjectName) {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        //
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
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope().executeActionButtonEvent = function (oRow, sEvent) {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
        $log.info("executeActionButtonEvent");
        var scope = angular.element(vitisApp.appWorkspaceListDrtv).scope();
        scope.$root[sEvent](oRow["entity"][envSrvc["oSelectedObject"]["sIdField"]]);
    };

    /**
     * DeleteSelection function.
     * Supprime les enregistrements sélectionnés.
     * @param {object} oOptions Paramètres optionnels.
     * @expose
     **/
    angular.element(vitisApp.appWorkspaceListDrtv).scope().DeleteSelection = function (oOptions) {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var Restangular = angular.element(vitisApp.appMainDrtv).injector().get(["Restangular"]);
        var sessionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["sessionSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
        $log.info("DeleteSelection");
        var scope = angular.element(vitisApp.appWorkspaceListDrtv).scope();
        var aSelectedRows = scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["selection"]["getSelectedRows"]();
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
                            while (i < aSelectedRows.length) {
                                sId = aSelectedRows[i][envSrvc["oSelectedObject"]["sIdField"]];
                                if (isNaN(sId))
                                    sId = "'" + sId + "'";
                                aIdToDelete.push(sId);
                                i++;
                            }
                        }
                        if (aIdToDelete.length > 0) {
                            // Paramètres du service web (vitis, gtf...)                         
                            var sResourceId = envSrvc["getSectionWebServiceResourceId"]();
                            var aResourceId = envSrvc["explodeWebServiceResourceId"](sResourceId);
                            var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/" + aResourceId[0], aResourceId[1]);
                            oWebServiceBase["customDELETE"]("", {"token": sessionSrvc["token"], "idList": aIdToDelete.join("|")})
                                    .then(function (data) {
                                        if (data["status"] == 1) {
                                            // Recharge la page actuelle.
                                            if (envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["paginationCurrentPage"] == 1)
                                                scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["pagination"]["raise"]["paginationChanged"](1, envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["paginationPageSize"]);
                                            else
                                                envSrvc["oGridOptions"][envSrvc["oSelectedObject"]["name"]]["paginationCurrentPage"] = 1;
                                            // Fonction à appeler après la suppression (idem afterEvent du form.) ?
                                            var sFunctionName = "after" + goog.string.toTitleCase(envSrvc["oSelectedMode"]["mode_id"], "_").replace(/_/g, "") + "Removal";
                                            if (typeof (scope.$root[sFunctionName]) != "undefined")
                                                scope.$root[sFunctionName]();
                                        } else {
                                            // Affichage de la fenêtre modale d'erreur.
                                            var oWindowOptions2 = {
                                                "className": "modal-danger",
                                                "message": data["errorMessage"]
                                            };
                                            scope.$root["modalWindow"]("dialog", "LIST_DELETE_ERROR", oWindowOptions2);
                                        }
                                    });
                        } else {
                            // Supprime la sélection.
                            scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["selection"]["clearSelectedRows"]();
                            // Raffraichit la grille.
                            scope.$root["gridApi"][envSrvc["oSelectedObject"]["name"]]["core"]["refresh"]();
                        }
                    }
                }
            };
            scope.$root["modalWindow"]("confirm", "", oWindowOptions);
        }
    };

    /**
     * toGarbageCollection function.
     * Supprime un tableau / objet et toutes ses références.
     * @param {} reference Référence à supprimer (tableau ou objet).
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().toGarbageCollection = function (reference) {
        // Injection des services.
        //var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
        //$log.info("toGarbageCollection");
        envSrvc["toGarbageCollection"](reference);
    };

    /**
     * concatSelectAttributes function.
     * Concatène l'id et le libéllé des options d'un <select>.
     * @param {string} sFormElementName Nom du <select>.
     * @param {string} sDelimiter Caractère délimiteur (un espace par défaut).
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().concatSelectAttributes = function (sFormElementName, sDelimiter) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);         //
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
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().workspaceTooltipPlacement = function (oElementNode) {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        //
        $log.info("workspaceTooltipPlacement");
        if ($(oElementNode).offset().left < (window.innerWidth / 2))
            return "right";
        else
            return "left";
    };

    /**
     * hideAllModalWindow function.
     * Ferme toutes les fenêtres modales.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().hideAllModalWindow = function (oElementNode) {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        //
        $log.info("hideAllModalWindow");
        bootbox["hideAll"]();
    };

    /**
     * addSelectEmptyOption function.
     * Ajoute une <option> vide dans un <select> et la sélectionne (si aucune option est sélectionné).
     * @param {string} sFormElementName Nom du <select>.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().addSelectEmptyOption = function (sFormElementName) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
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
                    // Classe css ui-grid pour la mise en forme de la colonne.
                    element[0].className += " ui-grid-cell-contents";
                    // Formate la date suivant la langue de l'application.
                    if (goog.isDefAndNotNull(scope["row"]["entity"][scope["col"]["field"]]))
                        element[0].innerHTML = moment(scope["row"]["entity"][scope["col"]["field"]]).format('L LTS');
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
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().getBooleanTranslation = function (bValue) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $q = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["$q"])
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
        //
        $log.info("getBooleanTranslation");
        var deferred = $q.defer();
        var promise = deferred.promise;
        if (typeof (bValue) == "boolean") {
            $translate(["FORM_YES", "FORM_NO"]).then(function (oTranslations) {
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
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().loadSectionList = function (oOptions) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("loadSectionList");
        var scope = this;
        // Attend l'initialisation du contrôleur workspaceListCtrl.
        var clearListener = scope.$root.$on('initWorkspaceList', function (event, scope) {
            // Supprime le "listener".
            clearListener();
            // Filtre par le champ sId.
            var sId = envSrvc["sId"];
            if (isNaN(sId))
                sId = "'" + sId + "'";
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
                "aFilter": [envSrvc["oSelectedObject"]["sIdField"] + "=" + sId],
                "appShowActions": false // Affichage des boutons d'actions.
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
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().getTabIdFieldValue = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("getTabIdFieldValue");
        return envSrvc["sId"];
    };

    /**
     * setRadioTranslation function.
     * Change la valeur d'un champ radio par sa traduction (oui / non).
     * @param {string} sFormElementName Nom du champ de form. à traduire.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().setRadioTranslation = function (sFormElementName) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("setRadioTranslation");
        angular.element(vitisApp.appMainDrtv).scope().$root["getBooleanTranslation"](envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]][sFormElementName]).then(function (sTranslation) {
            envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]][sFormElementName] = sTranslation;
        });
    };
    
    /**
     * Concats all the arguments passed
     */
    angular.element(vitisApp.appMainDrtv).scope()['concat'] = function () {
        var sResult = '';
        for (var i = 0; i < arguments.length; i++) {
            if (goog.isString(arguments[i])) {
                sResult += arguments[i];
            }
        }
        return sResult;
    };
    
    /**
     * cloneSectionForm function.
     * Clone un enregistrement.
     * @expose
     **/
    angular.element(vitisApp.appMainDrtv).scope().cloneSectionForm = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appWorkspaceListDrtv).injector().get(["envSrvc"]);
        //
        $log.info("cloneSectionForm");
        var scope = this;
        var oFormValuesCopy = angular.copy(envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]);
        this["AddSectionForm"]();
        var clearListener = scope.$root.$on('formExtracted', function (event, scope) {
            // Supprime le "listener".
            clearListener();
            // Valeurs de l'enregistrement à cloner.
            envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]] = angular.copy(oFormValuesCopy);
            console.log(envSrvc);
        });
    };
});
// Google closure
goog.provide("vitis.controllers.sectionForm");
goog.require("vitis.modules.main");

/**
 * sectionForm Controller.
 * .
 * @param {angular.$scope} $scope Angular scope.
 * @param {angular.$compile} $compile Angular compile.
 * @param {angular.$templateRequest} $templateRequest Angular templateRequest service.
 * @param {angular.$log} $log Angular log service.
 * @param {angular.$rootScope} $rootScope Angular rootScope.
 * @param {$translateProvider.$translate} $translate TranslateProvider translate service.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {angular.$timeout} $timeout Angular timeout
 * @param {service} modesSrvc Liste des modes et objets de l'utilisateur.
 * @ngInject
 **/
vitisApp.sectionFormCtrl = function ($scope, $compile, $templateRequest, $log, $rootScope, $timeout, $translate, envSrvc, sessionSrvc, propertiesSrvc, modesSrvc) {
    $log.info("initSectionForm");
    // Sauve le nouveau scope crée dans la définition de l'onglet. 
    modesSrvc["addScopeToObject"](envSrvc["oSelectedObject"]["name"], envSrvc["oSelectedMode"]["mode_id"], $scope);
    $rootScope["bLastSectionContainer"] = false;
    // Affiche un message de confirmation de validité du formulaire.
    $scope["bFormValidationMessage"] = true;
    var aData = {};
    aData["sections"] = envSrvc["oSelectedObject"]["sections"];

    // Par défaut : 1ere section affichée.
    aData["iSelectedSectionIndex"] = 0;

    // 1er affichage de l'onglet : aucune section n'est déja chargée.
    var i = 0;
    while (i < aData["sections"].length) {
        aData["sections"][i]["bLoaded"] = false;
        i++;
    }

    // Traduction du titre de la section.
    var sTranslateKey = "SECTION_" + envSrvc["sMode"].toUpperCase() + "_TITLE_" + envSrvc["oSelectedObject"]["name"].toUpperCase();
    $translate([sTranslateKey], {"sId": envSrvc["sId"]}).then(function (translations) {
        aData["title"] = translations[sTranslateKey];
    });

    // Sauve les données des sections de l'objet.
    envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]] = aData;
    // Nom du formulaire de la section.
    envSrvc["sFormDefinitionName"] = envSrvc["oSelectedObject"]["name"] + "_" + aData["sections"][0]["name"] + "_" + envSrvc["sMode"] + "_form";
    envSrvc["oSelectedObject"]["sFormDefinitionName"] = envSrvc["sFormDefinitionName"];
    // Attends le rendu des conteneurs des sections et Charge et compile le template de la 1ere section.
    var clearWatch = $rootScope.$watch($rootScope["bLastSectionContainer"], function () {
        $scope["loadObjectSectionTemplate"]();
        // Supprime le "watch";
        clearWatch();
    }, false);
    
    // Chargement de la section sélectionnée.
    $scope["selectSection"] = function (iSectionIndex, oObjectSectionForm) {
        if (envSrvc["sMode"] != "insert") {
            // Sauve l'index de la section sélectionnée.
            envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]["iSelectedSectionIndex"] = iSectionIndex;
            // Nom du formulaire de la section.
            envSrvc["sFormDefinitionName"] = envSrvc["oSelectedObject"]["name"] + "_" + envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]["sections"][iSectionIndex]["name"] + "_" + envSrvc["sMode"] + "_form";
            envSrvc["oLastSelectedObjectMode"][envSrvc["oSelectedMode"]["mode_id"]]["sFormDefinitionName"] = envSrvc["sFormDefinitionName"];
            // Affiche l'élément de la section sélectionnée.
            $("#" + "container_mode_" + envSrvc["oSelectedMode"]["mode_id"] + " .container-section").hide();
            $("#container_section_" + envSrvc["oSelectedObject"]["name"] + "_" + oObjectSectionForm["name"]).show();
            // Chargement du template de la section.
            $scope["loadObjectSectionTemplate"]();
            //console.log(envSrvc["oSelectedObject"]["name"]);
            $scope.$root.$broadcast("updateStudio_" + envSrvc["oSelectedObject"]["name"] , {"index": iSectionIndex, "oSectionForm": oObjectSectionForm});
        }
    };

    // Charge le template d'une section.
    $scope["loadObjectSectionTemplate"] = function () {
        // Template de la section sélectionnée.
        var oSelectedSection = envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]];
        var iSelectedSectionIndex = oSelectedSection["iSelectedSectionIndex"], sTemplateUrl;
        if (iSelectedSectionIndex == 0)
            sTemplateUrl = envSrvc["sSelectedTemplate"];
        else
            sTemplateUrl = oSelectedSection["sections"][iSelectedSectionIndex]["template"];
        // Le template de l'objet est dans un répertoire du module ou dans le noyau ?
        if (sTemplateUrl.indexOf("/") == -1)
            sTemplateUrl = envSrvc["sTemplateFolder"] + sTemplateUrl;
        $log.info("loadObjectSectionTemplate : " + sTemplateUrl);
        // Si 1er chargement de la section : compilation du template.
        if (!oSelectedSection["sections"][iSelectedSectionIndex]["bLoaded"]) {
            // Important sinon compile dans le 1er onglet qui contient des sections ?
            $scope["sSelectedObjectName"] = envSrvc["oSelectedObject"]["name"];
            // Compilation du template.
            $templateRequest(sTemplateUrl).then(function (sTemplateHtml) {
                $compile($("#container_section_" + envSrvc["oSelectedObject"]["name"] + "_" + oSelectedSection["sections"][iSelectedSectionIndex]["name"]).html(sTemplateHtml).contents())($scope);
            });
            $log.info("loadObjectSectionTemplate (compilation) : " + sTemplateUrl);
            // Javascript à éxécuter (vm_section.event) ?
            var sEvent = envSrvc["oSelectedObject"]["sections"][iSelectedSectionIndex]["event"];
            if (typeof (sEvent) != "undefined" && sEvent != "") {
                sEvent = sEvent.replace(/javascript:/i, "");
                if (sEvent.indexOf("(") == -1)
                    sEvent += "()";
                $scope.$eval(sEvent);
            }
        }
        // Section à ne pas compiler au prochain affichage.
        envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]["sections"][iSelectedSectionIndex]["bLoaded"] = true;
    };
};
vitisApp.module.controller("sectionFormCtrl", vitisApp.sectionFormCtrl);

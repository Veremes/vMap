// Google closure
goog.provide("vitis.controllers.doubleForm");
goog.require("vitis.modules.main");

/**
 * doubleForm Controller.
 * .
 * @param {angular.$scope} $scope Angular scope.
 * @param {angular.$log} $log Angular log service.
 * @param {angular.$templateRequest} $templateRequest Angular templateRequest service.
 * @param {angular.$compile} $compile Angular compile.
 * @param {angular.$rootScope} $rootScope Angular rootScope.
 * @param {service} envSrvc Paramètres d'environnement.
 * @param {service} modesSrvc Liste des modes et objets de l'utilisateur.
 * @ngInject
 **/
vitisApp.doubleFormCtrl = function ($scope, $templateRequest, $compile, $log, $rootScope, envSrvc, modesSrvc) {
        $log.info("initDoubleForm");
        // Sauve le nouveau scope crée dans la définition de l'onglet. 
        modesSrvc["addScopeToObject"](envSrvc["oSelectedObject"]["name"], envSrvc["oSelectedMode"]["mode_id"], $scope);
        // Important sinon compile dans le 1er onglet qui contient un doubleform ?
        $scope["sSelectedObjectName"] = envSrvc["oSelectedObject"]["name"];
        // Affiche un message de confirmation de validité du formulaire.
        //$scope["bFormValidationMessage"] = true;
        // Attends la compilation du template "doubleFormTpl".
        var clearListener = $rootScope.$on('doubleFormCompiled', function(event) {
                // Nom des 2 templates (gauche et droite).
                var sTemplateUrl = "modules/" + envSrvc["oSelectedMode"]["module_name"] + "/" + envSrvc["sTemplateFolder"];
                var sResourceId = envSrvc["getSectionWebServiceResourceId"]();
                if (sResourceId != null) {
                        var aResourceId = envSrvc["explodeWebServiceResourceId"](sResourceId);
                        sTemplateUrl += aResourceId[1];
                }
                else if (typeof(envSrvc["oSelectedObject"]["template_name"]) != "undefined")
                        sTemplateUrl += envSrvc["oSelectedObject"]["template_name"];
                else
                        sTemplateUrl += envSrvc["oSelectedMode"]["mode_id"];
        
                // Compilation du template de la section de droite.
                var sTemplateRight = sTemplateUrl + "RightTpl.html";
                $templateRequest(sTemplateRight).then(function(sTemplate) {
                        $compile($("#double_form_right_section_" + envSrvc["oSelectedObject"]["name"]).html(sTemplate).contents())($scope);
                });                        
                $log.info('compileDoubleFormRightTemplate : ' + sTemplateRight);
                // Compilation du template de la section de gauche.
                var sTemplateLeft = sTemplateUrl + "LeftTpl.html";
                $templateRequest(sTemplateLeft).then(function(sTemplate) {
                        $compile($("#double_form_left_section_" + envSrvc["oSelectedObject"]["name"]).html(sTemplate).contents())($scope);
                });                        
                $log.info('compileDoubleFormLeftTemplate : ' + sTemplateLeft);
                // Supprime le "listener".
                clearListener();
        });
};
vitisApp.module.controller("doubleFormCtrl", vitisApp.doubleFormCtrl);

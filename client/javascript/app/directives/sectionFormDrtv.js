// Google closure
goog.provide("vitis.directives.sectionForm");
goog.require("vitis.modules.main");

/**
 * appSectionForm directive.
 * Association du contrôleur à la directive.
 * @export
 **/
vitisApp.appSectionFormDrtv = function() {
        return {
                restrict: 'A',
                controller : 'sectionFormCtrl',
                controllerAs : 'ctrl',
                scope: true
        }
};
vitisApp.module.directive("appSectionForm", vitisApp.appSectionFormDrtv);

/**
 * appSectionFormMenu directive.
 * Evènement "click" sur les sections du menu.
 * @param {service} envSrvc Paramètres d'environnement.
 * @ngInject
 **/
vitisApp.appSectionFormMenuDrtv = function(envSrvc) {
        return {
                link: function (scope, element, attrs) {
                        // Section non sélectionnée : classe différente suivant le mode (insert/update).
                        var sClassName = "col-xs-12";
                        if (envSrvc["sMode"] == "insert")
                                sClassName += " section-form-section-insert";
                        else
                                sClassName += " section-form-section";
                        // Section sélectionnée : classe css spécifique.
                        if (scope["$index"] == scope["oSectionForm"][scope["sSelectedObjectName"]]["iSelectedSectionIndex"])
                                sClassName += " section-form-section-selected";
                        element[0].className = sClassName;
                        // Ajoute une classe pour la section sélectionnée.
                        $(element).on("click.selectSection", function(){
                                if (envSrvc["sMode"] != "insert") {
                                        $(this).parent().find(".section-form-section").removeClass("section-form-section-selected");
                                        $(this).addClass("section-form-section-selected");
                                }
                        });
                        // Attends la suppression du scope.
                        scope.$on("$destroy", function () {
                            // Supprime l'évènement.
                            $(element).off("click.selectSection");
                        });
                }
        }
};
vitisApp.module.directive("appSectionFormMenu", vitisApp.appSectionFormMenuDrtv);

/**
 * appSectionFormSection directive.
 * Affiche le 1er onglet et cache tous les autres.
 * @param {angular.$rootScope} $rootScope Angular rootScope.
 * @param {service} envSrvc Paramètres d'environnement.
 * @ngInject
 **/
vitisApp.appSectionFormSectionDrtv = function($rootScope, envSrvc) {
        return {
                link: function (scope, element, attrs) {
                        // Affiche la section sélectionnée.
                        if(scope["$index"] == envSrvc["oSectionForm"][scope["sSelectedObjectName"]]["iSelectedSectionIndex"])
                                $(element).show();
                        else        
                                $(element).hide();
                        
                        // Attends la création du dernier conteneur des sections et lance la compilation de la 1ere section.
                        if (scope["$last"]) {
                                $rootScope["bLastSectionContainer"] = true;
                        }
                }
        }
};
vitisApp.module.directive("appSectionFormSection", vitisApp.appSectionFormSectionDrtv);
// Google closure
goog.provide("vitis.directives.phpInfo");
goog.require("vitis.modules.main");

/**
 * appPhpInfo directive.
 * .
 * @param {angular.$log} $log Angular log service.
 * @param {service} Restangular Service Restangular.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @ngInject
 **/
vitisApp.appPhpInfoDrtv = function($log, Restangular, propertiesSrvc) {
        return {
                link: function (scope, element, attrs) {
                        // Initialisation
                        $log.info("initPhpInfoConfiguration");
                        // Nom du service web (vitis, gtf...)
                        var oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vitis");
                        // Charge le template de l'onglet (sections).
                        var oParams = {
                                "token": sessionStorage["session_token"]
                        }
                        oWebServiceBase["customGET"]("Phpinfo", oParams)
                                .then(function(data){
                                        if (data["status"] == 1) {
                                                // Largeur du tableau à 100%.
                                                //data["phpinfo"] = data["phpinfo"].replace(/600/g, "100%");
                                                // Extraction du contenu de l'élément <body>.
                                                var doc = document.implementation.createHTMLDocument("phpinfo");
                                                doc.documentElement.innerHTML = data["phpinfo"];
                                                element[0].innerHTML = doc.body.innerHTML;
                                        }
                                });
                }
        }
};
vitisApp.module.directive("appPhpInfo", vitisApp.appPhpInfoDrtv);

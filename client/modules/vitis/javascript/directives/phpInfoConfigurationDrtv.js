'use strict';

// Google closure
goog.provide("vitis.directives.phpInfo");
goog.require("vitis.modules.main");

/**
 * appPhpInfo directive.
 * .
 * @param {angular.$log} $log Angular log service.
 * @param {service} propertiesSrvc Paramètres des properties.
 * @ngInject
 **/
vitisApp.appPhpInfoDrtv = function($log, propertiesSrvc) {
        return {
                link: function (scope, element, attrs) {
                        // Initialisation
                        $log.info("initPhpInfoConfiguration");
                        // Charge les données du phpinfo().
                        ajaxRequest({
                            "method": "GET",
                            "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vitis/Phpinfo",
                            "scope": scope,
                            "success": function(response) {
                                if (response["data"]["status"] == 1) {
                                    // Largeur du tableau à 100%.
                                    //response["data"]["phpinfo"] = response["data"]["phpinfo"].replace(/600/g, "100%");
                                    // Extraction du contenu de l'élément <body>.
                                    var doc = document.implementation.createHTMLDocument("phpinfo");
                                    doc.documentElement.innerHTML = response["data"]["phpinfo"];
                                    element[0].innerHTML = doc.body.innerHTML;
                                }
                            }
                        });
                }
        }
};
vitisApp.module.directive("appPhpInfo", vitisApp.appPhpInfoDrtv);

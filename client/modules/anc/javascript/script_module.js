/* global vitisApp, goog, angular, bootbox, oVFB */

'use strict';
goog.provide('vmap.anc.script_module');
vitisApp.on('appMainDrtvLoaded', function () {
    /**
     * initAncControlForm function.
     * Traitements avant l'affichage du formulaire de la section "Dossier" de l'onglet "Contrôle".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncControlForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        //
        $log.info("initAncControlForm");
        //
        var clearListener = $rootScope.$on('formExtracted', function (event, sFormDefinitionName) {
            // Supprime le "listener".
            clearListener();
            // Champs de form. à afficher suivant le type de contrôle et le mode du form.
            var aFormFieldsToConcat = ["controle_type", "num_dossier", envSrvc["sMode"] + "_button"];
            var oFormFieldsToDisplay, aFormFieldsToDisplay = [];
            if (envSrvc["sMode"] == "search") {
                    oFormFieldsToDisplay = {
                    "BON FONCTIONNEMENT": ["controle_ss_type", "des_date_control", "des_interval_control", "des_refus_visite", "cl_avis", "cl_classe_cbf", "cl_date_avis", "cl_auteur_avis", "cl_date_prochain_controle", "cl_facture"],
                    "CONCEPTION": ["dep_date_depot", "dep_dossier_complet", "cl_avis", "cl_date_avis", "cl_auteur_avis", "cl_date_prochain_controle", "cl_facture"],
                    "REALISATION": ["des_date_control", "des_interval_control", "cl_avis", "cl_date_avis", "cl_auteur_avis", "cl_date_prochain_controle", "cl_facture"]
                };
                $rootScope["displayFormFields"](aFormFieldsToConcat);
            } else {
                oFormFieldsToDisplay = {
                    "BON FONCTIONNEMENT": ["id_controle", "id_installation", "controle_ss_type", "des_date_control", "des_interval_control", "des_pers_control", "des_agent_control", "des_refus_visite", "des_date_installation", "des_date_recommande", "des_numero_recommande", "des_reamenage_terrain", "des_reamenage_immeuble", "des_real_trvx", "des_anc_ss_accord", "des_collecte_ep", "des_sep_ep_eu", "des_eu_nb_sortie", "des_eu_tes_regards", "des_eu_pente_ecoul", "des_eu_regars_acces", "des_eu_alteration", "des_eu_ecoulement", "des_eu_depot_regard", "des_commentaire", "Element_0", "Element_4", "Element_5", "Element_7", "Element_8"],
                    "CONCEPTION": ["id_controle", "id_installation", "dep_date_depot", "des_date_control", "dep_liste_piece", "dep_dossier_complet", "dep_date_envoi_incomplet", "des_nature_projet", "des_concepteur", "car_surface_dispo_m2", "car_permea", "car_valeur_permea", "car_hydromorphie", "car_prof_app", "car_nappe_fond", "car_terrain_innondable", "car_roche_sol", "car_dist_hab", "car_dist_lim_par", "car_dist_veget", "car_dist_puit", "des_collecte_ep", "des_sep_ep_eu", "Element_0", "Element_2", "Element_3", "Element_5"],
                    "REALISATION": ["id_controle", "id_installation", "des_date_control", "des_interval_control", "des_pers_control", "des_agent_control", "des_date_installation", "des_collecte_ep", "des_sep_ep_eu", "des_eu_nb_sortie", "des_eu_tes_regards", "des_eu_pente_ecoul", "Element_0", "Element_5", "Element_8", "des_installateur", "element_7", "des_commentaire"]
                };
                if (envSrvc["sMode"] == "insert") {
                    // Sélection auto. de l'installation de travail.
                    var oModeFilter = envSrvc["oSelectedObject"]["aModeFilter"];
                    if (typeof (oModeFilter) == "object")
                        envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["id_installation"]["selectedOption"]["value"] = oModeFilter["operators"][0]["value"];
                    //
                    $rootScope["displayFormFields"](aFormFieldsToConcat);
                } else {
                    if (envSrvc["sMode"] == "update") {
                        var sControleType = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["controle_type"];
                        if (goog.isDefAndNotNull(envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["controle_type"]["selectedOption"])) {
                            if (goog.isDefAndNotNull(envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["controle_type"]["selectedOption"]["value"])) {
                                sControleType = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["controle_type"]["selectedOption"]["value"];
                            }
                        }
                        aFormFieldsToDisplay = oFormFieldsToDisplay[sControleType];
                    } else {
                        aFormFieldsToDisplay = oFormFieldsToDisplay[envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["controle_type"]];
                    }
                    $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
                }
            }
            // Affiche et cache les champs de form. suivant le type de contrôle.
            var oControleType = formSrvc["getFormElementDefinition"]("controle_type", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
            document.getElementById(oControleType["id"]).addEventListener("change", function () {
                if (typeof (oFormFieldsToDisplay[this.value]) != "undefined")
                    aFormFieldsToDisplay = oFormFieldsToDisplay[this.value];
                aFormFieldsToDisplay = aFormFieldsToDisplay.concat(aFormFieldsToConcat);
                $rootScope["displayFormFields"](aFormFieldsToDisplay);
            });
            // Conversion des dates au format Fr.
            var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
            if (goog.isDefAndNotNull(oFormValues["des_date_control"]))
                oFormValues["des_date_control"] = moment(oFormValues["des_date_control"]).format('L');
            if (goog.isDefAndNotNull(oFormValues["des_date_installation"]))
                oFormValues["des_date_installation"] = moment(oFormValues["des_date_installation"]).format('L');
            if (goog.isDefAndNotNull(oFormValues["des_date_recommande"]))
                oFormValues["des_date_recommande"] = moment(oFormValues["des_date_recommande"]).format('L');
            if (goog.isDefAndNotNull(oFormValues["dep_date_depot"]))
                oFormValues["dep_date_depot"] = moment(oFormValues["dep_date_depot"]).format('L');
            if (goog.isDefAndNotNull(oFormValues["dep_date_envoi_incomplet"]))
                oFormValues["dep_date_envoi_incomplet"] = moment(oFormValues["dep_date_envoi_incomplet"]).format('L');
        });
    };

    /**
     * displayFormFields function.
     * Affiche la liste des champs de formulaire passée en paramètre et cache les autres.
     * @param {array} aFormFieldsToDisplay Tableau de champs de formulaire à afficher.
     **/
    angular.element(vitisApp.appMainDrtv).scope()["displayFormFields"] = function (aFormFieldsToDisplay) {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        var externFunctionSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["externFunctionSrvc"]);
        //
        $log.info("displayFormFields");
        //
        var aFormFields = formSrvc["getAllFormElementDefinition"](envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
        var i;
        if (Array.isArray(aFormFields)) {
            for (i = 0; i < aFormFields.length; i++) {
                if (aFormFieldsToDisplay.indexOf(aFormFields[i]["name"]) == -1)
                    aFormFields[i]["visible"] = false;
                else
                    aFormFields[i]["visible"] = true;
            }
            // Rafraîchit le formulaire.
            var formScope = angular.element("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"]).scope();
            formScope.$broadcast('$$rebind::refresh');
            formScope.$applyAsync();
            //
            externFunctionSrvc["resizeWin"]();
        }
    };

    /**
     * initAncInstallationForm function.
     * Traitements avant l'affichage du formulaire de la section "Habitation" de l'onglet "Installation".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncInstallationForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("initAncInstallationForm");
        var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
        // Affiche l'id de la parcelle sélectionnée dans le label 'Id Parcelle'.
        if (envSrvc["sMode"] != "insert")
            oFormValues["parcelle"] = oFormValues["id_parc"];
        // Attends la fin du chargement de tous les champs du formulaire.
        var clearListener = $rootScope.$on('formExtracted', function (event, sFormDefinitionName) {
            // Supprime le "listener".
            clearListener();
            //
            //  Charge les données de la commune sélectionnée
            var oIdParc = formSrvc["getFormElementDefinition"]("id_parc", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
            var formScope = angular.element("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"]).scope();
            document.getElementById(oIdParc["id"]).addEventListener("change", function () {
                var sIdParc = this.value;
                // Charge les données de la parcelle.
                ajaxRequest({
                    "method": "GET",
                    "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/cadastreV2/fichedescriptiveparcelle/" + sIdParc,
                    "scope": $rootScope,
                    "success": function (response) {
                        if (response["data"]["status"] != 0) {
                            // Label de l'id de la parcelle.
                            oFormValues["parcelle"] = sIdParc;
                            // Trim() des données de la parcelle.
                            var oParcelle = response["data"]["data"];
                            var aKeys = Object.keys(oParcelle);
                            for (var i = 0; i < aKeys.length; i++) {
                                if (typeof (oParcelle[aKeys[i]]) == "string")
                                    oParcelle[aKeys[i]] = oParcelle[aKeys[i]].trim();
                            }
                            oFormValues["parc_sup"] = oParcelle["sup_fiscale"];
                            oFormValues["parc_adresse"] = oParcelle["DVOILIB"];
                            //oFormValues["code_postal"] = oParcelle["ID_COM"];
                            if (goog.isDefAndNotNull(oParcelle["commune"]) && oParcelle["commune"] != "")
                                oFormValues["parc_commune"] = oParcelle["commune"];
                            else
                                oFormValues["parc_commune"] = oFormValues["id_com"]["selectedOption"]["label"];

                            // Charge le code postal de la commune.
                            if (goog.isDefAndNotNull(propertiesSrvc["anc"]["code_postal"])) {
                                var sCodePostalSchema = propertiesSrvc["anc"]["code_postal"]["schema"];
                                var sCodePostalTable = propertiesSrvc["anc"]["code_postal"]["table"];
                                var sCodePostalColumn = propertiesSrvc["anc"]["code_postal"]["column"];
                                if ((goog.isDefAndNotNull(sCodePostalSchema) && sCodePostalSchema != "") && (goog.isDefAndNotNull(sCodePostalTable) && sCodePostalTable != "") && (goog.isDefAndNotNull(sCodePostalColumn) && sCodePostalColumn != "")) {
                                    var oUrlParams = {
                                        "schema": sCodePostalSchema,
                                        "table": sCodePostalTable,
                                        "filter": {
                                            "relation": "AND",
                                            "operators": [{
                                                    "column": "id_com",
                                                    "compare_operator": "=",
                                                    "value": oFormValues["id_com"]["selectedOption"]["value"]
                                                }]
                                        },
                                        "attributs": sCodePostalColumn
                                    };
                                    ajaxRequest({
                                        "method": "GET",
                                        "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vitis/genericquerys/" + sCodePostalTable,
                                        "params": oUrlParams,
                                        "scope": $rootScope,
                                        "success": function (response) {
                                            if (response["data"]["status"] != 0)
                                                oFormValues["code_postal"] = envSrvc["extractWebServiceData"]("genericquerys", response["data"])[0][sCodePostalColumn];
                                        }
                                    });
                                }
                            }

                            // Charge les données du propriétaire de la parcelle.
                            var oUrlParams = {
                                "schema": "s_majic",
                                "table": "v_vmap_parcelle_proprietaire",
                                "filter": {
                                    "relation": "AND",
                                    "operators": [{
                                            "column": "id_par",
                                            "compare_operator": "=",
                                            "value": sIdParc
                                        }]
                                },
                                "attributs": "prop_titre|prop_nom_prenom|prop_adresse|prop_code_postal|prop_commune"
                            };
                            ajaxRequest({
                                "method": "GET",
                                "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vitis/genericquerys/v_vmap_parcelle_proprietaire",
                                "params": oUrlParams,
                                "scope": $rootScope,
                                "success": function (response) {
                                    if (response["data"]["status"] != 0) {
                                        var oProprioParcelle = envSrvc["extractWebServiceData"]("genericquerys", response["data"])[0];
                                        if (typeof (oProprioParcelle) == "object") {
                                            // Trim() des données du propriétaire de la parcelle.
                                            var aKeys = Object.keys(oProprioParcelle);
                                            for (var i = 0; i < aKeys.length; i++) {
                                                if (typeof (oProprioParcelle[aKeys[i]]) == "string")
                                                    oProprioParcelle[aKeys[i]] = oProprioParcelle[aKeys[i]].trim();
                                            }
                                            oFormValues["prop_titre"] = oProprioParcelle["dqualp"];
                                            oFormValues["prop_nom_prenom"] = oProprioParcelle["ddenom"];
                                            oFormValues["prop_adresse"] = oProprioParcelle["dlign4"];
                                            oFormValues["prop_code_postal"] = oProprioParcelle["dlign6"].substr(0, oProprioParcelle["dlign6"].indexOf(" "));
                                            oFormValues["prop_commune"] = oProprioParcelle["dlign6"].substr(oProprioParcelle["dlign6"].indexOf(" "));

                                            /*
                                             // Charge les données du bâtiment de la parcelle.
                                             var oUrlParams = {
                                             "schema": "s_majic",
                                             "table": "v_vmap_parcelle_proprietaire_bati",
                                             "filter": {
                                             "relation": "AND",
                                             "operators": [{
                                             "column": "id_par",
                                             "compare_operator": "=",
                                             "value": sIdParc
                                             }]
                                             },
                                             };
                                             ajaxRequest({
                                             "method": "GET",
                                             "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/vitis/genericquerys/v_vmap_parcelle_proprietaire_bati",
                                             "params": oUrlParams,
                                             "scope": $rootScope,
                                             "success": function(response) {
                                             if (response["data"]["status"] != 0) {
                                             }
                                             var oBatiParcelle = envSrvc["extractWebServiceData"]("genericquerys", response["data"])[0];
                                             console.log(oBatiParcelle);
                                             }
                                             });
                                             */
                                            /*
                                             // Charge les données du bâtiment de la parcelle.
                                             oWebServiceBase = Restangular["one"](propertiesSrvc["services_alias"] + "/vitis", "genericquerys");
                                             var oUrlParams = {
                                             "schema": "s_majic",
                                             "table": "v_vmap_parcelle_proprietaire_bati",
                                             "filter": {
                                             "relation": "AND",
                                             "operators": [{
                                             "column": "id_par",
                                             "compare_operator": "=",
                                             "value": sIdParc
                                             }]
                                             },
                                             };
                                             oWebServiceBase["customGET"]("v_vmap_parcelle_proprietaire_bati", oUrlParams).then(function (data) {
                                             if (response["data"]["status"] != 0) {
                                             var oBatiParcelle = envSrvc["extractWebServiceData"]("genericquerys", response["data"])[0];

                                             oFormValues["bati_date_mutation"] = oBatiParcelle[""];

                                             //oFormValues["cont_zone_autre"] = oParcelle[""];
                                             //oFormValues["cont_zone_urba"] = oParcelle[""];
                                             //oFormValues["cont_zone_anc"] = oParcelle[""];
                                             } else {
                                             //
                                             var oOptions = {
                                             "className": "modal-danger"
                                             };
                                             // Message d'erreur ?
                                             if (response["data"]["errorMessage"] != null)
                                             oOptions["message"] = response["data"]["errorMessage"];
                                             $rootScope["modalWindow"]("alert", "REQUEST_ERROR", oOptions);
                                             }
                                             });
                                             */
                                        }
                                    } else {
                                        //
                                        var oOptions = {
                                            "className": "modal-danger"
                                        };
                                        // Message d'erreur ?
                                        if (response["data"]["errorMessage"] != null)
                                            oOptions["message"] = response["data"]["errorMessage"];
                                        $rootScope["modalWindow"]("alert", "REQUEST_ERROR", oOptions);
                                    }
                                }
                            });
                        } else {
                            //
                            var oOptions = {
                                "className": "modal-danger"
                            };
                            // Message d'erreur ?
                            if (response["data"]["errorMessage"] != null)
                                oOptions["message"] = response["data"]["errorMessage"];
                            $rootScope["modalWindow"]("alert", "REQUEST_ERROR", oOptions);
                        }
                    }
                });

                //

                //formScope.$broadcast('$$rebind::refresh');
                //
                formScope.$apply();
            });
        });
    };

    /**
     * initAncInstallationSuiviForm function.
     * Traitements avant l'affichage du formulaire de la section "Suivi" de l'onglet "Installation".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncInstallationSuiviForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("initAncInstallationSuiviForm");
        // Attends la fin du chargement de tous les champs du formulaire.
        var clearListener = $rootScope.$on('formExtracted', function (event, sFormDefinitionName) {
            // Supprime le "listener".
            clearListener();
            // Conversion des dates au format Fr.
            var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
            oFormValues["create_date"] = moment(oFormValues["create_date"]).format('L');
            if (goog.isDefAndNotNull(oFormValues["maj_date"]))
                oFormValues["maj_date"] = moment(oFormValues["maj_date"]).format('L');
            var formScope = angular.element("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"]).scope();
            formScope.$apply();
        });
    };

    /**
     * initAncPretraitementForm function.
     * Traitements avant l'affichage du formulaire de la section "Dossier" de l'onglet "Contrôle".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncPretraitementForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("initAncPretraitementForm");
        //
        var clearListener = $rootScope.$on('formExtracted', function (event, sFormDefinitionName) {
            // Supprime le "listener".
            clearListener();
            // Champs de form. à afficher suivant le type de contrôle et le mode du form.
            var aFormFieldsToConcat = [envSrvc["sMode"] + "_button", "id_pretraitement", "id_installation", "id_controle"];
            var oFormFieldsToDisplay, aFormFieldsToDisplay = [];
            if (envSrvc["sMode"] == "search") {
                //oFormFieldsToDisplay = {
                //    "BON FONCTIONNEMENT": ["controle_ss_type", "des_date_control", "des_interval_control", "des_refus_visite", "cl_avis", "cl_classe_cbf", "cl_date_avis", "cl_auteur_avis", "cl_date_prochain_controle", "cl_facture"],
                //    "CONCEPTION": ["dep_date_depot", "dep_dossier_complet", "cl_avis", "cl_date_avis", "cl_auteur_avis", "cl_date_prochain_controle", "cl_facture"],
                //    "REALISATION": ["des_date_control", "des_interval_control", "des_refus_visite", "cl_avis", "cl_date_avis", "cl_auteur_avis", "cl_date_prochain_controle", "cl_facture"]
                //};
                //$rootScope["displayFormFields"](aFormFieldsToConcat);
            } else {
                oFormFieldsToDisplay = {
                    "BON FONCTIONNEMENT": ["tra_dist_hab", "ptr_im_puit", "ptr_adapte", "ptr_type_eau", "ptr_type", "ptr_volume", "ptr_marque", "ptr_materiau", "ptr_cloison", "ptr_commentaire", "ptr_im_distance", "ptr_im_acces", "ptr_et_degrad", "ptr_et_real", "ptr_vi_date", "ptr_vi_justi", "ptr_vi_entr", "ptr_vi_bord", "ptr_vi_dest", "ptr_vi_perc", "maj", "maj_date", "create", "create_date", "Element_0", "Element_1", "Element_2", "Element_3", "Element_4"],
                    "CONCEPTION": ["ptr_type", "ptr_volume", "ptr_marque", "ptr_materiau", "ptr_commentaire", "ptr_im_distance", "maj", "maj_date", "create", "create_date", "Element_0", "Element_1", "Element_4"],
                    "REALISATION": ["ptr_type", "ptr_volume", "ptr_marque", "ptr_materiau", "ptr_commentaire", "ptr_im_distance", "ptr_im_hydrom", "maj", "maj_date", "create", "create_date", "Element_0", "Element_4", "ptr_pose", "ptr_adapte", "ptr_conforme_projet", "ptr_renforce", "ptr_verif_mise_en_eau", "ptr_type_eau", "ptr_im_dalle", "ptr_im_puit", "tra_dist_hab"]
                };
                if (envSrvc["sMode"] == "insert")
                    $rootScope["displayFormFields"](aFormFieldsToConcat);
                else {
                    aFormFieldsToDisplay = oFormFieldsToDisplay[envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["controle_type"]];
                    $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
                }
            }

            // Affiche et cache les champs de form. suivant le type de contrôle.
            var oControl = formSrvc["getFormElementDefinition"]("id_controle", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
            document.getElementById(oControl["id"]).addEventListener("change", function () {
                var iIdControl = this.value;
                // Charge les données du contrôle.
                ajaxRequest({
                    "method": "GET",
                    "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/anc/controles/" + iIdControl,
                    "scope": $rootScope,
                    "success": function (response) {
                        var oControl = envSrvc["extractWebServiceData"]("controles", response["data"])[0];
                        var aFormFieldsToDisplay = oFormFieldsToDisplay[oControl["controle_type"]];
                        $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
                    }
                });
            });
        });
        // Conversion des dates.
        var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
        if (goog.isDefAndNotNull(oFormValues["create_date"]))
            oFormValues["create_date"] = moment(oFormValues["create_date"]).format('L');
        if (goog.isDefAndNotNull(oFormValues["maj_date"]))
            oFormValues["maj_date"] = moment(oFormValues["maj_date"]).format('L');
        if (goog.isDefAndNotNull(oFormValues["ptr_vi_date"]))
            oFormValues["ptr_vi_date"] = moment(oFormValues["ptr_vi_date"]).format('L');
    };

    /**
     * loadAncPretraitementsControl function.
     * Chargement de la section "Prétraitement" de l'onglet "Contrôle".
     */
    angular.element(vitisApp.appMainDrtv).scope()["loadAncPretraitementsControl"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("loadAncPretraitementsControl");
        // Sauve certaines données de la liste.
        var sSortedBy = envSrvc["oSelectedObject"]["sorted_by"];
        var sSortedDir = envSrvc["oSelectedObject"]["sorted_dir"];
        var sEditColumn = envSrvc["oSelectedObject"]["edit_column"];
        var sShowColumn = envSrvc["oSelectedObject"]["show_column"];
        // "sIdField" pour les boutons du mode "update" et "display".
        envSrvc["oSelectedObject"]["sIdField"] = "id_controle";
        // Colonne et sens de tri.
        envSrvc["oSelectedObject"]["sorted_by"] = "id_pretraitement";
        envSrvc["oSelectedObject"]["sorted_dir"] = "ASC";
        envSrvc["oSelectedObject"]["edit_column"] = "editModalSectionForm";
        envSrvc["oSelectedObject"]["show_column"] = "showModalSectionForm";
        // Affiche la liste des prétraitements du contrôle.
        $translate(["GRID_TITLE_ANC_SAISIE_ANC_CONTROLE_CONTROLE_PRETRAITEMENT"]).then(function (oTranslations) {
            // Paramètres de la liste + boutons.
            var oGridOptions = {
                "appHeader": true,
                "appHeaderSearchForm": false,
                "appGridTitle": oTranslations["GRID_TITLE_ANC_SAISIE_ANC_CONTROLE_CONTROLE_PRETRAITEMENT"],
                "appShowActions": true,
                "appIdField": "id_pretraitement"
            };
            //
            $rootScope["loadSectionList"](oGridOptions);
        });
        // Attends que les boutons du "header" soient ajoutés.
        var clearListener = $rootScope.$on('workspaceListHeaderActionsAdded', function (event, oGridOptions) {
            // Supprime le "listener".
            clearListener();
            // Restaure les données originales de la liste.
            envSrvc["oSelectedObject"]["sorted_by"] = sSortedBy;
            envSrvc["oSelectedObject"]["sorted_dir"] = sSortedDir;
            envSrvc["oSelectedObject"]["edit_column"] = sEditColumn;
            envSrvc["oSelectedObject"]["show_column"] = sShowColumn;
            // Boutons d'ajout et de suppression d'un traitement.
            for (var i = 0; i < oGridOptions["appActions"].length; i++) {
                if (oGridOptions["appActions"][i]["name"].indexOf("_add") != -1)
                    oGridOptions["appActions"][i]["event"] = "addModalSectionForm()";
                else if (oGridOptions["appActions"][i]["name"].indexOf("_delete") != -1)
                    oGridOptions["appActions"][i]["event"] = "DeleteSelection({'sIdField':'id_pretraitement'})";
            }
        });
    };

    /**
     * initAncControlDryToiletsForm function.
     * Traitements avant l'affichage du formulaire de la section "Dossier" de l'onglet "Contrôle".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncControlDryToiletsForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("initAncControlDryToiletsForm");
        // Attends la fin de l'affichage du formulaire.
        var clearListener = $rootScope.$on('formExtracted', function (event, sFormDefinitionName) {
            // Supprime le "listener".
            clearListener();
            // Champs de form. à afficher suivant le type de contrôle.
            var aFormFieldsToConcat = [envSrvc["sMode"] + "_button"];
            var oFormFieldsToDisplay;
            oFormFieldsToDisplay = {
                "BON FONCTIONNEMENT": ["ts_type_effluent", "ts_capacite_bac", "ts_nb_bac", "ts_coher_taille_util", "ts_aire_etanche", "ts_aire_abri", "ts_ventilation", "ts_cuve_etanche", "ts_val_comp", "ts_ruissel_ep", "ts_absence_nuisance", "ts_respect_regles", "ts_commentaires"],
                "CONCEPTION": ["ts_type_effluent", "ts_capacite_bac", "ts_nb_bac", "ts_val_comp", "ts_commentaires"],
                "REALISATION": ["ts_conforme", "ts_type_effluent", "ts_capacite_bac", "ts_nb_bac", "ts_aire_etanche", "ts_aire_abri", "ts_ventilation", "ts_cuve_etanche", "ts_val_comp", "ts_commentaires"]
            };
            var aFormFieldsToDisplay = oFormFieldsToDisplay[envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["controle_type"]];
            $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
        });
    };

    /**
     * initAncControlVentilationForm function.
     * Traitements avant l'affichage du formulaire de la section "Ventilation" de l'onglet "Contrôle".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncControlVentilationForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("initAncControlVentilationForm");
        //
        var clearListener = $rootScope.$on('formExtracted', function (event, sFormDefinitionName) {
            // Supprime le "listener".
            clearListener();
            // Champs de form. à afficher suivant le type de contrôle.
            var aFormFieldsToConcat = [envSrvc["sMode"] + "_button"];
            var oFormFieldsToDisplay;
            oFormFieldsToDisplay = {
                "BON FONCTIONNEMENT": ["vt_primaire", "vt_secondaire", "vt_prim_loc", "vt_prim_ht", "vt_prim_type_extract", "vt_second_loc", "vt_second_ht", "vt_prim_diam", "vt_second_diam", "vt_second_type_extract", "vt_prim_type_materiau", "vt_second_type_materiau", "Element_0", "Element_1", "Element_2", "vt_commentaire"],
                "CONCEPTION": ["vt_primaire", "emplacement_vt_secondaire"],
                "REALISATION": ["vt_primaire", "vt_secondaire", "vt_prim_loc", "vt_prim_ht", "vt_prim_type_extract", "vt_second_loc", "vt_second_ht", "vt_prim_diam", "vt_second_diam", "vt_second_type_extract", "vt_prim_type_materiau", "vt_second_type_materiau", "Element_0", "Element_1", "Element_2", "vt_commentaire"]
            };
            var aFormFieldsToDisplay = oFormFieldsToDisplay[envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["controle_type"]];
            $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
        });
    };

    /**
     * loadAncTraitementsControl function.
     * Chargement de la section "Prétraitement" de l'onglet "Contrôle".
     */
    angular.element(vitisApp.appMainDrtv).scope()["loadAncTraitementsControl"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("loadAncTraitementsControl");
        // Sauve certaines données de la liste.
        var sSortedBy = envSrvc["oSelectedObject"]["sorted_by"];
        var sSortedDir = envSrvc["oSelectedObject"]["sorted_dir"];
        var sEditColumn = envSrvc["oSelectedObject"]["edit_column"];
        var sShowColumn = envSrvc["oSelectedObject"]["show_column"];
        // Colonne et sens de tri.
        envSrvc["oSelectedObject"]["sorted_by"] = "id_traitement";
        envSrvc["oSelectedObject"]["sorted_dir"] = "ASC";
        envSrvc["oSelectedObject"]["edit_column"] = "editModalSectionForm";
        envSrvc["oSelectedObject"]["show_column"] = "showModalSectionForm";
        // "sIdField" pour les boutons du mode "update" et "display".
        envSrvc["oSelectedObject"]["sIdField"] = "id_controle";
        // Affiche la liste des prétraitements du contrôle.
        $translate(["GRID_TITLE_ANC_SAISIE_ANC_CONTROLE_CONTROLE_TRAITEMENT"]).then(function (oTranslations) {
            // Paramètres de la liste + boutons.
            var oGridOptions = {
                "appHeader": true,
                "appHeaderSearchForm": false,
                "appGridTitle": oTranslations["GRID_TITLE_ANC_SAISIE_ANC_CONTROLE_CONTROLE_TRAITEMENT"],
                "appShowActions": true,
                "appIdField": "id_traitement"
            };
            //
            $rootScope["loadSectionList"](oGridOptions);
        });
        // Attends que les boutons du "header" soient ajoutés.
        var clearListener = $rootScope.$on('workspaceListHeaderActionsAdded', function (event, oGridOptions) {
            // Supprime le "listener".
            clearListener();
            // Restaure les données originales de la liste.
            envSrvc["oSelectedObject"]["sorted_by"] = sSortedBy;
            envSrvc["oSelectedObject"]["sorted_dir"] = sSortedDir;
            envSrvc["oSelectedObject"]["edit_column"] = sEditColumn;
            envSrvc["oSelectedObject"]["show_column"] = sShowColumn;
            // Boutons d'ajout et de suppression d'un traitement.
            for (var i = 0; i < oGridOptions["appActions"].length; i++) {
                if (oGridOptions["appActions"][i]["name"].indexOf("_add") != -1)
                    oGridOptions["appActions"][i]["event"] = "addModalSectionForm()";
                else if (oGridOptions["appActions"][i]["name"].indexOf("_delete") != -1)
                    oGridOptions["appActions"][i]["event"] = "DeleteSelection({'sIdField':'id_traitement'})";
            }
        });
    };

    /**
     * initAncTraitementForm function.
     * Traitements avant l'affichage du formulaire de l'onglet "Traitement".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncTraitementForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("initAncTraitementForm");
        // Attends la fin de l'affichage du formulaire.
        var clearListener = $rootScope.$on("formExtracted", function (event, sFormDefinitionName) {
            // Supprime le "listener".
            clearListener();
            // Champs de form. à afficher suivant le type de contrôle et le mode du form.
            var aFormFieldsToConcat = [envSrvc["sMode"] + "_button", "id_traitement", "id_controle", "tra_type", "id_installation"];
            var oFormFieldsToDisplay, aFormFieldsToDisplay = [];
            var sControleType;
            if (envSrvc["sMode"] == "search") {
                /*
                 oFormFieldsToDisplay = {
                 "BON FONCTIONNEMENT": ["controle_ss_type", "des_date_control", "des_interval_control", "des_refus_visite", "cl_avis", "cl_classe_cbf", "cl_date_avis", "cl_auteur_avis", "cl_date_prochain_controle", "cl_facture"],
                 "CONCEPTION": ["dep_date_depot", "dep_dossier_complet", "cl_avis", "cl_date_avis", "cl_auteur_avis", "cl_date_prochain_controle", "cl_facture"],
                 "REALISATION": ["des_date_control", "des_interval_control", "des_refus_visite", "cl_avis", "cl_date_avis", "cl_auteur_avis", "cl_date_prochain_controle", "cl_facture"]
                 };
                 $rootScope["displayFormFields"](aFormFieldsToConcat);
                 */
            } else {
                oFormFieldsToDisplay = {
                    "BON FONCTIONNEMENT": ["tra_dist_hab", "tra_dist_lim_parc", "tra_dist_veget", "tra_dist_puit", "tra_regrep_mat", "tra_regrep_affl", "tra_regrep_equi", "tra_regbl_mat", "tra_regbl_affl", "tra_regcol_mat", "tra_regcol_affl", "maj", "maj_date", "create", "create_date", "Element_0", "Element_1", "Element_3", "Element_4", "Element_5", "Element_6"],
                    "CONCEPTION": ["maj", "maj_date", "create", "create_date", "Element_0", "Element_6"],
                    "REALISATION": ["tra_dist_lim_parc", "tra_dist_veget", "tra_dist_puit", "tra_vm_grav_qual", "tra_vm_grav_ep", "tra_vm_geo_text", "tra_vm_bon_mat", "tra_regrep_mat", "tra_regrep_affl", "tra_regrep_equi", "tra_regrep_perf", "tra_regbl_mat", "tra_regbl_affl", "tra_regbl_hz", "tra_regbl_epand", "tra_regbl_perf", "tra_regcol_mat", "tra_regcol_affl", "tra_regcol_hz", "maj", "maj_date", "create", "create_date", "Element_0", "Element_1", "Element_2", "Element_3", "Element_4", "Element_5", "Element_6", "tra_dist_hab", "tra_vm_racine", "tra_vm_humidite", "tra_vm_imper", "tra_vm_geogrille", "tra_vm_tuy_perf", "tra_vm_sab_qual", "tra_vm_sab_ep", "tra_vm_geomembrane"]
                };
                //
                var setTypeTraitement = function (event) {

                    var sTraType;
                    if (typeof (event) != "undefined")
                        sTraType = event.target.value;
                    else
                        sTraType = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["tra_type"]["selectedOption"]["value"];

                    if (goog.isObject(sTraType)) {
                        if (goog.isDefAndNotNull(sTraType['selectedOption'])) {
                            if (goog.isDefAndNotNull(sTraType['selectedOption']['value'])) {
                                sTraType = angular.copy(sTraType['selectedOption']['value']);
                            }
                        }
                    }

                    if (typeof (sControleType) != "undefined" && sControleType != "") {
                        if (sTraType == "TRANCHÉES D'EPANDAGE")
                            $rootScope["displayFormFields"](oFormFieldsToDisplay[sControleType].concat(["tra_nb", "tra_longueur", "tra_tot_lin", "tra_profond", "tra_largeur"]).concat(aFormFieldsToConcat));
                        else
                            $rootScope["displayFormFields"](oFormFieldsToDisplay[sControleType].concat(["tra_long", "tra_larg", "tra_surf", "tra_profondeur"]).concat(aFormFieldsToConcat));
                    }
                }
                //
                //
                var oTypeTraitement = formSrvc["getFormElementDefinition"]("tra_type", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
                if (envSrvc["sMode"] == "insert")
                    $rootScope["displayFormFields"](aFormFieldsToConcat);
                else {
                    if (typeof (envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["controle_type"]) == "string")
                        sControleType = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["controle_type"];
                    else
                        sControleType = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["controle_type"]["selectedOption"]["value"];
                    setTypeTraitement();
                }
            }
            // Affiche et cache les champs de form. suivant le type de contrôle.
            var oControl = formSrvc["getFormElementDefinition"]("id_controle", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
            document.getElementById(oControl["id"]).addEventListener("change", function () {
                var iIdControl = this.value;
                // Charge les données du contrôle.
                ajaxRequest({
                    "method": "GET",
                    "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/anc/controles/" + iIdControl,
                    "scope": $rootScope,
                    "success": function (response) {
                        var oControl = envSrvc["extractWebServiceData"]("controles", response["data"])[0];
                        sControleType = oControl["controle_type"];
                        var aFormFieldsToDisplay = oFormFieldsToDisplay[oControl["controle_type"]];
                        $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
                    }
                });
            });
            // Affichage de certains champs suivant le type de contrôle.
            document.getElementById(oTypeTraitement["id"]).addEventListener("change", setTypeTraitement)
        });
        // Conversion des dates.
        var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
        if (goog.isDefAndNotNull(oFormValues["create_date"]))
            oFormValues["create_date"] = moment(oFormValues["create_date"]).format('L');
        if (goog.isDefAndNotNull(oFormValues["maj_date"]))
            oFormValues["maj_date"] = moment(oFormValues["maj_date"]).format('L');
    };

    /**
     * initAncFilieresAgreeesForm function.
     * Traitements avant l'affichage du formulaire de l'onglet "Traitement".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncFilieresAgreeesForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("initAncFilieresAgreeesForm");
        //
        var clearListener = $rootScope.$on("formExtracted", function (event, sFormDefinitionName) {
            // Supprime le "listener".
            clearListener();
            // Champs de form. à afficher suivant le type de contrôle et le mode du form.
            var aFormFieldsToConcat = [envSrvc["sMode"] + "_button", "id_fag", "id_controle", "id_installation"];
            var oFormFieldsToDisplay, aFormFieldsToDisplay = [];
            if (envSrvc["sMode"] == "search") {
                /*
                 oFormFieldsToDisplay = {
                 "BON FONCTIONNEMENT": ["controle_ss_type", "des_date_control", "des_interval_control", "des_refus_visite", "cl_avis", "cl_classe_cbf", "cl_date_avis", "cl_auteur_avis", "cl_date_prochain_controle", "cl_facture"],
                 "CONCEPTION": ["dep_date_depot", "dep_dossier_complet", "cl_avis", "cl_date_avis", "cl_auteur_avis", "cl_date_prochain_controle", "cl_facture"],
                 "REALISATION": ["des_date_control", "des_interval_control", "des_refus_visite", "cl_avis", "cl_date_avis", "cl_auteur_avis", "cl_date_prochain_controle", "cl_facture"]
                 };
                 $rootScope["displayFormFields"](aFormFieldsToConcat);
                 */
            } else {
                oFormFieldsToDisplay = {
                    "BON FONCTIONNEMENT": ["id_fag", "id_controle", "fag_type", "fag_agree", "fag_integerer", "fag_denom", "fag_fab", "fag_num_ag", "fag_cap_eh", "fag_nb_cuv", "fag_et_deg", "fag_et_od", "fag_et_dy", "fag_en_date", "fag_en_jus", "fag_en_entr", "fag_en_bord", "fag_en_dest", "fag_en_perc", "fag_en_contr", "fag_en_mainteger", "fag_dist_arb", "fag_dist_parc", "fag_dist_hab", "fag_dist_cap", "maj", "maj_date", "create", "create_date", "Element_6", "Element_7", "Element_8", "fag_num", "fag_num_filt", "fag_mat_cuv", "fag_guide", "fag_contr", "fag_soc", "Element_0", "fag_pres", "fag_tamp", "fag_ventil", "fag_mil_typ", "fag_mil_filt", "fag_pres_reg", "fag_pres_alar", "fag_commentaires"],
                    "CONCEPTION": ["id_fag", "id_controle", "fag_type", "fag_agree", "fag_integerer", "fag_denom", "fag_fab", "fag_num_ag", "fag_cap_eh", "fag_nb_cuv", "maj", "maj_date", "create", "create_date"],
                    "REALISATION": ["id_fag", "id_controle", "fag_type", "fag_agree", "fag_integerer", "fag_denom", "fag_fab", "fag_num_ag", "fag_cap_eh", "fag_nb_cuv", "fag_surpr", "fag_surpr_ref", "fag_surpr_dist", "fag_surpr_elec", "fag_surpr_aer", "fag_reac_bull", "fag_broy", "fag_dec", "fag_type_eau", "fag_reg_mar", "fag_reg_mat", "fag_reg_affl", "fag_reg_hz", "fag_reg_van", "fag_fvl_nb", "fag_fvl_long", "fag_fvl_larg", "fag_fvl_prof", "fag_fvl_sep", "fag_fvl_pla", "fag_fvl_drain", "fag_fvl_resp", "fag_fhz_long", "fag_fhz_larg", "fag_fhz_prof", "fag_fhz_drain", "fag_fhz_resp", "fag_mat_qual", "fag_mat_epa", "fag_pres_veg", "fag_pres_pro", "maj", "maj_date", "create", "create_date", "Element_1", "Element_2", "Element_3", "Element_5", "fag_num", "fag_num_filt", "fag_mat_cuv", "fag_guide", "fag_contr", "fag_soc", "fag_soc", "fag_livret", "Element_0", "fag_pres", "fag_plan", "fag_tamp", "fag_ancrage", "fag_ventil", "fag_mil_typ", "fag_mil_filt", "fag_mise_eau", "fag_pres_alar", "fag_pres_reg", "fag_pres", "fag_plan", "fag_tamp", "fag_rep", "fag_respect", "fag_att_conf", "Element_10", "fag_commentaires"]
                };
                if (envSrvc["sMode"] == "insert")
                    $rootScope["displayFormFields"](aFormFieldsToConcat);
                else {
                    aFormFieldsToDisplay = oFormFieldsToDisplay[envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["controle_type"]];
                    $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
                }
            }

            // Affiche et cache les champs de form. suivant le type de contrôle.
            var oControl = formSrvc["getFormElementDefinition"]("id_controle", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
            document.getElementById(oControl["id"]).addEventListener("change", function () {
                var iIdControl = this.value;
                // Charge les données du contrôle.
                ajaxRequest({
                    "method": "GET",
                    "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/anc/controles/" + iIdControl,
                    "scope": $rootScope,
                    "success": function (response) {
                        var oControl = envSrvc["extractWebServiceData"]("controles", response["data"])[0];
                        var aFormFieldsToDisplay = oFormFieldsToDisplay[oControl["controle_type"]];
                        $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
                    }
                });
            });
            // Conversion des dates.
            var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
            var sFagEnDate = oFormValues["fag_en_date"];
            if (goog.isDefAndNotNull(sFagEnDate) && sFagEnDate != "")
                oFormValues["fag_en_date"] = moment(sFagEnDate).format("L")
            if (goog.isDefAndNotNull(oFormValues["create_date"]))
                oFormValues["create_date"] = moment(oFormValues["create_date"]).format('L');
            if (goog.isDefAndNotNull(oFormValues["maj_date"]))
                oFormValues["maj_date"] = moment(oFormValues["maj_date"]).format('L');
        });
    };

    /**
     * loadAncFilieresAgreeesControl function.
     * Chargement de la section "Filières aggréées" de l'onglet "Contrôle".
     */
    angular.element(vitisApp.appMainDrtv).scope()["loadAncFilieresAgreeesControl"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("loadAncFilieresAgreeesControl");
        // Sauve certaines données de la liste.
        var sSortedBy = envSrvc["oSelectedObject"]["sorted_by"];
        var sSortedDir = envSrvc["oSelectedObject"]["sorted_dir"];
        var sEditColumn = envSrvc["oSelectedObject"]["edit_column"];
        var sShowColumn = envSrvc["oSelectedObject"]["show_column"];
        // "sIdField" pour les boutons du mode "update" et "display".
        envSrvc["oSelectedObject"]["sIdField"] = "id_controle";
        // Colonne et sens de tri.
        envSrvc["oSelectedObject"]["sorted_by"] = "id_fag";
        envSrvc["oSelectedObject"]["sorted_dir"] = "ASC";
        envSrvc["oSelectedObject"]["edit_column"] = "editModalSectionForm";
        envSrvc["oSelectedObject"]["show_column"] = "showModalSectionForm";
        // Affiche la liste des prétraitements du contrôle.
        $translate(["GRID_TITLE_ANC_SAISIE_ANC_CONTROLE_CONTROLE_PRETRAITEMENT"]).then(function (oTranslations) {
            // Paramètres de la liste + boutons.
            var oGridOptions = {
                "appHeader": true,
                "appHeaderSearchForm": false,
                "appGridTitle": oTranslations["GRID_TITLE_ANC_SAISIE_ANC_CONTROLE_CONTROLE_PRETRAITEMENT"],
                "appShowActions": true,
                "appIdField": "id_fag"
            };
            //
            $rootScope["loadSectionList"](oGridOptions);
        });
        // Attends que les boutons du "header" soient ajoutés.
        var clearListener = $rootScope.$on('workspaceListHeaderActionsAdded', function (event, oGridOptions) {
            // Supprime le "listener".
            clearListener();
            // Restaure les données originales de la liste.
            envSrvc["oSelectedObject"]["sorted_by"] = sSortedBy;
            envSrvc["oSelectedObject"]["sorted_dir"] = sSortedDir;
            envSrvc["oSelectedObject"]["edit_column"] = sEditColumn;
            envSrvc["oSelectedObject"]["show_column"] = sShowColumn;
            // Boutons d'ajout et de suppression d'un traitement.
            for (var i = 0; i < oGridOptions["appActions"].length; i++) {
                if (oGridOptions["appActions"][i]["name"].indexOf("_add") != -1)
                    oGridOptions["appActions"][i]["event"] = "addModalSectionForm()";
                else if (oGridOptions["appActions"][i]["name"].indexOf("_delete") != -1)
                    oGridOptions["appActions"][i]["event"] = "DeleteSelection({'sIdField':'id_fag'})";
            }
        });
    };

    /**
     * initAncControlDispositifsAnnexesForm function.
     * Traitements avant l'affichage du formulaire de la section "Dispositifs Annexes" de l'onglet "Contrôle".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncControlDispositifsAnnexesForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("initAncControlDispositifsAnnexesForm");
        //
        var clearListener = $rootScope.$on('formExtracted', function (event, sFormDefinitionName) {
            // Supprime le "listener".
            clearListener();
            // Champs de form. à afficher suivant le type de contrôle.
            var aFormFieldsToConcat = [envSrvc["sMode"] + "_button", "Element_1", "Element_2"];
            var oFormFieldsToDisplay;
            oFormFieldsToDisplay = {
                "BON FONCTIONNEMENT": ["da_chasse_acces", "da_chasse_pr_nat_eau", "da_chasse_dysfonctionnement", "da_chasse_degradation", "da_chasse_entretien", "da_pr_loc_pompe", "da_pr_acces", "da_pr_clapet", "da_pr_etanche", "da_pr_dysfonctionnement", "da_pr_degradation", "da_pr_entretien", "da_commentaires", "da_pr_ventilatio"],
                "CONCEPTION": ["da_chasse_auto", "da_chasse_pr_nat_eau", "da_pr_loc_pompe", "da_pr_nb_pompe", "da_pr_nat_eau", "da_commentaires"],
                "REALISATION": ["da_chasse_pr_nat_eau", "da_chasse_ok", "da_pr_loc_pompe", "da_pr_ok", "da_pr_clapet", "da_pr_etanche", "da_pr_branchement", "da_pr_ventilatio", "da_pr_alarme", "da_commentaires"]
            };
            var aFormFieldsToDisplay = oFormFieldsToDisplay[envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["controle_type"]];
            $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
        });
    };

    /**
     * initAncControlConclusionForm function.
     * Traitements avant l'affichage du formulaire de la section "Conclusion" de l'onglet "Contrôle".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncControlConclusionForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        //
        $log.info("initAncControlConclusionForm");
        var aClassesCbf = ["ABSENCE D'INSTALLATION", "NON CONFORME - DÉFAUT DE SÉCURITÉ SANITAIRE", "NON CONFORME - DÉFAUT DE STRUCTURE OU DE FERMETURE", "NON CONFORME - INSTALLATION IMPLANTÉE À MOINS DE 35M D'UN PUITS DÉCLARÉ ET UTILISÉ", "NON CONFORME - INSTALLATION INCOMPLÈTE", "NON CONFORME - INSTALLATION SIGNIFICATIVEMENT SOUS DIMENSIONNÉE", "NON CONFORME - INSTALLATION PRÉSENTANT DES DYSFONCTIONNEMENTS MAJEURS", "INSTALLATION NECESSITANT DES RECOMMANDATIONS DE TRAVAUX"];
        // Filtre pour le datasource du champ "Montant du contrôle" (année en cours et type de contrôle).
        if (envSrvc["sMode"] == "update") {
            var oClMontantDef = formSrvc["getFormElementDefinition"]("cl_montant", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
            var oClMontantDatasource = envSrvc['oFormDefinition']['datasources'][oClMontantDef["datasource"]["datasource_id"]];
            var oFirstSectionFormValues = envSrvc["oFormValues"][envSrvc["oSelectedObject"]["name"] + "_" + envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]["sections"][0]["name"] + "_" + envSrvc["sMode"] + "_form"];
            if (goog.isDefAndNotNull(oFirstSectionFormValues["des_date_control"])) {
                var aMatchResult = oFirstSectionFormValues["des_date_control"].match(/[0-9]{4}/);
                if (aMatchResult !== null)
                    oClMontantDatasource["parameters"]["filter"]["annee_validite"] = aMatchResult[0];
            }
            oClMontantDatasource["parameters"]["filter"]["controle_type"] = oFirstSectionFormValues["controle_type"]["selectedOption"]["value"];
        }
        //
        var clearListener = $rootScope.$on('formExtracted', function (event, sFormDefinitionName) {
            // Supprime le "listener".
            clearListener();
            // Champs de form. à afficher suivant le type de contrôle.
            var aFormFieldsToConcat = [envSrvc["sMode"] + "_button", "Element_1", "Element_2"];
            var oFormFieldsToDisplay;
            oFormFieldsToDisplay = {
                "BON FONCTIONNEMENT": ["cl_classe_cbf", "cl_commentaires", "cl_date_avis", "cl_auteur_avis", "cl_montant", "cl_facture", "cl_facture_le", "cl_constat", "cl_travaux"],
                "CONCEPTION": ["cl_avis", "cl_commentaires", "cl_date_avis", "cl_auteur_avis", "cl_montant", "cl_facture", "cl_facture_le"],
                "REALISATION": ["cl_commentaires", "cl_date_avis", "cl_auteur_avis", "cl_montant", "cl_facture", "cl_facture_le", "cl_classe_cbf"]
            };
            var aFormFieldsToDisplay = oFormFieldsToDisplay[envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["controle_type"]];
            $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
            //
            //var oClClasseCbfWarning = formSrvc["getFormElementDefinition"]("cl_classe_cbf_warning", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
            if (envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["controle_type"] == "BON FONCTIONNEMENT") {
                var sClClasseCbf = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["cl_classe_cbf"]["selectedOption"]["value"];
                if (aClassesCbf.indexOf(sClClasseCbf) != -1)
                    $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat).concat(["cl_classe_cbf_warning"]));
                else
                    $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
                // Rafraîchit le formulaire.
                /*
                 var formScope = angular.element("form[name='" + envSrvc["oFormDefinition"][envSrvc["sFormDefinitionName"]]["name"]).scope();
                 formScope.$broadcast('$$rebind::refresh');
                 formScope.$applyAsync();
                 */

                var oClClasseCbf = formSrvc["getFormElementDefinition"]("cl_classe_cbf", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
                document.getElementById(oClClasseCbf["id"]).addEventListener("change", function () {
                    if (aClassesCbf.indexOf(this.value) != -1)
                        $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat).concat(["cl_classe_cbf_warning"]));
                    else
                        $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
                });
            }
            // Conversion des dates.
            var sClDateAvis = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["cl_date_avis"];
            if (goog.isDefAndNotNull(sClDateAvis) && sClDateAvis != "")
                envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["cl_date_avis"] = moment(sClDateAvis).format("L")
            var sClFactureLe = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["cl_facture_le"];
            if (goog.isDefAndNotNull(sClFactureLe) && sClFactureLe != "")
                envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["cl_facture_le"] = moment(sClFactureLe).format("L")
        });
    };

    /**
     * initAncEvacuationEauxForm function.
     * Traitements avant l'affichage du formulaire de l'onglet "Evacuation des eaux".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncEvacuationEauxForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("initAncEvacuationEauxForm");
        //
        var clearListener = $rootScope.$on("formExtracted", function (event, sFormDefinitionName) {
            // Supprime le "listener".
            clearListener();
            // Champs de form. à afficher suivant le type de contrôle et le mode du form.
            var aFormFieldsToConcat = [envSrvc["sMode"] + "_button", "id_eva", "id_installation", "id_controle"];
            var oFormFieldsToDisplay, aFormFieldsToDisplay = [];
            oFormFieldsToDisplay = {
                "BON FONCTIONNEMENT": ["evacuation_eaux.id_eva", "id_controle", "evac_type", "evac_is_long", "evac_is_larg", "evac_is_surface", "evac_is_profondeur", "evac_is_reg_rep", "evac_is_reb_bcl", "evac_is_veg", "evac_is_acc_reg", "evac_rp_grav", "evac_rp_tamp", "evac_rp_type_eff", "evac_rp_trap", "evac_hs_type", "evac_hs_gestionnaire", "evac_hs_gestionnaire_auth", "evac_commentaires", "maj", "maj_date", "create", "create_date", "Element_0", "Element_1", "Element_2", "Element_4", "evac_is_lin_total", "evac_rp_type", "evac_hs_intr", "evac_hs_type_eff", "evac_hs_ecoul"],
                "CONCEPTION": ["evacuation_eaux.id_eva", "id_controle", "evac_type", "evac_is_long", "evac_is_larg", "evac_is_surface", "evac_is_profondeur", "evac_rp_etude_hydrogeol", "evac_rp_rejet", "evac_hs_type", "evac_hs_gestionnaire", "evac_hs_gestionnaire_auth", "evac_commentaires", "maj", "maj_date", "create", "create_date", "photos_f", "fiche_f", "schema_f", "documents_f", "plan_f", "Element_0", "Element_1", "Element_2", "Element_3", "Element_4", "evac_is_inf_perm"],
                "REALISATION": ["evacuation_eaux.id_eva", "id_controle", "evac_type", "evac_is_long", "evac_is_larg", "evac_is_surface", "evac_is_profondeur", "evac_is_geotex", "evac_is_rac", "evac_is_hum", "evac_is_reg_rep", "evac_is_reb_bcl", "evac_is_veg", "evac_rp_grav", "evac_rp_tamp", "evac_hs_type", "evac_commentaires", "maj", "maj_date", "create", "create_date", "Element_0", "Element_1", "Element_2", "Element_4", "evac_is_lin_total", "evac_rp_bons_grav", "evac_hs_intr", "evac_hs_type_eff", "evac_hs_ecoul"]
            };
            if (envSrvc["sMode"] == "insert")
                $rootScope["displayFormFields"](aFormFieldsToConcat);
            else {
                aFormFieldsToDisplay = oFormFieldsToDisplay[envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["controle_type"]];
                $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
            }

            // Affiche et cache les champs de form. suivant le type de contrôle.
            if (envSrvc["sMode"] != "display") {
                var oControl = formSrvc["getFormElementDefinition"]("id_controle", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
                document.getElementById(oControl["id"]).addEventListener("change", function () {
                    var iIdControl = this.value;
                    // Charge les données du contrôle.
                    ajaxRequest({
                        "method": "GET",
                        "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/anc/controles/" + iIdControl,
                        "scope": $rootScope,
                        "success": function (response) {
                            var oControl = envSrvc["extractWebServiceData"]("controles", response["data"])[0];
                            var aFormFieldsToDisplay = oFormFieldsToDisplay[oControl["controle_type"]];
                            $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
                        }
                    });
                });
            }
        });
        // Conversion des dates au format Fr.
        var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
        if (goog.isDefAndNotNull(oFormValues["create_date"]))
            oFormValues["create_date"] = moment(oFormValues["create_date"]).format('L');
        if (goog.isDefAndNotNull(oFormValues["maj_date"]))
            oFormValues["maj_date"] = moment(oFormValues["maj_date"]).format('L');
    };

    /**
     * loadAncEvacuationEauxControl function.
     * Chargement de la section "Prétraitement" de l'onglet "Contrôle".
     */
    angular.element(vitisApp.appMainDrtv).scope()["loadAncEvacuationEauxControl"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var $translate = angular.element(vitisApp.appMainDrtv).injector().get(["$translate"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("loadAncEvacuationEauxControl");
        // Sauve certaines données de la liste.
        var sSortedBy = envSrvc["oSelectedObject"]["sorted_by"];
        var sSortedDir = envSrvc["oSelectedObject"]["sorted_dir"];
        var sEditColumn = envSrvc["oSelectedObject"]["edit_column"];
        var sShowColumn = envSrvc["oSelectedObject"]["show_column"];
        // "sIdField" pour les boutons du mode "update" et "display".
        envSrvc["oSelectedObject"]["sIdField"] = "id_controle";
        // Colonne et sens de tri.
        envSrvc["oSelectedObject"]["sorted_by"] = "id_eva";
        envSrvc["oSelectedObject"]["sorted_dir"] = "ASC";
        envSrvc["oSelectedObject"]["edit_column"] = "editModalSectionForm";
        envSrvc["oSelectedObject"]["show_column"] = "showModalSectionForm";
        // Affiche la liste des prétraitements du contrôle.
        $translate(["GRID_TITLE_ANC_SAISIE_ANC_CONTROLE_CONTROLE_EVACUATION_EAUX"]).then(function (oTranslations) {
            // Paramètres de la liste + boutons.
            var oGridOptions = {
                "appHeader": true,
                "appHeaderSearchForm": false,
                "appGridTitle": oTranslations["GRID_TITLE_ANC_SAISIE_ANC_CONTROLE_CONTROLE_EVACUATION_EAUX"],
                "appShowActions": true,
                "appIdField": "id_eva"
            };
            //
            $rootScope["loadSectionList"](oGridOptions);
        });
        // Attends que les boutons du "header" soient ajoutés.
        var clearListener = $rootScope.$on('workspaceListHeaderActionsAdded', function (event, oGridOptions) {
            // Supprime le "listener".
            clearListener();
            // Restaure les données originales de la liste.
            envSrvc["oSelectedObject"]["sorted_by"] = sSortedBy;
            envSrvc["oSelectedObject"]["sorted_dir"] = sSortedDir;
            envSrvc["oSelectedObject"]["edit_column"] = sEditColumn;
            envSrvc["oSelectedObject"]["show_column"] = sShowColumn;
            // Boutons d'ajout et de suppression d'un traitement.
            for (var i = 0; i < oGridOptions["appActions"].length; i++) {
                if (oGridOptions["appActions"][i]["name"].indexOf("_add") != -1)
                    oGridOptions["appActions"][i]["event"] = "addModalSectionForm()";
                else if (oGridOptions["appActions"][i]["name"].indexOf("_delete") != -1)
                    oGridOptions["appActions"][i]["event"] = "DeleteSelection({'sIdField':'id_eva'})";
            }
        });
    };

    /**
     * initAncControlPretraitementForm function.
     * Traitements avant l'affichage du formulaire d'un prétraitement de la section "Prétraitement" de l'onglet "Contrôle".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncControlPretraitementForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var $timeout = angular.element(vitisApp.appMainDrtv).injector().get(["$timeout"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("initAncControlPretraitementForm");
        var scope = this;
        // Préremplissage de l'installation et du contrôle en mode "insert".
        var oParentFormValues = envSrvc["oFormValues"][envSrvc["oSelectedObject"]["name"] + "_" + envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]["sections"][0]["name"] + "_" + scope.$parent["sParentMode"] + "_form"];
        var oControl = formSrvc["getFormElementDefinition"]("id_controle", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
        if (envSrvc["sMode"] == "insert") {
            var oInstallation = formSrvc["getFormElementDefinition"]("id_installation", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
            oInstallation["default_value"] = oParentFormValues["id_installation"]["selectedOption"]["value"];
            oControl["default_value"] = oParentFormValues["id_controle"];
        }
        //
        var clearListener = $rootScope.$on('formExtracted', function (event, sFormDefinitionName) {
            // Supprime le "listener".
            clearListener();
            // Champs de form. à afficher suivant le type de contrôle et le mode du form.
            var aFormFieldsToConcat = [envSrvc["sMode"] + "_button", "id_pretraitement", "id_installation", "id_controle"];
            var oFormFieldsToDisplay, aFormFieldsToDisplay = [];
            oFormFieldsToDisplay = {
                "BON FONCTIONNEMENT": ["ptr_im_puit", "ptr_adapte", "ptr_type_eau", "ptr_type", "ptr_volume", "ptr_marque", "ptr_materiau", "ptr_cloison", "ptr_commentaire", "ptr_im_distance", "ptr_im_acces", "ptr_et_degrad", "ptr_et_real", "ptr_vi_date", "ptr_vi_justi", "ptr_vi_entr", "ptr_vi_bord", "ptr_vi_dest", "ptr_vi_perc", "maj", "maj_date", "create", "create_date", "Element_0", "Element_1", "Element_3", "Element_4"],
                "CONCEPTION": ["ptr_type", "ptr_volume", "ptr_marque", "ptr_materiau", "ptr_commentaire", "ptr_im_distance", "maj", "maj_date", "create", "create_date", "Element_0", "Element_1", "Element_4"],
                "REALISATION": ["ptr_type", "ptr_volume", "ptr_marque", "ptr_materiau", "ptr_commentaire", "ptr_im_distance", "ptr_im_hydrom", "maj", "maj_date", "create", "create_date", "Element_0", "Element_4", "ptr_pose", "ptr_adapte", "ptr_conforme_projet", "ptr_renforce", "ptr_verif_mise_en_eau", "ptr_type_eau", "ptr_im_dalle", "ptr_im_puit"]
            };
            if (typeof (oParentFormValues["controle_type"]) == "string")
                var sControleType = oParentFormValues["controle_type"];
            else
                var sControleType = oParentFormValues["controle_type"]["selectedOption"]["value"];
            aFormFieldsToDisplay = oFormFieldsToDisplay[sControleType];
            $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));

            // Affiche et cache les champs de form. suivant le type de contrôle.
            if (envSrvc["sMode"] != "display") {
                $timeout(function () {
                    document.getElementById(oControl["id"]).addEventListener("change", function () {
                        var iIdControl = this.value;
                        // Charge les données du contrôle.
                        ajaxRequest({
                            "method": "GET",
                            "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/anc/controles/" + iIdControl,
                            "scope": $rootScope,
                            "success": function (response) {
                                var oControl = envSrvc["extractWebServiceData"]("controles", response["data"])[0];
                                var aFormFieldsToDisplay = oFormFieldsToDisplay[oControl["controle_type"]];
                                $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
                            }
                        });
                    });
                });
            }
        });
        // Conversion des dates.
        var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
        if (goog.isDefAndNotNull(oFormValues["create_date"]))
            oFormValues["create_date"] = moment(oFormValues["create_date"]).format('L');
        if (goog.isDefAndNotNull(oFormValues["maj_date"]))
            oFormValues["maj_date"] = moment(oFormValues["maj_date"]).format('L');
        if (goog.isDefAndNotNull(oFormValues["ptr_vi_date"]))
            oFormValues["ptr_vi_date"] = moment(oFormValues["ptr_vi_date"]).format('L');
    };

    /**
     * initAncControlTraitementForm function.
     * Traitements avant l'affichage du formulaire d'un traitement de la section "Traitement" de l'onglet "Contrôle".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncControlTraitementForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var $timeout = angular.element(vitisApp.appMainDrtv).injector().get(["$timeout"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("initAncControlTraitementForm");
        var scope = this;
        // Préremplissage de l'installation et dy contrôle en mode "insert".
        var oParentFormValues = envSrvc["oFormValues"][envSrvc["oSelectedObject"]["name"] + "_" + envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]["sections"][0]["name"] + "_" + scope.$parent["sParentMode"] + "_form"];
        var oControl = formSrvc["getFormElementDefinition"]("id_controle", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
        if (envSrvc["sMode"] == "insert") {
            var oInstallation = formSrvc["getFormElementDefinition"]("id_installation", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
            oInstallation["default_value"] = oParentFormValues["id_installation"]["selectedOption"]["value"];
            oControl["default_value"] = oParentFormValues["id_controle"];
        }
        //
        var clearListener = $rootScope.$on("formExtracted", function (event, sFormDefinitionName) {
            // Supprime le "listener".
            clearListener();
            // Champs de form. à afficher suivant le type de contrôle et le mode du form.
            var aFormFieldsToConcat = [envSrvc["sMode"] + "_button", "id_traitement", "id_controle", "tra_type", "id_installation"];
            var oFormFieldsToDisplay, aFormFieldsToDisplay = [];
            oFormFieldsToDisplay = {
                "BON FONCTIONNEMENT": ["tra_dist_hab", "tra_dist_lim_parc", "tra_dist_veget", "tra_dist_puit", "tra_regrep_mat", "tra_regrep_affl", "tra_regrep_equi", "tra_regbl_mat", "tra_regbl_affl", "tra_regcol_mat", "tra_regcol_affl", "maj", "maj_date", "create", "create_date", "Element_0", "Element_1", "Element_3", "Element_4", "Element_5", "Element_6"],
                "CONCEPTION": ["maj", "maj_date", "create", "create_date", "Element_0", "Element_6"],
                "REALISATION": ["tra_dist_lim_parc", "tra_dist_veget", "tra_dist_puit", "tra_vm_grav_qual", "tra_vm_grav_ep", "tra_vm_geo_text", "tra_vm_bon_mat", "tra_regrep_mat", "tra_regrep_affl", "tra_regrep_equi", "tra_regrep_perf", "tra_regbl_mat", "tra_regbl_affl", "tra_regbl_hz", "tra_regbl_epand", "tra_regbl_perf", "tra_regcol_mat", "tra_regcol_affl", "tra_regcol_hz", "maj", "maj_date", "create", "create_date", "Element_0", "Element_1", "Element_2", "Element_3", "Element_4", "Element_5", "Element_6", , "tra_vm_racine", "tra_vm_humidite", "tra_vm_imper", "tra_vm_geogrille", "tra_vm_tuy_perf", "tra_vm_sab_qual", "tra_vm_sab_ep", "tra_vm_geomembrane"]
            };
            //
            var setTypeTraitement = function (event) {

                var sTraType;
                if (typeof (event) != "undefined")
                    sTraType = event.target.value;
                else
                    sTraType = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]]["tra_type"];

                if (goog.isObject(sTraType)) {
                    if (goog.isDefAndNotNull(sTraType['selectedOption'])) {
                        if (goog.isDefAndNotNull(sTraType['selectedOption']['value'])) {
                            sTraType = angular.copy(sTraType['selectedOption']['value']);
                        }
                    }
                }

                if (typeof (sControleType) != "undefined" && sControleType != "") {
                    if (sTraType == "TRANCHÉES D'EPANDAGE") {
                        $rootScope["displayFormFields"](oFormFieldsToDisplay[sControleType].concat(["tra_nb", "tra_longueur", "tra_tot_lin", "tra_profond", "tra_largeur"]).concat(aFormFieldsToConcat));
                    } else {
                        $rootScope["displayFormFields"](oFormFieldsToDisplay[sControleType].concat(["tra_long", "tra_larg", "tra_surf", "tra_profondeur"]).concat(aFormFieldsToConcat));
                    }
                }
            }
            //
            if (typeof (oParentFormValues["controle_type"]) == "string")
                var sControleType = oParentFormValues["controle_type"];
            else
                var sControleType = oParentFormValues["controle_type"]["selectedOption"]["value"];
            aFormFieldsToDisplay = oFormFieldsToDisplay[sControleType];
            var oTypeTraitement = formSrvc["getFormElementDefinition"]("tra_type", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
            if (envSrvc["sMode"] == "insert")
                $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
            else
                setTypeTraitement();
            // Affiche et cache les champs de form. suivant le type de contrôle.
            if (envSrvc["sMode"] != "display") {
                document.getElementById(oTypeTraitement["id"]).removeEventListener("change", setTypeTraitement)
                $timeout(function () {
                    document.getElementById(oControl["id"]).addEventListener("change", function () {
                        var iIdControl = this.value;
                        // Charge les données du contrôle.
                        ajaxRequest({
                            "method": "GET",
                            "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/anc/controles/" + iIdControl,
                            "scope": $rootScope,
                            "success": function (response) {
                                var oControl = envSrvc["extractWebServiceData"]("controles", response["data"])[0];
                                sControleType = oControl["controle_type"];
                                var aFormFieldsToDisplay = oFormFieldsToDisplay[oControl["controle_type"]];
                                $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
                            }
                        });
                    });
                    // Affichage de certains champs suivant le type de contrôle.
                    document.getElementById(oTypeTraitement["id"]).addEventListener("change", setTypeTraitement)
                });
            }
        });
    };

    /**
     * initAncControlFilieresAgreeesForm function.
     * Traitements avant l'affichage du formulaire d'une filière agréée de la section "Filière agréées" de l'onglet "Contrôle".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncControlFilieresAgreeesForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var $timeout = angular.element(vitisApp.appMainDrtv).injector().get(["$timeout"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("initAncControlFilieresAgreeesForm");
        var scope = this;
        // Préremplissage de l'installation et dy contrôle en mode "insert".
        var oParentFormValues = envSrvc["oFormValues"][envSrvc["oSelectedObject"]["name"] + "_" + envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]["sections"][0]["name"] + "_" + scope.$parent["sParentMode"] + "_form"];
        var oControl = formSrvc["getFormElementDefinition"]("id_controle", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
        if (envSrvc["sMode"] == "insert") {
            var oInstallation = formSrvc["getFormElementDefinition"]("id_installation", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
            oInstallation["default_value"] = oParentFormValues["id_installation"]["selectedOption"]["value"];
            oControl["default_value"] = oParentFormValues["id_controle"];
        }
        //
        var clearListener = $rootScope.$on("formExtracted", function (event, sFormDefinitionName) {
            // Supprime le "listener".
            clearListener();
            // Champs de form. à afficher suivant le type de contrôle et le mode du form.
            var aFormFieldsToConcat = [envSrvc["sMode"] + "_button", "id_fag", "id_controle", "id_installation"];
            var oFormFieldsToDisplay, aFormFieldsToDisplay = [];
            oFormFieldsToDisplay = {
                "BON FONCTIONNEMENT": ["id_fag", "id_controle", "fag_type", "fag_agree", "fag_integerer", "fag_denom", "fag_fab", "fag_num_ag", "fag_cap_eh", "fag_nb_cuv", "fag_et_deg", "fag_et_od", "fag_et_dy", "fag_en_date", "fag_en_jus", "fag_en_entr", "fag_en_bord", "fag_en_dest", "fag_en_perc", "fag_en_contr", "fag_en_mainteger", "fag_dist_arb", "fag_dist_parc", "fag_dist_hab", "fag_dist_cap", "maj", "maj_date", "create", "create_date", "Element_6", "Element_7", "Element_8", "fag_num", "fag_num_filt", "fag_mat_cuv", "fag_guide", "fag_contr", "fag_soc", "Element_0", "fag_pres", "fag_tamp", "fag_ventil", "fag_mil_typ", "fag_mil_filt", "fag_pres_reg", "fag_pres_alar", "fag_commentaires"],
                "CONCEPTION": ["id_fag", "id_controle", "fag_type", "fag_agree", "fag_integerer", "fag_denom", "fag_fab", "fag_num_ag", "fag_cap_eh", "fag_nb_cuv", "maj", "maj_date", "create", "create_date"],
                "REALISATION": ["id_fag", "id_controle", "fag_type", "fag_agree", "fag_integerer", "fag_denom", "fag_fab", "fag_num_ag", "fag_cap_eh", "fag_nb_cuv", "fag_surpr", "fag_surpr_ref", "fag_surpr_dist", "fag_surpr_elec", "fag_surpr_aer", "fag_reac_bull", "fag_broy", "fag_dec", "fag_type_eau", "fag_reg_mar", "fag_reg_mat", "fag_reg_affl", "fag_reg_hz", "fag_reg_van", "fag_fvl_nb", "fag_fvl_long", "fag_fvl_larg", "fag_fvl_prof", "fag_fvl_sep", "fag_fvl_pla", "fag_fvl_drain", "fag_fvl_resp", "fag_fhz_long", "fag_fhz_larg", "fag_fhz_prof", "fag_fhz_drain", "fag_fhz_resp", "fag_mat_qual", "fag_mat_epa", "fag_pres_veg", "fag_pres_pro", "maj", "maj_date", "create", "create_date", "Element_1", "Element_2", "Element_3", "Element_5", "fag_num", "fag_num_filt", "fag_mat_cuv", "fag_guide", "fag_contr", "fag_soc", "fag_soc", "fag_livret", "Element_0", "fag_pres", "fag_plan", "fag_tamp", "fag_ancrage", "fag_ventil", "fag_mil_typ", "fag_mil_filt", "fag_mise_eau", "fag_pres_alar", "fag_pres_reg", "fag_pres", "fag_plan", "fag_tamp", "fag_rep", "fag_respect", "fag_att_conf", "Element_10", "fag_commentaires"]
            };
            if (typeof (oParentFormValues["controle_type"]) == "string")
                var sControleType = oParentFormValues["controle_type"];
            else
                var sControleType = oParentFormValues["controle_type"]["selectedOption"]["value"];
            aFormFieldsToDisplay = oFormFieldsToDisplay[sControleType];
            $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));

            // Affiche et cache les champs de form. suivant le type de contrôle.
            if (envSrvc["sMode"] != "display") {
                $timeout(function () {
                    document.getElementById(oControl["id"]).addEventListener("change", function () {
                        var iIdControl = this.value;
                        // Charge les données du contrôle.
                        ajaxRequest({
                            "method": "GET",
                            "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/anc/controles/" + iIdControl,
                            "scope": $rootScope,
                            "success": function (response) {
                                var oControl = envSrvc["extractWebServiceData"]("controles", response["data"])[0];
                                var aFormFieldsToDisplay = oFormFieldsToDisplay[oControl["controle_type"]];
                                $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
                            }
                        });
                    });
                });
            }
        });
        // Conversion des dates.
        var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
        var sFagEnDate = oFormValues["fag_en_date"];
        if (goog.isDefAndNotNull(sFagEnDate) && sFagEnDate != "")
            oFormValues["fag_en_date"] = moment(sFagEnDate).format("L")
        if (goog.isDefAndNotNull(oFormValues["create_date"]))
            oFormValues["create_date"] = moment(oFormValues["create_date"]).format('L');
        if (goog.isDefAndNotNull(oFormValues["maj_date"]))
            oFormValues["maj_date"] = moment(oFormValues["maj_date"]).format('L');
    };

    /**
     * initAncControlEvacuationEauxForm function.
     * Traitements avant l'affichage du formulaire de l'onglet "Evacuation des eaux".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncControlEvacuationEauxForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var $rootScope = angular.element(vitisApp.appMainDrtv).injector().get(["$rootScope"]);
        var $timeout = angular.element(vitisApp.appMainDrtv).injector().get(["$timeout"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        var formSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["formSrvc"]);
        var propertiesSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["propertiesSrvc"]);
        //
        $log.info("initAncControlEvacuationEauxForm");
        var scope = this;
        // Préremplissage de l'installation et dy contrôle en mode "insert".
        var oParentFormValues = envSrvc["oFormValues"][envSrvc["oSelectedObject"]["name"] + "_" + envSrvc["oSectionForm"][envSrvc["oSelectedObject"]["name"]]["sections"][0]["name"] + "_" + scope.$parent["sParentMode"] + "_form"];
        var oControl = formSrvc["getFormElementDefinition"]("id_controle", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
        if (envSrvc["sMode"] == "insert") {
            var oInstallation = formSrvc["getFormElementDefinition"]("id_installation", envSrvc["sFormDefinitionName"], envSrvc["oFormDefinition"]);
            oInstallation["default_value"] = oParentFormValues["id_installation"]["selectedOption"]["value"];
            oControl["default_value"] = oParentFormValues["id_controle"];
        }
        //
        var clearListener = $rootScope.$on("formExtracted", function (event, sFormDefinitionName) {
            // Supprime le "listener".
            clearListener();
            // Champs de form. à afficher suivant le type de contrôle et le mode du form.
            var aFormFieldsToConcat = [envSrvc["sMode"] + "_button", "id_eva", "id_installation", "id_controle"];
            var oFormFieldsToDisplay, aFormFieldsToDisplay = [];
            oFormFieldsToDisplay = {
                "BON FONCTIONNEMENT": ["evacuation_eaux.id_eva", "id_controle", "evac_type", "evac_is_long", "evac_is_larg", "evac_is_surface", "evac_is_profondeur", "evac_is_reg_rep", "evac_is_reb_bcl", "evac_is_veg", "evac_is_acc_reg", "evac_rp_grav", "evac_rp_tamp", "evac_rp_type_eff", "evac_rp_trap", "evac_hs_type", "evac_hs_gestionnaire", "evac_hs_gestionnaire_auth", "evac_commentaires", "maj", "maj_date", "create", "create_date", "Element_0", "Element_1", "Element_2", "Element_4", "evac_is_lin_total", "evac_rp_type", "evac_hs_intr", "evac_hs_type_eff", "evac_hs_ecoul"],
                "CONCEPTION": ["evacuation_eaux.id_eva", "id_controle", "evac_type", "evac_is_long", "evac_is_larg", "evac_is_surface", "evac_is_profondeur", "evac_rp_etude_hydrogeol", "evac_rp_rejet", "evac_hs_type", "evac_hs_gestionnaire", "evac_hs_gestionnaire_auth", "evac_commentaires", "maj", "maj_date", "create", "create_date", "photos_f", "fiche_f", "schema_f", "documents_f", "plan_f", "Element_0", "Element_1", "Element_2", "Element_3", "Element_4", "evac_is_inf_perm"],
                "REALISATION": ["evacuation_eaux.id_eva", "id_controle", "evac_type", "evac_is_long", "evac_is_larg", "evac_is_surface", "evac_is_profondeur", "evac_is_geotex", "evac_is_rac", "evac_is_hum", "evac_is_reg_rep", "evac_is_reb_bcl", "evac_is_veg", "evac_rp_grav", "evac_rp_tamp", "evac_hs_type", "evac_commentaires", "maj", "maj_date", "create", "create_date", "Element_0", "Element_1", "Element_2", "Element_4", "evac_is_lin_total", "evac_rp_bons_grav", "evac_hs_intr", "evac_hs_type_eff", "evac_hs_ecoul"]
            };
            if (typeof (oParentFormValues["controle_type"]) == "string")
                var sControleType = oParentFormValues["controle_type"];
            else
                var sControleType = oParentFormValues["controle_type"]["selectedOption"]["value"];
            aFormFieldsToDisplay = oFormFieldsToDisplay[sControleType];
            $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));

            // Affiche et cache les champs de form. suivant le type de contrôle.
            if (envSrvc["sMode"] != "display") {
                $timeout(function () {
                    document.getElementById(oControl["id"]).addEventListener("change", function () {
                        var iIdControl = this.value;
                        // Charge les données du contrôle.
                        ajaxRequest({
                            "method": "GET",
                            "url": propertiesSrvc["web_server_name"] + "/" + propertiesSrvc["services_alias"] + "/anc/controles/" + iIdControl,
                            "scope": $rootScope,
                            "success": function (response) {
                                var oControl = envSrvc["extractWebServiceData"]("controles", response["data"])[0];
                                var aFormFieldsToDisplay = oFormFieldsToDisplay[oControl["controle_type"]];
                                $rootScope["displayFormFields"](aFormFieldsToDisplay.concat(aFormFieldsToConcat));
                            }
                        });
                    });
                });
            }
        });
        // Conversion des dates au format Fr.
        var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
        if (goog.isDefAndNotNull(oFormValues["create_date"]))
            oFormValues["create_date"] = moment(oFormValues["create_date"]).format('L');
        if (goog.isDefAndNotNull(oFormValues["maj_date"]))
            oFormValues["maj_date"] = moment(oFormValues["maj_date"]).format('L');
    };

    /**
     * beforeSendingAncInstallationForm function.
     * Traitements avant l'envoi du formulaire de la section "Habitation" de l'onglet "Installation".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["beforeSendingAncInstallationForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("beforeSendingAncInstallationForm");
        // Champs obligatoirement en majuscules.
        var aElemNames = ["parc_commune", "prop_adresse", "prop_commune", "prop_nom_prenom", "prop_titre"];
        var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
        for (var i in aElemNames) {
            if (typeof (oFormValues[aElemNames[i]]) == "string")
                oFormValues[aElemNames[i]] = oFormValues[aElemNames[i]].toUpperCase();
        }
    }

    /**
     * initAncControleSuiviForm function.
     * Traitements avant l'affichage du formulaire de la section "Suivi" de l'onglet "Contrôle".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncControleSuiviForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("initAncControleSuiviForm");
        // Conversion des dates au format Fr.
        var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
        if (goog.isDefAndNotNull(oFormValues["create_date"]))
            oFormValues["create_date"] = moment(oFormValues["create_date"]).format('L');
        if (goog.isDefAndNotNull(oFormValues["maj_date"]))
            oFormValues["maj_date"] = moment(oFormValues["maj_date"]).format('L');
    };

    /**
     * appAdminDescriptionColumn directive.
     * Mise en forme de la colonne "description" dans la liste de l'onglet "Admin".
     * @ngInject
     */
    vitisApp.appAdminDescriptionColumnDrtv = function () {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appAdminDescriptionColumn", function (value) {
                    console.log(scope["row"]["entity"][scope["col"]["field"]]);
                    // Si le champ est vide : supprime l'icône.
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        // Classes css (ui-grid + spécifiques).
                        element[0].className = "ui-grid-cell-contents wk-params-icon";
                        // Création du "tooltip".
                        $(element)["popover"]({
                            "trigger": "hover",
                            "container": "body",
                            "html": true,
                            "title": function () {
                                return "#" + scope["row"]["entity"]["id_parametre_admin"];
                            },
                            // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                            "placement": function (oPopoverNode, oElementNode) {
                                return scope.$root["workspaceTooltipPlacement"](oElementNode);
                            },
                            "content": function () {
                                return String(scope["row"]["entity"][scope["col"]["field"]]).replace(/,/g, '<br>');
                            }
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
        };
    };
    vitisApp["compileProvider"].directive("appAdminDescriptionColumn", vitisApp.appAdminDescriptionColumnDrtv);

    /**
     * appAdminSignatureColumn directive.
     * Mise en forme de la colonne "description" dans la liste de l'onglet "Admin".
     * @ngInject
     */
    vitisApp.appAdminSignatureColumnDrtv = function () {
        return {
            link: function (scope, element, attrs) {
                // 1er affichage ou tri de la liste : maj de la mise en forme.
                var clearObserver = attrs.$observe("appAdminSignatureColumn", function (value) {
                    console.log(scope["row"]["entity"][scope["col"]["field"]]);
                    // Si le champ est vide : supprime l'icône.
                    if (scope["row"]["entity"][scope["col"]["field"]] == null || scope["row"]["entity"][scope["col"]["field"]] == "")
                        element[0].className = "";
                    else {
                        // Classes css (ui-grid + spécifiques).
                        element[0].className = "ui-grid-cell-contents wk-params-icon";
                        // Création du "tooltip".
                        $(element)["popover"]({
                            "trigger": "hover",
                            "container": "body",
                            "html": true,
                            "title": function () {
                                return "#" + scope["row"]["entity"]["id_parametre_admin"];
                            },
                            // Placement du tooltip à gauche ou à droite suivant la position horizontale de l'élément.
                            "placement": function (oPopoverNode, oElementNode) {
                                return scope.$root["workspaceTooltipPlacement"](oElementNode);
                            },
                            "content": function () {
                                return String(scope["row"]["entity"][scope["col"]["field"]]).replace(/,/g, '<br>');
                            }
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
        };
    };
    vitisApp["compileProvider"].directive("appAdminSignatureColumn", vitisApp.appAdminSignatureColumnDrtv);

    /**
     * initAncParametrageEntrepriseForm function.
     * Traitements avant l'affichage du formulaire de l'onglet "Entreprise".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncParametrageEntrepriseForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("initAncParametrageEntrepriseForm");
        // Conversion des dates au format Fr.
        var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
        if (goog.isDefAndNotNull(oFormValues["create_date"]))
            oFormValues["create_date"] = moment(oFormValues["create_date"]).format('L');
        if (goog.isDefAndNotNull(oFormValues["maj_date"]))
            oFormValues["maj_date"] = moment(oFormValues["maj_date"]).format('L');
    };

    /**
     * initAncParametrageAdministrateurForm function.
     * Traitements avant l'affichage du formulaire de l'onglet "Entreprise".
     **/
    angular.element(vitisApp.appMainDrtv).scope()["initAncParametrageAdministrateurForm"] = function () {
        // Injection des services.
        var $log = angular.element(vitisApp.appMainDrtv).injector().get(["$log"]);
        var envSrvc = angular.element(vitisApp.appMainDrtv).injector().get(["envSrvc"]);
        //
        $log.info("initAncParametrageAdministrateurForm");
        // Conversion des dates au format Fr.
        var oFormValues = envSrvc["oFormValues"][envSrvc["sFormDefinitionName"]];
        if (goog.isDefAndNotNull(oFormValues["date_fin_validite"]))
            oFormValues["date_fin_validite"] = moment(oFormValues["date_fin_validite"]).format('L');
    };
});

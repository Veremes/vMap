/* global by, browser, element, expect, jasmine, protractor */

'use strict';
/**
 * @author: ME
 * @Description: test publication a FME project on vitis then add an order
 */

describe("Publication de projet dans GTF VITIS - ", function () {

    var FonctVeremes = require("../VeremesTest");
    var login = browser.params.login;
    var pwd = browser.params.password;
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000; // maximum time between two IT
        //browser.ignoreSynchronization = true; //non angular application
        FonctVeremes.isAngularApp(true);
    });
    afterEach(function () {
        FonctVeremes.waitBetweenTwoTests();
    });
    it("Connexion à GTF - ", function () {
        browser.ignoreSynchronization = true;
        browser.get('https://vm03.veremes.net/gtf/');
        FonctVeremes.waitToLoadPage();
        //browser.driver.manage().window().maximize();
        browser.driver.manage().window().setSize(1800, 1200);
        browser.ignoreSynchronization = false;
        console.log("Connexion à gtf ");
        //vérif du nom de l'onglet = Administration
        //expect(browser.getTitle()).toEqual('Gtf');
    });

    describe("Connexion de l'admin à GTF - ", function () {

        it("Connexion de l'admin à GTF", function () {

            element(by.id("login_form_user_login")).sendKeys(login);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            element(by.id("login_form_name")).click();
            //expect(element(by.id("user_column")).getText()).toContain("margot");
            console.log("\nConnexion de l'admin à gtf\n");
        });
    });

    describe("Publication d'un nouveau projet - ", function () {

        it("Ajout d'un projet FME - ", function () {
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_publication")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("publication_gtf_workspace_add_smallFlexigrid_ui_grid_add")).click();

            FonctVeremes.waitAfterClick();

            element(by.id("publication_gtf_workspace_general_insert_form_name")).sendKeys('test_publication');
            var FileToUpload = FonctVeremes.pathResolver("./resource/test_param_date_time.fmw");
            element(by.id("publication_gtf_workspace_general_insert_form_fmw_file")).sendKeys(FileToUpload);

            var ResourceToUpload = FonctVeremes.pathResolver("./resource/depts.zip");
            //element(by.id("publication_gtf_workspace_general_insert_form_other_file")).sendKeys(ResourceToUpload);
            element(by.id("publication_gtf_workspace_general_insert_form_comp_file")).sendKeys(ResourceToUpload);

            //Mot clé moteur + modele E-mail 
            element(by.id("publication_gtf_workspace_general_insert_form_email_template_id")).element(by.cssContainingText('option', 'default')).click();
            //test bouton radio 
            element(by.id('radio_subscription_0')).click();
            browser.sleep(300);

            //bouton Créer  
            //ligne suivnate fonctionne sous Firefox mais ko sous chrome 
            element(by.id("publication_gtf_workspace_general_insert_form_form_submit")).click();
            // browser.actions().mouseMove(element(by.id("publication_gtf_workspace_general_insert_form_form_submit"))).click().perform();
            //browser.actions().mouseMove(element(by.id("publication_gtf_workspace_general_insert_form_form_submit"))).click().perform(); 
            //browser.actions().mouseMove(element(by.id("publication_gtf_workspace_general_insert_form_form_submit"))).doubleClick().perform();
            //element(by.repeater("button in field.buttons track by $index").row(0)).click();      
            browser.sleep(6000);
            //bouton Retour à la liste 
            //Ligne suivante fonction sous firefox mais ko sous chrome 
            // element(by.id("publication_gtf_workspace_general_insert_form_return_list")).click();
            element(by.id("publication_gtf_workspace_general_update_form_return_list")).click();
            //browser.actions().mouseMove(element(by.id("publication_gtf_workspace_general_update_form_return_list"))).click().perform();
            browser.sleep(2000);

            //recherche par filtre : 
            element(by.id("publication_gtf_workspace_search_filter_button")).click();
            browser.sleep(300);
            element(by.id("publication_gtf_workspace_search_form_name")).sendKeys("test_publication");
            element(by.id("publication_gtf_workspace_search_form_search")).click();
            browser.sleep(300);

            var cellCompte = FonctVeremes.dataCell("publication_gtf_workspace_grid_data", 0, 2);
            console.log("\nRecherche par filtre du projet");

            console.log("\n Projet publication retourné par le filtre : ");
            expect(cellCompte.getText()).toEqual("test_publication");

            browser.sleep(1000);
        });

        it("Ajout de metadonnée au projet", function () {
            element(by.css('[ng-if="grid.appScope.edit_column"]')).click();
            browser.sleep(1000);
            browser.sleep(1000);
            element(by.repeater("section in ::oSectionForm[sSelectedObjectName].sections track by $index").row(1)).click();
            FonctVeremes.waitAfterClick();
            //clic sur la sous section métadonnées
            //element(by.id('publication_gtf_workspace_updateMetadata_update_form_title')).sendKeys('test date');
            //browser.sleep(300);
            element(by.id("publication_gtf_workspace_updateMetadata_update_form_category_id")).element(by.cssContainingText('option', 'Campagne de tests unitaires')).click();
            browser.sleep(300);
            element(by.id('publication_gtf_workspace_updateMetadata_update_form_form_submit')).click();


            browser.sleep(3000);
            console.log("\n Catégorie Campagne de tests unitaires associé au projet : ");

            //expect(element(by.id("publication_gtf_workspace_updateMetadata_update_form_category_id")).getText()).toContain("Campagne de tests unitaires");
            browser.sleep(1000);
            browser.sleep(1000);
        });

        it("Ajout de droits au projet", function () {
            //clic sur la sous section Droits
            element(by.repeater("section in ::oSectionForm[sSelectedObjectName].sections track by $index").row(2)).click();

            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            //element(by.id("publication_gtf_workspace_updateRight_update_form_groups_from")).element(by.cssContainingText('option', 'groupe_test2')).click();
            //element(by.id("publication_gtf_workspace_updateRight_update_form_from_group_to_groups")).click();
            element(by.id("publication_gtf_workspace_updateRight_update_form_groups_from")).element(by.cssContainingText('option', 'Administration')).click();
            element(by.id("publication_gtf_workspace_updateRight_update_form_from_group_to_groups")).click();
            element(by.id("publication_gtf_workspace_updateRight_update_form_form_submit")).click();
            browser.sleep(3000);

            console.log("\nDroits : groupe_test2 associé au projet fme :");

            expect(element(by.id("publication_gtf_workspace_updateRight_update_form_groups")).getText()).toContain("Administration");
            FonctVeremes.waitToLoadPage();
        });

        it("Demande d'exécution du projet- ", function () {
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_my_work")).click();
            element(by.id("my_work_gtf_user_order_add_smallFlexigrid_ui_grid_add")).click();
            //choix categorie
            element(by.id("my_work_gtf_user_order_insert_form_category_id")).element(by.cssContainingText('option', 'Campagne de tests unitaires')).click();
            //choix projet
            element(by.id("my_work_gtf_user_order_insert_form_workspace_id")).element(by.cssContainingText('option', 'test_publication')).click();
            FonctVeremes.waitToLoadPage();

            console.log("\n Demande d'exécution du projet :  \n");
            element(by.id("my_work_gtf_user_order_insert_subform_form_submit")).click();
            FonctVeremes.waitToLoadPage();
            //expect(element(by.id("my_work_gtf_user_order_insert_subform_date_time")).isPresent()).toBe(true);
            //var formulaire = element(by.id("Subform")).element(by.repeater("row in :refresh:oFormDefinition[sFormDefinitionName].rows track by $index").row(0));
            //expect(formulaire.element(by.css('[data-translate=\"Sélectionner les depts dont la date de création est postérieure au:\"]')).isPresent()).toBe(true);

            //expect(formulaire.element(by.id("my_work_gtf_user_order_insert_subform_date_time_label")).isPresent()).toBe(true);



            mode.element(by.id("mode_supervision")).click();
            FonctVeremes.waitAfterClick();
            // tri décroissant sur la colonne id de la liste des utilisateurs : 
            element(by.className("supervision_gtf_order_order_id")).element(by.className("ng-binding")).click();
            element(by.className("supervision_gtf_order_order_id")).element(by.className("ng-binding")).click();
            element(by.className("supervision_gtf_order_order_id")).element(by.className("ng-binding")).click();
            var cellule = FonctVeremes.dataCell("supervision_gtf_order_grid_data", 0, 2);
            console.log("\n Vérification de l'exécution du traitement dans le mode supervision \n");
            expect(cellule.getText()).toEqual("test_publication");



        });

        describe("delete the project", function () {
            it("should delete this project", function () {

                var mode = element(by.id("mode_column"));
                mode.element(by.id("mode_publication")).click();
                FonctVeremes.waitToLoadPage();

                //element(by.id("object_column_publication_gtf_workspace")).click();
                //FonctVeremes.waitToLoadPage();
                //
                //
                ////***************************************************************************************************
                // ligne suivante A supprimer une fois le déploiement du filtre corrigé par fred.  le 14/10/2016)
                element(by.id("object_column_publication_gtf_category")).click();
                FonctVeremes.waitAfterClick();
                element(by.id("object_column_publication_gtf_workspace")).click();
                FonctVeremes.waitAfterClick();
                //Déploiement de la fenêtre de filtre : 
                element(by.id("data_column")).element(by.id("container_mode_publication")).element(by.id("publication_gtf_workspace_grid")).element(by.id("publication_gtf_workspace_grid_header")).element(by.id("publication_gtf_workspace_search_filter_button")).click();
                element(by.id("publication_gtf_workspace_search_form_reset")).click();
                FonctVeremes.waitAfterClick();
                element(by.id("publication_gtf_workspace_search_form_name")).sendKeys("test_publication");
                FonctVeremes.waitAfterClick();

                element(by.id("publication_gtf_workspace_search_form_search")).click();
                FonctVeremes.waitAfterClick();
                FonctVeremes.waitAfterClick();

                console.log("\nClic sur le bouton de sélection du projet pour pouvoir le supprimer : \n");
                var listeProjets = element(by.id("publication_gtf_workspace_grid_data")).element(by.className("ui-grid-pinned-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
                listeProjets.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(0)).element(by.css('[ng-click=\"selectButtonClick(row, $event)\"]')).click();

                FonctVeremes.waitToLoadPage();
                //console.log("\bouton de suppression du projet :");
                element(by.id("publication_gtf_workspace_deleteFlexigrid_ui_grid_add")).click();
                FonctVeremes.waitToLoadPage();

                var fenetre = element(by.className("modal-content"));
                console.log("\nFenêtre de validation de la suppression :\n");
                expect((fenetre).isPresent()).toBe(true);
                // console.log(fenetre);
                //element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[class=\"btn btn-primary\"]')).click();
                element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"confirm\"]')).click();
                FonctVeremes.waitToLoadPage();


            });
        });

    });
});

/* global by, browser, element, expect, jasmine, protractor */

'use strict';
/**
 * @author: ME
 * @Description: test publication a FME project on vitis then add an order
 */

describe("Vitis gestion des métadonnées - ", function () {

    var FonctVeremes = require("../VeremesTest");
    var login = browser.params.login;
    var pwd = browser.params.password;
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 150000; // maximum time between two IT
        //browser.ignoreSynchronization = true; //non angular application
        FonctVeremes.isAngularApp(true);
    });
    afterEach(function () {
        FonctVeremes.waitBetweenTwoTests();
    });

    it("should have a title in tab", function () {
        browser.ignoreSynchronization = true;
        browser.get('https://vm03.veremes.net/gtf/?debug');
        FonctVeremes.waitToLoadPage();
        //browser.driver.manage().window().maximize();
        browser.driver.manage().window().setSize(1800, 1200);
        browser.ignoreSynchronization = false;
        //vérif du nom de l'onglet = Administration
        //expect(browser.getTitle()).toEqual('Gtf');
    });

    describe("Connexion de l'administrateur - ", function () {
        //test de connexion de l'admin

        it("connexion à gtf", function () {
            console.log("\nconnexion de l'admin");
            element(by.id("login_form_user_login")).sendKeys(login);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();
        });
    });

    describe("Check des métadonnées- ", function () {

        it("Ajout d'un nouveau projet FME", function () {
            console.log("\nAjout projet metadata\n");
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_publication")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("publication_gtf_workspace_add_smallFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterClick();

            element(by.id("publication_gtf_workspace_general_insert_form_name")).sendKeys('test_metadata');

            var FileToUpload = FonctVeremes.pathResolver("./resource/metadata.fmw");
            element(by.id("publication_gtf_workspace_general_insert_form_fmw_file")).sendKeys(FileToUpload);

            FonctVeremes.waitAfterSendKeys();
            element(by.id("publication_gtf_workspace_general_insert_form_form_submit")).click();
            browser.sleep(3000);
            element(by.id("publication_gtf_workspace_general_update_form_return_list")).click();
            FonctVeremes.waitToLoadPage();
            //element(by.id("publication_gtf_workspace_general_update_form_return_list")).click();

            //FonctVeremes.waitToLoadPage();
            //console.log("retour à la liste des projets");

            //recherche par filtre du projet : 
            element(by.id("publication_gtf_workspace_search_filter_button")).click();

            browser.sleep(300);
            element(by.id("publication_gtf_workspace_search_form_name")).sendKeys("test_metadata");

            element(by.id("publication_gtf_workspace_search_form_search")).click();
            browser.sleep(1000);

            var cellCompte = FonctVeremes.dataCell("publication_gtf_workspace_grid_data", 0, 2);

            expect(cellCompte.getText()).toEqual("test_metadata");

            browser.sleep(1000);
        });


        it("Check import categorie", function () {
            console.log("\nVerification de l'import de la Nouvelle catégorie\n");
            element(by.css('[ng-click="grid.appScope.executeActionButtonEvent(row, grid.appScope.edit_column)"]')).click();
            FonctVeremes.waitAfterClick();
            //clic sur la section metadonnées :
            element(by.repeater("section in ::oSectionForm[sSelectedObjectName].sections track by $index").row(1)).click();
            FonctVeremes.waitAfterClick();
            //recherche par filtre de la nouvelle catégorie dans l'onglet catégories
            element(by.id("object_column_publication_gtf_category")).click();
            element(by.id("publication_gtf_category_search_filter_button")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("publication_gtf_category_search_form_name")).sendKeys("Nouvelle catégorie");
            element(by.id("publication_gtf_category_search_form_search")).click();
            browser.sleep(500);
            browser.sleep(500);

            var cellCompte = FonctVeremes.dataCell("publication_gtf_category_grid_data", 0, 2);

            expect(cellCompte.getText()).toEqual("Nouvelle catégorie");
            browser.sleep(1000);
        });

        it("Check import métadata", function () {
            //retour onglet Projets FME 
            console.log("\nVérification de l'import des métadonnées\n");
            element(by.id("object_column_publication_gtf_workspace")).click();
            browser.sleep(300);
            element(by.id("publication_gtf_workspace_search_filter_button")).click();
            browser.sleep(300);
            element(by.id("publication_gtf_workspace_search_form_name")).sendKeys("test_metadata");
            element(by.id("publication_gtf_workspace_search_form_search")).click();
            element(by.css('[ng-if="grid.appScope.edit_column"]')).click();
            FonctVeremes.waitAfterClick();

            //clic sur la section metadonnées :
            element(by.repeater("section in ::oSectionForm[sSelectedObjectName].sections track by $index").row(1)).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();

            console.log("\ncheck description");
            expect(element(by.id("publication_gtf_workspace_updateMetadata_update_form_description")).getAttribute("value")).toEqual('<p style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;">Projet pour tester l\'import de métadonnées dans GTF</p><p style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;">éàçù!</p><p style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;">Description</p>');
            console.log("\ncheck utlisation");
            expect(element(by.id("publication_gtf_workspace_updateMetadata_update_form_usage")).getAttribute("value")).toEqual('<p style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;">Projet pour tester l\'import de métadonnées dans GTF</p><p style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;">éàçù!</p><p style="-qt-paragraph-type: empty; -qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-paragraph-type: empty; -qt-block-indent: 0; text-indent: 0px; margin: 0px;"><br></p><p style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;">Utilisation</p>');
            console.log("\ncheck prerequis");
            expect(element(by.id("publication_gtf_workspace_updateMetadata_update_form_requirements")).getAttribute("value")).toEqual('<p style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;">Projet pour tester l\'import de métadonnées dans GTF</p><p style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;">éàçù!</p><p style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;">Pré requis</p>');
            console.log("\ncheck conditions utilisation");
            expect(element(by.id("publication_gtf_workspace_updateMetadata_update_form_legal_terms_conditions")).getAttribute("value")).toEqual('<p style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;">Projet pour tester l\'import de métadonnées dans GTF</p><p style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;">éàçù!</p><p style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;">Conditions d\'utilisation</p>');
            FonctVeremes.waitAfterClick();

        });
    });

    describe("Gestion des métadonnées lors du rechargement de projet - ", function () {
        //test de connexion de l'admin

        it("rechargement du projet fmw", function () {
            console.log("\nrechargement du projet fme");
            element(by.repeater("section in ::oSectionForm[sSelectedObjectName].sections track by $index").row(5)).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();

            var FileToUpload = FonctVeremes.pathResolver("./resource/metadata2.fmw");

            element(by.id("publication_gtf_workspace_loadProjectDirectory_update_form_fmw_file")).sendKeys(FileToUpload);

            FonctVeremes.waitAfterSendKeys();
            element(by.id("publication_gtf_workspace_loadProjectDirectory_update_form_btn_upload_fmw_file")).click();

            FonctVeremes.waitAfterSendKeys();
            FonctVeremes.waitAfterSendKeys();

            element(by.id("object_column_publication_gtf_workspace")).click();

            FonctVeremes.waitAfterSendKeys();
            FonctVeremes.waitAfterSendKeys();

            element(by.id("publication_gtf_workspace_search_filter_button")).click();

            browser.sleep(300);
            element(by.id("publication_gtf_workspace_search_form_name")).sendKeys("test_metadata");

            element(by.id("publication_gtf_workspace_search_form_search")).click();
            browser.sleep(1000);
            element(by.css('[ng-click="grid.appScope.executeActionButtonEvent(row, grid.appScope.edit_column)"]')).click();
            browser.sleep(300);
            FonctVeremes.waitAfterClick();
            element(by.repeater("section in ::oSectionForm[sSelectedObjectName].sections track by $index").row(1)).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            console.log("\ncheck description2");
            expect(element(by.id("publication_gtf_workspace_updateMetadata_update_form_description")).getAttribute("value")).toEqual('<p style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;">Description modifiée</p><p style="-qt-paragraph-type: empty; -qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-paragraph-type: empty; -qt-block-indent: 0; text-indent: 0px; margin: 0px;"><br></p>');
            FonctVeremes.waitAfterClick();
            console.log("\ncheck utlisation2");
            expect(element(by.id("publication_gtf_workspace_updateMetadata_update_form_usage")).getAttribute("value")).toEqual('<p style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;">Utilisation modifiée</p>');
            FonctVeremes.waitAfterClick();
            console.log("\ncheck prerequis2");
            expect(element(by.id("publication_gtf_workspace_updateMetadata_update_form_requirements")).getAttribute("value")).toEqual('<p style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;">Pre requis modifiés</p>');
            FonctVeremes.waitAfterClick();
            console.log("\ncheck conditions utilisation2");
            expect(element(by.id("publication_gtf_workspace_updateMetadata_update_form_legal_terms_conditions")).getAttribute("value")).toEqual('<p style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;" data-mce-style="-qt-block-indent: 0; text-indent: 0px; margin: 0px;">Conditions d\'utilisation modifiées</p>');
            FonctVeremes.waitAfterClick();
        });

    });


    describe("Suppression projet et catégories - ", function () {
        //test de connexion de l'admin

        it("suppression du projet", function () {
            console.log("\nSuppression du projet metadata\n");

            element(by.id("publication_gtf_workspace_updateMetadata_update_form_return_list")).click();

            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            //recherche projet par le filtre : 
            element(by.id("publication_gtf_workspace_search_filter_button")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("publication_gtf_workspace_search_form_name")).sendKeys("test_metadata");
            element(by.id("publication_gtf_workspace_search_form_search")).click();
            FonctVeremes.waitAfterClick();

            //var ListeProjet = element(by.id("publication_gtf_workspace_grid_data")).element(by.className("ui-grid-pinned-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
            // ListeProjet.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by ").row(0)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(0)).element(by.css('[ng-click="selectButtonClick(row, $event)"]')).click();

            var listeProjets = element(by.id("publication_gtf_workspace_grid_data")).element(by.className("ui-grid-pinned-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
            listeProjets.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(0)).element(by.css('[ng-click=\"selectButtonClick(row, $event)\"]')).click();
            FonctVeremes.waitToLoadPage();
            element(by.id("publication_gtf_workspace_deleteFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitToLoadPage();

            element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"confirm\"]')).click();
            FonctVeremes.waitToLoadPage();

        });

        it("suppression des catégories", function () {
            //Onglet catégorie 
            console.log("\nSuppression de la Nouvelle catégorie\n");
            element(by.id("object_column_publication_gtf_category")).click();
            FonctVeremes.waitAfterClick();
            //recherche projet par le filtre : 
            element(by.id("publication_gtf_category_search_filter_button")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("publication_gtf_category_search_form_name")).sendKeys("Nouvelle catégorie");
            element(by.id("publication_gtf_category_search_form_search")).click();
            FonctVeremes.waitAfterClick();

            var listeCategories = element(by.id("publication_gtf_category_grid_data")).element(by.className("ui-grid-pinned-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
            listeCategories.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(0)).element(by.css('[ng-click=\"selectButtonClick(row, $event)\"]')).click();
            FonctVeremes.waitAfterClick();
            listeCategories.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(1)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(0)).element(by.css('[ng-click=\"selectButtonClick(row, $event)\"]')).click();
            FonctVeremes.waitToLoadPage();

            element(by.id("publication_gtf_category_deleteFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterClick();

            element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"confirm\"]')).click();


            FonctVeremes.waitToLoadPage();


            /*
             * exemple ok : 
             var listeProjets = element(by.id("publication_gtf_workspace_grid_data")).element(by.className("ui-grid-pinned-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
             listeProjets.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(0)).element(by.css('[ng-click=\"selectButtonClick(row, $event)\"]')).click();
             
             FonctVeremes.waitToLoadPage();
             
             element(by.id("publication_gtf_workspace_deleteFlexigrid_ui_grid_add")).click();
             FonctVeremes.waitToLoadPage();
             
             var fenetre = element(by.className("modal-content"));
             expect((fenetre).isPresent()).toBe(true);
             // console.log(fenetre);
             //element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[class=\"btn btn-primary\"]')).click();
             element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"confirm\"]')).click();
             FonctVeremes.waitToLoadPage();
             */

        });

    });

});

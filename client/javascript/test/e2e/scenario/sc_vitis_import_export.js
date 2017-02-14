/* global by, browser, element, expect, jasmine, protractor */

'use strict';
/**
 * @author: ME
 * @Description: test publication a FME project on vitis then add an order
 */

describe("Export Import  - ", function () {

    var FonctVeremes = require("../VeremesTest");
    var login = browser.params.login;
    var pwd = browser.params.password;
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000; // maximum time between two IT
        //browser.ignoreSynchronization = true; //non angular application
        FonctVeremes.isAngularApp(true);
    });
    afterEach(function () {
        FonctVeremes.waitBetweenTwoTests();
    });
    it("Obtenir le titre gtf dans l'onglet", function () {
        browser.ignoreSynchronization = true;
        browser.get('https://vm03.veremes.net/gtf/');
        FonctVeremes.waitToLoadPage();
        //browser.driver.manage().window().maximize();
        browser.driver.manage().window().setSize(1800, 1200);
        browser.ignoreSynchronization = false;
        //vérif du nom de l'onglet = Administration
        //expect(browser.getTitle()).toEqual('Gtf');
    });
    describe("1- Connexion de l'admin - ", function () {

        it("- Connexion de l'admin", function () {

            element(by.id("login_form_user_login")).sendKeys(login);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();
            //expect(element(by.id("header_line")).element(by.id("user_column")).getText()).toContain("margot");
        });
    });

    describe("2- Import du GEX contenant le projet couleur - ", function () {

        it("- Ajout d'une demande admin_Import ", function () {

            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_my_work")).click();
            FonctVeremes.waitAfterActions();

            //chrome : clic sur le bouton ajout d'une demande  : 
            element(by.id("my_work_gtf_user_order_add_smallFlexigrid_ui_grid_add")).click();
            //firefox : clic sur le bouton ajout d'une demande : 
            //browser.actions().mouseMove(element(by.id("my_work_gtf_user_order_add_smallFlexigrid_ui_grid_add"))).click().perform();
            //browser.actions().mouseMove(element(by.id("my_work_gtf_user_order_add_smallFlexigrid_ui_grid_add"))).click().perform();
            FonctVeremes.waitAfterClick();
            //sélection projet sous chrome : 

            element(by.id("my_work_gtf_user_order_insert_form_workspace_id")).click();
            browser.actions().mouseMove(element(by.cssContainingText('option', 'Admin-Import'))).click().perform();
            browser.actions().mouseMove(element(by.cssContainingText('option', 'Admin-Import'))).click().perform();
            FonctVeremes.waitAfterClick();
            //chargement de import_export.gex
            var gex = FonctVeremes.pathResolver("./resource/import_export.gex");
            //element(by.id('sourceGexFile_1_1')).sendKeys(gex);
            element(by.id('my_work_gtf_user_order_insert_subform_sourceGexFile')).sendKeys(gex);
            FonctVeremes.waitAfterClick();
            element(by.id("my_work_gtf_user_order_insert_subform_HTML")).clear();
            FonctVeremes.waitAfterClick();
            element(by.id("my_work_gtf_user_order_insert_subform_HTML")).sendKeys("Mon rapport de test d'import de gex");

            //element(by.id("my_work_gtf_user_order_insert_subform_sourceGexFile")).sendKeys(gex);
            FonctVeremes.waitAfterSendKeys();
            FonctVeremes.waitAfterClick();
            element(by.id("my_work_gtf_user_order_insert_subform_form_submit")).click();

            browser.sleep(70000);

            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_publication")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            //Recherche par filtre du projet couleur
            element(by.id("publication_gtf_workspace_search_filter_button")).click();
            element(by.id("publication_gtf_workspace_search_form_name")).sendKeys("couleur");
            element(by.id("publication_gtf_workspace_search_form_search")).click();
            FonctVeremes.waitAfterClick();
            var cellule = FonctVeremes.dataCell("publication_gtf_workspace_grid_data", 0, 2);

            expect(cellule.getText()).toEqual("couleur");
            console.log("\nImport gex réussi : projet couleur importé");
            element(by.css('[ng-if="grid.appScope.edit_column"]')).click();
            FonctVeremes.waitAfterClick();
        });


        it("- Ajout de droit au projet couleur ", function () {
           
            //selection du sous menu Droits : 
            element(by.repeater("section in ::oSectionForm[sSelectedObjectName].sections track by $index").row(2)).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            element(by.id("publication_gtf_workspace_updateRight_update_form_groups_from")).element(by.cssContainingText('option', 'Administration')).click();
            element(by.id("publication_gtf_workspace_updateRight_update_form_from_group_to_groups")).click();
            element(by.id("publication_gtf_workspace_updateRight_update_form_form_submit")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();

            expect(element(by.id("publication_gtf_workspace_updateRight_update_form_groups")).getText()).toContain("Administration");

            FonctVeremes.waitToLoadPage();
        });
    });

    describe("3-  Export du projet couleur en import_export2.gex", function () {

        it(" - Export du projet couleur", function () {
           
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_my_work")).click();
            FonctVeremes.waitAfterActions();
            element(by.id("my_work_gtf_user_order_add_smallFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            element(by.id("my_work_gtf_user_order_insert_form_workspace_id")).click();

            element(by.cssContainingText('option', 'Admin-Export')).click();
            FonctVeremes.waitToLoadPage();

            element(by.id("idWorkspaceList_1_1_from")).element(by.cssContainingText('option', 'couleur')).click();
            element(by.id("my_work_gtf_user_order_insert_subform_from_idWorkspaceList_from_to_idWorkspaceList")).click();

            FonctVeremes.waitAfterClick();
            element(by.id("destGexFile_2_1")).sendKeys("import_export2");
            FonctVeremes.waitAfterClick();
            element(by.id("my_work_gtf_user_order_insert_subform_form_submit")).click();

            browser.sleep(70000); 
        });

        it(" - Suppression du projet couleur", function () {
            console.log("\n it de supression du projet couleur");
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_publication")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();

            //recherche du projet couleur par le filtre : 
            element(by.id("publication_gtf_workspace_search_filter_button")).click();

            browser.sleep(300);
            element(by.id("publication_gtf_workspace_search_form_name")).clear();
            element(by.id("publication_gtf_workspace_search_form_name")).sendKeys("couleur");
            element(by.id("publication_gtf_workspace_search_form_search")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();

            var listeProjets = element(by.id("publication_gtf_workspace_grid_data")).element(by.className("ui-grid-pinned-container")).element(by.className("ui-grid-canvas"));
            listeProjets.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(0)).element(by.css('[ng-click=\"selectButtonClick(row, $event)\"]')).click();
            FonctVeremes.waitAfterClick();
            element(by.id("publication_gtf_workspace_deleteFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"confirm\"]')).click();
            browser.sleep(4000);
        });
    });

    describe("4- Import du gex import_export2.gex", function () {

        it("- Ajout d'une demande admin_Import ", function () {
            console.log("\n it de ré Import du gex\n");
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_my_work")).click();
            FonctVeremes.waitAfterActions();
            FonctVeremes.waitAfterActions();
            element(by.id("my_work_gtf_user_order_add_smallFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();


            element(by.id("my_work_gtf_user_order_insert_form_workspace_id")).click();
            element(by.cssContainingText('option', 'Admin-Import')).click();
            FonctVeremes.waitToLoadPage();


            //chargement de import_export2.gex
            var gex2 = FonctVeremes.pathResolver("./resource/import_export2.gex");
            element(by.id('my_work_gtf_user_order_insert_subform_sourceGexFile')).sendKeys(gex2);
            FonctVeremes.waitAfterSendKeys();
            element(by.id("my_work_gtf_user_order_insert_subform_HTML")).clear();
            element(by.id("my_work_gtf_user_order_insert_subform_HTML")).sendKeys("import de import_export2");
            element(by.id("my_work_gtf_user_order_insert_subform_form_submit")).click();

            browser.sleep(70000);

            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_publication")).click();
            FonctVeremes.waitAfterClick();

            element(by.id("publication_gtf_workspace_search_filter_button")).click();
            element(by.id("publication_gtf_workspace_search_form_name")).clear();
            element(by.id("publication_gtf_workspace_search_form_name")).sendKeys("couleur");
            element(by.id("publication_gtf_workspace_search_form_search")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("publication_gtf_workspace_search_form_search")).click();
            FonctVeremes.waitAfterClick();
      FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            
            var cellule = FonctVeremes.dataCell("publication_gtf_workspace_grid_data", 0, 2);
            expect(cellule.getText()).toEqual("couleur");
        });

        it("Suppression du projet couleur", function () {

            console.log("\nit Suppression définitive du projet couleur");

            var listeProjets = element(by.id("publication_gtf_workspace_grid_data")).element(by.className("ui-grid-pinned-container")).element(by.className("ui-grid-canvas"));
            listeProjets.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(0)).element(by.css('[ng-click=\"selectButtonClick(row, $event)\"]')).click();
            FonctVeremes.waitAfterClick();
            element(by.id("publication_gtf_workspace_deleteFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"confirm\"]')).click();
            browser.sleep(1000);

        });
    });


});





/* global by, browser, element, expect, jasmine */

'use strict';
/**
 * @author: M ESPADA
 * @Description: test E2E on vitis angular application
 */

describe("Vitis Test Upload de fmw ", function () {

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

    it("Connexion à gtf", function () {
        browser.ignoreSynchronization = true;
        browser.get('https://vm03.veremes.net/gtf/');
        FonctVeremes.waitToLoadPage();
        browser.driver.manage().window().setSize(1800, 1200);
        browser.ignoreSynchronization = false;
    });

    describe("1 -Connexion de l'admin-", function () {

        it("should connect admin account to the app", function () {
            //saisie des identifiants
            element(by.id("login_form_user_login")).sendKeys(login);
            // browser.sleep(100);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            // browser.sleep(100);
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();
        });
    });

    describe("2 -Upload de fichiers fmw avec accent", function () {

        it("upload de fmw accentué", function () {
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_publication")).click();
            FonctVeremes.waitAfterClick();

            FonctVeremes.waitAfterClick();
            //Rechercher par filtre du projet t_upload_fmw
            element(by.id("publication_gtf_workspace_search_filter_button")).click();
            element(by.id("publication_gtf_workspace_search_form_name")).sendKeys("t_upload_fmw");
            element(by.id("publication_gtf_workspace_search_form_search")).click();
            FonctVeremes.waitAfterClick();
            element(by.css('[ng-if="grid.appScope.edit_column"]')).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            //chargement du fme avec accent

            var fmw = FonctVeremes.pathResolver("./resource/éà.fmw");
            console.log();
            console.log(fmw);

            element(by.id("publication_gtf_workspace_general_update_form_fmw_file")).sendKeys(fmw);
            element(by.id("publication_gtf_workspace_general_update_form_form_submit")).click();
            FonctVeremes.waitToLoadPage();

        });

        it("Exécution du traitement fmw accentué", function () {
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_my_work")).click();
            FonctVeremes.waitToLoadPage();

            element(by.id("my_work_gtf_user_order_add_smallFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitToLoadPage();

            element(by.id("my_work_gtf_user_order_insert_form_workspace_id")).click();
            browser.actions().mouseMove(element(by.cssContainingText('option', 't_upload_fmw'))).click().perform();
            browser.actions().mouseMove(element(by.cssContainingText('option', 't_upload_fmw'))).click().perform();
            element(by.id("DestDataset_MAPINFO_1_1")).sendKeys("_accent");
            console.log("avec accent");
            FonctVeremes.waitAfterClick();

            element(by.id("my_work_gtf_user_order_insert_subform_form_submit")).click();
            browser.sleep(100000);

            var listeDemandes = element(by.id("my_work_gtf_user_order_grid_data")).element(by.className("ui-grid-render-container-body")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
            var iconeEtat = listeDemandes.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(3)).element(by.className("ui-grid-cell-contents"));

            expect(iconeEtat.getAttribute('data-app-order-status-column')).toEqual("3");
            FonctVeremes.waitBetweenTwoTests();
        });
    });

    describe("2 -Upload de fichiers fmw avec espace", function () {

        it(" - upload de fmw avec espace ", function () {
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_publication")).click();
            FonctVeremes.waitAfterClick();

            //Rechercher par filtre du projet t_upload_fmw
            element(by.id("publication_gtf_workspace_search_filter_button")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("publication_gtf_workspace_search_form_reset")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("publication_gtf_workspace_search_form_name")).sendKeys("t_upload_fmw");
            element(by.id("publication_gtf_workspace_search_form_search")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            element(by.css('[ng-if="grid.appScope.edit_column"]')).click();

            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            //chargement du fmw avec espace
            var fmw = FonctVeremes.pathResolver("./resource/ee aa.fmw");
            console.log();
            console.log(fmw);

            element(by.id("publication_gtf_workspace_general_update_form_fmw_file")).sendKeys(fmw);
            element(by.id("publication_gtf_workspace_general_update_form_form_submit")).click();
            FonctVeremes.waitToLoadPage();
            FonctVeremes.waitToLoadPage();
        });

        it("- Exécution du traitement fmw avec espace", function () {
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_my_work")).click();
            FonctVeremes.waitToLoadPage();

            element(by.id("my_work_gtf_user_order_add_smallFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitToLoadPage();

            element(by.id("my_work_gtf_user_order_insert_form_workspace_id")).click();
            browser.actions().mouseMove(element(by.cssContainingText('option', 't_upload_fmw'))).click().perform();
            browser.actions().mouseMove(element(by.cssContainingText('option', 't_upload_fmw'))).click().perform();
            element(by.id("DestDataset_MAPINFO_1_1")).sendKeys("_espace");
            console.log("avec espace");
            FonctVeremes.waitToLoadPage();
            element(by.id("my_work_gtf_user_order_insert_subform_form_submit")).click();
            browser.sleep(100000);

            var listeDemandes = element(by.id("my_work_gtf_user_order_grid_data")).element(by.className("ui-grid-render-container-body")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
            var iconeEtat = listeDemandes.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(3)).element(by.className("ui-grid-cell-contents"));

            expect(iconeEtat.getAttribute('data-app-order-status-column')).toEqual("3");
            FonctVeremes.waitBetweenTwoTests();
        });
    });

});



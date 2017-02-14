/* global by, browser, element, expect, jasmine */

'use strict';
/**
 * @author: M ESPADA
 * @Description: test E2E on vitis angular application
 */

describe("Vitis Upload ", function () {

    var FonctVeremes = require("../VeremesTest");
    var login = browser.params.login;
    var pwd = browser.params.password;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 320000; // maximum time between two IT
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

    describe("2 -Upload de fichiers zip ", function () {

        it("upload de zip", function () {
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_my_work")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("my_work_gtf_user_order_add_smallFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            element(by.id("my_work_gtf_user_order_insert_form_workspace_id")).click();
            browser.actions().mouseMove(element(by.cssContainingText('option', 't_upload_zip'))).click().perform();
            browser.actions().mouseMove(element(by.cssContainingText('option', 't_upload_zip'))).click().perform();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();

            //chargement du zip source   
            var zip = FonctVeremes.pathResolver("./resource/dpt2.zip");
            console.log(zip);
            element(by.id("Source__1_1")).sendKeys(zip);
            element(by.id("my_work_gtf_user_order_insert_subform_form_submit")).click();
            //Attente exécution du moteur 3
            browser.sleep(80000);

            var listeDemandes = element(by.id("my_work_gtf_user_order_grid_data")).element(by.className("ui-grid-render-container-body")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
            var iconeEtat = listeDemandes.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(3)).element(by.className("ui-grid-cell-contents"));

            expect(iconeEtat.getAttribute('data-app-order-status-column')).toEqual("3");
            FonctVeremes.waitBetweenTwoTests();

        });

        it("upload de zip dont le nom est accentué", function () {

            element(by.id("my_work_gtf_user_order_add_smallFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            element(by.id("my_work_gtf_user_order_insert_form_workspace_id")).click();
            browser.actions().mouseMove(element(by.cssContainingText('option', 't_upload_zip'))).click().perform();
            browser.actions().mouseMove(element(by.cssContainingText('option', 't_upload_zip'))).click().perform();
            FonctVeremes.waitToLoadPage();

            //chargement du zip source avec accent   
            var zip = FonctVeremes.pathResolver("./resource/dép.zip");
            //console.log(zip);
            element(by.id("Source__1_1")).sendKeys(zip);
            element(by.id("my_work_gtf_user_order_insert_subform_form_submit")).click();
            //Attente exécution du moteur 3
            browser.sleep(80000);

            var listeDemandes = element(by.id("my_work_gtf_user_order_grid_data")).element(by.className("ui-grid-render-container-body")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
            var iconeEtat = listeDemandes.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(3)).element(by.className("ui-grid-cell-contents"));

            expect(iconeEtat.getAttribute('data-app-order-status-column')).toEqual("3");
            FonctVeremes.waitBetweenTwoTests();
        });

        it("upload de zip dont le nom contient un espace", function () {

            element(by.id("my_work_gtf_user_order_add_smallFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            element(by.id("my_work_gtf_user_order_insert_form_workspace_id")).click();
            browser.actions().mouseMove(element(by.cssContainingText('option', 't_upload_zip'))).click().perform();
            browser.actions().mouseMove(element(by.cssContainingText('option', 't_upload_zip'))).click().perform();
            FonctVeremes.waitToLoadPage();

            //chargement du zip source avec accent   
            var zip = FonctVeremes.pathResolver("./resource/dep dep.zip");
            console.log(zip);
            element(by.id("Source__1_1")).sendKeys(zip);
            element(by.id("my_work_gtf_user_order_insert_subform_form_submit")).click();
            //Attente exécution du moteur 3
            browser.sleep(80000);

            var listeDemandes = element(by.id("my_work_gtf_user_order_grid_data")).element(by.className("ui-grid-render-container-body")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
            var iconeEtat = listeDemandes.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(3)).element(by.className("ui-grid-cell-contents"));

            expect(iconeEtat.getAttribute('data-app-order-status-column')).toEqual("3");
            FonctVeremes.waitBetweenTwoTests();
        });

    });
});



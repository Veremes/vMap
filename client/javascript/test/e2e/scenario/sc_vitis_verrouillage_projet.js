/* global by, browser, element, expect, jasmine, protractor */

'use strict';
/**
 * @author: ME
 * @Description: test E2E on vitis 
 * Create and remove users
 */


describe("Vitis Fichiers verrouillés-", function () {
//create, remove an user (with differents privileges) 
//var id;
    var FonctVeremes = require("../VeremesTest");
    var login = browser.params.login;
    var pwd = browser.params.password;
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000; // maximum time between two IT
        //browser.ignoreSynchronization = true; //non angular application
        FonctVeremes.isAngularApp(true);
    });
    afterEach(function () {
        FonctVeremes.waitBetweenTwoTests();
    });
    it("should have a title in tab", function () {
        browser.ignoreSynchronization = true;
        browser.get('https://vm03.veremes.net/gtf/');
        FonctVeremes.waitToLoadPage();
        browser.driver.manage().window().setSize(1800, 1200);
        browser.ignoreSynchronization = false;
        //vérif du nom de l'onglet = Administration
        //expect(browser.getTitle()).toEqual('GTF');
    });

    describe("1 -Connexion admin-", function () {

        it("should connect admin account to the app", function () {
            //saisie des identifiants
            element(by.id("login_form_user_login")).sendKeys(login);

            element(by.id("login_form_user_password")).sendKeys(pwd);

            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();
        });
    });


    describe(" Verrouillage de fichiers-", function () {

        it("It impossibilité de supprimer le fichier t_generic2generic verrouillé\n", function () {
            var mode = element(by.id("mode_column"));
            FonctVeremes.waitAfterActions();
            mode.element(by.id("mode_publication")).click();
            FonctVeremes.waitAfterActions();

            element(by.id("publication_gtf_workspace_search_filter_button")).click();
            FonctVeremes.waitAfterActions();
            FonctVeremes.waitAfterActions();

            element(by.id("publication_gtf_workspace_search_form_name")).sendKeys("t_generic2generic");

            FonctVeremes.waitAfterClick();
            element(by.id("publication_gtf_workspace_search_form_search")).click();
            FonctVeremes.waitAfterClick();

            console.log("\nClic sur le bouton de sélection du projet pour pouvoir le supprimer : \n");
            var listeProjets = element(by.id("publication_gtf_workspace_grid_data")).element(by.className("ui-grid-pinned-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
            listeProjets.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(0)).element(by.css('[ng-click=\"selectButtonClick(row, $event)\"]')).click();

            element(by.id("publication_gtf_workspace_deleteFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterActions();

            expect(element(by.className("modal-body")).isPresent()).toBe(true);
            FonctVeremes.waitAfterActions();

            element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"confirm\"]')).click();
            FonctVeremes.waitAfterActions();

        });
    });
});
      
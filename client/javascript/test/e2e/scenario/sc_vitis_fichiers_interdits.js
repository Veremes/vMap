/* global by, browser, element, expect, jasmine, protractor */

'use strict';
/**
 * @author: ME
 * @Description: test E2E on vitis 
 * Create and remove users
 */


describe("Vitis Fichiers interdits-", function () {
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
            // browser.sleep(100);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            // browser.sleep(100);
            //FonctVeremes.waitToLoadPage();
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();
            //verif de connexion avec le compte admin(margot)
            //expect(element(by.id("user_column")).getText()).toContain("margot");
            //expect(element(by.id("mode_column")).all(by.tagName("a")).count()).toEqual(10);
        });
    });
    /*
     describe("2 -Configuration de fichiers interdits-", function () {
     
     it("Extension *.jpg interdite", function () {
     //FonctVeremes.waitToLoadPage();
     console.log("\nFichier *.jpg interdit");
     var mode = element(by.id("mode_column"));
     mode.element(by.id("mode_configuration")).click();
     element(by.id("configuration_vitis_configuration_general_update_form_forbidden_extension")).sendKeys('*.jpg');
     element(by.id("configuration_vitis_configuration_general_update_form_form_submit")).click();
     FonctVeremes.waitAfterActions();
     FonctVeremes.waitAfterActions();
     });
     });
     */

    describe(" Check du contrôle des extensions de fichiers-", function () {

        it("It impossibilité de charger un fichier interdit en ressources complémentaires\n", function () {
            var mode = element(by.id("mode_column"));
            FonctVeremes.waitAfterActions();
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
            FonctVeremes.waitAfterClick();

            element(by.css('[ng-if="grid.appScope.edit_column"]')).click();
            FonctVeremes.waitAfterClick();
            //clic sur la section Répertoire Informations générales :
            FonctVeremes.waitToLoadPage();
            var vse = FonctVeremes.pathResolver("./resource/vse.jpg");
            element(by.id("publication_gtf_workspace_general_update_form_comp_file")).sendKeys(vse);

            FonctVeremes.waitAfterActions();
            element(by.id("publication_gtf_workspace_general_update_form_form_submit")).click();
            FonctVeremes.waitAfterActions();

            expect(element(by.className("modal-body")).isPresent()).toBe(true);
            FonctVeremes.waitAfterActions();

            element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"close\"]')).click();
            FonctVeremes.waitAfterActions();

            element(by.repeater("row in :refresh:oFormDefinition[sFormDefinitionName].rows track by $index").row(6)).element(by.className("input-group-btn")).element(by.className("fileinput-remove-button")).click();

            FonctVeremes.waitAfterActions();
        });

        it("It impossibilité de charger un fichier interdit en données sources de projet", function () {
            var mode = element(by.id("mode_column"));
            FonctVeremes.waitAfterActions();
            mode.element(by.id("mode_my_work")).click();
            FonctVeremes.waitAfterActions();
            element(by.id("my_work_gtf_user_order_add_smallFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterActions();
            element(by.id("my_work_gtf_user_order_insert_form_workspace_id")).click();
            browser.actions().mouseMove(element(by.cssContainingText('option', 't_generic2generic'))).click().perform();
            browser.actions().mouseMove(element(by.cssContainingText('option', 't_generic2generic'))).click().perform();
            FonctVeremes.waitAfterClick();

            var vse = FonctVeremes.pathResolver("./resource/vse.jpg");
            element(by.id("dossiersource_1_1")).sendKeys(vse);

            element(by.id("my_work_gtf_user_order_insert_subform_form_submit")).click();
            FonctVeremes.waitAfterActions();

            expect(element(by.className("modal-body")).isPresent()).toBe(true);
            FonctVeremes.waitAfterActions();

            element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"close\"]')).click();
            FonctVeremes.waitAfterActions();
        });
    });


    describe(" configuration de gtf - suppression de l'extension jpg comme interdite", function () {
        it("it suppression de l'extension jpg comme interdite\n", function () {
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_configuration")).click();
            FonctVeremes.waitAfterActions();
            element(by.id("configuration_vitis_configuration_general_update_form_forbidden_extension")).clear();
            FonctVeremes.waitAfterActions();

            element(by.id("configuration_vitis_configuration_general_update_form_forbidden_extension")).sendKeys("*.bat|*.com|*.exe|*.php|*.phtml|*.vhtml|*.js|*.vbe|*.wsf|*.dll|*.png");
            FonctVeremes.waitAfterActions();
                 FonctVeremes.waitAfterActions();
            //expect(element(by.id("configuration_vitis_configuration_general_update_form_forbidden_extension")).getText()).toEqual("*.bat|*.com|*.exe|*.php|*.phtml|*.vhtml|*.js|*.vbe|*.wsf|*.dll|*.png");
                       
        
        });
    });

});



          
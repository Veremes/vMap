/* global by, browser, element, expect, jasmine, protractor */

'use strict';
/**
 * @author: ME
 * @Description: test E2E on vitis 
 * Create and remove users
 */


describe("Gestion des utilisateurs avec caractères spéciaux", function () {
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

    it("acces page de connexion", function () {
        browser.ignoreSynchronization = true;
        browser.get('https://vm03.veremes.net/gtf/');
        FonctVeremes.waitToLoadPage();
        browser.driver.manage().window().setSize(1800, 1200);
        browser.ignoreSynchronization = false;
        //vérif du nom de l'onglet = Administration
        expect(browser.getTitle()).toEqual('GTF');
        FonctVeremes.waitAfterClick();

    });

    describe("-Connexion de l'administrateur-", function () {

        it("connexion de l'admin ", function () {

            //saisie des identifiants
            element(by.id("login_form_user_login")).sendKeys(login);
            // browser.sleep(100);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            // browser.sleep(100);
            //FonctVeremes.waitToLoadPage();
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();

        });
    });


    describe("-Creation utilisateur avec caractères accentués-", function () {

        it("- Création utilisateur avec caractères accentués", function () {

            element(by.id("mode_users")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_add_smallFlexigrid_ui_grid_add")).click();
            element(by.id("users_vitis_users_insert_form_login")).sendKeys('éèêëç');
            element(by.id("users_vitis_users_insert_form_name")).sendKeys('éèêëç');
            element(by.id("users_vitis_users_insert_form_email")).sendKeys('er@veremes.com');
            element(by.id("users_vitis_users_insert_form_company")).sendKeys('Veremes');
            element(by.id("users_vitis_users_insert_form_department")).sendKeys('dev');

            //attribution du groupe test
            var groupe = element(by.id("users_vitis_users_insert_form_groups_from"));
            groupe.element(by.css('[label="groupeTest"]')).click();
            element(by.id("users_vitis_users_insert_form_from_group_to_groups")).click();

            //attribution privilege :
            var privilege = element(by.id("users_vitis_users_insert_form_privileges_from"));
            privilege.element(by.css('[label="gtf_admin"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            privilege.element(by.css('[label="vitis_admin"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            privilege.element(by.css('[label="vitis_user"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            //attribution d'un mot de passe
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_insert_form_password")).sendKeys('éèêëç');
           
            element(by.id("users_vitis_users_insert_form_password_confirm")).sendKeys('éèêëç');
           
            element(by.id("users_vitis_users_insert_form_form_submit")).click();

    
            //FonctVeremes.waitToLoadPage();

            //FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_update_form_return_list")).click();
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();


            var cellule = FonctVeremes.dataCell("users_vitis_users_grid_data", 0, 2);
            expect(cellule.getText()).toEqual("eeeec");

            FonctVeremes.waitBetweenTwoTests();
            element(by.id("user_column")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("btn_disconnect")).click();
            FonctVeremes.waitToLoadPage();
        });

        it("- Utilisateur éèêëç peut-il se connecter ?", function () {
            element(by.id("login_form_user_login")).sendKeys('éèêëç');
           element(by.id("login_form_user_password")).sendKeys('éèêëç');
            //element(by.id("login_form_user_password")).sendKeys('eee');
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();

            expect(element(by.id("mode_column")).all(by.tagName("a")).count()).toEqual(10);
            expect(element(by.id("user_column")).getText()).toContain("éèêëç");

            FonctVeremes.waitAfterClick();
            element(by.id("user_column")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("btn_disconnect")).click();
            FonctVeremes.waitToLoadPage();
        });

        it("- Création utilisateur avec caractères arabes", function () {
            element(by.id("login_form_user_login")).sendKeys(login);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();
                        FonctVeremes.waitToLoadPage();
            element(by.id("mode_users")).click();
            element(by.id("users_vitis_users_add_smallFlexigrid_ui_grid_add")).click();
            element(by.id("users_vitis_users_insert_form_login")).sendKeys('صباح الخير');
            element(by.id("users_vitis_users_insert_form_name")).sendKeys('صباح الخير');
            element(by.id("users_vitis_users_insert_form_email")).sendKeys('er@veremes.com');
            element(by.id("users_vitis_users_insert_form_company")).sendKeys('Veremes');
            element(by.id("users_vitis_users_insert_form_department")).sendKeys('dev');
            //attribution du groupe test
            var groupe = element(by.id("users_vitis_users_insert_form_groups_from"));
            groupe.element(by.css('[label="groupeTest"]')).click();
            element(by.id("users_vitis_users_insert_form_from_group_to_groups")).click();
            //attribution privilege framework_user, framework admin et gtf_admin: 
            var privilege = element(by.id("users_vitis_users_insert_form_privileges_from"));
            privilege.element(by.css('[label="gtf_admin"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            privilege.element(by.css('[label="vitis_admin"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            privilege.element(by.css('[label="vitis_user"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            //attribution d'un mot de passe
            element(by.id("users_vitis_users_insert_form_password")).sendKeys('صباح الخير');
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_insert_form_password_confirm")).sendKeys('صباح الخير');
            
            //FonctVeremes.waitAfterClick();



            //FonctVeremes.waitToLoadPage();
            element(by.id("users_vitis_users_insert_form_form_submit")).click();
            FonctVeremes.waitToLoadPage();
            element(by.id("users_vitis_users_update_form_return_list")).click();

            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            var cellule = FonctVeremes.dataCell("users_vitis_users_grid_data", 0, 2);

            expect(cellule.getText()).toEqual("صباح الخير");
            element(by.id("user_column")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("btn_disconnect")).click();
            FonctVeremes.waitToLoadPage();
        });

        it("- Création utilisateur avec caractères chinois-", function () {
            element(by.id("login_form_user_login")).sendKeys(login);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();
            FonctVeremes.waitToLoadPage();
            element(by.id("mode_users")).click();
            element(by.id("users_vitis_users_add_smallFlexigrid_ui_grid_add")).click();
            element(by.id("users_vitis_users_insert_form_login")).sendKeys('你好');
            element(by.id("users_vitis_users_insert_form_name")).sendKeys('你好');
            element(by.id("users_vitis_users_insert_form_email")).sendKeys('er@veremes.com');
            element(by.id("users_vitis_users_insert_form_company")).sendKeys('Veremes');
            element(by.id("users_vitis_users_insert_form_department")).sendKeys('dev');
            //attribution du groupe test
            var groupe = element(by.id("users_vitis_users_insert_form_groups_from"));
            groupe.element(by.css('[label="groupeTest"]')).click();
            element(by.id("users_vitis_users_insert_form_from_group_to_groups")).click();
            //attribution privilege framework_user, framework admin et gtf_admin: 
            var privilege = element(by.id("users_vitis_users_insert_form_privileges_from"));
            privilege.element(by.css('[label="gtf_admin"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            privilege.element(by.css('[label="vitis_admin"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            privilege.element(by.css('[label="vitis_user"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            FonctVeremes.waitAfterClick();
            //attribution d'un mot de passe
            element(by.id("users_vitis_users_insert_form_password")).sendKeys('你好');
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_insert_form_password_confirm")).sendKeys('你好');
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_insert_form_form_submit")).click();
            FonctVeremes.waitToLoadPage();
            element(by.id("users_vitis_users_update_form_return_list")).click();
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            var cellule = FonctVeremes.dataCell("users_vitis_users_grid_data", 0, 2);

            expect(cellule.getText()).toEqual("你好");
            element(by.id("user_column")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("btn_disconnect")).click();
            FonctVeremes.waitToLoadPage();
        });
    });


    describe("-Suppression des utilisateurs avec caractères spéciaux -", function () {
        it("Suppression des utilisateurs avec caractères spéciaux", function () {
            element(by.id("login_form_user_login")).sendKeys(login);
            element(by.id("login_form_user_password")).sendKeys(pwd);

            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();
            element(by.id("mode_users")).click();
            browser.sleep(500);

            //FonctVeremes.waitAfterClick();

            var listusers = element(by.id("users_vitis_users_grid_data")).element(by.className("ui-grid-render-container-body")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
            listusers.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).each(function (el, i) {
                var celluleCompte = el.element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(2));
                //var celluleCompte = el.element(by.className("ui-grid-coluiGrid-0NU"));
                celluleCompte.getText().then(function (text) {
                    if ((text == "eeeec") || (text == "صباح الخير") || (text == "你好")) {
                        celluleCompte.element(by.className("ui-grid-cell-contents")).click();
                    }
                })
            });

            element(by.id("users_vitis_users_deleteFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterActions();

            element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"confirm\"]')).click();
            FonctVeremes.waitToLoadPage();

            var listusers = element(by.id("users_vitis_users_grid_data")).element(by.className("ui-grid-render-container-body")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
            listusers.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).each(function (el, i) {
                var celluleCompte = el.element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(2));
                celluleCompte.getText().then(function (text) {
                    expect(text).not.toEqual("t_admin");
                    expect(text).not.toEqual("user");
                    expect(text).not.toEqual("صباح الخير");
                    expect(text).not.toEqual("你好");
                    expect(text).not.toEqual("éèêëç");
                    expect(text).not.toEqual("author");
                });
            });
        });
    });
});


            
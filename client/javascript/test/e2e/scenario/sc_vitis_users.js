/* global by, browser, element, expect, jasmine, protractor */

'use strict';
/**
 * @author: ME
 * @Description: test E2E on vitis 
 * Create and remove users
 */


describe("Vitis Users-", function () {
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
    describe("2 -Création d'un utilisateur avec des privilèges admin-", function () {

        it("Création de t_admin", function () {
            //FonctVeremes.waitToLoadPage();
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_users")).click();
            //FonctVeremes.waitToLoadPage();
            //Ajout utilisateur
            var grid = element(by.id("users_vitis_users_grid"));
            grid.element(by.id("users_vitis_users_add_smallFlexigrid_ui_grid_add")).click();
            //FonctVeremes.waitBetweenTwoTests();
            //FonctVeremes.waitToLoadPage();
            element(by.id("users_vitis_users_insert_form_login")).sendKeys('t_admin');
            element(by.id("users_vitis_users_insert_form_name")).sendKeys('t_admin');
            element(by.id("users_vitis_users_insert_form_email")).sendKeys('admin@veremes.com');
            element(by.id("users_vitis_users_insert_form_company")).sendKeys('Veremes');
            element(by.id("users_vitis_users_insert_form_department")).sendKeys('dev');
            //attribution du groupe test
            var groupe = element(by.id("users_vitis_users_insert_form_groups_from"));
            groupe.element(by.css('[label="groupeTest"]')).click();
            element(by.id("users_vitis_users_insert_form_from_group_to_groups")).click();
            //attibution privileges gtf_admin, vitis_admin et vitis_user

            var privilege = element(by.id("users_vitis_users_insert_form_privileges_from"));
            privilege.element(by.css('[label="gtf_admin"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            privilege.element(by.css('[label="vitis_admin"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            privilege.element(by.css('[label="vitis_user"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();

            //attribution mot de passe 
            element(by.id("users_vitis_users_insert_form_password")).sendKeys('t_admin');
            element(by.id("users_vitis_users_insert_form_password_confirm")).sendKeys('t_admin');
            element(by.id("users_vitis_users_insert_form_form_submit")).click();
            //FonctVeremes.waitToLoadPage();
            //expect(element(by.css('[class=\"alert alert-success form-validation-alert ng-scope\"]'))).toBeDefined();
            FonctVeremes.waitAfterClick();
            //browser.sleep(4000);
         

/*
            element(by.className("modal-content")).isPresent().then(function (result) {
                if (result) {
                    element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"confirm\"]')).click();
                }
            });
            */
            element(by.id("users_vitis_users_update_form_return_list")).click();


            // tri décroissant sur la colonne id de la liste des utilisateurs 
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();

            var cellule = FonctVeremes.dataCell("users_vitis_users_grid_data", 0, 2);
            expect(cellule.getText()).toEqual("t_admin");
            element(by.id("user_column")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("btn_disconnect")).click();
            FonctVeremes.waitToLoadPage();

            // browser.sleep(2000);
        });


        it("Reconnexion de t_admin", function () {
            element(by.id("login_form_user_login")).sendKeys('t_admin');
            element(by.id("login_form_user_password")).sendKeys('t_admin');
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();
            //expect(element(by.id("mode_column")).all(by.className("ng-repeat").count()).toEqual(10));
            expect(element(by.id("user_column")).getText()).toContain("t_admin");
        });

        it("Changement de pwd par t_admin", function () {
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_users")).click();
            FonctVeremes.waitAfterClick();
            //recherche par filtre : 
            element(by.id("users_vitis_users_search_filter_button")).click();
            browser.sleep(300);
            element(by.id("users_vitis_users_search_form_login")).sendKeys("t_admin");
            element(by.id("users_vitis_users_search_form_search")).click();
            var cellCompte = FonctVeremes.dataCell("users_vitis_users_grid_data", 0, 2);
            expect(cellCompte.getText()).toEqual("t_admin");
            //Edition du compte t_admin et modification du pwd : 
            element(by.css('[ng-if="grid.appScope.edit_column"]')).click();
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_update_form_password")).sendKeys('testeur');
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_update_form_password_confirm")).sendKeys('testeur');
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_update_form_form_submit")).click();
            //FonctVeremes.waitAfterClick();
            browser.sleep(400);
            //browser.ignoreSynchronization = true;
            //browser.get('https://vm03.veremes.net/gtf/?debug');
            //browser.switchTo().alert().accept();
            //FonctVeremes.waitToLoadPage();
            //browser.ignoreSynchronization = false;


            //element(by.css('[data-bb-handler=\"confirm\"]')).click;
            //FonctVeremes.waitToLoadPage();

            element(by.className("modal-dialog")).element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"confirm\"]')).click();
            console.log("\nchangement de mot de passe en testeur");
            FonctVeremes.waitToLoadPage();

        });
        it("Reconnexion de t_admin  avec le nouveau pwd", function () {


            element(by.id("login_form_user_login")).sendKeys('t_admin');
            element(by.id("login_form_user_password")).sendKeys('testeur');
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();
            //expect(element(by.id("mode_column")).all(by.tagName("a")).count()).toEqual(10); 

            console.log("\n reconnexion de t_admin ");
            expect(element(by.id("user_column")).getText()).toContain("t_admin");
            FonctVeremes.waitBetweenTwoTests();
        });


        it("Creation d'un nouveau groupe par t_admin", function () {

            element(by.id("mode_users")).click();
            //onglet Groupes : 
            element(by.id("object_column_users_vitis_group")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_group_add_smallFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();


            element(by.id("framework_group_insert_form")).element(by.id("users_vitis_group_general_insert_form_name")).sendKeys('groupe_test2');

            FonctVeremes.waitAfterClick();

            var user = element(by.id("framework_group_insert_form")).element(by.id("users_vitis_group_general_insert_form_users_from"));

            user.element(by.css('[label="t_admin"]')).click();
            element(by.id("users_vitis_group_general_insert_form_from_user_to_users")).click();
            element(by.id("users_vitis_group_general_insert_form_form_submit")).click();
            FonctVeremes.waitToLoadPage();
            element(by.id("object_column_users_vitis_users")).click();
            FonctVeremes.waitToLoadPage();
            element(by.id("user_column")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("btn_disconnect")).click();
            FonctVeremes.waitToLoadPage();

        });
        
    });

    describe("4 - Création d'utilisateur de privilège user - ", function () {

        it("Creation de l'utilisateur user", function () {
            element(by.id("login_form_user_login")).sendKeys(login);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();
            FonctVeremes.waitToLoadPage();

            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_users")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_add_smallFlexigrid_ui_grid_add")).click();
            element(by.id("users_vitis_users_insert_form_login")).sendKeys('user');
            element(by.id("users_vitis_users_insert_form_name")).sendKeys('user');
            element(by.id("users_vitis_users_insert_form_email")).sendKeys('user@veremes.com');
            element(by.id("users_vitis_users_insert_form_company")).sendKeys('Veremes');
            element(by.id("users_vitis_users_insert_form_department")).sendKeys('dev');
            //attribution du groupe test
            var groupe = element(by.id("users_vitis_users_insert_form_groups_from"));
            groupe.element(by.css('[label="groupeTest"]')).click();
            element(by.id("users_vitis_users_insert_form_from_group_to_groups")).click();
            //attribution privilege vitis_user, vitis_admin et gtf_user: 
            var privilege = element(by.id("users_vitis_users_insert_form_privileges_from"));
            privilege.element(by.css('[label="gtf_user"]')).click();

            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            privilege.element(by.css('[label="vitis_user"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            //attribution d'un mot de passe avec espace
            element(by.id("users_vitis_users_insert_form_password")).sendKeys('user user');
            element(by.id("users_vitis_users_insert_form_password_confirm")).sendKeys('user user');
            element(by.id("users_vitis_users_insert_form_form_submit")).click();

            FonctVeremes.waitAfterClick();

            element(by.id("users_vitis_users_update_form_return_list")).click();
            browser.sleep(300);
            // tri décroissant sur la colonne id de la liste des utilisateurs : 
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            var cellule = FonctVeremes.dataCell("users_vitis_users_grid_data", 0, 2);

            expect(cellule.getText()).toEqual("user");



            element(by.id("user_column")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("btn_disconnect")).click();
            FonctVeremes.waitToLoadPage();
        });

        it("Connexion de user ", function () {
            element(by.id("login_form_user_login")).sendKeys('user');
            element(by.id("login_form_user_password")).sendKeys('user user');
            element(by.id("login_form_name")).click();
            //FonctVeremes.waitToLoadPage();

            expect(element(by.id("mode_column")).all(by.tagName("a")).count()).toEqual(2);
            expect(element(by.id("user_column")).getText()).toContain("user");
            FonctVeremes.waitBetweenTwoTests();
        });
    });
    /*
     */
    /*
     it("Impossibilite de modification de mot de passe par l'utilisateur user", function () {
     element(by.id("mode_user")).click();
     element(by.id("user_vitis_user_update_form_password")).sendKeys('user');
     element(by.id("user_vitis_user_update_form_password_confirm")).sendKeys('user');
     element(by.id("user_vitis_user_update_form_form_submit")).click();
     FonctVeremes.waitAfterClick();
     element(by.css('[data-bb-handler="confirm"]')).click();
     FonctVeremes.waitToLoadPage();
     element(by.id("login_form_user_login")).sendKeys('user');
     element(by.id("login_form_user_password")).sendKeys('user');
     element(by.id("login_form_name")).click();
     
     expect(element(by.id("mode_column")).all(by.tagName("a")).count()).toEqual(2);
     expect(element(by.id("user_column")).getText()).toContain("user");
     element(by.id("user_column")).click();             FonctVeremes.waitAfterClick();             element(by.id("btn_disconnect")).click();
     });
     */
// });



    describe("5 - Création d'utilisateur de privilège Auteur -", function () {
        it("Création de l'utilisateur author ", function () {

            element(by.id("user_column")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("btn_disconnect")).click();
            FonctVeremes.waitToLoadPage();
            element(by.id("login_form_user_login")).sendKeys(login);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();
            FonctVeremes.waitToLoadPage();
            console.log('\nReconnexion de margot');


            element(by.id("mode_users")).click();
            element(by.id("users_vitis_users_add_smallFlexigrid_ui_grid_add")).click();
            element(by.id("users_vitis_users_insert_form_login")).sendKeys('author');
            element(by.id("users_vitis_users_insert_form_name")).sendKeys('author');
            element(by.id("users_vitis_users_insert_form_email")).sendKeys('author@veremes.com');
            element(by.id("users_vitis_users_insert_form_company")).sendKeys('Veremes');
            element(by.id("users_vitis_users_insert_form_department")).sendKeys('dev');
            //attribution du groupe test
            var groupe = element(by.id("users_vitis_users_insert_form_groups_from"));
            groupe.element(by.css('[label="groupeTest"]')).click();
            element(by.id("users_vitis_users_insert_form_from_group_to_groups")).click();
            //attribution privilege vitis_user, vitis_admin et gtf_author: 
            var privilege = element(by.id("users_vitis_users_insert_form_privileges_from"));
            privilege.element(by.css('[label="gtf_author"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();

            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            privilege.element(by.css('[label="vitis_user"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            //attribution d'un mot de passe
            element(by.id("users_vitis_users_insert_form_password")).sendKeys('author');
            element(by.id("users_vitis_users_insert_form_password_confirm")).sendKeys('author');
            element(by.id("users_vitis_users_insert_form_form_submit")).click();
            FonctVeremes.waitToLoadPage();
            element(by.id("users_vitis_users_update_form_return_list")).click();
            // tri décroissant sur la colonne id de la liste des utilisateurs 
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            var cellule = FonctVeremes.dataCell("users_vitis_users_grid_data", 0, 2);

            expect(cellule.getText()).toEqual("author");

            element(by.id("user_column")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("btn_disconnect")).click();
            FonctVeremes.waitToLoadPage();
        });

        it("Connexion de author", function () {
            element(by.id("login_form_user_login")).sendKeys('author');
            element(by.id("login_form_user_password")).sendKeys('author');
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();

            expect(element(by.id("mode_column")).all(by.tagName("a")).count()).toEqual(6);
            expect(element(by.id("user_column")).getText()).toContain("author");


            FonctVeremes.waitBetweenTwoTests();
            element(by.id("user_column")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("btn_disconnect")).click();
            FonctVeremes.waitToLoadPageDev();

        });
    });

    /*
     it(" Impossibilité de supprimer des privilèges vitis_admin à un utilisateur connecté", function () {
     element(by.id("login_form_user_login")).sendKeys(t_admin);
     element(by.id("login_form_user_password")).sendKeys(testeur);
     element(by.id("login_form_name")).click();
     element(by.id("mode_users")).click();
     element(by.id("users_vitis_users_search_filter_button")).click();
     element(by.id("users_vitis_users_search_form_login")).sendKeys("t_admin");
     element(by.id("users_vitis_users_search_form_search")).click();
     element(by.css('[ng-if="grid.appScope.edit_column"]')).click();
     var liste_privileges = element(by.id("users_vitis_users_update_form_privileges_to"));
     liste_privileges.element(by.css('[label="framework_admin"]')).click();
     element(by.id("users_vitis_users_update_form_from_privileges_to_privilege")).click();
     element(by.id("users_vitis_users_update_form_form_submit")).click();
     });
     
     */



    describe("7 - Suppression utilisateurs et groupe-", function () {
        it("Suppression des utilisateurs ", function () {
            element(by.id("login_form_user_login")).sendKeys(login);

            element(by.id("login_form_user_password")).sendKeys(pwd);

            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();
            element(by.id("mode_users")).click();
            browser.sleep(500);

            //FonctVeremes.waitAfterClick();
            //element(by.className("framework_v_user_user_id")).element(by.className("ng-binding")).click();

            //var listusers = element(by.id("users_vitis_users_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
            var listusers = element(by.id("users_vitis_users_grid_data")).element(by.className("ui-grid-render-container-body")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
            listusers.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).each(function (el, i) {
                var celluleCompte = el.element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(2));
                //var celluleCompte = el.element(by.className("ui-grid-coluiGrid-0NU"));
                celluleCompte.getText().then(function (text) {
                    if ((text == "t_admin") || (text == "user") || (text == "eeeec") || (text == "صباح الخير") || (text == "你好") || (text == "author")) {
                        celluleCompte.element(by.className("ui-grid-cell-contents")).click();
                    }
                })
            });

            element(by.id("users_vitis_users_deleteFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterActions();

            element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"confirm\"]')).click();
            FonctVeremes.waitToLoadPage();

            // element(by.className("modal-dialog")).element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"confirm\"]')).click();
            //FonctVeremes.waitToLoadPage();

            //listusers.all(by.className("ui-grid-coluiGrid-0KK")).each(function (el, i) {
            // el.element(by.className("ui-grid-cell-contents")).getText().then(function (text) {

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
/*
        it("Suppression groupe ", function () {

            element(by.id("object_column_users_vitis_group")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();

            element(by.id("users_vitis_group_search_filter_button")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_group_search_form_name")).sendKeys("groupe_test2");
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_group_search_form_search")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();

            var liste_groupe = element(by.id("users_vitis_group_grid_data")).element(by.className("ui-grid-pinned-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
            liste_groupe.element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(0)).click();
            element(by.id("users_vitis_group_deleteFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
      

            element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"confirm\"]')).click();
            FonctVeremes.waitToLoadPage();
            
       

            var liste_groupe2 = element(by.id("users_vitis_group_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
            liste_groupe2.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).each(function (el, i) {

                console.log("\nLe groupe groupe_test2 n'est pas présent :");
                var celluleGroupe = el.element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(2));
                celluleGroupe.getText().then(function (text) {

                    expect(text).not.toEqual("groupe_test2");
                });
            });
        });
         */
    });
   
});



          
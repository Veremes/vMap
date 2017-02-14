/* global by, browser, element, expect, jasmine, protractor */

'use strict';
/**
 * @author: ME
 * @Description: test E2E on vitis 
 * Create and remove users
 */


describe("Vitis Impossibilité de créer un Utilsateur existant-", function () {
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

    describe("2 - Création d'un utilisateur existant -", function () {

        it("Impossibilité de créer un utilisateur existant", function () {

            element(by.id("mode_users")).click();
            element(by.id("users_vitis_users_add_smallFlexigrid_ui_grid_add")).click();
            element(by.id("users_vitis_users_insert_form_login")).sendKeys('marie');
            element(by.id("users_vitis_users_insert_form_name")).sendKeys('marie');
            element(by.id("users_vitis_users_insert_form_email")).sendKeys('marie@veremes.com');
            element(by.id("users_vitis_users_insert_form_company")).sendKeys('veremes');
        
            //attribution du groupe test
            var groupe = element(by.id("users_vitis_users_insert_form_groups_from"));
            groupe.element(by.css('[label="groupeTest"]')).click();
            element(by.id("users_vitis_users_insert_form_from_group_to_groups")).click();
            
            
            //attribution privilege gtf_user, vitis admin et vitis user:     
            var privilege = element(by.id("users_vitis_users_insert_form_privileges_from"));
            privilege.element(by.css('[label="gtf_user"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            privilege.element(by.css('[label="vitis_admin"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            privilege.element(by.css('[label="vitis_user"]')).click();
            element(by.id("users_vitis_users_insert_form_from_privilege_to_privileges")).click();
            element(by.id("users_vitis_users_insert_form_password")).sendKeys('marie');
            element(by.id("users_vitis_users_insert_form_password_confirm")).sendKeys('marie');
            element(by.id("users_vitis_users_insert_form_form_submit")).click();

            FonctVeremes.waitToLoadPage();
           
            expect(element(by.className("modal-body")).isPresent()).toBe(true);
            // expect(element(by.className("modal-content")).isPresent()).toBe(true);
           
            //element(by.className("modal-footer")).element(by.className("btn btn-default")).click();

            FonctVeremes.waitAfterClick();
            //element(by.id("btn_disconnect")).click();
            //FonctVeremes.waitToLoadPage();

        });
    });

});



          
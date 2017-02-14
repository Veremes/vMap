/* global by, browser, element, expect, jasmine, protractor */

'use strict';
/**
 * @author: ME
 * @Description: test E2E on vitis 
 * Create and remove users
 */


describe("Vitis contrainte adress IP-", function () {
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
    describe("1 - Connexion de l'admin-", function () {

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

    describe("2 - Contraintes IP -", function () {
        //IP vm03 : 5.135.125.198
        it("assignation d'un contrainte IP à l'utilisateur Marie", function () {

            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_users")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            //recherche de t_admin par le filtre 
            element(by.id("users_vitis_users_search_filter_button")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_search_form_login")).sendKeys("marie");
            element(by.id("users_vitis_users_search_form_search")).click();
            FonctVeremes.waitAfterClick();
            var cellCompte = FonctVeremes.dataCell("users_vitis_users_grid_data", 0, 2);
            expect(cellCompte.getText()).toEqual("marie");
            FonctVeremes.waitAfterClick();

            //Edition du compte t_admin : 
            element(by.css('[ng-if="grid.appScope.edit_column"]')).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            //attribution d'une adresse IP erronée 
            element(by.id("users_vitis_users_update_form_ip_constraint")).sendKeys("5.104.194.141");
            element(by.id("users_vitis_users_update_form_form_submit")).click();
            FonctVeremes.waitToLoadPage();
            element(by.id("user_column")).click();
            FonctVeremes.waitAfterClick();

            //déconnexion
            element(by.id("btn_disconnect")).click();
            FonctVeremes.waitToLoadPage();
            element(by.id("login_form_user_login")).sendKeys('marie');
            element(by.id("login_form_user_password")).sendKeys('marie');
            element(by.id("login_form_name")).click();
            //message d'erreur de connexion : 
            console.log("\n impossibilité de se connecter car IP erronée : ");
            expect(element(by.id("login_error_alert")).isPresent()).toBe(true);


            FonctVeremes.waitToLoadPage();
        });

        it("Attribution d'un adresse IP correcte", function () {
            //Connexion admin margot pour rééditer l'adresse IP de Marie
            element(by.id("login_form_user_login")).clear();
            element(by.id("login_form_user_login")).sendKeys(login);
            element(by.id("login_form_user_password")).clear();
            element(by.id("login_form_user_password")).sendKeys(pwd);
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();

            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_users")).click();
            FonctVeremes.waitAfterClick();

            //recherche de Marie par le filtre 
            element(by.id("users_vitis_users_search_filter_button")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_search_form_login")).sendKeys("marie");
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_search_form_search")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();


            //Edition du compte t_admin pour rééditer  adresse ip correcte
            element(by.css('[ng-if="grid.appScope.edit_column"]')).click();
            FonctVeremes.waitAfterClick();
            //attribution IP correct  
            element(by.id("users_vitis_users_update_form_ip_constraint")).clear();
            element(by.id("users_vitis_users_update_form_ip_constraint")).sendKeys("5.104.194.140|5.135.125.198");
            element(by.id("users_vitis_users_update_form_form_submit")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();

            element(by.id("user_column")).click();

            FonctVeremes.waitAfterClick();
            element(by.id("btn_disconnect")).click();
            FonctVeremes.waitToLoadPage();
            //reconnexion de Marie avec IP correct : 
            element(by.id("login_form_user_login")).sendKeys('marie');
            element(by.id("login_form_user_password")).sendKeys('marie');
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();

            expect(element(by.id("user_column")).getText()).toContain("marie");

        });

        it("suppression contrainte IP", function () {
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_users")).click();
            FonctVeremes.waitAfterClick();

            //recherche de Marie par le filtre 
            element(by.id("users_vitis_users_search_filter_button")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_search_form_login")).sendKeys("marie");
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_search_form_search")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();


            //Edition du compte Marie pour supprimer la contrainte IP
            element(by.css('[ng-if="grid.appScope.edit_column"]')).click();
            FonctVeremes.waitAfterClick();
            //suppression contrrainte IP 
            element(by.id("users_vitis_users_update_form_ip_constraint")).clear();
            element(by.id("users_vitis_users_update_form_form_submit")).click();

        });
    });
});
   
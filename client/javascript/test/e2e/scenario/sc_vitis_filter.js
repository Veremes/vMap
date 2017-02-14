/* global by, browser, element, expect, jasmine, protractor */


'use strict';
/**
 * @author: ME
 * @Description: test E2E on vitis 
 * Create and remove users
 */

describe("Vitis filters-", function () {

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

    it("should have a title in tab", function () {
        browser.ignoreSynchronization = true;
        browser.get('https://vm03.veremes.net/gtf/');
        FonctVeremes.waitToLoadPage();
        browser.driver.manage().window().setSize(1800, 1200);
        browser.ignoreSynchronization = false;
        //vérif du nom de l'onglet = Administration
        //expect(browser.getTitle()).toEqual('Gtf');
    });

    describe("Connect_admin", function () {
        //test de connexion de l'admin

        it("should connect my account to the app", function () {
            element(by.id("login_form_user_login")).sendKeys(login);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();

        });
    });



    /*
     describe("Filtres - Mode My work- ", function () {
     
     it("should filtre by Date ", function () {
     
     element(by.id("my_work_gtf_user_order_search_filter_button")).click();
     FonctVeremes.waitAfterClick;
     element(by.id("my_work_gtf_user_order_search_form_order_date")).sendKeys("29/03/2016");
     FonctVeremes.waitAfterSendKeys();
     
     element(by.id("my_work_gtf_user_order_search_form_search")).click();
     
     FonctVeremes.waitAfterClick();
     var listeDemandes = element(by.id("my_work_gtf_user_order_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
     expect(listeDemandes.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(1);
     
     element(by.id("my_work_gtf_user_order_search_form_reset")).click();
     FonctVeremes.waitAfterClick();
     
     });
     
     
     
     it("should filtre by Etat ", function () {
     var mode = element(by.id("mode_column"));
     mode.element(by.id("mode_my_work")).click();
     FonctVeremes.waitToLoadPage();
     element(by.id("my_work_gtf_user_order_search_filter_button")).click();
     FonctVeremes.waitAfterClick;
     FonctVeremes.waitToLoadPage();
     element(by.id("my_work_gtf_user_order_search_form_order_status_id")).element(by.cssContainingText('option', 'Erreur critique')).click();
     
     
     element(by.id("my_work_gtf_user_order_search_form_search")).click();
     var listeDemandes = element(by.id("my_work_gtf_user_order_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
     
     expect(listeDemandes.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(5);
     
     element(by.id("my_work_gtf_user_order_search_form_reset")).click();
     FonctVeremes.waitAfterClick();
     });
     
     it("should filtre by project FME ", function () {
     element(by.id("my_work_gtf_user_order_search_form_workspace_id")).element(by.cssContainingText('option', 'generic2generic')).click();
     element(by.id("my_work_gtf_user_order_search_form_search")).click();
     FonctVeremes.waitAfterClick();
     
     var listeDemandes = element(by.id("my_work_gtf_user_order_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
     expect(listeDemandes.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(1);
     
     element(by.id("my_work_gtf_user_order_search_form_reset")).click();
     FonctVeremes.waitAfterClick();
     });
     });
     */
    describe("Filtre dans le Mode users - ", function () {

        it(" - filtre par login ", function () {
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_users")).click();
            browser.sleep(6000);

            element(by.id("data_column")).element(by.id("users_vitis_users_grid")).element(by.id("users_vitis_users_grid_header")).element(by.id("users_vitis_users_search_filter_button")).click();
            browser.sleep(5000);
            element(by.id("users_vitis_users_search_form_login")).sendKeys("lucas");
            element(by.id("users_vitis_users_search_form_search")).click();
            browser.sleep(5000);
            var listeUsers = element(by.id("users_vitis_users_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));

            expect(listeUsers.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(1);

            element(by.id("users_vitis_users_search_form_reset")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
        });

        /*        it("should filtre by domain", function () {
         element(by.id("users_vitis_users_search_form_domain_id")).element(by.cssContainingText('option', 'test.veremes.net')).click();
         element(by.id("users_vitis_users_search_form_search")).click();
         FonctVeremes.waitAfterClick();
         browser.sleep(2000);
         var listeUsers = element(by.id("users_vitis_users_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
         
         expect(listeUsers.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(1);
         
         element(by.id("users_vitis_users_search_form_reset")).click();
         FonctVeremes.waitAfterClick();
         });
         });
         */

        it(" - Filtre par Nom", function () {
            element(by.id("users_vitis_users_search_form_name")).sendKeys("lucas baux");
            element(by.id("users_vitis_users_search_form_search")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            var listeUsers = element(by.id("users_vitis_users_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));

            expect(listeUsers.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(1);

            element(by.id("users_vitis_users_search_form_reset")).click();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();
        });

 

    it(" - Filtre par E-mail", function () {
        element(by.id("users_vitis_users_search_form_email")).sendKeys("marguerite.espada@veremes.com");
        element(by.id("users_vitis_users_search_form_search")).click();
        FonctVeremes.waitAfterClick();
        FonctVeremes.waitAfterClick();
        FonctVeremes.waitAfterClick();
        var listeUsers = element(by.id("users_vitis_users_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));

        expect(listeUsers.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(1);

        element(by.id("users_vitis_users_search_form_reset")).click();
        FonctVeremes.waitAfterClick();
    });


    it(" - Filtre par société ", function () {
        element(by.id("users_vitis_users_search_form_company")).sendKeys("Ma_société");
        element(by.id("users_vitis_users_search_form_search")).click();
        FonctVeremes.waitAfterClick();
        FonctVeremes.waitAfterClick();
        FonctVeremes.waitAfterClick();
        var listeUsers = element(by.id("users_vitis_users_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));

        expect(listeUsers.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(1);

        element(by.id("users_vitis_users_search_form_reset")).click();
        FonctVeremes.waitAfterClick();
    });

    it(" - Filtre par Service", function () {
        element(by.id("users_vitis_users_search_form_department")).sendKeys("Mon_service");
        element(by.id("users_vitis_users_search_form_search")).click();

           FonctVeremes.waitAfterClick();
             FonctVeremes.waitAfterClick();
              FonctVeremes.waitAfterClick();
        var listeUsers = element(by.id("users_vitis_users_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));

        expect(listeUsers.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(1);

        element(by.id("users_vitis_users_search_form_reset")).click();
        FonctVeremes.waitAfterClick();
    });

});

/*
describe("Filter - Mode engine - ", function () {

    it("should filtre by Name ", function () {
        var mode = element(by.id("mode_column"));
        mode.element(by.id("mode_engine")).click();
        FonctVeremes.waitAfterClick();
        FonctVeremes.waitAfterClick();
        //bouton filtre : 
        element(by.id("data_column")).element(by.id("engine_gtf_gtf_engine_grid")).element(by.id("engine_gtf_gtf_engine_grid_header")).element(by.id("engine_gtf_gtf_engine_search_filter_button")).click();
        FonctVeremes.waitAfterClick();

        FonctVeremes.waitAfterClick();

        element(by.id("engine_gtf_gtf_engine_search_form_name")).sendKeys("Moteur #1");
        element(by.id("engine_gtf_gtf_engine_search_form_search")).click();

        var listEngines = element(by.id("engine_gtf_gtf_engine_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
        FonctVeremes.waitAfterClick();

        expect(listEngines.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(1);

        element(by.id("engine_gtf_gtf_engine_search_form_reset")).click();
        FonctVeremes.waitAfterClick();
    });

    it("should filtre by Server", function () {
        element(by.id("engine_gtf_gtf_engine_search_form_server_id")).element(by.cssContainingText('option', 'localhost')).click();
        element(by.id("engine_gtf_gtf_engine_search_form_search")).click();
        FonctVeremes.waitAfterClick();
        var listEngines = element(by.id("engine_gtf_gtf_engine_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));

        expect(listEngines.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(3);

        element(by.id("engine_gtf_gtf_engine_search_form_reset")).click();
        FonctVeremes.waitAfterClick();
    });
});

describe("Filter - Mode Publication - ", function () {

    it("should filtre by Name ", function () {
        var mode = element(by.id("mode_column"));
        mode.element(by.id("mode_publication")).click();
        FonctVeremes.waitAfterClick();
        element(by.id("data_column")).element(by.id("publication_gtf_workspace_grid")).element(by.id("publication_gtf_workspace_grid_header")).element(by.id("publication_gtf_workspace_search_filter_button")).click();
        FonctVeremes.waitAfterClick();
        element(by.id("publication_gtf_workspace_search_form_name")).sendKeys("generic2generic");
        element(by.id("publication_gtf_workspace_search_form_search")).click();
        var listProjects = element(by.id("publication_gtf_workspace_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));

        expect(listProjects.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(1);

        element(by.id("publication_gtf_workspace_search_form_reset")).click();
        FonctVeremes.waitAfterClick();
    });

    it("should filtre by Category", function () {

        element(by.id("publication_gtf_workspace_search_form_category_id")).element(by.cssContainingText('option', 'Qualigéo')).click();
        element(by.id("publication_gtf_workspace_search_form_search")).click();
        FonctVeremes.waitAfterClick();
        var listProjects = element(by.id("publication_gtf_workspace_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));

        expect(listProjects.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(1);
        element(by.id("publication_gtf_workspace_search_form_reset")).click();
        FonctVeremes.waitAfterClick();
    });

    it("should filtre by file", function () {

        element(by.id("publication_gtf_workspace_search_form_fmw_file")).sendKeys("cleaner.fmw");
        element(by.id("publication_gtf_workspace_search_form_search")).click();
        FonctVeremes.waitAfterClick();
        var listProjects = element(by.id("publication_gtf_workspace_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));

        expect(listProjects.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(1);
        element(by.id("publication_gtf_workspace_search_form_reset")).click();
        FonctVeremes.waitAfterClick();
    });

    it("should filtre by owner", function () {

        element(by.id("publication_gtf_workspace_search_form_owner")).element(by.cssContainingText('option', 'testeur_admin')).click();
        element(by.id("publication_gtf_workspace_search_form_search")).click();
        FonctVeremes.waitAfterClick();
        var listProjects = element(by.id("publication_gtf_workspace_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));

        expect(listProjects.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(1);
        element(by.id("publication_gtf_workspace_search_form_reset")).click();
        FonctVeremes.waitAfterClick();
    });

    it("should filtre by FME version", function () {

        element(by.id("publication_gtf_workspace_search_form_last_save_build")).sendKeys("2013");
        element(by.id("publication_gtf_workspace_search_form_search")).click();
        FonctVeremes.waitAfterClick();
        var listProjects = element(by.id("publication_gtf_workspace_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));

        expect(listProjects.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(2);
        element(by.id("publication_gtf_workspace_search_form_reset")).click();
        FonctVeremes.waitAfterClick();
    });


    it("should filtre by multi filtres ", function () {
        element(by.id("publication_gtf_workspace_search_form_category_id")).element(by.cssContainingText('option', 'Campagne de tests unitaires')).click();
        element(by.id("publication_gtf_workspace_search_form_tag")).element(by.cssContainingText('option', 'fme2016')).click();
        element(by.id("publication_gtf_workspace_search_form_search")).click();
        FonctVeremes.waitAfterClick();
        var listProjects = element(by.id("publication_gtf_workspace_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));

        expect(listProjects.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(1);
        element(by.id("publication_gtf_workspace_search_form_reset")).click();
        FonctVeremes.waitAfterClick();


    });
});
/*
 describe("Filter - Mode Supervision - ", function () {
 
 it("should filtre by owner ", function () {
 var mode = element(by.id("mode_column"));
 mode.element(by.id("mode_supervision")).click();
 element(by.id("data_column")).element(by.id("supervision_gtf_order_grid")).element(by.id("supervision_gtf_order_grid_header")).element(by.id("supervision_gtf_order_search_filter_button")).click();
 element(by.id("supervision_gtf_order_search_form_user_id")).element(by.cssContainingText('option', 'antoine')).click();
 
 element(by.id("supervision_gtf_order_search_form_search")).click();
 
 FonctVeremes.waitToLoadPageDev();
 
 var listProjects = element(by.id("supervision_gtf_order_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
 
 expect(listProjects.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(1);
 element(by.id("supervision_gtf_order_search_form_reset")).click();
 FonctVeremes.waitAfterClick();
 });
 
 it("should filtre by FME Project ", function () {
 element(by.id("supervision_gtf_order_search_form_workspace_id")).element(by.cssContainingText('option', 'generic2generic')).click();
 element(by.id("supervision_gtf_order_search_form_search")).click();
 FonctVeremes.waitAfterClick();
 var listProjects = element(by.id("supervision_gtf_order_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
 
 expect(listProjects.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(1);
 element(by.id("supervision_gtf_order_search_form_reset")).click();
 FonctVeremes.waitAfterClick();
 });
 
 it("should filtre by FME Statut ", function () {
 element(by.id("supervision_gtf_order_search_form_order_status_id")).element(by.cssContainingText('option', 'Erreur critique')).click();
 element(by.id("supervision_gtf_order_search_form_search")).click();
 FonctVeremes.waitAfterClick();
 var listProjects = element(by.id("supervision_gtf_order_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
 
 expect(listProjects.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(6);
 element(by.id("supervision_gtf_order_search_form_reset")).click();
 FonctVeremes.waitAfterClick();
 });
 
 /*
 it("should filtre by multi filtres ", function () {
 element(by.id("supervision_gtf_order_search_form_user_id")).element(by.cssContainingText('option', 'element')).click();
 FonctVeremes.waitAfterClick();
 element(by.id("supervision_gtf_order_search_form_workspace_id")).element(by.cssContainingText('option', 'Admin_Export'));
 FonctVeremes.waitAfterClick();
 
 element(by.id("supervision_gtf_order_search_form_search")).click();
 
 /*
 var listProjects = element(by.id("supervision_gtf_order_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
 
 expect(listProjects.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(2);
 element(by.id("supervision_gtf_order_search_form_reset")).click();
 FonctVeremes.waitAfterClick
 
 
 });
 
 });
 */

 });

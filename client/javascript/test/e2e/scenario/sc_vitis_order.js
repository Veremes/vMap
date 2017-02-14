/* global by, browser, element, expect, jasmine */

'use strict';
/**
 * @author: M ESPADA
 * @Description: test E2E on GTF application
 * Ajout de demande : traitement Admin_import = import de .gex et suppression projet
 */

describe("vitis GTF Ajout de demande de traitement- ", function () {

    var FonctVeremes = require("../VeremesTest");
    var login = browser.params.login;
    var pwd = browser.params.password;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1900000; // maximum time between two IT
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
        browser.driver.manage().window().setSize(1800, 1200);
        browser.ignoreSynchronization = false;
        //vérif du nom de l'onglet = Administration
        //expect(browser.getTitle()).toEqual('Gtf');
    });

    describe("Connexion de l'admin - ", function () {

        it("connexion de l'admin", function () {
            element(by.id("login_form_user_login")).sendKeys(login);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage();

            expect(element(by.id("user_column")).getText()).toContain("margot");
        });
    });

    describe("Ajout d'une demande de traitement - ", function () {


        it("Ajout d'une demande admin_Import", function () {
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_my_work")).click();
            FonctVeremes.waitAfterActions();

            element(by.id("my_work_gtf_user_order_add_smallFlexigrid_ui_grid_add")).click();
                          
            FonctVeremes.waitAfterClick();

            //sélection catégorie + projet dans la liste des projets sous chrome : 
            element(by.id('my_work_gtf_user_order_insert_form_category_id')).click();
                          
            browser.actions().mouseMove(element(by.cssContainingText('option', 'Toutes les catégories'))).click().perform();
            browser.actions().mouseMove(element(by.cssContainingText('option', 'Toutes les catégories'))).click().perform();
            element(by.id("my_work_gtf_user_order_insert_form_workspace_id")).click();
            browser.actions().mouseMove(element(by.cssContainingText('option', 'Admin-Import'))).click().perform();
            browser.actions().mouseMove(element(by.cssContainingText('option', 'Admin-Import'))).click().perform();
            FonctVeremes.waitAfterClick();


            //chargement du gex "date.gex"
            var gex = FonctVeremes.pathResolver("./resource/DATE.gex");

            //element(by.id("my_work_gtf_user_order_insert_subform_sourceGexFile")).sendKeys(gex);
            //FonctVeremes.waitAfterSendKeys();
  
  
             var formulaire_import = element(by.id("WSubform"));
            formulaire_import.element(by.repeater("row in :refresh:oFormDefinition[sFormDefinitionName].rows track by $index")).row(0).sendKeys(gex);
  
   
  
  
  
  
  
  

            if (FonctVeremes.getBrowserName() == "chrome") {
                element(by.id("my_work_gtf_user_order_insert_subform_form_submit")).click();
            }
            else if (FonctVeremes.getBrowserName() == "firefox") {
                browser.actions().mouseMove(element(by.id("my_work_gtf_user_order_insert_subform_form_submit"))).click();
            }

            browser.sleep(70000);

            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_publication")).click();
            FonctVeremes.waitAfterClick();


            element(by.id("publication_gtf_workspace_search_filter_button")).click();
            element(by.id("publication_gtf_workspace_search_form_name")).sendKeys("test_param_date_time");
            element(by.id("publication_gtf_workspace_search_form_search")).click();
            FonctVeremes.waitAfterClick();

            console.log("\nRecherche par filtre du projet test_param_date_time");

            var cellule = FonctVeremes.dataCell("publication_gtf_workspace_grid_data", 0, 2);
            expect(cellule.getText()).toEqual("test_param_date_time");
            console.log("Projet importé");
        });


        it("Suppression du projet test_param_date_time  ", function () {

            var listeProjets = element(by.id("publication_gtf_workspace_grid_data")).element(by.className("ui-grid-pinned-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas"));
            listeProjets.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(0)).element(by.css('[ng-click=\"selectButtonClick(row, $event)\"]')).click();
            FonctVeremes.waitAfterClick();
            element(by.id("publication_gtf_workspace_deleteFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterClick();

        });
    });
});


/* global by, browser, element, expect, jasmine, protractor */

'use strict';
/**
 * @author: ME
 * @Description: test fme's published parameters on vitis 
 */

describe("Vitis - parametres FME", function () {

    var FonctVeremes = require("../VeremesTest");
    var login = browser.params.login;
    var pwd = browser.params.password;
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000; // maximum time between two IT
        //browser.ignoreSynchronization = true; //non angular application
        FonctVeremes.isAngularApp(true);
    });
    afterEach(function () {
        FonctVeremes.waitBetweenTwoTests();
    });
    it("should have a title in tab", function () {
        browser.driver.manage().window().maximize();
        FonctVeremes.isAngularApp(false);
        browser.get('https://vm03.veremes.net/gtf?debug');
        FonctVeremes.waitToLoadPage();
        FonctVeremes.isAngularApp(true);
        //vérif du nom de l'onglet = Gtf
        expect(browser.getTitle()).toEqual('Gtf');
    });


    describe("Connect_admin", function () {
        //test de connexion de l'admin

        it("should connect my account to the app", function () {

            element(by.id("login_form_user_login")).sendKeys(login);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            element(by.id("login_form_name")).click();
            expect(element(by.id("user_column")).getText()).toContain("margot");
        });
    });

    describe("test parameter choice ", function () {

        it("should add a fme project with choice paramter", function () {

            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_publication")).click();
            element(by.id("publication_0_add_smallFlexigrid_ui_grid_add")).click();
            element(by.id("publication_0_general_insert_form_name")).sendKeys('test_param_choice');

            var FileToUpload = FonctVeremes.pathResolver("../resource/test_param_choice_villes.fmw");
            element(by.id("publication_0_general_insert_form_fmw_file")).sendKeys(FileToUpload);
            
            var ResourceToUpload = FonctVeremes.pathResolver("../resource/villes.zip");
            element(by.id("publication_0_general_insert_form_other_file")).sendKeys(ResourceToUpload);
            FonctVeremes.waitToLoadPage();
            //Mot clé moteur + modele E-mail à rajouter une fois implémentés

            element(by.id("publication_0_general_insert_form_form_submit")).click();
            FonctVeremes.waitToLoadPage();
            
            //metadonnées
             element(by.repeater("section in ::oSectionForm[sSelectedObjectName].sections track by $index").row(1)).click();
             FonctVeremes.waitAfterClick();
             var listeCategories=element(by.id('publication_0_updateMetadata_update_form_category_id'));
             listeCategories.element(by.cssContainingText('option','Tests')).click();
             FonctVeremes.waitAfterSendKeys();
             element(by('publication_0_updateMetadata_update_form_form_submit')).click();
             FonctVeremes.waitEfterSendKeys();

            //droits : 
            element(by.repeater("section in ::oSectionForm[sSelectedObjectName].sections track by $index").row(2)).click();
            FonctVeremes.waitAfterClick();
            element(by.id("publication_0_updateRight_update_form_groups_from")).element(by.css('[label="test2"]')).click();
            element(by.id("publication_0_updateRight_update_form_from_group_to_groups")).click();
            element(by.id("publication_0_updateRight_update_form_form_submit")).click();
            FonctVeremes.waitAfterSendKeys();

            //formulaire : 
            element(by.repeater("section in ::oSectionForm[sSelectedObjectName].sections track by $index").row(3)).click();
            //FonctVeremes.waitAfterClick();
            FonctVeremes.waitToLoadPage();
            expect(element(by.id("Liste_ville_1_1_label")).getText()).toEqual("Ville à sélectionner :");
            //expect(element(by.id('publication_0_SubForm_update_subform_Liste_ville'))).toBeDefined();
            FonctVeremes.waitBetweenTwoTests();

        });


        it("should margot add order with choice parameter", function () {
            element(by.id("mode_my_work")).click();
            element(by.id("my_work_0_add_smallFlexigrid_ui_grid_add")).click();
            //sélection projet dans la liste sous chrome : 
            element(by.id('my_work_0_insert_form_workspace_id')).click();
            browser.actions().mouseMove(element(by.cssContainingText('option', 'test_param_choice'))).click().perform();
            browser.actions().mouseMove(element(by.cssContainingText('option', 'test_param_choice'))).click().perform();
            FonctVeremes.waitToLoadPage();
            expect(element(by.id("my_work_0_insert_subform_date_time_label"))).toBeDefined();
            browser.actions().mouseMove(element(by.cssContainingText('option', 'Agde'))).click().perform();
            element(by.id('publication_0_SubForm_update_subform_DestDataset_MAPINFO')).sendkeys('t_publication_1');
            element(by.id('my_work_0_insert_subform_form_submit')).click();
            FonctVeremes.waitToLoadPage();

            element(by.id('mode_supervision')).click();
            //recherche projet par le filtre : 
            //sélection dans la liste de projets (chrome) :  
            element(by.id('publication_0_search_filter_button')).click();
            
            element(by.id("supervision_0_search_form_workspace_id")).click;
            browser.actions().mouseMove(element(by.cssContainingText('option', 'test_param_choice'))).click().perform();
            browser.actions().mouseMove(element(by.cssContainingText('option', 'test_param_choice'))).click().perform();
            element(by.id("publication_0_search_form_search")).click();
            var celluleNomProjet = FonctVeremes.dataCell("publication_0_grid_data,0,2");
            expect(celluleNomProjet.getText()).toEqual("t_publication");
            FonctVeremes.waitBetweenTwoTests();
        });

    });

    describe("test parameter multi choice ", function () {
            it("should add a fme project with choice paramter", function () {
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_publication")).click();
            element(by.id("publication_0_add_smallFlexigrid_ui_grid_add")).click();
            element(by.id("publication_0_general_insert_form_name")).sendKeys('test_param_multi_choice');

            var FileToUpload = FonctVeremes.pathResolver("../resource/choix_multiple.fmw");
            element(by.id("publication_0_general_insert_form_fmw_file")).sendKeys(FileToUpload);
            var ResourceToUpload = FonctVeremes.pathResolver("../resource/DPT.zip");
            element(by.id("publication_0_general_insert_form_other_file")).sendKeys(ResourceToUpload);
            FonctVeremes.waitToLoadPage();
            
            //Mot clé moteur + modele E-mail à rajouter une fois implémentés
            element(by.id("publication_0_general_insert_form_form_submit")).click();
            FonctVeremes.waitToLoadPage();
            
            //metadonnées
             element(by.repeater("section in ::oSectionForm[sSelectedObjectName].sections track by $index").row(1)).click();
             FonctVeremes.waitAfterClick();
             var listeCategories=element(by.id('publication_0_updateMetadata_update_form_category_id'));
             listeCategories.element(by.cssContainingText('option','Tests')).click();
             FonctVeremes.waitAfterSendKeys();
             element(by('publication_0_updateMetadata_update_form_form_submit')).click();
             FonctVeremes.waitEfterSendKeys();

            //droits : 
            element(by.repeater("section in ::oSectionForm[sSelectedObjectName].sections track by $index").row(2)).click();
            FonctVeremes.waitAfterClick();
            element(by.id("publication_0_updateRight_update_form_groups_from")).element(by.css('[label="test2"]')).click();
            element(by.id("publication_0_updateRight_update_form_from_group_to_groups")).click();
            element(by.id("publication_0_updateRight_update_form_form_submit")).click();
            FonctVeremes.waitAfterSendKeys();

            //formulaire : 
            element(by.repeater("section in ::oSectionForm[sSelectedObjectName].sections track by $index").row(3)).click();
            FonctVeremes.waitAfterClick();
            expect(element(by.id("dept_1_1_label")).getText()).toEqual("département à renseigner:");
            expect(element(by.id('fest_2_1_label'))).getText().toEqual('festivals organisés par le CG :');
            FonctVeremes.waitBetweenTwoTests();
        });
it("should margot add order with multi choice parameter", function () {
            element(by.id("mode_my_work")).click();
            element(by.id("my_work_0_add_smallFlexigrid_ui_grid_add")).click();
            //sélection projet dans la liste sous chrome : 
            element(by.id('my_work_0_insert_form_workspace_id')).click();
            browser.actions().mouseMove(element(by.cssContainingText('option', 'test_param_mulit_choice'))).click().perform();
            browser.actions().mouseMove(element(by.cssContainingText('option', 'test_param_mulit_choice'))).click().perform();
            FonctVeremes.waitToLoadPage();
            expect(element(by.id("my_work_0_insert_subform_dept_label"))).toBeDefined();
            
            browser.actions().mouseMove(element(by.cssContainingText('option', 'ARDECHE'))).click().perform();
            
    
            element(by.id('publication_0_SubForm_update_subform_DestDataset_MAPINFO')).sendkeys('t_publication_1');
            element(by.id('my_work_0_insert_subform_form_submit')).click();
            FonctVeremes.waitToLoadPage();

            element(by.id('mode_supervision')).click();
            //recherche projet par le filtre : 
            //sélection dans la liste de projets (chrome) :  
            element(by.id('publication_0_search_filter_button')).click();
            
            element(by.id("supervision_0_search_form_workspace_id")).click;
            browser.actions().mouseMove(element(by.cssContainingText('option', 'test_param_choice'))).click().perform();
            browser.actions().mouseMove(element(by.cssContainingText('option', 'test_param_choice'))).click().perform();
            element(by.id("publication_0_search_form_search")).click();
            var celluleNomProjet = FonctVeremes.dataCell("publication_0_grid_data,0,2");
            expect(celluleNomProjet.getText()).toEqual("t_publication");
            FonctVeremes.waitBetweenTwoTests();
        });







        });
    });









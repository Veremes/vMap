/* global by, browser, element, expect, jasmine, protractor */


'use strict';
/**
 * @author: ME
 * @Description: test E2E on vitis 
 * Create and remove users
 */

describe("Vitis ActiveDirectory", function () {

    var FonctVeremes = require("../VeremesTest");
    var login = "margot";
    var pwd = "margot";

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000; // maximum time between two IT
        //browser.ignoreSynchronization = true; //non angular application
        FonctVeremes.isAngularApp(true);
    });
    afterEach(function () {
        FonctVeremes.waitBetweenTwoTests();
    });

    it("should have a title in tab", function () {
        browser.ignoreSynchronization = true;
        browser.get('https://vm03.veremes.net/gtf/?debug');
        FonctVeremes.waitToLoadPage();
        //browser.driver.manage().window().maximize();
        browser.driver.manage().window().setSize(1800, 1200);
        browser.ignoreSynchronization = false;
        //vérif du nom de l'onglet = Administration
        //expect(browser.getTitle()).toEqual('Gtf');
    });

    describe("Connect_admin - ", function () {
        //test de connexion de l'admin

        it("should connect my account to the app", function () {
            element(by.id("login_form_user_login")).sendKeys(login);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage;
            FonctVeremes.waitToLoadPage;
            //expect(element(by.id("user_column")).getText()).toContain("margot");
        });
    });


    describe("should import an user from AD- ", function () {

        it("should import a new user from AD", function () {

            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_users")).click();
            FonctVeremes.waitAfterClick();
            //Import utilisateur de l'AD
           
            element(by.id("users_vitis_users_adImport_ui_grid_add")).click();

            FonctVeremes.waitAfterClick();
            FonctVeremes.waitAfterClick();


            var fenetreConnexionAD = element(by.id("form_active_directory_connection_users_vitis_users"));
           
            expect(fenetreConnexionAD.isPresent()).toBe(true);
            // element(by.id("my_work_gtf_user_order_search_form_order_status_id")).element(by.cssContainingText('option', 'Traité')).click();


            expect(fenetreConnexionAD.element(by.id("users_vitis_users_import_ad_form_domain")).element(by.cssContainingText('option', 'test.veremes.net')).isPresent()).toBe(true);
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_import_ad_form_login")).sendKeys("margot");
            element(by.id("users_vitis_users_import_ad_form_password")).sendKeys("canigouCO!");
            element(by.id("users_vitis_users_import_ad_form_form_submit")).click();
            FonctVeremes.waitBeforeAlert();

            var ArbreAD = element(by.id("active_directory_users_vitis_users_treeview"));

            ArbreAD.all(by.tagName('li')).filter(function (el, i) {
                return el.getText().then(function (text) {

                    return text === "OU=Veremes Paris"

                });

            }).first().click();

            //ArbreAD.element(by.css('[data-nodeid=\"115\"]')).click();
            FonctVeremes.waitBeforeAlert();
            FonctVeremes.waitBeforeAlert();
            if (FonctVeremes.getBrowserName() == "firefox") {
                FonctVeremes.waitBeforeAlert();
            }
            /*
             element(by.id("active_directory_users_vitis_users_treeview")).each(function (el, i) {
             el.element(by.className("list-group-item")).getText().then(function (text) {
             console.log(text);
             
             if (text == "Veremes Paris")
             {el.element(by.className("list-group-item")).click();
             }
             });
             });
             */

            var Grille = element(by.id("active_directory_users_vitis_users_grid")).element(by.className("ui-grid-pinned-container")).element(by.className("ui-grid-canvas"));
            var toClick = Grille.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(1)).element(by.repeater("colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(0));

            if (FonctVeremes.getBrowserName() == "chrome") {
                toClick.click();
            } else if (FonctVeremes.getBrowserName() == "firefox") {
                browser.actions().mouseMove(toClick).mouseDown(toClick).mouseUp().perform();
            }
            //var Grille = element(by.id("active_directory_users_vitis_users_grid")).element(by.className("ui-grid-pinned-container")).element(by.className("ui-grid-canvas"));

            FonctVeremes.waitBeforeAlert();

            FonctVeremes.waitAfterClick();

            element(by.id("active_directory_users_vitis_users_import_btn_ui_grid_add")).click();
            browser.sleep(3000);

            element(by.id("object_column_users_vitis_users")).click();
            FonctVeremes.waitAfterClick();

            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            element(by.className("users_vitis_users_user_id")).element(by.className("ng-binding")).click();
            var celluleNom = FonctVeremes.dataCell("users_vitis_users_grid_data", 0, 3);
            expect(celluleNom.getText()).toEqual("Alphonse Allais");

            var celluleDomaine = FonctVeremes.dataCell("users_vitis_users_grid_data", 0, 8);
            expect(celluleDomaine.getText()).toEqual("test.veremes.net");

            element(by.id("user_column")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("btn_disconnect")).click();
            browser.sleep(10000);

        });

        it("-Alphonse Allais- user AD -should connect to gtf", function () {
            element(by.id("login_form_domain")).element(by.cssContainingText('option', 'veremes.net')).click();
            element(by.id("login_form_user_login")).sendKeys("alphonse.allais");
            //element(by.id("login_form_user_login")).sendKeys("jean.anouilh");
            element(by.id("login_form_user_password")).sendKeys("canigouCO!");
            element(by.id("login_form_name")).click();
            FonctVeremes.waitAfterClick();
            expect(element(by.id("user_column")).getText()).toContain("alphonse.allais@test.veremes.net");

            element(by.id("user_column")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("btn_disconnect")).click();
            browser.sleep(10000);
            browser.sleep(10000);
        });


        it("Gestion mixte des utilisateurs", function () {
            //configuration de la gestion mixte
            element(by.id("login_form_user_login")).sendKeys(login);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage;
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_configuration")).click();
            element(by.id("radio_mixed_rights_management_0")).click();
            element(by.id("configuration_vitis_configuration_general_update_form_form_submit")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("mode_column")).element(by.id("mode_users")).click();


            //recherche de Alphonse Allais par filtre 
            element(by.id("users_vitis_users_search_filter_button")).click();
            element(by.id("users_vitis_users_search_form_login")).sendKeys("alphonse.allais");
            element(by.id("users_vitis_users_search_form_search")).click();
            var cellCompte = FonctVeremes.dataCell("users_vitis_users_grid_data", 0, 2);
            expect(cellCompte.getText()).toEqual("alphonse.allais@test.veremes.net");

            //Verification de présence de groupe local 
            element(by.css('[ng-if="grid.appScope.edit_column"]')).click();
            browser.sleep(1000);
            expect(element(by.id("users_vitis_users_update_form_groups_label")).isPresent()).toBe(true);

            element(by.id("user_column")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("btn_disconnect")).click();
            browser.sleep(10000);
            browser.sleep(10000);
        });


        it("Gestion NON mixte des utilisateurs", function () {
            //configuration de la gestion mixte
            element(by.id("login_form_user_login")).sendKeys(login);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            element(by.id("login_form_name")).click();
            FonctVeremes.waitToLoadPage;
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_configuration")).click();
            element(by.id("radio_mixed_rights_management_1")).click();
            element(by.id("configuration_vitis_configuration_general_update_form_form_submit")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("mode_column")).element(by.id("mode_users")).click();

            //recherche de Alphonse Allais par filtre 
            element(by.id("users_vitis_users_search_filter_button")).click();
            element(by.id("users_vitis_users_search_form_login")).sendKeys("alphonse.allais");
            element(by.id("users_vitis_users_search_form_search")).click();
            var cellCompte = FonctVeremes.dataCell("users_vitis_users_grid_data", 0, 2);
            expect(cellCompte.getText()).toEqual("alphonse.allais@test.veremes.net");

            //Verification de présence de groupe local 
            element(by.css('[ng-if="grid.appScope.edit_column"]')).click();
            browser.sleep(1000);
            expect(element(by.id("users_vitis_users_update_form_groups_label")).isPresent()).toBe(false);

            element(by.id("user_column")).click();
            FonctVeremes.waitAfterClick();
            element(by.id("btn_disconnect")).click();
            browser.sleep(10000);
            browser.sleep(10000);

        });



        it("admin should delete user AD Alphonse Allais", function () {
            element(by.id("login_form_user_login")).sendKeys(login);
            element(by.id("login_form_user_password")).sendKeys(pwd);
            element(by.id("login_form_name")).click();
            browser.sleep(3000);
            var mode = element(by.id("mode_column"));
            mode.element(by.id("mode_users")).click();
            browser.sleep(1000);

            //recherhce par filtre d'alphonse Allais 
            element(by.id("users_vitis_users_search_filter_button")).click();
            browser.sleep(3000);
            element(by.id("users_vitis_users_search_form_name")).sendKeys("Alphonse Allais");
            element(by.id("users_vitis_users_search_form_search")).click();
            FonctVeremes.waitAfterClick();

            //Sélection d'Alphonse Allais : 
            var listeUser = element(by.id("users_vitis_users_grid_data")).element(by.className("ui-grid-pinned-container")).element(by.className("ui-grid-canvas"));
            //listeUser.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.className("ui-grid-selection-row-header-buttons")).click();
            listeUser.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(0)).element(by.css('[ng-click=\"selectButtonClick(row, $event)\"]')).click();

            //Suppression d'Alphonse Allais 
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_users_deleteFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitAfterClick();
            element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"confirm\"]')).click();
            browser.sleep(1000);

            var listeUserRight = element(by.id("users_vitis_users_grid_data")).element(by.className("ui-grid-render-container-body")).element(by.className("ui-grid-canvas"));

            listeUserRight.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).each(function (el, i) {
                el.element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(3)).getText().then(function (text) {
                    expect(text).not.toEqual("Alphonse Allais");
                    browser.sleep(1000);
                });
            });
        });
    });

    /*
     describe("should import a AD group ", function () {
     it("import an AD group", function () {
     element(by.id("object_column_users_vitis_group")).click();
     browser.sleep(300);
     element(by.id("users_vitis_group_adImport_ui_grid_add")).click();
     browser.sleep(300);
     var fenetreConnexionAD = element(by.id("form_active_directory_connection_users_vitis_group"));
     
     expect(fenetreConnexionAD.element(by.id("users_vitis_group_import_ad_form_domain")).element(by.cssContainingText('option', 'test.veremes.net')).isPresent()).toBe(true);
     FonctVeremes.waitAfterClick();
     element(by.id("users_vitis_group_import_ad_form_login")).sendKeys("margot");
     element(by.id("users_vitis_group_import_ad_form_password")).sendKeys("canigouCO!");
     element(by.id("users_vitis_group_import_ad_form_form_submit")).click();
     FonctVeremes.waitBeforeAlert();
     
     var ArbreAD = element(by.id("active_directory_users_vitis_group_treeview"));
     // ArbreAD.all(by.tagName('li')).get(5).click(); 
     ArbreAD.all(by.tagName('li')).get(5).click();
     FonctVeremes.waitAfterClick();
     
     
     var Grille = element(by.id("active_directory_users_vitis_group_grid")).element(by.className("ui-grid-pinned-container")).element(by.className("ui-grid-canvas"));
     var toClick = Grille.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.repeater("colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(0));
     browser.actions().mouseMove(toClick).mouseDown(toClick).mouseUp().perform();
     FonctVeremes.waitAfterClick();
     element(by.id("active_directory_users_vitis_group_import_btn_ui_grid_add")).click();
     FonctVeremes.waitAfterClick();
     element(by.id("object_column_users_vitis_group")).click();
     browser.sleep(300);
     element(by.className("users_vitis_group_group_id")).element(by.className("ng-binding")).click();
     element(by.className("users_vitis_group_group_id")).element(by.className("ng-binding")).click();
     element(by.className("users_vitis_group_group_id")).element(by.className("ng-binding")).click();
     var celluleNom = FonctVeremes.dataCell("users_vitis_group_grid_data", 0, 3);
     expect(celluleNom.getText()).toEqual("Administrateurs de l’entreprise");
     
     });
     
     });
     */



    describe("should delete and create a domain ", function () {

        it("should delete a domain", function () {

            element(by.id("object_column")).element(by.id("object_column_users_vitis_domain")).click();
            element(by.id("users_vitis_domain_search_filter_button")).click();
            browser.sleep(300);
            element(by.id("users_vitis_domain_search_form_alias")).sendKeys("veremes.net");
            element(by.id("users_vitis_domain_search_form_search")).click();
            browser.sleep(2000);



            var listResult = element(by.id("data_column")).element(by.repeater("mode in ::modes track by $index").row(2));
            var listResult2 = listResult.element(by.id("users_vitis_domain_grid")).element(by.id("users_vitis_domain_grid_data")).element(by.className("ui-grid-pinned-container")).element(by.className("ui-grid-viewport"));
            var DomaineASupp = listResult2.element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).element(by.repeater("(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name").row(0));

//element(by.id("users_vitis_domain_grid_data")).element(by.className("ui-grid-render-container")).element(by.className("ui-grid-viewport")).element(by.className("ui-grid-canvas")).element(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index").row(0)).click();


            if (FonctVeremes.getBrowserName() == "chrome") {
                DomaineASupp.click();
            } else if (FonctVeremes.getBrowserName() == "firefox") {
                //DomaineASupp.click();
                browser.actions().mouseMove(DomaineASupp).mouseDown(DomaineASupp).mouseUp().perform();
            }
            //console.log("domaine à supprimer");
            FonctVeremes.waitAfterClick();
            element(by.id("users_vitis_domain_deleteFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitBeforeAlert();

            element(by.className("bootbox-confirm")).element(by.className("modal-content")).element(by.className("modal-footer")).element(by.css('[data-bb-handler=\"confirm\"]')).click();
            browser.sleep(10000);

            var listeDomaine = element(by.id("users_vitis_domain_grid_data")).element(by.className("ui-grid-render-container-body")).element(by.className("ui-grid-canvas"));

            expect(listeDomaine.all(by.repeater("(rowRenderIndex, row) in rowContainer.renderedRows track by $index")).count()).toEqual(0);

            FonctVeremes.waitBetweenTwoTests();

        });

        it("should re create domain veremes.net", function () {

            element(by.id("users_vitis_domain_add_smallFlexigrid_ui_grid_add")).click();
            FonctVeremes.waitToLoadPage();
            element(by.id("users_vitis_domain_insert_form_alias")).sendKeys("veremes.net");
            element(by.id("users_vitis_domain_insert_form_domain")).sendKeys("test.veremes.net");
            element(by.id("users_vitis_domain_insert_form_server")).sendKeys("5.135.125.198");
            element(by.id("users_vitis_domain_insert_form_port")).sendKeys("389");
            element(by.id("users_vitis_domain_insert_form_form_submit")).click();
            FonctVeremes.waitToLoadPage();
            element(by.id("users_vitis_domain_update_form_return_list")).click();
            FonctVeremes.waitToLoadPage();
            //tri décroissant sur ID 
            element(by.className("users_vitis_domain_domain_id")).element(by.className("ng-binding")).click();
            element(by.className("users_vitis_domain_domain_id")).element(by.className("ng-binding")).click();
            element(by.className("users_vitis_domain_domain_id")).element(by.className("ng-binding")).click();
            var celluleNom = FonctVeremes.dataCell("users_vitis_domain_grid_data", 0, 3);
            expect(celluleNom.getText()).toEqual("veremes.net");

        });

    });
});
  
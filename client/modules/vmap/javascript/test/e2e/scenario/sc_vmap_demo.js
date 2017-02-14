/* global by, browser, element, expect */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: test E2E on Vmap application
 * all the test E2E on Vmap toggle interaction, selection, use of fields...
 */
describe('Protractor Vmap App', function () {   
    var center;
    var Veremes = require(__dirname + "/../VeremesTest.js")
	
	beforeEach(function(){
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
		Veremes.isAngularApp(true);
	});
    afterEach(function(){
       Veremes.waitBetweenTwoTests();
    });
    
    it("should have a title", function () {
        browser.get('http://vm01.veremes.net/vmap');
        expect(browser.getTitle()).toEqual('vmap 2015');
    });
    
    it("should have search in search bar",function(){
        expect(element(by.className('location-tool-search')).getAttribute('value')).toBe('');
        element(by.className('location-tool-search')).sendKeys('hello');
        expect(element(by.className('location-tool-search')).getAttribute('value')).toBe('hello');
    });
      /* 
    it("should zoom in on the map", function () {
        var tmp = element(by.className("ol-zoomslider-thumb")).getAttribute('style');
        element(by.className("ol-zoom-in")).click();
        expect(element(by.className("ol-zoomslider-thumb")).getAttribute('style')).toBeLessThan(tmp);
    });
 
    it("should zoom out on the map", function () {
        var tmp = element(by.className("ol-zoomslider-thumb")).getAttribute('style');
        element(by.className("ol-zoom-out")).click();
        expect(element(by.className("ol-zoomslider-thumb")).getAttribute('style')).toBeGreaterThan(tmp);
    });
    */
    it("should open left side bar on click",function(){
        expect(element(by.id("left-sidebar")).getAttribute('class')).toEqual("");
        element(by.id("opener-sidebar")).click();
        Veremes.waitAfterClick();
        expect(element(by.id("left-sidebar")).getAttribute('class')).toContain("open");
    });
    
    it("should have no problem with UTF-8",function(){
        expect(element(by.className("layertree-button-content")).getText()).toEqual("Jeux de données");
        expect(element(by.className("layersorder-button-content")).getText()).toEqual("Table des matières");
        expect(element(by.className("maplegend-button-content")).getText()).toEqual("Légende");
    });
    
    it("should open 'Jeux de donnée' on click",function(){
        expect(element(by.className("layertree-button-content")).getAttribute('collapse')).toEqual("in");
        element(by.className("layertree-button-content")).click();
        Veremes.waitAfterClick();
        expect(element(by.className("layertree-button-content")).getAttribute('collapse')).toEqual("out");
        element(by.className("layertree-button-content")).click();
        Veremes.waitAfterClick();
        expect(element(by.className("layertree-button-content")).getAttribute('collapse')).toEqual("in");
    });
    
    it("should open 'Table des matières' on click",function(){
        expect(element(by.className("layersorder-button-content")).getAttribute('collapse')).toEqual("out");
        element(by.className("layersorder-button-content")).click();
        Veremes.waitAfterClick();
        expect(element(by.className("layersorder-button-content")).getAttribute('collapse')).toEqual("in");
        element(by.className("layersorder-button-content")).click();
        Veremes.waitAfterClick();
        expect(element(by.className("layersorder-button-content")).getAttribute('collapse')).toEqual("out");
    });
    
    it("should open 'Légende' on click",function(){
        expect(element(by.className("maplegend-button-content")).getAttribute('collapse')).toEqual("out");
        element(by.className("maplegend-button-content")).click();
        Veremes.waitAfterClick();
        expect(element(by.className("maplegend-button-content")).getAttribute('collapse')).toEqual("in");
        element(by.className("maplegend-button-content")).click();
        Veremes.waitAfterClick();
        expect(element(by.className("maplegend-button-content")).getAttribute('collapse')).toEqual("out");
    });
    
    it("should open a new window on 'Gestion des cartes' click",function(){
        expect(element(by.id("mapModalManager")).getAttribute('className')).toEqual("modal fade");
        element(by.id("map-manager-button")).click();
        Veremes.waitForModal()
        expect(element(by.id("mapModalManager")).getAttribute('className')).toEqual("modal fade in");
    });
    
    it("should open with maplist active",function(){
        expect(element(by.css('[href="#modal-mymap"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-maplist"]')).getAttribute('className')).toContain("active");
        expect(element(by.css('[href="#modal-wms"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-wfs"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-geometry"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-osm"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-bing"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-ign"]')).getAttribute('className')).not.toContain("active");
    });
    
    it("should change class active on click on mymap button", function(){
        element(by.css('[href="#modal-mymap"]')).click();
        center = element(by.css('[data-original-title="position actuelle"]')).getAttribute('value');
        expect(element(by.css('[href="#modal-mymap"]')).getAttribute('className')).toContain("active");
        expect(element(by.css('[href="#modal-maplist"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-wms"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-wfs"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-geometry"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-osm"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-bing"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-ign"]')).getAttribute('className')).not.toContain("active");
    });
    
    it("should change active class on click on maplist button", function(){
        element(by.css('[href="#modal-maplist"]')).click();
        expect(element(by.css('[href="#modal-mymap"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-maplist"]')).getAttribute('className')).toContain("active");
        expect(element(by.css('[href="#modal-wms"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-wfs"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-geometry"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-osm"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-bing"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-ign"]')).getAttribute('className')).not.toContain("active"); 
    });
    
    it("should change active class on click on wms button",function(){
        element(by.css('[href="#modal-wms"]')).click();
        expect(element(by.css('[href="#modal-mymap"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-maplist"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-wms"]')).getAttribute('className')).toContain("active");
        expect(element(by.css('[href="#modal-wfs"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-geometry"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-osm"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-bing"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-ign"]')).getAttribute('className')).not.toContain("active");
    });
    
    it("should change active class on click on wfs button",function(){
        element(by.css('[href="#modal-wfs"]')).click();
        expect(element(by.css('[href="#modal-mymap"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-maplist"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-wms"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-wfs"]')).getAttribute('className')).toContain("active");
        expect(element(by.css('[href="#modal-geometry"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-osm"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-bing"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-ign"]')).getAttribute('className')).not.toContain("active");
    });
    
    it("should change active class on click on geometry button", function(){
        element(by.css('[href="#modal-geometry"]')).click();
        expect(element(by.css('[href="#modal-mymap"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-maplist"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-wms"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-wfs"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-geometry"]')).getAttribute('className')).toContain("active");
        expect(element(by.css('[href="#modal-osm"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-bing"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-ign"]')).getAttribute('className')).not.toContain("active");
    });
    
    it("should change active class on click on osm button",function(){
        element(by.css('[href="#modal-osm"]')).click();
        expect(element(by.css('[href="#modal-mymap"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-maplist"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-wms"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-wfs"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-geometry"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-osm"]')).getAttribute('className')).toContain("active");
        expect(element(by.css('[href="#modal-bing"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-ign"]')).getAttribute('className')).not.toContain("active");
    });
    
    it("should change active class on click on bing button",function(){
        element(by.css('[href="#modal-bing"]')).click();
        expect(element(by.css('[href="#modal-mymap"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-maplist"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-wms"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-wfs"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-geometry"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-osm"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-bing"]')).getAttribute('className')).toContain("active");
        expect(element(by.css('[href="#modal-ign"]')).getAttribute('className')).not.toContain("active");
    });
    
    it("should change active class on click on ign button",function(){
        element(by.css('[href="#modal-ign"]')).click();
        expect(element(by.css('[href="#modal-mymap"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-maplist"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-wms"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-wfs"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-geometry"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-osm"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-bing"]')).getAttribute('className')).not.toContain("active");
        expect(element(by.css('[href="#modal-ign"]')).getAttribute('className')).toContain("active"); 
    });
    
    it("should close mapmodal's window", function(){
        expect(element(by.id("mapModalManager")).getAttribute('className')).toEqual("modal fade in");
        element(by.id("close-modal-button")).click();
        //Veremes.waitForModal()
        expect(element(by.id("mapModalManager")).getAttribute('className')).toEqual("modal fade");
    });

    
    /*it("should geolocate me on the map and return to his position",function(){
        element(by.className('glyphicon-map-marker')).click();
        element(by.id("map-manager-button")).click();
        Veremes.waitForModal();
        //element(by.css('[href="#modal-mymap"]')).click();
        //browser.sleep(300);
        //expect(element(by.css('[data-original-title="position actuelle"]')).getAttribute('value')).not.toEqual(center);
        //element(by.id("close-modal-button")).click();
        //browser.sleep(300);
        element(by.css('[title="Centre la carte à la position d\'origine"]')).click();
        Veremes.waitToLoadPage();
        element(by.id("map-manager-button")).click();
        Veremes.waitForModal();
        expect(element(by.css('[data-original-title="position actuelle"]')).getAttribute('value')).toEqual(center);
        element(by.id("close-modal-button")).click();
    });*/
    
    it("should open the location window",function(){
        expect(element(by.css('[title="Centre la carte sur une position donnée"]')).getAttribute('className')).not.toContain('active');
        element(by.css('[title="Centre la carte sur une position donnée"]')).click();
        //browser.sleep(200);
        expect(element(by.css('[title="Centre la carte sur une position donnée"]')).getAttribute('className')).toContain('active');
    });
    
    it("should go on a location and go on position's origin",function(){
        element(by.id("goto-coordinates-field-lon")).sendKeys(34);
        element(by.id("goto-coordinates-field-lat")).sendKeys(52);
		element(by.id("location-select-projection")).element(by.css("[value=\"EPSG:4326\"]")).click()
        element(by.css("[ng-click=\"ctrl.goTo('goto-coordinates-field-lon', 'goto-coordinates-field-lat', 'location-select-projection')\"]")).click();
        Veremes.waitToLoadPage();
        element(by.id("map-manager-button")).click();
        Veremes.waitForModal();
        //expect(element(by.css('[data-original-title="position actuelle"]')).getAttribute('value')).toEqual("[34,52]");
        element(by.id("close-modal-button")).click();
        Veremes.waitAfterClick();
        element(by.css('[title="Centre la carte à la position d\'origine"]')).click();
        Veremes.waitToLoadPage();
        element(by.id("map-manager-button")).click();
        Veremes.waitAfterClick();
        expect(element(by.css('[data-original-title="position actuelle"]')).getAttribute('value')).toEqual(center);
        element(by.id("close-modal-button")).click();
    });
    
    it("should close the location windows",function(){
        expect(element(by.css('[title="Centre la carte sur une position donnée"]')).getAttribute('className')).toContain('active');
        element(by.css('[title="Centre la carte sur une position donnée"]')).click();
        //browser.sleep(200);
        expect(element(by.css('[title="Centre la carte sur une position donnée"]')).getAttribute('className')).not.toContain('active');
        element(by.id("opener-sidebar")).click();
    });
    
    it("should open the measure tool on click", function(){
        expect(element(by.css('[title="Outils de mesure"]')).getAttribute("className")).not.toContain("active");
        element(by.css('[title="Outils de mesure"]')).click();
        //browser.sleep(200);
        expect(element(by.css('[title="Outils de mesure"]')).getAttribute("className")).toContain("active");
    });
    
    it("should activate tools measure on line", function(){
        expect(element(by.id("measure-line-button")).getAttribute("className")).not.toContain("active");
        element(by.id("measure-line-button")).click();
        //browser.sleep(150);
        expect(element(by.id("measure-line-button")).getAttribute("className")).toContain("active");
        element(by.id("measure-line-button")).click();
        //browser.sleep(150);
        expect(element(by.id("measure-line-button")).getAttribute("className")).not.toContain("active");
    });
    
    it("should activate tools measure on polygon", function(){
        expect(element(by.id("measure-polygon-button")).getAttribute("className")).not.toContain("active");
        element(by.id("measure-polygon-button")).click();
        //browser.sleep(150);
        expect(element(by.id("measure-polygon-button")).getAttribute("className")).toContain("active");
        element(by.id("measure-polygon-button")).click();
        //browser.sleep(150);
        expect(element(by.id("measure-polygon-button")).getAttribute("className")).not.toContain("active");
    });
    
    it("should activate tools measure on circle", function(){
        expect(element(by.id("measure-circle-button")).getAttribute("className")).not.toContain("active");
        element(by.id("measure-circle-button")).click();
        //browser.sleep(150);
        expect(element(by.id("measure-circle-button")).getAttribute("className")).toContain("active");
        element(by.id("measure-circle-button")).click();
        //browser.sleep(150);
        expect(element(by.id("measure-circle-button")).getAttribute("className")).not.toContain("active");
    });
    
    it("should activate tools measure delete", function(){
        expect(element(by.id("measure-dell-button")).getAttribute("className")).not.toContain("active");
        element(by.id("measure-dell-button")).click();
        //browser.sleep(150);
        expect(element(by.id("measure-dell-button")).getAttribute("className")).toContain("active");
        element(by.id("measure-dell-button")).click();
        //browser.sleep(150);
        expect(element(by.id("measure-dell-button")).getAttribute("className")).not.toContain("active");
    });
    
    it("should activate tools measure modify", function(){
        expect(element(by.id("measure-modify-button")).getAttribute("className")).not.toContain("active");
        element(by.id("measure-modify-button")).click();
        //browser.sleep(150);
        expect(element(by.id("measure-modify-button")).getAttribute("className")).toContain("active");
        element(by.id("measure-modify-button")).click();
        //browser.sleep(150);
        expect(element(by.id("measure-modify-button")).getAttribute("className")).not.toContain("active");
    });
    
    it("should activate tools measure display", function(){
        expect(element(by.id("measureAndDrawModal")).getAttribute("className")).not.toContain("in");
        element(by.id("measure-display-features-button")).click();
        Veremes.waitAfterClick();
        expect(element(by.id("measureAndDrawModal")).getAttribute("className")).toContain("in");
        element(by.id('modal-display-measure-close')).click();
        Veremes.waitAfterClick();
        expect(element(by.id("measureAndDrawModal")).getAttribute("className")).not.toContain("in");
    });
    
    it("should close the measure tool on click", function(){
        expect(element(by.css('[title="Outils de mesure"]')).getAttribute("className")).toContain("active");
        element(by.css('[title="Outils de mesure"]')).click();
        //browser.sleep(200);
        expect(element(by.css('[title="Outils de mesure"]')).getAttribute("className")).not.toContain("active");
    });
    
    it("should open the selection tool on click", function(){
        expect(element(by.css('[title="Sélection"]')).getAttribute("className")).not.toContain("active");
        element(by.css('[title="Sélection"]')).click();
        //browser.sleep(150);
        expect(element(by.css('[title="Sélection"]')).getAttribute("className")).toContain("active");
    });
    
    it("should activate tools selection by point", function(){
        expect(element(by.id("selection-point-button")).getAttribute("className")).not.toContain("active");
        element(by.id("selection-point-button")).click();
        //browser.sleep(150);
        expect(element(by.id("selection-point-button")).getAttribute("className")).toContain("active");
        element(by.id("selection-point-button")).click();
        //browser.sleep(150);
        expect(element(by.id("selection-point-button")).getAttribute("className")).not.toContain("active");
    });
    
    it("should activate tools selection by box", function(){
        expect(element(by.id("selection-square-button")).getAttribute("className")).not.toContain("active");
        element(by.id("selection-square-button")).click();
        //browser.sleep(150);
        expect(element(by.id("selection-square-button")).getAttribute("className")).toContain("active");
        element(by.id("selection-square-button")).click();
        //browser.sleep(150);
        expect(element(by.id("selection-square-button")).getAttribute("className")).not.toContain("active");
    });    
    
    it("should activate tools selection by polygon", function(){
        expect(element(by.id("selection-polygon-button")).getAttribute("className")).not.toContain("active");
        element(by.id("selection-polygon-button")).click();
        //browser.sleep(150);
        expect(element(by.id("selection-polygon-button")).getAttribute("className")).toContain("active");
        element(by.id("selection-polygon-button")).click();
        //browser.sleep(150);
        expect(element(by.id("selection-polygon-button")).getAttribute("className")).not.toContain("active");
    });   
    
    it("should activate tools selection by circle", function(){
        expect(element(by.id("selection-circle-button")).getAttribute("className")).not.toContain("active");
        element(by.id("selection-circle-button")).click();
        //browser.sleep(150);
        expect(element(by.id("selection-circle-button")).getAttribute("className")).toContain("active");
        element(by.id("selection-circle-button")).click();
        //browser.sleep(150);
        expect(element(by.id("selection-circle-button")).getAttribute("className")).not.toContain("active");
    });    
    
    it("should close the selection tool on click", function(){
        expect(element(by.css('[title="Sélection"]')).getAttribute("className")).toContain("active");
        element(by.css('[title="Sélection"]')).click();
        //browser.sleep(200);
        expect(element(by.css('[title="Sélection"]')).getAttribute("className")).not.toContain("active");
    });
    
    it("should open the print tool on click", function(){
        expect(element(by.css('[title="Imprimer"]')).getAttribute("className")).not.toContain("active");
        element(by.css('[title="Imprimer"]')).click();
        //browser.sleep(200);
        expect(element(by.css('[title="Imprimer"]')).getAttribute("className")).toContain("active");
    });
    
    it("should contain A4 in value",function(){
        expect(element(by.id("select-print-format")).getAttribute("value")).toEqual("A4");
    });
    
    it("should hide app's IHM",function(){
        element(by.css('[ng-click="ctrl.preparePrint()"]')).click();
        //browser.sleep(200);
        expect(element(by.id("opener-bottombar")).getAttribute("style")).toContain("hidden");
        expect(element(by.id("bottombar")).getAttribute("style")).toContain("hidden");
        expect(element(by.id("print-title-input")).getAttribute("value")).toEqual("Titre");
        element(by.id("print-title-input")).clear();
        element(by.id("print-title-input")).sendKeys("This is my title");
        //browser.sleep(150);
        expect(element(by.id("print-title-input")).getAttribute("value")).toEqual("This is my title");
        expect(element(by.id("print-subtitle-input")).getAttribute("value")).toEqual("Entrez ici une description");
        element(by.id("print-subtitle-input")).clear();
        element(by.id("print-subtitle-input")).sendKeys("This is my subtitle");
        //browser.sleep(150);
        expect(element(by.id("print-subtitle-input")).getAttribute("value")).toEqual("This is my subtitle");
        element(by.css('[ng-click="ctrl.returnToMapOrigin()"]')).click();
        //browser.sleep(200);
        expect(element(by.id("opener-bottombar")).getAttribute("style")).toContain("visible");
        expect(element(by.id("bottombar")).getAttribute("style")).toContain("visible");
    });
    
    it("should close the print tool on click", function(){
        expect(element(by.css('[title="Imprimer"]')).getAttribute("className")).toContain("active");
        element(by.css('[title="Imprimer"]')).click();
        //browser.sleep(200);
        expect(element(by.css('[title="Imprimer"]')).getAttribute("className")).not.toContain("active");
    });
    
    it("should active 'Dessin'",function(){
        expect(element(by.id("1-button")).getAttribute("class")).not.toContain("active");
        element(by.id("1-button")).click();
        //browser.sleep(250);
        expect(element(by.id("1-button")).getAttribute("class")).toContain("active");
	    Veremes.waitForModal();
    });
    
    /*it("should collapse draw tools",function(){
        expect(element(by.css('[data-target="#draw-tools"]')).getAttribute('class')).not.toContain("collapsed");
        element(by.css('[data-target="#draw-tools"]')).click();
        Veremes.waitAfterClick();
        expect(element(by.css('[data-target="#draw-tools"]')).getAttribute('class')).toContain("collapsed");
        element(by.css('[data-target="#draw-tools"]')).click();
        Veremes.waitAfterClick();
		expect(element(by.css('[data-target="#draw-tools"]')).getAttribute('class')).not.toContain("collapsed");
    });*/
    
    it("should active draw point",function(){
        expect(element(by.id("draw-point-button")).getAttribute('class')).not.toContain("active");
        element(by.id("draw-point-button")).click();
        Veremes.waitAfterClick();
        expect(element(by.id("draw-point-button")).getAttribute('class')).toContain("active");
        browser.actions().mouseMove(element(by.id('map1'))).click().perform();
        Veremes.waitForModal();
        element(by.id("print-Nom-input")).sendKeys("MyPoint");
        //browser.sleep(200);
        element(by.css('[class="btn btn-primary save-form-btn"]')).click();
        //element(by.id("draw-point-button")).click();
        //browser.sleep(100);
        expect(element(by.id("draw-point-button")).getAttribute('class')).not.toContain("active");
    });
    
    it("should active draw line",function(){
        expect(element(by.id("draw-line-button")).getAttribute('class')).not.toContain("active");
        element(by.id("draw-line-button")).click();
        //browser.sleep(100);
        expect(element(by.id("draw-line-button")).getAttribute('class')).toContain("active");
		browser.actions()
			.mouseMove(element(by.id('map1')))
			.click()
			.mouseMove({x: 100 , y: 200})
			.doubleClick()
			.perform();
        //element(by.id("draw-line-button")).click();
        //browser.sleep(100);
        expect(element(by.id("draw-line-button")).getAttribute('class')).not.toContain("active");
    });
    
    it("should active draw polygon",function(){
        expect(element(by.id("draw-polygon-button")).getAttribute('class')).not.toContain("active");
        element(by.id("draw-polygon-button")).click();
        //browser.sleep(100);
        expect(element(by.id("draw-polygon-button")).getAttribute('class')).toContain("active");
        element(by.id("draw-polygon-button")).click();
        //browser.sleep(100);
        expect(element(by.id("draw-polygon-button")).getAttribute('class')).not.toContain("active");
    });
    
    it("should active draw Circle",function(){
        expect(element(by.id("draw-circle-button")).getAttribute('class')).not.toContain("active");
        element(by.id("draw-circle-button")).click();
        //browser.sleep(100);
        expect(element(by.id("draw-circle-button")).getAttribute('class')).toContain("active");
        element(by.id("draw-circle-button")).click();
        //browser.sleep(100);
        expect(element(by.id("draw-circle-button")).getAttribute('class')).not.toContain("active");
    });
    
    it("should active modify draw",function(){
        expect(element(by.id("draw-modify-button")).getAttribute('class')).not.toContain("active");
        element(by.id("draw-modify-button")).click();
        //browser.sleep(100);
        expect(element(by.id("draw-modify-button")).getAttribute('class')).toContain("active");
        element(by.id("draw-modify-button")).click();
        //browser.sleep(100);
        expect(element(by.id("draw-modify-button")).getAttribute('class')).not.toContain("active");
    });
    
    it("should active editInfos draw",function(){
        expect(element(by.id("draw-editInfos-button")).getAttribute('class')).not.toContain("active");
        element(by.id("draw-editInfos-button")).click();
        //browser.sleep(100);
        expect(element(by.id("draw-editInfos-button")).getAttribute('class')).toContain("active");
        element(by.id("draw-editInfos-button")).click();
        //browser.sleep(100);
        expect(element(by.id("draw-editInfos-button")).getAttribute('class')).not.toContain("active");
    });
    
    /*it("should active showInfos draw",function(){
        expect(element(by.id("draw-showInfos-button")).getAttribute('class')).not.toContain("active");
        element(by.id("draw-showInfos-button")).click();
        //browser.sleep(100);
        expect(element(by.id("draw-showInfos-button")).getAttribute('class')).toContain("active");
        element(by.id("draw-showInfos-button")).click();
        //browser.sleep(100);
        expect(element(by.id("draw-showInfos-button")).getAttribute('class')).not.toContain("active");
    });*/
    
    it("should active dell draw",function(){
        expect(element(by.id("draw-dell-button")).getAttribute('class')).not.toContain("active");
        element(by.id("draw-dell-button")).click();
        //browser.sleep(100);
        expect(element(by.id("draw-dell-button")).getAttribute('class')).toContain("active");
        element(by.id("draw-dell-button")).click();
        //browser.sleep(100);
        expect(element(by.id("draw-dell-button")).getAttribute('class')).not.toContain("active");
    });
    
    it("should active display draw",function(){
        expect(element(by.id("draw-features-list-modal")).getAttribute('class')).not.toContain("in");
        element(by.id("draw-display-features-button")).click();
        Veremes.waitForModal();
        expect(element(by.id("draw-features-list-modal")).getAttribute('class')).toContain("in");
        element(by.id("modal-display-draw-close")).click();
        Veremes.waitForModal();
        expect(element(by.id("draw-features-list-modal")).getAttribute('class')).not.toContain("in");
    });
    
});
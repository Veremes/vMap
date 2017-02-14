/* global goog, angular, expect, oVmap, spyOn */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on osmsuggestion.js 
 * All the Units Tests of nsVmap.nsMapManager.nsMapModal.OSMSuggestions class
 */
goog.provide('nsVmap.nsMapManager.nsMapModal.OSMSuggestions.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsMapManager.nsMapModal.OSMSuggestions');

console.log("Unit - nsVmap.nsMapManager.nsMapModal.OSMSuggestions");



describe("Unit -", function () {
    describe("nsVmap.nsMapManager.nsMapModal.OSMSuggestions :", function () {
        beforeEach(module('app'));
        describe("angular directive : 'appOsmsuggestions'", function () {
            var scope;
            var el;
            var toTest = {};

            beforeEach(module('template/layers/mapmodal/osmsuggestions.html'));
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();

                el = angular.element(
                    '<div id="container">' +
                        '<div app-osmsuggestions app-osmsuggestions-map="::mainCtrl.map" class="ng-isolate-scope"></div>' +
                    '</div>'
                );
                $compile(el)(scope);
                scope.$digest();
            }));
            afterEach(function () {
                scope = {};
                el = {};
                toTest = {};
            });
            it("loading directive", function () {
                toTest = el.find("div");
                expect(toTest[0].localName).toBe("div");
                expect(toTest[0].children.length).toBeGreaterThan(0);
            });
            it("loaded with good template", function () {
                toTest = el.find("div");
                expect(toTest[0].children[0].textContent).toBe("Ajouter une couche OSM: ");
                expect(toTest[0].children[0].tagName).toBe("H3");
                expect(toTest[0].children[0].parentElement.localName).toBe("div");
                expect(toTest[0].children.length).toEqual(13);
            });
        });
        
	describe("angular controller : 'AppOsmsuggestionsController'", function () {

            var scope = {};
            var ctrl = {};

            beforeEach(inject(function ($controller, $rootScope) {
                scope = $rootScope.$new();
                ctrl = $controller;
            }));
            afterEach(function(){
                scope = {};
                ctrl = {};
            });

            it("Instanciation", function () {
                spyOn(oVmap.getMapManager().getMapModalTool(), 'getMapCatalog').and.callThrough();
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), 'getCode').and.callThrough();
                var controller = ctrl('AppOsmsuggestionsController', {$scope: scope});
                expect(oVmap.getMapManager().getMapModalTool().getMapCatalog).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
            });
            it("method --> 'reload'", function () {
                var controller = ctrl('AppOsmsuggestionsController', {$scope: scope});
                spyOn(oVmap.getMapManager().getMapModalTool(), 'getMapCatalog').and.callThrough();
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), 'getCode').and.callThrough();
                controller.reload();
                expect(oVmap.getMapManager().getMapModalTool().getMapCatalog).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
            });
        });
    });
});




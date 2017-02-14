/* global goog, angular, expect, oVmap, spyOn */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on binsuggestion.js 
 * All the Units Tests of nsVmap.nsMapManager.nsMapModal.BingSuggestions class
 */
goog.provide('nsVmap.nsMapManager.nsMapModal.BingSuggestions.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsMapManager.nsMapModal.BingSuggestions');

console.log("Unit - nsVmap.nsMapManager.nsMapModal.BingSuggestions");



describe("Unit -", function () {
    describe("nsVmap.nsMapManager.nsMapModal.BingSuggestions :", function () {
        beforeEach(module('app'));
        describe("angular directive : 'appBingsuggestions'", function () {         
            var scope;
            var el;
            var toTest = {};
            beforeEach(module('template/layers/mapmodal/bingsuggestions.html'));
            beforeEach(inject(function($rootScope, $compile){
                scope = $rootScope.$new();
                el = angular.element(
                    '<div id="container">'+
                        '<div id="app-bingsuggestions" app-bingsuggestions app-bingsuggestions-map="::mainCtrl.map" class="ng-isolate-scope"></div>' +
                    '</div>'
                );
                $compile(el)(scope);
                scope.$digest();
            }));
            afterEach(function(){
                scope = {};
                el = {};
                toTest = {};
            });
            
            it("loading directive",function(){
                toTest = el.find('div');
                expect(toTest[0].id).toEqual("app-bingsuggestions");
                expect(toTest[0].childElementCount).toEqual(10);
            });
            it("loaded with good template",function(){
                toTest = el.find('div');
                expect(toTest[0].children[0].textContent).toBe("Ajouter une couche Bing Maps: ");
                expect(toTest[0].children[0].tagName).toBe("H3");
                expect(toTest[0].children[0].parentElement.id).toBe("app-bingsuggestions");
                expect(toTest[0].children.length).toEqual(10);
            });
        });  
	describe("angular controller : 'AppBingsuggestionsController'", function () {

            var scope = {};
            var ctrl = {};

            beforeEach(inject(function ($controller, $rootScope) {
                scope = $rootScope.$new();
                ctrl = $controller;
            }));
            afterEach(function () {
                scope = {};
                ctrl = {};
            });

            it("Instanciation", function () {
                spyOn(oVmap.getMapManager().getMapModalTool(), 'getMapCatalog').and.callThrough();
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), 'getCode').and.callThrough();
                var controller = ctrl('AppBingsuggestionsController', {$scope: scope});
                expect(oVmap.getMapManager().getMapModalTool().getMapCatalog).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
            });	
            it("method --> 'reload'", function () {
                var controller = ctrl('AppBingsuggestionsController', {$scope: scope});
                spyOn(oVmap.getMapManager().getMapModalTool(), 'getMapCatalog').and.callThrough();
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), 'getCode').and.callThrough();
                controller.reload();
                expect(oVmap.getMapManager().getMapModalTool().getMapCatalog).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
            });
        });
    });
});




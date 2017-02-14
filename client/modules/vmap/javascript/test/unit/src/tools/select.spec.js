/* global goog, angular, expect, oVmap, spyOn, Dummy */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on select.js 
 * All the Units Tests of nsVmap.nsMapManager.nsToolsModal.Select class
 */
goog.provide('nsVmap.nsToolsManager.Select.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsToolsManager.Select');

console.log("Unit - nsVmap.nsToolsManager.Select");

describe("Unit -", function () {
    describe("nsVmap.nsToolManager.Select :", function () {
        beforeEach(module('app'));

        describe("angular directive : 'appSelect'", function () {
            var scope;
            var el;
            var toTest = {};

            beforeEach(module('template/tools/select.html'));
            
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();

                el = angular.element(
                    '<div id="container">' +
                        '<div id="Select-tool" class="side-tool ng-isolate-scope" app-select app-select-map="::mainCtrl.map" app-select-lang="mainCtrl.lang"></div>' +
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
                expect(toTest[0].children[0].tagName).toBe("LI");
                expect(toTest[0].children[0].parentElement.attributes[2].localName).toBe("app-select");
                expect(toTest[0].children.length).toEqual(1);
            });
        });
        
        describe("angular directive : 'appSelectioninfo'", function () {
            var scope;
            var el;
            var toTest = {};

            beforeEach(module('template/tools/selection-info.html'));
            
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();

                el = angular.element(  
                    '<div id="container">' +
                        '<div id="Selection-info" class="ng-isolate-scope" app-selectioninfo app-selectioninfo-map="::mainCtrl.map" app-selectioninfo-lang="mainCtrl.lang"></div>' +
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
                expect(toTest[0].children[0].id).toBe("selection-info-container");
                expect(toTest[0].children[0].tagName).toBe("DIV");
                expect(toTest[0].children[0].parentElement.attributes[2].localName).toBe("app-selectioninfo");
                expect(toTest[0].children.length).toEqual(1);
            });
        });
        
        describe("class method :", function(){
            var oSelect;
            
            beforeEach(function(){
                oSelect = oVmap.getToolsManager().getSelect();
            });
            afterEach(function(){
                oSelect = {};
            });
        });

        describe("angular controller : 'AppSelectController'", function () {
            var scope = {};
            var ctrl = {};
            var httpBackend = {};
 
            beforeEach(inject(function ($controller, $rootScope,$httpBackend) {
                scope = $rootScope.$new();
                ctrl = $controller;
                httpBackend = $httpBackend;
            }));

            afterEach(function () {
                httpBackend.verifyNoOutstandingExpectation();
                httpBackend.verifyNoOutstandingRequest();
                httpBackend = {};
                scope = {};
                ctrl = {};
            });

            it("Instanciation", function () {
                spyOn(oVmap.getMap(), 'getOLMap').and.callThrough();
                var controller = ctrl('AppSelectController', {$scope: scope});
                expect(oVmap.getMap().getOLMap).toHaveBeenCalled();
                expect(controller['FeaturesSelected']).not.toBeDefined();
            });
            it("method --> 'selectFeature'", function(){
                var map = oVmap.getMap().getOLMap();
                spyOn(map,"on").and.callFake(Dummy);
                spyOn(oVmap.getMap(),"getOLMap").and.returnValue(map);
                var controller = ctrl('AppSelectController', {$scope: scope});
                controller.selectFeature();
                expect(map.on).toHaveBeenCalled();
            });
            it("method --> 'reloadSelection'",function(){
                spyOn(oVmap,"simuleClick").and.callFake(Dummy);
                spyOn(oVmap.getToolsManager().getBasicTools().getSelect(),"getFeaturesSelected").and.callThrough();
                var controller = ctrl('AppSelectController', {$scope: scope});
                controller.reloadSelection();
                expect(oVmap.getToolsManager().getBasicTools().getSelect().getFeaturesSelected).toHaveBeenCalled();
                expect(controller['FeaturesSelected']).toBeDefined();
                expect(oVmap.simuleClick).toHaveBeenCalled();
            });
            it("method --> 'getFeature' (no argument)",function(){
                spyOn(oVmap.getMap(),"getOLMap").and.callThrough();
                spyOn(oVmap.getMap(),"getSelectionOverlay").and.callThrough();
                var controller = ctrl('AppSelectController', {$scope: scope});
                controller.getFeatures();
                expect(oVmap.getMap().getOLMap).toHaveBeenCalled();
                expect(oVmap.getMap().getSelectionOverlay).toHaveBeenCalled();
            });
            it("method --> 'getFeature' (__?__) {{(EC)}}", function(){
                // faut voir comment boucher evt
            });
        });
    });
});
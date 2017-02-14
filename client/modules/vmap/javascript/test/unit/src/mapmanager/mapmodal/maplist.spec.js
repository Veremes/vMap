/* global goog, angular, spyOn, expect, oVmap */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on maplist.js 
 * All the Units Tests of nsVmap.nsMapManager.nsMapModal.MapList class
 */
goog.provide('nsVmap.nsMapManager.nsMapModal.MapList.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsMapManager.nsMapModal.MapList');

console.log("Unit - nsVmap.nsMapManager.nsMapModal.MapList");



describe("Unit -", function () {
    describe("nsVmap.nsMapManager.nsMapModal.MapList :", function () {
        beforeEach(module('app'));
        describe("angular directive : 'appMaplist'", function () {
            var scope;
            var el;
            var toTest = {};

            beforeEach(module('template/layers/mapmodal/maplist.html'));
            beforeEach(inject(function($rootScope, $compile){
                scope = $rootScope.$new();

                el = angular.element(
                    '<div id="container">'+
                        '<div app-maplist app-maplist-map="::mainCtrl.map" class="ng-isolate-scope"></div>' +
                    '</div>'
                );
                spyOn(document,"getElementById").and.returnValue(document.createElement('div'));
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
                expect(toTest[0].localName).toEqual("div");
                expect(toTest[0].children.length).toBeGreaterThan(0);
            });
            it("loaded with good template",function(){
                toTest = el.find('div');
                expect(toTest[0].children[0].textContent).toBe("Liste des cartes utilisables: ");
                expect(toTest[0].children[0].tagName).toBe("H3");
                expect(toTest[0].children.length).toEqual(19);
            });
        });
        
	describe("angular controller : 'AppMaplistController'", function () {

            var scope = {};
            var ctrl = {};

            beforeEach(inject(function ($controller, $rootScope) {
                scope = $rootScope.$new();
                ctrl = $controller;
                spyOn(document,"getElementById").and.returnValue(document.createElement('div'));
            }));
            afterEach(function(){
                scope = {};
                ctrl = {};
            });
       
            it("Instanciation", function () {
                spyOn(oVmap.getMapManager().getMapModalTool(), 'getMapCatalog').and.callThrough();
                var controller = ctrl('AppMaplistController', {$scope: scope});
                expect(oVmap.getMapManager().getMapModalTool().getMapCatalog).toHaveBeenCalled();
                expect(controller['newMapUrl']).toEqual('');
            });
        });
    });
});




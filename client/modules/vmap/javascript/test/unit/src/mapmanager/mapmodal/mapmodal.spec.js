/* global goog, angular, spyOn, expect, Dummy */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: test E2E with library of mapmodal.js
 * all the test E2E on nsVmap.nsMapManager.nsMapModal.MapModalManager Class
 */
goog.provide('nsVmap.nsMapManager.nsMapModal.MapModalManager.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsMapManager.nsMapModal.MapModalManager');

console.log("Unit - nsVmap.nsMapManager.nsMapModal.MapModalManager");



describe("Unit -", function () {
    describe("nsVmap.nsMapManager.nsMapModal.MapModalManager:", function () {
        beforeEach(module('app'));
        describe("angular directive : 'appMapmodal'", function () {
            var scope;
            var el;
            var toTest = {};

            beforeEach(module('template/layers/mapmodal/mapmodal.html'));
            beforeEach(module('template/layers/mapmodal/mymap.html'));
            beforeEach(module('template/layers/mapmodal/maplist.html'));
            beforeEach(module('template/layers/mapmodal/wmssuggestions.html'));
            beforeEach(module('template/layers/mapmodal/wfssuggestions.html'));
            beforeEach(module('template/layers/mapmodal/loadgeometry.html'));
            beforeEach(module('template/layers/mapmodal/osmsuggestions.html'));
            beforeEach(module('template/layers/mapmodal/bingsuggestions.html'));
            beforeEach(module('template/layers/mapmodal/ignsuggestions.html'));
            
            beforeEach(inject(function($rootScope, $compile){
                scope = $rootScope.$new();

                el = angular.element(
                    '<div>' +
                        '<div app-mapmodal app-mapmodal-map="::mainCtrl.map" class="ng-isolate-scope"></div>' +
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
                expect(toTest.length).toBeGreaterThan(0);
            });
            it("template 'mymapdirective' loaded",function(){
                toTest = el.find('div');
                expect(toTest[8].id).toBe("modal-mymap");
            });
            it("template 'maplistdirective' loaded",function(){
                toTest = el.find('div');
                expect(toTest[17].id).toBe("modal-maplist");
            });
            it("template 'wmssuggestionsdirective' loaded",function(){
                toTest = el.find('div');
                expect(toTest[117].id).toBe("modal-wms");
            });
            it("template 'wfssuggestionsdirective' loaded",function(){
                toTest = el.find('div');
                expect(toTest[126].id).toBe("modal-wfs");
            });
            it("template 'loadgeometrydirective' loaded",function(){
                toTest = el.find('div');
                expect(toTest[136].id).toBe("modal-geometry");
            });
            it("template 'osmsuggestionsdirective' loaded",function(){
                toTest = el.find('div');
                expect(toTest[143].id).toBe("modal-osm");
            });
            it("template 'ignsuggestionsdirective' loaded",function(){
                toTest = el.find('div');
                expect(toTest[241].id).toBe("modal-ign");
            });
            it("template 'bingsuggestionsdirective' loaded",function(){
                toTest = el.find('div');
                expect(toTest[203].id).toBe("modal-bing");
            });
        });
        
	describe("angular controller : 'AppMapmodalController'", function () {

            var scope = {};
            var ctrl = {};

            beforeEach(inject(function ($controller, $rootScope) {
                scope = $rootScope.$new();
                ctrl = $controller;
            }));
            afterEach(function(){
                scope={};
                ctrl={};
            });
            
            it("Instanciation", function () {
                spyOn($.fn, "on").and.callFake(Dummy);
                var controller = ctrl('AppMapmodalController', {$scope: scope});
                expect($.fn.on).toHaveBeenCalled();
            });
        });
    });
});

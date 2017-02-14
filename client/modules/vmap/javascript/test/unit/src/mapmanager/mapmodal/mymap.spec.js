/* global angular, goog, expect, oVmap, spyOn, ol, Dummy */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on mymap.js 
 * All the Units Tests of nsVmap.nsMapManager.nsMapModal.MyMap class
 */
goog.provide('nsVmap.nsMapManager.nsMapModal.MyMap.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsMapManager.nsMapModal.MyMap');

console.log("Unit - nsVmap.nsMapManager.nsMapModal.MyMap");



describe("Unit -", function () {
    describe("nsVmap.nsMapManager.nsMapModal.MyMap :", function () {
        beforeEach(module('app'));
        describe("angular directive : 'appMymap'", function () {
            var scope;
            var el;
            var toTest = {};

            beforeEach(module('template/layers/mapmodal/mymap.html'));
            beforeEach(inject(function($rootScope, $compile){
                scope = $rootScope.$new();

                el = angular.element(
                    '<div id="container">'+
                        '<div app-mymap app-mymap-map="::mainCtrl.map" class="ng-isolate-scope"></div>' +
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
                expect(toTest[0].localName).toEqual("div");
                expect(toTest[0].children.length).toBeGreaterThan(0);
            });
            it("loaded with good template",function(){
                toTest = el.find('div');
                expect(toTest[0].children[0].textContent).toBe("Carte en cours: ");
                expect(toTest[0].children[0].tagName).toBe("H3");
                expect(toTest[0].children.length).toEqual(11);
            });
        });
        
	describe("angular controller : 'AppMymapController'", function () {

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
                var controller = ctrl('AppMymapController', {$scope: scope});
                expect(controller['mapFileHref']).toEqual('');
            });
            it("method --> 'reloadtree'", function () {
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), 'getCode').and.callThrough();
                spyOn(oVmap.getMap().getOLMap().getView(), 'getCenter').and.callThrough();
                spyOn(oVmap.getMap().getOLMap().getView(), 'getZoom').and.callThrough();
                spyOn(oVmap.getMapManager(), 'getLayersTree').and.callThrough();
                
                var controller = ctrl('AppMymapController', {$scope: scope});
                controller.reloadTree();
                
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getZoom).toHaveBeenCalled();
                expect(oVmap.getMapManager().getLayersTree).toHaveBeenCalled();
            });
            
            it("method --> 'reloadMapFile'", function () {
                spyOn(oVmap.getMapManager(), 'getLayersTree').and.callThrough();
                
                var controller = ctrl('AppMymapController', {$scope: scope});
                controller.reloadTree();
                controller.reloadMapFile();
                
                expect(oVmap.getMapManager().getLayersTree).toHaveBeenCalled();
            });
            
            it("method --> 'removeLayer'", function () {
                spyOn(oVmap.getMapManager(), 'removeLayer').and.callFake(Dummy);
                
                var controller = ctrl('AppMymapController', {$scope: scope});
                controller.removeLayer(new ol.layer.Base({brightness : 1}));
                
                expect(oVmap.getMapManager().removeLayer).toHaveBeenCalled();
            });
        });
    });
});




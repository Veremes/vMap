/* global goog, angular, expect, ngeo, oVmap, spyOn, ol, Dummy */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on layersorder.js 
 * All the Units Tests of nsVmap.nsMapManager.nsMapModal.LayersOrder class
 */
goog.provide('nsVmap.nsMapManager.LayersOrder.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsMapManager.LayersOrder');

console.log("Unit - nsVmap.nsMapManager.LayersOrder");

describe("Unit -", function () {
    describe("nsVmap.nsMapManager.LayersOrder :", function () {
        beforeEach(module('app'));
        describe("angular directive : 'appLayersorder'", function () {
            var scope;
            var el;
            var toTest = {};

            beforeEach(module('template/layers/layersorder.html'));

            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();

                el = angular.element(
                    '<div id="container">' +
                        '<div app-layersorder app-layersorder-map="::mainCtrl.map" class="ng-isolate-scope"></div>' +
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
                console.log(toTest);
                expect(toTest[0].children[0].textContent).toContain("Table des matières");
                expect(toTest[0].children[0].tagName).toBe("DIV");
                expect(toTest[0].children.length).toEqual(2);
            });
        });
	describe("angular controller : 'AppLayersorderController'", function () {

            var scope = {};
            var ctrl = {};
            var el;
            
            beforeEach(module('template/layers/layertree.html'));
            beforeEach(module('template/layers/layertreenode.html'));
            beforeEach(module('template/layers/popup.html'));
            
            beforeEach(inject(function ($controller, $rootScope, $compile) {
                scope = $rootScope.$new();
                ctrl = $controller;
                
                el = angular.element(
                    '<div id="container">' +
                        '<div app-layertree app-layertree-map="mainCtrl.map"></div>' +
                    '</div>'
                );
                $compile(el)(scope);
                scope.$digest();
            }));
            afterEach(function () {
                scope = {};
                ctrl = {};
                el = {};
                oVmap.getMap().getOLMap().getLayers().getArray().length = 0 ;
            });
            
            it("Instanciation", function () {
                spyOn(oVmap.getMap(), 'getOLMap').and.callThrough();
                spyOn(oVmap.getMap().getOLMap().getLayers(),'getArray').and.callThrough();
                spyOn(ngeo,'syncArrays').and.callThrough();
                var controller = ctrl('AppLayersorderController', {$scope: scope});
                expect(oVmap.getMap().getOLMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(ngeo.syncArrays).toHaveBeenCalled();
            });
            
            it("attribute --> 'selectedLayers'",function(){
                var controller = ctrl('AppLayersorderController', {$scope: scope});
                expect(controller['selectedLayers']).toEqual([]);
            });
            
            it("method --> 'setVisble' (last if not pass)",function(){
                var layer = new ol.layer.Base({
                        brightness: 1
                });
                var controller = ctrl('AppLayersorderController', {$scope: scope});
                spyOn(layer,"getVisible").and.returnValue(true);
                spyOn(oVmap.getMapManager(),"getLayersTree").and.callThrough();
                spyOn(layer,"setVisible").and.callThrough();
                spyOn(oVmap.getMapManager().getMapLegendTool(),"loadLegend").and.callThrough();
                controller.setVisible(layer);
                expect(layer.getVisible).toHaveBeenCalled();
                expect(layer.getVisible()).toEqual(true);
                expect(oVmap.getMapManager().getLayersTree).toHaveBeenCalled();
                expect(layer.setVisible).toHaveBeenCalled();
                expect(oVmap.getMapManager().getMapLegendTool().loadLegend).toHaveBeenCalled();
            });
           
           it("method --> 'setVisible' (last if pass)",function(){
                var tree = oVmap.getMapManager().getLayersTree();
                var layer = tree.children[2].children[0];
                layer = layer['olLayer'];
                var controller = ctrl('AppLayersorderController', {$scope: scope});
                spyOn(layer,"getVisible").and.returnValue(false);
                spyOn(oVmap.getMapManager(),"getLayersTree").and.callThrough();
                spyOn(layer,"setVisible").and.callThrough();
                spyOn(oVmap.getMapManager().getMapLegendTool(),"loadLegend").and.callThrough();
                controller.setVisible(layer);
                expect(layer.getVisible).toHaveBeenCalled();
                expect(oVmap.getMapManager().getLayersTree).toHaveBeenCalled();
                expect(layer.setVisible).toHaveBeenCalled();
                expect(oVmap.getMapManager().getMapLegendTool().loadLegend).toHaveBeenCalled();
            });
                        
            
            it("method --> 'setSelectable' (last if not pass)",function(){
                var tree = oVmap.getMapManager().getLayersTree();
                var layer = tree.children[2].children[0];
                layer = layer['olLayer'];
                var controller = ctrl('AppLayersorderController', {$scope: scope});
                spyOn(layer,"get").and.returnValue(true);
                spyOn(oVmap.getMapManager(),"getLayersTree").and.callThrough();
                spyOn(layer,"set").and.callFake(Dummy);
                controller.setSelectable(layer);
                expect(layer.get).toHaveBeenCalledWith('select');
                expect(oVmap.getMapManager().getLayersTree).toHaveBeenCalled();
                expect(layer.set).toHaveBeenCalled();
            });
            
            it("method --> 'setSelectable' (last if pass)",function(){
                var tree = oVmap.getMapManager().getLayersTree();
                var layer = new ol.layer.Base({
                        brightness: 1
                });
                var controller = ctrl('AppLayersorderController', {$scope: scope});
                spyOn(layer,"get").and.returnValue(true);
                spyOn(oVmap.getMapManager(),"getLayersTree").and.callThrough();
                spyOn(layer,"set").and.callFake(Dummy);
                controller.setSelectable(layer);
                expect(layer.get).toHaveBeenCalledWith('select');
                expect(oVmap.getMapManager().getLayersTree).toHaveBeenCalled();
                expect(layer.set).toHaveBeenCalled();
            });

        });
    });
});




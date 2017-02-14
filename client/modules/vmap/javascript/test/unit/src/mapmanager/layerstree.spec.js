/* global goog, angular, oVmap, expect, spyOn, Dummy */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on layerstree.js 
 * All the Units Tests of nsVmap.nsMapManager.nsMapModal.LayersTree class
 */
goog.provide('nsVmap.nsMapManager.LayersTree.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsMapManager.LayersTree');

console.log("Unit - nsVmap.nsMapManager.LayersTree");



describe("Unit -", function () {
    describe("nsVmap.nsMapManager.LayersTree :", function () {
        beforeEach(module('app'));
        describe("angular directive : 'appLayertree'", function () {
            var scope;
            var el;
            var toTest = {};
            
            beforeEach(module('template/layers/layertree.html'));
            beforeEach(module('template/layers/layertreenode.html'));
            beforeEach(module('template/layers/popup.html'));
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();

                el = angular.element(
                    '<div id="container">' +
                        '<div app-layertree  app-layertree-map="::mainCtrl.map" class="ng-isolate-scope"></div>' +
                    '</div>'
                );
                $compile(el)(scope);
                scope.$digest();
            }));
            afterEach(function () {
                scope = {};
                el = {};
                toTest = {};
                oVmap.getMap().getOLMap().getLayers().getArray().length = 0 ;
            });
            it("loading directive", function () {
                toTest = el.find("div");
                expect(toTest[0].localName).toBe("div");
                expect(toTest[0].children.length).toBeGreaterThan(0);
            });
            it("loaded with good template", function () {
                toTest = el.find("div");
                expect(toTest[0].children[0].textContent).toContain("Jeux de données");
                expect(toTest[0].children[0].tagName).toBe("DIV");
                expect(toTest[0].children[0].parentElement.localName).toBe("div");
                expect(toTest[0].children.length).toEqual(1);
            });
        });
        
	describe("angular controller : 'AppLayertreeController'", function () {

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
                spyOn(oVmap.getMapManager(), 'getLayersTree').and.callThrough();
                spyOn(oVmap.getMap(),'getOLMap').and.callThrough();
                var controller = ctrl('AppLayertreeController', {$scope: scope});
                expect(oVmap.getMapManager().getLayersTree).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap).toHaveBeenCalled();
            });	
            
            it("method --> 'setSelectable'", function () {
                var controller = ctrl('AppLayertreeController', {$scope: scope});
                var tree = oVmap.getMapManager().getLayersTree();
                var layer = tree.children[2].children[0];
                layer = layer['olLayer'];
                spyOn(oVmap.getMapManager(), 'setLayersTree').and.callFake(Dummy);
                spyOn(layer,"get").and.returnValue(false);
                spyOn(layer,"set").and.callFake(Dummy);
                controller.setSelectable(layer);
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(layer.get).toHaveBeenCalledWith('select');
                expect(layer.set).toHaveBeenCalledWith('select', true);
            });	
            it("method --> 'setVisible'",function(){
                var controller = ctrl('AppLayertreeController', {$scope: scope});
                var tree = oVmap.getMapManager().getLayersTree();
                var layer = tree.children[2].children[0];
                layer = layer['olLayer'];
                spyOn(oVmap.getMapManager(), 'setLayersTree').and.callFake(Dummy);
                spyOn(layer,"get").and.returnValue(false);
                spyOn(layer,"set").and.callFake(Dummy);
                spyOn(oVmap.getMapManager().getMapLegendTool(),"loadLegend").and.callFake(Dummy);
                controller.setVisible(layer);
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(layer.get).toHaveBeenCalledWith('visible');
                expect(layer.set).toHaveBeenCalledWith('visible', true);
                expect(oVmap.getMapManager().getMapLegendTool().loadLegend).toHaveBeenCalled();
            });
            it("method --> 'reloadTree'",function(){
                var controller = ctrl('AppLayertreeController', {$scope: scope});
                spyOn(oVmap.getMapManager(), 'setLayersTree').and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.callThrough();
                spyOn(oVmap,"resizeLayerTools").and.callFake(Dummy);
                controller.reloadTree();
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(false);
            });
        });
        describe("angular value : 'appGetLayer'",function(){
            
            var scope = {};
            var ctrl = {};
            var node = {};
            var treetmp={};
            var el;
            
            beforeEach(module('template/layers/layertree.html'));
            beforeEach(module('template/layers/layertreenode.html'));
            beforeEach(module('template/layers/popup.html'));
            beforeEach(inject(function ($controller, $rootScope, $compile) {
                scope = $rootScope.$new();
                ctrl = $controller;
                treetmp = oVmap.getMapManager().getLayersTree();
                el = angular.element(
                    '<div id="container">' +
                        '<app-layertree id = "app-layertree"  app-layertree-map="::mainCtrl.map" class="ng-isolate-scope"></app-layertree>' +
                    '</div>'
                );
                $compile(el)(scope);
                scope.$digest();
            }));
            afterEach(function () {
                scope = {};
                ctrl = {};
                el = {};
                oVmap.getMapManager().setLayersTree(treetmp);
                oVmap.getMap().getOLMap().getLayers().getArray().length = 0;
            });
            it("method --> 'getLayer' (view)",function(){
                node = oVmap.getMapManager().getLayersTree();
                var controller = ctrl('AppLayertreeController', {$scope: scope});
                expect(controller.getLayer(node['children'][0])).toEqual(null);
                
                controller.reloadTree();
            });
            it("method --> 'getLayer' (stamen)",function(){
                node = oVmap.getMapManager().ajaxGetLayersTree("http://localhost:9876/__karma__/data/examples/layers-tree-bing-osm.json");
                oVmap.getMapManager().setLayersTree(node);
                expect(node['children'][1]['children'][0]['olLayer']).not.toBeDefined();
                var controller = ctrl('AppLayertreeController', {$scope: scope});
                expect(controller.getLayer(node['children'][1]['children'][0])).toBeDefined();
                expect(node['children'][1]['children'][0]['olLayer']).toBeDefined();
                controller.reloadTree();
            });
            it("method --> 'getLayer' (mapquest)",function(){
                node = oVmap.getMapManager().ajaxGetLayersTree("http://localhost:9876/__karma__/data/examples/layers-tree-bing-osm.json");
                oVmap.getMapManager().setLayersTree(node);
                //console.log(node);
                expect(node['children'][2]['children'][0]['olLayer']).not.toBeDefined();
                var controller = ctrl('AppLayertreeController', {$scope: scope});
                expect(controller.getLayer(node['children'][2]['children'][0])).toBeDefined();
                expect(node['children'][2]['children'][0]['olLayer']).toBeDefined();
                controller.reloadTree();
            });
            it("method --> 'getLayer' (bing)",function(){
                node = oVmap.getMapManager().ajaxGetLayersTree("http://localhost:9876/__karma__/data/examples/layers-tree-bing-osm.json");
                oVmap.getMapManager().setLayersTree(node);
                //console.log(node);
                expect(node['children'][3]['children'][0]['olLayer']).not.toBeDefined();
                var controller = ctrl('AppLayertreeController', {$scope: scope});
                expect(controller.getLayer(node['children'][3]['children'][0])).toBeDefined();
                expect(node['children'][3]['children'][0]['olLayer']).toBeDefined();
                controller.reloadTree();
            });
            it("method --> 'getLayer' (imageWms)",function(){
                node = oVmap.getMapManager().ajaxGetLayersTree("http://localhost:9876/__karma__/data/examples/layers-tree-cadastre-chablis.json");
                oVmap.getMapManager().setLayersTree(node);
                //console.log(node);
                expect(node['children'][1]['olLayer']).not.toBeDefined();
                spyOn( oVmap.getMapManager().getMapLegendTool(),"loadLegend").and.callFake(Dummy);
                var controller = ctrl('AppLayertreeController', {$scope: scope});
                expect(controller.getLayer(node['children'][1])).toBeDefined();
                expect(node['children'][1]['olLayer']).toBeDefined();
                controller.reloadTree();
            });
            it("method --> 'getLayer' (TileWms)",function(){
                node = oVmap.getMapManager().ajaxGetLayersTree("http://localhost:9876/__karma__/data/examples/layers-tree-geobretagne.json");
                oVmap.getMapManager().setLayersTree(node);
                //console.log(node);
                expect(node['children'][1]['children'][0]['olLayer']).not.toBeDefined();
                var controller = ctrl('AppLayertreeController', {$scope: scope});
                expect(controller.getLayer(node['children'][1]['children'][0])).toBeDefined();
                expect(node['children'][1]['children'][0]['olLayer']).toBeDefined();
                controller.reloadTree();
            });
            it("method --> 'getLayer' (OSM)",function(){
                node = oVmap.getMapManager().ajaxGetLayersTree("http://localhost:9876/__karma__/data/examples/layers-tree-geobretagne-osm.json");
                oVmap.getMapManager().setLayersTree(node);
                //console.log(node);
                expect(node['children'][1]['children'][0]['olLayer']).not.toBeDefined();
                var controller = ctrl('AppLayertreeController', {$scope: scope});
                expect(controller.getLayer(node['children'][1]['children'][0])).toBeDefined();
                expect(node['children'][1]['children'][0]['olLayer']).toBeDefined();
                controller.reloadTree();
            });
            it("method --> 'getLayer' (imagevector){{(Manque Data)}}",function(){});
            it("method --> 'getLayer' (tileWmts) {{(Manque Data)}}",function(){});
            it("method --> 'getLayer' (Other)",function(){
                node = oVmap.getMapManager().ajaxGetLayersTree("http://localhost:9876/__karma__/data/examples/layers-tree-others.json");
                oVmap.getMapManager().setLayersTree(node);
                console.log(node);
                spyOn(console,"error").and.callFake(Dummy);
                expect(node['children'][2]['children'][0]['olLayer']).not.toBeDefined();
                var controller = ctrl('AppLayertreeController', {$scope: scope});
                expect(controller.getLayer(node['children'][2]['children'][0])).toBeDefined();
                expect(node['children'][2]['children'][0]['olLayer']).toBeDefined();
                expect(console.error).toHaveBeenCalledWith("Error: layerType (Others) is not supported");
                controller.reloadTree();
            });
        });
    });
});




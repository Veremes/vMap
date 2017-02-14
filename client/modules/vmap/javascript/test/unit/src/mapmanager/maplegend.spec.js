/* global goog, angular, expect, nsVmap, oVmap, spyOn, Dummy */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on maplegend.js 
 * All the Units Tests of nsVmap.nsMapManager.MapLegend class
 */
goog.provide('nsVmap.nsMapManager.MapLegend.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsMapManager.MapLegend');

console.log("Unit - nsVmap.nsMapManager.MapLegend");



describe("Unit -", function () {
    describe("nsVmap.nsMapManager.MapLegend :", function () {
        beforeEach(module('app'));
        describe("angular directive : 'appMaplegend'", function () {
            var scope;
            var el;
            var httpBackend;
            var toTest = {};
            var XMLDoc = function () {
                var requete = new XMLHttpRequest();
                requete.open("GET", "http://localhost:9876/__karma__/data/map.json", false);
                requete.send(null);
                return requete.responseText;
            };

            beforeEach(module('template/layers/maplegend.html'));
            
            beforeEach(inject(function($rootScope, $compile, $httpBackend){
                scope = $rootScope.$new();
                httpBackend = $httpBackend;
                httpBackend.expectGET("data/map.json").respond(200,XMLDoc);
                el = angular.element(
                    '<div id="container">'+
                        '<div app-maplegend app-maplegend-map = "::mainCtrl.map" class = "ng-isolate-scope" ></div>' +
                    '</div>'
                );
                $compile(el)(scope);
                scope.$digest();
                httpBackend.flush();
            }));
            afterEach(function(){
                httpBackend.verifyNoOutstandingExpectation();
                httpBackend.verifyNoOutstandingRequest();
                scope = {};
                el = {};
                toTest = {};
                httpBackend = {};
            });
            
            it("loading directive",function(){
                toTest = el.find('div');
                expect(toTest[0].localName).toEqual("div");
                expect(toTest[0].childElementCount).toEqual(1);
            });
            it("loaded with good template",function(){
                toTest = el.find('div');
                expect(toTest[0].children[0].textContent).toContain("Légende");
                expect(toTest[0].children[0].tagName).toBe("DIV");
                expect(toTest[0].children[0].parentElement.localName).toBe("div");
                expect(toTest[0].children.length).toEqual(1);
            });
        });

        describe("class method : ",function(){
            var scope;
            var el;
            var oMapLegend;
            
            beforeEach(module('template/layers/layertree.html'));
            beforeEach(module('template/layers/layertreenode.html'));
            beforeEach(module('template/layers/popup.html'));
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();
                oMapLegend = new nsVmap.nsMapManager.MapLegend();
                el = angular.element(
                    '<div id="container">' +
                        '<div app-layertree id = "app-layertree"  app-layertree-map="::mainCtrl.map" class="ng-isolate-scope"></div>' +
                    '</div>'
                );
                $compile(el)(scope);
                scope.$digest();
            }));
            beforeEach(function () {
                $.support.transition = (function () {
                    var thisBody = document.body || document.documentElement,
                            thisStyle = thisBody.style,
                            support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
                    if (thisStyle.transition !== undefined)
                        support = {end: 'transitionend'};
                    if (thisStyle.WebkitTransition !== undefined)
                        support = {end: 'webkitTransitionEnd'};
                    if (thisStyle.MozTransition !== undefined)
                        support = {end: 'transitionend'};
                    if (thisStyle.MsTransition !== undefined)
                        support = {end: 'transitionend'};
                    if (thisStyle.OTransition !== undefined)
                        support = {end: 'oTransitionEnd otransitionend'};
                    return support;
                })();
            });
            afterEach(function () {
                scope = {};
                el = {};
                oMapLegend = {};
                oVmap.getMap().getOLMap().getLayers().getArray().length = 0; 
            });
            it("method --> 'toggleLegend' (last if pass and first if branch if)",function(){
                var layerID = 2;
                var tree = oVmap.getMap().getOLMap().getLayers().getArray();
                var layer = tree[2];
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.callThrough();
                spyOn(oVmap.getMapManager(),"getLayersTree").and.callThrough();
                spyOn(layer,"get").and.returnValue(true);
                spyOn(layer,"set").and.callFake(Dummy);
                spyOn($.fn,"on").and.callFake(Dummy);
                oMapLegend.toggleLegend(layerID);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.getMapManager().getLayersTree).toHaveBeenCalled();
                expect($.fn.on).toHaveBeenCalled();
                expect(layer.get).toHaveBeenCalledWith('legend');
                expect(layer.set).toHaveBeenCalled();
            });
            it("method --> 'toggleLegend' (last if pass and first if branch else)",function(){
                var layerID = 2;
                var tree = oVmap.getMap().getOLMap().getLayers().getArray();
                var layer = tree[2];
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.callThrough();
                spyOn(oVmap.getMapManager(),"getLayersTree").and.callThrough();
                spyOn(layer,"get").and.returnValue('collapse');
                spyOn(layer,"set").and.callFake(Dummy);
                spyOn($.fn,"on").and.callFake(Dummy);
                oMapLegend.toggleLegend(layerID);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.getMapManager().getLayersTree).toHaveBeenCalled();
                expect($.fn.on).toHaveBeenCalled();
                expect(layer.get).toHaveBeenCalledWith('legend');
                expect(layer.set).toHaveBeenCalled();
            });
            it("method --> 'closeLegend' (last if pass and first if branch if)",function(){
                var layerID = 2;
                var tree = oVmap.getMap().getOLMap().getLayers().getArray();
                var layer = tree[2];
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.callThrough();
                spyOn(oVmap.getMapManager(),"getLayersTree").and.callThrough();
                spyOn(layer,"get").and.returnValue(true);
                spyOn(layer,"set").and.callFake(Dummy);
                spyOn($.fn,"on").and.callFake(Dummy);
                spyOn(oMapLegend,"loadLegend").and.callFake(Dummy);
                oMapLegend.closeLegend(layerID);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oMapLegend.loadLegend).toHaveBeenCalled();
                expect(oVmap.getMapManager().getLayersTree).toHaveBeenCalled();
                expect($.fn.on).toHaveBeenCalled();
                expect(layer.get).toHaveBeenCalledWith('legend');
                expect(layer.set).toHaveBeenCalled();
            });
            it("method --> 'closeLegend' (last if pass and first if branch else)",function(){
                var layerID = 2;
                var tree = oVmap.getMap().getOLMap().getLayers().getArray();
                var layer = tree[2];
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.callThrough();
                spyOn(oVmap.getMapManager(),"getLayersTree").and.callThrough();
                spyOn(layer,"get").and.returnValue('collapse');
                spyOn(layer,"set").and.callFake(Dummy);
                spyOn($.fn,"on").and.callFake(Dummy);
                spyOn(oMapLegend,"loadLegend").and.callFake(Dummy);
                oMapLegend.closeLegend(layerID);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oMapLegend.loadLegend).toHaveBeenCalled();
                expect(oVmap.getMapManager().getLayersTree).toHaveBeenCalled();
                expect($.fn.on).toHaveBeenCalled();
                expect(layer.get).toHaveBeenCalledWith('legend');
                expect(layer.set).toHaveBeenCalled();
            });
            
            it("method --> 'loadLegend' (third if not pass, fourth if pass)",function(){
                var tree = oVmap.getMap().getOLMap().getLayers().getArray();
                tree.length = 1;
                var toReturn = {
                    'visible': true,
                    'legend': true /*'collapse'*/,
                    'type': 'tilewms' /* 'imagewms'*/,
                    'name': 'toto',
                    'source': tree[0].values_.source
                };
                spyOn(tree[0], "get").and.callFake(function (P) {
                    return toReturn[P];
                });
                spyOn(tree[0].getSource(), "getUrls").and.returnValue(["http://totoishere.url/"]);
                spyOn(tree[0].getSource(), "getParams").and.returnValue({LAYERS : 'ne:ne'});
                spyOn(oVmap.getMap().getOLMap().getLayers(), "getArray").and.returnValue(tree);
                oMapLegend.loadLegend();
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(tree[0].get).toHaveBeenCalledWith('visible');
                expect(tree[0].get).toHaveBeenCalledWith('legend');
                expect(tree[0].get).toHaveBeenCalledWith('type');
                expect(tree[0].get).toHaveBeenCalledWith('name');
                expect(tree[0].getSource().getUrls).toHaveBeenCalled();
                expect(tree[0].getSource().getParams).toHaveBeenCalled();
            });
            
            it("method --> 'loadLegend' (third if pass, fourth if not pass)",function(){

                var tree = oVmap.getMap().getOLMap().getLayers().getArray();
                tree.length = 1;
                console.log(tree[0].values_.source);
                var toReturn = {
                    'visible': true,
                    'legend': 'collapse',
                    'type': 'imagewms',
                    'name': 'toto',
                    'source': tree[0].values_.source
                };
                spyOn(tree[0], "get").and.callFake(function (P) {
                    return toReturn[P];
                });
                spyOn(tree[0].getSource(), "getUrls").and.returnValue(["http://totoishere.url/"]);
                spyOn(tree[0].getSource(), "getParams").and.returnValue({LAYERS : 'ne:ne'});
                spyOn(oVmap.getMap().getOLMap().getLayers(), "getArray").and.returnValue(tree);
                oMapLegend.loadLegend();
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(tree[0].get).toHaveBeenCalledWith('visible');
                expect(tree[0].get).toHaveBeenCalledWith('legend');
                expect(tree[0].get).toHaveBeenCalledWith('type');
                expect(tree[0].get).toHaveBeenCalledWith('name');
                expect(tree[0].getSource().getUrls).toHaveBeenCalled();
                expect(tree[0].getSource().getParams).toHaveBeenCalled();
            });
        });
	describe("angular controller : 'AppMaplegendController'", function () {
            var scope;
            var httpBackend;
            var ctrl;
            var http;
            var XMLDoc = function (URL) {
                var requete = new XMLHttpRequest();
                requete.open("GET",URL , false);
                requete.send(null);
                return requete.responseText;
            };
            beforeEach(inject(function ($controller, $rootScope, $http, $httpBackend) {
                httpBackend = $httpBackend;
                scope = $rootScope.$new();
                ctrl = $controller;
                http = $http;
            }));
            
            afterEach(function () {
                httpBackend.verifyNoOutstandingExpectation();
                httpBackend.verifyNoOutstandingRequest();
                httpBackend = {};
                scope = {};
                http = {};
                ctrl ={};
            });
            
            it("AJAX request (.then)",function(){
                httpBackend.expectGET("data/map.json").respond(200,XMLDoc("http://localhost:9876/__karma__/data/map.json"));
                spyOn(angular, "bind").and.callThrough();
                spyOn(oVmap,"log").and.callThrough();
                var controller = ctrl('AppMaplegendController', {$scope: scope, $http:http});
                httpBackend.flush();
                expect(angular.bind).toHaveBeenCalled();
                expect(oVmap.log).toHaveBeenCalledWith("bootstrap toggle");
            });
        });
    });
});


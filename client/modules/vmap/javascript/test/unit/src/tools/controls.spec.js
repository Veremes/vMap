/* global goog, angular, spyOn, oVmap, nsVmap, Dummy, expect */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on controls.js 
 * All the Units Tests of nsVmap.nsMapManager.nsToolsModal.Controls class
 */
goog.provide('nsVmap.nsToolsManager.Controls.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsToolsManager.Controls');

console.log("Unit - nsVmap.nsToolsManager.Controls");

describe("Unit -", function () {
    describe("nsVmap.nsToolManager.Controls :", function () {
        beforeEach(module('app'));
        describe("angular directive : 'appControls'", function () {
            var scope;
            var el;
            var toTest = {};

            beforeEach(module('template/tools/controls.html'));
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();

                el = angular.element(  
                    '<div id="container">' +
                        '<div id="Controls-tool" class="side-tool ng-isolate-scope" app-controls app-controls-map="::mainCtrl.map" app-controls-lang="mainCtrl.lang"></div>' +
                    '</div>'
                );
                spyOn(document,"getElementById").and.returnValue(document.createElement('div'));
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
                expect(toTest[0].children[0].textContent).toBe("Outils de controle");
                expect(toTest[0].children[0].tagName).toBe("A");
                expect(toTest[0].children[0].parentElement.attributes[2].localName).toBe("app-controls");
                expect(toTest[0].children.length).toEqual(2);
            });
        });

        describe("class method :", function () {
            
            var oToolManager;
            var Tool;
            var oMap;

            beforeEach(function () {
                Tool = ["Attribution", "FullScreen", "MousePosition", "OverviewMap", "Rotate", "ScaleLine", "Zoom", "ZoomSlider", "ZoomtoExtent"];
                oToolManager = new nsVmap.nsToolsManager.Controls(Tool);
                oMap = oVmap.getMap().getOLMap();
            });
            afterEach(function () {

                oToolManager = {};
                oMap = {};
                Tool = {};
            });

            it("method --> 'addControl' ('Default')", function () {
                spyOn(oVmap.getMap(), "getOLMap").and.callThrough();
                spyOn(console, "error").and.callFake(Dummy);
                oToolManager.addControl("toto");
                expect(oVmap.getMap().getOLMap).toHaveBeenCalled();
                expect(console.error).toHaveBeenCalledWith("Warning : control (toto) is not available");
                expect(oToolManager.addControl("toto")).toEqual(false);
            });
            it("method --> 'addControl' ('Attribution')", function () {
                spyOn(oMap, "addControl").and.callFake(Dummy);
                oToolManager.addControl("Attribution");
                expect(oMap.addControl).toHaveBeenCalled();
            });
            it("method --> 'addControl' ('FullScreen')", function () {
                spyOn(oMap, "addControl").and.callFake(Dummy);
                oToolManager.addControl("FullScreen");
                expect(oMap.addControl).toHaveBeenCalled();
            });
            it("method --> 'addControl' ('MousePosition')", function () {
                spyOn(oMap, "addControl").and.callFake(Dummy);
                oToolManager.addControl("MousePosition");
                expect(oMap.addControl).toHaveBeenCalled();
            });
            it("method --> 'addControl' ('OverviewMap')", function () {
                spyOn(oMap, "addControl").and.callFake(Dummy);
                oToolManager.addControl("OverviewMap");
                expect(oMap.addControl).toHaveBeenCalled();
            });
            it("method --> 'addControl' ('Rotate')", function () {
                spyOn(oMap, "addControl").and.callFake(Dummy);
                oToolManager.addControl("Rotate");
                expect(oMap.addControl).toHaveBeenCalled();
            });
            it("method --> 'addControl' ('ScaleLine')", function () {
                spyOn(oMap, "addControl").and.callFake(Dummy);
                oToolManager.addControl("ScaleLine");
                expect(oMap.addControl).toHaveBeenCalled();
            });
            it("method --> 'addControl' ('Zoom')", function () {
                spyOn(oMap, "addControl").and.callFake(Dummy);
                oToolManager.addControl("Zoom");
                expect(oMap.addControl).toHaveBeenCalled();
            });
            it("method --> 'addControl' ('ZoomSlider')", function () {
                spyOn(oMap, "addControl").and.callFake(Dummy);
                oToolManager.addControl("ZoomSlider");
                expect(oMap.addControl).toHaveBeenCalled();
            });
            it("method --> 'addControl' ('ZoomToExtent')", function () {
                spyOn(oMap, "addControl").and.callFake(Dummy);
                oToolManager.addControl("ZoomToExtent");
                expect(oMap.addControl).toHaveBeenCalled();
            });
            it("method --> 'addControl' ('DragAndDrop')", function () {
                spyOn(document, "getElementsByClassName").and.returnValue(document.createElement('div'));
                oToolManager.addControl("DragAndDrop");
                expect(document.getElementsByClassName).toHaveBeenCalledWith("ol-viewport");
            });
            it("method --> 'addControl' ('CurrentProjection')", function () {
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), "getCode").and.callThrough();
                oToolManager.addControl("CurrentProjection");
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
            });
            it("method --> 'toggleControl' (in Array)",function(){
                var El = document.createElement('div');
                var Mock = {};
                Mock.get = function(){
                    return "Rotate";
                };
                spyOn(oVmap.getMap().getOLMap().getControls(),"getArray").and.returnValue([Mock, Mock, Mock]);
                spyOn(oVmap.getMap().getOLMap(),"removeControl").and.callFake(Dummy);
                spyOn(oToolManager,"addControl").and.callFake(Dummy);
                spyOn($.fn,"toggle").and.callFake(Dummy);
                spyOn(El,"removeEventListener").and.callFake(Dummy);
                spyOn(document,"getElementsByClassName").and.returnValue([El,El,El]);
                oToolManager.toggleControl("Rotate");
                expect(oVmap.getMap().getOLMap().removeControl).toHaveBeenCalled();
                expect($.fn.toggle).not.toHaveBeenCalled();
                expect(document.getElementsByClassName).not.toHaveBeenCalled();
                expect(oToolManager.addControl).not.toHaveBeenCalled();
            });
            it("method --> 'toggleControl' (CurrentProjection)",function(){
                var El = document.createElement('div');
                var Mock = {};
                Mock.get = function(){
                    return undefined;
                };
                spyOn(oVmap.getMap().getOLMap().getControls(),"getArray").and.returnValue([Mock, Mock, Mock]);
                spyOn(oVmap.getMap().getOLMap(),"removeControl").and.callFake(Dummy);
                spyOn($.fn,"toggle").and.callFake(Dummy);
                spyOn(oToolManager,"addControl").and.callFake(Dummy);
                spyOn(El,"removeEventListener").and.callFake(Dummy);
                spyOn(document,"getElementsByClassName").and.returnValue([El,El,El]);
                oToolManager.toggleControl("CurrentProjection");
                expect(oVmap.getMap().getOLMap().removeControl).not.toHaveBeenCalled();
                expect($.fn.toggle).toHaveBeenCalled();
                expect(document.getElementsByClassName).not.toHaveBeenCalled();
                expect(oToolManager.addControl).not.toHaveBeenCalled();
            });
            it("method --> 'toggleControl' (DragAndDrop and if pass)",function(){
                var El = document.createElement('div');
                var Mock = {};
                Mock.get = function(){
                    return undefined;
                };
                spyOn(oVmap.getMap().getOLMap().getControls(),"getArray").and.returnValue([Mock, Mock, Mock]);
                spyOn(oVmap.getMap().getOLMap(),"removeControl").and.callFake(Dummy);
                spyOn($.fn,"toggle").and.callFake(Dummy);
                spyOn(oToolManager,"addControl").and.callFake(Dummy);
                spyOn(El,"removeEventListener").and.callFake(Dummy);
                spyOn(document,"getElementsByClassName").and.returnValue([El,El,El]);
                oToolManager.toggleControl("DragAndDrop");
                expect(oVmap.getMap().getOLMap().removeControl).not.toHaveBeenCalled();
                expect($.fn.toggle).not.toHaveBeenCalled();
                expect(document.getElementsByClassName).not.toHaveBeenCalled();
                expect(oToolManager.addControl).toHaveBeenCalled();
            });
            it("method --> 'toggleControl' (DragAndDrop and if not pass)",function(){
                var El = document.createElement('div');
                oToolManager.DragAndDrop = true;
                var Mock = {};
                Mock.get = function(){
                    return undefined;
                };
                spyOn(oVmap.getMap().getOLMap().getControls(),"getArray").and.returnValue([Mock, Mock, Mock]);
                spyOn(oVmap.getMap().getOLMap(),"removeControl").and.callFake(Dummy);
                spyOn($.fn,"toggle").and.callFake(Dummy);
                spyOn(oToolManager,"addControl").and.callFake(Dummy);
                spyOn(El,"removeEventListener").and.callFake(Dummy);
                spyOn(document,"getElementsByClassName").and.returnValue([El,El,El]);
                oToolManager.toggleControl("DragAndDrop");
                expect(oVmap.getMap().getOLMap().removeControl).not.toHaveBeenCalled();
                expect($.fn.toggle).not.toHaveBeenCalled();
                expect(document.getElementsByClassName).toHaveBeenCalled();
                expect(oToolManager.addControl).not.toHaveBeenCalled();
            }); 
            it("method --> 'toggleControl' (Other)",function(){
                var El = document.createElement('div');
                oToolManager.DragAndDrop = true;
                var Mock = {};
                Mock.get = function(){
                    return undefined;
                };
                spyOn(oVmap.getMap().getOLMap().getControls(),"getArray").and.returnValue([Mock, Mock, Mock]);
                spyOn(oVmap.getMap().getOLMap(),"removeControl").and.callFake(Dummy);
                spyOn($.fn,"toggle").and.callFake(Dummy);
                spyOn(oToolManager,"addControl").and.callFake(Dummy);
                spyOn(El,"removeEventListener").and.callFake(Dummy);
                spyOn(document,"getElementsByClassName").and.returnValue([El,El,El]);
                oToolManager.toggleControl("Other");
                expect(oVmap.getMap().getOLMap().removeControl).not.toHaveBeenCalled();
                expect($.fn.toggle).not.toHaveBeenCalled();
                expect(document.getElementsByClassName).not.toHaveBeenCalled();
                expect(oToolManager.addControl).toHaveBeenCalled();
            }); 
        });

        describe("angular controller : 'AppControlsController'", function () {
            
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

            it("Instanciation (if not pass)", function () {
                var tmp = oVmap.getToolsManager()['Controls'];
                spyOn(oVmap, 'getToolsManager').and.callThrough();
                spyOn(tmp,"getControlsList").and.returnValue(["toto", "tata", "babar", "test", "gandalf", "balrog"]);
                spyOn(document,"getElementById").and.callFake(Dummy);
                spyOn(goog.dom,"createDom").and.callFake(Dummy);
                spyOn(goog.dom,"appendChild").and.callFake(Dummy);
                
                var controller = ctrl('AppControlsController', {$scope: scope});
                
                expect(oVmap.getToolsManager).toHaveBeenCalled();
                expect(tmp.getControlsList).toHaveBeenCalled();
                expect(document.getElementById).not.toHaveBeenCalled();
                expect(goog.dom.createDom).not.toHaveBeenCalled();
                expect(goog.dom.appendChild).not.toHaveBeenCalled();
            });
        });    
    });
});
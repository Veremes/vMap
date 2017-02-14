/* global goog, angular, oVmap, spyOn, expect, Dummy */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on basictools.js 
 * All the Units Tests of nsVmap.nsToolsManager.BasicTools class
 */
goog.provide('nsVmap.nsToolsManager.BasicTools.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsToolsManager.BasicTools');

console.log("Unit - nsVmap.nsToolsManager.BasicTools");

describe("Unit -", function () {
    describe("nsVmap.nsToolsManager.BasicTools :", function () {
        beforeEach(module('app'));
        describe("angular directive : 'appBasictools'", function () {
            var scope;
            var el;
            var toTest = {};

            beforeEach(module('template/tools/basictools.html'));
            beforeEach(module('template/tools/location.html'));
            beforeEach(module('template/tools/measure.html'));
            beforeEach(module('template/tools/select.html'));
            beforeEach(module('template/tools/print.html'));
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();

                el = angular.element(
                        '<div>' +
                        '<div app-basictools app-lang="mainCtrl.lang"></div>' +
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
                expect(toTest[0].children[0].tagName).toBe("DIV");
                expect(toTest[0].children[0].parentElement.attributes[0].localName).toBe("app-basictools");
                expect(toTest[0].children.length).toEqual(1);
            });
        });

        describe("angular controller : 'AppBasictoolsController'", function () {

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
                spyOn(oVmap.getMap(), "getOLMap").and.callThrough();
                var controller = ctrl('AppBasictoolsController', {$scope: scope});
                expect(oVmap.getMap().getOLMap).toHaveBeenCalled();
            });
        });
        describe("class method :", function () {
            var oBasicTools;
        
            beforeEach(inject(function ($controller, $rootScope) {
                oBasicTools = oVmap.getToolsManager().getBasicTools();
            }));
            afterEach(function () {
                oBasicTools = {};
            });

            it("method --> toggleTool (if Pass)",function(){
                spyOn($.fn,"hasClass").and.returnValue(false);
                spyOn(oBasicTools,"toggleOutTools").and.callFake(Dummy);
                spyOn($.fn,"addClass").and.callFake(Dummy);
                spyOn($.fn,"show").and.callFake(Dummy);
                oBasicTools.toggleTool("toto");
                expect($.fn.addClass).toHaveBeenCalled();
                expect($.fn.show).toHaveBeenCalled();
            });
            
            it("method --> toggleTool (if not Pass)",function(){
                spyOn($.fn,"hasClass").and.returnValue(true);
                spyOn(oBasicTools,"toggleOutTools").and.callFake(Dummy);
                spyOn($.fn,"addClass").and.callFake(Dummy);
                spyOn($.fn,"show").and.callFake(Dummy);
                oBasicTools.toggleTool("toto");
                expect($.fn.addClass).not.toHaveBeenCalled();
                expect($.fn.show).not.toHaveBeenCalled();
            });

            it("method --> toggleOutTools", function () {
                spyOn($.fn,"removeClass").and.callFake(Dummy);
                spyOn($.fn,"hide").and.callFake(Dummy);
                oBasicTools.toggleOutTools();
                expect($.fn.removeClass).toHaveBeenCalled();
                expect($.fn.hide).toHaveBeenCalled();
            });
        });
    });
});
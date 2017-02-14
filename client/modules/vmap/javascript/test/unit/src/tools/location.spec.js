/* global goog, angular, oVmap, spyOn, expect, ol, Dummy */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on location.js 
 * All the Units Tests of nsVmap.nsToolsManager.Location class
 */
goog.provide('nsVmap.nsToolsManager.Location.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsToolsManager.Location');

console.log("Unit - nsVmap.nsToolsManager.Location");

describe("Unit -", function () {
    describe("nsVmap.nsToolsManager.Location :", function () {
        beforeEach(module('app'));

        describe("angular directive : 'appLocation'", function () {
            var scope;
            var el;
            var toTest = {};

            beforeEach(module('template/tools/location.html'));

            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();

                el = angular.element(
                    '<div id="container">' +
                        '<div app-location app-lang="ctrl.lang" app-map="ctrl.map" class="ng-isolate-scope" ></div>' +
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
                expect(toTest[0].children[0].parentElement.attributes[0].localName).toBe("app-location");
                expect(toTest[0].children.length).toEqual(4);
            });
        });
        describe("angular controller : 'ApplocationController'", function () {

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
                spyOn(oVmap.getMap().getOLMap(),"getView").and.callThrough();
                spyOn(oVmap.getMap(), "getOLMap").and.callThrough();
                var controller = ctrl('ApplocationController', {$scope: scope});
                expect(oVmap.getMap().getOLMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView.calls.count()).toEqual(2);
            });
            
            it("method --> goHome",function(){
                var controller = ctrl('ApplocationController', {$scope: scope});
                spyOn(oVmap.getMap().getOLMap().getView(),"setCenter").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setZoom").and.callFake(Dummy);
                controller.goHome();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setZoom).toHaveBeenCalled();
            });
            
            it("method --> geolocateMe", function(){
                var controller = ctrl('ApplocationController', {$scope: scope});
                spyOn(oVmap.getMap().getOLMap().getView(),"getProjection").and.returnValue("EPSG:4326");
                spyOn(ol.Geolocation.prototype, "setTracking").and.callThrough();
                spyOn(ol.Geolocation.prototype, "on").and.callFake(Dummy);
                controller.geolocateMe();
                expect(ol.Geolocation.prototype.setTracking.calls.count()).toEqual(2);
                expect(ol.Geolocation.prototype.on.calls.count()).toEqual(2);
            });
        });
    });
});
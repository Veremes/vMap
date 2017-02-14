/* global goog, angular, expect, oVmap, spyOn */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on Map.js 
 * All the Units Tests of nsVmap.Map class
 */
goog.provide('nsVMap.Map.Spec');

goog.require('oVmap');
goog.require('nsVmap.Map');

console.log("Unit - nsVmap.Map");



describe("Unit -", function () {
    describe("nsVMap.Map :", function () {
        beforeEach(module('app'));
        describe("angular directive : 'appMap'", function () {
            var scope;
            var el;
            var toTest;
            
            beforeEach(inject(function($rootScope, $compile){
                scope = $rootScope.$new();
                el = angular.element(
                    '<div id="map-container" ng-class="ctrl.bottom_open ? \'open\' : \'\'">' +
                        '<app-map app-map="mainCtrl.map"></app-map>' +
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
                toTest = el.find('app-map');
                expect(toTest[0].localName).toEqual("app-map");
                expect(toTest[0].children.length).toBeGreaterThan(0)
            });       
            it("loaded with good template",function(){
                toTest = el.find('app-map');
                expect(toTest[0].children[0].attributes[0].name).toBe("ngeo-map");
                expect(toTest[0].children[0].tagName).toBe("DIV");
                expect(toTest[0].children[0].parentElement.localName).toBe("app-map");
                expect(toTest[0].children.length).toEqual(1);
            });
        });
        describe("angular controller : 'MainController'", function () {

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
                spyOn(oVmap.getMap(), 'getOLMap').and.callThrough();
                var controller = ctrl('MainController', {$scope: scope});
                expect(controller['lang']).toEqual("fr");
                expect(oVmap.getMap().getOLMap).toHaveBeenCalled();
                expect(controller['left_open']).toEqual(false);
                expect(controller['right_open']).toEqual(false);
                console.log(expect(controller['bottom_open']).toEqual(false));
            });
        });
    });
});



/* global goog, angular, spyOn, expect */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on loadgeometry.js 
 * All the Units Tests of nsVmap.nsMapManager.nsMapModal.LoadGeometry class
 */
goog.provide('nsVmap.nsMapManager.nsMapModal.LoadGeometry.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsMapManager.nsMapModal.LoadGeometry');

console.log("Unit - nsVmap.nsMapManager.nsMapModal.LoadGeometry");


describe("Unit -", function () {
    describe("nsVmap.nsMapManager.nsMapModal.LoadGeometry :", function () {
        beforeEach(module('app'));
        describe("angular directive : 'appLoadgeometry'", function () {
            var scope;
            var el;
            var toTest = {};

            beforeEach(module('template/layers/mapmodal/loadgeometry.html'));
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();

                el = angular.element(
                    '<div id="container">' +
                        '<div app-loadgeometry app-loadgeometry-map="::mainCtrl.map"></div>' +
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
                expect(toTest[0].children[0].textContent).toBe("Ajouter une géométrie: ");
                expect(toTest[0].children[0].tagName).toBe("H3");
                expect(toTest[0].children[0].parentElement.localName).toBe("div");
                expect(toTest[0].children.length).toEqual(4);
            });

        });
        describe("angular controller : 'AppLoadgeometryController'", function () {

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
                spyOn(document, 'getElementById').and.returnValue(document.createElement('div'));
                var controller = ctrl('AppLoadgeometryController', {$scope: scope});
                expect(document.getElementById).toHaveBeenCalled();
            });
        });
    });
});




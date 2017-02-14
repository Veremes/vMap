/* global goog, angular, expect, oVmap, spyOn */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on wfssuggestion.js.js 
 * All the Units Tests of nsVmap.nsMapManager.nsMapModal.WFSSuggestions class
 */
goog.provide('nsVmap.nsMapManager.nsMapModal.WFSSuggestions.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsMapManager.nsMapModal.WFSSuggestions');

console.log("Unit - nsVmap.nsMapManager.nsMapModal.WFSSuggestions");

describe("Unit -", function () {
    describe("nsVmap.nsMapManager.nsMapModal.WFSSuggestions :", function () {
        beforeEach(module('app'));
        describe("angular directive : 'appWfssuggestions'", function () {
            var scope;
            var el;
            var toTest = {};

            beforeEach(module('template/layers/mapmodal/wfssuggestions.html'));
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();

                el = angular.element(
                    '<div id="container">' +
                        '<div app-wfssuggestions app-wfssuggestions-map="::mainCtrl.map" class="ng-isolate-scope"></div>' +
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
                expect(toTest[0].children[0].textContent).toBe("Ajouter une couche WFS: ");
                expect(toTest[0].children[0].tagName).toBe("H3");
                expect(toTest[0].children[0].parentElement.localName).toBe("div");
                expect(toTest[0].children.length).toEqual(11);
            });
        });
        
	describe("angular controller : 'AppWfssuggestionsController'", function () {

            var scope = {};
            var ctrl = {};
            var http = {};
            var httpBackend = {};
            var XMLDoc = function (url) {
                var requete = new XMLHttpRequest();
                requete.open("GET", "http://localhost:9876/__karma__/data/Serveur_Geosignal.xml", false);
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
                scope = {};
                ctrl = {};
                http = {};
                httpBackend = {};
            });

            it("Instanciation", function () {
                spyOn(oVmap.getMapManager().getMapModalTool(), 'getMapCatalog').and.callThrough();
                var controller = ctrl('AppWfssuggestionsController', {$scope: scope, $http:http});
                expect(oVmap.getMapManager().getMapModalTool().getMapCatalog).toHaveBeenCalled();
                expect(controller['aLayers']).toEqual([]);
            });
            
           it("method --> 'getCapabilities' {{(EA)}}", function () {
                console.log("wfssuggestionsController.reload is empty");
                var controller = ctrl('AppWfssuggestionsController', {$scope: scope, $http:http});
                //Empty Method
                controller.getCapabilities();
                expect(true).toBe(true);
            });
        });
    });
});
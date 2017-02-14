/* global goog, angular, expect, oVmap, spyOn, Dummy */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on wmssuggestion.js.js 
 * All the Units Tests of nsVmap.nsMapManager.nsMapModal.WMSSuggestions class
 */
goog.provide('nsVmap.nsMapManager.nsMapModal.WMSSuggestions.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsMapManager.nsMapModal.WMSSuggestions');

console.log("Unit - nsVmap.nsMapManager.nsMapModal.WMSSuggestions");



describe("Unit -", function () {
    describe("nsVmap.nsMapManager.nsMapModal.WMSSuggestions :", function () {
        beforeEach(module('app'));
        describe("angular directive : 'appWmssuggestions'", function () {
            var scope;
            var el;
            var toTest = {};

            beforeEach(module('template/layers/mapmodal/wmssuggestions.html'));
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();

                el = angular.element(
                    '<div id="container">' +
                        '<div app-wmssuggestions app-wmssuggestions-map="::mainCtrl.map" class="ng-isolate-scope"></div>' +
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
                expect(toTest[0].children[0].textContent).toBe("Ajouter une couche WMS: ");
                expect(toTest[0].children[0].tagName).toBe("H3");
                expect(toTest[0].children[0].parentElement.localName).toBe("div");
                expect(toTest[0].children.length).toEqual(10);
            });
        });
	describe("angular controller : 'AppWmssuggestionsController'", function () {
            var scope = {};
            var ctrl = {};
            var http = {};
            var httpBackend = {};
            var XMLDoc = function () {
                var requete = new XMLHttpRequest();
                requete.open("GET", "http://localhost:9876/__karma__/data/Serveur_Geosignal.xml", false);
                requete.send(null);
                return requete.responseText;
            };
            var URL = "http://www.geosignal.org/cgi-bin/wmsmap" ;
            var URL2Ajax = 'proxy/proxy.php?url='+encodeURIComponent(URL+ "?" + "service=wms&version=1.3.0&request=GetCapabilities");
            var XML = XMLDoc();
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
                ctrl ={};
                http = {};
            });
            it("Instanciation", function () {
                spyOn(oVmap.getMapManager().getMapModalTool(), 'getMapCatalog').and.callThrough();
                var controller = ctrl('AppWmssuggestionsController', {$scope: scope, $http:http});
                expect(oVmap.getMapManager().getMapModalTool().getMapCatalog).toHaveBeenCalled();
                expect(controller['aLayers']).toEqual([]);
            });
            it("method --> 'getCapabilities' (empty string argument)", function () {
                spyOn(oVmap, 'displayError').and.callFake(Dummy);
                spyOn($.fn,"val").and.returnValue("");
                var controller = ctrl('AppWmssuggestionsController', {$scope: scope, $http:http});
                expect(controller.getCapabilities()).toEqual(0);
                expect(oVmap.displayError).toHaveBeenCalled();
            });        
            it("method --> 'getCapabilities' (AJAX .error)", function () {
                spyOn(oVmap, 'displayError').and.callFake(Dummy);
                spyOn($.fn,"val").and.returnValue(URL);
                httpBackend.expectGET(URL2Ajax).respond(404, "404 not found");
                var controller = ctrl('AppWmssuggestionsController', {$scope: scope, $http:http});
                controller.getCapabilities();
                httpBackend.flush();
                expect(oVmap.displayError).toHaveBeenCalled();
            }); 
            it("method --> 'getCapabilities' (AJAX .then)", function () {
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), 'getCode').and.callThrough();
                spyOn($.fn,"val").and.returnValue(URL);
                httpBackend.expectGET(URL2Ajax).respond(200, XML);
                var controller = ctrl('AppWmssuggestionsController', {$scope: scope, $http:http});
                controller.getCapabilities();
                httpBackend.flush();
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
            });
        });
    });
});




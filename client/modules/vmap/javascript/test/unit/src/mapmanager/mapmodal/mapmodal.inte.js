/* global nsVmap, expect, goog */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: test Integration with library of mapmodal.js
 * all the test Integration on nsVmap.nsMapManager.nsMapModal.MapModalManager Class
 */
goog.provide('nsVmap.nsMapManager.nsMapModal.MapModalManager.Integration');

goog.require('oVmap');
goog.require('nsVmap.nsMapManager.nsMapModal.MapModalManager');

console.log("Integration - nsVmap.nsMapManager.nsMapModal.MapModalManager");

describe("Integration -", function () {
    describe("nsVmap.nsMapManager.nsMapModal.MapModalManager:", function () {
        describe("Getter and Setter interactions with MapModal file (by directive)", function () {

            //variable require by tests
            var oMapModal = {};


            //initialisation of variables before every tests
            beforeEach(function () {
                oMapModal = new nsVmap.nsMapManager.nsMapModal.MapModalManager([]);
            });
            
            afterEach(function(){
                oMapModal = {};
            });

            it("object --> MapList", function () {
                expect(oMapModal.getMapListTool().maplistDirective().controller).toEqual("AppMaplistController");
                expect(oMapModal.getMapListTool().maplistDirective().restrict).toEqual("A");
                expect(oMapModal.getMapListTool().maplistDirective().scope.map).toEqual("=appMap");
                expect(oMapModal.getMapListTool().maplistDirective().scope.lang).toEqual("=appLang");
                expect(oMapModal.getMapListTool().maplistDirective().templateUrl).toEqual("template/layers/mapmodal/maplist.html");
            });
            
            it("object --> MyMap", function () {
                expect(oMapModal.getMyMapTool().mymapDirective().controller).toEqual("AppMymapController");
                expect(oMapModal.getMyMapTool().mymapDirective().restrict).toEqual("A");
                expect(oMapModal.getMyMapTool().mymapDirective().scope.map).toEqual("=appMap");
                expect(oMapModal.getMyMapTool().mymapDirective().scope.lang).toEqual("=appLang");
                expect(oMapModal.getMyMapTool().mymapDirective().templateUrl).toEqual("template/layers/mapmodal/mymap.html");
            });
            
            it("object --> WMSSuggestions", function () {
                expect(oMapModal.getWMSSuggestionsTool().wmssuggestionsDirective().controller).toEqual("AppWmssuggestionsController");
                expect(oMapModal.getWMSSuggestionsTool().wmssuggestionsDirective().restrict).toEqual("A");
                expect(oMapModal.getWMSSuggestionsTool().wmssuggestionsDirective().scope.map).toEqual("=appMap");
                expect(oMapModal.getWMSSuggestionsTool().wmssuggestionsDirective().scope.lang).toEqual("=appLang");
                expect(oMapModal.getWMSSuggestionsTool().wmssuggestionsDirective().templateUrl).toEqual("template/layers/mapmodal/wmssuggestions.html");
            });
            
            it("object --> WFSSuggestions", function () {
                expect(oMapModal.getWFSSuggestionsTool().wfssuggestionsDirective().controller).toEqual("AppWfssuggestionsController");
                expect(oMapModal.getWFSSuggestionsTool().wfssuggestionsDirective().restrict).toEqual("A");
                expect(oMapModal.getWFSSuggestionsTool().wfssuggestionsDirective().scope.map).toEqual("=appMap");
                expect(oMapModal.getWFSSuggestionsTool().wfssuggestionsDirective().scope.lang).toEqual("=appLang");
                expect(oMapModal.getWFSSuggestionsTool().wfssuggestionsDirective().templateUrl).toEqual("template/layers/mapmodal/wfssuggestions.html");
            });

            it("object --> OSMSuggestions", function () {
                expect(oMapModal.getOSMSuggestionsTool().osmsuggestionsDirective().controller).toEqual("AppOsmsuggestionsController");
                expect(oMapModal.getOSMSuggestionsTool().osmsuggestionsDirective().restrict).toEqual("A");
                expect(oMapModal.getOSMSuggestionsTool().osmsuggestionsDirective().scope.map).toEqual("=appMap");
                expect(oMapModal.getOSMSuggestionsTool().osmsuggestionsDirective().scope.lang).toEqual("=appLang");
                expect(oMapModal.getOSMSuggestionsTool().osmsuggestionsDirective().templateUrl).toEqual("template/layers/mapmodal/osmsuggestions.html");
            });
            
            it("object --> BingSuggestions", function () {
                expect(oMapModal.getBingSuggestionsTool().bingsuggestionsDirective().controller).toEqual("AppBingsuggestionsController");
                expect(oMapModal.getBingSuggestionsTool().bingsuggestionsDirective().restrict).toEqual("A");
                expect(oMapModal.getBingSuggestionsTool().bingsuggestionsDirective().scope.map).toEqual("=appMap");
                expect(oMapModal.getBingSuggestionsTool().bingsuggestionsDirective().scope.lang).toEqual("=appLang");
                expect(oMapModal.getBingSuggestionsTool().bingsuggestionsDirective().templateUrl).toEqual("template/layers/mapmodal/bingsuggestions.html");
            });
            
            it("object --> IGNSuggestions", function () {
                expect(oMapModal.getIGNSuggestionsTool().ignsuggestionsDirective().controller).toEqual("AppIgnsuggestionsController");
                expect(oMapModal.getIGNSuggestionsTool().ignsuggestionsDirective().restrict).toEqual("A");
                expect(oMapModal.getIGNSuggestionsTool().ignsuggestionsDirective().scope.map).toEqual("=appMap");
                expect(oMapModal.getIGNSuggestionsTool().ignsuggestionsDirective().scope.lang).toEqual("=appLang");
                expect(oMapModal.getIGNSuggestionsTool().ignsuggestionsDirective().templateUrl).toEqual("template/layers/mapmodal/ignsuggestions.html");
            });
            
            it("object --> MapCatalog (getter only)", function () {
                expect(oMapModal.getMapCatalog()).toEqual([]);
            });
            
            it("object --> MapCatalog (setter and getter)", function () {
                var Obj = new nsVmap.nsMapManager.MapManager();
                var Catalog = Obj.getMapCatalog();
                oMapModal.setMapCatalog(Catalog);
                expect(oMapModal.getMapCatalog()).toEqual(Catalog);
            });
            
        });
    });
});

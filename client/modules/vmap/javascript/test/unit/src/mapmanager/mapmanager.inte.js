/* global goog, oVmap, expect, nsVmap */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: test Integration with library of mapmanager.js
 * all the test Integration on nsVmap.nsMapManager.MapManager Class
 */
goog.provide('nsVmap.nsMapManager.MapManager.Integration');

goog.require('oVmap');
goog.require('nsVmap.nsMapManager.MapManager');

console.log("Integration - nsVmap.nsMapManager.MapManager");

describe("Integration -", function () {
    describe("nsVmap.nsMapManager.MapManager:", function () {
        describe("Getter and Setter",function(){
                        
            var oMapManager;
            
            beforeEach(function(){
                oMapManager = oVmap.getMapManager();
            });
            afterEach(function () {
               oMapManager = null;
            });
            it("object --> LayersTreeTool (getter only)",function(){
                expect(oMapManager.getLayersTreeTool() instanceof nsVmap.nsMapManager.LayersTree).toBeTruthy();
            });
            it("object --> LayersOrderTool (getter only)",function(){
                expect(oMapManager.getLayersOrderTool() instanceof nsVmap.nsMapManager.LayersOrder).toBeTruthy();
            });
            it("object --> MapLegendTool (getter only)",function(){
                expect(oMapManager.getMapLegendTool() instanceof nsVmap.nsMapManager.MapLegend).toBeTruthy();
            });
            it("object --> MapModalTool (getter only)",function(){
                expect(oMapManager.getMapModalTool() instanceof nsVmap.nsMapManager.nsMapModal.MapModalManager).toBeTruthy();
            });
            it("object --> Layerstree (getter and setter)",function(){
                oMapManager.setLayersTree("Toto");
                expect(oMapManager.getLayersTree()).toEqual("Toto");
            });
            it("object --> MapCatalog (getter and setter)",function(){
                oMapManager.setMapCatalog("Toto");
                expect(oMapManager.getMapCatalog()).toEqual("Toto");
            });
            it("object --> MapToLoadUrl (getter and setter)",function(){
                oMapManager.setMapToLoadUrl("Toto");
                expect(oMapManager.getMapToLoadUrl()).toEqual("Toto");
            });
        });
    });    
    describe("here my first Scenario on Mapmanager.js", function () {
        describe("it's the story of a man", function () {

            it("who walk int the street {{EC)}}", function () {
                expect(true).toBe(true);
            });
            
        });
    });
});

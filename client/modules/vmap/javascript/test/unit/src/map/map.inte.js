/* global goog, nsVmap, ol, expect */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: test Integration with library of Map.js
 * all the test Integration on nsVmap.Map Class
 */
goog.provide('nsVMap.Map.Integration');

goog.require('oVmap');
goog.require('nsVmap.Map');

console.log("Integration - nsVmap.Map");

describe("Integration -", function () {
    describe("nsVMap.Map :", function () {
        describe("Getter and Setter interactions with OL3 ", function () {

            //variable require by tests
            var oMap = {};
            var L = {};
            var M = {};
            var V = {};
            var S = {};
            var O = {};

            //initialisation of variables before every tests
            beforeEach(function () {
                oMap = new nsVmap.Map();
                L = new ol.layer.Group();
                V = new ol.View({
                    center: [0, 0],
                    zoom: 2,
                    constrainRotation: false
                });
                M = new ol.Map({
                    layers: L,
                    view: V
                });
                S = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#6d1a67',
                        width: 3
                    })
                });
                O = new ol.FeatureOverlay({
                    style: S,
                    map: M
                });
            });
            
            afterEach(function(){
                oMap = {};
                L = {};
                M = {};
                V = {};
                S = {};
                O = {};
            });

            it("object --> Layers", function () {
                oMap.setOpenLayersLayers(L);							
                expect(oMap.getOpenLayersLayers().getArray()).toEqual([]);
            });

            it("object --> Map", function () {
                oMap.setOpenLayersMap(M);
                expect(oMap.getOLMap().getView().getCenter()).toEqual([0, 0]);
                expect(oMap.getOLMap().getView().getZoom()).toEqual(2);
                expect(oMap.getOLMap().getLayerGroup().getLayersArray()).toEqual([]);
            });

            it("object --> View", function () {
                oMap.setOpenLayersView(V);
                expect(oMap.getOpenLayersView().getCenter()).toEqual([0, 0]);
                expect(oMap.getOpenLayersView().getZoom()).toEqual(2);
            });

            it("object --> SelectionOverlay", function () {
                oMap.setSelectionOverlay(O);
                expect(oMap.getSelectionOverlay().getStyle().getStroke().getColor()).toEqual('#6d1a67');
                expect(oMap.getSelectionOverlay().getStyle().getStroke().getWidth()).toEqual(3);
                expect(oMap.getSelectionOverlay().getMap().getView().getCenter()).toEqual([0, 0]);
                expect(oMap.getSelectionOverlay().getMap().getView().getZoom()).toEqual(2);
                expect(oMap.getSelectionOverlay().getMap().getLayerGroup().getLayersArray()).toEqual([]);
            });

            it("object --> SelectionStyle", function () {
                oMap.setSelectionStyle(S);
                expect(oMap.getSelectionStyle().getStroke().getColor()).toEqual('#6d1a67');
                expect(oMap.getSelectionStyle().getStroke().getWidth()).toEqual(3);
            });

        });
    });
});

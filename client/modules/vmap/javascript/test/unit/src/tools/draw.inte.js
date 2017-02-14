/* global goog, nsVmap, expect */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit Integration on draw.js 
 * All the Integration Tests of nsVmap.nsToolsManager.Draw class
 */
goog.provide('nsVmap.nsToolsManager.Draw.Integration');

goog.require('oVmap');
goog.require('nsVmap.nsToolsManager.Draw');

console.log("Integration - nsVmap.nsToolsManager.Draw");

describe("Integration -", function () {
    describe("nsVmap.nsToolsManager.Draw :", function () {

        describe("Getter and Setter", function () {
            
            var oDraw;
            var Feature;
            var opt = {"features":["toto"]};
            
            beforeEach(function(){
                oDraw = new nsVmap.nsToolsManager.Draw(opt);
                Feature = [];
            });
            afterEach(function(){
                oDraw = {};
                Feature = [];
            });
            
            it("object --> Feature (getter only)",function(){
                expect(oDraw.getFeatures().length).toEqual(1);
            });
            
            it("object --> Feature (getter and setter)",function(){
                Feature = ["Toto","tata","Vador"];
                oDraw.setFeatures(Feature);
                expect(oDraw.getFeatures().length).toEqual(3);
                expect(oDraw.getFeatures()).toEqual(Feature);
            });
            it("object --> Fields (getter only)",function(){
                expect(oDraw.getFields().length).toEqual(11);
            });
            
            it("object --> Fields (getter and setter)",function(){
                Feature = ["Toto","tata","Vador"];
                oDraw.setFields(Feature);
                expect(oDraw.getFields().length).toEqual(3);
                expect(oDraw.getFields()).toEqual(Feature);
            });
        });
    });
});
/* global goog, nsVmap, expect */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit Integration on measure.js 
 * All the Integration Tests of nsVmap.nsToolsManager.Measure class
 */
goog.provide('nsVmap.nsToolsManager.Measure.Integration');

goog.require('oVmap');
goog.require('nsVmap.nsToolsManager.Measure');

console.log("Integration - nsVmap.nsToolsManager.Measure");

describe("Integration -", function () {
    describe("nsVmap.nsToolsManager.Measure :", function () {

        describe("Getter and Setter", function () {
            
            var oMeasure;
            var Feature;
            
            beforeEach(function(){
                oMeasure = new nsVmap.nsToolsManager.Measure([]);
                Feature = [];
            });
            afterEach(function(){
                oMeasure = {};
                Feature = [];
            });
            
            it("object --> Feature (getter only)",function(){
                expect(oMeasure.getTools()).toEqual([]);
            });
            
            it("object --> Feature (getter and setter)",function(){
                Feature = ["Toto","tata","Vador"];
                oMeasure.setTools(Feature);
                expect(oMeasure.getTools().length).toEqual(3);
                expect(oMeasure.getTools()).toEqual(Feature);
            });
        });
    });
});
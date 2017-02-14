/* global goog, nsVmap, expect */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: test Integration of select.js
 * all the test Integration on nsVmap.nsToolsManager.Select Class
 */
goog.provide('nsVmap.nsToolsManager.Select.Integration');

goog.require('oVmap');
goog.require('nsVmap.nsToolsManager.Select');

console.log("Integration - nsVmap.nsToolsManager.Select");

describe("Integration -", function () {
    describe("nsVmap.nsToolsManager.Select :", function () {
        describe("Getter and Setter", function () {

            var oSelect;
            var Feature;
            
            beforeEach(function(){
                oSelect = new nsVmap.nsToolsManager.Select();;
                Feature = [];
            });
            afterEach(function(){
                oSelect = {};
                Feature = [];
            });
            
            it("object --> Feature (getter only)",function(){
                expect(oSelect.getFeaturesSelected()).toEqual([]);
            });
            
            it("object --> Feature (getter and setter)",function(){
                Feature = ["Toto","tata","Vador"];
                oSelect.setFeaturesSelected(Feature);
                expect(oSelect.getFeaturesSelected().length).toEqual(3);
                expect(oSelect.getFeaturesSelected()).toEqual(Feature);
            });
            
            it("method --> pushFeaturesSelected (verification in two times)",function(){
                expect(oSelect.getFeaturesSelected()).toEqual([]);
                Feature = ["Toto"];
                oSelect.setFeaturesSelected(Feature);
                expect(oSelect.getFeaturesSelected().length).toEqual(1);
                expect(oSelect.getFeaturesSelected()).toEqual(Feature);
                Feature = ["tata","Vador"];
                oSelect.pushFeaturesSelected(Feature);
                expect(oSelect.getFeaturesSelected().length).toEqual(2);
                expect(oSelect.getFeaturesSelected()).toEqual(["Toto",["tata","Vador"]]);
            });

        });
    });
    describe("here my first Scenario on select.js", function () {
        describe("it's the story of a man", function () {

            it("who walk in the street {{(EC)}}", function () {
                expect(true).toBe(true);
            });

        });
    });
});

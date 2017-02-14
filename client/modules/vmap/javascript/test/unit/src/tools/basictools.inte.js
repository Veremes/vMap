/* global goog, nsVmap, expect */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Integration test on basictools.js 
 * All the Integration Tests of nsVmap.nsToolsManager.BasicTools class
 */
goog.provide('nsVmap.nsToolsManager.BasicTools.Integration');

goog.require('oVmap');
goog.require('nsVmap.nsToolsManager.BasicTools');

console.log("Integration - nsVmap.nsToolsManager.BasicTools");

describe("Integration -", function () {
    describe("nsVmap.nsToolsManager.BasicTools :", function () {
        describe("Getter and Setter", function () {
          
            var oBasicTools;
            
            beforeEach(function () {
                oBasicTools = new nsVmap.nsToolsManager.BasicTools();
            });
            afterEach(function () {
                oBasicTools = {};
            });
            
            it("method --> getSelect (getter only)", function(){
                expect(oBasicTools.getSelect() instanceof nsVmap.nsToolsManager.Select).toEqual(true);
            });
            
        });
    });
});
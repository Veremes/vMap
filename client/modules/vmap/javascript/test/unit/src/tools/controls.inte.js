/* global goog, nsVmap, expect, spyOn, Dummy */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on controls.js 
 * All the Integration Tests of nsVmap.nsMapManager.nsToolsModal.Controls class
 */
goog.provide('nsVmap.nsToolsManager.Controls.Integration');

goog.require('oVmap');
goog.require('nsVmap.nsToolsManager.Controls');

console.log("Integration - nsVmap.nsToolsManager.Controls");

describe("Integration -", function () {
    describe("nsVmap.nsToolManager.Controls :", function () {

        describe("Getter and Setter", function () {
          
            var oToolManager;
            var Tool;
            var Tool2;
            
            beforeEach(function () {
                Tool = ["Attribution", "FullScreen", "MousePosition", "OverviewMap", "Rotate", "ScaleLine", "Zoom", "ZoomSlider", "ZoomtoExtent"];
                Tool2 = ["FullScreen", "toto", "MousePosition", "Zoom", "ZoomSlider", "ZoomtoExtent"];
                oToolManager = new nsVmap.nsToolsManager.Controls(Tool);
            });
            afterEach(function () {
                Tool = {};
                Tool2 = {};
                oToolManager = {};
            });

            it("object --> ToolList", function () {
                expect(oToolManager.getControlsList()).toEqual(Tool);
                expect(oToolManager.getControlsList()).not.toEqual(Tool2);
                
                spyOn(oToolManager,"addControl").and.callFake(Dummy);
                oToolManager.setControlsList(Tool2);
                
                expect(oToolManager.addControl).toHaveBeenCalled();
                expect(oToolManager.getControlsList()).not.toEqual(Tool);
                expect(oToolManager.getControlsList()).toEqual(Tool2);
            });
        });
    });
});
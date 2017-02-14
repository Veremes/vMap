/* global goog, oVmap, spyOn, expect, Dummy, FileReader */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: test E2E with library of mapmanager.js
 * all the test E2E on nsVmap.nsMapManager.MapManager Class
 */
goog.provide('nsVmap.nsMapManager.MapManager.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsMapManager.MapManager');

console.log("Unit - nsVmap.nsMapManager.MapManager");

describe("Unit -", function () {
    describe("nsVmap.nsMapManager.MapManager:", function () {
        describe("class method :",function(){
            
            var oMapManager;
            
            beforeEach(function(){
                oMapManager = oVmap.getMapManager();
            });
            afterEach(function () {
               oMapManager = null;
            });

            it("method --> 'loadMapTools'",function(){
                spyOn(oMapManager, 'loadLayersTools').and.callFake(Dummy);
                spyOn(oVmap.module,"directive").and.callFake(Dummy);
                oMapManager.loadMapTools("data/map-catalog.json");
                expect(oMapManager.loadLayersTools).toHaveBeenCalled();
            });
            it("method --> 'loadLayersTools'",function(){
                spyOn(oVmap.module,"directive").and.callFake(Dummy);
                oMapManager.loadLayersTools("data/map.json");
                expect(oVmap.module.directive).toHaveBeenCalled();
            });
            it("method --> 'loadMap'",function(){
                var el = document.createElement('div');
                spyOn(el,"getAttribute").and.returnValue("URLtoTheFile");
                spyOn(oVmap.getMapManager(),"ajaxGetLayersTree").and.returnValue("LayerTreeFromtheFile");
                spyOn(oVmap.getMapManager(),"setLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"reloadMap").and.callFake(Dummy);
                oMapManager.loadMap(el);
                expect(el.getAttribute).toHaveBeenCalledWith("url");
                expect(oVmap.getMapManager().ajaxGetLayersTree).toHaveBeenCalledWith("URLtoTheFile");
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalledWith("LayerTreeFromtheFile");
                expect(oVmap.getMapManager().reloadMap).toHaveBeenCalled();
            });
            it("method --> 'addLayer' (queryable)",function(){
                var oLayer= {
                    "layerName"     : "Toto's Layer",
                    "layerTitle"    : "Toto's Layer",
                    "layerType"     : "tilewms",
                    "serviceName"   : "Toto's Layer",
                    "url"           : "http://urlofToto.com/",
                    "queryable"     : "true",
                    "key"           : "Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3",
                    "culture"       : "en-US"
                };
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue([]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getCenter").and.returnValue([0,0]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getResolution").and.returnValue(2);
                spyOn(oVmap.getMapManager(),"setLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"reloadMap").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setCenter").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setResolution").and.callFake(Dummy);
                spyOn(oVmap,"resizeLayerTools").and.callFake(Dummy);
                oMapManager.addLayer(oLayer);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getResolution).toHaveBeenCalled();
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(oVmap.getMapManager().reloadMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0,0]);
                expect(oVmap.getMap().getOLMap().getView().setResolution).toHaveBeenCalledWith(2);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(false);
            });
            it("method --> 'addLayer' (tilewms no queryable and isn't in tree)",function(){
                var oLayer= {
                    "layerName"     : "Toto's Layer",
                    "layerTitle"    : "Toto's Layer",
                    "layerType"     : "tilewms",
                    "serviceName"   : "Toto's Layer",
                    "url"           : "http://urlofToto.com/",
                    "queryable"     : "false",
                    "key"           : "Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3",
                    "culture"       : "en-US"
                };
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue([]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getCenter").and.returnValue([0,0]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getResolution").and.returnValue(2);
                spyOn(oVmap.getMapManager(),"setLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"reloadMap").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setCenter").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setResolution").and.callFake(Dummy);
                spyOn(oVmap,"resizeLayerTools").and.callFake(Dummy);
                oMapManager.addLayer(oLayer);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getResolution).toHaveBeenCalled();
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(oVmap.getMapManager().reloadMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0,0]);
                expect(oVmap.getMap().getOLMap().getView().setResolution).toHaveBeenCalledWith(2);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(false);
            });
            it("method --> 'addLayer' (tilewms no queryable and is in tree)",function(){
                var oLayer= {
                    "layerName"     : "Toto's Layer",
                    "layerTitle"    : "Toto's Layer",
                    "layerType"     : "tilewms",
                    "serviceName"   : "Couches Geobretagne",
                    "url"           : "http://urlofToto.com/",
                    "queryable"     : "false",
                    "key"           : "Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3",
                    "culture"       : "en-US"
                };
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue([]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getCenter").and.returnValue([0,0]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getResolution").and.returnValue(2);
                spyOn(oVmap.getMapManager(),"setLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"reloadMap").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setCenter").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setResolution").and.callFake(Dummy);
                spyOn(oVmap,"resizeLayerTools").and.callFake(Dummy);
                oMapManager.addLayer(oLayer);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getResolution).toHaveBeenCalled();
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(oVmap.getMapManager().reloadMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0,0]);
                expect(oVmap.getMap().getOLMap().getView().setResolution).toHaveBeenCalledWith(2);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(false);
            });
            it("method --> 'addLayer' (imagewms no queryable and isn't in tree)",function(){
                var oLayer= {
                    "layerName"     : "Toto's Layer",
                    "layerTitle"    : "Toto's Layer",
                    "layerType"     : "imagewms",
                    "serviceName"   : "Toto's Layer",
                    "url"           : "http://urlofToto.com/",
                    "queryable"     : "false",
                    "key"           : "Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3",
                    "culture"       : "en-US"
                };
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue([]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getCenter").and.returnValue([0,0]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getResolution").and.returnValue(2);
                spyOn(oVmap.getMapManager(),"setLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"reloadMap").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setCenter").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setResolution").and.callFake(Dummy);
                spyOn(oVmap,"resizeLayerTools").and.callFake(Dummy);
                oMapManager.addLayer(oLayer);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getResolution).toHaveBeenCalled();
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(oVmap.getMapManager().reloadMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0,0]);
                expect(oVmap.getMap().getOLMap().getView().setResolution).toHaveBeenCalledWith(2);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(false);
            });
            it("method --> 'addLayer' (imagewms no queryable and is in tree)",function(){
                var oLayer= {
                    "layerName"     : "Toto's Layer",
                    "layerTitle"    : "Toto's Layer",
                    "layerType"     : "imagewms",
                    "serviceName"   : "Couches Geobretagne",
                    "url"           : "http://urlofToto.com/",
                    "queryable"     : "false",
                    "key"           : "Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3",
                    "culture"       : "en-US"
                };
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue([]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getCenter").and.returnValue([0,0]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getResolution").and.returnValue(2);
                spyOn(oVmap.getMapManager(),"setLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"reloadMap").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setCenter").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setResolution").and.callFake(Dummy);
                spyOn(oVmap,"resizeLayerTools").and.callFake(Dummy);
                oMapManager.addLayer(oLayer);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getResolution).toHaveBeenCalled();
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(oVmap.getMapManager().reloadMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0,0]);
                expect(oVmap.getMap().getOLMap().getView().setResolution).toHaveBeenCalledWith(2);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(false);
            });
            it("method --> 'addLayer' (osm no queryable and isn't in tree)",function(){
                var oLayer= {
                    "layerName"     : "Toto's Layer",
                    "layerTitle"    : "Toto's Layer",
                    "layerType"     : "osm",
                    "serviceName"   : "Toto's Layer",
                    "url"           : "http://urlofToto.com/",
                    "queryable"     : "false",
                    "key"           : "Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3",
                    "culture"       : "en-US"
                };
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue([]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getCenter").and.returnValue([0,0]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getResolution").and.returnValue(2);
                spyOn(oVmap.getMapManager(),"setLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"reloadMap").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setCenter").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setResolution").and.callFake(Dummy);
                spyOn(oVmap,"resizeLayerTools").and.callFake(Dummy);
                oMapManager.addLayer(oLayer);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getResolution).toHaveBeenCalled();
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(oVmap.getMapManager().reloadMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0,0]);
                expect(oVmap.getMap().getOLMap().getView().setResolution).toHaveBeenCalledWith(2);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(false);
            });
            it("method --> 'addLayer' (osm no queryable and is in tree)",function(){
                var oLayer= {
                    "layerName"     : "Toto's Layer",
                    "layerTitle"    : "Toto's Layer",
                    "layerType"     : "osm",
                    "serviceName"   : "Couches Geobretagne",
                    "url"           : "http://urlofToto.com/",
                    "queryable"     : "false",
                    "key"           : "Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3",
                    "culture"       : "en-US"
                };
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue([]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getCenter").and.returnValue([0,0]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getResolution").and.returnValue(2);
                spyOn(oVmap.getMapManager(),"setLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"reloadMap").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setCenter").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setResolution").and.callFake(Dummy);
                spyOn(oVmap,"resizeLayerTools").and.callFake(Dummy);
                oMapManager.addLayer(oLayer);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getResolution).toHaveBeenCalled();
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(oVmap.getMapManager().reloadMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0,0]);
                expect(oVmap.getMap().getOLMap().getView().setResolution).toHaveBeenCalledWith(2);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(false);
            });
            it("method --> 'addLayer' (bing no queryable and isn't in tree)",function(){
                var oLayer= {
                    "layerName"     : "Toto's Layer",
                    "layerTitle"    : "Toto's Layer",
                    "layerType"     : "bing",
                    "serviceName"   : "Toto's Layer",
                    "url"           : "http://urlofToto.com/",
                    "queryable"     : "false",
                    "key"           : "Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3",
                    "culture"       : "en-US"
                };
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue([]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getCenter").and.returnValue([0,0]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getResolution").and.returnValue(2);
                spyOn(oVmap.getMapManager(),"setLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"reloadMap").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setCenter").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setResolution").and.callFake(Dummy);
                spyOn(oVmap,"resizeLayerTools").and.callFake(Dummy);
                oMapManager.addLayer(oLayer);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getResolution).toHaveBeenCalled();
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(oVmap.getMapManager().reloadMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0,0]);
                expect(oVmap.getMap().getOLMap().getView().setResolution).toHaveBeenCalledWith(2);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(false);
            });
            it("method --> 'addLayer' (bing no queryable and is in tree)",function(){
                var oLayer= {
                    "layerName"     : "Toto's Layer",
                    "layerTitle"    : "Toto's Layer",
                    "layerType"     : "bing",
                    "serviceName"   : "Couches Geobretagne",
                    "url"           : "http://urlofToto.com/",
                    "queryable"     : "false",
                    "key"           : "Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3",
                    "culture"       : "en-US"
                };
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue([]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getCenter").and.returnValue([0,0]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getResolution").and.returnValue(2);
                spyOn(oVmap.getMapManager(),"setLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"reloadMap").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setCenter").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setResolution").and.callFake(Dummy);
                spyOn(oVmap,"resizeLayerTools").and.callFake(Dummy);
                oMapManager.addLayer(oLayer);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getResolution).toHaveBeenCalled();
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(oVmap.getMapManager().reloadMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0,0]);
                expect(oVmap.getMap().getOLMap().getView().setResolution).toHaveBeenCalledWith(2);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(false);
            });
            it("method --> 'addLayer' (wmts no queryable and isn't in tree)",function(){
                var oLayer= {
                    "layerName"     : "Toto's Layer",
                    "layerTitle"    : "Toto's Layer",
                    "layerType"     : "wmts",
                    "serviceName"   : "Toto's Layer",
                    "url"           : "http://urlofToto.com/",
                    "queryable"     : "false",
                    "key"           : "Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3",
                    "culture"       : "en-US"
                };
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue([]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getCenter").and.returnValue([0,0]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getResolution").and.returnValue(2);
                spyOn(oVmap.getMapManager(),"setLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"reloadMap").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setCenter").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setResolution").and.callFake(Dummy);
                spyOn(oVmap,"resizeLayerTools").and.callFake(Dummy);
                oMapManager.addLayer(oLayer);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getResolution).toHaveBeenCalled();
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(oVmap.getMapManager().reloadMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0,0]);
                expect(oVmap.getMap().getOLMap().getView().setResolution).toHaveBeenCalledWith(2);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(false);
            });
            it("method --> 'addLayer' (wmts no queryable and is in tree)",function(){
                var oLayer= {
                    "layerName"     : "Toto's Layer",
                    "layerTitle"    : "Toto's Layer",
                    "layerType"     : "wmts",
                    "serviceName"   : "Couches Geobretagne",
                    "url"           : "http://urlofToto.com/",
                    "queryable"     : "false",
                    "key"           : "Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3",
                    "culture"       : "en-US"
                };
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue([]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getCenter").and.returnValue([0,0]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getResolution").and.returnValue(2);
                spyOn(oVmap.getMapManager(),"setLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"reloadMap").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setCenter").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setResolution").and.callFake(Dummy);
                spyOn(oVmap,"resizeLayerTools").and.callFake(Dummy);
                oMapManager.addLayer(oLayer);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getResolution).toHaveBeenCalled();
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(oVmap.getMapManager().reloadMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0,0]);
                expect(oVmap.getMap().getOLMap().getView().setResolution).toHaveBeenCalledWith(2);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(false);
            });
            it("method --> 'addLayer' (imagevector no queryable and isn't in tree)",function(){
                var oLayer= {
                    "layerName"     : "Toto's Layer",
                    "layerTitle"    : "Toto's Layer",
                    "layerType"     : "imagevector",
                    "serviceName"   : "Toto's Layer",
                    "url"           : "http://urlofToto.com/",
                    "queryable"     : "false",
                    "key"           : "Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3",
                    "culture"       : "en-US"
                };
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue([]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getCenter").and.returnValue([0,0]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getResolution").and.returnValue(2);
                spyOn(oVmap.getMapManager(),"setLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"reloadMap").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setCenter").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setResolution").and.callFake(Dummy);
                spyOn(oVmap,"resizeLayerTools").and.callFake(Dummy);
                oMapManager.addLayer(oLayer);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getResolution).toHaveBeenCalled();
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(oVmap.getMapManager().reloadMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0,0]);
                expect(oVmap.getMap().getOLMap().getView().setResolution).toHaveBeenCalledWith(2);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(false);
            });
            it("method --> 'addLayer' (imagevector no queryable and is in tree)",function(){
                var oLayer= {
                    "layerName"     : "Toto's Layer",
                    "layerTitle"    : "Toto's Layer",
                    "layerType"     : "imagevector",
                    "serviceName"   : "Couches Geobretagne",
                    "url"           : "http://urlofToto.com/",
                    "queryable"     : "false",
                    "key"           : "Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3",
                    "culture"       : "en-US"
                };
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue([]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getCenter").and.returnValue([0,0]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getResolution").and.returnValue(2);
                spyOn(oVmap.getMapManager(),"setLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"reloadMap").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setCenter").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setResolution").and.callFake(Dummy);
                spyOn(oVmap,"resizeLayerTools").and.callFake(Dummy);
                oMapManager.addLayer(oLayer);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getResolution).toHaveBeenCalled();
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(oVmap.getMapManager().reloadMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0,0]);
                expect(oVmap.getMap().getOLMap().getView().setResolution).toHaveBeenCalledWith(2);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(false);
            });
            it("method --> 'addLayer' (Other)",function(){
                var oLayer= {
                    "layerName"     : "Toto's Layer",
                    "layerTitle"    : "Toto's Layer",
                    "layerType"     : "Other",
                    "serviceName"   : "Couches Geobretagne",
                    "url"           : "http://urlofToto.com/",
                    "queryable"     : "false",
                    "key"           : "Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3",
                    "culture"       : "en-US"
                };
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue([]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getCenter").and.returnValue([0,0]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getResolution").and.returnValue(2);
                spyOn(oVmap.getMapManager(),"setLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"reloadMap").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setCenter").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setResolution").and.callFake(Dummy);
                spyOn(oVmap,"resizeLayerTools").and.callFake(Dummy);
                spyOn(console,'error').and.callFake(Dummy);
                oMapManager.addLayer(oLayer);
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getResolution).toHaveBeenCalled();
                expect(oVmap.getMapManager().setLayersTree).toHaveBeenCalled();
                expect(oVmap.getMapManager().reloadMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0,0]);
                expect(oVmap.getMap().getOLMap().getView().setResolution).toHaveBeenCalledWith(2);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(false);
                expect(console.error).toHaveBeenCalledWith("type :\"Other\" non pris en compte");
            });
            it("method --> 'removeLayer'",function(){
                var tree = oMapManager.getLayersTree();
                var layer = tree['children'][2]['children'][0]['olLayer'];
                spyOn(tree['children'][2]['children'],"splice").and.callFake(Dummy);
                spyOn(tree['children'],"splice").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"getCenter").and.returnValue([0,0]);
                spyOn(oVmap.getMap().getOLMap().getView(),"getZoom").and.returnValue(2);
                spyOn(oVmap.getMap().getOLMap(),"removeLayer").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue([]);
                spyOn(oMapManager,"reloadMap").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setCenter").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getView(),"setZoom").and.callFake(Dummy);
                oMapManager.removeLayer(layer);
                expect(tree['children'][2]['children'].splice).toHaveBeenCalledWith(0,1);
                expect(oVmap.getMap().getOLMap().getView().getCenter).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getZoom).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().removeLayer).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getLayers().getArray).toHaveBeenCalled();
                expect(oMapManager.reloadMap).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0,0]);
                expect(oVmap.getMap().getOLMap().getView().setZoom).toHaveBeenCalledWith(2);
            });
            it("method --> 'addWMSLayerFromHTML' (Html difference)", function () {
                var element = document.createElement('div');
                var index = 0;
                var Attr = {
                    'layerName': "Toto's Layer",
                    'layerTitle': "Toto's Layer",
                    'queryable': 'false',
                    'isProjectionCompatible' : 'false',
                    'serviceTitle' : "Toto's Service"
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                var onMag = {
                    "options" : [document.createElement('option'),document.createElement('option')],
                    "selectedIndex" : 0
                }; 
                spyOn(document, "getElementById").and.returnValue(onMag);
                spyOn(oMapManager,"addLayer").and.callFake(Dummy);
                spyOn(window,"confirm").and.returnValue(true);
                spyOn($.fn,"val").and.callFake(function () {
                    index++;
                    return "toto's URL" + index;
                });
                spyOn($.fn,"text").and.returnValue("title of service");
                oMapManager.addWMSLayerFromHTML(element);
                expect(element.getAttribute.calls.count()).toEqual(5);
                expect(document.getElementById).toHaveBeenCalled;
                expect(oMapManager.addLayer).toHaveBeenCalled();
                expect($.fn.val.calls.count()).toEqual(3);
            });
            it("method --> 'addWMSLayerFromHTML' (no Html difference)", function () {
                var element = document.createElement('div');
                var Attr = {
                    'layerName': "Toto's Layer",
                    'layerTitle': "Toto's Layer",
                    'queryable': 'false',
                    'isProjectionCompatible' : 'false',
                    'serviceTitle' : "Toto's Service"
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                var onMag = {
                    "options" : [document.createElement('option'),document.createElement('option')],
                    "selectedIndex" : 0
                }; 
                spyOn(document, "getElementById").and.returnValue(onMag);
                spyOn(oMapManager,"addLayer").and.callFake(Dummy);
                spyOn(window,"confirm").and.returnValue(true);
                spyOn($.fn,"val").and.returnValue("Toto's URL");
                spyOn($.fn,"text").and.returnValue("title of service");
                oMapManager.addWMSLayerFromHTML(element);
                expect(element.getAttribute.calls.count()).toEqual(4);
                expect(document.getElementById).toHaveBeenCalled;
                expect(oMapManager.addLayer).toHaveBeenCalled();
                expect($.fn.val.calls.count()).toEqual(3);
            });
            it("method --> 'addWMSLayerFromHTML' (confirm 'no')", function () {
                var element = document.createElement('div');
                var Attr = {
                    'layerName': "Toto's Layer",
                    'layerTitle': "Toto's Layer",
                    'queryable': 'false',
                    'isProjectionCompatible' : 'false',
                    'serviceTitle' : "Toto's Service"
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                var onMag = {
                    "options" : [document.createElement('option'),document.createElement('option')],
                    "selectedIndex" : 0
                }; 
                spyOn(document, "getElementById").and.returnValue(onMag);
                spyOn(oMapManager,"addLayer").and.callFake(Dummy);
                spyOn(window,"confirm").and.returnValue(false);
                spyOn($.fn,"val").and.returnValue("Toto's URL");
                spyOn($.fn,"text").and.returnValue("title of service");
                expect(oMapManager.addWMSLayerFromHTML(element)).toEqual(0);
                expect(element.getAttribute.calls.count()).toEqual(4);
                expect(document.getElementById).not.toHaveBeenCalled;
                expect(oMapManager.addLayer).not.toHaveBeenCalled();
                expect($.fn.val.calls.count()).toEqual(1);
            });
            it("method --> 'addWMSLayerFromHTML' (others branches)", function () {
                var element = document.createElement('div');
                var Attr = {
                    'layerName': "Toto's Layer",
                    'layerTitle': "Toto's Layer",
                    'queryable': 'false',
                    'isProjectionCompatible' : 'true',
                    'serviceTitle' : "Toto's Service"
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                var onMag = {
                    "options" : [document.createElement('option'),document.createElement('option')],
                    "selectedIndex" : 0
                }; 
                spyOn(document, "getElementById").and.returnValue(onMag);
                spyOn(oMapManager,"addLayer").and.callFake(Dummy);
                spyOn(window,"confirm").and.returnValue(false);
                spyOn($.fn,"val").and.returnValue("Toto's URL?");
                spyOn($.fn,"text").and.returnValue("title of service");
                oMapManager.addWMSLayerFromHTML(element);
                expect(element.getAttribute.calls.count()).toEqual(4);
                expect(document.getElementById).toHaveBeenCalled;
                expect(oMapManager.addLayer).toHaveBeenCalled();
                expect($.fn.val.calls.count()).toEqual(3);
            });
            it("method --> 'addOSMLayerFromHTML' (with attribute)",function(){
                var element = document.createElement('div');
                var Attr = {
                    'name': "Toto's Layer",
                    'url': "Toto's URL"
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oMapManager,"addLayer").and.callFake(Dummy);
                spyOn($.fn,"empty").and.callFake(Dummy);
                oMapManager.addOSMLayerFromHTML(element);
                expect(element.getAttribute.calls.count()).toEqual(2);
                expect($.fn.empty).toHaveBeenCalled();
                expect(oMapManager.addLayer).toHaveBeenCalled();
            });
            it("method --> 'addOSMLayerFromHTML' (with null)",function(){
                var element = document.createElement('div');
                var Attr = {
                    'name': null,
                    'url': null
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oMapManager,"addLayer").and.callFake(Dummy);
                spyOn($.fn,"empty").and.callFake(Dummy);
                spyOn($.fn,"val").and.callFake(Dummy);
                oMapManager.addOSMLayerFromHTML(element);
                expect(element.getAttribute.calls.count()).toEqual(2);
                expect($.fn.empty).toHaveBeenCalled();
                expect($.fn.val.calls.count()).toEqual(2);
                expect(oMapManager.addLayer).toHaveBeenCalled();
            });
            it("method --> 'addOSMLayerFromHTML' (with empty string)",function(){
                var element = document.createElement('div');
                var Attr = {
                    'name': "",
                    'url': ""
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oMapManager,"addLayer").and.callFake(Dummy);
                spyOn(oVmap,"displayError").and.callFake(Dummy);
                spyOn($.fn,"empty").and.callFake(Dummy);
                expect(oMapManager.addOSMLayerFromHTML(element)).toEqual(0);
                expect(element.getAttribute.calls.count()).toEqual(2);
                expect($.fn.empty).toHaveBeenCalled();
                expect(oMapManager.addLayer).not.toHaveBeenCalled();
            });
            it("method --> 'addBingLayerFromHTML' (with attribute)",function(){
                var element = document.createElement('div');
                var Attr = {
                    'key': "Toto's key",
                    'imagerySet': "Toto's image",
                    'culture':"Toto's Lang"
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oMapManager,"addLayer").and.callFake(Dummy);
                spyOn($.fn,"empty").and.callFake(Dummy);
                oMapManager.addBingLayerFromHTML(element);
                expect(element.getAttribute.calls.count()).toEqual(3);
                expect($.fn.empty).toHaveBeenCalled();
                expect(oMapManager.addLayer).toHaveBeenCalled();
            });
            it("method --> 'addBingLayerFromHTML' (with null)",function(){
                var element = document.createElement('div');
                var Attr = {
                    'key': null,
                    'imagerySet': null,
                    'culture': null
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oMapManager,"addLayer").and.callFake(Dummy);
                spyOn($.fn,"empty").and.callFake(Dummy);
                spyOn($.fn,"val").and.callFake(Dummy);
                oMapManager.addBingLayerFromHTML(element);
                expect(element.getAttribute.calls.count()).toEqual(3);
                expect($.fn.empty).toHaveBeenCalled();
                expect($.fn.val.calls.count()).toEqual(3);
                expect(oMapManager.addLayer).toHaveBeenCalled();
            });
            it("method --> 'addBingLayerFromHTML' (with empty string)",function(){
                var element = document.createElement('div');
                var Attr = {
                    'key': "",
                    'imagerySet': "",
                    'culture': ""
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oMapManager,"addLayer").and.callFake(Dummy);
                spyOn($.fn,"empty").and.callFake(Dummy);
                spyOn(oVmap,"displayError").and.callFake(Dummy);
                expect(oMapManager.addBingLayerFromHTML(element)).toEqual(0);
                expect(element.getAttribute.calls.count()).toEqual(3);
                expect($.fn.empty).toHaveBeenCalled();
                expect(oMapManager.addLayer).not.toHaveBeenCalled();
            });
            it("method --> 'addIGNLayerFromHTML' (with attribute)",function(){
                var element = document.createElement('div');
                var Attr = {
                    'key': "Toto's key",
                    'layer': "Toto's layer",
                    'name':"Toto's name"
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oMapManager,"addLayer").and.callFake(Dummy);
                oMapManager.addIGNLayerFromHTML(element);
                expect(element.getAttribute.calls.count()).toEqual(3);
                expect(oMapManager.addLayer).toHaveBeenCalled();
            });
            it("method --> 'addIGNLayerFromHTML' (with null)",function(){
                var element = document.createElement('div');
                var Attr = {
                    'key': null,
                    'layer': null,
                    'name': null
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oMapManager,"addLayer").and.callFake(Dummy);
                spyOn($.fn,"val").and.callFake(Dummy);
                oMapManager.addIGNLayerFromHTML(element);
                expect(element.getAttribute.calls.count()).toEqual(3);
                expect($.fn.val.calls.count()).toEqual(3);
                expect(oMapManager.addLayer).toHaveBeenCalled();
            });
            it("method --> 'addIGNLayerFromHTML' (with empty string)",function(){
                var element = document.createElement('div');
                var Attr = {
                    'key': "",
                    'layer': "",
                    'name': ""
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oMapManager,"addLayer").and.callFake(Dummy);
                spyOn(oVmap,"displayError").and.callFake(Dummy);
                expect(oMapManager.addIGNLayerFromHTML(element)).toEqual(0);
                expect(element.getAttribute.calls.count()).toEqual(3);
                expect(oMapManager.addLayer).not.toHaveBeenCalled();
            });
            it("method --> 'addLayerFromFileFromHTML' (with empty .val)", function(){
                var element = document.createElement('div');
                var Attr = {
                    'file-container': "Toto's File",
                    'url': "httToto's url"
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oMapManager,"addLayer").and.callFake(Dummy);
                spyOn(oVmap,"displayError").and.callFake(Dummy);
                spyOn($.fn,"val").and.returnValue("");
                spyOn($.fn,"empty").and.callFake(Dummy);
                spyOn(oVmap,"simuleClick").and.callFake(Dummy);
                oMapManager.addLayerFromFileFromHTML(element);
                expect($.fn.empty).toHaveBeenCalled();
                expect($.fn.val.calls.count()).toEqual(2);
                expect(oMapManager.addLayer).not.toHaveBeenCalled();
                expect(oVmap.displayError).toHaveBeenCalled();
                expect(oVmap.simuleClick).not.toHaveBeenCalled();
            });
            it("method --> 'addLayerFromFileFromHTML' (with url empty)", function(){
                var element = document.createElement('div');
                var Attr = {
                    'file-container': "Toto's File",
                    'url': ""
                };
                var File = {
                    'files' : ["toto","tata"]
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oMapManager,"addLayer").and.callFake(Dummy);
                spyOn(oVmap,"displayError").and.callFake(Dummy);
                spyOn($.fn,"val").and.returnValue("Toto's Val");
                spyOn($.fn,"empty").and.callFake(Dummy);
                spyOn(oVmap,"simuleClick").and.callFake(Dummy);
                spyOn(document,"getElementById").and.returnValue(File);
                spyOn(FileReader.prototype,"readAsText").and.callFake(Dummy);
                oMapManager.addLayerFromFileFromHTML(element);
                expect($.fn.empty).toHaveBeenCalled();
                expect($.fn.val.calls.count()).toEqual(2);
                expect(document.getElementById).toHaveBeenCalled();
                expect(oVmap.displayError).not.toHaveBeenCalled();
                expect(oVmap.simuleClick).toHaveBeenCalled();
            });
            it("method --> 'addLayerFromFileFromHTML' (with files.length = 0)", function(){
                var element = document.createElement('div');
                var Attr = {
                    'file-container': "Toto's File",
                    'url': ""
                };
                var File = {
                    'files' : []
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oMapManager,"addLayer").and.callFake(Dummy);
                spyOn(oVmap,"displayError").and.callFake(Dummy);
                spyOn($.fn,"val").and.returnValue("Toto's Val");
                spyOn($.fn,"empty").and.callFake(Dummy);
                spyOn(oVmap,"simuleClick").and.callFake(Dummy);
                spyOn(document,"getElementById").and.returnValue(File);
                oMapManager.addLayerFromFileFromHTML(element);
                expect($.fn.empty).toHaveBeenCalled();
                expect($.fn.val.calls.count()).toEqual(2);
                expect(document.getElementById).toHaveBeenCalled();
                expect(oVmap.displayError).toHaveBeenCalled();
                expect(oVmap.simuleClick).not.toHaveBeenCalled();
            });
            it("method --> 'addLayerFromFileFromHTML' (file and url empty)", function(){
                var element = document.createElement('div');
                var Attr = {
                    'file-container': "",
                    'url': ""
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oVmap,"displayError").and.callFake(Dummy);
                spyOn($.fn,"val").and.returnValue("Toto's Val");
                spyOn($.fn,"empty").and.callFake(Dummy);
                spyOn(oVmap,"simuleClick").and.callFake(Dummy);
                oMapManager.addLayerFromFileFromHTML(element);
                expect($.fn.empty).toHaveBeenCalled();
                expect($.fn.val.calls.count()).toEqual(2);
                expect(oVmap.displayError).toHaveBeenCalled();
                expect(oVmap.simuleClick).not.toHaveBeenCalled();
            });
            it("method --> 'loadMapFromFile' (with file empty)", function(){
                var element = document.createElement('div');
                var Attr = {
                    'file-container': "",
                    'url': "www.lesitedetoto.fr"
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oVmap,"displayError").and.callFake(Dummy);
                spyOn($.fn,"empty").and.callFake(Dummy);
                spyOn(oVmap,"simuleClick").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"ajaxGetLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"setLayersTree").and.callFake(Dummy);
                spyOn(oVmap.getMapManager(),"reloadMap").and.callFake(Dummy);
                oMapManager.loadMapFromFile(element);
                expect($.fn.empty).toHaveBeenCalled();
                expect(oVmap.displayError).not.toHaveBeenCalled();
                expect(oVmap.simuleClick).toHaveBeenCalled();
            });
            it("method --> 'loadMapFromFile' (with url empty)", function(){
                var element = document.createElement('div');
                var Attr = {
                    'file-container': "Toto's File",
                    'url': ""
                };
                var File = {
                    'files' : ["toto","tata"]
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oVmap,"displayError").and.callFake(Dummy);
                spyOn($.fn,"empty").and.callFake(Dummy);
                spyOn(oVmap,"simuleClick").and.callFake(Dummy);
                spyOn(document,"getElementById").and.returnValue(File);
                spyOn(FileReader.prototype,"readAsText").and.callFake(Dummy);
                oMapManager.loadMapFromFile(element);
                expect($.fn.empty).toHaveBeenCalled();
                expect(document.getElementById).toHaveBeenCalled();
                expect(oVmap.displayError).not.toHaveBeenCalled();
                expect(oVmap.simuleClick).toHaveBeenCalled();
            });
            it("method --> 'loadMapFromFile' (with files.length = 0)", function(){
                var element = document.createElement('div');
                var Attr = {
                    'file-container': "Toto's File",
                    'url': ""
                };
                var File = {
                    'files' : []
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oVmap,"displayError").and.callFake(Dummy);
                spyOn($.fn,"empty").and.callFake(Dummy);
                spyOn(oVmap,"simuleClick").and.callFake(Dummy);
                spyOn(document,"getElementById").and.returnValue(File);
                oMapManager.loadMapFromFile(element);
                expect($.fn.empty).toHaveBeenCalled();
                expect(document.getElementById).toHaveBeenCalled();
                expect(oVmap.displayError).toHaveBeenCalled();
                expect(oVmap.simuleClick).not.toHaveBeenCalled();
            });
            it("method --> 'loadMapFromFile' (file and url empty)", function(){
                var element = document.createElement('div');
                var Attr = {
                    'file-container': "",
                    'url': ""
                };
                spyOn(element, "getAttribute").and.callFake(function (P) {
                    return Attr[P];
                });
                spyOn(oVmap,"displayError").and.callFake(Dummy);
                spyOn($.fn,"empty").and.callFake(Dummy);
                spyOn(oVmap,"simuleClick").and.callFake(Dummy);
                oMapManager.loadMapFromFile(element);
                expect($.fn.empty).toHaveBeenCalled();
                expect(oVmap.displayError).toHaveBeenCalled();
                expect(oVmap.simuleClick).not.toHaveBeenCalled();
            });
            it("method --> 'reloadMap'",function(){
                var element = document.createElement('div');
                spyOn(element,"dispatchEvent").and.callFake(Dummy);
                spyOn(document,"createEvent").and.callThrough();
                spyOn(document,"getElementById").and.returnValue(element);
                oMapManager.reloadMap();
                expect(element.dispatchEvent).toHaveBeenCalled();
            });
            it("method --> 'ajaxGetMapCatalog'",function(){
                spyOn($,"ajax").and.callThrough();
                oMapManager.ajaxGetMapCatalog("http://localhost:9876/__karma__/data/map-catalog.json");
                expect($.ajax).toHaveBeenCalled();
            });
            it("method --> 'ajaxGetLayersTree'",function(){
                spyOn($,"ajax").and.callThrough();
                oMapManager.ajaxGetLayersTree("http://localhost:9876/__karma__/data/map-catalog.json");
                expect($.ajax).toHaveBeenCalled();
            });
            it("method --> 'removeSelectionLayers' (selection)",function(){
                var obj = function(name){
                    this.name = name;
                };
                obj.prototype.get = function(){
                    return "selection";
                };
                var Layer = [new obj("toto"),new obj("tata"),new obj("riri")];
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue(Layer);
                spyOn(oVmap.getMap().getOLMap(),"removeLayer").and.callFake(Dummy);
                oMapManager.removeSelectionLayers();
                expect(oVmap.getMap().getOLMap().removeLayer.calls.count()).toEqual(3);
            });
            it("method --> 'removeSelectionLayers' (other)",function(){
                var obj = function(name){
                    this.name = name;
                };
                obj.prototype.get = function(){
                    return "other";
                };
                var Layer = [new obj("toto"),new obj("tata"),new obj("riri")];
                spyOn(oVmap.getMap().getOLMap().getLayers(),"getArray").and.returnValue(Layer);
                spyOn(oVmap.getMap().getOLMap(),"removeLayer").and.callFake(Dummy);
                oMapManager.removeSelectionLayers();
                expect(oVmap.getMap().getOLMap().removeLayer).not.toHaveBeenCalled();
            });
            it("method --> 'removeSelectionFeatures'",function(){
                var obj = function(name){
                    this.name = name;
                };
                var Layer = [new obj("toto"),new obj("tata"),new obj("riri")];
                spyOn(oVmap.getMap().getSelectionOverlay().getFeatures(),"getArray").and.returnValue(Layer);
                spyOn(oVmap.getMap().getSelectionOverlay(),"removeFeature").and.callFake(Dummy);
                oMapManager.removeSelectionFeatures();
                expect(oVmap.getMap().getSelectionOverlay().removeFeature.calls.count()).toEqual(3);
            });
            it("method --> 'collapseElement' ('in')",function(){
                var element = document.createElement('div');
                var element2 = [document.createElement('div')];
                spyOn(window,"$").and.returnValue(element2);
                spyOn(element ,"getAttribute").and.returnValue("in");
                spyOn(element2[0] ,"setAttribute").and.callFake(Dummy);
                spyOn(oVmap ,"resizeLayerTools").and.callFake(Dummy);
                oMapManager.collapseElement(element);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(true);
            });
            it("method --> 'collapseElement' (out)",function(){
                var element = document.createElement('div');
                var element2 = [document.createElement('div')];
                spyOn(window,"$").and.returnValue(element2);
                spyOn(element ,"getAttribute").and.returnValue("out");
                spyOn(element2[0] ,"setAttribute").and.callFake(Dummy);
                spyOn(oVmap ,"resizeLayerTools").and.callFake(Dummy);
                oMapManager.collapseElement(element);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(true);
            });
            it("method --> 'collapseElement' (other)",function(){
                var element = document.createElement('div');
                var element2 = [document.createElement('div')];
                spyOn(window,"$").and.returnValue(element2);
                spyOn(element ,"getAttribute").and.returnValue("chablagou");
                spyOn(element2[0] ,"setAttribute").and.callFake(Dummy);
                spyOn(oVmap ,"resizeLayerTools").and.callFake(Dummy);
                spyOn(console,"error").and.callFake(Dummy);
                oMapManager.collapseElement(element);
                expect(oVmap.resizeLayerTools).toHaveBeenCalledWith(true);
                expect(console.error).toHaveBeenCalled();
            });
        });
    });
});

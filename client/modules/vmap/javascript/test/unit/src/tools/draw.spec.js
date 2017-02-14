/* global goog, angular, spyOn, expect, oVmap, drawTooltipElement_, ol, Dummy, bootbox */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on Draw.js 
 * All the Units Tests of nsVmap.nsToolsManager.Draw class
 */
goog.provide('nsVmap.nsToolsManager.Draw.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsToolsManager.Draw');

console.log("Unit - nsVmap.nsToolsManager.Draw");

describe("Unit -", function () {
    describe("nsVmap.nsToolsManager.Draw :", function () {
        beforeEach(module('app'));
        describe("angular directive : 'appDraw'", function () {
            var scope;
            var el;
            var toTest = {};

            beforeEach(module('template/modules/draw.html'));

            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();

                el = angular.element(
                        '<div id="tools-container">' +
                        '<div id="Draw-tool" class="side-tool ng-isolate-scope" app-draw app-draw-map="::mainCtrl.map" app-draw-lang="mainCtrl.lang"></div>' +
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
                expect(toTest[0].children[0].textContent).toBe("Dessin");
                expect(toTest[0].children[0].tagName).toBe("A");
                expect(toTest[0].children[0].parentElement.attributes[2].localName).toBe("app-draw");
                expect(toTest[0].children.length).toEqual(2);
            });
        });
        describe("angular controller : 'AppdrawController'", function () {

            var scope = {};
            var ctrl = {};

            beforeEach(inject(function ($controller, $rootScope) {
                scope = $rootScope.$new();
                ctrl = $controller;
            }));
            afterEach(function () {
                scope = {};
                ctrl = {};
            });

            it("Instanciation", function () {
                spyOn(oVmap.getMap(), "getOLMap").and.callThrough();
                spyOn(document, "getElementById").and.returnValue(document.createElement('div'));
                var controller = ctrl('AppdrawController', {$scope: scope});
                expect(oVmap.getMap().getOLMap).toHaveBeenCalled();
                expect(document.getElementById).toHaveBeenCalledWith("geodesic");
            });

            it("method --> 'createDrawTooltip' (second if pass)", function () {
                var controller = ctrl('AppdrawController', {$scope: scope});
                var Feature = [];
                spyOn(document, "createElement").and.callThrough();
                controller.createDrawTooltip(Feature);
                expect(document.createElement).toHaveBeenCalledWith('div');
            });

            it("method --> 'createDrawTooltip' (second if not pass)", function () {
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(document, "createElement").and.callThrough();
                controller.createDrawTooltip();
                expect(document.createElement).toHaveBeenCalledWith('div');
            });

            it("method --> 'setFeatureTooltip' (first if pass)", function () {
                var Feature = {
                    'infoValues': undefined
                };
                Feature.get = function (P) {
                    return Feature[P];
                };
                var controller = ctrl('AppdrawController', {$scope: scope});
                expect(controller.setFeatureTooltip(Feature)).not.toBeDefined();
            });

            it("method --> 'setFeatureTooltip' (first if not pass)", function () {
                var Feature = {
                    'infoValues': {
                        'ShowName': "true",
                        'ShowVector': "true"
                    }
                };
                Feature.get = function (P) {
                    return Feature[P];
                };
                Feature.getGeometry = function () {
                    return new ol.geom.Point([0, 0]);
                };
                var controller = ctrl('AppdrawController', {$scope: scope});
                controller.drawTooltipElement_ = document.createElement('div');
                controller.drawTooltip_ = new ol.Overlay({
                    element: this.drawTooltipElement_,
                    offset: [0, -15],
                    positioning: 'bottom-center'
                });
                spyOn(controller, "showHideAnotations").and.callFake(Dummy);
                spyOn(controller, "createDrawTooltip").and.callFake(Dummy);
                spyOn(controller, "removeDrawsInteractions").and.callFake(Dummy);
                controller.setFeatureTooltip(Feature);
                expect(controller.showHideAnotations).toHaveBeenCalled();
                expect(controller.createDrawTooltip).toHaveBeenCalled();
                expect(controller.removeDrawsInteractions).toHaveBeenCalled();
            });

            it("method --> 'setFeatureTooltip' (others if pass)", function () {
                var Feature = {
                    'infoValues': {
                        'ShowName': "false",
                        'ShowVector': "false"
                    }
                };
                Feature.get = function (P) {
                    return Feature[P];
                };
                Feature.getGeometry = function () {
                    return new ol.geom.Point([0, 0]);
                };
                var controller = ctrl('AppdrawController', {$scope: scope});
                controller.drawTooltipElement_ = document.createElement('div');
                controller.drawTooltip_ = new ol.Overlay({
                    element: this.drawTooltipElement_,
                    offset: [0, -15],
                    positioning: 'bottom-center'
                });
                spyOn(controller, "showHideAnotations").and.callFake(Dummy);
                spyOn(controller, "createDrawTooltip").and.callFake(Dummy);
                spyOn(controller, "removeDrawsInteractions").and.callFake(Dummy);
                controller.setFeatureTooltip(Feature);
                expect(controller.showHideAnotations).toHaveBeenCalled();
                expect(controller.createDrawTooltip).toHaveBeenCalled();
                expect(controller.removeDrawsInteractions).toHaveBeenCalled();
            });

            it("method --> 'getTooltipPosition' (Polygon)", function () {
                var geo = new ol.geom.Polygon([[[0, 0], [10, 12]], [[13, 14], [15, 16]], [[13, 12], [15, 17], [[27, 14], [15, 19]]]]);
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(geo, "getInteriorPoint").and.returnValue(new ol.geom.Point([0, 0]));
                expect(controller.getTooltipPosition(geo)).toEqual([0, 0]);
                expect(geo.getInteriorPoint).toHaveBeenCalled();
            });

            it("method --> 'getTooltipPosition' (Linestring)", function () {
                var geo = new ol.geom.LineString([[0, 0], [10, 12], [13, 14], [15, 16]]);
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(geo, "getCoordinates").and.callThrough();
                expect(controller.getTooltipPosition(geo)).toEqual([13, 14]);
                expect(geo.getCoordinates).toHaveBeenCalled();
            });

            it("method --> 'getTooltipPosition' (Circle)", function () {
                var geo = new ol.geom.Circle([0, 0], 5);
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(geo, "getCenter").and.returnValue([0, 0]);
                expect(controller.getTooltipPosition(geo)).toEqual([0, 0]);
                expect(geo.getCenter).toHaveBeenCalled();
            });

            it("method --> 'getTooltipPosition' (Point)", function () {
                var geo = new ol.geom.Point([0, 0]);
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(geo, "getLastCoordinate").and.returnValue([0, 0]);
                expect(controller.getTooltipPosition(geo)).toEqual([0, 0]);
                expect(geo.getLastCoordinate).toHaveBeenCalled();
            });

            it("method --> 'getTooltipPosition' (GeometryCollection)", function () {
                var geo = {"Type": "GeometryCollection"};
                geo.getType = function () {
                    return this.Type;
                };
                var controller = ctrl('AppdrawController', {$scope: scope});
                expect(controller.getTooltipPosition(geo)).not.toBeDefined();
            });

            it("method --> 'getTooltipPosition' (Other)", function () {
                var geo = {"Type": "Other"};
                geo.getType = function () {
                    return this.Type;
                };
                geo.getLastCoordinate = function () {
                    return [0, 0];
                };
                var controller = ctrl('AppdrawController', {$scope: scope});
                expect(controller.getTooltipPosition(geo)).toEqual([0, 0]);
            });

            it("method --> 'addInteraction'", function () {
                var controller = ctrl('AppdrawController', {$scope: scope});
                var type = "Point";
                spyOn(oVmap.getMap().getOLMap(), "on").and.callFake(Dummy);
                controller.addInteraction(type);
                expect(oVmap.getMap().getOLMap().on).toHaveBeenCalled();
            });

            it("method --> 'addFeatures'", function () {
                var Feature = {
                    "type": "FeatureCollection",
                    "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [[[544372.307376179, 5172695.811492842], [578616.096047938, 5050396.566236559], [714368.258282411, 5118884.143580077], [659333.5979170841, 5236291.4190261075], [544372.307376179, 5172695.811492842]]]
                            },
                            "properties": {
                                "Id": 0,
                                "Nom": "test",
                                "Type": "Polygone",
                                "P\u00e9rim\u00e8tre/longueur": "402.15 km",
                                "Superficie": "9961.89 km\u00b2",
                                "Coordinates": [[[544372.307376179, 5172695.811492842], [578616.096047938, 5050396.566236559], [714368.258282411, 5118884.143580077], [659333.5979170841, 5236291.4190261075], [544372.307376179, 5172695.811492842]]],
                                "infoValues": {
                                    "Nom": "test",
                                    "theme": "test",
                                    "commentaire": "test",
                                    "ShowName": "true",
                                    "ShowVector": "true",
                                    "Fill": "rgba(54,184,255,0.6)",
                                    "Stroke": "rgba(0,0,0,0.4)",
                                    "StrokeSize": "2",
                                    "Text": "rgba(0,0,0,1)",
                                    "TextBackground": "rgba(48,183,255,1)",
                                    "TextSize": "12"
                                }
                            }
                        }, {
                            "type": "Feature",
                            "geometry": {
                                "type": "LineString",
                                "coordinates": [[478330.71493778675, 4995361.905871232], [620197.8394350739, 4932989.290790528], [716814.2431875367, 5010037.8153019855]]
                            },
                            "properties": {
                                "Id": 1,
                                "Nom": "test2",
                                "Type": "Ligne",
                                "P\u00e9rim\u00e8tre/longueur": "211.19 km",
                                "Superficie": "-",
                                "Coordinates": [[478330.71493778675, 4995361.905871232], [620197.8394350739, 4932989.290790528], [716814.2431875367, 5010037.8153019855]],
                                "infoValues": {
                                    "Nom": "test2",
                                    "theme": "test",
                                    "commentaire": "test",
                                    "ShowName": "true",
                                    "ShowVector": "true",
                                    "Fill": "rgba(54,184,255,0.6)",
                                    "Stroke": "rgba(0,0,0,0.4)",
                                    "StrokeSize": "2",
                                    "Text": "rgba(0,0,0,1)",
                                    "TextBackground": "rgba(48,183,255,1)",
                                    "TextSize": "12"
                                }
                            }
                        }, {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [779186.8582682405, 5197155.660544097]
                            },
                            "properties": {
                                "Id": 2,
                                "Nom": "test",
                                "Type": "Point",
                                "P\u00e9rim\u00e8tre/longueur": "-",
                                "Superficie": "-",
                                "Coordinates": [779186.8582682405, 5197155.660544097],
                                "infoValues": {
                                    "Nom": "test",
                                    "theme": "test",
                                    "commentaire": "test",
                                    "ShowName": "true",
                                    "ShowVector": "true",
                                    "Fill": "rgba(54,184,255,0.6)",
                                    "Stroke": "rgba(0,0,0,0.4)",
                                    "StrokeSize": "2",
                                    "Text": "rgba(0,0,0,1)",
                                    "TextBackground": "rgba(48,183,255,1)",
                                    "TextSize": "12"
                                }
                            }
                        }, {
                            "type": "Feature",
                            "geometry": {
                                "type": "GeometryCollection",
                                "geometries": []
                            },
                            "properties": {
                                "Id": 3,
                                "Nom": "test",
                                "Type": "Cercle",
                                "P\u00e9rim\u00e8tre/longueur": "289.5292 km",
                                "Superficie": "6670.7523 km\u00b2",
                                "Coordinates": [[386606.28099557525, 5142121.00017877], 61879.06738070317],
                                "infoValues": {
                                    "Nom": "test",
                                    "theme": "test",
                                    "commentaire": "test",
                                    "ShowName": "true",
                                    "ShowVector": "true",
                                    "Fill": "rgba(54,184,255,0.6)",
                                    "Stroke": "rgba(0,0,0,0.4)",
                                    "StrokeSize": "2",
                                    "Text": "rgba(0,0,0,1)",
                                    "TextBackground": "rgba(48,183,255,1)",
                                    "TextSize": "12"
                                }
                            }
                        }]
                };
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(controller, "setFeatureTooltip").and.callFake(Dummy);
                spyOn(controller, "setFeatureStyle").and.callFake(Dummy);
                controller.addFeatures(Feature);
                console.log(oVmap.getMap().getOLMap().getOverlays().getArray());
                expect(controller.setFeatureTooltip).toHaveBeenCalled();
                expect(controller.setFeatureStyle).toHaveBeenCalled();
            });

            it("method --> 'removeFeatures'", function () {
                var Feature = [[], [], []];
                var Mock = {};
                Mock.get = function () {
                    return 'info';
                };
                Mock.set = function () {
                };
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(oVmap.getMap().getOLMap().getOverlays(), "getArray").and.returnValue([Mock, Mock, Mock, Mock]);
                spyOn(oVmap.getMap().getOLMap().getOverlays(), "remove").and.callFake(Dummy);
                spyOn(controller.oOpenLayersDrawOverlay_.getFeatures(), "getArray").and.returnValue([Mock, Mock]);
                controller.removeFeatures(Feature);
                expect(oVmap.getMap().getOLMap().getOverlays().getArray.calls.count()).toEqual(Feature.length);
                expect(oVmap.getMap().getOLMap().getOverlays().remove).toHaveBeenCalled();
            });

            it("method --> 'removeFeaturesWithControl' (with Empty Array)", function () {
                var Feature = [];
                var controller = ctrl('AppdrawController', {$scope: scope});
                expect(controller.removeFeaturesWithControl(Feature)).not.toBeDefined();
            });

            it("method --> 'removeFeaturesWithControl' (with one Mock in Array)", function () {
                var Mock = {
                    'Id': 123,
                    'infoValues': {
                        'name': 'chablagou',
                        'jcp': 'jctp'
                    }
                };
                Mock.get = function (P) {
                    return Mock[P];
                };
                Mock.set = function () {
                };
                var Feature = [Mock];
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(controller, "zoomToFeature").and.callFake(Dummy);
                spyOn(bootbox, "confirm").and.callFake(Dummy);
                controller.removeFeaturesWithControl(Feature);
                expect(controller.zoomToFeature).toHaveBeenCalled();
                expect(bootbox.confirm).toHaveBeenCalled();
            });

            it("method --> 'removeFeaturesWithControl' (with five Mock in Array)", function () {
                var Mock = {
                    'Id': 123,
                    'infoValues': {
                        'name': 'chablagou',
                        'jcp': 'jctp'
                    }
                };
                Mock.get = function (P) {
                    this['Id']++;
                    return Mock[P];
                };
                Mock.set = function () {
                };
                var Feature = [Mock, Mock, Mock, Mock, Mock];
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(controller, "zoomToFeature").and.callFake(Dummy);
                spyOn(bootbox, "confirm").and.callFake(Dummy);
                controller.removeFeaturesWithControl(Feature);
                expect(controller.zoomToFeature).not.toHaveBeenCalled();
                expect(bootbox.confirm).toHaveBeenCalled();
            });

            it("method --> 'removeSelectedFeatures'", function () {
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(controller, "removeFeaturesWithControl").and.callFake(Dummy);
                controller.removeSelectedFeatures();
                expect(controller.removeFeaturesWithControl).toHaveBeenCalled();
            });

            it("method --> 'calcelEditFeature' (if pass)", function () {
                var Mock = {
                    'Id': 123,
                    'infoValues': undefined
                };
                Mock.get = function (P) {
                    this['Id']++;
                    return Mock[P];
                };
                var Feature = Mock;
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(controller, "removeFeatures").and.callFake(Dummy);
                controller.calcelEditFeature(Feature);
                expect(controller.removeFeatures).toHaveBeenCalled();
            });

            it("method --> 'calcelEditFeature' (if not pass)", function () {
                var Mock = {
                    'Id': 123,
                    'infoValues': 'chablagou'
                };
                Mock.get = function (P) {
                    this['Id']++;
                    return Mock[P];
                };
                var Feature = Mock;
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(controller, "removeFeatures").and.callFake(Dummy);
                controller.calcelEditFeature(Feature);
                expect(controller.removeFeatures).not.toHaveBeenCalled();
            });

            it("method --> 'setFeatureStyle' (if pass)", function () {
                var Feature = new ol.Feature();
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(Feature, "get").and.callFake(Dummy);
                expect(controller.setFeatureStyle(Feature)).not.toBeDefined();
            });

            it("method --> 'setFeatureStyle' (ShowVector)", function () {
                var Feature = new ol.Feature();
                var toReturn = {
                    "ShowVector": "false",
                    "Fill": "rgba(54,184,255,0.6)",
                    "Stroke": "rgba(0,0,0,0.4)",
                    "StrokeSize": "2"
                };
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(Feature, "get").and.returnValue(toReturn);
                spyOn(Feature, "setStyle").and.callFake(Dummy);
                controller.setFeatureStyle(Feature);
                expect(Feature.setStyle).toHaveBeenCalled();
            });

            it("method --> 'setFeatureStyle' (Fill)", function () {
                var Feature = new ol.Feature();
                var toReturn = {
                    "ShowVector": "true",
                    "Fill": "",
                    "Stroke": "rgba(0,0,0,0.4)",
                    "StrokeSize": "2"
                };
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(Feature, "get").and.returnValue(toReturn);
                spyOn(Feature, "setStyle").and.callFake(Dummy);
                controller.setFeatureStyle(Feature);
                expect(Feature.setStyle).toHaveBeenCalled();
            });

            it("method --> 'setFeatureStyle' (Stroke)", function () {
                var Feature = new ol.Feature();
                var toReturn = {
                    "ShowVector": "true",
                    "Fill": "chablagou",
                    "Stroke": "",
                    "StrokeSize": "2"
                };
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(Feature, "get").and.returnValue(toReturn);
                spyOn(Feature, "setStyle").and.callFake(Dummy);
                controller.setFeatureStyle(Feature);
                expect(Feature.setStyle).toHaveBeenCalled();
            });

            it("method --> 'setFeatureStyle' (StrokeSize)", function () {
                var Feature = new ol.Feature();
                var toReturn = {
                    "ShowVector": "true",
                    "Fill": "chablagou",
                    "Stroke": "chablagou",
                    "StrokeSize": ""
                };
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(Feature, "get").and.returnValue(toReturn);
                spyOn(Feature, "setStyle").and.callFake(Dummy);
                controller.setFeatureStyle(Feature);
                expect(Feature.setStyle).toHaveBeenCalled();
            });

            it("method --> 'setInfosToFeature' (Point)", function () {
                var controller = ctrl('AppdrawController', {$scope: scope});
                var Feature = new ol.Feature();
                spyOn(Feature, "getGeometry").and.returnValue(new ol.geom.Point([0, 0]));
                spyOn(Feature, "set").and.callFake(Dummy);
                controller.setInfosToFeature(Feature);
                expect(Feature.getGeometry).toHaveBeenCalled();
                expect(Feature.set).toHaveBeenCalled();
                expect(Feature.set.calls.count()).toEqual(6);
            });

            it("method --> 'setInfosToFeature' (LineString)", function () {
                spyOn(document, "getElementById").and.returnValue(document.createElement('div'));
                var controller = ctrl('AppdrawController', {$scope: scope});
                var Feature = new ol.Feature();
                spyOn(Feature, "getGeometry").and.returnValue(new ol.geom.LineString([[0, 0], [10, 12], [13, 14], [15, 16]]));
                spyOn(Feature, "set").and.callFake(Dummy);
                controller.setInfosToFeature(Feature);
                expect(Feature.getGeometry).toHaveBeenCalled();
                expect(Feature.set).toHaveBeenCalled();
                expect(Feature.set.calls.count()).toEqual(6);
            });

            it("method --> 'setInfosToFeature' (Polygon)", function () {
                spyOn(document, "getElementById").and.returnValue(document.createElement('div'));
                var controller = ctrl('AppdrawController', {$scope: scope});
                var Feature = new ol.Feature();
                spyOn(Feature, "getGeometry").and.returnValue(new ol.geom.Polygon([[[0, 0], [10, 12]], [[13, 14], [15, 16]], [[13, 12], [15, 17], [[27, 14], [15, 19]]]]));
                spyOn(Feature, "set").and.callFake(Dummy);
                controller.setInfosToFeature(Feature);
                expect(Feature.getGeometry).toHaveBeenCalled();
                expect(Feature.set).toHaveBeenCalled();
                expect(Feature.set.calls.count()).toEqual(6);
            });

            it("method --> 'setInfosToFeature' (Circle)", function () {
                spyOn(document, "getElementById").and.returnValue(document.createElement('div'));
                var controller = ctrl('AppdrawController', {$scope: scope});
                var Feature = new ol.Feature();
                spyOn(Feature, "getGeometry").and.returnValue(new ol.geom.Circle([0, 0], 5));
                spyOn(Feature, "set").and.callFake(Dummy);
                controller.setInfosToFeature(Feature);
                expect(Feature.getGeometry).toHaveBeenCalled();
                expect(Feature.set).toHaveBeenCalled();
                expect(Feature.set.calls.count()).toEqual(6);
            });

            it("method --> 'setInfosToFeature' (MultiPoint)", function () {
                spyOn(document, "getElementById").and.returnValue(document.createElement('div'));
                var controller = ctrl('AppdrawController', {$scope: scope});
                var Feature = new ol.Feature();
                spyOn(Feature, "getGeometry").and.returnValue(new ol.geom.MultiPoint([[0, 0], [10, 12], [13, 14], [15, 16]]));
                spyOn(Feature, "set").and.callFake(Dummy);
                controller.setInfosToFeature(Feature);
                expect(Feature.getGeometry).toHaveBeenCalled();
                expect(Feature.set).toHaveBeenCalled();
                expect(Feature.set.calls.count()).toEqual(5);
            });

            it("method --> 'updateFeatureInfos'", function () {
                var Feature = new ol.Feature();
                var Mock = {};
                Mock.get = function () {
                    return Feature;
                };
                var controller = ctrl('AppdrawController', {$scope: scope});
                controller.drawTooltip_ = new ol.Overlay({
                    element: document.createElement('div'),
                    offset: [0, -15],
                    positioning: 'bottom-center'
                });
                var $Mock = [document.createElement('div')];
                $Mock.modal = Dummy;
                $Mock.val = function(){
                    return "";
                };
                controller.drawTooltipElement_ = document.createElement('div');
                spyOn(window, "$").and.returnValue($Mock);
                spyOn(Feature, "setStyle").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap().getOverlays(), "getArray").and.returnValue(Mock);
                spyOn(oVmap.getMap().getOLMap().getOverlays(), "remove").and.callFake(Dummy);
                spyOn(controller, "createDrawTooltip").and.callFake(Dummy);
                spyOn(Feature, "set").and.callFake(Dummy);
                spyOn(controller.drawTooltip_, "setPosition").and.callFake(Dummy);
                spyOn(controller, "getTooltipPosition").and.callFake(Dummy);
                spyOn(controller.drawTooltip_, "setOffset").and.callFake(Dummy);
                spyOn(controller, "showHideAnotations").and.callFake(Dummy);
                spyOn(controller, "removeDrawsInteractions").and.callFake(Dummy);
                controller.updateFeatureInfos(Feature, controller.fields_);
                expect(controller.createDrawTooltip).toHaveBeenCalled();
                expect(controller.showHideAnotations).toHaveBeenCalled();
                expect(controller.removeDrawsInteractions).toHaveBeenCalled();
            });

            it("method --> 'createHelpToolTip'", function () {
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(document, "createElement").and.callThrough();
                spyOn(oVmap.getMap().getOLMap(), "addOverlay").and.callFake(Dummy);
                controller.createHelpTooltip();
                expect(document.createElement).toHaveBeenCalledWith('div');
                expect(oVmap.getMap().getOLMap().addOverlay).toHaveBeenCalled();
            });

            it("method --> 'formatLength' (first else pass and second if pass)", function () {
                spyOn(document, "getElementById").and.returnValue(document.createElement('div'));
                var controller = ctrl('AppdrawController', {$scope: scope});
                var line = new ol.geom.LineString([[0, 0], [10, 12], [13, 14], [15, 16]]);
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), "getCode").and.returnValue("EPSG:3857");
                spyOn(line, "getLength").and.returnValue(10000001);
                expect(controller.formatLength(line)).toContain(" km");
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
                expect(line.getLength).toHaveBeenCalled();
            });

            it("method --> 'formatLength' (first else pass and second else pass)", function () {
                spyOn(document, "getElementById").and.returnValue(document.createElement('div'));
                var controller = ctrl('AppdrawController', {$scope: scope});
                var line = new ol.geom.LineString([[0, 0], [10, 12], [13, 14], [15, 16]]);
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), "getCode").and.returnValue("EPSG:3857");
                spyOn(line, "getLength").and.returnValue(1000);
                expect(controller.formatLength(line)).toContain(" m");
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
                expect(line.getLength).toHaveBeenCalled();
            });

            it("method --> 'formatLength' (first if pass)", function () {
                var myDivCheck = document.createElement('input');
                spyOn(myDivCheck, "checked").and.returnValue(true);
                spyOn(document, "getElementById").and.returnValue(myDivCheck);
                var controller = ctrl('AppdrawController', {$scope: scope});
                var line = new ol.geom.LineString([[0, 0], [10, 12], [13, 14], [15, 16]]);
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), "getCode").and.returnValue("EPSG:3857");
                spyOn(line, "getCoordinates").and.callThrough();
                spyOn(controller, "calcDistance").and.returnValue(1000);
                expect(controller.formatLength(line)).toContain(" m");
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
                expect(controller.calcDistance).toHaveBeenCalledWith([[0, 0], [10, 12], [13, 14], [15, 16]]);
                expect(line.getCoordinates).toHaveBeenCalled();
            });

            it("method --> 'calcDistance' (EPSG:4326)", function () {
                var Coord = [[3.101893, 42.517921], [2.973009, 42.551902], [2.757218, 42.632488], [2.847844, 42.674553], [2.851830, 42.719072]];
                spyOn(oVmap.getMap().getOLMap().getView(), "getProjection").and.returnValue("EPSG:4326");
                var controller = ctrl('AppdrawController', {$scope: scope});
                expect((Math.round(controller.calcDistance(Coord) / 1000 * 100) / 100)).toEqual(44.8);
                expect(oVmap.getMap().getOLMap().getView().getProjection).toHaveBeenCalled();
            });

            it("method --> 'calcDistance' (EPSG:3857)", function () {
                var Coord = [[345301.14925522, 5238880.01462925], [330953.848003819, 5244013.58040788], [306932.103766048, 5256199.02597311], [317020.543938679, 5262565.96105493], [317464.263428981, 5269309.02805617]];
                spyOn(oVmap.getMap().getOLMap().getView(), "getProjection").and.returnValue("EPSG:3857");
                var controller = ctrl('AppdrawController', {$scope: scope});
                expect((Math.round(controller.calcDistance(Coord) / 1000 * 100) / 100)).toEqual(44.8);
                expect(oVmap.getMap().getOLMap().getView().getProjection).toHaveBeenCalled();
            });

            it("method --> 'line.getLenght' (EPSG:2154)", function () {
                var myDivCheck = document.createElement('input');
                spyOn(myDivCheck, "checked").and.returnValue(true);
                spyOn(document, "getElementById").and.returnValue(myDivCheck);
                var Coord = [[708385.059045847, 6157574.066028], [697780.126884216, 6161349.08180653], [680060.001343746, 6170343.2372876], [687512.235306722, 6175003.38258007], [687848.665686326, 6179954.26640965]];
                var line = new ol.geom.LineString(Coord);
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), "getCode").and.returnValue("EPSG:2154");
                var controller = ctrl('AppdrawController', {$scope: scope});
                expect((Math.round(line.getLength()) / 1000 * 100) / 100).toEqual(44.88);
                expect(controller.formatLength(line)).toEqual("44.88 km");
            });

            it("method --> 'formatCoordinate'", function () {
                var Point = new ol.geom.Point([0, 0]);
                var controller = ctrl('AppdrawController', {$scope: scope});
                expect(controller.formatCoordinate(Point)).toEqual(['0.0000', '0.0000']);
            });

            it("method --> 'formatRadius' (first if not pass and second if pass)", function () {
                var myDivCheck = document.createElement('div');
                spyOn(document, "getElementById").and.returnValue(myDivCheck);
                var Circle = new ol.geom.Circle([0, 0], 5);
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(Circle, "getRadius").and.returnValue(1001);
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), "getCode").and.returnValue("EPSG:3857");
                expect(controller.formatRadius(Circle)).toContain(" km");
                expect(Circle.getRadius).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
            });

            it("method --> 'formatRadius' (first if not pass and second if not pass)", function () {
                var myDivCheck = document.createElement('div');
                spyOn(document, "getElementById").and.returnValue(myDivCheck);
                var Circle = new ol.geom.Circle([0, 0], 5);
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(Circle, "getRadius").and.returnValue(1000);
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), "getCode").and.returnValue("EPSG:3857");
                expect(controller.formatRadius(Circle)).toContain(" m");
                expect(Circle.getRadius).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
            });

            it("method --> 'formatRadius' (first if pass)", function () {
                var myDivCheck = document.createElement('input');
                spyOn(myDivCheck, "checked").and.returnValue(true);
                spyOn(document, "getElementById").and.returnValue(myDivCheck);
                var Circle = new ol.geom.Circle([0, 0], 5);
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(controller, "calcDistance").and.returnValue(1000);
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), "getCode").and.returnValue("EPSG:3857");
                expect(controller.formatRadius(Circle)).toContain(" m");
                expect(controller.calcDistance).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
            });

            it("method --> 'formatPerimeter'", function () {
                var Polygon = new ol.geom.Polygon([[[0, 0], [10, 12]], [[13, 14], [15, 16]], [[13, 12], [15, 17], [[27, 14], [15, 19]]]]);
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(Polygon, "getCoordinates").and.callThrough();
                spyOn(Polygon, "getLayout").and.callThrough();
                spyOn(controller, "formatLength").and.returnValue("1000 km");
                expect(controller.formatPerimeter(Polygon)).toBe("1000 km");
                expect(Polygon.getCoordinates).toHaveBeenCalled();
                expect(Polygon.getLayout).toHaveBeenCalled();
                expect(controller.formatLength).toHaveBeenCalled();
            });

            it("method --> 'formatArea' (first if not pass second if pass)", function () {
                var myDivCheck = document.createElement('div');
                spyOn(document, "getElementById").and.returnValue(myDivCheck);
                var Polygon = new ol.geom.Polygon([[[0, 0], [10, 12]], [[13, 14], [15, 16]], [[13, 12], [15, 17], [[27, 14], [15, 19]]]]);
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(Polygon, "getArea").and.returnValue(100000001);
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), "getCode").and.returnValue("EPSG:3857");
                expect(controller.formatArea(Polygon)).toContain(" km²");
                expect(Polygon.getArea).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
            });

            it("method --> 'formatArea' (first if not pass second if not pass)", function () {
                var myDivCheck = document.createElement('div');
                spyOn(document, "getElementById").and.returnValue(myDivCheck);
                var Polygon = new ol.geom.Polygon([[[0, 0], [10, 12]], [[13, 14], [15, 16]], [[13, 12], [15, 17], [[27, 14], [15, 19]]]]);
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(Polygon, "getArea").and.returnValue(10000);
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), "getCode").and.returnValue("EPSG:3857");
                expect(controller.formatArea(Polygon)).toContain(" m²");
                expect(Polygon.getArea).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
            });

            it("method --> 'formatArea' (first if pass)", function () {
                var myDivCheck = document.createElement('input');
                spyOn(myDivCheck, "checked").and.returnValue(true);
                spyOn(document, "getElementById").and.returnValue(myDivCheck);
                var Polygon = new ol.geom.Polygon([[[0, 0], [10, 12]], [[13, 14], [15, 16]], [[13, 12], [15, 17], [[27, 14], [15, 19]]]]);
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), "getCode").and.returnValue("EPSG:3857");
                spyOn(controller.wgs84Sphere_, "geodesicArea").and.returnValue(10000);
                expect(controller.formatArea(Polygon)).toContain(" m²");
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
                expect(controller.wgs84Sphere_.geodesicArea).toHaveBeenCalled();
            });

            it("method --> 'zoomToFeature' (Point)", function () {
                var Feature = new ol.Feature();
                spyOn(oVmap.getMap().getOLMap().getView(), "setCenter").and.callFake(Dummy);
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(Feature, "get").and.returnValue("Point");
                spyOn(Feature, "getGeometry").and.returnValue(new ol.geom.Point([0, 0]));
                controller.zoomToFeature(Feature);
                expect(Feature.get).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0, 0]);
                expect(Feature.getGeometry).toHaveBeenCalled();
            });

            it("method --> 'zoomToFeature' (Cercle)", function () {
                var Feature = new ol.Feature();
                spyOn(oVmap.getMap().getOLMap().getView(), "setCenter").and.callFake(Dummy);
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(Feature, "get").and.returnValue("Cercle");
                spyOn(Feature, "getGeometry").and.returnValue(new ol.geom.Circle([0, 0], 5));
                controller.zoomToFeature(Feature);
                expect(Feature.get).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().setCenter).toHaveBeenCalledWith([0, 0]);
                expect(Feature.getGeometry).toHaveBeenCalled();
            });

            it("method --> 'zoomToFeature' (Other)", function () {
                var Feature = new ol.Feature();
                spyOn(oVmap.getMap().getOLMap().getView(), "fitGeometry").and.callFake(Dummy);
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(Feature, "get").and.returnValue("Other");
                controller.zoomToFeature(Feature);
                expect(Feature.get).toHaveBeenCalled();
                expect(Feature.get.calls.count()).toEqual(3);
                expect(oVmap.getMap().getOLMap().getView().fitGeometry).toHaveBeenCalled();
            });

            it("method --> 'initExportFeatureButtons'", function(){
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(document, "createTextNode").and.callThrough();
                controller.initExportFeatureButtons();
                expect(document.createTextNode).toHaveBeenCalled();
            });
            
            it("method --> 'displayFeatureInfos'", function(){
                var Feature = new ol.Feature();
                var Info = {
                                "Nom": "test2",
                                "theme": "test",
                                "commentaire": "test",
                                "ShowName": "true",
                                "ShowVector": "true",
                                "Fill": "rgba(54,184,255,0.6)",
                                "Stroke": "rgba(0,0,0,0.4)",
                                "StrokeSize": "2",
                                "Text": "rgba(0,0,0,1)",
                                "TextBackground": "rgba(48,183,255,1)",
                                "TextSize": "12"
                            };
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(Feature, "get").and.returnValue(Info);
                spyOn($.fn, "bootstrapTable").and.callFake(Dummy);
                spyOn($.fn, "modal").and.callFake(Dummy);
                controller.displayFeatureInfos(Feature);
                expect($.fn.bootstrapTable.calls.count()).toEqual(2);
                expect($.fn.modal.calls.count()).toEqual(2);
            });

            it("method --> 'editFeatureInfos' (first if pass)", function(){
                var Feature = new ol.Feature();
                var Info = {
                                "Nom": "test2",
                                "theme": "test",
                                "commentaire": "test",
                                "ShowName": "true",
                                "ShowVector": "true",
                                "Fill": "rgba(54,184,255,0.6)",
                                "Stroke": "rgba(0,0,0,0.4)",
                                "StrokeSize": "2",
                                "Text": "rgba(0,0,0,1)",
                                "TextBackground": "rgba(48,183,255,1)",
                                "TextSize": "12"
                            };
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(Feature, "get").and.returnValue(Info);
                spyOn($.fn, "bootstrapToggle").and.callFake(Dummy);
                spyOn($.fn, "modal").and.callFake(Dummy);
                controller.editFeatureInfos(Feature);
                expect($.fn.bootstrapToggle.calls.count()).toEqual(3);
                expect($.fn.modal.calls.count()).toEqual(2);
            });
            
            it("method --> 'editFeatureInfos' (first if not pass)", function(){
                var Feature = new ol.Feature();
                var Info;
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(Feature, "get").and.returnValue(Info);
                spyOn($.fn, "bootstrapToggle").and.callFake(Dummy);
                spyOn($.fn, "modal").and.callFake(Dummy);
                controller.editFeatureInfos(Feature);
                expect($.fn.bootstrapToggle.calls.count()).toEqual(3);
                expect($.fn.modal.calls.count()).toEqual(2);
            });
            
            it("method --> 'displayFeaturesList' (empty array)", function(){
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(controller.oOpenLayersDrawOverlay_.getFeatures(),"getArray").and.returnValue([]);
                spyOn($.fn, "modal").and.callFake(Dummy);
                controller.displayFeaturesList();
                expect($.fn.modal.calls.count()).toEqual(2);
            });
            
            it("method --> 'displayFeaturesList' (array)", function(){
                var feature = new ol.Feature();
                var info = {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [779186.8582682405, 5197155.660544097]
                            },
                            "properties": {
                                "Id": 2,
                                "Nom": "test",
                                "Type": "Point",
                                "P\u00e9rim\u00e8tre/longueur": "-",
                                "Superficie": "-",
                                "Coordinates": [779186.8582682405, 5197155.660544097],
                                "infoValues": {
                                    "Nom": "test",
                                    "theme": "test",
                                    "commentaire": "test",
                                    "ShowName": "true",
                                    "ShowVector": "true",
                                    "Fill": "rgba(54,184,255,0.6)",
                                    "Stroke": "rgba(0,0,0,0.4)",
                                    "StrokeSize": "2",
                                    "Text": "rgba(0,0,0,1)",
                                    "TextBackground": "rgba(48,183,255,1)",
                                    "TextSize": "12"
                                }
                            }
                        };
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(controller.oOpenLayersDrawOverlay_.getFeatures(),"getArray").and.returnValue([feature]);
                spyOn(controller,"initExportFeatureButtons").and.callFake(Dummy);        
                spyOn($.fn, "modal").and.callFake(Dummy);
                controller.displayFeaturesList();
                expect($.fn.modal.calls.count()).toEqual(2);
                expect(controller.initExportFeatureButtons).toHaveBeenCalled();
            });

            it("method --> 'showHideAnotations' (if pass)", function () {
                var myDivCheck = document.createElement('input');
                spyOn(myDivCheck, "checked").and.returnValue(true);
                spyOn(document, "getElementById").and.returnValue(myDivCheck);
                var controller = ctrl('AppdrawController', {$scope: scope});
                controller.showHideAnotations();
                expect(true).toBe(true);
            });

            it("method --> 'showHideAnotations' (if not pass)", function () {
                var myDivCheck = document.createElement('input');
                spyOn(document, "getElementById").and.returnValue(myDivCheck);
                var controller = ctrl('AppdrawController', {$scope: scope});
                controller.showHideAnotations();
                expect(true).toBe(true);
            });

            it("method --> 'drawPoint'", function () {
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(controller, "removeDrawsInteractions").and.callThrough();
                spyOn(controller, "addInteraction").and.callFake(Dummy);
                controller.drawPoint();
                expect(controller.removeDrawsInteractions).toHaveBeenCalled();
                expect(controller.addInteraction).toHaveBeenCalledWith("Point");
            });

            it("method --> 'drawLine'", function () {
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(controller, "removeDrawsInteractions").and.callThrough();
                spyOn(controller, "addInteraction").and.callFake(Dummy);
                controller.drawLine();
                expect(controller.removeDrawsInteractions).toHaveBeenCalled();
                expect(controller.addInteraction).toHaveBeenCalledWith("LineString");
            });

            it("method --> 'drawPolygon'", function () {
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(controller, "removeDrawsInteractions").and.callThrough();
                spyOn(controller, "addInteraction").and.callFake(Dummy);
                controller.drawPolygon();
                expect(controller.removeDrawsInteractions).toHaveBeenCalled();
                expect(controller.addInteraction).toHaveBeenCalledWith("Polygon");
            });

            it("method --> 'drawCircle'", function () {
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(controller, "removeDrawsInteractions").and.callThrough();
                spyOn(controller, "addInteraction").and.callFake(Dummy);
                controller.drawCircle();
                expect(controller.removeDrawsInteractions).toHaveBeenCalled();
                expect(controller.addInteraction).toHaveBeenCalledWith("Circle");
            });

            it("method --> 'modifyFeature'", function () {
                spyOn(oVmap.getMap().getOLMap(), "addInteraction").and.callFake(Dummy);
                var controller = ctrl('AppdrawController', {$scope: scope});
                controller.modifyFeature();
                expect(oVmap.getMap().getOLMap().addInteraction).toHaveBeenCalled();
            });

            it("method --> 'editInfosClick' (if pass)", function(){
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn($.fn, "hasClass").and.returnValue(true);
                spyOn(controller, "removeDrawsInteractions").and.callFake(Dummy);
                controller.editInfosClick();
                expect(controller.removeDrawsInteractions).toHaveBeenCalled();
            });
            
            it("method --> 'editInfosClick' (if not pass)", function(){
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn($.fn, "hasClass").and.returnValue(false);
                spyOn($.fn, "addClass").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap(), "addInteraction").and.callFake(Dummy);
                spyOn(controller, "removeDrawsInteractions").and.callFake(Dummy);
                controller.editInfosClick();
                expect(controller.removeDrawsInteractions).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().addInteraction.calls.count()).toEqual(2);
                expect($.fn.addClass).toHaveBeenCalledWith('active');
            });
            
            it("method --> 'showInfosClick' (if pass)", function(){
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn($.fn, "hasClass").and.returnValue(true);
                spyOn(controller, "removeDrawsInteractions").and.callFake(Dummy);
                controller.showInfosClick();
                expect(controller.removeDrawsInteractions).toHaveBeenCalled();
            });
            
            it("method --> 'showInfosClick' (if not pass)", function(){
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn($.fn, "hasClass").and.returnValue(false);
                spyOn($.fn, "addClass").and.callFake(Dummy);
                spyOn(oVmap.getMap().getOLMap(), "addInteraction").and.callFake(Dummy);
                spyOn(controller, "removeDrawsInteractions").and.callFake(Dummy);
                controller.showInfosClick();
                expect(controller.removeDrawsInteractions).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().addInteraction.calls.count()).toEqual(2);
                expect($.fn.addClass).toHaveBeenCalledWith('active');
            });

            it("method --> 'deleteFeature'", function () {
                spyOn(oVmap.getMap().getOLMap(), "addInteraction").and.callFake(Dummy);
                var controller = ctrl('AppdrawController', {$scope: scope});
                controller.deleteFeature();
                expect(oVmap.getMap().getOLMap().addInteraction).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().addInteraction.calls.count()).toEqual(2);
            });

            it("method --> 'deleteAllFeatures'", function () {
                spyOn(oVmap.getMap().getOLMap().getOverlays(), "getArray").and.callThrough();
                spyOn(oVmap.getMap().getOLMap().getOverlays(), "remove").and.callFake(Dummy);
                var controller = ctrl('AppdrawController', {$scope: scope});
                spyOn(controller, "removeDrawsInteractions").and.callFake(Dummy);
                controller.deleteAllFeatures();
                expect(controller.removeDrawsInteractions).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getOverlays().getArray).toHaveBeenCalled();
            });

            it("method --> 'removeDrawsInteractions' (if pass)", function () {
                spyOn(oVmap.getMap().getOLMap(), "removeInteraction").and.callThrough();
                var controller = ctrl('AppdrawController', {$scope: scope});
                var Feature = [];
                controller.createDrawTooltip(Feature);
                controller.removeDrawsInteractions();
                expect(oVmap.getMap().getOLMap().removeInteraction).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().removeInteraction.calls.count()).toEqual(6);
            });
            // A refaire plein de modif manque une partie
        });
    });
});
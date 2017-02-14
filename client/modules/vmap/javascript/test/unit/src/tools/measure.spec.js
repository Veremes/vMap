/* global goog, angular, spyOn, oVmap, expect, Dummy, ol */

'use strict';
/**
 * @author: Anthony Borghi
 * @Description: Unit test on Measure.js 
 * All the Units Tests of nsVmap.nsToolsManager.Measure class
 */
goog.provide('nsVmap.nsToolsManager.Measure.Spec');

goog.require('oVmap');
goog.require('nsVmap.nsToolsManager.Measure');

console.log("Unit - nsVmap.nsToolsManager.Measure");

describe("Unit -", function () {
    describe("nsVmap.nsToolsManager.Measure :", function () {
        beforeEach(module('app'));

        describe("angular directive : 'appMeasure'", function () {
            var scope;
            var el;
            var toTest = {};

            beforeEach(module('template/tools/measure.html'));
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();

                el = angular.element(
                        '<div>' +
                            '<div class="right" app-measure app-lang="ctrl.lang"></div>' +
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
                expect(toTest[0].children[0].tagName).toBe("LI");
                expect(toTest[0].children[0].parentElement.attributes[1].localName).toBe("app-measure");
                expect(toTest[0].children.length).toEqual(2);
            });
        });
        describe("angular controller : 'AppmeasureController'", function () {

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
                var controller = ctrl('AppmeasureController', {$scope: scope});
                expect(oVmap.getMap().getOLMap).toHaveBeenCalled();
                expect(document.getElementById).toHaveBeenCalledWith("geodesic");
            });

            it("method --> 'createMeasureTooltip' (second if pass)", function () {
                var controller = ctrl('AppmeasureController', {$scope: scope});
                var Feature = [];
                spyOn(document, "createElement").and.callThrough();
                controller.createMeasureTooltip(Feature);
                expect(document.createElement).toHaveBeenCalledWith('div');
            });

            it("method --> 'createMeasureTooltip' (second if not pass)", function () {
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(document, "createElement").and.callThrough();
                controller.createMeasureTooltip();
                expect(document.createElement).toHaveBeenCalledWith('div');
            });

            it("method --> 'addInteraction'", function () {
                var controller = ctrl('AppmeasureController', {$scope: scope});
                var type = "Point";
                spyOn(oVmap.getMap().getOLMap(), "on").and.callFake(Dummy);
                controller.addInteraction(type);
                expect(oVmap.getMap().getOLMap().on).toHaveBeenCalled();
            });

            it("method --> 'setInfosToFeature' (Point)", function () {
                var controller = ctrl('AppmeasureController', {$scope: scope});
                var Feature = new ol.Feature();
                spyOn(Feature, "getGeometry").and.returnValue(new ol.geom.Point([0, 0]));
                spyOn(Feature, "set").and.callFake(Dummy);
                controller.setInfosToFeature(Feature);
                expect(Feature.getGeometry).toHaveBeenCalled();
                expect(Feature.set).toHaveBeenCalled();
                expect(Feature.set.calls.count()).toEqual(4);
            });

            it("method --> 'setInfosToFeature' (LineString)", function () {
                spyOn(document, "getElementById").and.returnValue(document.createElement('div'));
                var controller = ctrl('AppmeasureController', {$scope: scope});
                var Feature = new ol.Feature();
                spyOn(Feature, "getGeometry").and.returnValue(new ol.geom.LineString([[0, 0], [10, 12], [13, 14], [15, 16]]));
                spyOn(Feature, "set").and.callFake(Dummy);
                controller.setInfosToFeature(Feature);
                expect(Feature.getGeometry).toHaveBeenCalled();
                expect(Feature.set).toHaveBeenCalled();
                expect(Feature.set.calls.count()).toEqual(4);
            });

            it("method --> 'setInfosToFeature' (Polygon)", function () {
                spyOn(document, "getElementById").and.returnValue(document.createElement('div'));
                var controller = ctrl('AppmeasureController', {$scope: scope});
                var Feature = new ol.Feature();
                spyOn(Feature, "getGeometry").and.returnValue(new ol.geom.Polygon([[[0, 0], [10, 12]], [[13, 14], [15, 16]], [[13, 12], [15, 17], [[27, 14], [15, 19]]]]));
                spyOn(Feature, "set").and.callFake(Dummy);
                controller.setInfosToFeature(Feature);
                expect(Feature.getGeometry).toHaveBeenCalled();
                expect(Feature.set).toHaveBeenCalled();
                expect(Feature.set.calls.count()).toEqual(5);
            });

            it("method --> 'setInfosToFeature' (Circle)", function () {
                spyOn(document, "getElementById").and.returnValue(document.createElement('div'));
                var controller = ctrl('AppmeasureController', {$scope: scope});
                var Feature = new ol.Feature();
                spyOn(Feature, "getGeometry").and.returnValue(new ol.geom.Circle([0, 0], 5));
                spyOn(Feature, "set").and.callFake(Dummy);
                controller.setInfosToFeature(Feature);
                expect(Feature.getGeometry).toHaveBeenCalled();
                expect(Feature.set).toHaveBeenCalled();
                expect(Feature.set.calls.count()).toEqual(8);
            });

            it("method --> 'setInfosToFeature' (MultiPoint)", function () {
                spyOn(document, "getElementById").and.returnValue(document.createElement('div'));
                var controller = ctrl('AppmeasureController', {$scope: scope});
                var Feature = new ol.Feature();
                spyOn(Feature, "getGeometry").and.returnValue(new ol.geom.MultiPoint([[0, 0], [10, 12], [13, 14], [15, 16]]));
                spyOn(Feature, "set").and.callFake(Dummy);
                controller.setInfosToFeature(Feature);
                expect(Feature.getGeometry).toHaveBeenCalled();
                expect(Feature.set).toHaveBeenCalled();
                expect(Feature.set.calls.count()).toEqual(3);
            });

            it("method --> 'createHelpToolTip'", function () {
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(document, "createElement").and.callThrough();
                spyOn(oVmap.getMap().getOLMap(), "addOverlay").and.callFake(Dummy);
                controller.createHelpTooltip();
                expect(document.createElement).toHaveBeenCalledWith('div');
                expect(oVmap.getMap().getOLMap().addOverlay).toHaveBeenCalled();
            });

            it("method --> 'getTooltipPosition' (Polygon)",function(){
                var geo = new ol.geom.Polygon([[[0, 0], [10, 12]], [[13, 14], [15, 16]], [[13, 12], [15, 17], [[27, 14], [15, 19]]]]);
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(geo,"getInteriorPoint").and.returnValue(new ol.geom.Point([0, 0]));
                expect(controller.getTooltipPosition(geo)).toEqual([0,0]);
                expect(geo.getInteriorPoint).toHaveBeenCalled();
            });
            
            it("method --> 'getTooltipPosition' (Linestring)",function(){
                var geo = new ol.geom.LineString([[0, 0], [10, 12], [13, 14], [15, 16]]);
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(geo,"getLastCoordinate").and.returnValue([0, 0]);
                expect(controller.getTooltipPosition(geo)).toEqual([0,0]);
                expect(geo.getLastCoordinate).toHaveBeenCalled();
            });
            
            it("method --> 'getTooltipPosition' (Circle)",function(){
                var geo = new ol.geom.Circle([0, 0], 5);
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(geo,"getCenter").and.returnValue([0, 0]);
                expect(controller.getTooltipPosition(geo)).toEqual([0,0]);
                expect(geo.getCenter).toHaveBeenCalled();
            });
            
            it("method --> 'getTooltipPosition' (Point)",function(){
                var geo = new ol.geom.Point([0, 0]);
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(geo,"getLastCoordinate").and.returnValue([0, 0]);
                expect(controller.getTooltipPosition(geo)).toEqual([0,0]);
                expect(geo.getLastCoordinate).toHaveBeenCalled();
            });
            
            it("method --> 'getTooltipPosition' (GeometryCollection)",function(){
                var geo = { "Type" : "GeometryCollection"};
                geo.getType = function(){
                    return this.Type;
                };
                var controller = ctrl('AppmeasureController', {$scope: scope});
                expect(controller.getTooltipPosition(geo)).not.toBeDefined();
            });
            
            it("method --> 'getTooltipPosition' (Other)",function(){
                var geo = { "Type" : "Other"};
                geo.getType = function(){
                    return this.Type;
                };
                geo.getLastCoordinate = function(){
                    return [0,0];
                };
                var controller = ctrl('AppmeasureController', {$scope: scope});
                expect(controller.getTooltipPosition(geo)).toEqual([0,0]);
            });

            it("method --> 'formatLength' (first else pass and second if pass)", function () {
                spyOn(document, "getElementById").and.returnValue(document.createElement('div'));
                var controller = ctrl('AppmeasureController', {$scope: scope});
                var line = new ol.geom.LineString([[0, 0], [10, 12], [13, 14], [15, 16]]);
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), "getCode").and.returnValue("EPSG:3857");
                spyOn(line, "getLength").and.returnValue(1001);
                expect(controller.formatLength(line)).toContain(" km");
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
                expect(line.getLength).toHaveBeenCalled();
            });

            it("method --> 'formatLength' (first else pass and second else pass)", function () {
                spyOn(document, "getElementById").and.returnValue(document.createElement('div'));
                var controller = ctrl('AppmeasureController', {$scope: scope});
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
                var controller = ctrl('AppmeasureController', {$scope: scope});
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
                var controller = ctrl('AppmeasureController', {$scope: scope});
                expect((Math.round(controller.calcDistance(Coord) / 1000 * 100) / 100)).toEqual(44.8);
                expect(oVmap.getMap().getOLMap().getView().getProjection).toHaveBeenCalled();
            });

            it("method --> 'calcDistance' (EPSG:3857)", function () {
                var Coord = [[345301.14925522, 5238880.01462925], [330953.848003819, 5244013.58040788], [306932.103766048, 5256199.02597311], [317020.543938679, 5262565.96105493], [317464.263428981, 5269309.02805617]];
                spyOn(oVmap.getMap().getOLMap().getView(), "getProjection").and.returnValue("EPSG:3857");
                var controller = ctrl('AppmeasureController', {$scope: scope});
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
                var controller = ctrl('AppmeasureController', {$scope: scope});
                expect((Math.round(line.getLength()) / 1000 * 100) / 100).toEqual(44.88);
                expect(controller.formatLength(line)).toEqual("44.88 km");
            });

            it("method --> 'formatCoordinate'", function () {
                var Point = new ol.geom.Point([0, 0]);
                var controller = ctrl('AppmeasureController', {$scope: scope});
                expect(controller.formatCoordinate(Point)).toEqual(['0.0000', '0.0000']);
            });

            it("method --> 'formatRadius' (first if not pass and second if pass)", function () {
                var myDivCheck = document.createElement('div');
                spyOn(document, "getElementById").and.returnValue(myDivCheck);
                var Circle = new ol.geom.Circle([0, 0], 5);
                var controller = ctrl('AppmeasureController', {$scope: scope});
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
                var controller = ctrl('AppmeasureController', {$scope: scope});
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
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(controller, "calcDistance").and.returnValue(1000);
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), "getCode").and.returnValue("EPSG:3857");
                expect(controller.formatRadius(Circle)).toContain(" m");
                expect(controller.calcDistance).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
            });

            it("method --> 'formatPerimeter'", function () {
                var Polygon = new ol.geom.Polygon([[[0, 0], [10, 12]], [[13, 14], [15, 16]], [[13, 12], [15, 17], [[27, 14], [15, 19]]]]);
                var controller = ctrl('AppmeasureController', {$scope: scope});
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
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(Polygon, "getArea").and.returnValue(1000001);
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), "getCode").and.returnValue("EPSG:3857");
                expect(controller.formatArea(Polygon)).toContain(" km²");
                expect(Polygon.getArea).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
            });

            it("method --> 'formatArea' (first if not pass second if not pass)", function () {
                var myDivCheck = document.createElement('div');
                spyOn(document, "getElementById").and.returnValue(myDivCheck);
                var Polygon = new ol.geom.Polygon([[[0, 0], [10, 12]], [[13, 14], [15, 16]], [[13, 12], [15, 17], [[27, 14], [15, 19]]]]);
                var controller = ctrl('AppmeasureController', {$scope: scope});
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
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(oVmap.getMap().getOLMap().getView().getProjection(), "getCode").and.returnValue("EPSG:3857");
                spyOn(controller.wgs84Sphere_, "geodesicArea").and.returnValue(10000);
                expect(controller.formatArea(Polygon)).toContain(" m²");
                expect(oVmap.getMap().getOLMap().getView().getProjection().getCode).toHaveBeenCalled();
                expect(controller.wgs84Sphere_.geodesicArea).toHaveBeenCalled();
            });
            it("method --> 'zoomToFeature' (Point)", function () {
                var Feature = new ol.Feature();
                spyOn(oVmap.getMap().getOLMap().getView(), "setCenter").and.callFake(Dummy);
                var controller = ctrl('AppmeasureController', {$scope: scope});
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
                var controller = ctrl('AppmeasureController', {$scope: scope});
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
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(Feature, "get").and.returnValue("Other");
                controller.zoomToFeature(Feature);
                expect(Feature.get).toHaveBeenCalled();
                expect(Feature.get.calls.count()).toEqual(3);
                expect(oVmap.getMap().getOLMap().getView().fitGeometry).toHaveBeenCalled();
            });

            it("method --> 'showHideAnotations' (if pass)", function () {
                var myDivCheck = document.createElement('input');
                spyOn(myDivCheck, "checked").and.returnValue(true);
                spyOn(document, "getElementById").and.returnValue(myDivCheck);
                var controller = ctrl('AppmeasureController', {$scope: scope});
                controller.showHideAnotations();
                expect(true).toBe(true);
            });

            it("method --> 'showHideAnotations' (if not pass)", function () {
                var myDivCheck = document.createElement('input');
                spyOn(document, "getElementById").and.returnValue(myDivCheck);
                var controller = ctrl('AppmeasureController', {$scope: scope});
                controller.showHideAnotations();
                expect(true).toBe(true);
            });

            it("method --> 'drawPoint' (if pass)", function () {
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(controller, "removeMeasuresInteractions").and.callThrough();
                spyOn(controller, "addInteraction").and.callFake(Dummy);
                spyOn($.fn,"hasClass").and.returnValue(true);
                controller.drawPoint();
                expect(controller.removeMeasuresInteractions).toHaveBeenCalled();
                expect(controller.addInteraction).not.toHaveBeenCalled();
            });
            
            it("method --> 'drawPoint' (if not pass)", function () {
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(controller, "removeMeasuresInteractions").and.callThrough();
                spyOn(controller, "addInteraction").and.callFake(Dummy);
                spyOn($.fn,"hasClass").and.returnValue(false);
                controller.drawPoint();
                expect(controller.removeMeasuresInteractions).toHaveBeenCalled();
                expect(controller.addInteraction).toHaveBeenCalled();
            });

            it("method --> 'measureLine' (if pass)", function () {
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(controller, "removeMeasuresInteractions").and.callThrough();
                spyOn(controller, "addInteraction").and.callFake(Dummy);
                spyOn($.fn,"hasClass").and.returnValue(true);
                controller.measureLine();
                expect(controller.removeMeasuresInteractions).toHaveBeenCalled();
                expect(controller.addInteraction).not.toHaveBeenCalled();
            });
            
            it("method --> 'measureLine' (if not pass)", function () {
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(controller, "removeMeasuresInteractions").and.callFake(Dummy);
                spyOn(controller, "addInteraction").and.callFake(Dummy);
                spyOn($.fn,"hasClass").and.returnValue(false);
                controller.measureLine();
                expect(controller.removeMeasuresInteractions).toHaveBeenCalled();
                expect(controller.addInteraction).toHaveBeenCalled();
            });

            it("method --> 'measurePolygon' (if pass)", function () {
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(controller, "removeMeasuresInteractions").and.callFake(Dummy);
                spyOn(controller, "addInteraction").and.callFake(Dummy);
                spyOn($.fn,"hasClass").and.returnValue(true);
                controller.measurePolygon();
                expect(controller.removeMeasuresInteractions).toHaveBeenCalled();
                expect(controller.addInteraction).not.toHaveBeenCalled();
            });
            
            it("method --> 'measurePolygon' (if not pass)", function () {
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(controller, "removeMeasuresInteractions").and.callFake(Dummy);
                spyOn(controller, "addInteraction").and.callFake(Dummy);
                spyOn($.fn,"hasClass").and.returnValue(false);
                controller.measurePolygon();
                expect(controller.removeMeasuresInteractions).toHaveBeenCalled();
                expect(controller.addInteraction).toHaveBeenCalled();
            });

            it("method --> 'measureCircle'", function () {
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(controller, "removeMeasuresInteractions").and.callThrough();
                spyOn(controller, "addInteraction").and.callFake(Dummy);
                controller.measureCircle();
                expect(controller.removeMeasuresInteractions).toHaveBeenCalled();
                expect(controller.addInteraction).toHaveBeenCalledWith("Circle");
            });

            it("method --> 'modifyFeature'", function () {
                spyOn(oVmap.getMap().getOLMap(), "addInteraction").and.callFake(Dummy);
                var controller = ctrl('AppmeasureController', {$scope: scope});
                controller.modifyFeature();
                expect(oVmap.getMap().getOLMap().addInteraction).toHaveBeenCalled();
            });

            it("method --> 'deleteFeature'", function () {
                spyOn(oVmap.getMap().getOLMap(), "addInteraction").and.callFake(Dummy);
                var controller = ctrl('AppmeasureController', {$scope: scope});
                controller.deleteFeature();
                expect(oVmap.getMap().getOLMap().addInteraction).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().addInteraction.calls.count()).toEqual(2);
            });

            it("method --> 'deleteAllFeatures'", function () {
                spyOn(oVmap.getMap().getOLMap().getOverlays(), "getArray").and.callThrough();
                spyOn(oVmap.getMap().getOLMap().getOverlays(),"remove").and.callFake(Dummy);
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(controller, "removeMeasuresInteractions").and.callFake(Dummy);
                controller.deleteAllFeatures();
                expect(controller.removeMeasuresInteractions).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().getOverlays().getArray).toHaveBeenCalled();
            });
            
            it("method --> 'removeMeasuresInteractions' (if pass)", function () {
                spyOn(oVmap.getMap().getOLMap(), "removeInteraction").and.callThrough();
                var controller = ctrl('AppmeasureController', {$scope: scope});
                var Feature = [];
                controller.createMeasureTooltip(Feature);
                controller.removeMeasuresInteractions();
                expect(oVmap.getMap().getOLMap().removeInteraction).toHaveBeenCalled();
                expect(oVmap.getMap().getOLMap().removeInteraction.calls.count()).toEqual(4);
            });
            
            it("method --> 'displayFeatures' (with empty Array)",function(){
                var controller = ctrl('AppmeasureController', {$scope: scope});
                var Feature = controller.oOpenLayersMeasureOverlay_;
                spyOn(Feature.getFeatures(),"getArray").and.returnValue([]);
                spyOn(JSON,"stringify").and.callFake(Dummy);
                spyOn(oVmap,"JSON2CSV").and.callFake(Dummy);
                spyOn(controller,"getPointsInfos").and.callFake(Dummy);
                spyOn($.fn,"attr").and.callFake(Dummy);
                controller.displayFeatures();
                expect(Feature.getFeatures().getArray).toHaveBeenCalled();
                expect(controller.getPointsInfos).not.toHaveBeenCalled();
                expect(JSON.stringify).not.toHaveBeenCalled();
                expect($.fn.attr).toHaveBeenCalled();
                expect(oVmap.JSON2CSV).not.toHaveBeenCalled();
            });
            
            it("method --> 'displayFeatures' (with Array)",function(){
                var controller = ctrl('AppmeasureController', {$scope: scope});
                var Feature = controller.oOpenLayersMeasureOverlay_;
                var Point = function(P){
                    this.Points = P; 
                };
                Point.prototype.getKeys = function(){
                    return "chablagou";
                };
                Point.prototype.get = function(){
                    return "chablagou";
                };
                var Sketch =[new Point([0,1]),new Point([0,0]),new Point([1,0])];
                spyOn(Feature.getFeatures(),"getArray").and.returnValue(Sketch);
                spyOn(JSON,"stringify").and.callFake(Dummy);
                spyOn(oVmap,"JSON2CSV").and.callFake(Dummy);
                spyOn(controller,"getPointsInfos").and.callFake(Dummy);
                spyOn($.fn,"attr").and.callFake(Dummy);
                controller.displayFeatures();
                expect(Feature.getFeatures().getArray).toHaveBeenCalled();
                expect(controller.getPointsInfos).toHaveBeenCalled();
                expect(JSON.stringify).toHaveBeenCalled();
                expect($.fn.attr).toHaveBeenCalled();
                expect(oVmap.JSON2CSV).toHaveBeenCalled();
            });
            
            it("method --> 'displayFeatures' (with other Array)",function(){
                var controller = ctrl('AppmeasureController', {$scope: scope});
                var Feature = controller.oOpenLayersMeasureOverlay_;
                var Point = function(P){
                    this.Points = P; 
                };
                Point.prototype.getKeys = function(){
                    return "geometry";
                };
                Point.prototype.get = function(){
                    return "chablagou";
                };
                var Sketch =[new Point([0,1]),new Point([0,0]),new Point([1,0])];
                spyOn(Feature.getFeatures(),"getArray").and.returnValue(Sketch);
                spyOn(JSON,"stringify").and.callFake(Dummy);
                spyOn(oVmap,"JSON2CSV").and.callFake(Dummy);
                spyOn(controller,"getPointsInfos").and.callFake(Dummy);
                spyOn($.fn,"attr").and.callFake(Dummy);
                controller.displayFeatures();
                expect(Feature.getFeatures().getArray).toHaveBeenCalled();
                expect(controller.getPointsInfos).toHaveBeenCalled();
                expect(JSON.stringify).toHaveBeenCalled();
                expect($.fn.attr).toHaveBeenCalled();
                expect(oVmap.JSON2CSV).toHaveBeenCalled();
            });
            
            it("method --> 'getPointsInfos' (Ligne)",function(){
                var myDivCheck = document.createElement('input');
                spyOn(myDivCheck, "checked").and.returnValue(true);
                spyOn(document, "getElementById").and.returnValue(myDivCheck);
                var Feature = new ol.Feature();
                var Line = new ol.geom.LineString([[0, 0], [10, 12], [13, 14], [15, 16]]);
                spyOn(Feature,"get").and.returnValue("Ligne");
                spyOn(Line,"getCoordinates").and.callThrough();
                spyOn(Line,"getLayout").and.callThrough(); 
                spyOn(Feature, "getGeometry").and.returnValue(Line);
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(controller,"formatLength").and.callThrough();
                var Infos = controller.getPointsInfos(Feature);
                expect(Infos.length).toEqual(4);
                expect(Feature.get).toHaveBeenCalled();
                expect(Line.getCoordinates).toHaveBeenCalled();
                expect(Line.getLayout).toHaveBeenCalled();
                expect(Line.getLayout.calls.count()).toEqual(4*(4-1));
                expect(controller.formatLength.calls.count()).toEqual(4*(4-1));
            });
            
            it("method --> 'getPointsInfos' (Polygone)",function(){
                var myDivCheck = document.createElement('input');
                spyOn(myDivCheck, "checked").and.returnValue(true);
                spyOn(document, "getElementById").and.returnValue(myDivCheck);
                var Feature = new ol.Feature();
                var Polygon = new ol.geom.Polygon([[[0, 0], [10, 12], [13, 14], [15, 16], [13, 12], [15, 17], [27, 14], [15, 19]]]);
                spyOn(Feature,"get").and.returnValue("Polygone");
                spyOn(Polygon,"getCoordinates").and.callThrough();
                spyOn(Polygon,"getLayout").and.callThrough(); 
                spyOn(Feature, "getGeometry").and.returnValue(Polygon);
                var controller = ctrl('AppmeasureController', {$scope: scope});
                spyOn(controller,"formatLength").and.callThrough();
                var Infos = controller.getPointsInfos(Feature);
                expect(Infos.length).toEqual(8);
                expect(Feature.get).toHaveBeenCalled();
                expect(Polygon.getCoordinates).toHaveBeenCalled();
                expect(Polygon.getLayout).toHaveBeenCalled();
                expect(Polygon.getLayout.calls.count()).toEqual(4*(8-1));
                expect(controller.formatLength.calls.count()).toEqual(4*(8-1));
            });
            
            it("method --> 'getPointsInfos' (first if not pass)",function(){
                var Feature = new ol.Feature();
                spyOn(Feature,"get").and.returnValue("Other Form");
                var controller = ctrl('AppmeasureController', {$scope: scope});
                expect(controller.getPointsInfos(Feature)).toEqual([]);
                expect(Feature.get).toHaveBeenCalled();
            });
        });
    });
});
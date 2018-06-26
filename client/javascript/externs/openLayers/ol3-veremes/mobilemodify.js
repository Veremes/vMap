/* global ol, goog */

goog.provide('ol.interaction.MobileModify');

goog.require('ol.interaction.Modify');

/**
 * @classdesc
 * Interaction for modifying feature geometries on mobile device.
 *
 * @constructor
 * @extends {ol.interaction.Pointer}
 * @param {olx.interaction.ModifyOptions} options Options.
 * @fires ol.interaction.Modify.Event
 * @api
 */
ol.interaction.MobileModify = function (options) {

    ol.interaction.Pointer.call(this, {
//        handleDownEvent: ol.interaction.MobileModify.handleDownEvent_,
//        handleDragEvent: ol.interaction.MobileModify.handleDragEvent_,
//        handleEvent: ol.interaction.MobileModify.handleEvent,
//        handleUpEvent: ol.interaction.MobileModify.handleUpEvent_
    });

    /**
     * @private
     * @type {ol.EventsConditionType}
     */
    this.condition_ = options.condition ?
            options.condition : ol.events.condition.primaryAction;


    /**
     * @private
     * @param {ol.MapBrowserEvent} mapBrowserEvent Browser event.
     * @return {boolean} Combined condition result.
     */
    this.defaultDeleteCondition_ = function (mapBrowserEvent) {
        return ol.events.condition.noModifierKeys(mapBrowserEvent) &&
                ol.events.condition.singleClick(mapBrowserEvent);
    };

    /**
     * @type {ol.EventsConditionType}
     * @private
     */
    this.deleteCondition_ = options.deleteCondition ?
            options.deleteCondition : this.defaultDeleteCondition_;

    /**
     * Editing vertex.
     * @type {ol.Feature}
     * @private
     */
    this.vertexFeature_ = null;

    /**
     * Segments intersecting {@link this.vertexFeature_} by segment uid.
     * @type {Object.<string, boolean>}
     * @private
     */
    this.vertexSegments_ = null;

    /**
     * @type {ol.Pixel}
     * @private
     */
    this.lastPixel_ = [0, 0];

    /**
     * Tracks if the next `singleclick` event should be ignored to prevent
     * accidental deletion right after vertex creation.
     * @type {boolean}
     * @private
     */
    this.ignoreNextSingleClick_ = false;

    /**
     * @type {boolean}
     * @private
     */
    this.modified_ = false;

    /**
     * Segment RTree for each layer
     * @type {ol.structs.RBush.<ol.ModifySegmentDataType>}
     * @private
     */
    this.rBush_ = new ol.structs.RBush();

    /**
     * @type {number}
     * @private
     */
    this.pixelTolerance_ = options.pixelTolerance !== undefined ?
            options.pixelTolerance : 10;

    /**
     * @type {number}
     * @private
     */
    this.hangingTolerance_ = options.hangingTolerance !== undefined ?
            options.hangingTolerance : 10;

    /**
     * @type {boolean}
     * @private
     */
    this.snappedToVertex_ = false;

    /**
     * Indicate whether the interaction is currently changing a feature's
     * coordinates.
     * @type {boolean}
     * @private
     */
    this.changingFeature_ = false;

    /**
     * @type {Array}
     * @private
     */
    this.dragSegments_ = [];

    /**
     * Draw overlay where sketch features are drawn.
     * @type {ol.layer.Vector}
     * @private
     */
    this.overlay_ = new ol.layer.Vector({
        source: new ol.source.Vector({
            useSpatialIndex: false,
            wrapX: !!options.wrapX
        }),
        style: options.style ? options.style :
                ol.interaction.Modify.getDefaultStyleFunction(),
        updateWhileAnimating: true,
        updateWhileInteracting: true
    });

    /**
     * @const
     * @private
     * @type {Object.<string, function(ol.Feature, ol.geom.Geometry)>}
     */
    this.SEGMENT_WRITERS_ = {
        'Point': this.writePointGeometry_,
        'LineString': this.writeLineStringGeometry_,
        'LinearRing': this.writeLineStringGeometry_,
        'Polygon': this.writePolygonGeometry_,
        'MultiPoint': this.writeMultiPointGeometry_,
        'MultiLineString': this.writeMultiLineStringGeometry_,
        'MultiPolygon': this.writeMultiPolygonGeometry_,
        'Circle': this.writeCircleGeometry_,
        'GeometryCollection': this.writeGeometryCollectionGeometry_
    };

    /**
     * @type {ol.Collection.<ol.Feature>}
     * @private
     */
    this.features_ = options.features;

    this.features_.forEach(this.addFeature_, this);
    ol.events.listen(this.features_, ol.CollectionEventType.ADD,
            this.handleFeatureAdd_, this);
    ol.events.listen(this.features_, ol.CollectionEventType.REMOVE,
            this.handleFeatureRemove_, this);

    /**
     * @type {ol.MapBrowserPointerEvent}
     * @private
     */
    this.lastPointerEvent_ = null;

};
ol.inherits(ol.interaction.MobileModify, ol.interaction.Modify);


/**
 * @param {ol.Pixel} pixel Pixel
 * @param {ol.Map} map Map.
 * @return {boolean} Start drag sequence?
 * @this {ol.interaction.MobileModify}
 * @private
 */
ol.interaction.MobileModify.prototype.likeDownEvent_ = function (pixel, map) {
//    if (!this.condition_(evt)) {
//        return false;
//    }
    this.handlePointerAtPixel_(pixel, map);
    var pixelCoordinate = map.getCoordinateFromPixel(pixel);
    this.dragSegments_.length = 0;
    this.modified_ = false;
    var vertexFeature = this.vertexFeature_;
    if (vertexFeature) {
        var insertVertices = [];
        var geometry = /** @type {ol.geom.Point} */ (vertexFeature.getGeometry());
        var vertex = geometry.getCoordinates();
        var vertexExtent = ol.extent.boundingExtent([vertex]);
        var segmentDataMatches = this.rBush_.getInExtent(vertexExtent);
        var componentSegments = {};
        segmentDataMatches.sort(ol.interaction.MobileModify.compareIndexes_);
        for (var i = 0, ii = segmentDataMatches.length; i < ii; ++i) {
            var segmentDataMatch = segmentDataMatches[i];
            var segment = segmentDataMatch.segment;
            var uid = ol.getUid(segmentDataMatch.feature);
            var depth = segmentDataMatch.depth;
            if (depth) {
                uid += '-' + depth.join('-'); // separate feature components
            }
            if (!componentSegments[uid]) {
                componentSegments[uid] = new Array(2);
            }
            if (segmentDataMatch.geometry.getType() === ol.geom.GeometryType.CIRCLE &&
                    segmentDataMatch.index === ol.interaction.MobileModify.MODIFY_SEGMENT_CIRCLE_CIRCUMFERENCE_INDEX) {

                var closestVertex = ol.interaction.Modify.closestOnSegmentData_(pixelCoordinate, segmentDataMatch);
                if (ol.coordinate.equals(closestVertex, vertex) && !componentSegments[uid][0]) {
                    this.dragSegments_.push([segmentDataMatch, 0]);
                    componentSegments[uid][0] = segmentDataMatch;
                }
            } else if (ol.coordinate.equals(segment[0], vertex) &&
                    !componentSegments[uid][0]) {
                this.dragSegments_.push([segmentDataMatch, 0]);
                componentSegments[uid][0] = segmentDataMatch;
            } else if (ol.coordinate.equals(segment[1], vertex) &&
                    !componentSegments[uid][1]) {

                // prevent dragging closed linestrings by the connecting node
                if ((segmentDataMatch.geometry.getType() ===
                        ol.geom.GeometryType.LINE_STRING ||
                        segmentDataMatch.geometry.getType() ===
                        ol.geom.GeometryType.MULTI_LINE_STRING) &&
                        componentSegments[uid][0] &&
                        componentSegments[uid][0].index === 0) {
                    continue;
                }

                this.dragSegments_.push([segmentDataMatch, 1]);
                componentSegments[uid][1] = segmentDataMatch;
            } else if (ol.getUid(segment) in this.vertexSegments_ &&
                    (!componentSegments[uid][0] && !componentSegments[uid][1])) {
                insertVertices.push([segmentDataMatch, vertex]);
            }
        }
        if (insertVertices.length) {
            console.error('willModifyFeatures_');
//            this.willModifyFeatures_(evt);
        }
        for (var j = insertVertices.length - 1; j >= 0; --j) {
            this.insertVertex_.apply(this, insertVertices[j]);
        }
    }
    return !!this.vertexFeature_;
};


/**
 * @param {array} coordinate
 * @this {ol.interaction.MobileModify}
 * @private
 */
ol.interaction.MobileModify.prototype.likeDragEvent_ = function (coordinate) {
    this.ignoreNextSingleClick_ = false;
//    this.willModifyFeatures_(evt);

//    var vertex = evt.coordinate;
    var vertex = coordinate;
    for (var i = 0, ii = this.dragSegments_.length; i < ii; ++i) {
        var dragSegment = this.dragSegments_[i];
        var segmentData = dragSegment[0];
        var depth = segmentData.depth;
        var geometry = segmentData.geometry;
        var coordinates;
        var segment = segmentData.segment;
        var index = dragSegment[1];

        while (vertex.length < geometry.getStride()) {
            vertex.push(segment[index][vertex.length]);
        }

        switch (geometry.getType()) {
            case ol.geom.GeometryType.POINT:
                coordinates = vertex;
                segment[0] = segment[1] = vertex;
                break;
            case ol.geom.GeometryType.MULTI_POINT:
                coordinates = geometry.getCoordinates();
                coordinates[segmentData.index] = vertex;
                segment[0] = segment[1] = vertex;
                break;
            case ol.geom.GeometryType.LINE_STRING:
                coordinates = geometry.getCoordinates();
                coordinates[segmentData.index + index] = vertex;
                segment[index] = vertex;
                break;
            case ol.geom.GeometryType.MULTI_LINE_STRING:
                coordinates = geometry.getCoordinates();
                coordinates[depth[0]][segmentData.index + index] = vertex;
                segment[index] = vertex;
                break;
            case ol.geom.GeometryType.POLYGON:
                coordinates = geometry.getCoordinates();
                coordinates[depth[0]][segmentData.index + index] = vertex;
                segment[index] = vertex;
                break;
            case ol.geom.GeometryType.MULTI_POLYGON:
                coordinates = geometry.getCoordinates();
                coordinates[depth[1]][depth[0]][segmentData.index + index] = vertex;
                segment[index] = vertex;
                break;
            case ol.geom.GeometryType.CIRCLE:
                segment[0] = segment[1] = vertex;
                if (segmentData.index === ol.interaction.MobileModify.MODIFY_SEGMENT_CIRCLE_CENTER_INDEX) {
                    this.changingFeature_ = true;
                    geometry.setCenter(vertex);
                    this.changingFeature_ = false;
                } else { // We're dragging the circle's circumference:
                    this.changingFeature_ = true;
                    geometry.setRadius(ol.coordinate.distance(geometry.getCenter(), vertex));
                    this.changingFeature_ = false;
                }
                break;
            default:
            // pass
        }

        if (coordinates) {
            this.setGeometryCoordinates_(geometry, coordinates);
        }
    }
    this.createOrUpdateVertexFeature_(vertex);
};


/**
 * @return {boolean} Stop drag sequence?
 * @this {ol.interaction.MobileModify}
 * @private
 */
ol.interaction.MobileModify.prototype.likeUpEvent_ = function () {
    var segmentData;
    var geometry;
    for (var i = this.dragSegments_.length - 1; i >= 0; --i) {
        segmentData = this.dragSegments_[i][0];
        geometry = segmentData.geometry;
        if (geometry.getType() === ol.geom.GeometryType.CIRCLE) {
            // Update a circle object in the R* bush:
            var coordinates = geometry.getCenter();
            var centerSegmentData = segmentData.featureSegments[0];
            var circumferenceSegmentData = segmentData.featureSegments[1];
            centerSegmentData.segment[0] = centerSegmentData.segment[1] = coordinates;
            circumferenceSegmentData.segment[0] = circumferenceSegmentData.segment[1] = coordinates;
            this.rBush_.update(ol.extent.createOrUpdateFromCoordinate(coordinates), centerSegmentData);
            this.rBush_.update(geometry.getExtent(), circumferenceSegmentData);
        } else {
            this.rBush_.update(ol.extent.boundingExtent(segmentData.segment),
                    segmentData);
        }
    }
    if (this.modified_) {
//        this.dispatchEvent(new ol.interaction.Modify.Event(
//                ol.interaction.ModifyEventType.MODIFYEND, this.features_, evt));
        this.modified_ = false;
    }
    return false;
};


/**
 * @param {ol.Pixel} pixel Pixel
 * @param {ol.Map} map Map.
 * @private
 */
ol.interaction.MobileModify.prototype.handlePointerAtPixel_ = function (pixel, map) {
    var pixelCoordinate = map.getCoordinateFromPixel(pixel);
    var sortByDistance = function (a, b) {
        return ol.interaction.Modify.pointDistanceToSegmentDataSquared_(pixelCoordinate, a) -
                ol.interaction.Modify.pointDistanceToSegmentDataSquared_(pixelCoordinate, b);
    };

    var box = ol.extent.buffer(
            ol.extent.createOrUpdateFromCoordinate(pixelCoordinate),
            map.getView().getResolution() * this.pixelTolerance_);

    var rBush = this.rBush_;
    var nodes = rBush.getInExtent(box);
    if (nodes.length > 0) {
        nodes.sort(sortByDistance);
        var node = nodes[0];
        var closestSegment = node.segment;
        var vertex = ol.interaction.Modify.closestOnSegmentData_(pixelCoordinate, node);
        var vertexPixel = map.getPixelFromCoordinate(vertex);
        var dist = ol.coordinate.distance(pixel, vertexPixel);
        if (dist <= this.pixelTolerance_) {
            var vertexSegments = {};

            if (node.geometry.getType() === ol.geom.GeometryType.CIRCLE &&
                    node.index === ol.interaction.MobileModify.MODIFY_SEGMENT_CIRCLE_CIRCUMFERENCE_INDEX) {

                this.snappedToVertex_ = true;
                this.createOrUpdateVertexFeature_(vertex);
            } else {
                var pixel1 = map.getPixelFromCoordinate(closestSegment[0]);
                var pixel2 = map.getPixelFromCoordinate(closestSegment[1]);
                var squaredDist1 = ol.coordinate.squaredDistance(vertexPixel, pixel1);
                var squaredDist2 = ol.coordinate.squaredDistance(vertexPixel, pixel2);
                dist = Math.sqrt(Math.min(squaredDist1, squaredDist2));
                this.snappedToVertex_ = dist <= this.hangingTolerance_;
                if (this.snappedToVertex_) {
                    vertex = squaredDist1 > squaredDist2 ?
                            closestSegment[1] : closestSegment[0];
                }
                this.createOrUpdateVertexFeature_(vertex);
                var segment;
                for (var i = 1, ii = nodes.length; i < ii; ++i) {
                    segment = nodes[i].segment;
                    if ((ol.coordinate.equals(closestSegment[0], segment[0]) &&
                            ol.coordinate.equals(closestSegment[1], segment[1]) ||
                            (ol.coordinate.equals(closestSegment[0], segment[1]) &&
                                    ol.coordinate.equals(closestSegment[1], segment[0])))) {
                        vertexSegments[ol.getUid(segment)] = true;
                    } else {
                        break;
                    }
                }
            }

            vertexSegments[ol.getUid(closestSegment)] = true;
            this.vertexSegments_ = vertexSegments;
            return;
        }
    }
    if (this.vertexFeature_) {
        this.overlay_.getSource().removeFeature(this.vertexFeature_);
        this.vertexFeature_ = null;
    }
};


/**
 * @param {ol.Pixel} pixel Pixel
 * @param {ol.Map} map Map. 
 * @private
 */
ol.interaction.MobileModify.prototype.handleMapMove_ = function (pixel, map) {

    this.lastPixel_ = pixel;
    this.handlePointerAtPixel_(pixel, map);
};


/**
 * @param {ol.Pixel} pixel Pixel
 * @param {ol.Map} map Map. 
 * @export
 */
ol.interaction.MobileModify.prototype.trackVertex = function (pixel, map) {

    this.trackVertexEvent_ = map.on('pointerdrag', function () {
        this.handleMapMove_(pixel, map);
    }, this);
};


/**
 * @export
 */
ol.interaction.MobileModify.prototype.untrackVertex = function () {

    ol.Observable.unByKey(this.trackVertexEvent_);
};


/**
 * @param {ol.Pixel} pixel Pixel
 * @param {ol.Map} map Map. 
 * @export
 */
ol.interaction.MobileModify.prototype.validateVertex = function (pixel, map) {

    this.untrackVertex();
    this.likeDownEvent_(pixel, map);
    this.dragVertex(pixel, map);
};


/**
 * @param {ol.Pixel} pixel Pixel
 * @param {ol.Map} map Map. 
 * @export
 */
ol.interaction.MobileModify.prototype.dragVertex = function (pixel, map) {

    this.dragVertexEvent_ = map.getView().on('change:center', function () {
        var pixelCoordinate = map.getCoordinateFromPixel(pixel);
        this.likeDragEvent_(pixelCoordinate);
    }, this);
    var pixelCoordinate = map.getCoordinateFromPixel(pixel);
    this.likeDragEvent_(pixelCoordinate);
};


/**
 * @export
 */
ol.interaction.MobileModify.prototype.undragVertex = function () {

    ol.Observable.unByKey(this.dragVertexEvent_);
};


/**
 * @param {ol.Pixel} pixel Pixel
 * @param {ol.Map} map Map. 
 * @export
 */
ol.interaction.MobileModify.prototype.validateGeometry = function (pixel, map) {

    this.likeUpEvent_();
    this.undragVertex();
    this.trackVertex(pixel, map);
};
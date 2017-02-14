/* global oVmap, nsVmap, goog, ol */

/**
 * @author: Armand Bahi
 * @Description: Fichier contenant la classe nsVmap.nsMapManager.nsMapModal.MapList
 * cette classe permet d'afficher la liste des cartes disponibles
 */

goog.provide('nsVmap.nsMapManager.nsMapModal.MapList');


/**
 * @classdesc
 * Class {@link nsVmap.nsMapManager.nsMapModal.MapList}: load the map list tool
 *
 * @constructor
 * @export
 */
nsVmap.nsMapManager.nsMapModal.MapList = function () {
	oVmap.log("nsVmap.nsMapManager.nsMapModal.MapList");

	// Directives et controleurs Angular
	oVmap.module.directive('appMaplist', this.maplistDirective);
	oVmap.module.controller('AppMaplistController', this.maplistController);
};

/**
 * 
 * @param {object} element
 * @export
 */
nsVmap.nsMapManager.nsMapModal.MapList.prototype.changeFilePath = function (element) {
	oVmap.log('nsVmap.nsMapManager.nsMapModal.MapList.prototype.changeFilePath');

	var fileName = $(element).val();
	var lastBackslash = fileName.lastIndexOf('\\');

	if (lastBackslash !== -1) {
		fileName = fileName.slice(lastBackslash + 1);
	}

	$("#upload-file-info").val(fileName);

	$("#upload-file-add-button").attr("url", "");

	$("#upload-file-add-button").attr("file-container", element.id);
};


/************************************************
 ---------- DIRECTIVES AND CONTROLLERS -----------
 *************************************************/

/**
 * map list directive
 * @return {angular.Directive} The directive specs.
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.MapList.prototype.maplistDirective = function () {
	oVmap.log("nsVmap.nsMapManager.nsMapModal.MapList.prototype.maplistDirective");
	return {
		restrict: 'E',
		scope: {
			'map': '=appMap',
			'lang': '=appLang'
		},
		controller: 'AppMaplistController',
		controllerAs: 'ctrl',
		bindToController: true,
		templateUrl: oVmap['properties']['vmap_folder'] + '/' + 'template/layers/mapmodal/maplist.html'
	};
};

/**
 * map list controller
 * @export
 * @constructor
 * @ngInject
 */
nsVmap.nsMapManager.nsMapModal.MapList.prototype.maplistController = function () {
	oVmap.log("nsVmap.nsMapManager.nsMapModal.MapList.prototype.maplistController");

	/**
	 * Future map url
	 * @type {string}
	 */
	this['newMapUrl'] = '';

	/**
	 * The maps catalog
	 * @type {object}
	 */
	this['catalog'] = oVmap.getMapManager().getMapModalTool().getMapCatalog();

	/**
	 * @type object
	 */
	this['projections'] = oVmap['oProjections'];


	this['mapForm'] = {
		'view': {}
	};

	// Active et configure le drag and drop

	/**
	 * The html drop zone
	 * @type {object}
	 * @api stable
	 */
	var dropZone = document.getElementById('maplist-file-drop-zone');

	/**
	 * Function called after the drop event
	 * @function
	 * @api experimental
	 */
	var ondrop = function (event) {
		event.stopPropagation();
		event.preventDefault();
		var files = event.dataTransfer.files;
		this.files = files;
		$('#upload-file-info').val(files[0].name);
		$('#upload-file-add-button').attr("file-container", this.id);

		this.className = 'upload-drop-zone';
		return false;
	};

	/**
	 * Function called after the dragover event
	 * @function
	 * @api experimental
	 */
	var ondragover = function (event) {
		this.className = 'upload-drop-zone drop';
		event.stopPropagation();
		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';
		return false;
	};

	/**
	 * Function called after the dragleave event
	 * @function
	 * @api experimental
	 */
	var ondragleave = function () {
		this.className = 'upload-drop-zone';
		return false;
	};

	dropZone.addEventListener('dragover', ondragover, false);
	dropZone.addEventListener('dragleave', ondragleave, false);
	dropZone.addEventListener('drop', ondrop, false);

};

/**
 * Initialize the "new map" form
 * @export
 */
nsVmap.nsMapManager.nsMapModal.MapList.prototype.maplistController.prototype.initNewMapForm = function () {
	oVmap.log('nsVmap.nsMapManager.nsMapModal.MapList.prototype.initNewMapForm');

	this['mapForm']['view'] = {
		'center': this['map'].getView().getCenter(),
		'zoom': this['map'].getView().getZoom(),
		'maxZoom': 28,
		'minZoom': 0,
		'projection': this['map'].getView().getProjection().getCode()
	};
};

/**
 * Creates a new map
 * @export
 */
nsVmap.nsMapManager.nsMapModal.MapList.prototype.maplistController.prototype.createNewMap = function () {
	oVmap.log('nsVmap.nsMapManager.nsMapModal.MapList.prototype.createNewMap');

	var newMap = {
		"name": "Tree",
		"children": [{
				"view": this['mapForm']['view']
			}]
	};
	
	
	// Change la variable oLayersTree
	oVmap.getMapManager().setLayersTree(newMap);

	// Simule le click de la souris sur le bouton "btn-reload-map"
	oVmap.getMapManager().reloadMap();
	
	// Met toutes les cartes à used = false
	var oMapCatalog_ = oVmap.getMapManager().getMapCatalog();
	for (var i = 0; i < oMapCatalog_['maps'].length; i++) {
		oMapCatalog_['maps'][i]['used'] = false;
	}
	
	// Recharge la légende et l'outil 'projection en cours'
	oVmap.layerAdded();
};

/**
 * Reproject the center whan changing map
 */
nsVmap.nsMapManager.nsMapModal.MapList.prototype.maplistController.prototype.reprojectCenter = function () {
	oVmap.log('nsVmap.nsMapManager.nsMapModal.MapList.prototype.maplistController.prototype.reprojectCenter');
	
	var currentProjeciton = this['map'].getView().getProjection();
	var projectedCoordinates = ol.proj.transform(this['mapForm']['view']['center'], currentProjeciton, this['mapForm']['view']['projection']);
	
	this['mapForm']['view']['center'] = projectedCoordinates;
};
/**
* @author: Armand Bahi
* @Description: Fichier contenant la classe nsVmap.nsMapManager.nsMapModal.LoadGeometry
* cette classe permet d'afficher les suggestions geometry'
*/

goog.provide('nsVmap.nsMapManager.nsMapModal.LoadGeometry');

/**
* @classdesc
* Class {@link nsVmap.nsMapManager.nsMapModal.LoadGeometry}: load the map list suggestions
*
* @constructor
* @export
*/
nsVmap.nsMapManager.nsMapModal.LoadGeometry = function(){oVmap.log("nsVmap.nsMapManager.nsMapModal.LoadGeometry");

  // Directives et controleurs Angular
  oVmap.module.directive('appLoadgeometry', this.loadgeometryDirective);
  oVmap.module.controller('AppLoadgeometryController', this.loadgeometryController);
}



/************************************************
---------- DIRECTIVES AND CONTROLLERS -----------
*************************************************/
/**
 * map list directive
 * @return {angular.Directive} The directive specs.
 * @export
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.LoadGeometry.prototype.loadgeometryDirective = function() {oVmap.log("nsVmap.loadgeometryDirective");
  return {
    restrict: 'E',
    scope: {
      'map': '=appMap',
      'lang': '=appLang'
    },
    controller: 'AppLoadgeometryController',
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: oVmap['properties']['vmap_folder'] + '/'+'template/layers/mapmodal/loadgeometry.html'
  };
};

/**
 * map list controller
 * @export
 * @ngInject
 * @constructor
 */
nsVmap.nsMapManager.nsMapModal.LoadGeometry.prototype.loadgeometryController = function() {oVmap.log("nsVmap.loadgeometryController");
  
  // Active et configure le drag and drop

  /**
  * The html drop zone
  * @type {object}
  * @api stable
  */
  var dropZone = document.getElementById('upload-geometry-file-drop-zone');

  /**
  * Function called after the drop event
  * @function
  * @api experimental
  */
  var ondrop = function(event) {
      event.stopPropagation();
      event.preventDefault();
      var files = event.dataTransfer.files;
      this.files = files;
      $('#upload-geometry-file-info').val(files[0].name);
      $('#upload-geometry-file-add-button').attr("file-container", this.id);
      this.className = 'upload-drop-zone';
      return false;
  }

  /**
  * Function called after the dragover event
  * @function
  * @api experimental
  */
  var ondragover = function(event) {
      this.className = 'upload-drop-zone drop';
      event.stopPropagation();
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      return false;
  }

  /**
  * Function called after the dragleave event
  * @function
  * @api experimental
  */
  var ondragleave = function() {
      this.className = 'upload-drop-zone';
      return false;
  }

  dropZone.addEventListener('dragover', ondragover, false);
  dropZone.addEventListener('dragleave', ondragleave, false);
  dropZone.addEventListener('drop', ondrop, false);
};
/* global goog */

/**
 * Ce fichier permet de charger les fichiers de façon non compilée
 * en fonction de la version en cours
 * @author: Armand Bahi
 */
goog.require("vitis");
goog.require('vitis.loadExternalFiles');
goog.require('vitis.config');
goog.require('vitis.application.config');
goog.require('vitis.loadApp');

// 
goog.require("vitis.services.main");
goog.require("vitis.services.form");
goog.require("vitis.modules.main");

// FormReader
goog.require('formReader');
goog.require('formReader.controller.formReaderController');
goog.require('formReader.directive.formReaderDirective');
goog.require('formReader.service.formReaderService');

// Controllers
goog.require('vitis.controllers.init');
goog.require('vitis.controllers.main');
goog.require('vitis.controllers.workspaceList');
goog.require('vitis.controllers.simpleForm');
goog.require('vitis.controllers.doubleForm');
goog.require('vitis.controllers.sectionForm');
goog.require('vitis.controllers.login');
goog.require('vitis.controllers.htmlForm');

// Directives
goog.require("vitis.directives.init");
goog.require("vitis.directives.main");
goog.require("vitis.directives.workspaceList");
goog.require("vitis.directives.simpleForm");
goog.require("vitis.directives.doubleForm");
goog.require("vitis.directives.sectionForm");
goog.require("vitis.directives.login");
goog.require("vitis.directives.htmlForm");

// Scripts
goog.require('vitis.script_client');

// Modules
goog.require('vitis.vitis');
goog.require('vitis.vitis.script_module');
goog.require('vitis.application.requires');
'use strict';

goog.provide('vitis.config');
goog.require('vitis');
goog.require('vitis.application.config');

// Crontrôleurs, directives, dépendances du noyau.
var oVitis = {
    "VM_VERSION": "2016-01.00",
    "VM_BUILD": "[BUILD]"
};

// Compteur des téléchargements en cours (loader ajax).
sessionStorage["loading_counter"] = 0;
/* global angular, goog */
// CUSTOM
//bloque les delete du destructeur à éviter
//'use strict';

/***********************************************************************************
 vmap_dessin Javascript
 ***********************************************************************************/

var oFormRequired = {
    "sUrl": "",
    "scope_": {},
    "toDestructor": []
};
/**
 * constructor_form
 * Fonction appelé à l'initialisation du formulaire si dans la structure json javascript vaut "true"
 * @param {type} scope
 * @param {type} s_url
 * @returns {undefined}
 */
var constructor_form = function (scope, s_url) {
    //////////////////////////////////////////////////////////
    //Ne pas toucher
    console.log("constructor_form");

    oFormRequired.sUrl = s_url;
    oFormRequired.scope_ = scope;
        
    var parseColorFromRGBA = function (rgba) {
        if (isRGBA(rgba)) {
            var matchColors = /rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
            var match = matchColors.exec(rgba);
            var color = match[1] + ' ' + match[2] + ' ' + match[3];
        } else {
            color = rgba;
        }
        return color;
    };

    var parseColorToRGBA = function (color) {
        if (isRGBA(color))
            var rgba = color;
        else
            var rgba = 'rgba(' + color.replace(/ /g, ',') + ',1)';
        return rgba;
    };

    var isRGBA = function (color) {
        if (color.substring(0, 4) === 'rgba')
            return true;
        else
            return false;
    };

    var beforeEvent = function (sMode) {
        scope['oFormValues'][sMode]['couleur_fond'] = parseColorFromRGBA(scope['oFormValues'][sMode]['couleur_fond']);
        scope['oFormValues'][sMode]['couleur_contour'] = parseColorFromRGBA(scope['oFormValues'][sMode]['couleur_contour']);
        scope['oFormValues'][sMode]['couleur_label'] = parseColorFromRGBA(scope['oFormValues'][sMode]['couleur_label']);
        scope['oFormValues'][sMode]['user_login'] = sessionStorage['user_login'];
    };
    
    if (angular.isDefined(scope['oFormValues']['update'])) {
        scope['oFormValues']['update']['couleur_fond'] = parseColorToRGBA(scope['oFormValues']['update']['couleur_fond']);
        scope['oFormValues']['update']['couleur_contour'] = parseColorToRGBA(scope['oFormValues']['update']['couleur_contour']);
        scope['oFormValues']['update']['couleur_label'] = parseColorToRGBA(scope['oFormValues']['update']['couleur_label']);
    }

    // Ajoute BeforeEvent
    scope['oFormDefinition']['update']['beforeEvent'] = function () {
        beforeEvent('update');
    };
    scope['oFormDefinition']['insert']['beforeEvent'] = function () {
        beforeEvent('insert');
    };

    //////////////////////////////////////////////////////////
    // Ajouter vos Elément à détruire (variable, function, watcher) à oFormRequired.toDestructor
};



/**
 * destructor_form
 * Fonction appelé quand on quitte le formulaire nettoie toute les fonctions pour les rendres inutilisable en dehors du formulaire
 * @returns {undefined}
 */
var destructor_form = function () {
    console.log("Destructor");

    for (var i = 0; i < oFormRequired.toDestructor.length; i++) {
        oFormRequired.toDestructor[i] = undefined;
        delete oFormRequired.toDestructor[i];
    }

    //supprimer la balise script du js pour pouvoir le recharger si on reviens sur le formulaire plus tard
    angular.element('[src="' + oFormRequired.sUrl + '?version=' + oFormRequired.scope_["oProperties"]["build"] + '"]').remove();

    oFormRequired = undefined;
    delete oFormRequired;

    constructor_form = undefined;
    delete constructor_form;
    destructor_form = undefined;
    delete destructor_form;
};

/**********************************************************************************/


/* global goog */

'use strict';

goog.provide("vitis");

/**
 * Vitis object
 * @export
 */
var vitisApp = function () {};

/**
 * Contains the vitisApp events
 * @type object
 */
vitisApp.oEvents = {};

/**
 * Add a function to a certain event
 * @param {string} eventName
 * @param {function} callback
 */
vitisApp.on = function (eventName, callback) {
    if (goog.isDefAndNotNull(vitisApp.oEvents[eventName])) {
        vitisApp.oEvents[eventName].push(callback);
    } else {
        vitisApp.oEvents[eventName] = [callback];
    }
};

/**
 * Broadcast all the function from a certain event
 * @param {string} eventName
 */
vitisApp.broadcast = function (eventName) {
    if (goog.isDefAndNotNull(vitisApp.oEvents[eventName])) {
        for (var i = 0; i < vitisApp.oEvents[eventName].length; i++) {
            vitisApp.oEvents[eventName][i].call();
        }
    }
};

/**
 * Convert some characters to HTML entities.
 * @param {string} sString
 * @return {string}
 */
vitisApp["htmlentities"] = function (sString) {
    var aCharToEncode = ["à", "â", "ç", "è", "é", "ê", "î", "ï", "ô", "ù", "û"];
    return sString.replace(/./gm, function (s) {
        if (aCharToEncode.indexOf(s) != -1)
            return "&#" + s.charCodeAt(0) + ";";
        else
            return s;
    });
};

/**
 * Allow sub-modals creating backtops on the parents element
 */
$(document).ready(function () {
    $(document).on('show.bs.modal', '.modal', function (event) {
        $(this).parent().append('<div class="submodal-backdrop modal-backdrop fade in"></div>');
    });
    $(document).on('hide.bs.modal', '.modal', function (event) {
        $(this).parent().find('.submodal-backdrop').remove();
    });
});

/**
 * Remove the accents from a, e, i, o, u, n, c
 * @returns {String}
 */
String.prototype.withoutAccents = function () {
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g // C, c
    ];
    var noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

    var str = this;
    for (var i = 0; i < accent.length; i++) {
        str = str.replace(accent[i], noaccent[i]);
    }

    return str;
};

/**
 * Remove from the string the URL params defined in aForbiddenParams
 * @param {array} aForbiddenParams
 * @returns {String}
 */
String.prototype.removeURLParams = function (aForbiddenParams) {

    var sUrl = this;
    var paramIndex, nextParamIndex;

    for (var i = 0; i < aForbiddenParams.length; i++) {

        // Cas où le paramètre commence par &
        paramIndex = sUrl.toLowerCase().indexOf('&' + aForbiddenParams[i] + '=');
        if (paramIndex !== -1) {

            // Index du prochain paramètre (où de la fin de la chaine)
            nextParamIndex = sUrl.toLowerCase().indexOf('&', paramIndex + 1);

            // Enlève le paramètre de la chaine
            if (nextParamIndex > 0) {
                sUrl = sUrl.replace(sUrl.slice(paramIndex, nextParamIndex), '');
            }else{
                sUrl = sUrl.replace(sUrl.slice(paramIndex), '');
            }
            continue;
        }

        // Cas où le paramètre commence par ?
        paramIndex = sUrl.toLowerCase().indexOf('?' + aForbiddenParams[i] + '=');
        if (paramIndex !== -1) {

            // Index du prochain paramètre (où de la fin de la chaine)
            nextParamIndex = sUrl.toLowerCase().indexOf('&', paramIndex + 1);

            // Enlève le paramètre de la chaine
            if (nextParamIndex > 0) {
                sUrl = sUrl.replace(sUrl.slice(paramIndex, nextParamIndex + 1), '?');
            }else{
                sUrl = sUrl.replace(sUrl.slice(paramIndex), '');
            }
            continue;
        }
    }
    return sUrl;
};
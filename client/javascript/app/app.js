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
vitisApp.on = function(eventName, callback){
    if (goog.isDefAndNotNull(vitisApp.oEvents[eventName])) {
        vitisApp.oEvents[eventName].push(callback);
    }else{
        vitisApp.oEvents[eventName] = [callback];
    }
};

/**
 * Broadcast all the function from a certain event
 * @param {string} eventName
 */
vitisApp.broadcast = function(eventName){
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
vitisApp["htmlentities"] = function(sString) {
    var aCharToEncode = ["à","â","ç","è","é","ê","î","ï","ô","ù","û"];
    return sString.replace(/./gm, function(s) {
        if (aCharToEncode.indexOf(s) != -1)
            return "&#" + s.charCodeAt(0) + ";";
        else
            return s;
    });
};
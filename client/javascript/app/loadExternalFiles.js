/* global goog */

'use strict';

goog.provide('vitis.loadExternalFiles');

/************************************************************************************
 Chargement dynamique de script js.
 \aScript : tableau contenant l'url des script js
 \oOptions : objet contenant les paramètres optionnels suivants:
 - callback : Fonction à appeler après le chargement de tous les scripts js.
 - async : booléen pour activer (défaut) / désac. l'exécution asynchrone.
 - scriptInBody : charge le script dans l'élément <body> (par défaut dans le <head>).
 ************************************************************************************/
function loadExternalJs(aScript, oOptions) {
    var sBuild = Date.now();
    if (typeof(oClientProperties) != "undefined")
        sBuild = oClientProperties["build"];
    if (typeof (aScript) == "object" && aScript != null) {
        var callback;
        var bAsync = true;
        var bScriptInBody = false;
        if (typeof (oOptions) === "object") {
            callback = oOptions['callback'];
            if (typeof (oOptions['async']) === "boolean")
                bAsync = oOptions['async'];
            if (typeof (oOptions['scriptInBody']) === "boolean")
                bScriptInBody = oOptions['scriptInBody'];
        }

        // Liste des scripts js déja chargés.	
        var oScript = document.getElementsByTagName('script');
        var aDownloadedScript = new Array();
        var i = 0;
        while (i < oScript.length) {
            if (oScript[i].src !== "")
                aDownloadedScript.push(oScript[i].src);
            i++;
        }

        // Liste des scripts à charger.
        i = 0;
        var aScriptToDl = new Array();
        while (i < aScript.length) {
            aScript[i] = aScript[i] + "?version=" + sBuild;
            oScript = document.createElement('script');
            oScript.setAttribute('src', aScript[i]);
            if (in_array(oScript.src, aDownloadedScript) === -1) {
                aScriptToDl.push(aScript[i]);
            } else
                console.log(aScript[i] + " -> déja chargé");
            i++;
        }

        // Charge les scripts js (sauf ceux déja chargés)
        i = 0;
        while (i < aScriptToDl.length) {
            oScript = document.createElement('script');
            oScript.setAttribute('src', aScriptToDl[i]);
            oScript.async = bAsync;
            oScript.setAttribute('type', 'text/javascript');            
            // function à appeler après le chargement de tous les scripts ?
            if (typeof (callback) === "function") {
                var loadJsFnc = function () {
                    if (typeof (callback.iNbCall) === "undefined")
                        callback.iNbCall = 0;
                    callback.iNbCall++;
                    if (callback.iNbCall === aScriptToDl.length) {
                        callback();
                        this.onload = null;
                    }
                };
                // L'évenement 'onload' de l'élément <script> n'existe pas sur IE8 et <
                if (oScript.onload !== undefined)
                    oScript.onload = loadJsFnc;
                else if (oScript.onreadystatechange !== undefined) {
                    oScript.onreadystatechange = function () {
                        if (this.readyState === 'loaded' || this.readyState === 'complete')
                            loadJsFnc();
                    };
                }
            }
            if (bScriptInBody)
                document.getElementsByTagName("body")[0].appendChild(oScript);
            else
                document.getElementsByTagName("head")[0].appendChild(oScript);
            i++;
        }
        // Si tous les scripts sont déja chargés : exécute la fonction.
        if (aScriptToDl.length === 0 && typeof (callback) === "function") {                
            callback();
        }
    }
}

/*******************************************************************
 Chargement dynamique de feuille de style.
 /aStyleSheet : tableau contenant l'url des feuilles de style
 *******************************************************************/
function loadExternalCss(aStyleSheet) {
    if (typeof (aStyleSheet) == "object" && aStyleSheet != null) {
        var sBuild = Date.now();
        if (typeof(oClientProperties) != "undefined")
            sBuild = oClientProperties["build"];
        // Liste des css déja chargés.	
        var oLink = document.getElementsByTagName('link');
        var aDownloadedCss = new Array();
        var i = 0;
        while (i < oLink.length) {
            if (oLink[i].href != "")
                aDownloadedCss.push(oLink[i].href);
            i++;
        }

        // Charge les css (sauf ceux déja chargés)
        var i = 0, bLessRefresh = false;
        while (i < aStyleSheet.length) {
            aStyleSheet[i] = aStyleSheet[i] + "?version=" + sBuild;
            oLink = document.createElement('link');
            oLink.setAttribute('href', aStyleSheet[i]);
            if (in_array(oLink.href, aDownloadedCss) == -1) {
                oLink.setAttribute('type', 'text/css');
                // Fichier .css ou .less ?
                if (aStyleSheet[i].indexOf(".less") == -1) {
                    oLink.setAttribute('rel', 'stylesheet');
                    document.getElementsByTagName("head")[0].appendChild(oLink);
                } else {
                    oLink.setAttribute('rel', 'stylesheet/less');
                    less['sheets'].push(oLink);
                    bLessRefresh = true;
                }
            } else
                console.log(aStyleSheet[i] + " -> déja chargé");
            i++;
        }
        // Si des fichiers .less sont ajoutés, il faut les compiler.
        if (bLessRefresh)
            less['refresh']();
    }
}

/*******************************************************************
 Indique si une valeur appartient à un tableau (idem fonction PHP).
 @sValue : La valeur recherchée.
 @aArray : Le tableau.
 *******************************************************************/
function in_array(sValue, aArray) {
    var iReturn = -1;
    if (typeof (aArray.indexOf) != "undefined") {
        iReturn = aArray.indexOf(sValue);
    } else {
        // Pas de méthode "indexOf" pour les tableaux sur IE8 et <.	
        var i = 0;
        while (i < aArray) {
            if (aArray[i].indexOf(sValue) != -1) {
                iReturn = i;
                break;
            }
            i++;
        }
    }
    return iReturn;
}

/************************************************************************************
 Chargement ajax utilisant l'objet natif XMLHttpRequest du navigateur
 \oOptions : objet contenant les paramètres suivants:
 - async : booléen pour activer (défaut) / désac. le chargement asynchrone.
 ************************************************************************************/
function ajaxNativeRequest(oOptions) {
    if (typeof (oOptions) == "object" && typeof (oOptions['url']) == "string") {
        var bAsync = true;
        var sMethod = "GET";
        var sParams = null;
        if (typeof (oOptions['async']) == "boolean")
            bAsync = oOptions['async'];
        if (typeof (oOptions['method']) == "string")
            sMethod = oOptions['method'];
        sMethod = sMethod.toUpperCase();
        if (typeof (oOptions['params']) == "string")
            sParams = oOptions['params'];
        //
        var xhr = new XMLHttpRequest();
        //xhr.onload = function() {"done"};
        xhr.open(sMethod, oOptions['url'] + ((/\?/).test(oOptions['url']) ? "&_" : "?_") + Math.random().toString().substr(2), true, bAsync);
        xhr.onreadystatechange = function (aEvt) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (typeof (oOptions['success']) == "function")
                        oOptions['success'](xhr.responseText);
                } else {
                    if (typeof (oOptions['error']) == "function")
                        oOptions['error'](xhr.responseText);
                }
            }
        }
        if (sMethod == "POST")
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(sParams);
    }
}

/**
 * showAjaxLoader function.
 * Ajoute au DOM un loader modal pendant le téléchargement de fichiers.
 **/
function showAjaxLoader() {
    if (document.getElementById("ajax-modal") === null) {
        // Elément opaque sur toute la surface de l'écran.
        var oAjaxModal = document.createElement('div');
        oAjaxModal.id = "ajax-modal";
        oAjaxModal.className = "modal-backdrop fade in"; // ajax_loader modal-content
        oAjaxModal.style.opacity = "0.2";
        oAjaxModal.style['z-index'] = "9999";
        document.getElementsByTagName("body")[0].appendChild(oAjaxModal);
    }
    if (document.getElementById("ajax-container") === null) {
        // Elément contenant le loader Ajax.
        var oAjaxLoader = document.createElement('div');
        var oAjaxLoaderSpan = document.createElement('span');
        oAjaxLoader.id = "ajax-container";
        oAjaxLoader.className = "ajax_loader_container";
        oAjaxLoaderSpan.className = "icon-refresh glyphicon-refresh-animate";
        oAjaxLoader.appendChild(oAjaxLoaderSpan);
        document.getElementsByTagName("body")[0].appendChild(oAjaxLoader);
    }
}

/**
 * hideAjaxLoader function.
 * Supprime le loader "modal" du DOM.
 **/
function hideAjaxLoader() {
    sessionStorage["loading_counter"] = 0;
    // Supprime l'élément "modal".
    var oAjaxModal = document.getElementById("ajax-modal");
    if (oAjaxModal != null)
        oAjaxModal.parentNode.removeChild(oAjaxModal);
    // Supprime l'élément du loader.
    var oAjaxLoader = document.getElementById("ajax-container");
    if (oAjaxLoader != null)
        oAjaxLoader.parentNode.removeChild(oAjaxLoader);
}
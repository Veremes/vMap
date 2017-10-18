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
    if (typeof (oClientProperties) != "undefined")
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
        if (typeof (oClientProperties) != "undefined")
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

/**
 * ajaxRequest function
 * Envoi d'une requête ajax.
 * @param {object} Options Paramètres de la requête.
 * @param {boolean|undefined} Options.async Définit si la requête doit être lancée de manière asynchrone
 * @param {object|undefined} Options.headers Headers à rajouter à la requette
 * @param {string|undefined} Options.responseType Type de réponse ("", "text", "json", "blob", "arraybuffer", "document")
 * @param {string} Options.method Type de méthode ("GET", "PUT", "POST", "DELETE")
 * @param {string} Options.url URL cible
 * @param {function} Options.success Fonction appellée quand la requête se termine correctement
 * @param {function|undefined} Options.error Fonction appellée quand la requête se termine par une erreur
 * @param {function|undefined} Options.aborded Fonction appellée quand la requête est annulée
 * @param {object|undefined} Options.scope Angular scope de l'appelant à la fonctions
 * @param {object|undefined} Options.params Paramètres à ajouter dans l'URL
 * @param {object|undefined} Options.data Paramètres à rajouter dans le body
 * @param {number|undefined} Options.timeout Timeout en milisecondes permettant d'annuler la requête
 * @param {Promise|undefined} Options.abord Promesse angular permettant d'annuler la requête
 * @param {boolean|undefined} Options.disconnect Déconnexion ou non de l'application en cas d'erreur. 
 * @export
 **/
function ajaxRequest(oOptions) {
    var xhr = new XMLHttpRequest();

    // URL de l'api (sans le port)
    var sServiceUrl = angular.copy(oClientProperties['web_server_name']);
    if (sServiceUrl.indexOf(':', 6) !== -1) {
        sServiceUrl = sServiceUrl.substr(0, sServiceUrl.indexOf(':', 6));
    }

    // Booléen qui définit si une URL vient du serveur Vitis pour savoir si il faut renseigner le token
    var isSelfUrl = false;
    if (oOptions['url'].substr(0, sServiceUrl.length) === sServiceUrl) {
        isSelfUrl = true;
    }

    // Si l'url est celle du proxy, il ne faudra surtout pas renseigner le token
    if (typeof (oClientProperties['proxy_url']) == "string" && oOptions['url'].substr(0, oClientProperties['proxy_url'].length) === oClientProperties['proxy_url']) {
        isSelfUrl = false;
    }

    // Paramètres de l'entête par défaut.
    var oHeaders = {
        'Accept': 'application/json',
        // 'Content-Type':  // Ne rien mettre
        // 'X-HTTP-Method-Override': 'GET'
        // 'Content-type': 'application/x-www-form-urlencoded'
        // withCredentials ???
        //charset=UTF-8
    };
    // Token renseigné uniquement si l'URL cible est du même serveur
    if (isSelfUrl) {
        oHeaders['Token'] = sessionStorage['session_token'];
    }

    // Requête asynchrone.
    if (typeof (oOptions['async']) == 'undefined')
        oOptions['async'] = true;
    // Paramètres de l'entête.
    if (typeof (oOptions['headers']) != 'undefined')
        mergeObject(oHeaders, oOptions['headers']);

    if (!goog.isDefAndNotNull(oOptions['timeout'])) {
        if (goog.isDefAndNotNull(oClientProperties['max_request_time'])) {
            oOptions['timeout'] = oClientProperties['max_request_time'] * 1000;
        }
    }
    // Type de réponse
    switch (oOptions['responseType']) {
        case '':
            //xhr.responseType = '';
            break;
        case 'text':
            //xhr.responseType = 'text';
            break;
        case 'json':
            //xhr.responseType = 'json';
            break;
        case 'blob':
            //xhr.responseType = 'blob';
            break;
        case 'arraybuffer':
            //xhr.responseType = 'arraybuffer';
            break;
        case 'document':
            //xhr.responseType = 'document';
            break;
        default:
            //xhr.responseType = 'json';
            oOptions['responseType'] = 'json';
            break;
    }
    // Paramètre "disconnect" par défaut.
    if (typeof (oOptions["disconnect"]) == "undefined")
        oOptions['disconnect'] = true;

    // Paramètres 'method' et 'url' obligatoires.
    if (typeof (oOptions['method']) != 'undefined' && typeof (oOptions['url']) != 'undefined') {
        // Traitement à la fin de la requête.
        xhr.onreadystatechange = function (event) {
            // Requête terminée.
            if (this['readyState'] === XMLHttpRequest.DONE) {

                switch (oOptions['responseType']) {
                    case '':
                    case 'text':
                        var oResponse = {
                            'data': this.responseText,
                            'status': this['status'],
                            'statusText': this['statusText']
                        };
                        break;
                    default:
                        var oResponse = {
                            'data': this.response,
                            'status': this['status'],
                            'statusText': this['statusText']
                        };
                        break;
                }
                // BUG IE : retourne une réponse json au format texte.
                if (goog.isDefAndNotNull(oResponse["data"]) && oOptions['responseType'] == 'json' && typeof (oResponse["data"]) == "string")
                    oResponse["data"] = JSON.parse(oResponse["data"]);

                // Succès de la requête.
                if (this['status'] === 200) {
                    var bRequestError = false;
                    // Message d'erreur si token expiré ou invalide.
                    if (oOptions['responseType'] == 'json' && goog.isDefAndNotNull(oResponse["data"]) && typeof(oResponse["data"]) == "object") {
                        // 
                        var sessionSrvc = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["sessionSrvc"]);
                        var externFunctionSrvc = angular.element(vitisApp.appHtmlFormDrtv).injector().get(["externFunctionSrvc"]);
                        var oModalOptions = {
                            "className": "modal-danger",
                            "buttons": {
                                "ok": {
                                    label: "OK",
                                    className: "btn-default"
                                }
                            },
                            "callback": function () {
                                if (oOptions["disconnect"] === true)
                                    sessionSrvc["disconnect"]();
                            }
                        };
                        var sTitle = "";
                        if (goog.isDefAndNotNull(oResponse["data"])) {
                            switch (oResponse["data"]["errorCode"]) {
                                // Token expiré.
                                case 15:
                                    // Paramètres de la fenêtre modale.
                                    sTitle = "EXPIRED_TOKEN_ERROR_TITLE";
                                    if (oOptions["disconnect"] === true)
                                        oModalOptions["message"] = "EXPIRED_TOKEN_ERROR";
                                    else
                                        oModalOptions["message"] = "EXPIRED_TOKEN_NO_DISCONNECT_ERROR";
                                    break;
                                    // Token invalide.
                                case 16:
                                    // Paramètres de la fenêtre modale.
                                    sTitle = "INVALID_TOKEN_ERROR_TITLE";
                                    if (oOptions["disconnect"] === true)
                                        oModalOptions["message"] = "INVALID_TOKEN_ERROR";
                                    else
                                        oModalOptions["message"] = "INVALID_TOKEN_NO_DISCONNECT_ERROR";
                                    break;
                            }
                        }
                        // Affichage de la fenêtre modale.
                        if (goog.isDef(oModalOptions["message"]))
                            externFunctionSrvc["modalWindow"]("alert", sTitle, oModalOptions);
                    }
                    // Fonctions de callback.
                    if (!bRequestError) {
                        if (typeof (oOptions['success']) == 'function') {
                            // Si un scope d'Angular est passé en paramètre : évaluation de la fonction dans ce scope.
                            if (typeof (oOptions['scope']) != 'undefined')
                                oOptions['scope'].$applyAsync(oOptions['success'](oResponse));
                            else
                                oOptions['success'](oResponse);
                        }
                    }
                } else {
                    // Requête annulée ?
                    if (xhr['aborded'] === true) {
                        if (typeof (oOptions['aborded']) == 'function') {
                            // Si un scope d'Angular est passé en paramètre : évaluation de la fonction dans ce scope.
                            if (typeof (oOptions['scope']) != 'undefined')
                                oOptions['scope'].$applyAsync(oOptions['aborded'](oResponse));
                            else
                                oOptions['aborded'](oResponse);
                        }
                    } else {
                        console.error(oOptions['url'], this);
                        if (typeof (oOptions['error']) == 'function') {
                            // Si un scope d'Angular est passé en paramètre : évaluation de la fonction dans ce scope.
                            if (typeof (oOptions['scope']) != 'undefined')
                                oOptions['scope'].$applyAsync(oOptions['error'](oResponse));
                            else
                                oOptions['error'](oResponse);
                        }
                    }
                }

                // Timeout car si les données sont en cache iLoadingCounter-- se fait avant iLoadingCounter++
                setTimeout(function () {
                    // Maj du compteur des téléchargements en cours.
                    var iLoadingCounter = parseInt(sessionStorage['loading_counter']);
                    if (iLoadingCounter > 0)
                        iLoadingCounter--;
                    else
                        iLoadingCounter = 0;
                    sessionStorage['loading_counter'] = iLoadingCounter;
                    // Si tous les chargements sont terminés : supprime le loader.
                    if (iLoadingCounter === 0) {
                        hideAjaxLoader();
                    }
                });
            }
        };

        // Paramètres à passer dans l'url.
        if (oOptions['url'].indexOf('?') === -1) {
            oOptions['url'] += '?vitis_version=' + sessionStorage['build'];
        } else {
            oOptions['url'] += '&vitis_version=' + sessionStorage['build'];
        }

        if (typeof (oOptions['params']) != 'undefined') {
            oOptions['params'] = cleanObject(oOptions['params'], oOptions['url']);
            for (var sParamKey in oOptions['params']) {
                if (goog.isObject(oOptions['params'][sParamKey])) {
                    oOptions['params'][sParamKey] = JSON.stringify(oOptions['params'][sParamKey]);
                }
                oOptions['url'] += '&' + sParamKey + '=' + encodeURIComponent(oOptions['params'][sParamKey]);
            }
        }
        // Paramètre "responseType" (sauf pour IE).
        if (navigator.userAgent.indexOf("Trident") == -1)
            xhr.responseType = oOptions['responseType'];
        // Préparation de la requête.
        xhr.open(oOptions['method'], oOptions['url'], oOptions['async']);
        // BUG IE : paramètre "responseType" après open (sinon exception avec internet explorer).
        if (navigator.userAgent.indexOf("Trident") != -1)
            xhr.responseType = oOptions['responseType'];
        // Paramètres de l'entête.
        for (var sHeaderKey in oHeaders) {
            xhr.setRequestHeader(sHeaderKey, oHeaders[sHeaderKey]);
        }
        //
        var requestData = null;
        if (typeof (oOptions['data']) != 'undefined') {
            if (goog.isObject(oOptions['data'])) {
                // Type FormData ?
                if (oOptions['data'] instanceof FormData) {
                    requestData = oOptions['data'];
                } else {
                    requestData = JSON.stringify(cleanObject(oOptions['data'], oOptions['url']));
                }
            }
        }
        // Envoi de la requête.
        xhr.send(requestData);
        // Affiche le loader.
        if (sessionStorage['ajaxLoader'] == 'true')
            showAjaxLoader();
        // Maj du compteur des téléchargements en cours.
        var iLoadingCounter = parseInt(sessionStorage['loading_counter']);
        iLoadingCounter++;
        sessionStorage['loading_counter'] = iLoadingCounter;

        // Timeout
        if (goog.isNumber(oOptions['timeout'])) {
            setTimeout(function () {
                if (xhr['readyState'] !== 4 && xhr['aborded'] !== true) {
                    var iSeconds = oOptions['timeout'] / 1000;
                    var intervalID, dialog;
                    var setDialog = function () {
                        dialog = bootbox.confirm({
                            message: 'Requête sans réponse',
                            buttons: {
                                confirm: {
                                    label: 'Annuler',
                                    className: 'btn-success'
                                },
                                cancel: {
                                    label: 'Attendre',
                                    className: 'btn-default'
                                }
                            },
                            callback: function (abord) {
                                // Annuler ?
                                if (abord) {
                                    xhr.abort();
                                    console.info('request aborded');
                                    clearInterval(intervalID);
                                } else {
                                    setTimeout(function () {
                                        if (xhr['readyState'] !== 4) {
                                            setDialog();
                                        }
                                    }, oOptions['timeout']);
                                }
                            }
                        });
                    };
                    setDialog();
                    dialog.init(function () {
                        var updateTitle = function () {
                            var sMessage = '<h4>Requête sans réponse depuis ' + iSeconds + 's...</h4>';
                            dialog.find('.bootbox-body').html(sMessage);
                        }
                        intervalID = window.setInterval(function () {
                            if (xhr['readyState'] === 4) {
                                dialog.modal('hide');
                                clearInterval(intervalID);
                            }
                            if (iSeconds > 100) {
                                xhr.abort();
                                console.info('request aborded');
                                clearInterval(intervalID);
                            }
                            updateTitle();
                            iSeconds++;
                        }, 1000);
                        updateTitle();
                    });
                }
            }, oOptions['timeout']);
        }
        // Abord
        if (goog.isObject(oOptions['abord'])) {
            if (goog.isFunction(oOptions['abord'].then)) {
                oOptions['abord'].then(function () {
                    xhr['aborded'] = true;
                    xhr.abort();
                }, function () {
                    xhr['aborded'] = true;
                    xhr.abort();
                });
            }
        }
    }
}

/**
 * mergeObject function.
 * Fusionne .
 **/
function mergeObject(oTarget, oSource) {
    for (var sKey in oSource) {
        oTarget[sKey] = oSource[sKey];
    }
}

/**
 * Nettoie un objet en enlevant les valeurs undefined
 * @param {object} oObject
 * @returns {object}
 */
function cleanObject(oObject, sUrl) {
    for (var key in oObject) {
        if (!goog.isDef(oObject[key])) {
            goog.object.remove(oObject, key);
        }
        if (key === 'token' || oObject[key] === sessionStorage['session_token']) {
            console.error('Token in params:', oObject, sUrl);
            alert('Attention: token passé en paramètre');
            goog.object.remove(oObject, key);
        }
    }
    return oObject;
}
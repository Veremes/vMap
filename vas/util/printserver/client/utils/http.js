/* global ol */

if (typeof nsUtils == 'undefined') {
    nsUtils = {};
}

/**
 * Class Http (requires utils)
 * Get usefull functions to use ajax http services
 * @returns {nsUtils.Http}
 */
nsUtils.Http = function () {


};

/**
 * Execute a Get method and run the success/error functions
 * @param {object} opt_options
 * @param {string} opt_options.url
 * @param {object} opt_options.params
 * @param {boolean} opt_options.async
 * @param {object} opt_options.this
 * @param {funciton} opt_options.successCallback
 * @param {funciton} opt_options.errorCallback
 */
nsUtils.Http.prototype.get = function (opt_options) {


    var sURL = opt_options.url;
    var oParams = (typeof opt_options.params != 'undefined' && opt_options.params != null) ? opt_options.params : {};
    var bAsync = (typeof opt_options.async != 'undefined' && opt_options.async != null) ? opt_options.async : true;
    var thisArg = (typeof opt_options.this != 'undefined' && opt_options.this != null) ? opt_options.this : this;
    var successCallback = (typeof opt_options.successCallback != 'undefined' && opt_options.successCallback != null) ? opt_options.successCallback : function () {};
    var errorCallback = (typeof opt_options.errorCallback != 'undefined' && opt_options.errorCallback != null) ? opt_options.errorCallback : function (error) {
        callError("Error " + error);
    };

    if (typeof sURL != 'string') {
        return null;
    }
    if (sURL.length < 2) {
        return null;
    }

    // Ajoute les parametres dans l'url
    sURL = this.addParamsToUrl(sURL, oParams);

    callLog('get: ' + sURL);

    // Requête Ajax
    if (sURL != null) {
        var xhttp = new XMLHttpRequest();
        // Configuration
        xhttp.open("GET", sURL, bAsync);
        // Gestion des erreurs
        xhttp.onreadystatechange = function (oEvent) {

//            callLog('readyState: ' + xhttp.readyState);
//            callLog('status: ' + xhttp.status);
//            callLog('statusText: ' + xhttp.statusText);
//            callLog('response: ' + xhttp.response);
//            callLog('responseText: ' + xhttp.responseText);

            if (xhttp.readyState === 4) {
                if (xhttp.status !== 200) {
                    errorCallback.call(thisArg, xhttp.statusText);
                }
            }
        };
        // Envoi de la requête
        xhttp.send();

//        callLog('readyState: ' + xhttp.readyState);
//        callLog('status: ' + xhttp.status);
//        callLog('statusText: ' + xhttp.statusText);
//        callLog('response: ' + xhttp.response);
//        callLog('responseText: ' + xhttp.responseText);

        try {
            var response = JSON.parse(xhttp.response);
            successCallback.call(thisArg, response);
        } catch (e) {
            successCallback.call(thisArg, xhttp.response);
        }
    }
};

/**
 * Add the given params to the given URL
 * @param {string} sUrl
 * @param {object} oParams
 * @returns {null|String}
 */
nsUtils.Http.prototype.addParamsToUrl = function (sUrl, oParams) {

    if (typeof sUrl != 'string')
        return null;
    if (typeof oParams != 'object')
        return null;

    var value;
    var sUrlSearch = sUrl.indexOf('?') !== -1 ? sUrl.substr(sUrl.indexOf('?')) : "";
    sUrl = sUrl.substr(0, sUrl.indexOf('?'));

    for (var key in oParams) {

        key = encodeURIComponent(key);
        value = encodeURIComponent(oParams[key]);

        var s = sUrlSearch;
        var kvp = key + "=" + value;

        var r = new RegExp("(&|\\?)" + key + "=[^\&]*");

        s = s.replace(r, "$1" + kvp);

        if (!RegExp.$1) {
            s += (s.length > 0 ? '&' : '?') + kvp;
        }

        sUrlSearch = s;
    }

    return sUrl + sUrlSearch;
};
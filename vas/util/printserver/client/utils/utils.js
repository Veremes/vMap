/* global ol */

/**
 * Namespace nsUtils
 * @type object
 */
nsUtils = {};

/**
 * Send a message to PhantomJS
 * @param {object} message
 */
var tryCallPhantom = function (message) {
    if (typeof window.callPhantom === 'function') {
        window.callPhantom(message);
    }
};

/**
 * Send a PhantomJS message
 * @param {string} message Message to log
 */
var callLog = function (message) {
    console.log(message);
    tryCallPhantom({'cmd': 'consoleLog', 'message': message});
};

/**
 * Send a PhantomJS error message and stops the printing
 * @param {string} message Message to log
 */
var callError = function (message) {
    console.log(message);
    tryCallPhantom({'cmd': 'error', 'message': message});
};

/**
 * Return true if a variable is defined and not null, false otherwise
 * @param {object} variable
 * @returns {Boolean}
 */
var isDef = function (variable) {

    if (typeof variable == 'undefined') {
        return false;
    }
    if (variable == null) {
        return false;
    }
    return true;
};

/**
 * Convert the loaded images in base64
 * @returns {undefined}
 */
var convertImagesToBase64 = function () {
    contentDocument = document.documentElement;
    var regularImages = contentDocument.querySelectorAll("img");
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    [].forEach.call(regularImages, function (imgElement) {
        // preparing canvas for drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;

        ctx.drawImage(imgElement, 0, 0);
        // by default toDataURL() produces png image, but you can also export to jpeg
        // checkout function's documentation for more details
        var dataURL = canvas.toDataURL();
        imgElement.setAttribute('src', dataURL);
    })
    canvas.remove();
}

/**
 * Copie les stylesheet (bootstrap etc..) en dur dans le html
 * @returns {undefined}
 */
var copyStyles = function () {
    $('link[rel="stylesheet"]').each(function (i, ele) {
        var this_ = this;
        $.get($(this_).attr('href'), function (data) {
            var css = data;
            var head = document.head || document.getElementsByTagName('head')[0];
            var style = document.createElement('style');
            style.type = 'text/css';
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);
            $(this_).attr('href', '');
        });
    });
};
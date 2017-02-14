/* global phantom, system */

/**
 * @author: Armand Bahi
 * @Description: Fichier PhantomJS permettant de sauvegarder une image celon son url
 */

var page = require('webpage').create();
var system = require('system');

page.onError = function (msg, trace) {
    console.log(msg);
    trace.forEach(function (item) {
        console.log('  ', item.file, ':', item.line);
    });
};

if (system.args.length !== 3) {
    console.log('Usage: [printmap.js ImageUrl OutputFile]');
    phantom.exit(1);
} else {

    // Effectue l'impression
    function printImage() {

        var bb = page.evaluate(function () {
            return document.getElementById("image_container").getBoundingClientRect();
        });

        page.clipRect = {
            top: bb.top,
            left: bb.left,
            width: bb.width,
            height: bb.height
        };

        page.render(sOutputFile);
        phantom.exit();
    }

    // Effectue l'impression lorsque la page sera chargée
    function printOnPageLoaded() {
        setTimeout(function () {
            var readyState = page.evaluate(function () {
                return document.readyState;
            });
            if ("complete" === readyState) {
                printImage(readyState);
            } else {
                printOnPageLoaded();
            }
        }, 100);
    }

    for (var i = 0; i < system.args.length; i++) {
        console.log("system.args[" + i + "]: ", system.args[i]);
    }

    var sImageUrl = system.args[1];
    var sOutputFile = system.args[2];

    var expectedContent = '<html><body><img id="image_container" src="' + sImageUrl + '"></body></html>';
    page.setContent(expectedContent, '');
    printOnPageLoaded();
}
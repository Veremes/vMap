/* global phantom */

/**
 * @author: Armand Bahi
 * @Description: Fichier PhantomJS permettant d'imprimer un rapport au format doc ou pdf
 */

var page = require('webpage').create();
var system = require('system');
var fs = require('fs');

page.onError = function (msg, trace) {
    console.log(msg);
    trace.forEach(function (item) {
        console.log('  ', item.file, ':', item.line);
    });
};

if (system.args.length < 11) {
    console.log('Usage: [printmap.js PrintClientURL APIRestUrl Token OutputFileName ReportId Format Orientation OutputFormat JsonIncludes JsonScope Quality]');
    phantom.exit(1);
} else {

    for (var i = 0; i < system.args.length; i++) {
        console.log("system.args[" + i + "]: ", system.args[i]);
    }

    // Temps avant de lancer checkReadyState
    var printTimeout = 2000;
    // Temps pour lancer l'impression sans checkReadyState
    var printLoadTimeout = 10000;
    var sPrintClientURL = system.args[1];
    var sApiRestUrl = system.args[2];
    var sToken = system.args[3];
    var sOutputFileName = system.args[4];
    var sReportId = system.args[5];
    var sFormat = system.args[6];
    var sOrientation = system.args[7];
    var sOutputFormat = system.args[8];
    var sIncludes = system.args[9];
    var sScope = system.args[10];
    var sQuality = system.args[11];
    // Si sIncludes est un fichier
    if (fs.exists(sIncludes)) {
        sIncludes = fs.read(sIncludes);
    }
    // Si sScope est un fichier
    if (fs.exists(sScope)) {
        sScope = fs.read(sScope);
    }

    try {
        var oIncludes = JSON.parse(sIncludes);
    } catch (e) {
        var oIncludes = {};
    }
    try {
        var oScope = JSON.parse(sScope);
    } catch (e) {
        var oScope = {};
    }

    // Orientation
    if (sOrientation === 'paysage') {
        sOrientation = 'landscape';
    }

    page.paperSize = {
        format: sFormat,
        orientation: sOrientation
    };

    // Récuprère les messages envoyés par le client
    page.onCallback = function (data) {
        var cmd = data['cmd'];
        if (cmd === 'error') {
            if (typeof data['message'] !== undefined) {
                console.log(data['message']);
            }
            phantom.exit();
        } else if (cmd === 'consoleLog') {
            if (typeof data['message'] !== undefined) {
                console.log(data['message']);
            }
        }
    };
    page.open(sPrintClientURL, function (status) {

        if (status !== 'success') {
            console.log('Unable to load the sPrintClientURL, status:', status);
            phantom.exit(1);
        } else {

            // Bug PhantomJS 2.0: Sur linux les tailles sont mal définies
            page.evaluate(function (osName) {
                if (osName === 'linux') {
                    document.body.style.zoom = 0.75;
                }
            }, system.os.name);

            /**
             * Render the target from page at the given quality
             * @param {number} sQuality Specify 0 to obtain small compressed files, 100 for large 
             * @param {string} sOutputFileName file name
             * @returns {boolean}
             */
            var renderPage = function (sQuality, sOutputFileName) {
                console.log("test");
                var done = page.render(sOutputFileName, {format: 'pdf', quality: sQuality});
                return done;
            };

            var saveAsHtml = function (path) {
                // Sauvegarde le fichier html
                fs.write(path, page.content, 'w');
            };

            var printPage = function (readyState) {
                console.log("readyState: ", readyState);

                if (sOutputFormat === 'pdf') {
                    var done = renderPage(sQuality, sOutputFileName);
                    if (done) {
                        console.log("Done");
                        phantom.exit();
                    }
                }
                if (sOutputFormat === 'doc') {
                    saveAsHtml(sOutputFileName);
                    console.log("Done");
                    phantom.exit();
                }
            };

            var reportOptions = {
                token: sToken,
                apiUrl: sApiRestUrl,
                reportId: sReportId,
                includes: oIncludes,
                scope: oScope
            };

            // Initialize the map with the given params
            page.evaluate(function (reportOptions) {
                initReport(reportOptions);
                copyStyles();
            }, reportOptions);

            // Effectue l'impression lorsque la page sera chargée
            function checkReadyState() {
                setTimeout(function () {
                    var readyState = page.evaluate(function () {
                        return document.readyState;
                    });
                    if ("complete" === readyState) {
                        printPage(readyState);
                    } else {
                        checkReadyState();
                    }
                });
            }

            setTimeout(function () {
                checkReadyState();
            }, printTimeout);

            // Au cas où la page ne soit pas chargée apres printTimeout
            setTimeout(function () {
                printPage("timeout");
            }, printLoadTimeout);
        }
    });
}
/* global phantom */

/**
 * @author: Armand Bahi
 * @Description: Fichier PhantomJS permettant de retourner la taille d'une cible
 * dans le template HTML d; un rapport vMap
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

if (system.args.length !== 8) {
    console.log('Usage: [printmap.js PrintClientURL APIRestUrl Token ReportId Format Orientation Target]');
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
    var sReportId = system.args[4];
    var sFormat = system.args[5];
    var sOrientation = system.args[6];
    var sTarget = system.args[7];
    var oIncludes = {};
    var oScope = {};


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

            var printPage = function (readyState) {
                console.log("readyState: ", readyState);
                page.evaluate(function (sTarget) {
                    callLog("Done: " + $(sTarget).width() + '|' + $(sTarget).height());
                }, sTarget);
                phantom.exit();
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
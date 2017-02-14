//protractor config
var Jasmine2HtmlReporter = require(__dirname + '/node_module/protractor-jasmine2-html-reporter');

var newDate = new Date();
var DateYear = (newDate.getFullYear()).toString();
var DateMonth = (newDate.getMonth() + 1).toString();
var DateDay = (newDate.getDate()).toString();
var DateHours = (newDate.getHours()).toString();
var DateMinutes = (newDate.getMinutes()).toString();
var DateSeconds = (newDate.getSeconds()).toString();
if (DateMonth.length === 1) {
	DateMonth = '0' + DateMonth;
}
if (DateDay.length === 1) {
	DateDay = '0' + DateDay;
}
if (DateHours.length === 1) {
	DateHours = '0' + DateHours;
}
if (DateMinutes.length === 1) {
	DateMinutes = '0' + DateMinutes;
}
if (DateSeconds.length === 1) {
	DateSeconds = '0' + DateSeconds;
}

var dateMyFormat = DateYear + '_' + DateMonth + '_' + DateDay + "-" + DateHours + "_" + DateMinutes + "_" + DateSeconds;

exports.config = {
    params : {
        login : 'abc',
        password : '123'
    },
    framework: 'jasmine2',
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    capabilities: {
        'browserName': "chrome"
    },
    specs: ['scenario/sc_vitis_metadata.js'],
    allScriptsTimeout: 10000,
    jasmineNodeOpts: {
        showColors: false // Use colors in the command line report.
    },
    onPrepare: function () {
        jasmine.getEnv().addReporter(
                new Jasmine2HtmlReporter({
					//savePath: 'Output/publication/',
					//savePath: 'Output/users/',
                    //savePath: 'Output/order/',
					//savePath: 'Output/filter/',
					//savePath: 'Output/ad/',
					//savePath: 'Output/import_export/',
					savePath: 'Output/metadata/',
					//savePath: 'Output/parametres/',
					//savePath: 'Output/draw/',
					 filePrefix: dateMyFormat+'_htmlReport',
                    screenshotsFolder: 'images'
                })
        );
    } 
};


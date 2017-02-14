//protractor config
var Jasmine2HtmlReporter = require(__dirname + '/node_module/protractor-jasmine2-html-reporter');

exports.config = {
    params : {
        login : 'abc',
        password : '123'
    },
    framework: 'jasmine2',
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    capabilities: {
        'browserName': "firefox"
    },
    specs: ['scenario/sc_vitis_publication.js'],
    allScriptsTimeout: 10000,
    jasmineNodeOpts: {
        showColors: false // Use colors in the command line report.
    },
    onPrepare: function () {
        jasmine.getEnv().addReporter(
                new Jasmine2HtmlReporter({
					savePath: 'Output/publication/',
					//savePath: 'Output/users/',
                    //savePath: 'Output/order/',
					//savePath: 'Output/filter/',
					//savePath: 'Output/ad/',
					//savePath: 'Output/metadata/',
					//savePath: 'Output/parametres/',
					//savePath: 'Output/draw/',
					 
                    screenshotsFolder: 'images'
                })
        );
    } 
};


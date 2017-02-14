//protractor config
var Jasmine2HtmlReporter = require(__dirname +'/node_module/protractor-jasmine2-html-reporter');
exports.config = {
    framework: 'jasmine2',
    seleniumAddress: 'http://localhost:4444/wd/hub',
	seleniumArgs: ['-Dwebdriver.ie.driver=<path to IEDriverServer.exe>'],
    capabilities: {
        'browserName': 'internet explorer'
    },
    specs: ['scenario/sc_vmap_demo.js'],
    allScriptsTimeout: 10000,
    jasmineNodeOpts: {
        showColors: false // Use colors in the command line report.
    },
    onPrepare: function () {
        jasmine.getEnv().addReporter(
                new Jasmine2HtmlReporter({
                    savePath: 'Output/html/',
                    screenshotsFolder: 'images'
                })
        );
    }
};


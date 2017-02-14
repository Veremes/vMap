// Karma configuration
// Generated on Thu Jul 16 2015 11:55:38 GMT+0200 (Paris, Madrid (heure d’été))
var pathRoot = __dirname + "/../../../"
var pathJS = pathRoot + "javascript/";
var pathExterns = pathJS + "externs/";
var pathApp = pathJS + "app/";
var pathLib = pathApp + "lib/"
var pathData = pathJS + "../data/";

module.exports = function (config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [/*'jasmine-jquery', */'jasmine'],
        files: [
            pathExterns +'jquery/jquery-1.9.1.min.js',
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular.js',
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular-animate.js',
            pathRoot +'../node_modules/angular-mocks/angular-mocks.js',
            //'test/mock/mock-ajax.js',
            pathExterns + 'bootstrap/bootstrap.min.js',
            pathExterns + 'bootstrap-toggle/bootstrap-toggle.min.js',
            pathExterns + 'bootstrap-table/bootstrap-table.min.js',
            pathExterns + 'bootbox/bootbox.min.js',
            pathExterns + 'colorpicker/js/bootstrap-colorpicker.min.js',
           'resource/goog/base.js',
            'all-deps.js',
            
            {pattern: pathLib + '**/*.js', included: false, watched: true, served: true},
            {pattern: pathLib + 'ol/**/*.js', included: false, watched: false, served: true},
            {pattern: pathLib + 'ol.ext/rbush.js', included: false, watched: false, served: true},
            {pattern: pathLib + 'ngeo/**/*.js', included: false, watched: false, served: true},
            {pattern: pathApp + 'vmap/**/*.js', included: false, watched: true, served: true},
            {pattern: pathApp + 'modules/**/*.js', included: true, watched: true, served: true},
            pathRoot + '**/*.html',
            {pattern: 'resource/mock/*.mock.js', included: true, watched: true, served: true},
            {pattern: 'src/**/*.spec.js', included: true, watched: true, served: true},
            {pattern: 'src/**/*.inte.js', included: true, watched: true, served: true},
            {pattern: pathData + 'examples/*.json', included: false, watched: false, served: true},
            {pattern: pathData + 'tools.json', included: false, watched: false, served: true},
            {pattern: pathData + 'map-catalog.json', included: false, watched: true, served: true},
            {pattern: 'resource/Serveur_Geosignal.xml', included: false, watched: true, served: true},
        ],
        // list of files to exclude
        exclude: [
            pathJS + '**/*.html',
            pathRoot + 'index.html'
        ],
        proxies: {
            'tools.json': pathData + 'tools.json',
            'map-catalog.json': pathData + 'map-catalog.json',
            'resource/Serveur_Geosignal.xml': 'resource/Serveur_Geosignal.xml',
            'examples/': pathData + 'examples/',
            'imagettes/ign.png': pathRoot + 'images/imagettes/ign.png',
            '/': 'http://localhost/'
        },
        urlRoot: '__karma__',
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '/../../../**/*.html': ['ng-html2js'],
            '/../../../javascript/app/modules/Dessin/*.js': ['coverage'],
            '/../../../javascript/app/vmap/**/*.js': ['coverage']
        },
        ngHtml2JsPreprocessor: {
            stripPrefix: 'vmap/'
                    //moduleName: 'Templates'
        },
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage', 'html', 'junit'],
        coverageReporter: {
            type: 'html',
            dir: 'Output/coverage/'
        },
        junitReporter: {
            outputDir : "Output/Junit/",
            outputFile : "test-results.xml"
        },
        htmlReporter: {
            outputDir: 'Output/Jasmine/', // where to put the reports  
            //outputFile : 'JasmineReport.html',
            templatePath: null, // set if you moved jasmine_template.html 
            focusOnFailures: true, // reports show failures on start 
            namedFiles: false, // name files instead of creating sub-directories 
            pageTitle: 'JasmineReport', // page title for reports; browser info by default 
            urlFriendlyName: false // simply replaces spaces with _ for files/dirs 
        },
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        //logLevel: config.LOG_DEBUG,
        logLevel: config.LOG_INFO,
        loggers: [
            {
                type: 'console'
            },
            {
                type: 'file',
                absolute: true,
                filename: 'Output/Karma_Debug.log',
                // maxLogSize: 20480,
                backups: 10
            }],
        plugin: [
            'karma-ng-html2js-preprocessor',
            'karma-chrome-launcher',
            'karma-ie-launcher',
            'karma-firefox-launcher',
            'karma-coverage',
            'karma-jasmine',
            'karma-html-reporter',
            'karma-htmlfile-reporter',
            'karma-cli',
            'karma-jasmine-jquery'
        ],
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'/*, 'IE', 'Firefox'*/],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};

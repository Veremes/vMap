module.exports = function (grunt) {

    var compilerPackage = require('google-closure-compiler');
    compilerPackage.grunt(grunt);

    var sHome = '../';
    var sClosureDepsHome = '../../../../../';

    // Project configuration. 
    grunt.initConfig({
        'closure-compiler': {
            vMap: {
                files: {
                    '../javascript/vmap.min.js': [
                        // Fichiers Vitis
                        sHome + 'javascript/require/*.js',
                        sHome + 'javascript/app/**/*.js',
                        sHome + 'javascript/externs/formReader/**/*.js',
                        sHome + 'javascript/externs/mapJSON/**/*.js',
                        sHome + 'modules/vitis/javascript/**/*.js',
                        // OpenLayers
                        sHome + 'javascript/externs/openLayers/**/*.js',
                        // Fichiers vMap
                        sHome + 'conf/requires/*.js',
                        sHome + 'modules/vmap/javascript/app/**/*.js',
                        sHome + 'modules/vmap/javascript/vitis/**/*.js',
                        // Fichiers Studio
                        sHome + 'javascript/externs/studio/properties/properties.js',
                        sHome + 'javascript/externs/studio/javascript/app/**/*.js',
                        // Fichiers vMap4MapServer
                        sHome + 'modules/vm4ms/javascript/**/*.js',
                        // Fichiers ANC
                        sHome + 'modules/anc/javascript/**/*.js'
                    ]
                },
                options: {
                    js: [
                        'node_modules/google-closure-library/closure/goog/**.js',
                        '!node_modules/google-closure-library/closure/goog/**_test.js'
                    ],
                    externs: [
                        'closure/externs/angular-1.3.js',
                        'closure/externs/bingmaps.js',
                        'closure/externs/jquery-1.9.js',
                        'closure/externs/bootstrap.js',
                        'closure/externs/geojson.js',
                        'closure/externs/jspdf.js',
                        'closure/externs/html2canvas.js',
                        'closure/externs/vmap.js'
                    ],
                    compilation_level: 'ADVANCED',
                    manage_closure_dependencies: true,
                    generate_exports: true,
                    angular_pass: true,
                    debug: false,
                    language_in: 'ECMASCRIPT5',
                    language_out: 'ECMASCRIPT5',
                    closure_entry_point: ['vmap', 'vitis', 'oVFB'],
                    create_source_map: '../javascript/vmap.min.js.map',
                    output_wrapper: '(function(){\n%output%\n}).call(this)\n//# sourceMappingURL=../javascript/vmap.min.js.map'
                }
            },
            studio: {
                files: {
                    '../javascript/externs/studio/javascript/studio.min.js': [
                        // Fichiers Studio
                        sHome + 'javascript/externs/studio/properties/properties.js',
                        sHome + 'javascript/externs/studio/javascript/app/**/*.js'
                    ]
                },
                options: {
                    compilation_level: 'WHITESPACE_ONLY',
                    angular_pass: true,
                    language_in: 'ECMASCRIPT5',
                    language_out: 'ECMASCRIPT5',
                    closure_entry_point: ['oVFB']
                }
            },
            formReader: {
                files: {
                    '../javascript/externs/formReader/formReader.min.js': [
                        // Fichiers FormReader
                        sHome + 'javascript/externs/formReader/**/*.js'
                    ]
                },
                options: {
                    compilation_level: 'WHITESPACE_ONLY',
                    angular_pass: true,
                    language_in: 'ECMASCRIPT5',
                    language_out: 'ECMASCRIPT5'
                }
            }
        },
        'closureDepsWriter': {
            options: {
                depswriter: 'closure/depswriter/depswriter.py',
                root_with_prefix: [
                    // Fichiers Vitis
                    '"' + sHome + 'javascript/app ' + sClosureDepsHome + 'javascript/app"',
                    '"' + sHome + 'modules/vitis/javascript ' + sClosureDepsHome + 'modules/vitis/javascript"',
                    '"' + sHome + 'javascript/externs/formReader ' + sClosureDepsHome + 'javascript/externs/formReader"',
                    '"' + sHome + 'javascript/externs/mapJSON ' + sClosureDepsHome + 'javascript/externs/mapJSON"',
                    '"' + sHome + 'conf/requires ' + sClosureDepsHome + 'conf/requires"',
                    // OpenLayers
                    '"' + sHome + 'javascript/externs/openLayers ' + sClosureDepsHome + 'javascript/externs/openLayers"',
                    // Fichiers vMap
                    '"' + sHome + 'modules/vmap/javascript/app ' + sClosureDepsHome + 'modules/vmap/javascript/app"',
                    '"' + sHome + 'modules/vmap/javascript/vitis ' + sClosureDepsHome + 'modules/vmap/javascript/vitis"',
                    // Fichiers Studio
                    '"' + sHome + 'javascript/externs/studio/properties ' + sClosureDepsHome + 'javascript/externs/studio/properties"',
                    '"' + sHome + 'javascript/externs/studio/javascript/app ' + sClosureDepsHome + 'javascript/externs/studio/javascript/app"',
                    // Fichiers vMap4MapServer
                    '"' + sHome + 'modules/vm4ms/javascript ' + sClosureDepsHome + 'modules/vm4ms/javascript"',
                    // Fichiers vMap4MapServer
                    '"' + sHome + 'modules/anc/javascript ' + sClosureDepsHome + 'modules/anc/javascript"',
                    // Closure library
                    '"' + sHome + 'conf/node_modules/google-closure-library/closure/goog ' + sClosureDepsHome + 'conf/node_modules/google-closure-library/closure/goog"'
                ]
            },
            targetName: {
                dest: '../javascript/vmap.deps.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-closure-tools');

    // Tache par défaut 
    // cmd: grunt
    grunt.registerTask('default', ['closureDepsWriter', 'closure-compiler:vMap']);
    // cmd: grunt generate-deps
    grunt.registerTask('generate-deps', ['closureDepsWriter']);
    // cmd: grunt studio minify
    grunt.registerTask('minify-studio', ['closure-compiler:studio']);
    // cmd: grunt formReader minify
    grunt.registerTask('minify-formReader', ['closure-compiler:formReader']);
    // cmd: grunt formReader and studio minify
    grunt.registerTask('minify-libs', ['closure-compiler:formReader', 'closure-compiler:studio']);
    // cmd: grunt compile
    grunt.registerTask('compile', ['closure-compiler:vMap']);
};
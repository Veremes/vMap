/*jshint camelcase:false */
var configs = {
  builder: {},
  compiler: {},
  helpers: {}
};

// Known test locations for compiler and builder files
var CLOSURE_COMPILER = 'path/to/compiler.jar',
    CLOSURE_BUILDER = 'path/to/builder.py';

// Builder test case with compiler options
configs.builder.withCompileOpts = {
  builder: CLOSURE_BUILDER,
  inputs: 'path/to/inputs',
  compile: true,
  compilerFile: CLOSURE_COMPILER,
  compilerOpts: {
    compilation_level: 'WHITESPACE_ONLY',
    jscomp_off: [
      'checkTypes',
      'strictModuleDepCheck'
    ]

  }
};

// Builder test case with file object
configs.builder.withCompileFileObj = {
  src: ['/path/to/source1', 'path/source2']
};

// Compiler test case that doesn't have any source files.
configs.compiler.empty = {
  dest: 'test/dest.js',
  src: []
};

// A generic empty test case for trying out helpers.execute.
configs.helpers.empty = {
  type: 'empty',
  dest: configs.compiler.empty.dest
};

module.exports = configs;

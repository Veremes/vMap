var grunt = require('grunt');
var sinon = require('sinon');
var compiler = require('../').compiler;
var configs = require('./configs.fix');
var expectations = require('./expected/expectations.compiler');


/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var stubFileWrite;

exports.compiler = {
  setUp: function(done) {
    stubFileWrite = sinon.stub( grunt.file, 'write' );
    stubFileWrite.returns( true );
    done();
  },
  tearDown: function(done) {
    stubFileWrite.restore();
    done();
  },

  // Testing if the correct command is compiled when there are no source files given.
  emptySrc: function( test ) {
    test.expect(1);
    var actual = compiler.compileCommand( {}, configs.compiler.empty );
    test.deepEqual(actual, expectations.empty, 'Should be equal');
    test.done();
  }
};

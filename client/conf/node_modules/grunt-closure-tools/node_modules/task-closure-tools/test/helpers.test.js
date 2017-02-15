var grunt = require('grunt');
var sinon = require('sinon');
var helpers = require('../').helpers;
var configs = require('./configs.fix');

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

exports.helper = {
  setUp: function(done) {
    stubFileWrite = sinon.stub( grunt.file, 'write' );
    stubFileWrite.returns( true );
    done();
  },
  tearDown: function(done) {
    stubFileWrite.restore();
    done();
  },
  // Testing if an empty file is written to dest when the empty command is used
  emptySrc: function( test ) {
    test.expect(1);
    helpers.executeCommand(configs.helpers.empty, function(){});
    test.equal(stubFileWrite.calledWith(configs.helpers.empty.dest, ''), true);
    test.done();
  }
};

var configs = require('../configs.fix');
var expectations = {};

// The expected empty command from a compiled command with no src files.
expectations.empty = {
	type: 'empty',
	dest: configs.compiler.empty.dest
};

module.exports = expectations;
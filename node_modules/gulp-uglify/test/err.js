'use strict';
var test = require('tape'),
		Vinyl = require('vinyl'),
		gulpUglify = require('../');
	
var testContentsInput = 'function errorFunction(error)\n{';

var testFile1 = new Vinyl({
	cwd: "/home/terin/broken-promises/",
	base: "/home/terin/broken-promises/test",
	path: "/home/terin/broken-promises/test/test1.js",
	contents: new Buffer(testContentsInput)
});

test('should report files in error', function(t) {
	t.plan(6);

	var stream = gulpUglify();

	stream.on('data', function() {
		t.fail('we shouldn\'t have gotten here');
	});

	stream.on('error', function(e) {
		t.ok(e instanceof Error, 'argument should be of type error');
		t.equal(e.plugin, 'gulp-uglify', 'error is from gulp-uglify');
		t.equal(e.fileName, testFile1.path, 'error reports correct file name');
		t.equal(e.lineNumber, 2, 'error reports correct line number');
		t.ok(e.stack, 'error has a stack');
		t.false(e.showStack, 'error is configured to not print the stack');
	});

	stream.write(testFile1);
});

'use strict';
var test = require('tape'),
		Vinyl = require('vinyl'),
		gulpUglify = require('../'),
		uglifyjs = require('uglify-js'),
		inlineSourceMap = require('inline-source-map');
	
var testContentsInput = '"use strict"; (function(console, first, second) { console.log(first + second) }(5, 10))';
var testContentsExpected = uglifyjs.minify(testContentsInput, {fromString: true}).code;
var testSourceMap = inlineSourceMap().addGeneratedMappings('test1.js', testContentsInput, {line:0, column:0}).addSourceContent('test1.js', testContentsInput).toJSON();

var testFile1 = new Vinyl({
	cwd: "/home/terin/broken-promises/",
	base: "/home/terin/broken-promises/test",
	path: "/home/terin/broken-promises/test/test1.js",
	contents: new Buffer(testContentsInput)
});
testFile1.sourceMap = testSourceMap;

test('should minify files', function(t) {
	t.plan(13);

	var stream = gulpUglify();

	stream.on('data', function(newFile) {
		t.ok(newFile, 'emits a file');
		t.ok(newFile.path, 'file has a path');
		t.ok(newFile.relative, 'file has relative path information');
		t.ok(newFile.contents, 'file has contents');

		t.ok(newFile instanceof Vinyl, 'file is Vinyl');
		t.ok(newFile.contents instanceof Buffer, 'file contents are a buffer');

		t.equals(String(newFile.contents), testContentsExpected);

		t.ok(newFile.sourceMap, 'has a source map');
		t.equals(newFile.sourceMap.version, 3, 'source map has expected version');
		t.ok(Array.isArray(newFile.sourceMap.sources), 'source map has sources array');
		t.ok(Array.isArray(newFile.sourceMap.names), 'source maps has names array');
		t.ok(Array.isArray(newFile.sourceMap.sourcesContent), 'source map has sourceContent');
		t.ok(newFile.sourceMap.mappings, 'source map has mappings');
	});

	stream.write(testFile1);
});

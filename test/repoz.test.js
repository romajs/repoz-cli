const q = require('q');
var assert = require('assert');
var http = require('http');
var PassThrough = require('stream').PassThrough;
var sinon = require('sinon');
const fs = require('fs');
 
var repoz = require('../lib/repoz.js');
 
describe('repoz', function() {

	beforeEach(function() {
		this.request = sinon.stub(http, 'request'); 
		sinon.stub(fs, 'readFileSync');
		sinon.stub(fs, 'writeFileSync');
		sinon.stub(fs, 'createReadStream');
	});
 
	afterEach(function() {
		http.request.restore();
		fs.readFileSync.restore();
		fs.writeFileSync.restore();
		fs.createReadStream.restore();
	});
 
	it('repoz.project', function(done) {
		var project = repoz.project('test', 'test', '123');
		assert.notEqual(null, project);
		done();
	});

	it('list: 200', function(done) {

		var expected = '/test/.repozauth.txt';

		var response = new PassThrough();
		response.write(expected);
		response.statusCode = 200;
		response.end();

		var request = new PassThrough()
		this.request.callsArgWith(1, response).returns(request);

		var project = repoz.project('test', 'test', '123');

		q.allSettled([
			project.list(),
			project.list('/'),
			project.list('/', true),
			project.list('/path'),
			project.list('/path', true),
		]).then(function() {
			done();
		});

	});
 
	it('get: 200', function(done) {

		var expected = 'test';

		var response = new PassThrough();
		response.write(expected);
		response.statusCode = 200;
		response.end();

		var request = new PassThrough()
		this.request.callsArgWith(1, response).returns(request);

		var project = repoz.project('test', 'test', '123');
	 
		q.allSettled([
			project.get(''),
			project.get('', ''),
			project.get('x', 'y'),
			project.get('../x', 'y'),
		]).then(function() {
			done();
		});

	});
 
	it('post: 200', function(done) {

		var expected = '';

		var response = new PassThrough();
		response.write(expected);
		response.statusCode = 200;
		response.end();

		var request = new PassThrough()
		this.request.callsArgWith(1, response).returns(request);

		var project = repoz.project('test', 'test', '123');
	 
		q.allSettled([
			project.post('', ''),
			project.post('x', 'y'),
			project.post('../x', 'y'),
		]).then(function() {
			done();
		});

	});
 
	it('put: 200', function(done) {

		var expected = '';

		var response = new PassThrough();
		response.write(expected);
		response.statusCode = 200;
		response.end();

		var request = new PassThrough()
		this.request.callsArgWith(1, response).returns(request);

		var project = repoz.project('test', 'test', '123');
	 
		q.allSettled([
			project.put('', ''),
			project.put('x', 'y'),
			project.put('../x', 'y'),
		]).then(function() {
			done();
		});

	});
 
	it('delete: 200', function(done) {

		var expected = '';

		var response = new PassThrough();
		response.write(expected);
		response.statusCode = 200;
		response.end();

		var request = new PassThrough()
		this.request.callsArgWith(1, response).returns(request);

		var project = repoz.project('test', 'test', '123');
	 
		q.allSettled([
			project.delete(),
			project.delete(''),
			project.delete('x'),
		]).then(function() {
			done();
		});

	});
 

 })
const q = require('q');
var assert = require('assert');
var http = require('http');
var stream = require('stream');
var sinon = require('sinon');
const fs = require('fs');
 
var repoz = require('../lib/repoz.js');
 
describe('repoz', function() {

	function request() {
		var request = new stream.PassThrough();
		return request;
	}

	function response(statusCode, data) {
		var response = new stream.PassThrough();
		data && response.write(data);
		response.statusCode = statusCode;
		return response;
	}

	beforeEach(function() {
		this.request = sinon.stub(http, 'request').returns(request())
		this.readFileSync = sinon.stub(fs, 'readFileSync');
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

		this.request.callsArgWith(1, response(200, '/test/.repozauth.txt'));

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

		this.request.callsArgWith(1, response(200, 'test'));

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

		this.readFileSync.returns(new Buffer('test'));
		this.request.callsArgWith(1, response(200, ''));

		var project = repoz.project('test', 'test', '123');
	 
		project.post('foo', 'bar').then(function() {
			done();
		});

	});
 
	it('put: 200', function(done) {

		this.readFileSync.returns(new Buffer('test'));
		this.request.callsArgWith(1, response(200, ''));

		var project = repoz.project('test', 'test', '123');
	 
		project.put('foo', 'bar').then(function() {
			done();
		});

	});
 
	it('delete: 200', function(done) {

		this.request.callsArgWith(1, response(200, ''));

		var project = repoz.project('test', 'test', '123');
	 
		q.allSettled([
			project.delete(),
			project.delete(''),
			project.delete('x'),
		]).then(function() {
			done();
		});

	});
 
	it('list: 401', function(done) {

		this.request.callsArgWith(1, response(401));
		var project = repoz.project('test', 'test', '123');

		project.list().catch(function() {
			done();
		});

	});
 
	it('get: 401', function(done) {

		this.request.callsArgWith(1, response(401));
		var project = repoz.project('test', 'test', '123');

		project.get('').catch(function() {
			done();
		});

	});
 
	it('post: 401', function(done) {

		this.request.callsArgWith(1, response(401));
		var project = repoz.project('test', 'test', '123');

		project.post('', '').catch(function() {
			done();
		});

	});
 
	it('put: 401', function(done) {

		this.request.callsArgWith(1, response(401));
		var project = repoz.project('test', 'test', '123');

		project.put('', '').catch(function() {
			done();
		});

	});
 
	it('delete: 401', function(done) {

		this.request.callsArgWith(1, response(401));
		var project = repoz.project('test', 'test', '123');

		project.delete().catch(function() {
			done();
		});

	});

 })
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
 
	it('list: 200', function(done) {

		var expected = '/test/.repozauth.txt';

		var response = new PassThrough();
		response.write(expected);
		response.statusCode = 200;
		response.end();

		var request = new PassThrough()
		this.request.callsArgWith(1, response).returns(request);

		var r = repoz('test', 'test', '123');
	 
		q.allSettled([
			r.list(),
			r.list('/'),
			r.list('/', true),
			r.list('/path'),
			r.list('/path', true),
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

		var r = repoz('test', 'test', '123');
	 
		q.allSettled([
			r.get(''),
			r.get('', ''),
			r.get('x', 'y'),
			r.get('../x', 'y'),
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

		var r = repoz('test', 'test', '123');
	 
		q.allSettled([
			r.post('', ''),
			r.post('x', 'y'),
			r.post('../x', 'y'),
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

		var r = repoz('test', 'test', '123');
	 
		q.allSettled([
			r.put('', ''),
			r.put('x', 'y'),
			r.put('../x', 'y'),
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

		var r = repoz('test', 'test', '123');
	 
		q.allSettled([
			r.delete(),
			r.delete(''),
			r.delete('x'),
		]).then(function() {
			done();
		});

	});
 

 })
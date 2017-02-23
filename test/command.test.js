const fs = require('fs');
const os = require('os');
var http = require('http');
var PassThrough = require('stream').PassThrough;
var sinon = require('sinon');
const prompt = require('prompt');
 
var command = require('../lib/command.js');
var repoz = require('../lib/repoz.js');
var credentials = require('../lib/credentials.js');
 
describe('command', function() {

	beforeEach(function() {

		var response = new PassThrough();
		response.write('/test/.repozauth.txt');
		response.statusCode = 200;
		response.end();

		var request = new PassThrough();
		sinon.stub(http, 'request').callsArgWith(1, response).returns(request);

		sinon.stub(fs, 'existsSync').returns(true);
		sinon.stub(fs, 'readFileSync').returns('hdu9rN225PT/nw/CgDOhyw==');
		sinon.stub(fs, 'writeFileSync');
		sinon.stub(fs, 'createReadStream');
		sinon.stub(os, 'homedir').returns('/home/test/');

		sinon.stub(credentials, 'loadCredentials').returns(new credentials.Credentials('test.dat', 'dGVzdAo='));
		sinon.stub(prompt, 'get').callsArgWith(1, undefined, {});
	});
 
	afterEach(function() {
		http.request.restore();
		fs.existsSync.restore();
		fs.readFileSync.restore();
		fs.writeFileSync.restore();
		fs.createReadStream.restore();
		os.homedir.restore();
		credentials.loadCredentials.restore();
		prompt.get.restore();
	});
 
	it('exec - list', function(done) {
		command.exec('list', 'test', [], function() {
			done();
		});
	});
 
	it('exec - get', function(done) {
		command.exec('get', 'test', [''], function() {
			done();
		});
	});
 
	it('exec - post', function(done) {
		command.exec('post', 'test', ['', ''], function() {
			done();
		});
	});
 
	it('exec - put', function(done) {
		command.exec('put', 'test', ['', ''], function() {
			done();
		});
	});
 
	it('exec - delete', function(done) {
		command.exec('delete', 'test', [''], function() {
			done();
		});
	});
 

 })
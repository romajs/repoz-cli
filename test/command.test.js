const fs = require('fs');
const os = require('os');
const q = require('q');
var sinon = require('sinon');
 
var command = require('../lib/command.js');
var repoz = require('../lib/repoz.js');
var credentials = require('../lib/credentials.js');
 
describe('command', function() {

	function fakePromise(expectedResult, error) {
		var d = q.defer();
		if(!error) {
			d.resolve(expectedResult);
		} else {
			d.reject(expectedResult);
		}
		return d.promise;
	}

	beforeEach(function() {

		this.existsSync = sinon.stub(fs, 'existsSync');
		sinon.stub(fs, 'readFileSync').returns('hdu9rN225PT/nw/CgDOhyw==');
		sinon.stub(fs, 'writeFileSync');
		sinon.stub(fs, 'mkdirSync');
		sinon.stub(os, 'homedir').returns('/home/test/');

		this.vault = credentials.vault('test.dat', 'dGVzdAo=');
		sinon.stub(credentials, 'vault').returns(this.vault);
		sinon.stub(this.vault, 'get').returns(fakePromise({}));
		
		this.project = repoz.project('test', 'test', '123');
		sinon.stub(repoz, 'project').returns(this.project);
		this.project['any'] = function() {};
	});
 
	afterEach(function() {
		fs.existsSync.restore();
		fs.readFileSync.restore();
		fs.writeFileSync.restore();
		fs.mkdirSync.restore();
		os.homedir.restore();
		credentials.vault.restore();
		repoz.project.restore();
	});
 
	it('exec - create dir and vault', function(done) {
		this.existsSync.returns(false);
		sinon.stub(this.project, 'any').returns(fakePromise({}));
		command.exec('any', 'test', [], function() {
			done();
		});
	});
 
	it('exec - ok', function(done) {
		this.existsSync.returns(true);
		sinon.stub(this.project, 'any').returns(fakePromise({}));
		command.exec('any', 'test', [], function() {
			done();
		});
	});
 
	it('exec - failed', function(done) {
		this.existsSync.returns(true);
		sinon.stub(this.project, 'any').returns(fakePromise({}, true));
		command.exec('any', 'test', [], function() {
		}, function() {
			done();
		});
	});

 })
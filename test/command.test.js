const fs = require('fs');
const os = require('os');
var sinon = require('sinon');
 
var command = require('../lib/command.js');
var repoz = require('../lib/repoz.js');
var credentials = require('../lib/credentials.js');
 
describe('command', function() {

	function fakePromise(expectedResult) {
		return {
			then : function(callback) {
				callback && callback(expectedResult);
			},
		}
	}

	beforeEach(function() {

		sinon.stub(fs, 'existsSync').returns(true);
		sinon.stub(fs, 'readFileSync').returns('hdu9rN225PT/nw/CgDOhyw==');
		sinon.stub(fs, 'writeFileSync');
		sinon.stub(os, 'homedir').returns('/home/test/');

		this.vault = new credentials.Vault('test.dat', 'dGVzdAo=');
		sinon.stub(credentials, 'Vault').returns(this.vault);
		sinon.stub(this.vault, 'get').returns(fakePromise({}));
		
		this.project = new repoz.Project('test', 'test', '123');
		sinon.stub(repoz, 'Project').returns(this.project);

	});
 
	afterEach(function() {
		fs.existsSync.restore();
		fs.readFileSync.restore();
		fs.writeFileSync.restore();
		os.homedir.restore();
		credentials.Vault.restore();
		repoz.Project.restore();
	});
 
	it('exec - list', function(done) {
		sinon.stub(this.project, 'list').returns(fakePromise());
		command.exec('list', 'test', [], function() {
			done();
		});
	});
 
	it('exec - get', function(done) {
		sinon.stub(this.project, 'get').returns(fakePromise());
		command.exec('get', 'test', [], function() {
			done();
		});
	});
 
	it('exec - post', function(done) {
		sinon.stub(this.project, 'post').returns(fakePromise());
		command.exec('post', 'test', [], function() {
			done();
		});
	});
 
	it('exec - put', function(done) {
		sinon.stub(this.project, 'put').returns(fakePromise());
		command.exec('put', 'test', [], function() {
			done();
		});
	});
 
	it('exec - delete', function(done) {
		sinon.stub(this.project, 'delete').returns(fakePromise());
		command.exec('delete', 'test', [], function() {
			done();
		});
	});

 })
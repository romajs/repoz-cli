const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const prompt = require('prompt');
const sinon = require('sinon');
 
var credentials = require('../lib/credentials.js');
 
describe('credentials', function() {

	beforeEach(function() {
		sinon.stub(fs, 'readFileSync').returns('hdu9rN225PT/nw/CgDOhyw==');
		sinon.stub(fs, 'writeFileSync');
		this.promptGet = sinon.stub(prompt, 'get');
	});
 
	afterEach(function() {
		fs.readFileSync.restore();
		fs.writeFileSync.restore();
		prompt.get.restore();
	});

	assert.credential = function(expected, actual) {
		assert.equal(expected.username, actual.username);
		assert.equal(expected.password, actual.password);
		assert.equal(expected.project, actual.project);
		assert.equal(expected.access_type, actual.access_type);
	}
 
	it('load', function(done) {
		var vault = new credentials.Vault('test.dat', 'dGVzdAo=');
		vault.load();
		done();
	});

	it('save', function(done) {
		var vault = new credentials.Vault('test.dat', 'dGVzdAo=');
		vault.save();
		done();
	});
 
	it('update - read(0) to write(1)', function(done) {

		var expected = {
			username : 'test',
			password : '123',
			project : 'test',
			access_type : 0,
		};

		var vault = new credentials.Vault('test.dat', 'dGVzdAo=');

		vault.update(expected);

		vault.find('test', 0).then(function(credential) {

			assert.credential(expected, credential);
			assert.equal(null, credential.updated_at);

			expected = {
				username : 'test',
				password : '456',
				project : 'test',
				access_type : 1,
			};

			vault.update(expected);

			vault.find('test', 1).then(function(credential) {

				assert.credential(expected, credential);
				assert.notEqual(null, credential.updated_at);
				
				done();

			});
		});

	});
 
	it('update - write(1) then NOT update to read(0)', function(done) {

		var expected = {
			username : 'test',
			password : '123',
			project : 'test',
			access_type : 1,
		};

		var vault = new credentials.Vault('test.dat', 'dGVzdAo=');

		vault.update(expected);

		vault.find('test', 1).then(function(credential) {
			
			assert.credential(expected, credential);
			assert.equal(null, credential.updated_at);

			expected = {
				username : 'test',
				password : '123',
				project : 'test',
				access_type : 0,
			};

			vault.update(expected);

			expected.access_type = 1;
			
			vault.find('test', 1).then(function(credential) {

				assert.credential(expected, credential);
				assert.equal(null, credential.updated_at);
				
				vault.find('test', 0).then(function(credential) {

					assert.credential(expected, credential);
					assert.equal(null, credential.updated_at);
					
					done();

				});

			});
		});

	});
 
	it('update - password changed', function(done) {

		var expected = {
			username : 'test',
			password : '123',
			project : 'test',
			access_type : 1,
		};

		var vault = new credentials.Vault('test.dat', 'dGVzdAo=');

		vault.update(expected);

		vault.find('test', 1).then(function(credential) {

			assert.credential(expected, credential);
			assert.equal(null, credential.updated_at);

			expected = {
				username : 'test',
				password : '456',
				project : 'test',
				access_type : 1,
			};

			vault.update(expected);

			vault.find('test', 1).then(function(credential) {

				assert.credential(expected, credential);
				assert.notEqual(null, credential.updated_at);

				done();

			});
		});

	});
 
	it('find - read(0)', function(done) {

		var expected = null;

		var vault = new credentials.Vault('test.dat', 'dGVzdAo=');

		vault.find('test', 0).then(function(credential) {

			assert.equal(expected, credential);

			expected = {
				username : 'test',
				password : '123',
				project : 'test',
				access_type : 0,
			};

			vault.update(expected);

			vault.find('test', 0).then(function(credential) {

				assert.credential(expected, credential);
				assert.equal(null, credential.updated_at);

				vault.find('test', 1).then(function(credential) {

					assert.equal(null, credential);

					done();
				});

			});
		});

	});
 
	it('find - write(1)', function(done) {

		var expected = null;

		var vault = new credentials.Vault('test.dat', 'dGVzdAo=');

		vault.find('test', 1).then(function(credential) {

			assert.equal(expected, credential);

			expected = {
				username : 'test',
				password : '123',
				project : 'test',
				access_type : 1,
			};

			vault.update(expected);

			vault.find('test', 1).then(function(credential) {

				assert.credential(expected, credential);
				assert.equal(null, credential.updated_at);

				vault.find('test', 0).then(function(credential) {

					assert.credential(expected, credential);
					assert.equal(null, credential.updated_at);

					done();
				});

			});
		});

	});
 
 	it('get / prompt', function(done) {

		var expected = {
			username : 'test',
			password: '123',
			project : 'test',
			access_type : 0,
		};

		var vault = new credentials.Vault('test.dat', 'dGVzdAo=');

		this.promptGet.callsArgWith(1, undefined, expected);

		vault.get('test', 0).then(function(credential) {

			assert.credential(expected, credential);
			assert.equal(null, credential.updated_at);

			done();
		});

	});
 
 	it('get / find', function(done) {

		var expected = {
			username : 'test',
			password : '123',
			project : 'test',
			access_type : 0,
		};

		var vault = new credentials.Vault('test.dat', 'dGVzdAo=');

		vault.update(expected);

		vault.get('test', 0).then(function(credential) {
			
			assert.credential(expected, credential);
			assert.equal(null, credential.updated_at);

			done();
		});

	});

 })
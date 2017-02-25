const crypto = require('crypto');
const fs = require('fs');
const prompt = require('prompt');
const q = require('q');

module.exports.credential = function(username, password, project, access_type, created_at, updated_at) {
	return new Credential(username, password, project, access_type, created_at, updated_at);
}

function Credential(username, password, project, access_type, created_at, updated_at) {
	this.username = username
	this.password = password
	this.project = project
	this.access_type = access_type
	this.created_at = created_at
	this.updated_at = updated_at
}

module.exports.vault = function(file_name, cipher_key) {
	return new Vault(file_name, cipher_key);
}

function Vault(file_name, cipher_key) {

	var self = this;
	var credentials = [];

	self.load = function() {
		var encrypted = fs.readFileSync(file_name, 'utf8');
		var decipher = crypto.createDecipher('aes192', cipher_key);
		var decrypted = decipher.update(encrypted, 'base64', 'utf8') + decipher.final('utf8');
		credentials = JSON.parse(decrypted);
	}

	self.save = function() {
		var json = JSON.stringify(credentials);
		var cipher = crypto.createCipher('aes192', cipher_key);
		var encrypted = cipher.update(json, 'utf8', 'base64') + cipher.final('base64');
		fs.writeFileSync(file_name, encrypted, { mode: 0o600});
	}

	self.update = function(credential) {

		var index, c = credentials.find(function(c, index) {
			return c.project === credential.project && c.username === credential.username;
		});

		if(!c) {
			credential.created_at = new Date().toISOString();
			credential.updated_at = null;
			credentials.push(credential);
		} else if(c.password !== credential.password || credential.access_type > c.access_type) {
			c.password = credential.password;
			c.access_type = Math.max(c.access_type, credential.access_type);
			c.updated_at = new Date().toISOString();
			credentials.splice(index, 1, c);
		}
	}

	self.get = function(project, access_type) {

		var d = q.defer();

		self.find(project, access_type).then(function(credential) {

			if(credential) {
				d.resolve(credential);
			} else {
				self.prompt().then(function(result) {
					var credential = new Credential(result.username, result.password, project, access_type);
					d.resolve(credential);
				});
			}
		})

		return d.promise;
	}

	self.find = function(project, access_type) {

		var d = q.defer();

		var credential = credentials.find(function(c) {
			return c.project === project && c.access_type >= access_type;
		})

		d.resolve(credential);

		return d.promise;
	}

	self.prompt = function() {

		var d = q.defer();

		var properties = [
			{ name: 'username' },
			{ name: 'password', hidden: true }
		];

		prompt.get(properties, function (err, result) {
			if (err) {
				d.reject(err);
			} else {
				d.resolve(result);
			}
		});

		prompt.start();

		return d.promise;
	}

};
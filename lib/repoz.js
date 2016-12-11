'use strict';

var fs = require('fs');
var https = require('https');
var q = require('q');

module.exports = function(project, username, password) {
	return new Repoz(project, username, password);
}

function Repoz(project, username, password) {

	this.get = function(path, filepath) {
		var d = q.defer();
		var file = fs.createWriteStream(filepath || path.split('/').pop());
		request('GET', '/' + path).then(function(res) {
			res.pipe(file);
			d.resolve(file);
		});
		return d.promise;
	};

	this.post = function(path, filepath) {
		var d = q.defer();
		var data = fs.readFileSync(filepath);
		request('POST', '/' + path, data).then(function(res) {
			d.resolve(data);
		});
		return d.promise;
	};

	this.put = function(path, filepath) {
		var d = q.defer();
		var data = fs.readFileSync(filepath);
		request('PUT', '/' + path, data).then(function(res) {
			d.resolve(data);
		});
		return d.promise;
	};

	this.delete = function(path) {
		var d = q.defer();
		request('DELETE', '/' + path).then(function(res) {
			d.resolve();
		});
		return d.promise;
	};

	this.list = function(path) {
		var d = q.defer();
		request('GET', '?l=true&r=true').then(function(res) {
			res.on('data', function(data) {
				process.stdout.write(data);
				d.resolve(res);
			});
		});
		return d.promise;
	};

	function request(method, path, data) {

		var d = q.defer();

		var options =  {
			hostname: 'repoz.dextra.com.br',
			port: 443,
			path: ['', 'repoz', 'r', project, path].join('/').replace('//', '/').replace('/?', '?'),
			method: method,
			auth: username + ':' + password,
		};

		// console.log('options: ', options);

		var req = https.request(options, function(res) {
			d.resolve(res);
		});

		if(data !== undefined) {
			req.write(data);
		}

		req.end();

		return d.promise;
	}

}
'use strict';

const path = require('path');
const fs = require('fs');
const https = require('https');
const q = require('q');

module.exports = function(project, username, password) {
	return new Repoz(project, username, password);
}

function Repoz(project, username, password) {

	this.get = function(url_path, filepath) {

		var d = q.defer();

		filepath = filepath ? filepath : path.basename(url_path);
		filepath = path.resolve(filepath);

		var file = fs.createWriteStream(filepath);

		request('GET', '/' + url_path).then(function(res) {
			res.pipe(file);
			d.resolve(file);
		});

		return d.promise;
	};

	this.post = function(url_path, filepath) {

		var d = q.defer();

		filepath = filepath ? filepath : path.basename(url_path);
		filepath = path.resolve(filepath);

		var data = fs.readFileSync(filepath);

		request('POST', '/' + url_path, data).then(function(res) {
			d.resolve(data);
		});

		return d.promise;
	};

	this.put = function(url_path, filepath) {

		var d = q.defer();

		filepath = filepath ? filepath : path.basename(url_path);
		filepath = path.resolve(filepath);

		var data = fs.readFileSync(filepath);

		request('PUT', '/' + url_path, data).then(function(res) {
			d.resolve(data);
		});

		return d.promise;
	};

	this.delete = function(url_path) {

		var d = q.defer();

		if(!url_path) {
			d.reject('url_path is not defined');
		}

		request('DELETE', '/' + url_path).then(function(res) {
			d.resolve();
		});

		return d.promise;
	};

	this.list = function() {

		var d = q.defer();

		request('GET', '?l=true&r=true').then(function(res) {

			res.on('data', function(data) {
				process.stdout.write(data);
				d.resolve(data);
			});

		});

		return d.promise;
	};

	function request(method, url_path, data) {

		var d = q.defer();

		var options =  {
			hostname: 'repoz.dextra.com.br',
			port: 443,
			path: ['', 'repoz', 'r', project, url_path].join('/').replace(/\/+/g, '/').replace('/?', '?'),
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
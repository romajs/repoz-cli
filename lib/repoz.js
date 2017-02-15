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

		filepath = resolveFilepath(url_path, filepath);

		request('GET', '/' + url_path).then(function(res) {
			res.on('data', function(data) {

				console.info('response.data: %s', data);
				fs.writeFileSync(filepath, data);

				var file = fs.createReadStream(filepath);
				d.resolve(file);
			});
		}).catch(function(err) {
			d.reject(err);
		});

		return d.promise;
	};

	this.post = function(url_path, filepath) {

		var d = q.defer();

		filepath = resolveFilepath(url_path, filepath);
		var file = fs.readFileSync(filepath);

		return request('POST', '/' + url_path, file).then(function(res) {
			d.resolve(file);
		}).catch(function(err) {
			d.reject(err);
		});

		return d.promise;
	};

	this.put = function(url_path, filepath) {

		var d = q.defer();

		filepath = resolveFilepath(url_path, filepath);
		var file = fs.readFileSync(filepath);

		request('PUT', '/' + url_path, file).then(function(res) {
			d.resolve(file);
		}).catch(function(err) {
			d.reject(err);
		});

		return d.promise;
	};

	this.delete = function(url_path) {

		var d = q.defer();

		if(!url_path) {
			d.reject('url_path is not defined');
		} else {
			request('DELETE', '/' + url_path).then(function(res) {
				d.resolve();
			}).catch(function(err) {
				d.reject(err);
			});
		}

		return d.promise;
	};

	this.list = function() {

		var d = q.defer();

		request('GET', '?l=true&r=true').then(function(res) {
			res.on('data', function(data) {
				process.stdout.write(data);
				d.resolve(data);
			});
		}).catch(function(err) {
			d.reject(err);
		});

		return d.promise;
	};

	function resolveFilepath(url_path, filepath) {

		filepath = filepath ? filepath : path.basename(url_path);
		filepath = path.resolve(filepath);

		console.info('filepath resolved to: %s', filepath);

		return filepath;
	}

	function request(method, url_path, data) {

		var d = q.defer();

		var options =  {
			hostname: 'repoz.dextra.com.br',
			port: 443,
			path: ['', 'repoz', 'r', project, url_path].join('/').replace(/\/+/g, '/').replace('/?', '?'),
			method: method,
		};

		console.info('request.options:', options);

		options.auth = username + ':' + password;

		var req = https.request(options, function(res, x) {

			console.info('response.statusCode:', res.statusCode);

			if(res.statusCode == 200) {
				d.resolve(res);
			} else {
				d.reject(res.statusMessage);
			}
		});

		if(data !== undefined) {
			req.write(data);
		}

		req.end();

		return d.promise;
	}

}
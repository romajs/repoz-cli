'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');
const q = require('q');
const winston = require('winston');

module.exports.project = function(name, username, password) {
	return new Project(name, username, password);
}

module.exports.Project = Project;

function Project(name, username, password) {

	this.list = function(urlpath, recursive) {

		var d = q.defer();

		urlpath = (urlpath || '') + '?l=true';

		if(recursive) {
			urlpath += '&r=true';
		}

		request('GET', '/' + urlpath).then(function(res) {
			res.on('data', function(data) {
				process.stdout.write(data);
				d.resolve(data);
			});
		}).catch(function(err) {
			d.reject(err);
		});

		return d.promise;
	};

	this.get = function(urlpath, filepath) {

		var d = q.defer();

		filepath = resolveFilepath(urlpath, filepath);

		request('GET', '/' + urlpath).then(function(res) {

			res.pipe(fs.createWriteStream(filepath));

			res.on('data', function(data) {
				winston.silly('response.data: %s', data);
			});

			res.on('end', function() {
				var file = fs.createReadStream(filepath);
				d.resolve(file);
		  });

		}).catch(function(err) {
			d.reject(err);
		});

		return d.promise;
	};

	this.post = function(filepath, urlpath) {

		var d = q.defer();

		filepath = resolveFilepath(urlpath, filepath);
		var file = fs.readFileSync(filepath);

		request('POST', '/' + urlpath, file).then(function(res) {
			d.resolve(file);
		}).catch(function(err) {
			d.reject(err);
		});

		return d.promise;
	};

	this.put = function(filepath, urlpath) {

		var d = q.defer();

		filepath = resolveFilepath(urlpath, filepath);
		var file = fs.readFileSync(filepath);

		request('PUT', '/' + urlpath, file).then(function(res) {
			d.resolve(file);
		}).catch(function(err) {
			d.reject(err);
		});

		return d.promise;
	};

	this.delete = function(urlpath) {

		var d = q.defer();

		request('DELETE', urlpath).then(function(res) {
			d.resolve();
		}).catch(function(err) {
			d.reject(err);
		});

		return d.promise;
	};

	function resolveFilepath(urlpath, filepath) {

		filepath = filepath ? filepath : path.basename(urlpath);
		filepath = path.resolve(filepath);

		winston.info('filepath resolved to: %s', filepath);

		return filepath;
	}

	function request(method, urlpath, data) {

		var d = q.defer();

		var options =  {
			hostname: 'repoz.dextra.com.br',
			port: 443,
			path: ['', 'repoz', 'r', name, urlpath].join('/').replace(/\/+/g, '/').replace('/?', '?'),
			method: method,
		};

		winston.info('request.options:', options);

		options.auth = username + ':' + password;

		var req = https.request(options, function(res) {

			winston.info('response.statusCode:', res.statusCode);

			switch(res.statusCode) {
				case 200:
					d.resolve(res);
					break;
				case 302:
					winston.debug('response.headers.location:', res.headers.location);
					https.request(res.headers.location, function(res) {
						d.resolve(res);
					}).end();
					break;
				case 500:
					winston.error(res.statusMessage)
				default:
					d.reject(res.statusMessage);
					break;
			}

		});

		if(data !== undefined) {
			req.write(data);
		}

		req.end();

		return d.promise;
	}

}
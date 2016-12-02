var fs = require('fs');
var https = require('https');
var q = require('q');

const config = {
	host : 'repoz.dextra.com.br',
};

function makeRequest(options) {

	// console.log('options: ', options);

	var d = q.defer();

	var req = https.request(options, function(res) {
		res.on('data', function(data) {
			d.resolve(data);
		});
	});

	req.end();

	return d.promise;
}

exports.get = function(args) {
	
	var file = fs.createWriteStream(args.file || args.path.split('/').pop());

	var options = {
		hostname: config.host,
		port: 443,
		path: '/repoz/r/' + args.project + '/' + args.path,
		method: 'GET',
		auth: args.auth,
	};

	var d = q.defer();

	var req = https.request(options, function(res) {
		res.pipe(file);
	});

	req.end();

	return d.promise;
};

exports.post = function(args) {
	
	var file = fs.readFileSync(args.file);
	
	var options = {
		hostname: config.host,
		port: 443,
		path: '/repoz/r/' + args.project + '/' + args.path,
		method: 'POST',
		auth: args.auth,
	};

	var d = q.defer();

	var req = https.request(options, function(res) {
		res.on('data', function(data) {
			d.resolve(data);
		});
	});

	req.write(file);
	req.end();

	return d.promise;
};

exports.put = function(args) {
	
	var file = fs.readFileSync(args.file);
	
	var options = {
		hostname: config.host,
		port: 443,
		path: '/repoz/r/' + args.project + '/' + args.path,
		method: 'PUT',
		auth: args.auth,
	};
	
	var d = q.defer();

	var req = https.request(options, function(res) {
		res.on('data', function(data) {
			d.resolve(data);
		});
	});

	req.write(file);
	req.end();

	return d.promise;
};

exports.delete = function(args) {
	var options = {
		hostname: config.host,
		port: 443,
		path: '/repoz/r/' + args.project + '/' + args.path,
		method: 'DELETE',
		auth: args.auth,
	};
	return makeRequest(options);
};

exports.list = function(args) {
	var options = {
		hostname: config.host,
		port: 443,
		path: '/repoz/r/' + args.project + '?r=true&l=true',
		method: 'GET',
		auth: args.auth,
	};
	return makeRequest(options).then(function(data) {
	    process.stdout.write(data);
	});
};
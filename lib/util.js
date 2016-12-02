var program = require('commander');
var prompt = require('prompt');
var q = require('q');

exports.askCredentials = function() {

	var d = q.defer();

	var properties = [ { name: 'username' }, { name: 'password', hidden: true } ];

	prompt.start();

	prompt.get(properties, function (err, credentials) {
		if (err) {
			d.reject(err);
		} else {
			d.resolve(credentials);
		}
	});

	return d.promise;
};

exports.parseArgs = function(argv) {

	var d = q.defer();

	program.version('0.0.1')
		.option('-p, --project [project]', 'Project')
		.arguments('<command> [path] [file]')
		.action(function (command, path, file) {
			d.resolve({
				project: program.project,
				command: command,
				path: path,
				file: file,
			});
		})
		.parse(argv);

	return d.promise;
}

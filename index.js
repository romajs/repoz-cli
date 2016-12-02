var api = require('./src/api');
var util = require('./src/util');

const commands = {
	'get' : api.get,
	'post' : api.post,
	'put' : api.put,
	'delete' : api.delete,
	'list' : api.list,
};

module.exports = function(argv) {

	util.parseArgs(process.argv).then(function(program) {

		// console.log('program: ', program);

		var command = commands[program.command];

		if(command === undefined) {
			console.info('Command "%s" not found.', program.command);
			process.exit(1);
		}

		util.askCredentials().then(function(credentials) {

			// console.log('credentials: ', credentials);

			var args = {
				auth : credentials.username + ':' + credentials.password,
				project: program.project,
				path: program.path,
				file: program.file,
			};

			command.apply(this, [args]).finally(function(data) {
				console.info('Done.');
				process.exit(0);
			});
		})

	})

};
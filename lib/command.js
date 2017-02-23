#!/usr/bin/env node

// 'use strict';

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const winston = require('winston');

const repozHandler = require('./repoz');
const credentialsHandler = require('./credentials.js');

const AT_READ = 0, AT_WRITE = 1;

const ACCESS_TYPES = {
	get : AT_READ,
	post : AT_WRITE,
	put : AT_WRITE,
	delete : AT_WRITE,
	list : AT_READ,
};

module.exports.exec = exec;

function exec(command, project, args) {

	winston.info('command:', command)
	winston.info('project:', project)
	winston.info('args:', args);

	var credentials, cipher_key;

	var d = os.homedir() + '/.repoz';
	if(!fs.existsSync(d)) {
		fs.mkdirSync(d);
	}

	var f = d + '/credentials.json';
	if(!fs.existsSync(f)) {
		cipher_key = crypto.randomBytes(256).toString('base64');
		fs.writeFileSync(d + '/.cipher_key', cipher_key, { mode: 0o400});
		credentials = credentialsHandler.createCredentials(f, cipher_key);
	} else {
		cipher_key = fs.readFileSync(d + '/.cipher_key');
		credentials = credentialsHandler.loadCredentials(f, cipher_key);
	}

	credentials.get(project, ACCESS_TYPES[command]).then(function(credential) {

		var repoz = repozHandler(project, credential.username, credential.password);

		repoz[command].apply(this, args).then(function() {
			credentials.update(credential);
			credentials.save();
			winston.info('done.');
			process.exit(0);
		}).catch(function(err) {
			winston.error('failed.', err);
			process.exit(1);
		});

	});

};
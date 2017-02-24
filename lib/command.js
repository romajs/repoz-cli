#!/usr/bin/env node

// 'use strict';

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const winston = require('winston');

const repoz = require('./repoz');
const credentials = require('./credentials.js');

const AT_READ = 0, AT_WRITE = 1;

const ACCESS_TYPES = {
	get : AT_READ,
	post : AT_WRITE,
	put : AT_WRITE,
	delete : AT_WRITE,
	list : AT_READ,
};

module.exports.exec = exec;

function exec(command, project, args, successCallback, errorCallback) {

	winston.info('command:', command, ', project:', project, ', args:', args);

	var vault, cipher_key;

	var d = os.homedir() + '/.repoz';
	if(!fs.existsSync(d)) {
		fs.mkdirSync(d);
	}

	var f = d + '/credentials.dat';
	if(!fs.existsSync(f)) {
		cipher_key = crypto.randomBytes(256).toString('base64');
		fs.writeFileSync(d + '/.cipher_key', cipher_key, { mode: 0o400});
		vault = credentials.createVault(f, cipher_key);
	} else {
		cipher_key = fs.readFileSync(d + '/.cipher_key');
		vault = credentials.loadVault(f, cipher_key);
	}

	var credential = vault.get(project, ACCESS_TYPES[command]);

	var instance = repoz(project, credential.username, credential.password);

	instance[command].apply(this, args).then(function() {
		vault.update(credential);
		vault.save();
		winston.info('done.');
		successCallback && successCallback();
		// process.exit(0);
	}).catch(function(err) {
		winston.error('failed.', err);
		errorCallback && errorCallback();
		// process.exit(1);
	});
	
};
'use strict';

var repoz = require('repoz');

var projectA = repoz.project('projectA', 'credentialsA');
projectA.post('/foo.txt', 'foo.txt');

var projectB = repoz.project('projectB', 'credentialsB')
	.put('/bar.txt', 'bar.txt')
	.delete('wrong-file.zip');

projectA.list();

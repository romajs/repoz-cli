'use strict';

var repoz = require('repoz');

var projectA = repoz('projectA', 'credentialsA');
projectA.post('/foo.txt', 'foo.txt');

var projectB = repoz('projectB', 'credentialsB')
	.put('/bar.txt', 'bar.txt')
	.delete('wrong-file.zip');

projectA.list();

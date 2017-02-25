'use strict';

var repoz = require('repoz');

var projectA = new repoz.Project('projectA', 'credentialsA');
projectA.post('/foo.txt', 'foo.txt');

var projectB = new repoz.Project('projectB', 'credentialsB')
	.put('/bar.txt', 'bar.txt')
	.delete('wrong-file.zip');

projectA.list();

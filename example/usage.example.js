'use strict'

var repoz = require('../lib/repoz');

var projectA = new repoz.Project('projectA', 'userA', 'passA');
var projectB = new repoz.Project('projectB', 'userB', 'passB');

projectA.list('/').then(function() {
	projectA.get('/foo').then(function(data) {
		projectB.put('/bar', data);
	});
});

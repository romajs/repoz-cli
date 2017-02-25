'use strict'

var repoz = require('../lib/repoz');

var projectA = repoz.project('projectA', 'userA', 'passA');
var projectB = repoz.project('projectB', 'userB', 'passB');

projectA.list('/').then(function() {
	projectA.get('/foo').then(function(data) {
		projectB.put('/bar', data);
	});
});

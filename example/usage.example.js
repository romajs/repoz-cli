'use strict'

var repoz = require('../lib/repoz');

var projectA = repoz('projectA', 'userA', 'passA');
var projectB = repoz('projectB', 'userB', 'passB');

projectA.list('/').then(function() {
	projectA.get('/foo').then(function(data) {
		projectB.put('/bar', data);
	});
});

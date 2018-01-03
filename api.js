'use strict';

const Homey = require('homey');

module.exports = [
	{
		method: 'POST',
		path: '/log',
		public: true,
		fn: (args, callback) => {
			callback( null, Homey.app.updateLog( Homey.app.getDateTime(new Date()) + " " + args.body.log));
		}
	},
	{
		method: 'PUT',
		path: '/addPaperTrails2AllFlows',
		public: false,
		fn: (args, callback) => {
			var allflows = Homey.app.addPaperTrails2AllFlows();
			allflows.then( function(result) {
				return allflows
			})
			callback( null, "OK");
		}
	},
	{
		method: 'PUT',
		path: '/migrate2PaperTrails',
		public: false,
		fn: (args, callback) => {
			var allflows = Homey.app.migrate2PaperTrails();
			allflows.then( function(result) {
				return allflows
			})
			callback( null, "OK");
		}
	},
	{
		method: 'DELETE',
		path: '/removePaperTrailsfAllFlows',
		public: false,
		fn: (args, callback) => {
			var allflows = Homey.app.removePaperTrailsfAllFlows( args );
			allflows.then( function(result) {
				return allflows
			})
			callback( null, "OK");
		}
	}
]

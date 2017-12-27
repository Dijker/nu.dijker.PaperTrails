'use strict';

const Homey = require('homey');

module.exports = [
	{
		method: 'POST',
		path: '/log',
		public: true,
		fn: (args, callback) => {
      console.log(args.body.log);
			callback( null, Homey.app.updateLog( Homey.app.getDateTime2(new Date()) + " " + args.body.log));
		}
	}
]

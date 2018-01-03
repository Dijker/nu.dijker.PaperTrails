"use strict";
const { HomeyAPI } = require('athom-api');
const Homey = require('homey');

// Define new Log Card to Add to All Flows in Then and Else
var newLogCardJSON  = '{"id":"Input_date_time_log","uri":"homey:app:nu.dijker.papertrails","uriObj":{"type":"app","id":"nu.dijker.papertrails","icon":"/app/nu.dijker.papertrails/assets/icon.svg","name":"PaperTrails"},"args":{"log":"$$"},"droptoken":false,"group":"then","delay":{"number":"0","multiplier":"1"},"duration":{"number":"0","multiplier":"1"}}'

const actionInputLog = new Homey.FlowCardAction('Input_log');

//Homey.manager('flow').on('action.truncate_log', function( callback, args ) {
const actionTruncateLog = new Homey.FlowCardAction('truncate_log');

// Homey.manager('flow').on('action.truncate_log_pct', function( callback, args ) {
const actionTruncateLogPct = new Homey.FlowCardAction('truncate_log_pct');

// Homey.manager('flow').on('action.Input_date_time_log', function( callback, args ) {
const actionInputDateTimeLog = new Homey.FlowCardAction('Input_date_time_log');

// Homey.manager('flow').on('action.Clear_log', function( callback, args ) {
const actionClearLog = new Homey.FlowCardAction('Clear_log');

// Homey.manager('flow').on('action.programmatic_trigger', function( callback, args ) {
const actionProgrammaticTrigger = new Homey.FlowCardAction('programmatic_trigger');

// conditionInputDateTimeLog
const conditionInputDateTimeLog = new Homey.FlowCardCondition('condition_date_time_log');

var appSettings = {};
var appConfig = {};
var hostname = require('os').hostname();

class paperTrails extends Homey.App {
	async onInit() {
		process.on('unhandledRejection', error => {
  		console.error(error.stack);
  	});
		this.log('Start init paperTrails');
		this.log('HostName: ' + hostname );
		appSettings = Homey.ManagerSettings.get('settings');
		//this.log('Current appSettings: \n', appSettings);
		if (appSettings == (null || undefined)) {
			this.log('Initializing settings ...')
			appSettings = {
				'refresh': '5',
				'maxLogLength': '10123',
				'migrated': false
			}
		};
		appConfig = Homey.ManagerSettings.get('config');
		// this.log('Current appConfig: \n', appConfig);
		if (appConfig == (null || undefined)) {
			this.log('Initializing config ...')
			appConfig = {
				'timeStampFormat': 'Sec',
				'appendLog': true
			}
		};

		if (!appSettings.migrated) {
			this.log('Migrating App Settings ....');
			appSettings.maxLogLength = Homey.ManagerSettings.get( 'maxLogLength' );
			appSettings.migrated = true;
			appConfig.timeStampFormat = Homey.ManagerSettings.get( 'timeStampFormat' );
			appConfig.appendLog = Homey.ManagerSettings.get( 'appendLog' );
		};
		// Update afer migrations
		if (appSettings.maxLogLength  == (null || undefined)) {appSettings.maxLogLength  = "10240" };
		if (appSettings.autoPrefixThen  == (null || undefined)) {appSettings.autoPrefixThen  = 'AL! Then - ' };
		if (appSettings.autoPrefixElse  == (null || undefined)) {appSettings.autoPrefixElse  = 'AL! Else - ' };
		if (appConfig.timeStampFormat  == (null || undefined)) {appConfig.timeStampFormat  = 'Sec' };
		if (appConfig.appendLog  == (null || undefined)) {appConfig.appendLog  = true };

		// save if updated / Just save!
		Homey.ManagerSettings.set('settings', appSettings);
		Homey.ManagerSettings.set('config', appConfig);

		// Reverse Log !!
		if ((appConfig.newAppendLog != (null || undefined) )
				&&(appConfig.appendLog != appConfig.newAppendLog)) {
			this.log('Reversing Log... Append:' , appConfig.appendLog )
			var logOld = Homey.ManagerSettings.get( 'myLog' );
			var logNew = this.reverseLog(logOld).join('\n');
			Homey.ManagerSettings.set( 'myLog', logNew );
			appConfig.appendLog = appConfig.newAppendLog;
			Homey.ManagerSettings.set('config', appConfig)
		};
		this.log('End of onInit \nCurrent appSettings :\n', appSettings);
		this.log('Current appConfig :\n', appConfig);
	}; // End of onInit()

	// Add somthing to the Log
	updateLog( logMsg ) {
		var logNew = '';
		var logOld = Homey.ManagerSettings.get( 'myLog' );
		if ((logOld === null ) || (logOld.length === 0)) {
			logOld = "-=-=- Log for " + hostname + " New from install -=-=- " + Homey.app.getDateTime(new Date()) ;
		};
		var logLength = logOld.split(/\r\n|\r|\n/).length;
		if ( appConfig.appendLog === true ) {
			logNew = logOld + "\n" + logMsg;
		} else {
			logNew = logMsg + "\n" + logOld;
		};
		var logLength = logNew.split(/\r\n|\r|\n/).length;
		var tokens = { 'logLength': logLength,
									 'Log': logNew };
	  var state = { 'logLength': logLength };
		Custom_LogLines.trigger( tokens, state, function(err, result){
			if( err ) {
				return Homey.error(err)} ;
			});
		if ( (+5 + +appSettings.maxLogLength ) < logLength ) {
			var deleteItems = parseInt( logLength *0.2 );
			var logArray = logNew.split(/\r\n|\r|\n/);
			var infoMsg = "-=-=- Max. LogLength " + appSettings.maxLogLength  + " reached! Deleting " + deleteItems + " lines at :" + Homey.app.getDateTime(new Date()) + " -=-=-";
			if ( appConfig.appendLog === true ) {
				var removedLog = logArray.splice(0,deleteItems, infoMsg );
			} else {
				var removedLog = logArray.splice(-1* deleteItems, deleteItems, infoMsg );
			}
			logNew = logArray.join('\n');
		};

		// Check for Max logLength to trigger
		if (logLength > (appSettings.maxLogLength)) {
				max_loglines.trigger(tokens, state, function(err, result){
					if( err ) {return Homey.error(err)} ;
				})
			}
		Homey.ManagerSettings.set( 'myLog', logNew );
	};

	// two Global functions:
	objectLength(obj) {
	    var result = 0;
	    for(var prop in obj) {
	        if (obj.hasOwnProperty(prop)) {result++;}}
	    return result;
	};

	updateFlow( modFlow ) {
	    // This is the JSON of the Card we add to all Flows
	    var newLogCardJSON  = '{"id":"Input_date_time_log","uri":"homey:app:nu.dijker.papertrails","uriObj":{"type":"app","id":"nu.dijker.papertrails","icon":"/app/nu.dijker.papertrails/assets/icon.svg","name":"PaperTrails"},"args":{"log":"$$"},"droptoken":false,"group":"then","delay":{"number":"0","multiplier":"1"},"duration":{"number":"0","multiplier":"1"}}'

	    // Create an Object for the Then and Else groups
	    var newLogCardT = JSON.parse(newLogCardJSON);
	    newLogCardT.group = 'then';
	    var newLogCardE = JSON.parse(newLogCardJSON);
	    newLogCardE.group = 'else';

	    // Init loop
	    var modFlowChanged = false;
	    var modFlowThen = -1;
	    var modFlowElse = -1;
			for(var myIndex = modFlow.actions.length-1 ; myIndex >=0 ; myIndex-- ) {
	    // for(var myIndex in modFlow.actions ) { //fails on inserting to reach the end.
	        if  ( -1 === modFlowThen ) {
	            if (modFlow.actions[ myIndex ].group === 'then') {
	                if ( (modFlow.actions[ myIndex ].id === 'Input_date_time_log') && (modFlow.actions[ myIndex ].uri === 'homey:app:nu.dijker.papertrails' ) ) {
	                    modFlowThen = myIndex;
	                    this.log( 'Then Already exists '+  myIndex);
	                } else {
	                    modFlow.actions.splice( myIndex, 0, newLogCardT );
	                    modFlow.actions[ myIndex ].args.log = appSettings.autoPrefixThen + modFlow.title;
	                    modFlowThen = myIndex;
	                    modFlowChanged = true;
	                    this.log( 'Then added '+  myIndex);
	                }
	            }
	        } else {
	            if (modFlow.actions[ myIndex ].group === 'then') {
	                if ( (modFlow.actions[ myIndex ].id === 'Input_date_time_log') && (modFlow.actions[ myIndex ].uri === 'homey:app:nu.dijker.papertrails' ) ) {
	                    this.log( 'Then Duplicate removed ' +  myIndex);
	                    modFlow.actions[ modFlowThen ].args.log = modFlow.actions[ myIndex ].args.log;
	                    modFlow.actions.splice( myIndex, 1);
	                    modFlowChanged = true;
	                }
	            }
	        }
	    }
	    for(var myIndex in modFlow.actions ) {
	        if  (modFlowElse === -1) {
	            if (modFlow.actions[ myIndex ].group === 'else') {
	                if ( (modFlow.actions[ myIndex ].id === 'Input_date_time_log') && (modFlow.actions[ myIndex ].uri === 'homey:app:nu.dijker.papertrails' ) ) {
	                    modFlowElse = myIndex;
	                    this.log( 'Else already exists '+  myIndex);
	                } else {
	                    modFlow.actions.splice( myIndex, 0, newLogCardE );
	                    modFlow.actions[ myIndex ].args.log = appSettings.autoPrefixElse + modFlow.title ;
	                    modFlowElse = myIndex;
	                    modFlowChanged = true;
	                    this.log( 'Else  added '+  myIndex);
	                }
	            }
	        } else {
	            if (modFlow.actions[ myIndex ].group === 'else') {
	                if ( (modFlow.actions[ myIndex ].id === 'Input_date_time_log') && (modFlow.actions[ myIndex ].uri === 'homey:app:nu.dijker.papertrails' ) ) {
	                    this.log( 'Else Duplicate removed '+  myIndex);
	                    modFlow.actions[ modFlowElse ].args.log = modFlow.actions[ myIndex ].args.log;
	                    modFlow.actions.splice( myIndex, 1);
	                    modFlowChanged = true;
	                }
	            }
	        }
	    }
	    return modFlowChanged;
	};

// migrate2PaperTrailsFlow
	migrate2PaperTrailsFlow( modFlow ) {
		// This is the JSON of the Card we add to all Flows
		var newLogCardJSON  = '{"id":"Input_date_time_log","uri":"homey:app:nu.dijker.papertrails","uriObj":{"type":"app","id":"nu.dijker.papertrails","icon":"/app/nu.dijker.papertrails/assets/icon.svg","name":"PaperTrails"},"args":{"log":"$$"},"droptoken":false,"group":"then","delay":{"number":"0","multiplier":"1"},"duration":{"number":"0","multiplier":"1"}}'

		var oldLogCardID  = "Input_log" ;
		var oldLogCardURI  ='homey:app:nl.nielsdeklerk.log' ;
		// Init loop
		var modFlowChanged = false;
		var modFlowThen = -1;
		// Create an Array Object for the Then and Else groups (can't use same Object multiple times)
		var newLogCardT = [];
		var updateIndex = 0;
		for(var myIndex in modFlow.actions ) {
			if ( (modFlow.actions[ myIndex ].id === oldLogCardID ) && (modFlow.actions[ myIndex ].uri === oldLogCardURI ) ) {
				// Create an Object for the Then and Else groups
				newLogCardT.push( JSON.parse(newLogCardJSON));
				// var newLogCardT[updateIndex] = JSON.parse(newLogCardJSON);

				modFlowThen = myIndex;
				this.log( ' SimpleLog Found on Index '+  myIndex);
				this.log( ' SimpleLog '+  JSON.stringify (modFlow.actions[ myIndex ]) );
				// Save old arguments and settings
				var params = {
					'argslog' 	: modFlow.actions[ myIndex ].args.log,
					'group' 		: modFlow.actions[ myIndex ].group,
					'delay' 		: modFlow.actions[ myIndex ].delay,
					'duration' 	: modFlow.actions[ myIndex ].duration,
					'droptoken' : modFlow.actions[ myIndex ].droptoken
				};
				// replace card
				modFlow.actions.splice( myIndex, 1, newLogCardT[updateIndex] );
				// restore old arguments and settings
				modFlow.actions[ myIndex ].args.log = params.argslog ;
				modFlow.actions[ myIndex ].group = params.group ;
				modFlow.actions[ myIndex ].delay = params.delay ;
				modFlow.actions[ myIndex ].duration = params.duration ;
				modFlow.actions[ myIndex ].droptoken = params.droptoken ;

				updateIndex++;
				modFlowChanged = true;
			}
		}
		return modFlowChanged;
	};

	// removePaperTrailsfFlow
	removePaperTrailsfFlow( modFlow, removeAllOccurrences) {
	    // Init loop
	    var modFlowChanged = false;
			for(var myIndex = modFlow.actions.length-1 ; myIndex >=0 ; myIndex-- ) {
          if ( (modFlow.actions[ myIndex ].id === 'Input_date_time_log')
								&& (modFlow.actions[ myIndex ].uri === 'homey:app:nu.dijker.papertrails' )
								&& ( removeAllOccurrences
										|| (modFlow.actions[ myIndex ].args.log.indexOf(appSettings.autoPrefixThen) === 0)
										|| (modFlow.actions[ myIndex ].args.log.indexOf(appSettings.autoPrefixElse) === 0)))  {
							modFlow.actions.splice( myIndex, 1);
							modFlowChanged = true;
          }
	    }
	    return modFlowChanged;
	};

	getApi() {
		if (!this.api) {
			this.api = HomeyAPI.forCurrentHomey();
		}
		return this.api;
	};

	// addPaperTrails2AllFlows
	async addPaperTrails2AllFlows (){
			const api = await this.getApi();
			var allFlows = await api.flow.getFlows();
			this.log( 'Number of Flows to Process: ' + this.objectLength( allFlows ) )

			// Main Loop over al Flows
			for(var myIndex in allFlows ) {
			    // if ( allFlows[ myIndex ].title  === 'Test123' ) { //  Only testing one flow
						this.log( allFlows[ myIndex ].title )
						this.log( myIndex )
			        this.log('='.repeat(30));
			        let mymodFlowChanged = this.updateFlow( allFlows[ myIndex ] );
			        this.log( 'Number of Actions: ' + this.objectLength( allFlows[ myIndex ].actions )) ;

			        // only update flow if changed.
			        if (mymodFlowChanged) {
									this.log('123 Updated Flow');
									this.log(myIndex);
									this.log( JSON.stringify(allFlows[ myIndex ]) );
									// fix folder eq false to folder = "";
									if (allFlows[ myIndex ].folder  === false ) { allFlows[ myIndex ].folder = "" };
			            let result = await api.flow.updateFlow({id: myIndex , flow: allFlows[ myIndex ] });
			            this.log('Flow Updated');
			        } else { this.log('Flow unchanged') }
			    //} // End Only testing one flow
			}
			return allFlows;
	};

	// migrate2PaperTrails
	async migrate2PaperTrails (){
			const api = await this.getApi();
			var allFlows = await api.flow.getFlows();
			this.log( 'Number of Flows to Process: ' + this.objectLength( allFlows ) )

			// main code

			// Main Loop over al Flows
			for(var myIndex in allFlows ) {
			    // if ( allFlows[ myIndex ].title  === 'simpleLog1' ) { //  Only testing one flow
						this.log( allFlows[ myIndex ].title )
						this.log( myIndex )
			        this.log('='.repeat(30));
			        let mymodFlowChanged = this.migrate2PaperTrailsFlow( allFlows[ myIndex ] );
			        this.log( 'Number of Actions: ' + this.objectLength( allFlows[ myIndex ].actions )) ;

			        // only update flow if changed.
			        if (mymodFlowChanged) {
									this.log('123 Updated Flow');
									this.log(myIndex);
									this.log( JSON.stringify(allFlows[ myIndex ]) );
									// fix folder eq false to folder = "";
									if (allFlows[ myIndex ].folder  === false ) { allFlows[ myIndex ].folder = "" };
			            let result = await api.flow.updateFlow({id: myIndex , flow: allFlows[ myIndex ] });
			            this.log('Flow Updated');
			        } else { this.log('Flow unchanged') }
			    //} // End Only testing one flow
			}
			return allFlows;
	};

	// removePaperTrailsfAllFlows
	async removePaperTrailsfAllFlows ( args ){
		// main code
			this.log( 'args		: ' , args )
			var removeAllOccurrences = args.body.removeAllOccurrences
			const api = await this.getApi();
			var allFlows = await api.flow.getFlows();
			this.log( 'Number of Flows to Process: ' + this.objectLength( allFlows ) )
			this.log( 'removeAllOccurrences		: ' , removeAllOccurrences )

			// Main Loop over al Flows
			for(var myIndex in allFlows ) {
			    // if ( allFlows[ myIndex ].title  === 'Test123' ) {
						this.log( allFlows[ myIndex ].title )
						this.log( myIndex )
			        this.log('='.repeat(30));
			        let mymodFlowChanged = this.removePaperTrailsfFlow( allFlows[ myIndex ], removeAllOccurrences );
			        this.log( 'Number of Actions: ' + this.objectLength( allFlows[ myIndex ].actions )) ;

			        // only update flow if changed.
			        if (mymodFlowChanged) {
									this.log(myIndex);
									this.log( JSON.stringify(allFlows[ myIndex ]) );
									// fix folder eq false to folder = "";
									if (allFlows[ myIndex ].folder  === false ) { allFlows[ myIndex ].folder = "" };
			            let result = await api.flow.updateFlow({id: myIndex , flow: allFlows[ myIndex ] });
			            this.log('Flow Updated');
			        } else { this.log('Flow unchanged') }
			}
			return allFlows;
	};

	getDateTime(date) {
	    //var date = new Date();
			// toISOString
			if (appConfig.timeStampFormat === "Zulu") {
				return '[' + date.toISOString() + ']';
			}	else {
		    var hour = addZero (date.getHours()); var min = addZero (date.getMinutes()); var sec = addZero (date.getSeconds());
		    var year = date.getFullYear(); var month = addZero (date.getMonth()+1); var day  = addZero (date.getDate());
				var msec = ("00" + date.getMilliseconds()).slice(-3)
		    if (appConfig.timeStampFormat === "mSec") {
					return year + "-" + month + "-" + day + " " + hour + ":" + min + "." + sec + "." + msec;
				} else {
					return year + "-" + month + "-" + day + " " + hour + ":" + min + "." + sec;
			}
		}
	};

	reverseLog(logOld) {
		var logArray = logOld.split(/\n/);
		var logLength = logArray.length;
		return logArray.reverse()
	}
}

module.exports = paperTrails;

// Trigger on programmatic_trigger
let programmatic_trigger = new Homey.FlowCardTrigger('programmatic_trigger');
	programmatic_trigger
		.register()
		.registerRunListener((args,state) => Promise.resolve(true) )

// logTruncated
let logTruncated = new  Homey.FlowCardTrigger('logTruncated');
	logTruncated
		.register()
		.registerRunListener((args,state) => Promise.resolve(true) )

// logCleared
let logCleared = new  Homey.FlowCardTrigger('logCleared');
	logCleared
		.register()
		.registerRunListener((args,state) => Promise.resolve(true) )

// Trigger on max_loglines
let max_loglines = new  Homey.FlowCardTrigger('max_loglines');
	max_loglines
		.register()
		.registerRunListener( onMax_loglines )

// Trigger on Custom_LogLines
let Custom_LogLines  = new  Homey.FlowCardTrigger('Custom_LogLines');
	Custom_LogLines
		.register()
		.registerRunListener( onCustom_LogLines )

function onCustom_LogLines( args, state, callback ) {
	if( args.logLength <= state.logLength  ) {
			callback( null, true );
	} else {
			callback( null, false );
		}
};

// onMax_loglines ??
function onMax_loglines( args, state, callback) {
			callback( null, true ) // If true, this flow should run. The callback is (err, result)-style.
};

function addZero(i) { return ("0"+i).slice(-2);};

Date.prototype.addHours = function(h) {
   this.setTime(this.getTime() + (h*60*60*1000));
   return this;
}

// truncateLog
function truncateLog(logOld, infoMsg,  index) {
	var logArray = logOld.split(/\n/);
	var logLength = logArray.length;
	if ( appConfig.appendLog ) {
		var removedLog = logArray.splice(0,index, infoMsg );
		var logNew = logArray.join('\n');
	} else {                        // *******
		var removedLog = logArray.splice(index, (logLength - index), infoMsg );
		var logNew = logArray.join('\n');
	}
	// var logNew = Homey.ManagerSettings.get( 'myLog' );
	var logLength = removedLog.length;
	var removedLog2 = removedLog.join('\n');
	var tokens = { 'logLength': logLength,
								 'Log': removedLog2,
							 	 'infoMsg': infoMsg };
  logTruncated.trigger( tokens, null,  function(err, result){
	if( err ) {
			return Homey.error(err)}
	} );
	return logNew;
}

// truncate_log
actionTruncateLog.register().on('run', ( args, state, callback ) => {
	var date1 = new Date();
	var truncMsg = "-=-=- " + hostname +": Truncate Log for "  + args.removeHours  + " hours from Flow at: " + Homey.app.getDateTime(date1)+" -=-=- " ;
	// removeHours
	var logOld = Homey.ManagerSettings.get( 'myLog' );
	var timeNow =Homey.app.getDateTime( date1 );
	var cutDate =Homey.app.getDateTime( date1.addHours( -1*args.removeHours) );
	var logArray = logOld.split(/\n/);
	var strStart = cutDate.substring(0, 3);

	var logline = logArray.find(function (el) {
	    return ((el.substring(0, 3) === strStart) && (((el > cutDate)&& appConfig.appendLog) || ((el < cutDate)&& !appConfig.appendLog)));
	});
	var nr = logArray.indexOf( logline );
	if (nr > 0) {
		console.log(' nr ' + nr + ' :' + logline  );
		var logNew = truncateLog( logOld, truncMsg, nr );
		Homey.ManagerSettings.set( 'myLog', logNew );
	};
	callback( null, true );
});

// truncate_log_pct
actionTruncateLogPct.register().on('run', ( args, state, callback ) => {
	var date1 = new Date();
	var truncMsg = "-=-=- " + hostname +": Truncate Log for "  + args.removePct  + " % from Flow at: " + Homey.app.getDateTime(date1)+" -=-=- " ;
	var logOld = Homey.ManagerSettings.get( 'myLog' );
	var timeNow =Homey.app.getDateTime( date1 );
	var logArray = logOld.split(/\n/);

	if (appConfig.appendLog) {
		var index = logArray.length * (args.removePct/100)
	} else {
		var index = logArray.length - parseInt(logArray.length * (args.removePct/100))
	}
	if (index > 0) {
		console.log(' index ' + index );
		var logNew = truncateLog( logOld, truncMsg, index);
		Homey.ManagerSettings.set( 'myLog', logNew );
	};
	callback( null, true );
});

// for Original v0.0.5 logging
actionInputLog.register().on('run', ( args, state, callback ) => {
		Homey.app.updateLog( args.log );
    callback( null, true );
});

// condition_date_time_log by Geurt Dijker
conditionInputDateTimeLog.register().on('run', ( args, state, callback ) => {
				Homey.app.updateLog(Homey.app.getDateTime(new Date()) + " " + args.log);
		    callback( null, true );
		});

// Input_date_time_log by Geurt Dijker
actionInputDateTimeLog.register().on('run', ( args, state, callback ) => {
		Homey.app.updateLog( Homey.app.getDateTime(new Date()) + " " + args.log);
    callback( null, true );
});

// action.Clear_log
actionClearLog.register().on('run', ( args, state, callback ) => {
	  var logNew = "-=-=- Log for " + hostname + " cleared from Flow -=-=- " + Homey.app.getDateTime(new Date()) +" -=-=- ";
		var logOld = Homey.ManagerSettings.get( 'myLog' );
		var logLength = logOld.split(/\n/).length;
		var tokens = { 	'logLength': logLength,
									 	'Log': logOld,
							 			'infoMsg': logNew };
		logCleared.trigger( tokens, null,  function(err, result) {});
  	Homey.ManagerSettings.set( 'myLog', logNew );
  	console.log(' Action.Clear_log     The log data is cleared.');
  	callback( null, true );
});

actionProgrammaticTrigger.register().on('run', ( args, state, callback ) => {
		var infoMsg = "-=-=-" + hostname +": PaperTrails-Trigger a Flow at: " + Homey.app.getDateTime(new Date()) +" -=-=- " ;
	  var logOld = Homey.ManagerSettings.get( 'myLog' );
		var logLength = logOld.split(/\n/).length;
		var tokens = { 	'logLength': logLength,
									 	'Log': logOld,
							 			'infoMsg': infoMsg };

		programmatic_trigger.trigger( tokens, null,  function(err, result){
  	if( err ) {
 				return Homey.error(err)}
	  } );
    callback( null, true );
});

//Get update settings
Homey.ManagerSettings.on('set', (key) => {
	if (key === 'settings' ) {
		appSettings = Homey.ManagerSettings.get('settings');}
	if (key === 'config'  ) {
		appConfig = Homey.ManagerSettings.get('config');
	}
});

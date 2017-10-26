"use strict";

const Homey = require('homey');
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

//
const conditionInputDateTimeLog = new Homey.FlowCardCondition('condition_date_time_log');

class paperTrails extends Homey.App {
	onInit() {
		this.log('init paperTrails');
	}
}
module.exports = paperTrails;

var hostname =require('os').hostname();
var appendLog = Homey.ManagerSettings.get( 'appendLog' );
if (appendLog === undefined) {
	appendLog = true;
	Homey.ManagerSettings.set( 'appendLog', appendLog);
}
var lastAppendLogSetting = appendLog;
// Homey.log(' lastAppendLogSetting ' + lastAppendLogSetting);
var timeStampFormat = Homey.ManagerSettings.get( 'timeStampFormat' );
console.log('timeStampFormat :' + timeStampFormat );
var maxLogLength;
var intervalS = Homey.ManagerSettings.get( 'intervalS');
if (intervalS === undefined) {
	intervalS = 13;
	Homey.ManagerSettings.set( 'intervalS', intervalS);
}

// Trigger on programmatic_trigger
// Homey.manager('flow').on('trigger.programmatic_trigger', function( callback, args, state) {} );
let programmatic_trigger = new Homey.FlowCardTrigger('programmatic_trigger');
	programmatic_trigger
		.register()
		.registerRunListener((args,state) => Promise.resolve(true) )
// logTruncated
// Homey.manager('flow').on('trigger.logTruncated', function( callback, args, state) {} );

let logTruncated = new  Homey.FlowCardTrigger('logTruncated');
	logTruncated
		.register()
		.registerRunListener((args,state) => Promise.resolve(true) )
// logCleared
// Homey.manager('flow').on('trigger.logCleared', function( callback, args, state) {} );
let logCleared = new  Homey.FlowCardTrigger('logCleared');
	logCleared
		.register()
		.registerRunListener((args,state) => Promise.resolve(true) )
// Trigger on max_loglines
// Homey.manager('flow').on('trigger.max_loglines', onMax_loglines );
let max_loglines = new  Homey.FlowCardTrigger('max_loglines');
	max_loglines
		.register()
		.registerRunListener( onMax_loglines )
// Trigger on Custom_LogLines
// Homey.manager('flow').on('trigger.Custom_LogLines', onCustom_LogLines );
let Custom_LogLines  = new  Homey.FlowCardTrigger('Custom_LogLines');
	Custom_LogLines
		.register()
		.registerRunListener( onCustom_LogLines )

/*
let updateTimeStampFormat = new Homey.MamagerSettings.get('set', () => {
		timeStampFormat = Homey.ManagerSettings.get( 'timeStampFormat' );
		console.log( 'timeStampFormat ' + timeStampFormat);
})
*/

function onCustom_LogLines( args, state, callback ) {
  // *** debuging ***
	// Homey.log(' onCustom_LogLines got Triggered ' );
	console.log( args );
	console.log( state);
	if( args.logLength <= state.logLength  ) {
			// Homey.log(' onCustom_LogLines got Triggered 2 ');
			callback( null, true );
	} else {
			callback( null, false );
		}
};

// **** Cleanup to do !
function onMax_loglines( args, state, callback) {
	// Homey.log(' onMax_loglines got Triggered ');
	console.log(args);
	if( true ) {
			// Homey.log(' onMax_loglines got Triggered2 ');
			callback( null, true ); // If true, this flow should run. The callback is (err, result)-style.
	} else {
			callback( null, false );
		}
};

function addZero(i) { return ("0"+i).slice(-2);};
function getDateTime(date) {
    //var date = new Date();
		// toISOString
		if (timeStampFormat === "Zulu") {
			return '[' + date.toISOString() + ']';
		}	else {
	    var hour = addZero (date.getHours()); var min = addZero (date.getMinutes()); var sec = addZero (date.getSeconds());
	    var year = date.getFullYear(); var month = addZero (date.getMonth()+1); var day  = addZero (date.getDate());
			var msec = ("00" + date.getMilliseconds()).slice(-3)
	    if (timeStampFormat === "mSec") {
				return year + "-" + month + "-" + day + " " + hour + ":" + min + "." + sec + "." + msec;
			} else {
				return year + "-" + month + "-" + day + " " + hour + ":" + min + "." + sec;
		}
	}
};

Date.prototype.addHours = function(h) {
   this.setTime(this.getTime() + (h*60*60*1000));
   return this;
}

function reverseLog(logOld) {
	// Homey.log(' lastAppendLogSetting was ' + lastAppendLogSetting);
	var logArray = logOld.split(/\n/);
	var logLength = logArray.length;
	lastAppendLogSetting = Homey.ManagerSettings.get( 'appendLog' );
	// Homey.log(' lastAppendLogSetting now ' + lastAppendLogSetting);
	return logArray.reverse()
}

// truncateLog
function truncateLog(logOld, infoMsg,  index) {
	// Homey.log('function truncate Log: Delete  Items' + index);
	var logArray = logOld.split(/\n/);
	var logLength = logArray.length;
	if ( appendLog === true ) {
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
	// Homey.log('function truncate Log: Deleted:' + logLength);
	// Homey.log( tokens);
	// console.log(tokens);
	//Homey.manager('flow').trigger('logTruncated', tokens, null,  function(err, result){
  logTruncated.trigger( tokens, null,  function(err, result){
	if( err ) {
			return Homey.error(err)}
	} );
	return logNew;
}

// Add somthing to the Log *** OK
function updateLog(logMsg) {
	appendLog = Homey.ManagerSettings.get( 'appendLog' );
	maxLogLength = Homey.ManagerSettings.get( 'maxLogLength' );
	var logNew = '';
	var logOld = Homey.ManagerSettings.get( 'myLog' );
	// Homey.log('Log Old' + logOld);
	if ((logOld === null ) || (logOld.length === 0)) {
		logOld = "-=-=- Log for " + hostname + " New from install -=-=- " + getDateTime(new Date()) ;
	};
	if (lastAppendLogSetting !== appendLog) {
		logOld = reverseLog(logOld).join('\n');
	}
	var logLength = logOld.split(/\r\n|\r|\n/).length;
	// Homey.log('Log logLength and Msg: ' + maxLogLength + ' : ' + logLength + ' : ' + logMsg);
	if ( appendLog === true ) {
		logNew = logOld + "\n" + logMsg;
	} else {
		logNew = logMsg + "\n" + logOld;
	};
	var logLength = logNew.split(/\r\n|\r|\n/).length;
	var tokens = { 'logLength': logLength,
								 'Log': logNew };
  var state = { 'logLength': logLength };
//	Homey.manager('flow').trigger('Custom_LogLines', tokens, state, function(err, result){
	Custom_LogLines.trigger( tokens, state, function(err, result){
		if( err ) {
			return Homey.error(err)} ;
		} )
	if ( (+maxLogLength + +3) < logLength ) {

		var deleteItems = parseInt( maxLogLength*0.2 );
		// Homey.log('Log logLength gt  Max, remove ' + deleteItems );
		var logArray = logNew.split(/\r\n|\r|\n/);
		var infoMsg = "-=-=- Max. LogLength " + maxLogLength + " reached! Deleting " + deleteItems + " lines at :" + getDateTime(new Date()) + " -=-=-";
		if ( appendLog === true ) {
			var removedLog = logArray.splice(0,deleteItems, infoMsg );
		} else {
			var removedLog = logArray.splice(-1* deleteItems, deleteItems, infoMsg );
		}
		logNew = logArray.join('\n');
	}
	// Check for Max logLength to trigger
	if (logLength > (maxLogLength)) {
		// Homey.log('Log logLength gt Max, Trigger ');
		// Homey.manager('flow').trigger('max_loglines', tokens, state, function(err, result){
			max_loglines.trigger(tokens, state, function(err, result){
			if( err ) {
				return Homey.error(err)} ;
			} )
		}
	Homey.ManagerSettings.set( 'myLog', logNew );
};

// truncate_log
// Homey.manager('flow').on('action.truncate_log', function( callback, args ) {
actionTruncateLog.register().on('run', ( args, state, callback ) => {
	var date1 = new Date();
	var truncMsg = "-=-=- " + hostname +": Truncate Log for "  + args.removeHours  + " hours from Flow at: " + getDateTime(date1)+" -=-=- " ;
	// removeHours
	var logOld = Homey.ManagerSettings.get( 'myLog' );
	var timeNow = getDateTime( date1 );
	var cutDate = getDateTime( date1.addHours( -1*args.removeHours) );
	var logArray = logOld.split(/\n/);
	var appendLog = Homey.ManagerSettings.get( 'appendLog' );
	var strStart = cutDate.substring(0, 3);

	var logline = logArray.find(function (el) {
	    return ((el.substring(0, 3) === strStart) && (((el > cutDate)&& appendLog) || ((el < cutDate)&& !appendLog)));
	});
	var nr = logArray.indexOf( logline );
	if (nr > 0) {
		console.log(' nr ' + nr + ' :' + logline  );
		var logNew = truncateLog( logOld, truncMsg, nr );
		Homey.ManagerSettings.set( 'myLog', logNew );
	};
	callback( null, true );
});

// truncate_log_pct **** ??
// Homey.manager('flow').on('action.truncate_log_pct', function( callback, args ) {
actionTruncateLogPct.register().on('run', ( args, state, callback ) => {
	var date1 = new Date();
	var truncMsg = "-=-=- " + hostname +": Truncate Log for "  + args.removePct  + " % from Flow at: " + getDateTime(date1)+" -=-=- " ;
	var logOld = Homey.ManagerSettings.get( 'myLog' );
	var timeNow = getDateTime( date1 );
	var logArray = logOld.split(/\n/);
	var appendLog = Homey.ManagerSettings.get( 'appendLog' );

	if (appendLog) {
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
// ** Homey.manager('flow').on('action.Input_log', function( callback, args ) {
actionInputLog.register().on('run', ( args, state, callback ) => {
		updateLog( args.log);
    callback( null, true );
});

// condition_date_time_log by Geurt Dijker
conditionInputDateTimeLog
		.register()
		.on('run', ( args, state, callback ) => {
				updateLog( getDateTime(new Date()) + " " + args.log);
		    callback( null, true );
		});

// Input_date_time_log by Geurt Dijker
// Homey.manager('flow').on('action.Input_date_time_log', function( callback, args ) {
actionInputDateTimeLog.register().on('run', ( args, state, callback ) => {
		updateLog( getDateTime(new Date()) + " " + args.log);
    callback( null, true );
});

// action.Clear_log *** 2 Check
// Homey.manager('flow').on('action.Clear_log', function( callback, args ) {
actionClearLog.register().on('run', ( args, state, callback ) => {
	  var logNew = "-=-=- Log for " + hostname + " cleared from Flow -=-=- " + getDateTime(new Date()) +" -=-=- ";
		var logOld = Homey.ManagerSettings.get( 'myLog' );
		var logLength = logOld.split(/\n/).length;
		var tokens = { 	'logLength': logLength,
									 	'Log': logOld,
							 			'infoMsg': logNew };
		// Homey.manager('flow').trigger('logCleared', tokens, null,  function(err, result) {});
		logCleared.trigger( tokens, null,  function(err, result) {});
  	Homey.ManagerSettings.set( 'myLog', logNew );
  	console.log(' Action.Clear_log     The log data is cleared.');
  	callback( null, true );
});

// action.programmatic_trigger ***OK
// Homey.manager('flow').on('action.programmatic_trigger', function( callback, args ) {
actionProgrammaticTrigger.register().on('run', ( args, state, callback ) => {
	  // Homey.log('Trigger the action.programmatic_trigger');
		var infoMsg = "-=-=-" + hostname +": PaperTrails-Trigger a Flow at: " + getDateTime(new Date()) +" -=-=- " ;
	  var logOld = Homey.ManagerSettings.get( 'myLog' );
		var logLength = logOld.split(/\n/).length;
		var tokens = { 	'logLength': logLength,
									 	'Log': logOld,
							 			'infoMsg': infoMsg };
		// console.log(tokens);
		// Homey.manager('flow').trigger('programmatic_trigger', tokens, null,  function(err, result){
		programmatic_trigger.trigger( tokens, null,  function(err, result){
  	if( err ) {
 				return Homey.error(err)}
	  } );
    callback( null, true );
});

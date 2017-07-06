"use strict";

function init() {
		Homey.log("Hello world!");
}
module.exports.init = init;

var hostname =require('os').hostname();
var appendLog = Homey.manager('settings').get( 'appendLog' );
if (appendLog === undefined) {
	appendLog = true;
	Homey.manager('settings').set( 'appendLog', appendLog);
}
var lastAppendLogSetting = appendLog;
// Homey.log(' lastAppendLogSetting ' + lastAppendLogSetting);
var maxLogLength;
var intervalS;
if (intervalS === undefined) {
	intervalS = true;
	Homey.manager('settings').set( 'intervalS', intervalS);
}

// Trigger on programmatic_trigger
Homey.manager('flow').on('trigger.programmatic_trigger', function( callback, args, state) {} );
// Trigger on max_loglines
Homey.manager('flow').on('trigger.max_loglines', onMax_loglines );
// Trigger on Custom_LogLines
Homey.manager('flow').on('trigger.Custom_LogLines', onCustom_LogLines );

function onCustom_LogLines(callback, args, state) {
	Homey.log(' onCustom_LogLines got Triggered ');
	console.log(args);
	console.log(state);
	if( args.logLength <= state.logLength  ) {
			Homey.log(' onCustom_LogLines got Triggered 2 ');
			callback( null, true ); // If true, this flow should run. The callback is (err, result)-style.
	} else {
			callback( null, false );
		}
};

// **** Cleanup to do !
function onMax_loglines(callback, args, state) {
	Homey.log(' onMax_loglines got Triggered ');
	console.log(args);
	if( true ) {
			Homey.log(' onMax_loglines got Triggered2 ');
			callback( null, true ); // If true, this flow should run. The callback is (err, result)-style.
	} else {
			callback( null, false );
		}
};

function addZero(i) { return ("0"+i).slice(-2);};
function getDateTime(date) {
    //var date = new Date();
    var hour = addZero (date.getHours()); var min = addZero (date.getMinutes()); var sec = addZero (date.getSeconds());
    var year = date.getFullYear(); var month = addZero (date.getMonth()+1); var day  = addZero (date.getDate());
    return year + "-" + month + "-" + day + " " + hour + ":" + min + "." + sec;
};
Date.prototype.addHours = function(h) {
   this.setTime(this.getTime() + (h*60*60*1000));
   return this;
}

function reverseLog(logOld) {
	// Homey.log(' lastAppendLogSetting was ' + lastAppendLogSetting);
	var logArray = logOld.split(/\n/);
	var logLength = logArray.length;
	lastAppendLogSetting = Homey.manager('settings').get( 'appendLog' );
	// Homey.log(' lastAppendLogSetting now ' + lastAppendLogSetting);
	return logArray.reverse()
}

function truncateLog(logOld, infoMsg,  deleteItems) {
	Homey.log('function truncate Log: Delete  Items' + deleteItems);
	var logArray = logOld.split(/\n/);
	var logLength = logArray.length;
	if ( appendLog === true ) {
		var removedLog = logArray.splice(0,deleteItems, infoMsg );
		var logNew = logArray.join('\n');
	} else {
		var removedLog = logArray.splice(-1*(logLength-deleteItems), (logLength-deleteItems), infoMsg );
		var logNew = logArray.join('\n');
	}
	// var logNew = Homey.manager('settings').get( 'myLog' );
	var logLength = removedLog.length;
	var removedLog2 = removedLog.join('\n');
	var tokens = { 'logLength': logLength,
								 'Log': removedLog2,
							 		'infoMsg': infoMsg };
	Homey.log('function truncate Log: Deleted:' + logLength);
	Homey.log('function truncate Log: Deleted:' + tokens);
	// console.log(tokens);
	Homey.manager('flow').trigger('programmatic_trigger', tokens, null,  function(err, result){
	if( err ) {
			return Homey.error(err)}
	} );
	return logNew;
}

function updateLog(logMsg) {
	appendLog = Homey.manager('settings').get( 'appendLog' );
	maxLogLength = Homey.manager('settings').get( 'maxLogLength' );
	var logNew = '';
	var logOld = Homey.manager('settings').get( 'myLog' );
	// Homey.log('Log Old' + logOld);
	if ((logOld === undefined) || (logOld.length === 0)) {
		logOld = "-=-=- Log for " + hostname + " New from install -=-=- " + getDateTime(new Date()) ;
	};
	if (lastAppendLogSetting !== appendLog) {
		logOld = reverseLog(logOld).join('\n');
	}
	var logLength = logOld.split(/\r\n|\r|\n/).length;
	Homey.log('Log logLength and Msg: ' + maxLogLength + ' : ' + logLength + ' : ' + logMsg);
	if ( appendLog === true ) {
		logNew = logOld + "\n" + logMsg;
	} else {
		logNew = logMsg + "\n" + logOld;
	};
	var logLength = logNew.split(/\r\n|\r|\n/).length;
	var tokens = { 'logLength': logLength,
								 'Log': logNew };
  var state = { 'logLength': logLength };
	Homey.manager('flow').trigger('Custom_LogLines', tokens, state, function(err, result){
		if( err ) {
			return Homey.error(err)} ;
		} )
	if ( (+maxLogLength + +3) < logLength ) {

		var deleteItems = parseInt( maxLogLength*0.2 );
		Homey.log('Log logLength gt  Max, remove ' + deleteItems );
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
		Homey.log('Log logLength gt Max, Trigger ');
		Homey.manager('flow').trigger('max_loglines', tokens, state, function(err, result){
			if( err ) {
				return Homey.error(err)} ;
			} )
		}
	Homey.manager('settings').set( 'myLog', logNew );
};

// truncate_log by Geurt Dijker v0.0.8
Homey.manager('flow').on('action.truncate_log', function( callback, args ) {
	var date1 = new Date();
	var truncMsg = "-=-=- " + hostname +": Truncate Log for "  + args.removeHours  + " hours from Flow at: " + getDateTime(date1)+" -=-=- " ;
	// removeHours
	var logOld = Homey.manager('settings').get( 'myLog' );
	var timeNow = getDateTime( date1 );
	var cutDate = getDateTime( date1.addHours( -1*args.removeHours) );
	var logArray = logOld.split(/\n/);
	var appendLog = Homey.manager('settings').get( 'appendLog' );

	// **** appendLog = true!
	var logline = logArray.find(function (el) {
			// must start with 201... so it is a Date,
			// maybe I created the first Decenium problem for Homey,
			// have to look into that later
	    return ((el.substring(0, 3) === '201') && (((el > cutDate)&& appendLog) || ((el < cutDate)&& !appendLog)));
	});
	var nr = logArray.indexOf( logline );
	if (nr > 0) {
		Homey.log (' nr ' + nr + ' :' + logline  );
		var logNew = truncateLog( logOld, truncMsg, nr );
		Homey.manager('settings').set( 'myLog', logNew );
	};
	callback( null, true );
});

// for Original v0.0.5 logging
Homey.manager('flow').on('action.Input_log', function( callback, args ) {
		updateLog( args.log);
    callback( null, true );
});

// Input_date_time_log by Geurt Dijker
Homey.manager('flow').on('action.Input_date_time_log', function( callback, args ) {
		updateLog( getDateTime(new Date()) + " " + args.log);
    callback( null, true );
});

Homey.manager('flow').on('action.Clear_log', function( callback, args ) {
		var logNew = "-=-=- Log for " + hostname + " cleared from Flow -=-=- " + getDateTime(new Date());
    Homey.manager('settings').set( 'myLog', logNew );
    Homey.log (' Action.Clear_log     The log data is cleared.');
    callback( null, true );
});

// for Trigger-the-trigger
Homey.manager('flow').on('action.programmatic_trigger', function( callback, args ) {
		// Trigger the programmatic_trigger
	  Homey.log('Trigger the Trigger 1 ');
		var infoMsg = "-=-=-" + hostname +": PaperTrails-Trigger a Flow at: " + getDateTime(new Date())+" -=-=- " ;

	  var logOld = Homey.manager('settings').get( 'myLog' );
		var logLength = logOld.split(/\n/).length;
		var tokens = { 	'logLength': logLength,
									 	'Log': logOld,
							 			'infoMsg': infoMsg };
		// console.log(tokens);
		Homey.manager('flow').trigger('programmatic_trigger', tokens, null,  function(err, result){
  	if( err ) {
 				return Homey.error(err)}
	  } );
    callback( null, true );
});

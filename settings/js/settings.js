/* global $, Homey */
var Homey;
var _myLog = '';
var intervalS = 3;
var interval;
var timeStampFormat = 'Sec';
var appSettings = {
        'refresh': "1",
        'maxLogLength': "10239",
        'autoPrefixThen':'!',
        'autoPrefixElse':'!',
        'scrollToEnd':true };
var appConfig = {
  'timeStampFormat': 'Sec',
  'appendLog': true };
var migrated;
var scrollToEnd;

function onHomeyReady( homeyReady ){
  Homey = homeyReady;
  Homey.get('settings', function(err, appSettings1 ) {
      if (err) {
        console.error(err)
      } else {
        console.log('appSettings-in' );
        console.log( appSettings1 );
        if (appSettings1 != (null || undefined)) {
          appSettings = appSettings1;
          document.getElementById('intervalS').value = appSettings.refresh;
          document.getElementById('maxLogLength').value = appSettings.maxLogLength;
          document.getElementById('scrollToEnd').checked = appSettings.scrollToEnd;
          scrollToEnd = appSettings.scrollToEnd;
          document.getElementById('autoPrefixThen').value = appSettings.autoPrefixThen;
          document.getElementById('autoPrefixElse').value = appSettings.autoPrefixElse;
          interval = setInterval( function(){ show_log() } , appSettings.refresh * 1000);
          migrated = appSettings.migrated;
          // document.getElementById('enableSyslog').checked = appSettingsenableSyslog;
          //syslogServer
          document.getElementById('syslogServer').value = appSettings.syslogServer;
          //syslogPort
          document.getElementById('syslogPort').value = appSettings.syslogPort;
          //enableSyslogAll
          if (appSettings.transport === 'TCP') {
            document.getElementById('TCP').checked = true;
          } else {document.getElementById('UDP').checked = true};

          document.getElementById('enablerfc5424').checked = appSettings.enablerfc5424;

          document.getElementById('enableSyslogAll').checked = appSettings.enableSyslogAll;
          document.getElementById('syslogappName').value = appSettings.syslogappName;
          document.getElementById('syslogseverity').value = appSettings.syslogseverity;
          document.getElementById('syslogfacility').value = appSettings.syslogfacility;
        }
      }});
    Homey.get('appSettingsenableSyslog', function(err, appSettingsenableSyslog) {
      document.getElementById('enableSyslog').checked = appSettingsenableSyslog;
    });
    Homey.get('config', function(err, appConfig1 ) {
    if (err) {
      console.error(err)
    } else {
      if (appConfig1 != (null || undefined)) {
        appConfig = appConfig1;
        console.log('appConfig-in2' );
        console.log( appConfig );
        document.getElementById('timeStampFormat').value = appConfig.timeStampFormat;
        /* document.getElementById('appendLog').checked = appConfig.appendLog;
        */ // panel-button-1
        if (appConfig.appendLog) {
          document.getElementById('panel-button-1').innerHTML = '<a href="javascript:showPanel(1)">Log &#9660; </a>';
        } else {
          document.getElementById('panel-button-1').innerHTML = '<a href="javascript:showPanel(1)">Log &#9650; </a>';
        };
        Homey.ready();
      }
    }});

  show_log();
  showPanel(1);
};

Date.prototype.yyyymmddHHMMss = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
    var HH = this.getHours();
    var MM = this.getMinutes();
    var ss = this.getSeconds();
    return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd,
            (HH>9 ? '' : '0') + HH,
            (MM>9 ? '' : '0') + MM,
            (ss>9 ? '' : '0') + ss,
           ].join('');
};

// change update interval
function updateResfresh() {
  clearInterval(interval);
  var appSettings = {};
  appSettings.refresh = document.getElementById('intervalS').value;
  interval = setInterval( function(){ show_log() }, appSettings.refresh * 1000);
};

// appSettingsenableSyslog
function saveSettingsenableSyslog(){
  appSettingsenableSyslog = document.getElementById('enableSyslog').checked;
  Homey.set('appSettingsenableSyslog', appSettingsenableSyslog );
};

function saveSettings(){
    appSettings.refresh = document.getElementById('intervalS').value;
    appSettings.maxLogLength = document.getElementById('maxLogLength').value;
    appSettings.scrollToEnd = document.getElementById('scrollToEnd').checked;
    scrollToEnd = document.getElementById('scrollToEnd').checked;
    appSettings.autoPrefixThen = document.getElementById('autoPrefixThen').value;
    appSettings.autoPrefixElse = document.getElementById('autoPrefixElse').value;
    appSettings.migrated = migrated;
    appSettings.syslogServer = document.getElementById('syslogServer').value;
    appSettings.syslogPort = document.getElementById('syslogPort').value;
    if (document.getElementById('TCP').checked) {
      appSettings.transport = 'TCP';
    } else {appSettings.transport = 'UDP'};

    appSettings.enablerfc5424 = document.getElementById('enablerfc5424').checked;
    appSettings.enableSyslogAll = document.getElementById('enableSyslogAll').checked;

    appSettings.syslogappName = document.getElementById('syslogappName').value;
    appSettings.syslogseverity = parseInt( document.getElementById('syslogseverity').value);
    appSettings.syslogfacility = parseInt( document.getElementById('syslogfacility').value);

    Homey.set('settings', appSettings );
};

function saveConfig(){
    var lastAppendLogSetting = appConfig.appendLog;
    appConfig.newAppendLog = document.getElementById('appendLog').checked;
    appConfig.timeStampFormat = document.getElementById('timeStampFormat').value;
    var confirmationMessage ;
    var yes = false;
    if (lastAppendLogSetting != appConfig.newAppendLog) {
      confirmationMessage = "Click OK to Reverse PaperTrails Logging and Restart the App.";
    } else {
      confirmationMessage = "Click OK to Change the default Time and Date notation";
    };
    Homey.confirm( confirmationMessage, 'warning', function( err, yes ){
      if( !yes ) return yes;
      Homey.set('config', appConfig );
      //setTimeout( function() { post('/api/manager/apps/app/nu.dijker.papertrails/restart', {enabled:true}) },3000 )
    });
};


function clear_LOG(){
  var confirmationMessage = "Click OK to clear the Logfile on Homey.";
  Homey.confirm( confirmationMessage, 'warning', function( err, yes ){
    if( !yes ) return;
    var date = new Date();
    Homey.set('myLog', '-=-=- Log Cleared from Settings page []'+date.yyyymmddHHMMss()+'] -=-=-');
  })
};

function download_PaperTrails(){
    var date = new Date();
    download('PaperTrails-'+ date.yyyymmddHHMMss() +'.txt',document.getElementById('logtextarea').value);
};

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    };
};

function show_log(){
    Homey.get('myLog', function(err, myLog){
        if( err ) {
          document.getElementById('logtextarea').value = 'Could not get log' + err
          return console.error('Could not get log', err);
        };
        var snap = ((logtextarea.scrollHeight-logtextarea.scrollTop-logtextarea.clientHeight) < (0.3  *logtextarea.clientHeight));
        if ( _myLog !== myLog ){
            _myLog = myLog
           document.getElementById('logtextarea').value = myLog;
        };
        var scrollToEnd = document.getElementById('scrollToEnd').checked;
        if ( scrollToEnd && snap ) {
            logtextarea.scrollTop = logtextarea.scrollHeight;
        };
    });
};

function showPanel(panel) {
  if (panel===1 && scrollToEnd) {
    logtextarea.scrollTop = logtextarea.scrollHeight;
  };
  $('.panel').hide()
  $('.panel-button').removeClass('active')
  $('#panel-button-' + panel).addClass('active')
  $('#panel-' + panel).show()
  show_log()
};

// addPaperTrails2AllFlows
function addPaperTrails2AllFlows(){
  var confirmationMessage = "Click OK to Add PaperTrails Logging to ALL your Flows.";
  Homey.confirm( confirmationMessage, 'warning', function( err, yes ){
    if( !yes ) return;
    Homey.api('PUT', '/addPaperTrails2AllFlows',  { 'foo': 'bar' }, function( err, result ) {
      if( err ) return Homey.alert(err);
    })
  })
};

// migrate2PaperTrails
function migrate2PaperTrails(){
  var confirmationMessage = "Click OK to replace Simple Log cards to PaperTrails in ALL your Flows.";
  Homey.confirm( confirmationMessage, 'warning', function( err, yes ){
    if( !yes ) return;
    Homey.api('PUT', '/migrate2PaperTrails',  { 'foo': 'bar' }, function( err, result ) {
      if( err ) return Homey.alert(err);
    })
  })
};

// removePaperTrailsfAllFlows
function removePaperTrailsfAllFlows(){
  var removeAllOccurrences = document.getElementById('removeAllOccurrences').checked;
  var confirmationMessage = "Click OK to Remove PaperTrails Logging from ALL your Flows.";
  if (removeAllOccurrences) {
    confirmationMessage += " (Independent from Prefixes)"
  } else {
    confirmationMessage += " (with same Prefixes)"
  }
  Homey.confirm( confirmationMessage, 'warning', function( err, yes ){
    if( !yes ) return;
    Homey.api('DELETE', '/removePaperTrailsfAllFlows',  { 'removeAllOccurrences': removeAllOccurrences }, function( err, result ) {
      if( err ) return Homey.alert(err);
    })
  })
};

// sendLogtoDeveloper
function sendLogtoDeveloper(){
  //  Homey.api( 'POST', '../../manager/apps/app/nu.dijker.papertrails/crashlog',  { }, function( err, result ) {
  post('/api/manager/apps/app/nu.dijker.papertrails/crashlog', {});
};

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

/* global $, Homey */
var Homey;
var _myLog = '';
var intervalS = +8;
var appendLog;
var interval;
var maxLogLength = 10238;
var timeStampFormat = 'Sec';
var appSettings = {};

function onHomeyReady( homeyReady ){
  Homey = homeyReady;
  Homey.ready();
  Homey.get('settings', function(err, appSettings ) {
      var set = false;
      if (err) {
        console.error(err)
      } else {
        if (appSettings === null) {
          // Should not happen.....
          console.log( 'Why??' );
          appSettings = {
            'refresh': 5,
            'timeStampFormat': 'Sec',
            'maxLogLength': 10240,
            'appendLog': true,
          }
          set = true
        }
        console.log('appSettings' + appSettings);
        document.getElementById('appendLog').checked = appSettings.appendLog;
        document.getElementById('intervalS').value = appSettings.refresh;
        document.getElementById('maxLogLength').value = appSettings.maxLogLength;
        document.getElementById('timeStampFormat').value = appSettings.timeStampFormat;
        document.getElementById('scrollToEnd').checked = appSettings.scrollToEnd;
        document.getElementById('autoPrefixThen').value = appSettings.autoPrefixThen;
        document.getElementById('autoPrefixElse').value = appSettings.autoPrefixElse;
        if (set) { saveSettings() }
      }
    } );

  //interval = setInterval( function(){ show_log() } , appSettings.refresh * 1000);
  interval = setInterval( function(){ show_log() } , 3 * 1000);
  var logtextarea = document.getElementById('logtextarea');
  logtextarea.scrollTop = logtextarea.scrollHeight;
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
  appSettings.refresh = document.getElementById('intervalS').value;
  saveSettings();
  interval = setInterval( function(){ show_log() }, appSettings.refresh * 1000);
};

function saveSettings(){
    appSettings.refresh = document.getElementById('intervalS').value;
    appSettings.appendLog = document.getElementById('appendLog').checked;
    appSettings.maxLogLength = document.getElementById('maxLogLength').value;
    appSettings.timeStampFormat = document.getElementById('timeStampFormat').value;
    appSettings.scrollToEnd = document.getElementById('scrollToEnd').checked;
    appSettings.autoPrefixThen = document.getElementById('autoPrefixThen').value;
    appSettings.autoPrefixElse = document.getElementById('autoPrefixElse').value;
    Homey.set('settings', appSettings );
};

function clear_simpleLOG(){
  var confirmationMessage = "Click OK to clear the Logfile on Homey.";
  Homey.confirm( confirmationMessage, 'warning', function( err, yes ){
    if( !yes ) return;
    var date = new Date();
    Homey.set('myLog', '-=-=- Log Cleared from Settings page []'+date.yyyymmddHHMMss()+'] -=-=-');
  })
};

function download_PaperTrails(){
    var date = new Date();
    // date.yyyymmddHHMMss();
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
        if ( _myLog !== myLog ){
            _myLog = myLog
           document.getElementById('logtextarea').value = myLog;
        };
        var scrollToEnd =document.getElementById('scrollToEnd').checked;
        if ( scrollToEnd ) {
            logtextarea.scrollTop = logtextarea.scrollHeight;
        };
    });
};

function showPanel (panel) {
  $('.panel').hide()
  $('.panel-button').removeClass('active')
  $('#panel-button-' + panel).addClass('active')
  $('#panel-' + panel).show()
  show_log()
};

// addPaperTrails2AllFlows
function addPaperTrails2AllFlows(){
    Homey.api('PUT', '/addPaperTrails2AllFlows',  { 'foo': 'bar' }, function( err, result ) {
      if( err ) return Homey.alert(err);
    })
};

// removePaperTrailsfAllFlows
function removePaperTrailsfAllFlows(){
    Homey.api('DELETE', '/removePaperTrailsfAllFlows',  { 'foo': 'bar' }, function( err, result ) {
      if( err ) return Homey.alert(err);
    })
};

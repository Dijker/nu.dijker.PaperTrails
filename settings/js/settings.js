/* global $, Homey */
var Homey;
var _myLog = '';
var intervalS = +8;
var appendLog;
var interval;
var maxLogLength = 1029;
var timeStampFormat;

function onHomeyReady( homeyReady ){
  Homey = homeyReady;
  Homey.ready();
  Homey.get('appendLog', function(err, appendLog ) {
      var set = false;
      if (err) {
        console.error(err)
      } else {
        if (appendLog === undefined) {
          appendLog = true
          set = true
        }
      document.getElementById('appendLog').checked = appendLog;
      if (set) { saveAppendLog() }
      }
    } );
  Homey.get('scrollToEnd', function(err, scrollToEnd ) {
    var set = false;
    if (err) {
      console.error(err)
    } else {
      if (scrollToEnd === undefined) {
        scrollToEnd = appendLog
        set = true
      }
      document.getElementById("scrollToEnd").checked = scrollToEnd;
      if (set) { saveScrollToEnd() }
    }
  } );
  Homey.get('maxLogLength', function(err, maxLogLength) {
    var set = false;
    if (err) {
      console.error(err)
    } else {
      if (maxLogLength === undefined) {
        maxLogLength = 1024;
        set = true
      }
     document.getElementById('maxLogLength').value = maxLogLength;
      if (set) { saveMaxLogLength() }
    }
  } );

// timeStampformat
  Homey.get('timeStampFormat', function(err, timeStampFormat) {
    var set = false;
    if (err) {
      console.error(err)
    } else {
      if (timeStampFormat === null) {
        set = true
        var timeStampFormat = "Sec" ;
      }
      console.log( timeStampFormat );
      document.getElementById('timeStampFormat').value = timeStampFormat;
    if (set) { saveTimeStampFormat() }
    }
  } );
  document.getElementById('intervalS').value = intervalS ;

  Homey.get('intervalS', function(err, intervalS) {
    var set = false;
    if (err) {
      console.error(err)
    } else {
      if (intervalS === undefined) {
        var intervalS = 5 ;
        set = true
      }
      console.log( intervalS );
      document.getElementById('intervalS').value = intervalS;
    if (set) { saveIntervalS() }
    }
  } );
  document.getElementById('intervalS').value = intervalS ;

  interval = setInterval( function(){ show_log() } , intervalS * 1000);
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
function updateIntervalS() {
  clearInterval(interval);
  intervalS = document.getElementById('intervalS').value;
  Homey.set('intervalS', intervalS );
  interval = setInterval( function(){ show_log() }, intervalS * 1000);
};

function updateTimeStampformat() {
  timeStampformat = document.getElementById('timeStampformat').value;
  Homey.set('timeStampformat', timeStampformat );
};

// updateMaxLogLength
function saveScrollToEnd() {
  Homey.set('scrollToEnd',document.getElementById('scrollToEnd').value );
};

// saveTimeStampformat
function saveTimeStampFormat() {
  Homey.set('timeStampFormat',document.getElementById('timeStampFormat').value );
};

function saveIntervalS() {
  Homey.set('intervalS',document.getElementById('intervalS').value );
};

function saveMaxLogLength() {
  Homey.set('maxLogLength',document.getElementById('maxLogLength').value );
};

function saveAppendLog(){
    Homey.set('appendLog',document.getElementById('appendLog').checked );
};

function clear_simpleLOG(){
    Homey.set('myLog', '-=-=- Log Cleared from Settings page -=-=-');
};

function download_PaperTrails(){
    var date = new Date();
    date.yyyymmddHHMMss();
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
        if( err ) return console.error('Could not get log', err);
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
}

This app creates a text log

This app makes it possible to add time based logging to your flow's and send logs to a standard SysLog server.

Use it for example  with the Email sender to send plain text logs.
( https://homey.app/a/email.sender/ )

_// Trigger Logging to PaperTrails from HomeyScript_
_let HomeyScript = await Homey.apps.getApp({ id: 'nu.dijker.papertrails' } );_
_HomeyScript.apiPost('log', { log:'Hello  World  of HomeyScript!'} );_


NL
Deze app maakt een logboek aan

DE
Diese App erstellt ein Logbuch

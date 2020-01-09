Diese App erstellt ein Logbuch

***Google Translate
Diese App ermöglicht es, zeitbasierte Protokollierung zu Ihren Flows hinzuzufügen und Protokolle an einen Standard SysLog-Server zu senden.

Verwenden Sie es zum Beispiel mit dem E-Mail-Absender, um Klartextprotokolle zu senden.
( https://homey.app/a/email.sender/ )

_// Trigger Logging naar PaperTrails vanuit HomeyScript_
_let HomeyScript = await Homey.apps.getApp({ id: 'nu.dijker.papertrails' } );_
_HomeyScript.apiPost('log', { log:'Hello  World  of HomeyScript!'} );_

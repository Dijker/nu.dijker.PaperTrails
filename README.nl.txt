Deze app maakt een logboek aan

Deze app maakt het mogelijk om tijdgebaseerde logging toe te voegen aan flows en logs naar een standaard SysLog-server te sturen.

Gebruik het bijvoorbeeld met de email-zender om logbestanden met gewone tekst te verzenden.
( https://homey.app/a/email.sender/ )

_// Trigger Logging naar PaperTrails vanuit HomeyScript_
_let HomeyScript = await Homey.apps.getApp({ id: 'nu.dijker.papertrails' } );_
_HomeyScript.apiPost('log', { log:'Hello  World  of HomeyScript!'} );_

# PaperTrails - Advanced Logging and Log management.

This app makes it possible to add time based logging to your flow's.

Use it fe with the updated Email.sender v0.1.6 to send plain text logs.
( https://apps.athom.com/app/email.sender )

_// Trigger Logging to PaperTrails from HomeyScript_

_let HomeyScript = await Homey.apps.getApp({ id: 'nu.dijker.papertrails' } );_

_HomeyScript.apiPost('log', { log:'Hello  World  of HomeyScript!'} );_

## Version 0.4.1 (Alpha)
* Added option to send to syslog.

## Version 0.3.7
* Added Magic! Adding & Removing Logging to All Flows with a PreFix.
* Migrating Flows from Simple Log
* Added api /log to Log something from fe HomeyScript
* Converted Settings to two Objects & some Cleanup
* Fixed "Report an issue" Link to Own GitHub
* Magnetic Snap on Scroll to end

## Version 0.2.3
* Confirm msg on delete from Settings
* Choose between time format
** Normal Seconds
** Precise milliseconds
** Geek format Zulu Time

## Version 0.2.1 beta
* Updated for SDK2
* Again re-designed Settings page, now for Mobile
* Logging time with milliseconds
* Added Condition logging:
* C: Add to the Log (Condition is always True)

## Version 0.1.8
* re-designed Settings page
* Added Actions with corresponding triggers:
* A: Clear the Log - T: The log is Cleared
* A: Trigger a Flow - T: This Flow is Tiggered
* A: Remove oldest % of Log / A: Remove log older than # Hours - T: The log is Truncated
* T: PaperTrails at Max. configured Lines
* T: PaperTrails greater than ## Lines

## older verions
* Fixed errors, typo's, contributors and donation button.
* Configurable max. number of loglines
* Added Timestamping Logs in the form of YYYY-MM-DD HH:MM.ss [LogText]

## Features

For more information and examples go to the forum
( https://forum.athom.com/discussion/3473/ ) and create Issues (bug reports, feature requests) on Github ( https://github.com/Dijker/nu.dijker.PaperTrails/issues )  

If you like my work, Buy me a beer!

##Version History:
  Online Version History https://github.com/Dijker/nu.dijker.PaperTrails/wiki/Release-Notes

## To Do
* i18n
* any suggestions?

## Licensing
PaperTrails is free for non-commercial use only. If you wish to use the app in a company or commercially, you must purchase a site-license by contacting the Author.

<font color="#009900" face="Webdings" size="4">P</font><font
  color="#009900" face="verdana,arial,helvetica" size="2"> <strong>Please
consider the environment before printing your virtual Papertrails</strong></font>

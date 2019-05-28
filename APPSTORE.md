# PaperTrails - Advanced Logging and Log management.

This app makes it possible to add time based logging to your flow's and send logs to a standard SysLog server.


Use it for example  with the Email sender to send plain text logs.
( https://apps.athom.com/app/email.sender )

_// Trigger Logging to PaperTrails from HomeyScript_

_let HomeyScript = await Homey.apps.getApp({ id: 'nu.dijker.papertrails' } );_

_HomeyScript.apiPost('log', { log:'Hello  World  of HomeyScript!'} );_

## Version 0.6.0
* German translation by PhilSniff
* several updates to Fix on Homey firmware v2.0
* Removed option to import Z-wave logs
* Hide Download Button on Mobile Interface (pls Go to Developers site)
* Temporary hide Maintenance panel (as it doesn't work in 2.0)

## Version 0.5.0 and before
* add Filter option on Log viewer
* cleanup some code
* Remove option to choose not to append!
* Enter only one 0 to ignore or stop logging (after adding Logging to all flows).
* fixed someting with the Z-Wave import.
* Changed separator between time and log to <Tab>
* Added an App name, Prefix first word with $ to have a App Name
    Time - AppName - Message
* Added option to send to syslog.
* Added Magic! Adding & Removing Logging to All Flows with a PreFix.
* Migrating Flows from Simple Log
* Added api/log to Log something from fe HomeyScript
* Converted Settings to two Objects & some Cleanup
* Fixed "Report an issue" Link to Own GitHub
* Magnetic Snap on Scroll to end
* Choose between time format
** Normal Seconds
** Precise milliseconds
** Geek format Zulu Time
* Updated for SDK2
* Again re-designed Settings page, now for Mobile
* Logging time with milliseconds
* Configurable max. number of loglines
* Added Timestamping Logs in the form of YYYY-MM-DD HH:MM.ss [LogText]

* Added Condition logging:
* C: Add to the Log (Condition is always True)

* Added Actions with corresponding triggers:
* A: Clear the Log - T: The log is Cleared
* A: Trigger a Flow - T: This Flow is Tiggered
* A: Remove oldest % of Log / A: Remove log older than # Hours - T: The log is Truncated
* T: PaperTrails at Max. configured Lines
* T: PaperTrails greater than ## Lines


## Features

For more information and examples go to the [PaperTrails topic on the Athom Forum] (https://community.athom.com/t/40) and create Issues (bug reports, feature requests) on Github ( https://github.com/Dijker/nu.dijker.PaperTrails/issues )  

If you like my work, Buy me a beer!

##Version History:
  Online Version History https://github.com/Dijker/nu.dijker.PaperTrails/wiki/Release-Notes

## To Do
* Finish i18n and translations
* any suggestions?

## Licensing
PaperTrails is free for non-commercial use only. If you wish to use the app in a company or commercially, you must purchase a site-license by contacting the Author.

<font color="#009900" face="Webdings" size="4">P</font><font
  color="#009900" face="verdana,arial,helvetica" size="2"> <strong>Please
consider the environment before printing your virtual Papertrails</strong></font>

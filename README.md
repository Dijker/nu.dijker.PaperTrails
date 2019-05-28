# PaperTrails - Advanced Logging and Log management.

This app makes it possible to add time based logging to your flow's.
For details see the APPSTORE.md or Athom App Store https://apps.athom.com/app/nu.dijker.papertrails

## Version 0.6.0
* several updates to Fix on Homey firmware v2.0
* Removed option to import Z-wave logs
* Hide Download Button on Mobile Interface (pls Go to Developers site)
* Temporary hide Maintenance panel (as it doesn't work in 2.0)

## Version 0.5.0
* add Filter option on Log viewer

## Version 0.4.5 (Alpha)
* cleanup some code
* Remove option to choose not to append!

## Version 0.4.4 (Alpha)
* Enter only one 0 to ignore or stop logging (after adding Logging to all flows).
* fixed someting with the Z-Wave import.
* Changed separator between time and log to <Tab>
* Added an App name, Prefix first word with $ to have a App Name
    Time - AppName - Message

## Version 0.4.3 (Alpha)
* Added option to send to syslog.
* Added option to Import Z-Wave Log.
** Warning **
Only use Import Z-Wave Log on Append Logging (Top-Down) and with Geek- Zulu Time.
Will continue working on that after ... When I have enough time ..... (sorry)

## Version 0.3.7
* Added Magic! Adding & Removing Logging to All Flows with a PreFix.
* Migrating Flows from Simple Log
* Added api /log to Log something from fe HomeyScript
* Converted Settings to one Object & some Cleanup
* Temp removed ,"bugs": { "url": "https://github.com/Dijker/nu.dijker.PaperTrails/issues" },
* Magnetic Snap on Scroll to end

## Version 0.2.3
* Confirm msg on delete from Settings
* Choose between time format

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

## Version 0.1.3
* Fixed errors, typo's, contributors and donation button.

## Version 0.1.1
* Enable Save settings Refresh interval
* Configurable max. number of loglines
* Added Trigger the Trigger for processing/sending Logs
* Added configurable Refresh interval (Sec.)
* Added Timestamping Logs in the form of YYYY-MM-DD HH:MM.ss [LogText]

## Features
* Logging with Timestamp
* Logging without Timestamp
* Maximize the Log length (lines)

Feedback:
Any requests please post them in the [PaperTrails topic on the Athom Forum] (https://forum.athom.com/discussion/3473/)

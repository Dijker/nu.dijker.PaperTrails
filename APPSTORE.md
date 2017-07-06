# PaperTrails - Advanced Logging and Log management.

This app makes it possible to add time based logging to your flow's.

You may leave me a donation if you love my work.
****

## Version 0.1.2
* Fixed errors, typo's, contributors and donation button.

## Version 0.1.1
* Enable Save settings Refresh interval
* Configurable max. number of loglines
* Added Trigger the Trigger for processing/sending Logs
* Added configurable Refresh interval (Sec.)
* Added Timestamping Logs in the form of YYYY-MM-DD HH:MM.ss [LogText]

## Features

For more information and examples go to the forum (*Link to be inserted*) and create Issues (bug reports, feature requests) on Github ( https://github.com/Dijker/nu.dijker.PaperTrails/issues )  

If you like my work, Buy me a beer!
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
">
<input type="image" src="https://www.paypalobjects.com/nl_NL/NL/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal, de veilige en complete manier van online betalen.">
<img alt="" border="0" src="https://www.paypalobjects.com/nl_NL/i/scr/pixel.gif" width="1" height="1">
</form>


##Version History:
* 0.1.2 (20170707)
  Various fixes

* Previous Updates


  Online Version History https://github.com/Dijker/nu.dijker.PaperTrails/wiki/Release-Notes

## To Do
* i18n
* any suggestions?

## Licensing
PaperTrails is free for non-commercial use only. If you wish to use the app in a company or commercially, you must purchase a site-license by contacting the Author.

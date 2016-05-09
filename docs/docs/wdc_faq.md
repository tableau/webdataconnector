---
layout: page
title: WDC Frequently Asked Questions
base: docs
---

This is a collection of common questions and resoultions for the web data connector platform.


#### Are there any known bugs?

Check our [issues page](https://github.com/tableau/webdataconnector/issues) on GitHub! It will contain any known bugs.  Feel free to open new bugs there as well.

#### Why are my global variables losing their values? 

The different [phases of the web data connector]({{ site.baseurl }}docs/wdc_phases.html) run in two seperate 
instances of a web browser.  Therefore the only data that will be stored between these phases is the data
stored in the tableau object.  Please use [tableau.connectionData]({{ site.baseurl }}ref/api_ref#webdataconnectorapi.tableau.connectiondata) for this purpose.

#### Why are none of the WDC methods (init, getSchema, etc.) being called? 

The web data connector methods will only be called if your connector is being run from the simulator
or from Tableau.  If you try and run your web data connector in a regular browser window, nothing of these methods will execute. 

#### Why are my extract refreshes failing on Tableau Server because they are untrusted?

In order for WDC extract refreshes to succeed on Tableau Server, your server admin must configure your 
server using tadadmin, as explained in the [Server Documentation](http://onlinehelp.tableau.com/v0.0/server/en-us/help.htm#datasource_wdc.htm?). 

#### Can I refresh WDCs on Tableau Online?

Currently, there is no way to directly refresh WDCs published to Online due to security risks.  
The suggested alternative is to use the [Tableau Online Sync Client](https://onlinehelp.tableau.com/current/online/en-us/to_sync_local_data.htm).

#### I don't see any checkboxes or radio buttons in my connector UI in Tableau!

This was a bug that was fixed.  Please upgrade to the latest maintence patch to fix this issue.

#### What browser does Tableau Desktop use? 

Tableau Desktop uses the QtWebKit browser from QT version 5.4.  This browser does not have all
the latest capabilities that many other browsers have so you may experiences some differences between 
your connector in Tableau and your connector when running in the simulator.

#### Where can I find the logs from my web data connector when it runs within Tableau Desktop? 

The default location for Tableau logs is at  /Users/<username>/Documents/My Tableau Repository.  Within that folder, the file log.txt will contain any WDC logs that occur during the Interactive phase.  tabprotosrv.txt will contain any logs that occur during the data gathering phase. 
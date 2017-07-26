---
title: Frequently Asked Questions
layout: docs
---

* TOC
{:toc}

### Where can I find known issues?

You can view open issues, and submit new issues, on our [Github issues
page](https://github.com/tableau/webdataconnector/issues).

### Can I still use version 1.0 of the WDC API? Where can I find information about version 1.0 of the WDC?

If you are creating a new connector for Tableau 10.0 or later, you should use version 2 of the WDC API. However,
version 1.0 of the WDC API will continue to work in Tableau 10.0. Additionally, Tableau 9.3 and earlier only support
version 1.0 of the WDC API.

For information about version 1.0 of the WDC, see the archived <a href="http://onlinehelp.tableau.com/v9.3/api/wdc/en-us/help.htm" style="text-decoration:underline;">documentation</a>
and <a href="https://github.com/tableau/webdataconnector/releases/tag/v1.1.0" style="text-decoration:underline;">simulator</a>.

### Can I contact Tableau for help with my connector?

Tableau does not provide support for connectors or for other programs written to interface with the WDC API. However,
you can submit questions and ask for help on the [Tableau developer community
forums](https://community.tableau.com/community/developers/content).

Tableau *does* provide support for the WDC library and SDK though. If you find an issue with the WDC library, the simulator,
or any of the developer samples, [submit an issue on Github](https://github.com/tableau/webdataconnector/issues).

### The global variables in my connector display as undefined. What's happening?

The WDC API runs connectors in multiple phases, and each phase runs in a separate instances of a web browser. To pass
data between phases, use the `tableau.connectionData` variable created by the API for this purpose. For more
information, see the documentation for the [phases of the web data connector]({{ site.baseurl }}/docs/wdc_phases.html).

### Why are my extract refreshes failing on Tableau Server?

To run extract refreshes for connectors, you need to configure Tableau Server and import the connector. Contact your
server administrator and see the [Tableau Server documentation on web data
connectors](http://onlinehelp.tableau.com/v0.0/server/en-us/help.htm#datasource_wdc.htm).

### Can I refresh extracts for connectors on Tableau Online?

Because running custom code for a connector represents a security risk, there is currently no way to refresh extracts
for connectors published to Tableau Online. As an alternative, you can use the [Tableau Online Sync
Client](https://onlinehelp.tableau.com/current/online/en-us/to_sync_local_data.htm) to schedule extract refreshes on a
desktop computer.

### Where are the check boxes and radio buttons that I put in my connector page? I see them in the simulator, but not in Tableau.

This was an issue in a previous version of the WDC. To fix the issue, get the latest version of the WDC from the [WDC
Versions]({{ site.baseurl }}/docs/wdc_library_versions) page.

### I'm seeing differences between what I see in the simulator and what I see in Tableau. What's going on?

Tableau Desktop embeds the Qt Webkit browser into the product to display your connector pages. This browser might lack
some of the features of modern browsers, including specific HTML5 and other features. For more information on browser
support, see the features in [Qt 5.4](https://wiki.qt.io/New_Features_in_Qt_5.4), which is the version used by Tableau.
You may also want to see the Qt Webkit page on [HTML5 support](https://wiki.qt.io/Qt_Webkit_HTML5_Score).

### Where can I find the Tableau Desktop logs to troubleshoot my connector?

By default, the Tableau Desktop log files are stored in the following location:

```
Users/<username>/Documents/My Tableau Repository
```

The `log.txt` file contains information for the interactive phase of your connector. The `tabprotosrv.txt` file contains
logs for the data gathering phase.  The Tableau Log Viewer is an open source tool that makes it easier to read Tableau logs: [https://github.com/tableau/tableau-log-viewer](https://github.com/tableau/tableau-log-viewer).

### Why aren't my connector methods being called?

The methods in your connector code are run by the WDC API. Ensure that you are running the connector in the simulator or
Tableau. You might also want to ensure that the `tableau.submit` function is being called either by user input or by a
page load event.

### Can I get the links in my WDC in Tableau to open in an external browser?

Why yes, yes you can! Just add the
`target="_blank"` property to the anchor element in your web page and it will open in the user's default browser instead
of opening in Tableau. For example, you might enter the following link:

```
html <a href="http://tabsoft.co/wdc" target="_blank">Hello Docs!</a>
```

### What parts of the WDC SDK can I contribute to?

We will happily take contributions to anything in the WDC SDK aside
from the core library (i.e.  tableauwdc-*version*.js).  This includes the simulator, documentation, and samples.  We
cannot take contributions to the library file because that file represents a bridge between a WDC and proprietary
Tableau platform code.  For more info on open source at Tableau, visit
[http://tableau.github.io/](http://tableau.github.io/).


---
layout: page
title: Overview - How does a WDC Work?
base: docs 
---

A web data connector consists of an HTML page that includes JavaScript
code. In the page you write JavaScript code to fetch the data that you
want to use. For example, the code might use a REST API to call a web
service, or it might read a web page or XML feed and extract the
information. After your code has fetched the data, it converts the data
into an array (either an array of values or an array of JavaScript
objects). When Tableau uses your connector, Tableau invokes the function
you wrote and then gets the data that your connector has fetched.

To use a web data connector, users follow the normal flow in Tableau to
connect to data, and they select the <span class="uicontrol">Web Data
Connector</span> option:

![]({{ site.baseurl }}assets/wdc_desktop_select_wdc_as_connector.png)

Tableau prompts them to enter the URL of the connector they want to use:

![]({{ site.baseurl }}assets/wdc_desktop_enter_url.png)

Users enter the web data connector URL in the big text box.

Tableau loads the page. If the page requires user input, the connector
can render UI that lets users enter values that the connector needs in
order to fetch data:

![]({{ site.baseurl }}assets/wdc_desktop_wdc_ui.png)

After users are done entering information (in this example, the user
clicks the <span class="uicontrol">Get Stock Data</span> button),
Tableau calls the code in your web data connector. Your code fetches the
data and returns it to Tableau, which makes an extract from the data.

See also
--------

[What Happens at Run Time (Phases of a Web Data
Connector)](wdc_phases.html)

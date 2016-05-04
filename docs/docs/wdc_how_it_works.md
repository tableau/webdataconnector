---
layout: page
title: Overview - How does a WDC Work?
base: docs 
---

A web data connector consists of an HTML page that includes JavaScript
code. In the page you write JavaScript code to fetch the data that you
want to use. For example, web data connector might utilize a REST API to
gather data from a cloud application, or it might scrape a web page or XML feed
and extract the information. After your code has fetched the data, it 
passes that data back into Tableau.  Tableau uses this data to create
a Tableau Extract, and the the user of the web data connector can begin
visually exploring this data within Tableau.

To use a web data connector, users follow the normal flow in Tableau to
connect to data, and they select the <span class="uicontrol">Web Data
Connector</span> option:

![]({{ site.baseurl }}assets/wdc_desktop_select_wdc_as_connector.png)

Tableau prompts them to enter the URL of the connector they want to use.

**Important**: The URL that should be entered here is the URL of the 
web data connector, not the data source that the connector connects to.
For example, if a user was trying to use a facebook web data connector, they would
enter the url of the connector (www.xyz.com/myFacebookConnector.html), rather than
the URL where the data comes from (i.e. www.facebook.com).

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
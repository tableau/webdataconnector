---
layout: page
title: Simulator and Samples
base: docs
---

To help you develop and test your connectors, you can use the
simulator that is included with the WDC SDK. The simulator 
runs in a browser and loads your web data connector page the same way
that Tableau does.

Use the simulator to debug connectors during development. While you use 
the simulator, you can use a JavaScript debugger to set breakpoints,
view console logs in real time, and view network requests.
This can be helpful to verify the data that you are getting from the
underlying data source before you pass the data on to Tableau.

Before you can use the simulator, you need to run a test web server.
(It cannot be opened as a local HTML file.) To run the simulator, 
complete the steps in the [Get Started]({{ site.baseurl }}/docs) section.

*   [Debugging with the simulator](#debugging)

*   [Developer Samples](#samples)

*   [Simulator tips](#simulator-tips)

!["The simulator user interface."]({{ site.baseurl }}/assets/wdc_simulator_new_first_open.png){:width="650px"}


 
Debugging with the simulator {#debugging}
----------------------------

An advantage of using the simulator is that you can use the browser
debugging tools to help you find and fix errors in your web
data connector. Some useful techniques for debugging in the simulator
include the following:

-   Open the developer tools console for the browser.

    For example, in Google Chrome press Ctrl+Shift+I on Windows or
    Command+Option+I on the Mac to open the tools pane, and then select
    the <span class="uicontrol">Console</span> tab. In this console,
    you can see all the results of various console.log statements.  The console also displays
    output from the [tableau.log]({{ site.baseurl }}/ref/api_ref#webdataconnectorapi.tableau.log) and
    [tableau.abortWithError]({{ site.baseurl }}/ref/api_ref#webdataconnectorapi.tableau.abortwitherror) functions.
    
    This is a good place to check for errors in case anything goes wrong.
    The console will display information about run-time errors
    (unhandled exceptions) that occur while your code is running. If an error
    occurs, the JavaScript engine in the browser throws an error and the error message is displayed in
    the console.
    
-   Use a debugger to step through your code.

    Most browsers include a debugger as part of their developer tools.
    You can set breakpoints in your code in the debugger or include
    JavaScript `debugger` statements. When the web data connector runs
    and the browser's developer tools are open, code execution stops at
    breakpoints or `debugger` statements and you can examine variables.
    For an overview of debugging tools, see [JavaScript
    Debugging](http://www.w3schools.com/js/js_debugging.asp) on the
    W3CSchools.com site.


Developer Samples {#samples}
----------------------------

The Web Data Connector SDK includes sample connectors that you can use to learn about connector functionality.
The samples are in the `Examples` folder of the `webdataconnector` repository. You can see the repository 
online [here](https://github.com/tableau/webdataconnector/tree/dev/). The goal of each sample is to focus on
one specific feature of the WDC API. 

The SDK includes the following samples:

-   **earthquakeUSGS**

    This is the connector that you build in the [Tutorial]({{ site.baseurl }}/docs/wdc_tutorial.html). It connects to the USGS Earthquake feed and gets data about earthquakes in the last week.

-   **StockQuoteConnector_basic**

    This is the default connector when you open the simulator. It is another basic sample that gets stock quote data from Yahoo Finance.

-   **StockQuoteConnector_promises**

    This connector builds on the previous one to showcase how to use JavaScript
    promises to make several API requests and union the data.

-   **JSONMultiTableConnector**

    This connector describes how to create a schema with multiple tables and then get the data. The tables can be joined 
    by users in Tableau. 

-   **IncrementalRefreshConnector**

    This connector showcases how use the incremental refresh API to fetch data incrementally. 

-   **MadMoneyScraper**

    This connector demonstrates how to scrape data from a table in a web page and bring that data back through
    the WDC API.

-   **OAuthProxyExample**

    This example will show you how to utilize a node proxy server in order to securely implement
    a web data connector that uses OAuth as an authorization mechanism.

Simulator tips
---------------

* Be default, the test web server runs on port 8000. To change the port number, edit the `start` script in the `package.json` file.
  For example, you might enter the following to change the port to 8888:

  ```
  "start": "node node_modules/http-server/bin/http-server -p 8000"
  ```

* To make it easier to load files into the simulator, keep
  the simulator and web data connector .html files that you are
  testing in the same folder.

 

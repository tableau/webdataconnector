---
layout: page
title: Simulator and Samples
base: docs
---

To help you develop and test your web data connectors, you can use the
simulator that is included with the Web Data Connector SDK. In the simulator, you
can load your web data connector page and interact with it the same way
that Tableau does.

The simulator exists to help you debug web data connectors during development.
Since it runs in your favorite web browser, you can use the browser's built-in
development tools.  While you use the simulator, you can use a JavaScript debugger to set breakpoints,
view console logs in real time, and view network requests.
This can be helpful to verify the data that you are getting from the
underlying data source before you pass the data on to Tableau.

-   [Using the simulator](#using_simulator)

-   [Debugging with the simulator](#debugging)

-   [Developer Samples](#samples)


Using the simulator {#using_simulator}
-------------------

To use the simulator, follow these steps: 

1. Verify you have the python server up and running
as described in the [Get Started]({{ site.baseurl }}docs) section.

2. Open a web browser and navigate to the location of the simulator; by default this is:

   `http://localhost:8888/path/simulator/`

   **Tip**: To make it easier to load files into the simulator, keep
   the simulator and web data connector .html files that you are
   testing in the same folder.

   The simulator opens. By default, the <span
   class="uicontrol">WDC URL</span> box is preloaded with the path to
   the StockQuoteConnector sample that's in the Examples folder. To work
   with a different web data connector, enter the URL of
   that connector.

   <img class="img-responsive docs-img" src="{{ site.baseurl }}assets/wdc_simulator_new_first_open.png" alt="">

3. Enter the URL of the web data connector you would like to connect to. 
   By default this is one of our simple development samples.
   
   **Note**: The simulator requires you to
   be using the version 1.1.1 or later of the Tableau WDC
   JavaScript library. For more information, see [Web Data Connector
   Library Versions]({{ site.baseurl }}docs/wdc_library_versions.html).

4. Click on the 'Start Interactive Phase' which will 
   present UI to users in order to prompt for values that the
   connector needs.  When you click the button, the simulator loads the web data
   connector into a new window and runs the connector's
   interactive phase.
   
   Not all connectors require will present a UI in
   the interactive phase, some will bypass this phase automatically.
   See [The Phases of a WDC]({{ site.baseurl }}docs/wdc_phases.html) for more details.
   
   <img class="img-responsive docs-img" src="{{ site.baseurl }}assets/wdc_simulator_interactive_phase.png" alt="">
   
   Enter any information that you're prompted for, and then submit
   the page. When you do, the simulator closes the interactive window.
   On the right-hand side, the simulator displays property values
   (if any) for tableau object properties.

5. The simulator will now begin the connector's data gathering phase.
   The simulator will call the connector's
   [getSchema]({{ site.baseurl }}ref/api_ref#webdataconnectorapi.webdataconnector.getschema) method 
   which will return information about all schema of each table that the connector returns.
   
   <img class="img-responsive docs-img" src="{{ site.baseurl }}assets/wdc_simulator_getschema.png" alt="">

   
6. In order to get data from the connector, click on the "Fetch Table Data" button
   below the metadata table.  The simulator will then call the 
   [getData]({{ site.baseurl }}ref/api_ref#webdataconnectorapi.webdataconnector.getdata) method of the
   connector for that table.  The results of this call will be displayed in the simulator.

   <img class="img-responsive docs-img" src="{{ site.baseurl }}assets/wdc_simulator_getdata.png" alt="">

   The simulator will return the metadata for any table defined by the connector 
   in getSchema.  To mirror Tableau, the simulator supports fetching data
   for each of these tables independently.

   **Tip**: Fetching data can be done automatically by checking the 
   "Automatically fetch data for all tables" checkbox. This will automatically run
   the gather data phase after the interactive phase has been submitted and fetch
   data for every table defined by the connector.
   
Debugging with the simulator {#debugging}
----------------------------

An advantage of using the simulator is that you can use web page and
JavaScript debugging tools to help you find and fix errors in your web
data connector. Some useful techniques for debugging in the simulator
include the following:

-   Open the developer tools console for the browser.

    For example, in Google Chrome press Ctrl+Shift+I on Windows or
    Command+Option+I on the Mac to open the tools pane, and then select
    the <span class="uicontrol">Console</span> tab. In this console,
    you can see all the results of various console.log statements.  The console also displays
    output from the [tableau.log]({{ site.baseurl }}ref/api_ref#webdataconnectorapi.tableau.log) and
    [tableau.abortWithError]({{ site.baseurl }}ref/api_ref#webdataconnectorapi.tableau.abortwitherror) functions.
    
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

The Web Data Connector SDK includes sample connectors that illustrate
various additional ways to get content using a web data connector. The
samples are in the Examples folder of the location where you extracted
the Web Data Connector SDK. The goal of each sample is to focus on
one specific feature of the WDC API.  These samples are intended to teach, 
and would not likely be used in production. 

The samples in the SDK are as follows:

-   [StockQuoteConnector_basic](https://github.com/tableau/webdataconnector/blob/gh-pages/Examples/StockQuoteConnector_basic.html)

    This connector is the most basic connector in the SDK.
    The [Quick Start tutorial]({{ site.baseurl }}docs/wdc_tutorial.html) provides a step-by-step guide to building this connector.
    Start here if you want to leran the basics of the WDC API.

-   [StockQuoteConnector_promises](https://github.com/tableau/webdataconnector/blob/gh-pages/Examples/StockQuoteConnector_promises.html)

    This connector builds on the previous to showcase how to use JavaScript
    promises to make several API requests and union the data.

-   [JSONMultiTableConnector](https://github.com/tableau/webdataconnector/blob/gh-pages/Examples/JSONMultiTableConnector.html)

    This connector details how to fetch multiple tables of different
    schemas.  These tables will be joinable by the end user from within Tableau.

-   [IncrementalRefreshConnector](https://github.com/tableau/webdataconnector/blob/gh-pages/Examples/IncrementalRefreshConnector.html)

    This connector showcases how use the incremental refresh API to fetch data incrementally. 

-   [MadMoneyScraper](https://github.com/tableau/webdataconnector/blob/gh-pages/Examples/MadMoneyScraper.html)

    This connector demonstrates how to scrape data from a table in a web page and bring that data back through
    the WDC API.

-   [OAuthProxyExample](https://github.com/tableau/webdataconnector/blob/gh-pages/Examples/OAuthProxyExample/index.html)

    This example will show you how to utilize a node proxy server in order to securely implement
    a web data connector that uses OAuth as an authorization mechanism.

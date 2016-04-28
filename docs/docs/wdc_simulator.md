---
layout: page
title: Web Data Connector Simulator
base: docs
---

To help you develop and test your web data connectors, you can use the
simulator that is included with the Web Data Connector SDK. The
simulator is an HTML page--`Simulator.html` in the root of the folder
where you extracted the Web Data Connector SDK. In the simulator, you
can load your web data connector page and interact with it the same way
that Tableau does.

The simulator helps you debug web data connectors because it allows you
to run connectors in your browser and use the browser's built-in
development tools. In contrast, when the connector is running on
Tableau, Tableau might not expose script errors in the data connector
code. While you use the simulator, you can use a JavaScript debugger.
This can be helpful to verify the data that you are getting from the
underlying data source before you pass the data on to Tableau.

-   [Using the simulator](#using_simulator)

-   [Debugging with the simulator](#debugging)

-   [Developer Samples](#samples)


Using the simulator {#using_simulator}
-------------------

To use the simulator, you need a web server running on your computer. If
you're working on a computer that doesn't already have a web server
running, you can run a lightweight server such as the Python development
server or a Mongoose server.

To start the simulator, follow these steps:

1.  Make sure that a web server is running on your computer and that it
    can serve pages from the folder where you extracted the Web Data
    Connector SDK.

    For more information about how to run the Python server, see [Use
    the Python Development Server for Web Data
    Connectors](wdc_sdk_using_python_server.html). If you're
    using the Python server, start the server in the folder where the
    web data connector files are that you want to test. (If you start
    the server using the `.bat` file that's included with the SDK, the
    Python server starts in the SDK folder.)

2.  Open a browser and enter the following URL, where <span
    class="api-placeholder">path</span> is the path on your computer
    where you have the SDK:

    `http://localhost:8888/path/simulator/`

    **Tip**: To make it easier to load files into the simulator, keep
    the simulator and web data connector .html files that you are
    testing in the same folder.

    The simulator opens. By default, the <span
    class="uicontrol">WDC URL</span> box is preloaded with the path to
    the StockConnector sample that's in the Examples folder. To work
    with a different web data connector, enter the URL of
    that connector.

    ![]({{ site.baseurl }}assets/wdc_simulator_new_first_open.png)

    **Note**: The most current version of the simulator requires you to
    be using the `tableauwdc-1.1.1.js` version of the Tableau WDC
    JavaScript library. For more information, see [Web Data Connector
    Library Versions](wdc-library-versions.html).

3.  If the connector has a UI phase (the phase in which the connector
    presents UI to users in order to prompt for values that the
    connector needs), click the <span class="uicontrol">Run Interactive
    Phase</span> button. Not all connectors require an
    interactive phase. If the connector doesn't have UI, you don't need
    to click this button.

    When you click the button, the simulator loads the web data
    connector into a new window and runs the connector's
    interactive phase.

4.  Enter any information that you're prompted for, and then submit
    the page. When you do, the simulator closes the interactive window.
    On the right-hand side, the simulator displays property values
    (if any) for <span class="api-command-ref">tableau</span>
    object properties.

    The simulator also runs the connector's data-gathering phase. The
    simulator calls the
    [getColumnHeaders](wdc_ref.html#connector_getColumnHeaders) and
    [getTableData](wdc_ref.html#connector_getTableData) functions and
    displays the results in the lower part of the page.

    ![]({{ site.baseurl }}assets/wdc_simulator_new_data_display.png)

Debugging with the simulator {#debugging}
----------------------------

An advantage of using the simulator is that you can use web page and
JavaScript debugging tools to help you find and fix errors in your web
data connector. Some useful techniques for debugging in the simulator
include the following:

-   Use a debugger to step through your code.

    Most browsers include a debugger as part of their developer tools.
    You can set breakpoints in your code in the debugger or include
    JavaScript `debugger` statements. When the web data connector runs
    and the browser's developer tools are open, code execution stops at
    breakpoints or `debugger` statements and you can examine variables.
    For an overview of debugging tools, see [JavaScript
    Debugging](http://www.w3schools.com/js/js_debugging.asp) on the
    W3CSchools.com site.

-   Include calls to [tableau.log](wdc_ref.html#tableau_functions_log) at
    points in your code where you want to view the state of variables or
    other values.

    The outputs of [tableau.log](wdc_ref.html#tableau_functions_log) is
    displayed in the console at the bottom of the simulator, but does
    not appear when the web data connector is used in Tableau.

-   Open the developer tools console for the browser.

    For example, in Google Chrome press Ctrl+Shift+I on Windows or
    Command+Option+I on the Mac to open the tools pane, and then select
    the <span class="uicontrol">Console</span> tab. The console displays
    output from the [tableau.log](wdc_ref.html#tableau_functions_log) and
    [tableau.abortWithError](wdc_ref.html#tableau_functions_abortWithError) functions.
    It also displays information about run-time errors
    (unhandled exceptions) that occur while your code is running. For
    example, if your code makes requests but the data site does not
    include [CORS headers](wdc_cors.html), the JavaScript engine in the
    browser throws an error and the error message is displayed in
    the console. For more information, search the web for "developer
    tools" for your browser.

Developer Samples {#samples}
----------------------------

The Web Data Connector SDK includes sample connectors that illustrate
various additional ways to get content using a web data connector. The
samples are in the Examples folder of the location where you extracted
the Web Data Connector SDK. The samples include the following:

-   Coming Soon

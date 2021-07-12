---
title: Debugging in the Simulator and Tableau
layout: docs
---

You can use the simulator included with the WDC SDK to develop and debug your connectors more quickly. The simulator
is a JavaScript application that loads connectors in a similar way to Tableau Desktop. Additionally, starting with Tableau Desktop 2019.4, you can use the [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools){:target="_blank"}{:ref="noopener"} and the Chromium debugger to debug issues that appear in Tableau Desktop, but not in the simulator. A WDC is a web page that runs in a Chromium-based browser inside of Tableau Desktop.
In versions of Tableau Desktop prior to 2019.4, you can use a built-in---although, not supported---debugger that you can use to debug WDC issues that appear in those versions of Tableau Desktop.

Use the simulator when you are developing your connector, to set breakpoints in the browser, view network requests, and
more. Use Tableau Desktop periodically during development to confirm that your connector works the same as in the
simulator, and then to perform your final testing.

This page includes information about developing and debugging your connectors both in the simulator and in Tableau.

* TOC
{:toc}

## Debugging in the simulator {#debugging-simulator}

To set up and run the simulator, follow the instructions in the [Get Started]({{ site.baseurl }}/docs) section.

When you run a connector in the simulator, only the `getSchema` and `getData` parts of your connector code
run in the simulator window.  The interactive phase and authentication phases run in a separate window. This means that
messages that you print with `console.log` will appear in different browser consoles.

To print messages from both windows to the console for the main simulator window, use `tableau.log`. For example, you
might enter the following in your code:

```js
tableau.log("My console message goes here!");
```

!["The simulator user interface."]({{ site.baseurl }}/assets/wdc_simulator_new_first_open.png)


### Simulator tips {#simulator-tips}

* By default, the test web server runs on port 8888. To change the port number, edit the `http-server` script in the
  `package.json` file.  For example, you might enter the following to change the port to 8000:

  ```
  "http-server": "export SERVER_PORT=8000 || set SERVER_PORT=8000 && node ./index.js"
  ```

* To make it easier to load files into the simulator, keep the simulator and web data connector `.html` files that you are
  testing in the same folder.

<div class="alert alert-info">

<p><b>Note: </b>Tableau 2019.4 (and later) embeds the Qt WebEngine browser into the product to display your connector pages. Qt WebEngine is a Chromium-based browser that provides support for HTML5 and other modern features, including the ability to use the Chromium and Chrome DevTools for debugging.</p>

<p>Tableau Desktop 2019.3 (and earlier) embeds the Qt Webkit browser. This browser might lack some of the features of modern browsers, including specific HTML5 features. For more information on browser support, <a href="http://doc.qt.io/qt-5/whatsnew57.html" target="_blank"> see the features in Qt 5.7</a>, which is the version used by Tableau (10.3 to 2019.3). You might also want to see the Qt Webkit documentation on HTML5 support and the <a href="https://wiki.qt.io/Qt_Webkit_HTML5_Score" target="_blank">Qt Webkit HTML5 Score
</a>.</p>

</div>


### Caching in the simulator {#simulator-caching}

If changes to your connector do not appear to take effect in the simulator, the browser might be caching a previous version of your
connector. Here are some ways to work around caching issues:

* In some browsers, you can press **Ctrl+Shift+R** or **Cmd+Shift+R** to clear the cache for the current page and reload
  it.

* Open the simulator in an incognito window which does not store cookies or cache pages. Note that the list of recent
  connectors will not be stored if cookies are disabled.

* In Google Chrome, you can disable caching while the developer tools are open.

  1. Open Chrome Developer Tools.

  1. Press **F1** to view the settings.

  1. On the **Preferences** tab, under **Network**, select the **Disable caching** option.

### General browser debugging tips {#browser-tips}


*   Open the developer tools console for the browser.

    For example, in Google Chrome press **Ctrl**+**Shift**+**I** on Windows or **Command**+**Option**+**I** on the Mac to open the tools pane,
    and then select the **Console** tab. In this console, you can see all the results of
    various console.log statements.  The console also displays output from the [tableau.log]({{ site.baseurl
    }}/docs/api_ref#webdataconnectorapi.tableau.log) and [tableau.abortWithError]({{ site.baseurl
    }}/docs/api_ref#webdataconnectorapi.tableau.abortwitherror) functions.

    This is a good place to check for errors in case anything goes wrong.  The console will display information about
    run-time errors (unhandled exceptions) that occur while your code is running. If an error occurs, the JavaScript
    engine in the browser throws an error and the error message is displayed in the console.

*   Use a debugger to step through your code.

    Most browsers include a debugger as part of their developer tools.  You can set breakpoints in your code in the
    debugger or include JavaScript `debugger` statements. When the web data connector runs and the browser's developer
    tools are open, code execution stops at breakpoints or `debugger` statements and you can examine variables.  For an
    overview of debugging tools, see [JavaScript Debugging](http://www.w3schools.com/js/js_debugging.asp) on the
    W3CSchools.com site.


---

## Debugging a WDC in Tableau Desktop 2019.4 (and later) {#debug-chrome}

Starting with Tableau 2019.4, you can use the Chromium browser and the [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools){:target="_blank"}{:ref="noopener"} to debug your WDC while it is running in Tableau Desktop. This means you can use the Chromium browser, instead of the unsupported "Beta" debugger that was built into Tableau Desktop.

### Download the Chromium Browser

To debug your WDC, you'll need to use a Chromium-based browser (Chromium is the open-source version of Chrome). In some cases you could use Chrome, but because of version incompatibilities in the debugging protocol, we recommend using specific builds of Chromium, which matches the version of the browser running inside Tableau. Just download and unzip the file and run `chrome.exe` (Windows) or `chromium` (macOS).

Tableau Desktop version  |  Chromium version  | Chrome version
|----|----|----|
Prior to 2019.4 | Not Available |  Not available
2019.4 and later | Chromium version 79 or earlier (for example, 79.0.3945.0)  | Chrome version 79 or earlier. 


**Chromium downloads for debugging Tableau 2019.1 and later**

* [Chromium for Windows (`chrome-win.zip`) (79.0.3945.0)](https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Win_x64/706915/)

* [Chromium for macOS (`chrome-mac.zip`) (79.0.3945.0)](https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Mac/706915/)


<div class="alert alert-info"><b>Note </b> If you are using Tableau 2019.1 or later, you can debug WDCs in Tableau Desktop using certain versions of Chrome (versions prior to 80). Currently, you can't use Chrome version 80 (or later) for debugging your WDC.</div>

### Start Tableau with remote debugging enabled (Windows)

1. Open a command prompt.

1. Navigate to the Tableau Desktop directory.
Replace `<version>` with the version of Tableau you are using (for example,`Tableau 2019.4`).

    ```
    cd C:\Program Files\Tableau\Tableau <version>\bin\
    ```

1. Start Tableau with the remote debugging option.

    ```
    tableau.exe --remote-debugging-port=9000
    ```

    This command enables remote debugging of your WDC for this session of Tableau.

    **Note:** The remote debugging port (for example, `9000`) must match the port address you use with the Chrome browser for debugging. This is *not* the HTTP port that you are using to host your WDC.

### Start Tableau with remote debugging enabled (macOS)

1. Open a Terminal window.

1. Start Tableau using the following command.
<br/> Replace `<version>` with the version of Tableau you are using (for example,`2019.4.app`).

    ```
    open /Applications/Tableau\ Desktop\ <version>.app --args --remote-debugging-port=9000

    ```

    This command enables remote debugging of your WDC for this session of Tableau.

    **Note:** The remote debugging port (for example, `9000`) must match the port address you use with Chrome for debugging. This is *not* the HTTP port that you are using to host your WDC.


### Debugging a WDC in Tableau Desktop using Chromium

After you enable debugging in Tableau, you can start debugging your WDC with the Chrome DevTools.

1. Connect to a web data connector. In Tableau, open a connection to the Web Data Connector. In the WDC dialog box, enter the URL of the WDC you want to debug, and press **Enter**. After your WDC landing page is loaded, you will want to wait before interacting with the page so you can start the Chrome debugger and set breakpoints.

1. Start Chrome and set the URL to [`http://localhost:9000`](http://localhost:9000)  
   This will bring up the page selector UI. The port (for example, `9000`) must match the port address you specified as the remote debugging port when you started Tableau.

  
1. In the Chrome Browser, select the WDC you want to debug from this page (under **Inspectable pages**).

    Note that the name of the WDC is based on the title of the web page that was loaded for the WDC.

    ![Remote Debugging]({{site.baseurl}}/assets/select_wdc_chrome_dbg.png){:height="50%" width="50%"}

1. When the Chrome debugger is connected, switch to the **Sources** tab and set a breakpoint (or breakpoints) in your WDC source code (for example, on the `getSchema` and `getData` methods).

1. Switch back to Tableau and interact with the WDC. The WDC will run until it hits the breakpoint.  

1. Switch back to the Chrome browser and use the developer tools to step through your source code, examine variables, and watch the Console for messages.

    ![]({{site.baseurl}}/assets/wdc_chrome_source_breakpoint.png){:height="75%" width="75%"}

---

### Debug your WDC initial startup code

If you want to debug the initial startup of your WDC, you can set an Event Listener Breakpoint to break on the first statement whenever a JavaScript file is loaded. Then you can open the WDC home page in Tableau and connect the debugger. When you load your WDC, the debugger will break on the first module.

1. Start Tableau in debugging mode and open the Web Data Connector dialog box.

1. Switch to the the Chrome browser and use the developer tools (`localhost:9000`) and select the WDC Home page.

    ![]({{site.baseurl}}/assets/select_wdc_home_chrome_dbg.png){:height="50%" width="50%"}

1. Click the **Sources** pane in the debugger, and then click **Event Listener Breakpoints**. Under **Script**, select **Script First Statement**.

    ![]({{site.baseurl}}/assets/chrome_breakpoint_script.png){:height="25%" width="25%"}

1. Go back to Tableau and enter the URL for your WDC. When the WDC loads, the debugger will break on the first module of your source code. Use the Chrome Developer Tools to step through the start up code.

---

## Debugging a WDC in Tableau Desktop 2019.3 (and earlier) {#debugging-tableau}

Tableau Desktop includes a built-in debugger that you can use to test your connectors. Use the built-in debugger when
you encounter differences that you cannot debug in the simulator.

**Important**:

* The built-in debugger only runs on Windows.
* It is provided as-is and without official support by Tableau.
* The debugger communicates with Tableau Desktop synchronously and therefore might appear unresponsive at times.

To run the built-in debugger, complete the following steps:

1. Open a command prompt.

1. Navigate to the Tableau Desktop directory.

   ```
   cd "C:\Program Files\Tableau\Tableau <version>\bin\"
   ```

1. Run Tableau Desktop with the debugging flag:

   ```
   tableau.exe -DDebugWDC
   ```

1. Connect to a web data connector.

1. Interact with your connector and start the data gathering phase.

   The built-in debugger loads.

1. The first time that you use the debugger, click the **Sources** tab, select **Always enable**, and click **Enable
   Debugging**.

   ![Enable debugging on the Sources tab.]({{ site.baseurl }}/assets/debugger_enable.png)

1. Click the **Show sources** button to display a list of the files used in your connector.

   ![View source files.]({{ site.baseurl }}/assets/debugger_show_sources.png)

1. Select a file to open it.

1. To set a breakpoint, click on a line number.

1. Press F8 to continue running your connector.

   ![Use breakpoints to debug your connector.]({{ site.baseurl }}/assets/debugger_breakpoint.png)


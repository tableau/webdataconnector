---
title: Get Started
layout: docs
---

Create a Web Data Connector (WDC) when you want to connect to a web data source from Tableau. A WDC is an HTML page
with JavaScript code that connects to web data (for example, by means of a REST API), converts the data to a JSON format,
and passes the data to Tableau.

<div class="alert alert-info">
    <b>Note:</b> This site is for version 2.x of the WDC, which is compatible only with Tableau 10.0 and later. For
    information about version 1 of the WDC for use with earlier versions of Tableau, see the archived <a href="http://onlinehelp.tableau.com/v9.3/api/wdc/en-us/help.htm" style="text-decoration:underline;">documentation</a>
    and <a href="https://github.com/tableau/webdataconnector/releases/tag/v1.1.0" style="text-decoration:underline;">simulator</a>.  
</div>

-----

**Upgrading from WDC version 1.x**
 
If you have connectors that were created using WDC version 1.x, those connectors will continue to work in future versions of Tableau. However, if you want to update the connectors to use the features available in version 2.x of the WDC, you will need to update the connector to use the new API. For information about updating your connectors, see [Upgrading from WDC Version 1.x]({{ site.baseurl }}\docs\wdc_upgrade).


-----

This section will guide you through the process of setting up your development environment and running the sample WDCs
in the simulator.

* TOC
{:toc}

### Confirm prerequisites

You're going to need a couple of things before we get started. Make sure you have the following dependencies installed:

* [Git](https://git-scm.com/downloads)
* [node and npm](https://nodejs.org/en/download/)

### Get the WDC SDK

1. Open a terminal in the directory where you want to download the WDC SDK.  Then run the following command to clone
   the WDC git repository:

   ```
   git clone https://github.com/tableau/webdataconnector.git
   ```

1. Change to the directory where you downloaded the repository:

   ```
   cd webdataconnector
   ```

### Run the simulator

1. Install dependencies with `npm`:

   ```
   npm install --production
   ```

   **Note**: You must run the command with administrator or sudo privileges.

1. Start the test web server:

   ```
   npm start
   ```

1. Open a browser and navigate to the following URL:


   ```
   http://localhost:8888/Simulator/index.html
   ```

   The WDC simulator appears.

   ![]({{ site.baseurl }}/assets/wdc_simulator_new_first_open.png)

**Note**: The `npm start` command also starts a test proxy server on port 8889 that you can route requests through in order to
circumvent Cross Origin Resource Sharing (CORS) restrictions. For more information, see
[Working with CORS]({{ site.baseurl }}/docs/wdc_cors).

### Try the sample WDCs

1. In the WDC URL field, confirm that the URL is set to the sample USGS
   Earthquake Data connector:

   ```
   ../Examples/html/earthquakeUSGS.html
   ```

   Alternatively, look in the Examples directory for more sample connectors.

1. Click the **Start Interactive Phase** button to display the user interface for the earthquake WDC.

1. Click the **Get Earthquake Data** button.

1. Click the **Fetch Table Data** button to download the data and display it in a table.


*Ready to make your own connector? Jump to the [WDC Tutorial]({{ site.baseurl }}/docs/wdc_tutorial).*
